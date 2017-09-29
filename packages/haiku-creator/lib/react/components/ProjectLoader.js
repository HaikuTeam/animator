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

var reticulations = ['Bear with us while we set up your project. This can take several moments', 'Reticulating splines', 'Configuring version control', 'Connecting to repository', 'Checking for changes from collaborators on your team', 'Syncing with Haiku Cloud', 'Loading project files', 'Preparing design files', 'Preparing code files', 'Installing dependencies', 'Checking for Haiku Player updates', 'Watching source files for changes', 'Initializing component'];

var tips = ['Did you know? Every change you make in Haiku is tracked as a Git commit', 'For a bouncy animation effect, try Make Tween > Ease In Out > Elastic', "Try using different easing curves for Position X and Position Y. You'll be surprised at what you can create", 'Import any Sketch file, then drag and drop design elements on stage to animate', "While you're designing in Sketch, remember to make slices of all the pieces you want to animate", "Did you know? Haiku is for engineers too. Your animation is plain ol' JavaScript code", 'When your animation is ready, click “Publish” to get code snippets to embed'];

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
            lineNumber: 121
          },
          __self: this
        },
        _react2.default.createElement(
          'div',
          { style: STYLES.contentHolster, __source: {
              fileName: _jsxFileName,
              lineNumber: 122
            },
            __self: this
          },
          _react2.default.createElement(
            'div',
            { style: STYLES.reticulator, __source: {
                fileName: _jsxFileName,
                lineNumber: 123
              },
              __self: this
            },
            reticulations[this.state.retic],
            _react2.default.createElement(_betterReactSpinkit.ThreeBounce, { color: _Palette2.default.ROCK, __source: {
                fileName: _jsxFileName,
                lineNumber: 125
              },
              __self: this
            })
          )
        ),
        _react2.default.createElement(
          'div',
          { style: STYLES.tip, __source: {
              fileName: _jsxFileName,
              lineNumber: 128
            },
            __self: this
          },
          _react2.default.createElement(
            'span',
            { style: STYLES.pretip, __source: {
                fileName: _jsxFileName,
                lineNumber: 129
              },
              __self: this
            },
            _react2.default.createElement(
              'span',
              { style: STYLES.icon, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 130
                },
                __self: this
              },
              _react2.default.createElement(_Icons.LightIconSVG, { color: _Palette2.default.PINK, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 130
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
                lineNumber: 133
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9yZWFjdC9jb21wb25lbnRzL1Byb2plY3RMb2FkZXIuanMiXSwibmFtZXMiOlsiU1RZTEVTIiwiZnVsbFNjcmVlbkNlbnRlcldyYXAiLCJwb3NpdGlvbiIsIndpZHRoIiwiaGVpZ2h0IiwiY29sb3IiLCJST0NLIiwiYmFja2dyb3VuZENvbG9yIiwiR1JBWSIsImZhZGUiLCJ6SW5kZXgiLCJjb250ZW50SG9sc3RlciIsInRleHRBbGlnbiIsInRvcCIsImxlZnQiLCJ0cmFuc2Zvcm0iLCJ0aXAiLCJib3R0b20iLCJmb250U2l6ZSIsIk1FRElVTV9DT0FMIiwiYm9yZGVyUmFkaXVzIiwicGFkZGluZyIsIm1hcmdpblRvcCIsImJveFNoYWRvdyIsImRpc3BsYXkiLCJhbGlnbkl0ZW1zIiwicHJldGlwIiwiZm9udFN0eWxlIiwiZm9udFdlaWdodCIsIlBJTksiLCJtYXJnaW5SaWdodCIsIm1pbldpZHRoIiwiYm9yZGVyUmlnaHQiLCJpY29uIiwicmV0aWN1bGF0b3IiLCJsaW5lSGVpZ2h0IiwicmV0aWN1bGF0aW9ucyIsInRpcHMiLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iLCJsZW5ndGgiLCJfcmV0aWN1bGFySGFuZGxlIiwiUHJvamVjdExvYWRlciIsInN0YXRlIiwicmV0aWMiLCJpbmNyZW1lbnRSZXRpY3VsYXRvciIsImNsZWFyVGltZW91dCIsInNldFRpbWVvdXQiLCJzZXRTdGF0ZSIsInRpcFRleHQiLCJDb21wb25lbnQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7QUFFQSxJQUFNQSxTQUFTO0FBQ2JDLHdCQUFzQjtBQUNwQkMsY0FBVSxVQURVO0FBRXBCQyxXQUFPLE1BRmE7QUFHcEJDLFlBQVEsTUFIWTtBQUlwQkMsV0FBTyxrQkFBUUMsSUFKSztBQUtwQkMscUJBQWlCLHFCQUFNLGtCQUFRQyxJQUFkLEVBQW9CQyxJQUFwQixDQUF5QixL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QkFBUXZDLElBQTVCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUZGO0FBREYsU0FERjtBQU9FO0FBQUE7QUFBQSxZQUFLLE9BQU9OLE9BQU9nQixHQUFuQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDRTtBQUFBO0FBQUEsY0FBTSxPQUFPaEIsT0FBTzBCLE1BQXBCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNFO0FBQUE7QUFBQSxnQkFBTSxPQUFPMUIsT0FBT2lDLElBQXBCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUEwQixtRUFBYyxPQUFPLGtCQUFRSixJQUE3QjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBMUIsYUFERjtBQUFBO0FBQUEsV0FERjtBQUtFO0FBQUE7QUFBQSxjQUFNLE9BQU83QixPQUFPa0QsT0FBcEI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQThCbEM7QUFBOUI7QUFMRjtBQVBGLE9BREY7QUFpQkQ7Ozs7RUE3Q3lCLGdCQUFNbUMsUzs7a0JBZ0RuQixzQkFBT1IsYUFBUCxDIiwiZmlsZSI6IlByb2plY3RMb2FkZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgUmFkaXVtIGZyb20gJ3JhZGl1bSdcbmltcG9ydCBDb2xvciBmcm9tICdjb2xvcidcbmltcG9ydCB7IFRocmVlQm91bmNlIH0gZnJvbSAnYmV0dGVyLXJlYWN0LXNwaW5raXQnXG5pbXBvcnQgUGFsZXR0ZSBmcm9tICcuL1BhbGV0dGUnXG5pbXBvcnQgeyBMaWdodEljb25TVkcgfSBmcm9tICcuL0ljb25zJ1xuXG5jb25zdCBTVFlMRVMgPSB7XG4gIGZ1bGxTY3JlZW5DZW50ZXJXcmFwOiB7XG4gICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgd2lkdGg6ICcxMDAlJyxcbiAgICBoZWlnaHQ6ICcxMDAlJyxcbiAgICBjb2xvcjogUGFsZXR0ZS5ST0NLLFxuICAgIGJhY2tncm91bmRDb2xvcjogQ29sb3IoUGFsZXR0ZS5HUkFZKS5mYWRlKDAuMDIzKSxcbiAgICB6SW5kZXg6IDZcbiAgfSxcbiAgY29udGVudEhvbHN0ZXI6IHtcbiAgICB0ZXh0QWxpZ246ICdjZW50ZXInLFxuICAgIHdpZHRoOiA4MjAsXG4gICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgdG9wOiAnNTAlJyxcbiAgICBsZWZ0OiAnNTAlJyxcbiAgICB0cmFuc2Zvcm06ICd0cmFuc2xhdGUoLTUwJSwgLTUwJSknXG4gIH0sXG4gIHRpcDoge1xuICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgIGJvdHRvbTogMTAwLFxuICAgIGxlZnQ6ICc1MCUnLFxuICAgIHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVgoLTUwJSknLFxuICAgIHdpZHRoOiA4MjAsXG4gICAgZm9udFNpemU6IDE2LFxuICAgIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5ST0NLLFxuICAgIGNvbG9yOiBQYWxldHRlLk1FRElVTV9DT0FMLFxuICAgIGJvcmRlclJhZGl1czogNSxcbiAgICBwYWRkaW5nOiAnMTNweCAzMHB4JyxcbiAgICBtYXJnaW5Ub3A6IDUwLFxuICAgIHRleHRBbGlnbjogJ2xlZnQnLFxuICAgIGJveFNoYWRvdzogJzAgMjJweCA3NHB4IDAgcmdiYSgwLDE0LDE0LDAuNDYpJyxcbiAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAgYWxpZ25JdGVtczogJ2NlbnRlcidcbiAgfSxcbiAgcHJldGlwOiB7XG4gICAgZm9udFN0eWxlOiAnaXRhbGljJyxcbiAgICBmb250V2VpZ2h0OiAnYm9sZCcsXG4gICAgY29sb3I6IFBhbGV0dGUuUElOSyxcbiAgICBtYXJnaW5SaWdodDogMTQsXG4gICAgd2lkdGg6IDE2MSxcbiAgICBtaW5XaWR0aDogMTYxLFxuICAgIGJvcmRlclJpZ2h0OiAnMXB4IHNvbGlkIHJnYmEoMTI4LCAxMjgsIDEyOCwgMC4xNCknLFxuICAgIGRpc3BsYXk6ICdmbGV4JyxcbiAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJ1xuICB9LFxuICBpY29uOiB7XG4gICAgbWFyZ2luUmlnaHQ6IDksXG4gICAgbWFyZ2luVG9wOiA1XG4gIH0sXG4gIHJldGljdWxhdG9yOiB7XG4gICAgZm9udFNpemU6IDQ0LFxuICAgIGxpbmVIZWlnaHQ6ICcxLjNlbSdcbiAgfVxufVxuXG5jb25zdCByZXRpY3VsYXRpb25zID0gW1xuICAnQmVhciB3aXRoIHVzIHdoaWxlIHdlIHNldCB1cCB5b3VyIHByb2plY3QuIFRoaXMgY2FuIHRha2Ugc2V2ZXJhbCBtb21lbnRzJyxcbiAgJ1JldGljdWxhdGluZyBzcGxpbmVzJyxcbiAgJ0NvbmZpZ3VyaW5nIHZlcnNpb24gY29udHJvbCcsXG4gICdDb25uZWN0aW5nIHRvIHJlcG9zaXRvcnknLFxuICAnQ2hlY2tpbmcgZm9yIGNoYW5nZXMgZnJvbSBjb2xsYWJvcmF0b3JzIG9uIHlvdXIgdGVhbScsXG4gICdTeW5jaW5nIHdpdGggSGFpa3UgQ2xvdWQnLFxuICAnTG9hZGluZyBwcm9qZWN0IGZpbGVzJyxcbiAgJ1ByZXBhcmluZyBkZXNpZ24gZmlsZXMnLFxuICAnUHJlcGFyaW5nIGNvZGUgZmlsZXMnLFxuICAnSW5zdGFsbGluZyBkZXBlbmRlbmNpZXMnLFxuICAnQ2hlY2tpbmcgZm9yIEhhaWt1IFBsYXllciB1cGRhdGVzJyxcbiAgJ1dhdGNoaW5nIHNvdXJjZSBmaWxlcyBmb3IgY2hhbmdlcycsXG4gICdJbml0aWFsaXppbmcgY29tcG9uZW50J1xuXVxuXG5jb25zdCB0aXBzID0gW1xuICAnRGlkIHlvdSBrbm93PyBFdmVyeSBjaGFuZ2UgeW91IG1ha2UgaW4gSGFpa3UgaXMgdHJhY2tlZCBhcyBhIEdpdCBjb21taXQnLFxuICAnRm9yIGEgYm91bmN5IGFuaW1hdGlvbiBlZmZlY3QsIHRyeSBNYWtlIFR3ZWVuID4gRWFzZSBJbiBPdXQgPiBFbGFzdGljJyxcbiAgXCJUcnkgdXNpbmcgZGlmZmVyZW50IGVhc2luZyBjdXJ2ZXMgZm9yIFBvc2l0aW9uIFggYW5kIFBvc2l0aW9uIFkuIFlvdSdsbCBiZSBzdXJwcmlzZWQgYXQgd2hhdCB5b3UgY2FuIGNyZWF0ZVwiLFxuICAnSW1wb3J0IGFueSBTa2V0Y2ggZmlsZSwgdGhlbiBkcmFnIGFuZCBkcm9wIGRlc2lnbiBlbGVtZW50cyBvbiBzdGFnZSB0byBhbmltYXRlJyxcbiAgXCJXaGlsZSB5b3UncmUgZGVzaWduaW5nIGluIFNrZXRjaCwgcmVtZW1iZXIgdG8gbWFrZSBzbGljZXMgb2YgYWxsIHRoZSBwaWVjZXMgeW91IHdhbnQgdG8gYW5pbWF0ZVwiLFxuICBcIkRpZCB5b3Uga25vdz8gSGFpa3UgaXMgZm9yIGVuZ2luZWVycyB0b28uIFlvdXIgYW5pbWF0aW9uIGlzIHBsYWluIG9sJyBKYXZhU2NyaXB0IGNvZGVcIixcbiAgJ1doZW4geW91ciBhbmltYXRpb24gaXMgcmVhZHksIGNsaWNrIOKAnFB1Ymxpc2jigJ0gdG8gZ2V0IGNvZGUgc25pcHBldHMgdG8gZW1iZWQnXG5dXG5cbmNvbnN0IHRpcCA9IHRpcHNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogdGlwcy5sZW5ndGgpXVxudmFyIF9yZXRpY3VsYXJIYW5kbGVcblxuY2xhc3MgUHJvamVjdExvYWRlciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yICgpIHtcbiAgICBzdXBlcigpXG5cbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgcmV0aWM6IDBcbiAgICB9XG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCAoKSB7XG4gICAgdGhpcy5pbmNyZW1lbnRSZXRpY3VsYXRvcigpXG4gIH1cblxuICBjb21wb25lbnRXaWxsVW5tb3VudCAoKSB7XG4gICAgaWYgKF9yZXRpY3VsYXJIYW5kbGUpIHtcbiAgICAgIGNsZWFyVGltZW91dChfcmV0aWN1bGFySGFuZGxlKVxuICAgIH1cbiAgfVxuXG4gIGluY3JlbWVudFJldGljdWxhdG9yICgpIHtcbiAgICBfcmV0aWN1bGFySGFuZGxlID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtyZXRpYzogdGhpcy5zdGF0ZS5yZXRpYyArIDF9LCAoKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLnN0YXRlLnJldGljICE9PSByZXRpY3VsYXRpb25zLmxlbmd0aCAtIDEpIHRoaXMuaW5jcmVtZW50UmV0aWN1bGF0b3IoKVxuICAgICAgfSlcbiAgICB9LCA1MjAwKVxuICB9XG5cbiAgcmVuZGVyICgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBzdHlsZT17U1RZTEVTLmZ1bGxTY3JlZW5DZW50ZXJXcmFwfT5cbiAgICAgICAgPGRpdiBzdHlsZT17U1RZTEVTLmNvbnRlbnRIb2xzdGVyfT5cbiAgICAgICAgICA8ZGl2IHN0eWxlPXtTVFlMRVMucmV0aWN1bGF0b3J9PlxuICAgICAgICAgICAge3JldGljdWxhdGlvbnNbdGhpcy5zdGF0ZS5yZXRpY119XG4gICAgICAgICAgICA8VGhyZWVCb3VuY2UgY29sb3I9e1BhbGV0dGUuUk9DS30gLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgc3R5bGU9e1NUWUxFUy50aXB9PlxuICAgICAgICAgIDxzcGFuIHN0eWxlPXtTVFlMRVMucHJldGlwfT5cbiAgICAgICAgICAgIDxzcGFuIHN0eWxlPXtTVFlMRVMuaWNvbn0+PExpZ2h0SWNvblNWRyBjb2xvcj17UGFsZXR0ZS5QSU5LfSAvPjwvc3Bhbj5cbiAgICAgICAgICAgIFRpcCBvZiB0aGUgTG9hZFxuICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICA8c3BhbiBzdHlsZT17U1RZTEVTLnRpcFRleHR9Pnt0aXB9PC9zcGFuPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBSYWRpdW0oUHJvamVjdExvYWRlcilcbiJdfQ==