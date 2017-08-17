/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

// A dictionary that maps HTML+SVG element names (camelCase)
// to addressable properties. This acts as a whitelist of properties that
// _can_ be applied, and special logic for applying them.

// Just a utility for populating these objects
function has () {
  var obj = {}
  for (var i = 0; i < arguments.length; i++) {
    var arg = arguments[i]
    for (var name in arg) {
      var fn = arg[name]
      obj[name] = fn
    }
  }
  return obj
}

var TEXT_CONTENT_SCHEMA = {
  content: 'string'
}

var LAYOUT_3D_SCHEMA = {
  shown: 'boolean',
  opacity: 'number',
  'mount.x': 'number',
  'mount.y': 'number',
  'mount.z': 'number',
  'align.x': 'number',
  'align.y': 'number',
  'align.z': 'number',
  'origin.x': 'number',
  'origin.y': 'number',
  'origin.z': 'number',
  'translation.x': 'number',
  'translation.y': 'number',
  'translation.z': 'number',
  'rotation.x': 'number',
  'rotation.y': 'number',
  'rotation.z': 'number',
  'scale.x': 'number',
  'scale.y': 'number',
  'scale.z': 'number',
  'sizeAbsolute.x': 'number',
  'sizeAbsolute.y': 'number',
  'sizeAbsolute.z': 'number',
  'sizeProportional.x': 'number',
  'sizeProportional.y': 'number',
  'sizeProportional.z': 'number',
  'sizeDifferential.x': 'number',
  'sizeDifferential.y': 'number',
  'sizeDifferential.z': 'number',
  'sizeMode.x': 'number',
  'sizeMode.y': 'number',
  'sizeMode.z': 'number'
}

var LAYOUT_2D_SCHEMA = {
  shown: 'boolean',
  opacity: 'number',
  'mount.x': 'number',
  'mount.y': 'number',
  'align.x': 'number',
  'align.y': 'number',
  'origin.x': 'number',
  'origin.y': 'number',
  'translation.x': 'number',
  'translation.y': 'number',
  'translation.z': 'number',
  'rotation.x': 'number',
  'rotation.y': 'number',
  'rotation.z': 'number',
  'scale.x': 'number',
  'scale.y': 'number',
  'sizeAbsolute.x': 'number',
  'sizeAbsolute.y': 'number',
  'sizeProportional.x': 'number',
  'sizeProportional.y': 'number',
  'sizeDifferential.x': 'number',
  'sizeDifferential.y': 'number',
  'sizeMode.x': 'number',
  'sizeMode.y': 'number'
}

var PRESENTATION_SCHEMA = {
  alignmentBaseline: 'string',
  baselineShift: 'string',
  clipPath: 'string',
  clipRule: 'string',
  clip: 'string',
  colorInterpolationFilters: 'string',
  colorInterpolation: 'string',
  colorProfile: 'string',
  colorRendering: 'string',
  color: 'string',
  cursor: 'string',
  direction: 'string',
  display: 'string',
  dominantBaseline: 'string',
  enableBackground: 'string',
  fillOpacity: 'string',
  fillRule: 'string',
  fill: 'string',
  filter: 'string',
  floodColor: 'string',
  floodOpacity: 'string',
  fontFamily: 'string',
  fontSizeAdjust: 'string',
  fontSize: 'string',
  fontStretch: 'string',
  fontStyle: 'string',
  fontVariant: 'string',
  fontWeight: 'string',
  glyphOrientationHorizontal: 'string',
  glyphOrientationVertical: 'string',
  imageRendering: 'string',
  kerning: 'string',
  letterSpacing: 'string',
  lightingColor: 'string',
  markerEnd: 'string',
  markerMid: 'string',
  markerStart: 'string',
  mask: 'string',
  // opacity omitted - is part of layout algorithm
  overflow: 'string',
  overflowX: 'string',
  overflowY: 'string',
  pointerEvents: 'string',
  shapeRendering: 'string',
  stopColor: 'string',
  stopOpacity: 'string',
  strokeDasharray: 'string',
  strokeDashoffset: 'string',
  strokeLinecap: 'string',
  strokeLinejoin: 'string',
  strokeMiterlimit: 'string',
  strokeOpacity: 'string',
  strokeWidth: 'string',
  stroke: 'string',
  textAnchor: 'string',
  textDecoration: 'string',
  textRendering: 'string',
  unicodeBidi: 'string',
  visibility: 'string',
  wordSpacing: 'string',
  writingMode: 'string'
}

var FILTER_SCHEMA = {
  'x': 'string',
  'y': 'string',
  'width': 'string',
  'height': 'string',
  'filterRes': 'string',
  'filterUnits': 'string',
  'primitiveUnits': 'string'
}

var STYLE_SCHEMA = {
  'style.alignmentBaseline': 'string',
  'style.background': 'string',
  'style.backgroundAttachment': 'string',
  'style.backgroundColor': 'string',
  'style.backgroundImage': 'string',
  'style.backgroundPosition': 'string',
  'style.backgroundRepeat': 'string',
  'style.baselineShift': 'string',
  'style.border': 'string',
  'style.borderBottom': 'string',
  'style.borderBottomColor': 'string',
  'style.borderBottomStyle': 'string',
  'style.borderBottomWidth': 'string',
  'style.borderColor': 'string',
  'style.borderLeft': 'string',
  'style.borderLeftColor': 'string',
  'style.borderLeftStyle': 'string',
  'style.borderLeftWidth': 'string',
  'style.borderRight': 'string',
  'style.borderRightColor': 'string',
  'style.borderRightStyle': 'string',
  'style.borderRightWidth': 'string',
  'style.borderStyle': 'string',
  'style.borderTop': 'string',
  'style.borderTopColor': 'string',
  'style.borderTopStyle': 'string',
  'style.borderTopWidth': 'string',
  'style.borderWidth': 'string',
  'style.clear': 'string',
  'style.clip': 'string',
  'style.clipPath': 'string',
  'style.clipRule': 'string',
  'style.color': 'string',
  'style.colorInterpolation': 'string',
  'style.colorInterpolationFilters': 'string',
  'style.colorProfile': 'string',
  'style.colorRendering': 'string',
  'style.cssFloat': 'string',
  'style.cursor': 'string',
  'style.direction': 'string',
  'style.display': 'string',
  'style.dominantBaseline': 'string',
  'style.enableBackground': 'string',
  'style.fill': 'string',
  'style.fillOpacity': 'string',
  'style.fillRule': 'string',
  'style.filter': 'string',
  'style.floodColor': 'string',
  'style.floodOpacity': 'string',
  'style.font': 'string',
  'style.fontFamily': 'string',
  'style.fontSize': 'string',
  'style.fontSizeAdjust': 'string',
  'style.fontStretch': 'string',
  'style.fontStyle': 'string',
  'style.fontVariant': 'string',
  'style.fontWeight': 'string',
  'style.glyphOrientationHorizontal': 'string',
  'style.glyphOrientationVertical': 'string',
  'style.height': 'string',
  'style.imageRendering': 'string',
  'style.kerning': 'string',
  'style.left': 'string',
  'style.letterSpacing': 'string',
  'style.lightingColor': 'string',
  'style.lineHeight': 'string',
  'style.listStyle': 'string',
  'style.listStyleImage': 'string',
  'style.listStylePosition': 'string',
  'style.listStyleType': 'string',
  'style.margin': 'string',
  'style.marginBottom': 'string',
  'style.marginLeft': 'string',
  'style.marginRight': 'string',
  'style.marginTop': 'string',
  'style.markerEnd': 'string',
  'style.markerMid': 'string',
  'style.markerStart': 'string',
  'style.mask': 'string',
  'style.opacity': 'string',
  'style.overflow': 'string',
  'style.overflowX': 'string',
  'style.overflowY': 'string',
  'style.padding': 'string',
  'style.paddingBottom': 'string',
  'style.paddingLeft': 'string',
  'style.paddingRight': 'string',
  'style.paddingTop': 'string',
  'style.pageBreakAfter': 'string',
  'style.pageBreakBefore': 'string',
  'style.pointerEvents': 'string',
  'style.position': 'string',
  'style.shapeRendering': 'string',
  'style.stopColor': 'string',
  'style.stopOpacity': 'string',
  'style.stroke': 'string',
  'style.strokeDasharray': 'string',
  'style.strokeDashoffset': 'string',
  'style.strokeLinecap': 'string',
  'style.strokeLinejoin': 'string',
  'style.strokeMiterlimit': 'string',
  'style.strokeOpacity': 'string',
  'style.strokeWidth': 'string',
  'style.textAlign': 'string',
  'style.textAnchor': 'string',
  'style.textDecoration': 'string',
  'style.textDecorationBlink': 'string',
  'style.textDecorationLineThrough': 'string',
  'style.textDecorationNone': 'string',
  'style.textDecorationOverline': 'string',
  'style.textDecorationUnderline': 'string',
  'style.textIndent': 'string',
  'style.textRendering': 'string',
  'style.textTransform': 'string',
  'style.top': 'string',
  'style.unicodeBidi': 'string',
  'style.verticalAlign': 'string',
  'style.visibility': 'string',
  'style.width': 'string',
  'style.wordSpacing': 'string',
  'style.writingMode': 'string',
  'style.zIndex': 'number',
  'style.WebkitTapHighlightColor': 'string'
}

var HTML_STYLE_SHORTHAND_SCHEMA = {
  backgroundColor: 'string'
}

var CONTROL_FLOW_SCHEMA = {
  // 'controlFlow.if': 'any',
  'controlFlow.repeat': 'any',
  // 'controlFlow.yield': 'any',
  'controlFlow.placeholder': 'any'
}

module.exports = {
  'missing-glyph': has(
    CONTROL_FLOW_SCHEMA,
    LAYOUT_3D_SCHEMA,
    PRESENTATION_SCHEMA
  ),
  a: has(
    HTML_STYLE_SHORTHAND_SCHEMA,
    TEXT_CONTENT_SCHEMA,
    CONTROL_FLOW_SCHEMA,
    LAYOUT_3D_SCHEMA,
    PRESENTATION_SCHEMA,
    STYLE_SCHEMA
  ),
  abbr: has(
    HTML_STYLE_SHORTHAND_SCHEMA,
    TEXT_CONTENT_SCHEMA,
    CONTROL_FLOW_SCHEMA,
    LAYOUT_3D_SCHEMA,
    STYLE_SCHEMA
  ),
  acronym: has(
    HTML_STYLE_SHORTHAND_SCHEMA,
    TEXT_CONTENT_SCHEMA,
    CONTROL_FLOW_SCHEMA,
    LAYOUT_3D_SCHEMA,
    STYLE_SCHEMA
  ),
  address: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  altGlyph: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, PRESENTATION_SCHEMA),
  altGlyphDef: has(),
  altGlyphItem: has(),
  animate: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, PRESENTATION_SCHEMA),
  animateColor: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, PRESENTATION_SCHEMA),
  animateMotion: has(),
  animateTransform: has(),
  applet: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  area: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  article: has(
    HTML_STYLE_SHORTHAND_SCHEMA,
    TEXT_CONTENT_SCHEMA,
    CONTROL_FLOW_SCHEMA,
    LAYOUT_3D_SCHEMA,
    STYLE_SCHEMA
  ),
  aside: has(
    HTML_STYLE_SHORTHAND_SCHEMA,
    TEXT_CONTENT_SCHEMA,
    CONTROL_FLOW_SCHEMA,
    LAYOUT_3D_SCHEMA,
    STYLE_SCHEMA
  ),
  audio: has(
    HTML_STYLE_SHORTHAND_SCHEMA,
    CONTROL_FLOW_SCHEMA,
    LAYOUT_3D_SCHEMA,
    STYLE_SCHEMA
  ),
  b: has(
    HTML_STYLE_SHORTHAND_SCHEMA,
    TEXT_CONTENT_SCHEMA,
    CONTROL_FLOW_SCHEMA,
    LAYOUT_3D_SCHEMA,
    STYLE_SCHEMA
  ),
  base: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  basefont: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  bdi: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  bdo: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  big: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  blockquote: has(
    HTML_STYLE_SHORTHAND_SCHEMA,
    TEXT_CONTENT_SCHEMA,
    CONTROL_FLOW_SCHEMA,
    LAYOUT_3D_SCHEMA,
    STYLE_SCHEMA
  ),
  body: has(
    HTML_STYLE_SHORTHAND_SCHEMA,
    CONTROL_FLOW_SCHEMA,
    LAYOUT_3D_SCHEMA,
    STYLE_SCHEMA
  ),
  br: has(
    HTML_STYLE_SHORTHAND_SCHEMA,
    CONTROL_FLOW_SCHEMA,
    LAYOUT_3D_SCHEMA,
    STYLE_SCHEMA
  ),
  button: has(
    HTML_STYLE_SHORTHAND_SCHEMA,
    TEXT_CONTENT_SCHEMA,
    CONTROL_FLOW_SCHEMA,
    LAYOUT_3D_SCHEMA,
    STYLE_SCHEMA
  ),
  canvas: has(
    HTML_STYLE_SHORTHAND_SCHEMA,
    CONTROL_FLOW_SCHEMA,
    LAYOUT_3D_SCHEMA,
    STYLE_SCHEMA
  ),
  caption: has(
    HTML_STYLE_SHORTHAND_SCHEMA,
    TEXT_CONTENT_SCHEMA,
    CONTROL_FLOW_SCHEMA,
    LAYOUT_3D_SCHEMA,
    STYLE_SCHEMA
  ),
  center: has(
    HTML_STYLE_SHORTHAND_SCHEMA,
    TEXT_CONTENT_SCHEMA,
    CONTROL_FLOW_SCHEMA,
    LAYOUT_3D_SCHEMA,
    STYLE_SCHEMA
  ),
  circle: has(CONTROL_FLOW_SCHEMA, LAYOUT_2D_SCHEMA, PRESENTATION_SCHEMA),
  cite: has(
    HTML_STYLE_SHORTHAND_SCHEMA,
    TEXT_CONTENT_SCHEMA,
    CONTROL_FLOW_SCHEMA,
    LAYOUT_3D_SCHEMA,
    STYLE_SCHEMA
  ),
  clipPath: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, PRESENTATION_SCHEMA),
  code: has(
    HTML_STYLE_SHORTHAND_SCHEMA,
    TEXT_CONTENT_SCHEMA,
    CONTROL_FLOW_SCHEMA,
    LAYOUT_3D_SCHEMA,
    STYLE_SCHEMA
  ),
  col: has(
    HTML_STYLE_SHORTHAND_SCHEMA,
    CONTROL_FLOW_SCHEMA,
    LAYOUT_3D_SCHEMA,
    STYLE_SCHEMA
  ),
  colgroup: has(
    HTML_STYLE_SHORTHAND_SCHEMA,
    CONTROL_FLOW_SCHEMA,
    LAYOUT_3D_SCHEMA,
    STYLE_SCHEMA
  ),
  'color-profile': has(),
  command: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  cursor: has(),
  datalist: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  dd: has(
    HTML_STYLE_SHORTHAND_SCHEMA,
    TEXT_CONTENT_SCHEMA,
    CONTROL_FLOW_SCHEMA,
    LAYOUT_3D_SCHEMA,
    STYLE_SCHEMA
  ),
  defs: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, PRESENTATION_SCHEMA),
  del: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  desc: has(),
  details: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  dfn: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  dir: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  discard: has(),
  div: has(
    HTML_STYLE_SHORTHAND_SCHEMA,
    TEXT_CONTENT_SCHEMA,
    CONTROL_FLOW_SCHEMA,
    LAYOUT_3D_SCHEMA,
    STYLE_SCHEMA
  ),
  dl: has(
    HTML_STYLE_SHORTHAND_SCHEMA,
    TEXT_CONTENT_SCHEMA,
    CONTROL_FLOW_SCHEMA,
    LAYOUT_3D_SCHEMA,
    STYLE_SCHEMA
  ),
  dt: has(
    HTML_STYLE_SHORTHAND_SCHEMA,
    TEXT_CONTENT_SCHEMA,
    CONTROL_FLOW_SCHEMA,
    LAYOUT_3D_SCHEMA,
    STYLE_SCHEMA
  ),
  ellipse: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, PRESENTATION_SCHEMA),
  em: has(
    HTML_STYLE_SHORTHAND_SCHEMA,
    TEXT_CONTENT_SCHEMA,
    CONTROL_FLOW_SCHEMA,
    LAYOUT_3D_SCHEMA,
    STYLE_SCHEMA
  ),
  embed: has(
    HTML_STYLE_SHORTHAND_SCHEMA,
    CONTROL_FLOW_SCHEMA,
    LAYOUT_3D_SCHEMA,
    STYLE_SCHEMA
  ),
  feBlend: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, PRESENTATION_SCHEMA),
  feColorMatrix: has(
    CONTROL_FLOW_SCHEMA,
    LAYOUT_3D_SCHEMA,
    PRESENTATION_SCHEMA
  ),
  feComponentTransfer: has(
    CONTROL_FLOW_SCHEMA,
    LAYOUT_3D_SCHEMA,
    PRESENTATION_SCHEMA
  ),
  feComposite: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, PRESENTATION_SCHEMA),
  feConvolveMatrix: has(
    CONTROL_FLOW_SCHEMA,
    LAYOUT_3D_SCHEMA,
    PRESENTATION_SCHEMA
  ),
  feDiffuseLighting: has(
    CONTROL_FLOW_SCHEMA,
    LAYOUT_3D_SCHEMA,
    PRESENTATION_SCHEMA
  ),
  feDisplacementMap: has(
    CONTROL_FLOW_SCHEMA,
    LAYOUT_3D_SCHEMA,
    PRESENTATION_SCHEMA
  ),
  feDistantLight: has(),
  feDropShadow: has(),
  feFlood: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, PRESENTATION_SCHEMA),
  feFuncA: has(),
  feFuncB: has(),
  feFuncG: has(),
  feFuncR: has(),
  feGaussianBlur: has(
    CONTROL_FLOW_SCHEMA,
    LAYOUT_3D_SCHEMA,
    PRESENTATION_SCHEMA
  ),
  feImage: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, PRESENTATION_SCHEMA),
  feMerge: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, PRESENTATION_SCHEMA),
  feMergeNode: has(),
  feMorphology: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, PRESENTATION_SCHEMA),
  feOffset: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, PRESENTATION_SCHEMA),
  fePointLight: has(),
  feSpecularLighting: has(
    CONTROL_FLOW_SCHEMA,
    LAYOUT_3D_SCHEMA,
    PRESENTATION_SCHEMA
  ),
  feTile: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, PRESENTATION_SCHEMA),
  feTurbulence: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, PRESENTATION_SCHEMA),
  fieldset: has(
    HTML_STYLE_SHORTHAND_SCHEMA,
    CONTROL_FLOW_SCHEMA,
    LAYOUT_3D_SCHEMA,
    STYLE_SCHEMA
  ),
  figcaption: has(
    HTML_STYLE_SHORTHAND_SCHEMA,
    CONTROL_FLOW_SCHEMA,
    LAYOUT_3D_SCHEMA,
    STYLE_SCHEMA
  ),
  figure: has(
    HTML_STYLE_SHORTHAND_SCHEMA,
    CONTROL_FLOW_SCHEMA,
    LAYOUT_3D_SCHEMA,
    STYLE_SCHEMA
  ),
  filter: has(LAYOUT_3D_SCHEMA, FILTER_SCHEMA),
  'font-face': has(),
  'font-face-format': has(),
  'font-face-name': has(),
  'font-face-src': has(),
  'font-face-uri': has(),
  font: has(
    HTML_STYLE_SHORTHAND_SCHEMA,
    TEXT_CONTENT_SCHEMA,
    CONTROL_FLOW_SCHEMA,
    LAYOUT_3D_SCHEMA,
    PRESENTATION_SCHEMA,
    STYLE_SCHEMA
  ),
  footer: has(
    HTML_STYLE_SHORTHAND_SCHEMA,
    TEXT_CONTENT_SCHEMA,
    CONTROL_FLOW_SCHEMA,
    LAYOUT_3D_SCHEMA,
    STYLE_SCHEMA
  ),
  foreignObject: has(
    CONTROL_FLOW_SCHEMA,
    LAYOUT_2D_SCHEMA,
    PRESENTATION_SCHEMA
  ),
  form: has(
    HTML_STYLE_SHORTHAND_SCHEMA,
    CONTROL_FLOW_SCHEMA,
    LAYOUT_3D_SCHEMA,
    STYLE_SCHEMA
  ),
  frame: has(
    HTML_STYLE_SHORTHAND_SCHEMA,
    CONTROL_FLOW_SCHEMA,
    LAYOUT_3D_SCHEMA,
    STYLE_SCHEMA
  ),
  frameset: has(
    HTML_STYLE_SHORTHAND_SCHEMA,
    CONTROL_FLOW_SCHEMA,
    LAYOUT_3D_SCHEMA,
    STYLE_SCHEMA
  ),
  g: has(CONTROL_FLOW_SCHEMA, LAYOUT_2D_SCHEMA, PRESENTATION_SCHEMA),
  glyph: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, PRESENTATION_SCHEMA),
  glyphRef: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, PRESENTATION_SCHEMA),
  h1: has(
    HTML_STYLE_SHORTHAND_SCHEMA,
    TEXT_CONTENT_SCHEMA,
    CONTROL_FLOW_SCHEMA,
    LAYOUT_3D_SCHEMA,
    STYLE_SCHEMA
  ),
  h2: has(
    HTML_STYLE_SHORTHAND_SCHEMA,
    TEXT_CONTENT_SCHEMA,
    CONTROL_FLOW_SCHEMA,
    LAYOUT_3D_SCHEMA,
    STYLE_SCHEMA
  ),
  h3: has(
    HTML_STYLE_SHORTHAND_SCHEMA,
    TEXT_CONTENT_SCHEMA,
    CONTROL_FLOW_SCHEMA,
    LAYOUT_3D_SCHEMA,
    STYLE_SCHEMA
  ),
  h4: has(
    HTML_STYLE_SHORTHAND_SCHEMA,
    TEXT_CONTENT_SCHEMA,
    CONTROL_FLOW_SCHEMA,
    LAYOUT_3D_SCHEMA,
    STYLE_SCHEMA
  ),
  h5: has(
    HTML_STYLE_SHORTHAND_SCHEMA,
    TEXT_CONTENT_SCHEMA,
    CONTROL_FLOW_SCHEMA,
    LAYOUT_3D_SCHEMA,
    STYLE_SCHEMA
  ),
  h6: has(
    HTML_STYLE_SHORTHAND_SCHEMA,
    TEXT_CONTENT_SCHEMA,
    CONTROL_FLOW_SCHEMA,
    LAYOUT_3D_SCHEMA,
    STYLE_SCHEMA
  ),
  hatch: has(),
  hatchpath: has(),
  head: has(
    HTML_STYLE_SHORTHAND_SCHEMA,
    TEXT_CONTENT_SCHEMA,
    CONTROL_FLOW_SCHEMA,
    LAYOUT_3D_SCHEMA,
    STYLE_SCHEMA
  ),
  header: has(
    HTML_STYLE_SHORTHAND_SCHEMA,
    TEXT_CONTENT_SCHEMA,
    CONTROL_FLOW_SCHEMA,
    LAYOUT_3D_SCHEMA,
    STYLE_SCHEMA
  ),
  hgroup: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  hkern: has(),
  hr: has(
    HTML_STYLE_SHORTHAND_SCHEMA,
    CONTROL_FLOW_SCHEMA,
    LAYOUT_3D_SCHEMA,
    STYLE_SCHEMA
  ),
  html: has(
    HTML_STYLE_SHORTHAND_SCHEMA,
    TEXT_CONTENT_SCHEMA,
    CONTROL_FLOW_SCHEMA,
    LAYOUT_3D_SCHEMA,
    STYLE_SCHEMA
  ),
  i: has(
    HTML_STYLE_SHORTHAND_SCHEMA,
    TEXT_CONTENT_SCHEMA,
    CONTROL_FLOW_SCHEMA,
    LAYOUT_3D_SCHEMA,
    STYLE_SCHEMA
  ),
  iframe: has(
    HTML_STYLE_SHORTHAND_SCHEMA,
    CONTROL_FLOW_SCHEMA,
    LAYOUT_3D_SCHEMA,
    STYLE_SCHEMA
  ),
  image: has(CONTROL_FLOW_SCHEMA, LAYOUT_2D_SCHEMA, PRESENTATION_SCHEMA),
  img: has(
    HTML_STYLE_SHORTHAND_SCHEMA,
    CONTROL_FLOW_SCHEMA,
    LAYOUT_3D_SCHEMA,
    STYLE_SCHEMA
  ),
  input: has(
    HTML_STYLE_SHORTHAND_SCHEMA,
    TEXT_CONTENT_SCHEMA,
    CONTROL_FLOW_SCHEMA,
    LAYOUT_3D_SCHEMA,
    STYLE_SCHEMA
  ),
  ins: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  kbd: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  keygen: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  label: has(
    HTML_STYLE_SHORTHAND_SCHEMA,
    TEXT_CONTENT_SCHEMA,
    CONTROL_FLOW_SCHEMA,
    LAYOUT_3D_SCHEMA,
    STYLE_SCHEMA
  ),
  legend: has(
    HTML_STYLE_SHORTHAND_SCHEMA,
    CONTROL_FLOW_SCHEMA,
    LAYOUT_3D_SCHEMA,
    STYLE_SCHEMA
  ),
  li: has(
    HTML_STYLE_SHORTHAND_SCHEMA,
    TEXT_CONTENT_SCHEMA,
    CONTROL_FLOW_SCHEMA,
    LAYOUT_3D_SCHEMA,
    STYLE_SCHEMA
  ),
  line: has(CONTROL_FLOW_SCHEMA, LAYOUT_2D_SCHEMA, PRESENTATION_SCHEMA),
  linearGradient: has(
    CONTROL_FLOW_SCHEMA,
    LAYOUT_3D_SCHEMA,
    PRESENTATION_SCHEMA
  ),
  link: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  map: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  mark: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  marker: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, PRESENTATION_SCHEMA),
  mask: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, PRESENTATION_SCHEMA),
  menu: has(
    HTML_STYLE_SHORTHAND_SCHEMA,
    TEXT_CONTENT_SCHEMA,
    CONTROL_FLOW_SCHEMA,
    LAYOUT_3D_SCHEMA,
    STYLE_SCHEMA
  ),
  mesh: has(CONTROL_FLOW_SCHEMA, LAYOUT_2D_SCHEMA),
  meshgradient: has(),
  meshpatch: has(),
  meshrow: has(),
  meta: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  metadata: has(),
  meter: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  mpath: has(),
  nav: has(
    HTML_STYLE_SHORTHAND_SCHEMA,
    CONTROL_FLOW_SCHEMA,
    LAYOUT_3D_SCHEMA,
    STYLE_SCHEMA
  ),
  noframes: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  noscript: has(
    HTML_STYLE_SHORTHAND_SCHEMA,
    TEXT_CONTENT_SCHEMA,
    CONTROL_FLOW_SCHEMA,
    LAYOUT_3D_SCHEMA,
    STYLE_SCHEMA
  ),
  object: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  ol: has(
    HTML_STYLE_SHORTHAND_SCHEMA,
    CONTROL_FLOW_SCHEMA,
    LAYOUT_3D_SCHEMA,
    STYLE_SCHEMA
  ),
  optgroup: has(
    HTML_STYLE_SHORTHAND_SCHEMA,
    CONTROL_FLOW_SCHEMA,
    LAYOUT_3D_SCHEMA,
    STYLE_SCHEMA
  ),
  option: has(
    HTML_STYLE_SHORTHAND_SCHEMA,
    TEXT_CONTENT_SCHEMA,
    CONTROL_FLOW_SCHEMA,
    LAYOUT_3D_SCHEMA,
    STYLE_SCHEMA
  ),
  output: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  p: has(
    HTML_STYLE_SHORTHAND_SCHEMA,
    TEXT_CONTENT_SCHEMA,
    CONTROL_FLOW_SCHEMA,
    LAYOUT_3D_SCHEMA,
    STYLE_SCHEMA
  ),
  param: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  path: has(CONTROL_FLOW_SCHEMA, LAYOUT_2D_SCHEMA, PRESENTATION_SCHEMA),
  pattern: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, PRESENTATION_SCHEMA),
  polygon: has(CONTROL_FLOW_SCHEMA, LAYOUT_2D_SCHEMA, PRESENTATION_SCHEMA),
  polyline: has(CONTROL_FLOW_SCHEMA, LAYOUT_2D_SCHEMA, PRESENTATION_SCHEMA),
  pre: has(
    HTML_STYLE_SHORTHAND_SCHEMA,
    TEXT_CONTENT_SCHEMA,
    CONTROL_FLOW_SCHEMA,
    LAYOUT_3D_SCHEMA,
    STYLE_SCHEMA
  ),
  progress: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  q: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  radialGradient: has(
    CONTROL_FLOW_SCHEMA,
    LAYOUT_3D_SCHEMA,
    PRESENTATION_SCHEMA
  ),
  rect: has(CONTROL_FLOW_SCHEMA, LAYOUT_2D_SCHEMA, PRESENTATION_SCHEMA),
  rp: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  rt: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  ruby: has(
    HTML_STYLE_SHORTHAND_SCHEMA,
    TEXT_CONTENT_SCHEMA,
    CONTROL_FLOW_SCHEMA,
    LAYOUT_3D_SCHEMA,
    STYLE_SCHEMA
  ),
  s: has(
    HTML_STYLE_SHORTHAND_SCHEMA,
    TEXT_CONTENT_SCHEMA,
    CONTROL_FLOW_SCHEMA,
    LAYOUT_3D_SCHEMA,
    STYLE_SCHEMA
  ),
  samp: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  script: has(
    HTML_STYLE_SHORTHAND_SCHEMA,
    TEXT_CONTENT_SCHEMA,
    CONTROL_FLOW_SCHEMA,
    LAYOUT_3D_SCHEMA,
    STYLE_SCHEMA
  ),
  section: has(
    HTML_STYLE_SHORTHAND_SCHEMA,
    TEXT_CONTENT_SCHEMA,
    CONTROL_FLOW_SCHEMA,
    LAYOUT_3D_SCHEMA,
    STYLE_SCHEMA
  ),
  select: has(
    HTML_STYLE_SHORTHAND_SCHEMA,
    CONTROL_FLOW_SCHEMA,
    LAYOUT_3D_SCHEMA,
    STYLE_SCHEMA
  ),
  set: has(),
  small: has(
    HTML_STYLE_SHORTHAND_SCHEMA,
    TEXT_CONTENT_SCHEMA,
    CONTROL_FLOW_SCHEMA,
    LAYOUT_3D_SCHEMA,
    STYLE_SCHEMA
  ),
  solidcolor: has(),
  source: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  span: has(
    HTML_STYLE_SHORTHAND_SCHEMA,
    TEXT_CONTENT_SCHEMA,
    CONTROL_FLOW_SCHEMA,
    LAYOUT_3D_SCHEMA,
    STYLE_SCHEMA
  ),
  stop: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, PRESENTATION_SCHEMA),
  strike: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  strong: has(
    HTML_STYLE_SHORTHAND_SCHEMA,
    TEXT_CONTENT_SCHEMA,
    CONTROL_FLOW_SCHEMA,
    LAYOUT_3D_SCHEMA,
    STYLE_SCHEMA
  ),
  style: has(
    HTML_STYLE_SHORTHAND_SCHEMA,
    TEXT_CONTENT_SCHEMA,
    CONTROL_FLOW_SCHEMA,
    LAYOUT_3D_SCHEMA,
    STYLE_SCHEMA
  ),
  sub: has(
    HTML_STYLE_SHORTHAND_SCHEMA,
    CONTROL_FLOW_SCHEMA,
    LAYOUT_3D_SCHEMA,
    STYLE_SCHEMA
  ),
  summary: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  sup: has(
    HTML_STYLE_SHORTHAND_SCHEMA,
    TEXT_CONTENT_SCHEMA,
    CONTROL_FLOW_SCHEMA,
    LAYOUT_3D_SCHEMA,
    STYLE_SCHEMA
  ),
  svg: has(
    CONTROL_FLOW_SCHEMA,
    LAYOUT_2D_SCHEMA,
    PRESENTATION_SCHEMA,
    STYLE_SCHEMA
  ),
  switch: has(CONTROL_FLOW_SCHEMA, LAYOUT_2D_SCHEMA, PRESENTATION_SCHEMA),
  symbol: has(CONTROL_FLOW_SCHEMA, LAYOUT_2D_SCHEMA, PRESENTATION_SCHEMA),
  table: has(
    HTML_STYLE_SHORTHAND_SCHEMA,
    CONTROL_FLOW_SCHEMA,
    LAYOUT_3D_SCHEMA,
    STYLE_SCHEMA
  ),
  tbody: has(
    HTML_STYLE_SHORTHAND_SCHEMA,
    CONTROL_FLOW_SCHEMA,
    LAYOUT_3D_SCHEMA,
    STYLE_SCHEMA
  ),
  td: has(
    HTML_STYLE_SHORTHAND_SCHEMA,
    TEXT_CONTENT_SCHEMA,
    CONTROL_FLOW_SCHEMA,
    LAYOUT_3D_SCHEMA,
    STYLE_SCHEMA
  ),
  text: has(
    HTML_STYLE_SHORTHAND_SCHEMA,
    TEXT_CONTENT_SCHEMA,
    CONTROL_FLOW_SCHEMA,
    LAYOUT_2D_SCHEMA,
    PRESENTATION_SCHEMA
  ),
  textarea: has(
    HTML_STYLE_SHORTHAND_SCHEMA,
    TEXT_CONTENT_SCHEMA,
    CONTROL_FLOW_SCHEMA,
    LAYOUT_3D_SCHEMA,
    STYLE_SCHEMA
  ),
  textPath: has(
    HTML_STYLE_SHORTHAND_SCHEMA,
    TEXT_CONTENT_SCHEMA,
    CONTROL_FLOW_SCHEMA,
    LAYOUT_2D_SCHEMA,
    PRESENTATION_SCHEMA
  ),
  tfoot: has(
    HTML_STYLE_SHORTHAND_SCHEMA,
    CONTROL_FLOW_SCHEMA,
    LAYOUT_3D_SCHEMA,
    STYLE_SCHEMA
  ),
  th: has(
    HTML_STYLE_SHORTHAND_SCHEMA,
    CONTROL_FLOW_SCHEMA,
    LAYOUT_3D_SCHEMA,
    STYLE_SCHEMA
  ),
  thead: has(
    HTML_STYLE_SHORTHAND_SCHEMA,
    CONTROL_FLOW_SCHEMA,
    LAYOUT_3D_SCHEMA,
    STYLE_SCHEMA
  ),
  time: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  title: has(
    HTML_STYLE_SHORTHAND_SCHEMA,
    TEXT_CONTENT_SCHEMA,
    CONTROL_FLOW_SCHEMA,
    LAYOUT_3D_SCHEMA,
    STYLE_SCHEMA
  ),
  tr: has(
    HTML_STYLE_SHORTHAND_SCHEMA,
    CONTROL_FLOW_SCHEMA,
    LAYOUT_3D_SCHEMA,
    STYLE_SCHEMA
  ),
  track: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  tref: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, PRESENTATION_SCHEMA),
  tspan: has(
    HTML_STYLE_SHORTHAND_SCHEMA,
    CONTROL_FLOW_SCHEMA,
    LAYOUT_2D_SCHEMA,
    PRESENTATION_SCHEMA
  ),
  tt: has(
    HTML_STYLE_SHORTHAND_SCHEMA,
    CONTROL_FLOW_SCHEMA,
    LAYOUT_3D_SCHEMA,
    STYLE_SCHEMA
  ),
  u: has(
    HTML_STYLE_SHORTHAND_SCHEMA,
    TEXT_CONTENT_SCHEMA,
    CONTROL_FLOW_SCHEMA,
    LAYOUT_3D_SCHEMA,
    STYLE_SCHEMA
  ),
  ul: has(
    HTML_STYLE_SHORTHAND_SCHEMA,
    CONTROL_FLOW_SCHEMA,
    LAYOUT_3D_SCHEMA,
    STYLE_SCHEMA
  ),
  unknown: has(CONTROL_FLOW_SCHEMA, LAYOUT_2D_SCHEMA),
  us: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, PRESENTATION_SCHEMA),
  use: has(CONTROL_FLOW_SCHEMA, LAYOUT_2D_SCHEMA),
  var: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  video: has(
    HTML_STYLE_SHORTHAND_SCHEMA,
    CONTROL_FLOW_SCHEMA,
    LAYOUT_3D_SCHEMA,
    STYLE_SCHEMA
  ),
  view: has(),
  vker: has(),
  wb: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA)
}
