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
            lineNumber: 105
          },
          __self: this
        },
        _react2.default.createElement(Step, { styles: _tourShared.TOUR_STYLES, next: this.next, finish: this.finish, openLink: this.openLink, __source: {
            fileName: _jsxFileName,
            lineNumber: 115
          },
          __self: this
        })
      );
    }
  }]);

  return Tour;
}(_react2.default.Component);

exports.default = Tour;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9yZWFjdC9jb21wb25lbnRzL1RvdXIvVG91ci5qcyJdLCJuYW1lcyI6WyJzdGVwcyIsIlRvdXIiLCJuZXh0IiwiYmluZCIsImZpbmlzaCIsImhpZGUiLCJzaG93U3RlcCIsInN0YXRlIiwiY29tcG9uZW50IiwiY29vcmRpbmF0ZXMiLCJoYXNUcmlnZ2VyZWRUb3VyUmVuZGVyIiwicHJvcHMiLCJlbnZveSIsImdldCIsInRoZW4iLCJ0b3VyQ2hhbm5lbCIsIm9uIiwib2ZmIiwic3RhcnRUb3VyT25Nb3VudCIsImhhc05lY2Vzc2FyeVByb2plY3QiLCJzdGFydCIsImhhaWt1VHJhY2siLCJwcm9qZWN0c0xpc3QiLCJsZW5ndGgiLCJwcm9qZWN0SWR4IiwiZmluZEluZGV4IiwicHJvamVjdCIsInByb2plY3ROYW1lIiwic3RlcCIsInN0ZXBEYXRhIiwiY3VycmVudCIsInRpdGxlIiwiY3JlYXRlRmlsZSIsInNraXBwZWQiLCJzZXRTdGF0ZSIsImUiLCJwcmV2ZW50RGVmYXVsdCIsIm9wZW5FeHRlcm5hbCIsInRhcmdldCIsImhyZWYiLCJkaXNwbGF5Iiwib2Zmc2V0Iiwic3BvdGxpZ2h0UmFkaXVzIiwid2FpdFVzZXJBY3Rpb24iLCJTdGVwIiwib3BlbkxpbmsiLCJDb21wb25lbnQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7QUFDQTs7SUFBWUEsSzs7QUFDWjs7Ozs7Ozs7Ozs7Ozs7SUFFTUMsSTs7O0FBQ0osa0JBQWU7QUFBQTs7QUFBQTs7QUFHYixVQUFLQyxJQUFMLEdBQVksTUFBS0EsSUFBTCxDQUFVQyxJQUFWLE9BQVo7QUFDQSxVQUFLQyxNQUFMLEdBQWMsTUFBS0EsTUFBTCxDQUFZRCxJQUFaLE9BQWQ7QUFDQSxVQUFLRSxJQUFMLEdBQVksTUFBS0EsSUFBTCxDQUFVRixJQUFWLE9BQVo7QUFDQSxVQUFLRyxRQUFMLEdBQWdCLE1BQUtBLFFBQUwsQ0FBY0gsSUFBZCxPQUFoQjs7QUFFQSxVQUFLSSxLQUFMLEdBQWE7QUFDWEMsaUJBQVcsSUFEQTtBQUVYQyxtQkFBYTtBQUZGLEtBQWI7O0FBS0EsVUFBS0Msc0JBQUwsR0FBOEIsS0FBOUI7QUFiYTtBQWNkOzs7O3dDQUVvQjtBQUFBOztBQUNuQixXQUFLQyxLQUFMLENBQVdDLEtBQVgsQ0FBaUJDLEdBQWpCLENBQXFCLE1BQXJCLEVBQTZCQyxJQUE3QixDQUFrQyxVQUFDQyxXQUFELEVBQWlCO0FBQ2pELGVBQUtBLFdBQUwsR0FBbUJBLFdBQW5CO0FBQ0EsZUFBS0EsV0FBTCxDQUFpQkMsRUFBakIsQ0FBb0Isc0JBQXBCLEVBQTRDLE9BQUtWLFFBQWpEO0FBQ0EsZUFBS1MsV0FBTCxDQUFpQkMsRUFBakIsQ0FBb0Isb0JBQXBCLEVBQTBDLE9BQUtYLElBQS9DO0FBQ0QsT0FKRDtBQUtEOzs7MkNBRXVCO0FBQ3RCLFdBQUtVLFdBQUwsQ0FBaUJFLEdBQWpCLENBQXFCLHNCQUFyQixFQUE2QyxLQUFLWCxRQUFsRDtBQUNBLFdBQUtTLFdBQUwsQ0FBaUJFLEdBQWpCLENBQXFCLG9CQUFyQixFQUEyQyxLQUFLWixJQUFoRDtBQUNEOzs7eUNBRXFCO0FBQ3BCLFVBQUksS0FBS00sS0FBTCxDQUFXTyxnQkFBWCxJQUErQixLQUFLQyxtQkFBTCxFQUEvQixJQUE2RCxDQUFDLEtBQUtULHNCQUF2RSxFQUErRjtBQUM3RixhQUFLSyxXQUFMLENBQWlCSyxLQUFqQjtBQUNBLGFBQUtWLHNCQUFMLEdBQThCLElBQTlCO0FBQ0EsMkJBQVNXLFVBQVQsQ0FBb0IsTUFBcEIsRUFBNEIsRUFBQ2QsT0FBTyxTQUFSLEVBQTVCO0FBQ0Q7QUFDRjs7OzBDQUVzQjtBQUNyQixVQUFJLENBQUMsS0FBS0ksS0FBTCxDQUFXVyxZQUFoQixFQUE4QixPQUFPLEtBQVA7QUFDOUIsVUFBSSxLQUFLWCxLQUFMLENBQVdXLFlBQVgsQ0FBd0JDLE1BQXhCLEdBQWlDLENBQXJDLEVBQXdDLE9BQU8sS0FBUDtBQUN4QyxVQUFNQyxhQUFhLEtBQUtiLEtBQUwsQ0FBV1csWUFBWCxDQUF3QkcsU0FBeEIsQ0FBa0MsVUFBQ0MsT0FBRCxFQUFhO0FBQ2hFO0FBQ0EsZUFBT0EsUUFBUUMsV0FBUixLQUF3QixlQUEvQjtBQUNELE9BSGtCLENBQW5CO0FBSUEsYUFBT0gsZUFBZSxDQUFDLENBQXZCO0FBQ0Q7OzsyQkFFTztBQUNOLFdBQUtULFdBQUwsQ0FBaUJiLElBQWpCO0FBQ0EseUJBQVNtQixVQUFULENBQW9CLE1BQXBCLEVBQTRCO0FBQzFCZCxlQUFPLGdCQURtQjtBQUUxQnFCLGNBQU0sS0FBS3JCLEtBQUwsQ0FBV3NCLFFBQVgsQ0FBb0JDLE9BRkE7QUFHMUJDLGVBQU8sS0FBS3hCLEtBQUwsQ0FBV0M7QUFIUSxPQUE1QjtBQUtEOzs7MkJBRU93QixVLEVBQVlDLE8sRUFBUztBQUMzQixXQUFLbEIsV0FBTCxDQUFpQlgsTUFBakIsQ0FBd0I0QixVQUF4QjtBQUNBLHlCQUFTWCxVQUFULENBQW9CLE1BQXBCLEVBQTRCO0FBQzFCZCxlQUFPLFNBRG1CO0FBRTFCcUIsY0FBTSxLQUFLckIsS0FBTCxDQUFXc0IsUUFBWCxDQUFvQkMsT0FGQTtBQUcxQkMsZUFBTyxLQUFLeEIsS0FBTCxDQUFXQztBQUhRLE9BQTVCO0FBS0Q7OzsyQkFFTztBQUNOLFdBQUswQixRQUFMLENBQWMsRUFBRTFCLFdBQVcsSUFBYixFQUFkO0FBQ0Q7Ozs2QkFFU0QsSyxFQUFPO0FBQ2YsV0FBSzJCLFFBQUwsQ0FBYzNCLEtBQWQ7QUFDRDs7OzZCQUVTNEIsQyxFQUFHO0FBQ1hBLFFBQUVDLGNBQUY7QUFDQSxzQkFBTUMsWUFBTixDQUFtQkYsRUFBRUcsTUFBRixDQUFTQyxJQUE1QjtBQUNEOzs7NkJBRVM7QUFDUixVQUFJLENBQUMsS0FBS2hDLEtBQUwsQ0FBV0MsU0FBaEIsRUFBMkI7QUFDekIsZUFBTyxJQUFQO0FBQ0Q7O0FBSE8sbUJBYUosS0FBS0QsS0FiRDtBQUFBLFVBTU5pQyxPQU5NLFVBTU5BLE9BTk07QUFBQSxVQU9OL0IsV0FQTSxVQU9OQSxXQVBNO0FBQUEsVUFRTmdDLE1BUk0sVUFRTkEsTUFSTTtBQUFBLFVBU05qQyxTQVRNLFVBU05BLFNBVE07QUFBQSxVQVVOa0MsZUFWTSxVQVVOQSxlQVZNO0FBQUEsVUFXTmIsUUFYTSxVQVdOQSxRQVhNO0FBQUEsVUFZTmMsY0FaTSxVQVlOQSxjQVpNOzs7QUFlUixVQUFNQyxPQUFPNUMsTUFBTVEsU0FBTixDQUFiOztBQUVBLGFBQ0U7QUFBQTtBQUFBO0FBQ0UsdUJBQWFDLFdBRGY7QUFFRSxrQkFBUWdDLE1BRlY7QUFHRSxtQkFBU0QsT0FIWDtBQUlFLDJCQUFpQkUsZUFKbkI7QUFLRSxnQkFBTSxLQUFLeEMsSUFMYjtBQU1FLGtCQUFRLEtBQUtFLE1BTmY7QUFPRSxvQkFBVXlCLFFBUFo7QUFRRSwwQkFBZ0JjLGNBUmxCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBVUUsc0NBQUMsSUFBRCxJQUFNLCtCQUFOLEVBQTJCLE1BQU0sS0FBS3pDLElBQXRDLEVBQTRDLFFBQVEsS0FBS0UsTUFBekQsRUFBaUUsVUFBVSxLQUFLeUMsUUFBaEY7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBVkYsT0FERjtBQWNEOzs7O0VBOUdnQixnQkFBTUMsUzs7a0JBaUhWN0MsSSIsImZpbGUiOiJUb3VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IFRvb2x0aXAgZnJvbSAnLi4vVG9vbHRpcCdcbmltcG9ydCB7IHNoZWxsIH0gZnJvbSAnZWxlY3Ryb24nXG5pbXBvcnQgeyBUT1VSX1NUWUxFUyB9IGZyb20gJy4uLy4uL3N0eWxlcy90b3VyU2hhcmVkJ1xuaW1wb3J0ICogYXMgc3RlcHMgZnJvbSAnLi9TdGVwcydcbmltcG9ydCBtaXhwYW5lbCBmcm9tICcuLi8uLi8uLi91dGlscy9NaXhwYW5lbCdcblxuY2xhc3MgVG91ciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yICgpIHtcbiAgICBzdXBlcigpXG5cbiAgICB0aGlzLm5leHQgPSB0aGlzLm5leHQuYmluZCh0aGlzKVxuICAgIHRoaXMuZmluaXNoID0gdGhpcy5maW5pc2guYmluZCh0aGlzKVxuICAgIHRoaXMuaGlkZSA9IHRoaXMuaGlkZS5iaW5kKHRoaXMpXG4gICAgdGhpcy5zaG93U3RlcCA9IHRoaXMuc2hvd1N0ZXAuYmluZCh0aGlzKVxuXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIGNvbXBvbmVudDogbnVsbCxcbiAgICAgIGNvb3JkaW5hdGVzOiBudWxsXG4gICAgfVxuXG4gICAgdGhpcy5oYXNUcmlnZ2VyZWRUb3VyUmVuZGVyID0gZmFsc2VcbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50ICgpIHtcbiAgICB0aGlzLnByb3BzLmVudm95LmdldCgndG91cicpLnRoZW4oKHRvdXJDaGFubmVsKSA9PiB7XG4gICAgICB0aGlzLnRvdXJDaGFubmVsID0gdG91ckNoYW5uZWxcbiAgICAgIHRoaXMudG91ckNoYW5uZWwub24oJ3RvdXI6cmVxdWVzdFNob3dTdGVwJywgdGhpcy5zaG93U3RlcClcbiAgICAgIHRoaXMudG91ckNoYW5uZWwub24oJ3RvdXI6cmVxdWVzdEZpbmlzaCcsIHRoaXMuaGlkZSlcbiAgICB9KVxuICB9XG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQgKCkge1xuICAgIHRoaXMudG91ckNoYW5uZWwub2ZmKCd0b3VyOnJlcXVlc3RTaG93U3RlcCcsIHRoaXMuc2hvd1N0ZXApXG4gICAgdGhpcy50b3VyQ2hhbm5lbC5vZmYoJ3RvdXI6cmVxdWVzdEZpbmlzaCcsIHRoaXMuaGlkZSlcbiAgfVxuXG4gIGNvbXBvbmVudERpZFVwZGF0ZSAoKSB7XG4gICAgaWYgKHRoaXMucHJvcHMuc3RhcnRUb3VyT25Nb3VudCAmJiB0aGlzLmhhc05lY2Vzc2FyeVByb2plY3QoKSAmJiAhdGhpcy5oYXNUcmlnZ2VyZWRUb3VyUmVuZGVyKSB7XG4gICAgICB0aGlzLnRvdXJDaGFubmVsLnN0YXJ0KClcbiAgICAgIHRoaXMuaGFzVHJpZ2dlcmVkVG91clJlbmRlciA9IHRydWVcbiAgICAgIG1peHBhbmVsLmhhaWt1VHJhY2soJ3RvdXInLCB7c3RhdGU6ICdzdGFydGVkJ30pXG4gICAgfVxuICB9XG5cbiAgaGFzTmVjZXNzYXJ5UHJvamVjdCAoKSB7XG4gICAgaWYgKCF0aGlzLnByb3BzLnByb2plY3RzTGlzdCkgcmV0dXJuIGZhbHNlXG4gICAgaWYgKHRoaXMucHJvcHMucHJvamVjdHNMaXN0Lmxlbmd0aCA8IDEpIHJldHVybiBmYWxzZVxuICAgIGNvbnN0IHByb2plY3RJZHggPSB0aGlzLnByb3BzLnByb2plY3RzTGlzdC5maW5kSW5kZXgoKHByb2plY3QpID0+IHtcbiAgICAgIC8vIEhhcmRjb2RlZCAtIE5hbWUgb2YgdGhlIHByb2plY3QgdGhhdCB3aWxsIGJlIHVzZWQgZm9yIHRoZSB0dXRvcmlhbFxuICAgICAgcmV0dXJuIHByb2plY3QucHJvamVjdE5hbWUgPT09ICdDaGVja1R1dG9yaWFsJ1xuICAgIH0pXG4gICAgcmV0dXJuIHByb2plY3RJZHggIT09IC0xXG4gIH1cblxuICBuZXh0ICgpIHtcbiAgICB0aGlzLnRvdXJDaGFubmVsLm5leHQoKVxuICAgIG1peHBhbmVsLmhhaWt1VHJhY2soJ3RvdXInLCB7XG4gICAgICBzdGF0ZTogJ3N0ZXAgY29tcGxldGVkJyxcbiAgICAgIHN0ZXA6IHRoaXMuc3RhdGUuc3RlcERhdGEuY3VycmVudCxcbiAgICAgIHRpdGxlOiB0aGlzLnN0YXRlLmNvbXBvbmVudFxuICAgIH0pXG4gIH1cblxuICBmaW5pc2ggKGNyZWF0ZUZpbGUsIHNraXBwZWQpIHtcbiAgICB0aGlzLnRvdXJDaGFubmVsLmZpbmlzaChjcmVhdGVGaWxlKVxuICAgIG1peHBhbmVsLmhhaWt1VHJhY2soJ3RvdXInLCB7XG4gICAgICBzdGF0ZTogJ3NraXBwZWQnLFxuICAgICAgc3RlcDogdGhpcy5zdGF0ZS5zdGVwRGF0YS5jdXJyZW50LFxuICAgICAgdGl0bGU6IHRoaXMuc3RhdGUuY29tcG9uZW50XG4gICAgfSlcbiAgfVxuXG4gIGhpZGUgKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoeyBjb21wb25lbnQ6IG51bGwgfSlcbiAgfVxuXG4gIHNob3dTdGVwIChzdGF0ZSkge1xuICAgIHRoaXMuc2V0U3RhdGUoc3RhdGUpXG4gIH1cblxuICBvcGVuTGluayAoZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgIHNoZWxsLm9wZW5FeHRlcm5hbChlLnRhcmdldC5ocmVmKVxuICB9XG5cbiAgcmVuZGVyICgpIHtcbiAgICBpZiAoIXRoaXMuc3RhdGUuY29tcG9uZW50KSB7XG4gICAgICByZXR1cm4gbnVsbFxuICAgIH1cblxuICAgIGNvbnN0IHtcbiAgICAgIGRpc3BsYXksXG4gICAgICBjb29yZGluYXRlcyxcbiAgICAgIG9mZnNldCxcbiAgICAgIGNvbXBvbmVudCxcbiAgICAgIHNwb3RsaWdodFJhZGl1cyxcbiAgICAgIHN0ZXBEYXRhLFxuICAgICAgd2FpdFVzZXJBY3Rpb25cbiAgICB9ID0gdGhpcy5zdGF0ZVxuXG4gICAgY29uc3QgU3RlcCA9IHN0ZXBzW2NvbXBvbmVudF1cblxuICAgIHJldHVybiAoXG4gICAgICA8VG9vbHRpcFxuICAgICAgICBjb29yZGluYXRlcz17Y29vcmRpbmF0ZXN9XG4gICAgICAgIG9mZnNldD17b2Zmc2V0fVxuICAgICAgICBkaXNwbGF5PXtkaXNwbGF5fVxuICAgICAgICBzcG90bGlnaHRSYWRpdXM9e3Nwb3RsaWdodFJhZGl1c31cbiAgICAgICAgbmV4dD17dGhpcy5uZXh0fVxuICAgICAgICBmaW5pc2g9e3RoaXMuZmluaXNofVxuICAgICAgICBzdGVwRGF0YT17c3RlcERhdGF9XG4gICAgICAgIHdhaXRVc2VyQWN0aW9uPXt3YWl0VXNlckFjdGlvbn1cbiAgICAgID5cbiAgICAgICAgPFN0ZXAgc3R5bGVzPXtUT1VSX1NUWUxFU30gbmV4dD17dGhpcy5uZXh0fSBmaW5pc2g9e3RoaXMuZmluaXNofSBvcGVuTGluaz17dGhpcy5vcGVuTGlua30gLz5cbiAgICAgIDwvVG9vbHRpcD5cbiAgICApXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgVG91clxuIl19