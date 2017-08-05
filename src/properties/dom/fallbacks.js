/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

var Layout3D = require('./../../Layout3D')

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
  content: null
}

var LAYOUT_DEFAULTS = Layout3D.createLayoutSpec()

var LAYOUT_3D_SCHEMA = {
  shown: LAYOUT_DEFAULTS.shown,
  opacity: LAYOUT_DEFAULTS.opacity,
  'mount.x': LAYOUT_DEFAULTS.mount.x,
  'mount.y': LAYOUT_DEFAULTS.mount.y,
  'mount.z': LAYOUT_DEFAULTS.mount.z,
  'align.x': LAYOUT_DEFAULTS.align.x,
  'align.y': LAYOUT_DEFAULTS.align.y,
  'align.z': LAYOUT_DEFAULTS.align.z,
  'origin.x': LAYOUT_DEFAULTS.origin.x,
  'origin.y': LAYOUT_DEFAULTS.origin.y,
  'origin.z': LAYOUT_DEFAULTS.origin.z,
  'translation.x': LAYOUT_DEFAULTS.translation.x,
  'translation.y': LAYOUT_DEFAULTS.translation.y,
  'translation.z': LAYOUT_DEFAULTS.translation.z,
  'rotation.x': LAYOUT_DEFAULTS.rotation.x,
  'rotation.y': LAYOUT_DEFAULTS.rotation.y,
  'rotation.z': LAYOUT_DEFAULTS.rotation.z,
  'scale.x': LAYOUT_DEFAULTS.scale.x,
  'scale.y': LAYOUT_DEFAULTS.scale.y,
  'scale.z': LAYOUT_DEFAULTS.scale.z,
  'sizeAbsolute.x': LAYOUT_DEFAULTS.sizeAbsolute.x,
  'sizeAbsolute.y': LAYOUT_DEFAULTS.sizeAbsolute.y,
  'sizeAbsolute.z': LAYOUT_DEFAULTS.sizeAbsolute.z,
  'sizeProportional.x': LAYOUT_DEFAULTS.sizeProportional.x,
  'sizeProportional.y': LAYOUT_DEFAULTS.sizeProportional.y,
  'sizeProportional.z': LAYOUT_DEFAULTS.sizeProportional.z,
  'sizeDifferential.x': LAYOUT_DEFAULTS.sizeDifferential.x,
  'sizeDifferential.y': LAYOUT_DEFAULTS.sizeDifferential.y,
  'sizeDifferential.z': LAYOUT_DEFAULTS.sizeDifferential.z,
  'sizeMode.x': LAYOUT_DEFAULTS.sizeMode.x,
  'sizeMode.y': LAYOUT_DEFAULTS.sizeMode.y,
  'sizeMode.z': LAYOUT_DEFAULTS.sizeMode.z
}

var LAYOUT_2D_SCHEMA = {
  shown: LAYOUT_DEFAULTS.shown,
  opacity: LAYOUT_DEFAULTS.opacity,
  'mount.x': LAYOUT_DEFAULTS.mount.x,
  'mount.y': LAYOUT_DEFAULTS.mount.y,
  'align.x': LAYOUT_DEFAULTS.align.x,
  'align.y': LAYOUT_DEFAULTS.align.y,
  'origin.x': LAYOUT_DEFAULTS.origin.x,
  'origin.y': LAYOUT_DEFAULTS.origin.y,
  'translation.x': LAYOUT_DEFAULTS.translation.x,
  'translation.y': LAYOUT_DEFAULTS.translation.y,
  'translation.z': LAYOUT_DEFAULTS.translation.z,
  'rotation.x': LAYOUT_DEFAULTS.rotation.x,
  'rotation.y': LAYOUT_DEFAULTS.rotation.y,
  'rotation.z': LAYOUT_DEFAULTS.rotation.z,
  'scale.x': LAYOUT_DEFAULTS.scale.x,
  'scale.y': LAYOUT_DEFAULTS.scale.y,
  'sizeAbsolute.x': LAYOUT_DEFAULTS.sizeAbsolute.x,
  'sizeAbsolute.y': LAYOUT_DEFAULTS.sizeAbsolute.y,
  'sizeProportional.x': LAYOUT_DEFAULTS.sizeProportional.x,
  'sizeProportional.y': LAYOUT_DEFAULTS.sizeProportional.y,
  'sizeDifferential.x': LAYOUT_DEFAULTS.sizeDifferential.x,
  'sizeDifferential.y': LAYOUT_DEFAULTS.sizeDifferential.y,
  'sizeMode.x': LAYOUT_DEFAULTS.sizeMode.x,
  'sizeMode.y': LAYOUT_DEFAULTS.sizeMode.y
}

var PRESENTATION_SCHEMA = {
  alignmentBaseline: '',
  baselineShift: '',
  clipPath: '',
  clipRule: '',
  clip: '',
  colorInterpolationFilters: '',
  colorInterpolation: '',
  colorProfile: '',
  colorRendering: '',
  color: '',
  cursor: '',
  direction: '',
  display: '',
  dominantBaseline: '',
  enableBackground: '',
  fillOpacity: '',
  fillRule: '',
  fill: '',
  filter: '',
  floodColor: '',
  floodOpacity: '',
  fontFamily: '',
  fontSizeAdjust: '',
  fontSize: '',
  fontStretch: '',
  fontStyle: '',
  fontVariant: '',
  fontWeight: '',
  glyphOrientationHorizontal: '',
  glyphOrientationVertical: '',
  imageRendering: '',
  kerning: '',
  letterSpacing: '',
  lightingColor: '',
  markerEnd: '',
  markerMid: '',
  markerStart: '',
  mask: '',
  // opacity omitted - is part of layout algorithm
  overflow: '',
  overflowX: '',
  overflowY: '',
  pointerEvents: '',
  shapeRendering: '',
  stopColor: '',
  stopOpacity: '',
  strokeDasharray: '',
  strokeDashoffset: '',
  strokeLinecap: '',
  strokeLinejoin: '',
  strokeMiterlimit: '',
  strokeOpacity: '',
  strokeWidth: '',
  stroke: '',
  textAnchor: '',
  textDecoration: '',
  textRendering: '',
  unicodeBidi: '',
  visibility: '',
  wordSpacing: '',
  writingMode: ''
}

var STYLE_SCHEMA = {
  'style.alignmentBaseline': '',
  'style.background': '',
  'style.backgroundAttachment': '',
  'style.backgroundColor': '',
  'style.backgroundImage': '',
  'style.backgroundPosition': '',
  'style.backgroundRepeat': '',
  'style.baselineShift': '',
  'style.border': '',
  'style.borderBottom': '',
  'style.borderBottomColor': '',
  'style.borderBottomStyle': '',
  'style.borderBottomWidth': '',
  'style.borderColor': '',
  'style.borderLeft': '',
  'style.borderLeftColor': '',
  'style.borderLeftStyle': '',
  'style.borderLeftWidth': '',
  'style.borderRight': '',
  'style.borderRightColor': '',
  'style.borderRightStyle': '',
  'style.borderRightWidth': '',
  'style.borderStyle': '',
  'style.borderTop': '',
  'style.borderTopColor': '',
  'style.borderTopStyle': '',
  'style.borderTopWidth': '',
  'style.borderWidth': '',
  'style.clear': '',
  'style.clip': '',
  'style.clipPath': '',
  'style.clipRule': '',
  'style.color': '',
  'style.colorInterpolation': '',
  'style.colorInterpolationFilters': '',
  'style.colorProfile': '',
  'style.colorRendering': '',
  'style.cssFloat': '',
  'style.cursor': '',
  'style.direction': '',
  'style.display': '',
  'style.dominantBaseline': '',
  'style.enableBackground': '',
  'style.fill': '',
  'style.fillOpacity': '',
  'style.fillRule': '',
  'style.filter': '',
  'style.floodColor': '',
  'style.floodOpacity': '',
  'style.font': '',
  'style.fontFamily': '',
  'style.fontSize': '',
  'style.fontSizeAdjust': '',
  'style.fontStretch': '',
  'style.fontStyle': '',
  'style.fontVariant': '',
  'style.fontWeight': '',
  'style.glyphOrientationHorizontal': '',
  'style.glyphOrientationVertical': '',
  'style.height': '',
  'style.imageRendering': '',
  'style.kerning': '',
  'style.left': '',
  'style.letterSpacing': '',
  'style.lightingColor': '',
  'style.lineHeight': '',
  'style.listStyle': '',
  'style.listStyleImage': '',
  'style.listStylePosition': '',
  'style.listStyleType': '',
  'style.margin': '',
  'style.marginBottom': '',
  'style.marginLeft': '',
  'style.marginRight': '',
  'style.marginTop': '',
  'style.markerEnd': '',
  'style.markerMid': '',
  'style.markerStart': '',
  'style.mask': '',
  'style.opacity': '',
  'style.overflow': '',
  'style.overflowX': 'hidden',
  'style.overflowY': 'hidden',
  'style.padding': '',
  'style.paddingBottom': '',
  'style.paddingLeft': '',
  'style.paddingRight': '',
  'style.paddingTop': '',
  'style.pageBreakAfter': '',
  'style.pageBreakBefore': '',
  'style.pointerEvents': '',
  'style.position': '',
  'style.shapeRendering': '',
  'style.stopColor': '',
  'style.stopOpacity': '',
  'style.stroke': '',
  'style.strokeDasharray': '',
  'style.strokeDashoffset': '',
  'style.strokeLinecap': '',
  'style.strokeLinejoin': '',
  'style.strokeMiterlimit': '',
  'style.strokeOpacity': '',
  'style.strokeWidth': '',
  'style.textAlign': '',
  'style.textAnchor': '',
  'style.textDecoration': '',
  'style.textDecorationBlink': '',
  'style.textDecorationLineThrough': '',
  'style.textDecorationNone': '',
  'style.textDecorationOverline': '',
  'style.textDecorationUnderline': '',
  'style.textIndent': '',
  'style.textRendering': '',
  'style.textTransform': '',
  'style.top': '',
  'style.unicodeBidi': '',
  'style.verticalAlign': '',
  'style.visibility': '',
  'style.width': '',
  'style.wordSpacing': '',
  'style.writingMode': '',
  'style.zIndex': 1,
  'style.WebkitTapHighlightColor': 'rgba(0,0,0,0)'
}

var FILTER_SCHEMA = {
  'x': '',
  'y': '',
  'width': '',
  'height': '',
  'filterRes': '',
  'filterUnits': '',
  'primitiveUnits': ''
}

var HTML_STYLE_SHORTHAND_SCHEMA = {
  backgroundColor: ''
}

var CONTROL_FLOW_SCHEMA = {
  // 'controlFlow.if': null,
  // 'controlFlow.repeat': null,
  // 'controlFlow.yield': null,
  'controlFlow.insert': null,
  'controlFlow.placeholder': null
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
