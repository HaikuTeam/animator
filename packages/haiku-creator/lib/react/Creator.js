'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _jsxFileName = 'src/react/Creator.js';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _radium = require('radium');

var _reactSplitPane = require('react-split-pane');

var _reactSplitPane2 = _interopRequireDefault(_reactSplitPane);

var _reactAddonsCssTransitionGroup = require('react-addons-css-transition-group');

var _reactAddonsCssTransitionGroup2 = _interopRequireDefault(_reactAddonsCssTransitionGroup);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _combokeys = require('combokeys');

var _combokeys2 = _interopRequireDefault(_combokeys);

var _eventEmitter = require('event-emitter');

var _eventEmitter2 = _interopRequireDefault(_eventEmitter);

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _AuthenticationUI = require('./components/AuthenticationUI');

var _AuthenticationUI2 = _interopRequireDefault(_AuthenticationUI);

var _ProjectBrowser = require('./components/ProjectBrowser');

var _ProjectBrowser2 = _interopRequireDefault(_ProjectBrowser);

var _SideBar = require('./components/SideBar');

var _SideBar2 = _interopRequireDefault(_SideBar);

var _Library = require('./components/library/Library');

var _Library2 = _interopRequireDefault(_Library);

var _StateInspector = require('./components/StateInspector/StateInspector');

var _StateInspector2 = _interopRequireDefault(_StateInspector);

var _Stage = require('./components/Stage');

var _Stage2 = _interopRequireDefault(_Stage);

var _Timeline = require('./components/Timeline');

var _Timeline2 = _interopRequireDefault(_Timeline);

var _Toast = require('./components/notifications/Toast');

var _Toast2 = _interopRequireDefault(_Toast);

var _Tour = require('./components/Tour/Tour');

var _Tour2 = _interopRequireDefault(_Tour);

var _AutoUpdater = require('./components/AutoUpdater');

var _AutoUpdater2 = _interopRequireDefault(_AutoUpdater);

var _client = require('haiku-sdk-creator/lib/envoy/client');

var _client2 = _interopRequireDefault(_client);

var _exporter = require('haiku-sdk-creator/lib/exporter');

var _glass = require('haiku-sdk-creator/lib/glass');

var _activityMonitor = require('../utils/activityMonitor.js');

var _activityMonitor2 = _interopRequireDefault(_activityMonitor);

var _dndHelpers = require('haiku-serialization/src/utils/dndHelpers');

var _HaikuHomeDir = require('haiku-serialization/src/utils/HaikuHomeDir');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var pkg = require('./../../package.json');

var mixpanel = require('haiku-serialization/src/utils/Mixpanel');

var electron = require('electron');
var remote = electron.remote;
var dialog = remote.dialog;

var ipcRenderer = electron.ipcRenderer;
var clipboard = electron.clipboard;

var webFrame = electron.webFrame;
if (webFrame) {
  if (webFrame.setZoomLevelLimits) webFrame.setZoomLevelLimits(1, 1);
  if (webFrame.setLayoutZoomLevelLimits) webFrame.setLayoutZoomLevelLimits(0, 0);
}

var Creator = function (_React$Component) {
  _inherits(Creator, _React$Component);

  function Creator(props) {
    _classCallCheck(this, Creator);

    var _this = _possibleConstructorReturn(this, (Creator.__proto__ || Object.getPrototypeOf(Creator)).call(this, props));

    _this.authenticateUser = _this.authenticateUser.bind(_this);
    _this.authenticationComplete = _this.authenticationComplete.bind(_this);
    _this.loadProjects = _this.loadProjects.bind(_this);
    _this.launchProject = _this.launchProject.bind(_this);
    _this.removeNotice = _this.removeNotice.bind(_this);
    _this.createNotice = _this.createNotice.bind(_this);
    _this.renderNotifications = _this.renderNotifications.bind(_this);
    _this.receiveProjectInfo = _this.receiveProjectInfo.bind(_this);
    _this.handleFindElementCoordinates = _this.handleFindElementCoordinates.bind(_this);
    _this.handleFindWebviewCoordinates = _this.handleFindWebviewCoordinates.bind(_this);
    _this.onAutoUpdateCheckComplete = _this.onAutoUpdateCheckComplete.bind(_this);
    _this.layout = new _eventEmitter2.default();
    _this.activityMonitor = new _activityMonitor2.default(window, _this.onActivityReport.bind(_this));

    _this.state = {
      error: null,
      projectFolder: _this.props.folder,
      applicationImage: null,
      projectObject: null,
      projectName: null,
      dashboardVisible: !_this.props.folder,
      readyForAuth: false,
      isUserAuthenticated: false,
      username: null,
      password: null,
      notices: [],
      softwareVersion: pkg.version,
      didPlumbingNoticeCrash: false,
      activeNav: 'library',
      projectsList: [],
      updater: {
        shouldCheck: true,
        shouldRunOnBackground: true,
        shouldSkipOptIn: true
      }
    };

    var win = remote.getCurrentWindow();

    if (process.env.DEV === '1') {
      win.openDevTools();
    }

    document.addEventListener('mousemove', function (nativeEvent) {
      _this._lastMouseX = nativeEvent.clientX;
      _this._lastMouseY = nativeEvent.clientY;
    });
    document.addEventListener('drag', function (nativeEvent) {
      // When the drag ends, for some reason the position goes to 0, so hack this...
      if (nativeEvent.clientX > 0 && nativeEvent.clientY > 0) {
        _this._lastMouseX = nativeEvent.clientX;
        _this._lastMouseY = nativeEvent.clientY;
      }
    });

    var combokeys = new _combokeys2.default(document.documentElement);

    if (process.env.NODE_ENV !== 'production') {
      combokeys.bind('command+option+i', _lodash2.default.debounce(function () {
        _this.props.websocket.send({ method: 'toggleDevTools', params: [_this.state.projectFolder] });
      }, 500, { leading: true }));
    }

    combokeys.bind('command+option+0', _lodash2.default.debounce(function () {
      _this.dumpSystemInfo();
    }, 500, { leading: true }));

    // NOTE: The TopMenu automatically binds the below keyboard shortcuts/accelerators
    ipcRenderer.on('global-menu:zoom-in', function () {
      _this.props.websocket.send({ type: 'broadcast', name: 'view:zoom-in' });
    });
    ipcRenderer.on('global-menu:zoom-out', function () {
      _this.props.websocket.send({ type: 'broadcast', name: 'view:zoom-out' });
    });
    ipcRenderer.on('global-menu:open-terminal', _lodash2.default.debounce(function () {
      _this.openTerminal(_this.state.projectFolder);
    }, 500, { leading: true }));
    ipcRenderer.on('global-menu:undo', _lodash2.default.debounce(function () {
      _this.props.websocket.send({ method: 'gitUndo', params: [_this.state.projectFolder, { type: 'global' }] });
    }, 500, { leading: true }));
    ipcRenderer.on('global-menu:redo', _lodash2.default.debounce(function () {
      _this.props.websocket.send({ method: 'gitRedo', params: [_this.state.projectFolder, { type: 'global' }] });
    }, 500, { leading: true }));
    ipcRenderer.on('global-menu:check-updates', function () {
      _this.setState({
        updater: {
          shouldCheck: true,
          shouldRunOnBackground: false,
          shouldSkipOptIn: true
        }
      });
    });

    window.addEventListener('dragover', _dndHelpers.preventDefaultDrag, false);
    window.addEventListener('drop', _dndHelpers.linkExternalAssetsOnDrop.bind(_this), false);
    return _this;
  }

  _createClass(Creator, [{
    key: 'openTerminal',
    value: function openTerminal(folder) {
      try {
        _child_process2.default.execSync('open -b com.apple.terminal ' + JSON.stringify(folder) + ' || true');
      } catch (exception) {
        console.error(exception);
      }
    }
  }, {
    key: 'dumpSystemInfo',
    value: function dumpSystemInfo() {
      var timestamp = Date.now();
      var dumpdir = _path2.default.join(_HaikuHomeDir.HOMEDIR_PATH, 'dumps', 'dump-' + timestamp);
      _child_process2.default.execSync('mkdir -p ' + JSON.stringify(dumpdir));
      _fs2.default.writeFileSync(_path2.default.join(dumpdir, 'argv'), JSON.stringify(process.argv, null, 2));
      _fs2.default.writeFileSync(_path2.default.join(dumpdir, 'env'), JSON.stringify(process.env, null, 2));
      if (_fs2.default.existsSync(_path2.default.join(_HaikuHomeDir.HOMEDIR_LOGS_PATH, 'haiku-debug.log'))) {
        _fs2.default.writeFileSync(_path2.default.join(dumpdir, 'log'), _fs2.default.readFileSync(_path2.default.join(_HaikuHomeDir.HOMEDIR_LOGS_PATH, 'haiku-debug.log')).toString());
      }
      _fs2.default.writeFileSync(_path2.default.join(dumpdir, 'info'), JSON.stringify({
        activeFolder: this.state.projectFolder,
        reactState: this.state,
        __filename: __filename,
        __dirname: __dirname
      }, null, 2));
      if (this.state.projectFolder) {
        // The project folder itself will contain git logs and other goodies we mgiht want to look at
        _child_process2.default.execSync('tar -zcvf ' + JSON.stringify(_path2.default.join(dumpdir, 'project.tar.gz')) + ' ' + JSON.stringify(this.state.projectFolder));
      }
      // For convenience, zip up the entire dump folder...
      _child_process2.default.execSync('tar -zcvf ' + JSON.stringify(_path2.default.join(_os2.default.homedir(), 'haiku-dump-' + timestamp + '.tar.gz')) + ' ' + JSON.stringify(dumpdir));
    }
  }, {
    key: 'toggleDevTools',
    value: function toggleDevTools() {
      var win = remote.getCurrentWindow();
      if (win.isDevToolsOpened()) win.closeDevTools();else win.openDevTools();
      if (this.refs.stage) this.refs.stage.toggleDevTools();
      if (this.refs.timeline) this.refs.timeline.toggleDevTools();
    }
  }, {
    key: 'handleContentPaste',
    value: function handleContentPaste(maybePasteRequest) {
      var _this2 = this;

      var pastedText = clipboard.readText();
      if (!pastedText) return void 0;

      // The data on the clipboard might be serialized data, so try to parse it if that's the case
      // The main case we have now for serialized data is haiku elements copied from the stage
      var pastedData = void 0;
      try {
        pastedData = JSON.parse(pastedText);
      } catch (exception) {
        console.warn('[creator] unable to parse pasted data; it might be plain text');
        pastedData = pastedText;
      }

      if (Array.isArray(pastedData)) {
        // This looks like a Haiku element that has been copied from the stage
        if (pastedData[0] === 'application/haiku' && _typeof(pastedData[1]) === 'object') {
          var pastedElement = pastedData[1];

          // Command the views and master process to handle the element paste action
          // The 'pasteThing' action is intended to be able to handle multiple content types
          return this.props.websocket.request({ type: 'action', method: 'pasteThing', params: [this.state.projectFolder, pastedElement, maybePasteRequest || {}] }, function (error) {
            if (error) {
              console.error(error);
              return _this2.createNotice({
                type: 'warning',
                title: 'Uh oh!',
                message: 'We couldn\'t paste that. 😢 Please contact Haiku for support.',
                closeText: 'Okay',
                lightScheme: true
              });
            }
          });
        } else {
          // TODO: Handle other cases where the paste data was a serialized array
          console.warn('[creator] cannot paste this content type yet (array)');
        }
      } else {
        // An empty string is treated as the equivalent of nothing (don't display warning if nothing to instantiate)
        if (typeof pastedData === 'string' && pastedData.length > 0) {
          // TODO: Handle the case when plain text has been pasted - SVG, HTML, etc?
          console.warn('[creator] cannot paste this content type yet (unknown string)');
        }
      }
    }
  }, {
    key: 'componentWillMount',
    value: function componentWillMount() {
      var _this3 = this;

      this.props.websocket.on('broadcast', function (message) {
        switch (message.name) {
          case 'dev-tools:toggle':
            _this3.toggleDevTools();
            break;

          case 'current-pasteable:request-paste':
            console.info('[creator] current-pasteable:request-paste', message.data);
            return _this3.handleContentPaste(message.data);
        }
      });

      this.activityMonitor.startWatchers();

      this.envoy = new _client2.default({
        port: this.props.haiku.envoy.port,
        host: this.props.haiku.envoy.host,
        WebSocket: window.WebSocket
      });

      this.envoy.get(_exporter.EXPORTER_CHANNEL).then(function (exporterChannel) {
        ipcRenderer.on('global-menu:export', function (event, _ref) {
          var _ref2 = _slicedToArray(_ref, 1),
              format = _ref2[0];

          var extension = void 0;
          switch (format) {
            case _exporter.ExporterFormat.Bodymovin:
              extension = 'json';
              break;
            default:
              throw new Error('Unsupported format: ' + format);
          }

          dialog.showSaveDialog(undefined, {
            defaultPath: '*/' + _this3.state.projectName,
            filters: [{
              name: format,
              extensions: [extension]
            }]
          }, function (filename) {
            exporterChannel.save({ format: format, filename: filename });
          });
        });
      });

      this.envoy.get('tour').then(function (tourChannel) {
        _this3.tourChannel = tourChannel;

        tourChannel.on('tour:requestElementCoordinates', _this3.handleFindElementCoordinates);

        tourChannel.on('tour:requestWebviewCoordinates', _this3.handleFindWebviewCoordinates);

        ipcRenderer.on('global-menu:start-tour', function () {
          _this3.setDashboardVisibility(true);

          // Put it at the bottom of the event loop
          setTimeout(function () {
            tourChannel.start(true);
          });
        });

        window.addEventListener('resize', _lodash2.default.throttle(function () {
          // if (tourChannel.isTourActive()) {
          tourChannel.notifyScreenResize();
          // }
        }), 300);
      });

      this.envoy.get(_glass.GLASS_CHANNEL).then(function (glassChannel) {
        document.addEventListener('cut', glassChannel.cut);
        document.addEventListener('copy', glassChannel.copy);
      });

      document.addEventListener('paste', function (pasteEvent) {
        console.info('[creator] paste heard');
        var tagname = pasteEvent.target.tagName.toLowerCase();
        if (tagname === 'input' || tagname === 'textarea') {
          // Do nothing; let input fields and so-on be handled normally
        } else {
          // Otherwise, assume we might need to handle this paste event specially
          pasteEvent.preventDefault();
          _this3.handleContentPaste();
        }
      });

      this.props.websocket.on('method', function (method, params, cb) {
        console.info('[creator] method from plumbing:', method, params);
        // no-op; creator doesn't currently receive any methods from the other views, but we need this
        // callback to be called to allow the action chain in plumbing to proceed
        return cb();
      });

      this.props.websocket.on('open', function () {
        _this3.props.websocket.request({ method: 'isUserAuthenticated', params: [] }, function (error, authAnswer) {
          if (error) {
            console.error(error);
            return _this3.createNotice({
              type: 'error',
              title: 'Oh no!',
              message: 'We had a problem accessing your account. 😢 Please try closing and reopening the application. If you still see this message, contact Haiku for support.',
              closeText: 'Okay',
              lightScheme: true
            });
          }

          mixpanel.mergeToPayload({ distinct_id: authAnswer && authAnswer.username });
          mixpanel.haikuTrack('creator:opened');

          // Delay so the default startup screen doesn't just flash then go away
          setTimeout(function () {
            _this3.setState({
              readyForAuth: true,
              authToken: authAnswer && authAnswer.authToken,
              organizationName: authAnswer && authAnswer.organizationName,
              username: authAnswer && authAnswer.username,
              isUserAuthenticated: authAnswer && authAnswer.isAuthed
            });
            if (_this3.props.folder) {
              // Launch folder directly - i.e. allow a 'subl' like experience without having to go
              // through the projects index
              return _this3.launchFolder(null, _this3.props.folder, function (error) {
                if (error) {
                  console.error(error);
                  _this3.setState({ folderLoadingError: error });
                  return _this3.createNotice({
                    type: 'error',
                    title: 'Oh no!',
                    message: 'We were unable to open the folder. 😢 Please close and reopen the application and try again. If you still see this message, contact Haiku for support.',
                    closeText: 'Okay',
                    lightScheme: true
                  });
                }
              });
            }
          }, 1000);
        });
      });
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.tourChannel.off('tour:requestElementCoordinates', this.handleFindElementCoordinates);
      this.tourChannel.off('tour:requestWebviewCoordinates', this.handleFindWebviewCoordinates);
      this.activityMonitor.stopWatchers();
    }
  }, {
    key: 'handleFindElementCoordinates',
    value: function handleFindElementCoordinates(_ref3) {
      var selector = _ref3.selector,
          webview = _ref3.webview;

      if (webview !== 'creator') {
        return;
      }

      try {
        // TODO: find if there is a better solution to this scape hatch
        var element = document.querySelector(selector);

        var _element$getBoundingC = element.getBoundingClientRect(),
            top = _element$getBoundingC.top,
            left = _element$getBoundingC.left;

        this.tourChannel.receiveElementCoordinates('creator', { top: top, left: left });
      } catch (error) {
        console.error('[creator] error fetching ' + selector + ' in webview ' + webview);
      }
    }
  }, {
    key: 'handleFindWebviewCoordinates',
    value: function handleFindWebviewCoordinates() {
      this.tourChannel.receiveWebviewCoordinates('creator', { top: 0, left: 0 });
    }
  }, {
    key: 'handlePaneResize',
    value: function handlePaneResize() {
      // this.layout.emit('resize')
    }
  }, {
    key: 'renderNotifications',
    value: function renderNotifications(content, i) {
      return _react2.default.createElement(_Toast2.default, {
        toastType: content.type,
        toastTitle: content.title,
        toastMessage: content.message,
        closeText: content.closeText,
        key: i + content.title,
        myKey: i,
        removeNotice: this.removeNotice,
        lightScheme: content.lightScheme, __source: {
          fileName: _jsxFileName,
          lineNumber: 405
        },
        __self: this
      });
    }
  }, {
    key: 'setDashboardVisibility',
    value: function setDashboardVisibility(dashboardVisible) {
      this.setState({ dashboardVisible: dashboardVisible });
    }
  }, {
    key: 'switchActiveNav',
    value: function switchActiveNav(activeNav) {
      this.setState({ activeNav: activeNav });

      if (activeNav === 'state_inspector') {
        this.tourChannel.next();
      }
    }
  }, {
    key: 'authenticateUser',
    value: function authenticateUser(username, password, cb) {
      var _this4 = this;

      return this.props.websocket.request({ method: 'authenticateUser', params: [username, password] }, function (error, authAnswer) {
        if (error) return cb(error);
        mixpanel.mergeToPayload({ distinct_id: username });
        mixpanel.haikuTrack('creator:user-authenticated', { username: username });
        _this4.setState({
          username: username,
          password: password,
          authToken: authAnswer && authAnswer.authToken,
          organizationName: authAnswer && authAnswer.organizationName,
          isUserAuthenticated: authAnswer && authAnswer.isAuthed
        });
        return cb(null, authAnswer);
      });
    }
  }, {
    key: 'authenticationComplete',
    value: function authenticationComplete() {
      return this.setState({ isUserAuthenticated: true });
    }
  }, {
    key: 'receiveProjectInfo',
    value: function receiveProjectInfo(projectInfo) {
      // NO-OP
    }
  }, {
    key: 'loadProjects',
    value: function loadProjects(cb) {
      var _this5 = this;

      return this.props.websocket.request({ method: 'listProjects', params: [] }, function (error, projectsList) {
        if (error) return cb(error);
        _this5.setState({ projectsList: projectsList });
        ipcRenderer.send('renderer:projects-list-fetched', projectsList);
        return cb(null, projectsList);
      });
    }
  }, {
    key: 'launchProject',
    value: function launchProject(projectName, projectObject, cb) {
      var _this6 = this;

      projectObject = {
        skipContentCreation: true, // VERY IMPORTANT - if not set to true, we can end up in a situation where we overwrite freshly cloned content from the remote!
        projectsHome: projectObject.projectsHome,
        projectPath: projectObject.projectPath,
        organizationName: this.state.organizationName,
        authorName: this.state.username,
        projectName: projectName // Have to set this here, because we pass this whole object to StateTitleBar, which needs this to properly call saveProject
      };

      mixpanel.haikuTrack('creator:project:launching', {
        username: this.state.username,
        project: projectName,
        organization: this.state.organizationName
      });

      return this.props.websocket.request({ method: 'initializeProject', params: [projectName, projectObject, this.state.username, this.state.password] }, function (err, projectFolder) {
        if (err) return cb(err);

        return _this6.props.websocket.request({ method: 'startProject', params: [projectName, projectFolder] }, function (err, applicationImage) {
          if (err) return cb(err);

          // Assign, not merge, since we don't want to clobber any variables already set, like project name
          _lodash2.default.assign(projectObject, applicationImage.project);

          mixpanel.haikuTrack('creator:project:launched', {
            username: _this6.state.username,
            project: projectName,
            organization: _this6.state.organizationName
          });

          // Now hackily change some pointers so we're referring to the correct place
          _this6.props.websocket.folder = projectFolder; // Do not remove this necessary hack plz
          _this6.setState({ projectFolder: projectFolder, applicationImage: applicationImage, projectObject: projectObject, projectName: projectName, dashboardVisible: false });

          return cb();
        });
      });
    }
  }, {
    key: 'launchFolder',
    value: function launchFolder(maybeProjectName, projectFolder, cb) {
      mixpanel.haikuTrack('creator:folder:launching', {
        username: this.state.username,
        project: maybeProjectName
      });

      // The launchProject method handles the performFolderPointerChange
      return this.launchProject(maybeProjectName, { projectPath: projectFolder }, cb);
    }
  }, {
    key: 'removeNotice',
    value: function removeNotice(index, id) {
      var _this7 = this;

      var notices = this.state.notices;
      if (index !== undefined) {
        this.setState({
          notices: [].concat(_toConsumableArray(notices.slice(0, index)), _toConsumableArray(notices.slice(index + 1)))
        });
      } else if (id !== undefined) {
        // Hackaroo
        _lodash2.default.each(notices, function (notice, index) {
          if (notice.id === id) _this7.removeNotice(index);
        });
      }
    }
  }, {
    key: 'createNotice',
    value: function createNotice(notice) {
      var _this8 = this;

      /* Expects the object:
      { type: string (info, success, danger (or error), warning)
        title: string,
        message: string,
        closeText: string (optional, defaults to 'close')
        lightScheme: bool (optional, defaults to dark)
      } */

      notice.id = Math.random() + '';

      var notices = this.state.notices;
      var replacedExisting = false;

      notices.forEach(function (n, i) {
        if (n.message === notice.message) {
          notices.splice(i, 1);
          replacedExisting = true;
          _this8.setState({ notices: notices }, function () {
            notices.unshift(notice);
            _this8.setState({ notices: notices });
          });
        }
      });

      if (!replacedExisting) {
        notices.unshift(notice);
        this.setState({ notices: notices });
      }

      return notice;
    }
  }, {
    key: 'onLibraryDragEnd',
    value: function onLibraryDragEnd(dragEndNativeEvent, libraryItemInfo) {
      this.setState({ libraryItemDragging: null });
      if (libraryItemInfo && libraryItemInfo.preview) {
        this.refs.stage.handleDrop(libraryItemInfo, this._lastMouseX, this._lastMouseY);
      }
    }
  }, {
    key: 'onLibraryDragStart',
    value: function onLibraryDragStart(dragStartNativeEvent, libraryItemInfo) {
      this.setState({ libraryItemDragging: libraryItemInfo });
    }
  }, {
    key: 'onAutoUpdateCheckComplete',
    value: function onAutoUpdateCheckComplete() {
      this.setState({
        updater: Object.assign({}, this.state.updater, {
          shouldCheck: false
        })
      });
    }
  }, {
    key: 'onActivityReport',
    value: function onActivityReport(userWasActive) {
      if (userWasActive) {
        return this.props.websocket.request({ method: 'checkInkstoneUpdates', params: [{}] }, function (err) {
          console.log('[creator] ping to Inkstone for updates finished', err);
        });
      }

      this.setState({
        updater: {
          shouldCheck: true,
          shouldRunOnBackground: true,
          shouldSkipOptIn: false
        }
      });
    }
  }, {
    key: 'renderStartupDefaultScreen',
    value: function renderStartupDefaultScreen() {
      return _react2.default.createElement(
        'div',
        { style: { position: 'absolute', width: '100%', height: '100%' }, __source: {
            fileName: _jsxFileName,
            lineNumber: 600
          },
          __self: this
        },
        _react2.default.createElement(
          _reactAddonsCssTransitionGroup2.default,
          {
            transitionName: 'toast',
            transitionEnterTimeout: 500,
            transitionLeaveTimeout: 300, __source: {
              fileName: _jsxFileName,
              lineNumber: 601
            },
            __self: this
          },
          _react2.default.createElement(
            'div',
            { style: { position: 'absolute', right: 0, top: 0, width: 300 }, __source: {
                fileName: _jsxFileName,
                lineNumber: 605
              },
              __self: this
            },
            _lodash2.default.map(this.state.notices, this.renderNotifications)
          )
        ),
        _react2.default.createElement(
          'div',
          { style: { display: 'table', width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }, __source: {
              fileName: _jsxFileName,
              lineNumber: 609
            },
            __self: this
          },
          _react2.default.createElement(
            'div',
            { style: { display: 'table-cell', width: '100%', height: '100%', verticalAlign: 'middle', textAlign: 'center' }, __source: {
                fileName: _jsxFileName,
                lineNumber: 610
              },
              __self: this
            },
            _react2.default.createElement(
              'svg',
              { width: '170px', height: '221px', viewBox: '0 0 170 221', version: '1.1', __source: {
                  fileName: _jsxFileName,
                  lineNumber: 611
                },
                __self: this
              },
              _react2.default.createElement(
                'g',
                { id: 'Page-1', stroke: 'none', strokeWidth: '1', fill: 'none', fillRule: 'evenodd', __source: {
                    fileName: _jsxFileName,
                    lineNumber: 612
                  },
                  __self: this
                },
                _react2.default.createElement(
                  'g',
                  { id: 'Outlined', transform: 'translate(-211.000000, -114.000000)', fillRule: 'nonzero', fill: '#FAFCFD', __source: {
                      fileName: _jsxFileName,
                      lineNumber: 613
                    },
                    __self: this
                  },
                  _react2.default.createElement(
                    'g',
                    { id: 'outlined-logo', transform: 'translate(211.000000, 113.000000)', __source: {
                        fileName: _jsxFileName,
                        lineNumber: 614
                      },
                      __self: this
                    },
                    _react2.default.createElement('path', { d: 'M47.5,152.798823 L26.3823432,143.954676 C24.5993941,143.207971 23.7593524,141.157281 24.5060576,139.374332 C25.2527628,137.591383 27.3034527,136.751341 29.0864018,137.498046 L117.780058,174.64456 L120.990021,176.089074 C122.486814,176.762645 123.279304,178.358251 122.998698,179.903598 C122.999564,179.935626 123,179.967762 123,180 L123,205.639722 L138.510716,211.910011 L143.368421,213.873764 L162.833333,206.00497 L162.833333,16.2929025 L143,8.27517204 L122.833333,16.4276543 L122.833333,53.6013295 C122.834218,53.6466489 122.834215,53.6919015 122.833333,53.7370634 L122.833333,54 C122.833333,55.9329966 121.26633,57.5 119.333333,57.5 C119.28843,57.5 119.243724,57.4991544 119.19923,57.4974782 L53.307638,84.037149 C51.5146183,84.7593375 49.4756392,83.8912573 48.7534506,82.0982376 C48.0312621,80.3052179 48.8993423,78.2662388 50.692362,77.5440502 L115.833333,51.3067129 L115.833333,14.4974227 C115.833333,14.0143178 115.931213,13.5540739 116.108222,13.1354399 C116.374539,12.0941292 117.115326,11.1888449 118.188238,10.7551148 L141.684186,1.2567527 C142.091317,1.09152936 142.52959,1.00240467 142.975937,0.999164723 C143.47041,1.00240467 143.908683,1.09152936 144.315814,1.2567527 L167.811762,10.7551148 C169.522968,11.446879 170.389328,13.3381659 169.833333,15.0677068 L169.833333,208 C169.833333,208.826304 169.54699,209.585728 169.068118,210.184459 C168.693703,210.867378 168.090133,211.430224 167.311762,211.744885 L144.517645,220.959528 C143.332542,221.438613 142.038995,221.222397 141.089179,220.502712 L135.887192,218.399782 L119.461595,211.759647 C117.54629,211.739055 116,210.180032 116,208.259853 L116,208.07911 C115.998767,208.025708 115.998761,207.972178 116,207.918558 L116,181.518748 L114.991727,181.064589 L54.5,155.730447 L54.5,206.998273 C55.1341468,208.658256 54.4195315,210.512915 52.8796645,211.333333 C52.5545546,211.540709 52.192904,211.695869 51.8065294,211.786997 L29.7867375,220.650655 C28.8252535,221.478758 27.4457005,221.753221 26.1882379,221.244885 L20.3871921,218.899782 L3.30627783,211.994731 C1.46338189,211.894192 -2.60835995e-16,210.367992 0,208.5 L2.70894418e-14,14.4974227 C2.724245e-14,13.4016458 0.503560947,12.4234818 1.29189669,11.781717 C1.65171014,11.3416509 2.12405622,10.9831882 2.68823789,10.7551148 L26.1841862,1.2567527 C26.5913172,1.09152936 27.0295898,1.00240467 27.4759367,0.999164723 C27.9704102,1.00240467 28.4086828,1.09152936 28.8158138,1.2567527 L52.3117621,10.7551148 C54.1038627,11.479581 54.9693514,13.5196615 54.2448852,15.3117621 C53.520419,17.1038627 51.4803385,17.9693514 49.6882379,17.2448852 L27.5,8.27517204 L7,16.5624061 L7,205.937594 L23.0107164,212.410011 L27.2526995,214.124855 L47.5,205.974681 L47.5,152.798823 Z', id: 'Combined-Shape', __source: {
                        fileName: _jsxFileName,
                        lineNumber: 615
                      },
                      __self: this
                    }),
                    _react2.default.createElement('path', { d: 'M146.456827,63.0241849 C146.948603,64.7104724 146.105972,66.5336591 144.447305,67.2283149 L59.5468677,102.784908 L120.416575,128.27735 C122.199524,129.024055 123.039566,131.074745 122.292861,132.857694 C121.546156,134.640643 119.495466,135.480685 117.712517,134.733979 L50.4864131,106.579457 L29.3520293,115.43061 C27.5690802,116.177315 25.5183903,115.337273 24.7716851,113.554324 C24.02498,111.771375 24.8650216,109.720685 26.6479707,108.97398 L47.5,100.241079 L47.5,14.5 C47.5,12.5670034 49.0670034,11 51,11 C52.9329966,11 54.5,12.5670034 54.5,14.5 L54.5,97.3094548 L133.360257,64.2825098 L117.188238,57.7448852 C115.396137,57.020419 114.530649,54.9803385 115.255115,53.1882379 C115.979581,51.3961373 118.019661,50.5306486 119.811762,51.2551148 L139.5,59.2141897 L139.5,25.8602784 L135.887192,24.3997816 L118.188238,17.2448852 C116.396137,16.520419 115.530649,14.4803385 116.255115,12.6882379 C116.979581,10.8961373 119.019661,10.0306486 120.811762,10.7551148 L138.510716,17.9100112 L143.368421,19.8737641 L164.688238,11.2551148 C166.480339,10.5306486 168.520419,11.3961373 169.244885,13.1882379 C169.969351,14.9803385 169.103863,17.020419 167.311762,17.7448852 L146.5,26.1581508 L146.5,62.4728749 C146.5,62.6604574 146.485243,62.8445933 146.456827,63.0241849 Z', id: 'Combined-Shape', __source: {
                        fileName: _jsxFileName,
                        lineNumber: 616
                      },
                      __self: this
                    }),
                    _react2.default.createElement('path', { d: 'M139.5,96.3308069 L122.833333,103.310864 L122.833333,151.372799 C122.833333,153.305795 121.26633,154.872799 119.333333,154.872799 C118.535719,154.872799 117.80042,154.605994 117.211816,154.156763 L26.6479707,116.228315 C26.0976706,115.997847 25.637194,115.643159 25.2854714,115.210462 C24.5008258,114.56862 24,113.592797 24,112.5 L24,25.8602784 L20.3871921,24.3997816 L2.68823789,17.2448852 C0.896137258,16.520419 0.0306485589,14.4803385 0.75511477,12.6882379 C1.47958098,10.8961373 3.51966149,10.0306486 5.31176211,10.7551148 L23.0107164,17.9100112 L27.8684211,19.8737641 L49.1882379,11.2551148 C50.9803385,10.5306486 53.020419,11.3961373 53.7448852,13.1882379 C54.4693514,14.9803385 53.6038627,17.020419 51.8117621,17.7448852 L31,26.1581508 L31,110.461861 L115.833333,145.990351 L115.833333,106.242488 L84.2596616,119.465649 C82.4767125,120.212355 80.4260226,119.372313 79.6793174,117.589364 C78.9326123,115.806415 79.7726539,113.755725 81.555603,113.00902 L141.052151,88.0916622 C141.608974,87.717993 142.27903,87.5 143,87.5 C144.932997,87.5 146.5,89.0670034 146.5,91 L146.5,217.63048 C146.5,219.563477 144.932997,221.13048 143,221.13048 C141.067003,221.13048 139.5,219.563477 139.5,217.63048 L139.5,96.3308069 Z M31,141 L31,217.055237 C31,218.988234 29.4329966,220.555237 27.5,220.555237 C25.5670034,220.555237 24,218.988234 24,217.055237 L24,141 C24,139.067003 25.5670034,137.5 27.5,137.5 C29.4329966,137.5 31,139.067003 31,141 Z', id: 'Combined-Shape', __source: {
                        fileName: _jsxFileName,
                        lineNumber: 617
                      },
                      __self: this
                    })
                  )
                )
              )
            ),
            _react2.default.createElement('br', {
              __source: {
                fileName: _jsxFileName,
                lineNumber: 622
              },
              __self: this
            }),
            _react2.default.createElement(
              'span',
              { style: { color: '#FAFCFD', display: 'inline-block', width: '100%', height: 50, position: 'absolute', bottom: 50, left: 0 }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 623
                },
                __self: this
              },
              this.state.softwareVersion
            )
          )
        )
      );
    }
  }, {
    key: 'render',
    value: function render() {
      if (this.state.readyForAuth && (!this.state.isUserAuthenticated || !this.state.username)) {
        return _react2.default.createElement(
          _radium.StyleRoot,
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 633
            },
            __self: this
          },
          _react2.default.createElement(_AuthenticationUI2.default, Object.assign({
            onSubmit: this.authenticateUser,
            onSubmitSuccess: this.authenticationComplete
          }, this.props, {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 634
            },
            __self: this
          }))
        );
      }

      if (!this.state.isUserAuthenticated || !this.state.username) {
        return this.renderStartupDefaultScreen();
      }

      if (this.state.dashboardVisible) {
        return _react2.default.createElement(
          'div',
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 648
            },
            __self: this
          },
          _react2.default.createElement(_ProjectBrowser2.default, Object.assign({
            loadProjects: this.loadProjects,
            launchProject: this.launchProject,
            createNotice: this.createNotice,
            removeNotice: this.removeNotice,
            notices: this.state.notices,
            envoy: this.envoy
          }, this.props, {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 649
            },
            __self: this
          })),
          _react2.default.createElement(_Tour2.default, { projectsList: this.state.projectsList, envoy: this.envoy, startTourOnMount: true, __source: {
              fileName: _jsxFileName,
              lineNumber: 657
            },
            __self: this
          }),
          _react2.default.createElement(_AutoUpdater2.default, {
            onComplete: this.onAutoUpdateCheckComplete,
            check: this.state.updater.shouldCheck,
            skipOptIn: this.state.updater.shouldSkipOptIn,
            runOnBackground: this.state.updater.shouldRunOnBackground,
            __source: {
              fileName: _jsxFileName,
              lineNumber: 658
            },
            __self: this
          })
        );
      }

      if (!this.state.projectFolder) {
        return _react2.default.createElement(
          'div',
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 670
            },
            __self: this
          },
          _react2.default.createElement(_Tour2.default, { projectsList: this.state.projectsList, envoy: this.envoy, __source: {
              fileName: _jsxFileName,
              lineNumber: 671
            },
            __self: this
          }),
          _react2.default.createElement(_AutoUpdater2.default, {
            onComplete: this.onAutoUpdateCheckComplete,
            check: this.state.updater.shouldCheck,
            skipOptIn: this.state.updater.shouldSkipOptIn,
            runOnBackground: this.state.updater.shouldRunOnBackground,
            __source: {
              fileName: _jsxFileName,
              lineNumber: 672
            },
            __self: this
          }),
          _react2.default.createElement(_ProjectBrowser2.default, Object.assign({
            loadProjects: this.loadProjects,
            launchProject: this.launchProject,
            createNotice: this.createNotice,
            removeNotice: this.removeNotice,
            notices: this.state.notices,
            envoy: this.envoy
          }, this.props, {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 678
            },
            __self: this
          }))
        );
      }

      if (!this.state.applicationImage || this.state.folderLoadingError) {
        return _react2.default.createElement(
          'div',
          { style: { position: 'absolute', width: '100%', height: '100%' }, __source: {
              fileName: _jsxFileName,
              lineNumber: 692
            },
            __self: this
          },
          _react2.default.createElement(
            _reactAddonsCssTransitionGroup2.default,
            {
              transitionName: 'toast',
              transitionEnterTimeout: 500,
              transitionLeaveTimeout: 300, __source: {
                fileName: _jsxFileName,
                lineNumber: 693
              },
              __self: this
            },
            _react2.default.createElement(
              'div',
              { style: { position: 'absolute', right: 0, top: 0, width: 300 }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 697
                },
                __self: this
              },
              _lodash2.default.map(this.state.notices, this.renderNotifications)
            )
          ),
          _react2.default.createElement(
            'div',
            { style: { position: 'relative', width: '100%', height: '100%' }, __source: {
                fileName: _jsxFileName,
                lineNumber: 701
              },
              __self: this
            },
            _react2.default.createElement(
              'div',
              { style: { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 702
                },
                __self: this
              },
              _react2.default.createElement(
                'span',
                { style: { fontSize: 24, color: '#222' }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 703
                  },
                  __self: this
                },
                'Loading project...'
              )
            )
          )
        );
      }

      return _react2.default.createElement(
        'div',
        { style: { position: 'relative', width: '100%', height: '100%' }, __source: {
            fileName: _jsxFileName,
            lineNumber: 711
          },
          __self: this
        },
        _react2.default.createElement(_AutoUpdater2.default, {
          onComplete: this.onAutoUpdateCheckComplete,
          check: this.state.updater.shouldCheck,
          skipOptIn: this.state.updater.shouldSkipOptIn,
          runOnBackground: this.state.updater.shouldRunOnBackground,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 712
          },
          __self: this
        }),
        _react2.default.createElement(_Tour2.default, { projectsList: this.state.projectsList, envoy: this.envoy, __source: {
            fileName: _jsxFileName,
            lineNumber: 718
          },
          __self: this
        }),
        _react2.default.createElement(
          'div',
          { style: { position: 'absolute', width: '100%', height: '100%', top: 0, left: 0 }, __source: {
              fileName: _jsxFileName,
              lineNumber: 719
            },
            __self: this
          },
          _react2.default.createElement(
            'div',
            { className: 'layout-box', style: { overflow: 'visible' }, __source: {
                fileName: _jsxFileName,
                lineNumber: 720
              },
              __self: this
            },
            _react2.default.createElement(
              _reactAddonsCssTransitionGroup2.default,
              {
                transitionName: 'toast',
                transitionEnterTimeout: 500,
                transitionLeaveTimeout: 300, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 721
                },
                __self: this
              },
              _react2.default.createElement(
                'div',
                { style: { position: 'absolute', right: 0, top: 0, width: 300 }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 725
                  },
                  __self: this
                },
                _lodash2.default.map(this.state.notices, this.renderNotifications)
              )
            ),
            _react2.default.createElement(
              _reactSplitPane2.default,
              { onDragFinished: this.handlePaneResize.bind(this), split: 'horizontal', minSize: 300, defaultSize: this.props.height * 0.62, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 729
                },
                __self: this
              },
              _react2.default.createElement(
                'div',
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 730
                  },
                  __self: this
                },
                _react2.default.createElement(
                  _reactSplitPane2.default,
                  { onDragFinished: this.handlePaneResize.bind(this), split: 'vertical', minSize: 300, defaultSize: 300, __source: {
                      fileName: _jsxFileName,
                      lineNumber: 731
                    },
                    __self: this
                  },
                  _react2.default.createElement(
                    _SideBar2.default,
                    {
                      setDashboardVisibility: this.setDashboardVisibility.bind(this),
                      switchActiveNav: this.switchActiveNav.bind(this),
                      activeNav: this.state.activeNav, __source: {
                        fileName: _jsxFileName,
                        lineNumber: 732
                      },
                      __self: this
                    },
                    this.state.activeNav === 'library' ? _react2.default.createElement(_Library2.default, {
                      layout: this.layout,
                      folder: this.state.projectFolder,
                      haiku: this.props.haiku,
                      websocket: this.props.websocket,
                      tourChannel: this.tourChannel,
                      onDragEnd: this.onLibraryDragEnd.bind(this),
                      onDragStart: this.onLibraryDragStart.bind(this),
                      createNotice: this.createNotice,
                      removeNotice: this.removeNotice, __source: {
                        fileName: _jsxFileName,
                        lineNumber: 737
                      },
                      __self: this
                    }) : _react2.default.createElement(_StateInspector2.default, {
                      createNotice: this.createNotice,
                      removeNotice: this.removeNotice,
                      folder: this.state.projectFolder,
                      websocket: this.props.websocket,
                      tourChannel: this.tourChannel, __source: {
                        fileName: _jsxFileName,
                        lineNumber: 747
                      },
                      __self: this
                    })
                  ),
                  _react2.default.createElement(
                    'div',
                    { style: { position: 'relative', width: '100%', height: '100%' }, __source: {
                        fileName: _jsxFileName,
                        lineNumber: 755
                      },
                      __self: this
                    },
                    _react2.default.createElement(_Stage2.default, {
                      ref: 'stage',
                      folder: this.state.projectFolder,
                      envoy: this.envoy,
                      haiku: this.props.haiku,
                      websocket: this.props.websocket,
                      project: this.state.projectObject,
                      createNotice: this.createNotice,
                      removeNotice: this.removeNotice,
                      receiveProjectInfo: this.receiveProjectInfo,
                      organizationName: this.state.organizationName,
                      authToken: this.state.authToken,
                      username: this.state.username,
                      password: this.state.password, __source: {
                        fileName: _jsxFileName,
                        lineNumber: 756
                      },
                      __self: this
                    }),
                    this.state.libraryItemDragging ? _react2.default.createElement('div', { style: { width: '100%', height: '100%', backgroundColor: 'white', opacity: 0.01, position: 'absolute', top: 0, left: 0 }, __source: {
                        fileName: _jsxFileName,
                        lineNumber: 771
                      },
                      __self: this
                    }) : ''
                  )
                )
              ),
              _react2.default.createElement(_Timeline2.default, {
                ref: 'timeline',
                folder: this.state.projectFolder,
                envoy: this.envoy,
                haiku: this.props.haiku,
                createNotice: this.createNotice,
                removeNotice: this.removeNotice, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 776
                },
                __self: this
              })
            )
          )
        )
      );
    }
  }]);

  return Creator;
}(_react2.default.Component);

exports.default = Creator;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZWFjdC9DcmVhdG9yLmpzIl0sIm5hbWVzIjpbInBrZyIsInJlcXVpcmUiLCJtaXhwYW5lbCIsImVsZWN0cm9uIiwicmVtb3RlIiwiZGlhbG9nIiwiaXBjUmVuZGVyZXIiLCJjbGlwYm9hcmQiLCJ3ZWJGcmFtZSIsInNldFpvb21MZXZlbExpbWl0cyIsInNldExheW91dFpvb21MZXZlbExpbWl0cyIsIkNyZWF0b3IiLCJwcm9wcyIsImF1dGhlbnRpY2F0ZVVzZXIiLCJiaW5kIiwiYXV0aGVudGljYXRpb25Db21wbGV0ZSIsImxvYWRQcm9qZWN0cyIsImxhdW5jaFByb2plY3QiLCJyZW1vdmVOb3RpY2UiLCJjcmVhdGVOb3RpY2UiLCJyZW5kZXJOb3RpZmljYXRpb25zIiwicmVjZWl2ZVByb2plY3RJbmZvIiwiaGFuZGxlRmluZEVsZW1lbnRDb29yZGluYXRlcyIsImhhbmRsZUZpbmRXZWJ2aWV3Q29vcmRpbmF0ZXMiLCJvbkF1dG9VcGRhdGVDaGVja0NvbXBsZXRlIiwibGF5b3V0IiwiYWN0aXZpdHlNb25pdG9yIiwid2luZG93Iiwib25BY3Rpdml0eVJlcG9ydCIsInN0YXRlIiwiZXJyb3IiLCJwcm9qZWN0Rm9sZGVyIiwiZm9sZGVyIiwiYXBwbGljYXRpb25JbWFnZSIsInByb2plY3RPYmplY3QiLCJwcm9qZWN0TmFtZSIsImRhc2hib2FyZFZpc2libGUiLCJyZWFkeUZvckF1dGgiLCJpc1VzZXJBdXRoZW50aWNhdGVkIiwidXNlcm5hbWUiLCJwYXNzd29yZCIsIm5vdGljZXMiLCJzb2Z0d2FyZVZlcnNpb24iLCJ2ZXJzaW9uIiwiZGlkUGx1bWJpbmdOb3RpY2VDcmFzaCIsImFjdGl2ZU5hdiIsInByb2plY3RzTGlzdCIsInVwZGF0ZXIiLCJzaG91bGRDaGVjayIsInNob3VsZFJ1bk9uQmFja2dyb3VuZCIsInNob3VsZFNraXBPcHRJbiIsIndpbiIsImdldEN1cnJlbnRXaW5kb3ciLCJwcm9jZXNzIiwiZW52IiwiREVWIiwib3BlbkRldlRvb2xzIiwiZG9jdW1lbnQiLCJhZGRFdmVudExpc3RlbmVyIiwibmF0aXZlRXZlbnQiLCJfbGFzdE1vdXNlWCIsImNsaWVudFgiLCJfbGFzdE1vdXNlWSIsImNsaWVudFkiLCJjb21ib2tleXMiLCJkb2N1bWVudEVsZW1lbnQiLCJOT0RFX0VOViIsImRlYm91bmNlIiwid2Vic29ja2V0Iiwic2VuZCIsIm1ldGhvZCIsInBhcmFtcyIsImxlYWRpbmciLCJkdW1wU3lzdGVtSW5mbyIsIm9uIiwidHlwZSIsIm5hbWUiLCJvcGVuVGVybWluYWwiLCJzZXRTdGF0ZSIsImV4ZWNTeW5jIiwiSlNPTiIsInN0cmluZ2lmeSIsImV4Y2VwdGlvbiIsImNvbnNvbGUiLCJ0aW1lc3RhbXAiLCJEYXRlIiwibm93IiwiZHVtcGRpciIsImpvaW4iLCJ3cml0ZUZpbGVTeW5jIiwiYXJndiIsImV4aXN0c1N5bmMiLCJyZWFkRmlsZVN5bmMiLCJ0b1N0cmluZyIsImFjdGl2ZUZvbGRlciIsInJlYWN0U3RhdGUiLCJfX2ZpbGVuYW1lIiwiX19kaXJuYW1lIiwiaG9tZWRpciIsImlzRGV2VG9vbHNPcGVuZWQiLCJjbG9zZURldlRvb2xzIiwicmVmcyIsInN0YWdlIiwidG9nZ2xlRGV2VG9vbHMiLCJ0aW1lbGluZSIsIm1heWJlUGFzdGVSZXF1ZXN0IiwicGFzdGVkVGV4dCIsInJlYWRUZXh0IiwicGFzdGVkRGF0YSIsInBhcnNlIiwid2FybiIsIkFycmF5IiwiaXNBcnJheSIsInBhc3RlZEVsZW1lbnQiLCJyZXF1ZXN0IiwidGl0bGUiLCJtZXNzYWdlIiwiY2xvc2VUZXh0IiwibGlnaHRTY2hlbWUiLCJsZW5ndGgiLCJpbmZvIiwiZGF0YSIsImhhbmRsZUNvbnRlbnRQYXN0ZSIsInN0YXJ0V2F0Y2hlcnMiLCJlbnZveSIsInBvcnQiLCJoYWlrdSIsImhvc3QiLCJXZWJTb2NrZXQiLCJnZXQiLCJ0aGVuIiwiZXhwb3J0ZXJDaGFubmVsIiwiZXZlbnQiLCJmb3JtYXQiLCJleHRlbnNpb24iLCJCb2R5bW92aW4iLCJFcnJvciIsInNob3dTYXZlRGlhbG9nIiwidW5kZWZpbmVkIiwiZGVmYXVsdFBhdGgiLCJmaWx0ZXJzIiwiZXh0ZW5zaW9ucyIsImZpbGVuYW1lIiwic2F2ZSIsInRvdXJDaGFubmVsIiwic2V0RGFzaGJvYXJkVmlzaWJpbGl0eSIsInNldFRpbWVvdXQiLCJzdGFydCIsInRocm90dGxlIiwibm90aWZ5U2NyZWVuUmVzaXplIiwiZ2xhc3NDaGFubmVsIiwiY3V0IiwiY29weSIsInBhc3RlRXZlbnQiLCJ0YWduYW1lIiwidGFyZ2V0IiwidGFnTmFtZSIsInRvTG93ZXJDYXNlIiwicHJldmVudERlZmF1bHQiLCJjYiIsImF1dGhBbnN3ZXIiLCJtZXJnZVRvUGF5bG9hZCIsImRpc3RpbmN0X2lkIiwiaGFpa3VUcmFjayIsImF1dGhUb2tlbiIsIm9yZ2FuaXphdGlvbk5hbWUiLCJpc0F1dGhlZCIsImxhdW5jaEZvbGRlciIsImZvbGRlckxvYWRpbmdFcnJvciIsIm9mZiIsInN0b3BXYXRjaGVycyIsInNlbGVjdG9yIiwid2VidmlldyIsImVsZW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwidG9wIiwibGVmdCIsInJlY2VpdmVFbGVtZW50Q29vcmRpbmF0ZXMiLCJyZWNlaXZlV2Vidmlld0Nvb3JkaW5hdGVzIiwiY29udGVudCIsImkiLCJuZXh0IiwicHJvamVjdEluZm8iLCJza2lwQ29udGVudENyZWF0aW9uIiwicHJvamVjdHNIb21lIiwicHJvamVjdFBhdGgiLCJhdXRob3JOYW1lIiwicHJvamVjdCIsIm9yZ2FuaXphdGlvbiIsImVyciIsImFzc2lnbiIsIm1heWJlUHJvamVjdE5hbWUiLCJpbmRleCIsImlkIiwic2xpY2UiLCJlYWNoIiwibm90aWNlIiwiTWF0aCIsInJhbmRvbSIsInJlcGxhY2VkRXhpc3RpbmciLCJmb3JFYWNoIiwibiIsInNwbGljZSIsInVuc2hpZnQiLCJkcmFnRW5kTmF0aXZlRXZlbnQiLCJsaWJyYXJ5SXRlbUluZm8iLCJsaWJyYXJ5SXRlbURyYWdnaW5nIiwicHJldmlldyIsImhhbmRsZURyb3AiLCJkcmFnU3RhcnROYXRpdmVFdmVudCIsInVzZXJXYXNBY3RpdmUiLCJsb2ciLCJwb3NpdGlvbiIsIndpZHRoIiwiaGVpZ2h0IiwicmlnaHQiLCJtYXAiLCJkaXNwbGF5IiwidmVydGljYWxBbGlnbiIsInRleHRBbGlnbiIsImNvbG9yIiwiYm90dG9tIiwicmVuZGVyU3RhcnR1cERlZmF1bHRTY3JlZW4iLCJ0cmFuc2Zvcm0iLCJmb250U2l6ZSIsIm92ZXJmbG93IiwiaGFuZGxlUGFuZVJlc2l6ZSIsInN3aXRjaEFjdGl2ZU5hdiIsIm9uTGlicmFyeURyYWdFbmQiLCJvbkxpYnJhcnlEcmFnU3RhcnQiLCJiYWNrZ3JvdW5kQ29sb3IiLCJvcGFjaXR5IiwiQ29tcG9uZW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7QUFDQTs7QUFJQTs7Ozs7Ozs7Ozs7O0FBS0EsSUFBSUEsTUFBTUMsUUFBUSxzQkFBUixDQUFWOztBQUVBLElBQUlDLFdBQVdELFFBQVEsd0NBQVIsQ0FBZjs7QUFFQSxJQUFNRSxXQUFXRixRQUFRLFVBQVIsQ0FBakI7QUFDQSxJQUFNRyxTQUFTRCxTQUFTQyxNQUF4QjtJQUNPQyxNLEdBQVVELE0sQ0FBVkMsTTs7QUFDUCxJQUFNQyxjQUFjSCxTQUFTRyxXQUE3QjtBQUNBLElBQU1DLFlBQVlKLFNBQVNJLFNBQTNCOztBQUVBLElBQUlDLFdBQVdMLFNBQVNLLFFBQXhCO0FBQ0EsSUFBSUEsUUFBSixFQUFjO0FBQ1osTUFBSUEsU0FBU0Msa0JBQWIsRUFBaUNELFNBQVNDLGtCQUFULENBQTRC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LEtBQUwsQ0FBV3dJLGdCQVYvQjtBQVdFLGlDQUFXLEtBQUt4SSxLQUFMLENBQVd1SSxTQVh4QjtBQVlFLGdDQUFVLEtBQUt2SSxLQUFMLENBQVdVLFFBWnZCO0FBYUUsZ0NBQVUsS0FBS1YsS0FBTCxDQUFXVyxRQWJ2QjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsc0JBREY7QUFlSSx5QkFBS1gsS0FBTCxDQUFXa0wsbUJBQVosR0FDRyx1Q0FBSyxPQUFPLEVBQUVPLE9BQU8sTUFBVCxFQUFpQkMsUUFBUSxNQUF6QixFQUFpQ2dCLGlCQUFpQixPQUFsRCxFQUEyREMsU0FBUyxJQUFwRSxFQUEwRW5CLFVBQVUsVUFBcEYsRUFBZ0dyQyxLQUFLLENBQXJHLEVBQXdHQyxNQUFNLENBQTlHLEVBQVo7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLHNCQURILEdBRUc7QUFqQk47QUF4QkY7QUFERixlQURGO0FBK0NFO0FBQ0UscUJBQUksVUFETjtBQUVFLHdCQUFRLEtBQUtwSixLQUFMLENBQVdFLGFBRnJCO0FBR0UsdUJBQU8sS0FBSzZGLEtBSGQ7QUFJRSx1QkFBTyxLQUFLaEgsS0FBTCxDQUFXa0gsS0FKcEI7QUFLRSw4QkFBYyxLQUFLM0csWUFMckI7QUFNRSw4QkFBYyxLQUFLRCxZQU5yQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUEvQ0Y7QUFURjtBQURGO0FBUkYsT0FERjtBQThFRDs7OztFQWp1QmtDLGdCQUFNdU4sUzs7a0JBQXRCOU4sTyIsImZpbGUiOiJDcmVhdG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgU3R5bGVSb290IH0gZnJvbSAncmFkaXVtJ1xuaW1wb3J0IFNwbGl0UGFuZSBmcm9tICdyZWFjdC1zcGxpdC1wYW5lJ1xuaW1wb3J0IFJlYWN0Q1NTVHJhbnNpdGlvbkdyb3VwIGZyb20gJ3JlYWN0LWFkZG9ucy1jc3MtdHJhbnNpdGlvbi1ncm91cCdcbmltcG9ydCBsb2Rhc2ggZnJvbSAnbG9kYXNoJ1xuaW1wb3J0IENvbWJva2V5cyBmcm9tICdjb21ib2tleXMnXG5pbXBvcnQgRXZlbnRFbWl0dGVyIGZyb20gJ2V2ZW50LWVtaXR0ZXInXG5pbXBvcnQgY3AgZnJvbSAnY2hpbGRfcHJvY2VzcydcbmltcG9ydCBvcyBmcm9tICdvcydcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQgZnMgZnJvbSAnZnMnXG5pbXBvcnQgQXV0aGVudGljYXRpb25VSSBmcm9tICcuL2NvbXBvbmVudHMvQXV0aGVudGljYXRpb25VSSdcbmltcG9ydCBQcm9qZWN0QnJvd3NlciBmcm9tICcuL2NvbXBvbmVudHMvUHJvamVjdEJyb3dzZXInXG5pbXBvcnQgU2lkZUJhciBmcm9tICcuL2NvbXBvbmVudHMvU2lkZUJhcidcbmltcG9ydCBMaWJyYXJ5IGZyb20gJy4vY29tcG9uZW50cy9saWJyYXJ5L0xpYnJhcnknXG5pbXBvcnQgU3RhdGVJbnNwZWN0b3IgZnJvbSAnLi9jb21wb25lbnRzL1N0YXRlSW5zcGVjdG9yL1N0YXRlSW5zcGVjdG9yJ1xuaW1wb3J0IFN0YWdlIGZyb20gJy4vY29tcG9uZW50cy9TdGFnZSdcbmltcG9ydCBUaW1lbGluZSBmcm9tICcuL2NvbXBvbmVudHMvVGltZWxpbmUnXG5pbXBvcnQgVG9hc3QgZnJvbSAnLi9jb21wb25lbnRzL25vdGlmaWNhdGlvbnMvVG9hc3QnXG5pbXBvcnQgVG91ciBmcm9tICcuL2NvbXBvbmVudHMvVG91ci9Ub3VyJ1xuaW1wb3J0IEF1dG9VcGRhdGVyIGZyb20gJy4vY29tcG9uZW50cy9BdXRvVXBkYXRlcidcbmltcG9ydCBFbnZveUNsaWVudCBmcm9tICdoYWlrdS1zZGstY3JlYXRvci9saWIvZW52b3kvY2xpZW50J1xuaW1wb3J0IHsgRVhQT1JURVJfQ0hBTk5FTCwgRXhwb3J0ZXJGb3JtYXQgfSBmcm9tICdoYWlrdS1zZGstY3JlYXRvci9saWIvZXhwb3J0ZXInXG5pbXBvcnQgeyBHTEFTU19DSEFOTkVMIH0gZnJvbSAnaGFpa3Utc2RrLWNyZWF0b3IvbGliL2dsYXNzJ1xuaW1wb3J0IEFjdGl2aXR5TW9uaXRvciBmcm9tICcuLi91dGlscy9hY3Rpdml0eU1vbml0b3IuanMnXG5pbXBvcnQge1xuICBsaW5rRXh0ZXJuYWxBc3NldHNPbkRyb3AsXG4gIHByZXZlbnREZWZhdWx0RHJhZ1xufSBmcm9tICdoYWlrdS1zZXJpYWxpemF0aW9uL3NyYy91dGlscy9kbmRIZWxwZXJzJ1xuaW1wb3J0IHtcbiAgSE9NRURJUl9QQVRILFxuICBIT01FRElSX0xPR1NfUEFUSFxufSBmcm9tICdoYWlrdS1zZXJpYWxpemF0aW9uL3NyYy91dGlscy9IYWlrdUhvbWVEaXInXG5cbnZhciBwa2cgPSByZXF1aXJlKCcuLy4uLy4uL3BhY2thZ2UuanNvbicpXG5cbnZhciBtaXhwYW5lbCA9IHJlcXVpcmUoJ2hhaWt1LXNlcmlhbGl6YXRpb24vc3JjL3V0aWxzL01peHBhbmVsJylcblxuY29uc3QgZWxlY3Ryb24gPSByZXF1aXJlKCdlbGVjdHJvbicpXG5jb25zdCByZW1vdGUgPSBlbGVjdHJvbi5yZW1vdGVcbmNvbnN0IHtkaWFsb2d9ID0gcmVtb3RlXG5jb25zdCBpcGNSZW5kZXJlciA9IGVsZWN0cm9uLmlwY1JlbmRlcmVyXG5jb25zdCBjbGlwYm9hcmQgPSBlbGVjdHJvbi5jbGlwYm9hcmRcblxudmFyIHdlYkZyYW1lID0gZWxlY3Ryb24ud2ViRnJhbWVcbmlmICh3ZWJGcmFtZSkge1xuICBpZiAod2ViRnJhbWUuc2V0Wm9vbUxldmVsTGltaXRzKSB3ZWJGcmFtZS5zZXRab29tTGV2ZWxMaW1pdHMoMSwgMSlcbiAgaWYgKHdlYkZyYW1lLnNldExheW91dFpvb21MZXZlbExpbWl0cykgd2ViRnJhbWUuc2V0TGF5b3V0Wm9vbUxldmVsTGltaXRzKDAsIDApXG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENyZWF0b3IgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3RvciAocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcylcbiAgICB0aGlzLmF1dGhlbnRpY2F0ZVVzZXIgPSB0aGlzLmF1dGhlbnRpY2F0ZVVzZXIuYmluZCh0aGlzKVxuICAgIHRoaXMuYXV0aGVudGljYXRpb25Db21wbGV0ZSA9IHRoaXMuYXV0aGVudGljYXRpb25Db21wbGV0ZS5iaW5kKHRoaXMpXG4gICAgdGhpcy5sb2FkUHJvamVjdHMgPSB0aGlzLmxvYWRQcm9qZWN0cy5iaW5kKHRoaXMpXG4gICAgdGhpcy5sYXVuY2hQcm9qZWN0ID0gdGhpcy5sYXVuY2hQcm9qZWN0LmJpbmQodGhpcylcbiAgICB0aGlzLnJlbW92ZU5vdGljZSA9IHRoaXMucmVtb3ZlTm90aWNlLmJpbmQodGhpcylcbiAgICB0aGlzLmNyZWF0ZU5vdGljZSA9IHRoaXMuY3JlYXRlTm90aWNlLmJpbmQodGhpcylcbiAgICB0aGlzLnJlbmRlck5vdGlmaWNhdGlvbnMgPSB0aGlzLnJlbmRlck5vdGlmaWNhdGlvbnMuYmluZCh0aGlzKVxuICAgIHRoaXMucmVjZWl2ZVByb2plY3RJbmZvID0gdGhpcy5yZWNlaXZlUHJvamVjdEluZm8uYmluZCh0aGlzKVxuICAgIHRoaXMuaGFuZGxlRmluZEVsZW1lbnRDb29yZGluYXRlcyA9IHRoaXMuaGFuZGxlRmluZEVsZW1lbnRDb29yZGluYXRlcy5iaW5kKHRoaXMpXG4gICAgdGhpcy5oYW5kbGVGaW5kV2Vidmlld0Nvb3JkaW5hdGVzID0gdGhpcy5oYW5kbGVGaW5kV2Vidmlld0Nvb3JkaW5hdGVzLmJpbmQodGhpcylcbiAgICB0aGlzLm9uQXV0b1VwZGF0ZUNoZWNrQ29tcGxldGUgPSB0aGlzLm9uQXV0b1VwZGF0ZUNoZWNrQ29tcGxldGUuYmluZCh0aGlzKVxuICAgIHRoaXMubGF5b3V0ID0gbmV3IEV2ZW50RW1pdHRlcigpXG4gICAgdGhpcy5hY3Rpdml0eU1vbml0b3IgPSBuZXcgQWN0aXZpdHlNb25pdG9yKHdpbmRvdywgdGhpcy5vbkFjdGl2aXR5UmVwb3J0LmJpbmQodGhpcykpXG5cbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgZXJyb3I6IG51bGwsXG4gICAgICBwcm9qZWN0Rm9sZGVyOiB0aGlzLnByb3BzLmZvbGRlcixcbiAgICAgIGFwcGxpY2F0aW9uSW1hZ2U6IG51bGwsXG4gICAgICBwcm9qZWN0T2JqZWN0OiBudWxsLFxuICAgICAgcHJvamVjdE5hbWU6IG51bGwsXG4gICAgICBkYXNoYm9hcmRWaXNpYmxlOiAhdGhpcy5wcm9wcy5mb2xkZXIsXG4gICAgICByZWFkeUZvckF1dGg6IGZhbHNlLFxuICAgICAgaXNVc2VyQXV0aGVudGljYXRlZDogZmFsc2UsXG4gICAgICB1c2VybmFtZTogbnVsbCxcbiAgICAgIHBhc3N3b3JkOiBudWxsLFxuICAgICAgbm90aWNlczogW10sXG4gICAgICBzb2Z0d2FyZVZlcnNpb246IHBrZy52ZXJzaW9uLFxuICAgICAgZGlkUGx1bWJpbmdOb3RpY2VDcmFzaDogZmFsc2UsXG4gICAgICBhY3RpdmVOYXY6ICdsaWJyYXJ5JyxcbiAgICAgIHByb2plY3RzTGlzdDogW10sXG4gICAgICB1cGRhdGVyOiB7XG4gICAgICAgIHNob3VsZENoZWNrOiB0cnVlLFxuICAgICAgICBzaG91bGRSdW5PbkJhY2tncm91bmQ6IHRydWUsXG4gICAgICAgIHNob3VsZFNraXBPcHRJbjogdHJ1ZVxuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IHdpbiA9IHJlbW90ZS5nZXRDdXJyZW50V2luZG93KClcblxuICAgIGlmIChwcm9jZXNzLmVudi5ERVYgPT09ICcxJykge1xuICAgICAgd2luLm9wZW5EZXZUb29scygpXG4gICAgfVxuXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgKG5hdGl2ZUV2ZW50KSA9PiB7XG4gICAgICB0aGlzLl9sYXN0TW91c2VYID0gbmF0aXZlRXZlbnQuY2xpZW50WFxuICAgICAgdGhpcy5fbGFzdE1vdXNlWSA9IG5hdGl2ZUV2ZW50LmNsaWVudFlcbiAgICB9KVxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWcnLCAobmF0aXZlRXZlbnQpID0+IHtcbiAgICAgIC8vIFdoZW4gdGhlIGRyYWcgZW5kcywgZm9yIHNvbWUgcmVhc29uIHRoZSBwb3NpdGlvbiBnb2VzIHRvIDAsIHNvIGhhY2sgdGhpcy4uLlxuICAgICAgaWYgKG5hdGl2ZUV2ZW50LmNsaWVudFggPiAwICYmIG5hdGl2ZUV2ZW50LmNsaWVudFkgPiAwKSB7XG4gICAgICAgIHRoaXMuX2xhc3RNb3VzZVggPSBuYXRpdmVFdmVudC5jbGllbnRYXG4gICAgICAgIHRoaXMuX2xhc3RNb3VzZVkgPSBuYXRpdmVFdmVudC5jbGllbnRZXG4gICAgICB9XG4gICAgfSlcblxuICAgIGNvbnN0IGNvbWJva2V5cyA9IG5ldyBDb21ib2tleXMoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KVxuXG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgIGNvbWJva2V5cy5iaW5kKCdjb21tYW5kK29wdGlvbitpJywgbG9kYXNoLmRlYm91bmNlKCgpID0+IHtcbiAgICAgICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQuc2VuZCh7IG1ldGhvZDogJ3RvZ2dsZURldlRvb2xzJywgcGFyYW1zOiBbdGhpcy5zdGF0ZS5wcm9qZWN0Rm9sZGVyXSB9KVxuICAgICAgfSwgNTAwLCB7IGxlYWRpbmc6IHRydWUgfSkpXG4gICAgfVxuXG4gICAgY29tYm9rZXlzLmJpbmQoJ2NvbW1hbmQrb3B0aW9uKzAnLCBsb2Rhc2guZGVib3VuY2UoKCkgPT4ge1xuICAgICAgdGhpcy5kdW1wU3lzdGVtSW5mbygpXG4gICAgfSwgNTAwLCB7IGxlYWRpbmc6IHRydWUgfSkpXG5cbiAgICAvLyBOT1RFOiBUaGUgVG9wTWVudSBhdXRvbWF0aWNhbGx5IGJpbmRzIHRoZSBiZWxvdyBrZXlib2FyZCBzaG9ydGN1dHMvYWNjZWxlcmF0b3JzXG4gICAgaXBjUmVuZGVyZXIub24oJ2dsb2JhbC1tZW51Onpvb20taW4nLCAoKSA9PiB7XG4gICAgICB0aGlzLnByb3BzLndlYnNvY2tldC5zZW5kKHsgdHlwZTogJ2Jyb2FkY2FzdCcsIG5hbWU6ICd2aWV3Onpvb20taW4nIH0pXG4gICAgfSlcbiAgICBpcGNSZW5kZXJlci5vbignZ2xvYmFsLW1lbnU6em9vbS1vdXQnLCAoKSA9PiB7XG4gICAgICB0aGlzLnByb3BzLndlYnNvY2tldC5zZW5kKHsgdHlwZTogJ2Jyb2FkY2FzdCcsIG5hbWU6ICd2aWV3Onpvb20tb3V0JyB9KVxuICAgIH0pXG4gICAgaXBjUmVuZGVyZXIub24oJ2dsb2JhbC1tZW51Om9wZW4tdGVybWluYWwnLCBsb2Rhc2guZGVib3VuY2UoKCkgPT4ge1xuICAgICAgdGhpcy5vcGVuVGVybWluYWwodGhpcy5zdGF0ZS5wcm9qZWN0Rm9sZGVyKVxuICAgIH0sIDUwMCwgeyBsZWFkaW5nOiB0cnVlIH0pKVxuICAgIGlwY1JlbmRlcmVyLm9uKCdnbG9iYWwtbWVudTp1bmRvJywgbG9kYXNoLmRlYm91bmNlKCgpID0+IHtcbiAgICAgIHRoaXMucHJvcHMud2Vic29ja2V0LnNlbmQoeyBtZXRob2Q6ICdnaXRVbmRvJywgcGFyYW1zOiBbdGhpcy5zdGF0ZS5wcm9qZWN0Rm9sZGVyLCB7IHR5cGU6ICdnbG9iYWwnIH1dIH0pXG4gICAgfSwgNTAwLCB7IGxlYWRpbmc6IHRydWUgfSkpXG4gICAgaXBjUmVuZGVyZXIub24oJ2dsb2JhbC1tZW51OnJlZG8nLCBsb2Rhc2guZGVib3VuY2UoKCkgPT4ge1xuICAgICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQuc2VuZCh7IG1ldGhvZDogJ2dpdFJlZG8nLCBwYXJhbXM6IFt0aGlzLnN0YXRlLnByb2plY3RGb2xkZXIsIHsgdHlwZTogJ2dsb2JhbCcgfV0gfSlcbiAgICB9LCA1MDAsIHsgbGVhZGluZzogdHJ1ZSB9KSlcbiAgICBpcGNSZW5kZXJlci5vbignZ2xvYmFsLW1lbnU6Y2hlY2stdXBkYXRlcycsICgpID0+IHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICB1cGRhdGVyOiB7XG4gICAgICAgICAgc2hvdWxkQ2hlY2s6IHRydWUsXG4gICAgICAgICAgc2hvdWxkUnVuT25CYWNrZ3JvdW5kOiBmYWxzZSxcbiAgICAgICAgICBzaG91bGRTa2lwT3B0SW46IHRydWVcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdvdmVyJywgcHJldmVudERlZmF1bHREcmFnLCBmYWxzZSlcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignZHJvcCcsIGxpbmtFeHRlcm5hbEFzc2V0c09uRHJvcC5iaW5kKHRoaXMpLCBmYWxzZSlcbiAgfVxuXG4gIG9wZW5UZXJtaW5hbCAoZm9sZGVyKSB7XG4gICAgdHJ5IHtcbiAgICAgIGNwLmV4ZWNTeW5jKCdvcGVuIC1iIGNvbS5hcHBsZS50ZXJtaW5hbCAnICsgSlNPTi5zdHJpbmdpZnkoZm9sZGVyKSArICcgfHwgdHJ1ZScpXG4gICAgfSBjYXRjaCAoZXhjZXB0aW9uKSB7XG4gICAgICBjb25zb2xlLmVycm9yKGV4Y2VwdGlvbilcbiAgICB9XG4gIH1cblxuICBkdW1wU3lzdGVtSW5mbyAoKSB7XG4gICAgY29uc3QgdGltZXN0YW1wID0gRGF0ZS5ub3coKVxuICAgIGNvbnN0IGR1bXBkaXIgPSBwYXRoLmpvaW4oSE9NRURJUl9QQVRILCAnZHVtcHMnLCBgZHVtcC0ke3RpbWVzdGFtcH1gKVxuICAgIGNwLmV4ZWNTeW5jKGBta2RpciAtcCAke0pTT04uc3RyaW5naWZ5KGR1bXBkaXIpfWApXG4gICAgZnMud3JpdGVGaWxlU3luYyhwYXRoLmpvaW4oZHVtcGRpciwgJ2FyZ3YnKSwgSlNPTi5zdHJpbmdpZnkocHJvY2Vzcy5hcmd2LCBudWxsLCAyKSlcbiAgICBmcy53cml0ZUZpbGVTeW5jKHBhdGguam9pbihkdW1wZGlyLCAnZW52JyksIEpTT04uc3RyaW5naWZ5KHByb2Nlc3MuZW52LCBudWxsLCAyKSlcbiAgICBpZiAoZnMuZXhpc3RzU3luYyhwYXRoLmpvaW4oSE9NRURJUl9MT0dTX1BBVEgsICdoYWlrdS1kZWJ1Zy5sb2cnKSkpIHtcbiAgICAgIGZzLndyaXRlRmlsZVN5bmMocGF0aC5qb2luKGR1bXBkaXIsICdsb2cnKSwgZnMucmVhZEZpbGVTeW5jKHBhdGguam9pbihIT01FRElSX0xPR1NfUEFUSCwgJ2hhaWt1LWRlYnVnLmxvZycpKS50b1N0cmluZygpKVxuICAgIH1cbiAgICBmcy53cml0ZUZpbGVTeW5jKHBhdGguam9pbihkdW1wZGlyLCAnaW5mbycpLCBKU09OLnN0cmluZ2lmeSh7XG4gICAgICBhY3RpdmVGb2xkZXI6IHRoaXMuc3RhdGUucHJvamVjdEZvbGRlcixcbiAgICAgIHJlYWN0U3RhdGU6IHRoaXMuc3RhdGUsXG4gICAgICBfX2ZpbGVuYW1lOiBfX2ZpbGVuYW1lLFxuICAgICAgX19kaXJuYW1lOiBfX2Rpcm5hbWVcbiAgICB9LCBudWxsLCAyKSlcbiAgICBpZiAodGhpcy5zdGF0ZS5wcm9qZWN0Rm9sZGVyKSB7XG4gICAgICAvLyBUaGUgcHJvamVjdCBmb2xkZXIgaXRzZWxmIHdpbGwgY29udGFpbiBnaXQgbG9ncyBhbmQgb3RoZXIgZ29vZGllcyB3ZSBtZ2lodCB3YW50IHRvIGxvb2sgYXRcbiAgICAgIGNwLmV4ZWNTeW5jKGB0YXIgLXpjdmYgJHtKU09OLnN0cmluZ2lmeShwYXRoLmpvaW4oZHVtcGRpciwgJ3Byb2plY3QudGFyLmd6JykpfSAke0pTT04uc3RyaW5naWZ5KHRoaXMuc3RhdGUucHJvamVjdEZvbGRlcil9YClcbiAgICB9XG4gICAgLy8gRm9yIGNvbnZlbmllbmNlLCB6aXAgdXAgdGhlIGVudGlyZSBkdW1wIGZvbGRlci4uLlxuICAgIGNwLmV4ZWNTeW5jKGB0YXIgLXpjdmYgJHtKU09OLnN0cmluZ2lmeShwYXRoLmpvaW4ob3MuaG9tZWRpcigpLCBgaGFpa3UtZHVtcC0ke3RpbWVzdGFtcH0udGFyLmd6YCkpfSAke0pTT04uc3RyaW5naWZ5KGR1bXBkaXIpfWApXG4gIH1cblxuICB0b2dnbGVEZXZUb29scyAoKSB7XG4gICAgY29uc3Qgd2luID0gcmVtb3RlLmdldEN1cnJlbnRXaW5kb3coKVxuICAgIGlmICh3aW4uaXNEZXZUb29sc09wZW5lZCgpKSB3aW4uY2xvc2VEZXZUb29scygpXG4gICAgZWxzZSB3aW4ub3BlbkRldlRvb2xzKClcbiAgICBpZiAodGhpcy5yZWZzLnN0YWdlKSB0aGlzLnJlZnMuc3RhZ2UudG9nZ2xlRGV2VG9vbHMoKVxuICAgIGlmICh0aGlzLnJlZnMudGltZWxpbmUpIHRoaXMucmVmcy50aW1lbGluZS50b2dnbGVEZXZUb29scygpXG4gIH1cblxuICBoYW5kbGVDb250ZW50UGFzdGUgKG1heWJlUGFzdGVSZXF1ZXN0KSB7XG4gICAgbGV0IHBhc3RlZFRleHQgPSBjbGlwYm9hcmQucmVhZFRleHQoKVxuICAgIGlmICghcGFzdGVkVGV4dCkgcmV0dXJuIHZvaWQgKDApXG5cbiAgICAvLyBUaGUgZGF0YSBvbiB0aGUgY2xpcGJvYXJkIG1pZ2h0IGJlIHNlcmlhbGl6ZWQgZGF0YSwgc28gdHJ5IHRvIHBhcnNlIGl0IGlmIHRoYXQncyB0aGUgY2FzZVxuICAgIC8vIFRoZSBtYWluIGNhc2Ugd2UgaGF2ZSBub3cgZm9yIHNlcmlhbGl6ZWQgZGF0YSBpcyBoYWlrdSBlbGVtZW50cyBjb3BpZWQgZnJvbSB0aGUgc3RhZ2VcbiAgICBsZXQgcGFzdGVkRGF0YVxuICAgIHRyeSB7XG4gICAgICBwYXN0ZWREYXRhID0gSlNPTi5wYXJzZShwYXN0ZWRUZXh0KVxuICAgIH0gY2F0Y2ggKGV4Y2VwdGlvbikge1xuICAgICAgY29uc29sZS53YXJuKCdbY3JlYXRvcl0gdW5hYmxlIHRvIHBhcnNlIHBhc3RlZCBkYXRhOyBpdCBtaWdodCBiZSBwbGFpbiB0ZXh0JylcbiAgICAgIHBhc3RlZERhdGEgPSBwYXN0ZWRUZXh0XG4gICAgfVxuXG4gICAgaWYgKEFycmF5LmlzQXJyYXkocGFzdGVkRGF0YSkpIHtcbiAgICAgIC8vIFRoaXMgbG9va3MgbGlrZSBhIEhhaWt1IGVsZW1lbnQgdGhhdCBoYXMgYmVlbiBjb3BpZWQgZnJvbSB0aGUgc3RhZ2VcbiAgICAgIGlmIChwYXN0ZWREYXRhWzBdID09PSAnYXBwbGljYXRpb24vaGFpa3UnICYmIHR5cGVvZiBwYXN0ZWREYXRhWzFdID09PSAnb2JqZWN0Jykge1xuICAgICAgICBsZXQgcGFzdGVkRWxlbWVudCA9IHBhc3RlZERhdGFbMV1cblxuICAgICAgICAvLyBDb21tYW5kIHRoZSB2aWV3cyBhbmQgbWFzdGVyIHByb2Nlc3MgdG8gaGFuZGxlIHRoZSBlbGVtZW50IHBhc3RlIGFjdGlvblxuICAgICAgICAvLyBUaGUgJ3Bhc3RlVGhpbmcnIGFjdGlvbiBpcyBpbnRlbmRlZCB0byBiZSBhYmxlIHRvIGhhbmRsZSBtdWx0aXBsZSBjb250ZW50IHR5cGVzXG4gICAgICAgIHJldHVybiB0aGlzLnByb3BzLndlYnNvY2tldC5yZXF1ZXN0KHsgdHlwZTogJ2FjdGlvbicsIG1ldGhvZDogJ3Bhc3RlVGhpbmcnLCBwYXJhbXM6IFt0aGlzLnN0YXRlLnByb2plY3RGb2xkZXIsIHBhc3RlZEVsZW1lbnQsIG1heWJlUGFzdGVSZXF1ZXN0IHx8IHt9XSB9LCAoZXJyb3IpID0+IHtcbiAgICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jcmVhdGVOb3RpY2Uoe1xuICAgICAgICAgICAgICB0eXBlOiAnd2FybmluZycsXG4gICAgICAgICAgICAgIHRpdGxlOiAnVWggb2ghJyxcbiAgICAgICAgICAgICAgbWVzc2FnZTogJ1dlIGNvdWxkblxcJ3QgcGFzdGUgdGhhdC4g8J+YoiBQbGVhc2UgY29udGFjdCBIYWlrdSBmb3Igc3VwcG9ydC4nLFxuICAgICAgICAgICAgICBjbG9zZVRleHQ6ICdPa2F5JyxcbiAgICAgICAgICAgICAgbGlnaHRTY2hlbWU6IHRydWVcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gVE9ETzogSGFuZGxlIG90aGVyIGNhc2VzIHdoZXJlIHRoZSBwYXN0ZSBkYXRhIHdhcyBhIHNlcmlhbGl6ZWQgYXJyYXlcbiAgICAgICAgY29uc29sZS53YXJuKCdbY3JlYXRvcl0gY2Fubm90IHBhc3RlIHRoaXMgY29udGVudCB0eXBlIHlldCAoYXJyYXkpJylcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gQW4gZW1wdHkgc3RyaW5nIGlzIHRyZWF0ZWQgYXMgdGhlIGVxdWl2YWxlbnQgb2Ygbm90aGluZyAoZG9uJ3QgZGlzcGxheSB3YXJuaW5nIGlmIG5vdGhpbmcgdG8gaW5zdGFudGlhdGUpXG4gICAgICBpZiAodHlwZW9mIHBhc3RlZERhdGEgPT09ICdzdHJpbmcnICYmIHBhc3RlZERhdGEubGVuZ3RoID4gMCkge1xuICAgICAgICAvLyBUT0RPOiBIYW5kbGUgdGhlIGNhc2Ugd2hlbiBwbGFpbiB0ZXh0IGhhcyBiZWVuIHBhc3RlZCAtIFNWRywgSFRNTCwgZXRjP1xuICAgICAgICBjb25zb2xlLndhcm4oJ1tjcmVhdG9yXSBjYW5ub3QgcGFzdGUgdGhpcyBjb250ZW50IHR5cGUgeWV0ICh1bmtub3duIHN0cmluZyknKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxNb3VudCAoKSB7XG4gICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQub24oJ2Jyb2FkY2FzdCcsIChtZXNzYWdlKSA9PiB7XG4gICAgICBzd2l0Y2ggKG1lc3NhZ2UubmFtZSkge1xuICAgICAgICBjYXNlICdkZXYtdG9vbHM6dG9nZ2xlJzpcbiAgICAgICAgICB0aGlzLnRvZ2dsZURldlRvb2xzKClcbiAgICAgICAgICBicmVha1xuXG4gICAgICAgIGNhc2UgJ2N1cnJlbnQtcGFzdGVhYmxlOnJlcXVlc3QtcGFzdGUnOlxuICAgICAgICAgIGNvbnNvbGUuaW5mbygnW2NyZWF0b3JdIGN1cnJlbnQtcGFzdGVhYmxlOnJlcXVlc3QtcGFzdGUnLCBtZXNzYWdlLmRhdGEpXG4gICAgICAgICAgcmV0dXJuIHRoaXMuaGFuZGxlQ29udGVudFBhc3RlKG1lc3NhZ2UuZGF0YSlcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgdGhpcy5hY3Rpdml0eU1vbml0b3Iuc3RhcnRXYXRjaGVycygpXG5cbiAgICB0aGlzLmVudm95ID0gbmV3IEVudm95Q2xpZW50KHtcbiAgICAgIHBvcnQ6IHRoaXMucHJvcHMuaGFpa3UuZW52b3kucG9ydCxcbiAgICAgIGhvc3Q6IHRoaXMucHJvcHMuaGFpa3UuZW52b3kuaG9zdCxcbiAgICAgIFdlYlNvY2tldDogd2luZG93LldlYlNvY2tldFxuICAgIH0pXG5cbiAgICB0aGlzLmVudm95LmdldChFWFBPUlRFUl9DSEFOTkVMKS50aGVuKChleHBvcnRlckNoYW5uZWwpID0+IHtcbiAgICAgIGlwY1JlbmRlcmVyLm9uKCdnbG9iYWwtbWVudTpleHBvcnQnLCAoZXZlbnQsIFtmb3JtYXRdKSA9PiB7XG4gICAgICAgIGxldCBleHRlbnNpb25cbiAgICAgICAgc3dpdGNoIChmb3JtYXQpIHtcbiAgICAgICAgICBjYXNlIEV4cG9ydGVyRm9ybWF0LkJvZHltb3ZpbjpcbiAgICAgICAgICAgIGV4dGVuc2lvbiA9ICdqc29uJ1xuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbnN1cHBvcnRlZCBmb3JtYXQ6ICR7Zm9ybWF0fWApXG4gICAgICAgIH1cblxuICAgICAgICBkaWFsb2cuc2hvd1NhdmVEaWFsb2codW5kZWZpbmVkLCB7XG4gICAgICAgICAgZGVmYXVsdFBhdGg6IGAqLyR7dGhpcy5zdGF0ZS5wcm9qZWN0TmFtZX1gLFxuICAgICAgICAgIGZpbHRlcnM6IFt7XG4gICAgICAgICAgICBuYW1lOiBmb3JtYXQsXG4gICAgICAgICAgICBleHRlbnNpb25zOiBbZXh0ZW5zaW9uXVxuICAgICAgICAgIH1dXG4gICAgICAgIH0sXG4gICAgICAgIChmaWxlbmFtZSkgPT4ge1xuICAgICAgICAgIGV4cG9ydGVyQ2hhbm5lbC5zYXZlKHtmb3JtYXQsIGZpbGVuYW1lfSlcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIHRoaXMuZW52b3kuZ2V0KCd0b3VyJykudGhlbigodG91ckNoYW5uZWwpID0+IHtcbiAgICAgIHRoaXMudG91ckNoYW5uZWwgPSB0b3VyQ2hhbm5lbFxuXG4gICAgICB0b3VyQ2hhbm5lbC5vbigndG91cjpyZXF1ZXN0RWxlbWVudENvb3JkaW5hdGVzJywgdGhpcy5oYW5kbGVGaW5kRWxlbWVudENvb3JkaW5hdGVzKVxuXG4gICAgICB0b3VyQ2hhbm5lbC5vbigndG91cjpyZXF1ZXN0V2Vidmlld0Nvb3JkaW5hdGVzJywgdGhpcy5oYW5kbGVGaW5kV2Vidmlld0Nvb3JkaW5hdGVzKVxuXG4gICAgICBpcGNSZW5kZXJlci5vbignZ2xvYmFsLW1lbnU6c3RhcnQtdG91cicsICgpID0+IHtcbiAgICAgICAgdGhpcy5zZXREYXNoYm9hcmRWaXNpYmlsaXR5KHRydWUpXG5cbiAgICAgICAgLy8gUHV0IGl0IGF0IHRoZSBib3R0b20gb2YgdGhlIGV2ZW50IGxvb3BcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgdG91ckNoYW5uZWwuc3RhcnQodHJ1ZSlcbiAgICAgICAgfSlcbiAgICAgIH0pXG5cbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCBsb2Rhc2gudGhyb3R0bGUoKCkgPT4ge1xuICAgICAgICAvLyBpZiAodG91ckNoYW5uZWwuaXNUb3VyQWN0aXZlKCkpIHtcbiAgICAgICAgdG91ckNoYW5uZWwubm90aWZ5U2NyZWVuUmVzaXplKClcbiAgICAgICAgLy8gfVxuICAgICAgfSksIDMwMClcbiAgICB9KVxuXG4gICAgdGhpcy5lbnZveS5nZXQoR0xBU1NfQ0hBTk5FTCkudGhlbigoZ2xhc3NDaGFubmVsKSA9PiB7XG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjdXQnLCBnbGFzc0NoYW5uZWwuY3V0KVxuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY29weScsIGdsYXNzQ2hhbm5lbC5jb3B5KVxuICAgIH0pXG5cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdwYXN0ZScsIChwYXN0ZUV2ZW50KSA9PiB7XG4gICAgICBjb25zb2xlLmluZm8oJ1tjcmVhdG9yXSBwYXN0ZSBoZWFyZCcpXG4gICAgICBsZXQgdGFnbmFtZSA9IHBhc3RlRXZlbnQudGFyZ2V0LnRhZ05hbWUudG9Mb3dlckNhc2UoKVxuICAgICAgaWYgKHRhZ25hbWUgPT09ICdpbnB1dCcgfHwgdGFnbmFtZSA9PT0gJ3RleHRhcmVhJykge1xuICAgICAgICAvLyBEbyBub3RoaW5nOyBsZXQgaW5wdXQgZmllbGRzIGFuZCBzby1vbiBiZSBoYW5kbGVkIG5vcm1hbGx5XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBPdGhlcndpc2UsIGFzc3VtZSB3ZSBtaWdodCBuZWVkIHRvIGhhbmRsZSB0aGlzIHBhc3RlIGV2ZW50IHNwZWNpYWxseVxuICAgICAgICBwYXN0ZUV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgdGhpcy5oYW5kbGVDb250ZW50UGFzdGUoKVxuICAgICAgfVxuICAgIH0pXG5cbiAgICB0aGlzLnByb3BzLndlYnNvY2tldC5vbignbWV0aG9kJywgKG1ldGhvZCwgcGFyYW1zLCBjYikgPT4ge1xuICAgICAgY29uc29sZS5pbmZvKCdbY3JlYXRvcl0gbWV0aG9kIGZyb20gcGx1bWJpbmc6JywgbWV0aG9kLCBwYXJhbXMpXG4gICAgICAvLyBuby1vcDsgY3JlYXRvciBkb2Vzbid0IGN1cnJlbnRseSByZWNlaXZlIGFueSBtZXRob2RzIGZyb20gdGhlIG90aGVyIHZpZXdzLCBidXQgd2UgbmVlZCB0aGlzXG4gICAgICAvLyBjYWxsYmFjayB0byBiZSBjYWxsZWQgdG8gYWxsb3cgdGhlIGFjdGlvbiBjaGFpbiBpbiBwbHVtYmluZyB0byBwcm9jZWVkXG4gICAgICByZXR1cm4gY2IoKVxuICAgIH0pXG5cbiAgICB0aGlzLnByb3BzLndlYnNvY2tldC5vbignb3BlbicsICgpID0+IHtcbiAgICAgIHRoaXMucHJvcHMud2Vic29ja2V0LnJlcXVlc3QoeyBtZXRob2Q6ICdpc1VzZXJBdXRoZW50aWNhdGVkJywgcGFyYW1zOiBbXSB9LCAoZXJyb3IsIGF1dGhBbnN3ZXIpID0+IHtcbiAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcilcbiAgICAgICAgICByZXR1cm4gdGhpcy5jcmVhdGVOb3RpY2Uoe1xuICAgICAgICAgICAgdHlwZTogJ2Vycm9yJyxcbiAgICAgICAgICAgIHRpdGxlOiAnT2ggbm8hJyxcbiAgICAgICAgICAgIG1lc3NhZ2U6ICdXZSBoYWQgYSBwcm9ibGVtIGFjY2Vzc2luZyB5b3VyIGFjY291bnQuIPCfmKIgUGxlYXNlIHRyeSBjbG9zaW5nIGFuZCByZW9wZW5pbmcgdGhlIGFwcGxpY2F0aW9uLiBJZiB5b3Ugc3RpbGwgc2VlIHRoaXMgbWVzc2FnZSwgY29udGFjdCBIYWlrdSBmb3Igc3VwcG9ydC4nLFxuICAgICAgICAgICAgY2xvc2VUZXh0OiAnT2theScsXG4gICAgICAgICAgICBsaWdodFNjaGVtZTogdHJ1ZVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cblxuICAgICAgICBtaXhwYW5lbC5tZXJnZVRvUGF5bG9hZCh7IGRpc3RpbmN0X2lkOiBhdXRoQW5zd2VyICYmIGF1dGhBbnN3ZXIudXNlcm5hbWUgfSlcbiAgICAgICAgbWl4cGFuZWwuaGFpa3VUcmFjaygnY3JlYXRvcjpvcGVuZWQnKVxuXG4gICAgICAgIC8vIERlbGF5IHNvIHRoZSBkZWZhdWx0IHN0YXJ0dXAgc2NyZWVuIGRvZXNuJ3QganVzdCBmbGFzaCB0aGVuIGdvIGF3YXlcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICByZWFkeUZvckF1dGg6IHRydWUsXG4gICAgICAgICAgICBhdXRoVG9rZW46IGF1dGhBbnN3ZXIgJiYgYXV0aEFuc3dlci5hdXRoVG9rZW4sXG4gICAgICAgICAgICBvcmdhbml6YXRpb25OYW1lOiBhdXRoQW5zd2VyICYmIGF1dGhBbnN3ZXIub3JnYW5pemF0aW9uTmFtZSxcbiAgICAgICAgICAgIHVzZXJuYW1lOiBhdXRoQW5zd2VyICYmIGF1dGhBbnN3ZXIudXNlcm5hbWUsXG4gICAgICAgICAgICBpc1VzZXJBdXRoZW50aWNhdGVkOiBhdXRoQW5zd2VyICYmIGF1dGhBbnN3ZXIuaXNBdXRoZWRcbiAgICAgICAgICB9KVxuICAgICAgICAgIGlmICh0aGlzLnByb3BzLmZvbGRlcikge1xuICAgICAgICAgICAgLy8gTGF1bmNoIGZvbGRlciBkaXJlY3RseSAtIGkuZS4gYWxsb3cgYSAnc3VibCcgbGlrZSBleHBlcmllbmNlIHdpdGhvdXQgaGF2aW5nIHRvIGdvXG4gICAgICAgICAgICAvLyB0aHJvdWdoIHRoZSBwcm9qZWN0cyBpbmRleFxuICAgICAgICAgICAgcmV0dXJuIHRoaXMubGF1bmNoRm9sZGVyKG51bGwsIHRoaXMucHJvcHMuZm9sZGVyLCAoZXJyb3IpID0+IHtcbiAgICAgICAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcilcbiAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgZm9sZGVyTG9hZGluZ0Vycm9yOiBlcnJvciB9KVxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNyZWF0ZU5vdGljZSh7XG4gICAgICAgICAgICAgICAgICB0eXBlOiAnZXJyb3InLFxuICAgICAgICAgICAgICAgICAgdGl0bGU6ICdPaCBubyEnLFxuICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ1dlIHdlcmUgdW5hYmxlIHRvIG9wZW4gdGhlIGZvbGRlci4g8J+YoiBQbGVhc2UgY2xvc2UgYW5kIHJlb3BlbiB0aGUgYXBwbGljYXRpb24gYW5kIHRyeSBhZ2Fpbi4gSWYgeW91IHN0aWxsIHNlZSB0aGlzIG1lc3NhZ2UsIGNvbnRhY3QgSGFpa3UgZm9yIHN1cHBvcnQuJyxcbiAgICAgICAgICAgICAgICAgIGNsb3NlVGV4dDogJ09rYXknLFxuICAgICAgICAgICAgICAgICAgbGlnaHRTY2hlbWU6IHRydWVcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH1cbiAgICAgICAgfSwgMTAwMClcbiAgICAgIH0pXG4gICAgfSlcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50ICgpIHtcbiAgICB0aGlzLnRvdXJDaGFubmVsLm9mZigndG91cjpyZXF1ZXN0RWxlbWVudENvb3JkaW5hdGVzJywgdGhpcy5oYW5kbGVGaW5kRWxlbWVudENvb3JkaW5hdGVzKVxuICAgIHRoaXMudG91ckNoYW5uZWwub2ZmKCd0b3VyOnJlcXVlc3RXZWJ2aWV3Q29vcmRpbmF0ZXMnLCB0aGlzLmhhbmRsZUZpbmRXZWJ2aWV3Q29vcmRpbmF0ZXMpXG4gICAgdGhpcy5hY3Rpdml0eU1vbml0b3Iuc3RvcFdhdGNoZXJzKClcbiAgfVxuXG4gIGhhbmRsZUZpbmRFbGVtZW50Q29vcmRpbmF0ZXMgKHsgc2VsZWN0b3IsIHdlYnZpZXcgfSkge1xuICAgIGlmICh3ZWJ2aWV3ICE9PSAnY3JlYXRvcicpIHsgcmV0dXJuIH1cblxuICAgIHRyeSB7XG4gICAgICAvLyBUT0RPOiBmaW5kIGlmIHRoZXJlIGlzIGEgYmV0dGVyIHNvbHV0aW9uIHRvIHRoaXMgc2NhcGUgaGF0Y2hcbiAgICAgIGxldCBlbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3RvcilcbiAgICAgIGxldCB7IHRvcCwgbGVmdCB9ID0gZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuXG4gICAgICB0aGlzLnRvdXJDaGFubmVsLnJlY2VpdmVFbGVtZW50Q29vcmRpbmF0ZXMoJ2NyZWF0b3InLCB7IHRvcCwgbGVmdCB9KVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmVycm9yKGBbY3JlYXRvcl0gZXJyb3IgZmV0Y2hpbmcgJHtzZWxlY3Rvcn0gaW4gd2VidmlldyAke3dlYnZpZXd9YClcbiAgICB9XG4gIH1cblxuICBoYW5kbGVGaW5kV2Vidmlld0Nvb3JkaW5hdGVzICgpIHtcbiAgICB0aGlzLnRvdXJDaGFubmVsLnJlY2VpdmVXZWJ2aWV3Q29vcmRpbmF0ZXMoJ2NyZWF0b3InLCB7IHRvcDogMCwgbGVmdDogMCB9KVxuICB9XG5cbiAgaGFuZGxlUGFuZVJlc2l6ZSAoKSB7XG4gICAgLy8gdGhpcy5sYXlvdXQuZW1pdCgncmVzaXplJylcbiAgfVxuXG4gIHJlbmRlck5vdGlmaWNhdGlvbnMgKGNvbnRlbnQsIGkpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPFRvYXN0XG4gICAgICAgIHRvYXN0VHlwZT17Y29udGVudC50eXBlfVxuICAgICAgICB0b2FzdFRpdGxlPXtjb250ZW50LnRpdGxlfVxuICAgICAgICB0b2FzdE1lc3NhZ2U9e2NvbnRlbnQubWVzc2FnZX1cbiAgICAgICAgY2xvc2VUZXh0PXtjb250ZW50LmNsb3NlVGV4dH1cbiAgICAgICAga2V5PXtpICsgY29udGVudC50aXRsZX1cbiAgICAgICAgbXlLZXk9e2l9XG4gICAgICAgIHJlbW92ZU5vdGljZT17dGhpcy5yZW1vdmVOb3RpY2V9XG4gICAgICAgIGxpZ2h0U2NoZW1lPXtjb250ZW50LmxpZ2h0U2NoZW1lfSAvPlxuICAgIClcbiAgfVxuXG4gIHNldERhc2hib2FyZFZpc2liaWxpdHkgKGRhc2hib2FyZFZpc2libGUpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtkYXNoYm9hcmRWaXNpYmxlfSlcbiAgfVxuXG4gIHN3aXRjaEFjdGl2ZU5hdiAoYWN0aXZlTmF2KSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7YWN0aXZlTmF2fSlcblxuICAgIGlmIChhY3RpdmVOYXYgPT09ICdzdGF0ZV9pbnNwZWN0b3InKSB7XG4gICAgICB0aGlzLnRvdXJDaGFubmVsLm5leHQoKVxuICAgIH1cbiAgfVxuXG4gIGF1dGhlbnRpY2F0ZVVzZXIgKHVzZXJuYW1lLCBwYXNzd29yZCwgY2IpIHtcbiAgICByZXR1cm4gdGhpcy5wcm9wcy53ZWJzb2NrZXQucmVxdWVzdCh7IG1ldGhvZDogJ2F1dGhlbnRpY2F0ZVVzZXInLCBwYXJhbXM6IFt1c2VybmFtZSwgcGFzc3dvcmRdIH0sIChlcnJvciwgYXV0aEFuc3dlcikgPT4ge1xuICAgICAgaWYgKGVycm9yKSByZXR1cm4gY2IoZXJyb3IpXG4gICAgICBtaXhwYW5lbC5tZXJnZVRvUGF5bG9hZCh7IGRpc3RpbmN0X2lkOiB1c2VybmFtZSB9KVxuICAgICAgbWl4cGFuZWwuaGFpa3VUcmFjaygnY3JlYXRvcjp1c2VyLWF1dGhlbnRpY2F0ZWQnLCB7IHVzZXJuYW1lIH0pXG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgdXNlcm5hbWUsXG4gICAgICAgIHBhc3N3b3JkLFxuICAgICAgICBhdXRoVG9rZW46IGF1dGhBbnN3ZXIgJiYgYXV0aEFuc3dlci5hdXRoVG9rZW4sXG4gICAgICAgIG9yZ2FuaXphdGlvbk5hbWU6IGF1dGhBbnN3ZXIgJiYgYXV0aEFuc3dlci5vcmdhbml6YXRpb25OYW1lLFxuICAgICAgICBpc1VzZXJBdXRoZW50aWNhdGVkOiBhdXRoQW5zd2VyICYmIGF1dGhBbnN3ZXIuaXNBdXRoZWRcbiAgICAgIH0pXG4gICAgICByZXR1cm4gY2IobnVsbCwgYXV0aEFuc3dlcilcbiAgICB9KVxuICB9XG5cbiAgYXV0aGVudGljYXRpb25Db21wbGV0ZSAoKSB7XG4gICAgcmV0dXJuIHRoaXMuc2V0U3RhdGUoeyBpc1VzZXJBdXRoZW50aWNhdGVkOiB0cnVlIH0pXG4gIH1cblxuICByZWNlaXZlUHJvamVjdEluZm8gKHByb2plY3RJbmZvKSB7XG4gICAgLy8gTk8tT1BcbiAgfVxuXG4gIGxvYWRQcm9qZWN0cyAoY2IpIHtcbiAgICByZXR1cm4gdGhpcy5wcm9wcy53ZWJzb2NrZXQucmVxdWVzdCh7IG1ldGhvZDogJ2xpc3RQcm9qZWN0cycsIHBhcmFtczogW10gfSwgKGVycm9yLCBwcm9qZWN0c0xpc3QpID0+IHtcbiAgICAgIGlmIChlcnJvcikgcmV0dXJuIGNiKGVycm9yKVxuICAgICAgdGhpcy5zZXRTdGF0ZSh7IHByb2plY3RzTGlzdCB9KVxuICAgICAgaXBjUmVuZGVyZXIuc2VuZCgncmVuZGVyZXI6cHJvamVjdHMtbGlzdC1mZXRjaGVkJywgcHJvamVjdHNMaXN0KVxuICAgICAgcmV0dXJuIGNiKG51bGwsIHByb2plY3RzTGlzdClcbiAgICB9KVxuICB9XG5cbiAgbGF1bmNoUHJvamVjdCAocHJvamVjdE5hbWUsIHByb2plY3RPYmplY3QsIGNiKSB7XG4gICAgcHJvamVjdE9iamVjdCA9IHtcbiAgICAgIHNraXBDb250ZW50Q3JlYXRpb246IHRydWUsIC8vIFZFUlkgSU1QT1JUQU5UIC0gaWYgbm90IHNldCB0byB0cnVlLCB3ZSBjYW4gZW5kIHVwIGluIGEgc2l0dWF0aW9uIHdoZXJlIHdlIG92ZXJ3cml0ZSBmcmVzaGx5IGNsb25lZCBjb250ZW50IGZyb20gdGhlIHJlbW90ZSFcbiAgICAgIHByb2plY3RzSG9tZTogcHJvamVjdE9iamVjdC5wcm9qZWN0c0hvbWUsXG4gICAgICBwcm9qZWN0UGF0aDogcHJvamVjdE9iamVjdC5wcm9qZWN0UGF0aCxcbiAgICAgIG9yZ2FuaXphdGlvbk5hbWU6IHRoaXMuc3RhdGUub3JnYW5pemF0aW9uTmFtZSxcbiAgICAgIGF1dGhvck5hbWU6IHRoaXMuc3RhdGUudXNlcm5hbWUsXG4gICAgICBwcm9qZWN0TmFtZSAvLyBIYXZlIHRvIHNldCB0aGlzIGhlcmUsIGJlY2F1c2Ugd2UgcGFzcyB0aGlzIHdob2xlIG9iamVjdCB0byBTdGF0ZVRpdGxlQmFyLCB3aGljaCBuZWVkcyB0aGlzIHRvIHByb3Blcmx5IGNhbGwgc2F2ZVByb2plY3RcbiAgICB9XG5cbiAgICBtaXhwYW5lbC5oYWlrdVRyYWNrKCdjcmVhdG9yOnByb2plY3Q6bGF1bmNoaW5nJywge1xuICAgICAgdXNlcm5hbWU6IHRoaXMuc3RhdGUudXNlcm5hbWUsXG4gICAgICBwcm9qZWN0OiBwcm9qZWN0TmFtZSxcbiAgICAgIG9yZ2FuaXphdGlvbjogdGhpcy5zdGF0ZS5vcmdhbml6YXRpb25OYW1lXG4gICAgfSlcblxuICAgIHJldHVybiB0aGlzLnByb3BzLndlYnNvY2tldC5yZXF1ZXN0KHsgbWV0aG9kOiAnaW5pdGlhbGl6ZVByb2plY3QnLCBwYXJhbXM6IFtwcm9qZWN0TmFtZSwgcHJvamVjdE9iamVjdCwgdGhpcy5zdGF0ZS51c2VybmFtZSwgdGhpcy5zdGF0ZS5wYXNzd29yZF0gfSwgKGVyciwgcHJvamVjdEZvbGRlcikgPT4ge1xuICAgICAgaWYgKGVycikgcmV0dXJuIGNiKGVycilcblxuICAgICAgcmV0dXJuIHRoaXMucHJvcHMud2Vic29ja2V0LnJlcXVlc3QoeyBtZXRob2Q6ICdzdGFydFByb2plY3QnLCBwYXJhbXM6IFtwcm9qZWN0TmFtZSwgcHJvamVjdEZvbGRlcl0gfSwgKGVyciwgYXBwbGljYXRpb25JbWFnZSkgPT4ge1xuICAgICAgICBpZiAoZXJyKSByZXR1cm4gY2IoZXJyKVxuXG4gICAgICAgIC8vIEFzc2lnbiwgbm90IG1lcmdlLCBzaW5jZSB3ZSBkb24ndCB3YW50IHRvIGNsb2JiZXIgYW55IHZhcmlhYmxlcyBhbHJlYWR5IHNldCwgbGlrZSBwcm9qZWN0IG5hbWVcbiAgICAgICAgbG9kYXNoLmFzc2lnbihwcm9qZWN0T2JqZWN0LCBhcHBsaWNhdGlvbkltYWdlLnByb2plY3QpXG5cbiAgICAgICAgbWl4cGFuZWwuaGFpa3VUcmFjaygnY3JlYXRvcjpwcm9qZWN0OmxhdW5jaGVkJywge1xuICAgICAgICAgIHVzZXJuYW1lOiB0aGlzLnN0YXRlLnVzZXJuYW1lLFxuICAgICAgICAgIHByb2plY3Q6IHByb2plY3ROYW1lLFxuICAgICAgICAgIG9yZ2FuaXphdGlvbjogdGhpcy5zdGF0ZS5vcmdhbml6YXRpb25OYW1lXG4gICAgICAgIH0pXG5cbiAgICAgICAgLy8gTm93IGhhY2tpbHkgY2hhbmdlIHNvbWUgcG9pbnRlcnMgc28gd2UncmUgcmVmZXJyaW5nIHRvIHRoZSBjb3JyZWN0IHBsYWNlXG4gICAgICAgIHRoaXMucHJvcHMud2Vic29ja2V0LmZvbGRlciA9IHByb2plY3RGb2xkZXIgLy8gRG8gbm90IHJlbW92ZSB0aGlzIG5lY2Vzc2FyeSBoYWNrIHBselxuICAgICAgICB0aGlzLnNldFN0YXRlKHsgcHJvamVjdEZvbGRlciwgYXBwbGljYXRpb25JbWFnZSwgcHJvamVjdE9iamVjdCwgcHJvamVjdE5hbWUsIGRhc2hib2FyZFZpc2libGU6IGZhbHNlIH0pXG5cbiAgICAgICAgcmV0dXJuIGNiKClcbiAgICAgIH0pXG4gICAgfSlcbiAgfVxuXG4gIGxhdW5jaEZvbGRlciAobWF5YmVQcm9qZWN0TmFtZSwgcHJvamVjdEZvbGRlciwgY2IpIHtcbiAgICBtaXhwYW5lbC5oYWlrdVRyYWNrKCdjcmVhdG9yOmZvbGRlcjpsYXVuY2hpbmcnLCB7XG4gICAgICB1c2VybmFtZTogdGhpcy5zdGF0ZS51c2VybmFtZSxcbiAgICAgIHByb2plY3Q6IG1heWJlUHJvamVjdE5hbWVcbiAgICB9KVxuXG4gICAgLy8gVGhlIGxhdW5jaFByb2plY3QgbWV0aG9kIGhhbmRsZXMgdGhlIHBlcmZvcm1Gb2xkZXJQb2ludGVyQ2hhbmdlXG4gICAgcmV0dXJuIHRoaXMubGF1bmNoUHJvamVjdChtYXliZVByb2plY3ROYW1lLCB7IHByb2plY3RQYXRoOiBwcm9qZWN0Rm9sZGVyIH0sIGNiKVxuICB9XG5cbiAgcmVtb3ZlTm90aWNlIChpbmRleCwgaWQpIHtcbiAgICBjb25zdCBub3RpY2VzID0gdGhpcy5zdGF0ZS5ub3RpY2VzXG4gICAgaWYgKGluZGV4ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBub3RpY2VzOiBbLi4ubm90aWNlcy5zbGljZSgwLCBpbmRleCksIC4uLm5vdGljZXMuc2xpY2UoaW5kZXggKyAxKV1cbiAgICAgIH0pXG4gICAgfSBlbHNlIGlmIChpZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAvLyBIYWNrYXJvb1xuICAgICAgbG9kYXNoLmVhY2gobm90aWNlcywgKG5vdGljZSwgaW5kZXgpID0+IHtcbiAgICAgICAgaWYgKG5vdGljZS5pZCA9PT0gaWQpIHRoaXMucmVtb3ZlTm90aWNlKGluZGV4KVxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICBjcmVhdGVOb3RpY2UgKG5vdGljZSkge1xuICAgIC8qIEV4cGVjdHMgdGhlIG9iamVjdDpcbiAgICB7IHR5cGU6IHN0cmluZyAoaW5mbywgc3VjY2VzcywgZGFuZ2VyIChvciBlcnJvciksIHdhcm5pbmcpXG4gICAgICB0aXRsZTogc3RyaW5nLFxuICAgICAgbWVzc2FnZTogc3RyaW5nLFxuICAgICAgY2xvc2VUZXh0OiBzdHJpbmcgKG9wdGlvbmFsLCBkZWZhdWx0cyB0byAnY2xvc2UnKVxuICAgICAgbGlnaHRTY2hlbWU6IGJvb2wgKG9wdGlvbmFsLCBkZWZhdWx0cyB0byBkYXJrKVxuICAgIH0gKi9cblxuICAgIG5vdGljZS5pZCA9IE1hdGgucmFuZG9tKCkgKyAnJ1xuXG4gICAgY29uc3Qgbm90aWNlcyA9IHRoaXMuc3RhdGUubm90aWNlc1xuICAgIGxldCByZXBsYWNlZEV4aXN0aW5nID0gZmFsc2VcblxuICAgIG5vdGljZXMuZm9yRWFjaCgobiwgaSkgPT4ge1xuICAgICAgaWYgKG4ubWVzc2FnZSA9PT0gbm90aWNlLm1lc3NhZ2UpIHtcbiAgICAgICAgbm90aWNlcy5zcGxpY2UoaSwgMSlcbiAgICAgICAgcmVwbGFjZWRFeGlzdGluZyA9IHRydWVcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IG5vdGljZXMgfSwgKCkgPT4ge1xuICAgICAgICAgIG5vdGljZXMudW5zaGlmdChub3RpY2UpXG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IG5vdGljZXMgfSlcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgaWYgKCFyZXBsYWNlZEV4aXN0aW5nKSB7XG4gICAgICBub3RpY2VzLnVuc2hpZnQobm90aWNlKVxuICAgICAgdGhpcy5zZXRTdGF0ZSh7IG5vdGljZXMgfSlcbiAgICB9XG5cbiAgICByZXR1cm4gbm90aWNlXG4gIH1cblxuICBvbkxpYnJhcnlEcmFnRW5kIChkcmFnRW5kTmF0aXZlRXZlbnQsIGxpYnJhcnlJdGVtSW5mbykge1xuICAgIHRoaXMuc2V0U3RhdGUoeyBsaWJyYXJ5SXRlbURyYWdnaW5nOiBudWxsIH0pXG4gICAgaWYgKGxpYnJhcnlJdGVtSW5mbyAmJiBsaWJyYXJ5SXRlbUluZm8ucHJldmlldykge1xuICAgICAgdGhpcy5yZWZzLnN0YWdlLmhhbmRsZURyb3AobGlicmFyeUl0ZW1JbmZvLCB0aGlzLl9sYXN0TW91c2VYLCB0aGlzLl9sYXN0TW91c2VZKVxuICAgIH1cbiAgfVxuXG4gIG9uTGlicmFyeURyYWdTdGFydCAoZHJhZ1N0YXJ0TmF0aXZlRXZlbnQsIGxpYnJhcnlJdGVtSW5mbykge1xuICAgIHRoaXMuc2V0U3RhdGUoeyBsaWJyYXJ5SXRlbURyYWdnaW5nOiBsaWJyYXJ5SXRlbUluZm8gfSlcbiAgfVxuXG4gIG9uQXV0b1VwZGF0ZUNoZWNrQ29tcGxldGUgKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgdXBkYXRlcjoge1xuICAgICAgICAuLi50aGlzLnN0YXRlLnVwZGF0ZXIsXG4gICAgICAgIHNob3VsZENoZWNrOiBmYWxzZVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBvbkFjdGl2aXR5UmVwb3J0ICh1c2VyV2FzQWN0aXZlKSB7XG4gICAgaWYgKHVzZXJXYXNBY3RpdmUpIHtcbiAgICAgIHJldHVybiB0aGlzLnByb3BzLndlYnNvY2tldC5yZXF1ZXN0KFxuICAgICAgICB7bWV0aG9kOiAnY2hlY2tJbmtzdG9uZVVwZGF0ZXMnLCBwYXJhbXM6IFt7fV19LFxuICAgICAgICAoZXJyKSA9PiB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ1tjcmVhdG9yXSBwaW5nIHRvIElua3N0b25lIGZvciB1cGRhdGVzIGZpbmlzaGVkJywgZXJyKVxuICAgICAgICB9XG4gICAgICApXG4gICAgfVxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICB1cGRhdGVyOiB7XG4gICAgICAgIHNob3VsZENoZWNrOiB0cnVlLFxuICAgICAgICBzaG91bGRSdW5PbkJhY2tncm91bmQ6IHRydWUsXG4gICAgICAgIHNob3VsZFNraXBPcHRJbjogZmFsc2VcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgcmVuZGVyU3RhcnR1cERlZmF1bHRTY3JlZW4gKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IHN0eWxlPXt7IHBvc2l0aW9uOiAnYWJzb2x1dGUnLCB3aWR0aDogJzEwMCUnLCBoZWlnaHQ6ICcxMDAlJyB9fT5cbiAgICAgICAgPFJlYWN0Q1NTVHJhbnNpdGlvbkdyb3VwXG4gICAgICAgICAgdHJhbnNpdGlvbk5hbWU9J3RvYXN0J1xuICAgICAgICAgIHRyYW5zaXRpb25FbnRlclRpbWVvdXQ9ezUwMH1cbiAgICAgICAgICB0cmFuc2l0aW9uTGVhdmVUaW1lb3V0PXszMDB9PlxuICAgICAgICAgIDxkaXYgc3R5bGU9e3twb3NpdGlvbjogJ2Fic29sdXRlJywgcmlnaHQ6IDAsIHRvcDogMCwgd2lkdGg6IDMwMH19PlxuICAgICAgICAgICAge2xvZGFzaC5tYXAodGhpcy5zdGF0ZS5ub3RpY2VzLCB0aGlzLnJlbmRlck5vdGlmaWNhdGlvbnMpfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L1JlYWN0Q1NTVHJhbnNpdGlvbkdyb3VwPlxuICAgICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6ICd0YWJsZScsIHdpZHRoOiAnMTAwJScsIGhlaWdodDogJzEwMCUnLCBwb3NpdGlvbjogJ2Fic29sdXRlJywgdG9wOiAwLCBsZWZ0OiAwIH19PlxuICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ3RhYmxlLWNlbGwnLCB3aWR0aDogJzEwMCUnLCBoZWlnaHQ6ICcxMDAlJywgdmVydGljYWxBbGlnbjogJ21pZGRsZScsIHRleHRBbGlnbjogJ2NlbnRlcicgfX0+XG4gICAgICAgICAgICA8c3ZnIHdpZHRoPScxNzBweCcgaGVpZ2h0PScyMjFweCcgdmlld0JveD0nMCAwIDE3MCAyMjEnIHZlcnNpb249JzEuMSc+XG4gICAgICAgICAgICAgIDxnIGlkPSdQYWdlLTEnIHN0cm9rZT0nbm9uZScgc3Ryb2tlV2lkdGg9JzEnIGZpbGw9J25vbmUnIGZpbGxSdWxlPSdldmVub2RkJz5cbiAgICAgICAgICAgICAgICA8ZyBpZD0nT3V0bGluZWQnIHRyYW5zZm9ybT0ndHJhbnNsYXRlKC0yMTEuMDAwMDAwLCAtMTE0LjAwMDAwMCknIGZpbGxSdWxlPSdub256ZXJvJyBmaWxsPScjRkFGQ0ZEJz5cbiAgICAgICAgICAgICAgICAgIDxnIGlkPSdvdXRsaW5lZC1sb2dvJyB0cmFuc2Zvcm09J3RyYW5zbGF0ZSgyMTEuMDAwMDAwLCAxMTMuMDAwMDAwKSc+XG4gICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9J000Ny41LDE1Mi43OTg4MjMgTDI2LjM4MjM0MzIsMTQzLjk1NDY3NiBDMjQuNTk5Mzk0MSwxNDMuMjA3OTcxIDIzLjc1OTM1MjQsMTQxLjE1NzI4MSAyNC41MDYwNTc2LDEzOS4zNzQzMzIgQzI1LjI1Mjc2MjgsMTM3LjU5MTM4MyAyNy4zMDM0NTI3LDEzNi43NTEzNDEgMjkuMDg2NDAxOCwxMzcuNDk4MDQ2IEwxMTcuNzgwMDU4LDE3NC42NDQ1NiBMMTIwLjk5MDAyMSwxNzYuMDg5MDc0IEMxMjIuNDg2ODE0LDE3Ni43NjI2NDUgMTIzLjI3OTMwNCwxNzguMzU4MjUxIDEyMi45OTg2OTgsMTc5LjkwMzU5OCBDMTIyLjk5OTU2NCwxNzkuOTM1NjI2IDEyMywxNzkuOTY3NzYyIDEyMywxODAgTDEyMywyMDUuNjM5NzIyIEwxMzguNTEwNzE2LDIxMS45MTAwMTEgTDE0My4zNjg0MjEsMjEzLjg3Mzc2NCBMMTYyLjgzMzMzMywyMDYuMDA0OTcgTDE2Mi44MzMzMzMsMTYuMjkyOTAyNSBMMTQzLDguMjc1MTcyMDQgTDEyMi44MzMzMzMsMTYuNDI3NjU0MyBMMTIyLjgzMzMzMyw1My42MDEzMjk1IEMxMjIuODM0MjE4LDUzLjY0NjY0ODkgMTIyLjgzNDIxNSw1My42OTE5MDE1IDEyMi44MzMzMzMsNTMuNzM3MDYzNCBMMTIyLjgzMzMzMyw1NCBDMTIyLjgzMzMzMyw1NS45MzI5OTY2IDEyMS4yNjYzMyw1Ny41IDExOS4zMzMzMzMsNTcuNSBDMTE5LjI4ODQzLDU3LjUgMTE5LjI0MzcyNCw1Ny40OTkxNTQ0IDExOS4xOTkyMyw1Ny40OTc0NzgyIEw1My4zMDc2MzgsODQuMDM3MTQ5IEM1MS41MTQ2MTgzLDg0Ljc1OTMzNzUgNDkuNDc1NjM5Miw4My44OTEyNTczIDQ4Ljc1MzQ1MDYsODIuMDk4MjM3NiBDNDguMDMxMjYyMSw4MC4zMDUyMTc5IDQ4Ljg5OTM0MjMsNzguMjY2MjM4OCA1MC42OTIzNjIsNzcuNTQ0MDUwMiBMMTE1LjgzMzMzMyw1MS4zMDY3MTI5IEwxMTUuODMzMzMzLDE0LjQ5NzQyMjcgQzExNS44MzMzMzMsMTQuMDE0MzE3OCAxMTUuOTMxMjEzLDEzLjU1NDA3MzkgMTE2LjEwODIyMiwxMy4xMzU0Mzk5IEMxMTYuMzc0NTM5LDEyLjA5NDEyOTIgMTE3LjExNTMyNiwxMS4xODg4NDQ5IDExOC4xODgyMzgsMTAuNzU1MTE0OCBMMTQxLjY4NDE4NiwxLjI1Njc1MjcgQzE0Mi4wOTEzMTcsMS4wOTE1MjkzNiAxNDIuNTI5NTksMS4wMDI0MDQ2NyAxNDIuOTc1OTM3LDAuOTk5MTY0NzIzIEMxNDMuNDcwNDEsMS4wMDI0MDQ2NyAxNDMuOTA4NjgzLDEuMDkxNTI5MzYgMTQ0LjMxNTgxNCwxLjI1Njc1MjcgTDE2Ny44MTE3NjIsMTAuNzU1MTE0OCBDMTY5LjUyMjk2OCwxMS40NDY4NzkgMTcwLjM4OTMyOCwxMy4zMzgxNjU5IDE2OS44MzMzMzMsMTUuMDY3NzA2OCBMMTY5LjgzMzMzMywyMDggQzE2OS44MzMzMzMsMjA4LjgyNjMwNCAxNjkuNTQ2OTksMjA5LjU4NTcyOCAxNjkuMDY4MTE4LDIxMC4xODQ0NTkgQzE2OC42OTM3MDMsMjEwLjg2NzM3OCAxNjguMDkwMTMzLDIxMS40MzAyMjQgMTY3LjMxMTc2MiwyMTEuNzQ0ODg1IEwxNDQuNTE3NjQ1LDIyMC45NTk1MjggQzE0My4zMzI1NDIsMjIxLjQzODYxMyAxNDIuMDM4OTk1LDIyMS4yMjIzOTcgMTQxLjA4OTE3OSwyMjAuNTAyNzEyIEwxMzUuODg3MTkyLDIxOC4zOTk3ODIgTDExOS40NjE1OTUsMjExLjc1OTY0NyBDMTE3LjU0NjI5LDIxMS43MzkwNTUgMTE2LDIxMC4xODAwMzIgMTE2LDIwOC4yNTk4NTMgTDExNiwyMDguMDc5MTEgQzExNS45OTg3NjcsMjA4LjAyNTcwOCAxMTUuOTk4NzYxLDIwNy45NzIxNzggMTE2LDIwNy45MTg1NTggTDExNiwxODEuNTE4NzQ4IEwxMTQuOTkxNzI3LDE4MS4wNjQ1ODkgTDU0LjUsMTU1LjczMDQ0NyBMNTQuNSwyMDYuOTk4MjczIEM1NS4xMzQxNDY4LDIwOC42NTgyNTYgNTQuNDE5NTMxNSwyMTAuNTEyOTE1IDUyLjg3OTY2NDUsMjExLjMzMzMzMyBDNTIuNTU0NTU0NiwyMTEuNTQwNzA5IDUyLjE5MjkwNCwyMTEuNjk1ODY5IDUxLjgwNjUyOTQsMjExLjc4Njk5NyBMMjkuNzg2NzM3NSwyMjAuNjUwNjU1IEMyOC44MjUyNTM1LDIyMS40Nzg3NTggMjcuNDQ1NzAwNSwyMjEuNzUzMjIxIDI2LjE4ODIzNzksMjIxLjI0NDg4NSBMMjAuMzg3MTkyMSwyMTguODk5NzgyIEwzLjMwNjI3NzgzLDIxMS45OTQ3MzEgQzEuNDYzMzgxODksMjExLjg5NDE5MiAtMi42MDgzNTk5NWUtMTYsMjEwLjM2Nzk5MiAwLDIwOC41IEwyLjcwODk0NDE4ZS0xNCwxNC40OTc0MjI3IEMyLjcyNDI0NWUtMTQsMTMuNDAxNjQ1OCAwLjUwMzU2MDk0NywxMi40MjM0ODE4IDEuMjkxODk2NjksMTEuNzgxNzE3IEMxLjY1MTcxMDE0LDExLjM0MTY1MDkgMi4xMjQwNTYyMiwxMC45ODMxODgyIDIuNjg4MjM3ODksMTAuNzU1MTE0OCBMMjYuMTg0MTg2MiwxLjI1Njc1MjcgQzI2LjU5MTMxNzIsMS4wOTE1MjkzNiAyNy4wMjk1ODk4LDEuMDAyNDA0NjcgMjcuNDc1OTM2NywwLjk5OTE2NDcyMyBDMjcuOTcwNDEwMiwxLjAwMjQwNDY3IDI4LjQwODY4MjgsMS4wOTE1MjkzNiAyOC44MTU4MTM4LDEuMjU2NzUyNyBMNTIuMzExNzYyMSwxMC43NTUxMTQ4IEM1NC4xMDM4NjI3LDExLjQ3OTU4MSA1NC45NjkzNTE0LDEzLjUxOTY2MTUgNTQuMjQ0ODg1MiwxNS4zMTE3NjIxIEM1My41MjA0MTksMTcuMTAzODYyNyA1MS40ODAzMzg1LDE3Ljk2OTM1MTQgNDkuNjg4MjM3OSwxNy4yNDQ4ODUyIEwyNy41LDguMjc1MTcyMDQgTDcsMTYuNTYyNDA2MSBMNywyMDUuOTM3NTk0IEwyMy4wMTA3MTY0LDIxMi40MTAwMTEgTDI3LjI1MjY5OTUsMjE0LjEyNDg1NSBMNDcuNSwyMDUuOTc0NjgxIEw0Ny41LDE1Mi43OTg4MjMgWicgaWQ9J0NvbWJpbmVkLVNoYXBlJyAvPlxuICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSdNMTQ2LjQ1NjgyNyw2My4wMjQxODQ5IEMxNDYuOTQ4NjAzLDY0LjcxMDQ3MjQgMTQ2LjEwNTk3Miw2Ni41MzM2NTkxIDE0NC40NDczMDUsNjcuMjI4MzE0OSBMNTkuNTQ2ODY3NywxMDIuNzg0OTA4IEwxMjAuNDE2NTc1LDEyOC4yNzczNSBDMTIyLjE5OTUyNCwxMjkuMDI0MDU1IDEyMy4wMzk1NjYsMTMxLjA3NDc0NSAxMjIuMjkyODYxLDEzMi44NTc2OTQgQzEyMS41NDYxNTYsMTM0LjY0MDY0MyAxMTkuNDk1NDY2LDEzNS40ODA2ODUgMTE3LjcxMjUxNywxMzQuNzMzOTc5IEw1MC40ODY0MTMxLDEwNi41Nzk0NTcgTDI5LjM1MjAyOTMsMTE1LjQzMDYxIEMyNy41NjkwODAyLDExNi4xNzczMTUgMjUuNTE4MzkwMywxMTUuMzM3MjczIDI0Ljc3MTY4NTEsMTEzLjU1NDMyNCBDMjQuMDI0OTgsMTExLjc3MTM3NSAyNC44NjUwMjE2LDEwOS43MjA2ODUgMjYuNjQ3OTcwNywxMDguOTczOTggTDQ3LjUsMTAwLjI0MTA3OSBMNDcuNSwxNC41IEM0Ny41LDEyLjU2NzAwMzQgNDkuMDY3MDAzNCwxMSA1MSwxMSBDNTIuOTMyOTk2NiwxMSA1NC41LDEyLjU2NzAwMzQgNTQuNSwxNC41IEw1NC41LDk3LjMwOTQ1NDggTDEzMy4zNjAyNTcsNjQuMjgyNTA5OCBMMTE3LjE4ODIzOCw1Ny43NDQ4ODUyIEMxMTUuMzk2MTM3LDU3LjAyMDQxOSAxMTQuNTMwNjQ5LDU0Ljk4MDMzODUgMTE1LjI1NTExNSw1My4xODgyMzc5IEMxMTUuOTc5NTgxLDUxLjM5NjEzNzMgMTE4LjAxOTY2MSw1MC41MzA2NDg2IDExOS44MTE3NjIsNTEuMjU1MTE0OCBMMTM5LjUsNTkuMjE0MTg5NyBMMTM5LjUsMjUuODYwMjc4NCBMMTM1Ljg4NzE5MiwyNC4zOTk3ODE2IEwxMTguMTg4MjM4LDE3LjI0NDg4NTIgQzExNi4zOTYxMzcsMTYuNTIwNDE5IDExNS41MzA2NDksMTQuNDgwMzM4NSAxMTYuMjU1MTE1LDEyLjY4ODIzNzkgQzExNi45Nzk1ODEsMTAuODk2MTM3MyAxMTkuMDE5NjYxLDEwLjAzMDY0ODYgMTIwLjgxMTc2MiwxMC43NTUxMTQ4IEwxMzguNTEwNzE2LDE3LjkxMDAxMTIgTDE0My4zNjg0MjEsMTkuODczNzY0MSBMMTY0LjY4ODIzOCwxMS4yNTUxMTQ4IEMxNjYuNDgwMzM5LDEwLjUzMDY0ODYgMTY4LjUyMDQxOSwxMS4zOTYxMzczIDE2OS4yNDQ4ODUsMTMuMTg4MjM3OSBDMTY5Ljk2OTM1MSwxNC45ODAzMzg1IDE2OS4xMDM4NjMsMTcuMDIwNDE5IDE2Ny4zMTE3NjIsMTcuNzQ0ODg1MiBMMTQ2LjUsMjYuMTU4MTUwOCBMMTQ2LjUsNjIuNDcyODc0OSBDMTQ2LjUsNjIuNjYwNDU3NCAxNDYuNDg1MjQzLDYyLjg0NDU5MzMgMTQ2LjQ1NjgyNyw2My4wMjQxODQ5IFonIGlkPSdDb21iaW5lZC1TaGFwZScgLz5cbiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0nTTEzOS41LDk2LjMzMDgwNjkgTDEyMi44MzMzMzMsMTAzLjMxMDg2NCBMMTIyLjgzMzMzMywxNTEuMzcyNzk5IEMxMjIuODMzMzMzLDE1My4zMDU3OTUgMTIxLjI2NjMzLDE1NC44NzI3OTkgMTE5LjMzMzMzMywxNTQuODcyNzk5IEMxMTguNTM1NzE5LDE1NC44NzI3OTkgMTE3LjgwMDQyLDE1NC42MDU5OTQgMTE3LjIxMTgxNiwxNTQuMTU2NzYzIEwyNi42NDc5NzA3LDExNi4yMjgzMTUgQzI2LjA5NzY3MDYsMTE1Ljk5Nzg0NyAyNS42MzcxOTQsMTE1LjY0MzE1OSAyNS4yODU0NzE0LDExNS4yMTA0NjIgQzI0LjUwMDgyNTgsMTE0LjU2ODYyIDI0LDExMy41OTI3OTcgMjQsMTEyLjUgTDI0LDI1Ljg2MDI3ODQgTDIwLjM4NzE5MjEsMjQuMzk5NzgxNiBMMi42ODgyMzc4OSwxNy4yNDQ4ODUyIEMwLjg5NjEzNzI1OCwxNi41MjA0MTkgMC4wMzA2NDg1NTg5LDE0LjQ4MDMzODUgMC43NTUxMTQ3NywxMi42ODgyMzc5IEMxLjQ3OTU4MDk4LDEwLjg5NjEzNzMgMy41MTk2NjE0OSwxMC4wMzA2NDg2IDUuMzExNzYyMTEsMTAuNzU1MTE0OCBMMjMuMDEwNzE2NCwxNy45MTAwMTEyIEwyNy44Njg0MjExLDE5Ljg3Mzc2NDEgTDQ5LjE4ODIzNzksMTEuMjU1MTE0OCBDNTAuOTgwMzM4NSwxMC41MzA2NDg2IDUzLjAyMDQxOSwxMS4zOTYxMzczIDUzLjc0NDg4NTIsMTMuMTg4MjM3OSBDNTQuNDY5MzUxNCwxNC45ODAzMzg1IDUzLjYwMzg2MjcsMTcuMDIwNDE5IDUxLjgxMTc2MjEsMTcuNzQ0ODg1MiBMMzEsMjYuMTU4MTUwOCBMMzEsMTEwLjQ2MTg2MSBMMTE1LjgzMzMzMywxNDUuOTkwMzUxIEwxMTUuODMzMzMzLDEwNi4yNDI0ODggTDg0LjI1OTY2MTYsMTE5LjQ2NTY0OSBDODIuNDc2NzEyNSwxMjAuMjEyMzU1IDgwLjQyNjAyMjYsMTE5LjM3MjMxMyA3OS42NzkzMTc0LDExNy41ODkzNjQgQzc4LjkzMjYxMjMsMTE1LjgwNjQxNSA3OS43NzI2NTM5LDExMy43NTU3MjUgODEuNTU1NjAzLDExMy4wMDkwMiBMMTQxLjA1MjE1MSw4OC4wOTE2NjIyIEMxNDEuNjA4OTc0LDg3LjcxNzk5MyAxNDIuMjc5MDMsODcuNSAxNDMsODcuNSBDMTQ0LjkzMjk5Nyw4Ny41IDE0Ni41LDg5LjA2NzAwMzQgMTQ2LjUsOTEgTDE0Ni41LDIxNy42MzA0OCBDMTQ2LjUsMjE5LjU2MzQ3NyAxNDQuOTMyOTk3LDIyMS4xMzA0OCAxNDMsMjIxLjEzMDQ4IEMxNDEuMDY3MDAzLDIyMS4xMzA0OCAxMzkuNSwyMTkuNTYzNDc3IDEzOS41LDIxNy42MzA0OCBMMTM5LjUsOTYuMzMwODA2OSBaIE0zMSwxNDEgTDMxLDIxNy4wNTUyMzcgQzMxLDIxOC45ODgyMzQgMjkuNDMyOTk2NiwyMjAuNTU1MjM3IDI3LjUsMjIwLjU1NTIzNyBDMjUuNTY3MDAzNCwyMjAuNTU1MjM3IDI0LDIxOC45ODgyMzQgMjQsMjE3LjA1NTIzNyBMMjQsMTQxIEMyNCwxMzkuMDY3MDAzIDI1LjU2NzAwMzQsMTM3LjUgMjcuNSwxMzcuNSBDMjkuNDMyOTk2NiwxMzcuNSAzMSwxMzkuMDY3MDAzIDMxLDE0MSBaJyBpZD0nQ29tYmluZWQtU2hhcGUnIC8+XG4gICAgICAgICAgICAgICAgICA8L2c+XG4gICAgICAgICAgICAgICAgPC9nPlxuICAgICAgICAgICAgICA8L2c+XG4gICAgICAgICAgICA8L3N2Zz5cbiAgICAgICAgICAgIDxiciAvPlxuICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgY29sb3I6ICcjRkFGQ0ZEJywgZGlzcGxheTogJ2lubGluZS1ibG9jaycsIHdpZHRoOiAnMTAwJScsIGhlaWdodDogNTAsIHBvc2l0aW9uOiAnYWJzb2x1dGUnLCBib3R0b206IDUwLCBsZWZ0OiAwIH19Pnt0aGlzLnN0YXRlLnNvZnR3YXJlVmVyc2lvbn08L3NwYW4+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyICgpIHtcbiAgICBpZiAodGhpcy5zdGF0ZS5yZWFkeUZvckF1dGggJiYgKCF0aGlzLnN0YXRlLmlzVXNlckF1dGhlbnRpY2F0ZWQgfHwgIXRoaXMuc3RhdGUudXNlcm5hbWUpKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8U3R5bGVSb290PlxuICAgICAgICAgIDxBdXRoZW50aWNhdGlvblVJXG4gICAgICAgICAgICBvblN1Ym1pdD17dGhpcy5hdXRoZW50aWNhdGVVc2VyfVxuICAgICAgICAgICAgb25TdWJtaXRTdWNjZXNzPXt0aGlzLmF1dGhlbnRpY2F0aW9uQ29tcGxldGV9XG4gICAgICAgICAgICB7Li4udGhpcy5wcm9wc30gLz5cbiAgICAgICAgPC9TdHlsZVJvb3Q+XG4gICAgICApXG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLnN0YXRlLmlzVXNlckF1dGhlbnRpY2F0ZWQgfHwgIXRoaXMuc3RhdGUudXNlcm5hbWUpIHtcbiAgICAgIHJldHVybiB0aGlzLnJlbmRlclN0YXJ0dXBEZWZhdWx0U2NyZWVuKClcbiAgICB9XG5cbiAgICBpZiAodGhpcy5zdGF0ZS5kYXNoYm9hcmRWaXNpYmxlKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIDxQcm9qZWN0QnJvd3NlclxuICAgICAgICAgICAgbG9hZFByb2plY3RzPXt0aGlzLmxvYWRQcm9qZWN0c31cbiAgICAgICAgICAgIGxhdW5jaFByb2plY3Q9e3RoaXMubGF1bmNoUHJvamVjdH1cbiAgICAgICAgICAgIGNyZWF0ZU5vdGljZT17dGhpcy5jcmVhdGVOb3RpY2V9XG4gICAgICAgICAgICByZW1vdmVOb3RpY2U9e3RoaXMucmVtb3ZlTm90aWNlfVxuICAgICAgICAgICAgbm90aWNlcz17dGhpcy5zdGF0ZS5ub3RpY2VzfVxuICAgICAgICAgICAgZW52b3k9e3RoaXMuZW52b3l9XG4gICAgICAgICAgICB7Li4udGhpcy5wcm9wc30gLz5cbiAgICAgICAgICA8VG91ciBwcm9qZWN0c0xpc3Q9e3RoaXMuc3RhdGUucHJvamVjdHNMaXN0fSBlbnZveT17dGhpcy5lbnZveX0gc3RhcnRUb3VyT25Nb3VudCAvPlxuICAgICAgICAgIDxBdXRvVXBkYXRlclxuICAgICAgICAgICAgb25Db21wbGV0ZT17dGhpcy5vbkF1dG9VcGRhdGVDaGVja0NvbXBsZXRlfVxuICAgICAgICAgICAgY2hlY2s9e3RoaXMuc3RhdGUudXBkYXRlci5zaG91bGRDaGVja31cbiAgICAgICAgICAgIHNraXBPcHRJbj17dGhpcy5zdGF0ZS51cGRhdGVyLnNob3VsZFNraXBPcHRJbn1cbiAgICAgICAgICAgIHJ1bk9uQmFja2dyb3VuZD17dGhpcy5zdGF0ZS51cGRhdGVyLnNob3VsZFJ1bk9uQmFja2dyb3VuZH1cbiAgICAgICAgICAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIClcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuc3RhdGUucHJvamVjdEZvbGRlcikge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdj5cbiAgICAgICAgICA8VG91ciBwcm9qZWN0c0xpc3Q9e3RoaXMuc3RhdGUucHJvamVjdHNMaXN0fSBlbnZveT17dGhpcy5lbnZveX0gLz5cbiAgICAgICAgICA8QXV0b1VwZGF0ZXJcbiAgICAgICAgICAgIG9uQ29tcGxldGU9e3RoaXMub25BdXRvVXBkYXRlQ2hlY2tDb21wbGV0ZX1cbiAgICAgICAgICAgIGNoZWNrPXt0aGlzLnN0YXRlLnVwZGF0ZXIuc2hvdWxkQ2hlY2t9XG4gICAgICAgICAgICBza2lwT3B0SW49e3RoaXMuc3RhdGUudXBkYXRlci5zaG91bGRTa2lwT3B0SW59XG4gICAgICAgICAgICBydW5PbkJhY2tncm91bmQ9e3RoaXMuc3RhdGUudXBkYXRlci5zaG91bGRSdW5PbkJhY2tncm91bmR9XG4gICAgICAgICAgLz5cbiAgICAgICAgICA8UHJvamVjdEJyb3dzZXJcbiAgICAgICAgICAgIGxvYWRQcm9qZWN0cz17dGhpcy5sb2FkUHJvamVjdHN9XG4gICAgICAgICAgICBsYXVuY2hQcm9qZWN0PXt0aGlzLmxhdW5jaFByb2plY3R9XG4gICAgICAgICAgICBjcmVhdGVOb3RpY2U9e3RoaXMuY3JlYXRlTm90aWNlfVxuICAgICAgICAgICAgcmVtb3ZlTm90aWNlPXt0aGlzLnJlbW92ZU5vdGljZX1cbiAgICAgICAgICAgIG5vdGljZXM9e3RoaXMuc3RhdGUubm90aWNlc31cbiAgICAgICAgICAgIGVudm95PXt0aGlzLmVudm95fVxuICAgICAgICAgICAgey4uLnRoaXMucHJvcHN9IC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKVxuICAgIH1cblxuICAgIGlmICghdGhpcy5zdGF0ZS5hcHBsaWNhdGlvbkltYWdlIHx8IHRoaXMuc3RhdGUuZm9sZGVyTG9hZGluZ0Vycm9yKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IHN0eWxlPXt7IHBvc2l0aW9uOiAnYWJzb2x1dGUnLCB3aWR0aDogJzEwMCUnLCBoZWlnaHQ6ICcxMDAlJyB9fT5cbiAgICAgICAgICA8UmVhY3RDU1NUcmFuc2l0aW9uR3JvdXBcbiAgICAgICAgICAgIHRyYW5zaXRpb25OYW1lPSd0b2FzdCdcbiAgICAgICAgICAgIHRyYW5zaXRpb25FbnRlclRpbWVvdXQ9ezUwMH1cbiAgICAgICAgICAgIHRyYW5zaXRpb25MZWF2ZVRpbWVvdXQ9ezMwMH0+XG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt7cG9zaXRpb246ICdhYnNvbHV0ZScsIHJpZ2h0OiAwLCB0b3A6IDAsIHdpZHRoOiAzMDB9fT5cbiAgICAgICAgICAgICAge2xvZGFzaC5tYXAodGhpcy5zdGF0ZS5ub3RpY2VzLCB0aGlzLnJlbmRlck5vdGlmaWNhdGlvbnMpfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9SZWFjdENTU1RyYW5zaXRpb25Hcm91cD5cbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7IHBvc2l0aW9uOiAncmVsYXRpdmUnLCB3aWR0aDogJzEwMCUnLCBoZWlnaHQ6ICcxMDAlJyB9fT5cbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgcG9zaXRpb246ICdhYnNvbHV0ZScsIHRvcDogJzUwJScsIGxlZnQ6ICc1MCUnLCB0cmFuc2Zvcm06ICd0cmFuc2xhdGUoLTUwJSwgLTUwJSknIH19PlxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBmb250U2l6ZTogMjQsIGNvbG9yOiAnIzIyMicgfX0+TG9hZGluZyBwcm9qZWN0Li4uPC9zcGFuPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKVxuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IHN0eWxlPXt7IHBvc2l0aW9uOiAncmVsYXRpdmUnLCB3aWR0aDogJzEwMCUnLCBoZWlnaHQ6ICcxMDAlJyB9fT5cbiAgICAgICAgPEF1dG9VcGRhdGVyXG4gICAgICAgICAgb25Db21wbGV0ZT17dGhpcy5vbkF1dG9VcGRhdGVDaGVja0NvbXBsZXRlfVxuICAgICAgICAgIGNoZWNrPXt0aGlzLnN0YXRlLnVwZGF0ZXIuc2hvdWxkQ2hlY2t9XG4gICAgICAgICAgc2tpcE9wdEluPXt0aGlzLnN0YXRlLnVwZGF0ZXIuc2hvdWxkU2tpcE9wdElufVxuICAgICAgICAgIHJ1bk9uQmFja2dyb3VuZD17dGhpcy5zdGF0ZS51cGRhdGVyLnNob3VsZFJ1bk9uQmFja2dyb3VuZH1cbiAgICAgICAgLz5cbiAgICAgICAgPFRvdXIgcHJvamVjdHNMaXN0PXt0aGlzLnN0YXRlLnByb2plY3RzTGlzdH0gZW52b3k9e3RoaXMuZW52b3l9IC8+XG4gICAgICAgIDxkaXYgc3R5bGU9e3sgcG9zaXRpb246ICdhYnNvbHV0ZScsIHdpZHRoOiAnMTAwJScsIGhlaWdodDogJzEwMCUnLCB0b3A6IDAsIGxlZnQ6IDAgfX0+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9J2xheW91dC1ib3gnIHN0eWxlPXt7b3ZlcmZsb3c6ICd2aXNpYmxlJ319PlxuICAgICAgICAgICAgPFJlYWN0Q1NTVHJhbnNpdGlvbkdyb3VwXG4gICAgICAgICAgICAgIHRyYW5zaXRpb25OYW1lPSd0b2FzdCdcbiAgICAgICAgICAgICAgdHJhbnNpdGlvbkVudGVyVGltZW91dD17NTAwfVxuICAgICAgICAgICAgICB0cmFuc2l0aW9uTGVhdmVUaW1lb3V0PXszMDB9PlxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7cG9zaXRpb246ICdhYnNvbHV0ZScsIHJpZ2h0OiAwLCB0b3A6IDAsIHdpZHRoOiAzMDB9fT5cbiAgICAgICAgICAgICAgICB7bG9kYXNoLm1hcCh0aGlzLnN0YXRlLm5vdGljZXMsIHRoaXMucmVuZGVyTm90aWZpY2F0aW9ucyl9XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9SZWFjdENTU1RyYW5zaXRpb25Hcm91cD5cbiAgICAgICAgICAgIDxTcGxpdFBhbmUgb25EcmFnRmluaXNoZWQ9e3RoaXMuaGFuZGxlUGFuZVJlc2l6ZS5iaW5kKHRoaXMpfSBzcGxpdD0naG9yaXpvbnRhbCcgbWluU2l6ZT17MzAwfSBkZWZhdWx0U2l6ZT17dGhpcy5wcm9wcy5oZWlnaHQgKiAwLjYyfT5cbiAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8U3BsaXRQYW5lIG9uRHJhZ0ZpbmlzaGVkPXt0aGlzLmhhbmRsZVBhbmVSZXNpemUuYmluZCh0aGlzKX0gc3BsaXQ9J3ZlcnRpY2FsJyBtaW5TaXplPXszMDB9IGRlZmF1bHRTaXplPXszMDB9PlxuICAgICAgICAgICAgICAgICAgPFNpZGVCYXJcbiAgICAgICAgICAgICAgICAgICAgc2V0RGFzaGJvYXJkVmlzaWJpbGl0eT17dGhpcy5zZXREYXNoYm9hcmRWaXNpYmlsaXR5LmJpbmQodGhpcyl9XG4gICAgICAgICAgICAgICAgICAgIHN3aXRjaEFjdGl2ZU5hdj17dGhpcy5zd2l0Y2hBY3RpdmVOYXYuYmluZCh0aGlzKX1cbiAgICAgICAgICAgICAgICAgICAgYWN0aXZlTmF2PXt0aGlzLnN0YXRlLmFjdGl2ZU5hdn0+XG4gICAgICAgICAgICAgICAgICAgIHt0aGlzLnN0YXRlLmFjdGl2ZU5hdiA9PT0gJ2xpYnJhcnknXG4gICAgICAgICAgICAgICAgICAgICAgPyA8TGlicmFyeVxuICAgICAgICAgICAgICAgICAgICAgICAgbGF5b3V0PXt0aGlzLmxheW91dH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGZvbGRlcj17dGhpcy5zdGF0ZS5wcm9qZWN0Rm9sZGVyfVxuICAgICAgICAgICAgICAgICAgICAgICAgaGFpa3U9e3RoaXMucHJvcHMuaGFpa3V9XG4gICAgICAgICAgICAgICAgICAgICAgICB3ZWJzb2NrZXQ9e3RoaXMucHJvcHMud2Vic29ja2V0fVxuICAgICAgICAgICAgICAgICAgICAgICAgdG91ckNoYW5uZWw9e3RoaXMudG91ckNoYW5uZWx9XG4gICAgICAgICAgICAgICAgICAgICAgICBvbkRyYWdFbmQ9e3RoaXMub25MaWJyYXJ5RHJhZ0VuZC5iaW5kKHRoaXMpfVxuICAgICAgICAgICAgICAgICAgICAgICAgb25EcmFnU3RhcnQ9e3RoaXMub25MaWJyYXJ5RHJhZ1N0YXJ0LmJpbmQodGhpcyl9XG4gICAgICAgICAgICAgICAgICAgICAgICBjcmVhdGVOb3RpY2U9e3RoaXMuY3JlYXRlTm90aWNlfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmVtb3ZlTm90aWNlPXt0aGlzLnJlbW92ZU5vdGljZX0gLz5cbiAgICAgICAgICAgICAgICAgICAgICA6IDxTdGF0ZUluc3BlY3RvclxuICAgICAgICAgICAgICAgICAgICAgICAgY3JlYXRlTm90aWNlPXt0aGlzLmNyZWF0ZU5vdGljZX1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJlbW92ZU5vdGljZT17dGhpcy5yZW1vdmVOb3RpY2V9XG4gICAgICAgICAgICAgICAgICAgICAgICBmb2xkZXI9e3RoaXMuc3RhdGUucHJvamVjdEZvbGRlcn1cbiAgICAgICAgICAgICAgICAgICAgICAgIHdlYnNvY2tldD17dGhpcy5wcm9wcy53ZWJzb2NrZXR9XG4gICAgICAgICAgICAgICAgICAgICAgICB0b3VyQ2hhbm5lbD17dGhpcy50b3VyQ2hhbm5lbH0gLz5cbiAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICA8L1NpZGVCYXI+XG4gICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7cG9zaXRpb246ICdyZWxhdGl2ZScsIHdpZHRoOiAnMTAwJScsIGhlaWdodDogJzEwMCUnfX0+XG4gICAgICAgICAgICAgICAgICAgIDxTdGFnZVxuICAgICAgICAgICAgICAgICAgICAgIHJlZj0nc3RhZ2UnXG4gICAgICAgICAgICAgICAgICAgICAgZm9sZGVyPXt0aGlzLnN0YXRlLnByb2plY3RGb2xkZXJ9XG4gICAgICAgICAgICAgICAgICAgICAgZW52b3k9e3RoaXMuZW52b3l9XG4gICAgICAgICAgICAgICAgICAgICAgaGFpa3U9e3RoaXMucHJvcHMuaGFpa3V9XG4gICAgICAgICAgICAgICAgICAgICAgd2Vic29ja2V0PXt0aGlzLnByb3BzLndlYnNvY2tldH1cbiAgICAgICAgICAgICAgICAgICAgICBwcm9qZWN0PXt0aGlzLnN0YXRlLnByb2plY3RPYmplY3R9XG4gICAgICAgICAgICAgICAgICAgICAgY3JlYXRlTm90aWNlPXt0aGlzLmNyZWF0ZU5vdGljZX1cbiAgICAgICAgICAgICAgICAgICAgICByZW1vdmVOb3RpY2U9e3RoaXMucmVtb3ZlTm90aWNlfVxuICAgICAgICAgICAgICAgICAgICAgIHJlY2VpdmVQcm9qZWN0SW5mbz17dGhpcy5yZWNlaXZlUHJvamVjdEluZm99XG4gICAgICAgICAgICAgICAgICAgICAgb3JnYW5pemF0aW9uTmFtZT17dGhpcy5zdGF0ZS5vcmdhbml6YXRpb25OYW1lfVxuICAgICAgICAgICAgICAgICAgICAgIGF1dGhUb2tlbj17dGhpcy5zdGF0ZS5hdXRoVG9rZW59XG4gICAgICAgICAgICAgICAgICAgICAgdXNlcm5hbWU9e3RoaXMuc3RhdGUudXNlcm5hbWV9XG4gICAgICAgICAgICAgICAgICAgICAgcGFzc3dvcmQ9e3RoaXMuc3RhdGUucGFzc3dvcmR9IC8+XG4gICAgICAgICAgICAgICAgICAgIHsodGhpcy5zdGF0ZS5saWJyYXJ5SXRlbURyYWdnaW5nKVxuICAgICAgICAgICAgICAgICAgICAgID8gPGRpdiBzdHlsZT17eyB3aWR0aDogJzEwMCUnLCBoZWlnaHQ6ICcxMDAlJywgYmFja2dyb3VuZENvbG9yOiAnd2hpdGUnLCBvcGFjaXR5OiAwLjAxLCBwb3NpdGlvbjogJ2Fic29sdXRlJywgdG9wOiAwLCBsZWZ0OiAwIH19IC8+XG4gICAgICAgICAgICAgICAgICAgICAgOiAnJyB9XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L1NwbGl0UGFuZT5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxUaW1lbGluZVxuICAgICAgICAgICAgICAgIHJlZj0ndGltZWxpbmUnXG4gICAgICAgICAgICAgICAgZm9sZGVyPXt0aGlzLnN0YXRlLnByb2plY3RGb2xkZXJ9XG4gICAgICAgICAgICAgICAgZW52b3k9e3RoaXMuZW52b3l9XG4gICAgICAgICAgICAgICAgaGFpa3U9e3RoaXMucHJvcHMuaGFpa3V9XG4gICAgICAgICAgICAgICAgY3JlYXRlTm90aWNlPXt0aGlzLmNyZWF0ZU5vdGljZX1cbiAgICAgICAgICAgICAgICByZW1vdmVOb3RpY2U9e3RoaXMucmVtb3ZlTm90aWNlfSAvPlxuICAgICAgICAgICAgPC9TcGxpdFBhbmU+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG59XG4iXX0=