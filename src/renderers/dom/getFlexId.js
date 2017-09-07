var HAIKU_ID_ATTRIBUTE = 'haiku-id'
var ID_ATTRIBUTE = 'id'

module.exports = function getFlexId (element) {
  if (!element) return null
  if (!element.attributes) return null
  return element.attributes[HAIKU_ID_ATTRIBUTE] || element.attributes[ID_ATTRIBUTE]
}
