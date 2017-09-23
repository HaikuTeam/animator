'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _jsxFileName = 'src/react/AutoCompleter.js';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Palette = require('./Palette');

var _Palette2 = _interopRequireDefault(_Palette);

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
        backgroundColor: _Palette2.default.COAL,
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
              color: highlighted ? _Palette2.default.SUNSTONE : _Palette2.default.DARKER_ROCK,
              backgroundColor: highlighted ? _Palette2.default.LIGHTEST_GRAY : 'inherit',
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZWFjdC9BdXRvQ29tcGxldGVyLmpzIl0sIm5hbWVzIjpbIk1BWF9BVVRPQ09NUExFVEVfSEVJR0hUIiwiQXV0b0NvbXBsZXRlciIsIm51bSIsInByb3BzIiwiYXV0b0NvbXBsZXRpb25zIiwibGVuZ3RoIiwiaGVpZ2h0IiwibGluZUhlaWdodCIsInN0eWxlIiwicG9zaXRpb24iLCJsZWZ0IiwidG9wIiwid2lkdGgiLCJvdmVyZmxvd1kiLCJvdmVyZmxvd1giLCJiYWNrZ3JvdW5kQ29sb3IiLCJDT0FMIiwiYm9yZGVyQm90dG9tTGVmdFJhZGl1cyIsImJvcmRlckJvdHRvbVJpZ2h0UmFkaXVzIiwibWFwIiwiaW5kZXgiLCJuYW1lIiwiaGlnaGxpZ2h0ZWQiLCJvbkNsaWNrIiwiY29sb3IiLCJTVU5TVE9ORSIsIkRBUktFUl9ST0NLIiwiTElHSFRFU1RfR1JBWSIsInBhZGRpbmdMZWZ0IiwicGFkZGluZ1RvcCIsImdldENvbnRleHRTdHlsZSIsInJlbmRlckF1dG9Db21wbGV0aW9ucyIsIkNvbXBvbmVudCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7Ozs7Ozs7Ozs7O0FBRUEsSUFBTUEsMEJBQTBCLEdBQWhDOztJQUVxQkMsYTs7Ozs7Ozs7Ozs7c0NBQ0E7QUFDakIsVUFBSUMsTUFBTSxLQUFLQyxLQUFMLENBQVdDLGVBQVgsQ0FBMkJDLE1BQXJDO0FBQ0EsVUFBSUMsU0FBU0osTUFBTSxLQUFLQyxLQUFMLENBQVdJLFVBQTlCO0FBQ0EsVUFBSUwsTUFBTSxDQUFWLEVBQWFJLFVBQVUsQ0FBVjtBQUNiLFVBQUlBLFNBQVNOLHVCQUFiLEVBQXNDTSxTQUFTTix1QkFBVDtBQUN0QyxVQUFJUSxRQUFRO0FBQ1ZDLGtCQUFVLFVBREE7QUFFVkMsY0FBTSxDQUZJO0FBR1ZDLGFBQUssS0FBS1IsS0FBTCxDQUFXRyxNQUhOO0FBSVZNLGVBQU8sS0FBS1QsS0FBTCxDQUFXUyxLQUpSO0FBS1ZOLGdCQUFRQSxNQUxFO0FBTVZPLG1CQUFXLE1BTkQ7QUFPVkMsbUJBQVcsUUFQRDtBQVFWQyx5QkFBaUIsa0JBQVFDLElBUmY7QUFTVkMsZ0NBQXdCLENBVGQ7QUFVVkMsaUNBQXlCO0FBVmYsT0FBWjtBQVlBLGFBQU9WLEtBQVA7QUFDRDs7OzRDQUV3QjtBQUFBOztBQUN2QixVQUFJLEtBQUtMLEtBQUwsQ0FBV0MsZUFBWCxDQUEyQkMsTUFBM0IsR0FBb0MsQ0FBeEMsRUFBMkMsT0FBTyxFQUFQOztBQUUzQyxhQUFPLEtBQUtGLEtBQUwsQ0FBV0MsZUFBWCxDQUEyQmUsR0FBM0IsQ0FBK0IsZ0JBQXdCQyxLQUF4QixFQUFrQztBQUFBLFlBQS9CQyxJQUErQixRQUEvQkEsSUFBK0I7QUFBQSxZQUF6QkMsV0FBeUIsUUFBekJBLFdBQXlCOztBQUN0RSxlQUNFO0FBQUE7QUFBQTtBQUNFLGlCQUFLRixLQURQO0FBRUUscUJBQVMsbUJBQU07QUFDYixxQkFBS2pCLEtBQUwsQ0FBV29CLE9BQVgsQ0FBbUIsRUFBRUYsVUFBRixFQUFRQyx3QkFBUixFQUFuQjtBQUNELGFBSkg7QUFLRSxtQkFBTztBQUNMRSxxQkFBUUYsV0FBRCxHQUFnQixrQkFBUUcsUUFBeEIsR0FBbUMsa0JBQVFDLFdBRDdDO0FBRUxYLCtCQUFrQk8sV0FBRCxHQUFnQixrQkFBUUssYUFBeEIsR0FBd0MsU0FGcEQ7QUFHTHJCLHNCQUFRLE9BQUtILEtBQUwsQ0FBV0ksVUFIZDtBQUlMQSwwQkFBWSxPQUFLSixLQUFMLENBQVdJLFVBQVgsR0FBd0IsSUFKL0I7QUFLTHFCLDJCQUFhLENBTFI7QUFNTEMsMEJBQVk7QUFOUCxhQUxUO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQWFHUjtBQWJILFNBREY7QUFpQkQsT0FsQk0sQ0FBUDtBQW1CRDs7OzZCQUVTO0FBQ1IsYUFDRTtBQUFBO0FBQUE7QUFDRSxjQUFHLHVDQURMO0FBRUUsaUJBQU8sS0FBS1MsZUFBTCxFQUZUO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUdHLGFBQUtDLHFCQUFMO0FBSEgsT0FERjtBQU9EOzs7O0VBckR3QyxnQkFBTUMsUzs7a0JBQTVCL0IsYSIsImZpbGUiOiJBdXRvQ29tcGxldGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IFBhbGV0dGUgZnJvbSAnLi9QYWxldHRlJ1xuXG5jb25zdCBNQVhfQVVUT0NPTVBMRVRFX0hFSUdIVCA9IDE5NVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBdXRvQ29tcGxldGVyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgZ2V0Q29udGV4dFN0eWxlICgpIHtcbiAgICBsZXQgbnVtID0gdGhpcy5wcm9wcy5hdXRvQ29tcGxldGlvbnMubGVuZ3RoXG4gICAgbGV0IGhlaWdodCA9IG51bSAqIHRoaXMucHJvcHMubGluZUhlaWdodFxuICAgIGlmIChudW0gPiAwKSBoZWlnaHQgKz0gMVxuICAgIGlmIChoZWlnaHQgPiBNQVhfQVVUT0NPTVBMRVRFX0hFSUdIVCkgaGVpZ2h0ID0gTUFYX0FVVE9DT01QTEVURV9IRUlHSFRcbiAgICBsZXQgc3R5bGUgPSB7XG4gICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgIGxlZnQ6IDAsXG4gICAgICB0b3A6IHRoaXMucHJvcHMuaGVpZ2h0LFxuICAgICAgd2lkdGg6IHRoaXMucHJvcHMud2lkdGgsXG4gICAgICBoZWlnaHQ6IGhlaWdodCxcbiAgICAgIG92ZXJmbG93WTogJ2F1dG8nLFxuICAgICAgb3ZlcmZsb3dYOiAnaGlkZGVuJyxcbiAgICAgIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5DT0FMLFxuICAgICAgYm9yZGVyQm90dG9tTGVmdFJhZGl1czogNCxcbiAgICAgIGJvcmRlckJvdHRvbVJpZ2h0UmFkaXVzOiA0XG4gICAgfVxuICAgIHJldHVybiBzdHlsZVxuICB9XG5cbiAgcmVuZGVyQXV0b0NvbXBsZXRpb25zICgpIHtcbiAgICBpZiAodGhpcy5wcm9wcy5hdXRvQ29tcGxldGlvbnMubGVuZ3RoIDwgMSkgcmV0dXJuICcnXG5cbiAgICByZXR1cm4gdGhpcy5wcm9wcy5hdXRvQ29tcGxldGlvbnMubWFwKCh7IG5hbWUsIGhpZ2hsaWdodGVkIH0sIGluZGV4KSA9PiB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2XG4gICAgICAgICAga2V5PXtpbmRleH1cbiAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnByb3BzLm9uQ2xpY2soeyBuYW1lLCBoaWdobGlnaHRlZCB9KVxuICAgICAgICAgIH19XG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIGNvbG9yOiAoaGlnaGxpZ2h0ZWQpID8gUGFsZXR0ZS5TVU5TVE9ORSA6IFBhbGV0dGUuREFSS0VSX1JPQ0ssXG4gICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IChoaWdobGlnaHRlZCkgPyBQYWxldHRlLkxJR0hURVNUX0dSQVkgOiAnaW5oZXJpdCcsXG4gICAgICAgICAgICBoZWlnaHQ6IHRoaXMucHJvcHMubGluZUhlaWdodCxcbiAgICAgICAgICAgIGxpbmVIZWlnaHQ6IHRoaXMucHJvcHMubGluZUhlaWdodCArICdweCcsXG4gICAgICAgICAgICBwYWRkaW5nTGVmdDogNyxcbiAgICAgICAgICAgIHBhZGRpbmdUb3A6IDJcbiAgICAgICAgICB9fT5cbiAgICAgICAgICB7bmFtZX1cbiAgICAgICAgPC9kaXY+XG4gICAgICApXG4gICAgfSlcbiAgfVxuXG4gIHJlbmRlciAoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXZcbiAgICAgICAgaWQ9J2V4cHJlc3Npb24taW5wdXQtYXV0b2NvbXBsZXRlLWNvbnRleHQnXG4gICAgICAgIHN0eWxlPXt0aGlzLmdldENvbnRleHRTdHlsZSgpfT5cbiAgICAgICAge3RoaXMucmVuZGVyQXV0b0NvbXBsZXRpb25zKCl9XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cbn1cbiJdfQ==