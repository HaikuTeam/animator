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
      this.tourChannel.off('tour:requestWebviewCoordinates', this.onRequestWebviewCoordinates);
    }
  }, {
    key: 'onRequestWebviewCoordinates',
    value: function onRequestWebviewCoordinates() {
      var _webview$getBoundingC = this.webview.getBoundingClientRect(),
          top = _webview$getBoundingC.top,
          left = _webview$getBoundingC.left;

      this.tourChannel.receiveWebviewCoordinates('timeline', { top: top, left: left });
    }
  }, {
    key: 'injectWebview',
    value: function injectWebview() {
      var _this3 = this;

      this.webview = document.createElement('webview');

      var query = _qs2.default.stringify((0, _lodash2.default)({}, this.props.haiku, {
        plumbing: this.props.haiku.plumbing.url,
        folder: this.props.folder,
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
          lineNumber: 81
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9yZWFjdC9jb21wb25lbnRzL1RpbWVsaW5lLmpzIl0sIm5hbWVzIjpbIlRpbWVsaW5lIiwicHJvcHMiLCJ3ZWJ2aWV3Iiwic3RhdGUiLCJvblJlcXVlc3RXZWJ2aWV3Q29vcmRpbmF0ZXMiLCJiaW5kIiwiaW5qZWN0V2VidmlldyIsInRvdXJDaGFubmVsIiwiZW52b3kiLCJnZXQiLCJpc0luTW9ja01vZGUiLCJ0aGVuIiwib24iLCJvZmYiLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJ0b3AiLCJsZWZ0IiwicmVjZWl2ZVdlYnZpZXdDb29yZGluYXRlcyIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsInF1ZXJ5Iiwic3RyaW5naWZ5IiwiaGFpa3UiLCJwbHVtYmluZyIsInVybCIsImZvbGRlciIsImhvc3QiLCJnZXRPcHRpb24iLCJwb3J0IiwicHJvY2VzcyIsImVudiIsIkhBSUtVX1RJTUVMSU5FX1VSTF9NT0RFIiwiam9pbiIsIl9fZGlybmFtZSIsInNldEF0dHJpYnV0ZSIsInN0eWxlIiwid2lkdGgiLCJoZWlnaHQiLCJhZGRFdmVudExpc3RlbmVyIiwiREVWIiwib3BlbkRldlRvb2xzIiwibW91bnQiLCJmaXJzdENoaWxkIiwicmVtb3ZlQ2hpbGQiLCJhcHBlbmRDaGlsZCIsImlzRGV2VG9vbHNPcGVuZWQiLCJjbG9zZURldlRvb2xzIiwiZm9jdXMiLCJibHVyIiwiZWxlbWVudCIsInBvc2l0aW9uIiwib3ZlcmZsb3ciLCJiYWNrZ3JvdW5kQ29sb3IiLCJHUkFZIiwiQ29tcG9uZW50IiwicHJvcFR5cGVzIiwiUHJvcFR5cGVzIiwic3RyaW5nIiwiaXNSZXF1aXJlZCIsIm9iamVjdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7Ozs7O0lBRXFCQSxROzs7QUFDbkIsb0JBQWFDLEtBQWIsRUFBb0I7QUFBQTs7QUFBQSxvSEFDWkEsS0FEWTs7QUFFbEIs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LFM7O2tCQUF2QnRELFE7OztBQW9GckJBLFNBQVN1RCxTQUFULEdBQXFCO0FBQ25COUIsVUFBUSxnQkFBTStCLFNBQU4sQ0FBZ0JDLE1BQWhCLENBQXVCQyxVQURaO0FBRW5CcEMsU0FBTyxnQkFBTWtDLFNBQU4sQ0FBZ0JHLE1BQWhCLENBQXVCRCxVQUZYO0FBR25CbEQsU0FBTyxnQkFBTWdELFNBQU4sQ0FBZ0JHLE1BQWhCLENBQXVCRDtBQUhYLENBQXJCIiwiZmlsZSI6IlRpbWVsaW5lLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHFzIGZyb20gJ3FzJ1xuaW1wb3J0IGFzc2lnbiBmcm9tICdsb2Rhc2guYXNzaWduJ1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcbmltcG9ydCBQYWxldHRlIGZyb20gJy4vUGFsZXR0ZSdcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGltZWxpbmUgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3RvciAocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcylcbiAgICB0aGlzLndlYnZpZXcgPSBudWxsXG4gICAgdGhpcy5zdGF0ZSA9IHt9XG4gICAgdGhpcy5vblJlcXVlc3RXZWJ2aWV3Q29vcmRpbmF0ZXMgPSB0aGlzLm9uUmVxdWVzdFdlYnZpZXdDb29yZGluYXRlcy5iaW5kKHRoaXMpXG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCAoKSB7XG4gICAgdGhpcy5pbmplY3RXZWJ2aWV3KClcblxuICAgIGNvbnN0IHRvdXJDaGFubmVsID0gdGhpcy5wcm9wcy5lbnZveS5nZXQoJ3RvdXInKVxuXG4gICAgaWYgKCF0aGlzLnByb3BzLmVudm95LmlzSW5Nb2NrTW9kZSgpKSB7XG4gICAgICB0b3VyQ2hhbm5lbC50aGVuKCh0b3VyQ2hhbm5lbCkgPT4ge1xuICAgICAgICB0aGlzLnRvdXJDaGFubmVsID0gdG91ckNoYW5uZWxcblxuICAgICAgICB0aGlzLnRvdXJDaGFubmVsLm9uKCd0b3VyOnJlcXVlc3RXZWJ2aWV3Q29vcmRpbmF0ZXMnLCB0aGlzLm9uUmVxdWVzdFdlYnZpZXdDb29yZGluYXRlcylcbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQgKCkge1xuICAgIHRoaXMudG91ckNoYW5uZWwub2ZmKCd0b3VyOnJlcXVlc3RXZWJ2aWV3Q29vcmRpbmF0ZXMnLCB0aGlzLm9uUmVxdWVzdFdlYnZpZXdDb29yZGluYXRlcylcbiAgfVxuXG4gIG9uUmVxdWVzdFdlYnZpZXdDb29yZGluYXRlcyAoKSB7XG4gICAgbGV0IHsgdG9wLCBsZWZ0IH0gPSB0aGlzLndlYnZpZXcuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICB0aGlzLnRvdXJDaGFubmVsLnJlY2VpdmVXZWJ2aWV3Q29vcmRpbmF0ZXMoJ3RpbWVsaW5lJywgeyB0b3AsIGxlZnQgfSlcbiAgfVxuXG4gIGluamVjdFdlYnZpZXcgKCkge1xuICAgIHRoaXMud2VidmlldyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3dlYnZpZXcnKVxuXG4gICAgY29uc3QgcXVlcnkgPSBxcy5zdHJpbmdpZnkoYXNzaWduKHt9LCB0aGlzLnByb3BzLmhhaWt1LCB7XG4gICAgICBwbHVtYmluZzogdGhpcy5wcm9wcy5oYWlrdS5wbHVtYmluZy51cmwsXG4gICAgICBmb2xkZXI6IHRoaXMucHJvcHMuZm9sZGVyLFxuICAgICAgZW52b3k6IHtcbiAgICAgICAgaG9zdDogdGhpcy5wcm9wcy5lbnZveS5nZXRPcHRpb24oJ2hvc3QnKSxcbiAgICAgICAgcG9ydDogdGhpcy5wcm9wcy5lbnZveS5nZXRPcHRpb24oJ3BvcnQnKVxuICAgICAgfVxuICAgIH0pKVxuXG4gICAgLy8gV2hlbiBidWlsZGluZyBhIGRpc3RyaWJ1dGlvbiAoc2VlICdkaXN0cm8nIHJlcG8pIHRoZSBub2RlX21vZHVsZXMgZm9sZGVyIGlzIGF0IGEgZGlmZmVyZW50IGxldmVsICNGSVhNRSBtYXR0aGV3XG4gICAgbGV0IHVybFxuICAgIGlmIChwcm9jZXNzLmVudi5IQUlLVV9USU1FTElORV9VUkxfTU9ERSA9PT0gJ2Rpc3RybycpIHtcbiAgICAgIHVybCA9IGBmaWxlOi8vJHtwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi4nLCAnLi4nLCAnLi4nLCAnLi4nLCAnLi4nLCAnbm9kZV9tb2R1bGVzJywgJ2hhaWt1LXRpbWVsaW5lJywgJ2luZGV4Lmh0bWwnKX0/JHtxdWVyeX1gXG4gICAgfSBlbHNlIHtcbiAgICAgIHVybCA9IGBmaWxlOi8vJHtwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi4nLCAnLi4nLCAnLi4nLCAnbm9kZV9tb2R1bGVzJywgJ2hhaWt1LXRpbWVsaW5lJywgJ2luZGV4Lmh0bWwnKX0/JHtxdWVyeX1gXG4gICAgfVxuXG4gICAgdGhpcy53ZWJ2aWV3LnNldEF0dHJpYnV0ZSgnc3JjJywgdXJsKVxuICAgIHRoaXMud2Vidmlldy5zZXRBdHRyaWJ1dGUoJ3BsdWdpbnMnLCB0cnVlKVxuICAgIHRoaXMud2Vidmlldy5zZXRBdHRyaWJ1dGUoJ25vZGVpbnRlZ3JhdGlvbicsIHRydWUpXG4gICAgdGhpcy53ZWJ2aWV3LnNldEF0dHJpYnV0ZSgnZGlzYWJsZXdlYnNlY3VyaXR5JywgdHJ1ZSlcbiAgICB0aGlzLndlYnZpZXcuc2V0QXR0cmlidXRlKCdhbGxvd3BvcHVwcycsIHRydWUpXG4gICAgdGhpcy53ZWJ2aWV3LnN0eWxlLndpZHRoID0gJzEwMCUnXG4gICAgdGhpcy53ZWJ2aWV3LnN0eWxlLmhlaWdodCA9ICcxMDAlJ1xuICAgIHRoaXMud2Vidmlldy5hZGRFdmVudExpc3RlbmVyKCdkb20tcmVhZHknLCAoKSA9PiB7XG4gICAgICBpZiAocHJvY2Vzcy5lbnYuREVWID09PSAnMScpIHRoaXMud2Vidmlldy5vcGVuRGV2VG9vbHMoKVxuICAgIH0pXG4gICAgd2hpbGUgKHRoaXMubW91bnQuZmlyc3RDaGlsZCkgdGhpcy5tb3VudC5yZW1vdmVDaGlsZCh0aGlzLm1vdW50LmZpcnN0Q2hpbGQpXG4gICAgdGhpcy5tb3VudC5hcHBlbmRDaGlsZCh0aGlzLndlYnZpZXcpXG4gIH1cblxuICB0b2dnbGVEZXZUb29scyAoKSB7XG4gICAgaWYgKHRoaXMud2Vidmlldykge1xuICAgICAgaWYgKHRoaXMud2Vidmlldy5pc0RldlRvb2xzT3BlbmVkKCkpIHRoaXMud2Vidmlldy5jbG9zZURldlRvb2xzKClcbiAgICAgIGVsc2UgdGhpcy53ZWJ2aWV3Lm9wZW5EZXZUb29scygpXG4gICAgfVxuICB9XG5cbiAgcmVuZGVyICgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdlxuICAgICAgICBpZD0ndGltZWxpbmUtbW91bnQnXG4gICAgICAgIG9uTW91c2VPdmVyPXsoKSA9PiB0aGlzLndlYnZpZXcuZm9jdXMoKX1cbiAgICAgICAgb25Nb3VzZU91dD17KCkgPT4gdGhpcy53ZWJ2aWV3LmJsdXIoKX1cbiAgICAgICAgcmVmPXsoZWxlbWVudCkgPT4geyB0aGlzLm1vdW50ID0gZWxlbWVudCB9fVxuICAgICAgICBzdHlsZT17eyBwb3NpdGlvbjogJ2Fic29sdXRlJywgb3ZlcmZsb3c6ICdhdXRvJywgd2lkdGg6ICcxMDAlJywgaGVpZ2h0OiAnMTAwJScsIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5HUkFZIH19IC8+XG4gICAgKVxuICB9XG59XG5cblRpbWVsaW5lLnByb3BUeXBlcyA9IHtcbiAgZm9sZGVyOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gIGhhaWt1OiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gIGVudm95OiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWRcbn1cbiJdfQ==