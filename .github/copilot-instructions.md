**Repository Purpose**
- **Summary:** Frontend SPA in `newsai/` (Vite + React + Tailwind) and a minimal Express API in `server/` (MongoDB via Mongoose).

**Architecture & Data Flow**
- **Frontend:** `newsai/src/main.jsx` bootstraps the app. Routes live in `newsai/src/App.jsx` and use `HashRouter`. Layouts are in `newsai/src/layouts/*` (public vs dashboard). UI modules/components live under `newsai/src/components/`.
- **Backend:** `server/server.js` is the entry point. DB connection is in `server/config/db.js`. API routes are mounted under `/api` (`server/routes/*.js`) and implemented in `server/controllers/*Controller.js`.
- **Auth & Data:** Auth state is stored in `localStorage` by `newsai/src/context/AuthContext.jsx` using keys `user` and `token`. Protected endpoints use Express middleware `server/middleware/auth.js`. Models: `server/models/User.js` and `server/models/Article.js` show the shape of persisted data (saved articles, preferences).

**Developer Workflows (concrete commands)**
- **Frontend dev:**
  - `cd newsai; npm install` (once)
  - `npm run dev` — starts the Vite dev server
- **Frontend production / deploy:**
  - `npm run build` — build into `dist`
  - `npm run deploy` — publishes `dist` via `gh-pages` (see `newsai/package.json`)
- **Backend:**
  - `cd server; npm install` (once)
  - `npm run dev` — run with `nodemon` (auto-reload)
  - `npm start` — run with `node server.js`
- **Environment:** Backend expects environment vars like `MONGODB_URI`, `JWT_SECRET`, `PORT` in a `.env` file at `server/` root.

**Project Conventions & Patterns**
- **Routing & layouts:** Add front-end pages under `newsai/src/pages/` and register routes in `newsai/src/App.jsx`. Wrap public pages with `PublicLayout` and protected pages with `DashboardLayout`.
- **API additions:** Create controller functions in `server/controllers`, then expose them via a new route file in `server/routes/` and mount with `app.use('/api/<name>', require('./routes/<name>'))` in `server/server.js`.
- **Auth contract:** Frontend stores the JWT in `localStorage.token` and sends it as `Authorization: Bearer <token>` to protected endpoints (see `AuthContext` and `server/middleware/auth.js`). When adding protected routes, use the `protect` middleware from `server/middleware/auth.js`.
- **Models:** Use Mongoose schemas in `server/models/`. Example: `User.savedArticles` stores ObjectId refs to `Article`.

**Integration Points & External Dependencies**
- **Third-party APIs / libraries:** Frontend uses `react-router-dom`, `framer-motion`, `recharts`. Backend uses `express`, `mongoose`, `jsonwebtoken`, and `bcryptjs`.
- **Deploy:** Frontend deploys to GitHub Pages via `gh-pages` configured in `newsai/package.json`.

**Quick Examples**
- Fetch saved articles (frontend example):
  ```js
  fetch('/api/news/saved', { headers: { Authorization: 'Bearer ' + token } })
  ```
- Add an API route (backend):
  1. Create `server/controllers/myController.js` and export handlers.
  2. Create `server/routes/my.js` and `router.get('/path', handler)`.
  3. Mount in `server/server.js`: `app.use('/api/my', require('./routes/my'))`.

**Debugging / Testing Notes**
- No test suite present. For server debugging, run `npm run dev` in `server/` and watch logs. For CORS or network issues, inspect browser Network tab — server already includes `app.use(cors())`.
- When front-end cannot reach API in dev, ensure server is running on `PORT` (default 5000) and that the browser request URL targets the server (absolute URL or relative `/api` when proxying is configured).

If anything here is unclear or you'd like more examples (auth middleware shape, sample controller, or a small local dev script), tell me which area and I'll iterate.

**Vite / GitHub Pages: static assets & base path**
- Why this matters: when deployed to `https://<username>.github.io/Newsai/` the app's base path is `/Newsai/`. Static imports or `public` references that assume root (`/`) will 404 in production.
- Best practices:
  - For component images, keep them under `src/assets/` (or a subfolder) and import them in code. Example:
    ```js
    import coin from '@/assets/coin.png'
    <img src={coin} alt="coin" />
    ```
    (This lets Vite rewrite/import the asset and the path will work in prod.)

  - If you must use `public/` (files copied verbatim), reference them with the configured base URL so paths resolve both in dev and on GitHub Pages:
    ```js
    <img src={`${import.meta.env.BASE_URL}coin.png`} alt="coin" />
    ```
    or hardcode the repo base (less preferred):
    ```js
    <img src="/Newsai/coin.png" alt="coin" />
    ```

- Checklist for images:
  - Put component-imported images inside `src/` (e.g. `src/assets/`).
  - Use `import img from '...'; <img src={img} />` for those files.
  - Put directly-referenced static files in `public/` and reference via `${import.meta.env.BASE_URL}filename`.

- TL;DR table:

  Usage | Where to Store? | How to Reference | Works on GitHub Pages?
  - Image in a component | `src/assets/` | `import myImg from ...` | YES
  - Direct public reference | `public/` | `${import.meta.env.BASE_URL}img.png` | YES

Apply these changes when adding or fixing images that 404 after `npm run deploy`.
