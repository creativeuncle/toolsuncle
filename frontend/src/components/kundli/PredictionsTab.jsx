import { FlaskConical } from "lucide-react";

const CATEGORIES = ["Health", "Emotion", "Luck", "Profession", "Personal Life", "Travel"];

const VARIANTS = {
  Health: [
    "You will feel robust and energetic. Staying active and eating well will keep minor ailments away.",
    "Watch your energy levels — a balanced routine and enough rest will serve you better than pushing hard.",
    "A good phase for fitness. Starting a new exercise or wellness routine now will pay off.",
    "Stress may build up if ignored. Make time to unwind and look after your health proactively.",
  ],
  Emotion: [
    "You'll feel emotionally settled, with warmth flowing easily between you and loved ones.",
    "Sensitivity runs high — be mindful of how you react to small triggers around you.",
    "A cheerful, sociable mood makes this a good time to reconnect with people you've missed.",
    "You may feel reflective and prefer quiet time over crowds — that's alright, honour it.",
  ],
  Luck: [
    "Fortune favours steady effort now rather than shortcuts — consistency pays off.",
    "An unexpected opportunity could open up if you stay alert and take initiative.",
    "Financial matters look stable; a good time to plan rather than gamble.",
    "Small strokes of luck are likely in everyday matters — keep an open mind.",
  ],
  Profession: [
    "Hard work gets noticed. Recognition or a new responsibility could come your way.",
    "Collaboration works better than going solo right now — lean on your team.",
    "A good period to pitch ideas or start something new at work.",
    "Patience is key — progress may feel slow, but it is steady and real.",
  ],
  "Personal Life": [
    "Relationships feel warm and communicative; a good time to deepen bonds.",
    "Family matters need attention — small gestures will go a long way.",
    "Singles may find new connections forming; those attached will enjoy quality time.",
    "A good phase to resolve old misunderstandings with honest conversation.",
  ],
  Travel: [
    "Short trips, especially for work or family, are likely and should go smoothly.",
    "A longer journey may be on the cards — plan logistics a little ahead of time.",
    "Travel plans could shift last minute; keep some flexibility built in.",
    "A pleasant time for leisure travel if you can make the time for it.",
  ],
};

export default function PredictionsTab({ rashiIndex }) {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
      <h3 className="font-semibold mb-1">Kundli Predictions</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
        General guidance based on your Moon sign — for reflection and entertainment, not a substitute for
        professional advice.
      </p>
      <div className="space-y-5">
        {CATEGORIES.map((cat, i) => (
          <div key={cat}>
            <h4 className="flex items-center gap-2 font-semibold text-sm mb-1.5">
              <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-amber-100 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400">
                <FlaskConical size={13} />
              </span>
              {cat}
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 pl-8">
              {VARIANTS[cat][(rashiIndex + i) % VARIANTS[cat].length]}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
