import { TECH_SIGNATURES, TECH_CATEGORY_LABELS } from "../techSignatures.js";
import { getCertificateIssuer } from "../sslInfo.js";

export async function techCheck(ctx) {
  const { page, headers, html, origin, browser } = ctx;

  const cookieNames = (headers?.getSetCookie?.() || (headers?.get?.("set-cookie") ? [headers.get("set-cookie")] : []))
    .map((c) => c.split("=")[0]?.trim())
    .filter(Boolean);

  // On a deep scan, prefer the post-JS-execution DOM snapshot over the raw
  // static fetch — client-side-rendered apps (React/Vue/etc.) inject their
  // scripts and content after load, so the static HTML alone can look
  // empty and miss every signature. Merge both so nothing that only shows
  // up in one is lost.
  const rendered = browser?.ok ? browser : null;
  const detectCtx = {
    html: rendered ? `${html}\n${rendered.renderedHtml}` : html,
    headers,
    scripts: rendered ? [...page.scripts, ...rendered.scriptSrcs.map((src) => ({ src }))] : page.scripts,
    stylesheets: page.stylesheets,
    allLinkTags: rendered ? [...page.allLinkTags, ...rendered.linkHrefs.map((href) => ({ href }))] : page.allLinkTags,
    metaGenerator: page.metaGenerator || rendered?.metaGenerator || "",
    htmlAttrs: { ...page.htmlAttrs, ...(rendered?.htmlAttrs || {}) },
    cookieNames,
  };

  const detected = TECH_SIGNATURES.filter((sig) => {
    try {
      return sig.test(detectCtx);
    } catch {
      return false;
    }
  });

  const grouped = {};
  detected.forEach((sig) => {
    if (!grouped[sig.category]) grouped[sig.category] = [];
    grouped[sig.category].push(sig.name);
  });

  if (origin.startsWith("https://")) {
    try {
      const issuer = await getCertificateIssuer(new URL(origin).hostname);
      if (issuer) {
        grouped.security = [...(grouped.security || []), `SSL: ${issuer}`];
      }
    } catch {
      // best-effort only
    }
  }

  const groups = Object.entries(grouped).map(([category, items]) => ({
    category,
    label: TECH_CATEGORY_LABELS[category] || category,
    items: [...new Set(items)],
  }));

  return {
    id: "tech",
    name: "Technology Stack",
    groups,
    detectedCount: groups.reduce((sum, g) => sum + g.items.length, 0),
  };
}
