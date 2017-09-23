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
    currentWindow.destroy();
  });

  (0, _reactDom.render)(_react2.default.createElement(_Creator2.default, Object.assign({
    websocket: websocket,
    haiku: haiku,
    folder: haiku.folder
  }, props, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 39
    },
    __self: this
  })), document.getElementById('mount'));
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9kb20uanMiXSwibmFtZXMiOlsiZG9tIiwicmVtb3RlIiwicmVxdWlyZSIsIl9maXhQbHVtYmluZ1VybCIsInVybCIsInJlcGxhY2UiLCJtb2R1cyIsImhhaWt1IiwibGlzdGVuZXJzIiwicHJvcHMiLCJtZWRpdW0iLCJ3aW5kb3ciLCJ3aWR0aCIsImlubmVyV2lkdGgiLCJoZWlnaHQiLCJpbm5lckhlaWdodCIsImxpc3RlbiIsImtleSIsImZuIiwicmVzaXplSGFuZGxlciIsInJlc2l6ZUV2ZW50IiwicmVzaXplIiwiYWRkRXZlbnRMaXN0ZW5lciIsImRlYm91bmNlIiwid2Vic29ja2V0IiwicGx1bWJpbmciLCJmb2xkZXIiLCJvbiIsInNlbmQiLCJtZXRob2QiLCJyZXF1ZXN0IiwiY3VycmVudFdpbmRvdyIsImdldEN1cnJlbnRXaW5kb3ciLCJkZXN0cm95IiwiZG9jdW1lbnQiLCJnZXRFbGVtZW50QnlJZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7O2tCQVV3QkEsRzs7QUFWeEI7Ozs7QUFDQTs7OztBQUNBOztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBLElBQUlDLFNBQVNDLFFBQVEsVUFBUixFQUFvQkQsTUFBakM7O0FBRUEsU0FBU0UsZUFBVCxDQUEwQkMsR0FBMUIsRUFBK0I7QUFBRSxTQUFPQSxJQUFJQyxPQUFKLENBQVksT0FBWixFQUFxQixJQUFyQixDQUFQO0FBQW1DOztBQUVyRCxTQUFTTCxHQUFULENBQWNNLEtBQWQsRUFBcUJDLEtBQXJCLEVBQTRCO0FBQ3pDLE1BQU1DLFlBQVksRUFBbEI7O0FBRUEsTUFBTUMsUUFBUTtBQUNaQyxZQUFRQyxNQURJO0FBRVpDLFdBQU9ELE9BQU9FLFVBRkY7QUFHWkMsWUFBUUgsT0FBT0ksV0FISDtBQUlaQyxZQUFRLGdCQUFDQyxHQUFELEVBQU1DLEVBQU4sRUFBYTtBQUFFVixnQkFBVVMsR0FBVixJQUFpQkMsRUFBakI7QUFBcUI7QUFKaEMsR0FBZDs7QUFPQSxXQUFTQyxhQUFULENBQXdCQyxXQUF4QixFQUFxQztBQUNuQ1gsVUFBTUcsS0FBTixHQUFjRCxPQUFPRSxVQUFyQjtBQUNBSixVQUFNSyxNQUFOLEdBQWVILE9BQU9JLFdBQXRCO0FBQ0EsUUFBSVAsVUFBVWEsTUFBZCxFQUFzQmIsVUFBVWEsTUFBVixDQUFpQlosTUFBTUcsS0FBdkIsRUFBOEJILE1BQU1LLE1BQXBDO0FBQ3ZCOztBQUVESCxTQUFPVyxnQkFBUCxDQUF3QixRQUF4QixFQUFrQyxpQkFBT0MsUUFBUCxDQUFnQkosYUFBaEIsRUFBK0IsRUFBL0IsQ0FBbEM7O0FBRUEsTUFBTUssWUFBYWpCLE1BQU1rQixRQUFQLEdBQ2Qsd0JBQWN0QixnQkFBZ0JJLE1BQU1rQixRQUFOLENBQWVyQixHQUEvQixDQUFkLEVBQW1ERyxNQUFNbUIsTUFBekQsRUFBaUUsV0FBakUsRUFBOEUsU0FBOUUsQ0FEYyxHQUVkLEVBQUVDLElBQUksY0FBTSxDQUFFLENBQWQsRUFBZ0JDLE1BQU0sZ0JBQU0sQ0FBRSxDQUE5QixFQUFnQ0MsUUFBUSxrQkFBTSxDQUFFLENBQWhELEVBQWtEQyxTQUFTLG1CQUFNLENBQUUsQ0FBbkUsRUFGSjs7QUFJQU4sWUFBVUcsRUFBVixDQUFhLE9BQWIsRUFBc0IsWUFBTTtBQUMxQixRQUFNSSxnQkFBZ0I5QixPQUFPK0IsZ0JBQVAsRUFBdEI7QUFDQUQsa0JBQWNFLE9BQWQ7QUFDRCxHQUhEOztBQUtBLHdCQUNFO0FBQ0UsZUFBV1QsU0FEYjtBQUVFLFdBQU9qQixLQUZUO0FBR0UsWUFBUUEsTUFBTW1CO0FBSGhCLEtBSU1qQixLQUpOO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEtBREYsRUFNRXlCLFNBQVNDLGNBQVQsQ0FBd0IsT0FBeEIsQ0FORjtBQVFEIiwiZmlsZSI6ImRvbS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBsb2Rhc2ggZnJvbSAnbG9kYXNoJ1xuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgcmVuZGVyIH0gZnJvbSAncmVhY3QtZG9tJ1xuaW1wb3J0IFdlYnNvY2tldCBmcm9tICdoYWlrdS1zZXJpYWxpemF0aW9uL3NyYy93cy9XZWJzb2NrZXQnXG5pbXBvcnQgQ3JlYXRvciBmcm9tICcuL3JlYWN0L0NyZWF0b3InXG5cbnZhciByZW1vdGUgPSByZXF1aXJlKCdlbGVjdHJvbicpLnJlbW90ZVxuXG5mdW5jdGlvbiBfZml4UGx1bWJpbmdVcmwgKHVybCkgeyByZXR1cm4gdXJsLnJlcGxhY2UoL15odHRwLywgJ3dzJykgfVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBkb20gKG1vZHVzLCBoYWlrdSkge1xuICBjb25zdCBsaXN0ZW5lcnMgPSB7fVxuXG4gIGNvbnN0IHByb3BzID0ge1xuICAgIG1lZGl1bTogd2luZG93LFxuICAgIHdpZHRoOiB3aW5kb3cuaW5uZXJXaWR0aCxcbiAgICBoZWlnaHQ6IHdpbmRvdy5pbm5lckhlaWdodCxcbiAgICBsaXN0ZW46IChrZXksIGZuKSA9PiB7IGxpc3RlbmVyc1trZXldID0gZm4gfVxuICB9XG5cbiAgZnVuY3Rpb24gcmVzaXplSGFuZGxlciAocmVzaXplRXZlbnQpIHtcbiAgICBwcm9wcy53aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoXG4gICAgcHJvcHMuaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0XG4gICAgaWYgKGxpc3RlbmVycy5yZXNpemUpIGxpc3RlbmVycy5yZXNpemUocHJvcHMud2lkdGgsIHByb3BzLmhlaWdodClcbiAgfVxuXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCBsb2Rhc2guZGVib3VuY2UocmVzaXplSGFuZGxlciwgNjQpKVxuXG4gIGNvbnN0IHdlYnNvY2tldCA9IChoYWlrdS5wbHVtYmluZylcbiAgICA/IG5ldyBXZWJzb2NrZXQoX2ZpeFBsdW1iaW5nVXJsKGhhaWt1LnBsdW1iaW5nLnVybCksIGhhaWt1LmZvbGRlciwgJ2NvbW1hbmRlcicsICdjcmVhdG9yJylcbiAgICA6IHsgb246ICgpID0+IHt9LCBzZW5kOiAoKSA9PiB7fSwgbWV0aG9kOiAoKSA9PiB7fSwgcmVxdWVzdDogKCkgPT4ge30gfVxuXG4gIHdlYnNvY2tldC5vbignY2xvc2UnLCAoKSA9PiB7XG4gICAgY29uc3QgY3VycmVudFdpbmRvdyA9IHJlbW90ZS5nZXRDdXJyZW50V2luZG93KClcbiAgICBjdXJyZW50V2luZG93LmRlc3Ryb3koKVxuICB9KVxuXG4gIHJlbmRlcihcbiAgICA8Q3JlYXRvclxuICAgICAgd2Vic29ja2V0PXt3ZWJzb2NrZXR9XG4gICAgICBoYWlrdT17aGFpa3V9XG4gICAgICBmb2xkZXI9e2hhaWt1LmZvbGRlcn1cbiAgICAgIHsuLi5wcm9wc30gLz4sXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21vdW50JylcbiAgKVxufVxuIl19