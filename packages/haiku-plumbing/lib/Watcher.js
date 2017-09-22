'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _chokidar = require('chokidar');

var _chokidar2 = _interopRequireDefault(_chokidar);

var _events = require('events');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Watcher = function (_EventEmitter) {
  _inherits(Watcher, _EventEmitter);

  function Watcher() {
    _classCallCheck(this, Watcher);

    return _possibleConstructorReturn(this, (Watcher.__proto__ || Object.getPrototypeOf(Watcher)).apply(this, arguments));
  }

  _createClass(Watcher, [{
    key: 'watch',
    value: function watch(entry) {
      var _this2 = this;

      this.watcher = _chokidar2.default.watch(entry, {
        // - Avoid any git blobs (there are tons of these)
        // - Avoid any sketch tempfiles (these are ephemeral and not needed)
        ignored: /(node_modules|bower_components|jspm_modules|\.git|~\.sketch)/,
        ignoreInitial: true,
        persistent: true,
        usePolling: true,
        // awaitWriteFinish: true, // Truthy delays emissions for larger files
        alwaysStat: true
      });

      this.watcher.on('add', this.emit.bind(this, 'add'));
      this.watcher.on('change', function (path, maybeStats) {
        _this2.emit('change', path, maybeStats);
      });
      this.watcher.on('unlink', this.emit.bind(this, 'remove'));
      this.watcher.on('error', this.emit.bind(this, 'error'));
    }
  }, {
    key: 'stop',
    value: function stop() {
      this.watcher.close();
    }
  }]);

  return Watcher;
}(_events.EventEmitter);

exports.default = Watcher;
//# sourceMappingURL=Watcher.js.map