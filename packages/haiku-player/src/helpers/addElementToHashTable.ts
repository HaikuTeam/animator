module.exports = function addElementToHashTable (hash, realElement, virtualElement) {
  if (virtualElement && virtualElement.attributes) {
    var flexId = virtualElement.attributes['haiku-id'] || virtualElement.attributes.id

    if (!hash[flexId]) hash[flexId] = []

    var alreadyInList = false
    for (var i = 0; i < hash[flexId].length; i++) {
      var elInList = hash[flexId][i]
      if (elInList === realElement) {
        alreadyInList = true
      }
    }

    if (!alreadyInList) {
      hash[flexId].push(realElement)
    }
  }
}
