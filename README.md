# AI Mystery Room

A scenario-driven mystery game built with React, Vite, Express, MongoDB/Mongoose, and Google Gemini. The app includes a deterministic fictional demo case when Gemini is not configured, so the complete investigation flow can be explored locally.

## Run locally

1. Install Node.js 20 or newer.
2. Run `npm install` from the repository root.
3. Copy `.env.example` to `.env`. Set `SESSION_SECRET`; add `MONGODB_URI` and `GEMINI_API_KEY` to enable MongoDB persistence and Gemini generation.
4. Run `npm run dev` and open `http://localhost:5173`.

Without `MONGODB_URI`, the server uses in-memory storage (data resets when it restarts). Without `GEMINI_API_KEY`, it serves a clearly labeled, fixed fictional sample mystery. Production deployments require MongoDB, a strong session secret, and Gemini credentials. Images use generated visual placeholders until an image provider and object storage are configured.

The API is under `/api/v1`; `GET /health` reports service status. See `spec.md` for the complete product requirements.
