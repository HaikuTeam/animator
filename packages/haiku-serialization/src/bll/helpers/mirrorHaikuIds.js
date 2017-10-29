const HAIKU_ID_ATTRIBUTE = 'haiku-id'

function _mirrorHaikuUids (fromNode, toNode) {
  if (!toNode.attributes) toNode.attributes = {}
  // Create (or overwrite) a haiku-id matching the existing tree's node
  toNode.attributes[HAIKU_ID_ATTRIBUTE] = fromNode.attributes[HAIKU_ID_ATTRIBUTE]
  if (!fromNode.children || fromNode.children.length < 1) return void (0)
  if (!toNode.children || toNode.children.length < 1) return void (0)
  // Different number of kids indicates structural change; impossible to do a consistent mirror
  if (fromNode.children.length !== toNode.children.length) return void (0)
  for (var i = 0; i < fromNode.children.length; i++) {
    var fromNodeChild = fromNode.children[i]
    var toNodeChild = toNode.children[i]
    // String children don't have attributes
    if (typeof fromNodeChild === 'string') continue
    // Different element name indicates structural change; impossible to do a consistent mirror
    if (fromNodeChild.elementName !== toNodeChild.elementName) continue
    _mirrorHaikuUids(fromNodeChild, toNodeChild) // Recursive
  }
}

module.exports = _mirrorHaikuUids
