'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _jsxFileName = 'src/react/components/Stage.js';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _qs = require('qs');

var _qs2 = _interopRequireDefault(_qs);

var _lodash = require('lodash.assign');

var _lodash2 = _interopRequireDefault(_lodash);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _StageTitleBar = require('./StageTitleBar');

var _StageTitleBar2 = _interopRequireDefault(_StageTitleBar);

var _Palette = require('./Palette');

var _Palette2 = _interopRequireDefault(_Palette);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var STAGE_BOX_STYLE = {
  position: 'relative',
  overflow: 'hidden',
  padding: 0,
  margin: 0,
  width: '100%',
  height: '100%'
};

var Stage = function (_React$Component) {
  _inherits(Stage, _React$Component);

  function Stage(props) {
    _classCallCheck(this, Stage);

    var _this = _possibleConstructorReturn(this, (Stage.__proto__ || Object.getPrototypeOf(Stage)).call(this, props));

    _this.webview = null;
    _this.state = {};
    return _this;
  }

  _createClass(Stage, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      this.injectWebview();

      var tourChannel = this.props.envoy.get('tour');

      if (!this.props.envoy.isInMockMode()) {
        tourChannel.then(function (client) {
          _this2.tourClient = client;
          _this2.tourClient.on('tour:requestWebviewCoordinates', _this2.onRequestWebviewCoordinates.bind(_this2));
        });
      }
    }
  }, {
    key: 'onRequestWebviewCoordinates',
    value: function onRequestWebviewCoordinates() {
      var _webview$getBoundingC = this.webview.getBoundingClientRect(),
          top = _webview$getBoundingC.top,
          left = _webview$getBoundingC.left;

      this.tourClient.receiveWebviewCoordinates('glass', { top: top, left: left });
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
      if (process.env.HAIKU_GLASS_URL_MODE === 'distro') {
        url = 'file://' + _path2.default.join(__dirname, '..', '..', '..', '..', '..', 'node_modules', 'haiku-glass', 'index.html') + '?' + query;
      } else {
        url = 'file://' + _path2.default.join(__dirname, '..', '..', '..', 'node_modules', 'haiku-glass', 'index.html') + '?' + query;
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
    key: 'handleDrop',
    value: function handleDrop(libraryItemInfo, clientX, clientY) {
      var _this4 = this;

      var stageRect = this.mount.getBoundingClientRect();
      if (clientX > stageRect.left && clientX < stageRect.right && clientY > stageRect.top && clientY < stageRect.bottom) {
        var offsetX = clientX - stageRect.left;
        var offsetY = clientY - stageRect.top;
        var abspath = libraryItemInfo.preview;
        var metadata = { offsetX: offsetX, offsetY: offsetY, glassOnly: true };
        this.props.websocket.request({ type: 'action', method: 'instantiateComponent', params: [this.props.folder, abspath, metadata] }, function (err) {
          if (err) return _this4.props.createNotice({ type: 'error', title: 'Error', message: err.message });
        });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this5 = this;

      return _react2.default.createElement(
        'div',
        { className: 'layout-box',
          onMouseOver: function onMouseOver() {
            return _this5.webview.focus();
          },
          onMouseOut: function onMouseOut() {
            return _this5.webview.blur();
          }, __source: {
            fileName: _jsxFileName,
            lineNumber: 112
          },
          __self: this
        },
        _react2.default.createElement(
          'div',
          { className: 'stage-box', style: STAGE_BOX_STYLE, __source: {
              fileName: _jsxFileName,
              lineNumber: 115
            },
            __self: this
          },
          _react2.default.createElement(_StageTitleBar2.default, {
            folder: this.props.folder,
            websocket: this.props.websocket,
            project: this.props.project,
            createNotice: this.props.createNotice,
            removeNotice: this.props.removeNotice,
            organizationName: this.props.organizationName,
            authToken: this.props.authToken,
            username: this.props.username,
            password: this.props.password,
            receiveProjectInfo: this.props.receiveProjectInfo,
            tourClient: this.tourClient, __source: {
              fileName: _jsxFileName,
              lineNumber: 116
            },
            __self: this
          }),
          _react2.default.createElement('div', {
            id: 'stage-mount',
            ref: function ref(element) {
              _this5.mount = element;
            },
            style: { position: 'absolute', overflow: 'auto', width: '100%', height: 'calc(100% - 36px)', backgroundColor: _Palette2.default.GRAY }, __source: {
              fileName: _jsxFileName,
              lineNumber: 128
            },
            __self: this
          })
        )
      );
    }
  }]);

  return Stage;
}(_react2.default.Component);

exports.default = Stage;


Stage.propTypes = {
  folder: _react2.default.PropTypes.string.isRequired,
  haiku: _react2.default.PropTypes.object.isRequired,
  envoy: _react2.default.PropTypes.object.isRequired,
  websocket: _react2.default.PropTypes.object.isRequired,
  project: _react2.default.PropTypes.object.isRequired,
  createNotice: _react2.default.PropTypes.func.isRequired,
  removeNotice: _react2.default.PropTypes.func.isRequired,
  receiveProjectInfo: _react2.default.PropTypes.func,
  organizationName: _react2.default.PropTypes.string,
  authToken: _react2.default.PropTypes.string,
  username: _react2.default.PropTypes.string,
  password: _react2.default.PropTypes.string
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9yZWFjdC9jb21wb25lbnRzL1N0YWdlLmpzIl0sIm5hbWVzIjpbIlNUQUdFX0JPWF9TVFlMRSIsInBvc2l0aW9uIiwib3ZlcmZsb3ciLCJwYWRkaW5nIiwibWFyZ2luIiwid2lkdGgiLCJoZWlnaHQiLCJTdGFnZSIsInByb3BzIiwid2VidmlldyIsInN0YXRlIiwiaW5qZWN0V2VidmlldyIsInRvdXJDaGFubmVsIiwiZW52b3kiLCJnZXQiLCJpc0luTW9ja01vZGUiLCJ0aGVuIiwiY2xpZW50IiwidG91ckNsaWVudCIsIm9uIiwib25SZXF1ZXN0V2Vidmlld0Nvb3JkaW5hdGVzIiwiYmluZCIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsInRvcCIsImxlZnQiLCJyZWNlaXZlV2Vidmlld0Nvb3JkaW5hdGVzIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwicXVlcnkiLCJzdHJpbmdpZnkiLCJoYWlrdSIsInBsdW1iaW5nIiwidXJsIiwiZm9sZGVyIiwiaG9zdCIsImdldE9wdGlvbiIsInBvcnQiLCJwcm9jZXNzIiwiZW52IiwiSEFJS1VfR0xBU1NfVVJMX01PREUiLCJqb2luIiwiX19kaXJuYW1lIiwic2V0QXR0cmlidXRlIiwic3R5bGUiLCJhZGRFdmVudExpc3RlbmVyIiwiZXZlbnQiLCJsZXZlbCIsIm1lc3NhZ2UiLCJzbGljZSIsIm1zZyIsInJlcGxhY2UiLCJ0cmltIiwibm90aWNlIiwiY3JlYXRlTm90aWNlIiwidHlwZSIsInRpdGxlIiwid2luZG93Iiwic2V0VGltZW91dCIsInJlbW92ZU5vdGljZSIsInVuZGVmaW5lZCIsImlkIiwiREVWIiwib3BlbkRldlRvb2xzIiwibW91bnQiLCJmaXJzdENoaWxkIiwicmVtb3ZlQ2hpbGQiLCJhcHBlbmRDaGlsZCIsImlzRGV2VG9vbHNPcGVuZWQiLCJjbG9zZURldlRvb2xzIiwibGlicmFyeUl0ZW1JbmZvIiwiY2xpZW50WCIsImNsaWVudFkiLCJzdGFnZVJlY3QiLCJyaWdodCIsImJvdHRvbSIsIm9mZnNldFgiLCJvZmZzZXRZIiwiYWJzcGF0aCIsInByZXZpZXciLCJtZXRhZGF0YSIsImdsYXNzT25seSIsIndlYnNvY2tldCIsInJlcXVlc3QiLCJtZXRob2QiLCJwYXJhbXMiLCJlcnIiLCJmb2N1cyIsImJsdXIiLCJwcm9qZWN0Iiwib3JnYW5pemF0aW9uTmFtZSIsImF1dGhUb2tlbiIsInVzZXJuYW1lIiwicGFzc3dvcmQiLCJyZWNlaXZlUHJvamVjdEluZm8iLCJlbGVtZW50IiwiYmFja2dyb3VuZENvbG9yIiwiR1JBWSIsIkNvbXBvbmVudCIsInByb3BUeXBlcyIsIlByb3BUeXBlcyIsInN0cmluZyIsImlzUmVxdWlyZWQiLCJvYmplY3QiLCJmdW5jIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7OztBQUVBLElBQU1BLGtCQUFrQjtBQUN0QkMsWUFBVSxVQURZO0FBRXRCQyxZQUFVLFFBRlk7QUFHdEJDLFdBQVMsQ0FIYTtBQUl0QkMsVUFBUSxDQUpjO0FBS3RCQyxTQUFPLE1BTGU7QUFNdEJDLFVBQVE7QUFOYyxDQUF4Qjs7SUFTcUJDLEs7OztBQUNuQixpQkFBYUMsS0FBYixFQUFvQjtBQUFBOztBQUFBLDhHQUNaQSxLQURZOztBQUVsQixVQUFLQyxPQUFMLEdBQWUsSUFBZjtBQUNBLFVBQUtDLEtBQUwsR0FBYSxFQUFiO0FBSGtCO0FBSW5COzs7O3dDQUVvQjtBQUFBOztBQUNuQixXQUFLQyxhQUFMOztBQUVBLFVBQU1DLGNBQWMsS0FBS0osS0FBTCxDQUFXSyxLQUFYLENBQWlCQyxHQUFqQixDQUFxQixNQUFyQixDQUFwQjs7QUFFQSxVQUFJLENBQUMsS0FBS04sS0FBTCxDQUFXSyxLQUFYLENBQWlCRSxZQUFqQixFQUFMLEVBQXNDO0FBQ3BDSCxvQkFBWUksSUFBWixDQUFpQixVQUFDQyxNQUFELEVBQVk7QUFDM0IsaUJBQUtDLFVBQUwsR0FBa0JELE1BQWxCO0FBQ0EsaUJB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Q0FBZ0JJLElBUnBCO0FBU2hCZCxvQkFBa0IsZ0JBQU1VLFNBQU4sQ0FBZ0JDLE1BVGxCO0FBVWhCVixhQUFXLGdCQUFNUyxTQUFOLENBQWdCQyxNQVZYO0FBV2hCVCxZQUFVLGdCQUFNUSxTQUFOLENBQWdCQyxNQVhWO0FBWWhCUixZQUFVLGdCQUFNTyxTQUFOLENBQWdCQztBQVpWLENBQWxCIiwiZmlsZSI6IlN0YWdlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHFzIGZyb20gJ3FzJ1xuaW1wb3J0IGFzc2lnbiBmcm9tICdsb2Rhc2guYXNzaWduJ1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcbmltcG9ydCBTdGFnZVRpdGxlQmFyIGZyb20gJy4vU3RhZ2VUaXRsZUJhcidcbmltcG9ydCBQYWxldHRlIGZyb20gJy4vUGFsZXR0ZSdcblxuY29uc3QgU1RBR0VfQk9YX1NUWUxFID0ge1xuICBwb3NpdGlvbjogJ3JlbGF0aXZlJyxcbiAgb3ZlcmZsb3c6ICdoaWRkZW4nLFxuICBwYWRkaW5nOiAwLFxuICBtYXJnaW46IDAsXG4gIHdpZHRoOiAnMTAwJScsXG4gIGhlaWdodDogJzEwMCUnXG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFN0YWdlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IgKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpXG4gICAgdGhpcy53ZWJ2aWV3ID0gbnVsbFxuICAgIHRoaXMuc3RhdGUgPSB7fVxuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQgKCkge1xuICAgIHRoaXMuaW5qZWN0V2VidmlldygpXG5cbiAgICBjb25zdCB0b3VyQ2hhbm5lbCA9IHRoaXMucHJvcHMuZW52b3kuZ2V0KCd0b3VyJylcblxuICAgIGlmICghdGhpcy5wcm9wcy5lbnZveS5pc0luTW9ja01vZGUoKSkge1xuICAgICAgdG91ckNoYW5uZWwudGhlbigoY2xpZW50KSA9PiB7XG4gICAgICAgIHRoaXMudG91ckNsaWVudCA9IGNsaWVudFxuICAgICAgICB0aGlzLnRvdXJDbGllbnQub24oJ3RvdXI6cmVxdWVzdFdlYnZpZXdDb29yZGluYXRlcycsIHRoaXMub25SZXF1ZXN0V2Vidmlld0Nvb3JkaW5hdGVzLmJpbmQodGhpcykpXG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIG9uUmVxdWVzdFdlYnZpZXdDb29yZGluYXRlcyAoKSB7XG4gICAgbGV0IHsgdG9wLCBsZWZ0IH0gPSB0aGlzLndlYnZpZXcuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICB0aGlzLnRvdXJDbGllbnQucmVjZWl2ZVdlYnZpZXdDb29yZGluYXRlcygnZ2xhc3MnLCB7IHRvcCwgbGVmdCB9KVxuICB9XG5cbiAgaW5qZWN0V2VidmlldyAoKSB7XG4gICAgdGhpcy53ZWJ2aWV3ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnd2VidmlldycpXG5cbiAgICBjb25zdCBxdWVyeSA9IHFzLnN0cmluZ2lmeShhc3NpZ24oe30sIHRoaXMucHJvcHMuaGFpa3UsIHtcbiAgICAgIHBsdW1iaW5nOiB0aGlzLnByb3BzLmhhaWt1LnBsdW1iaW5nLnVybCxcbiAgICAgIGZvbGRlcjogdGhpcy5wcm9wcy5mb2xkZXIsXG4gICAgICBlbnZveToge1xuICAgICAgICBob3N0OiB0aGlzLnByb3BzLmVudm95LmdldE9wdGlvbignaG9zdCcpLFxuICAgICAgICBwb3J0OiB0aGlzLnByb3BzLmVudm95LmdldE9wdGlvbigncG9ydCcpXG4gICAgICB9XG4gICAgfSkpXG5cbiAgICAvLyBXaGVuIGJ1aWxkaW5nIGEgZGlzdHJpYnV0aW9uIChzZWUgJ2Rpc3RybycgcmVwbykgdGhlIG5vZGVfbW9kdWxlcyBmb2xkZXIgaXMgYXQgYSBkaWZmZXJlbnQgbGV2ZWwgI0ZJWE1FIG1hdHRoZXdcbiAgICBsZXQgdXJsXG4gICAgaWYgKHByb2Nlc3MuZW52LkhBSUtVX0dMQVNTX1VSTF9NT0RFID09PSAnZGlzdHJvJykge1xuICAgICAgdXJsID0gYGZpbGU6Ly8ke3BhdGguam9pbihfX2Rpcm5hbWUsICcuLicsICcuLicsICcuLicsICcuLicsICcuLicsICdub2RlX21vZHVsZXMnLCAnaGFpa3UtZ2xhc3MnLCAnaW5kZXguaHRtbCcpfT8ke3F1ZXJ5fWBcbiAgICB9IGVsc2Uge1xuICAgICAgdXJsID0gYGZpbGU6Ly8ke3BhdGguam9pbihfX2Rpcm5hbWUsICcuLicsICcuLicsICcuLicsICdub2RlX21vZHVsZXMnLCAnaGFpa3UtZ2xhc3MnLCAnaW5kZXguaHRtbCcpfT8ke3F1ZXJ5fWBcbiAgICB9XG5cbiAgICB0aGlzLndlYnZpZXcuc2V0QXR0cmlidXRlKCdzcmMnLCB1cmwpXG4gICAgdGhpcy53ZWJ2aWV3LnNldEF0dHJpYnV0ZSgncGx1Z2lucycsIHRydWUpXG4gICAgdGhpcy53ZWJ2aWV3LnNldEF0dHJpYnV0ZSgnbm9kZWludGVncmF0aW9uJywgdHJ1ZSlcbiAgICB0aGlzLndlYnZpZXcuc2V0QXR0cmlidXRlKCdkaXNhYmxld2Vic2VjdXJpdHknLCB0cnVlKVxuICAgIHRoaXMud2Vidmlldy5zZXRBdHRyaWJ1dGUoJ2FsbG93cG9wdXBzJywgdHJ1ZSlcbiAgICB0aGlzLndlYnZpZXcuc3R5bGUud2lkdGggPSAnMTAwJSdcbiAgICB0aGlzLndlYnZpZXcuc3R5bGUuaGVpZ2h0ID0gJzEwMCUnXG5cbiAgICB0aGlzLndlYnZpZXcuYWRkRXZlbnRMaXN0ZW5lcignY29uc29sZS1tZXNzYWdlJywgKGV2ZW50KSA9PiB7XG4gICAgICBzd2l0Y2ggKGV2ZW50LmxldmVsKSB7XG4gICAgICAgIGNhc2UgMDpcbiAgICAgICAgICBpZiAoZXZlbnQubWVzc2FnZS5zbGljZSgwLCA4KSA9PT0gJ1tub3RpY2VdJykge1xuICAgICAgICAgICAgdmFyIG1zZyA9IGV2ZW50Lm1lc3NhZ2UucmVwbGFjZSgnW25vdGljZV0nLCAnJykudHJpbSgpXG4gICAgICAgICAgICB2YXIgbm90aWNlID0gdGhpcy5wcm9wcy5jcmVhdGVOb3RpY2UoeyB0eXBlOiAnaW5mbycsIHRpdGxlOiAnTm90aWNlJywgbWVzc2FnZTogbXNnIH0pXG4gICAgICAgICAgICB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgIHRoaXMucHJvcHMucmVtb3ZlTm90aWNlKHVuZGVmaW5lZCwgbm90aWNlLmlkKVxuICAgICAgICAgICAgfSwgMTAwMClcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWtcbiAgICAgIH1cbiAgICB9KVxuICAgIHRoaXMud2Vidmlldy5hZGRFdmVudExpc3RlbmVyKCdkb20tcmVhZHknLCAoKSA9PiB7XG4gICAgICBpZiAocHJvY2Vzcy5lbnYuREVWID09PSAnMScpIHRoaXMud2Vidmlldy5vcGVuRGV2VG9vbHMoKVxuICAgIH0pXG4gICAgd2hpbGUgKHRoaXMubW91bnQuZmlyc3RDaGlsZCkgdGhpcy5tb3VudC5yZW1vdmVDaGlsZCh0aGlzLm1vdW50LmZpcnN0Q2hpbGQpXG4gICAgdGhpcy5tb3VudC5hcHBlbmRDaGlsZCh0aGlzLndlYnZpZXcpXG4gIH1cblxuICB0b2dnbGVEZXZUb29scyAoKSB7XG4gICAgaWYgKHRoaXMud2Vidmlldykge1xuICAgICAgaWYgKHRoaXMud2Vidmlldy5pc0RldlRvb2xzT3BlbmVkKCkpIHRoaXMud2Vidmlldy5jbG9zZURldlRvb2xzKClcbiAgICAgIGVsc2UgdGhpcy53ZWJ2aWV3Lm9wZW5EZXZUb29scygpXG4gICAgfVxuICB9XG5cbiAgaGFuZGxlRHJvcCAobGlicmFyeUl0ZW1JbmZvLCBjbGllbnRYLCBjbGllbnRZKSB7XG4gICAgdmFyIHN0YWdlUmVjdCA9IHRoaXMubW91bnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICBpZiAoY2xpZW50WCA+IHN0YWdlUmVjdC5sZWZ0ICYmIGNsaWVudFggPCBzdGFnZVJlY3QucmlnaHQgJiYgY2xpZW50WSA+IHN0YWdlUmVjdC50b3AgJiYgY2xpZW50WSA8IHN0YWdlUmVjdC5ib3R0b20pIHtcbiAgICAgIHZhciBvZmZzZXRYID0gY2xpZW50WCAtIHN0YWdlUmVjdC5sZWZ0XG4gICAgICB2YXIgb2Zmc2V0WSA9IGNsaWVudFkgLSBzdGFnZVJlY3QudG9wXG4gICAgICB2YXIgYWJzcGF0aCA9IGxpYnJhcnlJdGVtSW5mby5wcmV2aWV3XG4gICAgICBjb25zdCBtZXRhZGF0YSA9IHsgb2Zmc2V0WCwgb2Zmc2V0WSwgZ2xhc3NPbmx5OiB0cnVlIH1cbiAgICAgIHRoaXMucHJvcHMud2Vic29ja2V0LnJlcXVlc3QoeyB0eXBlOiAnYWN0aW9uJywgbWV0aG9kOiAnaW5zdGFudGlhdGVDb21wb25lbnQnLCBwYXJhbXM6IFt0aGlzLnByb3BzLmZvbGRlciwgYWJzcGF0aCwgbWV0YWRhdGFdIH0sIChlcnIpID0+IHtcbiAgICAgICAgaWYgKGVycikgcmV0dXJuIHRoaXMucHJvcHMuY3JlYXRlTm90aWNlKHsgdHlwZTogJ2Vycm9yJywgdGl0bGU6ICdFcnJvcicsIG1lc3NhZ2U6IGVyci5tZXNzYWdlIH0pXG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIHJlbmRlciAoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPSdsYXlvdXQtYm94J1xuICAgICAgICBvbk1vdXNlT3Zlcj17KCkgPT4gdGhpcy53ZWJ2aWV3LmZvY3VzKCl9XG4gICAgICAgIG9uTW91c2VPdXQ9eygpID0+IHRoaXMud2Vidmlldy5ibHVyKCl9PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nc3RhZ2UtYm94JyBzdHlsZT17U1RBR0VfQk9YX1NUWUxFfT5cbiAgICAgICAgICA8U3RhZ2VUaXRsZUJhclxuICAgICAgICAgICAgZm9sZGVyPXt0aGlzLnByb3BzLmZvbGRlcn1cbiAgICAgICAgICAgIHdlYnNvY2tldD17dGhpcy5wcm9wcy53ZWJzb2NrZXR9XG4gICAgICAgICAgICBwcm9qZWN0PXt0aGlzLnByb3BzLnByb2plY3R9XG4gICAgICAgICAgICBjcmVhdGVOb3RpY2U9e3RoaXMucHJvcHMuY3JlYXRlTm90aWNlfVxuICAgICAgICAgICAgcmVtb3ZlTm90aWNlPXt0aGlzLnByb3BzLnJlbW92ZU5vdGljZX1cbiAgICAgICAgICAgIG9yZ2FuaXphdGlvbk5hbWU9e3RoaXMucHJvcHMub3JnYW5pemF0aW9uTmFtZX1cbiAgICAgICAgICAgIGF1dGhUb2tlbj17dGhpcy5wcm9wcy5hdXRoVG9rZW59XG4gICAgICAgICAgICB1c2VybmFtZT17dGhpcy5wcm9wcy51c2VybmFtZX1cbiAgICAgICAgICAgIHBhc3N3b3JkPXt0aGlzLnByb3BzLnBhc3N3b3JkfVxuICAgICAgICAgICAgcmVjZWl2ZVByb2plY3RJbmZvPXt0aGlzLnByb3BzLnJlY2VpdmVQcm9qZWN0SW5mb31cbiAgICAgICAgICAgIHRvdXJDbGllbnQ9e3RoaXMudG91ckNsaWVudH0gLz5cbiAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICBpZD0nc3RhZ2UtbW91bnQnXG4gICAgICAgICAgICByZWY9eyhlbGVtZW50KSA9PiB7IHRoaXMubW91bnQgPSBlbGVtZW50IH19XG4gICAgICAgICAgICBzdHlsZT17eyBwb3NpdGlvbjogJ2Fic29sdXRlJywgb3ZlcmZsb3c6ICdhdXRvJywgd2lkdGg6ICcxMDAlJywgaGVpZ2h0OiAnY2FsYygxMDAlIC0gMzZweCknLCBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuR1JBWSB9fSAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxufVxuXG5TdGFnZS5wcm9wVHlwZXMgPSB7XG4gIGZvbGRlcjogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICBoYWlrdTogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICBlbnZveTogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICB3ZWJzb2NrZXQ6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgcHJvamVjdDogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICBjcmVhdGVOb3RpY2U6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIHJlbW92ZU5vdGljZTogUmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgcmVjZWl2ZVByb2plY3RJbmZvOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYyxcbiAgb3JnYW5pemF0aW9uTmFtZTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcbiAgYXV0aFRva2VuOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuICB1c2VybmFtZTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcbiAgcGFzc3dvcmQ6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmdcbn1cbiJdfQ==