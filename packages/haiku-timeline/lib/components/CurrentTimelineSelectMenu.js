'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _jsxFileName = 'src/components/CurrentTimelineSelectMenu.js';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _reactPopover = require('react-popover');

var _reactPopover2 = _interopRequireDefault(_reactPopover);

var _ChevronDownIconSVG = require('./icons/ChevronDownIconSVG');

var _ChevronDownIconSVG2 = _interopRequireDefault(_ChevronDownIconSVG);

var _TimelineIconSVG = require('./icons/TimelineIconSVG');

var _TimelineIconSVG2 = _interopRequireDefault(_TimelineIconSVG);

var _DefaultPalette = require('./DefaultPalette');

var _DefaultPalette2 = _interopRequireDefault(_DefaultPalette);

var _CurrentTimelinePopover = require('./CurrentTimelinePopover');

var _CurrentTimelinePopover2 = _interopRequireDefault(_CurrentTimelinePopover);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CurrentTimelineSelectMenu = function (_React$Component) {
  _inherits(CurrentTimelineSelectMenu, _React$Component);

  function CurrentTimelineSelectMenu(props) {
    _classCallCheck(this, CurrentTimelineSelectMenu);

    var _this = _possibleConstructorReturn(this, (CurrentTimelineSelectMenu.__proto__ || Object.getPrototypeOf(CurrentTimelineSelectMenu)).call(this, props));

    _this.state = { popoverOpen: false };
    return _this;
  }

  _createClass(CurrentTimelineSelectMenu, [{
    key: 'togglePopover',
    value: function togglePopover() {
      this.setState({ popoverOpen: !this.state.popoverOpen });
    }
  }, {
    key: 'render',
    value: function render() {
      var nothing = _react2.default.createElement('div', {
        style: {
          height: 30,
          backgroundColor: _DefaultPalette2.default.COAL,
          borderBottom: '1px solid ' + _DefaultPalette2.default.LIGHTER_GRAY
        }, __source: {
          fileName: _jsxFileName,
          lineNumber: 21
        },
        __self: this
      });

      if (this.props.timelineNames.length < 1) return nothing;
      var popoverOpen = this.state.popoverOpen;


      return _react2.default.createElement(
        _reactPopover2.default,
        {
          place: 'above',
          isOpen: popoverOpen,
          className: 'timeline-pop show-top',
          body: _react2.default.createElement(
            'div',
            { style: {
                position: 'relative',
                top: -210
              }, __source: {
                fileName: _jsxFileName,
                lineNumber: 38
              },
              __self: this
            },
            _react2.default.createElement(_CurrentTimelinePopover2.default, {
              closePopover: this.togglePopover.bind(this),
              timelineNames: this.props.timelineNames,
              changeTimelineName: this.props.changeTimelineName,
              createTimeline: this.props.createTimeline,
              duplicateTimeline: this.props.duplicateTimeline,
              deleteTimeline: this.props.deleteTimeline,
              selectTimeline: this.props.selectTimeline,
              __source: {
                fileName: _jsxFileName,
                lineNumber: 42
              },
              __self: this
            })
          ),
          onOuterAction: this.togglePopover.bind(this), __source: {
            fileName: _jsxFileName,
            lineNumber: 33
          },
          __self: this
        },
        _react2.default.createElement(
          'button',
          {
            style: {
              padding: '0 11px',
              display: 'flex',
              alignItems: 'center',
              height: 24,
              borderRadius: 4,
              marginLeft: 8,
              marginBottom: -1,
              fontSize: 10,
              color: _DefaultPalette2.default.ROCK,
              backgroundColor: _DefaultPalette2.default.COAL,
              cursor: 'pointer'
            },
            className: (0, _classnames2.default)('target', { popoverOpen: popoverOpen }),
            onClick: this.togglePopover.bind(this), __source: {
              fileName: _jsxFileName,
              lineNumber: 54
            },
            __self: this
          },
          _react2.default.createElement(_TimelineIconSVG2.default, {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 70
            },
            __self: this
          }),
          _react2.default.createElement(
            'span',
            {
              style: {
                marginRight: 8,
                marginLeft: 5,
                lineHeight: 0.3
              }, __source: {
                fileName: _jsxFileName,
                lineNumber: 71
              },
              __self: this
            },
            this.props.selectedTimelineName
          ),
          _react2.default.createElement(_ChevronDownIconSVG2.default, { color: _DefaultPalette2.default.ROCK, __source: {
              fileName: _jsxFileName,
              lineNumber: 79
            },
            __self: this
          })
        )
      );
    }
  }]);

  return CurrentTimelineSelectMenu;
}(_react2.default.Component);

exports.default = CurrentTimelineSelectMenu;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21wb25lbnRzL0N1cnJlbnRUaW1lbGluZVNlbGVjdE1lbnUuanMiXSwibmFtZXMiOlsiQ3VycmVudFRpbWVsaW5lU2VsZWN0TWVudSIsInByb3BzIiwic3RhdGUiLCJwb3BvdmVyT3BlbiIsInNldFN0YXRlIiwibm90aGluZyIsImhlaWdodCIsImJhY2tncm91bmRDb2xvciIsIkNPQUwiLCJib3JkZXJCb3R0b20iLCJMSUdIVEVSX0dSQVkiLCJ0aW1lbGluZU5hbWVzIiwibGVuZ3RoIiwicG9zaXRpb24iLCJ0b3AiLCJ0b2dnbGVQb3BvdmVyIiwiYmluZCIsImNoYW5nZVRpbWVsaW5lTmFtZSIsImNyZWF0ZVRpbWVsaW5lIiwiZHVwbGljYXRlVGltZWxpbmUiLCJkZWxldGVUaW1lbGluZSIsInNlbGVjdFRpbWVsaW5lIiwicGFkZGluZyIsImRpc3BsYXkiLCJhbGlnbkl0ZW1zIiwiYm9yZGVyUmFkaXVzIiwibWFyZ2luTGVmdCIsIm1hcmdpbkJvdHRvbSIsImZvbnRTaXplIiwiY29sb3IiLCJST0NLIiwiY3Vyc29yIiwibWFyZ2luUmlnaHQiLCJsaW5lSGVpZ2h0Iiwic2VsZWN0ZWRUaW1lbGluZU5hbWUiLCJDb21wb25lbnQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7Ozs7SUFFcUJBLHlCOzs7QUFDbkIscUNBQWFDLEtBQWIsRUFBb0I7QUFBQTs7QUFBQSxzSkFDWkEsS0FEWTs7QUFFbEIsVUFBS0MsS0FBTCxHQUFhLEVBQUVDLGFBQWEsS0FBZixFQUFiO0FBRmtCO0FBR25COzs7O29DQUVnQjtBQUNmLFdBQUtDLFFBQUwsQ0FBYyxFQUFFRCxhQUFhLENBQUMsS0FBS0QsS0FBTCxDQUFXQyxXQUEzQixFQUFkO0FBQ0Q7Ozs2QkFFUztBQUNSLFVBQU1FLFVBQ0o7QUFDRSxlQUFPO0FBQ0xDLGtCQUFRLEVBREg7QUFFTEMsMkJBQWlCLHlCQUFlQyxJQUYzQjtBQUdMQyx3QkFBYyxlQUFlLHlCQUFlQztBQUh2QyxTQURUO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxRQURGOztBQVNBLFVBQUksS0FBS1QsS0FBTCxDQUFXVSxhQUFYLENBQXlCQyxNQUF6QixHQUFrQyxDQUF0QyxFQUF5QyxPQUFPUCxPQUFQO0FBVmpDLFVBV0FGLFdBWEEsR0FXZ0IsS0FBS0QsS0FYckIsQ0FXQUMsV0FYQTs7O0FBYVIsYUFDRTtBQUFBO0FBQUE7QUFDRSxpQkFBTSxPQURSO0FBRUUsa0JBQVFBLFdBRlY7QUFHRSxxQkFBVSx1QkFIWjtBQUlFLGdCQUNFO0FBQUE7QUFBQSxjQUFLLE9BQU87QUFDVlUsMEJBQVUsVUFEQTtBQUVWQyxxQkFBSyxDQUFDO0FBRkksZUFBWjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFJRTtBQUNFLDRCQUFjLEtBQUtDLGFBQUwsQ0FBbUJDLElBQW5CLENBQXdCLElBQXhCLENBRGhCO0FBRUUsNkJBQWUsS0FBS2YsS0FBTCxDQUFXVSxhQUY1QjtBQUdFLGtDQUFvQixLQUFLVixLQUFMLENBQVdnQixrQkFIakM7QUFJRSw4QkFBZ0IsS0FBS2hCLEtBQUwsQ0FBV2lCLGNBSjdCO0FBS0UsaUNBQW1CLEtBQUtqQixLQUFMLENBQVdrQixpQkFMaEM7QUFNRSw4QkFBZ0IsS0FBS2xCLEtBQUwsQ0FBV21CLGNBTjdCO0FBT0UsOEJBQWdCLEtBQUtuQixLQUFMLENBQVdvQixjQVA3QjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUpGLFdBTEo7QUFvQkUseUJBQWUsS0FBS04sYUFBTCxDQUFtQkMsSUFBbkIsQ0FBd0IsSUFBeEIsQ0FwQmpCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQXFCRTtBQUFBO0FBQUE7QUFDRSxtQkFBTztBQUNMTSx1QkFBUyxRQURKO0FBRUxDLHVCQUFTLE1BRko7QUFHTEMsMEJBQVksUUFIUDtBQUlMbEIsc0JBQVEsRUFKSDtBQUtMbUIsNEJBQWMsQ0FMVDtBQU1MQywwQkFBWSxDQU5QO0FBT0xDLDRCQUFjLENBQUMsQ0FQVjtBQVFMQyx3QkFBVSxFQVJMO0FBU0xDLHFCQUFPLHlCQUFlQyxJQVRqQjtBQVVMdkIsK0JBQWlCLHlCQUFlQyxJQVYzQjtBQVdMdUIsc0JBQVE7QUFYSCxhQURUO0FBY0UsdUJBQVcsMEJBQVcsUUFBWCxFQUFxQixFQUFFNUIsd0JBQUYsRUFBckIsQ0FkYjtBQWVFLHFCQUFTLEtBQUtZLGFBQUwsQ0FBbUJDLElBQW5CLENBQXdCLElBQXhCLENBZlg7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBZ0JFO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFlBaEJGO0FBaUJFO0FBQUE7QUFBQTtBQUNFLHFCQUFPO0FBQ0xnQiw2QkFBYSxDQURSO0FBRUxOLDRCQUFZLENBRlA7QUFHTE8sNEJBQVk7QUFIUCxlQURUO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQU1HLGlCQUFLaEMsS0FBTCxDQUFXaUM7QUFOZCxXQWpCRjtBQXlCRSx3RUFBb0IsT0FBTyx5QkFBZUosSUFBMUM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBekJGO0FBckJGLE9BREY7QUFtREQ7Ozs7RUExRW9ELGdCQUFNSyxTOztrQkFBeENuQyx5QiIsImZpbGUiOiJDdXJyZW50VGltZWxpbmVTZWxlY3RNZW51LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IGNsYXNzTmFtZXMgZnJvbSAnY2xhc3NuYW1lcydcbmltcG9ydCBQb3BvdmVyIGZyb20gJ3JlYWN0LXBvcG92ZXInXG5pbXBvcnQgQ2hldnJvbkRvd25JY29uU1ZHIGZyb20gJy4vaWNvbnMvQ2hldnJvbkRvd25JY29uU1ZHJ1xuaW1wb3J0IFRpbWVsaW5lSWNvblNWRyBmcm9tICcuL2ljb25zL1RpbWVsaW5lSWNvblNWRydcbmltcG9ydCBEZWZhdWx0UGFsZXR0ZSBmcm9tICcuL0RlZmF1bHRQYWxldHRlJ1xuaW1wb3J0IEN1cnJlbnRUaW1lbGluZVBvcG92ZXIgZnJvbSAnLi9DdXJyZW50VGltZWxpbmVQb3BvdmVyJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDdXJyZW50VGltZWxpbmVTZWxlY3RNZW51IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IgKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpXG4gICAgdGhpcy5zdGF0ZSA9IHsgcG9wb3Zlck9wZW46IGZhbHNlIH1cbiAgfVxuXG4gIHRvZ2dsZVBvcG92ZXIgKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoeyBwb3BvdmVyT3BlbjogIXRoaXMuc3RhdGUucG9wb3Zlck9wZW4gfSlcbiAgfVxuXG4gIHJlbmRlciAoKSB7XG4gICAgY29uc3Qgbm90aGluZyA9IChcbiAgICAgIDxkaXZcbiAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICBoZWlnaHQ6IDMwLFxuICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogRGVmYXVsdFBhbGV0dGUuQ09BTCxcbiAgICAgICAgICBib3JkZXJCb3R0b206ICcxcHggc29saWQgJyArIERlZmF1bHRQYWxldHRlLkxJR0hURVJfR1JBWVxuICAgICAgICB9fSAvPlxuICAgIClcblxuICAgIGlmICh0aGlzLnByb3BzLnRpbWVsaW5lTmFtZXMubGVuZ3RoIDwgMSkgcmV0dXJuIG5vdGhpbmdcbiAgICBjb25zdCB7IHBvcG92ZXJPcGVuIH0gPSB0aGlzLnN0YXRlXG5cbiAgICByZXR1cm4gKFxuICAgICAgPFBvcG92ZXJcbiAgICAgICAgcGxhY2U9J2Fib3ZlJ1xuICAgICAgICBpc09wZW49e3BvcG92ZXJPcGVufVxuICAgICAgICBjbGFzc05hbWU9J3RpbWVsaW5lLXBvcCBzaG93LXRvcCdcbiAgICAgICAgYm9keT17XG4gICAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgICAgcG9zaXRpb246ICdyZWxhdGl2ZScsXG4gICAgICAgICAgICB0b3A6IC0yMTBcbiAgICAgICAgICB9fT5cbiAgICAgICAgICAgIDxDdXJyZW50VGltZWxpbmVQb3BvdmVyXG4gICAgICAgICAgICAgIGNsb3NlUG9wb3Zlcj17dGhpcy50b2dnbGVQb3BvdmVyLmJpbmQodGhpcyl9XG4gICAgICAgICAgICAgIHRpbWVsaW5lTmFtZXM9e3RoaXMucHJvcHMudGltZWxpbmVOYW1lc31cbiAgICAgICAgICAgICAgY2hhbmdlVGltZWxpbmVOYW1lPXt0aGlzLnByb3BzLmNoYW5nZVRpbWVsaW5lTmFtZX1cbiAgICAgICAgICAgICAgY3JlYXRlVGltZWxpbmU9e3RoaXMucHJvcHMuY3JlYXRlVGltZWxpbmV9XG4gICAgICAgICAgICAgIGR1cGxpY2F0ZVRpbWVsaW5lPXt0aGlzLnByb3BzLmR1cGxpY2F0ZVRpbWVsaW5lfVxuICAgICAgICAgICAgICBkZWxldGVUaW1lbGluZT17dGhpcy5wcm9wcy5kZWxldGVUaW1lbGluZX1cbiAgICAgICAgICAgICAgc2VsZWN0VGltZWxpbmU9e3RoaXMucHJvcHMuc2VsZWN0VGltZWxpbmV9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIH1cbiAgICAgICAgb25PdXRlckFjdGlvbj17dGhpcy50b2dnbGVQb3BvdmVyLmJpbmQodGhpcyl9PlxuICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIHBhZGRpbmc6ICcwIDExcHgnLFxuICAgICAgICAgICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgICAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgICAgICAgICBoZWlnaHQ6IDI0LFxuICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiA0LFxuICAgICAgICAgICAgbWFyZ2luTGVmdDogOCxcbiAgICAgICAgICAgIG1hcmdpbkJvdHRvbTogLTEsXG4gICAgICAgICAgICBmb250U2l6ZTogMTAsXG4gICAgICAgICAgICBjb2xvcjogRGVmYXVsdFBhbGV0dGUuUk9DSyxcbiAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogRGVmYXVsdFBhbGV0dGUuQ09BTCxcbiAgICAgICAgICAgIGN1cnNvcjogJ3BvaW50ZXInXG4gICAgICAgICAgfX1cbiAgICAgICAgICBjbGFzc05hbWU9e2NsYXNzTmFtZXMoJ3RhcmdldCcsIHsgcG9wb3Zlck9wZW4gfSl9XG4gICAgICAgICAgb25DbGljaz17dGhpcy50b2dnbGVQb3BvdmVyLmJpbmQodGhpcyl9PlxuICAgICAgICAgIDxUaW1lbGluZUljb25TVkcgLz5cbiAgICAgICAgICA8c3BhblxuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgbWFyZ2luUmlnaHQ6IDgsXG4gICAgICAgICAgICAgIG1hcmdpbkxlZnQ6IDUsXG4gICAgICAgICAgICAgIGxpbmVIZWlnaHQ6IDAuM1xuICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICB7dGhpcy5wcm9wcy5zZWxlY3RlZFRpbWVsaW5lTmFtZX1cbiAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgPENoZXZyb25Eb3duSWNvblNWRyBjb2xvcj17RGVmYXVsdFBhbGV0dGUuUk9DS30gLz5cbiAgICAgICAgPC9idXR0b24+XG4gICAgICA8L1BvcG92ZXI+XG4gICAgKVxuICB9XG59XG4iXX0=