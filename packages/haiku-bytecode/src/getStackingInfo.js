const getPropertyValue = require('./getPropertyValue')
const HAIKU_ID_ATTRIBUTE = 'haiku-id'

module.exports = function getStackingInfo (
  bytecode,
  staticTemplateManaNode,
  timelineName,
  timelineTime
) {
  const haikuIdsToZIndices = {}

  const zIndicesToHaikuIds = {}

  for (let i = staticTemplateManaNode.children.length - 1; i >= 0; i--) {
    const child = staticTemplateManaNode.children[i]

    if (!child || typeof child === 'string') {
      continue
    }

    const haikuId = child.attributes[HAIKU_ID_ATTRIBUTE]

    const explicitZ = getPropertyValue(
      bytecode,
      haikuId,
      timelineName,
      timelineTime,
      'style.zIndex'
    )

    // NaN would cause an endless loop, so fallback to 0
    const foundZ = parseInt(explicitZ || (i + 1), 10) || 0
    const finalZ = _uniqueZ(foundZ, zIndicesToHaikuIds)

    haikuIdsToZIndices[haikuId] = finalZ
    zIndicesToHaikuIds[finalZ] = haikuId
  }

  const listOfZs = []

  for (const haikuId2 in haikuIdsToZIndices) {
    const zIndex = haikuIdsToZIndices[haikuId2]
    listOfZs.push(zIndex)
  }

  listOfZs.sort((a, b) => {
    return a - b
  })

  const zinfo = listOfZs.map((zIndex) => {
    return {
      zIndex: zIndex,
      haikuId: zIndicesToHaikuIds[zIndex]
    }
  })

  return zinfo
}

function _uniqueZ (z, mapping) {
  if (mapping[z]) return _uniqueZ(z + 1, mapping)
  return z
}
