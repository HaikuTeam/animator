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
          {
            disabled: currentFrame < 1,
            key: 'skipback',
            style: [STYLES.btn, currentFrame < 1 && STYLES.disabled],
            onClick: this.playbackSkipBack.bind(this),
            __source: {
              fileName: _jsxFileName,
              lineNumber: 49
            },
            __self: this
          },
          _react2.default.createElement(_SkipBackIconSVG2.default, {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 55
            },
            __self: this
          })
        ),
        _react2.default.createElement(
          'button',
          {
            key: 'pause',
            onClick: this.playbackPlayPause.bind(this),
            style: [STYLES.btn, STYLES.btnPlayPause],
            __source: {
              fileName: _jsxFileName,
              lineNumber: 57
            },
            __self: this
          },
          isPlaying && currentFrame < lastFrame ? _react2.default.createElement(
            'span',
            { style: { marginLeft: 2 }, __source: {
                fileName: _jsxFileName,
                lineNumber: 66
              },
              __self: this
            },
            _react2.default.createElement(_PauseIconSVG2.default, {
              __source: {
                fileName: _jsxFileName,
                lineNumber: 67
              },
              __self: this
            })
          ) : _react2.default.createElement(_PlayIconSVG2.default, {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 70
            },
            __self: this
          })
        ),
        _react2.default.createElement(
          'button',
          {
            disabled: currentFrame >= lastFrame,
            key: 'skipforward',
            style: [STYLES.btn, currentFrame >= lastFrame && STYLES.disabled],
            onClick: this.playbackSkipForward.bind(this),
            __source: {
              fileName: _jsxFileName,
              lineNumber: 73
            },
            __self: this
          },
          _react2.default.createElement(_SkipForwardIconSVG2.default, {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 79
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21wb25lbnRzL1BsYXliYWNrQnV0dG9ucy5qcyJdLCJuYW1lcyI6WyJTVFlMRVMiLCJidG4iLCJ0cmFuc2Zvcm0iLCJ0cmFuc2l0aW9uIiwiYnRuUGxheVBhdXNlIiwiaGVpZ2h0Iiwid2lkdGgiLCJib3JkZXJSYWRpdXMiLCJiYWNrZ3JvdW5kQ29sb3IiLCJGQVRIRVJfQ09BTCIsImRpc2FibGVkIiwib3BhY2l0eSIsImN1cnNvciIsIlBsYXliYWNrQnV0dG9ucyIsInByb3BzIiwicmVtb3ZlVGltZWxpbmVTaGFkb3ciLCJwbGF5YmFja1NraXBCYWNrIiwicGxheWJhY2tTa2lwRm9yd2FyZCIsInBsYXliYWNrUGxheVBhdXNlIiwibGFzdEZyYW1lIiwiY3VycmVudEZyYW1lIiwiaXNQbGF5aW5nIiwiYmluZCIsIm1hcmdpbkxlZnQiLCJDb21wb25lbnQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7Ozs7QUFFQSxJQUFNQSxTQUFTO0FBQ2JDLE9BQUs7QUFDSEMsZUFBVyxVQURSO0FBRUhDLGdCQUFZLHNCQUZUO0FBR0gsZUFBVztBQUNURCxpQkFBVztBQURGO0FBSFIsR0FEUTtBQVFiRSxnQkFBYztBQUNaQyxZQUFRLEVBREk7QUFFWkMsV0FBTyxFQUZLO0FBR1pDLGtCQUFjLENBSEY7QUFJWkMscUJBQWlCLHlCQUFRQztBQUpiLEdBUkQ7QUFjYkMsWUFBVTtBQUNSQyxhQUFTLEdBREQ7QUFFUkMsWUFBUTtBQUZBO0FBZEcsQ0FBZjs7SUFvQk1DLGU7Ozs7Ozs7Ozs7O3VDQUNnQjtBQUNsQixXQUFLQyxLQUFMLENBQVdDLG9CQUFYO0FBQ0EsV0FBS0QsS0FBTCxDQUFXRSxnQkFBWDtBQUNEOzs7MENBRXNCO0FBQ3JCLFdBQUtGLEtBQUwsQ0FBV0csbUJBQVg7QUFDRDs7O3dDQUVvQjtBQUNuQixXQUFLSCxLQUFMLENBQVdJLGlCQUFYO0FBQ0Q7Ozs2QkFFUztBQUNSLFVBQU1DLFlBQVksS0FBS0wsS0FBTCxDQUFXSyxTQUE3QjtBQUNBLFVBQU1DLGVBQWUsS0FBS04sS0FBTCxDQUFXTSxZQUFoQztBQUNBLFVBQU1DLFlBQVksS0FBS1AsS0FBTCxDQUFXTyxTQUE3QjtBQUNBLGFBQ0U7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0U7QUFBQTtBQUFBO0FBQ0Usc0JBQVVELGVBQWUsQ0FEM0I7QUFFRSxpQkFBSSxVQUZOO0FBR0UsbUJBQU8sQ0FBQ3BCLE9BQU9DLEdBQVIsRUFBYW1CLGVBQWUsQ0FBZixJQUFvQnBCLE9BQU9VLFFBQXhDLENBSFQ7QUFJRSxxQkFBUyxLQUFLTSxnQkFBTCxDQUFzQk0sSUFBdEIsQ0FBMkIsSUFBM0IsQ0FKWDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQU1FO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBTkYsU0FERjtBQVNFO0FBQUE7QUFBQTtBQUNFLGlCQUFJLE9BRE47QUFFRSxxQkFBUyxLQUFLSixpQkFBTCxDQUF1QkksSUFBdkIsQ0FBNEIsSUFBNUIsQ0FGWDtBQUdFLG1CQUFPLENBQ0x0QixPQUFPQyxHQURGLEVBRUxELE9BQU9JLFlBRkYsQ0FIVDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQVFHaUIsdUJBQWFELGVBQWVELFNBQTVCLEdBQ0M7QUFBQTtBQUFBLGNBQU0sT0FBTyxFQUFDSSxZQUFZLENBQWIsRUFBYjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDRTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQURGLFdBREQsR0FLQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQWJKLFNBVEY7QUF5QkU7QUFBQTtBQUFBO0FBQ0Usc0JBQVVILGdCQUFnQkQsU0FENUI7QUFFRSxpQkFBSSxhQUZOO0FBR0UsbUJBQU8sQ0FBQ25CLE9BQU9DLEdBQVIsRUFBYW1CLGdCQUFnQkQsU0FBaEIsSUFBNkJuQixPQUFPVSxRQUFqRCxDQUhUO0FBSUUscUJBQVMsS0FBS08sbUJBQUwsQ0FBeUJLLElBQXpCLENBQThCLElBQTlCLENBSlg7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFNRTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQU5GO0FBekJGLE9BREY7QUFvQ0Q7Ozs7RUF0RDJCLGdCQUFNRSxTOztrQkF5RHJCLHNCQUFPWCxlQUFQLEMiLCJmaWxlIjoiUGxheWJhY2tCdXR0b25zLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IFJhZGl1bSBmcm9tICdyYWRpdW0nXG5pbXBvcnQgUGFsZXR0ZSBmcm9tICcuL0RlZmF1bHRQYWxldHRlJ1xuaW1wb3J0IFNraXBCYWNrSWNvblNWRyBmcm9tICcuL2ljb25zL1NraXBCYWNrSWNvblNWRydcbmltcG9ydCBTa2lwRm9yd2FyZEljb25TVkcgZnJvbSAnLi9pY29ucy9Ta2lwRm9yd2FyZEljb25TVkcnXG5pbXBvcnQgUGxheUljb25TVkcgZnJvbSAnLi9pY29ucy9QbGF5SWNvblNWRydcbmltcG9ydCBQYXVzZUljb25TVkcgZnJvbSAnLi9pY29ucy9QYXVzZUljb25TVkcnXG5cbmNvbnN0IFNUWUxFUyA9IHtcbiAgYnRuOiB7XG4gICAgdHJhbnNmb3JtOiAnc2NhbGUoMSknLFxuICAgIHRyYW5zaXRpb246ICd0cmFuc2Zvcm0gMTY3bXMgZWFzZScsXG4gICAgJzphY3RpdmUnOiB7XG4gICAgICB0cmFuc2Zvcm06ICdzY2FsZSguOCknXG4gICAgfVxuICB9LFxuICBidG5QbGF5UGF1c2U6IHtcbiAgICBoZWlnaHQ6IDI5LFxuICAgIHdpZHRoOiAzMCxcbiAgICBib3JkZXJSYWRpdXM6IDMsXG4gICAgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLkZBVEhFUl9DT0FMXG4gIH0sXG4gIGRpc2FibGVkOiB7XG4gICAgb3BhY2l0eTogMC41LFxuICAgIGN1cnNvcjogJ25vdC1hbGxvd2VkJ1xuICB9XG59XG5cbmNsYXNzIFBsYXliYWNrQnV0dG9ucyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHBsYXliYWNrU2tpcEJhY2sgKCkge1xuICAgIHRoaXMucHJvcHMucmVtb3ZlVGltZWxpbmVTaGFkb3coKVxuICAgIHRoaXMucHJvcHMucGxheWJhY2tTa2lwQmFjaygpXG4gIH1cblxuICBwbGF5YmFja1NraXBGb3J3YXJkICgpIHtcbiAgICB0aGlzLnByb3BzLnBsYXliYWNrU2tpcEZvcndhcmQoKVxuICB9XG5cbiAgcGxheWJhY2tQbGF5UGF1c2UgKCkge1xuICAgIHRoaXMucHJvcHMucGxheWJhY2tQbGF5UGF1c2UoKVxuICB9XG5cbiAgcmVuZGVyICgpIHtcbiAgICBjb25zdCBsYXN0RnJhbWUgPSB0aGlzLnByb3BzLmxhc3RGcmFtZVxuICAgIGNvbnN0IGN1cnJlbnRGcmFtZSA9IHRoaXMucHJvcHMuY3VycmVudEZyYW1lXG4gICAgY29uc3QgaXNQbGF5aW5nID0gdGhpcy5wcm9wcy5pc1BsYXlpbmdcbiAgICByZXR1cm4gKFxuICAgICAgPHNwYW4+XG4gICAgICAgIDxidXR0b25cbiAgICAgICAgICBkaXNhYmxlZD17Y3VycmVudEZyYW1lIDwgMX1cbiAgICAgICAgICBrZXk9J3NraXBiYWNrJ1xuICAgICAgICAgIHN0eWxlPXtbU1RZTEVTLmJ0biwgY3VycmVudEZyYW1lIDwgMSAmJiBTVFlMRVMuZGlzYWJsZWRdfVxuICAgICAgICAgIG9uQ2xpY2s9e3RoaXMucGxheWJhY2tTa2lwQmFjay5iaW5kKHRoaXMpfVxuICAgICAgICA+XG4gICAgICAgICAgPFNraXBCYWNrSWNvblNWRyAvPlxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPGJ1dHRvblxuICAgICAgICAgIGtleT0ncGF1c2UnXG4gICAgICAgICAgb25DbGljaz17dGhpcy5wbGF5YmFja1BsYXlQYXVzZS5iaW5kKHRoaXMpfVxuICAgICAgICAgIHN0eWxlPXtbXG4gICAgICAgICAgICBTVFlMRVMuYnRuLFxuICAgICAgICAgICAgU1RZTEVTLmJ0blBsYXlQYXVzZVxuICAgICAgICAgIF19XG4gICAgICAgID5cbiAgICAgICAgICB7aXNQbGF5aW5nICYmIGN1cnJlbnRGcmFtZSA8IGxhc3RGcmFtZSA/IChcbiAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7bWFyZ2luTGVmdDogMn19PlxuICAgICAgICAgICAgICA8UGF1c2VJY29uU1ZHIC8+XG4gICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgKSA6IChcbiAgICAgICAgICAgIDxQbGF5SWNvblNWRyAvPlxuICAgICAgICAgICl9XG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgZGlzYWJsZWQ9e2N1cnJlbnRGcmFtZSA+PSBsYXN0RnJhbWV9XG4gICAgICAgICAga2V5PSdza2lwZm9yd2FyZCdcbiAgICAgICAgICBzdHlsZT17W1NUWUxFUy5idG4sIGN1cnJlbnRGcmFtZSA+PSBsYXN0RnJhbWUgJiYgU1RZTEVTLmRpc2FibGVkXX1cbiAgICAgICAgICBvbkNsaWNrPXt0aGlzLnBsYXliYWNrU2tpcEZvcndhcmQuYmluZCh0aGlzKX1cbiAgICAgICAgPlxuICAgICAgICAgIDxTa2lwRm9yd2FyZEljb25TVkcgLz5cbiAgICAgICAgPC9idXR0b24+XG4gICAgICA8L3NwYW4+XG4gICAgKVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFJhZGl1bShQbGF5YmFja0J1dHRvbnMpXG4iXX0=