var test = require('tape')
var TestHelpers = require('./../../TestHelpers')

test('render.dom.hotEditingMode.on', function (t) {
  const template = {
    elementName: 'div',
    attributes: { 'haiku-id': 'abcde' },
    children: []
  }

  const timelines = {
    Default: {
      'haiku:abcde': {
        'opacity': { 0: { value: 1 } }
      }
    }
  }

  const config = { options: { hotEditingMode: true } }

  TestHelpers.createRenderTest(
    template,
    timelines,
    config,
    function (err, mount, renderer, context, component, teardown) {
      if (err) throw err
      context.tick()
      t.equal(mount.firstChild.haiku.virtual.layout.opacity, 1, 'initial opacity is 1')
      component._bytecode.timelines.Default['haiku:abcde'].opacity['0'].value = 0.5
      component.clearCaches()
      context.tick()
      t.equal(mount.firstChild.haiku.virtual.layout.opacity, 0.5, 'non-animated property updated in hot-editing mode')
      teardown()
    }
  )

  t.end()
})

test('render.dom.hotEditingMode.off', function (t) {
  const template = {
    elementName: 'div',
    attributes: { 'haiku-id': 'abcde' },
    children: []
  }

  const timelines = {
    Default: {
      'haiku:abcde': {
        'opacity': { 0: { value: 1 } }
      }
    }
  }

  const config = { options: { hotEditingMode: false } }

  TestHelpers.createRenderTest(
    template,
    timelines,
    config,
    function (err, mount, renderer, context, component, teardown) {
      if (err) throw err
      context.tick()
      t.equal(mount.firstChild.haiku.virtual.layout.opacity, 1, 'initial opacity is 1')
      component._bytecode.timelines.Default['haiku:abcde'].opacity['0'].value = 0.5
      component.clearCaches()
      context.tick()
      t.equal(mount.firstChild.haiku.virtual.layout.opacity, 1, 'non-animated property is static without hot-editing mode')
      teardown()
    }
  )

  t.end()
})
