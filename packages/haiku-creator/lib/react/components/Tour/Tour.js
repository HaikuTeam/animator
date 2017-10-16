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

var _Mixpanel = require('haiku-serialization/src/utils/Mixpanel');

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
      coordinates: null,
      stepData: {
        current: 0,
        total: undefined
      }
    };

    _this.hasTriggeredTourRender = false;
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
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      if (this.props.startTourOnMount && this.hasNecessaryProject() && !this.hasTriggeredTourRender) {
        this.tourChannel.start();
        this.hasTriggeredTourRender = true;
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
    value: function showStep(newState) {
      console.log('=== newstate vs oldstate', newState.stepData.current, this.state.stepData.current);
      if (this.state.stepData.current < newState.stepData.current) {
        console.log("======== Data from mixpanel: ", {
          state: 'step completed',
          step: this.state.stepData.current,
          title: this.state.component
        });

        _Mixpanel2.default.haikuTrack('tour', {
          state: 'step completed',
          step: this.state.stepData.current,
          title: this.state.component
        });
      }

      this.setState(newState);
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
            lineNumber: 119
          },
          __self: this
        },
        _react2.default.createElement(Step, { styles: _tourShared.TOUR_STYLES, next: this.next, finish: this.finish, openLink: this.openLink, __source: {
            fileName: _jsxFileName,
            lineNumber: 129
          },
          __self: this
        })
      );
    }
  }]);

  return Tour;
}(_react2.default.Component);

exports.default = Tour;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9yZWFjdC9jb21wb25lbnRzL1RvdXIvVG91ci5qcyJdLCJuYW1lcyI6WyJzdGVwcyIsIlRvdXIiLCJuZXh0IiwiYmluZCIsImZpbmlzaCIsImhpZGUiLCJzaG93U3RlcCIsInN0YXRlIiwiY29tcG9uZW50IiwiY29vcmRpbmF0ZXMiLCJzdGVwRGF0YSIsImN1cnJlbnQiLCJ0b3RhbCIsInVuZGVmaW5lZCIsImhhc1RyaWdnZXJlZFRvdXJSZW5kZXIiLCJwcm9wcyIsImVudm95IiwiZ2V0IiwidGhlbiIsInRvdXJDaGFubmVsIiwib24iLCJvZmYiLCJzdGFydFRvdXJPbk1vdW50IiwiaGFzTmVjZXNzYXJ5UHJvamVjdCIsInN0YXJ0IiwiaGFpa3VUcmFjayIsInByb2plY3RzTGlzdCIsImxlbmd0aCIsInByb2plY3RJZHgiLCJmaW5kSW5kZXgiLCJwcm9qZWN0IiwicHJvamVjdE5hbWUiLCJjcmVhdGVGaWxlIiwic2tpcHBlZCIsInN0ZXAiLCJ0aXRsZSIsInNldFN0YXRlIiwibmV3U3RhdGUiLCJjb25zb2xlIiwibG9nIiwiZSIsInByZXZlbnREZWZhdWx0Iiwib3BlbkV4dGVybmFsIiwidGFyZ2V0IiwiaHJlZiIsImRpc3BsYXkiLCJvZmZzZXQiLCJzcG90bGlnaHRSYWRpdXMiLCJ3YWl0VXNlckFjdGlvbiIsIlN0ZXAiLCJvcGVuTGluayIsIkNvbXBvbmVudCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOztBQUNBOztBQUNBOztJQUFZQSxLOztBQUNaOzs7Ozs7Ozs7Ozs7OztJQUVNQyxJOzs7QUFDSixrQkFBZTtBQUFBOztBQUFBOztBQUdiLFVBQUtDLElBQUwsR0FBWSxNQUFLQSxJQUFMLENBQVVDLElBQVYsT0FBWjtBQUNBLFVBQUtDLE1BQUwsR0FBYyxNQUFLQSxNQUFMLENBQVlELElBQVosT0FBZDtBQUNBLFVBQUtFLElBQUwsR0FBWSxNQUFLQSxJQUFMLENBQVVGLElBQVYsT0FBWjtB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QUFLOEMsUUFBaEY7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBVkYsT0FERjtBQWNEOzs7O0VBNUhnQixnQkFBTUMsUzs7a0JBK0hWbEQsSSIsImZpbGUiOiJUb3VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IFRvb2x0aXAgZnJvbSAnLi4vVG9vbHRpcCdcbmltcG9ydCB7IHNoZWxsIH0gZnJvbSAnZWxlY3Ryb24nXG5pbXBvcnQgeyBUT1VSX1NUWUxFUyB9IGZyb20gJy4uLy4uL3N0eWxlcy90b3VyU2hhcmVkJ1xuaW1wb3J0ICogYXMgc3RlcHMgZnJvbSAnLi9TdGVwcydcbmltcG9ydCBtaXhwYW5lbCBmcm9tICdoYWlrdS1zZXJpYWxpemF0aW9uL3NyYy91dGlscy9NaXhwYW5lbCdcblxuY2xhc3MgVG91ciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yICgpIHtcbiAgICBzdXBlcigpXG5cbiAgICB0aGlzLm5leHQgPSB0aGlzLm5leHQuYmluZCh0aGlzKVxuICAgIHRoaXMuZmluaXNoID0gdGhpcy5maW5pc2guYmluZCh0aGlzKVxuICAgIHRoaXMuaGlkZSA9IHRoaXMuaGlkZS5iaW5kKHRoaXMpXG4gICAgdGhpcy5zaG93U3RlcCA9IHRoaXMuc2hvd1N0ZXAuYmluZCh0aGlzKVxuXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIGNvbXBvbmVudDogbnVsbCxcbiAgICAgIGNvb3JkaW5hdGVzOiBudWxsLFxuICAgICAgc3RlcERhdGE6IHtcbiAgICAgICAgY3VycmVudDogMCxcbiAgICAgICAgdG90YWw6IHVuZGVmaW5lZFxuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuaGFzVHJpZ2dlcmVkVG91clJlbmRlciA9IGZhbHNlXG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCAoKSB7XG4gICAgdGhpcy5wcm9wcy5lbnZveS5nZXQoJ3RvdXInKS50aGVuKCh0b3VyQ2hhbm5lbCkgPT4ge1xuICAgICAgdGhpcy50b3VyQ2hhbm5lbCA9IHRvdXJDaGFubmVsXG4gICAgICB0aGlzLnRvdXJDaGFubmVsLm9uKCd0b3VyOnJlcXVlc3RTaG93U3RlcCcsIHRoaXMuc2hvd1N0ZXApXG4gICAgICB0aGlzLnRvdXJDaGFubmVsLm9uKCd0b3VyOnJlcXVlc3RGaW5pc2gnLCB0aGlzLmhpZGUpXG4gICAgfSlcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50ICgpIHtcbiAgICB0aGlzLnRvdXJDaGFubmVsLm9mZigndG91cjpyZXF1ZXN0U2hvd1N0ZXAnLCB0aGlzLnNob3dTdGVwKVxuICAgIHRoaXMudG91ckNoYW5uZWwub2ZmKCd0b3VyOnJlcXVlc3RGaW5pc2gnLCB0aGlzLmhpZGUpXG4gIH1cblxuICBjb21wb25lbnREaWRVcGRhdGUgKCkge1xuICAgIGlmICh0aGlzLnByb3BzLnN0YXJ0VG91ck9uTW91bnQgJiYgdGhpcy5oYXNOZWNlc3NhcnlQcm9qZWN0KCkgJiYgIXRoaXMuaGFzVHJpZ2dlcmVkVG91clJlbmRlcikge1xuICAgICAgdGhpcy50b3VyQ2hhbm5lbC5zdGFydCgpXG4gICAgICB0aGlzLmhhc1RyaWdnZXJlZFRvdXJSZW5kZXIgPSB0cnVlXG4gICAgICBtaXhwYW5lbC5oYWlrdVRyYWNrKCd0b3VyJywge3N0YXRlOiAnc3RhcnRlZCd9KVxuICAgIH1cbiAgfVxuXG4gIGhhc05lY2Vzc2FyeVByb2plY3QgKCkge1xuICAgIGlmICghdGhpcy5wcm9wcy5wcm9qZWN0c0xpc3QpIHJldHVybiBmYWxzZVxuICAgIGlmICh0aGlzLnByb3BzLnByb2plY3RzTGlzdC5sZW5ndGggPCAxKSByZXR1cm4gZmFsc2VcbiAgICBjb25zdCBwcm9qZWN0SWR4ID0gdGhpcy5wcm9wcy5wcm9qZWN0c0xpc3QuZmluZEluZGV4KChwcm9qZWN0KSA9PiB7XG4gICAgICAvLyBIYXJkY29kZWQgLSBOYW1lIG9mIHRoZSBwcm9qZWN0IHRoYXQgd2lsbCBiZSB1c2VkIGZvciB0aGUgdHV0b3JpYWxcbiAgICAgIHJldHVybiBwcm9qZWN0LnByb2plY3ROYW1lID09PSAnQ2hlY2tUdXRvcmlhbCdcbiAgICB9KVxuICAgIHJldHVybiBwcm9qZWN0SWR4ICE9PSAtMVxuICB9XG5cbiAgbmV4dCAoKSB7XG4gICAgdGhpcy50b3VyQ2hhbm5lbC5uZXh0KClcbiAgfVxuXG4gIGZpbmlzaCAoY3JlYXRlRmlsZSwgc2tpcHBlZCkge1xuICAgIHRoaXMudG91ckNoYW5uZWwuZmluaXNoKGNyZWF0ZUZpbGUpXG4gICAgbWl4cGFuZWwuaGFpa3VUcmFjaygndG91cicsIHtcbiAgICAgIHN0YXRlOiAnc2tpcHBlZCcsXG4gICAgICBzdGVwOiB0aGlzLnN0YXRlLnN0ZXBEYXRhLmN1cnJlbnQsXG4gICAgICB0aXRsZTogdGhpcy5zdGF0ZS5jb21wb25lbnRcbiAgICB9KVxuICB9XG5cbiAgaGlkZSAoKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7IGNvbXBvbmVudDogbnVsbCB9KVxuICB9XG5cbiAgc2hvd1N0ZXAgKG5ld1N0YXRlKSB7XG4gICAgY29uc29sZS5sb2coJz09PSBuZXdzdGF0ZSB2cyBvbGRzdGF0ZScsIG5ld1N0YXRlLnN0ZXBEYXRhLmN1cnJlbnQsIHRoaXMuc3RhdGUuc3RlcERhdGEuY3VycmVudClcbiAgICBpZiAodGhpcy5zdGF0ZS5zdGVwRGF0YS5jdXJyZW50IDwgbmV3U3RhdGUuc3RlcERhdGEuY3VycmVudCkge1xuICAgICAgY29uc29sZS5sb2coXCI9PT09PT09PSBEYXRhIGZyb20gbWl4cGFuZWw6IFwiLCB7XG4gICAgICAgIHN0YXRlOiAnc3RlcCBjb21wbGV0ZWQnLFxuICAgICAgICBzdGVwOiB0aGlzLnN0YXRlLnN0ZXBEYXRhLmN1cnJlbnQsXG4gICAgICAgIHRpdGxlOiB0aGlzLnN0YXRlLmNvbXBvbmVudFxuICAgICAgfSlcblxuICAgICAgbWl4cGFuZWwuaGFpa3VUcmFjaygndG91cicsIHtcbiAgICAgICAgc3RhdGU6ICdzdGVwIGNvbXBsZXRlZCcsXG4gICAgICAgIHN0ZXA6IHRoaXMuc3RhdGUuc3RlcERhdGEuY3VycmVudCxcbiAgICAgICAgdGl0bGU6IHRoaXMuc3RhdGUuY29tcG9uZW50XG4gICAgICB9KVxuICAgIH1cblxuICAgIHRoaXMuc2V0U3RhdGUobmV3U3RhdGUpXG4gIH1cblxuICBvcGVuTGluayAoZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgIHNoZWxsLm9wZW5FeHRlcm5hbChlLnRhcmdldC5ocmVmKVxuICB9XG5cbiAgcmVuZGVyICgpIHtcbiAgICBpZiAoIXRoaXMuc3RhdGUuY29tcG9uZW50KSB7XG4gICAgICByZXR1cm4gbnVsbFxuICAgIH1cblxuICAgIGNvbnN0IHtcbiAgICAgIGRpc3BsYXksXG4gICAgICBjb29yZGluYXRlcyxcbiAgICAgIG9mZnNldCxcbiAgICAgIGNvbXBvbmVudCxcbiAgICAgIHNwb3RsaWdodFJhZGl1cyxcbiAgICAgIHN0ZXBEYXRhLFxuICAgICAgd2FpdFVzZXJBY3Rpb25cbiAgICB9ID0gdGhpcy5zdGF0ZVxuXG4gICAgY29uc3QgU3RlcCA9IHN0ZXBzW2NvbXBvbmVudF1cblxuICAgIHJldHVybiAoXG4gICAgICA8VG9vbHRpcFxuICAgICAgICBjb29yZGluYXRlcz17Y29vcmRpbmF0ZXN9XG4gICAgICAgIG9mZnNldD17b2Zmc2V0fVxuICAgICAgICBkaXNwbGF5PXtkaXNwbGF5fVxuICAgICAgICBzcG90bGlnaHRSYWRpdXM9e3Nwb3RsaWdodFJhZGl1c31cbiAgICAgICAgbmV4dD17dGhpcy5uZXh0fVxuICAgICAgICBmaW5pc2g9e3RoaXMuZmluaXNofVxuICAgICAgICBzdGVwRGF0YT17c3RlcERhdGF9XG4gICAgICAgIHdhaXRVc2VyQWN0aW9uPXt3YWl0VXNlckFjdGlvbn1cbiAgICAgID5cbiAgICAgICAgPFN0ZXAgc3R5bGVzPXtUT1VSX1NUWUxFU30gbmV4dD17dGhpcy5uZXh0fSBmaW5pc2g9e3RoaXMuZmluaXNofSBvcGVuTGluaz17dGhpcy5vcGVuTGlua30gLz5cbiAgICAgIDwvVG9vbHRpcD5cbiAgICApXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgVG91clxuIl19