function children2haiku (children) {
  if (Array.isArray(children)) {
    return children.map(react2haiku)
  }

  if (!children) {
    return []
  }

  return [react2haiku(children)]
}

function react2haiku (reactInstance) {
  if (typeof reactInstance.type === 'function') {
    const renderOutput = reactInstance.type(reactInstance.props)
    return react2haiku(renderOutput)
  }

  return {
    elementName: reactInstance.type,
    attributes: Object.assign({}, reactInstance.props, {children: null}),
    // FIXME: we are only contemplating the case of elements with a single
    // children node, for more info on what we can do, see
    // https://github.com/HaikuTeam/mono/pull/89#discussion_r154820186
    children: children2haiku(reactInstance.props.children)
  }
}

module.exports = react2haiku
