'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = retToEq;

var _ExprSigns = require('./ExprSigns');

var EXPR_SIGNS = _interopRequireWildcard(_ExprSigns);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function retToEq(str) {
  if (str.substring(0, 7) === EXPR_SIGNS.RET + ' ') {
    str = str.slice(7);
    str = EXPR_SIGNS.EQ + ' ' + str;
  }
  return str;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2hlbHBlcnMvcmV0VG9FcS5qcyJdLCJuYW1lcyI6WyJyZXRUb0VxIiwiRVhQUl9TSUdOUyIsInN0ciIsInN1YnN0cmluZyIsIlJFVCIsInNsaWNlIiwiRVEiXSwibWFwcGluZ3MiOiI7Ozs7O2tCQUV3QkEsTzs7QUFGeEI7O0lBQVlDLFU7Ozs7QUFFRyxTQUFTRCxPQUFULENBQWtCRSxHQUFsQixFQUF1QjtBQUNwQyxNQUFJQSxJQUFJQyxTQUFKLENBQWMsQ0FBZCxFQUFpQixDQUFqQixNQUF5QkYsV0FBV0csR0FBWCxHQUFpQixHQUE5QyxFQUFvRDtBQUNsREYsVUFBTUEsSUFBSUcsS0FBSixDQUFVLENBQVYsQ0FBTjtBQUNBSCxVQUFPRCxXQUFXSyxFQUFYLEdBQWdCLEdBQWpCLEdBQXdCSixHQUE5QjtBQUNEO0FBQ0QsU0FBT0EsR0FBUDtBQUNEIiwiZmlsZSI6InJldFRvRXEuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBFWFBSX1NJR05TIGZyb20gJy4vRXhwclNpZ25zJ1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiByZXRUb0VxIChzdHIpIHtcbiAgaWYgKHN0ci5zdWJzdHJpbmcoMCwgNykgPT09IChFWFBSX1NJR05TLlJFVCArICcgJykpIHtcbiAgICBzdHIgPSBzdHIuc2xpY2UoNylcbiAgICBzdHIgPSAoRVhQUl9TSUdOUy5FUSArICcgJykgKyBzdHJcbiAgfVxuICByZXR1cm4gc3RyXG59XG4iXX0=