# Smakvärlden v2

Smakvärlden v2 is a frontend prototype for a kitchen operating system built around restaurant profitability. It helps chefs and small restaurant teams understand food cost, ingredient price changes, recipe margins, waste estimates, and better menu decisions from one focused dashboard.

This is not a recipe blog. The product direction is food-cost control and kitchen decision support for modern restaurants.

## Product Focus

Smakvärlden is designed to answer the questions chefs need quickly:

- What is the real cost of this dish?
- Which ingredient prices changed?
- Which recipes are now losing margin?
- What menu price should change?
- Where is waste costing money?
- Which dishes are strongest or weakest financially?

## Current Features

- Protected demo app shell with dashboard navigation
- Dashboard with food-cost, margin, recipe, and price-alert summaries
- Price intelligence view with affected dishes and suggested price actions
- Recipe library with detail pages and margin calculations
- Ingredient database with supplier, unit, price, previous price, and history data
- Recipe calculator with waste uplift, total cost, selling price, and margin
- Kitchen analytics for price movements, category averages, and recipe ranking
- Waste estimate page using category-based assumptions
- Upgrade/pricing screen for the Pro concept
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

## Getting Started

Install dependencies:

```bash
npm ci
```

Run the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Demo Login

The app uses local demo authentication. No backend is required.

- Login: any valid email plus a password with at least 4 characters
- Register: name, valid email, and password with at least 6 characters
- Use an email containing `pro` to simulate a Pro user

All demo user/session data is stored in the browser.

## Quality Checks

Run linting:

```bash
npm run lint
```

Run a production build:

```bash
npm run build
```

Check dependencies:

```bash
npm audit --audit-level=moderate
```

## Data Model

The prototype includes seeded restaurant data:

- Ingredients with current and previous SEK prices
- Price history for charting and trend views
- Recipes with ingredient quantities and selling prices
- Margin, food-cost, and waste calculations
- Price-impact logic for affected recipes

The local store lives in `src/store/index.ts`.

## Important Prototype Limits

This version is frontend-only. Before production, the following should be replaced or added:

- Real backend API
- Database persistence
- Secure authentication and sessions
- Server-side validation
- Real supplier integrations
- Payment provider integration
- Automated tests for costing and price-impact calculations
- Deployment configuration for the chosen host

## Recommended Next Steps

1. Add unit tests for `totalCost`, `margin`, `suggested`, and `buildAlerts`.
2. Replace localStorage auth with real authentication.
3. Move seeded data and persistence behind an API.
4. Add a public landing page for “Try Free” and “Watch Demo”.
5. Connect deployment through Vercel, Netlify, or another static host.

## Repository

GitHub: https://github.com/msx9973/smakvarlden-v2
