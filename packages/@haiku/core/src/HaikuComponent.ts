/**
 * Copyright (c) Haiku 2016-2018. All rights reserved.
 */

import {
  BytecodeNode,
  BytecodeOptions,
  Curve,
  HaikuBytecode,
  IExpandResult,
  IHaikuContext,
  ParsedValueCluster,
} from './api';
import Config from './Config';
import HaikuBase, {GLOBAL_LISTENER_KEY} from './HaikuBase';
import HaikuClock from './HaikuClock';
import HaikuElement from './HaikuElement';
import HaikuHelpers from './HaikuHelpers';
import {ascend, cssMatchOne, cssQueryTree, visit, xmlToMana} from './HaikuNode';
import HaikuTimeline, {PlaybackSetting, TimeUnit} from './HaikuTimeline';
import ColorUtils from './helpers/ColorUtils';
import consoleErrorOnce from './helpers/consoleErrorOnce';
import {isLiveMode} from './helpers/interactionModes';
import isMutableProperty from './helpers/isMutableProperty';
import {synchronizePathStructure} from './helpers/PathUtil';
import SVGPoints from './helpers/SVGPoints';
import Layout3D from './Layout3D';
import {
  runMigrationsPostPhase,
  runMigrationsPrePhase,
} from './Migration';
import enhance from './reflection/enhance';
import functionToRFO, {RFO} from './reflection/functionToRFO';
import StateTransitionManager, {StateTransitionParameters, StateValues} from './StateTransitionManager';
import Transitions from './Transitions';
import assign from './vendor/assign';
import {CurveSpec} from './vendor/svg-points/types';

const FUNCTION = 'function';
const KEYFRAME_ZERO = 0;
const OBJECT = 'object';
const MAX_INT = 2147483646;
const SCOPE_STRATA = {div: 'div', svg: 'svg'};

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

const isFunction = (value) => {
  return typeof value === FUNCTION;
};

const INJECTABLES: any = {};

declare var window: any;

const pkg = require('./../package.json');
const VERSION = pkg.version;

const STRING_TYPE = 'string';
const OBJECT_TYPE = 'object';
const HAIKU_ID_ATTRIBUTE = 'haiku-id';
const DEFAULT_TIMELINE_NAME = 'Default';

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

export interface ClearCacheOptions {
  clearStates?: boolean;
}

const templateIsString = (
  template: BytecodeNode|string,
): template is string => typeof template === STRING_TYPE;

// tslint:disable:variable-name function-name
export default class HaikuComponent extends HaikuElement {
  isDeactivated;
  isSleeping;
  _mutableTimelines;
  _states;

  bytecode;
  /**
   * @deprecated
   */
  _bytecode;
  config;
  container;
  context: IHaikuContext;
  CORE_VERSION;
  doAlwaysFlush;
  doesNeedFullFlush;
  doPreserve3d;
  guests: {[haikuId: string]: HaikuComponent};
  helpers;
  host: HaikuComponent;
  playback;
  PLAYER_VERSION;
  registeredEventHandlers;
  state;
  stateTransitionManager: StateTransitionManager;

  constructor (
    bytecode: HaikuBytecode,
    context: IHaikuContext,
    host: HaikuComponent,
    config: BytecodeOptions,
    container,
  ) {
    super();

    // We provide rudimentary support for passing the `template` as an XML string.
    if (templateIsString(bytecode.template)) {
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

    this.context = context;
    this.container = container;

    this.host = host;
    this.guests = {};

    this.bytecode = (config.hotEditingMode)
      ? bytecode
      : clone(bytecode, this); // Important because migrations mutate the bytecode

    assertTemplate(this.bytecode.template);

    // Allow users to expose methods that can be called in event handlers
    if (this.bytecode.methods) {
      for (const methodNameGiven in this.bytecode.methods) {
        if (!this[methodNameGiven]) {
          this[methodNameGiven] = this.bytecode.methods[methodNameGiven].bind(this);
        }
      }
    }

    this._states = {}; // Storage for getter/setter actions in userland logic
    this.state = {}; // Public accessor object, e.g. this.state.foo = 1

    // Instantiate StateTransitions. Responsible to store and execute any state transition.
    this.stateTransitionManager = new StateTransitionManager(this);

    // `assignConfig` calls bindStates because our incoming config, which
    // could occur at any point during runtime, e.g. in React, may need to update internal states, etc.
    this.assignConfig(config);

    this._mutableTimelines = undefined;
    this._hydrateMutableTimelines();

    // Flag used internally to determine whether we need to re-render the full tree or can survive by just patching
    this.doesNeedFullFlush = false;

    // If true, will continually flush the entire tree until explicitly set to false again
    this.doAlwaysFlush = false;

    // If true, the component will assign 3D-preservation setting if one hasn't been set explicitly.
    // If config.preserve3d is 'auto', the migration pre-phase will try to detect whether 3d is needed.
    this.doPreserve3d = (this.config.preserve3d === true) ? true : false;

    // Dictionary of event handler names to handler functions; used to efficiently manage multiple subscriptions
    this.registeredEventHandlers = {};

    // Flag to determine whether this component should continue doing any work
    this.isDeactivated = false;

    // Flag to indicate whether we are sleeping, an ephemeral condition where no rendering occurs
    this.isSleeping = false;

    this.helpers = {
      data: {},
    };

    for (const helperName in HaikuHelpers.helpers) {
      this.helpers[helperName] = HaikuHelpers.helpers[helperName];
    }

    this.helpers.now = () => {
      if (isLiveMode(this.config.interactionMode)) {
        return (this.config.timestamp || 1) + (this.helpers.data.lastTimelineTime || 1);
      }

      return 1;
    };

    this.helpers.rand = () => {
      if (isLiveMode(this.config.interactionMode)) {
        const scopeKey = [
          this.helpers.data.lastTimelineName,
          this.helpers.data.lastTimelineTime,
          this.helpers.data.lastPropertyName,
          this.helpers.data.lastFlexId,
        ].join('|');

        const randKey = `${this.config.seed}@${scopeKey}`;

        const keyInt = stringToInt(randKey);

        const outFloat = ((keyInt + 1) % MAX_INT) / MAX_INT;

        return outFloat;
      }

      return 1;
    };

    this.helpers.find = (selector) => {
      return this.querySelectorAll(selector);
    };

    try {
      runMigrationsPrePhase(this, {/*options*/}, VERSION);
    } catch (exception) {
      console.warn('[haiku core] caught error during migration pre-phase', exception);
    }

    // Ensure full tree is are properly set up and all render nodes are connected to their models
    this.render({...this.config, forceApplyBehaviors: true});

    try {
      // If the bytecode we got happens to be in an outdated format, we automatically update it to the latest.
      runMigrationsPostPhase(
        this,
        {
          attrsHyphToCamel: ATTRS_HYPH_TO_CAMEL,
          // Random seed for adding instance uniqueness to ids at runtime.
          referenceUniqueness: (config.hotEditingMode)
            ? undefined // During editing, Haiku.app pads ids unless this is undefined
            : Math.random().toString(36).slice(2),
        },
        VERSION,
      );
    } catch (exception) {
      console.warn('[haiku core] caught error during migration post-phase', exception);
    }

    // Start the default timeline to initiate the component;
    // run before the did-initialize hook in case the user wants to cancel
    this.startTimeline(DEFAULT_TIMELINE_NAME);

    this.routeEventToHandlerAndEmit(GLOBAL_LISTENER_KEY, 'component:did-initialize', [this]);

    // #FIXME: some handlers may still reference `_bytecode` directly.
    this._bytecode = this.bytecode;
  }

  /**
   * @description Track elements that are at the horizon of what we want to render, i.e., a list of
   * virtual elements that we don't want to make any updates lower than in the tree.
   */
  markHorizonElement (virtualElement) {
    if (virtualElement && virtualElement.attributes) {
      virtualElement.__horizon = true;
    }
  }

  /**
   * @description Returns true/false whether this element is one that we don't want to make any
   *  updates further down its tree.
   */
  isHorizonElement (virtualElement): boolean {
    if (virtualElement && virtualElement.attributes) {
      return virtualElement.__horizon;
    }
    return false;
  }

  registerGuest (subcomponent: HaikuComponent) {
    this.guests[subcomponent.getId()] = subcomponent;
  }

  visitGuestHierarchy (visitor: Function) {
    visitor(this, this.$id, this.host);
    for (const $id in this.guests) {
      this.guests[$id].visitGuestHierarchy(visitor);
    }
  }

  // If the component needs to remount itself for some reason, make sure we fire the right events
  callRemount (incomingConfig, skipMarkForFullFlush = false) {
    this.routeEventToHandlerAndEmit(GLOBAL_LISTENER_KEY, 'component:will-mount', [this]);

    // Note!: Only update config if we actually got incoming options!
    if (incomingConfig) {
      this.assignConfig(incomingConfig);
    }

    if (!skipMarkForFullFlush) {
      this.markForFullFlush();
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
          // timeline.play() will normally trigger markForFullFlush because it assumes we need to render
          // from the get-go. However, in case of a callRemount, we might not want to do that since it can be kind of
          // like running the first frame twice. So we pass the option into play so it can conditionally skip the
          // markForFullFlush step.
          if (!timelineInstance.isExplicitlyPaused()) {
            timelineInstance.play({skipMarkForFullFlush});
          }
        }
      } else {
        timelineInstance.pause();
      }
    }

    this.context.contextMount();

    this.routeEventToHandlerAndEmit(GLOBAL_LISTENER_KEY, 'component:did-mount', [this]);
  }

  destroy () {
    super.destroy();
    // Destroy all timelines we host.
    const timelineInstances = this.getTimelines();
    for (const timelineName in timelineInstances) {
      const timelineInstance = timelineInstances[timelineName];
      timelineInstance.destroy();
    }

    this.visitGuestHierarchy((component) => {
      // Clean up HaikuComponent dependents.
      // TODO: is this step necessary?
      if (component !== this) {
        component.destroy();
      }
    });

    this.visitDescendants((child) => {
      // Clean up HaikuElement dependents.
      child.destroy();
    });
  }

  callUnmount () {
    // Since we're unmounting, pause all animations to avoid unnecessary calc while detached
    const timelineInstances = this.getTimelines();
    for (const timelineName in timelineInstances) {
      const timelineInstance = timelineInstances[timelineName];
      timelineInstance.pause();
    }

    this.context.contextUnmount();

    this.routeEventToHandlerAndEmit(GLOBAL_LISTENER_KEY, 'component:will-unmount', [this]);
  }

  assignConfig (incomingConfig) {
    this.config = Config.build(this.config || {}, incomingConfig || {});

    // Don't assign the context config if we're a guest component;
    // assume only the top-level component should have this power
    if (this.host) {
      // Don't forget to update the configuration values shared by the context,
      // but skip component assignment so we don't end up in an infinite loop
      this.context.assignConfig(this.config, {skipComponentAssign: true});
    }

    const timelines = this.getTimelines();

    for (const name in timelines) {
      const timeline = timelines[name];
      timeline.assignOptions(this.config);
    }

    this.bindStates();

    assign(this.bytecode.timelines, this.config.timelines);

    return this;
  }

  set (key, value) {
    this.emitFromRootComponent('state:change', {state: key, from: this.state[key], to: value});

    this.state[key] = value;
    return this;
  }

  get (key) {
    return this.state[key];
  }

  setState (states: StateValues, transitionParameter?: StateTransitionParameters) {

    // Do not set any state if invalid
    if (!states || typeof states !== 'object') {
      return this;
    }

    // Set states is delegated to stateTransitionManager
    this.stateTransitionManager.setState(states, transitionParameter);

    return this;

  }

  getStates () {
    return this.state;
  }

  clearCaches (options: ClearCacheOptions = {}) {
    // HaikuBase implements a general-purpose caching mechanism which we also call here
    this.cacheClear();

    // Don't forget to repopulate the states with originals when we clear cache
    if (options.clearStates) {
      this.clearStates();
    }

    this._hydrateMutableTimelines();

    if (this.bytecode.timelines) {
      for (const timelineName in this.bytecode.timelines) {
        delete this.bytecode.timelines[timelineName].__max;
      }
    }
  }

  clearStates () {
    this._states = {};
    this.bindStates();
  }

  getClock (): HaikuClock {
    return this.context.getClock();
  }

  getTimelines () {
    return this.cacheFetch('getTimelines', () => {
      return this.fetchTimelines();
    });
  }

  fetchTimelines () {
    const names = Object.keys(this.bytecode.timelines);

    for (let i = 0; i < names.length; i++) {
      const name = names[i];

      if (!name) {
        continue;
      }

      const existing = HaikuTimeline.where({
        name,
        component: this,
      })[0];

      if (!existing) {
        HaikuTimeline.create(
          this,
          name,
          this.getTimelineDescriptor(name),
          this.config,
        );
      }
    }

    const out = {};

    HaikuTimeline.where({component: this}).forEach((timeline) => {
      out[timeline.getName()] = timeline;
    });

    return out;
  }

  getTimeline (name): HaikuTimeline {
    return this.getTimelines()[name];
  }

  fetchTimeline (name, descriptor): HaikuTimeline {
    const found = this.getTimeline(name);

    if (found) {
      return found;
    }

    return HaikuTimeline.create(this, name, descriptor, this.config);
  }

  getDefaultTimeline (): HaikuTimeline {
    const timelines = this.getTimelines();
    return timelines[DEFAULT_TIMELINE_NAME];
  }

  stopAllTimelines () {
    const timelines = this.getTimelines();
    for (const name in timelines) {
      this.stopTimeline(name);
    }
  }

  startAllTimelines () {
    const timelines = this.getTimelines();
    for (const name in timelines) {
      this.startTimeline(name);
    }
  }

  startTimeline (timelineName) {
    const time = this.context.clock.getExplicitTime();
    const descriptor = this.getTimelineDescriptor(timelineName);
    const existing = this.fetchTimeline(timelineName, descriptor);
    if (existing) {
      existing.start(time, descriptor);
    }
  }

  stopTimeline (timelineName) {
    const time = this.context.clock.getExplicitTime();
    const descriptor = this.getTimelineDescriptor(timelineName);
    const existing = this.getTimeline(timelineName);
    if (existing) {
      existing.stop(time, descriptor);
    }
  }

  /**
   * @description Convenience alias for HaikuTimeline#gotoAndPlay
   */
  gotoAndPlay (amount: number, unit: TimeUnit = TimeUnit.Frame) {
    this.getDefaultTimeline().gotoAndPlay(amount, unit);
  }

  /**
   * @description Convenience alias for HaikuTimeline#gotoAndStop
   */
  gotoAndStop (amount: number, unit: TimeUnit = TimeUnit.Frame) {
    this.getDefaultTimeline().gotoAndStop(amount, unit);
  }

  /**
   * @description Convenience alias for HaikuTimeline#pause
   */
  pause () {
    this.getDefaultTimeline().pause();
  }

  /**
   * @description Convenience alias for HaikuTimeline#stop
   */
  stop (maybeGlobalClockTime: number, descriptor) {
    this.getDefaultTimeline().stop(maybeGlobalClockTime, descriptor);
  }

  /**
   * @description Convenience alias for HaikuTimeline#seek
   */
  seek (amount: number, unit: TimeUnit = TimeUnit.Frame) {
    this.getDefaultTimeline().seek(amount, unit);
  }

  /**
   * @description Convenience alias for HaikuTimeline#start
   */
  start (maybeGlobalClockTime: number, descriptor) {
    this.getDefaultTimeline().start(maybeGlobalClockTime, descriptor);
  }

  /**
   * @description Convenience alias for HaikuTimeline#play
   */
  play (options: any = {}) {
    this.getDefaultTimeline().play();
  }

  getTimelineDescriptor (timelineName) {
    return this.bytecode.timelines[timelineName];
  }

  getInjectables (): any {
    const injectables = {};

    assign(injectables, this.getSummonablesSchema());

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
  deactivate () {
    this.isDeactivated = true;
  }

  activate () {
    this.isDeactivated = false;
  }

  sleepOn () {
    this.isSleeping = true;
  }

  sleepOff () {
    this.isSleeping = false;
  }

  /**
   * @method dump
   * @description Dump serializable info about this object
   */
  dump () {
    const metadata = this.getBytecodeMetadata();
    return `${metadata.relpath}:${this.getComponentId()}`;
  }

  getBytecodeMetadata () {
    return this.bytecode.metadata;
  }

  getBytecodeRelpath (): string {
    const metadata = this.getBytecodeMetadata();
    return metadata && metadata.relpath;
  }

  getBytecodeProject (): string {
    const metadata = this.getBytecodeMetadata();
    return metadata && metadata.project;
  }

  getBytecodeOrganization (): string {
    const metadata = this.getBytecodeMetadata();
    return metadata && metadata.organization;
  }

  getAddressableProperties (out = {}) {
    if (!this.bytecode.states) {
      return out;
    }

    for (const name in this.bytecode.states) {
      const state = this.bytecode.states[name];

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

  bindStates () {
    const allStates = assign({}, this.bytecode.states, this.config.states);

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
        this._states[stateSpecName] = stateSpec.value;

        this.defineSettableState(stateSpec, stateSpecName);
      }
    }
  }

  defineSettableState (
    stateSpec,
    stateSpecName: string,
  ) {
    // Note: We define the getter/setter on the object itself, but the storage occurs on the pass-in statesTargetObject
    Object.defineProperty(this.state, stateSpecName, {
      configurable: true,

      get: () => {
        return this._states[stateSpecName];
      },

      set: (inputValue) => {
        if (stateSpec.setter) {
          // Important: We call the setter with a binding of the component, so it can access methods on `this`
          this._states[stateSpecName] = stateSpec.setter.call(
            this,
            inputValue,
          );
        } else {
          this._states[stateSpecName] = inputValue;
        }

        if (!this.isDeactivated) {
          this.emit('state:set', stateSpecName, this._states[stateSpecName]);
        }

        return this._states[stateSpecName];
      },
    });
  }

  allEventHandlers (): any {
    return assign(
      {},
      this.bytecode.eventHandlers,
      this.config.eventHandlers,
    );
  }

  eachEventHandler (iteratee: Function) {
    const eventHandlers = this.allEventHandlers();

    for (const eventSelector in eventHandlers) {
      for (const eventName in eventHandlers[eventSelector]) {
        const descriptor = eventHandlers[eventSelector][eventName];

        if (!descriptor || !descriptor.handler) {
          continue;
        }

        iteratee(
          eventSelector,
          eventName,
          descriptor,
        );
      }
    }
  }

  routeEventToHandler (
    eventSelectorGiven: string,
    eventNameGiven: string,
    eventArgs: any,
  ) {
    if (this.isDeactivated) {
      return;
    }

    this.eachEventHandler((eventSelector, eventName, {handler}) => {
      if (eventNameGiven === eventName) {
        if (
          eventSelectorGiven === eventSelector ||
          eventSelectorGiven === GLOBAL_LISTENER_KEY
        ) {
          this.callEventHandler(eventSelector, eventName, handler, eventArgs);
          return;
        }
      }
    });
  }

  callEventHandler (eventsSelector: string, eventName: string, handler: Function, eventArgs: any): any {
    // Only fire the event listeners if the component is in 'live' interaction mode,
    // i.e., not currently being edited inside the Haiku authoring environment
    if (!isLiveMode(this.config.interactionMode)) {
      return;
    }

    try {
      this.emitFromRootComponent('action:fired', {action: eventName, element: eventsSelector});
      return handler.apply(this, eventArgs);
    } catch (exception) {
      consoleErrorOnce(exception);
    }
  }

  routeEventToHandlerAndEmit (
    eventSelectorGiven: string,
    eventNameGiven: string,
    eventArgs: any,
  ) {
    if (this.isDeactivated) {
      return;
    }

    this.routeEventToHandler(eventSelectorGiven, eventNameGiven, eventArgs);
    this.emit(eventNameGiven, ...eventArgs);
  }

  markForFullFlush () {
    this.doesNeedFullFlush = true;
  }

  unmarkForFullFlush () {
    this.doesNeedFullFlush = false;
  }

  shouldPerformFullFlush () {
    return this.doesNeedFullFlush || this.doAlwaysFlush;
  }

  performFullFlushRenderWithRenderer (renderer, options: any = {}) {
    this.context.getContainer(true); // Force recalc of container

    // Since we will produce a full tree, we don't need a further full flush.
    this.unmarkForFullFlush();

    // Untyped code paths downstream depend on the output of this method
    return renderer.render(
      this.container,
      this.render(options),
      this,
    );
  }

  performPatchRenderWithRenderer (renderer, options: any = {}, skipCache: boolean) {
    if (renderer.shouldCreateContainer) {
      this.context.getContainer(true); // Force recalc of container
    }

    renderer.patch(
      this,
      this.patch(options, skipCache),
    );

    for (const $id in this.guests) {
      const guest = this.guests[$id];

      if (guest.shouldPerformFullFlush() && guest.target) {
        guest.performFullFlushRenderWithRenderer(
          renderer,
          options,
        );
      } else {
        guest.performPatchRenderWithRenderer(
          renderer,
          options,
          skipCache,
        );
      }
    }
  }

  render (options: any = {}) {
    // We register ourselves with our host here because render is guaranteed to be called
    // both in our constructor and in the case that we were deactivated/reactivated.
    // This must run before the isDeactivated check since we may use the registry to activate later.
    if (this.host) {
      this.host.registerGuest(this);
    }

    if (this.isDeactivated) {
      // If deactivated, pretend like there is nothing to render
      return;
    }

    this.clearCaches();

    HaikuElement.findOrCreateByNode(this.container);

    hydrateNode(
      this.bytecode.template, // node
      this.container, // parent
      this, // instance (component)
      this.context,
      this.host,
      'div', // scope (the default is a div)
      options,
      true, // doConnectInstanceToNode
    );

    this.applyLocalBehaviors(
      options,
      false, // isPatchOperation
      false, // skipCache
    );

    if (this.context.renderer.mount) {
      this.eachEventHandler((eventSelector, eventName) => {
        const registrationKey = `${eventSelector}:${eventName}`;

        if (this.registeredEventHandlers[registrationKey]) {
          return;
        }

        this.registeredEventHandlers[registrationKey] = true;

        this.context.renderer.mountEventListener(this, eventSelector, eventName, (...args) => {
          this.routeEventToHandlerAndEmit(eventSelector, eventName, args);
        });
      });
    }

    this.applyGlobalBehaviors(options);

    // But also note we need to call subcomponent renders *after* our own behaviors,
    // because we need the parent-to-child states to be set prior to this render call,
    // otherwise the changes they produce won't be available for this render frame.
    for (const $id in this.guests) {
      this.guests[$id].render({
        ...this.guests[$id].config,
        ...Config.buildChildSafeConfig(options),
        doSkipExpand: true,
      });
    }

    // Avoid unnecessry .expand calls when rendering subcomponents
    if (options.doSkipExpand) {
      return;
    }

    const expansion = this.expand();
    return expansion;
  }

  patch (options: any = {}, skipCache = false) {
    if (this.isDeactivated) {
      // If deactivated, pretend like there is nothing to render
      return {};
    }

    this.applyLocalBehaviors(
      options,
      true, // isPatchOperation
      skipCache,
    );

    this.applyGlobalBehaviors(options);

    const patches = {};
    this.expand(patches);
    return patches;
  }

  expand (patches = {}): IExpandResult {
    // Note that expandNode calls .expand on any subcomponents in the tree
    return expandNode(
      this.bytecode.template, // node
      this.container,
      patches,
    );
  }

  applyGlobalBehaviors (options: any = {}) {
    if (this.doPreserve3d) {
      const node = this.node;
      if (node) {
        ensure3dPreserved(this, node);
        node.__memory.patched = true;
      }

      // The wrapper also needs preserve-3d set for 3d-preservation to work
      const parent = this.parentNode; // This should be the "wrapper div" node
      if (parent) {
        ensure3dPreserved(this, parent);
        parent.__memory.patched = true;
      }
    }

    if (!this.host && options.sizing) {
      computeAndApplyPresetSizing(
        this.bytecode.template,
        this.container,
        options.sizing,
      );
      this.bytecode.template.__memory.patched = true;
    }
  }

  applyLocalBehaviors (
    options,
    isPatchOperation,
    skipCache = false,
  ) {
    const globalClockTime = this.context.clock.getExplicitTime();

    for (const timelineName in this.bytecode.timelines) {
      const timelineInstance = this.getTimeline(timelineName);

      // If we update with the global clock time while a timeline is paused, the next
      // time we resume playing it will "jump forward" to the time that has elapsed.
      if (timelineInstance.isPlaying()) {
        timelineInstance.doUpdateWithGlobalClockTime(globalClockTime);
      }

      const timelineTime = timelineInstance.getBoundedTime();

      const timelineDescriptor = this.bytecode.timelines[timelineName];

      // In hot editing mode, any timeline is fair game for mutation,
      // even if it's not actually animated (e.g. dragging an SVG at keyframe 0).
      const mutableTimelineDescriptor = isPatchOperation
        ? this._mutableTimelines[timelineName]
        : timelineDescriptor;

      if (!mutableTimelineDescriptor || typeof mutableTimelineDescriptor !== 'object') {
        continue;
      }

      for (const behaviorSelector in mutableTimelineDescriptor) {
        const matchingElementsForBehavior = this.findMatchingNodesByCSSSelector(behaviorSelector);

        if (!matchingElementsForBehavior || matchingElementsForBehavior.length < 1) {
          continue;
        }

        const propertiesGroup = timelineDescriptor[behaviorSelector];

        if (!propertiesGroup) {
          continue;
        }

        const hasExpressions = propertyGroupNeedsExpressionEvaluated(
          propertiesGroup,
          timelineTime,
        );

        if (
          options.forceApplyBehaviors ||
          (timelineInstance.isPlaying() && timelineInstance.isUnfinished()) ||
          hasExpressions
        ) {
          // proceed
        } else {
          continue;
        }

        // This is our opportunity to group property operations that need to be in order
        const propertyOperations = collatePropertyGroup(propertiesGroup);

        for (let i = 0; i < propertyOperations.length; i++) {
          const propertyGroup = propertyOperations[i];

          for (let j = 0; j < matchingElementsForBehavior.length; j++) {
            const matchingElement = matchingElementsForBehavior[j];

            const compositeId = getNodeCompositeId(matchingElement);

            for (const propertyName in propertyGroup) {
              const propertyValue = propertyGroup[propertyName];

              const finalValue = this.grabValue(
                timelineName,
                compositeId,
                matchingElement,
                propertyName,
                propertyValue,
                timelineTime,
                isPatchOperation,
                skipCache,
              );

              if (finalValue !== undefined) {
                this.applyPropertyToNode(
                  matchingElement,
                  propertyName,
                  finalValue,
                  timelineInstance,
                );

                // This is used downstream to decide whether patch updates are worthwhile
                matchingElement.__memory.patched = true;
              }
            }
          }
        }
      }
    }
  }

  applyPropertyToNode (
    node,
    name: string,
    value,
    timeline: HaikuTimeline,
  ) {
    const sender = (node.__memory.instance) ? node.__memory.instance : this; // Who sent the command
    const receiver = node.__memory.subcomponent;
    const type = (receiver && receiver.tagName) || node.elementName;
    const addressables = receiver && receiver.getAddressableProperties();
    const addressee = addressables && addressables[name] !== undefined && receiver;

    if (addressee) {
      // Note: Even though we apply the value to addressables of the subcomponent,
      // we still proceed with application of properties directly to the wrapper.
      // This is as a convenience, so that if a subcomponent wants to handle any property
      // applied to its wrapper than it can do so, e.g. sizeAbsolute.x/sizeAbsolute.y.
      addressee.set(name, value);
    }

    const vanity = getVanity(type, name);

    if (vanity) {
      return vanity(
        name,
        node,
        value,
        this.context,
        timeline,
        receiver,
        sender,
      );
    }

    const parts = name.split('.');

    if (parts[0] === 'style' && parts[1]) {
      return setStyle(parts[1], node, value);
    }

    return setAttribute(name, node, value);
  }

  findElementsByHaikuId (componentId) {
    return this.findMatchingNodesByCSSSelector(`haiku:${componentId}`);
  }

  findMatchingNodesByCSSSelector (selector: string) {
    return this.cacheFetch(`findMatchingNodesByCSSSelector:${selector}`, () => {
      const out = [];

      const nodes = cssQueryTree(
        this.bytecode.template,
        selector,
        CSS_QUERY_MAPPING,
      );

      nodes.forEach((node) => {
        const repeatees = findRespectiveRepeatees(node);

        // If the node in question is the descendant of a repeater, we need to find all repeated
        // copies of it inside the host repeater. If any repeatees are returned that means the
        // element is in fact a repeater, otherwise it is not a repeater, so just use the node.
        if (repeatees.length > 0) {
          out.push.apply(out, repeatees);
        } else {
          out.push(node);
        }
      });

      return out;
    });
  }

  _hydrateMutableTimelines () {
    this._mutableTimelines = {};
    if (this.bytecode.timelines) {
      for (const timelineName in this.bytecode.timelines) {
        for (const selector in this.bytecode.timelines[timelineName]) {
          for (const propertyName in this.bytecode.timelines[timelineName][selector]) {
            if (isMutableProperty(this.bytecode.timelines[timelineName][selector][propertyName], propertyName)) {
              const timeline = this._mutableTimelines[timelineName] || {};
              const propertyGroup = timeline[selector] || {};
              this._mutableTimelines = {
                ...this._mutableTimelines,
                [timelineName]: {
                  ...timeline,
                  [selector]: {
                    ...propertyGroup,
                    [propertyName]: this.bytecode.timelines[timelineName][selector][propertyName],
                  },
                },
              };
            }
          }
        }
      }
    }
  }

  addHotComponent (hotComponent: HotComponent) {
    if (
      !this.bytecode.timelines ||
      !this.bytecode.timelines[hotComponent.timelineName] ||
      !this.bytecode.timelines[hotComponent.timelineName][hotComponent.selector]
    ) {
      return;
    }

    const propertyGroup = this.bytecode.timelines[hotComponent.timelineName][hotComponent.selector];

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

  controlTime (timelineName: string, timelineTime: number) {
    const explicitTime = this.context.clock.getExplicitTime();
    const timelineInstances = this.getTimelines();

    for (const localTimelineName in timelineInstances) {
      if (localTimelineName === timelineName) {
        const timelineInstance = timelineInstances[timelineName];
        timelineInstance.controlTime(timelineTime, explicitTime);
      }
    }

    for (const $id in this.guests) {
      this.guests[$id].controlTime(
        timelineName,
        this.getControlledTimeDefinedForGuestComponent(
          this.guests[$id],
          timelineName,
          timelineTime,
        ),
      );
    }
  }

  getControlledTimeDefinedForGuestComponent (
    guest: HaikuComponent,
    timelineName: string,
    timelineTime: number,
  ): number {
    const wrapper = guest.parentNode;

    if (!wrapper) {
      return timelineTime;
    }

    const wrapperId = getNodeCompositeId(wrapper);

    if (!wrapperId) {
      return timelineTime;
    }

    const playbackValue = this.getOutputValue(
      timelineName,
      timelineTime,
      wrapperId,
      'playback',
    );

    if (typeof playbackValue === 'number') {
      return playbackValue;
    }

    const guestTimeline = guest.getTimeline(timelineName);

    if (playbackValue === PlaybackSetting.CEDE) {
      return guestTimeline.getTime();
    }

    // If time is controlled and we're set to 'loop', use a modulus of the guest's max time
    // which will give the effect of looping the guest to its 0 if its max has been reached
    if (playbackValue === PlaybackSetting.LOOP) {
      if (guestTimeline) {
        const guestMax = guestTimeline.getMaxTime();
        const finalTime = timelineTime % guestMax; // TODO: What if final frame has a change?
        return finalTime;
      }

      return timelineTime;
    }

    if (playbackValue === PlaybackSetting.STOP) {
      if (guestTimeline) {
        return guestTimeline.getControlledTime() || 0;
      }

      return timelineTime;
    }

    return timelineTime;
  }

  getPropertiesGroup (timelineName: string, flexId: string) {
    return (
      this.bytecode &&
      this.bytecode.timelines &&
      this.bytecode.timelines[timelineName] &&
      this.bytecode.timelines[timelineName][`haiku:${flexId}`]
    );
  }

  getOutputValue (
    timelineName: string,
    timelineTime: number,
    flexId: string,
    propertyName: string,
  ): any {
    return this.grabValue(
      timelineName,
      flexId,
      null, // matchingElement - not needed?
      propertyName,
      this.getPropertiesGroup(timelineName, flexId)[propertyName],
      timelineTime,
      false, // isPatchOperation
      false, // skipCache
    );
  }

  /**
   * Execute state transitions.
   */
  tickStateTransitions (): void {
    this.stateTransitionManager.tickStateTransitions();
  }

  /**
   * Reset states to initial values by using State Transitions. Default to linear
   */
  resetStatesToInitialValuesWithTransition (duration: number, curve: Curve = Curve.Linear) {
    // Build initial states
    const initialStates = assign({}, this.bytecode.states, this.config.states);
    for (const key in initialStates) {
      initialStates[key] = initialStates[key].value;
    }
    // Create state transition to initial state values
    this.stateTransitionManager.setState(initialStates, {curve, duration});
  }

  get top (): HaikuComponent {
    if (this.host) {
      return this.host.top;
    }

    return this;
  }

  getRootComponent () {
    if (this.host) {
      return this.host.getRootComponent();
    }

    return this;
  }

  emitFromRootComponent (eventName: string, attachedObject: any) {
    attachedObject.componentTitle = this.title;
    this.getRootComponent().emit(eventName, attachedObject);
  }

  evaluateExpression (
    fn,
    timelineName: string,
    flexId: string,
    matchingElement,
    propertyName: string,
    keyframeMs,
    keyframeCluster,
  ) {
    enhance(fn, null);

    // We'll store the result of this evaluation in this variable
    // (so we can cache it in case unexpected subsequent calls)
    let evaluation = void 0;

    if (fn.specification === true) {
      // This function is of an unknown kind, so just evaluate it normally without magic dependency injection
      evaluation = safeCall(fn, this, this._states);
    } else if (!Array.isArray(fn.specification.params)) {
      // If for some reason we got a non-array params, just evaluate
      evaluation = safeCall(fn, this, this._states);
    } else if (fn.specification.params.length < 1) {
      // If for some reason we got 0 params, just evaluate it
      evaluation = safeCall(fn, this, this._states);
    } else {
      if (fn.specification.params.length < 1) {
        // If the summon isn't in the destructured object format, just evaluate it
        evaluation = safeCall(fn, this, this._states);
      } else {
        const summoneesArray = this.summonSummonables(
          fn.specification.params,
          timelineName,
          flexId,
          matchingElement,
          propertyName,
          keyframeMs,
          keyframeCluster,
        );

        const previousSummoneesArray = this.getPreviousSummonees(timelineName, flexId, propertyName, keyframeMs);

        if (areSummoneesDifferent(previousSummoneesArray, summoneesArray)) {
          this.cacheSummonees(timelineName, flexId, propertyName, keyframeMs, summoneesArray);
          evaluation = safeApply(fn, this, summoneesArray);
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

  summonSummonables (
    paramsArray,
    timelineName: string,
    flexId: string,
    matchingElement,
    propertyName: string,
    keyframeMs,
    keyframeCluster,
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
            this,
            matchingElement,
            timelineName,
          );
          summonsOutput = summonStorage[summonsEntry];
        } else {
          summonsOutput = this.state[summonsEntry];
        }
      }

      // Whatever the request format was, populate the result in here
      if (summonsOutput !== undefined) {
        summonablesArray[i] = summonsOutput;
      }
    }

    return summonablesArray;
  }

  private fetchParsedValueCluster (
    timelineName: string,
    flexId: string,
    matchingElement,
    outputName: string,
    cluster,
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
          value: this.evaluateExpression(
            descriptor.value,
            timelineName,
            flexId,
            matchingElement,
            outputName,
            ms,
            cluster,
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
      let parser = this.getParser(outputName);
      // tslint:disable-next-line:triple-equals
      if (!parser && parseFloat(parsee[keys[0]].value) == parsee[keys[0]].value) {
        parser = parseFloat;
      }

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

  grabValue (
    timelineName: string,
    flexId: string,
    matchingElement,
    propertyName: string,
    propertyValue: any,
    timelineTime: number,
    isPatchOperation: boolean,
    skipCache: boolean,
  ) {
    // Used by $helpers to calculate scope-specific values;
    this.helpers.data = {
      lastTimelineName: timelineName,
      lastFlexId: flexId,
      lastPropertyName: propertyName,
      lastTimelineTime: timelineTime,
    };

    const parsedValueCluster = this.fetchParsedValueCluster(
      timelineName,
      flexId,
      matchingElement,
      propertyName,
      propertyValue,
      isPatchOperation,
      skipCache,
    );

    // If there is no property of that name, we would have gotten nothing back, so we can't forward this to Transitions
    // since it expects to receive a populated cluster object
    if (!parsedValueCluster) {
      return undefined;
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

  getPreviousSummonees (
    timelineName,
    flexId,
    propertyName,
    keyframeMs,
  ) {
    return this.cacheGet(`summonees:${timelineName}|${flexId}|${propertyName}|${keyframeMs}`);
  }

  cacheSummonees (
    timelineName,
    flexId,
    propertyName,
    keyframeMs,
    summonees,
  ) {
    this.cacheSet(`summonees:${timelineName}|${flexId}|${propertyName}|${keyframeMs}`, summonees);
    return summonees;
  }

  getPreviousEvaluation (
    timelineName,
    flexId,
    propertyName,
    keyframeMs,
  ) {
    return this.cacheGet(`evaluation:${timelineName}|${flexId}|${propertyName}|${keyframeMs}`);
  }

  cacheEvaluation (
    timelineName,
    flexId,
    propertyName,
    keyframeMs,
    evaluation,
  ) {
    this.cacheSet(`evaluation:${timelineName}|${flexId}|${propertyName}|${keyframeMs}`, evaluation);
    return evaluation;
  }

  private getParsee (
    timelineName,
    flexId,
    outputName,
  ): ParsedValueCluster {
    return this.cacheFetch(`parsee:${timelineName}|${flexId}|${outputName}`, () => {
      // The parsee object is mutated in place downstream
      return {};
    });
  }

  private clusterParseeIsStable (
    keysMs,
    timelineName,
    flexId,
    outputName,
  ): boolean {
    const parsee = this.getParsee(timelineName, flexId, outputName);
    return keysMs.every(
      (ms) => parsee[ms] && !parsee[ms].expression,
    );
  }

  didChangeValue (
    timelineName,
    flexId,
    matchingElement,
    outputName,
    outputValue,
  ) {
    let answer = false;

    const change = this.cacheGet(`changes:${timelineName}|${flexId}|${outputName}`);

    if (change === undefined || change !== outputValue) {
      this.cacheSet(`changes:${timelineName}|${flexId}|${outputName}`, outputValue);
      answer = true;
    }

    return answer;
  }

  getSummonablesSchema () {
    const summonablesSchema = {};
    for (const key in INJECTABLES) {
      summonablesSchema[key] = INJECTABLES[key].schema;
    }
    return summonablesSchema;
  }

  getParser (outputName) {
    const foundParser = HaikuComponent.PARSERS[outputName];
    return foundParser && foundParser.parse;
  }

  getGenerator (outputName) {
    const foundGenerator = HaikuComponent.PARSERS[outputName];
    return foundGenerator && foundGenerator.generate;
  }

  static __name__ = 'HaikuComponent';

  static PLAYER_VERSION = VERSION; // #LEGACY
  static CORE_VERSION = VERSION;
  static INJECTABLES = INJECTABLES;

  // When editing a component, any of these appearing inside an expression will trigger a warning.
  // This is kept in the core so it's easier to compare these to the built-in injectables and
  // other special treatment for JavaScript globals. "single source of truth" etc.
  static FORBIDDEN_EXPRESSION_TOKENS = {
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
    prototpye: true,
    __proto__: true,
    freeze: true,
    setPrototypeOf: true,
    constructor: true,
    defineProperties: true,
    defineProperty: true,
  };

  static PARSERS = {
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

  static all = (): HaikuComponent[] => HaikuBase.getRegistryForClass(HaikuComponent);
}

const getNodeFlexId = (node): string => {
  const domId = (
    node &&
    node.attributes &&
    node.attributes.id
  );

  const haikuId = (
    node &&
    node.attributes &&
    node.attributes[HAIKU_ID_ATTRIBUTE]
  );

  return haikuId || domId;
};

const getNodeCompositeId = (node): string => {
  const flexId = getNodeFlexId(node);

  // Treat the 0th repeater as the original (source) element
  return (node.__memory.repeatee && node.__memory.repeatee.index)
    ? `${flexId}'${node.__memory.repeatee.index}`
    : flexId;
};

const collatePropertyGroup = (propertiesGroup) => {
  const collation = [
    {}, // presentational ops
    {}, // "if" ops
    {}, // "repeat" ops
    {}, // "placeholder" ops
  ];

  for (const propertyName in propertiesGroup) {
    if (propertyName === 'controlFlow.if') {
      collation[0][propertyName] = propertiesGroup[propertyName];
    } else if (propertyName === 'controlFlow.repeat') {
      collation[1][propertyName] = propertiesGroup[propertyName];
    } else if (propertyName === 'controlFlow.placeholder') {
      collation[2][propertyName] = propertiesGroup[propertyName];
    } else {
      collation[3][propertyName] = propertiesGroup[propertyName];
    }
  }

  return collation;
};

function isBytecode (thing) {
  return thing && typeof thing === OBJECT_TYPE && thing.template;
}

function assertTemplate (template) {
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

function stateSpecValidityCheck (stateSpec: any, stateSpecName: string): boolean {
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

const msKeyToInt = (msKey: string): number => {
  return parseInt(msKey, 10);
};

const propertyGroupNeedsExpressionEvaluated = (
  propertyGroup,
  timelineTime: number,
): boolean => {
  let foundExpressionForTime = false;

  const roundedTime = Math.round(timelineTime);

  for (const propertyName in propertyGroup) {
    const propertyKeyframes = propertyGroup[propertyName];

    const keyframeMss = Object.keys(propertyKeyframes).map(msKeyToInt).sort();

    if (keyframeMss.length < 1) {
      return;
    }

    let leftBookend = 0;
    let rightBookend = keyframeMss[keyframeMss.length - 1];

    for (let i = 0; i < keyframeMss.length; i++) {
      const currMs = keyframeMss[i];

      if (currMs >= leftBookend && currMs <= roundedTime) {
        leftBookend = currMs;
      }

      if (currMs <= rightBookend && currMs >= roundedTime) {
        rightBookend = currMs;
      }
    }

    if (propertyKeyframes[leftBookend] && typeof propertyKeyframes[leftBookend].value === 'function') {
      foundExpressionForTime = true;
    } else if (propertyKeyframes[rightBookend] && typeof propertyKeyframes[rightBookend].value === 'function') {
      foundExpressionForTime = true;
    }
  }

  return foundExpressionForTime;
};

const expandNode = (original, parent, patches = {}) => {
  if (!original || typeof original !== 'object') {
    return original;
  }

  const children = [];

  // eeb222bb1daa

  // Note that HaikuComponent#render calls expandNode for its own tree.
  const subtree = original.__memory.subcomponent && original.__memory.subcomponent.expand();

  // Special case if our current original is the wrapper of a subcomponent.
  if (subtree) {
    children.push(subtree);
  } else {
    if (original.children) {
      // Some components may contain elements that have not defined any .children
      for (let i = 0; i < original.children.length; i++) {
        const child = original.children[i];

        if (!child) {
          continue;
        }

        // Strings, numbers, etc. can be included in children as-is
        if (typeof child !== 'object') {
          children.push(child);
          continue;
        }

        // Do not include any children that have been removed due to $if-logic
        if (child.__memory.if && child.__memory.if.answer === false) {
          continue;
        }

        // If the child is a repeater, use the $repeats instead of itself
        if (child.__memory.repeater && child.__memory.repeater.repeatees) {
          for (let j = 0; j < child.__memory.repeater.repeatees.length; j++) {
            const repeatee = child.__memory.repeater.repeatees[j];
            children.push(repeatee);
          }

          continue;
        }

        // If we got this far, the child is structurally normal
        children.push(child);
      }
    }
  }

  /**
   * When we compute layout, we have the following chicken/egg problem:
   * 1. Nodes which are "auto"-sized consume their children's size to calculate their own size.
   * 2. Nodes with a SIZE_PROPORTIONAL depend on parent absolute size to compute their target size. (DEPRECATED)
   * 3. Nodes with an "auto"-sized parent consume their parent's bounds to calculate a translation offset.
   *
   * Thus, we perform the layout steps in the following order:
   * 1. Compute the current node's layout.
   *   1.a. If the current node is "auto"-sized, compute the size of the children. For each child,
   *        we compute its bounding rect using its *local* transform (not using its parent size).
   *        This is sufficient to obtain a bounding box in local coordinate space with respect to
   *        an unknown container. We then use all of the rects to determine the outermost bbox,
   *        which in turn is used to determine the current node's size.
   *   1.b. If the current node is numerically sized, use that size.
   * 2. Expand all children of the current node. By now, the parent should have a numeric size.
   *   2.a. For SIZE_PROPORTIONAL nodes, compute the layout as proportion of the parent size.
   *   2.b. For other nodes, compute its local size.
   *   2.c. If the parent was "auto"-sized, it should have its bounds precalculated from the
   *        previous pass. When this is the case, use the bounds to calculate an offset value
   *        by which translation will be offset, aligning all children to be perfectly flush
   *        with their container, no matter what size it is.
   */

  const expansion = {
    ...original,
    children,
  };

  // Give every node a reference to its expansion in case we want to compute sizing downstream;
  // this is used in Haiku.app to help calculate bounding boxes during editing
  original.__memory.expansion = expansion;

  // Don't assume the node has/needs a layout, for example, control-flow injectees
  if (expansion.layout) {
    // Note that the original node and its "expansion" share a pointer to .layout
    expansion.layout.computed = HaikuElement.computeLayout(
      expansion,
      parent,
    );
  }

  for (let j = 0; j < children.length; j++) {
    // Special case: The subtree of the subcomponent doesn't need to be re-expanded.
    if (children[j] !== subtree) {
      children[j] = expandNode(children[j], expansion, patches);
    }
  }

  if (expansion.__memory.patched) {
    patches[getNodeCompositeId(expansion)] = expansion;
    expansion.__memory.patched = false;
  }

  return expansion;
};

const hydrateNode = (
  node,
  parent,
  component: HaikuComponent,
  context: IHaikuContext,
  host: HaikuComponent,
  scope: string,
  options: any = {},
  doConnectInstanceToNode: boolean,
) => {
  // Nothing to expand if the node happens to be text or unexpected type
  if (!node || typeof node !== 'object') {
    return;
  }

  // Hydrate a HaikuElement representation of all nodes in the tree.
  // The instance is cached as node.__memory.element for performance purposes.
  HaikuElement.findOrCreateByNode(node);

  // Platform-specific renderers may depend on access to the parent.
  node.__memory.parent = parent;

  // So renderers can detect when different layout behavior is needed.
  node.__memory.scope = scope || 'div';

  // Give it a pointer back to the host context; used by HaikuElement
  node.__memory.context = context;

  Layout3D.initializeNodeAttributes(
    node,
    doConnectInstanceToNode, // a.k.a isRootNode
  );

  // Give instances a pointer to their node and vice versa
  if (doConnectInstanceToNode) {
    node.__memory.instance = component;

    // In the case that the node represents the root of an instance, treat the instance as the element;
    // connect their references and override the equivalent action in findOrCreateByNode.
    HaikuElement.connectNodeWithElement(node, node.__memory.instance);

    // The host component should hear events emitted by the guest component
    if (host) {
      const flexIdOfHostComponentsWrapperDivForGuest = getNodeCompositeId(parent);

      // Clear the previous listener (avoid multiple subscriptions to the same event)
      if (node.__memory.listener) {
        node.__memory.instance.off('*', node.__memory.listener);
      }

      node.__memory.listener = (key, ...args) => {
        host.routeEventToHandler(
          `haiku:${flexIdOfHostComponentsWrapperDivForGuest}`,
          key,
          [node.__memory.instance].concat(args),
        );
      };

      // Bubble emitted events to the host component so it can subscribe declaratively
      node.__memory.instance.on('*', node.__memory.listener);
    }
  }

  // If the element name is missing it should still be safe to hydrate the children
  if (typeof node.elementName === STRING_TYPE || !node.elementName) {
    if (node.children) {
      for (let i = 0; i < node.children.length; i++) {
        hydrateNode(
          node.children[i], // node
          node, // parent
          component, // instance (component)
          context,
          host,
          SCOPE_STRATA[node.elementName] || scope, // scope
          options,
          false,
        );
      }
    }

    return;
  }

  if (isBytecode(node.elementName)) {
    // Example structure showing how nodes and instances are related:
    // <div root> instance id=1
    //   <div>
    //     <div>
    //       <div wrap> subcomponent (instance id=2)
    //         <div root> instance id=2
    //           ...
    if (!node.__memory.subcomponent) {
      // Note: .render and thus .hydrateNode are called by the constructor,
      // automatically connecting the root node to itself (see stanza above).
      node.__memory.subcomponent = new HaikuComponent(
        node.elementName,
        context, // context
        component, // host
        Config.buildChildSafeConfig({...context.config, ...options}),
        node, // container
      );

      // Very important, as the guests collection is used in rendering/patching
      component.registerGuest(node.__memory.subcomponent);
    } else {
      // Reassigning is necessary since these objects may have changed between
      // renders in the editing environment
      node.__memory.subcomponent.context = context; // context
      node.__memory.subcomponent.host = component; // host
      node.__memory.subcomponent.container = node; // container

      // Very important, as the guests collection is used in rendering/patching
      component.registerGuest(node.__memory.subcomponent);

      // Don't re-start any nested timelines that have been explicitly paused
      if (!node.__memory.subcomponent.getDefaultTimeline().isExplicitlyPaused()) {
        node.__memory.subcomponent.startTimeline(DEFAULT_TIMELINE_NAME);
      }
    }

    return;
  }

  // In case we got a __reference node or other unknown
  console.warn('[haiku core] cannot hydrate node');
};

const ensure3dPreserved = (component, node) => {
  if (!node || !node.attributes || !node.attributes.style) {
    return;
  }

  // Only preserve 3D behavior if the node hasn't been *explicitly* defined yet
  if (!node.attributes.style.transformStyle) {
    node.attributes.style.transformStyle = 'preserve-3d';

    if (!node.attributes.style.perspective) {
      node.attributes.style.perspective = 'inherit';
    }
  }
};

const computeAndApplyPresetSizing = (element, container, mode): boolean => {
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

  return changed;
};

export interface ClonedFunction {
  (...args: any[]): void;
  __rfo?: RFO;
}

const clone = (value, binding) => {
  if (!value) {
    return value;
  }

  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'number') {
    return value;
  }

  if (typeof value === 'string') {
    return value;
  }

  if (typeof value === 'function') {
    const fn: ClonedFunction = (...args: any[]) => value.call(binding, ...args);
    // Core decorates injectee functions with metadata properties
    for (const key in value) {
      if (value.hasOwnProperty(key)) {
        fn[key] = clone(value[key], binding);
      }
    }
    fn.__rfo = functionToRFO(value).__function;
    return fn;
  }

  if (Array.isArray(value)) {
    return value.map((el) => clone(el, binding));
  }

  // Don't try to clone anything other than plain objects
  if (typeof value === 'object' && value.constructor === Object) {
    const out = {};

    for (const key in value) {
      if (!value.hasOwnProperty(key) || key.slice(0, 2) === '__') {
        continue;
      }

      // If it looks like guest bytecode, don't clone it since
      // (a) we're passing down *our* function binding, which will break event handling and
      // (b) each HaikuComponent#constructor calls clone() on its own anyway
      if (key === 'elementName' && typeof value[key] !== 'string') {
        out[key] = value[key];
      } else {
        out[key] = clone(value[key], binding);
      }
    }

    return out;
  }

  return value;
};

const setStyle = (subkey, element, value) => {
  element.attributes.style[subkey] = value;
};

const setAttribute = (key, element, value) => {
  const final = ATTRS_CAMEL_TO_HYPH[key] || key;
  element.attributes[final] = value;
};

const isNumeric = (n) => {
  return !isNaN(parseFloat(n)) && isFinite(n);
};

const isInteger = (x) => {
  return x % 1 === 0;
};

const REACT_MATCHING_OPTIONS = {
  name: 'type',
  attributes: 'props',
};

const HAIKU_MATCHING_OPTIONS = {
  name: 'elementName',
  attributes: 'attributes',
};

const querySelectSubtree = (surrogate: any, value) => {
  // First try the Haiku format
  if (cssMatchOne(surrogate, value, HAIKU_MATCHING_OPTIONS)) {
    return surrogate;
  }

  // If no match yet, try the React format (TODO: Does this belong here?)
  if (cssMatchOne(surrogate, value, REACT_MATCHING_OPTIONS)) {
    return surrogate;
  }

  // Visit the descendants (if any) and see if we have a match there
  const children = (
    surrogate.children || // Haiku's format
    (surrogate.props && surrogate.props.children) // React's format
  );

  // If no children, we definitely don't have a match in this subtree
  if (!children) {
    return null;
  }

  // Check for arrays first since arrays pass the typeof object check
  if (Array.isArray(children)) {
    for (let i = 0; i < children.length; i++) {
      const found = querySelectSubtree(children[i], value);

      // First time a match is found, break the loop and return it
      if (found) {
        return found;
      }
    }
  }

  // React may store 'children' as a single object
  if (typeof children === 'object') {
    return querySelectSubtree(children, value);
  }
};

const querySelectSurrogates = (surrogates: any, value: string): any => {
  if (Array.isArray(surrogates)) {
    // Return the first match we locate in the collection
    return surrogates.map((surrogate) => querySelectSurrogates(surrogate, value))[0];
  }

  if (surrogates && typeof surrogates === 'object') {
    return querySelectSubtree(surrogates, value);
  }
};

const selectSurrogate = (surrogates: any, value: any): any => {
  // If the placeholder value is intended as an array index
  if (Array.isArray(surrogates) && isNumeric(value) && isInteger(value)) {
    if (surrogates[value]) {
      return surrogates[value];
    }
  }

  // If the placeholder value is intended as a key
  if (surrogates && typeof surrogates === 'object' && typeof value === 'string') {
    if (surrogates[value]) {
      return surrogates[value];
    }
  }

  return querySelectSurrogates(surrogates, value + '');
};

const getCanonicalPlaybackValue = (value) => {
  if (typeof value !== 'object') {
    return {
      Default: value,
    };
  }

  return value;
};

/**
 * 'Vanities' are functions that provide special handling for applied properties.
 * So for example, if a component wants to apply 'foo.bar'=3 to a <div> in its template,
 * the renderer will look in the vanities dictionary to see if there is a
 * vanity 'foo.bar' available, and if so, pass the value 3 into that function.
 * The function, in turn, knows how to apply that value to the virtual element passed into
 * it. In the future these will be defined by components themselves as inputs; for now,
 * we are keeping a whitelist of possible vanity handlers which the renderer directly
 * loads and calls.
 */

export const getVanity = (elementName: string, propertyName: string) => {
  if (elementName) {
    if (VANITIES[elementName] && VANITIES[elementName][propertyName]) {
      return VANITIES[elementName][propertyName];
    }
  }

  return VANITIES['*'][propertyName];
};

export const LAYOUT_3D_VANITIES = {
  // Layout has a couple of special values that relate to display
  // but not to position:
  shown: (_, element, value) => {
    element.layout.shown = value;
  },
  // Opacity needs to have its opacity *layout* property set
  // as opposed to its element attribute so the renderer can make a decision about
  // where to put it based on the rendering medium's rules
  opacity: (_, element, value) => {
    element.layout.opacity = value;
  },

  // Rotation is a special snowflake since it needs to account for
  // the w-component of the quaternion and carry it
  'rotation.x': (name, element, value) => {
    element.layout.rotation.x = value;
  },
  'rotation.y': (name, element, value) => {
    element.layout.rotation.y = value;
  },
  'rotation.z': (name, element, value) => {
    element.layout.rotation.z = value;
  },

  // If you really want to set what we call 'position' then
  // we do so on the element's attributes; this is mainly to
  // enable the x/y positioning system for SVG elements.
  'position.x': (name, element, value) => {
    element.attributes.x = value;
  },
  'position.y': (name, element, value) => {
    element.attributes.y = value;
  },

  // Everything that follows is a standard 3-coord component
  // relating to the element's position in space
  'offset.x': (name, element, value) => {
    element.layout.offset.x = value;
  },
  'offset.y': (name, element, value) => {
    element.layout.offset.y = value;
  },
  'offset.z': (name, element, value) => {
    element.layout.offset.z = value;
  },
  'origin.x': (name, element, value) => {
    element.layout.origin.x = value;
  },
  'origin.y': (name, element, value) => {
    element.layout.origin.y = value;
  },
  'origin.z': (name, element, value) => {
    element.layout.origin.z = value;
  },
  'scale.x': (name, element, value) => {
    element.layout.scale.x = value;
  },
  'scale.y': (name, element, value) => {
    element.layout.scale.y = value;
  },
  'scale.z': (name, element, value) => {
    element.layout.scale.z = value;
  },
  'sizeAbsolute.x': (name, element, value) => {
    element.layout.sizeAbsolute.x = value;
  },
  'sizeAbsolute.y': (name, element, value) => {
    element.layout.sizeAbsolute.y = value;
  },
  'sizeAbsolute.z': (name, element, value) => {
    element.layout.sizeAbsolute.z = value;
  },
  'sizeDifferential.x': (name, element, value) => {
    element.layout.sizeDifferential.x = value;
  },
  'sizeDifferential.y': (name, element, value) => {
    element.layout.sizeDifferential.y = value;
  },
  'sizeDifferential.z': (name, element, value) => {
    element.layout.sizeDifferential.z = value;
  },
  'sizeMode.x': (name, element, value) => {
    element.layout.sizeMode.x = value;
  },
  'sizeMode.y': (name, element, value) => {
    element.layout.sizeMode.y = value;
  },
  'sizeMode.z': (name, element, value) => {
    element.layout.sizeMode.z = value;
  },
  'sizeProportional.x': (name, element, value) => {
    element.layout.sizeProportional.x = value;
  },
  'sizeProportional.y': (name, element, value) => {
    element.layout.sizeProportional.y = value;
  },
  'sizeProportional.z': (name, element, value) => {
    element.layout.sizeProportional.z = value;
  },
  'shear.xy': (name, element, value) => {
    element.layout.shear.xy = value;
  },
  'shear.xz': (name, element, value) => {
    element.layout.shear.xz = value;
  },
  'shear.yz': (name, element, value) => {
    element.layout.shear.yz = value;
  },
  'translation.x': (name, element, value) => {
    element.layout.translation.x = value;
  },
  'translation.y': (name, element, value) => {
    element.layout.translation.y = value;
  },
  'translation.z': (name, element, value) => {
    element.layout.translation.z = value;
  },
};

export const VANITIES = {
  '*': {
    ...LAYOUT_3D_VANITIES,

    // CSS style properties that need special handling
    'style.WebkitTapHighlightColor': (_, element, value) => {
      element.attributes.style.webkitTapHighlightColor = value;
    },

    // Text and other inner-content related vanities
    content: (_, element, value) => {
      element.children = [value + ''];
    },
    children: (_, element, value) => {
      element.children = value;
    },
    insert: (_, element, value) => {
      element.children = [value];
    },

    // Playback-related vanities that involve controlling timeline or clock time
    playback: (
      name,
      element,
      value: any,
      context: IHaikuContext,
      timeline: HaikuTimeline,
      receiver: HaikuComponent,
      sender: HaikuComponent,
    ) => {
      const canonicalValue = getCanonicalPlaybackValue(value);

      for (const timelineName in canonicalValue) {
        const timelineInstance = receiver && receiver.getTimeline(timelineName);

        if (timelineInstance) {
          timelineInstance.setPlaybackStatus(canonicalValue[timelineName]);
        }
      }
    },

    // Control-flow vanities that alter the output structure of the component
    'controlFlow.placeholder': (
      name,
      element,
      value,
      context,
      timeline,
      receiver,
      sender,
    ) => {
      // For MVP's sake, structural behaviors not rendered during hot editing.
      if (sender.config.hotEditingMode) {
        return;
      }

      if (value === null || value === undefined) {
        return;
      }

      if (typeof value !== 'number' && typeof value !== 'string') {
        return;
      }

      let surrogates;

      // Surrogates can be passed in as:
      //   - React children (an array)
      //   - A React subtree (we'll use query selectors to match)
      //   - A Haiku subtree (we'll use query selectors to match)
      //   - Key/value pairs
      if (context.config.children) {
        surrogates = context.config.children;
        if (!Array.isArray(surrogates)) {
          surrogates = [surrogates];
        }
      } else if (context.config.placeholder) {
        surrogates = context.config.placeholder;
      }

      if (!surrogates) {
        return;
      }

      const surrogate = selectSurrogate(surrogates, value);

      if (surrogate === null || surrogate === undefined) {
        return;
      }

      // If we have a surrogate, then we must clear the children, otherwise we will often
      // see a flash of the default content before the injected content flows in lazily
      element.children = [];

      if (!element.__memory.placeholder) {
        element.__memory.placeholder = {};
      }

      element.__memory.placeholder.value = value;

      // If we are running via a framework adapter, allow that framework to provide its own placeholder mechanism.
      // This is necessary e.g. in React where their element format needs to be converted into our 'mana' format
      if (context.config.vanities['controlFlow.placeholder']) {
        context.config.vanities['controlFlow.placeholder'](
          element,
          surrogate,
          value,
          context,
          timeline,
          receiver,
          sender,
        );
      } else {
        if (element.__memory.placeholder.surrogate !== surrogate) {
          element.elementName = surrogate.elementName;
          element.children = surrogate.children || [];

          if (surrogate.attributes) {
            if (!element.attributes) {
              element.attributes = {};
            }

            for (const key in surrogate.attributes) {
              if (key === 'haiku-id') {
                continue;
              }
              element.attributes[key] = surrogate.attributes[key];
            }
          }

          element.__memory.placeholder.surrogate = surrogate;
        }
      }
    },

    'controlFlow.repeat': (
      name: string,
      element,
      value,
      context: IHaikuContext,
      timeline: HaikuTimeline,
      receiver: HaikuComponent,
      sender: HaikuComponent,
    ) => {
      let instructions;

      if (Array.isArray(value)) {
        instructions = value;
      } else if (isNumeric(value)) {
        const arr = [];

        for (let i = 0; i < value; i++) {
          arr.push({}); // Empty repeat payload spec
        }

        instructions = arr;
      } else {
        return;
      }

      if (element.__memory.repeatee) {
        // Don't repeat the repeatee of an existing repeater
        if (element.__memory.repeatee.index > 0) {
          return;
        }
      }

      if (element.__memory.repeater) {
        if (element.__memory.repeater.changed) {
          element.__memory.repeater.changed = false;
        } else {
          // Save CPU by avoiding recomputing a repeat when we've already done so.
          // Although upstream HaikuComponent#applyLocalBehaviors does do diff comparisons,
          // it intentionally skips this comparison for complex properties i.e. arrays
          // and objects due to the intractability of smartly comparing for all cases.
          // We do a comparison that is fairly sensible in the repeat-exclusive case.
          if (isSameRepeatBehavior(element.__memory.repeater.instructions, instructions)) {
            return;
          }
        }
      }

      if (!element.__memory.repeater) {
        element.__memory.repeater = {};
      }

      element.__memory.repeater.instructions = instructions;

      // Structural behaviors are not rendered during hot editing.
      if (sender.config.hotEditingMode) {
        // If we got at least one instruction, render that by default into the repeater
        if (instructions.length > 0) {
          element.__memory.repeatee = {
            instructions,
            index: 0,
            payload: instructions[0],
            source: element,
          };

          applyPayloadToNode(
            element,
            instructions[0],
            sender,
            timeline,
          );

          sender.markForFullFlush();
        }

        return;
      }

      if (!element.__memory.repeater.repeatees) {
        element.__memory.repeater.repeatees = [];
      } else {
        // If the instructions have decreased on this run, remove the excess repeatees
        element.__memory.repeater.repeatees.splice(instructions.length);
      }

      instructions.forEach((payload, index) => {
        const repeatee = (index === 0)
          ? element // The first element should be the source element
          : element.__memory.repeater.repeatees[index] || clone(element, sender);

        // We have to initialize the element's component instance, etc.
        hydrateNode(
          repeatee,
          element.__memory.parent, // parent
          sender, // component
          sender.context, // context
          sender, // host
          element.__memory.scope, // scope (use same scope as source node)
          sender.config, // options
          false, // doConnectInstanceToNode
        );

        repeatee.__memory.repeatee = {
          index,
          instructions,
          payload,
          source: element,
        };

        applyPayloadToNode(
          repeatee,
          payload,
          sender,
          timeline,
        );

        element.__memory.repeater.repeatees[index] = repeatee;
      });

      sender.markForFullFlush();
    },

    'controlFlow.if': (
      name: string,
      element,
      value,
      context: IHaikuContext,
      timeline: HaikuTimeline,
      receiver: HaikuComponent,
      sender: HaikuComponent,
    ) => {
      // For MVP's sake, structural behaviors not rendered during hot editing.
      if (sender.config.hotEditingMode) {
        return;
      }

      // Assume our if-answer is only false if we got an explicit false value
      const answer = (value === false) ? false : true;

      if (element.__memory.if) {
        // Save CPU by avoiding recomputing an if when we've already done so.
        if (isSameIfBehavior(element.__memory.if.answer, answer)) {
          return;
        }
      }

      element.__memory.if = {
        answer,
      };

      // Ensure that a change in repeat will trigger the necessary re-repeat
      if (element.__memory.repeater) {
        element.__memory.repeater.changed = true;
      }

      sender.markForFullFlush();
    },
  },
};

const applyPayloadToNode = (node, payload, sender, timeline) => {
  // Apply the repeat payload to the element as if it were a normal timeline output
  for (const propertyName in payload) {
    // Control-flow occurs after presentational behaviors, meaning we are overriding
    // whatever may have been set on the source element instance.
    sender.applyPropertyToNode(
      node, // matchingElement
      propertyName,
      payload[propertyName], // finalValue
      timeline,
    );
  }
};

const isSameIfBehavior = (prev, next): boolean => {
  return prev === next;
};

const isSameRepeatBehavior = (prevs, nexts): boolean => {
  if (prevs === nexts) {
    return true;
  }

  if (prevs.length !== nexts.length) {
    return false;
  }

  let answer = true;

  for (let i = 0; i < prevs.length; i++) {
    if (!answer) {
      break;
    }

    const prev = prevs[i];
    const next = nexts[i];

    if (prev === next) {
      continue;
    }

    for (const key in next) {
      if (next[key] !== prev[key]) {
        answer = false;
        break;
      }
    }
  }

  return answer;
};

const findRespectiveRepeatees = (target) => {
  const repeatees = [];

  // The host repeatee of the given target node, if the target is a repeater's descendant
  let host;

  if (target.__memory.repeatee) {
    host = target;
  } else {
    // Note that we do not ascend beyond the nearest host component instance
    ascend(target, (node) => {
      if (node.__memory.repeatee) {
        host = node;
      }
    });
  }

  // If we've found a host repeatee, the target is a descendant of a repeater,
  // and we need to find its respective node within each repeatee.
  if (host) {
    const repeater = host.__memory.repeatee.source;

    if (repeater.__memory.repeater.repeatees) {
      repeater.__memory.repeater.repeatees.forEach((repeatee) => {
        visit(repeatee, (candidate) => {
          if (areNodesRespective(target, candidate)) {
            repeatees.push(candidate);
          }
        });
      });
    }
  }

  return repeatees;
};

const areNodesRespective = (n1, n2): boolean => {
  if (n1 === n2) {
    return true;
  }

  // We assume that all nodes within the tree of a component have unique haiku-ids, and that
  // these haiku-ids are not directly modified within repeater groups
  if (
    // If the haiku-id attribute is empty, assume the comparison isn't valid
    n1.attributes[HAIKU_ID_ATTRIBUTE] &&
    n1.attributes[HAIKU_ID_ATTRIBUTE] === n2.attributes[HAIKU_ID_ATTRIBUTE]
  ) {
    return true;
  }

  return false;
};

export const getFallback = (elementName: string, propertyName: string) => {
  if (elementName) {
    if (
      LAYOUT_COORDINATE_SYSTEM_FALLBACKS[elementName] &&
      LAYOUT_COORDINATE_SYSTEM_FALLBACKS[elementName][propertyName] !== undefined) {
      return LAYOUT_COORDINATE_SYSTEM_FALLBACKS[elementName][propertyName];
    }

    if (FALLBACKS[elementName] && FALLBACKS[elementName][propertyName] !== undefined) {
      return FALLBACKS[elementName][propertyName];
    }
  }

  return FALLBACKS['*'][propertyName];
};

const LAYOUT_COORDINATE_SYSTEM_FALLBACKS = {
  svg: {
    'origin.x': 0.5,
    'origin.y': 0.5,
    'origin.z': 0.5,
  },
};

const LAYOUT_DEFAULTS = Layout3D.createLayoutSpec();

export const FALLBACKS = {
  '*': {
    shown: LAYOUT_DEFAULTS.shown,
    opacity: LAYOUT_DEFAULTS.opacity,
    content: '',
    'offset.x': LAYOUT_DEFAULTS.offset.x,
    'offset.y': LAYOUT_DEFAULTS.offset.y,
    'offset.z': LAYOUT_DEFAULTS.offset.z,
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
    'shear.xy': LAYOUT_DEFAULTS.shear.xy,
    'shear.xz': LAYOUT_DEFAULTS.shear.xz,
    'shear.yz': LAYOUT_DEFAULTS.shear.yz,
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
    'sizeMode.z': LAYOUT_DEFAULTS.sizeMode.z,
    'style.overflowX': 'hidden',
    'style.overflowY': 'hidden',
    'style.zIndex': 1,
    'style.WebkitTapHighlightColor': 'rgba(0,0,0,0)',
    width: 0,
    height: 0,
    x: 0,
    y: 0,
    r: 0,
    cx: 0,
    cy: 0,
    rx: 0,
    ry: 0,
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
    playback: PlaybackSetting.LOOP,
    'controlFlow.repeat': null,
    'controlFlow.placeholder': null,
  },
};

export const LAYOUT_3D_SCHEMA = {
  shown: 'boolean',
  opacity: 'number',
  'offset.x': 'number',
  'offset.y': 'number',
  'offset.z': 'number',
  'origin.x': 'number',
  'origin.y': 'number',
  'origin.z': 'number',
  'translation.x': 'number',
  'translation.y': 'number',
  'translation.z': 'number',
  'rotation.x': 'number',
  'rotation.y': 'number',
  'rotation.z': 'number',
  'scale.x': 'number',
  'scale.y': 'number',
  'scale.z': 'number',
  'shear.xy': 'number',
  'shear.xz': 'number',
  'shear.yz': 'number',
  'sizeAbsolute.x': 'number',
  'sizeAbsolute.y': 'number',
  'sizeAbsolute.z': 'number',
  'sizeProportional.x': 'number',
  'sizeProportional.y': 'number',
  'sizeProportional.z': 'number',
  'sizeDifferential.x': 'number',
  'sizeDifferential.y': 'number',
  'sizeDifferential.z': 'number',
  'sizeMode.x': 'number',
  'sizeMode.y': 'number',
  'sizeMode.z': 'number',
};

export const ATTRS_CAMEL_TO_HYPH = {
  accentHeight: 'accent-height',
  alignmentBaseline: 'alignment-baseline',
  arabicForm: 'arabic-form',
  baselineShift: 'baseline-shift',
  capHeight: 'cap-height',
  clipPath: 'clip-path',
  clipRule: 'clip-rule',
  colorInterpolation: 'color-interpolation',
  colorInterpolationFilters: 'color-interpolation-filters',
  colorProfile: 'color-profile',
  colorRendering: 'color-rendering',
  dominantBaseline: 'dominant-baseline',
  enableBackground: 'enable-background',
  fillOpacity: 'fill-opacity',
  fillRule: 'fill-rule',
  floodColor: 'flood-color',
  floodOpacity: 'flood-opacity',
  fontFamily: 'font-family',
  fontSize: 'font-size',
  fontSizeAdjust: 'font-size-adjust',
  fontStretch: 'font-stretch',
  fontStyle: 'font-style',
  fontVariant: 'font-variant',
  fontWeight: 'font-weight',
  glyphName: 'glyph-name',
  glyphOrientationHorizontal: 'glyph-orientation-horizontal',
  glyphOrientationVertical: 'glyph-orientation-vertical',
  horizAdvX: 'horiz-adv-x',
  horizOriginX: 'horiz-origin-x',
  imageRendering: 'image-rendering',
  letterSpacing: 'letter-spacing',
  lightingColor: 'lighting-color',
  markerEnd: 'marker-end',
  markerMid: 'marker-mid',
  markerStart: 'marker-start',
  overlinePosition: 'overline-position',
  overlineThickness: 'overline-thickness',
  panose1: 'panose-1',
  paintOrder: 'paint-order',
  pointerEvents: 'pointer-events',
  renderingIntent: 'rendering-intent',
  shapeRendering: 'shape-rendering',
  stopColor: 'stop-color',
  stopOpacity: 'stop-opacity',
  strikethroughPosition: 'strikethrough-position',
  strikethroughThickness: 'strikethrough-thickness',
  strokeDasharray: 'stroke-dasharray',
  strokeDashoffset: 'stroke-dashoffset',
  strokeLinecap: 'stroke-linecap',
  strokeLinejoin: 'stroke-linejoin',
  strokeMiterlimit: 'stroke-miterlimit',
  strokeOpacity: 'stroke-opacity',
  strokeWidth: 'stroke-width',
  textAnchor: 'text-anchor',
  textDecoration: 'text-decoration',
  textRendering: 'text-rendering',
  underlinePosition: 'underline-position',
  underlineThickness: 'underline-thickness',
  unicodeBidi: 'unicode-bidi',
  unicodeRange: 'unicode-range',
  unitsPerEm: 'units-per-em',
  vAlphabetic: 'v-alphabetic',
  vHanging: 'v-hanging',
  vIdeographic: 'v-ideographic',
  vMathematical: 'v-mathematical',
  vectorEffect: 'vector-effect',
  vertAdvY: 'vert-adv-y',
  vertOriginX: 'vert-origin-x',
  vertOriginY: 'vert-origin-y',
  wordSpacing: 'word-spacing',
  writingMode: 'writing-mode',
  xHeight: 'x-height',
};

export const ATTRS_HYPH_TO_CAMEL = {};

for (const camel in ATTRS_CAMEL_TO_HYPH) {
  ATTRS_HYPH_TO_CAMEL[ATTRS_CAMEL_TO_HYPH[camel]] = camel;
}

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
    if (isLiveMode(component.config.interactionMode)) {
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

const getRepeatHostNode = (node) => {
  if (!node) {
    return;
  }

  if (node.__memory.repeatee) {
    return node;
  }

  return getRepeatHostNode(node.__memory && node.__memory.parent);
};

const getIfHostNode = (node) => {
  if (!node) {
    return;
  }

  if (node.__memory.if) {
    return node;
  }

  return getIfHostNode(node.__memory && node.__memory.parent);
};

INJECTABLES.$flow = {
  schema: {},
  summon (injectees, component: HaikuComponent, node) {
    if (!injectees.$flow) {
      injectees.$flow = {};
    }

    const repeatNode = getRepeatHostNode(node);

    injectees.$flow.repeat = (repeatNode && repeatNode.__memory.repeatee) || {
      instructions: [],
      payload: {},
      source: repeatNode,
      index: 0,
    };

    const ifNode = getIfHostNode(node);

    injectees.$flow.if = (ifNode && ifNode.__memory.if) || {
      answer: null,
    };

    injectees.$flow.placeholder = node.__memory.placeholder || {
      value: null,
      surrogate: null,
    };
  },
};

INJECTABLES.$helpers = {
  summon (injectees, component: HaikuComponent) {
    injectees.$helpers = component.helpers;
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
