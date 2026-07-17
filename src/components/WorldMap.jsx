// World map built on the illustrated map image. Clickable continent hotspots
// (positioned as % of the image) select a region group and filter the atlas.
// Hovering a region's count badge pops an animated list of all its instruments.
// "Global" instruments aren't a place, so they get a pill above the map.
// Asia-Pacific = the Asia hotspot + the Australia hotspot (both select it).

const HOTSPOTS = [
  { group: 'North America', short: 'N. America', left: 3, top: 4, width: 45, height: 43, bx: 21, by: 21 },
  { group: 'Latin America', short: 'L. America', left: 26, top: 45, width: 16, height: 39, bx: 33, by: 60 },
  { group: 'Europe', short: 'Europe', left: 45, top: 6, width: 22, height: 28, bx: 57, by: 20 },
  { group: 'Africa', short: 'Africa', left: 44, top: 32, width: 20, height: 35, bx: 54, by: 48 },
  { group: 'Asia-Pacific', short: 'Asia-Pacific', left: 62, top: 5, width: 37, height: 48, bx: 78, by: 30 },
  { group: 'Asia-Pacific', short: 'Australia', left: 72, top: 57, width: 13, height: 19, secondary: true },
];

export default function WorldMap({ regionItems, selected, onSelect }) {
  const countOf = (g) => (regionItems[g] || []).length;

  function pick(group) {
    onSelect(selected === group ? 'All' : group);
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      {/* Global standards pill (apply everywhere) */}
      <div className="mb-3 flex items-center justify-center">
        <span className="group/badge relative">
          <button
            onClick={() => pick('Global')}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium transition ${
              selected === 'Global'
                ? 'border-sky-500 bg-sky-500 text-white'
                : 'border-sky-300 bg-sky-50 text-sky-700 hover:border-sky-400 dark:border-sky-700 dark:bg-sky-900/30 dark:text-sky-300'
            }`}
          >
            🌍 Global standards &amp; frameworks
            <span className={`rounded-full px-1.5 text-xs ${selected === 'Global' ? 'bg-white/30' : 'bg-sky-200/70 dark:bg-sky-800'}`}>
              {countOf('Global')}
            </span>
          </button>
          <Popover title="Global standards" items={regionItems['Global'] || []} placement="below" />
        </span>
      </div>

      {/* The map + clickable hotspots */}
      <div className="relative">
        <img src="/world-map.jpg" alt="World map" className="block w-full select-none rounded-xl" draggable="false" />

        {HOTSPOTS.map((h, i) => {
          const n = countOf(h.group);
          const isSel = selected === h.group;
          return (
            <button
              key={i}
              onClick={() => pick(h.group)}
              aria-label={`${h.group} (${n} items)`}
              className="group absolute"
              style={{ left: `${h.left}%`, top: `${h.top}%`, width: `${h.width}%`, height: `${h.height}%` }}
            >
              {/* selection / hover highlight */}
              <span
                className={`absolute inset-0 rounded-2xl transition ${
                  isSel
                    ? 'bg-blue-400/30 ring-2 ring-blue-500'
                    : 'ring-0 group-hover:bg-white/20 group-hover:ring-2 group-hover:ring-white/70'
                }`}
              />
              {/* count badge + hover popover (not on the secondary Australia hotspot) */}
              {!h.secondary && (
                <span
                  className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${((h.bx - h.left) / h.width) * 100}%`, top: `${((h.by - h.top) / h.height) * 100}%` }}
                >
                  <span className="group/badge pointer-events-auto relative inline-block">
                    <span
                      className={`whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-bold shadow transition group-hover/badge:scale-110 ${
                        n === 0 ? 'opacity-50 ' : ''
                      }${
                        isSel ? 'bg-blue-500 text-white' : 'bg-white/90 text-slate-700 dark:bg-slate-900/85 dark:text-slate-100'
                      }`}
                    >
                      {h.short} · {n}
                    </span>
                    <Popover title={h.group} items={regionItems[h.group] || []} placement={h.by < 35 ? 'below' : 'above'} />
                  </span>
                </span>
              )}
            </button>
          );
        })}
      </div>

      <p className="mt-2 text-center text-xs text-slate-400">
        Click a region to filter, or hover a badge to preview.{' '}
        {selected !== 'All' && (
          <button onClick={() => onSelect('All')} className="font-medium text-blue-600 hover:underline dark:text-blue-400">
            Showing: {selected} ✕
          </button>
        )}
      </p>
    </div>
  );
}

// Animated hover list of every instrument in a region — the list is complete, so
// nothing is rolled into a "+N more" tail.
function Popover({ title, items, placement }) {
  // The reveal is staggered, but the total is capped so a long region (13 global
  // standards) doesn't take three times as long to appear as a short one.
  const step = Math.min(45, 360 / Math.max(items.length, 1));
  const pos =
    placement === 'below'
      ? 'top-full mt-2 origin-top'
      : 'bottom-full mb-2 origin-bottom';
  const hiddenShift = placement === 'below' ? '-translate-y-1' : 'translate-y-1';

  return (
    <span
      className={`pointer-events-none absolute left-1/2 z-50 w-56 -translate-x-1/2 ${pos} ${hiddenShift} scale-95 opacity-0 transition-all duration-200 ease-out group-hover/badge:translate-y-0 group-hover/badge:scale-100 group-hover/badge:opacity-100`}
    >
      <span className="block rounded-xl border border-slate-200 bg-white/95 p-2.5 text-left shadow-xl backdrop-blur dark:border-slate-700 dark:bg-slate-900/95">
        <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-slate-400">{title}</span>
        {items.length === 0 ? (
          <span className="block text-xs text-slate-400">No matches for the current filters.</span>
        ) : (
          <span className="block space-y-1">
            {items.map((c, idx) => (
              <span
                key={c.id}
                className="flex items-center gap-2 opacity-0 group-hover/badge:opacity-100"
                style={{ transition: 'opacity 200ms ease', transitionDelay: `${80 + idx * step}ms` }}
              >
                {/* Amber stays: matches the Atlas Global/Region-specific colour code. */}
                <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${c.scope === 'Global' ? 'bg-sky-500' : 'bg-amber-500'}`} />
                <span className="truncate text-xs font-medium text-slate-700 dark:text-slate-200">{c.name}</span>
                <span className="ml-auto shrink-0 text-[10px] text-slate-400">{c.type.replace(' / Statute', '')}</span>
              </span>
            ))}
          </span>
        )}
      </span>
    </span>
  );
}
