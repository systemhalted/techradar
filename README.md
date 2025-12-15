Build Your Own Technology Radar.

Inspired by the ThoughtWorks Tech Radar: http://www.thoughtworks.com/radar/.

I love the ThoughtWorks Radar. But it is for all clients, averaged out across industries, organisational maturity and risk adverseness.

![Technology Radar Sample](/sample_tech_radar.jpg?raw=true)

It is a powerful talking point, but I need it to be customised for particular circumstances.

This Technology Radar has pretty simple functionality, uses a json-like data source and renders SVG within html. Source files are now written in TypeScript and compiled to `dist/` for the browser.

Data entry is now simpler: just pick the quadrant and ring, the coordinates are generated for you.

- Quadrants: Techniques, Tools, Platforms, Languages & Frameworks
- Rings (from center outward): Adopt, Trial, Assess, Hold
- Optional fields: `movement: 't'` to show moved blips (triangles), `url`, `blipSize`

Example (see `radars/sample_auto_layout.ts`):

```
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

You can still provide `pc: { r, t }` if you want exact placement, but it is no longer required. The renderer uses the ring/quadrant to distribute blips within the correct slice.

Development
- Edit `.ts` files (e.g. `radar.ts`, `utils.ts`, `radars/*.ts`) and run `tsc` to emit JavaScript into `dist/`.
- `index.html` and `radar_test.html` already load the compiled files from `dist/`.
