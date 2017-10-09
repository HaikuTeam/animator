'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _jsxFileName = 'src/react/components/AutoUpdater.js';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _autoUpdate = require('../../utils/autoUpdate');

var _autoUpdate2 = _interopRequireDefault(_autoUpdate);

var _Palette = require('./Palette');

var _Palette2 = _interopRequireDefault(_Palette);

var _color = require('color');

var _color2 = _interopRequireDefault(_color);

var _dashShared = require('../styles/dashShared');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var STYLES = {
  container: {
    fontSize: 16,
    zIndex: 9999999,
    backgroundColor: _Palette2.default.COAL,
    borderRadius: 3,
    padding: 20,
    color: _Palette2.default.ROCK,
    boxShadow: '0 4px 18px 0 rgba(1,28,33,0.38)',
    position: 'fixed',
    display: 'inline-block',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: 270
  },
  btn: Object.assign({}, _dashShared.DASH_STYLES.btn, {
    padding: '10px 15px',
    fontSize: 16,
    float: 'right'
  }),
  overlay: {
    position: 'fixed',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    backgroundColor: (0, _color2.default)(_Palette2.default.GRAY).fade(0.023),
    zIndex: 99999,
    pointerEvents: 'none'
  },
  progressNumber: {
    fontSize: 15,
    margin: '10px 0 0 0'
  },
  progressBar: {
    width: '100%'
  }
};

var statuses = {
  IDLE: 'Idle',
  CHECKING: 'Checking',
  DOWNLOADING: 'Downloading',
  NO_UPDATES: 'NoUpdates',
  DOWNLOAD_FINISHED: 'DownloadFinished',
  DOWNLOAD_FAILED: 'DownloadFailed'
};

var AutoUpdater = function (_React$Component) {
  _inherits(AutoUpdater, _React$Component);

  function AutoUpdater(props) {
    _classCallCheck(this, AutoUpdater);

    var _this = _possibleConstructorReturn(this, (AutoUpdater.__proto__ || Object.getPrototypeOf(AutoUpdater)).call(this, props));

    _this.hide = _this.hide.bind(_this);
    _this.updateProgress = _this.updateProgress.bind(_this);
    _this.onFail = _this.onFail.bind(_this);
    _this.isFirstRun = true;

    _this.state = {
      status: statuses.IDLE,
      progress: 0
    };
    return _this;
  }

  _createClass(AutoUpdater, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.shouldDisplay && this.state.status === statuses.IDLE) {
        this.checkForUpdates();
      }
    }
  }, {
    key: 'checkForUpdates',
    value: function checkForUpdates() {
      var _this2 = this;

      this.setState({ status: statuses.CHECKING });

      _autoUpdate2.default.checkUpdates().then(function (_ref) {
        var shouldUpdate = _ref.shouldUpdate,
            url = _ref.url;

        shouldUpdate ? _this2.update(url) : _this2.dismiss();
      }).catch(this.onFail);
    }
  }, {
    key: 'onFail',
    value: function onFail(error) {
      console.error(error);
      this.setState({ status: statuses.DOWNLOAD_FAILED });
    }
  }, {
    key: 'dismiss',
    value: function dismiss() {
      if (!this.isFirstRun) {
        this.setState({ status: statuses.NO_UPDATES });
      } else {
        this.hide();
        this.isFirstRun = false;
      }
    }
  }, {
    key: 'update',
    value: function update(url) {
      var _this3 = this;

      this.setState({ status: statuses.DOWNLOADING });
      _autoUpdate2.default.update(url, this.updateProgress).then(function () {
        _this3.setState({ status: statuses.DOWNLOAD_FINISHED, progress: 0 });
      }).catch(this.onFail);
    }
  }, {
    key: 'updateProgress',
    value: function updateProgress(progress) {
      this.setState({ progress: progress });
    }
  }, {
    key: 'hide',
    value: function hide() {
      this.setState({ status: statuses.IDLE });
      this.props.onAutoUpdateCheckComplete();
    }
  }, {
    key: 'renderDownloading',
    value: function renderDownloading() {
      var progress = this.state.progress.toFixed(1);

      return _react2.default.createElement(
        'div',
        {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 124
          },
          __self: this
        },
        _react2.default.createElement(
          'span',
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 125
            },
            __self: this
          },
          'An update is available. Downloading and installing...'
        ),
        _react2.default.createElement(
          'p',
          { style: STYLES.progressNumber, __source: {
              fileName: _jsxFileName,
              lineNumber: 128
            },
            __self: this
          },
          progress,
          ' %'
        ),
        _react2.default.createElement(
          'progress',
          { value: progress, max: '100', style: STYLES.progressBar, __source: {
              fileName: _jsxFileName,
              lineNumber: 129
            },
            __self: this
          },
          progress,
          ' %'
        )
      );
    }
  }, {
    key: 'renderDownloadFinished',
    value: function renderDownloadFinished() {
      return _react2.default.createElement(
        'div',
        {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 138
          },
          __self: this
        },
        'Update installed! Loading your Haiku!'
      );
    }
  }, {
    key: 'renderIdle',
    value: function renderIdle() {
      return _react2.default.createElement(
        'span',
        {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 145
          },
          __self: this
        },
        'Checking for updates...'
      );
    }
  }, {
    key: 'renderNoUpdates',
    value: function renderNoUpdates() {
      return _react2.default.createElement(
        'div',
        {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 150
          },
          __self: this
        },
        _react2.default.createElement(
          'p',
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 151
            },
            __self: this
          },
          'You are using the latest version'
        ),
        _react2.default.createElement(
          'button',
          { style: STYLES.btn, onClick: this.hide, __source: {
              fileName: _jsxFileName,
              lineNumber: 152
            },
            __self: this
          },
          'Ok'
        )
      );
    }
  }, {
    key: 'renderDownloadFailed',
    value: function renderDownloadFailed() {
      return _react2.default.createElement(
        'div',
        {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 159
          },
          __self: this
        },
        _react2.default.createElement(
          'p',
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 160
            },
            __self: this
          },
          'There was an error downloading the update, if the problem persists, please contact Haiku support.'
        ),
        _react2.default.createElement(
          'button',
          { style: STYLES.btn, onClick: this.hide, __source: {
              fileName: _jsxFileName,
              lineNumber: 162
            },
            __self: this
          },
          'Ok'
        )
      );
    }
  }, {
    key: 'renderChecking',
    value: function renderChecking() {
      return _react2.default.createElement(
        'div',
        {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 169
          },
          __self: this
        },
        'Checking for updates...'
      );
    }
  }, {
    key: 'render',
    value: function render() {
      if (process.env.HAIKU_SKIP_AUTOUPDATE === '1' || !this.props.shouldDisplay) {
        return null;
      }

      var content = this['render' + this.state.status]();

      return _react2.default.createElement(
        'div',
        {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 183
          },
          __self: this
        },
        _react2.default.createElement(
          'div',
          { style: STYLES.container, __source: {
              fileName: _jsxFileName,
              lineNumber: 184
            },
            __self: this
          },
          content
        ),
        _react2.default.createElement('div', { style: STYLES.overlay, __source: {
            fileName: _jsxFileName,
            lineNumber: 187
          },
          __self: this
        })
      );
    }
  }]);

  return AutoUpdater;
}(_react2.default.Component);

exports.default = AutoUpdater;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9yZWFjdC9jb21wb25lbnRzL0F1dG9VcGRhdGVyLmpzIl0sIm5hbWVzIjpbIlNUWUxFUyIsImNvbnRhaW5lciIsImZvbnRTaXplIiwiekluZGV4IiwiYmFja2dyb3VuZENvbG9yIiwiQ09BTCIsImJvcmRlclJhZGl1cyIsInBhZGRpbmciLCJjb2xvciIsIlJPQ0siLCJib3hTaGFkb3ciLCJwb3NpdGlvbiIsImRpc3BsYXkiLCJ0b3AiLCJsZWZ0IiwidHJhbnNmb3JtIiwibWF4V2lkdGgiLCJidG4iLCJmbG9hdCIsIm92ZXJsYXkiLCJ3aWR0aCIsImhlaWdodCIsIkdSQVkiLCJmYWRlIiwicG9pbnRlckV2ZW50cyIsInByb2dyZXNzTnVtYmVyIiwibWFyZ2luIiwicHJvZ3Jlc3NCYXIiLCJzdGF0dXNlcyIsIklETEUiLCJDSEVDS0lORyIsIkRPV05MT0FESU5HIiwiTk9fVVBEQVRFUyIsIkRPV05MT0FEX0ZJTklTSEVEIiwiRE9XTkxPQURfRkFJTEVEIiwiQXV0b1VwZGF0ZXIiLCJwcm9wcyIsImhpZGUiLCJiaW5kIiwidXBkYXRlUHJvZ3Jlc3MiLCJvbkZhaWwiLCJpc0ZpcnN0UnVuIiwic3RhdGUiLCJzdGF0dXMiLCJwcm9ncmVzcyIsIm5leHRQcm9wcyIsInNob3VsZERpc3BsYXkiLCJjaGVja0ZvclVwZGF0ZXMiLCJzZXRTdGF0ZSIsImNoZWNrVXBkYXRlcyIsInRoZW4iLCJzaG91bGRVcGRhdGUiLCJ1cmwiLCJ1cGRhdGUiLCJkaXNtaXNzIiwiY2F0Y2giLCJlcnJvciIsImNvbnNvbGUiLCJvbkF1dG9VcGRhdGVDaGVja0NvbXBsZXRlIiwidG9GaXhlZCIsInByb2Nlc3MiLCJlbnYiLCJIQUlLVV9TS0lQX0FVVE9VUERBVEUiLCJjb250ZW50IiwiQ29tcG9uZW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7O0FBRUEsSUFBTUEsU0FBUztBQUNiQyxh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QUFRRDs7OztFQXJJdUIsZ0JBQU02QyxTOztrQkF3SWpCN0IsVyIsImZpbGUiOiJBdXRvVXBkYXRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCBhdXRvVXBkYXRlIGZyb20gJy4uLy4uL3V0aWxzL2F1dG9VcGRhdGUnXG5pbXBvcnQgUGFsZXR0ZSBmcm9tICcuL1BhbGV0dGUnXG5pbXBvcnQgQ29sb3IgZnJvbSAnY29sb3InXG5pbXBvcnQgeyBEQVNIX1NUWUxFUyB9IGZyb20gJy4uL3N0eWxlcy9kYXNoU2hhcmVkJ1xuXG5jb25zdCBTVFlMRVMgPSB7XG4gIGNvbnRhaW5lcjoge1xuICAgIGZvbnRTaXplOiAxNixcbiAgICB6SW5kZXg6IDk5OTk5OTksXG4gICAgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLkNPQUwsXG4gICAgYm9yZGVyUmFkaXVzOiAzLFxuICAgIHBhZGRpbmc6IDIwLFxuICAgIGNvbG9yOiBQYWxldHRlLlJPQ0ssXG4gICAgYm94U2hhZG93OiAnMCA0cHggMThweCAwIHJnYmEoMSwyOCwzMywwLjM4KScsXG4gICAgcG9zaXRpb246ICdmaXhlZCcsXG4gICAgZGlzcGxheTogJ2lubGluZS1ibG9jaycsXG4gICAgdG9wOiAnNTAlJyxcbiAgICBsZWZ0OiAnNTAlJyxcbiAgICB0cmFuc2Zvcm06ICd0cmFuc2xhdGUoLTUwJSwgLTUwJSknLFxuICAgIG1heFdpZHRoOiAyNzBcbiAgfSxcbiAgYnRuOiB7XG4gICAgLi4uREFTSF9TVFlMRVMuYnRuLFxuICAgIHBhZGRpbmc6ICcxMHB4IDE1cHgnLFxuICAgIGZvbnRTaXplOiAxNixcbiAgICBmbG9hdDogJ3JpZ2h0J1xuICB9LFxuICBvdmVybGF5OiB7XG4gICAgcG9zaXRpb246ICdmaXhlZCcsXG4gICAgd2lkdGg6ICcxMDAlJyxcbiAgICBoZWlnaHQ6ICcxMDAlJyxcbiAgICB0b3A6IDAsXG4gICAgbGVmdDogMCxcbiAgICBiYWNrZ3JvdW5kQ29sb3I6IENvbG9yKFBhbGV0dGUuR1JBWSkuZmFkZSgwLjAyMyksXG4gICAgekluZGV4OiA5OTk5OSxcbiAgICBwb2ludGVyRXZlbnRzOiAnbm9uZSdcbiAgfSxcbiAgcHJvZ3Jlc3NOdW1iZXI6IHtcbiAgICBmb250U2l6ZTogMTUsXG4gICAgbWFyZ2luOiAnMTBweCAwIDAgMCdcbiAgfSxcbiAgcHJvZ3Jlc3NCYXI6IHtcbiAgICB3aWR0aDogJzEwMCUnXG4gIH1cbn1cblxubGV0IHN0YXR1c2VzID0ge1xuICBJRExFOiAnSWRsZScsXG4gIENIRUNLSU5HOiAnQ2hlY2tpbmcnLFxuICBET1dOTE9BRElORzogJ0Rvd25sb2FkaW5nJyxcbiAgTk9fVVBEQVRFUzogJ05vVXBkYXRlcycsXG4gIERPV05MT0FEX0ZJTklTSEVEOiAnRG93bmxvYWRGaW5pc2hlZCcsXG4gIERPV05MT0FEX0ZBSUxFRDogJ0Rvd25sb2FkRmFpbGVkJ1xufVxuXG5jbGFzcyBBdXRvVXBkYXRlciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yIChwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKVxuXG4gICAgdGhpcy5oaWRlID0gdGhpcy5oaWRlLmJpbmQodGhpcylcbiAgICB0aGlzLnVwZGF0ZVByb2dyZXNzID0gdGhpcy51cGRhdGVQcm9ncmVzcy5iaW5kKHRoaXMpXG4gICAgdGhpcy5vbkZhaWwgPSB0aGlzLm9uRmFpbC5iaW5kKHRoaXMpXG4gICAgdGhpcy5pc0ZpcnN0UnVuID0gdHJ1ZVxuXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIHN0YXR1czogc3RhdHVzZXMuSURMRSxcbiAgICAgIHByb2dyZXNzOiAwXG4gICAgfVxuICB9XG5cbiAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyAobmV4dFByb3BzKSB7XG4gICAgaWYgKG5leHRQcm9wcy5zaG91bGREaXNwbGF5ICYmIHRoaXMuc3RhdGUuc3RhdHVzID09PSBzdGF0dXNlcy5JRExFKSB7XG4gICAgICB0aGlzLmNoZWNrRm9yVXBkYXRlcygpXG4gICAgfVxuICB9XG5cbiAgY2hlY2tGb3JVcGRhdGVzICgpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtzdGF0dXM6IHN0YXR1c2VzLkNIRUNLSU5HfSlcblxuICAgIGF1dG9VcGRhdGUuY2hlY2tVcGRhdGVzKClcbiAgICAgIC50aGVuKCh7c2hvdWxkVXBkYXRlLCB1cmx9KSA9PiB7XG4gICAgICAgIHNob3VsZFVwZGF0ZSA/IHRoaXMudXBkYXRlKHVybCkgOiB0aGlzLmRpc21pc3MoKVxuICAgICAgfSlcbiAgICAgIC5jYXRjaCh0aGlzLm9uRmFpbClcbiAgfVxuXG4gIG9uRmFpbCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKGVycm9yKVxuICAgIHRoaXMuc2V0U3RhdGUoe3N0YXR1czogc3RhdHVzZXMuRE9XTkxPQURfRkFJTEVEfSlcbiAgfVxuXG4gIGRpc21pc3MgKCkge1xuICAgIGlmICghdGhpcy5pc0ZpcnN0UnVuKSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtzdGF0dXM6IHN0YXR1c2VzLk5PX1VQREFURVN9KVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmhpZGUoKVxuICAgICAgdGhpcy5pc0ZpcnN0UnVuID0gZmFsc2VcbiAgICB9XG4gIH1cblxuICB1cGRhdGUgKHVybCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe3N0YXR1czogc3RhdHVzZXMuRE9XTkxPQURJTkd9KVxuICAgIGF1dG9VcGRhdGUudXBkYXRlKHVybCwgdGhpcy51cGRhdGVQcm9ncmVzcylcbiAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7c3RhdHVzOiBzdGF0dXNlcy5ET1dOTE9BRF9GSU5JU0hFRCwgcHJvZ3Jlc3M6IDB9KVxuICAgICAgfSlcbiAgICAgIC5jYXRjaCh0aGlzLm9uRmFpbClcbiAgfVxuXG4gIHVwZGF0ZVByb2dyZXNzIChwcm9ncmVzcykge1xuICAgIHRoaXMuc2V0U3RhdGUoeyBwcm9ncmVzcyB9KVxuICB9XG5cbiAgaGlkZSAoKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7c3RhdHVzOiBzdGF0dXNlcy5JRExFfSlcbiAgICB0aGlzLnByb3BzLm9uQXV0b1VwZGF0ZUNoZWNrQ29tcGxldGUoKVxuICB9XG5cbiAgcmVuZGVyRG93bmxvYWRpbmcgKCkge1xuICAgIGNvbnN0IHByb2dyZXNzID0gdGhpcy5zdGF0ZS5wcm9ncmVzcy50b0ZpeGVkKDEpXG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdj5cbiAgICAgICAgPHNwYW4+XG4gICAgICAgICAgQW4gdXBkYXRlIGlzIGF2YWlsYWJsZS4gRG93bmxvYWRpbmcgYW5kIGluc3RhbGxpbmcuLi5cbiAgICAgICAgPC9zcGFuPlxuICAgICAgICA8cCBzdHlsZT17U1RZTEVTLnByb2dyZXNzTnVtYmVyfT57cHJvZ3Jlc3N9ICU8L3A+XG4gICAgICAgIDxwcm9ncmVzcyB2YWx1ZT17cHJvZ3Jlc3N9IG1heD0nMTAwJyBzdHlsZT17U1RZTEVTLnByb2dyZXNzQmFyfT5cbiAgICAgICAgICB7cHJvZ3Jlc3N9ICVcbiAgICAgICAgPC9wcm9ncmVzcz5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHJlbmRlckRvd25sb2FkRmluaXNoZWQgKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2PlxuICAgICAgICBVcGRhdGUgaW5zdGFsbGVkISBMb2FkaW5nIHlvdXIgSGFpa3UhXG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICByZW5kZXJJZGxlICgpIHtcbiAgICByZXR1cm4gPHNwYW4+Q2hlY2tpbmcgZm9yIHVwZGF0ZXMuLi48L3NwYW4+XG4gIH1cblxuICByZW5kZXJOb1VwZGF0ZXMgKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2PlxuICAgICAgICA8cD5Zb3UgYXJlIHVzaW5nIHRoZSBsYXRlc3QgdmVyc2lvbjwvcD5cbiAgICAgICAgPGJ1dHRvbiBzdHlsZT17U1RZTEVTLmJ0bn0gb25DbGljaz17dGhpcy5oaWRlfT5PazwvYnV0dG9uPlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyRG93bmxvYWRGYWlsZWQgKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2PlxuICAgICAgICA8cD5UaGVyZSB3YXMgYW4gZXJyb3IgZG93bmxvYWRpbmcgdGhlIHVwZGF0ZSwgaWYgdGhlIHByb2JsZW0gcGVyc2lzdHMsXG4gICAgICAgIHBsZWFzZSBjb250YWN0IEhhaWt1IHN1cHBvcnQuPC9wPlxuICAgICAgICA8YnV0dG9uIHN0eWxlPXtTVFlMRVMuYnRufSBvbkNsaWNrPXt0aGlzLmhpZGV9Pk9rPC9idXR0b24+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICByZW5kZXJDaGVja2luZyAoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXY+XG4gICAgICAgIENoZWNraW5nIGZvciB1cGRhdGVzLi4uXG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICByZW5kZXIgKCkge1xuICAgIGlmIChwcm9jZXNzLmVudi5IQUlLVV9TS0lQX0FVVE9VUERBVEUgPT09ICcxJyB8fCAhdGhpcy5wcm9wcy5zaG91bGREaXNwbGF5KSB7XG4gICAgICByZXR1cm4gbnVsbFxuICAgIH1cblxuICAgIGxldCBjb250ZW50ID0gdGhpc1tgcmVuZGVyJHt0aGlzLnN0YXRlLnN0YXR1c31gXSgpXG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdj5cbiAgICAgICAgPGRpdiBzdHlsZT17U1RZTEVTLmNvbnRhaW5lcn0+XG4gICAgICAgICAge2NvbnRlbnR9XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IHN0eWxlPXtTVFlMRVMub3ZlcmxheX0gLz5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBBdXRvVXBkYXRlclxuIl19