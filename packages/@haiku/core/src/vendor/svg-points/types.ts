export type ShapeSpec = CircleSpec|EllipseSpec|LineSpec|PathSpec|PolygonSpec|PolylineSpec|RectSpec;

export type CircleSpec = {
  type?: 'circle';
  cx: number;
  cy: number;
  r: number;
};

export type EllipseSpec = {
  type?: 'ellipse';
  cx?: number;
  cy?: number;
  rx?: number;
  ry?: number;
};

export type LineSpec = {
  type?: 'line';
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

export type PathSpec = {
  type?: 'path';
  d: string;
};

export type PolygonSpec = {
  type?: 'polygon';
  points: string;
};

export type PolylineSpec = {
  type?: 'polyline';
  points: string;
};

export type RectSpec = {
  type?: 'rect';
  height: number;
  width: number;
  rx?: number;
  ry?: number;
  x?: number;
  y?: number;
};

export type CurveDef = {
  type: string;
  largeArcFlag?: number;
  sweepFlag?: number;
  xAxisRotation?: number;
  rx?: number;
  ry?: number;
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
};

export type CurveSpec = {
  curve?: CurveDef;
  x: number;
  y: number;
  moveTo?: boolean;
  closed?: boolean;
};
