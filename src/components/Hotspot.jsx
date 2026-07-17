import { useState } from 'react';

// Hotspot data-flow diagram: an SVG "pipe" of lifecycle stages. Click each to reveal
// the risk that lives there and the control that addresses it. Visiting all resolves it.
export default function Hotspot({
  prompt,
  stages,
  riskLabel = 'Risk here',
  controlLabel = 'Control',
  onResolved,
}) {
  const [activeId, setActiveId] = useState(null);
  const [visited, setVisited] = useState({});

  const W = 800;
  const H = 120;
  const margin = 70;
  const span = stages.length > 1 ? (W - margin * 2) / (stages.length - 1) : 0;
  const cy = 48;
  const active = stages.find((s) => s.id === activeId) || null;

  function open(id) {
    setActiveId(id);
    setVisited((prev) => {
      if (prev[id]) return prev;
      const next = { ...prev, [id]: true };
      if (Object.keys(next).length === stages.length) onResolved?.();
      return next;
    });
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <p className="font-medium text-slate-800 dark:text-slate-200">{prompt}</p>

      <svg viewBox={`0 0 ${W} ${H}`} className="mt-4 w-full" role="group" aria-label="Stage flow diagram">
        {/* the pipe */}
        <line
          x1={margin}
          y1={cy}
          x2={W - margin}
          y2={cy}
          strokeWidth="6"
          strokeLinecap="round"
          className="stroke-slate-200 dark:stroke-slate-700"
        />
        {stages.map((s, i) => {
          const cx = margin + span * i;
          const isActive = s.id === activeId;
          const isVisited = visited[s.id];
          const circleTone = isActive
            ? 'fill-blue-500 stroke-blue-700'
            : isVisited
              ? 'fill-emerald-100 stroke-emerald-400 dark:fill-emerald-900'
              : 'fill-white stroke-slate-300 dark:fill-slate-800 dark:stroke-slate-600';
          return (
            <g key={s.id} className="cursor-pointer" onClick={() => open(s.id)}>
              {/* connector arrowhead */}
              {i < stages.length - 1 && (
                <polygon
                  points={`${cx + span - 14},${cy - 5} ${cx + span - 6},${cy} ${cx + span - 14},${cy + 5}`}
                  className="fill-slate-300 dark:fill-slate-600"
                />
              )}
              <circle cx={cx} cy={cy} r="26" strokeWidth="3" className={circleTone} />
              <text x={cx} y={cy + 7} textAnchor="middle" fontSize="22">{s.icon}</text>
              <text
                x={cx}
                y={cy + 50}
                textAnchor="middle"
                fontSize="13"
                fontWeight="600"
                className="fill-slate-600 dark:fill-slate-300"
              >
                {s.label}
              </text>
            </g>
          );
        })}
      </svg>

      {active ? (
        <div className="mt-2 grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 dark:border-rose-800/50 dark:bg-rose-900/20">
            <span className="text-xs font-semibold uppercase tracking-wide text-rose-600 dark:text-rose-400">{riskLabel}</span>
            <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{active.risk}</p>
          </div>
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-800/50 dark:bg-emerald-900/20">
            <span className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">{controlLabel}</span>
            <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{active.control}</p>
          </div>
        </div>
      ) : (
        <p className="mt-1 text-sm text-slate-400">Click a stage to inspect it.</p>
      )}

      <p className="mt-3 text-xs text-slate-400">
        {Object.keys(visited).length} / {stages.length} stages inspected
        {Object.keys(visited).length === stages.length && ' — you’ve mapped the whole road.'}
      </p>
    </div>
  );
}
