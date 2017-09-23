'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = eqToRet;

var _leftTrim = require('./leftTrim');

var _leftTrim2 = _interopRequireDefault(_leftTrim);

var _ExprSigns = require('./ExprSigns');

var EXPR_SIGNS = _interopRequireWildcard(_ExprSigns);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function eqToRet(str) {
  if ((0, _leftTrim2.default)(str).substring(0, 1) === EXPR_SIGNS.EQ) {
    str = (0, _leftTrim2.default)(str); // Avoid creating "=    foobar"
    str = str.slice(1);
    str = (0, _leftTrim2.default)(str); // Avoid creating "=    foobar"
    str = EXPR_SIGNS.RET + ' ' + str;
  }
  return str;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2hlbHBlcnMvZXFUb1JldC5qcyJdLCJuYW1lcyI6WyJlcVRvUmV0IiwiRVhQUl9TSUdOUyIsInN0ciIsInN1YnN0cmluZyIsIkVRIiwic2xpY2UiLCJSRVQiXSwibWFwcGluZ3MiOiI7Ozs7O2tCQUd3QkEsTzs7QUFIeEI7Ozs7QUFDQTs7SUFBWUMsVTs7Ozs7O0FBRUcsU0FBU0QsT0FBVCxDQUFrQkUsR0FBbEIsRUFBdUI7QUFDcEMsTUFBSSx3QkFBU0EsR0FBVCxFQUFjQyxTQUFkLENBQXdCLENBQXhCLEVBQTJCLENBQTNCLE1BQWtDRixXQUFXRyxFQUFqRCxFQUFxRDtBQUNuREYsVUFBTSx3QkFBU0EsR0FBVCxDQUFOLENBRG1ELENBQy9CO0FBQ3BCQSxVQUFNQSxJQUFJRyxLQUFKLENBQVUsQ0FBVixDQUFOO0FBQ0FILFVBQU0sd0JBQVNBLEdBQVQsQ0FBTixDQUhtRCxDQUcvQjtBQUNwQkEsVUFBT0QsV0FBV0ssR0FBWCxHQUFpQixHQUFsQixHQUF5QkosR0FBL0I7QUFDRDtBQUNELFNBQU9BLEdBQVA7QUFDRCIsImZpbGUiOiJlcVRvUmV0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGxlZnRUcmltIGZyb20gJy4vbGVmdFRyaW0nXG5pbXBvcnQgKiBhcyBFWFBSX1NJR05TIGZyb20gJy4vRXhwclNpZ25zJ1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBlcVRvUmV0IChzdHIpIHtcbiAgaWYgKGxlZnRUcmltKHN0cikuc3Vic3RyaW5nKDAsIDEpID09PSBFWFBSX1NJR05TLkVRKSB7XG4gICAgc3RyID0gbGVmdFRyaW0oc3RyKSAvLyBBdm9pZCBjcmVhdGluZyBcIj0gICAgZm9vYmFyXCJcbiAgICBzdHIgPSBzdHIuc2xpY2UoMSlcbiAgICBzdHIgPSBsZWZ0VHJpbShzdHIpIC8vIEF2b2lkIGNyZWF0aW5nIFwiPSAgICBmb29iYXJcIlxuICAgIHN0ciA9IChFWFBSX1NJR05TLlJFVCArICcgJykgKyBzdHJcbiAgfVxuICByZXR1cm4gc3RyXG59XG4iXX0=