function computeNumericDelta (prev, next, computer) {
  if (next === undefined) {
    return prev
  } else if (typeof prev === 'number') {
    return computer(prev, next)
  } else if (Array.isArray(prev)) {
    const arr = []
    for (let i = 0; i < prev.length; i++) arr[i] = computeNumericDelta(prev[i], next[i], computer)
    return arr
  } else if (prev && typeof prev === 'object') {
    const obj = {}
    for (const key in prev) obj[key] = computeNumericDelta(prev[key], next[key], computer)
    return obj
  } else {
    return next
  }
}

module.exports = computeNumericDelta
