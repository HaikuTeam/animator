'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ws = require('ws');

var _ws2 = _interopRequireDefault(_ws);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _async = require('async');

var _async2 = _interopRequireDefault(_async);

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

// require('njstrace').inject()

Error.stackTraceLimit = Infinity; // Show long stack traces when errors are shown

var pinfo = process.pid + ' ' + _path2.default.basename(__filename) + ' ' + _path2.default.basename(process.execPath);

var PROCESSES = [];

// A handle is not present if this wasn't spawned
if (process.stdout._handle) {
  process.stdout._handle.setBlocking(true); // Don't truncate output to stdout
}

// process.stdin.resume()
process.on('uncaughtException', function (exception) {
  console.error(exception);
  return _async2.default.eachSeries(PROCESSES, function (proc, next) {
    return proc.teardown(next);
  }, function () {
    _LoggerInstance2.default.sacred('[process] ' + pinfo + ' exiting after exception');
    process.exit(1);
  });
});

process.on('SIGINT', function () {
  _LoggerInstance2.default.info('[process] ' + pinfo + ' got interrupt signal');
  return _async2.default.eachSeries(PROCESSES, function (proc, next) {
    return proc.teardown(next);
  }, function () {
    _LoggerInstance2.default.sacred('[process] ' + pinfo + ' exiting after interrupt');
    process.exit();
  });
});

process.on('SIGTERM', function () {
  _LoggerInstance2.default.info('[process] ' + pinfo + ' got terminate signal');
  return _async2.default.eachSeries(PROCESSES, function (proc, next) {
    return proc.teardown(next);
  }, function () {
    _LoggerInstance2.default.sacred('[process] ' + pinfo + ' exiting after termination');
    process.exit();
  });
});

process.on('error', function (error) {
  _LoggerInstance2.default.error(error);
});

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
      if (data === 'reestablishConnection!') {
        _this.reestablishConnection();
      }
    });
    process.on('exit', function (status) {
      _this.emit('exit');
      process.exit(status);
    });
    PROCESSES.push(_this);
    return _this;
  }

  _createClass(ProcessBase, [{
    key: 'reestablishConnection',
    value: function reestablishConnection() {
      var _this2 = this;

      if (this.isOpen()) {
        _LoggerInstance2.default.info('[process] still connected ok; skipping reestablish');
        return void 0; // No need to reconnect
      }

      if (this.haiku && this.haiku.socket) {
        var url = 'http://' + (this.haiku.socket.host || process.env.HAIKU_PLUMBING_HOST) + ':' + (this.haiku.socket.port || process.env.HAIKU_PLUMBING_PORT) + '?type=controllee&alias=' + this.alias + '&folder=' + (this.haiku.folder || process.env.HAIKU_PROJECT_FOLDER);
        this.socket = new _WebsocketClient2.default(new _ws2.default(url));
        this.socket.on('request', this.emit.bind(this, 'request'));
        this.socket.on('close', function () {
          _this2.socket.wsc.readyState = _ws2.default.CLOSED;
        });
        this.socket.on('error', function () {
          _LoggerInstance2.default.info('[process] socket error (' + url + ')');
        });
      } else {
        _LoggerInstance2.default.warn('[process] no socket info given; cannot connect to Haiku plumbing hub (via ' + this.alias + ')');
      }
    }
  }, {
    key: 'teardown',
    value: function teardown(cb) {
      return this.emit('teardown', cb);
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
  }]);

  return ProcessBase;
}(_events.EventEmitter);

exports.default = ProcessBase;


ProcessBase.HAIKU = (0, _haikuInfo2.default)();
//# sourceMappingURL=ProcessBase.js.map