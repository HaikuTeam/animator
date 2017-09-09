'use strict'

var test = require('tape')
var SVGPoints = require('./../../lib/helpers/SVGPoints').default

test('SVGPoints.pathToPoints', function (t) {
  t.plan(1)
  var ps1 = SVGPoints.pathToPoints('M250,100L400,400L100,400Z')
  t.equal(
    JSON.stringify(ps1),
    '[{"x":250,"y":100,"moveTo":true},{"x":400,"y":400},{"x":100,"y":400},{"x":250,"y":100}]'
  )
})
