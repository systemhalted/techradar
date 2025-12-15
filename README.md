Build Your Own Technology Radar
===============================

A lightweight clone of the ThoughtWorks Technology Radar (https://www.thoughtworks.com/radar/) that you can populate with your own data. The radar renders to SVG in the browser using Protovis and jQuery, and ships with auto-layout so you only specify quadrant + ring.

![Technology Radar Sample](/sample_tech_radar.jpg?raw=true)

What’s inside
- TypeScript sources compiled to browser-ready JS in `dist/`.
- Auto-layout: drop coordinates entirely; specify `quadrant` + `ring` and the renderer scatters points within the correct slice. If you need exact placement, you can still supply `pc: { r, t }`.
- Sample datasets under `radars/` (ThoughtWorks 2010, Wotif 2014, Capital One 2016, and an auto-layout demo).

Data model
- Quadrants: Techniques, Tools, Platforms, Languages & Frameworks.
- Rings (center → outward): Adopt, Trial, Assess, Hold.
- Item fields: `name` (required), `ring` (required unless `pc` is given), `movement: 't' | 'c'` (triangle for moved items), optional `url`, optional `blipSize`, optional `pc` for manual placement.

Minimal example (see `radars/sample_auto_layout.ts`)
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
- Option 1: Open `index.html` directly in a browser (uses the prebuilt files in `dist/`).
- Option 2: Serve locally, e.g. `python -m http.server 8080` then visit `http://localhost:8080/index.html`.
- Swap datasets by changing the `<script>` in `index.html` to point at a different file in `dist/radars/`.

Development
- Edit `.ts` files (`radar.ts`, `utils.ts`, `radars/*.ts`); run `tsc` to emit JS into `dist/`.
- `radar_test.html` runs Jasmine checks for the coordinate helpers.
- If you add new libraries, keep using the precompiled JS in `dist/` so the HTML stays zero-build.
