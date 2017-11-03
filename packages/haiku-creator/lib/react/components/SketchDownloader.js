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
      this.dismiss();

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

      this.dismiss();
    }
  }, {
    key: 'dismiss',
    value: function dismiss() {
      if (this.checkInput.checked) {
        (0, _HaikuHomeDir.createSketchDialogFile)();
      }

      this.props.onDismiss(!this.checkInput.checked);
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
            lineNumber: 79
          },
          __self: this
        },
        _react2.default.createElement(
          'p',
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 80
            },
            __self: this
          },
          'Sketch is required to edit this file. ',
          _react2.default.createElement('br', {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 81
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
              lineNumber: 84
            },
            __self: this
          },
          'Would you like to download Sketch?'
        ),
        _react2.default.createElement(
          'form',
          { action: '#', style: _downloadShared.DOWNLOAD_STYLES.formInput, __source: {
              fileName: _jsxFileName,
              lineNumber: 86
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
              lineNumber: 87
            },
            __self: this
          }),
          _react2.default.createElement(
            'label',
            { htmlFor: 'not-show-again', __source: {
                fileName: _jsxFileName,
                lineNumber: 93
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
              lineNumber: 96
            },
            __self: this
          },
          'Not now'
        ),
        _react2.default.createElement(
          'button',
          { style: _downloadShared.DOWNLOAD_STYLES.btn, onClick: this.download, __source: {
              fileName: _jsxFileName,
              lineNumber: 99
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
            lineNumber: 110
          },
          __self: this
        },
        _react2.default.createElement(
          'span',
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 111
            },
            __self: this
          },
          'Downloading and installing...'
        ),
        _react2.default.createElement(
          'p',
          { style: _downloadShared.DOWNLOAD_STYLES.progressNumber, __source: {
              fileName: _jsxFileName,
              lineNumber: 112
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
              lineNumber: 113
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
              lineNumber: 116
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
            lineNumber: 128
          },
          __self: this
        },
        _react2.default.createElement(
          'p',
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 129
            },
            __self: this
          },
          'There was an error downloading Sketch, if the problem persists, please contact Haiku support.'
        ),
        _react2.default.createElement(
          'button',
          { style: _downloadShared.DOWNLOAD_STYLES.btn, onClick: this.hide, __source: {
              fileName: _jsxFileName,
              lineNumber: 133
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
            lineNumber: 146
          },
          __self: this
        },
        _react2.default.createElement(
          'div',
          { style: _downloadShared.DOWNLOAD_STYLES.container, __source: {
              fileName: _jsxFileName,
              lineNumber: 147
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

  return SketchDownloader;
}(_react2.default.Component);

exports.default = SketchDownloader;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9yZWFjdC9jb21wb25lbnRzL1NrZXRjaERvd25sb2FkZXIuanMiXSwibmFtZXMiOlsic3RhdHVzZXMiLCJQUk9NUFRfVVNFUiIsIkRPV05MT0FESU5HIiwiRE9XTkxPQURfRkFJTEVEIiwiU2tldGNoRG93bmxvYWRlciIsInByb3BzIiwiaGlkZSIsImJpbmQiLCJkb3dubG9hZCIsInVwZGF0ZVByb2dyZXNzIiwib25GYWlsIiwic3RhdGUiLCJzdGF0dXMiLCJwcm9ncmVzcyIsInNob3VsZENhbmNlbCIsInNldFN0YXRlIiwidXJsIiwiZGlzbWlzcyIsInRoZW4iLCJvbkRvd25sb2FkQ29tcGxldGUiLCJjYXRjaCIsImVycm9yIiwibWVzc2FnZSIsImNvbnNvbGUiLCJJRExFIiwiY2hlY2tJbnB1dCIsImNoZWNrZWQiLCJvbkRpc21pc3MiLCJmb3JtSW5wdXQiLCJpbnB1dCIsImJ0blNlY29uZGFyeSIsImJ0biIsInRvRml4ZWQiLCJwcm9ncmVzc051bWJlciIsInByb2dyZXNzQmFyIiwiY29udGVudCIsImNvbnRhaW5lciIsIm92ZXJsYXkiLCJDb21wb25lbnQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7QUFFQSxJQUFJQSxXQUFXO0FBQ2JDLGVBQWEsWUFEQTtBQUViQyxlQUFhLGFBRkE7QUFHYkMsbUJBQWlCO0FBSEosQ0FBZjs7SUFNTUMsZ0I7OztBQUNKLDRCQUFhQyxLQUFiLEVBQW9CO0FBQUE7O0FBQUEsb0lBQ1pBLEtBRFk7O0FBR2xCLFVBQUtDLElBQUwsR0FBWSxNQUFLQSxJQUFMLENBQVVDLElBQVYsT0FBWjtBQUNBLFVBQUtDLFFBQUwsR0FBZ0IsTUFBS0EsUUFBTCxDQUFjRCxJQUFkLE9BQWhCO0FBQ0EsVUFBS0UsY0FBTCxHQUFzQixNQUFLQSxjQUFMLENBQW9CRixJQUFwQixPQUF0QjtBQUNBLFVBQUtHLE1BQUwsR0FBYyxNQUFLQSxNQUFMLENBQVlILElB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Q0U7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0U7QUFBQTtBQUFBLFlBQUssT0FBTyxnQ0FBT3dCLFNBQW5CO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUErQkQ7QUFBL0IsU0FERjtBQUVFLCtDQUFLLE9BQU8sZ0NBQU9FLE9BQW5CO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUZGLE9BREY7QUFNRDs7OztFQTNJNEIsZ0JBQU1DLFM7O2tCQThJdEJsQyxnQiIsImZpbGUiOiJTa2V0Y2hEb3dubG9hZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHtkb3dubG9hZH0gZnJvbSAnLi4vLi4vdXRpbHMvc2tldGNoVXRpbHMnXG5pbXBvcnQge0RPV05MT0FEX1NUWUxFUyBhcyBTVFlMRVN9IGZyb20gJy4uL3N0eWxlcy9kb3dubG9hZFNoYXJlZCdcbmltcG9ydCB7Y3JlYXRlU2tldGNoRGlhbG9nRmlsZX0gZnJvbSAnaGFpa3Utc2VyaWFsaXphdGlvbi9zcmMvdXRpbHMvSGFpa3VIb21lRGlyJ1xuXG5sZXQgc3RhdHVzZXMgPSB7XG4gIFBST01QVF9VU0VSOiAnUHJvbXB0VXNlcicsXG4gIERPV05MT0FESU5HOiAnRG93bmxvYWRpbmcnLFxuICBET1dOTE9BRF9GQUlMRUQ6ICdEb3dubG9hZEZhaWxlZCdcbn1cblxuY2xhc3MgU2tldGNoRG93bmxvYWRlciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yIChwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKVxuXG4gICAgdGhpcy5oaWRlID0gdGhpcy5oaWRlLmJpbmQodGhpcylcbiAgICB0aGlzLmRvd25sb2FkID0gdGhpcy5kb3dubG9hZC5iaW5kKHRoaXMpXG4gICAgdGhpcy51cGRhdGVQcm9ncmVzcyA9IHRoaXMudXBkYXRlUHJvZ3Jlc3MuYmluZCh0aGlzKVxuICAgIHRoaXMub25GYWlsID0gdGhpcy5vbkZhaWwuYmluZCh0aGlzKVxuXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIHN0YXR1czogc3RhdHVzZXMuUFJPTVBUX1VTRVIsXG4gICAgICBwcm9ncmVzczogMCxcbiAgICAgIHNob3VsZENhbmNlbDogZmFsc2VcbiAgICB9XG4gIH1cblxuICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzICgpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtzdGF0dXM6IHN0YXR1c2VzLlBST01QVF9VU0VSfSlcbiAgfVxuXG4gIGRvd25sb2FkICh1cmwpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtzdGF0dXM6IHN0YXR1c2VzLkRPV05MT0FESU5HfSlcbiAgICB0aGlzLmRpc21pc3MoKVxuXG4gICAgZG93bmxvYWQodGhpcy51cGRhdGVQcm9ncmVzcywgKCkgPT4gdGhpcy5zdGF0ZS5zaG91bGRDYW5jZWwpXG4gICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgIHRoaXMucHJvcHMub25Eb3dubG9hZENvbXBsZXRlKClcbiAgICAgIH0pXG4gICAgICAuY2F0Y2goZXJyb3IgPT4ge1xuICAgICAgICBlcnJvci5tZXNzYWdlID09PSAnRG93bmxvYWQgY2FuY2VsbGVkJyA/IHRoaXMuaGlkZSgpIDogdGhpcy5vbkZhaWwoZXJyb3IpXG4gICAgICB9KVxuICB9XG5cbiAgdXBkYXRlUHJvZ3Jlc3MgKHByb2dyZXNzKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7cHJvZ3Jlc3N9KVxuICB9XG5cbiAgb25GYWlsIChlcnJvcikge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgc3RhdHVzOiBzdGF0dXNlcy5ET1dOTE9BRF9GQUlMRUQsXG4gICAgICBwcm9ncmVzczogMCxcbiAgICAgIHNob3VsZENhbmNlbDogZmFsc2VcbiAgICB9KVxuXG4gICAgY29uc29sZS5lcnJvcihlcnJvcilcbiAgfVxuXG4gIGhpZGUgKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgc3RhdHVzOiBzdGF0dXNlcy5JRExFLFxuICAgICAgcHJvZ3Jlc3M6IDAsXG4gICAgICBzaG91bGRDYW5jZWw6IGZhbHNlXG4gICAgfSlcblxuICAgIHRoaXMuZGlzbWlzcygpXG4gIH1cblxuICBkaXNtaXNzICgpIHtcbiAgICBpZiAodGhpcy5jaGVja0lucHV0LmNoZWNrZWQpIHtcbiAgICAgIGNyZWF0ZVNrZXRjaERpYWxvZ0ZpbGUoKVxuICAgIH1cblxuICAgIHRoaXMucHJvcHMub25EaXNtaXNzKCF0aGlzLmNoZWNrSW5wdXQuY2hlY2tlZClcbiAgfVxuXG4gIHJlbmRlclByb21wdFVzZXIgKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2PlxuICAgICAgICA8cD5cbiAgICAgICAgICBTa2V0Y2ggaXMgcmVxdWlyZWQgdG8gZWRpdCB0aGlzIGZpbGUuIDxiciAvPlxuICAgICAgICAgIFlvdSBjYW4gaW5zdGFsbCBhIDMwLWRheSB0cmlhbCBmb3IgZnJlZS5cbiAgICAgICAgPC9wPlxuICAgICAgICA8cD5Xb3VsZCB5b3UgbGlrZSB0byBkb3dubG9hZCBTa2V0Y2g/PC9wPlxuXG4gICAgICAgIDxmb3JtIGFjdGlvbj0nIycgc3R5bGU9e1NUWUxFUy5mb3JtSW5wdXR9PlxuICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgdHlwZT0nY2hlY2tib3gnXG4gICAgICAgICAgICBuYW1lPSdub3Qtc2hvdy1hZ2FpbidcbiAgICAgICAgICAgIGlkPSdub3Qtc2hvdy1hZ2FpbidcbiAgICAgICAgICAgIHN0eWxlPXtTVFlMRVMuY2hlY2tJbnB1dH1cbiAgICAgICAgICAgIHJlZj17KGlucHV0KSA9PiB7IHRoaXMuY2hlY2tJbnB1dCA9IGlucHV0IH19IC8+XG4gICAgICAgICAgPGxhYmVsIGh0bWxGb3I9J25vdC1zaG93LWFnYWluJz5Eb24ndCBzaG93IHRoaXMgYWdhaW4uPC9sYWJlbD5cbiAgICAgICAgPC9mb3JtPlxuXG4gICAgICAgIDxidXR0b24gc3R5bGU9e1NUWUxFUy5idG5TZWNvbmRhcnl9IG9uQ2xpY2s9e3RoaXMuaGlkZX0+XG4gICAgICAgICAgTm90IG5vd1xuICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPGJ1dHRvbiBzdHlsZT17U1RZTEVTLmJ0bn0gb25DbGljaz17dGhpcy5kb3dubG9hZH0+XG4gICAgICAgICAgWWVzXG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyRG93bmxvYWRpbmcgKCkge1xuICAgIGNvbnN0IHByb2dyZXNzID0gdGhpcy5zdGF0ZS5wcm9ncmVzcy50b0ZpeGVkKDEpXG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdj5cbiAgICAgICAgPHNwYW4+RG93bmxvYWRpbmcgYW5kIGluc3RhbGxpbmcuLi48L3NwYW4+XG4gICAgICAgIDxwIHN0eWxlPXtTVFlMRVMucHJvZ3Jlc3NOdW1iZXJ9Pntwcm9ncmVzc30gJTwvcD5cbiAgICAgICAgPHByb2dyZXNzIHZhbHVlPXtwcm9ncmVzc30gbWF4PScxMDAnIHN0eWxlPXtTVFlMRVMucHJvZ3Jlc3NCYXJ9PlxuICAgICAgICAgIHtwcm9ncmVzc30gJVxuICAgICAgICA8L3Byb2dyZXNzPlxuICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgc3R5bGU9e1NUWUxFUy5idG59XG4gICAgICAgICAgb25DbGljaz17KCkgPT4gdGhpcy5zZXRTdGF0ZSh7c2hvdWxkQ2FuY2VsOiB0cnVlfSl9XG4gICAgICAgID5cbiAgICAgICAgICBDYW5jZWxcbiAgICAgICAgPC9idXR0b24+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICByZW5kZXJEb3dubG9hZEZhaWxlZCAoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXY+XG4gICAgICAgIDxwPlxuICAgICAgICAgIFRoZXJlIHdhcyBhbiBlcnJvciBkb3dubG9hZGluZyBTa2V0Y2gsIGlmIHRoZSBwcm9ibGVtIHBlcnNpc3RzLCBwbGVhc2VcbiAgICAgICAgICBjb250YWN0IEhhaWt1IHN1cHBvcnQuXG4gICAgICAgIDwvcD5cbiAgICAgICAgPGJ1dHRvbiBzdHlsZT17U1RZTEVTLmJ0bn0gb25DbGljaz17dGhpcy5oaWRlfT5cbiAgICAgICAgICBPa1xuICAgICAgICA8L2J1dHRvbj5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHJlbmRlciAoKSB7XG4gICAgY29uc3Qge3N0YXR1c30gPSB0aGlzLnN0YXRlXG4gICAgaWYgKHN0YXR1cyA9PT0gc3RhdHVzZXMuSURMRSkgcmV0dXJuIG51bGxcbiAgICBsZXQgY29udGVudCA9IHRoaXNbYHJlbmRlciR7c3RhdHVzfWBdKClcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2PlxuICAgICAgICA8ZGl2IHN0eWxlPXtTVFlMRVMuY29udGFpbmVyfT57Y29udGVudH08L2Rpdj5cbiAgICAgICAgPGRpdiBzdHlsZT17U1RZTEVTLm92ZXJsYXl9IC8+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU2tldGNoRG93bmxvYWRlclxuIl19