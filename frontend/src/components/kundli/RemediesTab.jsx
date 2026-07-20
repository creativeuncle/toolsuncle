import { Sparkles } from "lucide-react";

const PLANET_REMEDIES = {
  Sun: "Offer water to the rising sun (Surya Arghya) and recite the Aditya Hridayam or Gayatri Mantra.",
  Moon: "Wear white on Mondays, keep a fast, and recite 'Om Chandraya Namah'.",
  Mars: "Recite the Hanuman Chalisa on Tuesdays and consider donating red lentils or jaggery.",
  Mercury: "Recite 'Om Budhaya Namah' on Wednesdays and be mindful in speech and communication.",
  Jupiter: "Worship on Thursdays, recite the Guru mantra, and be generous towards teachers and elders.",
  Venus: "Recite 'Om Shum Shukraya Namah' on Fridays and maintain harmony in relationships.",
  Saturn: "Recite the Shani mantra on Saturdays and consider donating black sesame or mustard oil.",
  Rahu: "Recite 'Om Rahave Namah' and avoid impulsive decisions during Rahu periods.",
  Ketu: "Recite 'Om Ketave Namah' and lean into meditation and spiritual practice.",
};

export default function RemediesTab({ currentDashaLord, mangalDosha, kaalSarpDosha, numerology }) {
  const items = [];

  items.push({
    title: `Current Mahadasha Remedy — ${currentDashaLord}`,
    text: PLANET_REMEDIES[currentDashaLord],
  });

  if (mangalDosha.present) {
    items.push({
      title: "Mangal Dosha Remedy",
      text: "Recite the Hanuman Chalisa or Mangal Ashtottari on Tuesdays, consider Kumbh Vivah rituals before marriage as per family tradition, and donate red items on Tuesdays.",
    });
  }

  if (kaalSarpDosha.present) {
    items.push({
      title: "Kaal Sarp Dosha Remedy",
      text: "Consider performing a Rahu-Ketu Shanti puja, visiting a Nag temple (such as Trimbakeshwar), and reciting the Maha Mrityunjaya Mantra.",
    });
  }

  items.push({
    title: "General Wellbeing",
    text: `Your lucky day is ${numerology.profile.day} and your lucky stone is ${numerology.profile.stone} — wearing or favouring these on important occasions is traditionally considered auspicious for you.`,
  });

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
      <h3 className="font-semibold mb-1">Remedies</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
        Traditional suggestions based on your chart — offered as general guidance, not medical or financial
        advice.
      </p>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.title} className="rounded-xl border border-slate-200 dark:border-slate-800 px-4 py-3">
            <h4 className="flex items-center gap-2 font-medium text-sm mb-1">
              <Sparkles size={14} className="text-amber-500" />
              {item.title}
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300">{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
