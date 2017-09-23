'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _jsxFileName = 'src/components/ClusterInputField.js';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _DefaultPalette = require('./DefaultPalette');

var _DefaultPalette2 = _interopRequireDefault(_DefaultPalette);

var _getPropertyValueDescriptor = require('./helpers/getPropertyValueDescriptor');

var _getPropertyValueDescriptor2 = _interopRequireDefault(_getPropertyValueDescriptor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ClusterInputField = function (_React$Component) {
  _inherits(ClusterInputField, _React$Component);

  function ClusterInputField() {
    _classCallCheck(this, ClusterInputField);

    return _possibleConstructorReturn(this, (ClusterInputField.__proto__ || Object.getPrototypeOf(ClusterInputField)).apply(this, arguments));
  }

  _createClass(ClusterInputField, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps) {
      return true;
    }
  }, {
    key: 'getClusterValues',
    value: function getClusterValues(node, reifiedBytecode, cluster) {
      var _this2 = this;

      return cluster.map(function (propertyDescriptor) {
        return (0, _getPropertyValueDescriptor2.default)(node, _this2.props.frameInfo, _this2.props.reifiedBytecode, _this2.props.serializedBytecode, _this2.props.component, _this2.props.timelineTime, _this2.props.timelineName, propertyDescriptor);
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var clusterValues = this.getClusterValues(this.props.item.node, this.props.reifiedBytecode, this.props.item.cluster);

      var valueElements = clusterValues.map(function (clusterVal, index) {
        var semi = index === clusterValues.length - 1 ? '' : '; ';
        return _react2.default.createElement(
          'span',
          { key: index, __source: {
              fileName: _jsxFileName,
              lineNumber: 34
            },
            __self: _this3
          },
          clusterVal.prettyValue,
          semi
        );
      });

      return _react2.default.createElement(
        'div',
        {
          className: 'property-cluster-input-field no-select',
          style: {
            width: 83,
            margin: 0,
            color: 'transparent',
            textShadow: '0 0 0 ' + _DefaultPalette2.default.DARK_ROCK,
            backgroundColor: _DefaultPalette2.default.LIGHT_GRAY,
            position: 'relative',
            zIndex: 1004,
            borderTopLeftRadius: 4,
            borderBottomLeftRadius: 4,
            border: '1px solid ' + _DefaultPalette2.default.DARKER_GRAY,
            height: this.props.rowHeight + 1,
            padding: '3px 5px',
            fontSize: 13,
            overflow: 'hidden',
            whiteSpace: 'nowrap'
          }, __source: {
            fileName: _jsxFileName,
            lineNumber: 38
          },
          __self: this
        },
        _react2.default.createElement(
          'span',
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 57
            },
            __self: this
          },
          valueElements
        )
      );
    }
  }]);

  return ClusterInputField;
}(_react2.default.Component);

exports.default = ClusterInputField;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21wb25lbnRzL0NsdXN0ZXJJbnB1dEZpZWxkLmpzIl0sIm5hbWVzIjpbIkNsdXN0ZXJJbnB1dEZpZWxkIiwibmV4dFByb3BzIiwibm9kZSIsInJlaWZpZWRCeXRlY29kZSIsImNsdXN0ZXIiLCJtYXAiLCJwcm9wZXJ0eURlc2NyaXB0b3IiLCJwcm9wcyIsImZyYW1lSW5mbyIsInNlcmlhbGl6ZWRCeXRlY29kZSIsImNvbXBvbmVudCIsInRpbWVsaW5lVGltZSIsInRpbWVsaW5lTmFtZSIsImNsdXN0ZXJWYWx1ZXMiLCJnZXRDbHVzdGVyVmFsdWVzIiwiaXRlbSIsInZhbHVlRWxlbWVudHMiLCJjbHVzdGVyVmFsIiwiaW5kZXgiLCJzZW1pIiwibGVuZ3RoIiwicHJldHR5VmFsdWUiLCJ3aWR0aCIsIm1hcmdpbiIsImNvbG9yIiwidGV4dFNoYWRvdyIsIkRBUktfUk9DSyIsImJhY2tncm91bmRDb2xvciIsIkxJR0hUX0dSQVkiLCJwb3NpdGlvbiIsInpJbmRleCIsImJvcmRlclRvcExlZnRSYWRpdXMiLCJib3JkZXJCb3R0b21MZWZ0UmFkaXVzIiwiYm9yZGVyIiwiREFSS0VSX0dSQVkiLCJoZWlnaHQiLCJyb3dIZWlnaHQiLCJwYWRkaW5nIiwiZm9udFNpemUiLCJvdmVyZmxvdyIsIndoaXRlU3BhY2UiLCJDb21wb25lbnQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7Ozs7O0lBRXFCQSxpQjs7Ozs7Ozs7Ozs7MENBQ0lDLFMsRUFBVztBQUNoQyxhQUFPLElBQVA7QUFDRDs7O3FDQUVpQkMsSSxFQUFNQyxlLEVBQWlCQyxPLEVBQVM7QUFBQTs7QUFDaEQsYUFBT0EsUUFBUUMsR0FBUixDQUFZLFVBQUNDLGtCQUFELEVBQXdCO0FBQ3pDLGVBQU8sMENBQ0xKLElBREssRUFFTCxPQUFLSyxLQUFMLENBQVdDLFNBRk4sRUFHTCxPQUFLRCxLQUFMLENBQVdKLGVBSE4sRUFJTCxPQUFLSSxLQUFMLENBQVdFLGtCQUpOLEVBS0wsT0FBS0YsS0FBTCxDQUFXRyxTQUxOLEVBTUwsT0FBS0gsS0FBTCxDQUFXSSxZQU5OLEVBT0wsT0FBS0osS0FBTCxDQUFXSyxZQVBOLEVBUUxOLGtCQVJLLENBQVA7QUFVRCxPQVhNLENBQVA7QUFZRDs7OzZCQUVTO0FBQUE7O0FBQ1IsVUFBSU8sZ0JBQWdCLEtBQUtDLGdCQUFMLENBQ2xCLEtBQUtQLEtBQUwsQ0FBV1EsSUFBWCxDQUFnQmIsSUFERSxFQUVsQixLQUFLSyxLQUFMLENBQVdKLGVBRk8sRUFHbEIsS0FBS0ksS0FBTCxDQUFXUSxJQUFYLENBQWdCWCxPQUhFLENBQXBCOztBQU1BLFVBQUlZLGdCQUFnQkgsY0FBY1IsR0FBZCxDQUFrQixVQUFDWSxVQUFELEVBQWFDLEtBQWIsRUFBdUI7QUFDM0QsWUFBSUMsT0FBUUQsVUFBV0wsY0FBY08sTUFBZCxHQUF1QixDQUFuQyxHQUF5QyxFQUF6QyxHQUE4QyxJQUF6RDtBQUNBLGVBQU87QUFBQTtBQUFBLFlBQU0sS0FBS0YsS0FBWDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBbUJELHFCQUFXSSxXQUE5QjtBQUEyQ0Y7QUFBM0MsU0FBUDtBQUNELE9BSG1CLENBQXBCOztBQUtBLGFBQ0U7QUFBQTtBQUFBO0FBQ0UscUJBQVUsd0NBRFo7QUFFRSxpQkFBTztBQUNMRyxtQkFBTyxFQURGO0FBRUxDLG9CQUFRLENBRkg7QUFHTEMsbUJBQU8sYUFIRjtBQUlMQyx3QkFBWSxXQUFXLHlCQUFRQyxTQUoxQjtBQUtMQyw2QkFBaUIseUJBQVFDLFVBTHBCO0FBTUxDLHNCQUFVLFVBTkw7QUFPTEMsb0JBQVEsSUFQSDtBQVFMQyxpQ0FBcUIsQ0FSaEI7QUFTTEMsb0NBQXdCLENBVG5CO0FBVUxDLG9CQUFRLGVBQWUseUJBQVFDLFdBVjFCO0FBV0xDLG9CQUFRLEtBQUs1QixLQUFMLENBQVc2QixTQUFYLEdBQXVCLENBWDFCO0FBWUxDLHFCQUFTLFNBWko7QUFhTEMsc0JBQVUsRUFiTDtBQWNMQyxzQkFBVSxRQWRMO0FBZUxDLHdCQUFZO0FBZlAsV0FGVDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFtQkU7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQU94QjtBQUFQO0FBbkJGLE9BREY7QUF1QkQ7Ozs7RUF2RDRDLGdCQUFNeUIsUzs7a0JBQWhDekMsaUIiLCJmaWxlIjoiQ2x1c3RlcklucHV0RmllbGQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgUGFsZXR0ZSBmcm9tICcuL0RlZmF1bHRQYWxldHRlJ1xuaW1wb3J0IGdldFByb3BlcnR5VmFsdWVEZXNjcmlwdG9yIGZyb20gJy4vaGVscGVycy9nZXRQcm9wZXJ0eVZhbHVlRGVzY3JpcHRvcidcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2x1c3RlcklucHV0RmllbGQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzaG91bGRDb21wb25lbnRVcGRhdGUgKG5leHRQcm9wcykge1xuICAgIHJldHVybiB0cnVlXG4gIH1cblxuICBnZXRDbHVzdGVyVmFsdWVzIChub2RlLCByZWlmaWVkQnl0ZWNvZGUsIGNsdXN0ZXIpIHtcbiAgICByZXR1cm4gY2x1c3Rlci5tYXAoKHByb3BlcnR5RGVzY3JpcHRvcikgPT4ge1xuICAgICAgcmV0dXJuIGdldFByb3BlcnR5VmFsdWVEZXNjcmlwdG9yKFxuICAgICAgICBub2RlLFxuICAgICAgICB0aGlzLnByb3BzLmZyYW1lSW5mbyxcbiAgICAgICAgdGhpcy5wcm9wcy5yZWlmaWVkQnl0ZWNvZGUsXG4gICAgICAgIHRoaXMucHJvcHMuc2VyaWFsaXplZEJ5dGVjb2RlLFxuICAgICAgICB0aGlzLnByb3BzLmNvbXBvbmVudCxcbiAgICAgICAgdGhpcy5wcm9wcy50aW1lbGluZVRpbWUsXG4gICAgICAgIHRoaXMucHJvcHMudGltZWxpbmVOYW1lLFxuICAgICAgICBwcm9wZXJ0eURlc2NyaXB0b3JcbiAgICAgIClcbiAgICB9KVxuICB9XG5cbiAgcmVuZGVyICgpIHtcbiAgICBsZXQgY2x1c3RlclZhbHVlcyA9IHRoaXMuZ2V0Q2x1c3RlclZhbHVlcyhcbiAgICAgIHRoaXMucHJvcHMuaXRlbS5ub2RlLFxuICAgICAgdGhpcy5wcm9wcy5yZWlmaWVkQnl0ZWNvZGUsXG4gICAgICB0aGlzLnByb3BzLml0ZW0uY2x1c3RlclxuICAgIClcblxuICAgIGxldCB2YWx1ZUVsZW1lbnRzID0gY2x1c3RlclZhbHVlcy5tYXAoKGNsdXN0ZXJWYWwsIGluZGV4KSA9PiB7XG4gICAgICBsZXQgc2VtaSA9IChpbmRleCA9PT0gKGNsdXN0ZXJWYWx1ZXMubGVuZ3RoIC0gMSkpID8gJycgOiAnOyAnXG4gICAgICByZXR1cm4gPHNwYW4ga2V5PXtpbmRleH0+e2NsdXN0ZXJWYWwucHJldHR5VmFsdWV9e3NlbWl9PC9zcGFuPlxuICAgIH0pXG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdlxuICAgICAgICBjbGFzc05hbWU9J3Byb3BlcnR5LWNsdXN0ZXItaW5wdXQtZmllbGQgbm8tc2VsZWN0J1xuICAgICAgICBzdHlsZT17e1xuICAgICAgICAgIHdpZHRoOiA4MyxcbiAgICAgICAgICBtYXJnaW46IDAsXG4gICAgICAgICAgY29sb3I6ICd0cmFuc3BhcmVudCcsXG4gICAgICAgICAgdGV4dFNoYWRvdzogJzAgMCAwICcgKyBQYWxldHRlLkRBUktfUk9DSyxcbiAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuTElHSFRfR1JBWSxcbiAgICAgICAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJyxcbiAgICAgICAgICB6SW5kZXg6IDEwMDQsXG4gICAgICAgICAgYm9yZGVyVG9wTGVmdFJhZGl1czogNCxcbiAgICAgICAgICBib3JkZXJCb3R0b21MZWZ0UmFkaXVzOiA0LFxuICAgICAgICAgIGJvcmRlcjogJzFweCBzb2xpZCAnICsgUGFsZXR0ZS5EQVJLRVJfR1JBWSxcbiAgICAgICAgICBoZWlnaHQ6IHRoaXMucHJvcHMucm93SGVpZ2h0ICsgMSxcbiAgICAgICAgICBwYWRkaW5nOiAnM3B4IDVweCcsXG4gICAgICAgICAgZm9udFNpemU6IDEzLFxuICAgICAgICAgIG92ZXJmbG93OiAnaGlkZGVuJyxcbiAgICAgICAgICB3aGl0ZVNwYWNlOiAnbm93cmFwJ1xuICAgICAgICB9fT5cbiAgICAgICAgPHNwYW4+e3ZhbHVlRWxlbWVudHN9PC9zcGFuPlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG59XG4iXX0=