import { tools } from "../config/tools";
import ToolCard from "../components/ToolCard";

export default function Home() {
  return (
    <div>
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
          Handy tools, made simple.
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Convert, compress, and merge your files in seconds — no sign-up required.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {tools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </div>
  );
}
