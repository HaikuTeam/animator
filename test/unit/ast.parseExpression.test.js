'use strict'

var test = require('tape')
var parseExpression = require('./../../src/ast/parseExpression')

var MOCK_INJECTABLES = {
  '$window': {},
  '$inp': {
    'rogress': {
      foo: 'number',
      food: 'number',
      foobar: 'number',
      foolish: {}
    }
  },
  '$user': {
    'mouse': {
      'x': 'number'
    }
  },
  'foobar': {},
  'arr': [{
    arrr: 'number'
  }]
}

var MOCK_KEYWORDS = {
  'return': {}
}

var MOCK_REACT_STATE = {}

test('parseExpression-1', function (t) {
  var lines = [
    ['$', [{"name":"$window"},{"name":"$inp"},{"name":"$user"}]],
    ['$i', [{"name":"$inp"},{"name":"$inp.rogress"}]],
    ['$in', [{"name":"$inp"},{"name":"$inp.rogress"}]],
    ['$inp', [{"name":"$inp.rogress"}]],
    ['$inp.', undefined],
    ['$inp.a', []], // Syntax err
    ['$inp.r', [{"name":"$inp.rogress"},{"name":"$inp.rogress.foo"},{"name":"$inp.rogress.food"},{"name":"$inp.rogress.foobar"},{"name":"$inp.rogress.foolish"}]],
    ['$inp.ro', [{"name":"$inp.rogress"},{"name":"$inp.rogress.foo"},{"name":"$inp.rogress.food"},{"name":"$inp.rogress.foobar"},{"name":"$inp.rogress.foolish"}]],
    ['$inp.rog', [{"name":"$inp.rogress"},{"name":"$inp.rogress.foo"},{"name":"$inp.rogress.food"},{"name":"$inp.rogress.foobar"},{"name":"$inp.rogress.foolish"}]],
    ['$inp.rogr', [{"name":"$inp.rogress"},{"name":"$inp.rogress.foo"},{"name":"$inp.rogress.food"},{"name":"$inp.rogress.foobar"},{"name":"$inp.rogress.foolish"}]],
    ['$inp.rogress', [{"name":"$inp.rogress.foo"},{"name":"$inp.rogress.food"},{"name":"$inp.rogress.foobar"},{"name":"$inp.rogress.foolish"}]],
    ['$inp.rogress.', undefined], // Syntax err
    ['$inp.rogress.f', [{"name":"$inp.rogress.foo"},{"name":"$inp.rogress.food"},{"name":"$inp.rogress.foobar"},{"name":"$inp.rogress.foolish"}]],
    ['$inp.rogress.foo', [{"name":"$inp.rogress.food"},{"name":"$inp.rogress.foobar"},{"name":"$inp.rogress.foolish"}]],
    ['$inp.rogress.food', []],
    ['$inp.rogress.foolish', []],
    ['ar', [{"name":"arr"}]] // No arr.0
  ]

  t.plan(lines.length)

  lines.forEach((line) => {
    var expr = parseExpression.wrap(`
      var aa = 1
      var bb = [1,2,3], cc = 456
      let dd = "foo"
      const zz = "bar"
      const oo = { a: 1 }
      const { a } = oo
      return [
        $nothere,
        foobar, // here
        $window,
        dfg, // undeclared
        ${line[0]},
        wow
      ]
    `)

    var parse = parseExpression(expr, MOCK_INJECTABLES, MOCK_KEYWORDS, MOCK_REACT_STATE, {
      line: 14,
      ch: line[0].length + 8
    })

    t.equal(JSON.stringify(parse.completions), JSON.stringify(line[1]))
  })
})
