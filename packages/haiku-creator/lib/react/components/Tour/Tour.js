'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _jsxFileName = 'src/react/components/Tour/Tour.js';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Tooltip = require('../Tooltip');

var _Tooltip2 = _interopRequireDefault(_Tooltip);

var _electron = require('electron');

var _tourShared = require('../../styles/tourShared');

var _Steps = require('./Steps');

var steps = _interopRequireWildcard(_Steps);

var _Mixpanel = require('../../../utils/Mixpanel');

var _Mixpanel2 = _interopRequireDefault(_Mixpanel);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Tour = function (_React$Component) {
  _inherits(Tour, _React$Component);

  function Tour() {
    _classCallCheck(this, Tour);

    var _this = _possibleConstructorReturn(this, (Tour.__proto__ || Object.getPrototypeOf(Tour)).call(this));

    _this.next = _this.next.bind(_this);
    _this.finish = _this.finish.bind(_this);
    _this.hide = _this.hide.bind(_this);
    _this.showStep = _this.showStep.bind(_this);

    _this.state = {
      component: null,
      coordinates: null
    };
    return _this;
  }

  _createClass(Tour, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      this.props.envoy.get('tour').then(function (tourChannel) {
        _this2.tourChannel = tourChannel;
        _this2.tourChannel.on('tour:requestShowStep', _this2.showStep);
        _this2.tourChannel.on('tour:requestFinish', _this2.hide);
      });
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.tourChannel.off('tour:requestShowStep', this.showStep);
      this.tourChannel.off('tour:requestFinish', this.hide);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps() {
      if (this.props.startTourOnMount && this.hasNecessaryProject()) {
        this.tourChannel.start();
        _Mixpanel2.default.haikuTrack('tour', { state: 'started' });
      }
    }
  }, {
    key: 'hasNecessaryProject',
    value: function hasNecessaryProject() {
      if (!this.props.projectsList) return false;
      if (this.props.projectsList.length < 1) return false;
      var projectIdx = this.props.projectsList.findIndex(function (project) {
        // Hardcoded - Name of the project that will be used for the tutorial
        return project.projectName === 'CheckTutorial';
      });
      return projectIdx !== -1;
    }
  }, {
    key: 'next',
    value: function next() {
      this.tourChannel.next();
      _Mixpanel2.default.haikuTrack('tour', {
        state: 'step completed',
        step: this.state.stepData.current,
        title: this.state.component
      });
    }
  }, {
    key: 'finish',
    value: function finish(createFile, skipped) {
      this.tourChannel.finish(createFile);
      _Mixpanel2.default.haikuTrack('tour', {
        state: 'skipped',
        step: this.state.stepData.current,
        title: this.state.component
      });
    }
  }, {
    key: 'hide',
    value: function hide() {
      this.setState({ component: null });
    }
  }, {
    key: 'showStep',
    value: function showStep(state) {
      this.setState(state);
    }
  }, {
    key: 'openLink',
    value: function openLink(e) {
      e.preventDefault();
      _electron.shell.openExternal(e.target.href);
    }
  }, {
    key: 'render',
    value: function render() {
      if (!this.state.component) {
        return null;
      }

      var _state = this.state,
          display = _state.display,
          coordinates = _state.coordinates,
          offset = _state.offset,
          component = _state.component,
          spotlightRadius = _state.spotlightRadius,
          stepData = _state.stepData,
          waitUserAction = _state.waitUserAction;


      var Step = steps[component];

      return _react2.default.createElement(
        _Tooltip2.default,
        {
          coordinates: coordinates,
          offset: offset,
          display: display,
          spotlightRadius: spotlightRadius,
          next: this.next,
          finish: this.finish,
          stepData: stepData,
          waitUserAction: waitUserAction,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 102
          },
          __self: this
        },
        _react2.default.createElement(Step, { styles: _tourShared.TOUR_STYLES, next: this.next, finish: this.finish, openLink: this.openLink, __source: {
            fileName: _jsxFileName,
            lineNumber: 112
          },
          __self: this
        })
      );
    }
  }]);

  return Tour;
}(_react2.default.Component);

exports.default = Tour;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9yZWFjdC9jb21wb25lbnRzL1RvdXIvVG91ci5qcyJdLCJuYW1lcyI6WyJzdGVwcyIsIlRvdXIiLCJuZXh0IiwiYmluZCIsImZpbmlzaCIsImhpZGUiLCJzaG93U3RlcCIsInN0YXRlIiwiY29tcG9uZW50IiwiY29vcmRpbmF0ZXMiLCJwcm9wcyIsImVudm95IiwiZ2V0IiwidGhlbiIsInRvdXJDaGFubmVsIiwib24iLCJvZmYiLCJzdGFydFRvdXJPbk1vdW50IiwiaGFzTmVjZXNzYXJ5UHJvamVjdCIsInN0YXJ0IiwiaGFpa3VUcmFjayIsInByb2plY3RzTGlzdCIsImxlbmd0aCIsInByb2plY3RJZHgiLCJmaW5kSW5kZXgiLCJwcm9qZWN0IiwicHJvamVjdE5hbWUiLCJzdGVwIiwic3RlcERhdGEiLCJjdXJyZW50IiwidGl0bGUiLCJjcmVhdGVGaWxlIiwic2tpcHBlZCIsInNldFN0YXRlIiwiZSIsInByZXZlbnREZWZhdWx0Iiwib3BlbkV4dGVybmFsIiwidGFyZ2V0IiwiaHJlZiIsImRpc3BsYXkiLCJvZmZzZXQiLCJzcG90bGlnaHRSYWRpdXMiLCJ3YWl0VXNlckFjdGlvbiIsIlN0ZXAiLCJvcGVuTGluayIsIkNvbXBvbmVudCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOztBQUNBOztBQUNBOztJQUFZQSxLOztBQUNaOzs7Ozs7Ozs7Ozs7OztJQUVNQyxJOzs7QUFDSixrQkFBZTtBQUFBOztBQUFBOztBQUdiLFVBQUtDLElBQUwsR0FBWSxNQUFLQSxJQUFMLENBQVVDLElBQVYsT0FBWjtBQUNBLFVBQUtDLE1BQUwsR0FBYyxNQUFLQSxNQUFMLENBQVlELElBQVosT0FBZDtBQUNBLFVBQUtFLElBQUwsR0FBWSxNQUFLQSxJQUFMLENBQVVGLElBQVYsT0FBWjtBQUNBLFVBQUtHLFFBQUwsR0FBZ0IsTUFBS0EsUUFBTCxDQUFjSCxJQUFkLE9BQWhCOztBQUVBLFVBQUtJLEtBQUwsR0FBYTtB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TSxVQVlOQSxjQVpNOzs7QUFlUixVQUFNQyxPQUFPM0MsTUFBTVEsU0FBTixDQUFiOztBQUVBLGFBQ0U7QUFBQTtBQUFBO0FBQ0UsdUJBQWFDLFdBRGY7QUFFRSxrQkFBUStCLE1BRlY7QUFHRSxtQkFBU0QsT0FIWDtBQUlFLDJCQUFpQkUsZUFKbkI7QUFLRSxnQkFBTSxLQUFLdkMsSUFMYjtBQU1FLGtCQUFRLEtBQUtFLE1BTmY7QUFPRSxvQkFBVXdCLFFBUFo7QUFRRSwwQkFBZ0JjLGNBUmxCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBVUUsc0NBQUMsSUFBRCxJQUFNLCtCQUFOLEVBQTJCLE1BQU0sS0FBS3hDLElBQXRDLEVBQTRDLFFBQVEsS0FBS0UsTUFBekQsRUFBaUUsVUFBVSxLQUFLd0MsUUFBaEY7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBVkYsT0FERjtBQWNEOzs7O0VBM0dnQixnQkFBTUMsUzs7a0JBOEdWNUMsSSIsImZpbGUiOiJUb3VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IFRvb2x0aXAgZnJvbSAnLi4vVG9vbHRpcCdcbmltcG9ydCB7IHNoZWxsIH0gZnJvbSAnZWxlY3Ryb24nXG5pbXBvcnQgeyBUT1VSX1NUWUxFUyB9IGZyb20gJy4uLy4uL3N0eWxlcy90b3VyU2hhcmVkJ1xuaW1wb3J0ICogYXMgc3RlcHMgZnJvbSAnLi9TdGVwcydcbmltcG9ydCBtaXhwYW5lbCBmcm9tICcuLi8uLi8uLi91dGlscy9NaXhwYW5lbCdcblxuY2xhc3MgVG91ciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yICgpIHtcbiAgICBzdXBlcigpXG5cbiAgICB0aGlzLm5leHQgPSB0aGlzLm5leHQuYmluZCh0aGlzKVxuICAgIHRoaXMuZmluaXNoID0gdGhpcy5maW5pc2guYmluZCh0aGlzKVxuICAgIHRoaXMuaGlkZSA9IHRoaXMuaGlkZS5iaW5kKHRoaXMpXG4gICAgdGhpcy5zaG93U3RlcCA9IHRoaXMuc2hvd1N0ZXAuYmluZCh0aGlzKVxuXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIGNvbXBvbmVudDogbnVsbCxcbiAgICAgIGNvb3JkaW5hdGVzOiBudWxsXG4gICAgfVxuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQgKCkge1xuICAgIHRoaXMucHJvcHMuZW52b3kuZ2V0KCd0b3VyJykudGhlbigodG91ckNoYW5uZWwpID0+IHtcbiAgICAgIHRoaXMudG91ckNoYW5uZWwgPSB0b3VyQ2hhbm5lbFxuICAgICAgdGhpcy50b3VyQ2hhbm5lbC5vbigndG91cjpyZXF1ZXN0U2hvd1N0ZXAnLCB0aGlzLnNob3dTdGVwKVxuICAgICAgdGhpcy50b3VyQ2hhbm5lbC5vbigndG91cjpyZXF1ZXN0RmluaXNoJywgdGhpcy5oaWRlKVxuICAgIH0pXG4gIH1cblxuICBjb21wb25lbnRXaWxsVW5tb3VudCAoKSB7XG4gICAgdGhpcy50b3VyQ2hhbm5lbC5vZmYoJ3RvdXI6cmVxdWVzdFNob3dTdGVwJywgdGhpcy5zaG93U3RlcClcbiAgICB0aGlzLnRvdXJDaGFubmVsLm9mZigndG91cjpyZXF1ZXN0RmluaXNoJywgdGhpcy5oaWRlKVxuICB9XG5cbiAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyAoKSB7XG4gICAgaWYgKHRoaXMucHJvcHMuc3RhcnRUb3VyT25Nb3VudCAmJiB0aGlzLmhhc05lY2Vzc2FyeVByb2plY3QoKSkge1xuICAgICAgdGhpcy50b3VyQ2hhbm5lbC5zdGFydCgpXG4gICAgICBtaXhwYW5lbC5oYWlrdVRyYWNrKCd0b3VyJywge3N0YXRlOiAnc3RhcnRlZCd9KVxuICAgIH1cbiAgfVxuXG4gIGhhc05lY2Vzc2FyeVByb2plY3QgKCkge1xuICAgIGlmICghdGhpcy5wcm9wcy5wcm9qZWN0c0xpc3QpIHJldHVybiBmYWxzZVxuICAgIGlmICh0aGlzLnByb3BzLnByb2plY3RzTGlzdC5sZW5ndGggPCAxKSByZXR1cm4gZmFsc2VcbiAgICBjb25zdCBwcm9qZWN0SWR4ID0gdGhpcy5wcm9wcy5wcm9qZWN0c0xpc3QuZmluZEluZGV4KChwcm9qZWN0KSA9PiB7XG4gICAgICAvLyBIYXJkY29kZWQgLSBOYW1lIG9mIHRoZSBwcm9qZWN0IHRoYXQgd2lsbCBiZSB1c2VkIGZvciB0aGUgdHV0b3JpYWxcbiAgICAgIHJldHVybiBwcm9qZWN0LnByb2plY3ROYW1lID09PSAnQ2hlY2tUdXRvcmlhbCdcbiAgICB9KVxuICAgIHJldHVybiBwcm9qZWN0SWR4ICE9PSAtMVxuICB9XG5cbiAgbmV4dCAoKSB7XG4gICAgdGhpcy50b3VyQ2hhbm5lbC5uZXh0KClcbiAgICBtaXhwYW5lbC5oYWlrdVRyYWNrKCd0b3VyJywge1xuICAgICAgc3RhdGU6ICdzdGVwIGNvbXBsZXRlZCcsXG4gICAgICBzdGVwOiB0aGlzLnN0YXRlLnN0ZXBEYXRhLmN1cnJlbnQsXG4gICAgICB0aXRsZTogdGhpcy5zdGF0ZS5jb21wb25lbnRcbiAgICB9KVxuICB9XG5cbiAgZmluaXNoIChjcmVhdGVGaWxlLCBza2lwcGVkKSB7XG4gICAgdGhpcy50b3VyQ2hhbm5lbC5maW5pc2goY3JlYXRlRmlsZSlcbiAgICBtaXhwYW5lbC5oYWlrdVRyYWNrKCd0b3VyJywge1xuICAgICAgc3RhdGU6ICdza2lwcGVkJyxcbiAgICAgIHN0ZXA6IHRoaXMuc3RhdGUuc3RlcERhdGEuY3VycmVudCxcbiAgICAgIHRpdGxlOiB0aGlzLnN0YXRlLmNvbXBvbmVudFxuICAgIH0pXG4gIH1cblxuICBoaWRlICgpIHtcbiAgICB0aGlzLnNldFN0YXRlKHsgY29tcG9uZW50OiBudWxsIH0pXG4gIH1cblxuICBzaG93U3RlcCAoc3RhdGUpIHtcbiAgICB0aGlzLnNldFN0YXRlKHN0YXRlKVxuICB9XG5cbiAgb3BlbkxpbmsgKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICBzaGVsbC5vcGVuRXh0ZXJuYWwoZS50YXJnZXQuaHJlZilcbiAgfVxuXG4gIHJlbmRlciAoKSB7XG4gICAgaWYgKCF0aGlzLnN0YXRlLmNvbXBvbmVudCkge1xuICAgICAgcmV0dXJuIG51bGxcbiAgICB9XG5cbiAgICBjb25zdCB7XG4gICAgICBkaXNwbGF5LFxuICAgICAgY29vcmRpbmF0ZXMsXG4gICAgICBvZmZzZXQsXG4gICAgICBjb21wb25lbnQsXG4gICAgICBzcG90bGlnaHRSYWRpdXMsXG4gICAgICBzdGVwRGF0YSxcbiAgICAgIHdhaXRVc2VyQWN0aW9uXG4gICAgfSA9IHRoaXMuc3RhdGVcblxuICAgIGNvbnN0IFN0ZXAgPSBzdGVwc1tjb21wb25lbnRdXG5cbiAgICByZXR1cm4gKFxuICAgICAgPFRvb2x0aXBcbiAgICAgICAgY29vcmRpbmF0ZXM9e2Nvb3JkaW5hdGVzfVxuICAgICAgICBvZmZzZXQ9e29mZnNldH1cbiAgICAgICAgZGlzcGxheT17ZGlzcGxheX1cbiAgICAgICAgc3BvdGxpZ2h0UmFkaXVzPXtzcG90bGlnaHRSYWRpdXN9XG4gICAgICAgIG5leHQ9e3RoaXMubmV4dH1cbiAgICAgICAgZmluaXNoPXt0aGlzLmZpbmlzaH1cbiAgICAgICAgc3RlcERhdGE9e3N0ZXBEYXRhfVxuICAgICAgICB3YWl0VXNlckFjdGlvbj17d2FpdFVzZXJBY3Rpb259XG4gICAgICA+XG4gICAgICAgIDxTdGVwIHN0eWxlcz17VE9VUl9TVFlMRVN9IG5leHQ9e3RoaXMubmV4dH0gZmluaXNoPXt0aGlzLmZpbmlzaH0gb3Blbkxpbms9e3RoaXMub3Blbkxpbmt9IC8+XG4gICAgICA8L1Rvb2x0aXA+XG4gICAgKVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFRvdXJcbiJdfQ==