import { useState } from 'react';

// Checkpoint quiz: answer all correctly to unlock the next stop.
export default function Checkpoint({ questions, onPassed }) {
  const [answers, setAnswers] = useState({}); // qIndex -> chosen option index
  const allCorrect =
    questions.length > 0 &&
    questions.every((q, qi) => answers[qi] === q.answerIndex);

  function pick(qi, oi) {
    setAnswers((prev) => {
      const next = { ...prev, [qi]: oi };
      const passed =
        questions.every((q, i) => next[i] === q.answerIndex);
      if (passed) onPassed?.();
      return next;
    });
  }

  return (
    <div className="space-y-5">
      {questions.map((q, qi) => {
        const chosen = answers[qi];
        return (
          <div key={qi} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <p className="font-medium text-slate-800 dark:text-slate-200">{q.question}</p>
            <div className="mt-3 space-y-2">
              {q.options.map((opt, oi) => {
                const isChosen = chosen === oi;
                const correct = oi === q.answerIndex;
                let tone = 'border-slate-200 hover:border-yellow-400 hover:bg-yellow-50 dark:border-slate-600 dark:hover:bg-yellow-900/20';
                if (isChosen && correct) tone = 'border-emerald-400 bg-emerald-50 dark:bg-emerald-900/30';
                else if (isChosen && !correct) tone = 'border-rose-400 bg-rose-50 dark:bg-rose-900/30';
                return (
                  <button
                    key={oi}
                    onClick={() => pick(qi, oi)}
                    className={`w-full rounded-lg border px-4 py-2.5 text-left text-sm transition text-slate-700 dark:text-slate-200 ${tone}`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
            {chosen !== undefined && chosen === q.answerIndex && (
              <p className="mt-2 text-sm text-emerald-700 dark:text-emerald-400">{q.explanation}</p>
            )}
            {chosen !== undefined && chosen !== q.answerIndex && (
              <p className="mt-2 text-sm text-rose-500 dark:text-rose-400">Not quite — try another option.</p>
            )}
          </div>
        );
      })}
      {allCorrect && (
        <p className="rounded-lg bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
          ✅ Checkpoint cleared — the next stop is unlocked.
        </p>
      )}
    </div>
  );
}
