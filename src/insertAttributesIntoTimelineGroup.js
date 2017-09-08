var mergeAppliedValue = require('./mergeAppliedValue')

var GROUP_DELIMITER = '.'

function insertAttributesIntoTimelineGroup (timelineGroup, timelineTime, givenAttributes, mergeStrategy) {
  for (var attributeName in givenAttributes) {
    var attributeValue = givenAttributes[attributeName]
    if (attributeValue && typeof attributeValue === 'object') {
      for (var subKey in attributeValue) {
        var subVal = attributeValue[subKey]
        var fullName = attributeName + GROUP_DELIMITER + subKey
        mergeOne(timelineGroup, fullName, subVal, timelineTime, mergeStrategy)
      }
    } else {
      mergeOne(timelineGroup, attributeName, attributeValue, timelineTime, mergeStrategy)
    }
  }
}

function mergeOne (timelineGroup, attributeName, attributeValue, timelineTime, mergeStrategy) {
  if (!timelineGroup[attributeName]) timelineGroup[attributeName] = {}
  if (!timelineGroup[attributeName][timelineTime]) timelineGroup[attributeName][timelineTime] = {}
  mergeAppliedValue(attributeName, timelineGroup[attributeName][timelineTime], attributeValue, mergeStrategy)
}

module.exports = insertAttributesIntoTimelineGroup
