import mongoose from 'mongoose';

const CaseSchema = new mongoose.Schema({
  title: { type: String, required: true }, scenario: String, category: String, difficulty: String,
  status: { type: String, default: 'ready' }, demoMode: { type: Boolean, default: false }, publicData: { type: mongoose.Schema.Types.Mixed, required: true },
  solution: { type: mongoose.Schema.Types.Mixed, required: true }, generationVersion: { type: String, default: '1.0.0' }
}, { timestamps: true });
const SessionSchema = new mongoose.Schema({
  caseId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'MysteryCase' },
  tokenHash: { type: String, required: true, unique: true }, viewedEvidenceIds: [String], notes: { type: String, default: '' },
  status: { type: String, enum: ['active', 'resolved', 'abandoned'], default: 'active' },
  accusation: { suspectId: String, correct: Boolean }, startedAt: { type: Date, default: Date.now }, resolvedAt: Date
}, { timestamps: true });
export const MysteryCase = mongoose.model('MysteryCase', CaseSchema);
export const GameSession = mongoose.model('GameSession', SessionSchema);
