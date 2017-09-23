'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _jsxFileName = 'src/react/components/PseudoMenuButton.js';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _radium = require('radium');

var _radium2 = _interopRequireDefault(_radium);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PseudoMenuButton = function (_React$Component) {
  _inherits(PseudoMenuButton, _React$Component);

  function PseudoMenuButton(props) {
    _classCallCheck(this, PseudoMenuButton);

    var _this = _possibleConstructorReturn(this, (PseudoMenuButton.__proto__ || Object.getPrototypeOf(PseudoMenuButton)).call(this, props));

    _this.EXPAND_DELAY = 150;
    _this._onExpand = props.onExpand || function () {};
    _this._onClick = props.onClick || function () {};
    _this._downTimeout = null;
    return _this;
  }

  _createClass(PseudoMenuButton, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'button',
        { style: this.props.style,
          onMouseDown: this._handleMouseDown.bind(this),
          onMouseUp: this._handleMouseUp.bind(this), __source: {
            fileName: _jsxFileName,
            lineNumber: 16
          },
          __self: this
        },
        this.props.children
      );
    }
  }, {
    key: '_handleMouseDown',
    value: function _handleMouseDown() {
      var _this2 = this;

      this._downTimeout = setTimeout(function () {
        _this2._downTimeout = null;
        _this2._onExpand();
      }, this.EXPAND_DELAY);
    }
  }, {
    key: '_handleMouseUp',
    value: function _handleMouseUp() {
      if (this._downTimeout) {
        clearTimeout(this._downTimeout);
        this._downTimeout = null;
        this._onClick();
      }
    }
  }]);

  return PseudoMenuButton;
}(_react2.default.Component);

exports.default = (0, _radium2.default)(PseudoMenuButton);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9yZWFjdC9jb21wb25lbnRzL1BzZXVkb01lbnVCdXR0b24uanMiXSwibmFtZXMiOlsiUHNldWRvTWVudUJ1dHRvbiIsInByb3BzIiwiRVhQQU5EX0RFTEFZIiwiX29uRXhwYW5kIiwib25FeHBhbmQiLCJfb25DbGljayIsIm9uQ2xpY2siLCJfZG93blRpbWVvdXQiLCJzdHlsZSIsIl9oYW5kbGVNb3VzZURvd24iLCJiaW5kIiwiX2hhbmRsZU1vdXNlVXAiLCJjaGlsZHJlbiIsInNldFRpbWVvdXQiLCJjbGVhclRpbWVvdXQiLCJDb21wb25lbnQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7Ozs7Ozs7OztJQUVNQSxnQjs7O0FBQ0osNEJBQWFDLEtBQWIsRUFBb0I7QUFBQTs7QUFBQSxvSUFDWkEsS0FEWTs7QUFHbEIsVUFBS0MsWUFBTCxHQUFvQixHQUFwQjtBQUNBLFVBQUtDLFNBQUwsR0FBaUJGLE1BQU1HLFFBQU4sSUFBbUIsWUFBTSxDQUFFLENBQTVDO0FBQ0EsVUFBS0MsUUFBTCxHQUFnQkosTUFBTUssT0FBTixJQUFrQixZQUFNLENBQUUsQ0FBMUM7QUFDQSxVQUFLQyxZQUFMLEdBQW9CLElBQXBCO0FBTmtCO0FBT25COzs7OzZCQUVTO0FBQ1IsYUFDRTtBQUFBO0FBQUEsVUFBUSxPQUFPLEtBQUtOLEtBQUwsQ0FBV08sS0FBMUI7QUFDRSx1QkFBYSxLQUFLQyxnQkFBTCxDQUFzQkMsSUFBdEIsQ0FBMkIsSUFBM0IsQ0FEZjtBQUVFLHFCQUFXLEtBQUtDLGNBQUwsQ0FBb0JELElBQXBCLENBQXlCLElBQXpCLENBRmI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBR0ksYUFBS1QsS0FBTCxDQUFXVztBQUhmLE9BREY7QUFPRDs7O3VDQUVtQjtBQUFBOztBQUNsQixXQUFLTCxZQUFMLEdBQW9CTSxXQUFXLFlBQU07QUFDbkMsZUFBS04sWUFBTCxHQUFvQixJQUFwQjtBQUNBLGVBQUtKLFNBQUw7QUFDRCxPQUhtQixFQUdqQixLQUFLRCxZQUhZLENBQXBCO0FBSUQ7OztxQ0FFaUI7QUFDaEIsVUFBSSxLQUFLSyxZQUFULEVBQXVCO0FBQ3JCTyxxQkFBYSxLQUFLUCxZQUFsQjtBQUNBLGFBQUtBLFlBQUwsR0FBb0IsSUFBcEI7QUFDQSxhQUFLRixRQUFMO0FBQ0Q7QUFDRjs7OztFQWpDNEIsZ0JBQU1VLFM7O2tCQW9DdEIsc0JBQU9mLGdCQUFQLEMiLCJmaWxlIjoiUHNldWRvTWVudUJ1dHRvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCBSYWRpdW0gZnJvbSAncmFkaXVtJ1xuXG5jbGFzcyBQc2V1ZG9NZW51QnV0dG9uIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IgKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpXG5cbiAgICB0aGlzLkVYUEFORF9ERUxBWSA9IDE1MFxuICAgIHRoaXMuX29uRXhwYW5kID0gcHJvcHMub25FeHBhbmQgfHwgKCgpID0+IHt9KVxuICAgIHRoaXMuX29uQ2xpY2sgPSBwcm9wcy5vbkNsaWNrIHx8ICgoKSA9PiB7fSlcbiAgICB0aGlzLl9kb3duVGltZW91dCA9IG51bGxcbiAgfVxuXG4gIHJlbmRlciAoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxidXR0b24gc3R5bGU9e3RoaXMucHJvcHMuc3R5bGV9XG4gICAgICAgIG9uTW91c2VEb3duPXt0aGlzLl9oYW5kbGVNb3VzZURvd24uYmluZCh0aGlzKX1cbiAgICAgICAgb25Nb3VzZVVwPXt0aGlzLl9oYW5kbGVNb3VzZVVwLmJpbmQodGhpcyl9PlxuICAgICAgICB7IHRoaXMucHJvcHMuY2hpbGRyZW4gfVxuICAgICAgPC9idXR0b24+XG4gICAgKVxuICB9XG5cbiAgX2hhbmRsZU1vdXNlRG93biAoKSB7XG4gICAgdGhpcy5fZG93blRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMuX2Rvd25UaW1lb3V0ID0gbnVsbFxuICAgICAgdGhpcy5fb25FeHBhbmQoKVxuICAgIH0sIHRoaXMuRVhQQU5EX0RFTEFZKVxuICB9XG5cbiAgX2hhbmRsZU1vdXNlVXAgKCkge1xuICAgIGlmICh0aGlzLl9kb3duVGltZW91dCkge1xuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuX2Rvd25UaW1lb3V0KVxuICAgICAgdGhpcy5fZG93blRpbWVvdXQgPSBudWxsXG4gICAgICB0aGlzLl9vbkNsaWNrKClcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUmFkaXVtKFBzZXVkb01lbnVCdXR0b24pXG4iXX0=