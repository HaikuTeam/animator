var test = require('tape')
var TestHelpers = require('./../../TestHelpers')

test('render.dom.appendChild', function (t) {
  t.plan(1)

  var template = {
    elementName: 'div',
    attributes: { 'haiku-id': 'abcde' },
    children: []
  }

  TestHelpers.createRenderTest(template, {}, {}, function (err, mount, renderer, context, component, teardown) {
    if (err) throw err
    t.equal(mount.outerHTML, '<div><div haiku-id="abcde" style="display: block; visibility: visible; opacity: 1;' +
      ' width: 800px; height: 600px;"></div></div>', 'base html render ok')
    teardown()
  })
})
