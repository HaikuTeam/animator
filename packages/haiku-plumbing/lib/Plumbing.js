'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _async = require('async');

var _async2 = _interopRequireDefault(_async);

var _haikuFsExtra = require('haiku-fs-extra');

var _haikuFsExtra2 = _interopRequireDefault(_haikuFsExtra);

var _lodash = require('lodash.find');

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = require('lodash.merge');

var _lodash4 = _interopRequireDefault(_lodash3);

var _lodash5 = require('lodash.filter');

var _lodash6 = _interopRequireDefault(_lodash5);

var _net = require('net');

var _net2 = _interopRequireDefault(_net);

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

var _qs = require('qs');

var _qs2 = _interopRequireDefault(_qs);

var _ws = require('ws');

var _ws2 = _interopRequireDefault(_ws);

var _events = require('events');

var _server = require('haiku-sdk-creator/lib/envoy/server');

var _server2 = _interopRequireDefault(_server);

var _logger = require('haiku-sdk-creator/lib/envoy/logger');

var _logger2 = _interopRequireDefault(_logger);

var _exporter = require('haiku-sdk-creator/lib/exporter');

var _glass = require('haiku-sdk-creator/lib/glass');

var _timeline = require('haiku-sdk-creator/lib/timeline');

var _timeline2 = _interopRequireDefault(_timeline);

var _tour = require('haiku-sdk-creator/lib/tour');

var _tour2 = _interopRequireDefault(_tour);

var _haikuSdkInkstone = require('haiku-sdk-inkstone');

var _haikuSdkClient = require('haiku-sdk-client');

var _haikuStateObject = require('haiku-state-object');

var _haikuStateObject2 = _interopRequireDefault(_haikuStateObject);

var _serializeError = require('haiku-serialization/src/utils/serializeError');

var _serializeError2 = _interopRequireDefault(_serializeError);

var _LoggerInstance = require('haiku-serialization/src/utils/LoggerInstance');

var _LoggerInstance2 = _interopRequireDefault(_LoggerInstance);

var _Mixpanel = require('haiku-serialization/src/utils/Mixpanel');

var _Mixpanel2 = _interopRequireDefault(_Mixpanel);

var _ProjectFolder = require('./ProjectFolder');

var ProjectFolder = _interopRequireWildcard(_ProjectFolder);

var _getNormalizedComponentModulePath = require('haiku-serialization/src/model/helpers/getNormalizedComponentModulePath');

var _getNormalizedComponentModulePath2 = _interopRequireDefault(_getNormalizedComponentModulePath);

var _carbonite = require('haiku-serialization/src/utils/carbonite');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var NOTIFIABLE_ENVS = {
  production: true,
  staging: true
  // development: true
};

var Raven = void 0;
if (NOTIFIABLE_ENVS[process.env.HAIKU_RELEASE_ENVIRONMENT]) {
  Raven = require('./Raven');
}

// For any methods that are...
// - noisy
// - internal use only
// - housekeeping
// we'll skip Sentry for now.
var METHODS_TO_SKIP_IN_SENTRY = {
  setTimelineTime: true,
  doesProjectHaveUnsavedChanges: true,
  masterHeartbeat: true,
  applyPropertyGroupDelta: true,
  applyPropertyGroupValue: true,
  moveSegmentEndpoints: true,
  moveKeyframes: true,
  toggleDevTools: true,
  fetchProjectInfo: true
};

var IGNORED_METHOD_MESSAGES = {
  setTimelineTime: true,
  doesProjectHaveUnsavedChanges: true,
  masterHeartbeat: true
  // These are noisy, maybe not worth including?
  // applyPropertyGroupDelta: true,
  // applyPropertyGroupValue: true,
  // moveSegmentEndpoints: true,
  // moveKeyframes: true


  // See note under 'processMethodMessage' for the purpose of this
};var METHOD_MESSAGES_TO_HANDLE_IMMEDIATELY = {
  setTimelineTime: true,
  doesProjectHaveUnsavedChanges: true,
  masterHeartbeat: true,
  toggleDevTools: true,
  openTextEditor: true,
  openTerminal: true,
  saveProject: true,
  previewProject: true,
  fetchProjectInfo: true
};

var ROOT_DIR = _path2.default.join(__dirname, '..');
var PROC_DIR = _path2.default.join(__dirname);

var PROCS = {
  master: { name: 'master', path: _path2.default.join(PROC_DIR, 'MasterProcess.js') },
  creator: { name: 'creator', path: require('electron'), args: [_path2.default.join(ROOT_DIR, 'node_modules', 'haiku-creator-electron', 'lib', 'electron.js')], opts: { electron: true, spawn: true } }
};

var Q_GLASS = { alias: 'glass' };
var Q_MASTER = { alias: 'master' };
var Q_TIMELINE = { alias: 'timeline' };
var Q_CREATOR = { alias: 'creator' };

var AWAIT_INTERVAL = 100;
var WAIT_DELAY = 10 * 1000;
var MAX_MASTER_RESTART_ATTEMPTS = 3;

// In normal conditions CodeCommit can take up to 10 seconds to initialize a new repository,
// and unfortunately there's no callback to detect when it's finished. So when a project is
// first created, we add this artificial delay to make it more likely that the first clone
// attempt made (during project initialization) goes through without requiring re-attempt.
var CODE_COMMIT_RACE_CONDITION_DELAY = 10000;

var HAIKU_DEFAULTS = {
  socket: {
    port: process.env.HAIKU_CONTROL_PORT,
    host: process.env.HAIKU_CONTROL_HOST || '0.0.0.0'
  }

  // configure inkstone, useful for testing off of dev (HAIKU_API=https://localhost:8080/)
};if (process.env.HAIKU_API) {
  _haikuSdkInkstone.inkstone.setConfig({
    baseUrl: process.env.HAIKU_API
  });
}

var emitter = new _events.EventEmitter();

var PINFO = process.pid + ' ' + _path2.default.basename(__filename) + ' ' + _path2.default.basename(process.execPath);

var idIncrementor = 1;
function _id() {
  return idIncrementor++;
}

var PLUMBING_INSTANCES = [];

// In test environment these listeners may get wrapped so we begin listening
// to them immediately in the hope that we can start listening before the
// test wrapper steps in and interferes
process.on('exit', function () {
  _LoggerInstance2.default.info('[plumbing] plumbing process (' + PINFO + ') exiting');
  PLUMBING_INSTANCES.forEach(function (plumbing) {
    return plumbing.teardown();
  });
});
process.on('SIGINT', function () {
  _LoggerInstance2.default.info('[plumbing] plumbing process (' + PINFO + ') SIGINT');
  PLUMBING_INSTANCES.forEach(function (plumbing) {
    return plumbing.teardown();
  });
  process.exit();
});
process.on('SIGTERM', function () {
  _LoggerInstance2.default.info('[plumbing] plumbing process (' + PINFO + ') SIGTERM');
  PLUMBING_INSTANCES.forEach(function (plumbing) {
    return plumbing.teardown();
  });
  process.exit();
});

function _safeErrorMessage(err) {
  if (!err) return 'unknown error';
  if (typeof err === 'string') return err;
  if (err.stack) return err.stack;
  if (err.message) return err.message;
  return err + '';
}

var Plumbing = function (_StateObject) {
  _inherits(Plumbing, _StateObject);

  function Plumbing() {
    _classCallCheck(this, Plumbing);

    // Keep track of all PLUMBING_INSTANCES so we can put our process.on listeners
    // above this constructor, which is necessary in test environments such
    // as tape where exit might never get called despite an exit.
    var _this = _possibleConstructorReturn(this, (Plumbing.__proto__ || Object.getPrototypeOf(Plumbing)).call(this));

    PLUMBING_INSTANCES.push(_this);

    _this.subprocs = [];
    _this.envoys = [];
    _this.servers = [];
    _this.clients = [];
    _this.requests = {};
    _this.caches = {};
    _this.projects = {};

    // Keep track of whether we got a teardown signal so we know whether we should keep trying to
    // reconnect any subprocs that seem to have disconnected. This seems useless (why not just kill
    // the process) but keep in mind we need to unit test this.
    _this._isTornDown = false;
    _this._masterRestartAttempts = {};

    _this._methodMessages = [];
    _this.executeMethodMessagesWorker();

    emitter.on('teardown-requested', function () {
      _this.teardown();
    });

    emitter.on('proc-respawned', function (folder, alias) {
      if (_this._isTornDown) {
        _LoggerInstance2.default.info('[plumbing] we are torn down, so not restarting client');
        return void 0;
      }

      _LoggerInstance2.default.sacred('[plumbing] restarting client ' + alias + ' in ' + folder);

      // This just waits until we have a 'master' client available with the given name.
      // The reconnect logic is elsewhere
      return _this.awaitFolderClientWithQuery(folder, 'proc-respawned+restartProject', { alias: alias }, WAIT_DELAY, function (err) {
        if (err) {
          return _this._handleUnrecoverableError(new Error('Waited too long for client ' + alias + ' in ' + folder + ' because ' + _safeErrorMessage(err)));
        }

        if (alias === 'master') {
          var projectInfo = _this.getProjectInfoFor(folder);

          // This actually calls the method in question on the given client
          return _this.restartProject(folder, projectInfo, function (err) {
            if (err) {
              return _this._handleUnrecoverableError(new Error('Unable to finish restart on client ' + alias + ' in ' + folder + ' because ' + _safeErrorMessage(err)));
            }
            _LoggerInstance2.default.info('[plumbing] restarted client ' + alias + ' in ' + folder);
          });
        }
      });
    });
    return _this;
  }

  _createClass(Plumbing, [{
    key: '_handleUnrecoverableError',
    value: function _handleUnrecoverableError(err) {
      _Mixpanel2.default.haikuTrackOnce('app:crash', {
        error: err.message
      });
      // Crash in the timeout to give a chance for mixpanel to transmit
      setTimeout(function () {
        throw err;
      }, 100);
    }

    /**
     * Mostly-internal methods
     */

  }, {
    key: 'launch',
    value: function launch() {
      var _this2 = this;

      var haiku = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var cb = arguments[1];

      haiku = (0, _lodash4.default)({}, HAIKU_DEFAULTS, haiku);

      _LoggerInstance2.default.info('[plumbing] launching plumbing', haiku);

      _LoggerInstance2.default.info('[plumbing] launching envoy server');

      var envoyServer = new _server2.default({
        WebSocket: _ws2.default,
        logger: new _logger2.default('warn', _LoggerInstance2.default)
      });

      this.envoys.push(envoyServer);

      return envoyServer.ready().then(function () {
        if (!haiku.envoy) haiku.envoy = {}; // Gets stored in env vars before subprocs created
        haiku.envoy.port = envoyServer.port;
        haiku.envoy.host = envoyServer.host;

        var envoyTimelineHandler = new _timeline2.default(envoyServer);
        var envoyTourHandler = new _tour2.default(envoyServer);
        var envoyExporterHandler = new _exporter.ExporterHandler(envoyServer);
        var envoyGlassHandler = new _glass.GlassHandler(envoyServer);

        envoyServer.bindHandler('timeline', _timeline2.default, envoyTimelineHandler);
        envoyServer.bindHandler('tour', _tour2.default, envoyTourHandler);
        envoyServer.bindHandler(_exporter.EXPORTER_CHANNEL, _exporter.ExporterHandler, envoyExporterHandler);
        envoyServer.bindHandler(_glass.GLASS_CHANNEL, _glass.GlassHandler, envoyGlassHandler);

        _LoggerInstance2.default.info('[plumbing] launching plumbing control server');

        return _this2.launchControlServer(haiku.socket, function (err, server, host, port) {
          if (err) return cb(err);

          // Forward these env vars to creator
          process.env.HAIKU_PLUMBING_PORT = port;
          process.env.HAIKU_PLUMBING_HOST = host;

          if (!haiku.socket) haiku.socket = {};
          haiku.socket.port = port;
          haiku.socket.host = host;
          haiku.plumbing = { url: 'http://' + host + ':' + port };

          _this2.servers.push(server);

          server.on('connected', function (websocket, type, alias, folder, params) {
            _LoggerInstance2.default.sacred('[plumbing] websocket opened (' + type + ' ' + alias + ')');

            // Don't allow duplicate clients
            for (var i = _this2.clients.length - 1; i >= 0; i--) {
              var client = _this2.clients[i];
              if (client.params) {
                if (client.params.alias === alias && client.params.folder === folder) {
                  if (client.readyState === _ws2.default.OPEN) {
                    client.close();
                  }
                  _this2.clients.splice(i, 1);
                }
              }
            }

            websocket.params.id = _id();
            var index = _this2.clients.push(websocket) - 1;

            websocket._index = index;

            websocket.on('close', function () {
              _LoggerInstance2.default.sacred('[plumbing] websocket closed (' + type + ' ' + alias + ')');

              // Clean up dead clients
              for (var j = _this2.clients.length - 1; j >= 0; j--) {
                var _client = _this2.clients[j];
                if (_client === websocket) {
                  _this2.clients.splice(j, 1);
                }
              }
            });
          });

          server.on('message', function (type, alias, folder, message, websocket, server, responder) {
            // IMPORTANT! Creator uses this
            if (!folder && message.folder) {
              folder = message.folder;
            }

            if (message.type === 'broadcast') {
              // Give clients the chance to emit events to all others
              _this2.sendBroadcastMessage(message, folder, alias, websocket);
            } else if (message.id && _this2.requests[message.id]) {
              // If we have an entry in this.requests, that means this is a reply
              var callback = _this2.requests[message.id].callback;

              delete _this2.requests[message.id];
              return callback(message.error, message.result, message);
            } else if (message.method) {
              // This condition MUST happen before the one above since .method is present on that one too
              // Ensure that actions/methods occur in order by using a queue
              _this2.processMethodMessage(type, alias, folder, message, responder);
            }
          });

          _this2.spawnSubgroup(_this2.subprocs, haiku, function (err, spawned) {
            if (err) return cb(err);
            _this2.subprocs.push.apply(_this2.subprocs, spawned);
            return cb(null, host, port, server, spawned, haiku.envoy);
          });
        });
      });
    }
  }, {
    key: 'methodMessageBeforeLog',
    value: function methodMessageBeforeLog(message, alias) {
      if (!IGNORED_METHOD_MESSAGES[message.method]) {
        _LoggerInstance2.default.sacred('[plumbing] \u2193-- ' + message.method + ' via ' + alias + ' -> ' + JSON.stringify(message.params) + ' --\u2193');
      }
    }
  }, {
    key: 'methodMessageAfterLog',
    value: function methodMessageAfterLog(message, err, result, alias) {
      if (!IGNORED_METHOD_MESSAGES[message.method]) {
        if (err && err.message || err && err.stack) {
          _LoggerInstance2.default.sacred('[plumbing] ' + message.method + ' error ' + (err.stack || err.message));
        }
        _LoggerInstance2.default.sacred('[plumbing] \u2191-- ' + message.method + ' via ' + alias + ' --\u2191');
      }
    }
  }, {
    key: 'executeMethodMessagesWorker',
    value: function executeMethodMessagesWorker() {
      var _this3 = this;

      if (this._isTornDown) return void 0; // Avoid leaking a handle
      var nextMethodMessage = this._methodMessages.shift();
      if (!nextMethodMessage) return setTimeout(this.executeMethodMessagesWorker.bind(this), 64);

      var type = nextMethodMessage.type,
          alias = nextMethodMessage.alias,
          folder = nextMethodMessage.folder,
          message = nextMethodMessage.message,
          cb = nextMethodMessage.cb;


      this.methodMessageBeforeLog(message, alias);

      // Actions are a special case of methods that end up routed through all of the clients,
      // glass -> timeline -> master before returning. They go through one handler as opposed
      // to the normal 'methods' which plumbing handles on a more a la carte basis
      if (message.type === 'action') {
        return this.handleClientAction(type, alias, folder, message.method, message.params, function (err, result) {
          _this3.methodMessageAfterLog(message, err, result, alias);
          cb(err, result);
          _this3.executeMethodMessagesWorker(); // Continue with the next queue entry (if any)
        });
      }

      return this.plumbingMethod(message.method, message.params || [], function (err, result) {
        _this3.methodMessageAfterLog(message, err, result, alias);
        cb(err, result);
        _this3.executeMethodMessagesWorker(); // Continue with the next queue entry (if any)
      });
    }
  }, {
    key: 'processMethodMessage',
    value: function processMethodMessage(type, alias, folder, message, cb) {
      // Certain messages aren't of a kind that we can reliably enqueue - either they happen too fast or they are 'fire and forget'
      if (METHOD_MESSAGES_TO_HANDLE_IMMEDIATELY[message.method]) {
        if (message.type === 'action') {
          return this.handleClientAction(type, alias, folder, message.method, message.params, cb);
        } else {
          return this.plumbingMethod(message.method, message.params, cb);
        }
      } else {
        this._methodMessages.push({ type: type, alias: alias, folder: folder, message: message, cb: cb });
      }
    }
  }, {
    key: 'sendBroadcastMessage',
    value: function sendBroadcastMessage(message, folder, alias, websocket) {
      this.clients.forEach(function (client) {
        if (websocket && client === websocket) return void 0; // Skip message's send
        if (client.readyState !== _ws2.default.OPEN) return void 0;
        delete message.id; // Don't confuse this as a request/response
        sendMessageToClient(client, (0, _lodash4.default)(message, { folder: folder, alias: alias }));
      });
    }
  }, {
    key: 'sentryError',
    value: function sentryError(method, error, extras) {
      _LoggerInstance2.default.sacred('[plumbing] error @ ' + method, error, extras);
      if (!Raven) return null;
      if (method && METHODS_TO_SKIP_IN_SENTRY[method]) return null;
      if (!error) return null;
      if ((typeof error === 'undefined' ? 'undefined' : _typeof(error)) === 'object' && !(error instanceof Error)) {
        var fixed = new Error(error.message || 'Plumbing.' + method + ' error');
        if (error.stack) fixed.stack = error.stack;
        error = fixed;
      } else if (typeof error === 'string') {
        error = new Error(error); // Unfortunately no good stack trace in this case
      }
      (0, _carbonite.crashReport)(this.get('organizationName'), this.get('lastOpenedProject'));
      return Raven.captureException(error, extras);
    }
  }, {
    key: 'plumbingMethod',
    value: function plumbingMethod(method) {
      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      var cb = arguments[2];

      if (typeof this[method] !== 'function') return cb(new Error('Plumbing has no method \'' + method + '\''));
      return this[method].apply(this, params.concat(function (error, result) {
        if (error) return cb(error);
        return cb(null, result);
      }));
    }
  }, {
    key: 'awaitFolderClientWithQuery',
    value: function awaitFolderClientWithQuery(folder, method, query, timeout, cb) {
      var _this4 = this;

      if (!folder) return cb(new Error('Folder argument was missing'));
      if (!query) return cb(new Error('Query argument was missing'));
      if (timeout <= 0) {
        return cb(new Error('Timed out waiting for client ' + JSON.stringify(query) + ' of ' + folder + ' to connect'));
      }

      // HACK: At the time of this writing, there is only "one" creator client, not one per folder.
      // So the method just get ssent to the one client (if available)
      if (query.alias === 'creator') {
        var creatorClient = (0, _lodash2.default)(this.clients, { params: query });
        if (creatorClient) {
          return cb(null, creatorClient);
        }
      } else {
        var clientsOfFolder = (0, _lodash6.default)(this.clients, { params: { folder: folder } });

        // // uncomment me for insight into why a request might not be making it
        // if (method !== 'masterHeartbeat') {
        //   console.log('awaiting', method, query, folder, JSON.stringify(this.clients.map((c) => c.params.alias)))
        // }

        if (clientsOfFolder && clientsOfFolder.length > 0) {
          var clientMatching = (0, _lodash2.default)(clientsOfFolder, { params: query });
          if (clientMatching) {
            return cb(null, clientMatching);
          }
        }
      }
      return setTimeout(function () {
        return _this4.awaitFolderClientWithQuery(folder, method, query, timeout - AWAIT_INTERVAL, cb);
      }, AWAIT_INTERVAL);
    }
  }, {
    key: 'sendFolderSpecificClientMethodQuery',
    value: function sendFolderSpecificClientMethodQuery(folder) {
      var query = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var method = arguments[2];

      var _this5 = this;

      var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
      var cb = arguments[4];

      return this.awaitFolderClientWithQuery(folder, method, query, WAIT_DELAY, function (err, client) {
        if (err) return cb(err);
        return _this5.sendClientMethod(client, method, params, function (error, response) {
          if (error) {
            _this5.sentryError(method, error, { tags: query });
            return cb(error);
          }
          return cb(null, response);
        });
      });
    }
  }, {
    key: 'sendClientMethod',
    value: function sendClientMethod(websocket, method) {
      var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
      var callback = arguments[3];

      var message = { method: method, params: params };
      return this.sendClientRequest(websocket, message, callback);
    }
  }, {
    key: 'sendClientRequest',
    value: function sendClientRequest(websocket, message, callback) {
      if (message.id === undefined) message.id = '' + Math.random();
      this.requests[message.id] = { websocket: websocket, message: message, callback: callback };
      if (websocket.readyState === _ws2.default.OPEN) {
        var data = JSON.stringify(message);
        return websocket.send(data);
      } else {
        _LoggerInstance2.default.info('[plumbing] websocket readyState was not open so we did not send message ' + (message.method || message.id));
        callback(); // Should this return an error or remain silent?
      }
    }
  }, {
    key: 'teardown',
    value: function teardown() {
      _LoggerInstance2.default.info('[plumbing] teardown method called');
      this.subprocs.forEach(function (subproc) {
        if (subproc.kill) {
          if (subproc.stdin) subproc.stdin.pause();
          // Using sigterm as opposed to kill to give the processes a chance to cleanup
          // so we don't end up with corrupt git objects
          _LoggerInstance2.default.info('[plumbing] sending terminate signal');
          subproc.kill('SIGTERM');
        } else if (subproc.exit) {
          _LoggerInstance2.default.info('[plumbing] calling exit');
          subproc.exit();
        }
      });
      this.envoys.forEach(function (envoy) {
        _LoggerInstance2.default.info('[plumbing] closing envoy');
        envoy.close();
      });
      this.servers.forEach(function (server) {
        _LoggerInstance2.default.info('[plumbing] closing server');
        server.close();
      });
      this.clients.forEach(function (client) {
        if (client.readyState !== _ws2.default.OPEN) return void 0;
        _LoggerInstance2.default.info('[plumbing] sending crash signal to client');
        sendMessageToClient(client, { signal: 'CRASH' });
      });
      this._isTornDown = true;
    }
  }, {
    key: 'toggleDevTools',
    value: function toggleDevTools(folder, cb) {
      this.sendBroadcastMessage({ type: 'broadcast', name: 'dev-tools:toggle' });
      cb();
    }

    /**
     * Outward-facing
     */

  }, {
    key: 'masterHeartbeat',
    value: function masterHeartbeat(folder, cb) {
      return this.sendFolderSpecificClientMethodQuery(folder, Q_MASTER, 'masterHeartbeat', [], function (err, masterState) {
        if (err) return cb(err);
        return cb(null, masterState);
      });
    }
  }, {
    key: 'doesProjectHaveUnsavedChanges',
    value: function doesProjectHaveUnsavedChanges(folder, cb) {
      return this.sendFolderSpecificClientMethodQuery(folder, Q_MASTER, 'doesProjectHaveUnsavedChanges', [], cb);
    }

    /**
     * @method initializeProject
     * @description Flexible method for setting up a project based on an unknown file system state and possibly missing inputs.
     * We make a decision here as to where + whether to generate a new folder.
     * With a folder in hand, we boot up the MasterProcess for the folder in question.
     * When it is ready, we kick off the content initialization step with initializeFolder.
     */

  }, {
    key: 'initializeProject',
    value: function initializeProject(maybeProjectName, _ref, maybeUsername, maybePassword, finish) {
      var projectsHome = _ref.projectsHome,
          projectPath = _ref.projectPath,
          skipContentCreation = _ref.skipContentCreation,
          organizationName = _ref.organizationName,
          authorName = _ref.authorName;

      var _this6 = this;

      var projectOptions = {
        projectsHome: projectsHome,
        projectPath: projectPath,
        skipContentCreation: skipContentCreation,
        organizationName: organizationName,
        projectName: maybeProjectName,
        username: maybeUsername,
        password: maybePassword

        // TODO/QUESTION: When do these attributes get set upstream?
      };if (!projectOptions.organizationName) projectOptions.organizationName = this.get('organizationName');
      if (!projectOptions.authorName) projectOptions.authorName = this.get('username');

      // We don't need to waste time making these bundles before we have done anything -
      // Instead, we'll generate them just-in-time when the user saves.
      projectOptions.skipCDNBundles = true;

      var projectFolder = void 0; // To be populated momentarily...

      return _async2.default.series([function (cb) {
        return _this6.getCurrentOrganizationName(function (err, organizationName) {
          if (err) return cb(err);
          projectOptions.organizationName = organizationName;
          return cb();
        });
      }, function (cb) {
        return ProjectFolder.ensureProject(projectOptions, function (err, _projectFolder) {
          if (err) return cb(err);
          projectFolder = _projectFolder;
          return cb();
        });
      }, function (cb) {
        // Just a second check to make sure we created the folder - probably not necessary
        return _haikuFsExtra2.default.exists(projectFolder, function (doesFolderExist) {
          if (!doesFolderExist) return cb(new Error('Project folder does not exist'));
          return cb();
        });
      }, function (cb) {
        return _this6.spawnSubgroup(_this6.subprocs, { folder: projectFolder }, function (err, spawned) {
          if (err) return cb(err);
          _this6.subprocs.push.apply(_this6.subprocs, spawned);
          return cb();
        });
      }], function (err) {
        if (err) {
          _this6.sentryError('initializeProject', err);
          return finish(err);
        }

        // QUESTION: Does this *need* to happen down here after the org fetch?
        var gitInitializeUsername = projectOptions.username || _this6.get('username');
        var gitInitializePassword = projectOptions.password || _this6.get('password');

        // A simpler project options to avoid passing options only used for the first pass, e.g. skipContentCreation
        var projectOptionsAgain = {
          organizationName: projectOptions.organizationName,
          username: gitInitializeUsername,
          password: gitInitializePassword,
          authorName: authorName
        };

        return _this6.initializeFolder(maybeProjectName, projectFolder, gitInitializeUsername, gitInitializePassword, projectOptionsAgain, function (err) {
          if (err) return finish(err);
          // HACK: used when restarting the process to allow us to reinitialize properly
          _this6.projects[projectFolder] = {
            name: maybeProjectName,
            folder: projectFolder,
            username: gitInitializePassword,
            password: gitInitializePassword,
            organization: projectOptionsAgain.organizationName,
            options: projectOptionsAgain
          };

          if (Raven) {
            Raven.setContext({
              projectName: maybeProjectName,
              organizationName: projectOptionsAgain.organizationName
            });
          }

          _this6.set('lastOpenedProject', maybeProjectName);

          if (maybeProjectName) {
            // HACK: alias to allow lookup by project name
            _this6.projects[maybeProjectName] = _this6.projects[projectFolder];
          }

          return finish(null, projectFolder);
        });
      });
    }

    /**
     * Returns the absolute path of the folder of a project by name, if we are tracking one.
     */

  }, {
    key: 'getFolderFor',
    value: function getFolderFor(projectName) {
      var info = this.getProjectInfoFor(projectName);
      if (!info) return null;
      return info.folder;
    }
  }, {
    key: 'getProjectInfoFor',
    value: function getProjectInfoFor(projectNameOrFolder) {
      return this.projects[projectNameOrFolder];
    }

    /**
     * @method initializeFolder
     * @description Assuming we already have a folder created, an organization name, etc., now bootstrap the folder itself.
     */

  }, {
    key: 'initializeFolder',
    value: function initializeFolder(maybeProjectName, folder, maybeUsername, maybePassword, projectOptions, cb) {
      return this.sendFolderSpecificClientMethodQuery(folder, Q_MASTER, 'initializeFolder', [maybeProjectName, maybeUsername, maybePassword, projectOptions], cb);
    }
  }, {
    key: 'startProject',
    value: function startProject(maybeProjectName, folder, cb) {
      return this.sendFolderSpecificClientMethodQuery(folder, Q_MASTER, 'startProject', [], cb);
    }
  }, {
    key: 'restartProject',
    value: function restartProject(folder, projectInfo, cb) {
      var _this7 = this;

      // We run initializeFolder first to ensure the Git bootstrapping works correctly, especially setting
      // a branch name and ensuring we have a good baseline commit with which to start; we get errors on restart
      // unless we do this so take care if you plan to re/move this
      return this.sendFolderSpecificClientMethodQuery(folder, Q_MASTER, 'initializeFolder', [projectInfo.name, projectInfo.username, projectInfo.password, projectInfo.options], function (err) {
        if (err) return cb(err);
        return _this7.sendFolderSpecificClientMethodQuery(folder, Q_MASTER, 'restartProject', [], cb);
      });
    }
  }, {
    key: 'isUserAuthenticated',
    value: function isUserAuthenticated(cb) {
      var answer = _haikuSdkClient.client.config.isAuthenticated();
      if (!answer) {
        return cb(null, { isAuthed: false });
      }
      return this.getCurrentOrganizationName(function (err, organizationName) {
        if (err) return cb(err);
        var username = _haikuSdkClient.client.config.getUserId();
        _Mixpanel2.default.mergeToPayload({ distinct_id: username });
        if (Raven) {
          Raven.setContext({
            user: { email: username },
            tags: { username: username }
          });
        }
        return cb(null, {
          isAuthed: true,
          username: username,
          authToken: _haikuSdkClient.client.config.getAuthToken(),
          organizationName: organizationName
        });
      });
    }
  }, {
    key: 'authenticateUser',
    value: function authenticateUser(username, password, cb) {
      var _this8 = this;

      this.set('organizationName', null); // Unset this cache to avoid writing others folders if somebody switches accounts in the middle of a session
      return _haikuSdkInkstone.inkstone.user.authenticate(username, password, function (authErr, authResponse, httpResponse) {
        if (authErr) return cb(authErr);
        if (httpResponse.statusCode === 401) return cb(new Error('Unauthorized'));

        if (httpResponse.statusCode > 499) {
          var serverErr = new Error('Auth HTTP Error: ' + httpResponse.statusCode);
          _this8.sentryError('authenticateUser', serverErr);
          return cb(serverErr);
        }

        if (httpResponse.statusCode > 299) {
          var unexpectedError = new Error('Auth HTTP Error: ' + httpResponse.statusCode);
          return cb(unexpectedError);
        }

        if (!authResponse) return cb(new Error('Auth response was empty'));
        _this8.set('username', username);
        _this8.set('password', password);
        _this8.set('inkstoneAuthToken', authResponse.Token);
        _haikuSdkClient.client.config.setAuthToken(authResponse.Token);
        _haikuSdkClient.client.config.setUserId(username);
        _Mixpanel2.default.mergeToPayload({ distinct_id: username });
        if (Raven) {
          Raven.setContext({
            user: { email: username },
            tags: { username: username }
          });
        }
        return _this8.getCurrentOrganizationName(function (err, organizationName) {
          if (err) return cb(err);
          return cb(null, {
            isAuthed: true,
            username: username,
            authToken: authResponse.Token,
            organizationName: organizationName
          });
        });
      });
    }
  }, {
    key: 'getCurrentOrganizationName',
    value: function getCurrentOrganizationName(cb) {
      var _this9 = this;

      if (this.get('organizationName')) return cb(null, this.get('organizationName'));
      _LoggerInstance2.default.info('[plumbing] fetching organization name for current user');
      var authToken = _haikuSdkClient.client.config.getAuthToken();
      return _haikuSdkInkstone.inkstone.organization.list(authToken, function (orgErr, orgsArray, orgHttpResp) {
        if (orgErr) return cb(new Error('Organization error'));
        if (orgHttpResp.statusCode === 401) return cb(new Error('Unauthorized organization'));
        if (orgHttpResp.statusCode > 299) return cb(new Error('Error status code: ' + orgHttpResp.statusCode));
        if (!orgsArray || orgsArray.length < 1) return cb(new Error('No organization found'));
        // Cache this since it's used to write/manage some project files
        var organizationName = orgsArray[0].Name;
        _LoggerInstance2.default.info('[plumbing] organization name:', organizationName);
        _this9.set('organizationName', organizationName);
        return cb(null, _this9.get('organizationName'));
      });
    }
  }, {
    key: 'listProjects',
    value: function listProjects(cb) {
      var _this10 = this;

      _LoggerInstance2.default.info('[plumbing] listing projects');
      var authToken = _haikuSdkClient.client.config.getAuthToken();
      return _haikuSdkInkstone.inkstone.project.list(authToken, function (projectListErr, projectsList) {
        if (projectListErr) {
          _this10.sentryError('listProjects', projectListErr);
          return cb(projectListErr);
        }
        var finalList = projectsList.map(remapProjectObjectToExpectedFormat);
        _LoggerInstance2.default.info('[plumbing] fetched project list', JSON.stringify(finalList));
        return cb(null, finalList);
      });
    }
  }, {
    key: 'createProject',
    value: function createProject(name, cb) {
      var _this11 = this;

      _LoggerInstance2.default.info('[plumbing] creating project', name);
      var authToken = _haikuSdkClient.client.config.getAuthToken();
      return _haikuSdkInkstone.inkstone.project.create(authToken, { Name: name }, function (projectCreateErr, project) {
        if (projectCreateErr) {
          _this11.sentryError('createProject', projectCreateErr);
          return cb(projectCreateErr);
        }
        return setTimeout(function () {
          return cb(null, remapProjectObjectToExpectedFormat(project));
        }, CODE_COMMIT_RACE_CONDITION_DELAY);
      });
    }
  }, {
    key: 'deleteProject',
    value: function deleteProject(name, cb) {
      var _this12 = this;

      _LoggerInstance2.default.info('[plumbing] deleting project', name);
      var authToken = _haikuSdkClient.client.config.getAuthToken();
      return _haikuSdkInkstone.inkstone.project.deleteByName(authToken, name, function (deleteErr) {
        if (deleteErr) {
          _this12.sentryError('deleteProject', deleteErr);
          return cb(deleteErr);
        }
        return cb();
      });
    }
  }, {
    key: 'discardProjectChanges',
    value: function discardProjectChanges(folder, cb) {
      return this.sendFolderSpecificClientMethodQuery(folder, Q_MASTER, 'discardProjectChanges', [], cb);
    }
  }, {
    key: 'saveProject',
    value: function saveProject(folder, projectName, maybeUsername, maybePassword, saveOptions, cb) {
      if (!saveOptions) saveOptions = {};
      if (!saveOptions.authorName) saveOptions.authorName = this.get('username');
      if (!saveOptions.organizationName) saveOptions.organizationName = this.get('organizationName');
      _LoggerInstance2.default.info('[plumbing] saving with options', saveOptions);
      return this.sendFolderSpecificClientMethodQuery(folder, Q_MASTER, 'saveProject', [projectName, maybeUsername, maybePassword, saveOptions], cb);
    }
  }, {
    key: 'previewProject',
    value: function previewProject(folder, projectName, previewOptions, cb) {
      if (!previewOptions) previewOptions = {};
      if (!previewOptions.authorName) previewOptions.authorName = this.get('username');
      if (!previewOptions.organizationName) previewOptions.organizationName = this.get('organizationName');
      _LoggerInstance2.default.info('[plumbing] previewing with options', previewOptions);
      return this.sendFolderSpecificClientMethodQuery(folder, Q_MASTER, 'previewProject', [projectName, previewOptions], cb);
    }
  }, {
    key: 'fetchProjectInfo',
    value: function fetchProjectInfo(folder, projectName, maybeUsername, maybePassword, fetchOptions, cb) {
      if (!fetchOptions) fetchOptions = {};
      if (!fetchOptions.authorName) fetchOptions.authorName = this.get('username');
      if (!fetchOptions.organizationName) fetchOptions.organizationName = this.get('organizationName');
      return this.sendFolderSpecificClientMethodQuery(folder, Q_MASTER, 'fetchProjectInfo', [projectName, maybeUsername, maybePassword, fetchOptions], cb);
    }
  }, {
    key: 'checkInkstoneUpdates',
    value: function checkInkstoneUpdates() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var cb = arguments[1];

      var authToken = _haikuSdkClient.client.config.getAuthToken();
      return _haikuSdkInkstone.inkstone.updates.check(authToken, options, cb);
    }
  }, {
    key: 'listAssets',
    value: function listAssets(folder, cb) {
      return this.sendFolderSpecificClientMethodQuery(folder, Q_MASTER, 'fetchAssets', [], cb);
    }
  }, {
    key: 'linkAsset',
    value: function linkAsset(assetAbspath, folder, cb) {
      return this.sendFolderSpecificClientMethodQuery(folder, Q_MASTER, 'linkAsset', [assetAbspath], cb);
    }
  }, {
    key: 'bulkLinkAssets',
    value: function bulkLinkAssets(assetsAbspaths, folder, cb) {
      return this.sendFolderSpecificClientMethodQuery(folder, Q_MASTER, 'bulkLinkAssets', [assetsAbspaths], cb);
    }
  }, {
    key: 'unlinkAsset',
    value: function unlinkAsset(assetRelpath, folder, cb) {
      return this.sendFolderSpecificClientMethodQuery(folder, Q_MASTER, 'unlinkAsset', [assetRelpath], cb);
    }
  }, {
    key: 'gitUndo',
    value: function gitUndo(folder, undoOptions, cb) {
      return this.sendFolderSpecificClientMethodQuery(folder, Q_MASTER, 'gitUndo', [folder, undoOptions], cb);
    }
  }, {
    key: 'gitRedo',
    value: function gitRedo(folder, redoOptions, cb) {
      return this.sendFolderSpecificClientMethodQuery(folder, Q_MASTER, 'gitRedo', [folder, redoOptions], cb);
    }
  }, {
    key: 'readMetadata',
    value: function readMetadata(folder, cb) {
      return this.sendFolderSpecificClientMethodQuery(folder, Q_MASTER, 'readMetadata', [folder], cb);
    }
  }, {
    key: 'readAllStateValues',
    value: function readAllStateValues(folder, cb) {
      return this.sendFolderSpecificClientMethodQuery(folder, Q_MASTER, 'readAllStateValues', [folder], cb);
    }
  }, {
    key: 'readAllEventHandlers',
    value: function readAllEventHandlers(folder, cb) {
      return this.sendFolderSpecificClientMethodQuery(folder, Q_MASTER, 'readAllEventHandlers', [folder], cb);
    }

    /** ------------------- */
    /** ------------------- */
    /** ------------------- */

  }, {
    key: 'handleClientAction',
    value: function handleClientAction(type, alias, folder, method, params, cb) {
      var _this13 = this;

      // Params always arrive with the folder as the first argument, so we strip that off
      params = params.slice(1);

      // This special method gets called frequently (up to 60 times per second) so fast-path it and don't log it
      if (method === 'setTimelineTime') {
        if (alias === 'timeline') {
          return this.sendFolderSpecificClientMethodQuery(folder, Q_GLASS, method, params.concat({ from: alias }), function () {});
        } else if (alias === 'glass') {
          return this.sendFolderSpecificClientMethodQuery(folder, Q_TIMELINE, method, params.concat({ from: alias }), function () {});
        }
      }

      // HACK: A few methods require this special handling; #FIXME
      if (method === 'instantiateComponent') {
        var modulepath = (0, _getNormalizedComponentModulePath2.default)(params[0], /* ?? */'');
        if (!modulepath) {
          params[0] = _path2.default.normalize(_path2.default.relative(folder, params[0]));
        }
      }

      // Start with the glass, since that's most visible, then move through the rest, and end
      // with master at the end, which results in a file system update reflecting the change
      _async2.default.eachSeries([Q_GLASS, Q_TIMELINE, Q_CREATOR, Q_MASTER], function (clientSpec, nextStep) {
        if (clientSpec.alias === alias) {
          if (method !== 'mergeDesigns') {
            // Don't send to oneself, unless it is mergeDesigns, which is a special snowflake
            // that originates in 'master' but also needs to be sent back to it (HACK)
            return nextStep();
          }
        }

        // There are a bunch of methods (actually...most of them) that creator doesn't need to receive
        if ((method === 'moveSegmentEndpoints' || method === 'mergeDesigns' || method === 'moveKeyframes') && clientSpec.alias === 'creator') {
          return nextStep();
        }

        if (!IGNORED_METHOD_MESSAGES[method]) {
          _LoggerInstance2.default.info('[plumbing] -> client action ' + method + ' being sent to ' + clientSpec.alias);
        }

        // HACK: Glass and timeline always expect some metadata as the last argument
        if (clientSpec.alias === 'glass' || clientSpec.alias === 'timeline') {
          return _this13.sendFolderSpecificClientMethodQuery(folder, clientSpec, method, params.concat({ from: alias }), function (err, maybeOutput) {
            if (err) return nextStep(err);

            // HACK: Stupidly we have to rely on glass to tell us where to position the element based on the
            // offset of the artboard. So in this one case we have the glass transmit a return value that
            // we read and then use as the payload to the next actions in this pipeline
            if (method === 'instantiateComponent' && clientSpec.alias === 'glass') {
              if (maybeOutput && maybeOutput.center) {
                // Called 'posdata' in the ActiveComponent method as the second arg.
                // The third arg is the more open-ended 'metadata' (API change from May 10)
                params[1] = maybeOutput.center;
              }
            }

            return nextStep();
          });
        } else {
          return _this13.sendFolderSpecificClientMethodQuery(folder, clientSpec, method, params, function (err) {
            if (err) return nextStep(err);
            return nextStep();
          });
        }
      }, function (err) {
        if (err) {
          if (!IGNORED_METHOD_MESSAGES[method]) {
            _LoggerInstance2.default.info('[plumbing] <- client action ' + method + ' from ' + type + '@' + alias + ' errored', err);
          }
          if (cb) return cb(err);
          return void 0;
        }

        if (!IGNORED_METHOD_MESSAGES[method]) {
          _LoggerInstance2.default.info('[plumbing] <- client action ' + method + ' from ' + type + '@' + alias + ' complete');
        }
        if (cb) return cb();
        return void 0;
      });
    }
  }]);

  return Plumbing;
}(_haikuStateObject2.default);

exports.default = Plumbing;


Plumbing.prototype.spawnSubgroup = function (existingSpawnedSubprocs, haiku, cb) {
  _LoggerInstance2.default.info('[plumbing] spawning subprocesses for this group', haiku);
  var subprocs = [];
  // MasterProcess can only operate if a folder is defined
  if (haiku.folder) {
    // Starting master from this point assumes it has been triggered explicitly
    // as opposed to by an automatic restart attempt, so we reset the restart attempt
    // counter back to zero.
    this._masterRestartAttempts[haiku.folder] = 0;

    subprocs.push(PROCS.master);
  }
  if (haiku.mode === 'creator') {
    subprocs.push(PROCS.creator);
  }
  return this.spawnSubprocesses(existingSpawnedSubprocs, haiku, subprocs, cb);
};

Plumbing.prototype.spawnSubprocesses = function (existingSpawnedSubprocs, haiku, subprocs, cb) {
  var _this14 = this;

  this.extendEnvironment(haiku);
  return _async2.default.map(subprocs, function (subproc, next) {
    return _this14.spawnSubprocess(existingSpawnedSubprocs, haiku.folder, subproc, next);
  }, function (err, spawned) {
    if (err) return cb(err);
    return cb(null, spawned);
  });
};

Plumbing.prototype.spawnSubprocess = function spawnSubprocess(existingSpawnedSubprocs, folder, _ref2, cb) {
  var _this15 = this;

  var name = _ref2.name,
      path = _ref2.path,
      args = _ref2.args,
      opts = _ref2.opts;

  var existing = (0, _lodash2.default)(existingSpawnedSubprocs, { _attributes: { name: name, folder: folder } });
  if (existing) {
    // Reconnection (via websocket) is only available if the process itself is still alive
    if (existing.connected && !existing._attributes.disconnected && !existing._attributes.exited && !existing._attributes.closed) {
      if (existing.reestablishConnection) existing.reestablishConnection();else existing.send('reestablishConnection!');

      _LoggerInstance2.default.info('[plumbing] reusing existing ' + name + ' process');
      existing._attributes.reused = true;

      return cb(null, existing);
    }
  }

  var proc = void 0;

  if (opts && opts.electron && isElectronMain() && (typeof path === 'undefined' ? 'undefined' : _typeof(path)) === 'object') {
    // If we are *in* Electron, this 'path', which would normally be an absolute path to the
    // Electron binary, is actually the require('electron') export object. Instead of launching
    // the subprocess 'with' Electron binary as the command, we can just 'require' it since
    // that is where we already are. This is condition is critical for our packaging hooks.
    // Be aware that a change here might break the ability to create a working distribution.
    _LoggerInstance2.default.info('[plumbing] requiring ' + name + ' @ ' + args[0]);
    proc = require(args[0]).default;
  } else {
    // If we aren't in electron, start the process using the electron binary path
    if (opts && opts.spawn) {
      // Remote debugging hook only used in development; causes problems in distro
      if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'staging' && process.env.NO_REMOTE_DEBUG !== '1') {
        args.push('--enable-logging', '--remote-debugging-port=9222');
      }
      proc = _child_process2.default.spawn(path, args, { stdio: [null, null, null, 'ipc'] });
    } else {
      args = args || [];
      // Remote debugging hook only used in development; causes problems in distro
      if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'staging' && process.env.NO_REMOTE_DEBUG !== '1') {
        args.push('--debug=5859');
      }
      proc = _child_process2.default.fork(path, args);
    }

    _LoggerInstance2.default.info('[plumbing] proc ' + name + ' created @ ' + path);
  }

  proc._attributes = { name: name, folder: folder, id: _id() };

  proc.on('exit', function () {
    _LoggerInstance2.default.sacred('[plumbing] proc ' + name + ' exiting');

    proc._attributes.exited = true;

    if (proc._attributes.name) {
      // If electron is finished, we should clean up stuff. This usually means the user has closed the view.
      if (proc._attributes.name.match(/electron/) || name.match(/creator/)) {
        emitter.emit('teardown-requested');
      } else if (proc._attributes.name.match(/master/)) {
        // Avoid ending up in an endless loop of fail if we find ourselves torn down
        if (!_this15._isTornDown) {
          if (!_this15._masterRestartAttempts[folder]) {
            _this15._masterRestartAttempts[folder] = 0;
          }
          _this15._masterRestartAttempts[folder] += 1;
          if (_this15._masterRestartAttempts[folder] > MAX_MASTER_RESTART_ATTEMPTS) {
            return _this15._handleUnrecoverableError(new Error('Cannot respawn master for ' + folder + ' after too many attempts'));
          }

          // Master should probably keep running, since it does peristence stuff, so reconnect if we detect it crashed.
          _LoggerInstance2.default.sacred('[plumbing] trying to respawn master for ' + folder);

          _this15.spawnSubprocess(existingSpawnedSubprocs, folder, { name: name, path: path, args: args, opts: opts }, function (err, newProc) {
            if (err) {
              return _this15._handleUnrecoverableError(new Error('Unable to respawn master for ' + folder + ' because ' + _safeErrorMessage(err)));
            }

            newProc._attributes.closed = undefined;
            newProc._attributes.disconnected = undefined;
            newProc._attributes.exited = undefined;

            existingSpawnedSubprocs.push(newProc);

            _LoggerInstance2.default.info('[plumbing] respawned proc master for folder ' + folder + '; restarting project');

            // Emit this event to notify ourselves that we want to wait for the websocket
            // in the given process to reconnect itself and then do any of the usual setup
            emitter.emit('proc-respawned', folder, name);
          });
        }
      }
    }

    // Remove the old, unused process from the list of existing ones
    for (var i = existingSpawnedSubprocs.length - 1; i >= 0; i--) {
      var _existing = existingSpawnedSubprocs[i];
      if (_existing === proc) {
        existingSpawnedSubprocs.splice(i, 1);
      }
    }
  });

  proc.on('close', function () {
    proc._attributes.closed = true;
  });
  proc.on('disconnect', function () {
    proc._attributes.disconnected = true;
  });
  proc.on('error', function (error) {
    _LoggerInstance2.default.info('[plumbing] proc ' + name + ' got error', error);
  });
  proc.on('message', function (message) {
    _LoggerInstance2.default.info('[plumbing] proc ' + name + ' got message', message);
  });
  proc.on('request', function (message) {
    _LoggerInstance2.default.info('[plumbing] proc ' + name + ' got request', message);
  });

  return cb(null, proc);
};

var portrange = 45032;

// On the given host, return the port number of an open port. Note that the host must be
// specified otherwise you end up getting false positives! E.g. ipv4 0.0.0.0 vs ipv6 ::.
function getPort(host, cb) {
  var port = portrange;
  portrange += 1;
  var server = _net2.default.createServer();
  server.listen(port, host);
  server.once('listening', function () {
    server.once('close', function () {
      return cb(null, port);
    });
    server.close();
  });
  server.on('error', function (err) {
    if (err && err.code === 'EADDRINUSE') {
      return getPort(host, cb);
    }
    // If not an address-in-use error, something bad has happened and we likely shouldn't continue
    throw err;
  });
  return server;
}

Plumbing.prototype.launchControlServer = function launchControlServer(socketInfo, cb) {
  var _this16 = this;

  var host = socketInfo && socketInfo.host || '0.0.0.0';

  if (socketInfo && socketInfo.port) {
    _LoggerInstance2.default.sacred('[plumbing] plumbing websocket server listening on specified port ' + socketInfo.port + '...');

    var websocketServer = this.createControlSocket({ host: host, port: socketInfo.port });

    return cb(null, websocketServer, host, socketInfo.port);
  }

  _LoggerInstance2.default.info('[plumbing] finding open port...');

  return getPort(host, function (err, port) {
    if (err) return cb(err);

    _LoggerInstance2.default.sacred('[plumbing] plumbing websocket server listening on discovered port ' + port + '...');

    var websocketServer = _this16.createControlSocket({ host: host, port: port });

    return cb(null, websocketServer, host, port);
  });
};

Plumbing.prototype.extendEnvironment = function extendEnvironment(haiku) {
  var HAIKU_ENV = JSON.parse(process.env.HAIKU_ENV || '{}');
  (0, _lodash4.default)(HAIKU_ENV, haiku);
  _LoggerInstance2.default.sacred('[plumbing] environment forwarding:', JSON.stringify(HAIKU_ENV, 2, null));
  process.env.HAIKU_ENV = JSON.stringify(HAIKU_ENV); // Forward env to subprocesses
};

function getWsParams(websocket, request) {
  var url = request.url || '';
  var query = url.split('?')[1] || '';
  var params = _qs2.default.parse(query);
  params.url = url;
  return params;
}

Plumbing.prototype.createControlSocket = function createControlSocket(socketInfo) {
  var websocketServer = new _ws2.default.Server({ port: socketInfo.port, host: socketInfo.host });

  // Reserve this port so that OpenPort sees it as being unavailable in case other instances
  // of plumbing happen to open. This isn't intended to do anything except that, hence the no-op listener.
  // const httpServer = http.createServer()
  // httpServer.listen(socketInfo.port)

  websocketServer.on('connection', function (websocket, request) {
    var params = getWsParams(websocket, request);

    if (!params.type) params.type = 'default';
    if (!params.haiku) params.haiku = {};
    if (!websocket.params) websocket.params = params;

    var type = websocket.params && websocket.params.type;
    var alias = websocket.params && websocket.params.alias;

    var folder = websocket.params && websocket.params.folder;

    websocketServer.emit('connected', websocket, type, alias, folder, params);

    websocket.on('message', function (data) {
      var message = JSON.parse(data);

      // Allow explicit override; Creator uses this!
      // Also some tests use this.
      if (message.folder) folder = message.folder;

      websocketServer.emit('message', type, alias, folder, message, websocket, websocketServer, createResponder(message, websocket));
    });
  });

  return websocketServer;
};

function sendMessageToClient(client, message) {
  if (client.readyState === _ws2.default.OPEN) {
    var data = JSON.stringify(message);
    return client.send(data);
  }
}

function createResponder(message, websocket) {
  return function messageResponder(error, result) {
    var reply = {
      jsonrpc: '2.0',
      id: message.id,
      result: result || void 0,
      error: error ? (0, _serializeError2.default)(error) : void 0
    };
    sendMessageToClient(websocket, reply);
  };
}

function remapProjectObjectToExpectedFormat(projectObject) {
  return {
    projectName: projectObject.Name
    // GitRemoteUrl
    // GitRemoteName
    // GitRemoteArn
  };
}

function isElectronMain() {
  return typeof process !== 'undefined' && process.versions && !!process.versions.electron;
}
//# sourceMappingURL=Plumbing.js.map