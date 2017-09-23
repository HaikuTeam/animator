'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = doesValueImplyExpression;

var _leftTrim = require('./leftTrim');

var _leftTrim2 = _interopRequireDefault(_leftTrim);

var _ExprSigns = require('./ExprSigns');

var EXPR_SIGNS = _interopRequireWildcard(_ExprSigns);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function doesValueImplyExpression(val) {
  val = (0, _leftTrim2.default)(val);
  return val.substring(0, 1) === EXPR_SIGNS.EQ || val.substring(0, 7) === EXPR_SIGNS.RET + ' ';
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2hlbHBlcnMvZG9lc1ZhbHVlSW1wbHlFeHByZXNzaW9uLmpzIl0sIm5hbWVzIjpbImRvZXNWYWx1ZUltcGx5RXhwcmVzc2lvbiIsIkVYUFJfU0lHTlMiLCJ2YWwiLCJzdWJzdHJpbmciLCJFUSIsIlJFVCJdLCJtYXBwaW5ncyI6Ijs7Ozs7a0JBR3dCQSx3Qjs7QUFIeEI7Ozs7QUFDQTs7SUFBWUMsVTs7Ozs7O0FBRUcsU0FBU0Qsd0JBQVQsQ0FBbUNFLEdBQW5DLEVBQXdDO0FBQ3JEQSxRQUFNLHdCQUFTQSxHQUFULENBQU47QUFDQSxTQUNFQSxJQUFJQyxTQUFKLENBQWMsQ0FBZCxFQUFpQixDQUFqQixNQUF3QkYsV0FBV0csRUFBbkMsSUFDQUYsSUFBSUMsU0FBSixDQUFjLENBQWQsRUFBaUIsQ0FBakIsTUFBeUJGLFdBQVdJLEdBQVgsR0FBaUIsR0FGNUM7QUFJRCIsImZpbGUiOiJkb2VzVmFsdWVJbXBseUV4cHJlc3Npb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgbGVmdFRyaW0gZnJvbSAnLi9sZWZ0VHJpbSdcbmltcG9ydCAqIGFzIEVYUFJfU0lHTlMgZnJvbSAnLi9FeHByU2lnbnMnXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGRvZXNWYWx1ZUltcGx5RXhwcmVzc2lvbiAodmFsKSB7XG4gIHZhbCA9IGxlZnRUcmltKHZhbClcbiAgcmV0dXJuIChcbiAgICB2YWwuc3Vic3RyaW5nKDAsIDEpID09PSBFWFBSX1NJR05TLkVRIHx8XG4gICAgdmFsLnN1YnN0cmluZygwLCA3KSA9PT0gKEVYUFJfU0lHTlMuUkVUICsgJyAnKVxuICApXG59XG4iXX0=