const getControlAttributes = require('haiku-bytecode/src/getControlAttributes')
const insertAttributesIntoTimelineGroup = require('haiku-bytecode/src/insertAttributesIntoTimelineGroup')
const _buildHaikuIdSelector = require('./buildHaikuIdSelector')

module.exports = function _hoistNodeAttributes (manaNode, haikuId, timelineObj, timelineName, timelineTime, mergeStrategy) {
  var controlAttributes = getControlAttributes(manaNode.attributes)

  // TODO: Use this to populate any default attributes we want to be written into
  // the file explicitly
  var defaultAttributes = {}

  // Don't create any empty groups
  if (Object.keys(defaultAttributes).length > 0 || Object.keys(controlAttributes).length > 0) {
    var haikuIdSelector = _buildHaikuIdSelector(haikuId)
    if (!timelineObj[haikuIdSelector]) timelineObj[haikuIdSelector] = {}
    var timelineGroup = timelineObj[haikuIdSelector]

    insertAttributesIntoTimelineGroup(timelineGroup, timelineTime, defaultAttributes, mergeStrategy)
    insertAttributesIntoTimelineGroup(timelineGroup, timelineTime, controlAttributes, mergeStrategy)
  }

  // Clear off attributes that have been 'hoisted' into the control objects
  for (var attrKey in manaNode.attributes) {
    if (attrKey in controlAttributes) delete manaNode.attributes[attrKey]
  }
}
