/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

import ColorUtils from './../../helpers/ColorUtils';
import SVGPoints from './../../helpers/SVGPoints';
import has from './has';

function parseD(value) {
  // in case of d="" for any reason, don't try to expand this otherwise this will choke
  // #TODO: arguably we should preprocess SVGs before things get this far; try svgo?
  if (!value) return [];
  // Allow points to return an array for convenience, and let downstream marshal it
  if (Array.isArray(value)) {
    return value;
  }
  return SVGPoints.pathToPoints(value);
}

function generateD(value) {
  if (typeof value === 'string') return value;
  return SVGPoints.pointsToPath(value);
}

function parseColor(value) {
  return ColorUtils.parseString(value);
}

function generateColor(value) {
  return ColorUtils.generateString(value);
}

function parsePoints(value) {
  if (Array.isArray(value)) return value;
  return SVGPoints.polyPointsStringToPoints(value);
}

function generatePoints(value) {
  if (typeof value === 'string') return value;
  return SVGPoints.pointsToPolyString(value);
}

const STYLE_COLOR_PARSERS = {
  'style.stroke': {parse: parseColor, generate: generateColor},
  'style.fill': {parse: parseColor, generate: generateColor},
  'style.backgroundColor': {parse: parseColor, generate: generateColor},
  'style.borderBottomColor': {parse: parseColor, generate: generateColor},
  'style.borderColor': {parse: parseColor, generate: generateColor},
  'style.borderLeftColor': {parse: parseColor, generate: generateColor},
  'style.borderRightColor': {parse: parseColor, generate: generateColor},
  'style.borderTopColor': {parse: parseColor, generate: generateColor},
  'style.floodColor': {parse: parseColor, generate: generateColor},
  'style.lightingColor': {parse: parseColor, generate: generateColor},
  'style.stopColor': {parse: parseColor, generate: generateColor},
};

const SVG_COLOR_PARSERS = {
  stroke: {parse: parseColor, generate: generateColor},
  fill: {parse: parseColor, generate: generateColor},
  floodColor: {parse: parseColor, generate: generateColor},
  lightingColor: {parse: parseColor, generate: generateColor},
  stopColor: {parse: parseColor, generate: generateColor},
  backgroundColor: {parse: parseColor, generate: generateColor},
  animateColor: {parse: parseColor, generate: generateColor},
  feColor: {parse: parseColor, generate: generateColor},
  // Note the hyphenated duplicates, for convenience
  'flood-color': {parse: parseColor, generate: generateColor},
  'lighting-color': {parse: parseColor, generate: generateColor},
  'stop-color': {parse: parseColor, generate: generateColor},
  'background-color': {parse: parseColor, generate: generateColor},
  'animate-color': {parse: parseColor, generate: generateColor},
  'fe-color': {parse: parseColor, generate: generateColor},
};

const SVG_PATH_PARSERS = {
  d: {parse: parseD, generate: generateD},
};

const SVG_POINT_PARSERS = {
  points: {parse: parsePoints, generate: generatePoints},
};

export default {
  'missing-glyph': has(STYLE_COLOR_PARSERS),
  a: has(STYLE_COLOR_PARSERS, SVG_COLOR_PARSERS),
  abbr: has(STYLE_COLOR_PARSERS),
  acronym: has(STYLE_COLOR_PARSERS),
  address: has(STYLE_COLOR_PARSERS),
  altGlyph: has(STYLE_COLOR_PARSERS, SVG_COLOR_PARSERS),
  altGlyphDef: has(STYLE_COLOR_PARSERS, SVG_COLOR_PARSERS),
  altGlyphItem: has(STYLE_COLOR_PARSERS, SVG_COLOR_PARSERS),
  animate: has(STYLE_COLOR_PARSERS, SVG_COLOR_PARSERS),
  animateColor: has(STYLE_COLOR_PARSERS, SVG_COLOR_PARSERS),
  animateMotion: has(STYLE_COLOR_PARSERS, SVG_COLOR_PARSERS),
  animateTransform: has(STYLE_COLOR_PARSERS, SVG_COLOR_PARSERS),
  applet: has(STYLE_COLOR_PARSERS),
  area: has(STYLE_COLOR_PARSERS),
  article: has(STYLE_COLOR_PARSERS),
  aside: has(STYLE_COLOR_PARSERS),
  audio: has(STYLE_COLOR_PARSERS),
  b: has(STYLE_COLOR_PARSERS),
  base: has(STYLE_COLOR_PARSERS),
  basefont: has(STYLE_COLOR_PARSERS),
  bdi: has(STYLE_COLOR_PARSERS),
  bdo: has(STYLE_COLOR_PARSERS),
  big: has(STYLE_COLOR_PARSERS),
  blockquote: has(STYLE_COLOR_PARSERS),
  body: has(STYLE_COLOR_PARSERS),
  br: has(STYLE_COLOR_PARSERS),
  button: has(STYLE_COLOR_PARSERS),
  canvas: has(STYLE_COLOR_PARSERS),
  caption: has(STYLE_COLOR_PARSERS),
  center: has(STYLE_COLOR_PARSERS),
  circle: has(STYLE_COLOR_PARSERS, SVG_COLOR_PARSERS),
  cite: has(STYLE_COLOR_PARSERS),
  clipPath: has(STYLE_COLOR_PARSERS),
  code: has(STYLE_COLOR_PARSERS),
  col: has(STYLE_COLOR_PARSERS),
  colgroup: has(STYLE_COLOR_PARSERS),
  'color-profile': has(STYLE_COLOR_PARSERS),
  command: has(STYLE_COLOR_PARSERS),
  cursor: has(STYLE_COLOR_PARSERS),
  datalist: has(STYLE_COLOR_PARSERS),
  dd: has(STYLE_COLOR_PARSERS),
  defs: has(STYLE_COLOR_PARSERS, SVG_COLOR_PARSERS),
  del: has(STYLE_COLOR_PARSERS),
  desc: has(STYLE_COLOR_PARSERS),
  details: has(STYLE_COLOR_PARSERS),
  dfn: has(STYLE_COLOR_PARSERS),
  dir: has(STYLE_COLOR_PARSERS),
  discard: has(STYLE_COLOR_PARSERS, SVG_COLOR_PARSERS),
  div: has(STYLE_COLOR_PARSERS),
  dl: has(STYLE_COLOR_PARSERS),
  dt: has(STYLE_COLOR_PARSERS),
  ellipse: has(STYLE_COLOR_PARSERS, SVG_COLOR_PARSERS),
  em: has(STYLE_COLOR_PARSERS),
  embed: has(STYLE_COLOR_PARSERS),
  feBlend: has(STYLE_COLOR_PARSERS, SVG_COLOR_PARSERS),
  feColorMatrix: has(STYLE_COLOR_PARSERS, SVG_COLOR_PARSERS),
  feComponentTransfer: has(STYLE_COLOR_PARSERS, SVG_COLOR_PARSERS),
  feComposite: has(STYLE_COLOR_PARSERS, SVG_COLOR_PARSERS),
  feConvolveMatrix: has(STYLE_COLOR_PARSERS, SVG_COLOR_PARSERS),
  feDiffuseLighting: has(STYLE_COLOR_PARSERS, SVG_COLOR_PARSERS),
  feDisplacementMap: has(STYLE_COLOR_PARSERS, SVG_COLOR_PARSERS),
  feDistantLight: has(STYLE_COLOR_PARSERS, SVG_COLOR_PARSERS),
  feDropShadow: has(STYLE_COLOR_PARSERS, SVG_COLOR_PARSERS),
  feFlood: has(STYLE_COLOR_PARSERS, SVG_COLOR_PARSERS),
  feFuncA: has(STYLE_COLOR_PARSERS),
  feFuncB: has(STYLE_COLOR_PARSERS),
  feFuncG: has(STYLE_COLOR_PARSERS),
  feFuncR: has(STYLE_COLOR_PARSERS),
  feGaussianBlur: has(STYLE_COLOR_PARSERS, SVG_COLOR_PARSERS),
  feImage: has(STYLE_COLOR_PARSERS, SVG_COLOR_PARSERS),
  feMerge: has(STYLE_COLOR_PARSERS, SVG_COLOR_PARSERS),
  feMergeNode: has(STYLE_COLOR_PARSERS, SVG_COLOR_PARSERS),
  feMorphology: has(STYLE_COLOR_PARSERS, SVG_COLOR_PARSERS),
  feOffset: has(STYLE_COLOR_PARSERS, SVG_COLOR_PARSERS),
  fePointLight: has(STYLE_COLOR_PARSERS, SVG_COLOR_PARSERS),
  feSpecularLighting: has(STYLE_COLOR_PARSERS, SVG_COLOR_PARSERS),
  feTile: has(STYLE_COLOR_PARSERS, SVG_COLOR_PARSERS),
  feTurbulence: has(STYLE_COLOR_PARSERS, SVG_COLOR_PARSERS),
  fieldset: has(STYLE_COLOR_PARSERS),
  figcaption: has(STYLE_COLOR_PARSERS),
  figure: has(STYLE_COLOR_PARSERS),
  filter: has(STYLE_COLOR_PARSERS, SVG_COLOR_PARSERS),
  'font-face': has(STYLE_COLOR_PARSERS),
  'font-face-format': has(STYLE_COLOR_PARSERS),
  'font-face-name': has(STYLE_COLOR_PARSERS),
  'font-face-src': has(STYLE_COLOR_PARSERS),
  'font-face-uri': has(STYLE_COLOR_PARSERS),
  font: has(STYLE_COLOR_PARSERS, SVG_COLOR_PARSERS),
  footer: has(STYLE_COLOR_PARSERS),
  foreignObject: has(STYLE_COLOR_PARSERS),
  form: has(STYLE_COLOR_PARSERS),
  frame: has(STYLE_COLOR_PARSERS),
  frameset: has(STYLE_COLOR_PARSERS),
  g: has(STYLE_COLOR_PARSERS, SVG_COLOR_PARSERS),
  glyph: has(STYLE_COLOR_PARSERS, SVG_COLOR_PARSERS),
  glyphRef: has(STYLE_COLOR_PARSERS, SVG_COLOR_PARSERS),
  h1: has(STYLE_COLOR_PARSERS),
  h2: has(STYLE_COLOR_PARSERS),
  h3: has(STYLE_COLOR_PARSERS),
  h4: has(STYLE_COLOR_PARSERS),
  h5: has(STYLE_COLOR_PARSERS),
  h6: has(STYLE_COLOR_PARSERS),
  hatch: has(STYLE_COLOR_PARSERS, SVG_COLOR_PARSERS),
  hatchpath: has(STYLE_COLOR_PARSERS, SVG_COLOR_PARSERS),
  head: has(STYLE_COLOR_PARSERS),
  header: has(STYLE_COLOR_PARSERS),
  hgroup: has(STYLE_COLOR_PARSERS),
  hkern: has(STYLE_COLOR_PARSERS),
  hr: has(STYLE_COLOR_PARSERS),
  html: has(STYLE_COLOR_PARSERS),
  i: has(STYLE_COLOR_PARSERS),
  iframe: has(STYLE_COLOR_PARSERS),
  image: has(STYLE_COLOR_PARSERS, SVG_COLOR_PARSERS),
  img: has(STYLE_COLOR_PARSERS),
  input: has(STYLE_COLOR_PARSERS),
  ins: has(STYLE_COLOR_PARSERS),
  kbd: has(STYLE_COLOR_PARSERS),
  keygen: has(STYLE_COLOR_PARSERS),
  label: has(STYLE_COLOR_PARSERS),
  legend: has(STYLE_COLOR_PARSERS),
  li: has(STYLE_COLOR_PARSERS),
  line: has(STYLE_COLOR_PARSERS, SVG_COLOR_PARSERS),
  linearGradient: has(STYLE_COLOR_PARSERS, SVG_COLOR_PARSERS),
  link: has(STYLE_COLOR_PARSERS),
  map: has(STYLE_COLOR_PARSERS),
  mark: has(STYLE_COLOR_PARSERS, SVG_COLOR_PARSERS),
  marker: has(STYLE_COLOR_PARSERS, SVG_COLOR_PARSERS),
  mask: has(STYLE_COLOR_PARSERS, SVG_COLOR_PARSERS),
  menu: has(STYLE_COLOR_PARSERS),
  mesh: has(STYLE_COLOR_PARSERS, SVG_COLOR_PARSERS),
  meshgradient: has(STYLE_COLOR_PARSERS, SVG_COLOR_PARSERS),
  meshpatch: has(STYLE_COLOR_PARSERS, SVG_COLOR_PARSERS),
  meshrow: has(STYLE_COLOR_PARSERS, SVG_COLOR_PARSERS),
  meta: has(STYLE_COLOR_PARSERS),
  metadata: has(STYLE_COLOR_PARSERS),
  meter: has(STYLE_COLOR_PARSERS),
  mpath: has(STYLE_COLOR_PARSERS, SVG_COLOR_PARSERS),
  nav: has(STYLE_COLOR_PARSERS),
  noframes: has(STYLE_COLOR_PARSERS),
  noscript: has(STYLE_COLOR_PARSERS),
  object: has(STYLE_COLOR_PARSERS),
  ol: has(STYLE_COLOR_PARSERS),
  optgroup: has(STYLE_COLOR_PARSERS),
  option: has(STYLE_COLOR_PARSERS),
  output: has(STYLE_COLOR_PARSERS),
  p: has(STYLE_COLOR_PARSERS),
  param: has(STYLE_COLOR_PARSERS),
  path: has(SVG_PATH_PARSERS, SVG_COLOR_PARSERS, STYLE_COLOR_PARSERS),
  pattern: has(STYLE_COLOR_PARSERS, SVG_COLOR_PARSERS),
  polygon: has(SVG_POINT_PARSERS, SVG_COLOR_PARSERS, STYLE_COLOR_PARSERS),
  polyline: has(SVG_POINT_PARSERS, SVG_COLOR_PARSERS, STYLE_COLOR_PARSERS),
  pre: has(STYLE_COLOR_PARSERS),
  progress: has(STYLE_COLOR_PARSERS),
  q: has(STYLE_COLOR_PARSERS),
  radialGradient: has(STYLE_COLOR_PARSERS, SVG_COLOR_PARSERS),
  rect: has(STYLE_COLOR_PARSERS, SVG_COLOR_PARSERS),
  rp: has(STYLE_COLOR_PARSERS),
  rt: has(STYLE_COLOR_PARSERS),
  ruby: has(STYLE_COLOR_PARSERS),
  s: has(STYLE_COLOR_PARSERS),
  samp: has(STYLE_COLOR_PARSERS),
  script: has(STYLE_COLOR_PARSERS),
  section: has(STYLE_COLOR_PARSERS),
  select: has(STYLE_COLOR_PARSERS),
  set: has(STYLE_COLOR_PARSERS),
  small: has(STYLE_COLOR_PARSERS),
  solidcolor: has(STYLE_COLOR_PARSERS, SVG_COLOR_PARSERS),
  source: has(STYLE_COLOR_PARSERS),
  span: has(STYLE_COLOR_PARSERS),
  stop: has(STYLE_COLOR_PARSERS, SVG_COLOR_PARSERS),
  strike: has(STYLE_COLOR_PARSERS),
  strong: has(STYLE_COLOR_PARSERS),
  style: has(STYLE_COLOR_PARSERS),
  sub: has(STYLE_COLOR_PARSERS),
  summary: has(STYLE_COLOR_PARSERS),
  sup: has(STYLE_COLOR_PARSERS),
  svg: has(STYLE_COLOR_PARSERS, SVG_COLOR_PARSERS),
  switch: has(STYLE_COLOR_PARSERS),
  symbol: has(STYLE_COLOR_PARSERS),
  table: has(STYLE_COLOR_PARSERS),
  tbody: has(STYLE_COLOR_PARSERS),
  td: has(STYLE_COLOR_PARSERS),
  text: has(STYLE_COLOR_PARSERS, SVG_COLOR_PARSERS),
  textarea: has(STYLE_COLOR_PARSERS),
  textPath: has(STYLE_COLOR_PARSERS, SVG_COLOR_PARSERS),
  tfoot: has(STYLE_COLOR_PARSERS),
  th: has(STYLE_COLOR_PARSERS),
  thead: has(STYLE_COLOR_PARSERS),
  time: has(STYLE_COLOR_PARSERS),
  title: has(STYLE_COLOR_PARSERS),
  tr: has(STYLE_COLOR_PARSERS),
  track: has(STYLE_COLOR_PARSERS),
  tref: has(STYLE_COLOR_PARSERS, SVG_COLOR_PARSERS),
  tspan: has(STYLE_COLOR_PARSERS, SVG_COLOR_PARSERS),
  tt: has(STYLE_COLOR_PARSERS),
  u: has(STYLE_COLOR_PARSERS),
  ul: has(STYLE_COLOR_PARSERS),
  unknown: has(STYLE_COLOR_PARSERS),
  us: has(STYLE_COLOR_PARSERS),
  use: has(STYLE_COLOR_PARSERS),
  var: has(STYLE_COLOR_PARSERS),
  video: has(STYLE_COLOR_PARSERS),
  view: has(STYLE_COLOR_PARSERS),
  vkern: has(STYLE_COLOR_PARSERS),
  wb: has(STYLE_COLOR_PARSERS),
};
