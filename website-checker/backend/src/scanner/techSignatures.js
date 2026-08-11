// Lightweight, in-house tech-stack fingerprinting — same idea as
// Wappalyzer/BuiltWith (pattern-match HTML/headers/cookies/script URLs
// against known signatures), no third-party API. Each `test` receives the
// shared detection context and returns true/false.

function urlIncludes(urls, needle) {
  return urls.some((u) => u && u.toLowerCase().includes(needle));
}

function htmlHas(ctx, pattern) {
  return pattern.test(ctx.html);
}

function headerIncludes(ctx, name, needle) {
  const val = ctx.headers?.get?.(name);
  return Boolean(val && val.toLowerCase().includes(needle));
}

function cookieNameIncludes(ctx, needle) {
  return ctx.cookieNames.some((c) => c.toLowerCase().includes(needle));
}

const scriptUrls = (ctx) => ctx.scripts.map((s) => s.src).filter(Boolean);
const styleUrls = (ctx) => ctx.stylesheets.map((s) => s.href).filter(Boolean);
const linkUrls = (ctx) => ctx.allLinkTags.map((l) => l.href).filter(Boolean);
const allAssetUrls = (ctx) => [...scriptUrls(ctx), ...styleUrls(ctx), ...linkUrls(ctx)];

export const TECH_SIGNATURES = [
  // --- CMS / website builder ---
  { name: "WordPress", category: "cms", test: (ctx) => htmlHas(ctx, /wp-content|wp-includes/i) || /wordpress/i.test(ctx.metaGenerator) },
  { name: "Shopify", category: "cms", test: (ctx) => urlIncludes(allAssetUrls(ctx), "cdn.shopify.com") || htmlHas(ctx, /Shopify\.theme/i) },
  { name: "Wix", category: "cms", test: (ctx) => urlIncludes(allAssetUrls(ctx), "static.wixstatic.com") || /wix\.com/i.test(ctx.metaGenerator) },
  { name: "Squarespace", category: "cms", test: (ctx) => urlIncludes(allAssetUrls(ctx), "squarespace.com") || htmlHas(ctx, /static1\.squarespace\.com/i) },
  { name: "Webflow", category: "cms", test: (ctx) => Boolean(ctx.htmlAttrs["data-wf-site"]) || htmlHas(ctx, /w-webflow-badge/i) },
  { name: "Ghost", category: "cms", test: (ctx) => /ghost/i.test(ctx.metaGenerator) || urlIncludes(allAssetUrls(ctx), "ghost.io") },
  { name: "Drupal", category: "cms", test: (ctx) => /drupal/i.test(ctx.metaGenerator) || htmlHas(ctx, /Drupal\.settings/i) },
  { name: "Joomla", category: "cms", test: (ctx) => /joomla/i.test(ctx.metaGenerator) },
  { name: "Magento", category: "cms", test: (ctx) => htmlHas(ctx, /Mage\.Cookies|static\/frontend\/Magento/i) },
  { name: "BigCommerce", category: "cms", test: (ctx) => urlIncludes(allAssetUrls(ctx), "cdn11.bigcommerce.com") },
  { name: "Framer", category: "cms", test: (ctx) => urlIncludes(allAssetUrls(ctx), "framerusercontent.com") || /framer/i.test(ctx.metaGenerator) },

  // --- Frontend framework / library ---
  { name: "Next.js", category: "frontend", test: (ctx) => htmlHas(ctx, /__NEXT_DATA__/) || urlIncludes(scriptUrls(ctx), "/_next/static") },
  { name: "Nuxt", category: "frontend", test: (ctx) => htmlHas(ctx, /__NUXT__/) || urlIncludes(scriptUrls(ctx), "/_nuxt/") },
  { name: "React", category: "frontend", test: (ctx) => htmlHas(ctx, /data-reactroot|data-reactid/i) || urlIncludes(scriptUrls(ctx), "react-dom") },
  { name: "Vue.js", category: "frontend", test: (ctx) => htmlHas(ctx, /data-v-[a-f0-9]{6,8}/i) || urlIncludes(scriptUrls(ctx), "vue.js") || urlIncludes(scriptUrls(ctx), "vue.min.js") },
  { name: "Angular", category: "frontend", test: (ctx) => Boolean(ctx.htmlAttrs["ng-version"]) },
  { name: "SvelteKit", category: "frontend", test: (ctx) => urlIncludes(scriptUrls(ctx), "/_app/immutable") },
  { name: "jQuery", category: "frontend", test: (ctx) => scriptUrls(ctx).some((u) => /jquery(-[\d.]+)?(\.min)?\.js/i.test(u)) },
  { name: "Bootstrap", category: "frontend", test: (ctx) => allAssetUrls(ctx).some((u) => /bootstrap(\.min)?\.(css|js)/i.test(u)) },
  { name: "Alpine.js", category: "frontend", test: (ctx) => urlIncludes(scriptUrls(ctx), "alpinejs") || htmlHas(ctx, /\sx-data=/) },
  { name: "htmx", category: "frontend", test: (ctx) => urlIncludes(scriptUrls(ctx), "htmx") || htmlHas(ctx, /\shx-(get|post)=/) },

  // --- Backend / language (headers + cookies) ---
  { name: "PHP", category: "backend", test: (ctx) => headerIncludes(ctx, "x-powered-by", "php") || cookieNameIncludes(ctx, "phpsessid") },
  { name: "ASP.NET", category: "backend", test: (ctx) => headerIncludes(ctx, "x-powered-by", "asp.net") || Boolean(ctx.headers?.get?.("x-aspnet-version")) || cookieNameIncludes(ctx, "asp.net_sessionid") },
  { name: "Express (Node.js)", category: "backend", test: (ctx) => headerIncludes(ctx, "x-powered-by", "express") },
  { name: "Ruby on Rails", category: "backend", test: (ctx) => Boolean(ctx.headers?.get?.("x-runtime")) || headerIncludes(ctx, "server", "passenger") },
  { name: "Java", category: "backend", test: (ctx) => cookieNameIncludes(ctx, "jsessionid") || headerIncludes(ctx, "server", "tomcat") },
  { name: "Django/Python", category: "backend", test: (ctx) => cookieNameIncludes(ctx, "csrftoken") || headerIncludes(ctx, "server", "gunicorn") || headerIncludes(ctx, "server", "werkzeug") },

  // --- CDN / hosting ---
  { name: "Cloudflare", category: "cdn", test: (ctx) => Boolean(ctx.headers?.get?.("cf-ray")) || headerIncludes(ctx, "server", "cloudflare") },
  { name: "Vercel", category: "cdn", test: (ctx) => Boolean(ctx.headers?.get?.("x-vercel-id")) },
  { name: "Netlify", category: "cdn", test: (ctx) => Boolean(ctx.headers?.get?.("x-nf-request-id")) || headerIncludes(ctx, "server", "netlify") },
  { name: "Amazon CloudFront", category: "cdn", test: (ctx) => Boolean(ctx.headers?.get?.("x-amz-cf-id")) || headerIncludes(ctx, "via", "cloudfront") },
  { name: "Fastly", category: "cdn", test: (ctx) => Boolean(ctx.headers?.get?.("x-fastly-request-id")) },
  { name: "Akamai", category: "cdn", test: (ctx) => headerIncludes(ctx, "server", "akamaighost") },
  { name: "GitHub Pages", category: "cdn", test: (ctx) => headerIncludes(ctx, "server", "github.com") },

  // --- Analytics / marketing ---
  { name: "Google Analytics", category: "analytics", test: (ctx) => urlIncludes(scriptUrls(ctx), "google-analytics.com") || urlIncludes(scriptUrls(ctx), "googletagmanager.com/gtag") },
  { name: "Google Tag Manager", category: "analytics", test: (ctx) => urlIncludes(scriptUrls(ctx), "googletagmanager.com/gtm.js") },
  { name: "Meta (Facebook) Pixel", category: "analytics", test: (ctx) => urlIncludes(scriptUrls(ctx), "connect.facebook.net") && htmlHas(ctx, /fbq\(/) },
  { name: "Hotjar", category: "analytics", test: (ctx) => urlIncludes(scriptUrls(ctx), "static.hotjar.com") },
  { name: "Microsoft Clarity", category: "analytics", test: (ctx) => urlIncludes(scriptUrls(ctx), "clarity.ms") },
  { name: "HubSpot", category: "analytics", test: (ctx) => urlIncludes(scriptUrls(ctx), "js.hs-scripts.com") || urlIncludes(scriptUrls(ctx), "hs-analytics") },
  { name: "Segment", category: "analytics", test: (ctx) => urlIncludes(scriptUrls(ctx), "cdn.segment.com") },
  { name: "Mixpanel", category: "analytics", test: (ctx) => urlIncludes(scriptUrls(ctx), "cdn.mxpnl.com") },

  // --- Fonts ---
  { name: "Google Fonts", category: "fonts", test: (ctx) => urlIncludes([...styleUrls(ctx), ...linkUrls(ctx)], "fonts.googleapis.com") || urlIncludes(linkUrls(ctx), "fonts.gstatic.com") },
  { name: "Adobe Fonts (Typekit)", category: "fonts", test: (ctx) => urlIncludes(allAssetUrls(ctx), "use.typekit.net") },
  { name: "Font Awesome", category: "fonts", test: (ctx) => allAssetUrls(ctx).some((u) => /fontawesome|kit\.fontawesome\.com/i.test(u)) },

  // --- Chat / support widgets ---
  { name: "Intercom", category: "chat", test: (ctx) => urlIncludes(scriptUrls(ctx), "widget.intercom.io") || htmlHas(ctx, /Intercom\(/) },
  { name: "Zendesk", category: "chat", test: (ctx) => urlIncludes(scriptUrls(ctx), "static.zdassets.com") },
  { name: "Tawk.to", category: "chat", test: (ctx) => urlIncludes(scriptUrls(ctx), "embed.tawk.to") },
  { name: "Crisp", category: "chat", test: (ctx) => urlIncludes(scriptUrls(ctx), "client.crisp.chat") },
  { name: "Drift", category: "chat", test: (ctx) => urlIncludes(scriptUrls(ctx), "js.driftt.com") },

  // --- Payments / e-commerce ---
  { name: "Stripe", category: "payment", test: (ctx) => urlIncludes(scriptUrls(ctx), "js.stripe.com") },
  { name: "PayPal", category: "payment", test: (ctx) => urlIncludes(scriptUrls(ctx), "paypal.com/sdk/js") || urlIncludes(allAssetUrls(ctx), "paypalobjects.com") },
  { name: "Razorpay", category: "payment", test: (ctx) => urlIncludes(scriptUrls(ctx), "checkout.razorpay.com") },
  { name: "WooCommerce", category: "payment", test: (ctx) => htmlHas(ctx, /woocommerce/i) || cookieNameIncludes(ctx, "woocommerce_cart_hash") },
];

export const TECH_CATEGORY_LABELS = {
  cms: "CMS / Website Builder",
  frontend: "Frontend Framework",
  backend: "Backend / Language",
  cdn: "CDN / Hosting",
  analytics: "Analytics & Marketing",
  fonts: "Fonts",
  chat: "Chat / Support",
  payment: "Payments / E-commerce",
  security: "SSL / Security",
};
