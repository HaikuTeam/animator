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
          lineNumber: 84
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9yZWFjdC9jb21wb25lbnRzL1RpbWVsaW5lLmpzIl0sIm5hbWVzIjpbIlRpbWVsaW5lIiwicHJvcHMiLCJ3ZWJ2aWV3Iiwic3RhdGUiLCJvblJlcXVlc3RXZWJ2aWV3Q29vcmRpbmF0ZXMiLCJiaW5kIiwiaW5qZWN0V2VidmlldyIsInRvdXJDaGFubmVsIiwiZW52b3kiLCJnZXQiLCJpc0luTW9ja01vZGUiLCJ0aGVuIiwib24iLCJvZmYiLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJ0b3AiLCJsZWZ0IiwicmVjZWl2ZVdlYnZpZXdDb29yZGluYXRlcyIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsInF1ZXJ5Iiwic3RyaW5naWZ5IiwiaGFpa3UiLCJwbHVtYmluZyIsInVybCIsImZvbGRlciIsImhvc3QiLCJnZXRPcHRpb24iLCJwb3J0IiwicHJvY2VzcyIsImVudiIsIkhBSUtVX1RJTUVMSU5FX1VSTF9NT0RFIiwiam9pbiIsIl9fZGlybmFtZSIsInNldEF0dHJpYnV0ZSIsInN0eWxlIiwid2lkdGgiLCJoZWlnaHQiLCJhZGRFdmVudExpc3RlbmVyIiwiREVWIiwib3BlbkRldlRvb2xzIiwibW91bnQiLCJmaXJzdENoaWxkIiwicmVtb3ZlQ2hpbGQiLCJhcHBlbmRDaGlsZCIsImlzRGV2VG9vbHNPcGVuZWQiLCJjbG9zZURldlRvb2xzIiwiZm9jdXMiLCJibHVyIiwiZWxlbWVudCIsInBvc2l0aW9uIiwib3ZlcmZsb3ciLCJiYWNrZ3JvdW5kQ29sb3IiLCJHUkFZIiwiQ29tcG9uZW50IiwicHJvcFR5cGVzIiwiUHJvcFR5cGVzIiwic3RyaW5nIiwiaXNSZXF1aXJlZCIsIm9iamVjdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7Ozs7O0lBRXFCQSxROzs7QUFDbkIsb0JBQWFDLEtBQWIsRUFBb0I7QUFBQTs7QUFBQSxvSEFDWkEsS0FEWTs7QUFFbEIs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UUMsSUFBbEcsRUFMVDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsUUFERjtBQVFEOzs7O0VBcEZtQyxnQkFBTUMsUzs7a0JBQXZCdEQsUTs7O0FBdUZyQkEsU0FBU3VELFNBQVQsR0FBcUI7QUFDbkI5QixVQUFRLGdCQUFNK0IsU0FBTixDQUFnQkMsTUFBaEIsQ0FBdUJDLFVBRFo7QUFFbkJwQyxTQUFPLGdCQUFNa0MsU0FBTixDQUFnQkcsTUFBaEIsQ0FBdUJELFVBRlg7QUFHbkJsRCxTQUFPLGdCQUFNZ0QsU0FBTixDQUFnQkcsTUFBaEIsQ0FBdUJEO0FBSFgsQ0FBckIiLCJmaWxlIjoiVGltZWxpbmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgcXMgZnJvbSAncXMnXG5pbXBvcnQgYXNzaWduIGZyb20gJ2xvZGFzaC5hc3NpZ24nXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IFBhbGV0dGUgZnJvbSAnLi9QYWxldHRlJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUaW1lbGluZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yIChwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKVxuICAgIHRoaXMud2VidmlldyA9IG51bGxcbiAgICB0aGlzLnN0YXRlID0ge31cbiAgICB0aGlzLm9uUmVxdWVzdFdlYnZpZXdDb29yZGluYXRlcyA9IHRoaXMub25SZXF1ZXN0V2Vidmlld0Nvb3JkaW5hdGVzLmJpbmQodGhpcylcbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50ICgpIHtcbiAgICB0aGlzLmluamVjdFdlYnZpZXcoKVxuXG4gICAgY29uc3QgdG91ckNoYW5uZWwgPSB0aGlzLnByb3BzLmVudm95LmdldCgndG91cicpXG5cbiAgICBpZiAoIXRoaXMucHJvcHMuZW52b3kuaXNJbk1vY2tNb2RlKCkpIHtcbiAgICAgIHRvdXJDaGFubmVsLnRoZW4oKHRvdXJDaGFubmVsKSA9PiB7XG4gICAgICAgIHRoaXMudG91ckNoYW5uZWwgPSB0b3VyQ2hhbm5lbFxuICAgICAgICB0aGlzLnRvdXJDaGFubmVsLm9uKCd0b3VyOnJlcXVlc3RXZWJ2aWV3Q29vcmRpbmF0ZXMnLCB0aGlzLm9uUmVxdWVzdFdlYnZpZXdDb29yZGluYXRlcylcbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQgKCkge1xuICAgIGlmICh0aGlzLnRvdXJDaGFubmVsKSB7XG4gICAgICB0aGlzLnRvdXJDaGFubmVsLm9mZigndG91cjpyZXF1ZXN0V2Vidmlld0Nvb3JkaW5hdGVzJywgdGhpcy5vblJlcXVlc3RXZWJ2aWV3Q29vcmRpbmF0ZXMpXG4gICAgfVxuICB9XG5cbiAgb25SZXF1ZXN0V2Vidmlld0Nvb3JkaW5hdGVzICgpIHtcbiAgICBsZXQgeyB0b3AsIGxlZnQgfSA9IHRoaXMud2Vidmlldy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICAgIGlmICh0aGlzLnRvdXJDaGFubmVsKSB7XG4gICAgICB0aGlzLnRvdXJDaGFubmVsLnJlY2VpdmVXZWJ2aWV3Q29vcmRpbmF0ZXMoJ3RpbWVsaW5lJywgeyB0b3AsIGxlZnQgfSlcbiAgICB9XG4gIH1cblxuICBpbmplY3RXZWJ2aWV3ICgpIHtcbiAgICB0aGlzLndlYnZpZXcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd3ZWJ2aWV3JylcblxuICAgIGNvbnN0IHF1ZXJ5ID0gcXMuc3RyaW5naWZ5KGFzc2lnbih7fSwgdGhpcy5wcm9wcy5oYWlrdSwge1xuICAgICAgcGx1bWJpbmc6IHRoaXMucHJvcHMuaGFpa3UucGx1bWJpbmcudXJsLFxuICAgICAgZm9sZGVyOiB0aGlzLnByb3BzLmZvbGRlcixcbiAgICAgIGVudm95OiB7XG4gICAgICAgIGhvc3Q6IHRoaXMucHJvcHMuZW52b3kuZ2V0T3B0aW9uKCdob3N0JyksXG4gICAgICAgIHBvcnQ6IHRoaXMucHJvcHMuZW52b3kuZ2V0T3B0aW9uKCdwb3J0JylcbiAgICAgIH1cbiAgICB9KSlcblxuICAgIC8vIFdoZW4gYnVpbGRpbmcgYSBkaXN0cmlidXRpb24gKHNlZSAnZGlzdHJvJyByZXBvKSB0aGUgbm9kZV9tb2R1bGVzIGZvbGRlciBpcyBhdCBhIGRpZmZlcmVudCBsZXZlbCAjRklYTUUgbWF0dGhld1xuICAgIGxldCB1cmxcbiAgICBpZiAocHJvY2Vzcy5lbnYuSEFJS1VfVElNRUxJTkVfVVJMX01PREUgPT09ICdkaXN0cm8nKSB7XG4gICAgICB1cmwgPSBgZmlsZTovLyR7cGF0aC5qb2luKF9fZGlybmFtZSwgJy4uJywgJy4uJywgJy4uJywgJy4uJywgJy4uJywgJ25vZGVfbW9kdWxlcycsICdoYWlrdS10aW1lbGluZScsICdpbmRleC5odG1sJyl9PyR7cXVlcnl9YFxuICAgIH0gZWxzZSB7XG4gICAgICB1cmwgPSBgZmlsZTovLyR7cGF0aC5qb2luKF9fZGlybmFtZSwgJy4uJywgJy4uJywgJy4uJywgJ25vZGVfbW9kdWxlcycsICdoYWlrdS10aW1lbGluZScsICdpbmRleC5odG1sJyl9PyR7cXVlcnl9YFxuICAgIH1cblxuICAgIHRoaXMud2Vidmlldy5zZXRBdHRyaWJ1dGUoJ3NyYycsIHVybClcbiAgICB0aGlzLndlYnZpZXcuc2V0QXR0cmlidXRlKCdwbHVnaW5zJywgdHJ1ZSlcbiAgICB0aGlzLndlYnZpZXcuc2V0QXR0cmlidXRlKCdub2RlaW50ZWdyYXRpb24nLCB0cnVlKVxuICAgIHRoaXMud2Vidmlldy5zZXRBdHRyaWJ1dGUoJ2Rpc2FibGV3ZWJzZWN1cml0eScsIHRydWUpXG4gICAgdGhpcy53ZWJ2aWV3LnNldEF0dHJpYnV0ZSgnYWxsb3dwb3B1cHMnLCB0cnVlKVxuICAgIHRoaXMud2Vidmlldy5zdHlsZS53aWR0aCA9ICcxMDAlJ1xuICAgIHRoaXMud2Vidmlldy5zdHlsZS5oZWlnaHQgPSAnMTAwJSdcbiAgICB0aGlzLndlYnZpZXcuYWRkRXZlbnRMaXN0ZW5lcignZG9tLXJlYWR5JywgKCkgPT4ge1xuICAgICAgaWYgKHByb2Nlc3MuZW52LkRFViA9PT0gJzEnKSB0aGlzLndlYnZpZXcub3BlbkRldlRvb2xzKClcbiAgICB9KVxuICAgIHdoaWxlICh0aGlzLm1vdW50LmZpcnN0Q2hpbGQpIHRoaXMubW91bnQucmVtb3ZlQ2hpbGQodGhpcy5tb3VudC5maXJzdENoaWxkKVxuICAgIHRoaXMubW91bnQuYXBwZW5kQ2hpbGQodGhpcy53ZWJ2aWV3KVxuICB9XG5cbiAgdG9nZ2xlRGV2VG9vbHMgKCkge1xuICAgIGlmICh0aGlzLndlYnZpZXcpIHtcbiAgICAgIGlmICh0aGlzLndlYnZpZXcuaXNEZXZUb29sc09wZW5lZCgpKSB0aGlzLndlYnZpZXcuY2xvc2VEZXZUb29scygpXG4gICAgICBlbHNlIHRoaXMud2Vidmlldy5vcGVuRGV2VG9vbHMoKVxuICAgIH1cbiAgfVxuXG4gIHJlbmRlciAoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXZcbiAgICAgICAgaWQ9J3RpbWVsaW5lLW1vdW50J1xuICAgICAgICBvbk1vdXNlT3Zlcj17KCkgPT4gdGhpcy53ZWJ2aWV3LmZvY3VzKCl9XG4gICAgICAgIG9uTW91c2VPdXQ9eygpID0+IHRoaXMud2Vidmlldy5ibHVyKCl9XG4gICAgICAgIHJlZj17KGVsZW1lbnQpID0+IHsgdGhpcy5tb3VudCA9IGVsZW1lbnQgfX1cbiAgICAgICAgc3R5bGU9e3sgcG9zaXRpb246ICdhYnNvbHV0ZScsIG92ZXJmbG93OiAnYXV0bycsIHdpZHRoOiAnMTAwJScsIGhlaWdodDogJzEwMCUnLCBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuR1JBWSB9fSAvPlxuICAgIClcbiAgfVxufVxuXG5UaW1lbGluZS5wcm9wVHlwZXMgPSB7XG4gIGZvbGRlcjogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICBoYWlrdTogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICBlbnZveTogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkXG59XG4iXX0=