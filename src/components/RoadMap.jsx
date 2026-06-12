import { useEffect, useState } from 'react';
import { isComplete, completedCount } from '../lib/progress.js';

// The home "road" — the six stops, with progress read from localStorage on mount.
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

  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <header className="text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-amber-600">DRCDrivers</p>
        <h1 className="mt-2 text-4xl font-bold text-slate-900">Drive the road of Data Risk &amp; Compliance</h1>
        <p className="mx-auto mt-3 max-w-xl text-slate-600">
          Six stops, end to end. At each one you'll learn a concept — and see what your product
          must <em>do</em> about it. Built for people building DRC.
        </p>
        <p className="mt-4 text-sm text-slate-500">
          {count} / {availableCount} stops cleared
        </p>
      </header>

      {allDone && (
        <div className="mt-8 rounded-2xl border border-emerald-300 bg-emerald-50 p-6 text-center">
          <p className="text-2xl">🏁</p>
          <h2 className="mt-1 text-xl font-bold text-emerald-800">You've driven the whole road.</h2>
          <p className="mx-auto mt-1 max-w-md text-sm text-emerald-700">
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

      <ol className="relative mt-12 space-y-4 before:absolute before:left-[27px] before:top-2 before:h-[calc(100%-1rem)] before:w-1 before:rounded before:bg-slate-200">
        {stops.map((s) => {
          const completed = done[s.slug];
          const clickable = s.available;
          const Tag = clickable ? 'a' : 'div';
          return (
            <li key={s.id} className="relative">
              <Tag
                href={clickable ? `/lesson/${s.slug}` : undefined}
                className={`flex items-center gap-4 rounded-xl border p-4 transition ${
                  clickable
                    ? 'border-slate-200 bg-white shadow-sm hover:border-amber-400 hover:shadow'
                    : 'cursor-not-allowed border-dashed border-slate-200 bg-slate-50 opacity-70'
                }`}
              >
                <span
                  className={`z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-4 text-2xl ${
                    completed
                      ? 'border-emerald-400 bg-emerald-50'
                      : clickable
                        ? 'border-amber-400 bg-white'
                        : 'border-slate-200 bg-white'
                  }`}
                >
                  {completed ? '✅' : s.icon}
                </span>
                <span className="min-w-0">
                  <span className="block font-semibold text-slate-900">
                    Stop {s.id}: {s.title}
                  </span>
                  <span className="block text-sm text-slate-500">{s.subtitle}</span>
                </span>
                <span className="ml-auto shrink-0 text-sm font-medium">
                  {completed ? (
                    <span className="text-emerald-600">Cleared</span>
                  ) : clickable ? (
                    <span className="text-amber-600">Start →</span>
                  ) : (
                    <span className="text-slate-400">Coming soon</span>
                  )}
                </span>
              </Tag>
            </li>
          );
        })}
      </ol>

      <div className="mt-10 text-center">
        <a href="/cheatsheet" className="text-sm font-medium text-amber-600 hover:text-amber-700">
          📄 Jump to the one-page cheat-sheet
        </a>
        <p className="mt-2 text-xs text-slate-400">Progress is saved in your browser.</p>
      </div>
    </div>
  );
}
