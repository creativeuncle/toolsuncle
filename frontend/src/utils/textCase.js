const MINOR_WORDS = new Set([
  "a", "an", "and", "as", "at", "but", "by", "for", "in", "nor", "of",
  "on", "or", "per", "so", "the", "to", "up", "yet",
]);

export function toSentenceCase(text) {
  return text
    .toLowerCase()
    .replace(/(^\s*\w|[.!?]\s*\w)/g, (m) => m.toUpperCase());
}

export function toLowerCase(text) {
  return text.toLowerCase();
}

export function toUpperCase(text) {
  return text.toUpperCase();
}

export function toCapitalizedCase(text) {
  return text.replace(/\w\S*/g, (word) => word[0].toUpperCase() + word.slice(1).toLowerCase());
}

export function toAlternatingCase(text) {
  let i = 0;
  return text.replace(/[a-zA-Z]/g, (ch) => {
    const out = i % 2 === 0 ? ch.toLowerCase() : ch.toUpperCase();
    i += 1;
    return out;
  });
}

export function toTitleCase(text) {
  const words = text.split(/(\s+)/);
  let wordIndex = -1;
  const wordCount = words.filter((w) => !/^\s+$/.test(w) && w.length > 0).length;
  return words
    .map((w) => {
      if (/^\s+$/.test(w) || w.length === 0) return w;
      wordIndex += 1;
      const lower = w.toLowerCase();
      const isEdge = wordIndex === 0 || wordIndex === wordCount - 1;
      if (!isEdge && MINOR_WORDS.has(lower)) return lower;
      return w[0].toUpperCase() + w.slice(1).toLowerCase();
    })
    .join("");
}

export function toInverseCase(text) {
  return text
    .split("")
    .map((ch) => (ch === ch.toUpperCase() ? ch.toLowerCase() : ch.toUpperCase()))
    .join("");
}

export const CASE_CONVERTERS = [
  { id: "sentence", label: "Sentence case", short: "Sc", fn: toSentenceCase },
  { id: "lower", label: "lower case", short: "lc", fn: toLowerCase },
  { id: "upper", label: "UPPER CASE", short: "UC", fn: toUpperCase },
  { id: "capitalized", label: "Capitalized Case", short: "CC", fn: toCapitalizedCase },
  { id: "alternating", label: "aLtErNaTiNg cAsE", short: "aC", fn: toAlternatingCase },
  { id: "title", label: "Title Case", short: "TC", fn: toTitleCase },
  { id: "inverse", label: "InVeRsE CaSe", short: "iC", fn: toInverseCase },
];
