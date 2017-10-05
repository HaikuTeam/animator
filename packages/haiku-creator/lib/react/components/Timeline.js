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
          lineNumber: 106
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9yZWFjdC9jb21wb25lbnRzL1RpbWVsaW5lLmpzIl0sIm5hbWVzIjpbIlRpbWVsaW5lIiwicHJvcHMiLCJ3ZWJ2aWV3Iiwic3RhdGUiLCJvblJlcXVlc3RXZWJ2aWV3Q29vcmRpbmF0ZXMiLCJiaW5kIiwiaW5qZWN0V2VidmlldyIsInRvdXJDaGFubmVsIiwiZW52b3kiLCJnZXQiLCJpc0luTW9ja01vZGUiLCJ0aGVuIiwib24iLCJvZmYiLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJ0b3AiLCJsZWZ0IiwicmVjZWl2ZVdlYnZpZXdDb29yZGluYXRlcyIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsInF1ZXJ5Iiwic3RyaW5naWZ5IiwiaGFpa3UiLCJwbHVtYmluZyIsInVybCIsImZvbGRlciIsImhvc3QiLCJnZXRPcHRpb24iLCJwb3J0IiwicHJvY2VzcyIsImVudiIsIkhBSUtVX1RJTUVMSU5FX1VSTF9NT0RFIiwiam9pbiIsIl9fZGlybmFtZSIsInNldEF0dHJpYnV0ZSIsInN0eWxlIiwid2lkdGgiLCJoZWlnaHQiLCJhZGRFdmVudExpc3RlbmVyIiwiZXZlbnQiLCJsZXZlbCIsIm1lc3NhZ2UiLCJzbGljZSIsIm1zZyIsInJlcGxhY2UiLCJ0cmltIiwibm90aWNlIiwiY3JlYXRlTm90aWNlIiwidHlwZSIsInRpdGxlIiwid2luZG93Iiwic2V0VGltZW91dCIsInJlbW92ZU5vdGljZSIsInVuZGVmaW5lZCIsImlkIiwiREVWIiwib3BlbkRldlRvb2xzIiwibW91bnQiLCJmaXJzdENoaWxkIiwicmVtb3ZlQ2hpbGQiLCJhcHBlbmRDaGlsZCIsImlzRGV2VG9vbHNPcGVuZWQiLCJjbG9zZURldlRvb2xzIiwiZm9jdXMiLCJibHVyIiwiZWxlbWVudCIsInBvc2l0aW9uIiwib3ZlcmZsb3ciLCJiYWNrZ3JvdW5kQ29sb3IiLCJHUkFZIiwiQ29tcG9uZW50IiwicHJvcFR5cGVzIiwiUHJvcFR5cGVzIiwic3RyaW5nIiwiaXNSZXF1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dUUsU0FBVCxHQUFxQjtBQUNuQjlDLFVBQVEsZ0JBQU0rQyxTQUFOLENBQWdCQyxNQUFoQixDQUF1QkMsVUFEWjtBQUVuQnBELFNBQU8sZ0JBQU1rRCxTQUFOLENBQWdCRyxNQUFoQixDQUF1QkQsVUFGWDtBQUduQmxFLFNBQU8sZ0JBQU1nRSxTQUFOLENBQWdCRyxNQUFoQixDQUF1QkQ7QUFIWCxDQUFyQiIsImZpbGUiOiJUaW1lbGluZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCBxcyBmcm9tICdxcydcbmltcG9ydCBhc3NpZ24gZnJvbSAnbG9kYXNoLmFzc2lnbidcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQgUGFsZXR0ZSBmcm9tICcuL1BhbGV0dGUnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRpbWVsaW5lIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IgKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpXG4gICAgdGhpcy53ZWJ2aWV3ID0gbnVsbFxuICAgIHRoaXMuc3RhdGUgPSB7fVxuICAgIHRoaXMub25SZXF1ZXN0V2Vidmlld0Nvb3JkaW5hdGVzID0gdGhpcy5vblJlcXVlc3RXZWJ2aWV3Q29vcmRpbmF0ZXMuYmluZCh0aGlzKVxuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQgKCkge1xuICAgIHRoaXMuaW5qZWN0V2VidmlldygpXG5cbiAgICBjb25zdCB0b3VyQ2hhbm5lbCA9IHRoaXMucHJvcHMuZW52b3kuZ2V0KCd0b3VyJylcblxuICAgIGlmICghdGhpcy5wcm9wcy5lbnZveS5pc0luTW9ja01vZGUoKSkge1xuICAgICAgdG91ckNoYW5uZWwudGhlbigodG91ckNoYW5uZWwpID0+IHtcbiAgICAgICAgdGhpcy50b3VyQ2hhbm5lbCA9IHRvdXJDaGFubmVsXG4gICAgICAgIHRoaXMudG91ckNoYW5uZWwub24oJ3RvdXI6cmVxdWVzdFdlYnZpZXdDb29yZGluYXRlcycsIHRoaXMub25SZXF1ZXN0V2Vidmlld0Nvb3JkaW5hdGVzKVxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICBjb21wb25lbnRXaWxsVW5tb3VudCAoKSB7XG4gICAgaWYgKHRoaXMudG91ckNoYW5uZWwpIHtcbiAgICAgIHRoaXMudG91ckNoYW5uZWwub2ZmKCd0b3VyOnJlcXVlc3RXZWJ2aWV3Q29vcmRpbmF0ZXMnLCB0aGlzLm9uUmVxdWVzdFdlYnZpZXdDb29yZGluYXRlcylcbiAgICB9XG4gIH1cblxuICBvblJlcXVlc3RXZWJ2aWV3Q29vcmRpbmF0ZXMgKCkge1xuICAgIGxldCB7IHRvcCwgbGVmdCB9ID0gdGhpcy53ZWJ2aWV3LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gICAgaWYgKHRoaXMudG91ckNoYW5uZWwpIHtcbiAgICAgIHRoaXMudG91ckNoYW5uZWwucmVjZWl2ZVdlYnZpZXdDb29yZGluYXRlcygndGltZWxpbmUnLCB7IHRvcCwgbGVmdCB9KVxuICAgIH1cbiAgfVxuXG4gIGluamVjdFdlYnZpZXcgKCkge1xuICAgIHRoaXMud2VidmlldyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3dlYnZpZXcnKVxuXG4gICAgY29uc3QgcXVlcnkgPSBxcy5zdHJpbmdpZnkoYXNzaWduKHt9LCB0aGlzLnByb3BzLmhhaWt1LCB7XG4gICAgICBwbHVtYmluZzogdGhpcy5wcm9wcy5oYWlrdS5wbHVtYmluZy51cmwsXG4gICAgICBmb2xkZXI6IHRoaXMucHJvcHMuZm9sZGVyLFxuICAgICAgZW52b3k6IHtcbiAgICAgICAgaG9zdDogdGhpcy5wcm9wcy5lbnZveS5nZXRPcHRpb24oJ2hvc3QnKSxcbiAgICAgICAgcG9ydDogdGhpcy5wcm9wcy5lbnZveS5nZXRPcHRpb24oJ3BvcnQnKVxuICAgICAgfVxuICAgIH0pKVxuXG4gICAgLy8gV2hlbiBidWlsZGluZyBhIGRpc3RyaWJ1dGlvbiAoc2VlICdkaXN0cm8nIHJlcG8pIHRoZSBub2RlX21vZHVsZXMgZm9sZGVyIGlzIGF0IGEgZGlmZmVyZW50IGxldmVsICNGSVhNRSBtYXR0aGV3XG4gICAgbGV0IHVybFxuICAgIGlmIChwcm9jZXNzLmVudi5IQUlLVV9USU1FTElORV9VUkxfTU9ERSA9PT0gJ2Rpc3RybycpIHtcbiAgICAgIHVybCA9IGBmaWxlOi8vJHtwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi4nLCAnLi4nLCAnLi4nLCAnLi4nLCAnLi4nLCAnbm9kZV9tb2R1bGVzJywgJ2hhaWt1LXRpbWVsaW5lJywgJ2luZGV4Lmh0bWwnKX0/JHtxdWVyeX1gXG4gICAgfSBlbHNlIHtcbiAgICAgIHVybCA9IGBmaWxlOi8vJHtwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi4nLCAnLi4nLCAnLi4nLCAnbm9kZV9tb2R1bGVzJywgJ2hhaWt1LXRpbWVsaW5lJywgJ2luZGV4Lmh0bWwnKX0/JHtxdWVyeX1gXG4gICAgfVxuXG4gICAgdGhpcy53ZWJ2aWV3LnNldEF0dHJpYnV0ZSgnc3JjJywgdXJsKVxuICAgIHRoaXMud2Vidmlldy5zZXRBdHRyaWJ1dGUoJ3BsdWdpbnMnLCB0cnVlKVxuICAgIHRoaXMud2Vidmlldy5zZXRBdHRyaWJ1dGUoJ25vZGVpbnRlZ3JhdGlvbicsIHRydWUpXG4gICAgdGhpcy53ZWJ2aWV3LnNldEF0dHJpYnV0ZSgnZGlzYWJsZXdlYnNlY3VyaXR5JywgdHJ1ZSlcbiAgICB0aGlzLndlYnZpZXcuc2V0QXR0cmlidXRlKCdhbGxvd3BvcHVwcycsIHRydWUpXG4gICAgdGhpcy53ZWJ2aWV3LnN0eWxlLndpZHRoID0gJzEwMCUnXG4gICAgdGhpcy53ZWJ2aWV3LnN0eWxlLmhlaWdodCA9ICcxMDAlJ1xuXG4gICAgdGhpcy53ZWJ2aWV3LmFkZEV2ZW50TGlzdGVuZXIoJ2NvbnNvbGUtbWVzc2FnZScsIChldmVudCkgPT4ge1xuICAgICAgc3dpdGNoIChldmVudC5sZXZlbCkge1xuICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgaWYgKGV2ZW50Lm1lc3NhZ2Uuc2xpY2UoMCwgOCkgPT09ICdbbm90aWNlXScpIHtcbiAgICAgICAgICAgIHZhciBtc2cgPSBldmVudC5tZXNzYWdlLnJlcGxhY2UoJ1tub3RpY2VdJywgJycpLnRyaW0oKVxuICAgICAgICAgICAgdmFyIG5vdGljZSA9IHRoaXMucHJvcHMuY3JlYXRlTm90aWNlKHsgdHlwZTogJ2luZm8nLCB0aXRsZTogJ05vdGljZScsIG1lc3NhZ2U6IG1zZyB9KVxuICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLnByb3BzLnJlbW92ZU5vdGljZSh1bmRlZmluZWQsIG5vdGljZS5pZClcbiAgICAgICAgICAgIH0sIDEwMDApXG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIC8vIGNhc2UgMTpcbiAgICAgICAgLy8gICB0aGlzLnByb3BzLmNyZWF0ZU5vdGljZSh7IHR5cGU6ICd3YXJuaW5nJywgdGl0bGU6ICdXYXJuaW5nJywgbWVzc2FnZTogZXZlbnQubWVzc2FnZSB9KVxuICAgICAgICAvLyAgIGJyZWFrXG4gICAgICAgIGNhc2UgMjpcbiAgICAgICAgICB0aGlzLnByb3BzLmNyZWF0ZU5vdGljZSh7IHR5cGU6ICdlcnJvcicsIHRpdGxlOiAnRXJyb3InLCBtZXNzYWdlOiBldmVudC5tZXNzYWdlIH0pXG4gICAgICAgICAgYnJlYWtcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgdGhpcy53ZWJ2aWV3LmFkZEV2ZW50TGlzdGVuZXIoJ2RvbS1yZWFkeScsICgpID0+IHtcbiAgICAgIGlmIChwcm9jZXNzLmVudi5ERVYgPT09ICcxJykgdGhpcy53ZWJ2aWV3Lm9wZW5EZXZUb29scygpXG4gICAgfSlcblxuICAgIHdoaWxlICh0aGlzLm1vdW50LmZpcnN0Q2hpbGQpIHRoaXMubW91bnQucmVtb3ZlQ2hpbGQodGhpcy5tb3VudC5maXJzdENoaWxkKVxuICAgIHRoaXMubW91bnQuYXBwZW5kQ2hpbGQodGhpcy53ZWJ2aWV3KVxuICB9XG5cbiAgdG9nZ2xlRGV2VG9vbHMgKCkge1xuICAgIGlmICh0aGlzLndlYnZpZXcpIHtcbiAgICAgIGlmICh0aGlzLndlYnZpZXcuaXNEZXZUb29sc09wZW5lZCgpKSB0aGlzLndlYnZpZXcuY2xvc2VEZXZUb29scygpXG4gICAgICBlbHNlIHRoaXMud2Vidmlldy5vcGVuRGV2VG9vbHMoKVxuICAgIH1cbiAgfVxuXG4gIHJlbmRlciAoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXZcbiAgICAgICAgaWQ9J3RpbWVsaW5lLW1vdW50J1xuICAgICAgICBvbk1vdXNlT3Zlcj17KCkgPT4gdGhpcy53ZWJ2aWV3LmZvY3VzKCl9XG4gICAgICAgIG9uTW91c2VPdXQ9eygpID0+IHRoaXMud2Vidmlldy5ibHVyKCl9XG4gICAgICAgIHJlZj17KGVsZW1lbnQpID0+IHsgdGhpcy5tb3VudCA9IGVsZW1lbnQgfX1cbiAgICAgICAgc3R5bGU9e3sgcG9zaXRpb246ICdhYnNvbHV0ZScsIG92ZXJmbG93OiAnYXV0bycsIHdpZHRoOiAnMTAwJScsIGhlaWdodDogJzEwMCUnLCBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuR1JBWSB9fSAvPlxuICAgIClcbiAgfVxufVxuXG5UaW1lbGluZS5wcm9wVHlwZXMgPSB7XG4gIGZvbGRlcjogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICBoYWlrdTogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICBlbnZveTogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkXG59XG4iXX0=