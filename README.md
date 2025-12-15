Build Your Own Technology Radar.

Inspired by the ThoughtWorks Tech Radar: http://www.thoughtworks.com/radar/.

I love the ThoughtWorks Radar. But it is for all clients, averaged out across industries, organisational maturity and risk adverseness.

![Technology Radar Sample](/techradar_example.png?raw=true)

It is a powerful talking point, but I need it to be customised for particular circumstances.

This Technology Radar has pretty simple functionality, uses json data source and renders SVG within html.

Data entry is now simpler: just pick the quadrant and ring, the coordinates are generated for you.

- Quadrants: Techniques, Tools, Platforms, Languages & Frameworks
- Rings (from center outward): Adopt, Trial, Assess, Hold
- Optional fields: `movement: 't'` to show moved blips (triangles), `url`, `blipSize`

Example (see `radars/sample_auto_layout.js`):

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
