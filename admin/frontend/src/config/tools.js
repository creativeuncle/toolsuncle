import { GlobalIcon, Search01Icon } from "@hugeicons/core-free-icons";

// Registry of products this super-admin can manage. Add a new entry here
// (plus its sidebar pages + API client) whenever a new dctools.in/xyz tool
// gets its own admin surface — the tool switcher and sidebar pick it up
// automatically.
export const TOOLS = [
  {
    id: "dctools",
    name: "Dc Tools",
    icon: GlobalIcon,
    available: true,
  },
  {
    id: "website-checker",
    name: "Website Checker",
    icon: Search01Icon,
    available: false, // backend has no admin API yet — shown as "Coming soon"
  },
];

export const DEFAULT_TOOL_ID = "dctools";
