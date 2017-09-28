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
          tourChannel.on('tour:requestWebviewCoordinates', _this2.onRequestWebviewCoordinates.bind(_this2, tourChannel));
        });
      }
    }
  }, {
    key: 'onRequestWebviewCoordinates',
    value: function onRequestWebviewCoordinates(tourChannel) {
      var _webview$getBoundingC = this.webview.getBoundingClientRect(),
          top = _webview$getBoundingC.top,
          left = _webview$getBoundingC.left;

      tourChannel.receiveWebviewCoordinates('timeline', { top: top, left: left });
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
          lineNumber: 74
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9yZWFjdC9jb21wb25lbnRzL1RpbWVsaW5lLmpzIl0sIm5hbWVzIjpbIlRpbWVsaW5lIiwicHJvcHMiLCJ3ZWJ2aWV3Iiwic3RhdGUiLCJpbmplY3RXZWJ2aWV3IiwidG91ckNoYW5uZWwiLCJlbnZveSIsImdldCIsImlzSW5Nb2NrTW9kZSIsInRoZW4iLCJvbiIsIm9uUmVxdWVzdFdlYnZpZXdDb29yZGluYXRlcyIsImJpbmQiLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJ0b3AiLCJsZWZ0IiwicmVjZWl2ZVdlYnZpZXdDb29yZGluYXRlcyIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsInF1ZXJ5Iiwic3RyaW5naWZ5IiwiaGFpa3UiLCJwbHVtYmluZyIsInVybCIsImZvbGRlciIsImhvc3QiLCJnZXRPcHRpb24iLCJwb3J0IiwicHJvY2VzcyIsImVudiIsIkhBSUtVX1RJTUVMSU5FX1VSTF9NT0RFIiwiam9pbiIsIl9fZGlybmFtZSIsInNldEF0dHJpYnV0ZSIsInN0eWxlIiwid2lkdGgiLCJoZWlnaHQiLCJhZGRFdmVudExpc3RlbmVyIiwiREVWIiwib3BlbkRldlRvb2xzIiwibW91bnQiLCJmaXJzdENoaWxkIiwicmVtb3ZlQ2hpbGQiLCJhcHBlbmRDaGlsZCIsImlzRGV2VG9vbHNPcGVuZWQiLCJjbG9zZURldlRvb2xzIiwiZm9jdXMiLCJibHVyIiwiZWxlbWVudCIsInBvc2l0aW9uIiwib3ZlcmZsb3ciLCJiYWNrZ3JvdW5kQ29sb3IiLCJHUkFZIiwiQ29tcG9uZW50IiwicHJvcFR5cGVzIiwiUHJvcFR5cGVzIiwic3RyaW5nIiwiaXNSZXF1aXJlZCIsIm9iamVjdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7Ozs7O0lBRXFCQSxROzs7QUFDbkIsb0JBQWFDLEtBQWIsRUFBb0I7QUFBQTs7QUFBQSxvSEFDWkEsS0FEWTs7QUFFbEIsVUFBS0Ms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LFNBQU8sZ0JBQU1pRCxTQUFOLENBQWdCRyxNQUFoQixDQUF1QkQ7QUFIWCxDQUFyQiIsImZpbGUiOiJUaW1lbGluZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCBxcyBmcm9tICdxcydcbmltcG9ydCBhc3NpZ24gZnJvbSAnbG9kYXNoLmFzc2lnbidcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQgUGFsZXR0ZSBmcm9tICcuL1BhbGV0dGUnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRpbWVsaW5lIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IgKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpXG4gICAgdGhpcy53ZWJ2aWV3ID0gbnVsbFxuICAgIHRoaXMuc3RhdGUgPSB7fVxuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQgKCkge1xuICAgIHRoaXMuaW5qZWN0V2VidmlldygpXG5cbiAgICBjb25zdCB0b3VyQ2hhbm5lbCA9IHRoaXMucHJvcHMuZW52b3kuZ2V0KCd0b3VyJylcblxuICAgIGlmICghdGhpcy5wcm9wcy5lbnZveS5pc0luTW9ja01vZGUoKSkge1xuICAgICAgdG91ckNoYW5uZWwudGhlbigodG91ckNoYW5uZWwpID0+IHtcbiAgICAgICAgdG91ckNoYW5uZWwub24oJ3RvdXI6cmVxdWVzdFdlYnZpZXdDb29yZGluYXRlcycsIHRoaXMub25SZXF1ZXN0V2Vidmlld0Nvb3JkaW5hdGVzLmJpbmQodGhpcywgdG91ckNoYW5uZWwpKVxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICBvblJlcXVlc3RXZWJ2aWV3Q29vcmRpbmF0ZXMgKHRvdXJDaGFubmVsKSB7XG4gICAgbGV0IHsgdG9wLCBsZWZ0IH0gPSB0aGlzLndlYnZpZXcuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICB0b3VyQ2hhbm5lbC5yZWNlaXZlV2Vidmlld0Nvb3JkaW5hdGVzKCd0aW1lbGluZScsIHsgdG9wLCBsZWZ0IH0pXG4gIH1cblxuICBpbmplY3RXZWJ2aWV3ICgpIHtcbiAgICB0aGlzLndlYnZpZXcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd3ZWJ2aWV3JylcblxuICAgIGNvbnN0IHF1ZXJ5ID0gcXMuc3RyaW5naWZ5KGFzc2lnbih7fSwgdGhpcy5wcm9wcy5oYWlrdSwge1xuICAgICAgcGx1bWJpbmc6IHRoaXMucHJvcHMuaGFpa3UucGx1bWJpbmcudXJsLFxuICAgICAgZm9sZGVyOiB0aGlzLnByb3BzLmZvbGRlcixcbiAgICAgIGVudm95OiB7XG4gICAgICAgIGhvc3Q6IHRoaXMucHJvcHMuZW52b3kuZ2V0T3B0aW9uKCdob3N0JyksXG4gICAgICAgIHBvcnQ6IHRoaXMucHJvcHMuZW52b3kuZ2V0T3B0aW9uKCdwb3J0JylcbiAgICAgIH1cbiAgICB9KSlcblxuICAgIC8vIFdoZW4gYnVpbGRpbmcgYSBkaXN0cmlidXRpb24gKHNlZSAnZGlzdHJvJyByZXBvKSB0aGUgbm9kZV9tb2R1bGVzIGZvbGRlciBpcyBhdCBhIGRpZmZlcmVudCBsZXZlbCAjRklYTUUgbWF0dGhld1xuICAgIGxldCB1cmxcbiAgICBpZiAocHJvY2Vzcy5lbnYuSEFJS1VfVElNRUxJTkVfVVJMX01PREUgPT09ICdkaXN0cm8nKSB7XG4gICAgICB1cmwgPSBgZmlsZTovLyR7cGF0aC5qb2luKF9fZGlybmFtZSwgJy4uJywgJy4uJywgJy4uJywgJy4uJywgJy4uJywgJ25vZGVfbW9kdWxlcycsICdoYWlrdS10aW1lbGluZScsICdpbmRleC5odG1sJyl9PyR7cXVlcnl9YFxuICAgIH0gZWxzZSB7XG4gICAgICB1cmwgPSBgZmlsZTovLyR7cGF0aC5qb2luKF9fZGlybmFtZSwgJy4uJywgJy4uJywgJy4uJywgJ25vZGVfbW9kdWxlcycsICdoYWlrdS10aW1lbGluZScsICdpbmRleC5odG1sJyl9PyR7cXVlcnl9YFxuICAgIH1cblxuICAgIHRoaXMud2Vidmlldy5zZXRBdHRyaWJ1dGUoJ3NyYycsIHVybClcbiAgICB0aGlzLndlYnZpZXcuc2V0QXR0cmlidXRlKCdwbHVnaW5zJywgdHJ1ZSlcbiAgICB0aGlzLndlYnZpZXcuc2V0QXR0cmlidXRlKCdub2RlaW50ZWdyYXRpb24nLCB0cnVlKVxuICAgIHRoaXMud2Vidmlldy5zZXRBdHRyaWJ1dGUoJ2Rpc2FibGV3ZWJzZWN1cml0eScsIHRydWUpXG4gICAgdGhpcy53ZWJ2aWV3LnNldEF0dHJpYnV0ZSgnYWxsb3dwb3B1cHMnLCB0cnVlKVxuICAgIHRoaXMud2Vidmlldy5zdHlsZS53aWR0aCA9ICcxMDAlJ1xuICAgIHRoaXMud2Vidmlldy5zdHlsZS5oZWlnaHQgPSAnMTAwJSdcbiAgICB0aGlzLndlYnZpZXcuYWRkRXZlbnRMaXN0ZW5lcignZG9tLXJlYWR5JywgKCkgPT4ge1xuICAgICAgaWYgKHByb2Nlc3MuZW52LkRFViA9PT0gJzEnKSB0aGlzLndlYnZpZXcub3BlbkRldlRvb2xzKClcbiAgICB9KVxuICAgIHdoaWxlICh0aGlzLm1vdW50LmZpcnN0Q2hpbGQpIHRoaXMubW91bnQucmVtb3ZlQ2hpbGQodGhpcy5tb3VudC5maXJzdENoaWxkKVxuICAgIHRoaXMubW91bnQuYXBwZW5kQ2hpbGQodGhpcy53ZWJ2aWV3KVxuICB9XG5cbiAgdG9nZ2xlRGV2VG9vbHMgKCkge1xuICAgIGlmICh0aGlzLndlYnZpZXcpIHtcbiAgICAgIGlmICh0aGlzLndlYnZpZXcuaXNEZXZUb29sc09wZW5lZCgpKSB0aGlzLndlYnZpZXcuY2xvc2VEZXZUb29scygpXG4gICAgICBlbHNlIHRoaXMud2Vidmlldy5vcGVuRGV2VG9vbHMoKVxuICAgIH1cbiAgfVxuXG4gIHJlbmRlciAoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXZcbiAgICAgICAgaWQ9J3RpbWVsaW5lLW1vdW50J1xuICAgICAgICBvbk1vdXNlT3Zlcj17KCkgPT4gdGhpcy53ZWJ2aWV3LmZvY3VzKCl9XG4gICAgICAgIG9uTW91c2VPdXQ9eygpID0+IHRoaXMud2Vidmlldy5ibHVyKCl9XG4gICAgICAgIHJlZj17KGVsZW1lbnQpID0+IHsgdGhpcy5tb3VudCA9IGVsZW1lbnQgfX1cbiAgICAgICAgc3R5bGU9e3sgcG9zaXRpb246ICdhYnNvbHV0ZScsIG92ZXJmbG93OiAnYXV0bycsIHdpZHRoOiAnMTAwJScsIGhlaWdodDogJzEwMCUnLCBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuR1JBWSB9fSAvPlxuICAgIClcbiAgfVxufVxuXG5UaW1lbGluZS5wcm9wVHlwZXMgPSB7XG4gIGZvbGRlcjogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICBoYWlrdTogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICBlbnZveTogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkXG59XG4iXX0=