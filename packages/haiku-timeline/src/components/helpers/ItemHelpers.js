function mod (idx, max) {
  return (idx % max + max) % max
}

function nextPropItem (orig, step) {
  // Wraparound the array so the last item's "next" is the first item, etc.
  let idx = mod(orig._index + step, orig._items.length)

  // If the selfsame index, we're on the same item, so just use that
  if (idx === orig._index) {
    return orig
  }

  let item = orig._items[idx]

  // Only properties are allowed to be used as input fields; skip all else
  if (item.isProperty) {
    return item
  }

  let bump = (step < 0) ? -1 : 1
  return nextPropItem(orig, step + bump)
}

function isItemEqual (a, b) {
  if (!a) return false
  if (!b) return false
  return (
    a.node.attributes['haiku-id'] === b.node.attributes['haiku-id'] &&
    a.node.elementName === b.node.elementName &&
    a.property.name === b.property.name
  )
}

function getItemPropertyId (inputItem) {
  return `property-input-field-box-${getItemComponentId(inputItem)}-${getItemElementName(inputItem)}-${getItemPropertyName(inputItem)}`
}

function getItemComponentId (inputItem) {
  return inputItem.node.attributes['haiku-id']
}

function getItemElementName (inputItem) {
  return (typeof inputItem.node.elementName === 'object') ? 'div' : inputItem.node.elementName
}

function getItemPropertyName (inputItem) {
  return inputItem.property.name
}

module.exports = {
  mod,
  nextPropItem,
  isItemEqual,
  getItemPropertyId,
  getItemComponentId,
  getItemElementName,
  getItemPropertyName
}
