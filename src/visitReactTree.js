var DOT = '.'

function visitReactTree (path, react, visitor) {
  if (Array.isArray(react)) {
    react.forEach(function _each (child, index) {
      visitReactTree(path + DOT + index, child, visitor)
    })
  } else if (typeof react === 'string') {
    visitor(react, null, null, null, path)
  } else if (react && typeof react === 'object') {
    visitor(react, react.type, react.props, react.props && react.props.children, path)
    visitReactTree(path, react.props && react.props.children, visitor)
  }
}

module.exports = visitReactTree
