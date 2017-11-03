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
        email: this.props.username,
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
            lineNumber: 129
          },
          __self: this
        },
        _react2.default.createElement(
          'div',
          { className: 'stage-box', style: STAGE_BOX_STYLE, __source: {
              fileName: _jsxFileName,
              lineNumber: 132
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
              lineNumber: 133
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
              lineNumber: 145
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9yZWFjdC9jb21wb25lbnRzL1N0YWdlLmpzIl0sIm5hbWVzIjpbIlNUQUdFX0JPWF9TVFlMRSIsInBvc2l0aW9uIiwib3ZlcmZsb3ciLCJwYWRkaW5nIiwibWFyZ2luIiwid2lkdGgiLCJoZWlnaHQiLCJTdGFnZSIsInByb3BzIiwid2VidmlldyIsInN0YXRlIiwiaW5qZWN0V2VidmlldyIsInRvdXJDaGFubmVsIiwiZW52b3kiLCJnZXQiLCJpc0luTW9ja01vZGUiLCJ0aGVuIiwiY2xpZW50IiwidG91ckNsaWVudCIsIm9uIiwib25SZXF1ZXN0V2Vidmlld0Nvb3JkaW5hdGVzIiwiYmluZCIsIm9mZiIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsInRvcCIsImxlZnQiLCJyZWNlaXZlV2Vidmlld0Nvb3JkaW5hdGVzIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwicXVlcnkiLCJzdHJpbmdpZnkiLCJoYWlrdSIsInBsdW1iaW5nIiwidXJsIiwiZm9sZGVyIiwiZW1haWwiLCJ1c2VybmFtZSIsImhvc3QiLCJnZXRPcHRpb24iLCJwb3J0IiwicHJvY2VzcyIsImVudiIsIkhBSUtVX0dMQVNTX1VSTF9NT0RFIiwiam9pbiIsIl9fZGlybmFtZSIsInNldEF0dHJpYnV0ZSIsInN0eWxlIiwiYWRkRXZlbnRMaXN0ZW5lciIsImV2ZW50IiwibGV2ZWwiLCJtZXNzYWdlIiwic2xpY2UiLCJtc2ciLCJyZXBsYWNlIiwidHJpbSIsIm5vdGljZSIsImNyZWF0ZU5vdGljZSIsInR5cGUiLCJ0aXRsZSIsIndpbmRvdyIsInNldFRpbWVvdXQiLCJyZW1vdmVOb3RpY2UiLCJ1bmRlZmluZWQiLCJpZCIsIkRFViIsIm9wZW5EZXZUb29scyIsIm1vdW50IiwiZmlyc3RDaGlsZCIsInJlbW92ZUNoaWxkIiwiYXBwZW5kQ2hpbGQiLCJpc0RldlRvb2xzT3BlbmVkIiwiY2xvc2VEZXZUb29scyIsImxpYnJhcnlJdGVtSW5mbyIsImNsaWVudFgiLCJjbGllbnRZIiwic3RhZ2VSZWN0IiwicmlnaHQiLCJib3R0b20iLCJvZmZzZXRYIiwib2Zmc2V0WSIsImFic3BhdGgiLCJwcmV2aWV3IiwibWV0YWRhdGEiLCJnbGFzc09ubHkiLCJ3ZWJzb2NrZXQiLCJyZXF1ZXN0IiwibWV0aG9kIiwicGFyYW1zIiwiZXJyIiwiZm9jdXMiLCJibHVyIiwicHJvamVjdCIsIm9yZ2FuaXphdGlvbk5hbWUiLCJhdXRoVG9rZW4iLCJwYXNzd29yZCIsInJlY2VpdmVQcm9qZWN0SW5mbyIsImVsZW1lbnQiLCJiYWNrZ3JvdW5kQ29sb3IiLCJHUkFZIiwiQ29tcG9uZW50IiwicHJvcFR5cGVzIiwiUHJvcFR5cGVzIiwic3RyaW5nIiwiaXNSZXF1aXJlZCIsIm9iamVjdCIsImZ1bmMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7Ozs7O0FBRUEsSUFBTUEsa0JBQWtCO0FBQ3RCQyxZQUFVLFVBRFk7QUFFdEJDLFlBQVUsUUFGWTtBQUd0QkMsV0FBUyxDQUhhO0FBSXRCQyxVQUFRLENBSmM7QUFLdEJDLFNBQU8sTUFMZTtBQU10QkMsVUFBUTtBQU5jLENBQXhCOztJQVNxQkMsSzs7O0FBQ25CLGlCQUFhQyxLQUFiLEVBQW9CO0FBQUE7O0FBQUEsOEdBQ1pBLEtBRFk7O0FBRWxCLFVBQUtDLE9BQUwsR0FBZSxJQUFmO0FBQ0EsVUFBS0MsS0FBTCxHQUFhLEVBQWI7QUFIa0I7QUFJbkI7Ozs7d0NBRW9CO0FBQUE7O0FBQ25CLFdBQUtDLGFBQUw7O0FBRUEsVUFBTUMsY0FBYyxLQUFLSixLQUFMLENBQVdLLEtBQVgsQ0FBaUJDLEdBQWpCLENBQXFCLE1BQXJCLENBQXBCOztBQUVBLFVBQUksQ0FBQyxLQUFLTixLQUFMLENBQVdLLEtBQVgsQ0FBaUJFLFlBQWpCLEVBQUwsRUFBc0M7QUFDcENILG9CQUFZSSxJQUFaLENBQWlCLFVBQUNDLE1BQUQsRUFBWTtBQUMzQixpQkFBS0MsVUFBTCxHQUFrQkQs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QUVoQnhFLFNBQU8sZ0JBQU1zRSxTQUFOLENBQWdCRyxNQUFoQixDQUF1QkQsVUFGZDtBQUdoQjFGLFNBQU8sZ0JBQU13RixTQUFOLENBQWdCRyxNQUFoQixDQUF1QkQsVUFIZDtBQUloQm5CLGFBQVcsZ0JBQU1pQixTQUFOLENBQWdCRyxNQUFoQixDQUF1QkQsVUFKbEI7QUFLaEJaLFdBQVMsZ0JBQU1VLFNBQU4sQ0FBZ0JHLE1BQWhCLENBQXVCRCxVQUxoQjtBQU1oQi9DLGdCQUFjLGdCQUFNNkMsU0FBTixDQUFnQkksSUFBaEIsQ0FBcUJGLFVBTm5CO0FBT2hCMUMsZ0JBQWMsZ0JBQU13QyxTQUFOLENBQWdCSSxJQUFoQixDQUFxQkYsVUFQbkI7QUFRaEJSLHNCQUFvQixnQkFBTU0sU0FBTixDQUFnQkksSUFScEI7QUFTaEJiLG9CQUFrQixnQkFBTVMsU0FBTixDQUFnQkMsTUFUbEI7QUFVaEJULGFBQVcsZ0JBQU1RLFNBQU4sQ0FBZ0JDLE1BVlg7QUFXaEJsRSxZQUFVLGdCQUFNaUUsU0FBTixDQUFnQkMsTUFYVjtBQVloQlIsWUFBVSxnQkFBTU8sU0FBTixDQUFnQkM7QUFaVixDQUFsQiIsImZpbGUiOiJTdGFnZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCBxcyBmcm9tICdxcydcbmltcG9ydCBhc3NpZ24gZnJvbSAnbG9kYXNoLmFzc2lnbidcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQgU3RhZ2VUaXRsZUJhciBmcm9tICcuL1N0YWdlVGl0bGVCYXInXG5pbXBvcnQgUGFsZXR0ZSBmcm9tICcuL1BhbGV0dGUnXG5cbmNvbnN0IFNUQUdFX0JPWF9TVFlMRSA9IHtcbiAgcG9zaXRpb246ICdyZWxhdGl2ZScsXG4gIG92ZXJmbG93OiAnaGlkZGVuJyxcbiAgcGFkZGluZzogMCxcbiAgbWFyZ2luOiAwLFxuICB3aWR0aDogJzEwMCUnLFxuICBoZWlnaHQ6ICcxMDAlJ1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTdGFnZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yIChwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKVxuICAgIHRoaXMud2VidmlldyA9IG51bGxcbiAgICB0aGlzLnN0YXRlID0ge31cbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50ICgpIHtcbiAgICB0aGlzLmluamVjdFdlYnZpZXcoKVxuXG4gICAgY29uc3QgdG91ckNoYW5uZWwgPSB0aGlzLnByb3BzLmVudm95LmdldCgndG91cicpXG5cbiAgICBpZiAoIXRoaXMucHJvcHMuZW52b3kuaXNJbk1vY2tNb2RlKCkpIHtcbiAgICAgIHRvdXJDaGFubmVsLnRoZW4oKGNsaWVudCkgPT4ge1xuICAgICAgICB0aGlzLnRvdXJDbGllbnQgPSBjbGllbnRcbiAgICAgICAgdGhpcy50b3VyQ2xpZW50Lm9uKCd0b3VyOnJlcXVlc3RXZWJ2aWV3Q29vcmRpbmF0ZXMnLCB0aGlzLm9uUmVxdWVzdFdlYnZpZXdDb29yZGluYXRlcy5iaW5kKHRoaXMpKVxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICBjb21wb25lbnRXaWxsVW5tb3VudCAoKSB7XG4gICAgaWYgKHRoaXMudG91ckNsaWVudCkge1xuICAgICAgdGhpcy50b3VyQ2xpZW50Lm9mZigndG91cjpyZXF1ZXN0V2Vidmlld0Nvb3JkaW5hdGVzJywgdGhpcy5vblJlcXVlc3RXZWJ2aWV3Q29vcmRpbmF0ZXMpXG4gICAgfVxuICB9XG5cbiAgb25SZXF1ZXN0V2Vidmlld0Nvb3JkaW5hdGVzICgpIHtcbiAgICBsZXQgeyB0b3AsIGxlZnQgfSA9IHRoaXMud2Vidmlldy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICAgIGlmICh0aGlzLnRvdXJDbGllbnQpIHtcbiAgICAgIHRoaXMudG91ckNsaWVudC5yZWNlaXZlV2Vidmlld0Nvb3JkaW5hdGVzKCdnbGFzcycsIHsgdG9wLCBsZWZ0IH0pXG4gICAgfVxuICB9XG5cbiAgaW5qZWN0V2VidmlldyAoKSB7XG4gICAgdGhpcy53ZWJ2aWV3ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnd2VidmlldycpXG5cbiAgICBjb25zdCBxdWVyeSA9IHFzLnN0cmluZ2lmeShhc3NpZ24oe30sIHRoaXMucHJvcHMuaGFpa3UsIHtcbiAgICAgIHBsdW1iaW5nOiB0aGlzLnByb3BzLmhhaWt1LnBsdW1iaW5nLnVybCxcbiAgICAgIGZvbGRlcjogdGhpcy5wcm9wcy5mb2xkZXIsXG4gICAgICBlbWFpbDogdGhpcy5wcm9wcy51c2VybmFtZSxcbiAgICAgIGVudm95OiB7XG4gICAgICAgIGhvc3Q6IHRoaXMucHJvcHMuZW52b3kuZ2V0T3B0aW9uKCdob3N0JyksXG4gICAgICAgIHBvcnQ6IHRoaXMucHJvcHMuZW52b3kuZ2V0T3B0aW9uKCdwb3J0JylcbiAgICAgIH1cbiAgICB9KSlcblxuICAgIC8vIFdoZW4gYnVpbGRpbmcgYSBkaXN0cmlidXRpb24gKHNlZSAnZGlzdHJvJyByZXBvKSB0aGUgbm9kZV9tb2R1bGVzIGZvbGRlciBpcyBhdCBhIGRpZmZlcmVudCBsZXZlbCAjRklYTUUgbWF0dGhld1xuICAgIGxldCB1cmxcbiAgICBpZiAocHJvY2Vzcy5lbnYuSEFJS1VfR0xBU1NfVVJMX01PREUgPT09ICdkaXN0cm8nKSB7XG4gICAgICB1cmwgPSBgZmlsZTovLyR7cGF0aC5qb2luKF9fZGlybmFtZSwgJy4uJywgJy4uJywgJy4uJywgJy4uJywgJy4uJywgJ25vZGVfbW9kdWxlcycsICdoYWlrdS1nbGFzcycsICdpbmRleC5odG1sJyl9PyR7cXVlcnl9YFxuICAgIH0gZWxzZSB7XG4gICAgICB1cmwgPSBgZmlsZTovLyR7cGF0aC5qb2luKF9fZGlybmFtZSwgJy4uJywgJy4uJywgJy4uJywgJ25vZGVfbW9kdWxlcycsICdoYWlrdS1nbGFzcycsICdpbmRleC5odG1sJyl9PyR7cXVlcnl9YFxuICAgIH1cblxuICAgIHRoaXMud2Vidmlldy5zZXRBdHRyaWJ1dGUoJ3NyYycsIHVybClcbiAgICB0aGlzLndlYnZpZXcuc2V0QXR0cmlidXRlKCdwbHVnaW5zJywgdHJ1ZSlcbiAgICB0aGlzLndlYnZpZXcuc2V0QXR0cmlidXRlKCdub2RlaW50ZWdyYXRpb24nLCB0cnVlKVxuICAgIHRoaXMud2Vidmlldy5zZXRBdHRyaWJ1dGUoJ2Rpc2FibGV3ZWJzZWN1cml0eScsIHRydWUpXG4gICAgdGhpcy53ZWJ2aWV3LnNldEF0dHJpYnV0ZSgnYWxsb3dwb3B1cHMnLCB0cnVlKVxuICAgIHRoaXMud2Vidmlldy5zdHlsZS53aWR0aCA9ICcxMDAlJ1xuICAgIHRoaXMud2Vidmlldy5zdHlsZS5oZWlnaHQgPSAnMTAwJSdcblxuICAgIHRoaXMud2Vidmlldy5hZGRFdmVudExpc3RlbmVyKCdjb25zb2xlLW1lc3NhZ2UnLCAoZXZlbnQpID0+IHtcbiAgICAgIHN3aXRjaCAoZXZlbnQubGV2ZWwpIHtcbiAgICAgICAgY2FzZSAwOlxuICAgICAgICAgIGlmIChldmVudC5tZXNzYWdlLnNsaWNlKDAsIDgpID09PSAnW25vdGljZV0nKSB7XG4gICAgICAgICAgICB2YXIgbXNnID0gZXZlbnQubWVzc2FnZS5yZXBsYWNlKCdbbm90aWNlXScsICcnKS50cmltKClcbiAgICAgICAgICAgIHZhciBub3RpY2UgPSB0aGlzLnByb3BzLmNyZWF0ZU5vdGljZSh7IHR5cGU6ICdpbmZvJywgdGl0bGU6ICdOb3RpY2UnLCBtZXNzYWdlOiBtc2cgfSlcbiAgICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgdGhpcy5wcm9wcy5yZW1vdmVOb3RpY2UodW5kZWZpbmVkLCBub3RpY2UuaWQpXG4gICAgICAgICAgICB9LCAxMDAwKVxuICAgICAgICAgIH1cbiAgICAgICAgICBicmVha1xuICAgICAgICAvLyBjYXNlIDE6XG4gICAgICAgIC8vICAgdGhpcy5wcm9wcy5jcmVhdGVOb3RpY2UoeyB0eXBlOiAnd2FybmluZycsIHRpdGxlOiAnV2FybmluZycsIG1lc3NhZ2U6IGV2ZW50Lm1lc3NhZ2UgfSlcbiAgICAgICAgLy8gICBicmVha1xuICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgdGhpcy5wcm9wcy5jcmVhdGVOb3RpY2UoeyB0eXBlOiAnZXJyb3InLCB0aXRsZTogJ0Vycm9yJywgbWVzc2FnZTogZXZlbnQubWVzc2FnZSB9KVxuICAgICAgICAgIGJyZWFrXG4gICAgICB9XG4gICAgfSlcblxuICAgIHRoaXMud2Vidmlldy5hZGRFdmVudExpc3RlbmVyKCdkb20tcmVhZHknLCAoKSA9PiB7XG4gICAgICBpZiAocHJvY2Vzcy5lbnYuREVWID09PSAnMScpIHRoaXMud2Vidmlldy5vcGVuRGV2VG9vbHMoKVxuICAgIH0pXG5cbiAgICB3aGlsZSAodGhpcy5tb3VudC5maXJzdENoaWxkKSB0aGlzLm1vdW50LnJlbW92ZUNoaWxkKHRoaXMubW91bnQuZmlyc3RDaGlsZClcbiAgICB0aGlzLm1vdW50LmFwcGVuZENoaWxkKHRoaXMud2VidmlldylcbiAgfVxuXG4gIHRvZ2dsZURldlRvb2xzICgpIHtcbiAgICBpZiAodGhpcy53ZWJ2aWV3KSB7XG4gICAgICBpZiAodGhpcy53ZWJ2aWV3LmlzRGV2VG9vbHNPcGVuZWQoKSkgdGhpcy53ZWJ2aWV3LmNsb3NlRGV2VG9vbHMoKVxuICAgICAgZWxzZSB0aGlzLndlYnZpZXcub3BlbkRldlRvb2xzKClcbiAgICB9XG4gIH1cblxuICBoYW5kbGVEcm9wIChsaWJyYXJ5SXRlbUluZm8sIGNsaWVudFgsIGNsaWVudFkpIHtcbiAgICB2YXIgc3RhZ2VSZWN0ID0gdGhpcy5tb3VudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICAgIGlmIChjbGllbnRYID4gc3RhZ2VSZWN0LmxlZnQgJiYgY2xpZW50WCA8IHN0YWdlUmVjdC5yaWdodCAmJiBjbGllbnRZID4gc3RhZ2VSZWN0LnRvcCAmJiBjbGllbnRZIDwgc3RhZ2VSZWN0LmJvdHRvbSkge1xuICAgICAgdmFyIG9mZnNldFggPSBjbGllbnRYIC0gc3RhZ2VSZWN0LmxlZnRcbiAgICAgIHZhciBvZmZzZXRZID0gY2xpZW50WSAtIHN0YWdlUmVjdC50b3BcbiAgICAgIHZhciBhYnNwYXRoID0gbGlicmFyeUl0ZW1JbmZvLnByZXZpZXdcbiAgICAgIGNvbnN0IG1ldGFkYXRhID0geyBvZmZzZXRYLCBvZmZzZXRZLCBnbGFzc09ubHk6IHRydWUgfVxuICAgICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQucmVxdWVzdCh7IHR5cGU6ICdhY3Rpb24nLCBtZXRob2Q6ICdpbnN0YW50aWF0ZUNvbXBvbmVudCcsIHBhcmFtczogW3RoaXMucHJvcHMuZm9sZGVyLCBhYnNwYXRoLCBtZXRhZGF0YV0gfSwgKGVycikgPT4ge1xuICAgICAgICBpZiAoZXJyKSByZXR1cm4gdGhpcy5wcm9wcy5jcmVhdGVOb3RpY2UoeyB0eXBlOiAnZXJyb3InLCB0aXRsZTogJ0Vycm9yJywgbWVzc2FnZTogZXJyLm1lc3NhZ2UgfSlcbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgcmVuZGVyICgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9J2xheW91dC1ib3gnXG4gICAgICAgIG9uTW91c2VPdmVyPXsoKSA9PiB0aGlzLndlYnZpZXcuZm9jdXMoKX1cbiAgICAgICAgb25Nb3VzZU91dD17KCkgPT4gdGhpcy53ZWJ2aWV3LmJsdXIoKX0+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPSdzdGFnZS1ib3gnIHN0eWxlPXtTVEFHRV9CT1hfU1RZTEV9PlxuICAgICAgICAgIDxTdGFnZVRpdGxlQmFyXG4gICAgICAgICAgICBmb2xkZXI9e3RoaXMucHJvcHMuZm9sZGVyfVxuICAgICAgICAgICAgd2Vic29ja2V0PXt0aGlzLnByb3BzLndlYnNvY2tldH1cbiAgICAgICAgICAgIHByb2plY3Q9e3RoaXMucHJvcHMucHJvamVjdH1cbiAgICAgICAgICAgIGNyZWF0ZU5vdGljZT17dGhpcy5wcm9wcy5jcmVhdGVOb3RpY2V9XG4gICAgICAgICAgICByZW1vdmVOb3RpY2U9e3RoaXMucHJvcHMucmVtb3ZlTm90aWNlfVxuICAgICAgICAgICAgb3JnYW5pemF0aW9uTmFtZT17dGhpcy5wcm9wcy5vcmdhbml6YXRpb25OYW1lfVxuICAgICAgICAgICAgYXV0aFRva2VuPXt0aGlzLnByb3BzLmF1dGhUb2tlbn1cbiAgICAgICAgICAgIHVzZXJuYW1lPXt0aGlzLnByb3BzLnVzZXJuYW1lfVxuICAgICAgICAgICAgcGFzc3dvcmQ9e3RoaXMucHJvcHMucGFzc3dvcmR9XG4gICAgICAgICAgICByZWNlaXZlUHJvamVjdEluZm89e3RoaXMucHJvcHMucmVjZWl2ZVByb2plY3RJbmZvfVxuICAgICAgICAgICAgdG91ckNsaWVudD17dGhpcy50b3VyQ2xpZW50fSAvPlxuICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgIGlkPSdzdGFnZS1tb3VudCdcbiAgICAgICAgICAgIHJlZj17KGVsZW1lbnQpID0+IHsgdGhpcy5tb3VudCA9IGVsZW1lbnQgfX1cbiAgICAgICAgICAgIHN0eWxlPXt7IHBvc2l0aW9uOiAnYWJzb2x1dGUnLCBvdmVyZmxvdzogJ2F1dG8nLCB3aWR0aDogJzEwMCUnLCBoZWlnaHQ6ICdjYWxjKDEwMCUgLSAzNnB4KScsIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5HUkFZIH19IC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG59XG5cblN0YWdlLnByb3BUeXBlcyA9IHtcbiAgZm9sZGVyOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gIGhhaWt1OiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gIGVudm95OiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gIHdlYnNvY2tldDogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICBwcm9qZWN0OiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gIGNyZWF0ZU5vdGljZTogUmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgcmVtb3ZlTm90aWNlOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICByZWNlaXZlUHJvamVjdEluZm86IFJlYWN0LlByb3BUeXBlcy5mdW5jLFxuICBvcmdhbml6YXRpb25OYW1lOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuICBhdXRoVG9rZW46IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG4gIHVzZXJuYW1lOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuICBwYXNzd29yZDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZ1xufVxuIl19