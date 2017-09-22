'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ws = require('ws');

var _ws2 = _interopRequireDefault(_ws);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _events = require('events');

var _LoggerInstance = require('haiku-serialization/src/utils/LoggerInstance');

var _LoggerInstance2 = _interopRequireDefault(_LoggerInstance);

var _WebsocketClient = require('haiku-websockets/lib/WebsocketClient');

var _WebsocketClient2 = _interopRequireDefault(_WebsocketClient);

var _envInfo2 = require('./envInfo');

var _envInfo3 = _interopRequireDefault(_envInfo2);

var _haikuInfo = require('./haikuInfo');

var _haikuInfo2 = _interopRequireDefault(_haikuInfo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var killables = [];
function killall() {
  killables.forEach(function (killable) {
    killable.kill();
  });
}

var pinfo = process.pid + ' ' + _path2.default.basename(__filename) + ' ' + _path2.default.basename(process.execPath);

function attachProcess() {
  Error.stackTraceLimit = Infinity; // Show long stack traces when errors are shown
  // A handle is not present if this wasn't spawned
  if (process.stdout._handle) {
    process.stdout._handle.setBlocking(true); // Don't truncate output to stdout
  }
  // process.stdin.resume()
  process.on('uncaughtException', function (exception) {
    console.error(exception);
    killall();
    process.exit(1);
  });
  process.on('SIGINT', function () {
    _LoggerInstance2.default.info('[process] ' + pinfo + ' got interrupt signal');
    killall();
    process.exit();
  });
  process.on('SIGTERM', function () {
    _LoggerInstance2.default.info('[process] ' + pinfo + ' got terminate signal');
    killall();
    process.exit();
  });
  process.on('error', function (error) {
    _LoggerInstance2.default.error(error);
  });
}

var ProcessBase = function (_EventEmitter) {
  _inherits(ProcessBase, _EventEmitter);

  function ProcessBase(alias) {
    var api = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    _classCallCheck(this, ProcessBase);

    var _this = _possibleConstructorReturn(this, (ProcessBase.__proto__ || Object.getPrototypeOf(ProcessBase)).call(this));

    var _envInfo = (0, _envInfo3.default)(),
        args = _envInfo.args,
        subcommand = _envInfo.subcommand,
        flags = _envInfo.flags;

    _this.$ = [subcommand].concat(args).concat(flags); // To invoke this as a CLI command
    _this.alias = alias || _this.constructor.name;
    _this.api = api;
    _this.options = options;
    _this.haiku = ProcessBase.HAIKU;
    _this.reestablishConnection();
    process.on('message', function (data) {
      if (data === 'reestablishConnection!') _this.reestablishConnection();
    });
    process.on('exit', function (status) {
      _this.emit('exit');
      process.exit(status);
    });
    return _this;
  }

  _createClass(ProcessBase, [{
    key: 'reestablishConnection',
    value: function reestablishConnection() {
      if (this.isOpen()) {
        _LoggerInstance2.default.info('[process] still connected ok; skipping reestablish');
        return void 0; // No need to reconnect
      }

      if (this.haiku && this.haiku.socket) {
        var url = 'http://' + (this.haiku.socket.host || process.env.HAIKU_PLUMBING_HOST) + ':' + (this.haiku.socket.port || process.env.HAIKU_PLUMBING_PORT) + '?type=controllee&alias=' + this.alias + '&folder=' + (this.haiku.folder || process.env.HAIKU_PROJECT_FOLDER);
        _LoggerInstance2.default.info('[process] establishing websocket connection to ' + url);
        this.socket = new _WebsocketClient2.default(new _ws2.default(url));
        this.socket.on('request', this.emit.bind(this, 'request'));
      } else {
        _LoggerInstance2.default.warn('[process] no socket info given; cannot connect to Haiku plumbing hub (via ' + this.alias + ')');
      }
    }
  }, {
    key: 'getReadyState',
    value: function getReadyState() {
      if (!this.socket) return 0;
      if (!this.socket.wsc) return 0;
      return this.socket.wsc.readyState;
    }
  }, {
    key: 'isOpen',
    value: function isOpen() {
      return this.getReadyState() === _ws2.default.OPEN;
    }
  }, {
    key: 'isConnecting',
    value: function isConnecting() {
      return this.getReadyState() === _ws2.default.CONNECTING;
    }
  }, {
    key: 'emitUp',
    value: function emitUp(message) {
      process.send(message);
      return this;
    }
  }, {
    key: 'exit',
    value: function exit(status) {
      process.exit(status);
    }
  }, {
    key: 'boom',
    value: function boom(error) {
      throw error;
    }
  }]);

  return ProcessBase;
}(_events.EventEmitter);

exports.default = ProcessBase;


attachProcess();
ProcessBase.HAIKU = (0, _haikuInfo2.default)();
//# sourceMappingURL=ProcessBase.js.map