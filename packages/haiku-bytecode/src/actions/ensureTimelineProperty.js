const ensureTimelineGroup = require('./ensureTimelineGroup')

module.exports = function ensureTimelineProperty (bytecode, timelineName, componentId, propertyName) {
  const group = ensureTimelineGroup(bytecode, timelineName, componentId)

  if (!group[propertyName]) {
    group[propertyName] = {}
  }

  return group[propertyName]
}
