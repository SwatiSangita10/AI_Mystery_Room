import 'dotenv/config';

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 5000),
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  mongoUri: process.env.MONGODB_URI || '',
  geminiKey: process.env.GEMINI_API_KEY || '',
  geminiModel: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
  sessionSecret: process.env.SESSION_SECRET || 'development-only-change-me'
};

if (env.nodeEnv === 'production' && (!process.env.SESSION_SECRET || !env.mongoUri || !env.geminiKey)) {
  throw new Error('Production requires SESSION_SECRET, MONGODB_URI, and GEMINI_API_KEY.');
}
