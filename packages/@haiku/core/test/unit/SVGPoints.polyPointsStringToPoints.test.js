'use strict'

var test = require('tape')
var SVGPoints = require('./../../lib/helpers/SVGPoints').default

test('SVGPoints.polyPointsStringToPoints', function (t) {
  
  t.plan(1)
  
  var points1 = "149.2,12  49.2 209.1 101     108.2    20  ,  284  50, 28"
  t.equal(
    JSON.stringify([[149.2, 12], [49.2, 209.1], [101, 108.2], [20, 284], [50, 28]]),
    JSON.stringify(SVGPoints.polyPointsStringToPoints(points1))
  )
  
})