var Context = require('./context')
var Component = require('./component')
var Emitter = require('./emitter')

var ADDRESS_PREFIX = ''
var __contexts__ = []

function wrapper (renderer, bytecode, platform) {
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

  function runner (mount, options) {
    // Hot editing hook
    if (!mount.haiku) mount.haiku = {}
    mount.haiku.context = context

    var controller = options && options.controller || Emitter.create({})
    runner.controller = controller
    controller.emit('contextWillInitialize', component.instance)

    var mounted = false

    function tick () {
      var tree = context.component.render()
      var container = renderer.createContainer(mount)
      renderer.render(mount, container, tree, address, {})
      if (!mounted) {
        controller.emit('componentDidMount', component.instance)
        mounted = true
      }
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

    controller.emit('contextDidInitialize', component.instance)

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
