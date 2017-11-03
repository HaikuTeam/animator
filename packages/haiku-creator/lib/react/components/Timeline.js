'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _jsxFileName = 'src/react/components/Timeline.js';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _qs = require('qs');

var _qs2 = _interopRequireDefault(_qs);

var _lodash = require('lodash.assign');

var _lodash2 = _interopRequireDefault(_lodash);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _Palette = require('./Palette');

var _Palette2 = _interopRequireDefault(_Palette);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Timeline = function (_React$Component) {
  _inherits(Timeline, _React$Component);

  function Timeline(props) {
    _classCallCheck(this, Timeline);

    var _this = _possibleConstructorReturn(this, (Timeline.__proto__ || Object.getPrototypeOf(Timeline)).call(this, props));

    _this.webview = null;
    _this.state = {};
    _this.onRequestWebviewCoordinates = _this.onRequestWebviewCoordinates.bind(_this);
    return _this;
  }

  _createClass(Timeline, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      this.injectWebview();

      var tourChannel = this.props.envoy.get('tour');

      if (!this.props.envoy.isInMockMode()) {
        tourChannel.then(function (tourChannel) {
          _this2.tourChannel = tourChannel;
          _this2.tourChannel.on('tour:requestWebviewCoordinates', _this2.onRequestWebviewCoordinates);
        });
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      if (this.tourChannel) {
        this.tourChannel.off('tour:requestWebviewCoordinates', this.onRequestWebviewCoordinates);
      }
    }
  }, {
    key: 'onRequestWebviewCoordinates',
    value: function onRequestWebviewCoordinates() {
      var _webview$getBoundingC = this.webview.getBoundingClientRect(),
          top = _webview$getBoundingC.top,
          left = _webview$getBoundingC.left;

      if (this.tourChannel) {
        this.tourChannel.receiveWebviewCoordinates('timeline', { top: top, left: left });
      }
    }
  }, {
    key: 'injectWebview',
    value: function injectWebview() {
      var _this3 = this;

      this.webview = document.createElement('webview');

      var query = _qs2.default.stringify((0, _lodash2.default)({}, this.props.haiku, {
        plumbing: this.props.haiku.plumbing.url,
        folder: this.props.folder,
        email: this.props.username,
        envoy: {
          host: this.props.envoy.getOption('host'),
          port: this.props.envoy.getOption('port')
        }
      }));

      // When building a distribution (see 'distro' repo) the node_modules folder is at a different level #FIXME matthew
      var url = void 0;
      if (process.env.HAIKU_TIMELINE_URL_MODE === 'distro') {
        url = 'file://' + _path2.default.join(__dirname, '..', '..', '..', '..', '..', 'node_modules', 'haiku-timeline', 'index.html') + '?' + query;
      } else {
        url = 'file://' + _path2.default.join(__dirname, '..', '..', '..', 'node_modules', 'haiku-timeline', 'index.html') + '?' + query;
      }

      this.webview.setAttribute('src', url);
      this.webview.setAttribute('plugins', true);
      this.webview.setAttribute('nodeintegration', true);
      this.webview.setAttribute('disablewebsecurity', true);
      this.webview.setAttribute('allowpopups', true);
      this.webview.style.width = '100%';
      this.webview.style.height = '100%';

      this.webview.addEventListener('console-message', function (event) {
        switch (event.level) {
          case 0:
            if (event.message.slice(0, 8) === '[notice]') {
              var msg = event.message.replace('[notice]', '').trim();
              var notice = _this3.props.createNotice({ type: 'info', title: 'Notice', message: msg });
              window.setTimeout(function () {
                _this3.props.removeNotice(undefined, notice.id);
              }, 1000);
            }
            break;
          // case 1:
          //   this.props.createNotice({ type: 'warning', title: 'Warning', message: event.message })
          //   break
          case 2:
            _this3.props.createNotice({ type: 'error', title: 'Error', message: event.message });
            break;
        }
      });

      this.webview.addEventListener('dom-ready', function () {
        if (process.env.DEV === '1') _this3.webview.openDevTools();
      });

      while (this.mount.firstChild) {
        this.mount.removeChild(this.mount.firstChild);
      }this.mount.appendChild(this.webview);
    }
  }, {
    key: 'toggleDevTools',
    value: function toggleDevTools() {
      if (this.webview) {
        if (this.webview.isDevToolsOpened()) this.webview.closeDevTools();else this.webview.openDevTools();
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this4 = this;

      return _react2.default.createElement('div', {
        id: 'timeline-mount',
        onMouseOver: function onMouseOver() {
          return _this4.webview.focus();
        },
        onMouseOut: function onMouseOut() {
          return _this4.webview.blur();
        },
        ref: function ref(element) {
          _this4.mount = element;
        },
        style: { position: 'absolute', overflow: 'auto', width: '100%', height: '100%', backgroundColor: _Palette2.default.GRAY }, __source: {
          fileName: _jsxFileName,
          lineNumber: 107
        },
        __self: this
      });
    }
  }]);

  return Timeline;
}(_react2.default.Component);

exports.default = Timeline;


Timeline.propTypes = {
  folder: _react2.default.PropTypes.string.isRequired,
  haiku: _react2.default.PropTypes.object.isRequired,
  envoy: _react2.default.PropTypes.object.isRequired
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9yZWFjdC9jb21wb25lbnRzL1RpbWVsaW5lLmpzIl0sIm5hbWVzIjpbIlRpbWVsaW5lIiwicHJvcHMiLCJ3ZWJ2aWV3Iiwic3RhdGUiLCJvblJlcXVlc3RXZWJ2aWV3Q29vcmRpbmF0ZXMiLCJiaW5kIiwiaW5qZWN0V2VidmlldyIsInRvdXJDaGFubmVsIiwiZW52b3kiLCJnZXQiLCJpc0luTW9ja01vZGUiLCJ0aGVuIiwib24iLCJvZmYiLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJ0b3AiLCJsZWZ0IiwicmVjZWl2ZVdlYnZpZXdDb29yZGluYXRlcyIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsInF1ZXJ5Iiwic3RyaW5naWZ5IiwiaGFpa3UiLCJwbHVtYmluZyIsInVybCIsImZvbGRlciIsImVtYWlsIiwidXNlcm5hbWUiLCJob3N0IiwiZ2V0T3B0aW9uIiwicG9ydCIsInByb2Nlc3MiLCJlbnYiLCJIQUlLVV9USU1FTElORV9VUkxfTU9ERSIsImpvaW4iLCJfX2Rpcm5hbWUiLCJzZXRBdHRyaWJ1dGUiLCJzdHlsZSIsIndpZHRoIiwiaGVpZ2h0IiwiYWRkRXZlbnRMaXN0ZW5lciIsImV2ZW50IiwibGV2ZWwiLCJtZXNzYWdlIiwic2xpY2UiLCJtc2ciLCJyZXBsYWNlIiwidHJpbSIsIm5vdGljZSIsImNyZWF0ZU5vdGljZSIsInR5cGUiLCJ0aXRsZSIsIndpbmRvdyIsInNldFRpbWVvdXQiLCJyZW1vdmVOb3RpY2UiLCJ1bmRlZmluZWQiLCJpZCIsIkRFViIsIm9wZW5EZXZUb29scyIsIm1vdW50IiwiZmlyc3RDaGlsZCIsInJlbW92ZUNoaWxkIiwiYXBwZW5kQ2hpbGQiLCJpc0RldlRvb2xzT3BlbmVkIiwiY2xvc2VEZXZUb29scyIsImZvY3VzIiwiYmx1ciIsImVsZW1lbnQiLCJwb3NpdGlvbiIsIm92ZXJmbG93IiwiYmFja2dyb3VuZENvbG9yIiwiR1JBWSIsIkNvbXBvbmVudCIsInByb3BUeXBlcyIsIlByb3BUeXBl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LFFBREY7QUFRRDs7OztFQTNHbUMsZ0JBQU1DLFM7O2tCQUF2QnhFLFE7OztBQThHckJBLFNBQVN5RSxTQUFULEdBQXFCO0FBQ25CaEQsVUFBUSxnQkFBTWlELFNBQU4sQ0FBZ0JDLE1BQWhCLENBQXVCQyxVQURaO0FBRW5CdEQsU0FBTyxnQkFBTW9ELFNBQU4sQ0FBZ0JHLE1BQWhCLENBQXVCRCxVQUZYO0FBR25CcEUsU0FBTyxnQkFBTWtFLFNBQU4sQ0FBZ0JHLE1BQWhCLENBQXVCRDtBQUhYLENBQXJCIiwiZmlsZSI6IlRpbWVsaW5lLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHFzIGZyb20gJ3FzJ1xuaW1wb3J0IGFzc2lnbiBmcm9tICdsb2Rhc2guYXNzaWduJ1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcbmltcG9ydCBQYWxldHRlIGZyb20gJy4vUGFsZXR0ZSdcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGltZWxpbmUgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3RvciAocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcylcbiAgICB0aGlzLndlYnZpZXcgPSBudWxsXG4gICAgdGhpcy5zdGF0ZSA9IHt9XG4gICAgdGhpcy5vblJlcXVlc3RXZWJ2aWV3Q29vcmRpbmF0ZXMgPSB0aGlzLm9uUmVxdWVzdFdlYnZpZXdDb29yZGluYXRlcy5iaW5kKHRoaXMpXG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCAoKSB7XG4gICAgdGhpcy5pbmplY3RXZWJ2aWV3KClcblxuICAgIGNvbnN0IHRvdXJDaGFubmVsID0gdGhpcy5wcm9wcy5lbnZveS5nZXQoJ3RvdXInKVxuXG4gICAgaWYgKCF0aGlzLnByb3BzLmVudm95LmlzSW5Nb2NrTW9kZSgpKSB7XG4gICAgICB0b3VyQ2hhbm5lbC50aGVuKCh0b3VyQ2hhbm5lbCkgPT4ge1xuICAgICAgICB0aGlzLnRvdXJDaGFubmVsID0gdG91ckNoYW5uZWxcbiAgICAgICAgdGhpcy50b3VyQ2hhbm5lbC5vbigndG91cjpyZXF1ZXN0V2Vidmlld0Nvb3JkaW5hdGVzJywgdGhpcy5vblJlcXVlc3RXZWJ2aWV3Q29vcmRpbmF0ZXMpXG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50ICgpIHtcbiAgICBpZiAodGhpcy50b3VyQ2hhbm5lbCkge1xuICAgICAgdGhpcy50b3VyQ2hhbm5lbC5vZmYoJ3RvdXI6cmVxdWVzdFdlYnZpZXdDb29yZGluYXRlcycsIHRoaXMub25SZXF1ZXN0V2Vidmlld0Nvb3JkaW5hdGVzKVxuICAgIH1cbiAgfVxuXG4gIG9uUmVxdWVzdFdlYnZpZXdDb29yZGluYXRlcyAoKSB7XG4gICAgbGV0IHsgdG9wLCBsZWZ0IH0gPSB0aGlzLndlYnZpZXcuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICBpZiAodGhpcy50b3VyQ2hhbm5lbCkge1xuICAgICAgdGhpcy50b3VyQ2hhbm5lbC5yZWNlaXZlV2Vidmlld0Nvb3JkaW5hdGVzKCd0aW1lbGluZScsIHsgdG9wLCBsZWZ0IH0pXG4gICAgfVxuICB9XG5cbiAgaW5qZWN0V2VidmlldyAoKSB7XG4gICAgdGhpcy53ZWJ2aWV3ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnd2VidmlldycpXG5cbiAgICBjb25zdCBxdWVyeSA9IHFzLnN0cmluZ2lmeShhc3NpZ24oe30sIHRoaXMucHJvcHMuaGFpa3UsIHtcbiAgICAgIHBsdW1iaW5nOiB0aGlzLnByb3BzLmhhaWt1LnBsdW1iaW5nLnVybCxcbiAgICAgIGZvbGRlcjogdGhpcy5wcm9wcy5mb2xkZXIsXG4gICAgICBlbWFpbDogdGhpcy5wcm9wcy51c2VybmFtZSxcbiAgICAgIGVudm95OiB7XG4gICAgICAgIGhvc3Q6IHRoaXMucHJvcHMuZW52b3kuZ2V0T3B0aW9uKCdob3N0JyksXG4gICAgICAgIHBvcnQ6IHRoaXMucHJvcHMuZW52b3kuZ2V0T3B0aW9uKCdwb3J0JylcbiAgICAgIH1cbiAgICB9KSlcblxuICAgIC8vIFdoZW4gYnVpbGRpbmcgYSBkaXN0cmlidXRpb24gKHNlZSAnZGlzdHJvJyByZXBvKSB0aGUgbm9kZV9tb2R1bGVzIGZvbGRlciBpcyBhdCBhIGRpZmZlcmVudCBsZXZlbCAjRklYTUUgbWF0dGhld1xuICAgIGxldCB1cmxcbiAgICBpZiAocHJvY2Vzcy5lbnYuSEFJS1VfVElNRUxJTkVfVVJMX01PREUgPT09ICdkaXN0cm8nKSB7XG4gICAgICB1cmwgPSBgZmlsZTovLyR7cGF0aC5qb2luKF9fZGlybmFtZSwgJy4uJywgJy4uJywgJy4uJywgJy4uJywgJy4uJywgJ25vZGVfbW9kdWxlcycsICdoYWlrdS10aW1lbGluZScsICdpbmRleC5odG1sJyl9PyR7cXVlcnl9YFxuICAgIH0gZWxzZSB7XG4gICAgICB1cmwgPSBgZmlsZTovLyR7cGF0aC5qb2luKF9fZGlybmFtZSwgJy4uJywgJy4uJywgJy4uJywgJ25vZGVfbW9kdWxlcycsICdoYWlrdS10aW1lbGluZScsICdpbmRleC5odG1sJyl9PyR7cXVlcnl9YFxuICAgIH1cblxuICAgIHRoaXMud2Vidmlldy5zZXRBdHRyaWJ1dGUoJ3NyYycsIHVybClcbiAgICB0aGlzLndlYnZpZXcuc2V0QXR0cmlidXRlKCdwbHVnaW5zJywgdHJ1ZSlcbiAgICB0aGlzLndlYnZpZXcuc2V0QXR0cmlidXRlKCdub2RlaW50ZWdyYXRpb24nLCB0cnVlKVxuICAgIHRoaXMud2Vidmlldy5zZXRBdHRyaWJ1dGUoJ2Rpc2FibGV3ZWJzZWN1cml0eScsIHRydWUpXG4gICAgdGhpcy53ZWJ2aWV3LnNldEF0dHJpYnV0ZSgnYWxsb3dwb3B1cHMnLCB0cnVlKVxuICAgIHRoaXMud2Vidmlldy5zdHlsZS53aWR0aCA9ICcxMDAlJ1xuICAgIHRoaXMud2Vidmlldy5zdHlsZS5oZWlnaHQgPSAnMTAwJSdcblxuICAgIHRoaXMud2Vidmlldy5hZGRFdmVudExpc3RlbmVyKCdjb25zb2xlLW1lc3NhZ2UnLCAoZXZlbnQpID0+IHtcbiAgICAgIHN3aXRjaCAoZXZlbnQubGV2ZWwpIHtcbiAgICAgICAgY2FzZSAwOlxuICAgICAgICAgIGlmIChldmVudC5tZXNzYWdlLnNsaWNlKDAsIDgpID09PSAnW25vdGljZV0nKSB7XG4gICAgICAgICAgICB2YXIgbXNnID0gZXZlbnQubWVzc2FnZS5yZXBsYWNlKCdbbm90aWNlXScsICcnKS50cmltKClcbiAgICAgICAgICAgIHZhciBub3RpY2UgPSB0aGlzLnByb3BzLmNyZWF0ZU5vdGljZSh7IHR5cGU6ICdpbmZvJywgdGl0bGU6ICdOb3RpY2UnLCBtZXNzYWdlOiBtc2cgfSlcbiAgICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgdGhpcy5wcm9wcy5yZW1vdmVOb3RpY2UodW5kZWZpbmVkLCBub3RpY2UuaWQpXG4gICAgICAgICAgICB9LCAxMDAwKVxuICAgICAgICAgIH1cbiAgICAgICAgICBicmVha1xuICAgICAgICAvLyBjYXNlIDE6XG4gICAgICAgIC8vICAgdGhpcy5wcm9wcy5jcmVhdGVOb3RpY2UoeyB0eXBlOiAnd2FybmluZycsIHRpdGxlOiAnV2FybmluZycsIG1lc3NhZ2U6IGV2ZW50Lm1lc3NhZ2UgfSlcbiAgICAgICAgLy8gICBicmVha1xuICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgdGhpcy5wcm9wcy5jcmVhdGVOb3RpY2UoeyB0eXBlOiAnZXJyb3InLCB0aXRsZTogJ0Vycm9yJywgbWVzc2FnZTogZXZlbnQubWVzc2FnZSB9KVxuICAgICAgICAgIGJyZWFrXG4gICAgICB9XG4gICAgfSlcblxuICAgIHRoaXMud2Vidmlldy5hZGRFdmVudExpc3RlbmVyKCdkb20tcmVhZHknLCAoKSA9PiB7XG4gICAgICBpZiAocHJvY2Vzcy5lbnYuREVWID09PSAnMScpIHRoaXMud2Vidmlldy5vcGVuRGV2VG9vbHMoKVxuICAgIH0pXG5cbiAgICB3aGlsZSAodGhpcy5tb3VudC5maXJzdENoaWxkKSB0aGlzLm1vdW50LnJlbW92ZUNoaWxkKHRoaXMubW91bnQuZmlyc3RDaGlsZClcbiAgICB0aGlzLm1vdW50LmFwcGVuZENoaWxkKHRoaXMud2VidmlldylcbiAgfVxuXG4gIHRvZ2dsZURldlRvb2xzICgpIHtcbiAgICBpZiAodGhpcy53ZWJ2aWV3KSB7XG4gICAgICBpZiAodGhpcy53ZWJ2aWV3LmlzRGV2VG9vbHNPcGVuZWQoKSkgdGhpcy53ZWJ2aWV3LmNsb3NlRGV2VG9vbHMoKVxuICAgICAgZWxzZSB0aGlzLndlYnZpZXcub3BlbkRldlRvb2xzKClcbiAgICB9XG4gIH1cblxuICByZW5kZXIgKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2XG4gICAgICAgIGlkPSd0aW1lbGluZS1tb3VudCdcbiAgICAgICAgb25Nb3VzZU92ZXI9eygpID0+IHRoaXMud2Vidmlldy5mb2N1cygpfVxuICAgICAgICBvbk1vdXNlT3V0PXsoKSA9PiB0aGlzLndlYnZpZXcuYmx1cigpfVxuICAgICAgICByZWY9eyhlbGVtZW50KSA9PiB7IHRoaXMubW91bnQgPSBlbGVtZW50IH19XG4gICAgICAgIHN0eWxlPXt7IHBvc2l0aW9uOiAnYWJzb2x1dGUnLCBvdmVyZmxvdzogJ2F1dG8nLCB3aWR0aDogJzEwMCUnLCBoZWlnaHQ6ICcxMDAlJywgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLkdSQVkgfX0gLz5cbiAgICApXG4gIH1cbn1cblxuVGltZWxpbmUucHJvcFR5cGVzID0ge1xuICBmb2xkZXI6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgaGFpa3U6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgZW52b3k6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZFxufVxuIl19