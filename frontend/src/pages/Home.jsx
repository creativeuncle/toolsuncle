import { Puzzle, Zap, ArrowRight, CirclePlay, Lock, CircleCheck, Wand } from "lucide-react";
import { tools } from "../config/tools";
import ToolCard from "../components/ToolCard";

export default function Home() {
  return (
    <div>
      <section className="relative left-1/2 -ml-[50vw] w-screen -mt-10 bg-slate-50 dark:bg-slate-950 px-4 sm:px-6 py-20">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/60 px-4 py-1.5 text-sm text-slate-600 dark:text-slate-300 mb-6">
            <Puzzle size={16} className="text-amber-500 dark:text-amber-400" />
            50+ free tools runs entirely in your browser
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 dark:text-white leading-tight mb-6">
            Free Tools to Make Everything Simple
          </h1>

          <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
            Discover smart, free tools that help you create, convert, calculate, and automate
            tasks in seconds.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
            <a
              href="#tools-grid"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-white font-semibold hover:opacity-90 transition-opacity"
            >
              <Zap size={18} />
              Browse all 50+ Tools
              <ArrowRight size={18} />
            </a>
            <a
              href="#tools-grid"
              className="inline-flex items-center gap-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 px-6 py-3 text-slate-900 dark:text-white font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <CirclePlay size={18} />
              How it works
            </a>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-slate-600 dark:text-slate-400">
            <span className="flex items-center gap-2">
              <Lock size={16} className="text-emerald-500" />
              100% browser-based
            </span>
            <span className="flex items-center gap-2">
              <CircleCheck size={16} className="text-emerald-500" />
              Zero signups required
            </span>
            <span className="flex items-center gap-2">
              <Wand size={16} className="text-emerald-500" />
              New tools added every month
            </span>
          </div>
        </div>
      </section>

      <div id="tools-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-16">
        {tools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </div>
  );
}
