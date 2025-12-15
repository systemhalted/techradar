interface RadarArc {
  r: number;
  name: string;
}

interface PolarCoord {
  r: number;
  t: number;
}

type Movement = 't' | 'c';

interface RadarItem {
  name: string;
  ring?: string;
  movement?: Movement;
  url?: string;
  blipSize?: number;
  domain?: string;
  pc?: PolarCoord;
  ringIndex?: number;
  ringName?: string;
}

interface RadarQuadrant {
  quadrant: string;
  left?: number;
  top?: number;
  color: string;
  items: RadarItem[];
}

interface AngleRange {
  start: number;
  end: number;
}

declare var radar_arcs: RadarArc[];
declare var radar_data: RadarQuadrant[];
declare var h: number;
declare var w: number;
declare var radar_title: string | undefined;

declare const pv: any;
declare const _: any;
declare const $: any;

interface Window {
  radar_arcs?: RadarArc[];
  radar_data?: RadarQuadrant[];
  h?: number;
  w?: number;
  radar_title?: string;
}
