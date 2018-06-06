const UNIT_MAPPING = {
  'translation.x': 'px',
  'translation.y': 'px',
  'translation.z': 'px',
  'rotation.z': 'rad',
  'rotation.y': 'rad',
  'rotation.x': 'rad',
  'scale.x': '',
  'scale.y': '',
  opacity: '',
  shown: '',
  backgroundColor: '',
  color: '',
  fill: '',
  stroke: '',
};

export default function inferUnitOfValue (propertyName: string) {
  const unit = UNIT_MAPPING[propertyName];
  if (unit) {
    return unit;
  }
  return '';
}
