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
            lineNumber: 23
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
              lineNumber: 44
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21wb25lbnRzL1Byb3BlcnR5SW5wdXRGaWVsZC5qcyJdLCJuYW1lcyI6WyJQcm9wZXJ0eUlucHV0RmllbGQiLCJwcm9wZXJ0eUlkIiwicHJvcHMiLCJpdGVtIiwidmFsdWVEZXNjcmlwdG9yIiwibm9kZSIsImZyYW1lSW5mbyIsInJlaWZpZWRCeXRlY29kZSIsInNlcmlhbGl6ZWRCeXRlY29kZSIsImNvbXBvbmVudCIsInRpbWVsaW5lVGltZSIsInRpbWVsaW5lTmFtZSIsInByb3BlcnR5IiwibnVtRm9ybWF0IiwiaGVpZ2h0Iiwicm93SGVpZ2h0Iiwid2lkdGgiLCJpbnB1dENlbGxXaWR0aCIsInBvc2l0aW9uIiwib3V0bGluZSIsInBhcmVudCIsInNldFN0YXRlIiwiaW5wdXRGb2N1c2VkIiwiaW5wdXRTZWxlY3RlZCIsImFzc2lnbiIsImNvbG9yIiwidGV4dFNoYWRvdyIsIlJPQ0siLCJmYWRlIiwibWluV2lkdGgiLCJwYWRkaW5nTGVmdCIsInBhZGRpbmdUb3AiLCJ6SW5kZXgiLCJwYWRkaW5nUmlnaHQiLCJsaW5lSGVpZ2h0IiwiYm9yZGVyVG9wTGVmdFJhZGl1cyIsImJvcmRlckJvdHRvbUxlZnRSYWRpdXMiLCJmb250U2l6ZSIsImJvcmRlciIsIkRBUktFUl9HUkFZIiwiYmFja2dyb3VuZENvbG9yIiwiTElHSFRfR1JBWSIsIm92ZXJmbG93IiwiZm9udEZhbWlseSIsImN1cnNvciIsIkxJR0hURVNUX1BJTksiLCJwcmV0dHlWYWx1ZSIsIkNvbXBvbmVudCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7O0lBRXFCQSxrQjs7Ozs7Ozs7Ozs7NkJBQ1Q7QUFBQTs7QUFDUixVQUFJQyxhQUFhLG9DQUFrQixLQUFLQyxLQUFMLENBQVdDLElBQTdCLENBQWpCO0FBQ0EsVUFBSUMsa0JBQWtCLDBDQUNwQixLQUFLRixLQUFMLENBQVdDLElBQVgsQ0FBZ0JFLElBREksRUFFcEIsS0FBS0gsS0FBTCxDQUFXSSxTQUZTLEVBR3BCLEtBQUtKLEtBQUwsQ0FBV0ssZUFIUyxFQUlwQixLQUFLTCxLQUFMLENBQVdNLGtCQUpTLEVBS3BCLEtBQUtOLEtBQUwsQ0FBV08sU0FMUyxFQU1wQixLQUFLUCxLQUFMLENBQVdRLFlBTlMsRUFPcEIsS0FBS1IsS0FBTCxDQUFXUyxZQVBTLEVBUXBCLEtBQUtULEtBQUwsQ0FBV0MsSUFBWCxDQUFnQlMsUUFSSSxFQVNwQixFQUFFQyxXQUFXLFdBQWIsRUFUb0IsQ0FBdEI7QUFXQSxhQUNFO0FBQUE7QUFBQTtBQUNFLGNBQUlaLFVBRE47QUFFRSxxQkFBVSwwQkFGWjtBQUdFLGlCQUFPO0FBQ0xhLG9CQUFRLEtBQUtaLEtBQUwsQ0FBV2EsU0FBWCxHQUF1QixDQUQxQjtBQUVMQyxtQkFBTyxLQUFLZCxLQUFMLENBQVdlLGNBRmI7QUFHTEMsc0JBQVUsVUFITDtBQUlMQyxxQkFBUztBQUpKLFdBSFQ7QUFTRSxtQkFBUyxtQkFBTTtBQUNiLG1CQUFLakIsS0FBTCxDQUFXa0IsTUFBWCxDQUFrQkMsUUFBbEIsQ0FBMkI7QUFDekJDLDRCQUFjLElBRFc7QUFFekJDLDZCQUFlLE9BQUtyQixLQUFMLENBQVdDO0FBRkQsYUFBM0I7QUFJRCxXQWRIO0FBZUUseUJBQWUseUJBQU07QUFDbkIsbUJBQUtELEtBQUwsQ0FBV2tCLE1BQVgsQ0FBa0JDLFFBQWxCLENBQTJCO0FBQ3pCRSw2QkFBZSxPQUFLckIsS0FBTCxDQUFXQyxJQUREO0FBRXpCbUIsNEJBQWMsT0FBS3BCLEtBQUwsQ0FBV0M7QUFGQSxhQUEzQjtBQUlELFdBcEJIO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQXFCRTtBQUFBO0FBQUE7QUFDRSx1QkFBVSxnQ0FEWjtBQUVFLG1CQUFPLGlCQUFPcUIsTUFBUCxDQUFjO0FBQ25CTix3QkFBVSxVQURTO0FBRW5CQyx1QkFBUyxNQUZVO0FBR25CTSxxQkFBTyxhQUhZO0FBSW5CQywwQkFBWSxXQUFXLHFCQUFNLHlCQUFRQyxJQUFkLEVBQW9CQyxJQUFwQixDQUF5QixHQUF6QixDQUpKLEVBSW1DO0FBQ3REQyx3QkFBVSxFQUxTO0FBTW5CZixzQkFBUSxLQUFLWixLQUFMLENBQVdhLFNBQVgsR0FBdUIsQ0FOWjtBQU9uQmUsMkJBQWEsQ0FQTTtBQVFuQkMsMEJBQVksQ0FSTztBQVNuQkMsc0JBQVEsSUFUVztBQVVuQkMsNEJBQWMsRUFWSztBQVduQkMsMEJBQVksTUFYTztBQVluQkMsbUNBQXFCLENBWkY7QUFhbkJDLHNDQUF3QixDQWJMO0FBY25CQyx3QkFBVSxFQWRTO0FBZW5CQyxzQkFBUSxlQUFlLHlCQUFRQyxXQWZaO0FBZ0JuQkMsK0JBQWlCLHlCQUFRQyxVQWhCTjtBQWlCbkJDLHdCQUFVLFFBakJTO0FBa0JuQkMsMEJBQVksU0FsQk87QUFtQm5CQyxzQkFBUTtBQW5CVyxhQUFkLEVBb0JKLDhCQUFZLEtBQUsxQyxLQUFMLENBQVdxQixhQUF2QixFQUFzQyxLQUFLckIsS0FBTCxDQUFXQyxJQUFqRCxLQUEwRDtBQUMzRG1DLHNCQUFRLGVBQWUscUJBQU0seUJBQVFPLGFBQWQsRUFBNkJqQixJQUE3QixDQUFrQyxHQUFsQyxDQURvQztBQUUzREksc0JBQVE7QUFGbUQsYUFwQnRELENBRlQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBMEJHNUIsMEJBQWdCMEM7QUExQm5CO0FBckJGLE9BREY7QUFvREQ7Ozs7RUFsRTZDLGdCQUFNQyxTOztrQkFBakMvQyxrQiIsImZpbGUiOiJQcm9wZXJ0eUlucHV0RmllbGQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgbG9kYXNoIGZyb20gJ2xvZGFzaCdcbmltcG9ydCBDb2xvciBmcm9tICdjb2xvcidcbmltcG9ydCBQYWxldHRlIGZyb20gJy4vRGVmYXVsdFBhbGV0dGUnXG5pbXBvcnQgZ2V0UHJvcGVydHlWYWx1ZURlc2NyaXB0b3IgZnJvbSAnLi9oZWxwZXJzL2dldFByb3BlcnR5VmFsdWVEZXNjcmlwdG9yJ1xuaW1wb3J0IHsgZ2V0SXRlbVByb3BlcnR5SWQsIGlzSXRlbUVxdWFsIH0gZnJvbSAnLi9oZWxwZXJzL0l0ZW1IZWxwZXJzJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQcm9wZXJ0eUlucHV0RmllbGQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICByZW5kZXIgKCkge1xuICAgIGxldCBwcm9wZXJ0eUlkID0gZ2V0SXRlbVByb3BlcnR5SWQodGhpcy5wcm9wcy5pdGVtKVxuICAgIGxldCB2YWx1ZURlc2NyaXB0b3IgPSBnZXRQcm9wZXJ0eVZhbHVlRGVzY3JpcHRvcihcbiAgICAgIHRoaXMucHJvcHMuaXRlbS5ub2RlLFxuICAgICAgdGhpcy5wcm9wcy5mcmFtZUluZm8sXG4gICAgICB0aGlzLnByb3BzLnJlaWZpZWRCeXRlY29kZSxcbiAgICAgIHRoaXMucHJvcHMuc2VyaWFsaXplZEJ5dGVjb2RlLFxuICAgICAgdGhpcy5wcm9wcy5jb21wb25lbnQsXG4gICAgICB0aGlzLnByb3BzLnRpbWVsaW5lVGltZSxcbiAgICAgIHRoaXMucHJvcHMudGltZWxpbmVOYW1lLFxuICAgICAgdGhpcy5wcm9wcy5pdGVtLnByb3BlcnR5LFxuICAgICAgeyBudW1Gb3JtYXQ6ICcwLDBbLl0wMDAnIH1cbiAgICApXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXZcbiAgICAgICAgaWQ9e3Byb3BlcnR5SWR9XG4gICAgICAgIGNsYXNzTmFtZT0ncHJvcGVydHktaW5wdXQtZmllbGQtYm94J1xuICAgICAgICBzdHlsZT17e1xuICAgICAgICAgIGhlaWdodDogdGhpcy5wcm9wcy5yb3dIZWlnaHQgLSAxLFxuICAgICAgICAgIHdpZHRoOiB0aGlzLnByb3BzLmlucHV0Q2VsbFdpZHRoLFxuICAgICAgICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICAgICAgICAgIG91dGxpbmU6ICdub25lJ1xuICAgICAgICB9fVxuICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgdGhpcy5wcm9wcy5wYXJlbnQuc2V0U3RhdGUoe1xuICAgICAgICAgICAgaW5wdXRGb2N1c2VkOiBudWxsLFxuICAgICAgICAgICAgaW5wdXRTZWxlY3RlZDogdGhpcy5wcm9wcy5pdGVtXG4gICAgICAgICAgfSlcbiAgICAgICAgfX1cbiAgICAgICAgb25Eb3VibGVDbGljaz17KCkgPT4ge1xuICAgICAgICAgIHRoaXMucHJvcHMucGFyZW50LnNldFN0YXRlKHtcbiAgICAgICAgICAgIGlucHV0U2VsZWN0ZWQ6IHRoaXMucHJvcHMuaXRlbSxcbiAgICAgICAgICAgIGlucHV0Rm9jdXNlZDogdGhpcy5wcm9wcy5pdGVtXG4gICAgICAgICAgfSlcbiAgICAgICAgfX0+XG4gICAgICAgIDxkaXZcbiAgICAgICAgICBjbGFzc05hbWU9J3Byb3BlcnR5LWlucHV0LWZpZWxkIG5vLXNlbGVjdCdcbiAgICAgICAgICBzdHlsZT17bG9kYXNoLmFzc2lnbih7XG4gICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgIG91dGxpbmU6ICdub25lJyxcbiAgICAgICAgICAgIGNvbG9yOiAndHJhbnNwYXJlbnQnLFxuICAgICAgICAgICAgdGV4dFNoYWRvdzogJzAgMCAwICcgKyBDb2xvcihQYWxldHRlLlJPQ0spLmZhZGUoMC4zKSwgLy8gZGFya21hZ2ljXG4gICAgICAgICAgICBtaW5XaWR0aDogODMsXG4gICAgICAgICAgICBoZWlnaHQ6IHRoaXMucHJvcHMucm93SGVpZ2h0ICsgMSxcbiAgICAgICAgICAgIHBhZGRpbmdMZWZ0OiA3LFxuICAgICAgICAgICAgcGFkZGluZ1RvcDogMyxcbiAgICAgICAgICAgIHpJbmRleDogMTAwNCxcbiAgICAgICAgICAgIHBhZGRpbmdSaWdodDogMTUsXG4gICAgICAgICAgICBsaW5lSGVpZ2h0OiAnMjBweCcsXG4gICAgICAgICAgICBib3JkZXJUb3BMZWZ0UmFkaXVzOiA0LFxuICAgICAgICAgICAgYm9yZGVyQm90dG9tTGVmdFJhZGl1czogNCxcbiAgICAgICAgICAgIGZvbnRTaXplOiAxMyxcbiAgICAgICAgICAgIGJvcmRlcjogJzFweCBzb2xpZCAnICsgUGFsZXR0ZS5EQVJLRVJfR1JBWSxcbiAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5MSUdIVF9HUkFZLFxuICAgICAgICAgICAgb3ZlcmZsb3c6ICdoaWRkZW4nLFxuICAgICAgICAgICAgZm9udEZhbWlseTogJ2luaGVyaXQnLFxuICAgICAgICAgICAgY3Vyc29yOiAnZGVmYXVsdCdcbiAgICAgICAgICB9LCBpc0l0ZW1FcXVhbCh0aGlzLnByb3BzLmlucHV0U2VsZWN0ZWQsIHRoaXMucHJvcHMuaXRlbSkgJiYge1xuICAgICAgICAgICAgYm9yZGVyOiAnMXB4IHNvbGlkICcgKyBDb2xvcihQYWxldHRlLkxJR0hURVNUX1BJTkspLmZhZGUoMC4yKSxcbiAgICAgICAgICAgIHpJbmRleDogMjAwNVxuICAgICAgICAgIH0pfT5cbiAgICAgICAgICB7dmFsdWVEZXNjcmlwdG9yLnByZXR0eVZhbHVlfVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxufVxuIl19