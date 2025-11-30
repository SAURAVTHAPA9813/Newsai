# Newsai

AI-assisted news intelligence dashboard built with React + Vite. It ships multiple workspaces (Control Center, Verify Hub, Topic Matrix, IQ Lab, Neural Analytics, Trending, and Profile) plus a marketing-style landing page.

## Live demo
- https://sauravthapa9813.github.io/Newsai

## Features
- Modular dashboards for verification, topic exploration, cognitive drills, neural analytics, and trending insights
- Polished landing experience with hero, pricing, social proof, FAQs, and CTA
- Mock service layer and sample data for local development
- Hash-based routing configured for GitHub Pages static hosting

## Tech stack
- React 19, Vite
- React Router (`HashRouter`)
- Tailwind CSS + PostCSS + Autoprefixer
- Framer Motion, Recharts, React Icons
- GitHub Pages via `gh-pages`

## Getting started
Prereqs: Node 18+ and npm.

```bash
npm install
npm run dev
```

## Scripts
- `npm run dev` — start Vite dev server
- `npm run build` — production build to `dist/`
- `npm run preview` — preview production build locally
- `npm run deploy` — build and publish `dist/` to GitHub Pages (`predeploy` runs automatically)

## Project structure
- `src/App.jsx` — routes (HashRouter) and layout wiring
- `src/pages/` — page-level screens (landing, dashboard workspaces)
- `src/layouts/` — public and dashboard shells
- `src/components/` — UI building blocks, dashboard modules, shared UI
- `src/services/` — mock API/service facades
- `src/context/AuthContext.jsx` — auth state provider
- `src/styles/index.css` — global styles

## Deployment (GitHub Pages)
The project is set up for static hosting:
- `vite.config.js` uses `base: '/Newsai/'` to match the repository name.
- Routing uses `HashRouter` in `src/App.jsx` so client-side navigation works on GitHub Pages.
- Publish with `npm run deploy` (runs build then pushes `dist/` to the `gh-pages` branch).

After deployment, the site will be served from `https://<username>.github.io/Newsai/`.
