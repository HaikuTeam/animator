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

    _this.state = {
      error: null,
      projectFolder: _this.props.folder,
      applicationImage: null,
      projectObject: null,
      projectName: null,
      dashboardVisible: !_this.props.folder,
      readyForAuth: false,
      isUserAuthenticated: false,
      hasCheckedForUpdates: false,
      username: null,
      password: null,
      notices: [],
      softwareVersion: pkg.version,
      didPlumbingNoticeCrash: false,
      activeNav: 'library',
      projectsList: []
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
      _this.setState({ hasCheckedForUpdates: false });
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
          this.createNotice({
            type: 'warning',
            title: 'Hmmm',
            message: 'We don\'t know how to paste that content yet. 😳',
            closeText: 'Okay',
            lightScheme: true
          });
        }
      } else {
        // An empty string is treated as the equivalent of nothing (don't display warning if nothing to instantiate)
        if (typeof pastedData === 'string' && pastedData.length > 0) {
          // TODO: Handle the case when plain text has been pasted - SVG, HTML, etc?
          console.warn('[creator] cannot paste this content type yet (unknown string)');
          this.createNotice({
            type: 'warning',
            title: 'Hmmm',
            message: 'We don\'t know how to paste that content yet. 😳',
            closeText: 'Okay',
            lightScheme: true
          });
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
          lineNumber: 398
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
      this.setState({ hasCheckedForUpdates: true });
    }
  }, {
    key: 'renderStartupDefaultScreen',
    value: function renderStartupDefaultScreen() {
      return _react2.default.createElement(
        'div',
        { style: { position: 'absolute', width: '100%', height: '100%' }, __source: {
            fileName: _jsxFileName,
            lineNumber: 569
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
              lineNumber: 570
            },
            __self: this
          },
          _react2.default.createElement(
            'div',
            { style: { position: 'absolute', right: 0, top: 0, width: 300 }, __source: {
                fileName: _jsxFileName,
                lineNumber: 574
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
              lineNumber: 578
            },
            __self: this
          },
          _react2.default.createElement(
            'div',
            { style: { display: 'table-cell', width: '100%', height: '100%', verticalAlign: 'middle', textAlign: 'center' }, __source: {
                fileName: _jsxFileName,
                lineNumber: 579
              },
              __self: this
            },
            _react2.default.createElement(
              'svg',
              { width: '170px', height: '221px', viewBox: '0 0 170 221', version: '1.1', __source: {
                  fileName: _jsxFileName,
                  lineNumber: 580
                },
                __self: this
              },
              _react2.default.createElement(
                'g',
                { id: 'Page-1', stroke: 'none', strokeWidth: '1', fill: 'none', fillRule: 'evenodd', __source: {
                    fileName: _jsxFileName,
                    lineNumber: 581
                  },
                  __self: this
                },
                _react2.default.createElement(
                  'g',
                  { id: 'Outlined', transform: 'translate(-211.000000, -114.000000)', fillRule: 'nonzero', fill: '#FAFCFD', __source: {
                      fileName: _jsxFileName,
                      lineNumber: 582
                    },
                    __self: this
                  },
                  _react2.default.createElement(
                    'g',
                    { id: 'outlined-logo', transform: 'translate(211.000000, 113.000000)', __source: {
                        fileName: _jsxFileName,
                        lineNumber: 583
                      },
                      __self: this
                    },
                    _react2.default.createElement('path', { d: 'M47.5,152.798823 L26.3823432,143.954676 C24.5993941,143.207971 23.7593524,141.157281 24.5060576,139.374332 C25.2527628,137.591383 27.3034527,136.751341 29.0864018,137.498046 L117.780058,174.64456 L120.990021,176.089074 C122.486814,176.762645 123.279304,178.358251 122.998698,179.903598 C122.999564,179.935626 123,179.967762 123,180 L123,205.639722 L138.510716,211.910011 L143.368421,213.873764 L162.833333,206.00497 L162.833333,16.2929025 L143,8.27517204 L122.833333,16.4276543 L122.833333,53.6013295 C122.834218,53.6466489 122.834215,53.6919015 122.833333,53.7370634 L122.833333,54 C122.833333,55.9329966 121.26633,57.5 119.333333,57.5 C119.28843,57.5 119.243724,57.4991544 119.19923,57.4974782 L53.307638,84.037149 C51.5146183,84.7593375 49.4756392,83.8912573 48.7534506,82.0982376 C48.0312621,80.3052179 48.8993423,78.2662388 50.692362,77.5440502 L115.833333,51.3067129 L115.833333,14.4974227 C115.833333,14.0143178 115.931213,13.5540739 116.108222,13.1354399 C116.374539,12.0941292 117.115326,11.1888449 118.188238,10.7551148 L141.684186,1.2567527 C142.091317,1.09152936 142.52959,1.00240467 142.975937,0.999164723 C143.47041,1.00240467 143.908683,1.09152936 144.315814,1.2567527 L167.811762,10.7551148 C169.522968,11.446879 170.389328,13.3381659 169.833333,15.0677068 L169.833333,208 C169.833333,208.826304 169.54699,209.585728 169.068118,210.184459 C168.693703,210.867378 168.090133,211.430224 167.311762,211.744885 L144.517645,220.959528 C143.332542,221.438613 142.038995,221.222397 141.089179,220.502712 L135.887192,218.399782 L119.461595,211.759647 C117.54629,211.739055 116,210.180032 116,208.259853 L116,208.07911 C115.998767,208.025708 115.998761,207.972178 116,207.918558 L116,181.518748 L114.991727,181.064589 L54.5,155.730447 L54.5,206.998273 C55.1341468,208.658256 54.4195315,210.512915 52.8796645,211.333333 C52.5545546,211.540709 52.192904,211.695869 51.8065294,211.786997 L29.7867375,220.650655 C28.8252535,221.478758 27.4457005,221.753221 26.1882379,221.244885 L20.3871921,218.899782 L3.30627783,211.994731 C1.46338189,211.894192 -2.60835995e-16,210.367992 0,208.5 L2.70894418e-14,14.4974227 C2.724245e-14,13.4016458 0.503560947,12.4234818 1.29189669,11.781717 C1.65171014,11.3416509 2.12405622,10.9831882 2.68823789,10.7551148 L26.1841862,1.2567527 C26.5913172,1.09152936 27.0295898,1.00240467 27.4759367,0.999164723 C27.9704102,1.00240467 28.4086828,1.09152936 28.8158138,1.2567527 L52.3117621,10.7551148 C54.1038627,11.479581 54.9693514,13.5196615 54.2448852,15.3117621 C53.520419,17.1038627 51.4803385,17.9693514 49.6882379,17.2448852 L27.5,8.27517204 L7,16.5624061 L7,205.937594 L23.0107164,212.410011 L27.2526995,214.124855 L47.5,205.974681 L47.5,152.798823 Z', id: 'Combined-Shape', __source: {
                        fileName: _jsxFileName,
                        lineNumber: 584
                      },
                      __self: this
                    }),
                    _react2.default.createElement('path', { d: 'M146.456827,63.0241849 C146.948603,64.7104724 146.105972,66.5336591 144.447305,67.2283149 L59.5468677,102.784908 L120.416575,128.27735 C122.199524,129.024055 123.039566,131.074745 122.292861,132.857694 C121.546156,134.640643 119.495466,135.480685 117.712517,134.733979 L50.4864131,106.579457 L29.3520293,115.43061 C27.5690802,116.177315 25.5183903,115.337273 24.7716851,113.554324 C24.02498,111.771375 24.8650216,109.720685 26.6479707,108.97398 L47.5,100.241079 L47.5,14.5 C47.5,12.5670034 49.0670034,11 51,11 C52.9329966,11 54.5,12.5670034 54.5,14.5 L54.5,97.3094548 L133.360257,64.2825098 L117.188238,57.7448852 C115.396137,57.020419 114.530649,54.9803385 115.255115,53.1882379 C115.979581,51.3961373 118.019661,50.5306486 119.811762,51.2551148 L139.5,59.2141897 L139.5,25.8602784 L135.887192,24.3997816 L118.188238,17.2448852 C116.396137,16.520419 115.530649,14.4803385 116.255115,12.6882379 C116.979581,10.8961373 119.019661,10.0306486 120.811762,10.7551148 L138.510716,17.9100112 L143.368421,19.8737641 L164.688238,11.2551148 C166.480339,10.5306486 168.520419,11.3961373 169.244885,13.1882379 C169.969351,14.9803385 169.103863,17.020419 167.311762,17.7448852 L146.5,26.1581508 L146.5,62.4728749 C146.5,62.6604574 146.485243,62.8445933 146.456827,63.0241849 Z', id: 'Combined-Shape', __source: {
                        fileName: _jsxFileName,
                        lineNumber: 585
                      },
                      __self: this
                    }),
                    _react2.default.createElement('path', { d: 'M139.5,96.3308069 L122.833333,103.310864 L122.833333,151.372799 C122.833333,153.305795 121.26633,154.872799 119.333333,154.872799 C118.535719,154.872799 117.80042,154.605994 117.211816,154.156763 L26.6479707,116.228315 C26.0976706,115.997847 25.637194,115.643159 25.2854714,115.210462 C24.5008258,114.56862 24,113.592797 24,112.5 L24,25.8602784 L20.3871921,24.3997816 L2.68823789,17.2448852 C0.896137258,16.520419 0.0306485589,14.4803385 0.75511477,12.6882379 C1.47958098,10.8961373 3.51966149,10.0306486 5.31176211,10.7551148 L23.0107164,17.9100112 L27.8684211,19.8737641 L49.1882379,11.2551148 C50.9803385,10.5306486 53.020419,11.3961373 53.7448852,13.1882379 C54.4693514,14.9803385 53.6038627,17.020419 51.8117621,17.7448852 L31,26.1581508 L31,110.461861 L115.833333,145.990351 L115.833333,106.242488 L84.2596616,119.465649 C82.4767125,120.212355 80.4260226,119.372313 79.6793174,117.589364 C78.9326123,115.806415 79.7726539,113.755725 81.555603,113.00902 L141.052151,88.0916622 C141.608974,87.717993 142.27903,87.5 143,87.5 C144.932997,87.5 146.5,89.0670034 146.5,91 L146.5,217.63048 C146.5,219.563477 144.932997,221.13048 143,221.13048 C141.067003,221.13048 139.5,219.563477 139.5,217.63048 L139.5,96.3308069 Z M31,141 L31,217.055237 C31,218.988234 29.4329966,220.555237 27.5,220.555237 C25.5670034,220.555237 24,218.988234 24,217.055237 L24,141 C24,139.067003 25.5670034,137.5 27.5,137.5 C29.4329966,137.5 31,139.067003 31,141 Z', id: 'Combined-Shape', __source: {
                        fileName: _jsxFileName,
                        lineNumber: 586
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
                lineNumber: 591
              },
              __self: this
            }),
            _react2.default.createElement(
              'span',
              { style: { color: '#FAFCFD', display: 'inline-block', width: '100%', height: 50, position: 'absolute', bottom: 50, left: 0 }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 592
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
              lineNumber: 602
            },
            __self: this
          },
          _react2.default.createElement(_AuthenticationUI2.default, Object.assign({
            onSubmit: this.authenticateUser,
            onSubmitSuccess: this.authenticationComplete
          }, this.props, {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 603
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
              lineNumber: 617
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
              lineNumber: 618
            },
            __self: this
          })),
          _react2.default.createElement(_Tour2.default, { projectsList: this.state.projectsList, envoy: this.envoy, startTourOnMount: true, __source: {
              fileName: _jsxFileName,
              lineNumber: 626
            },
            __self: this
          }),
          _react2.default.createElement(_AutoUpdater2.default, { onAutoUpdateCheckComplete: this.onAutoUpdateCheckComplete, shouldDisplay: !this.state.hasCheckedForUpdates, __source: {
              fileName: _jsxFileName,
              lineNumber: 627
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
              lineNumber: 634
            },
            __self: this
          },
          _react2.default.createElement(_Tour2.default, { projectsList: this.state.projectsList, envoy: this.envoy, __source: {
              fileName: _jsxFileName,
              lineNumber: 635
            },
            __self: this
          }),
          _react2.default.createElement(_AutoUpdater2.default, { onAutoUpdateCheckComplete: this.onAutoUpdateCheckComplete, shouldDisplay: !this.state.hasCheckedForUpdates, __source: {
              fileName: _jsxFileName,
              lineNumber: 636
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
              lineNumber: 637
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
              lineNumber: 651
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
                lineNumber: 652
              },
              __self: this
            },
            _react2.default.createElement(
              'div',
              { style: { position: 'absolute', right: 0, top: 0, width: 300 }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 656
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
                lineNumber: 660
              },
              __self: this
            },
            _react2.default.createElement(
              'div',
              { style: { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 661
                },
                __self: this
              },
              _react2.default.createElement(
                'span',
                { style: { fontSize: 24, color: '#222' }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 662
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
            lineNumber: 670
          },
          __self: this
        },
        _react2.default.createElement(_AutoUpdater2.default, { onAutoUpdateCheckComplete: this.onAutoUpdateCheckComplete, shouldDisplay: !this.state.hasCheckedForUpdates, __source: {
            fileName: _jsxFileName,
            lineNumber: 671
          },
          __self: this
        }),
        _react2.default.createElement(_Tour2.default, { projectsList: this.state.projectsList, envoy: this.envoy, __source: {
            fileName: _jsxFileName,
            lineNumber: 672
          },
          __self: this
        }),
        _react2.default.createElement(
          'div',
          { style: { position: 'absolute', width: '100%', height: '100%', top: 0, left: 0 }, __source: {
              fileName: _jsxFileName,
              lineNumber: 673
            },
            __self: this
          },
          _react2.default.createElement(
            'div',
            { className: 'layout-box', style: { overflow: 'visible' }, __source: {
                fileName: _jsxFileName,
                lineNumber: 674
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
                  lineNumber: 675
                },
                __self: this
              },
              _react2.default.createElement(
                'div',
                { style: { position: 'absolute', right: 0, top: 0, width: 300 }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 679
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
                  lineNumber: 683
                },
                __self: this
              },
              _react2.default.createElement(
                'div',
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 684
                  },
                  __self: this
                },
                _react2.default.createElement(
                  _reactSplitPane2.default,
                  { onDragFinished: this.handlePaneResize.bind(this), split: 'vertical', minSize: 300, defaultSize: 300, __source: {
                      fileName: _jsxFileName,
                      lineNumber: 685
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
                        lineNumber: 686
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
                        lineNumber: 691
                      },
                      __self: this
                    }) : _react2.default.createElement(_StateInspector2.default, {
                      createNotice: this.createNotice,
                      removeNotice: this.removeNotice,
                      folder: this.state.projectFolder,
                      websocket: this.props.websocket,
                      tourChannel: this.tourChannel, __source: {
                        fileName: _jsxFileName,
                        lineNumber: 701
                      },
                      __self: this
                    })
                  ),
                  _react2.default.createElement(
                    'div',
                    { style: { position: 'relative', width: '100%', height: '100%' }, __source: {
                        fileName: _jsxFileName,
                        lineNumber: 709
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
                        lineNumber: 710
                      },
                      __self: this
                    }),
                    this.state.libraryItemDragging ? _react2.default.createElement('div', { style: { width: '100%', height: '100%', backgroundColor: 'white', opacity: 0.01, position: 'absolute', top: 0, left: 0 }, __source: {
                        fileName: _jsxFileName,
                        lineNumber: 725
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
                  lineNumber: 730
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZWFjdC9DcmVhdG9yLmpzIl0sIm5hbWVzIjpbInBrZyIsInJlcXVpcmUiLCJtaXhwYW5lbCIsImVsZWN0cm9uIiwicmVtb3RlIiwiZGlhbG9nIiwiaXBjUmVuZGVyZXIiLCJjbGlwYm9hcmQiLCJ3ZWJGcmFtZSIsInNldFpvb21MZXZlbExpbWl0cyIsInNldExheW91dFpvb21MZXZlbExpbWl0cyIsIkNyZWF0b3IiLCJwcm9wcyIsImF1dGhlbnRpY2F0ZVVzZXIiLCJiaW5kIiwiYXV0aGVudGljYXRpb25Db21wbGV0ZSIsImxvYWRQcm9qZWN0cyIsImxhdW5jaFByb2plY3QiLCJyZW1vdmVOb3RpY2UiLCJjcmVhdGVOb3RpY2UiLCJyZW5kZXJOb3RpZmljYXRpb25zIiwicmVjZWl2ZVByb2plY3RJbmZvIiwiaGFuZGxlRmluZEVsZW1lbnRDb29yZGluYXRlcyIsImhhbmRsZUZpbmRXZWJ2aWV3Q29vcmRpbmF0ZXMiLCJvbkF1dG9VcGRhdGVDaGVja0NvbXBsZXRlIiwibGF5b3V0Iiwic3RhdGUiLCJlcnJvciIsInByb2plY3RGb2xkZXIiLCJmb2xkZXIiLCJhcHBsaWNhdGlvbkltYWdlIiwicHJvamVjdE9iamVjdCIsInByb2plY3ROYW1lIiwiZGFzaGJvYXJkVmlzaWJsZSIsInJlYWR5Rm9yQXV0aCIsImlzVXNlckF1dGhlbnRpY2F0ZWQiLCJoYXNDaGVja2VkRm9yVXBkYXRlcyIsInVzZXJuYW1lIiwicGFzc3dvcmQiLCJub3RpY2VzIiwic29mdHdhcmVWZXJzaW9uIiwidmVyc2lvbiIsImRpZFBsdW1iaW5nTm90aWNlQ3Jhc2giLCJhY3RpdmVOYXYiLCJwcm9qZWN0c0xpc3QiLCJ3aW4iLCJnZXRDdXJyZW50V2luZG93IiwicHJvY2VzcyIsImVudiIsIkRFViIsIm9wZW5EZXZUb29scyIsImRvY3VtZW50IiwiYWRkRXZlbnRMaXN0ZW5lciIsIm5hdGl2ZUV2ZW50IiwiX2xhc3RNb3VzZVgiLCJjbGllbnRYIiwiX2xhc3RNb3VzZVkiLCJjbGllbnRZIiwiY29tYm9rZXlzIiwiZG9jdW1lbnRFbGVtZW50IiwiTk9ERV9FTlYiLCJkZWJvdW5jZSIsIndlYnNvY2tldCIsInNlbmQiLCJtZXRob2QiLCJwYXJhbXMiLCJsZWFkaW5nIiwiZHVtcFN5c3RlbUluZm8iLCJvbiIsInR5cGUiLCJuYW1lIiwib3BlblRlcm1pbmFsIiwic2V0U3RhdGUiLCJ3aW5kb3ciLCJleGVjU3luYyIsIkpTT04iLCJzdHJpbmdpZnkiLCJleGNlcHRpb24iLCJjb25zb2xlIiwidGltZXN0YW1wIiwiRGF0ZSIsIm5vdyIsImR1bXBkaXIiLCJqb2luIiwid3JpdGVGaWxlU3luYyIsImFyZ3YiLCJleGlzdHNTeW5jIiwicmVhZEZpbGVTeW5jIiwidG9TdHJpbmciLCJhY3RpdmVGb2xkZXIiLCJyZWFjdFN0YXRlIiwiX19maWxlbmFtZSIsIl9fZGlybmFtZSIsImhvbWVkaXIiLCJpc0RldlRvb2xzT3BlbmVkIiwiY2xvc2VEZXZUb29scyIsInJlZnMiLCJzdGFnZSIsInRvZ2dsZURldlRvb2xzIiwidGltZWxpbmUiLCJtYXliZVBhc3RlUmVxdWVzdCIsInBhc3RlZFRleHQiLCJyZWFkVGV4dCIsInBhc3RlZERhdGEiLCJwYXJzZSIsIndhcm4iLCJBcnJheSIsImlzQXJyYXkiLCJwYXN0ZWRFbGVtZW50IiwicmVxdWVzdCIsInRpdGxlIiwibWVzc2FnZSIsImNsb3NlVGV4dCIsImxpZ2h0U2NoZW1lIiwibGVuZ3RoIiwiaW5mbyIsImRhdGEiLCJoYW5kbGVDb250ZW50UGFzdGUiLCJlbnZveSIsInBvcnQiLCJoYWlrdSIsImhvc3QiLCJXZWJTb2NrZXQiLCJnZXQiLCJ0aGVuIiwiZXhwb3J0ZXJDaGFubmVsIiwiZXZlbnQiLCJmb3JtYXQiLCJleHRlbnNpb24iLCJCb2R5bW92aW4iLCJFcnJvciIsInNob3dTYXZlRGlhbG9nIiwidW5kZWZpbmVkIiwiZGVmYXVsdFBhdGgiLCJmaWx0ZXJzIiwiZXh0ZW5zaW9ucyIsImZpbGVuYW1lIiwic2F2ZSIsInRvdXJDaGFubmVsIiwic2V0RGFzaGJvYXJkVmlzaWJpbGl0eSIsInNldFRpbWVvdXQiLCJzdGFydCIsInRocm90dGxlIiwibm90aWZ5U2NyZWVuUmVzaXplIiwicGFzdGVFdmVudCIsInRhZ25hbWUiLCJ0YXJnZXQiLCJ0YWdOYW1lIiwidG9Mb3dlckNhc2UiLCJwcmV2ZW50RGVmYXVsdCIsImNiIiwiYXV0aEFuc3dlciIsIm1lcmdlVG9QYXlsb2FkIiwiZGlzdGluY3RfaWQiLCJoYWlrdVRyYWNrIiwiYXV0aFRva2VuIiwib3JnYW5pemF0aW9uTmFtZSIsImlzQXV0aGVkIiwibGF1bmNoRm9sZGVyIiwiZm9sZGVyTG9hZGluZ0Vycm9yIiwib2ZmIiwic2VsZWN0b3IiLCJ3ZWJ2aWV3IiwiZWxlbWVudCIsInF1ZXJ5U2VsZWN0b3IiLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJ0b3AiLCJsZWZ0IiwicmVjZWl2ZUVsZW1lbnRDb29yZGluYXRlcyIsInJlY2VpdmVXZWJ2aWV3Q29vcmRpbmF0ZXMiLCJjb250ZW50IiwiaSIsIm5leHQiLCJwcm9qZWN0SW5mbyIsInNraXBDb250ZW50Q3JlYXRpb24iLCJwcm9qZWN0c0hvbWUiLCJwcm9qZWN0UGF0aCIsImF1dGhvck5hbWUiLCJwcm9qZWN0Iiwib3JnYW5pemF0aW9uIiwiZXJyIiwiYXNzaWduIiwibWF5YmVQcm9qZWN0TmFtZSIsImluZGV4IiwiaWQiLCJzbGljZSIsImVhY2giLCJub3RpY2UiLCJNYXRoIiwicmFuZG9tIiwicmVwbGFjZWRFeGlzdGluZyIsImZvckVhY2giLCJuIiwic3BsaWNlIiwidW5zaGlmdCIsImRyYWdFbmROYXRpdmVFdmVudCIsImxpYnJhcnlJdGVtSW5mbyIsImxpYnJhcnlJdGVtRHJhZ2dpbmciLCJwcmV2aWV3IiwiaGFuZGxlRHJvcCIsImRyYWdTdGFydE5hdGl2ZUV2ZW50IiwicG9zaXRpb24iLCJ3aWR0aCIsImhlaWdodCIsInJpZ2h0IiwibWFwIiwiZGlzcGxheSIsInZlcnRpY2FsQWxpZ24iLCJ0ZXh0QWxpZ24iLCJjb2xvciIsImJvdHRvbSIsInJlbmRlclN0YXJ0dXBEZWZhdWx0U2NyZWVuIiwidHJhbnNmb3JtIiwiZm9udFNpemUiLCJvdmVyZmxvdyIsImhhbmRsZVBhbmVSZXNpemUiLCJzd2l0Y2hBY3RpdmVOYXYiLCJvbkxpYnJhcnlEcmFnRW5kIiwib25MaWJyYXJ5RHJhZ1N0YXJ0IiwiYmFja2dyb3VuZENvbG9yIiwib3BhY2l0eSIsIkNvbXBvbmVudCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOztBQUNBOztBQUlBOzs7Ozs7Ozs7Ozs7QUFLQSxJQUFJQSxNQUFNQyxRQUFRLHNCQUFSLENBQVY7O0FBRUEsSUFBSUMsV0FBV0QsUUFBUSx3Q0FBUixDQUFmOztBQUVBLElBQU1FLFdBQVdGLFFBQVEsVUFBUixDQUFqQjtBQUNBLElBQU1HLFNBQVNELFNBQVNDLE1BQXhCO0lBQ09DLE0sR0FBVUQsTSxDQUFWQyxNOztBQUNQLElBQU1DLGNBQWNILFNBQVNHLFdBQTdCO0FBQ0EsSUFBTUMsWUFBWUosU0FBU0ksU0FBM0I7O0FBRUEsSUFBSUMsV0FBV0wsU0FBU0ssUUFBeEI7QUFDQSxJQUFJQSxRQUFKLEVBQWM7QUFDWixNQUFJQSxTQUFTQyxrQkFBYixFQUFpQ0QsU0FBU0Msa0JBQVQsQ0FBNEIsQ0FBNUIsRUFBK0IsQ0FBL0I7QUFDakMsTUFBSUQsU0FBU0Usd0JBQWIsRUFBdUNGLFNBQVNFLHdCQUFULENBQWtDLENBQWxDLEVBQXFDLENBQXJDO0FBQ3hDOztJQUVvQkMsTzs7O0FBQ25CLG1CQUFhQyxLQUFiLEVBQW9CO0FBQUE7O0FBQUEsa0hBQ1pBLEtBRFk7O0FBRWxCLFVBQUtDLGdCQUFMLEdBQXdC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S0FBTCxDQUFXMkssbUJBQVosR0FDRyx1Q0FBSyxPQUFPLEVBQUVLLE9BQU8sTUFBVCxFQUFpQkMsUUFBUSxNQUF6QixFQUFpQ2dCLGlCQUFpQixPQUFsRCxFQUEyREMsU0FBUyxJQUFwRSxFQUEwRW5CLFVBQVUsVUFBcEYsRUFBZ0duQyxLQUFLLENBQXJHLEVBQXdHQyxNQUFNLENBQTlHLEVBQVo7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLHNCQURILEdBRUc7QUFqQk47QUF4QkY7QUFERixlQURGO0FBK0NFO0FBQ0UscUJBQUksVUFETjtBQUVFLHdCQUFRLEtBQUs3SSxLQUFMLENBQVdFLGFBRnJCO0FBR0UsdUJBQU8sS0FBSzBGLEtBSGQ7QUFJRSx1QkFBTyxLQUFLMUcsS0FBTCxDQUFXNEcsS0FKcEI7QUFLRSw4QkFBYyxLQUFLckcsWUFMckI7QUFNRSw4QkFBYyxLQUFLRCxZQU5yQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUEvQ0Y7QUFURjtBQURGO0FBSEYsT0FERjtBQXlFRDs7OztFQXJyQmtDLGdCQUFNMk0sUzs7a0JBQXRCbE4sTyIsImZpbGUiOiJDcmVhdG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgU3R5bGVSb290IH0gZnJvbSAncmFkaXVtJ1xuaW1wb3J0IFNwbGl0UGFuZSBmcm9tICdyZWFjdC1zcGxpdC1wYW5lJ1xuaW1wb3J0IFJlYWN0Q1NTVHJhbnNpdGlvbkdyb3VwIGZyb20gJ3JlYWN0LWFkZG9ucy1jc3MtdHJhbnNpdGlvbi1ncm91cCdcbmltcG9ydCBsb2Rhc2ggZnJvbSAnbG9kYXNoJ1xuaW1wb3J0IENvbWJva2V5cyBmcm9tICdjb21ib2tleXMnXG5pbXBvcnQgRXZlbnRFbWl0dGVyIGZyb20gJ2V2ZW50LWVtaXR0ZXInXG5pbXBvcnQgY3AgZnJvbSAnY2hpbGRfcHJvY2VzcydcbmltcG9ydCBvcyBmcm9tICdvcydcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQgZnMgZnJvbSAnZnMnXG5pbXBvcnQgQXV0aGVudGljYXRpb25VSSBmcm9tICcuL2NvbXBvbmVudHMvQXV0aGVudGljYXRpb25VSSdcbmltcG9ydCBQcm9qZWN0QnJvd3NlciBmcm9tICcuL2NvbXBvbmVudHMvUHJvamVjdEJyb3dzZXInXG5pbXBvcnQgU2lkZUJhciBmcm9tICcuL2NvbXBvbmVudHMvU2lkZUJhcidcbmltcG9ydCBMaWJyYXJ5IGZyb20gJy4vY29tcG9uZW50cy9saWJyYXJ5L0xpYnJhcnknXG5pbXBvcnQgU3RhdGVJbnNwZWN0b3IgZnJvbSAnLi9jb21wb25lbnRzL1N0YXRlSW5zcGVjdG9yL1N0YXRlSW5zcGVjdG9yJ1xuaW1wb3J0IFN0YWdlIGZyb20gJy4vY29tcG9uZW50cy9TdGFnZSdcbmltcG9ydCBUaW1lbGluZSBmcm9tICcuL2NvbXBvbmVudHMvVGltZWxpbmUnXG5pbXBvcnQgVG9hc3QgZnJvbSAnLi9jb21wb25lbnRzL25vdGlmaWNhdGlvbnMvVG9hc3QnXG5pbXBvcnQgVG91ciBmcm9tICcuL2NvbXBvbmVudHMvVG91ci9Ub3VyJ1xuaW1wb3J0IEF1dG9VcGRhdGVyIGZyb20gJy4vY29tcG9uZW50cy9BdXRvVXBkYXRlcidcbmltcG9ydCBFbnZveUNsaWVudCBmcm9tICdoYWlrdS1zZGstY3JlYXRvci9saWIvZW52b3kvY2xpZW50J1xuaW1wb3J0IHsgRVhQT1JURVJfQ0hBTk5FTCwgRXhwb3J0ZXJGb3JtYXQgfSBmcm9tICdoYWlrdS1zZGstY3JlYXRvci9saWIvZXhwb3J0ZXInXG5pbXBvcnQge1xuICBsaW5rRXh0ZXJuYWxBc3NldHNPbkRyb3AsXG4gIHByZXZlbnREZWZhdWx0RHJhZ1xufSBmcm9tICdoYWlrdS1zZXJpYWxpemF0aW9uL3NyYy91dGlscy9kbmRIZWxwZXJzJ1xuaW1wb3J0IHtcbiAgSE9NRURJUl9QQVRILFxuICBIT01FRElSX0xPR1NfUEFUSFxufSBmcm9tICdoYWlrdS1zZXJpYWxpemF0aW9uL3NyYy91dGlscy9IYWlrdUhvbWVEaXInXG5cbnZhciBwa2cgPSByZXF1aXJlKCcuLy4uLy4uL3BhY2thZ2UuanNvbicpXG5cbnZhciBtaXhwYW5lbCA9IHJlcXVpcmUoJ2hhaWt1LXNlcmlhbGl6YXRpb24vc3JjL3V0aWxzL01peHBhbmVsJylcblxuY29uc3QgZWxlY3Ryb24gPSByZXF1aXJlKCdlbGVjdHJvbicpXG5jb25zdCByZW1vdGUgPSBlbGVjdHJvbi5yZW1vdGVcbmNvbnN0IHtkaWFsb2d9ID0gcmVtb3RlXG5jb25zdCBpcGNSZW5kZXJlciA9IGVsZWN0cm9uLmlwY1JlbmRlcmVyXG5jb25zdCBjbGlwYm9hcmQgPSBlbGVjdHJvbi5jbGlwYm9hcmRcblxudmFyIHdlYkZyYW1lID0gZWxlY3Ryb24ud2ViRnJhbWVcbmlmICh3ZWJGcmFtZSkge1xuICBpZiAod2ViRnJhbWUuc2V0Wm9vbUxldmVsTGltaXRzKSB3ZWJGcmFtZS5zZXRab29tTGV2ZWxMaW1pdHMoMSwgMSlcbiAgaWYgKHdlYkZyYW1lLnNldExheW91dFpvb21MZXZlbExpbWl0cykgd2ViRnJhbWUuc2V0TGF5b3V0Wm9vbUxldmVsTGltaXRzKDAsIDApXG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENyZWF0b3IgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3RvciAocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcylcbiAgICB0aGlzLmF1dGhlbnRpY2F0ZVVzZXIgPSB0aGlzLmF1dGhlbnRpY2F0ZVVzZXIuYmluZCh0aGlzKVxuICAgIHRoaXMuYXV0aGVudGljYXRpb25Db21wbGV0ZSA9IHRoaXMuYXV0aGVudGljYXRpb25Db21wbGV0ZS5iaW5kKHRoaXMpXG4gICAgdGhpcy5sb2FkUHJvamVjdHMgPSB0aGlzLmxvYWRQcm9qZWN0cy5iaW5kKHRoaXMpXG4gICAgdGhpcy5sYXVuY2hQcm9qZWN0ID0gdGhpcy5sYXVuY2hQcm9qZWN0LmJpbmQodGhpcylcbiAgICB0aGlzLnJlbW92ZU5vdGljZSA9IHRoaXMucmVtb3ZlTm90aWNlLmJpbmQodGhpcylcbiAgICB0aGlzLmNyZWF0ZU5vdGljZSA9IHRoaXMuY3JlYXRlTm90aWNlLmJpbmQodGhpcylcbiAgICB0aGlzLnJlbmRlck5vdGlmaWNhdGlvbnMgPSB0aGlzLnJlbmRlck5vdGlmaWNhdGlvbnMuYmluZCh0aGlzKVxuICAgIHRoaXMucmVjZWl2ZVByb2plY3RJbmZvID0gdGhpcy5yZWNlaXZlUHJvamVjdEluZm8uYmluZCh0aGlzKVxuICAgIHRoaXMuaGFuZGxlRmluZEVsZW1lbnRDb29yZGluYXRlcyA9IHRoaXMuaGFuZGxlRmluZEVsZW1lbnRDb29yZGluYXRlcy5iaW5kKHRoaXMpXG4gICAgdGhpcy5oYW5kbGVGaW5kV2Vidmlld0Nvb3JkaW5hdGVzID0gdGhpcy5oYW5kbGVGaW5kV2Vidmlld0Nvb3JkaW5hdGVzLmJpbmQodGhpcylcbiAgICB0aGlzLm9uQXV0b1VwZGF0ZUNoZWNrQ29tcGxldGUgPSB0aGlzLm9uQXV0b1VwZGF0ZUNoZWNrQ29tcGxldGUuYmluZCh0aGlzKVxuICAgIHRoaXMubGF5b3V0ID0gbmV3IEV2ZW50RW1pdHRlcigpXG5cbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgZXJyb3I6IG51bGwsXG4gICAgICBwcm9qZWN0Rm9sZGVyOiB0aGlzLnByb3BzLmZvbGRlcixcbiAgICAgIGFwcGxpY2F0aW9uSW1hZ2U6IG51bGwsXG4gICAgICBwcm9qZWN0T2JqZWN0OiBudWxsLFxuICAgICAgcHJvamVjdE5hbWU6IG51bGwsXG4gICAgICBkYXNoYm9hcmRWaXNpYmxlOiAhdGhpcy5wcm9wcy5mb2xkZXIsXG4gICAgICByZWFkeUZvckF1dGg6IGZhbHNlLFxuICAgICAgaXNVc2VyQXV0aGVudGljYXRlZDogZmFsc2UsXG4gICAgICBoYXNDaGVja2VkRm9yVXBkYXRlczogZmFsc2UsXG4gICAgICB1c2VybmFtZTogbnVsbCxcbiAgICAgIHBhc3N3b3JkOiBudWxsLFxuICAgICAgbm90aWNlczogW10sXG4gICAgICBzb2Z0d2FyZVZlcnNpb246IHBrZy52ZXJzaW9uLFxuICAgICAgZGlkUGx1bWJpbmdOb3RpY2VDcmFzaDogZmFsc2UsXG4gICAgICBhY3RpdmVOYXY6ICdsaWJyYXJ5JyxcbiAgICAgIHByb2plY3RzTGlzdDogW11cbiAgICB9XG5cbiAgICBjb25zdCB3aW4gPSByZW1vdGUuZ2V0Q3VycmVudFdpbmRvdygpXG5cbiAgICBpZiAocHJvY2Vzcy5lbnYuREVWID09PSAnMScpIHtcbiAgICAgIHdpbi5vcGVuRGV2VG9vbHMoKVxuICAgIH1cblxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIChuYXRpdmVFdmVudCkgPT4ge1xuICAgICAgdGhpcy5fbGFzdE1vdXNlWCA9IG5hdGl2ZUV2ZW50LmNsaWVudFhcbiAgICAgIHRoaXMuX2xhc3RNb3VzZVkgPSBuYXRpdmVFdmVudC5jbGllbnRZXG4gICAgfSlcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdkcmFnJywgKG5hdGl2ZUV2ZW50KSA9PiB7XG4gICAgICAvLyBXaGVuIHRoZSBkcmFnIGVuZHMsIGZvciBzb21lIHJlYXNvbiB0aGUgcG9zaXRpb24gZ29lcyB0byAwLCBzbyBoYWNrIHRoaXMuLi5cbiAgICAgIGlmIChuYXRpdmVFdmVudC5jbGllbnRYID4gMCAmJiBuYXRpdmVFdmVudC5jbGllbnRZID4gMCkge1xuICAgICAgICB0aGlzLl9sYXN0TW91c2VYID0gbmF0aXZlRXZlbnQuY2xpZW50WFxuICAgICAgICB0aGlzLl9sYXN0TW91c2VZID0gbmF0aXZlRXZlbnQuY2xpZW50WVxuICAgICAgfVxuICAgIH0pXG5cbiAgICBjb25zdCBjb21ib2tleXMgPSBuZXcgQ29tYm9rZXlzKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudClcblxuICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICBjb21ib2tleXMuYmluZCgnY29tbWFuZCtvcHRpb24raScsIGxvZGFzaC5kZWJvdW5jZSgoKSA9PiB7XG4gICAgICAgIHRoaXMucHJvcHMud2Vic29ja2V0LnNlbmQoeyBtZXRob2Q6ICd0b2dnbGVEZXZUb29scycsIHBhcmFtczogW3RoaXMuc3RhdGUucHJvamVjdEZvbGRlcl0gfSlcbiAgICAgIH0sIDUwMCwgeyBsZWFkaW5nOiB0cnVlIH0pKVxuICAgIH1cblxuICAgIGNvbWJva2V5cy5iaW5kKCdjb21tYW5kK29wdGlvbiswJywgbG9kYXNoLmRlYm91bmNlKCgpID0+IHtcbiAgICAgIHRoaXMuZHVtcFN5c3RlbUluZm8oKVxuICAgIH0sIDUwMCwgeyBsZWFkaW5nOiB0cnVlIH0pKVxuXG4gICAgLy8gTk9URTogVGhlIFRvcE1lbnUgYXV0b21hdGljYWxseSBiaW5kcyB0aGUgYmVsb3cga2V5Ym9hcmQgc2hvcnRjdXRzL2FjY2VsZXJhdG9yc1xuICAgIGlwY1JlbmRlcmVyLm9uKCdnbG9iYWwtbWVudTp6b29tLWluJywgKCkgPT4ge1xuICAgICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQuc2VuZCh7IHR5cGU6ICdicm9hZGNhc3QnLCBuYW1lOiAndmlldzp6b29tLWluJyB9KVxuICAgIH0pXG4gICAgaXBjUmVuZGVyZXIub24oJ2dsb2JhbC1tZW51Onpvb20tb3V0JywgKCkgPT4ge1xuICAgICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQuc2VuZCh7IHR5cGU6ICdicm9hZGNhc3QnLCBuYW1lOiAndmlldzp6b29tLW91dCcgfSlcbiAgICB9KVxuICAgIGlwY1JlbmRlcmVyLm9uKCdnbG9iYWwtbWVudTpvcGVuLXRlcm1pbmFsJywgbG9kYXNoLmRlYm91bmNlKCgpID0+IHtcbiAgICAgIHRoaXMub3BlblRlcm1pbmFsKHRoaXMuc3RhdGUucHJvamVjdEZvbGRlcilcbiAgICB9LCA1MDAsIHsgbGVhZGluZzogdHJ1ZSB9KSlcbiAgICBpcGNSZW5kZXJlci5vbignZ2xvYmFsLW1lbnU6dW5kbycsIGxvZGFzaC5kZWJvdW5jZSgoKSA9PiB7XG4gICAgICB0aGlzLnByb3BzLndlYnNvY2tldC5zZW5kKHsgbWV0aG9kOiAnZ2l0VW5kbycsIHBhcmFtczogW3RoaXMuc3RhdGUucHJvamVjdEZvbGRlciwgeyB0eXBlOiAnZ2xvYmFsJyB9XSB9KVxuICAgIH0sIDUwMCwgeyBsZWFkaW5nOiB0cnVlIH0pKVxuICAgIGlwY1JlbmRlcmVyLm9uKCdnbG9iYWwtbWVudTpyZWRvJywgbG9kYXNoLmRlYm91bmNlKCgpID0+IHtcbiAgICAgIHRoaXMucHJvcHMud2Vic29ja2V0LnNlbmQoeyBtZXRob2Q6ICdnaXRSZWRvJywgcGFyYW1zOiBbdGhpcy5zdGF0ZS5wcm9qZWN0Rm9sZGVyLCB7IHR5cGU6ICdnbG9iYWwnIH1dIH0pXG4gICAgfSwgNTAwLCB7IGxlYWRpbmc6IHRydWUgfSkpXG4gICAgaXBjUmVuZGVyZXIub24oJ2dsb2JhbC1tZW51OmNoZWNrLXVwZGF0ZXMnLCAoKSA9PiB7XG4gICAgICB0aGlzLnNldFN0YXRlKHsgaGFzQ2hlY2tlZEZvclVwZGF0ZXM6IGZhbHNlIH0pXG4gICAgfSlcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdkcmFnb3ZlcicsIHByZXZlbnREZWZhdWx0RHJhZywgZmFsc2UpXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2Ryb3AnLCBsaW5rRXh0ZXJuYWxBc3NldHNPbkRyb3AuYmluZCh0aGlzKSwgZmFsc2UpXG4gIH1cblxuICBvcGVuVGVybWluYWwgKGZvbGRlcikge1xuICAgIHRyeSB7XG4gICAgICBjcC5leGVjU3luYygnb3BlbiAtYiBjb20uYXBwbGUudGVybWluYWwgJyArIEpTT04uc3RyaW5naWZ5KGZvbGRlcikgKyAnIHx8IHRydWUnKVxuICAgIH0gY2F0Y2ggKGV4Y2VwdGlvbikge1xuICAgICAgY29uc29sZS5lcnJvcihleGNlcHRpb24pXG4gICAgfVxuICB9XG5cbiAgZHVtcFN5c3RlbUluZm8gKCkge1xuICAgIGNvbnN0IHRpbWVzdGFtcCA9IERhdGUubm93KClcbiAgICBjb25zdCBkdW1wZGlyID0gcGF0aC5qb2luKEhPTUVESVJfUEFUSCwgJ2R1bXBzJywgYGR1bXAtJHt0aW1lc3RhbXB9YClcbiAgICBjcC5leGVjU3luYyhgbWtkaXIgLXAgJHtKU09OLnN0cmluZ2lmeShkdW1wZGlyKX1gKVxuICAgIGZzLndyaXRlRmlsZVN5bmMocGF0aC5qb2luKGR1bXBkaXIsICdhcmd2JyksIEpTT04uc3RyaW5naWZ5KHByb2Nlc3MuYXJndiwgbnVsbCwgMikpXG4gICAgZnMud3JpdGVGaWxlU3luYyhwYXRoLmpvaW4oZHVtcGRpciwgJ2VudicpLCBKU09OLnN0cmluZ2lmeShwcm9jZXNzLmVudiwgbnVsbCwgMikpXG4gICAgaWYgKGZzLmV4aXN0c1N5bmMocGF0aC5qb2luKEhPTUVESVJfTE9HU19QQVRILCAnaGFpa3UtZGVidWcubG9nJykpKSB7XG4gICAgICBmcy53cml0ZUZpbGVTeW5jKHBhdGguam9pbihkdW1wZGlyLCAnbG9nJyksIGZzLnJlYWRGaWxlU3luYyhwYXRoLmpvaW4oSE9NRURJUl9MT0dTX1BBVEgsICdoYWlrdS1kZWJ1Zy5sb2cnKSkudG9TdHJpbmcoKSlcbiAgICB9XG4gICAgZnMud3JpdGVGaWxlU3luYyhwYXRoLmpvaW4oZHVtcGRpciwgJ2luZm8nKSwgSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgYWN0aXZlRm9sZGVyOiB0aGlzLnN0YXRlLnByb2plY3RGb2xkZXIsXG4gICAgICByZWFjdFN0YXRlOiB0aGlzLnN0YXRlLFxuICAgICAgX19maWxlbmFtZTogX19maWxlbmFtZSxcbiAgICAgIF9fZGlybmFtZTogX19kaXJuYW1lXG4gICAgfSwgbnVsbCwgMikpXG4gICAgaWYgKHRoaXMuc3RhdGUucHJvamVjdEZvbGRlcikge1xuICAgICAgLy8gVGhlIHByb2plY3QgZm9sZGVyIGl0c2VsZiB3aWxsIGNvbnRhaW4gZ2l0IGxvZ3MgYW5kIG90aGVyIGdvb2RpZXMgd2UgbWdpaHQgd2FudCB0byBsb29rIGF0XG4gICAgICBjcC5leGVjU3luYyhgdGFyIC16Y3ZmICR7SlNPTi5zdHJpbmdpZnkocGF0aC5qb2luKGR1bXBkaXIsICdwcm9qZWN0LnRhci5neicpKX0gJHtKU09OLnN0cmluZ2lmeSh0aGlzLnN0YXRlLnByb2plY3RGb2xkZXIpfWApXG4gICAgfVxuICAgIC8vIEZvciBjb252ZW5pZW5jZSwgemlwIHVwIHRoZSBlbnRpcmUgZHVtcCBmb2xkZXIuLi5cbiAgICBjcC5leGVjU3luYyhgdGFyIC16Y3ZmICR7SlNPTi5zdHJpbmdpZnkocGF0aC5qb2luKG9zLmhvbWVkaXIoKSwgYGhhaWt1LWR1bXAtJHt0aW1lc3RhbXB9LnRhci5nemApKX0gJHtKU09OLnN0cmluZ2lmeShkdW1wZGlyKX1gKVxuICB9XG5cbiAgdG9nZ2xlRGV2VG9vbHMgKCkge1xuICAgIGNvbnN0IHdpbiA9IHJlbW90ZS5nZXRDdXJyZW50V2luZG93KClcbiAgICBpZiAod2luLmlzRGV2VG9vbHNPcGVuZWQoKSkgd2luLmNsb3NlRGV2VG9vbHMoKVxuICAgIGVsc2Ugd2luLm9wZW5EZXZUb29scygpXG4gICAgaWYgKHRoaXMucmVmcy5zdGFnZSkgdGhpcy5yZWZzLnN0YWdlLnRvZ2dsZURldlRvb2xzKClcbiAgICBpZiAodGhpcy5yZWZzLnRpbWVsaW5lKSB0aGlzLnJlZnMudGltZWxpbmUudG9nZ2xlRGV2VG9vbHMoKVxuICB9XG5cbiAgaGFuZGxlQ29udGVudFBhc3RlIChtYXliZVBhc3RlUmVxdWVzdCkge1xuICAgIGxldCBwYXN0ZWRUZXh0ID0gY2xpcGJvYXJkLnJlYWRUZXh0KClcbiAgICBpZiAoIXBhc3RlZFRleHQpIHJldHVybiB2b2lkICgwKVxuXG4gICAgLy8gVGhlIGRhdGEgb24gdGhlIGNsaXBib2FyZCBtaWdodCBiZSBzZXJpYWxpemVkIGRhdGEsIHNvIHRyeSB0byBwYXJzZSBpdCBpZiB0aGF0J3MgdGhlIGNhc2VcbiAgICAvLyBUaGUgbWFpbiBjYXNlIHdlIGhhdmUgbm93IGZvciBzZXJpYWxpemVkIGRhdGEgaXMgaGFpa3UgZWxlbWVudHMgY29waWVkIGZyb20gdGhlIHN0YWdlXG4gICAgbGV0IHBhc3RlZERhdGFcbiAgICB0cnkge1xuICAgICAgcGFzdGVkRGF0YSA9IEpTT04ucGFyc2UocGFzdGVkVGV4dClcbiAgICB9IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICAgIGNvbnNvbGUud2FybignW2NyZWF0b3JdIHVuYWJsZSB0byBwYXJzZSBwYXN0ZWQgZGF0YTsgaXQgbWlnaHQgYmUgcGxhaW4gdGV4dCcpXG4gICAgICBwYXN0ZWREYXRhID0gcGFzdGVkVGV4dFxuICAgIH1cblxuICAgIGlmIChBcnJheS5pc0FycmF5KHBhc3RlZERhdGEpKSB7XG4gICAgICAvLyBUaGlzIGxvb2tzIGxpa2UgYSBIYWlrdSBlbGVtZW50IHRoYXQgaGFzIGJlZW4gY29waWVkIGZyb20gdGhlIHN0YWdlXG4gICAgICBpZiAocGFzdGVkRGF0YVswXSA9PT0gJ2FwcGxpY2F0aW9uL2hhaWt1JyAmJiB0eXBlb2YgcGFzdGVkRGF0YVsxXSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgbGV0IHBhc3RlZEVsZW1lbnQgPSBwYXN0ZWREYXRhWzFdXG5cbiAgICAgICAgLy8gQ29tbWFuZCB0aGUgdmlld3MgYW5kIG1hc3RlciBwcm9jZXNzIHRvIGhhbmRsZSB0aGUgZWxlbWVudCBwYXN0ZSBhY3Rpb25cbiAgICAgICAgLy8gVGhlICdwYXN0ZVRoaW5nJyBhY3Rpb24gaXMgaW50ZW5kZWQgdG8gYmUgYWJsZSB0byBoYW5kbGUgbXVsdGlwbGUgY29udGVudCB0eXBlc1xuICAgICAgICByZXR1cm4gdGhpcy5wcm9wcy53ZWJzb2NrZXQucmVxdWVzdCh7IHR5cGU6ICdhY3Rpb24nLCBtZXRob2Q6ICdwYXN0ZVRoaW5nJywgcGFyYW1zOiBbdGhpcy5zdGF0ZS5wcm9qZWN0Rm9sZGVyLCBwYXN0ZWRFbGVtZW50LCBtYXliZVBhc3RlUmVxdWVzdCB8fCB7fV0gfSwgKGVycm9yKSA9PiB7XG4gICAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlTm90aWNlKHtcbiAgICAgICAgICAgICAgdHlwZTogJ3dhcm5pbmcnLFxuICAgICAgICAgICAgICB0aXRsZTogJ1VoIG9oIScsXG4gICAgICAgICAgICAgIG1lc3NhZ2U6ICdXZSBjb3VsZG5cXCd0IHBhc3RlIHRoYXQuIPCfmKIgUGxlYXNlIGNvbnRhY3QgSGFpa3UgZm9yIHN1cHBvcnQuJyxcbiAgICAgICAgICAgICAgY2xvc2VUZXh0OiAnT2theScsXG4gICAgICAgICAgICAgIGxpZ2h0U2NoZW1lOiB0cnVlXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIFRPRE86IEhhbmRsZSBvdGhlciBjYXNlcyB3aGVyZSB0aGUgcGFzdGUgZGF0YSB3YXMgYSBzZXJpYWxpemVkIGFycmF5XG4gICAgICAgIGNvbnNvbGUud2FybignW2NyZWF0b3JdIGNhbm5vdCBwYXN0ZSB0aGlzIGNvbnRlbnQgdHlwZSB5ZXQgKGFycmF5KScpXG4gICAgICAgIHRoaXMuY3JlYXRlTm90aWNlKHtcbiAgICAgICAgICB0eXBlOiAnd2FybmluZycsXG4gICAgICAgICAgdGl0bGU6ICdIbW1tJyxcbiAgICAgICAgICBtZXNzYWdlOiAnV2UgZG9uXFwndCBrbm93IGhvdyB0byBwYXN0ZSB0aGF0IGNvbnRlbnQgeWV0LiDwn5izJyxcbiAgICAgICAgICBjbG9zZVRleHQ6ICdPa2F5JyxcbiAgICAgICAgICBsaWdodFNjaGVtZTogdHJ1ZVxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBBbiBlbXB0eSBzdHJpbmcgaXMgdHJlYXRlZCBhcyB0aGUgZXF1aXZhbGVudCBvZiBub3RoaW5nIChkb24ndCBkaXNwbGF5IHdhcm5pbmcgaWYgbm90aGluZyB0byBpbnN0YW50aWF0ZSlcbiAgICAgIGlmICh0eXBlb2YgcGFzdGVkRGF0YSA9PT0gJ3N0cmluZycgJiYgcGFzdGVkRGF0YS5sZW5ndGggPiAwKSB7XG4gICAgICAgIC8vIFRPRE86IEhhbmRsZSB0aGUgY2FzZSB3aGVuIHBsYWluIHRleHQgaGFzIGJlZW4gcGFzdGVkIC0gU1ZHLCBIVE1MLCBldGM/XG4gICAgICAgIGNvbnNvbGUud2FybignW2NyZWF0b3JdIGNhbm5vdCBwYXN0ZSB0aGlzIGNvbnRlbnQgdHlwZSB5ZXQgKHVua25vd24gc3RyaW5nKScpXG4gICAgICAgIHRoaXMuY3JlYXRlTm90aWNlKHtcbiAgICAgICAgICB0eXBlOiAnd2FybmluZycsXG4gICAgICAgICAgdGl0bGU6ICdIbW1tJyxcbiAgICAgICAgICBtZXNzYWdlOiAnV2UgZG9uXFwndCBrbm93IGhvdyB0byBwYXN0ZSB0aGF0IGNvbnRlbnQgeWV0LiDwn5izJyxcbiAgICAgICAgICBjbG9zZVRleHQ6ICdPa2F5JyxcbiAgICAgICAgICBsaWdodFNjaGVtZTogdHJ1ZVxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxNb3VudCAoKSB7XG4gICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQub24oJ2Jyb2FkY2FzdCcsIChtZXNzYWdlKSA9PiB7XG4gICAgICBzd2l0Y2ggKG1lc3NhZ2UubmFtZSkge1xuICAgICAgICBjYXNlICdkZXYtdG9vbHM6dG9nZ2xlJzpcbiAgICAgICAgICB0aGlzLnRvZ2dsZURldlRvb2xzKClcbiAgICAgICAgICBicmVha1xuXG4gICAgICAgIGNhc2UgJ2N1cnJlbnQtcGFzdGVhYmxlOnJlcXVlc3QtcGFzdGUnOlxuICAgICAgICAgIGNvbnNvbGUuaW5mbygnW2NyZWF0b3JdIGN1cnJlbnQtcGFzdGVhYmxlOnJlcXVlc3QtcGFzdGUnLCBtZXNzYWdlLmRhdGEpXG4gICAgICAgICAgcmV0dXJuIHRoaXMuaGFuZGxlQ29udGVudFBhc3RlKG1lc3NhZ2UuZGF0YSlcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgdGhpcy5lbnZveSA9IG5ldyBFbnZveUNsaWVudCh7XG4gICAgICBwb3J0OiB0aGlzLnByb3BzLmhhaWt1LmVudm95LnBvcnQsXG4gICAgICBob3N0OiB0aGlzLnByb3BzLmhhaWt1LmVudm95Lmhvc3QsXG4gICAgICBXZWJTb2NrZXQ6IHdpbmRvdy5XZWJTb2NrZXRcbiAgICB9KVxuXG4gICAgdGhpcy5lbnZveS5nZXQoRVhQT1JURVJfQ0hBTk5FTCkudGhlbigoZXhwb3J0ZXJDaGFubmVsKSA9PiB7XG4gICAgICBpcGNSZW5kZXJlci5vbignZ2xvYmFsLW1lbnU6ZXhwb3J0JywgKGV2ZW50LCBbZm9ybWF0XSkgPT4ge1xuICAgICAgICBsZXQgZXh0ZW5zaW9uXG4gICAgICAgIHN3aXRjaCAoZm9ybWF0KSB7XG4gICAgICAgICAgY2FzZSBFeHBvcnRlckZvcm1hdC5Cb2R5bW92aW46XG4gICAgICAgICAgICBleHRlbnNpb24gPSAnanNvbidcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5zdXBwb3J0ZWQgZm9ybWF0OiAke2Zvcm1hdH1gKVxuICAgICAgICB9XG5cbiAgICAgICAgZGlhbG9nLnNob3dTYXZlRGlhbG9nKHVuZGVmaW5lZCwge1xuICAgICAgICAgIGRlZmF1bHRQYXRoOiBgKi8ke3RoaXMuc3RhdGUucHJvamVjdE5hbWV9YCxcbiAgICAgICAgICBmaWx0ZXJzOiBbe1xuICAgICAgICAgICAgbmFtZTogZm9ybWF0LFxuICAgICAgICAgICAgZXh0ZW5zaW9uczogW2V4dGVuc2lvbl1cbiAgICAgICAgICB9XVxuICAgICAgICB9LFxuICAgICAgICAoZmlsZW5hbWUpID0+IHtcbiAgICAgICAgICBleHBvcnRlckNoYW5uZWwuc2F2ZSh7Zm9ybWF0LCBmaWxlbmFtZX0pXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICB0aGlzLmVudm95LmdldCgndG91cicpLnRoZW4oKHRvdXJDaGFubmVsKSA9PiB7XG4gICAgICB0aGlzLnRvdXJDaGFubmVsID0gdG91ckNoYW5uZWxcblxuICAgICAgdG91ckNoYW5uZWwub24oJ3RvdXI6cmVxdWVzdEVsZW1lbnRDb29yZGluYXRlcycsIHRoaXMuaGFuZGxlRmluZEVsZW1lbnRDb29yZGluYXRlcylcblxuICAgICAgdG91ckNoYW5uZWwub24oJ3RvdXI6cmVxdWVzdFdlYnZpZXdDb29yZGluYXRlcycsIHRoaXMuaGFuZGxlRmluZFdlYnZpZXdDb29yZGluYXRlcylcblxuICAgICAgaXBjUmVuZGVyZXIub24oJ2dsb2JhbC1tZW51OnN0YXJ0LXRvdXInLCAoKSA9PiB7XG4gICAgICAgIHRoaXMuc2V0RGFzaGJvYXJkVmlzaWJpbGl0eSh0cnVlKVxuXG4gICAgICAgIC8vIFB1dCBpdCBhdCB0aGUgYm90dG9tIG9mIHRoZSBldmVudCBsb29wXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIHRvdXJDaGFubmVsLnN0YXJ0KHRydWUpXG4gICAgICAgIH0pXG4gICAgICB9KVxuXG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgbG9kYXNoLnRocm90dGxlKCgpID0+IHtcbiAgICAgICAgLy8gaWYgKHRvdXJDaGFubmVsLmlzVG91ckFjdGl2ZSgpKSB7XG4gICAgICAgIHRvdXJDaGFubmVsLm5vdGlmeVNjcmVlblJlc2l6ZSgpXG4gICAgICAgIC8vIH1cbiAgICAgIH0pLCAzMDApXG4gICAgfSlcblxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3Bhc3RlJywgKHBhc3RlRXZlbnQpID0+IHtcbiAgICAgIGNvbnNvbGUuaW5mbygnW2NyZWF0b3JdIHBhc3RlIGhlYXJkJylcbiAgICAgIGxldCB0YWduYW1lID0gcGFzdGVFdmVudC50YXJnZXQudGFnTmFtZS50b0xvd2VyQ2FzZSgpXG4gICAgICBpZiAodGFnbmFtZSA9PT0gJ2lucHV0JyB8fCB0YWduYW1lID09PSAndGV4dGFyZWEnKSB7XG4gICAgICAgIC8vIERvIG5vdGhpbmc7IGxldCBpbnB1dCBmaWVsZHMgYW5kIHNvLW9uIGJlIGhhbmRsZWQgbm9ybWFsbHlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIE90aGVyd2lzZSwgYXNzdW1lIHdlIG1pZ2h0IG5lZWQgdG8gaGFuZGxlIHRoaXMgcGFzdGUgZXZlbnQgc3BlY2lhbGx5XG4gICAgICAgIHBhc3RlRXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgICAgICB0aGlzLmhhbmRsZUNvbnRlbnRQYXN0ZSgpXG4gICAgICB9XG4gICAgfSlcblxuICAgIHRoaXMucHJvcHMud2Vic29ja2V0Lm9uKCdtZXRob2QnLCAobWV0aG9kLCBwYXJhbXMsIGNiKSA9PiB7XG4gICAgICBjb25zb2xlLmluZm8oJ1tjcmVhdG9yXSBtZXRob2QgZnJvbSBwbHVtYmluZzonLCBtZXRob2QsIHBhcmFtcylcbiAgICAgIC8vIG5vLW9wOyBjcmVhdG9yIGRvZXNuJ3QgY3VycmVudGx5IHJlY2VpdmUgYW55IG1ldGhvZHMgZnJvbSB0aGUgb3RoZXIgdmlld3MsIGJ1dCB3ZSBuZWVkIHRoaXNcbiAgICAgIC8vIGNhbGxiYWNrIHRvIGJlIGNhbGxlZCB0byBhbGxvdyB0aGUgYWN0aW9uIGNoYWluIGluIHBsdW1iaW5nIHRvIHByb2NlZWRcbiAgICAgIHJldHVybiBjYigpXG4gICAgfSlcblxuICAgIHRoaXMucHJvcHMud2Vic29ja2V0Lm9uKCdvcGVuJywgKCkgPT4ge1xuICAgICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQucmVxdWVzdCh7IG1ldGhvZDogJ2lzVXNlckF1dGhlbnRpY2F0ZWQnLCBwYXJhbXM6IFtdIH0sIChlcnJvciwgYXV0aEFuc3dlcikgPT4ge1xuICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKVxuICAgICAgICAgIHJldHVybiB0aGlzLmNyZWF0ZU5vdGljZSh7XG4gICAgICAgICAgICB0eXBlOiAnZXJyb3InLFxuICAgICAgICAgICAgdGl0bGU6ICdPaCBubyEnLFxuICAgICAgICAgICAgbWVzc2FnZTogJ1dlIGhhZCBhIHByb2JsZW0gYWNjZXNzaW5nIHlvdXIgYWNjb3VudC4g8J+YoiBQbGVhc2UgdHJ5IGNsb3NpbmcgYW5kIHJlb3BlbmluZyB0aGUgYXBwbGljYXRpb24uIElmIHlvdSBzdGlsbCBzZWUgdGhpcyBtZXNzYWdlLCBjb250YWN0IEhhaWt1IGZvciBzdXBwb3J0LicsXG4gICAgICAgICAgICBjbG9zZVRleHQ6ICdPa2F5JyxcbiAgICAgICAgICAgIGxpZ2h0U2NoZW1lOiB0cnVlXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuXG4gICAgICAgIG1peHBhbmVsLm1lcmdlVG9QYXlsb2FkKHsgZGlzdGluY3RfaWQ6IGF1dGhBbnN3ZXIgJiYgYXV0aEFuc3dlci51c2VybmFtZSB9KVxuICAgICAgICBtaXhwYW5lbC5oYWlrdVRyYWNrKCdjcmVhdG9yOm9wZW5lZCcpXG5cbiAgICAgICAgLy8gRGVsYXkgc28gdGhlIGRlZmF1bHQgc3RhcnR1cCBzY3JlZW4gZG9lc24ndCBqdXN0IGZsYXNoIHRoZW4gZ28gYXdheVxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIHJlYWR5Rm9yQXV0aDogdHJ1ZSxcbiAgICAgICAgICAgIGF1dGhUb2tlbjogYXV0aEFuc3dlciAmJiBhdXRoQW5zd2VyLmF1dGhUb2tlbixcbiAgICAgICAgICAgIG9yZ2FuaXphdGlvbk5hbWU6IGF1dGhBbnN3ZXIgJiYgYXV0aEFuc3dlci5vcmdhbml6YXRpb25OYW1lLFxuICAgICAgICAgICAgdXNlcm5hbWU6IGF1dGhBbnN3ZXIgJiYgYXV0aEFuc3dlci51c2VybmFtZSxcbiAgICAgICAgICAgIGlzVXNlckF1dGhlbnRpY2F0ZWQ6IGF1dGhBbnN3ZXIgJiYgYXV0aEFuc3dlci5pc0F1dGhlZFxuICAgICAgICAgIH0pXG4gICAgICAgICAgaWYgKHRoaXMucHJvcHMuZm9sZGVyKSB7XG4gICAgICAgICAgICAvLyBMYXVuY2ggZm9sZGVyIGRpcmVjdGx5IC0gaS5lLiBhbGxvdyBhICdzdWJsJyBsaWtlIGV4cGVyaWVuY2Ugd2l0aG91dCBoYXZpbmcgdG8gZ29cbiAgICAgICAgICAgIC8vIHRocm91Z2ggdGhlIHByb2plY3RzIGluZGV4XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5sYXVuY2hGb2xkZXIobnVsbCwgdGhpcy5wcm9wcy5mb2xkZXIsIChlcnJvcikgPT4ge1xuICAgICAgICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKVxuICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBmb2xkZXJMb2FkaW5nRXJyb3I6IGVycm9yIH0pXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlTm90aWNlKHtcbiAgICAgICAgICAgICAgICAgIHR5cGU6ICdlcnJvcicsXG4gICAgICAgICAgICAgICAgICB0aXRsZTogJ09oIG5vIScsXG4gICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnV2Ugd2VyZSB1bmFibGUgdG8gb3BlbiB0aGUgZm9sZGVyLiDwn5iiIFBsZWFzZSBjbG9zZSBhbmQgcmVvcGVuIHRoZSBhcHBsaWNhdGlvbiBhbmQgdHJ5IGFnYWluLiBJZiB5b3Ugc3RpbGwgc2VlIHRoaXMgbWVzc2FnZSwgY29udGFjdCBIYWlrdSBmb3Igc3VwcG9ydC4nLFxuICAgICAgICAgICAgICAgICAgY2xvc2VUZXh0OiAnT2theScsXG4gICAgICAgICAgICAgICAgICBsaWdodFNjaGVtZTogdHJ1ZVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfVxuICAgICAgICB9LCAxMDAwKVxuICAgICAgfSlcbiAgICB9KVxuICB9XG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQgKCkge1xuICAgIHRoaXMudG91ckNoYW5uZWwub2ZmKCd0b3VyOnJlcXVlc3RFbGVtZW50Q29vcmRpbmF0ZXMnLCB0aGlzLmhhbmRsZUZpbmRFbGVtZW50Q29vcmRpbmF0ZXMpXG4gICAgdGhpcy50b3VyQ2hhbm5lbC5vZmYoJ3RvdXI6cmVxdWVzdFdlYnZpZXdDb29yZGluYXRlcycsIHRoaXMuaGFuZGxlRmluZFdlYnZpZXdDb29yZGluYXRlcylcbiAgfVxuXG4gIGhhbmRsZUZpbmRFbGVtZW50Q29vcmRpbmF0ZXMgKHsgc2VsZWN0b3IsIHdlYnZpZXcgfSkge1xuICAgIGlmICh3ZWJ2aWV3ICE9PSAnY3JlYXRvcicpIHsgcmV0dXJuIH1cblxuICAgIHRyeSB7XG4gICAgICAvLyBUT0RPOiBmaW5kIGlmIHRoZXJlIGlzIGEgYmV0dGVyIHNvbHV0aW9uIHRvIHRoaXMgc2NhcGUgaGF0Y2hcbiAgICAgIGxldCBlbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3RvcilcbiAgICAgIGxldCB7IHRvcCwgbGVmdCB9ID0gZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuXG4gICAgICB0aGlzLnRvdXJDaGFubmVsLnJlY2VpdmVFbGVtZW50Q29vcmRpbmF0ZXMoJ2NyZWF0b3InLCB7IHRvcCwgbGVmdCB9KVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmVycm9yKGBbY3JlYXRvcl0gZXJyb3IgZmV0Y2hpbmcgJHtzZWxlY3Rvcn0gaW4gd2VidmlldyAke3dlYnZpZXd9YClcbiAgICB9XG4gIH1cblxuICBoYW5kbGVGaW5kV2Vidmlld0Nvb3JkaW5hdGVzICgpIHtcbiAgICB0aGlzLnRvdXJDaGFubmVsLnJlY2VpdmVXZWJ2aWV3Q29vcmRpbmF0ZXMoJ2NyZWF0b3InLCB7IHRvcDogMCwgbGVmdDogMCB9KVxuICB9XG5cbiAgaGFuZGxlUGFuZVJlc2l6ZSAoKSB7XG4gICAgLy8gdGhpcy5sYXlvdXQuZW1pdCgncmVzaXplJylcbiAgfVxuXG4gIHJlbmRlck5vdGlmaWNhdGlvbnMgKGNvbnRlbnQsIGkpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPFRvYXN0XG4gICAgICAgIHRvYXN0VHlwZT17Y29udGVudC50eXBlfVxuICAgICAgICB0b2FzdFRpdGxlPXtjb250ZW50LnRpdGxlfVxuICAgICAgICB0b2FzdE1lc3NhZ2U9e2NvbnRlbnQubWVzc2FnZX1cbiAgICAgICAgY2xvc2VUZXh0PXtjb250ZW50LmNsb3NlVGV4dH1cbiAgICAgICAga2V5PXtpICsgY29udGVudC50aXRsZX1cbiAgICAgICAgbXlLZXk9e2l9XG4gICAgICAgIHJlbW92ZU5vdGljZT17dGhpcy5yZW1vdmVOb3RpY2V9XG4gICAgICAgIGxpZ2h0U2NoZW1lPXtjb250ZW50LmxpZ2h0U2NoZW1lfSAvPlxuICAgIClcbiAgfVxuXG4gIHNldERhc2hib2FyZFZpc2liaWxpdHkgKGRhc2hib2FyZFZpc2libGUpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtkYXNoYm9hcmRWaXNpYmxlfSlcbiAgfVxuXG4gIHN3aXRjaEFjdGl2ZU5hdiAoYWN0aXZlTmF2KSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7YWN0aXZlTmF2fSlcblxuICAgIGlmIChhY3RpdmVOYXYgPT09ICdzdGF0ZV9pbnNwZWN0b3InKSB7XG4gICAgICB0aGlzLnRvdXJDaGFubmVsLm5leHQoKVxuICAgIH1cbiAgfVxuXG4gIGF1dGhlbnRpY2F0ZVVzZXIgKHVzZXJuYW1lLCBwYXNzd29yZCwgY2IpIHtcbiAgICByZXR1cm4gdGhpcy5wcm9wcy53ZWJzb2NrZXQucmVxdWVzdCh7IG1ldGhvZDogJ2F1dGhlbnRpY2F0ZVVzZXInLCBwYXJhbXM6IFt1c2VybmFtZSwgcGFzc3dvcmRdIH0sIChlcnJvciwgYXV0aEFuc3dlcikgPT4ge1xuICAgICAgaWYgKGVycm9yKSByZXR1cm4gY2IoZXJyb3IpXG4gICAgICBtaXhwYW5lbC5tZXJnZVRvUGF5bG9hZCh7IGRpc3RpbmN0X2lkOiB1c2VybmFtZSB9KVxuICAgICAgbWl4cGFuZWwuaGFpa3VUcmFjaygnY3JlYXRvcjp1c2VyLWF1dGhlbnRpY2F0ZWQnLCB7IHVzZXJuYW1lIH0pXG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgdXNlcm5hbWUsXG4gICAgICAgIHBhc3N3b3JkLFxuICAgICAgICBhdXRoVG9rZW46IGF1dGhBbnN3ZXIgJiYgYXV0aEFuc3dlci5hdXRoVG9rZW4sXG4gICAgICAgIG9yZ2FuaXphdGlvbk5hbWU6IGF1dGhBbnN3ZXIgJiYgYXV0aEFuc3dlci5vcmdhbml6YXRpb25OYW1lLFxuICAgICAgICBpc1VzZXJBdXRoZW50aWNhdGVkOiBhdXRoQW5zd2VyICYmIGF1dGhBbnN3ZXIuaXNBdXRoZWRcbiAgICAgIH0pXG4gICAgICByZXR1cm4gY2IobnVsbCwgYXV0aEFuc3dlcilcbiAgICB9KVxuICB9XG5cbiAgYXV0aGVudGljYXRpb25Db21wbGV0ZSAoKSB7XG4gICAgcmV0dXJuIHRoaXMuc2V0U3RhdGUoeyBpc1VzZXJBdXRoZW50aWNhdGVkOiB0cnVlIH0pXG4gIH1cblxuICByZWNlaXZlUHJvamVjdEluZm8gKHByb2plY3RJbmZvKSB7XG4gICAgLy8gTk8tT1BcbiAgfVxuXG4gIGxvYWRQcm9qZWN0cyAoY2IpIHtcbiAgICByZXR1cm4gdGhpcy5wcm9wcy53ZWJzb2NrZXQucmVxdWVzdCh7IG1ldGhvZDogJ2xpc3RQcm9qZWN0cycsIHBhcmFtczogW10gfSwgKGVycm9yLCBwcm9qZWN0c0xpc3QpID0+IHtcbiAgICAgIGlmIChlcnJvcikgcmV0dXJuIGNiKGVycm9yKVxuICAgICAgdGhpcy5zZXRTdGF0ZSh7IHByb2plY3RzTGlzdCB9KVxuICAgICAgaXBjUmVuZGVyZXIuc2VuZCgncmVuZGVyZXI6cHJvamVjdHMtbGlzdC1mZXRjaGVkJywgcHJvamVjdHNMaXN0KVxuICAgICAgcmV0dXJuIGNiKG51bGwsIHByb2plY3RzTGlzdClcbiAgICB9KVxuICB9XG5cbiAgbGF1bmNoUHJvamVjdCAocHJvamVjdE5hbWUsIHByb2plY3RPYmplY3QsIGNiKSB7XG4gICAgcHJvamVjdE9iamVjdCA9IHtcbiAgICAgIHNraXBDb250ZW50Q3JlYXRpb246IHRydWUsIC8vIFZFUlkgSU1QT1JUQU5UIC0gaWYgbm90IHNldCB0byB0cnVlLCB3ZSBjYW4gZW5kIHVwIGluIGEgc2l0dWF0aW9uIHdoZXJlIHdlIG92ZXJ3cml0ZSBmcmVzaGx5IGNsb25lZCBjb250ZW50IGZyb20gdGhlIHJlbW90ZSFcbiAgICAgIHByb2plY3RzSG9tZTogcHJvamVjdE9iamVjdC5wcm9qZWN0c0hvbWUsXG4gICAgICBwcm9qZWN0UGF0aDogcHJvamVjdE9iamVjdC5wcm9qZWN0UGF0aCxcbiAgICAgIG9yZ2FuaXphdGlvbk5hbWU6IHRoaXMuc3RhdGUub3JnYW5pemF0aW9uTmFtZSxcbiAgICAgIGF1dGhvck5hbWU6IHRoaXMuc3RhdGUudXNlcm5hbWUsXG4gICAgICBwcm9qZWN0TmFtZSAvLyBIYXZlIHRvIHNldCB0aGlzIGhlcmUsIGJlY2F1c2Ugd2UgcGFzcyB0aGlzIHdob2xlIG9iamVjdCB0byBTdGF0ZVRpdGxlQmFyLCB3aGljaCBuZWVkcyB0aGlzIHRvIHByb3Blcmx5IGNhbGwgc2F2ZVByb2plY3RcbiAgICB9XG5cbiAgICBtaXhwYW5lbC5oYWlrdVRyYWNrKCdjcmVhdG9yOnByb2plY3Q6bGF1bmNoaW5nJywge1xuICAgICAgdXNlcm5hbWU6IHRoaXMuc3RhdGUudXNlcm5hbWUsXG4gICAgICBwcm9qZWN0OiBwcm9qZWN0TmFtZSxcbiAgICAgIG9yZ2FuaXphdGlvbjogdGhpcy5zdGF0ZS5vcmdhbml6YXRpb25OYW1lXG4gICAgfSlcblxuICAgIHJldHVybiB0aGlzLnByb3BzLndlYnNvY2tldC5yZXF1ZXN0KHsgbWV0aG9kOiAnaW5pdGlhbGl6ZVByb2plY3QnLCBwYXJhbXM6IFtwcm9qZWN0TmFtZSwgcHJvamVjdE9iamVjdCwgdGhpcy5zdGF0ZS51c2VybmFtZSwgdGhpcy5zdGF0ZS5wYXNzd29yZF0gfSwgKGVyciwgcHJvamVjdEZvbGRlcikgPT4ge1xuICAgICAgaWYgKGVycikgcmV0dXJuIGNiKGVycilcblxuICAgICAgcmV0dXJuIHRoaXMucHJvcHMud2Vic29ja2V0LnJlcXVlc3QoeyBtZXRob2Q6ICdzdGFydFByb2plY3QnLCBwYXJhbXM6IFtwcm9qZWN0TmFtZSwgcHJvamVjdEZvbGRlcl0gfSwgKGVyciwgYXBwbGljYXRpb25JbWFnZSkgPT4ge1xuICAgICAgICBpZiAoZXJyKSByZXR1cm4gY2IoZXJyKVxuXG4gICAgICAgIC8vIEFzc2lnbiwgbm90IG1lcmdlLCBzaW5jZSB3ZSBkb24ndCB3YW50IHRvIGNsb2JiZXIgYW55IHZhcmlhYmxlcyBhbHJlYWR5IHNldCwgbGlrZSBwcm9qZWN0IG5hbWVcbiAgICAgICAgbG9kYXNoLmFzc2lnbihwcm9qZWN0T2JqZWN0LCBhcHBsaWNhdGlvbkltYWdlLnByb2plY3QpXG5cbiAgICAgICAgbWl4cGFuZWwuaGFpa3VUcmFjaygnY3JlYXRvcjpwcm9qZWN0OmxhdW5jaGVkJywge1xuICAgICAgICAgIHVzZXJuYW1lOiB0aGlzLnN0YXRlLnVzZXJuYW1lLFxuICAgICAgICAgIHByb2plY3Q6IHByb2plY3ROYW1lLFxuICAgICAgICAgIG9yZ2FuaXphdGlvbjogdGhpcy5zdGF0ZS5vcmdhbml6YXRpb25OYW1lXG4gICAgICAgIH0pXG5cbiAgICAgICAgLy8gTm93IGhhY2tpbHkgY2hhbmdlIHNvbWUgcG9pbnRlcnMgc28gd2UncmUgcmVmZXJyaW5nIHRvIHRoZSBjb3JyZWN0IHBsYWNlXG4gICAgICAgIHRoaXMucHJvcHMud2Vic29ja2V0LmZvbGRlciA9IHByb2plY3RGb2xkZXIgLy8gRG8gbm90IHJlbW92ZSB0aGlzIG5lY2Vzc2FyeSBoYWNrIHBselxuICAgICAgICB0aGlzLnNldFN0YXRlKHsgcHJvamVjdEZvbGRlciwgYXBwbGljYXRpb25JbWFnZSwgcHJvamVjdE9iamVjdCwgcHJvamVjdE5hbWUsIGRhc2hib2FyZFZpc2libGU6IGZhbHNlIH0pXG5cbiAgICAgICAgcmV0dXJuIGNiKClcbiAgICAgIH0pXG4gICAgfSlcbiAgfVxuXG4gIGxhdW5jaEZvbGRlciAobWF5YmVQcm9qZWN0TmFtZSwgcHJvamVjdEZvbGRlciwgY2IpIHtcbiAgICBtaXhwYW5lbC5oYWlrdVRyYWNrKCdjcmVhdG9yOmZvbGRlcjpsYXVuY2hpbmcnLCB7XG4gICAgICB1c2VybmFtZTogdGhpcy5zdGF0ZS51c2VybmFtZSxcbiAgICAgIHByb2plY3Q6IG1heWJlUHJvamVjdE5hbWVcbiAgICB9KVxuXG4gICAgLy8gVGhlIGxhdW5jaFByb2plY3QgbWV0aG9kIGhhbmRsZXMgdGhlIHBlcmZvcm1Gb2xkZXJQb2ludGVyQ2hhbmdlXG4gICAgcmV0dXJuIHRoaXMubGF1bmNoUHJvamVjdChtYXliZVByb2plY3ROYW1lLCB7IHByb2plY3RQYXRoOiBwcm9qZWN0Rm9sZGVyIH0sIGNiKVxuICB9XG5cbiAgcmVtb3ZlTm90aWNlIChpbmRleCwgaWQpIHtcbiAgICBjb25zdCBub3RpY2VzID0gdGhpcy5zdGF0ZS5ub3RpY2VzXG4gICAgaWYgKGluZGV4ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBub3RpY2VzOiBbLi4ubm90aWNlcy5zbGljZSgwLCBpbmRleCksIC4uLm5vdGljZXMuc2xpY2UoaW5kZXggKyAxKV1cbiAgICAgIH0pXG4gICAgfSBlbHNlIGlmIChpZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAvLyBIYWNrYXJvb1xuICAgICAgbG9kYXNoLmVhY2gobm90aWNlcywgKG5vdGljZSwgaW5kZXgpID0+IHtcbiAgICAgICAgaWYgKG5vdGljZS5pZCA9PT0gaWQpIHRoaXMucmVtb3ZlTm90aWNlKGluZGV4KVxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICBjcmVhdGVOb3RpY2UgKG5vdGljZSkge1xuICAgIC8qIEV4cGVjdHMgdGhlIG9iamVjdDpcbiAgICB7IHR5cGU6IHN0cmluZyAoaW5mbywgc3VjY2VzcywgZGFuZ2VyIChvciBlcnJvciksIHdhcm5pbmcpXG4gICAgICB0aXRsZTogc3RyaW5nLFxuICAgICAgbWVzc2FnZTogc3RyaW5nLFxuICAgICAgY2xvc2VUZXh0OiBzdHJpbmcgKG9wdGlvbmFsLCBkZWZhdWx0cyB0byAnY2xvc2UnKVxuICAgICAgbGlnaHRTY2hlbWU6IGJvb2wgKG9wdGlvbmFsLCBkZWZhdWx0cyB0byBkYXJrKVxuICAgIH0gKi9cblxuICAgIG5vdGljZS5pZCA9IE1hdGgucmFuZG9tKCkgKyAnJ1xuXG4gICAgY29uc3Qgbm90aWNlcyA9IHRoaXMuc3RhdGUubm90aWNlc1xuICAgIGxldCByZXBsYWNlZEV4aXN0aW5nID0gZmFsc2VcblxuICAgIG5vdGljZXMuZm9yRWFjaCgobiwgaSkgPT4ge1xuICAgICAgaWYgKG4ubWVzc2FnZSA9PT0gbm90aWNlLm1lc3NhZ2UpIHtcbiAgICAgICAgbm90aWNlcy5zcGxpY2UoaSwgMSlcbiAgICAgICAgcmVwbGFjZWRFeGlzdGluZyA9IHRydWVcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IG5vdGljZXMgfSwgKCkgPT4ge1xuICAgICAgICAgIG5vdGljZXMudW5zaGlmdChub3RpY2UpXG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IG5vdGljZXMgfSlcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgaWYgKCFyZXBsYWNlZEV4aXN0aW5nKSB7XG4gICAgICBub3RpY2VzLnVuc2hpZnQobm90aWNlKVxuICAgICAgdGhpcy5zZXRTdGF0ZSh7IG5vdGljZXMgfSlcbiAgICB9XG5cbiAgICByZXR1cm4gbm90aWNlXG4gIH1cblxuICBvbkxpYnJhcnlEcmFnRW5kIChkcmFnRW5kTmF0aXZlRXZlbnQsIGxpYnJhcnlJdGVtSW5mbykge1xuICAgIHRoaXMuc2V0U3RhdGUoeyBsaWJyYXJ5SXRlbURyYWdnaW5nOiBudWxsIH0pXG4gICAgaWYgKGxpYnJhcnlJdGVtSW5mbyAmJiBsaWJyYXJ5SXRlbUluZm8ucHJldmlldykge1xuICAgICAgdGhpcy5yZWZzLnN0YWdlLmhhbmRsZURyb3AobGlicmFyeUl0ZW1JbmZvLCB0aGlzLl9sYXN0TW91c2VYLCB0aGlzLl9sYXN0TW91c2VZKVxuICAgIH1cbiAgfVxuXG4gIG9uTGlicmFyeURyYWdTdGFydCAoZHJhZ1N0YXJ0TmF0aXZlRXZlbnQsIGxpYnJhcnlJdGVtSW5mbykge1xuICAgIHRoaXMuc2V0U3RhdGUoeyBsaWJyYXJ5SXRlbURyYWdnaW5nOiBsaWJyYXJ5SXRlbUluZm8gfSlcbiAgfVxuXG4gIG9uQXV0b1VwZGF0ZUNoZWNrQ29tcGxldGUgKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoeyBoYXNDaGVja2VkRm9yVXBkYXRlczogdHJ1ZSB9KVxuICB9XG5cbiAgcmVuZGVyU3RhcnR1cERlZmF1bHRTY3JlZW4gKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IHN0eWxlPXt7IHBvc2l0aW9uOiAnYWJzb2x1dGUnLCB3aWR0aDogJzEwMCUnLCBoZWlnaHQ6ICcxMDAlJyB9fT5cbiAgICAgICAgPFJlYWN0Q1NTVHJhbnNpdGlvbkdyb3VwXG4gICAgICAgICAgdHJhbnNpdGlvbk5hbWU9J3RvYXN0J1xuICAgICAgICAgIHRyYW5zaXRpb25FbnRlclRpbWVvdXQ9ezUwMH1cbiAgICAgICAgICB0cmFuc2l0aW9uTGVhdmVUaW1lb3V0PXszMDB9PlxuICAgICAgICAgIDxkaXYgc3R5bGU9e3twb3NpdGlvbjogJ2Fic29sdXRlJywgcmlnaHQ6IDAsIHRvcDogMCwgd2lkdGg6IDMwMH19PlxuICAgICAgICAgICAge2xvZGFzaC5tYXAodGhpcy5zdGF0ZS5ub3RpY2VzLCB0aGlzLnJlbmRlck5vdGlmaWNhdGlvbnMpfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L1JlYWN0Q1NTVHJhbnNpdGlvbkdyb3VwPlxuICAgICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6ICd0YWJsZScsIHdpZHRoOiAnMTAwJScsIGhlaWdodDogJzEwMCUnLCBwb3NpdGlvbjogJ2Fic29sdXRlJywgdG9wOiAwLCBsZWZ0OiAwIH19PlxuICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ3RhYmxlLWNlbGwnLCB3aWR0aDogJzEwMCUnLCBoZWlnaHQ6ICcxMDAlJywgdmVydGljYWxBbGlnbjogJ21pZGRsZScsIHRleHRBbGlnbjogJ2NlbnRlcicgfX0+XG4gICAgICAgICAgICA8c3ZnIHdpZHRoPScxNzBweCcgaGVpZ2h0PScyMjFweCcgdmlld0JveD0nMCAwIDE3MCAyMjEnIHZlcnNpb249JzEuMSc+XG4gICAgICAgICAgICAgIDxnIGlkPSdQYWdlLTEnIHN0cm9rZT0nbm9uZScgc3Ryb2tlV2lkdGg9JzEnIGZpbGw9J25vbmUnIGZpbGxSdWxlPSdldmVub2RkJz5cbiAgICAgICAgICAgICAgICA8ZyBpZD0nT3V0bGluZWQnIHRyYW5zZm9ybT0ndHJhbnNsYXRlKC0yMTEuMDAwMDAwLCAtMTE0LjAwMDAwMCknIGZpbGxSdWxlPSdub256ZXJvJyBmaWxsPScjRkFGQ0ZEJz5cbiAgICAgICAgICAgICAgICAgIDxnIGlkPSdvdXRsaW5lZC1sb2dvJyB0cmFuc2Zvcm09J3RyYW5zbGF0ZSgyMTEuMDAwMDAwLCAxMTMuMDAwMDAwKSc+XG4gICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9J000Ny41LDE1Mi43OTg4MjMgTDI2LjM4MjM0MzIsMTQzLjk1NDY3NiBDMjQuNTk5Mzk0MSwxNDMuMjA3OTcxIDIzLjc1OTM1MjQsMTQxLjE1NzI4MSAyNC41MDYwNTc2LDEzOS4zNzQzMzIgQzI1LjI1Mjc2MjgsMTM3LjU5MTM4MyAyNy4zMDM0NTI3LDEzNi43NTEzNDEgMjkuMDg2NDAxOCwxMzcuNDk4MDQ2IEwxMTcuNzgwMDU4LDE3NC42NDQ1NiBMMTIwLjk5MDAyMSwxNzYuMDg5MDc0IEMxMjIuNDg2ODE0LDE3Ni43NjI2NDUgMTIzLjI3OTMwNCwxNzguMzU4MjUxIDEyMi45OTg2OTgsMTc5LjkwMzU5OCBDMTIyLjk5OTU2NCwxNzkuOTM1NjI2IDEyMywxNzkuOTY3NzYyIDEyMywxODAgTDEyMywyMDUuNjM5NzIyIEwxMzguNTEwNzE2LDIxMS45MTAwMTEgTDE0My4zNjg0MjEsMjEzLjg3Mzc2NCBMMTYyLjgzMzMzMywyMDYuMDA0OTcgTDE2Mi44MzMzMzMsMTYuMjkyOTAyNSBMMTQzLDguMjc1MTcyMDQgTDEyMi44MzMzMzMsMTYuNDI3NjU0MyBMMTIyLjgzMzMzMyw1My42MDEzMjk1IEMxMjIuODM0MjE4LDUzLjY0NjY0ODkgMTIyLjgzNDIxNSw1My42OTE5MDE1IDEyMi44MzMzMzMsNTMuNzM3MDYzNCBMMTIyLjgzMzMzMyw1NCBDMTIyLjgzMzMzMyw1NS45MzI5OTY2IDEyMS4yNjYzMyw1Ny41IDExOS4zMzMzMzMsNTcuNSBDMTE5LjI4ODQzLDU3LjUgMTE5LjI0MzcyNCw1Ny40OTkxNTQ0IDExOS4xOTkyMyw1Ny40OTc0NzgyIEw1My4zMDc2MzgsODQuMDM3MTQ5IEM1MS41MTQ2MTgzLDg0Ljc1OTMzNzUgNDkuNDc1NjM5Miw4My44OTEyNTczIDQ4Ljc1MzQ1MDYsODIuMDk4MjM3NiBDNDguMDMxMjYyMSw4MC4zMDUyMTc5IDQ4Ljg5OTM0MjMsNzguMjY2MjM4OCA1MC42OTIzNjIsNzcuNTQ0MDUwMiBMMTE1LjgzMzMzMyw1MS4zMDY3MTI5IEwxMTUuODMzMzMzLDE0LjQ5NzQyMjcgQzExNS44MzMzMzMsMTQuMDE0MzE3OCAxMTUuOTMxMjEzLDEzLjU1NDA3MzkgMTE2LjEwODIyMiwxMy4xMzU0Mzk5IEMxMTYuMzc0NTM5LDEyLjA5NDEyOTIgMTE3LjExNTMyNiwxMS4xODg4NDQ5IDExOC4xODgyMzgsMTAuNzU1MTE0OCBMMTQxLjY4NDE4NiwxLjI1Njc1MjcgQzE0Mi4wOTEzMTcsMS4wOTE1MjkzNiAxNDIuNTI5NTksMS4wMDI0MDQ2NyAxNDIuOTc1OTM3LDAuOTk5MTY0NzIzIEMxNDMuNDcwNDEsMS4wMDI0MDQ2NyAxNDMuOTA4NjgzLDEuMDkxNTI5MzYgMTQ0LjMxNTgxNCwxLjI1Njc1MjcgTDE2Ny44MTE3NjIsMTAuNzU1MTE0OCBDMTY5LjUyMjk2OCwxMS40NDY4NzkgMTcwLjM4OTMyOCwxMy4zMzgxNjU5IDE2OS44MzMzMzMsMTUuMDY3NzA2OCBMMTY5LjgzMzMzMywyMDggQzE2OS44MzMzMzMsMjA4LjgyNjMwNCAxNjkuNTQ2OTksMjA5LjU4NTcyOCAxNjkuMDY4MTE4LDIxMC4xODQ0NTkgQzE2OC42OTM3MDMsMjEwLjg2NzM3OCAxNjguMDkwMTMzLDIxMS40MzAyMjQgMTY3LjMxMTc2MiwyMTEuNzQ0ODg1IEwxNDQuNTE3NjQ1LDIyMC45NTk1MjggQzE0My4zMzI1NDIsMjIxLjQzODYxMyAxNDIuMDM4OTk1LDIyMS4yMjIzOTcgMTQxLjA4OTE3OSwyMjAuNTAyNzEyIEwxMzUuODg3MTkyLDIxOC4zOTk3ODIgTDExOS40NjE1OTUsMjExLjc1OTY0NyBDMTE3LjU0NjI5LDIxMS43MzkwNTUgMTE2LDIxMC4xODAwMzIgMTE2LDIwOC4yNTk4NTMgTDExNiwyMDguMDc5MTEgQzExNS45OTg3NjcsMjA4LjAyNTcwOCAxMTUuOTk4NzYxLDIwNy45NzIxNzggMTE2LDIwNy45MTg1NTggTDExNiwxODEuNTE4NzQ4IEwxMTQuOTkxNzI3LDE4MS4wNjQ1ODkgTDU0LjUsMTU1LjczMDQ0NyBMNTQuNSwyMDYuOTk4MjczIEM1NS4xMzQxNDY4LDIwOC42NTgyNTYgNTQuNDE5NTMxNSwyMTAuNTEyOTE1IDUyLjg3OTY2NDUsMjExLjMzMzMzMyBDNTIuNTU0NTU0NiwyMTEuNTQwNzA5IDUyLjE5MjkwNCwyMTEuNjk1ODY5IDUxLjgwNjUyOTQsMjExLjc4Njk5NyBMMjkuNzg2NzM3NSwyMjAuNjUwNjU1IEMyOC44MjUyNTM1LDIyMS40Nzg3NTggMjcuNDQ1NzAwNSwyMjEuNzUzMjIxIDI2LjE4ODIzNzksMjIxLjI0NDg4NSBMMjAuMzg3MTkyMSwyMTguODk5NzgyIEwzLjMwNjI3NzgzLDIxMS45OTQ3MzEgQzEuNDYzMzgxODksMjExLjg5NDE5MiAtMi42MDgzNTk5NWUtMTYsMjEwLjM2Nzk5MiAwLDIwOC41IEwyLjcwODk0NDE4ZS0xNCwxNC40OTc0MjI3IEMyLjcyNDI0NWUtMTQsMTMuNDAxNjQ1OCAwLjUwMzU2MDk0NywxMi40MjM0ODE4IDEuMjkxODk2NjksMTEuNzgxNzE3IEMxLjY1MTcxMDE0LDExLjM0MTY1MDkgMi4xMjQwNTYyMiwxMC45ODMxODgyIDIuNjg4MjM3ODksMTAuNzU1MTE0OCBMMjYuMTg0MTg2MiwxLjI1Njc1MjcgQzI2LjU5MTMxNzIsMS4wOTE1MjkzNiAyNy4wMjk1ODk4LDEuMDAyNDA0NjcgMjcuNDc1OTM2NywwLjk5OTE2NDcyMyBDMjcuOTcwNDEwMiwxLjAwMjQwNDY3IDI4LjQwODY4MjgsMS4wOTE1MjkzNiAyOC44MTU4MTM4LDEuMjU2NzUyNyBMNTIuMzExNzYyMSwxMC43NTUxMTQ4IEM1NC4xMDM4NjI3LDExLjQ3OTU4MSA1NC45NjkzNTE0LDEzLjUxOTY2MTUgNTQuMjQ0ODg1MiwxNS4zMTE3NjIxIEM1My41MjA0MTksMTcuMTAzODYyNyA1MS40ODAzMzg1LDE3Ljk2OTM1MTQgNDkuNjg4MjM3OSwxNy4yNDQ4ODUyIEwyNy41LDguMjc1MTcyMDQgTDcsMTYuNTYyNDA2MSBMNywyMDUuOTM3NTk0IEwyMy4wMTA3MTY0LDIxMi40MTAwMTEgTDI3LjI1MjY5OTUsMjE0LjEyNDg1NSBMNDcuNSwyMDUuOTc0NjgxIEw0Ny41LDE1Mi43OTg4MjMgWicgaWQ9J0NvbWJpbmVkLVNoYXBlJyAvPlxuICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSdNMTQ2LjQ1NjgyNyw2My4wMjQxODQ5IEMxNDYuOTQ4NjAzLDY0LjcxMDQ3MjQgMTQ2LjEwNTk3Miw2Ni41MzM2NTkxIDE0NC40NDczMDUsNjcuMjI4MzE0OSBMNTkuNTQ2ODY3NywxMDIuNzg0OTA4IEwxMjAuNDE2NTc1LDEyOC4yNzczNSBDMTIyLjE5OTUyNCwxMjkuMDI0MDU1IDEyMy4wMzk1NjYsMTMxLjA3NDc0NSAxMjIuMjkyODYxLDEzMi44NTc2OTQgQzEyMS41NDYxNTYsMTM0LjY0MDY0MyAxMTkuNDk1NDY2LDEzNS40ODA2ODUgMTE3LjcxMjUxNywxMzQuNzMzOTc5IEw1MC40ODY0MTMxLDEwNi41Nzk0NTcgTDI5LjM1MjAyOTMsMTE1LjQzMDYxIEMyNy41NjkwODAyLDExNi4xNzczMTUgMjUuNTE4MzkwMywxMTUuMzM3MjczIDI0Ljc3MTY4NTEsMTEzLjU1NDMyNCBDMjQuMDI0OTgsMTExLjc3MTM3NSAyNC44NjUwMjE2LDEwOS43MjA2ODUgMjYuNjQ3OTcwNywxMDguOTczOTggTDQ3LjUsMTAwLjI0MTA3OSBMNDcuNSwxNC41IEM0Ny41LDEyLjU2NzAwMzQgNDkuMDY3MDAzNCwxMSA1MSwxMSBDNTIuOTMyOTk2NiwxMSA1NC41LDEyLjU2NzAwMzQgNTQuNSwxNC41IEw1NC41LDk3LjMwOTQ1NDggTDEzMy4zNjAyNTcsNjQuMjgyNTA5OCBMMTE3LjE4ODIzOCw1Ny43NDQ4ODUyIEMxMTUuMzk2MTM3LDU3LjAyMDQxOSAxMTQuNTMwNjQ5LDU0Ljk4MDMzODUgMTE1LjI1NTExNSw1My4xODgyMzc5IEMxMTUuOTc5NTgxLDUxLjM5NjEzNzMgMTE4LjAxOTY2MSw1MC41MzA2NDg2IDExOS44MTE3NjIsNTEuMjU1MTE0OCBMMTM5LjUsNTkuMjE0MTg5NyBMMTM5LjUsMjUuODYwMjc4NCBMMTM1Ljg4NzE5MiwyNC4zOTk3ODE2IEwxMTguMTg4MjM4LDE3LjI0NDg4NTIgQzExNi4zOTYxMzcsMTYuNTIwNDE5IDExNS41MzA2NDksMTQuNDgwMzM4NSAxMTYuMjU1MTE1LDEyLjY4ODIzNzkgQzExNi45Nzk1ODEsMTAuODk2MTM3MyAxMTkuMDE5NjYxLDEwLjAzMDY0ODYgMTIwLjgxMTc2MiwxMC43NTUxMTQ4IEwxMzguNTEwNzE2LDE3LjkxMDAxMTIgTDE0My4zNjg0MjEsMTkuODczNzY0MSBMMTY0LjY4ODIzOCwxMS4yNTUxMTQ4IEMxNjYuNDgwMzM5LDEwLjUzMDY0ODYgMTY4LjUyMDQxOSwxMS4zOTYxMzczIDE2OS4yNDQ4ODUsMTMuMTg4MjM3OSBDMTY5Ljk2OTM1MSwxNC45ODAzMzg1IDE2OS4xMDM4NjMsMTcuMDIwNDE5IDE2Ny4zMTE3NjIsMTcuNzQ0ODg1MiBMMTQ2LjUsMjYuMTU4MTUwOCBMMTQ2LjUsNjIuNDcyODc0OSBDMTQ2LjUsNjIuNjYwNDU3NCAxNDYuNDg1MjQzLDYyLjg0NDU5MzMgMTQ2LjQ1NjgyNyw2My4wMjQxODQ5IFonIGlkPSdDb21iaW5lZC1TaGFwZScgLz5cbiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0nTTEzOS41LDk2LjMzMDgwNjkgTDEyMi44MzMzMzMsMTAzLjMxMDg2NCBMMTIyLjgzMzMzMywxNTEuMzcyNzk5IEMxMjIuODMzMzMzLDE1My4zMDU3OTUgMTIxLjI2NjMzLDE1NC44NzI3OTkgMTE5LjMzMzMzMywxNTQuODcyNzk5IEMxMTguNTM1NzE5LDE1NC44NzI3OTkgMTE3LjgwMDQyLDE1NC42MDU5OTQgMTE3LjIxMTgxNiwxNTQuMTU2NzYzIEwyNi42NDc5NzA3LDExNi4yMjgzMTUgQzI2LjA5NzY3MDYsMTE1Ljk5Nzg0NyAyNS42MzcxOTQsMTE1LjY0MzE1OSAyNS4yODU0NzE0LDExNS4yMTA0NjIgQzI0LjUwMDgyNTgsMTE0LjU2ODYyIDI0LDExMy41OTI3OTcgMjQsMTEyLjUgTDI0LDI1Ljg2MDI3ODQgTDIwLjM4NzE5MjEsMjQuMzk5NzgxNiBMMi42ODgyMzc4OSwxNy4yNDQ4ODUyIEMwLjg5NjEzNzI1OCwxNi41MjA0MTkgMC4wMzA2NDg1NTg5LDE0LjQ4MDMzODUgMC43NTUxMTQ3NywxMi42ODgyMzc5IEMxLjQ3OTU4MDk4LDEwLjg5NjEzNzMgMy41MTk2NjE0OSwxMC4wMzA2NDg2IDUuMzExNzYyMTEsMTAuNzU1MTE0OCBMMjMuMDEwNzE2NCwxNy45MTAwMTEyIEwyNy44Njg0MjExLDE5Ljg3Mzc2NDEgTDQ5LjE4ODIzNzksMTEuMjU1MTE0OCBDNTAuOTgwMzM4NSwxMC41MzA2NDg2IDUzLjAyMDQxOSwxMS4zOTYxMzczIDUzLjc0NDg4NTIsMTMuMTg4MjM3OSBDNTQuNDY5MzUxNCwxNC45ODAzMzg1IDUzLjYwMzg2MjcsMTcuMDIwNDE5IDUxLjgxMTc2MjEsMTcuNzQ0ODg1MiBMMzEsMjYuMTU4MTUwOCBMMzEsMTEwLjQ2MTg2MSBMMTE1LjgzMzMzMywxNDUuOTkwMzUxIEwxMTUuODMzMzMzLDEwNi4yNDI0ODggTDg0LjI1OTY2MTYsMTE5LjQ2NTY0OSBDODIuNDc2NzEyNSwxMjAuMjEyMzU1IDgwLjQyNjAyMjYsMTE5LjM3MjMxMyA3OS42NzkzMTc0LDExNy41ODkzNjQgQzc4LjkzMjYxMjMsMTE1LjgwNjQxNSA3OS43NzI2NTM5LDExMy43NTU3MjUgODEuNTU1NjAzLDExMy4wMDkwMiBMMTQxLjA1MjE1MSw4OC4wOTE2NjIyIEMxNDEuNjA4OTc0LDg3LjcxNzk5MyAxNDIuMjc5MDMsODcuNSAxNDMsODcuNSBDMTQ0LjkzMjk5Nyw4Ny41IDE0Ni41LDg5LjA2NzAwMzQgMTQ2LjUsOTEgTDE0Ni41LDIxNy42MzA0OCBDMTQ2LjUsMjE5LjU2MzQ3NyAxNDQuOTMyOTk3LDIyMS4xMzA0OCAxNDMsMjIxLjEzMDQ4IEMxNDEuMDY3MDAzLDIyMS4xMzA0OCAxMzkuNSwyMTkuNTYzNDc3IDEzOS41LDIxNy42MzA0OCBMMTM5LjUsOTYuMzMwODA2OSBaIE0zMSwxNDEgTDMxLDIxNy4wNTUyMzcgQzMxLDIxOC45ODgyMzQgMjkuNDMyOTk2NiwyMjAuNTU1MjM3IDI3LjUsMjIwLjU1NTIzNyBDMjUuNTY3MDAzNCwyMjAuNTU1MjM3IDI0LDIxOC45ODgyMzQgMjQsMjE3LjA1NTIzNyBMMjQsMTQxIEMyNCwxMzkuMDY3MDAzIDI1LjU2NzAwMzQsMTM3LjUgMjcuNSwxMzcuNSBDMjkuNDMyOTk2NiwxMzcuNSAzMSwxMzkuMDY3MDAzIDMxLDE0MSBaJyBpZD0nQ29tYmluZWQtU2hhcGUnIC8+XG4gICAgICAgICAgICAgICAgICA8L2c+XG4gICAgICAgICAgICAgICAgPC9nPlxuICAgICAgICAgICAgICA8L2c+XG4gICAgICAgICAgICA8L3N2Zz5cbiAgICAgICAgICAgIDxiciAvPlxuICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgY29sb3I6ICcjRkFGQ0ZEJywgZGlzcGxheTogJ2lubGluZS1ibG9jaycsIHdpZHRoOiAnMTAwJScsIGhlaWdodDogNTAsIHBvc2l0aW9uOiAnYWJzb2x1dGUnLCBib3R0b206IDUwLCBsZWZ0OiAwIH19Pnt0aGlzLnN0YXRlLnNvZnR3YXJlVmVyc2lvbn08L3NwYW4+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyICgpIHtcbiAgICBpZiAodGhpcy5zdGF0ZS5yZWFkeUZvckF1dGggJiYgKCF0aGlzLnN0YXRlLmlzVXNlckF1dGhlbnRpY2F0ZWQgfHwgIXRoaXMuc3RhdGUudXNlcm5hbWUpKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8U3R5bGVSb290PlxuICAgICAgICAgIDxBdXRoZW50aWNhdGlvblVJXG4gICAgICAgICAgICBvblN1Ym1pdD17dGhpcy5hdXRoZW50aWNhdGVVc2VyfVxuICAgICAgICAgICAgb25TdWJtaXRTdWNjZXNzPXt0aGlzLmF1dGhlbnRpY2F0aW9uQ29tcGxldGV9XG4gICAgICAgICAgICB7Li4udGhpcy5wcm9wc30gLz5cbiAgICAgICAgPC9TdHlsZVJvb3Q+XG4gICAgICApXG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLnN0YXRlLmlzVXNlckF1dGhlbnRpY2F0ZWQgfHwgIXRoaXMuc3RhdGUudXNlcm5hbWUpIHtcbiAgICAgIHJldHVybiB0aGlzLnJlbmRlclN0YXJ0dXBEZWZhdWx0U2NyZWVuKClcbiAgICB9XG5cbiAgICBpZiAodGhpcy5zdGF0ZS5kYXNoYm9hcmRWaXNpYmxlKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIDxQcm9qZWN0QnJvd3NlclxuICAgICAgICAgICAgbG9hZFByb2plY3RzPXt0aGlzLmxvYWRQcm9qZWN0c31cbiAgICAgICAgICAgIGxhdW5jaFByb2plY3Q9e3RoaXMubGF1bmNoUHJvamVjdH1cbiAgICAgICAgICAgIGNyZWF0ZU5vdGljZT17dGhpcy5jcmVhdGVOb3RpY2V9XG4gICAgICAgICAgICByZW1vdmVOb3RpY2U9e3RoaXMucmVtb3ZlTm90aWNlfVxuICAgICAgICAgICAgbm90aWNlcz17dGhpcy5zdGF0ZS5ub3RpY2VzfVxuICAgICAgICAgICAgZW52b3k9e3RoaXMuZW52b3l9XG4gICAgICAgICAgICB7Li4udGhpcy5wcm9wc30gLz5cbiAgICAgICAgICA8VG91ciBwcm9qZWN0c0xpc3Q9e3RoaXMuc3RhdGUucHJvamVjdHNMaXN0fSBlbnZveT17dGhpcy5lbnZveX0gc3RhcnRUb3VyT25Nb3VudCAvPlxuICAgICAgICAgIDxBdXRvVXBkYXRlciBvbkF1dG9VcGRhdGVDaGVja0NvbXBsZXRlPXt0aGlzLm9uQXV0b1VwZGF0ZUNoZWNrQ29tcGxldGV9IHNob3VsZERpc3BsYXk9eyF0aGlzLnN0YXRlLmhhc0NoZWNrZWRGb3JVcGRhdGVzfSAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIClcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuc3RhdGUucHJvamVjdEZvbGRlcikge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdj5cbiAgICAgICAgICA8VG91ciBwcm9qZWN0c0xpc3Q9e3RoaXMuc3RhdGUucHJvamVjdHNMaXN0fSBlbnZveT17dGhpcy5lbnZveX0gLz5cbiAgICAgICAgICA8QXV0b1VwZGF0ZXIgb25BdXRvVXBkYXRlQ2hlY2tDb21wbGV0ZT17dGhpcy5vbkF1dG9VcGRhdGVDaGVja0NvbXBsZXRlfSBzaG91bGREaXNwbGF5PXshdGhpcy5zdGF0ZS5oYXNDaGVja2VkRm9yVXBkYXRlc30gLz5cbiAgICAgICAgICA8UHJvamVjdEJyb3dzZXJcbiAgICAgICAgICAgIGxvYWRQcm9qZWN0cz17dGhpcy5sb2FkUHJvamVjdHN9XG4gICAgICAgICAgICBsYXVuY2hQcm9qZWN0PXt0aGlzLmxhdW5jaFByb2plY3R9XG4gICAgICAgICAgICBjcmVhdGVOb3RpY2U9e3RoaXMuY3JlYXRlTm90aWNlfVxuICAgICAgICAgICAgcmVtb3ZlTm90aWNlPXt0aGlzLnJlbW92ZU5vdGljZX1cbiAgICAgICAgICAgIG5vdGljZXM9e3RoaXMuc3RhdGUubm90aWNlc31cbiAgICAgICAgICAgIGVudm95PXt0aGlzLmVudm95fVxuICAgICAgICAgICAgey4uLnRoaXMucHJvcHN9IC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKVxuICAgIH1cblxuICAgIGlmICghdGhpcy5zdGF0ZS5hcHBsaWNhdGlvbkltYWdlIHx8IHRoaXMuc3RhdGUuZm9sZGVyTG9hZGluZ0Vycm9yKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IHN0eWxlPXt7IHBvc2l0aW9uOiAnYWJzb2x1dGUnLCB3aWR0aDogJzEwMCUnLCBoZWlnaHQ6ICcxMDAlJyB9fT5cbiAgICAgICAgICA8UmVhY3RDU1NUcmFuc2l0aW9uR3JvdXBcbiAgICAgICAgICAgIHRyYW5zaXRpb25OYW1lPSd0b2FzdCdcbiAgICAgICAgICAgIHRyYW5zaXRpb25FbnRlclRpbWVvdXQ9ezUwMH1cbiAgICAgICAgICAgIHRyYW5zaXRpb25MZWF2ZVRpbWVvdXQ9ezMwMH0+XG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt7cG9zaXRpb246ICdhYnNvbHV0ZScsIHJpZ2h0OiAwLCB0b3A6IDAsIHdpZHRoOiAzMDB9fT5cbiAgICAgICAgICAgICAge2xvZGFzaC5tYXAodGhpcy5zdGF0ZS5ub3RpY2VzLCB0aGlzLnJlbmRlck5vdGlmaWNhdGlvbnMpfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9SZWFjdENTU1RyYW5zaXRpb25Hcm91cD5cbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7IHBvc2l0aW9uOiAncmVsYXRpdmUnLCB3aWR0aDogJzEwMCUnLCBoZWlnaHQ6ICcxMDAlJyB9fT5cbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgcG9zaXRpb246ICdhYnNvbHV0ZScsIHRvcDogJzUwJScsIGxlZnQ6ICc1MCUnLCB0cmFuc2Zvcm06ICd0cmFuc2xhdGUoLTUwJSwgLTUwJSknIH19PlxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBmb250U2l6ZTogMjQsIGNvbG9yOiAnIzIyMicgfX0+TG9hZGluZyBwcm9qZWN0Li4uPC9zcGFuPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKVxuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IHN0eWxlPXt7IHBvc2l0aW9uOiAncmVsYXRpdmUnLCB3aWR0aDogJzEwMCUnLCBoZWlnaHQ6ICcxMDAlJyB9fT5cbiAgICAgICAgPEF1dG9VcGRhdGVyIG9uQXV0b1VwZGF0ZUNoZWNrQ29tcGxldGU9e3RoaXMub25BdXRvVXBkYXRlQ2hlY2tDb21wbGV0ZX0gc2hvdWxkRGlzcGxheT17IXRoaXMuc3RhdGUuaGFzQ2hlY2tlZEZvclVwZGF0ZXN9IC8+XG4gICAgICAgIDxUb3VyIHByb2plY3RzTGlzdD17dGhpcy5zdGF0ZS5wcm9qZWN0c0xpc3R9IGVudm95PXt0aGlzLmVudm95fSAvPlxuICAgICAgICA8ZGl2IHN0eWxlPXt7IHBvc2l0aW9uOiAnYWJzb2x1dGUnLCB3aWR0aDogJzEwMCUnLCBoZWlnaHQ6ICcxMDAlJywgdG9wOiAwLCBsZWZ0OiAwIH19PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdsYXlvdXQtYm94JyBzdHlsZT17e292ZXJmbG93OiAndmlzaWJsZSd9fT5cbiAgICAgICAgICAgIDxSZWFjdENTU1RyYW5zaXRpb25Hcm91cFxuICAgICAgICAgICAgICB0cmFuc2l0aW9uTmFtZT0ndG9hc3QnXG4gICAgICAgICAgICAgIHRyYW5zaXRpb25FbnRlclRpbWVvdXQ9ezUwMH1cbiAgICAgICAgICAgICAgdHJhbnNpdGlvbkxlYXZlVGltZW91dD17MzAwfT5cbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17e3Bvc2l0aW9uOiAnYWJzb2x1dGUnLCByaWdodDogMCwgdG9wOiAwLCB3aWR0aDogMzAwfX0+XG4gICAgICAgICAgICAgICAge2xvZGFzaC5tYXAodGhpcy5zdGF0ZS5ub3RpY2VzLCB0aGlzLnJlbmRlck5vdGlmaWNhdGlvbnMpfVxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvUmVhY3RDU1NUcmFuc2l0aW9uR3JvdXA+XG4gICAgICAgICAgICA8U3BsaXRQYW5lIG9uRHJhZ0ZpbmlzaGVkPXt0aGlzLmhhbmRsZVBhbmVSZXNpemUuYmluZCh0aGlzKX0gc3BsaXQ9J2hvcml6b250YWwnIG1pblNpemU9ezMwMH0gZGVmYXVsdFNpemU9e3RoaXMucHJvcHMuaGVpZ2h0ICogMC42Mn0+XG4gICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgPFNwbGl0UGFuZSBvbkRyYWdGaW5pc2hlZD17dGhpcy5oYW5kbGVQYW5lUmVzaXplLmJpbmQodGhpcyl9IHNwbGl0PSd2ZXJ0aWNhbCcgbWluU2l6ZT17MzAwfSBkZWZhdWx0U2l6ZT17MzAwfT5cbiAgICAgICAgICAgICAgICAgIDxTaWRlQmFyXG4gICAgICAgICAgICAgICAgICAgIHNldERhc2hib2FyZFZpc2liaWxpdHk9e3RoaXMuc2V0RGFzaGJvYXJkVmlzaWJpbGl0eS5iaW5kKHRoaXMpfVxuICAgICAgICAgICAgICAgICAgICBzd2l0Y2hBY3RpdmVOYXY9e3RoaXMuc3dpdGNoQWN0aXZlTmF2LmJpbmQodGhpcyl9XG4gICAgICAgICAgICAgICAgICAgIGFjdGl2ZU5hdj17dGhpcy5zdGF0ZS5hY3RpdmVOYXZ9PlxuICAgICAgICAgICAgICAgICAgICB7dGhpcy5zdGF0ZS5hY3RpdmVOYXYgPT09ICdsaWJyYXJ5J1xuICAgICAgICAgICAgICAgICAgICAgID8gPExpYnJhcnlcbiAgICAgICAgICAgICAgICAgICAgICAgIGxheW91dD17dGhpcy5sYXlvdXR9XG4gICAgICAgICAgICAgICAgICAgICAgICBmb2xkZXI9e3RoaXMuc3RhdGUucHJvamVjdEZvbGRlcn1cbiAgICAgICAgICAgICAgICAgICAgICAgIGhhaWt1PXt0aGlzLnByb3BzLmhhaWt1fVxuICAgICAgICAgICAgICAgICAgICAgICAgd2Vic29ja2V0PXt0aGlzLnByb3BzLndlYnNvY2tldH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHRvdXJDaGFubmVsPXt0aGlzLnRvdXJDaGFubmVsfVxuICAgICAgICAgICAgICAgICAgICAgICAgb25EcmFnRW5kPXt0aGlzLm9uTGlicmFyeURyYWdFbmQuYmluZCh0aGlzKX1cbiAgICAgICAgICAgICAgICAgICAgICAgIG9uRHJhZ1N0YXJ0PXt0aGlzLm9uTGlicmFyeURyYWdTdGFydC5iaW5kKHRoaXMpfVxuICAgICAgICAgICAgICAgICAgICAgICAgY3JlYXRlTm90aWNlPXt0aGlzLmNyZWF0ZU5vdGljZX1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJlbW92ZU5vdGljZT17dGhpcy5yZW1vdmVOb3RpY2V9IC8+XG4gICAgICAgICAgICAgICAgICAgICAgOiA8U3RhdGVJbnNwZWN0b3JcbiAgICAgICAgICAgICAgICAgICAgICAgIGNyZWF0ZU5vdGljZT17dGhpcy5jcmVhdGVOb3RpY2V9XG4gICAgICAgICAgICAgICAgICAgICAgICByZW1vdmVOb3RpY2U9e3RoaXMucmVtb3ZlTm90aWNlfVxuICAgICAgICAgICAgICAgICAgICAgICAgZm9sZGVyPXt0aGlzLnN0YXRlLnByb2plY3RGb2xkZXJ9XG4gICAgICAgICAgICAgICAgICAgICAgICB3ZWJzb2NrZXQ9e3RoaXMucHJvcHMud2Vic29ja2V0fVxuICAgICAgICAgICAgICAgICAgICAgICAgdG91ckNoYW5uZWw9e3RoaXMudG91ckNoYW5uZWx9IC8+XG4gICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgPC9TaWRlQmFyPlxuICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17e3Bvc2l0aW9uOiAncmVsYXRpdmUnLCB3aWR0aDogJzEwMCUnLCBoZWlnaHQ6ICcxMDAlJ319PlxuICAgICAgICAgICAgICAgICAgICA8U3RhZ2VcbiAgICAgICAgICAgICAgICAgICAgICByZWY9J3N0YWdlJ1xuICAgICAgICAgICAgICAgICAgICAgIGZvbGRlcj17dGhpcy5zdGF0ZS5wcm9qZWN0Rm9sZGVyfVxuICAgICAgICAgICAgICAgICAgICAgIGVudm95PXt0aGlzLmVudm95fVxuICAgICAgICAgICAgICAgICAgICAgIGhhaWt1PXt0aGlzLnByb3BzLmhhaWt1fVxuICAgICAgICAgICAgICAgICAgICAgIHdlYnNvY2tldD17dGhpcy5wcm9wcy53ZWJzb2NrZXR9XG4gICAgICAgICAgICAgICAgICAgICAgcHJvamVjdD17dGhpcy5zdGF0ZS5wcm9qZWN0T2JqZWN0fVxuICAgICAgICAgICAgICAgICAgICAgIGNyZWF0ZU5vdGljZT17dGhpcy5jcmVhdGVOb3RpY2V9XG4gICAgICAgICAgICAgICAgICAgICAgcmVtb3ZlTm90aWNlPXt0aGlzLnJlbW92ZU5vdGljZX1cbiAgICAgICAgICAgICAgICAgICAgICByZWNlaXZlUHJvamVjdEluZm89e3RoaXMucmVjZWl2ZVByb2plY3RJbmZvfVxuICAgICAgICAgICAgICAgICAgICAgIG9yZ2FuaXphdGlvbk5hbWU9e3RoaXMuc3RhdGUub3JnYW5pemF0aW9uTmFtZX1cbiAgICAgICAgICAgICAgICAgICAgICBhdXRoVG9rZW49e3RoaXMuc3RhdGUuYXV0aFRva2VufVxuICAgICAgICAgICAgICAgICAgICAgIHVzZXJuYW1lPXt0aGlzLnN0YXRlLnVzZXJuYW1lfVxuICAgICAgICAgICAgICAgICAgICAgIHBhc3N3b3JkPXt0aGlzLnN0YXRlLnBhc3N3b3JkfSAvPlxuICAgICAgICAgICAgICAgICAgICB7KHRoaXMuc3RhdGUubGlicmFyeUl0ZW1EcmFnZ2luZylcbiAgICAgICAgICAgICAgICAgICAgICA/IDxkaXYgc3R5bGU9e3sgd2lkdGg6ICcxMDAlJywgaGVpZ2h0OiAnMTAwJScsIGJhY2tncm91bmRDb2xvcjogJ3doaXRlJywgb3BhY2l0eTogMC4wMSwgcG9zaXRpb246ICdhYnNvbHV0ZScsIHRvcDogMCwgbGVmdDogMCB9fSAvPlxuICAgICAgICAgICAgICAgICAgICAgIDogJycgfVxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9TcGxpdFBhbmU+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8VGltZWxpbmVcbiAgICAgICAgICAgICAgICByZWY9J3RpbWVsaW5lJ1xuICAgICAgICAgICAgICAgIGZvbGRlcj17dGhpcy5zdGF0ZS5wcm9qZWN0Rm9sZGVyfVxuICAgICAgICAgICAgICAgIGVudm95PXt0aGlzLmVudm95fVxuICAgICAgICAgICAgICAgIGhhaWt1PXt0aGlzLnByb3BzLmhhaWt1fVxuICAgICAgICAgICAgICAgIGNyZWF0ZU5vdGljZT17dGhpcy5jcmVhdGVOb3RpY2V9XG4gICAgICAgICAgICAgICAgcmVtb3ZlTm90aWNlPXt0aGlzLnJlbW92ZU5vdGljZX0gLz5cbiAgICAgICAgICAgIDwvU3BsaXRQYW5lPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxufVxuIl19