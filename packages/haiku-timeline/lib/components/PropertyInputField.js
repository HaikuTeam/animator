'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _jsxFileName = 'src/components/PropertyInputField.js';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _color = require('color');

var _color2 = _interopRequireDefault(_color);

var _DefaultPalette = require('./DefaultPalette');

var _DefaultPalette2 = _interopRequireDefault(_DefaultPalette);

var _getPropertyValueDescriptor = require('./helpers/getPropertyValueDescriptor');

var _getPropertyValueDescriptor2 = _interopRequireDefault(_getPropertyValueDescriptor);

var _ItemHelpers = require('./helpers/ItemHelpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PropertyInputField = function (_React$Component) {
  _inherits(PropertyInputField, _React$Component);

  function PropertyInputField() {
    _classCallCheck(this, PropertyInputField);

    return _possibleConstructorReturn(this, (PropertyInputField.__proto__ || Object.getPrototypeOf(PropertyInputField)).apply(this, arguments));
  }

  _createClass(PropertyInputField, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps) {
      return true;
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var propertyId = (0, _ItemHelpers.getItemPropertyId)(this.props.item);
      var valueDescriptor = (0, _getPropertyValueDescriptor2.default)(this.props.item.node, this.props.frameInfo, this.props.reifiedBytecode, this.props.serializedBytecode, this.props.component, this.props.timelineTime, this.props.timelineName, this.props.item.property, { numFormat: '0,0[.]000' });
      return _react2.default.createElement(
        'div',
        {
          id: propertyId,
          className: 'property-input-field-box',
          style: {
            height: this.props.rowHeight - 1,
            width: this.props.inputCellWidth,
            position: 'relative',
            outline: 'none'
          },
          onClick: function onClick() {
            _this2.props.parent.setState({
              inputFocused: null,
              inputSelected: _this2.props.item
            });
          },
          onDoubleClick: function onDoubleClick() {
            _this2.props.parent.setState({
              inputSelected: _this2.props.item,
              inputFocused: _this2.props.item
            });
          }, __source: {
            fileName: _jsxFileName,
            lineNumber: 27
          },
          __self: this
        },
        _react2.default.createElement(
          'div',
          {
            className: 'property-input-field no-select',
            style: _lodash2.default.assign({
              position: 'absolute',
              outline: 'none',
              color: 'transparent',
              textShadow: '0 0 0 ' + (0, _color2.default)(_DefaultPalette2.default.ROCK).fade(0.3), // darkmagic
              minWidth: 83,
              height: this.props.rowHeight + 1,
              paddingLeft: 7,
              paddingTop: 3,
              zIndex: 1004,
              paddingRight: 15,
              lineHeight: '20px',
              borderTopLeftRadius: 4,
              borderBottomLeftRadius: 4,
              fontSize: 13,
              border: '1px solid ' + _DefaultPalette2.default.DARKER_GRAY,
              backgroundColor: _DefaultPalette2.default.LIGHT_GRAY,
              overflow: 'hidden',
              fontFamily: 'inherit',
              cursor: 'default'
            }, (0, _ItemHelpers.isItemEqual)(this.props.inputSelected, this.props.item) && {
              border: '1px solid ' + (0, _color2.default)(_DefaultPalette2.default.LIGHTEST_PINK).fade(0.2),
              zIndex: 2005
            }), __source: {
              fileName: _jsxFileName,
              lineNumber: 48
            },
            __self: this
          },
          valueDescriptor.prettyValue
        )
      );
    }
  }]);

  return PropertyInputField;
}(_react2.default.Component);

exports.default = PropertyInputField;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21wb25lbnRzL1Byb3BlcnR5SW5wdXRGaWVsZC5qcyJdLCJuYW1lcyI6WyJQcm9wZXJ0eUlucHV0RmllbGQiLCJuZXh0UHJvcHMiLCJwcm9wZXJ0eUlkIiwicHJvcHMiLCJpdGVtIiwidmFsdWVEZXNjcmlwdG9yIiwibm9kZSIsImZyYW1lSW5mbyIsInJlaWZpZWRCeXRlY29kZSIsInNlcmlhbGl6ZWRCeXRlY29kZSIsImNvbXBvbmVudCIsInRpbWVsaW5lVGltZSIsInRpbWVsaW5lTmFtZSIsInByb3BlcnR5IiwibnVtRm9ybWF0IiwiaGVpZ2h0Iiwicm93SGVpZ2h0Iiwid2lkdGgiLCJpbnB1dENlbGxXaWR0aCIsInBvc2l0aW9uIiwib3V0bGluZSIsInBhcmVudCIsInNldFN0YXRlIiwiaW5wdXRGb2N1c2VkIiwiaW5wdXRTZWxlY3RlZCIsImFzc2lnbiIsImNvbG9yIiwidGV4dFNoYWRvdyIsIlJPQ0siLCJmYWRlIiwibWluV2lkdGgiLCJwYWRkaW5nTGVmdCIsInBhZGRpbmdUb3AiLCJ6SW5kZXgiLCJwYWRkaW5nUmlnaHQiLCJsaW5lSGVpZ2h0IiwiYm9yZGVyVG9wTGVmdFJhZGl1cyIsImJvcmRlckJvdHRvbUxlZnRSYWRpdXMiLCJmb250U2l6ZSIsImJvcmRlciIsIkRBUktFUl9HUkFZIiwiYmFja2dyb3VuZENvbG9yIiwiTElHSFRfR1JBWSIsIm92ZXJmbG93IiwiZm9udEZhbWlseSIsImN1cnNvciIsIkxJR0hURVNUX1BJTksiLCJwcmV0dHlWYWx1ZSIsIkNvbXBvbmVudCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7O0lBRXFCQSxrQjs7Ozs7Ozs7Ozs7MENBQ0lDLFMsRUFBVztBQUNoQyxhQUFPLElBQVA7QUFDRDs7OzZCQUVTO0FBQUE7O0FBQ1IsVUFBSUMsYUFBYSxvQ0FBa0IsS0FBS0MsS0FBTCxDQUFXQyxJQUE3QixDQUFqQjtBQUNBLFVBQUlDLGtCQUFrQiwwQ0FDcEIsS0FBS0YsS0FBTCxDQUFXQyxJQUFYLENBQWdCRSxJQURJLEVBRXBCLEtBQUtILEtBQUwsQ0FBV0ksU0FGUyxFQUdwQixLQUFLSixLQUFMLENBQVdLLGVBSFMsRUFJcEIsS0FBS0wsS0FBTCxDQUFXTSxrQkFKUyxFQUtwQixLQUFLTixLQUFMLENBQVdPLFNBTFMsRUFNcEIsS0FBS1AsS0FBTCxDQUFXUSxZQU5TLEVBT3BCLEtBQUtSLEtBQUwsQ0FBV1MsWUFQUyxFQVFwQixLQUFLVCxLQUFMLENBQVdDLElBQVgsQ0FBZ0JTLFFBUkksRUFTcEIsRUFBRUMsV0FBVyxXQUFiLEVBVG9CLENBQXRCO0FBV0EsYUFDRTtBQUFBO0FBQUE7QUFDRSxjQUFJWixVQUROO0FBRUUscUJBQVUsMEJBRlo7QUFHRSxpQkFBTztBQUNMYSxvQkFBUSxLQUFLWixLQUFMLENBQVdhLFNBQVgsR0FBdUIsQ0FEMUI7QUFFTEMsbUJBQU8sS0FBS2QsS0FBTCxDQUFXZSxjQUZiO0FBR0xDLHNCQUFVLFVBSEw7QUFJTEMscUJBQVM7QUFKSixXQUhUO0FBU0UsbUJBQVMsbUJBQU07QUFDYixtQkFBS2pCLEtBQUwsQ0FBV2tCLE1BQVgsQ0FBa0JDLFFBQWxCLENBQTJCO0FBQ3pCQyw0QkFBYyxJQURXO0FBRXpCQyw2QkFBZSxPQUFLckIsS0FBTCxDQUFXQztBQUZELGFBQTNCO0FBSUQsV0FkSDtBQWVFLHlCQUFlLHlCQUFNO0FBQ25CLG1CQUFLRCxLQUFMLENBQVdrQixNQUFYLENBQWtCQyxRQUFsQixDQUEyQjtBQUN6QkUsNkJBQWUsT0FBS3JCLEtBQUwsQ0FBV0MsSUFERDtBQUV6Qm1CLDRCQUFjLE9BQUtwQixLQUFMLENBQVdDO0FBRkEsYUFBM0I7QUFJRCxXQXBCSDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFxQkU7QUFBQTtBQUFBO0FBQ0UsdUJBQVUsZ0NBRFo7QUFFRSxtQkFBTyxpQkFBT3FCLE1BQVAsQ0FBYztBQUNuQk4sd0JBQVUsVUFEUztBQUVuQkMsdUJBQVMsTUFGVTtBQUduQk0scUJBQU8sYUFIWTtBQUluQkMsMEJBQVksV0FBVyxxQkFBTSx5QkFBUUMsSUFBZCxFQUFvQkMsSUFBcEIsQ0FBeUIsR0FBekIsQ0FKSixFQUltQztBQUN0REMsd0JBQVUsRUFMUztBQU1uQmYsc0JBQVEsS0FBS1osS0FBTCxDQUFXYSxTQUFYLEdBQXVCLENBTlo7QUFPbkJlLDJCQUFhLENBUE07QUFRbkJDLDBCQUFZLENBUk87QUFTbkJDLHNCQUFRLElBVFc7QUFVbkJDLDRCQUFjLEVBVks7QUFXbkJDLDBCQUFZLE1BWE87QUFZbkJDLG1DQUFxQixDQVpGO0FBYW5CQyxzQ0FBd0IsQ0FiTDtBQWNuQkMsd0JBQVUsRUFkUztBQWVuQkMsc0JBQVEsZUFBZSx5QkFBUUMsV0FmWjtBQWdCbkJDLCtCQUFpQix5QkFBUUMsVUFoQk47QUFpQm5CQyx3QkFBVSxRQWpCUztBQWtCbkJDLDBCQUFZLFNBbEJPO0FBbUJuQkMsc0JBQVE7QUFuQlcsYUFBZCxFQW9CSiw4QkFBWSxLQUFLMUMsS0FBTCxDQUFXcUIsYUFBdkIsRUFBc0MsS0FBS3JCLEtBQUwsQ0FBV0MsSUFBakQsS0FBMEQ7QUFDM0RtQyxzQkFBUSxlQUFlLHFCQUFNLHlCQUFRTyxhQUFkLEVBQTZCakIsSUFBN0IsQ0FBa0MsR0FBbEMsQ0FEb0M7QUFFM0RJLHNCQUFRO0FBRm1ELGFBcEJ0RCxDQUZUO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQTBCRzVCLDBCQUFnQjBDO0FBMUJuQjtBQXJCRixPQURGO0FBb0REOzs7O0VBdEU2QyxnQkFBTUMsUzs7a0JBQWpDaEQsa0IiLCJmaWxlIjoiUHJvcGVydHlJbnB1dEZpZWxkLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IGxvZGFzaCBmcm9tICdsb2Rhc2gnXG5pbXBvcnQgQ29sb3IgZnJvbSAnY29sb3InXG5pbXBvcnQgUGFsZXR0ZSBmcm9tICcuL0RlZmF1bHRQYWxldHRlJ1xuaW1wb3J0IGdldFByb3BlcnR5VmFsdWVEZXNjcmlwdG9yIGZyb20gJy4vaGVscGVycy9nZXRQcm9wZXJ0eVZhbHVlRGVzY3JpcHRvcidcbmltcG9ydCB7IGdldEl0ZW1Qcm9wZXJ0eUlkLCBpc0l0ZW1FcXVhbCB9IGZyb20gJy4vaGVscGVycy9JdGVtSGVscGVycydcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUHJvcGVydHlJbnB1dEZpZWxkIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc2hvdWxkQ29tcG9uZW50VXBkYXRlIChuZXh0UHJvcHMpIHtcbiAgICByZXR1cm4gdHJ1ZVxuICB9XG5cbiAgcmVuZGVyICgpIHtcbiAgICBsZXQgcHJvcGVydHlJZCA9IGdldEl0ZW1Qcm9wZXJ0eUlkKHRoaXMucHJvcHMuaXRlbSlcbiAgICBsZXQgdmFsdWVEZXNjcmlwdG9yID0gZ2V0UHJvcGVydHlWYWx1ZURlc2NyaXB0b3IoXG4gICAgICB0aGlzLnByb3BzLml0ZW0ubm9kZSxcbiAgICAgIHRoaXMucHJvcHMuZnJhbWVJbmZvLFxuICAgICAgdGhpcy5wcm9wcy5yZWlmaWVkQnl0ZWNvZGUsXG4gICAgICB0aGlzLnByb3BzLnNlcmlhbGl6ZWRCeXRlY29kZSxcbiAgICAgIHRoaXMucHJvcHMuY29tcG9uZW50LFxuICAgICAgdGhpcy5wcm9wcy50aW1lbGluZVRpbWUsXG4gICAgICB0aGlzLnByb3BzLnRpbWVsaW5lTmFtZSxcbiAgICAgIHRoaXMucHJvcHMuaXRlbS5wcm9wZXJ0eSxcbiAgICAgIHsgbnVtRm9ybWF0OiAnMCwwWy5dMDAwJyB9XG4gICAgKVxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2XG4gICAgICAgIGlkPXtwcm9wZXJ0eUlkfVxuICAgICAgICBjbGFzc05hbWU9J3Byb3BlcnR5LWlucHV0LWZpZWxkLWJveCdcbiAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICBoZWlnaHQ6IHRoaXMucHJvcHMucm93SGVpZ2h0IC0gMSxcbiAgICAgICAgICB3aWR0aDogdGhpcy5wcm9wcy5pbnB1dENlbGxXaWR0aCxcbiAgICAgICAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJyxcbiAgICAgICAgICBvdXRsaW5lOiAnbm9uZSdcbiAgICAgICAgfX1cbiAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgIHRoaXMucHJvcHMucGFyZW50LnNldFN0YXRlKHtcbiAgICAgICAgICAgIGlucHV0Rm9jdXNlZDogbnVsbCxcbiAgICAgICAgICAgIGlucHV0U2VsZWN0ZWQ6IHRoaXMucHJvcHMuaXRlbVxuICAgICAgICAgIH0pXG4gICAgICAgIH19XG4gICAgICAgIG9uRG91YmxlQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICB0aGlzLnByb3BzLnBhcmVudC5zZXRTdGF0ZSh7XG4gICAgICAgICAgICBpbnB1dFNlbGVjdGVkOiB0aGlzLnByb3BzLml0ZW0sXG4gICAgICAgICAgICBpbnB1dEZvY3VzZWQ6IHRoaXMucHJvcHMuaXRlbVxuICAgICAgICAgIH0pXG4gICAgICAgIH19PlxuICAgICAgICA8ZGl2XG4gICAgICAgICAgY2xhc3NOYW1lPSdwcm9wZXJ0eS1pbnB1dC1maWVsZCBuby1zZWxlY3QnXG4gICAgICAgICAgc3R5bGU9e2xvZGFzaC5hc3NpZ24oe1xuICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICBvdXRsaW5lOiAnbm9uZScsXG4gICAgICAgICAgICBjb2xvcjogJ3RyYW5zcGFyZW50JyxcbiAgICAgICAgICAgIHRleHRTaGFkb3c6ICcwIDAgMCAnICsgQ29sb3IoUGFsZXR0ZS5ST0NLKS5mYWRlKDAuMyksIC8vIGRhcmttYWdpY1xuICAgICAgICAgICAgbWluV2lkdGg6IDgzLFxuICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLnByb3BzLnJvd0hlaWdodCArIDEsXG4gICAgICAgICAgICBwYWRkaW5nTGVmdDogNyxcbiAgICAgICAgICAgIHBhZGRpbmdUb3A6IDMsXG4gICAgICAgICAgICB6SW5kZXg6IDEwMDQsXG4gICAgICAgICAgICBwYWRkaW5nUmlnaHQ6IDE1LFxuICAgICAgICAgICAgbGluZUhlaWdodDogJzIwcHgnLFxuICAgICAgICAgICAgYm9yZGVyVG9wTGVmdFJhZGl1czogNCxcbiAgICAgICAgICAgIGJvcmRlckJvdHRvbUxlZnRSYWRpdXM6IDQsXG4gICAgICAgICAgICBmb250U2l6ZTogMTMsXG4gICAgICAgICAgICBib3JkZXI6ICcxcHggc29saWQgJyArIFBhbGV0dGUuREFSS0VSX0dSQVksXG4gICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuTElHSFRfR1JBWSxcbiAgICAgICAgICAgIG92ZXJmbG93OiAnaGlkZGVuJyxcbiAgICAgICAgICAgIGZvbnRGYW1pbHk6ICdpbmhlcml0JyxcbiAgICAgICAgICAgIGN1cnNvcjogJ2RlZmF1bHQnXG4gICAgICAgICAgfSwgaXNJdGVtRXF1YWwodGhpcy5wcm9wcy5pbnB1dFNlbGVjdGVkLCB0aGlzLnByb3BzLml0ZW0pICYmIHtcbiAgICAgICAgICAgIGJvcmRlcjogJzFweCBzb2xpZCAnICsgQ29sb3IoUGFsZXR0ZS5MSUdIVEVTVF9QSU5LKS5mYWRlKDAuMiksXG4gICAgICAgICAgICB6SW5kZXg6IDIwMDVcbiAgICAgICAgICB9KX0+XG4gICAgICAgICAge3ZhbHVlRGVzY3JpcHRvci5wcmV0dHlWYWx1ZX1cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cbn1cbiJdfQ==