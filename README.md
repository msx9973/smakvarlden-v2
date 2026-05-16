# Smakvärlden v2

Smakvärlden v2 is a client-side kitchen operating system prototype for chefs and restaurant teams. It focuses on food cost, ingredient price changes, recipe margins, waste estimates, and fast menu decisions.

## What It Includes

- Dashboard with margin, food-cost, and price-alert summaries
- Price intelligence showing affected recipes and suggested menu-price changes
- Recipe library and recipe detail costing
- Ingredient database with supplier, unit, price, and price-history data
- Recipe calculator with waste and margin calculations
- Kitchen analytics and waste estimate views
- Demo login/register flow backed by browser local storage

## Tech Stack

- React 19
- TypeScript
- Vite
- React Router
- Recharts
- Tailwind CSS base setup plus local CSS variables
- LocalStorage-backed demo data

## Local Development

```bash
npm ci
npm run dev
```

## Quality Checks

```bash
npm run lint
npm run build
```

## Notes

This is a frontend prototype. Authentication and data persistence are demo-only and stored in the browser. A production version should replace the local store with a real backend, database, secure authentication, and server-side validation.
