/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

import Config from './Config';
import HaikuTimeline from './HaikuTimeline';
import HaikuGlobal from './HaikuGlobal';
import addElementToHashTable from './helpers/addElementToHashTable';
import applyPropertyToElement from './helpers/applyPropertyToElement';
import clone from './helpers/clone';
import cssQueryList from './helpers/cssQueryList';
import {isPreviewMode} from './helpers/interactionModes';
import isMutableProperty from './helpers/isMutableProperty';
import manaFlattenTree from './helpers/manaFlattenTree';
import scopifyElements from './helpers/scopifyElements';
import SimpleEventEmitter from './helpers/SimpleEventEmitter';
import upgradeBytecodeInPlace from './helpers/upgradeBytecodeInPlace';

import Layout3D from './Layout3D';
import ValueBuilder from './ValueBuilder';
import assign from './vendor/assign';

const pkg = require('./../package.json');
const PLAYER_VERSION = pkg.version;
const STRING_TYPE = 'string';
const OBJECT_TYPE = 'object';
const IDENTITY_MATRIX = Layout3D.createMatrix();
const HAIKU_ID_ATTRIBUTE = 'haiku-id';
const DEFAULT_TIMELINE_NAME = 'Default';

// tslint:disable-next-line:function-name
export default function HaikuComponent(bytecode, context, config, metadata) {
  if (!bytecode) {
    throw new Error('Empty bytecode not allowed');
  }

  if (!bytecode.template) {
    throw new Error('Bytecode must define template');
  }

  if (!context) {
    throw new Error('Component requires a context');
  }

  if (!config.options) {
    throw new Error('Config options required');
  }

  if (!config.options.seed) {
    throw new Error('Seed value must be provided');
  }

  if (!bytecode.timelines) {
    bytecode.timelines = {};
  }

  SimpleEventEmitter.create(this);

  this.PLAYER_VERSION = PLAYER_VERSION;

  // Notify anybody who cares that we've successfully initialized their component in memory (but not rendered yet)
  this.emit('haikuComponentWillInitialize', this);
  if (config.onHaikuComponentWillInitialize) {
    config.onHaikuComponentWillInitialize(this);
  }

  // First we assign the bytecode, because config assignment (see below) might effect the way it is set up!
  this._bytecode = clone(bytecode);

  // If the bytecode we got happens to be in an outdated format, we automatically updated it to ours
  upgradeBytecodeInPlace(this._bytecode, {
    // Random seed for adding instance uniqueness to ids at runtime.
    referenceUniqueness: Math.random().toString(36).slice(2),
  });

  this._context = context;
  this._builder = new ValueBuilder(this);

  // STATES
  this._states = {}; // Storage for getter/setter actions in userland logic
  this.state = {}; // Public accessor object, e.g. this.state.foo = 1
  this._stateChanges = {};
  this._anyStateChange = false;

  // EVENT HANDLERS
  this._eventsFired = {};
  this._anyEventChange = false;

  // OPTIONS
  // Note that assignConfig calls bindStates and bindEventHandlers, because our incoming config, which
  // could occur at any point during runtime, e.g. in React, may need to update internal states, etc.
  this.assignConfig(config);

  // Optional metadata just used for internal tracking and debugging; don't base any logic on this
  this._metadata = metadata || {};

  // TIMELINES
  this._timelineInstances = {};
  this._mutableTimelines = {};
  this._hydrateMutableTimelines();

  // TEMPLATE
  // The full version of the template gets mutated in-place by the rendering algorithm
  this._template = fetchAndCloneTemplate(this._bytecode.template);
  this._flatManaTree = manaFlattenTree(this._template, CSS_QUERY_MAPPING);

  // Flag used internally to determine whether we need to re-render the full tree or can survive by just patching
  this._needsFullFlush = false;

  // If true, will continually flush the entire tree until explicitly set to false again
  this._alwaysFlush = false;

  // The last output of a full re-render - I don't think this is important any more, except maybe for debugging
  // [#LEGACY?]
  this._lastTemplateExpansion = null;

  // Similar to above, except the last individual (patch) changes - may not be important anymore. [#LEGACY?]
  this._lastDeltaPatches = null;

  // As a performance optimization, keep track of elements we've located as key/value (selector/element) pairs
  this._matchedElementCache = {};

  // A sort of cache with a mapping of elements to the scope in which they belong (div, svg, etc)
  this._renderScopes = {};

  // Used to determine whether this component will emit events for lots of actions, or only the basics
  this._doesEmitEventsVerbosely = false;

  // List of subscribers to frame events, kept inside a single dict as a performance optimization
  this._frameEventListeners = {};

  // Dictionary of haiku-ids pointing to any nested components we have in the tree, used for patching
  this._nestedComponentElements = {};

  // Dictionary of ids-to-elements, for quick lookups.
  // We hydrate this with elements as we render so we don't have to query the DOM
  // to quickly load elements for patch-style rendering
  this._hashTableOfIdsToElements = {
    // Elements are stored in _arrays_ as opposed to singletons, since there could be more than one
    // in case of edge cases or possibly for future implementation details around $repeat
    // "abcde": [el, el]
  };

  // Dictionary mapping element ids to listeners registered at that element,
  // which are in turn keyed by the event name
  this._registeredElementEventListeners = {};

  // Dictionary of ids-to-elements, representing elements that we
  // do not want to render past in the tree (i.e. cede control to some
  // other rendering context)
  this._horizonElements = {};

  // Dictionary of ids-to-elements, representing control-flow operation
  // status that has occurred during the rendering process, e.g. placeholder
  // or repeat/if/yield
  this._controlFlowData = {};

  this.on('timeline:tick', (timelineName, timelineFrame, timelineTime) => {
    if (this._frameEventListeners[timelineName]) {
      if (this._frameEventListeners[timelineName][timelineFrame]) {
        for (let i = 0; i < this._frameEventListeners[timelineName][timelineFrame].length; i++) {
          this._frameEventListeners[timelineName][timelineFrame][i](timelineFrame, timelineTime);
        }
      }
    }
  });

  // Notify anybody who cares that we've successfully initialized their component in memory
  this.emit('haikuComponentDidInitialize', this);
  if (config.onHaikuComponentDidInitialize) {
    config.onHaikuComponentDidInitialize(this);
  }

  // Flag to determine whether this component should continue doing any work
  this._deactivated = false;

  // Flag to indicate whether we are sleeping, an ephemeral condition where no rendering occurs
  this._sleeping = false;

  HaikuComponent['components'].push(this);
}

HaikuComponent['PLAYER_VERSION'] = PLAYER_VERSION;

HaikuComponent['components'] = [];

HaikuGlobal['HaikuComponent'] = HaikuComponent;

/**
 * @description Track elements that are at the horizon of what we want to render, i.e., a list of
 * virtual elements that we don't want to make any updates lower than in the tree.
 */
HaikuComponent.prototype._markHorizonElement = function _markHorizonElement(virtualElement) {
  if (virtualElement && virtualElement.attributes) {
    const flexId = virtualElement.attributes[HAIKU_ID_ATTRIBUTE] || virtualElement.attributes.id;
    if (flexId) {
      this._horizonElements[flexId] = virtualElement;
    }
  }
};

HaikuComponent.prototype._isHorizonElement = function _isHorizonElement(virtualElement) {
  if (virtualElement && virtualElement.attributes) {
    const flexId = virtualElement.attributes[HAIKU_ID_ATTRIBUTE] || virtualElement.attributes.id;
    return !!this._horizonElements[flexId];
  }
  return false;
};

HaikuComponent.prototype._getRealElementsAtId = function _getRealElementsAtId(flexId) {
  if (!this._hashTableOfIdsToElements[flexId]) {
    return [];
  }
  return this._hashTableOfIdsToElements[flexId];
};

/**
 * @description We store DOM elements in a lookup table keyed by their id so we can do fast patches.
 * This is a hook that allows e.g. the ReactDOMAdapter to push elements into the list if it mutates the DOM.
 * e.g. during control flow
 */
HaikuComponent.prototype._addElementToHashTable = function _addElementToHashTable(realElement, virtualElement) {
  addElementToHashTable(this._hashTableOfIdsToElements, realElement, virtualElement);
  return this;
};

/**
 * @description Keep track of whether a given element has rendered its surrogate, i.e.
 * an element passed to it as a placeholder. This is used in the renderer to determine
 * whether the element needs to be temporarily invisible to avoid a flash of content while
 * rendering occurs
 */
HaikuComponent.prototype._didElementRenderSurrogate = function _didElementRenderSurrogate(
  virtualElement, surrogatePlacementKey, surrogateObject) {
  if (!virtualElement) {
    return false;
  }
  if (!virtualElement.attributes) {
    return false;
  }
  const flexId = virtualElement.attributes['haiku-id'] || virtualElement.attributes.id;
  if (!flexId) {
    return false;
  }
  if (!this._controlFlowData[flexId]) {
    return false;
  }
  if (!this._controlFlowData[flexId].renderedSurrogates) {
    return false;
  }
  return this._controlFlowData[flexId].renderedSurrogates[surrogatePlacementKey] === surrogateObject;
};

HaikuComponent.prototype._markElementAnticipatedSurrogates = function _markElementAnticipatedSurrogates(
  virtualElement, surrogatesArray) {
  const flexId = virtualElement && virtualElement.attributes && (
    virtualElement.attributes['haiku-id'] || virtualElement.attributes.id);
  if (flexId) {
    if (!this._controlFlowData[flexId]) {
      this._controlFlowData[flexId] = {};
    }
    this._controlFlowData[flexId].anticipatedSurrogates = surrogatesArray;
  }
};

HaikuComponent.prototype._markElementSurrogateAsRendered = function _markElementSurrogateAsRendered(
  virtualElement, surrogatePlacementKey, surrogateObject) {
  const flexId = virtualElement && virtualElement.attributes && (
    virtualElement.attributes['haiku-id'] || virtualElement.attributes.id);
  if (flexId) {
    if (!this._controlFlowData[flexId]) {
      this._controlFlowData[flexId] = {};
    }
    if (!this._controlFlowData[flexId].renderedSurrogates) {
      this._controlFlowData[flexId].renderedSurrogates = {};
    }
    this._controlFlowData[flexId].renderedSurrogates[surrogatePlacementKey] = surrogateObject;
  }
};

// If the component needs to remount itself for some reason, make sure we fire the right events
HaikuComponent.prototype.callRemount = function _callRemount(incomingConfig, skipMarkForFullFlush) {
  this.emit('haikuComponentWillMount', this);
  if (this.config.onHaikuComponentWillMount) {
    this.config.onHaikuComponentWillMount(this);
  }

  // Note!: Only update config if we actually got incoming options!
  if (incomingConfig) {
    this.assignConfig(incomingConfig);
  }

  if (!skipMarkForFullFlush) {
    this._markForFullFlush();
    this.clearCaches();
  }

  // If autoplay is not wanted, stop the all timelines immediately after we've mounted
  // (We have to mount first so that the component displays, but then pause it at that state.)
  // If you don't want the component to show up at all, use options.automount=false.
  const timelineInstances = this.getTimelines();
  for (const timelineName in timelineInstances) {
    const timelineInstance = timelineInstances[timelineName];
    if (this.config.options.autoplay) {
      if (timelineName === DEFAULT_TIMELINE_NAME) {
        // Assume we want to start the timeline from the beginning upon remount.
        // NOTE:
        // timeline.play() will normally trigger _markForFullFlush because it assumes we need to render
        // from the get-go. However, in case of a callRemount, we might not want to do that since it can be kind of
        // like running the first frame twice. So we pass the option into play so it can conditionally skip the
        // _markForFullFlush step.
        timelineInstance.play({skipMarkForFullFlush});
      }
    } else {
      timelineInstance.pause();
    }
  }

  this._context.contextMount();

  this.emit('haikuComponentDidMount', this);
  if (this.config.onHaikuComponentDidMount) {
    this.config.onHaikuComponentDidMount(this);
  }
};

// If the component needs to unmount itself for some reason, make sure we fire the right events
// This is primarily used in the React Adapter, but there might be other uses for it?
HaikuComponent.prototype.callUnmount = function _callUnmount(incomingConfig) {
  if (incomingConfig) {
    this.assignConfig(incomingConfig);
  }

  // Since we're unmounting, pause all animations to avoid unnecessary calc while detached
  const timelineInstances = this.getTimelines();
  for (const timelineName in timelineInstances) {
    const timelineInstance = timelineInstances[timelineName];
    timelineInstance.pause();
  }

  this._context.contextUnmount();

  this.emit('haikuComponentWillUnmount', this);
  if (this.config.onHaikuComponentWillUnmount) {
    this.config.onHaikuComponentWillUnmount(this);
  }
};

HaikuComponent.prototype.assignConfig = function _assignConfig(incomingConfig) {
  // - OPTIONS
  // - VANITIES
  // - CONTROLLER
  // - lifecycle listeners
  this.config = Config.build(this.config || {}, incomingConfig || {});
  // Don't forget to update the ones the context has!
  // Skip component assignment so we don't end up in an infinite loop :P
  this._context.assignConfig(this.config, {skipComponentAssign: true});

  for (const timelineName in this._timelineInstances) {
    const timelineInstance = this._timelineInstances[timelineName];
    timelineInstance.assignOptions(this.config.options);
  }

  // STATES
  bindStates(this._states, this, this.config.states);

  // EVENT HANDLERS
  bindEventHandlers(this, this.config.eventHandlers);

  // TIMELINES
  assign(this._bytecode.timelines, this.config.timelines);

  return this;
};

HaikuComponent.prototype.set = function set(key, value) {
  this.state[key] = value;
  return this;
};

HaikuComponent.prototype.get = function get(key) {
  return this.state[key];
};

HaikuComponent.prototype.setState = function setState(states) {
  if (!states) {
    return this;
  }
  if (typeof states !== 'object') {
    return this;
  }
  for (const key in states) {
    this.set(key, states[key]);
  }
  return this;
};

HaikuComponent.prototype.getStates = function getStates() {
  return this.state;
};

HaikuComponent.prototype.clearCaches = function clearCaches(options) {
  this._states = {};

  // Don't forget to repopulate the states with originals when we cc otherwise folks
  // who depend on initial states being set will be SAD!
  if (!options || (options && options.clearStates !== false)) {
    bindStates(this._states, this, this.config.states);
  }

  if (options && options.clearPreviouslyRegisteredEventListeners) {
    // If specified, remove any previous registrations of event listeners so we don't get a bunch
    // of duplicate events firing when we re-register events after a reload or remount
    for (const flexId in this._registeredElementEventListeners) {
      for (const eventName in this._registeredElementEventListeners[flexId]) {
        const {target, handler} = this._registeredElementEventListeners[flexId][eventName];
        if (target && handler && this._context._renderer.removeListener) {
          this._context._renderer.removeListener(target, handler, eventName);
        }
        delete this._registeredElementEventListeners[flexId][eventName];
      }
    }
  }

  // Gotta bind any event handlers that may have been dynamically added
  if (!options || (options && options.clearEventHandlers !== false)) {
    bindEventHandlers(this, this.config.eventHandlers);
  }

  this._stateChanges = {};
  this._anyStateChange = false;
  this._eventsFired = {};
  this._anyEventChange = false;
  this._needsFullFlush = false;
  this._lastTemplateExpansion = null;
  this._lastDeltaPatches = null;
  this._matchedElementCache = {};
  this._renderScopes = {};
  this._controlFlowData = {};

  this._clearDetectedEventsFired();
  this._clearDetectedInputChanges();

  this._builder.clearCaches(options);

  // TODO: Do we _need_ to reach in and clear the caches of context?
  this._context.config.options.cache = {};

  this.config.options.cache = {};

  // These may have been set for caching purposes
  if (this._bytecode.timelines) {
    for (const timelineName in this._bytecode.timelines) {
      delete this._bytecode.timelines[timelineName].__max;
    }
  }

  return this;
};

HaikuComponent.prototype.getClock = function getClock() {
  return this._context.getClock();
};

HaikuComponent.prototype.getTimelines = function getTimelines() {
  return this._fetchTimelines();
};

HaikuComponent.prototype._fetchTimelines = function _fetchTimelines() {
  const names = Object.keys(this._bytecode.timelines);

  for (let i = 0; i < names.length; i++) {
    const name = names[i];
    if (!name) {
      continue;
    }

    const descriptor = this._getTimelineDescriptor(name);
    const existing = this._timelineInstances[name];

    if (!existing) {
      this._timelineInstances[name] = new HaikuTimeline(
        this,
        name,
        descriptor,
        this.config.options,
      );
    }
  }

  return this._timelineInstances;
};

HaikuComponent.prototype.getTimeline = function getTimeline(name) {
  return this.getTimelines()[name];
};

HaikuComponent.prototype.getDefaultTimeline = function getDefaultTimeline() {
  const timelines = this.getTimelines();
  return timelines[DEFAULT_TIMELINE_NAME];
};

HaikuComponent.prototype.getActiveTimelines = function getActiveTimelines() {
  const activeTimelines = {};

  const timelines = this.getTimelines();

  for (const timelineName in timelines) {
    const timelineInstance = timelines[timelineName];
    if (timelineInstance.isActive()) {
      activeTimelines[timelineName] = timelineInstance;
    }
  }

  return activeTimelines;
};

HaikuComponent.prototype.stopAllTimelines = function stopAllTimelines() {
  for (const timelineName in this._timelineInstances) {
    this.stopTimeline(timelineName);
  }
};

HaikuComponent.prototype.startAllTimelines = function startAllTimelines() {
  for (const timelineName in this._timelineInstances) {
    this.startTimeline(timelineName);
  }
};

HaikuComponent.prototype.startTimeline = function startTimeline(timelineName) {
  const time = this._context.clock.getExplicitTime();
  const descriptor = this._getTimelineDescriptor(timelineName);
  const existing = this._timelineInstances[timelineName];
  if (existing) {
    existing.start(time, descriptor);
  } else {
    // As a convenience we auto-initialize timeline if the user is trying to start one that hasn't initialized yet
    const fresh = new HaikuTimeline(this, timelineName, descriptor, this.config.options);
    fresh.start(time, descriptor); // Initialization alone doesn't start the timeline, so we start it explicitly
    this._timelineInstances[timelineName] = fresh; // Don't forget to add it to our collection
  }
};

HaikuComponent.prototype.stopTimeline = function startTimeline(timelineName) {
  const time = this._context.clock.getExplicitTime();
  const descriptor = this._getTimelineDescriptor(timelineName);
  const existing = this._timelineInstances[timelineName];
  if (existing) {
    existing.stop(time, descriptor);
  }
};

HaikuComponent.prototype._getTimelineDescriptor = function _getTimelineDescriptor(timelineName) {
  return this._bytecode.timelines[timelineName];
};

HaikuComponent.prototype._getInjectables = function _getInjectables(element) {
  const injectables = {};

  assign(injectables, this._builder._getSummonablesSchema(element));

  // Local states get precedence over global summonables, so assign them last
  for (const key in this._states) {
    let type = this._states[key].type;
    if (!type) {
      type = typeof this._states[key];
    }
    injectables[key] = type;
  }

  return injectables;
};

HaikuComponent.prototype._getTopLevelElement = function _getTopLevelElement() {
  return this._template;
};

HaikuComponent.prototype.getAddressableProperties = function getAddressableProperties() {
  return this._bytecode.states || {};
};

/**
 * @method _deactivate
 * @description When hot-reloading a component during editing, this can be used to
 * ensure that this component doesn't keep updating after its replacement is loaded.
 */
HaikuComponent.prototype._deactivate = function _deactivate() {
  this._deactivated = true;
  return this;
};

HaikuComponent.prototype._isDeactivated = function _isDeactivated() {
  return this._deactivated;
};

HaikuComponent.prototype._sleepOn = function _sleepOn() {
  this._sleeping = true;
  return this;
};

HaikuComponent.prototype._sleepOff = function _sleepOff() {
  this._sleeping = false;
  return this;
};

HaikuComponent.prototype._isAsleep = function _isAsleep() {
  return this._sleeping;
};

HaikuComponent.prototype._hasRegisteredListenerOnElement = function _hasRegisteredListenerOnElement(
  virtualElement, eventName) {
  const flexId = virtualElement.attributes[HAIKU_ID_ATTRIBUTE] || virtualElement.attributes.id;
  if (!flexId) {
    return false;
  }
  return this._registeredElementEventListeners[flexId] && this._registeredElementEventListeners[flexId][eventName];
};

HaikuComponent.prototype._markDidRegisterListenerOnElement = function _markDidRegisterListenerOnElement(
  virtualElement, domElement, eventName, listenerFunction) {
  const flexId = virtualElement.attributes[HAIKU_ID_ATTRIBUTE] || virtualElement.attributes.id;
  if (!flexId) {
    return this;
  }
  if (!this._registeredElementEventListeners[flexId]) {
    this._registeredElementEventListeners[flexId] = {};
  }
  this._registeredElementEventListeners[flexId][eventName] = {
    handler: listenerFunction,
    target: domElement,
  };
  return this;
};

/**
 * TODO:
 * Implement the methods commented out below
 */

// HaikuComponent.prototype.getFps = function getFps () {
// }

// HaikuComponent.prototype.setFps = function setFps (fps) {
// }

// HaikuComponent.prototype.getTimeUnits = function getTimeUnits () {
// }

// HaikuComponent.prototype.setTimeUnits = function setTimeUnits () {
// }

// Template.prototype.getTree = function getTree () {
//   return this.template
// }

function cloneTemplate(mana) {
  if (!mana) {
    return mana;
  }

  if (typeof mana === STRING_TYPE) {
    return mana;
  }

  const out = {
    elementName: mana.elementName,
    attributes: null,
    children: null,
  };

  if (mana.attributes) {
    out.attributes = {};

    for (const key in mana.attributes) {
      out.attributes[key] = mana.attributes[key];
    }
  }

  if (mana.children) {
    out.children = [];

    for (let i = 0; i < mana.children.length; i++) {
      out.children[i] = cloneTemplate(mana.children[i]);
    }
  }

  return out;
}

function fetchAndCloneTemplate(template) {
  if (!template) {
    throw new Error('Empty template not allowed');
  }

  if (typeof template === OBJECT_TYPE) {
    if (!template.elementName) {
      console.warn(
        '[haiku player] warning: saw unexpected bytecode template format',
      );
    }
    return cloneTemplate(template);
  }

  throw new Error('Unknown bytecode template format');
}

function bindEventHandlers(component, extraEventHandlers) {
  const allEventHandlers = assign({}, component._bytecode.eventHandlers, extraEventHandlers);

  for (const selector in allEventHandlers) {
    const handlerGroup = allEventHandlers[selector];
    for (const eventName in handlerGroup) {
      const eventHandlerDescriptor = handlerGroup[eventName];
      bindEventHandler(component, eventHandlerDescriptor, selector, eventName);
    }
  }
}

function bindEventHandler(component, eventHandlerDescriptor, selector, eventName) {
  // If we've already set this on a previous run, ensure we reset in the same way
  // so that we don't load the handler wrapper downstream (e.g. in the events ui)
  if (eventHandlerDescriptor.original) {
    eventHandlerDescriptor.handler = eventHandlerDescriptor.original;
  }

  eventHandlerDescriptor.original = eventHandlerDescriptor.handler;
  eventHandlerDescriptor.handler = function _wrappedEventHandler(event, ...args) {
    // Only fire the event listeners if the component is in 'live' interaction mode,
    // i.e., not currently being edited inside the Haiku authoring environment
    if (isPreviewMode(component.config.options.interactionMode)) {
      component._anyEventChange = true;

      if (!component._eventsFired[selector]) {
        component._eventsFired[selector] = {};
      }

      component._eventsFired[selector][eventName] =
        event || true;

      eventHandlerDescriptor.original.call(component, event, ...args);
    }
  };
}

function typecheckStateSpec(stateSpec, stateSpecName) {
  if (
    stateSpec.type === 'any' ||
    stateSpec.type === '*' ||
    stateSpec.type === undefined ||
    stateSpec.type === null
  ) {
    return void 0;
  }

  if (stateSpec.type === 'event' || stateSpec.type === 'listener') {
    if (
      typeof stateSpec.value !== 'function' &&
      stateSpec.value !== null &&
      stateSpec.value !== undefined
    ) {
      throw new Error(
        'Property value `' +
        stateSpecName +
        '` must be an event listener function',
      );
    }
    return void 0;
  }

  if (stateSpec.type === 'array') {
    if (!Array.isArray(stateSpec.value)) {
      throw new Error(
        'Property value `' + stateSpecName + '` must be an array',
      );
    }
  } else if (stateSpec.type === 'object') {
    if (stateSpec.value && typeof stateSpec.value !== 'object') {
      throw new Error(
        'Property value `' + stateSpecName + '` must be an object',
      );
    }
  } else {
    if (typeof stateSpec.value !== stateSpec.type) {
      throw new Error(
        'Property value `' + stateSpecName + '` must be a `' + stateSpec.type + '`',
      );
    }
  }
}

function bindStates(statesTargetObject, component, extraStates) {
  const allStates = assign({}, component._bytecode.states, extraStates);

  for (const stateSpecName in allStates) {
    const stateSpec = allStates[stateSpecName];

    // 'null' is the signal for an empty prop, not undefined.
    if (stateSpec.value === undefined) {
      throw new Error(
        'Property `' +
        stateSpecName +
        '` cannot be undefined; use null for empty states',
      );
    }

    typecheckStateSpec(stateSpec, stateSpecName);

    statesTargetObject[stateSpecName] = stateSpec.value;

    defineSettableState(component, component.state, statesTargetObject, stateSpec, stateSpecName);
  }
}

function defineSettableState(component, statesHostObject, statesTargetObject, stateSpec, stateSpecName) {
  // Note: We define the getter/setter on the object itself, but the storage occurs on the pass-in statesTargetObject
  Object.defineProperty(statesHostObject, stateSpecName, {
    configurable: true,

    get: function get() {
      return statesTargetObject[stateSpecName];
    },

    set: function set(inputValue) {
      // For optimization downstream, we track whether & which input values changed since a previous setter call
      component._stateChanges[stateSpecName] = inputValue;
      component._anyStateChange = true;

      if (stateSpec.setter) {
        // Important: We call the setter with a binding of the component, so it can access methods on `this`
        statesTargetObject[stateSpecName] = stateSpec.setter.call(
          component,
          inputValue,
        );
      } else {
        statesTargetObject[stateSpecName] = inputValue;
      }

      // Really only used as a hook for Haiku's ActiveComponent
      if (component._doesEmitEventsVerbosely) {
        component.emit('state:set', stateSpecName, statesTargetObject[stateSpecName], statesTargetObject);
      }

      return statesTargetObject[stateSpecName];
    },
  });
}

HaikuComponent.prototype._markForFullFlush = function _markForFullFlush() {
  this._needsFullFlush = true;
  return this;
};

HaikuComponent.prototype._unmarkForFullFlush = function _unmarkForFullFlush() {
  this._needsFullFlush = false;
  return this;
};

HaikuComponent.prototype._shouldPerformFullFlush = function _shouldPerformFullFlush() {
  return this._needsFullFlush || this._alwaysFlush;
};

HaikuComponent.prototype._clearDetectedEventsFired = function _clearDetectedEventsFired() {
  this._anyEventChange = false;
  this._eventsFired = {};
  return this;
};

HaikuComponent.prototype._clearDetectedInputChanges = function _clearDetectedInputChanges() {
  this._anyStateChange = false;
  this._stateChanges = {};
  return this;
};

HaikuComponent.prototype.patch = function patch(container, patchOptions) {
  if (this._deactivated) {
    // If deactivated, pretend like there is nothing to render
    return {};
  }

  const time = this._context.clock.getExplicitTime();

  const timelinesRunning = [];
  for (const timelineName in this._timelineInstances) {
    const timeline = this._timelineInstances[timelineName];
    if (timeline.isActive()) {
      timeline._doUpdateWithGlobalClockTime(time);

      // The default timeline is always considered to be running
      if (timelineName === 'Default' || !timeline.isFinished()) {
        timelinesRunning.push(timeline);
      }
    }
  }

  this._lastDeltaPatches = gatherDeltaPatches(
    this,
    this._template,
    container,
    this._context,
    timelinesRunning,
    patchOptions,
  );

  for (const flexId in this._nestedComponentElements) {
    const compElement = this._nestedComponentElements[flexId];
    this._lastDeltaPatches[flexId] = compElement;
    compElement.__instance.patch(compElement, {});
  }

  this._clearDetectedEventsFired();
  this._clearDetectedInputChanges();

  return this._lastDeltaPatches;
};

HaikuComponent.prototype._getPrecalcedPatches = function _getPrecalcedPatches() {
  if (this._deactivated) {
    // If deactivated, pretend like there is nothing to render
    return {};
  }
  return this._lastDeltaPatches || {};
};

HaikuComponent.prototype.render = function render(container, renderOptions) {
  if (this._deactivated) {
    // If deactivated, pretend like there is nothing to render
    return void 0;
  }

  const time = this._context.clock.getExplicitTime();

  for (const timelineName in this._timelineInstances) {
    const timeline = this._timelineInstances[timelineName];

    // QUESTION: What differentiates an active timeline from a playing one?
    if (timeline.isActive()) {
      timeline._doUpdateWithGlobalClockTime(time);
    }
  }

  // 1. Update the tree in place using all of the applied values we got from the timelines
  applyContextChanges(this, this._template, container, this._context, renderOptions || {});

  // 2. Given the above updates, 'expand' the tree to its final form (which gets flushed out to the mount element)
  this._lastTemplateExpansion = expandTreeElement(
    this._template,
    this,
    this._context,
  );

  // We've done the render so we don't "need" to flush anymore
  this._unmarkForFullFlush();

  return this._lastTemplateExpansion;
};

HaikuComponent.prototype._findElementsByHaikuId = function _findElementsByHaikuId(componentId) {
  return findMatchingElementsByCssSelector('haiku:' + componentId, this._flatManaTree, this._matchedElementCache);
};

HaikuComponent.prototype._hydrateMutableTimelines = function _hydrateMutableTimelines() {
  if (this._bytecode.timelines) {
    for (const timelineName in this._bytecode.timelines) {
      for (const selector in this._bytecode.timelines[timelineName]) {
        for (const propertyName in this._bytecode.timelines[timelineName][selector]) {
          if (isMutableProperty(this._bytecode.timelines[timelineName][selector][propertyName])) {
            const timeline = this._mutableTimelines[timelineName] || {};
            const propertyGroup = timeline[selector] || {};
            this._mutableTimelines = {
              ...this._mutableTimelines,
              [timelineName]: {
                ...timeline,
                [selector]: {
                  ...propertyGroup,
                  [propertyName]: this._bytecode.timelines[timelineName][selector][propertyName],
                },
              },
            };
          }
        }
      }
    }
  }
};

function bindContextualEventHandlers(component) {
  // Associate any event handlers with the elements matched
  if (component._bytecode.eventHandlers) {
    for (const eventSelector in component._bytecode.eventHandlers) {
      const eventHandlerGroup = component._bytecode.eventHandlers[eventSelector];

      // First handle any subscriptions to internal events, like component lifecycle or frame events
      for (const eventName1 in eventHandlerGroup) {
        const eventHandlerSpec1 = eventHandlerGroup[eventName1];
        // Don't subscribe twice or waste effort.
        if (!eventHandlerSpec1.handler.__subscribed && !eventHandlerSpec1.handler.__external) {
          if (eventName1 === 'component:will-mount') {
            component.on('haikuComponentWillMount', eventHandlerSpec1.handler);
            eventHandlerSpec1.handler.__subscribed = true;
            continue;
          }
          if (eventName1 === 'component:did-mount') {
            component.on('haikuComponentDidMount', eventHandlerSpec1.handler);
            eventHandlerSpec1.handler.__subscribed = true;
            continue;
          }
          if (eventName1 === 'component:will-unmount') {
            component.on('haikuComponentWillUnmount', eventHandlerSpec1.handler);
            eventHandlerSpec1.handler.__subscribed = true;
            continue;
          }

          const namePieces = eventName1.split(':');
          if (namePieces.length > 1) {
            if (namePieces[0] === 'timeline') {
              const timelineNamePiece = namePieces[1];
              const frameValuePiece = parseInt(namePieces[2], 10);
              if (!component._frameEventListeners[timelineNamePiece]) {
                component._frameEventListeners[timelineNamePiece] = {};
              }
              if (!component._frameEventListeners[timelineNamePiece][frameValuePiece]) {
                component._frameEventListeners[timelineNamePiece][frameValuePiece] = [];
              }
              component._frameEventListeners[timelineNamePiece][frameValuePiece].push(eventHandlerSpec1.handler);
              eventHandlerSpec1.handler.__subscribed = true;
              continue;
            }
          }

          // Mark this so as to skip this expensive process on subsequent loops
          eventHandlerSpec1.handler.__external = true;
        }
      }

      const matchingElementsForEvents = findMatchingElementsByCssSelector(
        eventSelector,
        component._flatManaTree,
        component._matchedElementCache,
      );

      if (!matchingElementsForEvents || matchingElementsForEvents.length < 1) {
        continue;
      }

      for (let k = 0; k < matchingElementsForEvents.length; k++) {
        for (const eventName in eventHandlerGroup) {
          const eventHandlerSpec = eventHandlerGroup[eventName];
          // We may have already subscribed to something internally, so no point repeating actions here
          if (!eventHandlerSpec.__subscribed) {
            applyHandlerToElement(matchingElementsForEvents[k], eventName, eventHandlerSpec.handler);
          }
        }
      }
    }
  }
}

function applyBehaviors(timelinesRunning, deltas, component, context, isPatchOperation) {
  // We shouldn't need to add event handlers for patch operations since theoretically that same listener
  // would remain a constant throughout the lifetime of the component
  if (!isPatchOperation) {
    bindContextualEventHandlers(component);
  }

  // Apply any behaviors to the element
  for (let i = 0; i < timelinesRunning.length; i++) {
    const timelineInstance = timelinesRunning[i];
    const timelineName = timelineInstance.getName();
    const timelineDescriptor = isPatchOperation
      ? component._mutableTimelines[timelineName]
      : component._bytecode.timelines[timelineName];

    if (typeof timelineDescriptor !== 'object') {
      continue;
    }

    const timelineTime = timelineInstance.getBoundedTime();

    for (const behaviorSelector in timelineDescriptor) {
      const propertiesGroup = timelineDescriptor[behaviorSelector];

      if (!propertiesGroup) {
        continue;
      }

      const matchingElementsForBehavior = findMatchingElementsByCssSelector(
        behaviorSelector,
        component._flatManaTree,
        component._matchedElementCache,
      );

      if (!matchingElementsForBehavior || matchingElementsForBehavior.length < 1) {
        continue;
      }

      for (let j = 0; j < matchingElementsForBehavior.length; j++) {
        const matchingElement = matchingElementsForBehavior[j];
        const domId = matchingElement && matchingElement.attributes && matchingElement.attributes.id;
        const haikuId = matchingElement && matchingElement.attributes && matchingElement.attributes[HAIKU_ID_ATTRIBUTE];
        const flexId = haikuId || domId;

        // If assembledOutputs is undefined that's supposed to mean that there is nothing changed
        const assembledOutputs = component._builder.build(
          {}, // We provide an object onto which outputs are placed
          timelineName,
          timelineTime,
          flexId,
          matchingElement,
          propertiesGroup,
          isPatchOperation,
          component,
        );

        // [#LEGACY?]
        if (assembledOutputs && assembledOutputs.transform) {
          matchingElement.__transformed = true;
        }

        // If assembledOutputs is empty, that is a signal that nothing changed
        if (assembledOutputs && deltas && flexId) {
          deltas[flexId] = matchingElement;
        }

        if (assembledOutputs) {
          for (const behaviorKey in assembledOutputs) {
            const behaviorValue = assembledOutputs[behaviorKey];
            applyPropertyToElement(matchingElement, behaviorKey, behaviorValue, context, component);
          }
        }
      }
    }
  }
}

function gatherDeltaPatches(component, template, container, context, timelinesRunning, patchOptions) {
  // handlers/vanities depend on attributes objects existing in the first place.
  Layout3D.initializeTreeAttributes(template, container);
  initializeComponentTree(template, component, context);

  const deltas = {}; // This is what we're going to return - a dictionary of ids to elements

  applyBehaviors(timelinesRunning, deltas, component, context, /*isPatchOperation=*/true);

  if (patchOptions.sizing) {
    computeAndApplyPresetSizing(template, container, patchOptions.sizing, deltas);
  }

  // TODO: Calculating the tree layout should be skipped for already visited node
  // that we have already calculated among the descendants of the changed one
  for (const flexId in deltas) {
    const changedNode = deltas[flexId];
    computeAndApplyTreeLayouts(changedNode, changedNode.__parent, patchOptions, context);
  }

  return deltas;
}

function applyContextChanges(component, template, container, context, renderOptions) {
  const timelinesRunning = [];
  if (component._bytecode.timelines) {
    for (const timelineName in component._bytecode.timelines) {
      const timeline = component.getTimeline(timelineName);
      if (!timeline) {
        continue;
      }
      // No need to execute behaviors on timelines that aren't active
      if (!timeline.isActive()) {
        continue;
      }
      if (timeline.isFinished()) {
        // For any timeline other than the default, shut it down if it has gone past
        // its final keyframe. The default timeline is a special case which provides
        // fallbacks/behavior that is essentially true throughout the lifespan of the component
        if (timelineName !== DEFAULT_TIMELINE_NAME) {
          continue;
        }
      }
      timelinesRunning.push(timeline);
    }
  }

  Layout3D.initializeTreeAttributes(template, container); // handlers/vanities depend on attributes objects existing
  initializeComponentTree(template, component, context);

  scopifyElements(template, null, null); // I think this only needs to happen once when we build the full tree

  applyBehaviors(timelinesRunning, null, component, context, /*isPatchOperation=*/false);

  if (renderOptions.sizing) {
    computeAndApplyPresetSizing(template, container, renderOptions.sizing, null);
  }

  computeAndApplyTreeLayouts(template, container, renderOptions, context);

  return template;
}

function initializeComponentTree(element, component, context) {
  // In addition to plain objects, a sub-element can also be a component,
  // which we currently detect by checking to see if it looks like 'bytecode'
  // Don't instantiate a second time if we already have the instance at this node
  if (isBytecode(element.elementName) && !element.__instance) {
    const flexId = element.attributes && (element.attributes[HAIKU_ID_ATTRIBUTE] || element.attributes.id);
    element.__instance = new HaikuComponent(
      element.elementName,
      context,
      {
        // Exclude states, etc. (everything except 'options') since those should override *only* on the root element
        // being instantiated.
        options: context.config.options,
      },
      {
        nested: true,
      });

    // We duplicate the behavior of HaikuContext and start the default timeline
    element.__instance.startTimeline(DEFAULT_TIMELINE_NAME);
    component._nestedComponentElements[flexId] = element;
  }

  // repeat through children
  if (element.children && element.children.length > 0) {
    for (let i = 0; i < element.children.length; i++) {
      initializeComponentTree(element.children[i], component, context);
    }
  }
}

function expandTreeElement(element, component, context) {
  // Handlers attach first since they may want to respond to an immediate property setter
  if (element.__handlers) {
    for (const key in element.__handlers) {
      const handler = element.__handlers[key];

      // Don't subscribe twice!
      if (!handler.__subscribed) {
        if (element.__instance) { // We might have a component from a system that doesn't adhere to our own internal API
          if (element.__instance.instance) {
            element.__instance.instance.on(key, handler);
            handler.__subscribed = true;
          }
        }
      }
    }
  }

  if (element.__instance) {
    // Call render on the interior element to get its full subtree, and recurse
    // HaikuComponent.prototype.render = (container, renderOptions) => {...}
    // The element is the 'container' in that it should have a layout computed computed already?
    const wrapper = shallowCloneComponentTreeElement(element);
    const surrogates = wrapper.children;
    const subtree = element.__instance.render(element, element.__instance.config.options, surrogates);
    const expansion = expandTreeElement(subtree, element.__instance, context);
    wrapper.children = [expansion];
    return wrapper;
  }

  if (typeof element.elementName === STRING_TYPE) {
    const copy = shallowCloneComponentTreeElement(element);

    if (element.children && element.children.length > 0) {
      for (let i = 0; i < element.children.length; i++) {
        const child = element.children[i];
        copy.children[i] = expandTreeElement(child, component, context);
      }
    }

    return copy;
  }

  // If we got here, we've either completed recursion or there's nothing special to do - so just return the element
  // itself.
  return element;
}

function shallowCloneComponentTreeElement(element) {
  const clone = {
    __instance: null,
    __handlers: null,
    __transformed: null,
    __parent: null,
    __scope: null,
    __target: null,
    layout: null,
    elementName: null,
    attributes: null,
    children: null,
  };

  clone.__instance = element.__instance; // Cache the instance
  clone.__handlers = element.__handlers; // Transfer active event handlers
  clone.__transformed = element.__transformed; // Transfer flag detecting whether a transform has occurred [#LEGACY?]
  clone.__parent = element.__parent; // Make sure it doesn't get detached from its ancestors
  clone.__scope = element.__scope; // It still has the same scope (svg, div, etc)
  clone.__target = element.__target; // The platform rendered target element, e.g. DOM node
  clone.layout = element.layout; // Allow its layout, which we update in-place, to remain a pointer

  // Simply copy over the other standard parts of the node...
  clone.elementName = element.elementName;

  clone.attributes = {};
  for (const key in element.attributes) {
    clone.attributes[key] = element.attributes[key];
  }

  // But as for children, these get assigned downstream after each gets expanded
  clone.children = [];

  return clone;
}

const CSS_QUERY_MAPPING = {
  name: 'elementName',
  attributes: 'attributes',
  children: 'children',
};

function findMatchingElementsByCssSelector(selector, flatManaTree, cache) {
  if (cache[selector]) {
    return cache[selector];
  }

  return cache[selector] = cssQueryList(flatManaTree, selector, CSS_QUERY_MAPPING);
}

function computeAndApplyTreeLayouts(tree, container, options, context) {
  if (!tree || typeof tree === 'string') {
    return void 0;
  }

  computeAndApplyNodeLayout(tree, container);

  if (!tree.children || tree.children.length < 1) {
    return void 0;
  }

  for (let i = 0; i < tree.children.length; i++) {
    computeAndApplyTreeLayouts(tree.children[i], tree, options, context);
  }
}

function computeAndApplyNodeLayout(element, parent) {
  if (parent) {
    const parentSize = parent.layout.computed.size;

    const computedLayout = Layout3D.computeLayout(element.layout, element.layout.matrix, IDENTITY_MATRIX, parentSize);

    if (computedLayout === false) {
      // False indicates 'don't show
      element.layout.computed = {
        invisible: true,
        size: parentSize || {x: 0, y: 0, z: 0},
      };
    } else {
      // Need to pass some size to children, so if this element doesn't have one, use the parent's.
      element.layout.computed = computedLayout || {size: parentSize};
    }
  }
}

function applyHandlerToElement(match, name, fn) {
  if (!match.__handlers) {
    match.__handlers = {};
  }
  match.__handlers[name] = fn;
  return match;
}

function computeAndApplyPresetSizing(element, container, mode, deltas) {
  const elementWidth = element.layout.sizeAbsolute.x;
  const elementHeight = element.layout.sizeAbsolute.y;

  const containerWidth = container.layout.computed.size.x;
  const containerHeight = container.layout.computed.size.y;

  // I.e., the amount by which we'd have to multiply the element's scale to make it
  // exactly the same size as its container (without going above it)
  const scaleDiffX = containerWidth / elementWidth;
  const scaleDiffY = containerHeight / elementHeight;

  // This makes sure that the sizing occurs with respect to a correct and consistent origin point,
  // but only if the user didn't happen to explicitly set this value (we allow their override).
  if (!element.attributes.style['transform-origin']) {
    element.attributes.style['transform-origin'] = 'top left';
  }

  // IMPORTANT: If any value has been changed on the element, you must set this to true.
  // Otherwise the changed object won't go into the deltas dictionary, and the element won't update.
  let changed = false;

  switch (mode) {
    // Make the base element its default scale, which is just a multiplier of one. This is the default.
    case 'normal':
      if (element.layout.scale.x !== 1.0) {
        changed = true;
        element.layout.scale.x = 1.0;
      }
      if (element.layout.scale.y !== 1.0) {
        changed = true;
        element.layout.scale.y = 1.0;
      }
      break;

    // Stretch the element to fit the container on both x and y dimensions (distortion allowed)
    case 'stretch':
      if (scaleDiffX !== element.layout.scale.x) {
        changed = true;
        element.layout.scale.x = scaleDiffX;
      }
      if (scaleDiffY !== element.layout.scale.y) {
        changed = true;
        element.layout.scale.y = scaleDiffY;
      }
      break;

    // CONTAIN algorithm
    // see https://developer.mozilla.org/en-US/docs/Web/CSS/background-size?v=example
    // A keyword that scales the image as large as possible and maintains image aspect ratio
    // (image doesn't get squished). Image is letterboxed within the container.
    // When the image and container have different dimensions, the empty areas (either top/bottom of left/right)
    // are filled with the background-color.
    case 'contain':
    case true: // (Legacy.)
      let containScaleToUse = null;

      // We're looking for the larger of the two scales that still allows both dimensions to fit in the box
      // The rounding is necessary to avoid precision issues, where we end up comparing e.g. 2.0000000000001 to 2
      if (
        ~~(scaleDiffX * elementWidth) <= containerWidth &&
        ~~(scaleDiffX * elementHeight) <= containerHeight
      ) {
        containScaleToUse = scaleDiffX;
      }
      if (
        ~~(scaleDiffY * elementWidth) <= containerWidth &&
        ~~(scaleDiffY * elementHeight) <= containerHeight
      ) {
        if (containScaleToUse === null) {
          containScaleToUse = scaleDiffY;
        } else {
          if (scaleDiffY >= containScaleToUse) {
            containScaleToUse = scaleDiffY;
          }
        }
      }

      if (element.layout.scale.x !== containScaleToUse) {
        changed = true;
        element.layout.scale.x = containScaleToUse;
      }
      if (element.layout.scale.y !== containScaleToUse) {
        changed = true;
        element.layout.scale.y = containScaleToUse;
      }

      // Offset the translation so that the element remains centered within the letterboxing
      const containTranslationOffsetX = -(containScaleToUse * elementWidth - containerWidth) / 2;
      const containTranslationOffsetY = -(containScaleToUse * elementHeight - containerHeight) / 2;
      if (element.layout.translation.x !== containTranslationOffsetX) {
        changed = true;
        element.layout.translation.x = containTranslationOffsetX;
      }
      if (element.layout.translation.y !== containTranslationOffsetY) {
        changed = true;
        element.layout.translation.y = containTranslationOffsetY;
      }

      break;

    // COVER algorithm (inverse of CONTAIN)
    // see https://developer.mozilla.org/en-US/docs/Web/CSS/background-size?v=example
    // A keyword that is the inverse of contain. Scales the image as large as possible and maintains
    // image aspect ratio (image doesn't get squished). The image "covers" the entire width or height
    // of the container. When the image and container have different dimensions, the image is clipped
    // either left/right or top/bottom.
    case 'cover':
      let coverScaleToUse = null;

      // We're looking for the smaller of two scales that ensures the entire box is covered.
      // The rounding is necessary to avoid precision issues, where we end up comparing e.g. 2.0000000000001 to 2
      if (
        ~~(scaleDiffX * elementWidth) >= containerWidth &&
        ~~(scaleDiffX * elementHeight) >= containerHeight
      ) {
        coverScaleToUse = scaleDiffX;
      }
      if (
        ~~(scaleDiffY * elementWidth) >= containerWidth &&
        ~~(scaleDiffY * elementHeight) >= containerHeight
      ) {
        if (coverScaleToUse === null) {
          coverScaleToUse = scaleDiffY;
        } else {
          if (scaleDiffY <= coverScaleToUse) {
            coverScaleToUse = scaleDiffY;
          }
        }
      }

      if (element.layout.scale.x !== coverScaleToUse) {
        changed = true;
        element.layout.scale.x = coverScaleToUse;
      }
      if (element.layout.scale.y !== coverScaleToUse) {
        changed = true;
        element.layout.scale.y = coverScaleToUse;
      }

      // Offset the translation so that the element remains centered despite clipping
      const coverTranslationOffsetX = -(coverScaleToUse * elementWidth - containerWidth) / 2;
      const coverTranslationOffsetY = -(coverScaleToUse * elementHeight - containerHeight) / 2;
      if (element.layout.translation.x !== coverTranslationOffsetX) {
        changed = true;
        element.layout.translation.x = coverTranslationOffsetX;
      }
      if (element.layout.translation.y !== coverTranslationOffsetY) {
        changed = true;
        element.layout.translation.y = coverTranslationOffsetY;
      }

      break;
  }

  if (changed && deltas) {
    // Part of the render/update system involves populating a dictionary of per-element updates,
    // which explains why instead of returning a value here, we assign the updated element.
    // The 'deltas' dictionary is passed to us from the render functions upstream of here.
    deltas[element.attributes[HAIKU_ID_ATTRIBUTE]] = element;
  }
}

function isBytecode(thing) {
  return thing && typeof thing === OBJECT_TYPE && thing.template && thing.timelines;
}
