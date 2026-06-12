import { useState } from 'react';

// Decision scenario: a prompt + choices, each revealing *why* on click.
export default function DecisionScenario({ prompt, options, onResolved }) {
  const [picked, setPicked] = useState(null);

  function choose(i) {
    if (picked !== null) return;
    setPicked(i);
    if (options[i].correct) onResolved?.();
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="font-medium text-slate-800">{prompt}</p>
      <div className="mt-4 space-y-2">
        {options.map((opt, i) => {
          const isPicked = picked === i;
          const show = picked !== null;
          const base = 'w-full rounded-lg border px-4 py-3 text-left transition';
          let tone = 'border-slate-200 hover:border-amber-400 hover:bg-amber-50';
          if (show && opt.correct) tone = 'border-emerald-400 bg-emerald-50';
          else if (show && isPicked && !opt.correct) tone = 'border-rose-400 bg-rose-50';
          else if (show) tone = 'border-slate-200 opacity-60';
          return (
            <button key={i} className={`${base} ${tone}`} onClick={() => choose(i)} disabled={show}>
              <span className="font-medium text-slate-800">{opt.label}</span>
              {show && (isPicked || opt.correct) && (
                <span className="mt-1 block text-sm text-slate-600">{opt.feedback}</span>
              )}
            </button>
          );
        })}
      </div>
      {picked !== null && !options[picked].correct && (
        <p className="mt-3 text-sm text-slate-500">Look again — the green choice shows the reasoning.</p>
      )}
    </div>
  );
}
