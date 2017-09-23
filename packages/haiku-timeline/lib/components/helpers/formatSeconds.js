'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = formatSeconds;

var _numeral = require('numeral');

var _numeral2 = _interopRequireDefault(_numeral);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function formatSeconds(seconds) {
  return (0, _numeral2.default)(seconds).format('0[.]0[0]');
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2hlbHBlcnMvZm9ybWF0U2Vjb25kcy5qcyJdLCJuYW1lcyI6WyJmb3JtYXRTZWNvbmRzIiwic2Vjb25kcyIsImZvcm1hdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7a0JBRXdCQSxhOztBQUZ4Qjs7Ozs7O0FBRWUsU0FBU0EsYUFBVCxDQUF3QkMsT0FBeEIsRUFBaUM7QUFDOUMsU0FBTyx1QkFBUUEsT0FBUixFQUFpQkMsTUFBakIsQ0FBd0IsVUFBeEIsQ0FBUDtBQUNEIiwiZmlsZSI6ImZvcm1hdFNlY29uZHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgbnVtZXJhbCBmcm9tICdudW1lcmFsJ1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBmb3JtYXRTZWNvbmRzIChzZWNvbmRzKSB7XG4gIHJldHVybiBudW1lcmFsKHNlY29uZHMpLmZvcm1hdCgnMFsuXTBbMF0nKVxufVxuIl19