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
          lineNumber: 361
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
            lineNumber: 532
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
              lineNumber: 533
            },
            __self: this
          },
          _react2.default.createElement(
            'div',
            { style: { position: 'absolute', right: 0, top: 0, width: 300 }, __source: {
                fileName: _jsxFileName,
                lineNumber: 537
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
              lineNumber: 541
            },
            __self: this
          },
          _react2.default.createElement(
            'div',
            { style: { display: 'table-cell', width: '100%', height: '100%', verticalAlign: 'middle', textAlign: 'center' }, __source: {
                fileName: _jsxFileName,
                lineNumber: 542
              },
              __self: this
            },
            _react2.default.createElement(
              'svg',
              { width: '170px', height: '221px', viewBox: '0 0 170 221', version: '1.1', __source: {
                  fileName: _jsxFileName,
                  lineNumber: 543
                },
                __self: this
              },
              _react2.default.createElement(
                'g',
                { id: 'Page-1', stroke: 'none', strokeWidth: '1', fill: 'none', fillRule: 'evenodd', __source: {
                    fileName: _jsxFileName,
                    lineNumber: 544
                  },
                  __self: this
                },
                _react2.default.createElement(
                  'g',
                  { id: 'Outlined', transform: 'translate(-211.000000, -114.000000)', fillRule: 'nonzero', fill: '#FAFCFD', __source: {
                      fileName: _jsxFileName,
                      lineNumber: 545
                    },
                    __self: this
                  },
                  _react2.default.createElement(
                    'g',
                    { id: 'outlined-logo', transform: 'translate(211.000000, 113.000000)', __source: {
                        fileName: _jsxFileName,
                        lineNumber: 546
                      },
                      __self: this
                    },
                    _react2.default.createElement('path', { d: 'M47.5,152.798823 L26.3823432,143.954676 C24.5993941,143.207971 23.7593524,141.157281 24.5060576,139.374332 C25.2527628,137.591383 27.3034527,136.751341 29.0864018,137.498046 L117.780058,174.64456 L120.990021,176.089074 C122.486814,176.762645 123.279304,178.358251 122.998698,179.903598 C122.999564,179.935626 123,179.967762 123,180 L123,205.639722 L138.510716,211.910011 L143.368421,213.873764 L162.833333,206.00497 L162.833333,16.2929025 L143,8.27517204 L122.833333,16.4276543 L122.833333,53.6013295 C122.834218,53.6466489 122.834215,53.6919015 122.833333,53.7370634 L122.833333,54 C122.833333,55.9329966 121.26633,57.5 119.333333,57.5 C119.28843,57.5 119.243724,57.4991544 119.19923,57.4974782 L53.307638,84.037149 C51.5146183,84.7593375 49.4756392,83.8912573 48.7534506,82.0982376 C48.0312621,80.3052179 48.8993423,78.2662388 50.692362,77.5440502 L115.833333,51.3067129 L115.833333,14.4974227 C115.833333,14.0143178 115.931213,13.5540739 116.108222,13.1354399 C116.374539,12.0941292 117.115326,11.1888449 118.188238,10.7551148 L141.684186,1.2567527 C142.091317,1.09152936 142.52959,1.00240467 142.975937,0.999164723 C143.47041,1.00240467 143.908683,1.09152936 144.315814,1.2567527 L167.811762,10.7551148 C169.522968,11.446879 170.389328,13.3381659 169.833333,15.0677068 L169.833333,208 C169.833333,208.826304 169.54699,209.585728 169.068118,210.184459 C168.693703,210.867378 168.090133,211.430224 167.311762,211.744885 L144.517645,220.959528 C143.332542,221.438613 142.038995,221.222397 141.089179,220.502712 L135.887192,218.399782 L119.461595,211.759647 C117.54629,211.739055 116,210.180032 116,208.259853 L116,208.07911 C115.998767,208.025708 115.998761,207.972178 116,207.918558 L116,181.518748 L114.991727,181.064589 L54.5,155.730447 L54.5,206.998273 C55.1341468,208.658256 54.4195315,210.512915 52.8796645,211.333333 C52.5545546,211.540709 52.192904,211.695869 51.8065294,211.786997 L29.7867375,220.650655 C28.8252535,221.478758 27.4457005,221.753221 26.1882379,221.244885 L20.3871921,218.899782 L3.30627783,211.994731 C1.46338189,211.894192 -2.60835995e-16,210.367992 0,208.5 L2.70894418e-14,14.4974227 C2.724245e-14,13.4016458 0.503560947,12.4234818 1.29189669,11.781717 C1.65171014,11.3416509 2.12405622,10.9831882 2.68823789,10.7551148 L26.1841862,1.2567527 C26.5913172,1.09152936 27.0295898,1.00240467 27.4759367,0.999164723 C27.9704102,1.00240467 28.4086828,1.09152936 28.8158138,1.2567527 L52.3117621,10.7551148 C54.1038627,11.479581 54.9693514,13.5196615 54.2448852,15.3117621 C53.520419,17.1038627 51.4803385,17.9693514 49.6882379,17.2448852 L27.5,8.27517204 L7,16.5624061 L7,205.937594 L23.0107164,212.410011 L27.2526995,214.124855 L47.5,205.974681 L47.5,152.798823 Z', id: 'Combined-Shape', __source: {
                        fileName: _jsxFileName,
                        lineNumber: 547
                      },
                      __self: this
                    }),
                    _react2.default.createElement('path', { d: 'M146.456827,63.0241849 C146.948603,64.7104724 146.105972,66.5336591 144.447305,67.2283149 L59.5468677,102.784908 L120.416575,128.27735 C122.199524,129.024055 123.039566,131.074745 122.292861,132.857694 C121.546156,134.640643 119.495466,135.480685 117.712517,134.733979 L50.4864131,106.579457 L29.3520293,115.43061 C27.5690802,116.177315 25.5183903,115.337273 24.7716851,113.554324 C24.02498,111.771375 24.8650216,109.720685 26.6479707,108.97398 L47.5,100.241079 L47.5,14.5 C47.5,12.5670034 49.0670034,11 51,11 C52.9329966,11 54.5,12.5670034 54.5,14.5 L54.5,97.3094548 L133.360257,64.2825098 L117.188238,57.7448852 C115.396137,57.020419 114.530649,54.9803385 115.255115,53.1882379 C115.979581,51.3961373 118.019661,50.5306486 119.811762,51.2551148 L139.5,59.2141897 L139.5,25.8602784 L135.887192,24.3997816 L118.188238,17.2448852 C116.396137,16.520419 115.530649,14.4803385 116.255115,12.6882379 C116.979581,10.8961373 119.019661,10.0306486 120.811762,10.7551148 L138.510716,17.9100112 L143.368421,19.8737641 L164.688238,11.2551148 C166.480339,10.5306486 168.520419,11.3961373 169.244885,13.1882379 C169.969351,14.9803385 169.103863,17.020419 167.311762,17.7448852 L146.5,26.1581508 L146.5,62.4728749 C146.5,62.6604574 146.485243,62.8445933 146.456827,63.0241849 Z', id: 'Combined-Shape', __source: {
                        fileName: _jsxFileName,
                        lineNumber: 548
                      },
                      __self: this
                    }),
                    _react2.default.createElement('path', { d: 'M139.5,96.3308069 L122.833333,103.310864 L122.833333,151.372799 C122.833333,153.305795 121.26633,154.872799 119.333333,154.872799 C118.535719,154.872799 117.80042,154.605994 117.211816,154.156763 L26.6479707,116.228315 C26.0976706,115.997847 25.637194,115.643159 25.2854714,115.210462 C24.5008258,114.56862 24,113.592797 24,112.5 L24,25.8602784 L20.3871921,24.3997816 L2.68823789,17.2448852 C0.896137258,16.520419 0.0306485589,14.4803385 0.75511477,12.6882379 C1.47958098,10.8961373 3.51966149,10.0306486 5.31176211,10.7551148 L23.0107164,17.9100112 L27.8684211,19.8737641 L49.1882379,11.2551148 C50.9803385,10.5306486 53.020419,11.3961373 53.7448852,13.1882379 C54.4693514,14.9803385 53.6038627,17.020419 51.8117621,17.7448852 L31,26.1581508 L31,110.461861 L115.833333,145.990351 L115.833333,106.242488 L84.2596616,119.465649 C82.4767125,120.212355 80.4260226,119.372313 79.6793174,117.589364 C78.9326123,115.806415 79.7726539,113.755725 81.555603,113.00902 L141.052151,88.0916622 C141.608974,87.717993 142.27903,87.5 143,87.5 C144.932997,87.5 146.5,89.0670034 146.5,91 L146.5,217.63048 C146.5,219.563477 144.932997,221.13048 143,221.13048 C141.067003,221.13048 139.5,219.563477 139.5,217.63048 L139.5,96.3308069 Z M31,141 L31,217.055237 C31,218.988234 29.4329966,220.555237 27.5,220.555237 C25.5670034,220.555237 24,218.988234 24,217.055237 L24,141 C24,139.067003 25.5670034,137.5 27.5,137.5 C29.4329966,137.5 31,139.067003 31,141 Z', id: 'Combined-Shape', __source: {
                        fileName: _jsxFileName,
                        lineNumber: 549
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
                lineNumber: 554
              },
              __self: this
            }),
            _react2.default.createElement(
              'span',
              { style: { color: '#FAFCFD', display: 'inline-block', width: '100%', height: 50, position: 'absolute', bottom: 50, left: 0 }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 555
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
              lineNumber: 565
            },
            __self: this
          },
          _react2.default.createElement(_AuthenticationUI2.default, Object.assign({
            onSubmit: this.authenticateUser,
            onSubmitSuccess: this.authenticationComplete
          }, this.props, {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 566
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
              lineNumber: 580
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
              lineNumber: 581
            },
            __self: this
          })),
          _react2.default.createElement(_Tour2.default, { projectsList: this.state.projectsList, envoy: this.envoy, startTourOnMount: true, __source: {
              fileName: _jsxFileName,
              lineNumber: 589
            },
            __self: this
          }),
          _react2.default.createElement(_AutoUpdater2.default, { onAutoUpdateCheckComplete: this.onAutoUpdateCheckComplete, shouldDisplay: !this.state.hasCheckedForUpdates, __source: {
              fileName: _jsxFileName,
              lineNumber: 590
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
              lineNumber: 597
            },
            __self: this
          },
          _react2.default.createElement(_Tour2.default, { projectsList: this.state.projectsList, envoy: this.envoy, __source: {
              fileName: _jsxFileName,
              lineNumber: 598
            },
            __self: this
          }),
          _react2.default.createElement(_AutoUpdater2.default, { onAutoUpdateCheckComplete: this.onAutoUpdateCheckComplete, shouldDisplay: !this.state.hasCheckedForUpdates, __source: {
              fileName: _jsxFileName,
              lineNumber: 599
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
              lineNumber: 600
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
              lineNumber: 614
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
                lineNumber: 615
              },
              __self: this
            },
            _react2.default.createElement(
              'div',
              { style: { position: 'absolute', right: 0, top: 0, width: 300 }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 619
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
                lineNumber: 623
              },
              __self: this
            },
            _react2.default.createElement(
              'div',
              { style: { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 624
                },
                __self: this
              },
              _react2.default.createElement(
                'span',
                { style: { fontSize: 24, color: '#222' }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 625
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
            lineNumber: 633
          },
          __self: this
        },
        _react2.default.createElement(_AutoUpdater2.default, { onAutoUpdateCheckComplete: this.onAutoUpdateCheckComplete, shouldDisplay: !this.state.hasCheckedForUpdates, __source: {
            fileName: _jsxFileName,
            lineNumber: 634
          },
          __self: this
        }),
        _react2.default.createElement(_Tour2.default, { projectsList: this.state.projectsList, envoy: this.envoy, __source: {
            fileName: _jsxFileName,
            lineNumber: 635
          },
          __self: this
        }),
        _react2.default.createElement(
          'div',
          { style: { position: 'absolute', width: '100%', height: '100%', top: 0, left: 0 }, __source: {
              fileName: _jsxFileName,
              lineNumber: 636
            },
            __self: this
          },
          _react2.default.createElement(
            'div',
            { className: 'layout-box', style: { overflow: 'visible' }, __source: {
                fileName: _jsxFileName,
                lineNumber: 637
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
                  lineNumber: 638
                },
                __self: this
              },
              _react2.default.createElement(
                'div',
                { style: { position: 'absolute', right: 0, top: 0, width: 300 }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 642
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
                  lineNumber: 646
                },
                __self: this
              },
              _react2.default.createElement(
                'div',
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 647
                  },
                  __self: this
                },
                _react2.default.createElement(
                  _reactSplitPane2.default,
                  { onDragFinished: this.handlePaneResize.bind(this), split: 'vertical', minSize: 300, defaultSize: 300, __source: {
                      fileName: _jsxFileName,
                      lineNumber: 648
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
                        lineNumber: 649
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
                        lineNumber: 654
                      },
                      __self: this
                    }) : _react2.default.createElement(_StateInspector2.default, {
                      createNotice: this.createNotice,
                      removeNotice: this.removeNotice,
                      folder: this.state.projectFolder,
                      websocket: this.props.websocket,
                      tourChannel: this.tourChannel, __source: {
                        fileName: _jsxFileName,
                        lineNumber: 664
                      },
                      __self: this
                    })
                  ),
                  _react2.default.createElement(
                    'div',
                    { style: { position: 'relative', width: '100%', height: '100%' }, __source: {
                        fileName: _jsxFileName,
                        lineNumber: 672
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
                        lineNumber: 673
                      },
                      __self: this
                    }),
                    this.state.libraryItemDragging ? _react2.default.createElement('div', { style: { width: '100%', height: '100%', backgroundColor: 'white', opacity: 0.01, position: 'absolute', top: 0, left: 0 }, __source: {
                        fileName: _jsxFileName,
                        lineNumber: 688
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
                  lineNumber: 693
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZWFjdC9DcmVhdG9yLmpzIl0sIm5hbWVzIjpbInBrZyIsInJlcXVpcmUiLCJtaXhwYW5lbCIsImVsZWN0cm9uIiwicmVtb3RlIiwiaXBjUmVuZGVyZXIiLCJjbGlwYm9hcmQiLCJ3ZWJGcmFtZSIsInNldFpvb21MZXZlbExpbWl0cyIsInNldExheW91dFpvb21MZXZlbExpbWl0cyIsIkNyZWF0b3IiLCJwcm9wcyIsImF1dGhlbnRpY2F0ZVVzZXIiLCJiaW5kIiwiYXV0aGVudGljYXRpb25Db21wbGV0ZSIsImxvYWRQcm9qZWN0cyIsImxhdW5jaFByb2plY3QiLCJyZW1vdmVOb3RpY2UiLCJjcmVhdGVOb3RpY2UiLCJyZW5kZXJOb3RpZmljYXRpb25zIiwicmVjZWl2ZVByb2plY3RJbmZvIiwiaGFuZGxlRmluZEVsZW1lbnRDb29yZGluYXRlcyIsImhhbmRsZUZpbmRXZWJ2aWV3Q29vcmRpbmF0ZXMiLCJvbkF1dG9VcGRhdGVDaGVja0NvbXBsZXRlIiwibGF5b3V0Iiwic3RhdGUiLCJlcnJvciIsInByb2plY3RGb2xkZXIiLCJmb2xkZXIiLCJhcHBsaWNhdGlvbkltYWdlIiwicHJvamVjdE9iamVjdCIsInByb2plY3ROYW1lIiwiZGFzaGJvYXJkVmlzaWJsZSIsInJlYWR5Rm9yQXV0aCIsImlzVXNlckF1dGhlbnRpY2F0ZWQiLCJoYXNDaGVja2VkRm9yVXBkYXRlcyIsInVzZXJuYW1lIiwicGFzc3dvcmQiLCJub3RpY2VzIiwic29mdHdhcmVWZXJzaW9uIiwidmVyc2lvbiIsImRpZFBsdW1iaW5nTm90aWNlQ3Jhc2giLCJhY3RpdmVOYXYiLCJwcm9qZWN0c0xpc3QiLCJ3aW4iLCJnZXRDdXJyZW50V2luZG93IiwicHJvY2VzcyIsImVudiIsIkRFViIsIm9wZW5EZXZUb29scyIsImRvY3VtZW50IiwiYWRkRXZlbnRMaXN0ZW5lciIsIm5hdGl2ZUV2ZW50IiwiX2xhc3RNb3VzZVgiLCJjbGllbnRYIiwiX2xhc3RNb3VzZVkiLCJjbGllbnRZIiwiY29tYm9rZXlzIiwiZG9jdW1lbnRFbGVtZW50IiwiZGVib3VuY2UiLCJ3ZWJzb2NrZXQiLCJzZW5kIiwibWV0aG9kIiwicGFyYW1zIiwibGVhZGluZyIsImR1bXBTeXN0ZW1JbmZvIiwib24iLCJ0eXBlIiwibmFtZSIsIm9wZW5UZXJtaW5hbCIsInNldFN0YXRlIiwiZXhlY1N5bmMiLCJKU09OIiwic3RyaW5naWZ5IiwiZXhjZXB0aW9uIiwiY29uc29sZSIsInRpbWVzdGFtcCIsIkRhdGUiLCJub3ciLCJkdW1wZGlyIiwiam9pbiIsIndyaXRlRmlsZVN5bmMiLCJhcmd2IiwiZXhpc3RzU3luYyIsInJlYWRGaWxlU3luYyIsInRvU3RyaW5nIiwiYWN0aXZlRm9sZGVyIiwicmVhY3RTdGF0ZSIsIl9fZmlsZW5hbWUiLCJfX2Rpcm5hbWUiLCJob21lZGlyIiwiaXNEZXZUb29sc09wZW5lZCIsImNsb3NlRGV2VG9vbHMiLCJyZWZzIiwic3RhZ2UiLCJ0b2dnbGVEZXZUb29scyIsInRpbWVsaW5lIiwibWF5YmVQYXN0ZVJlcXVlc3QiLCJwYXN0ZWRUZXh0IiwicmVhZFRleHQiLCJwYXN0ZWREYXRhIiwicGFyc2UiLCJ3YXJuIiwiQXJyYXkiLCJpc0FycmF5IiwicGFzdGVkRWxlbWVudCIsInJlcXVlc3QiLCJ0aXRsZSIsIm1lc3NhZ2UiLCJjbG9zZVRleHQiLCJsaWdodFNjaGVtZSIsImxlbmd0aCIsImluZm8iLCJkYXRhIiwiaGFuZGxlQ29udGVudFBhc3RlIiwiZW52b3kiLCJwb3J0IiwiaGFpa3UiLCJob3N0IiwiV2ViU29ja2V0Iiwid2luZG93IiwiZ2V0IiwidGhlbiIsInRvdXJDaGFubmVsIiwic2V0RGFzaGJvYXJkVmlzaWJpbGl0eSIsInNldFRpbWVvdXQiLCJzdGFydCIsInRocm90dGxlIiwibm90aWZ5U2NyZWVuUmVzaXplIiwicGFzdGVFdmVudCIsInRhZ25hbWUiLCJ0YXJnZXQiLCJ0YWdOYW1lIiwidG9Mb3dlckNhc2UiLCJwcmV2ZW50RGVmYXVsdCIsImNiIiwiYXV0aEFuc3dlciIsIm1lcmdlVG9QYXlsb2FkIiwiZGlzdGluY3RfaWQiLCJoYWlrdVRyYWNrIiwiYXV0aFRva2VuIiwib3JnYW5pemF0aW9uTmFtZSIsImlzQXV0aGVkIiwibGF1bmNoRm9sZGVyIiwiZm9sZGVyTG9hZGluZ0Vycm9yIiwib2ZmIiwic2VsZWN0b3IiLCJ3ZWJ2aWV3IiwiZWxlbWVudCIsInF1ZXJ5U2VsZWN0b3IiLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJ0b3AiLCJsZWZ0IiwicmVjZWl2ZUVsZW1lbnRDb29yZGluYXRlcyIsInJlY2VpdmVXZWJ2aWV3Q29vcmRpbmF0ZXMiLCJjb250ZW50IiwiaSIsIm5leHQiLCJwcm9qZWN0SW5mbyIsInNraXBDb250ZW50Q3JlYXRpb24iLCJwcm9qZWN0c0hvbWUiLCJwcm9qZWN0UGF0aCIsImF1dGhvck5hbWUiLCJwcm9qZWN0Iiwib3JnYW5pemF0aW9uIiwiZXJyIiwiYXNzaWduIiwibWF5YmVQcm9qZWN0TmFtZSIsImluZGV4IiwiaWQiLCJ1bmRlZmluZWQiLCJzbGljZSIsImVhY2giLCJub3RpY2UiLCJNYXRoIiwicmFuZG9tIiwicmVwbGFjZWRFeGlzdGluZyIsImZvckVhY2giLCJuIiwic3BsaWNlIiwidW5zaGlmdCIsImRyYWdFbmROYXRpdmVFdmVudCIsImxpYnJhcnlJdGVtSW5mbyIsImxpYnJhcnlJdGVtRHJhZ2dpbmciLCJwcmV2aWV3IiwiaGFuZGxlRHJvcCIsImRyYWdTdGFydE5hdGl2ZUV2ZW50IiwicG9zaXRpb24iLCJ3aWR0aCIsImhlaWdodCIsInJpZ2h0IiwibWFwIiwiZGlzcGxheSIsInZlcnRpY2FsQWxpZ24iLCJ0ZXh0QWxpZ24iLCJjb2xvciIsImJvdHRvbSIsInJlbmRlclN0YXJ0dXBEZWZhdWx0U2NyZWVuIiwidHJhbnNmb3JtIiwiZm9udFNpemUiLCJvdmVyZmxvdyIsImhhbmRsZVBhbmVSZXNpemUiLCJzd2l0Y2hBY3RpdmVOYXYiLCJvbkxpYnJhcnlEcmFnRW5kIiwib25MaWJyYXJ5RHJhZ1N0YXJ0IiwiYmFja2dyb3VuZENvbG9yIiwib3BhY2l0eSIsIkNvbXBvbmVudCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7Ozs7O0FBS0EsSUFBSUEsTUFBTUMsUUFBUSxzQkFBUixDQUFWOztBQUVBLElBQUlDLFdBQVdELFFBQVEsd0NBQVIsQ0FBZjs7QUFFQSxJQUFNRSxXQUFXRixRQUFRLFVBQVIsQ0FBakI7QUFDQSxJQUFNRyxTQUFTRCxTQUFTQyxNQUF4QjtBQUNBLElBQU1DLGNBQWNGLFNBQVNFLFdBQTdCO0FBQ0EsSUFBTUMsWUFBWUgsU0FBU0csU0FBM0I7O0FBRUEsSUFBSUMsV0FBV0osU0FBU0ksUUFBeEI7QUFDQSxJQUFJQSxRQUFKLEVBQWM7QUFDWixNQUFJQSxTQUFTQyxrQkFBYixFQUFpQ0QsU0FBU0Msa0JBQVQsQ0FBNEIsQ0FBNUIsRUFBK0IsQ0FBL0I7QUFDakMsTUFBSUQsU0FBU0Usd0JBQWIsRUFBdUNGLFNBQVNFLHdCQUFULENBQWtDLENBQWxDLEVBQXFDLENBQXJDO0FBQ3hDOztJQUVvQkMsTzs7O0FBQ25CLG1CQUFhQyxLQUFiLEVBQW9CO0FBQUE7O0FBQUEsa0hBQ1pBLEtBRFk7O0FBRWxCLFVBQUtDLGdCQUFMLEdBQXdCLE1BQUtBLGdCQUFMLENBQXNCQyxJQUF0QixPQUF4QjtBQUNBLFVBQUtDLHNCQUFMLEdBQThCLE1BQUtBLHNCQUFMLENBQTRCRCxJQUE1QixPQUE5QjtBQUNBLFVBQUtFLFlBQUwsR0FBb0IsTUFBS0EsWUFBTCxDQUFrQkYsSUFBbEIsT0FBcEI7QUFDQSxVQUFLRyxhQUFMLEdBQXFCLE1BQUtBLGFBQUwsQ0FBbUJILElBQW5CLE9BQXJCO0FBQ0EsVUFBS0ksWUFBTCxHQUFvQixNQUFLQSxZQUFMLENBQWtCSixJQUFsQixPQUFwQjtBQUNBLFVBQUtLLFlBQUwsR0FBb0IsTUFBS0EsWUFBTCxDQUFrQkwsSUFBbEIsT0FBcEI7QUFDQSxVQUFLTSxtQkFBTCxHQUEyQixNQUFLQSxtQkFBTCxDQUF5Qk4sSUFBekIsT0FBM0I7QUFDQSxVQUFLTyxrQkFBTCxHQUEwQixNQUFLQSxrQkFBTCxDQUF3QlAsSUFBeEIsT0FBMUI7QUFDQSxVQUFLUSw0QkFBTCxHQUFvQyxNQUFLQSw0QkFBTCxDQUFrQ1IsSUFBbEMsT0FBcEM7QUFDQSxVQUFLUyw0QkFBTCxHQUFvQyxNQUFLQSw0QkFBTCxDQUFrQ1QsSUFBbEMsT0FBcEM7QUFDQSxVQUFLVSx5QkFBTCxHQUFpQyxNQUFLQSx5QkFBTCxDQUErQlYsSUFBL0IsT0FBakM7QUFDQSxVQUFLVyxNQUFMLEdBQWMsNEJBQWQ7O0FBRUEsVUFBS0MsS0FBTCxHQUFhO0FBQ1hDLGFBQU8sSUFESTtBQUVYQyxxQkFBZSxNQUFLaEIsS0FBTCxDQUFXaUIsTUFGZjtBQUdYQyx3QkFBa0IsSUFIUDtBQUlYQyxxQkFBZSxJQUpKO0FBS1hDLG1CQUFhLElBTEY7QUFNWEMsd0JBQWtCLENBQUMsTUFBS3JCLEtBQUwsQ0FBV2lCLE1BTm5CO0FBT1hLLG9CQUFjLEtBUEg7QUFRWEMsMkJBQXFCLEtBUlY7QUFTWEMsNEJBQXNCLEtBVFg7QUFVWEMsZ0JBQVUsSUFWQztBQVdYQyxnQkFBVSxJQVhDO0FBWVhDLGVBQVMsRUFaRTtBQWFYQyx1QkFBaUJ2QyxJQUFJd0MsT0FiVjtBQWNYQyw4QkFBd0IsS0FkYjtBQWVYQyxpQkFBVyxTQWZBO0FBZ0JYQyxvQkFBYztBQWhCSCxLQUFiOztBQW1CQSxRQUFNQyxNQUFNeEMsT0FBT3lDLGdCQUFQLEVBQVo7O0FBRUEsUUFBSUMsUUFBUUMsR0FBUixDQUFZQyxHQUFaLEtBQW9CLEdBQXhCLEVBQTZCO0FBQzNCSixVQUFJSyxZQUFKO0FBQ0Q7O0FBRURDLGFBQVNDLGdCQUFULENBQTBCLFdBQTFCLEVBQXVDLFVBQUNDLFdBQUQsRUFBaUI7QUFDdEQsWUFBS0MsV0FBTCxHQUFtQkQsWUFBWUUsT0FBL0I7QUFDQSxZQUFLQyxXQUFMLEdBQW1CSCxZQUFZSSxPQUEvQjtBQUNELEtBSEQ7QUFJQU4sYUFBU0MsZ0JBQVQsQ0FBMEIsTUFBMUIsRUFBa0MsVUFBQ0MsV0FBRCxFQUFpQjtBQUNqRDtBQUNBLFVBQUlBLFlBQVlFLE9BQVosR0FBc0IsQ0FBdEIsSUFBMkJGLFlBQVlJLE9BQVosR0FBc0IsQ0FBckQsRUFBd0Q7QUFDdEQsY0FBS0gsV0FBTCxHQUFtQkQsWUFBWUUsT0FBL0I7QUFDQSxjQUFLQyxXQUFMLEdBQW1CSCxZQUFZSSxPQUEvQjtBQUNEO0FBQ0YsS0FORDs7QUFRQSxRQUFNQyxZQUFZLHdCQUFjUCxTQUFTUSxlQUF2QixDQUFsQjtBQUNBRCxjQUFVNUMsSUFBVixDQUFlLGtCQUFmLEVBQW1DLGlCQUFPOEMsUUFBUCxDQUFnQixZQUFNO0FBQ3ZELFlBQUtoRCxLQUFMLENBQVdpRCxTQUFYLENBQXFCQyxJQUFyQixDQUEwQixFQUFFQyxRQUFRLGdCQUFWLEVBQTRCQyxRQUFRLENBQUMsTUFBS3RDLEtBQUwsQ0FBV0UsYUFBWixDQUFwQyxFQUExQjtBQUNELEtBRmtDLEVBRWhDLEdBRmdDLEVBRTNCLEVBQUVxQyxTQUFTLElBQVgsRUFGMkIsQ0FBbkM7QUFHQVAsY0FBVTVDLElBQVYsQ0FBZSxrQkFBZixFQUFtQyxpQkFBTzhDLFFBQVAsQ0FBZ0IsWUFBTTtBQUN2RCxZQUFLTSxjQUFMO0FBQ0QsS0FGa0MsRUFFaEMsR0FGZ0MsRUFFM0IsRUFBRUQsU0FBUyxJQUFYLEVBRjJCLENBQW5DOztBQUlBO0FBQ0EzRCxnQkFBWTZELEVBQVosQ0FBZSxxQkFBZixFQUFzQyxZQUFNO0FBQzFDLFlBQUt2RCxLQUFMLENBQVdpRCxTQUFYLENBQXFCQyxJQUFyQixDQUEwQixFQUFFTSxNQUFNLFdBQVIsRUFBcUJDLE1BQU0sY0FBM0IsRUFBMUI7QUFDRCxLQUZEO0FBR0EvRCxnQkFBWTZELEVBQVosQ0FBZSxzQkFBZixFQUF1QyxZQUFNO0FBQzNDLFlBQUt2RCxLQUFMLENBQVdpRCxTQUFYLENBQXFCQyxJQUFyQixDQUEwQixFQUFFTSxNQUFNLFdBQVIsRUFBcUJDLE1BQU0sZUFBM0IsRUFBMUI7QUFDRCxLQUZEO0FBR0EvRCxnQkFBWTZELEVBQVosQ0FBZSwyQkFBZixFQUE0QyxpQkFBT1AsUUFBUCxDQUFnQixZQUFNO0FBQ2hFLFlBQUtVLFlBQUwsQ0FBa0IsTUFBSzVDLEtBQUwsQ0FBV0UsYUFBN0I7QUFDRCxLQUYyQyxFQUV6QyxHQUZ5QyxFQUVwQyxFQUFFcUMsU0FBUyxJQUFYLEVBRm9DLENBQTVDO0FBR0EzRCxnQkFBWTZELEVBQVosQ0FBZSxrQkFBZixFQUFtQyxpQkFBT1AsUUFBUCxDQUFnQixZQUFNO0FBQ3ZELFlBQUtoRCxLQUFMLENBQVdpRCxTQUFYLENBQXFCQyxJQUFyQixDQUEwQixFQUFFQyxRQUFRLFNBQVYsRUFBcUJDLFFBQVEsQ0FBQyxNQUFLdEMsS0FBTCxDQUFXRSxhQUFaLEVBQTJCLEVBQUV3QyxNQUFNLFFBQVIsRUFBM0IsQ0FBN0IsRUFBMUI7QUFDRCxLQUZrQyxFQUVoQyxHQUZnQyxFQUUzQixFQUFFSCxTQUFTLElBQVgsRUFGMkIsQ0FBbkM7QUFHQTNELGdCQUFZNkQsRUFBWixDQUFlLGtCQUFmLEVBQW1DLGlCQUFPUCxRQUFQLENBQWdCLFlBQU07QUFDdkQsWUFBS2hELEtBQUwsQ0FBV2lELFNBQVgsQ0FBcUJDLElBQXJCLENBQTBCLEVBQUVDLFFBQVEsU0FBVixFQUFxQkMsUUFBUSxDQUFDLE1BQUt0QyxLQUFMLENBQVdFLGFBQVosRUFBMkIsRUFBRXdDLE1BQU0sUUFBUixFQUEzQixDQUE3QixFQUExQjtBQUNELEtBRmtDLEVBRWhDLEdBRmdDLEVBRTNCLEVBQUVILFNBQVMsSUFBWCxFQUYyQixDQUFuQztBQUdBM0QsZ0JBQVk2RCxFQUFaLENBQWUsMkJBQWYsRUFBNEMsWUFBTTtBQUNoRCxZQUFLSSxRQUFMLENBQWMsRUFBRW5DLHNCQUFzQixLQUF4QixFQUFkO0FBQ0QsS0FGRDtBQTVFa0I7QUErRW5COzs7O2lDQUVhUCxNLEVBQVE7QUFDcEIsVUFBSTtBQUNGLGdDQUFHMkMsUUFBSCxDQUFZLGdDQUFnQ0MsS0FBS0MsU0FBTCxDQUFlN0MsTUFBZixDQUFoQyxHQUF5RCxVQUFyRTtBQUNELE9BRkQsQ0FFRSxPQUFPOEMsU0FBUCxFQUFrQjtBQUNsQkMsZ0JBQVFqRCxLQUFSLENBQWNnRCxTQUFkO0FBQ0Q7QUFDRjs7O3FDQUVpQjtBQUNoQixVQUFNRSxZQUFZQyxLQUFLQyxHQUFMLEVBQWxCO0FBQ0EsVUFBTUMsVUFBVSxlQUFLQyxJQUFMLDZCQUF3QixPQUF4QixZQUF5Q0osU0FBekMsQ0FBaEI7QUFDQSw4QkFBR0wsUUFBSCxlQUF3QkMsS0FBS0MsU0FBTCxDQUFlTSxPQUFmLENBQXhCO0FBQ0EsbUJBQUdFLGFBQUgsQ0FBaUIsZUFBS0QsSUFBTCxDQUFVRCxPQUFWLEVBQW1CLE1BQW5CLENBQWpCLEVBQTZDUCxLQUFLQyxTQUFMLENBQWUzQixRQUFRb0MsSUFBdkIsRUFBNkIsSUFBN0IsRUFBbUMsQ0FBbkMsQ0FBN0M7QUFDQSxtQkFBR0QsYUFBSCxDQUFpQixlQUFLRCxJQUFMLENBQVVELE9BQVYsRUFBbUIsS0FBbkIsQ0FBakIsRUFBNENQLEtBQUtDLFNBQUwsQ0FBZTNCLFFBQVFDLEdBQXZCLEVBQTRCLElBQTVCLEVBQWtDLENBQWxDLENBQTVDO0FBQ0EsVUFBSSxhQUFHb0MsVUFBSCxDQUFjLGVBQUtILElBQUwsa0NBQTZCLGlCQUE3QixDQUFkLENBQUosRUFBb0U7QUFDbEUscUJBQUdDLGFBQUgsQ0FBaUIsZUFBS0QsSUFBTCxDQUFVRCxPQUFWLEVBQW1CLEtBQW5CLENBQWpCLEVBQTRDLGFBQUdLLFlBQUgsQ0FBZ0IsZUFBS0osSUFBTCxrQ0FBNkIsaUJBQTdCLENBQWhCLEVBQWlFSyxRQUFqRSxFQUE1QztBQUNEO0FBQ0QsbUJBQUdKLGFBQUgsQ0FBaUIsZUFBS0QsSUFBTCxDQUFVRCxPQUFWLEVBQW1CLE1BQW5CLENBQWpCLEVBQTZDUCxLQUFLQyxTQUFMLENBQWU7QUFDMURhLHNCQUFjLEtBQUs3RCxLQUFMLENBQVdFLGFBRGlDO0FBRTFENEQsb0JBQVksS0FBSzlELEtBRnlDO0FBRzFEK0Qsb0JBQVlBLFVBSDhDO0FBSTFEQyxtQkFBV0E7QUFKK0MsT0FBZixFQUsxQyxJQUwwQyxFQUtwQyxDQUxvQyxDQUE3QztBQU1BLFVBQUksS0FBS2hFLEtBQUwsQ0FBV0UsYUFBZixFQUE4QjtBQUM1QjtBQUNBLGdDQUFHNEMsUUFBSCxnQkFBeUJDLEtBQUtDLFNBQUwsQ0FBZSxlQUFLTyxJQUFMLENBQVVELE9BQVYsRUFBbUIsZ0JBQW5CLENBQWYsQ0FBekIsU0FBaUZQLEtBQUtDLFNBQUwsQ0FBZSxLQUFLaEQsS0FBTCxDQUFXRSxhQUExQixDQUFqRjtBQUNEO0FBQ0Q7QUFDQSw4QkFBRzRDLFFBQUgsZ0JBQXlCQyxLQUFLQyxTQUFMLENBQWUsZUFBS08sSUFBTCxDQUFVLGFBQUdVLE9BQUgsRUFBVixrQkFBc0NkLFNBQXRDLGFBQWYsQ0FBekIsU0FBc0dKLEtBQUtDLFNBQUwsQ0FBZU0sT0FBZixDQUF0RztBQUNEOzs7cUNBRWlCO0FBQ2hCLFVBQU1uQyxNQUFNeEMsT0FBT3lDLGdCQUFQLEVBQVo7QUFDQSxVQUFJRCxJQUFJK0MsZ0JBQUosRUFBSixFQUE0Qi9DLElBQUlnRCxhQUFKLEdBQTVCLEtBQ0toRCxJQUFJSyxZQUFKO0FBQ0wsVUFBSSxLQUFLNEMsSUFBTCxDQUFVQyxLQUFkLEVBQXFCLEtBQUtELElBQUwsQ0FBVUMsS0FBVixDQUFnQkMsY0FBaEI7QUFDckIsVUFBSSxLQUFLRixJQUFMLENBQVVHLFFBQWQsRUFBd0IsS0FBS0gsSUFBTCxDQUFVRyxRQUFWLENBQW1CRCxjQUFuQjtBQUN6Qjs7O3VDQUVtQkUsaUIsRUFBbUI7QUFBQTs7QUFDckMsVUFBSUMsYUFBYTVGLFVBQVU2RixRQUFWLEVBQWpCO0FBQ0EsVUFBSSxDQUFDRCxVQUFMLEVBQWlCLE9BQU8sS0FBTSxDQUFiOztBQUVqQjtBQUNBO0FBQ0EsVUFBSUUsbUJBQUo7QUFDQSxVQUFJO0FBQ0ZBLHFCQUFhNUIsS0FBSzZCLEtBQUwsQ0FBV0gsVUFBWCxDQUFiO0FBQ0QsT0FGRCxDQUVFLE9BQU94QixTQUFQLEVBQWtCO0FBQ2xCQyxnQkFBUTJCLElBQVIsQ0FBYSwrREFBYjtBQUNBRixxQkFBYUYsVUFBYjtBQUNEOztBQUVELFVBQUlLLE1BQU1DLE9BQU4sQ0FBY0osVUFBZCxDQUFKLEVBQStCO0FBQzdCO0FBQ0EsWUFBSUEsV0FBVyxDQUFYLE1BQWtCLG1CQUFsQixJQUF5QyxRQUFPQSxXQUFXLENBQVgsQ0FBUCxNQUF5QixRQUF0RSxFQUFnRjtBQUM5RSxjQUFJSyxnQkFBZ0JMLFdBQVcsQ0FBWCxDQUFwQjs7QUFFQTtBQUNBO0FBQ0EsaUJBQU8sS0FBS3pGLEtBQUwsQ0FBV2lELFNBQVgsQ0FBcUI4QyxPQUFyQixDQUE2QixFQUFFdkMsTUFBTSxRQUFSLEVBQWtCTCxRQUFRLFlBQTFCLEVBQXdDQyxRQUFRLENBQUMsS0FBS3RDLEtBQUwsQ0FBV0UsYUFBWixFQUEyQjhFLGFBQTNCLEVBQTBDUixxQkFBcUIsRUFBL0QsQ0FBaEQsRUFBN0IsRUFBbUosVUFBQ3ZFLEtBQUQsRUFBVztBQUNuSyxnQkFBSUEsS0FBSixFQUFXO0FBQ1RpRCxzQkFBUWpELEtBQVIsQ0FBY0EsS0FBZDtBQUNBLHFCQUFPLE9BQUtSLFlBQUwsQ0FBa0I7QUFDdkJpRCxzQkFBTSxTQURpQjtBQUV2QndDLHVCQUFPLFFBRmdCO0FBR3ZCQyx5QkFBUywrREFIYztBQUl2QkMsMkJBQVcsTUFKWTtBQUt2QkMsNkJBQWE7QUFMVSxlQUFsQixDQUFQO0FBT0Q7QUFDRixXQVhNLENBQVA7QUFZRCxTQWpCRCxNQWlCTztBQUNMO0FBQ0FuQyxrQkFBUTJCLElBQVIsQ0FBYSxzREFBYjtBQUNBLGVBQUtwRixZQUFMLENBQWtCO0FBQ2hCaUQsa0JBQU0sU0FEVTtBQUVoQndDLG1CQUFPLE1BRlM7QUFHaEJDLHFCQUFTLGtEQUhPO0FBSWhCQyx1QkFBVyxNQUpLO0FBS2hCQyx5QkFBYTtBQUxHLFdBQWxCO0FBT0Q7QUFDRixPQTlCRCxNQThCTztBQUNMO0FBQ0EsWUFBSSxPQUFPVixVQUFQLEtBQXNCLFFBQXRCLElBQWtDQSxXQUFXVyxNQUFYLEdBQW9CLENBQTFELEVBQTZEO0FBQzNEO0FBQ0FwQyxrQkFBUTJCLElBQVIsQ0FBYSwrREFBYjtBQUNBLGVBQUtwRixZQUFMLENBQWtCO0FBQ2hCaUQsa0JBQU0sU0FEVTtBQUVoQndDLG1CQUFPLE1BRlM7QUFHaEJDLHFCQUFTLGtEQUhPO0FBSWhCQyx1QkFBVyxNQUpLO0FBS2hCQyx5QkFBYTtBQUxHLFdBQWxCO0FBT0Q7QUFDRjtBQUNGOzs7eUNBRXFCO0FBQUE7O0FBQ3BCLFdBQUtuRyxLQUFMLENBQVdpRCxTQUFYLENBQXFCTSxFQUFyQixDQUF3QixXQUF4QixFQUFxQyxVQUFDMEMsT0FBRCxFQUFhO0FBQ2hELGdCQUFRQSxRQUFReEMsSUFBaEI7QUFDRSxlQUFLLGtCQUFMO0FBQ0UsbUJBQUsyQixjQUFMO0FBQ0E7O0FBRUYsZUFBSyxpQ0FBTDtBQUNFcEIsb0JBQVFxQyxJQUFSLENBQWEsMkNBQWIsRUFBMERKLFFBQVFLLElBQWxFO0FBQ0EsbUJBQU8sT0FBS0Msa0JBQUwsQ0FBd0JOLFFBQVFLLElBQWhDLENBQVA7QUFQSjtBQVNELE9BVkQ7O0FBWUEsV0FBS0UsS0FBTCxHQUFhLHFCQUFnQjtBQUMzQkMsY0FBTSxLQUFLekcsS0FBTCxDQUFXMEcsS0FBWCxDQUFpQkYsS0FBakIsQ0FBdUJDLElBREY7QUFFM0JFLGNBQU0sS0FBSzNHLEtBQUwsQ0FBVzBHLEtBQVgsQ0FBaUJGLEtBQWpCLENBQXVCRyxJQUZGO0FBRzNCQyxtQkFBV0MsT0FBT0Q7QUFIUyxPQUFoQixDQUFiOztBQU1BLFdBQUtKLEtBQUwsQ0FBV00sR0FBWCxDQUFlLE1BQWYsRUFBdUJDLElBQXZCLENBQTRCLFVBQUNDLFdBQUQsRUFBaUI7QUFDM0MsZUFBS0EsV0FBTCxHQUFtQkEsV0FBbkI7O0FBRUFBLG9CQUFZekQsRUFBWixDQUFlLGdDQUFmLEVBQWlELE9BQUs3Qyw0QkFBdEQ7O0FBRUFzRyxvQkFBWXpELEVBQVosQ0FBZSxnQ0FBZixFQUFpRCxPQUFLNUMsNEJBQXREOztBQUVBakIsb0JBQVk2RCxFQUFaLENBQWUsd0JBQWYsRUFBeUMsWUFBTTtBQUM3QyxpQkFBSzBELHNCQUFMLENBQTRCLElBQTVCOztBQUVBO0FBQ0FDLHFCQUFXLFlBQU07QUFDZkYsd0JBQVlHLEtBQVosQ0FBa0IsSUFBbEI7QUFDRCxXQUZEO0FBR0QsU0FQRDs7QUFTQU4sZUFBT3JFLGdCQUFQLENBQXdCLFFBQXhCLEVBQWtDLGlCQUFPNEUsUUFBUCxDQUFnQixZQUFNO0FBQ3REO0FBQ0FKLHNCQUFZSyxrQkFBWjtBQUNBO0FBQ0QsU0FKaUMsQ0FBbEMsRUFJSSxHQUpKO0FBS0QsT0FyQkQ7O0FBdUJBOUUsZUFBU0MsZ0JBQVQsQ0FBMEIsT0FBMUIsRUFBbUMsVUFBQzhFLFVBQUQsRUFBZ0I7QUFDakR0RCxnQkFBUXFDLElBQVIsQ0FBYSx1QkFBYjtBQUNBLFlBQUlrQixVQUFVRCxXQUFXRSxNQUFYLENBQWtCQyxPQUFsQixDQUEwQkMsV0FBMUIsRUFBZDtBQUNBLFlBQUlILFlBQVksT0FBWixJQUF1QkEsWUFBWSxVQUF2QyxFQUFtRDtBQUNqRDtBQUNELFNBRkQsTUFFTztBQUNMO0FBQ0FELHFCQUFXSyxjQUFYO0FBQ0EsaUJBQUtwQixrQkFBTDtBQUNEO0FBQ0YsT0FWRDs7QUFZQSxXQUFLdkcsS0FBTCxDQUFXaUQsU0FBWCxDQUFxQk0sRUFBckIsQ0FBd0IsUUFBeEIsRUFBa0MsVUFBQ0osTUFBRCxFQUFTQyxNQUFULEVBQWlCd0UsRUFBakIsRUFBd0I7QUFDeEQ1RCxnQkFBUXFDLElBQVIsQ0FBYSxpQ0FBYixFQUFnRGxELE1BQWhELEVBQXdEQyxNQUF4RDtBQUNBO0FBQ0E7QUFDQSxlQUFPd0UsSUFBUDtBQUNELE9BTEQ7O0FBT0EsV0FBSzVILEtBQUwsQ0FBV2lELFNBQVgsQ0FBcUJNLEVBQXJCLENBQXdCLE1BQXhCLEVBQWdDLFlBQU07QUFDcEMsZUFBS3ZELEtBQUwsQ0FBV2lELFNBQVgsQ0FBcUI4QyxPQUFyQixDQUE2QixFQUFFNUMsUUFBUSxxQkFBVixFQUFpQ0MsUUFBUSxFQUF6QyxFQUE3QixFQUE0RSxVQUFDckMsS0FBRCxFQUFROEcsVUFBUixFQUF1QjtBQUNqRyxjQUFJOUcsS0FBSixFQUFXO0FBQ1RpRCxvQkFBUWpELEtBQVIsQ0FBY0EsS0FBZDtBQUNBLG1CQUFPLE9BQUtSLFlBQUwsQ0FBa0I7QUFDdkJpRCxvQkFBTSxPQURpQjtBQUV2QndDLHFCQUFPLFFBRmdCO0FBR3ZCQyx1QkFBUyx5SkFIYztBQUl2QkMseUJBQVcsTUFKWTtBQUt2QkMsMkJBQWE7QUFMVSxhQUFsQixDQUFQO0FBT0Q7O0FBRUQ1RyxtQkFBU3VJLGNBQVQsQ0FBd0IsRUFBRUMsYUFBYUYsY0FBY0EsV0FBV3BHLFFBQXhDLEVBQXhCO0FBQ0FsQyxtQkFBU3lJLFVBQVQsQ0FBb0IsZ0JBQXBCOztBQUVBO0FBQ0FkLHFCQUFXLFlBQU07QUFDZixtQkFBS3ZELFFBQUwsQ0FBYztBQUNackMsNEJBQWMsSUFERjtBQUVaMkcseUJBQVdKLGNBQWNBLFdBQVdJLFNBRnhCO0FBR1pDLGdDQUFrQkwsY0FBY0EsV0FBV0ssZ0JBSC9CO0FBSVp6Ryx3QkFBVW9HLGNBQWNBLFdBQVdwRyxRQUp2QjtBQUtaRixtQ0FBcUJzRyxjQUFjQSxXQUFXTTtBQUxsQyxhQUFkO0FBT0EsZ0JBQUksT0FBS25JLEtBQUwsQ0FBV2lCLE1BQWYsRUFBdUI7QUFDckI7QUFDQTtBQUNBLHFCQUFPLE9BQUttSCxZQUFMLENBQWtCLElBQWxCLEVBQXdCLE9BQUtwSSxLQUFMLENBQVdpQixNQUFuQyxFQUEyQyxVQUFDRixLQUFELEVBQVc7QUFDM0Qsb0JBQUlBLEtBQUosRUFBVztBQUNUaUQsMEJBQVFqRCxLQUFSLENBQWNBLEtBQWQ7QUFDQSx5QkFBSzRDLFFBQUwsQ0FBYyxFQUFFMEUsb0JBQW9CdEgsS0FBdEIsRUFBZDtBQUNBLHlCQUFPLE9BQUtSLFlBQUwsQ0FBa0I7QUFDdkJpRCwwQkFBTSxPQURpQjtBQUV2QndDLDJCQUFPLFFBRmdCO0FBR3ZCQyw2QkFBUyx3SkFIYztBQUl2QkMsK0JBQVcsTUFKWTtBQUt2QkMsaUNBQWE7QUFMVSxtQkFBbEIsQ0FBUDtBQU9EO0FBQ0YsZUFaTSxDQUFQO0FBYUQ7QUFDRixXQXpCRCxFQXlCRyxJQXpCSDtBQTBCRCxTQTFDRDtBQTJDRCxPQTVDRDtBQTZDRDs7OzJDQUV1QjtBQUN0QixXQUFLYSxXQUFMLENBQWlCc0IsR0FBakIsQ0FBcUIsZ0NBQXJCLEVBQXVELEtBQUs1SCw0QkFBNUQ7QUFDQSxXQUFLc0csV0FBTCxDQUFpQnNCLEdBQWpCLENBQXFCLGdDQUFyQixFQUF1RCxLQUFLM0gsNEJBQTVEO0FBQ0Q7Ozt1REFFb0Q7QUFBQSxVQUFyQjRILFFBQXFCLFFBQXJCQSxRQUFxQjtBQUFBLFVBQVhDLE9BQVcsUUFBWEEsT0FBVzs7QUFDbkQsVUFBSUEsWUFBWSxTQUFoQixFQUEyQjtBQUFFO0FBQVE7O0FBRXJDLFVBQUk7QUFDRjtBQUNBLFlBQUlDLFVBQVVsRyxTQUFTbUcsYUFBVCxDQUF1QkgsUUFBdkIsQ0FBZDs7QUFGRSxvQ0FHa0JFLFFBQVFFLHFCQUFSLEVBSGxCO0FBQUEsWUFHSUMsR0FISix5QkFHSUEsR0FISjtBQUFBLFlBR1NDLElBSFQseUJBR1NBLElBSFQ7O0FBS0YsYUFBSzdCLFdBQUwsQ0FBaUI4Qix5QkFBakIsQ0FBMkMsU0FBM0MsRUFBc0QsRUFBRUYsUUFBRixFQUFPQyxVQUFQLEVBQXREO0FBQ0QsT0FORCxDQU1FLE9BQU85SCxLQUFQLEVBQWM7QUFDZGlELGdCQUFRakQsS0FBUiwrQkFBMEN3SCxRQUExQyxvQkFBaUVDLE9BQWpFO0FBQ0Q7QUFDRjs7O21EQUUrQjtBQUM5QixXQUFLeEIsV0FBTCxDQUFpQitCLHlCQUFqQixDQUEyQyxTQUEzQyxFQUFzRCxFQUFFSCxLQUFLLENBQVAsRUFBVUMsTUFBTSxDQUFoQixFQUF0RDtBQUNEOzs7dUNBRW1CO0FBQ2xCO0FBQ0Q7Ozt3Q0FFb0JHLE8sRUFBU0MsQyxFQUFHO0FBQy9CLGFBQ0U7QUFDRSxtQkFBV0QsUUFBUXhGLElBRHJCO0FBRUUsb0JBQVl3RixRQUFRaEQsS0FGdEI7QUFHRSxzQkFBY2dELFFBQVEvQyxPQUh4QjtBQUlFLG1CQUFXK0MsUUFBUTlDLFNBSnJCO0FBS0UsYUFBSytDLElBQUlELFFBQVFoRCxLQUxuQjtBQU1FLGVBQU9pRCxDQU5UO0FBT0Usc0JBQWMsS0FBSzNJLFlBUHJCO0FBUUUscUJBQWEwSSxRQUFRN0MsV0FSdkI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFFBREY7QUFXRDs7OzJDQUV1QjlFLGdCLEVBQWtCO0FBQ3hDLFdBQUtzQyxRQUFMLENBQWMsRUFBQ3RDLGtDQUFELEVBQWQ7QUFDRDs7O29DQUVnQlUsUyxFQUFXO0FBQzFCLFdBQUs0QixRQUFMLENBQWMsRUFBQzVCLG9CQUFELEVBQWQ7O0FBRUEsVUFBSUEsY0FBYyxpQkFBbEIsRUFBcUM7QUFDbkMsYUFBS2lGLFdBQUwsQ0FBaUJrQyxJQUFqQjtBQUNEO0FBQ0Y7OztxQ0FFaUJ6SCxRLEVBQVVDLFEsRUFBVWtHLEUsRUFBSTtBQUFBOztBQUN4QyxhQUFPLEtBQUs1SCxLQUFMLENBQVdpRCxTQUFYLENBQXFCOEMsT0FBckIsQ0FBNkIsRUFBRTVDLFFBQVEsa0JBQVYsRUFBOEJDLFFBQVEsQ0FBQzNCLFFBQUQsRUFBV0MsUUFBWCxDQUF0QyxFQUE3QixFQUEyRixVQUFDWCxLQUFELEVBQVE4RyxVQUFSLEVBQXVCO0FBQ3ZILFlBQUk5RyxLQUFKLEVBQVcsT0FBTzZHLEdBQUc3RyxLQUFILENBQVA7QUFDWHhCLGlCQUFTdUksY0FBVCxDQUF3QixFQUFFQyxhQUFhdEcsUUFBZixFQUF4QjtBQUNBbEMsaUJBQVN5SSxVQUFULENBQW9CLDRCQUFwQixFQUFrRCxFQUFFdkcsa0JBQUYsRUFBbEQ7QUFDQSxlQUFLa0MsUUFBTCxDQUFjO0FBQ1psQyw0QkFEWTtBQUVaQyw0QkFGWTtBQUdadUcscUJBQVdKLGNBQWNBLFdBQVdJLFNBSHhCO0FBSVpDLDRCQUFrQkwsY0FBY0EsV0FBV0ssZ0JBSi9CO0FBS1ozRywrQkFBcUJzRyxjQUFjQSxXQUFXTTtBQUxsQyxTQUFkO0FBT0EsZUFBT1AsR0FBRyxJQUFILEVBQVNDLFVBQVQsQ0FBUDtBQUNELE9BWk0sQ0FBUDtBQWFEOzs7NkNBRXlCO0FBQ3hCLGFBQU8sS0FBS2xFLFFBQUwsQ0FBYyxFQUFFcEMscUJBQXFCLElBQXZCLEVBQWQsQ0FBUDtBQUNEOzs7dUNBRW1CNEgsVyxFQUFhO0FBQy9CO0FBQ0Q7OztpQ0FFYXZCLEUsRUFBSTtBQUFBOztBQUNoQixhQUFPLEtBQUs1SCxLQUFMLENBQVdpRCxTQUFYLENBQXFCOEMsT0FBckIsQ0FBNkIsRUFBRTVDLFFBQVEsY0FBVixFQUEwQkMsUUFBUSxFQUFsQyxFQUE3QixFQUFxRSxVQUFDckMsS0FBRCxFQUFRaUIsWUFBUixFQUF5QjtBQUNuRyxZQUFJakIsS0FBSixFQUFXLE9BQU82RyxHQUFHN0csS0FBSCxDQUFQO0FBQ1gsZUFBSzRDLFFBQUwsQ0FBYyxFQUFFM0IsMEJBQUYsRUFBZDtBQUNBdEMsb0JBQVl3RCxJQUFaLENBQWlCLGdDQUFqQixFQUFtRGxCLFlBQW5EO0FBQ0EsZUFBTzRGLEdBQUcsSUFBSCxFQUFTNUYsWUFBVCxDQUFQO0FBQ0QsT0FMTSxDQUFQO0FBTUQ7OztrQ0FFY1osVyxFQUFhRCxhLEVBQWV5RyxFLEVBQUk7QUFBQTs7QUFDN0N6RyxzQkFBZ0I7QUFDZGlJLDZCQUFxQixJQURQLEVBQ2E7QUFDM0JDLHNCQUFjbEksY0FBY2tJLFlBRmQ7QUFHZEMscUJBQWFuSSxjQUFjbUksV0FIYjtBQUlkcEIsMEJBQWtCLEtBQUtwSCxLQUFMLENBQVdvSCxnQkFKZjtBQUtkcUIsb0JBQVksS0FBS3pJLEtBQUwsQ0FBV1csUUFMVDtBQU1kTCxnQ0FOYyxDQU1GO0FBTkUsT0FBaEI7O0FBU0E3QixlQUFTeUksVUFBVCxDQUFvQiwyQkFBcEIsRUFBaUQ7QUFDL0N2RyxrQkFBVSxLQUFLWCxLQUFMLENBQVdXLFFBRDBCO0FBRS9DK0gsaUJBQVNwSSxXQUZzQztBQUcvQ3FJLHNCQUFjLEtBQUszSSxLQUFMLENBQVdvSDtBQUhzQixPQUFqRDs7QUFNQSxhQUFPLEtBQUtsSSxLQUFMLENBQVdpRCxTQUFYLENBQXFCOEMsT0FBckIsQ0FBNkIsRUFBRTVDLFFBQVEsbUJBQVYsRUFBK0JDLFFBQVEsQ0FBQ2hDLFdBQUQsRUFBY0QsYUFBZCxFQUE2QixLQUFLTCxLQUFMLENBQVdXLFFBQXhDLEVBQWtELEtBQUtYLEtBQUwsQ0FBV1ksUUFBN0QsQ0FBdkMsRUFBN0IsRUFBOEksVUFBQ2dJLEdBQUQsRUFBTTFJLGFBQU4sRUFBd0I7QUFDM0ssWUFBSTBJLEdBQUosRUFBUyxPQUFPOUIsR0FBRzhCLEdBQUgsQ0FBUDs7QUFFVCxlQUFPLE9BQUsxSixLQUFMLENBQVdpRCxTQUFYLENBQXFCOEMsT0FBckIsQ0FBNkIsRUFBRTVDLFFBQVEsY0FBVixFQUEwQkMsUUFBUSxDQUFDaEMsV0FBRCxFQUFjSixhQUFkLENBQWxDLEVBQTdCLEVBQStGLFVBQUMwSSxHQUFELEVBQU14SSxnQkFBTixFQUEyQjtBQUMvSCxjQUFJd0ksR0FBSixFQUFTLE9BQU85QixHQUFHOEIsR0FBSCxDQUFQOztBQUVUO0FBQ0EsMkJBQU9DLE1BQVAsQ0FBY3hJLGFBQWQsRUFBNkJELGlCQUFpQnNJLE9BQTlDOztBQUVBakssbUJBQVN5SSxVQUFULENBQW9CLDBCQUFwQixFQUFnRDtBQUM5Q3ZHLHNCQUFVLE9BQUtYLEtBQUwsQ0FBV1csUUFEeUI7QUFFOUMrSCxxQkFBU3BJLFdBRnFDO0FBRzlDcUksMEJBQWMsT0FBSzNJLEtBQUwsQ0FBV29IO0FBSHFCLFdBQWhEOztBQU1BO0FBQ0EsaUJBQUtsSSxLQUFMLENBQVdpRCxTQUFYLENBQXFCaEMsTUFBckIsR0FBOEJELGFBQTlCLENBYitILENBYW5GO0FBQzVDLGlCQUFLMkMsUUFBTCxDQUFjLEVBQUUzQyw0QkFBRixFQUFpQkUsa0NBQWpCLEVBQW1DQyw0QkFBbkMsRUFBa0RDLHdCQUFsRCxFQUErREMsa0JBQWtCLEtBQWpGLEVBQWQ7O0FBRUEsaUJBQU91RyxJQUFQO0FBQ0QsU0FqQk0sQ0FBUDtBQWtCRCxPQXJCTSxDQUFQO0FBc0JEOzs7aUNBRWFnQyxnQixFQUFrQjVJLGEsRUFBZTRHLEUsRUFBSTtBQUNqRHJJLGVBQVN5SSxVQUFULENBQW9CLDBCQUFwQixFQUFnRDtBQUM5Q3ZHLGtCQUFVLEtBQUtYLEtBQUwsQ0FBV1csUUFEeUI7QUFFOUMrSCxpQkFBU0k7QUFGcUMsT0FBaEQ7O0FBS0E7QUFDQSxhQUFPLEtBQUt2SixhQUFMLENBQW1CdUosZ0JBQW5CLEVBQXFDLEVBQUVOLGFBQWF0SSxhQUFmLEVBQXJDLEVBQXFFNEcsRUFBckUsQ0FBUDtBQUNEOzs7aUNBRWFpQyxLLEVBQU9DLEUsRUFBSTtBQUFBOztBQUN2QixVQUFNbkksVUFBVSxLQUFLYixLQUFMLENBQVdhLE9BQTNCO0FBQ0EsVUFBSWtJLFVBQVVFLFNBQWQsRUFBeUI7QUFDdkIsYUFBS3BHLFFBQUwsQ0FBYztBQUNaaEMsZ0RBQWFBLFFBQVFxSSxLQUFSLENBQWMsQ0FBZCxFQUFpQkgsS0FBakIsQ0FBYixzQkFBeUNsSSxRQUFRcUksS0FBUixDQUFjSCxRQUFRLENBQXRCLENBQXpDO0FBRFksU0FBZDtBQUdELE9BSkQsTUFJTyxJQUFJQyxPQUFPQyxTQUFYLEVBQXNCO0FBQzNCO0FBQ0EseUJBQU9FLElBQVAsQ0FBWXRJLE9BQVosRUFBcUIsVUFBQ3VJLE1BQUQsRUFBU0wsS0FBVCxFQUFtQjtBQUN0QyxjQUFJSyxPQUFPSixFQUFQLEtBQWNBLEVBQWxCLEVBQXNCLE9BQUt4SixZQUFMLENBQWtCdUosS0FBbEI7QUFDdkIsU0FGRDtBQUdEO0FBQ0Y7OztpQ0FFYUssTSxFQUFRO0FBQUE7O0FBQ3BCOzs7Ozs7OztBQVFBQSxhQUFPSixFQUFQLEdBQVlLLEtBQUtDLE1BQUwsS0FBZ0IsRUFBNUI7O0FBRUEsVUFBTXpJLFVBQVUsS0FBS2IsS0FBTCxDQUFXYSxPQUEzQjtBQUNBLFVBQUkwSSxtQkFBbUIsS0FBdkI7O0FBRUExSSxjQUFRMkksT0FBUixDQUFnQixVQUFDQyxDQUFELEVBQUl0QixDQUFKLEVBQVU7QUFDeEIsWUFBSXNCLEVBQUV0RSxPQUFGLEtBQWNpRSxPQUFPakUsT0FBekIsRUFBa0M7QUFDaEN0RSxrQkFBUTZJLE1BQVIsQ0FBZXZCLENBQWYsRUFBa0IsQ0FBbEI7QUFDQW9CLDZCQUFtQixJQUFuQjtBQUNBLGlCQUFLMUcsUUFBTCxDQUFjLEVBQUVoQyxnQkFBRixFQUFkLEVBQTJCLFlBQU07QUFDL0JBLG9CQUFROEksT0FBUixDQUFnQlAsTUFBaEI7QUFDQSxtQkFBS3ZHLFFBQUwsQ0FBYyxFQUFFaEMsZ0JBQUYsRUFBZDtBQUNELFdBSEQ7QUFJRDtBQUNGLE9BVEQ7O0FBV0EsVUFBSSxDQUFDMEksZ0JBQUwsRUFBdUI7QUFDckIxSSxnQkFBUThJLE9BQVIsQ0FBZ0JQLE1BQWhCO0FBQ0EsYUFBS3ZHLFFBQUwsQ0FBYyxFQUFFaEMsZ0JBQUYsRUFBZDtBQUNEOztBQUVELGFBQU91SSxNQUFQO0FBQ0Q7OztxQ0FFaUJRLGtCLEVBQW9CQyxlLEVBQWlCO0FBQ3JELFdBQUtoSCxRQUFMLENBQWMsRUFBRWlILHFCQUFxQixJQUF2QixFQUFkO0FBQ0EsVUFBSUQsbUJBQW1CQSxnQkFBZ0JFLE9BQXZDLEVBQWdEO0FBQzlDLGFBQUszRixJQUFMLENBQVVDLEtBQVYsQ0FBZ0IyRixVQUFoQixDQUEyQkgsZUFBM0IsRUFBNEMsS0FBS2pJLFdBQWpELEVBQThELEtBQUtFLFdBQW5FO0FBQ0Q7QUFDRjs7O3VDQUVtQm1JLG9CLEVBQXNCSixlLEVBQWlCO0FBQ3pELFdBQUtoSCxRQUFMLENBQWMsRUFBRWlILHFCQUFxQkQsZUFBdkIsRUFBZDtBQUNEOzs7Z0RBRTRCO0FBQzNCLFdBQUtoSCxRQUFMLENBQWMsRUFBRW5DLHNCQUFzQixJQUF4QixFQUFkO0FBQ0Q7OztpREFFNkI7QUFDNUIsYUFDRTtBQUFBO0FBQUEsVUFBSyxPQUFPLEVBQUV3SixVQUFVLFVBQVosRUFBd0JDLE9BQU8sTUFBL0IsRUFBdUNDLFFBQVEsTUFBL0MsRUFBWjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDRTtBQUFBO0FBQUE7QUFDRSw0QkFBZSxPQURqQjtBQUVFLG9DQUF3QixHQUYxQjtBQUdFLG9DQUF3QixHQUgxQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFJRTtBQUFBO0FBQUEsY0FBSyxPQUFPLEVBQUNGLFVBQVUsVUFBWCxFQUF1QkcsT0FBTyxDQUE5QixFQUFpQ3ZDLEtBQUssQ0FBdEMsRUFBeUNxQyxPQUFPLEdBQWhELEVBQVo7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0csNkJBQU9HLEdBQVAsQ0FBVyxLQUFLdEssS0FBTCxDQUFXYSxPQUF0QixFQUErQixLQUFLbkIsbUJBQXBDO0FBREg7QUFKRixTQURGO0FBU0U7QUFBQTtBQUFBLFlBQUssT0FBTyxFQUFFNkssU0FBUyxPQUFYLEVBQW9CSixPQUFPLE1BQTNCLEVBQW1DQyxRQUFRLE1BQTNDLEVBQW1ERixVQUFVLFVBQTdELEVBQXlFcEMsS0FBSyxDQUE5RSxFQUFpRkMsTUFBTSxDQUF2RixFQUFaO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNFO0FBQUE7QUFBQSxjQUFLLE9BQU8sRUFBRXdDLFNBQVMsWUFBWCxFQUF5QkosT0FBTyxNQUFoQyxFQUF3Q0MsUUFBUSxNQUFoRCxFQUF3REksZUFBZSxRQUF2RSxFQUFpRkMsV0FBVyxRQUE1RixFQUFaO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNFO0FBQUE7QUFBQSxnQkFBSyxPQUFNLE9BQVgsRUFBbUIsUUFBTyxPQUExQixFQUFrQyxTQUFRLGFBQTFDLEVBQXdELFNBQVEsS0FBaEU7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0U7QUFBQTtBQUFBLGtCQUFHLElBQUcsUUFBTixFQUFlLFFBQU8sTUFBdEIsRUFBNkIsYUFBWSxHQUF6QyxFQUE2QyxNQUFLLE1BQWxELEVBQXlELFVBQVMsU0FBbEU7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0U7QUFBQTtBQUFBLG9CQUFHLElBQUcsVUFBTixFQUFpQixXQUFVLHFDQUEzQixFQUFpRSxVQUFTLFNBQTFFLEVBQW9GLE1BQUssU0FBekY7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0U7QUFBQTtBQUFBLHNCQUFHLElBQUcsZUFBTixFQUFzQixXQUFVLG1DQUFoQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDRSw0REFBTSxHQUFFLCtuRkFBUixFQUF3b0YsSUFBRyxnQkFBM29GO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxzQkFERjtBQUVFLDREQUFNLEdBQUUsaXZDQUFSLEVBQTB2QyxJQUFHLGdCQUE3dkM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLHNCQUZGO0FBR0UsNERBQU0sR0FBRSw0NUNBQVIsRUFBcTZDLElBQUcsZ0JBQXg2QztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFIRjtBQURGO0FBREY7QUFERixhQURGO0FBWUU7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsY0FaRjtBQWFFO0FBQUE7QUFBQSxnQkFBTSxPQUFPLEVBQUVDLE9BQU8sU0FBVCxFQUFvQkgsU0FBUyxjQUE3QixFQUE2Q0osT0FBTyxNQUFwRCxFQUE0REMsUUFBUSxFQUFwRSxFQUF3RUYsVUFBVSxVQUFsRixFQUE4RlMsUUFBUSxFQUF0RyxFQUEwRzVDLE1BQU0sQ0FBaEgsRUFBYjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBbUksbUJBQUsvSCxLQUFMLENBQVdjO0FBQTlJO0FBYkY7QUFERjtBQVRGLE9BREY7QUE2QkQ7Ozs2QkFFUztBQUNSLFVBQUksS0FBS2QsS0FBTCxDQUFXUSxZQUFYLEtBQTRCLENBQUMsS0FBS1IsS0FBTCxDQUFXUyxtQkFBWixJQUFtQyxDQUFDLEtBQUtULEtBQUwsQ0FBV1csUUFBM0UsQ0FBSixFQUEwRjtBQUN4RixlQUNFO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNFO0FBQ0Usc0JBQVUsS0FBS3hCLGdCQURqQjtBQUVFLDZCQUFpQixLQUFLRTtBQUZ4QixhQUdNLEtBQUtILEtBSFg7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFERixTQURGO0FBUUQ7O0FBRUQsVUFBSSxDQUFDLEtBQUtjLEtBQUwsQ0FBV1MsbUJBQVosSUFBbUMsQ0FBQyxLQUFLVCxLQUFMLENBQVdXLFFBQW5ELEVBQTZEO0FBQzNELGVBQU8sS0FBS2lLLDBCQUFMLEVBQVA7QUFDRDs7QUFFRCxVQUFJLEtBQUs1SyxLQUFMLENBQVdPLGdCQUFmLEVBQWlDO0FBQy9CLGVBQ0U7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0U7QUFDRSwwQkFBYyxLQUFLakIsWUFEckI7QUFFRSwyQkFBZSxLQUFLQyxhQUZ0QjtBQUdFLDBCQUFjLEtBQUtFLFlBSHJCO0FBSUUsMEJBQWMsS0FBS0QsWUFKckI7QUFLRSxxQkFBUyxLQUFLUSxLQUFMLENBQVdhLE9BTHRCO0FBTUUsbUJBQU8sS0FBSzZFO0FBTmQsYUFPTSxLQUFLeEcsS0FQWDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxhQURGO0FBU0UsMERBQU0sY0FBYyxLQUFLYyxLQUFMLENBQVdrQixZQUEvQixFQUE2QyxPQUFPLEtBQUt3RSxLQUF6RCxFQUFnRSxzQkFBaEU7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFlBVEY7QUFVRSxpRUFBYSwyQkFBMkIsS0FBSzVGLHlCQUE3QyxFQUF3RSxlQUFlLENBQUMsS0FBS0UsS0FBTCxDQUFXVSxvQkFBbkc7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBVkYsU0FERjtBQWNEOztBQUVELFVBQUksQ0FBQyxLQUFLVixLQUFMLENBQVdFLGFBQWhCLEVBQStCO0FBQzdCLGVBQ0U7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0UsMERBQU0sY0FBYyxLQUFLRixLQUFMLENBQVdrQixZQUEvQixFQUE2QyxPQUFPLEtBQUt3RSxLQUF6RDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsWUFERjtBQUVFLGlFQUFhLDJCQUEyQixLQUFLNUYseUJBQTdDLEVBQXdFLGVBQWUsQ0FBQyxLQUFLRSxLQUFMLENBQVdVLG9CQUFuRztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsWUFGRjtBQUdFO0FBQ0UsMEJBQWMsS0FBS3BCLFlBRHJCO0FBRUUsMkJBQWUsS0FBS0MsYUFGdEI7QUFHRSwwQkFBYyxLQUFLRSxZQUhyQjtBQUlFLDBCQUFjLEtBQUtELFlBSnJCO0FBS0UscUJBQVMsS0FBS1EsS0FBTCxDQUFXYSxPQUx0QjtBQU1FLG1CQUFPLEtBQUs2RTtBQU5kLGFBT00sS0FBS3hHLEtBUFg7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFIRixTQURGO0FBY0Q7O0FBRUQsVUFBSSxDQUFDLEtBQUtjLEtBQUwsQ0FBV0ksZ0JBQVosSUFBZ0MsS0FBS0osS0FBTCxDQUFXdUgsa0JBQS9DLEVBQW1FO0FBQ2pFLGVBQ0U7QUFBQTtBQUFBLFlBQUssT0FBTyxFQUFFMkMsVUFBVSxVQUFaLEVBQXdCQyxPQUFPLE1BQS9CLEVBQXVDQyxRQUFRLE1BQS9DLEVBQVo7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0U7QUFBQTtBQUFBO0FBQ0UsOEJBQWUsT0FEakI7QUFFRSxzQ0FBd0IsR0FGMUI7QUFHRSxzQ0FBd0IsR0FIMUI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBSUU7QUFBQTtBQUFBLGdCQUFLLE9BQU8sRUFBQ0YsVUFBVSxVQUFYLEVBQXVCRyxPQUFPLENBQTlCLEVBQWlDdkMsS0FBSyxDQUF0QyxFQUF5Q3FDLE9BQU8sR0FBaEQsRUFBWjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDRywrQkFBT0csR0FBUCxDQUFXLEtBQUt0SyxLQUFMLENBQVdhLE9BQXRCLEVBQStCLEtBQUtuQixtQkFBcEM7QUFESDtBQUpGLFdBREY7QUFTRTtBQUFBO0FBQUEsY0FBSyxPQUFPLEVBQUV3SyxVQUFVLFVBQVosRUFBd0JDLE9BQU8sTUFBL0IsRUFBdUNDLFFBQVEsTUFBL0MsRUFBWjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDRTtBQUFBO0FBQUEsZ0JBQUssT0FBTyxFQUFFRixVQUFVLFVBQVosRUFBd0JwQyxLQUFLLEtBQTdCLEVBQW9DQyxNQUFNLEtBQTFDLEVBQWlEOEMsV0FBVyx1QkFBNUQsRUFBWjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDRTtBQUFBO0FBQUEsa0JBQU0sT0FBTyxFQUFFQyxVQUFVLEVBQVosRUFBZ0JKLE9BQU8sTUFBdkIsRUFBYjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBREY7QUFERjtBQVRGLFNBREY7QUFpQkQ7O0FBRUQsYUFDRTtBQUFBO0FBQUEsVUFBSyxPQUFPLEVBQUVSLFVBQVUsVUFBWixFQUF3QkMsT0FBTyxNQUEvQixFQUF1Q0MsUUFBUSxNQUEvQyxFQUFaO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNFLCtEQUFhLDJCQUEyQixLQUFLdEsseUJBQTdDLEVBQXdFLGVBQWUsQ0FBQyxLQUFLRSxLQUFMLENBQVdVLG9CQUFuRztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsVUFERjtBQUVFLHdEQUFNLGNBQWMsS0FBS1YsS0FBTCxDQUFXa0IsWUFBL0IsRUFBNkMsT0FBTyxLQUFLd0UsS0FBekQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFVBRkY7QUFHRTtBQUFBO0FBQUEsWUFBSyxPQUFPLEVBQUV3RSxVQUFVLFVBQVosRUFBd0JDLE9BQU8sTUFBL0IsRUFBdUNDLFFBQVEsTUFBL0MsRUFBdUR0QyxLQUFLLENBQTVELEVBQStEQyxNQUFNLENBQXJFLEVBQVo7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0U7QUFBQTtBQUFBLGNBQUssV0FBVSxZQUFmLEVBQTRCLE9BQU8sRUFBQ2dELFVBQVUsU0FBWCxFQUFuQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDRTtBQUFBO0FBQUE7QUFDRSxnQ0FBZSxPQURqQjtBQUVFLHdDQUF3QixHQUYxQjtBQUdFLHdDQUF3QixHQUgxQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFJRTtBQUFBO0FBQUEsa0JBQUssT0FBTyxFQUFDYixVQUFVLFVBQVgsRUFBdUJHLE9BQU8sQ0FBOUIsRUFBaUN2QyxLQUFLLENBQXRDLEVBQXlDcUMsT0FBTyxHQUFoRCxFQUFaO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNHLGlDQUFPRyxHQUFQLENBQVcsS0FBS3RLLEtBQUwsQ0FBV2EsT0FBdEIsRUFBK0IsS0FBS25CLG1CQUFwQztBQURIO0FBSkYsYUFERjtBQVNFO0FBQUE7QUFBQSxnQkFBVyxnQkFBZ0IsS0FBS3NMLGdCQUFMLENBQXNCNUwsSUFBdEIsQ0FBMkIsSUFBM0IsQ0FBM0IsRUFBNkQsT0FBTSxZQUFuRSxFQUFnRixTQUFTLEdBQXpGLEVBQThGLGFBQWEsS0FBS0YsS0FBTCxDQUFXa0wsTUFBWCxHQUFvQixJQUEvSDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDRTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDRTtBQUFBO0FBQUEsb0JBQVcsZ0JBQWdCLEtBQUtZLGdCQUFMLENBQXNCNUwsSUFBdEIsQ0FBMkIsSUFBM0IsQ0FBM0IsRUFBNkQsT0FBTSxVQUFuRSxFQUE4RSxTQUFTLEdBQXZGLEVBQTRGLGFBQWEsR0FBekc7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0U7QUFBQTtBQUFBO0FBQ0UsOENBQXdCLEtBQUsrRyxzQkFBTCxDQUE0Qi9HLElBQTVCLENBQWlDLElBQWpDLENBRDFCO0FBRUUsdUNBQWlCLEtBQUs2TCxlQUFMLENBQXFCN0wsSUFBckIsQ0FBMEIsSUFBMUIsQ0FGbkI7QUFHRSxpQ0FBVyxLQUFLWSxLQUFMLENBQVdpQixTQUh4QjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFJRyx5QkFBS2pCLEtBQUwsQ0FBV2lCLFNBQVgsS0FBeUIsU0FBekIsR0FDRztBQUNBLDhCQUFRLEtBQUtsQixNQURiO0FBRUEsOEJBQVEsS0FBS0MsS0FBTCxDQUFXRSxhQUZuQjtBQUdBLDZCQUFPLEtBQUtoQixLQUFMLENBQVcwRyxLQUhsQjtBQUlBLGlDQUFXLEtBQUsxRyxLQUFMLENBQVdpRCxTQUp0QjtBQUtBLG1DQUFhLEtBQUsrRCxXQUxsQjtBQU1BLGlDQUFXLEtBQUtnRixnQkFBTCxDQUFzQjlMLElBQXRCLENBQTJCLElBQTNCLENBTlg7QUFPQSxtQ0FBYSxLQUFLK0wsa0JBQUwsQ0FBd0IvTCxJQUF4QixDQUE2QixJQUE3QixDQVBiO0FBUUEsb0NBQWMsS0FBS0ssWUFSbkI7QUFTQSxvQ0FBYyxLQUFLRCxZQVRuQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsc0JBREgsR0FXRztBQUNBLG9DQUFjLEtBQUtDLFlBRG5CO0FBRUEsb0NBQWMsS0FBS0QsWUFGbkI7QUFHQSw4QkFBUSxLQUFLUSxLQUFMLENBQVdFLGFBSG5CO0FBSUEsaUNBQVcsS0FBS2hCLEtBQUwsQ0FBV2lELFNBSnRCO0FBS0EsbUNBQWEsS0FBSytELFdBTGxCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQWZOLG1CQURGO0FBd0JFO0FBQUE7QUFBQSxzQkFBSyxPQUFPLEVBQUNnRSxVQUFVLFVBQVgsRUFBdUJDLE9BQU8sTUFBOUIsRUFBc0NDLFFBQVEsTUFBOUMsRUFBWjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDRTtBQUNFLDJCQUFJLE9BRE47QUFFRSw4QkFBUSxLQUFLcEssS0FBTCxDQUFXRSxhQUZyQjtBQUdFLDZCQUFPLEtBQUt3RixLQUhkO0FBSUUsNkJBQU8sS0FBS3hHLEtBQUwsQ0FBVzBHLEtBSnBCO0FBS0UsaUNBQVcsS0FBSzFHLEtBQUwsQ0FBV2lELFNBTHhCO0FBTUUsK0JBQVMsS0FBS25DLEtBQUwsQ0FBV0ssYUFOdEI7QUFPRSxvQ0FBYyxLQUFLWixZQVByQjtBQVFFLG9DQUFjLEtBQUtELFlBUnJCO0FBU0UsMENBQW9CLEtBQUtHLGtCQVQzQjtBQVVFLHdDQUFrQixLQUFLSyxLQUFMLENBQVdvSCxnQkFWL0I7QUFXRSxpQ0FBVyxLQUFLcEgsS0FBTCxDQUFXbUgsU0FYeEI7QUFZRSxnQ0FBVSxLQUFLbkgsS0FBTCxDQUFXVyxRQVp2QjtBQWFFLGdDQUFVLEtBQUtYLEtBQUwsQ0FBV1ksUUFidkI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLHNCQURGO0FBZUkseUJBQUtaLEtBQUwsQ0FBVzhKLG1CQUFaLEdBQ0csdUNBQUssT0FBTyxFQUFFSyxPQUFPLE1BQVQsRUFBaUJDLFFBQVEsTUFBekIsRUFBaUNnQixpQkFBaUIsT0FBbEQsRUFBMkRDLFNBQVMsSUFBcEUsRUFBMEVuQixVQUFVLFVBQXBGLEVBQWdHcEMsS0FBSyxDQUFyRyxFQUF3R0MsTUFBTSxDQUE5RyxFQUFaO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxzQkFESCxHQUVHO0FBakJOO0FBeEJGO0FBREYsZUFERjtBQStDRTtBQUNFLHFCQUFJLFVBRE47QUFFRSx3QkFBUSxLQUFLL0gsS0FBTCxDQUFXRSxhQUZyQjtBQUdFLHVCQUFPLEtBQUt3RixLQUhkO0FBSUUsdUJBQU8sS0FBS3hHLEtBQUwsQ0FBVzBHLEtBSnBCO0FBS0UsOEJBQWMsS0FBS25HLFlBTHJCO0FBTUUsOEJBQWMsS0FBS0QsWUFOckI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBL0NGO0FBVEY7QUFERjtBQUhGLE9BREY7QUF5RUQ7Ozs7RUF0cEJrQyxnQkFBTThMLFM7O2tCQUF0QnJNLE8iLCJmaWxlIjoiQ3JlYXRvci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCB7IFN0eWxlUm9vdCB9IGZyb20gJ3JhZGl1bSdcbmltcG9ydCBTcGxpdFBhbmUgZnJvbSAncmVhY3Qtc3BsaXQtcGFuZSdcbmltcG9ydCBSZWFjdENTU1RyYW5zaXRpb25Hcm91cCBmcm9tICdyZWFjdC1hZGRvbnMtY3NzLXRyYW5zaXRpb24tZ3JvdXAnXG5pbXBvcnQgbG9kYXNoIGZyb20gJ2xvZGFzaCdcbmltcG9ydCBDb21ib2tleXMgZnJvbSAnY29tYm9rZXlzJ1xuaW1wb3J0IEV2ZW50RW1pdHRlciBmcm9tICdldmVudC1lbWl0dGVyJ1xuaW1wb3J0IGNwIGZyb20gJ2NoaWxkX3Byb2Nlc3MnXG5pbXBvcnQgb3MgZnJvbSAnb3MnXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IGZzIGZyb20gJ2ZzJ1xuaW1wb3J0IEF1dGhlbnRpY2F0aW9uVUkgZnJvbSAnLi9jb21wb25lbnRzL0F1dGhlbnRpY2F0aW9uVUknXG5pbXBvcnQgUHJvamVjdEJyb3dzZXIgZnJvbSAnLi9jb21wb25lbnRzL1Byb2plY3RCcm93c2VyJ1xuaW1wb3J0IFNpZGVCYXIgZnJvbSAnLi9jb21wb25lbnRzL1NpZGVCYXInXG5pbXBvcnQgTGlicmFyeSBmcm9tICcuL2NvbXBvbmVudHMvbGlicmFyeS9MaWJyYXJ5J1xuaW1wb3J0IFN0YXRlSW5zcGVjdG9yIGZyb20gJy4vY29tcG9uZW50cy9TdGF0ZUluc3BlY3Rvci9TdGF0ZUluc3BlY3RvcidcbmltcG9ydCBTdGFnZSBmcm9tICcuL2NvbXBvbmVudHMvU3RhZ2UnXG5pbXBvcnQgVGltZWxpbmUgZnJvbSAnLi9jb21wb25lbnRzL1RpbWVsaW5lJ1xuaW1wb3J0IFRvYXN0IGZyb20gJy4vY29tcG9uZW50cy9ub3RpZmljYXRpb25zL1RvYXN0J1xuaW1wb3J0IFRvdXIgZnJvbSAnLi9jb21wb25lbnRzL1RvdXIvVG91cidcbmltcG9ydCBBdXRvVXBkYXRlciBmcm9tICcuL2NvbXBvbmVudHMvQXV0b1VwZGF0ZXInXG5pbXBvcnQgRW52b3lDbGllbnQgZnJvbSAnaGFpa3Utc2RrLWNyZWF0b3IvbGliL2Vudm95L2NsaWVudCdcbmltcG9ydCB7XG4gIEhPTUVESVJfUEFUSCxcbiAgSE9NRURJUl9MT0dTX1BBVEhcbn0gZnJvbSAnaGFpa3Utc2VyaWFsaXphdGlvbi9zcmMvdXRpbHMvSGFpa3VIb21lRGlyJ1xuXG52YXIgcGtnID0gcmVxdWlyZSgnLi8uLi8uLi9wYWNrYWdlLmpzb24nKVxuXG52YXIgbWl4cGFuZWwgPSByZXF1aXJlKCdoYWlrdS1zZXJpYWxpemF0aW9uL3NyYy91dGlscy9NaXhwYW5lbCcpXG5cbmNvbnN0IGVsZWN0cm9uID0gcmVxdWlyZSgnZWxlY3Ryb24nKVxuY29uc3QgcmVtb3RlID0gZWxlY3Ryb24ucmVtb3RlXG5jb25zdCBpcGNSZW5kZXJlciA9IGVsZWN0cm9uLmlwY1JlbmRlcmVyXG5jb25zdCBjbGlwYm9hcmQgPSBlbGVjdHJvbi5jbGlwYm9hcmRcblxudmFyIHdlYkZyYW1lID0gZWxlY3Ryb24ud2ViRnJhbWVcbmlmICh3ZWJGcmFtZSkge1xuICBpZiAod2ViRnJhbWUuc2V0Wm9vbUxldmVsTGltaXRzKSB3ZWJGcmFtZS5zZXRab29tTGV2ZWxMaW1pdHMoMSwgMSlcbiAgaWYgKHdlYkZyYW1lLnNldExheW91dFpvb21MZXZlbExpbWl0cykgd2ViRnJhbWUuc2V0TGF5b3V0Wm9vbUxldmVsTGltaXRzKDAsIDApXG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENyZWF0b3IgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3RvciAocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcylcbiAgICB0aGlzLmF1dGhlbnRpY2F0ZVVzZXIgPSB0aGlzLmF1dGhlbnRpY2F0ZVVzZXIuYmluZCh0aGlzKVxuICAgIHRoaXMuYXV0aGVudGljYXRpb25Db21wbGV0ZSA9IHRoaXMuYXV0aGVudGljYXRpb25Db21wbGV0ZS5iaW5kKHRoaXMpXG4gICAgdGhpcy5sb2FkUHJvamVjdHMgPSB0aGlzLmxvYWRQcm9qZWN0cy5iaW5kKHRoaXMpXG4gICAgdGhpcy5sYXVuY2hQcm9qZWN0ID0gdGhpcy5sYXVuY2hQcm9qZWN0LmJpbmQodGhpcylcbiAgICB0aGlzLnJlbW92ZU5vdGljZSA9IHRoaXMucmVtb3ZlTm90aWNlLmJpbmQodGhpcylcbiAgICB0aGlzLmNyZWF0ZU5vdGljZSA9IHRoaXMuY3JlYXRlTm90aWNlLmJpbmQodGhpcylcbiAgICB0aGlzLnJlbmRlck5vdGlmaWNhdGlvbnMgPSB0aGlzLnJlbmRlck5vdGlmaWNhdGlvbnMuYmluZCh0aGlzKVxuICAgIHRoaXMucmVjZWl2ZVByb2plY3RJbmZvID0gdGhpcy5yZWNlaXZlUHJvamVjdEluZm8uYmluZCh0aGlzKVxuICAgIHRoaXMuaGFuZGxlRmluZEVsZW1lbnRDb29yZGluYXRlcyA9IHRoaXMuaGFuZGxlRmluZEVsZW1lbnRDb29yZGluYXRlcy5iaW5kKHRoaXMpXG4gICAgdGhpcy5oYW5kbGVGaW5kV2Vidmlld0Nvb3JkaW5hdGVzID0gdGhpcy5oYW5kbGVGaW5kV2Vidmlld0Nvb3JkaW5hdGVzLmJpbmQodGhpcylcbiAgICB0aGlzLm9uQXV0b1VwZGF0ZUNoZWNrQ29tcGxldGUgPSB0aGlzLm9uQXV0b1VwZGF0ZUNoZWNrQ29tcGxldGUuYmluZCh0aGlzKVxuICAgIHRoaXMubGF5b3V0ID0gbmV3IEV2ZW50RW1pdHRlcigpXG5cbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgZXJyb3I6IG51bGwsXG4gICAgICBwcm9qZWN0Rm9sZGVyOiB0aGlzLnByb3BzLmZvbGRlcixcbiAgICAgIGFwcGxpY2F0aW9uSW1hZ2U6IG51bGwsXG4gICAgICBwcm9qZWN0T2JqZWN0OiBudWxsLFxuICAgICAgcHJvamVjdE5hbWU6IG51bGwsXG4gICAgICBkYXNoYm9hcmRWaXNpYmxlOiAhdGhpcy5wcm9wcy5mb2xkZXIsXG4gICAgICByZWFkeUZvckF1dGg6IGZhbHNlLFxuICAgICAgaXNVc2VyQXV0aGVudGljYXRlZDogZmFsc2UsXG4gICAgICBoYXNDaGVja2VkRm9yVXBkYXRlczogZmFsc2UsXG4gICAgICB1c2VybmFtZTogbnVsbCxcbiAgICAgIHBhc3N3b3JkOiBudWxsLFxuICAgICAgbm90aWNlczogW10sXG4gICAgICBzb2Z0d2FyZVZlcnNpb246IHBrZy52ZXJzaW9uLFxuICAgICAgZGlkUGx1bWJpbmdOb3RpY2VDcmFzaDogZmFsc2UsXG4gICAgICBhY3RpdmVOYXY6ICdsaWJyYXJ5JyxcbiAgICAgIHByb2plY3RzTGlzdDogW11cbiAgICB9XG5cbiAgICBjb25zdCB3aW4gPSByZW1vdGUuZ2V0Q3VycmVudFdpbmRvdygpXG5cbiAgICBpZiAocHJvY2Vzcy5lbnYuREVWID09PSAnMScpIHtcbiAgICAgIHdpbi5vcGVuRGV2VG9vbHMoKVxuICAgIH1cblxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIChuYXRpdmVFdmVudCkgPT4ge1xuICAgICAgdGhpcy5fbGFzdE1vdXNlWCA9IG5hdGl2ZUV2ZW50LmNsaWVudFhcbiAgICAgIHRoaXMuX2xhc3RNb3VzZVkgPSBuYXRpdmVFdmVudC5jbGllbnRZXG4gICAgfSlcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdkcmFnJywgKG5hdGl2ZUV2ZW50KSA9PiB7XG4gICAgICAvLyBXaGVuIHRoZSBkcmFnIGVuZHMsIGZvciBzb21lIHJlYXNvbiB0aGUgcG9zaXRpb24gZ29lcyB0byAwLCBzbyBoYWNrIHRoaXMuLi5cbiAgICAgIGlmIChuYXRpdmVFdmVudC5jbGllbnRYID4gMCAmJiBuYXRpdmVFdmVudC5jbGllbnRZID4gMCkge1xuICAgICAgICB0aGlzLl9sYXN0TW91c2VYID0gbmF0aXZlRXZlbnQuY2xpZW50WFxuICAgICAgICB0aGlzLl9sYXN0TW91c2VZID0gbmF0aXZlRXZlbnQuY2xpZW50WVxuICAgICAgfVxuICAgIH0pXG5cbiAgICBjb25zdCBjb21ib2tleXMgPSBuZXcgQ29tYm9rZXlzKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudClcbiAgICBjb21ib2tleXMuYmluZCgnY29tbWFuZCtvcHRpb24raScsIGxvZGFzaC5kZWJvdW5jZSgoKSA9PiB7XG4gICAgICB0aGlzLnByb3BzLndlYnNvY2tldC5zZW5kKHsgbWV0aG9kOiAndG9nZ2xlRGV2VG9vbHMnLCBwYXJhbXM6IFt0aGlzLnN0YXRlLnByb2plY3RGb2xkZXJdIH0pXG4gICAgfSwgNTAwLCB7IGxlYWRpbmc6IHRydWUgfSkpXG4gICAgY29tYm9rZXlzLmJpbmQoJ2NvbW1hbmQrb3B0aW9uKzAnLCBsb2Rhc2guZGVib3VuY2UoKCkgPT4ge1xuICAgICAgdGhpcy5kdW1wU3lzdGVtSW5mbygpXG4gICAgfSwgNTAwLCB7IGxlYWRpbmc6IHRydWUgfSkpXG5cbiAgICAvLyBOT1RFOiBUaGUgVG9wTWVudSBhdXRvbWF0aWNhbGx5IGJpbmRzIHRoZSBiZWxvdyBrZXlib2FyZCBzaG9ydGN1dHMvYWNjZWxlcmF0b3JzXG4gICAgaXBjUmVuZGVyZXIub24oJ2dsb2JhbC1tZW51Onpvb20taW4nLCAoKSA9PiB7XG4gICAgICB0aGlzLnByb3BzLndlYnNvY2tldC5zZW5kKHsgdHlwZTogJ2Jyb2FkY2FzdCcsIG5hbWU6ICd2aWV3Onpvb20taW4nIH0pXG4gICAgfSlcbiAgICBpcGNSZW5kZXJlci5vbignZ2xvYmFsLW1lbnU6em9vbS1vdXQnLCAoKSA9PiB7XG4gICAgICB0aGlzLnByb3BzLndlYnNvY2tldC5zZW5kKHsgdHlwZTogJ2Jyb2FkY2FzdCcsIG5hbWU6ICd2aWV3Onpvb20tb3V0JyB9KVxuICAgIH0pXG4gICAgaXBjUmVuZGVyZXIub24oJ2dsb2JhbC1tZW51Om9wZW4tdGVybWluYWwnLCBsb2Rhc2guZGVib3VuY2UoKCkgPT4ge1xuICAgICAgdGhpcy5vcGVuVGVybWluYWwodGhpcy5zdGF0ZS5wcm9qZWN0Rm9sZGVyKVxuICAgIH0sIDUwMCwgeyBsZWFkaW5nOiB0cnVlIH0pKVxuICAgIGlwY1JlbmRlcmVyLm9uKCdnbG9iYWwtbWVudTp1bmRvJywgbG9kYXNoLmRlYm91bmNlKCgpID0+IHtcbiAgICAgIHRoaXMucHJvcHMud2Vic29ja2V0LnNlbmQoeyBtZXRob2Q6ICdnaXRVbmRvJywgcGFyYW1zOiBbdGhpcy5zdGF0ZS5wcm9qZWN0Rm9sZGVyLCB7IHR5cGU6ICdnbG9iYWwnIH1dIH0pXG4gICAgfSwgNTAwLCB7IGxlYWRpbmc6IHRydWUgfSkpXG4gICAgaXBjUmVuZGVyZXIub24oJ2dsb2JhbC1tZW51OnJlZG8nLCBsb2Rhc2guZGVib3VuY2UoKCkgPT4ge1xuICAgICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQuc2VuZCh7IG1ldGhvZDogJ2dpdFJlZG8nLCBwYXJhbXM6IFt0aGlzLnN0YXRlLnByb2plY3RGb2xkZXIsIHsgdHlwZTogJ2dsb2JhbCcgfV0gfSlcbiAgICB9LCA1MDAsIHsgbGVhZGluZzogdHJ1ZSB9KSlcbiAgICBpcGNSZW5kZXJlci5vbignZ2xvYmFsLW1lbnU6Y2hlY2stdXBkYXRlcycsICgpID0+IHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoeyBoYXNDaGVja2VkRm9yVXBkYXRlczogZmFsc2UgfSlcbiAgICB9KVxuICB9XG5cbiAgb3BlblRlcm1pbmFsIChmb2xkZXIpIHtcbiAgICB0cnkge1xuICAgICAgY3AuZXhlY1N5bmMoJ29wZW4gLWIgY29tLmFwcGxlLnRlcm1pbmFsICcgKyBKU09OLnN0cmluZ2lmeShmb2xkZXIpICsgJyB8fCB0cnVlJylcbiAgICB9IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoZXhjZXB0aW9uKVxuICAgIH1cbiAgfVxuXG4gIGR1bXBTeXN0ZW1JbmZvICgpIHtcbiAgICBjb25zdCB0aW1lc3RhbXAgPSBEYXRlLm5vdygpXG4gICAgY29uc3QgZHVtcGRpciA9IHBhdGguam9pbihIT01FRElSX1BBVEgsICdkdW1wcycsIGBkdW1wLSR7dGltZXN0YW1wfWApXG4gICAgY3AuZXhlY1N5bmMoYG1rZGlyIC1wICR7SlNPTi5zdHJpbmdpZnkoZHVtcGRpcil9YClcbiAgICBmcy53cml0ZUZpbGVTeW5jKHBhdGguam9pbihkdW1wZGlyLCAnYXJndicpLCBKU09OLnN0cmluZ2lmeShwcm9jZXNzLmFyZ3YsIG51bGwsIDIpKVxuICAgIGZzLndyaXRlRmlsZVN5bmMocGF0aC5qb2luKGR1bXBkaXIsICdlbnYnKSwgSlNPTi5zdHJpbmdpZnkocHJvY2Vzcy5lbnYsIG51bGwsIDIpKVxuICAgIGlmIChmcy5leGlzdHNTeW5jKHBhdGguam9pbihIT01FRElSX0xPR1NfUEFUSCwgJ2hhaWt1LWRlYnVnLmxvZycpKSkge1xuICAgICAgZnMud3JpdGVGaWxlU3luYyhwYXRoLmpvaW4oZHVtcGRpciwgJ2xvZycpLCBmcy5yZWFkRmlsZVN5bmMocGF0aC5qb2luKEhPTUVESVJfTE9HU19QQVRILCAnaGFpa3UtZGVidWcubG9nJykpLnRvU3RyaW5nKCkpXG4gICAgfVxuICAgIGZzLndyaXRlRmlsZVN5bmMocGF0aC5qb2luKGR1bXBkaXIsICdpbmZvJyksIEpTT04uc3RyaW5naWZ5KHtcbiAgICAgIGFjdGl2ZUZvbGRlcjogdGhpcy5zdGF0ZS5wcm9qZWN0Rm9sZGVyLFxuICAgICAgcmVhY3RTdGF0ZTogdGhpcy5zdGF0ZSxcbiAgICAgIF9fZmlsZW5hbWU6IF9fZmlsZW5hbWUsXG4gICAgICBfX2Rpcm5hbWU6IF9fZGlybmFtZVxuICAgIH0sIG51bGwsIDIpKVxuICAgIGlmICh0aGlzLnN0YXRlLnByb2plY3RGb2xkZXIpIHtcbiAgICAgIC8vIFRoZSBwcm9qZWN0IGZvbGRlciBpdHNlbGYgd2lsbCBjb250YWluIGdpdCBsb2dzIGFuZCBvdGhlciBnb29kaWVzIHdlIG1naWh0IHdhbnQgdG8gbG9vayBhdFxuICAgICAgY3AuZXhlY1N5bmMoYHRhciAtemN2ZiAke0pTT04uc3RyaW5naWZ5KHBhdGguam9pbihkdW1wZGlyLCAncHJvamVjdC50YXIuZ3onKSl9ICR7SlNPTi5zdHJpbmdpZnkodGhpcy5zdGF0ZS5wcm9qZWN0Rm9sZGVyKX1gKVxuICAgIH1cbiAgICAvLyBGb3IgY29udmVuaWVuY2UsIHppcCB1cCB0aGUgZW50aXJlIGR1bXAgZm9sZGVyLi4uXG4gICAgY3AuZXhlY1N5bmMoYHRhciAtemN2ZiAke0pTT04uc3RyaW5naWZ5KHBhdGguam9pbihvcy5ob21lZGlyKCksIGBoYWlrdS1kdW1wLSR7dGltZXN0YW1wfS50YXIuZ3pgKSl9ICR7SlNPTi5zdHJpbmdpZnkoZHVtcGRpcil9YClcbiAgfVxuXG4gIHRvZ2dsZURldlRvb2xzICgpIHtcbiAgICBjb25zdCB3aW4gPSByZW1vdGUuZ2V0Q3VycmVudFdpbmRvdygpXG4gICAgaWYgKHdpbi5pc0RldlRvb2xzT3BlbmVkKCkpIHdpbi5jbG9zZURldlRvb2xzKClcbiAgICBlbHNlIHdpbi5vcGVuRGV2VG9vbHMoKVxuICAgIGlmICh0aGlzLnJlZnMuc3RhZ2UpIHRoaXMucmVmcy5zdGFnZS50b2dnbGVEZXZUb29scygpXG4gICAgaWYgKHRoaXMucmVmcy50aW1lbGluZSkgdGhpcy5yZWZzLnRpbWVsaW5lLnRvZ2dsZURldlRvb2xzKClcbiAgfVxuXG4gIGhhbmRsZUNvbnRlbnRQYXN0ZSAobWF5YmVQYXN0ZVJlcXVlc3QpIHtcbiAgICBsZXQgcGFzdGVkVGV4dCA9IGNsaXBib2FyZC5yZWFkVGV4dCgpXG4gICAgaWYgKCFwYXN0ZWRUZXh0KSByZXR1cm4gdm9pZCAoMClcblxuICAgIC8vIFRoZSBkYXRhIG9uIHRoZSBjbGlwYm9hcmQgbWlnaHQgYmUgc2VyaWFsaXplZCBkYXRhLCBzbyB0cnkgdG8gcGFyc2UgaXQgaWYgdGhhdCdzIHRoZSBjYXNlXG4gICAgLy8gVGhlIG1haW4gY2FzZSB3ZSBoYXZlIG5vdyBmb3Igc2VyaWFsaXplZCBkYXRhIGlzIGhhaWt1IGVsZW1lbnRzIGNvcGllZCBmcm9tIHRoZSBzdGFnZVxuICAgIGxldCBwYXN0ZWREYXRhXG4gICAgdHJ5IHtcbiAgICAgIHBhc3RlZERhdGEgPSBKU09OLnBhcnNlKHBhc3RlZFRleHQpXG4gICAgfSBjYXRjaCAoZXhjZXB0aW9uKSB7XG4gICAgICBjb25zb2xlLndhcm4oJ1tjcmVhdG9yXSB1bmFibGUgdG8gcGFyc2UgcGFzdGVkIGRhdGE7IGl0IG1pZ2h0IGJlIHBsYWluIHRleHQnKVxuICAgICAgcGFzdGVkRGF0YSA9IHBhc3RlZFRleHRcbiAgICB9XG5cbiAgICBpZiAoQXJyYXkuaXNBcnJheShwYXN0ZWREYXRhKSkge1xuICAgICAgLy8gVGhpcyBsb29rcyBsaWtlIGEgSGFpa3UgZWxlbWVudCB0aGF0IGhhcyBiZWVuIGNvcGllZCBmcm9tIHRoZSBzdGFnZVxuICAgICAgaWYgKHBhc3RlZERhdGFbMF0gPT09ICdhcHBsaWNhdGlvbi9oYWlrdScgJiYgdHlwZW9mIHBhc3RlZERhdGFbMV0gPT09ICdvYmplY3QnKSB7XG4gICAgICAgIGxldCBwYXN0ZWRFbGVtZW50ID0gcGFzdGVkRGF0YVsxXVxuXG4gICAgICAgIC8vIENvbW1hbmQgdGhlIHZpZXdzIGFuZCBtYXN0ZXIgcHJvY2VzcyB0byBoYW5kbGUgdGhlIGVsZW1lbnQgcGFzdGUgYWN0aW9uXG4gICAgICAgIC8vIFRoZSAncGFzdGVUaGluZycgYWN0aW9uIGlzIGludGVuZGVkIHRvIGJlIGFibGUgdG8gaGFuZGxlIG11bHRpcGxlIGNvbnRlbnQgdHlwZXNcbiAgICAgICAgcmV0dXJuIHRoaXMucHJvcHMud2Vic29ja2V0LnJlcXVlc3QoeyB0eXBlOiAnYWN0aW9uJywgbWV0aG9kOiAncGFzdGVUaGluZycsIHBhcmFtczogW3RoaXMuc3RhdGUucHJvamVjdEZvbGRlciwgcGFzdGVkRWxlbWVudCwgbWF5YmVQYXN0ZVJlcXVlc3QgfHwge31dIH0sIChlcnJvcikgPT4ge1xuICAgICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcilcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNyZWF0ZU5vdGljZSh7XG4gICAgICAgICAgICAgIHR5cGU6ICd3YXJuaW5nJyxcbiAgICAgICAgICAgICAgdGl0bGU6ICdVaCBvaCEnLFxuICAgICAgICAgICAgICBtZXNzYWdlOiAnV2UgY291bGRuXFwndCBwYXN0ZSB0aGF0LiDwn5iiIFBsZWFzZSBjb250YWN0IEhhaWt1IGZvciBzdXBwb3J0LicsXG4gICAgICAgICAgICAgIGNsb3NlVGV4dDogJ09rYXknLFxuICAgICAgICAgICAgICBsaWdodFNjaGVtZTogdHJ1ZVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBUT0RPOiBIYW5kbGUgb3RoZXIgY2FzZXMgd2hlcmUgdGhlIHBhc3RlIGRhdGEgd2FzIGEgc2VyaWFsaXplZCBhcnJheVxuICAgICAgICBjb25zb2xlLndhcm4oJ1tjcmVhdG9yXSBjYW5ub3QgcGFzdGUgdGhpcyBjb250ZW50IHR5cGUgeWV0IChhcnJheSknKVxuICAgICAgICB0aGlzLmNyZWF0ZU5vdGljZSh7XG4gICAgICAgICAgdHlwZTogJ3dhcm5pbmcnLFxuICAgICAgICAgIHRpdGxlOiAnSG1tbScsXG4gICAgICAgICAgbWVzc2FnZTogJ1dlIGRvblxcJ3Qga25vdyBob3cgdG8gcGFzdGUgdGhhdCBjb250ZW50IHlldC4g8J+YsycsXG4gICAgICAgICAgY2xvc2VUZXh0OiAnT2theScsXG4gICAgICAgICAgbGlnaHRTY2hlbWU6IHRydWVcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gQW4gZW1wdHkgc3RyaW5nIGlzIHRyZWF0ZWQgYXMgdGhlIGVxdWl2YWxlbnQgb2Ygbm90aGluZyAoZG9uJ3QgZGlzcGxheSB3YXJuaW5nIGlmIG5vdGhpbmcgdG8gaW5zdGFudGlhdGUpXG4gICAgICBpZiAodHlwZW9mIHBhc3RlZERhdGEgPT09ICdzdHJpbmcnICYmIHBhc3RlZERhdGEubGVuZ3RoID4gMCkge1xuICAgICAgICAvLyBUT0RPOiBIYW5kbGUgdGhlIGNhc2Ugd2hlbiBwbGFpbiB0ZXh0IGhhcyBiZWVuIHBhc3RlZCAtIFNWRywgSFRNTCwgZXRjP1xuICAgICAgICBjb25zb2xlLndhcm4oJ1tjcmVhdG9yXSBjYW5ub3QgcGFzdGUgdGhpcyBjb250ZW50IHR5cGUgeWV0ICh1bmtub3duIHN0cmluZyknKVxuICAgICAgICB0aGlzLmNyZWF0ZU5vdGljZSh7XG4gICAgICAgICAgdHlwZTogJ3dhcm5pbmcnLFxuICAgICAgICAgIHRpdGxlOiAnSG1tbScsXG4gICAgICAgICAgbWVzc2FnZTogJ1dlIGRvblxcJ3Qga25vdyBob3cgdG8gcGFzdGUgdGhhdCBjb250ZW50IHlldC4g8J+YsycsXG4gICAgICAgICAgY2xvc2VUZXh0OiAnT2theScsXG4gICAgICAgICAgbGlnaHRTY2hlbWU6IHRydWVcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBjb21wb25lbnRXaWxsTW91bnQgKCkge1xuICAgIHRoaXMucHJvcHMud2Vic29ja2V0Lm9uKCdicm9hZGNhc3QnLCAobWVzc2FnZSkgPT4ge1xuICAgICAgc3dpdGNoIChtZXNzYWdlLm5hbWUpIHtcbiAgICAgICAgY2FzZSAnZGV2LXRvb2xzOnRvZ2dsZSc6XG4gICAgICAgICAgdGhpcy50b2dnbGVEZXZUb29scygpXG4gICAgICAgICAgYnJlYWtcblxuICAgICAgICBjYXNlICdjdXJyZW50LXBhc3RlYWJsZTpyZXF1ZXN0LXBhc3RlJzpcbiAgICAgICAgICBjb25zb2xlLmluZm8oJ1tjcmVhdG9yXSBjdXJyZW50LXBhc3RlYWJsZTpyZXF1ZXN0LXBhc3RlJywgbWVzc2FnZS5kYXRhKVxuICAgICAgICAgIHJldHVybiB0aGlzLmhhbmRsZUNvbnRlbnRQYXN0ZShtZXNzYWdlLmRhdGEpXG4gICAgICB9XG4gICAgfSlcblxuICAgIHRoaXMuZW52b3kgPSBuZXcgRW52b3lDbGllbnQoe1xuICAgICAgcG9ydDogdGhpcy5wcm9wcy5oYWlrdS5lbnZveS5wb3J0LFxuICAgICAgaG9zdDogdGhpcy5wcm9wcy5oYWlrdS5lbnZveS5ob3N0LFxuICAgICAgV2ViU29ja2V0OiB3aW5kb3cuV2ViU29ja2V0XG4gICAgfSlcblxuICAgIHRoaXMuZW52b3kuZ2V0KCd0b3VyJykudGhlbigodG91ckNoYW5uZWwpID0+IHtcbiAgICAgIHRoaXMudG91ckNoYW5uZWwgPSB0b3VyQ2hhbm5lbFxuXG4gICAgICB0b3VyQ2hhbm5lbC5vbigndG91cjpyZXF1ZXN0RWxlbWVudENvb3JkaW5hdGVzJywgdGhpcy5oYW5kbGVGaW5kRWxlbWVudENvb3JkaW5hdGVzKVxuXG4gICAgICB0b3VyQ2hhbm5lbC5vbigndG91cjpyZXF1ZXN0V2Vidmlld0Nvb3JkaW5hdGVzJywgdGhpcy5oYW5kbGVGaW5kV2Vidmlld0Nvb3JkaW5hdGVzKVxuXG4gICAgICBpcGNSZW5kZXJlci5vbignZ2xvYmFsLW1lbnU6c3RhcnQtdG91cicsICgpID0+IHtcbiAgICAgICAgdGhpcy5zZXREYXNoYm9hcmRWaXNpYmlsaXR5KHRydWUpXG5cbiAgICAgICAgLy8gUHV0IGl0IGF0IHRoZSBib3R0b20gb2YgdGhlIGV2ZW50IGxvb3BcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgdG91ckNoYW5uZWwuc3RhcnQodHJ1ZSlcbiAgICAgICAgfSlcbiAgICAgIH0pXG5cbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCBsb2Rhc2gudGhyb3R0bGUoKCkgPT4ge1xuICAgICAgICAvLyBpZiAodG91ckNoYW5uZWwuaXNUb3VyQWN0aXZlKCkpIHtcbiAgICAgICAgdG91ckNoYW5uZWwubm90aWZ5U2NyZWVuUmVzaXplKClcbiAgICAgICAgLy8gfVxuICAgICAgfSksIDMwMClcbiAgICB9KVxuXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigncGFzdGUnLCAocGFzdGVFdmVudCkgPT4ge1xuICAgICAgY29uc29sZS5pbmZvKCdbY3JlYXRvcl0gcGFzdGUgaGVhcmQnKVxuICAgICAgbGV0IHRhZ25hbWUgPSBwYXN0ZUV2ZW50LnRhcmdldC50YWdOYW1lLnRvTG93ZXJDYXNlKClcbiAgICAgIGlmICh0YWduYW1lID09PSAnaW5wdXQnIHx8IHRhZ25hbWUgPT09ICd0ZXh0YXJlYScpIHtcbiAgICAgICAgLy8gRG8gbm90aGluZzsgbGV0IGlucHV0IGZpZWxkcyBhbmQgc28tb24gYmUgaGFuZGxlZCBub3JtYWxseVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gT3RoZXJ3aXNlLCBhc3N1bWUgd2UgbWlnaHQgbmVlZCB0byBoYW5kbGUgdGhpcyBwYXN0ZSBldmVudCBzcGVjaWFsbHlcbiAgICAgICAgcGFzdGVFdmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgIHRoaXMuaGFuZGxlQ29udGVudFBhc3RlKClcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQub24oJ21ldGhvZCcsIChtZXRob2QsIHBhcmFtcywgY2IpID0+IHtcbiAgICAgIGNvbnNvbGUuaW5mbygnW2NyZWF0b3JdIG1ldGhvZCBmcm9tIHBsdW1iaW5nOicsIG1ldGhvZCwgcGFyYW1zKVxuICAgICAgLy8gbm8tb3A7IGNyZWF0b3IgZG9lc24ndCBjdXJyZW50bHkgcmVjZWl2ZSBhbnkgbWV0aG9kcyBmcm9tIHRoZSBvdGhlciB2aWV3cywgYnV0IHdlIG5lZWQgdGhpc1xuICAgICAgLy8gY2FsbGJhY2sgdG8gYmUgY2FsbGVkIHRvIGFsbG93IHRoZSBhY3Rpb24gY2hhaW4gaW4gcGx1bWJpbmcgdG8gcHJvY2VlZFxuICAgICAgcmV0dXJuIGNiKClcbiAgICB9KVxuXG4gICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQub24oJ29wZW4nLCAoKSA9PiB7XG4gICAgICB0aGlzLnByb3BzLndlYnNvY2tldC5yZXF1ZXN0KHsgbWV0aG9kOiAnaXNVc2VyQXV0aGVudGljYXRlZCcsIHBhcmFtczogW10gfSwgKGVycm9yLCBhdXRoQW5zd2VyKSA9PiB7XG4gICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpXG4gICAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlTm90aWNlKHtcbiAgICAgICAgICAgIHR5cGU6ICdlcnJvcicsXG4gICAgICAgICAgICB0aXRsZTogJ09oIG5vIScsXG4gICAgICAgICAgICBtZXNzYWdlOiAnV2UgaGFkIGEgcHJvYmxlbSBhY2Nlc3NpbmcgeW91ciBhY2NvdW50LiDwn5iiIFBsZWFzZSB0cnkgY2xvc2luZyBhbmQgcmVvcGVuaW5nIHRoZSBhcHBsaWNhdGlvbi4gSWYgeW91IHN0aWxsIHNlZSB0aGlzIG1lc3NhZ2UsIGNvbnRhY3QgSGFpa3UgZm9yIHN1cHBvcnQuJyxcbiAgICAgICAgICAgIGNsb3NlVGV4dDogJ09rYXknLFxuICAgICAgICAgICAgbGlnaHRTY2hlbWU6IHRydWVcbiAgICAgICAgICB9KVxuICAgICAgICB9XG5cbiAgICAgICAgbWl4cGFuZWwubWVyZ2VUb1BheWxvYWQoeyBkaXN0aW5jdF9pZDogYXV0aEFuc3dlciAmJiBhdXRoQW5zd2VyLnVzZXJuYW1lIH0pXG4gICAgICAgIG1peHBhbmVsLmhhaWt1VHJhY2soJ2NyZWF0b3I6b3BlbmVkJylcblxuICAgICAgICAvLyBEZWxheSBzbyB0aGUgZGVmYXVsdCBzdGFydHVwIHNjcmVlbiBkb2Vzbid0IGp1c3QgZmxhc2ggdGhlbiBnbyBhd2F5XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgcmVhZHlGb3JBdXRoOiB0cnVlLFxuICAgICAgICAgICAgYXV0aFRva2VuOiBhdXRoQW5zd2VyICYmIGF1dGhBbnN3ZXIuYXV0aFRva2VuLFxuICAgICAgICAgICAgb3JnYW5pemF0aW9uTmFtZTogYXV0aEFuc3dlciAmJiBhdXRoQW5zd2VyLm9yZ2FuaXphdGlvbk5hbWUsXG4gICAgICAgICAgICB1c2VybmFtZTogYXV0aEFuc3dlciAmJiBhdXRoQW5zd2VyLnVzZXJuYW1lLFxuICAgICAgICAgICAgaXNVc2VyQXV0aGVudGljYXRlZDogYXV0aEFuc3dlciAmJiBhdXRoQW5zd2VyLmlzQXV0aGVkXG4gICAgICAgICAgfSlcbiAgICAgICAgICBpZiAodGhpcy5wcm9wcy5mb2xkZXIpIHtcbiAgICAgICAgICAgIC8vIExhdW5jaCBmb2xkZXIgZGlyZWN0bHkgLSBpLmUuIGFsbG93IGEgJ3N1YmwnIGxpa2UgZXhwZXJpZW5jZSB3aXRob3V0IGhhdmluZyB0byBnb1xuICAgICAgICAgICAgLy8gdGhyb3VnaCB0aGUgcHJvamVjdHMgaW5kZXhcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmxhdW5jaEZvbGRlcihudWxsLCB0aGlzLnByb3BzLmZvbGRlciwgKGVycm9yKSA9PiB7XG4gICAgICAgICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGZvbGRlckxvYWRpbmdFcnJvcjogZXJyb3IgfSlcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jcmVhdGVOb3RpY2Uoe1xuICAgICAgICAgICAgICAgICAgdHlwZTogJ2Vycm9yJyxcbiAgICAgICAgICAgICAgICAgIHRpdGxlOiAnT2ggbm8hJyxcbiAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdXZSB3ZXJlIHVuYWJsZSB0byBvcGVuIHRoZSBmb2xkZXIuIPCfmKIgUGxlYXNlIGNsb3NlIGFuZCByZW9wZW4gdGhlIGFwcGxpY2F0aW9uIGFuZCB0cnkgYWdhaW4uIElmIHlvdSBzdGlsbCBzZWUgdGhpcyBtZXNzYWdlLCBjb250YWN0IEhhaWt1IGZvciBzdXBwb3J0LicsXG4gICAgICAgICAgICAgICAgICBjbG9zZVRleHQ6ICdPa2F5JyxcbiAgICAgICAgICAgICAgICAgIGxpZ2h0U2NoZW1lOiB0cnVlXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9XG4gICAgICAgIH0sIDEwMDApXG4gICAgICB9KVxuICAgIH0pXG4gIH1cblxuICBjb21wb25lbnRXaWxsVW5tb3VudCAoKSB7XG4gICAgdGhpcy50b3VyQ2hhbm5lbC5vZmYoJ3RvdXI6cmVxdWVzdEVsZW1lbnRDb29yZGluYXRlcycsIHRoaXMuaGFuZGxlRmluZEVsZW1lbnRDb29yZGluYXRlcylcbiAgICB0aGlzLnRvdXJDaGFubmVsLm9mZigndG91cjpyZXF1ZXN0V2Vidmlld0Nvb3JkaW5hdGVzJywgdGhpcy5oYW5kbGVGaW5kV2Vidmlld0Nvb3JkaW5hdGVzKVxuICB9XG5cbiAgaGFuZGxlRmluZEVsZW1lbnRDb29yZGluYXRlcyAoeyBzZWxlY3Rvciwgd2VidmlldyB9KSB7XG4gICAgaWYgKHdlYnZpZXcgIT09ICdjcmVhdG9yJykgeyByZXR1cm4gfVxuXG4gICAgdHJ5IHtcbiAgICAgIC8vIFRPRE86IGZpbmQgaWYgdGhlcmUgaXMgYSBiZXR0ZXIgc29sdXRpb24gdG8gdGhpcyBzY2FwZSBoYXRjaFxuICAgICAgbGV0IGVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKVxuICAgICAgbGV0IHsgdG9wLCBsZWZ0IH0gPSBlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG5cbiAgICAgIHRoaXMudG91ckNoYW5uZWwucmVjZWl2ZUVsZW1lbnRDb29yZGluYXRlcygnY3JlYXRvcicsIHsgdG9wLCBsZWZ0IH0pXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoYFtjcmVhdG9yXSBlcnJvciBmZXRjaGluZyAke3NlbGVjdG9yfSBpbiB3ZWJ2aWV3ICR7d2Vidmlld31gKVxuICAgIH1cbiAgfVxuXG4gIGhhbmRsZUZpbmRXZWJ2aWV3Q29vcmRpbmF0ZXMgKCkge1xuICAgIHRoaXMudG91ckNoYW5uZWwucmVjZWl2ZVdlYnZpZXdDb29yZGluYXRlcygnY3JlYXRvcicsIHsgdG9wOiAwLCBsZWZ0OiAwIH0pXG4gIH1cblxuICBoYW5kbGVQYW5lUmVzaXplICgpIHtcbiAgICAvLyB0aGlzLmxheW91dC5lbWl0KCdyZXNpemUnKVxuICB9XG5cbiAgcmVuZGVyTm90aWZpY2F0aW9ucyAoY29udGVudCwgaSkge1xuICAgIHJldHVybiAoXG4gICAgICA8VG9hc3RcbiAgICAgICAgdG9hc3RUeXBlPXtjb250ZW50LnR5cGV9XG4gICAgICAgIHRvYXN0VGl0bGU9e2NvbnRlbnQudGl0bGV9XG4gICAgICAgIHRvYXN0TWVzc2FnZT17Y29udGVudC5tZXNzYWdlfVxuICAgICAgICBjbG9zZVRleHQ9e2NvbnRlbnQuY2xvc2VUZXh0fVxuICAgICAgICBrZXk9e2kgKyBjb250ZW50LnRpdGxlfVxuICAgICAgICBteUtleT17aX1cbiAgICAgICAgcmVtb3ZlTm90aWNlPXt0aGlzLnJlbW92ZU5vdGljZX1cbiAgICAgICAgbGlnaHRTY2hlbWU9e2NvbnRlbnQubGlnaHRTY2hlbWV9IC8+XG4gICAgKVxuICB9XG5cbiAgc2V0RGFzaGJvYXJkVmlzaWJpbGl0eSAoZGFzaGJvYXJkVmlzaWJsZSkge1xuICAgIHRoaXMuc2V0U3RhdGUoe2Rhc2hib2FyZFZpc2libGV9KVxuICB9XG5cbiAgc3dpdGNoQWN0aXZlTmF2IChhY3RpdmVOYXYpIHtcbiAgICB0aGlzLnNldFN0YXRlKHthY3RpdmVOYXZ9KVxuXG4gICAgaWYgKGFjdGl2ZU5hdiA9PT0gJ3N0YXRlX2luc3BlY3RvcicpIHtcbiAgICAgIHRoaXMudG91ckNoYW5uZWwubmV4dCgpXG4gICAgfVxuICB9XG5cbiAgYXV0aGVudGljYXRlVXNlciAodXNlcm5hbWUsIHBhc3N3b3JkLCBjYikge1xuICAgIHJldHVybiB0aGlzLnByb3BzLndlYnNvY2tldC5yZXF1ZXN0KHsgbWV0aG9kOiAnYXV0aGVudGljYXRlVXNlcicsIHBhcmFtczogW3VzZXJuYW1lLCBwYXNzd29yZF0gfSwgKGVycm9yLCBhdXRoQW5zd2VyKSA9PiB7XG4gICAgICBpZiAoZXJyb3IpIHJldHVybiBjYihlcnJvcilcbiAgICAgIG1peHBhbmVsLm1lcmdlVG9QYXlsb2FkKHsgZGlzdGluY3RfaWQ6IHVzZXJuYW1lIH0pXG4gICAgICBtaXhwYW5lbC5oYWlrdVRyYWNrKCdjcmVhdG9yOnVzZXItYXV0aGVudGljYXRlZCcsIHsgdXNlcm5hbWUgfSlcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICB1c2VybmFtZSxcbiAgICAgICAgcGFzc3dvcmQsXG4gICAgICAgIGF1dGhUb2tlbjogYXV0aEFuc3dlciAmJiBhdXRoQW5zd2VyLmF1dGhUb2tlbixcbiAgICAgICAgb3JnYW5pemF0aW9uTmFtZTogYXV0aEFuc3dlciAmJiBhdXRoQW5zd2VyLm9yZ2FuaXphdGlvbk5hbWUsXG4gICAgICAgIGlzVXNlckF1dGhlbnRpY2F0ZWQ6IGF1dGhBbnN3ZXIgJiYgYXV0aEFuc3dlci5pc0F1dGhlZFxuICAgICAgfSlcbiAgICAgIHJldHVybiBjYihudWxsLCBhdXRoQW5zd2VyKVxuICAgIH0pXG4gIH1cblxuICBhdXRoZW50aWNhdGlvbkNvbXBsZXRlICgpIHtcbiAgICByZXR1cm4gdGhpcy5zZXRTdGF0ZSh7IGlzVXNlckF1dGhlbnRpY2F0ZWQ6IHRydWUgfSlcbiAgfVxuXG4gIHJlY2VpdmVQcm9qZWN0SW5mbyAocHJvamVjdEluZm8pIHtcbiAgICAvLyBOTy1PUFxuICB9XG5cbiAgbG9hZFByb2plY3RzIChjYikge1xuICAgIHJldHVybiB0aGlzLnByb3BzLndlYnNvY2tldC5yZXF1ZXN0KHsgbWV0aG9kOiAnbGlzdFByb2plY3RzJywgcGFyYW1zOiBbXSB9LCAoZXJyb3IsIHByb2plY3RzTGlzdCkgPT4ge1xuICAgICAgaWYgKGVycm9yKSByZXR1cm4gY2IoZXJyb3IpXG4gICAgICB0aGlzLnNldFN0YXRlKHsgcHJvamVjdHNMaXN0IH0pXG4gICAgICBpcGNSZW5kZXJlci5zZW5kKCdyZW5kZXJlcjpwcm9qZWN0cy1saXN0LWZldGNoZWQnLCBwcm9qZWN0c0xpc3QpXG4gICAgICByZXR1cm4gY2IobnVsbCwgcHJvamVjdHNMaXN0KVxuICAgIH0pXG4gIH1cblxuICBsYXVuY2hQcm9qZWN0IChwcm9qZWN0TmFtZSwgcHJvamVjdE9iamVjdCwgY2IpIHtcbiAgICBwcm9qZWN0T2JqZWN0ID0ge1xuICAgICAgc2tpcENvbnRlbnRDcmVhdGlvbjogdHJ1ZSwgLy8gVkVSWSBJTVBPUlRBTlQgLSBpZiBub3Qgc2V0IHRvIHRydWUsIHdlIGNhbiBlbmQgdXAgaW4gYSBzaXR1YXRpb24gd2hlcmUgd2Ugb3ZlcndyaXRlIGZyZXNobHkgY2xvbmVkIGNvbnRlbnQgZnJvbSB0aGUgcmVtb3RlIVxuICAgICAgcHJvamVjdHNIb21lOiBwcm9qZWN0T2JqZWN0LnByb2plY3RzSG9tZSxcbiAgICAgIHByb2plY3RQYXRoOiBwcm9qZWN0T2JqZWN0LnByb2plY3RQYXRoLFxuICAgICAgb3JnYW5pemF0aW9uTmFtZTogdGhpcy5zdGF0ZS5vcmdhbml6YXRpb25OYW1lLFxuICAgICAgYXV0aG9yTmFtZTogdGhpcy5zdGF0ZS51c2VybmFtZSxcbiAgICAgIHByb2plY3ROYW1lIC8vIEhhdmUgdG8gc2V0IHRoaXMgaGVyZSwgYmVjYXVzZSB3ZSBwYXNzIHRoaXMgd2hvbGUgb2JqZWN0IHRvIFN0YXRlVGl0bGVCYXIsIHdoaWNoIG5lZWRzIHRoaXMgdG8gcHJvcGVybHkgY2FsbCBzYXZlUHJvamVjdFxuICAgIH1cblxuICAgIG1peHBhbmVsLmhhaWt1VHJhY2soJ2NyZWF0b3I6cHJvamVjdDpsYXVuY2hpbmcnLCB7XG4gICAgICB1c2VybmFtZTogdGhpcy5zdGF0ZS51c2VybmFtZSxcbiAgICAgIHByb2plY3Q6IHByb2plY3ROYW1lLFxuICAgICAgb3JnYW5pemF0aW9uOiB0aGlzLnN0YXRlLm9yZ2FuaXphdGlvbk5hbWVcbiAgICB9KVxuXG4gICAgcmV0dXJuIHRoaXMucHJvcHMud2Vic29ja2V0LnJlcXVlc3QoeyBtZXRob2Q6ICdpbml0aWFsaXplUHJvamVjdCcsIHBhcmFtczogW3Byb2plY3ROYW1lLCBwcm9qZWN0T2JqZWN0LCB0aGlzLnN0YXRlLnVzZXJuYW1lLCB0aGlzLnN0YXRlLnBhc3N3b3JkXSB9LCAoZXJyLCBwcm9qZWN0Rm9sZGVyKSA9PiB7XG4gICAgICBpZiAoZXJyKSByZXR1cm4gY2IoZXJyKVxuXG4gICAgICByZXR1cm4gdGhpcy5wcm9wcy53ZWJzb2NrZXQucmVxdWVzdCh7IG1ldGhvZDogJ3N0YXJ0UHJvamVjdCcsIHBhcmFtczogW3Byb2plY3ROYW1lLCBwcm9qZWN0Rm9sZGVyXSB9LCAoZXJyLCBhcHBsaWNhdGlvbkltYWdlKSA9PiB7XG4gICAgICAgIGlmIChlcnIpIHJldHVybiBjYihlcnIpXG5cbiAgICAgICAgLy8gQXNzaWduLCBub3QgbWVyZ2UsIHNpbmNlIHdlIGRvbid0IHdhbnQgdG8gY2xvYmJlciBhbnkgdmFyaWFibGVzIGFscmVhZHkgc2V0LCBsaWtlIHByb2plY3QgbmFtZVxuICAgICAgICBsb2Rhc2guYXNzaWduKHByb2plY3RPYmplY3QsIGFwcGxpY2F0aW9uSW1hZ2UucHJvamVjdClcblxuICAgICAgICBtaXhwYW5lbC5oYWlrdVRyYWNrKCdjcmVhdG9yOnByb2plY3Q6bGF1bmNoZWQnLCB7XG4gICAgICAgICAgdXNlcm5hbWU6IHRoaXMuc3RhdGUudXNlcm5hbWUsXG4gICAgICAgICAgcHJvamVjdDogcHJvamVjdE5hbWUsXG4gICAgICAgICAgb3JnYW5pemF0aW9uOiB0aGlzLnN0YXRlLm9yZ2FuaXphdGlvbk5hbWVcbiAgICAgICAgfSlcblxuICAgICAgICAvLyBOb3cgaGFja2lseSBjaGFuZ2Ugc29tZSBwb2ludGVycyBzbyB3ZSdyZSByZWZlcnJpbmcgdG8gdGhlIGNvcnJlY3QgcGxhY2VcbiAgICAgICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQuZm9sZGVyID0gcHJvamVjdEZvbGRlciAvLyBEbyBub3QgcmVtb3ZlIHRoaXMgbmVjZXNzYXJ5IGhhY2sgcGx6XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyBwcm9qZWN0Rm9sZGVyLCBhcHBsaWNhdGlvbkltYWdlLCBwcm9qZWN0T2JqZWN0LCBwcm9qZWN0TmFtZSwgZGFzaGJvYXJkVmlzaWJsZTogZmFsc2UgfSlcblxuICAgICAgICByZXR1cm4gY2IoKVxuICAgICAgfSlcbiAgICB9KVxuICB9XG5cbiAgbGF1bmNoRm9sZGVyIChtYXliZVByb2plY3ROYW1lLCBwcm9qZWN0Rm9sZGVyLCBjYikge1xuICAgIG1peHBhbmVsLmhhaWt1VHJhY2soJ2NyZWF0b3I6Zm9sZGVyOmxhdW5jaGluZycsIHtcbiAgICAgIHVzZXJuYW1lOiB0aGlzLnN0YXRlLnVzZXJuYW1lLFxuICAgICAgcHJvamVjdDogbWF5YmVQcm9qZWN0TmFtZVxuICAgIH0pXG5cbiAgICAvLyBUaGUgbGF1bmNoUHJvamVjdCBtZXRob2QgaGFuZGxlcyB0aGUgcGVyZm9ybUZvbGRlclBvaW50ZXJDaGFuZ2VcbiAgICByZXR1cm4gdGhpcy5sYXVuY2hQcm9qZWN0KG1heWJlUHJvamVjdE5hbWUsIHsgcHJvamVjdFBhdGg6IHByb2plY3RGb2xkZXIgfSwgY2IpXG4gIH1cblxuICByZW1vdmVOb3RpY2UgKGluZGV4LCBpZCkge1xuICAgIGNvbnN0IG5vdGljZXMgPSB0aGlzLnN0YXRlLm5vdGljZXNcbiAgICBpZiAoaW5kZXggIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIG5vdGljZXM6IFsuLi5ub3RpY2VzLnNsaWNlKDAsIGluZGV4KSwgLi4ubm90aWNlcy5zbGljZShpbmRleCArIDEpXVxuICAgICAgfSlcbiAgICB9IGVsc2UgaWYgKGlkICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIC8vIEhhY2thcm9vXG4gICAgICBsb2Rhc2guZWFjaChub3RpY2VzLCAobm90aWNlLCBpbmRleCkgPT4ge1xuICAgICAgICBpZiAobm90aWNlLmlkID09PSBpZCkgdGhpcy5yZW1vdmVOb3RpY2UoaW5kZXgpXG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIGNyZWF0ZU5vdGljZSAobm90aWNlKSB7XG4gICAgLyogRXhwZWN0cyB0aGUgb2JqZWN0OlxuICAgIHsgdHlwZTogc3RyaW5nIChpbmZvLCBzdWNjZXNzLCBkYW5nZXIgKG9yIGVycm9yKSwgd2FybmluZylcbiAgICAgIHRpdGxlOiBzdHJpbmcsXG4gICAgICBtZXNzYWdlOiBzdHJpbmcsXG4gICAgICBjbG9zZVRleHQ6IHN0cmluZyAob3B0aW9uYWwsIGRlZmF1bHRzIHRvICdjbG9zZScpXG4gICAgICBsaWdodFNjaGVtZTogYm9vbCAob3B0aW9uYWwsIGRlZmF1bHRzIHRvIGRhcmspXG4gICAgfSAqL1xuXG4gICAgbm90aWNlLmlkID0gTWF0aC5yYW5kb20oKSArICcnXG5cbiAgICBjb25zdCBub3RpY2VzID0gdGhpcy5zdGF0ZS5ub3RpY2VzXG4gICAgbGV0IHJlcGxhY2VkRXhpc3RpbmcgPSBmYWxzZVxuXG4gICAgbm90aWNlcy5mb3JFYWNoKChuLCBpKSA9PiB7XG4gICAgICBpZiAobi5tZXNzYWdlID09PSBub3RpY2UubWVzc2FnZSkge1xuICAgICAgICBub3RpY2VzLnNwbGljZShpLCAxKVxuICAgICAgICByZXBsYWNlZEV4aXN0aW5nID0gdHJ1ZVxuICAgICAgICB0aGlzLnNldFN0YXRlKHsgbm90aWNlcyB9LCAoKSA9PiB7XG4gICAgICAgICAgbm90aWNlcy51bnNoaWZ0KG5vdGljZSlcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgbm90aWNlcyB9KVxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH0pXG5cbiAgICBpZiAoIXJlcGxhY2VkRXhpc3RpbmcpIHtcbiAgICAgIG5vdGljZXMudW5zaGlmdChub3RpY2UpXG4gICAgICB0aGlzLnNldFN0YXRlKHsgbm90aWNlcyB9KVxuICAgIH1cblxuICAgIHJldHVybiBub3RpY2VcbiAgfVxuXG4gIG9uTGlicmFyeURyYWdFbmQgKGRyYWdFbmROYXRpdmVFdmVudCwgbGlicmFyeUl0ZW1JbmZvKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7IGxpYnJhcnlJdGVtRHJhZ2dpbmc6IG51bGwgfSlcbiAgICBpZiAobGlicmFyeUl0ZW1JbmZvICYmIGxpYnJhcnlJdGVtSW5mby5wcmV2aWV3KSB7XG4gICAgICB0aGlzLnJlZnMuc3RhZ2UuaGFuZGxlRHJvcChsaWJyYXJ5SXRlbUluZm8sIHRoaXMuX2xhc3RNb3VzZVgsIHRoaXMuX2xhc3RNb3VzZVkpXG4gICAgfVxuICB9XG5cbiAgb25MaWJyYXJ5RHJhZ1N0YXJ0IChkcmFnU3RhcnROYXRpdmVFdmVudCwgbGlicmFyeUl0ZW1JbmZvKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7IGxpYnJhcnlJdGVtRHJhZ2dpbmc6IGxpYnJhcnlJdGVtSW5mbyB9KVxuICB9XG5cbiAgb25BdXRvVXBkYXRlQ2hlY2tDb21wbGV0ZSAoKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7IGhhc0NoZWNrZWRGb3JVcGRhdGVzOiB0cnVlIH0pXG4gIH1cblxuICByZW5kZXJTdGFydHVwRGVmYXVsdFNjcmVlbiAoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgc3R5bGU9e3sgcG9zaXRpb246ICdhYnNvbHV0ZScsIHdpZHRoOiAnMTAwJScsIGhlaWdodDogJzEwMCUnIH19PlxuICAgICAgICA8UmVhY3RDU1NUcmFuc2l0aW9uR3JvdXBcbiAgICAgICAgICB0cmFuc2l0aW9uTmFtZT0ndG9hc3QnXG4gICAgICAgICAgdHJhbnNpdGlvbkVudGVyVGltZW91dD17NTAwfVxuICAgICAgICAgIHRyYW5zaXRpb25MZWF2ZVRpbWVvdXQ9ezMwMH0+XG4gICAgICAgICAgPGRpdiBzdHlsZT17e3Bvc2l0aW9uOiAnYWJzb2x1dGUnLCByaWdodDogMCwgdG9wOiAwLCB3aWR0aDogMzAwfX0+XG4gICAgICAgICAgICB7bG9kYXNoLm1hcCh0aGlzLnN0YXRlLm5vdGljZXMsIHRoaXMucmVuZGVyTm90aWZpY2F0aW9ucyl9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvUmVhY3RDU1NUcmFuc2l0aW9uR3JvdXA+XG4gICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ3RhYmxlJywgd2lkdGg6ICcxMDAlJywgaGVpZ2h0OiAnMTAwJScsIHBvc2l0aW9uOiAnYWJzb2x1dGUnLCB0b3A6IDAsIGxlZnQ6IDAgfX0+XG4gICAgICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAndGFibGUtY2VsbCcsIHdpZHRoOiAnMTAwJScsIGhlaWdodDogJzEwMCUnLCB2ZXJ0aWNhbEFsaWduOiAnbWlkZGxlJywgdGV4dEFsaWduOiAnY2VudGVyJyB9fT5cbiAgICAgICAgICAgIDxzdmcgd2lkdGg9JzE3MHB4JyBoZWlnaHQ9JzIyMXB4JyB2aWV3Qm94PScwIDAgMTcwIDIyMScgdmVyc2lvbj0nMS4xJz5cbiAgICAgICAgICAgICAgPGcgaWQ9J1BhZ2UtMScgc3Ryb2tlPSdub25lJyBzdHJva2VXaWR0aD0nMScgZmlsbD0nbm9uZScgZmlsbFJ1bGU9J2V2ZW5vZGQnPlxuICAgICAgICAgICAgICAgIDxnIGlkPSdPdXRsaW5lZCcgdHJhbnNmb3JtPSd0cmFuc2xhdGUoLTIxMS4wMDAwMDAsIC0xMTQuMDAwMDAwKScgZmlsbFJ1bGU9J25vbnplcm8nIGZpbGw9JyNGQUZDRkQnPlxuICAgICAgICAgICAgICAgICAgPGcgaWQ9J291dGxpbmVkLWxvZ28nIHRyYW5zZm9ybT0ndHJhbnNsYXRlKDIxMS4wMDAwMDAsIDExMy4wMDAwMDApJz5cbiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0nTTQ3LjUsMTUyLjc5ODgyMyBMMjYuMzgyMzQzMiwxNDMuOTU0Njc2IEMyNC41OTkzOTQxLDE0My4yMDc5NzEgMjMuNzU5MzUyNCwxNDEuMTU3MjgxIDI0LjUwNjA1NzYsMTM5LjM3NDMzMiBDMjUuMjUyNzYyOCwxMzcuNTkxMzgzIDI3LjMwMzQ1MjcsMTM2Ljc1MTM0MSAyOS4wODY0MDE4LDEzNy40OTgwNDYgTDExNy43ODAwNTgsMTc0LjY0NDU2IEwxMjAuOTkwMDIxLDE3Ni4wODkwNzQgQzEyMi40ODY4MTQsMTc2Ljc2MjY0NSAxMjMuMjc5MzA0LDE3OC4zNTgyNTEgMTIyLjk5ODY5OCwxNzkuOTAzNTk4IEMxMjIuOTk5NTY0LDE3OS45MzU2MjYgMTIzLDE3OS45Njc3NjIgMTIzLDE4MCBMMTIzLDIwNS42Mzk3MjIgTDEzOC41MTA3MTYsMjExLjkxMDAxMSBMMTQzLjM2ODQyMSwyMTMuODczNzY0IEwxNjIuODMzMzMzLDIwNi4wMDQ5NyBMMTYyLjgzMzMzMywxNi4yOTI5MDI1IEwxNDMsOC4yNzUxNzIwNCBMMTIyLjgzMzMzMywxNi40Mjc2NTQzIEwxMjIuODMzMzMzLDUzLjYwMTMyOTUgQzEyMi44MzQyMTgsNTMuNjQ2NjQ4OSAxMjIuODM0MjE1LDUzLjY5MTkwMTUgMTIyLjgzMzMzMyw1My43MzcwNjM0IEwxMjIuODMzMzMzLDU0IEMxMjIuODMzMzMzLDU1LjkzMjk5NjYgMTIxLjI2NjMzLDU3LjUgMTE5LjMzMzMzMyw1Ny41IEMxMTkuMjg4NDMsNTcuNSAxMTkuMjQzNzI0LDU3LjQ5OTE1NDQgMTE5LjE5OTIzLDU3LjQ5NzQ3ODIgTDUzLjMwNzYzOCw4NC4wMzcxNDkgQzUxLjUxNDYxODMsODQuNzU5MzM3NSA0OS40NzU2MzkyLDgzLjg5MTI1NzMgNDguNzUzNDUwNiw4Mi4wOTgyMzc2IEM0OC4wMzEyNjIxLDgwLjMwNTIxNzkgNDguODk5MzQyMyw3OC4yNjYyMzg4IDUwLjY5MjM2Miw3Ny41NDQwNTAyIEwxMTUuODMzMzMzLDUxLjMwNjcxMjkgTDExNS44MzMzMzMsMTQuNDk3NDIyNyBDMTE1LjgzMzMzMywxNC4wMTQzMTc4IDExNS45MzEyMTMsMTMuNTU0MDczOSAxMTYuMTA4MjIyLDEzLjEzNTQzOTkgQzExNi4zNzQ1MzksMTIuMDk0MTI5MiAxMTcuMTE1MzI2LDExLjE4ODg0NDkgMTE4LjE4ODIzOCwxMC43NTUxMTQ4IEwxNDEuNjg0MTg2LDEuMjU2NzUyNyBDMTQyLjA5MTMxNywxLjA5MTUyOTM2IDE0Mi41Mjk1OSwxLjAwMjQwNDY3IDE0Mi45NzU5MzcsMC45OTkxNjQ3MjMgQzE0My40NzA0MSwxLjAwMjQwNDY3IDE0My45MDg2ODMsMS4wOTE1MjkzNiAxNDQuMzE1ODE0LDEuMjU2NzUyNyBMMTY3LjgxMTc2MiwxMC43NTUxMTQ4IEMxNjkuNTIyOTY4LDExLjQ0Njg3OSAxNzAuMzg5MzI4LDEzLjMzODE2NTkgMTY5LjgzMzMzMywxNS4wNjc3MDY4IEwxNjkuODMzMzMzLDIwOCBDMTY5LjgzMzMzMywyMDguODI2MzA0IDE2OS41NDY5OSwyMDkuNTg1NzI4IDE2OS4wNjgxMTgsMjEwLjE4NDQ1OSBDMTY4LjY5MzcwMywyMTAuODY3Mzc4IDE2OC4wOTAxMzMsMjExLjQzMDIyNCAxNjcuMzExNzYyLDIxMS43NDQ4ODUgTDE0NC41MTc2NDUsMjIwLjk1OTUyOCBDMTQzLjMzMjU0MiwyMjEuNDM4NjEzIDE0Mi4wMzg5OTUsMjIxLjIyMjM5NyAxNDEuMDg5MTc5LDIyMC41MDI3MTIgTDEzNS44ODcxOTIsMjE4LjM5OTc4MiBMMTE5LjQ2MTU5NSwyMTEuNzU5NjQ3IEMxMTcuNTQ2MjksMjExLjczOTA1NSAxMTYsMjEwLjE4MDAzMiAxMTYsMjA4LjI1OTg1MyBMMTE2LDIwOC4wNzkxMSBDMTE1Ljk5ODc2NywyMDguMDI1NzA4IDExNS45OTg3NjEsMjA3Ljk3MjE3OCAxMTYsMjA3LjkxODU1OCBMMTE2LDE4MS41MTg3NDggTDExNC45OTE3MjcsMTgxLjA2NDU4OSBMNTQuNSwxNTUuNzMwNDQ3IEw1NC41LDIwNi45OTgyNzMgQzU1LjEzNDE0NjgsMjA4LjY1ODI1NiA1NC40MTk1MzE1LDIxMC41MTI5MTUgNTIuODc5NjY0NSwyMTEuMzMzMzMzIEM1Mi41NTQ1NTQ2LDIxMS41NDA3MDkgNTIuMTkyOTA0LDIxMS42OTU4NjkgNTEuODA2NTI5NCwyMTEuNzg2OTk3IEwyOS43ODY3Mzc1LDIyMC42NTA2NTUgQzI4LjgyNTI1MzUsMjIxLjQ3ODc1OCAyNy40NDU3MDA1LDIyMS43NTMyMjEgMjYuMTg4MjM3OSwyMjEuMjQ0ODg1IEwyMC4zODcxOTIxLDIxOC44OTk3ODIgTDMuMzA2Mjc3ODMsMjExLjk5NDczMSBDMS40NjMzODE4OSwyMTEuODk0MTkyIC0yLjYwODM1OTk1ZS0xNiwyMTAuMzY3OTkyIDAsMjA4LjUgTDIuNzA4OTQ0MThlLTE0LDE0LjQ5NzQyMjcgQzIuNzI0MjQ1ZS0xNCwxMy40MDE2NDU4IDAuNTAzNTYwOTQ3LDEyLjQyMzQ4MTggMS4yOTE4OTY2OSwxMS43ODE3MTcgQzEuNjUxNzEwMTQsMTEuMzQxNjUwOSAyLjEyNDA1NjIyLDEwLjk4MzE4ODIgMi42ODgyMzc4OSwxMC43NTUxMTQ4IEwyNi4xODQxODYyLDEuMjU2NzUyNyBDMjYuNTkxMzE3MiwxLjA5MTUyOTM2IDI3LjAyOTU4OTgsMS4wMDI0MDQ2NyAyNy40NzU5MzY3LDAuOTk5MTY0NzIzIEMyNy45NzA0MTAyLDEuMDAyNDA0NjcgMjguNDA4NjgyOCwxLjA5MTUyOTM2IDI4LjgxNTgxMzgsMS4yNTY3NTI3IEw1Mi4zMTE3NjIxLDEwLjc1NTExNDggQzU0LjEwMzg2MjcsMTEuNDc5NTgxIDU0Ljk2OTM1MTQsMTMuNTE5NjYxNSA1NC4yNDQ4ODUyLDE1LjMxMTc2MjEgQzUzLjUyMDQxOSwxNy4xMDM4NjI3IDUxLjQ4MDMzODUsMTcuOTY5MzUxNCA0OS42ODgyMzc5LDE3LjI0NDg4NTIgTDI3LjUsOC4yNzUxNzIwNCBMNywxNi41NjI0MDYxIEw3LDIwNS45Mzc1OTQgTDIzLjAxMDcxNjQsMjEyLjQxMDAxMSBMMjcuMjUyNjk5NSwyMTQuMTI0ODU1IEw0Ny41LDIwNS45NzQ2ODEgTDQ3LjUsMTUyLjc5ODgyMyBaJyBpZD0nQ29tYmluZWQtU2hhcGUnIC8+XG4gICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9J00xNDYuNDU2ODI3LDYzLjAyNDE4NDkgQzE0Ni45NDg2MDMsNjQuNzEwNDcyNCAxNDYuMTA1OTcyLDY2LjUzMzY1OTEgMTQ0LjQ0NzMwNSw2Ny4yMjgzMTQ5IEw1OS41NDY4Njc3LDEwMi43ODQ5MDggTDEyMC40MTY1NzUsMTI4LjI3NzM1IEMxMjIuMTk5NTI0LDEyOS4wMjQwNTUgMTIzLjAzOTU2NiwxMzEuMDc0NzQ1IDEyMi4yOTI4NjEsMTMyLjg1NzY5NCBDMTIxLjU0NjE1NiwxMzQuNjQwNjQzIDExOS40OTU0NjYsMTM1LjQ4MDY4NSAxMTcuNzEyNTE3LDEzNC43MzM5NzkgTDUwLjQ4NjQxMzEsMTA2LjU3OTQ1NyBMMjkuMzUyMDI5MywxMTUuNDMwNjEgQzI3LjU2OTA4MDIsMTE2LjE3NzMxNSAyNS41MTgzOTAzLDExNS4zMzcyNzMgMjQuNzcxNjg1MSwxMTMuNTU0MzI0IEMyNC4wMjQ5OCwxMTEuNzcxMzc1IDI0Ljg2NTAyMTYsMTA5LjcyMDY4NSAyNi42NDc5NzA3LDEwOC45NzM5OCBMNDcuNSwxMDAuMjQxMDc5IEw0Ny41LDE0LjUgQzQ3LjUsMTIuNTY3MDAzNCA0OS4wNjcwMDM0LDExIDUxLDExIEM1Mi45MzI5OTY2LDExIDU0LjUsMTIuNTY3MDAzNCA1NC41LDE0LjUgTDU0LjUsOTcuMzA5NDU0OCBMMTMzLjM2MDI1Nyw2NC4yODI1MDk4IEwxMTcuMTg4MjM4LDU3Ljc0NDg4NTIgQzExNS4zOTYxMzcsNTcuMDIwNDE5IDExNC41MzA2NDksNTQuOTgwMzM4NSAxMTUuMjU1MTE1LDUzLjE4ODIzNzkgQzExNS45Nzk1ODEsNTEuMzk2MTM3MyAxMTguMDE5NjYxLDUwLjUzMDY0ODYgMTE5LjgxMTc2Miw1MS4yNTUxMTQ4IEwxMzkuNSw1OS4yMTQxODk3IEwxMzkuNSwyNS44NjAyNzg0IEwxMzUuODg3MTkyLDI0LjM5OTc4MTYgTDExOC4xODgyMzgsMTcuMjQ0ODg1MiBDMTE2LjM5NjEzNywxNi41MjA0MTkgMTE1LjUzMDY0OSwxNC40ODAzMzg1IDExNi4yNTUxMTUsMTIuNjg4MjM3OSBDMTE2Ljk3OTU4MSwxMC44OTYxMzczIDExOS4wMTk2NjEsMTAuMDMwNjQ4NiAxMjAuODExNzYyLDEwLjc1NTExNDggTDEzOC41MTA3MTYsMTcuOTEwMDExMiBMMTQzLjM2ODQyMSwxOS44NzM3NjQxIEwxNjQuNjg4MjM4LDExLjI1NTExNDggQzE2Ni40ODAzMzksMTAuNTMwNjQ4NiAxNjguNTIwNDE5LDExLjM5NjEzNzMgMTY5LjI0NDg4NSwxMy4xODgyMzc5IEMxNjkuOTY5MzUxLDE0Ljk4MDMzODUgMTY5LjEwMzg2MywxNy4wMjA0MTkgMTY3LjMxMTc2MiwxNy43NDQ4ODUyIEwxNDYuNSwyNi4xNTgxNTA4IEwxNDYuNSw2Mi40NzI4NzQ5IEMxNDYuNSw2Mi42NjA0NTc0IDE0Ni40ODUyNDMsNjIuODQ0NTkzMyAxNDYuNDU2ODI3LDYzLjAyNDE4NDkgWicgaWQ9J0NvbWJpbmVkLVNoYXBlJyAvPlxuICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSdNMTM5LjUsOTYuMzMwODA2OSBMMTIyLjgzMzMzMywxMDMuMzEwODY0IEwxMjIuODMzMzMzLDE1MS4zNzI3OTkgQzEyMi44MzMzMzMsMTUzLjMwNTc5NSAxMjEuMjY2MzMsMTU0Ljg3Mjc5OSAxMTkuMzMzMzMzLDE1NC44NzI3OTkgQzExOC41MzU3MTksMTU0Ljg3Mjc5OSAxMTcuODAwNDIsMTU0LjYwNTk5NCAxMTcuMjExODE2LDE1NC4xNTY3NjMgTDI2LjY0Nzk3MDcsMTE2LjIyODMxNSBDMjYuMDk3NjcwNiwxMTUuOTk3ODQ3IDI1LjYzNzE5NCwxMTUuNjQzMTU5IDI1LjI4NTQ3MTQsMTE1LjIxMDQ2MiBDMjQuNTAwODI1OCwxMTQuNTY4NjIgMjQsMTEzLjU5Mjc5NyAyNCwxMTIuNSBMMjQsMjUuODYwMjc4NCBMMjAuMzg3MTkyMSwyNC4zOTk3ODE2IEwyLjY4ODIzNzg5LDE3LjI0NDg4NTIgQzAuODk2MTM3MjU4LDE2LjUyMDQxOSAwLjAzMDY0ODU1ODksMTQuNDgwMzM4NSAwLjc1NTExNDc3LDEyLjY4ODIzNzkgQzEuNDc5NTgwOTgsMTAuODk2MTM3MyAzLjUxOTY2MTQ5LDEwLjAzMDY0ODYgNS4zMTE3NjIxMSwxMC43NTUxMTQ4IEwyMy4wMTA3MTY0LDE3LjkxMDAxMTIgTDI3Ljg2ODQyMTEsMTkuODczNzY0MSBMNDkuMTg4MjM3OSwxMS4yNTUxMTQ4IEM1MC45ODAzMzg1LDEwLjUzMDY0ODYgNTMuMDIwNDE5LDExLjM5NjEzNzMgNTMuNzQ0ODg1MiwxMy4xODgyMzc5IEM1NC40NjkzNTE0LDE0Ljk4MDMzODUgNTMuNjAzODYyNywxNy4wMjA0MTkgNTEuODExNzYyMSwxNy43NDQ4ODUyIEwzMSwyNi4xNTgxNTA4IEwzMSwxMTAuNDYxODYxIEwxMTUuODMzMzMzLDE0NS45OTAzNTEgTDExNS44MzMzMzMsMTA2LjI0MjQ4OCBMODQuMjU5NjYxNiwxMTkuNDY1NjQ5IEM4Mi40NzY3MTI1LDEyMC4yMTIzNTUgODAuNDI2MDIyNiwxMTkuMzcyMzEzIDc5LjY3OTMxNzQsMTE3LjU4OTM2NCBDNzguOTMyNjEyMywxMTUuODA2NDE1IDc5Ljc3MjY1MzksMTEzLjc1NTcyNSA4MS41NTU2MDMsMTEzLjAwOTAyIEwxNDEuMDUyMTUxLDg4LjA5MTY2MjIgQzE0MS42MDg5NzQsODcuNzE3OTkzIDE0Mi4yNzkwMyw4Ny41IDE0Myw4Ny41IEMxNDQuOTMyOTk3LDg3LjUgMTQ2LjUsODkuMDY3MDAzNCAxNDYuNSw5MSBMMTQ2LjUsMjE3LjYzMDQ4IEMxNDYuNSwyMTkuNTYzNDc3IDE0NC45MzI5OTcsMjIxLjEzMDQ4IDE0MywyMjEuMTMwNDggQzE0MS4wNjcwMDMsMjIxLjEzMDQ4IDEzOS41LDIxOS41NjM0NzcgMTM5LjUsMjE3LjYzMDQ4IEwxMzkuNSw5Ni4zMzA4MDY5IFogTTMxLDE0MSBMMzEsMjE3LjA1NTIzNyBDMzEsMjE4Ljk4ODIzNCAyOS40MzI5OTY2LDIyMC41NTUyMzcgMjcuNSwyMjAuNTU1MjM3IEMyNS41NjcwMDM0LDIyMC41NTUyMzcgMjQsMjE4Ljk4ODIzNCAyNCwyMTcuMDU1MjM3IEwyNCwxNDEgQzI0LDEzOS4wNjcwMDMgMjUuNTY3MDAzNCwxMzcuNSAyNy41LDEzNy41IEMyOS40MzI5OTY2LDEzNy41IDMxLDEzOS4wNjcwMDMgMzEsMTQxIFonIGlkPSdDb21iaW5lZC1TaGFwZScgLz5cbiAgICAgICAgICAgICAgICAgIDwvZz5cbiAgICAgICAgICAgICAgICA8L2c+XG4gICAgICAgICAgICAgIDwvZz5cbiAgICAgICAgICAgIDwvc3ZnPlxuICAgICAgICAgICAgPGJyIC8+XG4gICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBjb2xvcjogJyNGQUZDRkQnLCBkaXNwbGF5OiAnaW5saW5lLWJsb2NrJywgd2lkdGg6ICcxMDAlJywgaGVpZ2h0OiA1MCwgcG9zaXRpb246ICdhYnNvbHV0ZScsIGJvdHRvbTogNTAsIGxlZnQ6IDAgfX0+e3RoaXMuc3RhdGUuc29mdHdhcmVWZXJzaW9ufTwvc3Bhbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICByZW5kZXIgKCkge1xuICAgIGlmICh0aGlzLnN0YXRlLnJlYWR5Rm9yQXV0aCAmJiAoIXRoaXMuc3RhdGUuaXNVc2VyQXV0aGVudGljYXRlZCB8fCAhdGhpcy5zdGF0ZS51c2VybmFtZSkpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxTdHlsZVJvb3Q+XG4gICAgICAgICAgPEF1dGhlbnRpY2F0aW9uVUlcbiAgICAgICAgICAgIG9uU3VibWl0PXt0aGlzLmF1dGhlbnRpY2F0ZVVzZXJ9XG4gICAgICAgICAgICBvblN1Ym1pdFN1Y2Nlc3M9e3RoaXMuYXV0aGVudGljYXRpb25Db21wbGV0ZX1cbiAgICAgICAgICAgIHsuLi50aGlzLnByb3BzfSAvPlxuICAgICAgICA8L1N0eWxlUm9vdD5cbiAgICAgIClcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuc3RhdGUuaXNVc2VyQXV0aGVudGljYXRlZCB8fCAhdGhpcy5zdGF0ZS51c2VybmFtZSkge1xuICAgICAgcmV0dXJuIHRoaXMucmVuZGVyU3RhcnR1cERlZmF1bHRTY3JlZW4oKVxuICAgIH1cblxuICAgIGlmICh0aGlzLnN0YXRlLmRhc2hib2FyZFZpc2libGUpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgPFByb2plY3RCcm93c2VyXG4gICAgICAgICAgICBsb2FkUHJvamVjdHM9e3RoaXMubG9hZFByb2plY3RzfVxuICAgICAgICAgICAgbGF1bmNoUHJvamVjdD17dGhpcy5sYXVuY2hQcm9qZWN0fVxuICAgICAgICAgICAgY3JlYXRlTm90aWNlPXt0aGlzLmNyZWF0ZU5vdGljZX1cbiAgICAgICAgICAgIHJlbW92ZU5vdGljZT17dGhpcy5yZW1vdmVOb3RpY2V9XG4gICAgICAgICAgICBub3RpY2VzPXt0aGlzLnN0YXRlLm5vdGljZXN9XG4gICAgICAgICAgICBlbnZveT17dGhpcy5lbnZveX1cbiAgICAgICAgICAgIHsuLi50aGlzLnByb3BzfSAvPlxuICAgICAgICAgIDxUb3VyIHByb2plY3RzTGlzdD17dGhpcy5zdGF0ZS5wcm9qZWN0c0xpc3R9IGVudm95PXt0aGlzLmVudm95fSBzdGFydFRvdXJPbk1vdW50IC8+XG4gICAgICAgICAgPEF1dG9VcGRhdGVyIG9uQXV0b1VwZGF0ZUNoZWNrQ29tcGxldGU9e3RoaXMub25BdXRvVXBkYXRlQ2hlY2tDb21wbGV0ZX0gc2hvdWxkRGlzcGxheT17IXRoaXMuc3RhdGUuaGFzQ2hlY2tlZEZvclVwZGF0ZXN9IC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKVxuICAgIH1cblxuICAgIGlmICghdGhpcy5zdGF0ZS5wcm9qZWN0Rm9sZGVyKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIDxUb3VyIHByb2plY3RzTGlzdD17dGhpcy5zdGF0ZS5wcm9qZWN0c0xpc3R9IGVudm95PXt0aGlzLmVudm95fSAvPlxuICAgICAgICAgIDxBdXRvVXBkYXRlciBvbkF1dG9VcGRhdGVDaGVja0NvbXBsZXRlPXt0aGlzLm9uQXV0b1VwZGF0ZUNoZWNrQ29tcGxldGV9IHNob3VsZERpc3BsYXk9eyF0aGlzLnN0YXRlLmhhc0NoZWNrZWRGb3JVcGRhdGVzfSAvPlxuICAgICAgICAgIDxQcm9qZWN0QnJvd3NlclxuICAgICAgICAgICAgbG9hZFByb2plY3RzPXt0aGlzLmxvYWRQcm9qZWN0c31cbiAgICAgICAgICAgIGxhdW5jaFByb2plY3Q9e3RoaXMubGF1bmNoUHJvamVjdH1cbiAgICAgICAgICAgIGNyZWF0ZU5vdGljZT17dGhpcy5jcmVhdGVOb3RpY2V9XG4gICAgICAgICAgICByZW1vdmVOb3RpY2U9e3RoaXMucmVtb3ZlTm90aWNlfVxuICAgICAgICAgICAgbm90aWNlcz17dGhpcy5zdGF0ZS5ub3RpY2VzfVxuICAgICAgICAgICAgZW52b3k9e3RoaXMuZW52b3l9XG4gICAgICAgICAgICB7Li4udGhpcy5wcm9wc30gLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICApXG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLnN0YXRlLmFwcGxpY2F0aW9uSW1hZ2UgfHwgdGhpcy5zdGF0ZS5mb2xkZXJMb2FkaW5nRXJyb3IpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgc3R5bGU9e3sgcG9zaXRpb246ICdhYnNvbHV0ZScsIHdpZHRoOiAnMTAwJScsIGhlaWdodDogJzEwMCUnIH19PlxuICAgICAgICAgIDxSZWFjdENTU1RyYW5zaXRpb25Hcm91cFxuICAgICAgICAgICAgdHJhbnNpdGlvbk5hbWU9J3RvYXN0J1xuICAgICAgICAgICAgdHJhbnNpdGlvbkVudGVyVGltZW91dD17NTAwfVxuICAgICAgICAgICAgdHJhbnNpdGlvbkxlYXZlVGltZW91dD17MzAwfT5cbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3twb3NpdGlvbjogJ2Fic29sdXRlJywgcmlnaHQ6IDAsIHRvcDogMCwgd2lkdGg6IDMwMH19PlxuICAgICAgICAgICAgICB7bG9kYXNoLm1hcCh0aGlzLnN0YXRlLm5vdGljZXMsIHRoaXMucmVuZGVyTm90aWZpY2F0aW9ucyl9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L1JlYWN0Q1NTVHJhbnNpdGlvbkdyb3VwPlxuICAgICAgICAgIDxkaXYgc3R5bGU9e3sgcG9zaXRpb246ICdyZWxhdGl2ZScsIHdpZHRoOiAnMTAwJScsIGhlaWdodDogJzEwMCUnIH19PlxuICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBwb3NpdGlvbjogJ2Fic29sdXRlJywgdG9wOiAnNTAlJywgbGVmdDogJzUwJScsIHRyYW5zZm9ybTogJ3RyYW5zbGF0ZSgtNTAlLCAtNTAlKScgfX0+XG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGZvbnRTaXplOiAyNCwgY29sb3I6ICcjMjIyJyB9fT5Mb2FkaW5nIHByb2plY3QuLi48L3NwYW4+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICApXG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgc3R5bGU9e3sgcG9zaXRpb246ICdyZWxhdGl2ZScsIHdpZHRoOiAnMTAwJScsIGhlaWdodDogJzEwMCUnIH19PlxuICAgICAgICA8QXV0b1VwZGF0ZXIgb25BdXRvVXBkYXRlQ2hlY2tDb21wbGV0ZT17dGhpcy5vbkF1dG9VcGRhdGVDaGVja0NvbXBsZXRlfSBzaG91bGREaXNwbGF5PXshdGhpcy5zdGF0ZS5oYXNDaGVja2VkRm9yVXBkYXRlc30gLz5cbiAgICAgICAgPFRvdXIgcHJvamVjdHNMaXN0PXt0aGlzLnN0YXRlLnByb2plY3RzTGlzdH0gZW52b3k9e3RoaXMuZW52b3l9IC8+XG4gICAgICAgIDxkaXYgc3R5bGU9e3sgcG9zaXRpb246ICdhYnNvbHV0ZScsIHdpZHRoOiAnMTAwJScsIGhlaWdodDogJzEwMCUnLCB0b3A6IDAsIGxlZnQ6IDAgfX0+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9J2xheW91dC1ib3gnIHN0eWxlPXt7b3ZlcmZsb3c6ICd2aXNpYmxlJ319PlxuICAgICAgICAgICAgPFJlYWN0Q1NTVHJhbnNpdGlvbkdyb3VwXG4gICAgICAgICAgICAgIHRyYW5zaXRpb25OYW1lPSd0b2FzdCdcbiAgICAgICAgICAgICAgdHJhbnNpdGlvbkVudGVyVGltZW91dD17NTAwfVxuICAgICAgICAgICAgICB0cmFuc2l0aW9uTGVhdmVUaW1lb3V0PXszMDB9PlxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7cG9zaXRpb246ICdhYnNvbHV0ZScsIHJpZ2h0OiAwLCB0b3A6IDAsIHdpZHRoOiAzMDB9fT5cbiAgICAgICAgICAgICAgICB7bG9kYXNoLm1hcCh0aGlzLnN0YXRlLm5vdGljZXMsIHRoaXMucmVuZGVyTm90aWZpY2F0aW9ucyl9XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9SZWFjdENTU1RyYW5zaXRpb25Hcm91cD5cbiAgICAgICAgICAgIDxTcGxpdFBhbmUgb25EcmFnRmluaXNoZWQ9e3RoaXMuaGFuZGxlUGFuZVJlc2l6ZS5iaW5kKHRoaXMpfSBzcGxpdD0naG9yaXpvbnRhbCcgbWluU2l6ZT17MzAwfSBkZWZhdWx0U2l6ZT17dGhpcy5wcm9wcy5oZWlnaHQgKiAwLjYyfT5cbiAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8U3BsaXRQYW5lIG9uRHJhZ0ZpbmlzaGVkPXt0aGlzLmhhbmRsZVBhbmVSZXNpemUuYmluZCh0aGlzKX0gc3BsaXQ9J3ZlcnRpY2FsJyBtaW5TaXplPXszMDB9IGRlZmF1bHRTaXplPXszMDB9PlxuICAgICAgICAgICAgICAgICAgPFNpZGVCYXJcbiAgICAgICAgICAgICAgICAgICAgc2V0RGFzaGJvYXJkVmlzaWJpbGl0eT17dGhpcy5zZXREYXNoYm9hcmRWaXNpYmlsaXR5LmJpbmQodGhpcyl9XG4gICAgICAgICAgICAgICAgICAgIHN3aXRjaEFjdGl2ZU5hdj17dGhpcy5zd2l0Y2hBY3RpdmVOYXYuYmluZCh0aGlzKX1cbiAgICAgICAgICAgICAgICAgICAgYWN0aXZlTmF2PXt0aGlzLnN0YXRlLmFjdGl2ZU5hdn0+XG4gICAgICAgICAgICAgICAgICAgIHt0aGlzLnN0YXRlLmFjdGl2ZU5hdiA9PT0gJ2xpYnJhcnknXG4gICAgICAgICAgICAgICAgICAgICAgPyA8TGlicmFyeVxuICAgICAgICAgICAgICAgICAgICAgICAgbGF5b3V0PXt0aGlzLmxheW91dH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGZvbGRlcj17dGhpcy5zdGF0ZS5wcm9qZWN0Rm9sZGVyfVxuICAgICAgICAgICAgICAgICAgICAgICAgaGFpa3U9e3RoaXMucHJvcHMuaGFpa3V9XG4gICAgICAgICAgICAgICAgICAgICAgICB3ZWJzb2NrZXQ9e3RoaXMucHJvcHMud2Vic29ja2V0fVxuICAgICAgICAgICAgICAgICAgICAgICAgdG91ckNoYW5uZWw9e3RoaXMudG91ckNoYW5uZWx9XG4gICAgICAgICAgICAgICAgICAgICAgICBvbkRyYWdFbmQ9e3RoaXMub25MaWJyYXJ5RHJhZ0VuZC5iaW5kKHRoaXMpfVxuICAgICAgICAgICAgICAgICAgICAgICAgb25EcmFnU3RhcnQ9e3RoaXMub25MaWJyYXJ5RHJhZ1N0YXJ0LmJpbmQodGhpcyl9XG4gICAgICAgICAgICAgICAgICAgICAgICBjcmVhdGVOb3RpY2U9e3RoaXMuY3JlYXRlTm90aWNlfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmVtb3ZlTm90aWNlPXt0aGlzLnJlbW92ZU5vdGljZX0gLz5cbiAgICAgICAgICAgICAgICAgICAgICA6IDxTdGF0ZUluc3BlY3RvclxuICAgICAgICAgICAgICAgICAgICAgICAgY3JlYXRlTm90aWNlPXt0aGlzLmNyZWF0ZU5vdGljZX1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJlbW92ZU5vdGljZT17dGhpcy5yZW1vdmVOb3RpY2V9XG4gICAgICAgICAgICAgICAgICAgICAgICBmb2xkZXI9e3RoaXMuc3RhdGUucHJvamVjdEZvbGRlcn1cbiAgICAgICAgICAgICAgICAgICAgICAgIHdlYnNvY2tldD17dGhpcy5wcm9wcy53ZWJzb2NrZXR9XG4gICAgICAgICAgICAgICAgICAgICAgICB0b3VyQ2hhbm5lbD17dGhpcy50b3VyQ2hhbm5lbH0gLz5cbiAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICA8L1NpZGVCYXI+XG4gICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7cG9zaXRpb246ICdyZWxhdGl2ZScsIHdpZHRoOiAnMTAwJScsIGhlaWdodDogJzEwMCUnfX0+XG4gICAgICAgICAgICAgICAgICAgIDxTdGFnZVxuICAgICAgICAgICAgICAgICAgICAgIHJlZj0nc3RhZ2UnXG4gICAgICAgICAgICAgICAgICAgICAgZm9sZGVyPXt0aGlzLnN0YXRlLnByb2plY3RGb2xkZXJ9XG4gICAgICAgICAgICAgICAgICAgICAgZW52b3k9e3RoaXMuZW52b3l9XG4gICAgICAgICAgICAgICAgICAgICAgaGFpa3U9e3RoaXMucHJvcHMuaGFpa3V9XG4gICAgICAgICAgICAgICAgICAgICAgd2Vic29ja2V0PXt0aGlzLnByb3BzLndlYnNvY2tldH1cbiAgICAgICAgICAgICAgICAgICAgICBwcm9qZWN0PXt0aGlzLnN0YXRlLnByb2plY3RPYmplY3R9XG4gICAgICAgICAgICAgICAgICAgICAgY3JlYXRlTm90aWNlPXt0aGlzLmNyZWF0ZU5vdGljZX1cbiAgICAgICAgICAgICAgICAgICAgICByZW1vdmVOb3RpY2U9e3RoaXMucmVtb3ZlTm90aWNlfVxuICAgICAgICAgICAgICAgICAgICAgIHJlY2VpdmVQcm9qZWN0SW5mbz17dGhpcy5yZWNlaXZlUHJvamVjdEluZm99XG4gICAgICAgICAgICAgICAgICAgICAgb3JnYW5pemF0aW9uTmFtZT17dGhpcy5zdGF0ZS5vcmdhbml6YXRpb25OYW1lfVxuICAgICAgICAgICAgICAgICAgICAgIGF1dGhUb2tlbj17dGhpcy5zdGF0ZS5hdXRoVG9rZW59XG4gICAgICAgICAgICAgICAgICAgICAgdXNlcm5hbWU9e3RoaXMuc3RhdGUudXNlcm5hbWV9XG4gICAgICAgICAgICAgICAgICAgICAgcGFzc3dvcmQ9e3RoaXMuc3RhdGUucGFzc3dvcmR9IC8+XG4gICAgICAgICAgICAgICAgICAgIHsodGhpcy5zdGF0ZS5saWJyYXJ5SXRlbURyYWdnaW5nKVxuICAgICAgICAgICAgICAgICAgICAgID8gPGRpdiBzdHlsZT17eyB3aWR0aDogJzEwMCUnLCBoZWlnaHQ6ICcxMDAlJywgYmFja2dyb3VuZENvbG9yOiAnd2hpdGUnLCBvcGFjaXR5OiAwLjAxLCBwb3NpdGlvbjogJ2Fic29sdXRlJywgdG9wOiAwLCBsZWZ0OiAwIH19IC8+XG4gICAgICAgICAgICAgICAgICAgICAgOiAnJyB9XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L1NwbGl0UGFuZT5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxUaW1lbGluZVxuICAgICAgICAgICAgICAgIHJlZj0ndGltZWxpbmUnXG4gICAgICAgICAgICAgICAgZm9sZGVyPXt0aGlzLnN0YXRlLnByb2plY3RGb2xkZXJ9XG4gICAgICAgICAgICAgICAgZW52b3k9e3RoaXMuZW52b3l9XG4gICAgICAgICAgICAgICAgaGFpa3U9e3RoaXMucHJvcHMuaGFpa3V9XG4gICAgICAgICAgICAgICAgY3JlYXRlTm90aWNlPXt0aGlzLmNyZWF0ZU5vdGljZX1cbiAgICAgICAgICAgICAgICByZW1vdmVOb3RpY2U9e3RoaXMucmVtb3ZlTm90aWNlfSAvPlxuICAgICAgICAgICAgPC9TcGxpdFBhbmU+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG59XG4iXX0=