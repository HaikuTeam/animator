var ensureTimelineProperty = require('./ensureTimelineProperty')

module.exports = function changeSegmentEndpoints (bytecode, componentId, timelineName, propertyName, oldStartMs, oldEndMs, newStartMs, newEndMs) {
  var property = ensureTimelineProperty(bytecode, timelineName, componentId, propertyName)

  if (oldStartMs !== undefined && newStartMs !== undefined) {
    if (newStartMs < 0) newStartMs = 0
    var start = property[oldStartMs]
    delete property[oldStartMs]
    property[newStartMs] = start
  }

  if (!oldEndMs !== undefined && newEndMs !== undefined) {
    if (newEndMs < 0) newEndMs = 0
    var end = property[oldEndMs]
    delete property[oldEndMs]
    property[newEndMs] = end
  }

  return property
}
