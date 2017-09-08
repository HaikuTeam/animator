function patternPropertyNodeValueToValue (node) {
  if (node.type === 'Identifier') {
    // { a } => { a: 'a' }
    return node.name
  }

  if (node.type === 'ObjectPattern') {
    return objectPatternNodeToObject({}, node)
  }

  if (node.type === 'ArrayPattern') {
    var arr = []

    for (var i = 0; i < node.elements.length; i++) {
      arr[i] = patternPropertyNodeValueToValue(node.elements[i])
    }

    return arr
  }
}

function objectPatternNodeToObject (out, node) {
  for (var i = 0; i < node.properties.length; i++) {
    var prop = node.properties[i]

    var key = prop.key.name

    var value = patternPropertyNodeValueToValue(prop.value)

    out[key] = value
  }

  return out
}

module.exports = objectPatternNodeToObject
