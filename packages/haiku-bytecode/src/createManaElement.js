function createManaElement () {
  var args = []
  for (var i = 0; i < arguments.length; i++) args[i] = arguments[i]

  var elementName = args.shift()
  var attributes = args.shift()
  var children = args

  return {
    elementName: elementName,
    attributes: attributes || {},
    children: children || []
  }
}

module.exports = createManaElement
