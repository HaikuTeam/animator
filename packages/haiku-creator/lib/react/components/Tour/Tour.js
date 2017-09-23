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

        if (_this2.props.startTourOnMount && _this2.hasNecessaryProject()) {
          _this2.tourChannel.start();
          _Mixpanel2.default.haikuTrack('tour', { state: 'started' });
        }
      });
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.tourChannel.off('tour:requestShowStep', this.showStep);
      this.tourChannel.off('tour:requestFinish', this.hide);
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
            lineNumber: 94
          },
          __self: this
        },
        _react2.default.createElement(Step, { styles: _tourShared.TOUR_STYLES, next: this.next, finish: this.finish, __source: {
            fileName: _jsxFileName,
            lineNumber: 104
          },
          __self: this
        })
      );
    }
  }]);

  return Tour;
}(_react2.default.Component);

exports.default = Tour;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9yZWFjdC9jb21wb25lbnRzL1RvdXIvVG91ci5qcyJdLCJuYW1lcyI6WyJzdGVwcyIsIlRvdXIiLCJuZXh0IiwiYmluZCIsImZpbmlzaCIsImhpZGUiLCJzaG93U3RlcCIsInN0YXRlIiwiY29tcG9uZW50IiwiY29vcmRpbmF0ZXMiLCJwcm9wcyIsImVudm95IiwiZ2V0IiwidGhlbiIsInRvdXJDaGFubmVsIiwib24iLCJzdGFydFRvdXJPbk1vdW50IiwiaGFzTmVjZXNzYXJ5UHJvamVjdCIsInN0YXJ0IiwiaGFpa3VUcmFjayIsIm9mZiIsInByb2plY3RzTGlzdCIsImxlbmd0aCIsInByb2plY3RJZHgiLCJmaW5kSW5kZXgiLCJwcm9qZWN0IiwicHJvamVjdE5hbWUiLCJzdGVwIiwic3RlcERhdGEiLCJjdXJyZW50IiwidGl0bGUiLCJjcmVhdGVGaWxlIiwic2tpcHBlZCIsInNldFN0YXRlIiwiZGlzcGxheSIsIm9mZnNldCIsInNwb3RsaWdodFJhZGl1cyIsIndhaXRVc2VyQWN0aW9uIiwiU3RlcCIsIkNvbXBvbmVudCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOztBQUNBOztJQUFZQSxLOztBQUNaOzs7Ozs7Ozs7Ozs7OztJQUVNQyxJOzs7QUFDSixrQkFBZTtBQUFBOztBQUFBOztBQUdiLFVBQUtDLElBQUwsR0FBWSxNQUFLQSxJQUFMLENBQVVDLElBQVYsT0FBWjtBQUNBLFVBQUtDLE1BQUwsR0FBYyxNQUFLQSxNQUFMLENBQVlELElBQVosT0FBZDtBQUNBLFVBQUtFLElBQUwsR0FBWSxNQUFLQSxJQUFMLENBQVVGLElBQVYsT0FBWjtBQUNBLFVBQUtHLFFBQUwsR0FBZ0IsTUFBS0EsUUFBTCxDQUFjSCxJQUFkLE9BQWhCOztBQUVBLFVBQUtJLEtBQUwsR0FBYTtBQUNYQyxpQkFBVyxJQURBO0FBRVhDLG1CQUFhO0FBRkYsS0FBYjtBQVJhO0FBWWQ7Ozs7d0NBRW9CO0FBQUE7O0FBQ25C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a0JBQVEsS0FBS0UsTUFOZjtBQU9FLG9CQUFVd0IsUUFQWjtBQVFFLDBCQUFnQlMsY0FSbEI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFVRSxzQ0FBQyxJQUFELElBQU0sK0JBQU4sRUFBMkIsTUFBTSxLQUFLbkMsSUFBdEMsRUFBNEMsUUFBUSxLQUFLRSxNQUF6RDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFWRixPQURGO0FBY0Q7Ozs7RUFwR2dCLGdCQUFNbUMsUzs7a0JBdUdWdEMsSSIsImZpbGUiOiJUb3VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IFRvb2x0aXAgZnJvbSAnLi4vVG9vbHRpcCdcbmltcG9ydCB7IFRPVVJfU1RZTEVTIH0gZnJvbSAnLi4vLi4vc3R5bGVzL3RvdXJTaGFyZWQnXG5pbXBvcnQgKiBhcyBzdGVwcyBmcm9tICcuL1N0ZXBzJ1xuaW1wb3J0IG1peHBhbmVsIGZyb20gJy4uLy4uLy4uL3V0aWxzL01peHBhbmVsJ1xuXG5jbGFzcyBUb3VyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IgKCkge1xuICAgIHN1cGVyKClcblxuICAgIHRoaXMubmV4dCA9IHRoaXMubmV4dC5iaW5kKHRoaXMpXG4gICAgdGhpcy5maW5pc2ggPSB0aGlzLmZpbmlzaC5iaW5kKHRoaXMpXG4gICAgdGhpcy5oaWRlID0gdGhpcy5oaWRlLmJpbmQodGhpcylcbiAgICB0aGlzLnNob3dTdGVwID0gdGhpcy5zaG93U3RlcC5iaW5kKHRoaXMpXG5cbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgY29tcG9uZW50OiBudWxsLFxuICAgICAgY29vcmRpbmF0ZXM6IG51bGxcbiAgICB9XG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCAoKSB7XG4gICAgdGhpcy5wcm9wcy5lbnZveS5nZXQoJ3RvdXInKS50aGVuKCh0b3VyQ2hhbm5lbCkgPT4ge1xuICAgICAgdGhpcy50b3VyQ2hhbm5lbCA9IHRvdXJDaGFubmVsXG4gICAgICB0aGlzLnRvdXJDaGFubmVsLm9uKCd0b3VyOnJlcXVlc3RTaG93U3RlcCcsIHRoaXMuc2hvd1N0ZXApXG4gICAgICB0aGlzLnRvdXJDaGFubmVsLm9uKCd0b3VyOnJlcXVlc3RGaW5pc2gnLCB0aGlzLmhpZGUpXG5cbiAgICAgIGlmICh0aGlzLnByb3BzLnN0YXJ0VG91ck9uTW91bnQgJiYgdGhpcy5oYXNOZWNlc3NhcnlQcm9qZWN0KCkpIHtcbiAgICAgICAgdGhpcy50b3VyQ2hhbm5lbC5zdGFydCgpXG4gICAgICAgIG1peHBhbmVsLmhhaWt1VHJhY2soJ3RvdXInLCB7c3RhdGU6ICdzdGFydGVkJ30pXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50ICgpIHtcbiAgICB0aGlzLnRvdXJDaGFubmVsLm9mZigndG91cjpyZXF1ZXN0U2hvd1N0ZXAnLCB0aGlzLnNob3dTdGVwKVxuICAgIHRoaXMudG91ckNoYW5uZWwub2ZmKCd0b3VyOnJlcXVlc3RGaW5pc2gnLCB0aGlzLmhpZGUpXG4gIH1cblxuICBoYXNOZWNlc3NhcnlQcm9qZWN0ICgpIHtcbiAgICBpZiAoIXRoaXMucHJvcHMucHJvamVjdHNMaXN0KSByZXR1cm4gZmFsc2VcbiAgICBpZiAodGhpcy5wcm9wcy5wcm9qZWN0c0xpc3QubGVuZ3RoIDwgMSkgcmV0dXJuIGZhbHNlXG4gICAgY29uc3QgcHJvamVjdElkeCA9IHRoaXMucHJvcHMucHJvamVjdHNMaXN0LmZpbmRJbmRleCgocHJvamVjdCkgPT4ge1xuICAgICAgLy8gSGFyZGNvZGVkIC0gTmFtZSBvZiB0aGUgcHJvamVjdCB0aGF0IHdpbGwgYmUgdXNlZCBmb3IgdGhlIHR1dG9yaWFsXG4gICAgICByZXR1cm4gcHJvamVjdC5wcm9qZWN0TmFtZSA9PT0gJ0NoZWNrVHV0b3JpYWwnXG4gICAgfSlcbiAgICByZXR1cm4gcHJvamVjdElkeCAhPT0gLTFcbiAgfVxuXG4gIG5leHQgKCkge1xuICAgIHRoaXMudG91ckNoYW5uZWwubmV4dCgpXG4gICAgbWl4cGFuZWwuaGFpa3VUcmFjaygndG91cicsIHtcbiAgICAgIHN0YXRlOiAnc3RlcCBjb21wbGV0ZWQnLFxuICAgICAgc3RlcDogdGhpcy5zdGF0ZS5zdGVwRGF0YS5jdXJyZW50LFxuICAgICAgdGl0bGU6IHRoaXMuc3RhdGUuY29tcG9uZW50XG4gICAgfSlcbiAgfVxuXG4gIGZpbmlzaCAoY3JlYXRlRmlsZSwgc2tpcHBlZCkge1xuICAgIHRoaXMudG91ckNoYW5uZWwuZmluaXNoKGNyZWF0ZUZpbGUpXG4gICAgbWl4cGFuZWwuaGFpa3VUcmFjaygndG91cicsIHtcbiAgICAgIHN0YXRlOiAnc2tpcHBlZCcsXG4gICAgICBzdGVwOiB0aGlzLnN0YXRlLnN0ZXBEYXRhLmN1cnJlbnQsXG4gICAgICB0aXRsZTogdGhpcy5zdGF0ZS5jb21wb25lbnRcbiAgICB9KVxuICB9XG5cbiAgaGlkZSAoKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7IGNvbXBvbmVudDogbnVsbCB9KVxuICB9XG5cbiAgc2hvd1N0ZXAgKHN0YXRlKSB7XG4gICAgdGhpcy5zZXRTdGF0ZShzdGF0ZSlcbiAgfVxuXG4gIHJlbmRlciAoKSB7XG4gICAgaWYgKCF0aGlzLnN0YXRlLmNvbXBvbmVudCkge1xuICAgICAgcmV0dXJuIG51bGxcbiAgICB9XG5cbiAgICBjb25zdCB7XG4gICAgICBkaXNwbGF5LFxuICAgICAgY29vcmRpbmF0ZXMsXG4gICAgICBvZmZzZXQsXG4gICAgICBjb21wb25lbnQsXG4gICAgICBzcG90bGlnaHRSYWRpdXMsXG4gICAgICBzdGVwRGF0YSxcbiAgICAgIHdhaXRVc2VyQWN0aW9uXG4gICAgfSA9IHRoaXMuc3RhdGVcblxuICAgIGNvbnN0IFN0ZXAgPSBzdGVwc1tjb21wb25lbnRdXG5cbiAgICByZXR1cm4gKFxuICAgICAgPFRvb2x0aXBcbiAgICAgICAgY29vcmRpbmF0ZXM9e2Nvb3JkaW5hdGVzfVxuICAgICAgICBvZmZzZXQ9e29mZnNldH1cbiAgICAgICAgZGlzcGxheT17ZGlzcGxheX1cbiAgICAgICAgc3BvdGxpZ2h0UmFkaXVzPXtzcG90bGlnaHRSYWRpdXN9XG4gICAgICAgIG5leHQ9e3RoaXMubmV4dH1cbiAgICAgICAgZmluaXNoPXt0aGlzLmZpbmlzaH1cbiAgICAgICAgc3RlcERhdGE9e3N0ZXBEYXRhfVxuICAgICAgICB3YWl0VXNlckFjdGlvbj17d2FpdFVzZXJBY3Rpb259XG4gICAgICA+XG4gICAgICAgIDxTdGVwIHN0eWxlcz17VE9VUl9TVFlMRVN9IG5leHQ9e3RoaXMubmV4dH0gZmluaXNoPXt0aGlzLmZpbmlzaH0gLz5cbiAgICAgIDwvVG9vbHRpcD5cbiAgICApXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgVG91clxuIl19