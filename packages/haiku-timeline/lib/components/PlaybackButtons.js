'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _jsxFileName = 'src/components/PlaybackButtons.js';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _radium = require('radium');

var _radium2 = _interopRequireDefault(_radium);

var _DefaultPalette = require('./DefaultPalette');

var _DefaultPalette2 = _interopRequireDefault(_DefaultPalette);

var _SkipBackIconSVG = require('./icons/SkipBackIconSVG');

var _SkipBackIconSVG2 = _interopRequireDefault(_SkipBackIconSVG);

var _SkipForwardIconSVG = require('./icons/SkipForwardIconSVG');

var _SkipForwardIconSVG2 = _interopRequireDefault(_SkipForwardIconSVG);

var _PlayIconSVG = require('./icons/PlayIconSVG');

var _PlayIconSVG2 = _interopRequireDefault(_PlayIconSVG);

var _PauseIconSVG = require('./icons/PauseIconSVG');

var _PauseIconSVG2 = _interopRequireDefault(_PauseIconSVG);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var STYLES = {
  btn: {
    transform: 'scale(1)',
    transition: 'transform 167ms ease',
    ':active': {
      transform: 'scale(.8)'
    }
  },
  btnPlayPause: {
    height: 29,
    width: 30,
    borderRadius: 3,
    backgroundColor: _DefaultPalette2.default.FATHER_COAL
  },
  disabled: {
    opacity: 0.5,
    cursor: 'not-allowed'
  }
};

var PlaybackButtons = function (_React$Component) {
  _inherits(PlaybackButtons, _React$Component);

  function PlaybackButtons() {
    _classCallCheck(this, PlaybackButtons);

    return _possibleConstructorReturn(this, (PlaybackButtons.__proto__ || Object.getPrototypeOf(PlaybackButtons)).apply(this, arguments));
  }

  _createClass(PlaybackButtons, [{
    key: 'playbackSkipBack',
    value: function playbackSkipBack() {
      this.props.removeTimelineShadow();
      this.props.playbackSkipBack();
    }
  }, {
    key: 'playbackSkipForward',
    value: function playbackSkipForward() {
      this.props.playbackSkipForward();
    }
  }, {
    key: 'playbackPlayPause',
    value: function playbackPlayPause() {
      this.props.playbackPlayPause();
    }
  }, {
    key: 'render',
    value: function render() {
      var lastFrame = this.props.lastFrame;
      var currentFrame = this.props.currentFrame;
      var isPlaying = this.props.isPlaying;
      return _react2.default.createElement(
        'span',
        {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 48
          },
          __self: this
        },
        _react2.default.createElement(
          'button',
          { disabled: currentFrame < 1, key: 'skipback', style: [STYLES.btn, currentFrame < 1 && STYLES.disabled], onClick: this.playbackSkipBack.bind(this), __source: {
              fileName: _jsxFileName,
              lineNumber: 49
            },
            __self: this
          },
          _react2.default.createElement(_SkipBackIconSVG2.default, {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 50
            },
            __self: this
          })
        ),
        _react2.default.createElement(
          'button',
          { disabled: currentFrame >= lastFrame, key: 'pause', onClick: this.playbackPlayPause.bind(this), style: [STYLES.btn, STYLES.btnPlayPause, currentFrame >= lastFrame && STYLES.disabled], __source: {
              fileName: _jsxFileName,
              lineNumber: 52
            },
            __self: this
          },
          isPlaying ? _react2.default.createElement(
            'span',
            { style: { marginLeft: 2 }, __source: {
                fileName: _jsxFileName,
                lineNumber: 54
              },
              __self: this
            },
            _react2.default.createElement(_PauseIconSVG2.default, {
              __source: {
                fileName: _jsxFileName,
                lineNumber: 54
              },
              __self: this
            })
          ) : _react2.default.createElement(_PlayIconSVG2.default, {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 55
            },
            __self: this
          })
        ),
        _react2.default.createElement(
          'button',
          { disabled: currentFrame >= lastFrame, key: 'skipforward', style: [STYLES.btn, currentFrame >= lastFrame && STYLES.disabled], onClick: this.playbackSkipForward.bind(this), __source: {
              fileName: _jsxFileName,
              lineNumber: 58
            },
            __self: this
          },
          _react2.default.createElement(_SkipForwardIconSVG2.default, {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 59
            },
            __self: this
          })
        )
      );
    }
  }]);

  return PlaybackButtons;
}(_react2.default.Component);

exports.default = (0, _radium2.default)(PlaybackButtons);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21wb25lbnRzL1BsYXliYWNrQnV0dG9ucy5qcyJdLCJuYW1lcyI6WyJTVFlMRVMiLCJidG4iLCJ0cmFuc2Zvcm0iLCJ0cmFuc2l0aW9uIiwiYnRuUGxheVBhdXNlIiwiaGVpZ2h0Iiwid2lkdGgiLCJib3JkZXJSYWRpdXMiLCJiYWNrZ3JvdW5kQ29sb3IiLCJGQVRIRVJfQ09BTCIsImRpc2FibGVkIiwib3BhY2l0eSIsImN1cnNvciIsIlBsYXliYWNrQnV0dG9ucyIsInByb3BzIiwicmVtb3ZlVGltZWxpbmVTaGFkb3ciLCJwbGF5YmFja1NraXBCYWNrIiwicGxheWJhY2tTa2lwRm9yd2FyZCIsInBsYXliYWNrUGxheVBhdXNlIiwibGFzdEZyYW1lIiwiY3VycmVudEZyYW1lIiwiaXNQbGF5aW5nIiwiYmluZCIsIm1hcmdpbkxlZnQiLCJDb21wb25lbnQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7Ozs7QUFFQSxJQUFNQSxTQUFTO0FBQ2JDLE9BQUs7QUFDSEMsZUFBVyxVQURSO0FBRUhDLGdCQUFZLHNCQUZUO0FBR0gsZUFBVztBQUNURCxpQkFBVztBQURGO0FBSFIsR0FEUTtBQVFiRSxnQkFBYztBQUNaQyxZQUFRLEVBREk7QUFFWkMsV0FBTyxFQUZLO0FBR1pDLGtCQUFjLENBSEY7QUFJWkMscUJBQWlCLHlCQUFRQztBQUpiLEdBUkQ7QUFjYkMsWUFBVTtBQUNSQyxhQUFTLEdBREQ7QUFFUkMsWUFBUTtBQUZBO0FBZEcsQ0FBZjs7SUFvQk1DLGU7Ozs7Ozs7Ozs7O3VDQUNnQjtBQUNsQixXQUFLQyxLQUFMLENBQVdDLG9CQUFYO0FBQ0EsV0FBS0QsS0FBTCxDQUFXRSxnQkFBWDtBQUNEOzs7MENBRXNCO0FBQ3JCLFdBQUtGLEtBQUwsQ0FBV0csbUJBQVg7QUFDRDs7O3dDQUVvQjtBQUNuQixXQUFLSCxLQUFMLENBQVdJLGlCQUFYO0FBQ0Q7Ozs2QkFFUztBQUNSLFVBQU1DLFlBQVksS0FBS0wsS0FBTCxDQUFXSyxTQUE3QjtBQUNBLFVBQU1DLGVBQWUsS0FBS04sS0FBTCxDQUFXTSxZQUFoQztBQUNBLFVBQU1DLFlBQVksS0FBS1AsS0FBTCxDQUFXTyxTQUE3QjtBQUNBLGFBQ0U7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0U7QUFBQTtBQUFBLFlBQVEsVUFBV0QsZUFBZSxDQUFsQyxFQUFzQyxLQUFJLFVBQTFDLEVBQXFELE9BQU8sQ0FBQ3BCLE9BQU9DLEdBQVIsRUFBY21CLGVBQWUsQ0FBaEIsSUFBc0JwQixPQUFPVSxRQUExQyxDQUE1RCxFQUFpSCxTQUFTLEtBQUtNLGdCQUFMLENBQXNCTSxJQUF0QixDQUEyQixJQUEzQixDQUExSDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDRTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQURGLFNBREY7QUFJRTtBQUFBO0FBQUEsWUFBUSxVQUFXRixnQkFBZ0JELFNBQW5DLEVBQStDLEtBQUksT0FBbkQsRUFBMkQsU0FBUyxLQUFLRCxpQkFBTCxDQUF1QkksSUFBdkIsQ0FBNEIsSUFBNUIsQ0FBcEUsRUFBdUcsT0FBTyxDQUFDdEIsT0FBT0MsR0FBUixFQUFhRCxPQUFPSSxZQUFwQixFQUFtQ2dCLGdCQUFnQkQsU0FBakIsSUFBK0JuQixPQUFPVSxRQUF4RSxDQUE5RztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDSVcsbUJBQUQsR0FDRztBQUFBO0FBQUEsY0FBTSxPQUFPLEVBQUNFLFlBQVksQ0FBYixFQUFiO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUE4QjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUE5QixXQURILEdBRUc7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFITixTQUpGO0FBVUU7QUFBQTtBQUFBLFlBQVEsVUFBV0gsZ0JBQWdCRCxTQUFuQyxFQUErQyxLQUFJLGFBQW5ELEVBQWlFLE9BQU8sQ0FBQ25CLE9BQU9DLEdBQVIsRUFBY21CLGdCQUFnQkQsU0FBakIsSUFBK0JuQixPQUFPVSxRQUFuRCxDQUF4RSxFQUFzSSxTQUFTLEtBQUtPLG1CQUFMLENBQXlCSyxJQUF6QixDQUE4QixJQUE5QixDQUEvSTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDRTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQURGO0FBVkYsT0FERjtBQWdCRDs7OztFQWxDMkIsZ0JBQU1FLFM7O2tCQXFDckIsc0JBQU9YLGVBQVAsQyIsImZpbGUiOiJQbGF5YmFja0J1dHRvbnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgUmFkaXVtIGZyb20gJ3JhZGl1bSdcbmltcG9ydCBQYWxldHRlIGZyb20gJy4vRGVmYXVsdFBhbGV0dGUnXG5pbXBvcnQgU2tpcEJhY2tJY29uU1ZHIGZyb20gJy4vaWNvbnMvU2tpcEJhY2tJY29uU1ZHJ1xuaW1wb3J0IFNraXBGb3J3YXJkSWNvblNWRyBmcm9tICcuL2ljb25zL1NraXBGb3J3YXJkSWNvblNWRydcbmltcG9ydCBQbGF5SWNvblNWRyBmcm9tICcuL2ljb25zL1BsYXlJY29uU1ZHJ1xuaW1wb3J0IFBhdXNlSWNvblNWRyBmcm9tICcuL2ljb25zL1BhdXNlSWNvblNWRydcblxuY29uc3QgU1RZTEVTID0ge1xuICBidG46IHtcbiAgICB0cmFuc2Zvcm06ICdzY2FsZSgxKScsXG4gICAgdHJhbnNpdGlvbjogJ3RyYW5zZm9ybSAxNjdtcyBlYXNlJyxcbiAgICAnOmFjdGl2ZSc6IHtcbiAgICAgIHRyYW5zZm9ybTogJ3NjYWxlKC44KSdcbiAgICB9XG4gIH0sXG4gIGJ0blBsYXlQYXVzZToge1xuICAgIGhlaWdodDogMjksXG4gICAgd2lkdGg6IDMwLFxuICAgIGJvcmRlclJhZGl1czogMyxcbiAgICBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuRkFUSEVSX0NPQUxcbiAgfSxcbiAgZGlzYWJsZWQ6IHtcbiAgICBvcGFjaXR5OiAwLjUsXG4gICAgY3Vyc29yOiAnbm90LWFsbG93ZWQnXG4gIH1cbn1cblxuY2xhc3MgUGxheWJhY2tCdXR0b25zIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgcGxheWJhY2tTa2lwQmFjayAoKSB7XG4gICAgdGhpcy5wcm9wcy5yZW1vdmVUaW1lbGluZVNoYWRvdygpXG4gICAgdGhpcy5wcm9wcy5wbGF5YmFja1NraXBCYWNrKClcbiAgfVxuXG4gIHBsYXliYWNrU2tpcEZvcndhcmQgKCkge1xuICAgIHRoaXMucHJvcHMucGxheWJhY2tTa2lwRm9yd2FyZCgpXG4gIH1cblxuICBwbGF5YmFja1BsYXlQYXVzZSAoKSB7XG4gICAgdGhpcy5wcm9wcy5wbGF5YmFja1BsYXlQYXVzZSgpXG4gIH1cblxuICByZW5kZXIgKCkge1xuICAgIGNvbnN0IGxhc3RGcmFtZSA9IHRoaXMucHJvcHMubGFzdEZyYW1lXG4gICAgY29uc3QgY3VycmVudEZyYW1lID0gdGhpcy5wcm9wcy5jdXJyZW50RnJhbWVcbiAgICBjb25zdCBpc1BsYXlpbmcgPSB0aGlzLnByb3BzLmlzUGxheWluZ1xuICAgIHJldHVybiAoXG4gICAgICA8c3Bhbj5cbiAgICAgICAgPGJ1dHRvbiBkaXNhYmxlZD17KGN1cnJlbnRGcmFtZSA8IDEpfSBrZXk9J3NraXBiYWNrJyBzdHlsZT17W1NUWUxFUy5idG4sIChjdXJyZW50RnJhbWUgPCAxKSAmJiBTVFlMRVMuZGlzYWJsZWRdfSBvbkNsaWNrPXt0aGlzLnBsYXliYWNrU2tpcEJhY2suYmluZCh0aGlzKX0+XG4gICAgICAgICAgPFNraXBCYWNrSWNvblNWRyAvPlxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPGJ1dHRvbiBkaXNhYmxlZD17KGN1cnJlbnRGcmFtZSA+PSBsYXN0RnJhbWUpfSBrZXk9J3BhdXNlJyBvbkNsaWNrPXt0aGlzLnBsYXliYWNrUGxheVBhdXNlLmJpbmQodGhpcyl9IHN0eWxlPXtbU1RZTEVTLmJ0biwgU1RZTEVTLmJ0blBsYXlQYXVzZSwgKGN1cnJlbnRGcmFtZSA+PSBsYXN0RnJhbWUpICYmIFNUWUxFUy5kaXNhYmxlZF19PlxuICAgICAgICAgIHsoaXNQbGF5aW5nKVxuICAgICAgICAgICAgPyA8c3BhbiBzdHlsZT17e21hcmdpbkxlZnQ6IDJ9fT48UGF1c2VJY29uU1ZHIC8+PC9zcGFuPlxuICAgICAgICAgICAgOiA8UGxheUljb25TVkcgLz5cbiAgICAgICAgICB9XG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8YnV0dG9uIGRpc2FibGVkPXsoY3VycmVudEZyYW1lID49IGxhc3RGcmFtZSl9IGtleT0nc2tpcGZvcndhcmQnIHN0eWxlPXtbU1RZTEVTLmJ0biwgKGN1cnJlbnRGcmFtZSA+PSBsYXN0RnJhbWUpICYmIFNUWUxFUy5kaXNhYmxlZF19IG9uQ2xpY2s9e3RoaXMucGxheWJhY2tTa2lwRm9yd2FyZC5iaW5kKHRoaXMpfT5cbiAgICAgICAgICA8U2tpcEZvcndhcmRJY29uU1ZHIC8+XG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgPC9zcGFuPlxuICAgIClcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBSYWRpdW0oUGxheWJhY2tCdXR0b25zKVxuIl19