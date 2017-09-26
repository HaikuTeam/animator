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
            // tourChannel.notifyScreenResize()
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
          lineNumber: 362
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
            lineNumber: 528
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
              lineNumber: 529
            },
            __self: this
          },
          _react2.default.createElement(
            'div',
            { style: { position: 'absolute', right: 0, top: 0, width: 300 }, __source: {
                fileName: _jsxFileName,
                lineNumber: 533
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
              lineNumber: 537
            },
            __self: this
          },
          _react2.default.createElement(
            'div',
            { style: { display: 'table-cell', width: '100%', height: '100%', verticalAlign: 'middle', textAlign: 'center' }, __source: {
                fileName: _jsxFileName,
                lineNumber: 538
              },
              __self: this
            },
            _react2.default.createElement(
              'svg',
              { width: '170px', height: '221px', viewBox: '0 0 170 221', version: '1.1', __source: {
                  fileName: _jsxFileName,
                  lineNumber: 539
                },
                __self: this
              },
              _react2.default.createElement(
                'g',
                { id: 'Page-1', stroke: 'none', strokeWidth: '1', fill: 'none', fillRule: 'evenodd', __source: {
                    fileName: _jsxFileName,
                    lineNumber: 540
                  },
                  __self: this
                },
                _react2.default.createElement(
                  'g',
                  { id: 'Outlined', transform: 'translate(-211.000000, -114.000000)', fillRule: 'nonzero', fill: '#FAFCFD', __source: {
                      fileName: _jsxFileName,
                      lineNumber: 541
                    },
                    __self: this
                  },
                  _react2.default.createElement(
                    'g',
                    { id: 'outlined-logo', transform: 'translate(211.000000, 113.000000)', __source: {
                        fileName: _jsxFileName,
                        lineNumber: 542
                      },
                      __self: this
                    },
                    _react2.default.createElement('path', { d: 'M47.5,152.798823 L26.3823432,143.954676 C24.5993941,143.207971 23.7593524,141.157281 24.5060576,139.374332 C25.2527628,137.591383 27.3034527,136.751341 29.0864018,137.498046 L117.780058,174.64456 L120.990021,176.089074 C122.486814,176.762645 123.279304,178.358251 122.998698,179.903598 C122.999564,179.935626 123,179.967762 123,180 L123,205.639722 L138.510716,211.910011 L143.368421,213.873764 L162.833333,206.00497 L162.833333,16.2929025 L143,8.27517204 L122.833333,16.4276543 L122.833333,53.6013295 C122.834218,53.6466489 122.834215,53.6919015 122.833333,53.7370634 L122.833333,54 C122.833333,55.9329966 121.26633,57.5 119.333333,57.5 C119.28843,57.5 119.243724,57.4991544 119.19923,57.4974782 L53.307638,84.037149 C51.5146183,84.7593375 49.4756392,83.8912573 48.7534506,82.0982376 C48.0312621,80.3052179 48.8993423,78.2662388 50.692362,77.5440502 L115.833333,51.3067129 L115.833333,14.4974227 C115.833333,14.0143178 115.931213,13.5540739 116.108222,13.1354399 C116.374539,12.0941292 117.115326,11.1888449 118.188238,10.7551148 L141.684186,1.2567527 C142.091317,1.09152936 142.52959,1.00240467 142.975937,0.999164723 C143.47041,1.00240467 143.908683,1.09152936 144.315814,1.2567527 L167.811762,10.7551148 C169.522968,11.446879 170.389328,13.3381659 169.833333,15.0677068 L169.833333,208 C169.833333,208.826304 169.54699,209.585728 169.068118,210.184459 C168.693703,210.867378 168.090133,211.430224 167.311762,211.744885 L144.517645,220.959528 C143.332542,221.438613 142.038995,221.222397 141.089179,220.502712 L135.887192,218.399782 L119.461595,211.759647 C117.54629,211.739055 116,210.180032 116,208.259853 L116,208.07911 C115.998767,208.025708 115.998761,207.972178 116,207.918558 L116,181.518748 L114.991727,181.064589 L54.5,155.730447 L54.5,206.998273 C55.1341468,208.658256 54.4195315,210.512915 52.8796645,211.333333 C52.5545546,211.540709 52.192904,211.695869 51.8065294,211.786997 L29.7867375,220.650655 C28.8252535,221.478758 27.4457005,221.753221 26.1882379,221.244885 L20.3871921,218.899782 L3.30627783,211.994731 C1.46338189,211.894192 -2.60835995e-16,210.367992 0,208.5 L2.70894418e-14,14.4974227 C2.724245e-14,13.4016458 0.503560947,12.4234818 1.29189669,11.781717 C1.65171014,11.3416509 2.12405622,10.9831882 2.68823789,10.7551148 L26.1841862,1.2567527 C26.5913172,1.09152936 27.0295898,1.00240467 27.4759367,0.999164723 C27.9704102,1.00240467 28.4086828,1.09152936 28.8158138,1.2567527 L52.3117621,10.7551148 C54.1038627,11.479581 54.9693514,13.5196615 54.2448852,15.3117621 C53.520419,17.1038627 51.4803385,17.9693514 49.6882379,17.2448852 L27.5,8.27517204 L7,16.5624061 L7,205.937594 L23.0107164,212.410011 L27.2526995,214.124855 L47.5,205.974681 L47.5,152.798823 Z', id: 'Combined-Shape', __source: {
                        fileName: _jsxFileName,
                        lineNumber: 543
                      },
                      __self: this
                    }),
                    _react2.default.createElement('path', { d: 'M146.456827,63.0241849 C146.948603,64.7104724 146.105972,66.5336591 144.447305,67.2283149 L59.5468677,102.784908 L120.416575,128.27735 C122.199524,129.024055 123.039566,131.074745 122.292861,132.857694 C121.546156,134.640643 119.495466,135.480685 117.712517,134.733979 L50.4864131,106.579457 L29.3520293,115.43061 C27.5690802,116.177315 25.5183903,115.337273 24.7716851,113.554324 C24.02498,111.771375 24.8650216,109.720685 26.6479707,108.97398 L47.5,100.241079 L47.5,14.5 C47.5,12.5670034 49.0670034,11 51,11 C52.9329966,11 54.5,12.5670034 54.5,14.5 L54.5,97.3094548 L133.360257,64.2825098 L117.188238,57.7448852 C115.396137,57.020419 114.530649,54.9803385 115.255115,53.1882379 C115.979581,51.3961373 118.019661,50.5306486 119.811762,51.2551148 L139.5,59.2141897 L139.5,25.8602784 L135.887192,24.3997816 L118.188238,17.2448852 C116.396137,16.520419 115.530649,14.4803385 116.255115,12.6882379 C116.979581,10.8961373 119.019661,10.0306486 120.811762,10.7551148 L138.510716,17.9100112 L143.368421,19.8737641 L164.688238,11.2551148 C166.480339,10.5306486 168.520419,11.3961373 169.244885,13.1882379 C169.969351,14.9803385 169.103863,17.020419 167.311762,17.7448852 L146.5,26.1581508 L146.5,62.4728749 C146.5,62.6604574 146.485243,62.8445933 146.456827,63.0241849 Z', id: 'Combined-Shape', __source: {
                        fileName: _jsxFileName,
                        lineNumber: 544
                      },
                      __self: this
                    }),
                    _react2.default.createElement('path', { d: 'M139.5,96.3308069 L122.833333,103.310864 L122.833333,151.372799 C122.833333,153.305795 121.26633,154.872799 119.333333,154.872799 C118.535719,154.872799 117.80042,154.605994 117.211816,154.156763 L26.6479707,116.228315 C26.0976706,115.997847 25.637194,115.643159 25.2854714,115.210462 C24.5008258,114.56862 24,113.592797 24,112.5 L24,25.8602784 L20.3871921,24.3997816 L2.68823789,17.2448852 C0.896137258,16.520419 0.0306485589,14.4803385 0.75511477,12.6882379 C1.47958098,10.8961373 3.51966149,10.0306486 5.31176211,10.7551148 L23.0107164,17.9100112 L27.8684211,19.8737641 L49.1882379,11.2551148 C50.9803385,10.5306486 53.020419,11.3961373 53.7448852,13.1882379 C54.4693514,14.9803385 53.6038627,17.020419 51.8117621,17.7448852 L31,26.1581508 L31,110.461861 L115.833333,145.990351 L115.833333,106.242488 L84.2596616,119.465649 C82.4767125,120.212355 80.4260226,119.372313 79.6793174,117.589364 C78.9326123,115.806415 79.7726539,113.755725 81.555603,113.00902 L141.052151,88.0916622 C141.608974,87.717993 142.27903,87.5 143,87.5 C144.932997,87.5 146.5,89.0670034 146.5,91 L146.5,217.63048 C146.5,219.563477 144.932997,221.13048 143,221.13048 C141.067003,221.13048 139.5,219.563477 139.5,217.63048 L139.5,96.3308069 Z M31,141 L31,217.055237 C31,218.988234 29.4329966,220.555237 27.5,220.555237 C25.5670034,220.555237 24,218.988234 24,217.055237 L24,141 C24,139.067003 25.5670034,137.5 27.5,137.5 C29.4329966,137.5 31,139.067003 31,141 Z', id: 'Combined-Shape', __source: {
                        fileName: _jsxFileName,
                        lineNumber: 545
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
                lineNumber: 550
              },
              __self: this
            }),
            _react2.default.createElement(
              'span',
              { style: { color: '#FAFCFD', display: 'inline-block', width: '100%', height: 50, position: 'absolute', bottom: 50, left: 0 }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 551
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
              lineNumber: 561
            },
            __self: this
          },
          _react2.default.createElement(_AuthenticationUI2.default, Object.assign({
            onSubmit: this.authenticateUser,
            onSubmitSuccess: this.authenticationComplete
          }, this.props, {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 562
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
              lineNumber: 576
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
              lineNumber: 577
            },
            __self: this
          })),
          _react2.default.createElement(_Tour2.default, { projectsList: this.state.projectsList, envoy: this.envoy, startTourOnMount: true, __source: {
              fileName: _jsxFileName,
              lineNumber: 585
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
              lineNumber: 592
            },
            __self: this
          },
          _react2.default.createElement(_Tour2.default, { projectsList: this.state.projectsList, envoy: this.envoy, __source: {
              fileName: _jsxFileName,
              lineNumber: 593
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
              lineNumber: 594
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
              lineNumber: 608
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
                lineNumber: 609
              },
              __self: this
            },
            _react2.default.createElement(
              'div',
              { style: { position: 'absolute', right: 0, top: 0, width: 300 }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 613
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
                lineNumber: 617
              },
              __self: this
            },
            _react2.default.createElement(
              'div',
              { style: { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 618
                },
                __self: this
              },
              _react2.default.createElement(
                'span',
                { style: { fontSize: 24, color: '#222' }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 619
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
            lineNumber: 627
          },
          __self: this
        },
        _react2.default.createElement(_Tour2.default, { projectsList: this.state.projectsList, envoy: this.envoy, __source: {
            fileName: _jsxFileName,
            lineNumber: 628
          },
          __self: this
        }),
        _react2.default.createElement(
          'div',
          { style: { position: 'absolute', width: '100%', height: '100%', top: 0, left: 0 }, __source: {
              fileName: _jsxFileName,
              lineNumber: 629
            },
            __self: this
          },
          _react2.default.createElement(
            'div',
            { className: 'layout-box', style: { overflow: 'visible' }, __source: {
                fileName: _jsxFileName,
                lineNumber: 630
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
                  lineNumber: 631
                },
                __self: this
              },
              _react2.default.createElement(
                'div',
                { style: { position: 'absolute', right: 0, top: 0, width: 300 }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 635
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
                  lineNumber: 639
                },
                __self: this
              },
              _react2.default.createElement(
                'div',
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 640
                  },
                  __self: this
                },
                _react2.default.createElement(
                  _reactSplitPane2.default,
                  { onDragFinished: this.handlePaneResize.bind(this), split: 'vertical', minSize: 300, defaultSize: 300, __source: {
                      fileName: _jsxFileName,
                      lineNumber: 641
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
                        lineNumber: 642
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
                        lineNumber: 647
                      },
                      __self: this
                    }) : _react2.default.createElement(_StateInspector2.default, {
                      createNotice: this.createNotice,
                      removeNotice: this.removeNotice,
                      folder: this.state.projectFolder,
                      websocket: this.props.websocket,
                      tourChannel: this.tourChannel, __source: {
                        fileName: _jsxFileName,
                        lineNumber: 657
                      },
                      __self: this
                    })
                  ),
                  _react2.default.createElement(
                    'div',
                    { style: { position: 'relative', width: '100%', height: '100%' }, __source: {
                        fileName: _jsxFileName,
                        lineNumber: 665
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
                        lineNumber: 666
                      },
                      __self: this
                    }),
                    this.state.libraryItemDragging ? _react2.default.createElement('div', { style: { width: '100%', height: '100%', backgroundColor: 'white', opacity: 0.01, position: 'absolute', top: 0, left: 0 }, __source: {
                        fileName: _jsxFileName,
                        lineNumber: 681
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
                  lineNumber: 686
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZWFjdC9DcmVhdG9yLmpzIl0sIm5hbWVzIjpbInBrZyIsInJlcXVpcmUiLCJtaXhwYW5lbCIsImVsZWN0cm9uIiwicmVtb3RlIiwiaXBjUmVuZGVyZXIiLCJjbGlwYm9hcmQiLCJ3ZWJGcmFtZSIsInNldFpvb21MZXZlbExpbWl0cyIsInNldExheW91dFpvb21MZXZlbExpbWl0cyIsIkNyZWF0b3IiLCJwcm9wcyIsImF1dGhlbnRpY2F0ZVVzZXIiLCJiaW5kIiwiYXV0aGVudGljYXRpb25Db21wbGV0ZSIsImxvYWRQcm9qZWN0cyIsImxhdW5jaFByb2plY3QiLCJyZW1vdmVOb3RpY2UiLCJjcmVhdGVOb3RpY2UiLCJyZW5kZXJOb3RpZmljYXRpb25zIiwicmVjZWl2ZVByb2plY3RJbmZvIiwiaGFuZGxlRmluZEVsZW1lbnRDb29yZGluYXRlcyIsImhhbmRsZUZpbmRXZWJ2aWV3Q29vcmRpbmF0ZXMiLCJsYXlvdXQiLCJzdGF0ZSIsImVycm9yIiwicHJvamVjdEZvbGRlciIsImZvbGRlciIsImFwcGxpY2F0aW9uSW1hZ2UiLCJwcm9qZWN0T2JqZWN0IiwicHJvamVjdE5hbWUiLCJkYXNoYm9hcmRWaXNpYmxlIiwicmVhZHlGb3JBdXRoIiwiaXNVc2VyQXV0aGVudGljYXRlZCIsInVzZXJuYW1lIiwicGFzc3dvcmQiLCJub3RpY2VzIiwic29mdHdhcmVWZXJzaW9uIiwidmVyc2lvbiIsImRpZFBsdW1iaW5nTm90aWNlQ3Jhc2giLCJhY3RpdmVOYXYiLCJwcm9qZWN0c0xpc3QiLCJ3aW4iLCJnZXRDdXJyZW50V2luZG93IiwicHJvY2VzcyIsImVudiIsIkRFViIsIm9wZW5EZXZUb29scyIsImRvY3VtZW50IiwiYWRkRXZlbnRMaXN0ZW5lciIsIm5hdGl2ZUV2ZW50IiwiX2xhc3RNb3VzZVgiLCJjbGllbnRYIiwiX2xhc3RNb3VzZVkiLCJjbGllbnRZIiwiY29tYm9rZXlzIiwiZG9jdW1lbnRFbGVtZW50IiwiZGVib3VuY2UiLCJ3ZWJzb2NrZXQiLCJzZW5kIiwibWV0aG9kIiwicGFyYW1zIiwibGVhZGluZyIsImR1bXBTeXN0ZW1JbmZvIiwib24iLCJ0eXBlIiwibmFtZSIsIm9wZW5UZXJtaW5hbCIsImV4ZWNTeW5jIiwiSlNPTiIsInN0cmluZ2lmeSIsImV4Y2VwdGlvbiIsImNvbnNvbGUiLCJ0aW1lc3RhbXAiLCJEYXRlIiwibm93IiwiZHVtcGRpciIsImpvaW4iLCJ3cml0ZUZpbGVTeW5jIiwiYXJndiIsImV4aXN0c1N5bmMiLCJyZWFkRmlsZVN5bmMiLCJ0b1N0cmluZyIsImFjdGl2ZUZvbGRlciIsInJlYWN0U3RhdGUiLCJfX2ZpbGVuYW1lIiwiX19kaXJuYW1lIiwiaG9tZWRpciIsImlzRGV2VG9vbHNPcGVuZWQiLCJjbG9zZURldlRvb2xzIiwicmVmcyIsInN0YWdlIiwidG9nZ2xlRGV2VG9vbHMiLCJ0aW1lbGluZSIsIm1heWJlUGFzdGVSZXF1ZXN0IiwicGFzdGVkVGV4dCIsInJlYWRUZXh0IiwicGFzdGVkRGF0YSIsInBhcnNlIiwid2FybiIsIkFycmF5IiwiaXNBcnJheSIsInBhc3RlZEVsZW1lbnQiLCJyZXF1ZXN0IiwidGl0bGUiLCJtZXNzYWdlIiwiY2xvc2VUZXh0IiwibGlnaHRTY2hlbWUiLCJsZW5ndGgiLCJIQUlLVV9SRUxFQVNFX0VOVklST05NRU5UIiwic2V0U3RhdGUiLCJjcmFzaE1lc3NhZ2UiLCJpbmZvIiwiZGF0YSIsImhhbmRsZUNvbnRlbnRQYXN0ZSIsImVudm95IiwicG9ydCIsImhhaWt1IiwiaG9zdCIsIldlYlNvY2tldCIsIndpbmRvdyIsImdldCIsInRoZW4iLCJ0b3VyQ2hhbm5lbCIsInNldERhc2hib2FyZFZpc2liaWxpdHkiLCJzZXRUaW1lb3V0Iiwic3RhcnQiLCJ0aHJvdHRsZSIsIm5vdGlmeVNjcmVlblJlc2l6ZSIsInBhc3RlRXZlbnQiLCJ0YWduYW1lIiwidGFyZ2V0IiwidGFnTmFtZSIsInRvTG93ZXJDYXNlIiwicHJldmVudERlZmF1bHQiLCJjYiIsImF1dGhBbnN3ZXIiLCJtZXJnZVRvUGF5bG9hZCIsImRpc3RpbmN0X2lkIiwiaGFpa3VUcmFjayIsImF1dGhUb2tlbiIsIm9yZ2FuaXphdGlvbk5hbWUiLCJpc0F1dGhlZCIsImxhdW5jaEZvbGRlciIsImZvbGRlckxvYWRpbmdFcnJvciIsIm9mZiIsInNlbGVjdG9yIiwid2VidmlldyIsImVsZW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwidG9wIiwibGVmdCIsInJlY2VpdmVFbGVtZW50Q29vcmRpbmF0ZXMiLCJyZWNlaXZlV2Vidmlld0Nvb3JkaW5hdGVzIiwiY29udGVudCIsImkiLCJuZXh0IiwicHJvamVjdEluZm8iLCJza2lwQ29udGVudENyZWF0aW9uIiwicHJvamVjdHNIb21lIiwicHJvamVjdFBhdGgiLCJhdXRob3JOYW1lIiwicHJvamVjdCIsIm9yZ2FuaXphdGlvbiIsImVyciIsImFzc2lnbiIsIm1heWJlUHJvamVjdE5hbWUiLCJpbmRleCIsImlkIiwidW5kZWZpbmVkIiwic2xpY2UiLCJlYWNoIiwibm90aWNlIiwiTWF0aCIsInJhbmRvbSIsInJlcGxhY2VkRXhpc3RpbmciLCJmb3JFYWNoIiwibiIsInNwbGljZSIsInVuc2hpZnQiLCJkcmFnRW5kTmF0aXZlRXZlbnQiLCJsaWJyYXJ5SXRlbUluZm8iLCJsaWJyYXJ5SXRlbURyYWdnaW5nIiwicHJldmlldyIsImhhbmRsZURyb3AiLCJkcmFnU3RhcnROYXRpdmVFdmVudCIsInBvc2l0aW9uIiwid2lkdGgiLCJoZWlnaHQiLCJyaWdodCIsIm1hcCIsImRpc3BsYXkiLCJ2ZXJ0aWNhbEFsaWduIiwidGV4dEFsaWduIiwiY29sb3IiLCJib3R0b20iLCJyZW5kZXJTdGFydHVwRGVmYXVsdFNjcmVlbiIsInRyYW5zZm9ybSIsImZvbnRTaXplIiwib3ZlcmZsb3ciLCJoYW5kbGVQYW5lUmVzaXplIiwic3dpdGNoQWN0aXZlTmF2Iiwib25MaWJyYXJ5RHJhZ0VuZCIsIm9uTGlicmFyeURyYWdTdGFydCIsImJhY2tncm91bmRDb2xvciIsIm9w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IFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgU3R5bGVSb290IH0gZnJvbSAncmFkaXVtJ1xuaW1wb3J0IFNwbGl0UGFuZSBmcm9tICdyZWFjdC1zcGxpdC1wYW5lJ1xuaW1wb3J0IFJlYWN0Q1NTVHJhbnNpdGlvbkdyb3VwIGZyb20gJ3JlYWN0LWFkZG9ucy1jc3MtdHJhbnNpdGlvbi1ncm91cCdcbmltcG9ydCBsb2Rhc2ggZnJvbSAnbG9kYXNoJ1xuaW1wb3J0IENvbWJva2V5cyBmcm9tICdjb21ib2tleXMnXG5pbXBvcnQgRXZlbnRFbWl0dGVyIGZyb20gJ2V2ZW50LWVtaXR0ZXInXG5pbXBvcnQgY3AgZnJvbSAnY2hpbGRfcHJvY2VzcydcbmltcG9ydCBvcyBmcm9tICdvcydcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQgZnMgZnJvbSAnZnMnXG5pbXBvcnQgQXV0aGVudGljYXRpb25VSSBmcm9tICcuL2NvbXBvbmVudHMvQXV0aGVudGljYXRpb25VSSdcbmltcG9ydCBQcm9qZWN0QnJvd3NlciBmcm9tICcuL2NvbXBvbmVudHMvUHJvamVjdEJyb3dzZXInXG5pbXBvcnQgU2lkZUJhciBmcm9tICcuL2NvbXBvbmVudHMvU2lkZUJhcidcbmltcG9ydCBMaWJyYXJ5IGZyb20gJy4vY29tcG9uZW50cy9saWJyYXJ5L0xpYnJhcnknXG5pbXBvcnQgU3RhdGVJbnNwZWN0b3IgZnJvbSAnLi9jb21wb25lbnRzL1N0YXRlSW5zcGVjdG9yL1N0YXRlSW5zcGVjdG9yJ1xuaW1wb3J0IFN0YWdlIGZyb20gJy4vY29tcG9uZW50cy9TdGFnZSdcbmltcG9ydCBUaW1lbGluZSBmcm9tICcuL2NvbXBvbmVudHMvVGltZWxpbmUnXG5pbXBvcnQgVG9hc3QgZnJvbSAnLi9jb21wb25lbnRzL25vdGlmaWNhdGlvbnMvVG9hc3QnXG5pbXBvcnQgVG91ciBmcm9tICcuL2NvbXBvbmVudHMvVG91ci9Ub3VyJ1xuaW1wb3J0IEVudm95Q2xpZW50IGZyb20gJ2hhaWt1LXNkay1jcmVhdG9yL2xpYi9lbnZveS9jbGllbnQnXG5pbXBvcnQge1xuICBIT01FRElSX1BBVEgsXG4gIEhPTUVESVJfTE9HU19QQVRIXG59IGZyb20gJ2hhaWt1LXNlcmlhbGl6YXRpb24vc3JjL3V0aWxzL0hhaWt1SG9tZURpcidcblxudmFyIHBrZyA9IHJlcXVpcmUoJy4vLi4vLi4vcGFja2FnZS5qc29uJylcblxudmFyIG1peHBhbmVsID0gcmVxdWlyZSgnLi8uLi91dGlscy9NaXhwYW5lbCcpXG5cbmNvbnN0IGVsZWN0cm9uID0gcmVxdWlyZSgnZWxlY3Ryb24nKVxuY29uc3QgcmVtb3RlID0gZWxlY3Ryb24ucmVtb3RlXG5jb25zdCBpcGNSZW5kZXJlciA9IGVsZWN0cm9uLmlwY1JlbmRlcmVyXG5jb25zdCBjbGlwYm9hcmQgPSBlbGVjdHJvbi5jbGlwYm9hcmRcblxudmFyIHdlYkZyYW1lID0gZWxlY3Ryb24ud2ViRnJhbWVcbmlmICh3ZWJGcmFtZSkge1xuICBpZiAod2ViRnJhbWUuc2V0Wm9vbUxldmVsTGltaXRzKSB3ZWJGcmFtZS5zZXRab29tTGV2ZWxMaW1pdHMoMSwgMSlcbiAgaWYgKHdlYkZyYW1lLnNldExheW91dFpvb21MZXZlbExpbWl0cykgd2ViRnJhbWUuc2V0TGF5b3V0Wm9vbUxldmVsTGltaXRzKDAsIDApXG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENyZWF0b3IgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3RvciAocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcylcbiAgICB0aGlzLmF1dGhlbnRpY2F0ZVVzZXIgPSB0aGlzLmF1dGhlbnRpY2F0ZVVzZXIuYmluZCh0aGlzKVxuICAgIHRoaXMuYXV0aGVudGljYXRpb25Db21wbGV0ZSA9IHRoaXMuYXV0aGVudGljYXRpb25Db21wbGV0ZS5iaW5kKHRoaXMpXG4gICAgdGhpcy5sb2FkUHJvamVjdHMgPSB0aGlzLmxvYWRQcm9qZWN0cy5iaW5kKHRoaXMpXG4gICAgdGhpcy5sYXVuY2hQcm9qZWN0ID0gdGhpcy5sYXVuY2hQcm9qZWN0LmJpbmQodGhpcylcbiAgICB0aGlzLnJlbW92ZU5vdGljZSA9IHRoaXMucmVtb3ZlTm90aWNlLmJpbmQodGhpcylcbiAgICB0aGlzLmNyZWF0ZU5vdGljZSA9IHRoaXMuY3JlYXRlTm90aWNlLmJpbmQodGhpcylcbiAgICB0aGlzLnJlbmRlck5vdGlmaWNhdGlvbnMgPSB0aGlzLnJlbmRlck5vdGlmaWNhdGlvbnMuYmluZCh0aGlzKVxuICAgIHRoaXMucmVjZWl2ZVByb2plY3RJbmZvID0gdGhpcy5yZWNlaXZlUHJvamVjdEluZm8uYmluZCh0aGlzKVxuICAgIHRoaXMuaGFuZGxlRmluZEVsZW1lbnRDb29yZGluYXRlcyA9IHRoaXMuaGFuZGxlRmluZEVsZW1lbnRDb29yZGluYXRlcy5iaW5kKHRoaXMpXG4gICAgdGhpcy5oYW5kbGVGaW5kV2Vidmlld0Nvb3JkaW5hdGVzID0gdGhpcy5oYW5kbGVGaW5kV2Vidmlld0Nvb3JkaW5hdGVzLmJpbmQodGhpcylcbiAgICB0aGlzLmxheW91dCA9IG5ldyBFdmVudEVtaXR0ZXIoKVxuXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIGVycm9yOiBudWxsLFxuICAgICAgcHJvamVjdEZvbGRlcjogdGhpcy5wcm9wcy5mb2xkZXIsXG4gICAgICBhcHBsaWNhdGlvbkltYWdlOiBudWxsLFxuICAgICAgcHJvamVjdE9iamVjdDogbnVsbCxcbiAgICAgIHByb2plY3ROYW1lOiBudWxsLFxuICAgICAgZGFzaGJvYXJkVmlzaWJsZTogIXRoaXMucHJvcHMuZm9sZGVyLFxuICAgICAgcmVhZHlGb3JBdXRoOiBmYWxzZSxcbiAgICAgIGlzVXNlckF1dGhlbnRpY2F0ZWQ6IGZhbHNlLFxuICAgICAgdXNlcm5hbWU6IG51bGwsXG4gICAgICBwYXNzd29yZDogbnVsbCxcbiAgICAgIG5vdGljZXM6IFtdLFxuICAgICAgc29mdHdhcmVWZXJzaW9uOiBwa2cudmVyc2lvbixcbiAgICAgIGRpZFBsdW1iaW5nTm90aWNlQ3Jhc2g6IGZhbHNlLFxuICAgICAgYWN0aXZlTmF2OiAnbGlicmFyeScsXG4gICAgICBwcm9qZWN0c0xpc3Q6IFtdXG4gICAgfVxuXG4gICAgY29uc3Qgd2luID0gcmVtb3RlLmdldEN1cnJlbnRXaW5kb3coKVxuXG4gICAgaWYgKHByb2Nlc3MuZW52LkRFViA9PT0gJzEnKSB7XG4gICAgICB3aW4ub3BlbkRldlRvb2xzKClcbiAgICB9XG5cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCAobmF0aXZlRXZlbnQpID0+IHtcbiAgICAgIHRoaXMuX2xhc3RNb3VzZVggPSBuYXRpdmVFdmVudC5jbGllbnRYXG4gICAgICB0aGlzLl9sYXN0TW91c2VZID0gbmF0aXZlRXZlbnQuY2xpZW50WVxuICAgIH0pXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignZHJhZycsIChuYXRpdmVFdmVudCkgPT4ge1xuICAgICAgLy8gV2hlbiB0aGUgZHJhZyBlbmRzLCBmb3Igc29tZSByZWFzb24gdGhlIHBvc2l0aW9uIGdvZXMgdG8gMCwgc28gaGFjayB0aGlzLi4uXG4gICAgICBpZiAobmF0aXZlRXZlbnQuY2xpZW50WCA+IDAgJiYgbmF0aXZlRXZlbnQuY2xpZW50WSA+IDApIHtcbiAgICAgICAgdGhpcy5fbGFzdE1vdXNlWCA9IG5hdGl2ZUV2ZW50LmNsaWVudFhcbiAgICAgICAgdGhpcy5fbGFzdE1vdXNlWSA9IG5hdGl2ZUV2ZW50LmNsaWVudFlcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgY29uc3QgY29tYm9rZXlzID0gbmV3IENvbWJva2V5cyhkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpXG4gICAgY29tYm9rZXlzLmJpbmQoJ2NvbW1hbmQrb3B0aW9uK2knLCBsb2Rhc2guZGVib3VuY2UoKCkgPT4ge1xuICAgICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQuc2VuZCh7IG1ldGhvZDogJ3RvZ2dsZURldlRvb2xzJywgcGFyYW1zOiBbdGhpcy5zdGF0ZS5wcm9qZWN0Rm9sZGVyXSB9KVxuICAgIH0sIDUwMCwgeyBsZWFkaW5nOiB0cnVlIH0pKVxuICAgIGNvbWJva2V5cy5iaW5kKCdjb21tYW5kK29wdGlvbiswJywgbG9kYXNoLmRlYm91bmNlKCgpID0+IHtcbiAgICAgIHRoaXMuZHVtcFN5c3RlbUluZm8oKVxuICAgIH0sIDUwMCwgeyBsZWFkaW5nOiB0cnVlIH0pKVxuXG4gICAgLy8gTk9URTogVGhlIFRvcE1lbnUgYXV0b21hdGljYWxseSBiaW5kcyB0aGUgYmVsb3cga2V5Ym9hcmQgc2hvcnRjdXRzL2FjY2VsZXJhdG9yc1xuICAgIGlwY1JlbmRlcmVyLm9uKCdnbG9iYWwtbWVudTp6b29tLWluJywgKCkgPT4ge1xuICAgICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQuc2VuZCh7IHR5cGU6ICdicm9hZGNhc3QnLCBuYW1lOiAndmlldzp6b29tLWluJyB9KVxuICAgIH0pXG4gICAgaXBjUmVuZGVyZXIub24oJ2dsb2JhbC1tZW51Onpvb20tb3V0JywgKCkgPT4ge1xuICAgICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQuc2VuZCh7IHR5cGU6ICdicm9hZGNhc3QnLCBuYW1lOiAndmlldzp6b29tLW91dCcgfSlcbiAgICB9KVxuICAgIGlwY1JlbmRlcmVyLm9uKCdnbG9iYWwtbWVudTpvcGVuLXRlcm1pbmFsJywgbG9kYXNoLmRlYm91bmNlKCgpID0+IHtcbiAgICAgIHRoaXMub3BlblRlcm1pbmFsKHRoaXMuc3RhdGUucHJvamVjdEZvbGRlcilcbiAgICB9LCA1MDAsIHsgbGVhZGluZzogdHJ1ZSB9KSlcbiAgICBpcGNSZW5kZXJlci5vbignZ2xvYmFsLW1lbnU6dW5kbycsIGxvZGFzaC5kZWJvdW5jZSgoKSA9PiB7XG4gICAgICB0aGlzLnByb3BzLndlYnNvY2tldC5zZW5kKHsgbWV0aG9kOiAnZ2l0VW5kbycsIHBhcmFtczogW3RoaXMuc3RhdGUucHJvamVjdEZvbGRlciwgeyB0eXBlOiAnZ2xvYmFsJyB9XSB9KVxuICAgIH0sIDUwMCwgeyBsZWFkaW5nOiB0cnVlIH0pKVxuICAgIGlwY1JlbmRlcmVyLm9uKCdnbG9iYWwtbWVudTpyZWRvJywgbG9kYXNoLmRlYm91bmNlKCgpID0+IHtcbiAgICAgIHRoaXMucHJvcHMud2Vic29ja2V0LnNlbmQoeyBtZXRob2Q6ICdnaXRSZWRvJywgcGFyYW1zOiBbdGhpcy5zdGF0ZS5wcm9qZWN0Rm9sZGVyLCB7IHR5cGU6ICdnbG9iYWwnIH1dIH0pXG4gICAgfSwgNTAwLCB7IGxlYWRpbmc6IHRydWUgfSkpXG4gIH1cblxuICBvcGVuVGVybWluYWwgKGZvbGRlcikge1xuICAgIHRyeSB7XG4gICAgICBjcC5leGVjU3luYygnb3BlbiAtYiBjb20uYXBwbGUudGVybWluYWwgJyArIEpTT04uc3RyaW5naWZ5KGZvbGRlcikgKyAnIHx8IHRydWUnKVxuICAgIH0gY2F0Y2ggKGV4Y2VwdGlvbikge1xuICAgICAgY29uc29sZS5lcnJvcihleGNlcHRpb24pXG4gICAgfVxuICB9XG5cbiAgZHVtcFN5c3RlbUluZm8gKCkge1xuICAgIGNvbnN0IHRpbWVzdGFtcCA9IERhdGUubm93KClcbiAgICBjb25zdCBkdW1wZGlyID0gcGF0aC5qb2luKEhPTUVESVJfUEFUSCwgJ2R1bXBzJywgYGR1bXAtJHt0aW1lc3RhbXB9YClcbiAgICBjcC5leGVjU3luYyhgbWtkaXIgLXAgJHtKU09OLnN0cmluZ2lmeShkdW1wZGlyKX1gKVxuICAgIGZzLndyaXRlRmlsZVN5bmMocGF0aC5qb2luKGR1bXBkaXIsICdhcmd2JyksIEpTT04uc3RyaW5naWZ5KHByb2Nlc3MuYXJndiwgbnVsbCwgMikpXG4gICAgZnMud3JpdGVGaWxlU3luYyhwYXRoLmpvaW4oZHVtcGRpciwgJ2VudicpLCBKU09OLnN0cmluZ2lmeShwcm9jZXNzLmVudiwgbnVsbCwgMikpXG4gICAgaWYgKGZzLmV4aXN0c1N5bmMocGF0aC5qb2luKEhPTUVESVJfTE9HU19QQVRILCAnaGFpa3UtZGVidWcubG9nJykpKSB7XG4gICAgICBmcy53cml0ZUZpbGVTeW5jKHBhdGguam9pbihkdW1wZGlyLCAnbG9nJyksIGZzLnJlYWRGaWxlU3luYyhwYXRoLmpvaW4oSE9NRURJUl9MT0dTX1BBVEgsICdoYWlrdS1kZWJ1Zy5sb2cnKSkudG9TdHJpbmcoKSlcbiAgICB9XG4gICAgZnMud3JpdGVGaWxlU3luYyhwYXRoLmpvaW4oZHVtcGRpciwgJ2luZm8nKSwgSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgYWN0aXZlRm9sZGVyOiB0aGlzLnN0YXRlLnByb2plY3RGb2xkZXIsXG4gICAgICByZWFjdFN0YXRlOiB0aGlzLnN0YXRlLFxuICAgICAgX19maWxlbmFtZTogX19maWxlbmFtZSxcbiAgICAgIF9fZGlybmFtZTogX19kaXJuYW1lXG4gICAgfSwgbnVsbCwgMikpXG4gICAgaWYgKHRoaXMuc3RhdGUucHJvamVjdEZvbGRlcikge1xuICAgICAgLy8gVGhlIHByb2plY3QgZm9sZGVyIGl0c2VsZiB3aWxsIGNvbnRhaW4gZ2l0IGxvZ3MgYW5kIG90aGVyIGdvb2RpZXMgd2UgbWdpaHQgd2FudCB0byBsb29rIGF0XG4gICAgICBjcC5leGVjU3luYyhgdGFyIC16Y3ZmICR7SlNPTi5zdHJpbmdpZnkocGF0aC5qb2luKGR1bXBkaXIsICdwcm9qZWN0LnRhci5neicpKX0gJHtKU09OLnN0cmluZ2lmeSh0aGlzLnN0YXRlLnByb2plY3RGb2xkZXIpfWApXG4gICAgfVxuICAgIC8vIEZvciBjb252ZW5pZW5jZSwgemlwIHVwIHRoZSBlbnRpcmUgZHVtcCBmb2xkZXIuLi5cbiAgICBjcC5leGVjU3luYyhgdGFyIC16Y3ZmICR7SlNPTi5zdHJpbmdpZnkocGF0aC5qb2luKG9zLmhvbWVkaXIoKSwgYGhhaWt1LWR1bXAtJHt0aW1lc3RhbXB9LnRhci5nemApKX0gJHtKU09OLnN0cmluZ2lmeShkdW1wZGlyKX1gKVxuICB9XG5cbiAgdG9nZ2xlRGV2VG9vbHMgKCkge1xuICAgIGNvbnN0IHdpbiA9IHJlbW90ZS5nZXRDdXJyZW50V2luZG93KClcbiAgICBpZiAod2luLmlzRGV2VG9vbHNPcGVuZWQoKSkgd2luLmNsb3NlRGV2VG9vbHMoKVxuICAgIGVsc2Ugd2luLm9wZW5EZXZUb29scygpXG4gICAgaWYgKHRoaXMucmVmcy5zdGFnZSkgdGhpcy5yZWZzLnN0YWdlLnRvZ2dsZURldlRvb2xzKClcbiAgICBpZiAodGhpcy5yZWZzLnRpbWVsaW5lKSB0aGlzLnJlZnMudGltZWxpbmUudG9nZ2xlRGV2VG9vbHMoKVxuICB9XG5cbiAgaGFuZGxlQ29udGVudFBhc3RlIChtYXliZVBhc3RlUmVxdWVzdCkge1xuICAgIGxldCBwYXN0ZWRUZXh0ID0gY2xpcGJvYXJkLnJlYWRUZXh0KClcbiAgICBpZiAoIXBhc3RlZFRleHQpIHJldHVybiB2b2lkICgwKVxuXG4gICAgLy8gVGhlIGRhdGEgb24gdGhlIGNsaXBib2FyZCBtaWdodCBiZSBzZXJpYWxpemVkIGRhdGEsIHNvIHRyeSB0byBwYXJzZSBpdCBpZiB0aGF0J3MgdGhlIGNhc2VcbiAgICAvLyBUaGUgbWFpbiBjYXNlIHdlIGhhdmUgbm93IGZvciBzZXJpYWxpemVkIGRhdGEgaXMgaGFpa3UgZWxlbWVudHMgY29waWVkIGZyb20gdGhlIHN0YWdlXG4gICAgbGV0IHBhc3RlZERhdGFcbiAgICB0cnkge1xuICAgICAgcGFzdGVkRGF0YSA9IEpTT04ucGFyc2UocGFzdGVkVGV4dClcbiAgICB9IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICAgIGNvbnNvbGUud2FybignW2NyZWF0b3JdIHVuYWJsZSB0byBwYXJzZSBwYXN0ZWQgZGF0YTsgaXQgbWlnaHQgYmUgcGxhaW4gdGV4dCcpXG4gICAgICBwYXN0ZWREYXRhID0gcGFzdGVkVGV4dFxuICAgIH1cblxuICAgIGlmIChBcnJheS5pc0FycmF5KHBhc3RlZERhdGEpKSB7XG4gICAgICAvLyBUaGlzIGxvb2tzIGxpa2UgYSBIYWlrdSBlbGVtZW50IHRoYXQgaGFzIGJlZW4gY29waWVkIGZyb20gdGhlIHN0YWdlXG4gICAgICBpZiAocGFzdGVkRGF0YVswXSA9PT0gJ2FwcGxpY2F0aW9uL2hhaWt1JyAmJiB0eXBlb2YgcGFzdGVkRGF0YVsxXSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgbGV0IHBhc3RlZEVsZW1lbnQgPSBwYXN0ZWREYXRhWzFdXG5cbiAgICAgICAgLy8gQ29tbWFuZCB0aGUgdmlld3MgYW5kIG1hc3RlciBwcm9jZXNzIHRvIGhhbmRsZSB0aGUgZWxlbWVudCBwYXN0ZSBhY3Rpb25cbiAgICAgICAgLy8gVGhlICdwYXN0ZVRoaW5nJyBhY3Rpb24gaXMgaW50ZW5kZWQgdG8gYmUgYWJsZSB0byBoYW5kbGUgbXVsdGlwbGUgY29udGVudCB0eXBlc1xuICAgICAgICByZXR1cm4gdGhpcy5wcm9wcy53ZWJzb2NrZXQucmVxdWVzdCh7IHR5cGU6ICdhY3Rpb24nLCBtZXRob2Q6ICdwYXN0ZVRoaW5nJywgcGFyYW1zOiBbdGhpcy5zdGF0ZS5wcm9qZWN0Rm9sZGVyLCBwYXN0ZWRFbGVtZW50LCBtYXliZVBhc3RlUmVxdWVzdCB8fCB7fV0gfSwgKGVycm9yKSA9PiB7XG4gICAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlTm90aWNlKHtcbiAgICAgICAgICAgICAgdHlwZTogJ3dhcm5pbmcnLFxuICAgICAgICAgICAgICB0aXRsZTogJ1VoIG9oIScsXG4gICAgICAgICAgICAgIG1lc3NhZ2U6ICdXZSBjb3VsZG5cXCd0IHBhc3RlIHRoYXQuIPCfmKIgUGxlYXNlIGNvbnRhY3QgSGFpa3UgZm9yIHN1cHBvcnQuJyxcbiAgICAgICAgICAgICAgY2xvc2VUZXh0OiAnT2theScsXG4gICAgICAgICAgICAgIGxpZ2h0U2NoZW1lOiB0cnVlXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIFRPRE86IEhhbmRsZSBvdGhlciBjYXNlcyB3aGVyZSB0aGUgcGFzdGUgZGF0YSB3YXMgYSBzZXJpYWxpemVkIGFycmF5XG4gICAgICAgIGNvbnNvbGUud2FybignW2NyZWF0b3JdIGNhbm5vdCBwYXN0ZSB0aGlzIGNvbnRlbnQgdHlwZSB5ZXQgKGFycmF5KScpXG4gICAgICAgIHRoaXMuY3JlYXRlTm90aWNlKHtcbiAgICAgICAgICB0eXBlOiAnd2FybmluZycsXG4gICAgICAgICAgdGl0bGU6ICdIbW1tJyxcbiAgICAgICAgICBtZXNzYWdlOiAnV2UgZG9uXFwndCBrbm93IGhvdyB0byBwYXN0ZSB0aGF0IGNvbnRlbnQgeWV0LiDwn5izJyxcbiAgICAgICAgICBjbG9zZVRleHQ6ICdPa2F5JyxcbiAgICAgICAgICBsaWdodFNjaGVtZTogdHJ1ZVxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBBbiBlbXB0eSBzdHJpbmcgaXMgdHJlYXRlZCBhcyB0aGUgZXF1aXZhbGVudCBvZiBub3RoaW5nIChkb24ndCBkaXNwbGF5IHdhcm5pbmcgaWYgbm90aGluZyB0byBpbnN0YW50aWF0ZSlcbiAgICAgIGlmICh0eXBlb2YgcGFzdGVkRGF0YSA9PT0gJ3N0cmluZycgJiYgcGFzdGVkRGF0YS5sZW5ndGggPiAwKSB7XG4gICAgICAgIC8vIFRPRE86IEhhbmRsZSB0aGUgY2FzZSB3aGVuIHBsYWluIHRleHQgaGFzIGJlZW4gcGFzdGVkIC0gU1ZHLCBIVE1MLCBldGM/XG4gICAgICAgIGNvbnNvbGUud2FybignW2NyZWF0b3JdIGNhbm5vdCBwYXN0ZSB0aGlzIGNvbnRlbnQgdHlwZSB5ZXQgKHVua25vd24gc3RyaW5nKScpXG4gICAgICAgIHRoaXMuY3JlYXRlTm90aWNlKHtcbiAgICAgICAgICB0eXBlOiAnd2FybmluZycsXG4gICAgICAgICAgdGl0bGU6ICdIbW1tJyxcbiAgICAgICAgICBtZXNzYWdlOiAnV2UgZG9uXFwndCBrbm93IGhvdyB0byBwYXN0ZSB0aGF0IGNvbnRlbnQgeWV0LiDwn5izJyxcbiAgICAgICAgICBjbG9zZVRleHQ6ICdPa2F5JyxcbiAgICAgICAgICBsaWdodFNjaGVtZTogdHJ1ZVxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxNb3VudCAoKSB7XG4gICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQub24oJ2Jyb2FkY2FzdCcsIChtZXNzYWdlKSA9PiB7XG4gICAgICBzd2l0Y2ggKG1lc3NhZ2UubmFtZSkge1xuICAgICAgICBjYXNlICdkZXYtdG9vbHM6dG9nZ2xlJzpcbiAgICAgICAgICB0aGlzLnRvZ2dsZURldlRvb2xzKClcbiAgICAgICAgICBicmVha1xuXG4gICAgICAgIGNhc2UgJ2NyYXNoJzpcbiAgICAgICAgICBpZiAocHJvY2Vzcy5lbnYuSEFJS1VfUkVMRUFTRV9FTlZJUk9OTUVOVCAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgZGlkUGx1bWJpbmdOb3RpY2VDcmFzaDogdHJ1ZSwgY3Jhc2hNZXNzYWdlOiBtZXNzYWdlIH0pXG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrXG5cbiAgICAgICAgY2FzZSAnY3VycmVudC1wYXN0ZWFibGU6cmVxdWVzdC1wYXN0ZSc6XG4gICAgICAgICAgY29uc29sZS5pbmZvKCdbY3JlYXRvcl0gY3VycmVudC1wYXN0ZWFibGU6cmVxdWVzdC1wYXN0ZScsIG1lc3NhZ2UuZGF0YSlcbiAgICAgICAgICByZXR1cm4gdGhpcy5oYW5kbGVDb250ZW50UGFzdGUobWVzc2FnZS5kYXRhKVxuICAgICAgfVxuICAgIH0pXG5cbiAgICB0aGlzLmVudm95ID0gbmV3IEVudm95Q2xpZW50KHtcbiAgICAgIHBvcnQ6IHRoaXMucHJvcHMuaGFpa3UuZW52b3kucG9ydCxcbiAgICAgIGhvc3Q6IHRoaXMucHJvcHMuaGFpa3UuZW52b3kuaG9zdCxcbiAgICAgIFdlYlNvY2tldDogd2luZG93LldlYlNvY2tldFxuICAgIH0pXG5cbiAgICB0aGlzLmVudm95LmdldCgndG91cicpLnRoZW4oKHRvdXJDaGFubmVsKSA9PiB7XG4gICAgICB0aGlzLnRvdXJDaGFubmVsID0gdG91ckNoYW5uZWxcblxuICAgICAgdG91ckNoYW5uZWwub24oJ3RvdXI6cmVxdWVzdEVsZW1lbnRDb29yZGluYXRlcycsIHRoaXMuaGFuZGxlRmluZEVsZW1lbnRDb29yZGluYXRlcylcblxuICAgICAgdG91ckNoYW5uZWwub24oJ3RvdXI6cmVxdWVzdFdlYnZpZXdDb29yZGluYXRlcycsIHRoaXMuaGFuZGxlRmluZFdlYnZpZXdDb29yZGluYXRlcylcblxuICAgICAgaXBjUmVuZGVyZXIub24oJ2dsb2JhbC1tZW51OnN0YXJ0LXRvdXInLCAoKSA9PiB7XG4gICAgICAgIHRoaXMuc2V0RGFzaGJvYXJkVmlzaWJpbGl0eSh0cnVlKVxuXG4gICAgICAgIC8vIFB1dCBpdCBhdCB0aGUgYm90dG9tIG9mIHRoZSBldmVudCBsb29wXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIC8vIHRvdXJDaGFubmVsLm5vdGlmeVNjcmVlblJlc2l6ZSgpXG4gICAgICAgICAgdG91ckNoYW5uZWwuc3RhcnQodHJ1ZSlcbiAgICAgICAgfSlcbiAgICAgIH0pXG5cbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCBsb2Rhc2gudGhyb3R0bGUoKCkgPT4ge1xuICAgICAgICAvLyBpZiAodG91ckNoYW5uZWwuaXNUb3VyQWN0aXZlKCkpIHtcbiAgICAgICAgdG91ckNoYW5uZWwubm90aWZ5U2NyZWVuUmVzaXplKClcbiAgICAgICAgLy8gfVxuICAgICAgfSksIDMwMClcbiAgICB9KVxuXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigncGFzdGUnLCAocGFzdGVFdmVudCkgPT4ge1xuICAgICAgY29uc29sZS5pbmZvKCdbY3JlYXRvcl0gcGFzdGUgaGVhcmQnKVxuICAgICAgbGV0IHRhZ25hbWUgPSBwYXN0ZUV2ZW50LnRhcmdldC50YWdOYW1lLnRvTG93ZXJDYXNlKClcbiAgICAgIGlmICh0YWduYW1lID09PSAnaW5wdXQnIHx8IHRhZ25hbWUgPT09ICd0ZXh0YXJlYScpIHtcbiAgICAgICAgLy8gRG8gbm90aGluZzsgbGV0IGlucHV0IGZpZWxkcyBhbmQgc28tb24gYmUgaGFuZGxlZCBub3JtYWxseVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gT3RoZXJ3aXNlLCBhc3N1bWUgd2UgbWlnaHQgbmVlZCB0byBoYW5kbGUgdGhpcyBwYXN0ZSBldmVudCBzcGVjaWFsbHlcbiAgICAgICAgcGFzdGVFdmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgIHRoaXMuaGFuZGxlQ29udGVudFBhc3RlKClcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQub24oJ21ldGhvZCcsIChtZXRob2QsIHBhcmFtcywgY2IpID0+IHtcbiAgICAgIGNvbnNvbGUuaW5mbygnW2NyZWF0b3JdIG1ldGhvZCBmcm9tIHBsdW1iaW5nOicsIG1ldGhvZCwgcGFyYW1zKVxuICAgICAgLy8gbm8tb3A7IGNyZWF0b3IgZG9lc24ndCBjdXJyZW50bHkgcmVjZWl2ZSBhbnkgbWV0aG9kcyBmcm9tIHRoZSBvdGhlciB2aWV3cywgYnV0IHdlIG5lZWQgdGhpc1xuICAgICAgLy8gY2FsbGJhY2sgdG8gYmUgY2FsbGVkIHRvIGFsbG93IHRoZSBhY3Rpb24gY2hhaW4gaW4gcGx1bWJpbmcgdG8gcHJvY2VlZFxuICAgICAgcmV0dXJuIGNiKClcbiAgICB9KVxuXG4gICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQub24oJ29wZW4nLCAoKSA9PiB7XG4gICAgICB0aGlzLnByb3BzLndlYnNvY2tldC5yZXF1ZXN0KHsgbWV0aG9kOiAnaXNVc2VyQXV0aGVudGljYXRlZCcsIHBhcmFtczogW10gfSwgKGVycm9yLCBhdXRoQW5zd2VyKSA9PiB7XG4gICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpXG4gICAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlTm90aWNlKHtcbiAgICAgICAgICAgIHR5cGU6ICdlcnJvcicsXG4gICAgICAgICAgICB0aXRsZTogJ09oIG5vIScsXG4gICAgICAgICAgICBtZXNzYWdlOiAnV2UgaGFkIGEgcHJvYmxlbSBhY2Nlc3NpbmcgeW91ciBhY2NvdW50LiDwn5iiIFBsZWFzZSB0cnkgY2xvc2luZyBhbmQgcmVvcGVuaW5nIHRoZSBhcHBsaWNhdGlvbi4gSWYgeW91IHN0aWxsIHNlZSB0aGlzIG1lc3NhZ2UsIGNvbnRhY3QgSGFpa3UgZm9yIHN1cHBvcnQuJyxcbiAgICAgICAgICAgIGNsb3NlVGV4dDogJ09rYXknLFxuICAgICAgICAgICAgbGlnaHRTY2hlbWU6IHRydWVcbiAgICAgICAgICB9KVxuICAgICAgICB9XG5cbiAgICAgICAgbWl4cGFuZWwubWVyZ2VUb1BheWxvYWQoeyBkaXN0aW5jdF9pZDogYXV0aEFuc3dlciAmJiBhdXRoQW5zd2VyLnVzZXJuYW1lIH0pXG4gICAgICAgIG1peHBhbmVsLmhhaWt1VHJhY2soJ2NyZWF0b3I6b3BlbmVkJylcblxuICAgICAgICAvLyBEZWxheSBzbyB0aGUgZGVmYXVsdCBzdGFydHVwIHNjcmVlbiBkb2Vzbid0IGp1c3QgZmxhc2ggdGhlbiBnbyBhd2F5XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgcmVhZHlGb3JBdXRoOiB0cnVlLFxuICAgICAgICAgICAgYXV0aFRva2VuOiBhdXRoQW5zd2VyICYmIGF1dGhBbnN3ZXIuYXV0aFRva2VuLFxuICAgICAgICAgICAgb3JnYW5pemF0aW9uTmFtZTogYXV0aEFuc3dlciAmJiBhdXRoQW5zd2VyLm9yZ2FuaXphdGlvbk5hbWUsXG4gICAgICAgICAgICB1c2VybmFtZTogYXV0aEFuc3dlciAmJiBhdXRoQW5zd2VyLnVzZXJuYW1lLFxuICAgICAgICAgICAgaXNVc2VyQXV0aGVudGljYXRlZDogYXV0aEFuc3dlciAmJiBhdXRoQW5zd2VyLmlzQXV0aGVkXG4gICAgICAgICAgfSlcbiAgICAgICAgICBpZiAodGhpcy5wcm9wcy5mb2xkZXIpIHtcbiAgICAgICAgICAgIC8vIExhdW5jaCBmb2xkZXIgZGlyZWN0bHkgLSBpLmUuIGFsbG93IGEgJ3N1YmwnIGxpa2UgZXhwZXJpZW5jZSB3aXRob3V0IGhhdmluZyB0byBnb1xuICAgICAgICAgICAgLy8gdGhyb3VnaCB0aGUgcHJvamVjdHMgaW5kZXhcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmxhdW5jaEZvbGRlcihudWxsLCB0aGlzLnByb3BzLmZvbGRlciwgKGVycm9yKSA9PiB7XG4gICAgICAgICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGZvbGRlckxvYWRpbmdFcnJvcjogZXJyb3IgfSlcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jcmVhdGVOb3RpY2Uoe1xuICAgICAgICAgICAgICAgICAgdHlwZTogJ2Vycm9yJyxcbiAgICAgICAgICAgICAgICAgIHRpdGxlOiAnT2ggbm8hJyxcbiAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdXZSB3ZXJlIHVuYWJsZSB0byBvcGVuIHRoZSBmb2xkZXIuIPCfmKIgUGxlYXNlIGNsb3NlIGFuZCByZW9wZW4gdGhlIGFwcGxpY2F0aW9uIGFuZCB0cnkgYWdhaW4uIElmIHlvdSBzdGlsbCBzZWUgdGhpcyBtZXNzYWdlLCBjb250YWN0IEhhaWt1IGZvciBzdXBwb3J0LicsXG4gICAgICAgICAgICAgICAgICBjbG9zZVRleHQ6ICdPa2F5JyxcbiAgICAgICAgICAgICAgICAgIGxpZ2h0U2NoZW1lOiB0cnVlXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9XG4gICAgICAgIH0sIDEwMDApXG4gICAgICB9KVxuICAgIH0pXG4gIH1cblxuICBjb21wb25lbnRXaWxsVW5tb3VudCAoKSB7XG4gICAgdGhpcy50b3VyQ2hhbm5lbC5vZmYoJ3RvdXI6cmVxdWVzdEVsZW1lbnRDb29yZGluYXRlcycsIHRoaXMuaGFuZGxlRmluZEVsZW1lbnRDb29yZGluYXRlcylcbiAgICB0aGlzLnRvdXJDaGFubmVsLm9mZigndG91cjpyZXF1ZXN0V2Vidmlld0Nvb3JkaW5hdGVzJywgdGhpcy5oYW5kbGVGaW5kV2Vidmlld0Nvb3JkaW5hdGVzKVxuICB9XG5cbiAgaGFuZGxlRmluZEVsZW1lbnRDb29yZGluYXRlcyAoeyBzZWxlY3Rvciwgd2VidmlldyB9KSB7XG4gICAgaWYgKHdlYnZpZXcgIT09ICdjcmVhdG9yJykgeyByZXR1cm4gfVxuXG4gICAgdHJ5IHtcbiAgICAgIC8vIFRPRE86IGZpbmQgaWYgdGhlcmUgaXMgYSBiZXR0ZXIgc29sdXRpb24gdG8gdGhpcyBzY2FwZSBoYXRjaFxuICAgICAgbGV0IGVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKVxuICAgICAgbGV0IHsgdG9wLCBsZWZ0IH0gPSBlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG5cbiAgICAgIHRoaXMudG91ckNoYW5uZWwucmVjZWl2ZUVsZW1lbnRDb29yZGluYXRlcygnY3JlYXRvcicsIHsgdG9wLCBsZWZ0IH0pXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoYFtjcmVhdG9yXSBlcnJvciBmZXRjaGluZyAke3NlbGVjdG9yfSBpbiB3ZWJ2aWV3ICR7d2Vidmlld31gKVxuICAgIH1cbiAgfVxuXG4gIGhhbmRsZUZpbmRXZWJ2aWV3Q29vcmRpbmF0ZXMgKCkge1xuICAgIHRoaXMudG91ckNoYW5uZWwucmVjZWl2ZVdlYnZpZXdDb29yZGluYXRlcygnY3JlYXRvcicsIHsgdG9wOiAwLCBsZWZ0OiAwIH0pXG4gIH1cblxuICBoYW5kbGVQYW5lUmVzaXplICgpIHtcbiAgICAvLyB0aGlzLmxheW91dC5lbWl0KCdyZXNpemUnKVxuICB9XG5cbiAgcmVuZGVyTm90aWZpY2F0aW9ucyAoY29udGVudCwgaSkge1xuICAgIHJldHVybiAoXG4gICAgICA8VG9hc3RcbiAgICAgICAgdG9hc3RUeXBlPXtjb250ZW50LnR5cGV9XG4gICAgICAgIHRvYXN0VGl0bGU9e2NvbnRlbnQudGl0bGV9XG4gICAgICAgIHRvYXN0TWVzc2FnZT17Y29udGVudC5tZXNzYWdlfVxuICAgICAgICBjbG9zZVRleHQ9e2NvbnRlbnQuY2xvc2VUZXh0fVxuICAgICAgICBrZXk9e2kgKyBjb250ZW50LnRpdGxlfVxuICAgICAgICBteUtleT17aX1cbiAgICAgICAgcmVtb3ZlTm90aWNlPXt0aGlzLnJlbW92ZU5vdGljZX1cbiAgICAgICAgbGlnaHRTY2hlbWU9e2NvbnRlbnQubGlnaHRTY2hlbWV9IC8+XG4gICAgKVxuICB9XG5cbiAgc2V0RGFzaGJvYXJkVmlzaWJpbGl0eSAoZGFzaGJvYXJkVmlzaWJsZSkge1xuICAgIHRoaXMuc2V0U3RhdGUoe2Rhc2hib2FyZFZpc2libGV9KVxuICB9XG5cbiAgc3dpdGNoQWN0aXZlTmF2IChhY3RpdmVOYXYpIHtcbiAgICB0aGlzLnNldFN0YXRlKHthY3RpdmVOYXZ9KVxuXG4gICAgaWYgKGFjdGl2ZU5hdiA9PT0gJ3N0YXRlX2luc3BlY3RvcicpIHtcbiAgICAgIHRoaXMudG91ckNoYW5uZWwubmV4dCgpXG4gICAgfVxuICB9XG5cbiAgYXV0aGVudGljYXRlVXNlciAodXNlcm5hbWUsIHBhc3N3b3JkLCBjYikge1xuICAgIHJldHVybiB0aGlzLnByb3BzLndlYnNvY2tldC5yZXF1ZXN0KHsgbWV0aG9kOiAnYXV0aGVudGljYXRlVXNlcicsIHBhcmFtczogW3VzZXJuYW1lLCBwYXNzd29yZF0gfSwgKGVycm9yLCBhdXRoQW5zd2VyKSA9PiB7XG4gICAgICBpZiAoZXJyb3IpIHJldHVybiBjYihlcnJvcilcbiAgICAgIG1peHBhbmVsLm1lcmdlVG9QYXlsb2FkKHsgZGlzdGluY3RfaWQ6IHVzZXJuYW1lIH0pXG4gICAgICBtaXhwYW5lbC5oYWlrdVRyYWNrKCdjcmVhdG9yOnVzZXItYXV0aGVudGljYXRlZCcsIHsgdXNlcm5hbWUgfSlcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICB1c2VybmFtZSxcbiAgICAgICAgcGFzc3dvcmQsXG4gICAgICAgIGF1dGhUb2tlbjogYXV0aEFuc3dlciAmJiBhdXRoQW5zd2VyLmF1dGhUb2tlbixcbiAgICAgICAgb3JnYW5pemF0aW9uTmFtZTogYXV0aEFuc3dlciAmJiBhdXRoQW5zd2VyLm9yZ2FuaXphdGlvbk5hbWUsXG4gICAgICAgIGlzVXNlckF1dGhlbnRpY2F0ZWQ6IGF1dGhBbnN3ZXIgJiYgYXV0aEFuc3dlci5pc0F1dGhlZFxuICAgICAgfSlcbiAgICAgIHJldHVybiBjYihudWxsLCBhdXRoQW5zd2VyKVxuICAgIH0pXG4gIH1cblxuICBhdXRoZW50aWNhdGlvbkNvbXBsZXRlICgpIHtcbiAgICByZXR1cm4gdGhpcy5zZXRTdGF0ZSh7IGlzVXNlckF1dGhlbnRpY2F0ZWQ6IHRydWUgfSlcbiAgfVxuXG4gIHJlY2VpdmVQcm9qZWN0SW5mbyAocHJvamVjdEluZm8pIHtcbiAgICAvLyBOTy1PUFxuICB9XG5cbiAgbG9hZFByb2plY3RzIChjYikge1xuICAgIHJldHVybiB0aGlzLnByb3BzLndlYnNvY2tldC5yZXF1ZXN0KHsgbWV0aG9kOiAnbGlzdFByb2plY3RzJywgcGFyYW1zOiBbXSB9LCAoZXJyb3IsIHByb2plY3RzTGlzdCkgPT4ge1xuICAgICAgaWYgKGVycm9yKSByZXR1cm4gY2IoZXJyb3IpXG4gICAgICB0aGlzLnNldFN0YXRlKHsgcHJvamVjdHNMaXN0IH0pXG4gICAgICByZXR1cm4gY2IobnVsbCwgcHJvamVjdHNMaXN0KVxuICAgIH0pXG4gIH1cblxuICBsYXVuY2hQcm9qZWN0IChwcm9qZWN0TmFtZSwgcHJvamVjdE9iamVjdCwgY2IpIHtcbiAgICBwcm9qZWN0T2JqZWN0ID0ge1xuICAgICAgc2tpcENvbnRlbnRDcmVhdGlvbjogdHJ1ZSwgLy8gVkVSWSBJTVBPUlRBTlQgLSBpZiBub3Qgc2V0IHRvIHRydWUsIHdlIGNhbiBlbmQgdXAgaW4gYSBzaXR1YXRpb24gd2hlcmUgd2Ugb3ZlcndyaXRlIGZyZXNobHkgY2xvbmVkIGNvbnRlbnQgZnJvbSB0aGUgcmVtb3RlIVxuICAgICAgcHJvamVjdHNIb21lOiBwcm9qZWN0T2JqZWN0LnByb2plY3RzSG9tZSxcbiAgICAgIHByb2plY3RQYXRoOiBwcm9qZWN0T2JqZWN0LnByb2plY3RQYXRoLFxuICAgICAgb3JnYW5pemF0aW9uTmFtZTogdGhpcy5zdGF0ZS5vcmdhbml6YXRpb25OYW1lLFxuICAgICAgYXV0aG9yTmFtZTogdGhpcy5zdGF0ZS51c2VybmFtZSxcbiAgICAgIHByb2plY3ROYW1lIC8vIEhhdmUgdG8gc2V0IHRoaXMgaGVyZSwgYmVjYXVzZSB3ZSBwYXNzIHRoaXMgd2hvbGUgb2JqZWN0IHRvIFN0YXRlVGl0bGVCYXIsIHdoaWNoIG5lZWRzIHRoaXMgdG8gcHJvcGVybHkgY2FsbCBzYXZlUHJvamVjdFxuICAgIH1cblxuICAgIG1peHBhbmVsLmhhaWt1VHJhY2soJ2NyZWF0b3I6cHJvamVjdDpsYXVuY2hpbmcnLCB7XG4gICAgICB1c2VybmFtZTogdGhpcy5zdGF0ZS51c2VybmFtZSxcbiAgICAgIHByb2plY3Q6IHByb2plY3ROYW1lLFxuICAgICAgb3JnYW5pemF0aW9uOiB0aGlzLnN0YXRlLm9yZ2FuaXphdGlvbk5hbWVcbiAgICB9KVxuXG4gICAgcmV0dXJuIHRoaXMucHJvcHMud2Vic29ja2V0LnJlcXVlc3QoeyBtZXRob2Q6ICdpbml0aWFsaXplUHJvamVjdCcsIHBhcmFtczogW3Byb2plY3ROYW1lLCBwcm9qZWN0T2JqZWN0LCB0aGlzLnN0YXRlLnVzZXJuYW1lLCB0aGlzLnN0YXRlLnBhc3N3b3JkXSB9LCAoZXJyLCBwcm9qZWN0Rm9sZGVyKSA9PiB7XG4gICAgICBpZiAoZXJyKSByZXR1cm4gY2IoZXJyKVxuXG4gICAgICByZXR1cm4gdGhpcy5wcm9wcy53ZWJzb2NrZXQucmVxdWVzdCh7IG1ldGhvZDogJ3N0YXJ0UHJvamVjdCcsIHBhcmFtczogW3Byb2plY3ROYW1lLCBwcm9qZWN0Rm9sZGVyXSB9LCAoZXJyLCBhcHBsaWNhdGlvbkltYWdlKSA9PiB7XG4gICAgICAgIGlmIChlcnIpIHJldHVybiBjYihlcnIpXG5cbiAgICAgICAgLy8gQXNzaWduLCBub3QgbWVyZ2UsIHNpbmNlIHdlIGRvbid0IHdhbnQgdG8gY2xvYmJlciBhbnkgdmFyaWFibGVzIGFscmVhZHkgc2V0LCBsaWtlIHByb2plY3QgbmFtZVxuICAgICAgICBsb2Rhc2guYXNzaWduKHByb2plY3RPYmplY3QsIGFwcGxpY2F0aW9uSW1hZ2UucHJvamVjdClcblxuICAgICAgICBtaXhwYW5lbC5oYWlrdVRyYWNrKCdjcmVhdG9yOnByb2plY3Q6bGF1bmNoZWQnLCB7XG4gICAgICAgICAgdXNlcm5hbWU6IHRoaXMuc3RhdGUudXNlcm5hbWUsXG4gICAgICAgICAgcHJvamVjdDogcHJvamVjdE5hbWUsXG4gICAgICAgICAgb3JnYW5pemF0aW9uOiB0aGlzLnN0YXRlLm9yZ2FuaXphdGlvbk5hbWVcbiAgICAgICAgfSlcblxuICAgICAgICAvLyBOb3cgaGFja2lseSBjaGFuZ2Ugc29tZSBwb2ludGVycyBzbyB3ZSdyZSByZWZlcnJpbmcgdG8gdGhlIGNvcnJlY3QgcGxhY2VcbiAgICAgICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQuZm9sZGVyID0gcHJvamVjdEZvbGRlciAvLyBEbyBub3QgcmVtb3ZlIHRoaXMgbmVjZXNzYXJ5IGhhY2sgcGx6XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyBwcm9qZWN0Rm9sZGVyLCBhcHBsaWNhdGlvbkltYWdlLCBwcm9qZWN0T2JqZWN0LCBwcm9qZWN0TmFtZSwgZGFzaGJvYXJkVmlzaWJsZTogZmFsc2UgfSlcblxuICAgICAgICByZXR1cm4gY2IoKVxuICAgICAgfSlcbiAgICB9KVxuICB9XG5cbiAgbGF1bmNoRm9sZGVyIChtYXliZVByb2plY3ROYW1lLCBwcm9qZWN0Rm9sZGVyLCBjYikge1xuICAgIG1peHBhbmVsLmhhaWt1VHJhY2soJ2NyZWF0b3I6Zm9sZGVyOmxhdW5jaGluZycsIHtcbiAgICAgIHVzZXJuYW1lOiB0aGlzLnN0YXRlLnVzZXJuYW1lLFxuICAgICAgcHJvamVjdDogbWF5YmVQcm9qZWN0TmFtZVxuICAgIH0pXG5cbiAgICAvLyBUaGUgbGF1bmNoUHJvamVjdCBtZXRob2QgaGFuZGxlcyB0aGUgcGVyZm9ybUZvbGRlclBvaW50ZXJDaGFuZ2VcbiAgICByZXR1cm4gdGhpcy5sYXVuY2hQcm9qZWN0KG1heWJlUHJvamVjdE5hbWUsIHsgcHJvamVjdFBhdGg6IHByb2plY3RGb2xkZXIgfSwgY2IpXG4gIH1cblxuICByZW1vdmVOb3RpY2UgKGluZGV4LCBpZCkge1xuICAgIGNvbnN0IG5vdGljZXMgPSB0aGlzLnN0YXRlLm5vdGljZXNcbiAgICBpZiAoaW5kZXggIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIG5vdGljZXM6IFsuLi5ub3RpY2VzLnNsaWNlKDAsIGluZGV4KSwgLi4ubm90aWNlcy5zbGljZShpbmRleCArIDEpXVxuICAgICAgfSlcbiAgICB9IGVsc2UgaWYgKGlkICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIC8vIEhhY2thcm9vXG4gICAgICBsb2Rhc2guZWFjaChub3RpY2VzLCAobm90aWNlLCBpbmRleCkgPT4ge1xuICAgICAgICBpZiAobm90aWNlLmlkID09PSBpZCkgdGhpcy5yZW1vdmVOb3RpY2UoaW5kZXgpXG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIGNyZWF0ZU5vdGljZSAobm90aWNlKSB7XG4gICAgLyogRXhwZWN0cyB0aGUgb2JqZWN0OlxuICAgIHsgdHlwZTogc3RyaW5nIChpbmZvLCBzdWNjZXNzLCBkYW5nZXIgKG9yIGVycm9yKSwgd2FybmluZylcbiAgICAgIHRpdGxlOiBzdHJpbmcsXG4gICAgICBtZXNzYWdlOiBzdHJpbmcsXG4gICAgICBjbG9zZVRleHQ6IHN0cmluZyAob3B0aW9uYWwsIGRlZmF1bHRzIHRvICdjbG9zZScpXG4gICAgICBsaWdodFNjaGVtZTogYm9vbCAob3B0aW9uYWwsIGRlZmF1bHRzIHRvIGRhcmspXG4gICAgfSAqL1xuXG4gICAgbm90aWNlLmlkID0gTWF0aC5yYW5kb20oKSArICcnXG5cbiAgICBjb25zdCBub3RpY2VzID0gdGhpcy5zdGF0ZS5ub3RpY2VzXG4gICAgbGV0IHJlcGxhY2VkRXhpc3RpbmcgPSBmYWxzZVxuXG4gICAgbm90aWNlcy5mb3JFYWNoKChuLCBpKSA9PiB7XG4gICAgICBpZiAobi5tZXNzYWdlID09PSBub3RpY2UubWVzc2FnZSkge1xuICAgICAgICBub3RpY2VzLnNwbGljZShpLCAxKVxuICAgICAgICByZXBsYWNlZEV4aXN0aW5nID0gdHJ1ZVxuICAgICAgICB0aGlzLnNldFN0YXRlKHsgbm90aWNlcyB9LCAoKSA9PiB7XG4gICAgICAgICAgbm90aWNlcy51bnNoaWZ0KG5vdGljZSlcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgbm90aWNlcyB9KVxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH0pXG5cbiAgICBpZiAoIXJlcGxhY2VkRXhpc3RpbmcpIHtcbiAgICAgIG5vdGljZXMudW5zaGlmdChub3RpY2UpXG4gICAgICB0aGlzLnNldFN0YXRlKHsgbm90aWNlcyB9KVxuICAgIH1cblxuICAgIHJldHVybiBub3RpY2VcbiAgfVxuXG4gIG9uTGlicmFyeURyYWdFbmQgKGRyYWdFbmROYXRpdmVFdmVudCwgbGlicmFyeUl0ZW1JbmZvKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7IGxpYnJhcnlJdGVtRHJhZ2dpbmc6IG51bGwgfSlcbiAgICBpZiAobGlicmFyeUl0ZW1JbmZvICYmIGxpYnJhcnlJdGVtSW5mby5wcmV2aWV3KSB7XG4gICAgICB0aGlzLnJlZnMuc3RhZ2UuaGFuZGxlRHJvcChsaWJyYXJ5SXRlbUluZm8sIHRoaXMuX2xhc3RNb3VzZVgsIHRoaXMuX2xhc3RNb3VzZVkpXG4gICAgfVxuICB9XG5cbiAgb25MaWJyYXJ5RHJhZ1N0YXJ0IChkcmFnU3RhcnROYXRpdmVFdmVudCwgbGlicmFyeUl0ZW1JbmZvKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7IGxpYnJhcnlJdGVtRHJhZ2dpbmc6IGxpYnJhcnlJdGVtSW5mbyB9KVxuICB9XG5cbiAgcmVuZGVyU3RhcnR1cERlZmF1bHRTY3JlZW4gKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IHN0eWxlPXt7IHBvc2l0aW9uOiAnYWJzb2x1dGUnLCB3aWR0aDogJzEwMCUnLCBoZWlnaHQ6ICcxMDAlJyB9fT5cbiAgICAgICAgPFJlYWN0Q1NTVHJhbnNpdGlvbkdyb3VwXG4gICAgICAgICAgdHJhbnNpdGlvbk5hbWU9J3RvYXN0J1xuICAgICAgICAgIHRyYW5zaXRpb25FbnRlclRpbWVvdXQ9ezUwMH1cbiAgICAgICAgICB0cmFuc2l0aW9uTGVhdmVUaW1lb3V0PXszMDB9PlxuICAgICAgICAgIDxkaXYgc3R5bGU9e3twb3NpdGlvbjogJ2Fic29sdXRlJywgcmlnaHQ6IDAsIHRvcDogMCwgd2lkdGg6IDMwMH19PlxuICAgICAgICAgICAge2xvZGFzaC5tYXAodGhpcy5zdGF0ZS5ub3RpY2VzLCB0aGlzLnJlbmRlck5vdGlmaWNhdGlvbnMpfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L1JlYWN0Q1NTVHJhbnNpdGlvbkdyb3VwPlxuICAgICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6ICd0YWJsZScsIHdpZHRoOiAnMTAwJScsIGhlaWdodDogJzEwMCUnLCBwb3NpdGlvbjogJ2Fic29sdXRlJywgdG9wOiAwLCBsZWZ0OiAwIH19PlxuICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ3RhYmxlLWNlbGwnLCB3aWR0aDogJzEwMCUnLCBoZWlnaHQ6ICcxMDAlJywgdmVydGljYWxBbGlnbjogJ21pZGRsZScsIHRleHRBbGlnbjogJ2NlbnRlcicgfX0+XG4gICAgICAgICAgICA8c3ZnIHdpZHRoPScxNzBweCcgaGVpZ2h0PScyMjFweCcgdmlld0JveD0nMCAwIDE3MCAyMjEnIHZlcnNpb249JzEuMSc+XG4gICAgICAgICAgICAgIDxnIGlkPSdQYWdlLTEnIHN0cm9rZT0nbm9uZScgc3Ryb2tlV2lkdGg9JzEnIGZpbGw9J25vbmUnIGZpbGxSdWxlPSdldmVub2RkJz5cbiAgICAgICAgICAgICAgICA8ZyBpZD0nT3V0bGluZWQnIHRyYW5zZm9ybT0ndHJhbnNsYXRlKC0yMTEuMDAwMDAwLCAtMTE0LjAwMDAwMCknIGZpbGxSdWxlPSdub256ZXJvJyBmaWxsPScjRkFGQ0ZEJz5cbiAgICAgICAgICAgICAgICAgIDxnIGlkPSdvdXRsaW5lZC1sb2dvJyB0cmFuc2Zvcm09J3RyYW5zbGF0ZSgyMTEuMDAwMDAwLCAxMTMuMDAwMDAwKSc+XG4gICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9J000Ny41LDE1Mi43OTg4MjMgTDI2LjM4MjM0MzIsMTQzLjk1NDY3NiBDMjQuNTk5Mzk0MSwxNDMuMjA3OTcxIDIzLjc1OTM1MjQsMTQxLjE1NzI4MSAyNC41MDYwNTc2LDEzOS4zNzQzMzIgQzI1LjI1Mjc2MjgsMTM3LjU5MTM4MyAyNy4zMDM0NTI3LDEzNi43NTEzNDEgMjkuMDg2NDAxOCwxMzcuNDk4MDQ2IEwxMTcuNzgwMDU4LDE3NC42NDQ1NiBMMTIwLjk5MDAyMSwxNzYuMDg5MDc0IEMxMjIuNDg2ODE0LDE3Ni43NjI2NDUgMTIzLjI3OTMwNCwxNzguMzU4MjUxIDEyMi45OTg2OTgsMTc5LjkwMzU5OCBDMTIyLjk5OTU2NCwxNzkuOTM1NjI2IDEyMywxNzkuOTY3NzYyIDEyMywxODAgTDEyMywyMDUuNjM5NzIyIEwxMzguNTEwNzE2LDIxMS45MTAwMTEgTDE0My4zNjg0MjEsMjEzLjg3Mzc2NCBMMTYyLjgzMzMzMywyMDYuMDA0OTcgTDE2Mi44MzMzMzMsMTYuMjkyOTAyNSBMMTQzLDguMjc1MTcyMDQgTDEyMi44MzMzMzMsMTYuNDI3NjU0MyBMMTIyLjgzMzMzMyw1My42MDEzMjk1IEMxMjIuODM0MjE4LDUzLjY0NjY0ODkgMTIyLjgzNDIxNSw1My42OTE5MDE1IDEyMi44MzMzMzMsNTMuNzM3MDYzNCBMMTIyLjgzMzMzMyw1NCBDMTIyLjgzMzMzMyw1NS45MzI5OTY2IDEyMS4yNjYzMyw1Ny41IDExOS4zMzMzMzMsNTcuNSBDMTE5LjI4ODQzLDU3LjUgMTE5LjI0MzcyNCw1Ny40OTkxNTQ0IDExOS4xOTkyMyw1Ny40OTc0NzgyIEw1My4zMDc2MzgsODQuMDM3MTQ5IEM1MS41MTQ2MTgzLDg0Ljc1OTMzNzUgNDkuNDc1NjM5Miw4My44OTEyNTczIDQ4Ljc1MzQ1MDYsODIuMDk4MjM3NiBDNDguMDMxMjYyMSw4MC4zMDUyMTc5IDQ4Ljg5OTM0MjMsNzguMjY2MjM4OCA1MC42OTIzNjIsNzcuNTQ0MDUwMiBMMTE1LjgzMzMzMyw1MS4zMDY3MTI5IEwxMTUuODMzMzMzLDE0LjQ5NzQyMjcgQzExNS44MzMzMzMsMTQuMDE0MzE3OCAxMTUuOTMxMjEzLDEzLjU1NDA3MzkgMTE2LjEwODIyMiwxMy4xMzU0Mzk5IEMxMTYuMzc0NTM5LDEyLjA5NDEyOTIgMTE3LjExNTMyNiwxMS4xODg4NDQ5IDExOC4xODgyMzgsMTAuNzU1MTE0OCBMMTQxLjY4NDE4NiwxLjI1Njc1MjcgQzE0Mi4wOTEzMTcsMS4wOTE1MjkzNiAxNDIuNTI5NTksMS4wMDI0MDQ2NyAxNDIuOTc1OTM3LDAuOTk5MTY0NzIzIEMxNDMuNDcwNDEsMS4wMDI0MDQ2NyAxNDMuOTA4NjgzLDEuMDkxNTI5MzYgMTQ0LjMxNTgxNCwxLjI1Njc1MjcgTDE2Ny44MTE3NjIsMTAuNzU1MTE0OCBDMTY5LjUyMjk2OCwxMS40NDY4NzkgMTcwLjM4OTMyOCwxMy4zMzgxNjU5IDE2OS44MzMzMzMsMTUuMDY3NzA2OCBMMTY5LjgzMzMzMywyMDggQzE2OS44MzMzMzMsMjA4LjgyNjMwNCAxNjkuNTQ2OTksMjA5LjU4NTcyOCAxNjkuMDY4MTE4LDIxMC4xODQ0NTkgQzE2OC42OTM3MDMsMjEwLjg2NzM3OCAxNjguMDkwMTMzLDIxMS40MzAyMjQgMTY3LjMxMTc2MiwyMTEuNzQ0ODg1IEwxNDQuNTE3NjQ1LDIyMC45NTk1MjggQzE0My4zMzI1NDIsMjIxLjQzODYxMyAxNDIuMDM4OTk1LDIyMS4yMjIzOTcgMTQxLjA4OTE3OSwyMjAuNTAyNzEyIEwxMzUuODg3MTkyLDIxOC4zOTk3ODIgTDExOS40NjE1OTUsMjExLjc1OTY0NyBDMTE3LjU0NjI5LDIxMS43MzkwNTUgMTE2LDIxMC4xODAwMzIgMTE2LDIwOC4yNTk4NTMgTDExNiwyMDguMDc5MTEgQzExNS45OTg3NjcsMjA4LjAyNTcwOCAxMTUuOTk4NzYxLDIwNy45NzIxNzggMTE2LDIwNy45MTg1NTggTDExNiwxODEuNTE4NzQ4IEwxMTQuOTkxNzI3LDE4MS4wNjQ1ODkgTDU0LjUsMTU1LjczMDQ0NyBMNTQuNSwyMDYuOTk4MjczIEM1NS4xMzQxNDY4LDIwOC42NTgyNTYgNTQuNDE5NTMxNSwyMTAuNTEyOTE1IDUyLjg3OTY2NDUsMjExLjMzMzMzMyBDNTIuNTU0NTU0NiwyMTEuNTQwNzA5IDUyLjE5MjkwNCwyMTEuNjk1ODY5IDUxLjgwNjUyOTQsMjExLjc4Njk5NyBMMjkuNzg2NzM3NSwyMjAuNjUwNjU1IEMyOC44MjUyNTM1LDIyMS40Nzg3NTggMjcuNDQ1NzAwNSwyMjEuNzUzMjIxIDI2LjE4ODIzNzksMjIxLjI0NDg4NSBMMjAuMzg3MTkyMSwyMTguODk5NzgyIEwzLjMwNjI3NzgzLDIxMS45OTQ3MzEgQzEuNDYzMzgxODksMjExLjg5NDE5MiAtMi42MDgzNTk5NWUtMTYsMjEwLjM2Nzk5MiAwLDIwOC41IEwyLjcwODk0NDE4ZS0xNCwxNC40OTc0MjI3IEMyLjcyNDI0NWUtMTQsMTMuNDAxNjQ1OCAwLjUwMzU2MDk0NywxMi40MjM0ODE4IDEuMjkxODk2NjksMTEuNzgxNzE3IEMxLjY1MTcxMDE0LDExLjM0MTY1MDkgMi4xMjQwNTYyMiwxMC45ODMxODgyIDIuNjg4MjM3ODksMTAuNzU1MTE0OCBMMjYuMTg0MTg2MiwxLjI1Njc1MjcgQzI2LjU5MTMxNzIsMS4wOTE1MjkzNiAyNy4wMjk1ODk4LDEuMDAyNDA0NjcgMjcuNDc1OTM2NywwLjk5OTE2NDcyMyBDMjcuOTcwNDEwMiwxLjAwMjQwNDY3IDI4LjQwODY4MjgsMS4wOTE1MjkzNiAyOC44MTU4MTM4LDEuMjU2NzUyNyBMNTIuMzExNzYyMSwxMC43NTUxMTQ4IEM1NC4xMDM4NjI3LDExLjQ3OTU4MSA1NC45NjkzNTE0LDEzLjUxOTY2MTUgNTQuMjQ0ODg1MiwxNS4zMTE3NjIxIEM1My41MjA0MTksMTcuMTAzODYyNyA1MS40ODAzMzg1LDE3Ljk2OTM1MTQgNDkuNjg4MjM3OSwxNy4yNDQ4ODUyIEwyNy41LDguMjc1MTcyMDQgTDcsMTYuNTYyNDA2MSBMNywyMDUuOTM3NTk0IEwyMy4wMTA3MTY0LDIxMi40MTAwMTEgTDI3LjI1MjY5OTUsMjE0LjEyNDg1NSBMNDcuNSwyMDUuOTc0NjgxIEw0Ny41LDE1Mi43OTg4MjMgWicgaWQ9J0NvbWJpbmVkLVNoYXBlJyAvPlxuICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSdNMTQ2LjQ1NjgyNyw2My4wMjQxODQ5IEMxNDYuOTQ4NjAzLDY0LjcxMDQ3MjQgMTQ2LjEwNTk3Miw2Ni41MzM2NTkxIDE0NC40NDczMDUsNjcuMjI4MzE0OSBMNTkuNTQ2ODY3NywxMDIuNzg0OTA4IEwxMjAuNDE2NTc1LDEyOC4yNzczNSBDMTIyLjE5OTUyNCwxMjkuMDI0MDU1IDEyMy4wMzk1NjYsMTMxLjA3NDc0NSAxMjIuMjkyODYxLDEzMi44NTc2OTQgQzEyMS41NDYxNTYsMTM0LjY0MDY0MyAxMTkuNDk1NDY2LDEzNS40ODA2ODUgMTE3LjcxMjUxNywxMzQuNzMzOTc5IEw1MC40ODY0MTMxLDEwNi41Nzk0NTcgTDI5LjM1MjAyOTMsMTE1LjQzMDYxIEMyNy41NjkwODAyLDExNi4xNzczMTUgMjUuNTE4MzkwMywxMTUuMzM3MjczIDI0Ljc3MTY4NTEsMTEzLjU1NDMyNCBDMjQuMDI0OTgsMTExLjc3MTM3NSAyNC44NjUwMjE2LDEwOS43MjA2ODUgMjYuNjQ3OTcwNywxMDguOTczOTggTDQ3LjUsMTAwLjI0MTA3OSBMNDcuNSwxNC41IEM0Ny41LDEyLjU2NzAwMzQgNDkuMDY3MDAzNCwxMSA1MSwxMSBDNTIuOTMyOTk2NiwxMSA1NC41LDEyLjU2NzAwMzQgNTQuNSwxNC41IEw1NC41LDk3LjMwOTQ1NDggTDEzMy4zNjAyNTcsNjQuMjgyNTA5OCBMMTE3LjE4ODIzOCw1Ny43NDQ4ODUyIEMxMTUuMzk2MTM3LDU3LjAyMDQxOSAxMTQuNTMwNjQ5LDU0Ljk4MDMzODUgMTE1LjI1NTExNSw1My4xODgyMzc5IEMxMTUuOTc5NTgxLDUxLjM5NjEzNzMgMTE4LjAxOTY2MSw1MC41MzA2NDg2IDExOS44MTE3NjIsNTEuMjU1MTE0OCBMMTM5LjUsNTkuMjE0MTg5NyBMMTM5LjUsMjUuODYwMjc4NCBMMTM1Ljg4NzE5MiwyNC4zOTk3ODE2IEwxMTguMTg4MjM4LDE3LjI0NDg4NTIgQzExNi4zOTYxMzcsMTYuNTIwNDE5IDExNS41MzA2NDksMTQuNDgwMzM4NSAxMTYuMjU1MTE1LDEyLjY4ODIzNzkgQzExNi45Nzk1ODEsMTAuODk2MTM3MyAxMTkuMDE5NjYxLDEwLjAzMDY0ODYgMTIwLjgxMTc2MiwxMC43NTUxMTQ4IEwxMzguNTEwNzE2LDE3LjkxMDAxMTIgTDE0My4zNjg0MjEsMTkuODczNzY0MSBMMTY0LjY4ODIzOCwxMS4yNTUxMTQ4IEMxNjYuNDgwMzM5LDEwLjUzMDY0ODYgMTY4LjUyMDQxOSwxMS4zOTYxMzczIDE2OS4yNDQ4ODUsMTMuMTg4MjM3OSBDMTY5Ljk2OTM1MSwxNC45ODAzMzg1IDE2OS4xMDM4NjMsMTcuMDIwNDE5IDE2Ny4zMTE3NjIsMTcuNzQ0ODg1MiBMMTQ2LjUsMjYuMTU4MTUwOCBMMTQ2LjUsNjIuNDcyODc0OSBDMTQ2LjUsNjIuNjYwNDU3NCAxNDYuNDg1MjQzLDYyLjg0NDU5MzMgMTQ2LjQ1NjgyNyw2My4wMjQxODQ5IFonIGlkPSdDb21iaW5lZC1TaGFwZScgLz5cbiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0nTTEzOS41LDk2LjMzMDgwNjkgTDEyMi44MzMzMzMsMTAzLjMxMDg2NCBMMTIyLjgzMzMzMywxNTEuMzcyNzk5IEMxMjIuODMzMzMzLDE1My4zMDU3OTUgMTIxLjI2NjMzLDE1NC44NzI3OTkgMTE5LjMzMzMzMywxNTQuODcyNzk5IEMxMTguNTM1NzE5LDE1NC44NzI3OTkgMTE3LjgwMDQyLDE1NC42MDU5OTQgMTE3LjIxMTgxNiwxNTQuMTU2NzYzIEwyNi42NDc5NzA3LDExNi4yMjgzMTUgQzI2LjA5NzY3MDYsMTE1Ljk5Nzg0NyAyNS42MzcxOTQsMTE1LjY0MzE1OSAyNS4yODU0NzE0LDExNS4yMTA0NjIgQzI0LjUwMDgyNTgsMTE0LjU2ODYyIDI0LDExMy41OTI3OTcgMjQsMTEyLjUgTDI0LDI1Ljg2MDI3ODQgTDIwLjM4NzE5MjEsMjQuMzk5NzgxNiBMMi42ODgyMzc4OSwxNy4yNDQ4ODUyIEMwLjg5NjEzNzI1OCwxNi41MjA0MTkgMC4wMzA2NDg1NTg5LDE0LjQ4MDMzODUgMC43NTUxMTQ3NywxMi42ODgyMzc5IEMxLjQ3OTU4MDk4LDEwLjg5NjEzNzMgMy41MTk2NjE0OSwxMC4wMzA2NDg2IDUuMzExNzYyMTEsMTAuNzU1MTE0OCBMMjMuMDEwNzE2NCwxNy45MTAwMTEyIEwyNy44Njg0MjExLDE5Ljg3Mzc2NDEgTDQ5LjE4ODIzNzksMTEuMjU1MTE0OCBDNTAuOTgwMzM4NSwxMC41MzA2NDg2IDUzLjAyMDQxOSwxMS4zOTYxMzczIDUzLjc0NDg4NTIsMTMuMTg4MjM3OSBDNTQuNDY5MzUxNCwxNC45ODAzMzg1IDUzLjYwMzg2MjcsMTcuMDIwNDE5IDUxLjgxMTc2MjEsMTcuNzQ0ODg1MiBMMzEsMjYuMTU4MTUwOCBMMzEsMTEwLjQ2MTg2MSBMMTE1LjgzMzMzMywxNDUuOTkwMzUxIEwxMTUuODMzMzMzLDEwNi4yNDI0ODggTDg0LjI1OTY2MTYsMTE5LjQ2NTY0OSBDODIuNDc2NzEyNSwxMjAuMjEyMzU1IDgwLjQyNjAyMjYsMTE5LjM3MjMxMyA3OS42NzkzMTc0LDExNy41ODkzNjQgQzc4LjkzMjYxMjMsMTE1LjgwNjQxNSA3OS43NzI2NTM5LDExMy43NTU3MjUgODEuNTU1NjAzLDExMy4wMDkwMiBMMTQxLjA1MjE1MSw4OC4wOTE2NjIyIEMxNDEuNjA4OTc0LDg3LjcxNzk5MyAxNDIuMjc5MDMsODcuNSAxNDMsODcuNSBDMTQ0LjkzMjk5Nyw4Ny41IDE0Ni41LDg5LjA2NzAwMzQgMTQ2LjUsOTEgTDE0Ni41LDIxNy42MzA0OCBDMTQ2LjUsMjE5LjU2MzQ3NyAxNDQuOTMyOTk3LDIyMS4xMzA0OCAxNDMsMjIxLjEzMDQ4IEMxNDEuMDY3MDAzLDIyMS4xMzA0OCAxMzkuNSwyMTkuNTYzNDc3IDEzOS41LDIxNy42MzA0OCBMMTM5LjUsOTYuMzMwODA2OSBaIE0zMSwxNDEgTDMxLDIxNy4wNTUyMzcgQzMxLDIxOC45ODgyMzQgMjkuNDMyOTk2NiwyMjAuNTU1MjM3IDI3LjUsMjIwLjU1NTIzNyBDMjUuNTY3MDAzNCwyMjAuNTU1MjM3IDI0LDIxOC45ODgyMzQgMjQsMjE3LjA1NTIzNyBMMjQsMTQxIEMyNCwxMzkuMDY3MDAzIDI1LjU2NzAwMzQsMTM3LjUgMjcuNSwxMzcuNSBDMjkuNDMyOTk2NiwxMzcuNSAzMSwxMzkuMDY3MDAzIDMxLDE0MSBaJyBpZD0nQ29tYmluZWQtU2hhcGUnIC8+XG4gICAgICAgICAgICAgICAgICA8L2c+XG4gICAgICAgICAgICAgICAgPC9nPlxuICAgICAgICAgICAgICA8L2c+XG4gICAgICAgICAgICA8L3N2Zz5cbiAgICAgICAgICAgIDxiciAvPlxuICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgY29sb3I6ICcjRkFGQ0ZEJywgZGlzcGxheTogJ2lubGluZS1ibG9jaycsIHdpZHRoOiAnMTAwJScsIGhlaWdodDogNTAsIHBvc2l0aW9uOiAnYWJzb2x1dGUnLCBib3R0b206IDUwLCBsZWZ0OiAwIH19Pnt0aGlzLnN0YXRlLnNvZnR3YXJlVmVyc2lvbn08L3NwYW4+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyICgpIHtcbiAgICBpZiAodGhpcy5zdGF0ZS5yZWFkeUZvckF1dGggJiYgKCF0aGlzLnN0YXRlLmlzVXNlckF1dGhlbnRpY2F0ZWQgfHwgIXRoaXMuc3RhdGUudXNlcm5hbWUpKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8U3R5bGVSb290PlxuICAgICAgICAgIDxBdXRoZW50aWNhdGlvblVJXG4gICAgICAgICAgICBvblN1Ym1pdD17dGhpcy5hdXRoZW50aWNhdGVVc2VyfVxuICAgICAgICAgICAgb25TdWJtaXRTdWNjZXNzPXt0aGlzLmF1dGhlbnRpY2F0aW9uQ29tcGxldGV9XG4gICAgICAgICAgICB7Li4udGhpcy5wcm9wc30gLz5cbiAgICAgICAgPC9TdHlsZVJvb3Q+XG4gICAgICApXG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLnN0YXRlLmlzVXNlckF1dGhlbnRpY2F0ZWQgfHwgIXRoaXMuc3RhdGUudXNlcm5hbWUpIHtcbiAgICAgIHJldHVybiB0aGlzLnJlbmRlclN0YXJ0dXBEZWZhdWx0U2NyZWVuKClcbiAgICB9XG5cbiAgICBpZiAodGhpcy5zdGF0ZS5kYXNoYm9hcmRWaXNpYmxlKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIDxQcm9qZWN0QnJvd3NlclxuICAgICAgICAgICAgbG9hZFByb2plY3RzPXt0aGlzLmxvYWRQcm9qZWN0c31cbiAgICAgICAgICAgIGxhdW5jaFByb2plY3Q9e3RoaXMubGF1bmNoUHJvamVjdH1cbiAgICAgICAgICAgIGNyZWF0ZU5vdGljZT17dGhpcy5jcmVhdGVOb3RpY2V9XG4gICAgICAgICAgICByZW1vdmVOb3RpY2U9e3RoaXMucmVtb3ZlTm90aWNlfVxuICAgICAgICAgICAgbm90aWNlcz17dGhpcy5zdGF0ZS5ub3RpY2VzfVxuICAgICAgICAgICAgZW52b3k9e3RoaXMuZW52b3l9XG4gICAgICAgICAgICB7Li4udGhpcy5wcm9wc30gLz5cbiAgICAgICAgICA8VG91ciBwcm9qZWN0c0xpc3Q9e3RoaXMuc3RhdGUucHJvamVjdHNMaXN0fSBlbnZveT17dGhpcy5lbnZveX0gc3RhcnRUb3VyT25Nb3VudCAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIClcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuc3RhdGUucHJvamVjdEZvbGRlcikge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdj5cbiAgICAgICAgICA8VG91ciBwcm9qZWN0c0xpc3Q9e3RoaXMuc3RhdGUucHJvamVjdHNMaXN0fSBlbnZveT17dGhpcy5lbnZveX0gLz5cbiAgICAgICAgICA8UHJvamVjdEJyb3dzZXJcbiAgICAgICAgICAgIGxvYWRQcm9qZWN0cz17dGhpcy5sb2FkUHJvamVjdHN9XG4gICAgICAgICAgICBsYXVuY2hQcm9qZWN0PXt0aGlzLmxhdW5jaFByb2plY3R9XG4gICAgICAgICAgICBjcmVhdGVOb3RpY2U9e3RoaXMuY3JlYXRlTm90aWNlfVxuICAgICAgICAgICAgcmVtb3ZlTm90aWNlPXt0aGlzLnJlbW92ZU5vdGljZX1cbiAgICAgICAgICAgIG5vdGljZXM9e3RoaXMuc3RhdGUubm90aWNlc31cbiAgICAgICAgICAgIGVudm95PXt0aGlzLmVudm95fVxuICAgICAgICAgICAgey4uLnRoaXMucHJvcHN9IC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKVxuICAgIH1cblxuICAgIGlmICghdGhpcy5zdGF0ZS5hcHBsaWNhdGlvbkltYWdlIHx8IHRoaXMuc3RhdGUuZm9sZGVyTG9hZGluZ0Vycm9yKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IHN0eWxlPXt7IHBvc2l0aW9uOiAnYWJzb2x1dGUnLCB3aWR0aDogJzEwMCUnLCBoZWlnaHQ6ICcxMDAlJyB9fT5cbiAgICAgICAgICA8UmVhY3RDU1NUcmFuc2l0aW9uR3JvdXBcbiAgICAgICAgICAgIHRyYW5zaXRpb25OYW1lPSd0b2FzdCdcbiAgICAgICAgICAgIHRyYW5zaXRpb25FbnRlclRpbWVvdXQ9ezUwMH1cbiAgICAgICAgICAgIHRyYW5zaXRpb25MZWF2ZVRpbWVvdXQ9ezMwMH0+XG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt7cG9zaXRpb246ICdhYnNvbHV0ZScsIHJpZ2h0OiAwLCB0b3A6IDAsIHdpZHRoOiAzMDB9fT5cbiAgICAgICAgICAgICAge2xvZGFzaC5tYXAodGhpcy5zdGF0ZS5ub3RpY2VzLCB0aGlzLnJlbmRlck5vdGlmaWNhdGlvbnMpfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9SZWFjdENTU1RyYW5zaXRpb25Hcm91cD5cbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7IHBvc2l0aW9uOiAncmVsYXRpdmUnLCB3aWR0aDogJzEwMCUnLCBoZWlnaHQ6ICcxMDAlJyB9fT5cbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgcG9zaXRpb246ICdhYnNvbHV0ZScsIHRvcDogJzUwJScsIGxlZnQ6ICc1MCUnLCB0cmFuc2Zvcm06ICd0cmFuc2xhdGUoLTUwJSwgLTUwJSknIH19PlxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBmb250U2l6ZTogMjQsIGNvbG9yOiAnIzIyMicgfX0+TG9hZGluZyBwcm9qZWN0Li4uPC9zcGFuPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKVxuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IHN0eWxlPXt7IHBvc2l0aW9uOiAncmVsYXRpdmUnLCB3aWR0aDogJzEwMCUnLCBoZWlnaHQ6ICcxMDAlJyB9fT5cbiAgICAgICAgPFRvdXIgcHJvamVjdHNMaXN0PXt0aGlzLnN0YXRlLnByb2plY3RzTGlzdH0gZW52b3k9e3RoaXMuZW52b3l9IC8+XG4gICAgICAgIDxkaXYgc3R5bGU9e3sgcG9zaXRpb246ICdhYnNvbHV0ZScsIHdpZHRoOiAnMTAwJScsIGhlaWdodDogJzEwMCUnLCB0b3A6IDAsIGxlZnQ6IDAgfX0+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9J2xheW91dC1ib3gnIHN0eWxlPXt7b3ZlcmZsb3c6ICd2aXNpYmxlJ319PlxuICAgICAgICAgICAgPFJlYWN0Q1NTVHJhbnNpdGlvbkdyb3VwXG4gICAgICAgICAgICAgIHRyYW5zaXRpb25OYW1lPSd0b2FzdCdcbiAgICAgICAgICAgICAgdHJhbnNpdGlvbkVudGVyVGltZW91dD17NTAwfVxuICAgICAgICAgICAgICB0cmFuc2l0aW9uTGVhdmVUaW1lb3V0PXszMDB9PlxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7cG9zaXRpb246ICdhYnNvbHV0ZScsIHJpZ2h0OiAwLCB0b3A6IDAsIHdpZHRoOiAzMDB9fT5cbiAgICAgICAgICAgICAgICB7bG9kYXNoLm1hcCh0aGlzLnN0YXRlLm5vdGljZXMsIHRoaXMucmVuZGVyTm90aWZpY2F0aW9ucyl9XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9SZWFjdENTU1RyYW5zaXRpb25Hcm91cD5cbiAgICAgICAgICAgIDxTcGxpdFBhbmUgb25EcmFnRmluaXNoZWQ9e3RoaXMuaGFuZGxlUGFuZVJlc2l6ZS5iaW5kKHRoaXMpfSBzcGxpdD0naG9yaXpvbnRhbCcgbWluU2l6ZT17MzAwfSBkZWZhdWx0U2l6ZT17dGhpcy5wcm9wcy5oZWlnaHQgKiAwLjYyfT5cbiAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8U3BsaXRQYW5lIG9uRHJhZ0ZpbmlzaGVkPXt0aGlzLmhhbmRsZVBhbmVSZXNpemUuYmluZCh0aGlzKX0gc3BsaXQ9J3ZlcnRpY2FsJyBtaW5TaXplPXszMDB9IGRlZmF1bHRTaXplPXszMDB9PlxuICAgICAgICAgICAgICAgICAgPFNpZGVCYXJcbiAgICAgICAgICAgICAgICAgICAgc2V0RGFzaGJvYXJkVmlzaWJpbGl0eT17dGhpcy5zZXREYXNoYm9hcmRWaXNpYmlsaXR5LmJpbmQodGhpcyl9XG4gICAgICAgICAgICAgICAgICAgIHN3aXRjaEFjdGl2ZU5hdj17dGhpcy5zd2l0Y2hBY3RpdmVOYXYuYmluZCh0aGlzKX1cbiAgICAgICAgICAgICAgICAgICAgYWN0aXZlTmF2PXt0aGlzLnN0YXRlLmFjdGl2ZU5hdn0+XG4gICAgICAgICAgICAgICAgICAgIHt0aGlzLnN0YXRlLmFjdGl2ZU5hdiA9PT0gJ2xpYnJhcnknXG4gICAgICAgICAgICAgICAgICAgICAgPyA8TGlicmFyeVxuICAgICAgICAgICAgICAgICAgICAgICAgbGF5b3V0PXt0aGlzLmxheW91dH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGZvbGRlcj17dGhpcy5zdGF0ZS5wcm9qZWN0Rm9sZGVyfVxuICAgICAgICAgICAgICAgICAgICAgICAgaGFpa3U9e3RoaXMucHJvcHMuaGFpa3V9XG4gICAgICAgICAgICAgICAgICAgICAgICB3ZWJzb2NrZXQ9e3RoaXMucHJvcHMud2Vic29ja2V0fVxuICAgICAgICAgICAgICAgICAgICAgICAgdG91ckNoYW5uZWw9e3RoaXMudG91ckNoYW5uZWx9XG4gICAgICAgICAgICAgICAgICAgICAgICBvbkRyYWdFbmQ9e3RoaXMub25MaWJyYXJ5RHJhZ0VuZC5iaW5kKHRoaXMpfVxuICAgICAgICAgICAgICAgICAgICAgICAgb25EcmFnU3RhcnQ9e3RoaXMub25MaWJyYXJ5RHJhZ1N0YXJ0LmJpbmQodGhpcyl9XG4gICAgICAgICAgICAgICAgICAgICAgICBjcmVhdGVOb3RpY2U9e3RoaXMuY3JlYXRlTm90aWNlfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmVtb3ZlTm90aWNlPXt0aGlzLnJlbW92ZU5vdGljZX0gLz5cbiAgICAgICAgICAgICAgICAgICAgICA6IDxTdGF0ZUluc3BlY3RvclxuICAgICAgICAgICAgICAgICAgICAgICAgY3JlYXRlTm90aWNlPXt0aGlzLmNyZWF0ZU5vdGljZX1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJlbW92ZU5vdGljZT17dGhpcy5yZW1vdmVOb3RpY2V9XG4gICAgICAgICAgICAgICAgICAgICAgICBmb2xkZXI9e3RoaXMuc3RhdGUucHJvamVjdEZvbGRlcn1cbiAgICAgICAgICAgICAgICAgICAgICAgIHdlYnNvY2tldD17dGhpcy5wcm9wcy53ZWJzb2NrZXR9XG4gICAgICAgICAgICAgICAgICAgICAgICB0b3VyQ2hhbm5lbD17dGhpcy50b3VyQ2hhbm5lbH0gLz5cbiAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICA8L1NpZGVCYXI+XG4gICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7cG9zaXRpb246ICdyZWxhdGl2ZScsIHdpZHRoOiAnMTAwJScsIGhlaWdodDogJzEwMCUnfX0+XG4gICAgICAgICAgICAgICAgICAgIDxTdGFnZVxuICAgICAgICAgICAgICAgICAgICAgIHJlZj0nc3RhZ2UnXG4gICAgICAgICAgICAgICAgICAgICAgZm9sZGVyPXt0aGlzLnN0YXRlLnByb2plY3RGb2xkZXJ9XG4gICAgICAgICAgICAgICAgICAgICAgZW52b3k9e3RoaXMuZW52b3l9XG4gICAgICAgICAgICAgICAgICAgICAgaGFpa3U9e3RoaXMucHJvcHMuaGFpa3V9XG4gICAgICAgICAgICAgICAgICAgICAgd2Vic29ja2V0PXt0aGlzLnByb3BzLndlYnNvY2tldH1cbiAgICAgICAgICAgICAgICAgICAgICBwcm9qZWN0PXt0aGlzLnN0YXRlLnByb2plY3RPYmplY3R9XG4gICAgICAgICAgICAgICAgICAgICAgY3JlYXRlTm90aWNlPXt0aGlzLmNyZWF0ZU5vdGljZX1cbiAgICAgICAgICAgICAgICAgICAgICByZW1vdmVOb3RpY2U9e3RoaXMucmVtb3ZlTm90aWNlfVxuICAgICAgICAgICAgICAgICAgICAgIHJlY2VpdmVQcm9qZWN0SW5mbz17dGhpcy5yZWNlaXZlUHJvamVjdEluZm99XG4gICAgICAgICAgICAgICAgICAgICAgb3JnYW5pemF0aW9uTmFtZT17dGhpcy5zdGF0ZS5vcmdhbml6YXRpb25OYW1lfVxuICAgICAgICAgICAgICAgICAgICAgIGF1dGhUb2tlbj17dGhpcy5zdGF0ZS5hdXRoVG9rZW59XG4gICAgICAgICAgICAgICAgICAgICAgdXNlcm5hbWU9e3RoaXMuc3RhdGUudXNlcm5hbWV9XG4gICAgICAgICAgICAgICAgICAgICAgcGFzc3dvcmQ9e3RoaXMuc3RhdGUucGFzc3dvcmR9IC8+XG4gICAgICAgICAgICAgICAgICAgIHsodGhpcy5zdGF0ZS5saWJyYXJ5SXRlbURyYWdnaW5nKVxuICAgICAgICAgICAgICAgICAgICAgID8gPGRpdiBzdHlsZT17eyB3aWR0aDogJzEwMCUnLCBoZWlnaHQ6ICcxMDAlJywgYmFja2dyb3VuZENvbG9yOiAnd2hpdGUnLCBvcGFjaXR5OiAwLjAxLCBwb3NpdGlvbjogJ2Fic29sdXRlJywgdG9wOiAwLCBsZWZ0OiAwIH19IC8+XG4gICAgICAgICAgICAgICAgICAgICAgOiAnJyB9XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L1NwbGl0UGFuZT5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxUaW1lbGluZVxuICAgICAgICAgICAgICAgIHJlZj0ndGltZWxpbmUnXG4gICAgICAgICAgICAgICAgZm9sZGVyPXt0aGlzLnN0YXRlLnByb2plY3RGb2xkZXJ9XG4gICAgICAgICAgICAgICAgZW52b3k9e3RoaXMuZW52b3l9XG4gICAgICAgICAgICAgICAgaGFpa3U9e3RoaXMucHJvcHMuaGFpa3V9IC8+XG4gICAgICAgICAgICA8L1NwbGl0UGFuZT5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cbn1cbiJdfQ==