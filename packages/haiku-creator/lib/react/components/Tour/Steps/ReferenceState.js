'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _jsxFileName = 'src/react/components/Tour/Steps/ReferenceState.js';

exports.default = function (_ref) {
  var styles = _ref.styles;

  return _react2.default.createElement(
    'div',
    {
      __source: {
        fileName: _jsxFileName,
        lineNumber: 5
      },
      __self: this
    },
    _react2.default.createElement(
      'h2',
      { style: styles.heading, __source: {
          fileName: _jsxFileName,
          lineNumber: 6
        },
        __self: this
      },
      'Expressions (Advanced)'
    ),
    _react2.default.createElement(
      'div',
      { style: styles.text, __source: {
          fileName: _jsxFileName,
          lineNumber: 7
        },
        __self: this
      },
      _react2.default.createElement(
        'p',
        {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 8
          },
          __self: this
        },
        'Think of Expressions as \u201CExcel Formulas.\u201D  They\'re the easiest way to put any of your States to use.'
      ),
      _react2.default.createElement(
        'p',
        {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 10
          },
          __self: this
        },
        'Any property on the timeline can be an Expression instead of a plain old number.  In fact, you can set different Expressions and numbers at different keyframes, then animate between them!'
      ),
      _react2.default.createElement(
        'p',
        {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 12
          },
          __self: this
        },
        'This is an advanced feature, so we invite you to check it out later\u2014but all you have to do is start your value with an \'=\' sign, and Haiku will know you\'re writing an Expression.  For example:'
      ),
      _react2.default.createElement(
        'pre',
        { style: styles.code, __source: {
            fileName: _jsxFileName,
            lineNumber: 14
          },
          __self: this
        },
        _react2.default.createElement(
          'code',
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 15
            },
            __self: this
          },
          '= myState * 2'
        )
      )
    )
  );
};

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9yZWFjdC9jb21wb25lbnRzL1RvdXIvU3RlcHMvUmVmZXJlbmNlU3RhdGUuanMiXSwibmFtZXMiOlsic3R5bGVzIiwiaGVhZGluZyIsInRleHQiLCJjb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O2tCQUVlLGdCQUFzQjtBQUFBLE1BQVZBLE1BQVUsUUFBVkEsTUFBVTs7QUFDbkMsU0FDRTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDRTtBQUFBO0FBQUEsUUFBSSxPQUFPQSxPQUFPQyxPQUFsQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEtBREY7QUFFRTtBQUFBO0FBQUEsUUFBSyxPQUFPRCxPQUFPRSxJQUFuQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDRTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLE9BREY7QUFHRTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLE9BSEY7QUFLRTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLE9BTEY7QUFPRTtBQUFBO0FBQUEsVUFBSyxPQUFPRixPQUFPRyxJQUFuQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDRTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBREY7QUFQRjtBQUZGLEdBREY7QUFnQkQsQzs7QUFuQkQiLCJmaWxlIjoiUmVmZXJlbmNlU3RhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uICh7IHN0eWxlcyB9KSB7XG4gIHJldHVybiAoXG4gICAgPGRpdj5cbiAgICAgIDxoMiBzdHlsZT17c3R5bGVzLmhlYWRpbmd9PkV4cHJlc3Npb25zIChBZHZhbmNlZCk8L2gyPlxuICAgICAgPGRpdiBzdHlsZT17c3R5bGVzLnRleHR9PlxuICAgICAgICA8cD5UaGluayBvZiBFeHByZXNzaW9ucyBhcyDigJxFeGNlbCBGb3JtdWxhcy7igJ0gIFRoZXkncmUgdGhlIGVhc2llc3Qgd2F5IHRvIHB1dCBhbnkgb2YgeW91ciBTdGF0ZXMgdG8gdXNlLjwvcD5cblxuICAgICAgICA8cD5BbnkgcHJvcGVydHkgb24gdGhlIHRpbWVsaW5lIGNhbiBiZSBhbiBFeHByZXNzaW9uIGluc3RlYWQgb2YgYSBwbGFpbiBvbGQgbnVtYmVyLiAgSW4gZmFjdCwgeW91IGNhbiBzZXQgZGlmZmVyZW50IEV4cHJlc3Npb25zIGFuZCBudW1iZXJzIGF0IGRpZmZlcmVudCBrZXlmcmFtZXMsIHRoZW4gYW5pbWF0ZSBiZXR3ZWVuIHRoZW0hPC9wPlxuXG4gICAgICAgIDxwPlRoaXMgaXMgYW4gYWR2YW5jZWQgZmVhdHVyZSwgc28gd2UgaW52aXRlIHlvdSB0byBjaGVjayBpdCBvdXQgbGF0ZXLigJRidXQgYWxsIHlvdSBoYXZlIHRvIGRvIGlzIHN0YXJ0IHlvdXIgdmFsdWUgd2l0aCBhbiAnPScgc2lnbiwgYW5kIEhhaWt1IHdpbGwga25vdyB5b3UncmUgd3JpdGluZyBhbiBFeHByZXNzaW9uLiAgRm9yIGV4YW1wbGU6PC9wPlxuXG4gICAgICAgIDxwcmUgc3R5bGU9e3N0eWxlcy5jb2RlfT5cbiAgICAgICAgICA8Y29kZT49IG15U3RhdGUgKiAyPC9jb2RlPlxuICAgICAgICA8L3ByZT5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICApXG59XG4iXX0=