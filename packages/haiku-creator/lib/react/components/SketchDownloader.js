'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _jsxFileName = 'src/react/components/SketchDownloader.js';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _sketchUtils = require('../../utils/sketchUtils');

var _downloadShared = require('../styles/downloadShared');

var _HaikuHomeDir = require('haiku-serialization/src/utils/HaikuHomeDir');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var statuses = {
  PROMPT_USER: 'PromptUser',
  DOWNLOADING: 'Downloading',
  DOWNLOAD_FAILED: 'DownloadFailed'
};

var SketchDownloader = function (_React$Component) {
  _inherits(SketchDownloader, _React$Component);

  function SketchDownloader(props) {
    _classCallCheck(this, SketchDownloader);

    var _this = _possibleConstructorReturn(this, (SketchDownloader.__proto__ || Object.getPrototypeOf(SketchDownloader)).call(this, props));

    _this.hide = _this.hide.bind(_this);
    _this.download = _this.download.bind(_this);
    _this.updateProgress = _this.updateProgress.bind(_this);
    _this.onFail = _this.onFail.bind(_this);

    _this.state = {
      status: statuses.PROMPT_USER,
      progress: 0,
      shouldCancel: false
    };
    return _this;
  }

  _createClass(SketchDownloader, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps() {
      this.setState({ status: statuses.PROMPT_USER });
    }
  }, {
    key: 'download',
    value: function download(url) {
      var _this2 = this;

      this.setState({ status: statuses.DOWNLOADING });
      this.checkIfShouldShowAgain();

      (0, _sketchUtils.download)(this.updateProgress, function () {
        return _this2.state.shouldCancel;
      }).then(function () {
        _this2.props.onDownloadComplete();
      }).catch(function (error) {
        error.message === 'Download cancelled' ? _this2.hide() : _this2.onFail(error);
      });
    }
  }, {
    key: 'updateProgress',
    value: function updateProgress(progress) {
      this.setState({ progress: progress });
    }
  }, {
    key: 'onFail',
    value: function onFail(error) {
      this.setState({
        status: statuses.DOWNLOAD_FAILED,
        progress: 0,
        shouldCancel: false
      });

      console.error(error);
    }
  }, {
    key: 'hide',
    value: function hide() {
      this.setState({
        status: statuses.IDLE,
        progress: 0,
        shouldCancel: false
      });

      this.checkIfShouldShowAgain();
    }
  }, {
    key: 'checkIfShouldShowAgain',
    value: function checkIfShouldShowAgain() {
      if (this.checkInput.checked) {
        this.props.onSketchDialogFileCreated();
        (0, _HaikuHomeDir.createSketchDialogFile)();
      }
    }
  }, {
    key: 'renderPromptUser',
    value: function renderPromptUser() {
      var _this3 = this;

      return _react2.default.createElement(
        'div',
        {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 78
          },
          __self: this
        },
        _react2.default.createElement(
          'p',
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 79
            },
            __self: this
          },
          'Sketch is required to edit this file. ',
          _react2.default.createElement('br', {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 80
            },
            __self: this
          }),
          'You can install a 30-day trial for free.'
        ),
        _react2.default.createElement(
          'p',
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 83
            },
            __self: this
          },
          'Would you like to download Sketch?'
        ),
        _react2.default.createElement(
          'form',
          { action: '#', style: _downloadShared.DOWNLOAD_STYLES.formInput, __source: {
              fileName: _jsxFileName,
              lineNumber: 85
            },
            __self: this
          },
          _react2.default.createElement('input', {
            type: 'checkbox',
            name: 'not-show-again',
            id: 'not-show-again',
            style: _downloadShared.DOWNLOAD_STYLES.checkInput,
            ref: function ref(input) {
              _this3.checkInput = input;
            }, __source: {
              fileName: _jsxFileName,
              lineNumber: 86
            },
            __self: this
          }),
          _react2.default.createElement(
            'label',
            { htmlFor: 'not-show-again', __source: {
                fileName: _jsxFileName,
                lineNumber: 92
              },
              __self: this
            },
            'Don\'t show this again.'
          )
        ),
        _react2.default.createElement(
          'button',
          { style: _downloadShared.DOWNLOAD_STYLES.btnSecondary, onClick: this.hide, __source: {
              fileName: _jsxFileName,
              lineNumber: 95
            },
            __self: this
          },
          'Not now'
        ),
        _react2.default.createElement(
          'button',
          { style: _downloadShared.DOWNLOAD_STYLES.btn, onClick: this.download, __source: {
              fileName: _jsxFileName,
              lineNumber: 98
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
      var _this4 = this;

      var progress = this.state.progress.toFixed(1);

      return _react2.default.createElement(
        'div',
        {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 109
          },
          __self: this
        },
        _react2.default.createElement(
          'span',
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 110
            },
            __self: this
          },
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
        ),
        _react2.default.createElement(
          'button',
          {
            style: _downloadShared.DOWNLOAD_STYLES.btn,
            onClick: function onClick() {
              return _this4.setState({ shouldCancel: true });
            },
            __source: {
              fileName: _jsxFileName,
              lineNumber: 115
            },
            __self: this
          },
          'Cancel'
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
            lineNumber: 127
          },
          __self: this
        },
        _react2.default.createElement(
          'p',
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 128
            },
            __self: this
          },
          'There was an error downloading Sketch, if the problem persists, please contact Haiku support.'
        ),
        _react2.default.createElement(
          'button',
          { style: _downloadShared.DOWNLOAD_STYLES.btn, onClick: this.hide, __source: {
              fileName: _jsxFileName,
              lineNumber: 132
            },
            __self: this
          },
          'Ok'
        )
      );
    }
  }, {
    key: 'render',
    value: function render() {
      var status = this.state.status;

      if (status === statuses.IDLE) return null;
      var content = this['render' + status]();

      return _react2.default.createElement(
        'div',
        {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 145
          },
          __self: this
        },
        _react2.default.createElement(
          'div',
          { style: _downloadShared.DOWNLOAD_STYLES.container, __source: {
              fileName: _jsxFileName,
              lineNumber: 146
            },
            __self: this
          },
          content
        ),
        _react2.default.createElement('div', { style: _downloadShared.DOWNLOAD_STYLES.overlay, __source: {
            fileName: _jsxFileName,
            lineNumber: 147
          },
          __self: this
        })
      );
    }
  }]);

  return SketchDownloader;
}(_react2.default.Component);

exports.default = SketchDownloader;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9yZWFjdC9jb21wb25lbnRzL1NrZXRjaERvd25sb2FkZXIuanMiXSwibmFtZXMiOlsic3RhdHVzZXMiLCJQUk9NUFRfVVNFUiIsIkRPV05MT0FESU5HIiwiRE9XTkxPQURfRkFJTEVEIiwiU2tldGNoRG93bmxvYWRlciIsInByb3BzIiwiaGlkZSIsImJpbmQiLCJkb3dubG9hZCIsInVwZGF0ZVByb2dyZXNzIiwib25GYWlsIiwic3RhdGUiLCJzdGF0dXMiLCJwcm9ncmVzcyIsInNob3VsZENhbmNlbCIsInNldFN0YXRlIiwidXJsIiwiY2hlY2tJZlNob3VsZFNob3dBZ2FpbiIsInRoZW4iLCJvbkRvd25sb2FkQ29tcGxldGUiLCJjYXRjaCIsImVycm9yIiwibWVzc2FnZSIsImNvbnNvbGUiLCJJRExFIiwiY2hlY2tJbnB1dCIsImNoZWNrZWQiLCJvblNrZXRjaERpYWxvZ0ZpbGVDcmVhdGVkIiwiZm9ybUlucHV0IiwiaW5wdXQiLCJidG5TZWNvbmRhcnkiLCJidG4iLCJ0b0ZpeGVkIiwicHJvZ3Jlc3NOdW1iZXIiLCJwcm9ncmVzc0JhciIsImNvbnRlbnQiLCJjb250YWluZXIiLCJvdmVybGF5IiwiQ29tcG9uZW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTs7OztBQUNBOztBQUNBOztBQUNBOzs7Ozs7Ozs7O0FBRUEsSUFBSUEsV0FBVztBQUNiQyxlQUFhLFlBREE7QUFFYkMsZUFBYSxhQUZBO0FBR2JDLG1CQUFpQjtBQUhKLENBQWY7O0lBTU1DLGdCOzs7QUFDSiw0QkFBYUMsS0FBYixFQUFvQjtBQUFBOztBQUFBLG9JQUNaQSxLQURZOztBQUdsQixVQUFLQyxJQUFMLEdBQVksTUFBS0EsSUFBTCxDQUFVQyxJQUFWLE9BQVo7QUFDQSxVQUFLQyxRQUFMLEdBQWdCLE1BQUtBLFFBQUwsQ0FBY0QsSUFBZCxPQUFoQjtBQUNBLFVBQUtFLGNBQUwsR0FBc0IsTUFBS0EsY0FBTCxDQUFvQkYsSUFBcEIsT0FBdEI7QUFDQSxVQUFL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Q0U7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0U7QUFBQTtBQUFBLFlBQUssT0FBTyxnQ0FBT3dCLFNBQW5CO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUErQkQ7QUFBL0IsU0FERjtBQUVFLCtDQUFLLE9BQU8sZ0NBQU9FLE9BQW5CO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUZGLE9BREY7QUFNRDs7OztFQTFJNEIsZ0JBQU1DLFM7O2tCQTZJdEJsQyxnQiIsImZpbGUiOiJTa2V0Y2hEb3dubG9hZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHtkb3dubG9hZH0gZnJvbSAnLi4vLi4vdXRpbHMvc2tldGNoVXRpbHMnXG5pbXBvcnQge0RPV05MT0FEX1NUWUxFUyBhcyBTVFlMRVN9IGZyb20gJy4uL3N0eWxlcy9kb3dubG9hZFNoYXJlZCdcbmltcG9ydCB7Y3JlYXRlU2tldGNoRGlhbG9nRmlsZX0gZnJvbSAnaGFpa3Utc2VyaWFsaXphdGlvbi9zcmMvdXRpbHMvSGFpa3VIb21lRGlyJ1xuXG5sZXQgc3RhdHVzZXMgPSB7XG4gIFBST01QVF9VU0VSOiAnUHJvbXB0VXNlcicsXG4gIERPV05MT0FESU5HOiAnRG93bmxvYWRpbmcnLFxuICBET1dOTE9BRF9GQUlMRUQ6ICdEb3dubG9hZEZhaWxlZCdcbn1cblxuY2xhc3MgU2tldGNoRG93bmxvYWRlciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yIChwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKVxuXG4gICAgdGhpcy5oaWRlID0gdGhpcy5oaWRlLmJpbmQodGhpcylcbiAgICB0aGlzLmRvd25sb2FkID0gdGhpcy5kb3dubG9hZC5iaW5kKHRoaXMpXG4gICAgdGhpcy51cGRhdGVQcm9ncmVzcyA9IHRoaXMudXBkYXRlUHJvZ3Jlc3MuYmluZCh0aGlzKVxuICAgIHRoaXMub25GYWlsID0gdGhpcy5vbkZhaWwuYmluZCh0aGlzKVxuXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIHN0YXR1czogc3RhdHVzZXMuUFJPTVBUX1VTRVIsXG4gICAgICBwcm9ncmVzczogMCxcbiAgICAgIHNob3VsZENhbmNlbDogZmFsc2VcbiAgICB9XG4gIH1cblxuICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzICgpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtzdGF0dXM6IHN0YXR1c2VzLlBST01QVF9VU0VSfSlcbiAgfVxuXG4gIGRvd25sb2FkICh1cmwpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtzdGF0dXM6IHN0YXR1c2VzLkRPV05MT0FESU5HfSlcbiAgICB0aGlzLmNoZWNrSWZTaG91bGRTaG93QWdhaW4oKVxuXG4gICAgZG93bmxvYWQodGhpcy51cGRhdGVQcm9ncmVzcywgKCkgPT4gdGhpcy5zdGF0ZS5zaG91bGRDYW5jZWwpXG4gICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgIHRoaXMucHJvcHMub25Eb3dubG9hZENvbXBsZXRlKClcbiAgICAgIH0pXG4gICAgICAuY2F0Y2goZXJyb3IgPT4ge1xuICAgICAgICBlcnJvci5tZXNzYWdlID09PSAnRG93bmxvYWQgY2FuY2VsbGVkJyA/IHRoaXMuaGlkZSgpIDogdGhpcy5vbkZhaWwoZXJyb3IpXG4gICAgICB9KVxuICB9XG5cbiAgdXBkYXRlUHJvZ3Jlc3MgKHByb2dyZXNzKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7cHJvZ3Jlc3N9KVxuICB9XG5cbiAgb25GYWlsIChlcnJvcikge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgc3RhdHVzOiBzdGF0dXNlcy5ET1dOTE9BRF9GQUlMRUQsXG4gICAgICBwcm9ncmVzczogMCxcbiAgICAgIHNob3VsZENhbmNlbDogZmFsc2VcbiAgICB9KVxuXG4gICAgY29uc29sZS5lcnJvcihlcnJvcilcbiAgfVxuXG4gIGhpZGUgKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgc3RhdHVzOiBzdGF0dXNlcy5JRExFLFxuICAgICAgcHJvZ3Jlc3M6IDAsXG4gICAgICBzaG91bGRDYW5jZWw6IGZhbHNlXG4gICAgfSlcblxuICAgIHRoaXMuY2hlY2tJZlNob3VsZFNob3dBZ2FpbigpXG4gIH1cblxuICBjaGVja0lmU2hvdWxkU2hvd0FnYWluICgpIHtcbiAgICBpZiAodGhpcy5jaGVja0lucHV0LmNoZWNrZWQpIHtcbiAgICAgIHRoaXMucHJvcHMub25Ta2V0Y2hEaWFsb2dGaWxlQ3JlYXRlZCgpXG4gICAgICBjcmVhdGVTa2V0Y2hEaWFsb2dGaWxlKClcbiAgICB9XG4gIH1cblxuICByZW5kZXJQcm9tcHRVc2VyICgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdj5cbiAgICAgICAgPHA+XG4gICAgICAgICAgU2tldGNoIGlzIHJlcXVpcmVkIHRvIGVkaXQgdGhpcyBmaWxlLiA8YnIgLz5cbiAgICAgICAgICBZb3UgY2FuIGluc3RhbGwgYSAzMC1kYXkgdHJpYWwgZm9yIGZyZWUuXG4gICAgICAgIDwvcD5cbiAgICAgICAgPHA+V291bGQgeW91IGxpa2UgdG8gZG93bmxvYWQgU2tldGNoPzwvcD5cblxuICAgICAgICA8Zm9ybSBhY3Rpb249JyMnIHN0eWxlPXtTVFlMRVMuZm9ybUlucHV0fT5cbiAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgIHR5cGU9J2NoZWNrYm94J1xuICAgICAgICAgICAgbmFtZT0nbm90LXNob3ctYWdhaW4nXG4gICAgICAgICAgICBpZD0nbm90LXNob3ctYWdhaW4nXG4gICAgICAgICAgICBzdHlsZT17U1RZTEVTLmNoZWNrSW5wdXR9XG4gICAgICAgICAgICByZWY9eyhpbnB1dCkgPT4geyB0aGlzLmNoZWNrSW5wdXQgPSBpbnB1dCB9fSAvPlxuICAgICAgICAgIDxsYWJlbCBodG1sRm9yPSdub3Qtc2hvdy1hZ2Fpbic+RG9uJ3Qgc2hvdyB0aGlzIGFnYWluLjwvbGFiZWw+XG4gICAgICAgIDwvZm9ybT5cblxuICAgICAgICA8YnV0dG9uIHN0eWxlPXtTVFlMRVMuYnRuU2Vjb25kYXJ5fSBvbkNsaWNrPXt0aGlzLmhpZGV9PlxuICAgICAgICAgIE5vdCBub3dcbiAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDxidXR0b24gc3R5bGU9e1NUWUxFUy5idG59IG9uQ2xpY2s9e3RoaXMuZG93bmxvYWR9PlxuICAgICAgICAgIFllc1xuICAgICAgICA8L2J1dHRvbj5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHJlbmRlckRvd25sb2FkaW5nICgpIHtcbiAgICBjb25zdCBwcm9ncmVzcyA9IHRoaXMuc3RhdGUucHJvZ3Jlc3MudG9GaXhlZCgxKVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXY+XG4gICAgICAgIDxzcGFuPkRvd25sb2FkaW5nIGFuZCBpbnN0YWxsaW5nLi4uPC9zcGFuPlxuICAgICAgICA8cCBzdHlsZT17U1RZTEVTLnByb2dyZXNzTnVtYmVyfT57cHJvZ3Jlc3N9ICU8L3A+XG4gICAgICAgIDxwcm9ncmVzcyB2YWx1ZT17cHJvZ3Jlc3N9IG1heD0nMTAwJyBzdHlsZT17U1RZTEVTLnByb2dyZXNzQmFyfT5cbiAgICAgICAgICB7cHJvZ3Jlc3N9ICVcbiAgICAgICAgPC9wcm9ncmVzcz5cbiAgICAgICAgPGJ1dHRvblxuICAgICAgICAgIHN0eWxlPXtTVFlMRVMuYnRufVxuICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHRoaXMuc2V0U3RhdGUoe3Nob3VsZENhbmNlbDogdHJ1ZX0pfVxuICAgICAgICA+XG4gICAgICAgICAgQ2FuY2VsXG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyRG93bmxvYWRGYWlsZWQgKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2PlxuICAgICAgICA8cD5cbiAgICAgICAgICBUaGVyZSB3YXMgYW4gZXJyb3IgZG93bmxvYWRpbmcgU2tldGNoLCBpZiB0aGUgcHJvYmxlbSBwZXJzaXN0cywgcGxlYXNlXG4gICAgICAgICAgY29udGFjdCBIYWlrdSBzdXBwb3J0LlxuICAgICAgICA8L3A+XG4gICAgICAgIDxidXR0b24gc3R5bGU9e1NUWUxFUy5idG59IG9uQ2xpY2s9e3RoaXMuaGlkZX0+XG4gICAgICAgICAgT2tcbiAgICAgICAgPC9idXR0b24+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICByZW5kZXIgKCkge1xuICAgIGNvbnN0IHtzdGF0dXN9ID0gdGhpcy5zdGF0ZVxuICAgIGlmIChzdGF0dXMgPT09IHN0YXR1c2VzLklETEUpIHJldHVybiBudWxsXG4gICAgbGV0IGNvbnRlbnQgPSB0aGlzW2ByZW5kZXIke3N0YXR1c31gXSgpXG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdj5cbiAgICAgICAgPGRpdiBzdHlsZT17U1RZTEVTLmNvbnRhaW5lcn0+e2NvbnRlbnR9PC9kaXY+XG4gICAgICAgIDxkaXYgc3R5bGU9e1NUWUxFUy5vdmVybGF5fSAvPlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFNrZXRjaERvd25sb2FkZXJcbiJdfQ==