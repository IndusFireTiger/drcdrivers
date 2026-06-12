// Road metadata — the 6 stops. Full lesson content lives in ./lessons/lesson-XX.json.
// A lesson is "available" when its JSON is imported and registered below.
import lesson01 from './lessons/lesson-01.json';
import lesson02 from './lessons/lesson-02.json';
import lesson03 from './lessons/lesson-03.json';
import lesson04 from './lessons/lesson-04.json';
import lesson05 from './lessons/lesson-05.json';
import lesson06 from './lessons/lesson-06.json';

// All authored lessons, in road order.
const lessons = [lesson01, lesson02, lesson03, lesson04, lesson05, lesson06];

const authored = Object.fromEntries(lessons.map((l) => [l.id, l]));

// Road list = id, slug, title, subtitle, icon, available
export const roadStops = lessons.map((l) => ({
  id: l.id,
  slug: l.slug,
  title: l.title,
  subtitle: l.subtitle,
  icon: l.icon,
  available: true,
}));

export function getLesson(slug) {
  const stop = roadStops.find((s) => s.slug === slug);
  if (!stop) return null;
  return authored[stop.id] ?? null;
}

export function getAllSlugs() {
  return roadStops.filter((s) => s.available).map((s) => s.slug);
}
