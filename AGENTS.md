# AGENTS.md

Guidance for AI agents working in this repository.

## Cursor Cloud specific instructions

### Overview

Single-package React 19 + Vite 8 SPA (Swedish restaurant kitchen OS demo). Data and demo auth live in browser `localStorage`. See `README.md` for product context and standard commands.

### Dependency install (Cloud VM)

- Prefer **`npm install`** on Linux x64 Cloud VMs. Plain **`npm ci` fails** with `EBADPLATFORM` on Netlify CLI’s optional `@rollup/rollup-android-*` packages.
- Do **not** use `npm ci --omit=optional`: it skips native bindings (e.g. `@rolldown/binding-linux-x64-gnu`) and breaks **`npm run test`** / Vite.
- CI uses Node **20** (`.github/workflows/ci.yml`); the Cloud VM may ship Node **22**, which works for local dev.

### Services

| Service | Command | URL | Notes |
|---------|---------|-----|--------|
| Vite dev (core UI) | `npm run dev` | http://127.0.0.1:5173 | Sufficient for dashboard, recipes, calculator, demo login |
| Netlify Dev (scan API) | `npm run dev:netlify` | http://127.0.0.1:8888 | Proxies Vite; loads `netlify/functions/scan.mts` |
| Production preview | `npm run build` then `npm run preview` | http://127.0.0.1:4173 | Static build only |

Run long-lived dev servers in **tmux** (e.g. session `vite-dev-server`).

### Lint / test / build

From repo root (after `npm install`):

- `npm run lint` — ESLint (see known issues below)
- `npm run test` — Vitest unit tests
- `npm run build` — `tsc -b` + Vite production build → `dist/`

### Scanning (optional)

Invoice/recipe scanning needs **`ANTHROPIC_API_KEY`** in `.env` (copy from `.env.example`) and **`npm run dev:netlify`**. Plain `npm run dev` does not serve `/.netlify/functions/scan`.

Health check when Netlify Dev is running: `GET http://127.0.0.1:8888/.netlify/functions/scan` should return JSON with `"ok":true` when the key is set.

### Demo login (manual / E2E)

- Any valid email + password with **≥ 4 characters**
- Email containing **`pro`** simulates Pro tier
- Example: `chef@demo.se` / `demo`

### Known lint issues (pre-existing)

As of setup, `npm run lint` may report:

- `react-refresh/only-export-components` in `src/components/SimpleGuide.tsx`
- `react-hooks/set-state-in-effect` in `src/pages/Recipes.tsx`

Tests and production build can still pass while these remain.
