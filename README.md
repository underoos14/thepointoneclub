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

The deploy jobs in CI are placeholders — production is deployed via the **Vercel GitHub integration** (see below), which watches `master` and deploys automatically.

## Deploying to Vercel (single project)

The whole app — SPA **and** Express API — deploys as **one Vercel project**:

- `vercel.json` at the root builds the client (`client/dist`) and routes `/api/*` to the
  serverless function in `api/index.ts`.
- `package.json` uses npm workspaces so one `npm install` covers `client/` and `server/`.

### 1. One-time Vercel setup

1. Import the GitHub repo as a new project on [vercel.com](https://vercel.com) (root directory — no change).
2. Vercel will auto-detect `vercel.json`. Add the following **environment variables**:

   | Variable | Value |
   |---|---|
   | `MONGO_URI` | your MongoDB Atlas connection string |
   | `JWT_SECRET` | a long random string |
   | `JWT_EXPIRES_IN` | `7d` (or shorter) |
   | `DEMO_ACCESS_CODE` | the code visitors must enter to see the site |
   | `ADMIN_EMAIL` / `ADMIN_PASSWORD` | admin login credentials |
3. Deploy once (Vercel runs `npm run build` → builds the client and bundles the API).
4. After first deploy, run the seed once against your Atlas DB so the admin user + sample events exist:

   ```bash
   cd server
   MONGO_URI=<your-atlas-uri> DEMO_ACCESS_CODE=... ADMIN_EMAIL=... ADMIN_PASSWORD=... npm run seed
   ```

   (Or set the `ADMIN_*` vars in `server/.env` locally and run `npm run seed`.)

From then on, pushing to `master` auto-deploys.

### Demo access gate

- When `DEMO_ACCESS_CODE` is set, everyone must enter the code once before any page or API
  response loads. A signed HttpOnly cookie (`tp1_demo`, 12h) is issued on success.
- When it's empty, the gate is skipped entirely — useful for local dev.
- The gate protects the API as well, not just the UI.

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
| GET | `/api/health` | public |
| GET | `/api/demo/status` | public — returns 200 if the demo cookie is valid |
| POST | `/api/demo/verify` | public — `{ code }`, sets the demo cookie |
| POST | `/api/auth/register` | demo access |
| POST | `/api/auth/login` | demo access |
| POST | `/api/auth/check-username` | demo access |
| GET | `/api/auth/me` | user |
| GET | `/api/events` | demo access — `status`, `from`, `to`, `category`, `q` |
| GET | `/api/events/:id` | demo access |
| POST | `/api/events` | admin |
| PUT | `/api/events/:id` | admin |
| DELETE | `/api/events/:id` | admin |
| POST | `/api/registrations` | user — `{ eventId }` |
| GET | `/api/registrations/mine` | user |
| DELETE | `/api/registrations/:id` | user — cancel |

## Adding new modules

Frontend is organised per-feature under `client/src/features/<module>/` (e.g. `events/`, `auth/`, `admin/`). Add a new module folder with its own components, hooks and api layer, then register its routes in `client/src/App.tsx`.
