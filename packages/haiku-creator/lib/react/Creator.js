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
          lineNumber: 355
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
    key: 'renderStartupDefaultScreen',
    value: function renderStartupDefaultScreen() {
      return _react2.default.createElement(
        'div',
        { style: { position: 'absolute', width: '100%', height: '100%' }, __source: {
            fileName: _jsxFileName,
            lineNumber: 522
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
              lineNumber: 523
            },
            __self: this
          },
          _react2.default.createElement(
            'div',
            { style: { position: 'absolute', right: 0, top: 0, width: 300 }, __source: {
                fileName: _jsxFileName,
                lineNumber: 527
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
              lineNumber: 531
            },
            __self: this
          },
          _react2.default.createElement(
            'div',
            { style: { display: 'table-cell', width: '100%', height: '100%', verticalAlign: 'middle', textAlign: 'center' }, __source: {
                fileName: _jsxFileName,
                lineNumber: 532
              },
              __self: this
            },
            _react2.default.createElement(
              'svg',
              { width: '170px', height: '221px', viewBox: '0 0 170 221', version: '1.1', __source: {
                  fileName: _jsxFileName,
                  lineNumber: 533
                },
                __self: this
              },
              _react2.default.createElement(
                'g',
                { id: 'Page-1', stroke: 'none', strokeWidth: '1', fill: 'none', fillRule: 'evenodd', __source: {
                    fileName: _jsxFileName,
                    lineNumber: 534
                  },
                  __self: this
                },
                _react2.default.createElement(
                  'g',
                  { id: 'Outlined', transform: 'translate(-211.000000, -114.000000)', fillRule: 'nonzero', fill: '#FAFCFD', __source: {
                      fileName: _jsxFileName,
                      lineNumber: 535
                    },
                    __self: this
                  },
                  _react2.default.createElement(
                    'g',
                    { id: 'outlined-logo', transform: 'translate(211.000000, 113.000000)', __source: {
                        fileName: _jsxFileName,
                        lineNumber: 536
                      },
                      __self: this
                    },
                    _react2.default.createElement('path', { d: 'M47.5,152.798823 L26.3823432,143.954676 C24.5993941,143.207971 23.7593524,141.157281 24.5060576,139.374332 C25.2527628,137.591383 27.3034527,136.751341 29.0864018,137.498046 L117.780058,174.64456 L120.990021,176.089074 C122.486814,176.762645 123.279304,178.358251 122.998698,179.903598 C122.999564,179.935626 123,179.967762 123,180 L123,205.639722 L138.510716,211.910011 L143.368421,213.873764 L162.833333,206.00497 L162.833333,16.2929025 L143,8.27517204 L122.833333,16.4276543 L122.833333,53.6013295 C122.834218,53.6466489 122.834215,53.6919015 122.833333,53.7370634 L122.833333,54 C122.833333,55.9329966 121.26633,57.5 119.333333,57.5 C119.28843,57.5 119.243724,57.4991544 119.19923,57.4974782 L53.307638,84.037149 C51.5146183,84.7593375 49.4756392,83.8912573 48.7534506,82.0982376 C48.0312621,80.3052179 48.8993423,78.2662388 50.692362,77.5440502 L115.833333,51.3067129 L115.833333,14.4974227 C115.833333,14.0143178 115.931213,13.5540739 116.108222,13.1354399 C116.374539,12.0941292 117.115326,11.1888449 118.188238,10.7551148 L141.684186,1.2567527 C142.091317,1.09152936 142.52959,1.00240467 142.975937,0.999164723 C143.47041,1.00240467 143.908683,1.09152936 144.315814,1.2567527 L167.811762,10.7551148 C169.522968,11.446879 170.389328,13.3381659 169.833333,15.0677068 L169.833333,208 C169.833333,208.826304 169.54699,209.585728 169.068118,210.184459 C168.693703,210.867378 168.090133,211.430224 167.311762,211.744885 L144.517645,220.959528 C143.332542,221.438613 142.038995,221.222397 141.089179,220.502712 L135.887192,218.399782 L119.461595,211.759647 C117.54629,211.739055 116,210.180032 116,208.259853 L116,208.07911 C115.998767,208.025708 115.998761,207.972178 116,207.918558 L116,181.518748 L114.991727,181.064589 L54.5,155.730447 L54.5,206.998273 C55.1341468,208.658256 54.4195315,210.512915 52.8796645,211.333333 C52.5545546,211.540709 52.192904,211.695869 51.8065294,211.786997 L29.7867375,220.650655 C28.8252535,221.478758 27.4457005,221.753221 26.1882379,221.244885 L20.3871921,218.899782 L3.30627783,211.994731 C1.46338189,211.894192 -2.60835995e-16,210.367992 0,208.5 L2.70894418e-14,14.4974227 C2.724245e-14,13.4016458 0.503560947,12.4234818 1.29189669,11.781717 C1.65171014,11.3416509 2.12405622,10.9831882 2.68823789,10.7551148 L26.1841862,1.2567527 C26.5913172,1.09152936 27.0295898,1.00240467 27.4759367,0.999164723 C27.9704102,1.00240467 28.4086828,1.09152936 28.8158138,1.2567527 L52.3117621,10.7551148 C54.1038627,11.479581 54.9693514,13.5196615 54.2448852,15.3117621 C53.520419,17.1038627 51.4803385,17.9693514 49.6882379,17.2448852 L27.5,8.27517204 L7,16.5624061 L7,205.937594 L23.0107164,212.410011 L27.2526995,214.124855 L47.5,205.974681 L47.5,152.798823 Z', id: 'Combined-Shape', __source: {
                        fileName: _jsxFileName,
                        lineNumber: 537
                      },
                      __self: this
                    }),
                    _react2.default.createElement('path', { d: 'M146.456827,63.0241849 C146.948603,64.7104724 146.105972,66.5336591 144.447305,67.2283149 L59.5468677,102.784908 L120.416575,128.27735 C122.199524,129.024055 123.039566,131.074745 122.292861,132.857694 C121.546156,134.640643 119.495466,135.480685 117.712517,134.733979 L50.4864131,106.579457 L29.3520293,115.43061 C27.5690802,116.177315 25.5183903,115.337273 24.7716851,113.554324 C24.02498,111.771375 24.8650216,109.720685 26.6479707,108.97398 L47.5,100.241079 L47.5,14.5 C47.5,12.5670034 49.0670034,11 51,11 C52.9329966,11 54.5,12.5670034 54.5,14.5 L54.5,97.3094548 L133.360257,64.2825098 L117.188238,57.7448852 C115.396137,57.020419 114.530649,54.9803385 115.255115,53.1882379 C115.979581,51.3961373 118.019661,50.5306486 119.811762,51.2551148 L139.5,59.2141897 L139.5,25.8602784 L135.887192,24.3997816 L118.188238,17.2448852 C116.396137,16.520419 115.530649,14.4803385 116.255115,12.6882379 C116.979581,10.8961373 119.019661,10.0306486 120.811762,10.7551148 L138.510716,17.9100112 L143.368421,19.8737641 L164.688238,11.2551148 C166.480339,10.5306486 168.520419,11.3961373 169.244885,13.1882379 C169.969351,14.9803385 169.103863,17.020419 167.311762,17.7448852 L146.5,26.1581508 L146.5,62.4728749 C146.5,62.6604574 146.485243,62.8445933 146.456827,63.0241849 Z', id: 'Combined-Shape', __source: {
                        fileName: _jsxFileName,
                        lineNumber: 538
                      },
                      __self: this
                    }),
                    _react2.default.createElement('path', { d: 'M139.5,96.3308069 L122.833333,103.310864 L122.833333,151.372799 C122.833333,153.305795 121.26633,154.872799 119.333333,154.872799 C118.535719,154.872799 117.80042,154.605994 117.211816,154.156763 L26.6479707,116.228315 C26.0976706,115.997847 25.637194,115.643159 25.2854714,115.210462 C24.5008258,114.56862 24,113.592797 24,112.5 L24,25.8602784 L20.3871921,24.3997816 L2.68823789,17.2448852 C0.896137258,16.520419 0.0306485589,14.4803385 0.75511477,12.6882379 C1.47958098,10.8961373 3.51966149,10.0306486 5.31176211,10.7551148 L23.0107164,17.9100112 L27.8684211,19.8737641 L49.1882379,11.2551148 C50.9803385,10.5306486 53.020419,11.3961373 53.7448852,13.1882379 C54.4693514,14.9803385 53.6038627,17.020419 51.8117621,17.7448852 L31,26.1581508 L31,110.461861 L115.833333,145.990351 L115.833333,106.242488 L84.2596616,119.465649 C82.4767125,120.212355 80.4260226,119.372313 79.6793174,117.589364 C78.9326123,115.806415 79.7726539,113.755725 81.555603,113.00902 L141.052151,88.0916622 C141.608974,87.717993 142.27903,87.5 143,87.5 C144.932997,87.5 146.5,89.0670034 146.5,91 L146.5,217.63048 C146.5,219.563477 144.932997,221.13048 143,221.13048 C141.067003,221.13048 139.5,219.563477 139.5,217.63048 L139.5,96.3308069 Z M31,141 L31,217.055237 C31,218.988234 29.4329966,220.555237 27.5,220.555237 C25.5670034,220.555237 24,218.988234 24,217.055237 L24,141 C24,139.067003 25.5670034,137.5 27.5,137.5 C29.4329966,137.5 31,139.067003 31,141 Z', id: 'Combined-Shape', __source: {
                        fileName: _jsxFileName,
                        lineNumber: 539
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
                lineNumber: 544
              },
              __self: this
            }),
            _react2.default.createElement(
              'span',
              { style: { color: '#FAFCFD', display: 'inline-block', width: '100%', height: 50, position: 'absolute', bottom: 50, left: 0 }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 545
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
              lineNumber: 555
            },
            __self: this
          },
          _react2.default.createElement(_AuthenticationUI2.default, Object.assign({
            onSubmit: this.authenticateUser,
            onSubmitSuccess: this.authenticationComplete
          }, this.props, {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 556
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
              lineNumber: 570
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
              lineNumber: 571
            },
            __self: this
          })),
          _react2.default.createElement(_Tour2.default, { projectsList: this.state.projectsList, envoy: this.envoy, startTourOnMount: true, __source: {
              fileName: _jsxFileName,
              lineNumber: 579
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
              lineNumber: 586
            },
            __self: this
          },
          _react2.default.createElement(_Tour2.default, { projectsList: this.state.projectsList, envoy: this.envoy, __source: {
              fileName: _jsxFileName,
              lineNumber: 587
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
              lineNumber: 588
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
              lineNumber: 602
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
                lineNumber: 603
              },
              __self: this
            },
            _react2.default.createElement(
              'div',
              { style: { position: 'absolute', right: 0, top: 0, width: 300 }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 607
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
                lineNumber: 611
              },
              __self: this
            },
            _react2.default.createElement(
              'div',
              { style: { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 612
                },
                __self: this
              },
              _react2.default.createElement(
                'span',
                { style: { fontSize: 24, color: '#222' }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 613
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
            lineNumber: 621
          },
          __self: this
        },
        _react2.default.createElement(_Tour2.default, { projectsList: this.state.projectsList, envoy: this.envoy, __source: {
            fileName: _jsxFileName,
            lineNumber: 622
          },
          __self: this
        }),
        _react2.default.createElement(
          'div',
          { style: { position: 'absolute', width: '100%', height: '100%', top: 0, left: 0 }, __source: {
              fileName: _jsxFileName,
              lineNumber: 623
            },
            __self: this
          },
          _react2.default.createElement(
            'div',
            { className: 'layout-box', style: { overflow: 'visible' }, __source: {
                fileName: _jsxFileName,
                lineNumber: 624
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
                  lineNumber: 625
                },
                __self: this
              },
              _react2.default.createElement(
                'div',
                { style: { position: 'absolute', right: 0, top: 0, width: 300 }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 629
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
                  lineNumber: 633
                },
                __self: this
              },
              _react2.default.createElement(
                'div',
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 634
                  },
                  __self: this
                },
                _react2.default.createElement(
                  _reactSplitPane2.default,
                  { onDragFinished: this.handlePaneResize.bind(this), split: 'vertical', minSize: 300, defaultSize: 300, __source: {
                      fileName: _jsxFileName,
                      lineNumber: 635
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
                        lineNumber: 636
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
                        lineNumber: 641
                      },
                      __self: this
                    }) : _react2.default.createElement(_StateInspector2.default, {
                      createNotice: this.createNotice,
                      removeNotice: this.removeNotice,
                      folder: this.state.projectFolder,
                      websocket: this.props.websocket,
                      tourChannel: this.tourChannel, __source: {
                        fileName: _jsxFileName,
                        lineNumber: 651
                      },
                      __self: this
                    })
                  ),
                  _react2.default.createElement(
                    'div',
                    { style: { position: 'relative', width: '100%', height: '100%' }, __source: {
                        fileName: _jsxFileName,
                        lineNumber: 659
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
                        lineNumber: 660
                      },
                      __self: this
                    }),
                    this.state.libraryItemDragging ? _react2.default.createElement('div', { style: { width: '100%', height: '100%', backgroundColor: 'white', opacity: 0.01, position: 'absolute', top: 0, left: 0 }, __source: {
                        fileName: _jsxFileName,
                        lineNumber: 675
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
                  lineNumber: 680
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZWFjdC9DcmVhdG9yLmpzIl0sIm5hbWVzIjpbInBrZyIsInJlcXVpcmUiLCJtaXhwYW5lbCIsImVsZWN0cm9uIiwicmVtb3RlIiwiaXBjUmVuZGVyZXIiLCJjbGlwYm9hcmQiLCJ3ZWJGcmFtZSIsInNldFpvb21MZXZlbExpbWl0cyIsInNldExheW91dFpvb21MZXZlbExpbWl0cyIsIkNyZWF0b3IiLCJwcm9wcyIsImF1dGhlbnRpY2F0ZVVzZXIiLCJiaW5kIiwiYXV0aGVudGljYXRpb25Db21wbGV0ZSIsImxvYWRQcm9qZWN0cyIsImxhdW5jaFByb2plY3QiLCJyZW1vdmVOb3RpY2UiLCJjcmVhdGVOb3RpY2UiLCJyZW5kZXJOb3RpZmljYXRpb25zIiwicmVjZWl2ZVByb2plY3RJbmZvIiwiaGFuZGxlRmluZEVsZW1lbnRDb29yZGluYXRlcyIsImhhbmRsZUZpbmRXZWJ2aWV3Q29vcmRpbmF0ZXMiLCJsYXlvdXQiLCJzdGF0ZSIsImVycm9yIiwicHJvamVjdEZvbGRlciIsImZvbGRlciIsImFwcGxpY2F0aW9uSW1hZ2UiLCJwcm9qZWN0T2JqZWN0IiwicHJvamVjdE5hbWUiLCJkYXNoYm9hcmRWaXNpYmxlIiwicmVhZHlGb3JBdXRoIiwiaXNVc2VyQXV0aGVudGljYXRlZCIsInVzZXJuYW1lIiwicGFzc3dvcmQiLCJub3RpY2VzIiwic29mdHdhcmVWZXJzaW9uIiwidmVyc2lvbiIsImRpZFBsdW1iaW5nTm90aWNlQ3Jhc2giLCJhY3RpdmVOYXYiLCJwcm9qZWN0c0xpc3QiLCJ3aW4iLCJnZXRDdXJyZW50V2luZG93IiwicHJvY2VzcyIsImVudiIsIkRFViIsIm9wZW5EZXZUb29scyIsImRvY3VtZW50IiwiYWRkRXZlbnRMaXN0ZW5lciIsIm5hdGl2ZUV2ZW50IiwiX2xhc3RNb3VzZVgiLCJjbGllbnRYIiwiX2xhc3RNb3VzZVkiLCJjbGllbnRZIiwiY29tYm9rZXlzIiwiZG9jdW1lbnRFbGVtZW50IiwiZGVib3VuY2UiLCJ3ZWJzb2NrZXQiLCJzZW5kIiwibWV0aG9kIiwicGFyYW1zIiwibGVhZGluZyIsImR1bXBTeXN0ZW1JbmZvIiwib24iLCJ0eXBlIiwibmFtZSIsIm9wZW5UZXJtaW5hbCIsImV4ZWNTeW5jIiwiSlNPTiIsInN0cmluZ2lmeSIsImV4Y2VwdGlvbiIsImNvbnNvbGUiLCJ0aW1lc3RhbXAiLCJEYXRlIiwibm93IiwiZHVtcGRpciIsImpvaW4iLCJ3cml0ZUZpbGVTeW5jIiwiYXJndiIsImV4aXN0c1N5bmMiLCJyZWFkRmlsZVN5bmMiLCJ0b1N0cmluZyIsImFjdGl2ZUZvbGRlciIsInJlYWN0U3RhdGUiLCJfX2ZpbGVuYW1lIiwiX19kaXJuYW1lIiwiaG9tZWRpciIsImlzRGV2VG9vbHNPcGVuZWQiLCJjbG9zZURldlRvb2xzIiwicmVmcyIsInN0YWdlIiwidG9nZ2xlRGV2VG9vbHMiLCJ0aW1lbGluZSIsIm1heWJlUGFzdGVSZXF1ZXN0IiwicGFzdGVkVGV4dCIsInJlYWRUZXh0IiwicGFzdGVkRGF0YSIsInBhcnNlIiwid2FybiIsIkFycmF5IiwiaXNBcnJheSIsInBhc3RlZEVsZW1lbnQiLCJyZXF1ZXN0IiwidGl0bGUiLCJtZXNzYWdlIiwiY2xvc2VUZXh0IiwibGlnaHRTY2hlbWUiLCJsZW5ndGgiLCJpbmZvIiwiZGF0YSIsImhhbmRsZUNvbnRlbnRQYXN0ZSIsImVudm95IiwicG9ydCIsImhhaWt1IiwiaG9zdCIsIldlYlNvY2tldCIsIndpbmRvdyIsImdldCIsInRoZW4iLCJ0b3VyQ2hhbm5lbCIsInNldERhc2hib2FyZFZpc2liaWxpdHkiLCJzZXRUaW1lb3V0Iiwic3RhcnQiLCJ0aHJvdHRsZSIsIm5vdGlmeVNjcmVlblJlc2l6ZSIsInBhc3RlRXZlbnQiLCJ0YWduYW1lIiwidGFyZ2V0IiwidGFnTmFtZSIsInRvTG93ZXJDYXNlIiwicHJldmVudERlZmF1bHQiLCJjYiIsImF1dGhBbnN3ZXIiLCJtZXJnZVRvUGF5bG9hZCIsImRpc3RpbmN0X2lkIiwiaGFpa3VUcmFjayIsInNldFN0YXRlIiwiYXV0aFRva2VuIiwib3JnYW5pemF0aW9uTmFtZSIsImlzQXV0aGVkIiwibGF1bmNoRm9sZGVyIiwiZm9sZGVyTG9hZGluZ0Vycm9yIiwib2ZmIiwic2VsZWN0b3IiLCJ3ZWJ2aWV3IiwiZWxlbWVudCIsInF1ZXJ5U2VsZWN0b3IiLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJ0b3AiLCJsZWZ0IiwicmVjZWl2ZUVsZW1lbnRDb29yZGluYXRlcyIsInJlY2VpdmVXZWJ2aWV3Q29vcmRpbmF0ZXMiLCJjb250ZW50IiwiaSIsIm5leHQiLCJwcm9qZWN0SW5mbyIsInNraXBDb250ZW50Q3JlYXRpb24iLCJwcm9qZWN0c0hvbWUiLCJwcm9qZWN0UGF0aCIsImF1dGhvck5hbWUiLCJwcm9qZWN0Iiwib3JnYW5pemF0aW9uIiwiZXJyIiwiYXNzaWduIiwibWF5YmVQcm9qZWN0TmFtZSIsImluZGV4IiwiaWQiLCJ1bmRlZmluZWQiLCJzbGljZSIsImVhY2giLCJub3RpY2UiLCJNYXRoIiwicmFuZG9tIiwicmVwbGFjZWRFeGlzdGluZyIsImZvckVhY2giLCJuIiwic3BsaWNlIiwidW5zaGlmdCIsImRyYWdFbmROYXRpdmVFdmVudCIsImxpYnJhcnlJdGVtSW5mbyIsImxpYnJhcnlJdGVtRHJhZ2dpbmciLCJwcmV2aWV3IiwiaGFuZGxlRHJvcCIsImRyYWdTdGFydE5hdGl2ZUV2ZW50IiwicG9zaXRpb24iLCJ3aWR0aCIsImhlaWdodCIsInJpZ2h0IiwibWFwIiwiZGlzcGxheSIsInZlcnRpY2FsQWxpZ24iLCJ0ZXh0QWxpZ24iLCJjb2xvciIsImJvdHRvbSIsInJlbmRlclN0YXJ0dXBEZWZhdWx0U2NyZWVuIiwidHJhbnNmb3JtIiwiZm9udFNpemUiLCJvdmVyZmxvdyIsImhhbmRsZVBhbmVSZXNpemUiLCJzd2l0Y2hBY3RpdmVOYXYiLCJvbkxpYnJhcnlEcmFnRW5kIiwib25MaWJyYXJ5RHJhZ1N0YXJ0IiwiYmFja2dyb3VuZENvbG9yIiwib3BhY2l0eSIsIkNvbXBvbmVudCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7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QUFXSyxhQU50QjtBQU9FLG9DQUFjLEtBQUtYLFlBUHJCO0FBUUUsb0NBQWMsS0FBS0QsWUFSckI7QUFTRSwwQ0FBb0IsS0FBS0csa0JBVDNCO0FBVUUsd0NBQWtCLEtBQUtJLEtBQUwsQ0FBV21ILGdCQVYvQjtBQVdFLGlDQUFXLEtBQUtuSCxLQUFMLENBQVdrSCxTQVh4QjtBQVlFLGdDQUFVLEtBQUtsSCxLQUFMLENBQVdVLFFBWnZCO0FBYUUsZ0NBQVUsS0FBS1YsS0FBTCxDQUFXVyxRQWJ2QjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsc0JBREY7QUFlSSx5QkFBS1gsS0FBTCxDQUFXNkosbUJBQVosR0FDRyx1Q0FBSyxPQUFPLEVBQUVLLE9BQU8sTUFBVCxFQUFpQkMsUUFBUSxNQUF6QixFQUFpQ2dCLGlCQUFpQixPQUFsRCxFQUEyREMsU0FBUyxJQUFwRSxFQUEwRW5CLFVBQVUsVUFBcEYsRUFBZ0dwQyxLQUFLLENBQXJHLEVBQXdHQyxNQUFNLENBQTlHLEVBQVo7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLHNCQURILEdBRUc7QUFqQk47QUF4QkY7QUFERixlQURGO0FBK0NFO0FBQ0UscUJBQUksVUFETjtBQUVFLHdCQUFRLEtBQUs5SCxLQUFMLENBQVdFLGFBRnJCO0FBR0UsdUJBQU8sS0FBS3NGLEtBSGQ7QUFJRSx1QkFBTyxLQUFLckcsS0FBTCxDQUFXdUcsS0FKcEI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBL0NGO0FBVEY7QUFERjtBQUZGLE9BREY7QUFzRUQ7Ozs7RUF4b0JrQyxnQkFBTTJGLFM7O2tCQUF0Qm5NLE8iLCJmaWxlIjoiQ3JlYXRvci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCB7IFN0eWxlUm9vdCB9IGZyb20gJ3JhZGl1bSdcbmltcG9ydCBTcGxpdFBhbmUgZnJvbSAncmVhY3Qtc3BsaXQtcGFuZSdcbmltcG9ydCBSZWFjdENTU1RyYW5zaXRpb25Hcm91cCBmcm9tICdyZWFjdC1hZGRvbnMtY3NzLXRyYW5zaXRpb24tZ3JvdXAnXG5pbXBvcnQgbG9kYXNoIGZyb20gJ2xvZGFzaCdcbmltcG9ydCBDb21ib2tleXMgZnJvbSAnY29tYm9rZXlzJ1xuaW1wb3J0IEV2ZW50RW1pdHRlciBmcm9tICdldmVudC1lbWl0dGVyJ1xuaW1wb3J0IGNwIGZyb20gJ2NoaWxkX3Byb2Nlc3MnXG5pbXBvcnQgb3MgZnJvbSAnb3MnXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IGZzIGZyb20gJ2ZzJ1xuaW1wb3J0IEF1dGhlbnRpY2F0aW9uVUkgZnJvbSAnLi9jb21wb25lbnRzL0F1dGhlbnRpY2F0aW9uVUknXG5pbXBvcnQgUHJvamVjdEJyb3dzZXIgZnJvbSAnLi9jb21wb25lbnRzL1Byb2plY3RCcm93c2VyJ1xuaW1wb3J0IFNpZGVCYXIgZnJvbSAnLi9jb21wb25lbnRzL1NpZGVCYXInXG5pbXBvcnQgTGlicmFyeSBmcm9tICcuL2NvbXBvbmVudHMvbGlicmFyeS9MaWJyYXJ5J1xuaW1wb3J0IFN0YXRlSW5zcGVjdG9yIGZyb20gJy4vY29tcG9uZW50cy9TdGF0ZUluc3BlY3Rvci9TdGF0ZUluc3BlY3RvcidcbmltcG9ydCBTdGFnZSBmcm9tICcuL2NvbXBvbmVudHMvU3RhZ2UnXG5pbXBvcnQgVGltZWxpbmUgZnJvbSAnLi9jb21wb25lbnRzL1RpbWVsaW5lJ1xuaW1wb3J0IFRvYXN0IGZyb20gJy4vY29tcG9uZW50cy9ub3RpZmljYXRpb25zL1RvYXN0J1xuaW1wb3J0IFRvdXIgZnJvbSAnLi9jb21wb25lbnRzL1RvdXIvVG91cidcbmltcG9ydCBFbnZveUNsaWVudCBmcm9tICdoYWlrdS1zZGstY3JlYXRvci9saWIvZW52b3kvY2xpZW50J1xuaW1wb3J0IHtcbiAgSE9NRURJUl9QQVRILFxuICBIT01FRElSX0xPR1NfUEFUSFxufSBmcm9tICdoYWlrdS1zZXJpYWxpemF0aW9uL3NyYy91dGlscy9IYWlrdUhvbWVEaXInXG5cbnZhciBwa2cgPSByZXF1aXJlKCcuLy4uLy4uL3BhY2thZ2UuanNvbicpXG5cbnZhciBtaXhwYW5lbCA9IHJlcXVpcmUoJ2hhaWt1LXNlcmlhbGl6YXRpb24vc3JjL3V0aWxzL01peHBhbmVsJylcblxuY29uc3QgZWxlY3Ryb24gPSByZXF1aXJlKCdlbGVjdHJvbicpXG5jb25zdCByZW1vdGUgPSBlbGVjdHJvbi5yZW1vdGVcbmNvbnN0IGlwY1JlbmRlcmVyID0gZWxlY3Ryb24uaXBjUmVuZGVyZXJcbmNvbnN0IGNsaXBib2FyZCA9IGVsZWN0cm9uLmNsaXBib2FyZFxuXG52YXIgd2ViRnJhbWUgPSBlbGVjdHJvbi53ZWJGcmFtZVxuaWYgKHdlYkZyYW1lKSB7XG4gIGlmICh3ZWJGcmFtZS5zZXRab29tTGV2ZWxMaW1pdHMpIHdlYkZyYW1lLnNldFpvb21MZXZlbExpbWl0cygxLCAxKVxuICBpZiAod2ViRnJhbWUuc2V0TGF5b3V0Wm9vbUxldmVsTGltaXRzKSB3ZWJGcmFtZS5zZXRMYXlvdXRab29tTGV2ZWxMaW1pdHMoMCwgMClcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ3JlYXRvciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yIChwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKVxuICAgIHRoaXMuYXV0aGVudGljYXRlVXNlciA9IHRoaXMuYXV0aGVudGljYXRlVXNlci5iaW5kKHRoaXMpXG4gICAgdGhpcy5hdXRoZW50aWNhdGlvbkNvbXBsZXRlID0gdGhpcy5hdXRoZW50aWNhdGlvbkNvbXBsZXRlLmJpbmQodGhpcylcbiAgICB0aGlzLmxvYWRQcm9qZWN0cyA9IHRoaXMubG9hZFByb2plY3RzLmJpbmQodGhpcylcbiAgICB0aGlzLmxhdW5jaFByb2plY3QgPSB0aGlzLmxhdW5jaFByb2plY3QuYmluZCh0aGlzKVxuICAgIHRoaXMucmVtb3ZlTm90aWNlID0gdGhpcy5yZW1vdmVOb3RpY2UuYmluZCh0aGlzKVxuICAgIHRoaXMuY3JlYXRlTm90aWNlID0gdGhpcy5jcmVhdGVOb3RpY2UuYmluZCh0aGlzKVxuICAgIHRoaXMucmVuZGVyTm90aWZpY2F0aW9ucyA9IHRoaXMucmVuZGVyTm90aWZpY2F0aW9ucy5iaW5kKHRoaXMpXG4gICAgdGhpcy5yZWNlaXZlUHJvamVjdEluZm8gPSB0aGlzLnJlY2VpdmVQcm9qZWN0SW5mby5iaW5kKHRoaXMpXG4gICAgdGhpcy5oYW5kbGVGaW5kRWxlbWVudENvb3JkaW5hdGVzID0gdGhpcy5oYW5kbGVGaW5kRWxlbWVudENvb3JkaW5hdGVzLmJpbmQodGhpcylcbiAgICB0aGlzLmhhbmRsZUZpbmRXZWJ2aWV3Q29vcmRpbmF0ZXMgPSB0aGlzLmhhbmRsZUZpbmRXZWJ2aWV3Q29vcmRpbmF0ZXMuYmluZCh0aGlzKVxuICAgIHRoaXMubGF5b3V0ID0gbmV3IEV2ZW50RW1pdHRlcigpXG5cbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgZXJyb3I6IG51bGwsXG4gICAgICBwcm9qZWN0Rm9sZGVyOiB0aGlzLnByb3BzLmZvbGRlcixcbiAgICAgIGFwcGxpY2F0aW9uSW1hZ2U6IG51bGwsXG4gICAgICBwcm9qZWN0T2JqZWN0OiBudWxsLFxuICAgICAgcHJvamVjdE5hbWU6IG51bGwsXG4gICAgICBkYXNoYm9hcmRWaXNpYmxlOiAhdGhpcy5wcm9wcy5mb2xkZXIsXG4gICAgICByZWFkeUZvckF1dGg6IGZhbHNlLFxuICAgICAgaXNVc2VyQXV0aGVudGljYXRlZDogZmFsc2UsXG4gICAgICB1c2VybmFtZTogbnVsbCxcbiAgICAgIHBhc3N3b3JkOiBudWxsLFxuICAgICAgbm90aWNlczogW10sXG4gICAgICBzb2Z0d2FyZVZlcnNpb246IHBrZy52ZXJzaW9uLFxuICAgICAgZGlkUGx1bWJpbmdOb3RpY2VDcmFzaDogZmFsc2UsXG4gICAgICBhY3RpdmVOYXY6ICdsaWJyYXJ5JyxcbiAgICAgIHByb2plY3RzTGlzdDogW11cbiAgICB9XG5cbiAgICBjb25zdCB3aW4gPSByZW1vdGUuZ2V0Q3VycmVudFdpbmRvdygpXG5cbiAgICBpZiAocHJvY2Vzcy5lbnYuREVWID09PSAnMScpIHtcbiAgICAgIHdpbi5vcGVuRGV2VG9vbHMoKVxuICAgIH1cblxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIChuYXRpdmVFdmVudCkgPT4ge1xuICAgICAgdGhpcy5fbGFzdE1vdXNlWCA9IG5hdGl2ZUV2ZW50LmNsaWVudFhcbiAgICAgIHRoaXMuX2xhc3RNb3VzZVkgPSBuYXRpdmVFdmVudC5jbGllbnRZXG4gICAgfSlcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdkcmFnJywgKG5hdGl2ZUV2ZW50KSA9PiB7XG4gICAgICAvLyBXaGVuIHRoZSBkcmFnIGVuZHMsIGZvciBzb21lIHJlYXNvbiB0aGUgcG9zaXRpb24gZ29lcyB0byAwLCBzbyBoYWNrIHRoaXMuLi5cbiAgICAgIGlmIChuYXRpdmVFdmVudC5jbGllbnRYID4gMCAmJiBuYXRpdmVFdmVudC5jbGllbnRZID4gMCkge1xuICAgICAgICB0aGlzLl9sYXN0TW91c2VYID0gbmF0aXZlRXZlbnQuY2xpZW50WFxuICAgICAgICB0aGlzLl9sYXN0TW91c2VZID0gbmF0aXZlRXZlbnQuY2xpZW50WVxuICAgICAgfVxuICAgIH0pXG5cbiAgICBjb25zdCBjb21ib2tleXMgPSBuZXcgQ29tYm9rZXlzKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudClcbiAgICBjb21ib2tleXMuYmluZCgnY29tbWFuZCtvcHRpb24raScsIGxvZGFzaC5kZWJvdW5jZSgoKSA9PiB7XG4gICAgICB0aGlzLnByb3BzLndlYnNvY2tldC5zZW5kKHsgbWV0aG9kOiAndG9nZ2xlRGV2VG9vbHMnLCBwYXJhbXM6IFt0aGlzLnN0YXRlLnByb2plY3RGb2xkZXJdIH0pXG4gICAgfSwgNTAwLCB7IGxlYWRpbmc6IHRydWUgfSkpXG4gICAgY29tYm9rZXlzLmJpbmQoJ2NvbW1hbmQrb3B0aW9uKzAnLCBsb2Rhc2guZGVib3VuY2UoKCkgPT4ge1xuICAgICAgdGhpcy5kdW1wU3lzdGVtSW5mbygpXG4gICAgfSwgNTAwLCB7IGxlYWRpbmc6IHRydWUgfSkpXG5cbiAgICAvLyBOT1RFOiBUaGUgVG9wTWVudSBhdXRvbWF0aWNhbGx5IGJpbmRzIHRoZSBiZWxvdyBrZXlib2FyZCBzaG9ydGN1dHMvYWNjZWxlcmF0b3JzXG4gICAgaXBjUmVuZGVyZXIub24oJ2dsb2JhbC1tZW51Onpvb20taW4nLCAoKSA9PiB7XG4gICAgICB0aGlzLnByb3BzLndlYnNvY2tldC5zZW5kKHsgdHlwZTogJ2Jyb2FkY2FzdCcsIG5hbWU6ICd2aWV3Onpvb20taW4nIH0pXG4gICAgfSlcbiAgICBpcGNSZW5kZXJlci5vbignZ2xvYmFsLW1lbnU6em9vbS1vdXQnLCAoKSA9PiB7XG4gICAgICB0aGlzLnByb3BzLndlYnNvY2tldC5zZW5kKHsgdHlwZTogJ2Jyb2FkY2FzdCcsIG5hbWU6ICd2aWV3Onpvb20tb3V0JyB9KVxuICAgIH0pXG4gICAgaXBjUmVuZGVyZXIub24oJ2dsb2JhbC1tZW51Om9wZW4tdGVybWluYWwnLCBsb2Rhc2guZGVib3VuY2UoKCkgPT4ge1xuICAgICAgdGhpcy5vcGVuVGVybWluYWwodGhpcy5zdGF0ZS5wcm9qZWN0Rm9sZGVyKVxuICAgIH0sIDUwMCwgeyBsZWFkaW5nOiB0cnVlIH0pKVxuICAgIGlwY1JlbmRlcmVyLm9uKCdnbG9iYWwtbWVudTp1bmRvJywgbG9kYXNoLmRlYm91bmNlKCgpID0+IHtcbiAgICAgIHRoaXMucHJvcHMud2Vic29ja2V0LnNlbmQoeyBtZXRob2Q6ICdnaXRVbmRvJywgcGFyYW1zOiBbdGhpcy5zdGF0ZS5wcm9qZWN0Rm9sZGVyLCB7IHR5cGU6ICdnbG9iYWwnIH1dIH0pXG4gICAgfSwgNTAwLCB7IGxlYWRpbmc6IHRydWUgfSkpXG4gICAgaXBjUmVuZGVyZXIub24oJ2dsb2JhbC1tZW51OnJlZG8nLCBsb2Rhc2guZGVib3VuY2UoKCkgPT4ge1xuICAgICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQuc2VuZCh7IG1ldGhvZDogJ2dpdFJlZG8nLCBwYXJhbXM6IFt0aGlzLnN0YXRlLnByb2plY3RGb2xkZXIsIHsgdHlwZTogJ2dsb2JhbCcgfV0gfSlcbiAgICB9LCA1MDAsIHsgbGVhZGluZzogdHJ1ZSB9KSlcbiAgfVxuXG4gIG9wZW5UZXJtaW5hbCAoZm9sZGVyKSB7XG4gICAgdHJ5IHtcbiAgICAgIGNwLmV4ZWNTeW5jKCdvcGVuIC1iIGNvbS5hcHBsZS50ZXJtaW5hbCAnICsgSlNPTi5zdHJpbmdpZnkoZm9sZGVyKSArICcgfHwgdHJ1ZScpXG4gICAgfSBjYXRjaCAoZXhjZXB0aW9uKSB7XG4gICAgICBjb25zb2xlLmVycm9yKGV4Y2VwdGlvbilcbiAgICB9XG4gIH1cblxuICBkdW1wU3lzdGVtSW5mbyAoKSB7XG4gICAgY29uc3QgdGltZXN0YW1wID0gRGF0ZS5ub3coKVxuICAgIGNvbnN0IGR1bXBkaXIgPSBwYXRoLmpvaW4oSE9NRURJUl9QQVRILCAnZHVtcHMnLCBgZHVtcC0ke3RpbWVzdGFtcH1gKVxuICAgIGNwLmV4ZWNTeW5jKGBta2RpciAtcCAke0pTT04uc3RyaW5naWZ5KGR1bXBkaXIpfWApXG4gICAgZnMud3JpdGVGaWxlU3luYyhwYXRoLmpvaW4oZHVtcGRpciwgJ2FyZ3YnKSwgSlNPTi5zdHJpbmdpZnkocHJvY2Vzcy5hcmd2LCBudWxsLCAyKSlcbiAgICBmcy53cml0ZUZpbGVTeW5jKHBhdGguam9pbihkdW1wZGlyLCAnZW52JyksIEpTT04uc3RyaW5naWZ5KHByb2Nlc3MuZW52LCBudWxsLCAyKSlcbiAgICBpZiAoZnMuZXhpc3RzU3luYyhwYXRoLmpvaW4oSE9NRURJUl9MT0dTX1BBVEgsICdoYWlrdS1kZWJ1Zy5sb2cnKSkpIHtcbiAgICAgIGZzLndyaXRlRmlsZVN5bmMocGF0aC5qb2luKGR1bXBkaXIsICdsb2cnKSwgZnMucmVhZEZpbGVTeW5jKHBhdGguam9pbihIT01FRElSX0xPR1NfUEFUSCwgJ2hhaWt1LWRlYnVnLmxvZycpKS50b1N0cmluZygpKVxuICAgIH1cbiAgICBmcy53cml0ZUZpbGVTeW5jKHBhdGguam9pbihkdW1wZGlyLCAnaW5mbycpLCBKU09OLnN0cmluZ2lmeSh7XG4gICAgICBhY3RpdmVGb2xkZXI6IHRoaXMuc3RhdGUucHJvamVjdEZvbGRlcixcbiAgICAgIHJlYWN0U3RhdGU6IHRoaXMuc3RhdGUsXG4gICAgICBfX2ZpbGVuYW1lOiBfX2ZpbGVuYW1lLFxuICAgICAgX19kaXJuYW1lOiBfX2Rpcm5hbWVcbiAgICB9LCBudWxsLCAyKSlcbiAgICBpZiAodGhpcy5zdGF0ZS5wcm9qZWN0Rm9sZGVyKSB7XG4gICAgICAvLyBUaGUgcHJvamVjdCBmb2xkZXIgaXRzZWxmIHdpbGwgY29udGFpbiBnaXQgbG9ncyBhbmQgb3RoZXIgZ29vZGllcyB3ZSBtZ2lodCB3YW50IHRvIGxvb2sgYXRcbiAgICAgIGNwLmV4ZWNTeW5jKGB0YXIgLXpjdmYgJHtKU09OLnN0cmluZ2lmeShwYXRoLmpvaW4oZHVtcGRpciwgJ3Byb2plY3QudGFyLmd6JykpfSAke0pTT04uc3RyaW5naWZ5KHRoaXMuc3RhdGUucHJvamVjdEZvbGRlcil9YClcbiAgICB9XG4gICAgLy8gRm9yIGNvbnZlbmllbmNlLCB6aXAgdXAgdGhlIGVudGlyZSBkdW1wIGZvbGRlci4uLlxuICAgIGNwLmV4ZWNTeW5jKGB0YXIgLXpjdmYgJHtKU09OLnN0cmluZ2lmeShwYXRoLmpvaW4ob3MuaG9tZWRpcigpLCBgaGFpa3UtZHVtcC0ke3RpbWVzdGFtcH0udGFyLmd6YCkpfSAke0pTT04uc3RyaW5naWZ5KGR1bXBkaXIpfWApXG4gIH1cblxuICB0b2dnbGVEZXZUb29scyAoKSB7XG4gICAgY29uc3Qgd2luID0gcmVtb3RlLmdldEN1cnJlbnRXaW5kb3coKVxuICAgIGlmICh3aW4uaXNEZXZUb29sc09wZW5lZCgpKSB3aW4uY2xvc2VEZXZUb29scygpXG4gICAgZWxzZSB3aW4ub3BlbkRldlRvb2xzKClcbiAgICBpZiAodGhpcy5yZWZzLnN0YWdlKSB0aGlzLnJlZnMuc3RhZ2UudG9nZ2xlRGV2VG9vbHMoKVxuICAgIGlmICh0aGlzLnJlZnMudGltZWxpbmUpIHRoaXMucmVmcy50aW1lbGluZS50b2dnbGVEZXZUb29scygpXG4gIH1cblxuICBoYW5kbGVDb250ZW50UGFzdGUgKG1heWJlUGFzdGVSZXF1ZXN0KSB7XG4gICAgbGV0IHBhc3RlZFRleHQgPSBjbGlwYm9hcmQucmVhZFRleHQoKVxuICAgIGlmICghcGFzdGVkVGV4dCkgcmV0dXJuIHZvaWQgKDApXG5cbiAgICAvLyBUaGUgZGF0YSBvbiB0aGUgY2xpcGJvYXJkIG1pZ2h0IGJlIHNlcmlhbGl6ZWQgZGF0YSwgc28gdHJ5IHRvIHBhcnNlIGl0IGlmIHRoYXQncyB0aGUgY2FzZVxuICAgIC8vIFRoZSBtYWluIGNhc2Ugd2UgaGF2ZSBub3cgZm9yIHNlcmlhbGl6ZWQgZGF0YSBpcyBoYWlrdSBlbGVtZW50cyBjb3BpZWQgZnJvbSB0aGUgc3RhZ2VcbiAgICBsZXQgcGFzdGVkRGF0YVxuICAgIHRyeSB7XG4gICAgICBwYXN0ZWREYXRhID0gSlNPTi5wYXJzZShwYXN0ZWRUZXh0KVxuICAgIH0gY2F0Y2ggKGV4Y2VwdGlvbikge1xuICAgICAgY29uc29sZS53YXJuKCdbY3JlYXRvcl0gdW5hYmxlIHRvIHBhcnNlIHBhc3RlZCBkYXRhOyBpdCBtaWdodCBiZSBwbGFpbiB0ZXh0JylcbiAgICAgIHBhc3RlZERhdGEgPSBwYXN0ZWRUZXh0XG4gICAgfVxuXG4gICAgaWYgKEFycmF5LmlzQXJyYXkocGFzdGVkRGF0YSkpIHtcbiAgICAgIC8vIFRoaXMgbG9va3MgbGlrZSBhIEhhaWt1IGVsZW1lbnQgdGhhdCBoYXMgYmVlbiBjb3BpZWQgZnJvbSB0aGUgc3RhZ2VcbiAgICAgIGlmIChwYXN0ZWREYXRhWzBdID09PSAnYXBwbGljYXRpb24vaGFpa3UnICYmIHR5cGVvZiBwYXN0ZWREYXRhWzFdID09PSAnb2JqZWN0Jykge1xuICAgICAgICBsZXQgcGFzdGVkRWxlbWVudCA9IHBhc3RlZERhdGFbMV1cblxuICAgICAgICAvLyBDb21tYW5kIHRoZSB2aWV3cyBhbmQgbWFzdGVyIHByb2Nlc3MgdG8gaGFuZGxlIHRoZSBlbGVtZW50IHBhc3RlIGFjdGlvblxuICAgICAgICAvLyBUaGUgJ3Bhc3RlVGhpbmcnIGFjdGlvbiBpcyBpbnRlbmRlZCB0byBiZSBhYmxlIHRvIGhhbmRsZSBtdWx0aXBsZSBjb250ZW50IHR5cGVzXG4gICAgICAgIHJldHVybiB0aGlzLnByb3BzLndlYnNvY2tldC5yZXF1ZXN0KHsgdHlwZTogJ2FjdGlvbicsIG1ldGhvZDogJ3Bhc3RlVGhpbmcnLCBwYXJhbXM6IFt0aGlzLnN0YXRlLnByb2plY3RGb2xkZXIsIHBhc3RlZEVsZW1lbnQsIG1heWJlUGFzdGVSZXF1ZXN0IHx8IHt9XSB9LCAoZXJyb3IpID0+IHtcbiAgICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jcmVhdGVOb3RpY2Uoe1xuICAgICAgICAgICAgICB0eXBlOiAnd2FybmluZycsXG4gICAgICAgICAgICAgIHRpdGxlOiAnVWggb2ghJyxcbiAgICAgICAgICAgICAgbWVzc2FnZTogJ1dlIGNvdWxkblxcJ3QgcGFzdGUgdGhhdC4g8J+YoiBQbGVhc2UgY29udGFjdCBIYWlrdSBmb3Igc3VwcG9ydC4nLFxuICAgICAgICAgICAgICBjbG9zZVRleHQ6ICdPa2F5JyxcbiAgICAgICAgICAgICAgbGlnaHRTY2hlbWU6IHRydWVcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gVE9ETzogSGFuZGxlIG90aGVyIGNhc2VzIHdoZXJlIHRoZSBwYXN0ZSBkYXRhIHdhcyBhIHNlcmlhbGl6ZWQgYXJyYXlcbiAgICAgICAgY29uc29sZS53YXJuKCdbY3JlYXRvcl0gY2Fubm90IHBhc3RlIHRoaXMgY29udGVudCB0eXBlIHlldCAoYXJyYXkpJylcbiAgICAgICAgdGhpcy5jcmVhdGVOb3RpY2Uoe1xuICAgICAgICAgIHR5cGU6ICd3YXJuaW5nJyxcbiAgICAgICAgICB0aXRsZTogJ0htbW0nLFxuICAgICAgICAgIG1lc3NhZ2U6ICdXZSBkb25cXCd0IGtub3cgaG93IHRvIHBhc3RlIHRoYXQgY29udGVudCB5ZXQuIPCfmLMnLFxuICAgICAgICAgIGNsb3NlVGV4dDogJ09rYXknLFxuICAgICAgICAgIGxpZ2h0U2NoZW1lOiB0cnVlXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIEFuIGVtcHR5IHN0cmluZyBpcyB0cmVhdGVkIGFzIHRoZSBlcXVpdmFsZW50IG9mIG5vdGhpbmcgKGRvbid0IGRpc3BsYXkgd2FybmluZyBpZiBub3RoaW5nIHRvIGluc3RhbnRpYXRlKVxuICAgICAgaWYgKHR5cGVvZiBwYXN0ZWREYXRhID09PSAnc3RyaW5nJyAmJiBwYXN0ZWREYXRhLmxlbmd0aCA+IDApIHtcbiAgICAgICAgLy8gVE9ETzogSGFuZGxlIHRoZSBjYXNlIHdoZW4gcGxhaW4gdGV4dCBoYXMgYmVlbiBwYXN0ZWQgLSBTVkcsIEhUTUwsIGV0Yz9cbiAgICAgICAgY29uc29sZS53YXJuKCdbY3JlYXRvcl0gY2Fubm90IHBhc3RlIHRoaXMgY29udGVudCB0eXBlIHlldCAodW5rbm93biBzdHJpbmcpJylcbiAgICAgICAgdGhpcy5jcmVhdGVOb3RpY2Uoe1xuICAgICAgICAgIHR5cGU6ICd3YXJuaW5nJyxcbiAgICAgICAgICB0aXRsZTogJ0htbW0nLFxuICAgICAgICAgIG1lc3NhZ2U6ICdXZSBkb25cXCd0IGtub3cgaG93IHRvIHBhc3RlIHRoYXQgY29udGVudCB5ZXQuIPCfmLMnLFxuICAgICAgICAgIGNsb3NlVGV4dDogJ09rYXknLFxuICAgICAgICAgIGxpZ2h0U2NoZW1lOiB0cnVlXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgY29tcG9uZW50V2lsbE1vdW50ICgpIHtcbiAgICB0aGlzLnByb3BzLndlYnNvY2tldC5vbignYnJvYWRjYXN0JywgKG1lc3NhZ2UpID0+IHtcbiAgICAgIHN3aXRjaCAobWVzc2FnZS5uYW1lKSB7XG4gICAgICAgIGNhc2UgJ2Rldi10b29sczp0b2dnbGUnOlxuICAgICAgICAgIHRoaXMudG9nZ2xlRGV2VG9vbHMoKVxuICAgICAgICAgIGJyZWFrXG5cbiAgICAgICAgY2FzZSAnY3VycmVudC1wYXN0ZWFibGU6cmVxdWVzdC1wYXN0ZSc6XG4gICAgICAgICAgY29uc29sZS5pbmZvKCdbY3JlYXRvcl0gY3VycmVudC1wYXN0ZWFibGU6cmVxdWVzdC1wYXN0ZScsIG1lc3NhZ2UuZGF0YSlcbiAgICAgICAgICByZXR1cm4gdGhpcy5oYW5kbGVDb250ZW50UGFzdGUobWVzc2FnZS5kYXRhKVxuICAgICAgfVxuICAgIH0pXG5cbiAgICB0aGlzLmVudm95ID0gbmV3IEVudm95Q2xpZW50KHtcbiAgICAgIHBvcnQ6IHRoaXMucHJvcHMuaGFpa3UuZW52b3kucG9ydCxcbiAgICAgIGhvc3Q6IHRoaXMucHJvcHMuaGFpa3UuZW52b3kuaG9zdCxcbiAgICAgIFdlYlNvY2tldDogd2luZG93LldlYlNvY2tldFxuICAgIH0pXG5cbiAgICB0aGlzLmVudm95LmdldCgndG91cicpLnRoZW4oKHRvdXJDaGFubmVsKSA9PiB7XG4gICAgICB0aGlzLnRvdXJDaGFubmVsID0gdG91ckNoYW5uZWxcblxuICAgICAgdG91ckNoYW5uZWwub24oJ3RvdXI6cmVxdWVzdEVsZW1lbnRDb29yZGluYXRlcycsIHRoaXMuaGFuZGxlRmluZEVsZW1lbnRDb29yZGluYXRlcylcblxuICAgICAgdG91ckNoYW5uZWwub24oJ3RvdXI6cmVxdWVzdFdlYnZpZXdDb29yZGluYXRlcycsIHRoaXMuaGFuZGxlRmluZFdlYnZpZXdDb29yZGluYXRlcylcblxuICAgICAgaXBjUmVuZGVyZXIub24oJ2dsb2JhbC1tZW51OnN0YXJ0LXRvdXInLCAoKSA9PiB7XG4gICAgICAgIHRoaXMuc2V0RGFzaGJvYXJkVmlzaWJpbGl0eSh0cnVlKVxuXG4gICAgICAgIC8vIFB1dCBpdCBhdCB0aGUgYm90dG9tIG9mIHRoZSBldmVudCBsb29wXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIHRvdXJDaGFubmVsLnN0YXJ0KHRydWUpXG4gICAgICAgIH0pXG4gICAgICB9KVxuXG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgbG9kYXNoLnRocm90dGxlKCgpID0+IHtcbiAgICAgICAgLy8gaWYgKHRvdXJDaGFubmVsLmlzVG91ckFjdGl2ZSgpKSB7XG4gICAgICAgIHRvdXJDaGFubmVsLm5vdGlmeVNjcmVlblJlc2l6ZSgpXG4gICAgICAgIC8vIH1cbiAgICAgIH0pLCAzMDApXG4gICAgfSlcblxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3Bhc3RlJywgKHBhc3RlRXZlbnQpID0+IHtcbiAgICAgIGNvbnNvbGUuaW5mbygnW2NyZWF0b3JdIHBhc3RlIGhlYXJkJylcbiAgICAgIGxldCB0YWduYW1lID0gcGFzdGVFdmVudC50YXJnZXQudGFnTmFtZS50b0xvd2VyQ2FzZSgpXG4gICAgICBpZiAodGFnbmFtZSA9PT0gJ2lucHV0JyB8fCB0YWduYW1lID09PSAndGV4dGFyZWEnKSB7XG4gICAgICAgIC8vIERvIG5vdGhpbmc7IGxldCBpbnB1dCBmaWVsZHMgYW5kIHNvLW9uIGJlIGhhbmRsZWQgbm9ybWFsbHlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIE90aGVyd2lzZSwgYXNzdW1lIHdlIG1pZ2h0IG5lZWQgdG8gaGFuZGxlIHRoaXMgcGFzdGUgZXZlbnQgc3BlY2lhbGx5XG4gICAgICAgIHBhc3RlRXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgICAgICB0aGlzLmhhbmRsZUNvbnRlbnRQYXN0ZSgpXG4gICAgICB9XG4gICAgfSlcblxuICAgIHRoaXMucHJvcHMud2Vic29ja2V0Lm9uKCdtZXRob2QnLCAobWV0aG9kLCBwYXJhbXMsIGNiKSA9PiB7XG4gICAgICBjb25zb2xlLmluZm8oJ1tjcmVhdG9yXSBtZXRob2QgZnJvbSBwbHVtYmluZzonLCBtZXRob2QsIHBhcmFtcylcbiAgICAgIC8vIG5vLW9wOyBjcmVhdG9yIGRvZXNuJ3QgY3VycmVudGx5IHJlY2VpdmUgYW55IG1ldGhvZHMgZnJvbSB0aGUgb3RoZXIgdmlld3MsIGJ1dCB3ZSBuZWVkIHRoaXNcbiAgICAgIC8vIGNhbGxiYWNrIHRvIGJlIGNhbGxlZCB0byBhbGxvdyB0aGUgYWN0aW9uIGNoYWluIGluIHBsdW1iaW5nIHRvIHByb2NlZWRcbiAgICAgIHJldHVybiBjYigpXG4gICAgfSlcblxuICAgIHRoaXMucHJvcHMud2Vic29ja2V0Lm9uKCdvcGVuJywgKCkgPT4ge1xuICAgICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQucmVxdWVzdCh7IG1ldGhvZDogJ2lzVXNlckF1dGhlbnRpY2F0ZWQnLCBwYXJhbXM6IFtdIH0sIChlcnJvciwgYXV0aEFuc3dlcikgPT4ge1xuICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKVxuICAgICAgICAgIHJldHVybiB0aGlzLmNyZWF0ZU5vdGljZSh7XG4gICAgICAgICAgICB0eXBlOiAnZXJyb3InLFxuICAgICAgICAgICAgdGl0bGU6ICdPaCBubyEnLFxuICAgICAgICAgICAgbWVzc2FnZTogJ1dlIGhhZCBhIHByb2JsZW0gYWNjZXNzaW5nIHlvdXIgYWNjb3VudC4g8J+YoiBQbGVhc2UgdHJ5IGNsb3NpbmcgYW5kIHJlb3BlbmluZyB0aGUgYXBwbGljYXRpb24uIElmIHlvdSBzdGlsbCBzZWUgdGhpcyBtZXNzYWdlLCBjb250YWN0IEhhaWt1IGZvciBzdXBwb3J0LicsXG4gICAgICAgICAgICBjbG9zZVRleHQ6ICdPa2F5JyxcbiAgICAgICAgICAgIGxpZ2h0U2NoZW1lOiB0cnVlXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuXG4gICAgICAgIG1peHBhbmVsLm1lcmdlVG9QYXlsb2FkKHsgZGlzdGluY3RfaWQ6IGF1dGhBbnN3ZXIgJiYgYXV0aEFuc3dlci51c2VybmFtZSB9KVxuICAgICAgICBtaXhwYW5lbC5oYWlrdVRyYWNrKCdjcmVhdG9yOm9wZW5lZCcpXG5cbiAgICAgICAgLy8gRGVsYXkgc28gdGhlIGRlZmF1bHQgc3RhcnR1cCBzY3JlZW4gZG9lc24ndCBqdXN0IGZsYXNoIHRoZW4gZ28gYXdheVxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIHJlYWR5Rm9yQXV0aDogdHJ1ZSxcbiAgICAgICAgICAgIGF1dGhUb2tlbjogYXV0aEFuc3dlciAmJiBhdXRoQW5zd2VyLmF1dGhUb2tlbixcbiAgICAgICAgICAgIG9yZ2FuaXphdGlvbk5hbWU6IGF1dGhBbnN3ZXIgJiYgYXV0aEFuc3dlci5vcmdhbml6YXRpb25OYW1lLFxuICAgICAgICAgICAgdXNlcm5hbWU6IGF1dGhBbnN3ZXIgJiYgYXV0aEFuc3dlci51c2VybmFtZSxcbiAgICAgICAgICAgIGlzVXNlckF1dGhlbnRpY2F0ZWQ6IGF1dGhBbnN3ZXIgJiYgYXV0aEFuc3dlci5pc0F1dGhlZFxuICAgICAgICAgIH0pXG4gICAgICAgICAgaWYgKHRoaXMucHJvcHMuZm9sZGVyKSB7XG4gICAgICAgICAgICAvLyBMYXVuY2ggZm9sZGVyIGRpcmVjdGx5IC0gaS5lLiBhbGxvdyBhICdzdWJsJyBsaWtlIGV4cGVyaWVuY2Ugd2l0aG91dCBoYXZpbmcgdG8gZ29cbiAgICAgICAgICAgIC8vIHRocm91Z2ggdGhlIHByb2plY3RzIGluZGV4XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5sYXVuY2hGb2xkZXIobnVsbCwgdGhpcy5wcm9wcy5mb2xkZXIsIChlcnJvcikgPT4ge1xuICAgICAgICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKVxuICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBmb2xkZXJMb2FkaW5nRXJyb3I6IGVycm9yIH0pXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlTm90aWNlKHtcbiAgICAgICAgICAgICAgICAgIHR5cGU6ICdlcnJvcicsXG4gICAgICAgICAgICAgICAgICB0aXRsZTogJ09oIG5vIScsXG4gICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnV2Ugd2VyZSB1bmFibGUgdG8gb3BlbiB0aGUgZm9sZGVyLiDwn5iiIFBsZWFzZSBjbG9zZSBhbmQgcmVvcGVuIHRoZSBhcHBsaWNhdGlvbiBhbmQgdHJ5IGFnYWluLiBJZiB5b3Ugc3RpbGwgc2VlIHRoaXMgbWVzc2FnZSwgY29udGFjdCBIYWlrdSBmb3Igc3VwcG9ydC4nLFxuICAgICAgICAgICAgICAgICAgY2xvc2VUZXh0OiAnT2theScsXG4gICAgICAgICAgICAgICAgICBsaWdodFNjaGVtZTogdHJ1ZVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfVxuICAgICAgICB9LCAxMDAwKVxuICAgICAgfSlcbiAgICB9KVxuICB9XG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQgKCkge1xuICAgIHRoaXMudG91ckNoYW5uZWwub2ZmKCd0b3VyOnJlcXVlc3RFbGVtZW50Q29vcmRpbmF0ZXMnLCB0aGlzLmhhbmRsZUZpbmRFbGVtZW50Q29vcmRpbmF0ZXMpXG4gICAgdGhpcy50b3VyQ2hhbm5lbC5vZmYoJ3RvdXI6cmVxdWVzdFdlYnZpZXdDb29yZGluYXRlcycsIHRoaXMuaGFuZGxlRmluZFdlYnZpZXdDb29yZGluYXRlcylcbiAgfVxuXG4gIGhhbmRsZUZpbmRFbGVtZW50Q29vcmRpbmF0ZXMgKHsgc2VsZWN0b3IsIHdlYnZpZXcgfSkge1xuICAgIGlmICh3ZWJ2aWV3ICE9PSAnY3JlYXRvcicpIHsgcmV0dXJuIH1cblxuICAgIHRyeSB7XG4gICAgICAvLyBUT0RPOiBmaW5kIGlmIHRoZXJlIGlzIGEgYmV0dGVyIHNvbHV0aW9uIHRvIHRoaXMgc2NhcGUgaGF0Y2hcbiAgICAgIGxldCBlbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3RvcilcbiAgICAgIGxldCB7IHRvcCwgbGVmdCB9ID0gZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuXG4gICAgICB0aGlzLnRvdXJDaGFubmVsLnJlY2VpdmVFbGVtZW50Q29vcmRpbmF0ZXMoJ2NyZWF0b3InLCB7IHRvcCwgbGVmdCB9KVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmVycm9yKGBbY3JlYXRvcl0gZXJyb3IgZmV0Y2hpbmcgJHtzZWxlY3Rvcn0gaW4gd2VidmlldyAke3dlYnZpZXd9YClcbiAgICB9XG4gIH1cblxuICBoYW5kbGVGaW5kV2Vidmlld0Nvb3JkaW5hdGVzICgpIHtcbiAgICB0aGlzLnRvdXJDaGFubmVsLnJlY2VpdmVXZWJ2aWV3Q29vcmRpbmF0ZXMoJ2NyZWF0b3InLCB7IHRvcDogMCwgbGVmdDogMCB9KVxuICB9XG5cbiAgaGFuZGxlUGFuZVJlc2l6ZSAoKSB7XG4gICAgLy8gdGhpcy5sYXlvdXQuZW1pdCgncmVzaXplJylcbiAgfVxuXG4gIHJlbmRlck5vdGlmaWNhdGlvbnMgKGNvbnRlbnQsIGkpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPFRvYXN0XG4gICAgICAgIHRvYXN0VHlwZT17Y29udGVudC50eXBlfVxuICAgICAgICB0b2FzdFRpdGxlPXtjb250ZW50LnRpdGxlfVxuICAgICAgICB0b2FzdE1lc3NhZ2U9e2NvbnRlbnQubWVzc2FnZX1cbiAgICAgICAgY2xvc2VUZXh0PXtjb250ZW50LmNsb3NlVGV4dH1cbiAgICAgICAga2V5PXtpICsgY29udGVudC50aXRsZX1cbiAgICAgICAgbXlLZXk9e2l9XG4gICAgICAgIHJlbW92ZU5vdGljZT17dGhpcy5yZW1vdmVOb3RpY2V9XG4gICAgICAgIGxpZ2h0U2NoZW1lPXtjb250ZW50LmxpZ2h0U2NoZW1lfSAvPlxuICAgIClcbiAgfVxuXG4gIHNldERhc2hib2FyZFZpc2liaWxpdHkgKGRhc2hib2FyZFZpc2libGUpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtkYXNoYm9hcmRWaXNpYmxlfSlcbiAgfVxuXG4gIHN3aXRjaEFjdGl2ZU5hdiAoYWN0aXZlTmF2KSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7YWN0aXZlTmF2fSlcblxuICAgIGlmIChhY3RpdmVOYXYgPT09ICdzdGF0ZV9pbnNwZWN0b3InKSB7XG4gICAgICB0aGlzLnRvdXJDaGFubmVsLm5leHQoKVxuICAgIH1cbiAgfVxuXG4gIGF1dGhlbnRpY2F0ZVVzZXIgKHVzZXJuYW1lLCBwYXNzd29yZCwgY2IpIHtcbiAgICByZXR1cm4gdGhpcy5wcm9wcy53ZWJzb2NrZXQucmVxdWVzdCh7IG1ldGhvZDogJ2F1dGhlbnRpY2F0ZVVzZXInLCBwYXJhbXM6IFt1c2VybmFtZSwgcGFzc3dvcmRdIH0sIChlcnJvciwgYXV0aEFuc3dlcikgPT4ge1xuICAgICAgaWYgKGVycm9yKSByZXR1cm4gY2IoZXJyb3IpXG4gICAgICBtaXhwYW5lbC5tZXJnZVRvUGF5bG9hZCh7IGRpc3RpbmN0X2lkOiB1c2VybmFtZSB9KVxuICAgICAgbWl4cGFuZWwuaGFpa3VUcmFjaygnY3JlYXRvcjp1c2VyLWF1dGhlbnRpY2F0ZWQnLCB7IHVzZXJuYW1lIH0pXG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgdXNlcm5hbWUsXG4gICAgICAgIHBhc3N3b3JkLFxuICAgICAgICBhdXRoVG9rZW46IGF1dGhBbnN3ZXIgJiYgYXV0aEFuc3dlci5hdXRoVG9rZW4sXG4gICAgICAgIG9yZ2FuaXphdGlvbk5hbWU6IGF1dGhBbnN3ZXIgJiYgYXV0aEFuc3dlci5vcmdhbml6YXRpb25OYW1lLFxuICAgICAgICBpc1VzZXJBdXRoZW50aWNhdGVkOiBhdXRoQW5zd2VyICYmIGF1dGhBbnN3ZXIuaXNBdXRoZWRcbiAgICAgIH0pXG4gICAgICByZXR1cm4gY2IobnVsbCwgYXV0aEFuc3dlcilcbiAgICB9KVxuICB9XG5cbiAgYXV0aGVudGljYXRpb25Db21wbGV0ZSAoKSB7XG4gICAgcmV0dXJuIHRoaXMuc2V0U3RhdGUoeyBpc1VzZXJBdXRoZW50aWNhdGVkOiB0cnVlIH0pXG4gIH1cblxuICByZWNlaXZlUHJvamVjdEluZm8gKHByb2plY3RJbmZvKSB7XG4gICAgLy8gTk8tT1BcbiAgfVxuXG4gIGxvYWRQcm9qZWN0cyAoY2IpIHtcbiAgICByZXR1cm4gdGhpcy5wcm9wcy53ZWJzb2NrZXQucmVxdWVzdCh7IG1ldGhvZDogJ2xpc3RQcm9qZWN0cycsIHBhcmFtczogW10gfSwgKGVycm9yLCBwcm9qZWN0c0xpc3QpID0+IHtcbiAgICAgIGlmIChlcnJvcikgcmV0dXJuIGNiKGVycm9yKVxuICAgICAgdGhpcy5zZXRTdGF0ZSh7IHByb2plY3RzTGlzdCB9KVxuICAgICAgaXBjUmVuZGVyZXIuc2VuZCgncmVuZGVyZXI6cHJvamVjdHMtbGlzdC1mZXRjaGVkJywgcHJvamVjdHNMaXN0KVxuICAgICAgcmV0dXJuIGNiKG51bGwsIHByb2plY3RzTGlzdClcbiAgICB9KVxuICB9XG5cbiAgbGF1bmNoUHJvamVjdCAocHJvamVjdE5hbWUsIHByb2plY3RPYmplY3QsIGNiKSB7XG4gICAgcHJvamVjdE9iamVjdCA9IHtcbiAgICAgIHNraXBDb250ZW50Q3JlYXRpb246IHRydWUsIC8vIFZFUlkgSU1QT1JUQU5UIC0gaWYgbm90IHNldCB0byB0cnVlLCB3ZSBjYW4gZW5kIHVwIGluIGEgc2l0dWF0aW9uIHdoZXJlIHdlIG92ZXJ3cml0ZSBmcmVzaGx5IGNsb25lZCBjb250ZW50IGZyb20gdGhlIHJlbW90ZSFcbiAgICAgIHByb2plY3RzSG9tZTogcHJvamVjdE9iamVjdC5wcm9qZWN0c0hvbWUsXG4gICAgICBwcm9qZWN0UGF0aDogcHJvamVjdE9iamVjdC5wcm9qZWN0UGF0aCxcbiAgICAgIG9yZ2FuaXphdGlvbk5hbWU6IHRoaXMuc3RhdGUub3JnYW5pemF0aW9uTmFtZSxcbiAgICAgIGF1dGhvck5hbWU6IHRoaXMuc3RhdGUudXNlcm5hbWUsXG4gICAgICBwcm9qZWN0TmFtZSAvLyBIYXZlIHRvIHNldCB0aGlzIGhlcmUsIGJlY2F1c2Ugd2UgcGFzcyB0aGlzIHdob2xlIG9iamVjdCB0byBTdGF0ZVRpdGxlQmFyLCB3aGljaCBuZWVkcyB0aGlzIHRvIHByb3Blcmx5IGNhbGwgc2F2ZVByb2plY3RcbiAgICB9XG5cbiAgICBtaXhwYW5lbC5oYWlrdVRyYWNrKCdjcmVhdG9yOnByb2plY3Q6bGF1bmNoaW5nJywge1xuICAgICAgdXNlcm5hbWU6IHRoaXMuc3RhdGUudXNlcm5hbWUsXG4gICAgICBwcm9qZWN0OiBwcm9qZWN0TmFtZSxcbiAgICAgIG9yZ2FuaXphdGlvbjogdGhpcy5zdGF0ZS5vcmdhbml6YXRpb25OYW1lXG4gICAgfSlcblxuICAgIHJldHVybiB0aGlzLnByb3BzLndlYnNvY2tldC5yZXF1ZXN0KHsgbWV0aG9kOiAnaW5pdGlhbGl6ZVByb2plY3QnLCBwYXJhbXM6IFtwcm9qZWN0TmFtZSwgcHJvamVjdE9iamVjdCwgdGhpcy5zdGF0ZS51c2VybmFtZSwgdGhpcy5zdGF0ZS5wYXNzd29yZF0gfSwgKGVyciwgcHJvamVjdEZvbGRlcikgPT4ge1xuICAgICAgaWYgKGVycikgcmV0dXJuIGNiKGVycilcblxuICAgICAgcmV0dXJuIHRoaXMucHJvcHMud2Vic29ja2V0LnJlcXVlc3QoeyBtZXRob2Q6ICdzdGFydFByb2plY3QnLCBwYXJhbXM6IFtwcm9qZWN0TmFtZSwgcHJvamVjdEZvbGRlcl0gfSwgKGVyciwgYXBwbGljYXRpb25JbWFnZSkgPT4ge1xuICAgICAgICBpZiAoZXJyKSByZXR1cm4gY2IoZXJyKVxuXG4gICAgICAgIC8vIEFzc2lnbiwgbm90IG1lcmdlLCBzaW5jZSB3ZSBkb24ndCB3YW50IHRvIGNsb2JiZXIgYW55IHZhcmlhYmxlcyBhbHJlYWR5IHNldCwgbGlrZSBwcm9qZWN0IG5hbWVcbiAgICAgICAgbG9kYXNoLmFzc2lnbihwcm9qZWN0T2JqZWN0LCBhcHBsaWNhdGlvbkltYWdlLnByb2plY3QpXG5cbiAgICAgICAgbWl4cGFuZWwuaGFpa3VUcmFjaygnY3JlYXRvcjpwcm9qZWN0OmxhdW5jaGVkJywge1xuICAgICAgICAgIHVzZXJuYW1lOiB0aGlzLnN0YXRlLnVzZXJuYW1lLFxuICAgICAgICAgIHByb2plY3Q6IHByb2plY3ROYW1lLFxuICAgICAgICAgIG9yZ2FuaXphdGlvbjogdGhpcy5zdGF0ZS5vcmdhbml6YXRpb25OYW1lXG4gICAgICAgIH0pXG5cbiAgICAgICAgLy8gTm93IGhhY2tpbHkgY2hhbmdlIHNvbWUgcG9pbnRlcnMgc28gd2UncmUgcmVmZXJyaW5nIHRvIHRoZSBjb3JyZWN0IHBsYWNlXG4gICAgICAgIHRoaXMucHJvcHMud2Vic29ja2V0LmZvbGRlciA9IHByb2plY3RGb2xkZXIgLy8gRG8gbm90IHJlbW92ZSB0aGlzIG5lY2Vzc2FyeSBoYWNrIHBselxuICAgICAgICB0aGlzLnNldFN0YXRlKHsgcHJvamVjdEZvbGRlciwgYXBwbGljYXRpb25JbWFnZSwgcHJvamVjdE9iamVjdCwgcHJvamVjdE5hbWUsIGRhc2hib2FyZFZpc2libGU6IGZhbHNlIH0pXG5cbiAgICAgICAgcmV0dXJuIGNiKClcbiAgICAgIH0pXG4gICAgfSlcbiAgfVxuXG4gIGxhdW5jaEZvbGRlciAobWF5YmVQcm9qZWN0TmFtZSwgcHJvamVjdEZvbGRlciwgY2IpIHtcbiAgICBtaXhwYW5lbC5oYWlrdVRyYWNrKCdjcmVhdG9yOmZvbGRlcjpsYXVuY2hpbmcnLCB7XG4gICAgICB1c2VybmFtZTogdGhpcy5zdGF0ZS51c2VybmFtZSxcbiAgICAgIHByb2plY3Q6IG1heWJlUHJvamVjdE5hbWVcbiAgICB9KVxuXG4gICAgLy8gVGhlIGxhdW5jaFByb2plY3QgbWV0aG9kIGhhbmRsZXMgdGhlIHBlcmZvcm1Gb2xkZXJQb2ludGVyQ2hhbmdlXG4gICAgcmV0dXJuIHRoaXMubGF1bmNoUHJvamVjdChtYXliZVByb2plY3ROYW1lLCB7IHByb2plY3RQYXRoOiBwcm9qZWN0Rm9sZGVyIH0sIGNiKVxuICB9XG5cbiAgcmVtb3ZlTm90aWNlIChpbmRleCwgaWQpIHtcbiAgICBjb25zdCBub3RpY2VzID0gdGhpcy5zdGF0ZS5ub3RpY2VzXG4gICAgaWYgKGluZGV4ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBub3RpY2VzOiBbLi4ubm90aWNlcy5zbGljZSgwLCBpbmRleCksIC4uLm5vdGljZXMuc2xpY2UoaW5kZXggKyAxKV1cbiAgICAgIH0pXG4gICAgfSBlbHNlIGlmIChpZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAvLyBIYWNrYXJvb1xuICAgICAgbG9kYXNoLmVhY2gobm90aWNlcywgKG5vdGljZSwgaW5kZXgpID0+IHtcbiAgICAgICAgaWYgKG5vdGljZS5pZCA9PT0gaWQpIHRoaXMucmVtb3ZlTm90aWNlKGluZGV4KVxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICBjcmVhdGVOb3RpY2UgKG5vdGljZSkge1xuICAgIC8qIEV4cGVjdHMgdGhlIG9iamVjdDpcbiAgICB7IHR5cGU6IHN0cmluZyAoaW5mbywgc3VjY2VzcywgZGFuZ2VyIChvciBlcnJvciksIHdhcm5pbmcpXG4gICAgICB0aXRsZTogc3RyaW5nLFxuICAgICAgbWVzc2FnZTogc3RyaW5nLFxuICAgICAgY2xvc2VUZXh0OiBzdHJpbmcgKG9wdGlvbmFsLCBkZWZhdWx0cyB0byAnY2xvc2UnKVxuICAgICAgbGlnaHRTY2hlbWU6IGJvb2wgKG9wdGlvbmFsLCBkZWZhdWx0cyB0byBkYXJrKVxuICAgIH0gKi9cblxuICAgIG5vdGljZS5pZCA9IE1hdGgucmFuZG9tKCkgKyAnJ1xuXG4gICAgY29uc3Qgbm90aWNlcyA9IHRoaXMuc3RhdGUubm90aWNlc1xuICAgIGxldCByZXBsYWNlZEV4aXN0aW5nID0gZmFsc2VcblxuICAgIG5vdGljZXMuZm9yRWFjaCgobiwgaSkgPT4ge1xuICAgICAgaWYgKG4ubWVzc2FnZSA9PT0gbm90aWNlLm1lc3NhZ2UpIHtcbiAgICAgICAgbm90aWNlcy5zcGxpY2UoaSwgMSlcbiAgICAgICAgcmVwbGFjZWRFeGlzdGluZyA9IHRydWVcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IG5vdGljZXMgfSwgKCkgPT4ge1xuICAgICAgICAgIG5vdGljZXMudW5zaGlmdChub3RpY2UpXG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IG5vdGljZXMgfSlcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgaWYgKCFyZXBsYWNlZEV4aXN0aW5nKSB7XG4gICAgICBub3RpY2VzLnVuc2hpZnQobm90aWNlKVxuICAgICAgdGhpcy5zZXRTdGF0ZSh7IG5vdGljZXMgfSlcbiAgICB9XG5cbiAgICByZXR1cm4gbm90aWNlXG4gIH1cblxuICBvbkxpYnJhcnlEcmFnRW5kIChkcmFnRW5kTmF0aXZlRXZlbnQsIGxpYnJhcnlJdGVtSW5mbykge1xuICAgIHRoaXMuc2V0U3RhdGUoeyBsaWJyYXJ5SXRlbURyYWdnaW5nOiBudWxsIH0pXG4gICAgaWYgKGxpYnJhcnlJdGVtSW5mbyAmJiBsaWJyYXJ5SXRlbUluZm8ucHJldmlldykge1xuICAgICAgdGhpcy5yZWZzLnN0YWdlLmhhbmRsZURyb3AobGlicmFyeUl0ZW1JbmZvLCB0aGlzLl9sYXN0TW91c2VYLCB0aGlzLl9sYXN0TW91c2VZKVxuICAgIH1cbiAgfVxuXG4gIG9uTGlicmFyeURyYWdTdGFydCAoZHJhZ1N0YXJ0TmF0aXZlRXZlbnQsIGxpYnJhcnlJdGVtSW5mbykge1xuICAgIHRoaXMuc2V0U3RhdGUoeyBsaWJyYXJ5SXRlbURyYWdnaW5nOiBsaWJyYXJ5SXRlbUluZm8gfSlcbiAgfVxuXG4gIHJlbmRlclN0YXJ0dXBEZWZhdWx0U2NyZWVuICgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBzdHlsZT17eyBwb3NpdGlvbjogJ2Fic29sdXRlJywgd2lkdGg6ICcxMDAlJywgaGVpZ2h0OiAnMTAwJScgfX0+XG4gICAgICAgIDxSZWFjdENTU1RyYW5zaXRpb25Hcm91cFxuICAgICAgICAgIHRyYW5zaXRpb25OYW1lPSd0b2FzdCdcbiAgICAgICAgICB0cmFuc2l0aW9uRW50ZXJUaW1lb3V0PXs1MDB9XG4gICAgICAgICAgdHJhbnNpdGlvbkxlYXZlVGltZW91dD17MzAwfT5cbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7cG9zaXRpb246ICdhYnNvbHV0ZScsIHJpZ2h0OiAwLCB0b3A6IDAsIHdpZHRoOiAzMDB9fT5cbiAgICAgICAgICAgIHtsb2Rhc2gubWFwKHRoaXMuc3RhdGUubm90aWNlcywgdGhpcy5yZW5kZXJOb3RpZmljYXRpb25zKX1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9SZWFjdENTU1RyYW5zaXRpb25Hcm91cD5cbiAgICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAndGFibGUnLCB3aWR0aDogJzEwMCUnLCBoZWlnaHQ6ICcxMDAlJywgcG9zaXRpb246ICdhYnNvbHV0ZScsIHRvcDogMCwgbGVmdDogMCB9fT5cbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6ICd0YWJsZS1jZWxsJywgd2lkdGg6ICcxMDAlJywgaGVpZ2h0OiAnMTAwJScsIHZlcnRpY2FsQWxpZ246ICdtaWRkbGUnLCB0ZXh0QWxpZ246ICdjZW50ZXInIH19PlxuICAgICAgICAgICAgPHN2ZyB3aWR0aD0nMTcwcHgnIGhlaWdodD0nMjIxcHgnIHZpZXdCb3g9JzAgMCAxNzAgMjIxJyB2ZXJzaW9uPScxLjEnPlxuICAgICAgICAgICAgICA8ZyBpZD0nUGFnZS0xJyBzdHJva2U9J25vbmUnIHN0cm9rZVdpZHRoPScxJyBmaWxsPSdub25lJyBmaWxsUnVsZT0nZXZlbm9kZCc+XG4gICAgICAgICAgICAgICAgPGcgaWQ9J091dGxpbmVkJyB0cmFuc2Zvcm09J3RyYW5zbGF0ZSgtMjExLjAwMDAwMCwgLTExNC4wMDAwMDApJyBmaWxsUnVsZT0nbm9uemVybycgZmlsbD0nI0ZBRkNGRCc+XG4gICAgICAgICAgICAgICAgICA8ZyBpZD0nb3V0bGluZWQtbG9nbycgdHJhbnNmb3JtPSd0cmFuc2xhdGUoMjExLjAwMDAwMCwgMTEzLjAwMDAwMCknPlxuICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSdNNDcuNSwxNTIuNzk4ODIzIEwyNi4zODIzNDMyLDE0My45NTQ2NzYgQzI0LjU5OTM5NDEsMTQzLjIwNzk3MSAyMy43NTkzNTI0LDE0MS4xNTcyODEgMjQuNTA2MDU3NiwxMzkuMzc0MzMyIEMyNS4yNTI3NjI4LDEzNy41OTEzODMgMjcuMzAzNDUyNywxMzYuNzUxMzQxIDI5LjA4NjQwMTgsMTM3LjQ5ODA0NiBMMTE3Ljc4MDA1OCwxNzQuNjQ0NTYgTDEyMC45OTAwMjEsMTc2LjA4OTA3NCBDMTIyLjQ4NjgxNCwxNzYuNzYyNjQ1IDEyMy4yNzkzMDQsMTc4LjM1ODI1MSAxMjIuOTk4Njk4LDE3OS45MDM1OTggQzEyMi45OTk1NjQsMTc5LjkzNTYyNiAxMjMsMTc5Ljk2Nzc2MiAxMjMsMTgwIEwxMjMsMjA1LjYzOTcyMiBMMTM4LjUxMDcxNiwyMTEuOTEwMDExIEwxNDMuMzY4NDIxLDIxMy44NzM3NjQgTDE2Mi44MzMzMzMsMjA2LjAwNDk3IEwxNjIuODMzMzMzLDE2LjI5MjkwMjUgTDE0Myw4LjI3NTE3MjA0IEwxMjIuODMzMzMzLDE2LjQyNzY1NDMgTDEyMi44MzMzMzMsNTMuNjAxMzI5NSBDMTIyLjgzNDIxOCw1My42NDY2NDg5IDEyMi44MzQyMTUsNTMuNjkxOTAxNSAxMjIuODMzMzMzLDUzLjczNzA2MzQgTDEyMi44MzMzMzMsNTQgQzEyMi44MzMzMzMsNTUuOTMyOTk2NiAxMjEuMjY2MzMsNTcuNSAxMTkuMzMzMzMzLDU3LjUgQzExOS4yODg0Myw1Ny41IDExOS4yNDM3MjQsNTcuNDk5MTU0NCAxMTkuMTk5MjMsNTcuNDk3NDc4MiBMNTMuMzA3NjM4LDg0LjAzNzE0OSBDNTEuNTE0NjE4Myw4NC43NTkzMzc1IDQ5LjQ3NTYzOTIsODMuODkxMjU3MyA0OC43NTM0NTA2LDgyLjA5ODIzNzYgQzQ4LjAzMTI2MjEsODAuMzA1MjE3OSA0OC44OTkzNDIzLDc4LjI2NjIzODggNTAuNjkyMzYyLDc3LjU0NDA1MDIgTDExNS44MzMzMzMsNTEuMzA2NzEyOSBMMTE1LjgzMzMzMywxNC40OTc0MjI3IEMxMTUuODMzMzMzLDE0LjAxNDMxNzggMTE1LjkzMTIxMywxMy41NTQwNzM5IDExNi4xMDgyMjIsMTMuMTM1NDM5OSBDMTE2LjM3NDUzOSwxMi4wOTQxMjkyIDExNy4xMTUzMjYsMTEuMTg4ODQ0OSAxMTguMTg4MjM4LDEwLjc1NTExNDggTDE0MS42ODQxODYsMS4yNTY3NTI3IEMxNDIuMDkxMzE3LDEuMDkxNTI5MzYgMTQyLjUyOTU5LDEuMDAyNDA0NjcgMTQyLjk3NTkzNywwLjk5OTE2NDcyMyBDMTQzLjQ3MDQxLDEuMDAyNDA0NjcgMTQzLjkwODY4MywxLjA5MTUyOTM2IDE0NC4zMTU4MTQsMS4yNTY3NTI3IEwxNjcuODExNzYyLDEwLjc1NTExNDggQzE2OS41MjI5NjgsMTEuNDQ2ODc5IDE3MC4zODkzMjgsMTMuMzM4MTY1OSAxNjkuODMzMzMzLDE1LjA2NzcwNjggTDE2OS44MzMzMzMsMjA4IEMxNjkuODMzMzMzLDIwOC44MjYzMDQgMTY5LjU0Njk5LDIwOS41ODU3MjggMTY5LjA2ODExOCwyMTAuMTg0NDU5IEMxNjguNjkzNzAzLDIxMC44NjczNzggMTY4LjA5MDEzMywyMTEuNDMwMjI0IDE2Ny4zMTE3NjIsMjExLjc0NDg4NSBMMTQ0LjUxNzY0NSwyMjAuOTU5NTI4IEMxNDMuMzMyNTQyLDIyMS40Mzg2MTMgMTQyLjAzODk5NSwyMjEuMjIyMzk3IDE0MS4wODkxNzksMjIwLjUwMjcxMiBMMTM1Ljg4NzE5MiwyMTguMzk5NzgyIEwxMTkuNDYxNTk1LDIxMS43NTk2NDcgQzExNy41NDYyOSwyMTEuNzM5MDU1IDExNiwyMTAuMTgwMDMyIDExNiwyMDguMjU5ODUzIEwxMTYsMjA4LjA3OTExIEMxMTUuOTk4NzY3LDIwOC4wMjU3MDggMTE1Ljk5ODc2MSwyMDcuOTcyMTc4IDExNiwyMDcuOTE4NTU4IEwxMTYsMTgxLjUxODc0OCBMMTE0Ljk5MTcyNywxODEuMDY0NTg5IEw1NC41LDE1NS43MzA0NDcgTDU0LjUsMjA2Ljk5ODI3MyBDNTUuMTM0MTQ2OCwyMDguNjU4MjU2IDU0LjQxOTUzMTUsMjEwLjUxMjkxNSA1Mi44Nzk2NjQ1LDIxMS4zMzMzMzMgQzUyLjU1NDU1NDYsMjExLjU0MDcwOSA1Mi4xOTI5MDQsMjExLjY5NTg2OSA1MS44MDY1Mjk0LDIxMS43ODY5OTcgTDI5Ljc4NjczNzUsMjIwLjY1MDY1NSBDMjguODI1MjUzNSwyMjEuNDc4NzU4IDI3LjQ0NTcwMDUsMjIxLjc1MzIyMSAyNi4xODgyMzc5LDIyMS4yNDQ4ODUgTDIwLjM4NzE5MjEsMjE4Ljg5OTc4MiBMMy4zMDYyNzc4MywyMTEuOTk0NzMxIEMxLjQ2MzM4MTg5LDIxMS44OTQxOTIgLTIuNjA4MzU5OTVlLTE2LDIxMC4zNjc5OTIgMCwyMDguNSBMMi43MDg5NDQxOGUtMTQsMTQuNDk3NDIyNyBDMi43MjQyNDVlLTE0LDEzLjQwMTY0NTggMC41MDM1NjA5NDcsMTIuNDIzNDgxOCAxLjI5MTg5NjY5LDExLjc4MTcxNyBDMS42NTE3MTAxNCwxMS4zNDE2NTA5IDIuMTI0MDU2MjIsMTAuOTgzMTg4MiAyLjY4ODIzNzg5LDEwLjc1NTExNDggTDI2LjE4NDE4NjIsMS4yNTY3NTI3IEMyNi41OTEzMTcyLDEuMDkxNTI5MzYgMjcuMDI5NTg5OCwxLjAwMjQwNDY3IDI3LjQ3NTkzNjcsMC45OTkxNjQ3MjMgQzI3Ljk3MDQxMDIsMS4wMDI0MDQ2NyAyOC40MDg2ODI4LDEuMDkxNTI5MzYgMjguODE1ODEzOCwxLjI1Njc1MjcgTDUyLjMxMTc2MjEsMTAuNzU1MTE0OCBDNTQuMTAzODYyNywxMS40Nzk1ODEgNTQuOTY5MzUxNCwxMy41MTk2NjE1IDU0LjI0NDg4NTIsMTUuMzExNzYyMSBDNTMuNTIwNDE5LDE3LjEwMzg2MjcgNTEuNDgwMzM4NSwxNy45NjkzNTE0IDQ5LjY4ODIzNzksMTcuMjQ0ODg1MiBMMjcuNSw4LjI3NTE3MjA0IEw3LDE2LjU2MjQwNjEgTDcsMjA1LjkzNzU5NCBMMjMuMDEwNzE2NCwyMTIuNDEwMDExIEwyNy4yNTI2OTk1LDIxNC4xMjQ4NTUgTDQ3LjUsMjA1Ljk3NDY4MSBMNDcuNSwxNTIuNzk4ODIzIFonIGlkPSdDb21iaW5lZC1TaGFwZScgLz5cbiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0nTTE0Ni40NTY4MjcsNjMuMDI0MTg0OSBDMTQ2Ljk0ODYwMyw2NC43MTA0NzI0IDE0Ni4xMDU5NzIsNjYuNTMzNjU5MSAxNDQuNDQ3MzA1LDY3LjIyODMxNDkgTDU5LjU0Njg2NzcsMTAyLjc4NDkwOCBMMTIwLjQxNjU3NSwxMjguMjc3MzUgQzEyMi4xOTk1MjQsMTI5LjAyNDA1NSAxMjMuMDM5NTY2LDEzMS4wNzQ3NDUgMTIyLjI5Mjg2MSwxMzIuODU3Njk0IEMxMjEuNTQ2MTU2LDEzNC42NDA2NDMgMTE5LjQ5NTQ2NiwxMzUuNDgwNjg1IDExNy43MTI1MTcsMTM0LjczMzk3OSBMNTAuNDg2NDEzMSwxMDYuNTc5NDU3IEwyOS4zNTIwMjkzLDExNS40MzA2MSBDMjcuNTY5MDgwMiwxMTYuMTc3MzE1IDI1LjUxODM5MDMsMTE1LjMzNzI3MyAyNC43NzE2ODUxLDExMy41NTQzMjQgQzI0LjAyNDk4LDExMS43NzEzNzUgMjQuODY1MDIxNiwxMDkuNzIwNjg1IDI2LjY0Nzk3MDcsMTA4Ljk3Mzk4IEw0Ny41LDEwMC4yNDEwNzkgTDQ3LjUsMTQuNSBDNDcuNSwxMi41NjcwMDM0IDQ5LjA2NzAwMzQsMTEgNTEsMTEgQzUyLjkzMjk5NjYsMTEgNTQuNSwxMi41NjcwMDM0IDU0LjUsMTQuNSBMNTQuNSw5Ny4zMDk0NTQ4IEwxMzMuMzYwMjU3LDY0LjI4MjUwOTggTDExNy4xODgyMzgsNTcuNzQ0ODg1MiBDMTE1LjM5NjEzNyw1Ny4wMjA0MTkgMTE0LjUzMDY0OSw1NC45ODAzMzg1IDExNS4yNTUxMTUsNTMuMTg4MjM3OSBDMTE1Ljk3OTU4MSw1MS4zOTYxMzczIDExOC4wMTk2NjEsNTAuNTMwNjQ4NiAxMTkuODExNzYyLDUxLjI1NTExNDggTDEzOS41LDU5LjIxNDE4OTcgTDEzOS41LDI1Ljg2MDI3ODQgTDEzNS44ODcxOTIsMjQuMzk5NzgxNiBMMTE4LjE4ODIzOCwxNy4yNDQ4ODUyIEMxMTYuMzk2MTM3LDE2LjUyMDQxOSAxMTUuNTMwNjQ5LDE0LjQ4MDMzODUgMTE2LjI1NTExNSwxMi42ODgyMzc5IEMxMTYuOTc5NTgxLDEwLjg5NjEzNzMgMTE5LjAxOTY2MSwxMC4wMzA2NDg2IDEyMC44MTE3NjIsMTAuNzU1MTE0OCBMMTM4LjUxMDcxNiwxNy45MTAwMTEyIEwxNDMuMzY4NDIxLDE5Ljg3Mzc2NDEgTDE2NC42ODgyMzgsMTEuMjU1MTE0OCBDMTY2LjQ4MDMzOSwxMC41MzA2NDg2IDE2OC41MjA0MTksMTEuMzk2MTM3MyAxNjkuMjQ0ODg1LDEzLjE4ODIzNzkgQzE2OS45NjkzNTEsMTQuOTgwMzM4NSAxNjkuMTAzODYzLDE3LjAyMDQxOSAxNjcuMzExNzYyLDE3Ljc0NDg4NTIgTDE0Ni41LDI2LjE1ODE1MDggTDE0Ni41LDYyLjQ3Mjg3NDkgQzE0Ni41LDYyLjY2MDQ1NzQgMTQ2LjQ4NTI0Myw2Mi44NDQ1OTMzIDE0Ni40NTY4MjcsNjMuMDI0MTg0OSBaJyBpZD0nQ29tYmluZWQtU2hhcGUnIC8+XG4gICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9J00xMzkuNSw5Ni4zMzA4MDY5IEwxMjIuODMzMzMzLDEwMy4zMTA4NjQgTDEyMi44MzMzMzMsMTUxLjM3Mjc5OSBDMTIyLjgzMzMzMywxNTMuMzA1Nzk1IDEyMS4yNjYzMywxNTQuODcyNzk5IDExOS4zMzMzMzMsMTU0Ljg3Mjc5OSBDMTE4LjUzNTcxOSwxNTQuODcyNzk5IDExNy44MDA0MiwxNTQuNjA1OTk0IDExNy4yMTE4MTYsMTU0LjE1Njc2MyBMMjYuNjQ3OTcwNywxMTYuMjI4MzE1IEMyNi4wOTc2NzA2LDExNS45OTc4NDcgMjUuNjM3MTk0LDExNS42NDMxNTkgMjUuMjg1NDcxNCwxMTUuMjEwNDYyIEMyNC41MDA4MjU4LDExNC41Njg2MiAyNCwxMTMuNTkyNzk3IDI0LDExMi41IEwyNCwyNS44NjAyNzg0IEwyMC4zODcxOTIxLDI0LjM5OTc4MTYgTDIuNjg4MjM3ODksMTcuMjQ0ODg1MiBDMC44OTYxMzcyNTgsMTYuNTIwNDE5IDAuMDMwNjQ4NTU4OSwxNC40ODAzMzg1IDAuNzU1MTE0NzcsMTIuNjg4MjM3OSBDMS40Nzk1ODA5OCwxMC44OTYxMzczIDMuNTE5NjYxNDksMTAuMDMwNjQ4NiA1LjMxMTc2MjExLDEwLjc1NTExNDggTDIzLjAxMDcxNjQsMTcuOTEwMDExMiBMMjcuODY4NDIxMSwxOS44NzM3NjQxIEw0OS4xODgyMzc5LDExLjI1NTExNDggQzUwLjk4MDMzODUsMTAuNTMwNjQ4NiA1My4wMjA0MTksMTEuMzk2MTM3MyA1My43NDQ4ODUyLDEzLjE4ODIzNzkgQzU0LjQ2OTM1MTQsMTQuOTgwMzM4NSA1My42MDM4NjI3LDE3LjAyMDQxOSA1MS44MTE3NjIxLDE3Ljc0NDg4NTIgTDMxLDI2LjE1ODE1MDggTDMxLDExMC40NjE4NjEgTDExNS44MzMzMzMsMTQ1Ljk5MDM1MSBMMTE1LjgzMzMzMywxMDYuMjQyNDg4IEw4NC4yNTk2NjE2LDExOS40NjU2NDkgQzgyLjQ3NjcxMjUsMTIwLjIxMjM1NSA4MC40MjYwMjI2LDExOS4zNzIzMTMgNzkuNjc5MzE3NCwxMTcuNTg5MzY0IEM3OC45MzI2MTIzLDExNS44MDY0MTUgNzkuNzcyNjUzOSwxMTMuNzU1NzI1IDgxLjU1NTYwMywxMTMuMDA5MDIgTDE0MS4wNTIxNTEsODguMDkxNjYyMiBDMTQxLjYwODk3NCw4Ny43MTc5OTMgMTQyLjI3OTAzLDg3LjUgMTQzLDg3LjUgQzE0NC45MzI5OTcsODcuNSAxNDYuNSw4OS4wNjcwMDM0IDE0Ni41LDkxIEwxNDYuNSwyMTcuNjMwNDggQzE0Ni41LDIxOS41NjM0NzcgMTQ0LjkzMjk5NywyMjEuMTMwNDggMTQzLDIyMS4xMzA0OCBDMTQxLjA2NzAwMywyMjEuMTMwNDggMTM5LjUsMjE5LjU2MzQ3NyAxMzkuNSwyMTcuNjMwNDggTDEzOS41LDk2LjMzMDgwNjkgWiBNMzEsMTQxIEwzMSwyMTcuMDU1MjM3IEMzMSwyMTguOTg4MjM0IDI5LjQzMjk5NjYsMjIwLjU1NTIzNyAyNy41LDIyMC41NTUyMzcgQzI1LjU2NzAwMzQsMjIwLjU1NTIzNyAyNCwyMTguOTg4MjM0IDI0LDIxNy4wNTUyMzcgTDI0LDE0MSBDMjQsMTM5LjA2NzAwMyAyNS41NjcwMDM0LDEzNy41IDI3LjUsMTM3LjUgQzI5LjQzMjk5NjYsMTM3LjUgMzEsMTM5LjA2NzAwMyAzMSwxNDEgWicgaWQ9J0NvbWJpbmVkLVNoYXBlJyAvPlxuICAgICAgICAgICAgICAgICAgPC9nPlxuICAgICAgICAgICAgICAgIDwvZz5cbiAgICAgICAgICAgICAgPC9nPlxuICAgICAgICAgICAgPC9zdmc+XG4gICAgICAgICAgICA8YnIgLz5cbiAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGNvbG9yOiAnI0ZBRkNGRCcsIGRpc3BsYXk6ICdpbmxpbmUtYmxvY2snLCB3aWR0aDogJzEwMCUnLCBoZWlnaHQ6IDUwLCBwb3NpdGlvbjogJ2Fic29sdXRlJywgYm90dG9tOiA1MCwgbGVmdDogMCB9fT57dGhpcy5zdGF0ZS5zb2Z0d2FyZVZlcnNpb259PC9zcGFuPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHJlbmRlciAoKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUucmVhZHlGb3JBdXRoICYmICghdGhpcy5zdGF0ZS5pc1VzZXJBdXRoZW50aWNhdGVkIHx8ICF0aGlzLnN0YXRlLnVzZXJuYW1lKSkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPFN0eWxlUm9vdD5cbiAgICAgICAgICA8QXV0aGVudGljYXRpb25VSVxuICAgICAgICAgICAgb25TdWJtaXQ9e3RoaXMuYXV0aGVudGljYXRlVXNlcn1cbiAgICAgICAgICAgIG9uU3VibWl0U3VjY2Vzcz17dGhpcy5hdXRoZW50aWNhdGlvbkNvbXBsZXRlfVxuICAgICAgICAgICAgey4uLnRoaXMucHJvcHN9IC8+XG4gICAgICAgIDwvU3R5bGVSb290PlxuICAgICAgKVxuICAgIH1cblxuICAgIGlmICghdGhpcy5zdGF0ZS5pc1VzZXJBdXRoZW50aWNhdGVkIHx8ICF0aGlzLnN0YXRlLnVzZXJuYW1lKSB7XG4gICAgICByZXR1cm4gdGhpcy5yZW5kZXJTdGFydHVwRGVmYXVsdFNjcmVlbigpXG4gICAgfVxuXG4gICAgaWYgKHRoaXMuc3RhdGUuZGFzaGJvYXJkVmlzaWJsZSkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdj5cbiAgICAgICAgICA8UHJvamVjdEJyb3dzZXJcbiAgICAgICAgICAgIGxvYWRQcm9qZWN0cz17dGhpcy5sb2FkUHJvamVjdHN9XG4gICAgICAgICAgICBsYXVuY2hQcm9qZWN0PXt0aGlzLmxhdW5jaFByb2plY3R9XG4gICAgICAgICAgICBjcmVhdGVOb3RpY2U9e3RoaXMuY3JlYXRlTm90aWNlfVxuICAgICAgICAgICAgcmVtb3ZlTm90aWNlPXt0aGlzLnJlbW92ZU5vdGljZX1cbiAgICAgICAgICAgIG5vdGljZXM9e3RoaXMuc3RhdGUubm90aWNlc31cbiAgICAgICAgICAgIGVudm95PXt0aGlzLmVudm95fVxuICAgICAgICAgICAgey4uLnRoaXMucHJvcHN9IC8+XG4gICAgICAgICAgPFRvdXIgcHJvamVjdHNMaXN0PXt0aGlzLnN0YXRlLnByb2plY3RzTGlzdH0gZW52b3k9e3RoaXMuZW52b3l9IHN0YXJ0VG91ck9uTW91bnQgLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICApXG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLnN0YXRlLnByb2plY3RGb2xkZXIpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgPFRvdXIgcHJvamVjdHNMaXN0PXt0aGlzLnN0YXRlLnByb2plY3RzTGlzdH0gZW52b3k9e3RoaXMuZW52b3l9IC8+XG4gICAgICAgICAgPFByb2plY3RCcm93c2VyXG4gICAgICAgICAgICBsb2FkUHJvamVjdHM9e3RoaXMubG9hZFByb2plY3RzfVxuICAgICAgICAgICAgbGF1bmNoUHJvamVjdD17dGhpcy5sYXVuY2hQcm9qZWN0fVxuICAgICAgICAgICAgY3JlYXRlTm90aWNlPXt0aGlzLmNyZWF0ZU5vdGljZX1cbiAgICAgICAgICAgIHJlbW92ZU5vdGljZT17dGhpcy5yZW1vdmVOb3RpY2V9XG4gICAgICAgICAgICBub3RpY2VzPXt0aGlzLnN0YXRlLm5vdGljZXN9XG4gICAgICAgICAgICBlbnZveT17dGhpcy5lbnZveX1cbiAgICAgICAgICAgIHsuLi50aGlzLnByb3BzfSAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIClcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuc3RhdGUuYXBwbGljYXRpb25JbWFnZSB8fCB0aGlzLnN0YXRlLmZvbGRlckxvYWRpbmdFcnJvcikge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBzdHlsZT17eyBwb3NpdGlvbjogJ2Fic29sdXRlJywgd2lkdGg6ICcxMDAlJywgaGVpZ2h0OiAnMTAwJScgfX0+XG4gICAgICAgICAgPFJlYWN0Q1NTVHJhbnNpdGlvbkdyb3VwXG4gICAgICAgICAgICB0cmFuc2l0aW9uTmFtZT0ndG9hc3QnXG4gICAgICAgICAgICB0cmFuc2l0aW9uRW50ZXJUaW1lb3V0PXs1MDB9XG4gICAgICAgICAgICB0cmFuc2l0aW9uTGVhdmVUaW1lb3V0PXszMDB9PlxuICAgICAgICAgICAgPGRpdiBzdHlsZT17e3Bvc2l0aW9uOiAnYWJzb2x1dGUnLCByaWdodDogMCwgdG9wOiAwLCB3aWR0aDogMzAwfX0+XG4gICAgICAgICAgICAgIHtsb2Rhc2gubWFwKHRoaXMuc3RhdGUubm90aWNlcywgdGhpcy5yZW5kZXJOb3RpZmljYXRpb25zKX1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvUmVhY3RDU1NUcmFuc2l0aW9uR3JvdXA+XG4gICAgICAgICAgPGRpdiBzdHlsZT17eyBwb3NpdGlvbjogJ3JlbGF0aXZlJywgd2lkdGg6ICcxMDAlJywgaGVpZ2h0OiAnMTAwJScgfX0+XG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IHBvc2l0aW9uOiAnYWJzb2x1dGUnLCB0b3A6ICc1MCUnLCBsZWZ0OiAnNTAlJywgdHJhbnNmb3JtOiAndHJhbnNsYXRlKC01MCUsIC01MCUpJyB9fT5cbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgZm9udFNpemU6IDI0LCBjb2xvcjogJyMyMjInIH19PkxvYWRpbmcgcHJvamVjdC4uLjwvc3Bhbj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIClcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBzdHlsZT17eyBwb3NpdGlvbjogJ3JlbGF0aXZlJywgd2lkdGg6ICcxMDAlJywgaGVpZ2h0OiAnMTAwJScgfX0+XG4gICAgICAgIDxUb3VyIHByb2plY3RzTGlzdD17dGhpcy5zdGF0ZS5wcm9qZWN0c0xpc3R9IGVudm95PXt0aGlzLmVudm95fSAvPlxuICAgICAgICA8ZGl2IHN0eWxlPXt7IHBvc2l0aW9uOiAnYWJzb2x1dGUnLCB3aWR0aDogJzEwMCUnLCBoZWlnaHQ6ICcxMDAlJywgdG9wOiAwLCBsZWZ0OiAwIH19PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdsYXlvdXQtYm94JyBzdHlsZT17e292ZXJmbG93OiAndmlzaWJsZSd9fT5cbiAgICAgICAgICAgIDxSZWFjdENTU1RyYW5zaXRpb25Hcm91cFxuICAgICAgICAgICAgICB0cmFuc2l0aW9uTmFtZT0ndG9hc3QnXG4gICAgICAgICAgICAgIHRyYW5zaXRpb25FbnRlclRpbWVvdXQ9ezUwMH1cbiAgICAgICAgICAgICAgdHJhbnNpdGlvbkxlYXZlVGltZW91dD17MzAwfT5cbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17e3Bvc2l0aW9uOiAnYWJzb2x1dGUnLCByaWdodDogMCwgdG9wOiAwLCB3aWR0aDogMzAwfX0+XG4gICAgICAgICAgICAgICAge2xvZGFzaC5tYXAodGhpcy5zdGF0ZS5ub3RpY2VzLCB0aGlzLnJlbmRlck5vdGlmaWNhdGlvbnMpfVxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvUmVhY3RDU1NUcmFuc2l0aW9uR3JvdXA+XG4gICAgICAgICAgICA8U3BsaXRQYW5lIG9uRHJhZ0ZpbmlzaGVkPXt0aGlzLmhhbmRsZVBhbmVSZXNpemUuYmluZCh0aGlzKX0gc3BsaXQ9J2hvcml6b250YWwnIG1pblNpemU9ezMwMH0gZGVmYXVsdFNpemU9e3RoaXMucHJvcHMuaGVpZ2h0ICogMC42Mn0+XG4gICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgPFNwbGl0UGFuZSBvbkRyYWdGaW5pc2hlZD17dGhpcy5oYW5kbGVQYW5lUmVzaXplLmJpbmQodGhpcyl9IHNwbGl0PSd2ZXJ0aWNhbCcgbWluU2l6ZT17MzAwfSBkZWZhdWx0U2l6ZT17MzAwfT5cbiAgICAgICAgICAgICAgICAgIDxTaWRlQmFyXG4gICAgICAgICAgICAgICAgICAgIHNldERhc2hib2FyZFZpc2liaWxpdHk9e3RoaXMuc2V0RGFzaGJvYXJkVmlzaWJpbGl0eS5iaW5kKHRoaXMpfVxuICAgICAgICAgICAgICAgICAgICBzd2l0Y2hBY3RpdmVOYXY9e3RoaXMuc3dpdGNoQWN0aXZlTmF2LmJpbmQodGhpcyl9XG4gICAgICAgICAgICAgICAgICAgIGFjdGl2ZU5hdj17dGhpcy5zdGF0ZS5hY3RpdmVOYXZ9PlxuICAgICAgICAgICAgICAgICAgICB7dGhpcy5zdGF0ZS5hY3RpdmVOYXYgPT09ICdsaWJyYXJ5J1xuICAgICAgICAgICAgICAgICAgICAgID8gPExpYnJhcnlcbiAgICAgICAgICAgICAgICAgICAgICAgIGxheW91dD17dGhpcy5sYXlvdXR9XG4gICAgICAgICAgICAgICAgICAgICAgICBmb2xkZXI9e3RoaXMuc3RhdGUucHJvamVjdEZvbGRlcn1cbiAgICAgICAgICAgICAgICAgICAgICAgIGhhaWt1PXt0aGlzLnByb3BzLmhhaWt1fVxuICAgICAgICAgICAgICAgICAgICAgICAgd2Vic29ja2V0PXt0aGlzLnByb3BzLndlYnNvY2tldH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHRvdXJDaGFubmVsPXt0aGlzLnRvdXJDaGFubmVsfVxuICAgICAgICAgICAgICAgICAgICAgICAgb25EcmFnRW5kPXt0aGlzLm9uTGlicmFyeURyYWdFbmQuYmluZCh0aGlzKX1cbiAgICAgICAgICAgICAgICAgICAgICAgIG9uRHJhZ1N0YXJ0PXt0aGlzLm9uTGlicmFyeURyYWdTdGFydC5iaW5kKHRoaXMpfVxuICAgICAgICAgICAgICAgICAgICAgICAgY3JlYXRlTm90aWNlPXt0aGlzLmNyZWF0ZU5vdGljZX1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJlbW92ZU5vdGljZT17dGhpcy5yZW1vdmVOb3RpY2V9IC8+XG4gICAgICAgICAgICAgICAgICAgICAgOiA8U3RhdGVJbnNwZWN0b3JcbiAgICAgICAgICAgICAgICAgICAgICAgIGNyZWF0ZU5vdGljZT17dGhpcy5jcmVhdGVOb3RpY2V9XG4gICAgICAgICAgICAgICAgICAgICAgICByZW1vdmVOb3RpY2U9e3RoaXMucmVtb3ZlTm90aWNlfVxuICAgICAgICAgICAgICAgICAgICAgICAgZm9sZGVyPXt0aGlzLnN0YXRlLnByb2plY3RGb2xkZXJ9XG4gICAgICAgICAgICAgICAgICAgICAgICB3ZWJzb2NrZXQ9e3RoaXMucHJvcHMud2Vic29ja2V0fVxuICAgICAgICAgICAgICAgICAgICAgICAgdG91ckNoYW5uZWw9e3RoaXMudG91ckNoYW5uZWx9IC8+XG4gICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgPC9TaWRlQmFyPlxuICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17e3Bvc2l0aW9uOiAncmVsYXRpdmUnLCB3aWR0aDogJzEwMCUnLCBoZWlnaHQ6ICcxMDAlJ319PlxuICAgICAgICAgICAgICAgICAgICA8U3RhZ2VcbiAgICAgICAgICAgICAgICAgICAgICByZWY9J3N0YWdlJ1xuICAgICAgICAgICAgICAgICAgICAgIGZvbGRlcj17dGhpcy5zdGF0ZS5wcm9qZWN0Rm9sZGVyfVxuICAgICAgICAgICAgICAgICAgICAgIGVudm95PXt0aGlzLmVudm95fVxuICAgICAgICAgICAgICAgICAgICAgIGhhaWt1PXt0aGlzLnByb3BzLmhhaWt1fVxuICAgICAgICAgICAgICAgICAgICAgIHdlYnNvY2tldD17dGhpcy5wcm9wcy53ZWJzb2NrZXR9XG4gICAgICAgICAgICAgICAgICAgICAgcHJvamVjdD17dGhpcy5zdGF0ZS5wcm9qZWN0T2JqZWN0fVxuICAgICAgICAgICAgICAgICAgICAgIGNyZWF0ZU5vdGljZT17dGhpcy5jcmVhdGVOb3RpY2V9XG4gICAgICAgICAgICAgICAgICAgICAgcmVtb3ZlTm90aWNlPXt0aGlzLnJlbW92ZU5vdGljZX1cbiAgICAgICAgICAgICAgICAgICAgICByZWNlaXZlUHJvamVjdEluZm89e3RoaXMucmVjZWl2ZVByb2plY3RJbmZvfVxuICAgICAgICAgICAgICAgICAgICAgIG9yZ2FuaXphdGlvbk5hbWU9e3RoaXMuc3RhdGUub3JnYW5pemF0aW9uTmFtZX1cbiAgICAgICAgICAgICAgICAgICAgICBhdXRoVG9rZW49e3RoaXMuc3RhdGUuYXV0aFRva2VufVxuICAgICAgICAgICAgICAgICAgICAgIHVzZXJuYW1lPXt0aGlzLnN0YXRlLnVzZXJuYW1lfVxuICAgICAgICAgICAgICAgICAgICAgIHBhc3N3b3JkPXt0aGlzLnN0YXRlLnBhc3N3b3JkfSAvPlxuICAgICAgICAgICAgICAgICAgICB7KHRoaXMuc3RhdGUubGlicmFyeUl0ZW1EcmFnZ2luZylcbiAgICAgICAgICAgICAgICAgICAgICA/IDxkaXYgc3R5bGU9e3sgd2lkdGg6ICcxMDAlJywgaGVpZ2h0OiAnMTAwJScsIGJhY2tncm91bmRDb2xvcjogJ3doaXRlJywgb3BhY2l0eTogMC4wMSwgcG9zaXRpb246ICdhYnNvbHV0ZScsIHRvcDogMCwgbGVmdDogMCB9fSAvPlxuICAgICAgICAgICAgICAgICAgICAgIDogJycgfVxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9TcGxpdFBhbmU+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8VGltZWxpbmVcbiAgICAgICAgICAgICAgICByZWY9J3RpbWVsaW5lJ1xuICAgICAgICAgICAgICAgIGZvbGRlcj17dGhpcy5zdGF0ZS5wcm9qZWN0Rm9sZGVyfVxuICAgICAgICAgICAgICAgIGVudm95PXt0aGlzLmVudm95fVxuICAgICAgICAgICAgICAgIGhhaWt1PXt0aGlzLnByb3BzLmhhaWt1fSAvPlxuICAgICAgICAgICAgPC9TcGxpdFBhbmU+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG59XG4iXX0=