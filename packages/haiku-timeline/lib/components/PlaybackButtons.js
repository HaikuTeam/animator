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
            disabled: currentFrame >= lastFrame,
            key: 'pause',
            onClick: this.playbackPlayPause.bind(this),
            style: [STYLES.btn, STYLES.btnPlayPause, currentFrame >= lastFrame && STYLES.disabled],
            __source: {
              fileName: _jsxFileName,
              lineNumber: 57
            },
            __self: this
          },
          isPlaying ? _react2.default.createElement(
            'span',
            { style: { marginLeft: 2 }, __source: {
                fileName: _jsxFileName,
                lineNumber: 68
              },
              __self: this
            },
            _react2.default.createElement(_PauseIconSVG2.default, {
              __source: {
                fileName: _jsxFileName,
                lineNumber: 69
              },
              __self: this
            })
          ) : _react2.default.createElement(_PlayIconSVG2.default, {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 72
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
              lineNumber: 75
            },
            __self: this
          },
          _react2.default.createElement(_SkipForwardIconSVG2.default, {
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

  return PlaybackButtons;
}(_react2.default.Component);

exports.default = (0, _radium2.default)(PlaybackButtons);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21wb25lbnRzL1BsYXliYWNrQnV0dG9ucy5qcyJdLCJuYW1lcyI6WyJTVFlMRVMiLCJidG4iLCJ0cmFuc2Zvcm0iLCJ0cmFuc2l0aW9uIiwiYnRuUGxheVBhdXNlIiwiaGVpZ2h0Iiwid2lkdGgiLCJib3JkZXJSYWRpdXMiLCJiYWNrZ3JvdW5kQ29sb3IiLCJGQVRIRVJfQ09BTCIsImRpc2FibGVkIiwib3BhY2l0eSIsImN1cnNvciIsIlBsYXliYWNrQnV0dG9ucyIsInByb3BzIiwicmVtb3ZlVGltZWxpbmVTaGFkb3ciLCJwbGF5YmFja1NraXBCYWNrIiwicGxheWJhY2tTa2lwRm9yd2FyZCIsInBsYXliYWNrUGxheVBhdXNlIiwibGFzdEZyYW1lIiwiY3VycmVudEZyYW1lIiwiaXNQbGF5aW5nIiwiYmluZCIsIm1hcmdpbkxlZnQiLCJDb21wb25lbnQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7Ozs7QUFFQSxJQUFNQSxTQUFTO0FBQ2JDLE9BQUs7QUFDSEMsZUFBVyxVQURSO0FBRUhDLGdCQUFZLHNCQUZUO0FBR0gsZUFBVztBQUNURCxpQkFBVztBQURGO0FBSFIsR0FEUTtBQVFiRSxnQkFBYztBQUNaQyxZQUFRLEVBREk7QUFFWkMsV0FBTyxFQUZLO0FBR1pDLGtCQUFjLENBSEY7QUFJWkMscUJBQWlCLHlCQUFRQztBQUpiLEdBUkQ7QUFjYkMsWUFBVTtBQUNSQyxhQUFTLEdBREQ7QUFFUkMsWUFBUTtBQUZBO0FBZEcsQ0FBZjs7SUFvQk1DLGU7Ozs7Ozs7Ozs7O3VDQUNlO0FBQ2pCLFdBQUtDLEtBQUwsQ0FBV0Msb0JBQVg7QUFDQSxXQUFLRCxLQUFMLENBQVdFLGdCQUFYO0FBQ0Q7OzswQ0FFcUI7QUFDcEIsV0FBS0YsS0FBTCxDQUFXRyxtQkFBWDtBQUNEOzs7d0NBRW1CO0FBQ2xCLFdBQUtILEtBQUwsQ0FBV0ksaUJBQVg7QUFDRDs7OzZCQUVRO0FBQ1AsVUFBTUMsWUFBWSxLQUFLTCxLQUFMLENBQVdLLFNBQTdCO0FBQ0EsVUFBTUMsZUFBZSxLQUFLTixLQUFMLENBQVdNLFlBQWhDO0FBQ0EsVUFBTUMsWUFBWSxLQUFLUCxLQUFMLENBQVdPLFNBQTdCO0FBQ0EsYUFDRTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDRTtBQUFBO0FBQUE7QUFDRSxzQkFBVUQsZUFBZSxDQUQzQjtBQUVFLGlCQUFJLFVBRk47QUFHRSxtQkFBTyxDQUFDcEIsT0FBT0MsR0FBUixFQUFhbUIsZUFBZSxDQUFmLElBQW9CcEIsT0FBT1UsUUFBeEMsQ0FIVDtBQUlFLHFCQUFTLEtBQUtNLGdCQUFMLENBQXNCTSxJQUF0QixDQUEyQixJQUEzQixDQUpYO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBTUU7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFORixTQURGO0FBU0U7QUFBQTtBQUFBO0FBQ0Usc0JBQVVGLGdCQUFnQkQsU0FENUI7QUFFRSxpQkFBSSxPQUZOO0FBR0UscUJBQVMsS0FBS0QsaUJBQUwsQ0FBdUJJLElBQXZCLENBQTRCLElBQTVCLENBSFg7QUFJRSxtQkFBTyxDQUNMdEIsT0FBT0MsR0FERixFQUVMRCxPQUFPSSxZQUZGLEVBR0xnQixnQkFBZ0JELFNBQWhCLElBQTZCbkIsT0FBT1UsUUFIL0IsQ0FKVDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQVVHVyxzQkFDQztBQUFBO0FBQUEsY0FBTSxPQUFPLEVBQUNFLFlBQVksQ0FBYixFQUFiO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNFO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBREYsV0FERCxHQUtDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBZkosU0FURjtBQTJCRTtBQUFBO0FBQUE7QUFDRSxzQkFBVUgsZ0JBQWdCRCxTQUQ1QjtBQUVFLGlCQUFJLGFBRk47QUFHRSxtQkFBTyxDQUFDbkIsT0FBT0MsR0FBUixFQUFhbUIsZ0JBQWdCRCxTQUFoQixJQUE2Qm5CLE9BQU9VLFFBQWpELENBSFQ7QUFJRSxxQkFBUyxLQUFLTyxtQkFBTCxDQUF5QkssSUFBekIsQ0FBOEIsSUFBOUIsQ0FKWDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQU1FO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBTkY7QUEzQkYsT0FERjtBQXNDRDs7OztFQXhEMkIsZ0JBQU1FLFM7O2tCQTJEckIsc0JBQU9YLGVBQVAsQyIsImZpbGUiOiJQbGF5YmFja0J1dHRvbnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgUmFkaXVtIGZyb20gJ3JhZGl1bSdcbmltcG9ydCBQYWxldHRlIGZyb20gJy4vRGVmYXVsdFBhbGV0dGUnXG5pbXBvcnQgU2tpcEJhY2tJY29uU1ZHIGZyb20gJy4vaWNvbnMvU2tpcEJhY2tJY29uU1ZHJ1xuaW1wb3J0IFNraXBGb3J3YXJkSWNvblNWRyBmcm9tICcuL2ljb25zL1NraXBGb3J3YXJkSWNvblNWRydcbmltcG9ydCBQbGF5SWNvblNWRyBmcm9tICcuL2ljb25zL1BsYXlJY29uU1ZHJ1xuaW1wb3J0IFBhdXNlSWNvblNWRyBmcm9tICcuL2ljb25zL1BhdXNlSWNvblNWRydcblxuY29uc3QgU1RZTEVTID0ge1xuICBidG46IHtcbiAgICB0cmFuc2Zvcm06ICdzY2FsZSgxKScsXG4gICAgdHJhbnNpdGlvbjogJ3RyYW5zZm9ybSAxNjdtcyBlYXNlJyxcbiAgICAnOmFjdGl2ZSc6IHtcbiAgICAgIHRyYW5zZm9ybTogJ3NjYWxlKC44KSdcbiAgICB9XG4gIH0sXG4gIGJ0blBsYXlQYXVzZToge1xuICAgIGhlaWdodDogMjksXG4gICAgd2lkdGg6IDMwLFxuICAgIGJvcmRlclJhZGl1czogMyxcbiAgICBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuRkFUSEVSX0NPQUxcbiAgfSxcbiAgZGlzYWJsZWQ6IHtcbiAgICBvcGFjaXR5OiAwLjUsXG4gICAgY3Vyc29yOiAnbm90LWFsbG93ZWQnXG4gIH1cbn1cblxuY2xhc3MgUGxheWJhY2tCdXR0b25zIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgcGxheWJhY2tTa2lwQmFjaygpIHtcbiAgICB0aGlzLnByb3BzLnJlbW92ZVRpbWVsaW5lU2hhZG93KClcbiAgICB0aGlzLnByb3BzLnBsYXliYWNrU2tpcEJhY2soKVxuICB9XG5cbiAgcGxheWJhY2tTa2lwRm9yd2FyZCgpIHtcbiAgICB0aGlzLnByb3BzLnBsYXliYWNrU2tpcEZvcndhcmQoKVxuICB9XG5cbiAgcGxheWJhY2tQbGF5UGF1c2UoKSB7XG4gICAgdGhpcy5wcm9wcy5wbGF5YmFja1BsYXlQYXVzZSgpXG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgbGFzdEZyYW1lID0gdGhpcy5wcm9wcy5sYXN0RnJhbWVcbiAgICBjb25zdCBjdXJyZW50RnJhbWUgPSB0aGlzLnByb3BzLmN1cnJlbnRGcmFtZVxuICAgIGNvbnN0IGlzUGxheWluZyA9IHRoaXMucHJvcHMuaXNQbGF5aW5nXG4gICAgcmV0dXJuIChcbiAgICAgIDxzcGFuPlxuICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgZGlzYWJsZWQ9e2N1cnJlbnRGcmFtZSA8IDF9XG4gICAgICAgICAga2V5PVwic2tpcGJhY2tcIlxuICAgICAgICAgIHN0eWxlPXtbU1RZTEVTLmJ0biwgY3VycmVudEZyYW1lIDwgMSAmJiBTVFlMRVMuZGlzYWJsZWRdfVxuICAgICAgICAgIG9uQ2xpY2s9e3RoaXMucGxheWJhY2tTa2lwQmFjay5iaW5kKHRoaXMpfVxuICAgICAgICA+XG4gICAgICAgICAgPFNraXBCYWNrSWNvblNWRyAvPlxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPGJ1dHRvblxuICAgICAgICAgIGRpc2FibGVkPXtjdXJyZW50RnJhbWUgPj0gbGFzdEZyYW1lfVxuICAgICAgICAgIGtleT1cInBhdXNlXCJcbiAgICAgICAgICBvbkNsaWNrPXt0aGlzLnBsYXliYWNrUGxheVBhdXNlLmJpbmQodGhpcyl9XG4gICAgICAgICAgc3R5bGU9e1tcbiAgICAgICAgICAgIFNUWUxFUy5idG4sXG4gICAgICAgICAgICBTVFlMRVMuYnRuUGxheVBhdXNlLFxuICAgICAgICAgICAgY3VycmVudEZyYW1lID49IGxhc3RGcmFtZSAmJiBTVFlMRVMuZGlzYWJsZWRcbiAgICAgICAgICBdfVxuICAgICAgICA+XG4gICAgICAgICAge2lzUGxheWluZyA/IChcbiAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7bWFyZ2luTGVmdDogMn19PlxuICAgICAgICAgICAgICA8UGF1c2VJY29uU1ZHIC8+XG4gICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgKSA6IChcbiAgICAgICAgICAgIDxQbGF5SWNvblNWRyAvPlxuICAgICAgICAgICl9XG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgZGlzYWJsZWQ9e2N1cnJlbnRGcmFtZSA+PSBsYXN0RnJhbWV9XG4gICAgICAgICAga2V5PVwic2tpcGZvcndhcmRcIlxuICAgICAgICAgIHN0eWxlPXtbU1RZTEVTLmJ0biwgY3VycmVudEZyYW1lID49IGxhc3RGcmFtZSAmJiBTVFlMRVMuZGlzYWJsZWRdfVxuICAgICAgICAgIG9uQ2xpY2s9e3RoaXMucGxheWJhY2tTa2lwRm9yd2FyZC5iaW5kKHRoaXMpfVxuICAgICAgICA+XG4gICAgICAgICAgPFNraXBGb3J3YXJkSWNvblNWRyAvPlxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgIDwvc3Bhbj5cbiAgICApXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUmFkaXVtKFBsYXliYWNrQnV0dG9ucylcbiJdfQ==