const WORDS = (
  "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor " +
  "incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud " +
  "exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute " +
  "irure in reprehenderit voluptate velit esse cillum eu fugiat nulla pariatur " +
  "excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt " +
  "mollit anim id est laborum"
).split(" ");

function randomWord() {
  return WORDS[Math.floor(Math.random() * WORDS.length)];
}

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function randomSentence(minWords = 8, maxWords = 16) {
  const count = minWords + Math.floor(Math.random() * (maxWords - minWords));
  const words = Array.from({ length: count }, randomWord);
  return `${capitalize(words[0])} ${words.slice(1).join(" ")}.`;
}

export function generateTitle(wordCount = 6) {
  const words = Array.from({ length: wordCount }, randomWord);
  return words.map((w, i) => (i === 0 ? capitalize(w) : w)).join(" ");
}

export function generateParagraphs(count = 3) {
  return Array.from({ length: count }, () => {
    const sentenceCount = 4 + Math.floor(Math.random() * 3);
    return Array.from({ length: sentenceCount }, () => randomSentence()).join(" ");
  });
}

export function generateList(count = 5) {
  return Array.from({ length: count }, () => {
    const wordCount = 3 + Math.floor(Math.random() * 6);
    const words = Array.from({ length: wordCount }, randomWord);
    return words.map((w, i) => (i === 0 ? capitalize(w) : w)).join(" ");
  });
}
