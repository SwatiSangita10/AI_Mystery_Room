# AI Mystery Room

A scenario-driven mystery game built with React, Vite, Express, MongoDB/Mongoose, and Google Gemini. The interface uses an archival paper, ink, and vermilion theme. A deterministic fictional sample case is available when Gemini is not configured.

## Run locally

1. Install Node.js 20 or newer.
2. Run `npm install` from the repository root.
3. Copy `.env.example` to `.env`. Set `SESSION_SECRET`; add `MONGODB_URI` and `GEMINI_API_KEY` to enable MongoDB persistence and Gemini generation.
4. Run `npm run dev` and open `http://localhost:5173`.

Without `MONGODB_URI`, the server uses in-memory storage (data resets when it restarts). Without `GEMINI_API_KEY`, it serves a clearly labeled, fixed fictional sample mystery. Images use generated visual placeholders until an image provider and object storage are configured.

## Deploy to Railway (single web service)

This repo builds the Vite client and serves it from the Express server, so the browser app and `/api/v1` API share one origin.

1. Push this project to a GitHub repository. Keep `.env` out of Git; `.gitignore` already excludes it. Do not commit API keys.
2. Create a MongoDB database in MongoDB Atlas. Add a database user, allow network access from Railway (Atlas IP allowlisting may require `0.0.0.0/0` for a hosted service), and copy the application's connection URI. Replace the password placeholder and URL-encode special characters in credentials.
3. Create a Google Gemini API key in Google AI Studio.
4. In Railway, create a project and choose **Deploy from GitHub repo**, then select this repository. Railway detects the root `package.json` workspaces. Set the build command to `npm run build` and the start command to `npm start` if Railway does not detect them automatically.
5. Add these variables in the Railway service's **Variables** panel:
   - `NODE_ENV` = `production`
   - `SESSION_SECRET` = a long random secret (generate one locally; do not reuse the development value)
   - `MONGODB_URI` = your Atlas connection URI
   - `GEMINI_API_KEY` = your Gemini key
   - `GEMINI_MODEL` = `gemini-2.5-flash` (optional)
6. Deploy. In the service's **Networking** settings, generate a public domain. Open it and confirm the landing page loads.
7. Visit `https://YOUR-DOMAIN/health`; expect JSON with `status: "ok"`, `storage: "mongodb"`, and `ai: true`. Create a case to check generation and persistence end to end.
8. If using a custom domain, add it in Railway's **Networking** settings and point the DNS records Railway provides. The app's frontend and API remain on the same domain, so `VITE_API_BASE_URL` and `CLIENT_ORIGIN` need no production value.

Railway supplies `PORT` automatically. The server requires MongoDB, Gemini, and a strong session secret when `NODE_ENV=production`. The default deployment is one Express service; it avoids cross-origin API configuration. Keep the API key and database URI in the hosting provider's secret variables, never in frontend `VITE_*` variables.

The API is under `/api/v1`; `GET /health` reports service status. See `spec.md` for the complete product requirements.
