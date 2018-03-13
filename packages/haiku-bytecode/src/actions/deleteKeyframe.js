const ensureTimelineProperty = require('./ensureTimelineProperty')
const getSortedKeyframeKeys = require('./getSortedKeyframeKeys')

module.exports = function deleteKeyframe (bytecode, componentId, timelineName, propertyName, keyframeMs) {
  const property = ensureTimelineProperty(bytecode, timelineName, componentId, propertyName)

  const mss = getSortedKeyframeKeys(property)

  let list = mss.map((ms, i) => {
    let prev = mss[i - 1]
    let next = mss[i + 1]
    return {
      edited: property[ms].edited,
      curve: property[ms].curve,
      value: property[ms].value,
      index: i,
      start: ms,
      end: (next !== undefined) ? next : ms,
      first: prev === undefined,
      last: next === undefined
    }
  })

  const curr = list.filter(function _filter (item) {
    return item.start === keyframeMs
  })[0]

  if (!curr) {
    return property
  }

  const prev = list[curr.index - 1]
  const next = list[curr.index + 1]

  // First delete our keyframe
  delete property[keyframeMs]

  // Remove the curve from the previous keyframe if it has no subsequent keyframe to attach to
  if (prev && !next) {
    property[prev.start] = {}
    property[prev.start].value = prev.value
    if (prev.edited) property[prev.start].edited = true
  }
}
