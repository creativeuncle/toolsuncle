import * as cheerio from "cheerio";

function toAbsolute(url, base) {
  try {
    return new URL(url, base).toString();
  } catch {
    return null;
  }
}

export function analyzePage(html, pageUrl) {
  const $ = cheerio.load(html);
  const origin = new URL(pageUrl).origin;

  const images = $("img")
    .map((_, el) => {
      const $el = $(el);
      const src = toAbsolute($el.attr("src") || $el.attr("data-src") || "", pageUrl);
      const alt = $el.attr("alt");
      return { src, alt: alt || "", hasAlt: alt !== undefined && alt.trim().length > 0, hasWidthHeight: Boolean($el.attr("width") && $el.attr("height")) };
    })
    .get()
    .filter((img) => img.src);

  const links = $("a[href]")
    .map((_, el) => {
      const $el = $(el);
      const rawHref = $el.attr("href") || "";
      const href = toAbsolute(rawHref, pageUrl);
      const isPlaceholder = rawHref.trim() === "" || rawHref.trim() === "#";
      let isInternal = false;
      if (href) {
        try {
          isInternal = new URL(href).origin === origin;
        } catch {
          isInternal = false;
        }
      }
      return { rawHref, href, text: $el.text().trim(), isInternal, isPlaceholder, hasOnclick: Boolean($el.attr("onclick")) };
    })
    .get();

  const scripts = $("script")
    .map((_, el) => {
      const $el = $(el);
      const src = $el.attr("src");
      return {
        src: src ? toAbsolute(src, pageUrl) : null,
        inline: !src,
        async: $el.attr("async") !== undefined,
        defer: $el.attr("defer") !== undefined,
        inHead: $el.closest("head").length > 0,
        type: $el.attr("type") || "",
      };
    })
    .get();

  const stylesheets = $('link[rel="stylesheet"]')
    .map((_, el) => {
      const $el = $(el);
      return {
        href: toAbsolute($el.attr("href") || "", pageUrl),
        media: $el.attr("media") || "",
      };
    })
    .get()
    .filter((s) => s.href);

  const jsonLd = [];
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const parsed = JSON.parse($(el).contents().text());
      jsonLd.push(parsed);
    } catch {
      // ignore malformed JSON-LD
    }
  });

  const headingCounts = {};
  const headingOrder = [];
  ["h1", "h2", "h3", "h4", "h5", "h6"].forEach((tag) => {
    const els = $(tag);
    headingCounts[tag] = els.length;
  });
  $("h1, h2, h3, h4, h5, h6").each((_, el) => {
    headingOrder.push({ level: Number(el.tagName.slice(1)), text: $(el).text().trim() });
  });

  const bodyText = $("body").text().replace(/\s+/g, " ").trim();
  const wordCount = bodyText ? bodyText.split(" ").length : 0;

  const inputsWithoutLabels = $("input:not([type=hidden]):not([type=submit]):not([type=button]), textarea, select")
    .map((_, el) => {
      const $el = $(el);
      const id = $el.attr("id");
      const hasLabelFor = id ? $(`label[for="${id}"]`).length > 0 : false;
      const hasAriaLabel = Boolean($el.attr("aria-label") || $el.attr("aria-labelledby"));
      const wrappedInLabel = $el.closest("label").length > 0;
      return { tag: el.tagName, hasLabel: hasLabelFor || hasAriaLabel || wrappedInLabel };
    })
    .get();

  const iconOnlyButtons = $("button, a[role=button]")
    .map((_, el) => {
      const $el = $(el);
      const text = $el.text().trim();
      const hasAriaLabel = Boolean($el.attr("aria-label") || $el.attr("aria-labelledby") || $el.attr("title"));
      const hasIconChild = $el.find("svg, img").length > 0;
      return { hasText: text.length > 0, hasAriaLabel, hasIconChild };
    })
    .get();

  const nonInteractiveWithOnclick = $("div[onclick], span[onclick]")
    .map((_, el) => {
      const $el = $(el);
      return { hasTabindex: $el.attr("tabindex") !== undefined, hasRole: Boolean($el.attr("role")) };
    })
    .get();

  const allLinkTags = $("link[href]")
    .map((_, el) => {
      const $el = $(el);
      return { href: toAbsolute($el.attr("href") || "", pageUrl), rel: ($el.attr("rel") || "").toLowerCase() };
    })
    .get()
    .filter((l) => l.href);

  return {
    $,
    origin,
    title: $("title").first().text().trim(),
    metaGenerator: $('meta[name="generator"]').attr("content") || "",
    htmlAttrs: $("html").length ? $("html").get(0).attribs || {} : {},
    allLinkTags,
    metaDescription: $('meta[name="description"]').attr("content") || "",
    canonical: $('link[rel="canonical"]').attr("href") || "",
    viewportMeta: $('meta[name="viewport"]').attr("content") || "",
    lang: $("html").attr("lang") || "",
    favicon: $('link[rel="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"]').attr("href") || "",
    ogTags: {
      title: $('meta[property="og:title"]').attr("content") || "",
      description: $('meta[property="og:description"]').attr("content") || "",
      image: $('meta[property="og:image"]').attr("content") || "",
    },
    twitterCard: $('meta[name="twitter:card"]').attr("content") || "",
    images,
    links,
    scripts,
    stylesheets,
    jsonLd,
    headingCounts,
    headingOrder,
    h1Texts: $("h1").map((_, el) => $(el).text().trim()).get(),
    wordCount,
    inputsWithoutLabels,
    iconOnlyButtons,
    nonInteractiveWithOnclick,
    bodyText,
  };
}
