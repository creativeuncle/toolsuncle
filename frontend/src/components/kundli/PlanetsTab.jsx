export default function PlanetsTab({ rows }) {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 overflow-x-auto">
      <h3 className="font-semibold mb-4">Position of Planets</h3>
      <table className="w-full text-sm min-w-[640px]">
        <thead>
          <tr className="text-left text-xs text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
            <th className="py-2 pr-2 font-medium">Planet</th>
            <th className="py-2 pr-2 font-medium">R</th>
            <th className="py-2 pr-2 font-medium">Sign</th>
            <th className="py-2 pr-2 font-medium">Sign Lord</th>
            <th className="py-2 pr-2 font-medium">Degree</th>
            <th className="py-2 pr-2 font-medium">Nakshatra</th>
            <th className="py-2 pr-2 font-medium">Nak. Lord</th>
            <th className="py-2 pr-2 font-medium">House</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.name} className="border-b border-slate-100 dark:border-slate-800/60 last:border-0">
              <td className="py-2 pr-2 font-medium">{r.name}</td>
              <td className="py-2 pr-2 text-red-500">{r.retrograde ? "R" : "-"}</td>
              <td className="py-2 pr-2">{r.sign}</td>
              <td className="py-2 pr-2">{r.signLord}</td>
              <td className="py-2 pr-2">{r.degreeInSign.toFixed(2)}</td>
              <td className="py-2 pr-2">{r.nakshatra}</td>
              <td className="py-2 pr-2">{r.nakshatraLord}</td>
              <td className="py-2 pr-2">{r.house}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
