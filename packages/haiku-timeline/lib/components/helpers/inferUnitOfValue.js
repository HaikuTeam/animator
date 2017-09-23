'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = inferUnitOfValue;
var UNIT_MAPPING = {
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
};

function inferUnitOfValue(propertyName) {
  var unit = UNIT_MAPPING[propertyName];
  if (unit) {
    return unit;
  }
  return '';
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2hlbHBlcnMvaW5mZXJVbml0T2ZWYWx1ZS5qcyJdLCJuYW1lcyI6WyJpbmZlclVuaXRPZlZhbHVlIiwiVU5JVF9NQVBQSU5HIiwicHJvcGVydHlOYW1lIiwidW5pdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7a0JBaUJ3QkEsZ0I7QUFqQnhCLElBQU1DLGVBQWU7QUFDbkIsbUJBQWlCLElBREU7QUFFbkIsbUJBQWlCLElBRkU7QUFHbkIsbUJBQWlCLElBSEU7QUFJbkIsZ0JBQWMsS0FKSztBQUtuQixnQkFBYyxLQUxLO0FBTW5CLGdCQUFjLEtBTks7QUFPbkIsYUFBVyxFQVBRO0FBUW5CLGFBQVcsRUFSUTtBQVNuQixhQUFXLEVBVFE7QUFVbkIsV0FBUyxFQVZVO0FBV25CLHFCQUFtQixFQVhBO0FBWW5CLFdBQVMsRUFaVTtBQWFuQixVQUFRLEVBYlc7QUFjbkIsWUFBVTtBQWRTLENBQXJCOztBQWlCZSxTQUFTRCxnQkFBVCxDQUEyQkUsWUFBM0IsRUFBeUM7QUFDdEQsTUFBSUMsT0FBT0YsYUFBYUMsWUFBYixDQUFYO0FBQ0EsTUFBSUMsSUFBSixFQUFVO0FBQ1IsV0FBT0EsSUFBUDtBQUNEO0FBQ0QsU0FBTyxFQUFQO0FBQ0QiLCJmaWxlIjoiaW5mZXJVbml0T2ZWYWx1ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IFVOSVRfTUFQUElORyA9IHtcbiAgJ3RyYW5zbGF0aW9uLngnOiAncHgnLFxuICAndHJhbnNsYXRpb24ueSc6ICdweCcsXG4gICd0cmFuc2xhdGlvbi56JzogJ3B4JyxcbiAgJ3JvdGF0aW9uLnonOiAncmFkJyxcbiAgJ3JvdGF0aW9uLnknOiAncmFkJyxcbiAgJ3JvdGF0aW9uLngnOiAncmFkJyxcbiAgJ3NjYWxlLngnOiAnJyxcbiAgJ3NjYWxlLnknOiAnJyxcbiAgJ29wYWNpdHknOiAnJyxcbiAgJ3Nob3duJzogJycsXG4gICdiYWNrZ3JvdW5kQ29sb3InOiAnJyxcbiAgJ2NvbG9yJzogJycsXG4gICdmaWxsJzogJycsXG4gICdzdHJva2UnOiAnJ1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBpbmZlclVuaXRPZlZhbHVlIChwcm9wZXJ0eU5hbWUpIHtcbiAgdmFyIHVuaXQgPSBVTklUX01BUFBJTkdbcHJvcGVydHlOYW1lXVxuICBpZiAodW5pdCkge1xuICAgIHJldHVybiB1bml0XG4gIH1cbiAgcmV0dXJuICcnXG59XG4iXX0=