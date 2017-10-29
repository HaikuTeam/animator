const _getAllElementsByHaikuId = require('./getAllElementsByHaikuId')
const _hoistNodeAttributes = require('./hoistNodeAttributes')

/**
 * @function _hoistTreeAttributes
 * @description Given a mana tree, move all of its control attributes (that is, things that affect its
 * behavior that the user can control) into a timeline object.
 */
module.exports = function _hoistTreeAttributes (mana, timelineName, timelineTime) {
  var elementsByHaikuId = _getAllElementsByHaikuId(mana)
  var timelineStructure = {}

  // We set this on the 'Default' timeline always because an element's properties
  // are interpreted to mean whatever the defaults are supposed to be at time 0.
  timelineStructure[timelineName] = {}
  var theTimelineObj = timelineStructure[timelineName]

  for (let haikuId in elementsByHaikuId) {
    let node = elementsByHaikuId[haikuId]
    _hoistNodeAttributes(node, haikuId, theTimelineObj, timelineName, timelineTime, 'assign')
  }

  return timelineStructure
}
