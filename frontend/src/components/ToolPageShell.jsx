export default function ToolPageShell({ icon: Icon, color, title, description, children }) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <div
          className={`flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${color} text-white shrink-0`}
        >
          <Icon size={26} />
        </div>
        <div>
          <h1 className="text-2xl font-semibold">{title}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8">
        {children}
      </div>
    </div>
  );
}
