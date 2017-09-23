'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ensureRet;

var _eqToRet = require('./eqToRet');

var _eqToRet2 = _interopRequireDefault(_eqToRet);

var _ExprSigns = require('./ExprSigns');

var EXPR_SIGNS = _interopRequireWildcard(_ExprSigns);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ensureRet(str) {
  str = (0, _eqToRet2.default)(str);
  if (str.slice(0, 6) !== EXPR_SIGNS.RET) {
    str = EXPR_SIGNS.RET + ' ' + str;
  }
  return str;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2hlbHBlcnMvZW5zdXJlUmV0LmpzIl0sIm5hbWVzIjpbImVuc3VyZVJldCIsIkVYUFJfU0lHTlMiLCJzdHIiLCJzbGljZSIsIlJFVCJdLCJtYXBwaW5ncyI6Ijs7Ozs7a0JBR3dCQSxTOztBQUh4Qjs7OztBQUNBOztJQUFZQyxVOzs7Ozs7QUFFRyxTQUFTRCxTQUFULENBQW9CRSxHQUFwQixFQUF5QjtBQUN0Q0EsUUFBTSx1QkFBUUEsR0FBUixDQUFOO0FBQ0EsTUFBSUEsSUFBSUMsS0FBSixDQUFVLENBQVYsRUFBYSxDQUFiLE1BQW9CRixXQUFXRyxHQUFuQyxFQUF3QztBQUN0Q0YsVUFBT0QsV0FBV0csR0FBWCxHQUFpQixHQUFsQixHQUF5QkYsR0FBL0I7QUFDRDtBQUNELFNBQU9BLEdBQVA7QUFDRCIsImZpbGUiOiJlbnN1cmVSZXQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZXFUb1JldCBmcm9tICcuL2VxVG9SZXQnXG5pbXBvcnQgKiBhcyBFWFBSX1NJR05TIGZyb20gJy4vRXhwclNpZ25zJ1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBlbnN1cmVSZXQgKHN0cikge1xuICBzdHIgPSBlcVRvUmV0KHN0cilcbiAgaWYgKHN0ci5zbGljZSgwLCA2KSAhPT0gRVhQUl9TSUdOUy5SRVQpIHtcbiAgICBzdHIgPSAoRVhQUl9TSUdOUy5SRVQgKyAnICcpICsgc3RyXG4gIH1cbiAgcmV0dXJuIHN0clxufVxuIl19