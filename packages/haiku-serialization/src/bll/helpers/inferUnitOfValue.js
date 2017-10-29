const UNIT_MAPPING = {
  'translation.x': 'px',
  'translation.y': 'px',
  'translation.z': 'px',
  'rotation.z': 'rad',
  'rotation.y': 'rad',
  'rotation.x': 'rad',
  'scale.x': '',
  'scale.y': '',
  'opacity': '',
  'shown': '',
  'backgroundColor': '',
  'color': '',
  'fill': '',
  'stroke': ''
}

module.exports = function inferUnitOfValue (propertyName) {
  var unit = UNIT_MAPPING[propertyName]
  if (unit) {
    return unit
  }
  return ''
}
