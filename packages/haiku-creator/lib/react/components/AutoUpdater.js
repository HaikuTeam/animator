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
      if (process.env.HAIKU_SKIP_AUTOUPDATE !== '1' && nextProps.shouldDisplay && this.state.status === statuses.IDLE) {
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
            lineNumber: 85
          },
          __self: this
        },
        _react2.default.createElement(
          'span',
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 86
            },
            __self: this
          },
          'An update is available. Downloading and installing...'
        ),
        _react2.default.createElement(
          'p',
          { style: _downloadShared.DOWNLOAD_STYLES.progressNumber, __source: {
              fileName: _jsxFileName,
              lineNumber: 89
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
              lineNumber: 90
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
            lineNumber: 99
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
            lineNumber: 106
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
            lineNumber: 111
          },
          __self: this
        },
        _react2.default.createElement(
          'p',
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 112
            },
            __self: this
          },
          'You are using the latest version'
        ),
        _react2.default.createElement(
          'button',
          { style: _downloadShared.DOWNLOAD_STYLES.btn, onClick: this.hide, __source: {
              fileName: _jsxFileName,
              lineNumber: 113
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
            lineNumber: 120
          },
          __self: this
        },
        _react2.default.createElement(
          'p',
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 121
            },
            __self: this
          },
          'There was an error downloading the update, if the problem persists, please contact Haiku support.'
        ),
        _react2.default.createElement(
          'button',
          { style: _downloadShared.DOWNLOAD_STYLES.btn, onClick: this.hide, __source: {
              fileName: _jsxFileName,
              lineNumber: 123
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
            lineNumber: 130
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
            lineNumber: 144
          },
          __self: this
        },
        _react2.default.createElement(
          'div',
          { style: _downloadShared.DOWNLOAD_STYLES.container, __source: {
              fileName: _jsxFileName,
              lineNumber: 145
            },
            __self: this
          },
          content
        ),
        _react2.default.createElement('div', { style: _downloadShared.DOWNLOAD_STYLES.overlay, __source: {
            fileName: _jsxFileName,
            lineNumber: 148
          },
          __self: this
        })
      );
    }
  }]);

  return AutoUpdater;
}(_react2.default.Component);

exports.default = AutoUpdater;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9yZWFjdC9jb21wb25lbnRzL0F1dG9VcGRhdGVyLmpzIl0sIm5hbWVzIjpbInN0YXR1c2VzIiwiSURMRSIsIkNIRUNLSU5HIiwiRE9XTkxPQURJTkciLCJOT19VUERBVEVTIiwiRE9XTkxPQURfRklOSVNIRUQiLCJET1dOTE9BRF9GQUlMRUQiLCJBdXRvVXBkYXRlciIsInByb3BzIiwiaGlkZSIsImJpbmQiLCJ1cGRhdGVQcm9ncmVzcyIsIm9uRmFpbCIsImlzRmlyc3RSdW4iLCJzdGF0ZSIsInN0YXR1cyIsInByb2dyZXNzIiwibmV4dFByb3BzIiwicHJvY2VzcyIsImVudiIsIkhBSUtVX1NLSVBfQVVUT1VQREFURSIsInNob3VsZERpc3BsYXkiLCJjaGVja0ZvclVwZGF0ZXMiLCJzZXRTdGF0ZSIsImNoZWNrVXBkYXRlcyIsInRoZW4iLCJzaG91bGRVcGRhdGUiLCJ1cmwiLCJ1cGRhdGUiLCJkaXNtaXNzIiwiY2F0Y2giLCJlcnJvciIsImNvbnNvbGUiLCJvbkF1dG9VcGRhdGVDaGVja0NvbXBsZXRlIiwidG9GaXhlZCIsInByb2dyZXNzTnVtYmVyIiwicHJvZ3Jlc3NCYXIiLCJidG4iLCJjb250ZW50IiwiY29udGFpbmVyIiwib3ZlcmxheSIsIkNvbXBvbmVudCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7O0FBRUEsSUFBSUEsV0FBVztBQUNiQyxRQUFNLE1BRE87QUFFYkMsWUFBVSxVQUZHO0FBR2JDLGVBQWEsYUFIQTtBQUliQyxjQUFZLFdBSkM7QUFLYkMscUJBQW1CLGtCQUxOO0FBTWJDLG1CQUFpQjtBQU5KLENBQWY7O0lBU01DLFc7OztBQUNKLHVCQUFhQyxLQUFiLEVBQW9CO0FBQUE7O0FBQUEsMEhBQ1pBLEtBRFk7O0FBR2xCLFVBQUtDLElBQUwsR0FBWSxNQUFLQSxJQUFMLENBQVVDLElBQVYsT0FBWjtBQUNBLFVBQUtDLGNBQUwsR0FBc0IsTUFBS0EsY0FBTCxDQUFv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K0NBQUssT0FBTyxnQ0FBT0UsT0FBbkI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBSkYsT0FERjtBQVFEOzs7O0VBekl1QixnQkFBTUMsUzs7a0JBNElqQmxDLFciLCJmaWxlIjoiQXV0b1VwZGF0ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgYXV0b1VwZGF0ZSBmcm9tICcuLi8uLi91dGlscy9hdXRvVXBkYXRlJ1xuaW1wb3J0IHtET1dOTE9BRF9TVFlMRVMgYXMgU1RZTEVTfSBmcm9tICcuLi9zdHlsZXMvZG93bmxvYWRTaGFyZWQnXG5cbmxldCBzdGF0dXNlcyA9IHtcbiAgSURMRTogJ0lkbGUnLFxuICBDSEVDS0lORzogJ0NoZWNraW5nJyxcbiAgRE9XTkxPQURJTkc6ICdEb3dubG9hZGluZycsXG4gIE5PX1VQREFURVM6ICdOb1VwZGF0ZXMnLFxuICBET1dOTE9BRF9GSU5JU0hFRDogJ0Rvd25sb2FkRmluaXNoZWQnLFxuICBET1dOTE9BRF9GQUlMRUQ6ICdEb3dubG9hZEZhaWxlZCdcbn1cblxuY2xhc3MgQXV0b1VwZGF0ZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3RvciAocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcylcblxuICAgIHRoaXMuaGlkZSA9IHRoaXMuaGlkZS5iaW5kKHRoaXMpXG4gICAgdGhpcy51cGRhdGVQcm9ncmVzcyA9IHRoaXMudXBkYXRlUHJvZ3Jlc3MuYmluZCh0aGlzKVxuICAgIHRoaXMub25GYWlsID0gdGhpcy5vbkZhaWwuYmluZCh0aGlzKVxuICAgIHRoaXMuaXNGaXJzdFJ1biA9IHRydWVcblxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBzdGF0dXM6IHN0YXR1c2VzLklETEUsXG4gICAgICBwcm9ncmVzczogMFxuICAgIH1cbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMgKG5leHRQcm9wcykge1xuICAgIGlmIChcbiAgICAgIHByb2Nlc3MuZW52LkhBSUtVX1NLSVBfQVVUT1VQREFURSAhPT0gJzEnICYmXG4gICAgICBuZXh0UHJvcHMuc2hvdWxkRGlzcGxheSAmJlxuICAgICAgdGhpcy5zdGF0ZS5zdGF0dXMgPT09IHN0YXR1c2VzLklETEVcbiAgICApIHtcbiAgICAgIHRoaXMuY2hlY2tGb3JVcGRhdGVzKClcbiAgICB9XG4gIH1cblxuICBjaGVja0ZvclVwZGF0ZXMgKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe3N0YXR1czogc3RhdHVzZXMuQ0hFQ0tJTkd9KVxuXG4gICAgYXV0b1VwZGF0ZS5jaGVja1VwZGF0ZXMoKVxuICAgICAgLnRoZW4oKHtzaG91bGRVcGRhdGUsIHVybH0pID0+IHtcbiAgICAgICAgc2hvdWxkVXBkYXRlID8gdGhpcy51cGRhdGUodXJsKSA6IHRoaXMuZGlzbWlzcygpXG4gICAgICB9KVxuICAgICAgLmNhdGNoKHRoaXMub25GYWlsKVxuICB9XG5cbiAgb25GYWlsIChlcnJvcikge1xuICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpXG4gICAgdGhpcy5zZXRTdGF0ZSh7c3RhdHVzOiBzdGF0dXNlcy5ET1dOTE9BRF9GQUlMRUR9KVxuICB9XG5cbiAgZGlzbWlzcyAoKSB7XG4gICAgaWYgKCF0aGlzLmlzRmlyc3RSdW4pIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe3N0YXR1czogc3RhdHVzZXMuTk9fVVBEQVRFU30pXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuaGlkZSgpXG4gICAgICB0aGlzLmlzRmlyc3RSdW4gPSBmYWxzZVxuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZSAodXJsKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7c3RhdHVzOiBzdGF0dXNlcy5ET1dOTE9BRElOR30pXG4gICAgYXV0b1VwZGF0ZS51cGRhdGUodXJsLCB0aGlzLnVwZGF0ZVByb2dyZXNzKVxuICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtzdGF0dXM6IHN0YXR1c2VzLkRPV05MT0FEX0ZJTklTSEVELCBwcm9ncmVzczogMH0pXG4gICAgICB9KVxuICAgICAgLmNhdGNoKHRoaXMub25GYWlsKVxuICB9XG5cbiAgdXBkYXRlUHJvZ3Jlc3MgKHByb2dyZXNzKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7IHByb2dyZXNzIH0pXG4gIH1cblxuICBoaWRlICgpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtzdGF0dXM6IHN0YXR1c2VzLklETEV9KVxuICAgIHRoaXMucHJvcHMub25BdXRvVXBkYXRlQ2hlY2tDb21wbGV0ZSgpXG4gIH1cblxuICByZW5kZXJEb3dubG9hZGluZyAoKSB7XG4gICAgY29uc3QgcHJvZ3Jlc3MgPSB0aGlzLnN0YXRlLnByb2dyZXNzLnRvRml4ZWQoMSlcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2PlxuICAgICAgICA8c3Bhbj5cbiAgICAgICAgICBBbiB1cGRhdGUgaXMgYXZhaWxhYmxlLiBEb3dubG9hZGluZyBhbmQgaW5zdGFsbGluZy4uLlxuICAgICAgICA8L3NwYW4+XG4gICAgICAgIDxwIHN0eWxlPXtTVFlMRVMucHJvZ3Jlc3NOdW1iZXJ9Pntwcm9ncmVzc30gJTwvcD5cbiAgICAgICAgPHByb2dyZXNzIHZhbHVlPXtwcm9ncmVzc30gbWF4PScxMDAnIHN0eWxlPXtTVFlMRVMucHJvZ3Jlc3NCYXJ9PlxuICAgICAgICAgIHtwcm9ncmVzc30gJVxuICAgICAgICA8L3Byb2dyZXNzPlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyRG93bmxvYWRGaW5pc2hlZCAoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXY+XG4gICAgICAgIFVwZGF0ZSBpbnN0YWxsZWQhIExvYWRpbmcgeW91ciBIYWlrdSFcbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHJlbmRlcklkbGUgKCkge1xuICAgIHJldHVybiA8c3Bhbj5DaGVja2luZyBmb3IgdXBkYXRlcy4uLjwvc3Bhbj5cbiAgfVxuXG4gIHJlbmRlck5vVXBkYXRlcyAoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXY+XG4gICAgICAgIDxwPllvdSBhcmUgdXNpbmcgdGhlIGxhdGVzdCB2ZXJzaW9uPC9wPlxuICAgICAgICA8YnV0dG9uIHN0eWxlPXtTVFlMRVMuYnRufSBvbkNsaWNrPXt0aGlzLmhpZGV9Pk9rPC9idXR0b24+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICByZW5kZXJEb3dubG9hZEZhaWxlZCAoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXY+XG4gICAgICAgIDxwPlRoZXJlIHdhcyBhbiBlcnJvciBkb3dubG9hZGluZyB0aGUgdXBkYXRlLCBpZiB0aGUgcHJvYmxlbSBwZXJzaXN0cyxcbiAgICAgICAgcGxlYXNlIGNvbnRhY3QgSGFpa3Ugc3VwcG9ydC48L3A+XG4gICAgICAgIDxidXR0b24gc3R5bGU9e1NUWUxFUy5idG59IG9uQ2xpY2s9e3RoaXMuaGlkZX0+T2s8L2J1dHRvbj5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHJlbmRlckNoZWNraW5nICgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdj5cbiAgICAgICAgQ2hlY2tpbmcgZm9yIHVwZGF0ZXMuLi5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHJlbmRlciAoKSB7XG4gICAgaWYgKHByb2Nlc3MuZW52LkhBSUtVX1NLSVBfQVVUT1VQREFURSA9PT0gJzEnIHx8ICF0aGlzLnByb3BzLnNob3VsZERpc3BsYXkpIHtcbiAgICAgIHJldHVybiBudWxsXG4gICAgfVxuXG4gICAgbGV0IGNvbnRlbnQgPSB0aGlzW2ByZW5kZXIke3RoaXMuc3RhdGUuc3RhdHVzfWBdKClcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2PlxuICAgICAgICA8ZGl2IHN0eWxlPXtTVFlMRVMuY29udGFpbmVyfT5cbiAgICAgICAgICB7Y29udGVudH1cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgc3R5bGU9e1NUWUxFUy5vdmVybGF5fSAvPlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEF1dG9VcGRhdGVyXG4iXX0=