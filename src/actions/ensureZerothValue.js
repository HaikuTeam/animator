var unserValue = require('./unserValue')
var ensureTimelineProperty = require('./ensureTimelineProperty')
var TimelineProperty = require('./../TimelineProperty')

module.exports = function ensureZerothValue (bytecode, componentId, timelineName, elementName, propertyName, hostInstance, inputValues) {
  var property = ensureTimelineProperty(bytecode, timelineName, componentId, propertyName)

  var zerothValue = TimelineProperty.getPropertyValueAtTime(bytecode.timelines, timelineName, componentId, elementName, propertyName, 0, hostInstance, inputValues)

  if (!property[0]) {
    property[0] = {}
  }

  if (property[0].value === undefined || property[0].value === null) {
    property[0].value = unserValue(zerothValue)
  }

  return property
}
