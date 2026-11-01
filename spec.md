# AI Mystery Room — Project Specification (SPEC.md)

**Document Version:** 1.0.0  
**Project Name:** AI Mystery Room  
**Development Approach:** Spec-Driven Development  
**Document Status:** Initial MVP Specification  
**Last Updated:** October 2026

---

## 1. Project Overview

AI Mystery Room is an AI-powered interactive mystery-solving web application that allows users to create and investigate fictional mysteries based on their own scenarios or stories.

The user provides a short scenario, and the AI generates a complete fictional investigation containing suspects, motives, timelines, witness statements, clues, and a predetermined culprit.

The application presents evidence through different formats, including fictional chat screenshots, photographs, CCTV-style recordings, documents, and witness statements. Users analyze the available evidence, connect clues, identify contradictions, and select the person they believe is responsible.

After the user submits their final accusation, the system evaluates their answer and reveals the culprit along with a detailed explanation supported by the evidence.

The application combines generative AI, interactive storytelling, detective gameplay, and logical reasoning into a single web experience.

### 1.1 Project Vision

To create an immersive AI-powered detective experience where every user can turn an idea into a playable mystery and solve it through investigation, observation, and logical deduction.

### 1.2 Core Concept

The application follows this basic workflow:

1. The user submits a short story or scenario.
2. The backend sends the scenario and generation instructions to Gemini.
3. Gemini generates a structured mystery with suspects, motives, timelines, clues, and one predetermined culprit.
4. The backend validates the mystery for consistency and solvability.
5. The system generates or prepares the required visual and text-based evidence.
6. The user enters the investigation room and examines the evidence.
7. The user selects a suspect and submits a final accusation.
8. The backend checks the accusation against the stored solution.
9. The application reveals the verdict, culprit, and explanation.

The culprit and the underlying solution must be established before the investigation becomes playable. They must not change during the investigation.

---

## 2. Target Audience

The primary target audience includes:

- People who enjoy detective stories and mystery-solving games.
- Fans of crime fiction, escape rooms, and investigation games.
- Students and young adults interested in interactive AI experiences.
- Casual gamers who enjoy puzzles and logical reasoning.
- Users who want to create personalized fictional mysteries using AI.

The application should be intuitive enough for beginners while providing enough investigative depth to engage experienced puzzle enthusiasts.

---

## 3. Product Goals

The main goals of AI Mystery Room are:

1. Allow users to generate personalized mysteries from their own scenarios.
2. Create internally consistent fictional investigations using Gemini.
3. Provide engaging, varied, and believable fictional evidence.
4. Enable users to examine suspects, compare statements, and discover contradictions.
5. Ensure every mystery has one predetermined culprit and a defensible solution.
6. Provide an interactive accusation and case-resolution experience.
7. Maintain mystery consistency across all clues, suspects, and timelines.
8. Deliver a responsive, accessible, and visually immersive interface.
9. Protect the solution from being exposed before the player submits an accusation.
10. Build a modular application that can support future features without major architectural changes.

---

## 4. Scope of the Initial Version (MVP)

### 4.1 Included Features

The initial version must include:

- Landing page with a clear introduction and call to action.
- Scenario submission form.
- Mystery category and difficulty selection.
- AI-powered mystery generation.
- Structured suspect profiles.
- AI-generated or programmatically rendered evidence.
- Evidence gallery and evidence-detail viewer.
- Fictional chat and messaging evidence.
- Photographic evidence.
- CCTV-style still images or simulated recordings.
- Documents, timelines, and witness statements.
- Interactive investigation room.
- Suspect selection and final accusation.
- Correct or incorrect verdict.
- Culprit reveal and evidence-based explanation.
- Basic game-session persistence.
- Loading indicators, validation, and error handling.
- Responsive desktop, tablet, and mobile layouts.

### 4.2 Out of Scope for the Initial Version

The following features are not required for the MVP:

- Multiplayer investigations.
- Real-time collaborative investigation.
- Public case marketplace.
- Community-created and shared mysteries.
- Leaderboards and competitive rankings.
- Subscription plans and payment integration.
- Advanced user profiles and social features.
- Real CCTV integrations or real surveillance footage.
- Access to actual WhatsApp accounts or private conversations.
- Real police databases or government investigation systems.
- Real-world criminal identification or accusation.
- Fully AI-generated long-form video for every clue.
- Advanced administrator dashboard.
- Native Android or iOS applications.

These features may be considered in future versions after the core investigation experience is stable.

---

## 5. Technology Stack

### 5.1 Frontend

**Framework:** React.js  
**Build Tool:** Vite  
**Routing:** React Router  
**Styling:** Tailwind CSS or CSS Modules  
**HTTP Client:** Fetch API or Axios  
**State Management:** React Context and hooks initially; a dedicated state library may be introduced if necessary.

Responsibilities:

- Render the user interface.
- Collect scenario input.
- Display case details and suspect profiles.
- Render evidence galleries and detail views.
- Manage navigation and local interface state.
- Display generation progress and errors.
- Submit accusations through the backend API.
- Display the final result after backend verification.

The frontend must not contain private AI credentials or independently determine the correct culprit.

### 5.2 Backend

**Runtime:** Node.js  
**Framework:** Express.js  
**Language:** JavaScript using ES modules initially  
**API Style:** REST API  
**Validation:** Zod or an equivalent schema-validation library  
**Database ODM:** Mongoose

Responsibilities:

- Validate incoming requests.
- Generate and manage mysteries.
- Integrate with Gemini.
- Validate AI-generated structured output.
- Manage evidence-generation jobs.
- Store cases, evidence metadata, assets, and game sessions.
- Protect the hidden solution.
- Evaluate accusations.
- Handle retries, errors, and rate limits.
- Enforce authorization and session ownership.

### 5.3 Database

**Database:** MongoDB  
**Recommended Hosting:** MongoDB Atlas

The database stores:

- Mystery cases.
- Public case information.
- Private solutions.
- Suspect profiles.
- Evidence metadata.
- Asset references.
- Game sessions.
- Accusation results.
- Generation status and timestamps.

Use Mongoose models and validation to maintain data consistency.

Large image and video files must be stored in object storage rather than directly inside MongoDB documents.

### 5.4 AI Integration

**Primary AI Provider:** Google Gemini

Gemini will be used for:

- Mystery and story generation.
- Suspect creation.
- Motive and alibi generation.
- Investigation timeline generation.
- Evidence text generation.
- Mystery consistency review.
- Optional hints.
- Post-investigation explanations.

Use the official Google Gen AI SDK and a supported Gemini model configured through environment variables.

Actual visual assets must be generated using an image-capable model or a separate image-generation service. Do not assume that every Gemini model supports image generation or video generation.

For the initial version, CCTV-style evidence may use AI-generated still images and simulated recordings rather than full video generation.

### 5.5 Image and Asset Storage

**Recommended Approach:** S3-compatible object storage or another managed asset-storage service.

Responsibilities:

- Store generated photographs and visual evidence.
- Store suspect portraits.
- Store generated document images where needed.
- Provide secure asset URLs.
- Maintain asset metadata and generation status.

The selected provider must be configured before production deployment.

### 5.6 Development Tools

- Visual Studio Code for development.
- Git for version control.
- GitHub for repository hosting.
- Postman or an equivalent tool for API testing.
- ESLint and Prettier for code quality.
- Vitest or Jest for automated tests.
- Supertest for backend API tests.
- React Testing Library for frontend component tests.
- MongoDB Compass for database inspection.
- Environment variables for configuration and secrets.

Exact dependency versions must be pinned in `package.json` and the lockfile.

---

## 6. Functional Requirements

### FR-01: Landing Page

The application must provide a landing page that explains the product and introduces the mystery-solving experience.

The page must contain:

- Application name and navigation.
- Hero section.
- Short product description.
- Start Investigation button.
- How It Works section.
- Feature overview.
- Footer.

The primary call to action must navigate to the scenario creation page.

### FR-02: Scenario Creation

The user must be able to submit a short fictional scenario.

Required input:

- Scenario description.

Optional inputs:

- Case title.
- Mystery category.
- Difficulty level.

Initial validation rules:

- Scenario cannot be empty.
- Maximum scenario length is 2,000 characters.
- Leading and trailing whitespace must be removed.
- Invalid requests must display clear validation messages.
- User input must be treated as untrusted content.

The default mystery difficulty must be Medium.

### FR-03: Mystery Categories

The initial application should support:

- Theft.
- Disappearance.
- Sabotage.
- Locked-room mystery.
- General fictional mystery.

A fictional homicide category may be supported where appropriate, with non-graphic content and fictionalized characters.

Category selection must influence the generated story and evidence without overriding the core consistency requirements.

### FR-04: Difficulty Levels

The application must support three difficulty levels.

| Difficulty | Suspects | Evidence Items |
|---|---:|---:|
| Easy | 3 | 5–7 |
| Medium | 4–5 | 8–12 |
| Hard | 5–6 | 12–16 |

These values are initial generation targets. The backend must validate the final counts and ensure the mystery is solvable at the selected difficulty.

Easy mysteries should use more direct clues. Medium mysteries should include contradictions and connected clues. Hard mysteries may include more indirect clues and plausible red herrings.

### FR-05: AI Mystery Generation

The backend must send the user's scenario and generation parameters to Gemini.

The generated mystery must contain:

- Case title.
- Case summary.
- Fictional setting.
- Incident timeline.
- Suspect profiles.
- Motives and alibis.
- Evidence items.
- One predetermined culprit.
- Decisive evidence identifiers.
- Private solution explanation.
- Consistency-validation information.

The AI must return structured JSON conforming to the application's defined schema.

The backend must validate the response before storing or publishing the case.

### FR-06: Mystery Validation

Before a case becomes playable, the backend must verify:

- Exactly one culprit is assigned.
- Every suspect has a unique identifier.
- Every evidence item has a unique identifier.
- All referenced suspect and evidence IDs exist.
- The solution references valid evidence.
- The timeline and alibis are logically consistent.
- The clues provide sufficient support for the intended answer.
- The case meets the selected difficulty requirements.
- The public data does not contain the private solution.

If validation fails, the backend may request a bounded repair or regeneration attempt.

A case that remains invalid must not be published.

### FR-07: Suspect Profiles

Each suspect must have:

- Unique suspect ID.
- Name.
- Fictional role.
- Character description.
- Possible motive.
- Public alibi or statement, where relevant.
- Portrait or placeholder asset, where available.

Suspect profiles must be accessible from the investigation room.

The frontend must not display private solution information in suspect cards or profile responses.

### FR-08: Evidence Generation

The application must support multiple evidence types.

**Photographic evidence**

- Fictional locations.
- Objects and physical clues.
- Scene details.
- Relevant visual contradictions.

**Chat evidence**

- Fictional messaging conversations.
- Sender names.
- Message text.
- Timestamps.
- Relevant conversation details.

**CCTV-style evidence**

- AI-generated surveillance-style images.
- Timestamps and location labels.
- Simulated video playback for still frames or sequences.

**Documentary evidence**

- Witness statements.
- Fictional reports.
- Notes and letters.
- Receipts and access logs.

Every evidence item must belong to a specific case and use a stable evidence ID.

Generated evidence must agree with the canonical case timeline and facts.

### FR-09: Investigation Room

The investigation room must contain:

- Case title and summary.
- Difficulty indicator.
- Suspect section.
- Evidence gallery.
- Evidence categories or filters.
- Evidence-detail viewer.
- Investigation timeline.
- Optional player notes.
- Final accusation interface.

Users must be able to revisit previously viewed evidence.

The interface must distinguish unavailable assets from missing evidence and must provide a safe fallback for non-critical visual failures.

### FR-10: Evidence Viewer

Users must be able to open an evidence item and inspect its available content.

The viewer must support:

- Image preview.
- Chat transcript display.
- Document display.
- Timestamp and location information.
- Evidence description.
- Relevant suspect references, when appropriate.

Evidence descriptions must not reveal the answer directly.

The viewer must work on desktop and mobile devices.

### FR-11: Final Accusation

Users must be able to select one suspect and submit a final accusation.

The backend must:

1. Authenticate or authorize the game session.
2. Confirm the session is active.
3. Verify that the suspect belongs to the current case.
4. Compare the selected suspect ID with the stored culprit ID.
5. Store the result.
6. Mark the session as resolved.
7. Return the verdict and permitted result details.

Only one final accusation is allowed per session in the MVP.

The frontend must not determine the verdict independently.

### FR-12: Case Resolution

After the final accusation, the application must reveal:

- Whether the accusation was correct.
- The actual culprit.
- The culprit's motive.
- The explanation of how the incident occurred.
- The decisive evidence.
- How the relevant clues support the conclusion.
- An option to start another mystery.

The explanation must refer to evidence that actually exists in the generated case.

The stored culprit and solution must remain unchanged during resolution.

### FR-13: Game Session Persistence

The application must preserve basic investigation progress.

Persisted information should include:

- Case ID.
- Session ID.
- Viewed evidence IDs.
- Optional notes.
- Session status.
- Final accusation.
- Resolution result.

Refreshing the page must not reset an active or completed session.

Anonymous sessions must use a secure session credential or equivalent authorization mechanism. A session ID alone must not grant access to another player's session.

### FR-14: Hints

Optional hints may be supported as a future enhancement.

Hints must:

- Refer to actual evidence in the current case.
- Help the player reason without immediately revealing the culprit.
- Avoid introducing new facts.
- Never modify the stored solution.

### FR-15: Restart Investigation

Users must be able to start a new investigation.

Restarting must create a new case or a new session according to the chosen product behavior. Existing completed results must not be silently overwritten.

### FR-16: Error Handling

The application must handle:

- Invalid input.
- AI provider timeouts.
- Invalid AI-generated JSON.
- Inconsistent cases.
- Image-generation failures.
- Database errors.
- Network interruptions.
- Unauthorized session access.
- Duplicate accusations.
- Rate-limit errors.

Error messages must be clear and user-friendly. Sensitive implementation details must not be exposed.

---

## 7. AI Generation and Consistency Rules

The AI generation pipeline must follow this order:

1. Validate the scenario.
2. Generate the complete structured mystery.
3. Establish the culprit and private solution.
4. Validate the generated schema.
5. Validate the timeline and clue references.
6. Review logical consistency and solvability.
7. Generate visual assets.
8. Validate asset references and required clue availability.
9. Save the complete case.
10. Mark the case as ready.

The system must not reveal a case before it passes the required validation checks.

The backend should use bounded retries. An initial policy of two repair attempts after the first generation attempt is recommended.

Once a case is published, its facts and solution must remain fixed.

Gemini may assist with explanations, hints, or validation, but the backend remains responsible for state transitions, access control, and final answer evaluation.

---

## 8. Database Specification

### 8.1 MysteryCase

Stores the canonical mystery.

Required fields:

- `_id`
- `title`
- `scenario`
- `category`
- `difficulty`
- `status`
- `publicData`
- `solution`
- `generationVersion`
- `createdAt`
- `updatedAt`

The `solution` object must remain private and include:

- `culpritSuspectId`
- `motive`
- `method`
- `decisiveEvidenceIds`
- `reasoning`

### 8.2 Suspect

Stores suspect information either as embedded case data or in a separate collection.

Required fields:

- `id`
- `name`
- `role`
- `description`
- `motive`
- `alibi`
- `portraitAssetId`

Fields that are unavailable or irrelevant to a case may be omitted.

### 8.3 Evidence

Required fields:

- `id`
- `caseId`
- `type`
- `title`
- `description`
- `assetIds`
- `timestamp`
- `relatedSuspectIds`
- `publicContent`

Supported evidence types include:

- `image`
- `chat`
- `cctv`
- `document`
- `witness_statement`
- `timeline`

### 8.4 Asset

Required fields:

- `_id`
- `caseId`
- `type`
- `storageKey`
- `mimeType`
- `status`
- `createdAt`

Asset metadata must be stored separately from the actual binary file.

### 8.5 GameSession

Required fields:

- `_id`
- `caseId`
- `userId` or anonymous-session reference
- `viewedEvidenceIds`
- `notes`
- `status`
- `accusation`
- `startedAt`
- `resolvedAt`

Session status values:

- `active`
- `resolved`
- `abandoned`

Use appropriate MongoDB indexes and database-level constraints wherever possible.

---

## 9. Backend API Specification

Base URL path: `/api/v1`

All API requests and responses must use JSON except where a different content type is explicitly required.

### Case APIs

- `POST /cases` — Create a mystery generation job.
- `GET /cases/:caseId` — Retrieve public case details.
- `GET /cases/:caseId/suspects` — Retrieve public suspect profiles.
- `GET /cases/:caseId/evidence` — List public evidence.
- `GET /cases/:caseId/evidence/:evidenceId` — Retrieve an evidence item.
- `POST /cases/:caseId/hints` — Request a hint, if enabled.

### Session APIs

- `POST /sessions` — Start a game session.
- `GET /sessions/:sessionId` — Retrieve authorized session progress.
- `PATCH /sessions/:sessionId/progress` — Update progress and notes.
- `POST /sessions/:sessionId/accusation` — Submit a final accusation.
- `POST /sessions/:sessionId/restart` — Start a fresh session or reset through an approved flow.
- `GET /sessions/:sessionId/result` — Retrieve the result after resolution.

### System API

- `GET /health` — Return basic service health.

### API Requirements

- Validate all request bodies and path parameters.
- Return consistent success and error formats.
- Enforce authentication or session authorization.
- Prevent unauthorized access to private solutions.
- Apply rate limits to expensive operations.
- Use appropriate HTTP status codes.
- Never return raw provider errors or stack traces.

Case generation should be asynchronous. The creation endpoint should return a job or case ID and a generation status. The frontend should retrieve the status until the case becomes ready or fails.

---

## 10. Frontend UI/UX Requirements

### 10.1 Design Style

The application should use a cinematic detective-room aesthetic.

Recommended design:

- Dark charcoal backgrounds.
- High-contrast text.
- Amber or muted gold accents.
- Restrained crimson for suspicious or warning elements.
- Evidence cards with clear visual hierarchy.
- Modern typography.
- Subtle transitions and loading animations.
- Consistent spacing and reusable design tokens.

The design must remain readable and functional rather than sacrificing usability for atmosphere.

### 10.2 Required Pages

**Page 1: Landing Page**

- Navigation and application logo.
- Hero section.
- Product description.
- Start Investigation button.
- How It Works section.
- Feature highlights.
- Footer.

**Page 2: Create Mystery**

- Scenario input.
- Category selector.
- Difficulty selector.
- Input validation.
- Generate Mystery button.
- Generation progress state.

**Page 3: Investigation Room**

- Case overview.
- Suspect cards.
- Evidence gallery.
- Evidence detail viewer.
- Timeline.
- Optional notes panel.
- Accusation controls.

**Page 4: Case Resolution**

- Verdict.
- Culprit reveal.
- Solution explanation.
- Decisive evidence references.
- Restart or create another mystery option.

### 10.3 Responsive Design

The website must work on desktop, tablet, and mobile devices.

Requirements:

- Responsive layouts.
- Touch-friendly buttons.
- Resizable evidence images.
- Readable chat and document views.
- Accessible form controls.
- Visible keyboard focus.
- Semantic HTML.
- Appropriate color contrast.

### 10.4 UI States

Every major page must account for:

- Loading.
- Success.
- Empty content.
- Validation errors.
- Network failures.
- Generation failures.
- Unavailable assets.
- Completed investigation.

---

## 11. Project Folder Structure

Use a monorepo structure.

```text
ai-mystery-room/
├── client/
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── components/
│       │   ├── common/
│       │   ├── evidence/
│       │   ├── suspects/
│       │   └── investigation/
│       ├── pages/
│       ├── layouts/
│       ├── hooks/
│       ├── services/
│       ├── context/
│       ├── styles/
│       ├── utils/
│       ├── App.jsx
│       └── main.jsx
├── server/
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middleware/
│       ├── models/
│       ├── routes/
│       ├── services/
│       │   ├── gemini/
│       │   ├── mystery/
│       │   ├── evidence/
│       │   └── storage/
│       ├── validators/
│       ├── prompts/
│       ├── jobs/
│       ├── utils/
│       ├── app.js
│       └── server.js
├── shared/
│   └── schemas/
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── docs/
│   └── SPEC.md
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

The actual implementation may adjust internal filenames when necessary, but module responsibilities and security boundaries must remain consistent.

---

## 12. Security and Privacy Requirements

1. Store Gemini API keys only on the backend.
2. Keep all secrets out of GitHub and frontend bundles.
3. Validate user input and AI-generated output.
4. Enforce session ownership on every session operation.
5. Prevent MongoDB injection and unsafe content rendering.
6. Rate-limit scenario generation and hint requests.
7. Use HTTPS in production.
8. Configure CORS for approved frontend origins.
9. Apply secure cookie settings and CSRF protection where applicable.
10. Do not expose the culprit or solution before the final accusation.
11. Do not trust client-side verdict calculations.
12. Restrict asset access where appropriate.
13. Define data-retention and deletion policies.
14. Clearly label generated evidence as fictional.
15. Avoid fabricating evidence intended to accuse or implicate real individuals.

The server must be the source of truth for all case data, solution data, session state, and accusation results.

---

## 13. Error Handling and Reliability

The application must implement predictable behavior for failures.

| Failure | Expected behavior |
|---|---|
| Invalid scenario | Show validation feedback. |
| Gemini timeout | Retry within limits and then report failure. |
| Invalid JSON | Validate, repair, or reject the output. |
| Inconsistent mystery | Prevent publication. |
| Image generation failure | Retry or use an approved fallback if solvability is preserved. |
| Database failure | Return a controlled service error. |
| Network interruption | Preserve available progress and allow retry. |
| Unauthorized access | Reject the request. |
| Duplicate accusation | Reject the second submission. |
| Rate limit exceeded | Return a rate-limit response. |

Generation jobs should use explicit states:

`queued → generating_case → validating_case → generating_assets → ready`

A failed job must transition to `failed`.

Use idempotency controls so that repeated requests do not accidentally create duplicate cases or duplicate generation costs.

---

## 14. Non-Functional Requirements

### Performance

- Normal API reads should generally complete within 500 ms at the 95th percentile, excluding external provider and asset-generation latency.
- Target normal mystery generation completion within 90 seconds.
- Provide asynchronous progress updates for long-running operations.
- Optimize image delivery and frontend loading.

### Scalability

- Keep the Express API stateless where practical.
- Use shared persistent storage.
- Separate expensive AI generation jobs from ordinary API requests.
- Apply bounded concurrency and generation quotas.

### Maintainability

- Use modular frontend and backend components.
- Validate data with shared schemas where appropriate.
- Keep prompts version-controlled.
- Document API and database changes.
- Use consistent naming conventions.

### Reliability

- Handle external dependency failures gracefully.
- Preserve published solutions.
- Prevent duplicate accusations.
- Ensure game progress survives refreshes.

### Accessibility

- Support keyboard navigation.
- Provide accessible labels and image alt text.
- Maintain readable contrast.
- Avoid relying on color alone to convey important information.

### Observability

- Use structured logs and request IDs.
- Track generation failures and latency.
- Track external provider errors and quota usage.
- Never log API keys, session credentials, or unnecessary sensitive user content.

---

## 15. Environment Configuration

Use a root `.env.example` file to document the required environment variables.

```dotenv
NODE_ENV=development
PORT=5000
CLIENT_ORIGIN=http://localhost:5173

MONGODB_URI=

GEMINI_API_KEY=
GEMINI_MODEL=

IMAGE_PROVIDER_API_KEY=

ASSET_STORAGE_BUCKET=
ASSET_STORAGE_ACCESS_KEY=
ASSET_STORAGE_SECRET_KEY=

SESSION_SECRET=

VITE_API_BASE_URL=http://localhost:5000/api/v1
```

Important rules:

- `.env.example` must contain placeholders, never real secrets.
- `.env` must be included in `.gitignore`.
- `VITE_` variables are public and must never contain secrets.
- The backend must load and validate its required configuration at startup.
- Select and verify the actual Gemini model and image-generation provider before deployment.
- Do not commit production credentials.

---

## 16. Testing Requirements

### 16.1 Unit Testing

Test:

- Scenario validation.
- Difficulty limits.
- Schema validation.
- Unique IDs.
- Timeline consistency.
- Evidence references.
- Solution privacy.
- Accusation evaluation.
- Duplicate submission prevention.
- Session authorization.

### 16.2 Integration Testing

Test:

- Express and MongoDB integration.
- Gemini response parsing.
- Generation retries.
- Asset metadata persistence.
- Session creation and retrieval.
- Accusation and result persistence.
- Provider and database failure handling.

### 16.3 End-to-End Testing

Verify the following complete user flow:

1. Open the landing page.
2. Submit a valid scenario.
3. Generate a mystery.
4. Open suspect profiles.
5. Inspect evidence items.
6. Submit a culprit accusation.
7. View the verdict and explanation.
8. Refresh the page.
9. Confirm the resolved session persists.
10. Confirm a duplicate accusation is rejected.

Automated tests should use deterministic fixtures and mocked AI responses where possible. Live AI calls should be reserved for controlled integration or smoke tests.

---

## 17. Acceptance Criteria

The MVP is complete only when all the following criteria pass:

- [ ] The user can submit a scenario and generate a mystery.
- [ ] The generated case contains one predetermined culprit.
- [ ] Suspect and evidence IDs are unique.
- [ ] Evidence supports the intended solution.
- [ ] Timeline and alibi inconsistencies are rejected or repaired.
- [ ] The case is persisted in MongoDB.
- [ ] The user can inspect suspects and evidence.
- [ ] Visual assets are stored and displayed correctly.
- [ ] The user can submit one final accusation.
- [ ] The backend evaluates the accusation against the stored solution.
- [ ] The final result includes the correct culprit and explanation.
- [ ] The private solution is never exposed before resolution.
- [ ] Refreshing the page preserves the session.
- [ ] AI failures produce controlled errors.
- [ ] The application is responsive across common device sizes.
- [ ] The application passes its critical automated tests.
- [ ] No secrets are exposed in frontend code or source control.

---

## 18. Development Roadmap

### Phase 1: Foundation

- Initialize the monorepo.
- Configure React, Vite, Express, and MongoDB.
- Establish the folder structure.
- Create landing and scenario pages.
- Configure environment variables.

**Deliverable:** A navigable frontend and working backend.

### Phase 2: Mystery Generation

- Integrate Gemini.
- Define structured generation schemas.
- Implement mystery prompts.
- Store private solutions.
- Add consistency validation and generation status tracking.

**Deliverable:** A validated mystery that can be retrieved through the API.

### Phase 3: Evidence System

- Implement suspect profiles.
- Build evidence gallery and viewer.
- Render structured chat and documents.
- Integrate image generation and asset storage.
- Validate evidence references and timestamps.

**Deliverable:** A playable investigation room with working evidence.

### Phase 4: Gameplay

- Implement game sessions.
- Persist viewed evidence and notes.
- Add culprit selection.
- Implement backend verdict evaluation.
- Create the case-resolution screen.

**Deliverable:** A complete mystery-solving flow.

### Phase 5: Testing and Deployment

- Add unit and integration tests.
- Run end-to-end tests.
- Validate security and privacy boundaries.
- Optimize generation latency and costs.
- Deploy frontend and backend.
- Verify the production experience.

**Deliverable:** A functional MVP ready for users.

---

## 19. Spec-Driven Development Rules

This document is the single source of truth for AI Mystery Room.

All developers and AI coding agents must follow these rules:

1. Read the relevant sections of `SPEC.md` before implementing a feature.
2. Follow the documented technology stack and architectural boundaries.
3. Do not introduce unapproved features or alter the product scope silently.
4. Do not change API contracts or database schemas without documenting the change.
5. Keep private solutions separate from public case data.
6. Keep AI prompts and validation logic in the backend.
7. Reuse existing components, schemas, and naming conventions.
8. Implement features in small, testable increments.
9. Run relevant tests after every meaningful change.
10. Update this document whenever an approved requirement changes.
11. Document assumptions when the specification does not define a particular implementation detail.
12. Never claim that a feature is complete without testing it against its acceptance criteria.

### Change Management

Any approved specification change must document:

- Requirement or section affected.
- Previous behavior.
- New behavior.
- Reason for the change.
- Impact on APIs, database schemas, UI, and tests.
- Required migration or compatibility work.

When implementation and this specification conflict, follow the specification until the change is explicitly approved.

---

## 20. Definition of Done

A feature is considered complete only when:

- Its behavior matches this specification.
- Input validation and authorization are implemented.
- Loading, success, and failure states are handled.
- Relevant automated tests pass.
- No secrets or private solution data are exposed.
- Documentation is updated where necessary.
- The feature works with the existing architecture.
- The feature has been tested in its intended environment.

The entire MVP is complete when a user can create a fictional mystery, investigate its evidence, identify a suspect, submit a final accusation, and receive a consistent, evidence-based explanation.

---

## 21. Final Product Definition

AI Mystery Room is a single-player, scenario-driven AI mystery-solving web application built with the MERN stack and Google Gemini.

Its core experience consists of:

**Create a Mystery → Generate Evidence → Investigate → Accuse → Reveal the Solution**

The initial version prioritizes logical consistency, evidence-based gameplay, secure solution handling, responsive design, and reliable AI integration.

All future development must preserve these core principles unless an approved specification change explicitly modifies them.
