var SimpleEventEmitter = require('./helpers/SimpleEventEmitter')
var assign = require('./helpers/assign')
var HaikuClock = require('./HaikuClock')
var HaikuComponent = require('./HaikuComponent')

// Starting prefix to use for element locators, e.g. 0.1.2.3.4
var COMPONENT_GRAPH_ADDRESS_PREFIX = ''

var DEFAULT_TIMELINE_NAME = 'Default'

var DEFAULT_OPTIONS = {
  // automount: Boolean
  // Whether we should mount the given context to the mount element automatically
  automount: true,

  // autoplay: Boolean
  // Whether we should begin playing the context's animation automatically
  autoplay: true,

  // loop: Boolean
  // Whether we should loop the animation, i.e. restart from the first frame after reaching the last
  loop: false,

  // frame: Function|null
  // Optional function that we will call on every frame, provided for developer convenience
  frame: null,

  // controller: EventEmitter|null
  // Optional hook into events and programmatic interface into the player's internals, for developer usage
  controller: null,

  // onHaikuComponentWillInitialize: Function|null
  // Optional lifecycle event hook (see below)
  onHaikuComponentWillInitialize: null,

  // onHaikuComponentDidMount: Function|null
  // Optional lifecycle event hook (see below)
  onHaikuComponentDidMount: null,

  // onHaikuComponentDidInitialize: Function|null
  // Optional lifecycle event hook (see below)
  onHaikuComponentDidInitialize: null,

  // clock: Object|null
  // Configuration options that will be passed to the HaikuClock instance. See HaikuClock.js for info.
  clock: {},

  // sizing: String|null
  // Configures the sizing mode of the component; may be 'normal', 'stretch', 'contain', or 'cover'. See HaikuComponent.js for info.
  sizing: null,

  // preserve3d: String
  // Placeholder for an option to control whether to enable preserve-3d mode in DOM environments. [UNUSED]
  preserve3d: 'auto',

  // contextMenu: String
  // Whether or not the Haiku context menu should display when the component is right-clicked; may be 'enabled' or 'disabled'.
  contextMenu: 'enabled',

  // position: String
  // CSS position setting for the root of the component in DOM; recommended to keep as 'relative'.
  position: 'relative',

  // overflowX: String|null
  // CSS overflow-x setting for the component. Convenience for allows user to specify the overflow setting without needing a wrapper element.
  overflowX: null,

  // overflowY: String|null
  // CSS overflow-x setting for the component. Convenience for allows user to specify the overflow setting without needing a wrapper element.
  overflowY: null,

  // mixpanel: String|null
  // If provided, a Mixpanel tracking instance will be created using this string as the API token. The default token is Haiku's production token.
  mixpanel: '6f31d4f99cf71024ce27c3e404a79a61'
}

/**
 * @class HaikuContext
 * @description Represents the root of a Haiku component tree within an application.
 * A Haiku component tree may contain many components, but there is only one context.
 * The context is where information shared by all components in the tree should go, e.g. clock time.
 */
function HaikuContext (bytecode, options) {
  if (!(this instanceof HaikuContext)) return new HaikuContext(bytecode, options)

  this.assignOptions(options || {})

  // List of tickable objects managed by this context. These are invoked on every clock tick.
  this._tickables = []

  if (this.options.frame) {
    this._tickables.push({ performTick: this.options.frame })
  }

  this.clock = new HaikuClock(this._tickables, this.options.clock || {})

  // We need to start the loop even if we aren't autoplaying, because we still need time to be calculated even if we don't 'tick'.
  this.clock.run()

  this.component = new HaikuComponent(bytecode, this, options)
  this.component.startTimeline(DEFAULT_TIMELINE_NAME)
}

// Keep track of all instantiated contexts; this is mainly exposed for convenience when debugging the engine,
// as well as to help provide a unique root graph address prefix for subtrees (e.g. 0.2.3.4.5)
HaikuContext.contexts = []

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
 * @method addTickable
 * @description Add a tickable object to the list of those that will be called on every clock tick.
 */
HaikuContext.prototype.addTickable = function addTickable (tickable) {
  this._tickables.push(tickable)
  return this
}

/**
 * @method assignOptions
 * @description Update our internal options settings with those passed in, using the assign algorithm.
 * This also updates the internal options for the clock instance and root component instance.
 */
HaikuContext.prototype.assignOptions = function assignOptions (options) {
  this.options = assign({}, options)

  // HACK: Since we run this method before the clock is initialized sometimes, we have to check whether the clock exists before assigning sub-options to it.
  if (this.clock) {
    this.clock.assignOptions(this.options.clock)
  }

  // HACK: Since we run this method before the component is initialized sometimes, we have to check whether the component exists before assigning options to it.
  if (this.component) {
    this.component.assignOptions(options)
  }

  return this
}

/**
 * @function createComponentFactory
 * @description Returns a factory function that can create a HaikuComponent and run it upon a mount.
 * The created player runs using the passed-in renderer, bytecode, options, and platform.
 */
HaikuContext.createComponentFactory = function createComponentFactory (renderer, bytecode, optionsA, platform) {
  if (!renderer) {
    throw new Error('A runtime `renderer` object is required')
  }

  if (!bytecode) {
    throw new Error('A runtime `bytecode` object is required')
  }

  if (!platform) {
    throw new Error('A runtime `platform` object is required')
  }

  // Note that options may be passed at this level, or below at the factory invocation level.
  var options = assign({}, DEFAULT_OPTIONS, optionsA)

  var context = new HaikuContext(bytecode, options)
  var index = HaikuContext.contexts.push(context) - 1
  var address = COMPONENT_GRAPH_ADDRESS_PREFIX + index

  // The HaikuComponent is really the linchpin of the user's application, handling all the interesting stuff.
  var component = context.getRootComponent()

  /**
   * @function HaikuComponentFactory
   * @description Creates a new HaikuComponent instance.
   * The (renderer, bytecode) pair are bootstrapped into the given mount element, and played.
   */
  function HaikuComponentFactory (mount, optionsB) {
    // Make some Haiku internals available on the mount object for hot editing hooks, or for debugging convenience.
    if (!mount.haiku) mount.haiku = { context: context }

    // Note that options may be passed at this leve, or above at the factory creation level.
    options = assign(options, optionsB)

    // Reassign options on the context since they may have changed when this function was run.
    context.assignOptions(options)

    // If configured, bootstrap the Haiku right-click context menu
    if (renderer.menuize && options.contextMenu !== 'disabled') {
      renderer.menuize(mount, component)
    }

    // Don't set up mixpanel if we're running on localhost since we don't want test data to be tracked
    // TODO: What other heuristics should we use to decide whether to use mixpanel or not?
    if (platform.location && platform.location.hostname !== 'localhost' && platform.location.hostname !== '0.0.0.0') {
      // If configured, initialize Mixpanel with the given API token
      if (renderer.mixpanel && options.mixpanel) {
        renderer.mixpanel(mount, options.mixpanel, component)
      }
    }

    // The 'controller' is one possible programmatic interface into the player; the only law is that it
    // should conform to basic EventEmitter spec, e.g. .on, .emit. If none is provided, we make a fake one.
    var controller
    if (options && options.controller) {
      controller = options.controller
    } else {
      controller = SimpleEventEmitter.create({})
    }

    // Notify anybody who cares that we've successfully initialized their component in memory (but not rendered yet)
    controller.emit('haikuComponentWillInitialize', component)
    component.emit('haikuComponentWillInitialize', component)
    if (options.onHaikuComponentWillInitialize) {
      options.onHaikuComponentWillInitialize(component)
    }

    var hash = {} // Dictionary of ids-to-elements, for quick lookups (#UNUSED?)

    // Call to completely update the entire component tree - as though it were the first time
    function performFullFlushRender () {
      var container = renderer.createContainer(mount)
      var tree = component.render(container, options)
      renderer.render(mount, container, tree, address, hash, options, component._getRenderScopes())
    }

    // Call to update elements of the component tree - but only those that we detect have changed
    function performPatchRender () {
      var container = renderer.createContainer(mount)
      var patches = component.patch(container, options)
      renderer.patch(mount, container, patches, address, hash, options, component._getRenderScopes())
    }

    // Called on every frame, this function updates the mount+root elements to ensure their style settings are in accordance
    // with any passed-in options that may affect it, e.g. CSS overflow or positioning settings
    function updateMountRootStyles () {
      // We can assume the mount has only one child since we only mount one component into it (#?)
      var mountRoot = mount && mount.children[0]
      if (mountRoot) {
        if (options.position && mountRoot.style.position !== options.position) mountRoot.style.position = options.position
        if (options.overflowX && mountRoot.style.overflowX !== options.overflowX) mountRoot.style.overflowX = options.overflowX
        if (options.overflowY && mountRoot.style.overflowY !== options.overflowY) mountRoot.style.overflowY = options.overflowY
      }
      if (mount && options.sizing === 'cover' && mount.style.overflow !== 'hidden') mount.style.overflow = 'hidden'
    }

    // Just a counter for the number of clock ticks that have occurred; used to determine first-frame for mounting
    var ticks = 0

    function tick () {
      updateMountRootStyles()

      // After we've hydrated the tree the first time, we can proceed with patches --
      // unless the component indicates it wants a full flush per its internal settings.
      if (component._shouldPerformFullFlush() || ticks < 1) {
        performFullFlushRender()
      } else {
        performPatchRender()
      }

      // Do any initialization that may need to occur if we happen to be on the very first tick
      if (ticks < 1) {
        // If autoplay is not wanted, stop the all timelines immediately after we've mounted
        // (We have to mount first so that the component displays, but then pause it at that state.)
        // If you don't want the component to show up at all, use options.automount=false.
        if (!options.autoplay) {
          var timelineInstances = component.getTimelines()
          for (var timelineName in timelineInstances) {
            var timelineInstance = timelineInstances[timelineName]
            timelineInstance.pause()
          }
        }

        // If this is the 0th (first) tick, notify anybody listening that we've mounted
        controller.emit('haikuComponentDidMount', component)
        component.emit('haikuComponentDidMount', component)
        if (options.onHaikuComponentDidMount) {
          options.onHaikuComponentDidMount(component)
        }
      }

      ticks++
    }

    context.addTickable({
      performTick: tick
    })

    // Assuming the user wants the app to mount immediately (the default), let's do the mount.
    if (options.automount) {
      // Starting the clock has the effect of doing a render at time 0, a.k.a., mounting!
      component.getClock().start()
    }

    // Notify anybody who cares that we've completed the initialization sequence
    controller.emit('haikuComponentDidInitialize', component)
    component.emit('haikuComponentDidInitialize', component)
    if (options.onHaikuComponentDidInitialize) {
      options.onHaikuComponentDidInitialize(component)
    }

    // These properties are added for convenience as hot editing hooks inside Haiku Desktop (and elsewhere?).
    // It's a bit hacky to just expose these in this way, but it proves pretty convenient downstream.
    HaikuComponentFactory.controller = controller
    HaikuComponentFactory.mount = mount
    HaikuComponentFactory.component = component
    HaikuComponentFactory.tick = tick

    // Finally, return the HaikuComponent instance which can also be used for programmatic behavior
    return component
  }

  // These properties are added for convenience as hot editing hooks inside Haiku Desktop (and elsewhere?).
  // It's a bit hacky to just expose these in this way, but it proves pretty convenient downstream.
  HaikuComponentFactory.context = context
  HaikuComponentFactory.bytecode = bytecode
  HaikuComponentFactory.renderer = renderer

  return HaikuComponentFactory
}

module.exports = HaikuContext
