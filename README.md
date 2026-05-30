# Smakvärlden v2

Smakvärlden v2 is a frontend launch demo for a kitchen operating system built around restaurant profitability. It helps chefs and small restaurant teams understand food cost, ingredient price changes, recipe margins, and better menu decisions from one focused dashboard.

This is not a recipe blog. The product direction is food-cost control and kitchen decision support for modern restaurants.

## Product Focus

Smakvärlden is designed to answer the questions chefs need quickly:

- What is the real cost of this dish?
- Which ingredient prices changed?
- Which recipes are now losing margin?
- What menu price should change?
- Which dishes are strongest or weakest financially?

The main product story is:

> Ingredient price changed → affected recipes → margin loss → suggested action

## Current Features

- Protected demo app shell with dashboard navigation
- Clear demo data / example calculation labels
- Dashboard with food-cost, margin, recipe, and price-alert summaries
- Price intelligence view with affected dishes and suggested price actions
- Recipe library with detail pages and margin calculations
- Ingredient database with supplier, unit, price, previous price, and history data
- Recipe calculator with waste uplift, total cost, selling price, and margin
- Upgrade/pricing screen for the Pro concept
- Public landing page with demo entry points
- Public trust/privacy/contact page explaining demo limits and data safety
- Invoice and recipe scanning via Netlify serverless function (Anthropic API)
- Responsive desktop sidebar and mobile bottom navigation

## Tech Stack

- React 19
- TypeScript
- Vite
- React Router
- Recharts
- Lucide React icons
- Tailwind CSS setup with custom CSS variables
- Browser `localStorage` for prototype persistence
- Vitest for unit tests
- Netlify for static hosting and serverless functions

## Getting Started

Install dependencies:

```bash
npm ci
```

Run the development server:

```bash
npm run dev
```

For invoice and recipe scanning locally, use Netlify Dev so the scan function is available:

```bash
npm run dev:netlify
```

Set `ANTHROPIC_API_KEY` in a `.env` file or Netlify environment variables.

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Launch Scope

The public demo intentionally focuses on the surfaces that are strongest and easiest to understand:

- Dashboard
- Price Intelligence
- Ingredients
- Recipes
- Calculator
- Upgrade/pricing
- Trust/privacy/contact

Köksanalys and Svinnanalys are available in the app shell but are still marked as beta/experimental compared with the core launch surfaces above.

## Demo Login

The app uses local demo authentication. No backend is required.

This is not real production security. It is only a browser demo gate.

- Login: any valid email plus a password with at least 4 characters
- Register: name, valid email, and password with at least 6 characters
- Use an email containing `pro` to simulate a Pro user

All demo user/session data is stored in the browser, **scoped per account** (each login gets its own ingredients, recipes, and scan limits).

Register creates a new account with its own starter data. Logging in with the same email always opens that account's data.

## Quality Checks

Run linting:

```bash
npm run lint
```

Run tests:

```bash
npm run test
```

Run a production build:

```bash
npm run build
```

GitHub Actions runs lint, test, and build on every push and pull request to `main`.

Check dependencies:

```bash
npm audit --audit-level=moderate
```

## Data Model

The prototype includes seeded restaurant data:

- Ingredients with current and previous SEK prices
- Price history for charting and trend views
- Recipes with ingredient quantities and selling prices
- Margin and food-cost calculations
- Price-impact logic for affected recipes

The local store lives in `src/store/index.ts`.

## Deployment

This repo is configured for Netlify:

- Build command: `npm run build`
- Publish directory: `dist`
- SPA redirects and function CORS headers are defined in `netlify.toml`
- Invoice/recipe scanning uses `netlify/functions/scan.mts` and requires `ANTHROPIC_API_KEY` in Netlify environment variables

### Scanning setup on Netlify

1. Go to **Site configuration → Environment variables**
2. Add `ANTHROPIC_API_KEY` with your Anthropic API key
3. Set scope to **Functions** (or **All scopes**) — Build-only scope will not work at runtime
4. **Deploy → Trigger deploy → Deploy site** (required after adding or changing the key)
5. Verify: open `https://YOUR-SITE.netlify.app/.netlify/functions/scan` in the browser — you should see `{"ok":true,"scanConfigured":true,...}`

## Important Prototype Limits

This version is frontend-only. Before production, the following should be replaced or added:

- Real backend API
- Database persistence
- Secure authentication and sessions
- Server-side validation
- Real supplier integrations
- Payment provider integration
- Broader automated test coverage for UI flows and invoice scanning

## Recommended Next Steps

1. Expand tests for edge cases in price-impact logic and invoice parsing.
2. Replace localStorage auth with real authentication.
3. Move seeded data and persistence behind an API.
4. Run pilot visits using `PILOT_NOTES.md` and capture real restaurant feedback.
5. Harden invoice scanning with validation, retries, and cost controls in production.

## Repository

GitHub: https://github.com/msx9973/smakvarlden-v2
