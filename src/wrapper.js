var Context = require('./context')
var Component = require('./component')
var Emitter = require('./emitter')
var assign = require('lodash.assign')

var ADDRESS_PREFIX = ''
var __contexts__ = []

var DEFAULTS = {
  automount: true,
  autoplay: true,
  loop: false,
  frame: null, // Function to run on every frame
  clock: {}, // See clock.js for options
  stretch: false // Size topmost element to fit container
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

    // Options can also be passed at the execution level
    options = assign(options, runnerOptions) // Already merged with DEFAULTS
    assign(context.options, options) // Make sure new props are available on the context

    var controller
    if (options && options.controller) {
      controller = options.controller
    } else {
      controller = Emitter.create({})
    }

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

    function performEventsOnlyFlush () {
      var container = renderer.createContainer(mount)
      var eventListenerPatches = context.component.patchEventListeners(container)
      renderer.patch(mount, container, eventListenerPatches, address, hash, options, component._scopes)
    }

    function tick () {
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
          component.instance.timelines.pause()
        }
        controller.emit('componentDidMount', component.instance)
      }
      ticks++
    }

    component.instance.on('flushEventListeners', performEventsOnlyFlush)

    context.clock.tickables.push({
      performTick: tick
    })

    // Handle component initialization
    if (options.automount) {
      // Starting the clock has the effect of doing a render at time 0, a.k.a. mount
      component.instance.clock.start()
    }

    // Hot editing hook
    runner.tick = tick

    return context
  }

  // Hot editing hooks
  runner.context = context
  runner.component = component
  runner.bytecode = bytecode
  runner.renderer = renderer

  return runner
}

module.exports = wrapper
