'use strict'

var test = require('tape')
var parseExpression = require('./../../src/ast/parseExpression')

var MOCK_INJECTABLES = {
  '$player': {
    'timeline': {
      'frame': {
        'elapsed': 'number',
        'apparent': 'number',
      },
    },
  },
  '$user': {
    'mouches': [{
      'x': 'number',
      'y': 'number'
    }]
  }
}

var MOCK_KEYWORDS = {
  'return': {}
}

var MOCK_REACT_STATE = {}

test('ast.parseExpression', function (t) {
  var lines = [
    ['return [0,1,2,3][$player.timeline.frame.elapsed % 4]',{
      warnings: [],
      params: ['$player']
    }],
    ['return ($user.mouches[0].x === typeof 1.0 && 1 <= (100|0) || /foo/i.match("ya")) ? $user.mouches[0].x - 28 : 100',{
      warnings: [],
      params: ['$user']
    }],
    ['return {0:1,1:2}[1]',{
      warnings: [],
      params: []
    }],
    ['return foo_missing',{
      warnings: [],
      params: []
    }],
    ['return [$user,$player,$user.mouse.x,{ blar : $player.timeline.frame}]',{
      warnings: [],
      params: ['$user','$player']
    }],
  ]

  var plan = 0
  lines.forEach((line) => {
    plan += Object.keys(line[1]).length
  })
  t.plan(plan)

  lines.forEach((line) => {
    var expr = parseExpression.wrap(line[0])
    var parse = parseExpression(expr, MOCK_INJECTABLES, MOCK_KEYWORDS, MOCK_REACT_STATE, {})
    for (var key in line[1]) {
      t.equal(JSON.stringify(parse[key]), JSON.stringify(line[1][key]))
    }
  })
})
