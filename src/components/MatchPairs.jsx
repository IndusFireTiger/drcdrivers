import { useState, useMemo } from 'react';

// Match: pick a left item, then its correct right item. Correct pairs lock in green.
export default function MatchPairs({ prompt, leftLabel, rightLabel, pairs, onResolved }) {
  const [selected, setSelected] = useState(null); // index into pairs (left side)
  const [matched, setMatched] = useState({}); // leftIndex -> true
  const [wrong, setWrong] = useState(null);

  // Shuffle the right column once so it isn't trivially aligned.
  const rightOrder = useMemo(() => {
    const idx = pairs.map((_, i) => i);
    for (let i = idx.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [idx[i], idx[j]] = [idx[j], idx[i]];
    }
    return idx;
  }, [pairs]);

  function chooseRight(rightPairIndex) {
    if (selected === null) return;
    if (selected === rightPairIndex) {
      const next = { ...matched, [selected]: true };
      setMatched(next);
      setSelected(null);
      setWrong(null);
      if (Object.keys(next).length === pairs.length) onResolved?.();
    } else {
      setWrong("Not a match — think about what that requirement actually forces the product to do.");
    }
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <p className="font-medium text-slate-800 dark:text-slate-200">{prompt}</p>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{leftLabel}</p>
          <div className="space-y-2">
            {pairs.map((p, i) => {
              const done = matched[i];
              const active = selected === i;
              return (
                <button
                  key={i}
                  disabled={done}
                  onClick={() => setSelected(active ? null : i)}
                  className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition dark:text-slate-200 ${
                    done
                      ? 'border-emerald-400 bg-emerald-50 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300'
                      : active
                        ? 'border-amber-500 bg-amber-100 dark:bg-amber-900/40'
                        : 'border-slate-300 hover:border-amber-400 dark:border-slate-600'
                  }`}
                >
                  {p.left}
                </button>
              );
            })}
          </div>
        </div>
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{rightLabel}</p>
          <div className="space-y-2">
            {rightOrder.map((pairIdx) => {
              const done = matched[pairIdx];
              return (
                <button
                  key={pairIdx}
                  disabled={done}
                  onClick={() => chooseRight(pairIdx)}
                  className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition dark:text-slate-200 ${
                    done
                      ? 'border-emerald-400 bg-emerald-50 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300'
                      : 'border-slate-300 hover:border-amber-400 dark:border-slate-600'
                  }`}
                >
                  {pairs[pairIdx].right}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      {wrong && <p className="mt-3 text-sm text-rose-500 dark:text-rose-400">{wrong}</p>}
      {Object.keys(matched).length === pairs.length && (
        <p className="mt-3 text-sm font-medium text-emerald-600 dark:text-emerald-400">All matched — that's the spec.</p>
      )}
    </div>
  );
}
