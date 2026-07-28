import byGroup from "unicode-emoji-json/data-by-group.json";
import { Smile, Cat, UtensilsCrossed, Volleyball, Car, Lightbulb, Heart, Flag } from "lucide-react";

const GROUP_META = [
  { slugs: ["smileys_emotion", "people_body"], name: "Smileys & People", icon: Smile },
  { slugs: ["animals_nature"], name: "Animals & Nature", icon: Cat },
  { slugs: ["food_drink"], name: "Food & Drink", icon: UtensilsCrossed },
  { slugs: ["activities"], name: "Activities", icon: Volleyball },
  { slugs: ["travel_places"], name: "Travel & Places", icon: Car },
  { slugs: ["objects"], name: "Objects", icon: Lightbulb },
  { slugs: ["symbols"], name: "Symbols", icon: Heart },
  { slugs: ["flags"], name: "Flags", icon: Flag },
];

function findGroup(slug) {
  return byGroup.find((g) => g.slug === slug);
}

export const EMOJI_GROUPS = GROUP_META.map((meta) => ({
  name: meta.name,
  icon: meta.icon,
  emojis: meta.slugs.flatMap((slug) => findGroup(slug)?.emojis || []),
}));

export const ALL_EMOJIS = EMOJI_GROUPS.flatMap((g) => g.emojis);

export function searchEmojis(query) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return ALL_EMOJIS.filter(
    (e) => e.name.toLowerCase().includes(q) || e.slug.toLowerCase().includes(q.replace(/\s+/g, "_"))
  );
}
