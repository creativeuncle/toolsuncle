export const HASHTAG_CATEGORIES = {
  general: [
    "trending", "viral", "instagood", "photooftheday", "love", "explorepage",
    "picoftheday", "follow", "likeforlike", "instadaily", "bestoftheday",
    "happy", "beautiful", "life", "instalike", "followforfollow", "reels",
    "reelsinstagram", "contentcreator", "socialmedia",
  ],
  instagram: [
    "instagood", "instadaily", "instamood", "igers", "instapic", "photodump",
    "explore", "reelitfeelit", "reelsvideo", "instastory", "postoftheday",
    "instalike", "picoftheday", "instafollow", "reelsindia", "grid",
    "aesthetic", "feed", "story", "content",
  ],
  business: [
    "smallbusiness", "entrepreneur", "startup", "marketing", "business",
    "digitalmarketing", "branding", "growth", "successmindset", "hustle",
    "businessowner", "leadership", "innovation", "productivity", "sales",
    "networking", "businesstips", "workfromhome", "ecommerce", "motivation",
  ],
  fitness: [
    "fitness", "gym", "workout", "fitfam", "training", "fitnessmotivation",
    "healthylifestyle", "bodybuilding", "gains", "cardio", "strengthtraining",
    "fitlife", "personaltrainer", "wellness", "nutrition", "gymlife",
    "muscle", "exercise", "fitspo", "transformation",
  ],
  travel: [
    "travel", "wanderlust", "travelgram", "explore", "adventure", "vacation",
    "traveling", "instatravel", "traveler", "trip", "travelphotography",
    "nature", "backpacking", "roadtrip", "travelblogger", "getaway",
    "worldtravel", "beautifuldestinations", "passport", "tourism",
  ],
  food: [
    "foodie", "foodporn", "foodphotography", "instafood", "yummy", "foodblogger",
    "delicious", "homemade", "foodstagram", "tasty", "cooking", "chef",
    "foodlover", "recipe", "eeeeeats", "dinner", "brunch", "healthyfood",
    "foodgasm", "hungry",
  ],
  fashion: [
    "fashion", "style", "ootd", "fashionblogger", "outfit", "fashionista",
    "streetstyle", "styleinspo", "trendy", "lookbook", "instafashion",
    "fashionstyle", "outfitoftheday", "wiw", "fashiondiaries", "accessories",
    "shopping", "model", "designer", "fashionaddict",
  ],
  technology: [
    "technology", "tech", "innovation", "coding", "programming", "developer",
    "ai", "artificialintelligence", "software", "startup", "gadgets",
    "techie", "webdevelopment", "machinelearning", "futuretech", "engineering",
    "computerscience", "data", "cybersecurity", "automation",
  ],
};

export const CATEGORY_LABELS = {
  general: "General",
  instagram: "Instagram",
  business: "Business",
  fitness: "Fitness & Gym",
  travel: "Travel",
  food: "Food",
  fashion: "Fashion",
  technology: "Technology",
};

export function slugifyTag(word) {
  return word
    .trim()
    .replace(/[^a-zA-Z0-9]+/g, "")
    .replace(/^\d+/, "");
}

export function generateHashtags(keywords, category, count) {
  const words = keywords
    .split(/[,\n]+/)
    .map((w) => w.trim())
    .filter(Boolean);

  const tags = new Set();

  words.forEach((word) => {
    const single = slugifyTag(word);
    if (single) tags.add(single);
  });

  if (words.length > 1) {
    const merged = slugifyTag(words.join(""));
    if (merged) tags.add(merged);
  }

  const bank = HASHTAG_CATEGORIES[category] || HASHTAG_CATEGORIES.general;
  const shuffled = [...bank].sort(() => Math.random() - 0.5);

  words.forEach((word) => {
    const base = slugifyTag(word);
    if (!base) return;
    const combo = slugifyTag(`${word}${bank[Math.floor(Math.random() * bank.length)]}`);
    if (combo) tags.add(combo);
  });

  for (const tag of shuffled) {
    if (tags.size >= count) break;
    tags.add(tag);
  }

  return Array.from(tags).slice(0, count).map((t) => `#${t}`);
}
