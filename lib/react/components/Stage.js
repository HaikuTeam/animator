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
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      if (this.tourClient) {
        this.tourClient.off('tour:requestWebviewCoordinates', this.onRequestWebviewCoordinates);
      }
    }
  }, {
    key: 'onRequestWebviewCoordinates',
    value: function onRequestWebviewCoordinates() {
      var _webview$getBoundingC = this.webview.getBoundingClientRect(),
          top = _webview$getBoundingC.top,
          left = _webview$getBoundingC.left;

      if (this.tourClient) {
        this.tourClient.receiveWebviewCoordinates('glass', { top: top, left: left });
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
            lineNumber: 120
          },
          __self: this
        },
        _react2.default.createElement(
          'div',
          { className: 'stage-box', style: STAGE_BOX_STYLE, __source: {
              fileName: _jsxFileName,
              lineNumber: 123
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
              lineNumber: 124
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
              lineNumber: 136
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9yZWFjdC9jb21wb25lbnRzL1N0YWdlLmpzIl0sIm5hbWVzIjpbIlNUQUdFX0JPWF9TVFlMRSIsInBvc2l0aW9uIiwib3ZlcmZsb3ciLCJwYWRkaW5nIiwibWFyZ2luIiwid2lkdGgiLCJoZWlnaHQiLCJTdGFnZSIsInByb3BzIiwid2VidmlldyIsInN0YXRlIiwiaW5qZWN0V2VidmlldyIsInRvdXJDaGFubmVsIiwiZW52b3kiLCJnZXQiLCJpc0luTW9ja01vZGUiLCJ0aGVuIiwiY2xpZW50IiwidG91ckNsaWVudCIsIm9uIiwib25SZXF1ZXN0V2Vidmlld0Nvb3JkaW5hdGVzIiwiYmluZCIsIm9mZiIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsInRvcCIsImxlZnQiLCJyZWNlaXZlV2Vidmlld0Nvb3JkaW5hdGVzIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwicXVlcnkiLCJzdHJpbmdpZnkiLCJoYWlrdSIsInBsdW1iaW5nIiwidXJsIiwiZm9sZGVyIiwiaG9zdCIsImdldE9wdGlvbiIsInBvcnQiLCJwcm9jZXNzIiwiZW52IiwiSEFJS1VfR0xBU1NfVVJMX01PREUiLCJqb2luIiwiX19kaXJuYW1lIiwic2V0QXR0cmlidXRlIiwic3R5bGUiLCJhZGRFdmVudExpc3RlbmVyIiwiZXZlbnQiLCJsZXZlbCIsIm1lc3NhZ2UiLCJzbGljZSIsIm1zZyIsInJlcGxhY2UiLCJ0cmltIiwibm90aWNlIiwiY3JlYXRlTm90aWNlIiwidHlwZSIsInRpdGxlIiwid2luZG93Iiwic2V0VGltZW91dCIsInJlbW92ZU5vdGljZSIsInVuZGVmaW5lZCIsImlkIiwiREVWIiwib3BlbkRldlRvb2xzIiwibW91bnQiLCJmaXJzdENoaWxkIiwicmVtb3ZlQ2hpbGQiLCJhcHBlbmRDaGlsZCIsImlzRGV2VG9vbHNPcGVuZWQiLCJjbG9zZURldlRvb2xzIiwibGlicmFyeUl0ZW1JbmZvIiwiY2xpZW50WCIsImNsaWVudFkiLCJzdGFnZVJlY3QiLCJyaWdodCIsImJvdHRvbSIsIm9mZnNldFgiLCJvZmZzZXRZIiwiYWJzcGF0aCIsInByZXZpZXciLCJtZXRhZGF0YSIsImdsYXNzT25seSIsIndlYnNvY2tldCIsInJlcXVlc3QiLCJtZXRob2QiLCJwYXJhbXMiLCJlcnIiLCJmb2N1cyIsImJsdXIiLCJwcm9qZWN0Iiwib3JnYW5pemF0aW9uTmFtZSIsImF1dGhUb2tlbiIsInVzZXJuYW1lIiwicGFzc3dvcmQiLCJyZWNlaXZlUHJvamVjdEluZm8iLCJlbGVtZW50IiwiYmFja2dyb3VuZENvbG9yIiwiR1JBWSIsIkNvbXBvbmVudCIsInByb3BUeXBlcyIsIlByb3BUeXBlcyIsInN0cmluZyIsImlzUmVxdWlyZWQiLCJvYmplY3QiLCJmdW5jIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7OztBQUVBLElBQU1BLGtCQUFrQjtBQUN0QkMsWUFBVSxVQURZO0FBRXRCQyxZQUFVLFFBRlk7QUFHdEJDLFdBQVMsQ0FIYTtBQUl0QkMsVUFBUSxDQUpjO0FBS3RCQyxTQUFPLE1BTGU7QUFNdEJDLFVBQVE7QUFOYyxDQUF4Qjs7SUFTcUJDLEs7OztBQUNuQixpQkFBYUMsS0FBYixFQUFvQjtBQUFBOztBQUFBLDhHQUNaQSxLQURZOztBQUVsQixVQUFLQyxPQUFMLEdBQWUsSUFBZjtBQUNBLFVBQUtDLEtBQUwsR0FBYSxFQUFiO0FBSGtCO0FBSW5COzs7O3dDQUVvQjtBQUFBOztBQUNuQixXQUFLQyxhQUFMOztBQUVBLFVBQU1DLGNBQWMsS0FBS0osS0FBTCxDQUFXSyxLQUFYLENBQWlCQyxHQUFqQixDQUFxQixNQUFyQixDQUFwQjs7QUFFQSxVQUFJLENBQUMsS0FBS04sS0FBTCxDQUFXSyxLQUFYLENBQWlCRSxZQUFqQixFQUFMLEVBQXNDO0FBQ3BDSCxvQkFBWUksSUFBWixDQUFpQixVQUFDQyxNQUFELEVBQVk7QUFDM0IsaUJBQUtDLFVBQUwsR0FBa0JELE1BQWxCO0FB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QWhCLENBQXVCRCxVQUxoQjtBQU1oQmhELGdCQUFjLGdCQUFNOEMsU0FBTixDQUFnQkksSUFBaEIsQ0FBcUJGLFVBTm5CO0FBT2hCM0MsZ0JBQWMsZ0JBQU15QyxTQUFOLENBQWdCSSxJQUFoQixDQUFxQkYsVUFQbkI7QUFRaEJSLHNCQUFvQixnQkFBTU0sU0FBTixDQUFnQkksSUFScEI7QUFTaEJkLG9CQUFrQixnQkFBTVUsU0FBTixDQUFnQkMsTUFUbEI7QUFVaEJWLGFBQVcsZ0JBQU1TLFNBQU4sQ0FBZ0JDLE1BVlg7QUFXaEJULFlBQVUsZ0JBQU1RLFNBQU4sQ0FBZ0JDLE1BWFY7QUFZaEJSLFlBQVUsZ0JBQU1PLFNBQU4sQ0FBZ0JDO0FBWlYsQ0FBbEIiLCJmaWxlIjoiU3RhZ2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgcXMgZnJvbSAncXMnXG5pbXBvcnQgYXNzaWduIGZyb20gJ2xvZGFzaC5hc3NpZ24nXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IFN0YWdlVGl0bGVCYXIgZnJvbSAnLi9TdGFnZVRpdGxlQmFyJ1xuaW1wb3J0IFBhbGV0dGUgZnJvbSAnLi9QYWxldHRlJ1xuXG5jb25zdCBTVEFHRV9CT1hfU1RZTEUgPSB7XG4gIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICBvdmVyZmxvdzogJ2hpZGRlbicsXG4gIHBhZGRpbmc6IDAsXG4gIG1hcmdpbjogMCxcbiAgd2lkdGg6ICcxMDAlJyxcbiAgaGVpZ2h0OiAnMTAwJSdcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3RhZ2UgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3RvciAocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcylcbiAgICB0aGlzLndlYnZpZXcgPSBudWxsXG4gICAgdGhpcy5zdGF0ZSA9IHt9XG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCAoKSB7XG4gICAgdGhpcy5pbmplY3RXZWJ2aWV3KClcblxuICAgIGNvbnN0IHRvdXJDaGFubmVsID0gdGhpcy5wcm9wcy5lbnZveS5nZXQoJ3RvdXInKVxuXG4gICAgaWYgKCF0aGlzLnByb3BzLmVudm95LmlzSW5Nb2NrTW9kZSgpKSB7XG4gICAgICB0b3VyQ2hhbm5lbC50aGVuKChjbGllbnQpID0+IHtcbiAgICAgICAgdGhpcy50b3VyQ2xpZW50ID0gY2xpZW50XG4gICAgICAgIHRoaXMudG91ckNsaWVudC5vbigndG91cjpyZXF1ZXN0V2Vidmlld0Nvb3JkaW5hdGVzJywgdGhpcy5vblJlcXVlc3RXZWJ2aWV3Q29vcmRpbmF0ZXMuYmluZCh0aGlzKSlcbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQgKCkge1xuICAgIGlmICh0aGlzLnRvdXJDbGllbnQpIHtcbiAgICAgIHRoaXMudG91ckNsaWVudC5vZmYoJ3RvdXI6cmVxdWVzdFdlYnZpZXdDb29yZGluYXRlcycsIHRoaXMub25SZXF1ZXN0V2Vidmlld0Nvb3JkaW5hdGVzKVxuICAgIH1cbiAgfVxuXG4gIG9uUmVxdWVzdFdlYnZpZXdDb29yZGluYXRlcyAoKSB7XG4gICAgbGV0IHsgdG9wLCBsZWZ0IH0gPSB0aGlzLndlYnZpZXcuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICBpZiAodGhpcy50b3VyQ2xpZW50KSB7XG4gICAgICB0aGlzLnRvdXJDbGllbnQucmVjZWl2ZVdlYnZpZXdDb29yZGluYXRlcygnZ2xhc3MnLCB7IHRvcCwgbGVmdCB9KVxuICAgIH1cbiAgfVxuXG4gIGluamVjdFdlYnZpZXcgKCkge1xuICAgIHRoaXMud2VidmlldyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3dlYnZpZXcnKVxuXG4gICAgY29uc3QgcXVlcnkgPSBxcy5zdHJpbmdpZnkoYXNzaWduKHt9LCB0aGlzLnByb3BzLmhhaWt1LCB7XG4gICAgICBwbHVtYmluZzogdGhpcy5wcm9wcy5oYWlrdS5wbHVtYmluZy51cmwsXG4gICAgICBmb2xkZXI6IHRoaXMucHJvcHMuZm9sZGVyLFxuICAgICAgZW52b3k6IHtcbiAgICAgICAgaG9zdDogdGhpcy5wcm9wcy5lbnZveS5nZXRPcHRpb24oJ2hvc3QnKSxcbiAgICAgICAgcG9ydDogdGhpcy5wcm9wcy5lbnZveS5nZXRPcHRpb24oJ3BvcnQnKVxuICAgICAgfVxuICAgIH0pKVxuXG4gICAgLy8gV2hlbiBidWlsZGluZyBhIGRpc3RyaWJ1dGlvbiAoc2VlICdkaXN0cm8nIHJlcG8pIHRoZSBub2RlX21vZHVsZXMgZm9sZGVyIGlzIGF0IGEgZGlmZmVyZW50IGxldmVsICNGSVhNRSBtYXR0aGV3XG4gICAgbGV0IHVybFxuICAgIGlmIChwcm9jZXNzLmVudi5IQUlLVV9HTEFTU19VUkxfTU9ERSA9PT0gJ2Rpc3RybycpIHtcbiAgICAgIHVybCA9IGBmaWxlOi8vJHtwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi4nLCAnLi4nLCAnLi4nLCAnLi4nLCAnLi4nLCAnbm9kZV9tb2R1bGVzJywgJ2hhaWt1LWdsYXNzJywgJ2luZGV4Lmh0bWwnKX0/JHtxdWVyeX1gXG4gICAgfSBlbHNlIHtcbiAgICAgIHVybCA9IGBmaWxlOi8vJHtwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi4nLCAnLi4nLCAnLi4nLCAnbm9kZV9tb2R1bGVzJywgJ2hhaWt1LWdsYXNzJywgJ2luZGV4Lmh0bWwnKX0/JHtxdWVyeX1gXG4gICAgfVxuXG4gICAgdGhpcy53ZWJ2aWV3LnNldEF0dHJpYnV0ZSgnc3JjJywgdXJsKVxuICAgIHRoaXMud2Vidmlldy5zZXRBdHRyaWJ1dGUoJ3BsdWdpbnMnLCB0cnVlKVxuICAgIHRoaXMud2Vidmlldy5zZXRBdHRyaWJ1dGUoJ25vZGVpbnRlZ3JhdGlvbicsIHRydWUpXG4gICAgdGhpcy53ZWJ2aWV3LnNldEF0dHJpYnV0ZSgnZGlzYWJsZXdlYnNlY3VyaXR5JywgdHJ1ZSlcbiAgICB0aGlzLndlYnZpZXcuc2V0QXR0cmlidXRlKCdhbGxvd3BvcHVwcycsIHRydWUpXG4gICAgdGhpcy53ZWJ2aWV3LnN0eWxlLndpZHRoID0gJzEwMCUnXG4gICAgdGhpcy53ZWJ2aWV3LnN0eWxlLmhlaWdodCA9ICcxMDAlJ1xuXG4gICAgdGhpcy53ZWJ2aWV3LmFkZEV2ZW50TGlzdGVuZXIoJ2NvbnNvbGUtbWVzc2FnZScsIChldmVudCkgPT4ge1xuICAgICAgc3dpdGNoIChldmVudC5sZXZlbCkge1xuICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgaWYgKGV2ZW50Lm1lc3NhZ2Uuc2xpY2UoMCwgOCkgPT09ICdbbm90aWNlXScpIHtcbiAgICAgICAgICAgIHZhciBtc2cgPSBldmVudC5tZXNzYWdlLnJlcGxhY2UoJ1tub3RpY2VdJywgJycpLnRyaW0oKVxuICAgICAgICAgICAgdmFyIG5vdGljZSA9IHRoaXMucHJvcHMuY3JlYXRlTm90aWNlKHsgdHlwZTogJ2luZm8nLCB0aXRsZTogJ05vdGljZScsIG1lc3NhZ2U6IG1zZyB9KVxuICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLnByb3BzLnJlbW92ZU5vdGljZSh1bmRlZmluZWQsIG5vdGljZS5pZClcbiAgICAgICAgICAgIH0sIDEwMDApXG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrXG4gICAgICB9XG4gICAgfSlcbiAgICB0aGlzLndlYnZpZXcuYWRkRXZlbnRMaXN0ZW5lcignZG9tLXJlYWR5JywgKCkgPT4ge1xuICAgICAgaWYgKHByb2Nlc3MuZW52LkRFViA9PT0gJzEnKSB0aGlzLndlYnZpZXcub3BlbkRldlRvb2xzKClcbiAgICB9KVxuICAgIHdoaWxlICh0aGlzLm1vdW50LmZpcnN0Q2hpbGQpIHRoaXMubW91bnQucmVtb3ZlQ2hpbGQodGhpcy5tb3VudC5maXJzdENoaWxkKVxuICAgIHRoaXMubW91bnQuYXBwZW5kQ2hpbGQodGhpcy53ZWJ2aWV3KVxuICB9XG5cbiAgdG9nZ2xlRGV2VG9vbHMgKCkge1xuICAgIGlmICh0aGlzLndlYnZpZXcpIHtcbiAgICAgIGlmICh0aGlzLndlYnZpZXcuaXNEZXZUb29sc09wZW5lZCgpKSB0aGlzLndlYnZpZXcuY2xvc2VEZXZUb29scygpXG4gICAgICBlbHNlIHRoaXMud2Vidmlldy5vcGVuRGV2VG9vbHMoKVxuICAgIH1cbiAgfVxuXG4gIGhhbmRsZURyb3AgKGxpYnJhcnlJdGVtSW5mbywgY2xpZW50WCwgY2xpZW50WSkge1xuICAgIHZhciBzdGFnZVJlY3QgPSB0aGlzLm1vdW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gICAgaWYgKGNsaWVudFggPiBzdGFnZVJlY3QubGVmdCAmJiBjbGllbnRYIDwgc3RhZ2VSZWN0LnJpZ2h0ICYmIGNsaWVudFkgPiBzdGFnZVJlY3QudG9wICYmIGNsaWVudFkgPCBzdGFnZVJlY3QuYm90dG9tKSB7XG4gICAgICB2YXIgb2Zmc2V0WCA9IGNsaWVudFggLSBzdGFnZVJlY3QubGVmdFxuICAgICAgdmFyIG9mZnNldFkgPSBjbGllbnRZIC0gc3RhZ2VSZWN0LnRvcFxuICAgICAgdmFyIGFic3BhdGggPSBsaWJyYXJ5SXRlbUluZm8ucHJldmlld1xuICAgICAgY29uc3QgbWV0YWRhdGEgPSB7IG9mZnNldFgsIG9mZnNldFksIGdsYXNzT25seTogdHJ1ZSB9XG4gICAgICB0aGlzLnByb3BzLndlYnNvY2tldC5yZXF1ZXN0KHsgdHlwZTogJ2FjdGlvbicsIG1ldGhvZDogJ2luc3RhbnRpYXRlQ29tcG9uZW50JywgcGFyYW1zOiBbdGhpcy5wcm9wcy5mb2xkZXIsIGFic3BhdGgsIG1ldGFkYXRhXSB9LCAoZXJyKSA9PiB7XG4gICAgICAgIGlmIChlcnIpIHJldHVybiB0aGlzLnByb3BzLmNyZWF0ZU5vdGljZSh7IHR5cGU6ICdlcnJvcicsIHRpdGxlOiAnRXJyb3InLCBtZXNzYWdlOiBlcnIubWVzc2FnZSB9KVxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICByZW5kZXIgKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT0nbGF5b3V0LWJveCdcbiAgICAgICAgb25Nb3VzZU92ZXI9eygpID0+IHRoaXMud2Vidmlldy5mb2N1cygpfVxuICAgICAgICBvbk1vdXNlT3V0PXsoKSA9PiB0aGlzLndlYnZpZXcuYmx1cigpfT5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9J3N0YWdlLWJveCcgc3R5bGU9e1NUQUdFX0JPWF9TVFlMRX0+XG4gICAgICAgICAgPFN0YWdlVGl0bGVCYXJcbiAgICAgICAgICAgIGZvbGRlcj17dGhpcy5wcm9wcy5mb2xkZXJ9XG4gICAgICAgICAgICB3ZWJzb2NrZXQ9e3RoaXMucHJvcHMud2Vic29ja2V0fVxuICAgICAgICAgICAgcHJvamVjdD17dGhpcy5wcm9wcy5wcm9qZWN0fVxuICAgICAgICAgICAgY3JlYXRlTm90aWNlPXt0aGlzLnByb3BzLmNyZWF0ZU5vdGljZX1cbiAgICAgICAgICAgIHJlbW92ZU5vdGljZT17dGhpcy5wcm9wcy5yZW1vdmVOb3RpY2V9XG4gICAgICAgICAgICBvcmdhbml6YXRpb25OYW1lPXt0aGlzLnByb3BzLm9yZ2FuaXphdGlvbk5hbWV9XG4gICAgICAgICAgICBhdXRoVG9rZW49e3RoaXMucHJvcHMuYXV0aFRva2VufVxuICAgICAgICAgICAgdXNlcm5hbWU9e3RoaXMucHJvcHMudXNlcm5hbWV9XG4gICAgICAgICAgICBwYXNzd29yZD17dGhpcy5wcm9wcy5wYXNzd29yZH1cbiAgICAgICAgICAgIHJlY2VpdmVQcm9qZWN0SW5mbz17dGhpcy5wcm9wcy5yZWNlaXZlUHJvamVjdEluZm99XG4gICAgICAgICAgICB0b3VyQ2xpZW50PXt0aGlzLnRvdXJDbGllbnR9IC8+XG4gICAgICAgICAgPGRpdlxuICAgICAgICAgICAgaWQ9J3N0YWdlLW1vdW50J1xuICAgICAgICAgICAgcmVmPXsoZWxlbWVudCkgPT4geyB0aGlzLm1vdW50ID0gZWxlbWVudCB9fVxuICAgICAgICAgICAgc3R5bGU9e3sgcG9zaXRpb246ICdhYnNvbHV0ZScsIG92ZXJmbG93OiAnYXV0bycsIHdpZHRoOiAnMTAwJScsIGhlaWdodDogJ2NhbGMoMTAwJSAtIDM2cHgpJywgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLkdSQVkgfX0gLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cbn1cblxuU3RhZ2UucHJvcFR5cGVzID0ge1xuICBmb2xkZXI6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgaGFpa3U6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgZW52b3k6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgd2Vic29ja2V0OiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gIHByb2plY3Q6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgY3JlYXRlTm90aWNlOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICByZW1vdmVOb3RpY2U6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIHJlY2VpdmVQcm9qZWN0SW5mbzogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsXG4gIG9yZ2FuaXphdGlvbk5hbWU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG4gIGF1dGhUb2tlbjogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcbiAgdXNlcm5hbWU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG4gIHBhc3N3b3JkOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nXG59XG4iXX0=