import { issue } from "../issue.js";

const SECURITY_HEADERS = [
  { key: "content-security-policy", title: "Content-Security-Policy header" },
  { key: "strict-transport-security", title: "Strict-Transport-Security (HSTS) header" },
  { key: "x-content-type-options", title: "X-Content-Type-Options header" },
  { key: "x-frame-options", title: "X-Frame-Options header" },
  { key: "referrer-policy", title: "Referrer-Policy header" },
];

export function securityCheck(ctx) {
  const issues = [];
  const { page, headers, probes, origin } = ctx;

  if (origin.startsWith("http://")) {
    issues.push(
      issue({
        title: "Site not served over HTTPS",
        description: "The site is accessible over plain HTTP, which exposes visitors to eavesdropping and tampering.",
        severity: "critical",
      })
    );
  }

  if (probes.env?.ok && probes.env.status === 200) {
    issues.push(
      issue({
        title: "Publicly accessible /.env",
        description: "/.env is publicly readable and may leak credentials or configuration data.",
        severity: "critical",
      })
    );
  }
  if (probes.gitConfig?.ok && probes.gitConfig.status === 200) {
    issues.push(
      issue({
        title: "Publicly accessible /.git/config",
        description: "/.git/config is publicly readable and may leak repository data.",
        severity: "critical",
      })
    );
  }
  if (probes.gitHead?.ok && probes.gitHead.status === 200) {
    issues.push(
      issue({
        title: "Publicly accessible /.git/HEAD",
        description: "/.git/HEAD is publicly readable and may leak repository data.",
        severity: "critical",
      })
    );
  }
  if (probes.admin?.ok && probes.admin.status === 200) {
    issues.push(
      issue({
        title: "Publicly reachable admin path",
        description: `A common admin path (${probes.admin.path}) responded with 200, which may expose a login panel to scanners.`,
        severity: "medium",
      })
    );
  }

  const missingHeaders = SECURITY_HEADERS.filter((h) => !headers?.get?.(h.key));
  missingHeaders.forEach((h) => {
    issues.push(
      issue({
        title: `Missing ${h.title}`,
        description: `The response is missing the ${h.key} header, weakening the site's defense against common browser-based attacks.`,
        severity: "low",
      })
    );
  });

  const serverHeader = headers?.get?.("server");
  const poweredBy = headers?.get?.("x-powered-by");
  if (serverHeader || poweredBy) {
    issues.push(
      issue({
        title: "Exposed server information",
        description: `Response headers reveal server details (${[serverHeader, poweredBy].filter(Boolean).join(", ")}), which can help attackers target known vulnerabilities.`,
        severity: "low",
      })
    );
  }

  if (origin.startsWith("https://")) {
    const insecureRefs = [...page.images.map((i) => i.src), ...page.scripts.map((s) => s.src), ...page.stylesheets.map((s) => s.href)].filter(
      (u) => u && u.startsWith("http://")
    );
    if (insecureRefs.length > 0) {
      issues.push(
        issue({
          title: "Mixed content",
          description: `${insecureRefs.length} resource(s) are loaded over plain HTTP on an HTTPS page, which browsers may block or flag insecure.`,
          severity: "medium",
        })
      );
    }
  }

  const setCookie = headers?.get?.("set-cookie");
  if (setCookie) {
    const lower = setCookie.toLowerCase();
    const missingFlags = [];
    if (!lower.includes("secure")) missingFlags.push("Secure");
    if (!lower.includes("httponly")) missingFlags.push("HttpOnly");
    if (!lower.includes("samesite")) missingFlags.push("SameSite");
    if (missingFlags.length > 0) {
      issues.push(
        issue({
          title: "Cookies missing security flags",
          description: `Cookies set by this page are missing: ${missingFlags.join(", ")}.`,
          severity: "medium",
        })
      );
    }
  }

  const acao = headers?.get?.("access-control-allow-origin");
  const acac = headers?.get?.("access-control-allow-credentials");
  if (acao === "*" && acac === "true") {
    issues.push(
      issue({
        title: "Insecure CORS configuration",
        description: "Access-Control-Allow-Origin is '*' together with Allow-Credentials 'true', which is an invalid and unsafe combination.",
        severity: "medium",
      })
    );
  }

  return {
    id: "security",
    name: "Security",
    issues,
    comingSoon: ["Vulnerable dependency scanning", "TLS certificate chain and cipher analysis"],
  };
}
