import { useEffect, useState } from 'react';
import DecisionScenario from './DecisionScenario.jsx';
import ClassifySort from './ClassifySort.jsx';
import MatchPairs from './MatchPairs.jsx';
import Hotspot from './Hotspot.jsx';
import Checkpoint from './Checkpoint.jsx';
import { markComplete } from '../lib/progress.js';

// Renders one lesson end-to-end: hook → learn → build-bridge → interact → teach-back → checkpoint.
export default function LessonView({ lesson, nextSlug }) {
  const [passed, setPassed] = useState(false);

  useEffect(() => {
    if (passed) markComplete(lesson.slug);
  }, [passed, lesson.slug]);

  return (
    <article className="mx-auto max-w-2xl space-y-10">
      <header className="mt-6">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
          Stop {lesson.id}: {lesson.title}
        </h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400">{lesson.subtitle}</p>
      </header>

      {/* Hook */}
      <section className="space-y-3">
        <p className="text-slate-700 dark:text-slate-300">{lesson.hook.metaphor}</p>
        <blockquote className="border-l-4 border-blue-400 bg-blue-50 px-4 py-3 text-slate-700 dark:bg-blue-900/20 dark:text-slate-200">
          {lesson.hook.scenario}
        </blockquote>
      </section>

      {/* Learn */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Learn</h2>
        {lesson.learn.map((p, i) => (
          <p key={i} className="text-slate-700 dark:text-slate-300" dangerouslySetInnerHTML={{ __html: mdBold(p) }} />
        ))}
      </section>

      {/* Build bridge */}
      <section className="rounded-xl bg-slate-900 px-5 py-4 text-slate-100 dark:bg-slate-950 dark:ring-1 dark:ring-slate-700">
        <span className="text-xs font-semibold uppercase tracking-wide text-blue-400">
          So your product must…
        </span>
        <p className="mt-1" dangerouslySetInnerHTML={{ __html: mdBold(lesson.buildBridge) }} />
      </section>

      {/* Optional related-resource link(s) — one object or an array */}
      {lesson.seeAlso && (
        <div className="-mt-4 space-y-2">
          {(Array.isArray(lesson.seeAlso) ? lesson.seeAlso : [lesson.seeAlso]).map((s, i) => (
            <a
              key={i}
              href={s.href}
              className="block rounded-xl border border-sky-200 bg-sky-50 px-5 py-3 text-sm font-medium text-sky-700 transition hover:border-sky-400 dark:border-sky-800/50 dark:bg-sky-900/20 dark:text-sky-300"
            >
              {s.label} →
            </a>
          ))}
        </div>
      )}

      {/* Interactions */}
      <section className="space-y-5">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Try it</h2>
        {lesson.interactions.map((ix, i) => {
          if (ix.type === 'decision') return <DecisionScenario key={i} {...ix} />;
          if (ix.type === 'classify') return <ClassifySort key={i} {...ix} />;
          if (ix.type === 'match') return <MatchPairs key={i} {...ix} />;
          if (ix.type === 'hotspot') return <Hotspot key={i} {...ix} />;
          return null;
        })}
      </section>

      {/* Teach-back */}
      <section className="rounded-xl border border-blue-200 bg-blue-50 px-5 py-4 dark:border-blue-800/50 dark:bg-blue-900/20">
        <span className="text-xs font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-400">Teach it back</span>
        <p className="mt-1 text-slate-700 dark:text-slate-300">{lesson.teachBack}</p>
      </section>

      {/* Checkpoint */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Checkpoint</h2>
        <Checkpoint questions={lesson.checkpoint} onPassed={() => setPassed(true)} />
      </section>

      {/* Next */}
      <footer className="border-t border-slate-200 pt-6 dark:border-slate-700">
        {passed && nextSlug ? (
          <a
            href={`/lesson/${nextSlug}`}
            className="inline-block rounded-lg bg-blue-500 px-5 py-3 font-medium text-white hover:bg-blue-600"
          >
            Drive to the next stop →
          </a>
        ) : passed ? (
          <div className="flex flex-wrap gap-3">
            <a href="/cheatsheet" className="inline-block rounded-lg bg-emerald-600 px-5 py-3 font-medium text-white hover:bg-emerald-700">
              🏁 You've driven the whole road — get the cheat-sheet
            </a>
            <a href="/road" className="inline-block rounded-lg border border-slate-300 px-5 py-3 font-medium text-slate-600 hover:border-blue-400 dark:border-slate-600 dark:text-slate-300">
              Back to the map
            </a>
          </div>
        ) : (
          <p className="text-sm text-slate-400">Clear the checkpoint to unlock the next stop.</p>
        )}
      </footer>
    </article>
  );
}

// Minimal **bold** → <strong> so content authors can emphasize in JSON.
function mdBold(s) {
  return s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
}
