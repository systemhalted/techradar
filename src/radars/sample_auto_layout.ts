(function loadSampleAutoLayout() {
  // Sample radar that relies on auto-layout: just provide quadrant + ring.
  document.title = "Sample Technology Radar (Auto Layout)";

  var radar_arcs: RadarArc[] = [
    { r: 100, name: "Adopt" },
    { r: 200, name: "Trial" },
    { r: 300, name: "Assess" },
    { r: 400, name: "Hold" }
  ];

  var h = 1000;
  var w = 1200;

  var radar_data: RadarQuadrant[] = [
    {
      quadrant: "Techniques",
      color: "#8FA227",
      items: [
        { name: "Pair Programming", ring: "Adopt", movement: "c" },
        { name: "Trunk-Based Development", ring: "Adopt", movement: "t" },
        { name: "Feature Flags", ring: "Trial", movement: "t" },
        { name: "Chaos Experiments", ring: "Assess", movement: "t" },
        { name: "Big Design Up Front", ring: "Hold", movement: "c" }
      ]
    },
    {
      quadrant: "Tools",
      color: "#587486",
      items: [
        { name: "GitHub Actions", ring: "Adopt", movement: "c" },
        { name: "Grafana", ring: "Adopt", movement: "c" },
        { name: "Playwright", ring: "Trial", movement: "t" },
        { name: "Cypress", ring: "Trial", movement: "c" },
        { name: "Pact (Contract Testing)", ring: "Assess", movement: "t" },
        { name: "Subversion", ring: "Hold", movement: "c" }
      ]
    },
    {
      quadrant: "Platforms",
      color: "#DC6F1D",
      items: [
        { name: "AWS Lambda", ring: "Adopt", movement: "t" },
        { name: "Kubernetes", ring: "Trial", movement: "c" },
        { name: "Cloud Run", ring: "Trial", movement: "t" },
        { name: "Edge Functions", ring: "Assess", movement: "t" },
        { name: "On-Prem VM Farms", ring: "Hold", movement: "c" }
      ]
    },
    {
      quadrant: "Languages & Frameworks",
      color: "#B70062",
      items: [
        { name: "TypeScript", ring: "Adopt", movement: "c" },
        { name: "Kotlin", ring: "Adopt", movement: "t" },
        { name: "Go", ring: "Trial", movement: "c" },
        { name: "Rust", ring: "Trial", movement: "t" },
        { name: "Scala", ring: "Assess", movement: "c" },
        { name: "PHP 5", ring: "Hold", movement: "c" }
      ]
    }
  ];

  (window as any).radar_arcs = radar_arcs;
  (window as any).radar_data = radar_data;
  (window as any).h = h;
  (window as any).w = w;
})();
