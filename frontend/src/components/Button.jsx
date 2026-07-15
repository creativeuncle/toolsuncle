import { Loader2 } from "lucide-react";

const variants = {
  primary: "bg-indigo-600 hover:bg-indigo-500",
  success: "bg-emerald-600 hover:bg-emerald-500",
  secondary:
    "bg-slate-200 hover:bg-slate-300 text-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-100",
};

export default function Button({
  children,
  loading,
  disabled,
  variant = "primary",
  className = "",
  ...props
}) {
  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    >
      {loading && <Loader2 size={16} className="animate-spin" />}
      {children}
    </button>
  );
}
