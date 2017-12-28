var test = require('tape')
var xmlToMana = require('./../../lib/helpers/xmlToMana').default

test('xmlToMana', function (t) {
  t.plan(1)
  var mana = xmlToMana('<div id="foo" style="color: red"><span /></div>')
  t.equal(
    JSON.stringify(mana),
    JSON.stringify({
      elementName: 'div',
      attributes: { id: 'foo', style: { color: 'red' } },
      children: [{ elementName: 'span', attributes: {}, children: [] }]
    }),
    'mana ok'
  )
})
