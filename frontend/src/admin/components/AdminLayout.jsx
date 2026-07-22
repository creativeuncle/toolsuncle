import { Link, useLocation, useNavigate } from "react-router-dom";
import { FileText, Tag, LogOut, MessageSquareText } from "lucide-react";
import { clearAdminToken } from "../adminApi";

const navItems = [
  { label: "Blogs", path: "/admin/blogs", icon: FileText },
  { label: "Categories", path: "/admin/categories", icon: Tag },
  { label: "Feedback", path: "/admin/feedback", icon: MessageSquareText },
];

export default function AdminLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAdminToken();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950">
      <aside className="w-56 shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col">
        <div className="h-16 flex items-center px-5 font-semibold border-b border-slate-200 dark:border-slate-800">
          Dctools Admin
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <Icon size={17} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 m-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <LogOut size={17} />
          Log Out
        </button>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">{children}</main>
    </div>
  );
}
