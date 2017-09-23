'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = humanizePropertyName;

var _decamelize = require('decamelize');

var _decamelize2 = _interopRequireDefault(_decamelize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var HUMANIZED_PROP_NAMES = {
  'rotation.z': 'Rotation Z', // Change me if we enable other types of rotation again
  'rotation.y': 'Rotation Y',
  'rotation.x': 'Rotation X',
  'translation.x': 'Position X',
  'translation.y': 'Position Y',
  'translation.z': 'Position Z',
  'sizeAbsolute.x': 'Size X',
  'sizeAbsolute.y': 'Size Y',
  'style.overflowX': 'Overflow X',
  'style.overflowY': 'Overflow Y'
};

function humanizePropertyName(propertyName) {
  if (HUMANIZED_PROP_NAMES[propertyName]) return HUMANIZED_PROP_NAMES[propertyName];
  return (0, _decamelize2.default)(propertyName).replace(/[\W_]/g, ' ');
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2hlbHBlcnMvaHVtYW5pemVQcm9wZXJ0eU5hbWUuanMiXSwibmFtZXMiOlsiaHVtYW5pemVQcm9wZXJ0eU5hbWUiLCJIVU1BTklaRURfUFJPUF9OQU1FUyIsInByb3BlcnR5TmFtZSIsInJlcGxhY2UiXSwibWFwcGluZ3MiOiI7Ozs7O2tCQWV3QkEsb0I7O0FBZnhCOzs7Ozs7QUFFQSxJQUFNQyx1QkFBdUI7QUFDM0IsZ0JBQWMsWUFEYSxFQUNDO0FBQzVCLGdCQUFjLFlBRmE7QUFHM0IsZ0JBQWMsWUFIYTtBQUkzQixtQkFBaUIsWUFKVTtBQUszQixtQkFBaUIsWUFMVTtBQU0zQixtQkFBaUIsWUFOVTtBQU8zQixvQkFBa0IsUUFQUztBQVEzQixvQkFBa0IsUUFSUztBQVMzQixxQkFBbUIsWUFUUTtBQVUzQixxQkFBbUI7QUFWUSxDQUE3Qjs7QUFhZSxTQUFTRCxvQkFBVCxDQUErQkUsWUFBL0IsRUFBNkM7QUFDMUQsTUFBSUQscUJBQXFCQyxZQUFyQixDQUFKLEVBQXdDLE9BQU9ELHFCQUFxQkMsWUFBckIsQ0FBUDtBQUN4QyxTQUFPLDBCQUFXQSxZQUFYLEVBQXlCQyxPQUF6QixDQUFpQyxRQUFqQyxFQUEyQyxHQUEzQyxDQUFQO0FBQ0QiLCJmaWxlIjoiaHVtYW5pemVQcm9wZXJ0eU5hbWUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZGVjYW1lbGl6ZSBmcm9tICdkZWNhbWVsaXplJ1xuXG5jb25zdCBIVU1BTklaRURfUFJPUF9OQU1FUyA9IHtcbiAgJ3JvdGF0aW9uLnonOiAnUm90YXRpb24gWicsIC8vIENoYW5nZSBtZSBpZiB3ZSBlbmFibGUgb3RoZXIgdHlwZXMgb2Ygcm90YXRpb24gYWdhaW5cbiAgJ3JvdGF0aW9uLnknOiAnUm90YXRpb24gWScsXG4gICdyb3RhdGlvbi54JzogJ1JvdGF0aW9uIFgnLFxuICAndHJhbnNsYXRpb24ueCc6ICdQb3NpdGlvbiBYJyxcbiAgJ3RyYW5zbGF0aW9uLnknOiAnUG9zaXRpb24gWScsXG4gICd0cmFuc2xhdGlvbi56JzogJ1Bvc2l0aW9uIFonLFxuICAnc2l6ZUFic29sdXRlLngnOiAnU2l6ZSBYJyxcbiAgJ3NpemVBYnNvbHV0ZS55JzogJ1NpemUgWScsXG4gICdzdHlsZS5vdmVyZmxvd1gnOiAnT3ZlcmZsb3cgWCcsXG4gICdzdHlsZS5vdmVyZmxvd1knOiAnT3ZlcmZsb3cgWSdcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gaHVtYW5pemVQcm9wZXJ0eU5hbWUgKHByb3BlcnR5TmFtZSkge1xuICBpZiAoSFVNQU5JWkVEX1BST1BfTkFNRVNbcHJvcGVydHlOYW1lXSkgcmV0dXJuIEhVTUFOSVpFRF9QUk9QX05BTUVTW3Byb3BlcnR5TmFtZV1cbiAgcmV0dXJuIGRlY2FtZWxpemUocHJvcGVydHlOYW1lKS5yZXBsYWNlKC9bXFxXX10vZywgJyAnKVxufVxuIl19