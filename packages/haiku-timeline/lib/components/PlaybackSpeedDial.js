'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _jsxFileName = 'src/components/PlaybackSpeedDial.js';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _radium = require('radium');

var _radium2 = _interopRequireDefault(_radium);

var _DefaultPalette = require('./DefaultPalette');

var _DefaultPalette2 = _interopRequireDefault(_DefaultPalette);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var STYLES = {
  // Note this holster is rotated 90deg counter-clockwise
  sliderHolster: {
    transform: 'rotate(-90deg)',
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 'calc(-100% - 5px)',
    height: 19,
    left: 53,
    borderRadius: 4
  },
  speed: {
    transform: 'rotate(90deg)',
    position: 'absolute',
    bottom: -14,
    left: -31,
    width: 25,
    height: 42,
    lineHeight: 3.4,
    textAlign: 'center',
    borderRadius: 2,
    fontSize: 13,
    fontWeight: 600,
    WebkitUserSelect: 'none',
    cursor: 'pointer'
  },
  input: {
    opacity: 0,
    width: 70,
    margin: '0 7px',
    pointerEvents: 'none'
  },
  show: {
    opacity: 1,
    pointerEvents: 'auto',
    backgroundColor: _DefaultPalette2.default.COAL
  }
};

var PlaybackSpeedDial = function (_React$Component) {
  _inherits(PlaybackSpeedDial, _React$Component);

  function PlaybackSpeedDial(props) {
    _classCallCheck(this, PlaybackSpeedDial);

    var _this = _possibleConstructorReturn(this, (PlaybackSpeedDial.__proto__ || Object.getPrototypeOf(PlaybackSpeedDial)).call(this, props));

    _this.state = { isOpen: false };
    return _this;
  }

  _createClass(PlaybackSpeedDial, [{
    key: 'handleToggle',
    value: function handleToggle() {
      this.setState({ isOpen: !this.state.isOpen });
    }
  }, {
    key: 'handleMouseLeave',
    value: function handleMouseLeave() {
      this.setState({ isOpen: false });
    }
  }, {
    key: 'playbackSpeedChange',
    value: function playbackSpeedChange(changeEvent) {
      this.props.changePlaybackSpeed(changeEvent);
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'span',
        { style: [STYLES.sliderHolster, this.state.isOpen && STYLES.show],
          onMouseLeave: this.handleMouseLeave.bind(this), __source: {
            fileName: _jsxFileName,
            lineNumber: 64
          },
          __self: this
        },
        _react2.default.createElement(
          'div',
          { style: STYLES.speed,
            onClick: this.handleToggle.bind(this), __source: {
              fileName: _jsxFileName,
              lineNumber: 66
            },
            __self: this
          },
          this.props.playbackSpeed,
          _react2.default.createElement(
            'span',
            { style: { fontWeight: 300, marginLeft: 1 }, __source: {
                fileName: _jsxFileName,
                lineNumber: 69
              },
              __self: this
            },
            'x'
          )
        ),
        _react2.default.createElement('input', {
          type: 'range',
          style: [STYLES.input, this.state.isOpen && STYLES.show],
          min: 0.1,
          max: 1,
          step: 0.1,
          value: this.props.playbackSpeed,
          onChange: this.playbackSpeedChange.bind(this), __source: {
            fileName: _jsxFileName,
            lineNumber: 71
          },
          __self: this
        })
      );
    }
  }]);

  return PlaybackSpeedDial;
}(_react2.default.Component);

exports.default = (0, _radium2.default)(PlaybackSpeedDial);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21wb25lbnRzL1BsYXliYWNrU3BlZWREaWFsLmpzIl0sIm5hbWVzIjpbIlNUWUxFUyIsInNsaWRlckhvbHN0ZXIiLCJ0cmFuc2Zvcm0iLCJiYWNrZ3JvdW5kQ29sb3IiLCJwb3NpdGlvbiIsInRvcCIsImhlaWdodCIsImxlZnQiLCJib3JkZXJSYWRpdXMiLCJzcGVlZCIsImJvdHRvbSIsIndpZHRoIiwibGluZUhlaWdodCIsInRleHRBbGlnbiIsImZvbnRTaXplIiwiZm9udFdlaWdodCIsIldlYmtpdFVzZXJTZWxlY3QiLCJjdXJzb3IiLCJpbnB1dCIsIm9wYWNpdHkiLCJtYXJnaW4iLCJwb2ludGVyRXZlbnRzIiwic2hvdyIsIkNPQUwiLCJQbGF5YmFja1NwZWVkRGlhbCIsInByb3BzIiwic3RhdGUiLCJpc09wZW4iLCJzZXRTdGF0ZSIsImNoYW5nZUV2ZW50IiwiY2hhbmdlUGxheWJhY2tTcGVlZCIsImhhbmRsZU1vdXNlTGVhdmUiLCJiaW5kIiwiaGFuZGxlVG9nZ2xlIiwicGxheWJhY2tTcGVlZCIsIm1hcmdpbkxlZnQiLCJwbGF5YmFja1NwZWVkQ2hhbmdlIiwiQ29tcG9uZW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7OztBQUVBLElBQU1BLFNBQVM7QUFDYjtBQUNBQyxpQkFBZTtBQUNiQyxlQUFXLGdCQURFO0FBRWJDLHFCQUFpQixhQUZKO0FBR2JDLGNBQVUsVUFIRztBQUliQyxTQUFLLG1CQUpRO0FBS2JDLFlBQVEsRUFMSztBQU1iQyxVQUFNLEVBTk87QUFPYkMsa0JBQWM7QUFQRCxHQUZGO0FBV2JDLFNBQU87QUFDTFAsZUFBVyxlQUROO0FBRUxFLGNBQVUsVUFGTDtBQUdMTSxZQUFRLENBQUMsRUFISjtBQUlMSCxVQUFNLENBQUMsRUFKRjtBQUtMSSxXQUFPLEVBTEY7QUFNTEwsWUFBUSxFQU5IO0FBT0xNLGdCQUFZLEdBUFA7QUFRTEMsZUFBVyxRQVJOO0FBU0xMLGtCQUFjLENBVFQ7QUFVTE0sY0FBVSxFQVZMO0FBV0xDLGdCQUFZLEdBWFA7QUFZTEMsc0JBQWtCLE1BWmI7QUFhTEMsWUFBUTtBQWJILEdBWE07QUEwQmJDLFNBQU87QUFDTEMsYUFBUyxDQURKO0FBRUxSLFdBQU8sRUFGRjtBQUdMUyxZQUFRLE9BSEg7QUFJTEMsbUJBQWU7QUFKVixHQTFCTTtBQWdDYkMsUUFBTTtBQUNKSCxhQUFTLENBREw7QUFFSkUsbUJBQWUsTUFGWDtBQUdKbEIscUJBQWlCLHlCQUFRb0I7QUFIckI7QUFoQ08sQ0FBZjs7SUF1Q01DLGlCOzs7QUFDSiw2QkFBYUMsS0FBYixFQUFvQjtBQUFBOztBQUFBLHNJQUNaQSxLQURZOztBQUVsQixVQUFLQyxLQUFMLEdBQWEsRUFBRUMsUUFBUSxLQUFWLEVBQWI7QUFGa0I7QUFHbkI7Ozs7bUNBRWU7QUFDZCxXQUFLQyxRQUFMLENBQWMsRUFBRUQsUUFBUSxDQUFDLEtBQUtELEtBQUwsQ0FBV0MsTUFBdEIsRUFBZDtBQUNEOzs7dUNBRW1CO0FBQ2xCLFdBQUtDLFFBQUwsQ0FBYyxFQUFFRCxRQUFRLEtBQVYsRUFBZDtBQUNEOzs7d0NBRW9CRSxXLEVBQWE7QUFDaEMsV0FBS0osS0FBTCxDQUFXSyxtQkFBWCxDQUErQkQsV0FBL0I7QUFDRDs7OzZCQUVTO0FBQ1IsYUFDRTtBQUFBO0FBQUEsVUFBTSxPQUFPLENBQUM3QixPQUFPQyxhQUFSLEVBQXVCLEtBQUt5QixLQUFMLENBQVdDLE1BQVgsSUFBcUIzQixPQUFPc0IsSUFBbkQsQ0FBYjtBQUNFLHdCQUFjLEtBQUtTLGdCQUFMLENBQXNCQyxJQUF0QixDQUEyQixJQUEzQixDQURoQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFFRTtBQUFBO0FBQUEsWUFBSyxPQUFPaEMsT0FBT1MsS0FBbkI7QUFDRSxxQkFBUyxLQUFLd0IsWUFBTCxDQUFrQkQsSUFBbEIsQ0FBdUIsSUFBdkIsQ0FEWDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFFRyxlQUFLUCxLQUFMLENBQVdTLGFBRmQ7QUFHRTtBQUFBO0FBQUEsY0FBTSxPQUFPLEVBQUVuQixZQUFZLEdBQWQsRUFBbUJvQixZQUFZLENBQS9CLEVBQWI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUhGLFNBRkY7QUFPRTtBQUNFLGdCQUFLLE9BRFA7QUFFRSxpQkFBTyxDQUFDbkMsT0FBT2tCLEtBQVIsRUFBZSxLQUFLUSxLQUFMLENBQVdDLE1BQVgsSUFBcUIzQixPQUFPc0IsSUFBM0MsQ0FGVDtBQUdFLGVBQUssR0FIUDtBQUlFLGVBQUssQ0FKUDtBQUtFLGdCQUFNLEdBTFI7QUFNRSxpQkFBTyxLQUFLRyxLQUFMLENBQVdTLGFBTnBCO0FBT0Usb0JBQVUsS0FBS0UsbUJBQUwsQ0FBeUJKLElBQXpCLENBQThCLElBQTlCLENBUFo7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBUEYsT0FERjtBQWtCRDs7OztFQXJDNkIsZ0JBQU1LLFM7O2tCQXdDdkIsc0JBQU9iLGlCQUFQLEMiLCJmaWxlIjoiUGxheWJhY2tTcGVlZERpYWwuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgUmFkaXVtIGZyb20gJ3JhZGl1bSdcbmltcG9ydCBQYWxldHRlIGZyb20gJy4vRGVmYXVsdFBhbGV0dGUnXG5cbmNvbnN0IFNUWUxFUyA9IHtcbiAgLy8gTm90ZSB0aGlzIGhvbHN0ZXIgaXMgcm90YXRlZCA5MGRlZyBjb3VudGVyLWNsb2Nrd2lzZVxuICBzbGlkZXJIb2xzdGVyOiB7XG4gICAgdHJhbnNmb3JtOiAncm90YXRlKC05MGRlZyknLFxuICAgIGJhY2tncm91bmRDb2xvcjogJ3RyYW5zcGFyZW50JyxcbiAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICB0b3A6ICdjYWxjKC0xMDAlIC0gNXB4KScsXG4gICAgaGVpZ2h0OiAxOSxcbiAgICBsZWZ0OiA1MyxcbiAgICBib3JkZXJSYWRpdXM6IDRcbiAgfSxcbiAgc3BlZWQ6IHtcbiAgICB0cmFuc2Zvcm06ICdyb3RhdGUoOTBkZWcpJyxcbiAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICBib3R0b206IC0xNCxcbiAgICBsZWZ0OiAtMzEsXG4gICAgd2lkdGg6IDI1LFxuICAgIGhlaWdodDogNDIsXG4gICAgbGluZUhlaWdodDogMy40LFxuICAgIHRleHRBbGlnbjogJ2NlbnRlcicsXG4gICAgYm9yZGVyUmFkaXVzOiAyLFxuICAgIGZvbnRTaXplOiAxMyxcbiAgICBmb250V2VpZ2h0OiA2MDAsXG4gICAgV2Via2l0VXNlclNlbGVjdDogJ25vbmUnLFxuICAgIGN1cnNvcjogJ3BvaW50ZXInXG4gIH0sXG4gIGlucHV0OiB7XG4gICAgb3BhY2l0eTogMCxcbiAgICB3aWR0aDogNzAsXG4gICAgbWFyZ2luOiAnMCA3cHgnLFxuICAgIHBvaW50ZXJFdmVudHM6ICdub25lJ1xuICB9LFxuICBzaG93OiB7XG4gICAgb3BhY2l0eTogMSxcbiAgICBwb2ludGVyRXZlbnRzOiAnYXV0bycsXG4gICAgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLkNPQUxcbiAgfVxufVxuXG5jbGFzcyBQbGF5YmFja1NwZWVkRGlhbCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yIChwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKVxuICAgIHRoaXMuc3RhdGUgPSB7IGlzT3BlbjogZmFsc2UgfVxuICB9XG5cbiAgaGFuZGxlVG9nZ2xlICgpIHtcbiAgICB0aGlzLnNldFN0YXRlKHsgaXNPcGVuOiAhdGhpcy5zdGF0ZS5pc09wZW4gfSlcbiAgfVxuXG4gIGhhbmRsZU1vdXNlTGVhdmUgKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoeyBpc09wZW46IGZhbHNlIH0pXG4gIH1cblxuICBwbGF5YmFja1NwZWVkQ2hhbmdlIChjaGFuZ2VFdmVudCkge1xuICAgIHRoaXMucHJvcHMuY2hhbmdlUGxheWJhY2tTcGVlZChjaGFuZ2VFdmVudClcbiAgfVxuXG4gIHJlbmRlciAoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxzcGFuIHN0eWxlPXtbU1RZTEVTLnNsaWRlckhvbHN0ZXIsIHRoaXMuc3RhdGUuaXNPcGVuICYmIFNUWUxFUy5zaG93XX1cbiAgICAgICAgb25Nb3VzZUxlYXZlPXt0aGlzLmhhbmRsZU1vdXNlTGVhdmUuYmluZCh0aGlzKX0+XG4gICAgICAgIDxkaXYgc3R5bGU9e1NUWUxFUy5zcGVlZH1cbiAgICAgICAgICBvbkNsaWNrPXt0aGlzLmhhbmRsZVRvZ2dsZS5iaW5kKHRoaXMpfT5cbiAgICAgICAgICB7dGhpcy5wcm9wcy5wbGF5YmFja1NwZWVkfVxuICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGZvbnRXZWlnaHQ6IDMwMCwgbWFyZ2luTGVmdDogMSB9fT54PC9zcGFuPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGlucHV0XG4gICAgICAgICAgdHlwZT0ncmFuZ2UnXG4gICAgICAgICAgc3R5bGU9e1tTVFlMRVMuaW5wdXQsIHRoaXMuc3RhdGUuaXNPcGVuICYmIFNUWUxFUy5zaG93XX1cbiAgICAgICAgICBtaW49ezAuMX1cbiAgICAgICAgICBtYXg9ezF9XG4gICAgICAgICAgc3RlcD17MC4xfVxuICAgICAgICAgIHZhbHVlPXt0aGlzLnByb3BzLnBsYXliYWNrU3BlZWR9XG4gICAgICAgICAgb25DaGFuZ2U9e3RoaXMucGxheWJhY2tTcGVlZENoYW5nZS5iaW5kKHRoaXMpfSAvPlxuICAgICAgPC9zcGFuPlxuICAgIClcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBSYWRpdW0oUGxheWJhY2tTcGVlZERpYWwpXG4iXX0=