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

### Admin access

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
| GET | `/api/auth/me` | user |
| GET | `/api/events` | public — `status`, `from`, `to`, `category`, `q` |
| GET | `/api/events/:id` | public |
| POST | `/api/events` | admin |
| PUT | `/api/events/:id` | admin |
| DELETE | `/api/events/:id` | admin |

## Adding new modules

Frontend is organised per-feature under `client/src/features/<module>/` (e.g. `events/`, `auth/`, `admin/`). Add a new module folder with its own components, hooks and api layer, then register its routes in `client/src/App.tsx`.
