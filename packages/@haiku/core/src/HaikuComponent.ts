/**
 * Copyright (c) Haiku 2016-2018. All rights reserved.
 */

import Config from './Config';
import HaikuElement from './HaikuElement';
import HaikuContext from './HaikuContext';
import {GLOBAL_LISTENER_KEY} from './HaikuBase';
import HaikuTimeline from './HaikuTimeline';
import vanities from './properties/dom/vanities';
import consoleErrorOnce from './helpers/consoleErrorOnce';
import cssQueryList from './helpers/cssQueryList';
import xmlToMana from './helpers/xmlToMana';
import {isPreviewMode} from './helpers/interactionModes';
import isMutableProperty from './helpers/isMutableProperty';
import manaFlattenTree from './helpers/manaFlattenTree';
import scopifyElements from './helpers/scopifyElements';
import upgradeBytecodeInPlace from './helpers/upgradeBytecodeInPlace';
import Layout3D from './Layout3D';
import ValueBuilder from './ValueBuilder';
import assign from './vendor/assign';

const pkg = require('./../package.json');
export const VERSION = pkg.version;

const STRING_TYPE = 'string';
const OBJECT_TYPE = 'object';
const HAIKU_ID_ATTRIBUTE = 'haiku-id';
const DEFAULT_TIMELINE_NAME = 'Default';

const GENERIC_SELECTOR = '*';

const CSS_QUERY_MAPPING = {
  name: 'elementName',
  attributes: 'attributes',
  children: 'children',
};

/**
 * An interface for a "hot component" to patch into the renderer.
 *
 * Hot components are intended to be applied during hot editing when an immutable-looking thing happens to mutate
 * without marking the owner HaikuComponent instance for a full flush render.
 */
export interface HotComponent {
  timelineName: string;
  selector: string;
  propertyNames: string[];
}

// tslint:disable:variable-name function-name
export default class HaikuComponent extends HaikuElement {
  _alwaysFlush;
  _builder;
  _bytecode;
  _context;
  _controlFlowData;
  _flatManaTree;
  _hashTableOfIdsToElements;
  _horizonElements;
  _isDeactivated;
  _isSleeping;
  _lastDeltaPatches;
  _matchedElementCache;
  _mutableTimelines;
  _needsFullFlush;
  _renderScopes;
  _states;
  _timelineInstances;
  config;
  CORE_VERSION;
  PLAYER_VERSION;
  nestedComponentElements;
  registeredEventHandlers;
  state;

  constructor(
    bytecode: any,
    context: HaikuContext,
    config,
    container,
) {
    super();

    // We provide rudimentary support for passing the `template` as an XML string.
    if (typeof bytecode.template === STRING_TYPE) {
      console.warn('[haiku core] converting template xml string to object');
      bytecode.template = xmlToMana(bytecode.template);
    }

    if (!bytecode.template) {
      console.warn('[haiku core] adding missing template object');
      bytecode.template = {elementName: 'div', attributes: {}, children: []};
    }

    if (!bytecode.timelines) {
      console.warn('[haiku core] adding missing timelines object');
      bytecode.timelines = {};
    }

    if (!bytecode.timelines[DEFAULT_TIMELINE_NAME]) {
      console.warn('[haiku core] adding missing default timeline');
      bytecode.timelines[DEFAULT_TIMELINE_NAME] = {};
    }

    if (!context) {
      throw new Error('Component requires a context');
    }

    if (!config) {
      throw new Error('Config options required');
    }

    if (!config.seed) {
      throw new Error('Seed value must be provided');
    }

    this.PLAYER_VERSION = VERSION; // #LEGACY
    this.CORE_VERSION = VERSION;

    // Config assignment (see below) depends on this property existing
    this._bytecode = bytecode;

    assertTemplate(this._bytecode.template);

    // Allow users to expose methods that can be called in event handlers
    if (this._bytecode.methods) {
      for (const methodNameGiven in this._bytecode.methods) {
        if (!this[methodNameGiven]) {
          this[methodNameGiven] = this._bytecode.methods[methodNameGiven].bind(this);
        }
      }
    }

    this.routeEventToHandlerAndEmit(GLOBAL_LISTENER_KEY, 'component:will-initialize', [this]);

    this._context = context;

    this._builder = new ValueBuilder(this);

    this._states = {}; // Storage for getter/setter actions in userland logic
    this.state = {}; // Public accessor object, e.g. this.state.foo = 1

    // `assignConfig` calls bindStates and bindEventHandlers, because our incoming config, which
    // could occur at any point during runtime, e.g. in React, may need to update internal states, etc.
    this.assignConfig(config);

    this._timelineInstances = {};
    this._mutableTimelines = undefined;
    this._hydrateMutableTimelines();

    // The full version of the template gets mutated in-place by the rendering algorithm
    this._flatManaTree = [];

    // Ensure all __instance, __parent, etc. are properly set up and connected to the models
    this.reinitializeTree(container);

    try {
      // If the bytecode we got happens to be in an outdated format, we automatically update it to the latest.
      upgradeBytecodeInPlace(this, {
        // Random seed for adding instance uniqueness to ids at runtime.
        referenceUniqueness: (config.hotEditingMode)
          ? void (0) // During editing, Haiku.app pads ids unless this is undefined
          : Math.random().toString(36).slice(2),
      });
    } catch (e) {
      console.warn('[haiku core] caught error during attempt to upgrade bytecode in place');
    }

    // Flag used internally to determine whether we need to re-render the full tree or can survive by just patching
    this._needsFullFlush = false;

    // If true, will continually flush the entire tree until explicitly set to false again
    this._alwaysFlush = false;

    // Last computed deltas for patch rendering; important for nested components
    this._lastDeltaPatches = null;

    // Dictionary of event handler names to handler functions; used to efficiently manage multiple subscriptions
    this.registeredEventHandlers = {};

    // As a performance optimization, keep track of elements we've located as key/value (selector/element) pairs
    this._matchedElementCache = {};

    // A sort of cache with a mapping of elements to the scope in which they belong (div, svg, etc)
    this._renderScopes = {};

    // Dictionary of haiku-ids pointing to any nested components we have in the tree, used for patching
    this.nestedComponentElements = {};

    // Dictionary of ids-to-elements, for quick lookups.
    // We hydrate this with elements as we render so we don't have to query the DOM
    // to quickly load elements for patch-style rendering
    this._hashTableOfIdsToElements = {};

    // Dictionary of ids-to-elements, representing elements that we
    // do not want to render past in the tree (i.e. cede control to some
    // other rendering context)
    this._horizonElements = {};

    // Dictionary of ids-to-elements, representing control-flow operation
    // status that has occurred during the rendering process, e.g. placeholder
    // or repeat/if/yield
    this._controlFlowData = {};

    // Flag to determine whether this component should continue doing any work
    this._isDeactivated = false;

    // Flag to indicate whether we are sleeping, an ephemeral condition where no rendering occurs
    this._isSleeping = false;

    try {
      // If the bytecode we got happens to be in an outdated format, we automatically update it to the latest.
      upgradeBytecodeInPlace(this, {
        // Random seed for adding instance uniqueness to ids at runtime.
        referenceUniqueness: (config.hotEditingMode)
          ? void (0) // During editing, Haiku.app pads ids unless this is undefined
          : Math.random().toString(36).slice(2),
      });
    } catch (e) {
      console.warn('[haiku core] caught error during attempt to upgrade bytecode in place');
    }

    // Start the default timeline to initiate the component;
    // run before the did-initialize hook in case the user wants to cancel
    this.startTimeline(DEFAULT_TIMELINE_NAME);

    this.routeEventToHandlerAndEmit(GLOBAL_LISTENER_KEY, 'component:did-initialize', [this]);
  }

  /**
   * @description Track elements that are at the horizon of what we want to render, i.e., a list of
   * virtual elements that we don't want to make any updates lower than in the tree.
   */
  _markHorizonElement(virtualElement) {
    if (virtualElement && virtualElement.attributes) {
      const flexId = virtualElement.attributes[HAIKU_ID_ATTRIBUTE] || virtualElement.attributes.id;
      if (flexId) {
        this._horizonElements[flexId] = virtualElement;
      }
    }
  }

  _isHorizonElement(virtualElement) {
    if (virtualElement && virtualElement.attributes) {
      const flexId = virtualElement.attributes[HAIKU_ID_ATTRIBUTE] || virtualElement.attributes.id;
      return !!this._horizonElements[flexId];
    }
    return false;
  }

  _getRealElementAtId(flexId) {
    return this._hashTableOfIdsToElements[flexId];
  }

  /**
   * @description We store DOM elements in a lookup table keyed by their id so we can do fast patches.
   * This is a hook that allows e.g. the ReactDOMAdapter to push elements into the list if it mutates the DOM.
   * e.g. during control flow
   */
  _addElementToHashTable(realElement, virtualElement) {
    if (virtualElement && virtualElement.attributes) {
      const flexId = virtualElement.attributes['haiku-id'] || virtualElement.attributes.id;

      // Don't add if there is no id, otherwise we'll end up tracking a bunch
      // of elements all sharing a key such as `undefined` or `null` etc.
      if (flexId) {
        this._hashTableOfIdsToElements[flexId] = realElement;
      }
    }
  }

  /**
   * @description Keep track of whether a given element has rendered its surrogate, i.e.
   * an element passed to it as a placeholder. This is used in the renderer to determine
   * whether the element needs to be temporarily invisible to avoid a flash of content while
   * rendering occurs
   */
  _didElementRenderSurrogate(
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
  }

  _markElementSurrogateAsRendered(
    virtualElement,
    surrogatePlacementKey,
    surrogateObject,
  ) {
    const flexId = (
      virtualElement &&
      virtualElement.attributes && (
        virtualElement.attributes['haiku-id'] ||
        virtualElement.attributes.id
      )
    );

    if (flexId) {
      if (!this._controlFlowData[flexId]) {
        this._controlFlowData[flexId] = {};
      }
      if (!this._controlFlowData[flexId].renderedSurrogates) {
        this._controlFlowData[flexId].renderedSurrogates = {};
      }
      this._controlFlowData[flexId].renderedSurrogates[surrogatePlacementKey] = surrogateObject;
    }
  }

  // If the component needs to remount itself for some reason, make sure we fire the right events
  callRemount(incomingConfig, skipMarkForFullFlush) {
    this.routeEventToHandlerAndEmit(GLOBAL_LISTENER_KEY, 'component:will-mount', [this]);

    // Note!: Only update config if we actually got incoming options!
    if (incomingConfig) {
      this.assignConfig(incomingConfig);
    }

    if (!skipMarkForFullFlush) {
      this._markForFullFlush();
      this.clearCaches(null);
    }

    // If autoplay is not wanted, stop the all timelines immediately after we've mounted
    // (We have to mount first so that the component displays, but then pause it at that state.)
    // If you don't want the component to show up at all, use options.automount=false.
    const timelineInstances = this.getTimelines();
    for (const timelineName in timelineInstances) {
      const timelineInstance = timelineInstances[timelineName];

      if (this.config.autoplay) {
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

    this.routeEventToHandlerAndEmit(GLOBAL_LISTENER_KEY, 'component:did-mount', [this]);
  }

  callUnmount(incomingConfig) {
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

    this.routeEventToHandlerAndEmit(GLOBAL_LISTENER_KEY, 'component:will-unmount', [this]);
  }

  assignConfig(incomingConfig) {
    this.config = Config.build(this.config || {}, incomingConfig || {});

    // Don't forget to update the configuration values shared by the context,
    // but skip component assignment so we don't end up in an infinite loop
    this._context.assignConfig(this.config, {skipComponentAssign: true});

    for (const timelineName in this._timelineInstances) {
      const timelineInstance = this._timelineInstances[timelineName];
      timelineInstance.assignOptions(this.config);
    }

    bindStates(this._states, this, this.config.states);

    bindEventHandlers(this, this.config.eventHandlers);

    assign(this._bytecode.timelines, this.config.timelines);

    return this;
  }

  set(key, value) {
    this.state[key] = value;
    return this;
  }

  get(key) {
    return this.state[key];
  }

  setState(states) {
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
  }

  getStates() {
    return this.state;
  }

  clearCaches(options = {}) {
    this._states = {};

    // Don't forget to repopulate the states with originals when we cc otherwise folks
    // who depend on initial states being set will be SAD!
    if (options['clearStates'] !== false) {
      bindStates(this._states, this, this.config.states);
    }

    // Gotta bind any event handlers that may have been dynamically added
    if (options['clearEventHandlers'] !== false) {
      bindEventHandlers(this, this.config.eventHandlers);
    }

    this._needsFullFlush = false;
    this._lastDeltaPatches = null;

    this._renderScopes = {};
    this._controlFlowData = {};

    this._rehydrateFlatManaTree();
    this._matchedElementCache = {};
    this._builder.clearCaches(options);
    this._hydrateMutableTimelines();

    // These may have been set for caching purposes
    if (this._bytecode.timelines) {
      for (const timelineName in this._bytecode.timelines) {
        delete this._bytecode.timelines[timelineName].__max;
      }
    }

    return this;
  }

  getClock() {
    return this._context.getClock();
  }

  getTemplate(): any {
    return this._bytecode.template;
  }

  getTimelines() {
    return this.fetchTimelines();
  }

  fetchTimelines() {
    const names = Object.keys(this._bytecode.timelines);

    for (let i = 0; i < names.length; i++) {
      const name = names[i];

      if (!name) {
        continue;
      }

      const descriptor = this.getTimelineDescriptor(name);
      const existing = this._timelineInstances[name];

      if (!existing) {
        this._timelineInstances[name] = new HaikuTimeline(
          this,
          name,
          descriptor,
          this.config,
        );
      }
    }

    return this._timelineInstances;
  }

  getTimeline(name) {
    return this.getTimelines()[name];
  }

  getDefaultTimeline() {
    const timelines = this.getTimelines();
    return timelines[DEFAULT_TIMELINE_NAME];
  }

  stopAllTimelines() {
    for (const timelineName in this._timelineInstances) {
      this.stopTimeline(timelineName);
    }
  }

  startAllTimelines() {
    for (const timelineName in this._timelineInstances) {
      this.startTimeline(timelineName);
    }
  }

  startTimeline(timelineName) {
    const time = this._context.clock.getExplicitTime();
    const descriptor = this.getTimelineDescriptor(timelineName);
    const existing = this._timelineInstances[timelineName];
    if (existing) {
      existing.start(time, descriptor);
    } else {
      // As a convenience we auto-initialize timeline if the user is trying to start one that hasn't initialized yet
      const fresh = new HaikuTimeline(this, timelineName, descriptor, this.config);
      fresh.start(time, descriptor); // Initialization alone doesn't start the timeline, so we start it explicitly
      this._timelineInstances[timelineName] = fresh; // Don't forget to add it to our collection
    }
  }

  stopTimeline(timelineName) {
    const time = this._context.clock.getExplicitTime();
    const descriptor = this.getTimelineDescriptor(timelineName);
    const existing = this._timelineInstances[timelineName];
    if (existing) {
      existing.stop(time, descriptor);
    }
  }

  getTimelineDescriptor(timelineName) {
    return this._bytecode.timelines[timelineName];
  }

  getInjectables(element) {
    const injectables = {};

    assign(injectables, this._builder.getSummonablesSchema(element));

    // Local states get precedence over global summonables, so assign them last
    for (const key in this._states) {
      let type = this._states[key].type;
      if (!type) {
        type = typeof this._states[key];
      }
      injectables[key] = type;
    }

    return injectables;
  }

  /**
   * @method _deactivate
   * @description When hot-reloading a component during editing, this can be used to
   * ensure that this component doesn't keep updating after its replacement is loaded.
   */
  deactivate() {
    this._isDeactivated = true;
    return this;
  }

  isDeactivated() {
    return this._isDeactivated;
  }

  sleepOn() {
    this._isSleeping = true;
    return this;
  }

  sleepOff() {
    this._isSleeping = false;
    return this;
  }

  isSleeping() {
    return this._isSleeping;
  }

  /**
   * @method dump
   * @description Dump serializable info about this object
   */
  dump() {
    const metadata = this.getBytecodeMetadata();
    return `${metadata.relpath}:${this.getComponentId()}`;
  }

  getBytecodeMetadata() {
    return this._bytecode.metadata;
  }

  getAddressableProperties(out = {}) {
    if (!this._bytecode.states) {
      return out;
    }

    for (const name in this._bytecode.states) {
      const state = this._bytecode.states[name];

      out[name] = {
        name,
        type: 'state', // As opposed to a 'native' property like fill-rule
        prefix: name, // States aren't named like rotation.x, so there is no 'prefix'
        suffix: undefined, // States aren't named like rotation.x, so there is no 'suffix'
        fallback: state.value, // Weird nomenclature: In Haiku.app, fallback means the default value
        typedef: state.type, // Weird nomenclature: In Haiku.app, typedef just means the runtime type
        mock: state.mock, // Just in case needed by someone
        target: this, // Used for tracking convenience; may also be an 'element'; do not remove
        value: () => { // Lazy because this may change over time and we don't want to require re-query
          return this.state[name]; // The current live value of this state as seen by the app
        },
      };
    }

    return out;
  }

  eachEventHandler (iteratee: Function) {
    if (this._bytecode.eventHandlers) {
      for (const eventSelector in this._bytecode.eventHandlers) {
        for (const eventName in this._bytecode.eventHandlers[eventSelector]) {
          iteratee(
            eventSelector,
            eventName,
            this._bytecode.eventHandlers[eventSelector][eventName],
          );
        }
      }
    }
  }

  routeEventToHandler(
    eventSelectorGiven: string,
    eventNameGiven: string,
    eventArgs: any,
  ) {
    this.eachEventHandler((eventSelector, eventName, {handler}) => {
      if (eventNameGiven === eventName) {
        if (
          eventSelectorGiven === eventSelector ||
          eventSelectorGiven === GLOBAL_LISTENER_KEY
        ) {
          handler.apply(this, eventArgs);
          return;
        }
      }
    });  
  }

  routeEventToHandlerAndEmit(
    eventSelectorGiven: string,
    eventNameGiven: string,
    eventArgs: any,
  ) {
    this.routeEventToHandler(eventSelectorGiven, eventNameGiven, eventArgs);
    this.emit(eventNameGiven, ...eventArgs);
  }

  _markForFullFlush() {
    this._needsFullFlush = true;
    return this;
  }

  _unmarkForFullFlush() {
    this._needsFullFlush = false;
    return this;
  }

  _shouldPerformFullFlush() {
    return this._needsFullFlush || this._alwaysFlush;
  }

  patch(container, patchOptions, skipCache = false) {
    if (this.isDeactivated()) {
      // If deactivated, pretend like there is nothing to render
      return {};
    }

    const time = this._context.clock.getExplicitTime();

    // TODO: Determine if controlFlow directives might necessitate recalculation of the mana tree (e.g. due to $repeat).
    const timelinesRunning = [];
    for (const timelineName in this._timelineInstances) {
      const timeline = this._timelineInstances[timelineName];
      if (timeline.isPlaying()) {
        timeline.doUpdateWithGlobalClockTime(time);
      }

      // The default timeline is always considered to be running
      if (timelineName === 'Default' || !timeline.isFinished()) {
        timelinesRunning.push(timeline);
      }
    }

    this._lastDeltaPatches = gatherDeltaPatches(
      this,
      this.getTemplate(),
      container,
      this._context,
      timelinesRunning,
      patchOptions,
      skipCache,
    );

    for (const flexId in this.nestedComponentElements) {
      const compElement = this.nestedComponentElements[flexId];
      this._lastDeltaPatches[flexId] = compElement;
      compElement.__instance.patch(compElement, {});
    }

    return this._lastDeltaPatches;
  }

  _getPrecalcedPatches() {
    if (this.isDeactivated()) {
      // If deactivated, pretend like there is nothing to render
      return {};
    }
    return this._lastDeltaPatches || {};
  }

  /**
   * @method _rehydrateFlatManaTree
   * @private
   * @description The _flatManaTree is a cache of the flattened list of all elements in our
   * tree; when the tree changes we need to repopulate it with the new set of elements.
   * This method is essentially a cache invalidator.
   */
  _rehydrateFlatManaTree() {
    this._flatManaTree = manaFlattenTree(this.getTemplate(), CSS_QUERY_MAPPING);
    return this._flatManaTree;
  }

  renderUsingOwnContext() {
    return this._context.render();
  }

  reinitializeTree(container) {
    initializeComponentTree(
      container,
      null, // host
      this._context,
      this, // instance
    );
  }

  render(container, renderOptions) {
    if (this.isDeactivated()) {
      // If deactivated, pretend like there is nothing to render
      return;
    }

    this.reinitializeTree(container);

    const time = this._context.clock.getExplicitTime();

    const prevFlatManaTreeLen = this._flatManaTree.length;
    this._rehydrateFlatManaTree();

    // Use a changing number of elements as a heuristic to decide whether we need to
    // force a re-query of the tree. For example, take a situation where a new component
    // has been added to the tree post-hoc, and the element cache for its query selector
    // had contained [], a truthy value that would be returned from the cache
    if (prevFlatManaTreeLen.length !== this._flatManaTree.length) {
      this._matchedElementCache = {};
    }

    for (const timelineName in this._timelineInstances) {
      const timeline = this._timelineInstances[timelineName];
      if (timeline.isPlaying()) {
        timeline.doUpdateWithGlobalClockTime(time);
      }
    }

    // 1. Update the tree in place using all of the applied values we got from the timelines
    applyContextChanges(
      this,
      this.getTemplate(),
      container,
      this._context,
      renderOptions || {},
    );

    // 2. Given the above updates, 'expand' the tree to its final form;
    // this is the object that we use to flush to the rendering medium
    const templateExpansion = expandTreeNode(
      this.getTemplate(),
      this,
      this._context,
    );

    // We've done the render so we don't need to flush anymore
    this._unmarkForFullFlush();

    return templateExpansion;
  }

  findElementsByHaikuId(componentId) {
    return findMatchingElementsByCssSelector('haiku:' + componentId, this._flatManaTree, this._matchedElementCache);
  }

  _hydrateMutableTimelines() {
    this._mutableTimelines = {};
    if (this._bytecode.timelines) {
      for (const timelineName in this._bytecode.timelines) {
        for (const selector in this._bytecode.timelines[timelineName]) {
          for (const propertyName in this._bytecode.timelines[timelineName][selector]) {
            if (isMutableProperty(this._bytecode.timelines[timelineName][selector][propertyName], propertyName)) {
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
  }

  addHotComponent(hotComponent: HotComponent) {
    if (
      !this._bytecode.timelines ||
      !this._bytecode.timelines[hotComponent.timelineName] ||
      !this._bytecode.timelines[hotComponent.timelineName][hotComponent.selector]
    ) {
      return;
    }

    const propertyGroup = this._bytecode.timelines[hotComponent.timelineName][hotComponent.selector];

    const timeline = this._mutableTimelines[hotComponent.timelineName] || {};
    const mutablePropertyGroup = timeline[hotComponent.selector] || {};

    this._mutableTimelines = {
      ...this._mutableTimelines,
      [hotComponent.timelineName]: {
        ...timeline,
        [hotComponent.selector]: {
          ...mutablePropertyGroup,
          ...hotComponent.propertyNames.reduce(
            (hotProperties, propertyName) => (hotProperties[propertyName] = propertyGroup[propertyName], hotProperties),
            {},
          ),
        },
      },
    };
  }
}

function isBytecode(thing) {
  return thing && typeof thing === OBJECT_TYPE && thing.template;
}

export const initializeComponentTree = (
  node,
  host,
  context,
  instance,
) => {
  if (node && typeof node === 'object') {
    // Give it a pointer back to the host context; used by HaikuElement
    node.__context = context;
  }

  // In addition to plain objects, a sub-node can also be a component,
  // which we currently detect by checking to see if it looks like 'bytecode'
  // Don't instantiate a second time if we already have the instance at this node
  if (isBytecode(node.elementName)) {
    // Allow an instance to be passed in if we happen to already have one representing this node.
    if (instance) {
      node.__instance = instance;
    }

    // In the default behavior mode (not in Haiku.app), we instantiate an instance only if we don't
    // have one in memory already, since we can be assured that we don't handle hot replacements.
    if (!node.__instance) {
      node.__instance = new HaikuComponent(
        node.elementName,
        context,
        context.config,
        node, // container
      );
    }

    HaikuElement['connectNodeWithElement'](node, node.__instance);

    if (host) {
      const flexId = (
        node &&
        node.attributes &&
        (node.attributes[HAIKU_ID_ATTRIBUTE] || node.attributes.id)
      );

      host.nestedComponentElements[flexId] = node;

      if (node.__instance) {
        // Clear the previous listener (avoid multiple subscriptions to the same event)
        if (node.__listener) {
          node.__instance.off('*', node.__listener);
        }

        node.__listener = (key, ...args) => {
          host.routeEventToHandler(
            `haiku:${flexId}`,
            key,
            [node.instance].concat(args),
          );
        };

        // Bubble emitted events to the host component so it can subscribe declaratively
        node.__instance.on('*', node.__listener);
      }
    }
  }

  if (node && typeof node === 'object' && node.children) {
    for (let i = 0; i < node.children.length; i++) {
      const child = node.children[i];

      if (child && typeof child === 'object') {
        // Renderers depend on access to the renderable node's parent
        child.__parent = node;

        initializeComponentTree(
          child,
          host,
          context,
          null,
        );
      }
    }
  }
};

function assertTemplate(template) {
  if (!template) {
    throw new Error('Empty template not allowed');
  }

  if (typeof template === OBJECT_TYPE) {
    if (template.attributes) {
      if (!template.attributes[HAIKU_ID_ATTRIBUTE]) {
        console.warn('[haiku core] bytecode template has no id');
      }
    } else {
      console.warn('[haiku core] bytecode template has no attributes');
    }

    if (!template.elementName) {
      console.warn('[haiku core] unexpected bytecode template format');
    }

    return template;
  }

  throw new Error('Unknown bytecode template format');
}

function bindEventHandlers(component, extraEventHandlers) {
  const allEventHandlers = assign(
    {},
    component._bytecode.eventHandlers,
    extraEventHandlers,
  );

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

  eventHandlerDescriptor.handler = (event, ...args) => {
    // Only fire the event listeners if the component is in 'live' interaction mode,
    // i.e., not currently being edited inside the Haiku authoring environment
    if (isPreviewMode(component.config.interactionMode)) {
      try {
        eventHandlerDescriptor.original.call(component, event, ...args);
      } catch (exception) {
        consoleErrorOnce(exception);
        return 1;
      }
    }
  };
}

function stateSpecValidityCheck(stateSpec: any, stateSpecName: string): boolean {
  if (
    stateSpec.type === 'any' ||
    stateSpec.type === '*' ||
    stateSpec.type === undefined ||
    stateSpec.type === null
  ) {
    return true;
  }

  if (stateSpec.type === 'event' || stateSpec.type === 'listener') {
    if (
      typeof stateSpec.value !== 'function' &&
      stateSpec.value !== null &&
      stateSpec.value !== undefined
    ) {
      console.error(
        'Property value `' +
        stateSpecName +
        '` must be an event listener function',
      );

      return false;
    }

    return true;
  }

  if (stateSpec.type === 'array') {
    if (!Array.isArray(stateSpec.value)) {
      console.error(
        'Property value `' + stateSpecName + '` must be an array',
      );

      return false;
    }
  } else if (stateSpec.type === 'object') {
    if (stateSpec.value && typeof stateSpec.value !== 'object') {
      console.error(
        'Property value `' + stateSpecName + '` must be an object',
      );

      return false;
    }
  } else {
    if (typeof stateSpec.value !== stateSpec.type) {
      console.error(
        'Property value `' + stateSpecName + '` must be a `' + stateSpec.type + '`',
      );

      return false;
    }
  }

  return true;
}

function bindStates(statesTargetObject, component, extraStates) {
  const allStates = assign({}, component._bytecode.states, extraStates);

  for (const stateSpecName in allStates) {
    const stateSpec = allStates[stateSpecName];

    // 'null' is the signal for an empty prop, not undefined.
    if (stateSpec.value === undefined) {
      console.error(
        'Property `' +
        stateSpecName +
        '` cannot be undefined; use null for empty states',
      );

      continue;
    }

    const isValid = stateSpecValidityCheck(stateSpec, stateSpecName);

    if (isValid) {
      statesTargetObject[stateSpecName] = stateSpec.value;

      defineSettableState(component, component.state, statesTargetObject, stateSpec, stateSpecName);
    }
  }
}

function defineSettableState(
  component,
  statesHostObject,
  statesTargetObject,
  stateSpec,
  stateSpecName,
) {
  // Note: We define the getter/setter on the object itself, but the storage occurs on the pass-in statesTargetObject
  Object.defineProperty(statesHostObject, stateSpecName, {
    configurable: true,

    get: function get() {
      return statesTargetObject[stateSpecName];
    },

    set: function set(inputValue) {
      if (stateSpec.setter) {
        // Important: We call the setter with a binding of the component, so it can access methods on `this`
        statesTargetObject[stateSpecName] = stateSpec.setter.call(
          component,
          inputValue,
        );
      } else {
        statesTargetObject[stateSpecName] = inputValue;
      }

      component.emit('state:set', stateSpecName, statesTargetObject[stateSpecName]);

      return statesTargetObject[stateSpecName];
    },
  });
}

function applyBehaviors(
  timelinesRunning,
  deltas,
  component,
  context,
  isPatchOperation,
  skipCache = false,
) {
  for (let i = 0; i < timelinesRunning.length; i++) {
    const timelineInstance = timelinesRunning[i];
    const timelineName = timelineInstance.getName();

    // In hot editing mode, any timeline is fair game for mutation,
    // even if it's not actually animated (e.g. dragging an SVG at keyframe 0).
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

        const assembledOutputs = component._builder.build(
          {}, // We provide an object onto which outputs are placed
          timelineName,
          timelineTime,
          flexId,
          matchingElement,
          propertiesGroup,
          isPatchOperation,
          component,
          skipCache,
        );

        // If assembledOutputs is empty, that signals that nothing has changed
        if (assembledOutputs && deltas && flexId) {
          deltas[flexId] = matchingElement;
        }

        if (assembledOutputs) {
          for (const behaviorKey in assembledOutputs) {
            const behaviorValue = assembledOutputs[behaviorKey];

            applyPropertyToElement(
              matchingElement,
              behaviorKey,
              behaviorValue,
              context,
              component,
            );
          }
        }
      }
    }
  }
}

function gatherDeltaPatches(
  component,
  template,
  container,
  context,
  timelinesRunning,
  patchOptions,
  skipCache = false,
) {
  // This is what we're going to return: a dictionary of ids to elements
  const deltas = {};

  Layout3D.initializeTreeAttributes(template, container);

  applyBehaviors(
    timelinesRunning,
    deltas,
    component,
    context,
    true, // isPatchOperation
    skipCache,
  );

  if (patchOptions.sizing) {
    computeAndApplyPresetSizing(
      template,
      container,
      patchOptions.sizing,
      deltas,
    );
  }

  // TODO: Calculating the tree layout should be skipped for already visited node
  // that we have already calculated among the descendants of the changed one
  for (const flexId in deltas) {
    const changedNode = deltas[flexId];

    computeAndApplyTreeLayouts(
      changedNode,
      changedNode.__parent,
      patchOptions,
      context,
    );
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

      // For any timeline other than the default, shut it down if it has gone past
      // its final keyframe. The default timeline is a special case which provides
      // fallbacks/behavior that is essentially true throughout the lifespan of the component
      if (timeline.isFinished() && timelineName !== DEFAULT_TIMELINE_NAME) {
        continue;
      }

      timelinesRunning.push(timeline);
    }
  }

  Layout3D.initializeTreeAttributes(template, container);

  scopifyElements(template, null, null);

  applyBehaviors(
    timelinesRunning,
    null,
    component,
    context,
    false, // isPatchOperation
  );

  component.eachEventHandler((eventSelector, eventName, {handler}) => {
    if (component.registeredEventHandlers[eventName]) {
      return;
    }

    component.registeredEventHandlers[eventName] = true;

    component._context.renderer.mountEventListener(eventSelector, eventName, (...args) => {
      component.routeEventToHandlerAndEmit(eventSelector, eventName, args);
    });
  });

  if (renderOptions.sizing) {
    computeAndApplyPresetSizing(
      template,
      container,
      renderOptions.sizing,
      null,
    );
  }

  computeAndApplyTreeLayouts(
    template,
    container,
    renderOptions,
    context,
  );

  return template;
}

function applyPropertyToElement(
  element,
  name,
  value,
  context,
  component,
) {
  let type;

  if (element.__instance) {
    // Assume that nested components are always wrapped in a div
    type = 'div';

    // See if the instance at this node will allow us to apply this property
    const addressables = element.__instance.getAddressableProperties();
    if (addressables[name] !== undefined) {
      // Call the 'setter' of the given addressable property
      element.__instance.state[name] = value;
    }

    // Still apply known vanities even if the name collides with the addressable
    // This is important for components that want to handle e.g. size internally
    // but still want their wrapper element to display correctly
    if (vanities[type] && vanities[type][name]) {
      vanities[type][name](name, element, value, context, component);
    }
  } else {
    // Assume we're dealing with a normal built-in render node
    type = element.elementName;

    // Use the vanity if provided, otherwise fallback to attributes
    if (vanities[type] && vanities[type][name]) {
      vanities[type][name](name, element, value, context, component);
    } else {
      element.attributes[name] = value;
    }
  }
}

function expandTreeNode(node, component, context) {
  // Nothing to expand if the node happens to be text or another unexpected type
  if (!node || typeof node !== 'object') {
    return node;
  }

  // Handlers attach first since they may want to respond to an immediate property setter
  if (node.__handlers) {
    for (const key in node.__handlers) {
      const handler = node.__handlers[key];

      // Don't subscribe twice!
      if (!handler.__subscribed) {
        if (node.__instance) { // We might have a component from a system that doesn't adhere to our own internal API
          if (node.__instance.instance) {
            node.__instance.instance.on(key, handler);
            handler.__subscribed = true;
          }
        }
      }
    }
  }

  if (node.__instance) {
    // Call render on the interior node to get its full subtree, and recurse
    const subtree = node.__instance.render(
      node,
      node.__instance.config,
    );

    // No subtree usually indicates that the instance has been deactivated upstream
    // which can occur during module replacement while editing in Haiku.app
    if (subtree) {
      node.children = [
        expandTreeNode(
          subtree,
          node.__instance,
          context,
        ),
      ];
    }

    return node;
  }

  if (typeof node.elementName === STRING_TYPE && node.children) {
    for (let i = 0; i < node.children.length; i++) {
      node.children[i] = expandTreeNode(
        node.children[i],
        component,
        context,
      );
    }

    return node;
  }

  // If we got here, we either completed recursion or there's nothing to do
  return node;
}

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
  // No point proceeding if our parent element doesn't have a computed layout
  if (parent && parent.layout && parent.layout.computed) {
    const parentSize = parent.layout.computed.size;

    // Don't assume the element has/needs a layout, for example, control-flow injectees
    if (element.layout && element.layout.matrix) {
      element.layout.computed = Layout3D.computeLayout(
        element.layout,
        element.layout.matrix,
        parentSize,
      );
    }
  }
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
    element.attributes.style['transform-origin'] = '0% 0% 0px';
  }

  // IMPORTANT: If any value has been changed on the element, you must set this to true.
  // Otherwise the changed object won't go into the deltas dictionary, and the element won't update.
  let changed = false;

  switch (mode) {
    // Make the base element its default scale, which is just a multiplier of one. This is the default.
    case 'normal':
      if (element.layout.scale.x !== 1.0 || element.layout.scale.y !== 1.0) {
        changed = true;
        element.layout.scale.x = element.layout.scale.y = 1.0;
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
      if (~~(scaleDiffX * elementHeight) >= containerHeight) {
        coverScaleToUse = scaleDiffX;
      } else if (~~(scaleDiffY * elementWidth) >= containerWidth) {
        coverScaleToUse = scaleDiffY;
      } else {
        coverScaleToUse = Math.max(scaleDiffX, scaleDiffY);
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

HaikuComponent['PLAYER_VERSION'] = VERSION; // #LEGACY
HaikuComponent['CORE_VERSION'] = VERSION;
