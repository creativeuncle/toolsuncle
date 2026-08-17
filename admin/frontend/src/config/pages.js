import { DashboardSquare01Icon, News01Icon, TagsIcon, Message01Icon, Search01Icon } from "@hugeicons/core-free-icons";

// Sidebar pages per tool. The sidebar (and the tool switcher) reads this —
// add a new tool's pages here once its admin backend exists.
export const PAGES_BY_TOOL = {
  dctools: [
    { label: "Overview", path: "/dctools", icon: DashboardSquare01Icon, exact: true },
    { label: "Blogs", path: "/dctools/blogs", icon: News01Icon },
    { label: "Categories", path: "/dctools/categories", icon: TagsIcon },
    { label: "Feedback", path: "/dctools/feedback", icon: Message01Icon },
  ],
  "website-checker": [{ label: "Overview", path: "/website-checker", icon: Search01Icon, exact: true }],
};
