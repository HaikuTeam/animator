'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _jsxFileName = 'src/react/components/ProjectLoader.js';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _radium = require('radium');

var _radium2 = _interopRequireDefault(_radium);

var _color = require('color');

var _color2 = _interopRequireDefault(_color);

var _betterReactSpinkit = require('better-react-spinkit');

var _Palette = require('./Palette');

var _Palette2 = _interopRequireDefault(_Palette);

var _Icons = require('./Icons');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var STYLES = {
  fullScreenCenterWrap: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    color: _Palette2.default.ROCK,
    backgroundColor: (0, _color2.default)(_Palette2.default.GRAY).fade(0.023),
    zIndex: 6
  },
  contentHolster: {
    textAlign: 'center',
    width: 820,
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
  },
  tip: {
    position: 'absolute',
    bottom: 100,
    left: '50%',
    transform: 'translateX(-50%)',
    width: 820,
    fontSize: 16,
    backgroundColor: _Palette2.default.ROCK,
    color: _Palette2.default.MEDIUM_COAL,
    borderRadius: 5,
    padding: '13px 30px',
    marginTop: 50,
    textAlign: 'left',
    boxShadow: '0 22px 74px 0 rgba(0,14,14,0.46)',
    display: 'flex',
    alignItems: 'center'
  },
  pretip: {
    fontStyle: 'italic',
    fontWeight: 'bold',
    color: _Palette2.default.PINK,
    marginRight: 14,
    width: 161,
    minWidth: 161,
    borderRight: '1px solid rgba(128, 128, 128, 0.14)',
    display: 'flex',
    alignItems: 'center'
  },
  icon: {
    marginRight: 9,
    marginTop: 5
  },
  reticulator: {
    fontSize: 44,
    lineHeight: '1.3em'
  }
};

var reticulations = ['Bear with us while we set up your project. This can take several moments', 'Configuring version control system', 'Connecting to remote code repository', 'Checking for changes from other collaborators on your team', 'Syncing changes from Haiku Cloud', 'Merging changes', 'Loading your project files', 'Preparing your design files', 'Preparing your code files', 'Installing dependencies', 'Checking for Haiku Player updates', 'Watching your source files for changes', 'Initializing your component', 'Setting up the stage and timeline'];

var tips = ['Did you know? Every change you make in Haiku is tracked as a Git commit!', 'For a great bouncy animation effect, try Make Tween > Ease In Out > Elastic', "To animate along a curve, try using different easing curves for Position X and Position Y.  You'll be surprised what you can create!", 'Import any Sketch file, then drag and drop design elements on stage to animate', "While you're designing in Sketch, remember to make slices of all the pieces you want to animate", "Did you know? Haiku is for engineers too. Your animation is plain ol' JavaScript code", 'When your animation is ready, click “Publish” to get code snippets for embedding'];

var tip = tips[Math.floor(Math.random() * tips.length)];
var _reticularHandle;

var ProjectLoader = function (_React$Component) {
  _inherits(ProjectLoader, _React$Component);

  function ProjectLoader() {
    _classCallCheck(this, ProjectLoader);

    var _this = _possibleConstructorReturn(this, (ProjectLoader.__proto__ || Object.getPrototypeOf(ProjectLoader)).call(this));

    _this.state = {
      retic: 0
    };
    return _this;
  }

  _createClass(ProjectLoader, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.incrementReticulator();
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      if (_reticularHandle) {
        clearTimeout(_reticularHandle);
      }
    }
  }, {
    key: 'incrementReticulator',
    value: function incrementReticulator() {
      var _this2 = this;

      _reticularHandle = setTimeout(function () {
        _this2.setState({ retic: _this2.state.retic + 1 }, function () {
          if (_this2.state.retic !== reticulations.length - 1) _this2.incrementReticulator();
        });
      }, 5200);
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        { style: STYLES.fullScreenCenterWrap, __source: {
            fileName: _jsxFileName,
            lineNumber: 122
          },
          __self: this
        },
        _react2.default.createElement(
          'div',
          { style: STYLES.contentHolster, __source: {
              fileName: _jsxFileName,
              lineNumber: 123
            },
            __self: this
          },
          _react2.default.createElement(
            'div',
            { style: STYLES.reticulator, __source: {
                fileName: _jsxFileName,
                lineNumber: 124
              },
              __self: this
            },
            reticulations[this.state.retic],
            _react2.default.createElement(_betterReactSpinkit.ThreeBounce, { color: _Palette2.default.ROCK, __source: {
                fileName: _jsxFileName,
                lineNumber: 126
              },
              __self: this
            })
          )
        ),
        _react2.default.createElement(
          'div',
          { style: STYLES.tip, __source: {
              fileName: _jsxFileName,
              lineNumber: 129
            },
            __self: this
          },
          _react2.default.createElement(
            'span',
            { style: STYLES.pretip, __source: {
                fileName: _jsxFileName,
                lineNumber: 130
              },
              __self: this
            },
            _react2.default.createElement(
              'span',
              { style: STYLES.icon, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 131
                },
                __self: this
              },
              _react2.default.createElement(_Icons.LightIconSVG, { color: _Palette2.default.PINK, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 131
                },
                __self: this
              })
            ),
            'Tip of the Load'
          ),
          _react2.default.createElement(
            'span',
            { style: STYLES.tipText, __source: {
                fileName: _jsxFileName,
                lineNumber: 134
              },
              __self: this
            },
            tip
          )
        )
      );
    }
  }]);

  return ProjectLoader;
}(_react2.default.Component);

exports.default = (0, _radium2.default)(ProjectLoader);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9yZWFjdC9jb21wb25lbnRzL1Byb2plY3RMb2FkZXIuanMiXSwibmFtZXMiOlsiU1RZTEVTIiwiZnVsbFNjcmVlbkNlbnRlcldyYXAiLCJwb3NpdGlvbiIsIndpZHRoIiwiaGVpZ2h0IiwiY29sb3IiLCJST0NLIiwiYmFja2dyb3VuZENvbG9yIiwiR1JBWSIsImZhZGUiLCJ6SW5kZXgiLCJjb250ZW50SG9sc3RlciIsInRleHRBbGlnbiIsInRvcCIsImxlZnQiLCJ0cmFuc2Zvcm0iLCJ0aXAiLCJib3R0b20iLCJmb250U2l6ZSIsIk1FRElVTV9DT0FMIiwiYm9yZGVyUmFkaXVzIiwicGFkZGluZyIsIm1hcmdpblRvcCIsImJveFNoYWRvdyIsImRpc3BsYXkiLCJhbGlnbkl0ZW1zIiwicHJldGlwIiwiZm9udFN0eWxlIiwiZm9udFdlaWdodCIsIlBJTksiLCJtYXJnaW5SaWdodCIsIm1pbldpZHRoIiwiYm9yZGVyUmlnaHQiLCJpY29uIiwicmV0aWN1bGF0b3IiLCJsaW5lSGVpZ2h0IiwicmV0aWN1bGF0aW9ucyIsInRpcHMiLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iLCJsZW5ndGgiLCJfcmV0aWN1bGFySGFuZGxlIiwiUHJvamVjdExvYWRlciIsInN0YXRlIiwicmV0aWMiLCJpbmNyZW1lbnRSZXRpY3VsYXRvciIsImNsZWFyVGltZW91dCIsInNldFRpbWVvdXQiLCJzZXRTdGF0ZSIsInRpcFRleHQiLCJDb21wb25lbnQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7QUFFQSxJQUFNQSxTQUFTO0FBQ2JDLHdCQUFzQjtBQUNwQkMsY0FBVSxVQURVO0FBRXBCQyxXQUFPLE1BRmE7QUFHcEJDLFlBQVEsTUFIWTtBQUlwQkMsV0FBTyxrQkFBUUMsSUFKSztBQUtwQkMscUJBQWlCLHFCQUFNLGtCQUFRQyxJQUFkLEVBQW9CQyxJQUFwQixDQUF5QixL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LDZFQUFhLE9BQU8sa0JBQVF2QyxJQUE1QjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFGRjtBQURGLFNBREY7QUFPRTtBQUFBO0FBQUEsWUFBSyxPQUFPTixPQUFPZ0IsR0FBbkI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0U7QUFBQTtBQUFBLGNBQU0sT0FBT2hCLE9BQU8wQixNQUFwQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDRTtBQUFBO0FBQUEsZ0JBQU0sT0FBTzFCLE9BQU9pQyxJQUFwQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBMEIsbUVBQWMsT0FBTyxrQkFBUUosSUFBN0I7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQTFCLGFBREY7QUFBQTtBQUFBLFdBREY7QUFLRTtBQUFBO0FBQUEsY0FBTSxPQUFPN0IsT0FBT2tELE9BQXBCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUE4QmxDO0FBQTlCO0FBTEY7QUFQRixPQURGO0FBaUJEOzs7O0VBN0N5QixnQkFBTW1DLFM7O2tCQWdEbkIsc0JBQU9SLGFBQVAsQyIsImZpbGUiOiJQcm9qZWN0TG9hZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IFJhZGl1bSBmcm9tICdyYWRpdW0nXG5pbXBvcnQgQ29sb3IgZnJvbSAnY29sb3InXG5pbXBvcnQgeyBUaHJlZUJvdW5jZSB9IGZyb20gJ2JldHRlci1yZWFjdC1zcGlua2l0J1xuaW1wb3J0IFBhbGV0dGUgZnJvbSAnLi9QYWxldHRlJ1xuaW1wb3J0IHsgTGlnaHRJY29uU1ZHIH0gZnJvbSAnLi9JY29ucydcblxuY29uc3QgU1RZTEVTID0ge1xuICBmdWxsU2NyZWVuQ2VudGVyV3JhcDoge1xuICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgIHdpZHRoOiAnMTAwJScsXG4gICAgaGVpZ2h0OiAnMTAwJScsXG4gICAgY29sb3I6IFBhbGV0dGUuUk9DSyxcbiAgICBiYWNrZ3JvdW5kQ29sb3I6IENvbG9yKFBhbGV0dGUuR1JBWSkuZmFkZSgwLjAyMyksXG4gICAgekluZGV4OiA2XG4gIH0sXG4gIGNvbnRlbnRIb2xzdGVyOiB7XG4gICAgdGV4dEFsaWduOiAnY2VudGVyJyxcbiAgICB3aWR0aDogODIwLFxuICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgIHRvcDogJzUwJScsXG4gICAgbGVmdDogJzUwJScsXG4gICAgdHJhbnNmb3JtOiAndHJhbnNsYXRlKC01MCUsIC01MCUpJ1xuICB9LFxuICB0aXA6IHtcbiAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICBib3R0b206IDEwMCxcbiAgICBsZWZ0OiAnNTAlJyxcbiAgICB0cmFuc2Zvcm06ICd0cmFuc2xhdGVYKC01MCUpJyxcbiAgICB3aWR0aDogODIwLFxuICAgIGZvbnRTaXplOiAxNixcbiAgICBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuUk9DSyxcbiAgICBjb2xvcjogUGFsZXR0ZS5NRURJVU1fQ09BTCxcbiAgICBib3JkZXJSYWRpdXM6IDUsXG4gICAgcGFkZGluZzogJzEzcHggMzBweCcsXG4gICAgbWFyZ2luVG9wOiA1MCxcbiAgICB0ZXh0QWxpZ246ICdsZWZ0JyxcbiAgICBib3hTaGFkb3c6ICcwIDIycHggNzRweCAwIHJnYmEoMCwxNCwxNCwwLjQ2KScsXG4gICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgIGFsaWduSXRlbXM6ICdjZW50ZXInXG4gIH0sXG4gIHByZXRpcDoge1xuICAgIGZvbnRTdHlsZTogJ2l0YWxpYycsXG4gICAgZm9udFdlaWdodDogJ2JvbGQnLFxuICAgIGNvbG9yOiBQYWxldHRlLlBJTkssXG4gICAgbWFyZ2luUmlnaHQ6IDE0LFxuICAgIHdpZHRoOiAxNjEsXG4gICAgbWluV2lkdGg6IDE2MSxcbiAgICBib3JkZXJSaWdodDogJzFweCBzb2xpZCByZ2JhKDEyOCwgMTI4LCAxMjgsIDAuMTQpJyxcbiAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAgYWxpZ25JdGVtczogJ2NlbnRlcidcbiAgfSxcbiAgaWNvbjoge1xuICAgIG1hcmdpblJpZ2h0OiA5LFxuICAgIG1hcmdpblRvcDogNVxuICB9LFxuICByZXRpY3VsYXRvcjoge1xuICAgIGZvbnRTaXplOiA0NCxcbiAgICBsaW5lSGVpZ2h0OiAnMS4zZW0nXG4gIH1cbn1cblxuY29uc3QgcmV0aWN1bGF0aW9ucyA9IFtcbiAgJ0JlYXIgd2l0aCB1cyB3aGlsZSB3ZSBzZXQgdXAgeW91ciBwcm9qZWN0LiBUaGlzIGNhbiB0YWtlIHNldmVyYWwgbW9tZW50cycsXG4gICdDb25maWd1cmluZyB2ZXJzaW9uIGNvbnRyb2wgc3lzdGVtJyxcbiAgJ0Nvbm5lY3RpbmcgdG8gcmVtb3RlIGNvZGUgcmVwb3NpdG9yeScsXG4gICdDaGVja2luZyBmb3IgY2hhbmdlcyBmcm9tIG90aGVyIGNvbGxhYm9yYXRvcnMgb24geW91ciB0ZWFtJyxcbiAgJ1N5bmNpbmcgY2hhbmdlcyBmcm9tIEhhaWt1IENsb3VkJyxcbiAgJ01lcmdpbmcgY2hhbmdlcycsXG4gICdMb2FkaW5nIHlvdXIgcHJvamVjdCBmaWxlcycsXG4gICdQcmVwYXJpbmcgeW91ciBkZXNpZ24gZmlsZXMnLFxuICAnUHJlcGFyaW5nIHlvdXIgY29kZSBmaWxlcycsXG4gICdJbnN0YWxsaW5nIGRlcGVuZGVuY2llcycsXG4gICdDaGVja2luZyBmb3IgSGFpa3UgUGxheWVyIHVwZGF0ZXMnLFxuICAnV2F0Y2hpbmcgeW91ciBzb3VyY2UgZmlsZXMgZm9yIGNoYW5nZXMnLFxuICAnSW5pdGlhbGl6aW5nIHlvdXIgY29tcG9uZW50JyxcbiAgJ1NldHRpbmcgdXAgdGhlIHN0YWdlIGFuZCB0aW1lbGluZSdcbl1cblxuY29uc3QgdGlwcyA9IFtcbiAgJ0RpZCB5b3Uga25vdz8gRXZlcnkgY2hhbmdlIHlvdSBtYWtlIGluIEhhaWt1IGlzIHRyYWNrZWQgYXMgYSBHaXQgY29tbWl0IScsXG4gICdGb3IgYSBncmVhdCBib3VuY3kgYW5pbWF0aW9uIGVmZmVjdCwgdHJ5IE1ha2UgVHdlZW4gPiBFYXNlIEluIE91dCA+IEVsYXN0aWMnLFxuICBcIlRvIGFuaW1hdGUgYWxvbmcgYSBjdXJ2ZSwgdHJ5IHVzaW5nIGRpZmZlcmVudCBlYXNpbmcgY3VydmVzIGZvciBQb3NpdGlvbiBYIGFuZCBQb3NpdGlvbiBZLiAgWW91J2xsIGJlIHN1cnByaXNlZCB3aGF0IHlvdSBjYW4gY3JlYXRlIVwiLFxuICAnSW1wb3J0IGFueSBTa2V0Y2ggZmlsZSwgdGhlbiBkcmFnIGFuZCBkcm9wIGRlc2lnbiBlbGVtZW50cyBvbiBzdGFnZSB0byBhbmltYXRlJyxcbiAgXCJXaGlsZSB5b3UncmUgZGVzaWduaW5nIGluIFNrZXRjaCwgcmVtZW1iZXIgdG8gbWFrZSBzbGljZXMgb2YgYWxsIHRoZSBwaWVjZXMgeW91IHdhbnQgdG8gYW5pbWF0ZVwiLFxuICBcIkRpZCB5b3Uga25vdz8gSGFpa3UgaXMgZm9yIGVuZ2luZWVycyB0b28uIFlvdXIgYW5pbWF0aW9uIGlzIHBsYWluIG9sJyBKYXZhU2NyaXB0IGNvZGVcIixcbiAgJ1doZW4geW91ciBhbmltYXRpb24gaXMgcmVhZHksIGNsaWNrIOKAnFB1Ymxpc2jigJ0gdG8gZ2V0IGNvZGUgc25pcHBldHMgZm9yIGVtYmVkZGluZydcbl1cblxuY29uc3QgdGlwID0gdGlwc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiB0aXBzLmxlbmd0aCldXG52YXIgX3JldGljdWxhckhhbmRsZVxuXG5jbGFzcyBQcm9qZWN0TG9hZGVyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IgKCkge1xuICAgIHN1cGVyKClcblxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICByZXRpYzogMFxuICAgIH1cbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50ICgpIHtcbiAgICB0aGlzLmluY3JlbWVudFJldGljdWxhdG9yKClcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50ICgpIHtcbiAgICBpZiAoX3JldGljdWxhckhhbmRsZSkge1xuICAgICAgY2xlYXJUaW1lb3V0KF9yZXRpY3VsYXJIYW5kbGUpXG4gICAgfVxuICB9XG5cbiAgaW5jcmVtZW50UmV0aWN1bGF0b3IgKCkge1xuICAgIF9yZXRpY3VsYXJIYW5kbGUgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe3JldGljOiB0aGlzLnN0YXRlLnJldGljICsgMX0sICgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUucmV0aWMgIT09IHJldGljdWxhdGlvbnMubGVuZ3RoIC0gMSkgdGhpcy5pbmNyZW1lbnRSZXRpY3VsYXRvcigpXG4gICAgICB9KVxuICAgIH0sIDUyMDApXG4gIH1cblxuICByZW5kZXIgKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IHN0eWxlPXtTVFlMRVMuZnVsbFNjcmVlbkNlbnRlcldyYXB9PlxuICAgICAgICA8ZGl2IHN0eWxlPXtTVFlMRVMuY29udGVudEhvbHN0ZXJ9PlxuICAgICAgICAgIDxkaXYgc3R5bGU9e1NUWUxFUy5yZXRpY3VsYXRvcn0+XG4gICAgICAgICAgICB7cmV0aWN1bGF0aW9uc1t0aGlzLnN0YXRlLnJldGljXX1cbiAgICAgICAgICAgIDxUaHJlZUJvdW5jZSBjb2xvcj17UGFsZXR0ZS5ST0NLfSAvPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBzdHlsZT17U1RZTEVTLnRpcH0+XG4gICAgICAgICAgPHNwYW4gc3R5bGU9e1NUWUxFUy5wcmV0aXB9PlxuICAgICAgICAgICAgPHNwYW4gc3R5bGU9e1NUWUxFUy5pY29ufT48TGlnaHRJY29uU1ZHIGNvbG9yPXtQYWxldHRlLlBJTkt9IC8+PC9zcGFuPlxuICAgICAgICAgICAgVGlwIG9mIHRoZSBMb2FkXG4gICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgIDxzcGFuIHN0eWxlPXtTVFlMRVMudGlwVGV4dH0+e3RpcH08L3NwYW4+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFJhZGl1bShQcm9qZWN0TG9hZGVyKVxuIl19