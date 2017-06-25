/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

var Layout3D = require('./../../Layout3D')

// A dictionary that maps HTML+SVG element names (camelCase)
// to addressable properties. This acts as a whitelist of properties that
// _can_ be applied, and special logic for applying them.
// div: {
//   addressableProperties: {
//     style: {...}
//   }
// }

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
  return {
    addressableProperties: obj
  }
}

var TEXT_CONTENT_SCHEMA = {
  'content': { typedef: 'string', fallback: null }
}

var LAYOUT_DEFAULTS = Layout3D.createLayoutSpec()

var LAYOUT_3D_SCHEMA = {
  shown: {
    typedef: 'boolean',
    fallback: LAYOUT_DEFAULTS.shown
  },
  opacity: {
    typedef: 'number',
    fallback: LAYOUT_DEFAULTS.opacity
  },
  'mount.x': {
    typedef: 'number',
    fallback: LAYOUT_DEFAULTS.mount.x
  },
  'mount.y': {
    typedef: 'number',
    fallback: LAYOUT_DEFAULTS.mount.y
  },
  'mount.z': {
    typedef: 'number',
    fallback: LAYOUT_DEFAULTS.mount.z
  },
  'align.x': {
    typedef: 'number',
    fallback: LAYOUT_DEFAULTS.align.x
  },
  'align.y': {
    typedef: 'number',
    fallback: LAYOUT_DEFAULTS.align.y
  },
  'align.z': {
    typedef: 'number',
    fallback: LAYOUT_DEFAULTS.align.z
  },
  'origin.x': {
    typedef: 'number',
    fallback: LAYOUT_DEFAULTS.origin.x
  },
  'origin.y': {
    typedef: 'number',
    fallback: LAYOUT_DEFAULTS.origin.y
  },
  'origin.z': {
    typedef: 'number',
    fallback: LAYOUT_DEFAULTS.origin.z
  },
  'translation.x': {
    typedef: 'number',
    fallback: LAYOUT_DEFAULTS.translation.x
  },
  'translation.y': {
    typedef: 'number',
    fallback: LAYOUT_DEFAULTS.translation.y
  },
  'translation.z': {
    typedef: 'number',
    fallback: LAYOUT_DEFAULTS.translation.z
  },
  'rotation.x': {
    typedef: 'number',
    fallback: LAYOUT_DEFAULTS.rotation.x
  },
  'rotation.y': {
    typedef: 'number',
    fallback: LAYOUT_DEFAULTS.rotation.y
  },
  'rotation.z': {
    typedef: 'number',
    fallback: LAYOUT_DEFAULTS.rotation.z
  },
  'scale.x': {
    typedef: 'number',
    fallback: LAYOUT_DEFAULTS.scale.x
  },
  'scale.y': {
    typedef: 'number',
    fallback: LAYOUT_DEFAULTS.scale.y
  },
  'scale.z': {
    typedef: 'number',
    fallback: LAYOUT_DEFAULTS.scale.z
  },
  'sizeAbsolute.x': {
    typedef: 'number',
    fallback: LAYOUT_DEFAULTS.sizeAbsolute.x
  },
  'sizeAbsolute.y': {
    typedef: 'number',
    fallback: LAYOUT_DEFAULTS.sizeAbsolute.y
  },
  'sizeAbsolute.z': {
    typedef: 'number',
    fallback: LAYOUT_DEFAULTS.sizeAbsolute.z
  },
  'sizeProportional.x': {
    typedef: 'number',
    fallback: LAYOUT_DEFAULTS.sizeProportional.x
  },
  'sizeProportional.y': {
    typedef: 'number',
    fallback: LAYOUT_DEFAULTS.sizeProportional.y
  },
  'sizeProportional.z': {
    typedef: 'number',
    fallback: LAYOUT_DEFAULTS.sizeProportional.z
  },
  'sizeDifferential.x': {
    typedef: 'number',
    fallback: LAYOUT_DEFAULTS.sizeDifferential.x
  },
  'sizeDifferential.y': {
    typedef: 'number',
    fallback: LAYOUT_DEFAULTS.sizeDifferential.y
  },
  'sizeDifferential.z': {
    typedef: 'number',
    fallback: LAYOUT_DEFAULTS.sizeDifferential.z
  },
  'sizeMode.x': {
    typedef: 'number',
    fallback: LAYOUT_DEFAULTS.sizeMode.x
  },
  'sizeMode.y': {
    typedef: 'number',
    fallback: LAYOUT_DEFAULTS.sizeMode.y
  },
  'sizeMode.z': {
    typedef: 'number',
    fallback: LAYOUT_DEFAULTS.sizeMode.z
  }
}

var LAYOUT_2D_SCHEMA = {
  shown: {
    typedef: 'boolean',
    fallback: LAYOUT_DEFAULTS.shown
  },
  opacity: {
    typedef: 'number',
    fallback: LAYOUT_DEFAULTS.opacity
  },
  'mount.x': {
    typedef: 'number',
    fallback: LAYOUT_DEFAULTS.mount.x
  },
  'mount.y': {
    typedef: 'number',
    fallback: LAYOUT_DEFAULTS.mount.y
  },
  'align.x': {
    typedef: 'number',
    fallback: LAYOUT_DEFAULTS.align.x
  },
  'align.y': {
    typedef: 'number',
    fallback: LAYOUT_DEFAULTS.align.y
  },
  'origin.x': {
    typedef: 'number',
    fallback: LAYOUT_DEFAULTS.origin.x
  },
  'origin.y': {
    typedef: 'number',
    fallback: LAYOUT_DEFAULTS.origin.y
  },
  'translation.x': {
    typedef: 'number',
    fallback: LAYOUT_DEFAULTS.translation.x
  },
  'translation.y': {
    typedef: 'number',
    fallback: LAYOUT_DEFAULTS.translation.y
  },
  'translation.z': {
    typedef: 'number',
    fallback: LAYOUT_DEFAULTS.translation.z
  },
  'rotation.x': {
    typedef: 'number',
    fallback: LAYOUT_DEFAULTS.rotation.x
  },
  'rotation.y': {
    typedef: 'number',
    fallback: LAYOUT_DEFAULTS.rotation.y
  },
  'rotation.z': {
    typedef: 'number',
    fallback: LAYOUT_DEFAULTS.rotation.z
  },
  'scale.x': {
    typedef: 'number',
    fallback: LAYOUT_DEFAULTS.scale.x
  },
  'scale.y': {
    typedef: 'number',
    fallback: LAYOUT_DEFAULTS.scale.y
  },
  'sizeAbsolute.x': {
    typedef: 'number',
    fallback: LAYOUT_DEFAULTS.sizeAbsolute.x
  },
  'sizeAbsolute.y': {
    typedef: 'number',
    fallback: LAYOUT_DEFAULTS.sizeAbsolute.y
  },
  'sizeProportional.x': {
    typedef: 'number',
    fallback: LAYOUT_DEFAULTS.sizeProportional.x
  },
  'sizeProportional.y': {
    typedef: 'number',
    fallback: LAYOUT_DEFAULTS.sizeProportional.y
  },
  'sizeDifferential.x': {
    typedef: 'number',
    fallback: LAYOUT_DEFAULTS.sizeDifferential.x
  },
  'sizeDifferential.y': {
    typedef: 'number',
    fallback: LAYOUT_DEFAULTS.sizeDifferential.y
  },
  'sizeMode.x': {
    typedef: 'number',
    fallback: LAYOUT_DEFAULTS.sizeMode.x
  },
  'sizeMode.y': {
    typedef: 'number',
    fallback: LAYOUT_DEFAULTS.sizeMode.y
  }
}

var PRESENTATION_SCHEMA = {
  alignmentBaseline: { typedef: 'string', fallback: '' },
  baselineShift: { typedef: 'string', fallback: '' },
  clipPath: { typedef: 'string', fallback: '' },
  clipRule: { typedef: 'string', fallback: '' },
  clip: { typedef: 'string', fallback: '' },
  colorInterpolationFilters: { typedef: 'string', fallback: '' },
  colorInterpolation: { typedef: 'string', fallback: '' },
  colorProfile: { typedef: 'string', fallback: '' },
  colorRendering: { typedef: 'string', fallback: '' },
  color: { typedef: 'string', fallback: '' },
  cursor: { typedef: 'string', fallback: '' },
  direction: { typedef: 'string', fallback: '' },
  display: { typedef: 'string', fallback: '' },
  dominantBaseline: { typedef: 'string', fallback: '' },
  enableBackground: { typedef: 'string', fallback: '' },
  fillOpacity: { typedef: 'string', fallback: '' },
  fillRule: { typedef: 'string', fallback: '' },
  fill: { typedef: 'string', fallback: '' },
  filter: { typedef: 'string', fallback: '' },
  floodColor: { typedef: 'string', fallback: '' },
  floodOpacity: { typedef: 'string', fallback: '' },
  fontFamily: { typedef: 'string', fallback: '' },
  fontSizeAdjust: { typedef: 'string', fallback: '' },
  fontSize: { typedef: 'string', fallback: '' },
  fontStretch: { typedef: 'string', fallback: '' },
  fontStyle: { typedef: 'string', fallback: '' },
  fontVariant: { typedef: 'string', fallback: '' },
  fontWeight: { typedef: 'string', fallback: '' },
  glyphOrientationHorizontal: { typedef: 'string', fallback: '' },
  glyphOrientationVertical: { typedef: 'string', fallback: '' },
  imageRendering: { typedef: 'string', fallback: '' },
  kerning: { typedef: 'string', fallback: '' },
  letterSpacing: { typedef: 'string', fallback: '' },
  lightingColor: { typedef: 'string', fallback: '' },
  markerEnd: { typedef: 'string', fallback: '' },
  markerMid: { typedef: 'string', fallback: '' },
  markerStart: { typedef: 'string', fallback: '' },
  mask: { typedef: 'string', fallback: '' },
  // opacity omitted - is part of layout algorithm
  overflow: { typedef: 'string', fallback: '' },
  overflowX: { typedef: 'string', fallback: '' },
  overflowY: { typedef: 'string', fallback: '' },
  pointerEvents: { typedef: 'string', fallback: '' },
  shapeRendering: { typedef: 'string', fallback: '' },
  stopColor: { typedef: 'string', fallback: '' },
  stopOpacity: { typedef: 'string', fallback: '' },
  strokeDasharray: { typedef: 'string', fallback: '' },
  strokeDashoffset: { typedef: 'string', fallback: '' },
  strokeLinecap: { typedef: 'string', fallback: '' },
  strokeLinejoin: { typedef: 'string', fallback: '' },
  strokeMiterlimit: { typedef: 'string', fallback: '' },
  strokeOpacity: { typedef: 'string', fallback: '' },
  strokeWidth: { typedef: 'string', fallback: '' },
  stroke: { typedef: 'string', fallback: '' },
  textAnchor: { typedef: 'string', fallback: '' },
  textDecoration: { typedef: 'string', fallback: '' },
  textRendering: { typedef: 'string', fallback: '' },
  unicodeBidi: { typedef: 'string', fallback: '' },
  visibility: { typedef: 'string', fallback: '' },
  wordSpacing: { typedef: 'string', fallback: '' },
  writingMode: { typedef: 'string', fallback: '' }
}

var STYLE_SCHEMA = {
  'style.alignmentBaseline': { typedef: 'string', fallback: '' },
  'style.background': { typedef: 'string', fallback: '' },
  'style.backgroundAttachment': { typedef: 'string', fallback: '' },
  'style.backgroundColor': { typedef: 'string', fallback: '' },
  'style.backgroundImage': { typedef: 'string', fallback: '' },
  'style.backgroundPosition': { typedef: 'string', fallback: '' },
  'style.backgroundRepeat': { typedef: 'string', fallback: '' },
  'style.baselineShift': { typedef: 'string', fallback: '' },
  'style.border': { typedef: 'string', fallback: '' },
  'style.borderBottom': { typedef: 'string', fallback: '' },
  'style.borderBottomColor': { typedef: 'string', fallback: '' },
  'style.borderBottomStyle': { typedef: 'string', fallback: '' },
  'style.borderBottomWidth': { typedef: 'string', fallback: '' },
  'style.borderColor': { typedef: 'string', fallback: '' },
  'style.borderLeft': { typedef: 'string', fallback: '' },
  'style.borderLeftColor': { typedef: 'string', fallback: '' },
  'style.borderLeftStyle': { typedef: 'string', fallback: '' },
  'style.borderLeftWidth': { typedef: 'string', fallback: '' },
  'style.borderRight': { typedef: 'string', fallback: '' },
  'style.borderRightColor': { typedef: 'string', fallback: '' },
  'style.borderRightStyle': { typedef: 'string', fallback: '' },
  'style.borderRightWidth': { typedef: 'string', fallback: '' },
  'style.borderStyle': { typedef: 'string', fallback: '' },
  'style.borderTop': { typedef: 'string', fallback: '' },
  'style.borderTopColor': { typedef: 'string', fallback: '' },
  'style.borderTopStyle': { typedef: 'string', fallback: '' },
  'style.borderTopWidth': { typedef: 'string', fallback: '' },
  'style.borderWidth': { typedef: 'string', fallback: '' },
  'style.clear': { typedef: 'string', fallback: '' },
  'style.clip': { typedef: 'string', fallback: '' },
  'style.clipPath': { typedef: 'string', fallback: '' },
  'style.clipRule': { typedef: 'string', fallback: '' },
  'style.color': { typedef: 'string', fallback: '' },
  'style.colorInterpolation': { typedef: 'string', fallback: '' },
  'style.colorInterpolationFilters': { typedef: 'string', fallback: '' },
  'style.colorProfile': { typedef: 'string', fallback: '' },
  'style.colorRendering': { typedef: 'string', fallback: '' },
  'style.cssFloat': { typedef: 'string', fallback: '' },
  'style.cursor': { typedef: 'string', fallback: '' },
  'style.direction': { typedef: 'string', fallback: '' },
  'style.display': { typedef: 'string', fallback: '' },
  'style.dominantBaseline': { typedef: 'string', fallback: '' },
  'style.enableBackground': { typedef: 'string', fallback: '' },
  'style.fill': { typedef: 'string', fallback: '' },
  'style.fillOpacity': { typedef: 'string', fallback: '' },
  'style.fillRule': { typedef: 'string', fallback: '' },
  'style.filter': { typedef: 'string', fallback: '' },
  'style.floodColor': { typedef: 'string', fallback: '' },
  'style.floodOpacity': { typedef: 'string', fallback: '' },
  'style.font': { typedef: 'string', fallback: '' },
  'style.fontFamily': { typedef: 'string', fallback: '' },
  'style.fontSize': { typedef: 'string', fallback: '' },
  'style.fontSizeAdjust': { typedef: 'string', fallback: '' },
  'style.fontStretch': { typedef: 'string', fallback: '' },
  'style.fontStyle': { typedef: 'string', fallback: '' },
  'style.fontVariant': { typedef: 'string', fallback: '' },
  'style.fontWeight': { typedef: 'string', fallback: '' },
  'style.glyphOrientationHorizontal': { typedef: 'string', fallback: '' },
  'style.glyphOrientationVertical': { typedef: 'string', fallback: '' },
  'style.height': { typedef: 'string', fallback: '' },
  'style.imageRendering': { typedef: 'string', fallback: '' },
  'style.kerning': { typedef: 'string', fallback: '' },
  'style.left': { typedef: 'string', fallback: '' },
  'style.letterSpacing': { typedef: 'string', fallback: '' },
  'style.lightingColor': { typedef: 'string', fallback: '' },
  'style.lineHeight': { typedef: 'string', fallback: '' },
  'style.listStyle': { typedef: 'string', fallback: '' },
  'style.listStyleImage': { typedef: 'string', fallback: '' },
  'style.listStylePosition': { typedef: 'string', fallback: '' },
  'style.listStyleType': { typedef: 'string', fallback: '' },
  'style.margin': { typedef: 'string', fallback: '' },
  'style.marginBottom': { typedef: 'string', fallback: '' },
  'style.marginLeft': { typedef: 'string', fallback: '' },
  'style.marginRight': { typedef: 'string', fallback: '' },
  'style.marginTop': { typedef: 'string', fallback: '' },
  'style.markerEnd': { typedef: 'string', fallback: '' },
  'style.markerMid': { typedef: 'string', fallback: '' },
  'style.markerStart': { typedef: 'string', fallback: '' },
  'style.mask': { typedef: 'string', fallback: '' },
  'style.opacity': { typedef: 'string', fallback: '' },
  'style.overflow': { typedef: 'string', fallback: '' },
  'style.overflowX': { typedef: 'string', fallback: 'hidden' },
  'style.overflowY': { typedef: 'string', fallback: 'hidden' },
  'style.padding': { typedef: 'string', fallback: '' },
  'style.paddingBottom': { typedef: 'string', fallback: '' },
  'style.paddingLeft': { typedef: 'string', fallback: '' },
  'style.paddingRight': { typedef: 'string', fallback: '' },
  'style.paddingTop': { typedef: 'string', fallback: '' },
  'style.pageBreakAfter': { typedef: 'string', fallback: '' },
  'style.pageBreakBefore': { typedef: 'string', fallback: '' },
  'style.pointerEvents': { typedef: 'string', fallback: '' },
  'style.position': { typedef: 'string', fallback: '' },
  'style.shapeRendering': { typedef: 'string', fallback: '' },
  'style.stopColor': { typedef: 'string', fallback: '' },
  'style.stopOpacity': { typedef: 'string', fallback: '' },
  'style.stroke': { typedef: 'string', fallback: '' },
  'style.strokeDasharray': { typedef: 'string', fallback: '' },
  'style.strokeDashoffset': { typedef: 'string', fallback: '' },
  'style.strokeLinecap': { typedef: 'string', fallback: '' },
  'style.strokeLinejoin': { typedef: 'string', fallback: '' },
  'style.strokeMiterlimit': { typedef: 'string', fallback: '' },
  'style.strokeOpacity': { typedef: 'string', fallback: '' },
  'style.strokeWidth': { typedef: 'string', fallback: '' },
  'style.textAlign': { typedef: 'string', fallback: '' },
  'style.textAnchor': { typedef: 'string', fallback: '' },
  'style.textDecoration': { typedef: 'string', fallback: '' },
  'style.textDecorationBlink': { typedef: 'string', fallback: '' },
  'style.textDecorationLineThrough': { typedef: 'string', fallback: '' },
  'style.textDecorationNone': { typedef: 'string', fallback: '' },
  'style.textDecorationOverline': { typedef: 'string', fallback: '' },
  'style.textDecorationUnderline': { typedef: 'string', fallback: '' },
  'style.textIndent': { typedef: 'string', fallback: '' },
  'style.textRendering': { typedef: 'string', fallback: '' },
  'style.textTransform': { typedef: 'string', fallback: '' },
  'style.top': { typedef: 'string', fallback: '' },
  'style.unicodeBidi': { typedef: 'string', fallback: '' },
  'style.verticalAlign': { typedef: 'string', fallback: '' },
  'style.visibility': { typedef: 'string', fallback: '' },
  'style.width': { typedef: 'string', fallback: '' },
  'style.wordSpacing': { typedef: 'string', fallback: '' },
  'style.writingMode': { typedef: 'string', fallback: '' },
  'style.zIndex': { typedef: 'number', fallback: 1 },
  'style.WebkitTapHighlightColor': { typedef: 'string', fallback: 'rgba(0,0,0,0)' }
}

var HTML_STYLE_SHORTHAND_SCHEMA = {
  backgroundColor: { typedef: 'string', fallback: '' }
}

var CONTROL_FLOW_SCHEMA = {
  // 'controlFlow.if': { typedef: 'any', fallback: null },
  // 'controlFlow.repeat': { typedef: 'any', fallback: null },
  // 'controlFlow.yield': { typedef: 'any', fallback: null },
  'controlFlow.insert': { typedef: 'any', fallback: null },
  'controlFlow.placeholder': { typedef: 'any', fallback: null }
}

module.exports = {
  'missing-glyph': has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, PRESENTATION_SCHEMA),
  a: has(HTML_STYLE_SHORTHAND_SCHEMA, TEXT_CONTENT_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, PRESENTATION_SCHEMA, STYLE_SCHEMA),
  abbr: has(HTML_STYLE_SHORTHAND_SCHEMA, TEXT_CONTENT_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  acronym: has(HTML_STYLE_SHORTHAND_SCHEMA, TEXT_CONTENT_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
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
  article: has(HTML_STYLE_SHORTHAND_SCHEMA, TEXT_CONTENT_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  aside: has(HTML_STYLE_SHORTHAND_SCHEMA, TEXT_CONTENT_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  audio: has(HTML_STYLE_SHORTHAND_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  b: has(HTML_STYLE_SHORTHAND_SCHEMA, TEXT_CONTENT_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  base: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  basefont: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  bdi: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  bdo: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  big: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  blockquote: has(HTML_STYLE_SHORTHAND_SCHEMA, TEXT_CONTENT_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  body: has(HTML_STYLE_SHORTHAND_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  br: has(HTML_STYLE_SHORTHAND_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  button: has(HTML_STYLE_SHORTHAND_SCHEMA, TEXT_CONTENT_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  canvas: has(HTML_STYLE_SHORTHAND_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  caption: has(HTML_STYLE_SHORTHAND_SCHEMA, TEXT_CONTENT_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  center: has(HTML_STYLE_SHORTHAND_SCHEMA, TEXT_CONTENT_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  circle: has(CONTROL_FLOW_SCHEMA, LAYOUT_2D_SCHEMA, PRESENTATION_SCHEMA),
  cite: has(HTML_STYLE_SHORTHAND_SCHEMA, TEXT_CONTENT_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  clipPath: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, PRESENTATION_SCHEMA),
  code: has(HTML_STYLE_SHORTHAND_SCHEMA, TEXT_CONTENT_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  col: has(HTML_STYLE_SHORTHAND_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  colgroup: has(HTML_STYLE_SHORTHAND_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  'color-profile': has(),
  command: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  cursor: has(),
  datalist: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  dd: has(HTML_STYLE_SHORTHAND_SCHEMA, TEXT_CONTENT_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  defs: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, PRESENTATION_SCHEMA),
  del: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  desc: has(),
  details: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  dfn: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  dir: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  discard: has(),
  div: has(HTML_STYLE_SHORTHAND_SCHEMA, TEXT_CONTENT_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  dl: has(HTML_STYLE_SHORTHAND_SCHEMA, TEXT_CONTENT_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  dt: has(HTML_STYLE_SHORTHAND_SCHEMA, TEXT_CONTENT_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  ellipse: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, PRESENTATION_SCHEMA),
  em: has(HTML_STYLE_SHORTHAND_SCHEMA, TEXT_CONTENT_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  embed: has(HTML_STYLE_SHORTHAND_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  feBlend: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, PRESENTATION_SCHEMA),
  feColorMatrix: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, PRESENTATION_SCHEMA),
  feComponentTransfer: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, PRESENTATION_SCHEMA),
  feComposite: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, PRESENTATION_SCHEMA),
  feConvolveMatrix: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, PRESENTATION_SCHEMA),
  feDiffuseLighting: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, PRESENTATION_SCHEMA),
  feDisplacementMap: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, PRESENTATION_SCHEMA),
  feDistantLight: has(),
  feDropShadow: has(),
  feFlood: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, PRESENTATION_SCHEMA),
  feFuncA: has(),
  feFuncB: has(),
  feFuncG: has(),
  feFuncR: has(),
  feGaussianBlur: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, PRESENTATION_SCHEMA),
  feImage: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, PRESENTATION_SCHEMA),
  feMerge: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, PRESENTATION_SCHEMA),
  feMergeNode: has(),
  feMorphology: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, PRESENTATION_SCHEMA),
  feOffset: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, PRESENTATION_SCHEMA),
  fePointLight: has(),
  feSpecularLighting: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, PRESENTATION_SCHEMA),
  feTile: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, PRESENTATION_SCHEMA),
  feTurbulence: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, PRESENTATION_SCHEMA),
  fieldset: has(HTML_STYLE_SHORTHAND_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  figcaption: has(HTML_STYLE_SHORTHAND_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  figure: has(HTML_STYLE_SHORTHAND_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  filter: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, PRESENTATION_SCHEMA),
  'font-face': has(),
  'font-face-format': has(),
  'font-face-name': has(),
  'font-face-src': has(),
  'font-face-uri': has(),
  font: has(HTML_STYLE_SHORTHAND_SCHEMA, TEXT_CONTENT_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, PRESENTATION_SCHEMA, STYLE_SCHEMA),
  footer: has(HTML_STYLE_SHORTHAND_SCHEMA, TEXT_CONTENT_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  foreignObject: has(CONTROL_FLOW_SCHEMA, LAYOUT_2D_SCHEMA, PRESENTATION_SCHEMA),
  form: has(HTML_STYLE_SHORTHAND_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  frame: has(HTML_STYLE_SHORTHAND_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  frameset: has(HTML_STYLE_SHORTHAND_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  g: has(CONTROL_FLOW_SCHEMA, LAYOUT_2D_SCHEMA, PRESENTATION_SCHEMA),
  glyph: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, PRESENTATION_SCHEMA),
  glyphRef: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, PRESENTATION_SCHEMA),
  h1: has(HTML_STYLE_SHORTHAND_SCHEMA, TEXT_CONTENT_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  h2: has(HTML_STYLE_SHORTHAND_SCHEMA, TEXT_CONTENT_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  h3: has(HTML_STYLE_SHORTHAND_SCHEMA, TEXT_CONTENT_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  h4: has(HTML_STYLE_SHORTHAND_SCHEMA, TEXT_CONTENT_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  h5: has(HTML_STYLE_SHORTHAND_SCHEMA, TEXT_CONTENT_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  h6: has(HTML_STYLE_SHORTHAND_SCHEMA, TEXT_CONTENT_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  hatch: has(),
  hatchpath: has(),
  head: has(HTML_STYLE_SHORTHAND_SCHEMA, TEXT_CONTENT_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  header: has(HTML_STYLE_SHORTHAND_SCHEMA, TEXT_CONTENT_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  hgroup: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  hkern: has(),
  hr: has(HTML_STYLE_SHORTHAND_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  html: has(HTML_STYLE_SHORTHAND_SCHEMA, TEXT_CONTENT_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  i: has(HTML_STYLE_SHORTHAND_SCHEMA, TEXT_CONTENT_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  iframe: has(HTML_STYLE_SHORTHAND_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  image: has(CONTROL_FLOW_SCHEMA, LAYOUT_2D_SCHEMA, PRESENTATION_SCHEMA),
  img: has(HTML_STYLE_SHORTHAND_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  input: has(HTML_STYLE_SHORTHAND_SCHEMA, TEXT_CONTENT_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  ins: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  kbd: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  keygen: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  label: has(HTML_STYLE_SHORTHAND_SCHEMA, TEXT_CONTENT_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  legend: has(HTML_STYLE_SHORTHAND_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  li: has(HTML_STYLE_SHORTHAND_SCHEMA, TEXT_CONTENT_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  line: has(CONTROL_FLOW_SCHEMA, LAYOUT_2D_SCHEMA, PRESENTATION_SCHEMA),
  linearGradient: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, PRESENTATION_SCHEMA),
  link: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  map: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  mark: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  marker: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, PRESENTATION_SCHEMA),
  mask: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, PRESENTATION_SCHEMA),
  menu: has(HTML_STYLE_SHORTHAND_SCHEMA, TEXT_CONTENT_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  mesh: has(CONTROL_FLOW_SCHEMA, LAYOUT_2D_SCHEMA),
  meshgradient: has(),
  meshpatch: has(),
  meshrow: has(),
  meta: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  metadata: has(),
  meter: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  mpath: has(),
  nav: has(HTML_STYLE_SHORTHAND_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  noframes: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  noscript: has(HTML_STYLE_SHORTHAND_SCHEMA, TEXT_CONTENT_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  object: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  ol: has(HTML_STYLE_SHORTHAND_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  optgroup: has(HTML_STYLE_SHORTHAND_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  option: has(HTML_STYLE_SHORTHAND_SCHEMA, TEXT_CONTENT_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  output: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  p: has(HTML_STYLE_SHORTHAND_SCHEMA, TEXT_CONTENT_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  param: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  path: has(CONTROL_FLOW_SCHEMA, LAYOUT_2D_SCHEMA, PRESENTATION_SCHEMA),
  pattern: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, PRESENTATION_SCHEMA),
  polygon: has(CONTROL_FLOW_SCHEMA, LAYOUT_2D_SCHEMA, PRESENTATION_SCHEMA),
  polyline: has(CONTROL_FLOW_SCHEMA, LAYOUT_2D_SCHEMA, PRESENTATION_SCHEMA),
  pre: has(HTML_STYLE_SHORTHAND_SCHEMA, TEXT_CONTENT_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  progress: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  q: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  radialGradient: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, PRESENTATION_SCHEMA),
  rect: has(CONTROL_FLOW_SCHEMA, LAYOUT_2D_SCHEMA, PRESENTATION_SCHEMA),
  rp: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  rt: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  ruby: has(HTML_STYLE_SHORTHAND_SCHEMA, TEXT_CONTENT_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  s: has(HTML_STYLE_SHORTHAND_SCHEMA, TEXT_CONTENT_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  samp: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  script: has(HTML_STYLE_SHORTHAND_SCHEMA, TEXT_CONTENT_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  section: has(HTML_STYLE_SHORTHAND_SCHEMA, TEXT_CONTENT_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  select: has(HTML_STYLE_SHORTHAND_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  set: has(),
  small: has(HTML_STYLE_SHORTHAND_SCHEMA, TEXT_CONTENT_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  solidcolor: has(),
  source: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  span: has(HTML_STYLE_SHORTHAND_SCHEMA, TEXT_CONTENT_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  stop: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, PRESENTATION_SCHEMA),
  strike: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  strong: has(HTML_STYLE_SHORTHAND_SCHEMA, TEXT_CONTENT_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  style: has(HTML_STYLE_SHORTHAND_SCHEMA, TEXT_CONTENT_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  sub: has(HTML_STYLE_SHORTHAND_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  summary: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  sup: has(HTML_STYLE_SHORTHAND_SCHEMA, TEXT_CONTENT_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  svg: has(CONTROL_FLOW_SCHEMA, LAYOUT_2D_SCHEMA, PRESENTATION_SCHEMA, STYLE_SCHEMA),
  switch: has(CONTROL_FLOW_SCHEMA, LAYOUT_2D_SCHEMA, PRESENTATION_SCHEMA),
  symbol: has(CONTROL_FLOW_SCHEMA, LAYOUT_2D_SCHEMA, PRESENTATION_SCHEMA),
  table: has(HTML_STYLE_SHORTHAND_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  tbody: has(HTML_STYLE_SHORTHAND_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  td: has(HTML_STYLE_SHORTHAND_SCHEMA, TEXT_CONTENT_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  text: has(HTML_STYLE_SHORTHAND_SCHEMA, TEXT_CONTENT_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_2D_SCHEMA, PRESENTATION_SCHEMA),
  textarea: has(HTML_STYLE_SHORTHAND_SCHEMA, TEXT_CONTENT_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  textPath: has(HTML_STYLE_SHORTHAND_SCHEMA, TEXT_CONTENT_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_2D_SCHEMA, PRESENTATION_SCHEMA),
  tfoot: has(HTML_STYLE_SHORTHAND_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  th: has(HTML_STYLE_SHORTHAND_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  thead: has(HTML_STYLE_SHORTHAND_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  time: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  title: has(HTML_STYLE_SHORTHAND_SCHEMA, TEXT_CONTENT_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  tr: has(HTML_STYLE_SHORTHAND_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  track: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  tref: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, PRESENTATION_SCHEMA),
  tspan: has(HTML_STYLE_SHORTHAND_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_2D_SCHEMA, PRESENTATION_SCHEMA),
  tt: has(HTML_STYLE_SHORTHAND_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  u: has(HTML_STYLE_SHORTHAND_SCHEMA, TEXT_CONTENT_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  ul: has(HTML_STYLE_SHORTHAND_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  unknown: has(CONTROL_FLOW_SCHEMA, LAYOUT_2D_SCHEMA),
  us: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, PRESENTATION_SCHEMA),
  use: has(CONTROL_FLOW_SCHEMA, LAYOUT_2D_SCHEMA),
  var: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  video: has(HTML_STYLE_SHORTHAND_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
  view: has(),
  vker: has(),
  wb: has(CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA)
}
