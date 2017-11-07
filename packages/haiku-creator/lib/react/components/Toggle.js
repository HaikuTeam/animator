'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _jsxFileName = 'src/react/components/Toggle.js';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _radium = require('radium');

var _radium2 = _interopRequireDefault(_radium);

var _Palette = require('./Palette');

var _Palette2 = _interopRequireDefault(_Palette);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var STYLES = {
  wrapper: {
    display: 'inline-block',
    marginTop: 4
  },
  checkBox: {
    display: 'none'
  },
  btn: {
    outline: '0',
    display: 'inline-block',
    width: '2.2em',
    height: '1.2em',
    position: 'relative',
    cursor: 'pointer',
    userSelect: 'none',
    background: _Palette2.default.DARKER_GRAY,
    borderRadius: '2em',
    padding: '2px',
    transition: 'all .4s ease',
    marginLeft: '15px'
  },
  btnAfter: {
    position: 'relative',
    display: 'block',
    width: '50%',
    height: '100%',
    left: 0,
    borderRadius: '50%',
    background: 'white',
    transition: 'all .2s ease'
  },
  btnChecked: {
    background: _Palette2.default.LIGHTEST_PINK
  },
  btnAfterChecked: {
    left: '50%'
  }
};

var Toggle = function (_React$Component) {
  _inherits(Toggle, _React$Component);

  function Toggle() {
    _classCallCheck(this, Toggle);

    var _this = _possibleConstructorReturn(this, (Toggle.__proto__ || Object.getPrototypeOf(Toggle)).call(this));

    _this.onToggle = _this.onToggle.bind(_this);
    _this.state = {
      checked: false
    };
    return _this;
  }

  _createClass(Toggle, [{
    key: 'onToggle',
    value: function onToggle() {
      this.setState({ checked: !this.state.checked });

      if (typeof this.props.onToggle === 'function') {
        this.props.onToggle(this.state.checked);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        { style: [this.props.style, STYLES.wrapper], __source: {
            fileName: _jsxFileName,
            lineNumber: 64
          },
          __self: this
        },
        this.props.hintText && _react2.default.createElement(
          'span',
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 66
            },
            __self: this
          },
          this.props.hintText,
          ' ',
          this.state.checked ? 'on' : 'off'
        ),
        _react2.default.createElement('input', {
          id: 'toggle',
          type: 'checkbox',
          checked: this.state.checked,
          onChange: this.onToggle,
          style: STYLES.checkBox,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 70
          },
          __self: this
        }),
        _react2.default.createElement(
          'label',
          {
            htmlFor: 'toggle',
            style: [STYLES.btn, this.state.checked ? STYLES.btnChecked : {}],
            __source: {
              fileName: _jsxFileName,
              lineNumber: 77
            },
            __self: this
          },
          _react2.default.createElement('span', {
            style: [STYLES.btnAfter, this.state.checked ? STYLES.btnAfterChecked : {}],
            __source: {
              fileName: _jsxFileName,
              lineNumber: 81
            },
            __self: this
          })
        )
      );
    }
  }]);

  return Toggle;
}(_react2.default.Component);

exports.default = (0, _radium2.default)(Toggle);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9yZWFjdC9jb21wb25lbnRzL1RvZ2dsZS5qcyJdLCJuYW1lcyI6WyJTVFlMRVMiLCJ3cmFwcGVyIiwiZGlzcGxheSIsIm1hcmdpblRvcCIsImNoZWNrQm94IiwiYnRuIiwib3V0bGluZSIsIndpZHRoIiwiaGVpZ2h0IiwicG9zaXRpb24iLCJjdXJzb3IiLCJ1c2VyU2VsZWN0IiwiYmFja2dyb3VuZCIsIkRBUktFUl9HUkFZIiwiYm9yZGVyUmFkaXVzIiwicGFkZGluZyIsInRyYW5zaXRpb24iLCJtYXJnaW5MZWZ0IiwiYnRuQWZ0ZXIiLCJsZWZ0IiwiYnRuQ2hlY2tlZCIsIkxJR0hURVNUX1BJTksiLCJidG5BZnRlckNoZWNrZWQiLCJUb2dnbGUiLCJvblRvZ2dsZSIsImJpbmQiLCJzdGF0ZSIsImNoZWNrZWQiLCJzZXRTdGF0ZSIsInByb3BzIiwic3R5bGUiLCJoaW50VGV4dCIsIkNvbXBvbmVudCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7Ozs7QUFFQSxJQUFNQSxTQUFTO0FBQ2JDLFdBQVM7QUFDUEMsYUFBUyxjQURGO0FBRVBDLGVBQVc7QUFGSixHQURJO0FBS2JDLFlBQVU7QUFDUkYsYUFBUztBQURELEdBTEc7QUFRYkcsT0FBSztBQUNIQyxhQUFTLEdBRE47QUFFSEosYUFBUyxjQUZOO0FBR0hLLFdBQU8sT0FISjtBQUlIQyxZQUFRLE9BSkw7QUFLSEMsY0FBVSxVQUxQO0FBTUhDLFlBQVEsU0FOTDtBQU9IQyxnQkFBWSxNQVBUO0FBUUhDLGdCQUFZLGtCQUFRQyxXQVJqQjtBQVNIQyxrQkFBYyxLQVRYO0FBVUhDLGFBQVMsS0FWTjtBQVdIQyxnQkFBWSxjQVhUO0FBWUhDLGdCQUFZO0FBWlQsR0FSUTtBQXNCYkMsWUFBVTtBQUNSVCxjQUFVLFVBREY7QUFFUlAsYUFBUyxPQUZEO0FBR1JLLFdBQU8sS0FIQztBQUlSQyxZQUFRLE1BSkE7QUFLUlcsVUFBTSxDQUxFO0FBTVJMLGtCQUFjLEtBTk47QUFPUkYsZ0JBQVksT0FQSjtBQVFSSSxnQkFBWTtBQVJKLEdBdEJHO0FBZ0NiSSxjQUFZO0FBQ1ZSLGdCQUFZLGtCQUFRUztBQURWLEdBaENDO0FBbUNiQyxtQkFBaUI7QUFDZkgsVUFBTTtBQURTO0FBbkNKLENBQWY7O0lBd0NNSSxNOzs7QUFDSixvQkFBZTtBQUFBOztBQUFBOztBQUViLFVBQUtDLFFBQUwsR0FBZ0IsTUFBS0EsUUFBTCxDQUFjQyxJQUFkLE9BQWhCO0FBQ0EsVUFBS0MsS0FBTCxHQUFhO0FBQ1hDLGVBQVM7QUFERSxLQUFiO0FBSGE7QUFNZDs7OzsrQkFFVztBQUNWLFdBQUtDLFFBQUwsQ0FBYyxFQUFDRCxTQUFTLENBQUMsS0FBS0QsS0FBTCxDQUFXQyxPQUF0QixFQUFkOztBQUVBLFVBQUksT0FBTyxLQUFLRSxLQUFMLENBQVdMLFFBQWxCLEtBQStCLFVBQW5DLEVBQStDO0FBQzdDLGFBQUtLLEtBQUwsQ0FBV0wsUUFBWCxDQUFvQixLQUFLRSxLQUFMLENBQVdDLE9BQS9CO0FBQ0Q7QUFDRjs7OzZCQUVTO0FBQ1IsYUFDRTtBQUFBO0FBQUEsVUFBSyxPQUFPLENBQUMsS0FBS0UsS0FBTCxDQUFXQyxLQUFaLEVBQW1COUIsT0FBT0MsT0FBMUIsQ0FBWjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDRyxhQUFLNEIsS0FBTCxDQUFXRSxRQUFYLElBQ0M7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0csZUFBS0YsS0FBTCxDQUFXRSxRQURkO0FBQUE7QUFDeUIsZUFBS0wsS0FBTCxDQUFXQyxPQUFYLEdBQXFCLElBQXJCLEdBQTRCO0FBRHJELFNBRko7QUFNRTtBQUNFLGNBQUcsUUFETDtBQUVFLGdCQUFLLFVBRlA7QUFHRSxtQkFBUyxLQUFLRCxLQUFMLENBQVdDLE9BSHRCO0FBSUUsb0JBQVUsS0FBS0gsUUFKakI7QUFLRSxpQkFBT3hCLE9BQU9JLFFBTGhCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFVBTkY7QUFhRTtBQUFBO0FBQUE7QUFDRSxxQkFBUSxRQURWO0FBRUUsbUJBQU8sQ0FBQ0osT0FBT0ssR0FBUixFQUFhLEtBQUtxQixLQUFMLENBQVdDLE9BQVgsR0FBcUIzQixPQUFPb0IsVUFBNUIsR0FBeUMsRUFBdEQsQ0FGVDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUlFO0FBQ0UsbUJBQU8sQ0FDTHBCLE9BQU9rQixRQURGLEVBRUwsS0FBS1EsS0FBTCxDQUFXQyxPQUFYLEdBQXFCM0IsT0FBT3NCLGVBQTVCLEdBQThDLEVBRnpDLENBRFQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFKRjtBQWJGLE9BREY7QUEyQkQ7Ozs7RUE3Q2tCLGdCQUFNVSxTOztrQkFnRFosc0JBQU9ULE1BQVAsQyIsImZpbGUiOiJUb2dnbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgUmFkaXVtIGZyb20gJ3JhZGl1bSdcbmltcG9ydCBQYWxldHRlIGZyb20gJy4vUGFsZXR0ZSdcblxuY29uc3QgU1RZTEVTID0ge1xuICB3cmFwcGVyOiB7XG4gICAgZGlzcGxheTogJ2lubGluZS1ibG9jaycsXG4gICAgbWFyZ2luVG9wOiA0XG4gIH0sXG4gIGNoZWNrQm94OiB7XG4gICAgZGlzcGxheTogJ25vbmUnXG4gIH0sXG4gIGJ0bjoge1xuICAgIG91dGxpbmU6ICcwJyxcbiAgICBkaXNwbGF5OiAnaW5saW5lLWJsb2NrJyxcbiAgICB3aWR0aDogJzIuMmVtJyxcbiAgICBoZWlnaHQ6ICcxLjJlbScsXG4gICAgcG9zaXRpb246ICdyZWxhdGl2ZScsXG4gICAgY3Vyc29yOiAncG9pbnRlcicsXG4gICAgdXNlclNlbGVjdDogJ25vbmUnLFxuICAgIGJhY2tncm91bmQ6IFBhbGV0dGUuREFSS0VSX0dSQVksXG4gICAgYm9yZGVyUmFkaXVzOiAnMmVtJyxcbiAgICBwYWRkaW5nOiAnMnB4JyxcbiAgICB0cmFuc2l0aW9uOiAnYWxsIC40cyBlYXNlJyxcbiAgICBtYXJnaW5MZWZ0OiAnMTVweCdcbiAgfSxcbiAgYnRuQWZ0ZXI6IHtcbiAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJyxcbiAgICBkaXNwbGF5OiAnYmxvY2snLFxuICAgIHdpZHRoOiAnNTAlJyxcbiAgICBoZWlnaHQ6ICcxMDAlJyxcbiAgICBsZWZ0OiAwLFxuICAgIGJvcmRlclJhZGl1czogJzUwJScsXG4gICAgYmFja2dyb3VuZDogJ3doaXRlJyxcbiAgICB0cmFuc2l0aW9uOiAnYWxsIC4ycyBlYXNlJ1xuICB9LFxuICBidG5DaGVja2VkOiB7XG4gICAgYmFja2dyb3VuZDogUGFsZXR0ZS5MSUdIVEVTVF9QSU5LXG4gIH0sXG4gIGJ0bkFmdGVyQ2hlY2tlZDoge1xuICAgIGxlZnQ6ICc1MCUnXG4gIH1cbn1cblxuY2xhc3MgVG9nZ2xlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IgKCkge1xuICAgIHN1cGVyKClcbiAgICB0aGlzLm9uVG9nZ2xlID0gdGhpcy5vblRvZ2dsZS5iaW5kKHRoaXMpXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIGNoZWNrZWQ6IGZhbHNlXG4gICAgfVxuICB9XG5cbiAgb25Ub2dnbGUgKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe2NoZWNrZWQ6ICF0aGlzLnN0YXRlLmNoZWNrZWR9KVxuXG4gICAgaWYgKHR5cGVvZiB0aGlzLnByb3BzLm9uVG9nZ2xlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICB0aGlzLnByb3BzLm9uVG9nZ2xlKHRoaXMuc3RhdGUuY2hlY2tlZClcbiAgICB9XG4gIH1cblxuICByZW5kZXIgKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IHN0eWxlPXtbdGhpcy5wcm9wcy5zdHlsZSwgU1RZTEVTLndyYXBwZXJdfT5cbiAgICAgICAge3RoaXMucHJvcHMuaGludFRleHQgJiYgKFxuICAgICAgICAgIDxzcGFuPlxuICAgICAgICAgICAge3RoaXMucHJvcHMuaGludFRleHR9IHt0aGlzLnN0YXRlLmNoZWNrZWQgPyAnb24nIDogJ29mZid9XG4gICAgICAgICAgPC9zcGFuPlxuICAgICAgICApfVxuICAgICAgICA8aW5wdXRcbiAgICAgICAgICBpZD0ndG9nZ2xlJ1xuICAgICAgICAgIHR5cGU9J2NoZWNrYm94J1xuICAgICAgICAgIGNoZWNrZWQ9e3RoaXMuc3RhdGUuY2hlY2tlZH1cbiAgICAgICAgICBvbkNoYW5nZT17dGhpcy5vblRvZ2dsZX1cbiAgICAgICAgICBzdHlsZT17U1RZTEVTLmNoZWNrQm94fVxuICAgICAgICAvPlxuICAgICAgICA8bGFiZWxcbiAgICAgICAgICBodG1sRm9yPSd0b2dnbGUnXG4gICAgICAgICAgc3R5bGU9e1tTVFlMRVMuYnRuLCB0aGlzLnN0YXRlLmNoZWNrZWQgPyBTVFlMRVMuYnRuQ2hlY2tlZCA6IHt9XX1cbiAgICAgICAgPlxuICAgICAgICAgIDxzcGFuXG4gICAgICAgICAgICBzdHlsZT17W1xuICAgICAgICAgICAgICBTVFlMRVMuYnRuQWZ0ZXIsXG4gICAgICAgICAgICAgIHRoaXMuc3RhdGUuY2hlY2tlZCA/IFNUWUxFUy5idG5BZnRlckNoZWNrZWQgOiB7fVxuICAgICAgICAgICAgXX1cbiAgICAgICAgICAvPlxuICAgICAgICA8L2xhYmVsPlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFJhZGl1bShUb2dnbGUpXG4iXX0=