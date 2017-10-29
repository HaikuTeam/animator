const visitManaTree = require('@haiku/player/lib/helpers/visitManaTree').default
const _isHaikuIdSelector = require('./isHaikuIdSelector')
const _haikuSelectorToHaikuId = require('./haikuSelectorToHaikuId')

const HAIKU_ID_ATTRIBUTE = 'haiku-id'
const ROOT_LOCATOR = '0'

module.exports = function _cleanBytecodeAndTemplate (bytecode, mana) {
  const elementsByHaikuId = {}

  visitManaTree(ROOT_LOCATOR, mana, function (elementName, attributes, children, node) {
    if (attributes && attributes[HAIKU_ID_ATTRIBUTE]) {
      elementsByHaikuId[attributes[HAIKU_ID_ATTRIBUTE]] = node
    }

    // Clean these in-memory only properties that get added (don't want to write these to the file)
    delete node.__depth
    delete node.__index
  })

  for (var timelineName in bytecode.timelines) {
    var timelineObject = bytecode.timelines[timelineName]
    for (var timelineSelector in timelineObject) {
      if (_isHaikuIdSelector(timelineSelector)) {
        let hid = _haikuSelectorToHaikuId(timelineSelector)
        if (!elementsByHaikuId[hid]) delete timelineObject[timelineSelector]
      }
    }
  }

  if (bytecode.eventHandlers) {
    for (var eventSelector in bytecode.eventHandlers) {
      if (_isHaikuIdSelector(eventSelector)) {
        let hid = _haikuSelectorToHaikuId(eventSelector)
        if (!elementsByHaikuId[hid]) {
          delete bytecode.eventHandlers[eventSelector]
        }
      }
    }
  }
}
