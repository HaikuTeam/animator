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

var _client = require('haiku-sdk-creator/lib/envoy/client');

var _client2 = _interopRequireDefault(_client);

var _HaikuHomeDir = require('haiku-serialization/src/utils/HaikuHomeDir');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var pkg = require('./../../package.json');

var mixpanel = require('./../utils/Mixpanel');

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

          case 'crash':
            if (process.env.HAIKU_RELEASE_ENVIRONMENT !== 'production') {
              _this3.setState({ didPlumbingNoticeCrash: true, crashMessage: message });
            }
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
    key: 'renderStartupDefaultScreen',
    value: function renderStartupDefaultScreen() {
      return _react2.default.createElement(
        'div',
        { style: { position: 'absolute', width: '100%', height: '100%' }, __source: {
            fileName: _jsxFileName,
            lineNumber: 527
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
              lineNumber: 528
            },
            __self: this
          },
          _react2.default.createElement(
            'div',
            { style: { position: 'absolute', right: 0, top: 0, width: 300 }, __source: {
                fileName: _jsxFileName,
                lineNumber: 532
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
              lineNumber: 536
            },
            __self: this
          },
          _react2.default.createElement(
            'div',
            { style: { display: 'table-cell', width: '100%', height: '100%', verticalAlign: 'middle', textAlign: 'center' }, __source: {
                fileName: _jsxFileName,
                lineNumber: 537
              },
              __self: this
            },
            _react2.default.createElement(
              'svg',
              { width: '170px', height: '221px', viewBox: '0 0 170 221', version: '1.1', __source: {
                  fileName: _jsxFileName,
                  lineNumber: 538
                },
                __self: this
              },
              _react2.default.createElement(
                'g',
                { id: 'Page-1', stroke: 'none', strokeWidth: '1', fill: 'none', fillRule: 'evenodd', __source: {
                    fileName: _jsxFileName,
                    lineNumber: 539
                  },
                  __self: this
                },
                _react2.default.createElement(
                  'g',
                  { id: 'Outlined', transform: 'translate(-211.000000, -114.000000)', fillRule: 'nonzero', fill: '#FAFCFD', __source: {
                      fileName: _jsxFileName,
                      lineNumber: 540
                    },
                    __self: this
                  },
                  _react2.default.createElement(
                    'g',
                    { id: 'outlined-logo', transform: 'translate(211.000000, 113.000000)', __source: {
                        fileName: _jsxFileName,
                        lineNumber: 541
                      },
                      __self: this
                    },
                    _react2.default.createElement('path', { d: 'M47.5,152.798823 L26.3823432,143.954676 C24.5993941,143.207971 23.7593524,141.157281 24.5060576,139.374332 C25.2527628,137.591383 27.3034527,136.751341 29.0864018,137.498046 L117.780058,174.64456 L120.990021,176.089074 C122.486814,176.762645 123.279304,178.358251 122.998698,179.903598 C122.999564,179.935626 123,179.967762 123,180 L123,205.639722 L138.510716,211.910011 L143.368421,213.873764 L162.833333,206.00497 L162.833333,16.2929025 L143,8.27517204 L122.833333,16.4276543 L122.833333,53.6013295 C122.834218,53.6466489 122.834215,53.6919015 122.833333,53.7370634 L122.833333,54 C122.833333,55.9329966 121.26633,57.5 119.333333,57.5 C119.28843,57.5 119.243724,57.4991544 119.19923,57.4974782 L53.307638,84.037149 C51.5146183,84.7593375 49.4756392,83.8912573 48.7534506,82.0982376 C48.0312621,80.3052179 48.8993423,78.2662388 50.692362,77.5440502 L115.833333,51.3067129 L115.833333,14.4974227 C115.833333,14.0143178 115.931213,13.5540739 116.108222,13.1354399 C116.374539,12.0941292 117.115326,11.1888449 118.188238,10.7551148 L141.684186,1.2567527 C142.091317,1.09152936 142.52959,1.00240467 142.975937,0.999164723 C143.47041,1.00240467 143.908683,1.09152936 144.315814,1.2567527 L167.811762,10.7551148 C169.522968,11.446879 170.389328,13.3381659 169.833333,15.0677068 L169.833333,208 C169.833333,208.826304 169.54699,209.585728 169.068118,210.184459 C168.693703,210.867378 168.090133,211.430224 167.311762,211.744885 L144.517645,220.959528 C143.332542,221.438613 142.038995,221.222397 141.089179,220.502712 L135.887192,218.399782 L119.461595,211.759647 C117.54629,211.739055 116,210.180032 116,208.259853 L116,208.07911 C115.998767,208.025708 115.998761,207.972178 116,207.918558 L116,181.518748 L114.991727,181.064589 L54.5,155.730447 L54.5,206.998273 C55.1341468,208.658256 54.4195315,210.512915 52.8796645,211.333333 C52.5545546,211.540709 52.192904,211.695869 51.8065294,211.786997 L29.7867375,220.650655 C28.8252535,221.478758 27.4457005,221.753221 26.1882379,221.244885 L20.3871921,218.899782 L3.30627783,211.994731 C1.46338189,211.894192 -2.60835995e-16,210.367992 0,208.5 L2.70894418e-14,14.4974227 C2.724245e-14,13.4016458 0.503560947,12.4234818 1.29189669,11.781717 C1.65171014,11.3416509 2.12405622,10.9831882 2.68823789,10.7551148 L26.1841862,1.2567527 C26.5913172,1.09152936 27.0295898,1.00240467 27.4759367,0.999164723 C27.9704102,1.00240467 28.4086828,1.09152936 28.8158138,1.2567527 L52.3117621,10.7551148 C54.1038627,11.479581 54.9693514,13.5196615 54.2448852,15.3117621 C53.520419,17.1038627 51.4803385,17.9693514 49.6882379,17.2448852 L27.5,8.27517204 L7,16.5624061 L7,205.937594 L23.0107164,212.410011 L27.2526995,214.124855 L47.5,205.974681 L47.5,152.798823 Z', id: 'Combined-Shape', __source: {
                        fileName: _jsxFileName,
                        lineNumber: 542
                      },
                      __self: this
                    }),
                    _react2.default.createElement('path', { d: 'M146.456827,63.0241849 C146.948603,64.7104724 146.105972,66.5336591 144.447305,67.2283149 L59.5468677,102.784908 L120.416575,128.27735 C122.199524,129.024055 123.039566,131.074745 122.292861,132.857694 C121.546156,134.640643 119.495466,135.480685 117.712517,134.733979 L50.4864131,106.579457 L29.3520293,115.43061 C27.5690802,116.177315 25.5183903,115.337273 24.7716851,113.554324 C24.02498,111.771375 24.8650216,109.720685 26.6479707,108.97398 L47.5,100.241079 L47.5,14.5 C47.5,12.5670034 49.0670034,11 51,11 C52.9329966,11 54.5,12.5670034 54.5,14.5 L54.5,97.3094548 L133.360257,64.2825098 L117.188238,57.7448852 C115.396137,57.020419 114.530649,54.9803385 115.255115,53.1882379 C115.979581,51.3961373 118.019661,50.5306486 119.811762,51.2551148 L139.5,59.2141897 L139.5,25.8602784 L135.887192,24.3997816 L118.188238,17.2448852 C116.396137,16.520419 115.530649,14.4803385 116.255115,12.6882379 C116.979581,10.8961373 119.019661,10.0306486 120.811762,10.7551148 L138.510716,17.9100112 L143.368421,19.8737641 L164.688238,11.2551148 C166.480339,10.5306486 168.520419,11.3961373 169.244885,13.1882379 C169.969351,14.9803385 169.103863,17.020419 167.311762,17.7448852 L146.5,26.1581508 L146.5,62.4728749 C146.5,62.6604574 146.485243,62.8445933 146.456827,63.0241849 Z', id: 'Combined-Shape', __source: {
                        fileName: _jsxFileName,
                        lineNumber: 543
                      },
                      __self: this
                    }),
                    _react2.default.createElement('path', { d: 'M139.5,96.3308069 L122.833333,103.310864 L122.833333,151.372799 C122.833333,153.305795 121.26633,154.872799 119.333333,154.872799 C118.535719,154.872799 117.80042,154.605994 117.211816,154.156763 L26.6479707,116.228315 C26.0976706,115.997847 25.637194,115.643159 25.2854714,115.210462 C24.5008258,114.56862 24,113.592797 24,112.5 L24,25.8602784 L20.3871921,24.3997816 L2.68823789,17.2448852 C0.896137258,16.520419 0.0306485589,14.4803385 0.75511477,12.6882379 C1.47958098,10.8961373 3.51966149,10.0306486 5.31176211,10.7551148 L23.0107164,17.9100112 L27.8684211,19.8737641 L49.1882379,11.2551148 C50.9803385,10.5306486 53.020419,11.3961373 53.7448852,13.1882379 C54.4693514,14.9803385 53.6038627,17.020419 51.8117621,17.7448852 L31,26.1581508 L31,110.461861 L115.833333,145.990351 L115.833333,106.242488 L84.2596616,119.465649 C82.4767125,120.212355 80.4260226,119.372313 79.6793174,117.589364 C78.9326123,115.806415 79.7726539,113.755725 81.555603,113.00902 L141.052151,88.0916622 C141.608974,87.717993 142.27903,87.5 143,87.5 C144.932997,87.5 146.5,89.0670034 146.5,91 L146.5,217.63048 C146.5,219.563477 144.932997,221.13048 143,221.13048 C141.067003,221.13048 139.5,219.563477 139.5,217.63048 L139.5,96.3308069 Z M31,141 L31,217.055237 C31,218.988234 29.4329966,220.555237 27.5,220.555237 C25.5670034,220.555237 24,218.988234 24,217.055237 L24,141 C24,139.067003 25.5670034,137.5 27.5,137.5 C29.4329966,137.5 31,139.067003 31,141 Z', id: 'Combined-Shape', __source: {
                        fileName: _jsxFileName,
                        lineNumber: 544
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
                lineNumber: 549
              },
              __self: this
            }),
            _react2.default.createElement(
              'span',
              { style: { color: '#FAFCFD', display: 'inline-block', width: '100%', height: 50, position: 'absolute', bottom: 50, left: 0 }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 550
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
              lineNumber: 560
            },
            __self: this
          },
          _react2.default.createElement(_AuthenticationUI2.default, Object.assign({
            onSubmit: this.authenticateUser,
            onSubmitSuccess: this.authenticationComplete
          }, this.props, {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 561
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
              lineNumber: 575
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
              lineNumber: 576
            },
            __self: this
          })),
          _react2.default.createElement(_Tour2.default, { projectsList: this.state.projectsList, envoy: this.envoy, startTourOnMount: true, __source: {
              fileName: _jsxFileName,
              lineNumber: 584
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
              lineNumber: 591
            },
            __self: this
          },
          _react2.default.createElement(_Tour2.default, { projectsList: this.state.projectsList, envoy: this.envoy, __source: {
              fileName: _jsxFileName,
              lineNumber: 592
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
              lineNumber: 593
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
              lineNumber: 607
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
                lineNumber: 608
              },
              __self: this
            },
            _react2.default.createElement(
              'div',
              { style: { position: 'absolute', right: 0, top: 0, width: 300 }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 612
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
                lineNumber: 616
              },
              __self: this
            },
            _react2.default.createElement(
              'div',
              { style: { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 617
                },
                __self: this
              },
              _react2.default.createElement(
                'span',
                { style: { fontSize: 24, color: '#222' }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 618
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
            lineNumber: 626
          },
          __self: this
        },
        _react2.default.createElement(_Tour2.default, { projectsList: this.state.projectsList, envoy: this.envoy, __source: {
            fileName: _jsxFileName,
            lineNumber: 627
          },
          __self: this
        }),
        _react2.default.createElement(
          'div',
          { style: { position: 'absolute', width: '100%', height: '100%', top: 0, left: 0 }, __source: {
              fileName: _jsxFileName,
              lineNumber: 628
            },
            __self: this
          },
          _react2.default.createElement(
            'div',
            { className: 'layout-box', style: { overflow: 'visible' }, __source: {
                fileName: _jsxFileName,
                lineNumber: 629
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
                  lineNumber: 630
                },
                __self: this
              },
              _react2.default.createElement(
                'div',
                { style: { position: 'absolute', right: 0, top: 0, width: 300 }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 634
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
                  lineNumber: 638
                },
                __self: this
              },
              _react2.default.createElement(
                'div',
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 639
                  },
                  __self: this
                },
                _react2.default.createElement(
                  _reactSplitPane2.default,
                  { onDragFinished: this.handlePaneResize.bind(this), split: 'vertical', minSize: 300, defaultSize: 300, __source: {
                      fileName: _jsxFileName,
                      lineNumber: 640
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
                        lineNumber: 641
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
                        lineNumber: 646
                      },
                      __self: this
                    }) : _react2.default.createElement(_StateInspector2.default, {
                      createNotice: this.createNotice,
                      removeNotice: this.removeNotice,
                      folder: this.state.projectFolder,
                      websocket: this.props.websocket,
                      tourChannel: this.tourChannel, __source: {
                        fileName: _jsxFileName,
                        lineNumber: 656
                      },
                      __self: this
                    })
                  ),
                  _react2.default.createElement(
                    'div',
                    { style: { position: 'relative', width: '100%', height: '100%' }, __source: {
                        fileName: _jsxFileName,
                        lineNumber: 664
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
                        lineNumber: 665
                      },
                      __self: this
                    }),
                    this.state.libraryItemDragging ? _react2.default.createElement('div', { style: { width: '100%', height: '100%', backgroundColor: 'white', opacity: 0.01, position: 'absolute', top: 0, left: 0 }, __source: {
                        fileName: _jsxFileName,
                        lineNumber: 680
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
                haiku: this.props.haiku, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 685
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZWFjdC9DcmVhdG9yLmpzIl0sIm5hbWVzIjpbInBrZyIsInJlcXVpcmUiLCJtaXhwYW5lbCIsImVsZWN0cm9uIiwicmVtb3RlIiwiaXBjUmVuZGVyZXIiLCJjbGlwYm9hcmQiLCJ3ZWJGcmFtZSIsInNldFpvb21MZXZlbExpbWl0cyIsInNldExheW91dFpvb21MZXZlbExpbWl0cyIsIkNyZWF0b3IiLCJwcm9wcyIsImF1dGhlbnRpY2F0ZVVzZXIiLCJiaW5kIiwiYXV0aGVudGljYXRpb25Db21wbGV0ZSIsImxvYWRQcm9qZWN0cyIsImxhdW5jaFByb2plY3QiLCJyZW1vdmVOb3RpY2UiLCJjcmVhdGVOb3RpY2UiLCJyZW5kZXJOb3RpZmljYXRpb25zIiwicmVjZWl2ZVByb2plY3RJbmZvIiwiaGFuZGxlRmluZEVsZW1lbnRDb29yZGluYXRlcyIsImhhbmRsZUZpbmRXZWJ2aWV3Q29vcmRpbmF0ZXMiLCJsYXlvdXQiLCJzdGF0ZSIsImVycm9yIiwicHJvamVjdEZvbGRlciIsImZvbGRlciIsImFwcGxpY2F0aW9uSW1hZ2UiLCJwcm9qZWN0T2JqZWN0IiwicHJvamVjdE5hbWUiLCJkYXNoYm9hcmRWaXNpYmxlIiwicmVhZHlGb3JBdXRoIiwiaXNVc2VyQXV0aGVudGljYXRlZCIsInVzZXJuYW1lIiwicGFzc3dvcmQiLCJub3RpY2VzIiwic29mdHdhcmVWZXJzaW9uIiwidmVyc2lvbiIsImRpZFBsdW1iaW5nTm90aWNlQ3Jhc2giLCJhY3RpdmVOYXYiLCJwcm9qZWN0c0xpc3QiLCJ3aW4iLCJnZXRDdXJyZW50V2luZG93IiwicHJvY2VzcyIsImVudiIsIkRFViIsIm9wZW5EZXZUb29scyIsImRvY3VtZW50IiwiYWRkRXZlbnRMaXN0ZW5lciIsIm5hdGl2ZUV2ZW50IiwiX2xhc3RNb3VzZVgiLCJjbGllbnRYIiwiX2xhc3RNb3VzZVkiLCJjbGllbnRZIiwiY29tYm9rZXlzIiwiZG9jdW1lbnRFbGVtZW50IiwiZGVib3VuY2UiLCJ3ZWJzb2NrZXQiLCJzZW5kIiwibWV0aG9kIiwicGFyYW1zIiwibGVhZGluZyIsImR1bXBTeXN0ZW1JbmZvIiwib24iLCJ0eXBlIiwibmFtZSIsIm9wZW5UZXJtaW5hbCIsImV4ZWNTeW5jIiwiSlNPTiIsInN0cmluZ2lmeSIsImV4Y2VwdGlvbiIsImNvbnNvbGUiLCJ0aW1lc3RhbXAiLCJEYXRlIiwibm93IiwiZHVtcGRpciIsImpvaW4iLCJ3cml0ZUZpbGVTeW5jIiwiYXJndiIsImV4aXN0c1N5bmMiLCJyZWFkRmlsZVN5bmMiLCJ0b1N0cmluZyIsImFjdGl2ZUZvbGRlciIsInJlYWN0U3RhdGUiLCJfX2ZpbGVuYW1lIiwiX19kaXJuYW1lIiwiaG9tZWRpciIsImlzRGV2VG9vbHNPcGVuZWQiLCJjbG9zZURldlRvb2xzIiwicmVmcyIsInN0YWdlIiwidG9nZ2xlRGV2VG9vbHMiLCJ0aW1lbGluZSIsIm1heWJlUGFzdGVSZXF1ZXN0IiwicGFzdGVkVGV4dCIsInJlYWRUZXh0IiwicGFzdGVkRGF0YSIsInBhcnNlIiwid2FybiIsIkFycmF5IiwiaXNBcnJheSIsInBhc3RlZEVsZW1lbnQiLCJyZXF1ZXN0IiwidGl0bGUiLCJtZXNzYWdlIiwiY2xvc2VUZXh0IiwibGlnaHRTY2hlbWUiLCJsZW5ndGgiLCJIQUlLVV9SRUxFQVNFX0VOVklST05NRU5UIiwic2V0U3RhdGUiLCJjcmFzaE1lc3NhZ2UiLCJpbmZvIiwiZGF0YSIsImhhbmRsZUNvbnRlbnRQYXN0ZSIsImVudm95IiwicG9ydCIsImhhaWt1IiwiaG9zdCIsIldlYlNvY2tldCIsIndpbmRvdyIsImdldCIsInRoZW4iLCJ0b3VyQ2hhbm5lbCIsInNldERhc2hib2FyZFZpc2liaWxpdHkiLCJzZXRUaW1lb3V0Iiwic3RhcnQiLCJ0aHJvdHRsZSIsIm5vdGlmeVNjcmVlblJlc2l6ZSIsInBhc3RlRXZlbnQiLCJ0YWduYW1lIiwidGFyZ2V0IiwidGFnTmFtZSIsInRvTG93ZXJDYXNlIiwicHJldmVudERlZmF1bHQiLCJjYiIsImF1dGhBbnN3ZXIiLCJtZXJnZVRvUGF5bG9hZCIsImRpc3RpbmN0X2lkIiwiaGFpa3VUcmFjayIsImF1dGhUb2tlbiIsIm9yZ2FuaXphdGlvbk5hbWUiLCJpc0F1dGhlZCIsImxhdW5jaEZvbGRlciIsImZvbGRlckxvYWRpbmdFcnJvciIsIm9mZiIsInNlbGVjdG9yIiwid2VidmlldyIsImVsZW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwidG9wIiwibGVmdCIsInJlY2VpdmVFbGVtZW50Q29vcmRpbmF0ZXMiLCJyZWNlaXZlV2Vidmlld0Nvb3JkaW5hdGVzIiwiY29udGVudCIsImkiLCJuZXh0IiwicHJvamVjdEluZm8iLCJza2lwQ29udGVudENyZWF0aW9uIiwicHJvamVjdHNIb21lIiwicHJvamVjdFBhdGgiLCJhdXRob3JOYW1lIiwicHJvamVjdCIsIm9yZ2FuaXphdGlvbiIsImVyciIsImFzc2lnbiIsIm1heWJlUHJvamVjdE5hbWUiLCJpbmRleCIsImlkIiwidW5kZWZpbmVkIiwic2xpY2UiLCJlYWNoIiwibm90aWNlIiwiTWF0aCIsInJhbmRvbSIsInJlcGxhY2VkRXhpc3RpbmciLCJmb3JFYWNoIiwibiIsInNwbGljZSIsInVuc2hpZnQiLCJkcmFnRW5kTmF0aXZlRXZlbnQiLCJsaWJyYXJ5SXRlbUluZm8iLCJsaWJyYXJ5SXRlbURyYWdnaW5nIiwicHJldmlldyIsImhhbmRsZURyb3AiLCJkcmFnU3RhcnROYXRpdmVFdmVudCIsInBvc2l0aW9uIiwid2lkdGgiLCJoZWlnaHQiLCJyaWdodCIsIm1hcCIsImRpc3BsYXkiLCJ2ZXJ0aWNhbEFsaWduIiwidGV4dEFsaWduIiwiY29sb3IiLCJib3R0b20iLCJyZW5kZXJTdGFydHVwRGVmYXVsdFNjcmVlbiIsInRyYW5zZm9ybSIsImZvbnRTaXplIiwib3ZlcmZsb3ciLCJoYW5kbGVQYW5lUmVzaXplIiwic3dpdGNoQWN0aXZlTmF2Iiwib25MaWJyYXJ5RHJhZ0VuZCIsIm9uTGlicmFyeURyYWdTdGFydCIsImJhY2tncm91bmRDb2xvciIsIm9w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dCBmcm9tICdyZWFjdCdcbmltcG9ydCB7IFN0eWxlUm9vdCB9IGZyb20gJ3JhZGl1bSdcbmltcG9ydCBTcGxpdFBhbmUgZnJvbSAncmVhY3Qtc3BsaXQtcGFuZSdcbmltcG9ydCBSZWFjdENTU1RyYW5zaXRpb25Hcm91cCBmcm9tICdyZWFjdC1hZGRvbnMtY3NzLXRyYW5zaXRpb24tZ3JvdXAnXG5pbXBvcnQgbG9kYXNoIGZyb20gJ2xvZGFzaCdcbmltcG9ydCBDb21ib2tleXMgZnJvbSAnY29tYm9rZXlzJ1xuaW1wb3J0IEV2ZW50RW1pdHRlciBmcm9tICdldmVudC1lbWl0dGVyJ1xuaW1wb3J0IGNwIGZyb20gJ2NoaWxkX3Byb2Nlc3MnXG5pbXBvcnQgb3MgZnJvbSAnb3MnXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IGZzIGZyb20gJ2ZzJ1xuaW1wb3J0IEF1dGhlbnRpY2F0aW9uVUkgZnJvbSAnLi9jb21wb25lbnRzL0F1dGhlbnRpY2F0aW9uVUknXG5pbXBvcnQgUHJvamVjdEJyb3dzZXIgZnJvbSAnLi9jb21wb25lbnRzL1Byb2plY3RCcm93c2VyJ1xuaW1wb3J0IFNpZGVCYXIgZnJvbSAnLi9jb21wb25lbnRzL1NpZGVCYXInXG5pbXBvcnQgTGlicmFyeSBmcm9tICcuL2NvbXBvbmVudHMvbGlicmFyeS9MaWJyYXJ5J1xuaW1wb3J0IFN0YXRlSW5zcGVjdG9yIGZyb20gJy4vY29tcG9uZW50cy9TdGF0ZUluc3BlY3Rvci9TdGF0ZUluc3BlY3RvcidcbmltcG9ydCBTdGFnZSBmcm9tICcuL2NvbXBvbmVudHMvU3RhZ2UnXG5pbXBvcnQgVGltZWxpbmUgZnJvbSAnLi9jb21wb25lbnRzL1RpbWVsaW5lJ1xuaW1wb3J0IFRvYXN0IGZyb20gJy4vY29tcG9uZW50cy9ub3RpZmljYXRpb25zL1RvYXN0J1xuaW1wb3J0IFRvdXIgZnJvbSAnLi9jb21wb25lbnRzL1RvdXIvVG91cidcbmltcG9ydCBFbnZveUNsaWVudCBmcm9tICdoYWlrdS1zZGstY3JlYXRvci9saWIvZW52b3kvY2xpZW50J1xuaW1wb3J0IHtcbiAgSE9NRURJUl9QQVRILFxuICBIT01FRElSX0xPR1NfUEFUSFxufSBmcm9tICdoYWlrdS1zZXJpYWxpemF0aW9uL3NyYy91dGlscy9IYWlrdUhvbWVEaXInXG5cbnZhciBwa2cgPSByZXF1aXJlKCcuLy4uLy4uL3BhY2thZ2UuanNvbicpXG5cbnZhciBtaXhwYW5lbCA9IHJlcXVpcmUoJy4vLi4vdXRpbHMvTWl4cGFuZWwnKVxuXG5jb25zdCBlbGVjdHJvbiA9IHJlcXVpcmUoJ2VsZWN0cm9uJylcbmNvbnN0IHJlbW90ZSA9IGVsZWN0cm9uLnJlbW90ZVxuY29uc3QgaXBjUmVuZGVyZXIgPSBlbGVjdHJvbi5pcGNSZW5kZXJlclxuY29uc3QgY2xpcGJvYXJkID0gZWxlY3Ryb24uY2xpcGJvYXJkXG5cbnZhciB3ZWJGcmFtZSA9IGVsZWN0cm9uLndlYkZyYW1lXG5pZiAod2ViRnJhbWUpIHtcbiAgaWYgKHdlYkZyYW1lLnNldFpvb21MZXZlbExpbWl0cykgd2ViRnJhbWUuc2V0Wm9vbUxldmVsTGltaXRzKDEsIDEpXG4gIGlmICh3ZWJGcmFtZS5zZXRMYXlvdXRab29tTGV2ZWxMaW1pdHMpIHdlYkZyYW1lLnNldExheW91dFpvb21MZXZlbExpbWl0cygwLCAwKVxufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDcmVhdG9yIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IgKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpXG4gICAgdGhpcy5hdXRoZW50aWNhdGVVc2VyID0gdGhpcy5hdXRoZW50aWNhdGVVc2VyLmJpbmQodGhpcylcbiAgICB0aGlzLmF1dGhlbnRpY2F0aW9uQ29tcGxldGUgPSB0aGlzLmF1dGhlbnRpY2F0aW9uQ29tcGxldGUuYmluZCh0aGlzKVxuICAgIHRoaXMubG9hZFByb2plY3RzID0gdGhpcy5sb2FkUHJvamVjdHMuYmluZCh0aGlzKVxuICAgIHRoaXMubGF1bmNoUHJvamVjdCA9IHRoaXMubGF1bmNoUHJvamVjdC5iaW5kKHRoaXMpXG4gICAgdGhpcy5yZW1vdmVOb3RpY2UgPSB0aGlzLnJlbW92ZU5vdGljZS5iaW5kKHRoaXMpXG4gICAgdGhpcy5jcmVhdGVOb3RpY2UgPSB0aGlzLmNyZWF0ZU5vdGljZS5iaW5kKHRoaXMpXG4gICAgdGhpcy5yZW5kZXJOb3RpZmljYXRpb25zID0gdGhpcy5yZW5kZXJOb3RpZmljYXRpb25zLmJpbmQodGhpcylcbiAgICB0aGlzLnJlY2VpdmVQcm9qZWN0SW5mbyA9IHRoaXMucmVjZWl2ZVByb2plY3RJbmZvLmJpbmQodGhpcylcbiAgICB0aGlzLmhhbmRsZUZpbmRFbGVtZW50Q29vcmRpbmF0ZXMgPSB0aGlzLmhhbmRsZUZpbmRFbGVtZW50Q29vcmRpbmF0ZXMuYmluZCh0aGlzKVxuICAgIHRoaXMuaGFuZGxlRmluZFdlYnZpZXdDb29yZGluYXRlcyA9IHRoaXMuaGFuZGxlRmluZFdlYnZpZXdDb29yZGluYXRlcy5iaW5kKHRoaXMpXG4gICAgdGhpcy5sYXlvdXQgPSBuZXcgRXZlbnRFbWl0dGVyKClcblxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBlcnJvcjogbnVsbCxcbiAgICAgIHByb2plY3RGb2xkZXI6IHRoaXMucHJvcHMuZm9sZGVyLFxuICAgICAgYXBwbGljYXRpb25JbWFnZTogbnVsbCxcbiAgICAgIHByb2plY3RPYmplY3Q6IG51bGwsXG4gICAgICBwcm9qZWN0TmFtZTogbnVsbCxcbiAgICAgIGRhc2hib2FyZFZpc2libGU6ICF0aGlzLnByb3BzLmZvbGRlcixcbiAgICAgIHJlYWR5Rm9yQXV0aDogZmFsc2UsXG4gICAgICBpc1VzZXJBdXRoZW50aWNhdGVkOiBmYWxzZSxcbiAgICAgIHVzZXJuYW1lOiBudWxsLFxuICAgICAgcGFzc3dvcmQ6IG51bGwsXG4gICAgICBub3RpY2VzOiBbXSxcbiAgICAgIHNvZnR3YXJlVmVyc2lvbjogcGtnLnZlcnNpb24sXG4gICAgICBkaWRQbHVtYmluZ05vdGljZUNyYXNoOiBmYWxzZSxcbiAgICAgIGFjdGl2ZU5hdjogJ2xpYnJhcnknLFxuICAgICAgcHJvamVjdHNMaXN0OiBbXVxuICAgIH1cblxuICAgIGNvbnN0IHdpbiA9IHJlbW90ZS5nZXRDdXJyZW50V2luZG93KClcblxuICAgIGlmIChwcm9jZXNzLmVudi5ERVYgPT09ICcxJykge1xuICAgICAgd2luLm9wZW5EZXZUb29scygpXG4gICAgfVxuXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgKG5hdGl2ZUV2ZW50KSA9PiB7XG4gICAgICB0aGlzLl9sYXN0TW91c2VYID0gbmF0aXZlRXZlbnQuY2xpZW50WFxuICAgICAgdGhpcy5fbGFzdE1vdXNlWSA9IG5hdGl2ZUV2ZW50LmNsaWVudFlcbiAgICB9KVxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWcnLCAobmF0aXZlRXZlbnQpID0+IHtcbiAgICAgIC8vIFdoZW4gdGhlIGRyYWcgZW5kcywgZm9yIHNvbWUgcmVhc29uIHRoZSBwb3NpdGlvbiBnb2VzIHRvIDAsIHNvIGhhY2sgdGhpcy4uLlxuICAgICAgaWYgKG5hdGl2ZUV2ZW50LmNsaWVudFggPiAwICYmIG5hdGl2ZUV2ZW50LmNsaWVudFkgPiAwKSB7XG4gICAgICAgIHRoaXMuX2xhc3RNb3VzZVggPSBuYXRpdmVFdmVudC5jbGllbnRYXG4gICAgICAgIHRoaXMuX2xhc3RNb3VzZVkgPSBuYXRpdmVFdmVudC5jbGllbnRZXG4gICAgICB9XG4gICAgfSlcblxuICAgIGNvbnN0IGNvbWJva2V5cyA9IG5ldyBDb21ib2tleXMoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KVxuICAgIGNvbWJva2V5cy5iaW5kKCdjb21tYW5kK29wdGlvbitpJywgbG9kYXNoLmRlYm91bmNlKCgpID0+IHtcbiAgICAgIHRoaXMucHJvcHMud2Vic29ja2V0LnNlbmQoeyBtZXRob2Q6ICd0b2dnbGVEZXZUb29scycsIHBhcmFtczogW3RoaXMuc3RhdGUucHJvamVjdEZvbGRlcl0gfSlcbiAgICB9LCA1MDAsIHsgbGVhZGluZzogdHJ1ZSB9KSlcbiAgICBjb21ib2tleXMuYmluZCgnY29tbWFuZCtvcHRpb24rMCcsIGxvZGFzaC5kZWJvdW5jZSgoKSA9PiB7XG4gICAgICB0aGlzLmR1bXBTeXN0ZW1JbmZvKClcbiAgICB9LCA1MDAsIHsgbGVhZGluZzogdHJ1ZSB9KSlcblxuICAgIC8vIE5PVEU6IFRoZSBUb3BNZW51IGF1dG9tYXRpY2FsbHkgYmluZHMgdGhlIGJlbG93IGtleWJvYXJkIHNob3J0Y3V0cy9hY2NlbGVyYXRvcnNcbiAgICBpcGNSZW5kZXJlci5vbignZ2xvYmFsLW1lbnU6em9vbS1pbicsICgpID0+IHtcbiAgICAgIHRoaXMucHJvcHMud2Vic29ja2V0LnNlbmQoeyB0eXBlOiAnYnJvYWRjYXN0JywgbmFtZTogJ3ZpZXc6em9vbS1pbicgfSlcbiAgICB9KVxuICAgIGlwY1JlbmRlcmVyLm9uKCdnbG9iYWwtbWVudTp6b29tLW91dCcsICgpID0+IHtcbiAgICAgIHRoaXMucHJvcHMud2Vic29ja2V0LnNlbmQoeyB0eXBlOiAnYnJvYWRjYXN0JywgbmFtZTogJ3ZpZXc6em9vbS1vdXQnIH0pXG4gICAgfSlcbiAgICBpcGNSZW5kZXJlci5vbignZ2xvYmFsLW1lbnU6b3Blbi10ZXJtaW5hbCcsIGxvZGFzaC5kZWJvdW5jZSgoKSA9PiB7XG4gICAgICB0aGlzLm9wZW5UZXJtaW5hbCh0aGlzLnN0YXRlLnByb2plY3RGb2xkZXIpXG4gICAgfSwgNTAwLCB7IGxlYWRpbmc6IHRydWUgfSkpXG4gICAgaXBjUmVuZGVyZXIub24oJ2dsb2JhbC1tZW51OnVuZG8nLCBsb2Rhc2guZGVib3VuY2UoKCkgPT4ge1xuICAgICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQuc2VuZCh7IG1ldGhvZDogJ2dpdFVuZG8nLCBwYXJhbXM6IFt0aGlzLnN0YXRlLnByb2plY3RGb2xkZXIsIHsgdHlwZTogJ2dsb2JhbCcgfV0gfSlcbiAgICB9LCA1MDAsIHsgbGVhZGluZzogdHJ1ZSB9KSlcbiAgICBpcGNSZW5kZXJlci5vbignZ2xvYmFsLW1lbnU6cmVkbycsIGxvZGFzaC5kZWJvdW5jZSgoKSA9PiB7XG4gICAgICB0aGlzLnByb3BzLndlYnNvY2tldC5zZW5kKHsgbWV0aG9kOiAnZ2l0UmVkbycsIHBhcmFtczogW3RoaXMuc3RhdGUucHJvamVjdEZvbGRlciwgeyB0eXBlOiAnZ2xvYmFsJyB9XSB9KVxuICAgIH0sIDUwMCwgeyBsZWFkaW5nOiB0cnVlIH0pKVxuICB9XG5cbiAgb3BlblRlcm1pbmFsIChmb2xkZXIpIHtcbiAgICB0cnkge1xuICAgICAgY3AuZXhlY1N5bmMoJ29wZW4gLWIgY29tLmFwcGxlLnRlcm1pbmFsICcgKyBKU09OLnN0cmluZ2lmeShmb2xkZXIpICsgJyB8fCB0cnVlJylcbiAgICB9IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoZXhjZXB0aW9uKVxuICAgIH1cbiAgfVxuXG4gIGR1bXBTeXN0ZW1JbmZvICgpIHtcbiAgICBjb25zdCB0aW1lc3RhbXAgPSBEYXRlLm5vdygpXG4gICAgY29uc3QgZHVtcGRpciA9IHBhdGguam9pbihIT01FRElSX1BBVEgsICdkdW1wcycsIGBkdW1wLSR7dGltZXN0YW1wfWApXG4gICAgY3AuZXhlY1N5bmMoYG1rZGlyIC1wICR7SlNPTi5zdHJpbmdpZnkoZHVtcGRpcil9YClcbiAgICBmcy53cml0ZUZpbGVTeW5jKHBhdGguam9pbihkdW1wZGlyLCAnYXJndicpLCBKU09OLnN0cmluZ2lmeShwcm9jZXNzLmFyZ3YsIG51bGwsIDIpKVxuICAgIGZzLndyaXRlRmlsZVN5bmMocGF0aC5qb2luKGR1bXBkaXIsICdlbnYnKSwgSlNPTi5zdHJpbmdpZnkocHJvY2Vzcy5lbnYsIG51bGwsIDIpKVxuICAgIGlmIChmcy5leGlzdHNTeW5jKHBhdGguam9pbihIT01FRElSX0xPR1NfUEFUSCwgJ2hhaWt1LWRlYnVnLmxvZycpKSkge1xuICAgICAgZnMud3JpdGVGaWxlU3luYyhwYXRoLmpvaW4oZHVtcGRpciwgJ2xvZycpLCBmcy5yZWFkRmlsZVN5bmMocGF0aC5qb2luKEhPTUVESVJfTE9HU19QQVRILCAnaGFpa3UtZGVidWcubG9nJykpLnRvU3RyaW5nKCkpXG4gICAgfVxuICAgIGZzLndyaXRlRmlsZVN5bmMocGF0aC5qb2luKGR1bXBkaXIsICdpbmZvJyksIEpTT04uc3RyaW5naWZ5KHtcbiAgICAgIGFjdGl2ZUZvbGRlcjogdGhpcy5zdGF0ZS5wcm9qZWN0Rm9sZGVyLFxuICAgICAgcmVhY3RTdGF0ZTogdGhpcy5zdGF0ZSxcbiAgICAgIF9fZmlsZW5hbWU6IF9fZmlsZW5hbWUsXG4gICAgICBfX2Rpcm5hbWU6IF9fZGlybmFtZVxuICAgIH0sIG51bGwsIDIpKVxuICAgIGlmICh0aGlzLnN0YXRlLnByb2plY3RGb2xkZXIpIHtcbiAgICAgIC8vIFRoZSBwcm9qZWN0IGZvbGRlciBpdHNlbGYgd2lsbCBjb250YWluIGdpdCBsb2dzIGFuZCBvdGhlciBnb29kaWVzIHdlIG1naWh0IHdhbnQgdG8gbG9vayBhdFxuICAgICAgY3AuZXhlY1N5bmMoYHRhciAtemN2ZiAke0pTT04uc3RyaW5naWZ5KHBhdGguam9pbihkdW1wZGlyLCAncHJvamVjdC50YXIuZ3onKSl9ICR7SlNPTi5zdHJpbmdpZnkodGhpcy5zdGF0ZS5wcm9qZWN0Rm9sZGVyKX1gKVxuICAgIH1cbiAgICAvLyBGb3IgY29udmVuaWVuY2UsIHppcCB1cCB0aGUgZW50aXJlIGR1bXAgZm9sZGVyLi4uXG4gICAgY3AuZXhlY1N5bmMoYHRhciAtemN2ZiAke0pTT04uc3RyaW5naWZ5KHBhdGguam9pbihvcy5ob21lZGlyKCksIGBoYWlrdS1kdW1wLSR7dGltZXN0YW1wfS50YXIuZ3pgKSl9ICR7SlNPTi5zdHJpbmdpZnkoZHVtcGRpcil9YClcbiAgfVxuXG4gIHRvZ2dsZURldlRvb2xzICgpIHtcbiAgICBjb25zdCB3aW4gPSByZW1vdGUuZ2V0Q3VycmVudFdpbmRvdygpXG4gICAgaWYgKHdpbi5pc0RldlRvb2xzT3BlbmVkKCkpIHdpbi5jbG9zZURldlRvb2xzKClcbiAgICBlbHNlIHdpbi5vcGVuRGV2VG9vbHMoKVxuICAgIGlmICh0aGlzLnJlZnMuc3RhZ2UpIHRoaXMucmVmcy5zdGFnZS50b2dnbGVEZXZUb29scygpXG4gICAgaWYgKHRoaXMucmVmcy50aW1lbGluZSkgdGhpcy5yZWZzLnRpbWVsaW5lLnRvZ2dsZURldlRvb2xzKClcbiAgfVxuXG4gIGhhbmRsZUNvbnRlbnRQYXN0ZSAobWF5YmVQYXN0ZVJlcXVlc3QpIHtcbiAgICBsZXQgcGFzdGVkVGV4dCA9IGNsaXBib2FyZC5yZWFkVGV4dCgpXG4gICAgaWYgKCFwYXN0ZWRUZXh0KSByZXR1cm4gdm9pZCAoMClcblxuICAgIC8vIFRoZSBkYXRhIG9uIHRoZSBjbGlwYm9hcmQgbWlnaHQgYmUgc2VyaWFsaXplZCBkYXRhLCBzbyB0cnkgdG8gcGFyc2UgaXQgaWYgdGhhdCdzIHRoZSBjYXNlXG4gICAgLy8gVGhlIG1haW4gY2FzZSB3ZSBoYXZlIG5vdyBmb3Igc2VyaWFsaXplZCBkYXRhIGlzIGhhaWt1IGVsZW1lbnRzIGNvcGllZCBmcm9tIHRoZSBzdGFnZVxuICAgIGxldCBwYXN0ZWREYXRhXG4gICAgdHJ5IHtcbiAgICAgIHBhc3RlZERhdGEgPSBKU09OLnBhcnNlKHBhc3RlZFRleHQpXG4gICAgfSBjYXRjaCAoZXhjZXB0aW9uKSB7XG4gICAgICBjb25zb2xlLndhcm4oJ1tjcmVhdG9yXSB1bmFibGUgdG8gcGFyc2UgcGFzdGVkIGRhdGE7IGl0IG1pZ2h0IGJlIHBsYWluIHRleHQnKVxuICAgICAgcGFzdGVkRGF0YSA9IHBhc3RlZFRleHRcbiAgICB9XG5cbiAgICBpZiAoQXJyYXkuaXNBcnJheShwYXN0ZWREYXRhKSkge1xuICAgICAgLy8gVGhpcyBsb29rcyBsaWtlIGEgSGFpa3UgZWxlbWVudCB0aGF0IGhhcyBiZWVuIGNvcGllZCBmcm9tIHRoZSBzdGFnZVxuICAgICAgaWYgKHBhc3RlZERhdGFbMF0gPT09ICdhcHBsaWNhdGlvbi9oYWlrdScgJiYgdHlwZW9mIHBhc3RlZERhdGFbMV0gPT09ICdvYmplY3QnKSB7XG4gICAgICAgIGxldCBwYXN0ZWRFbGVtZW50ID0gcGFzdGVkRGF0YVsxXVxuXG4gICAgICAgIC8vIENvbW1hbmQgdGhlIHZpZXdzIGFuZCBtYXN0ZXIgcHJvY2VzcyB0byBoYW5kbGUgdGhlIGVsZW1lbnQgcGFzdGUgYWN0aW9uXG4gICAgICAgIC8vIFRoZSAncGFzdGVUaGluZycgYWN0aW9uIGlzIGludGVuZGVkIHRvIGJlIGFibGUgdG8gaGFuZGxlIG11bHRpcGxlIGNvbnRlbnQgdHlwZXNcbiAgICAgICAgcmV0dXJuIHRoaXMucHJvcHMud2Vic29ja2V0LnJlcXVlc3QoeyB0eXBlOiAnYWN0aW9uJywgbWV0aG9kOiAncGFzdGVUaGluZycsIHBhcmFtczogW3RoaXMuc3RhdGUucHJvamVjdEZvbGRlciwgcGFzdGVkRWxlbWVudCwgbWF5YmVQYXN0ZVJlcXVlc3QgfHwge31dIH0sIChlcnJvcikgPT4ge1xuICAgICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcilcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNyZWF0ZU5vdGljZSh7XG4gICAgICAgICAgICAgIHR5cGU6ICd3YXJuaW5nJyxcbiAgICAgICAgICAgICAgdGl0bGU6ICdVaCBvaCEnLFxuICAgICAgICAgICAgICBtZXNzYWdlOiAnV2UgY291bGRuXFwndCBwYXN0ZSB0aGF0LiDwn5iiIFBsZWFzZSBjb250YWN0IEhhaWt1IGZvciBzdXBwb3J0LicsXG4gICAgICAgICAgICAgIGNsb3NlVGV4dDogJ09rYXknLFxuICAgICAgICAgICAgICBsaWdodFNjaGVtZTogdHJ1ZVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBUT0RPOiBIYW5kbGUgb3RoZXIgY2FzZXMgd2hlcmUgdGhlIHBhc3RlIGRhdGEgd2FzIGEgc2VyaWFsaXplZCBhcnJheVxuICAgICAgICBjb25zb2xlLndhcm4oJ1tjcmVhdG9yXSBjYW5ub3QgcGFzdGUgdGhpcyBjb250ZW50IHR5cGUgeWV0IChhcnJheSknKVxuICAgICAgICB0aGlzLmNyZWF0ZU5vdGljZSh7XG4gICAgICAgICAgdHlwZTogJ3dhcm5pbmcnLFxuICAgICAgICAgIHRpdGxlOiAnSG1tbScsXG4gICAgICAgICAgbWVzc2FnZTogJ1dlIGRvblxcJ3Qga25vdyBob3cgdG8gcGFzdGUgdGhhdCBjb250ZW50IHlldC4g8J+YsycsXG4gICAgICAgICAgY2xvc2VUZXh0OiAnT2theScsXG4gICAgICAgICAgbGlnaHRTY2hlbWU6IHRydWVcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gQW4gZW1wdHkgc3RyaW5nIGlzIHRyZWF0ZWQgYXMgdGhlIGVxdWl2YWxlbnQgb2Ygbm90aGluZyAoZG9uJ3QgZGlzcGxheSB3YXJuaW5nIGlmIG5vdGhpbmcgdG8gaW5zdGFudGlhdGUpXG4gICAgICBpZiAodHlwZW9mIHBhc3RlZERhdGEgPT09ICdzdHJpbmcnICYmIHBhc3RlZERhdGEubGVuZ3RoID4gMCkge1xuICAgICAgICAvLyBUT0RPOiBIYW5kbGUgdGhlIGNhc2Ugd2hlbiBwbGFpbiB0ZXh0IGhhcyBiZWVuIHBhc3RlZCAtIFNWRywgSFRNTCwgZXRjP1xuICAgICAgICBjb25zb2xlLndhcm4oJ1tjcmVhdG9yXSBjYW5ub3QgcGFzdGUgdGhpcyBjb250ZW50IHR5cGUgeWV0ICh1bmtub3duIHN0cmluZyknKVxuICAgICAgICB0aGlzLmNyZWF0ZU5vdGljZSh7XG4gICAgICAgICAgdHlwZTogJ3dhcm5pbmcnLFxuICAgICAgICAgIHRpdGxlOiAnSG1tbScsXG4gICAgICAgICAgbWVzc2FnZTogJ1dlIGRvblxcJ3Qga25vdyBob3cgdG8gcGFzdGUgdGhhdCBjb250ZW50IHlldC4g8J+YsycsXG4gICAgICAgICAgY2xvc2VUZXh0OiAnT2theScsXG4gICAgICAgICAgbGlnaHRTY2hlbWU6IHRydWVcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBjb21wb25lbnRXaWxsTW91bnQgKCkge1xuICAgIHRoaXMucHJvcHMud2Vic29ja2V0Lm9uKCdicm9hZGNhc3QnLCAobWVzc2FnZSkgPT4ge1xuICAgICAgc3dpdGNoIChtZXNzYWdlLm5hbWUpIHtcbiAgICAgICAgY2FzZSAnZGV2LXRvb2xzOnRvZ2dsZSc6XG4gICAgICAgICAgdGhpcy50b2dnbGVEZXZUb29scygpXG4gICAgICAgICAgYnJlYWtcblxuICAgICAgICBjYXNlICdjcmFzaCc6XG4gICAgICAgICAgaWYgKHByb2Nlc3MuZW52LkhBSUtVX1JFTEVBU0VfRU5WSVJPTk1FTlQgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGRpZFBsdW1iaW5nTm90aWNlQ3Jhc2g6IHRydWUsIGNyYXNoTWVzc2FnZTogbWVzc2FnZSB9KVxuICAgICAgICAgIH1cbiAgICAgICAgICBicmVha1xuXG4gICAgICAgIGNhc2UgJ2N1cnJlbnQtcGFzdGVhYmxlOnJlcXVlc3QtcGFzdGUnOlxuICAgICAgICAgIGNvbnNvbGUuaW5mbygnW2NyZWF0b3JdIGN1cnJlbnQtcGFzdGVhYmxlOnJlcXVlc3QtcGFzdGUnLCBtZXNzYWdlLmRhdGEpXG4gICAgICAgICAgcmV0dXJuIHRoaXMuaGFuZGxlQ29udGVudFBhc3RlKG1lc3NhZ2UuZGF0YSlcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgdGhpcy5lbnZveSA9IG5ldyBFbnZveUNsaWVudCh7XG4gICAgICBwb3J0OiB0aGlzLnByb3BzLmhhaWt1LmVudm95LnBvcnQsXG4gICAgICBob3N0OiB0aGlzLnByb3BzLmhhaWt1LmVudm95Lmhvc3QsXG4gICAgICBXZWJTb2NrZXQ6IHdpbmRvdy5XZWJTb2NrZXRcbiAgICB9KVxuXG4gICAgdGhpcy5lbnZveS5nZXQoJ3RvdXInKS50aGVuKCh0b3VyQ2hhbm5lbCkgPT4ge1xuICAgICAgdGhpcy50b3VyQ2hhbm5lbCA9IHRvdXJDaGFubmVsXG5cbiAgICAgIHRvdXJDaGFubmVsLm9uKCd0b3VyOnJlcXVlc3RFbGVtZW50Q29vcmRpbmF0ZXMnLCB0aGlzLmhhbmRsZUZpbmRFbGVtZW50Q29vcmRpbmF0ZXMpXG5cbiAgICAgIHRvdXJDaGFubmVsLm9uKCd0b3VyOnJlcXVlc3RXZWJ2aWV3Q29vcmRpbmF0ZXMnLCB0aGlzLmhhbmRsZUZpbmRXZWJ2aWV3Q29vcmRpbmF0ZXMpXG5cbiAgICAgIGlwY1JlbmRlcmVyLm9uKCdnbG9iYWwtbWVudTpzdGFydC10b3VyJywgKCkgPT4ge1xuICAgICAgICB0aGlzLnNldERhc2hib2FyZFZpc2liaWxpdHkodHJ1ZSlcblxuICAgICAgICAvLyBQdXQgaXQgYXQgdGhlIGJvdHRvbSBvZiB0aGUgZXZlbnQgbG9vcFxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICB0b3VyQ2hhbm5lbC5zdGFydCh0cnVlKVxuICAgICAgICB9KVxuICAgICAgfSlcblxuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIGxvZGFzaC50aHJvdHRsZSgoKSA9PiB7XG4gICAgICAgIC8vIGlmICh0b3VyQ2hhbm5lbC5pc1RvdXJBY3RpdmUoKSkge1xuICAgICAgICB0b3VyQ2hhbm5lbC5ub3RpZnlTY3JlZW5SZXNpemUoKVxuICAgICAgICAvLyB9XG4gICAgICB9KSwgMzAwKVxuICAgIH0pXG5cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdwYXN0ZScsIChwYXN0ZUV2ZW50KSA9PiB7XG4gICAgICBjb25zb2xlLmluZm8oJ1tjcmVhdG9yXSBwYXN0ZSBoZWFyZCcpXG4gICAgICBsZXQgdGFnbmFtZSA9IHBhc3RlRXZlbnQudGFyZ2V0LnRhZ05hbWUudG9Mb3dlckNhc2UoKVxuICAgICAgaWYgKHRhZ25hbWUgPT09ICdpbnB1dCcgfHwgdGFnbmFtZSA9PT0gJ3RleHRhcmVhJykge1xuICAgICAgICAvLyBEbyBub3RoaW5nOyBsZXQgaW5wdXQgZmllbGRzIGFuZCBzby1vbiBiZSBoYW5kbGVkIG5vcm1hbGx5XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBPdGhlcndpc2UsIGFzc3VtZSB3ZSBtaWdodCBuZWVkIHRvIGhhbmRsZSB0aGlzIHBhc3RlIGV2ZW50IHNwZWNpYWxseVxuICAgICAgICBwYXN0ZUV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgdGhpcy5oYW5kbGVDb250ZW50UGFzdGUoKVxuICAgICAgfVxuICAgIH0pXG5cbiAgICB0aGlzLnByb3BzLndlYnNvY2tldC5vbignbWV0aG9kJywgKG1ldGhvZCwgcGFyYW1zLCBjYikgPT4ge1xuICAgICAgY29uc29sZS5pbmZvKCdbY3JlYXRvcl0gbWV0aG9kIGZyb20gcGx1bWJpbmc6JywgbWV0aG9kLCBwYXJhbXMpXG4gICAgICAvLyBuby1vcDsgY3JlYXRvciBkb2Vzbid0IGN1cnJlbnRseSByZWNlaXZlIGFueSBtZXRob2RzIGZyb20gdGhlIG90aGVyIHZpZXdzLCBidXQgd2UgbmVlZCB0aGlzXG4gICAgICAvLyBjYWxsYmFjayB0byBiZSBjYWxsZWQgdG8gYWxsb3cgdGhlIGFjdGlvbiBjaGFpbiBpbiBwbHVtYmluZyB0byBwcm9jZWVkXG4gICAgICByZXR1cm4gY2IoKVxuICAgIH0pXG5cbiAgICB0aGlzLnByb3BzLndlYnNvY2tldC5vbignb3BlbicsICgpID0+IHtcbiAgICAgIHRoaXMucHJvcHMud2Vic29ja2V0LnJlcXVlc3QoeyBtZXRob2Q6ICdpc1VzZXJBdXRoZW50aWNhdGVkJywgcGFyYW1zOiBbXSB9LCAoZXJyb3IsIGF1dGhBbnN3ZXIpID0+IHtcbiAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcilcbiAgICAgICAgICByZXR1cm4gdGhpcy5jcmVhdGVOb3RpY2Uoe1xuICAgICAgICAgICAgdHlwZTogJ2Vycm9yJyxcbiAgICAgICAgICAgIHRpdGxlOiAnT2ggbm8hJyxcbiAgICAgICAgICAgIG1lc3NhZ2U6ICdXZSBoYWQgYSBwcm9ibGVtIGFjY2Vzc2luZyB5b3VyIGFjY291bnQuIPCfmKIgUGxlYXNlIHRyeSBjbG9zaW5nIGFuZCByZW9wZW5pbmcgdGhlIGFwcGxpY2F0aW9uLiBJZiB5b3Ugc3RpbGwgc2VlIHRoaXMgbWVzc2FnZSwgY29udGFjdCBIYWlrdSBmb3Igc3VwcG9ydC4nLFxuICAgICAgICAgICAgY2xvc2VUZXh0OiAnT2theScsXG4gICAgICAgICAgICBsaWdodFNjaGVtZTogdHJ1ZVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cblxuICAgICAgICBtaXhwYW5lbC5tZXJnZVRvUGF5bG9hZCh7IGRpc3RpbmN0X2lkOiBhdXRoQW5zd2VyICYmIGF1dGhBbnN3ZXIudXNlcm5hbWUgfSlcbiAgICAgICAgbWl4cGFuZWwuaGFpa3VUcmFjaygnY3JlYXRvcjpvcGVuZWQnKVxuXG4gICAgICAgIC8vIERlbGF5IHNvIHRoZSBkZWZhdWx0IHN0YXJ0dXAgc2NyZWVuIGRvZXNuJ3QganVzdCBmbGFzaCB0aGVuIGdvIGF3YXlcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICByZWFkeUZvckF1dGg6IHRydWUsXG4gICAgICAgICAgICBhdXRoVG9rZW46IGF1dGhBbnN3ZXIgJiYgYXV0aEFuc3dlci5hdXRoVG9rZW4sXG4gICAgICAgICAgICBvcmdhbml6YXRpb25OYW1lOiBhdXRoQW5zd2VyICYmIGF1dGhBbnN3ZXIub3JnYW5pemF0aW9uTmFtZSxcbiAgICAgICAgICAgIHVzZXJuYW1lOiBhdXRoQW5zd2VyICYmIGF1dGhBbnN3ZXIudXNlcm5hbWUsXG4gICAgICAgICAgICBpc1VzZXJBdXRoZW50aWNhdGVkOiBhdXRoQW5zd2VyICYmIGF1dGhBbnN3ZXIuaXNBdXRoZWRcbiAgICAgICAgICB9KVxuICAgICAgICAgIGlmICh0aGlzLnByb3BzLmZvbGRlcikge1xuICAgICAgICAgICAgLy8gTGF1bmNoIGZvbGRlciBkaXJlY3RseSAtIGkuZS4gYWxsb3cgYSAnc3VibCcgbGlrZSBleHBlcmllbmNlIHdpdGhvdXQgaGF2aW5nIHRvIGdvXG4gICAgICAgICAgICAvLyB0aHJvdWdoIHRoZSBwcm9qZWN0cyBpbmRleFxuICAgICAgICAgICAgcmV0dXJuIHRoaXMubGF1bmNoRm9sZGVyKG51bGwsIHRoaXMucHJvcHMuZm9sZGVyLCAoZXJyb3IpID0+IHtcbiAgICAgICAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcilcbiAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgZm9sZGVyTG9hZGluZ0Vycm9yOiBlcnJvciB9KVxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNyZWF0ZU5vdGljZSh7XG4gICAgICAgICAgICAgICAgICB0eXBlOiAnZXJyb3InLFxuICAgICAgICAgICAgICAgICAgdGl0bGU6ICdPaCBubyEnLFxuICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ1dlIHdlcmUgdW5hYmxlIHRvIG9wZW4gdGhlIGZvbGRlci4g8J+YoiBQbGVhc2UgY2xvc2UgYW5kIHJlb3BlbiB0aGUgYXBwbGljYXRpb24gYW5kIHRyeSBhZ2Fpbi4gSWYgeW91IHN0aWxsIHNlZSB0aGlzIG1lc3NhZ2UsIGNvbnRhY3QgSGFpa3UgZm9yIHN1cHBvcnQuJyxcbiAgICAgICAgICAgICAgICAgIGNsb3NlVGV4dDogJ09rYXknLFxuICAgICAgICAgICAgICAgICAgbGlnaHRTY2hlbWU6IHRydWVcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH1cbiAgICAgICAgfSwgMTAwMClcbiAgICAgIH0pXG4gICAgfSlcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50ICgpIHtcbiAgICB0aGlzLnRvdXJDaGFubmVsLm9mZigndG91cjpyZXF1ZXN0RWxlbWVudENvb3JkaW5hdGVzJywgdGhpcy5oYW5kbGVGaW5kRWxlbWVudENvb3JkaW5hdGVzKVxuICAgIHRoaXMudG91ckNoYW5uZWwub2ZmKCd0b3VyOnJlcXVlc3RXZWJ2aWV3Q29vcmRpbmF0ZXMnLCB0aGlzLmhhbmRsZUZpbmRXZWJ2aWV3Q29vcmRpbmF0ZXMpXG4gIH1cblxuICBoYW5kbGVGaW5kRWxlbWVudENvb3JkaW5hdGVzICh7IHNlbGVjdG9yLCB3ZWJ2aWV3IH0pIHtcbiAgICBpZiAod2VidmlldyAhPT0gJ2NyZWF0b3InKSB7IHJldHVybiB9XG5cbiAgICB0cnkge1xuICAgICAgLy8gVE9ETzogZmluZCBpZiB0aGVyZSBpcyBhIGJldHRlciBzb2x1dGlvbiB0byB0aGlzIHNjYXBlIGhhdGNoXG4gICAgICBsZXQgZWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpXG4gICAgICBsZXQgeyB0b3AsIGxlZnQgfSA9IGVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcblxuICAgICAgdGhpcy50b3VyQ2hhbm5lbC5yZWNlaXZlRWxlbWVudENvb3JkaW5hdGVzKCdjcmVhdG9yJywgeyB0b3AsIGxlZnQgfSlcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5lcnJvcihgW2NyZWF0b3JdIGVycm9yIGZldGNoaW5nICR7c2VsZWN0b3J9IGluIHdlYnZpZXcgJHt3ZWJ2aWV3fWApXG4gICAgfVxuICB9XG5cbiAgaGFuZGxlRmluZFdlYnZpZXdDb29yZGluYXRlcyAoKSB7XG4gICAgdGhpcy50b3VyQ2hhbm5lbC5yZWNlaXZlV2Vidmlld0Nvb3JkaW5hdGVzKCdjcmVhdG9yJywgeyB0b3A6IDAsIGxlZnQ6IDAgfSlcbiAgfVxuXG4gIGhhbmRsZVBhbmVSZXNpemUgKCkge1xuICAgIC8vIHRoaXMubGF5b3V0LmVtaXQoJ3Jlc2l6ZScpXG4gIH1cblxuICByZW5kZXJOb3RpZmljYXRpb25zIChjb250ZW50LCBpKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxUb2FzdFxuICAgICAgICB0b2FzdFR5cGU9e2NvbnRlbnQudHlwZX1cbiAgICAgICAgdG9hc3RUaXRsZT17Y29udGVudC50aXRsZX1cbiAgICAgICAgdG9hc3RNZXNzYWdlPXtjb250ZW50Lm1lc3NhZ2V9XG4gICAgICAgIGNsb3NlVGV4dD17Y29udGVudC5jbG9zZVRleHR9XG4gICAgICAgIGtleT17aSArIGNvbnRlbnQudGl0bGV9XG4gICAgICAgIG15S2V5PXtpfVxuICAgICAgICByZW1vdmVOb3RpY2U9e3RoaXMucmVtb3ZlTm90aWNlfVxuICAgICAgICBsaWdodFNjaGVtZT17Y29udGVudC5saWdodFNjaGVtZX0gLz5cbiAgICApXG4gIH1cblxuICBzZXREYXNoYm9hcmRWaXNpYmlsaXR5IChkYXNoYm9hcmRWaXNpYmxlKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7ZGFzaGJvYXJkVmlzaWJsZX0pXG4gIH1cblxuICBzd2l0Y2hBY3RpdmVOYXYgKGFjdGl2ZU5hdikge1xuICAgIHRoaXMuc2V0U3RhdGUoe2FjdGl2ZU5hdn0pXG5cbiAgICBpZiAoYWN0aXZlTmF2ID09PSAnc3RhdGVfaW5zcGVjdG9yJykge1xuICAgICAgdGhpcy50b3VyQ2hhbm5lbC5uZXh0KClcbiAgICB9XG4gIH1cblxuICBhdXRoZW50aWNhdGVVc2VyICh1c2VybmFtZSwgcGFzc3dvcmQsIGNiKSB7XG4gICAgcmV0dXJuIHRoaXMucHJvcHMud2Vic29ja2V0LnJlcXVlc3QoeyBtZXRob2Q6ICdhdXRoZW50aWNhdGVVc2VyJywgcGFyYW1zOiBbdXNlcm5hbWUsIHBhc3N3b3JkXSB9LCAoZXJyb3IsIGF1dGhBbnN3ZXIpID0+IHtcbiAgICAgIGlmIChlcnJvcikgcmV0dXJuIGNiKGVycm9yKVxuICAgICAgbWl4cGFuZWwubWVyZ2VUb1BheWxvYWQoeyBkaXN0aW5jdF9pZDogdXNlcm5hbWUgfSlcbiAgICAgIG1peHBhbmVsLmhhaWt1VHJhY2soJ2NyZWF0b3I6dXNlci1hdXRoZW50aWNhdGVkJywgeyB1c2VybmFtZSB9KVxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIHVzZXJuYW1lLFxuICAgICAgICBwYXNzd29yZCxcbiAgICAgICAgYXV0aFRva2VuOiBhdXRoQW5zd2VyICYmIGF1dGhBbnN3ZXIuYXV0aFRva2VuLFxuICAgICAgICBvcmdhbml6YXRpb25OYW1lOiBhdXRoQW5zd2VyICYmIGF1dGhBbnN3ZXIub3JnYW5pemF0aW9uTmFtZSxcbiAgICAgICAgaXNVc2VyQXV0aGVudGljYXRlZDogYXV0aEFuc3dlciAmJiBhdXRoQW5zd2VyLmlzQXV0aGVkXG4gICAgICB9KVxuICAgICAgcmV0dXJuIGNiKG51bGwsIGF1dGhBbnN3ZXIpXG4gICAgfSlcbiAgfVxuXG4gIGF1dGhlbnRpY2F0aW9uQ29tcGxldGUgKCkge1xuICAgIHJldHVybiB0aGlzLnNldFN0YXRlKHsgaXNVc2VyQXV0aGVudGljYXRlZDogdHJ1ZSB9KVxuICB9XG5cbiAgcmVjZWl2ZVByb2plY3RJbmZvIChwcm9qZWN0SW5mbykge1xuICAgIC8vIE5PLU9QXG4gIH1cblxuICBsb2FkUHJvamVjdHMgKGNiKSB7XG4gICAgcmV0dXJuIHRoaXMucHJvcHMud2Vic29ja2V0LnJlcXVlc3QoeyBtZXRob2Q6ICdsaXN0UHJvamVjdHMnLCBwYXJhbXM6IFtdIH0sIChlcnJvciwgcHJvamVjdHNMaXN0KSA9PiB7XG4gICAgICBpZiAoZXJyb3IpIHJldHVybiBjYihlcnJvcilcbiAgICAgIHRoaXMuc2V0U3RhdGUoeyBwcm9qZWN0c0xpc3QgfSlcbiAgICAgIHJldHVybiBjYihudWxsLCBwcm9qZWN0c0xpc3QpXG4gICAgfSlcbiAgfVxuXG4gIGxhdW5jaFByb2plY3QgKHByb2plY3ROYW1lLCBwcm9qZWN0T2JqZWN0LCBjYikge1xuICAgIHByb2plY3RPYmplY3QgPSB7XG4gICAgICBza2lwQ29udGVudENyZWF0aW9uOiB0cnVlLCAvLyBWRVJZIElNUE9SVEFOVCAtIGlmIG5vdCBzZXQgdG8gdHJ1ZSwgd2UgY2FuIGVuZCB1cCBpbiBhIHNpdHVhdGlvbiB3aGVyZSB3ZSBvdmVyd3JpdGUgZnJlc2hseSBjbG9uZWQgY29udGVudCBmcm9tIHRoZSByZW1vdGUhXG4gICAgICBwcm9qZWN0c0hvbWU6IHByb2plY3RPYmplY3QucHJvamVjdHNIb21lLFxuICAgICAgcHJvamVjdFBhdGg6IHByb2plY3RPYmplY3QucHJvamVjdFBhdGgsXG4gICAgICBvcmdhbml6YXRpb25OYW1lOiB0aGlzLnN0YXRlLm9yZ2FuaXphdGlvbk5hbWUsXG4gICAgICBhdXRob3JOYW1lOiB0aGlzLnN0YXRlLnVzZXJuYW1lLFxuICAgICAgcHJvamVjdE5hbWUgLy8gSGF2ZSB0byBzZXQgdGhpcyBoZXJlLCBiZWNhdXNlIHdlIHBhc3MgdGhpcyB3aG9sZSBvYmplY3QgdG8gU3RhdGVUaXRsZUJhciwgd2hpY2ggbmVlZHMgdGhpcyB0byBwcm9wZXJseSBjYWxsIHNhdmVQcm9qZWN0XG4gICAgfVxuXG4gICAgbWl4cGFuZWwuaGFpa3VUcmFjaygnY3JlYXRvcjpwcm9qZWN0OmxhdW5jaGluZycsIHtcbiAgICAgIHVzZXJuYW1lOiB0aGlzLnN0YXRlLnVzZXJuYW1lLFxuICAgICAgcHJvamVjdDogcHJvamVjdE5hbWUsXG4gICAgICBvcmdhbml6YXRpb246IHRoaXMuc3RhdGUub3JnYW5pemF0aW9uTmFtZVxuICAgIH0pXG5cbiAgICByZXR1cm4gdGhpcy5wcm9wcy53ZWJzb2NrZXQucmVxdWVzdCh7IG1ldGhvZDogJ2luaXRpYWxpemVQcm9qZWN0JywgcGFyYW1zOiBbcHJvamVjdE5hbWUsIHByb2plY3RPYmplY3QsIHRoaXMuc3RhdGUudXNlcm5hbWUsIHRoaXMuc3RhdGUucGFzc3dvcmRdIH0sIChlcnIsIHByb2plY3RGb2xkZXIpID0+IHtcbiAgICAgIGlmIChlcnIpIHJldHVybiBjYihlcnIpXG5cbiAgICAgIHJldHVybiB0aGlzLnByb3BzLndlYnNvY2tldC5yZXF1ZXN0KHsgbWV0aG9kOiAnc3RhcnRQcm9qZWN0JywgcGFyYW1zOiBbcHJvamVjdE5hbWUsIHByb2plY3RGb2xkZXJdIH0sIChlcnIsIGFwcGxpY2F0aW9uSW1hZ2UpID0+IHtcbiAgICAgICAgaWYgKGVycikgcmV0dXJuIGNiKGVycilcblxuICAgICAgICAvLyBBc3NpZ24sIG5vdCBtZXJnZSwgc2luY2Ugd2UgZG9uJ3Qgd2FudCB0byBjbG9iYmVyIGFueSB2YXJpYWJsZXMgYWxyZWFkeSBzZXQsIGxpa2UgcHJvamVjdCBuYW1lXG4gICAgICAgIGxvZGFzaC5hc3NpZ24ocHJvamVjdE9iamVjdCwgYXBwbGljYXRpb25JbWFnZS5wcm9qZWN0KVxuXG4gICAgICAgIG1peHBhbmVsLmhhaWt1VHJhY2soJ2NyZWF0b3I6cHJvamVjdDpsYXVuY2hlZCcsIHtcbiAgICAgICAgICB1c2VybmFtZTogdGhpcy5zdGF0ZS51c2VybmFtZSxcbiAgICAgICAgICBwcm9qZWN0OiBwcm9qZWN0TmFtZSxcbiAgICAgICAgICBvcmdhbml6YXRpb246IHRoaXMuc3RhdGUub3JnYW5pemF0aW9uTmFtZVxuICAgICAgICB9KVxuXG4gICAgICAgIC8vIE5vdyBoYWNraWx5IGNoYW5nZSBzb21lIHBvaW50ZXJzIHNvIHdlJ3JlIHJlZmVycmluZyB0byB0aGUgY29ycmVjdCBwbGFjZVxuICAgICAgICB0aGlzLnByb3BzLndlYnNvY2tldC5mb2xkZXIgPSBwcm9qZWN0Rm9sZGVyIC8vIERvIG5vdCByZW1vdmUgdGhpcyBuZWNlc3NhcnkgaGFjayBwbHpcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHByb2plY3RGb2xkZXIsIGFwcGxpY2F0aW9uSW1hZ2UsIHByb2plY3RPYmplY3QsIHByb2plY3ROYW1lLCBkYXNoYm9hcmRWaXNpYmxlOiBmYWxzZSB9KVxuXG4gICAgICAgIHJldHVybiBjYigpXG4gICAgICB9KVxuICAgIH0pXG4gIH1cblxuICBsYXVuY2hGb2xkZXIgKG1heWJlUHJvamVjdE5hbWUsIHByb2plY3RGb2xkZXIsIGNiKSB7XG4gICAgbWl4cGFuZWwuaGFpa3VUcmFjaygnY3JlYXRvcjpmb2xkZXI6bGF1bmNoaW5nJywge1xuICAgICAgdXNlcm5hbWU6IHRoaXMuc3RhdGUudXNlcm5hbWUsXG4gICAgICBwcm9qZWN0OiBtYXliZVByb2plY3ROYW1lXG4gICAgfSlcblxuICAgIC8vIFRoZSBsYXVuY2hQcm9qZWN0IG1ldGhvZCBoYW5kbGVzIHRoZSBwZXJmb3JtRm9sZGVyUG9pbnRlckNoYW5nZVxuICAgIHJldHVybiB0aGlzLmxhdW5jaFByb2plY3QobWF5YmVQcm9qZWN0TmFtZSwgeyBwcm9qZWN0UGF0aDogcHJvamVjdEZvbGRlciB9LCBjYilcbiAgfVxuXG4gIHJlbW92ZU5vdGljZSAoaW5kZXgsIGlkKSB7XG4gICAgY29uc3Qgbm90aWNlcyA9IHRoaXMuc3RhdGUubm90aWNlc1xuICAgIGlmIChpbmRleCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgbm90aWNlczogWy4uLm5vdGljZXMuc2xpY2UoMCwgaW5kZXgpLCAuLi5ub3RpY2VzLnNsaWNlKGluZGV4ICsgMSldXG4gICAgICB9KVxuICAgIH0gZWxzZSBpZiAoaWQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgLy8gSGFja2Fyb29cbiAgICAgIGxvZGFzaC5lYWNoKG5vdGljZXMsIChub3RpY2UsIGluZGV4KSA9PiB7XG4gICAgICAgIGlmIChub3RpY2UuaWQgPT09IGlkKSB0aGlzLnJlbW92ZU5vdGljZShpbmRleClcbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgY3JlYXRlTm90aWNlIChub3RpY2UpIHtcbiAgICAvKiBFeHBlY3RzIHRoZSBvYmplY3Q6XG4gICAgeyB0eXBlOiBzdHJpbmcgKGluZm8sIHN1Y2Nlc3MsIGRhbmdlciAob3IgZXJyb3IpLCB3YXJuaW5nKVxuICAgICAgdGl0bGU6IHN0cmluZyxcbiAgICAgIG1lc3NhZ2U6IHN0cmluZyxcbiAgICAgIGNsb3NlVGV4dDogc3RyaW5nIChvcHRpb25hbCwgZGVmYXVsdHMgdG8gJ2Nsb3NlJylcbiAgICAgIGxpZ2h0U2NoZW1lOiBib29sIChvcHRpb25hbCwgZGVmYXVsdHMgdG8gZGFyaylcbiAgICB9ICovXG5cbiAgICBub3RpY2UuaWQgPSBNYXRoLnJhbmRvbSgpICsgJydcblxuICAgIGNvbnN0IG5vdGljZXMgPSB0aGlzLnN0YXRlLm5vdGljZXNcbiAgICBsZXQgcmVwbGFjZWRFeGlzdGluZyA9IGZhbHNlXG5cbiAgICBub3RpY2VzLmZvckVhY2goKG4sIGkpID0+IHtcbiAgICAgIGlmIChuLm1lc3NhZ2UgPT09IG5vdGljZS5tZXNzYWdlKSB7XG4gICAgICAgIG5vdGljZXMuc3BsaWNlKGksIDEpXG4gICAgICAgIHJlcGxhY2VkRXhpc3RpbmcgPSB0cnVlXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyBub3RpY2VzIH0sICgpID0+IHtcbiAgICAgICAgICBub3RpY2VzLnVuc2hpZnQobm90aWNlKVxuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBub3RpY2VzIH0pXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfSlcblxuICAgIGlmICghcmVwbGFjZWRFeGlzdGluZykge1xuICAgICAgbm90aWNlcy51bnNoaWZ0KG5vdGljZSlcbiAgICAgIHRoaXMuc2V0U3RhdGUoeyBub3RpY2VzIH0pXG4gICAgfVxuXG4gICAgcmV0dXJuIG5vdGljZVxuICB9XG5cbiAgb25MaWJyYXJ5RHJhZ0VuZCAoZHJhZ0VuZE5hdGl2ZUV2ZW50LCBsaWJyYXJ5SXRlbUluZm8pIHtcbiAgICB0aGlzLnNldFN0YXRlKHsgbGlicmFyeUl0ZW1EcmFnZ2luZzogbnVsbCB9KVxuICAgIGlmIChsaWJyYXJ5SXRlbUluZm8gJiYgbGlicmFyeUl0ZW1JbmZvLnByZXZpZXcpIHtcbiAgICAgIHRoaXMucmVmcy5zdGFnZS5oYW5kbGVEcm9wKGxpYnJhcnlJdGVtSW5mbywgdGhpcy5fbGFzdE1vdXNlWCwgdGhpcy5fbGFzdE1vdXNlWSlcbiAgICB9XG4gIH1cblxuICBvbkxpYnJhcnlEcmFnU3RhcnQgKGRyYWdTdGFydE5hdGl2ZUV2ZW50LCBsaWJyYXJ5SXRlbUluZm8pIHtcbiAgICB0aGlzLnNldFN0YXRlKHsgbGlicmFyeUl0ZW1EcmFnZ2luZzogbGlicmFyeUl0ZW1JbmZvIH0pXG4gIH1cblxuICByZW5kZXJTdGFydHVwRGVmYXVsdFNjcmVlbiAoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgc3R5bGU9e3sgcG9zaXRpb246ICdhYnNvbHV0ZScsIHdpZHRoOiAnMTAwJScsIGhlaWdodDogJzEwMCUnIH19PlxuICAgICAgICA8UmVhY3RDU1NUcmFuc2l0aW9uR3JvdXBcbiAgICAgICAgICB0cmFuc2l0aW9uTmFtZT0ndG9hc3QnXG4gICAgICAgICAgdHJhbnNpdGlvbkVudGVyVGltZW91dD17NTAwfVxuICAgICAgICAgIHRyYW5zaXRpb25MZWF2ZVRpbWVvdXQ9ezMwMH0+XG4gICAgICAgICAgPGRpdiBzdHlsZT17e3Bvc2l0aW9uOiAnYWJzb2x1dGUnLCByaWdodDogMCwgdG9wOiAwLCB3aWR0aDogMzAwfX0+XG4gICAgICAgICAgICB7bG9kYXNoLm1hcCh0aGlzLnN0YXRlLm5vdGljZXMsIHRoaXMucmVuZGVyTm90aWZpY2F0aW9ucyl9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvUmVhY3RDU1NUcmFuc2l0aW9uR3JvdXA+XG4gICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ3RhYmxlJywgd2lkdGg6ICcxMDAlJywgaGVpZ2h0OiAnMTAwJScsIHBvc2l0aW9uOiAnYWJzb2x1dGUnLCB0b3A6IDAsIGxlZnQ6IDAgfX0+XG4gICAgICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAndGFibGUtY2VsbCcsIHdpZHRoOiAnMTAwJScsIGhlaWdodDogJzEwMCUnLCB2ZXJ0aWNhbEFsaWduOiAnbWlkZGxlJywgdGV4dEFsaWduOiAnY2VudGVyJyB9fT5cbiAgICAgICAgICAgIDxzdmcgd2lkdGg9JzE3MHB4JyBoZWlnaHQ9JzIyMXB4JyB2aWV3Qm94PScwIDAgMTcwIDIyMScgdmVyc2lvbj0nMS4xJz5cbiAgICAgICAgICAgICAgPGcgaWQ9J1BhZ2UtMScgc3Ryb2tlPSdub25lJyBzdHJva2VXaWR0aD0nMScgZmlsbD0nbm9uZScgZmlsbFJ1bGU9J2V2ZW5vZGQnPlxuICAgICAgICAgICAgICAgIDxnIGlkPSdPdXRsaW5lZCcgdHJhbnNmb3JtPSd0cmFuc2xhdGUoLTIxMS4wMDAwMDAsIC0xMTQuMDAwMDAwKScgZmlsbFJ1bGU9J25vbnplcm8nIGZpbGw9JyNGQUZDRkQnPlxuICAgICAgICAgICAgICAgICAgPGcgaWQ9J291dGxpbmVkLWxvZ28nIHRyYW5zZm9ybT0ndHJhbnNsYXRlKDIxMS4wMDAwMDAsIDExMy4wMDAwMDApJz5cbiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0nTTQ3LjUsMTUyLjc5ODgyMyBMMjYuMzgyMzQzMiwxNDMuOTU0Njc2IEMyNC41OTkzOTQxLDE0My4yMDc5NzEgMjMuNzU5MzUyNCwxNDEuMTU3MjgxIDI0LjUwNjA1NzYsMTM5LjM3NDMzMiBDMjUuMjUyNzYyOCwxMzcuNTkxMzgzIDI3LjMwMzQ1MjcsMTM2Ljc1MTM0MSAyOS4wODY0MDE4LDEzNy40OTgwNDYgTDExNy43ODAwNTgsMTc0LjY0NDU2IEwxMjAuOTkwMDIxLDE3Ni4wODkwNzQgQzEyMi40ODY4MTQsMTc2Ljc2MjY0NSAxMjMuMjc5MzA0LDE3OC4zNTgyNTEgMTIyLjk5ODY5OCwxNzkuOTAzNTk4IEMxMjIuOTk5NTY0LDE3OS45MzU2MjYgMTIzLDE3OS45Njc3NjIgMTIzLDE4MCBMMTIzLDIwNS42Mzk3MjIgTDEzOC41MTA3MTYsMjExLjkxMDAxMSBMMTQzLjM2ODQyMSwyMTMuODczNzY0IEwxNjIuODMzMzMzLDIwNi4wMDQ5NyBMMTYyLjgzMzMzMywxNi4yOTI5MDI1IEwxNDMsOC4yNzUxNzIwNCBMMTIyLjgzMzMzMywxNi40Mjc2NTQzIEwxMjIuODMzMzMzLDUzLjYwMTMyOTUgQzEyMi44MzQyMTgsNTMuNjQ2NjQ4OSAxMjIuODM0MjE1LDUzLjY5MTkwMTUgMTIyLjgzMzMzMyw1My43MzcwNjM0IEwxMjIuODMzMzMzLDU0IEMxMjIuODMzMzMzLDU1LjkzMjk5NjYgMTIxLjI2NjMzLDU3LjUgMTE5LjMzMzMzMyw1Ny41IEMxMTkuMjg4NDMsNTcuNSAxMTkuMjQzNzI0LDU3LjQ5OTE1NDQgMTE5LjE5OTIzLDU3LjQ5NzQ3ODIgTDUzLjMwNzYzOCw4NC4wMzcxNDkgQzUxLjUxNDYxODMsODQuNzU5MzM3NSA0OS40NzU2MzkyLDgzLjg5MTI1NzMgNDguNzUzNDUwNiw4Mi4wOTgyMzc2IEM0OC4wMzEyNjIxLDgwLjMwNTIxNzkgNDguODk5MzQyMyw3OC4yNjYyMzg4IDUwLjY5MjM2Miw3Ny41NDQwNTAyIEwxMTUuODMzMzMzLDUxLjMwNjcxMjkgTDExNS44MzMzMzMsMTQuNDk3NDIyNyBDMTE1LjgzMzMzMywxNC4wMTQzMTc4IDExNS45MzEyMTMsMTMuNTU0MDczOSAxMTYuMTA4MjIyLDEzLjEzNTQzOTkgQzExNi4zNzQ1MzksMTIuMDk0MTI5MiAxMTcuMTE1MzI2LDExLjE4ODg0NDkgMTE4LjE4ODIzOCwxMC43NTUxMTQ4IEwxNDEuNjg0MTg2LDEuMjU2NzUyNyBDMTQyLjA5MTMxNywxLjA5MTUyOTM2IDE0Mi41Mjk1OSwxLjAwMjQwNDY3IDE0Mi45NzU5MzcsMC45OTkxNjQ3MjMgQzE0My40NzA0MSwxLjAwMjQwNDY3IDE0My45MDg2ODMsMS4wOTE1MjkzNiAxNDQuMzE1ODE0LDEuMjU2NzUyNyBMMTY3LjgxMTc2MiwxMC43NTUxMTQ4IEMxNjkuNTIyOTY4LDExLjQ0Njg3OSAxNzAuMzg5MzI4LDEzLjMzODE2NTkgMTY5LjgzMzMzMywxNS4wNjc3MDY4IEwxNjkuODMzMzMzLDIwOCBDMTY5LjgzMzMzMywyMDguODI2MzA0IDE2OS41NDY5OSwyMDkuNTg1NzI4IDE2OS4wNjgxMTgsMjEwLjE4NDQ1OSBDMTY4LjY5MzcwMywyMTAuODY3Mzc4IDE2OC4wOTAxMzMsMjExLjQzMDIyNCAxNjcuMzExNzYyLDIxMS43NDQ4ODUgTDE0NC41MTc2NDUsMjIwLjk1OTUyOCBDMTQzLjMzMjU0MiwyMjEuNDM4NjEzIDE0Mi4wMzg5OTUsMjIxLjIyMjM5NyAxNDEuMDg5MTc5LDIyMC41MDI3MTIgTDEzNS44ODcxOTIsMjE4LjM5OTc4MiBMMTE5LjQ2MTU5NSwyMTEuNzU5NjQ3IEMxMTcuNTQ2MjksMjExLjczOTA1NSAxMTYsMjEwLjE4MDAzMiAxMTYsMjA4LjI1OTg1MyBMMTE2LDIwOC4wNzkxMSBDMTE1Ljk5ODc2NywyMDguMDI1NzA4IDExNS45OTg3NjEsMjA3Ljk3MjE3OCAxMTYsMjA3LjkxODU1OCBMMTE2LDE4MS41MTg3NDggTDExNC45OTE3MjcsMTgxLjA2NDU4OSBMNTQuNSwxNTUuNzMwNDQ3IEw1NC41LDIwNi45OTgyNzMgQzU1LjEzNDE0NjgsMjA4LjY1ODI1NiA1NC40MTk1MzE1LDIxMC41MTI5MTUgNTIuODc5NjY0NSwyMTEuMzMzMzMzIEM1Mi41NTQ1NTQ2LDIxMS41NDA3MDkgNTIuMTkyOTA0LDIxMS42OTU4NjkgNTEuODA2NTI5NCwyMTEuNzg2OTk3IEwyOS43ODY3Mzc1LDIyMC42NTA2NTUgQzI4LjgyNTI1MzUsMjIxLjQ3ODc1OCAyNy40NDU3MDA1LDIyMS43NTMyMjEgMjYuMTg4MjM3OSwyMjEuMjQ0ODg1IEwyMC4zODcxOTIxLDIxOC44OTk3ODIgTDMuMzA2Mjc3ODMsMjExLjk5NDczMSBDMS40NjMzODE4OSwyMTEuODk0MTkyIC0yLjYwODM1OTk1ZS0xNiwyMTAuMzY3OTkyIDAsMjA4LjUgTDIuNzA4OTQ0MThlLTE0LDE0LjQ5NzQyMjcgQzIuNzI0MjQ1ZS0xNCwxMy40MDE2NDU4IDAuNTAzNTYwOTQ3LDEyLjQyMzQ4MTggMS4yOTE4OTY2OSwxMS43ODE3MTcgQzEuNjUxNzEwMTQsMTEuMzQxNjUwOSAyLjEyNDA1NjIyLDEwLjk4MzE4ODIgMi42ODgyMzc4OSwxMC43NTUxMTQ4IEwyNi4xODQxODYyLDEuMjU2NzUyNyBDMjYuNTkxMzE3MiwxLjA5MTUyOTM2IDI3LjAyOTU4OTgsMS4wMDI0MDQ2NyAyNy40NzU5MzY3LDAuOTk5MTY0NzIzIEMyNy45NzA0MTAyLDEuMDAyNDA0NjcgMjguNDA4NjgyOCwxLjA5MTUyOTM2IDI4LjgxNTgxMzgsMS4yNTY3NTI3IEw1Mi4zMTE3NjIxLDEwLjc1NTExNDggQzU0LjEwMzg2MjcsMTEuNDc5NTgxIDU0Ljk2OTM1MTQsMTMuNTE5NjYxNSA1NC4yNDQ4ODUyLDE1LjMxMTc2MjEgQzUzLjUyMDQxOSwxNy4xMDM4NjI3IDUxLjQ4MDMzODUsMTcuOTY5MzUxNCA0OS42ODgyMzc5LDE3LjI0NDg4NTIgTDI3LjUsOC4yNzUxNzIwNCBMNywxNi41NjI0MDYxIEw3LDIwNS45Mzc1OTQgTDIzLjAxMDcxNjQsMjEyLjQxMDAxMSBMMjcuMjUyNjk5NSwyMTQuMTI0ODU1IEw0Ny41LDIwNS45NzQ2ODEgTDQ3LjUsMTUyLjc5ODgyMyBaJyBpZD0nQ29tYmluZWQtU2hhcGUnIC8+XG4gICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9J00xNDYuNDU2ODI3LDYzLjAyNDE4NDkgQzE0Ni45NDg2MDMsNjQuNzEwNDcyNCAxNDYuMTA1OTcyLDY2LjUzMzY1OTEgMTQ0LjQ0NzMwNSw2Ny4yMjgzMTQ5IEw1OS41NDY4Njc3LDEwMi43ODQ5MDggTDEyMC40MTY1NzUsMTI4LjI3NzM1IEMxMjIuMTk5NTI0LDEyOS4wMjQwNTUgMTIzLjAzOTU2NiwxMzEuMDc0NzQ1IDEyMi4yOTI4NjEsMTMyLjg1NzY5NCBDMTIxLjU0NjE1NiwxMzQuNjQwNjQzIDExOS40OTU0NjYsMTM1LjQ4MDY4NSAxMTcuNzEyNTE3LDEzNC43MzM5NzkgTDUwLjQ4NjQxMzEsMTA2LjU3OTQ1NyBMMjkuMzUyMDI5MywxMTUuNDMwNjEgQzI3LjU2OTA4MDIsMTE2LjE3NzMxNSAyNS41MTgzOTAzLDExNS4zMzcyNzMgMjQuNzcxNjg1MSwxMTMuNTU0MzI0IEMyNC4wMjQ5OCwxMTEuNzcxMzc1IDI0Ljg2NTAyMTYsMTA5LjcyMDY4NSAyNi42NDc5NzA3LDEwOC45NzM5OCBMNDcuNSwxMDAuMjQxMDc5IEw0Ny41LDE0LjUgQzQ3LjUsMTIuNTY3MDAzNCA0OS4wNjcwMDM0LDExIDUxLDExIEM1Mi45MzI5OTY2LDExIDU0LjUsMTIuNTY3MDAzNCA1NC41LDE0LjUgTDU0LjUsOTcuMzA5NDU0OCBMMTMzLjM2MDI1Nyw2NC4yODI1MDk4IEwxMTcuMTg4MjM4LDU3Ljc0NDg4NTIgQzExNS4zOTYxMzcsNTcuMDIwNDE5IDExNC41MzA2NDksNTQuOTgwMzM4NSAxMTUuMjU1MTE1LDUzLjE4ODIzNzkgQzExNS45Nzk1ODEsNTEuMzk2MTM3MyAxMTguMDE5NjYxLDUwLjUzMDY0ODYgMTE5LjgxMTc2Miw1MS4yNTUxMTQ4IEwxMzkuNSw1OS4yMTQxODk3IEwxMzkuNSwyNS44NjAyNzg0IEwxMzUuODg3MTkyLDI0LjM5OTc4MTYgTDExOC4xODgyMzgsMTcuMjQ0ODg1MiBDMTE2LjM5NjEzNywxNi41MjA0MTkgMTE1LjUzMDY0OSwxNC40ODAzMzg1IDExNi4yNTUxMTUsMTIuNjg4MjM3OSBDMTE2Ljk3OTU4MSwxMC44OTYxMzczIDExOS4wMTk2NjEsMTAuMDMwNjQ4NiAxMjAuODExNzYyLDEwLjc1NTExNDggTDEzOC41MTA3MTYsMTcuOTEwMDExMiBMMTQzLjM2ODQyMSwxOS44NzM3NjQxIEwxNjQuNjg4MjM4LDExLjI1NTExNDggQzE2Ni40ODAzMzksMTAuNTMwNjQ4NiAxNjguNTIwNDE5LDExLjM5NjEzNzMgMTY5LjI0NDg4NSwxMy4xODgyMzc5IEMxNjkuOTY5MzUxLDE0Ljk4MDMzODUgMTY5LjEwMzg2MywxNy4wMjA0MTkgMTY3LjMxMTc2MiwxNy43NDQ4ODUyIEwxNDYuNSwyNi4xNTgxNTA4IEwxNDYuNSw2Mi40NzI4NzQ5IEMxNDYuNSw2Mi42NjA0NTc0IDE0Ni40ODUyNDMsNjIuODQ0NTkzMyAxNDYuNDU2ODI3LDYzLjAyNDE4NDkgWicgaWQ9J0NvbWJpbmVkLVNoYXBlJyAvPlxuICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSdNMTM5LjUsOTYuMzMwODA2OSBMMTIyLjgzMzMzMywxMDMuMzEwODY0IEwxMjIuODMzMzMzLDE1MS4zNzI3OTkgQzEyMi44MzMzMzMsMTUzLjMwNTc5NSAxMjEuMjY2MzMsMTU0Ljg3Mjc5OSAxMTkuMzMzMzMzLDE1NC44NzI3OTkgQzExOC41MzU3MTksMTU0Ljg3Mjc5OSAxMTcuODAwNDIsMTU0LjYwNTk5NCAxMTcuMjExODE2LDE1NC4xNTY3NjMgTDI2LjY0Nzk3MDcsMTE2LjIyODMxNSBDMjYuMDk3NjcwNiwxMTUuOTk3ODQ3IDI1LjYzNzE5NCwxMTUuNjQzMTU5IDI1LjI4NTQ3MTQsMTE1LjIxMDQ2MiBDMjQuNTAwODI1OCwxMTQuNTY4NjIgMjQsMTEzLjU5Mjc5NyAyNCwxMTIuNSBMMjQsMjUuODYwMjc4NCBMMjAuMzg3MTkyMSwyNC4zOTk3ODE2IEwyLjY4ODIzNzg5LDE3LjI0NDg4NTIgQzAuODk2MTM3MjU4LDE2LjUyMDQxOSAwLjAzMDY0ODU1ODksMTQuNDgwMzM4NSAwLjc1NTExNDc3LDEyLjY4ODIzNzkgQzEuNDc5NTgwOTgsMTAuODk2MTM3MyAzLjUxOTY2MTQ5LDEwLjAzMDY0ODYgNS4zMTE3NjIxMSwxMC43NTUxMTQ4IEwyMy4wMTA3MTY0LDE3LjkxMDAxMTIgTDI3Ljg2ODQyMTEsMTkuODczNzY0MSBMNDkuMTg4MjM3OSwxMS4yNTUxMTQ4IEM1MC45ODAzMzg1LDEwLjUzMDY0ODYgNTMuMDIwNDE5LDExLjM5NjEzNzMgNTMuNzQ0ODg1MiwxMy4xODgyMzc5IEM1NC40NjkzNTE0LDE0Ljk4MDMzODUgNTMuNjAzODYyNywxNy4wMjA0MTkgNTEuODExNzYyMSwxNy43NDQ4ODUyIEwzMSwyNi4xNTgxNTA4IEwzMSwxMTAuNDYxODYxIEwxMTUuODMzMzMzLDE0NS45OTAzNTEgTDExNS44MzMzMzMsMTA2LjI0MjQ4OCBMODQuMjU5NjYxNiwxMTkuNDY1NjQ5IEM4Mi40NzY3MTI1LDEyMC4yMTIzNTUgODAuNDI2MDIyNiwxMTkuMzcyMzEzIDc5LjY3OTMxNzQsMTE3LjU4OTM2NCBDNzguOTMyNjEyMywxMTUuODA2NDE1IDc5Ljc3MjY1MzksMTEzLjc1NTcyNSA4MS41NTU2MDMsMTEzLjAwOTAyIEwxNDEuMDUyMTUxLDg4LjA5MTY2MjIgQzE0MS42MDg5NzQsODcuNzE3OTkzIDE0Mi4yNzkwMyw4Ny41IDE0Myw4Ny41IEMxNDQuOTMyOTk3LDg3LjUgMTQ2LjUsODkuMDY3MDAzNCAxNDYuNSw5MSBMMTQ2LjUsMjE3LjYzMDQ4IEMxNDYuNSwyMTkuNTYzNDc3IDE0NC45MzI5OTcsMjIxLjEzMDQ4IDE0MywyMjEuMTMwNDggQzE0MS4wNjcwMDMsMjIxLjEzMDQ4IDEzOS41LDIxOS41NjM0NzcgMTM5LjUsMjE3LjYzMDQ4IEwxMzkuNSw5Ni4zMzA4MDY5IFogTTMxLDE0MSBMMzEsMjE3LjA1NTIzNyBDMzEsMjE4Ljk4ODIzNCAyOS40MzI5OTY2LDIyMC41NTUyMzcgMjcuNSwyMjAuNTU1MjM3IEMyNS41NjcwMDM0LDIyMC41NTUyMzcgMjQsMjE4Ljk4ODIzNCAyNCwyMTcuMDU1MjM3IEwyNCwxNDEgQzI0LDEzOS4wNjcwMDMgMjUuNTY3MDAzNCwxMzcuNSAyNy41LDEzNy41IEMyOS40MzI5OTY2LDEzNy41IDMxLDEzOS4wNjcwMDMgMzEsMTQxIFonIGlkPSdDb21iaW5lZC1TaGFwZScgLz5cbiAgICAgICAgICAgICAgICAgIDwvZz5cbiAgICAgICAgICAgICAgICA8L2c+XG4gICAgICAgICAgICAgIDwvZz5cbiAgICAgICAgICAgIDwvc3ZnPlxuICAgICAgICAgICAgPGJyIC8+XG4gICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBjb2xvcjogJyNGQUZDRkQnLCBkaXNwbGF5OiAnaW5saW5lLWJsb2NrJywgd2lkdGg6ICcxMDAlJywgaGVpZ2h0OiA1MCwgcG9zaXRpb246ICdhYnNvbHV0ZScsIGJvdHRvbTogNTAsIGxlZnQ6IDAgfX0+e3RoaXMuc3RhdGUuc29mdHdhcmVWZXJzaW9ufTwvc3Bhbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICByZW5kZXIgKCkge1xuICAgIGlmICh0aGlzLnN0YXRlLnJlYWR5Rm9yQXV0aCAmJiAoIXRoaXMuc3RhdGUuaXNVc2VyQXV0aGVudGljYXRlZCB8fCAhdGhpcy5zdGF0ZS51c2VybmFtZSkpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxTdHlsZVJvb3Q+XG4gICAgICAgICAgPEF1dGhlbnRpY2F0aW9uVUlcbiAgICAgICAgICAgIG9uU3VibWl0PXt0aGlzLmF1dGhlbnRpY2F0ZVVzZXJ9XG4gICAgICAgICAgICBvblN1Ym1pdFN1Y2Nlc3M9e3RoaXMuYXV0aGVudGljYXRpb25Db21wbGV0ZX1cbiAgICAgICAgICAgIHsuLi50aGlzLnByb3BzfSAvPlxuICAgICAgICA8L1N0eWxlUm9vdD5cbiAgICAgIClcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuc3RhdGUuaXNVc2VyQXV0aGVudGljYXRlZCB8fCAhdGhpcy5zdGF0ZS51c2VybmFtZSkge1xuICAgICAgcmV0dXJuIHRoaXMucmVuZGVyU3RhcnR1cERlZmF1bHRTY3JlZW4oKVxuICAgIH1cblxuICAgIGlmICh0aGlzLnN0YXRlLmRhc2hib2FyZFZpc2libGUpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgPFByb2plY3RCcm93c2VyXG4gICAgICAgICAgICBsb2FkUHJvamVjdHM9e3RoaXMubG9hZFByb2plY3RzfVxuICAgICAgICAgICAgbGF1bmNoUHJvamVjdD17dGhpcy5sYXVuY2hQcm9qZWN0fVxuICAgICAgICAgICAgY3JlYXRlTm90aWNlPXt0aGlzLmNyZWF0ZU5vdGljZX1cbiAgICAgICAgICAgIHJlbW92ZU5vdGljZT17dGhpcy5yZW1vdmVOb3RpY2V9XG4gICAgICAgICAgICBub3RpY2VzPXt0aGlzLnN0YXRlLm5vdGljZXN9XG4gICAgICAgICAgICBlbnZveT17dGhpcy5lbnZveX1cbiAgICAgICAgICAgIHsuLi50aGlzLnByb3BzfSAvPlxuICAgICAgICAgIDxUb3VyIHByb2plY3RzTGlzdD17dGhpcy5zdGF0ZS5wcm9qZWN0c0xpc3R9IGVudm95PXt0aGlzLmVudm95fSBzdGFydFRvdXJPbk1vdW50IC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKVxuICAgIH1cblxuICAgIGlmICghdGhpcy5zdGF0ZS5wcm9qZWN0Rm9sZGVyKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIDxUb3VyIHByb2plY3RzTGlzdD17dGhpcy5zdGF0ZS5wcm9qZWN0c0xpc3R9IGVudm95PXt0aGlzLmVudm95fSAvPlxuICAgICAgICAgIDxQcm9qZWN0QnJvd3NlclxuICAgICAgICAgICAgbG9hZFByb2plY3RzPXt0aGlzLmxvYWRQcm9qZWN0c31cbiAgICAgICAgICAgIGxhdW5jaFByb2plY3Q9e3RoaXMubGF1bmNoUHJvamVjdH1cbiAgICAgICAgICAgIGNyZWF0ZU5vdGljZT17dGhpcy5jcmVhdGVOb3RpY2V9XG4gICAgICAgICAgICByZW1vdmVOb3RpY2U9e3RoaXMucmVtb3ZlTm90aWNlfVxuICAgICAgICAgICAgbm90aWNlcz17dGhpcy5zdGF0ZS5ub3RpY2VzfVxuICAgICAgICAgICAgZW52b3k9e3RoaXMuZW52b3l9XG4gICAgICAgICAgICB7Li4udGhpcy5wcm9wc30gLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICApXG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLnN0YXRlLmFwcGxpY2F0aW9uSW1hZ2UgfHwgdGhpcy5zdGF0ZS5mb2xkZXJMb2FkaW5nRXJyb3IpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgc3R5bGU9e3sgcG9zaXRpb246ICdhYnNvbHV0ZScsIHdpZHRoOiAnMTAwJScsIGhlaWdodDogJzEwMCUnIH19PlxuICAgICAgICAgIDxSZWFjdENTU1RyYW5zaXRpb25Hcm91cFxuICAgICAgICAgICAgdHJhbnNpdGlvbk5hbWU9J3RvYXN0J1xuICAgICAgICAgICAgdHJhbnNpdGlvbkVudGVyVGltZW91dD17NTAwfVxuICAgICAgICAgICAgdHJhbnNpdGlvbkxlYXZlVGltZW91dD17MzAwfT5cbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3twb3NpdGlvbjogJ2Fic29sdXRlJywgcmlnaHQ6IDAsIHRvcDogMCwgd2lkdGg6IDMwMH19PlxuICAgICAgICAgICAgICB7bG9kYXNoLm1hcCh0aGlzLnN0YXRlLm5vdGljZXMsIHRoaXMucmVuZGVyTm90aWZpY2F0aW9ucyl9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L1JlYWN0Q1NTVHJhbnNpdGlvbkdyb3VwPlxuICAgICAgICAgIDxkaXYgc3R5bGU9e3sgcG9zaXRpb246ICdyZWxhdGl2ZScsIHdpZHRoOiAnMTAwJScsIGhlaWdodDogJzEwMCUnIH19PlxuICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBwb3NpdGlvbjogJ2Fic29sdXRlJywgdG9wOiAnNTAlJywgbGVmdDogJzUwJScsIHRyYW5zZm9ybTogJ3RyYW5zbGF0ZSgtNTAlLCAtNTAlKScgfX0+XG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGZvbnRTaXplOiAyNCwgY29sb3I6ICcjMjIyJyB9fT5Mb2FkaW5nIHByb2plY3QuLi48L3NwYW4+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICApXG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgc3R5bGU9e3sgcG9zaXRpb246ICdyZWxhdGl2ZScsIHdpZHRoOiAnMTAwJScsIGhlaWdodDogJzEwMCUnIH19PlxuICAgICAgICA8VG91ciBwcm9qZWN0c0xpc3Q9e3RoaXMuc3RhdGUucHJvamVjdHNMaXN0fSBlbnZveT17dGhpcy5lbnZveX0gLz5cbiAgICAgICAgPGRpdiBzdHlsZT17eyBwb3NpdGlvbjogJ2Fic29sdXRlJywgd2lkdGg6ICcxMDAlJywgaGVpZ2h0OiAnMTAwJScsIHRvcDogMCwgbGVmdDogMCB9fT5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nbGF5b3V0LWJveCcgc3R5bGU9e3tvdmVyZmxvdzogJ3Zpc2libGUnfX0+XG4gICAgICAgICAgICA8UmVhY3RDU1NUcmFuc2l0aW9uR3JvdXBcbiAgICAgICAgICAgICAgdHJhbnNpdGlvbk5hbWU9J3RvYXN0J1xuICAgICAgICAgICAgICB0cmFuc2l0aW9uRW50ZXJUaW1lb3V0PXs1MDB9XG4gICAgICAgICAgICAgIHRyYW5zaXRpb25MZWF2ZVRpbWVvdXQ9ezMwMH0+XG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3twb3NpdGlvbjogJ2Fic29sdXRlJywgcmlnaHQ6IDAsIHRvcDogMCwgd2lkdGg6IDMwMH19PlxuICAgICAgICAgICAgICAgIHtsb2Rhc2gubWFwKHRoaXMuc3RhdGUubm90aWNlcywgdGhpcy5yZW5kZXJOb3RpZmljYXRpb25zKX1cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L1JlYWN0Q1NTVHJhbnNpdGlvbkdyb3VwPlxuICAgICAgICAgICAgPFNwbGl0UGFuZSBvbkRyYWdGaW5pc2hlZD17dGhpcy5oYW5kbGVQYW5lUmVzaXplLmJpbmQodGhpcyl9IHNwbGl0PSdob3Jpem9udGFsJyBtaW5TaXplPXszMDB9IGRlZmF1bHRTaXplPXt0aGlzLnByb3BzLmhlaWdodCAqIDAuNjJ9PlxuICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgIDxTcGxpdFBhbmUgb25EcmFnRmluaXNoZWQ9e3RoaXMuaGFuZGxlUGFuZVJlc2l6ZS5iaW5kKHRoaXMpfSBzcGxpdD0ndmVydGljYWwnIG1pblNpemU9ezMwMH0gZGVmYXVsdFNpemU9ezMwMH0+XG4gICAgICAgICAgICAgICAgICA8U2lkZUJhclxuICAgICAgICAgICAgICAgICAgICBzZXREYXNoYm9hcmRWaXNpYmlsaXR5PXt0aGlzLnNldERhc2hib2FyZFZpc2liaWxpdHkuYmluZCh0aGlzKX1cbiAgICAgICAgICAgICAgICAgICAgc3dpdGNoQWN0aXZlTmF2PXt0aGlzLnN3aXRjaEFjdGl2ZU5hdi5iaW5kKHRoaXMpfVxuICAgICAgICAgICAgICAgICAgICBhY3RpdmVOYXY9e3RoaXMuc3RhdGUuYWN0aXZlTmF2fT5cbiAgICAgICAgICAgICAgICAgICAge3RoaXMuc3RhdGUuYWN0aXZlTmF2ID09PSAnbGlicmFyeSdcbiAgICAgICAgICAgICAgICAgICAgICA/IDxMaWJyYXJ5XG4gICAgICAgICAgICAgICAgICAgICAgICBsYXlvdXQ9e3RoaXMubGF5b3V0fVxuICAgICAgICAgICAgICAgICAgICAgICAgZm9sZGVyPXt0aGlzLnN0YXRlLnByb2plY3RGb2xkZXJ9XG4gICAgICAgICAgICAgICAgICAgICAgICBoYWlrdT17dGhpcy5wcm9wcy5oYWlrdX1cbiAgICAgICAgICAgICAgICAgICAgICAgIHdlYnNvY2tldD17dGhpcy5wcm9wcy53ZWJzb2NrZXR9XG4gICAgICAgICAgICAgICAgICAgICAgICB0b3VyQ2hhbm5lbD17dGhpcy50b3VyQ2hhbm5lbH1cbiAgICAgICAgICAgICAgICAgICAgICAgIG9uRHJhZ0VuZD17dGhpcy5vbkxpYnJhcnlEcmFnRW5kLmJpbmQodGhpcyl9XG4gICAgICAgICAgICAgICAgICAgICAgICBvbkRyYWdTdGFydD17dGhpcy5vbkxpYnJhcnlEcmFnU3RhcnQuYmluZCh0aGlzKX1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNyZWF0ZU5vdGljZT17dGhpcy5jcmVhdGVOb3RpY2V9XG4gICAgICAgICAgICAgICAgICAgICAgICByZW1vdmVOb3RpY2U9e3RoaXMucmVtb3ZlTm90aWNlfSAvPlxuICAgICAgICAgICAgICAgICAgICAgIDogPFN0YXRlSW5zcGVjdG9yXG4gICAgICAgICAgICAgICAgICAgICAgICBjcmVhdGVOb3RpY2U9e3RoaXMuY3JlYXRlTm90aWNlfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmVtb3ZlTm90aWNlPXt0aGlzLnJlbW92ZU5vdGljZX1cbiAgICAgICAgICAgICAgICAgICAgICAgIGZvbGRlcj17dGhpcy5zdGF0ZS5wcm9qZWN0Rm9sZGVyfVxuICAgICAgICAgICAgICAgICAgICAgICAgd2Vic29ja2V0PXt0aGlzLnByb3BzLndlYnNvY2tldH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHRvdXJDaGFubmVsPXt0aGlzLnRvdXJDaGFubmVsfSAvPlxuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIDwvU2lkZUJhcj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3twb3NpdGlvbjogJ3JlbGF0aXZlJywgd2lkdGg6ICcxMDAlJywgaGVpZ2h0OiAnMTAwJSd9fT5cbiAgICAgICAgICAgICAgICAgICAgPFN0YWdlXG4gICAgICAgICAgICAgICAgICAgICAgcmVmPSdzdGFnZSdcbiAgICAgICAgICAgICAgICAgICAgICBmb2xkZXI9e3RoaXMuc3RhdGUucHJvamVjdEZvbGRlcn1cbiAgICAgICAgICAgICAgICAgICAgICBlbnZveT17dGhpcy5lbnZveX1cbiAgICAgICAgICAgICAgICAgICAgICBoYWlrdT17dGhpcy5wcm9wcy5oYWlrdX1cbiAgICAgICAgICAgICAgICAgICAgICB3ZWJzb2NrZXQ9e3RoaXMucHJvcHMud2Vic29ja2V0fVxuICAgICAgICAgICAgICAgICAgICAgIHByb2plY3Q9e3RoaXMuc3RhdGUucHJvamVjdE9iamVjdH1cbiAgICAgICAgICAgICAgICAgICAgICBjcmVhdGVOb3RpY2U9e3RoaXMuY3JlYXRlTm90aWNlfVxuICAgICAgICAgICAgICAgICAgICAgIHJlbW92ZU5vdGljZT17dGhpcy5yZW1vdmVOb3RpY2V9XG4gICAgICAgICAgICAgICAgICAgICAgcmVjZWl2ZVByb2plY3RJbmZvPXt0aGlzLnJlY2VpdmVQcm9qZWN0SW5mb31cbiAgICAgICAgICAgICAgICAgICAgICBvcmdhbml6YXRpb25OYW1lPXt0aGlzLnN0YXRlLm9yZ2FuaXphdGlvbk5hbWV9XG4gICAgICAgICAgICAgICAgICAgICAgYXV0aFRva2VuPXt0aGlzLnN0YXRlLmF1dGhUb2tlbn1cbiAgICAgICAgICAgICAgICAgICAgICB1c2VybmFtZT17dGhpcy5zdGF0ZS51c2VybmFtZX1cbiAgICAgICAgICAgICAgICAgICAgICBwYXNzd29yZD17dGhpcy5zdGF0ZS5wYXNzd29yZH0gLz5cbiAgICAgICAgICAgICAgICAgICAgeyh0aGlzLnN0YXRlLmxpYnJhcnlJdGVtRHJhZ2dpbmcpXG4gICAgICAgICAgICAgICAgICAgICAgPyA8ZGl2IHN0eWxlPXt7IHdpZHRoOiAnMTAwJScsIGhlaWdodDogJzEwMCUnLCBiYWNrZ3JvdW5kQ29sb3I6ICd3aGl0ZScsIG9wYWNpdHk6IDAuMDEsIHBvc2l0aW9uOiAnYWJzb2x1dGUnLCB0b3A6IDAsIGxlZnQ6IDAgfX0gLz5cbiAgICAgICAgICAgICAgICAgICAgICA6ICcnIH1cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvU3BsaXRQYW5lPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPFRpbWVsaW5lXG4gICAgICAgICAgICAgICAgcmVmPSd0aW1lbGluZSdcbiAgICAgICAgICAgICAgICBmb2xkZXI9e3RoaXMuc3RhdGUucHJvamVjdEZvbGRlcn1cbiAgICAgICAgICAgICAgICBlbnZveT17dGhpcy5lbnZveX1cbiAgICAgICAgICAgICAgICBoYWlrdT17dGhpcy5wcm9wcy5oYWlrdX0gLz5cbiAgICAgICAgICAgIDwvU3BsaXRQYW5lPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxufVxuIl19