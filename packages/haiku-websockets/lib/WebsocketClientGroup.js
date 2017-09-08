'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash.foreach');

var _lodash2 = _interopRequireDefault(_lodash);

var _events = require('events');

var _ws = require('ws');

var _ws2 = _interopRequireDefault(_ws);

var _WebsocketClient = require('./WebsocketClient');

var _WebsocketClient2 = _interopRequireDefault(_WebsocketClient);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var WebsocketClientGroup = function (_EventEmitter) {
  _inherits(WebsocketClientGroup, _EventEmitter);

  function WebsocketClientGroup() {
    var platform = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'nodejs';

    _classCallCheck(this, WebsocketClientGroup);

    var _this = _possibleConstructorReturn(this, (WebsocketClientGroup.__proto__ || Object.getPrototypeOf(WebsocketClientGroup)).call(this));

    _this.platform = platform;
    _this.clients = {};
    return _this;
  }

  _createClass(WebsocketClientGroup, [{
    key: 'setup',
    value: function setup(mapping) {
      var _this2 = this;

      (0, _lodash2.default)(mapping, function (url, name) {
        var wsc = new _ws2.default(url);
        var client = new _WebsocketClient2.default(wsc, _this2.platform);
        client.on('open', function () {
          _this2.clients[name] = client;
          // We're ready if we've successfully opened all connections in this group
          if (Object.keys(mapping).length === Object.keys(_this2.clients).length) {
            _this2.emit('ready', mapping, _this2.clients, _this2);
          }
        });
      });
    }
  }]);

  return WebsocketClientGroup;
}(_events.EventEmitter);

exports.default = WebsocketClientGroup;


WebsocketClientGroup.fleetToClientMapping = function fleetToClientMapping(fleet) {
  var mapping = {};
  (0, _lodash2.default)(fleet, function (ship) {
    mapping[ship.alias] = ship.control.websocket;
  });
  return mapping;
};