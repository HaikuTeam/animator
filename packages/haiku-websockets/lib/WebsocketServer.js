'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _serializeError = require('./serializeError');

var _serializeError2 = _interopRequireDefault(_serializeError);

var _events = require('events');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var WebsocketServer = function (_EventEmitter) {
  _inherits(WebsocketServer, _EventEmitter);

  function WebsocketServer(wss /* <- this wss should be a 'connection' socket */) {
    _classCallCheck(this, WebsocketServer);

    var _this = _possibleConstructorReturn(this, (WebsocketServer.__proto__ || Object.getPrototypeOf(WebsocketServer)).call(this));

    _this.wss = wss;
    _this.wss.on('message', function (data, flags) {
      var message = JSON.parse(data);
      _this.emit('message', message, data, flags);
    });
    _this.on('message', function (message) {
      if (message.method) {
        return _this.emit('request', message, function (error, result) {
          var reply = {
            error: error ? (0, _serializeError2.default)(error) : void 0,
            result: result === undefined ? null : result,
            id: message.id // Not necessarily present
          };
          return _this.send(reply);
        });
      }
    });
    return _this;
  }

  _createClass(WebsocketServer, [{
    key: 'send',
    value: function send(message) {
      var data = JSON.stringify(message);
      return this.wss.send(data);
    }
  }, {
    key: 'kill',
    value: function kill(cb) {
      this.wss.close(cb);
      return this;
    }
  }]);

  return WebsocketServer;
}(_events.EventEmitter);

exports.default = WebsocketServer;