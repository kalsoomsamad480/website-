# Alladin Cafe

A full stack website for a neighborhood cafe that doubles as a calm study space: an editorial public site, online ordering, table and study-desk reservations, an admin panel, and an AI assistant. It runs on dummy data only; no real payments are taken.

The full specification is in [requirements.md](requirements.md).

| Part | Tech | Port |
|---|---|---|
| `frontend/` | React 19, Vite, React Router, Framer Motion, CSS Modules, Axios | 5173 |
| `backend/` | Node.js, Express 5, MongoDB with Mongoose, JWT | 5000 |
| `agent/` | Python, FastAPI, optional Claude API | 8000 |

## Quick start

**Requirements:** Node.js 18+, Python 3.10+, and a MongoDB database (a free MongoDB Atlas cluster works; see [Database](#database)).

Run each part in its own terminal:

```bash
# 1. Backend (API)
cd backend
npm install
cp .env.example .env          # then set MONGO_URI and the two JWT secrets
npm run seed                  # loads the demo data
npm run dev                   # http://localhost:5000/api/v1/health

# 2. AI assistant (optional, but the chat widget needs it)
cd agent
pip install -r requirements.txt
cp .env.example .env          # optional: add LLM_API_KEY to use Claude
uvicorn main:app --reload --port 8000

# 3. Frontend
cd frontend
npm install
npm run dev                   # http://localhost:5173
```

The frontend's dev server forwards `/api` to the backend, so no extra configuration is needed locally.

### Demo accounts (local development only)

| Role | Email | Password | Lands on |
|---|---|---|---|
| Admin | `admin@alladin.cafe` | `Admin@123` | `/admin` |
| Customer | `customer@alladin.cafe` | `Customer@123` | `/profile` |

The sign-in page also has one-click buttons that fill in these accounts.

## What is in it

**Public site:** Home, Menu (search, category tabs, tag, price, and sort filters, item details), Study Space (zones, a demo "seats right now" preview, passes, house rules), About, Gallery (masonry grid with a keyboard and swipe lightbox), Contact (message form), and a 404 page.

**Ordering:** a cart drawer saved in the browser, checkout that rechecks every price against the live menu, pickup or dine in, demo payment options, and an order confirmation. The server always calculates prices.

**Reservations:** table (1 to 8 guests) or study desk (1 person), 30-minute slots from opening until one hour before closing, up to 30 days ahead, with live per-slot capacity (24 table guests, 30 study desks). Seats are claimed with an atomic per-slot counter, so simultaneous bookings can never overbook a slot; the counters are rebuilt from reservations on every server start and seed.

**Accounts:** registration and sign-in with bcrypt-hashed passwords, a short-lived access token kept in memory, and an httpOnly refresh cookie. The profile page shows order history and reservations (with cancel) and lets customers edit their details.

**Admin panel (`/admin`):** a dashboard (today's numbers, 7-day revenue chart, popular items), order status updates, reservation approval and rescheduling, menu and category management, offers, testimonials, and contact messages. Changes show on the public site straight away. Customers who open `/admin` are sent to the home page with a staff-only notice, and the API returns 403 for them.

**AI assistant:** a chat widget on every page. See [AI assistant](#ai-assistant).

## Configuration

| File | Variable | Purpose |
|---|---|---|
| `backend/.env` | `MONGO_URI` | MongoDB connection string |
| | `USE_MEMORY_DB` | `true` runs a temporary in-memory MongoDB, seeded on every start |
| | `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET` | Long random strings |
| | `JWT_ACCESS_EXPIRES`, `JWT_REFRESH_EXPIRES_DAYS` | Token lifetimes (default 15m and 7 days) |
| | `CLIENT_URL` | Allowed frontend origin(s) for CORS, comma separated |
| | `AGENT_URL` | Where the Python assistant runs |
| | `AGENT_SECRET` | Shared with `agent/.env`. Marks bookings made through the assistant as trusted (tagged "agent" and exempt from the per-IP booking limit) |
| `agent/.env` | `LLM_API_KEY` | Optional. With a key the assistant uses Claude |
| | `AGENT_SECRET` | Must match `backend/.env` |
| | `LLM_MODEL` | Default `claude-sonnet-5-5` |
| | `BACKEND_URL` | The Node API the assistant reads from |
| `frontend/.env` | `VITE_API_URL` | Default `/api/v1` (uses the dev proxy) |
| | `VITE_SITE_URL` | Public site origin used in `sitemap.xml` and `robots.txt` at build time (on Vercel the production domain is used automatically) |

Generate secrets with `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`. Real `.env` files are git-ignored.

### Database

- **MongoDB Atlas (recommended):** create a free cluster, add a database user (letters and numbers only in the password), allow your IP under Network Access, and paste the driver connection string into `MONGO_URI` with `study_mind` as the database name.
- **Local MongoDB:** the default `MONGO_URI` points at `mongodb://127.0.0.1:27017/study_mind`.
- **No MongoDB:** `npm run dev:memory` in `backend/` uses an in-memory database. The first run downloads a MongoDB binary of about 600 to 800 MB.

## AI assistant

The website talks to the assistant through the backend (`POST /api/v1/agent/chat`, 20 messages per minute).

| Mode | When | How it answers |
|---|---|---|
| Rules | No `LLM_API_KEY` (default) | Intent matching for menu lookups, prices, recommendations ("strong and not sweet", "iced under $5"), hours, location, offers, the study space, an FAQ, and a step-by-step booking flow |
| LLM | `LLM_API_KEY` set | Claude with tools that read the live menu, info, offers, and availability. Falls back to rules mode if the API fails |

Grounding guarantees:
- Menu items, prices, and offers come only from the live API; sold-out items are never recommended.
- In LLM mode, a reply containing a price that is not on the menu is discarded and answered by rules mode instead.
- A reservation is created only after the guest says yes to a summary. In LLM mode this is enforced in code, not just in the prompt.

## Tests and quality checks

| Command | What it covers |
|---|---|
| `cd frontend && npm test` | 10 Vitest tests: menu filtering, money and tax, opening hours, dates, redirects, form rules |
| `cd backend && npm test` | 15 node:test tests: time-slot rules, helpers, and API validation, auth guards, and security headers (no database needed) |
| `cd agent && python -m pytest -q` | 26 tests with a fake backend: parsing, recommendations, grounding, the full booking flow, and the confirmation guards |
| `npm run lint` | ESLint in `frontend/` and `backend/` |

Results at the end of Phase 7:
- Lighthouse (desktop): performance 96 to 99, accessibility 100, best practices 100, SEO 100 on every public page.
- axe-core (WCAG 2.1 AA): no violations on 18 pages at desktop and phone width.
- End-to-end browser runs of the cart, checkout, sign-in redirect, reservations, profile, chat widget, and admin panel all pass.

## Brand and design

- Brand colors: Study Purple `#4B2C91`, Focus Blue `#1D80C3`, Crema Gold `#D6B83C`. Neutrals: `#000000`, `#FFFFFF`, `#EEEEEE`, `#DDDDDD`.
- Contrast rules are measured and documented in `requirements.md` section 3.1 (for example, gold is never text on light backgrounds, and gold buttons always use black text).
- Fonts: Fraunces (display) and Manrope (body), self-hosted.
- Every color comes from `frontend/src/styles/variables.css`.
- No decorative dots, side lines, gradients, blobs, or emoji. Movement animates only transform and opacity, and respects "reduce motion".
- Photos are free Unsplash images; photographer credits are in `frontend/public/images/credits.json`.

## Project layout

```
frontend/src/
  components/   common/ home/ menu/ cart/ checkout/ reservation/ profile/ chat/ admin/ ...
  pages/        one folder per page, admin pages under pages/admin/
  layouts/      MainLayout, AdminLayout
  routes/       AppRoutes, ProtectedRoute, AdminRoute, NavigateOnce
  context/      AuthContext, CartContext
  hooks/  services/  utils/  styles/
backend/src/
  config/ db/(models, seeds) routes/ controllers/ services/ middleware/ validators/ utils/ data/
agent/app/
  api/ core/ agents/ tools/ memory/ schemas/ services/ data/ utils/
```

Each component or module has its own file (and CSS module) in its own folder.

## Project agents

Claude Code subagents live in `.claude/agents/`:

| Agent | Use it for |
|---|---|
| `ui-ux-designer` | Design system, layout, and motion reviews |
| `frontend-developer` | React components, pages, and routes |
| `backend-developer` | Express APIs, models, and auth |
| `python-agent-developer` | The FastAPI assistant |
| `token-efficient-worker` | Small mechanical edits with low token use |
| `qa-reviewer` | Checks against `requirements.md` at the end of a phase |

## API reference

Base path `/api/v1`. Responses use `{ success, message, data }`; errors add `errors: [{ field, message }]` for validation problems.

| Method | Endpoint | Access |
|---|---|---|
| GET | `/health` | Public |
| POST | `/auth/register`, `/auth/login` (10 failed attempts per 15 min), `/auth/refresh`, `/auth/logout` | Public |
| GET / PUT | `/auth/me` | Signed in |
| GET | `/menu` (query: `category`, `search`, `tag`, `minPrice`, `maxPrice`, `sort`, `available`), `/menu/:idOrSlug` | Public |
| POST / PUT / PATCH / DELETE | `/menu`, `/menu/:id`, `/menu/:id/availability` | Admin |
| GET | `/categories` | Public |
| POST / PUT / DELETE | `/categories`, `/categories/:id` | Admin |
| GET | `/info`, `/offers`, `/testimonials`, `/gallery` | Public |
| POST | `/contact` (5 per 15 min) | Public |
| GET / PATCH / DELETE | `/contact`, `/contact/:id/read`, `/contact/:id` | Admin |
| POST | `/orders` (server calculates all prices) | Signed in |
| GET | `/orders/my` | Signed in |
| GET / PATCH | `/orders` (query: `status`), `/orders/:id/status` | Admin |
| GET | `/reservations/availability?date=YYYY-MM-DD&seatType=table\|study-desk` | Public |
| POST | `/reservations` (10 per 15 min) | Public |
| GET | `/reservations/my` | Signed in |
| PATCH | `/reservations/:id/cancel` | Owner |
| GET / PATCH | `/reservations` (query: `status`, `date`), `/reservations/:id/status`, `/reservations/:id/reschedule` | Admin |
| GET | `/admin/stats` | Admin |
| GET / POST / PUT / DELETE | `/offers/all`, `/offers`, `/offers/:id` | Admin |
| GET / POST / PUT / DELETE | `/testimonials/all`, `/testimonials`, `/testimonials/:id` | Admin |
| POST | `/agent/chat` (20 per minute) | Public |

## Known limitations (version 1)

- Card and button hover effects also fade their shadow (a paint-only change); all movement uses transform and opacity.
- The assistant's Claude mode has only been tested with offline unit tests; the live site has run in rules mode (no API key).

## Troubleshooting

- **"Could not connect to any servers in your MongoDB Atlas cluster":** your IP address changed. Add it again under Atlas, Network Access.
- **"bad auth: Authentication failed":** check the database user name and password in `MONGO_URI` (no `<` `>` brackets left from the template).
- **The chat says the assistant is taking a break:** start the agent (`uvicorn main:app --port 8000`) and check `AGENT_URL` in `backend/.env`.
- **Signed out after an update:** sign in again once; sessions from before the Phase 7 update are not restored automatically.

## Progress

- [x] Phase 1: Foundation
- [x] Phase 2: Backend core
- [x] Phase 3: Frontend pages
- [x] Phase 4: Commerce
- [x] Phase 5: Agent
- [x] Phase 6: Admin panel
- [x] Phase 7: Polish (accessibility, performance, SEO, tests, documentation)
