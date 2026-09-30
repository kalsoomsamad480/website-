# Alladin Cafe: Project Rules

The full spec is in `requirements.md`. Read the relevant section before building a feature.

## Structure
- `frontend/`: React + Vite (port 5173)
- `backend/`: Node + Express + MongoDB (port 5000, base `/api/v1`)
- `agent/`: Python FastAPI assistant (port 8000)
- `.claude/agents/`: project subagents: `ui-ux-designer`, `frontend-developer`, `backend-developer`, `python-agent-developer`, `token-efficient-worker`, `qa-reviewer`

## Workflow
- Build one phase at a time (requirements.md section 14). After each phase, run `qa-reviewer` and ask the user to confirm before starting the next phase.
- Use `ui-ux-designer` for any visual work, and `token-efficient-worker` for small mechanical edits.

## Brand (short version)
- Brand: purple `#4B2C91`, blue `#1D80C3`, gold `#D6B83C`. Neutrals: `#000`, `#FFF`, `#EEE`, `#DDD`.
- Fonts: Fraunces (display) and Manrope (body).
- No dots, side lines, gradients, blobs, or emoji. Animate only transform and opacity, and respect reduced motion.
- All colors come from `frontend/src/styles/variables.css` tokens.

## Phase status
- [x] Phase 1: Foundation
- [x] Phase 2: Backend core (uses MongoDB Atlas via MONGO_URI in backend/.env; the in-memory DB is impractical on this machine's slow connection)
- [x] Phase 3: Frontend pages (Home, Menu, About, Study Space, Gallery, Contact with live API data; photos from Unsplash, credits in frontend/public/images/credits.json)
- [x] Phase 4: Commerce (use routes/NavigateOnce for redirects: pages stay mounted during exit animations, so plain <Navigate> fires repeatedly)
- [x] Phase 5: Agent (runs in rules mode until LLM_API_KEY is set in agent/.env; tests: `python -m pytest -q` in agent/)
- [x] Phase 6: Admin panel (admin screens use hooks/useAdminData for fresh data; admin edits invalidate the public cache in services/adminService.js)
- [x] Phase 7: Polish (Lighthouse 96-99 / 100 / 100 / 100, axe 0 violations; tests: `npm test` in frontend and backend, `python -m pytest -q` in agent)
