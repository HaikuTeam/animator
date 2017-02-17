var Context = require('./context')
var Component = require('./component')
var registry = require('./registry')

var LOCATOR_PREFIX = '' // 0. ?

function wrapper (renderer, bytecode, platform) {
  if (!platform) {
    throw new Error('A runtime `platform` is required')
  }

  // Exposed for the Haiku Creator runtime controller
  if (!platform.haiku) platform.haiku = {}
  if (!platform.haiku.registry) platform.haiku.registry = registry

  if (!bytecode.template) {
    throw new Error('Bytecode `template` is required')
  }

  var component = new Component(bytecode)
  var context = new Context(component)

  function start () {
    context.clock.loop()
    context.clock.start()
  }

  function runner (mount, options) {
    // Exposed for the Haiku Creator runtime controller
    if (!mount.haiku) mount.haiku = {}
    mount.haiku.context = context

    var index = registry.insertContext(context)
    var hash = {}
    var root = LOCATOR_PREFIX + index

    context.clock.tickables.push({
      performTick: function _tick () {
        var tree = context.component.render()
        var container = renderer.createContainer(mount)
        renderer.render(mount, container, tree, root, hash)
      }
    })

    if (!options) start()
    else {
      if (options.autostart !== false) start()
    }

    return context
  }

  // Exposed for the Haiku Creator runtime controller
  runner.context = context
  runner.bytecode = bytecode
  runner.renderer = renderer
  runner.registry = registry

  return runner
}

wrapper.registry = registry

module.exports = wrapper
