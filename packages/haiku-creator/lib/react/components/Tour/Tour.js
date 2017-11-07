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
      if (this.state.stepData.current < newState.stepData.current) {
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
            lineNumber: 116
          },
          __self: this
        },
        _react2.default.createElement(Step, {
          styles: _tourShared.TOUR_STYLES,
          next: this.next,
          finish: this.finish,
          openLink: this.openLink,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 126
          },
          __self: this
        })
      );
    }
  }]);

  return Tour;
}(_react2.default.Component);

exports.default = Tour;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9yZWFjdC9jb21wb25lbnRzL1RvdXIvVG91ci5qcyJdLCJuYW1lcyI6WyJzdGVwcyIsIlRvdXIiLCJuZXh0IiwiYmluZCIsImZpbmlzaCIsImhpZGUiLCJzaG93U3RlcCIsInN0YXRlIiwiY29tcG9uZW50IiwiY29vcmRpbmF0ZXMiLCJzdGVwRGF0YSIsImN1cnJlbnQiLCJ0b3RhbCIsInVuZGVmaW5lZCIsImhhc1RyaWdnZXJlZFRvdXJSZW5kZXIiLCJwcm9wcyIsImVudm95IiwiZ2V0IiwidGhlbiIsInRvdXJDaGFubmVsIiwib24iLCJvZmYiLCJzdGFydFRvdXJPbk1vdW50IiwiaGFzTmVjZXNzYXJ5UHJvamVjdCIsInN0YXJ0IiwiaGFpa3VUcmFjayIsInByb2plY3RzTGlzdCIsImxlbmd0aCIsInByb2plY3RJZHgiLCJmaW5kSW5kZXgiLCJwcm9qZWN0IiwicHJvamVjdE5hbWUiLCJjcmVhdGVGaWxlIiwic2tpcHBlZCIsInN0ZXAiLCJ0aXRsZSIsInNldFN0YXRlIiwibmV3U3RhdGUiLCJlIiwicHJldmVudERlZmF1bHQiLCJvcGVuRXh0ZXJuYWwiLCJ0YXJnZXQiLCJocmVmIiwiZGlzcGxheSIsIm9mZnNldCIsInNwb3RsaWdodFJhZGl1cyIsIndhaXRVc2VyQWN0aW9uIiwiU3RlcCIsIm9wZW5MaW5rIiwiQ29tcG9uZW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0lBQVlBLEs7O0FBQ1o7Ozs7Ozs7Ozs7Ozs7O0lBRU1DLEk7OztBQUNKLGtCQUFlO0FBQUE7O0FBQUE7O0FBR2IsVUFBS0MsSUFBTCxHQUFZLE1BQUtBLElBQUwsQ0FBVUMsSUFBVixPQUFaO0FBQ0EsVUFBS0MsTUFBTCxHQUFjLE1BQUtBLE1BQUwsQ0FBWUQsSUFBWixPQUFkO0FBQ0EsVUFBS0UsSUFBTCxHQUFZLE1BQUtBLElBQUwsQ0FBVUYsSUFBVixPQUFaO0FBQ0EsVUFBS0csUUFBTCxH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QUksQ0FBQyxLQUFLbkMsS0FBTCxDQUFXQyxTQUFoQixFQUEyQjtBQUN6QixlQUFPLElBQVA7QUFDRDs7QUFITyxtQkFhSixLQUFLRCxLQWJEO0FBQUEsVUFNTm9DLE9BTk0sVUFNTkEsT0FOTTtBQUFBLFVBT05sQyxXQVBNLFVBT05BLFdBUE07QUFBQSxVQVFObUMsTUFSTSxVQVFOQSxNQVJNO0FBQUEsVUFTTnBDLFNBVE0sVUFTTkEsU0FUTTtBQUFBLFVBVU5xQyxlQVZNLFVBVU5BLGVBVk07QUFBQSxVQVdObkMsUUFYTSxVQVdOQSxRQVhNO0FBQUEsVUFZTm9DLGNBWk0sVUFZTkEsY0FaTTs7O0FBZVIsVUFBTUMsT0FBTy9DLE1BQU1RLFNBQU4sQ0FBYjs7QUFFQSxhQUNFO0FBQUE7QUFBQTtBQUNFLHVCQUFhQyxXQURmO0FBRUUsa0JBQVFtQyxNQUZWO0FBR0UsbUJBQVNELE9BSFg7QUFJRSwyQkFBaUJFLGVBSm5CO0FBS0UsZ0JBQU0sS0FBSzNDLElBTGI7QUFNRSxrQkFBUSxLQUFLRSxNQU5mO0FBT0Usb0JBQVVNLFFBUFo7QUFRRSwwQkFBZ0JvQyxjQVJsQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQVVFLHNDQUFDLElBQUQ7QUFDRSx5Q0FERjtBQUVFLGdCQUFNLEtBQUs1QyxJQUZiO0FBR0Usa0JBQVEsS0FBS0UsTUFIZjtBQUlFLG9CQUFVLEtBQUs0QyxRQUpqQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQVZGLE9BREY7QUFtQkQ7Ozs7RUE5SGdCLGdCQUFNQyxTOztrQkFpSVZoRCxJIiwiZmlsZSI6IlRvdXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgVG9vbHRpcCBmcm9tICcuLi9Ub29sdGlwJ1xuaW1wb3J0IHtzaGVsbH0gZnJvbSAnZWxlY3Ryb24nXG5pbXBvcnQge1RPVVJfU1RZTEVTfSBmcm9tICcuLi8uLi9zdHlsZXMvdG91clNoYXJlZCdcbmltcG9ydCAqIGFzIHN0ZXBzIGZyb20gJy4vU3RlcHMnXG5pbXBvcnQgbWl4cGFuZWwgZnJvbSAnaGFpa3Utc2VyaWFsaXphdGlvbi9zcmMvdXRpbHMvTWl4cGFuZWwnXG5cbmNsYXNzIFRvdXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgc3VwZXIoKVxuXG4gICAgdGhpcy5uZXh0ID0gdGhpcy5uZXh0LmJpbmQodGhpcylcbiAgICB0aGlzLmZpbmlzaCA9IHRoaXMuZmluaXNoLmJpbmQodGhpcylcbiAgICB0aGlzLmhpZGUgPSB0aGlzLmhpZGUuYmluZCh0aGlzKVxuICAgIHRoaXMuc2hvd1N0ZXAgPSB0aGlzLnNob3dTdGVwLmJpbmQodGhpcylcblxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBjb21wb25lbnQ6IG51bGwsXG4gICAgICBjb29yZGluYXRlczogbnVsbCxcbiAgICAgIHN0ZXBEYXRhOiB7XG4gICAgICAgIGN1cnJlbnQ6IDAsXG4gICAgICAgIHRvdGFsOiB1bmRlZmluZWRcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmhhc1RyaWdnZXJlZFRvdXJSZW5kZXIgPSBmYWxzZVxuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQgKCkge1xuICAgIHRoaXMucHJvcHMuZW52b3kuZ2V0KCd0b3VyJykudGhlbih0b3VyQ2hhbm5lbCA9PiB7XG4gICAgICB0aGlzLnRvdXJDaGFubmVsID0gdG91ckNoYW5uZWxcbiAgICAgIHRoaXMudG91ckNoYW5uZWwub24oJ3RvdXI6cmVxdWVzdFNob3dTdGVwJywgdGhpcy5zaG93U3RlcClcbiAgICAgIHRoaXMudG91ckNoYW5uZWwub24oJ3RvdXI6cmVxdWVzdEZpbmlzaCcsIHRoaXMuaGlkZSlcbiAgICB9KVxuICB9XG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQgKCkge1xuICAgIHRoaXMudG91ckNoYW5uZWwub2ZmKCd0b3VyOnJlcXVlc3RTaG93U3RlcCcsIHRoaXMuc2hvd1N0ZXApXG4gICAgdGhpcy50b3VyQ2hhbm5lbC5vZmYoJ3RvdXI6cmVxdWVzdEZpbmlzaCcsIHRoaXMuaGlkZSlcbiAgfVxuXG4gIGNvbXBvbmVudERpZFVwZGF0ZSAoKSB7XG4gICAgaWYgKFxuICAgICAgdGhpcy5wcm9wcy5zdGFydFRvdXJPbk1vdW50ICYmXG4gICAgICB0aGlzLmhhc05lY2Vzc2FyeVByb2plY3QoKSAmJlxuICAgICAgIXRoaXMuaGFzVHJpZ2dlcmVkVG91clJlbmRlclxuICAgICkge1xuICAgICAgdGhpcy50b3VyQ2hhbm5lbC5zdGFydCgpXG4gICAgICB0aGlzLmhhc1RyaWdnZXJlZFRvdXJSZW5kZXIgPSB0cnVlXG4gICAgICBtaXhwYW5lbC5oYWlrdVRyYWNrKCd0b3VyJywge3N0YXRlOiAnc3RhcnRlZCd9KVxuICAgIH1cbiAgfVxuXG4gIGhhc05lY2Vzc2FyeVByb2plY3QgKCkge1xuICAgIGlmICghdGhpcy5wcm9wcy5wcm9qZWN0c0xpc3QpIHJldHVybiBmYWxzZVxuICAgIGlmICh0aGlzLnByb3BzLnByb2plY3RzTGlzdC5sZW5ndGggPCAxKSByZXR1cm4gZmFsc2VcbiAgICBjb25zdCBwcm9qZWN0SWR4ID0gdGhpcy5wcm9wcy5wcm9qZWN0c0xpc3QuZmluZEluZGV4KHByb2plY3QgPT4ge1xuICAgICAgLy8gSGFyZGNvZGVkIC0gTmFtZSBvZiB0aGUgcHJvamVjdCB0aGF0IHdpbGwgYmUgdXNlZCBmb3IgdGhlIHR1dG9yaWFsXG4gICAgICByZXR1cm4gcHJvamVjdC5wcm9qZWN0TmFtZSA9PT0gJ0NoZWNrVHV0b3JpYWwnXG4gICAgfSlcbiAgICByZXR1cm4gcHJvamVjdElkeCAhPT0gLTFcbiAgfVxuXG4gIG5leHQgKCkge1xuICAgIHRoaXMudG91ckNoYW5uZWwubmV4dCgpXG4gIH1cblxuICBmaW5pc2ggKGNyZWF0ZUZpbGUsIHNraXBwZWQpIHtcbiAgICB0aGlzLnRvdXJDaGFubmVsLmZpbmlzaChjcmVhdGVGaWxlKVxuICAgIG1peHBhbmVsLmhhaWt1VHJhY2soJ3RvdXInLCB7XG4gICAgICBzdGF0ZTogJ3NraXBwZWQnLFxuICAgICAgc3RlcDogdGhpcy5zdGF0ZS5zdGVwRGF0YS5jdXJyZW50LFxuICAgICAgdGl0bGU6IHRoaXMuc3RhdGUuY29tcG9uZW50XG4gICAgfSlcbiAgfVxuXG4gIGhpZGUgKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe2NvbXBvbmVudDogbnVsbH0pXG4gIH1cblxuICBzaG93U3RlcCAobmV3U3RhdGUpIHtcbiAgICBpZiAodGhpcy5zdGF0ZS5zdGVwRGF0YS5jdXJyZW50IDwgbmV3U3RhdGUuc3RlcERhdGEuY3VycmVudCkge1xuICAgICAgbWl4cGFuZWwuaGFpa3VUcmFjaygndG91cicsIHtcbiAgICAgICAgc3RhdGU6ICdzdGVwIGNvbXBsZXRlZCcsXG4gICAgICAgIHN0ZXA6IHRoaXMuc3RhdGUuc3RlcERhdGEuY3VycmVudCxcbiAgICAgICAgdGl0bGU6IHRoaXMuc3RhdGUuY29tcG9uZW50XG4gICAgICB9KVxuICAgIH1cblxuICAgIHRoaXMuc2V0U3RhdGUobmV3U3RhdGUpXG4gIH1cblxuICBvcGVuTGluayAoZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgIHNoZWxsLm9wZW5FeHRlcm5hbChlLnRhcmdldC5ocmVmKVxuICB9XG5cbiAgcmVuZGVyICgpIHtcbiAgICBpZiAoIXRoaXMuc3RhdGUuY29tcG9uZW50KSB7XG4gICAgICByZXR1cm4gbnVsbFxuICAgIH1cblxuICAgIGNvbnN0IHtcbiAgICAgIGRpc3BsYXksXG4gICAgICBjb29yZGluYXRlcyxcbiAgICAgIG9mZnNldCxcbiAgICAgIGNvbXBvbmVudCxcbiAgICAgIHNwb3RsaWdodFJhZGl1cyxcbiAgICAgIHN0ZXBEYXRhLFxuICAgICAgd2FpdFVzZXJBY3Rpb25cbiAgICB9ID0gdGhpcy5zdGF0ZVxuXG4gICAgY29uc3QgU3RlcCA9IHN0ZXBzW2NvbXBvbmVudF1cblxuICAgIHJldHVybiAoXG4gICAgICA8VG9vbHRpcFxuICAgICAgICBjb29yZGluYXRlcz17Y29vcmRpbmF0ZXN9XG4gICAgICAgIG9mZnNldD17b2Zmc2V0fVxuICAgICAgICBkaXNwbGF5PXtkaXNwbGF5fVxuICAgICAgICBzcG90bGlnaHRSYWRpdXM9e3Nwb3RsaWdodFJhZGl1c31cbiAgICAgICAgbmV4dD17dGhpcy5uZXh0fVxuICAgICAgICBmaW5pc2g9e3RoaXMuZmluaXNofVxuICAgICAgICBzdGVwRGF0YT17c3RlcERhdGF9XG4gICAgICAgIHdhaXRVc2VyQWN0aW9uPXt3YWl0VXNlckFjdGlvbn1cbiAgICAgID5cbiAgICAgICAgPFN0ZXBcbiAgICAgICAgICBzdHlsZXM9e1RPVVJfU1RZTEVTfVxuICAgICAgICAgIG5leHQ9e3RoaXMubmV4dH1cbiAgICAgICAgICBmaW5pc2g9e3RoaXMuZmluaXNofVxuICAgICAgICAgIG9wZW5MaW5rPXt0aGlzLm9wZW5MaW5rfVxuICAgICAgICAvPlxuICAgICAgPC9Ub29sdGlwPlxuICAgIClcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBUb3VyXG4iXX0=