import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { randomBytes } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { z } from 'zod';
import { env } from './config/env.js';
import { generateMystery, toPublicCase } from './services/generator.js';
import { saveCase, getCase, createSession, getSession, updateSession, storageMode } from './services/store.js';

export const app = express();
app.disable('x-powered-by');
app.use(cors({ origin: env.clientOrigin, credentials: true }));
app.use(express.json({ limit: '32kb' }));
app.use('/api/v1/cases', rateLimit({ windowMs: 60_000, limit: 5, standardHeaders: true, legacyHeaders: false }));
const jobs = new Map();
const sendError = (res, status, code, message) => res.status(status).json({ success: false, error: { code, message } });
const bearer = (req) => req.get('authorization')?.replace(/^Bearer\s+/i, '') || '';

app.get('/health', (_req, res) => res.json({ status: 'ok', storage: storageMode, ai: Boolean(env.geminiKey) }));
app.post('/api/v1/cases', async (req, res) => {
  const parsed = z.object({ scenario: z.string().trim().min(1).max(2000), title: z.string().trim().max(100).optional(), category: z.enum(['Theft','Disappearance','Sabotage','Locked-room mystery','General']).default('General'), difficulty: z.enum(['Easy','Medium','Hard']).default('Medium') }).safeParse(req.body);
  if (!parsed.success) return sendError(res, 400, 'INVALID_SCENARIO', 'Enter a scenario of up to 2,000 characters and choose valid case options.');
  const jobId = randomBytes(12).toString('hex');
  jobs.set(jobId, { status: 'queued', createdAt: Date.now() });
  res.status(202).json({ success: true, data: { jobId, status: 'queued' } });
  (async () => {
    const job = jobs.get(jobId); job.status = 'generating_case';
    try {
      const generated = await generateMystery(parsed.data);
      job.status = 'validating_case';
      const publicData = { summary: generated.summary, setting: generated.setting, timeline: generated.timeline, suspects: generated.suspects, evidence: generated.evidence };
      const item = await saveCase({ title: parsed.data.title || generated.title, scenario: parsed.data.scenario, category: parsed.data.category, difficulty: parsed.data.difficulty, status: 'ready', demoMode: Boolean(generated._demo), publicData, solution: generated.solution, generationVersion: '1.0.0' });
      job.caseId = String(item._id); job.status = 'ready'; job.demo = Boolean(generated._demo);
    } catch (error) {
      console.error('case_generation_failed', { jobId, message: error.message });
      job.status = 'failed'; job.message = 'Case generation failed. Please try again.';
    }
  })();
});
app.get('/api/v1/cases/:caseId', async (req, res) => {
  const job = jobs.get(req.params.caseId);
  if (job) {
    if (job.status !== 'ready') return res.json({ success: true, data: { status: job.status, message: job.message } });
    const item = await getCase(job.caseId);
    return res.json({ success: true, data: { status: 'ready', demo: job.demo, case: toPublicCase(item) } });
  }
  const item = await getCase(req.params.caseId);
  if (!item) return sendError(res, 404, 'CASE_NOT_FOUND', 'This case could not be found.');
  return res.json({ success: true, data: { status: 'ready', case: toPublicCase(item) } });
});
app.get('/api/v1/cases/:caseId/suspects', async (req, res) => {
  const item = await getCase(req.params.caseId); if (!item) return sendError(res, 404, 'CASE_NOT_FOUND', 'This case could not be found.');
  res.json({ success: true, data: item.publicData.suspects });
});
app.get('/api/v1/cases/:caseId/evidence', async (req, res) => {
  const item = await getCase(req.params.caseId); if (!item) return sendError(res, 404, 'CASE_NOT_FOUND', 'This case could not be found.');
  res.json({ success: true, data: item.publicData.evidence });
});
app.get('/api/v1/cases/:caseId/evidence/:evidenceId', async (req, res) => {
  const item = await getCase(req.params.caseId); const evidence = item?.publicData.evidence.find(e => e.id === req.params.evidenceId);
  if (!evidence) return sendError(res, 404, 'EVIDENCE_NOT_FOUND', 'This evidence could not be found.');
  res.json({ success: true, data: evidence });
});
app.post('/api/v1/sessions', async (req, res) => {
  const parsed = z.object({ caseId: z.string().min(1) }).safeParse(req.body);
  if (!parsed.success) return sendError(res, 400, 'INVALID_CASE', 'A valid case ID is required.');
  const item = await getCase(parsed.data.caseId); if (!item) return sendError(res, 404, 'CASE_NOT_FOUND', 'This case could not be found.');
  const token = randomBytes(32).toString('base64url'); const session = await createSession(parsed.data.caseId, token);
  res.status(201).json({ success: true, data: { id: String(session._id), token, caseId: String(session.caseId), status: session.status, viewedEvidenceIds: [], notes: '' } });
});
app.get('/api/v1/sessions/:sessionId', async (req, res) => {
  const session = await getSession(req.params.sessionId, bearer(req)); if (!session) return sendError(res, 401, 'UNAUTHORIZED', 'Session access could not be verified.');
  res.json({ success: true, data: { id: String(session._id), caseId: String(session.caseId), status: session.status, viewedEvidenceIds: session.viewedEvidenceIds, notes: session.notes, accusation: session.accusation } });
});
app.patch('/api/v1/sessions/:sessionId/progress', async (req, res) => {
  const body = z.object({ viewedEvidenceIds: z.array(z.string()).max(100).optional(), notes: z.string().max(5000).optional() }).safeParse(req.body);
  if (!body.success) return sendError(res, 400, 'INVALID_PROGRESS', 'Progress data was invalid.');
  const session = await getSession(req.params.sessionId, bearer(req)); if (!session) return sendError(res, 401, 'UNAUTHORIZED', 'Session access could not be verified.');
  if (session.status !== 'active') return sendError(res, 409, 'SESSION_CLOSED', 'This investigation is already resolved.');
  const item = await getCase(String(session.caseId));
  const validIds = new Set(item.publicData.evidence.map(e => e.id));
  const viewedEvidenceIds = body.data.viewedEvidenceIds?.filter(id => validIds.has(id)) ?? session.viewedEvidenceIds;
  const updated = await updateSession(req.params.sessionId, bearer(req), { viewedEvidenceIds, ...(body.data.notes !== undefined ? { notes: body.data.notes } : {}) });
  res.json({ success: true, data: { viewedEvidenceIds: updated.viewedEvidenceIds, notes: updated.notes } });
});
app.post('/api/v1/sessions/:sessionId/accusation', async (req, res) => {
  const parsed = z.object({ suspectId: z.string().min(1) }).safeParse(req.body); if (!parsed.success) return sendError(res, 400, 'INVALID_ACCUSATION', 'Choose a suspect before submitting.');
  const session = await getSession(req.params.sessionId, bearer(req)); if (!session) return sendError(res, 401, 'UNAUTHORIZED', 'Session access could not be verified.');
  if (session.status !== 'active') return sendError(res, 409, 'ALREADY_RESOLVED', 'A final accusation has already been submitted.');
  const item = await getCase(String(session.caseId));
  if (!item.publicData.suspects.some(s => s.id === parsed.data.suspectId)) return sendError(res, 400, 'INVALID_SUSPECT', 'That suspect is not part of this case.');
  const correct = parsed.data.suspectId === item.solution.culpritSuspectId;
  await updateSession(req.params.sessionId, bearer(req), { status: 'resolved', accusation: { suspectId: parsed.data.suspectId, correct }, resolvedAt: new Date() });
  res.json({ success: true, data: { correct, culprit: item.publicData.suspects.find(s => s.id === item.solution.culpritSuspectId), solution: item.solution, evidence: item.publicData.evidence.filter(e => item.solution.decisiveEvidenceIds.includes(e.id)) } });
});
app.get('/api/v1/sessions/:sessionId/result', async (req, res) => {
  const session = await getSession(req.params.sessionId, bearer(req)); if (!session) return sendError(res, 401, 'UNAUTHORIZED', 'Session access could not be verified.');
  if (session.status !== 'resolved') return sendError(res, 409, 'NOT_RESOLVED', 'Submit your final accusation to see the case result.');
  const item = await getCase(String(session.caseId));
  res.json({ success: true, data: { correct: session.accusation.correct, culprit: item.publicData.suspects.find(s => s.id === item.solution.culpritSuspectId), solution: item.solution, evidence: item.publicData.evidence.filter(e => item.solution.decisiveEvidenceIds.includes(e.id)) } });
});

// Serve the Vite build from the same origin as the API in production.
if (env.nodeEnv === 'production') {
  const clientDist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../client/dist');
  app.use(express.static(clientDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) return next();
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

app.use((err, _req, res, _next) => { console.error('api_error', { message: err.message }); res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Something went wrong. Please try again.' } }); });
