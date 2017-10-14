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
    }
  }, {
    key: 'renderPromptUser',
    value: function renderPromptUser() {
      return _react2.default.createElement(
        'div',
        {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 67
          },
          __self: this
        },
        _react2.default.createElement(
          'p',
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 68
            },
            __self: this
          },
          'Sketch is required to edit this file. ',
          _react2.default.createElement('br', {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 69
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
              lineNumber: 72
            },
            __self: this
          },
          'Would you like to download Sketch?'
        ),
        _react2.default.createElement(
          'button',
          { style: _downloadShared.DOWNLOAD_STYLES.btnSecondary, onClick: this.hide, __source: {
              fileName: _jsxFileName,
              lineNumber: 73
            },
            __self: this
          },
          'Not now'
        ),
        _react2.default.createElement(
          'button',
          { style: _downloadShared.DOWNLOAD_STYLES.btn, onClick: this.download, __source: {
              fileName: _jsxFileName,
              lineNumber: 76
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
      var _this3 = this;

      var progress = this.state.progress.toFixed(1);

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
          'span',
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 88
            },
            __self: this
          },
          'Downloading and installing...'
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
        ),
        _react2.default.createElement(
          'button',
          {
            style: _downloadShared.DOWNLOAD_STYLES.btn,
            onClick: function onClick() {
              return _this3.setState({ shouldCancel: true });
            },
            __source: {
              fileName: _jsxFileName,
              lineNumber: 93
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
            lineNumber: 105
          },
          __self: this
        },
        _react2.default.createElement(
          'p',
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 106
            },
            __self: this
          },
          'There was an error downloading Sketch, if the problem persists, please contact Haiku support.'
        ),
        _react2.default.createElement(
          'button',
          { style: _downloadShared.DOWNLOAD_STYLES.btn, onClick: this.hide, __source: {
              fileName: _jsxFileName,
              lineNumber: 110
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
            lineNumber: 123
          },
          __self: this
        },
        _react2.default.createElement(
          'div',
          { style: _downloadShared.DOWNLOAD_STYLES.container, __source: {
              fileName: _jsxFileName,
              lineNumber: 124
            },
            __self: this
          },
          content
        ),
        _react2.default.createElement('div', { style: _downloadShared.DOWNLOAD_STYLES.overlay, __source: {
            fileName: _jsxFileName,
            lineNumber: 125
          },
          __self: this
        })
      );
    }
  }]);

  return SketchDownloader;
}(_react2.default.Component);

exports.default = SketchDownloader;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9yZWFjdC9jb21wb25lbnRzL1NrZXRjaERvd25sb2FkZXIuanMiXSwibmFtZXMiOlsic3RhdHVzZXMiLCJQUk9NUFRfVVNFUiIsIkRPV05MT0FESU5HIiwiRE9XTkxPQURfRkFJTEVEIiwiU2tldGNoRG93bmxvYWRlciIsInByb3BzIiwiaGlkZSIsImJpbmQiLCJkb3dubG9hZCIsInVwZGF0ZVByb2dyZXNzIiwib25GYWlsIiwic3RhdGUiLCJzdGF0dXMiLCJwcm9ncmVzcyIsInNob3VsZENhbmNlbCIsInNldFN0YXRlIiwidXJsIiwidGhlbiIsIm9uRG93bmxvYWRDb21wbGV0ZSIsImNhdGNoIiwiZXJyb3IiLCJtZXNzYWdlIiwiY29uc29sZSIsIklETEUiLCJidG5TZWNvbmRhcnkiLCJidG4iLCJ0b0ZpeGVkIiwicHJvZ3Jlc3NOdW1iZXIiLCJwcm9ncmVzc0JhciIsImNvbnRlbnQiLCJjb250YWluZXIiLCJvdmVybGF5IiwiQ29tcG9uZW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTs7OztBQUNBOztBQUNBOzs7Ozs7Ozs7O0FBRUEsSUFBSUEsV0FBVztBQUNiQyxlQUFhLFlBREE7QUFFYkMsZUFBYSxhQUZBO0FBR2JDLG1CQUFpQjtBQUhKLENBQWY7O0lBTU1DLGdCOzs7QUFDSiw0QkFBWUMsS0FBWixFQUFtQjtBQUFBOztBQUFBLG9JQUNYQSxLQURXOztBQUdqQixVQUFLQyxJQUFMLEdBQVksTUFBS0EsSUFBTCxDQUFVQyxJQUFWLE9BQVo7QUFDQSxVQUFLQyxRQUFMLEdBQWdCLE1BQUtBLFFBQUwsQ0FBY0QsSUFBZCxPQUFoQjtBQUNBLFVBQUtFLGNBQUwsR0FBc0IsTUFBS0EsY0FBTCxDQUFvQkYsSUFBcEIsT0FBdEI7QUFDQSxVQUFLRyxNQUFMLEdBQWMsTUFBS0EsTUFBTCxDQUFZSCxJQUFaLE9BQWQ7O0FBRUEsVUFBS0ksS0FBTCxHQUFhO0FBQ1hDLGNBQVFaLFNBQVNDLFdBRE47QUFFWFksZ0JBQVUsQ0FGQztB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QTtBQUNFO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsU0FERjtBQUtFO0FBQUE7QUFBQSxZQUFRLE9BQU8sZ0NBQU9XLEdBQXRCLEVBQTJCLFNBQVMsS0FBS25CLElBQXpDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFMRixPQURGO0FBV0Q7Ozs2QkFFUTtBQUFBLFVBQ0FNLE1BREEsR0FDVSxLQUFLRCxLQURmLENBQ0FDLE1BREE7O0FBRVAsVUFBSUEsV0FBV1osU0FBU3VCLElBQXhCLEVBQThCLE9BQU8sSUFBUDtBQUM5QixVQUFJTSxVQUFVLGdCQUFjakIsTUFBZCxHQUFkOztBQUVBLGFBQ0U7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0U7QUFBQTtBQUFBLFlBQUssT0FBTyxnQ0FBT2tCLFNBQW5CO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUErQkQ7QUFBL0IsU0FERjtBQUVFLCtDQUFLLE9BQU8sZ0NBQU9FLE9BQW5CO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUZGLE9BREY7QUFNRDs7OztFQXJINEIsZ0JBQU1DLFM7O2tCQXdIdEI1QixnQiIsImZpbGUiOiJTa2V0Y2hEb3dubG9hZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHtkb3dubG9hZH0gZnJvbSAnLi4vLi4vdXRpbHMvc2tldGNoVXRpbHMnXG5pbXBvcnQge0RPV05MT0FEX1NUWUxFUyBhcyBTVFlMRVN9IGZyb20gJy4uL3N0eWxlcy9kb3dubG9hZFNoYXJlZCdcblxubGV0IHN0YXR1c2VzID0ge1xuICBQUk9NUFRfVVNFUjogJ1Byb21wdFVzZXInLFxuICBET1dOTE9BRElORzogJ0Rvd25sb2FkaW5nJyxcbiAgRE9XTkxPQURfRkFJTEVEOiAnRG93bmxvYWRGYWlsZWQnXG59XG5cbmNsYXNzIFNrZXRjaERvd25sb2FkZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKVxuXG4gICAgdGhpcy5oaWRlID0gdGhpcy5oaWRlLmJpbmQodGhpcylcbiAgICB0aGlzLmRvd25sb2FkID0gdGhpcy5kb3dubG9hZC5iaW5kKHRoaXMpXG4gICAgdGhpcy51cGRhdGVQcm9ncmVzcyA9IHRoaXMudXBkYXRlUHJvZ3Jlc3MuYmluZCh0aGlzKVxuICAgIHRoaXMub25GYWlsID0gdGhpcy5vbkZhaWwuYmluZCh0aGlzKVxuXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIHN0YXR1czogc3RhdHVzZXMuUFJPTVBUX1VTRVIsXG4gICAgICBwcm9ncmVzczogMCxcbiAgICAgIHNob3VsZENhbmNlbDogZmFsc2VcbiAgICB9XG4gIH1cblxuICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzICgpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtzdGF0dXM6IHN0YXR1c2VzLlBST01QVF9VU0VSfSlcbiAgfVxuXG4gIGRvd25sb2FkKHVybCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe3N0YXR1czogc3RhdHVzZXMuRE9XTkxPQURJTkd9KVxuXG4gICAgZG93bmxvYWQodGhpcy51cGRhdGVQcm9ncmVzcywgKCkgPT4gdGhpcy5zdGF0ZS5zaG91bGRDYW5jZWwpXG4gICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgIHRoaXMucHJvcHMub25Eb3dubG9hZENvbXBsZXRlKClcbiAgICAgIH0pXG4gICAgICAuY2F0Y2goZXJyb3IgPT4ge1xuICAgICAgICBlcnJvci5tZXNzYWdlID09PSAnRG93bmxvYWQgY2FuY2VsbGVkJyA/IHRoaXMuaGlkZSgpIDogdGhpcy5vbkZhaWwoZXJyb3IpXG4gICAgICB9KVxuICB9XG5cbiAgdXBkYXRlUHJvZ3Jlc3MocHJvZ3Jlc3MpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtwcm9ncmVzc30pXG4gIH1cblxuICBvbkZhaWwoZXJyb3IpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHN0YXR1czogc3RhdHVzZXMuRE9XTkxPQURfRkFJTEVELFxuICAgICAgcHJvZ3Jlc3M6IDAsXG4gICAgICBzaG91bGRDYW5jZWw6IGZhbHNlXG4gICAgfSlcblxuICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpXG4gIH1cblxuICBoaWRlKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgc3RhdHVzOiBzdGF0dXNlcy5JRExFLFxuICAgICAgcHJvZ3Jlc3M6IDAsXG4gICAgICBzaG91bGRDYW5jZWw6IGZhbHNlXG4gICAgfSlcbiAgfVxuXG4gIHJlbmRlclByb21wdFVzZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXY+XG4gICAgICAgIDxwPlxuICAgICAgICAgIFNrZXRjaCBpcyByZXF1aXJlZCB0byBlZGl0IHRoaXMgZmlsZS4gPGJyIC8+XG4gICAgICAgICAgWW91IGNhbiBpbnN0YWxsIGEgMzAtZGF5IHRyaWFsIGZvciBmcmVlLlxuICAgICAgICA8L3A+XG4gICAgICAgIDxwPldvdWxkIHlvdSBsaWtlIHRvIGRvd25sb2FkIFNrZXRjaD88L3A+XG4gICAgICAgIDxidXR0b24gc3R5bGU9e1NUWUxFUy5idG5TZWNvbmRhcnl9IG9uQ2xpY2s9e3RoaXMuaGlkZX0+XG4gICAgICAgICAgTm90IG5vd1xuICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPGJ1dHRvbiBzdHlsZT17U1RZTEVTLmJ0bn0gb25DbGljaz17dGhpcy5kb3dubG9hZH0+XG4gICAgICAgICAgWWVzXG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyRG93bmxvYWRpbmcoKSB7XG4gICAgY29uc3QgcHJvZ3Jlc3MgPSB0aGlzLnN0YXRlLnByb2dyZXNzLnRvRml4ZWQoMSlcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2PlxuICAgICAgICA8c3Bhbj5Eb3dubG9hZGluZyBhbmQgaW5zdGFsbGluZy4uLjwvc3Bhbj5cbiAgICAgICAgPHAgc3R5bGU9e1NUWUxFUy5wcm9ncmVzc051bWJlcn0+e3Byb2dyZXNzfSAlPC9wPlxuICAgICAgICA8cHJvZ3Jlc3MgdmFsdWU9e3Byb2dyZXNzfSBtYXg9XCIxMDBcIiBzdHlsZT17U1RZTEVTLnByb2dyZXNzQmFyfT5cbiAgICAgICAgICB7cHJvZ3Jlc3N9ICVcbiAgICAgICAgPC9wcm9ncmVzcz5cbiAgICAgICAgPGJ1dHRvblxuICAgICAgICAgIHN0eWxlPXtTVFlMRVMuYnRufVxuICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHRoaXMuc2V0U3RhdGUoe3Nob3VsZENhbmNlbDogdHJ1ZX0pfVxuICAgICAgICA+XG4gICAgICAgICAgQ2FuY2VsXG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyRG93bmxvYWRGYWlsZWQoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXY+XG4gICAgICAgIDxwPlxuICAgICAgICAgIFRoZXJlIHdhcyBhbiBlcnJvciBkb3dubG9hZGluZyBTa2V0Y2gsIGlmIHRoZSBwcm9ibGVtIHBlcnNpc3RzLCBwbGVhc2VcbiAgICAgICAgICBjb250YWN0IEhhaWt1IHN1cHBvcnQuXG4gICAgICAgIDwvcD5cbiAgICAgICAgPGJ1dHRvbiBzdHlsZT17U1RZTEVTLmJ0bn0gb25DbGljaz17dGhpcy5oaWRlfT5cbiAgICAgICAgICBPa1xuICAgICAgICA8L2J1dHRvbj5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7c3RhdHVzfSA9IHRoaXMuc3RhdGVcbiAgICBpZiAoc3RhdHVzID09PSBzdGF0dXNlcy5JRExFKSByZXR1cm4gbnVsbFxuICAgIGxldCBjb250ZW50ID0gdGhpc1tgcmVuZGVyJHtzdGF0dXN9YF0oKVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXY+XG4gICAgICAgIDxkaXYgc3R5bGU9e1NUWUxFUy5jb250YWluZXJ9Pntjb250ZW50fTwvZGl2PlxuICAgICAgICA8ZGl2IHN0eWxlPXtTVFlMRVMub3ZlcmxheX0gLz5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTa2V0Y2hEb3dubG9hZGVyXG4iXX0=