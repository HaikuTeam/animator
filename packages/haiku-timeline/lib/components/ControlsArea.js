'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _jsxFileName = 'src/components/ControlsArea.js';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _DefaultPalette = require('./DefaultPalette');

var _DefaultPalette2 = _interopRequireDefault(_DefaultPalette);

var _ActiveComponentIndicator = require('./ActiveComponentIndicator');

var _ActiveComponentIndicator2 = _interopRequireDefault(_ActiveComponentIndicator);

var _PlaybackButtons = require('./PlaybackButtons');

var _PlaybackButtons2 = _interopRequireDefault(_PlaybackButtons);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
// import CurrentTimelineSelectMenu from './CurrentTimelineSelectMenu'


// import PlaybackSpeedDial from './PlaybackSpeedDial'

var STYLES = {
  wrapper: {
    backgroundColor: _DefaultPalette2.default.FATHER_COAL,
    position: 'relative'
  },
  leftWrapper: {
    position: 'absolute',
    left: 14,
    height: '100%',
    display: 'flex',
    alignItems: 'center'
  },
  centerWrapper: {
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
    height: '100%',
    display: 'flex',
    alignItems: 'center'
  }
};

var ControlsArea = function (_React$Component) {
  _inherits(ControlsArea, _React$Component);

  function ControlsArea() {
    _classCallCheck(this, ControlsArea);

    return _possibleConstructorReturn(this, (ControlsArea.__proto__ || Object.getPrototypeOf(ControlsArea)).apply(this, arguments));
  }

  _createClass(ControlsArea, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        { style: STYLES.wrapper, __source: {
            fileName: _jsxFileName,
            lineNumber: 33
          },
          __self: this
        },
        _react2.default.createElement(
          'span',
          { style: STYLES.leftWrapper, __source: {
              fileName: _jsxFileName,
              lineNumber: 34
            },
            __self: this
          },
          _react2.default.createElement(_ActiveComponentIndicator2.default, {
            displayName: this.props.activeComponentDisplayName, __source: {
              fileName: _jsxFileName,
              lineNumber: 35
            },
            __self: this
          })
        ),
        _react2.default.createElement(
          'span',
          { style: STYLES.centerWrapper, __source: {
              fileName: _jsxFileName,
              lineNumber: 47
            },
            __self: this
          },
          _react2.default.createElement(_PlaybackButtons2.default, {
            removeTimelineShadow: this.props.removeTimelineShadow,
            lastFrame: this.props.lastFrame,
            currentFrame: this.props.currentFrame,
            isPlaying: this.props.isPlaying,
            playbackSkipBack: this.props.playbackSkipBack,
            playbackSkipForward: this.props.playbackSkipForward,
            playbackPlayPause: this.props.playbackPlayPause, __source: {
              fileName: _jsxFileName,
              lineNumber: 48
            },
            __self: this
          }),
          _react2.default.createElement('div', { style: {
              position: 'absolute',
              top: -63
            }, __source: {
              fileName: _jsxFileName,
              lineNumber: 56
            },
            __self: this
          })
        )
      );
    }
  }]);

  return ControlsArea;
}(_react2.default.Component);

exports.default = ControlsArea;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21wb25lbnRzL0NvbnRyb2xzQXJlYS5qcyJdLCJuYW1lcyI6WyJTVFlMRVMiLCJ3cmFwcGVyIiwiYmFja2dyb3VuZENvbG9yIiwiRkFUSEVSX0NPQUwiLCJwb3NpdGlvbiIsImxlZnRXcmFwcGVyIiwibGVmdCIsImhlaWdodCIsImRpc3BsYXkiLCJhbGlnbkl0ZW1zIiwiY2VudGVyV3JhcHBlciIsInRyYW5zZm9ybSIsIkNvbnRyb2xzQXJlYSIsInByb3BzIiwiYWN0aXZlQ29tcG9uZW50RGlzcGxheU5hbWUiLCJyZW1vdmVUaW1lbGluZVNoYWRvdyIsImxhc3RGcmFtZSIsImN1cnJlbnRGcmFtZSIsImlzUGxheWluZyIsInBsYXliYWNrU2tpcEJhY2siLCJwbGF5YmFja1NraXBGb3J3YXJkIiwicGxheWJhY2tQbGF5UGF1c2UiLCJ0b3AiLCJDb21wb25lbnQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUVBOzs7Ozs7Ozs7OztBQURBOzs7QUFFQTs7QUFFQSxJQUFNQSxTQUFTO0FBQ2JDLFdBQVM7QUFDUEMscUJBQWlCLHlCQUFRQyxXQURsQjtBQUVQQyxjQUFVO0FBRkgsR0FESTtBQUtiQyxlQUFhO0FBQ1hELGNBQVUsVUFEQztBQUVYRSxVQUFNLEVBRks7QUFHWEMsWUFBUSxNQUhHO0FBSVhDLGFBQVMsTUFKRTtBQUtYQyxnQkFBWTtBQUxELEdBTEE7QUFZYkMsaUJBQWU7QUFDYk4sY0FBVSxVQURHO0FBRWJFLFVBQU0sS0FGTztBQUdiSyxlQUFXLGtCQUhFO0FBSWJKLFlBQVEsTUFKSztBQUtiQyxhQUFTLE1BTEk7QUFNYkMsZ0JBQVk7QUFOQztBQVpGLENBQWY7O0lBc0JxQkcsWTs7Ozs7Ozs7Ozs7NkJBQ1Q7QUFDUixhQUNFO0FBQUE7QUFBQSxVQUFLLE9BQU9aLE9BQU9DLE9BQW5CO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNFO0FBQUE7QUFBQSxZQUFNLE9BQU9ELE9BQU9LLFdBQXBCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNFO0FBQ0UseUJBQWEsS0FBS1EsS0FBTCxDQUFXQywwQkFEMUI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBREYsU0FERjtBQWNFO0FBQUE7QUFBQSxZQUFNLE9BQU9kLE9BQU9VLGFBQXBCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNFO0FBQ0Usa0NBQXNCLEtBQUtHLEtBQUwsQ0FBV0Usb0JBRG5DO0FBRUUsdUJBQVcsS0FBS0YsS0FBTCxDQUFXRyxTQUZ4QjtBQUdFLDBCQUFjLEtBQUtILEtBQUwsQ0FBV0ksWUFIM0I7QUFJRSx1QkFBVyxLQUFLSixLQUFMLENBQVdLLFNBSnhCO0FBS0UsOEJBQWtCLEtBQUtMLEtBQUwsQ0FBV00sZ0JBTC9CO0FBTUUsaUNBQXFCLEtBQUtOLEtBQUwsQ0FBV08sbUJBTmxDO0FBT0UsK0JBQW1CLEtBQUtQLEtBQUwsQ0FBV1EsaUJBUGhDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxZQURGO0FBU0UsaURBQUssT0FBTztBQUNWakIsd0JBQVUsVUFEQTtBQUVWa0IsbUJBQUssQ0FBQztBQUZJLGFBQVo7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBVEY7QUFkRixPQURGO0FBc0NEOzs7O0VBeEN1QyxnQkFBTUMsUzs7a0JBQTNCWCxZIiwiZmlsZSI6IkNvbnRyb2xzQXJlYS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCBQYWxldHRlIGZyb20gJy4vRGVmYXVsdFBhbGV0dGUnXG5pbXBvcnQgQWN0aXZlQ29tcG9uZW50SW5kaWNhdG9yIGZyb20gJy4vQWN0aXZlQ29tcG9uZW50SW5kaWNhdG9yJ1xuLy8gaW1wb3J0IEN1cnJlbnRUaW1lbGluZVNlbGVjdE1lbnUgZnJvbSAnLi9DdXJyZW50VGltZWxpbmVTZWxlY3RNZW51J1xuaW1wb3J0IFBsYXliYWNrQnV0dG9ucyBmcm9tICcuL1BsYXliYWNrQnV0dG9ucydcbi8vIGltcG9ydCBQbGF5YmFja1NwZWVkRGlhbCBmcm9tICcuL1BsYXliYWNrU3BlZWREaWFsJ1xuXG5jb25zdCBTVFlMRVMgPSB7XG4gIHdyYXBwZXI6IHtcbiAgICBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuRkFUSEVSX0NPQUwsXG4gICAgcG9zaXRpb246ICdyZWxhdGl2ZSdcbiAgfSxcbiAgbGVmdFdyYXBwZXI6IHtcbiAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICBsZWZ0OiAxNCxcbiAgICBoZWlnaHQ6ICcxMDAlJyxcbiAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAgYWxpZ25JdGVtczogJ2NlbnRlcidcbiAgfSxcbiAgY2VudGVyV3JhcHBlcjoge1xuICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgIGxlZnQ6ICc1MCUnLFxuICAgIHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVgoLTUwJSknLFxuICAgIGhlaWdodDogJzEwMCUnLFxuICAgIGRpc3BsYXk6ICdmbGV4JyxcbiAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJ1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbnRyb2xzQXJlYSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHJlbmRlciAoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgc3R5bGU9e1NUWUxFUy53cmFwcGVyfT5cbiAgICAgICAgPHNwYW4gc3R5bGU9e1NUWUxFUy5sZWZ0V3JhcHBlcn0+XG4gICAgICAgICAgPEFjdGl2ZUNvbXBvbmVudEluZGljYXRvclxuICAgICAgICAgICAgZGlzcGxheU5hbWU9e3RoaXMucHJvcHMuYWN0aXZlQ29tcG9uZW50RGlzcGxheU5hbWV9IC8+XG4gICAgICAgICAgey8qIDxDdXJyZW50VGltZWxpbmVTZWxlY3RNZW51XG4gICAgICAgICAgICB0aW1lbGluZU5hbWVzPXt0aGlzLnByb3BzLnRpbWVsaW5lTmFtZXN9XG4gICAgICAgICAgICBzZWxlY3RlZFRpbWVsaW5lTmFtZT17dGhpcy5wcm9wcy5zZWxlY3RlZFRpbWVsaW5lTmFtZX1cbiAgICAgICAgICAgIGNoYW5nZVRpbWVsaW5lTmFtZT17dGhpcy5wcm9wcy5jaGFuZ2VUaW1lbGluZU5hbWV9XG4gICAgICAgICAgICBjcmVhdGVUaW1lbGluZT17dGhpcy5wcm9wcy5jcmVhdGVUaW1lbGluZX1cbiAgICAgICAgICAgIGR1cGxpY2F0ZVRpbWVsaW5lPXt0aGlzLnByb3BzLmR1cGxpY2F0ZVRpbWVsaW5lfVxuICAgICAgICAgICAgZGVsZXRlVGltZWxpbmU9e3RoaXMucHJvcHMuZGVsZXRlVGltZWxpbmV9XG4gICAgICAgICAgICBzZWxlY3RUaW1lbGluZT17dGhpcy5wcm9wcy5zZWxlY3RUaW1lbGluZX1cbiAgICAgICAgICAvPiAqL31cbiAgICAgICAgPC9zcGFuPlxuICAgICAgICA8c3BhbiBzdHlsZT17U1RZTEVTLmNlbnRlcldyYXBwZXJ9PlxuICAgICAgICAgIDxQbGF5YmFja0J1dHRvbnNcbiAgICAgICAgICAgIHJlbW92ZVRpbWVsaW5lU2hhZG93PXt0aGlzLnByb3BzLnJlbW92ZVRpbWVsaW5lU2hhZG93fVxuICAgICAgICAgICAgbGFzdEZyYW1lPXt0aGlzLnByb3BzLmxhc3RGcmFtZX1cbiAgICAgICAgICAgIGN1cnJlbnRGcmFtZT17dGhpcy5wcm9wcy5jdXJyZW50RnJhbWV9XG4gICAgICAgICAgICBpc1BsYXlpbmc9e3RoaXMucHJvcHMuaXNQbGF5aW5nfVxuICAgICAgICAgICAgcGxheWJhY2tTa2lwQmFjaz17dGhpcy5wcm9wcy5wbGF5YmFja1NraXBCYWNrfVxuICAgICAgICAgICAgcGxheWJhY2tTa2lwRm9yd2FyZD17dGhpcy5wcm9wcy5wbGF5YmFja1NraXBGb3J3YXJkfVxuICAgICAgICAgICAgcGxheWJhY2tQbGF5UGF1c2U9e3RoaXMucHJvcHMucGxheWJhY2tQbGF5UGF1c2V9IC8+XG4gICAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICB0b3A6IC02M1xuICAgICAgICAgIH19PlxuICAgICAgICAgICAgey8qIHpiOiByZW1vdmluZyBmb3Igbm93IGJlY2F1c2VcbiAgICAgICAgICAgICAgICAgICAgICAxLiBpdCBpbnRlcmZlcmVzIHdpdGggYWJpbGl0eSB0byBkcmFnIGhvcml6IHNjcm9sbGJhciAoZXZlbiB3aGVuIGhpZGRlbiwgdmVydGljYWwgdHJhY2sgc3RlYWxzIGV2ZW50cylcbiAgICAgICAgICAgICAgICAgICAgICAyLiB3ZSBkb24ndCBzdXBwb3J0IHBsYXliYWNrIHNwZWVkIGNoYW5nZXMgeWV0LCBwZXJoYXBzIGVuY291cmFnaW5nIHRoZSBuZXcgdXNlciB0byB3b25kZXIgXCJ3aGF0IGVsc2UgaXMgZmFrZT9cIlxuICAgICAgICAgICAgICAgICA8UGxheWJhY2tTcGVlZERpYWxcbiAgICAgICAgICAgICAgY2hhbmdlUGxheWJhY2tTcGVlZD17dGhpcy5wcm9wcy5jaGFuZ2VQbGF5YmFja1NwZWVkfVxuICAgICAgICAgICAgICBwbGF5YmFja1NwZWVkPXt0aGlzLnByb3BzLnBsYXliYWNrU3BlZWR9IC8+ICovfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L3NwYW4+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cbn1cbiJdfQ==