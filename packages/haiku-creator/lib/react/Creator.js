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
        projectName: projectName
      });

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
            lineNumber: 616
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
              lineNumber: 617
            },
            __self: this
          },
          _react2.default.createElement(
            'div',
            { style: { position: 'absolute', right: 0, top: 0, width: 300 }, __source: {
                fileName: _jsxFileName,
                lineNumber: 621
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
              lineNumber: 625
            },
            __self: this
          },
          _react2.default.createElement(
            'div',
            { style: { display: 'table-cell', width: '100%', height: '100%', verticalAlign: 'middle', textAlign: 'center' }, __source: {
                fileName: _jsxFileName,
                lineNumber: 626
              },
              __self: this
            },
            _react2.default.createElement(
              'svg',
              { width: '170px', height: '221px', viewBox: '0 0 170 221', version: '1.1', __source: {
                  fileName: _jsxFileName,
                  lineNumber: 627
                },
                __self: this
              },
              _react2.default.createElement(
                'g',
                { id: 'Page-1', stroke: 'none', strokeWidth: '1', fill: 'none', fillRule: 'evenodd', __source: {
                    fileName: _jsxFileName,
                    lineNumber: 628
                  },
                  __self: this
                },
                _react2.default.createElement(
                  'g',
                  { id: 'Outlined', transform: 'translate(-211.000000, -114.000000)', fillRule: 'nonzero', fill: '#FAFCFD', __source: {
                      fileName: _jsxFileName,
                      lineNumber: 629
                    },
                    __self: this
                  },
                  _react2.default.createElement(
                    'g',
                    { id: 'outlined-logo', transform: 'translate(211.000000, 113.000000)', __source: {
                        fileName: _jsxFileName,
                        lineNumber: 630
                      },
                      __self: this
                    },
                    _react2.default.createElement('path', { d: 'M47.5,152.798823 L26.3823432,143.954676 C24.5993941,143.207971 23.7593524,141.157281 24.5060576,139.374332 C25.2527628,137.591383 27.3034527,136.751341 29.0864018,137.498046 L117.780058,174.64456 L120.990021,176.089074 C122.486814,176.762645 123.279304,178.358251 122.998698,179.903598 C122.999564,179.935626 123,179.967762 123,180 L123,205.639722 L138.510716,211.910011 L143.368421,213.873764 L162.833333,206.00497 L162.833333,16.2929025 L143,8.27517204 L122.833333,16.4276543 L122.833333,53.6013295 C122.834218,53.6466489 122.834215,53.6919015 122.833333,53.7370634 L122.833333,54 C122.833333,55.9329966 121.26633,57.5 119.333333,57.5 C119.28843,57.5 119.243724,57.4991544 119.19923,57.4974782 L53.307638,84.037149 C51.5146183,84.7593375 49.4756392,83.8912573 48.7534506,82.0982376 C48.0312621,80.3052179 48.8993423,78.2662388 50.692362,77.5440502 L115.833333,51.3067129 L115.833333,14.4974227 C115.833333,14.0143178 115.931213,13.5540739 116.108222,13.1354399 C116.374539,12.0941292 117.115326,11.1888449 118.188238,10.7551148 L141.684186,1.2567527 C142.091317,1.09152936 142.52959,1.00240467 142.975937,0.999164723 C143.47041,1.00240467 143.908683,1.09152936 144.315814,1.2567527 L167.811762,10.7551148 C169.522968,11.446879 170.389328,13.3381659 169.833333,15.0677068 L169.833333,208 C169.833333,208.826304 169.54699,209.585728 169.068118,210.184459 C168.693703,210.867378 168.090133,211.430224 167.311762,211.744885 L144.517645,220.959528 C143.332542,221.438613 142.038995,221.222397 141.089179,220.502712 L135.887192,218.399782 L119.461595,211.759647 C117.54629,211.739055 116,210.180032 116,208.259853 L116,208.07911 C115.998767,208.025708 115.998761,207.972178 116,207.918558 L116,181.518748 L114.991727,181.064589 L54.5,155.730447 L54.5,206.998273 C55.1341468,208.658256 54.4195315,210.512915 52.8796645,211.333333 C52.5545546,211.540709 52.192904,211.695869 51.8065294,211.786997 L29.7867375,220.650655 C28.8252535,221.478758 27.4457005,221.753221 26.1882379,221.244885 L20.3871921,218.899782 L3.30627783,211.994731 C1.46338189,211.894192 -2.60835995e-16,210.367992 0,208.5 L2.70894418e-14,14.4974227 C2.724245e-14,13.4016458 0.503560947,12.4234818 1.29189669,11.781717 C1.65171014,11.3416509 2.12405622,10.9831882 2.68823789,10.7551148 L26.1841862,1.2567527 C26.5913172,1.09152936 27.0295898,1.00240467 27.4759367,0.999164723 C27.9704102,1.00240467 28.4086828,1.09152936 28.8158138,1.2567527 L52.3117621,10.7551148 C54.1038627,11.479581 54.9693514,13.5196615 54.2448852,15.3117621 C53.520419,17.1038627 51.4803385,17.9693514 49.6882379,17.2448852 L27.5,8.27517204 L7,16.5624061 L7,205.937594 L23.0107164,212.410011 L27.2526995,214.124855 L47.5,205.974681 L47.5,152.798823 Z', id: 'Combined-Shape', __source: {
                        fileName: _jsxFileName,
                        lineNumber: 631
                      },
                      __self: this
                    }),
                    _react2.default.createElement('path', { d: 'M146.456827,63.0241849 C146.948603,64.7104724 146.105972,66.5336591 144.447305,67.2283149 L59.5468677,102.784908 L120.416575,128.27735 C122.199524,129.024055 123.039566,131.074745 122.292861,132.857694 C121.546156,134.640643 119.495466,135.480685 117.712517,134.733979 L50.4864131,106.579457 L29.3520293,115.43061 C27.5690802,116.177315 25.5183903,115.337273 24.7716851,113.554324 C24.02498,111.771375 24.8650216,109.720685 26.6479707,108.97398 L47.5,100.241079 L47.5,14.5 C47.5,12.5670034 49.0670034,11 51,11 C52.9329966,11 54.5,12.5670034 54.5,14.5 L54.5,97.3094548 L133.360257,64.2825098 L117.188238,57.7448852 C115.396137,57.020419 114.530649,54.9803385 115.255115,53.1882379 C115.979581,51.3961373 118.019661,50.5306486 119.811762,51.2551148 L139.5,59.2141897 L139.5,25.8602784 L135.887192,24.3997816 L118.188238,17.2448852 C116.396137,16.520419 115.530649,14.4803385 116.255115,12.6882379 C116.979581,10.8961373 119.019661,10.0306486 120.811762,10.7551148 L138.510716,17.9100112 L143.368421,19.8737641 L164.688238,11.2551148 C166.480339,10.5306486 168.520419,11.3961373 169.244885,13.1882379 C169.969351,14.9803385 169.103863,17.020419 167.311762,17.7448852 L146.5,26.1581508 L146.5,62.4728749 C146.5,62.6604574 146.485243,62.8445933 146.456827,63.0241849 Z', id: 'Combined-Shape', __source: {
                        fileName: _jsxFileName,
                        lineNumber: 632
                      },
                      __self: this
                    }),
                    _react2.default.createElement('path', { d: 'M139.5,96.3308069 L122.833333,103.310864 L122.833333,151.372799 C122.833333,153.305795 121.26633,154.872799 119.333333,154.872799 C118.535719,154.872799 117.80042,154.605994 117.211816,154.156763 L26.6479707,116.228315 C26.0976706,115.997847 25.637194,115.643159 25.2854714,115.210462 C24.5008258,114.56862 24,113.592797 24,112.5 L24,25.8602784 L20.3871921,24.3997816 L2.68823789,17.2448852 C0.896137258,16.520419 0.0306485589,14.4803385 0.75511477,12.6882379 C1.47958098,10.8961373 3.51966149,10.0306486 5.31176211,10.7551148 L23.0107164,17.9100112 L27.8684211,19.8737641 L49.1882379,11.2551148 C50.9803385,10.5306486 53.020419,11.3961373 53.7448852,13.1882379 C54.4693514,14.9803385 53.6038627,17.020419 51.8117621,17.7448852 L31,26.1581508 L31,110.461861 L115.833333,145.990351 L115.833333,106.242488 L84.2596616,119.465649 C82.4767125,120.212355 80.4260226,119.372313 79.6793174,117.589364 C78.9326123,115.806415 79.7726539,113.755725 81.555603,113.00902 L141.052151,88.0916622 C141.608974,87.717993 142.27903,87.5 143,87.5 C144.932997,87.5 146.5,89.0670034 146.5,91 L146.5,217.63048 C146.5,219.563477 144.932997,221.13048 143,221.13048 C141.067003,221.13048 139.5,219.563477 139.5,217.63048 L139.5,96.3308069 Z M31,141 L31,217.055237 C31,218.988234 29.4329966,220.555237 27.5,220.555237 C25.5670034,220.555237 24,218.988234 24,217.055237 L24,141 C24,139.067003 25.5670034,137.5 27.5,137.5 C29.4329966,137.5 31,139.067003 31,141 Z', id: 'Combined-Shape', __source: {
                        fileName: _jsxFileName,
                        lineNumber: 633
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
                lineNumber: 638
              },
              __self: this
            }),
            _react2.default.createElement(
              'span',
              { style: { color: '#FAFCFD', display: 'inline-block', width: '100%', height: 50, position: 'absolute', bottom: 50, left: 0 }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 639
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
              lineNumber: 649
            },
            __self: this
          },
          _react2.default.createElement(_AuthenticationUI2.default, Object.assign({
            onSubmit: this.authenticateUser,
            onSubmitSuccess: this.authenticationComplete
          }, this.props, {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 650
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
              lineNumber: 664
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
              lineNumber: 665
            },
            __self: this
          })),
          _react2.default.createElement(_Tour2.default, { projectsList: this.state.projectsList, envoy: this.envoy, startTourOnMount: true, __source: {
              fileName: _jsxFileName,
              lineNumber: 673
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
              lineNumber: 674
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
              lineNumber: 686
            },
            __self: this
          },
          _react2.default.createElement(_Tour2.default, { projectsList: this.state.projectsList, envoy: this.envoy, __source: {
              fileName: _jsxFileName,
              lineNumber: 687
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
              lineNumber: 688
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
              lineNumber: 694
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
              lineNumber: 708
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
                lineNumber: 709
              },
              __self: this
            },
            _react2.default.createElement(
              'div',
              { style: { position: 'absolute', right: 0, top: 0, width: 300 }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 713
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
                lineNumber: 717
              },
              __self: this
            },
            _react2.default.createElement(
              'div',
              { style: { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 718
                },
                __self: this
              },
              _react2.default.createElement(
                'span',
                { style: { fontSize: 24, color: '#222' }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 719
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
            lineNumber: 727
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
            lineNumber: 728
          },
          __self: this
        }),
        _react2.default.createElement(_Tour2.default, { projectsList: this.state.projectsList, envoy: this.envoy, __source: {
            fileName: _jsxFileName,
            lineNumber: 734
          },
          __self: this
        }),
        _react2.default.createElement(
          'div',
          { style: { position: 'absolute', width: '100%', height: '100%', top: 0, left: 0 }, __source: {
              fileName: _jsxFileName,
              lineNumber: 735
            },
            __self: this
          },
          _react2.default.createElement(
            'div',
            { className: 'layout-box', style: { overflow: 'visible' }, __source: {
                fileName: _jsxFileName,
                lineNumber: 736
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
                  lineNumber: 737
                },
                __self: this
              },
              _react2.default.createElement(
                'div',
                { style: { position: 'absolute', right: 0, top: 0, width: 300 }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 741
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
                  lineNumber: 745
                },
                __self: this
              },
              _react2.default.createElement(
                'div',
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 746
                  },
                  __self: this
                },
                _react2.default.createElement(
                  _reactSplitPane2.default,
                  { onDragFinished: this.handlePaneResize.bind(this), split: 'vertical', minSize: 300, defaultSize: 300, __source: {
                      fileName: _jsxFileName,
                      lineNumber: 747
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
                        lineNumber: 748
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
                        lineNumber: 753
                      },
                      __self: this
                    }) : _react2.default.createElement(_StateInspector2.default, {
                      createNotice: this.createNotice,
                      removeNotice: this.removeNotice,
                      folder: this.state.projectFolder,
                      websocket: this.props.websocket,
                      tourChannel: this.tourChannel, __source: {
                        fileName: _jsxFileName,
                        lineNumber: 763
                      },
                      __self: this
                    })
                  ),
                  _react2.default.createElement(
                    'div',
                    { style: { position: 'relative', width: '100%', height: '100%' }, __source: {
                        fileName: _jsxFileName,
                        lineNumber: 771
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
                        lineNumber: 772
                      },
                      __self: this
                    }),
                    this.state.libraryItemDragging ? _react2.default.createElement('div', { style: { width: '100%', height: '100%', backgroundColor: 'white', opacity: 0.01, position: 'absolute', top: 0, left: 0 }, __source: {
                        fileName: _jsxFileName,
                        lineNumber: 787
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
                  lineNumber: 792
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZWFjdC9DcmVhdG9yLmpzIl0sIm5hbWVzIjpbInBrZyIsInJlcXVpcmUiLCJtaXhwYW5lbCIsImVsZWN0cm9uIiwicmVtb3RlIiwiZGlhbG9nIiwiaXBjUmVuZGVyZXIiLCJjbGlwYm9hcmQiLCJ3ZWJGcmFtZSIsInNldFpvb21MZXZlbExpbWl0cyIsInNldExheW91dFpvb21MZXZlbExpbWl0cyIsIkNyZWF0b3IiLCJwcm9wcyIsImF1dGhlbnRpY2F0ZVVzZXIiLCJiaW5kIiwiYXV0aGVudGljYXRpb25Db21wbGV0ZSIsImxvYWRQcm9qZWN0cyIsImxhdW5jaFByb2plY3QiLCJyZW1vdmVOb3RpY2UiLCJjcmVhdGVOb3RpY2UiLCJyZW5kZXJOb3RpZmljYXRpb25zIiwicmVjZWl2ZVByb2plY3RJbmZvIiwiaGFuZGxlRmluZEVsZW1lbnRDb29yZGluYXRlcyIsImhhbmRsZUZpbmRXZWJ2aWV3Q29vcmRpbmF0ZXMiLCJvbkF1dG9VcGRhdGVDaGVja0NvbXBsZXRlIiwibGF5b3V0IiwiYWN0aXZpdHlNb25pdG9yIiwid2luZG93Iiwib25BY3Rpdml0eVJlcG9ydCIsInN0YXRlIiwiZXJyb3IiLCJwcm9qZWN0Rm9sZGVyIiwiZm9sZGVyIiwiYXBwbGljYXRpb25JbWFnZSIsInByb2plY3RPYmplY3QiLCJwcm9qZWN0TmFtZSIsImRhc2hib2FyZFZpc2libGUiLCJyZWFkeUZvckF1dGgiLCJpc1VzZXJBdXRoZW50aWNhdGVkIiwidXNlcm5hbWUiLCJwYXNzd29yZCIsIm5vdGljZXMiLCJzb2Z0d2FyZVZlcnNpb24iLCJ2ZXJzaW9uIiwiZGlkUGx1bWJpbmdOb3RpY2VDcmFzaCIsImFjdGl2ZU5hdiIsInByb2plY3RzTGlzdCIsInVwZGF0ZXIiLCJzaG91bGRDaGVjayIsInNob3VsZFJ1bk9uQmFja2dyb3VuZCIsInNob3VsZFNraXBPcHRJbiIsIndpbiIsImdldEN1cnJlbnRXaW5kb3ciLCJwcm9jZXNzIiwiZW52IiwiREVWIiwib3BlbkRldlRvb2xzIiwiZG9jdW1lbnQiLCJhZGRFdmVudExpc3RlbmVyIiwibmF0aXZlRXZlbnQiLCJfbGFzdE1vdXNlWCIsImNsaWVudFgiLCJfbGFzdE1vdXNlWSIsImNsaWVudFkiLCJjb21ib2tleXMiLCJkb2N1bWVudEVsZW1lbnQiLCJOT0RFX0VOViIsImRlYm91bmNlIiwid2Vic29ja2V0Iiwic2VuZCIsIm1ldGhvZCIsInBhcmFtcyIsImxlYWRpbmciLCJkdW1wU3lzdGVtSW5mbyIsIm9uIiwidHlwZSIsIm5hbWUiLCJvcGVuVGVybWluYWwiLCJzZXRTdGF0ZSIsImV4ZWNTeW5jIiwiSlNPTiIsInN0cmluZ2lmeSIsImV4Y2VwdGlvbiIsImNvbnNvbGUiLCJ0aW1lc3RhbXAiLCJEYXRlIiwibm93IiwiZHVtcGRpciIsImpvaW4iLCJ3cml0ZUZpbGVTeW5jIiwiYXJndiIsImV4aXN0c1N5bmMiLCJyZWFkRmlsZVN5bmMiLCJ0b1N0cmluZyIsImFjdGl2ZUZvbGRlciIsInJlYWN0U3RhdGUiLCJfX2ZpbGVuYW1lIiwiX19kaXJuYW1lIiwiaG9tZWRpciIsImlzRGV2VG9vbHNPcGVuZWQiLCJjbG9zZURldlRvb2xzIiwicmVmcyIsInN0YWdlIiwidG9nZ2xlRGV2VG9vbHMiLCJ0aW1lbGluZSIsIm1heWJlUGFzdGVSZXF1ZXN0IiwicGFzdGVkVGV4dCIsInJlYWRUZXh0IiwicGFzdGVkRGF0YSIsInBhcnNlIiwid2FybiIsIkFycmF5IiwiaXNBcnJheSIsInBhc3RlZEVsZW1lbnQiLCJyZXF1ZXN0IiwidGl0bGUiLCJtZXNzYWdlIiwiY2xvc2VUZXh0IiwibGlnaHRTY2hlbWUiLCJsZW5ndGgiLCJpbmZvIiwiZGF0YSIsImhhbmRsZUNvbnRlbnRQYXN0ZSIsInN0YXJ0V2F0Y2hlcnMiLCJlbnZveSIsInBvcnQiLCJoYWlrdSIsImhvc3QiLCJXZWJTb2NrZXQiLCJnZXQiLCJ0aGVuIiwiZXhwb3J0ZXJDaGFubmVsIiwiZXZlbnQiLCJmb3JtYXQiLCJleHRlbnNpb24iLCJCb2R5bW92aW4iLCJFcnJvciIsInNob3dTYXZlRGlhbG9nIiwidW5kZWZpbmVkIiwiZGVmYXVsdFBhdGgiLCJmaWx0ZXJzIiwiZXh0ZW5zaW9ucyIsImZpbGVuYW1lIiwic2F2ZSIsInRvdXJDaGFubmVsIiwic2V0RGFzaGJvYXJkVmlzaWJpbGl0eSIsInNldFRpbWVvdXQiLCJzdGFydCIsInRocm90dGxlIiwibm90aWZ5U2NyZWVuUmVzaXplIiwiZ2xhc3NDaGFubmVsIiwiY3V0IiwiY29weSIsInBhc3RlRXZlbnQiLCJ0YWduYW1lIiwidGFyZ2V0IiwidGFnTmFtZSIsInRvTG93ZXJDYXNlIiwicHJldmVudERlZmF1bHQiLCJjYiIsImF1dGhBbnN3ZXIiLCJtZXJnZVRvUGF5bG9hZCIsImRpc3RpbmN0X2lkIiwiaGFpa3VUcmFjayIsImF1dGhUb2tlbiIsIm9yZ2FuaXphdGlvbk5hbWUiLCJpc0F1dGhlZCIsImxhdW5jaEZvbGRlciIsImZvbGRlckxvYWRpbmdFcnJvciIsIm9mZiIsInN0b3BXYXRjaGVycyIsInNlbGVjdG9yIiwid2VidmlldyIsImVsZW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwidG9wIiwibGVmdCIsInJlY2VpdmVFbGVtZW50Q29vcmRpbmF0ZXMiLCJyZWNlaXZlV2Vidmlld0Nvb3JkaW5hdGVzIiwiY29udGVudCIsImkiLCJuZXh0IiwicHJvamVjdEluZm8iLCJza2lwQ29udGVudENyZWF0aW9uIiwicHJvamVjdHNIb21lIiwicHJvamVjdFBhdGgiLCJhdXRob3JOYW1lIiwiUmF2ZW4iLCJzZXRFeHRyYUNvbnRleHQiLCJwcm9qZWN0Iiwib3JnYW5pemF0aW9uIiwiZXJyIiwiYXNzaWduIiwibWF5YmVQcm9qZWN0TmFtZSIsImluZGV4IiwiaWQiLCJzbGljZSIsImVhY2giLCJub3RpY2UiLCJNYXRoIiwicmFuZG9tIiwicmVwbGFjZWRFeGlzdGluZyIsImZvckVhY2giLCJuIiwic3BsaWNlIiwidW5zaGlmdCIsImRyYWdFbmROYXRpdmVFdmVudCIsImxpYnJhcnlJdGVtSW5mbyIsImxpYnJhcnlJdGVtRHJhZ2dpbmciLCJwcmV2aWV3IiwiaGFuZGxlRHJvcCIsImRyYWdTdGFydE5hdGl2ZUV2ZW50IiwidXNlcldhc0FjdGl2ZSIsImxvZyIsInBvc2l0aW9uIiwid2lkdGgiLCJoZWlnaHQiLCJyaWdodCIsIm1hcCIsImRpc3BsYXkiLCJ2ZXJ0aWNhbEFsaWduIiwidGV4dEFsaWduIiwiY29sb3IiLCJib3R0b20iLCJyZW5kZXJTdGFydHVwRGVmYXVsdFNjcmVlbiIsInRyYW5zZm9ybSIsImZvbnRTaXplIiwib3ZlcmZsb3ciLCJoYW5kbGVQYW5lUmVzaXplIiwic3dpdGNoQWN0aXZlTmF2Iiwib25MaWJyYXJ5RHJhZ0VuZCIsIm9uTGlicmFyeURyYWdTdGFydCIsImJhY2tncm91bmRDb2xvciIsIm9wYWNpdHkiLCJDb21wb25lbnQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7QUFDQTs7OztBQUNBOztBQUlBOzs7Ozs7Ozs7Ozs7QUFLQSxJQUFJQSxNQUFNQyxRQUFRLHNCQUFSLENBQVY7O0FBRUEsSUFBSUMsV0FBV0QsUUFBUSx3Q0FBUixDQUFmOztBQUVBLElBQU1FLFdBQVdGLFFBQVEsVUFBUixDQUFqQjtBQUNBLElBQU1HLFNBQVNELFNBQVNDLE1BQXhCO0lBQ09DLE0sR0FBVUQsTSxDQUFWQyxNOztBQUNQLElBQU1DLGNBQWNILFNBQVNHLFdBQTdCO0FBQ0EsSUFBTUMsWUFBWUosU0FBU0ksU0FBM0I7O0FBRUEsSUFBSUMsV0FBV0wsU0FBU0ssUUFBeEI7QUFDQSxJQUFJQSxRQUFKLEVBQWM7QUFDWixNQUFJQSxTQUFTQyxrQkFB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Uzs7a0JBQXRCaE8sTyIsImZpbGUiOiJDcmVhdG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgU3R5bGVSb290IH0gZnJvbSAncmFkaXVtJ1xuaW1wb3J0IFNwbGl0UGFuZSBmcm9tICdyZWFjdC1zcGxpdC1wYW5lJ1xuaW1wb3J0IFJlYWN0Q1NTVHJhbnNpdGlvbkdyb3VwIGZyb20gJ3JlYWN0LWFkZG9ucy1jc3MtdHJhbnNpdGlvbi1ncm91cCdcbmltcG9ydCBsb2Rhc2ggZnJvbSAnbG9kYXNoJ1xuaW1wb3J0IENvbWJva2V5cyBmcm9tICdjb21ib2tleXMnXG5pbXBvcnQgRXZlbnRFbWl0dGVyIGZyb20gJ2V2ZW50LWVtaXR0ZXInXG5pbXBvcnQgY3AgZnJvbSAnY2hpbGRfcHJvY2VzcydcbmltcG9ydCBvcyBmcm9tICdvcydcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQgZnMgZnJvbSAnZnMnXG5pbXBvcnQgQXV0aGVudGljYXRpb25VSSBmcm9tICcuL2NvbXBvbmVudHMvQXV0aGVudGljYXRpb25VSSdcbmltcG9ydCBQcm9qZWN0QnJvd3NlciBmcm9tICcuL2NvbXBvbmVudHMvUHJvamVjdEJyb3dzZXInXG5pbXBvcnQgU2lkZUJhciBmcm9tICcuL2NvbXBvbmVudHMvU2lkZUJhcidcbmltcG9ydCBMaWJyYXJ5IGZyb20gJy4vY29tcG9uZW50cy9saWJyYXJ5L0xpYnJhcnknXG5pbXBvcnQgU3RhdGVJbnNwZWN0b3IgZnJvbSAnLi9jb21wb25lbnRzL1N0YXRlSW5zcGVjdG9yL1N0YXRlSW5zcGVjdG9yJ1xuaW1wb3J0IFN0YWdlIGZyb20gJy4vY29tcG9uZW50cy9TdGFnZSdcbmltcG9ydCBUaW1lbGluZSBmcm9tICcuL2NvbXBvbmVudHMvVGltZWxpbmUnXG5pbXBvcnQgVG9hc3QgZnJvbSAnLi9jb21wb25lbnRzL25vdGlmaWNhdGlvbnMvVG9hc3QnXG5pbXBvcnQgVG91ciBmcm9tICcuL2NvbXBvbmVudHMvVG91ci9Ub3VyJ1xuaW1wb3J0IEF1dG9VcGRhdGVyIGZyb20gJy4vY29tcG9uZW50cy9BdXRvVXBkYXRlcidcbmltcG9ydCBFbnZveUNsaWVudCBmcm9tICdoYWlrdS1zZGstY3JlYXRvci9saWIvZW52b3kvY2xpZW50J1xuaW1wb3J0IHsgRVhQT1JURVJfQ0hBTk5FTCwgRXhwb3J0ZXJGb3JtYXQgfSBmcm9tICdoYWlrdS1zZGstY3JlYXRvci9saWIvZXhwb3J0ZXInXG5pbXBvcnQgeyBHTEFTU19DSEFOTkVMIH0gZnJvbSAnaGFpa3Utc2RrLWNyZWF0b3IvbGliL2dsYXNzJ1xuaW1wb3J0IEFjdGl2aXR5TW9uaXRvciBmcm9tICcuLi91dGlscy9hY3Rpdml0eU1vbml0b3IuanMnXG5pbXBvcnQge1xuICBsaW5rRXh0ZXJuYWxBc3NldHNPbkRyb3AsXG4gIHByZXZlbnREZWZhdWx0RHJhZ1xufSBmcm9tICdoYWlrdS1zZXJpYWxpemF0aW9uL3NyYy91dGlscy9kbmRIZWxwZXJzJ1xuaW1wb3J0IHtcbiAgSE9NRURJUl9QQVRILFxuICBIT01FRElSX0xPR1NfUEFUSFxufSBmcm9tICdoYWlrdS1zZXJpYWxpemF0aW9uL3NyYy91dGlscy9IYWlrdUhvbWVEaXInXG5cbnZhciBwa2cgPSByZXF1aXJlKCcuLy4uLy4uL3BhY2thZ2UuanNvbicpXG5cbnZhciBtaXhwYW5lbCA9IHJlcXVpcmUoJ2hhaWt1LXNlcmlhbGl6YXRpb24vc3JjL3V0aWxzL01peHBhbmVsJylcblxuY29uc3QgZWxlY3Ryb24gPSByZXF1aXJlKCdlbGVjdHJvbicpXG5jb25zdCByZW1vdGUgPSBlbGVjdHJvbi5yZW1vdGVcbmNvbnN0IHtkaWFsb2d9ID0gcmVtb3RlXG5jb25zdCBpcGNSZW5kZXJlciA9IGVsZWN0cm9uLmlwY1JlbmRlcmVyXG5jb25zdCBjbGlwYm9hcmQgPSBlbGVjdHJvbi5jbGlwYm9hcmRcblxudmFyIHdlYkZyYW1lID0gZWxlY3Ryb24ud2ViRnJhbWVcbmlmICh3ZWJGcmFtZSkge1xuICBpZiAod2ViRnJhbWUuc2V0Wm9vbUxldmVsTGltaXRzKSB3ZWJGcmFtZS5zZXRab29tTGV2ZWxMaW1pdHMoMSwgMSlcbiAgaWYgKHdlYkZyYW1lLnNldExheW91dFpvb21MZXZlbExpbWl0cykgd2ViRnJhbWUuc2V0TGF5b3V0Wm9vbUxldmVsTGltaXRzKDAsIDApXG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENyZWF0b3IgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3RvciAocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcylcbiAgICB0aGlzLmF1dGhlbnRpY2F0ZVVzZXIgPSB0aGlzLmF1dGhlbnRpY2F0ZVVzZXIuYmluZCh0aGlzKVxuICAgIHRoaXMuYXV0aGVudGljYXRpb25Db21wbGV0ZSA9IHRoaXMuYXV0aGVudGljYXRpb25Db21wbGV0ZS5iaW5kKHRoaXMpXG4gICAgdGhpcy5sb2FkUHJvamVjdHMgPSB0aGlzLmxvYWRQcm9qZWN0cy5iaW5kKHRoaXMpXG4gICAgdGhpcy5sYXVuY2hQcm9qZWN0ID0gdGhpcy5sYXVuY2hQcm9qZWN0LmJpbmQodGhpcylcbiAgICB0aGlzLnJlbW92ZU5vdGljZSA9IHRoaXMucmVtb3ZlTm90aWNlLmJpbmQodGhpcylcbiAgICB0aGlzLmNyZWF0ZU5vdGljZSA9IHRoaXMuY3JlYXRlTm90aWNlLmJpbmQodGhpcylcbiAgICB0aGlzLnJlbmRlck5vdGlmaWNhdGlvbnMgPSB0aGlzLnJlbmRlck5vdGlmaWNhdGlvbnMuYmluZCh0aGlzKVxuICAgIHRoaXMucmVjZWl2ZVByb2plY3RJbmZvID0gdGhpcy5yZWNlaXZlUHJvamVjdEluZm8uYmluZCh0aGlzKVxuICAgIHRoaXMuaGFuZGxlRmluZEVsZW1lbnRDb29yZGluYXRlcyA9IHRoaXMuaGFuZGxlRmluZEVsZW1lbnRDb29yZGluYXRlcy5iaW5kKHRoaXMpXG4gICAgdGhpcy5oYW5kbGVGaW5kV2Vidmlld0Nvb3JkaW5hdGVzID0gdGhpcy5oYW5kbGVGaW5kV2Vidmlld0Nvb3JkaW5hdGVzLmJpbmQodGhpcylcbiAgICB0aGlzLm9uQXV0b1VwZGF0ZUNoZWNrQ29tcGxldGUgPSB0aGlzLm9uQXV0b1VwZGF0ZUNoZWNrQ29tcGxldGUuYmluZCh0aGlzKVxuICAgIHRoaXMubGF5b3V0ID0gbmV3IEV2ZW50RW1pdHRlcigpXG4gICAgdGhpcy5hY3Rpdml0eU1vbml0b3IgPSBuZXcgQWN0aXZpdHlNb25pdG9yKHdpbmRvdywgdGhpcy5vbkFjdGl2aXR5UmVwb3J0LmJpbmQodGhpcykpXG5cbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgZXJyb3I6IG51bGwsXG4gICAgICBwcm9qZWN0Rm9sZGVyOiB0aGlzLnByb3BzLmZvbGRlcixcbiAgICAgIGFwcGxpY2F0aW9uSW1hZ2U6IG51bGwsXG4gICAgICBwcm9qZWN0T2JqZWN0OiBudWxsLFxuICAgICAgcHJvamVjdE5hbWU6IG51bGwsXG4gICAgICBkYXNoYm9hcmRWaXNpYmxlOiAhdGhpcy5wcm9wcy5mb2xkZXIsXG4gICAgICByZWFkeUZvckF1dGg6IGZhbHNlLFxuICAgICAgaXNVc2VyQXV0aGVudGljYXRlZDogZmFsc2UsXG4gICAgICB1c2VybmFtZTogbnVsbCxcbiAgICAgIHBhc3N3b3JkOiBudWxsLFxuICAgICAgbm90aWNlczogW10sXG4gICAgICBzb2Z0d2FyZVZlcnNpb246IHBrZy52ZXJzaW9uLFxuICAgICAgZGlkUGx1bWJpbmdOb3RpY2VDcmFzaDogZmFsc2UsXG4gICAgICBhY3RpdmVOYXY6ICdsaWJyYXJ5JyxcbiAgICAgIHByb2plY3RzTGlzdDogW10sXG4gICAgICB1cGRhdGVyOiB7XG4gICAgICAgIHNob3VsZENoZWNrOiB0cnVlLFxuICAgICAgICBzaG91bGRSdW5PbkJhY2tncm91bmQ6IHRydWUsXG4gICAgICAgIHNob3VsZFNraXBPcHRJbjogdHJ1ZVxuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IHdpbiA9IHJlbW90ZS5nZXRDdXJyZW50V2luZG93KClcblxuICAgIGlmIChwcm9jZXNzLmVudi5ERVYgPT09ICcxJykge1xuICAgICAgd2luLm9wZW5EZXZUb29scygpXG4gICAgfVxuXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgKG5hdGl2ZUV2ZW50KSA9PiB7XG4gICAgICB0aGlzLl9sYXN0TW91c2VYID0gbmF0aXZlRXZlbnQuY2xpZW50WFxuICAgICAgdGhpcy5fbGFzdE1vdXNlWSA9IG5hdGl2ZUV2ZW50LmNsaWVudFlcbiAgICB9KVxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWcnLCAobmF0aXZlRXZlbnQpID0+IHtcbiAgICAgIC8vIFdoZW4gdGhlIGRyYWcgZW5kcywgZm9yIHNvbWUgcmVhc29uIHRoZSBwb3NpdGlvbiBnb2VzIHRvIDAsIHNvIGhhY2sgdGhpcy4uLlxuICAgICAgaWYgKG5hdGl2ZUV2ZW50LmNsaWVudFggPiAwICYmIG5hdGl2ZUV2ZW50LmNsaWVudFkgPiAwKSB7XG4gICAgICAgIHRoaXMuX2xhc3RNb3VzZVggPSBuYXRpdmVFdmVudC5jbGllbnRYXG4gICAgICAgIHRoaXMuX2xhc3RNb3VzZVkgPSBuYXRpdmVFdmVudC5jbGllbnRZXG4gICAgICB9XG4gICAgfSlcblxuICAgIGNvbnN0IGNvbWJva2V5cyA9IG5ldyBDb21ib2tleXMoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KVxuXG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgIGNvbWJva2V5cy5iaW5kKCdjb21tYW5kK29wdGlvbitpJywgbG9kYXNoLmRlYm91bmNlKCgpID0+IHtcbiAgICAgICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQuc2VuZCh7IG1ldGhvZDogJ3RvZ2dsZURldlRvb2xzJywgcGFyYW1zOiBbdGhpcy5zdGF0ZS5wcm9qZWN0Rm9sZGVyXSB9KVxuICAgICAgfSwgNTAwLCB7IGxlYWRpbmc6IHRydWUgfSkpXG4gICAgfVxuXG4gICAgY29tYm9rZXlzLmJpbmQoJ2NvbW1hbmQrb3B0aW9uKzAnLCBsb2Rhc2guZGVib3VuY2UoKCkgPT4ge1xuICAgICAgdGhpcy5kdW1wU3lzdGVtSW5mbygpXG4gICAgfSwgNTAwLCB7IGxlYWRpbmc6IHRydWUgfSkpXG5cbiAgICAvLyBOT1RFOiBUaGUgVG9wTWVudSBhdXRvbWF0aWNhbGx5IGJpbmRzIHRoZSBiZWxvdyBrZXlib2FyZCBzaG9ydGN1dHMvYWNjZWxlcmF0b3JzXG4gICAgaXBjUmVuZGVyZXIub24oJ2dsb2JhbC1tZW51Onpvb20taW4nLCAoKSA9PiB7XG4gICAgICB0aGlzLnByb3BzLndlYnNvY2tldC5zZW5kKHsgdHlwZTogJ2Jyb2FkY2FzdCcsIG5hbWU6ICd2aWV3Onpvb20taW4nIH0pXG4gICAgfSlcbiAgICBpcGNSZW5kZXJlci5vbignZ2xvYmFsLW1lbnU6em9vbS1vdXQnLCAoKSA9PiB7XG4gICAgICB0aGlzLnByb3BzLndlYnNvY2tldC5zZW5kKHsgdHlwZTogJ2Jyb2FkY2FzdCcsIG5hbWU6ICd2aWV3Onpvb20tb3V0JyB9KVxuICAgIH0pXG4gICAgaXBjUmVuZGVyZXIub24oJ2dsb2JhbC1tZW51Om9wZW4tdGVybWluYWwnLCBsb2Rhc2guZGVib3VuY2UoKCkgPT4ge1xuICAgICAgdGhpcy5vcGVuVGVybWluYWwodGhpcy5zdGF0ZS5wcm9qZWN0Rm9sZGVyKVxuICAgIH0sIDUwMCwgeyBsZWFkaW5nOiB0cnVlIH0pKVxuICAgIGlwY1JlbmRlcmVyLm9uKCdnbG9iYWwtbWVudTp1bmRvJywgbG9kYXNoLmRlYm91bmNlKCgpID0+IHtcbiAgICAgIHRoaXMucHJvcHMud2Vic29ja2V0LnNlbmQoeyBtZXRob2Q6ICdnaXRVbmRvJywgcGFyYW1zOiBbdGhpcy5zdGF0ZS5wcm9qZWN0Rm9sZGVyLCB7IHR5cGU6ICdnbG9iYWwnIH1dIH0pXG4gICAgfSwgNTAwLCB7IGxlYWRpbmc6IHRydWUgfSkpXG4gICAgaXBjUmVuZGVyZXIub24oJ2dsb2JhbC1tZW51OnJlZG8nLCBsb2Rhc2guZGVib3VuY2UoKCkgPT4ge1xuICAgICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQuc2VuZCh7IG1ldGhvZDogJ2dpdFJlZG8nLCBwYXJhbXM6IFt0aGlzLnN0YXRlLnByb2plY3RGb2xkZXIsIHsgdHlwZTogJ2dsb2JhbCcgfV0gfSlcbiAgICB9LCA1MDAsIHsgbGVhZGluZzogdHJ1ZSB9KSlcbiAgICBpcGNSZW5kZXJlci5vbignZ2xvYmFsLW1lbnU6Y2hlY2stdXBkYXRlcycsICgpID0+IHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICB1cGRhdGVyOiB7XG4gICAgICAgICAgc2hvdWxkQ2hlY2s6IHRydWUsXG4gICAgICAgICAgc2hvdWxkUnVuT25CYWNrZ3JvdW5kOiBmYWxzZSxcbiAgICAgICAgICBzaG91bGRTa2lwT3B0SW46IHRydWVcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdvdmVyJywgcHJldmVudERlZmF1bHREcmFnLCBmYWxzZSlcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignZHJvcCcsIGxpbmtFeHRlcm5hbEFzc2V0c09uRHJvcC5iaW5kKHRoaXMpLCBmYWxzZSlcbiAgfVxuXG4gIG9wZW5UZXJtaW5hbCAoZm9sZGVyKSB7XG4gICAgdHJ5IHtcbiAgICAgIGNwLmV4ZWNTeW5jKCdvcGVuIC1iIGNvbS5hcHBsZS50ZXJtaW5hbCAnICsgSlNPTi5zdHJpbmdpZnkoZm9sZGVyKSArICcgfHwgdHJ1ZScpXG4gICAgfSBjYXRjaCAoZXhjZXB0aW9uKSB7XG4gICAgICBjb25zb2xlLmVycm9yKGV4Y2VwdGlvbilcbiAgICB9XG4gIH1cblxuICBkdW1wU3lzdGVtSW5mbyAoKSB7XG4gICAgY29uc3QgdGltZXN0YW1wID0gRGF0ZS5ub3coKVxuICAgIGNvbnN0IGR1bXBkaXIgPSBwYXRoLmpvaW4oSE9NRURJUl9QQVRILCAnZHVtcHMnLCBgZHVtcC0ke3RpbWVzdGFtcH1gKVxuICAgIGNwLmV4ZWNTeW5jKGBta2RpciAtcCAke0pTT04uc3RyaW5naWZ5KGR1bXBkaXIpfWApXG4gICAgZnMud3JpdGVGaWxlU3luYyhwYXRoLmpvaW4oZHVtcGRpciwgJ2FyZ3YnKSwgSlNPTi5zdHJpbmdpZnkocHJvY2Vzcy5hcmd2LCBudWxsLCAyKSlcbiAgICBmcy53cml0ZUZpbGVTeW5jKHBhdGguam9pbihkdW1wZGlyLCAnZW52JyksIEpTT04uc3RyaW5naWZ5KHByb2Nlc3MuZW52LCBudWxsLCAyKSlcbiAgICBpZiAoZnMuZXhpc3RzU3luYyhwYXRoLmpvaW4oSE9NRURJUl9MT0dTX1BBVEgsICdoYWlrdS1kZWJ1Zy5sb2cnKSkpIHtcbiAgICAgIGZzLndyaXRlRmlsZVN5bmMocGF0aC5qb2luKGR1bXBkaXIsICdsb2cnKSwgZnMucmVhZEZpbGVTeW5jKHBhdGguam9pbihIT01FRElSX0xPR1NfUEFUSCwgJ2hhaWt1LWRlYnVnLmxvZycpKS50b1N0cmluZygpKVxuICAgIH1cbiAgICBmcy53cml0ZUZpbGVTeW5jKHBhdGguam9pbihkdW1wZGlyLCAnaW5mbycpLCBKU09OLnN0cmluZ2lmeSh7XG4gICAgICBhY3RpdmVGb2xkZXI6IHRoaXMuc3RhdGUucHJvamVjdEZvbGRlcixcbiAgICAgIHJlYWN0U3RhdGU6IHRoaXMuc3RhdGUsXG4gICAgICBfX2ZpbGVuYW1lOiBfX2ZpbGVuYW1lLFxuICAgICAgX19kaXJuYW1lOiBfX2Rpcm5hbWVcbiAgICB9LCBudWxsLCAyKSlcbiAgICBpZiAodGhpcy5zdGF0ZS5wcm9qZWN0Rm9sZGVyKSB7XG4gICAgICAvLyBUaGUgcHJvamVjdCBmb2xkZXIgaXRzZWxmIHdpbGwgY29udGFpbiBnaXQgbG9ncyBhbmQgb3RoZXIgZ29vZGllcyB3ZSBtZ2lodCB3YW50IHRvIGxvb2sgYXRcbiAgICAgIGNwLmV4ZWNTeW5jKGB0YXIgLXpjdmYgJHtKU09OLnN0cmluZ2lmeShwYXRoLmpvaW4oZHVtcGRpciwgJ3Byb2plY3QudGFyLmd6JykpfSAke0pTT04uc3RyaW5naWZ5KHRoaXMuc3RhdGUucHJvamVjdEZvbGRlcil9YClcbiAgICB9XG4gICAgLy8gRm9yIGNvbnZlbmllbmNlLCB6aXAgdXAgdGhlIGVudGlyZSBkdW1wIGZvbGRlci4uLlxuICAgIGNwLmV4ZWNTeW5jKGB0YXIgLXpjdmYgJHtKU09OLnN0cmluZ2lmeShwYXRoLmpvaW4ob3MuaG9tZWRpcigpLCBgaGFpa3UtZHVtcC0ke3RpbWVzdGFtcH0udGFyLmd6YCkpfSAke0pTT04uc3RyaW5naWZ5KGR1bXBkaXIpfWApXG4gIH1cblxuICB0b2dnbGVEZXZUb29scyAoKSB7XG4gICAgY29uc3Qgd2luID0gcmVtb3RlLmdldEN1cnJlbnRXaW5kb3coKVxuICAgIGlmICh3aW4uaXNEZXZUb29sc09wZW5lZCgpKSB3aW4uY2xvc2VEZXZUb29scygpXG4gICAgZWxzZSB3aW4ub3BlbkRldlRvb2xzKClcbiAgICBpZiAodGhpcy5yZWZzLnN0YWdlKSB0aGlzLnJlZnMuc3RhZ2UudG9nZ2xlRGV2VG9vbHMoKVxuICAgIGlmICh0aGlzLnJlZnMudGltZWxpbmUpIHRoaXMucmVmcy50aW1lbGluZS50b2dnbGVEZXZUb29scygpXG4gIH1cblxuICBoYW5kbGVDb250ZW50UGFzdGUgKG1heWJlUGFzdGVSZXF1ZXN0KSB7XG4gICAgbGV0IHBhc3RlZFRleHQgPSBjbGlwYm9hcmQucmVhZFRleHQoKVxuICAgIGlmICghcGFzdGVkVGV4dCkgcmV0dXJuIHZvaWQgKDApXG5cbiAgICAvLyBUaGUgZGF0YSBvbiB0aGUgY2xpcGJvYXJkIG1pZ2h0IGJlIHNlcmlhbGl6ZWQgZGF0YSwgc28gdHJ5IHRvIHBhcnNlIGl0IGlmIHRoYXQncyB0aGUgY2FzZVxuICAgIC8vIFRoZSBtYWluIGNhc2Ugd2UgaGF2ZSBub3cgZm9yIHNlcmlhbGl6ZWQgZGF0YSBpcyBoYWlrdSBlbGVtZW50cyBjb3BpZWQgZnJvbSB0aGUgc3RhZ2VcbiAgICBsZXQgcGFzdGVkRGF0YVxuICAgIHRyeSB7XG4gICAgICBwYXN0ZWREYXRhID0gSlNPTi5wYXJzZShwYXN0ZWRUZXh0KVxuICAgIH0gY2F0Y2ggKGV4Y2VwdGlvbikge1xuICAgICAgY29uc29sZS53YXJuKCdbY3JlYXRvcl0gdW5hYmxlIHRvIHBhcnNlIHBhc3RlZCBkYXRhOyBpdCBtaWdodCBiZSBwbGFpbiB0ZXh0JylcbiAgICAgIHBhc3RlZERhdGEgPSBwYXN0ZWRUZXh0XG4gICAgfVxuXG4gICAgaWYgKEFycmF5LmlzQXJyYXkocGFzdGVkRGF0YSkpIHtcbiAgICAgIC8vIFRoaXMgbG9va3MgbGlrZSBhIEhhaWt1IGVsZW1lbnQgdGhhdCBoYXMgYmVlbiBjb3BpZWQgZnJvbSB0aGUgc3RhZ2VcbiAgICAgIGlmIChwYXN0ZWREYXRhWzBdID09PSAnYXBwbGljYXRpb24vaGFpa3UnICYmIHR5cGVvZiBwYXN0ZWREYXRhWzFdID09PSAnb2JqZWN0Jykge1xuICAgICAgICBsZXQgcGFzdGVkRWxlbWVudCA9IHBhc3RlZERhdGFbMV1cblxuICAgICAgICAvLyBDb21tYW5kIHRoZSB2aWV3cyBhbmQgbWFzdGVyIHByb2Nlc3MgdG8gaGFuZGxlIHRoZSBlbGVtZW50IHBhc3RlIGFjdGlvblxuICAgICAgICAvLyBUaGUgJ3Bhc3RlVGhpbmcnIGFjdGlvbiBpcyBpbnRlbmRlZCB0byBiZSBhYmxlIHRvIGhhbmRsZSBtdWx0aXBsZSBjb250ZW50IHR5cGVzXG4gICAgICAgIHJldHVybiB0aGlzLnByb3BzLndlYnNvY2tldC5yZXF1ZXN0KHsgdHlwZTogJ2FjdGlvbicsIG1ldGhvZDogJ3Bhc3RlVGhpbmcnLCBwYXJhbXM6IFt0aGlzLnN0YXRlLnByb2plY3RGb2xkZXIsIHBhc3RlZEVsZW1lbnQsIG1heWJlUGFzdGVSZXF1ZXN0IHx8IHt9XSB9LCAoZXJyb3IpID0+IHtcbiAgICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jcmVhdGVOb3RpY2Uoe1xuICAgICAgICAgICAgICB0eXBlOiAnd2FybmluZycsXG4gICAgICAgICAgICAgIHRpdGxlOiAnVWggb2ghJyxcbiAgICAgICAgICAgICAgbWVzc2FnZTogJ1dlIGNvdWxkblxcJ3QgcGFzdGUgdGhhdC4g8J+YoiBQbGVhc2UgY29udGFjdCBIYWlrdSBmb3Igc3VwcG9ydC4nLFxuICAgICAgICAgICAgICBjbG9zZVRleHQ6ICdPa2F5JyxcbiAgICAgICAgICAgICAgbGlnaHRTY2hlbWU6IHRydWVcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gVE9ETzogSGFuZGxlIG90aGVyIGNhc2VzIHdoZXJlIHRoZSBwYXN0ZSBkYXRhIHdhcyBhIHNlcmlhbGl6ZWQgYXJyYXlcbiAgICAgICAgY29uc29sZS53YXJuKCdbY3JlYXRvcl0gY2Fubm90IHBhc3RlIHRoaXMgY29udGVudCB0eXBlIHlldCAoYXJyYXkpJylcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gQW4gZW1wdHkgc3RyaW5nIGlzIHRyZWF0ZWQgYXMgdGhlIGVxdWl2YWxlbnQgb2Ygbm90aGluZyAoZG9uJ3QgZGlzcGxheSB3YXJuaW5nIGlmIG5vdGhpbmcgdG8gaW5zdGFudGlhdGUpXG4gICAgICBpZiAodHlwZW9mIHBhc3RlZERhdGEgPT09ICdzdHJpbmcnICYmIHBhc3RlZERhdGEubGVuZ3RoID4gMCkge1xuICAgICAgICAvLyBUT0RPOiBIYW5kbGUgdGhlIGNhc2Ugd2hlbiBwbGFpbiB0ZXh0IGhhcyBiZWVuIHBhc3RlZCAtIFNWRywgSFRNTCwgZXRjP1xuICAgICAgICBjb25zb2xlLndhcm4oJ1tjcmVhdG9yXSBjYW5ub3QgcGFzdGUgdGhpcyBjb250ZW50IHR5cGUgeWV0ICh1bmtub3duIHN0cmluZyknKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxNb3VudCAoKSB7XG4gICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQub24oJ2Jyb2FkY2FzdCcsIChtZXNzYWdlKSA9PiB7XG4gICAgICBzd2l0Y2ggKG1lc3NhZ2UubmFtZSkge1xuICAgICAgICBjYXNlICdkZXYtdG9vbHM6dG9nZ2xlJzpcbiAgICAgICAgICB0aGlzLnRvZ2dsZURldlRvb2xzKClcbiAgICAgICAgICBicmVha1xuXG4gICAgICAgIGNhc2UgJ2N1cnJlbnQtcGFzdGVhYmxlOnJlcXVlc3QtcGFzdGUnOlxuICAgICAgICAgIGNvbnNvbGUuaW5mbygnW2NyZWF0b3JdIGN1cnJlbnQtcGFzdGVhYmxlOnJlcXVlc3QtcGFzdGUnLCBtZXNzYWdlLmRhdGEpXG4gICAgICAgICAgcmV0dXJuIHRoaXMuaGFuZGxlQ29udGVudFBhc3RlKG1lc3NhZ2UuZGF0YSlcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgdGhpcy5hY3Rpdml0eU1vbml0b3Iuc3RhcnRXYXRjaGVycygpXG5cbiAgICB0aGlzLmVudm95ID0gbmV3IEVudm95Q2xpZW50KHtcbiAgICAgIHBvcnQ6IHRoaXMucHJvcHMuaGFpa3UuZW52b3kucG9ydCxcbiAgICAgIGhvc3Q6IHRoaXMucHJvcHMuaGFpa3UuZW52b3kuaG9zdCxcbiAgICAgIFdlYlNvY2tldDogd2luZG93LldlYlNvY2tldFxuICAgIH0pXG5cbiAgICB0aGlzLmVudm95LmdldChFWFBPUlRFUl9DSEFOTkVMKS50aGVuKChleHBvcnRlckNoYW5uZWwpID0+IHtcbiAgICAgIGlwY1JlbmRlcmVyLm9uKCdnbG9iYWwtbWVudTpleHBvcnQnLCAoZXZlbnQsIFtmb3JtYXRdKSA9PiB7XG4gICAgICAgIGxldCBleHRlbnNpb25cbiAgICAgICAgc3dpdGNoIChmb3JtYXQpIHtcbiAgICAgICAgICBjYXNlIEV4cG9ydGVyRm9ybWF0LkJvZHltb3ZpbjpcbiAgICAgICAgICAgIGV4dGVuc2lvbiA9ICdqc29uJ1xuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbnN1cHBvcnRlZCBmb3JtYXQ6ICR7Zm9ybWF0fWApXG4gICAgICAgIH1cblxuICAgICAgICBkaWFsb2cuc2hvd1NhdmVEaWFsb2codW5kZWZpbmVkLCB7XG4gICAgICAgICAgZGVmYXVsdFBhdGg6IGAqLyR7dGhpcy5zdGF0ZS5wcm9qZWN0TmFtZX1gLFxuICAgICAgICAgIGZpbHRlcnM6IFt7XG4gICAgICAgICAgICBuYW1lOiBmb3JtYXQsXG4gICAgICAgICAgICBleHRlbnNpb25zOiBbZXh0ZW5zaW9uXVxuICAgICAgICAgIH1dXG4gICAgICAgIH0sXG4gICAgICAgIChmaWxlbmFtZSkgPT4ge1xuICAgICAgICAgIGV4cG9ydGVyQ2hhbm5lbC5zYXZlKHtmb3JtYXQsIGZpbGVuYW1lfSlcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIHRoaXMuZW52b3kuZ2V0KCd0b3VyJykudGhlbigodG91ckNoYW5uZWwpID0+IHtcbiAgICAgIHRoaXMudG91ckNoYW5uZWwgPSB0b3VyQ2hhbm5lbFxuXG4gICAgICB0b3VyQ2hhbm5lbC5vbigndG91cjpyZXF1ZXN0RWxlbWVudENvb3JkaW5hdGVzJywgdGhpcy5oYW5kbGVGaW5kRWxlbWVudENvb3JkaW5hdGVzKVxuXG4gICAgICB0b3VyQ2hhbm5lbC5vbigndG91cjpyZXF1ZXN0V2Vidmlld0Nvb3JkaW5hdGVzJywgdGhpcy5oYW5kbGVGaW5kV2Vidmlld0Nvb3JkaW5hdGVzKVxuXG4gICAgICBpcGNSZW5kZXJlci5vbignZ2xvYmFsLW1lbnU6c3RhcnQtdG91cicsICgpID0+IHtcbiAgICAgICAgdGhpcy5zZXREYXNoYm9hcmRWaXNpYmlsaXR5KHRydWUpXG5cbiAgICAgICAgLy8gUHV0IGl0IGF0IHRoZSBib3R0b20gb2YgdGhlIGV2ZW50IGxvb3BcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgdG91ckNoYW5uZWwuc3RhcnQodHJ1ZSlcbiAgICAgICAgfSlcbiAgICAgIH0pXG5cbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCBsb2Rhc2gudGhyb3R0bGUoKCkgPT4ge1xuICAgICAgICAvLyBpZiAodG91ckNoYW5uZWwuaXNUb3VyQWN0aXZlKCkpIHtcbiAgICAgICAgdG91ckNoYW5uZWwubm90aWZ5U2NyZWVuUmVzaXplKClcbiAgICAgICAgLy8gfVxuICAgICAgfSksIDMwMClcbiAgICB9KVxuXG4gICAgdGhpcy5lbnZveS5nZXQoR0xBU1NfQ0hBTk5FTCkudGhlbigoZ2xhc3NDaGFubmVsKSA9PiB7XG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjdXQnLCBnbGFzc0NoYW5uZWwuY3V0KVxuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY29weScsIGdsYXNzQ2hhbm5lbC5jb3B5KVxuICAgIH0pXG5cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdwYXN0ZScsIChwYXN0ZUV2ZW50KSA9PiB7XG4gICAgICBjb25zb2xlLmluZm8oJ1tjcmVhdG9yXSBwYXN0ZSBoZWFyZCcpXG4gICAgICBsZXQgdGFnbmFtZSA9IHBhc3RlRXZlbnQudGFyZ2V0LnRhZ05hbWUudG9Mb3dlckNhc2UoKVxuICAgICAgaWYgKHRhZ25hbWUgPT09ICdpbnB1dCcgfHwgdGFnbmFtZSA9PT0gJ3RleHRhcmVhJykge1xuICAgICAgICAvLyBEbyBub3RoaW5nOyBsZXQgaW5wdXQgZmllbGRzIGFuZCBzby1vbiBiZSBoYW5kbGVkIG5vcm1hbGx5XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBPdGhlcndpc2UsIGFzc3VtZSB3ZSBtaWdodCBuZWVkIHRvIGhhbmRsZSB0aGlzIHBhc3RlIGV2ZW50IHNwZWNpYWxseVxuICAgICAgICBwYXN0ZUV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgdGhpcy5oYW5kbGVDb250ZW50UGFzdGUoKVxuICAgICAgfVxuICAgIH0pXG5cbiAgICB0aGlzLnByb3BzLndlYnNvY2tldC5vbignbWV0aG9kJywgKG1ldGhvZCwgcGFyYW1zLCBjYikgPT4ge1xuICAgICAgY29uc29sZS5pbmZvKCdbY3JlYXRvcl0gbWV0aG9kIGZyb20gcGx1bWJpbmc6JywgbWV0aG9kLCBwYXJhbXMpXG4gICAgICAvLyBuby1vcDsgY3JlYXRvciBkb2Vzbid0IGN1cnJlbnRseSByZWNlaXZlIGFueSBtZXRob2RzIGZyb20gdGhlIG90aGVyIHZpZXdzLCBidXQgd2UgbmVlZCB0aGlzXG4gICAgICAvLyBjYWxsYmFjayB0byBiZSBjYWxsZWQgdG8gYWxsb3cgdGhlIGFjdGlvbiBjaGFpbiBpbiBwbHVtYmluZyB0byBwcm9jZWVkXG4gICAgICByZXR1cm4gY2IoKVxuICAgIH0pXG5cbiAgICB0aGlzLnByb3BzLndlYnNvY2tldC5vbignb3BlbicsICgpID0+IHtcbiAgICAgIHRoaXMucHJvcHMud2Vic29ja2V0LnJlcXVlc3QoeyBtZXRob2Q6ICdpc1VzZXJBdXRoZW50aWNhdGVkJywgcGFyYW1zOiBbXSB9LCAoZXJyb3IsIGF1dGhBbnN3ZXIpID0+IHtcbiAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgaWYgKGVycm9yLm1lc3NhZ2UgPT09ICdPcmdhbml6YXRpb24gZXJyb3InKSB7XG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgICAgaXNVc2VyQXV0aGVudGljYXRlZDogZmFsc2UsXG4gICAgICAgICAgICAgIHVzZXJuYW1lOiBudWxsLFxuICAgICAgICAgICAgICBwYXNzd29yZDogbnVsbCxcbiAgICAgICAgICAgICAgcmVhZHlGb3JBdXRoOiB0cnVlXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jcmVhdGVOb3RpY2Uoe1xuICAgICAgICAgICAgICB0eXBlOiAnZXJyb3InLFxuICAgICAgICAgICAgICB0aXRsZTogJ09oIG5vIScsXG4gICAgICAgICAgICAgIG1lc3NhZ2U6ICdXZSBoYWQgYSBwcm9ibGVtIGFjY2Vzc2luZyB5b3VyIGFjY291bnQuIPCfmKIgUGxlYXNlIHRyeSBjbG9zaW5nIGFuZCByZW9wZW5pbmcgdGhlIGFwcGxpY2F0aW9uLiBJZiB5b3Ugc3RpbGwgc2VlIHRoaXMgbWVzc2FnZSwgY29udGFjdCBIYWlrdSBmb3Igc3VwcG9ydC4nLFxuICAgICAgICAgICAgICBjbG9zZVRleHQ6ICdPa2F5JyxcbiAgICAgICAgICAgICAgbGlnaHRTY2hlbWU6IHRydWVcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbWl4cGFuZWwubWVyZ2VUb1BheWxvYWQoeyBkaXN0aW5jdF9pZDogYXV0aEFuc3dlciAmJiBhdXRoQW5zd2VyLnVzZXJuYW1lIH0pXG4gICAgICAgIG1peHBhbmVsLmhhaWt1VHJhY2soJ2NyZWF0b3I6b3BlbmVkJylcblxuICAgICAgICAvLyBEZWxheSBzbyB0aGUgZGVmYXVsdCBzdGFydHVwIHNjcmVlbiBkb2Vzbid0IGp1c3QgZmxhc2ggdGhlbiBnbyBhd2F5XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgcmVhZHlGb3JBdXRoOiB0cnVlLFxuICAgICAgICAgICAgYXV0aFRva2VuOiBhdXRoQW5zd2VyICYmIGF1dGhBbnN3ZXIuYXV0aFRva2VuLFxuICAgICAgICAgICAgb3JnYW5pemF0aW9uTmFtZTogYXV0aEFuc3dlciAmJiBhdXRoQW5zd2VyLm9yZ2FuaXphdGlvbk5hbWUsXG4gICAgICAgICAgICB1c2VybmFtZTogYXV0aEFuc3dlciAmJiBhdXRoQW5zd2VyLnVzZXJuYW1lLFxuICAgICAgICAgICAgaXNVc2VyQXV0aGVudGljYXRlZDogYXV0aEFuc3dlciAmJiBhdXRoQW5zd2VyLmlzQXV0aGVkXG4gICAgICAgICAgfSlcblxuICAgICAgICAgIGlmICh0aGlzLnByb3BzLmZvbGRlcikge1xuICAgICAgICAgICAgLy8gTGF1bmNoIGZvbGRlciBkaXJlY3RseSAtIGkuZS4gYWxsb3cgYSAnc3VibCcgbGlrZSBleHBlcmllbmNlIHdpdGhvdXQgaGF2aW5nIHRvIGdvXG4gICAgICAgICAgICAvLyB0aHJvdWdoIHRoZSBwcm9qZWN0cyBpbmRleFxuICAgICAgICAgICAgcmV0dXJuIHRoaXMubGF1bmNoRm9sZGVyKG51bGwsIHRoaXMucHJvcHMuZm9sZGVyLCAoZXJyb3IpID0+IHtcbiAgICAgICAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcilcbiAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgZm9sZGVyTG9hZGluZ0Vycm9yOiBlcnJvciB9KVxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNyZWF0ZU5vdGljZSh7XG4gICAgICAgICAgICAgICAgICB0eXBlOiAnZXJyb3InLFxuICAgICAgICAgICAgICAgICAgdGl0bGU6ICdPaCBubyEnLFxuICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ1dlIHdlcmUgdW5hYmxlIHRvIG9wZW4gdGhlIGZvbGRlci4g8J+YoiBQbGVhc2UgY2xvc2UgYW5kIHJlb3BlbiB0aGUgYXBwbGljYXRpb24gYW5kIHRyeSBhZ2Fpbi4gSWYgeW91IHN0aWxsIHNlZSB0aGlzIG1lc3NhZ2UsIGNvbnRhY3QgSGFpa3UgZm9yIHN1cHBvcnQuJyxcbiAgICAgICAgICAgICAgICAgIGNsb3NlVGV4dDogJ09rYXknLFxuICAgICAgICAgICAgICAgICAgbGlnaHRTY2hlbWU6IHRydWVcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH1cbiAgICAgICAgfSwgMTAwMClcbiAgICAgIH0pXG4gICAgfSlcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50ICgpIHtcbiAgICB0aGlzLnRvdXJDaGFubmVsLm9mZigndG91cjpyZXF1ZXN0RWxlbWVudENvb3JkaW5hdGVzJywgdGhpcy5oYW5kbGVGaW5kRWxlbWVudENvb3JkaW5hdGVzKVxuICAgIHRoaXMudG91ckNoYW5uZWwub2ZmKCd0b3VyOnJlcXVlc3RXZWJ2aWV3Q29vcmRpbmF0ZXMnLCB0aGlzLmhhbmRsZUZpbmRXZWJ2aWV3Q29vcmRpbmF0ZXMpXG4gICAgdGhpcy5hY3Rpdml0eU1vbml0b3Iuc3RvcFdhdGNoZXJzKClcbiAgfVxuXG4gIGhhbmRsZUZpbmRFbGVtZW50Q29vcmRpbmF0ZXMgKHsgc2VsZWN0b3IsIHdlYnZpZXcgfSkge1xuICAgIGlmICh3ZWJ2aWV3ICE9PSAnY3JlYXRvcicpIHsgcmV0dXJuIH1cblxuICAgIHRyeSB7XG4gICAgICAvLyBUT0RPOiBmaW5kIGlmIHRoZXJlIGlzIGEgYmV0dGVyIHNvbHV0aW9uIHRvIHRoaXMgc2NhcGUgaGF0Y2hcbiAgICAgIGxldCBlbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3RvcilcbiAgICAgIGxldCB7IHRvcCwgbGVmdCB9ID0gZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuXG4gICAgICB0aGlzLnRvdXJDaGFubmVsLnJlY2VpdmVFbGVtZW50Q29vcmRpbmF0ZXMoJ2NyZWF0b3InLCB7IHRvcCwgbGVmdCB9KVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmVycm9yKGBbY3JlYXRvcl0gZXJyb3IgZmV0Y2hpbmcgJHtzZWxlY3Rvcn0gaW4gd2VidmlldyAke3dlYnZpZXd9YClcbiAgICB9XG4gIH1cblxuICBoYW5kbGVGaW5kV2Vidmlld0Nvb3JkaW5hdGVzICgpIHtcbiAgICB0aGlzLnRvdXJDaGFubmVsLnJlY2VpdmVXZWJ2aWV3Q29vcmRpbmF0ZXMoJ2NyZWF0b3InLCB7IHRvcDogMCwgbGVmdDogMCB9KVxuICB9XG5cbiAgaGFuZGxlUGFuZVJlc2l6ZSAoKSB7XG4gICAgLy8gdGhpcy5sYXlvdXQuZW1pdCgncmVzaXplJylcbiAgfVxuXG4gIHJlbmRlck5vdGlmaWNhdGlvbnMgKGNvbnRlbnQsIGkpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPFRvYXN0XG4gICAgICAgIHRvYXN0VHlwZT17Y29udGVudC50eXBlfVxuICAgICAgICB0b2FzdFRpdGxlPXtjb250ZW50LnRpdGxlfVxuICAgICAgICB0b2FzdE1lc3NhZ2U9e2NvbnRlbnQubWVzc2FnZX1cbiAgICAgICAgY2xvc2VUZXh0PXtjb250ZW50LmNsb3NlVGV4dH1cbiAgICAgICAga2V5PXtpICsgY29udGVudC50aXRsZX1cbiAgICAgICAgbXlLZXk9e2l9XG4gICAgICAgIHJlbW92ZU5vdGljZT17dGhpcy5yZW1vdmVOb3RpY2V9XG4gICAgICAgIGxpZ2h0U2NoZW1lPXtjb250ZW50LmxpZ2h0U2NoZW1lfSAvPlxuICAgIClcbiAgfVxuXG4gIHNldERhc2hib2FyZFZpc2liaWxpdHkgKGRhc2hib2FyZFZpc2libGUpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtkYXNoYm9hcmRWaXNpYmxlfSlcbiAgfVxuXG4gIHN3aXRjaEFjdGl2ZU5hdiAoYWN0aXZlTmF2KSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7YWN0aXZlTmF2fSlcblxuICAgIGlmIChhY3RpdmVOYXYgPT09ICdzdGF0ZV9pbnNwZWN0b3InKSB7XG4gICAgICB0aGlzLnRvdXJDaGFubmVsLm5leHQoKVxuICAgIH1cbiAgfVxuXG4gIGF1dGhlbnRpY2F0ZVVzZXIgKHVzZXJuYW1lLCBwYXNzd29yZCwgY2IpIHtcbiAgICByZXR1cm4gdGhpcy5wcm9wcy53ZWJzb2NrZXQucmVxdWVzdCh7IG1ldGhvZDogJ2F1dGhlbnRpY2F0ZVVzZXInLCBwYXJhbXM6IFt1c2VybmFtZSwgcGFzc3dvcmRdIH0sIChlcnJvciwgYXV0aEFuc3dlcikgPT4ge1xuICAgICAgaWYgKGVycm9yKSByZXR1cm4gY2IoZXJyb3IpXG4gICAgICBtaXhwYW5lbC5tZXJnZVRvUGF5bG9hZCh7IGRpc3RpbmN0X2lkOiB1c2VybmFtZSB9KVxuICAgICAgbWl4cGFuZWwuaGFpa3VUcmFjaygnY3JlYXRvcjp1c2VyLWF1dGhlbnRpY2F0ZWQnLCB7IHVzZXJuYW1lIH0pXG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgdXNlcm5hbWUsXG4gICAgICAgIHBhc3N3b3JkLFxuICAgICAgICBhdXRoVG9rZW46IGF1dGhBbnN3ZXIgJiYgYXV0aEFuc3dlci5hdXRoVG9rZW4sXG4gICAgICAgIG9yZ2FuaXphdGlvbk5hbWU6IGF1dGhBbnN3ZXIgJiYgYXV0aEFuc3dlci5vcmdhbml6YXRpb25OYW1lLFxuICAgICAgICBpc1VzZXJBdXRoZW50aWNhdGVkOiBhdXRoQW5zd2VyICYmIGF1dGhBbnN3ZXIuaXNBdXRoZWRcbiAgICAgIH0pXG4gICAgICByZXR1cm4gY2IobnVsbCwgYXV0aEFuc3dlcilcbiAgICB9KVxuICB9XG5cbiAgYXV0aGVudGljYXRpb25Db21wbGV0ZSAoKSB7XG4gICAgcmV0dXJuIHRoaXMuc2V0U3RhdGUoeyBpc1VzZXJBdXRoZW50aWNhdGVkOiB0cnVlIH0pXG4gIH1cblxuICByZWNlaXZlUHJvamVjdEluZm8gKHByb2plY3RJbmZvKSB7XG4gICAgLy8gTk8tT1BcbiAgfVxuXG4gIGxvYWRQcm9qZWN0cyAoY2IpIHtcbiAgICByZXR1cm4gdGhpcy5wcm9wcy53ZWJzb2NrZXQucmVxdWVzdCh7IG1ldGhvZDogJ2xpc3RQcm9qZWN0cycsIHBhcmFtczogW10gfSwgKGVycm9yLCBwcm9qZWN0c0xpc3QpID0+IHtcbiAgICAgIGlmIChlcnJvcikgcmV0dXJuIGNiKGVycm9yKVxuICAgICAgdGhpcy5zZXRTdGF0ZSh7IHByb2plY3RzTGlzdCB9KVxuICAgICAgaXBjUmVuZGVyZXIuc2VuZCgncmVuZGVyZXI6cHJvamVjdHMtbGlzdC1mZXRjaGVkJywgcHJvamVjdHNMaXN0KVxuICAgICAgcmV0dXJuIGNiKG51bGwsIHByb2plY3RzTGlzdClcbiAgICB9KVxuICB9XG5cbiAgbGF1bmNoUHJvamVjdCAocHJvamVjdE5hbWUsIHByb2plY3RPYmplY3QsIGNiKSB7XG4gICAgcHJvamVjdE9iamVjdCA9IHtcbiAgICAgIHNraXBDb250ZW50Q3JlYXRpb246IHRydWUsIC8vIFZFUlkgSU1QT1JUQU5UIC0gaWYgbm90IHNldCB0byB0cnVlLCB3ZSBjYW4gZW5kIHVwIGluIGEgc2l0dWF0aW9uIHdoZXJlIHdlIG92ZXJ3cml0ZSBmcmVzaGx5IGNsb25lZCBjb250ZW50IGZyb20gdGhlIHJlbW90ZSFcbiAgICAgIHByb2plY3RzSG9tZTogcHJvamVjdE9iamVjdC5wcm9qZWN0c0hvbWUsXG4gICAgICBwcm9qZWN0UGF0aDogcHJvamVjdE9iamVjdC5wcm9qZWN0UGF0aCxcbiAgICAgIG9yZ2FuaXphdGlvbk5hbWU6IHRoaXMuc3RhdGUub3JnYW5pemF0aW9uTmFtZSxcbiAgICAgIGF1dGhvck5hbWU6IHRoaXMuc3RhdGUudXNlcm5hbWUsXG4gICAgICBwcm9qZWN0TmFtZSAvLyBIYXZlIHRvIHNldCB0aGlzIGhlcmUsIGJlY2F1c2Ugd2UgcGFzcyB0aGlzIHdob2xlIG9iamVjdCB0byBTdGF0ZVRpdGxlQmFyLCB3aGljaCBuZWVkcyB0aGlzIHRvIHByb3Blcmx5IGNhbGwgc2F2ZVByb2plY3RcbiAgICB9XG5cbiAgICAvLyBBZGQgZXh0cmEgY29udGV4dCB0byBTZW50cnkgcmVwb3J0cywgdGhpcyBpbmZvIGlzIGFsc28gdXNlZFxuICAgIC8vIGJ5IGNhcmJvbml0ZS5cbiAgICB3aW5kb3cuUmF2ZW4uc2V0RXh0cmFDb250ZXh0KHtcbiAgICAgIG9yZ2FuaXphdGlvbk5hbWU6IHRoaXMuc3RhdGUub3JnYW5pemF0aW9uTmFtZSxcbiAgICAgIHByb2plY3ROYW1lXG4gICAgfSlcblxuICAgIG1peHBhbmVsLmhhaWt1VHJhY2soJ2NyZWF0b3I6cHJvamVjdDpsYXVuY2hpbmcnLCB7XG4gICAgICB1c2VybmFtZTogdGhpcy5zdGF0ZS51c2VybmFtZSxcbiAgICAgIHByb2plY3Q6IHByb2plY3ROYW1lLFxuICAgICAgb3JnYW5pemF0aW9uOiB0aGlzLnN0YXRlLm9yZ2FuaXphdGlvbk5hbWVcbiAgICB9KVxuXG4gICAgcmV0dXJuIHRoaXMucHJvcHMud2Vic29ja2V0LnJlcXVlc3QoeyBtZXRob2Q6ICdpbml0aWFsaXplUHJvamVjdCcsIHBhcmFtczogW3Byb2plY3ROYW1lLCBwcm9qZWN0T2JqZWN0LCB0aGlzLnN0YXRlLnVzZXJuYW1lLCB0aGlzLnN0YXRlLnBhc3N3b3JkXSB9LCAoZXJyLCBwcm9qZWN0Rm9sZGVyKSA9PiB7XG4gICAgICBpZiAoZXJyKSByZXR1cm4gY2IoZXJyKVxuXG4gICAgICByZXR1cm4gdGhpcy5wcm9wcy53ZWJzb2NrZXQucmVxdWVzdCh7IG1ldGhvZDogJ3N0YXJ0UHJvamVjdCcsIHBhcmFtczogW3Byb2plY3ROYW1lLCBwcm9qZWN0Rm9sZGVyXSB9LCAoZXJyLCBhcHBsaWNhdGlvbkltYWdlKSA9PiB7XG4gICAgICAgIGlmIChlcnIpIHJldHVybiBjYihlcnIpXG5cbiAgICAgICAgLy8gQXNzaWduLCBub3QgbWVyZ2UsIHNpbmNlIHdlIGRvbid0IHdhbnQgdG8gY2xvYmJlciBhbnkgdmFyaWFibGVzIGFscmVhZHkgc2V0LCBsaWtlIHByb2plY3QgbmFtZVxuICAgICAgICBsb2Rhc2guYXNzaWduKHByb2plY3RPYmplY3QsIGFwcGxpY2F0aW9uSW1hZ2UucHJvamVjdClcblxuICAgICAgICBtaXhwYW5lbC5oYWlrdVRyYWNrKCdjcmVhdG9yOnByb2plY3Q6bGF1bmNoZWQnLCB7XG4gICAgICAgICAgdXNlcm5hbWU6IHRoaXMuc3RhdGUudXNlcm5hbWUsXG4gICAgICAgICAgcHJvamVjdDogcHJvamVjdE5hbWUsXG4gICAgICAgICAgb3JnYW5pemF0aW9uOiB0aGlzLnN0YXRlLm9yZ2FuaXphdGlvbk5hbWVcbiAgICAgICAgfSlcblxuICAgICAgICAvLyBOb3cgaGFja2lseSBjaGFuZ2Ugc29tZSBwb2ludGVycyBzbyB3ZSdyZSByZWZlcnJpbmcgdG8gdGhlIGNvcnJlY3QgcGxhY2VcbiAgICAgICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQuZm9sZGVyID0gcHJvamVjdEZvbGRlciAvLyBEbyBub3QgcmVtb3ZlIHRoaXMgbmVjZXNzYXJ5IGhhY2sgcGx6XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyBwcm9qZWN0Rm9sZGVyLCBhcHBsaWNhdGlvbkltYWdlLCBwcm9qZWN0T2JqZWN0LCBwcm9qZWN0TmFtZSwgZGFzaGJvYXJkVmlzaWJsZTogZmFsc2UgfSlcblxuICAgICAgICByZXR1cm4gY2IoKVxuICAgICAgfSlcbiAgICB9KVxuICB9XG5cbiAgbGF1bmNoRm9sZGVyIChtYXliZVByb2plY3ROYW1lLCBwcm9qZWN0Rm9sZGVyLCBjYikge1xuICAgIG1peHBhbmVsLmhhaWt1VHJhY2soJ2NyZWF0b3I6Zm9sZGVyOmxhdW5jaGluZycsIHtcbiAgICAgIHVzZXJuYW1lOiB0aGlzLnN0YXRlLnVzZXJuYW1lLFxuICAgICAgcHJvamVjdDogbWF5YmVQcm9qZWN0TmFtZVxuICAgIH0pXG5cbiAgICAvLyBUaGUgbGF1bmNoUHJvamVjdCBtZXRob2QgaGFuZGxlcyB0aGUgcGVyZm9ybUZvbGRlclBvaW50ZXJDaGFuZ2VcbiAgICByZXR1cm4gdGhpcy5sYXVuY2hQcm9qZWN0KG1heWJlUHJvamVjdE5hbWUsIHsgcHJvamVjdFBhdGg6IHByb2plY3RGb2xkZXIgfSwgY2IpXG4gIH1cblxuICByZW1vdmVOb3RpY2UgKGluZGV4LCBpZCkge1xuICAgIGNvbnN0IG5vdGljZXMgPSB0aGlzLnN0YXRlLm5vdGljZXNcbiAgICBpZiAoaW5kZXggIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIG5vdGljZXM6IFsuLi5ub3RpY2VzLnNsaWNlKDAsIGluZGV4KSwgLi4ubm90aWNlcy5zbGljZShpbmRleCArIDEpXVxuICAgICAgfSlcbiAgICB9IGVsc2UgaWYgKGlkICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIC8vIEhhY2thcm9vXG4gICAgICBsb2Rhc2guZWFjaChub3RpY2VzLCAobm90aWNlLCBpbmRleCkgPT4ge1xuICAgICAgICBpZiAobm90aWNlLmlkID09PSBpZCkgdGhpcy5yZW1vdmVOb3RpY2UoaW5kZXgpXG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIGNyZWF0ZU5vdGljZSAobm90aWNlKSB7XG4gICAgLyogRXhwZWN0cyB0aGUgb2JqZWN0OlxuICAgIHsgdHlwZTogc3RyaW5nIChpbmZvLCBzdWNjZXNzLCBkYW5nZXIgKG9yIGVycm9yKSwgd2FybmluZylcbiAgICAgIHRpdGxlOiBzdHJpbmcsXG4gICAgICBtZXNzYWdlOiBzdHJpbmcsXG4gICAgICBjbG9zZVRleHQ6IHN0cmluZyAob3B0aW9uYWwsIGRlZmF1bHRzIHRvICdjbG9zZScpXG4gICAgICBsaWdodFNjaGVtZTogYm9vbCAob3B0aW9uYWwsIGRlZmF1bHRzIHRvIGRhcmspXG4gICAgfSAqL1xuXG4gICAgbm90aWNlLmlkID0gTWF0aC5yYW5kb20oKSArICcnXG5cbiAgICBjb25zdCBub3RpY2VzID0gdGhpcy5zdGF0ZS5ub3RpY2VzXG4gICAgbGV0IHJlcGxhY2VkRXhpc3RpbmcgPSBmYWxzZVxuXG4gICAgbm90aWNlcy5mb3JFYWNoKChuLCBpKSA9PiB7XG4gICAgICBpZiAobi5tZXNzYWdlID09PSBub3RpY2UubWVzc2FnZSkge1xuICAgICAgICBub3RpY2VzLnNwbGljZShpLCAxKVxuICAgICAgICByZXBsYWNlZEV4aXN0aW5nID0gdHJ1ZVxuICAgICAgICB0aGlzLnNldFN0YXRlKHsgbm90aWNlcyB9LCAoKSA9PiB7XG4gICAgICAgICAgbm90aWNlcy51bnNoaWZ0KG5vdGljZSlcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgbm90aWNlcyB9KVxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH0pXG5cbiAgICBpZiAoIXJlcGxhY2VkRXhpc3RpbmcpIHtcbiAgICAgIG5vdGljZXMudW5zaGlmdChub3RpY2UpXG4gICAgICB0aGlzLnNldFN0YXRlKHsgbm90aWNlcyB9KVxuICAgIH1cblxuICAgIHJldHVybiBub3RpY2VcbiAgfVxuXG4gIG9uTGlicmFyeURyYWdFbmQgKGRyYWdFbmROYXRpdmVFdmVudCwgbGlicmFyeUl0ZW1JbmZvKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7IGxpYnJhcnlJdGVtRHJhZ2dpbmc6IG51bGwgfSlcbiAgICBpZiAobGlicmFyeUl0ZW1JbmZvICYmIGxpYnJhcnlJdGVtSW5mby5wcmV2aWV3KSB7XG4gICAgICB0aGlzLnJlZnMuc3RhZ2UuaGFuZGxlRHJvcChsaWJyYXJ5SXRlbUluZm8sIHRoaXMuX2xhc3RNb3VzZVgsIHRoaXMuX2xhc3RNb3VzZVkpXG4gICAgfVxuICB9XG5cbiAgb25MaWJyYXJ5RHJhZ1N0YXJ0IChkcmFnU3RhcnROYXRpdmVFdmVudCwgbGlicmFyeUl0ZW1JbmZvKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7IGxpYnJhcnlJdGVtRHJhZ2dpbmc6IGxpYnJhcnlJdGVtSW5mbyB9KVxuICB9XG5cbiAgb25BdXRvVXBkYXRlQ2hlY2tDb21wbGV0ZSAoKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICB1cGRhdGVyOiB7XG4gICAgICAgIC4uLnRoaXMuc3RhdGUudXBkYXRlcixcbiAgICAgICAgc2hvdWxkQ2hlY2s6IGZhbHNlXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIG9uQWN0aXZpdHlSZXBvcnQgKHVzZXJXYXNBY3RpdmUpIHtcbiAgICBpZiAodXNlcldhc0FjdGl2ZSkge1xuICAgICAgcmV0dXJuIHRoaXMucHJvcHMud2Vic29ja2V0LnJlcXVlc3QoXG4gICAgICAgIHttZXRob2Q6ICdjaGVja0lua3N0b25lVXBkYXRlcycsIHBhcmFtczogW3t9XX0sXG4gICAgICAgIChlcnIpID0+IHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnW2NyZWF0b3JdIHBpbmcgdG8gSW5rc3RvbmUgZm9yIHVwZGF0ZXMgZmluaXNoZWQnLCBlcnIpXG4gICAgICAgIH1cbiAgICAgIClcbiAgICB9XG5cbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHVwZGF0ZXI6IHtcbiAgICAgICAgc2hvdWxkQ2hlY2s6IHRydWUsXG4gICAgICAgIHNob3VsZFJ1bk9uQmFja2dyb3VuZDogdHJ1ZSxcbiAgICAgICAgc2hvdWxkU2tpcE9wdEluOiBmYWxzZVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICByZW5kZXJTdGFydHVwRGVmYXVsdFNjcmVlbiAoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgc3R5bGU9e3sgcG9zaXRpb246ICdhYnNvbHV0ZScsIHdpZHRoOiAnMTAwJScsIGhlaWdodDogJzEwMCUnIH19PlxuICAgICAgICA8UmVhY3RDU1NUcmFuc2l0aW9uR3JvdXBcbiAgICAgICAgICB0cmFuc2l0aW9uTmFtZT0ndG9hc3QnXG4gICAgICAgICAgdHJhbnNpdGlvbkVudGVyVGltZW91dD17NTAwfVxuICAgICAgICAgIHRyYW5zaXRpb25MZWF2ZVRpbWVvdXQ9ezMwMH0+XG4gICAgICAgICAgPGRpdiBzdHlsZT17e3Bvc2l0aW9uOiAnYWJzb2x1dGUnLCByaWdodDogMCwgdG9wOiAwLCB3aWR0aDogMzAwfX0+XG4gICAgICAgICAgICB7bG9kYXNoLm1hcCh0aGlzLnN0YXRlLm5vdGljZXMsIHRoaXMucmVuZGVyTm90aWZpY2F0aW9ucyl9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvUmVhY3RDU1NUcmFuc2l0aW9uR3JvdXA+XG4gICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ3RhYmxlJywgd2lkdGg6ICcxMDAlJywgaGVpZ2h0OiAnMTAwJScsIHBvc2l0aW9uOiAnYWJzb2x1dGUnLCB0b3A6IDAsIGxlZnQ6IDAgfX0+XG4gICAgICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAndGFibGUtY2VsbCcsIHdpZHRoOiAnMTAwJScsIGhlaWdodDogJzEwMCUnLCB2ZXJ0aWNhbEFsaWduOiAnbWlkZGxlJywgdGV4dEFsaWduOiAnY2VudGVyJyB9fT5cbiAgICAgICAgICAgIDxzdmcgd2lkdGg9JzE3MHB4JyBoZWlnaHQ9JzIyMXB4JyB2aWV3Qm94PScwIDAgMTcwIDIyMScgdmVyc2lvbj0nMS4xJz5cbiAgICAgICAgICAgICAgPGcgaWQ9J1BhZ2UtMScgc3Ryb2tlPSdub25lJyBzdHJva2VXaWR0aD0nMScgZmlsbD0nbm9uZScgZmlsbFJ1bGU9J2V2ZW5vZGQnPlxuICAgICAgICAgICAgICAgIDxnIGlkPSdPdXRsaW5lZCcgdHJhbnNmb3JtPSd0cmFuc2xhdGUoLTIxMS4wMDAwMDAsIC0xMTQuMDAwMDAwKScgZmlsbFJ1bGU9J25vbnplcm8nIGZpbGw9JyNGQUZDRkQnPlxuICAgICAgICAgICAgICAgICAgPGcgaWQ9J291dGxpbmVkLWxvZ28nIHRyYW5zZm9ybT0ndHJhbnNsYXRlKDIxMS4wMDAwMDAsIDExMy4wMDAwMDApJz5cbiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0nTTQ3LjUsMTUyLjc5ODgyMyBMMjYuMzgyMzQzMiwxNDMuOTU0Njc2IEMyNC41OTkzOTQxLDE0My4yMDc5NzEgMjMuNzU5MzUyNCwxNDEuMTU3MjgxIDI0LjUwNjA1NzYsMTM5LjM3NDMzMiBDMjUuMjUyNzYyOCwxMzcuNTkxMzgzIDI3LjMwMzQ1MjcsMTM2Ljc1MTM0MSAyOS4wODY0MDE4LDEzNy40OTgwNDYgTDExNy43ODAwNTgsMTc0LjY0NDU2IEwxMjAuOTkwMDIxLDE3Ni4wODkwNzQgQzEyMi40ODY4MTQsMTc2Ljc2MjY0NSAxMjMuMjc5MzA0LDE3OC4zNTgyNTEgMTIyLjk5ODY5OCwxNzkuOTAzNTk4IEMxMjIuOTk5NTY0LDE3OS45MzU2MjYgMTIzLDE3OS45Njc3NjIgMTIzLDE4MCBMMTIzLDIwNS42Mzk3MjIgTDEzOC41MTA3MTYsMjExLjkxMDAxMSBMMTQzLjM2ODQyMSwyMTMuODczNzY0IEwxNjIuODMzMzMzLDIwNi4wMDQ5NyBMMTYyLjgzMzMzMywxNi4yOTI5MDI1IEwxNDMsOC4yNzUxNzIwNCBMMTIyLjgzMzMzMywxNi40Mjc2NTQzIEwxMjIuODMzMzMzLDUzLjYwMTMyOTUgQzEyMi44MzQyMTgsNTMuNjQ2NjQ4OSAxMjIuODM0MjE1LDUzLjY5MTkwMTUgMTIyLjgzMzMzMyw1My43MzcwNjM0IEwxMjIuODMzMzMzLDU0IEMxMjIuODMzMzMzLDU1LjkzMjk5NjYgMTIxLjI2NjMzLDU3LjUgMTE5LjMzMzMzMyw1Ny41IEMxMTkuMjg4NDMsNTcuNSAxMTkuMjQzNzI0LDU3LjQ5OTE1NDQgMTE5LjE5OTIzLDU3LjQ5NzQ3ODIgTDUzLjMwNzYzOCw4NC4wMzcxNDkgQzUxLjUxNDYxODMsODQuNzU5MzM3NSA0OS40NzU2MzkyLDgzLjg5MTI1NzMgNDguNzUzNDUwNiw4Mi4wOTgyMzc2IEM0OC4wMzEyNjIxLDgwLjMwNTIxNzkgNDguODk5MzQyMyw3OC4yNjYyMzg4IDUwLjY5MjM2Miw3Ny41NDQwNTAyIEwxMTUuODMzMzMzLDUxLjMwNjcxMjkgTDExNS44MzMzMzMsMTQuNDk3NDIyNyBDMTE1LjgzMzMzMywxNC4wMTQzMTc4IDExNS45MzEyMTMsMTMuNTU0MDczOSAxMTYuMTA4MjIyLDEzLjEzNTQzOTkgQzExNi4zNzQ1MzksMTIuMDk0MTI5MiAxMTcuMTE1MzI2LDExLjE4ODg0NDkgMTE4LjE4ODIzOCwxMC43NTUxMTQ4IEwxNDEuNjg0MTg2LDEuMjU2NzUyNyBDMTQyLjA5MTMxNywxLjA5MTUyOTM2IDE0Mi41Mjk1OSwxLjAwMjQwNDY3IDE0Mi45NzU5MzcsMC45OTkxNjQ3MjMgQzE0My40NzA0MSwxLjAwMjQwNDY3IDE0My45MDg2ODMsMS4wOTE1MjkzNiAxNDQuMzE1ODE0LDEuMjU2NzUyNyBMMTY3LjgxMTc2MiwxMC43NTUxMTQ4IEMxNjkuNTIyOTY4LDExLjQ0Njg3OSAxNzAuMzg5MzI4LDEzLjMzODE2NTkgMTY5LjgzMzMzMywxNS4wNjc3MDY4IEwxNjkuODMzMzMzLDIwOCBDMTY5LjgzMzMzMywyMDguODI2MzA0IDE2OS41NDY5OSwyMDkuNTg1NzI4IDE2OS4wNjgxMTgsMjEwLjE4NDQ1OSBDMTY4LjY5MzcwMywyMTAuODY3Mzc4IDE2OC4wOTAxMzMsMjExLjQzMDIyNCAxNjcuMzExNzYyLDIxMS43NDQ4ODUgTDE0NC41MTc2NDUsMjIwLjk1OTUyOCBDMTQzLjMzMjU0MiwyMjEuNDM4NjEzIDE0Mi4wMzg5OTUsMjIxLjIyMjM5NyAxNDEuMDg5MTc5LDIyMC41MDI3MTIgTDEzNS44ODcxOTIsMjE4LjM5OTc4MiBMMTE5LjQ2MTU5NSwyMTEuNzU5NjQ3IEMxMTcuNTQ2MjksMjExLjczOTA1NSAxMTYsMjEwLjE4MDAzMiAxMTYsMjA4LjI1OTg1MyBMMTE2LDIwOC4wNzkxMSBDMTE1Ljk5ODc2NywyMDguMDI1NzA4IDExNS45OTg3NjEsMjA3Ljk3MjE3OCAxMTYsMjA3LjkxODU1OCBMMTE2LDE4MS41MTg3NDggTDExNC45OTE3MjcsMTgxLjA2NDU4OSBMNTQuNSwxNTUuNzMwNDQ3IEw1NC41LDIwNi45OTgyNzMgQzU1LjEzNDE0NjgsMjA4LjY1ODI1NiA1NC40MTk1MzE1LDIxMC41MTI5MTUgNTIuODc5NjY0NSwyMTEuMzMzMzMzIEM1Mi41NTQ1NTQ2LDIxMS41NDA3MDkgNTIuMTkyOTA0LDIxMS42OTU4NjkgNTEuODA2NTI5NCwyMTEuNzg2OTk3IEwyOS43ODY3Mzc1LDIyMC42NTA2NTUgQzI4LjgyNTI1MzUsMjIxLjQ3ODc1OCAyNy40NDU3MDA1LDIyMS43NTMyMjEgMjYuMTg4MjM3OSwyMjEuMjQ0ODg1IEwyMC4zODcxOTIxLDIxOC44OTk3ODIgTDMuMzA2Mjc3ODMsMjExLjk5NDczMSBDMS40NjMzODE4OSwyMTEuODk0MTkyIC0yLjYwODM1OTk1ZS0xNiwyMTAuMzY3OTkyIDAsMjA4LjUgTDIuNzA4OTQ0MThlLTE0LDE0LjQ5NzQyMjcgQzIuNzI0MjQ1ZS0xNCwxMy40MDE2NDU4IDAuNTAzNTYwOTQ3LDEyLjQyMzQ4MTggMS4yOTE4OTY2OSwxMS43ODE3MTcgQzEuNjUxNzEwMTQsMTEuMzQxNjUwOSAyLjEyNDA1NjIyLDEwLjk4MzE4ODIgMi42ODgyMzc4OSwxMC43NTUxMTQ4IEwyNi4xODQxODYyLDEuMjU2NzUyNyBDMjYuNTkxMzE3MiwxLjA5MTUyOTM2IDI3LjAyOTU4OTgsMS4wMDI0MDQ2NyAyNy40NzU5MzY3LDAuOTk5MTY0NzIzIEMyNy45NzA0MTAyLDEuMDAyNDA0NjcgMjguNDA4NjgyOCwxLjA5MTUyOTM2IDI4LjgxNTgxMzgsMS4yNTY3NTI3IEw1Mi4zMTE3NjIxLDEwLjc1NTExNDggQzU0LjEwMzg2MjcsMTEuNDc5NTgxIDU0Ljk2OTM1MTQsMTMuNTE5NjYxNSA1NC4yNDQ4ODUyLDE1LjMxMTc2MjEgQzUzLjUyMDQxOSwxNy4xMDM4NjI3IDUxLjQ4MDMzODUsMTcuOTY5MzUxNCA0OS42ODgyMzc5LDE3LjI0NDg4NTIgTDI3LjUsOC4yNzUxNzIwNCBMNywxNi41NjI0MDYxIEw3LDIwNS45Mzc1OTQgTDIzLjAxMDcxNjQsMjEyLjQxMDAxMSBMMjcuMjUyNjk5NSwyMTQuMTI0ODU1IEw0Ny41LDIwNS45NzQ2ODEgTDQ3LjUsMTUyLjc5ODgyMyBaJyBpZD0nQ29tYmluZWQtU2hhcGUnIC8+XG4gICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9J00xNDYuNDU2ODI3LDYzLjAyNDE4NDkgQzE0Ni45NDg2MDMsNjQuNzEwNDcyNCAxNDYuMTA1OTcyLDY2LjUzMzY1OTEgMTQ0LjQ0NzMwNSw2Ny4yMjgzMTQ5IEw1OS41NDY4Njc3LDEwMi43ODQ5MDggTDEyMC40MTY1NzUsMTI4LjI3NzM1IEMxMjIuMTk5NTI0LDEyOS4wMjQwNTUgMTIzLjAzOTU2NiwxMzEuMDc0NzQ1IDEyMi4yOTI4NjEsMTMyLjg1NzY5NCBDMTIxLjU0NjE1NiwxMzQuNjQwNjQzIDExOS40OTU0NjYsMTM1LjQ4MDY4NSAxMTcuNzEyNTE3LDEzNC43MzM5NzkgTDUwLjQ4NjQxMzEsMTA2LjU3OTQ1NyBMMjkuMzUyMDI5MywxMTUuNDMwNjEgQzI3LjU2OTA4MDIsMTE2LjE3NzMxNSAyNS41MTgzOTAzLDExNS4zMzcyNzMgMjQuNzcxNjg1MSwxMTMuNTU0MzI0IEMyNC4wMjQ5OCwxMTEuNzcxMzc1IDI0Ljg2NTAyMTYsMTA5LjcyMDY4NSAyNi42NDc5NzA3LDEwOC45NzM5OCBMNDcuNSwxMDAuMjQxMDc5IEw0Ny41LDE0LjUgQzQ3LjUsMTIuNTY3MDAzNCA0OS4wNjcwMDM0LDExIDUxLDExIEM1Mi45MzI5OTY2LDExIDU0LjUsMTIuNTY3MDAzNCA1NC41LDE0LjUgTDU0LjUsOTcuMzA5NDU0OCBMMTMzLjM2MDI1Nyw2NC4yODI1MDk4IEwxMTcuMTg4MjM4LDU3Ljc0NDg4NTIgQzExNS4zOTYxMzcsNTcuMDIwNDE5IDExNC41MzA2NDksNTQuOTgwMzM4NSAxMTUuMjU1MTE1LDUzLjE4ODIzNzkgQzExNS45Nzk1ODEsNTEuMzk2MTM3MyAxMTguMDE5NjYxLDUwLjUzMDY0ODYgMTE5LjgxMTc2Miw1MS4yNTUxMTQ4IEwxMzkuNSw1OS4yMTQxODk3IEwxMzkuNSwyNS44NjAyNzg0IEwxMzUuODg3MTkyLDI0LjM5OTc4MTYgTDExOC4xODgyMzgsMTcuMjQ0ODg1MiBDMTE2LjM5NjEzNywxNi41MjA0MTkgMTE1LjUzMDY0OSwxNC40ODAzMzg1IDExNi4yNTUxMTUsMTIuNjg4MjM3OSBDMTE2Ljk3OTU4MSwxMC44OTYxMzczIDExOS4wMTk2NjEsMTAuMDMwNjQ4NiAxMjAuODExNzYyLDEwLjc1NTExNDggTDEzOC41MTA3MTYsMTcuOTEwMDExMiBMMTQzLjM2ODQyMSwxOS44NzM3NjQxIEwxNjQuNjg4MjM4LDExLjI1NTExNDggQzE2Ni40ODAzMzksMTAuNTMwNjQ4NiAxNjguNTIwNDE5LDExLjM5NjEzNzMgMTY5LjI0NDg4NSwxMy4xODgyMzc5IEMxNjkuOTY5MzUxLDE0Ljk4MDMzODUgMTY5LjEwMzg2MywxNy4wMjA0MTkgMTY3LjMxMTc2MiwxNy43NDQ4ODUyIEwxNDYuNSwyNi4xNTgxNTA4IEwxNDYuNSw2Mi40NzI4NzQ5IEMxNDYuNSw2Mi42NjA0NTc0IDE0Ni40ODUyNDMsNjIuODQ0NTkzMyAxNDYuNDU2ODI3LDYzLjAyNDE4NDkgWicgaWQ9J0NvbWJpbmVkLVNoYXBlJyAvPlxuICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSdNMTM5LjUsOTYuMzMwODA2OSBMMTIyLjgzMzMzMywxMDMuMzEwODY0IEwxMjIuODMzMzMzLDE1MS4zNzI3OTkgQzEyMi44MzMzMzMsMTUzLjMwNTc5NSAxMjEuMjY2MzMsMTU0Ljg3Mjc5OSAxMTkuMzMzMzMzLDE1NC44NzI3OTkgQzExOC41MzU3MTksMTU0Ljg3Mjc5OSAxMTcuODAwNDIsMTU0LjYwNTk5NCAxMTcuMjExODE2LDE1NC4xNTY3NjMgTDI2LjY0Nzk3MDcsMTE2LjIyODMxNSBDMjYuMDk3NjcwNiwxMTUuOTk3ODQ3IDI1LjYzNzE5NCwxMTUuNjQzMTU5IDI1LjI4NTQ3MTQsMTE1LjIxMDQ2MiBDMjQuNTAwODI1OCwxMTQuNTY4NjIgMjQsMTEzLjU5Mjc5NyAyNCwxMTIuNSBMMjQsMjUuODYwMjc4NCBMMjAuMzg3MTkyMSwyNC4zOTk3ODE2IEwyLjY4ODIzNzg5LDE3LjI0NDg4NTIgQzAuODk2MTM3MjU4LDE2LjUyMDQxOSAwLjAzMDY0ODU1ODksMTQuNDgwMzM4NSAwLjc1NTExNDc3LDEyLjY4ODIzNzkgQzEuNDc5NTgwOTgsMTAuODk2MTM3MyAzLjUxOTY2MTQ5LDEwLjAzMDY0ODYgNS4zMTE3NjIxMSwxMC43NTUxMTQ4IEwyMy4wMTA3MTY0LDE3LjkxMDAxMTIgTDI3Ljg2ODQyMTEsMTkuODczNzY0MSBMNDkuMTg4MjM3OSwxMS4yNTUxMTQ4IEM1MC45ODAzMzg1LDEwLjUzMDY0ODYgNTMuMDIwNDE5LDExLjM5NjEzNzMgNTMuNzQ0ODg1MiwxMy4xODgyMzc5IEM1NC40NjkzNTE0LDE0Ljk4MDMzODUgNTMuNjAzODYyNywxNy4wMjA0MTkgNTEuODExNzYyMSwxNy43NDQ4ODUyIEwzMSwyNi4xNTgxNTA4IEwzMSwxMTAuNDYxODYxIEwxMTUuODMzMzMzLDE0NS45OTAzNTEgTDExNS44MzMzMzMsMTA2LjI0MjQ4OCBMODQuMjU5NjYxNiwxMTkuNDY1NjQ5IEM4Mi40NzY3MTI1LDEyMC4yMTIzNTUgODAuNDI2MDIyNiwxMTkuMzcyMzEzIDc5LjY3OTMxNzQsMTE3LjU4OTM2NCBDNzguOTMyNjEyMywxMTUuODA2NDE1IDc5Ljc3MjY1MzksMTEzLjc1NTcyNSA4MS41NTU2MDMsMTEzLjAwOTAyIEwxNDEuMDUyMTUxLDg4LjA5MTY2MjIgQzE0MS42MDg5NzQsODcuNzE3OTkzIDE0Mi4yNzkwMyw4Ny41IDE0Myw4Ny41IEMxNDQuOTMyOTk3LDg3LjUgMTQ2LjUsODkuMDY3MDAzNCAxNDYuNSw5MSBMMTQ2LjUsMjE3LjYzMDQ4IEMxNDYuNSwyMTkuNTYzNDc3IDE0NC45MzI5OTcsMjIxLjEzMDQ4IDE0MywyMjEuMTMwNDggQzE0MS4wNjcwMDMsMjIxLjEzMDQ4IDEzOS41LDIxOS41NjM0NzcgMTM5LjUsMjE3LjYzMDQ4IEwxMzkuNSw5Ni4zMzA4MDY5IFogTTMxLDE0MSBMMzEsMjE3LjA1NTIzNyBDMzEsMjE4Ljk4ODIzNCAyOS40MzI5OTY2LDIyMC41NTUyMzcgMjcuNSwyMjAuNTU1MjM3IEMyNS41NjcwMDM0LDIyMC41NTUyMzcgMjQsMjE4Ljk4ODIzNCAyNCwyMTcuMDU1MjM3IEwyNCwxNDEgQzI0LDEzOS4wNjcwMDMgMjUuNTY3MDAzNCwxMzcuNSAyNy41LDEzNy41IEMyOS40MzI5OTY2LDEzNy41IDMxLDEzOS4wNjcwMDMgMzEsMTQxIFonIGlkPSdDb21iaW5lZC1TaGFwZScgLz5cbiAgICAgICAgICAgICAgICAgIDwvZz5cbiAgICAgICAgICAgICAgICA8L2c+XG4gICAgICAgICAgICAgIDwvZz5cbiAgICAgICAgICAgIDwvc3ZnPlxuICAgICAgICAgICAgPGJyIC8+XG4gICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBjb2xvcjogJyNGQUZDRkQnLCBkaXNwbGF5OiAnaW5saW5lLWJsb2NrJywgd2lkdGg6ICcxMDAlJywgaGVpZ2h0OiA1MCwgcG9zaXRpb246ICdhYnNvbHV0ZScsIGJvdHRvbTogNTAsIGxlZnQ6IDAgfX0+e3RoaXMuc3RhdGUuc29mdHdhcmVWZXJzaW9ufTwvc3Bhbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICByZW5kZXIgKCkge1xuICAgIGlmICh0aGlzLnN0YXRlLnJlYWR5Rm9yQXV0aCAmJiAoIXRoaXMuc3RhdGUuaXNVc2VyQXV0aGVudGljYXRlZCB8fCAhdGhpcy5zdGF0ZS51c2VybmFtZSkpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxTdHlsZVJvb3Q+XG4gICAgICAgICAgPEF1dGhlbnRpY2F0aW9uVUlcbiAgICAgICAgICAgIG9uU3VibWl0PXt0aGlzLmF1dGhlbnRpY2F0ZVVzZXJ9XG4gICAgICAgICAgICBvblN1Ym1pdFN1Y2Nlc3M9e3RoaXMuYXV0aGVudGljYXRpb25Db21wbGV0ZX1cbiAgICAgICAgICAgIHsuLi50aGlzLnByb3BzfSAvPlxuICAgICAgICA8L1N0eWxlUm9vdD5cbiAgICAgIClcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuc3RhdGUuaXNVc2VyQXV0aGVudGljYXRlZCB8fCAhdGhpcy5zdGF0ZS51c2VybmFtZSkge1xuICAgICAgcmV0dXJuIHRoaXMucmVuZGVyU3RhcnR1cERlZmF1bHRTY3JlZW4oKVxuICAgIH1cblxuICAgIGlmICh0aGlzLnN0YXRlLmRhc2hib2FyZFZpc2libGUpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgPFByb2plY3RCcm93c2VyXG4gICAgICAgICAgICBsb2FkUHJvamVjdHM9e3RoaXMubG9hZFByb2plY3RzfVxuICAgICAgICAgICAgbGF1bmNoUHJvamVjdD17dGhpcy5sYXVuY2hQcm9qZWN0fVxuICAgICAgICAgICAgY3JlYXRlTm90aWNlPXt0aGlzLmNyZWF0ZU5vdGljZX1cbiAgICAgICAgICAgIHJlbW92ZU5vdGljZT17dGhpcy5yZW1vdmVOb3RpY2V9XG4gICAgICAgICAgICBub3RpY2VzPXt0aGlzLnN0YXRlLm5vdGljZXN9XG4gICAgICAgICAgICBlbnZveT17dGhpcy5lbnZveX1cbiAgICAgICAgICAgIHsuLi50aGlzLnByb3BzfSAvPlxuICAgICAgICAgIDxUb3VyIHByb2plY3RzTGlzdD17dGhpcy5zdGF0ZS5wcm9qZWN0c0xpc3R9IGVudm95PXt0aGlzLmVudm95fSBzdGFydFRvdXJPbk1vdW50IC8+XG4gICAgICAgICAgPEF1dG9VcGRhdGVyXG4gICAgICAgICAgICBvbkNvbXBsZXRlPXt0aGlzLm9uQXV0b1VwZGF0ZUNoZWNrQ29tcGxldGV9XG4gICAgICAgICAgICBjaGVjaz17dGhpcy5zdGF0ZS51cGRhdGVyLnNob3VsZENoZWNrfVxuICAgICAgICAgICAgc2tpcE9wdEluPXt0aGlzLnN0YXRlLnVwZGF0ZXIuc2hvdWxkU2tpcE9wdElufVxuICAgICAgICAgICAgcnVuT25CYWNrZ3JvdW5kPXt0aGlzLnN0YXRlLnVwZGF0ZXIuc2hvdWxkUnVuT25CYWNrZ3JvdW5kfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKVxuICAgIH1cblxuICAgIGlmICghdGhpcy5zdGF0ZS5wcm9qZWN0Rm9sZGVyKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIDxUb3VyIHByb2plY3RzTGlzdD17dGhpcy5zdGF0ZS5wcm9qZWN0c0xpc3R9IGVudm95PXt0aGlzLmVudm95fSAvPlxuICAgICAgICAgIDxBdXRvVXBkYXRlclxuICAgICAgICAgICAgb25Db21wbGV0ZT17dGhpcy5vbkF1dG9VcGRhdGVDaGVja0NvbXBsZXRlfVxuICAgICAgICAgICAgY2hlY2s9e3RoaXMuc3RhdGUudXBkYXRlci5zaG91bGRDaGVja31cbiAgICAgICAgICAgIHNraXBPcHRJbj17dGhpcy5zdGF0ZS51cGRhdGVyLnNob3VsZFNraXBPcHRJbn1cbiAgICAgICAgICAgIHJ1bk9uQmFja2dyb3VuZD17dGhpcy5zdGF0ZS51cGRhdGVyLnNob3VsZFJ1bk9uQmFja2dyb3VuZH1cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxQcm9qZWN0QnJvd3NlclxuICAgICAgICAgICAgbG9hZFByb2plY3RzPXt0aGlzLmxvYWRQcm9qZWN0c31cbiAgICAgICAgICAgIGxhdW5jaFByb2plY3Q9e3RoaXMubGF1bmNoUHJvamVjdH1cbiAgICAgICAgICAgIGNyZWF0ZU5vdGljZT17dGhpcy5jcmVhdGVOb3RpY2V9XG4gICAgICAgICAgICByZW1vdmVOb3RpY2U9e3RoaXMucmVtb3ZlTm90aWNlfVxuICAgICAgICAgICAgbm90aWNlcz17dGhpcy5zdGF0ZS5ub3RpY2VzfVxuICAgICAgICAgICAgZW52b3k9e3RoaXMuZW52b3l9XG4gICAgICAgICAgICB7Li4udGhpcy5wcm9wc30gLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICApXG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLnN0YXRlLmFwcGxpY2F0aW9uSW1hZ2UgfHwgdGhpcy5zdGF0ZS5mb2xkZXJMb2FkaW5nRXJyb3IpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgc3R5bGU9e3sgcG9zaXRpb246ICdhYnNvbHV0ZScsIHdpZHRoOiAnMTAwJScsIGhlaWdodDogJzEwMCUnIH19PlxuICAgICAgICAgIDxSZWFjdENTU1RyYW5zaXRpb25Hcm91cFxuICAgICAgICAgICAgdHJhbnNpdGlvbk5hbWU9J3RvYXN0J1xuICAgICAgICAgICAgdHJhbnNpdGlvbkVudGVyVGltZW91dD17NTAwfVxuICAgICAgICAgICAgdHJhbnNpdGlvbkxlYXZlVGltZW91dD17MzAwfT5cbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3twb3NpdGlvbjogJ2Fic29sdXRlJywgcmlnaHQ6IDAsIHRvcDogMCwgd2lkdGg6IDMwMH19PlxuICAgICAgICAgICAgICB7bG9kYXNoLm1hcCh0aGlzLnN0YXRlLm5vdGljZXMsIHRoaXMucmVuZGVyTm90aWZpY2F0aW9ucyl9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L1JlYWN0Q1NTVHJhbnNpdGlvbkdyb3VwPlxuICAgICAgICAgIDxkaXYgc3R5bGU9e3sgcG9zaXRpb246ICdyZWxhdGl2ZScsIHdpZHRoOiAnMTAwJScsIGhlaWdodDogJzEwMCUnIH19PlxuICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBwb3NpdGlvbjogJ2Fic29sdXRlJywgdG9wOiAnNTAlJywgbGVmdDogJzUwJScsIHRyYW5zZm9ybTogJ3RyYW5zbGF0ZSgtNTAlLCAtNTAlKScgfX0+XG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGZvbnRTaXplOiAyNCwgY29sb3I6ICcjMjIyJyB9fT5Mb2FkaW5nIHByb2plY3QuLi48L3NwYW4+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICApXG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgc3R5bGU9e3sgcG9zaXRpb246ICdyZWxhdGl2ZScsIHdpZHRoOiAnMTAwJScsIGhlaWdodDogJzEwMCUnIH19PlxuICAgICAgICA8QXV0b1VwZGF0ZXJcbiAgICAgICAgICBvbkNvbXBsZXRlPXt0aGlzLm9uQXV0b1VwZGF0ZUNoZWNrQ29tcGxldGV9XG4gICAgICAgICAgY2hlY2s9e3RoaXMuc3RhdGUudXBkYXRlci5zaG91bGRDaGVja31cbiAgICAgICAgICBza2lwT3B0SW49e3RoaXMuc3RhdGUudXBkYXRlci5zaG91bGRTa2lwT3B0SW59XG4gICAgICAgICAgcnVuT25CYWNrZ3JvdW5kPXt0aGlzLnN0YXRlLnVwZGF0ZXIuc2hvdWxkUnVuT25CYWNrZ3JvdW5kfVxuICAgICAgICAvPlxuICAgICAgICA8VG91ciBwcm9qZWN0c0xpc3Q9e3RoaXMuc3RhdGUucHJvamVjdHNMaXN0fSBlbnZveT17dGhpcy5lbnZveX0gLz5cbiAgICAgICAgPGRpdiBzdHlsZT17eyBwb3NpdGlvbjogJ2Fic29sdXRlJywgd2lkdGg6ICcxMDAlJywgaGVpZ2h0OiAnMTAwJScsIHRvcDogMCwgbGVmdDogMCB9fT5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nbGF5b3V0LWJveCcgc3R5bGU9e3tvdmVyZmxvdzogJ3Zpc2libGUnfX0+XG4gICAgICAgICAgICA8UmVhY3RDU1NUcmFuc2l0aW9uR3JvdXBcbiAgICAgICAgICAgICAgdHJhbnNpdGlvbk5hbWU9J3RvYXN0J1xuICAgICAgICAgICAgICB0cmFuc2l0aW9uRW50ZXJUaW1lb3V0PXs1MDB9XG4gICAgICAgICAgICAgIHRyYW5zaXRpb25MZWF2ZVRpbWVvdXQ9ezMwMH0+XG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3twb3NpdGlvbjogJ2Fic29sdXRlJywgcmlnaHQ6IDAsIHRvcDogMCwgd2lkdGg6IDMwMH19PlxuICAgICAgICAgICAgICAgIHtsb2Rhc2gubWFwKHRoaXMuc3RhdGUubm90aWNlcywgdGhpcy5yZW5kZXJOb3RpZmljYXRpb25zKX1cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L1JlYWN0Q1NTVHJhbnNpdGlvbkdyb3VwPlxuICAgICAgICAgICAgPFNwbGl0UGFuZSBvbkRyYWdGaW5pc2hlZD17dGhpcy5oYW5kbGVQYW5lUmVzaXplLmJpbmQodGhpcyl9IHNwbGl0PSdob3Jpem9udGFsJyBtaW5TaXplPXszMDB9IGRlZmF1bHRTaXplPXt0aGlzLnByb3BzLmhlaWdodCAqIDAuNjJ9PlxuICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgIDxTcGxpdFBhbmUgb25EcmFnRmluaXNoZWQ9e3RoaXMuaGFuZGxlUGFuZVJlc2l6ZS5iaW5kKHRoaXMpfSBzcGxpdD0ndmVydGljYWwnIG1pblNpemU9ezMwMH0gZGVmYXVsdFNpemU9ezMwMH0+XG4gICAgICAgICAgICAgICAgICA8U2lkZUJhclxuICAgICAgICAgICAgICAgICAgICBzZXREYXNoYm9hcmRWaXNpYmlsaXR5PXt0aGlzLnNldERhc2hib2FyZFZpc2liaWxpdHkuYmluZCh0aGlzKX1cbiAgICAgICAgICAgICAgICAgICAgc3dpdGNoQWN0aXZlTmF2PXt0aGlzLnN3aXRjaEFjdGl2ZU5hdi5iaW5kKHRoaXMpfVxuICAgICAgICAgICAgICAgICAgICBhY3RpdmVOYXY9e3RoaXMuc3RhdGUuYWN0aXZlTmF2fT5cbiAgICAgICAgICAgICAgICAgICAge3RoaXMuc3RhdGUuYWN0aXZlTmF2ID09PSAnbGlicmFyeSdcbiAgICAgICAgICAgICAgICAgICAgICA/IDxMaWJyYXJ5XG4gICAgICAgICAgICAgICAgICAgICAgICBsYXlvdXQ9e3RoaXMubGF5b3V0fVxuICAgICAgICAgICAgICAgICAgICAgICAgZm9sZGVyPXt0aGlzLnN0YXRlLnByb2plY3RGb2xkZXJ9XG4gICAgICAgICAgICAgICAgICAgICAgICBoYWlrdT17dGhpcy5wcm9wcy5oYWlrdX1cbiAgICAgICAgICAgICAgICAgICAgICAgIHdlYnNvY2tldD17dGhpcy5wcm9wcy53ZWJzb2NrZXR9XG4gICAgICAgICAgICAgICAgICAgICAgICB0b3VyQ2hhbm5lbD17dGhpcy50b3VyQ2hhbm5lbH1cbiAgICAgICAgICAgICAgICAgICAgICAgIG9uRHJhZ0VuZD17dGhpcy5vbkxpYnJhcnlEcmFnRW5kLmJpbmQodGhpcyl9XG4gICAgICAgICAgICAgICAgICAgICAgICBvbkRyYWdTdGFydD17dGhpcy5vbkxpYnJhcnlEcmFnU3RhcnQuYmluZCh0aGlzKX1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNyZWF0ZU5vdGljZT17dGhpcy5jcmVhdGVOb3RpY2V9XG4gICAgICAgICAgICAgICAgICAgICAgICByZW1vdmVOb3RpY2U9e3RoaXMucmVtb3ZlTm90aWNlfSAvPlxuICAgICAgICAgICAgICAgICAgICAgIDogPFN0YXRlSW5zcGVjdG9yXG4gICAgICAgICAgICAgICAgICAgICAgICBjcmVhdGVOb3RpY2U9e3RoaXMuY3JlYXRlTm90aWNlfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmVtb3ZlTm90aWNlPXt0aGlzLnJlbW92ZU5vdGljZX1cbiAgICAgICAgICAgICAgICAgICAgICAgIGZvbGRlcj17dGhpcy5zdGF0ZS5wcm9qZWN0Rm9sZGVyfVxuICAgICAgICAgICAgICAgICAgICAgICAgd2Vic29ja2V0PXt0aGlzLnByb3BzLndlYnNvY2tldH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHRvdXJDaGFubmVsPXt0aGlzLnRvdXJDaGFubmVsfSAvPlxuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIDwvU2lkZUJhcj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3twb3NpdGlvbjogJ3JlbGF0aXZlJywgd2lkdGg6ICcxMDAlJywgaGVpZ2h0OiAnMTAwJSd9fT5cbiAgICAgICAgICAgICAgICAgICAgPFN0YWdlXG4gICAgICAgICAgICAgICAgICAgICAgcmVmPSdzdGFnZSdcbiAgICAgICAgICAgICAgICAgICAgICBmb2xkZXI9e3RoaXMuc3RhdGUucHJvamVjdEZvbGRlcn1cbiAgICAgICAgICAgICAgICAgICAgICBlbnZveT17dGhpcy5lbnZveX1cbiAgICAgICAgICAgICAgICAgICAgICBoYWlrdT17dGhpcy5wcm9wcy5oYWlrdX1cbiAgICAgICAgICAgICAgICAgICAgICB3ZWJzb2NrZXQ9e3RoaXMucHJvcHMud2Vic29ja2V0fVxuICAgICAgICAgICAgICAgICAgICAgIHByb2plY3Q9e3RoaXMuc3RhdGUucHJvamVjdE9iamVjdH1cbiAgICAgICAgICAgICAgICAgICAgICBjcmVhdGVOb3RpY2U9e3RoaXMuY3JlYXRlTm90aWNlfVxuICAgICAgICAgICAgICAgICAgICAgIHJlbW92ZU5vdGljZT17dGhpcy5yZW1vdmVOb3RpY2V9XG4gICAgICAgICAgICAgICAgICAgICAgcmVjZWl2ZVByb2plY3RJbmZvPXt0aGlzLnJlY2VpdmVQcm9qZWN0SW5mb31cbiAgICAgICAgICAgICAgICAgICAgICBvcmdhbml6YXRpb25OYW1lPXt0aGlzLnN0YXRlLm9yZ2FuaXphdGlvbk5hbWV9XG4gICAgICAgICAgICAgICAgICAgICAgYXV0aFRva2VuPXt0aGlzLnN0YXRlLmF1dGhUb2tlbn1cbiAgICAgICAgICAgICAgICAgICAgICB1c2VybmFtZT17dGhpcy5zdGF0ZS51c2VybmFtZX1cbiAgICAgICAgICAgICAgICAgICAgICBwYXNzd29yZD17dGhpcy5zdGF0ZS5wYXNzd29yZH0gLz5cbiAgICAgICAgICAgICAgICAgICAgeyh0aGlzLnN0YXRlLmxpYnJhcnlJdGVtRHJhZ2dpbmcpXG4gICAgICAgICAgICAgICAgICAgICAgPyA8ZGl2IHN0eWxlPXt7IHdpZHRoOiAnMTAwJScsIGhlaWdodDogJzEwMCUnLCBiYWNrZ3JvdW5kQ29sb3I6ICd3aGl0ZScsIG9wYWNpdHk6IDAuMDEsIHBvc2l0aW9uOiAnYWJzb2x1dGUnLCB0b3A6IDAsIGxlZnQ6IDAgfX0gLz5cbiAgICAgICAgICAgICAgICAgICAgICA6ICcnIH1cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvU3BsaXRQYW5lPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPFRpbWVsaW5lXG4gICAgICAgICAgICAgICAgcmVmPSd0aW1lbGluZSdcbiAgICAgICAgICAgICAgICBmb2xkZXI9e3RoaXMuc3RhdGUucHJvamVjdEZvbGRlcn1cbiAgICAgICAgICAgICAgICBlbnZveT17dGhpcy5lbnZveX1cbiAgICAgICAgICAgICAgICBoYWlrdT17dGhpcy5wcm9wcy5oYWlrdX1cbiAgICAgICAgICAgICAgICBjcmVhdGVOb3RpY2U9e3RoaXMuY3JlYXRlTm90aWNlfVxuICAgICAgICAgICAgICAgIHJlbW92ZU5vdGljZT17dGhpcy5yZW1vdmVOb3RpY2V9IC8+XG4gICAgICAgICAgICA8L1NwbGl0UGFuZT5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cbn1cbiJdfQ==