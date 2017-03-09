var Context = require('./context')
var Component = require('./component')

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

  function start () {
    context.clock.loop()
    context.clock.start()
  }

  function runner (mount, options) {
    // Hot editing hook
    if (!mount.haiku) mount.haiku = {}
    mount.haiku.context = context

    function tick () {
      var tree = context.component.render()
      var container = renderer.createContainer(mount)
      renderer.render(mount, container, tree, address, {})
    }

    context.clock.tickables.push({
      performTick: tick
    })

    if (!options) {
      start()
    } else {
      if (options.autostart !== false) {
        start()
      }
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
