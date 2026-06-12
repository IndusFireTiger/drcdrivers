import { useEffect, useState } from 'react';

const KEY = 'drcdrivers:theme';

// Fixed top-right light/dark switch. The actual class is set pre-paint by an inline
// script in Base.astro (no flash); this just reflects and toggles it.
export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'));
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    try {
      localStorage.setItem(KEY, next ? 'dark' : 'light');
    } catch {}
  }

  return (
    <button
      onClick={toggle}
      aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={dark ? 'Light mode' : 'Dark mode'}
      className="fixed right-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white/90 text-lg shadow-sm backdrop-blur transition hover:border-amber-400 dark:border-slate-600 dark:bg-slate-800/90"
    >
      {dark ? '☀️' : '🌙'}
    </button>
  );
}
