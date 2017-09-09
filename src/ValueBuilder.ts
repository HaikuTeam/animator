/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

import Transitions from "./Transitions"
import BasicUtils from "./helpers/BasicUtils"
import DOMSchema from "./properties/dom/schema"
import DOMValueParsers from "./properties/dom/parsers"
import enhance from "./reflection/enhance"
import HaikuHelpers from "./HaikuHelpers"
import assign from "./vendor/assign"

const FUNCTION = "function"
const OBJECT = "object"

function isFunction(value) {
  return typeof value === FUNCTION
}

const INJECTABLES = {}

if (typeof window !== "undefined") {
  INJECTABLES['$window'] = {
    schema: {
      width: "number",
      height: "number",
      screen: {
        availHeight: "number",
        availLeft: "number",
        availWidth: "number",
        colorDepth: "number",
        height: "number",
        pixelDepth: "number",
        width: "number",
        orientation: {
          angle: "number",
          type: "string",
        },
      },
      navigator: {
        userAgent: "string",
        appCodeName: "string",
        appName: "string",
        appVersion: "string",
        cookieEnabled: "boolean",
        doNotTrack: "boolean",
        language: "string",
        maxTouchPoints: "number",
        onLine: "boolean",
        platform: "string",
        product: "string",
        vendor: "string",
      },
      document: {
        charset: "string",
        compatMode: "string",
        contentType: "string",
        cookie: "string",
        documentURI: "string",
        fullscreen: "boolean",
        readyState: "number",
        referrer: "string",
        title: "string",
      },
      location: {
        hash: "string",
        host: "string",
        hostname: "string",
        href: "string",
        pathname: "string",
        protocol: "string",
        search: "string",
      },
    },
    summon(injectees, summonSpec) {
      if (!injectees.$window) injectees.$window = {}
      let out = injectees.$window

      out.width = window.innerWidth
      out.height = window.innerHeight
      if (window.screen) {
        if (!out.screen) out.screen = {}
        out.screen.availHeight = window.screen['availHeight']
        out.screen.availLeft = window.screen['availLeft']
        out.screen.availWidth = window.screen['availWidth']
        out.screen.colorDepth = window.screen['colorDepth']
        out.screen.height = window.screen['height']
        out.screen.pixelDepth = window.screen['pixelDepth']
        out.screen.width = window.screen['width']
        if (window.screen['orientation']) {
          if (!out.screen.orientation) out.screen.orientation = {}
          out.screen.orientation.angle = window.screen['orientation'].angle
          out.screen.orientation.type = window.screen['orientation'].type
        }
      }
      if (typeof navigator !== "undefined") {
        if (!out.navigator) out.navigator = {}
        out.navigator.userAgent = navigator.userAgent
        out.navigator.appCodeName = navigator.appCodeName
        out.navigator.appName = navigator.appName
        out.navigator.appVersion = navigator.appVersion
        out.navigator.cookieEnabled = navigator.cookieEnabled
        out.navigator.doNotTrack = navigator['doNotTrack']
        out.navigator.language = navigator.language
        out.navigator.maxTouchPoints = navigator.maxTouchPoints
        out.navigator.onLine = navigator.onLine
        out.navigator.platform = navigator.platform
        out.navigator.product = navigator.product
        out.navigator.userAgent = navigator.userAgent
        out.navigator.vendor = navigator.vendor
      }
      if (window.document) {
        if (!out.document) out.document = {}
        out.document.charset = window.document.charset
        out.document.compatMode = window.document.compatMode
        out.document.contenttype = window.document['contentType']
        out.document.cookie = window.document.cookie
        out.document.documentURI = window.document['documentURI']
        out.document.fullscreen = window.document['fullscreen']
        out.document.readyState = window.document.readyState
        out.document.referrer = window.document.referrer
        out.document.title = window.document.title
      }
      if (window.location) {
        if (!out.location) out.location = {}
        out.location.hash = window.location.hash
        out.location.host = window.location.host
        out.location.hostname = window.location.hostname
        out.location.href = window.location.href
        out.location.pathname = window.location.pathname
        out.location.protocol = window.location.protocol
        out.location.search = window.location.search
      }
    },
  }
}

if (typeof global !== "undefined") {
  INJECTABLES['$global'] = {
    schema: {
      process: {
        pid: "number",
        arch: "string",
        platform: "string",
        argv: ["string"],
        title: "string",
        version: "string",
        env: {}, // Worth explicitly numerating these? #QUESTION
      },
    },
    summon(injectees, summonSpec) {
      if (!injectees.$global) injectees.$global = {}
      let out = injectees.$global

      if (typeof process !== "undefined") {
        if (!out.process) out.process = {}
        out.process.pid = process.pid
        out.process.arch = process.arch
        out.process.platform = process.platform
        out.process.argv = process.argv
        out.process.title = process.title
        out.process.version = process.version
        out.process.env = process.env
      }
    },
  }
}

INJECTABLES['$player'] = {
  schema: {
    version: "string",
    options: {
      seed: "string",
      loop: "boolean",
      sizing: "string",
      preserve3d: "boolean",
      position: "string",
      overflowX: "string",
      overflowY: "string",
    },
    timeline: {
      name: "string",
      duration: "number",
      repeat: "boolean",
      time: {
        apparent: "number",
        elapsed: "number",
        max: "number",
      },
      frame: {
        apparent: "number",
        elapsed: "number",
      },
    },
    clock: {
      frameDuration: "number",
      frameDelay: "number",
      time: {
        apparent: "number",
        elapsed: "number",
      },
    },
  },
  summon(injectees, summonSpec, hostInstance, matchingElement, timelineName) {
    if (!injectees.$player) injectees.$player = {}
    let out = injectees.$player

    out.version = hostInstance._context.PLAYER_VERSION
    let options = hostInstance._context.config.options
    if (options) {
      if (!out.options) out.options = {}
      out.options.seed = options.seed
      out.options.loop = options.loop
      out.options.sizing = options.sizing
      out.options.preserve3d = options.preserve3d
      out.options.position = options.position
      out.options.overflowX = options.overflowX
      out.options.overflowY = options.overflowY
    }
    let timelineInstance = hostInstance.getTimeline(timelineName)
    if (timelineInstance) {
      if (!out.timeline) out.timeline = {}
      out.timeline.name = timelineName
      out.timeline.duration = timelineInstance.getDuration()
      out.timeline.repeat = timelineInstance.getRepeat()
      if (!out.timeline.time) out.timeline.time = {}
      out.timeline.time.apparent = timelineInstance.getTime()
      out.timeline.time.elapsed = timelineInstance.getElapsedTime()
      out.timeline.time.max = timelineInstance.getMaxTime()
      if (!out.timeline.frame) out.timeline.frame = {}
      out.timeline.frame.apparent = timelineInstance.getFrame()
      out.timeline.frame.elapsed = timelineInstance.getUnboundedFrame()
    }
    let clockInstance = hostInstance.getClock()
    if (clockInstance) {
      if (!out.clock) out.clock = {}
      out.clock.frameDuration = clockInstance.options.frameDuration
      out.clock.frameDelay = clockInstance.options.frameDelay
      if (!out.clock.time) out.clock.time = {}
      out.clock.time.apparent = clockInstance.getExplicitTime()
      out.clock.time.elapsed = clockInstance.getRunningTime()
    }
  },
}

const EVENT_SCHEMA = {
  mouse: {
    x: "number",
    y: "number",
    isDown: "boolean",
  },
  touches: [{
    x: "number",
    y: "number",
  }],
  mouches: [{
    x: "number",
    y: "number",
  }],
  keys: [{
    which: "number",
    code: "number", // alias for 'which'
  }],
  // TODO:
  // accelerometer
  // compass
  // mic
  // camera
}

const ELEMENT_SCHEMA = {
  // A function in the schema indicates that schema is dynamic, dependent on some external information
  properties(element) {
    let defined = DOMSchema[element.elementName]
    if (!defined) {
      console.warn("[haiku player] element " + element.elementName + " has no schema defined")
      return {}
    }
    return defined
  },

  // TODO
  // bbox: {
  //   x: 'number',
  //   y: 'number',
  //   width: 'number',
  //   height: 'number'
  // },

  // TODO
  // events: EVENT_SCHEMA
}

function assignElementInjectables(obj, key, summonSpec, hostInstance, element) {
  // If for some reason no element, nothing to do
  if (!element) {
    return {}
  }

  // For some reason we get string elements here #FIXME
  if (typeof element === "string") {
    return {}
  }

  obj[key] = {}
  let out = obj[key]

  // It's not clear yet when we need fallbacks
  // var fallbacks = DOMFallbacks[element.elementName]
  // if (!fallbacks) {
  //   console.warn('[haiku player] element ' + element.elementName + ' has no fallbacks defined')
  //   return {}
  // }

  out.properties = {
    name: null,
    attributes: null
  }

  out.properties.name = element.elementName
  out.properties.attributes = element.attributes

  if (element.layout.computed) {
    out.properties.matrix = element.layout.computed.matrix
    out.properties.size = element.layout.computed.size
  }

  out.properties.align = element.layout.align
  out.properties.mount = element.layout.mount
  out.properties.opacity = element.layout.opacity
  out.properties.origin = element.layout.origin
  out.properties.rotation = element.layout.rotation
  out.properties.scale = element.layout.scale
  out.properties.shown = element.layout.shown
  out.properties.sizeAbsolute = element.layout.sizeAbsolute
  out.properties.sizeDifferential = element.layout.sizeDifferential
  out.properties.sizeMode = element.layout.sizeMode
  out.properties.sizeProportional = element.layout.sizeProportional
  out.properties.translation = element.layout.translation

  // TODO
  // defineProperty so that the calc happens lazily
  // Object.defineProperty(out, 'bbox', {
  //   get: function _get () {
  //     return hostInstance._context._getElementBBox(element)
  //   }
  // })

  // TODO
  // out.events = hostInstance._context.getElementEvents(element)
}

INJECTABLES['$tree'] = {
  schema: {
    // Unique to $tree
    parent: ELEMENT_SCHEMA,
    children: [ELEMENT_SCHEMA],
    siblings: [ELEMENT_SCHEMA],
    // Aliases for convenience
    component: ELEMENT_SCHEMA,
    root: ELEMENT_SCHEMA, // root at runtime
    element: ELEMENT_SCHEMA, // same as $element
  },
  summon(injectees, summonSpec, hostInstance, matchingElement) {
    if (!injectees.$tree) injectees.$tree = {}

    injectees.$tree.siblings = [] // Provide an array even if no siblings in case user tries to access

    injectees.$tree.parent = null

    if (matchingElement.__parent) {
      let subspec0 = (typeof summonSpec === "string") ? summonSpec : (summonSpec.$tree && summonSpec.$tree.parent)
      assignElementInjectables(injectees.$tree, "parent", subspec0, hostInstance, matchingElement.__parent)

      for (let i = 0; i < matchingElement.__parent.children.length; i++) {
        let sibling = matchingElement.__parent.children[i]
        let subspec1 = (typeof summonSpec === "string")
          ? summonSpec
          : summonSpec.$tree && summonSpec.$tree.siblings && summonSpec.$tree.siblings[i]
        assignElementInjectables(injectees.$tree.siblings, i, subspec1, hostInstance, sibling)
      }
    }

    injectees.$tree.children = [] // Provide an array even if no children in case user tries to access

    if (matchingElement.children) {
      for (let j = 0; j < matchingElement.children.length; j++) {
        let child = matchingElement.children[j]
        let subspec2 = (typeof summonSpec === "string")
          ? summonSpec
          : summonSpec.$tree && summonSpec.$tree.children && summonSpec.$tree.children[j]
        assignElementInjectables(injectees.$tree.children, j, subspec2, hostInstance, child)
      }
    }

    // May as well make use of the implementation we have for the aliases,
    // and avoid recalc if it's already been added:

    if (!injectees.$component) {
      INJECTABLES['$component'].summon(injectees, summonSpec, hostInstance, matchingElement)
    }

    injectees.$tree.component = injectees.$component

    if (!injectees.$root) {
      INJECTABLES['$root'].summon(injectees, summonSpec, hostInstance, matchingElement)
    }

    injectees.$tree.root = injectees.$root

    if (!injectees.$element) {
      INJECTABLES['$element'].summon(injectees, summonSpec, hostInstance, matchingElement)
    }

    injectees.$tree.element = injectees.$element
  },
}

// (top-level Element of a given component, (i.e. tranverse tree upward past groups but
// stop at first component definition))
INJECTABLES['$component'] = {
  schema: ELEMENT_SCHEMA,
  summon(injectees, summonSpec, hostInstance) {
    // Don't double-recalc this if it's already shown to be present in $tree
    if (injectees.$tree && injectees.$tree.component) {
      injectees.$component = injectees.$tree.component
    } else {
      let subspec = (typeof summonSpec === "string") ? summonSpec : summonSpec.$component
      assignElementInjectables(injectees, "$component", subspec, hostInstance, hostInstance._getTopLevelElement())
    }
  },
}

// absolute root of component tree (but does not traverse host codebase DOM)
// i.e. if Haiku components are nested. Until we support nested components,
// $root will be the same as $component
INJECTABLES['$root'] = {
  schema: ELEMENT_SCHEMA,
  summon(injectees, summonSpec, hostInstance, matchingElement) {
    // Don't double-recalc this if it's already shown to be present in $tree
    if (injectees.$tree && injectees.$tree.root) {
      injectees.$root = injectees.$tree.root
    } else {
      // Until we support nested components, $root resolves to $component
      let subspec = (typeof summonSpec === "string") ? summonSpec : summonSpec.$root
      assignElementInjectables(injectees, "$root", subspec, hostInstance, hostInstance._getTopLevelElement())
    }
  },
}

INJECTABLES['$element'] = {
  schema: ELEMENT_SCHEMA,
  summon(injectees, summonSpec, hostInstance, matchingElement) {
    // Don't double-recalc this if it's already shown to be present in $tree
    if (injectees.$tree && injectees.$tree.element) {
      injectees.$element = injectees.$tree.element
    } else {
      let subspec = (typeof summonSpec === "string") ? summonSpec : summonSpec.$element
      assignElementInjectables(injectees, "$element", subspec, hostInstance, matchingElement)
    }
  },
}

INJECTABLES['$user'] = {
  schema: assign({}, EVENT_SCHEMA),
  summon(injectees, summonSpec, hostInstance, matchingElement) {
    injectees.$user = hostInstance._context._getGlobalUserState()
  },
}

INJECTABLES['$flow'] = {
  schema: {
    repeat: {
      list: ["any"],
      index: "number",
      value: "any",
      data: "any", // alias for value
      payload: "any", // alias for payload
    },
    if: {
      value: "any",
      data: "any", // alias for value
      payload: "any", // alias for payload
    },
    yield: {
      value: "any",
      data: "any", // alias for value
      payload: "any", // alias for payload
    },
    placeholder: {
      node: "any", // The injected element?
    },
  },
  summon(injectees, summonSpec, hostInstance, matchingElement) {
    // if (!injectees.$flow) injectees.$flow = {}
    // var out = injectees.$flow
  },
}

INJECTABLES['$helpers'] = {
  schema: HaikuHelpers.schema,
  summon(injectees) {
    injectees.$helpers = HaikuHelpers.helpers
  },
}

// List of JavaScript global built-in objects that we want to provide as an injectable.
// In the future, we might end up passing in modified versions of these objects/functions.
const BUILTIN_INJECTABLES = {
  Infinity,
  NaN,
  undefined: void (0),
  Object,
  Boolean,
  Math,
  Date,
  JSON,
  Number,
  String,
  RegExp,
  Array,
  isFinite,
  isNaN,
  parseFloat,
  parseInt,
  decodeURI,
  decodeURIComponent,
  encodeURI,
  encodeURIComponent,
  // escape,
  // unescape,
  Error,
  ReferenceError,
  SyntaxError,
  TypeError,
  // TODO: Determine which of the following to include. Need to test each for support.
  // 'Int8Array': Int8Array,
  // 'Uint8Array': Uint8Array,
  // 'Uint8ClampedArray': Uint8ClampedArray,
  // 'Int16Array': Int16Array,
  // 'Uint16Array': Uint16Array,
  // 'Int32Array': Int32Array,
  // 'Uint32Array': Uint32Array,
  // 'Float32Array': Float32Array,
  // 'Float64Array': Float64Array,
  // 'ArrayBuffer': ArrayBuffer,
  // 'URIError': URIError
  // 'RangeError': RangeError,
  // 'InternalError': InternalError,
  // 'Map': Map,
  // 'Set': Set,
  // 'WeakMap': WeakMap,
  // 'WeakSet': WeakSet,
  // 'SIMD ': SIMD,
  // 'SharedArrayBuffer ': SharedArrayBuffer,
  // 'Atomics ': Atomics ,
  // 'DataView': DataView,
  // 'Promise': Promise,
  // 'Generator': Generator,
  // 'GeneratorFunction': GeneratorFunction,
  // 'AsyncFunction': AsyncFunction,
  // 'Reflection': Reflection,
  // 'Reflect': Reflect,
  // 'Proxy': Proxy,
  // 'Intl': Intl,
  // 'WebAssembly': WebAssembly,
  // 'Iterator ': Iterator,
  // 'ParallelArray ': ParallelArray,
  // 'StopIteration': StopIteration
}

for (const builtinInjectableKey in BUILTIN_INJECTABLES) {
  (function(key, value) {
    INJECTABLES[key] = {
      builtin: true,
      schema: "*",
      summon(injectees) {
        injectees[key] = value
      },
    }
  }(builtinInjectableKey, BUILTIN_INJECTABLES[builtinInjectableKey]))
}

// When editing a component, any of these appearing inside an expression will trigger a warning.
// This is kept in the player so it's easier to compare these to the built-in injectables and
// other special treatment for JavaScript globals. "single source of truth" etc.
const FORBIDDEN_EXPRESSION_TOKENS = {
  // Keywords
  new: true,
  this: true,
  with: true,
  delete: true,
  export: true,
  extends: true,
  super: true,
  class: true,
  abstract: true,
  interface: true,
  static: true,
  label: true,
  goto: true,
  private: true,
  import: true,
  public: true,

  // Future keywords
  do: true,
  native: true,
  package: true,
  transient: true,
  implements: true,
  protected: true,
  throws: true,
  synchronized: true,
  final: true,

  // Common globals
  window: true,
  document: true,
  global: true,

  // Danger
  eval: true,
  uneval: true,
  Function: true,
  EvalError: true,

  // Module stuff to forbid
  require: true,
  module: true,
  exports: true,
  Module: true,

  // Sandbox
  arguments: true,
  callee: true,

  // Identifiers on built-in global objects
  prototpye: true, // Object.
  __proto__: true, // Object.
  freeze: true, // Object.
  setPrototypeOf: true, // Object.
  constructor: true, // Object.
  defineProperties: true, // Object.
  defineProperty: true, // Object.
}

// Just to be completionist/in case we want to whitelist instead, here is a list of keywords that we would allow.
// var ALLOWED_EXPRESSION_KEYWORDS = {
//   'in': true,
//   'try': true,
//   'var': true,
//   'catch': true,
//   'finally': true,
//   'return': true,
//   'void': true,
//   'continue': true,
//   'for': true,
//   'switch': true,
//   'while': true,
//   'debugger': true,
//   'function': true,
//   'default': true,
//   'if': true,
//   'throw': true,
//   'break': true,
//   'instanceof': true,
//   'typeof': true,
//   'case': true,
//   'else': true,
//   'boolean': true,
//   'long': true,
//   'byte': true,
//   'char': true,
//   'float': true,
//   'const': true,
//   'volatile': true,
//   'double': true,
//   'enum': true,
//   'int': true,
//   'short': true,
// }

export default function ValueBuilder(component) {
  this._component = component // ::HaikuComponent
  this._parsees = {}
  this._changes = {}
  this._summonees = {}
  this._evaluations = {}

  HaikuHelpers.register("now", function _helperNow() {
    return this._component._context.getDeterministicTime()
  }.bind(this))

  HaikuHelpers.register("rand", function _helperRand() {
    // prng seeded at the HaikuContext level
    return this._component._context.getDeterministicRand()
  }.bind(this))
}

ValueBuilder.prototype._clearCaches = function _clearCaches() {
  this._parsees = {}
  this._changes = {}
  this._summonees = {}
  this._evaluations = {}
  return this
}

ValueBuilder.prototype._clearCachedClusters = function _clearCachedClusters(
  timelineName,
  componentId,
) {
  if (this._parsees[timelineName]) this._parsees[timelineName][componentId] = {}
  return this
}

ValueBuilder.prototype.evaluate = function _evaluate(
  fn,
  timelineName,
  flexId,
  matchingElement,
  propertyName,
  keyframeMs,
  keyframeCluster,
  hostInstance,
) {
  enhance(fn, null)

  // We'll store the result of this evaluation in this variable (so we can cache it in case unexpected subsequent calls)
  let evaluation = void 0

  if (fn.specification === true) {
    // This function is of an unknown kind, so just evaluate it normally without magic dependency injection
    evaluation = fn.call(hostInstance, hostInstance._states)
  } else if (!Array.isArray(fn.specification.params)) {
    // If for some reason we got a non-array params, just evaluate
    evaluation = fn.call(hostInstance, hostInstance._states)
  } else if (fn.specification.params.length < 1) {
    // If for some reason we got 0 params, just evaluate it
    evaluation = fn.call(hostInstance, hostInstance._states)
  } else {
    if (fn.specification.params.length < 1) {
      // If the summon isn't in the destructured object format, just evaluate it
      evaluation = fn.call(hostInstance, hostInstance._states)
    } else {
      let summoneesArray = this.summonSummonables(
        fn.specification.params,
        timelineName,
        flexId,
        matchingElement,
        propertyName,
        keyframeMs,
        keyframeCluster,
        hostInstance,
      )

      let previousSummoneesArray = this._getPreviousSummonees(timelineName, flexId, propertyName, keyframeMs)

      if (_areSummoneesDifferent(previousSummoneesArray, summoneesArray)) {
        this._cacheSummonees(timelineName, flexId, propertyName, keyframeMs, summoneesArray)

        evaluation = fn.apply(hostInstance, summoneesArray)
      } else {
        // Since nothing is different, return the previous evaluation
        evaluation = this._getPreviousEvaluation(timelineName, flexId, propertyName, keyframeMs)
      }
    }
  }

  // Store the result so we can return it on the next run without re-eval
  if (fn.specification && fn.specification !== true) {
    this._cacheEvaluation(timelineName, flexId, propertyName, keyframeMs, evaluation)
  }

  return evaluation
}

ValueBuilder.prototype._getPreviousSummonees = function _getPreviousSummonees(timelineName, flexId, propertyName, keyframeMs) {
  if (!this._summonees[timelineName]) return void (0)
  if (!this._summonees[timelineName][flexId]) return void (0)
  if (!this._summonees[timelineName][flexId][propertyName]) return void (0)
  return this._summonees[timelineName][flexId][propertyName][keyframeMs]
}

ValueBuilder.prototype._cacheSummonees = function _cacheSummonees(timelineName, flexId, propertyName, keyframeMs, summonees) {
  if (!this._summonees[timelineName]) this._summonees[timelineName] = {}
  if (!this._summonees[timelineName][flexId]) this._summonees[timelineName][flexId] = {}
  if (!this._summonees[timelineName][flexId][propertyName]) this._summonees[timelineName][flexId][propertyName] = {}
  this._summonees[timelineName][flexId][propertyName][keyframeMs] = summonees
  return summonees
}

ValueBuilder.prototype._getPreviousEvaluation = function _getPreviousEvaluation(timelineName, flexId, propertyName, keyframeMs) {
  if (!this._evaluations[timelineName]) return void (0)
  if (!this._evaluations[timelineName][flexId]) return void (0)
  if (!this._evaluations[timelineName][flexId][propertyName]) return void (0)
  return this._evaluations[timelineName][flexId][propertyName][keyframeMs]
}

ValueBuilder.prototype._cacheEvaluation = function _cacheEvaluation(timelineName, flexId, propertyName, keyframeMs, evaluation) {
  if (!this._evaluations[timelineName]) this._evaluations[timelineName] = {}
  if (!this._evaluations[timelineName][flexId]) this._evaluations[timelineName][flexId] = {}
  if (!this._evaluations[timelineName][flexId][propertyName]) this._evaluations[timelineName][flexId][propertyName] = {}
  this._evaluations[timelineName][flexId][propertyName][keyframeMs] = evaluation
  return evaluation
}

ValueBuilder.prototype.summonSummonables = function _summonSummonables(
  paramsArray,
  timelineName,
  flexId,
  matchingElement,
  propertyName,
  keyframeMs,
  keyframeCluster,
  hostInstance,
) {
  let summonablesArray = []

  // Temporary storage, just creating one object here to avoid excessive allocations
  let summonStorage = {}

  for (let i = 0; i < paramsArray.length; i++) {
    let summonsEntry = paramsArray[i]

    // We'll store the output of the summons in this var, whether we're dealing with
    // a complex nested summonable or a flat one
    let summonsOutput

    // In case of a string, we will treat it as the key for the object to summon
    if (typeof summonsEntry === "string") {
      // Treat the entry as the key to a known injectable
      if (INJECTABLES[summonsEntry]) {
        summonStorage[summonsEntry] = undefined // Clear out the old value before populating with the new one
        INJECTABLES[summonsEntry].summon(
          summonStorage, // <~ This arg is populated with the data; it is the var 'out' in the summon function; they summonsKey must be added
          summonsEntry, // The summon function should know how to handle a string and what it signifies
          hostInstance,
          matchingElement,
          timelineName,
        )
        summonsOutput = summonStorage[summonsEntry]
      } else {
        summonsOutput = hostInstance.state[summonsEntry]
      }
    } else if (summonsEntry && typeof summonsEntry === "object") {
      // If dealing with a summon that is an object, the output will be an object
      summonsOutput = {}

      for (let summonsKey in summonsEntry) {
        // If the summons structure has a falsy, just skip it - I don't see why how this could happen, but just in case
        if (!summonsEntry[summonsKey]) continue

        // If a special summonable has been defined, then call its summoner function
        if (INJECTABLES[summonsKey]) {
          INJECTABLES[summonsKey].summon(
            summonsOutput, // <~ This arg is populated with the data; it is the var 'out' in the summon function; they summonsKey must be added
            summonsEntry[summonsKey], // The object specifies the specific fields we want to extract
            hostInstance,
            matchingElement,
            timelineName,
          )

          continue
        }

        // Otherwise, assume the user wants to access one of the states of the component instance
        // Note that the 'states' defined in the component's bytecode should have been set up upstream by the
        // player initialization process. hostInstance is a HaikuPlayer which has a state prop which has
        // getter/setter props set up corresponding to whatever the 'states' were set to
        summonsOutput[summonsKey] = hostInstance.state[summonsKey]
      }
    }

    // Whatever the request format was, populate the result in here
    if (summonsOutput !== undefined) {
      summonablesArray[i] = summonsOutput
    }
  }

  return summonablesArray
}

ValueBuilder.prototype._getSummonablesSchema = function _getSummonablesSchema() {
  let schema = {}
  for (let key in INJECTABLES) {
    schema[key] = INJECTABLES[key].schema
  }
  return schema
}

function _areSummoneesDifferent(previous, incoming) {
  // First check if either is an array, and do an el-by-el comparison
  if (Array.isArray(previous) && Array.isArray(incoming)) {
    // A good quick check is just to compare the lengths
    if (previous.length !== incoming.length) {
      return true
    } else {
      // Do an element-by-element comparison; if any fail, it all fails
      for (let i = 0; i < incoming.length; i++) {
        if (_areSummoneesDifferent(previous[i], incoming[i])) {
          return true
        }
      }
      // If we checked all elements, assume the arrays are the same
      return false
    }
  } else if (typeof previous === OBJECT && typeof incoming === OBJECT) {
    // Sub-objects detected; recurse and ask the same question
    if (previous !== null && incoming !== null) {
      for (let key in incoming) {
        if (_areSummoneesDifferent(previous[key], incoming[key])) {
          return true
        }
      }
      // If we checked all properties, assume the objects are the same
      return false
    } else if (previous === null) {
      return true
    } else if (incoming === null) {
      return true
    }
    return false
  }
  return previous !== incoming
}

ValueBuilder.prototype.fetchParsedValueCluster = function _fetchParsedValueCluster(
  timelineName,
  flexId,
  matchingElement,
  outputName,
  cluster,
  hostInstance,
  isPatchOperation,
  skipCache,
) {
  // Establish the cache objects for this properties group within this timeline
  if (!this._parsees[timelineName]) this._parsees[timelineName] = {}
  if (!this._parsees[timelineName][flexId]) {
    this._parsees[timelineName][flexId] = {}
  }
  if (!this._parsees[timelineName][flexId][outputName]) {
    this._parsees[timelineName][flexId][outputName] = {}
  }

  let parsee = this._parsees[timelineName][flexId][outputName]

  for (let ms in cluster) {
    let descriptor = cluster[ms]

    // Important: The ActiveComponent depends on the ability to be able to get fresh values via this option
    if (skipCache) {
      // Easiest way to skip the cache is just to make the destination object falsy
      parsee[ms] = null
    }

    // In case of a function, we can't cache - we have to recalc, and thus re-parse also
    if (isFunction(descriptor.value)) {
      // We have to recreate this cache object every time due to the need for function recalc
      parsee[ms] = {}
      if (descriptor.curve) {
        parsee[ms].curve = descriptor.curve
      }

      // Indicate to the downstream transition cache that this value came from a function and cannot be cached there.
      // See Transitions.js for info on how this gets handled
      parsee[ms].machine = true

      // Note that evaluate doesn't necessarily call the function - it may itself return a cached value
      let functionReturnValue = this.evaluate(
        descriptor.value,
        timelineName,
        flexId,
        matchingElement,
        outputName,
        ms,
        cluster,
        hostInstance,
      )

      // The function's return value is expected to be in the *raw* format - we parse to allow for interpolation
      let parser1 = this.getParser(outputName, matchingElement)
      if (parser1) {
        parsee[ms].value = parser1(functionReturnValue)
      } else {
        parsee[ms].value = functionReturnValue
      }
    } else {
      // In case of static values, we can cache - no need to re-parse static values if we already parsed them
      if (parsee[ms]) {
        continue
      }

      // If nothing in the cache, create the base cache object...
      parsee[ms] = {}
      if (descriptor.curve) {
        parsee[ms].curve = descriptor.curve
      }

      let parser2 = this.getParser(outputName, matchingElement)
      if (parser2) {
        parsee[ms].value = parser2(descriptor.value)
      } else {
        parsee[ms].value = descriptor.value
      }
    }
  }

  // Return the entire cached object - interpolation is done downstream
  return parsee
}

ValueBuilder.prototype.getParser = function getParser(outputName, virtualElement) {
  if (!virtualElement) return undefined
  let foundParser = virtualElement.__instance && virtualElement.__instance.getParser(outputName, virtualElement)
  if (!foundParser) foundParser = DOMValueParsers[virtualElement.elementName] && DOMValueParsers[virtualElement.elementName][outputName]
  return foundParser && foundParser.parse
}

ValueBuilder.prototype.getGenerator = function getGenerator(outputName, virtualElement) {
  if (!virtualElement) return undefined
  let foundGenerator = virtualElement.__instance && virtualElement.__instance.getParser(outputName, virtualElement)
  if (!foundGenerator) foundGenerator = DOMValueParsers[virtualElement.elementName] && DOMValueParsers[virtualElement.elementName][outputName]
  return foundGenerator && foundGenerator.generate
}

ValueBuilder.prototype.generateFinalValueFromParsedValue = function _generateFinalValueFromParsedValue(
  timelineName,
  flexId,
  matchingElement,
  outputName,
  computedValue,
) {
  let generator = this.getGenerator(outputName, matchingElement)
  if (generator) {
    return generator(computedValue)
  } else {
    return computedValue
  }
}

ValueBuilder.prototype.didChangeValue = function _didChangeValue(
  timelineName,
  flexId,
  matchingElement,
  outputName,
  outputValue,
) {
  let answer = false
  if (!this._changes[timelineName]) {
    this._changes[timelineName] = {}
    answer = true
  }
  if (!this._changes[timelineName][flexId]) {
    this._changes[timelineName][flexId] = {}
    answer = true
  }
  if (
    this._changes[timelineName][flexId][outputName] === undefined ||
    this._changes[timelineName][flexId][outputName] !== outputValue
  ) {
    this._changes[timelineName][flexId][outputName] = outputValue
    answer = true
  }
  return answer
}

/**
 * @method build
 * @description Given an 'out' object, accumulate values into that object based on the current timeline, time, and instance state.
 * If we didn't make any changes, we return undefined here. The caller should account for this.
 */
ValueBuilder.prototype.build = function _build(
  out,
  timelineName,
  timelineTime,
  flexId,
  matchingElement,
  propertiesGroup,
  isPatchOperation,
  haikuComponent,
) {
  let isAnythingWorthUpdating = false

  for (let propertyName in propertiesGroup) {
    let finalValue = this.grabValue(
      timelineName,
      flexId,
      matchingElement,
      propertyName,
      propertiesGroup,
      timelineTime,
      haikuComponent,
      isPatchOperation,
    )

    // We use undefined as a signal that it's not worthwhile to put this value in the list of updates.
    // null should be used in the case that we want to explicitly set an empty value
    if (finalValue === undefined) {
      continue
    }

    // If this is _not_ a patch operation, we have to set the value because downstream, the player will strip
    // off old attributes present on the dom nodes.
    if (
      !isPatchOperation ||
      this.didChangeValue(timelineName, flexId, matchingElement, propertyName, finalValue)
    ) {
      if (out[propertyName] === undefined) {
        out[propertyName] = finalValue
      } else {
        out[propertyName] = BasicUtils.mergeValue(
          out[propertyName],
          finalValue,
        )
      }

      isAnythingWorthUpdating = true
    }
  }

  if (isAnythingWorthUpdating) {
    return out
  } else {
    return undefined
  }
}

/**
 * @method grabValue
 * @description Given a timeline and some current state information, return a computed value for the given property name.
 *
 * NOTE: The 'build' method above interprets a return value of 'undefined' to mean "no change" so bear that in mind...
 *
 * @param timelineName {String} Name of the timeline we're using
 * @param flexId {String} Identifier of the matching element
 * @param matchingElement {Object} The matching element
 * @param propertyName {String} Name of the property being grabbed, e.g. position.x
 * @param propertiesGroup {Object} The full timeline properties group, e.g. { position.x: ..., position.y: ... }
 * @param timelineTime {Number} The current time (in ms) that the given timeline is at
 * @param haikuComponent {Object} Instance of HaikuPlayer
 * @param isPatchOperation {Boolean} Is this a patch?
 * @param skipCache {Boolean} Skip caching?
 */
ValueBuilder.prototype.grabValue = function _grabValue(
  timelineName,
  flexId,
  matchingElement,
  propertyName,
  propertiesGroup,
  timelineTime,
  haikuComponent,
  isPatchOperation,
  skipCache,
  clearSortedKeyframesCache,
) {
  let parsedValueCluster = this.fetchParsedValueCluster(
    timelineName,
    flexId,
    matchingElement,
    propertyName,
    propertiesGroup[propertyName],
    haikuComponent,
    isPatchOperation,
    skipCache,
  )

  // If there is no property of that name, we would have gotten nothing back, so we can't forward this to Transitions
  // since it expects to receive a populated cluster object
  if (!parsedValueCluster) {
    return undefined
  }

  if (clearSortedKeyframesCache) {
    delete parsedValueCluster.__sorted
  }

  let computedValueForTime

  // Important: The ActiveComponent depends on the ability to be able to get fresh values via the skipCache optino
  if (isPatchOperation && !skipCache) {
    computedValueForTime = Transitions.calculateValueAndReturnUndefinedIfNotWorthwhile(
      parsedValueCluster,
      timelineTime,
    )
  } else {
    computedValueForTime = Transitions.calculateValue(
      parsedValueCluster,
      timelineTime,
    )
  }

  if (computedValueForTime === undefined) {
    return undefined
  }

  let finalValue = this.generateFinalValueFromParsedValue(
    timelineName,
    flexId,
    matchingElement,
    propertyName,
    computedValueForTime,
  )

  return finalValue
}

ValueBuilder['INJECTABLES'] = INJECTABLES
ValueBuilder['FORBIDDEN_EXPRESSION_TOKENS'] = FORBIDDEN_EXPRESSION_TOKENS
