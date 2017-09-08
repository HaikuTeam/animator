/* eslint-disable */

'use strict'

exports.__esModule = true

var _extends =
  Object.assign ||
  function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i]
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key]
        }
      }
    }
    return target
  }

function _objectWithoutProperties(obj, keys) {
  var target = {}
  for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue
    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue
    target[i] = obj[i]
  }
  return target
}

var toPoints = function(_ref) {
  var type = _ref.type,
    props = _objectWithoutProperties(_ref, ['type'])

  switch (type) {
    case 'circle':
      return getPointsFromCircle(props)
    case 'ellipse':
      return getPointsFromEllipse(props)
    case 'line':
      return getPointsFromLine(props)
    case 'path':
      return getPointsFromPath(props)
    case 'polygon':
      return getPointsFromPolygon(props)
    case 'polyline':
      return getPointsFromPolyline(props)
    case 'rect':
      return getPointsFromRect(props)
    case 'g':
      return getPointsFromG(props)
    default:
      throw new Error('Not a valid shape type')
  }
}

var getPointsFromCircle = function(_ref2) {
  var cx = _ref2.cx,
    cy = _ref2.cy,
    r = _ref2.r

  return [
    { x: cx, y: cy - r, moveTo: true },
    { x: cx, y: cy + r, curve: { type: 'arc', rx: r, ry: r, sweepFlag: 1 } },
    { x: cx, y: cy - r, curve: { type: 'arc', rx: r, ry: r, sweepFlag: 1 } }
  ]
}

var getPointsFromEllipse = function(_ref3) {
  var cx = _ref3.cx,
    cy = _ref3.cy,
    rx = _ref3.rx,
    ry = _ref3.ry

  return [
    { x: cx, y: cy - ry, moveTo: true },
    { x: cx, y: cy + ry, curve: { type: 'arc', rx: rx, ry: ry, sweepFlag: 1 } },
    { x: cx, y: cy - ry, curve: { type: 'arc', rx: rx, ry: ry, sweepFlag: 1 } }
  ]
}

var getPointsFromLine = function(_ref4) {
  var x1 = _ref4.x1,
    x2 = _ref4.x2,
    y1 = _ref4.y1,
    y2 = _ref4.y2

  return [{ x: x1, y: y1, moveTo: true }, { x: x2, y: y2 }]
}

var validCommands = /[MmLlHhVvCcSsQqTtAaZz]/g

var commandLengths = {
  A: 7,
  C: 6,
  H: 1,
  L: 2,
  M: 2,
  Q: 4,
  S: 4,
  T: 2,
  V: 1,
  Z: 0
}

var relativeCommands = ['a', 'c', 'h', 'l', 'm', 'q', 's', 't', 'v']

var isRelative = function(command) {
  return relativeCommands.indexOf(command) !== -1
}

var optionalArcKeys = ['xAxisRotation', 'largeArcFlag', 'sweepFlag']

var getCommands = function(d) {
  return d.match(validCommands)
}

var getParams = function(d) {
  return d
    .split(validCommands)
    .map(function(v) {
      return v.replace(/[0-9]+-/g, function(m) {
        return m.slice(0, -1) + ' -'
      })
    })
    .map(function(v) {
      return v.replace(/\.[0-9]+/g, function(m) {
        return m + ' '
      })
    })
    .map(function(v) {
      return v.trim()
    })
    .filter(function(v) {
      return v.length > 0
    })
    .map(function(v) {
      return v.split(/[ ,]+/).map(parseFloat).filter(function(n) {
        return !isNaN(n)
      })
    })
}

var getPointsFromPath = function(_ref5) {
  var d = _ref5.d

  var commands = getCommands(d)
  var params = getParams(d)

  var points = []

  var moveTo = void 0

  for (var i = 0, l = commands.length; i < l; i++) {
    var command = commands[i]
    var upperCaseCommand = command.toUpperCase()
    var commandLength = commandLengths[upperCaseCommand]
    var relative = isRelative(command)
    var prevPoint = i === 0 ? null : points[points.length - 1]

    if (commandLength > 0) {
      var commandParams = params.shift()
      var iterations = commandParams.length / commandLength

      for (var j = 0; j < iterations; j++) {
        switch (upperCaseCommand) {
          case 'M':
            var x =
              (relative && prevPoint ? prevPoint.x : 0) + commandParams.shift()
            var y =
              (relative && prevPoint ? prevPoint.y : 0) + commandParams.shift()

            moveTo = { x: x, y: y }

            points.push({ x: x, y: y, moveTo: true })

            break

          case 'L':
            points.push({
              x: (relative ? prevPoint.x : 0) + commandParams.shift(),
              y: (relative ? prevPoint.y : 0) + commandParams.shift()
            })

            break

          case 'H':
            points.push({
              x: (relative ? prevPoint.x : 0) + commandParams.shift(),
              y: prevPoint.y
            })

            break

          case 'V':
            points.push({
              x: prevPoint.x,
              y: (relative ? prevPoint.y : 0) + commandParams.shift()
            })

            break

          case 'A':
            points.push({
              curve: {
                type: 'arc',
                rx: commandParams.shift(),
                ry: commandParams.shift(),
                xAxisRotation: commandParams.shift(),
                largeArcFlag: commandParams.shift(),
                sweepFlag: commandParams.shift()
              },
              x: (relative ? prevPoint.x : 0) + commandParams.shift(),
              y: (relative ? prevPoint.y : 0) + commandParams.shift()
            })

            for (
              var _iterator = optionalArcKeys,
                _isArray = Array.isArray(_iterator),
                _i = 0,
                _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();
              ;

            ) {
              var _ref6

              if (_isArray) {
                if (_i >= _iterator.length) break
                _ref6 = _iterator[_i++]
              } else {
                _i = _iterator.next()
                if (_i.done) break
                _ref6 = _i.value
              }

              var k = _ref6

              if (points[points.length - 1]['curve'][k] === 0) {
                delete points[points.length - 1]['curve'][k]
              }
            }

            break

          case 'C':
            points.push({
              curve: {
                type: 'cubic',
                x1: (relative ? prevPoint.x : 0) + commandParams.shift(),
                y1: (relative ? prevPoint.y : 0) + commandParams.shift(),
                x2: (relative ? prevPoint.x : 0) + commandParams.shift(),
                y2: (relative ? prevPoint.y : 0) + commandParams.shift()
              },
              x: (relative ? prevPoint.x : 0) + commandParams.shift(),
              y: (relative ? prevPoint.y : 0) + commandParams.shift()
            })

            break

          case 'S':
            var sx2 = (relative ? prevPoint.x : 0) + commandParams.shift()
            var sy2 = (relative ? prevPoint.y : 0) + commandParams.shift()
            var sx = (relative ? prevPoint.x : 0) + commandParams.shift()
            var sy = (relative ? prevPoint.y : 0) + commandParams.shift()

            var diff = {}

            var sx1 = void 0
            var sy1 = void 0

            if (prevPoint.curve && prevPoint.curve.type === 'cubic') {
              diff.x = Math.abs(prevPoint.x - prevPoint.curve.x2)
              diff.y = Math.abs(prevPoint.y - prevPoint.curve.y2)
              sx1 = prevPoint.x < prevPoint.curve.x2
                ? prevPoint.x - diff.x
                : prevPoint.x + diff.x
              sy1 = prevPoint.y < prevPoint.curve.y2
                ? prevPoint.y - diff.y
                : prevPoint.y + diff.y
            } else {
              diff.x = Math.abs(sx - sx2)
              diff.y = Math.abs(sy - sy2)
              sx1 = prevPoint.x
              sy1 = prevPoint.y
            }

            points.push({
              curve: { type: 'cubic', x1: sx1, y1: sy1, x2: sx2, y2: sy2 },
              x: sx,
              y: sy
            })

            break

          case 'Q':
            points.push({
              curve: {
                type: 'quadratic',
                x1: (relative ? prevPoint.x : 0) + commandParams.shift(),
                y1: (relative ? prevPoint.y : 0) + commandParams.shift()
              },
              x: (relative ? prevPoint.x : 0) + commandParams.shift(),
              y: (relative ? prevPoint.y : 0) + commandParams.shift()
            })

            break

          case 'T':
            var tx = (relative ? prevPoint.x : 0) + commandParams.shift()
            var ty = (relative ? prevPoint.y : 0) + commandParams.shift()

            var tx1 = void 0
            var ty1 = void 0

            if (prevPoint.curve && prevPoint.curve.type === 'quadratic') {
              var _diff = {
                x: Math.abs(prevPoint.x - prevPoint.curve.x1),
                y: Math.abs(prevPoint.y - prevPoint.curve.y1)
              }

              tx1 = prevPoint.x < prevPoint.curve.x1
                ? prevPoint.x - _diff.x
                : prevPoint.x + _diff.x
              ty1 = prevPoint.y < prevPoint.curve.y1
                ? prevPoint.y - _diff.y
                : prevPoint.y + _diff.y
            } else {
              tx1 = prevPoint.x
              ty1 = prevPoint.y
            }

            points.push({
              curve: { type: 'quadratic', x1: tx1, y1: ty1 },
              x: tx,
              y: ty
            })

            break
        }
      }
    } else {
      if (prevPoint.x !== moveTo.x || prevPoint.y !== moveTo.y) {
        points.push({ x: moveTo.x, y: moveTo.y })
      }
    }
  }

  return points
}

var getPointsFromPolygon = function(_ref7) {
  var points = _ref7.points

  return getPointsFromPoints({ closed: true, points: points })
}

var getPointsFromPolyline = function(_ref8) {
  var points = _ref8.points

  return getPointsFromPoints({ closed: false, points: points })
}

var getPointsFromPoints = function(_ref9) {
  var closed = _ref9.closed,
    points = _ref9.points

  var numbers = points.split(/[\s,]+/).map(function(n) {
    return parseFloat(n)
  })

  var p = numbers.reduce(function(arr, point, i) {
    if (i % 2 === 0) {
      arr.push({ x: point })
    } else {
      arr[(i - 1) / 2].y = point
    }

    return arr
  }, [])

  if (closed) {
    p.push(_extends({}, p[0]))
  }

  p[0].moveTo = true

  return p
}

var getPointsFromRect = function(_ref10) {
  var height = _ref10.height,
    rx = _ref10.rx,
    ry = _ref10.ry,
    width = _ref10.width,
    x = _ref10.x,
    y = _ref10.y

  if (rx || ry) {
    return getPointsFromRectWithCornerRadius({
      height: height,
      rx: rx || ry,
      ry: ry || rx,
      width: width,
      x: x,
      y: y
    })
  }

  return getPointsFromBasicRect({ height: height, width: width, x: x, y: y })
}

var getPointsFromBasicRect = function(_ref11) {
  var height = _ref11.height,
    width = _ref11.width,
    x = _ref11.x,
    y = _ref11.y

  return [
    { x: x, y: y, moveTo: true },
    { x: x + width, y: y },
    { x: x + width, y: y + height },
    { x: x, y: y + height },
    { x: x, y: y }
  ]
}

var getPointsFromRectWithCornerRadius = function(_ref12) {
  var height = _ref12.height,
    rx = _ref12.rx,
    ry = _ref12.ry,
    width = _ref12.width,
    x = _ref12.x,
    y = _ref12.y

  var curve = { type: 'arc', rx: rx, ry: ry, sweepFlag: 1 }

  return [
    { x: x + rx, y: y, moveTo: true },
    { x: x + width - rx, y: y },
    { x: x + width, y: y + ry, curve: curve },
    { x: x + width, y: y + height - ry },
    { x: x + width - rx, y: y + height, curve: curve },
    { x: x + rx, y: y + height },
    { x: x, y: y + height - ry, curve: curve },
    { x: x, y: y + ry },
    { x: x + rx, y: y, curve: curve }
  ]
}

var getPointsFromG = function(_ref13) {
  var shapes = _ref13.shapes
  return shapes.map(function(s) {
    return toPoints(s)
  })
}

exports.default = toPoints
