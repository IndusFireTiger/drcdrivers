import { useState } from 'react';

// Classify: pick an item, then a bucket. Correct placements lock in green.
export default function ClassifySort({ prompt, buckets, items, onResolved }) {
  const [selected, setSelected] = useState(null);
  const [placed, setPlaced] = useState({}); // label -> bucket (only correct ones stick)
  const [wrong, setWrong] = useState(null);

  const remaining = items.filter((it) => !placed[it.label]);

  function place(bucket) {
    if (selected === null) return;
    const item = items[selected];
    if (item.bucket === bucket) {
      const next = { ...placed, [item.label]: bucket };
      setPlaced(next);
      setSelected(null);
      setWrong(null);
      if (Object.keys(next).length === items.length) onResolved?.();
    } else {
      setWrong(`${item.label} doesn't belong in ${bucket}. Think about how sensitive it is.`);
    }
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <p className="font-medium text-slate-800 dark:text-slate-200">{prompt}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {remaining.map((it) => {
          const idx = items.indexOf(it);
          const active = selected === idx;
          return (
            <button
              key={it.label}
              onClick={() => setSelected(active ? null : idx)}
              className={`rounded-full border px-3 py-1.5 text-sm transition dark:text-slate-200 ${
                active ? 'border-yellow-500 bg-yellow-100 dark:bg-yellow-900/40' : 'border-slate-300 hover:border-yellow-400 dark:border-slate-600'
              }`}
            >
              {it.label}
            </button>
          );
        })}
        {remaining.length === 0 && (
          <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">All sorted — nicely done.</span>
        )}
      </div>

      {wrong && <p className="mt-2 text-sm text-rose-500 dark:text-rose-400">{wrong}</p>}

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {buckets.map((b) => (
          <button
            key={b}
            onClick={() => place(b)}
            className="min-h-[88px] rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-3 text-left transition hover:border-yellow-400 dark:border-slate-600 dark:bg-slate-900/40"
          >
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{b}</span>
            <div className="mt-2 space-y-1">
              {Object.entries(placed)
                .filter(([, bucket]) => bucket === b)
                .map(([label]) => (
                  <span
                    key={label}
                    className="block rounded bg-emerald-100 px-2 py-1 text-xs text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300"
                  >
                    {label}
                  </span>
                ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
