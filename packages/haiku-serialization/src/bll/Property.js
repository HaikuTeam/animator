const decamelize = require('decamelize')
const titlecase = require('titlecase')
const DOMSchema = require('@haiku/core/lib/properties/dom/schema').default
const DOMFallbacks = require('@haiku/core/lib/properties/dom/fallbacks').default
const BaseModel = require('./BaseModel')

/**
 * @class Property
 * @description
 *.  Collection of static class methods for dealing with component properties.
 */
class Property extends BaseModel {}

Property.DEFAULT_OPTIONS = {
  required: {}
}

BaseModel.extend(Property)

Property.assignDOMSchemaProperties = (out, element) => {
  const schema = DOMSchema[element.getSafeDomFriendlyName()]
  const fallbacks = DOMFallbacks[element.getSafeDomFriendlyName()]

  for (const name in schema) {
    let propertyGroup = null

    let nameParts = name.split('.')

    propertyGroup = {
      type: 'native', // As opposed to a 'state' property like myStateFoo
      name: name,
      prefix: nameParts[0],
      suffix: nameParts[1],
      fallback: fallbacks[name],
      typedef: schema[name],
      mock: void (0),
      target: element, // For internal filtering convenience; do not remove
      value: void (0) // The component instance provides this, but we don't (or should we???)
    }

    // If we successfully created a property group, push it onto the list
    if (propertyGroup) {
      // If there are two name parts, we have a cluster, e.g. style.border
      if (nameParts[0] && nameParts[1]) {
        propertyGroup.cluster = {
          prefix: nameParts[0],
          name: Property.PREFIX_TO_CLUSTER_NAME[nameParts[0]] || nameParts[0]
        }
      }

      out[name] = propertyGroup
    }
  }
}

Property.doesPropertyGroupContainRotation = (propertyGroup) => {
  return (
    propertyGroup['rotation.x'] ||
    propertyGroup['rotation.y'] ||
    propertyGroup['rotation.z']
  )
}

Property.PREFIX_TO_CLUSTER_NAME = {
  'mount': 'Mount',
  'align': 'Align',
  'origin': 'Origin',
  'translation': 'Position',
  'rotation': 'Rotation',
  'scale': 'Scale',
  'sizeMode': 'Sizing Mode',
  'sizeProportional': 'Size %',
  'sizeDifferential': 'Size +/-',
  'sizeAbsolute': 'Size',
  'overflow': 'Overflow',
  'style': 'Style'
}

Property.HUMANIZED_PROP_NAMES = {
  'rotation.z': 'Rotation Z', // Change me if we enable other types of rotation again
  'rotation.y': 'Rotation Y',
  'rotation.x': 'Rotation X',
  'translation.x': 'Position X',
  'translation.y': 'Position Y',
  'translation.z': 'Position Z',
  'sizeAbsolute.x': 'Size X',
  'sizeAbsolute.y': 'Size Y',
  'style.overflowX': 'Overflow X',
  'style.overflowY': 'Overflow Y'
}

Property.sort = (a, b) => {
  return a.name > b.name
}

function decam (s) {
  return decamelize(s).replace(/[\W_]/g, ' ')
}

Property.humanizePropertyName = (propertyName) => {
  if (Property.HUMANIZED_PROP_NAMES[propertyName]) {
    return Property.HUMANIZED_PROP_NAMES[propertyName]
  }
  return decam(propertyName)
}

Property.humanizePropertyNamePart = (propertyNamePart) => {
  return titlecase(decam(propertyNamePart))
}

Property.ALWAYS_CREATE_AS_PROPERTY_NEVER_AS_STATE = {
  // The parent controls these via the wrapper element
  'sizeMode.x': true,
  'sizeMode.y': true,
  'sizeMode.z': true,
  'sizeAbsolute.x': true,
  'sizeAbsolute.y': true,
  'sizeAbsolute.z': true,
  'sizeDifferential.x': true,
  'sizeDifferential.y': true,
  'sizeDifferential.z': true,
  'sizeProportional.x': true,
  'sizeProportional.y': true,
  'sizeProportional.z': true,
  'translation.x': true,
  'translation.y': true,
  'translation.z': true,
  'rotation.x': true,
  'rotation.y': true,
  'rotation.z': true,
  'rotation.w': true, // Just in case this ever happens
  'scale.x': true,
  'scale.y': true,
  'scale.z': true,
  'mount.x': true,
  'mount.y': true,
  'mount.z': true,
  'align.x': true,
  'align.y': true,
  'align.z': true,
  'origin.x': true,
  'origin.y': true,
  'origin.z': true,
  'opacity': true,
  'shown': true,
  'perspective': true, // Future proofing
  'style.zIndex': true // Many of these; avoid a bajillion zIndex_1, zIndex_2 states
}

Property.EXCLUDE_FROM_JIT = {
  'controlFlow.if': true,
  'controlFlow.repeat': true,
  'shown': true, // I dunno, this just always seems weird to include
  'translation.z': true, // There is a bug with this
  'sizeMode.x': true,
  'sizeMode.y': true,
  'sizeMode.z': true,
  'sizeDifferential.x': true,
  'sizeDifferential.y': true,
  'sizeDifferential.z': true,
  'sizeProportional.x': true,
  'sizeProportional.y': true,
  'sizeProportional.z': true,
  'align.x': true,
  'align.y': true,
  'align.z': true,
  'mount.x': true,
  'mount.y': true,
  'mount.z': true,
  'origin.x': true,
  'origin.y': true,
  'origin.z': true,
  'scale.z': true, // Not sane until we have true 3D objects
  'sizeAbsolute.z': true, // Not sane until we have true 3D objects
  'rotation.w': true, // Too much great power too much great responsibility

  // COMMENT OUT any items you want to INCLUDE in the JIT list
  'style.alignmentBaseline': true,
  // 'style.background': true,
  'style.backgroundAttachment': true,
  // 'style.backgroundColor': true,
  'style.backgroundImage': true,
  'style.backgroundPosition': true,
  'style.backgroundRepeat': true,
  'style.baselineShift': true,
  // 'style.border': true,
  // 'style.borderBottom': true,
  'style.borderBottomColor': true,
  'style.borderBottomStyle': true,
  'style.borderBottomWidth': true,
  // 'style.borderColor': true,
  // 'style.borderLeft': true,
  'style.borderLeftColor': true,
  'style.borderLeftStyle': true,
  'style.borderLeftWidth': true,
  // 'style.borderRight': true,
  'style.borderRightColor': true,
  'style.borderRightStyle': true,
  'style.borderRightWidth': true,
  'style.borderStyle': true,
  // 'style.borderTop': true,
  'style.borderTopColor': true,
  'style.borderTopStyle': true,
  'style.borderTopWidth': true,
  // 'style.borderWidth': true,
  'style.clear': true,
  'style.clip': true,
  'style.clipPath': true,
  'style.clipRule': true,
  // 'style.color': true,
  'style.colorInterpolation': true,
  'style.colorInterpolationFilters': true,
  'style.colorProfile': true,
  'style.colorRendering': true,
  'style.cssFloat': true,
  // 'style.cursor': true,
  'style.direction': true,
  'style.display': true,
  'style.dominantBaseline': true,
  'style.enableBackground': true,
  'style.fill': true,
  'style.fillOpacity': true,
  'style.fillRule': true,
  'style.filter': true,
  'style.floodColor': true,
  'style.floodOpacity': true,
  // 'style.font': true,
  // 'style.fontFamily': true,
  // 'style.fontSize': true,
  'style.fontSizeAdjust': true,
  'style.fontStretch': true,
  // 'style.fontStyle': true,
  'style.fontVariant': true,
  // 'style.fontWeight': true,
  'style.glyphOrientationHorizontal': true,
  'style.glyphOrientationVertical': true,
  'style.height': true,
  'style.imageRendering': true,
  'style.kerning': true,
  'style.left': true,
  // 'style.letterSpacing': true,
  'style.lightingColor': true,
  // 'style.lineHeight': true,
  'style.listStyle': true,
  'style.listStyleImage': true,
  'style.listStylePosition': true,
  'style.listStyleType': true,
  'style.margin': true,
  'style.marginBottom': true,
  'style.marginLeft': true,
  'style.marginRight': true,
  'style.marginTop': true,
  'style.markerEnd': true,
  'style.markerMid': true,
  'style.markerStart': true,
  'style.mask': true,
  // 'style.opacity': true,
  'style.overflow': true,
  'style.overflowX': true,
  'style.overflowY': true,
  'style.padding': true,
  'style.paddingBottom': true,
  'style.paddingLeft': true,
  'style.paddingRight': true,
  'style.paddingTop': true,
  'style.pageBreakAfter': true,
  'style.pageBreakBefore': true,
  // 'style.pointerEvents': true,
  'style.position': true,
  // 'style.perspective': true,
  'style.shapeRendering': true,
  'style.stopColor': true,
  'style.stopOpacity': true,
  'style.stroke': true,
  'style.strokeDasharray': true,
  'style.strokeDashoffset': true,
  'style.strokeLinecap': true,
  'style.strokeLinejoin': true,
  'style.strokeMiterlimit': true,
  'style.strokeOpacity': true,
  'style.strokeWidth': true,
  'style.textAlign': true,
  'style.textAnchor': true,
  'style.textDecoration': true,
  'style.textDecorationBlink': true,
  'style.textDecorationLineThrough': true,
  'style.textDecorationNone': true,
  'style.textDecorationOverline': true,
  'style.textDecorationUnderline': true,
  'style.textIndent': true,
  'style.textRendering': true,
  // 'style.textTransform': true,
  // 'style.transformStyle': true,
  'style.top': true,
  'style.unicodeBidi': true,
  // 'style.verticalAlign': true,
  // 'style.visibility': true,
  'style.width': true,
  'style.wordSpacing': true,
  'style.writingMode': true
  // 'style.zIndex': 'number',
  // 'style.WebkitTapHighlightColor': true,
}

Property.EXCLUDE_FROM_JIT_IF_ROOT_ELEMENT = {
  'content': true,
  'controlFlow.placeholder': true,
  'controlFlow.repeat': true,
  'controlFlow.if': true,
  'controlFlow.yield': true,
  'translation.x': true,
  'translation.y': true,
  'translation.z': true,
  'rotation.x': true,
  'rotation.y': true,
  'rotation.z': true,
  'scale.x': true,
  'scale.y': true,
  'scale.z': true
}

Property.PREFIXES_TO_EXCLUDE_FROM_ADDRESSABLES = {
  'sizeMode': true
}

Property.EXCLUDE_FROM_ADDRESSABLES_IF_ROOT_ELEMENT = {
  'content': true,
  'shown': true,
  'translation.x': true,
  'translation.y': true,
  'translation.z': true,
  'rotation.x': true,
  'rotation.y': true,
  'rotation.z': true,
  'scale.x': true,
  'scale.y': true,
  'scale.z': true
}

Property.EXCLUDE_FROM_ADDRESSABLES_IF_COMPONENT = {
  'content': true
}

Property.PRIVATE_PROPERTY_WHEN_HOISTING_TO_STATE = {
  'transform': true,
  'transformOrigin': true,
  'style.position': true,
  'style.display': true,
  'style.transform': true,
  'style.transformOrigin': true
}

Property.TEXT_FRIENDLY_SVG_ELEMENTS = {
  // Note that <desc> and <title>, while valid, are excluded to avoid noise
  text: true,
  textpath: true,
  textPath: true,
  tspan: true
}

Property.TEXT_FRIENDLY_HTML_ELEMENTS = {
  // Excluding elements that create noise, i.e. those we don't want user control of
  tt: true,
  i: true,
  b: true,
  big: true,
  small: true,
  em: true,
  strong: true,
  // dfn: true,
  code: true,
  // samp: true,
  // kbd: true,
  // var: true,
  cite: true,
  abbr: true,
  acronym: true,
  sub: true,
  sup: true,
  span: true,
  // bdo: true,
  address: true,
  div: true,
  a: true,
  object: true,
  p: true,
  h1: true,
  h2: true,
  h3: true,
  h4: true,
  h5: true,
  h6: true,
  pre: true,
  q: true,
  ins: true,
  del: true,
  dt: true,
  dd: true,
  li: true,
  label: true,
  option: true,
  textarea: true,
  fieldset: true,
  legend: true,
  button: true,
  caption: true,
  td: true,
  th: true,
  // title: true, Assume SVG for this use; would we ever suport document instantiation?
  script: true,
  style: true
}

module.exports = Property
