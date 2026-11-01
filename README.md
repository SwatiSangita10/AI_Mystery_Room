# AI Mystery Room

A scenario-driven mystery game built with React, Vite, Express, MongoDB/Mongoose, and Google Gemini. The interface uses an archival paper, ink, and vermilion theme. A deterministic fictional sample case is available locally when Gemini is not configured.

## Run locally

1. Install Node.js 20 or newer.
2. Run `npm install` from the repository root.
3. Copy `.env.example` to `.env`. Set `SESSION_SECRET`; add `MONGODB_URI` and `GEMINI_API_KEY` to enable MongoDB persistence and Gemini generation.
4. Run `npm run dev` and open `http://localhost:5173`.

Without `MONGODB_URI`, the server uses in-memory storage (data resets when it restarts). Without `GEMINI_API_KEY`, it serves a clearly labeled, fixed fictional sample mystery. Images use generated visual placeholders until an image provider and object storage are configured.

## Deploy to Render

The repository includes a `render.yaml` Blueprint. It builds the Vite frontend and serves it from Express alongside `/api/v1`, using one Render Web Service and one domain.

1. Push the project to a GitHub repository. Keep `.env` out of Git and never commit API keys; `.gitignore` already excludes `.env`.
2. Set up MongoDB Atlas: create a cluster, create a database user, and configure Network Access to allow your Render service. For a straightforward setup, Atlas may require allowing `0.0.0.0/0`; use a strong database password and restrict access where your setup permits. Copy the MongoDB connection URI, replacing its password placeholder and URL-encoding special characters in credentials.
3. Create a Google Gemini API key in Google AI Studio.
4. In the Render Dashboard, choose **New → Blueprint**, connect the GitHub repository, and select the branch containing `render.yaml`. Review the proposed `ai-mystery-room` Web Service and apply the Blueprint.
5. Render will generate `SESSION_SECRET` and prompt for `MONGODB_URI` and `GEMINI_API_KEY`. Enter the Atlas URI and Gemini key when prompted. `NODE_ENV`, `GEMINI_MODEL`, build command, start command, and `/health` check are declared in `render.yaml`.
6. Wait for the first deploy to finish. Open the service's `onrender.com` URL and confirm the landing page loads.
7. Open `https://YOUR-SERVICE.onrender.com/health`. Confirm the response reports `status: "ok"`, `storage: "mongodb"`, and `ai: true`. Then create a mystery and complete an investigation to verify case generation and saved progress.
8. For a custom domain, open the service's **Settings → Custom Domains**, add the domain, and follow Render's DNS instructions. Frontend and API share the domain, so no `VITE_API_BASE_URL` or `CLIENT_ORIGIN` production setting is needed.

The Blueprint uses Render's Free plan to make the initial deployment easy to try. Free web services spin down after 15 minutes without requests and can take about a minute to start again; their local filesystem is ephemeral. Case and session records are stored in MongoDB, but an in-progress generation job is held in server memory and can be lost if the service restarts. For a more reliable always-on experience, change `plan: free` to a paid plan in `render.yaml` or the Render Dashboard. Render supplies `PORT` automatically. Production requires MongoDB, Gemini, and a strong session secret. Keep API keys and the database URI in Render's secret environment variables, never in frontend `VITE_*` variables.

The API is under `/api/v1`; `GET /health` reports service status. See `spec.md` for the complete product requirements.
