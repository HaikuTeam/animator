'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _jsxFileName = 'src/react/components/AuthenticationUI.js';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _radium = require('radium');

var _radium2 = _interopRequireDefault(_radium);

var _color = require('color');

var _color2 = _interopRequireDefault(_color);

var _reactAnimations = require('react-animations');

var _betterReactSpinkit = require('better-react-spinkit');

var _Palette = require('./Palette');

var _Palette2 = _interopRequireDefault(_Palette);

var _Icons = require('./Icons');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var STYLES = {
  container: {
    width: '100%',
    height: '100vh',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  errorShake: {
    animation: 'x 890ms',
    animationName: _radium2.default.keyframes(_reactAnimations.shake, 'shake')
  },
  formWrap: {
    backgroundColor: _Palette2.default.ROCK,
    width: 375,
    minHeight: 200,
    borderRadius: 7,
    padding: '47px 27px',
    boxShadow: '0 33px 40px 6px rgba(24,0,8,0.21)'
  },
  center: {
    textAlign: 'center'
  },
  title: {
    WebkitUserSelect: 'none',
    cursor: 'default',
    fontSize: 21,
    color: _Palette2.default.MEDIUM_COAL,
    margin: '20px auto 38px auto'
  },
  inputHolster: {
    position: 'relative'
  },
  tooltip: {
    backgroundColor: (0, _color2.default)(_Palette2.default.RED).fade(0.1),
    color: _Palette2.default.ROCK,
    position: 'absolute',
    right: '-170px',
    top: 11,
    padding: '7px 16px',
    fontSize: 13,
    borderRadius: 4
  },
  arrowLeft: {
    width: 0,
    height: 0,
    position: 'absolute',
    left: -8,
    borderTop: '10px solid transparent',
    borderBottom: '10px solid transparent',
    borderRight: '10px solid ' + (0, _color2.default)(_Palette2.default.RED).fade(0.1)
  },
  inputIcon: {
    position: 'absolute',
    right: 24,
    top: 19,
    zIndex: 1
  },
  iconAdjust: {
    right: 25
  },
  input: {
    backgroundColor: '#F5F5F5',
    width: '100%',
    height: 55,
    borderRadius: 5,
    marginBottom: 15,
    border: '1px solid #DEDEDE',
    fontSize: 18,
    padding: '27px',
    ':focus': {
      border: '1px solid ' + _Palette2.default.LIGHT_BLUE
    }
  },
  errorInput: {
    border: '1px solid ' + (0, _color2.default)(_Palette2.default.RED).fade(0.1)
  },
  btn: {
    backgroundImage: 'linear-gradient(90deg, #D72B60 0%, #F0CC0D 100%)',
    borderRadius: 5,
    width: '100%',
    height: 55,
    display: 'flex',
    justifyContent: 'center',
    fontSize: 22,
    letterSpacing: 1.5,
    textAlign: 'center',
    textTransform: 'uppercase',
    color: _Palette2.default.ROCK,
    ':focus': {
      border: '1px solid ' + _Palette2.default.LIGHT_BLUE
    }
  },
  btnDisabled: {
    backgroundImage: 'none',
    backgroundColor: _Palette2.default.DARK_ROCK,
    cursor: 'not-allowed'
  },
  error: {
    backgroundColor: (0, _color2.default)(_Palette2.default.RED).fade(0.5),
    color: _Palette2.default.ROCK,
    width: 'calc(100% + 54px)',
    padding: 20,
    margin: '-27px 0 12px -27px',
    fontSize: 14
  }
};

var AuthenticationUI = function (_React$Component) {
  _inherits(AuthenticationUI, _React$Component);

  function AuthenticationUI(props) {
    _classCallCheck(this, AuthenticationUI);

    var _this = _possibleConstructorReturn(this, (AuthenticationUI.__proto__ || Object.getPrototypeOf(AuthenticationUI)).call(this, props));

    _this.handleUsernameChange = _this.handleUsernameChange.bind(_this);
    _this.handlePasswordChange = _this.handlePasswordChange.bind(_this);
    _this.checkSubmit = _this.checkSubmit.bind(_this);
    _this.handleSubmit = _this.handleSubmit.bind(_this);
    _this.state = {
      error: null,
      isSubmitting: false,
      isSuccess: false,
      username: '',
      password: '',
      emailValid: true
    };
    return _this;
  }

  _createClass(AuthenticationUI, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.refs.email.focus();
    }
  }, {
    key: 'handleUsernameChange',
    value: function handleUsernameChange(changeEvent) {
      return this.setState({ username: changeEvent.target.value });
    }
  }, {
    key: 'handlePasswordChange',
    value: function handlePasswordChange(changeEvent) {
      return this.setState({ password: changeEvent.target.value });
    }
  }, {
    key: 'handleSubmit',
    value: function handleSubmit(submitEvent) {
      var _this2 = this;

      this.setState({ isSubmitting: true, error: null });
      return this.props.onSubmit(this.state.username, this.state.password, function (error) {
        if (error) return _this2.setState({ error: error, isSubmitting: false });
        _this2.setState({ isSubmitting: false, isSuccess: true });
        _this2.props.onSubmitSuccess();
      });
    }
  }, {
    key: 'checkSubmit',
    value: function checkSubmit(e) {
      if (e.charCode === 13) {
        if (validEmail(this.state.username)) {
          this.handleSubmit();
        } else {
          this.setState({ emailValid: false });
        }
      }
    }
  }, {
    key: 'validateIsEmailAddress',
    value: function validateIsEmailAddress() {
      var isEmail = validEmail(this.refs.email.value);
      if (this.refs.email.value === '') isEmail = true; // to avoid showing error state if blank

      isEmail ? this.setState({ emailValid: true }) : this.setState({ emailValid: false });
    }
  }, {
    key: 'usernameElement',
    value: function usernameElement() {
      var _this3 = this;

      return _react2.default.createElement(
        'div',
        { style: STYLES.inputHolster, __source: {
            fileName: _jsxFileName,
            lineNumber: 177
          },
          __self: this
        },
        _react2.default.createElement('input', {
          type: 'text',
          placeholder: 'Email',
          key: 'username',
          ref: 'email',
          value: this.state.username,
          onChange: this.handleUsernameChange,
          onFocus: function onFocus() {
            _this3.setState({ emailValid: true });
          },
          onBlur: function onBlur(e) {
            _this3.validateIsEmailAddress(e);
          },
          disabled: this.state.isSubmitting || this.state.isSuccess,
          onKeyPress: this.checkSubmit,
          style: [STYLES.input, !this.state.emailValid && STYLES.errorInput], __source: {
            fileName: _jsxFileName,
            lineNumber: 178
          },
          __self: this
        }),
        _react2.default.createElement(
          'span',
          { style: STYLES.inputIcon, __source: {
              fileName: _jsxFileName,
              lineNumber: 190
            },
            __self: this
          },
          _react2.default.createElement(_Icons.UserIconSVG, {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 191
            },
            __self: this
          })
        ),
        this.state.emailValid ? '' : _react2.default.createElement(
          'span',
          { style: STYLES.tooltip, __source: {
              fileName: _jsxFileName,
              lineNumber: 195
            },
            __self: this
          },
          _react2.default.createElement('span', { style: STYLES.arrowLeft, __source: {
              fileName: _jsxFileName,
              lineNumber: 195
            },
            __self: this
          }),
          'Use an email address'
        )
      );
    }
  }, {
    key: 'passwordElement',
    value: function passwordElement() {
      return _react2.default.createElement(
        'div',
        { style: STYLES.inputHolster, __source: {
            fileName: _jsxFileName,
            lineNumber: 202
          },
          __self: this
        },
        _react2.default.createElement('input', {
          type: 'password',
          placeholder: 'Password',
          key: 'pass',
          value: this.state.password,
          onChange: this.handlePasswordChange,
          disabled: this.state.isSubmitting || this.state.isSuccess,
          onKeyPress: this.checkSubmit,
          style: STYLES.input, __source: {
            fileName: _jsxFileName,
            lineNumber: 203
          },
          __self: this
        }),
        _react2.default.createElement(
          'span',
          { style: [STYLES.inputIcon, STYLES.iconAdjust], __source: {
              fileName: _jsxFileName,
              lineNumber: 212
            },
            __self: this
          },
          _react2.default.createElement(_Icons.PasswordIconSVG, {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 213
            },
            __self: this
          })
        )
      );
    }
  }, {
    key: 'errorElement',
    value: function errorElement() {
      if (this.state.error) {
        var err = this.state.error.message;
        // hacky: special-case Unauthorized error to be a bit more friendly
        if (err === 'Unauthorized') {
          err = 'Username or Password Incorrect';
        }
        return _react2.default.createElement(
          'div',
          { style: STYLES.error, __source: {
              fileName: _jsxFileName,
              lineNumber: 225
            },
            __self: this
          },
          _react2.default.createElement(
            'p',
            {
              __source: {
                fileName: _jsxFileName,
                lineNumber: 226
              },
              __self: this
            },
            err
          )
        );
      }
    }
  }, {
    key: 'submitButtonElement',
    value: function submitButtonElement() {
      var submitButtonMessage = void 0;
      if (this.state.isSubmitting) submitButtonMessage = _react2.default.createElement(_betterReactSpinkit.FadingCircle, { size: 22, color: _Palette2.default.ROCK, __source: {
          fileName: _jsxFileName,
          lineNumber: 234
        },
        __self: this
      });else if (this.state.isSuccess) submitButtonMessage = 'Success!';else submitButtonMessage = 'Log In';
      return _react2.default.createElement(
        'button',
        {
          style: [STYLES.btn, !this.state.emailValid && STYLES.btnDisabled],
          onClick: this.handleSubmit,
          disabled: this.state.isSubmitting || this.state.isSuccess || !this.state.emailValid, __source: {
            fileName: _jsxFileName,
            lineNumber: 238
          },
          __self: this
        },
        submitButtonMessage
      );
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        { style: [STYLES.container, this.state.error && STYLES.errorShake], __source: {
            fileName: _jsxFileName,
            lineNumber: 249
          },
          __self: this
        },
        _react2.default.createElement(
          'div',
          { style: [STYLES.formWrap, STYLES.center], __source: {
              fileName: _jsxFileName,
              lineNumber: 250
            },
            __self: this
          },
          _react2.default.createElement(_Icons.LogoGradientSVG, {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 251
            },
            __self: this
          }),
          _react2.default.createElement(
            'div',
            { style: STYLES.title, __source: {
                fileName: _jsxFileName,
                lineNumber: 252
              },
              __self: this
            },
            'Log in to Your Account'
          ),
          this.errorElement(),
          this.usernameElement(),
          this.passwordElement(),
          this.submitButtonElement()
        ),
        _react2.default.createElement(
          'div',
          { style: {
              position: 'absolute',
              bottom: 50,
              color: '#999'
            }, __source: {
              fileName: _jsxFileName,
              lineNumber: 258
            },
            __self: this
          },
          'By logging into Haiku you agree to our ',
          _react2.default.createElement(
            'span',
            { style: { color: '#efa70d', textDecoration: 'underline', cursor: 'pointer' }, onClick: function onClick() {
                require('electron').shell.openExternal('https://www.haiku.ai/terms-of-service.html');
              }, __source: {
                fileName: _jsxFileName,
                lineNumber: 263
              },
              __self: this
            },
            'terms and conditions'
          )
        )
      );
    }
  }]);

  return AuthenticationUI;
}(_react2.default.Component);

function validEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

exports.default = (0, _radium2.default)(AuthenticationUI);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9yZWFjdC9jb21wb25lbnRzL0F1dGhlbnRpY2F0aW9uVUkuanMiXSwibmFtZXMiOlsiU1RZTEVTIiwiY29udGFpbmVyIiwid2lkdGgiLCJoZWlnaHQiLCJwb3NpdGlvbiIsImRpc3BsYXkiLCJhbGlnbkl0ZW1zIiwianVzdGlmeUNvbnRlbnQiLCJlcnJvclNoYWtlIiwiYW5pbWF0aW9uIiwiYW5pbWF0aW9uTmFtZSIsImtleWZyYW1lcyIsImZvcm1XcmFwIiwiYmFja2dyb3VuZENvbG9yIiwiUk9DSyIsIm1pbkhlaWdodCIsImJvcmRlclJhZGl1cyIsInBhZGRpbmciLCJib3hTaGFkb3ciLCJjZW50ZXIiLCJ0ZXh0QWxpZ24iLCJ0aXRsZSIsIldlYmtpdFVzZXJTZWxlY3QiLCJjdXJzb3IiLCJmb250U2l6ZSIsImNvbG9yIiwiTUVESVVNX0NPQUwiLCJtYXJnaW4iLCJpbnB1dEhvbHN0ZXIiLCJ0b29sdGlwIiwiUkVEIiwiZmFkZSIsInJpZ2h0IiwidG9wIiwiYXJyb3dMZWZ0IiwibGVmdCIsImJvcmRlclRvcCIsImJvcmRlckJvdHRvbSIsImJvcmRlclJpZ2h0IiwiaW5wdXRJY29uIiwiekluZGV4IiwiaWNvbkFkanVzdCIsImlucHV0IiwibWFyZ2luQm90dG9tIiwiYm9yZGVyIiwiTElHSFRfQkxVRSIsImVycm9ySW5wdXQiLCJidG4iLCJiYWNrZ3JvdW5kSW1hZ2UiLCJsZXR0ZXJTcGFjaW5nIiwidGV4dFRyYW5zZm9ybSIsImJ0bkRpc2FibGVkIiwiREFSS19ST0NLIiwiZXJyb3IiLCJBdXRoZW50aWNhdGlvblVJIiwicHJvcHMiLCJoYW5kbGVVc2VybmFtZUNoYW5nZSIsImJpbmQiLCJoYW5kbGVQYXNzd29yZENoYW5nZSIsImNoZWNrU3VibWl0IiwiaGFuZGxlU3VibWl0Iiwic3RhdGUiLCJpc1N1Ym1pdHRpbmciLCJpc1N1Y2Nlc3MiLCJ1c2VybmFtZSIsInBhc3N3b3JkIiwiZW1haWxWYWxpZCIsInJlZnMiLCJlbWFpbCIsImZvY3VzIiwiY2hhbmdlRXZlbnQiLCJzZXRTdGF0ZSIsInRhcmdldCIsInZhbHVlIiwic3VibWl0RXZlbnQiLCJvblN1Ym1pdCIsIm9uU3VibWl0U3VjY2VzcyIsImUiLCJjaGFyQ29kZSIsInZhbGlkRW1haWwiLCJpc0VtYWlsIiwidmFsaWRhdGVJc0VtYWlsQWRkcmVzcyIsImVyciIsIm1lc3NhZ2UiLCJzdWJtaXRCdXR0b25NZXNzYWdlIiwiZXJyb3JFbGVtZW50IiwidXNlcm5hbWVFbGVtZW50IiwicGFzc3dvcmRFbGVtZW50Iiwic3VibWl0QnV0dG9uRWxlbWVudCIsImJvdHRvbSIsInRleHREZWNvcmF0aW9uIiwicmVxdWlyZSIsInNoZWxsIiwib3BlbkV4dGVybmFsIiwiQ29tcG9uZW50IiwicmUiLCJ0ZXN0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7O0FBRUEsSUFBTUEsU0FBUztBQUNiQyxhQUFXO0FBQ1RDLFdBQU8sTUFERTtBQUVUQyxZQUFRLE9BRkM7QUFHVEMsY0FBVSxVQUhEO0FBSVRDLGFBQVMsTUFKQTtBQUtUQyxnQkFBWSxRQUxIO0FBTVRDLG9CQUFnQjtBQU5QLEdBREU7QUFTYkMsY0FBWTtBQUNWQyxlQUFXLFNBREQ7QUFFVkMsbUJBQWUsaUJBQU9DLFNBQVAseUJBQXdCLE9BQXhCO0FBRkwsR0FUQztBQWFiQyxZQUFVO0FBQ1JDLHFCQUFpQixrQkFBUUMsSUFEakI7QUFFUlosV0FBTyxHQUZDO0FBR1JhLGVBQVcsR0FISDtBQUlSQyxrQkFBYyxDQUpOO0FBS1JDLGFBQVMsV0FMRDtBQU1SQyxlQUFXO0FBTkgsR0FiRztBQXFCYkMsVUFBUTtBQUNOQyxlQUFXO0FBREwsR0FyQks7QUF3QmJDLFNBQU87QUFDTEMsc0JBQWtCLE1BRGI7QUFFTEMsWUFBUSxTQUZIO0FBR0xDLGNBQVUsRUFITDtBQUlMQyxXQUFPLGtCQUFRQyxXQUpWO0FBS0xDLFlBQVE7QUFMSCxHQXhCTTtB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TCxFQUpIO0FBS0csZUFBS0MsZUFBTCxFQUxIO0FBTUcsZUFBS0MsbUJBQUw7QUFOSCxTQURGO0FBU0U7QUFBQTtBQUFBLFlBQUssT0FBTztBQUNWcEYsd0JBQVUsVUFEQTtBQUVWcUYsc0JBQVEsRUFGRTtBQUdWaEUscUJBQU87QUFIRyxhQUFaO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBS3lDO0FBQUE7QUFBQSxjQUFNLE9BQU8sRUFBRUEsT0FBTyxTQUFULEVBQW9CaUUsZ0JBQWdCLFdBQXBDLEVBQWlEbkUsUUFBUSxTQUF6RCxFQUFiLEVBQW1GLFNBQVMsbUJBQU07QUFBRW9FLHdCQUFRLFVBQVIsRUFBb0JDLEtBQXBCLENBQTBCQyxZQUExQixDQUF1Qyw0Q0FBdkM7QUFBc0YsZUFBMUw7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUx6QztBQVRGLE9BREY7QUFtQkQ7Ozs7RUFySjRCLGdCQUFNQyxTOztBQXdKckMsU0FBU2YsVUFBVCxDQUFxQlgsS0FBckIsRUFBNEI7QUFDMUIsTUFBSTJCLEtBQUssc0pBQVQ7QUFDQSxTQUFPQSxHQUFHQyxJQUFILENBQVE1QixLQUFSLENBQVA7QUFDRDs7a0JBRWMsc0JBQU9kLGdCQUFQLEMiLCJmaWxlIjoiQXV0aGVudGljYXRpb25VSS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCBSYWRpdW0gZnJvbSAncmFkaXVtJ1xuaW1wb3J0IENvbG9yIGZyb20gJ2NvbG9yJ1xuaW1wb3J0IHsgc2hha2UgfSBmcm9tICdyZWFjdC1hbmltYXRpb25zJ1xuaW1wb3J0IHsgRmFkaW5nQ2lyY2xlIH0gZnJvbSAnYmV0dGVyLXJlYWN0LXNwaW5raXQnXG5pbXBvcnQgUGFsZXR0ZSBmcm9tICcuL1BhbGV0dGUnXG5pbXBvcnQgeyBMb2dvR3JhZGllbnRTVkcsIFVzZXJJY29uU1ZHLCBQYXNzd29yZEljb25TVkcgfSBmcm9tICcuL0ljb25zJ1xuXG5jb25zdCBTVFlMRVMgPSB7XG4gIGNvbnRhaW5lcjoge1xuICAgIHdpZHRoOiAnMTAwJScsXG4gICAgaGVpZ2h0OiAnMTAwdmgnLFxuICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICAgIGRpc3BsYXk6ICdmbGV4JyxcbiAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgICBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcidcbiAgfSxcbiAgZXJyb3JTaGFrZToge1xuICAgIGFuaW1hdGlvbjogJ3ggODkwbXMnLFxuICAgIGFuaW1hdGlvbk5hbWU6IFJhZGl1bS5rZXlmcmFtZXMoc2hha2UsICdzaGFrZScpXG4gIH0sXG4gIGZvcm1XcmFwOiB7XG4gICAgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLlJPQ0ssXG4gICAgd2lkdGg6IDM3NSxcbiAgICBtaW5IZWlnaHQ6IDIwMCxcbiAgICBib3JkZXJSYWRpdXM6IDcsXG4gICAgcGFkZGluZzogJzQ3cHggMjdweCcsXG4gICAgYm94U2hhZG93OiAnMCAzM3B4IDQwcHggNnB4IHJnYmEoMjQsMCw4LDAuMjEpJ1xuICB9LFxuICBjZW50ZXI6IHtcbiAgICB0ZXh0QWxpZ246ICdjZW50ZXInXG4gIH0sXG4gIHRpdGxlOiB7XG4gICAgV2Via2l0VXNlclNlbGVjdDogJ25vbmUnLFxuICAgIGN1cnNvcjogJ2RlZmF1bHQnLFxuICAgIGZvbnRTaXplOiAyMSxcbiAgICBjb2xvcjogUGFsZXR0ZS5NRURJVU1fQ09BTCxcbiAgICBtYXJnaW46ICcyMHB4IGF1dG8gMzhweCBhdXRvJ1xuICB9LFxuICBpbnB1dEhvbHN0ZXI6IHtcbiAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJ1xuICB9LFxuICB0b29sdGlwOiB7XG4gICAgYmFja2dyb3VuZENvbG9yOiBDb2xvcihQYWxldHRlLlJFRCkuZmFkZSgwLjEpLFxuICAgIGNvbG9yOiBQYWxldHRlLlJPQ0ssXG4gICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgcmlnaHQ6ICctMTcwcHgnLFxuICAgIHRvcDogMTEsXG4gICAgcGFkZGluZzogJzdweCAxNnB4JyxcbiAgICBmb250U2l6ZTogMTMsXG4gICAgYm9yZGVyUmFkaXVzOiA0XG4gIH0sXG4gIGFycm93TGVmdDoge1xuICAgIHdpZHRoOiAwLFxuICAgIGhlaWdodDogMCxcbiAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICBsZWZ0OiAtOCxcbiAgICBib3JkZXJUb3A6ICcxMHB4IHNvbGlkIHRyYW5zcGFyZW50JyxcbiAgICBib3JkZXJCb3R0b206ICcxMHB4IHNvbGlkIHRyYW5zcGFyZW50JyxcbiAgICBib3JkZXJSaWdodDogJzEwcHggc29saWQgJyArIENvbG9yKFBhbGV0dGUuUkVEKS5mYWRlKDAuMSlcbiAgfSxcbiAgaW5wdXRJY29uOiB7XG4gICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgcmlnaHQ6IDI0LFxuICAgIHRvcDogMTksXG4gICAgekluZGV4OiAxXG4gIH0sXG4gIGljb25BZGp1c3Q6IHtcbiAgICByaWdodDogMjVcbiAgfSxcbiAgaW5wdXQ6IHtcbiAgICBiYWNrZ3JvdW5kQ29sb3I6ICcjRjVGNUY1JyxcbiAgICB3aWR0aDogJzEwMCUnLFxuICAgIGhlaWdodDogNTUsXG4gICAgYm9yZGVyUmFkaXVzOiA1LFxuICAgIG1hcmdpbkJvdHRvbTogMTUsXG4gICAgYm9yZGVyOiAnMXB4IHNvbGlkICNERURFREUnLFxuICAgIGZvbnRTaXplOiAxOCxcbiAgICBwYWRkaW5nOiAnMjdweCcsXG4gICAgJzpmb2N1cyc6IHtcbiAgICAgIGJvcmRlcjogJzFweCBzb2xpZCAnICsgUGFsZXR0ZS5MSUdIVF9CTFVFXG4gICAgfVxuICB9LFxuICBlcnJvcklucHV0OiB7XG4gICAgYm9yZGVyOiAnMXB4IHNvbGlkICcgKyBDb2xvcihQYWxldHRlLlJFRCkuZmFkZSgwLjEpXG4gIH0sXG4gIGJ0bjoge1xuICAgIGJhY2tncm91bmRJbWFnZTogJ2xpbmVhci1ncmFkaWVudCg5MGRlZywgI0Q3MkI2MCAwJSwgI0YwQ0MwRCAxMDAlKScsXG4gICAgYm9yZGVyUmFkaXVzOiA1LFxuICAgIHdpZHRoOiAnMTAwJScsXG4gICAgaGVpZ2h0OiA1NSxcbiAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAganVzdGlmeUNvbnRlbnQ6ICdjZW50ZXInLFxuICAgIGZvbnRTaXplOiAyMixcbiAgICBsZXR0ZXJTcGFjaW5nOiAxLjUsXG4gICAgdGV4dEFsaWduOiAnY2VudGVyJyxcbiAgICB0ZXh0VHJhbnNmb3JtOiAndXBwZXJjYXNlJyxcbiAgICBjb2xvcjogUGFsZXR0ZS5ST0NLLFxuICAgICc6Zm9jdXMnOiB7XG4gICAgICBib3JkZXI6ICcxcHggc29saWQgJyArIFBhbGV0dGUuTElHSFRfQkxVRVxuICAgIH1cbiAgfSxcbiAgYnRuRGlzYWJsZWQ6IHtcbiAgICBiYWNrZ3JvdW5kSW1hZ2U6ICdub25lJyxcbiAgICBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuREFSS19ST0NLLFxuICAgIGN1cnNvcjogJ25vdC1hbGxvd2VkJ1xuICB9LFxuICBlcnJvcjoge1xuICAgIGJhY2tncm91bmRDb2xvcjogQ29sb3IoUGFsZXR0ZS5SRUQpLmZhZGUoMC41KSxcbiAgICBjb2xvcjogUGFsZXR0ZS5ST0NLLFxuICAgIHdpZHRoOiAnY2FsYygxMDAlICsgNTRweCknLFxuICAgIHBhZGRpbmc6IDIwLFxuICAgIG1hcmdpbjogJy0yN3B4IDAgMTJweCAtMjdweCcsXG4gICAgZm9udFNpemU6IDE0XG4gIH1cbn1cblxuY2xhc3MgQXV0aGVudGljYXRpb25VSSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yIChwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKVxuICAgIHRoaXMuaGFuZGxlVXNlcm5hbWVDaGFuZ2UgPSB0aGlzLmhhbmRsZVVzZXJuYW1lQ2hhbmdlLmJpbmQodGhpcylcbiAgICB0aGlzLmhhbmRsZVBhc3N3b3JkQ2hhbmdlID0gdGhpcy5oYW5kbGVQYXNzd29yZENoYW5nZS5iaW5kKHRoaXMpXG4gICAgdGhpcy5jaGVja1N1Ym1pdCA9IHRoaXMuY2hlY2tTdWJtaXQuYmluZCh0aGlzKVxuICAgIHRoaXMuaGFuZGxlU3VibWl0ID0gdGhpcy5oYW5kbGVTdWJtaXQuYmluZCh0aGlzKVxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBlcnJvcjogbnVsbCxcbiAgICAgIGlzU3VibWl0dGluZzogZmFsc2UsXG4gICAgICBpc1N1Y2Nlc3M6IGZhbHNlLFxuICAgICAgdXNlcm5hbWU6ICcnLFxuICAgICAgcGFzc3dvcmQ6ICcnLFxuICAgICAgZW1haWxWYWxpZDogdHJ1ZVxuICAgIH1cbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50ICgpIHtcbiAgICB0aGlzLnJlZnMuZW1haWwuZm9jdXMoKVxuICB9XG5cbiAgaGFuZGxlVXNlcm5hbWVDaGFuZ2UgKGNoYW5nZUV2ZW50KSB7XG4gICAgcmV0dXJuIHRoaXMuc2V0U3RhdGUoeyB1c2VybmFtZTogY2hhbmdlRXZlbnQudGFyZ2V0LnZhbHVlIH0pXG4gIH1cblxuICBoYW5kbGVQYXNzd29yZENoYW5nZSAoY2hhbmdlRXZlbnQpIHtcbiAgICByZXR1cm4gdGhpcy5zZXRTdGF0ZSh7IHBhc3N3b3JkOiBjaGFuZ2VFdmVudC50YXJnZXQudmFsdWUgfSlcbiAgfVxuXG4gIGhhbmRsZVN1Ym1pdCAoc3VibWl0RXZlbnQpIHtcbiAgICB0aGlzLnNldFN0YXRlKHsgaXNTdWJtaXR0aW5nOiB0cnVlLCBlcnJvcjogbnVsbCB9KVxuICAgIHJldHVybiB0aGlzLnByb3BzLm9uU3VibWl0KHRoaXMuc3RhdGUudXNlcm5hbWUsIHRoaXMuc3RhdGUucGFzc3dvcmQsIChlcnJvcikgPT4ge1xuICAgICAgaWYgKGVycm9yKSByZXR1cm4gdGhpcy5zZXRTdGF0ZSh7IGVycm9yLCBpc1N1Ym1pdHRpbmc6IGZhbHNlIH0pXG4gICAgICB0aGlzLnNldFN0YXRlKHsgaXNTdWJtaXR0aW5nOiBmYWxzZSwgaXNTdWNjZXNzOiB0cnVlIH0pXG4gICAgICB0aGlzLnByb3BzLm9uU3VibWl0U3VjY2VzcygpXG4gICAgfSlcbiAgfVxuXG4gIGNoZWNrU3VibWl0IChlKSB7XG4gICAgaWYgKGUuY2hhckNvZGUgPT09IDEzKSB7XG4gICAgICBpZiAodmFsaWRFbWFpbCh0aGlzLnN0YXRlLnVzZXJuYW1lKSkge1xuICAgICAgICB0aGlzLmhhbmRsZVN1Ym1pdCgpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtlbWFpbFZhbGlkOiBmYWxzZX0pXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgdmFsaWRhdGVJc0VtYWlsQWRkcmVzcyAoKSB7XG4gICAgbGV0IGlzRW1haWwgPSB2YWxpZEVtYWlsKHRoaXMucmVmcy5lbWFpbC52YWx1ZSlcbiAgICBpZiAodGhpcy5yZWZzLmVtYWlsLnZhbHVlID09PSAnJykgaXNFbWFpbCA9IHRydWUgLy8gdG8gYXZvaWQgc2hvd2luZyBlcnJvciBzdGF0ZSBpZiBibGFua1xuXG4gICAgaXNFbWFpbFxuICAgICAgPyB0aGlzLnNldFN0YXRlKHsgZW1haWxWYWxpZDogdHJ1ZSB9KVxuICAgICAgOiB0aGlzLnNldFN0YXRlKHsgZW1haWxWYWxpZDogZmFsc2UgfSlcbiAgfVxuXG4gIHVzZXJuYW1lRWxlbWVudCAoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgc3R5bGU9e1NUWUxFUy5pbnB1dEhvbHN0ZXJ9PlxuICAgICAgICA8aW5wdXRcbiAgICAgICAgICB0eXBlPSd0ZXh0J1xuICAgICAgICAgIHBsYWNlaG9sZGVyPSdFbWFpbCdcbiAgICAgICAgICBrZXk9J3VzZXJuYW1lJ1xuICAgICAgICAgIHJlZj0nZW1haWwnXG4gICAgICAgICAgdmFsdWU9e3RoaXMuc3RhdGUudXNlcm5hbWV9XG4gICAgICAgICAgb25DaGFuZ2U9e3RoaXMuaGFuZGxlVXNlcm5hbWVDaGFuZ2V9XG4gICAgICAgICAgb25Gb2N1cz17KCkgPT4geyB0aGlzLnNldFN0YXRlKHsgZW1haWxWYWxpZDogdHJ1ZSB9KSB9fVxuICAgICAgICAgIG9uQmx1cj17KGUpID0+IHsgdGhpcy52YWxpZGF0ZUlzRW1haWxBZGRyZXNzKGUpIH19XG4gICAgICAgICAgZGlzYWJsZWQ9e3RoaXMuc3RhdGUuaXNTdWJtaXR0aW5nIHx8IHRoaXMuc3RhdGUuaXNTdWNjZXNzfVxuICAgICAgICAgIG9uS2V5UHJlc3M9e3RoaXMuY2hlY2tTdWJtaXR9XG4gICAgICAgICAgc3R5bGU9e1tTVFlMRVMuaW5wdXQsICF0aGlzLnN0YXRlLmVtYWlsVmFsaWQgJiYgU1RZTEVTLmVycm9ySW5wdXRdfSAvPlxuICAgICAgICA8c3BhbiBzdHlsZT17U1RZTEVTLmlucHV0SWNvbn0+XG4gICAgICAgICAgPFVzZXJJY29uU1ZHIC8+XG4gICAgICAgIDwvc3Bhbj5cbiAgICAgICAgeyB0aGlzLnN0YXRlLmVtYWlsVmFsaWRcbiAgICAgICAgICAgID8gJydcbiAgICAgICAgICAgIDogPHNwYW4gc3R5bGU9e1NUWUxFUy50b29sdGlwfT48c3BhbiBzdHlsZT17U1RZTEVTLmFycm93TGVmdH0gLz5Vc2UgYW4gZW1haWwgYWRkcmVzczwvc3Bhbj4gfVxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgcGFzc3dvcmRFbGVtZW50ICgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBzdHlsZT17U1RZTEVTLmlucHV0SG9sc3Rlcn0+XG4gICAgICAgIDxpbnB1dFxuICAgICAgICAgIHR5cGU9J3Bhc3N3b3JkJ1xuICAgICAgICAgIHBsYWNlaG9sZGVyPSdQYXNzd29yZCdcbiAgICAgICAgICBrZXk9J3Bhc3MnXG4gICAgICAgICAgdmFsdWU9e3RoaXMuc3RhdGUucGFzc3dvcmR9XG4gICAgICAgICAgb25DaGFuZ2U9e3RoaXMuaGFuZGxlUGFzc3dvcmRDaGFuZ2V9XG4gICAgICAgICAgZGlzYWJsZWQ9e3RoaXMuc3RhdGUuaXNTdWJtaXR0aW5nIHx8IHRoaXMuc3RhdGUuaXNTdWNjZXNzfVxuICAgICAgICAgIG9uS2V5UHJlc3M9e3RoaXMuY2hlY2tTdWJtaXR9XG4gICAgICAgICAgc3R5bGU9e1NUWUxFUy5pbnB1dH0gLz5cbiAgICAgICAgPHNwYW4gc3R5bGU9e1tTVFlMRVMuaW5wdXRJY29uLCBTVFlMRVMuaWNvbkFkanVzdF19PlxuICAgICAgICAgIDxQYXNzd29yZEljb25TVkcgLz5cbiAgICAgICAgPC9zcGFuPlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgZXJyb3JFbGVtZW50ICgpIHtcbiAgICBpZiAodGhpcy5zdGF0ZS5lcnJvcikge1xuICAgICAgdmFyIGVyciA9IHRoaXMuc3RhdGUuZXJyb3IubWVzc2FnZVxuICAgICAgLy8gaGFja3k6IHNwZWNpYWwtY2FzZSBVbmF1dGhvcml6ZWQgZXJyb3IgdG8gYmUgYSBiaXQgbW9yZSBmcmllbmRseVxuICAgICAgaWYgKGVyciA9PT0gJ1VuYXV0aG9yaXplZCcpIHsgZXJyID0gJ1VzZXJuYW1lIG9yIFBhc3N3b3JkIEluY29ycmVjdCcgfVxuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBzdHlsZT17U1RZTEVTLmVycm9yfT5cbiAgICAgICAgICA8cD57ZXJyfTwvcD5cbiAgICAgICAgPC9kaXY+XG4gICAgICApXG4gICAgfVxuICB9XG5cbiAgc3VibWl0QnV0dG9uRWxlbWVudCAoKSB7XG4gICAgbGV0IHN1Ym1pdEJ1dHRvbk1lc3NhZ2VcbiAgICBpZiAodGhpcy5zdGF0ZS5pc1N1Ym1pdHRpbmcpIHN1Ym1pdEJ1dHRvbk1lc3NhZ2UgPSA8RmFkaW5nQ2lyY2xlIHNpemU9ezIyfSBjb2xvcj17UGFsZXR0ZS5ST0NLfSAvPlxuICAgIGVsc2UgaWYgKHRoaXMuc3RhdGUuaXNTdWNjZXNzKSBzdWJtaXRCdXR0b25NZXNzYWdlID0gJ1N1Y2Nlc3MhJ1xuICAgIGVsc2Ugc3VibWl0QnV0dG9uTWVzc2FnZSA9ICdMb2cgSW4nXG4gICAgcmV0dXJuIChcbiAgICAgIDxidXR0b25cbiAgICAgICAgc3R5bGU9e1tTVFlMRVMuYnRuLCAhdGhpcy5zdGF0ZS5lbWFpbFZhbGlkICYmIFNUWUxFUy5idG5EaXNhYmxlZF19XG4gICAgICAgIG9uQ2xpY2s9e3RoaXMuaGFuZGxlU3VibWl0fVxuICAgICAgICBkaXNhYmxlZD17dGhpcy5zdGF0ZS5pc1N1Ym1pdHRpbmcgfHwgdGhpcy5zdGF0ZS5pc1N1Y2Nlc3MgfHwgIXRoaXMuc3RhdGUuZW1haWxWYWxpZH0+XG4gICAgICAgIHtzdWJtaXRCdXR0b25NZXNzYWdlfVxuICAgICAgPC9idXR0b24+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyICgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBzdHlsZT17W1NUWUxFUy5jb250YWluZXIsIHRoaXMuc3RhdGUuZXJyb3IgJiYgU1RZTEVTLmVycm9yU2hha2VdfT5cbiAgICAgICAgPGRpdiBzdHlsZT17W1NUWUxFUy5mb3JtV3JhcCwgU1RZTEVTLmNlbnRlcl19PlxuICAgICAgICAgIDxMb2dvR3JhZGllbnRTVkcgLz5cbiAgICAgICAgICA8ZGl2IHN0eWxlPXtTVFlMRVMudGl0bGV9PkxvZyBpbiB0byBZb3VyIEFjY291bnQ8L2Rpdj5cbiAgICAgICAgICB7dGhpcy5lcnJvckVsZW1lbnQoKX1cbiAgICAgICAgICB7dGhpcy51c2VybmFtZUVsZW1lbnQoKX1cbiAgICAgICAgICB7dGhpcy5wYXNzd29yZEVsZW1lbnQoKX1cbiAgICAgICAgICB7dGhpcy5zdWJtaXRCdXR0b25FbGVtZW50KCl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgYm90dG9tOiA1MCxcbiAgICAgICAgICBjb2xvcjogJyM5OTknXG4gICAgICAgIH19PlxuICAgICAgICAgIEJ5IGxvZ2dpbmcgaW50byBIYWlrdSB5b3UgYWdyZWUgdG8gb3VyIDxzcGFuIHN0eWxlPXt7IGNvbG9yOiAnI2VmYTcwZCcsIHRleHREZWNvcmF0aW9uOiAndW5kZXJsaW5lJywgY3Vyc29yOiAncG9pbnRlcicgfX0gb25DbGljaz17KCkgPT4geyByZXF1aXJlKCdlbGVjdHJvbicpLnNoZWxsLm9wZW5FeHRlcm5hbCgnaHR0cHM6Ly93d3cuaGFpa3UuYWkvdGVybXMtb2Ytc2VydmljZS5odG1sJykgfX0+dGVybXMgYW5kIGNvbmRpdGlvbnM8L3NwYW4+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG59XG5cbmZ1bmN0aW9uIHZhbGlkRW1haWwgKGVtYWlsKSB7XG4gIHZhciByZSA9IC9eKChbXjw+KClbXFxdXFxcXC4sOzpcXHNAXCJdKyhcXC5bXjw+KClbXFxdXFxcXC4sOzpcXHNAXCJdKykqKXwoXCIuK1wiKSlAKChcXFtbMC05XXsxLDN9XFwuWzAtOV17MSwzfVxcLlswLTldezEsM31cXC5bMC05XXsxLDN9XSl8KChbYS16QS1aXFwtMC05XStcXC4pK1thLXpBLVpdezIsfSkpJC9cbiAgcmV0dXJuIHJlLnRlc3QoZW1haWwpXG59XG5cbmV4cG9ydCBkZWZhdWx0IFJhZGl1bShBdXRoZW50aWNhdGlvblVJKVxuIl19