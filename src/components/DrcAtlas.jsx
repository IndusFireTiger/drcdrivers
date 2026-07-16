import { useMemo, useState } from 'react';
import { catalog, regionGroupOrder, lessonSlugFor } from '../data/drc-catalog.js';
import { roadStops } from '../data/lessons.js';
import WorldMap from './WorldMap.jsx';
import TopNav from './TopNav.jsx';

const TYPE_ORDER = ['Regulation', 'Law / Statute', 'Framework', 'Standard', 'Program / Cert'];

// slug -> lesson title, for the "related concept" cross-links on each card.
const LESSON_TITLE = Object.fromEntries(roadStops.map((s) => [s.slug, `${s.id}. ${s.title}`]));

// Interactive atlas of DRC instruments worldwide, filterable by region, type and
// whether each is globally usable or legally region-specific.
export default function DrcAtlas() {
  const [region, setRegion] = useState('All');
  const [type, setType] = useState('All');
  const [scope, setScope] = useState('All');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return catalog.filter((c) => {
      if (region !== 'All' && c.regionGroup !== region) return false;
      if (type !== 'All' && c.type !== type) return false;
      if (scope !== 'All' && c.scope !== scope) return false;
      if (q && !(`${c.name} ${c.full} ${c.region} ${c.domain} ${c.summary}`.toLowerCase().includes(q)))
        return false;
      return true;
    });
  }, [region, type, scope, query]);

  // Items per region for the map — reflect every filter EXCEPT region itself,
  // so the map shows what each region offers given the current type/scope/search.
  const regionItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    const map = {};
    catalog.forEach((c) => {
      if (type !== 'All' && c.type !== type) return;
      if (scope !== 'All' && c.scope !== scope) return;
      if (q && !(`${c.name} ${c.full} ${c.region} ${c.domain} ${c.summary}`.toLowerCase().includes(q))) return;
      (map[c.regionGroup] ||= []).push(c);
    });
    return map;
  }, [type, scope, query]);

  // Group the results by region group, in display order.
  const groups = regionGroupOrder
    .map((g) => ({ group: g, items: filtered.filter((c) => c.regionGroup === g) }))
    .filter((g) => g.items.length > 0);

  const reset = () => {
    setRegion('All');
    setType('All');
    setScope('All');
    setQuery('');
  };

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <TopNav current="atlas" />
      <header className="mt-6 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-amber-600 dark:text-amber-400">The DRC Atlas</p>
        <h1 className="mt-2 text-4xl font-bold text-slate-900 dark:text-slate-100">
          Regulations, laws, frameworks &amp; standards — worldwide
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-slate-600 dark:text-slate-300">
          The Data Risk &amp; Compliance landscape in one place. Some apply{' '}
          <span className="font-semibold text-sky-600 dark:text-sky-400">everywhere</span>; many are{' '}
          <span className="font-semibold text-amber-600 dark:text-amber-400">tied to a region</span>. Filter to see how
          they differ — and which your product must answer to.
        </p>
      </header>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap justify-center gap-3 text-xs">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-3 py-1 font-medium text-sky-700 dark:bg-sky-900/30 dark:text-sky-300">
          🌍 Global — voluntary / international, usable anywhere
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
          📍 Region-specific — legally binding in a jurisdiction
        </span>
      </div>

      {/* World map */}
      <div className="mt-8">
        <WorldMap regionItems={regionItems} selected={region} onSelect={setRegion} />
      </div>

      {/* Filters */}
      <div className="mt-6 space-y-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <FilterRow label="Region">
          <Chip active={region === 'All'} onClick={() => setRegion('All')}>All</Chip>
          {regionGroupOrder.map((g) => (
            <Chip key={g} active={region === g} onClick={() => setRegion(g)}>{g}</Chip>
          ))}
        </FilterRow>
        <FilterRow label="Type">
          <Chip active={type === 'All'} onClick={() => setType('All')}>All</Chip>
          {TYPE_ORDER.map((t) => (
            <Chip key={t} active={type === t} onClick={() => setType(t)}>{t}</Chip>
          ))}
        </FilterRow>
        <FilterRow label="Scope">
          <Chip active={scope === 'All'} onClick={() => setScope('All')}>All</Chip>
          <Chip active={scope === 'Global'} onClick={() => setScope('Global')}>🌍 Global</Chip>
          <Chip active={scope === 'Region-specific'} onClick={() => setScope('Region-specific')}>📍 Region-specific</Chip>
        </FilterRow>
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, domain, keyword…"
            className="min-w-[200px] flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-amber-400 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
          />
          <button onClick={reset} className="rounded-lg px-3 py-2 text-sm font-medium text-slate-500 hover:text-amber-600 dark:text-slate-400">
            Reset
          </button>
        </div>
      </div>

      <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
        Showing <strong className="text-slate-700 dark:text-slate-200">{filtered.length}</strong> of {catalog.length} instruments
      </p>

      {/* Results grouped by region */}
      {groups.length === 0 ? (
        <p className="mt-10 text-center text-slate-400">No matches — try clearing a filter.</p>
      ) : (
        groups.map(({ group, items }) => (
          <section key={group} className="mt-8">
            <h2 className="flex items-center gap-2 border-b border-slate-200 pb-2 text-lg font-bold text-slate-800 dark:border-slate-700 dark:text-slate-200">
              {group === 'Global' ? '🌍' : '📍'} {group}
              <span className="text-sm font-normal text-slate-400">({items.length})</span>
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((c) => (
                <Card key={c.id} item={c} />
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}

function FilterRow({ label, children }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="w-16 shrink-0 text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</span>
      {children}
    </div>
  );
}

function Chip({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-sm transition ${
        active
          ? 'border-amber-500 bg-amber-500 text-white'
          : 'border-slate-300 text-slate-600 hover:border-amber-400 dark:border-slate-600 dark:text-slate-300'
      }`}
    >
      {children}
    </button>
  );
}

function Card({ item }) {
  const isGlobal = item.scope === 'Global';
  return (
    <div className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-amber-400 hover:shadow-md dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-bold text-slate-900 dark:text-slate-100">{item.name}</h3>
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
            isGlobal
              ? 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300'
              : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
          }`}
        >
          {isGlobal ? '🌍 Global' : '📍 Regional'}
        </span>
      </div>
      <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{item.full}</p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        <Tag>{item.type}</Tag>
        <Tag>{item.domain}</Tag>
        {item.year && <Tag>{item.year}</Tag>}
      </div>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{item.summary}</p>
      <div className="mt-auto pt-3">
        <p className="text-xs font-medium text-slate-400">{item.region}</p>
        {(() => {
          const slug = lessonSlugFor(item);
          return (
            <a
              href={`/lesson/${slug}`}
              className="mt-2 inline-block text-xs font-medium text-sky-600 hover:underline dark:text-sky-400"
            >
              ↳ Concept: {LESSON_TITLE[slug]}
            </a>
          );
        })()}
      </div>
    </div>
  );
}

function Tag({ children }) {
  return (
    <span className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-300">
      {children}
    </span>
  );
}
