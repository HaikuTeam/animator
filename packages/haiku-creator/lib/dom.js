'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _jsxFileName = 'src/dom.js';
exports.default = dom;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _Websocket = require('haiku-serialization/src/ws/Websocket');

var _Websocket2 = _interopRequireDefault(_Websocket);

var _Creator = require('./react/Creator');

var _Creator2 = _interopRequireDefault(_Creator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var remote = require('electron').remote;

function _fixPlumbingUrl(url) {
  return url.replace(/^http/, 'ws');
}

function dom(modus, haiku) {
  var listeners = {};

  var props = {
    medium: window,
    width: window.innerWidth,
    height: window.innerHeight,
    listen: function listen(key, fn) {
      listeners[key] = fn;
    }
  };

  function resizeHandler(resizeEvent) {
    props.width = window.innerWidth;
    props.height = window.innerHeight;
    if (listeners.resize) listeners.resize(props.width, props.height);
  }

  window.addEventListener('resize', _lodash2.default.debounce(resizeHandler, 64));

  var websocket = haiku.plumbing ? new _Websocket2.default(_fixPlumbingUrl(haiku.plumbing.url), haiku.folder, 'commander', 'creator') : { on: function on() {}, send: function send() {}, method: function method() {}, request: function request() {} };

  websocket.on('close', function () {
    var currentWindow = remote.getCurrentWindow();
    if (currentWindow) {
      currentWindow.destroy();
    }
  });

  (0, _reactDom.render)(_react2.default.createElement(_Creator2.default, Object.assign({
    websocket: websocket,
    haiku: haiku,
    folder: haiku.folder
  }, props, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 41
    },
    __self: this
  })), document.getElementById('mount'));
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9kb20uanMiXSwibmFtZXMiOlsiZG9tIiwicmVtb3RlIiwicmVxdWlyZSIsIl9maXhQbHVtYmluZ1VybCIsInVybCIsInJlcGxhY2UiLCJtb2R1cyIsImhhaWt1IiwibGlzdGVuZXJzIiwicHJvcHMiLCJtZWRpdW0iLCJ3aW5kb3ciLCJ3aWR0aCIsImlubmVyV2lkdGgiLCJoZWlnaHQiLCJpbm5lckhlaWdodCIsImxpc3RlbiIsImtleSIsImZuIiwicmVzaXplSGFuZGxlciIsInJlc2l6ZUV2ZW50IiwicmVzaXplIiwiYWRkRXZlbnRMaXN0ZW5lciIsImRlYm91bmNlIiwid2Vic29ja2V0IiwicGx1bWJpbmciLCJmb2xkZXIiLCJvbiIsInNlbmQiLCJtZXRob2QiLCJyZXF1ZXN0IiwiY3VycmVudFdpbmRvdyIsImdldEN1cnJlbnRXaW5kb3ciLCJkZXN0cm95IiwiZG9jdW1lbnQiLCJnZXRFbGVtZW50QnlJZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7O2tCQVV3QkEsRzs7QUFWeEI7Ozs7QUFDQTs7OztBQUNBOztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBLElBQUlDLFNBQVNDLFFBQVEsVUFBUixFQUFvQkQsTUFBakM7O0FBRUEsU0FBU0UsZUFBVCxDQUEwQkMsR0FBMUIsRUFBK0I7QUFBRSxTQUFPQSxJQUFJQyxPQUFKLENBQVksT0FBWixFQUFxQixJQUFyQixDQUFQO0FBQW1DOztBQUVyRCxTQUFTTCxHQUFULENBQWNNLEtBQWQsRUFBcUJDLEtBQXJCLEVBQTRCO0FBQ3pDLE1BQU1DLFlBQVksRUFBbEI7O0FBRUEsTUFBTUMsUUFBUTtBQUNaQyxZQUFRQyxNQURJO0FBRVpDLFdBQU9ELE9BQU9FLFVBRkY7QUFHWkMsWUFBUUgsT0FBT0ksV0FISDtBQUlaQyxZQUFRLGdCQUFDQyxHQUFELEVBQU1DLEVBQU4sRUFBYTtBQUFFVixnQkFBVVMsR0FBVixJQUFpQkMsRUFBakI7QUFBcUI7QUFKaEMsR0FBZDs7QUFPQSxXQUFTQyxhQUFULENBQXdCQyxXQUF4QixFQUFxQztBQUNuQ1gsVUFBTUcsS0FBTixHQUFjRCxPQUFPRSxVQUFyQjtBQUNBSixVQUFNSyxNQUFOLEdBQWVILE9BQU9JLFdBQXRCO0FBQ0EsUUFBSVAsVUFBVWEsTUFBZCxFQUFzQmIsVUFBVWEsTUFBVixDQUFpQlosTUFBTUcsS0FBdkIsRUFBOEJILE1BQU1LLE1BQXBDO0FBQ3ZCOztBQUVESCxTQUFPVyxnQkFBUCxDQUF3QixRQUF4QixFQUFrQyxpQkFBT0MsUUFBUCxDQUFnQkosYUFBaEIsRUFBK0IsRUFBL0IsQ0FBbEM7O0FBRUEsTUFBTUssWUFBYWpCLE1BQU1rQixRQUFQLEdBQ2Qsd0JBQWN0QixnQkFBZ0JJLE1BQU1rQixRQUFOLENBQWVyQixHQUEvQixDQUFkLEVBQW1ERyxNQUFNbUIsTUFBekQsRUFBaUUsV0FBakUsRUFBOEUsU0FBOUUsQ0FEYyxHQUVkLEVBQUVDLElBQUksY0FBTSxDQUFFLENBQWQsRUFBZ0JDLE1BQU0sZ0JBQU0sQ0FBRSxDQUE5QixFQUFnQ0MsUUFBUSxrQkFBTSxDQUFFLENBQWhELEVBQWtEQyxTQUFTLG1CQUFNLENBQUUsQ0FBbkUsRUFGSjs7QUFJQU4sWUFBVUcsRUFBVixDQUFhLE9BQWIsRUFBc0IsWUFBTTtBQUMxQixRQUFNSSxnQkFBZ0I5QixPQUFPK0IsZ0JBQVAsRUFBdEI7QUFDQSxRQUFJRCxhQUFKLEVBQW1CO0FBQ2pCQSxvQkFBY0UsT0FBZDtBQUNEO0FBQ0YsR0FMRDs7QUFPQSx3QkFDRTtBQUNFLGVBQVdULFNBRGI7QUFFRSxXQUFPakIsS0FGVDtBQUdFLFlBQVFBLE1BQU1tQjtBQUhoQixLQUlNakIsS0FKTjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxLQURGLEVBTUV5QixTQUFTQyxjQUFULENBQXdCLE9BQXhCLENBTkY7QUFRRCIsImZpbGUiOiJkb20uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgbG9kYXNoIGZyb20gJ2xvZGFzaCdcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCB7IHJlbmRlciB9IGZyb20gJ3JlYWN0LWRvbSdcbmltcG9ydCBXZWJzb2NrZXQgZnJvbSAnaGFpa3Utc2VyaWFsaXphdGlvbi9zcmMvd3MvV2Vic29ja2V0J1xuaW1wb3J0IENyZWF0b3IgZnJvbSAnLi9yZWFjdC9DcmVhdG9yJ1xuXG52YXIgcmVtb3RlID0gcmVxdWlyZSgnZWxlY3Ryb24nKS5yZW1vdGVcblxuZnVuY3Rpb24gX2ZpeFBsdW1iaW5nVXJsICh1cmwpIHsgcmV0dXJuIHVybC5yZXBsYWNlKC9eaHR0cC8sICd3cycpIH1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZG9tIChtb2R1cywgaGFpa3UpIHtcbiAgY29uc3QgbGlzdGVuZXJzID0ge31cblxuICBjb25zdCBwcm9wcyA9IHtcbiAgICBtZWRpdW06IHdpbmRvdyxcbiAgICB3aWR0aDogd2luZG93LmlubmVyV2lkdGgsXG4gICAgaGVpZ2h0OiB3aW5kb3cuaW5uZXJIZWlnaHQsXG4gICAgbGlzdGVuOiAoa2V5LCBmbikgPT4geyBsaXN0ZW5lcnNba2V5XSA9IGZuIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHJlc2l6ZUhhbmRsZXIgKHJlc2l6ZUV2ZW50KSB7XG4gICAgcHJvcHMud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aFxuICAgIHByb3BzLmhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodFxuICAgIGlmIChsaXN0ZW5lcnMucmVzaXplKSBsaXN0ZW5lcnMucmVzaXplKHByb3BzLndpZHRoLCBwcm9wcy5oZWlnaHQpXG4gIH1cblxuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgbG9kYXNoLmRlYm91bmNlKHJlc2l6ZUhhbmRsZXIsIDY0KSlcblxuICBjb25zdCB3ZWJzb2NrZXQgPSAoaGFpa3UucGx1bWJpbmcpXG4gICAgPyBuZXcgV2Vic29ja2V0KF9maXhQbHVtYmluZ1VybChoYWlrdS5wbHVtYmluZy51cmwpLCBoYWlrdS5mb2xkZXIsICdjb21tYW5kZXInLCAnY3JlYXRvcicpXG4gICAgOiB7IG9uOiAoKSA9PiB7fSwgc2VuZDogKCkgPT4ge30sIG1ldGhvZDogKCkgPT4ge30sIHJlcXVlc3Q6ICgpID0+IHt9IH1cblxuICB3ZWJzb2NrZXQub24oJ2Nsb3NlJywgKCkgPT4ge1xuICAgIGNvbnN0IGN1cnJlbnRXaW5kb3cgPSByZW1vdGUuZ2V0Q3VycmVudFdpbmRvdygpXG4gICAgaWYgKGN1cnJlbnRXaW5kb3cpIHtcbiAgICAgIGN1cnJlbnRXaW5kb3cuZGVzdHJveSgpXG4gICAgfVxuICB9KVxuXG4gIHJlbmRlcihcbiAgICA8Q3JlYXRvclxuICAgICAgd2Vic29ja2V0PXt3ZWJzb2NrZXR9XG4gICAgICBoYWlrdT17aGFpa3V9XG4gICAgICBmb2xkZXI9e2hhaWt1LmZvbGRlcn1cbiAgICAgIHsuLi5wcm9wc30gLz4sXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21vdW50JylcbiAgKVxufVxuIl19