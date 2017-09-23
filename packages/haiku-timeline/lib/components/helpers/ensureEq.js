'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ensureEq;

var _retToEq = require('./retToEq');

var _retToEq2 = _interopRequireDefault(_retToEq);

var _ExprSigns = require('./ExprSigns');

var EXPR_SIGNS = _interopRequireWildcard(_ExprSigns);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ensureEq(str) {
  str = (0, _retToEq2.default)(str);
  if (str.slice(0, 1) !== EXPR_SIGNS.EQ) {
    str = EXPR_SIGNS.EQ + str;
  }
  return str;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2hlbHBlcnMvZW5zdXJlRXEuanMiXSwibmFtZXMiOlsiZW5zdXJlRXEiLCJFWFBSX1NJR05TIiwic3RyIiwic2xpY2UiLCJFUSJdLCJtYXBwaW5ncyI6Ijs7Ozs7a0JBR3dCQSxROztBQUh4Qjs7OztBQUNBOztJQUFZQyxVOzs7Ozs7QUFFRyxTQUFTRCxRQUFULENBQW1CRSxHQUFuQixFQUF3QjtBQUNyQ0EsUUFBTSx1QkFBUUEsR0FBUixDQUFOO0FBQ0EsTUFBSUEsSUFBSUMsS0FBSixDQUFVLENBQVYsRUFBYSxDQUFiLE1BQW9CRixXQUFXRyxFQUFuQyxFQUF1QztBQUNyQ0YsVUFBTUQsV0FBV0csRUFBWCxHQUFnQkYsR0FBdEI7QUFDRDtBQUNELFNBQU9BLEdBQVA7QUFDRCIsImZpbGUiOiJlbnN1cmVFcS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCByZXRUb0VxIGZyb20gJy4vcmV0VG9FcSdcbmltcG9ydCAqIGFzIEVYUFJfU0lHTlMgZnJvbSAnLi9FeHByU2lnbnMnXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGVuc3VyZUVxIChzdHIpIHtcbiAgc3RyID0gcmV0VG9FcShzdHIpXG4gIGlmIChzdHIuc2xpY2UoMCwgMSkgIT09IEVYUFJfU0lHTlMuRVEpIHtcbiAgICBzdHIgPSBFWFBSX1NJR05TLkVRICsgc3RyXG4gIH1cbiAgcmV0dXJuIHN0clxufVxuIl19