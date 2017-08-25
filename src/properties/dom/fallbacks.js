/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

var Layout3D = require('./../../Layout3D')
var has = require('./has')

var TEXT_CONTENT_FALLBACKS = {
  content: null
}

var LAYOUT_DEFAULTS = Layout3D.createLayoutSpec()

var LAYOUT_3D_FALLBACKS = {
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

var LAYOUT_2D_FALLBACKS = {
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

var PRESENTATION_FALLBACKS = {
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

var STYLE_FALLBACKS = {
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

var FILTER_FALLBACKS = {
  'x': '',
  'y': '',
  'width': '',
  'height': '',
  'filterRes': '',
  'filterUnits': '',
  'primitiveUnits': ''
}

var HTML_STYLE_SHORTHAND_FALLBACKS = {
  backgroundColor: ''
}

var CONTROL_FLOW_FALLBACKS = {
  // 'controlFlow.if': null,
  'controlFlow.repeat': null,
  // 'controlFlow.yield': null,
  'controlFlow.placeholder': null
}

module.exports = {
  'missing-glyph': has(
    CONTROL_FLOW_FALLBACKS,
    LAYOUT_3D_FALLBACKS,
    PRESENTATION_FALLBACKS
  ),
  a: has(
    HTML_STYLE_SHORTHAND_FALLBACKS,
    TEXT_CONTENT_FALLBACKS,
    CONTROL_FLOW_FALLBACKS,
    LAYOUT_3D_FALLBACKS,
    PRESENTATION_FALLBACKS,
    STYLE_FALLBACKS
  ),
  abbr: has(
    HTML_STYLE_SHORTHAND_FALLBACKS,
    TEXT_CONTENT_FALLBACKS,
    CONTROL_FLOW_FALLBACKS,
    LAYOUT_3D_FALLBACKS,
    STYLE_FALLBACKS
  ),
  acronym: has(
    HTML_STYLE_SHORTHAND_FALLBACKS,
    TEXT_CONTENT_FALLBACKS,
    CONTROL_FLOW_FALLBACKS,
    LAYOUT_3D_FALLBACKS,
    STYLE_FALLBACKS
  ),
  address: has(CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
  altGlyph: has(CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, PRESENTATION_FALLBACKS),
  altGlyphDef: has(),
  altGlyphItem: has(),
  animate: has(CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, PRESENTATION_FALLBACKS),
  animateColor: has(CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, PRESENTATION_FALLBACKS),
  animateMotion: has(),
  animateTransform: has(),
  applet: has(CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
  area: has(CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
  article: has(
    HTML_STYLE_SHORTHAND_FALLBACKS,
    TEXT_CONTENT_FALLBACKS,
    CONTROL_FLOW_FALLBACKS,
    LAYOUT_3D_FALLBACKS,
    STYLE_FALLBACKS
  ),
  aside: has(
    HTML_STYLE_SHORTHAND_FALLBACKS,
    TEXT_CONTENT_FALLBACKS,
    CONTROL_FLOW_FALLBACKS,
    LAYOUT_3D_FALLBACKS,
    STYLE_FALLBACKS
  ),
  audio: has(
    HTML_STYLE_SHORTHAND_FALLBACKS,
    CONTROL_FLOW_FALLBACKS,
    LAYOUT_3D_FALLBACKS,
    STYLE_FALLBACKS
  ),
  b: has(
    HTML_STYLE_SHORTHAND_FALLBACKS,
    TEXT_CONTENT_FALLBACKS,
    CONTROL_FLOW_FALLBACKS,
    LAYOUT_3D_FALLBACKS,
    STYLE_FALLBACKS
  ),
  base: has(CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
  basefont: has(CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
  bdi: has(CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
  bdo: has(CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
  big: has(CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
  blockquote: has(
    HTML_STYLE_SHORTHAND_FALLBACKS,
    TEXT_CONTENT_FALLBACKS,
    CONTROL_FLOW_FALLBACKS,
    LAYOUT_3D_FALLBACKS,
    STYLE_FALLBACKS
  ),
  body: has(
    HTML_STYLE_SHORTHAND_FALLBACKS,
    CONTROL_FLOW_FALLBACKS,
    LAYOUT_3D_FALLBACKS,
    STYLE_FALLBACKS
  ),
  br: has(
    HTML_STYLE_SHORTHAND_FALLBACKS,
    CONTROL_FLOW_FALLBACKS,
    LAYOUT_3D_FALLBACKS,
    STYLE_FALLBACKS
  ),
  button: has(
    HTML_STYLE_SHORTHAND_FALLBACKS,
    TEXT_CONTENT_FALLBACKS,
    CONTROL_FLOW_FALLBACKS,
    LAYOUT_3D_FALLBACKS,
    STYLE_FALLBACKS
  ),
  canvas: has(
    HTML_STYLE_SHORTHAND_FALLBACKS,
    CONTROL_FLOW_FALLBACKS,
    LAYOUT_3D_FALLBACKS,
    STYLE_FALLBACKS
  ),
  caption: has(
    HTML_STYLE_SHORTHAND_FALLBACKS,
    TEXT_CONTENT_FALLBACKS,
    CONTROL_FLOW_FALLBACKS,
    LAYOUT_3D_FALLBACKS,
    STYLE_FALLBACKS
  ),
  center: has(
    HTML_STYLE_SHORTHAND_FALLBACKS,
    TEXT_CONTENT_FALLBACKS,
    CONTROL_FLOW_FALLBACKS,
    LAYOUT_3D_FALLBACKS,
    STYLE_FALLBACKS
  ),
  circle: has(CONTROL_FLOW_FALLBACKS, LAYOUT_2D_FALLBACKS, PRESENTATION_FALLBACKS),
  cite: has(
    HTML_STYLE_SHORTHAND_FALLBACKS,
    TEXT_CONTENT_FALLBACKS,
    CONTROL_FLOW_FALLBACKS,
    LAYOUT_3D_FALLBACKS,
    STYLE_FALLBACKS
  ),
  clipPath: has(CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, PRESENTATION_FALLBACKS),
  code: has(
    HTML_STYLE_SHORTHAND_FALLBACKS,
    TEXT_CONTENT_FALLBACKS,
    CONTROL_FLOW_FALLBACKS,
    LAYOUT_3D_FALLBACKS,
    STYLE_FALLBACKS
  ),
  col: has(
    HTML_STYLE_SHORTHAND_FALLBACKS,
    CONTROL_FLOW_FALLBACKS,
    LAYOUT_3D_FALLBACKS,
    STYLE_FALLBACKS
  ),
  colgroup: has(
    HTML_STYLE_SHORTHAND_FALLBACKS,
    CONTROL_FLOW_FALLBACKS,
    LAYOUT_3D_FALLBACKS,
    STYLE_FALLBACKS
  ),
  'color-profile': has(),
  command: has(CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
  cursor: has(),
  datalist: has(CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
  dd: has(
    HTML_STYLE_SHORTHAND_FALLBACKS,
    TEXT_CONTENT_FALLBACKS,
    CONTROL_FLOW_FALLBACKS,
    LAYOUT_3D_FALLBACKS,
    STYLE_FALLBACKS
  ),
  defs: has(CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, PRESENTATION_FALLBACKS),
  del: has(CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
  desc: has(),
  details: has(CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
  dfn: has(CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
  dir: has(CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
  discard: has(),
  div: has(
    HTML_STYLE_SHORTHAND_FALLBACKS,
    TEXT_CONTENT_FALLBACKS,
    CONTROL_FLOW_FALLBACKS,
    LAYOUT_3D_FALLBACKS,
    STYLE_FALLBACKS
  ),
  dl: has(
    HTML_STYLE_SHORTHAND_FALLBACKS,
    TEXT_CONTENT_FALLBACKS,
    CONTROL_FLOW_FALLBACKS,
    LAYOUT_3D_FALLBACKS,
    STYLE_FALLBACKS
  ),
  dt: has(
    HTML_STYLE_SHORTHAND_FALLBACKS,
    TEXT_CONTENT_FALLBACKS,
    CONTROL_FLOW_FALLBACKS,
    LAYOUT_3D_FALLBACKS,
    STYLE_FALLBACKS
  ),
  ellipse: has(CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, PRESENTATION_FALLBACKS),
  em: has(
    HTML_STYLE_SHORTHAND_FALLBACKS,
    TEXT_CONTENT_FALLBACKS,
    CONTROL_FLOW_FALLBACKS,
    LAYOUT_3D_FALLBACKS,
    STYLE_FALLBACKS
  ),
  embed: has(
    HTML_STYLE_SHORTHAND_FALLBACKS,
    CONTROL_FLOW_FALLBACKS,
    LAYOUT_3D_FALLBACKS,
    STYLE_FALLBACKS
  ),
  feBlend: has(CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, PRESENTATION_FALLBACKS),
  feColorMatrix: has(
    CONTROL_FLOW_FALLBACKS,
    LAYOUT_3D_FALLBACKS,
    PRESENTATION_FALLBACKS
  ),
  feComponentTransfer: has(
    CONTROL_FLOW_FALLBACKS,
    LAYOUT_3D_FALLBACKS,
    PRESENTATION_FALLBACKS
  ),
  feComposite: has(CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, PRESENTATION_FALLBACKS),
  feConvolveMatrix: has(
    CONTROL_FLOW_FALLBACKS,
    LAYOUT_3D_FALLBACKS,
    PRESENTATION_FALLBACKS
  ),
  feDiffuseLighting: has(
    CONTROL_FLOW_FALLBACKS,
    LAYOUT_3D_FALLBACKS,
    PRESENTATION_FALLBACKS
  ),
  feDisplacementMap: has(
    CONTROL_FLOW_FALLBACKS,
    LAYOUT_3D_FALLBACKS,
    PRESENTATION_FALLBACKS
  ),
  feDistantLight: has(),
  feDropShadow: has(),
  feFlood: has(CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, PRESENTATION_FALLBACKS),
  feFuncA: has(),
  feFuncB: has(),
  feFuncG: has(),
  feFuncR: has(),
  feGaussianBlur: has(
    CONTROL_FLOW_FALLBACKS,
    LAYOUT_3D_FALLBACKS,
    PRESENTATION_FALLBACKS
  ),
  feImage: has(CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, PRESENTATION_FALLBACKS),
  feMerge: has(CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, PRESENTATION_FALLBACKS),
  feMergeNode: has(),
  feMorphology: has(CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, PRESENTATION_FALLBACKS),
  feOffset: has(CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, PRESENTATION_FALLBACKS),
  fePointLight: has(),
  feSpecularLighting: has(
    CONTROL_FLOW_FALLBACKS,
    LAYOUT_3D_FALLBACKS,
    PRESENTATION_FALLBACKS
  ),
  feTile: has(CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, PRESENTATION_FALLBACKS),
  feTurbulence: has(CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, PRESENTATION_FALLBACKS),
  fieldset: has(
    HTML_STYLE_SHORTHAND_FALLBACKS,
    CONTROL_FLOW_FALLBACKS,
    LAYOUT_3D_FALLBACKS,
    STYLE_FALLBACKS
  ),
  figcaption: has(
    HTML_STYLE_SHORTHAND_FALLBACKS,
    CONTROL_FLOW_FALLBACKS,
    LAYOUT_3D_FALLBACKS,
    STYLE_FALLBACKS
  ),
  figure: has(
    HTML_STYLE_SHORTHAND_FALLBACKS,
    CONTROL_FLOW_FALLBACKS,
    LAYOUT_3D_FALLBACKS,
    STYLE_FALLBACKS
  ),
  filter: has(LAYOUT_3D_FALLBACKS, FILTER_FALLBACKS),
  'font-face': has(),
  'font-face-format': has(),
  'font-face-name': has(),
  'font-face-src': has(),
  'font-face-uri': has(),
  font: has(
    HTML_STYLE_SHORTHAND_FALLBACKS,
    TEXT_CONTENT_FALLBACKS,
    CONTROL_FLOW_FALLBACKS,
    LAYOUT_3D_FALLBACKS,
    PRESENTATION_FALLBACKS,
    STYLE_FALLBACKS
  ),
  footer: has(
    HTML_STYLE_SHORTHAND_FALLBACKS,
    TEXT_CONTENT_FALLBACKS,
    CONTROL_FLOW_FALLBACKS,
    LAYOUT_3D_FALLBACKS,
    STYLE_FALLBACKS
  ),
  foreignObject: has(
    CONTROL_FLOW_FALLBACKS,
    LAYOUT_2D_FALLBACKS,
    PRESENTATION_FALLBACKS
  ),
  form: has(
    HTML_STYLE_SHORTHAND_FALLBACKS,
    CONTROL_FLOW_FALLBACKS,
    LAYOUT_3D_FALLBACKS,
    STYLE_FALLBACKS
  ),
  frame: has(
    HTML_STYLE_SHORTHAND_FALLBACKS,
    CONTROL_FLOW_FALLBACKS,
    LAYOUT_3D_FALLBACKS,
    STYLE_FALLBACKS
  ),
  frameset: has(
    HTML_STYLE_SHORTHAND_FALLBACKS,
    CONTROL_FLOW_FALLBACKS,
    LAYOUT_3D_FALLBACKS,
    STYLE_FALLBACKS
  ),
  g: has(CONTROL_FLOW_FALLBACKS, LAYOUT_2D_FALLBACKS, PRESENTATION_FALLBACKS),
  glyph: has(CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, PRESENTATION_FALLBACKS),
  glyphRef: has(CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, PRESENTATION_FALLBACKS),
  h1: has(
    HTML_STYLE_SHORTHAND_FALLBACKS,
    TEXT_CONTENT_FALLBACKS,
    CONTROL_FLOW_FALLBACKS,
    LAYOUT_3D_FALLBACKS,
    STYLE_FALLBACKS
  ),
  h2: has(
    HTML_STYLE_SHORTHAND_FALLBACKS,
    TEXT_CONTENT_FALLBACKS,
    CONTROL_FLOW_FALLBACKS,
    LAYOUT_3D_FALLBACKS,
    STYLE_FALLBACKS
  ),
  h3: has(
    HTML_STYLE_SHORTHAND_FALLBACKS,
    TEXT_CONTENT_FALLBACKS,
    CONTROL_FLOW_FALLBACKS,
    LAYOUT_3D_FALLBACKS,
    STYLE_FALLBACKS
  ),
  h4: has(
    HTML_STYLE_SHORTHAND_FALLBACKS,
    TEXT_CONTENT_FALLBACKS,
    CONTROL_FLOW_FALLBACKS,
    LAYOUT_3D_FALLBACKS,
    STYLE_FALLBACKS
  ),
  h5: has(
    HTML_STYLE_SHORTHAND_FALLBACKS,
    TEXT_CONTENT_FALLBACKS,
    CONTROL_FLOW_FALLBACKS,
    LAYOUT_3D_FALLBACKS,
    STYLE_FALLBACKS
  ),
  h6: has(
    HTML_STYLE_SHORTHAND_FALLBACKS,
    TEXT_CONTENT_FALLBACKS,
    CONTROL_FLOW_FALLBACKS,
    LAYOUT_3D_FALLBACKS,
    STYLE_FALLBACKS
  ),
  hatch: has(),
  hatchpath: has(),
  head: has(
    HTML_STYLE_SHORTHAND_FALLBACKS,
    TEXT_CONTENT_FALLBACKS,
    CONTROL_FLOW_FALLBACKS,
    LAYOUT_3D_FALLBACKS,
    STYLE_FALLBACKS
  ),
  header: has(
    HTML_STYLE_SHORTHAND_FALLBACKS,
    TEXT_CONTENT_FALLBACKS,
    CONTROL_FLOW_FALLBACKS,
    LAYOUT_3D_FALLBACKS,
    STYLE_FALLBACKS
  ),
  hgroup: has(CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
  hkern: has(),
  hr: has(
    HTML_STYLE_SHORTHAND_FALLBACKS,
    CONTROL_FLOW_FALLBACKS,
    LAYOUT_3D_FALLBACKS,
    STYLE_FALLBACKS
  ),
  html: has(
    HTML_STYLE_SHORTHAND_FALLBACKS,
    TEXT_CONTENT_FALLBACKS,
    CONTROL_FLOW_FALLBACKS,
    LAYOUT_3D_FALLBACKS,
    STYLE_FALLBACKS
  ),
  i: has(
    HTML_STYLE_SHORTHAND_FALLBACKS,
    TEXT_CONTENT_FALLBACKS,
    CONTROL_FLOW_FALLBACKS,
    LAYOUT_3D_FALLBACKS,
    STYLE_FALLBACKS
  ),
  iframe: has(
    HTML_STYLE_SHORTHAND_FALLBACKS,
    CONTROL_FLOW_FALLBACKS,
    LAYOUT_3D_FALLBACKS,
    STYLE_FALLBACKS
  ),
  image: has(CONTROL_FLOW_FALLBACKS, LAYOUT_2D_FALLBACKS, PRESENTATION_FALLBACKS),
  img: has(
    HTML_STYLE_SHORTHAND_FALLBACKS,
    CONTROL_FLOW_FALLBACKS,
    LAYOUT_3D_FALLBACKS,
    STYLE_FALLBACKS
  ),
  input: has(
    HTML_STYLE_SHORTHAND_FALLBACKS,
    TEXT_CONTENT_FALLBACKS,
    CONTROL_FLOW_FALLBACKS,
    LAYOUT_3D_FALLBACKS,
    STYLE_FALLBACKS
  ),
  ins: has(CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
  kbd: has(CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
  keygen: has(CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
  label: has(
    HTML_STYLE_SHORTHAND_FALLBACKS,
    TEXT_CONTENT_FALLBACKS,
    CONTROL_FLOW_FALLBACKS,
    LAYOUT_3D_FALLBACKS,
    STYLE_FALLBACKS
  ),
  legend: has(
    HTML_STYLE_SHORTHAND_FALLBACKS,
    CONTROL_FLOW_FALLBACKS,
    LAYOUT_3D_FALLBACKS,
    STYLE_FALLBACKS
  ),
  li: has(
    HTML_STYLE_SHORTHAND_FALLBACKS,
    TEXT_CONTENT_FALLBACKS,
    CONTROL_FLOW_FALLBACKS,
    LAYOUT_3D_FALLBACKS,
    STYLE_FALLBACKS
  ),
  line: has(CONTROL_FLOW_FALLBACKS, LAYOUT_2D_FALLBACKS, PRESENTATION_FALLBACKS),
  linearGradient: has(
    CONTROL_FLOW_FALLBACKS,
    LAYOUT_3D_FALLBACKS,
    PRESENTATION_FALLBACKS
  ),
  link: has(CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
  map: has(CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
  mark: has(CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
  marker: has(CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, PRESENTATION_FALLBACKS),
  mask: has(CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, PRESENTATION_FALLBACKS),
  menu: has(
    HTML_STYLE_SHORTHAND_FALLBACKS,
    TEXT_CONTENT_FALLBACKS,
    CONTROL_FLOW_FALLBACKS,
    LAYOUT_3D_FALLBACKS,
    STYLE_FALLBACKS
  ),
  mesh: has(CONTROL_FLOW_FALLBACKS, LAYOUT_2D_FALLBACKS),
  meshgradient: has(),
  meshpatch: has(),
  meshrow: has(),
  meta: has(CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
  metadata: has(),
  meter: has(CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
  mpath: has(),
  nav: has(
    HTML_STYLE_SHORTHAND_FALLBACKS,
    CONTROL_FLOW_FALLBACKS,
    LAYOUT_3D_FALLBACKS,
    STYLE_FALLBACKS
  ),
  noframes: has(CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
  noscript: has(
    HTML_STYLE_SHORTHAND_FALLBACKS,
    TEXT_CONTENT_FALLBACKS,
    CONTROL_FLOW_FALLBACKS,
    LAYOUT_3D_FALLBACKS,
    STYLE_FALLBACKS
  ),
  object: has(CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
  ol: has(
    HTML_STYLE_SHORTHAND_FALLBACKS,
    CONTROL_FLOW_FALLBACKS,
    LAYOUT_3D_FALLBACKS,
    STYLE_FALLBACKS
  ),
  optgroup: has(
    HTML_STYLE_SHORTHAND_FALLBACKS,
    CONTROL_FLOW_FALLBACKS,
    LAYOUT_3D_FALLBACKS,
    STYLE_FALLBACKS
  ),
  option: has(
    HTML_STYLE_SHORTHAND_FALLBACKS,
    TEXT_CONTENT_FALLBACKS,
    CONTROL_FLOW_FALLBACKS,
    LAYOUT_3D_FALLBACKS,
    STYLE_FALLBACKS
  ),
  output: has(CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
  p: has(
    HTML_STYLE_SHORTHAND_FALLBACKS,
    TEXT_CONTENT_FALLBACKS,
    CONTROL_FLOW_FALLBACKS,
    LAYOUT_3D_FALLBACKS,
    STYLE_FALLBACKS
  ),
  param: has(CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
  path: has(CONTROL_FLOW_FALLBACKS, LAYOUT_2D_FALLBACKS, PRESENTATION_FALLBACKS),
  pattern: has(CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, PRESENTATION_FALLBACKS),
  polygon: has(CONTROL_FLOW_FALLBACKS, LAYOUT_2D_FALLBACKS, PRESENTATION_FALLBACKS),
  polyline: has(CONTROL_FLOW_FALLBACKS, LAYOUT_2D_FALLBACKS, PRESENTATION_FALLBACKS),
  pre: has(
    HTML_STYLE_SHORTHAND_FALLBACKS,
    TEXT_CONTENT_FALLBACKS,
    CONTROL_FLOW_FALLBACKS,
    LAYOUT_3D_FALLBACKS,
    STYLE_FALLBACKS
  ),
  progress: has(CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
  q: has(CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
  radialGradient: has(
    CONTROL_FLOW_FALLBACKS,
    LAYOUT_3D_FALLBACKS,
    PRESENTATION_FALLBACKS
  ),
  rect: has(CONTROL_FLOW_FALLBACKS, LAYOUT_2D_FALLBACKS, PRESENTATION_FALLBACKS),
  rp: has(CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
  rt: has(CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
  ruby: has(
    HTML_STYLE_SHORTHAND_FALLBACKS,
    TEXT_CONTENT_FALLBACKS,
    CONTROL_FLOW_FALLBACKS,
    LAYOUT_3D_FALLBACKS,
    STYLE_FALLBACKS
  ),
  s: has(
    HTML_STYLE_SHORTHAND_FALLBACKS,
    TEXT_CONTENT_FALLBACKS,
    CONTROL_FLOW_FALLBACKS,
    LAYOUT_3D_FALLBACKS,
    STYLE_FALLBACKS
  ),
  samp: has(CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
  script: has(
    HTML_STYLE_SHORTHAND_FALLBACKS,
    TEXT_CONTENT_FALLBACKS,
    CONTROL_FLOW_FALLBACKS,
    LAYOUT_3D_FALLBACKS,
    STYLE_FALLBACKS
  ),
  section: has(
    HTML_STYLE_SHORTHAND_FALLBACKS,
    TEXT_CONTENT_FALLBACKS,
    CONTROL_FLOW_FALLBACKS,
    LAYOUT_3D_FALLBACKS,
    STYLE_FALLBACKS
  ),
  select: has(
    HTML_STYLE_SHORTHAND_FALLBACKS,
    CONTROL_FLOW_FALLBACKS,
    LAYOUT_3D_FALLBACKS,
    STYLE_FALLBACKS
  ),
  set: has(),
  small: has(
    HTML_STYLE_SHORTHAND_FALLBACKS,
    TEXT_CONTENT_FALLBACKS,
    CONTROL_FLOW_FALLBACKS,
    LAYOUT_3D_FALLBACKS,
    STYLE_FALLBACKS
  ),
  solidcolor: has(),
  source: has(CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
  span: has(
    HTML_STYLE_SHORTHAND_FALLBACKS,
    TEXT_CONTENT_FALLBACKS,
    CONTROL_FLOW_FALLBACKS,
    LAYOUT_3D_FALLBACKS,
    STYLE_FALLBACKS
  ),
  stop: has(CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, PRESENTATION_FALLBACKS),
  strike: has(CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
  strong: has(
    HTML_STYLE_SHORTHAND_FALLBACKS,
    TEXT_CONTENT_FALLBACKS,
    CONTROL_FLOW_FALLBACKS,
    LAYOUT_3D_FALLBACKS,
    STYLE_FALLBACKS
  ),
  style: has(
    HTML_STYLE_SHORTHAND_FALLBACKS,
    TEXT_CONTENT_FALLBACKS,
    CONTROL_FLOW_FALLBACKS,
    LAYOUT_3D_FALLBACKS,
    STYLE_FALLBACKS
  ),
  sub: has(
    HTML_STYLE_SHORTHAND_FALLBACKS,
    CONTROL_FLOW_FALLBACKS,
    LAYOUT_3D_FALLBACKS,
    STYLE_FALLBACKS
  ),
  summary: has(CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
  sup: has(
    HTML_STYLE_SHORTHAND_FALLBACKS,
    TEXT_CONTENT_FALLBACKS,
    CONTROL_FLOW_FALLBACKS,
    LAYOUT_3D_FALLBACKS,
    STYLE_FALLBACKS
  ),
  svg: has(
    CONTROL_FLOW_FALLBACKS,
    LAYOUT_2D_FALLBACKS,
    PRESENTATION_FALLBACKS,
    STYLE_FALLBACKS
  ),
  switch: has(CONTROL_FLOW_FALLBACKS, LAYOUT_2D_FALLBACKS, PRESENTATION_FALLBACKS),
  symbol: has(CONTROL_FLOW_FALLBACKS, LAYOUT_2D_FALLBACKS, PRESENTATION_FALLBACKS),
  table: has(
    HTML_STYLE_SHORTHAND_FALLBACKS,
    CONTROL_FLOW_FALLBACKS,
    LAYOUT_3D_FALLBACKS,
    STYLE_FALLBACKS
  ),
  tbody: has(
    HTML_STYLE_SHORTHAND_FALLBACKS,
    CONTROL_FLOW_FALLBACKS,
    LAYOUT_3D_FALLBACKS,
    STYLE_FALLBACKS
  ),
  td: has(
    HTML_STYLE_SHORTHAND_FALLBACKS,
    TEXT_CONTENT_FALLBACKS,
    CONTROL_FLOW_FALLBACKS,
    LAYOUT_3D_FALLBACKS,
    STYLE_FALLBACKS
  ),
  text: has(
    HTML_STYLE_SHORTHAND_FALLBACKS,
    TEXT_CONTENT_FALLBACKS,
    CONTROL_FLOW_FALLBACKS,
    LAYOUT_2D_FALLBACKS,
    PRESENTATION_FALLBACKS
  ),
  textarea: has(
    HTML_STYLE_SHORTHAND_FALLBACKS,
    TEXT_CONTENT_FALLBACKS,
    CONTROL_FLOW_FALLBACKS,
    LAYOUT_3D_FALLBACKS,
    STYLE_FALLBACKS
  ),
  textPath: has(
    HTML_STYLE_SHORTHAND_FALLBACKS,
    TEXT_CONTENT_FALLBACKS,
    CONTROL_FLOW_FALLBACKS,
    LAYOUT_2D_FALLBACKS,
    PRESENTATION_FALLBACKS
  ),
  tfoot: has(
    HTML_STYLE_SHORTHAND_FALLBACKS,
    CONTROL_FLOW_FALLBACKS,
    LAYOUT_3D_FALLBACKS,
    STYLE_FALLBACKS
  ),
  th: has(
    HTML_STYLE_SHORTHAND_FALLBACKS,
    CONTROL_FLOW_FALLBACKS,
    LAYOUT_3D_FALLBACKS,
    STYLE_FALLBACKS
  ),
  thead: has(
    HTML_STYLE_SHORTHAND_FALLBACKS,
    CONTROL_FLOW_FALLBACKS,
    LAYOUT_3D_FALLBACKS,
    STYLE_FALLBACKS
  ),
  time: has(CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
  title: has(
    HTML_STYLE_SHORTHAND_FALLBACKS,
    TEXT_CONTENT_FALLBACKS,
    CONTROL_FLOW_FALLBACKS,
    LAYOUT_3D_FALLBACKS,
    STYLE_FALLBACKS
  ),
  tr: has(
    HTML_STYLE_SHORTHAND_FALLBACKS,
    CONTROL_FLOW_FALLBACKS,
    LAYOUT_3D_FALLBACKS,
    STYLE_FALLBACKS
  ),
  track: has(CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
  tref: has(CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, PRESENTATION_FALLBACKS),
  tspan: has(
    HTML_STYLE_SHORTHAND_FALLBACKS,
    CONTROL_FLOW_FALLBACKS,
    LAYOUT_2D_FALLBACKS,
    PRESENTATION_FALLBACKS
  ),
  tt: has(
    HTML_STYLE_SHORTHAND_FALLBACKS,
    CONTROL_FLOW_FALLBACKS,
    LAYOUT_3D_FALLBACKS,
    STYLE_FALLBACKS
  ),
  u: has(
    HTML_STYLE_SHORTHAND_FALLBACKS,
    TEXT_CONTENT_FALLBACKS,
    CONTROL_FLOW_FALLBACKS,
    LAYOUT_3D_FALLBACKS,
    STYLE_FALLBACKS
  ),
  ul: has(
    HTML_STYLE_SHORTHAND_FALLBACKS,
    CONTROL_FLOW_FALLBACKS,
    LAYOUT_3D_FALLBACKS,
    STYLE_FALLBACKS
  ),
  unknown: has(CONTROL_FLOW_FALLBACKS, LAYOUT_2D_FALLBACKS),
  us: has(CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, PRESENTATION_FALLBACKS),
  use: has(CONTROL_FLOW_FALLBACKS, LAYOUT_2D_FALLBACKS),
  var: has(CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS),
  video: has(
    HTML_STYLE_SHORTHAND_FALLBACKS,
    CONTROL_FLOW_FALLBACKS,
    LAYOUT_3D_FALLBACKS,
    STYLE_FALLBACKS
  ),
  view: has(),
  vkern: has(),
  wb: has(CONTROL_FLOW_FALLBACKS, LAYOUT_3D_FALLBACKS, STYLE_FALLBACKS)
}
