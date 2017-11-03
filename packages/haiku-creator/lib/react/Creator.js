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
            if (error.message === 'Organization error') {
              _this3.setState({
                isUserAuthenticated: false,
                username: null,
                password: null,
                readyForAuth: true
              });
            } else {
              return _this3.createNotice({
                type: 'error',
                title: 'Oh no!',
                message: 'We had a problem accessing your account. 😢 Please try closing and reopening the application. If you still see this message, contact Haiku for support.',
                closeText: 'Okay',
                lightScheme: true
              });
            }
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
          lineNumber: 414
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


        // Add extra context to Sentry reports, this info is also used
        // by carbonite.
      };window.Raven.setExtraContext({
        organizationName: this.state.organizationName,
        projectPath: projectObject.projectPath,
        projectName: projectName
      });
      window.Raven.setUserContext({
        email: this.state.username
      });

      mixpanel.haikuTrack('creator:project:launching', {
        username: this.state.username,
        project: projectName,
        organization: this.state.organizationName
      });

      return this.props.websocket.request({ method: 'initializeProject', params: [projectName, projectObject, this.state.username, this.state.password] }, function (err, projectFolder) {
        if (err) return cb(err);

        window.Raven.setExtraContext({
          organizationName: _this6.state.organizationName,
          projectPath: projectFolder, // Re-set in case it wasn't present in the above call
          projectName: projectName
        });

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
            lineNumber: 626
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
              lineNumber: 627
            },
            __self: this
          },
          _react2.default.createElement(
            'div',
            { style: { position: 'absolute', right: 0, top: 0, width: 300 }, __source: {
                fileName: _jsxFileName,
                lineNumber: 631
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
              lineNumber: 635
            },
            __self: this
          },
          _react2.default.createElement(
            'div',
            { style: { display: 'table-cell', width: '100%', height: '100%', verticalAlign: 'middle', textAlign: 'center' }, __source: {
                fileName: _jsxFileName,
                lineNumber: 636
              },
              __self: this
            },
            _react2.default.createElement(
              'svg',
              { width: '170px', height: '221px', viewBox: '0 0 170 221', version: '1.1', __source: {
                  fileName: _jsxFileName,
                  lineNumber: 637
                },
                __self: this
              },
              _react2.default.createElement(
                'g',
                { id: 'Page-1', stroke: 'none', strokeWidth: '1', fill: 'none', fillRule: 'evenodd', __source: {
                    fileName: _jsxFileName,
                    lineNumber: 638
                  },
                  __self: this
                },
                _react2.default.createElement(
                  'g',
                  { id: 'Outlined', transform: 'translate(-211.000000, -114.000000)', fillRule: 'nonzero', fill: '#FAFCFD', __source: {
                      fileName: _jsxFileName,
                      lineNumber: 639
                    },
                    __self: this
                  },
                  _react2.default.createElement(
                    'g',
                    { id: 'outlined-logo', transform: 'translate(211.000000, 113.000000)', __source: {
                        fileName: _jsxFileName,
                        lineNumber: 640
                      },
                      __self: this
                    },
                    _react2.default.createElement('path', { d: 'M47.5,152.798823 L26.3823432,143.954676 C24.5993941,143.207971 23.7593524,141.157281 24.5060576,139.374332 C25.2527628,137.591383 27.3034527,136.751341 29.0864018,137.498046 L117.780058,174.64456 L120.990021,176.089074 C122.486814,176.762645 123.279304,178.358251 122.998698,179.903598 C122.999564,179.935626 123,179.967762 123,180 L123,205.639722 L138.510716,211.910011 L143.368421,213.873764 L162.833333,206.00497 L162.833333,16.2929025 L143,8.27517204 L122.833333,16.4276543 L122.833333,53.6013295 C122.834218,53.6466489 122.834215,53.6919015 122.833333,53.7370634 L122.833333,54 C122.833333,55.9329966 121.26633,57.5 119.333333,57.5 C119.28843,57.5 119.243724,57.4991544 119.19923,57.4974782 L53.307638,84.037149 C51.5146183,84.7593375 49.4756392,83.8912573 48.7534506,82.0982376 C48.0312621,80.3052179 48.8993423,78.2662388 50.692362,77.5440502 L115.833333,51.3067129 L115.833333,14.4974227 C115.833333,14.0143178 115.931213,13.5540739 116.108222,13.1354399 C116.374539,12.0941292 117.115326,11.1888449 118.188238,10.7551148 L141.684186,1.2567527 C142.091317,1.09152936 142.52959,1.00240467 142.975937,0.999164723 C143.47041,1.00240467 143.908683,1.09152936 144.315814,1.2567527 L167.811762,10.7551148 C169.522968,11.446879 170.389328,13.3381659 169.833333,15.0677068 L169.833333,208 C169.833333,208.826304 169.54699,209.585728 169.068118,210.184459 C168.693703,210.867378 168.090133,211.430224 167.311762,211.744885 L144.517645,220.959528 C143.332542,221.438613 142.038995,221.222397 141.089179,220.502712 L135.887192,218.399782 L119.461595,211.759647 C117.54629,211.739055 116,210.180032 116,208.259853 L116,208.07911 C115.998767,208.025708 115.998761,207.972178 116,207.918558 L116,181.518748 L114.991727,181.064589 L54.5,155.730447 L54.5,206.998273 C55.1341468,208.658256 54.4195315,210.512915 52.8796645,211.333333 C52.5545546,211.540709 52.192904,211.695869 51.8065294,211.786997 L29.7867375,220.650655 C28.8252535,221.478758 27.4457005,221.753221 26.1882379,221.244885 L20.3871921,218.899782 L3.30627783,211.994731 C1.46338189,211.894192 -2.60835995e-16,210.367992 0,208.5 L2.70894418e-14,14.4974227 C2.724245e-14,13.4016458 0.503560947,12.4234818 1.29189669,11.781717 C1.65171014,11.3416509 2.12405622,10.9831882 2.68823789,10.7551148 L26.1841862,1.2567527 C26.5913172,1.09152936 27.0295898,1.00240467 27.4759367,0.999164723 C27.9704102,1.00240467 28.4086828,1.09152936 28.8158138,1.2567527 L52.3117621,10.7551148 C54.1038627,11.479581 54.9693514,13.5196615 54.2448852,15.3117621 C53.520419,17.1038627 51.4803385,17.9693514 49.6882379,17.2448852 L27.5,8.27517204 L7,16.5624061 L7,205.937594 L23.0107164,212.410011 L27.2526995,214.124855 L47.5,205.974681 L47.5,152.798823 Z', id: 'Combined-Shape', __source: {
                        fileName: _jsxFileName,
                        lineNumber: 641
                      },
                      __self: this
                    }),
                    _react2.default.createElement('path', { d: 'M146.456827,63.0241849 C146.948603,64.7104724 146.105972,66.5336591 144.447305,67.2283149 L59.5468677,102.784908 L120.416575,128.27735 C122.199524,129.024055 123.039566,131.074745 122.292861,132.857694 C121.546156,134.640643 119.495466,135.480685 117.712517,134.733979 L50.4864131,106.579457 L29.3520293,115.43061 C27.5690802,116.177315 25.5183903,115.337273 24.7716851,113.554324 C24.02498,111.771375 24.8650216,109.720685 26.6479707,108.97398 L47.5,100.241079 L47.5,14.5 C47.5,12.5670034 49.0670034,11 51,11 C52.9329966,11 54.5,12.5670034 54.5,14.5 L54.5,97.3094548 L133.360257,64.2825098 L117.188238,57.7448852 C115.396137,57.020419 114.530649,54.9803385 115.255115,53.1882379 C115.979581,51.3961373 118.019661,50.5306486 119.811762,51.2551148 L139.5,59.2141897 L139.5,25.8602784 L135.887192,24.3997816 L118.188238,17.2448852 C116.396137,16.520419 115.530649,14.4803385 116.255115,12.6882379 C116.979581,10.8961373 119.019661,10.0306486 120.811762,10.7551148 L138.510716,17.9100112 L143.368421,19.8737641 L164.688238,11.2551148 C166.480339,10.5306486 168.520419,11.3961373 169.244885,13.1882379 C169.969351,14.9803385 169.103863,17.020419 167.311762,17.7448852 L146.5,26.1581508 L146.5,62.4728749 C146.5,62.6604574 146.485243,62.8445933 146.456827,63.0241849 Z', id: 'Combined-Shape', __source: {
                        fileName: _jsxFileName,
                        lineNumber: 642
                      },
                      __self: this
                    }),
                    _react2.default.createElement('path', { d: 'M139.5,96.3308069 L122.833333,103.310864 L122.833333,151.372799 C122.833333,153.305795 121.26633,154.872799 119.333333,154.872799 C118.535719,154.872799 117.80042,154.605994 117.211816,154.156763 L26.6479707,116.228315 C26.0976706,115.997847 25.637194,115.643159 25.2854714,115.210462 C24.5008258,114.56862 24,113.592797 24,112.5 L24,25.8602784 L20.3871921,24.3997816 L2.68823789,17.2448852 C0.896137258,16.520419 0.0306485589,14.4803385 0.75511477,12.6882379 C1.47958098,10.8961373 3.51966149,10.0306486 5.31176211,10.7551148 L23.0107164,17.9100112 L27.8684211,19.8737641 L49.1882379,11.2551148 C50.9803385,10.5306486 53.020419,11.3961373 53.7448852,13.1882379 C54.4693514,14.9803385 53.6038627,17.020419 51.8117621,17.7448852 L31,26.1581508 L31,110.461861 L115.833333,145.990351 L115.833333,106.242488 L84.2596616,119.465649 C82.4767125,120.212355 80.4260226,119.372313 79.6793174,117.589364 C78.9326123,115.806415 79.7726539,113.755725 81.555603,113.00902 L141.052151,88.0916622 C141.608974,87.717993 142.27903,87.5 143,87.5 C144.932997,87.5 146.5,89.0670034 146.5,91 L146.5,217.63048 C146.5,219.563477 144.932997,221.13048 143,221.13048 C141.067003,221.13048 139.5,219.563477 139.5,217.63048 L139.5,96.3308069 Z M31,141 L31,217.055237 C31,218.988234 29.4329966,220.555237 27.5,220.555237 C25.5670034,220.555237 24,218.988234 24,217.055237 L24,141 C24,139.067003 25.5670034,137.5 27.5,137.5 C29.4329966,137.5 31,139.067003 31,141 Z', id: 'Combined-Shape', __source: {
                        fileName: _jsxFileName,
                        lineNumber: 643
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
                lineNumber: 648
              },
              __self: this
            }),
            _react2.default.createElement(
              'span',
              { style: { color: '#FAFCFD', display: 'inline-block', width: '100%', height: 50, position: 'absolute', bottom: 50, left: 0 }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 649
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
              lineNumber: 659
            },
            __self: this
          },
          _react2.default.createElement(_AuthenticationUI2.default, Object.assign({
            onSubmit: this.authenticateUser,
            onSubmitSuccess: this.authenticationComplete
          }, this.props, {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 660
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
              lineNumber: 674
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
              lineNumber: 675
            },
            __self: this
          })),
          _react2.default.createElement(_Tour2.default, { projectsList: this.state.projectsList, envoy: this.envoy, startTourOnMount: true, __source: {
              fileName: _jsxFileName,
              lineNumber: 683
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
              lineNumber: 684
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
              lineNumber: 696
            },
            __self: this
          },
          _react2.default.createElement(_Tour2.default, { projectsList: this.state.projectsList, envoy: this.envoy, __source: {
              fileName: _jsxFileName,
              lineNumber: 697
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
              lineNumber: 698
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
              lineNumber: 704
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
              lineNumber: 718
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
                lineNumber: 719
              },
              __self: this
            },
            _react2.default.createElement(
              'div',
              { style: { position: 'absolute', right: 0, top: 0, width: 300 }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 723
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
                lineNumber: 727
              },
              __self: this
            },
            _react2.default.createElement(
              'div',
              { style: { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 728
                },
                __self: this
              },
              _react2.default.createElement(
                'span',
                { style: { fontSize: 24, color: '#222' }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 729
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
            lineNumber: 737
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
            lineNumber: 738
          },
          __self: this
        }),
        _react2.default.createElement(_Tour2.default, { projectsList: this.state.projectsList, envoy: this.envoy, __source: {
            fileName: _jsxFileName,
            lineNumber: 744
          },
          __self: this
        }),
        _react2.default.createElement(
          'div',
          { style: { position: 'absolute', width: '100%', height: '100%', top: 0, left: 0 }, __source: {
              fileName: _jsxFileName,
              lineNumber: 745
            },
            __self: this
          },
          _react2.default.createElement(
            'div',
            { className: 'layout-box', style: { overflow: 'visible' }, __source: {
                fileName: _jsxFileName,
                lineNumber: 746
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
                  lineNumber: 747
                },
                __self: this
              },
              _react2.default.createElement(
                'div',
                { style: { position: 'absolute', right: 0, top: 0, width: 300 }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 751
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
                  lineNumber: 755
                },
                __self: this
              },
              _react2.default.createElement(
                'div',
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 756
                  },
                  __self: this
                },
                _react2.default.createElement(
                  _reactSplitPane2.default,
                  { onDragFinished: this.handlePaneResize.bind(this), split: 'vertical', minSize: 300, defaultSize: 300, __source: {
                      fileName: _jsxFileName,
                      lineNumber: 757
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
                        lineNumber: 758
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
                        lineNumber: 763
                      },
                      __self: this
                    }) : _react2.default.createElement(_StateInspector2.default, {
                      createNotice: this.createNotice,
                      removeNotice: this.removeNotice,
                      folder: this.state.projectFolder,
                      websocket: this.props.websocket,
                      tourChannel: this.tourChannel, __source: {
                        fileName: _jsxFileName,
                        lineNumber: 773
                      },
                      __self: this
                    })
                  ),
                  _react2.default.createElement(
                    'div',
                    { style: { position: 'relative', width: '100%', height: '100%' }, __source: {
                        fileName: _jsxFileName,
                        lineNumber: 781
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
                        lineNumber: 782
                      },
                      __self: this
                    }),
                    this.state.libraryItemDragging ? _react2.default.createElement('div', { style: { width: '100%', height: '100%', backgroundColor: 'white', opacity: 0.01, position: 'absolute', top: 0, left: 0 }, __source: {
                        fileName: _jsxFileName,
                        lineNumber: 797
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
                username: this.state.username,
                organizationName: this.state.organizationName,
                createNotice: this.createNotice,
                removeNotice: this.removeNotice, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 802
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZWFjdC9DcmVhdG9yLmpzIl0sIm5hbWVzIjpbInBrZyIsInJlcXVpcmUiLCJtaXhwYW5lbCIsImVsZWN0cm9uIiwicmVtb3RlIiwiZGlhbG9nIiwiaXBjUmVuZGVyZXIiLCJjbGlwYm9hcmQiLCJ3ZWJGcmFtZSIsInNldFpvb21MZXZlbExpbWl0cyIsInNldExheW91dFpvb21MZXZlbExpbWl0cyIsIkNyZWF0b3IiLCJwcm9wcyIsImF1dGhlbnRpY2F0ZVVzZXIiLCJiaW5kIiwiYXV0aGVudGljYXRpb25Db21wbGV0ZSIsImxvYWRQcm9qZWN0cyIsImxhdW5jaFByb2plY3QiLCJyZW1vdmVOb3RpY2UiLCJjcmVhdGVOb3RpY2UiLCJyZW5kZXJOb3RpZmljYXRpb25zIiwicmVjZWl2ZVByb2plY3RJbmZvIiwiaGFuZGxlRmluZEVsZW1lbnRDb29yZGluYXRlcyIsImhhbmRsZUZpbmRXZWJ2aWV3Q29vcmRpbmF0ZXMiLCJvbkF1dG9VcGRhdGVDaGVja0NvbXBsZXRlIiwibGF5b3V0IiwiYWN0aXZpdHlNb25pdG9yIiwid2luZG93Iiwib25BY3Rpdml0eVJlcG9ydCIsInN0YXRlIiwiZXJyb3IiLCJwcm9qZWN0Rm9sZGVyIiwiZm9sZGVyIiwiYXBwbGljYXRpb25JbWFnZSIsInByb2plY3RPYmplY3QiLCJwcm9qZWN0TmFtZSIsImRhc2hib2FyZFZpc2libGUiLCJyZWFkeUZvckF1dGgiLCJpc1VzZXJBdXRoZW50aWNhdGVkIiwidXNlcm5hbWUiLCJwYXNzd29yZCIsIm5vdGljZXMiLCJzb2Z0d2FyZVZlcnNpb24iLCJ2ZXJzaW9uIiwiZGlkUGx1bWJpbmdOb3RpY2VDcmFzaCIsImFjdGl2ZU5hdiIsInByb2plY3RzTGlzdCIsInVwZGF0ZXIiLCJzaG91bGRDaGVjayIsInNob3VsZFJ1bk9uQmFja2dyb3VuZCIsInNob3VsZFNraXBPcHRJbiIsIndpbiIsImdldEN1cnJlbnRXaW5kb3ciLCJwcm9jZXNzIiwiZW52IiwiREVWIiwib3BlbkRldlRvb2xzIiwiZG9jdW1lbnQiLCJhZGRFdmVudExpc3RlbmVyIiwibmF0aXZlRXZlbnQiLCJfbGFzdE1vdXNlWCIsImNsaWVudFgiLCJfbGFzdE1vdXNlWSIsImNsaWVudFkiLCJjb21ib2tleXMiLCJkb2N1bWVudEVsZW1lbnQiLCJOT0RFX0VOViIsImRlYm91bmNlIiwid2Vic29ja2V0Iiwic2VuZCIsIm1ldGhvZCIsInBhcmFtcyIsImxlYWRpbmciLCJkdW1wU3lzdGVtSW5mbyIsIm9uIiwidHlwZSIsIm5hbWUiLCJvcGVuVGVybWluYWwiLCJzZXRTdGF0ZSIsImV4ZWNTeW5jIiwiSlNPTiIsInN0cmluZ2lmeSIsImV4Y2VwdGlvbiIsImNvbnNvbGUiLCJ0aW1lc3RhbXAiLCJEYXRlIiwibm93IiwiZHVtcGRpciIsImpvaW4iLCJ3cml0ZUZpbGVTeW5jIiwiYXJndiIsImV4aXN0c1N5bmMiLCJyZWFkRmlsZVN5bmMiLCJ0b1N0cmluZyIsImFjdGl2ZUZvbGRlciIsInJlYWN0U3RhdGUiLCJfX2ZpbGVuYW1lIiwiX19kaXJuYW1lIiwiaG9tZWRpciIsImlzRGV2VG9vbHNPcGVuZWQiLCJjbG9zZURldlRvb2xzIiwicmVmcyIsInN0YWdlIiwidG9nZ2xlRGV2VG9vbHMiLCJ0aW1lbGluZSIsIm1heWJlUGFzdGVSZXF1ZXN0IiwicGFzdGVkVGV4dCIsInJlYWRUZXh0IiwicGFzdGVkRGF0YSIsInBhcnNlIiwid2FybiIsIkFycmF5IiwiaXNBcnJheSIsInBhc3RlZEVsZW1lbnQiLCJyZXF1ZXN0IiwidGl0bGUiLCJtZXNzYWdlIiwiY2xvc2VUZXh0IiwibGlnaHRTY2hlbWUiLCJsZW5ndGgiLCJpbmZvIiwiZGF0YSIsImhhbmRsZUNvbnRlbnRQYXN0ZSIsInN0YXJ0V2F0Y2hlcnMiLCJlbnZveSIsInBvcnQiLCJoYWlrdSIsImhvc3QiLCJXZWJTb2NrZXQiLCJnZXQiLCJ0aGVuIiwiZXhwb3J0ZXJDaGFubmVsIiwiZXZlbnQiLCJmb3JtYXQiLCJleHRlbnNpb24iLCJCb2R5bW92aW4iLCJFcnJvciIsInNob3dTYXZlRGlhbG9nIiwidW5kZWZpbmVkIiwiZGVmYXVsdFBhdGgiLCJmaWx0ZXJzIiwiZXh0ZW5zaW9ucyIsImZpbGVuYW1lIiwic2F2ZSIsInRvdXJDaGFubmVsIiwic2V0RGFzaGJvYXJkVmlzaWJpbGl0eSIsInNldFRpbWVvdXQiLCJzdGFydCIsInRocm90dGxlIiwibm90aWZ5U2NyZWVuUmVzaXplIiwiZ2xhc3NDaGFubmVsIiwiY3V0IiwiY29weSIsInBhc3RlRXZlbnQiLCJ0YWduYW1lIiwidGFyZ2V0IiwidGFnTmFtZSIsInRvTG93ZXJDYXNlIiwicHJldmVudERlZmF1bHQiLCJjYiIsImF1dGhBbnN3ZXIiLCJtZXJnZVRvUGF5bG9hZCIsImRpc3RpbmN0X2lkIiwiaGFpa3VUcmFjayIsImF1dGhUb2tlbiIsIm9yZ2FuaXphdGlvbk5hbWUiLCJpc0F1dGhlZCIsImxhdW5jaEZvbGRlciIsImZvbGRlckxvYWRpbmdFcnJvciIsIm9mZiIsInN0b3BXYXRjaGVycyIsInNlbGVjdG9yIiwid2VidmlldyIsImVsZW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwidG9wIiwibGVmdCIsInJlY2VpdmVFbGVtZW50Q29vcmRpbmF0ZXMiLCJyZWNlaXZlV2Vidmlld0Nvb3JkaW5hdGVzIiwiY29udGVudCIsImkiLCJuZXh0IiwicHJvamVjdEluZm8iLCJza2lwQ29udGVudENyZWF0aW9uIiwicHJvamVjdHNIb21lIiwicHJvamVjdFBhdGgiLCJhdXRob3JOYW1lIiwiUmF2ZW4iLCJzZXRFeHRyYUNvbnRleHQiLCJzZXRVc2VyQ29udGV4dCIsImVtYWlsIiwicHJvamVjdCIsIm9yZ2FuaXphdGlvbiIsImVyciIsImFzc2lnbiIsIm1heWJlUHJvamVjdE5hbWUiLCJpbmRleCIsImlkIiwic2xpY2UiLCJlYWNoIiwibm90aWNlIiwiTWF0aCIsInJhbmRvbSIsInJlcGxhY2VkRXhpc3RpbmciLCJmb3JFYWNoIiwibiIsInNwbGljZSIsInVuc2hpZnQiLCJkcmFnRW5kTmF0aXZlRXZlbnQiLCJsaWJyYXJ5SXRlbUluZm8iLCJsaWJyYXJ5SXRlbURyYWdnaW5nIiwicHJldmlldyIsImhhbmRsZURyb3AiLCJkcmFnU3RhcnROYXRpdmVFdmVudCIsInVzZXJXYXNBY3RpdmUiLCJsb2ciLCJwb3NpdGlvbiIsIndpZHRoIiwiaGVpZ2h0IiwicmlnaHQiLCJtYXAiLCJkaXNwbGF5IiwidmVydGljYWxBbGlnbiIsInRleHRBbGlnbiIsImNvbG9yIiwiYm90dG9tIiwicmVuZGVyU3RhcnR1cERlZmF1bHRTY3JlZW4iLCJ0cmFuc2Zvcm0iLCJmb250U2l6ZSIsIm92ZXJmbG93IiwiaGFuZGxlUGFuZVJlc2l6ZSIsInN3aXRjaEFjdGl2ZU5hdiIsIm9uTGlicmFyeURyYWdFbmQiLCJvbkxpYnJhcnlEcmFnU3RhcnQiLCJiYWNrZ3JvdW5kQ29sb3IiLCJvcGFjaXR5IiwiQ29tcG9uZW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7QUFDQTs7QUFJQTs7Ozs7Ozs7Ozs7O0FBS0EsSUFBSUEsTUFBTUMsUUFBUSxzQkFBUixDQUFWOztBQUVBLElBQUlDLFdBQVdELFFBQVEsd0NBQVIsQ0FBZjs7QUFFQSxJQUFNRSxXQUFXRixRQUFRLFVBQVIsQ0FBakI7QUFDQSxJQUFNRyxTQUFTRCxTQUFTQyxNQUF4QjtJQUNPQyxNLEdBQVVELE0sQ0FBVkMsTTs7QUFDUCxJQUFNQyxjQUFjSCxTQUFTRyxXQUE3QjtBQUNBLElBQU1DLFlBQVlKLFNBQVNJLFNBQTNCOztBQUVBLElBQUlDLFdBQVdMLFNBQVNLLFFBQXhCO0FBQ0EsSUFBSUEsUUFBSixF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RjtBQURGLGVBREY7QUErQ0U7QUFDRSxxQkFBSSxVQUROO0FBRUUsd0JBQVEsS0FBS3BKLEtBQUwsQ0FBV0UsYUFGckI7QUFHRSx1QkFBTyxLQUFLNkYsS0FIZDtBQUlFLHVCQUFPLEtBQUtoSCxLQUFMLENBQVdrSCxLQUpwQjtBQUtFLDBCQUFVLEtBQUtqRyxLQUFMLENBQVdVLFFBTHZCO0FBTUUsa0NBQWtCLEtBQUtWLEtBQUwsQ0FBV3dJLGdCQU4vQjtBQU9FLDhCQUFjLEtBQUtsSixZQVByQjtBQVFFLDhCQUFjLEtBQUtELFlBUnJCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQS9DRjtBQVRGO0FBREY7QUFSRixPQURGO0FBZ0ZEOzs7O0VBN3ZCa0MsZ0JBQU0yTixTOztrQkFBdEJsTyxPIiwiZmlsZSI6IkNyZWF0b3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgeyBTdHlsZVJvb3QgfSBmcm9tICdyYWRpdW0nXG5pbXBvcnQgU3BsaXRQYW5lIGZyb20gJ3JlYWN0LXNwbGl0LXBhbmUnXG5pbXBvcnQgUmVhY3RDU1NUcmFuc2l0aW9uR3JvdXAgZnJvbSAncmVhY3QtYWRkb25zLWNzcy10cmFuc2l0aW9uLWdyb3VwJ1xuaW1wb3J0IGxvZGFzaCBmcm9tICdsb2Rhc2gnXG5pbXBvcnQgQ29tYm9rZXlzIGZyb20gJ2NvbWJva2V5cydcbmltcG9ydCBFdmVudEVtaXR0ZXIgZnJvbSAnZXZlbnQtZW1pdHRlcidcbmltcG9ydCBjcCBmcm9tICdjaGlsZF9wcm9jZXNzJ1xuaW1wb3J0IG9zIGZyb20gJ29zJ1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcbmltcG9ydCBmcyBmcm9tICdmcydcbmltcG9ydCBBdXRoZW50aWNhdGlvblVJIGZyb20gJy4vY29tcG9uZW50cy9BdXRoZW50aWNhdGlvblVJJ1xuaW1wb3J0IFByb2plY3RCcm93c2VyIGZyb20gJy4vY29tcG9uZW50cy9Qcm9qZWN0QnJvd3NlcidcbmltcG9ydCBTaWRlQmFyIGZyb20gJy4vY29tcG9uZW50cy9TaWRlQmFyJ1xuaW1wb3J0IExpYnJhcnkgZnJvbSAnLi9jb21wb25lbnRzL2xpYnJhcnkvTGlicmFyeSdcbmltcG9ydCBTdGF0ZUluc3BlY3RvciBmcm9tICcuL2NvbXBvbmVudHMvU3RhdGVJbnNwZWN0b3IvU3RhdGVJbnNwZWN0b3InXG5pbXBvcnQgU3RhZ2UgZnJvbSAnLi9jb21wb25lbnRzL1N0YWdlJ1xuaW1wb3J0IFRpbWVsaW5lIGZyb20gJy4vY29tcG9uZW50cy9UaW1lbGluZSdcbmltcG9ydCBUb2FzdCBmcm9tICcuL2NvbXBvbmVudHMvbm90aWZpY2F0aW9ucy9Ub2FzdCdcbmltcG9ydCBUb3VyIGZyb20gJy4vY29tcG9uZW50cy9Ub3VyL1RvdXInXG5pbXBvcnQgQXV0b1VwZGF0ZXIgZnJvbSAnLi9jb21wb25lbnRzL0F1dG9VcGRhdGVyJ1xuaW1wb3J0IEVudm95Q2xpZW50IGZyb20gJ2hhaWt1LXNkay1jcmVhdG9yL2xpYi9lbnZveS9jbGllbnQnXG5pbXBvcnQgeyBFWFBPUlRFUl9DSEFOTkVMLCBFeHBvcnRlckZvcm1hdCB9IGZyb20gJ2hhaWt1LXNkay1jcmVhdG9yL2xpYi9leHBvcnRlcidcbmltcG9ydCB7IEdMQVNTX0NIQU5ORUwgfSBmcm9tICdoYWlrdS1zZGstY3JlYXRvci9saWIvZ2xhc3MnXG5pbXBvcnQgQWN0aXZpdHlNb25pdG9yIGZyb20gJy4uL3V0aWxzL2FjdGl2aXR5TW9uaXRvci5qcydcbmltcG9ydCB7XG4gIGxpbmtFeHRlcm5hbEFzc2V0c09uRHJvcCxcbiAgcHJldmVudERlZmF1bHREcmFnXG59IGZyb20gJ2hhaWt1LXNlcmlhbGl6YXRpb24vc3JjL3V0aWxzL2RuZEhlbHBlcnMnXG5pbXBvcnQge1xuICBIT01FRElSX1BBVEgsXG4gIEhPTUVESVJfTE9HU19QQVRIXG59IGZyb20gJ2hhaWt1LXNlcmlhbGl6YXRpb24vc3JjL3V0aWxzL0hhaWt1SG9tZURpcidcblxudmFyIHBrZyA9IHJlcXVpcmUoJy4vLi4vLi4vcGFja2FnZS5qc29uJylcblxudmFyIG1peHBhbmVsID0gcmVxdWlyZSgnaGFpa3Utc2VyaWFsaXphdGlvbi9zcmMvdXRpbHMvTWl4cGFuZWwnKVxuXG5jb25zdCBlbGVjdHJvbiA9IHJlcXVpcmUoJ2VsZWN0cm9uJylcbmNvbnN0IHJlbW90ZSA9IGVsZWN0cm9uLnJlbW90ZVxuY29uc3Qge2RpYWxvZ30gPSByZW1vdGVcbmNvbnN0IGlwY1JlbmRlcmVyID0gZWxlY3Ryb24uaXBjUmVuZGVyZXJcbmNvbnN0IGNsaXBib2FyZCA9IGVsZWN0cm9uLmNsaXBib2FyZFxuXG52YXIgd2ViRnJhbWUgPSBlbGVjdHJvbi53ZWJGcmFtZVxuaWYgKHdlYkZyYW1lKSB7XG4gIGlmICh3ZWJGcmFtZS5zZXRab29tTGV2ZWxMaW1pdHMpIHdlYkZyYW1lLnNldFpvb21MZXZlbExpbWl0cygxLCAxKVxuICBpZiAod2ViRnJhbWUuc2V0TGF5b3V0Wm9vbUxldmVsTGltaXRzKSB3ZWJGcmFtZS5zZXRMYXlvdXRab29tTGV2ZWxMaW1pdHMoMCwgMClcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ3JlYXRvciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yIChwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKVxuICAgIHRoaXMuYXV0aGVudGljYXRlVXNlciA9IHRoaXMuYXV0aGVudGljYXRlVXNlci5iaW5kKHRoaXMpXG4gICAgdGhpcy5hdXRoZW50aWNhdGlvbkNvbXBsZXRlID0gdGhpcy5hdXRoZW50aWNhdGlvbkNvbXBsZXRlLmJpbmQodGhpcylcbiAgICB0aGlzLmxvYWRQcm9qZWN0cyA9IHRoaXMubG9hZFByb2plY3RzLmJpbmQodGhpcylcbiAgICB0aGlzLmxhdW5jaFByb2plY3QgPSB0aGlzLmxhdW5jaFByb2plY3QuYmluZCh0aGlzKVxuICAgIHRoaXMucmVtb3ZlTm90aWNlID0gdGhpcy5yZW1vdmVOb3RpY2UuYmluZCh0aGlzKVxuICAgIHRoaXMuY3JlYXRlTm90aWNlID0gdGhpcy5jcmVhdGVOb3RpY2UuYmluZCh0aGlzKVxuICAgIHRoaXMucmVuZGVyTm90aWZpY2F0aW9ucyA9IHRoaXMucmVuZGVyTm90aWZpY2F0aW9ucy5iaW5kKHRoaXMpXG4gICAgdGhpcy5yZWNlaXZlUHJvamVjdEluZm8gPSB0aGlzLnJlY2VpdmVQcm9qZWN0SW5mby5iaW5kKHRoaXMpXG4gICAgdGhpcy5oYW5kbGVGaW5kRWxlbWVudENvb3JkaW5hdGVzID0gdGhpcy5oYW5kbGVGaW5kRWxlbWVudENvb3JkaW5hdGVzLmJpbmQodGhpcylcbiAgICB0aGlzLmhhbmRsZUZpbmRXZWJ2aWV3Q29vcmRpbmF0ZXMgPSB0aGlzLmhhbmRsZUZpbmRXZWJ2aWV3Q29vcmRpbmF0ZXMuYmluZCh0aGlzKVxuICAgIHRoaXMub25BdXRvVXBkYXRlQ2hlY2tDb21wbGV0ZSA9IHRoaXMub25BdXRvVXBkYXRlQ2hlY2tDb21wbGV0ZS5iaW5kKHRoaXMpXG4gICAgdGhpcy5sYXlvdXQgPSBuZXcgRXZlbnRFbWl0dGVyKClcbiAgICB0aGlzLmFjdGl2aXR5TW9uaXRvciA9IG5ldyBBY3Rpdml0eU1vbml0b3Iod2luZG93LCB0aGlzLm9uQWN0aXZpdHlSZXBvcnQuYmluZCh0aGlzKSlcblxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBlcnJvcjogbnVsbCxcbiAgICAgIHByb2plY3RGb2xkZXI6IHRoaXMucHJvcHMuZm9sZGVyLFxuICAgICAgYXBwbGljYXRpb25JbWFnZTogbnVsbCxcbiAgICAgIHByb2plY3RPYmplY3Q6IG51bGwsXG4gICAgICBwcm9qZWN0TmFtZTogbnVsbCxcbiAgICAgIGRhc2hib2FyZFZpc2libGU6ICF0aGlzLnByb3BzLmZvbGRlcixcbiAgICAgIHJlYWR5Rm9yQXV0aDogZmFsc2UsXG4gICAgICBpc1VzZXJBdXRoZW50aWNhdGVkOiBmYWxzZSxcbiAgICAgIHVzZXJuYW1lOiBudWxsLFxuICAgICAgcGFzc3dvcmQ6IG51bGwsXG4gICAgICBub3RpY2VzOiBbXSxcbiAgICAgIHNvZnR3YXJlVmVyc2lvbjogcGtnLnZlcnNpb24sXG4gICAgICBkaWRQbHVtYmluZ05vdGljZUNyYXNoOiBmYWxzZSxcbiAgICAgIGFjdGl2ZU5hdjogJ2xpYnJhcnknLFxuICAgICAgcHJvamVjdHNMaXN0OiBbXSxcbiAgICAgIHVwZGF0ZXI6IHtcbiAgICAgICAgc2hvdWxkQ2hlY2s6IHRydWUsXG4gICAgICAgIHNob3VsZFJ1bk9uQmFja2dyb3VuZDogdHJ1ZSxcbiAgICAgICAgc2hvdWxkU2tpcE9wdEluOiB0cnVlXG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3Qgd2luID0gcmVtb3RlLmdldEN1cnJlbnRXaW5kb3coKVxuXG4gICAgaWYgKHByb2Nlc3MuZW52LkRFViA9PT0gJzEnKSB7XG4gICAgICB3aW4ub3BlbkRldlRvb2xzKClcbiAgICB9XG5cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCAobmF0aXZlRXZlbnQpID0+IHtcbiAgICAgIHRoaXMuX2xhc3RNb3VzZVggPSBuYXRpdmVFdmVudC5jbGllbnRYXG4gICAgICB0aGlzLl9sYXN0TW91c2VZID0gbmF0aXZlRXZlbnQuY2xpZW50WVxuICAgIH0pXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignZHJhZycsIChuYXRpdmVFdmVudCkgPT4ge1xuICAgICAgLy8gV2hlbiB0aGUgZHJhZyBlbmRzLCBmb3Igc29tZSByZWFzb24gdGhlIHBvc2l0aW9uIGdvZXMgdG8gMCwgc28gaGFjayB0aGlzLi4uXG4gICAgICBpZiAobmF0aXZlRXZlbnQuY2xpZW50WCA+IDAgJiYgbmF0aXZlRXZlbnQuY2xpZW50WSA+IDApIHtcbiAgICAgICAgdGhpcy5fbGFzdE1vdXNlWCA9IG5hdGl2ZUV2ZW50LmNsaWVudFhcbiAgICAgICAgdGhpcy5fbGFzdE1vdXNlWSA9IG5hdGl2ZUV2ZW50LmNsaWVudFlcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgY29uc3QgY29tYm9rZXlzID0gbmV3IENvbWJva2V5cyhkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpXG5cbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgY29tYm9rZXlzLmJpbmQoJ2NvbW1hbmQrb3B0aW9uK2knLCBsb2Rhc2guZGVib3VuY2UoKCkgPT4ge1xuICAgICAgICB0aGlzLnByb3BzLndlYnNvY2tldC5zZW5kKHsgbWV0aG9kOiAndG9nZ2xlRGV2VG9vbHMnLCBwYXJhbXM6IFt0aGlzLnN0YXRlLnByb2plY3RGb2xkZXJdIH0pXG4gICAgICB9LCA1MDAsIHsgbGVhZGluZzogdHJ1ZSB9KSlcbiAgICB9XG5cbiAgICBjb21ib2tleXMuYmluZCgnY29tbWFuZCtvcHRpb24rMCcsIGxvZGFzaC5kZWJvdW5jZSgoKSA9PiB7XG4gICAgICB0aGlzLmR1bXBTeXN0ZW1JbmZvKClcbiAgICB9LCA1MDAsIHsgbGVhZGluZzogdHJ1ZSB9KSlcblxuICAgIC8vIE5PVEU6IFRoZSBUb3BNZW51IGF1dG9tYXRpY2FsbHkgYmluZHMgdGhlIGJlbG93IGtleWJvYXJkIHNob3J0Y3V0cy9hY2NlbGVyYXRvcnNcbiAgICBpcGNSZW5kZXJlci5vbignZ2xvYmFsLW1lbnU6em9vbS1pbicsICgpID0+IHtcbiAgICAgIHRoaXMucHJvcHMud2Vic29ja2V0LnNlbmQoeyB0eXBlOiAnYnJvYWRjYXN0JywgbmFtZTogJ3ZpZXc6em9vbS1pbicgfSlcbiAgICB9KVxuICAgIGlwY1JlbmRlcmVyLm9uKCdnbG9iYWwtbWVudTp6b29tLW91dCcsICgpID0+IHtcbiAgICAgIHRoaXMucHJvcHMud2Vic29ja2V0LnNlbmQoeyB0eXBlOiAnYnJvYWRjYXN0JywgbmFtZTogJ3ZpZXc6em9vbS1vdXQnIH0pXG4gICAgfSlcbiAgICBpcGNSZW5kZXJlci5vbignZ2xvYmFsLW1lbnU6b3Blbi10ZXJtaW5hbCcsIGxvZGFzaC5kZWJvdW5jZSgoKSA9PiB7XG4gICAgICB0aGlzLm9wZW5UZXJtaW5hbCh0aGlzLnN0YXRlLnByb2plY3RGb2xkZXIpXG4gICAgfSwgNTAwLCB7IGxlYWRpbmc6IHRydWUgfSkpXG4gICAgaXBjUmVuZGVyZXIub24oJ2dsb2JhbC1tZW51OnVuZG8nLCBsb2Rhc2guZGVib3VuY2UoKCkgPT4ge1xuICAgICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQuc2VuZCh7IG1ldGhvZDogJ2dpdFVuZG8nLCBwYXJhbXM6IFt0aGlzLnN0YXRlLnByb2plY3RGb2xkZXIsIHsgdHlwZTogJ2dsb2JhbCcgfV0gfSlcbiAgICB9LCA1MDAsIHsgbGVhZGluZzogdHJ1ZSB9KSlcbiAgICBpcGNSZW5kZXJlci5vbignZ2xvYmFsLW1lbnU6cmVkbycsIGxvZGFzaC5kZWJvdW5jZSgoKSA9PiB7XG4gICAgICB0aGlzLnByb3BzLndlYnNvY2tldC5zZW5kKHsgbWV0aG9kOiAnZ2l0UmVkbycsIHBhcmFtczogW3RoaXMuc3RhdGUucHJvamVjdEZvbGRlciwgeyB0eXBlOiAnZ2xvYmFsJyB9XSB9KVxuICAgIH0sIDUwMCwgeyBsZWFkaW5nOiB0cnVlIH0pKVxuICAgIGlwY1JlbmRlcmVyLm9uKCdnbG9iYWwtbWVudTpjaGVjay11cGRhdGVzJywgKCkgPT4ge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIHVwZGF0ZXI6IHtcbiAgICAgICAgICBzaG91bGRDaGVjazogdHJ1ZSxcbiAgICAgICAgICBzaG91bGRSdW5PbkJhY2tncm91bmQ6IGZhbHNlLFxuICAgICAgICAgIHNob3VsZFNraXBPcHRJbjogdHJ1ZVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH0pXG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ292ZXInLCBwcmV2ZW50RGVmYXVsdERyYWcsIGZhbHNlKVxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdkcm9wJywgbGlua0V4dGVybmFsQXNzZXRzT25Ecm9wLmJpbmQodGhpcyksIGZhbHNlKVxuICB9XG5cbiAgb3BlblRlcm1pbmFsIChmb2xkZXIpIHtcbiAgICB0cnkge1xuICAgICAgY3AuZXhlY1N5bmMoJ29wZW4gLWIgY29tLmFwcGxlLnRlcm1pbmFsICcgKyBKU09OLnN0cmluZ2lmeShmb2xkZXIpICsgJyB8fCB0cnVlJylcbiAgICB9IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoZXhjZXB0aW9uKVxuICAgIH1cbiAgfVxuXG4gIGR1bXBTeXN0ZW1JbmZvICgpIHtcbiAgICBjb25zdCB0aW1lc3RhbXAgPSBEYXRlLm5vdygpXG4gICAgY29uc3QgZHVtcGRpciA9IHBhdGguam9pbihIT01FRElSX1BBVEgsICdkdW1wcycsIGBkdW1wLSR7dGltZXN0YW1wfWApXG4gICAgY3AuZXhlY1N5bmMoYG1rZGlyIC1wICR7SlNPTi5zdHJpbmdpZnkoZHVtcGRpcil9YClcbiAgICBmcy53cml0ZUZpbGVTeW5jKHBhdGguam9pbihkdW1wZGlyLCAnYXJndicpLCBKU09OLnN0cmluZ2lmeShwcm9jZXNzLmFyZ3YsIG51bGwsIDIpKVxuICAgIGZzLndyaXRlRmlsZVN5bmMocGF0aC5qb2luKGR1bXBkaXIsICdlbnYnKSwgSlNPTi5zdHJpbmdpZnkocHJvY2Vzcy5lbnYsIG51bGwsIDIpKVxuICAgIGlmIChmcy5leGlzdHNTeW5jKHBhdGguam9pbihIT01FRElSX0xPR1NfUEFUSCwgJ2hhaWt1LWRlYnVnLmxvZycpKSkge1xuICAgICAgZnMud3JpdGVGaWxlU3luYyhwYXRoLmpvaW4oZHVtcGRpciwgJ2xvZycpLCBmcy5yZWFkRmlsZVN5bmMocGF0aC5qb2luKEhPTUVESVJfTE9HU19QQVRILCAnaGFpa3UtZGVidWcubG9nJykpLnRvU3RyaW5nKCkpXG4gICAgfVxuICAgIGZzLndyaXRlRmlsZVN5bmMocGF0aC5qb2luKGR1bXBkaXIsICdpbmZvJyksIEpTT04uc3RyaW5naWZ5KHtcbiAgICAgIGFjdGl2ZUZvbGRlcjogdGhpcy5zdGF0ZS5wcm9qZWN0Rm9sZGVyLFxuICAgICAgcmVhY3RTdGF0ZTogdGhpcy5zdGF0ZSxcbiAgICAgIF9fZmlsZW5hbWU6IF9fZmlsZW5hbWUsXG4gICAgICBfX2Rpcm5hbWU6IF9fZGlybmFtZVxuICAgIH0sIG51bGwsIDIpKVxuICAgIGlmICh0aGlzLnN0YXRlLnByb2plY3RGb2xkZXIpIHtcbiAgICAgIC8vIFRoZSBwcm9qZWN0IGZvbGRlciBpdHNlbGYgd2lsbCBjb250YWluIGdpdCBsb2dzIGFuZCBvdGhlciBnb29kaWVzIHdlIG1naWh0IHdhbnQgdG8gbG9vayBhdFxuICAgICAgY3AuZXhlY1N5bmMoYHRhciAtemN2ZiAke0pTT04uc3RyaW5naWZ5KHBhdGguam9pbihkdW1wZGlyLCAncHJvamVjdC50YXIuZ3onKSl9ICR7SlNPTi5zdHJpbmdpZnkodGhpcy5zdGF0ZS5wcm9qZWN0Rm9sZGVyKX1gKVxuICAgIH1cbiAgICAvLyBGb3IgY29udmVuaWVuY2UsIHppcCB1cCB0aGUgZW50aXJlIGR1bXAgZm9sZGVyLi4uXG4gICAgY3AuZXhlY1N5bmMoYHRhciAtemN2ZiAke0pTT04uc3RyaW5naWZ5KHBhdGguam9pbihvcy5ob21lZGlyKCksIGBoYWlrdS1kdW1wLSR7dGltZXN0YW1wfS50YXIuZ3pgKSl9ICR7SlNPTi5zdHJpbmdpZnkoZHVtcGRpcil9YClcbiAgfVxuXG4gIHRvZ2dsZURldlRvb2xzICgpIHtcbiAgICBjb25zdCB3aW4gPSByZW1vdGUuZ2V0Q3VycmVudFdpbmRvdygpXG4gICAgaWYgKHdpbi5pc0RldlRvb2xzT3BlbmVkKCkpIHdpbi5jbG9zZURldlRvb2xzKClcbiAgICBlbHNlIHdpbi5vcGVuRGV2VG9vbHMoKVxuICAgIGlmICh0aGlzLnJlZnMuc3RhZ2UpIHRoaXMucmVmcy5zdGFnZS50b2dnbGVEZXZUb29scygpXG4gICAgaWYgKHRoaXMucmVmcy50aW1lbGluZSkgdGhpcy5yZWZzLnRpbWVsaW5lLnRvZ2dsZURldlRvb2xzKClcbiAgfVxuXG4gIGhhbmRsZUNvbnRlbnRQYXN0ZSAobWF5YmVQYXN0ZVJlcXVlc3QpIHtcbiAgICBsZXQgcGFzdGVkVGV4dCA9IGNsaXBib2FyZC5yZWFkVGV4dCgpXG4gICAgaWYgKCFwYXN0ZWRUZXh0KSByZXR1cm4gdm9pZCAoMClcblxuICAgIC8vIFRoZSBkYXRhIG9uIHRoZSBjbGlwYm9hcmQgbWlnaHQgYmUgc2VyaWFsaXplZCBkYXRhLCBzbyB0cnkgdG8gcGFyc2UgaXQgaWYgdGhhdCdzIHRoZSBjYXNlXG4gICAgLy8gVGhlIG1haW4gY2FzZSB3ZSBoYXZlIG5vdyBmb3Igc2VyaWFsaXplZCBkYXRhIGlzIGhhaWt1IGVsZW1lbnRzIGNvcGllZCBmcm9tIHRoZSBzdGFnZVxuICAgIGxldCBwYXN0ZWREYXRhXG4gICAgdHJ5IHtcbiAgICAgIHBhc3RlZERhdGEgPSBKU09OLnBhcnNlKHBhc3RlZFRleHQpXG4gICAgfSBjYXRjaCAoZXhjZXB0aW9uKSB7XG4gICAgICBjb25zb2xlLndhcm4oJ1tjcmVhdG9yXSB1bmFibGUgdG8gcGFyc2UgcGFzdGVkIGRhdGE7IGl0IG1pZ2h0IGJlIHBsYWluIHRleHQnKVxuICAgICAgcGFzdGVkRGF0YSA9IHBhc3RlZFRleHRcbiAgICB9XG5cbiAgICBpZiAoQXJyYXkuaXNBcnJheShwYXN0ZWREYXRhKSkge1xuICAgICAgLy8gVGhpcyBsb29rcyBsaWtlIGEgSGFpa3UgZWxlbWVudCB0aGF0IGhhcyBiZWVuIGNvcGllZCBmcm9tIHRoZSBzdGFnZVxuICAgICAgaWYgKHBhc3RlZERhdGFbMF0gPT09ICdhcHBsaWNhdGlvbi9oYWlrdScgJiYgdHlwZW9mIHBhc3RlZERhdGFbMV0gPT09ICdvYmplY3QnKSB7XG4gICAgICAgIGxldCBwYXN0ZWRFbGVtZW50ID0gcGFzdGVkRGF0YVsxXVxuXG4gICAgICAgIC8vIENvbW1hbmQgdGhlIHZpZXdzIGFuZCBtYXN0ZXIgcHJvY2VzcyB0byBoYW5kbGUgdGhlIGVsZW1lbnQgcGFzdGUgYWN0aW9uXG4gICAgICAgIC8vIFRoZSAncGFzdGVUaGluZycgYWN0aW9uIGlzIGludGVuZGVkIHRvIGJlIGFibGUgdG8gaGFuZGxlIG11bHRpcGxlIGNvbnRlbnQgdHlwZXNcbiAgICAgICAgcmV0dXJuIHRoaXMucHJvcHMud2Vic29ja2V0LnJlcXVlc3QoeyB0eXBlOiAnYWN0aW9uJywgbWV0aG9kOiAncGFzdGVUaGluZycsIHBhcmFtczogW3RoaXMuc3RhdGUucHJvamVjdEZvbGRlciwgcGFzdGVkRWxlbWVudCwgbWF5YmVQYXN0ZVJlcXVlc3QgfHwge31dIH0sIChlcnJvcikgPT4ge1xuICAgICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcilcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNyZWF0ZU5vdGljZSh7XG4gICAgICAgICAgICAgIHR5cGU6ICd3YXJuaW5nJyxcbiAgICAgICAgICAgICAgdGl0bGU6ICdVaCBvaCEnLFxuICAgICAgICAgICAgICBtZXNzYWdlOiAnV2UgY291bGRuXFwndCBwYXN0ZSB0aGF0LiDwn5iiIFBsZWFzZSBjb250YWN0IEhhaWt1IGZvciBzdXBwb3J0LicsXG4gICAgICAgICAgICAgIGNsb3NlVGV4dDogJ09rYXknLFxuICAgICAgICAgICAgICBsaWdodFNjaGVtZTogdHJ1ZVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBUT0RPOiBIYW5kbGUgb3RoZXIgY2FzZXMgd2hlcmUgdGhlIHBhc3RlIGRhdGEgd2FzIGEgc2VyaWFsaXplZCBhcnJheVxuICAgICAgICBjb25zb2xlLndhcm4oJ1tjcmVhdG9yXSBjYW5ub3QgcGFzdGUgdGhpcyBjb250ZW50IHR5cGUgeWV0IChhcnJheSknKVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBBbiBlbXB0eSBzdHJpbmcgaXMgdHJlYXRlZCBhcyB0aGUgZXF1aXZhbGVudCBvZiBub3RoaW5nIChkb24ndCBkaXNwbGF5IHdhcm5pbmcgaWYgbm90aGluZyB0byBpbnN0YW50aWF0ZSlcbiAgICAgIGlmICh0eXBlb2YgcGFzdGVkRGF0YSA9PT0gJ3N0cmluZycgJiYgcGFzdGVkRGF0YS5sZW5ndGggPiAwKSB7XG4gICAgICAgIC8vIFRPRE86IEhhbmRsZSB0aGUgY2FzZSB3aGVuIHBsYWluIHRleHQgaGFzIGJlZW4gcGFzdGVkIC0gU1ZHLCBIVE1MLCBldGM/XG4gICAgICAgIGNvbnNvbGUud2FybignW2NyZWF0b3JdIGNhbm5vdCBwYXN0ZSB0aGlzIGNvbnRlbnQgdHlwZSB5ZXQgKHVua25vd24gc3RyaW5nKScpXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgY29tcG9uZW50V2lsbE1vdW50ICgpIHtcbiAgICB0aGlzLnByb3BzLndlYnNvY2tldC5vbignYnJvYWRjYXN0JywgKG1lc3NhZ2UpID0+IHtcbiAgICAgIHN3aXRjaCAobWVzc2FnZS5uYW1lKSB7XG4gICAgICAgIGNhc2UgJ2Rldi10b29sczp0b2dnbGUnOlxuICAgICAgICAgIHRoaXMudG9nZ2xlRGV2VG9vbHMoKVxuICAgICAgICAgIGJyZWFrXG5cbiAgICAgICAgY2FzZSAnY3VycmVudC1wYXN0ZWFibGU6cmVxdWVzdC1wYXN0ZSc6XG4gICAgICAgICAgY29uc29sZS5pbmZvKCdbY3JlYXRvcl0gY3VycmVudC1wYXN0ZWFibGU6cmVxdWVzdC1wYXN0ZScsIG1lc3NhZ2UuZGF0YSlcbiAgICAgICAgICByZXR1cm4gdGhpcy5oYW5kbGVDb250ZW50UGFzdGUobWVzc2FnZS5kYXRhKVxuICAgICAgfVxuICAgIH0pXG5cbiAgICB0aGlzLmFjdGl2aXR5TW9uaXRvci5zdGFydFdhdGNoZXJzKClcblxuICAgIHRoaXMuZW52b3kgPSBuZXcgRW52b3lDbGllbnQoe1xuICAgICAgcG9ydDogdGhpcy5wcm9wcy5oYWlrdS5lbnZveS5wb3J0LFxuICAgICAgaG9zdDogdGhpcy5wcm9wcy5oYWlrdS5lbnZveS5ob3N0LFxuICAgICAgV2ViU29ja2V0OiB3aW5kb3cuV2ViU29ja2V0XG4gICAgfSlcblxuICAgIHRoaXMuZW52b3kuZ2V0KEVYUE9SVEVSX0NIQU5ORUwpLnRoZW4oKGV4cG9ydGVyQ2hhbm5lbCkgPT4ge1xuICAgICAgaXBjUmVuZGVyZXIub24oJ2dsb2JhbC1tZW51OmV4cG9ydCcsIChldmVudCwgW2Zvcm1hdF0pID0+IHtcbiAgICAgICAgbGV0IGV4dGVuc2lvblxuICAgICAgICBzd2l0Y2ggKGZvcm1hdCkge1xuICAgICAgICAgIGNhc2UgRXhwb3J0ZXJGb3JtYXQuQm9keW1vdmluOlxuICAgICAgICAgICAgZXh0ZW5zaW9uID0gJ2pzb24nXG4gICAgICAgICAgICBicmVha1xuICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFVuc3VwcG9ydGVkIGZvcm1hdDogJHtmb3JtYXR9YClcbiAgICAgICAgfVxuXG4gICAgICAgIGRpYWxvZy5zaG93U2F2ZURpYWxvZyh1bmRlZmluZWQsIHtcbiAgICAgICAgICBkZWZhdWx0UGF0aDogYCovJHt0aGlzLnN0YXRlLnByb2plY3ROYW1lfWAsXG4gICAgICAgICAgZmlsdGVyczogW3tcbiAgICAgICAgICAgIG5hbWU6IGZvcm1hdCxcbiAgICAgICAgICAgIGV4dGVuc2lvbnM6IFtleHRlbnNpb25dXG4gICAgICAgICAgfV1cbiAgICAgICAgfSxcbiAgICAgICAgKGZpbGVuYW1lKSA9PiB7XG4gICAgICAgICAgZXhwb3J0ZXJDaGFubmVsLnNhdmUoe2Zvcm1hdCwgZmlsZW5hbWV9KVxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgdGhpcy5lbnZveS5nZXQoJ3RvdXInKS50aGVuKCh0b3VyQ2hhbm5lbCkgPT4ge1xuICAgICAgdGhpcy50b3VyQ2hhbm5lbCA9IHRvdXJDaGFubmVsXG5cbiAgICAgIHRvdXJDaGFubmVsLm9uKCd0b3VyOnJlcXVlc3RFbGVtZW50Q29vcmRpbmF0ZXMnLCB0aGlzLmhhbmRsZUZpbmRFbGVtZW50Q29vcmRpbmF0ZXMpXG5cbiAgICAgIHRvdXJDaGFubmVsLm9uKCd0b3VyOnJlcXVlc3RXZWJ2aWV3Q29vcmRpbmF0ZXMnLCB0aGlzLmhhbmRsZUZpbmRXZWJ2aWV3Q29vcmRpbmF0ZXMpXG5cbiAgICAgIGlwY1JlbmRlcmVyLm9uKCdnbG9iYWwtbWVudTpzdGFydC10b3VyJywgKCkgPT4ge1xuICAgICAgICB0aGlzLnNldERhc2hib2FyZFZpc2liaWxpdHkodHJ1ZSlcblxuICAgICAgICAvLyBQdXQgaXQgYXQgdGhlIGJvdHRvbSBvZiB0aGUgZXZlbnQgbG9vcFxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICB0b3VyQ2hhbm5lbC5zdGFydCh0cnVlKVxuICAgICAgICB9KVxuICAgICAgfSlcblxuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIGxvZGFzaC50aHJvdHRsZSgoKSA9PiB7XG4gICAgICAgIC8vIGlmICh0b3VyQ2hhbm5lbC5pc1RvdXJBY3RpdmUoKSkge1xuICAgICAgICB0b3VyQ2hhbm5lbC5ub3RpZnlTY3JlZW5SZXNpemUoKVxuICAgICAgICAvLyB9XG4gICAgICB9KSwgMzAwKVxuICAgIH0pXG5cbiAgICB0aGlzLmVudm95LmdldChHTEFTU19DSEFOTkVMKS50aGVuKChnbGFzc0NoYW5uZWwpID0+IHtcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2N1dCcsIGdsYXNzQ2hhbm5lbC5jdXQpXG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjb3B5JywgZ2xhc3NDaGFubmVsLmNvcHkpXG4gICAgfSlcblxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3Bhc3RlJywgKHBhc3RlRXZlbnQpID0+IHtcbiAgICAgIGNvbnNvbGUuaW5mbygnW2NyZWF0b3JdIHBhc3RlIGhlYXJkJylcbiAgICAgIGxldCB0YWduYW1lID0gcGFzdGVFdmVudC50YXJnZXQudGFnTmFtZS50b0xvd2VyQ2FzZSgpXG4gICAgICBpZiAodGFnbmFtZSA9PT0gJ2lucHV0JyB8fCB0YWduYW1lID09PSAndGV4dGFyZWEnKSB7XG4gICAgICAgIC8vIERvIG5vdGhpbmc7IGxldCBpbnB1dCBmaWVsZHMgYW5kIHNvLW9uIGJlIGhhbmRsZWQgbm9ybWFsbHlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIE90aGVyd2lzZSwgYXNzdW1lIHdlIG1pZ2h0IG5lZWQgdG8gaGFuZGxlIHRoaXMgcGFzdGUgZXZlbnQgc3BlY2lhbGx5XG4gICAgICAgIHBhc3RlRXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgICAgICB0aGlzLmhhbmRsZUNvbnRlbnRQYXN0ZSgpXG4gICAgICB9XG4gICAgfSlcblxuICAgIHRoaXMucHJvcHMud2Vic29ja2V0Lm9uKCdtZXRob2QnLCAobWV0aG9kLCBwYXJhbXMsIGNiKSA9PiB7XG4gICAgICBjb25zb2xlLmluZm8oJ1tjcmVhdG9yXSBtZXRob2QgZnJvbSBwbHVtYmluZzonLCBtZXRob2QsIHBhcmFtcylcbiAgICAgIC8vIG5vLW9wOyBjcmVhdG9yIGRvZXNuJ3QgY3VycmVudGx5IHJlY2VpdmUgYW55IG1ldGhvZHMgZnJvbSB0aGUgb3RoZXIgdmlld3MsIGJ1dCB3ZSBuZWVkIHRoaXNcbiAgICAgIC8vIGNhbGxiYWNrIHRvIGJlIGNhbGxlZCB0byBhbGxvdyB0aGUgYWN0aW9uIGNoYWluIGluIHBsdW1iaW5nIHRvIHByb2NlZWRcbiAgICAgIHJldHVybiBjYigpXG4gICAgfSlcblxuICAgIHRoaXMucHJvcHMud2Vic29ja2V0Lm9uKCdvcGVuJywgKCkgPT4ge1xuICAgICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQucmVxdWVzdCh7IG1ldGhvZDogJ2lzVXNlckF1dGhlbnRpY2F0ZWQnLCBwYXJhbXM6IFtdIH0sIChlcnJvciwgYXV0aEFuc3dlcikgPT4ge1xuICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICBpZiAoZXJyb3IubWVzc2FnZSA9PT0gJ09yZ2FuaXphdGlvbiBlcnJvcicpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgICBpc1VzZXJBdXRoZW50aWNhdGVkOiBmYWxzZSxcbiAgICAgICAgICAgICAgdXNlcm5hbWU6IG51bGwsXG4gICAgICAgICAgICAgIHBhc3N3b3JkOiBudWxsLFxuICAgICAgICAgICAgICByZWFkeUZvckF1dGg6IHRydWVcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNyZWF0ZU5vdGljZSh7XG4gICAgICAgICAgICAgIHR5cGU6ICdlcnJvcicsXG4gICAgICAgICAgICAgIHRpdGxlOiAnT2ggbm8hJyxcbiAgICAgICAgICAgICAgbWVzc2FnZTogJ1dlIGhhZCBhIHByb2JsZW0gYWNjZXNzaW5nIHlvdXIgYWNjb3VudC4g8J+YoiBQbGVhc2UgdHJ5IGNsb3NpbmcgYW5kIHJlb3BlbmluZyB0aGUgYXBwbGljYXRpb24uIElmIHlvdSBzdGlsbCBzZWUgdGhpcyBtZXNzYWdlLCBjb250YWN0IEhhaWt1IGZvciBzdXBwb3J0LicsXG4gICAgICAgICAgICAgIGNsb3NlVGV4dDogJ09rYXknLFxuICAgICAgICAgICAgICBsaWdodFNjaGVtZTogdHJ1ZVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBtaXhwYW5lbC5tZXJnZVRvUGF5bG9hZCh7IGRpc3RpbmN0X2lkOiBhdXRoQW5zd2VyICYmIGF1dGhBbnN3ZXIudXNlcm5hbWUgfSlcbiAgICAgICAgbWl4cGFuZWwuaGFpa3VUcmFjaygnY3JlYXRvcjpvcGVuZWQnKVxuXG4gICAgICAgIC8vIERlbGF5IHNvIHRoZSBkZWZhdWx0IHN0YXJ0dXAgc2NyZWVuIGRvZXNuJ3QganVzdCBmbGFzaCB0aGVuIGdvIGF3YXlcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICByZWFkeUZvckF1dGg6IHRydWUsXG4gICAgICAgICAgICBhdXRoVG9rZW46IGF1dGhBbnN3ZXIgJiYgYXV0aEFuc3dlci5hdXRoVG9rZW4sXG4gICAgICAgICAgICBvcmdhbml6YXRpb25OYW1lOiBhdXRoQW5zd2VyICYmIGF1dGhBbnN3ZXIub3JnYW5pemF0aW9uTmFtZSxcbiAgICAgICAgICAgIHVzZXJuYW1lOiBhdXRoQW5zd2VyICYmIGF1dGhBbnN3ZXIudXNlcm5hbWUsXG4gICAgICAgICAgICBpc1VzZXJBdXRoZW50aWNhdGVkOiBhdXRoQW5zd2VyICYmIGF1dGhBbnN3ZXIuaXNBdXRoZWRcbiAgICAgICAgICB9KVxuXG4gICAgICAgICAgaWYgKHRoaXMucHJvcHMuZm9sZGVyKSB7XG4gICAgICAgICAgICAvLyBMYXVuY2ggZm9sZGVyIGRpcmVjdGx5IC0gaS5lLiBhbGxvdyBhICdzdWJsJyBsaWtlIGV4cGVyaWVuY2Ugd2l0aG91dCBoYXZpbmcgdG8gZ29cbiAgICAgICAgICAgIC8vIHRocm91Z2ggdGhlIHByb2plY3RzIGluZGV4XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5sYXVuY2hGb2xkZXIobnVsbCwgdGhpcy5wcm9wcy5mb2xkZXIsIChlcnJvcikgPT4ge1xuICAgICAgICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKVxuICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBmb2xkZXJMb2FkaW5nRXJyb3I6IGVycm9yIH0pXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlTm90aWNlKHtcbiAgICAgICAgICAgICAgICAgIHR5cGU6ICdlcnJvcicsXG4gICAgICAgICAgICAgICAgICB0aXRsZTogJ09oIG5vIScsXG4gICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnV2Ugd2VyZSB1bmFibGUgdG8gb3BlbiB0aGUgZm9sZGVyLiDwn5iiIFBsZWFzZSBjbG9zZSBhbmQgcmVvcGVuIHRoZSBhcHBsaWNhdGlvbiBhbmQgdHJ5IGFnYWluLiBJZiB5b3Ugc3RpbGwgc2VlIHRoaXMgbWVzc2FnZSwgY29udGFjdCBIYWlrdSBmb3Igc3VwcG9ydC4nLFxuICAgICAgICAgICAgICAgICAgY2xvc2VUZXh0OiAnT2theScsXG4gICAgICAgICAgICAgICAgICBsaWdodFNjaGVtZTogdHJ1ZVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfVxuICAgICAgICB9LCAxMDAwKVxuICAgICAgfSlcbiAgICB9KVxuICB9XG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQgKCkge1xuICAgIHRoaXMudG91ckNoYW5uZWwub2ZmKCd0b3VyOnJlcXVlc3RFbGVtZW50Q29vcmRpbmF0ZXMnLCB0aGlzLmhhbmRsZUZpbmRFbGVtZW50Q29vcmRpbmF0ZXMpXG4gICAgdGhpcy50b3VyQ2hhbm5lbC5vZmYoJ3RvdXI6cmVxdWVzdFdlYnZpZXdDb29yZGluYXRlcycsIHRoaXMuaGFuZGxlRmluZFdlYnZpZXdDb29yZGluYXRlcylcbiAgICB0aGlzLmFjdGl2aXR5TW9uaXRvci5zdG9wV2F0Y2hlcnMoKVxuICB9XG5cbiAgaGFuZGxlRmluZEVsZW1lbnRDb29yZGluYXRlcyAoeyBzZWxlY3Rvciwgd2VidmlldyB9KSB7XG4gICAgaWYgKHdlYnZpZXcgIT09ICdjcmVhdG9yJykgeyByZXR1cm4gfVxuXG4gICAgdHJ5IHtcbiAgICAgIC8vIFRPRE86IGZpbmQgaWYgdGhlcmUgaXMgYSBiZXR0ZXIgc29sdXRpb24gdG8gdGhpcyBzY2FwZSBoYXRjaFxuICAgICAgbGV0IGVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKVxuICAgICAgbGV0IHsgdG9wLCBsZWZ0IH0gPSBlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG5cbiAgICAgIHRoaXMudG91ckNoYW5uZWwucmVjZWl2ZUVsZW1lbnRDb29yZGluYXRlcygnY3JlYXRvcicsIHsgdG9wLCBsZWZ0IH0pXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoYFtjcmVhdG9yXSBlcnJvciBmZXRjaGluZyAke3NlbGVjdG9yfSBpbiB3ZWJ2aWV3ICR7d2Vidmlld31gKVxuICAgIH1cbiAgfVxuXG4gIGhhbmRsZUZpbmRXZWJ2aWV3Q29vcmRpbmF0ZXMgKCkge1xuICAgIHRoaXMudG91ckNoYW5uZWwucmVjZWl2ZVdlYnZpZXdDb29yZGluYXRlcygnY3JlYXRvcicsIHsgdG9wOiAwLCBsZWZ0OiAwIH0pXG4gIH1cblxuICBoYW5kbGVQYW5lUmVzaXplICgpIHtcbiAgICAvLyB0aGlzLmxheW91dC5lbWl0KCdyZXNpemUnKVxuICB9XG5cbiAgcmVuZGVyTm90aWZpY2F0aW9ucyAoY29udGVudCwgaSkge1xuICAgIHJldHVybiAoXG4gICAgICA8VG9hc3RcbiAgICAgICAgdG9hc3RUeXBlPXtjb250ZW50LnR5cGV9XG4gICAgICAgIHRvYXN0VGl0bGU9e2NvbnRlbnQudGl0bGV9XG4gICAgICAgIHRvYXN0TWVzc2FnZT17Y29udGVudC5tZXNzYWdlfVxuICAgICAgICBjbG9zZVRleHQ9e2NvbnRlbnQuY2xvc2VUZXh0fVxuICAgICAgICBrZXk9e2kgKyBjb250ZW50LnRpdGxlfVxuICAgICAgICBteUtleT17aX1cbiAgICAgICAgcmVtb3ZlTm90aWNlPXt0aGlzLnJlbW92ZU5vdGljZX1cbiAgICAgICAgbGlnaHRTY2hlbWU9e2NvbnRlbnQubGlnaHRTY2hlbWV9IC8+XG4gICAgKVxuICB9XG5cbiAgc2V0RGFzaGJvYXJkVmlzaWJpbGl0eSAoZGFzaGJvYXJkVmlzaWJsZSkge1xuICAgIHRoaXMuc2V0U3RhdGUoe2Rhc2hib2FyZFZpc2libGV9KVxuICB9XG5cbiAgc3dpdGNoQWN0aXZlTmF2IChhY3RpdmVOYXYpIHtcbiAgICB0aGlzLnNldFN0YXRlKHthY3RpdmVOYXZ9KVxuXG4gICAgaWYgKGFjdGl2ZU5hdiA9PT0gJ3N0YXRlX2luc3BlY3RvcicpIHtcbiAgICAgIHRoaXMudG91ckNoYW5uZWwubmV4dCgpXG4gICAgfVxuICB9XG5cbiAgYXV0aGVudGljYXRlVXNlciAodXNlcm5hbWUsIHBhc3N3b3JkLCBjYikge1xuICAgIHJldHVybiB0aGlzLnByb3BzLndlYnNvY2tldC5yZXF1ZXN0KHsgbWV0aG9kOiAnYXV0aGVudGljYXRlVXNlcicsIHBhcmFtczogW3VzZXJuYW1lLCBwYXNzd29yZF0gfSwgKGVycm9yLCBhdXRoQW5zd2VyKSA9PiB7XG4gICAgICBpZiAoZXJyb3IpIHJldHVybiBjYihlcnJvcilcbiAgICAgIG1peHBhbmVsLm1lcmdlVG9QYXlsb2FkKHsgZGlzdGluY3RfaWQ6IHVzZXJuYW1lIH0pXG4gICAgICBtaXhwYW5lbC5oYWlrdVRyYWNrKCdjcmVhdG9yOnVzZXItYXV0aGVudGljYXRlZCcsIHsgdXNlcm5hbWUgfSlcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICB1c2VybmFtZSxcbiAgICAgICAgcGFzc3dvcmQsXG4gICAgICAgIGF1dGhUb2tlbjogYXV0aEFuc3dlciAmJiBhdXRoQW5zd2VyLmF1dGhUb2tlbixcbiAgICAgICAgb3JnYW5pemF0aW9uTmFtZTogYXV0aEFuc3dlciAmJiBhdXRoQW5zd2VyLm9yZ2FuaXphdGlvbk5hbWUsXG4gICAgICAgIGlzVXNlckF1dGhlbnRpY2F0ZWQ6IGF1dGhBbnN3ZXIgJiYgYXV0aEFuc3dlci5pc0F1dGhlZFxuICAgICAgfSlcbiAgICAgIHJldHVybiBjYihudWxsLCBhdXRoQW5zd2VyKVxuICAgIH0pXG4gIH1cblxuICBhdXRoZW50aWNhdGlvbkNvbXBsZXRlICgpIHtcbiAgICByZXR1cm4gdGhpcy5zZXRTdGF0ZSh7IGlzVXNlckF1dGhlbnRpY2F0ZWQ6IHRydWUgfSlcbiAgfVxuXG4gIHJlY2VpdmVQcm9qZWN0SW5mbyAocHJvamVjdEluZm8pIHtcbiAgICAvLyBOTy1PUFxuICB9XG5cbiAgbG9hZFByb2plY3RzIChjYikge1xuICAgIHJldHVybiB0aGlzLnByb3BzLndlYnNvY2tldC5yZXF1ZXN0KHsgbWV0aG9kOiAnbGlzdFByb2plY3RzJywgcGFyYW1zOiBbXSB9LCAoZXJyb3IsIHByb2plY3RzTGlzdCkgPT4ge1xuICAgICAgaWYgKGVycm9yKSByZXR1cm4gY2IoZXJyb3IpXG4gICAgICB0aGlzLnNldFN0YXRlKHsgcHJvamVjdHNMaXN0IH0pXG4gICAgICBpcGNSZW5kZXJlci5zZW5kKCdyZW5kZXJlcjpwcm9qZWN0cy1saXN0LWZldGNoZWQnLCBwcm9qZWN0c0xpc3QpXG4gICAgICByZXR1cm4gY2IobnVsbCwgcHJvamVjdHNMaXN0KVxuICAgIH0pXG4gIH1cblxuICBsYXVuY2hQcm9qZWN0IChwcm9qZWN0TmFtZSwgcHJvamVjdE9iamVjdCwgY2IpIHtcbiAgICBwcm9qZWN0T2JqZWN0ID0ge1xuICAgICAgc2tpcENvbnRlbnRDcmVhdGlvbjogdHJ1ZSwgLy8gVkVSWSBJTVBPUlRBTlQgLSBpZiBub3Qgc2V0IHRvIHRydWUsIHdlIGNhbiBlbmQgdXAgaW4gYSBzaXR1YXRpb24gd2hlcmUgd2Ugb3ZlcndyaXRlIGZyZXNobHkgY2xvbmVkIGNvbnRlbnQgZnJvbSB0aGUgcmVtb3RlIVxuICAgICAgcHJvamVjdHNIb21lOiBwcm9qZWN0T2JqZWN0LnByb2plY3RzSG9tZSxcbiAgICAgIHByb2plY3RQYXRoOiBwcm9qZWN0T2JqZWN0LnByb2plY3RQYXRoLFxuICAgICAgb3JnYW5pemF0aW9uTmFtZTogdGhpcy5zdGF0ZS5vcmdhbml6YXRpb25OYW1lLFxuICAgICAgYXV0aG9yTmFtZTogdGhpcy5zdGF0ZS51c2VybmFtZSxcbiAgICAgIHByb2plY3ROYW1lIC8vIEhhdmUgdG8gc2V0IHRoaXMgaGVyZSwgYmVjYXVzZSB3ZSBwYXNzIHRoaXMgd2hvbGUgb2JqZWN0IHRvIFN0YXRlVGl0bGVCYXIsIHdoaWNoIG5lZWRzIHRoaXMgdG8gcHJvcGVybHkgY2FsbCBzYXZlUHJvamVjdFxuICAgIH1cblxuICAgIC8vIEFkZCBleHRyYSBjb250ZXh0IHRvIFNlbnRyeSByZXBvcnRzLCB0aGlzIGluZm8gaXMgYWxzbyB1c2VkXG4gICAgLy8gYnkgY2FyYm9uaXRlLlxuICAgIHdpbmRvdy5SYXZlbi5zZXRFeHRyYUNvbnRleHQoe1xuICAgICAgb3JnYW5pemF0aW9uTmFtZTogdGhpcy5zdGF0ZS5vcmdhbml6YXRpb25OYW1lLFxuICAgICAgcHJvamVjdFBhdGg6IHByb2plY3RPYmplY3QucHJvamVjdFBhdGgsXG4gICAgICBwcm9qZWN0TmFtZVxuICAgIH0pXG4gICAgd2luZG93LlJhdmVuLnNldFVzZXJDb250ZXh0KHtcbiAgICAgIGVtYWlsOiB0aGlzLnN0YXRlLnVzZXJuYW1lLFxuICAgIH0pXG5cbiAgICBtaXhwYW5lbC5oYWlrdVRyYWNrKCdjcmVhdG9yOnByb2plY3Q6bGF1bmNoaW5nJywge1xuICAgICAgdXNlcm5hbWU6IHRoaXMuc3RhdGUudXNlcm5hbWUsXG4gICAgICBwcm9qZWN0OiBwcm9qZWN0TmFtZSxcbiAgICAgIG9yZ2FuaXphdGlvbjogdGhpcy5zdGF0ZS5vcmdhbml6YXRpb25OYW1lXG4gICAgfSlcblxuICAgIHJldHVybiB0aGlzLnByb3BzLndlYnNvY2tldC5yZXF1ZXN0KHsgbWV0aG9kOiAnaW5pdGlhbGl6ZVByb2plY3QnLCBwYXJhbXM6IFtwcm9qZWN0TmFtZSwgcHJvamVjdE9iamVjdCwgdGhpcy5zdGF0ZS51c2VybmFtZSwgdGhpcy5zdGF0ZS5wYXNzd29yZF0gfSwgKGVyciwgcHJvamVjdEZvbGRlcikgPT4ge1xuICAgICAgaWYgKGVycikgcmV0dXJuIGNiKGVycilcblxuICAgICAgd2luZG93LlJhdmVuLnNldEV4dHJhQ29udGV4dCh7XG4gICAgICAgIG9yZ2FuaXphdGlvbk5hbWU6IHRoaXMuc3RhdGUub3JnYW5pemF0aW9uTmFtZSxcbiAgICAgICAgcHJvamVjdFBhdGg6IHByb2plY3RGb2xkZXIsIC8vIFJlLXNldCBpbiBjYXNlIGl0IHdhc24ndCBwcmVzZW50IGluIHRoZSBhYm92ZSBjYWxsXG4gICAgICAgIHByb2plY3ROYW1lXG4gICAgICB9KVxuXG4gICAgICByZXR1cm4gdGhpcy5wcm9wcy53ZWJzb2NrZXQucmVxdWVzdCh7IG1ldGhvZDogJ3N0YXJ0UHJvamVjdCcsIHBhcmFtczogW3Byb2plY3ROYW1lLCBwcm9qZWN0Rm9sZGVyXSB9LCAoZXJyLCBhcHBsaWNhdGlvbkltYWdlKSA9PiB7XG4gICAgICAgIGlmIChlcnIpIHJldHVybiBjYihlcnIpXG5cbiAgICAgICAgLy8gQXNzaWduLCBub3QgbWVyZ2UsIHNpbmNlIHdlIGRvbid0IHdhbnQgdG8gY2xvYmJlciBhbnkgdmFyaWFibGVzIGFscmVhZHkgc2V0LCBsaWtlIHByb2plY3QgbmFtZVxuICAgICAgICBsb2Rhc2guYXNzaWduKHByb2plY3RPYmplY3QsIGFwcGxpY2F0aW9uSW1hZ2UucHJvamVjdClcblxuICAgICAgICBtaXhwYW5lbC5oYWlrdVRyYWNrKCdjcmVhdG9yOnByb2plY3Q6bGF1bmNoZWQnLCB7XG4gICAgICAgICAgdXNlcm5hbWU6IHRoaXMuc3RhdGUudXNlcm5hbWUsXG4gICAgICAgICAgcHJvamVjdDogcHJvamVjdE5hbWUsXG4gICAgICAgICAgb3JnYW5pemF0aW9uOiB0aGlzLnN0YXRlLm9yZ2FuaXphdGlvbk5hbWVcbiAgICAgICAgfSlcblxuICAgICAgICAvLyBOb3cgaGFja2lseSBjaGFuZ2Ugc29tZSBwb2ludGVycyBzbyB3ZSdyZSByZWZlcnJpbmcgdG8gdGhlIGNvcnJlY3QgcGxhY2VcbiAgICAgICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQuZm9sZGVyID0gcHJvamVjdEZvbGRlciAvLyBEbyBub3QgcmVtb3ZlIHRoaXMgbmVjZXNzYXJ5IGhhY2sgcGx6XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyBwcm9qZWN0Rm9sZGVyLCBhcHBsaWNhdGlvbkltYWdlLCBwcm9qZWN0T2JqZWN0LCBwcm9qZWN0TmFtZSwgZGFzaGJvYXJkVmlzaWJsZTogZmFsc2UgfSlcblxuICAgICAgICByZXR1cm4gY2IoKVxuICAgICAgfSlcbiAgICB9KVxuICB9XG5cbiAgbGF1bmNoRm9sZGVyIChtYXliZVByb2plY3ROYW1lLCBwcm9qZWN0Rm9sZGVyLCBjYikge1xuICAgIG1peHBhbmVsLmhhaWt1VHJhY2soJ2NyZWF0b3I6Zm9sZGVyOmxhdW5jaGluZycsIHtcbiAgICAgIHVzZXJuYW1lOiB0aGlzLnN0YXRlLnVzZXJuYW1lLFxuICAgICAgcHJvamVjdDogbWF5YmVQcm9qZWN0TmFtZVxuICAgIH0pXG5cbiAgICAvLyBUaGUgbGF1bmNoUHJvamVjdCBtZXRob2QgaGFuZGxlcyB0aGUgcGVyZm9ybUZvbGRlclBvaW50ZXJDaGFuZ2VcbiAgICByZXR1cm4gdGhpcy5sYXVuY2hQcm9qZWN0KG1heWJlUHJvamVjdE5hbWUsIHsgcHJvamVjdFBhdGg6IHByb2plY3RGb2xkZXIgfSwgY2IpXG4gIH1cblxuICByZW1vdmVOb3RpY2UgKGluZGV4LCBpZCkge1xuICAgIGNvbnN0IG5vdGljZXMgPSB0aGlzLnN0YXRlLm5vdGljZXNcbiAgICBpZiAoaW5kZXggIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIG5vdGljZXM6IFsuLi5ub3RpY2VzLnNsaWNlKDAsIGluZGV4KSwgLi4ubm90aWNlcy5zbGljZShpbmRleCArIDEpXVxuICAgICAgfSlcbiAgICB9IGVsc2UgaWYgKGlkICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIC8vIEhhY2thcm9vXG4gICAgICBsb2Rhc2guZWFjaChub3RpY2VzLCAobm90aWNlLCBpbmRleCkgPT4ge1xuICAgICAgICBpZiAobm90aWNlLmlkID09PSBpZCkgdGhpcy5yZW1vdmVOb3RpY2UoaW5kZXgpXG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIGNyZWF0ZU5vdGljZSAobm90aWNlKSB7XG4gICAgLyogRXhwZWN0cyB0aGUgb2JqZWN0OlxuICAgIHsgdHlwZTogc3RyaW5nIChpbmZvLCBzdWNjZXNzLCBkYW5nZXIgKG9yIGVycm9yKSwgd2FybmluZylcbiAgICAgIHRpdGxlOiBzdHJpbmcsXG4gICAgICBtZXNzYWdlOiBzdHJpbmcsXG4gICAgICBjbG9zZVRleHQ6IHN0cmluZyAob3B0aW9uYWwsIGRlZmF1bHRzIHRvICdjbG9zZScpXG4gICAgICBsaWdodFNjaGVtZTogYm9vbCAob3B0aW9uYWwsIGRlZmF1bHRzIHRvIGRhcmspXG4gICAgfSAqL1xuXG4gICAgbm90aWNlLmlkID0gTWF0aC5yYW5kb20oKSArICcnXG5cbiAgICBjb25zdCBub3RpY2VzID0gdGhpcy5zdGF0ZS5ub3RpY2VzXG4gICAgbGV0IHJlcGxhY2VkRXhpc3RpbmcgPSBmYWxzZVxuXG4gICAgbm90aWNlcy5mb3JFYWNoKChuLCBpKSA9PiB7XG4gICAgICBpZiAobi5tZXNzYWdlID09PSBub3RpY2UubWVzc2FnZSkge1xuICAgICAgICBub3RpY2VzLnNwbGljZShpLCAxKVxuICAgICAgICByZXBsYWNlZEV4aXN0aW5nID0gdHJ1ZVxuICAgICAgICB0aGlzLnNldFN0YXRlKHsgbm90aWNlcyB9LCAoKSA9PiB7XG4gICAgICAgICAgbm90aWNlcy51bnNoaWZ0KG5vdGljZSlcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgbm90aWNlcyB9KVxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH0pXG5cbiAgICBpZiAoIXJlcGxhY2VkRXhpc3RpbmcpIHtcbiAgICAgIG5vdGljZXMudW5zaGlmdChub3RpY2UpXG4gICAgICB0aGlzLnNldFN0YXRlKHsgbm90aWNlcyB9KVxuICAgIH1cblxuICAgIHJldHVybiBub3RpY2VcbiAgfVxuXG4gIG9uTGlicmFyeURyYWdFbmQgKGRyYWdFbmROYXRpdmVFdmVudCwgbGlicmFyeUl0ZW1JbmZvKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7IGxpYnJhcnlJdGVtRHJhZ2dpbmc6IG51bGwgfSlcbiAgICBpZiAobGlicmFyeUl0ZW1JbmZvICYmIGxpYnJhcnlJdGVtSW5mby5wcmV2aWV3KSB7XG4gICAgICB0aGlzLnJlZnMuc3RhZ2UuaGFuZGxlRHJvcChsaWJyYXJ5SXRlbUluZm8sIHRoaXMuX2xhc3RNb3VzZVgsIHRoaXMuX2xhc3RNb3VzZVkpXG4gICAgfVxuICB9XG5cbiAgb25MaWJyYXJ5RHJhZ1N0YXJ0IChkcmFnU3RhcnROYXRpdmVFdmVudCwgbGlicmFyeUl0ZW1JbmZvKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7IGxpYnJhcnlJdGVtRHJhZ2dpbmc6IGxpYnJhcnlJdGVtSW5mbyB9KVxuICB9XG5cbiAgb25BdXRvVXBkYXRlQ2hlY2tDb21wbGV0ZSAoKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICB1cGRhdGVyOiB7XG4gICAgICAgIC4uLnRoaXMuc3RhdGUudXBkYXRlcixcbiAgICAgICAgc2hvdWxkQ2hlY2s6IGZhbHNlXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIG9uQWN0aXZpdHlSZXBvcnQgKHVzZXJXYXNBY3RpdmUpIHtcbiAgICBpZiAodXNlcldhc0FjdGl2ZSkge1xuICAgICAgcmV0dXJuIHRoaXMucHJvcHMud2Vic29ja2V0LnJlcXVlc3QoXG4gICAgICAgIHttZXRob2Q6ICdjaGVja0lua3N0b25lVXBkYXRlcycsIHBhcmFtczogW3t9XX0sXG4gICAgICAgIChlcnIpID0+IHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnW2NyZWF0b3JdIHBpbmcgdG8gSW5rc3RvbmUgZm9yIHVwZGF0ZXMgZmluaXNoZWQnLCBlcnIpXG4gICAgICAgIH1cbiAgICAgIClcbiAgICB9XG5cbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHVwZGF0ZXI6IHtcbiAgICAgICAgc2hvdWxkQ2hlY2s6IHRydWUsXG4gICAgICAgIHNob3VsZFJ1bk9uQmFja2dyb3VuZDogdHJ1ZSxcbiAgICAgICAgc2hvdWxkU2tpcE9wdEluOiBmYWxzZVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICByZW5kZXJTdGFydHVwRGVmYXVsdFNjcmVlbiAoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgc3R5bGU9e3sgcG9zaXRpb246ICdhYnNvbHV0ZScsIHdpZHRoOiAnMTAwJScsIGhlaWdodDogJzEwMCUnIH19PlxuICAgICAgICA8UmVhY3RDU1NUcmFuc2l0aW9uR3JvdXBcbiAgICAgICAgICB0cmFuc2l0aW9uTmFtZT0ndG9hc3QnXG4gICAgICAgICAgdHJhbnNpdGlvbkVudGVyVGltZW91dD17NTAwfVxuICAgICAgICAgIHRyYW5zaXRpb25MZWF2ZVRpbWVvdXQ9ezMwMH0+XG4gICAgICAgICAgPGRpdiBzdHlsZT17e3Bvc2l0aW9uOiAnYWJzb2x1dGUnLCByaWdodDogMCwgdG9wOiAwLCB3aWR0aDogMzAwfX0+XG4gICAgICAgICAgICB7bG9kYXNoLm1hcCh0aGlzLnN0YXRlLm5vdGljZXMsIHRoaXMucmVuZGVyTm90aWZpY2F0aW9ucyl9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvUmVhY3RDU1NUcmFuc2l0aW9uR3JvdXA+XG4gICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ3RhYmxlJywgd2lkdGg6ICcxMDAlJywgaGVpZ2h0OiAnMTAwJScsIHBvc2l0aW9uOiAnYWJzb2x1dGUnLCB0b3A6IDAsIGxlZnQ6IDAgfX0+XG4gICAgICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAndGFibGUtY2VsbCcsIHdpZHRoOiAnMTAwJScsIGhlaWdodDogJzEwMCUnLCB2ZXJ0aWNhbEFsaWduOiAnbWlkZGxlJywgdGV4dEFsaWduOiAnY2VudGVyJyB9fT5cbiAgICAgICAgICAgIDxzdmcgd2lkdGg9JzE3MHB4JyBoZWlnaHQ9JzIyMXB4JyB2aWV3Qm94PScwIDAgMTcwIDIyMScgdmVyc2lvbj0nMS4xJz5cbiAgICAgICAgICAgICAgPGcgaWQ9J1BhZ2UtMScgc3Ryb2tlPSdub25lJyBzdHJva2VXaWR0aD0nMScgZmlsbD0nbm9uZScgZmlsbFJ1bGU9J2V2ZW5vZGQnPlxuICAgICAgICAgICAgICAgIDxnIGlkPSdPdXRsaW5lZCcgdHJhbnNmb3JtPSd0cmFuc2xhdGUoLTIxMS4wMDAwMDAsIC0xMTQuMDAwMDAwKScgZmlsbFJ1bGU9J25vbnplcm8nIGZpbGw9JyNGQUZDRkQnPlxuICAgICAgICAgICAgICAgICAgPGcgaWQ9J291dGxpbmVkLWxvZ28nIHRyYW5zZm9ybT0ndHJhbnNsYXRlKDIxMS4wMDAwMDAsIDExMy4wMDAwMDApJz5cbiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0nTTQ3LjUsMTUyLjc5ODgyMyBMMjYuMzgyMzQzMiwxNDMuOTU0Njc2IEMyNC41OTkzOTQxLDE0My4yMDc5NzEgMjMuNzU5MzUyNCwxNDEuMTU3MjgxIDI0LjUwNjA1NzYsMTM5LjM3NDMzMiBDMjUuMjUyNzYyOCwxMzcuNTkxMzgzIDI3LjMwMzQ1MjcsMTM2Ljc1MTM0MSAyOS4wODY0MDE4LDEzNy40OTgwNDYgTDExNy43ODAwNTgsMTc0LjY0NDU2IEwxMjAuOTkwMDIxLDE3Ni4wODkwNzQgQzEyMi40ODY4MTQsMTc2Ljc2MjY0NSAxMjMuMjc5MzA0LDE3OC4zNTgyNTEgMTIyLjk5ODY5OCwxNzkuOTAzNTk4IEMxMjIuOTk5NTY0LDE3OS45MzU2MjYgMTIzLDE3OS45Njc3NjIgMTIzLDE4MCBMMTIzLDIwNS42Mzk3MjIgTDEzOC41MTA3MTYsMjExLjkxMDAxMSBMMTQzLjM2ODQyMSwyMTMuODczNzY0IEwxNjIuODMzMzMzLDIwNi4wMDQ5NyBMMTYyLjgzMzMzMywxNi4yOTI5MDI1IEwxNDMsOC4yNzUxNzIwNCBMMTIyLjgzMzMzMywxNi40Mjc2NTQzIEwxMjIuODMzMzMzLDUzLjYwMTMyOTUgQzEyMi44MzQyMTgsNTMuNjQ2NjQ4OSAxMjIuODM0MjE1LDUzLjY5MTkwMTUgMTIyLjgzMzMzMyw1My43MzcwNjM0IEwxMjIuODMzMzMzLDU0IEMxMjIuODMzMzMzLDU1LjkzMjk5NjYgMTIxLjI2NjMzLDU3LjUgMTE5LjMzMzMzMyw1Ny41IEMxMTkuMjg4NDMsNTcuNSAxMTkuMjQzNzI0LDU3LjQ5OTE1NDQgMTE5LjE5OTIzLDU3LjQ5NzQ3ODIgTDUzLjMwNzYzOCw4NC4wMzcxNDkgQzUxLjUxNDYxODMsODQuNzU5MzM3NSA0OS40NzU2MzkyLDgzLjg5MTI1NzMgNDguNzUzNDUwNiw4Mi4wOTgyMzc2IEM0OC4wMzEyNjIxLDgwLjMwNTIxNzkgNDguODk5MzQyMyw3OC4yNjYyMzg4IDUwLjY5MjM2Miw3Ny41NDQwNTAyIEwxMTUuODMzMzMzLDUxLjMwNjcxMjkgTDExNS44MzMzMzMsMTQuNDk3NDIyNyBDMTE1LjgzMzMzMywxNC4wMTQzMTc4IDExNS45MzEyMTMsMTMuNTU0MDczOSAxMTYuMTA4MjIyLDEzLjEzNTQzOTkgQzExNi4zNzQ1MzksMTIuMDk0MTI5MiAxMTcuMTE1MzI2LDExLjE4ODg0NDkgMTE4LjE4ODIzOCwxMC43NTUxMTQ4IEwxNDEuNjg0MTg2LDEuMjU2NzUyNyBDMTQyLjA5MTMxNywxLjA5MTUyOTM2IDE0Mi41Mjk1OSwxLjAwMjQwNDY3IDE0Mi45NzU5MzcsMC45OTkxNjQ3MjMgQzE0My40NzA0MSwxLjAwMjQwNDY3IDE0My45MDg2ODMsMS4wOTE1MjkzNiAxNDQuMzE1ODE0LDEuMjU2NzUyNyBMMTY3LjgxMTc2MiwxMC43NTUxMTQ4IEMxNjkuNTIyOTY4LDExLjQ0Njg3OSAxNzAuMzg5MzI4LDEzLjMzODE2NTkgMTY5LjgzMzMzMywxNS4wNjc3MDY4IEwxNjkuODMzMzMzLDIwOCBDMTY5LjgzMzMzMywyMDguODI2MzA0IDE2OS41NDY5OSwyMDkuNTg1NzI4IDE2OS4wNjgxMTgsMjEwLjE4NDQ1OSBDMTY4LjY5MzcwMywyMTAuODY3Mzc4IDE2OC4wOTAxMzMsMjExLjQzMDIyNCAxNjcuMzExNzYyLDIxMS43NDQ4ODUgTDE0NC41MTc2NDUsMjIwLjk1OTUyOCBDMTQzLjMzMjU0MiwyMjEuNDM4NjEzIDE0Mi4wMzg5OTUsMjIxLjIyMjM5NyAxNDEuMDg5MTc5LDIyMC41MDI3MTIgTDEzNS44ODcxOTIsMjE4LjM5OTc4MiBMMTE5LjQ2MTU5NSwyMTEuNzU5NjQ3IEMxMTcuNTQ2MjksMjExLjczOTA1NSAxMTYsMjEwLjE4MDAzMiAxMTYsMjA4LjI1OTg1MyBMMTE2LDIwOC4wNzkxMSBDMTE1Ljk5ODc2NywyMDguMDI1NzA4IDExNS45OTg3NjEsMjA3Ljk3MjE3OCAxMTYsMjA3LjkxODU1OCBMMTE2LDE4MS41MTg3NDggTDExNC45OTE3MjcsMTgxLjA2NDU4OSBMNTQuNSwxNTUuNzMwNDQ3IEw1NC41LDIwNi45OTgyNzMgQzU1LjEzNDE0NjgsMjA4LjY1ODI1NiA1NC40MTk1MzE1LDIxMC41MTI5MTUgNTIuODc5NjY0NSwyMTEuMzMzMzMzIEM1Mi41NTQ1NTQ2LDIxMS41NDA3MDkgNTIuMTkyOTA0LDIxMS42OTU4NjkgNTEuODA2NTI5NCwyMTEuNzg2OTk3IEwyOS43ODY3Mzc1LDIyMC42NTA2NTUgQzI4LjgyNTI1MzUsMjIxLjQ3ODc1OCAyNy40NDU3MDA1LDIyMS43NTMyMjEgMjYuMTg4MjM3OSwyMjEuMjQ0ODg1IEwyMC4zODcxOTIxLDIxOC44OTk3ODIgTDMuMzA2Mjc3ODMsMjExLjk5NDczMSBDMS40NjMzODE4OSwyMTEuODk0MTkyIC0yLjYwODM1OTk1ZS0xNiwyMTAuMzY3OTkyIDAsMjA4LjUgTDIuNzA4OTQ0MThlLTE0LDE0LjQ5NzQyMjcgQzIuNzI0MjQ1ZS0xNCwxMy40MDE2NDU4IDAuNTAzNTYwOTQ3LDEyLjQyMzQ4MTggMS4yOTE4OTY2OSwxMS43ODE3MTcgQzEuNjUxNzEwMTQsMTEuMzQxNjUwOSAyLjEyNDA1NjIyLDEwLjk4MzE4ODIgMi42ODgyMzc4OSwxMC43NTUxMTQ4IEwyNi4xODQxODYyLDEuMjU2NzUyNyBDMjYuNTkxMzE3MiwxLjA5MTUyOTM2IDI3LjAyOTU4OTgsMS4wMDI0MDQ2NyAyNy40NzU5MzY3LDAuOTk5MTY0NzIzIEMyNy45NzA0MTAyLDEuMDAyNDA0NjcgMjguNDA4NjgyOCwxLjA5MTUyOTM2IDI4LjgxNTgxMzgsMS4yNTY3NTI3IEw1Mi4zMTE3NjIxLDEwLjc1NTExNDggQzU0LjEwMzg2MjcsMTEuNDc5NTgxIDU0Ljk2OTM1MTQsMTMuNTE5NjYxNSA1NC4yNDQ4ODUyLDE1LjMxMTc2MjEgQzUzLjUyMDQxOSwxNy4xMDM4NjI3IDUxLjQ4MDMzODUsMTcuOTY5MzUxNCA0OS42ODgyMzc5LDE3LjI0NDg4NTIgTDI3LjUsOC4yNzUxNzIwNCBMNywxNi41NjI0MDYxIEw3LDIwNS45Mzc1OTQgTDIzLjAxMDcxNjQsMjEyLjQxMDAxMSBMMjcuMjUyNjk5NSwyMTQuMTI0ODU1IEw0Ny41LDIwNS45NzQ2ODEgTDQ3LjUsMTUyLjc5ODgyMyBaJyBpZD0nQ29tYmluZWQtU2hhcGUnIC8+XG4gICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9J00xNDYuNDU2ODI3LDYzLjAyNDE4NDkgQzE0Ni45NDg2MDMsNjQuNzEwNDcyNCAxNDYuMTA1OTcyLDY2LjUzMzY1OTEgMTQ0LjQ0NzMwNSw2Ny4yMjgzMTQ5IEw1OS41NDY4Njc3LDEwMi43ODQ5MDggTDEyMC40MTY1NzUsMTI4LjI3NzM1IEMxMjIuMTk5NTI0LDEyOS4wMjQwNTUgMTIzLjAzOTU2NiwxMzEuMDc0NzQ1IDEyMi4yOTI4NjEsMTMyLjg1NzY5NCBDMTIxLjU0NjE1NiwxMzQuNjQwNjQzIDExOS40OTU0NjYsMTM1LjQ4MDY4NSAxMTcuNzEyNTE3LDEzNC43MzM5NzkgTDUwLjQ4NjQxMzEsMTA2LjU3OTQ1NyBMMjkuMzUyMDI5MywxMTUuNDMwNjEgQzI3LjU2OTA4MDIsMTE2LjE3NzMxNSAyNS41MTgzOTAzLDExNS4zMzcyNzMgMjQuNzcxNjg1MSwxMTMuNTU0MzI0IEMyNC4wMjQ5OCwxMTEuNzcxMzc1IDI0Ljg2NTAyMTYsMTA5LjcyMDY4NSAyNi42NDc5NzA3LDEwOC45NzM5OCBMNDcuNSwxMDAuMjQxMDc5IEw0Ny41LDE0LjUgQzQ3LjUsMTIuNTY3MDAzNCA0OS4wNjcwMDM0LDExIDUxLDExIEM1Mi45MzI5OTY2LDExIDU0LjUsMTIuNTY3MDAzNCA1NC41LDE0LjUgTDU0LjUsOTcuMzA5NDU0OCBMMTMzLjM2MDI1Nyw2NC4yODI1MDk4IEwxMTcuMTg4MjM4LDU3Ljc0NDg4NTIgQzExNS4zOTYxMzcsNTcuMDIwNDE5IDExNC41MzA2NDksNTQuOTgwMzM4NSAxMTUuMjU1MTE1LDUzLjE4ODIzNzkgQzExNS45Nzk1ODEsNTEuMzk2MTM3MyAxMTguMDE5NjYxLDUwLjUzMDY0ODYgMTE5LjgxMTc2Miw1MS4yNTUxMTQ4IEwxMzkuNSw1OS4yMTQxODk3IEwxMzkuNSwyNS44NjAyNzg0IEwxMzUuODg3MTkyLDI0LjM5OTc4MTYgTDExOC4xODgyMzgsMTcuMjQ0ODg1MiBDMTE2LjM5NjEzNywxNi41MjA0MTkgMTE1LjUzMDY0OSwxNC40ODAzMzg1IDExNi4yNTUxMTUsMTIuNjg4MjM3OSBDMTE2Ljk3OTU4MSwxMC44OTYxMzczIDExOS4wMTk2NjEsMTAuMDMwNjQ4NiAxMjAuODExNzYyLDEwLjc1NTExNDggTDEzOC41MTA3MTYsMTcuOTEwMDExMiBMMTQzLjM2ODQyMSwxOS44NzM3NjQxIEwxNjQuNjg4MjM4LDExLjI1NTExNDggQzE2Ni40ODAzMzksMTAuNTMwNjQ4NiAxNjguNTIwNDE5LDExLjM5NjEzNzMgMTY5LjI0NDg4NSwxMy4xODgyMzc5IEMxNjkuOTY5MzUxLDE0Ljk4MDMzODUgMTY5LjEwMzg2MywxNy4wMjA0MTkgMTY3LjMxMTc2MiwxNy43NDQ4ODUyIEwxNDYuNSwyNi4xNTgxNTA4IEwxNDYuNSw2Mi40NzI4NzQ5IEMxNDYuNSw2Mi42NjA0NTc0IDE0Ni40ODUyNDMsNjIuODQ0NTkzMyAxNDYuNDU2ODI3LDYzLjAyNDE4NDkgWicgaWQ9J0NvbWJpbmVkLVNoYXBlJyAvPlxuICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSdNMTM5LjUsOTYuMzMwODA2OSBMMTIyLjgzMzMzMywxMDMuMzEwODY0IEwxMjIuODMzMzMzLDE1MS4zNzI3OTkgQzEyMi44MzMzMzMsMTUzLjMwNTc5NSAxMjEuMjY2MzMsMTU0Ljg3Mjc5OSAxMTkuMzMzMzMzLDE1NC44NzI3OTkgQzExOC41MzU3MTksMTU0Ljg3Mjc5OSAxMTcuODAwNDIsMTU0LjYwNTk5NCAxMTcuMjExODE2LDE1NC4xNTY3NjMgTDI2LjY0Nzk3MDcsMTE2LjIyODMxNSBDMjYuMDk3NjcwNiwxMTUuOTk3ODQ3IDI1LjYzNzE5NCwxMTUuNjQzMTU5IDI1LjI4NTQ3MTQsMTE1LjIxMDQ2MiBDMjQuNTAwODI1OCwxMTQuNTY4NjIgMjQsMTEzLjU5Mjc5NyAyNCwxMTIuNSBMMjQsMjUuODYwMjc4NCBMMjAuMzg3MTkyMSwyNC4zOTk3ODE2IEwyLjY4ODIzNzg5LDE3LjI0NDg4NTIgQzAuODk2MTM3MjU4LDE2LjUyMDQxOSAwLjAzMDY0ODU1ODksMTQuNDgwMzM4NSAwLjc1NTExNDc3LDEyLjY4ODIzNzkgQzEuNDc5NTgwOTgsMTAuODk2MTM3MyAzLjUxOTY2MTQ5LDEwLjAzMDY0ODYgNS4zMTE3NjIxMSwxMC43NTUxMTQ4IEwyMy4wMTA3MTY0LDE3LjkxMDAxMTIgTDI3Ljg2ODQyMTEsMTkuODczNzY0MSBMNDkuMTg4MjM3OSwxMS4yNTUxMTQ4IEM1MC45ODAzMzg1LDEwLjUzMDY0ODYgNTMuMDIwNDE5LDExLjM5NjEzNzMgNTMuNzQ0ODg1MiwxMy4xODgyMzc5IEM1NC40NjkzNTE0LDE0Ljk4MDMzODUgNTMuNjAzODYyNywxNy4wMjA0MTkgNTEuODExNzYyMSwxNy43NDQ4ODUyIEwzMSwyNi4xNTgxNTA4IEwzMSwxMTAuNDYxODYxIEwxMTUuODMzMzMzLDE0NS45OTAzNTEgTDExNS44MzMzMzMsMTA2LjI0MjQ4OCBMODQuMjU5NjYxNiwxMTkuNDY1NjQ5IEM4Mi40NzY3MTI1LDEyMC4yMTIzNTUgODAuNDI2MDIyNiwxMTkuMzcyMzEzIDc5LjY3OTMxNzQsMTE3LjU4OTM2NCBDNzguOTMyNjEyMywxMTUuODA2NDE1IDc5Ljc3MjY1MzksMTEzLjc1NTcyNSA4MS41NTU2MDMsMTEzLjAwOTAyIEwxNDEuMDUyMTUxLDg4LjA5MTY2MjIgQzE0MS42MDg5NzQsODcuNzE3OTkzIDE0Mi4yNzkwMyw4Ny41IDE0Myw4Ny41IEMxNDQuOTMyOTk3LDg3LjUgMTQ2LjUsODkuMDY3MDAzNCAxNDYuNSw5MSBMMTQ2LjUsMjE3LjYzMDQ4IEMxNDYuNSwyMTkuNTYzNDc3IDE0NC45MzI5OTcsMjIxLjEzMDQ4IDE0MywyMjEuMTMwNDggQzE0MS4wNjcwMDMsMjIxLjEzMDQ4IDEzOS41LDIxOS41NjM0NzcgMTM5LjUsMjE3LjYzMDQ4IEwxMzkuNSw5Ni4zMzA4MDY5IFogTTMxLDE0MSBMMzEsMjE3LjA1NTIzNyBDMzEsMjE4Ljk4ODIzNCAyOS40MzI5OTY2LDIyMC41NTUyMzcgMjcuNSwyMjAuNTU1MjM3IEMyNS41NjcwMDM0LDIyMC41NTUyMzcgMjQsMjE4Ljk4ODIzNCAyNCwyMTcuMDU1MjM3IEwyNCwxNDEgQzI0LDEzOS4wNjcwMDMgMjUuNTY3MDAzNCwxMzcuNSAyNy41LDEzNy41IEMyOS40MzI5OTY2LDEzNy41IDMxLDEzOS4wNjcwMDMgMzEsMTQxIFonIGlkPSdDb21iaW5lZC1TaGFwZScgLz5cbiAgICAgICAgICAgICAgICAgIDwvZz5cbiAgICAgICAgICAgICAgICA8L2c+XG4gICAgICAgICAgICAgIDwvZz5cbiAgICAgICAgICAgIDwvc3ZnPlxuICAgICAgICAgICAgPGJyIC8+XG4gICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBjb2xvcjogJyNGQUZDRkQnLCBkaXNwbGF5OiAnaW5saW5lLWJsb2NrJywgd2lkdGg6ICcxMDAlJywgaGVpZ2h0OiA1MCwgcG9zaXRpb246ICdhYnNvbHV0ZScsIGJvdHRvbTogNTAsIGxlZnQ6IDAgfX0+e3RoaXMuc3RhdGUuc29mdHdhcmVWZXJzaW9ufTwvc3Bhbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICByZW5kZXIgKCkge1xuICAgIGlmICh0aGlzLnN0YXRlLnJlYWR5Rm9yQXV0aCAmJiAoIXRoaXMuc3RhdGUuaXNVc2VyQXV0aGVudGljYXRlZCB8fCAhdGhpcy5zdGF0ZS51c2VybmFtZSkpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxTdHlsZVJvb3Q+XG4gICAgICAgICAgPEF1dGhlbnRpY2F0aW9uVUlcbiAgICAgICAgICAgIG9uU3VibWl0PXt0aGlzLmF1dGhlbnRpY2F0ZVVzZXJ9XG4gICAgICAgICAgICBvblN1Ym1pdFN1Y2Nlc3M9e3RoaXMuYXV0aGVudGljYXRpb25Db21wbGV0ZX1cbiAgICAgICAgICAgIHsuLi50aGlzLnByb3BzfSAvPlxuICAgICAgICA8L1N0eWxlUm9vdD5cbiAgICAgIClcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuc3RhdGUuaXNVc2VyQXV0aGVudGljYXRlZCB8fCAhdGhpcy5zdGF0ZS51c2VybmFtZSkge1xuICAgICAgcmV0dXJuIHRoaXMucmVuZGVyU3RhcnR1cERlZmF1bHRTY3JlZW4oKVxuICAgIH1cblxuICAgIGlmICh0aGlzLnN0YXRlLmRhc2hib2FyZFZpc2libGUpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgPFByb2plY3RCcm93c2VyXG4gICAgICAgICAgICBsb2FkUHJvamVjdHM9e3RoaXMubG9hZFByb2plY3RzfVxuICAgICAgICAgICAgbGF1bmNoUHJvamVjdD17dGhpcy5sYXVuY2hQcm9qZWN0fVxuICAgICAgICAgICAgY3JlYXRlTm90aWNlPXt0aGlzLmNyZWF0ZU5vdGljZX1cbiAgICAgICAgICAgIHJlbW92ZU5vdGljZT17dGhpcy5yZW1vdmVOb3RpY2V9XG4gICAgICAgICAgICBub3RpY2VzPXt0aGlzLnN0YXRlLm5vdGljZXN9XG4gICAgICAgICAgICBlbnZveT17dGhpcy5lbnZveX1cbiAgICAgICAgICAgIHsuLi50aGlzLnByb3BzfSAvPlxuICAgICAgICAgIDxUb3VyIHByb2plY3RzTGlzdD17dGhpcy5zdGF0ZS5wcm9qZWN0c0xpc3R9IGVudm95PXt0aGlzLmVudm95fSBzdGFydFRvdXJPbk1vdW50IC8+XG4gICAgICAgICAgPEF1dG9VcGRhdGVyXG4gICAgICAgICAgICBvbkNvbXBsZXRlPXt0aGlzLm9uQXV0b1VwZGF0ZUNoZWNrQ29tcGxldGV9XG4gICAgICAgICAgICBjaGVjaz17dGhpcy5zdGF0ZS51cGRhdGVyLnNob3VsZENoZWNrfVxuICAgICAgICAgICAgc2tpcE9wdEluPXt0aGlzLnN0YXRlLnVwZGF0ZXIuc2hvdWxkU2tpcE9wdElufVxuICAgICAgICAgICAgcnVuT25CYWNrZ3JvdW5kPXt0aGlzLnN0YXRlLnVwZGF0ZXIuc2hvdWxkUnVuT25CYWNrZ3JvdW5kfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKVxuICAgIH1cblxuICAgIGlmICghdGhpcy5zdGF0ZS5wcm9qZWN0Rm9sZGVyKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIDxUb3VyIHByb2plY3RzTGlzdD17dGhpcy5zdGF0ZS5wcm9qZWN0c0xpc3R9IGVudm95PXt0aGlzLmVudm95fSAvPlxuICAgICAgICAgIDxBdXRvVXBkYXRlclxuICAgICAgICAgICAgb25Db21wbGV0ZT17dGhpcy5vbkF1dG9VcGRhdGVDaGVja0NvbXBsZXRlfVxuICAgICAgICAgICAgY2hlY2s9e3RoaXMuc3RhdGUudXBkYXRlci5zaG91bGRDaGVja31cbiAgICAgICAgICAgIHNraXBPcHRJbj17dGhpcy5zdGF0ZS51cGRhdGVyLnNob3VsZFNraXBPcHRJbn1cbiAgICAgICAgICAgIHJ1bk9uQmFja2dyb3VuZD17dGhpcy5zdGF0ZS51cGRhdGVyLnNob3VsZFJ1bk9uQmFja2dyb3VuZH1cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxQcm9qZWN0QnJvd3NlclxuICAgICAgICAgICAgbG9hZFByb2plY3RzPXt0aGlzLmxvYWRQcm9qZWN0c31cbiAgICAgICAgICAgIGxhdW5jaFByb2plY3Q9e3RoaXMubGF1bmNoUHJvamVjdH1cbiAgICAgICAgICAgIGNyZWF0ZU5vdGljZT17dGhpcy5jcmVhdGVOb3RpY2V9XG4gICAgICAgICAgICByZW1vdmVOb3RpY2U9e3RoaXMucmVtb3ZlTm90aWNlfVxuICAgICAgICAgICAgbm90aWNlcz17dGhpcy5zdGF0ZS5ub3RpY2VzfVxuICAgICAgICAgICAgZW52b3k9e3RoaXMuZW52b3l9XG4gICAgICAgICAgICB7Li4udGhpcy5wcm9wc30gLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICApXG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLnN0YXRlLmFwcGxpY2F0aW9uSW1hZ2UgfHwgdGhpcy5zdGF0ZS5mb2xkZXJMb2FkaW5nRXJyb3IpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgc3R5bGU9e3sgcG9zaXRpb246ICdhYnNvbHV0ZScsIHdpZHRoOiAnMTAwJScsIGhlaWdodDogJzEwMCUnIH19PlxuICAgICAgICAgIDxSZWFjdENTU1RyYW5zaXRpb25Hcm91cFxuICAgICAgICAgICAgdHJhbnNpdGlvbk5hbWU9J3RvYXN0J1xuICAgICAgICAgICAgdHJhbnNpdGlvbkVudGVyVGltZW91dD17NTAwfVxuICAgICAgICAgICAgdHJhbnNpdGlvbkxlYXZlVGltZW91dD17MzAwfT5cbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3twb3NpdGlvbjogJ2Fic29sdXRlJywgcmlnaHQ6IDAsIHRvcDogMCwgd2lkdGg6IDMwMH19PlxuICAgICAgICAgICAgICB7bG9kYXNoLm1hcCh0aGlzLnN0YXRlLm5vdGljZXMsIHRoaXMucmVuZGVyTm90aWZpY2F0aW9ucyl9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L1JlYWN0Q1NTVHJhbnNpdGlvbkdyb3VwPlxuICAgICAgICAgIDxkaXYgc3R5bGU9e3sgcG9zaXRpb246ICdyZWxhdGl2ZScsIHdpZHRoOiAnMTAwJScsIGhlaWdodDogJzEwMCUnIH19PlxuICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBwb3NpdGlvbjogJ2Fic29sdXRlJywgdG9wOiAnNTAlJywgbGVmdDogJzUwJScsIHRyYW5zZm9ybTogJ3RyYW5zbGF0ZSgtNTAlLCAtNTAlKScgfX0+XG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGZvbnRTaXplOiAyNCwgY29sb3I6ICcjMjIyJyB9fT5Mb2FkaW5nIHByb2plY3QuLi48L3NwYW4+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICApXG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgc3R5bGU9e3sgcG9zaXRpb246ICdyZWxhdGl2ZScsIHdpZHRoOiAnMTAwJScsIGhlaWdodDogJzEwMCUnIH19PlxuICAgICAgICA8QXV0b1VwZGF0ZXJcbiAgICAgICAgICBvbkNvbXBsZXRlPXt0aGlzLm9uQXV0b1VwZGF0ZUNoZWNrQ29tcGxldGV9XG4gICAgICAgICAgY2hlY2s9e3RoaXMuc3RhdGUudXBkYXRlci5zaG91bGRDaGVja31cbiAgICAgICAgICBza2lwT3B0SW49e3RoaXMuc3RhdGUudXBkYXRlci5zaG91bGRTa2lwT3B0SW59XG4gICAgICAgICAgcnVuT25CYWNrZ3JvdW5kPXt0aGlzLnN0YXRlLnVwZGF0ZXIuc2hvdWxkUnVuT25CYWNrZ3JvdW5kfVxuICAgICAgICAvPlxuICAgICAgICA8VG91ciBwcm9qZWN0c0xpc3Q9e3RoaXMuc3RhdGUucHJvamVjdHNMaXN0fSBlbnZveT17dGhpcy5lbnZveX0gLz5cbiAgICAgICAgPGRpdiBzdHlsZT17eyBwb3NpdGlvbjogJ2Fic29sdXRlJywgd2lkdGg6ICcxMDAlJywgaGVpZ2h0OiAnMTAwJScsIHRvcDogMCwgbGVmdDogMCB9fT5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nbGF5b3V0LWJveCcgc3R5bGU9e3tvdmVyZmxvdzogJ3Zpc2libGUnfX0+XG4gICAgICAgICAgICA8UmVhY3RDU1NUcmFuc2l0aW9uR3JvdXBcbiAgICAgICAgICAgICAgdHJhbnNpdGlvbk5hbWU9J3RvYXN0J1xuICAgICAgICAgICAgICB0cmFuc2l0aW9uRW50ZXJUaW1lb3V0PXs1MDB9XG4gICAgICAgICAgICAgIHRyYW5zaXRpb25MZWF2ZVRpbWVvdXQ9ezMwMH0+XG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3twb3NpdGlvbjogJ2Fic29sdXRlJywgcmlnaHQ6IDAsIHRvcDogMCwgd2lkdGg6IDMwMH19PlxuICAgICAgICAgICAgICAgIHtsb2Rhc2gubWFwKHRoaXMuc3RhdGUubm90aWNlcywgdGhpcy5yZW5kZXJOb3RpZmljYXRpb25zKX1cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L1JlYWN0Q1NTVHJhbnNpdGlvbkdyb3VwPlxuICAgICAgICAgICAgPFNwbGl0UGFuZSBvbkRyYWdGaW5pc2hlZD17dGhpcy5oYW5kbGVQYW5lUmVzaXplLmJpbmQodGhpcyl9IHNwbGl0PSdob3Jpem9udGFsJyBtaW5TaXplPXszMDB9IGRlZmF1bHRTaXplPXt0aGlzLnByb3BzLmhlaWdodCAqIDAuNjJ9PlxuICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgIDxTcGxpdFBhbmUgb25EcmFnRmluaXNoZWQ9e3RoaXMuaGFuZGxlUGFuZVJlc2l6ZS5iaW5kKHRoaXMpfSBzcGxpdD0ndmVydGljYWwnIG1pblNpemU9ezMwMH0gZGVmYXVsdFNpemU9ezMwMH0+XG4gICAgICAgICAgICAgICAgICA8U2lkZUJhclxuICAgICAgICAgICAgICAgICAgICBzZXREYXNoYm9hcmRWaXNpYmlsaXR5PXt0aGlzLnNldERhc2hib2FyZFZpc2liaWxpdHkuYmluZCh0aGlzKX1cbiAgICAgICAgICAgICAgICAgICAgc3dpdGNoQWN0aXZlTmF2PXt0aGlzLnN3aXRjaEFjdGl2ZU5hdi5iaW5kKHRoaXMpfVxuICAgICAgICAgICAgICAgICAgICBhY3RpdmVOYXY9e3RoaXMuc3RhdGUuYWN0aXZlTmF2fT5cbiAgICAgICAgICAgICAgICAgICAge3RoaXMuc3RhdGUuYWN0aXZlTmF2ID09PSAnbGlicmFyeSdcbiAgICAgICAgICAgICAgICAgICAgICA/IDxMaWJyYXJ5XG4gICAgICAgICAgICAgICAgICAgICAgICBsYXlvdXQ9e3RoaXMubGF5b3V0fVxuICAgICAgICAgICAgICAgICAgICAgICAgZm9sZGVyPXt0aGlzLnN0YXRlLnByb2plY3RGb2xkZXJ9XG4gICAgICAgICAgICAgICAgICAgICAgICBoYWlrdT17dGhpcy5wcm9wcy5oYWlrdX1cbiAgICAgICAgICAgICAgICAgICAgICAgIHdlYnNvY2tldD17dGhpcy5wcm9wcy53ZWJzb2NrZXR9XG4gICAgICAgICAgICAgICAgICAgICAgICB0b3VyQ2hhbm5lbD17dGhpcy50b3VyQ2hhbm5lbH1cbiAgICAgICAgICAgICAgICAgICAgICAgIG9uRHJhZ0VuZD17dGhpcy5vbkxpYnJhcnlEcmFnRW5kLmJpbmQodGhpcyl9XG4gICAgICAgICAgICAgICAgICAgICAgICBvbkRyYWdTdGFydD17dGhpcy5vbkxpYnJhcnlEcmFnU3RhcnQuYmluZCh0aGlzKX1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNyZWF0ZU5vdGljZT17dGhpcy5jcmVhdGVOb3RpY2V9XG4gICAgICAgICAgICAgICAgICAgICAgICByZW1vdmVOb3RpY2U9e3RoaXMucmVtb3ZlTm90aWNlfSAvPlxuICAgICAgICAgICAgICAgICAgICAgIDogPFN0YXRlSW5zcGVjdG9yXG4gICAgICAgICAgICAgICAgICAgICAgICBjcmVhdGVOb3RpY2U9e3RoaXMuY3JlYXRlTm90aWNlfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmVtb3ZlTm90aWNlPXt0aGlzLnJlbW92ZU5vdGljZX1cbiAgICAgICAgICAgICAgICAgICAgICAgIGZvbGRlcj17dGhpcy5zdGF0ZS5wcm9qZWN0Rm9sZGVyfVxuICAgICAgICAgICAgICAgICAgICAgICAgd2Vic29ja2V0PXt0aGlzLnByb3BzLndlYnNvY2tldH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHRvdXJDaGFubmVsPXt0aGlzLnRvdXJDaGFubmVsfSAvPlxuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIDwvU2lkZUJhcj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3twb3NpdGlvbjogJ3JlbGF0aXZlJywgd2lkdGg6ICcxMDAlJywgaGVpZ2h0OiAnMTAwJSd9fT5cbiAgICAgICAgICAgICAgICAgICAgPFN0YWdlXG4gICAgICAgICAgICAgICAgICAgICAgcmVmPSdzdGFnZSdcbiAgICAgICAgICAgICAgICAgICAgICBmb2xkZXI9e3RoaXMuc3RhdGUucHJvamVjdEZvbGRlcn1cbiAgICAgICAgICAgICAgICAgICAgICBlbnZveT17dGhpcy5lbnZveX1cbiAgICAgICAgICAgICAgICAgICAgICBoYWlrdT17dGhpcy5wcm9wcy5oYWlrdX1cbiAgICAgICAgICAgICAgICAgICAgICB3ZWJzb2NrZXQ9e3RoaXMucHJvcHMud2Vic29ja2V0fVxuICAgICAgICAgICAgICAgICAgICAgIHByb2plY3Q9e3RoaXMuc3RhdGUucHJvamVjdE9iamVjdH1cbiAgICAgICAgICAgICAgICAgICAgICBjcmVhdGVOb3RpY2U9e3RoaXMuY3JlYXRlTm90aWNlfVxuICAgICAgICAgICAgICAgICAgICAgIHJlbW92ZU5vdGljZT17dGhpcy5yZW1vdmVOb3RpY2V9XG4gICAgICAgICAgICAgICAgICAgICAgcmVjZWl2ZVByb2plY3RJbmZvPXt0aGlzLnJlY2VpdmVQcm9qZWN0SW5mb31cbiAgICAgICAgICAgICAgICAgICAgICBvcmdhbml6YXRpb25OYW1lPXt0aGlzLnN0YXRlLm9yZ2FuaXphdGlvbk5hbWV9XG4gICAgICAgICAgICAgICAgICAgICAgYXV0aFRva2VuPXt0aGlzLnN0YXRlLmF1dGhUb2tlbn1cbiAgICAgICAgICAgICAgICAgICAgICB1c2VybmFtZT17dGhpcy5zdGF0ZS51c2VybmFtZX1cbiAgICAgICAgICAgICAgICAgICAgICBwYXNzd29yZD17dGhpcy5zdGF0ZS5wYXNzd29yZH0gLz5cbiAgICAgICAgICAgICAgICAgICAgeyh0aGlzLnN0YXRlLmxpYnJhcnlJdGVtRHJhZ2dpbmcpXG4gICAgICAgICAgICAgICAgICAgICAgPyA8ZGl2IHN0eWxlPXt7IHdpZHRoOiAnMTAwJScsIGhlaWdodDogJzEwMCUnLCBiYWNrZ3JvdW5kQ29sb3I6ICd3aGl0ZScsIG9wYWNpdHk6IDAuMDEsIHBvc2l0aW9uOiAnYWJzb2x1dGUnLCB0b3A6IDAsIGxlZnQ6IDAgfX0gLz5cbiAgICAgICAgICAgICAgICAgICAgICA6ICcnIH1cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvU3BsaXRQYW5lPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPFRpbWVsaW5lXG4gICAgICAgICAgICAgICAgcmVmPSd0aW1lbGluZSdcbiAgICAgICAgICAgICAgICBmb2xkZXI9e3RoaXMuc3RhdGUucHJvamVjdEZvbGRlcn1cbiAgICAgICAgICAgICAgICBlbnZveT17dGhpcy5lbnZveX1cbiAgICAgICAgICAgICAgICBoYWlrdT17dGhpcy5wcm9wcy5oYWlrdX1cbiAgICAgICAgICAgICAgICB1c2VybmFtZT17dGhpcy5zdGF0ZS51c2VybmFtZX1cbiAgICAgICAgICAgICAgICBvcmdhbml6YXRpb25OYW1lPXt0aGlzLnN0YXRlLm9yZ2FuaXphdGlvbk5hbWV9XG4gICAgICAgICAgICAgICAgY3JlYXRlTm90aWNlPXt0aGlzLmNyZWF0ZU5vdGljZX1cbiAgICAgICAgICAgICAgICByZW1vdmVOb3RpY2U9e3RoaXMucmVtb3ZlTm90aWNlfSAvPlxuICAgICAgICAgICAgPC9TcGxpdFBhbmU+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG59XG4iXX0=