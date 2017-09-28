'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _jsxFileName = 'src/react/components/Tour/Steps/Welcome.js';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var STYLES = {
  input: {
    marginRight: 10
  },
  buttons: {
    marginTop: '30px',
    display: 'flex',
    justifyContent: 'space-between'
  }
};

var Welcome = function (_React$Component) {
  _inherits(Welcome, _React$Component);

  function Welcome() {
    _classCallCheck(this, Welcome);

    var _this = _possibleConstructorReturn(this, (Welcome.__proto__ || Object.getPrototypeOf(Welcome)).call(this));

    _this.handleFinish = _this.handleFinish.bind(_this);
    return _this;
  }

  _createClass(Welcome, [{
    key: 'handleFinish',
    value: function handleFinish() {
      var createFile = this.checkInput.checked;

      this.props.finish(createFile);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          styles = _props.styles,
          next = _props.next;


      return _react2.default.createElement(
        'div',
        {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 31
          },
          __self: this
        },
        _react2.default.createElement(
          'h2',
          { style: styles.heading, __source: {
              fileName: _jsxFileName,
              lineNumber: 32
            },
            __self: this
          },
          'Welcome to Haiku'
        ),
        _react2.default.createElement(
          'p',
          { style: styles.text, __source: {
              fileName: _jsxFileName,
              lineNumber: 33
            },
            __self: this
          },
          'Would you like to take the guided tour?'
        ),
        _react2.default.createElement(
          'form',
          { action: '#', __source: {
              fileName: _jsxFileName,
              lineNumber: 34
            },
            __self: this
          },
          _react2.default.createElement('input', {
            type: 'checkbox',
            name: 'not-show-again',
            id: 'not-show-again',
            style: STYLES.input,
            ref: function ref(input) {
              _this2.checkInput = input;
            }, __source: {
              fileName: _jsxFileName,
              lineNumber: 35
            },
            __self: this
          }),
          _react2.default.createElement(
            'label',
            { htmlFor: 'not-show-again', __source: {
                fileName: _jsxFileName,
                lineNumber: 41
              },
              __self: this
            },
            'Don\'t show this again.'
          )
        ),
        _react2.default.createElement(
          'div',
          { style: STYLES.buttons, __source: {
              fileName: _jsxFileName,
              lineNumber: 43
            },
            __self: this
          },
          _react2.default.createElement(
            'button',
            { style: styles.btn, onClick: next, __source: {
                fileName: _jsxFileName,
                lineNumber: 44
              },
              __self: this
            },
            'Yes, please'
          ),
          _react2.default.createElement(
            'button',
            { style: styles.btnSecondary, onClick: this.handleFinish, __source: {
                fileName: _jsxFileName,
                lineNumber: 45
              },
              __self: this
            },
            'Not now'
          )
        )
      );
    }
  }]);

  return Welcome;
}(_react2.default.Component);

exports.default = Welcome;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9yZWFjdC9jb21wb25lbnRzL1RvdXIvU3RlcHMvV2VsY29tZS5qcyJdLCJuYW1lcyI6WyJTVFlMRVMiLCJpbnB1dCIsIm1hcmdpblJpZ2h0IiwiYnV0dG9ucyIsIm1hcmdpblRvcCIsImRpc3BsYXkiLCJqdXN0aWZ5Q29udGVudCIsIldlbGNvbWUiLCJoYW5kbGVGaW5pc2giLCJiaW5kIiwiY3JlYXRlRmlsZSIsImNoZWNrSW5wdXQiLCJjaGVja2VkIiwicHJvcHMiLCJmaW5pc2giLCJzdHlsZXMiLCJuZXh0IiwiaGVhZGluZyIsInRleHQiLCJidG4iLCJidG5TZWNvbmRhcnkiLCJDb21wb25lbnQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7QUFFQSxJQUFNQSxTQUFTO0FBQ2JDLFNBQU87QUFDTEMsaUJBQWE7QUFEUixHQURNO0FBSWJDLFdBQVM7QUFDUEMsZUFBVyxNQURKO0FBRVBDLGFBQVMsTUFGRjtBQUdQQyxvQkFBZ0I7QUFIVDtBQUpJLENBQWY7O0lBV3FCQyxPOzs7QUFDbkIscUJBQWU7QUFBQTs7QUFBQTs7QUFHYixVQUFLQyxZQUFMLEdBQW9CLE1BQUtBLFlBQUwsQ0FBa0JDLElBQWxCLE9BQXBCO0FBSGE7QUFJZDs7OzttQ0FFZTtBQUNkLFVBQU1DLGFBQWEsS0FBS0MsVUFBTCxDQUFnQkMsT0FBbkM7O0FBRUEsV0FBS0MsS0FBTCxDQUFXQyxNQUFYLENBQWtCSixVQUFsQjtBQUNEOzs7NkJBRVM7QUFBQTs7QUFBQSxtQkFDaUIsS0FBS0csS0FEdEI7QUFBQSxVQUNBRSxNQURBLFVBQ0FBLE1BREE7QUFBQSxVQUNRQyxJQURSLFVBQ1FBLElBRFI7OztBQUdSLGFBQ0U7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0U7QUFBQTtBQUFBLFlBQUksT0FBT0QsT0FBT0UsT0FBbEI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxTQURGO0FBRUU7QUFBQTtBQUFBLFlBQUcsT0FBT0YsT0FBT0csSUFBakI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxTQUZGO0FBR0U7QUFBQTtBQUFBLFlBQU0sUUFBTyxHQUFiO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNFO0FBQ0Usa0JBQUssVUFEUDtBQUVFLGtCQUFLLGdCQUZQO0FBR0UsZ0JBQUcsZ0JBSEw7QUFJRSxtQkFBT2xCLE9BQU9DLEtBSmhCO0FBS0UsaUJBQUssYUFBQ0EsS0FBRCxFQUFXO0FBQUUscUJBQUtVLFVBQUwsR0FBa0JWLEtBQWxCO0FBQXlCLGFBTDdDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxZQURGO0FBT0U7QUFBQTtBQUFBLGNBQU8sU0FBUSxnQkFBZjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBUEYsU0FIRjtBQVlFO0FBQUE7QUFBQSxZQUFLLE9BQU9ELE9BQU9HLE9BQW5CO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNFO0FBQUE7QUFBQSxjQUFRLE9BQU9ZLE9BQU9JLEdBQXRCLEVBQTJCLFNBQVNILElBQXBDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsV0FERjtBQUVFO0FBQUE7QUFBQSxjQUFRLE9BQU9ELE9BQU9LLFlBQXRCLEVBQW9DLFNBQVMsS0FBS1osWUFBbEQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUZGO0FBWkYsT0FERjtBQW1CRDs7OztFQW5Da0MsZ0JBQU1hLFM7O2tCQUF0QmQsTyIsImZpbGUiOiJXZWxjb21lLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xuXG5jb25zdCBTVFlMRVMgPSB7XG4gIGlucHV0OiB7XG4gICAgbWFyZ2luUmlnaHQ6IDEwXG4gIH0sXG4gIGJ1dHRvbnM6IHtcbiAgICBtYXJnaW5Ub3A6ICczMHB4JyxcbiAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJ1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdlbGNvbWUgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgc3VwZXIoKVxuXG4gICAgdGhpcy5oYW5kbGVGaW5pc2ggPSB0aGlzLmhhbmRsZUZpbmlzaC5iaW5kKHRoaXMpXG4gIH1cblxuICBoYW5kbGVGaW5pc2ggKCkge1xuICAgIGNvbnN0IGNyZWF0ZUZpbGUgPSB0aGlzLmNoZWNrSW5wdXQuY2hlY2tlZFxuXG4gICAgdGhpcy5wcm9wcy5maW5pc2goY3JlYXRlRmlsZSlcbiAgfVxuXG4gIHJlbmRlciAoKSB7XG4gICAgY29uc3QgeyBzdHlsZXMsIG5leHQgfSA9IHRoaXMucHJvcHNcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2PlxuICAgICAgICA8aDIgc3R5bGU9e3N0eWxlcy5oZWFkaW5nfT5XZWxjb21lIHRvIEhhaWt1PC9oMj5cbiAgICAgICAgPHAgc3R5bGU9e3N0eWxlcy50ZXh0fT5Xb3VsZCB5b3UgbGlrZSB0byB0YWtlIHRoZSBndWlkZWQgdG91cj88L3A+XG4gICAgICAgIDxmb3JtIGFjdGlvbj0nIyc+XG4gICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICB0eXBlPSdjaGVja2JveCdcbiAgICAgICAgICAgIG5hbWU9J25vdC1zaG93LWFnYWluJ1xuICAgICAgICAgICAgaWQ9J25vdC1zaG93LWFnYWluJ1xuICAgICAgICAgICAgc3R5bGU9e1NUWUxFUy5pbnB1dH1cbiAgICAgICAgICAgIHJlZj17KGlucHV0KSA9PiB7IHRoaXMuY2hlY2tJbnB1dCA9IGlucHV0IH19IC8+XG4gICAgICAgICAgPGxhYmVsIGh0bWxGb3I9J25vdC1zaG93LWFnYWluJz5Eb24ndCBzaG93IHRoaXMgYWdhaW4uPC9sYWJlbD5cbiAgICAgICAgPC9mb3JtPlxuICAgICAgICA8ZGl2IHN0eWxlPXtTVFlMRVMuYnV0dG9uc30+XG4gICAgICAgICAgPGJ1dHRvbiBzdHlsZT17c3R5bGVzLmJ0bn0gb25DbGljaz17bmV4dH0+WWVzLCBwbGVhc2U8L2J1dHRvbj5cbiAgICAgICAgICA8YnV0dG9uIHN0eWxlPXtzdHlsZXMuYnRuU2Vjb25kYXJ5fSBvbkNsaWNrPXt0aGlzLmhhbmRsZUZpbmlzaH0+Tm90IG5vdzwvYnV0dG9uPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxufVxuIl19