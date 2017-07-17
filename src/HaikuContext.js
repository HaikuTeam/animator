/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

var assign = require('./vendor/assign')
var HaikuClock = require('./HaikuClock')
var HaikuComponent = require('./HaikuComponent')
var Config = require('./Config')
var PRNG = require('./helpers/PRNG')

var PLAYER_VERSION = require('./../package.json').version

// Starting prefix to use for element locators, e.g. 0.1.2.3.4
var COMPONENT_GRAPH_ADDRESS_PREFIX = ''

var DEFAULT_TIMELINE_NAME = 'Default'

/**
 * @class HaikuContext
 * @description Represents the root of a Haiku component tree within an application.
 * A Haiku component tree may contain many components, but there is only one context.
 * The context is where information shared by all components in the tree should go, e.g. clock time.
 */
function HaikuContext (mount, renderer, platform, bytecode, config) {
  if (!(this instanceof HaikuContext)) {
    return new HaikuContext(mount, renderer, platform, bytecode, config)
  }

  if (!renderer) {
    throw new Error('Context requires a renderer')
  }

  if (!platform) {
    throw new Error('Context requires a platform')
  }

  if (!bytecode) {
    throw new Error('Context requires bytecode')
  }

  this.PLAYER_VERSION = PLAYER_VERSION

  this._prng = null // Instantiated as part of the assignConfig step
  this.assignConfig(config || {})

  this._mount = mount

  if (!this._mount) {
    console.info('[haiku player] mount not provided so running in headless mode')
  }

  // Make some Haiku internals available on the mount object for hot editing hooks, or for debugging convenience.
  if (this._mount && !this._mount.haiku) {
    this._mount.haiku = {
      context: this
    }
  }

  this._renderer = renderer

  if (this._renderer.initialize) {
    this._renderer.initialize(this._mount)
  }

  this._platform = platform

  this._index = HaikuContext.contexts.push(this) - 1
  this._address = COMPONENT_GRAPH_ADDRESS_PREFIX + this._index

  // List of tickable objects managed by this context. These are invoked on every clock tick.
  // These are removed when context unmounts and re-added in case of re-mount
  this._tickables = []

  // Our own tick method is the main driver for animation inside of this context
  this._tickables.push({ performTick: this.tick.bind(this) })

  if (this.config.options.frame) {
    this._tickables.push({ performTick: this.config.options.frame })
  }

  this.clock = new HaikuClock(this._tickables, this.config.options.clock || {})

  // We need to start the loop even if we aren't autoplaying, because we still need time to be calculated even if we don't 'tick'.
  this.clock.run()

  this.component = new HaikuComponent(bytecode, this, this.config)

  this.component.startTimeline(DEFAULT_TIMELINE_NAME)

  // If configured, bootstrap the Haiku right-click context menu
  if (this._mount && this._renderer.menuize && this.config.options.contextMenu !== 'disabled') {
    this._renderer.menuize(this._mount, this.component)
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
      this._renderer.mixpanel(this._mount, this.config.options.mixpanel, this.component)
    }
  }

  // Dictionary of ids-to-elements, for quick lookups.
  // We hydrate this with elements as we render so we don't have to query the DOM
  // to quickly load elements for patch-style rendering
  this._hash = {
    // Elements are stored in _arrays_ as opposed to singletons, since there could be more than one
    // in case of edge cases or possibly for future implementation details around $repeat
    // "abcde": [el, el]
  }

  // Just a counter for the number of clock ticks that have occurred; used to determine first-frame for mounting
  this._ticks = 0

  // Assuming the user wants the app to mount immediately (the default), let's do the mount.
  if (this.config.options.automount) {
    // Starting the clock has the effect of doing a render at time 0, a.k.a., mounting!
    this.component.getClock().start()
  }
}

// Keep track of all instantiated contexts; this is mainly exposed for convenience when debugging the engine,
// as well as to help provide a unique root graph address prefix for subtrees (e.g. 0.2.3.4.5)
HaikuContext.contexts = []

// Also expose so we can programatically choose a player on the page
HaikuContext.PLAYER_VERSION = PLAYER_VERSION

/**
 * @method getRootComponent
 * @description Return the root component associated with this context (of which there is only one).
 */
HaikuContext.prototype.getRootComponent = function getRootComponent () {
  return this.component
}

/**
 * @method getClock
 * @description Return the clock instance associated with this context
 */
HaikuContext.prototype.getClock = function getClock () {
  return this.clock
}

/**
 * @method contextMount
 */
HaikuContext.prototype.contextMount = function _contextMount () {
  if (this._unmountedTickables) {
    // Gotta remember to _remove_ the tickables so we don't end up with dupes if we re-mount later
    var unmounted = this._unmountedTickables.splice(0)
    for (var i = 0; i < unmounted.length; i++) {
      this.addTickable(unmounted[i])
    }
  }
  return this
}

/**
 * @method contextUnmount
 */
HaikuContext.prototype.contextUnmount = function _contextUnmount () {
  this._unmountedTickables = this._tickables.splice(0)
  return this
}

/**
 * @method addTickable
 * @description Add a tickable object to the list of those that will be called on every clock tick.
 * This only adds if the given object isn't already present in the list.
 */
HaikuContext.prototype.addTickable = function addTickable (tickable) {
  var alreadyAdded = false
  for (var i = 0; i < this._tickables.length; i++) {
    if (tickable === this._tickables[i]) {
      alreadyAdded = true
      break
    }
  }
  if (!alreadyAdded) {
    this._tickables.push(tickable)
  }
  return this
}

/**
 * @method removeTickable
 * @description Remove a tickable object to the list of those that will be called on every clock tick.
 */
HaikuContext.prototype.removeTickable = function removeTickable (tickable) {
  for (var i = (this._tickables.length - 1); i >= 0; i--) {
    if (tickable === this._tickables[i]) {
      this._tickables.splice(i, 1)
    }
  }
  return this
}

/**
 * @method assignConfig
 * @description Update our internal settings with those passed in, using the assign algorithm.
 * This also updates the internal options for the clock instance and root component instance.
 */
HaikuContext.prototype.assignConfig = function assignConfig (config, options) {
  this.config = assign({}, config) // QUESTION: Why do we assign here?

  // HACK: Since we run this method before the clock is initialized sometimes, we have to check whether the clock exists before assigning sub-options to it.
  if (this.clock) {
    this.clock.assignOptions(this.config.options.clock)
  }

  // HACK: Since we run this method before the component is initialized sometimes, we have to check whether the component exists before assigning options to it.
  if (this.component) {
    // This step can optionally be skipped since this.component might be updating _us_, and we don't want to create an infinite loop
    if (!options || !options.skipComponentAssign) {
      this.component.assignConfig(this.config)
    }
  }

  // We assign this in the configuration step since if the seed changes we need a new prng.
  this._prng = new PRNG(this.config.options.seed)

  return this
}

// Call to completely update the entire component tree - as though it were the first time
HaikuContext.prototype.performFullFlushRender = function performFullFlushRender () {
  if (!this._mount) {
    return void (0)
  }
  var container = this._renderer.createContainer(this._mount)
  var tree = this.component.render(container, this.config.options)
  this._renderer.render(
    this._mount,
    container,
    tree,
    this._address,
    this._hash,
    this.config.options,
    this.component._getRenderScopes()
  )
  return this
}

// Call to update elements of the this.component tree - but only those that we detect have changed
HaikuContext.prototype.performPatchRender = function performPatchRender () {
  if (!this._mount) {
    return void (0)
  }
  var container = this._renderer.createContainer(this._mount)
  var patches = this.component.patch(container, this.config.options)
  this._renderer.patch(
    this._mount,
    container,
    patches,
    this._address,
    this._hash,
    this.config.options,
    this.component._getRenderScopes()
  )
  return this
}

// Called on every frame, this function updates the mount+root elements to ensure their style settings are in accordance
// with any passed-in haikuConfig.options that may affect it, e.g. CSS overflow or positioning settings
HaikuContext.prototype.updateMountRootStyles = function updateMountRootStyles () {
  if (!this._mount) {
    return void (0)
  }

  // We can assume the mount has only one child since we only mount one component into it (#?)
  var root = this._mount && this._mount.children[0]

  if (root) {
    if (this.config.options.position && root.style.position !== this.config.options.position) {
      root.style.position = this.config.options.position
    }
    if (
      this.config.options.overflowX &&
      root.style.overflowX !== this.config.options.overflowX
    ) {
      root.style.overflowX = this.config.options.overflowX
    }
    if (
      this.config.options.overflowY &&
      root.style.overflowY !== this.config.options.overflowY
    ) {
      root.style.overflowY = this.config.options.overflowY
    }
  }

  if (
    this._mount &&
    this.config.options.sizing === 'cover' &&
    this._mount.style.overflow !== 'hidden'
  ) {
    this._mount.style.overflow = 'hidden'
  }

  return this
}

HaikuContext.prototype.tick = function tick () {
  this.updateMountRootStyles()

  var flushed = false

  // After we've hydrated the tree the first time, we can proceed with patches --
  // unless the component indicates it wants a full flush per its internal settings.
  if (this.component._shouldPerformFullFlush() || this.config.options.forceFlush || this._ticks < 1) {
    this.performFullFlushRender()

    flushed = true
  } else {
    this.performPatchRender()
  }

  // Do any initialization that may need to occur if we happen to be on the very first tick
  if (this._ticks < 1) {
    // If this is the 0th (first) tick, notify anybody listening that we've mounted
    // If we've already flushed, _don't_ request to trigger a re-flush (second arg)
    this.component.callRemount(null, flushed)
  }

  this._ticks++

  return this
}

/**
 * @method getDeterministicRand
 * @description Return a random number in the range [0,1].
 * Unlike Math.random() this is deterministic, based on our seed number.
 */
HaikuContext.prototype.getDeterministicRand = function getDeterministicRand () {
  return this._prng.random()
}

/**
 * @method getDeterministicTime
 * @description Return the current timestamp (Unicode) but based on our initial seeded value for 'timestamp'
 * Ultimately this is exposed as the helper 'now'
 */
HaikuContext.prototype.getDeterministicTime = function getDeterministicTime () {
  var runningTime = this.getClock().getRunningTime() // ms
  var seededTime = this.config.options.timestamp
  return seededTime + runningTime
}

HaikuContext.prototype._getGlobalUserState = function _getGlobalUserState () {
  return this._renderer && this._renderer.user && this._renderer.user()
}

/**
 * @function createComponentFactory
 * @description Returns a factory function that can create a HaikuComponent and run it upon a mount.
 * The created player runs using the passed-in renderer, bytecode, options, and platform.
 */
HaikuContext.createComponentFactory = function createComponentFactory (
  RendererClass,
  bytecode,
  haikuConfigFromFactoryCreator,
  platform
) {
  if (!RendererClass) {
    throw new Error('A runtime renderer class object is required')
  }

  if (!bytecode) {
    throw new Error('A runtime `bytecode` object is required')
  }

  // Only warn on this in case we're running in headless/server/test mode
  if (!platform) {
    console.warn('[haiku player] no runtime `platform` object was provided')
  }

  // Note that haiku Config may be passed at this level, or below at the factory invocation level.
  var haikuConfigFromTop = Config.build(
    {
      options: {
        // The seed value should remain constant from here on, because it is used for PRNG
        seed: Config.seed(),

        // The now value is used to compute a current date with respect to the current time
        timestamp: Date.now()
      }
    },
    // The bytecode itself may contain configuration for playback, etc., but is lower precedence than config passed in
    {
      options: bytecode && bytecode.options
    },
    haikuConfigFromFactoryCreator
  )

  /**
   * @function HaikuComponentFactory
   * @description Creates a new HaikuComponent instance.
   * The (renderer, bytecode) pair are bootstrapped into the given mount element, and played.
   */
  function HaikuComponentFactory (mount, haikuConfigFromFactory) {
    // Merge any config received "late" with the config we might have already gotten during bootstrapping
    var haikuConfigMerged = Config.build(haikuConfigFromTop, haikuConfigFromFactory)

    // Previously these were initialized in the scope above, but I moved them here which seemed to resolve
    // an initialization/mounting issue when running in React.
    var renderer = new RendererClass()
    var context = new HaikuContext(mount, renderer, platform, bytecode, haikuConfigMerged)
    var component = context.getRootComponent()

    // These properties are added for convenience as hot editing hooks inside Haiku Desktop (and elsewhere?).
    // It's a bit hacky to just expose these in this way, but it proves pretty convenient downstream.
    HaikuComponentFactory.bytecode = bytecode
    HaikuComponentFactory.renderer = renderer
    // Note that these ones could theoretically change if this factory was called more than once; use with care
    HaikuComponentFactory.mount = mount
    HaikuComponentFactory.context = context
    HaikuComponentFactory.component = component

    // Finally, return the HaikuComponent instance which can also be used for programmatic behavior
    return component
  }

  HaikuComponentFactory.PLAYER_VERSION = PLAYER_VERSION

  return HaikuComponentFactory
}

module.exports = HaikuContext
