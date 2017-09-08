var SELECTOR_ATTRIBUTES = {
  'id': 'id',
  'class': 'class',
  'className': 'class',
  'name': 'name',
  'type': 'type'
}

function getSelectorAttributes (attributes) {
  var out = {}
  for (var name in SELECTOR_ATTRIBUTES) {
    var destination = SELECTOR_ATTRIBUTES[name]
    if (attributes[name]) out[destination] = attributes[name]
  }
  return out
}

getSelectorAttributes.SELECTOR_ATTRIBUTES = SELECTOR_ATTRIBUTES

module.exports = getSelectorAttributes
