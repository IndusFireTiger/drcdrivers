# DRCDrivers

An interactive, end-to-end explainer of **Data Risk & Compliance (DRC)** for technical people
building a product around it. You "drive" a road of six stops; at each one you learn a concept
*and* see what your product must do about it.

> Planning docs live one level up: `../learning-plan.md` and `../app-build-plan.md`.

## Status
**v1 complete & playable end-to-end.** All six stops authored; four reusable interaction types
(decision, classify, match, hotspot); completion banner + a printable one-page cheat-sheet
(`/cheatsheet`). Next up: deploy (Netlify) and a polish/QA pass — see `../app-build-plan.md`.

## Run locally
```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static output in dist/
npm run preview  # serve the built site
```

## How it's built
- **Astro** (static) + **React islands** for the interactive parts + **Tailwind**.
- **Content is data, not code.** Each lesson is a JSON file in `src/data/lessons/`. Adding a
  lesson = writing a JSON file against the schema + flipping its stop to `available` in
  `src/data/lessons.js`. No component changes needed.
- **Interaction kit** (reusable, content-driven): `DecisionScenario`, `ClassifySort`,
  `Checkpoint`. More to come (hotspot diagram, flip cards).
- **Progress** is saved in `localStorage` (no backend in v1).

## Add a lesson
1. Copy `src/data/lessons/lesson-01.json`, fill in your content.
2. Import it in `src/data/lessons.js` and set the matching stop's `available: true`.

## Deploy
Configured for **Netlify** (`netlify.toml`): build `npm run build`, publish `dist/`.
