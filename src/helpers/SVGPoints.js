/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

var svgPoints = require('svg-points')
var parseCssValueString = require('./parseCssValueString')

var SVG_TYPES = {
  g: true,
  rect: true,
  polyline: true,
  polygon: true,
  path: true,
  line: true,
  ellipse: true,
  circle: true
}

var SVG_POINT_NUMERIC_FIELDS = {
  cx: true,
  cy: true,
  r: true,
  rx: true,
  ry: true,
  x1: true,
  x2: true,
  x: true,
  y: true
}

var SVG_POINT_COMMAND_FIELDS = {
  d: true,
  points: true
}

var SVG_COMMAND_TYPES = {
  path: true,
  polyline: true,
  polygon: true
}

function polyPointsStringToPoints (pointsString) {
  if (!pointsString) return []
  if (Array.isArray(pointsString)) return pointsString
  var points = []
  var couples = pointsString.split(/\s+/)
  for (var i = 0; i < couples.length; i++) {
    var pair = couples[i]
    var segs = pair.split(/,\s*/)
    var coord = []
    if (segs[0]) coord[0] = Number(segs[0])
    if (segs[1]) coord[1] = Number(segs[1])
    points.push(coord)
  }
  return points
}

function pointsToPolyString (points) {
  if (!points) return ''
  if (typeof points === 'string') return points
  var arr = []
  for (var i = 0; i < points.length; i++) {
    var point = points[i]
    var seg = point.join(',')
    arr.push(seg)
  }
  return arr.join(' ')
}

function pathToPoints (pathString) {
  var shape = { type: 'path', d: pathString }
  return svgPoints.toPoints(shape)
}

function pointsToPath (pointsArray) {
  return svgPoints.toPath(pointsArray)
}

function manaToPoints (mana) {
  if (SVG_TYPES[mana.elementName] && mana.elementName !== 'rect' && mana.elementName !== 'g') {
    var shape = { type: mana.elementName }
    if (SVG_COMMAND_TYPES[shape.type]) {
      for (var f2 in SVG_POINT_COMMAND_FIELDS) {
        if (mana.attributes[f2]) {
          shape[f2] = mana.attributes[f2]
        }
      }
    } else {
      for (var f1 in SVG_POINT_NUMERIC_FIELDS) {
        if (mana.attributes[f1]) {
          shape[f1] = Number(mana.attributes[f1])
        }
      }
    }
    return svgPoints.toPoints(shape)
  } else {
    // div, rect, svg ...
    var width = parseCssValueString(mana.layout && mana.layout.computed && mana.layout.computed.size && mana.layout.computed.size.x || mana.rect && mana.rect.width || mana.attributes && mana.attributes.style && mana.attributes.style.width || mana.attributes && mana.attributes.width || mana.attributes && mana.attributes.x || 0).value
    var height = parseCssValueString(mana.layout && mana.layout.computed && mana.layout.computed.size && mana.layout.computed.size.y || mana.rect && mana.rect.height || mana.attributes && mana.attributes.style && mana.attributes.style.height || mana.attributes && mana.attributes.height || mana.attributes && mana.attributes.y || 0).value
    var left = parseCssValueString(mana.rect && mana.rect.left || mana.attributes.style && mana.attributes.style.left || mana.attributes.x || 0).value
    var top = parseCssValueString(mana.rect && mana.rect.top || mana.attributes.style && mana.attributes.style.top || mana.attributes.y || 0).value
    return svgPoints.toPoints({
      type: 'rect',
      width: width,
      height: height,
      x: left,
      y: top
    })
  }
}

module.exports = {
  pathToPoints: pathToPoints,
  pointsToPath: pointsToPath,
  polyPointsStringToPoints: polyPointsStringToPoints,
  pointsToPolyString: pointsToPolyString,
  manaToPoints: manaToPoints
}
