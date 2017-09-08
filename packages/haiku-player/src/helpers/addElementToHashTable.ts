module.exports = function addElementToHashTable(hash, realElement, virtualElement) {
  if (virtualElement && virtualElement.attributes) {
    let flexId = virtualElement.attributes["haiku-id"] || virtualElement.attributes.id

    if (!hash[flexId]) hash[flexId] = []

    let alreadyInList = false
    for (let i = 0; i < hash[flexId].length; i++) {
      let elInList = hash[flexId][i]
      if (elInList === realElement) {
        alreadyInList = true
      }
    }

    if (!alreadyInList) {
      hash[flexId].push(realElement)
    }
  }
}
