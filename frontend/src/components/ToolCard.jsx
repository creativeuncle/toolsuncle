import { Link } from "react-router-dom";

export default function ToolCard({ tool }) {
  const Icon = tool.icon;

  return (
    <Link
      to={tool.path}
      className="group relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/60 dark:hover:shadow-none dark:hover:border-slate-700"
    >
      <div
        className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${tool.color} text-white mb-4`}
      >
        <Icon size={22} />
      </div>
      <h3 className="text-base font-semibold mb-1">{tool.name}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
        {tool.description}
      </p>
    </Link>
  );
}
