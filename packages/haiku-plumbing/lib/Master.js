'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _events = require('events');

var _haikuFsExtra = require('haiku-fs-extra');

var _haikuFsExtra2 = _interopRequireDefault(_haikuFsExtra);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _async = require('async');

var _async2 = _interopRequireDefault(_async);

var _lodash = require('lodash');

var _walkFiles = require('haiku-serialization/src/utils/walkFiles');

var _walkFiles2 = _interopRequireDefault(_walkFiles);

var _ActiveComponent = require('haiku-serialization/src/model/ActiveComponent');

var _ActiveComponent2 = _interopRequireDefault(_ActiveComponent);

var _LoggerInstance = require('haiku-serialization/src/utils/LoggerInstance');

var _LoggerInstance2 = _interopRequireDefault(_LoggerInstance);

var _ProcessBase = require('./ProcessBase');

var _ProcessBase2 = _interopRequireDefault(_ProcessBase);

var _Git = require('./Git');

var Git = _interopRequireWildcard(_Git);

var _ProjectConfiguration = require('./ProjectConfiguration');

var _ProjectConfiguration2 = _interopRequireDefault(_ProjectConfiguration);

var _Asset = require('./Asset');

var Asset = _interopRequireWildcard(_Asset);

var _Watcher = require('./Watcher');

var _Watcher2 = _interopRequireDefault(_Watcher);

var _Sketch = require('./Sketch');

var Sketch = _interopRequireWildcard(_Sketch);

var _ProjectFolder = require('./ProjectFolder');

var ProjectFolder = _interopRequireWildcard(_ProjectFolder);

var _MasterGitProject = require('./MasterGitProject');

var _MasterGitProject2 = _interopRequireDefault(_MasterGitProject);

var _MasterModuleProject = require('./MasterModuleProject');

var _MasterModuleProject2 = _interopRequireDefault(_MasterModuleProject);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var UNLOGGABLE_METHODS = {
  'masterHeartbeat': true
};

var METHODS_TO_RUN_IMMEDIATELY = {
  'startProject': true,
  'restartProject': true,
  'initializeFolder': true,
  'masterHeartbeat': true
};

var FORBIDDEN_METHODS = {
  logMethodMessage: true,
  handleMethodMessage: true,
  callMethodWithMessage: true,
  handleBroadcastMessage: true
};

var METHOD_QUEUE_INTERVAL = 64;
var SAVE_AWAIT_TIME = 64 * 2;

var WATCHABLE_EXTNAMES = {
  '.js': true,
  '.svg': true,
  '.sketch': true
};

var DESIGN_EXTNAMES = {
  '.sketch': true,
  '.svg': true
};

var UNWATCHABLE_RELPATHS = {
  'index.js': true,
  'haiku.js': true,
  'react-bare.js': true,
  'react.js': true
};

var UNWATCHABLE_BASENAMES = {
  'index.standalone.js': true,
  'index.embed.js': true,
  'dom-embed.js': true,
  'dom-standalone.js': true,
  'react-dom.js': true,
  '~.sketch': true // Ephemeral file generated by sketch during file writes
};

var DEFAULT_BRANCH_NAME = 'master';

function _isFileSignificant(relpath) {
  if (UNWATCHABLE_RELPATHS[relpath]) return false;
  if (UNWATCHABLE_BASENAMES[_path2.default.basename(relpath)]) return false;
  if (!WATCHABLE_EXTNAMES[_path2.default.extname(relpath)]) return false;
  return true;
}

function _excludeIfNotJs(relpath) {
  if (_path2.default.extname(relpath) !== '.js') return true;
  return !_isFileSignificant(relpath);
}

var Master = function (_EventEmitter) {
  _inherits(Master, _EventEmitter);

  function Master(folder) {
    _classCallCheck(this, Master);

    var _this = _possibleConstructorReturn(this, (Master.__proto__ || Object.getPrototypeOf(Master)).call(this));

    _this.folder = folder;

    if (!_this.folder) {
      throw new Error('[master] Master cannot launch without a folder defined');
    }

    // IPC hook to communicate with plumbing
    _this.proc = new _ProcessBase2.default('master'); // 'master' is not a branch name in this context

    _this.proc.socket.on('close', function () {
      _LoggerInstance2.default.info('[master] !!! socket closed');
      _this.teardown();
      _this.emit('host-disconnected');
    });

    _this.proc.socket.on('error', function (err) {
      _LoggerInstance2.default.info('[master] !!! socket error', err);
    });

    _this.proc.on('request', function (message, cb) {
      _this.handleMethodMessage(message, cb);
    });

    _this.proc.socket.on('broadcast', function (message) {
      _this.handleBroadcastMessage(message);
    });

    // Encapsulation of the user's configuration content (haiku.js) (not loaded yet)
    _this._config = new _ProjectConfiguration2.default();

    // Encapsulation of project actions that relate to git or cloud saving in some way
    _this._git = new _MasterGitProject2.default(_this.folder);

    _this._git.on('semver-bumped', function (tag, cb) {
      _this.handleSemverTagChange(tag, cb);
    });

    // Encapsulation of project actions that concern the live module in other views
    _this._mod = new _MasterModuleProject2.default(_this.folder, _this.proc);

    _this._mod.on('triggering-reload', function () {
      _LoggerInstance2.default.info('[master] module replacment triggering');
    });

    _this._mod.on('reload-complete', function () {
      _LoggerInstance2.default.info('[master] module replacment finished');
    });

    // To store a Watcher instance which will watch for changes on the file system
    _this._watcher = null;

    // Flag denotes whether we've fully initialized and are able to handle websocket methods
    _this._isReadyToReceiveMethods = false;

    // Queue of accumulated incoming methods we've received that we need to defer until ready
    _this._methodQueue = [];

    // Worker that handles processing any methods that have accumulated in our queue
    _this._methodQueueInterval = setInterval(function () {
      if (_this._isReadyToReceiveMethods) {
        var methods = _this._methodQueue.splice(0);
        methods.forEach(function (_ref) {
          var message = _ref.message,
              cb = _ref.cb;
          return _this.callMethodWithMessage(message, cb);
        });
        clearInterval(_this._methodQueueInterval);
      }
    }, METHOD_QUEUE_INTERVAL);

    // Dictionary of all designs in the project, mapping relpath to metadata object
    _this._knownDesigns = {};

    // Designs that have changed and need merge, batched for
    _this._designsPendingMerge = {};

    // Store an ActiveComponent instance for method delegation
    _this._component = null;

    // Saving takes a while and we use this flag to avoid overlapping saves
    _this._isSaving = false;

    // We end up oversaturating the sockets unless we debounce this
    _this.debouncedEmitAssetsChanged = (0, _lodash.debounce)(_this.emitAssetsChanged.bind(_this), 500, { trailing: true });
    _this.debouncedEmitDesignNeedsMergeRequest = (0, _lodash.debounce)(_this.emitDesignNeedsMergeRequest.bind(_this), 500, { trailing: true });
    return _this;
  }

  _createClass(Master, [{
    key: 'teardown',
    value: function teardown() {
      clearInterval(this._methodQueueInterval);
      clearInterval(this._mod._modificationsInterval);
      if (this._git) this._git.teardown();
      if (this._component) this._component._envoyClient.closeConnection();
      if (this._watcher) this._watcher.stop();
    }
  }, {
    key: 'logMethodMessage',
    value: function logMethodMessage(_ref2) {
      var method = _ref2.method,
          params = _ref2.params;

      if (!UNLOGGABLE_METHODS[method]) {
        _LoggerInstance2.default.info('[master]', 'calling', method, params);
      }
    }
  }, {
    key: 'handleMethodMessage',
    value: function handleMethodMessage(message, cb) {
      var method = message.method,
          params = message.params;
      // We stop using the queue once we're up and running; no point keeping the queue

      if (METHODS_TO_RUN_IMMEDIATELY[method] || this._isReadyToReceiveMethods) {
        return this.callMethodWithMessage({ method: method, params: params }, cb);
      } else {
        return this._methodQueue.push({ message: message, cb: cb });
      }
    }
  }, {
    key: 'callMethodWithMessage',
    value: function callMethodWithMessage(message, cb) {
      var method = message.method,
          params = message.params;

      if (typeof this[method] === 'function' && !FORBIDDEN_METHODS[method]) {
        this.logMethodMessage({ method: method, params: params });
        return this[method]({ method: method, params: params }, cb);
      } else {
        return cb(new Error('[master] No such method ' + method));
      }
    }
  }, {
    key: 'handleBroadcastMessage',
    value: function handleBroadcastMessage(message) {
      switch (message.name) {
        case 'component:reload:complete':
          this._mod.handleReloadComplete(message);
          break;
      }
    }
  }, {
    key: 'waitForSaveToComplete',
    value: function waitForSaveToComplete(cb) {
      var _this2 = this;

      if (this._isSaving) {
        return setTimeout(function () {
          return _this2.waitForSaveToComplete(cb);
        }, SAVE_AWAIT_TIME);
      } else {
        return cb();
      }
    }
  }, {
    key: 'emitAssetsChanged',
    value: function emitAssetsChanged(assets) {
      return this.proc.socket.send({
        type: 'broadcast',
        name: 'assets-changed',
        folder: this.folder,
        assets: assets
      });
    }
  }, {
    key: 'emitDesignNeedsMergeRequest',
    value: function emitDesignNeedsMergeRequest() {
      var designs = this._designsPendingMerge;
      this._designsPendingMerge = {};
      if (Object.keys(designs).length > 0) {
        _LoggerInstance2.default.info('[master] merge designs requested');
        this.proc.socket.request({ type: 'action', method: 'mergeDesigns', params: [this.folder, 'Default', 0, designs] }, function () {
          // TODO: Call rest after design merge finishes?
        });
      }
    }
  }, {
    key: 'batchDesignMergeRequest',
    value: function batchDesignMergeRequest(relpath, abspath) {
      this._designsPendingMerge[relpath] = abspath;
      return this;
    }
  }, {
    key: 'emitDesignChange',
    value: function emitDesignChange(relpath) {
      var assets = this.getAssetDirectoryInfo();
      var extname = _path2.default.extname(relpath);
      var abspath = _path2.default.join(this.folder, relpath);
      _LoggerInstance2.default.info('[master] asset changed', relpath);
      this.emit('design-change', relpath, assets);
      if (this.proc.isOpen()) {
        this.debouncedEmitAssetsChanged(assets);
        if (extname === '.svg') {
          this.batchDesignMergeRequest(relpath, abspath);
          this.debouncedEmitDesignNeedsMergeRequest();
        }
      }
    }

    // /**
    //  * watchers/handlers
    //  * =================
    //  */

  }, {
    key: 'handleFileChange',
    value: function handleFileChange(abspath) {
      var _this3 = this;

      var relpath = _path2.default.relative(this.folder, abspath);
      var extname = _path2.default.extname(relpath);

      if (extname === '.sketch' || extname === '.svg') {
        this._knownDesigns[relpath] = { relpath: relpath, abspath: abspath, dtModified: Date.now() };
        this.emitDesignChange(relpath);
      }

      return this.waitForSaveToComplete(function () {
        return _this3._git.commitFileIfChanged(relpath, 'Changed ' + relpath, function () {
          if (!_isFileSignificant(relpath)) {
            return void 0;
          }

          if (extname === '.sketch') {
            _LoggerInstance2.default.info('[master] sketchtool pipeline running; please wait');
            Sketch.sketchtoolPipeline(abspath);
            _LoggerInstance2.default.info('[master] sketchtool done');
            return void 0;
          }

          if (extname === '.js') {
            return _this3._component.FileModel.ingestOne(_this3.folder, relpath, function (err, file) {
              if (err) return _LoggerInstance2.default.info(err);
              _LoggerInstance2.default.info('[master] file ingested:', abspath);
              if (relpath === _this3._component.fetchActiveBytecodeFile().get('relpath')) {
                file.set('substructInitialized', file.reinitializeSubstruct(_this3._config.get('config'), 'Master.handleFileChange'));
                if (file.get('previous') !== file.get('contents')) {
                  _this3._mod.handleModuleChange(file);
                }
              }
            });
          }
        });
      });
    }
  }, {
    key: 'handleFileAdd',
    value: function handleFileAdd(abspath) {
      var _this4 = this;

      var relpath = _path2.default.relative(this.folder, abspath);
      var extname = _path2.default.extname(relpath);

      if (extname === '.sketch' || extname === '.svg') {
        this._knownDesigns[relpath] = { relpath: relpath, abspath: abspath, dtModified: Date.now() };
        this.emitDesignChange(relpath);
      }

      return this.waitForSaveToComplete(function () {
        return _this4._git.commitFileIfChanged(relpath, 'Added ' + relpath, function () {
          if (!_isFileSignificant(relpath)) {
            return void 0;
          }

          if (extname === '.sketch') {
            _LoggerInstance2.default.info('[master] sketchtool pipeline running; please wait');
            Sketch.sketchtoolPipeline(abspath);
            _LoggerInstance2.default.info('[master] sketchtool done');
            return void 0;
          }

          if (extname === '.js') {
            return _this4._component.FileModel.ingestOne(_this4.folder, relpath, function (err, file) {
              if (err) return _LoggerInstance2.default.info(err);
              _LoggerInstance2.default.info('[master] file ingested:', abspath);
              if (relpath === _this4._component.fetchActiveBytecodeFile().get('relpath')) {
                file.set('substructInitialized', file.reinitializeSubstruct(_this4._config.get('config'), 'Master.handleFileAdd'));
              }
            });
          }
        });
      });
    }
  }, {
    key: 'handleFileRemove',
    value: function handleFileRemove(abspath) {
      var _this5 = this;

      var relpath = _path2.default.relative(this.folder, abspath);
      var extname = _path2.default.extname(relpath);

      if (extname === '.sketch' || extname === '.svg') {
        delete this._knownDesigns[relpath];
        this.emitDesignChange(relpath);
      }

      return this.waitForSaveToComplete(function () {
        return _this5._git.commitFileIfChanged(relpath, 'Removed ' + relpath, function () {
          if (!_isFileSignificant(relpath)) {
            return void 0;
          }

          if (extname === '.js') {
            return _this5._component.FileModel.expelOne(relpath, function (err) {
              if (err) return _LoggerInstance2.default.info(err);
              _LoggerInstance2.default.info('[master] file expelled:', abspath);
            });
          }
        });
      });
    }
  }, {
    key: 'handleSemverTagChange',
    value: function handleSemverTagChange(tag, cb) {
      var file = this._component.fetchActiveBytecodeFile();
      return file.writeMetadata({ version: tag }, function (err) {
        if (err) return cb(err);
        _LoggerInstance2.default.info('[master-git] bumped bytecode semver to ' + tag);
        return cb(null, tag);
      });
    }

    // /**
    //  * methods
    //  * =======
    //  */

  }, {
    key: 'masterHeartbeat',
    value: function masterHeartbeat(_ref3, cb) {
      var params = _ref3.params;

      return cb(null, {
        folder: this.folder,
        isReady: this._isReadyToReceiveMethods,
        isSaving: this._isSaving,
        websocketReadyState: this.proc.getReadyState(),
        isCommitting: this._git.hasAnyPendingCommits(),
        gitUndoables: this._git.getGitUndoablesUptoBase(),
        gitRedoables: this._git.getGitRedoablesUptoBase()
      });
    }
  }, {
    key: 'doesProjectHaveUnsavedChanges',
    value: function doesProjectHaveUnsavedChanges(message, cb) {
      return Git.status(this.folder, {}, function (statusErr, statusesDict) {
        if (statusErr) return cb(statusErr);
        if (Object.keys(statusesDict).length < 1) return cb(null, false);
        return cb(null, true);
      });
    }
  }, {
    key: 'discardProjectChanges',
    value: function discardProjectChanges(message, done) {
      var _this6 = this;

      return Git.hardReset(this.folder, 'HEAD', function (err) {
        if (err) return done(err);
        return Git.removeUntrackedFiles(_this6.folder, function (err) {
          if (err) return done(err);
          return done();
        });
      });
    }
  }, {
    key: 'fetchProjectInfo',
    value: function fetchProjectInfo(_ref4, cb) {
      var _this7 = this;

      var _ref4$params = _slicedToArray(_ref4.params, 4),
          projectName = _ref4$params[0],
          haikuUsername = _ref4$params[1],
          haikuPassword = _ref4$params[2],
          _ref4$params$ = _ref4$params[3],
          fetchOptions = _ref4$params$ === undefined ? {} : _ref4$params$;

      return this._git.fetchFolderState('fetch-info', fetchOptions, function (err) {
        if (err) return cb(err);
        return _this7._git.getCurrentShareInfo(2000, cb);
      });
    }
  }, {
    key: 'gitUndo',
    value: function gitUndo(_ref5, cb) {
      var _ref5$params = _slicedToArray(_ref5.params, 1),
          undoOptions = _ref5$params[0];

      // Doing an undo while we're saving probably puts us into a bad state
      if (this._isSaving) {
        _LoggerInstance2.default.info('[master] cannot undo while saving');
        return cb();
      }
      _LoggerInstance2.default.info('[master] pushing undo request onto queue');
      return this._git.undo(undoOptions, cb);
    }
  }, {
    key: 'gitRedo',
    value: function gitRedo(_ref6, cb) {
      var _ref6$params = _slicedToArray(_ref6.params, 1),
          redoOptions = _ref6$params[0];

      // Doing an redo while we're saving probably puts us into a bad state
      if (this._isSaving) {
        _LoggerInstance2.default.info('[master] cannot redo while saving');
        return cb();
      }
      _LoggerInstance2.default.info('[master] pushing redo request onto queue');
      return this._git.redo(redoOptions, cb);
    }
  }, {
    key: 'loadAssets',
    value: function loadAssets(done) {
      var _this8 = this;

      return (0, _walkFiles2.default)(this.folder, function (err, entries) {
        if (err) return done(err);
        entries.forEach(function (entry) {
          var extname = _path2.default.extname(entry.path);
          if (DESIGN_EXTNAMES[extname]) {
            var relpath = _path2.default.normalize(_path2.default.relative(_this8.folder, entry.path));
            _this8._knownDesigns[relpath] = { relpath: relpath, abspath: entry.path, dtModified: Date.now() };
          }
        });
        return _this8.getAssets(done);
      });
    }
  }, {
    key: 'getAssets',
    value: function getAssets(done) {
      return done(null, this.getAssetDirectoryInfo());
    }
  }, {
    key: 'getAssetDirectoryInfo',
    value: function getAssetDirectoryInfo() {
      var info = Asset.assetsToDirectoryStructure(this._knownDesigns);

      var _ProjectFolder$getPro = ProjectFolder.getProjectNameVariations(this.folder),
          primaryAssetPath = _ProjectFolder$getPro.primaryAssetPath;

      info.forEach(function (asset) {
        if (asset.relpath && _path2.default.normalize(asset.relpath) === primaryAssetPath) {
          asset.isPrimaryDesign = true;
        }
      });
      return info;
    }
  }, {
    key: 'fetchAssets',
    value: function fetchAssets(message, done) {
      if (Object.keys(this._knownDesigns).length > 0) {
        return this.getAssets(done);
      } else {
        return this.loadAssets(done);
      }
    }
  }, {
    key: 'linkAsset',
    value: function linkAsset(_ref7, done) {
      var _this9 = this;

      var _ref7$params = _slicedToArray(_ref7.params, 1),
          abspath = _ref7$params[0];

      var basename = _path2.default.basename(abspath);
      var relpath = _path2.default.join('designs', basename);
      var destination = _path2.default.join(this.folder, relpath);
      return _haikuFsExtra2.default.copy(abspath, destination, function (copyErr) {
        if (copyErr) return done(copyErr);
        _this9._knownDesigns[relpath] = { relpath: relpath, abspath: destination, dtModified: Date.now() };
        return done(null, _this9.getAssetDirectoryInfo());
      });
    }
  }, {
    key: 'unlinkAsset',
    value: function unlinkAsset(_ref8, done) {
      var _this10 = this;

      var _ref8$params = _slicedToArray(_ref8.params, 1),
          relpath = _ref8$params[0];

      if (!relpath || relpath.length < 2) return done(new Error('Relative path too short'));
      var abspath = _path2.default.join(this.folder, relpath);
      return _haikuFsExtra2.default.remove(abspath, function (removeErr) {
        if (removeErr) return done(removeErr);
        delete _this10._knownDesigns[relpath];
        return done(null, _this10.getAssetDirectoryInfo());
      });
    }
  }, {
    key: 'selectElement',
    value: function selectElement(message, cb) {
      // this is a no-op in master
      return cb();
    }
  }, {
    key: 'unselectElement',
    value: function unselectElement(message, cb) {
      // this is a no-op in master
      return cb();
    }
  }, {
    key: 'setTimelineName',
    value: function setTimelineName(_ref9, cb) {
      var params = _ref9.params;

      this._component.setTimelineName.apply(this._component, params);
      return cb();
    }
  }, {
    key: 'setTimelineTime',
    value: function setTimelineTime(_ref10, cb) {
      var params = _ref10.params;

      this._component.setTimelineTime.apply(this._component, params);
      return cb();
    }
  }, {
    key: 'readMetadata',
    value: function readMetadata(_ref11, cb) {
      var params = _ref11.params;

      return this._component.readMetadata.apply(this._component, params.concat(cb));
    }
  }, {
    key: 'readAllStateValues',
    value: function readAllStateValues(_ref12, cb) {
      var params = _ref12.params;

      return this._component.readAllStateValues.apply(this._component, params.concat(cb));
    }
  }, {
    key: 'readAllEventHandlers',
    value: function readAllEventHandlers(_ref13, cb) {
      var params = _ref13.params;

      return this._component.readAllEventHandlers.apply(this._component, params.concat(cb));
    }
  }, {
    key: 'setInteractionMode',
    value: function setInteractionMode(message, cb) {
      // this is a no-op in master
      return cb();
    }
  }, {
    key: 'previewProject',
    value: function previewProject(_ref14, cb) {
      var _ref14$params = _slicedToArray(_ref14.params, 2),
          projectName = _ref14$params[0],
          _ref14$params$ = _ref14$params[1],
          previewOptions = _ref14$params$ === undefined ? {} : _ref14$params$;

      // TODO: Create preview.html and launch in the user's browser
      return cb(new Error('[master] Method not yet implemented'));
    }

    /**
     * bytecode actions
     * ================
     */

  }, {
    key: 'bytecodeAction',
    value: function bytecodeAction(action, params, cb) {
      if (!this._component) return cb(new Error('[master] Component not initialized'));
      var file = this._component.fetchActiveBytecodeFile();
      if (!file) return cb(new Error('[master] File not initialized'));
      return file[action].apply(file, params.concat(cb));
    }
  }, {
    key: 'instantiateComponent',
    value: function instantiateComponent(_ref15, cb) {
      var params = _ref15.params;

      return this.bytecodeAction('instantiateComponent', params, cb);
    }
  }, {
    key: 'deleteComponent',
    value: function deleteComponent(_ref16, cb) {
      var params = _ref16.params;

      return this.bytecodeAction('deleteComponent', params, cb);
    }
  }, {
    key: 'mergeDesigns',
    value: function mergeDesigns(_ref17, cb) {
      var params = _ref17.params;

      return this.bytecodeAction('mergeDesigns', params, cb);
    }
  }, {
    key: 'applyPropertyValue',
    value: function applyPropertyValue(_ref18, cb) {
      var params = _ref18.params;

      return this.bytecodeAction('applyPropertyValue', params, cb);
    }
  }, {
    key: 'applyPropertyDelta',
    value: function applyPropertyDelta(_ref19, cb) {
      var params = _ref19.params;

      return this.bytecodeAction('applyPropertyDelta', params, cb);
    }
  }, {
    key: 'applyPropertyGroupValue',
    value: function applyPropertyGroupValue(_ref20, cb) {
      var params = _ref20.params;

      return this.bytecodeAction('applyPropertyGroupValue', params, cb);
    }
  }, {
    key: 'applyPropertyGroupDelta',
    value: function applyPropertyGroupDelta(_ref21, cb) {
      var params = _ref21.params;

      return this.bytecodeAction('applyPropertyGroupDelta', params, cb);
    }
  }, {
    key: 'resizeContext',
    value: function resizeContext(_ref22, cb) {
      var params = _ref22.params;

      return this.bytecodeAction('resizeContext', params, cb);
    }
  }, {
    key: 'changeKeyframeValue',
    value: function changeKeyframeValue(_ref23, cb) {
      var params = _ref23.params;

      return this.bytecodeAction('changeKeyframeValue', params, cb);
    }
  }, {
    key: 'changePlaybackSpeed',
    value: function changePlaybackSpeed(_ref24, cb) {
      var params = _ref24.params;

      return this.bytecodeAction('changePlaybackSpeed', params, cb);
    }
  }, {
    key: 'changeSegmentCurve',
    value: function changeSegmentCurve(_ref25, cb) {
      var params = _ref25.params;

      return this.bytecodeAction('changeSegmentCurve', params, cb);
    }
  }, {
    key: 'changeSegmentEndpoints',
    value: function changeSegmentEndpoints(_ref26, cb) {
      var params = _ref26.params;

      return this.bytecodeAction('changeSegmentEndpoints', params, cb);
    }
  }, {
    key: 'createKeyframe',
    value: function createKeyframe(_ref27, cb) {
      var params = _ref27.params;

      return this.bytecodeAction('createKeyframe', params, cb);
    }
  }, {
    key: 'createTimeline',
    value: function createTimeline(_ref28, cb) {
      var params = _ref28.params;

      return this.bytecodeAction('createTimeline', params, cb);
    }
  }, {
    key: 'deleteKeyframe',
    value: function deleteKeyframe(_ref29, cb) {
      var params = _ref29.params;

      return this.bytecodeAction('deleteKeyframe', params, cb);
    }
  }, {
    key: 'deleteTimeline',
    value: function deleteTimeline(_ref30, cb) {
      var params = _ref30.params;

      return this.bytecodeAction('deleteTimeline', params, cb);
    }
  }, {
    key: 'duplicateTimeline',
    value: function duplicateTimeline(_ref31, cb) {
      var params = _ref31.params;

      return this.bytecodeAction('duplicateTimeline', params, cb);
    }
  }, {
    key: 'joinKeyframes',
    value: function joinKeyframes(_ref32, cb) {
      var params = _ref32.params;

      return this.bytecodeAction('joinKeyframes', params, cb);
    }
  }, {
    key: 'moveSegmentEndpoints',
    value: function moveSegmentEndpoints(_ref33, cb) {
      var params = _ref33.params;

      return this.bytecodeAction('moveSegmentEndpoints', params, cb);
    }
  }, {
    key: 'moveKeyframes',
    value: function moveKeyframes(_ref34, cb) {
      var params = _ref34.params;

      return this.bytecodeAction('moveKeyframes', params, cb);
    }
  }, {
    key: 'renameTimeline',
    value: function renameTimeline(_ref35, cb) {
      var params = _ref35.params;

      return this.bytecodeAction('renameTimeline', params, cb);
    }
  }, {
    key: 'sliceSegment',
    value: function sliceSegment(_ref36, cb) {
      var params = _ref36.params;

      return this.bytecodeAction('sliceSegment', params, cb);
    }
  }, {
    key: 'splitSegment',
    value: function splitSegment(_ref37, cb) {
      var params = _ref37.params;

      return this.bytecodeAction('splitSegment', params, cb);
    }
  }, {
    key: 'zMoveToFront',
    value: function zMoveToFront(_ref38, cb) {
      var params = _ref38.params;

      return this.bytecodeAction('zMoveToFront', params, cb);
    }
  }, {
    key: 'zMoveForward',
    value: function zMoveForward(_ref39, cb) {
      var params = _ref39.params;

      return this.bytecodeAction('zMoveForward', params, cb);
    }
  }, {
    key: 'zMoveBackward',
    value: function zMoveBackward(_ref40, cb) {
      var params = _ref40.params;

      return this.bytecodeAction('zMoveBackward', params, cb);
    }
  }, {
    key: 'zMoveToBack',
    value: function zMoveToBack(_ref41, cb) {
      var params = _ref41.params;

      return this.bytecodeAction('zMoveToBack', params, cb);
    }
  }, {
    key: 'reorderElement',
    value: function reorderElement(_ref42, cb) {
      var params = _ref42.params;

      return this.bytecodeAction('reorderElement', params, cb);
    }
  }, {
    key: 'groupElements',
    value: function groupElements(_ref43, cb) {
      var params = _ref43.params;

      return this.bytecodeAction('groupElements', params, cb);
    }
  }, {
    key: 'ungroupElements',
    value: function ungroupElements(_ref44, cb) {
      var params = _ref44.params;

      return this.bytecodeAction('ungroupElements', params, cb);
    }
  }, {
    key: 'hideElements',
    value: function hideElements(_ref45, cb) {
      var params = _ref45.params;

      return this.bytecodeAction('hideElements', params, cb);
    }
  }, {
    key: 'pasteThing',
    value: function pasteThing(_ref46, cb) {
      var params = _ref46.params;

      return this.bytecodeAction('pasteThing', params, cb);
    }
  }, {
    key: 'deleteThing',
    value: function deleteThing(_ref47, cb) {
      var params = _ref47.params;

      return this.bytecodeAction('deleteThing', params, cb);
    }
  }, {
    key: 'upsertStateValue',
    value: function upsertStateValue(_ref48, cb) {
      var params = _ref48.params;

      return this.bytecodeAction('upsertStateValue', params, cb);
    }
  }, {
    key: 'deleteStateValue',
    value: function deleteStateValue(_ref49, cb) {
      var params = _ref49.params;

      return this.bytecodeAction('deleteStateValue', params, cb);
    }
  }, {
    key: 'upsertEventHandler',
    value: function upsertEventHandler(_ref50, cb) {
      var params = _ref50.params;

      return this.bytecodeAction('upsertEventHandler', params, cb);
    }
  }, {
    key: 'deleteEventHandler',
    value: function deleteEventHandler(_ref51, cb) {
      var params = _ref51.params;

      return this.bytecodeAction('deleteEventHandler', params, cb);
    }
  }, {
    key: 'writeMetadata',
    value: function writeMetadata(_ref52, cb) {
      var params = _ref52.params;

      return this.bytecodeAction('writeMetadata', params, cb);
    }

    /**
     * here be dragons
     * ===============
     */

    /**
     * @method initializeFolder
     */

  }, {
    key: 'initializeFolder',
    value: function initializeFolder(_ref53, done) {
      var _this11 = this;

      var _ref53$params = _slicedToArray(_ref53.params, 4),
          projectName = _ref53$params[0],
          haikuUsername = _ref53$params[1],
          haikuPassword = _ref53$params[2],
          projectOptions = _ref53$params[3];

      // We need to clear off undos in the case that somebody made an fs-based commit between sessions;
      // if we tried to reset to a previous "known" undoable, we'd miss the missing intermediate one.
      // This has to happen in initializeFolder because it's here that we set the 'isBase' undoable.
      this._git.restart({
        projectName: projectName,
        haikuUsername: haikuUsername,
        haikuPassword: haikuPassword,
        branchName: DEFAULT_BRANCH_NAME
      });

      // Note: 'ensureProjectFolder' and/or 'buildProjectContent' should already have ran by this point.
      return _async2.default.series([function (cb) {
        return _this11._git.initializeProject(projectOptions, cb);
      },

      // Now that we've (maybe) cloned content, we need to create any other necessary files that _might not_ yet
      // exist in the folder. You may note that we run this method _before_ this process, and ask yourself: why twice?
      // Well, don't be fooled. Both methods are necessary due to the way git pulling is handled: if a project has
      // never had remote content pulled, but has changes, we move those changes away them copy them back in on top of
      // the cloned content. Which means we have to be sparing with what we create on the first run, but also need
      // to create any missing remainders on the second run.
      function (cb) {
        return ProjectFolder.buildProjectContent(null, _this11.folder, projectName, 'haiku', {
          organizationName: projectOptions.organizationName, // Important: Must set this here or the package.name will be wrong
          skipContentCreation: false,
          skipCDNBundles: true
        }, cb);
      }, function (cb) {
        return _this11._git.commitProjectIfChanged('Initialized folder', cb);
      },

      // Make sure we are starting with a good git history
      function (cb) {
        return _this11._git.setUndoBaselineIfHeadCommitExists(cb);
      }], function (err, results) {
        if (err) return done(err);
        return done(null, results[results.length - 1]);
      });
    }

    /**
     * @method restartProject
     * Just a vanity method used to distinguish starts from restarts.
     * Should be exactly the same as startProject since this only occurs
     * If the MasterProcess has crashed and we need to reboot it.
     */

  }, {
    key: 'restartProject',
    value: function restartProject(message, done) {
      message.restart = true;
      return this.startProject(message, done);
    }

    /**
     * @method startProject
     */

  }, {
    key: 'startProject',
    value: function startProject(message, done) {
      var _this12 = this;

      var loggingPrefix = message.restart ? 'restart project' : 'start project';

      _LoggerInstance2.default.info('[master] ' + loggingPrefix + ': ' + this.folder);

      this._mod.restart();
      this._git.restart();

      var response = {
        projectName: null
      };

      return _async2.default.series([
      // Load the user's configuration defined in haiku.js (sort of LEGACY)
      function (cb) {
        _LoggerInstance2.default.info('[master] ' + loggingPrefix + ': loading configuration for ' + _this12.folder);
        return _this12._config.load(_this12.folder, function (err) {
          if (err) return done(err);
          // Gotta make this available after we load the config, but before anything else, since the
          // done callback happens immediately if we've already initialized this master process once.
          response.projectName = _this12._config.get('config.name');
          return cb();
        });
      },

      // Initialize the ActiveComponent and file models
      function (cb) {
        // No need to reinitialize if already in memory
        if (!_this12._component) {
          _LoggerInstance2.default.info('[master] ' + loggingPrefix + ': creating active component');

          _this12._component = new _ActiveComponent2.default({
            alias: 'master', // Don't be fooled, this is not a branch name
            folder: _this12.folder,
            userconfig: _this12._config.get('config'),
            websocket: {/* websocket */},
            platform: {/* window */},
            envoy: _ProcessBase2.default.HAIKU.envoy || {
              host: process.env.ENVOY_HOST,
              port: process.env.ENVOY_PORT
            },
            file: {
              doShallowWorkOnly: false, // Must override the in-memory-only defaults
              skipDiffLogging: false // Must override the in-memory-only defaults
            }
          });

          // This is required so that a hostInstance is loaded which is (required for calculations)
          _this12._component.mountApplication();

          _this12._component.on('component:mounted', function () {
            // Since we aren't running in the DOM cancel the raf to avoid leaked handles
            _this12._component._componentInstance._context.clock.GLOBAL_ANIMATION_HARNESS.cancel();
            return cb();
          });
        } else {
          return cb();
        }
      },

      // Take an initial commit of the starting state so we have a baseline
      function (cb) {
        return _this12._git.commitProjectIfChanged('Project setup', cb);
      },

      // Load all relevant files into memory (only JavaScript files for now)
      function (cb) {
        _LoggerInstance2.default.info('[master] ' + loggingPrefix + ': ingesting js files in ' + _this12.folder);
        return _this12._component.FileModel.ingestFromFolder(_this12.folder, {
          exclude: _excludeIfNotJs
        }, cb);
      },

      // Do any setup necessary on the in-memory bytecode object
      function (cb) {
        var file = _this12._component.fetchActiveBytecodeFile();
        if (file) {
          _LoggerInstance2.default.info('[master] ' + loggingPrefix + ': initializing bytecode');
          file.set('substructInitialized', file.reinitializeSubstruct(_this12._config.get('config'), 'Master.startProject'));
          return file.performComponentWork(function (bytecode, mana, wrapup) {
            return wrapup();
          }, cb);
        } else {
          return cb();
        }
      },

      // Take an initial commit of the starting state so we have a baseline
      function (cb) {
        return _this12._git.commitProjectIfChanged('Code setup', cb);
      },

      // Start watching the file system for changes
      function (cb) {
        // No need to reinitialize if already in memory
        if (!_this12._watcher) {
          _LoggerInstance2.default.info('[master] ' + loggingPrefix + ': initializing file watcher', _this12.folder);
          _this12._watcher = new _Watcher2.default();
          _this12._watcher.watch(_this12.folder);
          _this12._watcher.on('change', _this12.handleFileChange.bind(_this12));
          _this12._watcher.on('add', _this12.handleFileAdd.bind(_this12));
          _this12._watcher.on('remove', _this12.handleFileRemove.bind(_this12));
          _LoggerInstance2.default.info('[master] ' + loggingPrefix + ': file watcher is now watching', _this12.folder);
          return cb();
        } else {
          return cb();
        }
      },

      // Make sure we are starting with a good git history
      function (cb) {
        return _this12._git.setUndoBaselineIfHeadCommitExists(cb);
      },

      // Finish up and signal that we are ready
      function (cb) {
        _this12._isReadyToReceiveMethods = true;
        _LoggerInstance2.default.info('[master] ' + loggingPrefix + ': ready');
        return cb(null, response);
      }], function (err, results) {
        if (err) return done(err);
        return done(null, results[results.length - 1]);
      });
    }

    /**
     * @method saveProject
     */

  }, {
    key: 'saveProject',
    value: function saveProject(_ref54, done) {
      var _this13 = this;

      var _ref54$params = _slicedToArray(_ref54.params, 4),
          projectName = _ref54$params[0],
          haikuUsername = _ref54$params[1],
          haikuPassword = _ref54$params[2],
          _ref54$params$ = _ref54$params[3],
          saveOptions = _ref54$params$ === undefined ? {} : _ref54$params$;

      var finish = function finish(err, out) {
        _this13._isSaving = false;
        return done(err, out);
      };

      if (this._isSaving) {
        _LoggerInstance2.default.info('[master] project save: already in progress! short circuiting');
        return done();
      }

      this._isSaving = true;

      _LoggerInstance2.default.info('[master] project save');

      return _async2.default.series([
      // Check to see if a save is even necessary, and return early if not
      function (cb) {
        return _this13._git.getExistingShareDataIfSaveIsUnnecessary(function (err, existingShareData) {
          if (err) return cb(err);
          if (existingShareData) {
            // Presence of share data means early return
            return cb(true, existingShareData); // eslint-disable-line
          }
          return cb(); // Falsy share data means perform the save
        });
      },

      // Populate the bytecode's metadata. This may be a no-op if the file has already been saved
      function (cb) {
        _LoggerInstance2.default.info('[master] project save: assigning metadata');

        var _git$getFolderState = _this13._git.getFolderState(),
            semverVersion = _git$getFolderState.semverVersion,
            organizationName = _git$getFolderState.organizationName,
            projectName = _git$getFolderState.projectName,
            branchName = _git$getFolderState.branchName;

        var bytecodeMetadata = {
          uuid: 'HAIKU_SHARE_UUID',
          player: _this13._git.getHaikuPlayerLibVersion(),
          version: semverVersion,
          organization: organizationName,
          project: projectName,
          branch: branchName
        };

        return _this13._component.fetchActiveBytecodeFile().writeMetadata(bytecodeMetadata, cb);
      }, function (cb) {
        return _this13._git.commitProjectIfChanged('Updated metadata', cb);
      },

      // Build the rest of the content of the folder, including any bundles that belong on the cdn
      function (cb) {
        _LoggerInstance2.default.info('[master] project save: populating content');

        var _git$getFolderState2 = _this13._git.getFolderState(),
            projectName = _git$getFolderState2.projectName;

        return ProjectFolder.buildProjectContent(null, _this13.folder, projectName, 'haiku', {
          projectName: projectName,
          haikuUsername: haikuUsername,
          authorName: saveOptions.authorName,
          organizationName: saveOptions.organizationName
        }, cb);
      }, function (cb) {
        return _this13._git.commitProjectIfChanged('Populated content', cb);
      },

      // Now do all of the git/share/publish/fs operations required for the real save
      function (cb) {
        _LoggerInstance2.default.info('[master] project save: committing, pushing, publishing');
        return _this13._git.saveProject(saveOptions, cb);
      }], function (err, results) {
        // async gives back _all_ results from each step
        if (err && err !== true) return finish(err);
        return finish(null, results[results.length - 1]);
      });
    }
  }]);

  return Master;
}(_events.EventEmitter);

exports.default = Master;
//# sourceMappingURL=Master.js.map