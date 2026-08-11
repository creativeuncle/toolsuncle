# Website Checker

A standalone audit tool — separate app, separate stack, no connection to the
main dctools.in site. Will eventually live at `dctools.in/website-checker`,
but for now it's local-only while we build it out.

Enter a URL, get an instant scan across Security, SEO, AEO (answer-engine
optimization), Performance, Accessibility, Website Completeness, Technical
Bugs, and UI/UX Design.

Two scan modes:
- **Quick scan** (default) — one HTTP fetch of the homepage, parsed with
  `cheerio`. Fast (a couple seconds).
- **Deep scan** (checkbox next to the URL input) — adds a real headless
  Chromium render (Playwright) for browser-only checks, plus a same-origin
  crawl of a handful of internal pages. Slower (~15-30s depending on the
  site).

## Stack

- `frontend/` — React 19 + Vite + Tailwind CSS v4, dark mode only, icons via
  [Hugeicons](https://hugeicons.com/) (`@hugeicons/react` + `@hugeicons/core-free-icons`).
  Client-side PDF export via `jspdf`.
- `backend/` — Node.js + Express. Fetches the target page, parses it with
  `cheerio`, runs a set of real checks per category (`src/scanner/checks/*.js`),
  and (deep scan only) launches Playwright Chromium (`src/scanner/browserScan.js`)
  for browser-dependent checks. Shareable reports are kept in an in-memory
  store (`src/scanner/shareStore.js`, 48h TTL — resets on server restart).

## Running locally

```bash
# terminal 1
cd website-checker/backend
cp .env.example .env
npm install
npm run dev        # http://localhost:5501

# terminal 2
cd website-checker/frontend
npm install
npm run dev         # http://localhost:5173, proxies /api -> :5501
```

Open http://localhost:5173 and scan any public URL. `npm install` in
`backend/` downloads Playwright's bundled Chromium automatically — if that
fails or you want to pin a system Chromium instead (e.g. in Docker), set
`PLAYWRIGHT_EXECUTABLE_PATH` in `backend/.env`.

To scan `localhost`/private targets (useful for testing against a local
fixture site), set `ALLOW_PRIVATE_SCAN_TARGETS=true` in `backend/.env` — this
disables the SSRF guard, so never do this in a deployed environment.

## What's actually implemented (real checks, no fake data)

**Quick scan** (every scan): HTML/response-header analysis, `robots.txt` /
`sitemap.xml` / `.env` / `.git/*` / admin-path probes, a homepage-link broken
link + image-availability sweep. See `backend/src/scanner/checks/` for the
exact logic per category.

**Deep scan** (checkbox on): adds real browser checks — console errors,
uncaught JS exceptions, failed network requests, Core Web Vitals (LCP, CLS,
FCP), WCAG color-contrast ratios, keyboard-focus-indicator presence,
overlapping-element and tap-target-size detection, and a *static* (see below)
form-readiness check — plus a same-origin crawl (up to ~12 pages) that
broadens the broken-link check and adds duplicate-title detection across the
whole site, not just the homepage.

Two deliberate scope decisions:
- **We never actually submit forms found on a scanned site.** Real form
  submission testing would risk triggering real side effects (spamming a
  business's contact form, fake orders, password resets) on whatever site
  someone scans. The "Forms may not submit" check is a safe static read of
  whether the form has an action/handler wired up — not a real submit.
- **"AI-powered visual design review" isn't implemented** — it's listed
  honestly as "Coming soon" under UI/UX Design rather than faked, since it
  needs a vision-capable LLM API key that isn't configured. What *is* real
  under that category: overlapping-element and tap-target-size checks from
  the actual rendered layout.

Each category card in the UI also shows its own "Coming soon" list.

## Also planned

- The "AI fix available on upgrade" line on every issue is currently a
  static label — no fix-generation feature exists yet.
- INP (Interaction to Next Paint) needs real user interaction to measure, so
  it can't be captured by an automated scan the way LCP/CLS/FCP can.
- Deployment to `dctools.in/website-checker` once the feature set is further
  along.
