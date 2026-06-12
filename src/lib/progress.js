// Tiny localStorage-backed progress tracker. No backend for v1.
const KEY = 'drcdrivers:progress';

function read() {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(window.localStorage.getItem(KEY) || '{}');
  } catch {
    return {};
  }
}

function write(data) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(KEY, JSON.stringify(data));
}

export function isComplete(slug) {
  return Boolean(read()[slug]);
}

export function markComplete(slug) {
  const data = read();
  data[slug] = { completedAt: new Date().toISOString() };
  write(data);
}

export function completedCount() {
  return Object.keys(read()).length;
}
