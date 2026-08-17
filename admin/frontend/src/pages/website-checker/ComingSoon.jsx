import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon } from "@hugeicons/core-free-icons";

export default function ComingSoon() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-24">
      <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 mb-5">
        <HugeiconsIcon icon={Search01Icon} size={26} />
      </div>
      <h1 className="text-xl font-semibold mb-2">Website Checker admin — coming soon</h1>
      <p className="max-w-md text-sm text-slate-500 dark:text-slate-400">
        Website Checker's backend doesn't have an admin API yet (no auth, no stored scan history). Once that's
        built, this section will show scan history, tech-signature management, and pricing content — all from
        Website Checker's own backend, kept separate from Dc Tools' data.
      </p>
    </div>
  );
}
