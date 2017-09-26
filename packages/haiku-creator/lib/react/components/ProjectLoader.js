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
            lineNumber: 115
          },
          __self: this
        },
        _react2.default.createElement(
          'div',
          { style: STYLES.contentHolster, __source: {
              fileName: _jsxFileName,
              lineNumber: 116
            },
            __self: this
          },
          _react2.default.createElement(
            'div',
            { style: STYLES.reticulator, __source: {
                fileName: _jsxFileName,
                lineNumber: 117
              },
              __self: this
            },
            reticulations[this.state.retic],
            _react2.default.createElement(_betterReactSpinkit.ThreeBounce, { color: _Palette2.default.ROCK, __source: {
                fileName: _jsxFileName,
                lineNumber: 119
              },
              __self: this
            })
          )
        ),
        _react2.default.createElement(
          'div',
          { style: STYLES.tip, __source: {
              fileName: _jsxFileName,
              lineNumber: 122
            },
            __self: this
          },
          _react2.default.createElement(
            'span',
            { style: STYLES.pretip, __source: {
                fileName: _jsxFileName,
                lineNumber: 123
              },
              __self: this
            },
            _react2.default.createElement(
              'span',
              { style: STYLES.icon, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 124
                },
                __self: this
              },
              _react2.default.createElement(_Icons.LightIconSVG, { color: _Palette2.default.PINK, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 124
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
                lineNumber: 127
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9yZWFjdC9jb21wb25lbnRzL1Byb2plY3RMb2FkZXIuanMiXSwibmFtZXMiOlsiU1RZTEVTIiwiZnVsbFNjcmVlbkNlbnRlcldyYXAiLCJwb3NpdGlvbiIsIndpZHRoIiwiaGVpZ2h0IiwiY29sb3IiLCJST0NLIiwiYmFja2dyb3VuZENvbG9yIiwiR1JBWSIsImZhZGUiLCJ6SW5kZXgiLCJjb250ZW50SG9sc3RlciIsInRleHRBbGlnbiIsInRvcCIsImxlZnQiLCJ0cmFuc2Zvcm0iLCJ0aXAiLCJib3R0b20iLCJmb250U2l6ZSIsIk1FRElVTV9DT0FMIiwiYm9yZGVyUmFkaXVzIiwicGFkZGluZyIsIm1hcmdpblRvcCIsImJveFNoYWRvdyIsImRpc3BsYXkiLCJhbGlnbkl0ZW1zIiwicHJldGlwIiwiZm9udFN0eWxlIiwiZm9udFdlaWdodCIsIlBJTksiLCJtYXJnaW5SaWdodCIsIm1pbldpZHRoIiwiYm9yZGVyUmlnaHQiLCJpY29uIiwicmV0aWN1bGF0b3IiLCJsaW5lSGVpZ2h0IiwicmV0aWN1bGF0aW9ucyIsInRpcHMiLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iLCJsZW5ndGgiLCJQcm9qZWN0TG9hZGVyIiwic3RhdGUiLCJyZXRpYyIsImluY3JlbWVudFJldGljdWxhdG9yIiwic2V0VGltZW91dCIsInNldFN0YXRlIiwidGlwVGV4dCIsIkNvbXBvbmVudCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7OztBQUVBLElBQU1BLFNBQVM7QUFDYkMsd0JBQXNCO0FBQ3BCQyxjQUFVLFVBRFU7QUFFcEJDLFdBQU8sTUFGYTtBQUdwQkMsWUFBUSxNQUhZO0FBSXBCQyxXQUFPLGtCQUFRQyxJQUpLO0FBS3BCQyxxQkFBaUIscUJBQU0sa0JBQVFDLElBQWQsRUFBb0JDLElBQXBCLENBQXlCLEtBQXpCLENBTEc7QUFNcEJDLFlBQVE7QUFOWSxHQURUO0FB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QUNFO0FBQUE7QUFBQSxjQUFNLE9BQU9oQixPQUFPMEIsTUFBcEI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0U7QUFBQTtBQUFBLGdCQUFNLE9BQU8xQixPQUFPaUMsSUFBcEI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQTBCLG1FQUFjLE9BQU8sa0JBQVFKLElBQTdCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUExQixhQURGO0FBQUE7QUFBQSxXQURGO0FBS0U7QUFBQTtBQUFBLGNBQU0sT0FBTzdCLE9BQU9nRCxPQUFwQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBOEJoQztBQUE5QjtBQUxGO0FBUEYsT0FERjtBQWlCRDs7OztFQXZDeUIsZ0JBQU1pQyxTOztrQkEwQ25CLHNCQUFPUCxhQUFQLEMiLCJmaWxlIjoiUHJvamVjdExvYWRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCBSYWRpdW0gZnJvbSAncmFkaXVtJ1xuaW1wb3J0IENvbG9yIGZyb20gJ2NvbG9yJ1xuaW1wb3J0IHsgVGhyZWVCb3VuY2UgfSBmcm9tICdiZXR0ZXItcmVhY3Qtc3BpbmtpdCdcbmltcG9ydCBQYWxldHRlIGZyb20gJy4vUGFsZXR0ZSdcbmltcG9ydCB7IExpZ2h0SWNvblNWRyB9IGZyb20gJy4vSWNvbnMnXG5cbmNvbnN0IFNUWUxFUyA9IHtcbiAgZnVsbFNjcmVlbkNlbnRlcldyYXA6IHtcbiAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICB3aWR0aDogJzEwMCUnLFxuICAgIGhlaWdodDogJzEwMCUnLFxuICAgIGNvbG9yOiBQYWxldHRlLlJPQ0ssXG4gICAgYmFja2dyb3VuZENvbG9yOiBDb2xvcihQYWxldHRlLkdSQVkpLmZhZGUoMC4wMjMpLFxuICAgIHpJbmRleDogNlxuICB9LFxuICBjb250ZW50SG9sc3Rlcjoge1xuICAgIHRleHRBbGlnbjogJ2NlbnRlcicsXG4gICAgd2lkdGg6IDgyMCxcbiAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICB0b3A6ICc1MCUnLFxuICAgIGxlZnQ6ICc1MCUnLFxuICAgIHRyYW5zZm9ybTogJ3RyYW5zbGF0ZSgtNTAlLCAtNTAlKSdcbiAgfSxcbiAgdGlwOiB7XG4gICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgYm90dG9tOiAxMDAsXG4gICAgbGVmdDogJzUwJScsXG4gICAgdHJhbnNmb3JtOiAndHJhbnNsYXRlWCgtNTAlKScsXG4gICAgd2lkdGg6IDgyMCxcbiAgICBmb250U2l6ZTogMTYsXG4gICAgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLlJPQ0ssXG4gICAgY29sb3I6IFBhbGV0dGUuTUVESVVNX0NPQUwsXG4gICAgYm9yZGVyUmFkaXVzOiA1LFxuICAgIHBhZGRpbmc6ICcxM3B4IDMwcHgnLFxuICAgIG1hcmdpblRvcDogNTAsXG4gICAgdGV4dEFsaWduOiAnbGVmdCcsXG4gICAgYm94U2hhZG93OiAnMCAyMnB4IDc0cHggMCByZ2JhKDAsMTQsMTQsMC40NiknLFxuICAgIGRpc3BsYXk6ICdmbGV4JyxcbiAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJ1xuICB9LFxuICBwcmV0aXA6IHtcbiAgICBmb250U3R5bGU6ICdpdGFsaWMnLFxuICAgIGZvbnRXZWlnaHQ6ICdib2xkJyxcbiAgICBjb2xvcjogUGFsZXR0ZS5QSU5LLFxuICAgIG1hcmdpblJpZ2h0OiAxNCxcbiAgICB3aWR0aDogMTYxLFxuICAgIG1pbldpZHRoOiAxNjEsXG4gICAgYm9yZGVyUmlnaHQ6ICcxcHggc29saWQgcmdiYSgxMjgsIDEyOCwgMTI4LCAwLjE0KScsXG4gICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgIGFsaWduSXRlbXM6ICdjZW50ZXInXG4gIH0sXG4gIGljb246IHtcbiAgICBtYXJnaW5SaWdodDogOSxcbiAgICBtYXJnaW5Ub3A6IDVcbiAgfSxcbiAgcmV0aWN1bGF0b3I6IHtcbiAgICBmb250U2l6ZTogNDQsXG4gICAgbGluZUhlaWdodDogJzEuM2VtJ1xuICB9XG59XG5cbmNvbnN0IHJldGljdWxhdGlvbnMgPSBbXG4gICdCZWFyIHdpdGggdXMgd2hpbGUgd2Ugc2V0IHVwIHlvdXIgcHJvamVjdC4gVGhpcyBjYW4gdGFrZSBzZXZlcmFsIG1vbWVudHMnLFxuICAnQ29uZmlndXJpbmcgdmVyc2lvbiBjb250cm9sIHN5c3RlbScsXG4gICdDb25uZWN0aW5nIHRvIHJlbW90ZSBjb2RlIHJlcG9zaXRvcnknLFxuICAnQ2hlY2tpbmcgZm9yIGNoYW5nZXMgZnJvbSBvdGhlciBjb2xsYWJvcmF0b3JzIG9uIHlvdXIgdGVhbScsXG4gICdTeW5jaW5nIGNoYW5nZXMgZnJvbSBIYWlrdSBDbG91ZCcsXG4gICdNZXJnaW5nIGNoYW5nZXMnLFxuICAnTG9hZGluZyB5b3VyIHByb2plY3QgZmlsZXMnLFxuICAnUHJlcGFyaW5nIHlvdXIgZGVzaWduIGZpbGVzJyxcbiAgJ1ByZXBhcmluZyB5b3VyIGNvZGUgZmlsZXMnLFxuICAnSW5zdGFsbGluZyBkZXBlbmRlbmNpZXMnLFxuICAnQ2hlY2tpbmcgZm9yIEhhaWt1IFBsYXllciB1cGRhdGVzJyxcbiAgJ1dhdGNoaW5nIHlvdXIgc291cmNlIGZpbGVzIGZvciBjaGFuZ2VzJyxcbiAgJ0luaXRpYWxpemluZyB5b3VyIGNvbXBvbmVudCcsXG4gICdTZXR0aW5nIHVwIHRoZSBzdGFnZSBhbmQgdGltZWxpbmUnXG5dXG5cbmNvbnN0IHRpcHMgPSBbXG4gICdEaWQgeW91IGtub3c/IEV2ZXJ5IGNoYW5nZSB5b3UgbWFrZSBpbiBIYWlrdSBpcyB0cmFja2VkIGFzIGEgR2l0IGNvbW1pdCEnLFxuICAnRm9yIGEgZ3JlYXQgYm91bmN5IGFuaW1hdGlvbiBlZmZlY3QsIHRyeSBNYWtlIFR3ZWVuID4gRWFzZSBJbiBPdXQgPiBFbGFzdGljJyxcbiAgXCJUbyBhbmltYXRlIGFsb25nIGEgY3VydmUsIHRyeSB1c2luZyBkaWZmZXJlbnQgZWFzaW5nIGN1cnZlcyBmb3IgUG9zaXRpb24gWCBhbmQgUG9zaXRpb24gWS4gIFlvdSdsbCBiZSBzdXJwcmlzZWQgd2hhdCB5b3UgY2FuIGNyZWF0ZSFcIixcbiAgJ0ltcG9ydCBhbnkgU2tldGNoIGZpbGUsIHRoZW4gZHJhZyBhbmQgZHJvcCBkZXNpZ24gZWxlbWVudHMgb24gc3RhZ2UgdG8gYW5pbWF0ZScsXG4gIFwiV2hpbGUgeW91J3JlIGRlc2lnbmluZyBpbiBTa2V0Y2gsIHJlbWVtYmVyIHRvIG1ha2Ugc2xpY2VzIG9mIGFsbCB0aGUgcGllY2VzIHlvdSB3YW50IHRvIGFuaW1hdGVcIixcbiAgXCJEaWQgeW91IGtub3c/IEhhaWt1IGlzIGZvciBlbmdpbmVlcnMgdG9vLiBZb3VyIGFuaW1hdGlvbiBpcyBwbGFpbiBvbCcgSmF2YVNjcmlwdCBjb2RlXCIsXG4gICdXaGVuIHlvdXIgYW5pbWF0aW9uIGlzIHJlYWR5LCBjbGljayDigJxQdWJsaXNo4oCdIHRvIGdldCBjb2RlIHNuaXBwZXRzIGZvciBlbWJlZGRpbmcnXG5dXG5cbmNvbnN0IHRpcCA9IHRpcHNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogdGlwcy5sZW5ndGgpXVxuXG5jbGFzcyBQcm9qZWN0TG9hZGVyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IgKCkge1xuICAgIHN1cGVyKClcblxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICByZXRpYzogMFxuICAgIH1cbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50ICgpIHtcbiAgICB0aGlzLmluY3JlbWVudFJldGljdWxhdG9yKClcbiAgfVxuXG4gIGluY3JlbWVudFJldGljdWxhdG9yICgpIHtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe3JldGljOiB0aGlzLnN0YXRlLnJldGljICsgMX0sICgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUucmV0aWMgIT09IHJldGljdWxhdGlvbnMubGVuZ3RoIC0gMSkgdGhpcy5pbmNyZW1lbnRSZXRpY3VsYXRvcigpXG4gICAgICB9KVxuICAgIH0sIDUyMDApXG4gIH1cblxuICByZW5kZXIgKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IHN0eWxlPXtTVFlMRVMuZnVsbFNjcmVlbkNlbnRlcldyYXB9PlxuICAgICAgICA8ZGl2IHN0eWxlPXtTVFlMRVMuY29udGVudEhvbHN0ZXJ9PlxuICAgICAgICAgIDxkaXYgc3R5bGU9e1NUWUxFUy5yZXRpY3VsYXRvcn0+XG4gICAgICAgICAgICB7cmV0aWN1bGF0aW9uc1t0aGlzLnN0YXRlLnJldGljXX1cbiAgICAgICAgICAgIDxUaHJlZUJvdW5jZSBjb2xvcj17UGFsZXR0ZS5ST0NLfSAvPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBzdHlsZT17U1RZTEVTLnRpcH0+XG4gICAgICAgICAgPHNwYW4gc3R5bGU9e1NUWUxFUy5wcmV0aXB9PlxuICAgICAgICAgICAgPHNwYW4gc3R5bGU9e1NUWUxFUy5pY29ufT48TGlnaHRJY29uU1ZHIGNvbG9yPXtQYWxldHRlLlBJTkt9IC8+PC9zcGFuPlxuICAgICAgICAgICAgVGlwIG9mIHRoZSBMb2FkXG4gICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgIDxzcGFuIHN0eWxlPXtTVFlMRVMudGlwVGV4dH0+e3RpcH08L3NwYW4+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFJhZGl1bShQcm9qZWN0TG9hZGVyKVxuIl19