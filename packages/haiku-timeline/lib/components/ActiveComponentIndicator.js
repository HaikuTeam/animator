'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _jsxFileName = 'src/components/ActiveComponentIndicator.js';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _truncate = require('./helpers/truncate');

var _truncate2 = _interopRequireDefault(_truncate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ActiveComponentIndicator = function (_React$Component) {
  _inherits(ActiveComponentIndicator, _React$Component);

  function ActiveComponentIndicator() {
    _classCallCheck(this, ActiveComponentIndicator);

    return _possibleConstructorReturn(this, (ActiveComponentIndicator.__proto__ || Object.getPrototypeOf(ActiveComponentIndicator)).apply(this, arguments));
  }

  _createClass(ActiveComponentIndicator, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'span',
        { className: 'no-select', style: { fontSize: 14 }, __source: {
            fileName: _jsxFileName,
            lineNumber: 7
          },
          __self: this
        },
        (0, _truncate2.default)(this.props.displayName || '', 50)
      );
    }
  }]);

  return ActiveComponentIndicator;
}(_react2.default.Component);

exports.default = ActiveComponentIndicator;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21wb25lbnRzL0FjdGl2ZUNvbXBvbmVudEluZGljYXRvci5qcyJdLCJuYW1lcyI6WyJBY3RpdmVDb21wb25lbnRJbmRpY2F0b3IiLCJmb250U2l6ZSIsInByb3BzIiwiZGlzcGxheU5hbWUiLCJDb21wb25lbnQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7Ozs7Ozs7OztJQUVxQkEsd0I7Ozs7Ozs7Ozs7OzZCQUNUO0FBQ1IsYUFDRTtBQUFBO0FBQUEsVUFBTSxXQUFVLFdBQWhCLEVBQTRCLE9BQU8sRUFBQ0MsVUFBVSxFQUFYLEVBQW5DO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFvRCxnQ0FBUyxLQUFLQyxLQUFMLENBQVdDLFdBQVgsSUFBMEIsRUFBbkMsRUFBdUMsRUFBdkM7QUFBcEQsT0FERjtBQUdEOzs7O0VBTG1ELGdCQUFNQyxTOztrQkFBdkNKLHdCIiwiZmlsZSI6IkFjdGl2ZUNvbXBvbmVudEluZGljYXRvci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCB0cnVuY2F0ZSBmcm9tICcuL2hlbHBlcnMvdHJ1bmNhdGUnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFjdGl2ZUNvbXBvbmVudEluZGljYXRvciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHJlbmRlciAoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxzcGFuIGNsYXNzTmFtZT0nbm8tc2VsZWN0JyBzdHlsZT17e2ZvbnRTaXplOiAxNH19Pnt0cnVuY2F0ZSh0aGlzLnByb3BzLmRpc3BsYXlOYW1lIHx8ICcnLCA1MCl9PC9zcGFuPlxuICAgIClcbiAgfVxufVxuIl19