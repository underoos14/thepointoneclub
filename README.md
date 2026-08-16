# THE POINT ONE CLUB

Website for The Point One Club — a fitness community in Hyderabad running events and programmes that test discipline, mindset and ambition.

> The 1% is crowded. We're looking for the fraction.

## Stack

- **MongoDB** — database
- **Express + TypeScript** — REST API (`server/`)
- **React (Vite) + Tailwind CSS + TypeScript** — frontend (`client/`)
- **JWT** — authentication & role-based access (user / admin)

## Getting started

### 1. Backend

```bash
cd server
npm install
cp .env.example .env      # set MONGO_URI, JWT_SECRET, admin credentials
npm run seed              # creates admin user + sample events
npm run dev               # http://localhost:5000
```

### 2. Frontend

```bash
cd client
npm install
cp .env.example .env      # VITE_API_URL defaults to http://localhost:5000
npm run dev               # http://localhost:5173
```

### Run both (root)

```bash
npm install
npm run dev               # server (5000) + client (5173) together
```

## Git workflow (dev → prod)

Two environments only — feature branches are **dev**, `master` is **prod**.

1. Work on a branch: `git checkout -b feature/<name>` and push to start the **dev** pipeline.
2. CI (`.github/workflows/ci.yml`) runs build, typecheck, and security checks on every push and PR.
3. When ready, open a PR from `feature/<name>` into `master`. CI must pass; `master` is protected (requires review, blocks direct pushes).
4. Merge → push to `master` triggers the **prod** pipeline.

```
feature/<name> ──┐  (dev env)
feature/<name> ──┼── PR (CI must pass) ──> master ──> prod env
```

Deploy jobs in CI are currently placeholder hooks — wire up the actual dev/prod targets there.

## Admin access

Log in at `/admin/login` with the credentials set in `server/.env` (`ADMIN_EMAIL` / `ADMIN_PASSWORD`).

## Design tokens

All brand values (colours, fonts) are customised in **one place** — `client/tailwind.config.js` — and exposed to components as Tailwind utilities (`bg-paper`, `text-green-700`, `font-display`, …). Structural/layout CSS stays in `client/src/index.css`. See the "Customising the look" section of `README` in `client/`.

| Token | Value | Usage |
|---|---|---|
| paper | `#FAF8F5` | primary background |
| surface | `#FFFFFF` | cards / panels |
| green | `#0F2A1E → #74C69D` | secondary brand, sections, tags |
| red | `#E63946` | accent — CTAs, do/don't markers |
| ink | `#1C1C1E` | neutral dark gray text |
| muted | `#6E6E73` | secondary text |
| display | Anton | headings / brand / numerals |
| body | Inter | descriptions / UI |

## API overview

| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/auth/register` | public |
| POST | `/api/auth/login` | public |
| POST | `/api/auth/check-username` | public |
| GET | `/api/auth/me` | user |
| GET | `/api/events` | public — `status`, `from`, `to`, `category`, `q` |
| GET | `/api/events/:id` | public |
| POST | `/api/events` | admin |
| PUT | `/api/events/:id` | admin |
| DELETE | `/api/events/:id` | admin |
| POST | `/api/registrations` | user — `{ eventId }` |
| GET | `/api/registrations/mine` | user |
| DELETE | `/api/registrations/:id` | user — cancel |

## Adding new modules

Frontend is organised per-feature under `client/src/features/<module>/` (e.g. `events/`, `auth/`, `admin/`). Add a new module folder with its own components, hooks and api layer, then register its routes in `client/src/App.tsx`.
