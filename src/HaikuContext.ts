/**
 * Copyright (c) Haiku 2016-2018. All rights reserved.
 */

import {BytecodeOptions, HaikuBytecode, IHaikuClock, IHaikuContext, IRenderer} from './api';
import Config from './Config';
import HaikuBase from './HaikuBase';
import HaikuClock from './HaikuClock';
import HaikuComponent from './HaikuComponent';

const pkg = require('./../package.json');
const VERSION = pkg.version;

export interface ComponentFactory {
  (mount: Element, config: BytecodeOptions): HaikuComponent;
  bytecode?: HaikuBytecode;
  renderer?: IRenderer;
  mount?: Element;
  context?: HaikuContext;
  component?: HaikuComponent;
  PLAYER_VERSION?: string;
  CORE_VERSION?: string;
}

/**
 * @class HaikuContext
 * @description Represents the root of a Haiku component tree within an application.
 * A Haiku component tree may contain many components, but there is only one context.
 * The context is where information shared by all components in the tree should go, e.g. clock time.
 */
// tslint:disable:variable-name
export default class HaikuContext extends HaikuBase implements IHaikuContext {
  clock: IHaikuClock;
  component: HaikuComponent;
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

  constructor (mount, renderer, platform, bytecode, config) {
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

    this.clock = new HaikuClock(this.tickables, this.config.clock || {});

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
      this, // context
      null, // host
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
   * @description Returns the HaikuComponent managed by this context.
   */
  getRootComponent () {
    return this.component;
  }

  /**
   * @method getClock
   * @description Returns the HaikuClock instance associated with this context.
   */
  getClock (): IHaikuClock {
    return this.clock;
  }

  /**
   * @method contextMount
   * @description Adds this context the global update loop.
   */
  contextMount () {
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
   * @description Removes this context from global update loop.
   */
  contextUnmount () {
    this.unmountedTickables = this.tickables.splice(0);
  }

  destroy () {
    super.destroy();
    this.component.destroy();
    this.renderer.destroy();
    this.clock.destroy();
  }

  /**
   * @method addTickable
   * @description Add a tickable object to the list of those that will be called on every clock tick.
   * This only adds if the given object isn't already present in the list.
   */
  addTickable (tickable) {
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
   * @method assignConfig
   * @description Updates internal configuration options, assigning those passed in.
   * Also updates the configuration of the clock instance and managed component instance.
   */
  assignConfig (config: BytecodeOptions, options?: {skipComponentAssign?: boolean}) {
    this.config = {...config};

    if (this.clock) { // This method may run before the clock is initialized
      this.clock.assignOptions(this.config.clock);
    }

    if (this.component) { // This method may run before the managed component is initialized
      if (!options || !options.skipComponentAssign) { // Avoid an infinite loop if the managed component is updating us
        this.component.assignConfig(this.config);
      }
    }
  }

  /**
   * @method getContainer
   * @description Returns the container, a virtual-element-like object that provides sizing
   * constraints at the topmost/outermost level from which the descendant layout can be calculated.
   */
  getContainer (doForceRecalc = false) {
    if (doForceRecalc || this.renderer.shouldCreateContainer) {
      this.renderer.createContainer(this.container); // The container is mutated in place
    }

    return this.container;
  }

  /**
   * @method performFullFlushRender
   * @description Updates the entire component tree, flushing updates to the rendering medium.
   */
  performFullFlushRender () {
    if (!this.mount) {
      return;
    }

    this.component.performFullFlushRenderWithRenderer(
      this.renderer,
      this.config,
    );
  }

  /**
   * @method performPatchRender
   * @description Updates the component tree, but only updating properties we know have changed.
   */
  performPatchRender (skipCache = false) {
    if (!this.mount) {
      return;
    }

    this.component.performPatchRenderWithRenderer(
      this.renderer,
      this.config,
      skipCache,
    );
  }

  /**
   * @method updateMountRootStyles
   * @description Reconciles the properties of the rendering medium's mount element with any
   * configuration options that have been passed in, e.g. CSS overflow settings.
   */
  updateMountRootStyles () {
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

  /**
   * @method tick
   * @description Advances the component animation by one tick. Note that one tick is not necessarily
   * equivalent to one frame. If the animation frame loop is running too fast, the clock may wait before
   * incrementing the frame number. In other words, a tick implies an update but not necessarily a change.
   */
  tick (skipCache = false) {
    try {
      let flushed = false;

      // Only continue ticking and updating if our root component is still activated and awake;
      // this is mainly a hacky internal hook used during hot editing inside Haiku Desktop
      if (!this.component.isDeactivated && !this.component.isSleeping) {
        // This incrementation MUST occur before the blocks below, especially #callRemount,
        // because #callRemount (and friends?) may result in a 'component:will-mount' action
        // firing, which in turn may call this.pause()/this.gotoAndStop(). Internally those
        // methods rely on #tick(), which means they can result in an infinite remount loop.
        const ticks = this.ticks;
        this.ticks++;

        // Perform any necessary updates that have to occur in all copmonents in the scene
        this.component.visitGuestHierarchy((component) => {
          // State transitions are bound to clock time, so we update them on every tick
          component.tickStateTransitions();

          // The top-level component isn't controlled through playback status, so we must skip it
          // otherwise its behavior will not reflect the playback setting specified via options
          if (component === this.component) {
            return;
          }
        });

        // After we've hydrated the tree the first time, we can proceed with patches --
        // unless the component indicates it wants a full flush per its internal settings.
        if (this.component.shouldPerformFullFlush() || this.config.forceFlush || ticks < 1) {
          this.performFullFlushRender();

          flushed = true;
        } else {
          this.performPatchRender(skipCache);
        }

        // We update the mount root *after* we complete the render pass because configuration
        // from the top level should unset anything that the component set.
        // Specifically important wrt overflow, where the component probably defines
        // overflowX/overflowY: hidden, but our configuration might define them as visible.
        this.updateMountRootStyles();

        // Do any initialization that may need to occur if we happen to be on the very first tick
        if (ticks < 1) {
          // If this is the 0th (first) tick, notify anybody listening that we've mounted
          // If we've already flushed, _don't_ request to trigger a re-flush (second arg)
          this.component.callRemount(null, flushed);
        }
      }
    } catch (exception) {
      console.warn('[haiku core] caught error during tick', exception);
      if (this.component) {
        this.component.deactivate();
      }
    }
  }

  /**
   * @method getGlobalUserState
   * @description Since the core renderer is medium-agnostic, we rely on the renderer to provide data
   * about the current user (the mouse position, for example). This method is just a convenience wrapper.
   */
  getGlobalUserState () {
    return this.renderer && this.renderer.getUser && this.renderer.getUser();
  }

  /**
   * @function createComponentFactory
   * @description Returns a factory function that can create a HaikuComponent and run it upon a mount.
   * The created instance runs using the passed-in renderer, bytecode, options, and platform.
   */
  static createComponentFactory = (
    rendererClass,
    bytecode,
    haikuConfigFromFactoryCreator,
    platform,
  ): ComponentFactory => {
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

        // The now-value is used to compute a current date with respect to the current time
        timestamp: Date.now(),
      },

      // The bytecode itself may contain configuration for playback, etc., but is lower precedence than config passed in
      bytecode && bytecode.options,
      haikuConfigFromFactoryCreator,
    );

    /**
     * @function HaikuComponentFactory
     * @description Creates a HaikuContext instance, with a component, and returns the component.
     * The (renderer, bytecode) pair are bootstrapped into the given mount element, and played.
     */
    const HaikuComponentFactory: ComponentFactory = (mount, haikuConfigFromFactory): HaikuComponent => {
      // Merge any config received "late" with the config we might have already gotten during bootstrapping
      const haikuConfigMerged = Config.build(haikuConfigFromTop, haikuConfigFromFactory);

      // Previously these were initialized in the scope above, but I moved them here which seemed to resolve
      // an initialization/mounting issue when running in React.
      const renderer = new rendererClass(mount, haikuConfigMerged);
      const context = new HaikuContext(mount, renderer, platform, bytecode, haikuConfigMerged);
      const component = context.getRootComponent();

      // These properties are added for convenience as hot editing hooks inside Haiku Desktop (and elsewhere?).
      // It's a bit hacky to just expose these in this way, but it proves pretty convenient downstream.
      HaikuComponentFactory.bytecode = bytecode;
      HaikuComponentFactory.renderer = renderer;

      // Note that these ones could theoretically change if this factory was called more than once; use with care
      HaikuComponentFactory.mount = mount;
      HaikuComponentFactory.context = context;
      HaikuComponentFactory.component = component;

      // Finally, return the HaikuComponent instance which can also be used for programmatic behavior
      return component;
    };

    HaikuComponentFactory.PLAYER_VERSION = VERSION; // #LEGACY
    HaikuComponentFactory.CORE_VERSION = VERSION;

    return HaikuComponentFactory;
  };

  // Also expose so we can programatically choose an instance on the page
  static PLAYER_VERSION = VERSION; // #LEGACY
  static CORE_VERSION = VERSION; // #LEGACY
  static __name__ = 'HaikuContext';
}
