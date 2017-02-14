var Context = require('./context')
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

  var context = new Context(bytecode)

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

    context.on('update', function update () {
      var tree = context.expandTree()
      var container = renderer.createContainer(mount)
      renderer.render(mount, container, tree, root, hash)
    })

    if (!options) start()
    else {
      if (options.autostart !== false) start()
    }

    return context.instance
  }

  // Exposed for the Haiku Creator runtime controller
  runner.context = context
  runner.bytecode = bytecode
  runner.renderer = renderer
  runner.registry = registry

  return runner
}

module.exports = wrapper
