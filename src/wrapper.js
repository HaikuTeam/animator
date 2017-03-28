var Context = require('./context')
var Component = require('./component')
var Emitter = require('./emitter')
var merge = require('lodash.merge')

var ADDRESS_PREFIX = ''
var __contexts__ = []

function wrapper (renderer, bytecode, wrapperOptions, platform) {
  if (!platform) {
    throw new Error('A runtime `platform` is required')
  }

  // Hot editing hook
  if (!platform.haiku) platform.haiku = {}

  if (!bytecode.template) {
    throw new Error('Bytecode `template` is required')
  }

  var component = new Component(bytecode)
  var context = new Context(component)
  var index = __contexts__.push(context) - 1
  var address = ADDRESS_PREFIX + index

  function runner (mount, runnerOptions) {
    // Hot editing hook
    if (!mount.haiku) mount.haiku = {}
    mount.haiku.context = context

    var options = merge(wrapperOptions, runnerOptions)

    var controller = options && options.controller || Emitter.create({})
    runner.controller = controller
    controller.emit('componentWillInitialize', component.instance)

    var ticks = 0
    var hash = {} // Dictionary of ids-to-elements, for quick lookups

    function tick () {
      var container = renderer.createContainer(mount) // Stores context size, must recalc for window resizes
      // After we've hydrated the tree the first time, we can proceed with patches,
      // unless the component needs to perform a full flush for some reason
      if (context.component.shouldPerformFullFlush() || ticks < 1) {
        var tree = context.component.render(container)
        renderer.render(mount, container, tree, address, hash, options, component._scopes)
      } else {
        var patches = context.component.patch(container)
        renderer.patch(mount, container, patches, address, hash, options, component._scopes)
      }
      if (ticks < 1) {
        controller.emit('componentDidMount', component.instance)
      }
      ticks++
    }

    context.clock.tickables.push({
      performTick: tick
    })

    if (!options) {
      component.instance.start()
    } else {
      if (options.autostart !== false) {
        component.instance.start()
      }
    }

    // Hot editing hook
    runner.tick = tick

    controller.emit('componentDidInitialize', component.instance)

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
