/**
 * Copyright (c) Haiku 2016-2018. All rights reserved.
 */

import Config from './Config';
import HaikuBase from './HaikuBase';
import HaikuClock from './HaikuClock';
import HaikuComponent from './HaikuComponent';

const pkg = require('./../package.json');
const VERSION = pkg.version;

/**
 * @class HaikuContext
 * @description Represents the root of a Haiku component tree within an application.
 * A Haiku component tree may contain many components, but there is only one context.
 * The context is where information shared by all components in the tree should go, e.g. clock time.
 */
// tslint:disable:variable-name
export default class HaikuContext extends HaikuBase {
  clock;
  component;
  config;
  container;
  CORE_VERSION;
  mount;
  platform;
  PLAYER_VERSION;
  renderer;
  tickables;
  ticks;
  unmountedTickables;

  constructor(mount, renderer, platform, bytecode, config) {
    super();

    if (!renderer) {
      throw new Error('Context requires a renderer');
    }

    if (!bytecode) {
      throw new Error('Context requires bytecode');
    }

    this.PLAYER_VERSION = VERSION; // #LEGACY
    this.CORE_VERSION = VERSION;

    this.assignConfig(config || {}, null);

    this.mount = mount;

    // Make some Haiku internals available on the mount object for hot editing hooks, or for debugging convenience.
    if (this.mount && !this.mount.haiku) {
      this.mount.haiku = {
        context: this,
      };
    }

    this.renderer = renderer;

    // Initialize sets up top-level dom listeners so we don't run it if we don't have a mount
    if (this.mount && this.renderer.initialize) {
      this.renderer.initialize();
    }

    this.platform = platform;

    // List of tickable objects managed by this context. These are invoked on every clock tick.
    // These are removed when context unmounts and re-added in case of re-mount
    this.tickables = [];

    // Our own tick method is the main driver for animation inside of this context
    this.tickables.push({performTick: this.tick.bind(this)});

    if (this.config.frame) {
      this.tickables.push({performTick: this.config.frame});
    }

    this.clock = new HaikuClock(this.tickables, this.component, this.config.clock || {});

    // We need to start the loop even if we aren't autoplaying,
    // because we still need time to be calculated even if we don't 'tick'.
    this.clock.run();

    this.container = this.renderer.createContainer({
      elementName: bytecode,
      attributes: {},
      children: [bytecode.template],
    });

    this.component = new HaikuComponent(
      bytecode,
      this,
      this.config,
      this.container,
    );

    // If configured, bootstrap the Haiku right-click context menu
    if (this.mount && this.renderer.menuize && this.config.contextMenu !== 'disabled') {
      this.renderer.menuize(this.component);
    }

    // By default, Haiku tracks usage by transmitting component metadata to Mixpanel when initialized.
    // Developers can disable this by setting the `mixpanel` option to a falsy value.
    // To transmit metadata to your own Mixpanel account, set the `mixpanel` option to your Mixpanel API token.
    // Don't set up Mixpanel if we're running on localhost since we don't want test data to be tracked
    if (
      this.mount &&
      this.platform &&
      this.platform.location &&
      this.platform.location.hostname !== 'localhost' &&
      this.platform.location.hostname !== '0.0.0.0'
    ) {
      // If configured, initialize Mixpanel with the given API token
      if (this.renderer.mixpanel && this.config.mixpanel) {
        this.renderer.mixpanel(this.config.mixpanel, this.component);
      }
    }

    // Just a counter for the number of clock ticks that have occurred; used to determine first-frame for mounting
    this.ticks = 0;

    // Assuming the user wants the app to mount immediately (the default), let's do the mount.
    if (this.config.automount) {
      // Starting the clock has the effect of doing a render at time 0, a.k.a., mounting!
      this.component.getClock().start();
    }
  }

  /**
   * @method getRootComponent
   * @description Return the root component associated with this context (of which there is only one).
   */
  getRootComponent() {
    return this.component;
  }

  /**
   * @method getClock
   * @description Return the clock instance associated with this context
   */
  getClock() {
    return this.clock;
  }

  /**
   * @method contextMount
   */
  contextMount() {
    if (this.unmountedTickables) {
      // Gotta remember to _remove_ the tickables so we don't end up with dupes if we re-mount later
      const unmounted = this.unmountedTickables.splice(0);
      for (let i = 0; i < unmounted.length; i++) {
        this.addTickable(unmounted[i]);
      }
    }
  }

  /**
   * @method contextUnmount
   */
  contextUnmount() {
    this.unmountedTickables = this.tickables.splice(0);
  }

  /**
   * @method addTickable
   * @description Add a tickable object to the list of those that will be called on every clock tick.
   * This only adds if the given object isn't already present in the list.
   */
  addTickable(tickable) {
    let alreadyAdded = false;
    for (let i = 0; i < this.tickables.length; i++) {
      if (tickable === this.tickables[i]) {
        alreadyAdded = true;
        break;
      }
    }
    if (!alreadyAdded) {
      this.tickables.push(tickable);
    }
  }

  /**
   * @method removeTickable
   * @description Remove a tickable object to the list of those that will be called on every clock tick.
   */
  removeTickable(tickable) {
    for (let i = (this.tickables.length - 1); i >= 0; i--) {
      if (tickable === this.tickables[i]) {
        this.tickables.splice(i, 1);
      }
    }
  }

  /**
   * @method assignConfig
   * @description Update our internal settings with those passed in, using the assign algorithm.
   * This also updates the internal options for the clock instance and root component instance.
   */
  assignConfig(config, options) {
    this.config = {...config};

    // HACK: Since we run this method before the clock is initialized sometimes,
    // we have to check whether the clock exists before assigning sub-options to it.
    if (this.clock) {
      this.clock.assignOptions(this.config.clock);
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
  }

  getContainer(doForceRecalc = false) {
    if (doForceRecalc || this.renderer.shouldCreateContainer) {
      // Mutates this.container in place
      this.renderer.createContainer(this.container);
    }

    return this.container;
  }


  render() {
    const tree = this.component.render(this.getContainer(true), this.config);

    // The component can optionally return undefined as a signal to take no action
    // TODO: Maybe something other than undefined would be better
    if (tree !== undefined) {
      return this.renderer.render(this.getContainer(), tree, this.component);
    }
  }

  // Call to completely update the entire component tree - as though it were the first time
  performFullFlushRender() {
    if (!this.mount) {
      return;
    }

    this.render();
  }

  // Call to update elements of the this.component tree - but only those that we detect have changed
  performPatchRender(skipCache = false) {
    if (!this.mount) {
      return;
    }

    const patches = this.component.patch(this.getContainer(), this.config, skipCache);

    this.renderer.patch(patches, this.component);
  }

  // Called on every frame, this function updates the mount+root elements
  // to ensure their style settings are in accordance with any passed-in
  // haikuConfig.options that may affect it, e.g. CSS overflow or positioning settings
  updateMountRootStyles() {
    if (!this.mount) {
      return;
    }

    // We can assume the mount has only one child since we only mount one component into it (#?)
    const root = this.mount && this.mount.children[0];

    if (root) {
      if (this.config.position && root.style.position !== this.config.position) {
        root.style.position = this.config.position;
      }

      if (this.config.overflow) {
        root.style.overflow = this.config.overflow;
      } else {
        if (
          this.config.overflowX &&
          root.style.overflowX !== this.config.overflowX
        ) {
          root.style.overflowX = this.config.overflowX;
        }
        if (
          this.config.overflowY &&
          root.style.overflowY !== this.config.overflowY
        ) {
          root.style.overflowY = this.config.overflowY;
        }
      }
    }
  }

  tick(skipCache = false) {
    let flushed = false;

    // Only continue ticking and updating if our root component is still activated and awake;
    // this is mainly a hacky internal hook used during hot editing inside Haiku Desktop
    if (!this.component.isDeactivated() && !this.component.isSleeping()) {
      // After we've hydrated the tree the first time, we can proceed with patches --
      // unless the component indicates it wants a full flush per its internal settings.
      if (this.component._shouldPerformFullFlush() || this.config.forceFlush || this.ticks < 1) {
        this.performFullFlushRender();

        flushed = true;
      } else {
        this.performPatchRender(skipCache);
      }

      // We update the mount root *after* we complete the render pass ^^ because configuration
      // from the top level should unset anything that the component set.
      // Specifically important wrt overflow, where the component probably defines
      // overflowX/overflowY: hidden, but our configuration might define them as visible.
      this.updateMountRootStyles();

      // Do any initialization that may need to occur if we happen to be on the very first tick
      if (this.ticks < 1) {
        // If this is the 0th (first) tick, notify anybody listening that we've mounted
        // If we've already flushed, _don't_ request to trigger a re-flush (second arg)
        this.component.callRemount(null, flushed);
      }

      this.ticks++;
    }
  }

  getGlobalUserState() {
    return this.renderer && this.renderer.getUser && this.renderer.getUser();
  }
}

/**
 * @function createComponentFactory
 * @description Returns a factory function that can create a HaikuComponent and run it upon a mount.
 * The created instance runs using the passed-in renderer, bytecode, options, and platform.
 */
HaikuContext['createComponentFactory'] = (
  rendererClass,
  bytecode,
  haikuConfigFromFactoryCreator,
  platform,
) => {
  if (!rendererClass) {
    throw new Error('A runtime renderer class object is required');
  }

  if (!bytecode) {
    throw new Error('A runtime `bytecode` object is required');
  }

  // Note that haiku Config may be passed at this level, or below at the factory invocation level.
  const haikuConfigFromTop = Config.build(
    {
      // The seed value should remain constant from here on, because it is used for PRNG
      seed: Config.seed(),

      // The now value is used to compute a current date with respect to the current time
      timestamp: Date.now(),
    },

    // The bytecode itself may contain configuration for playback, etc., but is lower precedence than config passed in
    bytecode && bytecode.options,
    haikuConfigFromFactoryCreator,
  );

  /**
   * @function HaikuComponentFactory
   * @description Creates a new HaikuComponent instance.
   * The (renderer, bytecode) pair are bootstrapped into the given mount element, and played.
   */
  // tslint:disable-next-line:function-name
  const HaikuComponentFactory = (mount, haikuConfigFromFactory) => {
    // Merge any config received "late" with the config we might have already gotten during bootstrapping
    const haikuConfigMerged = Config.build(haikuConfigFromTop, haikuConfigFromFactory);

    // Previously these were initialized in the scope above, but I moved them here which seemed to resolve
    // an initialization/mounting issue when running in React.
    const renderer = new rendererClass(mount, haikuConfigMerged);
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
  };

  HaikuComponentFactory['PLAYER_VERSION'] = VERSION; // #LEGACY
  HaikuComponentFactory['CORE_VERSION'] = VERSION;

  return HaikuComponentFactory;
};

// Also expose so we can programatically choose an instance on the page
HaikuContext['PLAYER_VERSION'] = VERSION; // #LEGACY
HaikuContext['CORE_VERSION'] = VERSION; // #LEGACY
