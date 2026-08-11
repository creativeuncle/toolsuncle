const BLOCKED_HOSTNAMES = new Set(["localhost", "0.0.0.0", "::1"]);

function isPrivateIPv4(host) {
  const parts = host.split(".").map(Number);
  if (parts.length !== 4 || parts.some((p) => Number.isNaN(p))) return false;
  const [a, b] = parts;
  if (a === 10) return true;
  if (a === 127) return true;
  if (a === 169 && b === 254) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  return false;
}

// Basic SSRF guard: reject loopback/private/link-local targets before we
// let the scanner fetch them. Not exhaustive (DNS rebinding etc. is out of
// scope for this phase) but stops the obvious cases.
export function assertPublicUrl(urlString) {
  if (process.env.ALLOW_PRIVATE_SCAN_TARGETS === "true") return;

  const url = new URL(urlString);
  const hostname = url.hostname.toLowerCase();

  if (BLOCKED_HOSTNAMES.has(hostname)) {
    throw new Error("That host isn't allowed to be scanned.");
  }
  if (isPrivateIPv4(hostname)) {
    throw new Error("Private/internal addresses can't be scanned.");
  }
  if (hostname.endsWith(".local")) {
    throw new Error("Local network addresses can't be scanned.");
  }
}
