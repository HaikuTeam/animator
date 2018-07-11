/** @file SVG enums */
export enum SvgTag {
  Defs = 'defs',
  Group = 'g',
  CircleShape = 'circle',
  EllipseShape = 'ellipse',
  Image = 'image',
  LinearGradient = 'linearGradient',
  RadialGradient = 'radialGradient',
  RectangleShape = 'rect',
  PathShape = 'path',
  PolygonShape = 'polygon',
  PolylineShape = 'polyline',
  Svg = 'svg',
  Use = 'use',
  // Not really an SVG tag, but behaves like one in our layout semantics.
  Div = 'div',
}
