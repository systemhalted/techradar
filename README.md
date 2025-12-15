Build Your Own Technology Radar
===============================

A lightweight clone of the ThoughtWorks Technology Radar (https://www.thoughtworks.com/radar/) that you can populate with your own data. The radar renders to SVG in the browser using Protovis and jQuery, and ships with auto-layout so you only specify quadrant + ring.

![Technology Radar Sample](/public/assets/sample_tech_radar.jpg?raw=true)

Project structure
- `src/` – TypeScript sources:
  - `radar.ts` – entry point that reads global data and renders the radar with Protovis.
  - `radar_layout.ts` – layout helpers (ring lookup, angle ranges, jittered radius, angle distribution).
  - `coordinates.ts` – coordinate math helpers (polar/cartesian/raster conversions).
  - `radars/*.ts` – datasets; each sets `window.radar_arcs`, `window.radar_data`, `h`, `w`.
  - `types.d.ts` – shared types for arcs, items, quadrants, and the globals.
  - `tests/*.ts` – Jasmine specs for helpers and coordinates.
- `public/` – Static assets served to the browser: HTML, libs, images, and compiled JS in `public/dist/`.
- `public/dist/` – Compiled JS from `src/` (including `dist/radars` and `dist/tests`).
- `public/lib/` – Third-party libraries (Protovis, Lodash, Jasmine).
- `public/tests.html` – Jasmine runner that pulls compiled specs from `public/dist/tests/`.
- `public/index.html` – main page that loads libs, a dataset from `dist/radars/`, layout/helpers, and the renderer.

What the renderer expects
- Quadrants: Techniques, Tools, Platforms, Languages & Frameworks.
- Rings (center → outward): Adopt, Trial, Assess, Hold.
- Item fields: `name` (required), `ring` (required unless `pc` is given), `movement: 't' | 'c'` (triangle for moved items), optional `url`, optional `blipSize`, optional `pc: { r, t }` for manual placement.

Minimal example (see `src/radars/sample_auto_layout.ts`)
```ts
var radar_data = [
  {
    quadrant: "Techniques",
    color: "#8FA227",
    items: [
      { name: "Pair Programming", ring: "Adopt", movement: "c" },
      { name: "Chaos Experiments", ring: "Assess", movement: "t" }
    ]
  }
];
```

Running the radar
- Open `public/index.html` directly in a browser; it uses the prebuilt files in `public/dist/`.
- Or serve the `public/` directory: `python -m http.server 8080 --directory public` then visit `http://localhost:8080`.
- Swap datasets by changing the `<script>` in `public/index.html` to point at a different file in `public/dist/radars/`.

Development
- Edit files in `src/` and run `tsc` to emit JS into `public/dist/` (tsconfig is set up for this).
- Specs live in `src/tests/` and compile to `public/dist/tests/`; run them in the browser via `public/tests.html` (loads Jasmine from `public/lib/`).
- Keep third-party libs under `public/lib/`; the runtime only depends on the compiled JS in `public/dist/`.
