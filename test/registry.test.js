var test = require('tape')
var React = require('react')
var helpers = require('./helpers')
var interpreter = require('./../src/creation/dom')

test('registry', function(t) {
  t.plan(9)
  return helpers.createDOM(function(err, window) {
    var bytecode = {
      properties: [],
      eventHandlers: [],
      timelines: {},
      template: '<div></div>'
    }
    interpreter.registry.reset()
    var runner = interpreter(bytecode, window)
    var mount = window.document.getElementById('mount')
    runner(mount)
    setTimeout(function() {
      var registry = runner.registry
      t.ok(registry, 'registry present')
      t.ok(window.haiku.registry, 'registry on window')
      registry.setActiveComponent(runner)
      var active = registry.getActiveComponent()
      t.equal(active, runner, 'active runner is runner')
      var contexts = registry.getContexts()
      t.equal(contexts.length, 1, 'one context')
      t.ok(contexts[0].clock, 'context has clock')
      t.ok(contexts[0].component)
      t.ok(contexts[0].component.bytecode)
      t.ok(contexts[0].component.template)
      t.ok(contexts[0].clock.cancelRaf())
    })
  })
})
