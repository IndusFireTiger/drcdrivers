import { useEffect, useState } from 'react';
import { isComplete, completedCount } from '../lib/progress.js';

// The home screen: a winding "roadmap" road. Milestone markers sit on an asphalt
// road with a dashed centre line; cards alternate left/right and animate on hover.
export default function RoadMap({ stops }) {
  const [done, setDone] = useState({});
  const [count, setCount] = useState(0);

  useEffect(() => {
    const map = {};
    stops.forEach((s) => (map[s.slug] = isComplete(s.slug)));
    setDone(map);
    setCount(completedCount());
  }, []);

  const availableCount = stops.filter((s) => s.available).length;
  const allDone = availableCount > 0 && count >= availableCount;

  // Road geometry. viewBox is 360 wide; each stop owns a ROW-tall band.
  const VBW = 360;
  const ROW = 168;
  const H = stops.length * ROW;
  const nodes = stops.map((_, i) => ({
    x: i % 2 === 0 ? 116 : 244, // alternate left / right of centre
    y: i * ROW + ROW / 2,
  }));
  const roadPath = buildPath([
    { x: nodes[0].x, y: 0 },
    ...nodes,
    { x: nodes[nodes.length - 1].x, y: H },
  ]);

  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <header className="text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-amber-600 dark:text-amber-400">DRCDrivers</p>
        <h1 className="mt-2 text-4xl font-bold text-slate-900 dark:text-slate-100">Drive the road of Data Risk &amp; Compliance</h1>
        <p className="mx-auto mt-3 max-w-xl text-slate-600 dark:text-slate-300">
          Six stops, end to end. At each one you'll learn a concept — and see what your product
          must <em>do</em> about it. Built for people building DRC.
        </p>
        <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
          {count} / {availableCount} stops cleared
        </p>
      </header>

      {allDone && (
        <div className="mt-8 rounded-2xl border border-emerald-300 bg-emerald-50 p-6 text-center dark:border-emerald-700 dark:bg-emerald-900/30">
          <p className="text-2xl">🏁</p>
          <h2 className="mt-1 text-xl font-bold text-emerald-800 dark:text-emerald-300">You've driven the whole road.</h2>
          <p className="mx-auto mt-1 max-w-md text-sm text-emerald-700 dark:text-emerald-400">
            You can now see DRC end to end — from mapping data to surviving an incident — and what a
            product must do at each stage. Take the one-page recap with you.
          </p>
          <a
            href="/cheatsheet"
            className="mt-4 inline-block rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700"
          >
            📄 Open the cheat-sheet
          </a>
        </div>
      )}

      {/* The winding road */}
      <div className="relative mx-auto mt-12" style={{ maxWidth: 560, height: `${H}px` }}>
        <svg
          viewBox={`0 0 ${VBW} ${H}`}
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
          aria-hidden="true"
        >
          {/* asphalt */}
          <path
            d={roadPath}
            fill="none"
            strokeWidth="30"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            className="stroke-slate-300 dark:stroke-slate-700"
          />
          {/* dashed centre lane line */}
          <path
            d={roadPath}
            fill="none"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="1 18"
            vectorEffect="non-scaling-stroke"
            className="stroke-amber-400/90"
          />
        </svg>

        {stops.map((s, i) => {
          const completed = done[s.slug];
          const clickable = s.available;
          const node = nodes[i];
          const left = `${(node.x / VBW) * 100}%`;
          const top = `${((i * ROW + ROW / 2) / H) * 100}%`;
          const cardOnRight = i % 2 === 0; // node on left → card on right
          const cardStyle = cardOnRight
            ? { left: '40%', right: '2%' }
            : { left: '2%', right: '40%' };
          const Tag = clickable ? 'a' : 'div';

          return (
            <Tag
              key={s.id}
              href={clickable ? `/lesson/${s.slug}` : undefined}
              className={`group absolute inset-x-0 block ${clickable ? '' : 'pointer-events-none'}`}
              style={{ top: `${i * ROW}px`, height: `${ROW}px` }}
            >
              {/* Milestone marker on the road */}
              <span
                className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
                style={{ left, top: '50%' }}
              >
                {/* hover pulse ring */}
                <span className="absolute inset-0 rounded-full bg-amber-400/40 opacity-0 transition group-hover:animate-ping group-hover:opacity-100" />
                <span
                  className={`relative flex h-14 w-14 items-center justify-center rounded-full border-4 text-2xl shadow transition-transform duration-200 group-hover:scale-110 ${
                    completed
                      ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-900/50'
                      : clickable
                        ? 'border-amber-400 bg-white dark:bg-slate-800'
                        : 'border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-800'
                  }`}
                >
                  {completed ? '✅' : s.icon}
                </span>
              </span>

              {/* Card */}
              <span
                className="absolute top-1/2 -translate-y-1/2"
                style={cardStyle}
              >
                <span
                  className={`block rounded-xl border p-4 shadow-sm transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-xl ${
                    clickable
                      ? 'border-slate-200 bg-white group-hover:border-amber-400 dark:border-slate-700 dark:bg-slate-800'
                      : 'border-dashed border-slate-200 bg-slate-50 opacity-70 dark:border-slate-700 dark:bg-slate-800/50'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-700 dark:bg-amber-900/50 dark:text-amber-300">
                      {s.id}
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">{s.title}</span>
                  </span>
                  <span className="mt-1 block text-sm text-slate-500 dark:text-slate-400">{s.subtitle}</span>
                  <span className="mt-2 block text-sm font-medium">
                    {completed ? (
                      <span className="text-emerald-600 dark:text-emerald-400">✓ Cleared</span>
                    ) : clickable ? (
                      <span className="text-amber-600 transition-transform group-hover:translate-x-0.5 dark:text-amber-400">
                        Start →
                      </span>
                    ) : (
                      <span className="text-slate-400">Coming soon</span>
                    )}
                  </span>
                </span>
              </span>
            </Tag>
          );
        })}
      </div>

      <div className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-center">
        <a href="/atlas" className="text-sm font-medium text-amber-600 hover:text-amber-700 dark:text-amber-400">
          🌍 Explore the global GRC Atlas
        </a>
        <a href="/cheatsheet" className="text-sm font-medium text-amber-600 hover:text-amber-700 dark:text-amber-400">
          📄 Jump to the one-page cheat-sheet
        </a>
      </div>
      <p className="mt-2 text-center text-xs text-slate-400">Progress is saved in your browser.</p>
    </div>
  );
}

// Smooth vertical S-curve through the given points (cubic béziers with vertical handles).
function buildPath(points) {
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const cur = points[i];
    const midY = (prev.y + cur.y) / 2;
    d += ` C ${prev.x} ${midY}, ${cur.x} ${midY}, ${cur.x} ${cur.y}`;
  }
  return d;
}
