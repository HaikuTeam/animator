'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash.clone');

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = require('lodash.filter');

var _lodash4 = _interopRequireDefault(_lodash3);

var _ws = require('ws');

var _ws2 = _interopRequireDefault(_ws);

var _events = require('events');

var _qs = require('qs');

var _qs2 = _interopRequireDefault(_qs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DEFAULT_URL = '';
var DEFAULT_QUERY = '';
var DEFAULT_TYPE = 'default';
var DEFAULT_HAIKU = {};

var WebsocketServerWithManyClients = function (_EventEmitter) {
  _inherits(WebsocketServerWithManyClients, _EventEmitter);

  function WebsocketServerWithManyClients() {
    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, WebsocketServerWithManyClients);

    var _this = _possibleConstructorReturn(this, (WebsocketServerWithManyClients.__proto__ || Object.getPrototypeOf(WebsocketServerWithManyClients)).call(this));

    _this.wss = new _ws2.default.Server(config);
    _this.wss.on('connection', function (websocket, request) {
      var url = request.url || DEFAULT_URL;
      var query = url.split('?')[1] || DEFAULT_QUERY;
      var params = _qs2.default.parse(query);
      if (!params.type) params.type = DEFAULT_TYPE;
      if (!params.haiku) params.haiku = DEFAULT_HAIKU;
      if (!websocket.params) websocket.params = params;
      _this.emit('connection', websocket);
      return websocket.on('message', function (data) {
        return _this.handleClientMessage(data, websocket);
      });
    });
    _this.requests = {};
    return _this;
  }

  _createClass(WebsocketServerWithManyClients, [{
    key: 'handleClientMessage',
    value: function handleClientMessage(data, websocket) {
      var message = jsonParse(data);
      var array = this.requests[message.id];
      // Assume this is an incoming standalone request, not one we are waiting a reply to
      if (!array) {
        return this.emit('message', message, websocket);
      }
      delete this.requests[message.id];
      return array.forEach(function (entry) {
        var callback = entry.callback;
        return callback(message.error, message.result, entry.message.index);
      });
    }
  }, {
    key: 'requestToClients',
    value: function requestToClients(clients, message, callback) {
      var _this2 = this;

      if (message.id === undefined) message.id = 'request-' + Math.random();
      if (!this.requests[message.id]) this.requests[message.id] = [];
      return clients.forEach(function (websocket, index) {
        var msg = (0, _lodash2.default)(message);
        msg.index = _this2.requests[message.id].push({ message: message, callback: callback }) - 1;
        var string = JSON.stringify(message);
        return websocket.send(string);
      });
    }
  }, {
    key: 'requestToAllConnectedClients',
    value: function requestToAllConnectedClients(message, callback) {
      return this.requestToClients(this.wss.clients, message, callback);
    }
  }, {
    key: 'requestToClientsWhere',
    value: function requestToClientsWhere(query, message, callback) {
      var filtered = (0, _lodash4.default)(this.wss.clients, query);
      return this.requestToClients(filtered, message, callback);
    }
  }, {
    key: 'teardown',
    value: function teardown(cb) {
      return this.wss.close(cb);
    }
  }]);

  return WebsocketServerWithManyClients;
}(_events.EventEmitter);

exports.default = WebsocketServerWithManyClients;


function jsonParse(str) {
  try {
    return JSON.parse(str);
  } catch (exception) {
    return {};
  }
}