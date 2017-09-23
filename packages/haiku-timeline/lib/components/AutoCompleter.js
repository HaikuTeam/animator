'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _jsxFileName = 'src/components/AutoCompleter.js';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _DefaultPalette = require('./DefaultPalette');

var _DefaultPalette2 = _interopRequireDefault(_DefaultPalette);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MAX_AUTOCOMPLETE_HEIGHT = 195;

var AutoCompleter = function (_React$Component) {
  _inherits(AutoCompleter, _React$Component);

  function AutoCompleter() {
    _classCallCheck(this, AutoCompleter);

    return _possibleConstructorReturn(this, (AutoCompleter.__proto__ || Object.getPrototypeOf(AutoCompleter)).apply(this, arguments));
  }

  _createClass(AutoCompleter, [{
    key: 'getContextStyle',
    value: function getContextStyle() {
      var num = this.props.autoCompletions.length;
      var height = num * this.props.lineHeight;
      if (num > 0) height += 1;
      if (height > MAX_AUTOCOMPLETE_HEIGHT) height = MAX_AUTOCOMPLETE_HEIGHT;
      var style = {
        position: 'absolute',
        left: 0,
        top: this.props.height,
        width: this.props.width,
        height: height,
        overflowY: 'auto',
        overflowX: 'hidden',
        backgroundColor: _DefaultPalette2.default.COAL,
        borderBottomLeftRadius: 4,
        borderBottomRightRadius: 4
      };
      return style;
    }
  }, {
    key: 'renderAutoCompletions',
    value: function renderAutoCompletions() {
      var _this2 = this;

      if (this.props.autoCompletions.length < 1) return '';

      return this.props.autoCompletions.map(function (_ref, index) {
        var name = _ref.name,
            highlighted = _ref.highlighted;

        return _react2.default.createElement(
          'div',
          {
            key: index,
            onClick: function onClick() {
              _this2.props.onClick({ name: name, highlighted: highlighted });
            },
            style: {
              color: highlighted ? _DefaultPalette2.default.SUNSTONE : _DefaultPalette2.default.DARKER_ROCK,
              backgroundColor: highlighted ? _DefaultPalette2.default.LIGHTEST_GRAY : 'inherit',
              height: _this2.props.lineHeight,
              lineHeight: _this2.props.lineHeight + 'px',
              paddingLeft: 7,
              paddingTop: 2
            }, __source: {
              fileName: _jsxFileName,
              lineNumber: 32
            },
            __self: _this2
          },
          name
        );
      });
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        {
          id: 'expression-input-autocomplete-context',
          style: this.getContextStyle(), __source: {
            fileName: _jsxFileName,
            lineNumber: 53
          },
          __self: this
        },
        this.renderAutoCompletions()
      );
    }
  }]);

  return AutoCompleter;
}(_react2.default.Component);

exports.default = AutoCompleter;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21wb25lbnRzL0F1dG9Db21wbGV0ZXIuanMiXSwibmFtZXMiOlsiTUFYX0FVVE9DT01QTEVURV9IRUlHSFQiLCJBdXRvQ29tcGxldGVyIiwibnVtIiwicHJvcHMiLCJhdXRvQ29tcGxldGlvbnMiLCJsZW5ndGgiLCJoZWlnaHQiLCJsaW5lSGVpZ2h0Iiwic3R5bGUiLCJwb3NpdGlvbiIsImxlZnQiLCJ0b3AiLCJ3aWR0aCIsIm92ZXJmbG93WSIsIm92ZXJmbG93WCIsImJhY2tncm91bmRDb2xvciIsIkNPQUwiLCJib3JkZXJCb3R0b21MZWZ0UmFkaXVzIiwiYm9yZGVyQm90dG9tUmlnaHRSYWRpdXMiLCJtYXAiLCJpbmRleCIsIm5hbWUiLCJoaWdobGlnaHRlZCIsIm9uQ2xpY2siLCJjb2xvciIsIlNVTlNUT05FIiwiREFSS0VSX1JPQ0siLCJMSUdIVEVTVF9HUkFZIiwicGFkZGluZ0xlZnQiLCJwYWRkaW5nVG9wIiwiZ2V0Q29udGV4dFN0eWxlIiwicmVuZGVyQXV0b0NvbXBsZXRpb25zIiwiQ29tcG9uZW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7Ozs7Ozs7Ozs7QUFFQSxJQUFNQSwwQkFBMEIsR0FBaEM7O0lBRXFCQyxhOzs7Ozs7Ozs7OztzQ0FDQTtBQUNqQixVQUFJQyxNQUFNLEtBQUtDLEtBQUwsQ0FBV0MsZUFBWCxDQUEyQkMsTUFBckM7QUFDQSxVQUFJQyxTQUFTSixNQUFNLEtBQUtDLEtBQUwsQ0FBV0ksVUFBOUI7QUFDQSxVQUFJTCxNQUFNLENBQVYsRUFBYUksVUFBVSxDQUFWO0FBQ2IsVUFBSUEsU0FBU04sdUJBQWIsRUFBc0NNLFNBQVNOLHVCQUFUO0FBQ3RDLFVBQUlRLFFBQVE7QUFDVkMsa0JBQVUsVUFEQTtBQUVWQyxjQUFNLENBRkk7QUFHVkMsYUFBSyxLQUFLUixLQUFMLENBQVdHLE1BSE47QUFJVk0sZUFBTyxLQUFLVCxLQUFMLENBQVdTLEtBSlI7QUFLVk4sZ0JBQVFBLE1BTEU7QUFNVk8sbUJBQVcsTUFORDtBQU9WQyxtQkFBVyxRQVBEO0FBUVZDLHlCQUFpQix5QkFBUUMsSUFSZjtBQVNWQyxnQ0FBd0IsQ0FUZDtBQVVWQyxpQ0FBeUI7QUFWZixPQUFaO0FBWUEsYUFBT1YsS0FBUDtBQUNEOzs7NENBRXdCO0FBQUE7O0FBQ3ZCLFVBQUksS0FBS0wsS0FBTCxDQUFXQyxlQUFYLENBQTJCQyxNQUEzQixHQUFvQyxDQUF4QyxFQUEyQyxPQUFPLEVBQVA7O0FBRTNDLGFBQU8sS0FBS0YsS0FBTCxDQUFXQyxlQUFYLENBQTJCZSxHQUEzQixDQUErQixnQkFBd0JDLEtBQXhCLEVBQWtDO0FBQUEsWUFBL0JDLElBQStCLFFBQS9CQSxJQUErQjtBQUFBLFlBQXpCQyxXQUF5QixRQUF6QkEsV0FBeUI7O0FBQ3RFLGVBQ0U7QUFBQTtBQUFBO0FBQ0UsaUJBQUtGLEtBRFA7QUFFRSxxQkFBUyxtQkFBTTtBQUNiLHFCQUFLakIsS0FBTCxDQUFXb0IsT0FBWCxDQUFtQixFQUFFRixVQUFGLEVBQVFDLHdCQUFSLEVBQW5CO0FBQ0QsYUFKSDtBQUtFLG1CQUFPO0FBQ0xFLHFCQUFRRixXQUFELEdBQWdCLHlCQUFRRyxRQUF4QixHQUFtQyx5QkFBUUMsV0FEN0M7QUFFTFgsK0JBQWtCTyxXQUFELEdBQWdCLHlCQUFRSyxhQUF4QixHQUF3QyxTQUZwRDtBQUdMckIsc0JBQVEsT0FBS0gsS0FBTCxDQUFXSSxVQUhkO0FBSUxBLDBCQUFZLE9BQUtKLEtBQUwsQ0FBV0ksVUFBWCxHQUF3QixJQUovQjtBQUtMcUIsMkJBQWEsQ0FMUjtBQU1MQywwQkFBWTtBQU5QLGFBTFQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBYUdSO0FBYkgsU0FERjtBQWlCRCxPQWxCTSxDQUFQO0FBbUJEOzs7NkJBRVM7QUFDUixhQUNFO0FBQUE7QUFBQTtBQUNFLGNBQUcsdUNBREw7QUFFRSxpQkFBTyxLQUFLUyxlQUFMLEVBRlQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBR0csYUFBS0MscUJBQUw7QUFISCxPQURGO0FBT0Q7Ozs7RUFyRHdDLGdCQUFNQyxTOztrQkFBNUIvQixhIiwiZmlsZSI6IkF1dG9Db21wbGV0ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgUGFsZXR0ZSBmcm9tICcuL0RlZmF1bHRQYWxldHRlJ1xuXG5jb25zdCBNQVhfQVVUT0NPTVBMRVRFX0hFSUdIVCA9IDE5NVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBdXRvQ29tcGxldGVyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgZ2V0Q29udGV4dFN0eWxlICgpIHtcbiAgICBsZXQgbnVtID0gdGhpcy5wcm9wcy5hdXRvQ29tcGxldGlvbnMubGVuZ3RoXG4gICAgbGV0IGhlaWdodCA9IG51bSAqIHRoaXMucHJvcHMubGluZUhlaWdodFxuICAgIGlmIChudW0gPiAwKSBoZWlnaHQgKz0gMVxuICAgIGlmIChoZWlnaHQgPiBNQVhfQVVUT0NPTVBMRVRFX0hFSUdIVCkgaGVpZ2h0ID0gTUFYX0FVVE9DT01QTEVURV9IRUlHSFRcbiAgICBsZXQgc3R5bGUgPSB7XG4gICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgIGxlZnQ6IDAsXG4gICAgICB0b3A6IHRoaXMucHJvcHMuaGVpZ2h0LFxuICAgICAgd2lkdGg6IHRoaXMucHJvcHMud2lkdGgsXG4gICAgICBoZWlnaHQ6IGhlaWdodCxcbiAgICAgIG92ZXJmbG93WTogJ2F1dG8nLFxuICAgICAgb3ZlcmZsb3dYOiAnaGlkZGVuJyxcbiAgICAgIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5DT0FMLFxuICAgICAgYm9yZGVyQm90dG9tTGVmdFJhZGl1czogNCxcbiAgICAgIGJvcmRlckJvdHRvbVJpZ2h0UmFkaXVzOiA0XG4gICAgfVxuICAgIHJldHVybiBzdHlsZVxuICB9XG5cbiAgcmVuZGVyQXV0b0NvbXBsZXRpb25zICgpIHtcbiAgICBpZiAodGhpcy5wcm9wcy5hdXRvQ29tcGxldGlvbnMubGVuZ3RoIDwgMSkgcmV0dXJuICcnXG5cbiAgICByZXR1cm4gdGhpcy5wcm9wcy5hdXRvQ29tcGxldGlvbnMubWFwKCh7IG5hbWUsIGhpZ2hsaWdodGVkIH0sIGluZGV4KSA9PiB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2XG4gICAgICAgICAga2V5PXtpbmRleH1cbiAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnByb3BzLm9uQ2xpY2soeyBuYW1lLCBoaWdobGlnaHRlZCB9KVxuICAgICAgICAgIH19XG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIGNvbG9yOiAoaGlnaGxpZ2h0ZWQpID8gUGFsZXR0ZS5TVU5TVE9ORSA6IFBhbGV0dGUuREFSS0VSX1JPQ0ssXG4gICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IChoaWdobGlnaHRlZCkgPyBQYWxldHRlLkxJR0hURVNUX0dSQVkgOiAnaW5oZXJpdCcsXG4gICAgICAgICAgICBoZWlnaHQ6IHRoaXMucHJvcHMubGluZUhlaWdodCxcbiAgICAgICAgICAgIGxpbmVIZWlnaHQ6IHRoaXMucHJvcHMubGluZUhlaWdodCArICdweCcsXG4gICAgICAgICAgICBwYWRkaW5nTGVmdDogNyxcbiAgICAgICAgICAgIHBhZGRpbmdUb3A6IDJcbiAgICAgICAgICB9fT5cbiAgICAgICAgICB7bmFtZX1cbiAgICAgICAgPC9kaXY+XG4gICAgICApXG4gICAgfSlcbiAgfVxuXG4gIHJlbmRlciAoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXZcbiAgICAgICAgaWQ9J2V4cHJlc3Npb24taW5wdXQtYXV0b2NvbXBsZXRlLWNvbnRleHQnXG4gICAgICAgIHN0eWxlPXt0aGlzLmdldENvbnRleHRTdHlsZSgpfT5cbiAgICAgICAge3RoaXMucmVuZGVyQXV0b0NvbXBsZXRpb25zKCl9XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cbn1cbiJdfQ==