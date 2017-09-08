'use strict'

var test = require('tape')
var manaToHtml = require('./../src/manaToHtml')

test('mana', function(t) {
  t.plan(2)
  var m1 = {elementName:'div',attributes:{id:'foo'},children:[{elementName:'div',attributes:{style:{height:'100px'}}}]}
  var html1 = manaToHtml('', m1, { name: 'elementName', attributes: 'attributes', children: 'children' }, {})
  var html2 = manaToHtml('', m1, { name: 'elementName', attributes: 'attributes', children: 'children' }, { jsx: true })
  t.equal(html1, '<div id="foo"><div style="height:100px;"></div></div>')
  t.equal(html2, '<div id="foo"><div style={{"height":"100px"}}></div></div>')
})
