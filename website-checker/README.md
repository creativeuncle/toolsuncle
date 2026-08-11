# Website Checker

A standalone audit tool — separate app, separate stack, no connection to the
main dctools.in site. Will eventually live at `dctools.in/website-checker`,
but for now it's local-only while we build it out.

Enter a URL, get an instant scan across Security, SEO, AEO (answer-engine
optimization), Performance, Accessibility, Website Completeness, Technical
Bugs, and UI/UX Design — all from a single fetch of the page (no headless
browser yet, see "Not implemented yet" below).

## Stack

- `frontend/` — React 19 + Vite + Tailwind CSS v4, dark mode only, icons via
  [Hugeicons](https://hugeicons.com/) (`@hugeicons/react` + `@hugeicons/core-free-icons`).
- `backend/` — Node.js + Express. Fetches the target page, parses it with
  `cheerio`, and runs a set of real checks per category (`src/scanner/checks/*.js`).

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

Open http://localhost:5173 and scan any public URL.

To scan `localhost`/private targets (useful for testing against a local
fixture site), set `ALLOW_PRIVATE_SCAN_TARGETS=true` in `backend/.env` — this
disables the SSRF guard, so never do this in a deployed environment.

## What's actually implemented (real checks, no fake data)

Every issue shown comes from a real fetch: the page HTML, response headers,
`robots.txt`/`sitemap.xml`/`.env`/`.git/*`/admin-path probes, a same-origin
crawl of the links found on the homepage (for broken-link and completeness
checks), and HEAD requests against images. See `backend/src/scanner/checks/`
for the exact logic per category.

## Not implemented yet (needs a headless browser — Phase 2)

These require actually rendering the page in a browser (Playwright/Puppeteer),
which is a bigger infra decision (Docker image size, per-scan execution time)
we haven't made yet, so they're honestly left out rather than faked:

- JS/console runtime error capture
- Core Web Vitals (LCP, CLS, INP)
- Color contrast analysis
- Full keyboard-navigation walkthrough / screen reader simulation
- Form submission testing
- AI-powered visual design/UX review

Each category card in the UI lists its own "Coming soon" items so this is
visible to users too, not just in this doc.

## Also planned

- Multi-page crawl (beyond the homepage) for duplicate titles/descriptions
  and deeper completeness checks.
- The "AI fix available on upgrade" line on every issue is currently a
  static label — no fix-generation feature exists yet.
- Deployment to `dctools.in/website-checker` once the feature set is further
  along.
