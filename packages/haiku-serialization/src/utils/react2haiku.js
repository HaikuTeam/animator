module.exports = function react2haiku (reactInstance) {
  const children = reactInstance.props.children

  return {
    elementName: reactInstance.type,
    attributes: Object.assign({}, reactInstance.props, {children: null}),
    children: children ? [react2haiku(reactInstance.props.children)] : []
  }
}
