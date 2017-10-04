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
              lineNumber: 30
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
            lineNumber: 34
          },
          __self: this
        },
        _react2.default.createElement(
          'span',
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 53
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21wb25lbnRzL0NsdXN0ZXJJbnB1dEZpZWxkLmpzIl0sIm5hbWVzIjpbIkNsdXN0ZXJJbnB1dEZpZWxkIiwibm9kZSIsInJlaWZpZWRCeXRlY29kZSIsImNsdXN0ZXIiLCJtYXAiLCJwcm9wZXJ0eURlc2NyaXB0b3IiLCJwcm9wcyIsImZyYW1lSW5mbyIsInNlcmlhbGl6ZWRCeXRlY29kZSIsImNvbXBvbmVudCIsInRpbWVsaW5lVGltZSIsInRpbWVsaW5lTmFtZSIsImNsdXN0ZXJWYWx1ZXMiLCJnZXRDbHVzdGVyVmFsdWVzIiwiaXRlbSIsInZhbHVlRWxlbWVudHMiLCJjbHVzdGVyVmFsIiwiaW5kZXgiLCJzZW1pIiwibGVuZ3RoIiwicHJldHR5VmFsdWUiLCJ3aWR0aCIsIm1hcmdpbiIsImNvbG9yIiwidGV4dFNoYWRvdyIsIkRBUktfUk9DSyIsImJhY2tncm91bmRDb2xvciIsIkxJR0hUX0dSQVkiLCJwb3NpdGlvbiIsInpJbmRleCIsImJvcmRlclRvcExlZnRSYWRpdXMiLCJib3JkZXJCb3R0b21MZWZ0UmFkaXVzIiwiYm9yZGVyIiwiREFSS0VSX0dSQVkiLCJoZWlnaHQiLCJyb3dIZWlnaHQiLCJwYWRkaW5nIiwiZm9udFNpemUiLCJvdmVyZmxvdyIsIndoaXRlU3BhY2UiLCJDb21wb25lbnQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7Ozs7O0lBRXFCQSxpQjs7Ozs7Ozs7Ozs7cUNBQ0RDLEksRUFBTUMsZSxFQUFpQkMsTyxFQUFTO0FBQUE7O0FBQ2hELGFBQU9BLFFBQVFDLEdBQVIsQ0FBWSxVQUFDQyxrQkFBRCxFQUF3QjtBQUN6QyxlQUFPLDBDQUNMSixJQURLLEVBRUwsT0FBS0ssS0FBTCxDQUFXQyxTQUZOLEVBR0wsT0FBS0QsS0FBTCxDQUFXSixlQUhOLEVBSUwsT0FBS0ksS0FBTCxDQUFXRSxrQkFKTixFQUtMLE9BQUtGLEtBQUwsQ0FBV0csU0FMTixFQU1MLE9BQUtILEtBQUwsQ0FBV0ksWUFOTixFQU9MLE9BQUtKLEtBQUwsQ0FBV0ssWUFQTixFQVFMTixrQkFSSyxDQUFQO0FBVUQsT0FYTSxDQUFQO0FBWUQ7Ozs2QkFFUztBQUFBOztBQUNSLFVBQUlPLGdCQUFnQixLQUFLQyxnQkFBTCxDQUNsQixLQUFLUCxLQUFMLENBQVdRLElBQVgsQ0FBZ0JiLElBREUsRUFFbEIsS0FBS0ssS0FBTCxDQUFXSixlQUZPLEVBR2xCLEtBQUtJLEtBQUwsQ0FBV1EsSUFBWCxDQUFnQlgsT0FIRSxDQUFwQjs7QUFNQSxVQUFJWSxnQkFBZ0JILGNBQWNSLEdBQWQsQ0FBa0IsVUFBQ1ksVUFBRCxFQUFhQyxLQUFiLEVBQXVCO0FBQzNELFlBQUlDLE9BQVFELFVBQVdMLGNBQWNPLE1BQWQsR0FBdUIsQ0FBbkMsR0FBeUMsRUFBekMsR0FBOEMsSUFBekQ7QUFDQSxlQUFPO0FBQUE7QUFBQSxZQUFNLEtBQUtGLEtBQVg7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQW1CRCxxQkFBV0ksV0FBOUI7QUFBMkNGO0FBQTNDLFNBQVA7QUFDRCxPQUhtQixDQUFwQjs7QUFLQSxhQUNFO0FBQUE7QUFBQTtBQUNFLHFCQUFVLHdDQURaO0FBRUUsaUJBQU87QUFDTEcsbUJBQU8sRUFERjtBQUVMQyxvQkFBUSxDQUZIO0FBR0xDLG1CQUFPLGFBSEY7QUFJTEMsd0JBQVksV0FBVyx5QkFBUUMsU0FKMUI7QUFLTEMsNkJBQWlCLHlCQUFRQyxVQUxwQjtBQU1MQyxzQkFBVSxVQU5MO0FBT0xDLG9CQUFRLElBUEg7QUFRTEMsaUNBQXFCLENBUmhCO0FBU0xDLG9DQUF3QixDQVRuQjtBQVVMQyxvQkFBUSxlQUFlLHlCQUFRQyxXQVYxQjtBQVdMQyxvQkFBUSxLQUFLNUIsS0FBTCxDQUFXNkIsU0FBWCxHQUF1QixDQVgxQjtBQVlMQyxxQkFBUyxTQVpKO0FBYUxDLHNCQUFVLEVBYkw7QUFjTEMsc0JBQVUsUUFkTDtBQWVMQyx3QkFBWTtBQWZQLFdBRlQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBbUJFO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFPeEI7QUFBUDtBQW5CRixPQURGO0FBdUJEOzs7O0VBbkQ0QyxnQkFBTXlCLFM7O2tCQUFoQ3hDLGlCIiwiZmlsZSI6IkNsdXN0ZXJJbnB1dEZpZWxkLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IFBhbGV0dGUgZnJvbSAnLi9EZWZhdWx0UGFsZXR0ZSdcbmltcG9ydCBnZXRQcm9wZXJ0eVZhbHVlRGVzY3JpcHRvciBmcm9tICcuL2hlbHBlcnMvZ2V0UHJvcGVydHlWYWx1ZURlc2NyaXB0b3InXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENsdXN0ZXJJbnB1dEZpZWxkIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgZ2V0Q2x1c3RlclZhbHVlcyAobm9kZSwgcmVpZmllZEJ5dGVjb2RlLCBjbHVzdGVyKSB7XG4gICAgcmV0dXJuIGNsdXN0ZXIubWFwKChwcm9wZXJ0eURlc2NyaXB0b3IpID0+IHtcbiAgICAgIHJldHVybiBnZXRQcm9wZXJ0eVZhbHVlRGVzY3JpcHRvcihcbiAgICAgICAgbm9kZSxcbiAgICAgICAgdGhpcy5wcm9wcy5mcmFtZUluZm8sXG4gICAgICAgIHRoaXMucHJvcHMucmVpZmllZEJ5dGVjb2RlLFxuICAgICAgICB0aGlzLnByb3BzLnNlcmlhbGl6ZWRCeXRlY29kZSxcbiAgICAgICAgdGhpcy5wcm9wcy5jb21wb25lbnQsXG4gICAgICAgIHRoaXMucHJvcHMudGltZWxpbmVUaW1lLFxuICAgICAgICB0aGlzLnByb3BzLnRpbWVsaW5lTmFtZSxcbiAgICAgICAgcHJvcGVydHlEZXNjcmlwdG9yXG4gICAgICApXG4gICAgfSlcbiAgfVxuXG4gIHJlbmRlciAoKSB7XG4gICAgbGV0IGNsdXN0ZXJWYWx1ZXMgPSB0aGlzLmdldENsdXN0ZXJWYWx1ZXMoXG4gICAgICB0aGlzLnByb3BzLml0ZW0ubm9kZSxcbiAgICAgIHRoaXMucHJvcHMucmVpZmllZEJ5dGVjb2RlLFxuICAgICAgdGhpcy5wcm9wcy5pdGVtLmNsdXN0ZXJcbiAgICApXG5cbiAgICBsZXQgdmFsdWVFbGVtZW50cyA9IGNsdXN0ZXJWYWx1ZXMubWFwKChjbHVzdGVyVmFsLCBpbmRleCkgPT4ge1xuICAgICAgbGV0IHNlbWkgPSAoaW5kZXggPT09IChjbHVzdGVyVmFsdWVzLmxlbmd0aCAtIDEpKSA/ICcnIDogJzsgJ1xuICAgICAgcmV0dXJuIDxzcGFuIGtleT17aW5kZXh9PntjbHVzdGVyVmFsLnByZXR0eVZhbHVlfXtzZW1pfTwvc3Bhbj5cbiAgICB9KVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXZcbiAgICAgICAgY2xhc3NOYW1lPSdwcm9wZXJ0eS1jbHVzdGVyLWlucHV0LWZpZWxkIG5vLXNlbGVjdCdcbiAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICB3aWR0aDogODMsXG4gICAgICAgICAgbWFyZ2luOiAwLFxuICAgICAgICAgIGNvbG9yOiAndHJhbnNwYXJlbnQnLFxuICAgICAgICAgIHRleHRTaGFkb3c6ICcwIDAgMCAnICsgUGFsZXR0ZS5EQVJLX1JPQ0ssXG4gICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLkxJR0hUX0dSQVksXG4gICAgICAgICAgcG9zaXRpb246ICdyZWxhdGl2ZScsXG4gICAgICAgICAgekluZGV4OiAxMDA0LFxuICAgICAgICAgIGJvcmRlclRvcExlZnRSYWRpdXM6IDQsXG4gICAgICAgICAgYm9yZGVyQm90dG9tTGVmdFJhZGl1czogNCxcbiAgICAgICAgICBib3JkZXI6ICcxcHggc29saWQgJyArIFBhbGV0dGUuREFSS0VSX0dSQVksXG4gICAgICAgICAgaGVpZ2h0OiB0aGlzLnByb3BzLnJvd0hlaWdodCArIDEsXG4gICAgICAgICAgcGFkZGluZzogJzNweCA1cHgnLFxuICAgICAgICAgIGZvbnRTaXplOiAxMyxcbiAgICAgICAgICBvdmVyZmxvdzogJ2hpZGRlbicsXG4gICAgICAgICAgd2hpdGVTcGFjZTogJ25vd3JhcCdcbiAgICAgICAgfX0+XG4gICAgICAgIDxzcGFuPnt2YWx1ZUVsZW1lbnRzfTwvc3Bhbj5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxufVxuIl19