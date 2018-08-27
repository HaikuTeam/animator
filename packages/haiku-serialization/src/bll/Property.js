const decamelize = require('decamelize')
const titlecase = require('titlecase')
const {getFallback} = require('@haiku/core/lib/HaikuComponent')
const BaseModel = require('./BaseModel')
const {Experiment, experimentIsEnabled} = require('haiku-common/lib/experiments')

function decam (s) {
  return decamelize(s).replace(/[\W_]/g, ' ')
}

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
  const schema = Property.BUILTIN_DOM_SCHEMAS[element.getSafeDomFriendlyName()] || {}

  for (const name in schema) {
    let propertyGroup = null

    let nameParts = name.split('.')

    const fallback = getFallback(element.getSafeDomFriendlyName(), name)

    propertyGroup = {
      type: 'native', // As opposed to a 'state' property like myStateFoo
      name: name,
      prefix: nameParts[0],
      suffix: nameParts[1],
      fallback,
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

Property.sort = (a, b) => {
  return a.name > b.name
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

Property.layoutSpecAsProperties = (spec) => {
  return {
    'shown': spec.shown,
    'opacity': spec.opacity,
    'offset.x': spec.offset.x,
    'offset.y': spec.offset.y,
    'offset.z': spec.offset.z,
    'origin.x': spec.origin.x,
    'origin.y': spec.origin.y,
    'origin.z': spec.origin.z,
    'translation.x': spec.translation.x,
    'translation.y': spec.translation.y,
    'translation.z': spec.translation.z,
    'rotation.x': spec.rotation.x,
    'rotation.y': spec.rotation.y,
    'rotation.z': spec.rotation.z,
    'scale.x': spec.scale.x,
    'scale.y': spec.scale.y,
    'scale.z': spec.scale.z,
    'shear.xy': spec.shear.xy,
    'shear.xz': spec.shear.xz,
    'shear.yz': spec.shear.yz,
    'sizeMode.x': spec.sizeMode.x,
    'sizeMode.y': spec.sizeMode.y,
    'sizeMode.z': spec.sizeMode.z,
    'sizeProportional.x': spec.sizeProportional.x,
    'sizeProportional.y': spec.sizeProportional.y,
    'sizeProportional.z': spec.sizeProportional.z,
    'sizeDifferential.x': spec.sizeDifferential.x,
    'sizeDifferential.y': spec.sizeDifferential.y,
    'sizeDifferential.z': spec.sizeDifferential.z,
    'sizeAbsolute.x': spec.sizeAbsolute.x,
    'sizeAbsolute.y': spec.sizeAbsolute.y,
    'sizeAbsolute.z': spec.sizeAbsolute.z
  }
}

/**
 * Used for rendering human-friendly cluster property headings in the Timeline UI
 */
Property.PREFIX_TO_CLUSTER_NAME = {
  'mount': 'Mount',
  'offset': 'Offset',
  'origin': 'Origin',
  'translation': 'Position',
  'rotation': 'Rotation',
  'scale': 'Scale',
  'shear': 'Shear',
  'sizeMode': 'Sizing Mode',
  'sizeProportional': 'Size %',
  'sizeDifferential': 'Size +/-',
  'sizeAbsolute': 'Size',
  'overflow': 'Overflow',
  'style': 'Style'
}

/**
 * Used for rendering human-friendly property labels in the Timeline UI
 */
Property.HUMANIZED_PROP_NAMES = {
  'rotation.z': 'Rotation Z',
  'rotation.y': 'Rotation Y',
  'rotation.x': 'Rotation X',
  'shear.xy': 'Shear X / Y',
  'shear.xz': 'Shear X / Z',
  'shear.yz': 'Shear Y / Z',
  'translation.x': 'Position X',
  'translation.y': 'Position Y',
  'translation.z': 'Position Z',
  'sizeAbsolute.x': 'Size X',
  'sizeAbsolute.y': 'Size Y',
  'style.overflowX': 'Overflow X',
  'style.overflowY': 'Overflow Y',
  'origin.x': 'Origin X',
  'origin.y': 'Origin Y'
}

/**
 * Pruned-down enumeration of properties that can be applied to various DOM element types.
 * Unlike the property enumerations in @haiku/core, this dictionary only holds properties
 * that are usable in Haiku Desktop. Additional display precedence rules may effect whether
 * these ultimately display in the Timeline UI, but this is the foundation.
 */
Property.BUILTIN_DOM_SCHEMAS = {
  div: {
    'sizeAbsolute.x': 'number',
    'sizeAbsolute.y': 'number',
    'playback': 'any',
    'controlFlow.placeholder': 'any',
    'controlFlow.repeat': 'any',
    'controlFlow.if': 'any',
    opacity: 'number',
    'translation.x': 'number',
    'translation.y': 'number',
    'translation.z': 'number',
    'rotation.x': 'number',
    'rotation.y': 'number',
    'rotation.z': 'number',
    'scale.x': 'number',
    'scale.y': 'number',
    'origin.x': 'number',
    'origin.y': 'number',
    'shear.xy': 'number',
    'shear.xz': 'number',
    'shear.yz': 'number',
    'style.background': 'string',
    'style.backgroundColor': 'string',
    'style.border': 'string',
    'style.borderBottom': 'string',
    'style.borderLeft': 'string',
    'style.borderRight': 'string',
    'style.borderTop': 'string',
    'style.color': 'string',
    'style.cursor': 'string',
    'style.fontFamily': 'string',
    'style.fontSize': 'string',
    'style.fontStyle': 'string',
    'style.fontWeight': 'string',
    'style.overflowY': 'string',
    'style.overflowX': 'string',
    'style.textTransform': 'string',
    'style.pointerEvents': 'string',
    'style.perspective': 'string',
    'style.transformStyle': 'string',
    'style.verticalAlign': 'string',
    'style.zIndex': 'number',
    'style.WebkitTapHighlightColor': 'string'
  },
  svg: {
    'controlFlow.placeholder': 'any',
    'controlFlow.repeat': 'any',
    'controlFlow.if': 'any',
    opacity: 'number',
    'translation.x': 'number',
    'translation.y': 'number',
    'translation.z': 'number',
    'rotation.x': 'number',
    'rotation.y': 'number',
    'rotation.z': 'number',
    'scale.x': 'number',
    'scale.y': 'number',
    'shear.xy': 'number',
    'shear.xz': 'number',
    'shear.yz': 'number',
    'origin.x': 'number',
    'origin.y': 'number',
    'style.border': 'string',
    'style.borderBottom': 'string',
    'style.borderLeft': 'string',
    'style.borderRight': 'string',
    'style.borderTop': 'string',
    'style.color': 'string',
    'style.cursor': 'string',
    'style.pointerEvents': 'string',
    'style.zIndex': 'number',
    'style.WebkitTapHighlightColor': 'string'
  },
  g: {},
  circle: {
    r: 'string',
    cx: 'string',
    cy: 'string',
    stroke: 'string',
    strokeWidth: 'string',
    strokeOpacity: 'string',
    fill: 'string',
    fillRule: 'string',
    fillOpacity: 'string'
  },
  ellipse: {
    rx: 'string',
    ry: 'string',
    cx: 'string',
    cy: 'string',
    stroke: 'string',
    strokeWidth: 'string',
    strokeOpacity: 'string',
    fill: 'string',
    fillRule: 'string',
    fillOpacity: 'string'
  },
  rect: {
    rx: 'string',
    ry: 'string',
    stroke: 'string',
    strokeWidth: 'string',
    strokeOpacity: 'string',
    fill: 'string',
    fillRule: 'string',
    fillOpacity: 'string'
  },
  line: {
    x1: 'string',
    y1: 'string',
    x2: 'string',
    y2: 'string',
    stroke: 'string',
    strokeWidth: 'string',
    strokeOpacity: 'string'
  },
  polyline: {
    points: 'string',
    stroke: 'string',
    strokeWidth: 'string',
    strokeOpacity: 'string',
    fill: 'string',
    fillRule: 'string',
    fillOpacity: 'string'
  },
  polygon: {
    points: 'string',
    stroke: 'string',
    strokeWidth: 'string',
    strokeOpacity: 'string',
    fill: 'string',
    fillRule: 'string',
    fillOpacity: 'string'
  },
  path: {
    d: 'string',
    stroke: 'string',
    strokeWidth: 'string',
    strokeOpacity: 'string',
    fill: 'string',
    fillRule: 'string',
    fillOpacity: 'string'
  },
  text: {
    x: 'string',
    y: 'string',
    stroke: 'string',
    strokeWidth: 'string',
    strokeOpacity: 'string',
    fill: 'string',
    fillRule: 'string',
    fillOpacity: 'string',
    fontFamily: 'string',
    fontSize: 'string',
    fontVariant: 'string',
    fontWeight: 'string',
    fontStyle: 'string',
    alignmentBaseline: 'string',
    textAnchor: 'string',
    letterSpacing: 'string',
    wordSpacing: 'string',
    kerning: 'string',
    content: 'string'
  },
  tspan: {
    x: 'string',
    y: 'string',
    stroke: 'string',
    strokeWidth: 'string',
    strokeOpacity: 'string',
    fill: 'string',
    fillRule: 'string',
    fillOpacity: 'string',
    fontFamily: 'string',
    fontSize: 'string',
    fontVariant: 'string',
    fontWeight: 'string',
    fontStyle: 'string',
    alignmentBaseline: 'string',
    textAnchor: 'string',
    letterSpacing: 'string',
    wordSpacing: 'string',
    kerning: 'string',
    content: 'string'
  },
  image: {
    href: 'string'
  },
  linearGradient: {
    x1: 'string',
    y1: 'string',
    x2: 'string',
    y2: 'string'
  },
  stop: {
    stopColor: 'string',
    offset: 'string'
  }
}

/**
 * Enumeration of SVG element types that may contain text content.
 */
Property.TEXT_FRIENDLY_SVG_ELEMENTS = {
  // Note that <desc> and <title>, while valid, are excluded to avoid noise
  text: true,
  textpath: true,
  textPath: true,
  tspan: true
}

/**
 * Enumeration of HTML element types that may contain text content.
 */
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

/**
 * A given mana payload can be converted into a componentization-ready bytecode object,
 * and this enum is used to specify attributes that hoist to become private states.
 */
Property.PRIVATE_PROPERTY_WHEN_HOISTING_TO_STATE = {
  'transform': true,
  'transformOrigin': true,
  'style.position': true,
  'style.display': true,
  'style.transform': true,
  'style.transformOrigin': true
}

/**
 * A given mana payload can be converted into a componentization-ready bytecode object,
 * and this enum is used to specify attributes that remain properties, not hoisted to states.
 */
Property.ALWAYS_CREATE_AS_PROPERTY_NEVER_AS_STATE = {
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
  'scale.x': true,
  'scale.y': true,
  'scale.z': true,
  'shear.xy': true,
  'shear.xz': true,
  'shear.yz': true,
  'offset.x': true,
  'offset.y': true,
  'offset.z': true,
  'origin.x': true,
  'origin.y': true,
  'origin.z': true,
  'opacity': true,
  'shown': true,
  'perspective': true, // Future proofing
  'style.zIndex': true // Many of these; avoid a bajillion zIndex_1, zIndex_2 states
}

Property.PREPOPULATED_VALUES = {
  'sizeMode.x': 1,
  'sizeMode.y': 1,
  'sizeMode.z': 1,
  'style.border': '0',
  'style.margin': '0',
  'style.padding': '0',
  'style.overflowX': 'hidden',
  'style.overflowY': 'hidden',
  'style.WebkitTapHighlightColor': 'rgba(0,0,0,0)',
  'style.backgroundColor': 'rgba(255,255,255,0)',
  'style.zIndex': 0 // Managed via stacking UI
}

const NEVER = () => false

const ALWAYS = () => true

const NON_ROOT_ONLY = (name, element) => {
  return !element.isRootElement()
}

const ROOT_ONLY = (name, element) => {
  return element.isRootElement()
}

const NON_COMPONENT_ONLY = (name, element) => {
  return !element.isComponent()
}

const COMPONENT_ONLY = (name, element) => {
  return element.isComponent()
}

const IF_EXPLICIT_OR_DEFINED = (name, element, property, keyframes) => {
  return (
    IF_EXPLICIT(name, element, property, keyframes) ||
    IF_DEFINED(name, element, property, keyframes)
  )
}

const IF_EXPLICIT = (name, element, property, keyframes) => {
  return !!element._visibleProperties[name]
}

const IF_DEFINED = (name, element, property, keyframes) => {
  return keyframes && Object.keys(keyframes).length > 0
}

const IF_NOT_NONE = (name, element, property, keyframes) => {
  if (!keyframes) {
    return false
  }

  if (keyframes.length > 1) {
    return true
  }

  const value = keyframes && keyframes[0] && keyframes[0].value
  return value !== 'none'
}

const IF_CHANGED_FROM_PREPOPULATED_VALUE = (name, element, property, keyframes) => {
  return wasChangedFromPrepopValue(name, keyframes)
}

const IF_IN_SCHEMA = (name, element) => {
  const elementName = element.getSafeDomFriendlyName()
  return hasInSchema(elementName, name)
}

const IF_TEXT_CONTENT_ENABLED = (name, element, property, keyframes) => {
  if (element.children.length < 1) {
    return true
  }

  // Sketch-produced SVGs often have <text><tspan>content, but since <text>
  // can also have raw content inside it, we do this check to exclude it if
  // it happens to contain an inner <tspan>
  if (typeof element.children[0] !== 'string') {
    return false
  }

  return true
}

const wasChangedFromPrepopValue = (name, keyframes) => {
  const fallback = Property.PREPOPULATED_VALUES[name]

  if (fallback === undefined) {
    return true
  }

  const value = keyframes && keyframes[0] && keyframes[0].value

  return (
    value !== undefined &&
    value !== fallback
  )
}

const hasInSchema = (elementName, propertyName) => {
  return (
    Property.BUILTIN_DOM_SCHEMAS[elementName] &&
    Property.BUILTIN_DOM_SCHEMAS[elementName][propertyName]
  )
}

Property.areAnyKeyframesDefined = (elementName, propertyName, keyframesObject) => {
  const mss = Object.keys(keyframesObject)

  // More than one keyframes always implies a keyframe has been set by the user
  if (mss.length > 1) {
    return true
  }

  // If the first keyframe isn't 0, that also implies a keyframe was set
  if (Number(mss[0]) !== 0) {
    return true
  }

  return wasChangedFromPrepopValue(propertyName, keyframesObject)
}

/**
 * Enumeration of display rules for properties which may be available for direct editing
 * inside the Timeline UI. A rule is an ordered sequence of display tests, which are functions
 * that return true if the property should be displayed in the scenario, or false if not.
 * All tests must evaluate to true in order for the property to be displayed.
 */
Property.DISPLAY_RULES = {
  'content': {jit: [NON_ROOT_ONLY, IF_IN_SCHEMA, IF_TEXT_CONTENT_ENABLED], add: [NON_ROOT_ONLY, IF_IN_SCHEMA, IF_TEXT_CONTENT_ENABLED]},
  'controlFlow.if': {
    jit: [(experimentIsEnabled(Experiment.ControlFlowIf)) ? NON_ROOT_ONLY : NEVER],
    add: [(experimentIsEnabled(Experiment.ControlFlowIf)) ? IF_EXPLICIT_OR_DEFINED : NEVER]
  },
  'controlFlow.repeat': {
    jit: [(experimentIsEnabled(Experiment.ControlFlowRepeat)) ? NON_ROOT_ONLY : NEVER],
    add: [(experimentIsEnabled(Experiment.ControlFlowRepeat)) ? IF_EXPLICIT_OR_DEFINED : NEVER]
  },
  'controlFlow.placeholder': {jit: [NON_ROOT_ONLY, NON_COMPONENT_ONLY], add: [IF_EXPLICIT_OR_DEFINED]},
  'haiku-id': {jit: [NEVER], add: [NEVER]},
  'haiku-source': {jit: [NEVER], add: [NEVER]},
  'haiku-title': {jit: [NEVER], add: [NEVER]},
  'haiku-var': {jit: [NEVER], add: [NEVER]},
  'height': {jit: [NEVER], add: [NEVER]},
  'offset.x': {jit: [NEVER], add: [IF_EXPLICIT_OR_DEFINED]},
  'offset.y': {jit: [NEVER], add: [IF_EXPLICIT_OR_DEFINED]},
  'offset.z': {jit: [NEVER], add: [IF_EXPLICIT_OR_DEFINED]},
  'opacity': {jit: [NEVER], add: [ALWAYS]},
  'origin.x': {jit: [NON_ROOT_ONLY], add: [NON_ROOT_ONLY]},
  'origin.y': {jit: [NON_ROOT_ONLY], add: [NON_ROOT_ONLY]},
  'origin.z': {jit: [NEVER], add: [NEVER]},
  'playback': {jit: [NEVER], add: [NON_ROOT_ONLY, COMPONENT_ONLY]},
  'rotation.x': {jit: [NON_ROOT_ONLY], add: [NON_ROOT_ONLY]},
  'rotation.y': {jit: [NON_ROOT_ONLY], add: [NON_ROOT_ONLY]},
  'rotation.z': {jit: [NON_ROOT_ONLY], add: [NON_ROOT_ONLY]},
  'scale.x': {jit: [NON_ROOT_ONLY], add: [NON_ROOT_ONLY]},
  'scale.y': {jit: [NON_ROOT_ONLY], add: [NON_ROOT_ONLY]},
  'scale.z': {jit: [NON_ROOT_ONLY], add: [NON_ROOT_ONLY]},
  'shear.xy': {jit: [NON_ROOT_ONLY], add: [NEVER]},
  'shear.xz': {jit: [NON_ROOT_ONLY], add: [NEVER]},
  'shear.yz': {jit: [NON_ROOT_ONLY], add: [NEVER]},
  'shown': {jit: [NEVER], add: [NEVER]},
  'sizeAbsolute.x': {jit: [NON_ROOT_ONLY, COMPONENT_ONLY], add: [ROOT_ONLY]},
  'sizeAbsolute.y': {jit: [NON_ROOT_ONLY, COMPONENT_ONLY], add: [ROOT_ONLY]},
  'sizeAbsolute.z': {jit: [NON_ROOT_ONLY, COMPONENT_ONLY], add: [ROOT_ONLY]},
  'sizeDifferential.x': {jit: [NEVER], add: [NEVER]},
  'sizeDifferential.y': {jit: [NEVER], add: [NEVER]},
  'sizeDifferential.z': {jit: [NEVER], add: [NEVER]},
  'sizeMode.x': {jit: [NEVER], add: [IF_CHANGED_FROM_PREPOPULATED_VALUE]},
  'sizeMode.y': {jit: [NEVER], add: [IF_CHANGED_FROM_PREPOPULATED_VALUE]},
  'sizeMode.z': {jit: [NEVER], add: [IF_CHANGED_FROM_PREPOPULATED_VALUE]},
  'sizeProportional.x': {jit: [NEVER], add: [NEVER]},
  'sizeProportional.y': {jit: [NEVER], add: [NEVER]},
  'sizeProportional.z': {jit: [NEVER], add: [NEVER]},
  'style.background': {jit: [ALWAYS], add: [NEVER]},
  'style.backgroundColor': {jit: [ALWAYS], add: [IF_CHANGED_FROM_PREPOPULATED_VALUE]},
  'style.border': {jit: [ALWAYS], add: [IF_CHANGED_FROM_PREPOPULATED_VALUE]},
  'style.borderBottom': {jit: [ALWAYS], add: [NEVER]},
  'style.borderLeft': {jit: [ALWAYS], add: [NEVER]},
  'style.borderRight': {jit: [ALWAYS], add: [NEVER]},
  'style.borderTop': {jit: [ALWAYS], add: [NEVER]},
  'style.color': {jit: [ALWAYS], add: [NEVER]},
  'style.cursor': {jit: [ALWAYS], add: [NEVER]},
  'style.fontFamily': {jit: [ALWAYS], add: [NEVER]},
  'style.fontSize': {jit: [ALWAYS], add: [NEVER]},
  'style.fontStyle': {jit: [ALWAYS], add: [NEVER]},
  'style.fontWeight': {jit: [ALWAYS], add: [NEVER]},
  'style.display': {jit: [NEVER], add: [NEVER]},
  'style.height': {jit: [NEVER], add: [NEVER]},
  'style.margin': {jit: [ALWAYS], add: [IF_CHANGED_FROM_PREPOPULATED_VALUE]},
  'style.overflowX': {jit: [ALWAYS], add: [IF_CHANGED_FROM_PREPOPULATED_VALUE]},
  'style.overflowY': {jit: [ALWAYS], add: [IF_CHANGED_FROM_PREPOPULATED_VALUE]},
  'style.padding': {jit: [ALWAYS], add: [IF_CHANGED_FROM_PREPOPULATED_VALUE]},
  'style.perspective': {jit: [ALWAYS], add: [NEVER]},
  'style.pointerEvents': {jit: [ALWAYS], add: [NEVER]},
  'style.position': {jit: [NEVER], add: [NEVER]},
  'style.textTransform': {jit: [ALWAYS], add: [NEVER]},
  'style.transform': {jit: [NEVER], add: [NEVER]},
  'style.transformOrigin': {jit: [NEVER], add: [NEVER]},
  'style.transformStyle': {jit: [ALWAYS], add: [NEVER]},
  'style.WebkitTapHighlightColor': {jit: [ALWAYS], add: [IF_CHANGED_FROM_PREPOPULATED_VALUE]},
  'style.width': {jit: [NEVER], add: [NEVER]},
  'style.verticalAlign': {jit: [ALWAYS], add: [NEVER]},
  'style.zIndex': {jit: [NON_ROOT_ONLY], add: [NON_ROOT_ONLY]},
  'transform': {jit: [NEVER], add: [NEVER]},
  'transformOrigin': {jit: [NEVER], add: [NEVER]},
  'translation.x': {jit: [NEVER], add: [NON_ROOT_ONLY]},
  'translation.y': {jit: [NEVER], add: [NON_ROOT_ONLY]},
  'translation.z': {jit: [NEVER], add: [NON_ROOT_ONLY]},
  'width': {jit: [NEVER], add: [NEVER]},
  // Primitives
  'alignmentBaseline': {jit: [IF_IN_SCHEMA], add: [IF_EXPLICIT]},
  'cx': {jit: [IF_IN_SCHEMA], add: [IF_EXPLICIT_OR_DEFINED]},
  'cy': {jit: [IF_IN_SCHEMA], add: [IF_EXPLICIT_OR_DEFINED]},
  'd': {jit: [IF_IN_SCHEMA], add: [IF_EXPLICIT_OR_DEFINED]},
  'fill': {jit: [IF_IN_SCHEMA], add: [IF_EXPLICIT_OR_DEFINED, IF_NOT_NONE]},
  'fillOpacity': {jit: [IF_IN_SCHEMA], add: [IF_EXPLICIT]},
  'fillRule': {jit: [IF_IN_SCHEMA], add: [IF_EXPLICIT]},
  'fontFamily': {jit: [IF_IN_SCHEMA], add: [IF_EXPLICIT_OR_DEFINED]},
  'fontSize': {jit: [IF_IN_SCHEMA], add: [IF_EXPLICIT]},
  'fontStyle': {jit: [IF_IN_SCHEMA], add: [IF_EXPLICIT]},
  'fontVariant': {jit: [IF_IN_SCHEMA], add: [IF_EXPLICIT]},
  'fontWeight': {jit: [IF_IN_SCHEMA], add: [IF_EXPLICIT]},
  'href': {jit: [IF_IN_SCHEMA], add: [IF_EXPLICIT_OR_DEFINED]},
  'kerning': {jit: [IF_IN_SCHEMA], add: [IF_EXPLICIT]},
  'letterSpacing': {jit: [IF_IN_SCHEMA], add: [IF_EXPLICIT]},
  'offset': {jit: [IF_IN_SCHEMA], add: [IF_EXPLICIT]},
  'points': {jit: [IF_IN_SCHEMA], add: [IF_EXPLICIT_OR_DEFINED]},
  'r': {jit: [IF_IN_SCHEMA], add: [IF_EXPLICIT_OR_DEFINED]},
  'rx': {jit: [IF_IN_SCHEMA], add: [IF_EXPLICIT_OR_DEFINED]},
  'ry': {jit: [IF_IN_SCHEMA], add: [IF_EXPLICIT_OR_DEFINED]},
  'stopColor': {jit: [IF_IN_SCHEMA], add: [IF_EXPLICIT]},
  'stroke': {jit: [IF_IN_SCHEMA], add: [IF_EXPLICIT_OR_DEFINED, IF_NOT_NONE]},
  'strokeOpacity': {jit: [IF_IN_SCHEMA], add: [IF_EXPLICIT]},
  'strokeWidth': {jit: [IF_IN_SCHEMA], add: [IF_EXPLICIT]},
  'textAnchor': {jit: [IF_IN_SCHEMA], add: [IF_EXPLICIT]},
  'wordSpacing': {jit: [IF_IN_SCHEMA], add: [IF_EXPLICIT]},
  'x': {jit: [IF_IN_SCHEMA], add: [IF_EXPLICIT_OR_DEFINED]},
  'y': {jit: [IF_IN_SCHEMA], add: [IF_EXPLICIT_OR_DEFINED]},
  'x1': {jit: [IF_IN_SCHEMA], add: [IF_EXPLICIT_OR_DEFINED]},
  'x2': {jit: [IF_IN_SCHEMA], add: [IF_EXPLICIT_OR_DEFINED]},
  'y1': {jit: [IF_IN_SCHEMA], add: [IF_EXPLICIT_OR_DEFINED]},
  'y2': {jit: [IF_IN_SCHEMA], add: [IF_EXPLICIT_OR_DEFINED]}
}

Property.includeInJIT = (name, element, property, keyframes) => {
  return Property.includeInDisplay('jit', name, element, property, keyframes)
}

Property.includeInAddressables = (name, element, property, keyframes) => {
  return Property.includeInDisplay('add', name, element, property, keyframes)
}

// Perform a series of truth-tests for the property which, if they all pass,
// indicate that the property should be displayed for the given element
Property.includeInDisplay = (type, name, element, property, keyframes) => {
  const rule = Property.DISPLAY_RULES[name]
  const tests = rule && rule[type]

  if (!tests) {
    return false
  }

  let include = true

  for (let i = 0; i < tests.length; i++) {
    // Early exit if we've found that one of the truth tests returned false
    if (!include) {
      break
    }

    include = tests[i](
      name,
      element,
      property,
      keyframes
    )
  }

  return include
}

Property.buildFilterObject = (
  filtered,
  hostElement,
  propertyName,
  propertyObject
) => {
  // Highest precedence is if the property is deemed explicitly visible;
  // Typically these get exposed when the user has selected via the JIT menu.
  // In this case we simply give the user what they've asked for.
  if (hostElement._visibleProperties[propertyName]) {
    filtered[propertyName] = propertyObject
    return
  }

  // If the property is a component state (exposed property), we absolutely want it.
  if (propertyObject.type === 'state') {
    filtered[propertyName] = propertyObject
    return
  }

  // For non-rendered components, the *only* thing we want are exposed properties (above)
  if (hostElement.isNonRenderedComponent()) {
    return
  }

  const keyframesObject = hostElement.getPropertyKeyframesObject(propertyName)
  const hasManyKeyframes = keyframesObject && Object.keys(keyframesObject).length > 1
  const hasOneKeyframe = keyframesObject && Object.keys(keyframesObject).length === 1
  const wasZerothKeyframeEdited = keyframesObject && keyframesObject[0] && keyframesObject[0].edited

  // If the property has any keyframes defined (or explicitly edited), then we show it.
  if (hasManyKeyframes) {
    filtered[propertyName] = propertyObject
    return
  }

  if (hasOneKeyframe && !keyframesObject[0]) {
    filtered[propertyName] = propertyObject
    return
  }

  if (wasZerothKeyframeEdited) {
    filtered[propertyName] = propertyObject
    return
  }

  // Finally, we drop through to custom per-property rules that may depend on the element type,
  // its location in the tree, or what the value of its property is.
  if (Property.includeInAddressables(propertyName, hostElement, propertyObject, keyframesObject)) {
    filtered[propertyName] = propertyObject
  }
}

module.exports = Property
