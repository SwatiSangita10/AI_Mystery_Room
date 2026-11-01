import { createHash } from 'node:crypto';
import { MysteryCase, GameSession } from '../models/index.js';

const cases = new Map();
const sessions = new Map();
const memory = !process.env.MONGODB_URI;
const id = () => Math.random().toString(36).slice(2, 10);
const hash = (token) => createHash('sha256').update(token).digest('hex');

export async function saveCase(data) {
  if (memory) { const item = { _id: id(), ...data }; cases.set(item._id, item); return item; }
  return MysteryCase.create(data);
}
export async function getCase(caseId) { return memory ? cases.get(caseId) : MysteryCase.findById(caseId).lean(); }
export async function createSession(caseId, token) {
  const data = { caseId, tokenHash: hash(token), viewedEvidenceIds: [], notes: '', status: 'active' };
  if (memory) { const item = { _id: id(), ...data, startedAt: new Date() }; sessions.set(item._id, item); return item; }
  return GameSession.create(data);
}
export async function getSession(sessionId, token) {
  const session = memory ? sessions.get(sessionId) : await GameSession.findById(sessionId).lean();
  if (!session || session.tokenHash !== hash(token)) return null;
  return session;
}
export async function updateSession(sessionId, token, patch) {
  const session = await getSession(sessionId, token);
  if (!session) return null;
  if (memory) { Object.assign(session, patch); return session; }
  await GameSession.findByIdAndUpdate(sessionId, patch);
  return getSession(sessionId, token);
}
export const storageMode = memory ? 'memory' : 'mongodb';
