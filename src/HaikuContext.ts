/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

import Config from './Config';

import HaikuClock from './HaikuClock';
import HaikuComponent from './HaikuComponent';
import HaikuGlobal from './HaikuGlobal';
import PRNG from './helpers/PRNG';

const pkg = require('./../package.json');
const PLAYER_VERSION = pkg.version;
const DEFAULT_TIMELINE_NAME = 'Default';

/**
 * @class HaikuContext
 * @description Represents the root of a Haiku component tree within an application.
 * A Haiku component tree may contain many components, but there is only one context.
 * The context is where information shared by all components in the tree should go, e.g. clock time.
 */
// tslint:disable-next-line:function-name
export default function HaikuContext(mount, renderer, platform, bytecode, config) {
  if (!renderer) {
    throw new Error('Context requires a renderer');
  }

  if (!bytecode) {
    throw new Error('Context requires bytecode');
  }

  this.PLAYER_VERSION = PLAYER_VERSION;

  this._prng = null; // Instantiated as part of the assignConfig step
  this.assignConfig(config || {});

  this._mount = mount;

  if (!this._mount) {
    console.info('[haiku player] mount not provided so running in headless mode');
  }

  // Make some Haiku internals available on the mount object for hot editing hooks, or for debugging convenience.
  if (this._mount && !this._mount.haiku) {
    this._mount.haiku = {
      context: this,
    };
  }

  this._renderer = renderer;

  // Initialize sets up top-level dom listeners so we don't run it if we don't have a mount
  if (this._mount && this._renderer.initialize) {
    this._renderer.initialize(this._mount);
  }

  this._platform = platform;

  if (!this._platform) {
    console.warn('[haiku player] no platform (e.g. window) provided; some features may be unavailable');
  }

  HaikuContext['contexts'].push(this);

  // List of tickable objects managed by this context. These are invoked on every clock tick.
  // These are removed when context unmounts and re-added in case of re-mount
  this._tickables = [];

  // Our own tick method is the main driver for animation inside of this context
  this._tickables.push({performTick: this.tick.bind(this)});

  if (this.config.options.frame) {
    this._tickables.push({performTick: this.config.options.frame});
  }

  this.component = new HaikuComponent(bytecode, this, this.config, null);
  this.clock = new HaikuClock(this._tickables, this.component, this.config.options.clock || {});
  // We need to start the loop even if we aren't autoplaying,
  // because we still need time to be calculated even if we don't 'tick'.
  this.clock.run();
  this.component.startTimeline(DEFAULT_TIMELINE_NAME);

  // If configured, bootstrap the Haiku right-click context menu
  if (this._mount && this._renderer.menuize && this.config.options.contextMenu !== 'disabled') {
    this._renderer.menuize(this._mount, this.component);
  }

  // Don't set up mixpanel if we're running on localhost since we don't want test data to be tracked
  // TODO: What other heuristics should we use to decide whether to use mixpanel or not?
  if (
    this._mount &&
    this._platform &&
    this._platform.location &&
    this._platform.location.hostname !== 'localhost' &&
    this._platform.location.hostname !== '0.0.0.0'
  ) {
    // If configured, initialize Mixpanel with the given API token
    if (this._renderer.mixpanel && this.config.options.mixpanel) {
      this._renderer.mixpanel(this._mount, this.config.options.mixpanel, this.component);
    }
  }

  // Just a counter for the number of clock ticks that have occurred; used to determine first-frame for mounting
  this._ticks = 0;

  // Assuming the user wants the app to mount immediately (the default), let's do the mount.
  if (this.config.options.automount) {
    // Starting the clock has the effect of doing a render at time 0, a.k.a., mounting!
    this.component.getClock().start();
  }
}

// Keep track of all instantiated contexts; this is mainly exposed for convenience when debugging the engine,
// as well as to help provide a unique root graph address prefix for subtrees (e.g. 0.2.3.4.5)
HaikuContext['contexts'] = [];

// Also expose so we can programatically choose a player on the page
HaikuContext['PLAYER_VERSION'] = PLAYER_VERSION;

HaikuGlobal['HaikuContext'] = HaikuContext;

/**
 * @method getRootComponent
 * @description Return the root component associated with this context (of which there is only one).
 */
HaikuContext.prototype.getRootComponent = function getRootComponent() {
  return this.component;
};

/**
 * @method getClock
 * @description Return the clock instance associated with this context
 */
HaikuContext.prototype.getClock = function getClock() {
  return this.clock;
};

/**
 * @method contextMount
 */
HaikuContext.prototype.contextMount = function _contextMount() {
  if (this._unmountedTickables) {
    // Gotta remember to _remove_ the tickables so we don't end up with dupes if we re-mount later
    const unmounted = this._unmountedTickables.splice(0);
    for (let i = 0; i < unmounted.length; i++) {
      this.addTickable(unmounted[i]);
    }
  }
};

/**
 * @method contextUnmount
 */
HaikuContext.prototype.contextUnmount = function _contextUnmount() {
  this._unmountedTickables = this._tickables.splice(0);
};

/**
 * @method addTickable
 * @description Add a tickable object to the list of those that will be called on every clock tick.
 * This only adds if the given object isn't already present in the list.
 */
HaikuContext.prototype.addTickable = function addTickable(tickable) {
  let alreadyAdded = false;
  for (let i = 0; i < this._tickables.length; i++) {
    if (tickable === this._tickables[i]) {
      alreadyAdded = true;
      break;
    }
  }
  if (!alreadyAdded) {
    this._tickables.push(tickable);
  }
};

/**
 * @method removeTickable
 * @description Remove a tickable object to the list of those that will be called on every clock tick.
 */
HaikuContext.prototype.removeTickable = function removeTickable(tickable) {
  for (let i = (this._tickables.length - 1); i >= 0; i--) {
    if (tickable === this._tickables[i]) {
      this._tickables.splice(i, 1);
    }
  }
};

/**
 * @method assignConfig
 * @description Update our internal settings with those passed in, using the assign algorithm.
 * This also updates the internal options for the clock instance and root component instance.
 */
HaikuContext.prototype.assignConfig = function assignConfig(config, options) {
  this.config = {...config};

  // HACK: Since we run this method before the clock is initialized sometimes, we have to check whether the clock exists
  // before assigning sub-options to it.
  if (this.clock) {
    this.clock.assignOptions(this.config.options.clock);
  }

  // HACK: Since we run this method before the component is initialized sometimes, we have to check whether the
  // component exists before assigning options to it.
  if (this.component) {
    // This step can optionally be skipped since this.component might be updating _us_, and we don't want to create an
    // infinite loop.
    if (!options || !options.skipComponentAssign) {
      this.component.assignConfig(this.config);
    }
  }

  // We assign this in the configuration step since if the seed changes we need a new prng.
  this._prng = new PRNG(this.config.options.seed);
};

// Call to completely update the entire component tree - as though it were the first time
HaikuContext.prototype.performFullFlushRender = function performFullFlushRender() {
  if (!this._mount) {
    return void (0);
  }
  const container = this._renderer.createContainer(this._mount);
  const tree = this.component.render(container, this.config.options);

  // The component can optionally return undefined as a signal to take no action
  // TODO: Maybe something other than undefined would be better
  if (tree !== undefined) {
    this._renderer.render(this._mount, container, tree, this.component);
  }
};

// Call to update elements of the this.component tree - but only those that we detect have changed
HaikuContext.prototype.performPatchRender = function performPatchRender() {
  if (!this._mount) {
    return void (0);
  }

  const container = this.config.options.sizing
    ? this._renderer.createContainer(this._mount)
    : this._renderer.getLastContainer();
  const patches = this.component.patch(container, this.config.options);

  this._renderer.patch(this._mount, patches, this.component);
};

// Called on every frame, this function updates the mount+root elements to ensure their style settings are in accordance
// with any passed-in haikuConfig.options that may affect it, e.g. CSS overflow or positioning settings
HaikuContext.prototype.updateMountRootStyles = function updateMountRootStyles() {
  if (!this._mount) {
    return void (0);
  }

  // We can assume the mount has only one child since we only mount one component into it (#?)
  const root = this._mount && this._mount.children[0];

  if (root) {
    if (this.config.options.position && root.style.position !== this.config.options.position) {
      root.style.position = this.config.options.position;
    }

    if (this.config.options.overflow) {
      root.style.overflow = this.config.options.overflow;
    } else {
      if (
        this.config.options.overflowX &&
        root.style.overflowX !== this.config.options.overflowX
      ) {
        root.style.overflowX = this.config.options.overflowX;
      }
      if (
        this.config.options.overflowY &&
        root.style.overflowY !== this.config.options.overflowY
      ) {
        root.style.overflowY = this.config.options.overflowY;
      }
    }
  }

  // Before Aug 14 2017 we clipped the mount when the sizing was cover, but I think
  // it makes more sense to let the user control the clipping at the mount level;
  // i.e. this behavior is trivial to add if you want it, but annoying to remove if you don't,
  // so I think it makes sense to _not_ do the stanza below.
  // if (
  //   this._mount &&
  //   this.config.options.sizing === 'cover' &&
  //   this._mount.style.overflow !== 'hidden'
  // ) {
  //   this._mount.style.overflow = 'hidden'
  // }
};

HaikuContext.prototype.tick = function tick() {
  let flushed = false;

  // Only continue ticking and updating if our root component is still activated and awake;
  // this is mainly a hacky internal hook used during hot editing inside Haiku Desktop
  if (!this.component._isDeactivated() && !this.component._isAsleep()) {
    // After we've hydrated the tree the first time, we can proceed with patches --
    // unless the component indicates it wants a full flush per its internal settings.
    if (this.component._shouldPerformFullFlush() || this.config.options.forceFlush || this._ticks < 1) {
      this.performFullFlushRender();

      flushed = true;
    } else {
      this.performPatchRender();
    }

    // We update the mount root *after* we complete the render pass ^^ because configuration
    // from the top level should unset anything that the component set.
    // Specifically important wrt overflow, where the component probably defines
    // overflowX/overflowY: hidden, but our configuration might define them as visible.
    this.updateMountRootStyles();

    // Do any initialization that may need to occur if we happen to be on the very first tick
    if (this._ticks < 1) {
      // If this is the 0th (first) tick, notify anybody listening that we've mounted
      // If we've already flushed, _don't_ request to trigger a re-flush (second arg)
      this.component.callRemount(null, flushed);
    }

    this._ticks++;
  }
};

/**
 * @method getDeterministicRand
 * @description Return a random number in the range [0,1].
 * Unlike Math.random() this is deterministic, based on our seed number.
 */
HaikuContext.prototype.getDeterministicRand = function getDeterministicRand() {
  return this._prng.random();
};

/**
 * @method getDeterministicTime
 * @description Return the current timestamp (Unicode) but based on our initial seeded value for 'timestamp'
 * Ultimately this is exposed as the helper 'now'
 */
HaikuContext.prototype.getDeterministicTime = function getDeterministicTime() {
  const runningTime = this.getClock().getRunningTime(); // ms
  const seededTime = this.config.options.timestamp;
  return seededTime + runningTime;
};

HaikuContext.prototype._getGlobalUserState = function _getGlobalUserState() {
  return this._renderer && this._renderer.getUser && this._renderer.getUser();
};

/**
 * @function createComponentFactory
 * @description Returns a factory function that can create a HaikuComponent and run it upon a mount.
 * The created player runs using the passed-in renderer, bytecode, options, and platform.
 */
HaikuContext['createComponentFactory'] = function createComponentFactory(
  rendererClass,
  bytecode,
  haikuConfigFromFactoryCreator,
  platform,
) {
  if (!rendererClass) {
    throw new Error('A runtime renderer class object is required');
  }

  if (!bytecode) {
    throw new Error('A runtime `bytecode` object is required');
  }

  // Only warn on this in case we're running in headless/server/test mode
  if (!platform) {
    console.warn('[haiku player] no runtime `platform` object was provided');
  }

  // Note that haiku Config may be passed at this level, or below at the factory invocation level.
  const haikuConfigFromTop = Config.build(
    {
      options: {
        // The seed value should remain constant from here on, because it is used for PRNG
        seed: Config.seed(),

        // The now value is used to compute a current date with respect to the current time
        timestamp: Date.now(),
      },
    },
    // The bytecode itself may contain configuration for playback, etc., but is lower precedence than config passed in
    {
      options: bytecode && bytecode.options,
    },
    haikuConfigFromFactoryCreator,
  );

  /**
   * @function HaikuComponentFactory
   * @description Creates a new HaikuComponent instance.
   * The (renderer, bytecode) pair are bootstrapped into the given mount element, and played.
   */
  // tslint:disable-next-line:function-name
  function HaikuComponentFactory(mount, haikuConfigFromFactory) {
    // Merge any config received "late" with the config we might have already gotten during bootstrapping
    const haikuConfigMerged = Config.build(haikuConfigFromTop, haikuConfigFromFactory);

    // Previously these were initialized in the scope above, but I moved them here which seemed to resolve
    // an initialization/mounting issue when running in React.
    const renderer = new rendererClass();
    const context = new HaikuContext(mount, renderer, platform, bytecode, haikuConfigMerged);
    const component = context.getRootComponent();

    // These properties are added for convenience as hot editing hooks inside Haiku Desktop (and elsewhere?).
    // It's a bit hacky to just expose these in this way, but it proves pretty convenient downstream.
    HaikuComponentFactory['bytecode'] = bytecode;
    HaikuComponentFactory['renderer'] = renderer;
    // Note that these ones could theoretically change if this factory was called more than once; use with care
    HaikuComponentFactory['mount'] = mount;
    HaikuComponentFactory['context'] = context;
    HaikuComponentFactory['component'] = component;

    // Finally, return the HaikuComponent instance which can also be used for programmatic behavior
    return component;
  }

  HaikuComponentFactory['PLAYER_VERSION'] = PLAYER_VERSION;

  return HaikuComponentFactory;
};
