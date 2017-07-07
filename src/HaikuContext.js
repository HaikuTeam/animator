/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

var assign = require('./vendor/assign')
var HaikuClock = require('./HaikuClock')
var HaikuComponent = require('./HaikuComponent')
var Config = require('./Config')

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
function HaikuContext (bytecode, config, tickable) {
  if (!(this instanceof HaikuContext)) {
    return new HaikuContext(bytecode, config)
  }

  this.PLAYER_VERSION = PLAYER_VERSION

  this.assignConfig(config || {})

  // List of tickable objects managed by this context. These are invoked on every clock tick.
  // These are removed when context unmounts and re-added in case of re-mount
  this._tickables = []
  if (tickable) {
    this._tickables.push(tickable)
  }
  if (this.config.options.frame) {
    this._tickables.push({ performTick: this.config.options.frame })
  }

  this.clock = new HaikuClock(this._tickables, this.config.options.clock || {})

  // We need to start the loop even if we aren't autoplaying, because we still need time to be calculated even if we don't 'tick'.
  this.clock.run()

  this.component = new HaikuComponent(bytecode, this, this.config)

  this.component.startTimeline(DEFAULT_TIMELINE_NAME)
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

  return this
}

/**
 * @function createComponentFactory
 * @description Returns a factory function that can create a HaikuComponent and run it upon a mount.
 * The created player runs using the passed-in renderer, bytecode, options, and platform.
 */
HaikuContext.createComponentFactory = function createComponentFactory (
  renderer,
  bytecode,
  haikuConfigFromFactoryCreator,
  platform
) {
  if (!renderer) {
    throw new Error('A runtime `renderer` object is required')
  }

  if (!bytecode) {
    throw new Error('A runtime `bytecode` object is required')
  }

  // Only warn on this in case we're running in headless/server/test mode
  if (!platform) {
    console.warn('[haiku player] no runtime `platform` object was provided')
  }

  // Note that haiku Config may be passed at this level, or below at the factory invocation level.
  var haikuConfig = Config.build(
    {
      options: {
        // The seed value should remain constant from here on, because it is used for PRNG
        seed: Config.seed()
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
    // Note that options may be passed at this leve, or above at the factory creation level.
    haikuConfig = Config.build(haikuConfig, haikuConfigFromFactory)

    // Previously these were initialized in the scope above, but I moved them here which seemed to resolve
    // an initialization/mounting issue when running in React.
    var context = new HaikuContext(bytecode, haikuConfig, { performTick: tick })
    var index = HaikuContext.contexts.push(context) - 1
    var address = COMPONENT_GRAPH_ADDRESS_PREFIX + index

    // The HaikuComponent is really the linchpin of the user's application, handling all the interesting stuff.
    var component = context.getRootComponent()

    // Make some Haiku internals available on the mount object for hot editing hooks, or for debugging convenience.
    if (!mount.haiku) mount.haiku = { context: context }

    // If configured, bootstrap the Haiku right-click context menu
    if (renderer.menuize && haikuConfig.options.contextMenu !== 'disabled') {
      renderer.menuize(mount, component)
    }

    // Don't set up mixpanel if we're running on localhost since we don't want test data to be tracked
    // TODO: What other heuristics should we use to decide whether to use mixpanel or not?
    if (
      platform &&
      platform.location &&
      platform.location.hostname !== 'localhost' &&
      platform.location.hostname !== '0.0.0.0'
    ) {
      // If configured, initialize Mixpanel with the given API token
      if (renderer.mixpanel && haikuConfig.options.mixpanel) {
        renderer.mixpanel(mount, haikuConfig.options.mixpanel, component)
      }
    }

    // Dictionary of ids-to-elements, for quick lookups.
    // We hydrate this with elements as we render so we don't have to query the DOM
    // to quickly load elements for patch-style rendering
    var hash = {
      // Elements are stored in _arrays_ as opposed to singletons, since there could be more than one
      // in case of edge cases or possibly for future implementation details around $repeat
      // "abcde": [el, el]
    }

    // Call to completely update the entire component tree - as though it were the first time
    function performFullFlushRender () {
      var container = renderer.createContainer(mount)
      var tree = component.render(container, haikuConfig.options)
      renderer.render(
        mount,
        container,
        tree,
        address,
        hash,
        haikuConfig.options,
        component._getRenderScopes()
      )
    }

    // Call to update elements of the component tree - but only those that we detect have changed
    function performPatchRender () {
      var container = renderer.createContainer(mount)
      var patches = component.patch(container, haikuConfig.options)
      renderer.patch(
        mount,
        container,
        patches,
        address,
        hash,
        haikuConfig.options,
        component._getRenderScopes()
      )
    }

    // Called on every frame, this function updates the mount+root elements to ensure their style settings are in accordance
    // with any passed-in haikuConfig.options that may affect it, e.g. CSS overflow or positioning settings
    function updateMountRootStyles () {
      // We can assume the mount has only one child since we only mount one component into it (#?)
      var mountRoot = mount && mount.children[0]
      if (mountRoot) {
        if (haikuConfig.options.position && mountRoot.style.position !== haikuConfig.options.position) {
          mountRoot.style.position = haikuConfig.options.position
        }
        if (
          haikuConfig.options.overflowX &&
          mountRoot.style.overflowX !== haikuConfig.options.overflowX
        ) {
          mountRoot.style.overflowX = haikuConfig.options.overflowX
        }
        if (
          haikuConfig.options.overflowY &&
          mountRoot.style.overflowY !== haikuConfig.options.overflowY
        ) {
          mountRoot.style.overflowY = haikuConfig.options.overflowY
        }
      }
      if (
        mount &&
        haikuConfig.options.sizing === 'cover' &&
        mount.style.overflow !== 'hidden'
      ) {
        mount.style.overflow = 'hidden'
      }
    }

    // Just a counter for the number of clock ticks that have occurred; used to determine first-frame for mounting
    var ticks = 0

    function tick () {
      updateMountRootStyles()

      var flushed = false

      // After we've hydrated the tree the first time, we can proceed with patches --
      // unless the component indicates it wants a full flush per its internal settings.
      if (component._shouldPerformFullFlush() || haikuConfig.options.forceFlush || ticks < 1) {
        performFullFlushRender()
        flushed = true
      } else {
        performPatchRender()
      }

      // Do any initialization that may need to occur if we happen to be on the very first tick
      if (ticks < 1) {
        // If this is the 0th (first) tick, notify anybody listening that we've mounted
        // If we've already flushed, _don't_ request to trigger a re-flush (second arg)
        component.callRemount(null, flushed)
      }

      ticks++
    }

    // Assuming the user wants the app to mount immediately (the default), let's do the mount.
    if (haikuConfig.options.automount) {
      // Starting the clock has the effect of doing a render at time 0, a.k.a., mounting!
      component.getClock().start()
    }

    // These properties are added for convenience as hot editing hooks inside Haiku Desktop (and elsewhere?).
    // It's a bit hacky to just expose these in this way, but it proves pretty convenient downstream.
    HaikuComponentFactory.mount = mount
    HaikuComponentFactory.tick = tick
    HaikuComponentFactory.component = component
    HaikuComponentFactory.context = context
    HaikuComponentFactory.bytecode = bytecode
    HaikuComponentFactory.renderer = renderer

    // Finally, return the HaikuComponent instance which can also be used for programmatic behavior
    return component
  }

  return HaikuComponentFactory
}

module.exports = HaikuContext
