import toPoints from './toPoints'

function pointsToD(p) {
  let d = ''
  let i = 0
  let firstPoint

  for (let point of p) {
    const { curve, moveTo, x, y } = point
    const isFirstPoint = i === 0 || moveTo
    const isLastPoint = i === p.length - 1 || p[ i + 1 ].moveTo
    const prevPoint = i === 0 ? null : p[ i - 1 ]

    if (isFirstPoint) {
      firstPoint = point

      if (!isLastPoint) {
        d += `M${x},${y}`
      }
    } else if (curve) {
      switch (curve.type) {
        case 'arc':
          const { largeArcFlag = 0, rx, ry, sweepFlag = 0, xAxisRotation = 0 } = point.curve
          d += `A${rx},${ry},${xAxisRotation},${largeArcFlag},${sweepFlag},${x},${y}`
          break
        case 'cubic':
          const { x1: cx1, y1: cy1, x2: cx2, y2: cy2 } = point.curve
          d += `C${cx1},${cy1},${cx2},${cy2},${x},${y}`
          break
        case 'quadratic':
          const { x1: qx1, y1: qy1 } = point.curve
          d += `Q${qx1},${qy1},${x},${y}`
          break
      }

      if (isLastPoint && x === firstPoint.x && y === firstPoint.y) {
        d += 'Z'
      }
    } else if (isLastPoint && x === firstPoint.x && y === firstPoint.y) {
      d += 'Z'
    } else if (x !== prevPoint.x && y !== prevPoint.y) {
      d += `L${x},${y}`
    } else if (x !== prevPoint.x) {
      d += `H${x}`
    } else if (y !== prevPoint.y) {
      d += `V${y}`
    }

    i++
  }

  return d
}

function toPath(s) {
  const isPoints = Array.isArray(s)
  const isGroup = isPoints ? (Array.isArray(s[ 0 ])) : (s.type === 'g')
  const points = isPoints ? s : (isGroup ? s.shapes.map(shp => toPoints(shp)) : toPoints(s))

  if (isGroup) {
    return points.map(p => pointsToD(p))
  }

  return pointsToD(points)
}

export default toPath
