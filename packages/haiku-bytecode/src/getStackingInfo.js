var getPropertyValue = require('./getPropertyValue')
var HAIKU_ID_ATTRIBUTE = 'haiku-id'

module.exports = function getStackingInfo (bytecode, mana, timelineName, timelineTime) {
  var haikuIdsToZIndices = {}

  var zIndicesToHaikuIds = {}

  for (var i = 0; i < mana.children.length; i++) {
    var child = mana.children[i]
    if (!child || typeof child === 'string') continue
    var haikuId = child.attributes[HAIKU_ID_ATTRIBUTE]
    var explicitZ = getPropertyValue(bytecode, haikuId, timelineName, timelineTime, 'style.zIndex')
    var foundZ = parseInt(explicitZ || (i + 1), 10)
    var finalZ = _uniqueZ(foundZ, zIndicesToHaikuIds)
    haikuIdsToZIndices[haikuId] = finalZ
    zIndicesToHaikuIds[finalZ] = haikuId
  }

  var listOfZs = []

  for (var haikuId2 in haikuIdsToZIndices) {
    var zIndex = haikuIdsToZIndices[haikuId2]
    listOfZs.push(zIndex)
  }

  listOfZs.sort(function _sort (a, b) { return a - b })

  var zinfo = listOfZs.map(function _map (zIndex) {
    return { zIndex: zIndex, haikuId: zIndicesToHaikuIds[zIndex] }
  })

  return zinfo
}

function _uniqueZ (z, mapping) {
  if (mapping[z]) return _uniqueZ(z + 1, mapping)
  return z
}
