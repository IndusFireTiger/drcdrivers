// ── Shared top navigation ────────────────────────────────────────────────────
// One nav row, rendered once by the Base layout so every page gets it in the
// same place and the same order. The current page is shown as an active
// (non-link) label; pages that aren't a top-level destination (lessons, the
// cheat-sheet) pass no `current`, leaving every entry navigable.
//
// "DRC Academy" is the brand / home affordance. It points at the home screen,
// which *is* the Navigator — so following it lands with The Navigator selected.
// It never carries an active state of its own.

const HOME = '/';

const LINKS = [
  { key: 'navigator', href: HOME, label: 'The Navigator' },
  { key: 'policies', href: '/policies', label: 'Policy Library' },
  { key: 'atlas', href: '/atlas', label: 'Atlas' },
  { key: 'road', href: '/road', label: 'Lessons' },
];

export default function TopNav({ current, className = '' }) {
  return (
    <nav className={`flex flex-wrap items-center gap-x-4 gap-y-1 text-sm print:hidden ${className}`} aria-label="Primary">
      {/* The bar is dark in both themes, so these colours need no dark: variant. */}
      <a href={HOME} className="font-bold text-white hover:text-blue-300">DRC Academy</a>
      <span aria-hidden="true" className="text-slate-500">·</span>
      {LINKS.map((l) =>
        current === l.key ? (
          <span key={l.key} className="font-semibold text-blue-300" aria-current="page">{l.label}</span>
        ) : (
          <a key={l.key} href={l.href} className="text-slate-300 hover:text-white">{l.label}</a>
        )
      )}
    </nav>
  );
}
