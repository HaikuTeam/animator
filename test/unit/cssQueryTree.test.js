'use strict'

var test = require('tape')
var queryTree = require('./../../src/helpers/cssQueryTree')

test('cssQueryTree', function(t) {
  t.plan(2)

  var tree = {elementName:'div',attributes:{id:'foo'},children:[{elementName:'div',attributes:{class:'bar'},children:[{elementName:'div'},{elementName:'h1'}]}]}
  var matches = queryTree([], tree, '.bar', { name: 'elementName', attributes: 'attributes', children: 'children'})
  t.equal(JSON.stringify(matches), '[{"elementName":"div","attributes":{"class":"bar"},"children":[{"elementName":"div","__depth":2,"__index":0},{"elementName":"h1","__depth":2,"__index":1}],"__depth":1,"__index":0}]', 'matches list is correct')

  var tree = {elementName:'div',attributes:{id:'foo'},children:[{elementName:'div',attributes:{class:'bar'},children:[{elementName:'div',attributes:{id:'yaya'}},{elementName:'h1',attributes:{id:'hoop'}}]}]}
  var matches = queryTree([], tree, 'div', { name: 'elementName', attributes: 'attributes', children: 'children', maxdepth: 1 })
  t.equal(JSON.stringify(matches), '[{"elementName":"div","attributes":{"id":"foo"},"children":[{"elementName":"div","attributes":{"class":"bar"},"children":[{"elementName":"div","attributes":{"id":"yaya"},"__depth":2,"__index":0},{"elementName":"h1","attributes":{"id":"hoop"},"__depth":2,"__index":1}],"__depth":1,"__index":0}],"__depth":0,"__index":0},{"elementName":"div","attributes":{"class":"bar"},"children":[{"elementName":"div","attributes":{"id":"yaya"},"__depth":2,"__index":0},{"elementName":"h1","attributes":{"id":"hoop"},"__depth":2,"__index":1}],"__depth":1,"__index":0}]', 'matches list with maxdepth set is correct')
})
