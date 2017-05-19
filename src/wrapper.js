var assign = require('lodash.assign')
var Context = require('./context')
var Component = require('./component')
var Emitter = require('./emitter')

var ADDRESS_PREFIX = ''
var __contexts__ = []

var DEFAULTS = {
  automount: true,
  autoplay: true,
  loop: false,
  frame: null, // Function to run on every frame
  clock: {}, // See clock.js for options
  sizing: null, // Sizing mode (string: normal|stretch|cover)
  preserve3d: 'auto',
  contextMenu: 'enabled',
  position: 'relative',
  overflowX: null,
  overflowY: null
}

function wrapper (renderer, bytecode, wrapperOptions, platform) {
  if (!platform) {
    throw new Error('A runtime `platform` is required')
  }

  // Hot editing hook
  if (!platform.haiku) platform.haiku = {}

  if (!bytecode.template) {
    throw new Error('Bytecode `template` is required')
  }

  // Options can be passed at the wrapper level
  var options = assign({}, DEFAULTS, wrapperOptions)

  var component = new Component(bytecode, options)
  var context = new Context(component, options)
  var index = __contexts__.push(context) - 1
  var address = ADDRESS_PREFIX + index

  function runner (mount, runnerOptions) {
    // Hot editing hook
    if (!mount.haiku) mount.haiku = {}
    mount.haiku.context = context
    mount.haiku.player = component.instance // For debugging convenience and/or public usage

    // Options can also be passed at the execution level
    options = assign(options, runnerOptions) // Already merged with DEFAULTS
    context.assignOptions(options)
    component.assignOptions(options)

    if (renderer.menuize && options.contextMenu !== 'disabled') {
      renderer.menuize(mount, component.instance)
    }

    var controller
    if (options && options.controller) {
      controller = options.controller
    } else {
      controller = Emitter.create({})
    }

    controller.emit('haikuComponentWillInitialize', component.instance)
    component.instance.emit('haikuComponentWillInitialize', component.instance)
    if (options.onHaikuComponentWillInitialize) options.onHaikuComponentWillInitialize(component.instance)

    runner.controller = controller

    var ticks = 0
    var hash = {} // Dictionary of ids-to-elements, for quick lookups

    function performFullFlush () {
      var container = renderer.createContainer(mount)
      var tree = context.component.render(container, options)
      renderer.render(mount, container, tree, address, hash, options, component._scopes)
    }

    function performPatch () {
      var container = renderer.createContainer(mount)
      var patches = context.component.patch(container, options)
      renderer.patch(mount, container, patches, address, hash, options, component._scopes)
    }

    function updateRootStyles () {
      var _root = mount && mount.children[0]
      if (_root) {
        if (options.position) {
          if (_root.style.position !== options.position) {
            _root.style.position = options.position
          }
        }

        if (options.overflowX) {
          if (_root.style.overflowX !== options.overflowX) {
            _root.style.overflowX = options.overflowX
          }
        }

        if (options.overflowY) {
          if (_root.style.overflowY !== options.overflowY) {
            _root.style.overflowY = options.overflowY
          }
        }
      }
    }

    // function performEventsOnlyFlush () {
    //   var container = renderer.createContainer(mount)
    //   var eventListenerPatches = context.component.patchEventListeners(container)
    //   renderer.patch(mount, container, eventListenerPatches, address, hash, options, component._scopes)
    // }

    function tick () {
      updateRootStyles()

      // After we've hydrated the tree the first time, we can proceed with patches,
      // unless the component needs to perform a full flush for some reason
      if (context.component.shouldPerformFullFlush() || ticks < 1) {
        performFullFlush()
      } else {
        performPatch()
      }
      if (ticks < 1) {
        // Handle component mount
        if (!options.autoplay) {
          // If no autoplay, stop the clock immediately after we've mounted
          var timelineInstances = component.instance.getTimelines()
          for (var timelineName in timelineInstances) {
            var timelineInstance = timelineInstances[timelineName]
            timelineInstance.pause()
          }
        }
        controller.emit('haikuComponentDidMount', component.instance)
        component.instance.emit('haikuComponentDidMount', component.instance)
        if (options.onHaikuComponentDidMount) options.onHaikuComponentDidMount(component.instance)
      }
      ticks++
    }

    context.clock.tickables.push({
      performTick: tick
    })

    // Handle component initialization
    if (options.automount) {
      // Starting the clock has the effect of doing a render at time 0, a.k.a. mount
      component.instance.getClock().start()
    }

    // Hot editing hook
    runner.tick = tick

    controller.emit('haikuComponentDidInitialize', component.instance)
    component.instance.emit('haikuComponentDidInitialize', component.instance)
    if (options.onHaikuComponentDidInitialize) options.onHaikuComponentDidInitialize(component.instance)

    // Expose public API to end user for programmatic control
    return component.instance
  }

  // Hot editing hooks
  runner.context = context
  runner.component = component
  runner.bytecode = bytecode
  runner.renderer = renderer

  return runner
}

module.exports = wrapper
