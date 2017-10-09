'use strict';

var _jsxFileName = 'src/react/index.js';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _qs = require('qs');

var _qs2 = _interopRequireDefault(_qs);

var _Websocket = require('haiku-serialization/src/ws/Websocket');

var _Websocket2 = _interopRequireDefault(_Websocket);

var _Glass = require('./Glass');

var _Glass2 = _interopRequireDefault(_Glass);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

if (process.env.HAIKU_RELEASE_ENVIRONMENT === 'production' || process.env.HAIKU_RELEASE_ENVIRONMENT === 'staging') {
  window.Raven.config('https://287e52df9cfd48aab7f6091ec17a5921@sentry.io/226362', {
    environment: process.env.HAIKU_RELEASE_ENVIRONMENT || 'development',
    release: process.env.HAIKU_RELEASE_VERSION
  }).install();
  window.Raven.context(function () {
    go();
  });
} else {
  go();
}

function go() {
  // We are in a webview; use query string parameters for boot-up configuration
  var search = (window.location.search || '').split('?')[1] || '';
  var params = _qs2.default.parse(search, { plainObjects: true });
  var config = _lodash2.default.assign({}, params);
  if (!config.folder) throw new Error('A folder (the absolute path to the user project) is required');
  function _fixPlumbingUrl(url) {
    return url.replace(/^http/, 'ws');
  }

  var userconfig = require(_path2.default.join(config.folder, 'haiku.js'));

  var websocket = config.plumbing ? new _Websocket2.default(_fixPlumbingUrl(config.plumbing), config.folder, 'controllee', 'glass') : { on: function on() {}, send: function send() {}, method: function method() {}, request: function request() {}, action: function action() {} };

  _reactDom2.default.render(_react2.default.createElement(_Glass2.default, {
    envoy: config.envoy,
    userconfig: userconfig,
    websocket: websocket,
    folder: config.folder,
    projectName: userconfig.name || 'untitled',
    __source: {
      fileName: _jsxFileName,
      lineNumber: 36
    },
    __self: this
  }), document.getElementById('root'));
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZWFjdC9pbmRleC5qcyJdLCJuYW1lcyI6WyJwcm9jZXNzIiwiZW52IiwiSEFJS1VfUkVMRUFTRV9FTlZJUk9OTUVOVCIsIndpbmRvdyIsIlJhdmVuIiwiY29uZmlnIiwiZW52aXJvbm1lbnQiLCJyZWxlYXNlIiwiSEFJS1VfUkVMRUFTRV9WRVJTSU9OIiwiaW5zdGFsbCIsImNvbnRleHQiLCJnbyIsInNlYXJjaCIsImxvY2F0aW9uIiwic3BsaXQiLCJwYXJhbXMiLCJwYXJzZSIsInBsYWluT2JqZWN0cyIsImFzc2lnbiIsImZvbGRlciIsIkVycm9yIiwiX2ZpeFBsdW1iaW5nVXJsIiwidXJsIiwicmVwbGFjZSIsInVzZXJjb25maWciLCJyZXF1aXJlIiwiam9pbiIsIndlYnNvY2tldCIsInBsdW1iaW5nIiwib24iLCJzZW5kIiwibWV0aG9kIiwicmVxdWVzdCIsImFjdGlvbiIsInJlbmRlciIsImVudm95IiwibmFtZSIsImRvY3VtZW50IiwiZ2V0RWxlbWVudEJ5SWQiXSwibWFwcGluZ3MiOiI7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUEsSUFBSUEsUUFBUUMsR0FBUixDQUFZQyx5QkFBWixLQUEwQyxZQUExQyxJQUEwREYsUUFBUUMsR0FBUixDQUFZQyx5QkFBWixLQUEwQyxTQUF4RyxFQUFtSDtBQUNqSEMsU0FBT0MsS0FBUCxDQUFhQyxNQUFiLENBQW9CLDJEQUFwQixFQUFpRjtBQUMvRUMsaUJBQWFOLFFBQVFDLEdBQVIsQ0FBWUMseUJBQVosSUFBeUMsYUFEeUI7QUFFL0VLLGFBQVNQLFFBQVFDLEdBQVIsQ0FBWU87QUFGMEQsR0FBakYsRUFHR0MsT0FISDtBQUlBTixTQUFPQyxLQUFQLENBQWFNLE9BQWIsQ0FBcUIsWUFBWTtBQUMvQkM7QUFDRCxHQUZEO0FBR0QsQ0FSRCxNQVFPO0FBQ0xBO0FBQ0Q7O0FBRUQsU0FBU0EsRUFBVCxHQUFlO0FBQ2I7QUFDQSxNQUFNQyxTQUFTLENBQUNULE9BQU9VLFFBQVAsQ0FBZ0JELE1BQWhCLElBQTBCLEVBQTNCLEVBQStCRSxLQUEvQixDQUFxQyxHQUFyQyxFQUEwQyxDQUExQyxLQUFnRCxFQUEvRDtBQUNBLE1BQU1DLFNBQVMsYUFBR0MsS0FBSCxDQUFTSixNQUFULEVBQWlCLEVBQUVLLGNBQWMsSUFBaEIsRUFBakIsQ0FBZjtBQUNBLE1BQU1aLFNBQVMsaUJBQU9hLE1BQVAsQ0FBYyxFQUFkLEVBQWtCSCxNQUFsQixDQUFmO0FBQ0EsTUFBSSxDQUFDVixPQUFPYyxNQUFaLEVBQW9CLE1BQU0sSUFBSUMsS0FBSixDQUFVLDhEQUFWLENBQU47QUFDcEIsV0FBU0MsZUFBVCxDQUEwQkMsR0FBMUIsRUFBK0I7QUFBRSxXQUFPQSxJQUFJQyxPQUFKLENBQVksT0FBWixFQUFxQixJQUFyQixDQUFQO0FBQW1DOztBQUVwRSxNQUFNQyxhQUFhQyxRQUFRLGVBQUtDLElBQUwsQ0FBVXJCLE9BQU9jLE1BQWpCLEVBQXlCLFVBQXpCLENBQVIsQ0FBbkI7O0FBRUEsTUFBTVEsWUFBYXRCLE9BQU91QixRQUFSLEdBQ2Qsd0JBQWNQLGdCQUFnQmhCLE9BQU91QixRQUF2QixDQUFkLEVBQWdEdkIsT0FBT2MsTUFBdkQsRUFBK0QsWUFBL0QsRUFBNkUsT0FBN0UsQ0FEYyxHQUVkLEVBQUVVLElBQUksY0FBTSxDQUFFLENBQWQsRUFBZ0JDLE1BQU0sZ0JBQU0sQ0FBRSxDQUE5QixFQUFnQ0MsUUFBUSxrQkFBTSxDQUFFLENBQWhELEVBQWtEQyxTQUFTLG1CQUFNLENBQUUsQ0FBbkUsRUFBcUVDLFFBQVEsa0JBQU0sQ0FBRSxDQUFyRixFQUZKOztBQUlBLHFCQUFTQyxNQUFULENBQ0U7QUFDRSxXQUFPN0IsT0FBTzhCLEtBRGhCO0FBRUUsZ0JBQVlYLFVBRmQ7QUFHRSxlQUFXRyxTQUhiO0FBSUUsWUFBUXRCLE9BQU9jLE1BSmpCO0FBS0UsaUJBQWFLLFdBQVdZLElBQVgsSUFBbUIsVUFMbEM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFERixFQVFFQyxTQUFTQyxjQUFULENBQXdCLE1BQXhCLENBUkY7QUFVRCIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCBSZWFjdERPTSBmcm9tICdyZWFjdC1kb20nXG5pbXBvcnQgbG9kYXNoIGZyb20gJ2xvZGFzaCdcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQgcXMgZnJvbSAncXMnXG5pbXBvcnQgV2Vic29ja2V0IGZyb20gJ2hhaWt1LXNlcmlhbGl6YXRpb24vc3JjL3dzL1dlYnNvY2tldCdcbmltcG9ydCBHbGFzcyBmcm9tICcuL0dsYXNzJ1xuXG5pZiAocHJvY2Vzcy5lbnYuSEFJS1VfUkVMRUFTRV9FTlZJUk9OTUVOVCA9PT0gJ3Byb2R1Y3Rpb24nIHx8IHByb2Nlc3MuZW52LkhBSUtVX1JFTEVBU0VfRU5WSVJPTk1FTlQgPT09ICdzdGFnaW5nJykge1xuICB3aW5kb3cuUmF2ZW4uY29uZmlnKCdodHRwczovLzI4N2U1MmRmOWNmZDQ4YWFiN2Y2MDkxZWMxN2E1OTIxQHNlbnRyeS5pby8yMjYzNjInLCB7XG4gICAgZW52aXJvbm1lbnQ6IHByb2Nlc3MuZW52LkhBSUtVX1JFTEVBU0VfRU5WSVJPTk1FTlQgfHwgJ2RldmVsb3BtZW50JyxcbiAgICByZWxlYXNlOiBwcm9jZXNzLmVudi5IQUlLVV9SRUxFQVNFX1ZFUlNJT05cbiAgfSkuaW5zdGFsbCgpXG4gIHdpbmRvdy5SYXZlbi5jb250ZXh0KGZ1bmN0aW9uICgpIHtcbiAgICBnbygpXG4gIH0pXG59IGVsc2Uge1xuICBnbygpXG59XG5cbmZ1bmN0aW9uIGdvICgpIHtcbiAgLy8gV2UgYXJlIGluIGEgd2VidmlldzsgdXNlIHF1ZXJ5IHN0cmluZyBwYXJhbWV0ZXJzIGZvciBib290LXVwIGNvbmZpZ3VyYXRpb25cbiAgY29uc3Qgc2VhcmNoID0gKHdpbmRvdy5sb2NhdGlvbi5zZWFyY2ggfHwgJycpLnNwbGl0KCc/JylbMV0gfHwgJydcbiAgY29uc3QgcGFyYW1zID0gcXMucGFyc2Uoc2VhcmNoLCB7IHBsYWluT2JqZWN0czogdHJ1ZSB9KVxuICBjb25zdCBjb25maWcgPSBsb2Rhc2guYXNzaWduKHt9LCBwYXJhbXMpXG4gIGlmICghY29uZmlnLmZvbGRlcikgdGhyb3cgbmV3IEVycm9yKCdBIGZvbGRlciAodGhlIGFic29sdXRlIHBhdGggdG8gdGhlIHVzZXIgcHJvamVjdCkgaXMgcmVxdWlyZWQnKVxuICBmdW5jdGlvbiBfZml4UGx1bWJpbmdVcmwgKHVybCkgeyByZXR1cm4gdXJsLnJlcGxhY2UoL15odHRwLywgJ3dzJykgfVxuXG4gIGNvbnN0IHVzZXJjb25maWcgPSByZXF1aXJlKHBhdGguam9pbihjb25maWcuZm9sZGVyLCAnaGFpa3UuanMnKSlcblxuICBjb25zdCB3ZWJzb2NrZXQgPSAoY29uZmlnLnBsdW1iaW5nKVxuICAgID8gbmV3IFdlYnNvY2tldChfZml4UGx1bWJpbmdVcmwoY29uZmlnLnBsdW1iaW5nKSwgY29uZmlnLmZvbGRlciwgJ2NvbnRyb2xsZWUnLCAnZ2xhc3MnKVxuICAgIDogeyBvbjogKCkgPT4ge30sIHNlbmQ6ICgpID0+IHt9LCBtZXRob2Q6ICgpID0+IHt9LCByZXF1ZXN0OiAoKSA9PiB7fSwgYWN0aW9uOiAoKSA9PiB7fSB9XG5cbiAgUmVhY3RET00ucmVuZGVyKFxuICAgIDxHbGFzc1xuICAgICAgZW52b3k9e2NvbmZpZy5lbnZveX1cbiAgICAgIHVzZXJjb25maWc9e3VzZXJjb25maWd9XG4gICAgICB3ZWJzb2NrZXQ9e3dlYnNvY2tldH1cbiAgICAgIGZvbGRlcj17Y29uZmlnLmZvbGRlcn1cbiAgICAgIHByb2plY3ROYW1lPXt1c2VyY29uZmlnLm5hbWUgfHwgJ3VudGl0bGVkJ31cbiAgICAgIC8+LFxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyb290JylcbiAgKVxufVxuIl19