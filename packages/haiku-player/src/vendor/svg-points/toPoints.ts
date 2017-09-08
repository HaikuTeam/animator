/* eslint-disable */

"use strict"

exports.__esModule = true

let _extends =
  Object.assign ||
  function(target) {
    for (let i = 1; i < arguments.length; i++) {
      let source = arguments[i]
      for (let key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key]
        }
      }
    }
    return target
  }

function _objectWithoutProperties(obj, keys) {
  let target = {}
  for (let i in obj) {
    if (keys.indexOf(i) >= 0) continue
    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue
    target[i] = obj[i]
  }
  return target
}

let toPoints = function(_ref) {
  let type = _ref.type,
    props = _objectWithoutProperties(_ref, ["type"])

  switch (type) {
    case "circle":
      return getPointsFromCircle(props)
    case "ellipse":
      return getPointsFromEllipse(props)
    case "line":
      return getPointsFromLine(props)
    case "path":
      return getPointsFromPath(props)
    case "polygon":
      return getPointsFromPolygon(props)
    case "polyline":
      return getPointsFromPolyline(props)
    case "rect":
      return getPointsFromRect(props)
    case "g":
      return getPointsFromG(props)
    default:
      throw new Error("Not a valid shape type")
  }
}

let getPointsFromCircle = function(_ref2) {
  let cx = _ref2.cx,
    cy = _ref2.cy,
    r = _ref2.r

  return [
    { x: cx, y: cy - r, moveTo: true },
    { x: cx, y: cy + r, curve: { type: "arc", rx: r, ry: r, sweepFlag: 1 } },
    { x: cx, y: cy - r, curve: { type: "arc", rx: r, ry: r, sweepFlag: 1 } },
  ]
}

let getPointsFromEllipse = function(_ref3) {
  let cx = _ref3.cx,
    cy = _ref3.cy,
    rx = _ref3.rx,
    ry = _ref3.ry

  return [
    { x: cx, y: cy - ry, moveTo: true },
    { x: cx, y: cy + ry, curve: { type: "arc", rx, ry, sweepFlag: 1 } },
    { x: cx, y: cy - ry, curve: { type: "arc", rx, ry, sweepFlag: 1 } },
  ]
}

let getPointsFromLine = function(_ref4) {
  let x1 = _ref4.x1,
    x2 = _ref4.x2,
    y1 = _ref4.y1,
    y2 = _ref4.y2

  return [{ x: x1, y: y1, moveTo: true }, { x: x2, y: y2 }]
}

let validCommands = /[MmLlHhVvCcSsQqTtAaZz]/g

let commandLengths = {
  A: 7,
  C: 6,
  H: 1,
  L: 2,
  M: 2,
  Q: 4,
  S: 4,
  T: 2,
  V: 1,
  Z: 0,
}

let relativeCommands = ["a", "c", "h", "l", "m", "q", "s", "t", "v"]

let isRelative = function(command) {
  return relativeCommands.indexOf(command) !== -1
}

let optionalArcKeys = ["xAxisRotation", "largeArcFlag", "sweepFlag"]

let getCommands = function(d) {
  return d.match(validCommands)
}

let getParams = function(d) {
  return d
    .split(validCommands)
    .map(function(v) {
      return v.replace(/[0-9]+-/g, function(m) {
        return m.slice(0, -1) + " -"
      })
    })
    .map(function(v) {
      return v.replace(/\.[0-9]+/g, function(m) {
        return m + " "
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

let getPointsFromPath = function(_ref5) {
  let d = _ref5.d

  let commands = getCommands(d)
  let params = getParams(d)

  let points = []

  let moveTo = void 0

  for (let i = 0, l = commands.length; i < l; i++) {
    let command = commands[i]
    let upperCaseCommand = command.toUpperCase()
    let commandLength = commandLengths[upperCaseCommand]
    let relative = isRelative(command)
    let prevPoint = i === 0 ? null : points[points.length - 1]

    if (commandLength > 0) {
      let commandParams = params.shift()
      let iterations = commandParams.length / commandLength

      for (let j = 0; j < iterations; j++) {
        switch (upperCaseCommand) {
          case "M":
            let x =
              (relative && prevPoint ? prevPoint.x : 0) + commandParams.shift()
            let y =
              (relative && prevPoint ? prevPoint.y : 0) + commandParams.shift()

            moveTo = { x, y }

            points.push({ x, y, moveTo: true })

            break

          case "L":
            points.push({
              x: (relative ? prevPoint.x : 0) + commandParams.shift(),
              y: (relative ? prevPoint.y : 0) + commandParams.shift(),
            })

            break

          case "H":
            points.push({
              x: (relative ? prevPoint.x : 0) + commandParams.shift(),
              y: prevPoint.y,
            })

            break

          case "V":
            points.push({
              x: prevPoint.x,
              y: (relative ? prevPoint.y : 0) + commandParams.shift(),
            })

            break

          case "A":
            points.push({
              curve: {
                type: "arc",
                rx: commandParams.shift(),
                ry: commandParams.shift(),
                xAxisRotation: commandParams.shift(),
                largeArcFlag: commandParams.shift(),
                sweepFlag: commandParams.shift(),
              },
              x: (relative ? prevPoint.x : 0) + commandParams.shift(),
              y: (relative ? prevPoint.y : 0) + commandParams.shift(),
            })

            for (
              let _iterator = optionalArcKeys,
                _isArray = Array.isArray(_iterator),
                _i = 0,
                _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();
              ;

            ) {
              let _ref6

              if (_isArray) {
                if (_i >= _iterator.length) break
                _ref6 = _iterator[_i++]
              } else {
                _i = _iterator.next()
                if (_i.done) break
                _ref6 = _i.value
              }

              let k = _ref6

              if (points[points.length - 1].curve[k] === 0) {
                delete points[points.length - 1].curve[k]
              }
            }

            break

          case "C":
            points.push({
              curve: {
                type: "cubic",
                x1: (relative ? prevPoint.x : 0) + commandParams.shift(),
                y1: (relative ? prevPoint.y : 0) + commandParams.shift(),
                x2: (relative ? prevPoint.x : 0) + commandParams.shift(),
                y2: (relative ? prevPoint.y : 0) + commandParams.shift(),
              },
              x: (relative ? prevPoint.x : 0) + commandParams.shift(),
              y: (relative ? prevPoint.y : 0) + commandParams.shift(),
            })

            break

          case "S":
            let sx2 = (relative ? prevPoint.x : 0) + commandParams.shift()
            let sy2 = (relative ? prevPoint.y : 0) + commandParams.shift()
            let sx = (relative ? prevPoint.x : 0) + commandParams.shift()
            let sy = (relative ? prevPoint.y : 0) + commandParams.shift()

            let diff = {}

            let sx1 = void 0
            let sy1 = void 0

            if (prevPoint.curve && prevPoint.curve.type === "cubic") {
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
              curve: { type: "cubic", x1: sx1, y1: sy1, x2: sx2, y2: sy2 },
              x: sx,
              y: sy,
            })

            break

          case "Q":
            points.push({
              curve: {
                type: "quadratic",
                x1: (relative ? prevPoint.x : 0) + commandParams.shift(),
                y1: (relative ? prevPoint.y : 0) + commandParams.shift(),
              },
              x: (relative ? prevPoint.x : 0) + commandParams.shift(),
              y: (relative ? prevPoint.y : 0) + commandParams.shift(),
            })

            break

          case "T":
            let tx = (relative ? prevPoint.x : 0) + commandParams.shift()
            let ty = (relative ? prevPoint.y : 0) + commandParams.shift()

            let tx1 = void 0
            let ty1 = void 0

            if (prevPoint.curve && prevPoint.curve.type === "quadratic") {
              let _diff = {
                x: Math.abs(prevPoint.x - prevPoint.curve.x1),
                y: Math.abs(prevPoint.y - prevPoint.curve.y1),
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
              curve: { type: "quadratic", x1: tx1, y1: ty1 },
              x: tx,
              y: ty,
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

let getPointsFromPolygon = function(_ref7) {
  let points = _ref7.points

  return getPointsFromPoints({ closed: true, points })
}

let getPointsFromPolyline = function(_ref8) {
  let points = _ref8.points

  return getPointsFromPoints({ closed: false, points })
}

let getPointsFromPoints = function(_ref9) {
  let closed = _ref9.closed,
    points = _ref9.points

  let numbers = points.split(/[\s,]+/).map(function(n) {
    return parseFloat(n)
  })

  let p = numbers.reduce(function(arr, point, i) {
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

let getPointsFromRect = function(_ref10) {
  let height = _ref10.height,
    rx = _ref10.rx,
    ry = _ref10.ry,
    width = _ref10.width,
    x = _ref10.x,
    y = _ref10.y

  if (rx || ry) {
    return getPointsFromRectWithCornerRadius({
      height,
      rx: rx || ry,
      ry: ry || rx,
      width,
      x,
      y,
    })
  }

  return getPointsFromBasicRect({ height, width, x, y })
}

let getPointsFromBasicRect = function(_ref11) {
  let height = _ref11.height,
    width = _ref11.width,
    x = _ref11.x,
    y = _ref11.y

  return [
    { x, y, moveTo: true },
    { x: x + width, y },
    { x: x + width, y: y + height },
    { x, y: y + height },
    { x, y },
  ]
}

let getPointsFromRectWithCornerRadius = function(_ref12) {
  let height = _ref12.height,
    rx = _ref12.rx,
    ry = _ref12.ry,
    width = _ref12.width,
    x = _ref12.x,
    y = _ref12.y

  let curve = { type: "arc", rx, ry, sweepFlag: 1 }

  return [
    { x: x + rx, y, moveTo: true },
    { x: x + width - rx, y },
    { x: x + width, y: y + ry, curve },
    { x: x + width, y: y + height - ry },
    { x: x + width - rx, y: y + height, curve },
    { x: x + rx, y: y + height },
    { x, y: y + height - ry, curve },
    { x, y: y + ry },
    { x: x + rx, y, curve },
  ]
}

let getPointsFromG = function(_ref13) {
  let shapes = _ref13.shapes
  return shapes.map(function(s) {
    return toPoints(s)
  })
}

exports.default = toPoints
