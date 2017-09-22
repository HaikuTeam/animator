'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _events = require('events');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var QUEUE_INTERVAL = 64;
var LAST_WRITE_MARGIN_OF_ERROR_MILLISECONDS = 500;

var MasterModuleProject = function (_EventEmitter) {
  _inherits(MasterModuleProject, _EventEmitter);

  function MasterModuleProject(folder, proc) {
    _classCallCheck(this, MasterModuleProject);

    var _this = _possibleConstructorReturn(this, (MasterModuleProject.__proto__ || Object.getPrototypeOf(MasterModuleProject)).call(this));

    _this.folder = folder; // String

    if (!_this.folder) {
      throw new Error('[master-module] MasterModuleProject cannot launch without a folder defined');
    }

    _this.proc = proc; // ProcessBase

    // Reloads that we've requested that have not finished yet
    _this._pendingReloads = [];

    // A queue of incoming module modifications that we've detected
    _this._modificationsQueue = [];

    // Since a lot of changes can happen at the same time, we want to avoid accidentally
    // triggering a whole bunch of reloads, hence this queue, which has an opportunity to combine them or just
    // handle sequential reloads a bit more gracefully.
    _this._modificationsInterval = setInterval(function () {
      var moduleMods = _this._modificationsQueue.splice(0);
      if (moduleMods.length < 1) return void 0;
      _this.maybeSendComponentReloadRequest(moduleMods[moduleMods.length - 1]);
    }, QUEUE_INTERVAL);
    return _this;
  }

  _createClass(MasterModuleProject, [{
    key: 'restart',
    value: function restart() {
      // Remove anything pending we have in the queues to avoid any mistaken
      // reloads that may still be pending in case the window was refreshed.
      this._modificationsQueue.splice(0);
      this._pendingReloads.splice(0);
    }
  }, {
    key: 'maybeSendComponentReloadRequest',
    value: function maybeSendComponentReloadRequest(file) {
      if (!this.proc.isOpen()) return void 0;

      // If the last time we read from the file system came after the last time we wrote to it,
      // that's a decent indication that the last known change occurred directly on the file system.
      var lastRead = file.get('dtLastReadStart');
      var lastWrite = file.get('dtLastWriteStart') + LAST_WRITE_MARGIN_OF_ERROR_MILLISECONDS;
      if (lastRead < lastWrite) return void 0;

      this.emit('triggering-reload', file);

      // This is currently only used to detect whether we are in the midst of reloading so
      // that the master undo/redo queue can be smarter about whether to activate or not.
      // TODO: This smartness has not been implemented yet, please implement!
      this._pendingReloads.push(file);

      this.proc.socket.send({
        type: 'broadcast',
        name: 'component:reload',
        relpath: file.get('relpath')
      });
    }
  }, {
    key: 'handleReloadComplete',
    value: function handleReloadComplete(message) {
      // We remove a pending reload only if the glass told us it completed a reload,
      // since that is the place it counts (and we only want to do this once per reload).
      if (message.from === 'glass') {
        this.emit('reload-complete', this._pendingReloads.shift());
      }
    }
  }, {
    key: 'handleModuleChange',
    value: function handleModuleChange(file) {
      this._modificationsQueue.push(file);
    }
  }]);

  return MasterModuleProject;
}(_events.EventEmitter);

exports.default = MasterModuleProject;
//# sourceMappingURL=MasterModuleProject.js.map