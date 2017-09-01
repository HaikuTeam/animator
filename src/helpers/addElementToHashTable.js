module.exports = function addElementToHashTable (hash, realElement, virtualElement) {
  if (virtualElement && virtualElement.attributes) {
    var flexId = virtualElement.attributes['haiku-id'] || virtualElement.attributes.id
    var scopedId = (virtualElement.__componentScope) ?
        (virtualElement.__componentScope + ':' + flexId) : flexId

    if (!hash[scopedId]) hash[scopedId] = []

    var alreadyInList = false
    for (var i = 0; i < hash[scopedId].length; i++) {
      var elInList = hash[scopedId][i]
      if (elInList === realElement) {
        alreadyInList = true
      }
    }

    if (!alreadyInList) {
      hash[scopedId].push(realElement)
    }
  }
}
