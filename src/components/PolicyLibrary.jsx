import { useMemo, useState } from 'react';
import { CONTROLS, OBLIGATION_THEMES, libraryRows } from '../data/policies.js';
import TopNav from './TopNav.jsx';

// ── The Policy Library ───────────────────────────────────────────────────────
// A standing reference of every policy in the catalogue — the role that owns it,
// the controls it establishes, the risks it addresses, the obligations it helps
// you meet, and (from Step 3) a ready-to-adapt sample draft. Independent of the
// Navigator questionnaire. Educational guidance, not legal advice.

const EMPTY_FILTERS = { risk: [], role: [], control: [], theme: [] };

export default function PolicyLibrary() {
  const rows = useMemo(() => libraryRows(), []);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();

  // Option lists, derived once from the library so they only ever offer values
  // that actually match at least one policy.
  const options = useMemo(() => {
    const roles = new Map();
    const controls = new Map();
    const themes = new Map();
    const risks = new Map();
    rows.forEach((p) => {
      if (p.role) roles.set(p.owner, p.role.name);
      p.controls.forEach((c) => controls.set(c, CONTROLS[c]));
      (p.themes || []).forEach((t) => themes.set(t, OBLIGATION_THEMES[t]));
      p.risks.forEach((r) => risks.set(r.label, r.label));
    });
    const sortByLabel = (m) => [...m.entries()].sort((a, b) => a[1].localeCompare(b[1]));
    return {
      role: sortByLabel(roles),
      control: sortByLabel(controls),
      theme: sortByLabel(themes),
      risk: sortByLabel(risks),
    };
  }, [rows]);

  // Within a section the selected values are OR-ed; across sections they are
  // AND-ed — the standard faceted-search behaviour. An empty section is a pass.
  const filtered = rows.filter(
    (p) =>
      (filters.role.length === 0 || filters.role.includes(p.owner)) &&
      (filters.control.length === 0 || filters.control.some((c) => p.controls.includes(c))) &&
      (filters.theme.length === 0 || filters.theme.some((t) => (p.themes || []).includes(t))) &&
      (filters.risk.length === 0 || filters.risk.some((l) => p.risks.some((r) => r.label === l)))
  );

  const activeCount = Object.values(filters).reduce((n, a) => n + a.length, 0);
  const toggle = (key, val) =>
    setFilters((f) => {
      const s = new Set(f[key]);
      s.has(val) ? s.delete(val) : s.add(val);
      return { ...f, [key]: [...s] };
    });
  const clearFacet = (key) => setFilters((f) => ({ ...f, [key]: [] }));

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <div className="max-w-3xl">
      <TopNav current="policies" />

      <p className="mt-4 text-sm font-semibold uppercase tracking-widest text-amber-600 dark:text-amber-400">📚 Policy Library</p>
      <h1 className="mt-1 text-3xl font-bold text-slate-900 dark:text-slate-100">The policies behind the controls</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-300">
        Every policy in the catalogue — the role that owns it, the controls it establishes, the risks it addresses and the
        obligations it helps you meet — each with a sample draft you can adapt. The{' '}
        <a href="/" className="font-medium text-amber-600 underline dark:text-amber-400">Navigator</a> recommends the subset
        that fits your answers; this is the full set.
      </p>

      <div className="mt-5 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-slate-700 dark:border-amber-800/60 dark:bg-amber-900/20 dark:text-slate-200">
        <strong>⚠️ Educational guidance, not legal advice.</strong> These are learning templates — adapt every draft to your
        own context and have it reviewed by qualified counsel before you rely on it.
      </div>
      </div>

      {/* Two-column shell: a sticky faceted filter rail on the left, cards on the right */}
      <div className="mt-8 lg:flex lg:gap-8">
        <aside className="mb-8 shrink-0 lg:sticky lg:top-6 lg:mb-0 lg:h-max lg:w-64" aria-label="Filter policies">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Filter policies</p>
            {activeCount > 0 && (
              <button type="button" onClick={() => setFilters(EMPTY_FILTERS)} className="text-xs font-medium text-amber-600 hover:underline dark:text-amber-400">
                Clear all ({activeCount})
              </button>
            )}
          </div>
          <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">⌕</span>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search filters…"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-8 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-amber-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-400 dark:border-slate-600 dark:bg-slate-900/40 dark:text-slate-200 dark:focus:bg-slate-900"
              />
            </div>
            <FacetSection label="Risk it addresses" name="risk" options={options.risk} selected={filters.risk} onToggle={toggle} onClear={clearFacet} q={q} />
            <FacetSection label="Owning role" name="role" options={options.role} selected={filters.role} onToggle={toggle} onClear={clearFacet} q={q} />
            <FacetSection label="Control it suggests" name="control" options={options.control} selected={filters.control} onToggle={toggle} onClear={clearFacet} q={q} />
            <FacetSection label="Obligation it helps with" name="theme" options={options.theme} selected={filters.theme} onToggle={toggle} onClear={clearFacet} q={q} />
            {q && !options.risk.concat(options.role, options.control, options.theme).some(([, l]) => l.toLowerCase().includes(q)) && (
              <p className="mt-3 border-t border-slate-200 pt-3 text-xs text-slate-400 dark:border-slate-700">No filters match “{query}”.</p>
            )}
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <p className="text-sm text-slate-400">
            Showing <span className="font-semibold text-slate-500 dark:text-slate-300">{filtered.length}</span> of {rows.length} policies
          </p>
          <div className="mt-3 space-y-4">
            {filtered.map((p) => (
              <PolicyLibraryCard key={p.id} p={p} />
            ))}
            {filtered.length === 0 && (
              <p className="rounded-2xl border border-dashed border-slate-300 py-12 text-center text-sm text-slate-400 dark:border-slate-600">
                No policy matches this combination of filters.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// A collapsible facet: a multi-select checkbox group that stays folded by
// default so the rail is compact. The label carries the applied count in
// brackets, with a per-section clear. An active search auto-expands the section
// and narrows its options; a section with no match is hidden entirely.
function FacetSection({ label, name, options, selected, onToggle, onClear, q }) {
  const [open, setOpen] = useState(false);
  const shown = q ? options.filter(([, lbl]) => lbl.toLowerCase().includes(q)) : options;
  if (shown.length === 0) return null;
  const expanded = q ? true : open;
  return (
    <fieldset className="border-t border-slate-200 py-2.5 first:border-t-0 first:pt-0 last:pb-0 dark:border-slate-700">
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={expanded}
          className="flex flex-1 items-center gap-1.5 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
        >
          <span className={`text-slate-400 transition-transform ${expanded ? 'rotate-90' : ''}`}>▸</span>
          <span>
            {label}
            {selected.length > 0 && <span className="text-amber-600 dark:text-amber-400"> ({selected.length})</span>}
          </span>
        </button>
        {selected.length > 0 && (
          <button type="button" onClick={() => onClear(name)} className="shrink-0 text-[10px] font-medium text-amber-600 hover:underline dark:text-amber-400">
            clear
          </button>
        )}
      </div>
      {expanded && (
        <div className="mt-2 space-y-1.5 pl-5">
          {shown.map(([val, lbl]) => (
            <label key={val} className="flex cursor-pointer items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
              <input type="checkbox" checked={selected.includes(val)} onChange={() => onToggle(name, val)} className="mt-0.5 accent-amber-500" />
              <span>{lbl}</span>
            </label>
          ))}
        </div>
      )}
    </fieldset>
  );
}

function PolicyLibraryCard({ p }) {
  const [tab, setTab] = useState('help'); // 'help' | 'draft'
  const tabs = [
    ['help', 'How it helps'],
    ['draft', 'Sample draft'],
  ];
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-slate-100">{p.name}</h3>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{p.desc}</p>
        </div>
        {p.role && (
          <span title={p.role.mandate} className="shrink-0 rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-600 dark:border-slate-600 dark:bg-slate-900/40 dark:text-slate-300">
            👤 {p.role.name}
          </span>
        )}
      </div>

      {/* Tab switch: what the policy does vs. a template to adapt */}
      <div className="mt-4 flex gap-5 border-b border-slate-200 dark:border-slate-700" role="tablist">
        {tabs.map(([key, label]) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={tab === key}
            onClick={() => setTab(key)}
            className={`-mb-px border-b-2 pb-2 text-sm font-medium transition ${
              tab === key
                ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'help' && (
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <ChipBlock label="Controls it establishes" items={p.controls.map((c) => CONTROLS[c])} tone="sky" />
          <ChipBlock label="Obligations it helps with" items={(p.themes || []).map((t) => OBLIGATION_THEMES[t])} tone="emerald" />
          <ChipBlock label="Risks it addresses" items={p.risks.map((r) => `${r.icon} ${r.label}`)} tone="rose" empty="—" />
        </div>
      )}

      {tab === 'draft' && p.draft && (
        <div className="mt-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs text-slate-400">A template you can adapt — not legal advice.</span>
            <div className="flex gap-2">
              <CopyButton getText={() => draftMarkdown(p)} />
              <button
                type="button"
                onClick={() => downloadDraft(p)}
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600 hover:border-amber-400 dark:border-slate-600 dark:text-slate-300"
              >
                ⬇ Download .md
              </button>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/40">
            <DraftDoc p={p} />
          </div>
        </div>
      )}
    </article>
  );
}

// The rendered policy template. Bracketed [placeholders] are meant to be filled
// in; the owning role and review cadence come straight from the library data.
function DraftDoc({ p }) {
  const d = p.draft;
  const owner = p.role?.name || 'the accountable owner';
  return (
    <div className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
      <div>
        <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">{p.name}</h4>
        <p className="mt-0.5 text-xs italic text-slate-400">
          Sample template — educational guidance, not legal advice. Replace [bracketed] values and have it reviewed by qualified counsel.
        </p>
      </div>
      <DraftSection n="1" title="Purpose">{d.purpose}</DraftSection>
      <DraftSection n="2" title="Scope">{d.scope}</DraftSection>
      <div>
        <SectionHead n="3" title="Policy statements" />
        <ol className="mt-1 list-decimal space-y-1 pl-5">
          {d.clauses.map((c, i) => (
            <li key={i}>{c}</li>
          ))}
        </ol>
      </div>
      <DraftSection n="4" title="Ownership & responsibilities">
        This policy is owned by <strong className="font-semibold text-slate-900 dark:text-slate-100">{owner}</strong>
        {p.role?.mandate ? ` — ${p.role.mandate}` : ''} Every control it establishes has a named owner.
      </DraftSection>
      <DraftSection n="5" title="Review & maintenance">
        This policy is reviewed {d.review} by {owner}, and updated after any material change or significant incident.
      </DraftSection>
    </div>
  );
}

function SectionHead({ n, title }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
      {n}. {title}
    </p>
  );
}

function DraftSection({ n, title, children }) {
  return (
    <div>
      <SectionHead n={n} title={title} />
      <p className="mt-1">{children}</p>
    </div>
  );
}

// Copy-to-clipboard with a brief confirmation.
function CopyButton({ getText }) {
  const [copied, setCopied] = useState(false);
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(getText());
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };
  return (
    <button
      type="button"
      onClick={onCopy}
      className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600 hover:border-amber-400 dark:border-slate-600 dark:text-slate-300"
    >
      {copied ? '✓ Copied' : '⧉ Copy'}
    </button>
  );
}

// Serialise a policy draft to Markdown — shared by Copy and Download.
function draftMarkdown(p) {
  const d = p.draft;
  const owner = p.role?.name || 'the accountable owner';
  const L = [];
  L.push(`# ${p.name}`, '');
  L.push('_Sample template — educational guidance, not legal advice. Replace [bracketed] values and have it reviewed by qualified counsel._', '');
  L.push('## 1. Purpose', d.purpose, '');
  L.push('## 2. Scope', d.scope, '');
  L.push('## 3. Policy statements', '');
  d.clauses.forEach((c, i) => L.push(`${i + 1}. ${c}`));
  L.push('');
  L.push('## 4. Ownership & responsibilities', `This policy is owned by **${owner}**${p.role?.mandate ? ` — ${p.role.mandate}` : ''} Every control it establishes has a named owner.`, '');
  L.push('## 5. Review & maintenance', `This policy is reviewed ${d.review} by ${owner}, and updated after any material change or significant incident.`, '');
  return L.join('\n');
}

function downloadDraft(p) {
  const blob = new Blob([draftMarkdown(p)], { type: 'text/markdown;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${p.id}-policy-template.md`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}

// A small labelled group of chips, used across the library cards.
function ChipBlock({ label, items, tone, empty }) {
  const tones = {
    sky: 'bg-sky-50 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300',
    emerald: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
    rose: 'bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
  };
  return (
    <div>
      <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{label}</span>
      <span className="mt-1.5 flex flex-wrap gap-1">
        {items.length === 0 && empty && <span className="text-xs text-slate-400">{empty}</span>}
        {items.map((it, i) => (
          <span key={i} className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${tones[tone]}`}>{it}</span>
        ))}
      </span>
    </div>
  );
}
