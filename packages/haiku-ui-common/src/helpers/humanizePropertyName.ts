import * as decamelize from 'decamelize';

const HUMANIZED_PROP_NAMES = {
  'rotation.z': 'Rotation Z', // Change me if we enable other types of rotation again
  'rotation.y': 'Rotation Y',
  'rotation.x': 'Rotation X',
  'translation.x': 'Position X',
  'translation.y': 'Position Y',
  'translation.z': 'Position Z',
  'sizeAbsolute.x': 'Size X',
  'sizeAbsolute.y': 'Size Y',
};

export default function humanizePropertyName (propertyName: string) {
  if (HUMANIZED_PROP_NAMES[propertyName]) {
    return HUMANIZED_PROP_NAMES[propertyName];
  }
  return decamelize(propertyName).replace(/[\W_]/g, ' ');
}
