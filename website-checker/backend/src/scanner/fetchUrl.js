const USER_AGENT = "Mozilla/5.0 (compatible; WebsiteCheckerBot/1.0; +https://dctools.in/website-checker)";
const DEFAULT_TIMEOUT_MS = 10000;

// Manual redirect handling so we can count hops and detect loops, rather
// than relying on fetch's opaque built-in follow behavior.
export async function fetchWithRedirects(url, { method = "GET", maxRedirects = 6, timeoutMs = DEFAULT_TIMEOUT_MS } = {}) {
  const visited = [];
  let currentUrl = url;
  let redirectCount = 0;
  const startedAt = Date.now();

  while (redirectCount <= maxRedirects) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    let res;
    try {
      res = await fetch(currentUrl, {
        method,
        redirect: "manual",
        signal: controller.signal,
        headers: { "User-Agent": USER_AGENT, Accept: "*/*" },
      });
    } catch (err) {
      clearTimeout(timeout);
      return { ok: false, error: err.name === "AbortError" ? "timeout" : err.message, url: currentUrl, redirectCount, timeMs: Date.now() - startedAt };
    }
    clearTimeout(timeout);

    if (res.status >= 300 && res.status < 400 && res.headers.get("location")) {
      const nextUrl = new URL(res.headers.get("location"), currentUrl).toString();
      if (visited.includes(nextUrl)) {
        return { ok: false, error: "redirect_loop", url: currentUrl, redirectCount, timeMs: Date.now() - startedAt };
      }
      visited.push(currentUrl);
      currentUrl = nextUrl;
      redirectCount += 1;
      continue;
    }

    const timeMs = Date.now() - startedAt;
    return { ok: true, response: res, finalUrl: currentUrl, redirectCount, timeMs };
  }

  return { ok: false, error: "too_many_redirects", url: currentUrl, redirectCount, timeMs: Date.now() - startedAt };
}

export async function fetchText(url, opts) {
  const result = await fetchWithRedirects(url, opts);
  if (!result.ok) return { ...result, body: "" };
  const body = await result.response.text().catch(() => "");
  return { ...result, body, status: result.response.status, headers: result.response.headers };
}

export async function headOrGetStatus(url, opts) {
  let result = await fetchWithRedirects(url, { ...opts, method: "HEAD" });
  if (!result.ok || result.response.status === 405 || result.response.status === 501) {
    result = await fetchWithRedirects(url, { ...opts, method: "GET" });
  }
  if (!result.ok) return { ok: false, status: null, error: result.error };
  return { ok: true, status: result.response.status, headers: result.response.headers, finalUrl: result.finalUrl, redirectCount: result.redirectCount };
}
