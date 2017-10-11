'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _jsxFileName = 'src/react/Creator.js';

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
    combokeys.bind('command+option+i', _lodash2.default.debounce(function () {
      _this.props.websocket.send({ method: 'toggleDevTools', params: [_this.state.projectFolder] });
    }, 500, { leading: true }));
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
    value: function handleFindElementCoordinates(_ref) {
      var selector = _ref.selector,
          webview = _ref.webview;

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
          lineNumber: 368
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
            lineNumber: 539
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
              lineNumber: 540
            },
            __self: this
          },
          _react2.default.createElement(
            'div',
            { style: { position: 'absolute', right: 0, top: 0, width: 300 }, __source: {
                fileName: _jsxFileName,
                lineNumber: 544
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
              lineNumber: 548
            },
            __self: this
          },
          _react2.default.createElement(
            'div',
            { style: { display: 'table-cell', width: '100%', height: '100%', verticalAlign: 'middle', textAlign: 'center' }, __source: {
                fileName: _jsxFileName,
                lineNumber: 549
              },
              __self: this
            },
            _react2.default.createElement(
              'svg',
              { width: '170px', height: '221px', viewBox: '0 0 170 221', version: '1.1', __source: {
                  fileName: _jsxFileName,
                  lineNumber: 550
                },
                __self: this
              },
              _react2.default.createElement(
                'g',
                { id: 'Page-1', stroke: 'none', strokeWidth: '1', fill: 'none', fillRule: 'evenodd', __source: {
                    fileName: _jsxFileName,
                    lineNumber: 551
                  },
                  __self: this
                },
                _react2.default.createElement(
                  'g',
                  { id: 'Outlined', transform: 'translate(-211.000000, -114.000000)', fillRule: 'nonzero', fill: '#FAFCFD', __source: {
                      fileName: _jsxFileName,
                      lineNumber: 552
                    },
                    __self: this
                  },
                  _react2.default.createElement(
                    'g',
                    { id: 'outlined-logo', transform: 'translate(211.000000, 113.000000)', __source: {
                        fileName: _jsxFileName,
                        lineNumber: 553
                      },
                      __self: this
                    },
                    _react2.default.createElement('path', { d: 'M47.5,152.798823 L26.3823432,143.954676 C24.5993941,143.207971 23.7593524,141.157281 24.5060576,139.374332 C25.2527628,137.591383 27.3034527,136.751341 29.0864018,137.498046 L117.780058,174.64456 L120.990021,176.089074 C122.486814,176.762645 123.279304,178.358251 122.998698,179.903598 C122.999564,179.935626 123,179.967762 123,180 L123,205.639722 L138.510716,211.910011 L143.368421,213.873764 L162.833333,206.00497 L162.833333,16.2929025 L143,8.27517204 L122.833333,16.4276543 L122.833333,53.6013295 C122.834218,53.6466489 122.834215,53.6919015 122.833333,53.7370634 L122.833333,54 C122.833333,55.9329966 121.26633,57.5 119.333333,57.5 C119.28843,57.5 119.243724,57.4991544 119.19923,57.4974782 L53.307638,84.037149 C51.5146183,84.7593375 49.4756392,83.8912573 48.7534506,82.0982376 C48.0312621,80.3052179 48.8993423,78.2662388 50.692362,77.5440502 L115.833333,51.3067129 L115.833333,14.4974227 C115.833333,14.0143178 115.931213,13.5540739 116.108222,13.1354399 C116.374539,12.0941292 117.115326,11.1888449 118.188238,10.7551148 L141.684186,1.2567527 C142.091317,1.09152936 142.52959,1.00240467 142.975937,0.999164723 C143.47041,1.00240467 143.908683,1.09152936 144.315814,1.2567527 L167.811762,10.7551148 C169.522968,11.446879 170.389328,13.3381659 169.833333,15.0677068 L169.833333,208 C169.833333,208.826304 169.54699,209.585728 169.068118,210.184459 C168.693703,210.867378 168.090133,211.430224 167.311762,211.744885 L144.517645,220.959528 C143.332542,221.438613 142.038995,221.222397 141.089179,220.502712 L135.887192,218.399782 L119.461595,211.759647 C117.54629,211.739055 116,210.180032 116,208.259853 L116,208.07911 C115.998767,208.025708 115.998761,207.972178 116,207.918558 L116,181.518748 L114.991727,181.064589 L54.5,155.730447 L54.5,206.998273 C55.1341468,208.658256 54.4195315,210.512915 52.8796645,211.333333 C52.5545546,211.540709 52.192904,211.695869 51.8065294,211.786997 L29.7867375,220.650655 C28.8252535,221.478758 27.4457005,221.753221 26.1882379,221.244885 L20.3871921,218.899782 L3.30627783,211.994731 C1.46338189,211.894192 -2.60835995e-16,210.367992 0,208.5 L2.70894418e-14,14.4974227 C2.724245e-14,13.4016458 0.503560947,12.4234818 1.29189669,11.781717 C1.65171014,11.3416509 2.12405622,10.9831882 2.68823789,10.7551148 L26.1841862,1.2567527 C26.5913172,1.09152936 27.0295898,1.00240467 27.4759367,0.999164723 C27.9704102,1.00240467 28.4086828,1.09152936 28.8158138,1.2567527 L52.3117621,10.7551148 C54.1038627,11.479581 54.9693514,13.5196615 54.2448852,15.3117621 C53.520419,17.1038627 51.4803385,17.9693514 49.6882379,17.2448852 L27.5,8.27517204 L7,16.5624061 L7,205.937594 L23.0107164,212.410011 L27.2526995,214.124855 L47.5,205.974681 L47.5,152.798823 Z', id: 'Combined-Shape', __source: {
                        fileName: _jsxFileName,
                        lineNumber: 554
                      },
                      __self: this
                    }),
                    _react2.default.createElement('path', { d: 'M146.456827,63.0241849 C146.948603,64.7104724 146.105972,66.5336591 144.447305,67.2283149 L59.5468677,102.784908 L120.416575,128.27735 C122.199524,129.024055 123.039566,131.074745 122.292861,132.857694 C121.546156,134.640643 119.495466,135.480685 117.712517,134.733979 L50.4864131,106.579457 L29.3520293,115.43061 C27.5690802,116.177315 25.5183903,115.337273 24.7716851,113.554324 C24.02498,111.771375 24.8650216,109.720685 26.6479707,108.97398 L47.5,100.241079 L47.5,14.5 C47.5,12.5670034 49.0670034,11 51,11 C52.9329966,11 54.5,12.5670034 54.5,14.5 L54.5,97.3094548 L133.360257,64.2825098 L117.188238,57.7448852 C115.396137,57.020419 114.530649,54.9803385 115.255115,53.1882379 C115.979581,51.3961373 118.019661,50.5306486 119.811762,51.2551148 L139.5,59.2141897 L139.5,25.8602784 L135.887192,24.3997816 L118.188238,17.2448852 C116.396137,16.520419 115.530649,14.4803385 116.255115,12.6882379 C116.979581,10.8961373 119.019661,10.0306486 120.811762,10.7551148 L138.510716,17.9100112 L143.368421,19.8737641 L164.688238,11.2551148 C166.480339,10.5306486 168.520419,11.3961373 169.244885,13.1882379 C169.969351,14.9803385 169.103863,17.020419 167.311762,17.7448852 L146.5,26.1581508 L146.5,62.4728749 C146.5,62.6604574 146.485243,62.8445933 146.456827,63.0241849 Z', id: 'Combined-Shape', __source: {
                        fileName: _jsxFileName,
                        lineNumber: 555
                      },
                      __self: this
                    }),
                    _react2.default.createElement('path', { d: 'M139.5,96.3308069 L122.833333,103.310864 L122.833333,151.372799 C122.833333,153.305795 121.26633,154.872799 119.333333,154.872799 C118.535719,154.872799 117.80042,154.605994 117.211816,154.156763 L26.6479707,116.228315 C26.0976706,115.997847 25.637194,115.643159 25.2854714,115.210462 C24.5008258,114.56862 24,113.592797 24,112.5 L24,25.8602784 L20.3871921,24.3997816 L2.68823789,17.2448852 C0.896137258,16.520419 0.0306485589,14.4803385 0.75511477,12.6882379 C1.47958098,10.8961373 3.51966149,10.0306486 5.31176211,10.7551148 L23.0107164,17.9100112 L27.8684211,19.8737641 L49.1882379,11.2551148 C50.9803385,10.5306486 53.020419,11.3961373 53.7448852,13.1882379 C54.4693514,14.9803385 53.6038627,17.020419 51.8117621,17.7448852 L31,26.1581508 L31,110.461861 L115.833333,145.990351 L115.833333,106.242488 L84.2596616,119.465649 C82.4767125,120.212355 80.4260226,119.372313 79.6793174,117.589364 C78.9326123,115.806415 79.7726539,113.755725 81.555603,113.00902 L141.052151,88.0916622 C141.608974,87.717993 142.27903,87.5 143,87.5 C144.932997,87.5 146.5,89.0670034 146.5,91 L146.5,217.63048 C146.5,219.563477 144.932997,221.13048 143,221.13048 C141.067003,221.13048 139.5,219.563477 139.5,217.63048 L139.5,96.3308069 Z M31,141 L31,217.055237 C31,218.988234 29.4329966,220.555237 27.5,220.555237 C25.5670034,220.555237 24,218.988234 24,217.055237 L24,141 C24,139.067003 25.5670034,137.5 27.5,137.5 C29.4329966,137.5 31,139.067003 31,141 Z', id: 'Combined-Shape', __source: {
                        fileName: _jsxFileName,
                        lineNumber: 556
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
                lineNumber: 561
              },
              __self: this
            }),
            _react2.default.createElement(
              'span',
              { style: { color: '#FAFCFD', display: 'inline-block', width: '100%', height: 50, position: 'absolute', bottom: 50, left: 0 }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 562
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
              lineNumber: 572
            },
            __self: this
          },
          _react2.default.createElement(_AuthenticationUI2.default, Object.assign({
            onSubmit: this.authenticateUser,
            onSubmitSuccess: this.authenticationComplete
          }, this.props, {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 573
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
              lineNumber: 587
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
              lineNumber: 588
            },
            __self: this
          })),
          _react2.default.createElement(_Tour2.default, { projectsList: this.state.projectsList, envoy: this.envoy, startTourOnMount: true, __source: {
              fileName: _jsxFileName,
              lineNumber: 596
            },
            __self: this
          }),
          _react2.default.createElement(_AutoUpdater2.default, { onAutoUpdateCheckComplete: this.onAutoUpdateCheckComplete, shouldDisplay: !this.state.hasCheckedForUpdates, __source: {
              fileName: _jsxFileName,
              lineNumber: 597
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
              lineNumber: 604
            },
            __self: this
          },
          _react2.default.createElement(_Tour2.default, { projectsList: this.state.projectsList, envoy: this.envoy, __source: {
              fileName: _jsxFileName,
              lineNumber: 605
            },
            __self: this
          }),
          _react2.default.createElement(_AutoUpdater2.default, { onAutoUpdateCheckComplete: this.onAutoUpdateCheckComplete, shouldDisplay: !this.state.hasCheckedForUpdates, __source: {
              fileName: _jsxFileName,
              lineNumber: 606
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
              lineNumber: 607
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
              lineNumber: 621
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
                lineNumber: 622
              },
              __self: this
            },
            _react2.default.createElement(
              'div',
              { style: { position: 'absolute', right: 0, top: 0, width: 300 }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 626
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
                lineNumber: 630
              },
              __self: this
            },
            _react2.default.createElement(
              'div',
              { style: { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 631
                },
                __self: this
              },
              _react2.default.createElement(
                'span',
                { style: { fontSize: 24, color: '#222' }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 632
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
            lineNumber: 640
          },
          __self: this
        },
        _react2.default.createElement(_AutoUpdater2.default, { onAutoUpdateCheckComplete: this.onAutoUpdateCheckComplete, shouldDisplay: !this.state.hasCheckedForUpdates, __source: {
            fileName: _jsxFileName,
            lineNumber: 641
          },
          __self: this
        }),
        _react2.default.createElement(_Tour2.default, { projectsList: this.state.projectsList, envoy: this.envoy, __source: {
            fileName: _jsxFileName,
            lineNumber: 642
          },
          __self: this
        }),
        _react2.default.createElement(
          'div',
          { style: { position: 'absolute', width: '100%', height: '100%', top: 0, left: 0 }, __source: {
              fileName: _jsxFileName,
              lineNumber: 643
            },
            __self: this
          },
          _react2.default.createElement(
            'div',
            { className: 'layout-box', style: { overflow: 'visible' }, __source: {
                fileName: _jsxFileName,
                lineNumber: 644
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
                  lineNumber: 645
                },
                __self: this
              },
              _react2.default.createElement(
                'div',
                { style: { position: 'absolute', right: 0, top: 0, width: 300 }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 649
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
                  lineNumber: 653
                },
                __self: this
              },
              _react2.default.createElement(
                'div',
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 654
                  },
                  __self: this
                },
                _react2.default.createElement(
                  _reactSplitPane2.default,
                  { onDragFinished: this.handlePaneResize.bind(this), split: 'vertical', minSize: 300, defaultSize: 300, __source: {
                      fileName: _jsxFileName,
                      lineNumber: 655
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
                        lineNumber: 656
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
                        lineNumber: 661
                      },
                      __self: this
                    }) : _react2.default.createElement(_StateInspector2.default, {
                      createNotice: this.createNotice,
                      removeNotice: this.removeNotice,
                      folder: this.state.projectFolder,
                      websocket: this.props.websocket,
                      tourChannel: this.tourChannel, __source: {
                        fileName: _jsxFileName,
                        lineNumber: 671
                      },
                      __self: this
                    })
                  ),
                  _react2.default.createElement(
                    'div',
                    { style: { position: 'relative', width: '100%', height: '100%' }, __source: {
                        fileName: _jsxFileName,
                        lineNumber: 679
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
                        lineNumber: 680
                      },
                      __self: this
                    }),
                    this.state.libraryItemDragging ? _react2.default.createElement('div', { style: { width: '100%', height: '100%', backgroundColor: 'white', opacity: 0.01, position: 'absolute', top: 0, left: 0 }, __source: {
                        fileName: _jsxFileName,
                        lineNumber: 695
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
                  lineNumber: 700
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZWFjdC9DcmVhdG9yLmpzIl0sIm5hbWVzIjpbInBrZyIsInJlcXVpcmUiLCJtaXhwYW5lbCIsImVsZWN0cm9uIiwicmVtb3RlIiwiaXBjUmVuZGVyZXIiLCJjbGlwYm9hcmQiLCJ3ZWJGcmFtZSIsInNldFpvb21MZXZlbExpbWl0cyIsInNldExheW91dFpvb21MZXZlbExpbWl0cyIsIkNyZWF0b3IiLCJwcm9wcyIsImF1dGhlbnRpY2F0ZVVzZXIiLCJiaW5kIiwiYXV0aGVudGljYXRpb25Db21wbGV0ZSIsImxvYWRQcm9qZWN0cyIsImxhdW5jaFByb2plY3QiLCJyZW1vdmVOb3RpY2UiLCJjcmVhdGVOb3RpY2UiLCJyZW5kZXJOb3RpZmljYXRpb25zIiwicmVjZWl2ZVByb2plY3RJbmZvIiwiaGFuZGxlRmluZEVsZW1lbnRDb29yZGluYXRlcyIsImhhbmRsZUZpbmRXZWJ2aWV3Q29vcmRpbmF0ZXMiLCJvbkF1dG9VcGRhdGVDaGVja0NvbXBsZXRlIiwibGF5b3V0Iiwic3RhdGUiLCJlcnJvciIsInByb2plY3RGb2xkZXIiLCJmb2xkZXIiLCJhcHBsaWNhdGlvbkltYWdlIiwicHJvamVjdE9iamVjdCIsInByb2plY3ROYW1lIiwiZGFzaGJvYXJkVmlzaWJsZSIsInJlYWR5Rm9yQXV0aCIsImlzVXNlckF1dGhlbnRpY2F0ZWQiLCJoYXNDaGVja2VkRm9yVXBkYXRlcyIsInVzZXJuYW1lIiwicGFzc3dvcmQiLCJub3RpY2VzIiwic29mdHdhcmVWZXJzaW9uIiwidmVyc2lvbiIsImRpZFBsdW1iaW5nTm90aWNlQ3Jhc2giLCJhY3RpdmVOYXYiLCJwcm9qZWN0c0xpc3QiLCJ3aW4iLCJnZXRDdXJyZW50V2luZG93IiwicHJvY2VzcyIsImVudiIsIkRFViIsIm9wZW5EZXZUb29scyIsImRvY3VtZW50IiwiYWRkRXZlbnRMaXN0ZW5lciIsIm5hdGl2ZUV2ZW50IiwiX2xhc3RNb3VzZVgiLCJjbGllbnRYIiwiX2xhc3RNb3VzZVkiLCJjbGllbnRZIiwiY29tYm9rZXlzIiwiZG9jdW1lbnRFbGVtZW50IiwiZGVib3VuY2UiLCJ3ZWJzb2NrZXQiLCJzZW5kIiwibWV0aG9kIiwicGFyYW1zIiwibGVhZGluZyIsImR1bXBTeXN0ZW1JbmZvIiwib24iLCJ0eXBlIiwibmFtZSIsIm9wZW5UZXJtaW5hbCIsInNldFN0YXRlIiwid2luZG93IiwiZXhlY1N5bmMiLCJKU09OIiwic3RyaW5naWZ5IiwiZXhjZXB0aW9uIiwiY29uc29sZSIsInRpbWVzdGFtcCIsIkRhdGUiLCJub3ciLCJkdW1wZGlyIiwiam9pbiIsIndyaXRlRmlsZVN5bmMiLCJhcmd2IiwiZXhpc3RzU3luYyIsInJlYWRGaWxlU3luYyIsInRvU3RyaW5nIiwiYWN0aXZlRm9sZGVyIiwicmVhY3RTdGF0ZSIsIl9fZmlsZW5hbWUiLCJfX2Rpcm5hbWUiLCJob21lZGlyIiwiaXNEZXZUb29sc09wZW5lZCIsImNsb3NlRGV2VG9vbHMiLCJyZWZzIiwic3RhZ2UiLCJ0b2dnbGVEZXZUb29scyIsInRpbWVsaW5lIiwibWF5YmVQYXN0ZVJlcXVlc3QiLCJwYXN0ZWRUZXh0IiwicmVhZFRleHQiLCJwYXN0ZWREYXRhIiwicGFyc2UiLCJ3YXJuIiwiQXJyYXkiLCJpc0FycmF5IiwicGFzdGVkRWxlbWVudCIsInJlcXVlc3QiLCJ0aXRsZSIsIm1lc3NhZ2UiLCJjbG9zZVRleHQiLCJsaWdodFNjaGVtZSIsImxlbmd0aCIsImluZm8iLCJkYXRhIiwiaGFuZGxlQ29udGVudFBhc3RlIiwiZW52b3kiLCJwb3J0IiwiaGFpa3UiLCJob3N0IiwiV2ViU29ja2V0IiwiZ2V0IiwidGhlbiIsInRvdXJDaGFubmVsIiwic2V0RGFzaGJvYXJkVmlzaWJpbGl0eSIsInNldFRpbWVvdXQiLCJzdGFydCIsInRocm90dGxlIiwibm90aWZ5U2NyZWVuUmVzaXplIiwicGFzdGVFdmVudCIsInRhZ25hbWUiLCJ0YXJnZXQiLCJ0YWdOYW1lIiwidG9Mb3dlckNhc2UiLCJwcmV2ZW50RGVmYXVsdCIsImNiIiwiYXV0aEFuc3dlciIsIm1lcmdlVG9QYXlsb2FkIiwiZGlzdGluY3RfaWQiLCJoYWlrdVRyYWNrIiwiYXV0aFRva2VuIiwib3JnYW5pemF0aW9uTmFtZSIsImlzQXV0aGVkIiwibGF1bmNoRm9sZGVyIiwiZm9sZGVyTG9hZGluZ0Vycm9yIiwib2ZmIiwic2VsZWN0b3IiLCJ3ZWJ2aWV3IiwiZWxlbWVudCIsInF1ZXJ5U2VsZWN0b3IiLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJ0b3AiLCJsZWZ0IiwicmVjZWl2ZUVsZW1lbnRDb29yZGluYXRlcyIsInJlY2VpdmVXZWJ2aWV3Q29vcmRpbmF0ZXMiLCJjb250ZW50IiwiaSIsIm5leHQiLCJwcm9qZWN0SW5mbyIsInNraXBDb250ZW50Q3JlYXRpb24iLCJwcm9qZWN0c0hvbWUiLCJwcm9qZWN0UGF0aCIsImF1dGhvck5hbWUiLCJwcm9qZWN0Iiwib3JnYW5pemF0aW9uIiwiZXJyIiwiYXNzaWduIiwibWF5YmVQcm9qZWN0TmFtZSIsImluZGV4IiwiaWQiLCJ1bmRlZmluZWQiLCJzbGljZSIsImVhY2giLCJub3RpY2UiLCJNYXRoIiwicmFuZG9tIiwicmVwbGFjZWRFeGlzdGluZyIsImZvckVhY2giLCJuIiwic3BsaWNlIiwidW5zaGlmdCIsImRyYWdFbmROYXRpdmVFdmVudCIsImxpYnJhcnlJdGVtSW5mbyIsImxpYnJhcnlJdGVtRHJhZ2dpbmciLCJwcmV2aWV3IiwiaGFuZGxlRHJvcCIsImRyYWdTdGFydE5hdGl2ZUV2ZW50IiwicG9zaXRpb24iLCJ3aWR0aCIsImhlaWdodCIsInJpZ2h0IiwibWFwIiwiZGlzcGxheSIsInZlcnRpY2FsQWxpZ24iLCJ0ZXh0QWxpZ24iLCJjb2xvciIsImJvdHRvbSIsInJlbmRlclN0YXJ0dXBEZWZhdWx0U2NyZWVuIiwidHJhbnNmb3JtIiwiZm9udFNpemUiLCJvdmVyZmxvdyIsImhhbmRsZVBhbmVSZXNpemUiLCJzd2l0Y2hBY3RpdmVOYXYiLCJvbkxpYnJhcnlEcmFnRW5kIiwib25MaWJyYXJ5RHJhZ1N0YXJ0IiwiYmFja2dyb3VuZENv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bkgsS0FBTCxDQUFXVyxRQVp2QjtBQWFFLGdDQUFVLEtBQUtYLEtBQUwsQ0FBV1ksUUFidkI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLHNCQURGO0FBZUkseUJBQUtaLEtBQUwsQ0FBVzhKLG1CQUFaLEdBQ0csdUNBQUssT0FBTyxFQUFFSyxPQUFPLE1BQVQsRUFBaUJDLFFBQVEsTUFBekIsRUFBaUNnQixpQkFBaUIsT0FBbEQsRUFBMkRDLFNBQVMsSUFBcEUsRUFBMEVuQixVQUFVLFVBQXBGLEVBQWdHcEMsS0FBSyxDQUFyRyxFQUF3R0MsTUFBTSxDQUE5RyxFQUFaO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxzQkFESCxHQUVHO0FBakJOO0FBeEJGO0FBREYsZUFERjtBQStDRTtBQUNFLHFCQUFJLFVBRE47QUFFRSx3QkFBUSxLQUFLL0gsS0FBTCxDQUFXRSxhQUZyQjtBQUdFLHVCQUFPLEtBQUt5RixLQUhkO0FBSUUsdUJBQU8sS0FBS3pHLEtBQUwsQ0FBVzJHLEtBSnBCO0FBS0UsOEJBQWMsS0FBS3BHLFlBTHJCO0FBTUUsOEJBQWMsS0FBS0QsWUFOckI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBL0NGO0FBVEY7QUFERjtBQUhGLE9BREY7QUF5RUQ7Ozs7RUF6cEJrQyxnQkFBTThMLFM7O2tCQUF0QnJNLE8iLCJmaWxlIjoiQ3JlYXRvci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCB7IFN0eWxlUm9vdCB9IGZyb20gJ3JhZGl1bSdcbmltcG9ydCBTcGxpdFBhbmUgZnJvbSAncmVhY3Qtc3BsaXQtcGFuZSdcbmltcG9ydCBSZWFjdENTU1RyYW5zaXRpb25Hcm91cCBmcm9tICdyZWFjdC1hZGRvbnMtY3NzLXRyYW5zaXRpb24tZ3JvdXAnXG5pbXBvcnQgbG9kYXNoIGZyb20gJ2xvZGFzaCdcbmltcG9ydCBDb21ib2tleXMgZnJvbSAnY29tYm9rZXlzJ1xuaW1wb3J0IEV2ZW50RW1pdHRlciBmcm9tICdldmVudC1lbWl0dGVyJ1xuaW1wb3J0IGNwIGZyb20gJ2NoaWxkX3Byb2Nlc3MnXG5pbXBvcnQgb3MgZnJvbSAnb3MnXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IGZzIGZyb20gJ2ZzJ1xuaW1wb3J0IEF1dGhlbnRpY2F0aW9uVUkgZnJvbSAnLi9jb21wb25lbnRzL0F1dGhlbnRpY2F0aW9uVUknXG5pbXBvcnQgUHJvamVjdEJyb3dzZXIgZnJvbSAnLi9jb21wb25lbnRzL1Byb2plY3RCcm93c2VyJ1xuaW1wb3J0IFNpZGVCYXIgZnJvbSAnLi9jb21wb25lbnRzL1NpZGVCYXInXG5pbXBvcnQgTGlicmFyeSBmcm9tICcuL2NvbXBvbmVudHMvbGlicmFyeS9MaWJyYXJ5J1xuaW1wb3J0IFN0YXRlSW5zcGVjdG9yIGZyb20gJy4vY29tcG9uZW50cy9TdGF0ZUluc3BlY3Rvci9TdGF0ZUluc3BlY3RvcidcbmltcG9ydCBTdGFnZSBmcm9tICcuL2NvbXBvbmVudHMvU3RhZ2UnXG5pbXBvcnQgVGltZWxpbmUgZnJvbSAnLi9jb21wb25lbnRzL1RpbWVsaW5lJ1xuaW1wb3J0IFRvYXN0IGZyb20gJy4vY29tcG9uZW50cy9ub3RpZmljYXRpb25zL1RvYXN0J1xuaW1wb3J0IFRvdXIgZnJvbSAnLi9jb21wb25lbnRzL1RvdXIvVG91cidcbmltcG9ydCBBdXRvVXBkYXRlciBmcm9tICcuL2NvbXBvbmVudHMvQXV0b1VwZGF0ZXInXG5pbXBvcnQgRW52b3lDbGllbnQgZnJvbSAnaGFpa3Utc2RrLWNyZWF0b3IvbGliL2Vudm95L2NsaWVudCdcbmltcG9ydCB7XG4gIGxpbmtFeHRlcm5hbEFzc2V0c09uRHJvcCxcbiAgcHJldmVudERlZmF1bHREcmFnXG59IGZyb20gJ2hhaWt1LXNlcmlhbGl6YXRpb24vc3JjL3V0aWxzL2RuZEhlbHBlcnMnXG5pbXBvcnQge1xuICBIT01FRElSX1BBVEgsXG4gIEhPTUVESVJfTE9HU19QQVRIXG59IGZyb20gJ2hhaWt1LXNlcmlhbGl6YXRpb24vc3JjL3V0aWxzL0hhaWt1SG9tZURpcidcblxudmFyIHBrZyA9IHJlcXVpcmUoJy4vLi4vLi4vcGFja2FnZS5qc29uJylcblxudmFyIG1peHBhbmVsID0gcmVxdWlyZSgnaGFpa3Utc2VyaWFsaXphdGlvbi9zcmMvdXRpbHMvTWl4cGFuZWwnKVxuXG5jb25zdCBlbGVjdHJvbiA9IHJlcXVpcmUoJ2VsZWN0cm9uJylcbmNvbnN0IHJlbW90ZSA9IGVsZWN0cm9uLnJlbW90ZVxuY29uc3QgaXBjUmVuZGVyZXIgPSBlbGVjdHJvbi5pcGNSZW5kZXJlclxuY29uc3QgY2xpcGJvYXJkID0gZWxlY3Ryb24uY2xpcGJvYXJkXG5cbnZhciB3ZWJGcmFtZSA9IGVsZWN0cm9uLndlYkZyYW1lXG5pZiAod2ViRnJhbWUpIHtcbiAgaWYgKHdlYkZyYW1lLnNldFpvb21MZXZlbExpbWl0cykgd2ViRnJhbWUuc2V0Wm9vbUxldmVsTGltaXRzKDEsIDEpXG4gIGlmICh3ZWJGcmFtZS5zZXRMYXlvdXRab29tTGV2ZWxMaW1pdHMpIHdlYkZyYW1lLnNldExheW91dFpvb21MZXZlbExpbWl0cygwLCAwKVxufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDcmVhdG9yIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IgKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpXG4gICAgdGhpcy5hdXRoZW50aWNhdGVVc2VyID0gdGhpcy5hdXRoZW50aWNhdGVVc2VyLmJpbmQodGhpcylcbiAgICB0aGlzLmF1dGhlbnRpY2F0aW9uQ29tcGxldGUgPSB0aGlzLmF1dGhlbnRpY2F0aW9uQ29tcGxldGUuYmluZCh0aGlzKVxuICAgIHRoaXMubG9hZFByb2plY3RzID0gdGhpcy5sb2FkUHJvamVjdHMuYmluZCh0aGlzKVxuICAgIHRoaXMubGF1bmNoUHJvamVjdCA9IHRoaXMubGF1bmNoUHJvamVjdC5iaW5kKHRoaXMpXG4gICAgdGhpcy5yZW1vdmVOb3RpY2UgPSB0aGlzLnJlbW92ZU5vdGljZS5iaW5kKHRoaXMpXG4gICAgdGhpcy5jcmVhdGVOb3RpY2UgPSB0aGlzLmNyZWF0ZU5vdGljZS5iaW5kKHRoaXMpXG4gICAgdGhpcy5yZW5kZXJOb3RpZmljYXRpb25zID0gdGhpcy5yZW5kZXJOb3RpZmljYXRpb25zLmJpbmQodGhpcylcbiAgICB0aGlzLnJlY2VpdmVQcm9qZWN0SW5mbyA9IHRoaXMucmVjZWl2ZVByb2plY3RJbmZvLmJpbmQodGhpcylcbiAgICB0aGlzLmhhbmRsZUZpbmRFbGVtZW50Q29vcmRpbmF0ZXMgPSB0aGlzLmhhbmRsZUZpbmRFbGVtZW50Q29vcmRpbmF0ZXMuYmluZCh0aGlzKVxuICAgIHRoaXMuaGFuZGxlRmluZFdlYnZpZXdDb29yZGluYXRlcyA9IHRoaXMuaGFuZGxlRmluZFdlYnZpZXdDb29yZGluYXRlcy5iaW5kKHRoaXMpXG4gICAgdGhpcy5vbkF1dG9VcGRhdGVDaGVja0NvbXBsZXRlID0gdGhpcy5vbkF1dG9VcGRhdGVDaGVja0NvbXBsZXRlLmJpbmQodGhpcylcbiAgICB0aGlzLmxheW91dCA9IG5ldyBFdmVudEVtaXR0ZXIoKVxuXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIGVycm9yOiBudWxsLFxuICAgICAgcHJvamVjdEZvbGRlcjogdGhpcy5wcm9wcy5mb2xkZXIsXG4gICAgICBhcHBsaWNhdGlvbkltYWdlOiBudWxsLFxuICAgICAgcHJvamVjdE9iamVjdDogbnVsbCxcbiAgICAgIHByb2plY3ROYW1lOiBudWxsLFxuICAgICAgZGFzaGJvYXJkVmlzaWJsZTogIXRoaXMucHJvcHMuZm9sZGVyLFxuICAgICAgcmVhZHlGb3JBdXRoOiBmYWxzZSxcbiAgICAgIGlzVXNlckF1dGhlbnRpY2F0ZWQ6IGZhbHNlLFxuICAgICAgaGFzQ2hlY2tlZEZvclVwZGF0ZXM6IGZhbHNlLFxuICAgICAgdXNlcm5hbWU6IG51bGwsXG4gICAgICBwYXNzd29yZDogbnVsbCxcbiAgICAgIG5vdGljZXM6IFtdLFxuICAgICAgc29mdHdhcmVWZXJzaW9uOiBwa2cudmVyc2lvbixcbiAgICAgIGRpZFBsdW1iaW5nTm90aWNlQ3Jhc2g6IGZhbHNlLFxuICAgICAgYWN0aXZlTmF2OiAnbGlicmFyeScsXG4gICAgICBwcm9qZWN0c0xpc3Q6IFtdXG4gICAgfVxuXG4gICAgY29uc3Qgd2luID0gcmVtb3RlLmdldEN1cnJlbnRXaW5kb3coKVxuXG4gICAgaWYgKHByb2Nlc3MuZW52LkRFViA9PT0gJzEnKSB7XG4gICAgICB3aW4ub3BlbkRldlRvb2xzKClcbiAgICB9XG5cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCAobmF0aXZlRXZlbnQpID0+IHtcbiAgICAgIHRoaXMuX2xhc3RNb3VzZVggPSBuYXRpdmVFdmVudC5jbGllbnRYXG4gICAgICB0aGlzLl9sYXN0TW91c2VZID0gbmF0aXZlRXZlbnQuY2xpZW50WVxuICAgIH0pXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignZHJhZycsIChuYXRpdmVFdmVudCkgPT4ge1xuICAgICAgLy8gV2hlbiB0aGUgZHJhZyBlbmRzLCBmb3Igc29tZSByZWFzb24gdGhlIHBvc2l0aW9uIGdvZXMgdG8gMCwgc28gaGFjayB0aGlzLi4uXG4gICAgICBpZiAobmF0aXZlRXZlbnQuY2xpZW50WCA+IDAgJiYgbmF0aXZlRXZlbnQuY2xpZW50WSA+IDApIHtcbiAgICAgICAgdGhpcy5fbGFzdE1vdXNlWCA9IG5hdGl2ZUV2ZW50LmNsaWVudFhcbiAgICAgICAgdGhpcy5fbGFzdE1vdXNlWSA9IG5hdGl2ZUV2ZW50LmNsaWVudFlcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgY29uc3QgY29tYm9rZXlzID0gbmV3IENvbWJva2V5cyhkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpXG4gICAgY29tYm9rZXlzLmJpbmQoJ2NvbW1hbmQrb3B0aW9uK2knLCBsb2Rhc2guZGVib3VuY2UoKCkgPT4ge1xuICAgICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQuc2VuZCh7IG1ldGhvZDogJ3RvZ2dsZURldlRvb2xzJywgcGFyYW1zOiBbdGhpcy5zdGF0ZS5wcm9qZWN0Rm9sZGVyXSB9KVxuICAgIH0sIDUwMCwgeyBsZWFkaW5nOiB0cnVlIH0pKVxuICAgIGNvbWJva2V5cy5iaW5kKCdjb21tYW5kK29wdGlvbiswJywgbG9kYXNoLmRlYm91bmNlKCgpID0+IHtcbiAgICAgIHRoaXMuZHVtcFN5c3RlbUluZm8oKVxuICAgIH0sIDUwMCwgeyBsZWFkaW5nOiB0cnVlIH0pKVxuXG4gICAgLy8gTk9URTogVGhlIFRvcE1lbnUgYXV0b21hdGljYWxseSBiaW5kcyB0aGUgYmVsb3cga2V5Ym9hcmQgc2hvcnRjdXRzL2FjY2VsZXJhdG9yc1xuICAgIGlwY1JlbmRlcmVyLm9uKCdnbG9iYWwtbWVudTp6b29tLWluJywgKCkgPT4ge1xuICAgICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQuc2VuZCh7IHR5cGU6ICdicm9hZGNhc3QnLCBuYW1lOiAndmlldzp6b29tLWluJyB9KVxuICAgIH0pXG4gICAgaXBjUmVuZGVyZXIub24oJ2dsb2JhbC1tZW51Onpvb20tb3V0JywgKCkgPT4ge1xuICAgICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQuc2VuZCh7IHR5cGU6ICdicm9hZGNhc3QnLCBuYW1lOiAndmlldzp6b29tLW91dCcgfSlcbiAgICB9KVxuICAgIGlwY1JlbmRlcmVyLm9uKCdnbG9iYWwtbWVudTpvcGVuLXRlcm1pbmFsJywgbG9kYXNoLmRlYm91bmNlKCgpID0+IHtcbiAgICAgIHRoaXMub3BlblRlcm1pbmFsKHRoaXMuc3RhdGUucHJvamVjdEZvbGRlcilcbiAgICB9LCA1MDAsIHsgbGVhZGluZzogdHJ1ZSB9KSlcbiAgICBpcGNSZW5kZXJlci5vbignZ2xvYmFsLW1lbnU6dW5kbycsIGxvZGFzaC5kZWJvdW5jZSgoKSA9PiB7XG4gICAgICB0aGlzLnByb3BzLndlYnNvY2tldC5zZW5kKHsgbWV0aG9kOiAnZ2l0VW5kbycsIHBhcmFtczogW3RoaXMuc3RhdGUucHJvamVjdEZvbGRlciwgeyB0eXBlOiAnZ2xvYmFsJyB9XSB9KVxuICAgIH0sIDUwMCwgeyBsZWFkaW5nOiB0cnVlIH0pKVxuICAgIGlwY1JlbmRlcmVyLm9uKCdnbG9iYWwtbWVudTpyZWRvJywgbG9kYXNoLmRlYm91bmNlKCgpID0+IHtcbiAgICAgIHRoaXMucHJvcHMud2Vic29ja2V0LnNlbmQoeyBtZXRob2Q6ICdnaXRSZWRvJywgcGFyYW1zOiBbdGhpcy5zdGF0ZS5wcm9qZWN0Rm9sZGVyLCB7IHR5cGU6ICdnbG9iYWwnIH1dIH0pXG4gICAgfSwgNTAwLCB7IGxlYWRpbmc6IHRydWUgfSkpXG4gICAgaXBjUmVuZGVyZXIub24oJ2dsb2JhbC1tZW51OmNoZWNrLXVwZGF0ZXMnLCAoKSA9PiB7XG4gICAgICB0aGlzLnNldFN0YXRlKHsgaGFzQ2hlY2tlZEZvclVwZGF0ZXM6IGZhbHNlIH0pXG4gICAgfSlcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdkcmFnb3ZlcicsIHByZXZlbnREZWZhdWx0RHJhZywgZmFsc2UpXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2Ryb3AnLCBsaW5rRXh0ZXJuYWxBc3NldHNPbkRyb3AuYmluZCh0aGlzKSwgZmFsc2UpXG4gIH1cblxuICBvcGVuVGVybWluYWwgKGZvbGRlcikge1xuICAgIHRyeSB7XG4gICAgICBjcC5leGVjU3luYygnb3BlbiAtYiBjb20uYXBwbGUudGVybWluYWwgJyArIEpTT04uc3RyaW5naWZ5KGZvbGRlcikgKyAnIHx8IHRydWUnKVxuICAgIH0gY2F0Y2ggKGV4Y2VwdGlvbikge1xuICAgICAgY29uc29sZS5lcnJvcihleGNlcHRpb24pXG4gICAgfVxuICB9XG5cbiAgZHVtcFN5c3RlbUluZm8gKCkge1xuICAgIGNvbnN0IHRpbWVzdGFtcCA9IERhdGUubm93KClcbiAgICBjb25zdCBkdW1wZGlyID0gcGF0aC5qb2luKEhPTUVESVJfUEFUSCwgJ2R1bXBzJywgYGR1bXAtJHt0aW1lc3RhbXB9YClcbiAgICBjcC5leGVjU3luYyhgbWtkaXIgLXAgJHtKU09OLnN0cmluZ2lmeShkdW1wZGlyKX1gKVxuICAgIGZzLndyaXRlRmlsZVN5bmMocGF0aC5qb2luKGR1bXBkaXIsICdhcmd2JyksIEpTT04uc3RyaW5naWZ5KHByb2Nlc3MuYXJndiwgbnVsbCwgMikpXG4gICAgZnMud3JpdGVGaWxlU3luYyhwYXRoLmpvaW4oZHVtcGRpciwgJ2VudicpLCBKU09OLnN0cmluZ2lmeShwcm9jZXNzLmVudiwgbnVsbCwgMikpXG4gICAgaWYgKGZzLmV4aXN0c1N5bmMocGF0aC5qb2luKEhPTUVESVJfTE9HU19QQVRILCAnaGFpa3UtZGVidWcubG9nJykpKSB7XG4gICAgICBmcy53cml0ZUZpbGVTeW5jKHBhdGguam9pbihkdW1wZGlyLCAnbG9nJyksIGZzLnJlYWRGaWxlU3luYyhwYXRoLmpvaW4oSE9NRURJUl9MT0dTX1BBVEgsICdoYWlrdS1kZWJ1Zy5sb2cnKSkudG9TdHJpbmcoKSlcbiAgICB9XG4gICAgZnMud3JpdGVGaWxlU3luYyhwYXRoLmpvaW4oZHVtcGRpciwgJ2luZm8nKSwgSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgYWN0aXZlRm9sZGVyOiB0aGlzLnN0YXRlLnByb2plY3RGb2xkZXIsXG4gICAgICByZWFjdFN0YXRlOiB0aGlzLnN0YXRlLFxuICAgICAgX19maWxlbmFtZTogX19maWxlbmFtZSxcbiAgICAgIF9fZGlybmFtZTogX19kaXJuYW1lXG4gICAgfSwgbnVsbCwgMikpXG4gICAgaWYgKHRoaXMuc3RhdGUucHJvamVjdEZvbGRlcikge1xuICAgICAgLy8gVGhlIHByb2plY3QgZm9sZGVyIGl0c2VsZiB3aWxsIGNvbnRhaW4gZ2l0IGxvZ3MgYW5kIG90aGVyIGdvb2RpZXMgd2UgbWdpaHQgd2FudCB0byBsb29rIGF0XG4gICAgICBjcC5leGVjU3luYyhgdGFyIC16Y3ZmICR7SlNPTi5zdHJpbmdpZnkocGF0aC5qb2luKGR1bXBkaXIsICdwcm9qZWN0LnRhci5neicpKX0gJHtKU09OLnN0cmluZ2lmeSh0aGlzLnN0YXRlLnByb2plY3RGb2xkZXIpfWApXG4gICAgfVxuICAgIC8vIEZvciBjb252ZW5pZW5jZSwgemlwIHVwIHRoZSBlbnRpcmUgZHVtcCBmb2xkZXIuLi5cbiAgICBjcC5leGVjU3luYyhgdGFyIC16Y3ZmICR7SlNPTi5zdHJpbmdpZnkocGF0aC5qb2luKG9zLmhvbWVkaXIoKSwgYGhhaWt1LWR1bXAtJHt0aW1lc3RhbXB9LnRhci5nemApKX0gJHtKU09OLnN0cmluZ2lmeShkdW1wZGlyKX1gKVxuICB9XG5cbiAgdG9nZ2xlRGV2VG9vbHMgKCkge1xuICAgIGNvbnN0IHdpbiA9IHJlbW90ZS5nZXRDdXJyZW50V2luZG93KClcbiAgICBpZiAod2luLmlzRGV2VG9vbHNPcGVuZWQoKSkgd2luLmNsb3NlRGV2VG9vbHMoKVxuICAgIGVsc2Ugd2luLm9wZW5EZXZUb29scygpXG4gICAgaWYgKHRoaXMucmVmcy5zdGFnZSkgdGhpcy5yZWZzLnN0YWdlLnRvZ2dsZURldlRvb2xzKClcbiAgICBpZiAodGhpcy5yZWZzLnRpbWVsaW5lKSB0aGlzLnJlZnMudGltZWxpbmUudG9nZ2xlRGV2VG9vbHMoKVxuICB9XG5cbiAgaGFuZGxlQ29udGVudFBhc3RlIChtYXliZVBhc3RlUmVxdWVzdCkge1xuICAgIGxldCBwYXN0ZWRUZXh0ID0gY2xpcGJvYXJkLnJlYWRUZXh0KClcbiAgICBpZiAoIXBhc3RlZFRleHQpIHJldHVybiB2b2lkICgwKVxuXG4gICAgLy8gVGhlIGRhdGEgb24gdGhlIGNsaXBib2FyZCBtaWdodCBiZSBzZXJpYWxpemVkIGRhdGEsIHNvIHRyeSB0byBwYXJzZSBpdCBpZiB0aGF0J3MgdGhlIGNhc2VcbiAgICAvLyBUaGUgbWFpbiBjYXNlIHdlIGhhdmUgbm93IGZvciBzZXJpYWxpemVkIGRhdGEgaXMgaGFpa3UgZWxlbWVudHMgY29waWVkIGZyb20gdGhlIHN0YWdlXG4gICAgbGV0IHBhc3RlZERhdGFcbiAgICB0cnkge1xuICAgICAgcGFzdGVkRGF0YSA9IEpTT04ucGFyc2UocGFzdGVkVGV4dClcbiAgICB9IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICAgIGNvbnNvbGUud2FybignW2NyZWF0b3JdIHVuYWJsZSB0byBwYXJzZSBwYXN0ZWQgZGF0YTsgaXQgbWlnaHQgYmUgcGxhaW4gdGV4dCcpXG4gICAgICBwYXN0ZWREYXRhID0gcGFzdGVkVGV4dFxuICAgIH1cblxuICAgIGlmIChBcnJheS5pc0FycmF5KHBhc3RlZERhdGEpKSB7XG4gICAgICAvLyBUaGlzIGxvb2tzIGxpa2UgYSBIYWlrdSBlbGVtZW50IHRoYXQgaGFzIGJlZW4gY29waWVkIGZyb20gdGhlIHN0YWdlXG4gICAgICBpZiAocGFzdGVkRGF0YVswXSA9PT0gJ2FwcGxpY2F0aW9uL2hhaWt1JyAmJiB0eXBlb2YgcGFzdGVkRGF0YVsxXSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgbGV0IHBhc3RlZEVsZW1lbnQgPSBwYXN0ZWREYXRhWzFdXG5cbiAgICAgICAgLy8gQ29tbWFuZCB0aGUgdmlld3MgYW5kIG1hc3RlciBwcm9jZXNzIHRvIGhhbmRsZSB0aGUgZWxlbWVudCBwYXN0ZSBhY3Rpb25cbiAgICAgICAgLy8gVGhlICdwYXN0ZVRoaW5nJyBhY3Rpb24gaXMgaW50ZW5kZWQgdG8gYmUgYWJsZSB0byBoYW5kbGUgbXVsdGlwbGUgY29udGVudCB0eXBlc1xuICAgICAgICByZXR1cm4gdGhpcy5wcm9wcy53ZWJzb2NrZXQucmVxdWVzdCh7IHR5cGU6ICdhY3Rpb24nLCBtZXRob2Q6ICdwYXN0ZVRoaW5nJywgcGFyYW1zOiBbdGhpcy5zdGF0ZS5wcm9qZWN0Rm9sZGVyLCBwYXN0ZWRFbGVtZW50LCBtYXliZVBhc3RlUmVxdWVzdCB8fCB7fV0gfSwgKGVycm9yKSA9PiB7XG4gICAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlTm90aWNlKHtcbiAgICAgICAgICAgICAgdHlwZTogJ3dhcm5pbmcnLFxuICAgICAgICAgICAgICB0aXRsZTogJ1VoIG9oIScsXG4gICAgICAgICAgICAgIG1lc3NhZ2U6ICdXZSBjb3VsZG5cXCd0IHBhc3RlIHRoYXQuIPCfmKIgUGxlYXNlIGNvbnRhY3QgSGFpa3UgZm9yIHN1cHBvcnQuJyxcbiAgICAgICAgICAgICAgY2xvc2VUZXh0OiAnT2theScsXG4gICAgICAgICAgICAgIGxpZ2h0U2NoZW1lOiB0cnVlXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIFRPRE86IEhhbmRsZSBvdGhlciBjYXNlcyB3aGVyZSB0aGUgcGFzdGUgZGF0YSB3YXMgYSBzZXJpYWxpemVkIGFycmF5XG4gICAgICAgIGNvbnNvbGUud2FybignW2NyZWF0b3JdIGNhbm5vdCBwYXN0ZSB0aGlzIGNvbnRlbnQgdHlwZSB5ZXQgKGFycmF5KScpXG4gICAgICAgIHRoaXMuY3JlYXRlTm90aWNlKHtcbiAgICAgICAgICB0eXBlOiAnd2FybmluZycsXG4gICAgICAgICAgdGl0bGU6ICdIbW1tJyxcbiAgICAgICAgICBtZXNzYWdlOiAnV2UgZG9uXFwndCBrbm93IGhvdyB0byBwYXN0ZSB0aGF0IGNvbnRlbnQgeWV0LiDwn5izJyxcbiAgICAgICAgICBjbG9zZVRleHQ6ICdPa2F5JyxcbiAgICAgICAgICBsaWdodFNjaGVtZTogdHJ1ZVxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBBbiBlbXB0eSBzdHJpbmcgaXMgdHJlYXRlZCBhcyB0aGUgZXF1aXZhbGVudCBvZiBub3RoaW5nIChkb24ndCBkaXNwbGF5IHdhcm5pbmcgaWYgbm90aGluZyB0byBpbnN0YW50aWF0ZSlcbiAgICAgIGlmICh0eXBlb2YgcGFzdGVkRGF0YSA9PT0gJ3N0cmluZycgJiYgcGFzdGVkRGF0YS5sZW5ndGggPiAwKSB7XG4gICAgICAgIC8vIFRPRE86IEhhbmRsZSB0aGUgY2FzZSB3aGVuIHBsYWluIHRleHQgaGFzIGJlZW4gcGFzdGVkIC0gU1ZHLCBIVE1MLCBldGM/XG4gICAgICAgIGNvbnNvbGUud2FybignW2NyZWF0b3JdIGNhbm5vdCBwYXN0ZSB0aGlzIGNvbnRlbnQgdHlwZSB5ZXQgKHVua25vd24gc3RyaW5nKScpXG4gICAgICAgIHRoaXMuY3JlYXRlTm90aWNlKHtcbiAgICAgICAgICB0eXBlOiAnd2FybmluZycsXG4gICAgICAgICAgdGl0bGU6ICdIbW1tJyxcbiAgICAgICAgICBtZXNzYWdlOiAnV2UgZG9uXFwndCBrbm93IGhvdyB0byBwYXN0ZSB0aGF0IGNvbnRlbnQgeWV0LiDwn5izJyxcbiAgICAgICAgICBjbG9zZVRleHQ6ICdPa2F5JyxcbiAgICAgICAgICBsaWdodFNjaGVtZTogdHJ1ZVxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxNb3VudCAoKSB7XG4gICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQub24oJ2Jyb2FkY2FzdCcsIChtZXNzYWdlKSA9PiB7XG4gICAgICBzd2l0Y2ggKG1lc3NhZ2UubmFtZSkge1xuICAgICAgICBjYXNlICdkZXYtdG9vbHM6dG9nZ2xlJzpcbiAgICAgICAgICB0aGlzLnRvZ2dsZURldlRvb2xzKClcbiAgICAgICAgICBicmVha1xuXG4gICAgICAgIGNhc2UgJ2N1cnJlbnQtcGFzdGVhYmxlOnJlcXVlc3QtcGFzdGUnOlxuICAgICAgICAgIGNvbnNvbGUuaW5mbygnW2NyZWF0b3JdIGN1cnJlbnQtcGFzdGVhYmxlOnJlcXVlc3QtcGFzdGUnLCBtZXNzYWdlLmRhdGEpXG4gICAgICAgICAgcmV0dXJuIHRoaXMuaGFuZGxlQ29udGVudFBhc3RlKG1lc3NhZ2UuZGF0YSlcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgdGhpcy5lbnZveSA9IG5ldyBFbnZveUNsaWVudCh7XG4gICAgICBwb3J0OiB0aGlzLnByb3BzLmhhaWt1LmVudm95LnBvcnQsXG4gICAgICBob3N0OiB0aGlzLnByb3BzLmhhaWt1LmVudm95Lmhvc3QsXG4gICAgICBXZWJTb2NrZXQ6IHdpbmRvdy5XZWJTb2NrZXRcbiAgICB9KVxuXG4gICAgdGhpcy5lbnZveS5nZXQoJ3RvdXInKS50aGVuKCh0b3VyQ2hhbm5lbCkgPT4ge1xuICAgICAgdGhpcy50b3VyQ2hhbm5lbCA9IHRvdXJDaGFubmVsXG5cbiAgICAgIHRvdXJDaGFubmVsLm9uKCd0b3VyOnJlcXVlc3RFbGVtZW50Q29vcmRpbmF0ZXMnLCB0aGlzLmhhbmRsZUZpbmRFbGVtZW50Q29vcmRpbmF0ZXMpXG5cbiAgICAgIHRvdXJDaGFubmVsLm9uKCd0b3VyOnJlcXVlc3RXZWJ2aWV3Q29vcmRpbmF0ZXMnLCB0aGlzLmhhbmRsZUZpbmRXZWJ2aWV3Q29vcmRpbmF0ZXMpXG5cbiAgICAgIGlwY1JlbmRlcmVyLm9uKCdnbG9iYWwtbWVudTpzdGFydC10b3VyJywgKCkgPT4ge1xuICAgICAgICB0aGlzLnNldERhc2hib2FyZFZpc2liaWxpdHkodHJ1ZSlcblxuICAgICAgICAvLyBQdXQgaXQgYXQgdGhlIGJvdHRvbSBvZiB0aGUgZXZlbnQgbG9vcFxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICB0b3VyQ2hhbm5lbC5zdGFydCh0cnVlKVxuICAgICAgICB9KVxuICAgICAgfSlcblxuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIGxvZGFzaC50aHJvdHRsZSgoKSA9PiB7XG4gICAgICAgIC8vIGlmICh0b3VyQ2hhbm5lbC5pc1RvdXJBY3RpdmUoKSkge1xuICAgICAgICB0b3VyQ2hhbm5lbC5ub3RpZnlTY3JlZW5SZXNpemUoKVxuICAgICAgICAvLyB9XG4gICAgICB9KSwgMzAwKVxuICAgIH0pXG5cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdwYXN0ZScsIChwYXN0ZUV2ZW50KSA9PiB7XG4gICAgICBjb25zb2xlLmluZm8oJ1tjcmVhdG9yXSBwYXN0ZSBoZWFyZCcpXG4gICAgICBsZXQgdGFnbmFtZSA9IHBhc3RlRXZlbnQudGFyZ2V0LnRhZ05hbWUudG9Mb3dlckNhc2UoKVxuICAgICAgaWYgKHRhZ25hbWUgPT09ICdpbnB1dCcgfHwgdGFnbmFtZSA9PT0gJ3RleHRhcmVhJykge1xuICAgICAgICAvLyBEbyBub3RoaW5nOyBsZXQgaW5wdXQgZmllbGRzIGFuZCBzby1vbiBiZSBoYW5kbGVkIG5vcm1hbGx5XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBPdGhlcndpc2UsIGFzc3VtZSB3ZSBtaWdodCBuZWVkIHRvIGhhbmRsZSB0aGlzIHBhc3RlIGV2ZW50IHNwZWNpYWxseVxuICAgICAgICBwYXN0ZUV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgdGhpcy5oYW5kbGVDb250ZW50UGFzdGUoKVxuICAgICAgfVxuICAgIH0pXG5cbiAgICB0aGlzLnByb3BzLndlYnNvY2tldC5vbignbWV0aG9kJywgKG1ldGhvZCwgcGFyYW1zLCBjYikgPT4ge1xuICAgICAgY29uc29sZS5pbmZvKCdbY3JlYXRvcl0gbWV0aG9kIGZyb20gcGx1bWJpbmc6JywgbWV0aG9kLCBwYXJhbXMpXG4gICAgICAvLyBuby1vcDsgY3JlYXRvciBkb2Vzbid0IGN1cnJlbnRseSByZWNlaXZlIGFueSBtZXRob2RzIGZyb20gdGhlIG90aGVyIHZpZXdzLCBidXQgd2UgbmVlZCB0aGlzXG4gICAgICAvLyBjYWxsYmFjayB0byBiZSBjYWxsZWQgdG8gYWxsb3cgdGhlIGFjdGlvbiBjaGFpbiBpbiBwbHVtYmluZyB0byBwcm9jZWVkXG4gICAgICByZXR1cm4gY2IoKVxuICAgIH0pXG5cbiAgICB0aGlzLnByb3BzLndlYnNvY2tldC5vbignb3BlbicsICgpID0+IHtcbiAgICAgIHRoaXMucHJvcHMud2Vic29ja2V0LnJlcXVlc3QoeyBtZXRob2Q6ICdpc1VzZXJBdXRoZW50aWNhdGVkJywgcGFyYW1zOiBbXSB9LCAoZXJyb3IsIGF1dGhBbnN3ZXIpID0+IHtcbiAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcilcbiAgICAgICAgICByZXR1cm4gdGhpcy5jcmVhdGVOb3RpY2Uoe1xuICAgICAgICAgICAgdHlwZTogJ2Vycm9yJyxcbiAgICAgICAgICAgIHRpdGxlOiAnT2ggbm8hJyxcbiAgICAgICAgICAgIG1lc3NhZ2U6ICdXZSBoYWQgYSBwcm9ibGVtIGFjY2Vzc2luZyB5b3VyIGFjY291bnQuIPCfmKIgUGxlYXNlIHRyeSBjbG9zaW5nIGFuZCByZW9wZW5pbmcgdGhlIGFwcGxpY2F0aW9uLiBJZiB5b3Ugc3RpbGwgc2VlIHRoaXMgbWVzc2FnZSwgY29udGFjdCBIYWlrdSBmb3Igc3VwcG9ydC4nLFxuICAgICAgICAgICAgY2xvc2VUZXh0OiAnT2theScsXG4gICAgICAgICAgICBsaWdodFNjaGVtZTogdHJ1ZVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cblxuICAgICAgICBtaXhwYW5lbC5tZXJnZVRvUGF5bG9hZCh7IGRpc3RpbmN0X2lkOiBhdXRoQW5zd2VyICYmIGF1dGhBbnN3ZXIudXNlcm5hbWUgfSlcbiAgICAgICAgbWl4cGFuZWwuaGFpa3VUcmFjaygnY3JlYXRvcjpvcGVuZWQnKVxuXG4gICAgICAgIC8vIERlbGF5IHNvIHRoZSBkZWZhdWx0IHN0YXJ0dXAgc2NyZWVuIGRvZXNuJ3QganVzdCBmbGFzaCB0aGVuIGdvIGF3YXlcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICByZWFkeUZvckF1dGg6IHRydWUsXG4gICAgICAgICAgICBhdXRoVG9rZW46IGF1dGhBbnN3ZXIgJiYgYXV0aEFuc3dlci5hdXRoVG9rZW4sXG4gICAgICAgICAgICBvcmdhbml6YXRpb25OYW1lOiBhdXRoQW5zd2VyICYmIGF1dGhBbnN3ZXIub3JnYW5pemF0aW9uTmFtZSxcbiAgICAgICAgICAgIHVzZXJuYW1lOiBhdXRoQW5zd2VyICYmIGF1dGhBbnN3ZXIudXNlcm5hbWUsXG4gICAgICAgICAgICBpc1VzZXJBdXRoZW50aWNhdGVkOiBhdXRoQW5zd2VyICYmIGF1dGhBbnN3ZXIuaXNBdXRoZWRcbiAgICAgICAgICB9KVxuICAgICAgICAgIGlmICh0aGlzLnByb3BzLmZvbGRlcikge1xuICAgICAgICAgICAgLy8gTGF1bmNoIGZvbGRlciBkaXJlY3RseSAtIGkuZS4gYWxsb3cgYSAnc3VibCcgbGlrZSBleHBlcmllbmNlIHdpdGhvdXQgaGF2aW5nIHRvIGdvXG4gICAgICAgICAgICAvLyB0aHJvdWdoIHRoZSBwcm9qZWN0cyBpbmRleFxuICAgICAgICAgICAgcmV0dXJuIHRoaXMubGF1bmNoRm9sZGVyKG51bGwsIHRoaXMucHJvcHMuZm9sZGVyLCAoZXJyb3IpID0+IHtcbiAgICAgICAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcilcbiAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgZm9sZGVyTG9hZGluZ0Vycm9yOiBlcnJvciB9KVxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNyZWF0ZU5vdGljZSh7XG4gICAgICAgICAgICAgICAgICB0eXBlOiAnZXJyb3InLFxuICAgICAgICAgICAgICAgICAgdGl0bGU6ICdPaCBubyEnLFxuICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ1dlIHdlcmUgdW5hYmxlIHRvIG9wZW4gdGhlIGZvbGRlci4g8J+YoiBQbGVhc2UgY2xvc2UgYW5kIHJlb3BlbiB0aGUgYXBwbGljYXRpb24gYW5kIHRyeSBhZ2Fpbi4gSWYgeW91IHN0aWxsIHNlZSB0aGlzIG1lc3NhZ2UsIGNvbnRhY3QgSGFpa3UgZm9yIHN1cHBvcnQuJyxcbiAgICAgICAgICAgICAgICAgIGNsb3NlVGV4dDogJ09rYXknLFxuICAgICAgICAgICAgICAgICAgbGlnaHRTY2hlbWU6IHRydWVcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH1cbiAgICAgICAgfSwgMTAwMClcbiAgICAgIH0pXG4gICAgfSlcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50ICgpIHtcbiAgICB0aGlzLnRvdXJDaGFubmVsLm9mZigndG91cjpyZXF1ZXN0RWxlbWVudENvb3JkaW5hdGVzJywgdGhpcy5oYW5kbGVGaW5kRWxlbWVudENvb3JkaW5hdGVzKVxuICAgIHRoaXMudG91ckNoYW5uZWwub2ZmKCd0b3VyOnJlcXVlc3RXZWJ2aWV3Q29vcmRpbmF0ZXMnLCB0aGlzLmhhbmRsZUZpbmRXZWJ2aWV3Q29vcmRpbmF0ZXMpXG4gIH1cblxuICBoYW5kbGVGaW5kRWxlbWVudENvb3JkaW5hdGVzICh7IHNlbGVjdG9yLCB3ZWJ2aWV3IH0pIHtcbiAgICBpZiAod2VidmlldyAhPT0gJ2NyZWF0b3InKSB7IHJldHVybiB9XG5cbiAgICB0cnkge1xuICAgICAgLy8gVE9ETzogZmluZCBpZiB0aGVyZSBpcyBhIGJldHRlciBzb2x1dGlvbiB0byB0aGlzIHNjYXBlIGhhdGNoXG4gICAgICBsZXQgZWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpXG4gICAgICBsZXQgeyB0b3AsIGxlZnQgfSA9IGVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcblxuICAgICAgdGhpcy50b3VyQ2hhbm5lbC5yZWNlaXZlRWxlbWVudENvb3JkaW5hdGVzKCdjcmVhdG9yJywgeyB0b3AsIGxlZnQgfSlcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5lcnJvcihgW2NyZWF0b3JdIGVycm9yIGZldGNoaW5nICR7c2VsZWN0b3J9IGluIHdlYnZpZXcgJHt3ZWJ2aWV3fWApXG4gICAgfVxuICB9XG5cbiAgaGFuZGxlRmluZFdlYnZpZXdDb29yZGluYXRlcyAoKSB7XG4gICAgdGhpcy50b3VyQ2hhbm5lbC5yZWNlaXZlV2Vidmlld0Nvb3JkaW5hdGVzKCdjcmVhdG9yJywgeyB0b3A6IDAsIGxlZnQ6IDAgfSlcbiAgfVxuXG4gIGhhbmRsZVBhbmVSZXNpemUgKCkge1xuICAgIC8vIHRoaXMubGF5b3V0LmVtaXQoJ3Jlc2l6ZScpXG4gIH1cblxuICByZW5kZXJOb3RpZmljYXRpb25zIChjb250ZW50LCBpKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxUb2FzdFxuICAgICAgICB0b2FzdFR5cGU9e2NvbnRlbnQudHlwZX1cbiAgICAgICAgdG9hc3RUaXRsZT17Y29udGVudC50aXRsZX1cbiAgICAgICAgdG9hc3RNZXNzYWdlPXtjb250ZW50Lm1lc3NhZ2V9XG4gICAgICAgIGNsb3NlVGV4dD17Y29udGVudC5jbG9zZVRleHR9XG4gICAgICAgIGtleT17aSArIGNvbnRlbnQudGl0bGV9XG4gICAgICAgIG15S2V5PXtpfVxuICAgICAgICByZW1vdmVOb3RpY2U9e3RoaXMucmVtb3ZlTm90aWNlfVxuICAgICAgICBsaWdodFNjaGVtZT17Y29udGVudC5saWdodFNjaGVtZX0gLz5cbiAgICApXG4gIH1cblxuICBzZXREYXNoYm9hcmRWaXNpYmlsaXR5IChkYXNoYm9hcmRWaXNpYmxlKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7ZGFzaGJvYXJkVmlzaWJsZX0pXG4gIH1cblxuICBzd2l0Y2hBY3RpdmVOYXYgKGFjdGl2ZU5hdikge1xuICAgIHRoaXMuc2V0U3RhdGUoe2FjdGl2ZU5hdn0pXG5cbiAgICBpZiAoYWN0aXZlTmF2ID09PSAnc3RhdGVfaW5zcGVjdG9yJykge1xuICAgICAgdGhpcy50b3VyQ2hhbm5lbC5uZXh0KClcbiAgICB9XG4gIH1cblxuICBhdXRoZW50aWNhdGVVc2VyICh1c2VybmFtZSwgcGFzc3dvcmQsIGNiKSB7XG4gICAgcmV0dXJuIHRoaXMucHJvcHMud2Vic29ja2V0LnJlcXVlc3QoeyBtZXRob2Q6ICdhdXRoZW50aWNhdGVVc2VyJywgcGFyYW1zOiBbdXNlcm5hbWUsIHBhc3N3b3JkXSB9LCAoZXJyb3IsIGF1dGhBbnN3ZXIpID0+IHtcbiAgICAgIGlmIChlcnJvcikgcmV0dXJuIGNiKGVycm9yKVxuICAgICAgbWl4cGFuZWwubWVyZ2VUb1BheWxvYWQoeyBkaXN0aW5jdF9pZDogdXNlcm5hbWUgfSlcbiAgICAgIG1peHBhbmVsLmhhaWt1VHJhY2soJ2NyZWF0b3I6dXNlci1hdXRoZW50aWNhdGVkJywgeyB1c2VybmFtZSB9KVxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIHVzZXJuYW1lLFxuICAgICAgICBwYXNzd29yZCxcbiAgICAgICAgYXV0aFRva2VuOiBhdXRoQW5zd2VyICYmIGF1dGhBbnN3ZXIuYXV0aFRva2VuLFxuICAgICAgICBvcmdhbml6YXRpb25OYW1lOiBhdXRoQW5zd2VyICYmIGF1dGhBbnN3ZXIub3JnYW5pemF0aW9uTmFtZSxcbiAgICAgICAgaXNVc2VyQXV0aGVudGljYXRlZDogYXV0aEFuc3dlciAmJiBhdXRoQW5zd2VyLmlzQXV0aGVkXG4gICAgICB9KVxuICAgICAgcmV0dXJuIGNiKG51bGwsIGF1dGhBbnN3ZXIpXG4gICAgfSlcbiAgfVxuXG4gIGF1dGhlbnRpY2F0aW9uQ29tcGxldGUgKCkge1xuICAgIHJldHVybiB0aGlzLnNldFN0YXRlKHsgaXNVc2VyQXV0aGVudGljYXRlZDogdHJ1ZSB9KVxuICB9XG5cbiAgcmVjZWl2ZVByb2plY3RJbmZvIChwcm9qZWN0SW5mbykge1xuICAgIC8vIE5PLU9QXG4gIH1cblxuICBsb2FkUHJvamVjdHMgKGNiKSB7XG4gICAgcmV0dXJuIHRoaXMucHJvcHMud2Vic29ja2V0LnJlcXVlc3QoeyBtZXRob2Q6ICdsaXN0UHJvamVjdHMnLCBwYXJhbXM6IFtdIH0sIChlcnJvciwgcHJvamVjdHNMaXN0KSA9PiB7XG4gICAgICBpZiAoZXJyb3IpIHJldHVybiBjYihlcnJvcilcbiAgICAgIHRoaXMuc2V0U3RhdGUoeyBwcm9qZWN0c0xpc3QgfSlcbiAgICAgIGlwY1JlbmRlcmVyLnNlbmQoJ3JlbmRlcmVyOnByb2plY3RzLWxpc3QtZmV0Y2hlZCcsIHByb2plY3RzTGlzdClcbiAgICAgIHJldHVybiBjYihudWxsLCBwcm9qZWN0c0xpc3QpXG4gICAgfSlcbiAgfVxuXG4gIGxhdW5jaFByb2plY3QgKHByb2plY3ROYW1lLCBwcm9qZWN0T2JqZWN0LCBjYikge1xuICAgIHByb2plY3RPYmplY3QgPSB7XG4gICAgICBza2lwQ29udGVudENyZWF0aW9uOiB0cnVlLCAvLyBWRVJZIElNUE9SVEFOVCAtIGlmIG5vdCBzZXQgdG8gdHJ1ZSwgd2UgY2FuIGVuZCB1cCBpbiBhIHNpdHVhdGlvbiB3aGVyZSB3ZSBvdmVyd3JpdGUgZnJlc2hseSBjbG9uZWQgY29udGVudCBmcm9tIHRoZSByZW1vdGUhXG4gICAgICBwcm9qZWN0c0hvbWU6IHByb2plY3RPYmplY3QucHJvamVjdHNIb21lLFxuICAgICAgcHJvamVjdFBhdGg6IHByb2plY3RPYmplY3QucHJvamVjdFBhdGgsXG4gICAgICBvcmdhbml6YXRpb25OYW1lOiB0aGlzLnN0YXRlLm9yZ2FuaXphdGlvbk5hbWUsXG4gICAgICBhdXRob3JOYW1lOiB0aGlzLnN0YXRlLnVzZXJuYW1lLFxuICAgICAgcHJvamVjdE5hbWUgLy8gSGF2ZSB0byBzZXQgdGhpcyBoZXJlLCBiZWNhdXNlIHdlIHBhc3MgdGhpcyB3aG9sZSBvYmplY3QgdG8gU3RhdGVUaXRsZUJhciwgd2hpY2ggbmVlZHMgdGhpcyB0byBwcm9wZXJseSBjYWxsIHNhdmVQcm9qZWN0XG4gICAgfVxuXG4gICAgbWl4cGFuZWwuaGFpa3VUcmFjaygnY3JlYXRvcjpwcm9qZWN0OmxhdW5jaGluZycsIHtcbiAgICAgIHVzZXJuYW1lOiB0aGlzLnN0YXRlLnVzZXJuYW1lLFxuICAgICAgcHJvamVjdDogcHJvamVjdE5hbWUsXG4gICAgICBvcmdhbml6YXRpb246IHRoaXMuc3RhdGUub3JnYW5pemF0aW9uTmFtZVxuICAgIH0pXG5cbiAgICByZXR1cm4gdGhpcy5wcm9wcy53ZWJzb2NrZXQucmVxdWVzdCh7IG1ldGhvZDogJ2luaXRpYWxpemVQcm9qZWN0JywgcGFyYW1zOiBbcHJvamVjdE5hbWUsIHByb2plY3RPYmplY3QsIHRoaXMuc3RhdGUudXNlcm5hbWUsIHRoaXMuc3RhdGUucGFzc3dvcmRdIH0sIChlcnIsIHByb2plY3RGb2xkZXIpID0+IHtcbiAgICAgIGlmIChlcnIpIHJldHVybiBjYihlcnIpXG5cbiAgICAgIHJldHVybiB0aGlzLnByb3BzLndlYnNvY2tldC5yZXF1ZXN0KHsgbWV0aG9kOiAnc3RhcnRQcm9qZWN0JywgcGFyYW1zOiBbcHJvamVjdE5hbWUsIHByb2plY3RGb2xkZXJdIH0sIChlcnIsIGFwcGxpY2F0aW9uSW1hZ2UpID0+IHtcbiAgICAgICAgaWYgKGVycikgcmV0dXJuIGNiKGVycilcblxuICAgICAgICAvLyBBc3NpZ24sIG5vdCBtZXJnZSwgc2luY2Ugd2UgZG9uJ3Qgd2FudCB0byBjbG9iYmVyIGFueSB2YXJpYWJsZXMgYWxyZWFkeSBzZXQsIGxpa2UgcHJvamVjdCBuYW1lXG4gICAgICAgIGxvZGFzaC5hc3NpZ24ocHJvamVjdE9iamVjdCwgYXBwbGljYXRpb25JbWFnZS5wcm9qZWN0KVxuXG4gICAgICAgIG1peHBhbmVsLmhhaWt1VHJhY2soJ2NyZWF0b3I6cHJvamVjdDpsYXVuY2hlZCcsIHtcbiAgICAgICAgICB1c2VybmFtZTogdGhpcy5zdGF0ZS51c2VybmFtZSxcbiAgICAgICAgICBwcm9qZWN0OiBwcm9qZWN0TmFtZSxcbiAgICAgICAgICBvcmdhbml6YXRpb246IHRoaXMuc3RhdGUub3JnYW5pemF0aW9uTmFtZVxuICAgICAgICB9KVxuXG4gICAgICAgIC8vIE5vdyBoYWNraWx5IGNoYW5nZSBzb21lIHBvaW50ZXJzIHNvIHdlJ3JlIHJlZmVycmluZyB0byB0aGUgY29ycmVjdCBwbGFjZVxuICAgICAgICB0aGlzLnByb3BzLndlYnNvY2tldC5mb2xkZXIgPSBwcm9qZWN0Rm9sZGVyIC8vIERvIG5vdCByZW1vdmUgdGhpcyBuZWNlc3NhcnkgaGFjayBwbHpcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHByb2plY3RGb2xkZXIsIGFwcGxpY2F0aW9uSW1hZ2UsIHByb2plY3RPYmplY3QsIHByb2plY3ROYW1lLCBkYXNoYm9hcmRWaXNpYmxlOiBmYWxzZSB9KVxuXG4gICAgICAgIHJldHVybiBjYigpXG4gICAgICB9KVxuICAgIH0pXG4gIH1cblxuICBsYXVuY2hGb2xkZXIgKG1heWJlUHJvamVjdE5hbWUsIHByb2plY3RGb2xkZXIsIGNiKSB7XG4gICAgbWl4cGFuZWwuaGFpa3VUcmFjaygnY3JlYXRvcjpmb2xkZXI6bGF1bmNoaW5nJywge1xuICAgICAgdXNlcm5hbWU6IHRoaXMuc3RhdGUudXNlcm5hbWUsXG4gICAgICBwcm9qZWN0OiBtYXliZVByb2plY3ROYW1lXG4gICAgfSlcblxuICAgIC8vIFRoZSBsYXVuY2hQcm9qZWN0IG1ldGhvZCBoYW5kbGVzIHRoZSBwZXJmb3JtRm9sZGVyUG9pbnRlckNoYW5nZVxuICAgIHJldHVybiB0aGlzLmxhdW5jaFByb2plY3QobWF5YmVQcm9qZWN0TmFtZSwgeyBwcm9qZWN0UGF0aDogcHJvamVjdEZvbGRlciB9LCBjYilcbiAgfVxuXG4gIHJlbW92ZU5vdGljZSAoaW5kZXgsIGlkKSB7XG4gICAgY29uc3Qgbm90aWNlcyA9IHRoaXMuc3RhdGUubm90aWNlc1xuICAgIGlmIChpbmRleCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgbm90aWNlczogWy4uLm5vdGljZXMuc2xpY2UoMCwgaW5kZXgpLCAuLi5ub3RpY2VzLnNsaWNlKGluZGV4ICsgMSldXG4gICAgICB9KVxuICAgIH0gZWxzZSBpZiAoaWQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgLy8gSGFja2Fyb29cbiAgICAgIGxvZGFzaC5lYWNoKG5vdGljZXMsIChub3RpY2UsIGluZGV4KSA9PiB7XG4gICAgICAgIGlmIChub3RpY2UuaWQgPT09IGlkKSB0aGlzLnJlbW92ZU5vdGljZShpbmRleClcbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgY3JlYXRlTm90aWNlIChub3RpY2UpIHtcbiAgICAvKiBFeHBlY3RzIHRoZSBvYmplY3Q6XG4gICAgeyB0eXBlOiBzdHJpbmcgKGluZm8sIHN1Y2Nlc3MsIGRhbmdlciAob3IgZXJyb3IpLCB3YXJuaW5nKVxuICAgICAgdGl0bGU6IHN0cmluZyxcbiAgICAgIG1lc3NhZ2U6IHN0cmluZyxcbiAgICAgIGNsb3NlVGV4dDogc3RyaW5nIChvcHRpb25hbCwgZGVmYXVsdHMgdG8gJ2Nsb3NlJylcbiAgICAgIGxpZ2h0U2NoZW1lOiBib29sIChvcHRpb25hbCwgZGVmYXVsdHMgdG8gZGFyaylcbiAgICB9ICovXG5cbiAgICBub3RpY2UuaWQgPSBNYXRoLnJhbmRvbSgpICsgJydcblxuICAgIGNvbnN0IG5vdGljZXMgPSB0aGlzLnN0YXRlLm5vdGljZXNcbiAgICBsZXQgcmVwbGFjZWRFeGlzdGluZyA9IGZhbHNlXG5cbiAgICBub3RpY2VzLmZvckVhY2goKG4sIGkpID0+IHtcbiAgICAgIGlmIChuLm1lc3NhZ2UgPT09IG5vdGljZS5tZXNzYWdlKSB7XG4gICAgICAgIG5vdGljZXMuc3BsaWNlKGksIDEpXG4gICAgICAgIHJlcGxhY2VkRXhpc3RpbmcgPSB0cnVlXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyBub3RpY2VzIH0sICgpID0+IHtcbiAgICAgICAgICBub3RpY2VzLnVuc2hpZnQobm90aWNlKVxuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBub3RpY2VzIH0pXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfSlcblxuICAgIGlmICghcmVwbGFjZWRFeGlzdGluZykge1xuICAgICAgbm90aWNlcy51bnNoaWZ0KG5vdGljZSlcbiAgICAgIHRoaXMuc2V0U3RhdGUoeyBub3RpY2VzIH0pXG4gICAgfVxuXG4gICAgcmV0dXJuIG5vdGljZVxuICB9XG5cbiAgb25MaWJyYXJ5RHJhZ0VuZCAoZHJhZ0VuZE5hdGl2ZUV2ZW50LCBsaWJyYXJ5SXRlbUluZm8pIHtcbiAgICB0aGlzLnNldFN0YXRlKHsgbGlicmFyeUl0ZW1EcmFnZ2luZzogbnVsbCB9KVxuICAgIGlmIChsaWJyYXJ5SXRlbUluZm8gJiYgbGlicmFyeUl0ZW1JbmZvLnByZXZpZXcpIHtcbiAgICAgIHRoaXMucmVmcy5zdGFnZS5oYW5kbGVEcm9wKGxpYnJhcnlJdGVtSW5mbywgdGhpcy5fbGFzdE1vdXNlWCwgdGhpcy5fbGFzdE1vdXNlWSlcbiAgICB9XG4gIH1cblxuICBvbkxpYnJhcnlEcmFnU3RhcnQgKGRyYWdTdGFydE5hdGl2ZUV2ZW50LCBsaWJyYXJ5SXRlbUluZm8pIHtcbiAgICB0aGlzLnNldFN0YXRlKHsgbGlicmFyeUl0ZW1EcmFnZ2luZzogbGlicmFyeUl0ZW1JbmZvIH0pXG4gIH1cblxuICBvbkF1dG9VcGRhdGVDaGVja0NvbXBsZXRlICgpIHtcbiAgICB0aGlzLnNldFN0YXRlKHsgaGFzQ2hlY2tlZEZvclVwZGF0ZXM6IHRydWUgfSlcbiAgfVxuXG4gIHJlbmRlclN0YXJ0dXBEZWZhdWx0U2NyZWVuICgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBzdHlsZT17eyBwb3NpdGlvbjogJ2Fic29sdXRlJywgd2lkdGg6ICcxMDAlJywgaGVpZ2h0OiAnMTAwJScgfX0+XG4gICAgICAgIDxSZWFjdENTU1RyYW5zaXRpb25Hcm91cFxuICAgICAgICAgIHRyYW5zaXRpb25OYW1lPSd0b2FzdCdcbiAgICAgICAgICB0cmFuc2l0aW9uRW50ZXJUaW1lb3V0PXs1MDB9XG4gICAgICAgICAgdHJhbnNpdGlvbkxlYXZlVGltZW91dD17MzAwfT5cbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7cG9zaXRpb246ICdhYnNvbHV0ZScsIHJpZ2h0OiAwLCB0b3A6IDAsIHdpZHRoOiAzMDB9fT5cbiAgICAgICAgICAgIHtsb2Rhc2gubWFwKHRoaXMuc3RhdGUubm90aWNlcywgdGhpcy5yZW5kZXJOb3RpZmljYXRpb25zKX1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9SZWFjdENTU1RyYW5zaXRpb25Hcm91cD5cbiAgICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAndGFibGUnLCB3aWR0aDogJzEwMCUnLCBoZWlnaHQ6ICcxMDAlJywgcG9zaXRpb246ICdhYnNvbHV0ZScsIHRvcDogMCwgbGVmdDogMCB9fT5cbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6ICd0YWJsZS1jZWxsJywgd2lkdGg6ICcxMDAlJywgaGVpZ2h0OiAnMTAwJScsIHZlcnRpY2FsQWxpZ246ICdtaWRkbGUnLCB0ZXh0QWxpZ246ICdjZW50ZXInIH19PlxuICAgICAgICAgICAgPHN2ZyB3aWR0aD0nMTcwcHgnIGhlaWdodD0nMjIxcHgnIHZpZXdCb3g9JzAgMCAxNzAgMjIxJyB2ZXJzaW9uPScxLjEnPlxuICAgICAgICAgICAgICA8ZyBpZD0nUGFnZS0xJyBzdHJva2U9J25vbmUnIHN0cm9rZVdpZHRoPScxJyBmaWxsPSdub25lJyBmaWxsUnVsZT0nZXZlbm9kZCc+XG4gICAgICAgICAgICAgICAgPGcgaWQ9J091dGxpbmVkJyB0cmFuc2Zvcm09J3RyYW5zbGF0ZSgtMjExLjAwMDAwMCwgLTExNC4wMDAwMDApJyBmaWxsUnVsZT0nbm9uemVybycgZmlsbD0nI0ZBRkNGRCc+XG4gICAgICAgICAgICAgICAgICA8ZyBpZD0nb3V0bGluZWQtbG9nbycgdHJhbnNmb3JtPSd0cmFuc2xhdGUoMjExLjAwMDAwMCwgMTEzLjAwMDAwMCknPlxuICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSdNNDcuNSwxNTIuNzk4ODIzIEwyNi4zODIzNDMyLDE0My45NTQ2NzYgQzI0LjU5OTM5NDEsMTQzLjIwNzk3MSAyMy43NTkzNTI0LDE0MS4xNTcyODEgMjQuNTA2MDU3NiwxMzkuMzc0MzMyIEMyNS4yNTI3NjI4LDEzNy41OTEzODMgMjcuMzAzNDUyNywxMzYuNzUxMzQxIDI5LjA4NjQwMTgsMTM3LjQ5ODA0NiBMMTE3Ljc4MDA1OCwxNzQuNjQ0NTYgTDEyMC45OTAwMjEsMTc2LjA4OTA3NCBDMTIyLjQ4NjgxNCwxNzYuNzYyNjQ1IDEyMy4yNzkzMDQsMTc4LjM1ODI1MSAxMjIuOTk4Njk4LDE3OS45MDM1OTggQzEyMi45OTk1NjQsMTc5LjkzNTYyNiAxMjMsMTc5Ljk2Nzc2MiAxMjMsMTgwIEwxMjMsMjA1LjYzOTcyMiBMMTM4LjUxMDcxNiwyMTEuOTEwMDExIEwxNDMuMzY4NDIxLDIxMy44NzM3NjQgTDE2Mi44MzMzMzMsMjA2LjAwNDk3IEwxNjIuODMzMzMzLDE2LjI5MjkwMjUgTDE0Myw4LjI3NTE3MjA0IEwxMjIuODMzMzMzLDE2LjQyNzY1NDMgTDEyMi44MzMzMzMsNTMuNjAxMzI5NSBDMTIyLjgzNDIxOCw1My42NDY2NDg5IDEyMi44MzQyMTUsNTMuNjkxOTAxNSAxMjIuODMzMzMzLDUzLjczNzA2MzQgTDEyMi44MzMzMzMsNTQgQzEyMi44MzMzMzMsNTUuOTMyOTk2NiAxMjEuMjY2MzMsNTcuNSAxMTkuMzMzMzMzLDU3LjUgQzExOS4yODg0Myw1Ny41IDExOS4yNDM3MjQsNTcuNDk5MTU0NCAxMTkuMTk5MjMsNTcuNDk3NDc4MiBMNTMuMzA3NjM4LDg0LjAzNzE0OSBDNTEuNTE0NjE4Myw4NC43NTkzMzc1IDQ5LjQ3NTYzOTIsODMuODkxMjU3MyA0OC43NTM0NTA2LDgyLjA5ODIzNzYgQzQ4LjAzMTI2MjEsODAuMzA1MjE3OSA0OC44OTkzNDIzLDc4LjI2NjIzODggNTAuNjkyMzYyLDc3LjU0NDA1MDIgTDExNS44MzMzMzMsNTEuMzA2NzEyOSBMMTE1LjgzMzMzMywxNC40OTc0MjI3IEMxMTUuODMzMzMzLDE0LjAxNDMxNzggMTE1LjkzMTIxMywxMy41NTQwNzM5IDExNi4xMDgyMjIsMTMuMTM1NDM5OSBDMTE2LjM3NDUzOSwxMi4wOTQxMjkyIDExNy4xMTUzMjYsMTEuMTg4ODQ0OSAxMTguMTg4MjM4LDEwLjc1NTExNDggTDE0MS42ODQxODYsMS4yNTY3NTI3IEMxNDIuMDkxMzE3LDEuMDkxNTI5MzYgMTQyLjUyOTU5LDEuMDAyNDA0NjcgMTQyLjk3NTkzNywwLjk5OTE2NDcyMyBDMTQzLjQ3MDQxLDEuMDAyNDA0NjcgMTQzLjkwODY4MywxLjA5MTUyOTM2IDE0NC4zMTU4MTQsMS4yNTY3NTI3IEwxNjcuODExNzYyLDEwLjc1NTExNDggQzE2OS41MjI5NjgsMTEuNDQ2ODc5IDE3MC4zODkzMjgsMTMuMzM4MTY1OSAxNjkuODMzMzMzLDE1LjA2NzcwNjggTDE2OS44MzMzMzMsMjA4IEMxNjkuODMzMzMzLDIwOC44MjYzMDQgMTY5LjU0Njk5LDIwOS41ODU3MjggMTY5LjA2ODExOCwyMTAuMTg0NDU5IEMxNjguNjkzNzAzLDIxMC44NjczNzggMTY4LjA5MDEzMywyMTEuNDMwMjI0IDE2Ny4zMTE3NjIsMjExLjc0NDg4NSBMMTQ0LjUxNzY0NSwyMjAuOTU5NTI4IEMxNDMuMzMyNTQyLDIyMS40Mzg2MTMgMTQyLjAzODk5NSwyMjEuMjIyMzk3IDE0MS4wODkxNzksMjIwLjUwMjcxMiBMMTM1Ljg4NzE5MiwyMTguMzk5NzgyIEwxMTkuNDYxNTk1LDIxMS43NTk2NDcgQzExNy41NDYyOSwyMTEuNzM5MDU1IDExNiwyMTAuMTgwMDMyIDExNiwyMDguMjU5ODUzIEwxMTYsMjA4LjA3OTExIEMxMTUuOTk4NzY3LDIwOC4wMjU3MDggMTE1Ljk5ODc2MSwyMDcuOTcyMTc4IDExNiwyMDcuOTE4NTU4IEwxMTYsMTgxLjUxODc0OCBMMTE0Ljk5MTcyNywxODEuMDY0NTg5IEw1NC41LDE1NS43MzA0NDcgTDU0LjUsMjA2Ljk5ODI3MyBDNTUuMTM0MTQ2OCwyMDguNjU4MjU2IDU0LjQxOTUzMTUsMjEwLjUxMjkxNSA1Mi44Nzk2NjQ1LDIxMS4zMzMzMzMgQzUyLjU1NDU1NDYsMjExLjU0MDcwOSA1Mi4xOTI5MDQsMjExLjY5NTg2OSA1MS44MDY1Mjk0LDIxMS43ODY5OTcgTDI5Ljc4NjczNzUsMjIwLjY1MDY1NSBDMjguODI1MjUzNSwyMjEuNDc4NzU4IDI3LjQ0NTcwMDUsMjIxLjc1MzIyMSAyNi4xODgyMzc5LDIyMS4yNDQ4ODUgTDIwLjM4NzE5MjEsMjE4Ljg5OTc4MiBMMy4zMDYyNzc4MywyMTEuOTk0NzMxIEMxLjQ2MzM4MTg5LDIxMS44OTQxOTIgLTIuNjA4MzU5OTVlLTE2LDIxMC4zNjc5OTIgMCwyMDguNSBMMi43MDg5NDQxOGUtMTQsMTQuNDk3NDIyNyBDMi43MjQyNDVlLTE0LDEzLjQwMTY0NTggMC41MDM1NjA5NDcsMTIuNDIzNDgxOCAxLjI5MTg5NjY5LDExLjc4MTcxNyBDMS42NTE3MTAxNCwxMS4zNDE2NTA5IDIuMTI0MDU2MjIsMTAuOTgzMTg4MiAyLjY4ODIzNzg5LDEwLjc1NTExNDggTDI2LjE4NDE4NjIsMS4yNTY3NTI3IEMyNi41OTEzMTcyLDEuMDkxNTI5MzYgMjcuMDI5NTg5OCwxLjAwMjQwNDY3IDI3LjQ3NTkzNjcsMC45OTkxNjQ3MjMgQzI3Ljk3MDQxMDIsMS4wMDI0MDQ2NyAyOC40MDg2ODI4LDEuMDkxNTI5MzYgMjguODE1ODEzOCwxLjI1Njc1MjcgTDUyLjMxMTc2MjEsMTAuNzU1MTE0OCBDNTQuMTAzODYyNywxMS40Nzk1ODEgNTQuOTY5MzUxNCwxMy41MTk2NjE1IDU0LjI0NDg4NTIsMTUuMzExNzYyMSBDNTMuNTIwNDE5LDE3LjEwMzg2MjcgNTEuNDgwMzM4NSwxNy45NjkzNTE0IDQ5LjY4ODIzNzksMTcuMjQ0ODg1MiBMMjcuNSw4LjI3NTE3MjA0IEw3LDE2LjU2MjQwNjEgTDcsMjA1LjkzNzU5NCBMMjMuMDEwNzE2NCwyMTIuNDEwMDExIEwyNy4yNTI2OTk1LDIxNC4xMjQ4NTUgTDQ3LjUsMjA1Ljk3NDY4MSBMNDcuNSwxNTIuNzk4ODIzIFonIGlkPSdDb21iaW5lZC1TaGFwZScgLz5cbiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0nTTE0Ni40NTY4MjcsNjMuMDI0MTg0OSBDMTQ2Ljk0ODYwMyw2NC43MTA0NzI0IDE0Ni4xMDU5NzIsNjYuNTMzNjU5MSAxNDQuNDQ3MzA1LDY3LjIyODMxNDkgTDU5LjU0Njg2NzcsMTAyLjc4NDkwOCBMMTIwLjQxNjU3NSwxMjguMjc3MzUgQzEyMi4xOTk1MjQsMTI5LjAyNDA1NSAxMjMuMDM5NTY2LDEzMS4wNzQ3NDUgMTIyLjI5Mjg2MSwxMzIuODU3Njk0IEMxMjEuNTQ2MTU2LDEzNC42NDA2NDMgMTE5LjQ5NTQ2NiwxMzUuNDgwNjg1IDExNy43MTI1MTcsMTM0LjczMzk3OSBMNTAuNDg2NDEzMSwxMDYuNTc5NDU3IEwyOS4zNTIwMjkzLDExNS40MzA2MSBDMjcuNTY5MDgwMiwxMTYuMTc3MzE1IDI1LjUxODM5MDMsMTE1LjMzNzI3MyAyNC43NzE2ODUxLDExMy41NTQzMjQgQzI0LjAyNDk4LDExMS43NzEzNzUgMjQuODY1MDIxNiwxMDkuNzIwNjg1IDI2LjY0Nzk3MDcsMTA4Ljk3Mzk4IEw0Ny41LDEwMC4yNDEwNzkgTDQ3LjUsMTQuNSBDNDcuNSwxMi41NjcwMDM0IDQ5LjA2NzAwMzQsMTEgNTEsMTEgQzUyLjkzMjk5NjYsMTEgNTQuNSwxMi41NjcwMDM0IDU0LjUsMTQuNSBMNTQuNSw5Ny4zMDk0NTQ4IEwxMzMuMzYwMjU3LDY0LjI4MjUwOTggTDExNy4xODgyMzgsNTcuNzQ0ODg1MiBDMTE1LjM5NjEzNyw1Ny4wMjA0MTkgMTE0LjUzMDY0OSw1NC45ODAzMzg1IDExNS4yNTUxMTUsNTMuMTg4MjM3OSBDMTE1Ljk3OTU4MSw1MS4zOTYxMzczIDExOC4wMTk2NjEsNTAuNTMwNjQ4NiAxMTkuODExNzYyLDUxLjI1NTExNDggTDEzOS41LDU5LjIxNDE4OTcgTDEzOS41LDI1Ljg2MDI3ODQgTDEzNS44ODcxOTIsMjQuMzk5NzgxNiBMMTE4LjE4ODIzOCwxNy4yNDQ4ODUyIEMxMTYuMzk2MTM3LDE2LjUyMDQxOSAxMTUuNTMwNjQ5LDE0LjQ4MDMzODUgMTE2LjI1NTExNSwxMi42ODgyMzc5IEMxMTYuOTc5NTgxLDEwLjg5NjEzNzMgMTE5LjAxOTY2MSwxMC4wMzA2NDg2IDEyMC44MTE3NjIsMTAuNzU1MTE0OCBMMTM4LjUxMDcxNiwxNy45MTAwMTEyIEwxNDMuMzY4NDIxLDE5Ljg3Mzc2NDEgTDE2NC42ODgyMzgsMTEuMjU1MTE0OCBDMTY2LjQ4MDMzOSwxMC41MzA2NDg2IDE2OC41MjA0MTksMTEuMzk2MTM3MyAxNjkuMjQ0ODg1LDEzLjE4ODIzNzkgQzE2OS45NjkzNTEsMTQuOTgwMzM4NSAxNjkuMTAzODYzLDE3LjAyMDQxOSAxNjcuMzExNzYyLDE3Ljc0NDg4NTIgTDE0Ni41LDI2LjE1ODE1MDggTDE0Ni41LDYyLjQ3Mjg3NDkgQzE0Ni41LDYyLjY2MDQ1NzQgMTQ2LjQ4NTI0Myw2Mi44NDQ1OTMzIDE0Ni40NTY4MjcsNjMuMDI0MTg0OSBaJyBpZD0nQ29tYmluZWQtU2hhcGUnIC8+XG4gICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9J00xMzkuNSw5Ni4zMzA4MDY5IEwxMjIuODMzMzMzLDEwMy4zMTA4NjQgTDEyMi44MzMzMzMsMTUxLjM3Mjc5OSBDMTIyLjgzMzMzMywxNTMuMzA1Nzk1IDEyMS4yNjYzMywxNTQuODcyNzk5IDExOS4zMzMzMzMsMTU0Ljg3Mjc5OSBDMTE4LjUzNTcxOSwxNTQuODcyNzk5IDExNy44MDA0MiwxNTQuNjA1OTk0IDExNy4yMTE4MTYsMTU0LjE1Njc2MyBMMjYuNjQ3OTcwNywxMTYuMjI4MzE1IEMyNi4wOTc2NzA2LDExNS45OTc4NDcgMjUuNjM3MTk0LDExNS42NDMxNTkgMjUuMjg1NDcxNCwxMTUuMjEwNDYyIEMyNC41MDA4MjU4LDExNC41Njg2MiAyNCwxMTMuNTkyNzk3IDI0LDExMi41IEwyNCwyNS44NjAyNzg0IEwyMC4zODcxOTIxLDI0LjM5OTc4MTYgTDIuNjg4MjM3ODksMTcuMjQ0ODg1MiBDMC44OTYxMzcyNTgsMTYuNTIwNDE5IDAuMDMwNjQ4NTU4OSwxNC40ODAzMzg1IDAuNzU1MTE0NzcsMTIuNjg4MjM3OSBDMS40Nzk1ODA5OCwxMC44OTYxMzczIDMuNTE5NjYxNDksMTAuMDMwNjQ4NiA1LjMxMTc2MjExLDEwLjc1NTExNDggTDIzLjAxMDcxNjQsMTcuOTEwMDExMiBMMjcuODY4NDIxMSwxOS44NzM3NjQxIEw0OS4xODgyMzc5LDExLjI1NTExNDggQzUwLjk4MDMzODUsMTAuNTMwNjQ4NiA1My4wMjA0MTksMTEuMzk2MTM3MyA1My43NDQ4ODUyLDEzLjE4ODIzNzkgQzU0LjQ2OTM1MTQsMTQuOTgwMzM4NSA1My42MDM4NjI3LDE3LjAyMDQxOSA1MS44MTE3NjIxLDE3Ljc0NDg4NTIgTDMxLDI2LjE1ODE1MDggTDMxLDExMC40NjE4NjEgTDExNS44MzMzMzMsMTQ1Ljk5MDM1MSBMMTE1LjgzMzMzMywxMDYuMjQyNDg4IEw4NC4yNTk2NjE2LDExOS40NjU2NDkgQzgyLjQ3NjcxMjUsMTIwLjIxMjM1NSA4MC40MjYwMjI2LDExOS4zNzIzMTMgNzkuNjc5MzE3NCwxMTcuNTg5MzY0IEM3OC45MzI2MTIzLDExNS44MDY0MTUgNzkuNzcyNjUzOSwxMTMuNzU1NzI1IDgxLjU1NTYwMywxMTMuMDA5MDIgTDE0MS4wNTIxNTEsODguMDkxNjYyMiBDMTQxLjYwODk3NCw4Ny43MTc5OTMgMTQyLjI3OTAzLDg3LjUgMTQzLDg3LjUgQzE0NC45MzI5OTcsODcuNSAxNDYuNSw4OS4wNjcwMDM0IDE0Ni41LDkxIEwxNDYuNSwyMTcuNjMwNDggQzE0Ni41LDIxOS41NjM0NzcgMTQ0LjkzMjk5NywyMjEuMTMwNDggMTQzLDIyMS4xMzA0OCBDMTQxLjA2NzAwMywyMjEuMTMwNDggMTM5LjUsMjE5LjU2MzQ3NyAxMzkuNSwyMTcuNjMwNDggTDEzOS41LDk2LjMzMDgwNjkgWiBNMzEsMTQxIEwzMSwyMTcuMDU1MjM3IEMzMSwyMTguOTg4MjM0IDI5LjQzMjk5NjYsMjIwLjU1NTIzNyAyNy41LDIyMC41NTUyMzcgQzI1LjU2NzAwMzQsMjIwLjU1NTIzNyAyNCwyMTguOTg4MjM0IDI0LDIxNy4wNTUyMzcgTDI0LDE0MSBDMjQsMTM5LjA2NzAwMyAyNS41NjcwMDM0LDEzNy41IDI3LjUsMTM3LjUgQzI5LjQzMjk5NjYsMTM3LjUgMzEsMTM5LjA2NzAwMyAzMSwxNDEgWicgaWQ9J0NvbWJpbmVkLVNoYXBlJyAvPlxuICAgICAgICAgICAgICAgICAgPC9nPlxuICAgICAgICAgICAgICAgIDwvZz5cbiAgICAgICAgICAgICAgPC9nPlxuICAgICAgICAgICAgPC9zdmc+XG4gICAgICAgICAgICA8YnIgLz5cbiAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGNvbG9yOiAnI0ZBRkNGRCcsIGRpc3BsYXk6ICdpbmxpbmUtYmxvY2snLCB3aWR0aDogJzEwMCUnLCBoZWlnaHQ6IDUwLCBwb3NpdGlvbjogJ2Fic29sdXRlJywgYm90dG9tOiA1MCwgbGVmdDogMCB9fT57dGhpcy5zdGF0ZS5zb2Z0d2FyZVZlcnNpb259PC9zcGFuPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHJlbmRlciAoKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUucmVhZHlGb3JBdXRoICYmICghdGhpcy5zdGF0ZS5pc1VzZXJBdXRoZW50aWNhdGVkIHx8ICF0aGlzLnN0YXRlLnVzZXJuYW1lKSkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPFN0eWxlUm9vdD5cbiAgICAgICAgICA8QXV0aGVudGljYXRpb25VSVxuICAgICAgICAgICAgb25TdWJtaXQ9e3RoaXMuYXV0aGVudGljYXRlVXNlcn1cbiAgICAgICAgICAgIG9uU3VibWl0U3VjY2Vzcz17dGhpcy5hdXRoZW50aWNhdGlvbkNvbXBsZXRlfVxuICAgICAgICAgICAgey4uLnRoaXMucHJvcHN9IC8+XG4gICAgICAgIDwvU3R5bGVSb290PlxuICAgICAgKVxuICAgIH1cblxuICAgIGlmICghdGhpcy5zdGF0ZS5pc1VzZXJBdXRoZW50aWNhdGVkIHx8ICF0aGlzLnN0YXRlLnVzZXJuYW1lKSB7XG4gICAgICByZXR1cm4gdGhpcy5yZW5kZXJTdGFydHVwRGVmYXVsdFNjcmVlbigpXG4gICAgfVxuXG4gICAgaWYgKHRoaXMuc3RhdGUuZGFzaGJvYXJkVmlzaWJsZSkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdj5cbiAgICAgICAgICA8UHJvamVjdEJyb3dzZXJcbiAgICAgICAgICAgIGxvYWRQcm9qZWN0cz17dGhpcy5sb2FkUHJvamVjdHN9XG4gICAgICAgICAgICBsYXVuY2hQcm9qZWN0PXt0aGlzLmxhdW5jaFByb2plY3R9XG4gICAgICAgICAgICBjcmVhdGVOb3RpY2U9e3RoaXMuY3JlYXRlTm90aWNlfVxuICAgICAgICAgICAgcmVtb3ZlTm90aWNlPXt0aGlzLnJlbW92ZU5vdGljZX1cbiAgICAgICAgICAgIG5vdGljZXM9e3RoaXMuc3RhdGUubm90aWNlc31cbiAgICAgICAgICAgIGVudm95PXt0aGlzLmVudm95fVxuICAgICAgICAgICAgey4uLnRoaXMucHJvcHN9IC8+XG4gICAgICAgICAgPFRvdXIgcHJvamVjdHNMaXN0PXt0aGlzLnN0YXRlLnByb2plY3RzTGlzdH0gZW52b3k9e3RoaXMuZW52b3l9IHN0YXJ0VG91ck9uTW91bnQgLz5cbiAgICAgICAgICA8QXV0b1VwZGF0ZXIgb25BdXRvVXBkYXRlQ2hlY2tDb21wbGV0ZT17dGhpcy5vbkF1dG9VcGRhdGVDaGVja0NvbXBsZXRlfSBzaG91bGREaXNwbGF5PXshdGhpcy5zdGF0ZS5oYXNDaGVja2VkRm9yVXBkYXRlc30gLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICApXG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLnN0YXRlLnByb2plY3RGb2xkZXIpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgPFRvdXIgcHJvamVjdHNMaXN0PXt0aGlzLnN0YXRlLnByb2plY3RzTGlzdH0gZW52b3k9e3RoaXMuZW52b3l9IC8+XG4gICAgICAgICAgPEF1dG9VcGRhdGVyIG9uQXV0b1VwZGF0ZUNoZWNrQ29tcGxldGU9e3RoaXMub25BdXRvVXBkYXRlQ2hlY2tDb21wbGV0ZX0gc2hvdWxkRGlzcGxheT17IXRoaXMuc3RhdGUuaGFzQ2hlY2tlZEZvclVwZGF0ZXN9IC8+XG4gICAgICAgICAgPFByb2plY3RCcm93c2VyXG4gICAgICAgICAgICBsb2FkUHJvamVjdHM9e3RoaXMubG9hZFByb2plY3RzfVxuICAgICAgICAgICAgbGF1bmNoUHJvamVjdD17dGhpcy5sYXVuY2hQcm9qZWN0fVxuICAgICAgICAgICAgY3JlYXRlTm90aWNlPXt0aGlzLmNyZWF0ZU5vdGljZX1cbiAgICAgICAgICAgIHJlbW92ZU5vdGljZT17dGhpcy5yZW1vdmVOb3RpY2V9XG4gICAgICAgICAgICBub3RpY2VzPXt0aGlzLnN0YXRlLm5vdGljZXN9XG4gICAgICAgICAgICBlbnZveT17dGhpcy5lbnZveX1cbiAgICAgICAgICAgIHsuLi50aGlzLnByb3BzfSAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIClcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuc3RhdGUuYXBwbGljYXRpb25JbWFnZSB8fCB0aGlzLnN0YXRlLmZvbGRlckxvYWRpbmdFcnJvcikge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBzdHlsZT17eyBwb3NpdGlvbjogJ2Fic29sdXRlJywgd2lkdGg6ICcxMDAlJywgaGVpZ2h0OiAnMTAwJScgfX0+XG4gICAgICAgICAgPFJlYWN0Q1NTVHJhbnNpdGlvbkdyb3VwXG4gICAgICAgICAgICB0cmFuc2l0aW9uTmFtZT0ndG9hc3QnXG4gICAgICAgICAgICB0cmFuc2l0aW9uRW50ZXJUaW1lb3V0PXs1MDB9XG4gICAgICAgICAgICB0cmFuc2l0aW9uTGVhdmVUaW1lb3V0PXszMDB9PlxuICAgICAgICAgICAgPGRpdiBzdHlsZT17e3Bvc2l0aW9uOiAnYWJzb2x1dGUnLCByaWdodDogMCwgdG9wOiAwLCB3aWR0aDogMzAwfX0+XG4gICAgICAgICAgICAgIHtsb2Rhc2gubWFwKHRoaXMuc3RhdGUubm90aWNlcywgdGhpcy5yZW5kZXJOb3RpZmljYXRpb25zKX1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvUmVhY3RDU1NUcmFuc2l0aW9uR3JvdXA+XG4gICAgICAgICAgPGRpdiBzdHlsZT17eyBwb3NpdGlvbjogJ3JlbGF0aXZlJywgd2lkdGg6ICcxMDAlJywgaGVpZ2h0OiAnMTAwJScgfX0+XG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IHBvc2l0aW9uOiAnYWJzb2x1dGUnLCB0b3A6ICc1MCUnLCBsZWZ0OiAnNTAlJywgdHJhbnNmb3JtOiAndHJhbnNsYXRlKC01MCUsIC01MCUpJyB9fT5cbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgZm9udFNpemU6IDI0LCBjb2xvcjogJyMyMjInIH19PkxvYWRpbmcgcHJvamVjdC4uLjwvc3Bhbj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIClcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBzdHlsZT17eyBwb3NpdGlvbjogJ3JlbGF0aXZlJywgd2lkdGg6ICcxMDAlJywgaGVpZ2h0OiAnMTAwJScgfX0+XG4gICAgICAgIDxBdXRvVXBkYXRlciBvbkF1dG9VcGRhdGVDaGVja0NvbXBsZXRlPXt0aGlzLm9uQXV0b1VwZGF0ZUNoZWNrQ29tcGxldGV9IHNob3VsZERpc3BsYXk9eyF0aGlzLnN0YXRlLmhhc0NoZWNrZWRGb3JVcGRhdGVzfSAvPlxuICAgICAgICA8VG91ciBwcm9qZWN0c0xpc3Q9e3RoaXMuc3RhdGUucHJvamVjdHNMaXN0fSBlbnZveT17dGhpcy5lbnZveX0gLz5cbiAgICAgICAgPGRpdiBzdHlsZT17eyBwb3NpdGlvbjogJ2Fic29sdXRlJywgd2lkdGg6ICcxMDAlJywgaGVpZ2h0OiAnMTAwJScsIHRvcDogMCwgbGVmdDogMCB9fT5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nbGF5b3V0LWJveCcgc3R5bGU9e3tvdmVyZmxvdzogJ3Zpc2libGUnfX0+XG4gICAgICAgICAgICA8UmVhY3RDU1NUcmFuc2l0aW9uR3JvdXBcbiAgICAgICAgICAgICAgdHJhbnNpdGlvbk5hbWU9J3RvYXN0J1xuICAgICAgICAgICAgICB0cmFuc2l0aW9uRW50ZXJUaW1lb3V0PXs1MDB9XG4gICAgICAgICAgICAgIHRyYW5zaXRpb25MZWF2ZVRpbWVvdXQ9ezMwMH0+XG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3twb3NpdGlvbjogJ2Fic29sdXRlJywgcmlnaHQ6IDAsIHRvcDogMCwgd2lkdGg6IDMwMH19PlxuICAgICAgICAgICAgICAgIHtsb2Rhc2gubWFwKHRoaXMuc3RhdGUubm90aWNlcywgdGhpcy5yZW5kZXJOb3RpZmljYXRpb25zKX1cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L1JlYWN0Q1NTVHJhbnNpdGlvbkdyb3VwPlxuICAgICAgICAgICAgPFNwbGl0UGFuZSBvbkRyYWdGaW5pc2hlZD17dGhpcy5oYW5kbGVQYW5lUmVzaXplLmJpbmQodGhpcyl9IHNwbGl0PSdob3Jpem9udGFsJyBtaW5TaXplPXszMDB9IGRlZmF1bHRTaXplPXt0aGlzLnByb3BzLmhlaWdodCAqIDAuNjJ9PlxuICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgIDxTcGxpdFBhbmUgb25EcmFnRmluaXNoZWQ9e3RoaXMuaGFuZGxlUGFuZVJlc2l6ZS5iaW5kKHRoaXMpfSBzcGxpdD0ndmVydGljYWwnIG1pblNpemU9ezMwMH0gZGVmYXVsdFNpemU9ezMwMH0+XG4gICAgICAgICAgICAgICAgICA8U2lkZUJhclxuICAgICAgICAgICAgICAgICAgICBzZXREYXNoYm9hcmRWaXNpYmlsaXR5PXt0aGlzLnNldERhc2hib2FyZFZpc2liaWxpdHkuYmluZCh0aGlzKX1cbiAgICAgICAgICAgICAgICAgICAgc3dpdGNoQWN0aXZlTmF2PXt0aGlzLnN3aXRjaEFjdGl2ZU5hdi5iaW5kKHRoaXMpfVxuICAgICAgICAgICAgICAgICAgICBhY3RpdmVOYXY9e3RoaXMuc3RhdGUuYWN0aXZlTmF2fT5cbiAgICAgICAgICAgICAgICAgICAge3RoaXMuc3RhdGUuYWN0aXZlTmF2ID09PSAnbGlicmFyeSdcbiAgICAgICAgICAgICAgICAgICAgICA/IDxMaWJyYXJ5XG4gICAgICAgICAgICAgICAgICAgICAgICBsYXlvdXQ9e3RoaXMubGF5b3V0fVxuICAgICAgICAgICAgICAgICAgICAgICAgZm9sZGVyPXt0aGlzLnN0YXRlLnByb2plY3RGb2xkZXJ9XG4gICAgICAgICAgICAgICAgICAgICAgICBoYWlrdT17dGhpcy5wcm9wcy5oYWlrdX1cbiAgICAgICAgICAgICAgICAgICAgICAgIHdlYnNvY2tldD17dGhpcy5wcm9wcy53ZWJzb2NrZXR9XG4gICAgICAgICAgICAgICAgICAgICAgICB0b3VyQ2hhbm5lbD17dGhpcy50b3VyQ2hhbm5lbH1cbiAgICAgICAgICAgICAgICAgICAgICAgIG9uRHJhZ0VuZD17dGhpcy5vbkxpYnJhcnlEcmFnRW5kLmJpbmQodGhpcyl9XG4gICAgICAgICAgICAgICAgICAgICAgICBvbkRyYWdTdGFydD17dGhpcy5vbkxpYnJhcnlEcmFnU3RhcnQuYmluZCh0aGlzKX1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNyZWF0ZU5vdGljZT17dGhpcy5jcmVhdGVOb3RpY2V9XG4gICAgICAgICAgICAgICAgICAgICAgICByZW1vdmVOb3RpY2U9e3RoaXMucmVtb3ZlTm90aWNlfSAvPlxuICAgICAgICAgICAgICAgICAgICAgIDogPFN0YXRlSW5zcGVjdG9yXG4gICAgICAgICAgICAgICAgICAgICAgICBjcmVhdGVOb3RpY2U9e3RoaXMuY3JlYXRlTm90aWNlfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmVtb3ZlTm90aWNlPXt0aGlzLnJlbW92ZU5vdGljZX1cbiAgICAgICAgICAgICAgICAgICAgICAgIGZvbGRlcj17dGhpcy5zdGF0ZS5wcm9qZWN0Rm9sZGVyfVxuICAgICAgICAgICAgICAgICAgICAgICAgd2Vic29ja2V0PXt0aGlzLnByb3BzLndlYnNvY2tldH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHRvdXJDaGFubmVsPXt0aGlzLnRvdXJDaGFubmVsfSAvPlxuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIDwvU2lkZUJhcj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3twb3NpdGlvbjogJ3JlbGF0aXZlJywgd2lkdGg6ICcxMDAlJywgaGVpZ2h0OiAnMTAwJSd9fT5cbiAgICAgICAgICAgICAgICAgICAgPFN0YWdlXG4gICAgICAgICAgICAgICAgICAgICAgcmVmPSdzdGFnZSdcbiAgICAgICAgICAgICAgICAgICAgICBmb2xkZXI9e3RoaXMuc3RhdGUucHJvamVjdEZvbGRlcn1cbiAgICAgICAgICAgICAgICAgICAgICBlbnZveT17dGhpcy5lbnZveX1cbiAgICAgICAgICAgICAgICAgICAgICBoYWlrdT17dGhpcy5wcm9wcy5oYWlrdX1cbiAgICAgICAgICAgICAgICAgICAgICB3ZWJzb2NrZXQ9e3RoaXMucHJvcHMud2Vic29ja2V0fVxuICAgICAgICAgICAgICAgICAgICAgIHByb2plY3Q9e3RoaXMuc3RhdGUucHJvamVjdE9iamVjdH1cbiAgICAgICAgICAgICAgICAgICAgICBjcmVhdGVOb3RpY2U9e3RoaXMuY3JlYXRlTm90aWNlfVxuICAgICAgICAgICAgICAgICAgICAgIHJlbW92ZU5vdGljZT17dGhpcy5yZW1vdmVOb3RpY2V9XG4gICAgICAgICAgICAgICAgICAgICAgcmVjZWl2ZVByb2plY3RJbmZvPXt0aGlzLnJlY2VpdmVQcm9qZWN0SW5mb31cbiAgICAgICAgICAgICAgICAgICAgICBvcmdhbml6YXRpb25OYW1lPXt0aGlzLnN0YXRlLm9yZ2FuaXphdGlvbk5hbWV9XG4gICAgICAgICAgICAgICAgICAgICAgYXV0aFRva2VuPXt0aGlzLnN0YXRlLmF1dGhUb2tlbn1cbiAgICAgICAgICAgICAgICAgICAgICB1c2VybmFtZT17dGhpcy5zdGF0ZS51c2VybmFtZX1cbiAgICAgICAgICAgICAgICAgICAgICBwYXNzd29yZD17dGhpcy5zdGF0ZS5wYXNzd29yZH0gLz5cbiAgICAgICAgICAgICAgICAgICAgeyh0aGlzLnN0YXRlLmxpYnJhcnlJdGVtRHJhZ2dpbmcpXG4gICAgICAgICAgICAgICAgICAgICAgPyA8ZGl2IHN0eWxlPXt7IHdpZHRoOiAnMTAwJScsIGhlaWdodDogJzEwMCUnLCBiYWNrZ3JvdW5kQ29sb3I6ICd3aGl0ZScsIG9wYWNpdHk6IDAuMDEsIHBvc2l0aW9uOiAnYWJzb2x1dGUnLCB0b3A6IDAsIGxlZnQ6IDAgfX0gLz5cbiAgICAgICAgICAgICAgICAgICAgICA6ICcnIH1cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvU3BsaXRQYW5lPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPFRpbWVsaW5lXG4gICAgICAgICAgICAgICAgcmVmPSd0aW1lbGluZSdcbiAgICAgICAgICAgICAgICBmb2xkZXI9e3RoaXMuc3RhdGUucHJvamVjdEZvbGRlcn1cbiAgICAgICAgICAgICAgICBlbnZveT17dGhpcy5lbnZveX1cbiAgICAgICAgICAgICAgICBoYWlrdT17dGhpcy5wcm9wcy5oYWlrdX1cbiAgICAgICAgICAgICAgICBjcmVhdGVOb3RpY2U9e3RoaXMuY3JlYXRlTm90aWNlfVxuICAgICAgICAgICAgICAgIHJlbW92ZU5vdGljZT17dGhpcy5yZW1vdmVOb3RpY2V9IC8+XG4gICAgICAgICAgICA8L1NwbGl0UGFuZT5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cbn1cbiJdfQ==