import { HINDI_DICTIONARY } from "./hindiDictionary";

const CONSONANTS = [
  ["ksh", "क्ष"],
  ["gy", "ज्ञ"],
  ["jn", "ज्ञ"],
  ["tr", "त्र"],
  ["shr", "श्र"],
  ["chh", "छ"],
  ["tth", "ठ"],
  ["ddh", "ढ"],
  ["kh", "ख"],
  ["gh", "घ"],
  ["ch", "च"],
  ["jh", "झ"],
  ["ph", "फ"],
  ["bh", "भ"],
  ["th", "थ"],
  ["dh", "ध"],
  ["sh", "श"],
  ["Sh", "ष"],
  ["tt", "ट"],
  ["dd", "ड"],
  ["k", "क"],
  ["g", "ग"],
  ["j", "ज"],
  ["t", "त"],
  ["d", "द"],
  ["n", "न"],
  ["p", "प"],
  ["f", "फ़"],
  ["b", "ब"],
  ["m", "म"],
  ["y", "य"],
  ["r", "र"],
  ["l", "ल"],
  ["v", "व"],
  ["w", "व"],
  ["s", "स"],
  ["z", "ज़"],
  ["h", "ह"],
  ["q", "क़"],
  ["x", "क्ष"],
];

// Consonant classes ("stops") that trigger anusvara nasalization when
// preceded by a bare "n"/"m" (Hindi spelling convention: संकट not सन्कट;
// but न्य/न्व/न्ह stay real conjuncts, e.g. dhanyavaad -> धन्यवाद).
const STOPS = new Set([
  "क", "ख", "ग", "घ",
  "च", "छ", "ज", "झ",
  "ट", "ठ", "ड", "ढ",
  "त", "थ", "द", "ध",
  "प", "फ", "ब", "भ",
]);

const VOWELS = [
  ["aa", ["आ", "ा"]],
  ["ai", ["ऐ", "ै"]],
  ["au", ["औ", "ौ"]],
  ["ee", ["ई", "ी"]],
  ["oo", ["ऊ", "ू"]],
  ["a", ["अ", null]],
  ["i", ["इ", "ि"]],
  ["u", ["उ", "ु"]],
  ["e", ["ए", "े"]],
  ["o", ["ओ", "ो"]],
];

function buildTokenTable() {
  const table = [];
  for (const [k, v] of CONSONANTS) table.push({ key: k.toLowerCase(), type: "C", val: v });
  for (const [k, v] of VOWELS) table.push({ key: k, type: "V", val: v });
  table.sort((a, b) => b.key.length - a.key.length);
  return table;
}

const TOKEN_TABLE = buildTokenTable();

function tokenize(word) {
  const tokens = [];
  let i = 0;
  while (i < word.length) {
    let matched = null;
    for (const entry of TOKEN_TABLE) {
      if (word.startsWith(entry.key, i)) {
        matched = entry;
        break;
      }
    }
    if (matched) {
      tokens.push(matched);
      i += matched.key.length;
    } else {
      tokens.push({ type: "X", val: word[i] });
      i += 1;
    }
  }
  return tokens;
}

function applyAnusvara(tokens) {
  const out = [];
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    const next = tokens[i + 1];
    if (
      t.type === "C" &&
      (t.val === "न" || t.val === "म") &&
      next &&
      next.type === "C" &&
      STOPS.has(next.val)
    ) {
      out.push({ type: "A", val: "ं" });
    } else {
      out.push(t);
    }
  }
  return out;
}

function render(tokens) {
  let out = "";
  let prevType = null;
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (t.type === "C") {
      if (prevType === "C") out += "्";
      out += t.val;
      prevType = "C";
    } else if (t.type === "V") {
      const [indep, matra] = t.val;
      if (prevType === "C") {
        if (matra !== null) out += matra;
      } else {
        out += indep;
      }
      prevType = "V";
    } else if (t.type === "A") {
      out += "ं";
      prevType = "A";
    } else {
      out += t.val;
      prevType = "X";
    }
  }
  return out;
}

export function transliterateWord(word) {
  const lower = word.toLowerCase();
  if (HINDI_DICTIONARY[lower]) return HINDI_DICTIONARY[lower];
  const tokens = tokenize(lower);
  const withAnusvara = applyAnusvara(tokens);
  return render(withAnusvara);
}

export function transliterate(text) {
  return text.replace(/[a-zA-Z]+/g, (w) => transliterateWord(w));
}
