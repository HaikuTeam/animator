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
    key: 'incrementReticulator',
    value: function incrementReticulator() {
      var _this2 = this;

      setTimeout(function () {
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
            lineNumber: 114
          },
          __self: this
        },
        _react2.default.createElement(
          'div',
          { style: STYLES.contentHolster, __source: {
              fileName: _jsxFileName,
              lineNumber: 115
            },
            __self: this
          },
          _react2.default.createElement(
            'div',
            { style: STYLES.reticulator, __source: {
                fileName: _jsxFileName,
                lineNumber: 116
              },
              __self: this
            },
            reticulations[this.state.retic],
            _react2.default.createElement(_betterReactSpinkit.ThreeBounce, { color: _Palette2.default.ROCK, __source: {
                fileName: _jsxFileName,
                lineNumber: 118
              },
              __self: this
            })
          )
        ),
        _react2.default.createElement(
          'div',
          { style: STYLES.tip, __source: {
              fileName: _jsxFileName,
              lineNumber: 121
            },
            __self: this
          },
          _react2.default.createElement(
            'span',
            { style: STYLES.pretip, __source: {
                fileName: _jsxFileName,
                lineNumber: 122
              },
              __self: this
            },
            _react2.default.createElement(
              'span',
              { style: STYLES.icon, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 123
                },
                __self: this
              },
              _react2.default.createElement(_Icons.LightIconSVG, { color: _Palette2.default.PINK, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 123
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
                lineNumber: 126
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9yZWFjdC9jb21wb25lbnRzL1Byb2plY3RMb2FkZXIuanMiXSwibmFtZXMiOlsiU1RZTEVTIiwiZnVsbFNjcmVlbkNlbnRlcldyYXAiLCJwb3NpdGlvbiIsIndpZHRoIiwiaGVpZ2h0IiwiY29sb3IiLCJST0NLIiwiYmFja2dyb3VuZENvbG9yIiwiR1JBWSIsImZhZGUiLCJ6SW5kZXgiLCJjb250ZW50SG9sc3RlciIsInRleHRBbGlnbiIsInRvcCIsImxlZnQiLCJ0cmFuc2Zvcm0iLCJ0aXAiLCJib3R0b20iLCJmb250U2l6ZSIsIk1FRElVTV9DT0FMIiwiYm9yZGVyUmFkaXVzIiwicGFkZGluZyIsIm1hcmdpblRvcCIsImJveFNoYWRvdyIsImRpc3BsYXkiLCJhbGlnbkl0ZW1zIiwicHJldGlwIiwiZm9udFN0eWxlIiwiZm9udFdlaWdodCIsIlBJTksiLCJtYXJnaW5SaWdodCIsIm1pbldpZHRoIiwiYm9yZGVyUmlnaHQiLCJpY29uIiwicmV0aWN1bGF0b3IiLCJsaW5lSGVpZ2h0IiwicmV0aWN1bGF0aW9ucyIsInRpcHMiLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iLCJsZW5ndGgiLCJQcm9qZWN0TG9hZGVyIiwic3RhdGUiLCJyZXRpYyIsImluY3JlbWVudFJldGljdWxhdG9yIiwic2V0VGltZW91dCIsInNldFN0YXRlIiwidGlwVGV4dCIsIkNvbXBvbmVudCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7OztBQUVBLElBQU1BLFNBQVM7QUFDYkMsd0JBQXNCO0FBQ3BCQyxjQUFVLFVBRFU7QUFFcEJDLFdBQU8sTUFGYTtBQUdwQkMsWUFBUSxNQUhZO0FBSXBCQyxXQUFPLGtCQUFRQyxJQUpLO0FBS3BCQyxxQkFBaUIscUJBQU0sa0JBQVFDLElBQWQsRUFBb0JDLElBQXBCLENBQXlCLEtBQXpCLENBTEc7QUFNcEJDLFlBQVE7QUFOWSxHQURUO0FBU2JDLGtCQUFnQjtBQUNkQyxlQUFXLFFBREc7QUFFZFQsV0FBTyxHQUZPO0FBR2RELGNBQVUsVUFISTtBQUlkVyxTQUFLLEtBSlM7QUFLZEMsVUFBTSxLQUxRO0FBTWRDLGVBQVc7QUFORyxHQVRIO0FBaUJiQyxPQUFLO0FBQ0hkLGNBQVUsVUFEUDtBQUVIZSxZQUFRLEdBRkw7QUFHSEgsVUFBTSxLQUhIO0FBSUhDLGVBQVcsa0JBSlI7QUFLSFosV0FBTyxHQUxKO0FBTUhlLGNBQVUsRUFOUDtBQU9IWCxxQkFBaUIsa0JBQVFELElBUHRCO0FBUUhELFdBQU8sa0JBQVFjLFdBUlo7QUFTSEMsa0JBQWMsQ0FUWDtBQVVIQyxhQUFTLFdBVk47QUFXSEMsZUFBVyxFQVhSO0FBWUhWLGVBQVcsTUFaUjtBQWFIVyxlQUFXLGtDQWJSO0FBY0hDLGFBQVMsTUFkTjtBQWVIQyxnQkFBWTtBQWZULEdBakJRO0FBa0NiQyxVQUFRO0FBQ05DLGVBQVcsUUFETDtBQUVOQyxnQkFBWSxNQUZOO0FBR052QixXQUFPLGtCQUFRd0IsSUFIVDtBQUlOQyxpQkFBYSxFQUpQO0FBS04zQixXQUFPLEdBTEQ7QUFNTjRCLGNBQVUsR0FOSjtBQU9OQyxpQkFBYSxxQ0FQUDtBQVFOUixhQUFTLE1BUkg7QUFTTkMsZ0JBQVk7QUFUTixHQWxDSztBQTZDYlEsUUFBTTtBQUNKSCxpQkFBYSxDQURUO0FBRUpSLGVBQVc7QUFGUCxHQTdDTztBQWlEYlksZUFBYTtBQUNYaEIsY0FBVSxFQURDO0FBRVhpQixnQkFBWTtBQUZEO0FBakRBLENBQWY7O0FBdURBLElBQU1DLGdCQUFnQixDQUNwQiwwRUFEb0IsRUFFcEIsc0JBRm9CLEVBR3BCLDZCQUhvQixFQUlwQiwwQkFKb0IsRUFLcEIsc0RBTG9CLEVBTXBCLDBCQU5vQixFQU9wQix1QkFQb0IsRUFRcEIsd0JBUm9CLEVBU3BCLHNCQVRvQixFQVVwQix5QkFWb0IsRUFXcEIsbUNBWG9CLEVBWXBCLG1DQVpvQixFQWFwQix3QkFib0IsQ0FBdEI7O0FBZ0JBLElBQU1DLE9BQU8sQ0FDWCx5RUFEVyxFQUVYLHVFQUZXLEVBR1gsNkdBSFcsRUFJWCxnRkFKVyxFQUtYLGlHQUxXLEVBTVgsdUZBTlcsRUFPWCw2RUFQVyxDQUFiOztBQVVBLElBQU1yQixNQUFNcUIsS0FBS0MsS0FBS0MsS0FBTCxDQUFXRCxLQUFLRSxNQUFMLEtBQWdCSCxLQUFLSSxNQUFoQyxDQUFMLENBQVo7O0lBRU1DLGE7OztBQUNKLDJCQUFlO0FBQUE7O0FBQUE7O0FBR2IsVUFBS0MsS0FBTCxHQUFhO0FBQ1hDLGFBQU87QUFESSxLQUFiO0FBSGE7QUFNZDs7Ozt3Q0FFb0I7QUFDbkIsV0FBS0Msb0JBQUw7QUFDRDs7OzJDQUV1QjtBQUFBOztBQUN0QkMsaUJBQVcsWUFBTTtBQUNmLGVBQUtDLFFBQUwsQ0FBYyxFQUFDSCxPQUFPLE9BQUtELEtBQUwsQ0FBV0MsS0FBWCxHQUFtQixDQUEzQixFQUFkLEVBQTZDLFlBQU07QUFDakQsY0FBSSxPQUFLRCxLQUFMLENBQVdDLEtBQVgsS0FBcUJSLGNBQWNLLE1BQWQsR0FBdUIsQ0FBaEQsRUFBbUQsT0FBS0ksb0JBQUw7QUFDcEQsU0FGRDtBQUdELE9BSkQsRUFJRyxJQUpIO0FBS0Q7Ozs2QkFFUztBQUNSLGFBQ0U7QUFBQTtBQUFBLFVBQUssT0FBTzdDLE9BQU9DLG9CQUFuQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDRTtBQUFBO0FBQUEsWUFBSyxPQUFPRCxPQUFPVyxjQUFuQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDRTtBQUFBO0FBQUEsY0FBSyxPQUFPWCxPQUFPa0MsV0FBbkI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0dFLDBCQUFjLEtBQUtPLEtBQUwsQ0FBV0MsS0FBekIsQ0FESDtBQUVFLDZFQUFhLE9BQU8sa0JBQVF0QyxJQUE1QjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFGRjtBQURGLFNBREY7QUFPRTtBQUFBO0FBQUEsWUFBSyxPQUFPTixPQUFPZ0IsR0FBbkI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0U7QUFBQTtBQUFBLGNBQU0sT0FBT2hCLE9BQU8wQixNQUFwQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDRTtBQUFBO0FBQUEsZ0JBQU0sT0FBTzFCLE9BQU9pQyxJQUFwQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBMEIsbUVBQWMsT0FBTyxrQkFBUUosSUFBN0I7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQTFCLGFBREY7QUFBQTtBQUFBLFdBREY7QUFLRTtBQUFBO0FBQUEsY0FBTSxPQUFPN0IsT0FBT2dELE9BQXBCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUE4QmhDO0FBQTlCO0FBTEY7QUFQRixPQURGO0FBaUJEOzs7O0VBdkN5QixnQkFBTWlDLFM7O2tCQTBDbkIsc0JBQU9QLGFBQVAsQyIsImZpbGUiOiJQcm9qZWN0TG9hZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IFJhZGl1bSBmcm9tICdyYWRpdW0nXG5pbXBvcnQgQ29sb3IgZnJvbSAnY29sb3InXG5pbXBvcnQgeyBUaHJlZUJvdW5jZSB9IGZyb20gJ2JldHRlci1yZWFjdC1zcGlua2l0J1xuaW1wb3J0IFBhbGV0dGUgZnJvbSAnLi9QYWxldHRlJ1xuaW1wb3J0IHsgTGlnaHRJY29uU1ZHIH0gZnJvbSAnLi9JY29ucydcblxuY29uc3QgU1RZTEVTID0ge1xuICBmdWxsU2NyZWVuQ2VudGVyV3JhcDoge1xuICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgIHdpZHRoOiAnMTAwJScsXG4gICAgaGVpZ2h0OiAnMTAwJScsXG4gICAgY29sb3I6IFBhbGV0dGUuUk9DSyxcbiAgICBiYWNrZ3JvdW5kQ29sb3I6IENvbG9yKFBhbGV0dGUuR1JBWSkuZmFkZSgwLjAyMyksXG4gICAgekluZGV4OiA2XG4gIH0sXG4gIGNvbnRlbnRIb2xzdGVyOiB7XG4gICAgdGV4dEFsaWduOiAnY2VudGVyJyxcbiAgICB3aWR0aDogODIwLFxuICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgIHRvcDogJzUwJScsXG4gICAgbGVmdDogJzUwJScsXG4gICAgdHJhbnNmb3JtOiAndHJhbnNsYXRlKC01MCUsIC01MCUpJ1xuICB9LFxuICB0aXA6IHtcbiAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICBib3R0b206IDEwMCxcbiAgICBsZWZ0OiAnNTAlJyxcbiAgICB0cmFuc2Zvcm06ICd0cmFuc2xhdGVYKC01MCUpJyxcbiAgICB3aWR0aDogODIwLFxuICAgIGZvbnRTaXplOiAxNixcbiAgICBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuUk9DSyxcbiAgICBjb2xvcjogUGFsZXR0ZS5NRURJVU1fQ09BTCxcbiAgICBib3JkZXJSYWRpdXM6IDUsXG4gICAgcGFkZGluZzogJzEzcHggMzBweCcsXG4gICAgbWFyZ2luVG9wOiA1MCxcbiAgICB0ZXh0QWxpZ246ICdsZWZ0JyxcbiAgICBib3hTaGFkb3c6ICcwIDIycHggNzRweCAwIHJnYmEoMCwxNCwxNCwwLjQ2KScsXG4gICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgIGFsaWduSXRlbXM6ICdjZW50ZXInXG4gIH0sXG4gIHByZXRpcDoge1xuICAgIGZvbnRTdHlsZTogJ2l0YWxpYycsXG4gICAgZm9udFdlaWdodDogJ2JvbGQnLFxuICAgIGNvbG9yOiBQYWxldHRlLlBJTkssXG4gICAgbWFyZ2luUmlnaHQ6IDE0LFxuICAgIHdpZHRoOiAxNjEsXG4gICAgbWluV2lkdGg6IDE2MSxcbiAgICBib3JkZXJSaWdodDogJzFweCBzb2xpZCByZ2JhKDEyOCwgMTI4LCAxMjgsIDAuMTQpJyxcbiAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAgYWxpZ25JdGVtczogJ2NlbnRlcidcbiAgfSxcbiAgaWNvbjoge1xuICAgIG1hcmdpblJpZ2h0OiA5LFxuICAgIG1hcmdpblRvcDogNVxuICB9LFxuICByZXRpY3VsYXRvcjoge1xuICAgIGZvbnRTaXplOiA0NCxcbiAgICBsaW5lSGVpZ2h0OiAnMS4zZW0nXG4gIH1cbn1cblxuY29uc3QgcmV0aWN1bGF0aW9ucyA9IFtcbiAgJ0JlYXIgd2l0aCB1cyB3aGlsZSB3ZSBzZXQgdXAgeW91ciBwcm9qZWN0LiBUaGlzIGNhbiB0YWtlIHNldmVyYWwgbW9tZW50cycsXG4gICdSZXRpY3VsYXRpbmcgc3BsaW5lcycsXG4gICdDb25maWd1cmluZyB2ZXJzaW9uIGNvbnRyb2wnLFxuICAnQ29ubmVjdGluZyB0byByZXBvc2l0b3J5JyxcbiAgJ0NoZWNraW5nIGZvciBjaGFuZ2VzIGZyb20gY29sbGFib3JhdG9ycyBvbiB5b3VyIHRlYW0nLFxuICAnU3luY2luZyB3aXRoIEhhaWt1IENsb3VkJyxcbiAgJ0xvYWRpbmcgcHJvamVjdCBmaWxlcycsXG4gICdQcmVwYXJpbmcgZGVzaWduIGZpbGVzJyxcbiAgJ1ByZXBhcmluZyBjb2RlIGZpbGVzJyxcbiAgJ0luc3RhbGxpbmcgZGVwZW5kZW5jaWVzJyxcbiAgJ0NoZWNraW5nIGZvciBIYWlrdSBQbGF5ZXIgdXBkYXRlcycsXG4gICdXYXRjaGluZyBzb3VyY2UgZmlsZXMgZm9yIGNoYW5nZXMnLFxuICAnSW5pdGlhbGl6aW5nIGNvbXBvbmVudCdcbl1cblxuY29uc3QgdGlwcyA9IFtcbiAgJ0RpZCB5b3Uga25vdz8gRXZlcnkgY2hhbmdlIHlvdSBtYWtlIGluIEhhaWt1IGlzIHRyYWNrZWQgYXMgYSBHaXQgY29tbWl0JyxcbiAgJ0ZvciBhIGJvdW5jeSBhbmltYXRpb24gZWZmZWN0LCB0cnkgTWFrZSBUd2VlbiA+IEVhc2UgSW4gT3V0ID4gRWxhc3RpYycsXG4gIFwiVHJ5IHVzaW5nIGRpZmZlcmVudCBlYXNpbmcgY3VydmVzIGZvciBQb3NpdGlvbiBYIGFuZCBQb3NpdGlvbiBZLiBZb3UnbGwgYmUgc3VycHJpc2VkIGF0IHdoYXQgeW91IGNhbiBjcmVhdGVcIixcbiAgJ0ltcG9ydCBhbnkgU2tldGNoIGZpbGUsIHRoZW4gZHJhZyBhbmQgZHJvcCBkZXNpZ24gZWxlbWVudHMgb24gc3RhZ2UgdG8gYW5pbWF0ZScsXG4gIFwiV2hpbGUgeW91J3JlIGRlc2lnbmluZyBpbiBTa2V0Y2gsIHJlbWVtYmVyIHRvIG1ha2Ugc2xpY2VzIG9mIGFsbCB0aGUgcGllY2VzIHlvdSB3YW50IHRvIGFuaW1hdGVcIixcbiAgXCJEaWQgeW91IGtub3c/IEhhaWt1IGlzIGZvciBlbmdpbmVlcnMgdG9vLiBZb3VyIGFuaW1hdGlvbiBpcyBwbGFpbiBvbCcgSmF2YVNjcmlwdCBjb2RlXCIsXG4gICdXaGVuIHlvdXIgYW5pbWF0aW9uIGlzIHJlYWR5LCBjbGljayDigJxQdWJsaXNo4oCdIHRvIGdldCBjb2RlIHNuaXBwZXRzIHRvIGVtYmVkJ1xuXVxuXG5jb25zdCB0aXAgPSB0aXBzW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHRpcHMubGVuZ3RoKV1cblxuY2xhc3MgUHJvamVjdExvYWRlciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yICgpIHtcbiAgICBzdXBlcigpXG5cbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgcmV0aWM6IDBcbiAgICB9XG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCAoKSB7XG4gICAgdGhpcy5pbmNyZW1lbnRSZXRpY3VsYXRvcigpXG4gIH1cblxuICBpbmNyZW1lbnRSZXRpY3VsYXRvciAoKSB7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtyZXRpYzogdGhpcy5zdGF0ZS5yZXRpYyArIDF9LCAoKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLnN0YXRlLnJldGljICE9PSByZXRpY3VsYXRpb25zLmxlbmd0aCAtIDEpIHRoaXMuaW5jcmVtZW50UmV0aWN1bGF0b3IoKVxuICAgICAgfSlcbiAgICB9LCA1MjAwKVxuICB9XG5cbiAgcmVuZGVyICgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBzdHlsZT17U1RZTEVTLmZ1bGxTY3JlZW5DZW50ZXJXcmFwfT5cbiAgICAgICAgPGRpdiBzdHlsZT17U1RZTEVTLmNvbnRlbnRIb2xzdGVyfT5cbiAgICAgICAgICA8ZGl2IHN0eWxlPXtTVFlMRVMucmV0aWN1bGF0b3J9PlxuICAgICAgICAgICAge3JldGljdWxhdGlvbnNbdGhpcy5zdGF0ZS5yZXRpY119XG4gICAgICAgICAgICA8VGhyZWVCb3VuY2UgY29sb3I9e1BhbGV0dGUuUk9DS30gLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgc3R5bGU9e1NUWUxFUy50aXB9PlxuICAgICAgICAgIDxzcGFuIHN0eWxlPXtTVFlMRVMucHJldGlwfT5cbiAgICAgICAgICAgIDxzcGFuIHN0eWxlPXtTVFlMRVMuaWNvbn0+PExpZ2h0SWNvblNWRyBjb2xvcj17UGFsZXR0ZS5QSU5LfSAvPjwvc3Bhbj5cbiAgICAgICAgICAgIFRpcCBvZiB0aGUgTG9hZFxuICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICA8c3BhbiBzdHlsZT17U1RZTEVTLnRpcFRleHR9Pnt0aXB9PC9zcGFuPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBSYWRpdW0oUHJvamVjdExvYWRlcilcbiJdfQ==