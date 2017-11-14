const toPoints = (spec) => {
  switch (spec.type) {
    case 'circle':
      return getPointsFromCircle(spec)
    case 'ellipse':
      return getPointsFromEllipse(spec)
    case 'line':
      return getPointsFromLine(spec)
    case 'path':
      return getPointsFromPath(spec)
    case 'polygon':
      return getPointsFromPolygon(spec)
    case 'polyline':
      return getPointsFromPolyline(spec)
    case 'rect':
      return getPointsFromRect(spec)
    case 'g':
      return getPointsFromG(spec)
    default:
      throw new Error('Not a valid shape type')
  }
}

const getPointsFromCircle = ({ cx, cy, r }) => {
  return [
    { x: cx, y: cy - r, moveTo: true },
    { x: cx, y: cy + r, curve: { type: 'arc', rx: r, ry: r, sweepFlag: 1 } },
    { x: cx, y: cy - r, curve: { type: 'arc', rx: r, ry: r, sweepFlag: 1 } }
  ]
}

const getPointsFromEllipse = ({ cx, cy, rx, ry }) => {
  return [
    { x: cx, y: cy - ry, moveTo: true },
    { x: cx, y: cy + ry, curve: { type: 'arc', rx, ry, sweepFlag: 1 } },
    { x: cx, y: cy - ry, curve: { type: 'arc', rx, ry, sweepFlag: 1 } }
  ]
}

const getPointsFromLine = ({ x1, x2, y1, y2 }) => {
  return [
    { x: x1, y: y1, moveTo: true },
    { x: x2, y: y2 }
  ]
}

const validCommands = /[MmLlHhVvCcSsQqTtAaZz]/g

const commandLengths = {
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

const relativeCommands = [
  'a',
  'c',
  'h',
  'l',
  'm',
  'q',
  's',
  't',
  'v'
]

var PARSING_REGEXPS = {
  command: /^[MmLlHhVvCcSsQqTtAaZz]/g,
  whitespace: /^[\s]+/,
  comma: /^,/,
  number: /^0b[01]+|^0o[0-7]+|^0x[\da-f]+|^-?\d*\.?\d+(?:e[+-]?\d+)?/i,
}

const isRelative = command => relativeCommands.indexOf(command) !== -1

const optionalArcKeys = [ 'xAxisRotation', 'largeArcFlag', 'sweepFlag' ]

const getCommands = d => d.match(validCommands)

function tokenize (d) {
  let tokens = []
  let chunk = d
  let total = chunk.length
  let iterations = 0
  while (chunk.length > 0) {
    for (let regexpName in PARSING_REGEXPS) {
      let match = PARSING_REGEXPS[regexpName].exec(chunk)
      if (match) {
        tokens.push({ type: regexpName, raw: match[0] })
        // Need to slice the chunk at the original match length
        chunk = chunk.slice(match[0].length, chunk.length)
        break
      }
    }
  }
  return tokens
}

// const getParams = d => d.split(validCommands)
//   .map(v => v.replace(/[0-9]+-/g, m => `${m.slice(0, -1)} -`))
//   .map(v => v.replace(/\.[0-9]+/g, m => `${m} `))
//   .map(v => v.trim())
//   .filter(v => v.length > 0)
//   .map(v => v.split(/[ ,]+/)
//     .map(parseFloat)
//     .filter(n => !isNaN(n))
//   )

const getParams = (d) => {
  const tokens = tokenize(d)

  const fixed = tokens.filter((t) => {
    return t.type === 'number' || t.type === 'command' || t.type === 'comma'
  }).map((t) => {
    return t.raw
  }).join(' ')

  const segs = fixed.split(validCommands)
    .map((p) => {
      return p.trim()
    })
    .filter((p) => {
      return p.length > 0
    })

  const groups = segs.map((s) => {
    return s.split(/[ ,]+/)
      .map((n) => {
        return parseFloat(n)
      })
      .filter((n) => {
        return !isNaN(n)
      })
  })

  return groups
}

const getPointsFromPath = ({ d }) => {
  const commands = getCommands(d)
  const params = getParams(d)

  const points = []

  let moveTo

  for (let i = 0, l = commands.length; i < l; i++) {
    const command = commands[ i ]
    const upperCaseCommand = command.toUpperCase()
    const commandLength = commandLengths[ upperCaseCommand ]
    const relative = isRelative(command)

    let prevPoint = (points.length < 1) ? null : points[points.length - 1]

    if (commandLength > 0) {
      const commandParams = params.shift()
      const iterations = commandParams.length / commandLength

      for (let j = 0; j < iterations; j++) {
        prevPoint = (points.length < 1) ? null : points[points.length - 1]

        switch (upperCaseCommand) {
          case 'M':
            const x = (relative && prevPoint ? prevPoint.x : 0) + commandParams.shift()
            const y = (relative && prevPoint ? prevPoint.y : 0) + commandParams.shift()

            moveTo = { x, y }

            points.push({ x, y, moveTo: true })

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

            for (let k of optionalArcKeys) {
              if (points[ points.length - 1 ][ 'curve' ][ k ] === 0) {
                delete points[ points.length - 1 ][ 'curve' ][ k ]
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
            const sx2 = (relative ? prevPoint.x : 0) + commandParams.shift()
            const sy2 = (relative ? prevPoint.y : 0) + commandParams.shift()
            const sx = (relative ? prevPoint.x : 0) + commandParams.shift()
            const sy = (relative ? prevPoint.y : 0) + commandParams.shift()

            const diff = { x: null, y: null }

            let sx1
            let sy1

            if (prevPoint.curve && prevPoint.curve.type === 'cubic') {
              diff.x = Math.abs(prevPoint.x - prevPoint.curve.x2)
              diff.y = Math.abs(prevPoint.y - prevPoint.curve.y2)
              sx1 = prevPoint.x < prevPoint.curve.x2 ? prevPoint.x - diff.x : prevPoint.x + diff.x
              sy1 = prevPoint.y < prevPoint.curve.y2 ? prevPoint.y - diff.y : prevPoint.y + diff.y
            } else {
              diff.x = Math.abs(sx - sx2)
              diff.y = Math.abs(sy - sy2)
              sx1 = prevPoint.x
              sy1 = prevPoint.y
            }

            points.push({ curve: { type: 'cubic', x1: sx1, y1: sy1, x2: sx2, y2: sy2 }, x: sx, y: sy })

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
            const tx = (relative ? prevPoint.x : 0) + commandParams.shift()
            const ty = (relative ? prevPoint.y : 0) + commandParams.shift()

            let tx1
            let ty1

            if (prevPoint.curve && prevPoint.curve.type === 'quadratic') {
              const diff = {
                x: Math.abs(prevPoint.x - prevPoint.curve.x1),
                y: Math.abs(prevPoint.y - prevPoint.curve.y1)
              }

              tx1 = prevPoint.x < prevPoint.curve.x1 ? prevPoint.x - diff.x : prevPoint.x + diff.x
              ty1 = prevPoint.y < prevPoint.curve.y1 ? prevPoint.y - diff.y : prevPoint.y + diff.y
            } else {
              tx1 = prevPoint.x
              ty1 = prevPoint.y
            }

            points.push({ curve: { type: 'quadratic', x1: tx1, y1: ty1 }, x: tx, y: ty })

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

const getPointsFromPolygon = ({ points }) => {
  return getPointsFromPoints({ closed: true, points })
}

const getPointsFromPolyline = ({ points }) => {
  return getPointsFromPoints({ closed: false, points })
}

const getPointsFromPoints = ({ closed, points }) => {
  const numbers = points.split(/[\s,]+/).map(n => parseFloat(n))

  const p = numbers.reduce((arr, point, i) => {
    if (i % 2 === 0) {
      arr.push({ x: point })
    } else {
      arr[ (i - 1) / 2 ].y = point
    }

    return arr
  }, [])

  if (closed) {
    p.push({ ...p[ 0 ] })
  }

  p[ 0 ].moveTo = true

  return p
}

const getPointsFromRect = ({ height, rx, ry, width, x, y }) => {
  if (rx || ry) {
    return getPointsFromRectWithCornerRadius({
      height,
      rx: rx || ry,
      ry: ry || rx,
      width,
      x,
      y
    })
  }

  return getPointsFromBasicRect({ height, width, x, y })
}

const getPointsFromBasicRect = ({ height, width, x, y }) => {
  return [
    { x, y, moveTo: true },
    { x: x + width, y },
    { x: x + width, y: y + height },
    { x, y: y + height },
    { x, y }
  ]
}

const getPointsFromRectWithCornerRadius = ({ height, rx, ry, width, x, y }) => {
  const curve = { type: 'arc', rx, ry, sweepFlag: 1 }

  return [
    { x: x + rx, y, moveTo: true },
    { x: x + width - rx, y },
    { x: x + width, y: y + ry, curve },
    { x: x + width, y: y + height - ry },
    { x: x + width - rx, y: y + height, curve },
    { x: x + rx, y: y + height },
    { x, y: y + height - ry, curve },
    { x, y: y + ry },
    { x: x + rx, y, curve }
  ]
}

const getPointsFromG = ({ shapes }) => shapes.map(s => toPoints(s))

export default toPoints
