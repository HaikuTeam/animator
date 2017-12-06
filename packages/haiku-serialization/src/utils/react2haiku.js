module.exports = function react2haiku (reactInstance) {
  const children = reactInstance.props.children

  return {
    elementName: reactInstance.type,
    attributes: Object.assign({}, reactInstance.props, {children: null}),
    // FIXME: we are only contemplating the case of elements with a single
    // children node, for more info on what we can do, see
    // https://github.com/HaikuTeam/mono/pull/89#discussion_r154820186
    children: children ? [react2haiku(reactInstance.props.children)] : []
  }
}
