/* eslint-disable */

'use strict'

exports.__esModule = true

var _toPoints = require('./toPoints')

var _toPoints2 = _interopRequireDefault(_toPoints)

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj }
}

var pointsToD = function(p) {
  var d = ''
  var i = 0
  var firstPoint = void 0

  for (
    var _iterator = p,
      _isArray = Array.isArray(_iterator),
      _i = 0,
      _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();
    ;

  ) {
    var _ref

    if (_isArray) {
      if (_i >= _iterator.length) break
      _ref = _iterator[_i++]
    } else {
      _i = _iterator.next()
      if (_i.done) break
      _ref = _i.value
    }

    var point = _ref
    var _point$curve = point.curve,
      curve = _point$curve === undefined ? false : _point$curve,
      moveTo = point.moveTo,
      x = point.x,
      y = point.y

    var isFirstPoint = i === 0 || moveTo
    var isLastPoint = i === p.length - 1 || p[i + 1].moveTo
    var prevPoint = i === 0 ? null : p[i - 1]

    if (isFirstPoint) {
      firstPoint = point

      if (!isLastPoint) {
        d += 'M' + x + ',' + y
      }
    } else if (curve) {
      switch (curve.type) {
        case 'arc':
          var _point$curve2 = point.curve,
            _point$curve2$largeAr = _point$curve2.largeArcFlag,
            largeArcFlag = _point$curve2$largeAr === undefined
              ? 0
              : _point$curve2$largeAr,
            rx = _point$curve2.rx,
            ry = _point$curve2.ry,
            _point$curve2$sweepFl = _point$curve2.sweepFlag,
            sweepFlag = _point$curve2$sweepFl === undefined
              ? 0
              : _point$curve2$sweepFl,
            _point$curve2$xAxisRo = _point$curve2.xAxisRotation,
            xAxisRotation = _point$curve2$xAxisRo === undefined
              ? 0
              : _point$curve2$xAxisRo

          d +=
            'A' +
            rx +
            ',' +
            ry +
            ',' +
            xAxisRotation +
            ',' +
            largeArcFlag +
            ',' +
            sweepFlag +
            ',' +
            x +
            ',' +
            y
          break
        case 'cubic':
          var _point$curve3 = point.curve,
            cx1 = _point$curve3.x1,
            cy1 = _point$curve3.y1,
            cx2 = _point$curve3.x2,
            cy2 = _point$curve3.y2

          d += 'C' + cx1 + ',' + cy1 + ',' + cx2 + ',' + cy2 + ',' + x + ',' + y
          break
        case 'quadratic':
          var _point$curve4 = point.curve,
            qx1 = _point$curve4.x1,
            qy1 = _point$curve4.y1

          d += 'Q' + qx1 + ',' + qy1 + ',' + x + ',' + y
          break
      }

      if (isLastPoint && x === firstPoint.x && y === firstPoint.y) {
        d += 'Z'
      }
    } else if (isLastPoint && x === firstPoint.x && y === firstPoint.y) {
      d += 'Z'
    } else if (x !== prevPoint.x && y !== prevPoint.y) {
      d += 'L' + x + ',' + y
    } else if (x !== prevPoint.x) {
      d += 'H' + x
    } else if (y !== prevPoint.y) {
      d += 'V' + y
    }

    i++
  }

  return d
}

var toPath = function(s) {
  var isPoints = Array.isArray(s)
  var isGroup = isPoints ? Array.isArray(s[0]) : s.type === 'g'
  var points = isPoints
    ? s
    : isGroup
      ? s.shapes.map(function(shp) {
          return (0, _toPoints2.default)(shp)
        })
      : (0, _toPoints2.default)(s)

  if (isGroup) {
    return points.map(function(p) {
      return pointsToD(p)
    })
  }

  return pointsToD(points)
}

exports.default = toPath
