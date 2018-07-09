/**
 * Copyright (c) Haiku 2016-2018. All rights reserved.
 */

import {CurveSpec} from '@haiku/core/src/vendor/svg-points/types';
import {AdaptedWindow} from './adapters/dom/HaikuDOMAdapter';
import {CurveDefinition} from './api/Curve';
import HaikuComponent, {getFallback} from './HaikuComponent';
import HaikuElement from './HaikuElement';
import HaikuHelpers from './HaikuHelpers';
import ColorUtils from './helpers/ColorUtils';
import consoleErrorOnce from './helpers/consoleErrorOnce';
import {isPreviewMode} from './helpers/interactionModes';
import {synchronizePathStructure} from './helpers/PathUtil';
import SVGPoints from './helpers/SVGPoints';
import enhance from './reflection/enhance';
import Transitions from './Transitions';

const FUNCTION = 'function';
const KEYFRAME_ZERO = 0;
const OBJECT = 'object';

const isFunction = (value) => {
  return typeof value === FUNCTION;
};

const INJECTABLES: any = {};

declare var window: AdaptedWindow;

INJECTABLES.$window = {
  schema: {},
  summon (injectees) {
    injectees.$window = (typeof window !== 'undefined') ? window : {};
  },
};

INJECTABLES.$mount = {
  schema: {},
  summon (injectees, component: HaikuComponent) {
    injectees.$mount = component.context.renderer.mount;
  },
};

INJECTABLES.$core = {
  schema: {},
  summon (injectees, component: HaikuComponent, node, timelineName: string) {
    injectees.$core = {
      component,
      context: component.context,
      options: component.config,
      timeline: component.getTimeline(timelineName),
      clock: component.getClock(),
    };
  },
};

INJECTABLES.$context = {
  schema: {},
  summon (injectees, component: HaikuComponent) {
    injectees.$context = component.context;
  },
};

INJECTABLES.$component = {
  schema: {},
  summon (injectees, component: HaikuComponent) {
    injectees.$component = component;
  },
};

INJECTABLES.$host = {
  schema: {},
  summon (injectees, component: HaikuComponent) {
    injectees.$host = component.host;
  },
};

INJECTABLES.$top = {
  schema: {},
  summon (injectees, component: HaikuComponent) {
    injectees.$host = component.top;
  },
};

INJECTABLES.$clock = {
  schema: {},
  summon (injectees, component: HaikuComponent) {
    injectees.$timeline = component.getClock();
  },
};

INJECTABLES.$state = {
  schema: {},
  summon (injectees, component: HaikuComponent) {
    injectees.$state = component.state;
  },
};

INJECTABLES.$timeline = {
  schema: {},
  summon (injectees, component: HaikuComponent, node, timelineName: string) {
    injectees.$timeline = component.getTimeline(timelineName);
  },
};

INJECTABLES.$element = {
  schema: {},
  summon (injectees, component: HaikuComponent, node) {
    injectees.$element = HaikuElement.findOrCreateByNode(node);
  },
};

INJECTABLES.$parent = {
  schema: {},
  summon (injectees, component: HaikuComponent, node) {
    injectees.$parent = HaikuElement.findOrCreateByNode(node).parent;
  },
};

INJECTABLES.$container = {
  schema: {},
  summon (injectees, component: HaikuComponent, node) {
    const element = HaikuElement.findOrCreateByNode(node);
    injectees.$container = element.owner;
  },
};

INJECTABLES.$children = {
  schema: {},
  summon (injectees, component: HaikuComponent, node) {
    injectees.$children = HaikuElement.findOrCreateByNode(node).children;
  },
};

INJECTABLES.$tree = {
  schema: {},
  summon (injectees, component: HaikuComponent, node) {
    const element = HaikuElement.findOrCreateByNode(node);
    injectees.$tree = {
      element,
      component,
      parent: element.parent,
      children: element.children,
      root: element.owner,
    };
  },
};

INJECTABLES.$user = {
  schema: {},
  summon (injectees, component: HaikuComponent, node) {
    if (isPreviewMode(component.config.interactionMode)) {
      injectees.$user = component.context.getGlobalUserState();
    } else {
      injectees.$user = {
        mouse: {
          x: 1,
          y: 1,
          down: 0,
          buttons: [0, 0, 0],
        },
        pan: {
          x: 0,
          y: 0,
        },
        keys: {},
        touches: [],
        mouches: [],
      };
    }
  },
};

INJECTABLES.$flow = {
  schema: {},
  summon (injectees, component: HaikuComponent, node) {
    if (!injectees.$flow) {
      injectees.$flow = {};
    }

    const repeatNode = getRepeatHostNode(node);

    injectees.$flow.repeat = (repeatNode && repeatNode.__repeat) || {
      instructions: [],
      payload: {},
      source: repeatNode,
      index: 0,
      collection: [repeatNode],
    };

    const ifNode = getIfHostNode(node);

    injectees.$flow.if = (ifNode && ifNode.__if) || {
      answer: null,
    };

    injectees.$flow.placeholder = node.__placeholder || {
      value: null,
      surrogate: null,
    };
  },
};

const getRepeatHostNode = (node) => {
  if (!node) {
    return;
  }

  if (node.__repeat) {
    return node;
  }

  return getRepeatHostNode(node.__parent);
};

const getIfHostNode = (node) => {
  if (!node) {
    return;
  }

  if (node.__if) {
    return node;
  }

  return getIfHostNode(node.__parent);
};

INJECTABLES.$helpers = {
  summon (injectees, component: HaikuComponent) {
    injectees.$helpers = component.builder.helpers;
  },
};

// List of JavaScript global built-in objects that we want to provide as an injectable.
// In the future, we might end up passing in modified versions of these objects/functions.
const BUILTIN_INJECTABLES = {
  Infinity,
  NaN,
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
  undefined: void (0),
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
};

for (const builtinInjectableKey in BUILTIN_INJECTABLES) {
  INJECTABLES[builtinInjectableKey] = {
    summon (injectees) {
      injectees[builtinInjectableKey] = BUILTIN_INJECTABLES[builtinInjectableKey];
    },
  };
}

// When editing a component, any of these appearing inside an expression will trigger a warning.
// This is kept in the core so it's easier to compare these to the built-in injectables and
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
};

const parseD = (value: string|CurveSpec[]): CurveSpec[] => {
  // in case of d="" for any reason, don't try to expand this otherwise this will choke
  // #TODO: arguably we should preprocess SVGs before things get this far; try svgo?
  if (!value || value.length === 0) {
    return [];
  }
  // Allow points to return an array for convenience, and let downstream marshal it
  if (Array.isArray(value)) {
    return value;
  }
  return SVGPoints.pathToPoints(value);
};

const generateD = (value: string|CurveSpec[]): string => {
  if (typeof value === 'string') {
    return value;
  }
  return SVGPoints.pointsToPath(value);
};

const parseColor = (value) => {
  return ColorUtils.parseString(value);
};

const generateColor = (value) => {
  return ColorUtils.generateString(value);
};

const parsePoints = (value) => {
  if (Array.isArray(value)) {
    return value;
  }
  return SVGPoints.polyPointsStringToPoints(value);
};

const generatePoints = (value) => {
  if (typeof value === 'string') {
    return value;
  }
  return SVGPoints.pointsToPolyString(value);
};

const PARSERS = {
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
  d: {parse: parseD, generate: generateD},
  points: {parse: parsePoints, generate: generatePoints},
};

/**
 * When evaluating expressions written by the user, don't crash everything.
 * Log the error (but only once, since we're animating) and then return a
 * fairly safe all-purpose value (1).
 */
const safeCall = (fn, hostInstance, hostStates) => {
  try {
    return fn.call(hostInstance, hostStates);
  } catch (exception) {
    consoleErrorOnce(exception);
    return 1;
  }
};

const safeApply = (fn, hostInstance, summoneesArray) => {
  try {
    return fn.apply(hostInstance, summoneesArray);
  } catch (exception) {
    consoleErrorOnce(exception);
    return 1;
  }
};

const areSummoneesDifferent = (previous: any, incoming: any): boolean => {
  if (Array.isArray(previous) && Array.isArray(incoming)) {
    if (previous.length !== incoming.length) {
      return true;
    }

    // Do a shallow comparison of elements. We don't go deep because:
    //   - It easily becomes too expensive to do this while rendering
    //   - We can avoid needing to check for recursion
    for (let i = 0; i < previous.length; i++) {
      // Assume that objects are different since we don't want to do a deep comparison
      if (previous[i] && typeof previous[i] === 'object') {
        return true;
      }

      if (previous[i] !== incoming[i]) {
        return true;
      }
    }

    for (let j = 0; j < previous.length; j++) {
      // Assume that objects are different since we don't want to do a deep comparison
      if (incoming[j] && typeof incoming[j] === 'object') {
        return true;
      }

      if (incoming[j] !== previous[j]) {
        return true;
      }
    }

    return false;
  }

  if (typeof previous === OBJECT && typeof incoming === OBJECT) {
    if (previous === null && incoming === null) {
      return false;
    }

    if (previous === null) {
      return true;
    }

    if (incoming === null) {
      return true;
    }

    // Do a shallow comparison of properties. We don't go deep because:
    //   - It easily becomes too expensive to do this while rendering
    //   - We can avoid needing to check for recursion

    for (const pkey in previous) {
      if (previous[pkey] !== incoming[pkey]) {
        return true;
      }
    }

    for (const ikey in incoming) {
      if (incoming[ikey] !== previous[ikey]) {
        return true;
      }
    }

    return false;
  }

  return previous !== incoming;
};

const stringToInt = (str) => {
  let hash = 5381;
  let i = str.length;
  while (i) {
    hash = (hash * 33) ^ str.charCodeAt(--i);
  }
  return hash >>> 0;
};

const MAX_INT = 2147483646;

export interface ParsedValueCluster {
  __sorted?: boolean;
  [ms: number]: {
    expression?: boolean;
    value?: any;
    curve?: CurveDefinition;
  };
}

/* tslint:disable:variable-name */
export default class ValueBuilder {
  _component;
  _parsees;
  _changes;
  _summonees;
  _evaluations;

  helpers;
  _lastTimelineName;
  _lastTimelineTime;
  _lastFlexId;
  _lastPropertyName;

  constructor (component) {
    this._component = component; // ::HaikuComponent
    this._parsees = {};
    this._changes = {};
    this._summonees = {};
    this._evaluations = {};

    this.helpers = {};

    for (const helperName in HaikuHelpers.helpers) {
      this.helpers[helperName] = HaikuHelpers.helpers[helperName];
    }

    this.helpers.now = () => {
      if (isPreviewMode(this._component.config.interactionMode)) {
        return (this._component.config.timestamp || 1) + (this._lastTimelineTime || 1);
      }

      return 1;
    };

    this.helpers.rand = () => {
      if (isPreviewMode(this._component.config.interactionMode)) {
        // tslint:disable-next-line
        const scopeKey = `${this._lastTimelineName}|${this._lastTimelineTime}|${this._lastPropertyName}|${this._lastFlexId}`;
        const randKey = `${this._component.config.seed}@${scopeKey}`;
        const keyInt = stringToInt(randKey);
        const outFloat = ((keyInt + 1) % MAX_INT) / MAX_INT;
        return outFloat;
      }

      return 1;
    };

    this.helpers.find = (selector) => {
      return this._component.querySelectorAll(selector);
    };
  }

  clearCaches (options = {}) {
    this._parsees = {};
    this._changes = {};
    this._summonees = {};
    this._evaluations = {};
    return this;
  }

  clearCachedClusters (timelineName, componentId) {
    if (this._parsees[timelineName]) {
      this._parsees[timelineName][componentId] = {};
    }
    return this;
  }

  evaluate (
    fn,
    timelineName: string,
    flexId: string,
    matchingElement,
    propertyName: string,
    keyframeMs,
    keyframeCluster,
    hostInstance: HaikuComponent,
  ) {
    enhance(fn, null);

    // We'll store the result of this evaluation in this variable
    // (so we can cache it in case unexpected subsequent calls)
    let evaluation = void 0;

    if (fn.specification === true) {
      // This function is of an unknown kind, so just evaluate it normally without magic dependency injection
      evaluation = safeCall(fn, hostInstance, hostInstance._states);
    } else if (!Array.isArray(fn.specification.params)) {
      // If for some reason we got a non-array params, just evaluate
      evaluation = safeCall(fn, hostInstance, hostInstance._states);
    } else if (fn.specification.params.length < 1) {
      // If for some reason we got 0 params, just evaluate it
      evaluation = safeCall(fn, hostInstance, hostInstance._states);
    } else {
      if (fn.specification.params.length < 1) {
        // If the summon isn't in the destructured object format, just evaluate it
        evaluation = safeCall(fn, hostInstance, hostInstance._states);
      } else {
        const summoneesArray = this.summonSummonables(
          fn.specification.params,
          timelineName,
          flexId,
          matchingElement,
          propertyName,
          keyframeMs,
          keyframeCluster,
          hostInstance,
        );

        const previousSummoneesArray = this.getPreviousSummonees(timelineName, flexId, propertyName, keyframeMs);

        if (areSummoneesDifferent(previousSummoneesArray, summoneesArray)) {
          this.cacheSummonees(timelineName, flexId, propertyName, keyframeMs, summoneesArray);
          evaluation = safeApply(fn, hostInstance, summoneesArray);
        } else {
          // Since nothing is different, return the previous evaluation
          evaluation = this.getPreviousEvaluation(timelineName, flexId, propertyName, keyframeMs);
        }
      }
    }

    // Store the result so we can return it on the next run without re-eval
    if (fn.specification && fn.specification !== true) {
      this.cacheEvaluation(timelineName, flexId, propertyName, keyframeMs, evaluation);
    }

    return evaluation;
  }

  getPreviousSummonees (
    timelineName, flexId, propertyName, keyframeMs) {
    if (!this._summonees[timelineName]) {
      return;
    }
    if (!this._summonees[timelineName][flexId]) {
      return;
    }
    if (!this._summonees[timelineName][flexId][propertyName]) {
      return;
    }
    return this._summonees[timelineName][flexId][propertyName][keyframeMs];
  }

  cacheSummonees (
    timelineName, flexId, propertyName, keyframeMs, summonees) {
    if (!this._summonees[timelineName]) {
      this._summonees[timelineName] = {};
    }
    if (!this._summonees[timelineName][flexId]) {
      this._summonees[timelineName][flexId] = {};
    }
    if (!this._summonees[timelineName][flexId][propertyName]) {
      this._summonees[timelineName][flexId][propertyName] = {};
    }
    this._summonees[timelineName][flexId][propertyName][keyframeMs] = summonees;
    return summonees;
  }

  getPreviousEvaluation (
    timelineName, flexId, propertyName, keyframeMs) {
    if (!this._evaluations[timelineName]) {
      return;
    }
    if (!this._evaluations[timelineName][flexId]) {
      return;
    }
    if (!this._evaluations[timelineName][flexId][propertyName]) {
      return;
    }
    return this._evaluations[timelineName][flexId][propertyName][keyframeMs];
  }

  cacheEvaluation (
    timelineName, flexId, propertyName, keyframeMs, evaluation) {
    if (!this._evaluations[timelineName]) {
      this._evaluations[timelineName] = {};
    }
    if (!this._evaluations[timelineName][flexId]) {
      this._evaluations[timelineName][flexId] = {};
    }
    if (!this._evaluations[timelineName][flexId][propertyName]) {
      this._evaluations[timelineName][flexId][propertyName] = {};
    }
    this._evaluations[timelineName][flexId][propertyName][keyframeMs] = evaluation;
    return evaluation;
  }

  summonSummonables (
    paramsArray,
    timelineName: string,
    flexId: string,
    matchingElement,
    propertyName: string,
    keyframeMs,
    keyframeCluster,
    hostInstance: HaikuComponent,
  ) {
    const summonablesArray = [];

    // Temporary storage, just creating one object here to avoid excessive allocations
    const summonStorage = {};

    for (let i = 0; i < paramsArray.length; i++) {
      const summonsEntry = paramsArray[i];

      // We'll store the output of the summons in this var, whether we're dealing with
      // a complex nested summonable or a flat one
      let summonsOutput;

      // In case of a string, we will treat it as the key for the object to summon
      if (typeof summonsEntry === 'string') {
        // Treat the entry as the key to a known injectable
        if (INJECTABLES[summonsEntry]) {
          summonStorage[summonsEntry] = undefined; // Clear out the old value before populating with the new one
          INJECTABLES[summonsEntry].summon(
            summonStorage,
            hostInstance,
            matchingElement,
            timelineName,
          );
          summonsOutput = summonStorage[summonsEntry];
        } else {
          summonsOutput = hostInstance.state[summonsEntry];
        }
      }

      // Whatever the request format was, populate the result in here
      if (summonsOutput !== undefined) {
        summonablesArray[i] = summonsOutput;
      }
    }

    return summonablesArray;
  }

  getSummonablesSchema () {
    const summonablesSchema = {};
    for (const key in INJECTABLES) {
      summonablesSchema[key] = INJECTABLES[key].schema;
    }
    return summonablesSchema;
  }

  private getParsee (timelineName, flexId, outputName): ParsedValueCluster {
    if (!this._parsees[timelineName]) {
      this._parsees[timelineName] = {};
    }
    if (!this._parsees[timelineName][flexId]) {
      this._parsees[timelineName][flexId] = {};
    }
    if (!this._parsees[timelineName][flexId][outputName]) {
      this._parsees[timelineName][flexId][outputName] = {};
    }

    return this._parsees[timelineName][flexId][outputName];
  }

  private clusterParseeIsStable (keysMs, timelineName, flexId, outputName): boolean {
    return keysMs.every(
      (ms) => this._parsees[timelineName][flexId][outputName][ms] && !this._parsees[timelineName][flexId][outputName][ms].expression,
    );
  }

  private fetchParsedValueCluster (
    timelineName: string,
    flexId: string,
    matchingElement,
    outputName: string,
    cluster,
    hostInstance: HaikuComponent,
    isPatchOperation: boolean,
    skipCache: boolean,
  ) {
    const parsee = this.getParsee(timelineName, flexId, outputName);

    if (!cluster) {
      return parsee;
    }

    const keys = Object.keys(cluster).map(Number).sort();
    const skipStableParsees = isPatchOperation && !skipCache;

    if (skipStableParsees && this.clusterParseeIsStable(keys, timelineName, flexId, outputName)) {
      return parsee;
    }

    keys.forEach((ms) => {
      if (skipStableParsees && parsee[ms] && !parsee[ms].expression) {
        return;
      }

      const descriptor = cluster[ms];
      if (isFunction(descriptor.value)) {
        parsee[ms] = {
          expression: true,
          value: this.evaluate(
            descriptor.value,
            timelineName,
            flexId,
            matchingElement,
            outputName,
            ms,
            cluster,
            hostInstance,
          ),
        };
      } else {
        parsee[ms] = {
          expression: false,
          value: descriptor.value,
        };
      }

      if (descriptor.curve) {
        parsee[ms].curve = descriptor.curve;
      }
    });

    if (keys.length > 1) {
      const parser = this.getParser(outputName);
      if (!parser) {
        return parsee;
      }

      keys.forEach((ms) => {
        parsee[ms].value = parser(parsee[ms].value);
      });

      if (outputName === 'd') {
        synchronizePathStructure(...keys.map((ms) => parsee[ms].value));
      }
    }

    return parsee;
  }

  getParser (outputName) {
    const foundParser = PARSERS[outputName];
    return foundParser && foundParser.parse;
  }

  getGenerator (outputName) {
    const foundGenerator = PARSERS[outputName];
    return foundGenerator && foundGenerator.generate;
  }

  generateFinalValueFromParsedValue (
    timelineName,
    flexId,
    matchingElement,
    outputName,
    computedValue,
  ) {
    const generator = this.getGenerator(outputName);
    if (generator) {
      return generator(computedValue);
    }

    return computedValue;
  }

  didChangeValue (
    timelineName,
    flexId,
    matchingElement,
    outputName,
    outputValue,
  ) {
    let answer = false;
    if (!this._changes[timelineName]) {
      this._changes[timelineName] = {};
      answer = true;
    }
    if (!this._changes[timelineName][flexId]) {
      this._changes[timelineName][flexId] = {};
      answer = true;
    }
    if (
      this._changes[timelineName][flexId][outputName] === undefined ||
      this._changes[timelineName][flexId][outputName] !== outputValue
    ) {
      this._changes[timelineName][flexId][outputName] = outputValue;
      answer = true;
    }
    return answer;
  }

  build (
    timelineName,
    timelineTime,
    flexId,
    matchingElement,
    propertyName,
    propertyValue,
    isPatchOperation,
    haikuComponent,
    skipCache = false,
  ) {
    const finalValue = this.grabValue(
      timelineName,
      flexId,
      matchingElement,
      propertyName,
      propertyValue,
      timelineTime,
      haikuComponent,
      isPatchOperation,
      skipCache,
      null,
    );

    return finalValue;
  }

  grabValue (
    timelineName: string,
    flexId: string,
    matchingElement,
    propertyName: string,
    propertyValue: any,
    timelineTime: number,
    haikuComponent: HaikuComponent,
    isPatchOperation: boolean,
    skipCache: boolean,
    clearSortedKeyframesCache: boolean,
  ) {
    // Used by $helpers to calculate scope-specific values;
    this._lastTimelineName = timelineName;
    this._lastFlexId = flexId;
    this._lastPropertyName = propertyName;
    this._lastTimelineTime = timelineTime;

    const parsedValueCluster = this.fetchParsedValueCluster(
      timelineName,
      flexId,
      matchingElement,
      propertyName,
      propertyValue,
      haikuComponent,
      isPatchOperation,
      skipCache,
    );

    // If there is no property of that name, we would have gotten nothing back, so we can't forward this to Transitions
    // since it expects to receive a populated cluster object
    if (!parsedValueCluster) {
      return undefined;
    }

    if (clearSortedKeyframesCache) {
      delete parsedValueCluster.__sorted;
    }

    let computedValueForTime;

    if (!parsedValueCluster[KEYFRAME_ZERO]) {
      parsedValueCluster[KEYFRAME_ZERO] = {
        value: getFallback(matchingElement && matchingElement.elementName, propertyName),
      };
    }

    // Important: The ActiveComponent depends on the ability to be able to get fresh values via the skipCache option.
    if (isPatchOperation && !skipCache) {
      computedValueForTime = Transitions.calculateValueAndReturnUndefinedIfNotWorthwhile(
        parsedValueCluster,
        timelineTime,
      );
    } else {
      computedValueForTime = Transitions.calculateValue(
        parsedValueCluster,
        timelineTime,
      );

      // When expressions and other dynamic functionality is in play, data may be missing resulting in
      // properties lacking defined values; in this case we try to do the right thing and fallback
      // to a known usable value for the field. Especially needed with controlFlow.repeat.
      if (computedValueForTime === undefined) {
        computedValueForTime = getFallback(matchingElement && matchingElement.elementName, propertyName);
      }
    }

    if (computedValueForTime === undefined) {
      return undefined;
    }

    return this.generateFinalValueFromParsedValue(
      timelineName,
      flexId,
      matchingElement,
      propertyName,
      computedValueForTime,
    );
  }

  static INJECTABLES = INJECTABLES;
  static FORBIDDEN_EXPRESSION_TOKENS = FORBIDDEN_EXPRESSION_TOKENS;
}
