# Dctools Super Admin

One admin dashboard that manages multiple separate dctools.in products —
Dc Tools today, Website Checker and future `dctools.in/xyz` tools later.
Each product keeps its own independent backend/database; this app is just
the shared frontend, switching which backend it talks to via a tool
switcher in the top bar.

```
                    ┌─────────────────────┐
                    │   Admin Dashboard    │  ← this app (one login)
                    └──────────┬───────────┘
                               │
                 ┌─────────────┴─────────────┐
                 ▼                           ▼
        dctools backend             website-checker backend
        (blogs, categories,         (no admin API yet —
         feedback)                   shown as "Coming soon")
```

## Stack

React 19 + Vite + Tailwind CSS v4, icons via [Hugeicons](https://hugeicons.com/)
(`@hugeicons/react` + `@hugeicons/core-free-icons`). No backend of its own —
`frontend/` only.

## How the shared login works

Login calls the **existing dctools backend's** `/api/admin/auth/login`
(password + `JWT_SECRET`, same as its own admin panel already uses). The
returned JWT is sent as `Authorization: Bearer <token>` to whichever
backend the selected tool needs.

For a new tool's admin section to work here, its backend just needs its
own `requireAdmin` middleware verifying with the **same `JWT_SECRET`** —
no shared database, no cross-service calls, just a shared secret so one
login is accepted everywhere. See `backend/src/middleware/adminAuth.js`
for the pattern to copy.

## Running locally

```bash
cd admin/frontend
npm install
npm run dev   # http://localhost:5175
```

Needs the dctools backend running too (for login + Dc Tools pages):
```bash
cd backend
npm install
npm run dev   # http://localhost:5001
```

Override the backend URLs if needed via `.env` (`VITE_DCTOOLS_API_URL`,
`VITE_WEBSITE_CHECKER_API_URL`) — default to `localhost:5001` and
`localhost:5501`.

## What's here (Phase 1 — UI shell)

- Login (real, hits the dctools backend)
- Tool switcher (top bar dropdown, next to the notification icon) — Dc
  Tools / Website Checker, more tools added by editing `src/config/tools.js`
  and `src/config/pages.js`
- Sidebar + page content per selected tool, dark/light theme toggle
- **Dc Tools**: Overview (stat cards), Blogs (list + delete), Categories
  (add/edit/delete), Feedback (list + detail) — all real, wired to the
  existing dctools admin API
- **Website Checker**: honest "Coming soon" placeholder — its backend has
  no admin auth or stored scan data yet

## Not built yet

- Website Checker admin backend (auth middleware + routes for scan
  history, tech-signature management, pricing content)
- Add/Edit Post page (the rich-text editor) — Blogs here is read + delete
  only for now; use the existing `frontend/` admin for creating posts
- Notification bell is decorative (no real notification system yet)
