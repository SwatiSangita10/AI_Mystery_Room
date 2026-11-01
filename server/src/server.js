import mongoose from 'mongoose';
import { app } from './app.js';
import { env } from './config/env.js';

if (env.mongoUri) {
  try { await mongoose.connect(env.mongoUri); console.log('database_connected'); }
  catch (error) { console.error('database_connection_failed', error.message); process.exit(1); }
} else if (env.nodeEnv === 'production') {
  throw new Error('MONGODB_URI is required in production.');
}

app.listen(env.port, () => console.log(`AI Mystery Room API listening on ${env.port}`));
