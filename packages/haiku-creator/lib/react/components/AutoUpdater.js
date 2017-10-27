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

var _downloadShared = require('../styles/downloadShared');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var statuses = {
  IDLE: 'Idle',
  OPT_IN: 'OptIn',
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
    _this.update = _this.update.bind(_this);
    _this.onFail = _this.onFail.bind(_this);
    _this.url = undefined;
    _this.state = {
      status: statuses.IDLE,
      progress: 0
    };
    return _this;
  }

  _createClass(AutoUpdater, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (process.env.HAIKU_SKIP_AUTOUPDATE !== '1' && this.state.status === statuses.IDLE && nextProps.check) {
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

        if (shouldUpdate) {
          _this2.url = url;
          _this2.props.skipOptIn ? _this2.update() : _this2.setState({ status: statuses.OPT_IN });
        } else {
          _this2.props.runOnBackground ? _this2.hide() : _this2.setState({ status: statuses.NO_UPDATES });
        }
      }).catch(function () {
        _this2.props.runOnBackground ? _this2.hide() : _this2.onFail();
      });
    }
  }, {
    key: 'onFail',
    value: function onFail(error) {
      console.error(error);
      this.setState({ status: statuses.DOWNLOAD_FAILED });
    }
  }, {
    key: 'update',
    value: function update() {
      var _this3 = this;

      this.setState({ status: statuses.DOWNLOADING });
      _autoUpdate2.default.update(this.url, this.updateProgress).then(function () {
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
      this.props.onComplete();
    }
  }, {
    key: 'renderOptIn',
    value: function renderOptIn() {
      return _react2.default.createElement(
        'div',
        {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 87
          },
          __self: this
        },
        _react2.default.createElement(
          'p',
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 88
            },
            __self: this
          },
          'There is a new version available. ',
          _react2.default.createElement('br', {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 89
            },
            __self: this
          })
        ),
        _react2.default.createElement(
          'p',
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 91
            },
            __self: this
          },
          'Would you like to download it?'
        ),
        _react2.default.createElement(
          'button',
          { style: _downloadShared.DOWNLOAD_STYLES.btnSecondary, onClick: this.hide, __source: {
              fileName: _jsxFileName,
              lineNumber: 92
            },
            __self: this
          },
          'Not now'
        ),
        _react2.default.createElement(
          'button',
          { style: _downloadShared.DOWNLOAD_STYLES.btn, onClick: this.update, __source: {
              fileName: _jsxFileName,
              lineNumber: 95
            },
            __self: this
          },
          'Yes'
        )
      );
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
            lineNumber: 106
          },
          __self: this
        },
        _react2.default.createElement(
          'span',
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 107
            },
            __self: this
          },
          this.props.skipOptIn && 'An update is available.',
          'Downloading and installing...'
        ),
        _react2.default.createElement(
          'p',
          { style: _downloadShared.DOWNLOAD_STYLES.progressNumber, __source: {
              fileName: _jsxFileName,
              lineNumber: 111
            },
            __self: this
          },
          progress,
          ' %'
        ),
        _react2.default.createElement(
          'progress',
          { value: progress, max: '100', style: _downloadShared.DOWNLOAD_STYLES.progressBar, __source: {
              fileName: _jsxFileName,
              lineNumber: 112
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
            lineNumber: 121
          },
          __self: this
        },
        'Update installed! Loading your Haiku!'
      );
    }
  }, {
    key: 'renderIdle',
    value: function renderIdle() {
      return null;
    }
  }, {
    key: 'renderNoUpdates',
    value: function renderNoUpdates() {
      if (this.props.runOnBackground) return null;

      return _react2.default.createElement(
        'div',
        {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 135
          },
          __self: this
        },
        _react2.default.createElement(
          'p',
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 136
            },
            __self: this
          },
          'You are using the latest version'
        ),
        _react2.default.createElement(
          'button',
          { style: _downloadShared.DOWNLOAD_STYLES.btn, onClick: this.hide, __source: {
              fileName: _jsxFileName,
              lineNumber: 137
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
            lineNumber: 144
          },
          __self: this
        },
        _react2.default.createElement(
          'p',
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 145
            },
            __self: this
          },
          'There was an error downloading the update, if the problem persists, please contact Haiku support.'
        ),
        _react2.default.createElement(
          'button',
          { style: _downloadShared.DOWNLOAD_STYLES.btn, onClick: this.hide, __source: {
              fileName: _jsxFileName,
              lineNumber: 147
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
      if (this.props.runOnBackground) return null;

      return _react2.default.createElement(
        'div',
        {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 156
          },
          __self: this
        },
        'Checking for updates...'
      );
    }
  }, {
    key: 'render',
    value: function render() {
      if (process.env.HAIKU_SKIP_AUTOUPDATE === '1') {
        return null;
      }

      var content = this['render' + this.state.status]();

      if (content) {
        return _react2.default.createElement(
          'div',
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 171
            },
            __self: this
          },
          _react2.default.createElement(
            'div',
            { style: _downloadShared.DOWNLOAD_STYLES.container, __source: {
                fileName: _jsxFileName,
                lineNumber: 172
              },
              __self: this
            },
            content
          ),
          _react2.default.createElement('div', { style: _downloadShared.DOWNLOAD_STYLES.overlay, __source: {
              fileName: _jsxFileName,
              lineNumber: 175
            },
            __self: this
          })
        );
      } else {
        return null;
      }
    }
  }]);

  return AutoUpdater;
}(_react2.default.Component);

exports.default = AutoUpdater;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9yZWFjdC9jb21wb25lbnRzL0F1dG9VcGRhdGVyLmpzIl0sIm5hbWVzIjpbInN0YXR1c2VzIiwiSURMRSIsIk9QVF9JTiIsIkNIRUNLSU5HIiwiRE9XTkxPQURJTkciLCJOT19VUERBVEVTIiwiRE9XTkxPQURfRklOSVNIRUQiLCJET1dOTE9BRF9GQUlMRUQiLCJBdXRvVXBkYXRlciIsInByb3BzIiwiaGlkZSIsImJpbmQiLCJ1cGRhdGVQcm9ncmVzcyIsInVwZGF0ZSIsIm9uRmFpbCIsInVybCIsInVuZGVmaW5lZCIsInN0YXRlIiwic3RhdHVzIiwicHJvZ3Jlc3MiLCJuZXh0UHJvcHMiLCJwcm9jZXNzIiwiZW52IiwiSEFJS1VfU0tJUF9BVVRPVVBEQVRFIiwiY2hlY2siLCJjaGVja0ZvclVwZGF0ZXMiLCJzZXRTdGF0ZSIsImNoZWNrVXBkYXRlcyIsInRoZW4iLCJzaG91bGRVcGRhdGUiLCJza2lwT3B0SW4iLCJydW5PbkJhY2tncm91bmQiLCJjYXRjaCIsImVycm9yIiwiY29uc29sZSIsIm9uQ29tcGxldGUiLCJidG5TZWNvbmRhcnkiLCJidG4iLCJ0b0ZpeGVkIiwicHJvZ3Jlc3NOdW1iZXIiLCJwcm9ncmVzc0JhciIsImNvbnRlbnQiLCJjb250YWluZXIiLCJvdmVybGF5IiwiQ29tcG9uZW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7QUFFQSxJQUFJQSxXQUFXO0FBQ2JDLFFBQU0sTUFETztBQUViQyxVQUFRLE9BRks7QUFHYkMsWUFBVSxVQUhHO0FBSWJDLGVBQWEsYUFKQTtBQUtiQyxjQUFZLFdBTEM7QUFNYkMscUJBQW1CLGtCQU5OO0FBT2JDLG1CQUFpQjtBQVBKLENBQWY7O0lBVU1DLFc7OztBQUNKLHVCQUFhQyxLQUFiLEVBQW9CO0FBQUE7O0FBQUEsMEhBQ1pBLEtBRFk7O0FBRWxCLFVBQUtDLElBQUwsR0FBWSxNQUFLQSxJQUFMLENBQVVDLElBQVYsT0FBWjtB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c0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IGF1dG9VcGRhdGUgZnJvbSAnLi4vLi4vdXRpbHMvYXV0b1VwZGF0ZSdcbmltcG9ydCB7RE9XTkxPQURfU1RZTEVTIGFzIFNUWUxFU30gZnJvbSAnLi4vc3R5bGVzL2Rvd25sb2FkU2hhcmVkJ1xuXG5sZXQgc3RhdHVzZXMgPSB7XG4gIElETEU6ICdJZGxlJyxcbiAgT1BUX0lOOiAnT3B0SW4nLFxuICBDSEVDS0lORzogJ0NoZWNraW5nJyxcbiAgRE9XTkxPQURJTkc6ICdEb3dubG9hZGluZycsXG4gIE5PX1VQREFURVM6ICdOb1VwZGF0ZXMnLFxuICBET1dOTE9BRF9GSU5JU0hFRDogJ0Rvd25sb2FkRmluaXNoZWQnLFxuICBET1dOTE9BRF9GQUlMRUQ6ICdEb3dubG9hZEZhaWxlZCdcbn1cblxuY2xhc3MgQXV0b1VwZGF0ZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3RvciAocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcylcbiAgICB0aGlzLmhpZGUgPSB0aGlzLmhpZGUuYmluZCh0aGlzKVxuICAgIHRoaXMudXBkYXRlUHJvZ3Jlc3MgPSB0aGlzLnVwZGF0ZVByb2dyZXNzLmJpbmQodGhpcylcbiAgICB0aGlzLnVwZGF0ZSA9IHRoaXMudXBkYXRlLmJpbmQodGhpcylcbiAgICB0aGlzLm9uRmFpbCA9IHRoaXMub25GYWlsLmJpbmQodGhpcylcbiAgICB0aGlzLnVybCA9IHVuZGVmaW5lZFxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBzdGF0dXM6IHN0YXR1c2VzLklETEUsXG4gICAgICBwcm9ncmVzczogMFxuICAgIH1cbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMgKG5leHRQcm9wcykge1xuICAgIGlmIChcbiAgICAgIHByb2Nlc3MuZW52LkhBSUtVX1NLSVBfQVVUT1VQREFURSAhPT0gJzEnICYmXG4gICAgICB0aGlzLnN0YXRlLnN0YXR1cyA9PT0gc3RhdHVzZXMuSURMRSAmJlxuICAgICAgbmV4dFByb3BzLmNoZWNrXG4gICAgKSB7XG4gICAgICB0aGlzLmNoZWNrRm9yVXBkYXRlcygpXG4gICAgfVxuICB9XG5cbiAgY2hlY2tGb3JVcGRhdGVzICgpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtzdGF0dXM6IHN0YXR1c2VzLkNIRUNLSU5HfSlcblxuICAgIGF1dG9VcGRhdGUuY2hlY2tVcGRhdGVzKClcbiAgICAgIC50aGVuKCh7c2hvdWxkVXBkYXRlLCB1cmx9KSA9PiB7XG4gICAgICAgIGlmIChzaG91bGRVcGRhdGUpIHtcbiAgICAgICAgICB0aGlzLnVybCA9IHVybFxuICAgICAgICAgIHRoaXMucHJvcHMuc2tpcE9wdEluXG4gICAgICAgICAgICA/IHRoaXMudXBkYXRlKClcbiAgICAgICAgICAgIDogdGhpcy5zZXRTdGF0ZSh7c3RhdHVzOiBzdGF0dXNlcy5PUFRfSU59KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMucHJvcHMucnVuT25CYWNrZ3JvdW5kXG4gICAgICAgICAgICA/IHRoaXMuaGlkZSgpXG4gICAgICAgICAgICA6IHRoaXMuc2V0U3RhdGUoe3N0YXR1czogc3RhdHVzZXMuTk9fVVBEQVRFU30pXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICAuY2F0Y2goKCkgPT4ge1xuICAgICAgICB0aGlzLnByb3BzLnJ1bk9uQmFja2dyb3VuZFxuICAgICAgICAgID8gdGhpcy5oaWRlKClcbiAgICAgICAgICA6IHRoaXMub25GYWlsKClcbiAgICAgIH0pXG4gIH1cblxuICBvbkZhaWwgKGVycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcihlcnJvcilcbiAgICB0aGlzLnNldFN0YXRlKHtzdGF0dXM6IHN0YXR1c2VzLkRPV05MT0FEX0ZBSUxFRH0pXG4gIH1cblxuICB1cGRhdGUgKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe3N0YXR1czogc3RhdHVzZXMuRE9XTkxPQURJTkd9KVxuICAgIGF1dG9VcGRhdGUudXBkYXRlKHRoaXMudXJsLCB0aGlzLnVwZGF0ZVByb2dyZXNzKVxuICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtzdGF0dXM6IHN0YXR1c2VzLkRPV05MT0FEX0ZJTklTSEVELCBwcm9ncmVzczogMH0pXG4gICAgICB9KVxuICAgICAgLmNhdGNoKHRoaXMub25GYWlsKVxuICB9XG5cbiAgdXBkYXRlUHJvZ3Jlc3MgKHByb2dyZXNzKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7cHJvZ3Jlc3N9KVxuICB9XG5cbiAgaGlkZSAoKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7c3RhdHVzOiBzdGF0dXNlcy5JRExFfSlcbiAgICB0aGlzLnByb3BzLm9uQ29tcGxldGUoKVxuICB9XG5cbiAgcmVuZGVyT3B0SW4gKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2PlxuICAgICAgICA8cD5cbiAgICAgICAgICBUaGVyZSBpcyBhIG5ldyB2ZXJzaW9uIGF2YWlsYWJsZS4gPGJyIC8+XG4gICAgICAgIDwvcD5cbiAgICAgICAgPHA+V291bGQgeW91IGxpa2UgdG8gZG93bmxvYWQgaXQ/PC9wPlxuICAgICAgICA8YnV0dG9uIHN0eWxlPXtTVFlMRVMuYnRuU2Vjb25kYXJ5fSBvbkNsaWNrPXt0aGlzLmhpZGV9PlxuICAgICAgICAgIE5vdCBub3dcbiAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDxidXR0b24gc3R5bGU9e1NUWUxFUy5idG59IG9uQ2xpY2s9e3RoaXMudXBkYXRlfT5cbiAgICAgICAgICBZZXNcbiAgICAgICAgPC9idXR0b24+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICByZW5kZXJEb3dubG9hZGluZyAoKSB7XG4gICAgY29uc3QgcHJvZ3Jlc3MgPSB0aGlzLnN0YXRlLnByb2dyZXNzLnRvRml4ZWQoMSlcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2PlxuICAgICAgICA8c3Bhbj5cbiAgICAgICAgICB7dGhpcy5wcm9wcy5za2lwT3B0SW4gJiYgJ0FuIHVwZGF0ZSBpcyBhdmFpbGFibGUuJ31cbiAgICAgICAgICBEb3dubG9hZGluZyBhbmQgaW5zdGFsbGluZy4uLlxuICAgICAgICA8L3NwYW4+XG4gICAgICAgIDxwIHN0eWxlPXtTVFlMRVMucHJvZ3Jlc3NOdW1iZXJ9Pntwcm9ncmVzc30gJTwvcD5cbiAgICAgICAgPHByb2dyZXNzIHZhbHVlPXtwcm9ncmVzc30gbWF4PScxMDAnIHN0eWxlPXtTVFlMRVMucHJvZ3Jlc3NCYXJ9PlxuICAgICAgICAgIHtwcm9ncmVzc30gJVxuICAgICAgICA8L3Byb2dyZXNzPlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyRG93bmxvYWRGaW5pc2hlZCAoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXY+XG4gICAgICAgIFVwZGF0ZSBpbnN0YWxsZWQhIExvYWRpbmcgeW91ciBIYWlrdSFcbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHJlbmRlcklkbGUgKCkge1xuICAgIHJldHVybiBudWxsXG4gIH1cblxuICByZW5kZXJOb1VwZGF0ZXMgKCkge1xuICAgIGlmICh0aGlzLnByb3BzLnJ1bk9uQmFja2dyb3VuZCkgcmV0dXJuIG51bGxcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2PlxuICAgICAgICA8cD5Zb3UgYXJlIHVzaW5nIHRoZSBsYXRlc3QgdmVyc2lvbjwvcD5cbiAgICAgICAgPGJ1dHRvbiBzdHlsZT17U1RZTEVTLmJ0bn0gb25DbGljaz17dGhpcy5oaWRlfT5PazwvYnV0dG9uPlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyRG93bmxvYWRGYWlsZWQgKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2PlxuICAgICAgICA8cD5UaGVyZSB3YXMgYW4gZXJyb3IgZG93bmxvYWRpbmcgdGhlIHVwZGF0ZSwgaWYgdGhlIHByb2JsZW0gcGVyc2lzdHMsXG4gICAgICAgIHBsZWFzZSBjb250YWN0IEhhaWt1IHN1cHBvcnQuPC9wPlxuICAgICAgICA8YnV0dG9uIHN0eWxlPXtTVFlMRVMuYnRufSBvbkNsaWNrPXt0aGlzLmhpZGV9Pk9rPC9idXR0b24+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICByZW5kZXJDaGVja2luZyAoKSB7XG4gICAgaWYgKHRoaXMucHJvcHMucnVuT25CYWNrZ3JvdW5kKSByZXR1cm4gbnVsbFxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXY+XG4gICAgICAgIENoZWNraW5nIGZvciB1cGRhdGVzLi4uXG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICByZW5kZXIgKCkge1xuICAgIGlmIChwcm9jZXNzLmVudi5IQUlLVV9TS0lQX0FVVE9VUERBVEUgPT09ICcxJykge1xuICAgICAgcmV0dXJuIG51bGxcbiAgICB9XG5cbiAgICBsZXQgY29udGVudCA9IHRoaXNbYHJlbmRlciR7dGhpcy5zdGF0ZS5zdGF0dXN9YF0oKVxuXG4gICAgaWYgKGNvbnRlbnQpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgPGRpdiBzdHlsZT17U1RZTEVTLmNvbnRhaW5lcn0+XG4gICAgICAgICAgICB7Y29udGVudH1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IHN0eWxlPXtTVFlMRVMub3ZlcmxheX0gLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICApXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBudWxsXG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEF1dG9VcGRhdGVyXG4iXX0=