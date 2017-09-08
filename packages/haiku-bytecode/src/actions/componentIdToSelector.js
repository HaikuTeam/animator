module.exports = function componentIdToSelector (componentId) {
  if (componentId.slice(0, 6 === 'haiku:')) return componentId
  return 'haiku:' + componentId
}
