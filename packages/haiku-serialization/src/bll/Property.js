const decamelize = require('decamelize');
const titlecase = require('titlecase');
const {getFallback} = require('@haiku/core/lib/HaikuComponent');
const BaseModel = require('./BaseModel');
const {Experiment, experimentIsEnabled} = require('haiku-common/lib/experiments');

function decam (s) {
  return decamelize(s).replace(/[\W_]/g, ' ');
}

/**
 * @class Property
 * @description
 *  Collection of static class methods for dealing with component properties.
 */
class Property extends BaseModel {}

Property.DEFAULT_OPTIONS = {
  required: {},
};

BaseModel.extend(Property);

Property.assignDOMSchemaProperties = (out, element) => {
  const schema = Property.BUILTIN_DOM_SCHEMAS[element.getSafeDomFriendlyName()] || {};

  for (const name in schema) {
    let propertyGroup = null;

    const nameParts = name.split('.');

    const fallback = getFallback(element.getSafeDomFriendlyName(), name);

    propertyGroup = {
      type: 'native', // As opposed to a 'state' property like myStateFoo
      name,
      prefix: nameParts[0],
      suffix: nameParts[1],
      fallback,
      typedef: schema[name],
      mock: void (0),
      target: element, // For internal filtering convenience; do not remove
      value: void (0), // The component instance provides this, but we don't (or should we???)
    };

    // If we successfully created a property group, push it onto the list
    if (propertyGroup) {
      // If there are two name parts, we have a cluster, e.g. style.border
      if (nameParts[0] && nameParts[1]) {
        propertyGroup.cluster = {
          prefix: nameParts[0],
          name: Property.PREFIX_TO_CLUSTER_NAME[nameParts[0]] || nameParts[0],
        };
      }

      out[name] = propertyGroup;
    }
  }
};

Property.doesPropertyGroupContainRotation = (propertyGroup) => {
  return (
    propertyGroup['rotation.x'] ||
    propertyGroup['rotation.y'] ||
    propertyGroup['rotation.z']
  );
};

Property.sort = (a, b) => {
  return a.name > b.name;
};

Property.humanizePropertyName = (propertyName) => {
  if (Property.HUMANIZED_PROP_NAMES[propertyName]) {
    return Property.HUMANIZED_PROP_NAMES[propertyName];
  }
  return decam(propertyName);
};

Property.humanizePropertyNamePart = (propertyNamePart) => {
  if (Property.PREFIX_TO_CLUSTER_NAME[propertyNamePart]) {
    return Property.PREFIX_TO_CLUSTER_NAME[propertyNamePart];
  }
  return titlecase(decam(propertyNamePart));
};

Property.layoutSpecAsProperties = (spec) => {
  return {
    shown: spec.shown,
    opacity: spec.opacity,
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
    'sizeAbsolute.z': spec.sizeAbsolute.z,
  };
};

/**
 * Used for rendering human-friendly cluster property headings in the Timeline UI
 */
Property.PREFIX_TO_CLUSTER_NAME = {
  mount: 'Mount',
  offset: 'Offset',
  origin: 'Origin',
  translation: 'Position',
  rotation: 'Rotation',
  scale: 'Scale',
  shear: 'Shear',
  sizeMode: 'Sizing Mode',
  sizeProportional: 'Size %',
  sizeDifferential: 'Size +/-',
  sizeAbsolute: 'Size',
  overflow: 'Overflow',
  style: 'Style',
};

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
  'origin.y': 'Origin Y',
};

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
    playback: 'any',
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
    'style.WebkitTapHighlightColor': 'string',
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
    'style.WebkitTapHighlightColor': 'string',
  },
  g: {},
  circle: {
    r: 'string',
    cx: 'string',
    cy: 'string',
    stroke: 'string',
    strokeDasharray: 'string',
    strokeDashoffset: 'number',
    strokeWidth: 'string',
    strokeOpacity: 'string',
    fill: 'string',
    fillRule: 'string',
    fillOpacity: 'string',
  },
  ellipse: {
    rx: 'string',
    ry: 'string',
    cx: 'string',
    cy: 'string',
    stroke: 'string',
    strokeDasharray: 'string',
    strokeDashoffset: 'number',
    strokeWidth: 'string',
    strokeOpacity: 'string',
    fill: 'string',
    fillRule: 'string',
    fillOpacity: 'string',
  },
  rect: {
    rx: 'string',
    ry: 'string',
    stroke: 'string',
    strokeDasharray: 'string',
    strokeDashoffset: 'number',
    strokeWidth: 'string',
    strokeOpacity: 'string',
    fill: 'string',
    fillRule: 'string',
    fillOpacity: 'string',
    width: 'number',
    height: 'number',
  },
  line: {
    x1: 'string',
    y1: 'string',
    x2: 'string',
    y2: 'string',
    stroke: 'string',
    strokeDasharray: 'string',
    strokeDashoffset: 'number',
    strokeWidth: 'string',
    strokeOpacity: 'string',
  },
  polyline: {
    points: 'string',
    stroke: 'string',
    strokeDasharray: 'string',
    strokeDashoffset: 'number',
    strokeWidth: 'string',
    strokeOpacity: 'string',
    fill: 'string',
    fillRule: 'string',
    fillOpacity: 'string',
  },
  polygon: {
    points: 'string',
    stroke: 'string',
    strokeDasharray: 'string',
    strokeDashoffset: 'number',
    strokeWidth: 'string',
    strokeOpacity: 'string',
    fill: 'string',
    fillRule: 'string',
    fillOpacity: 'string',
  },
  path: {
    d: 'string',
    stroke: 'string',
    strokeDasharray: 'string',
    strokeDashoffset: 'number',
    strokeWidth: 'string',
    strokeOpacity: 'string',
    fill: 'string',
    fillRule: 'string',
    fillOpacity: 'string',
  },
  text: {
    x: 'string',
    y: 'string',
    stroke: 'string',
    strokeDasharray: 'string',
    strokeDashoffset: 'number',
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
    content: 'string',
  },
  tspan: {
    x: 'string',
    y: 'string',
    stroke: 'string',
    strokeDasharray: 'string',
    strokeDashoffset: 'number',
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
    content: 'string',
  },
  image: {
    href: 'string',
  },
  linearGradient: {
    x1: 'string',
    y1: 'string',
    x2: 'string',
    y2: 'string',
  },
  stop: {
    stopColor: 'string',
    offset: 'string',
  },
};

/**
 * Enumeration of SVG element types that may contain text content.
 */
Property.TEXT_FRIENDLY_SVG_ELEMENTS = {
  // Note that <desc> and <title>, while valid, are excluded to avoid noise
  text: true,
  textpath: true,
  textPath: true,
  tspan: true,
};

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
  style: true,
};

/**
 * A given mana payload can be converted into a componentization-ready bytecode object,
 * and this enum is used to specify attributes that hoist to become private states.
 */
Property.PRIVATE_PROPERTY_WHEN_HOISTING_TO_STATE = {
  transform: true,
  transformOrigin: true,
  'style.position': true,
  'style.display': true,
  'style.transform': true,
  'style.transformOrigin': true,
};

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
  'style.zIndex': 0, // Managed via stacking UI
  'translation.x': 0,
  'translation.y': 0,
  'translation.z': 0,
  'rotation.x': 0,
  'rotation.y': 0,
  'rotation.z': 0,
  'scale.x': 1,
  'scale.y': 1,
  'scale.z': 1,
  'shear.xy': 0,
  'shear.xz': 0,
  'shear.yz': 0,
  'offset.x': 0,
  'offset.y': 0,
  'offset.z': 0,
  'origin.x': 0.5,
  'origin.y': 0.5,
  'origin.z': 0.5,
  opacity: 1,
};

const NEVER = () => false;

const ALWAYS = () => true;

const NON_ROOT_ONLY = (name, element) => !element.isRootElement();

const ROOT_ONLY = (name, element) => element.isRootElement();

const NON_COMPONENT_ONLY = (name, element) => !element.isComponent();

const COMPONENT_ONLY = (name, element) => element.isComponent();

const ROOT_CHILD_ONLY = (name, element, property, keyframes) => element.isVisuallySelectable;

const IF_EXPLICIT_OR_DEFINED = (name, element, property, keyframes) => (
  IF_EXPLICIT(name, element, property, keyframes) ||
  IF_DEFINED(name, element, property, keyframes)
);

const IF_EXPLICIT = (name, element, property, keyframes) => !!element._visibleProperties[name];

const IF_DEFINED = (name, element, property, keyframes) => (
  keyframes && Object.values(keyframes).some((keyframe) => keyframe.edited)
);

const IF_CHANGED_FROM_PREPOPULATED_VALUE = (name, element, property, keyframes) => wasChangedFromPrepopValue(name, keyframes);

const IF_IN_SCHEMA = (name, element) => hasInSchema(element.getSafeDomFriendlyName(), name);

const IF_TEXT_CONTENT_ENABLED = (name, element, property, keyframes) => (
  element.children.length < 1 ||
  // Sketch-produced SVGs often have <text><tspan>content, but since <text>
  // can also have raw content inside it, we do this check to exclude it if
  // it happens to contain an inner <tspan>
  typeof element.children[0] === 'string'
);

const wasChangedFromPrepopValue = (name, keyframes) => {
  // In case there is no fallback, bail.
  if (Property.PREPOPULATED_VALUES[name] === undefined) {
    return true;
  }

  if (!keyframes) {
    return false;
  }

  const keys = Object.keys(keyframes);

  // Consider the prepolated value effectively changed…
  return (
    // If there is more than one key…
    keys.length > 1 ||
    (
      // …or if there is exactly one key…
      keys.length === 1 &&
      (
        // …which is either nonzero (this should never happen)…
        !keyframes[0] ||
        // …or different from the prepopulated value.
        keyframes[0].value !== Property.PREPOPULATED_VALUES[name]
      )
    )
  );
};

const hasInSchema = (elementName, propertyName) => (
  Property.BUILTIN_DOM_SCHEMAS[elementName] &&
  Property.BUILTIN_DOM_SCHEMAS[elementName][propertyName]
);

Property.areAnyKeyframesDefined = (elementName, propertyName, keyframesObject) => {
  const mss = Object.keys(keyframesObject);

  // More than one keyframes always implies a keyframe has been set by the user
  if (mss.length > 1) {
    return true;
  }

  // If the first keyframe isn't 0, that also implies a keyframe was set
  if (Number(mss[0]) !== 0) {
    return true;
  }

  return wasChangedFromPrepopValue(propertyName, keyframesObject);
};

/**
 * Enumeration of display rules for properties which may be available for direct editing
 * inside the Timeline UI. A rule is an ordered sequence of display tests, which are functions
 * that return true if the property should be displayed in the scenario, or false if not.
 * All tests must evaluate to true in order for the property to be displayed.
 */
Property.DISPLAY_RULES = {
  content: {jit: [NON_ROOT_ONLY, IF_IN_SCHEMA, IF_TEXT_CONTENT_ENABLED], add: [NON_ROOT_ONLY, IF_IN_SCHEMA, IF_TEXT_CONTENT_ENABLED]},
  'controlFlow.if': {
    jit: [NEVER],
    add: [NEVER],
  },
  'controlFlow.repeat': {
    jit: [NEVER],
    add: [NEVER],
  },
  'controlFlow.placeholder': {jit: [NON_ROOT_ONLY, NON_COMPONENT_ONLY], add: [IF_EXPLICIT_OR_DEFINED], keyframe: [ALWAYS]},
  height: {jit: [NEVER], add: [IF_DEFINED, IF_IN_SCHEMA], keyframe: [ALWAYS]},
  opacity: {jit: [NEVER], add: [ALWAYS], keyframe: [ALWAYS]},
  'origin.x': {jit: [ROOT_CHILD_ONLY], add: [ROOT_CHILD_ONLY, IF_CHANGED_FROM_PREPOPULATED_VALUE], keyframe: [ALWAYS]},
  'origin.y': {jit: [ROOT_CHILD_ONLY], add: [ROOT_CHILD_ONLY, IF_CHANGED_FROM_PREPOPULATED_VALUE], keyframe: [ALWAYS]},
  playback: {jit: [NEVER], add: [NON_ROOT_ONLY, COMPONENT_ONLY], keyframe: [ALWAYS]},
  'rotation.x': {jit: [ROOT_CHILD_ONLY], add: [ROOT_CHILD_ONLY, IF_CHANGED_FROM_PREPOPULATED_VALUE], keyframe: [ALWAYS]},
  'rotation.y': {jit: [ROOT_CHILD_ONLY], add: [ROOT_CHILD_ONLY, IF_CHANGED_FROM_PREPOPULATED_VALUE], keyframe: [ALWAYS]},
  'rotation.z': {jit: [ROOT_CHILD_ONLY], add: [ROOT_CHILD_ONLY, IF_CHANGED_FROM_PREPOPULATED_VALUE], keyframe: [ALWAYS]},
  'scale.x': {jit: [ROOT_CHILD_ONLY], add: [ROOT_CHILD_ONLY, IF_CHANGED_FROM_PREPOPULATED_VALUE], keyframe: [ALWAYS]},
  'scale.y': {jit: [ROOT_CHILD_ONLY], add: [ROOT_CHILD_ONLY, IF_CHANGED_FROM_PREPOPULATED_VALUE], keyframe: [ALWAYS]},
  'scale.z': {jit: [NEVER], add: [ROOT_CHILD_ONLY, IF_CHANGED_FROM_PREPOPULATED_VALUE], keyframe: [ALWAYS]},
  'shear.xy': {jit: [NEVER], add: [ROOT_CHILD_ONLY, IF_CHANGED_FROM_PREPOPULATED_VALUE], keyframe: [ALWAYS]},
  'shear.xz': {jit: [NEVER], add: [ROOT_CHILD_ONLY, IF_CHANGED_FROM_PREPOPULATED_VALUE], keyframe: [ALWAYS]},
  'shear.yz': {jit: [NEVER], add: [ROOT_CHILD_ONLY, IF_CHANGED_FROM_PREPOPULATED_VALUE], keyframe: [ALWAYS]},
  'sizeAbsolute.x': {jit: [NON_ROOT_ONLY, COMPONENT_ONLY], add: [ROOT_ONLY], keyframe: [NON_ROOT_ONLY]},
  'sizeAbsolute.y': {jit: [NON_ROOT_ONLY, COMPONENT_ONLY], add: [ROOT_ONLY], keyframe: [NON_ROOT_ONLY]},
  'sizeAbsolute.z': {jit: [NON_ROOT_ONLY, COMPONENT_ONLY], add: [ROOT_ONLY], keyframe: [NON_ROOT_ONLY]},
  'style.background': {jit: [ALWAYS], add: [NEVER], keyframe: [ALWAYS]},
  'style.backgroundColor': {jit: [ALWAYS], add: [IF_CHANGED_FROM_PREPOPULATED_VALUE], keyframe: [ALWAYS]},
  'style.border': {jit: [NEVER], add: [IF_CHANGED_FROM_PREPOPULATED_VALUE], keyframe: [ALWAYS]},
  'style.cursor': {jit: [ALWAYS], add: [NEVER], keyframe: [ALWAYS]},
  'style.fontFamily': {jit: [ALWAYS], add: [NEVER], keyframe: [ALWAYS]},
  'style.fontSize': {jit: [ALWAYS], add: [NEVER], keyframe: [ALWAYS]},
  'style.fontStyle': {jit: [ALWAYS], add: [NEVER], keyframe: [ALWAYS]},
  'style.fontWeight': {jit: [ALWAYS], add: [NEVER], keyframe: [ALWAYS]},
  'style.margin': {jit: [ALWAYS], add: [IF_CHANGED_FROM_PREPOPULATED_VALUE], keyframe: [ALWAYS]},
  'style.overflowX': {jit: [ALWAYS], add: [IF_CHANGED_FROM_PREPOPULATED_VALUE], keyframe: [ALWAYS]},
  'style.overflowY': {jit: [ALWAYS], add: [IF_CHANGED_FROM_PREPOPULATED_VALUE], keyframe: [ALWAYS]},
  'style.padding': {jit: [ALWAYS], add: [IF_CHANGED_FROM_PREPOPULATED_VALUE], keyframe: [ALWAYS]},
  'style.perspective': {jit: [ALWAYS], add: [NEVER], keyframe: [ALWAYS]},
  'style.pointerEvents': {jit: [ALWAYS], add: [NEVER], keyframe: [ALWAYS]},
  'style.textTransform': {jit: [ALWAYS], add: [NEVER], keyframe: [ALWAYS]},
  'style.transformStyle': {jit: [ALWAYS], add: [NEVER], keyframe: [ALWAYS]},
  'style.WebkitTapHighlightColor': {jit: [NEVER], add: [IF_CHANGED_FROM_PREPOPULATED_VALUE], keyframe: [ALWAYS]},
  'style.verticalAlign': {jit: [ALWAYS], add: [NEVER], keyframe: [ALWAYS]},
  'style.zIndex': {jit: [NON_ROOT_ONLY], add: [NON_ROOT_ONLY], keyframe: [ALWAYS]},
  'translation.x': {jit: [ROOT_CHILD_ONLY], add: [ROOT_CHILD_ONLY, IF_CHANGED_FROM_PREPOPULATED_VALUE], keyframe: [ALWAYS]},
  'translation.y': {jit: [ROOT_CHILD_ONLY], add: [ROOT_CHILD_ONLY, IF_CHANGED_FROM_PREPOPULATED_VALUE], keyframe: [ALWAYS]},
  'translation.z': {jit: [ROOT_CHILD_ONLY], add: [ROOT_CHILD_ONLY, IF_CHANGED_FROM_PREPOPULATED_VALUE], keyframe: [ALWAYS]},
  width: {jit: [NEVER], add: [IF_DEFINED, IF_IN_SCHEMA], keyframe: [ALWAYS]},
  // Primitives
  alignmentBaseline: {jit: [IF_IN_SCHEMA], add: [IF_EXPLICIT], keyframe: [ALWAYS]},
  cx: {jit: [IF_IN_SCHEMA], add: [IF_EXPLICIT_OR_DEFINED], keyframe: [ALWAYS]},
  cy: {jit: [IF_IN_SCHEMA], add: [IF_EXPLICIT_OR_DEFINED], keyframe: [ALWAYS]},
  d: {jit: [IF_IN_SCHEMA], add: [IF_EXPLICIT_OR_DEFINED], keyframe: [ALWAYS]},
  fill: {jit: [IF_IN_SCHEMA], add: [IF_EXPLICIT_OR_DEFINED], keyframe: [ALWAYS]},
  fillOpacity: {jit: [IF_IN_SCHEMA], add: [IF_EXPLICIT], keyframe: [ALWAYS]},
  fillRule: {jit: [IF_IN_SCHEMA], add: [IF_EXPLICIT], keyframe: [ALWAYS]},
  fontFamily: {jit: [IF_IN_SCHEMA], add: [IF_EXPLICIT_OR_DEFINED], keyframe: [ALWAYS]},
  fontSize: {jit: [IF_IN_SCHEMA], add: [IF_EXPLICIT], keyframe: [ALWAYS]},
  fontStyle: {jit: [IF_IN_SCHEMA], add: [IF_EXPLICIT], keyframe: [ALWAYS]},
  fontVariant: {jit: [IF_IN_SCHEMA], add: [IF_EXPLICIT], keyframe: [ALWAYS]},
  fontWeight: {jit: [IF_IN_SCHEMA], add: [IF_EXPLICIT], keyframe: [ALWAYS]},
  href: {jit: [IF_IN_SCHEMA], add: [IF_EXPLICIT_OR_DEFINED], keyframe: [ALWAYS]},
  kerning: {jit: [IF_IN_SCHEMA], add: [IF_EXPLICIT], keyframe: [ALWAYS]},
  letterSpacing: {jit: [IF_IN_SCHEMA], add: [IF_EXPLICIT], keyframe: [ALWAYS]},
  offset: {jit: [IF_IN_SCHEMA], add: [IF_EXPLICIT], keyframe: [ALWAYS]},
  points: {jit: [IF_IN_SCHEMA], add: [IF_EXPLICIT_OR_DEFINED], keyframe: [ALWAYS]},
  r: {jit: [IF_IN_SCHEMA], add: [IF_EXPLICIT_OR_DEFINED], keyframe: [ALWAYS]},
  rx: {jit: [IF_IN_SCHEMA], add: [IF_EXPLICIT_OR_DEFINED], keyframe: [ALWAYS]},
  ry: {jit: [IF_IN_SCHEMA], add: [IF_EXPLICIT_OR_DEFINED], keyframe: [ALWAYS]},
  stopColor: {jit: [IF_IN_SCHEMA], add: [IF_EXPLICIT], keyframe: [ALWAYS]},
  stroke: {jit: [IF_IN_SCHEMA], add: [IF_EXPLICIT_OR_DEFINED], keyframe: [ALWAYS]},
  strokeDasharray: {jit: [IF_IN_SCHEMA], add: [IF_EXPLICIT_OR_DEFINED], keyframe: [ALWAYS]},
  strokeDashoffset: {jit: [IF_IN_SCHEMA], add: [IF_EXPLICIT_OR_DEFINED], keyframe: [ALWAYS]},
  strokeOpacity: {jit: [IF_IN_SCHEMA], add: [IF_EXPLICIT], keyframe: [ALWAYS]},
  strokeWidth: {jit: [IF_IN_SCHEMA], add: [IF_EXPLICIT], keyframe: [ALWAYS]},
  textAnchor: {jit: [IF_IN_SCHEMA], add: [IF_EXPLICIT], keyframe: [ALWAYS]},
  wordSpacing: {jit: [IF_IN_SCHEMA], add: [IF_EXPLICIT], keyframe: [ALWAYS]},
  x: {jit: [IF_IN_SCHEMA], add: [IF_EXPLICIT_OR_DEFINED], keyframe: [ALWAYS]},
  y: {jit: [IF_IN_SCHEMA], add: [IF_EXPLICIT_OR_DEFINED], keyframe: [ALWAYS]},
  x1: {jit: [IF_IN_SCHEMA], add: [IF_EXPLICIT_OR_DEFINED], keyframe: [ALWAYS]},
  x2: {jit: [IF_IN_SCHEMA], add: [IF_EXPLICIT_OR_DEFINED], keyframe: [ALWAYS]},
  y1: {jit: [IF_IN_SCHEMA], add: [IF_EXPLICIT_OR_DEFINED], keyframe: [ALWAYS]},
  y2: {jit: [IF_IN_SCHEMA], add: [IF_EXPLICIT_OR_DEFINED]},
};

Property.includeInJIT = (name, element, property, keyframes) => {
  return Property.includeInDisplay('jit', name, element, property, keyframes);
};

Property.includeInAddressables = (name, element, property, keyframes) => {
  return Property.includeInDisplay('add', name, element, property, keyframes);
};

Property.canHaveKeyframes = (name, element, property, keyframes) => {
  return Property.includeInDisplay('keyframe', name, element, property, keyframes);
};

// Perform a series of truth-tests for the property which, if they all pass,
// indicate that the property should be displayed for the given element
Property.includeInDisplay = (type, name, element, property, keyframes) => {
  const rule = Property.DISPLAY_RULES[name];
  return rule && rule[type] && rule[type].every((test) => test(name, element, property, keyframes));
};

Property.WITH_COLOR_POPUP = new Set([
  'style.stroke',
  'style.fill',
  'style.background',
  'style.backgroundColor',
  'style.borderBottomColor',
  'style.borderColor',
  'style.borderLeftColor',
  'style.borderRightColor',
  'style.borderTopColor',
  'style.floodColor',
  'style.lightingColor',
  'style.stopColor',
  'stroke',
  'fill',
  'floodColor',
  'lightingColor',
  'stopColor',
  'backgroundColor',
  'animateColor',
  'feColor',
]);

Property.hasColorPopup = (propertyName) => {
  return Property.WITH_COLOR_POPUP.has(propertyName);
};

const ROTATION_PI = Number(Math.PI.toFixed(2));

Property.WITH_RANGE_POPUP = {
  opacity: {max: 1, min: 0, step: 0.1},
  'rotation.x': {max: ROTATION_PI, min: -ROTATION_PI, step: 0.1},
  'rotation.y': {max: ROTATION_PI, min: -ROTATION_PI, step: 0.1},
  'rotation.z': {max: ROTATION_PI, min: -ROTATION_PI, step: 0.1},
};

Property.hasRangePopup = (propertyName) => {
  return Property.WITH_RANGE_POPUP[propertyName];
};

Property.buildFilterObject = (
  filtered,
  hostElement,
  propertyName,
  propertyObject,
) => {
  // Highest precedence is if the property is deemed explicitly visible;
  // Typically these get exposed when the user has selected via the JIT menu.
  // In this case we simply give the user what they've asked for.
  if (hostElement._visibleProperties[propertyName]) {
    filtered[propertyName] = propertyObject;
    return;
  }

  // If the property is a component state (exposed property), we absolutely want it.
  if (propertyObject.type === 'state') {
    filtered[propertyName] = propertyObject;
    return;
  }

  // For non-rendered components, the *only* thing we want are exposed properties (above)
  if (hostElement.isNonRenderedComponent()) {
    return;
  }

  // Check our custom per-property rules to determine if a row should be hydrated.
  if (
    Property.includeInAddressables(
      propertyName,
      hostElement,
      propertyObject,
      hostElement.getPropertyKeyframesObject(propertyName),
    )
  ) {
    filtered[propertyName] = propertyObject;
  }
};

module.exports = Property;
