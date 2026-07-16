// ── Shared top navigation ────────────────────────────────────────────────────
// One nav row, used on every page so all destinations are always visible and in
// the same order: Navigator · Policy Library · Atlas · The DRC road. The current
// page is shown as an active (non-link) label. Always sits at the top-left.

const LINKS = [
  { key: 'navigator', href: '/', label: '🧭 The Navigator' },
  { key: 'policies', href: '/policies', label: '📚 Policy Library' },
  { key: 'atlas', href: '/atlas', label: '🌍 Atlas' },
  { key: 'road', href: '/road', label: '🛣️ The DRC road (lessons)' },
];

export default function TopNav({ current, className = '' }) {
  return (
    <nav className={`flex flex-wrap gap-x-4 gap-y-1 text-sm print:hidden ${className}`} aria-label="Primary">
      {LINKS.map((l) =>
        current === l.key ? (
          <span key={l.key} className="font-semibold text-amber-600 dark:text-amber-400" aria-current="page">{l.label}</span>
        ) : (
          <a key={l.key} href={l.href} className="text-slate-500 hover:text-amber-600 dark:text-slate-400">{l.label}</a>
        )
      )}
    </nav>
  );
}
