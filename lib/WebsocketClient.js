'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _serializeError = require('./serializeError');

var _serializeError2 = _interopRequireDefault(_serializeError);

var _events = require('events');

var _ws = require('ws');

var _ws2 = _interopRequireDefault(_ws);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var WebsocketClient = function (_EventEmitter) {
  _inherits(WebsocketClient, _EventEmitter);

  function WebsocketClient(wsc) {
    var platform = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'nodejs';

    _classCallCheck(this, WebsocketClient);

    var _this = _possibleConstructorReturn(this, (WebsocketClient.__proto__ || Object.getPrototypeOf(WebsocketClient)).call(this));

    _this.wsc = wsc;
    _this.wsc.on('open', _this.emit.bind(_this, 'open'));
    _this.wsc.on('close', _this.emit.bind(_this, 'close'));
    _this.wsc.on('error', _this.emit.bind(_this, 'error'));
    _this.wsc.on('message', function (data, flags) {
      var message = JSON.parse(data);
      _this.emit('message', message, data, flags);
    });
    _this.requests = {};
    _this.on('message', function (message) {
      // Don't treat signals as part of the normal req/res cycle
      if (message.signal) {
        return _this.emit('signal', message.signal);
      }

      // Don't treat broadcasts as part of the normal req/res cycle
      if (message.type === 'broadcast') {
        return _this.emit('broadcast', message);
      }

      var entry = _this.requests[message.id];
      if (!entry) {
        return _this.emit('request', message, function (error, result) {
          var reply = {
            error: error ? (0, _serializeError2.default)(error) : void 0,
            result: result === undefined ? null : result,
            id: message.id // Not necessarily present
          };
          return _this.send(reply);
        });
      }
      delete _this.requests[message.id];
      var callback = entry.callback;
      var error = message.error ? (0, _serializeError2.default)(message.error) : null;
      var result = message.result;
      return callback(error, result);
    });
    return _this;
  }

  _createClass(WebsocketClient, [{
    key: 'isOpen',
    value: function isOpen() {
      return this.wsc.readyState === _ws2.default.OPEN;
    }
  }, {
    key: 'request',
    value: function request(message, callback) {
      if (message.id === undefined) message.id = 'request-' + Math.random();
      this.requests[message.id] = { callback: callback };
      return this.send(message);
    }
  }, {
    key: 'send',
    value: function send(message) {
      var string = JSON.stringify(message);
      return this.wsc.send(string);
    }
  }]);

  return WebsocketClient;
}(_events.EventEmitter);

exports.default = WebsocketClient;