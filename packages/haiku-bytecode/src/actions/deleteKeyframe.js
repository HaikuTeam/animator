var ensureTimelineProperty = require('./ensureTimelineProperty')
var getSortedKeyframeKeys = require('./getSortedKeyframeKeys')

module.exports = function deleteKeyframe (bytecode, componentId, timelineName, propertyName, keyframeMs) {
  var property = ensureTimelineProperty(bytecode, timelineName, componentId, propertyName)

  var mss = getSortedKeyframeKeys(property)

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

  var curr = list.filter(function _filter (item) {
    return item.start === keyframeMs
  })[0]

  if (!curr) {
    return property
  }

  var prev = list[curr.index - 1]
  var next = list[curr.index + 1]

  // First delete our keyframe
  delete property[keyframeMs]

  // Remove the curve from the previous keyframe if it has no subsequent keyframe to attach to
  if (prev && !next) {
    property[prev.start] = {}
    property[prev.start].value = prev.value
    if (prev.edited) property[prev.start].edited = true
  }
}
