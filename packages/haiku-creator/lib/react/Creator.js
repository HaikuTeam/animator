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
                haiku: this.props.haiku,
                createNotice: this.createNotice,
                removeNotice: this.removeNotice, __source: {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZWFjdC9DcmVhdG9yLmpzIl0sIm5hbWVzIjpbInBrZyIsInJlcXVpcmUiLCJtaXhwYW5lbCIsImVsZWN0cm9uIiwicmVtb3RlIiwiaXBjUmVuZGVyZXIiLCJjbGlwYm9hcmQiLCJ3ZWJGcmFtZSIsInNldFpvb21MZXZlbExpbWl0cyIsInNldExheW91dFpvb21MZXZlbExpbWl0cyIsIkNyZWF0b3IiLCJwcm9wcyIsImF1dGhlbnRpY2F0ZVVzZXIiLCJiaW5kIiwiYXV0aGVudGljYXRpb25Db21wbGV0ZSIsImxvYWRQcm9qZWN0cyIsImxhdW5jaFByb2plY3QiLCJyZW1vdmVOb3RpY2UiLCJjcmVhdGVOb3RpY2UiLCJyZW5kZXJOb3RpZmljYXRpb25zIiwicmVjZWl2ZVByb2plY3RJbmZvIiwiaGFuZGxlRmluZEVsZW1lbnRDb29yZGluYXRlcyIsImhhbmRsZUZpbmRXZWJ2aWV3Q29vcmRpbmF0ZXMiLCJsYXlvdXQiLCJzdGF0ZSIsImVycm9yIiwicHJvamVjdEZvbGRlciIsImZvbGRlciIsImFwcGxpY2F0aW9uSW1hZ2UiLCJwcm9qZWN0T2JqZWN0IiwicHJvamVjdE5hbWUiLCJkYXNoYm9hcmRWaXNpYmxlIiwicmVhZHlGb3JBdXRoIiwiaXNVc2VyQXV0aGVudGljYXRlZCIsInVzZXJuYW1lIiwicGFzc3dvcmQiLCJub3RpY2VzIiwic29mdHdhcmVWZXJzaW9uIiwidmVyc2lvbiIsImRpZFBsdW1iaW5nTm90aWNlQ3Jhc2giLCJhY3RpdmVOYXYiLCJwcm9qZWN0c0xpc3QiLCJ3aW4iLCJnZXRDdXJyZW50V2luZG93IiwicHJvY2VzcyIsImVudiIsIkRFViIsIm9wZW5EZXZUb29scyIsImRvY3VtZW50IiwiYWRkRXZlbnRMaXN0ZW5lciIsIm5hdGl2ZUV2ZW50IiwiX2xhc3RNb3VzZVgiLCJjbGllbnRYIiwiX2xhc3RNb3VzZVkiLCJjbGllbnRZIiwiY29tYm9rZXlzIiwiZG9jdW1lbnRFbGVtZW50IiwiZGVib3VuY2UiLCJ3ZWJzb2NrZXQiLCJzZW5kIiwibWV0aG9kIiwicGFyYW1zIiwibGVhZGluZyIsImR1bXBTeXN0ZW1JbmZvIiwib24iLCJ0eXBlIiwibmFtZSIsIm9wZW5UZXJtaW5hbCIsImV4ZWNTeW5jIiwiSlNPTiIsInN0cmluZ2lmeSIsImV4Y2VwdGlvbiIsImNvbnNvbGUiLCJ0aW1lc3RhbXAiLCJEYXRlIiwibm93IiwiZHVtcGRpciIsImpvaW4iLCJ3cml0ZUZpbGVTeW5jIiwiYXJndiIsImV4aXN0c1N5bmMiLCJyZWFkRmlsZVN5bmMiLCJ0b1N0cmluZyIsImFjdGl2ZUZvbGRlciIsInJlYWN0U3RhdGUiLCJfX2ZpbGVuYW1lIiwiX19kaXJuYW1lIiwiaG9tZWRpciIsImlzRGV2VG9vbHNPcGVuZWQiLCJjbG9zZURldlRvb2xzIiwicmVmcyIsInN0YWdlIiwidG9nZ2xlRGV2VG9vbHMiLCJ0aW1lbGluZSIsIm1heWJlUGFzdGVSZXF1ZXN0IiwicGFzdGVkVGV4dCIsInJlYWRUZXh0IiwicGFzdGVkRGF0YSIsInBhcnNlIiwid2FybiIsIkFycmF5IiwiaXNBcnJheSIsInBhc3RlZEVsZW1lbnQiLCJyZXF1ZXN0IiwidGl0bGUiLCJtZXNzYWdlIiwiY2xvc2VUZXh0IiwibGlnaHRTY2hlbWUiLCJsZW5ndGgiLCJpbmZvIiwiZGF0YSIsImhhbmRsZUNvbnRlbnRQYXN0ZSIsImVudm95IiwicG9ydCIsImhhaWt1IiwiaG9zdCIsIldlYlNvY2tldCIsIndpbmRvdyIsImdldCIsInRoZW4iLCJ0b3VyQ2hhbm5lbCIsInNldERhc2hib2FyZFZpc2liaWxpdHkiLCJzZXRUaW1lb3V0Iiwic3RhcnQiLCJ0aHJvdHRsZSIsIm5vdGlmeVNjcmVlblJlc2l6ZSIsInBhc3RlRXZlbnQiLCJ0YWduYW1lIiwidGFyZ2V0IiwidGFnTmFtZSIsInRvTG93ZXJDYXNlIiwicHJldmVudERlZmF1bHQiLCJjYiIsImF1dGhBbnN3ZXIiLCJtZXJnZVRvUGF5bG9hZCIsImRpc3RpbmN0X2lkIiwiaGFpa3VUcmFjayIsInNldFN0YXRlIiwiYXV0aFRva2VuIiwib3JnYW5pemF0aW9uTmFtZSIsImlzQXV0aGVkIiwibGF1bmNoRm9sZGVyIiwiZm9sZGVyTG9hZGluZ0Vycm9yIiwib2ZmIiwic2VsZWN0b3IiLCJ3ZWJ2aWV3IiwiZWxlbWVudCIsInF1ZXJ5U2VsZWN0b3IiLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJ0b3AiLCJsZWZ0IiwicmVjZWl2ZUVsZW1lbnRDb29yZGluYXRlcyIsInJlY2VpdmVXZWJ2aWV3Q29vcmRpbmF0ZXMiLCJjb250ZW50IiwiaSIsIm5leHQiLCJwcm9qZWN0SW5mbyIsInNraXBDb250ZW50Q3JlYXRpb24iLCJwcm9qZWN0c0hvbWUiLCJwcm9qZWN0UGF0aCIsImF1dGhvck5hbWUiLCJwcm9qZWN0Iiwib3JnYW5pemF0aW9uIiwiZXJyIiwiYXNzaWduIiwibWF5YmVQcm9qZWN0TmFtZSIsImluZGV4IiwiaWQiLCJ1bmRlZmluZWQiLCJzbGljZSIsImVhY2giLCJub3RpY2UiLCJNYXRoIiwicmFuZG9tIiwicmVwbGFjZWRFeGlzdGluZyIsImZvckVhY2giLCJuIiwic3BsaWNlIiwidW5zaGlmdCIsImRyYWdFbmROYXRpdmVFdmVudCIsImxpYnJhcnlJdGVtSW5mbyIsImxpYnJhcnlJdGVtRHJhZ2dpbmciLCJwcmV2aWV3IiwiaGFuZGxlRHJvcCIsImRyYWdTdGFydE5hdGl2ZUV2ZW50IiwicG9zaXRpb24iLCJ3aWR0aCIsImhlaWdodCIsInJpZ2h0IiwibWFwIiwiZGlzcGxheSIsInZlcnRpY2FsQWxpZ24iLCJ0ZXh0QWxpZ24iLCJjb2xvciIsImJvdHRvbSIsInJlbmRlclN0YXJ0dXBEZWZhdWx0U2NyZWVuIiwidHJhbnNmb3JtIiwiZm9udFNpemUiLCJvdmVyZmxvdyIsImhhbmRsZVBhbmVSZXNpemUiLCJzd2l0Y2hBY3RpdmVOYXYiLCJvbkxpYnJhcnlEcmFnRW5kIiwib25MaWJyYXJ5RHJhZ1N0YXJ0IiwiYmFja2dyb3VuZENvbG9yIiwib3BhY2l0eSIsIkNvbXBvbmVudCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7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QUFXSyxhQU50QjtBQU9FLG9DQUFjLEtBQUtYLFlBUHJCO0FBUUUsb0NBQWMsS0FBS0QsWUFSckI7QUFTRSwwQ0FBb0IsS0FBS0csa0JBVDNCO0FBVUUsd0NBQWtCLEtBQUtJLEtBQUwsQ0FBV21ILGdCQVYvQjtBQVdFLGlDQUFXLEtBQUtuSCxLQUFMLENBQVdrSCxTQVh4QjtBQVlFLGdDQUFVLEtBQUtsSCxLQUFMLENBQVdVLFFBWnZCO0FBYUUsZ0NBQVUsS0FBS1YsS0FBTCxDQUFXVyxRQWJ2QjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsc0JBREY7QUFlSSx5QkFBS1gsS0FBTCxDQUFXNkosbUJBQVosR0FDRyx1Q0FBSyxPQUFPLEVBQUVLLE9BQU8sTUFBVCxFQUFpQkMsUUFBUSxNQUF6QixFQUFpQ2dCLGlCQUFpQixPQUFsRCxFQUEyREMsU0FBUyxJQUFwRSxFQUEwRW5CLFVBQVUsVUFBcEYsRUFBZ0dwQyxLQUFLLENBQXJHLEVBQXdHQyxNQUFNLENBQTlHLEVBQVo7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLHNCQURILEdBRUc7QUFqQk47QUF4QkY7QUFERixlQURGO0FBK0NFO0FBQ0UscUJBQUksVUFETjtBQUVFLHdCQUFRLEtBQUs5SCxLQUFMLENBQVdFLGFBRnJCO0FBR0UsdUJBQU8sS0FBS3NGLEtBSGQ7QUFJRSx1QkFBTyxLQUFLckcsS0FBTCxDQUFXdUcsS0FKcEI7QUFLRSw4QkFBYyxLQUFLaEcsWUFMckI7QUFNRSw4QkFBYyxLQUFLRCxZQU5yQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUEvQ0Y7QUFURjtBQURGO0FBRkYsT0FERjtBQXdFRDs7OztFQTFvQmtDLGdCQUFNNEwsUzs7a0JBQXRCbk0sTyIsImZpbGUiOiJDcmVhdG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgU3R5bGVSb290IH0gZnJvbSAncmFkaXVtJ1xuaW1wb3J0IFNwbGl0UGFuZSBmcm9tICdyZWFjdC1zcGxpdC1wYW5lJ1xuaW1wb3J0IFJlYWN0Q1NTVHJhbnNpdGlvbkdyb3VwIGZyb20gJ3JlYWN0LWFkZG9ucy1jc3MtdHJhbnNpdGlvbi1ncm91cCdcbmltcG9ydCBsb2Rhc2ggZnJvbSAnbG9kYXNoJ1xuaW1wb3J0IENvbWJva2V5cyBmcm9tICdjb21ib2tleXMnXG5pbXBvcnQgRXZlbnRFbWl0dGVyIGZyb20gJ2V2ZW50LWVtaXR0ZXInXG5pbXBvcnQgY3AgZnJvbSAnY2hpbGRfcHJvY2VzcydcbmltcG9ydCBvcyBmcm9tICdvcydcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQgZnMgZnJvbSAnZnMnXG5pbXBvcnQgQXV0aGVudGljYXRpb25VSSBmcm9tICcuL2NvbXBvbmVudHMvQXV0aGVudGljYXRpb25VSSdcbmltcG9ydCBQcm9qZWN0QnJvd3NlciBmcm9tICcuL2NvbXBvbmVudHMvUHJvamVjdEJyb3dzZXInXG5pbXBvcnQgU2lkZUJhciBmcm9tICcuL2NvbXBvbmVudHMvU2lkZUJhcidcbmltcG9ydCBMaWJyYXJ5IGZyb20gJy4vY29tcG9uZW50cy9saWJyYXJ5L0xpYnJhcnknXG5pbXBvcnQgU3RhdGVJbnNwZWN0b3IgZnJvbSAnLi9jb21wb25lbnRzL1N0YXRlSW5zcGVjdG9yL1N0YXRlSW5zcGVjdG9yJ1xuaW1wb3J0IFN0YWdlIGZyb20gJy4vY29tcG9uZW50cy9TdGFnZSdcbmltcG9ydCBUaW1lbGluZSBmcm9tICcuL2NvbXBvbmVudHMvVGltZWxpbmUnXG5pbXBvcnQgVG9hc3QgZnJvbSAnLi9jb21wb25lbnRzL25vdGlmaWNhdGlvbnMvVG9hc3QnXG5pbXBvcnQgVG91ciBmcm9tICcuL2NvbXBvbmVudHMvVG91ci9Ub3VyJ1xuaW1wb3J0IEVudm95Q2xpZW50IGZyb20gJ2hhaWt1LXNkay1jcmVhdG9yL2xpYi9lbnZveS9jbGllbnQnXG5pbXBvcnQge1xuICBIT01FRElSX1BBVEgsXG4gIEhPTUVESVJfTE9HU19QQVRIXG59IGZyb20gJ2hhaWt1LXNlcmlhbGl6YXRpb24vc3JjL3V0aWxzL0hhaWt1SG9tZURpcidcblxudmFyIHBrZyA9IHJlcXVpcmUoJy4vLi4vLi4vcGFja2FnZS5qc29uJylcblxudmFyIG1peHBhbmVsID0gcmVxdWlyZSgnaGFpa3Utc2VyaWFsaXphdGlvbi9zcmMvdXRpbHMvTWl4cGFuZWwnKVxuXG5jb25zdCBlbGVjdHJvbiA9IHJlcXVpcmUoJ2VsZWN0cm9uJylcbmNvbnN0IHJlbW90ZSA9IGVsZWN0cm9uLnJlbW90ZVxuY29uc3QgaXBjUmVuZGVyZXIgPSBlbGVjdHJvbi5pcGNSZW5kZXJlclxuY29uc3QgY2xpcGJvYXJkID0gZWxlY3Ryb24uY2xpcGJvYXJkXG5cbnZhciB3ZWJGcmFtZSA9IGVsZWN0cm9uLndlYkZyYW1lXG5pZiAod2ViRnJhbWUpIHtcbiAgaWYgKHdlYkZyYW1lLnNldFpvb21MZXZlbExpbWl0cykgd2ViRnJhbWUuc2V0Wm9vbUxldmVsTGltaXRzKDEsIDEpXG4gIGlmICh3ZWJGcmFtZS5zZXRMYXlvdXRab29tTGV2ZWxMaW1pdHMpIHdlYkZyYW1lLnNldExheW91dFpvb21MZXZlbExpbWl0cygwLCAwKVxufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDcmVhdG9yIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IgKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpXG4gICAgdGhpcy5hdXRoZW50aWNhdGVVc2VyID0gdGhpcy5hdXRoZW50aWNhdGVVc2VyLmJpbmQodGhpcylcbiAgICB0aGlzLmF1dGhlbnRpY2F0aW9uQ29tcGxldGUgPSB0aGlzLmF1dGhlbnRpY2F0aW9uQ29tcGxldGUuYmluZCh0aGlzKVxuICAgIHRoaXMubG9hZFByb2plY3RzID0gdGhpcy5sb2FkUHJvamVjdHMuYmluZCh0aGlzKVxuICAgIHRoaXMubGF1bmNoUHJvamVjdCA9IHRoaXMubGF1bmNoUHJvamVjdC5iaW5kKHRoaXMpXG4gICAgdGhpcy5yZW1vdmVOb3RpY2UgPSB0aGlzLnJlbW92ZU5vdGljZS5iaW5kKHRoaXMpXG4gICAgdGhpcy5jcmVhdGVOb3RpY2UgPSB0aGlzLmNyZWF0ZU5vdGljZS5iaW5kKHRoaXMpXG4gICAgdGhpcy5yZW5kZXJOb3RpZmljYXRpb25zID0gdGhpcy5yZW5kZXJOb3RpZmljYXRpb25zLmJpbmQodGhpcylcbiAgICB0aGlzLnJlY2VpdmVQcm9qZWN0SW5mbyA9IHRoaXMucmVjZWl2ZVByb2plY3RJbmZvLmJpbmQodGhpcylcbiAgICB0aGlzLmhhbmRsZUZpbmRFbGVtZW50Q29vcmRpbmF0ZXMgPSB0aGlzLmhhbmRsZUZpbmRFbGVtZW50Q29vcmRpbmF0ZXMuYmluZCh0aGlzKVxuICAgIHRoaXMuaGFuZGxlRmluZFdlYnZpZXdDb29yZGluYXRlcyA9IHRoaXMuaGFuZGxlRmluZFdlYnZpZXdDb29yZGluYXRlcy5iaW5kKHRoaXMpXG4gICAgdGhpcy5sYXlvdXQgPSBuZXcgRXZlbnRFbWl0dGVyKClcblxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBlcnJvcjogbnVsbCxcbiAgICAgIHByb2plY3RGb2xkZXI6IHRoaXMucHJvcHMuZm9sZGVyLFxuICAgICAgYXBwbGljYXRpb25JbWFnZTogbnVsbCxcbiAgICAgIHByb2plY3RPYmplY3Q6IG51bGwsXG4gICAgICBwcm9qZWN0TmFtZTogbnVsbCxcbiAgICAgIGRhc2hib2FyZFZpc2libGU6ICF0aGlzLnByb3BzLmZvbGRlcixcbiAgICAgIHJlYWR5Rm9yQXV0aDogZmFsc2UsXG4gICAgICBpc1VzZXJBdXRoZW50aWNhdGVkOiBmYWxzZSxcbiAgICAgIHVzZXJuYW1lOiBudWxsLFxuICAgICAgcGFzc3dvcmQ6IG51bGwsXG4gICAgICBub3RpY2VzOiBbXSxcbiAgICAgIHNvZnR3YXJlVmVyc2lvbjogcGtnLnZlcnNpb24sXG4gICAgICBkaWRQbHVtYmluZ05vdGljZUNyYXNoOiBmYWxzZSxcbiAgICAgIGFjdGl2ZU5hdjogJ2xpYnJhcnknLFxuICAgICAgcHJvamVjdHNMaXN0OiBbXVxuICAgIH1cblxuICAgIGNvbnN0IHdpbiA9IHJlbW90ZS5nZXRDdXJyZW50V2luZG93KClcblxuICAgIGlmIChwcm9jZXNzLmVudi5ERVYgPT09ICcxJykge1xuICAgICAgd2luLm9wZW5EZXZUb29scygpXG4gICAgfVxuXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgKG5hdGl2ZUV2ZW50KSA9PiB7XG4gICAgICB0aGlzLl9sYXN0TW91c2VYID0gbmF0aXZlRXZlbnQuY2xpZW50WFxuICAgICAgdGhpcy5fbGFzdE1vdXNlWSA9IG5hdGl2ZUV2ZW50LmNsaWVudFlcbiAgICB9KVxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWcnLCAobmF0aXZlRXZlbnQpID0+IHtcbiAgICAgIC8vIFdoZW4gdGhlIGRyYWcgZW5kcywgZm9yIHNvbWUgcmVhc29uIHRoZSBwb3NpdGlvbiBnb2VzIHRvIDAsIHNvIGhhY2sgdGhpcy4uLlxuICAgICAgaWYgKG5hdGl2ZUV2ZW50LmNsaWVudFggPiAwICYmIG5hdGl2ZUV2ZW50LmNsaWVudFkgPiAwKSB7XG4gICAgICAgIHRoaXMuX2xhc3RNb3VzZVggPSBuYXRpdmVFdmVudC5jbGllbnRYXG4gICAgICAgIHRoaXMuX2xhc3RNb3VzZVkgPSBuYXRpdmVFdmVudC5jbGllbnRZXG4gICAgICB9XG4gICAgfSlcblxuICAgIGNvbnN0IGNvbWJva2V5cyA9IG5ldyBDb21ib2tleXMoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KVxuICAgIGNvbWJva2V5cy5iaW5kKCdjb21tYW5kK29wdGlvbitpJywgbG9kYXNoLmRlYm91bmNlKCgpID0+IHtcbiAgICAgIHRoaXMucHJvcHMud2Vic29ja2V0LnNlbmQoeyBtZXRob2Q6ICd0b2dnbGVEZXZUb29scycsIHBhcmFtczogW3RoaXMuc3RhdGUucHJvamVjdEZvbGRlcl0gfSlcbiAgICB9LCA1MDAsIHsgbGVhZGluZzogdHJ1ZSB9KSlcbiAgICBjb21ib2tleXMuYmluZCgnY29tbWFuZCtvcHRpb24rMCcsIGxvZGFzaC5kZWJvdW5jZSgoKSA9PiB7XG4gICAgICB0aGlzLmR1bXBTeXN0ZW1JbmZvKClcbiAgICB9LCA1MDAsIHsgbGVhZGluZzogdHJ1ZSB9KSlcblxuICAgIC8vIE5PVEU6IFRoZSBUb3BNZW51IGF1dG9tYXRpY2FsbHkgYmluZHMgdGhlIGJlbG93IGtleWJvYXJkIHNob3J0Y3V0cy9hY2NlbGVyYXRvcnNcbiAgICBpcGNSZW5kZXJlci5vbignZ2xvYmFsLW1lbnU6em9vbS1pbicsICgpID0+IHtcbiAgICAgIHRoaXMucHJvcHMud2Vic29ja2V0LnNlbmQoeyB0eXBlOiAnYnJvYWRjYXN0JywgbmFtZTogJ3ZpZXc6em9vbS1pbicgfSlcbiAgICB9KVxuICAgIGlwY1JlbmRlcmVyLm9uKCdnbG9iYWwtbWVudTp6b29tLW91dCcsICgpID0+IHtcbiAgICAgIHRoaXMucHJvcHMud2Vic29ja2V0LnNlbmQoeyB0eXBlOiAnYnJvYWRjYXN0JywgbmFtZTogJ3ZpZXc6em9vbS1vdXQnIH0pXG4gICAgfSlcbiAgICBpcGNSZW5kZXJlci5vbignZ2xvYmFsLW1lbnU6b3Blbi10ZXJtaW5hbCcsIGxvZGFzaC5kZWJvdW5jZSgoKSA9PiB7XG4gICAgICB0aGlzLm9wZW5UZXJtaW5hbCh0aGlzLnN0YXRlLnByb2plY3RGb2xkZXIpXG4gICAgfSwgNTAwLCB7IGxlYWRpbmc6IHRydWUgfSkpXG4gICAgaXBjUmVuZGVyZXIub24oJ2dsb2JhbC1tZW51OnVuZG8nLCBsb2Rhc2guZGVib3VuY2UoKCkgPT4ge1xuICAgICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQuc2VuZCh7IG1ldGhvZDogJ2dpdFVuZG8nLCBwYXJhbXM6IFt0aGlzLnN0YXRlLnByb2plY3RGb2xkZXIsIHsgdHlwZTogJ2dsb2JhbCcgfV0gfSlcbiAgICB9LCA1MDAsIHsgbGVhZGluZzogdHJ1ZSB9KSlcbiAgICBpcGNSZW5kZXJlci5vbignZ2xvYmFsLW1lbnU6cmVkbycsIGxvZGFzaC5kZWJvdW5jZSgoKSA9PiB7XG4gICAgICB0aGlzLnByb3BzLndlYnNvY2tldC5zZW5kKHsgbWV0aG9kOiAnZ2l0UmVkbycsIHBhcmFtczogW3RoaXMuc3RhdGUucHJvamVjdEZvbGRlciwgeyB0eXBlOiAnZ2xvYmFsJyB9XSB9KVxuICAgIH0sIDUwMCwgeyBsZWFkaW5nOiB0cnVlIH0pKVxuICB9XG5cbiAgb3BlblRlcm1pbmFsIChmb2xkZXIpIHtcbiAgICB0cnkge1xuICAgICAgY3AuZXhlY1N5bmMoJ29wZW4gLWIgY29tLmFwcGxlLnRlcm1pbmFsICcgKyBKU09OLnN0cmluZ2lmeShmb2xkZXIpICsgJyB8fCB0cnVlJylcbiAgICB9IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoZXhjZXB0aW9uKVxuICAgIH1cbiAgfVxuXG4gIGR1bXBTeXN0ZW1JbmZvICgpIHtcbiAgICBjb25zdCB0aW1lc3RhbXAgPSBEYXRlLm5vdygpXG4gICAgY29uc3QgZHVtcGRpciA9IHBhdGguam9pbihIT01FRElSX1BBVEgsICdkdW1wcycsIGBkdW1wLSR7dGltZXN0YW1wfWApXG4gICAgY3AuZXhlY1N5bmMoYG1rZGlyIC1wICR7SlNPTi5zdHJpbmdpZnkoZHVtcGRpcil9YClcbiAgICBmcy53cml0ZUZpbGVTeW5jKHBhdGguam9pbihkdW1wZGlyLCAnYXJndicpLCBKU09OLnN0cmluZ2lmeShwcm9jZXNzLmFyZ3YsIG51bGwsIDIpKVxuICAgIGZzLndyaXRlRmlsZVN5bmMocGF0aC5qb2luKGR1bXBkaXIsICdlbnYnKSwgSlNPTi5zdHJpbmdpZnkocHJvY2Vzcy5lbnYsIG51bGwsIDIpKVxuICAgIGlmIChmcy5leGlzdHNTeW5jKHBhdGguam9pbihIT01FRElSX0xPR1NfUEFUSCwgJ2hhaWt1LWRlYnVnLmxvZycpKSkge1xuICAgICAgZnMud3JpdGVGaWxlU3luYyhwYXRoLmpvaW4oZHVtcGRpciwgJ2xvZycpLCBmcy5yZWFkRmlsZVN5bmMocGF0aC5qb2luKEhPTUVESVJfTE9HU19QQVRILCAnaGFpa3UtZGVidWcubG9nJykpLnRvU3RyaW5nKCkpXG4gICAgfVxuICAgIGZzLndyaXRlRmlsZVN5bmMocGF0aC5qb2luKGR1bXBkaXIsICdpbmZvJyksIEpTT04uc3RyaW5naWZ5KHtcbiAgICAgIGFjdGl2ZUZvbGRlcjogdGhpcy5zdGF0ZS5wcm9qZWN0Rm9sZGVyLFxuICAgICAgcmVhY3RTdGF0ZTogdGhpcy5zdGF0ZSxcbiAgICAgIF9fZmlsZW5hbWU6IF9fZmlsZW5hbWUsXG4gICAgICBfX2Rpcm5hbWU6IF9fZGlybmFtZVxuICAgIH0sIG51bGwsIDIpKVxuICAgIGlmICh0aGlzLnN0YXRlLnByb2plY3RGb2xkZXIpIHtcbiAgICAgIC8vIFRoZSBwcm9qZWN0IGZvbGRlciBpdHNlbGYgd2lsbCBjb250YWluIGdpdCBsb2dzIGFuZCBvdGhlciBnb29kaWVzIHdlIG1naWh0IHdhbnQgdG8gbG9vayBhdFxuICAgICAgY3AuZXhlY1N5bmMoYHRhciAtemN2ZiAke0pTT04uc3RyaW5naWZ5KHBhdGguam9pbihkdW1wZGlyLCAncHJvamVjdC50YXIuZ3onKSl9ICR7SlNPTi5zdHJpbmdpZnkodGhpcy5zdGF0ZS5wcm9qZWN0Rm9sZGVyKX1gKVxuICAgIH1cbiAgICAvLyBGb3IgY29udmVuaWVuY2UsIHppcCB1cCB0aGUgZW50aXJlIGR1bXAgZm9sZGVyLi4uXG4gICAgY3AuZXhlY1N5bmMoYHRhciAtemN2ZiAke0pTT04uc3RyaW5naWZ5KHBhdGguam9pbihvcy5ob21lZGlyKCksIGBoYWlrdS1kdW1wLSR7dGltZXN0YW1wfS50YXIuZ3pgKSl9ICR7SlNPTi5zdHJpbmdpZnkoZHVtcGRpcil9YClcbiAgfVxuXG4gIHRvZ2dsZURldlRvb2xzICgpIHtcbiAgICBjb25zdCB3aW4gPSByZW1vdGUuZ2V0Q3VycmVudFdpbmRvdygpXG4gICAgaWYgKHdpbi5pc0RldlRvb2xzT3BlbmVkKCkpIHdpbi5jbG9zZURldlRvb2xzKClcbiAgICBlbHNlIHdpbi5vcGVuRGV2VG9vbHMoKVxuICAgIGlmICh0aGlzLnJlZnMuc3RhZ2UpIHRoaXMucmVmcy5zdGFnZS50b2dnbGVEZXZUb29scygpXG4gICAgaWYgKHRoaXMucmVmcy50aW1lbGluZSkgdGhpcy5yZWZzLnRpbWVsaW5lLnRvZ2dsZURldlRvb2xzKClcbiAgfVxuXG4gIGhhbmRsZUNvbnRlbnRQYXN0ZSAobWF5YmVQYXN0ZVJlcXVlc3QpIHtcbiAgICBsZXQgcGFzdGVkVGV4dCA9IGNsaXBib2FyZC5yZWFkVGV4dCgpXG4gICAgaWYgKCFwYXN0ZWRUZXh0KSByZXR1cm4gdm9pZCAoMClcblxuICAgIC8vIFRoZSBkYXRhIG9uIHRoZSBjbGlwYm9hcmQgbWlnaHQgYmUgc2VyaWFsaXplZCBkYXRhLCBzbyB0cnkgdG8gcGFyc2UgaXQgaWYgdGhhdCdzIHRoZSBjYXNlXG4gICAgLy8gVGhlIG1haW4gY2FzZSB3ZSBoYXZlIG5vdyBmb3Igc2VyaWFsaXplZCBkYXRhIGlzIGhhaWt1IGVsZW1lbnRzIGNvcGllZCBmcm9tIHRoZSBzdGFnZVxuICAgIGxldCBwYXN0ZWREYXRhXG4gICAgdHJ5IHtcbiAgICAgIHBhc3RlZERhdGEgPSBKU09OLnBhcnNlKHBhc3RlZFRleHQpXG4gICAgfSBjYXRjaCAoZXhjZXB0aW9uKSB7XG4gICAgICBjb25zb2xlLndhcm4oJ1tjcmVhdG9yXSB1bmFibGUgdG8gcGFyc2UgcGFzdGVkIGRhdGE7IGl0IG1pZ2h0IGJlIHBsYWluIHRleHQnKVxuICAgICAgcGFzdGVkRGF0YSA9IHBhc3RlZFRleHRcbiAgICB9XG5cbiAgICBpZiAoQXJyYXkuaXNBcnJheShwYXN0ZWREYXRhKSkge1xuICAgICAgLy8gVGhpcyBsb29rcyBsaWtlIGEgSGFpa3UgZWxlbWVudCB0aGF0IGhhcyBiZWVuIGNvcGllZCBmcm9tIHRoZSBzdGFnZVxuICAgICAgaWYgKHBhc3RlZERhdGFbMF0gPT09ICdhcHBsaWNhdGlvbi9oYWlrdScgJiYgdHlwZW9mIHBhc3RlZERhdGFbMV0gPT09ICdvYmplY3QnKSB7XG4gICAgICAgIGxldCBwYXN0ZWRFbGVtZW50ID0gcGFzdGVkRGF0YVsxXVxuXG4gICAgICAgIC8vIENvbW1hbmQgdGhlIHZpZXdzIGFuZCBtYXN0ZXIgcHJvY2VzcyB0byBoYW5kbGUgdGhlIGVsZW1lbnQgcGFzdGUgYWN0aW9uXG4gICAgICAgIC8vIFRoZSAncGFzdGVUaGluZycgYWN0aW9uIGlzIGludGVuZGVkIHRvIGJlIGFibGUgdG8gaGFuZGxlIG11bHRpcGxlIGNvbnRlbnQgdHlwZXNcbiAgICAgICAgcmV0dXJuIHRoaXMucHJvcHMud2Vic29ja2V0LnJlcXVlc3QoeyB0eXBlOiAnYWN0aW9uJywgbWV0aG9kOiAncGFzdGVUaGluZycsIHBhcmFtczogW3RoaXMuc3RhdGUucHJvamVjdEZvbGRlciwgcGFzdGVkRWxlbWVudCwgbWF5YmVQYXN0ZVJlcXVlc3QgfHwge31dIH0sIChlcnJvcikgPT4ge1xuICAgICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcilcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNyZWF0ZU5vdGljZSh7XG4gICAgICAgICAgICAgIHR5cGU6ICd3YXJuaW5nJyxcbiAgICAgICAgICAgICAgdGl0bGU6ICdVaCBvaCEnLFxuICAgICAgICAgICAgICBtZXNzYWdlOiAnV2UgY291bGRuXFwndCBwYXN0ZSB0aGF0LiDwn5iiIFBsZWFzZSBjb250YWN0IEhhaWt1IGZvciBzdXBwb3J0LicsXG4gICAgICAgICAgICAgIGNsb3NlVGV4dDogJ09rYXknLFxuICAgICAgICAgICAgICBsaWdodFNjaGVtZTogdHJ1ZVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBUT0RPOiBIYW5kbGUgb3RoZXIgY2FzZXMgd2hlcmUgdGhlIHBhc3RlIGRhdGEgd2FzIGEgc2VyaWFsaXplZCBhcnJheVxuICAgICAgICBjb25zb2xlLndhcm4oJ1tjcmVhdG9yXSBjYW5ub3QgcGFzdGUgdGhpcyBjb250ZW50IHR5cGUgeWV0IChhcnJheSknKVxuICAgICAgICB0aGlzLmNyZWF0ZU5vdGljZSh7XG4gICAgICAgICAgdHlwZTogJ3dhcm5pbmcnLFxuICAgICAgICAgIHRpdGxlOiAnSG1tbScsXG4gICAgICAgICAgbWVzc2FnZTogJ1dlIGRvblxcJ3Qga25vdyBob3cgdG8gcGFzdGUgdGhhdCBjb250ZW50IHlldC4g8J+YsycsXG4gICAgICAgICAgY2xvc2VUZXh0OiAnT2theScsXG4gICAgICAgICAgbGlnaHRTY2hlbWU6IHRydWVcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gQW4gZW1wdHkgc3RyaW5nIGlzIHRyZWF0ZWQgYXMgdGhlIGVxdWl2YWxlbnQgb2Ygbm90aGluZyAoZG9uJ3QgZGlzcGxheSB3YXJuaW5nIGlmIG5vdGhpbmcgdG8gaW5zdGFudGlhdGUpXG4gICAgICBpZiAodHlwZW9mIHBhc3RlZERhdGEgPT09ICdzdHJpbmcnICYmIHBhc3RlZERhdGEubGVuZ3RoID4gMCkge1xuICAgICAgICAvLyBUT0RPOiBIYW5kbGUgdGhlIGNhc2Ugd2hlbiBwbGFpbiB0ZXh0IGhhcyBiZWVuIHBhc3RlZCAtIFNWRywgSFRNTCwgZXRjP1xuICAgICAgICBjb25zb2xlLndhcm4oJ1tjcmVhdG9yXSBjYW5ub3QgcGFzdGUgdGhpcyBjb250ZW50IHR5cGUgeWV0ICh1bmtub3duIHN0cmluZyknKVxuICAgICAgICB0aGlzLmNyZWF0ZU5vdGljZSh7XG4gICAgICAgICAgdHlwZTogJ3dhcm5pbmcnLFxuICAgICAgICAgIHRpdGxlOiAnSG1tbScsXG4gICAgICAgICAgbWVzc2FnZTogJ1dlIGRvblxcJ3Qga25vdyBob3cgdG8gcGFzdGUgdGhhdCBjb250ZW50IHlldC4g8J+YsycsXG4gICAgICAgICAgY2xvc2VUZXh0OiAnT2theScsXG4gICAgICAgICAgbGlnaHRTY2hlbWU6IHRydWVcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBjb21wb25lbnRXaWxsTW91bnQgKCkge1xuICAgIHRoaXMucHJvcHMud2Vic29ja2V0Lm9uKCdicm9hZGNhc3QnLCAobWVzc2FnZSkgPT4ge1xuICAgICAgc3dpdGNoIChtZXNzYWdlLm5hbWUpIHtcbiAgICAgICAgY2FzZSAnZGV2LXRvb2xzOnRvZ2dsZSc6XG4gICAgICAgICAgdGhpcy50b2dnbGVEZXZUb29scygpXG4gICAgICAgICAgYnJlYWtcblxuICAgICAgICBjYXNlICdjdXJyZW50LXBhc3RlYWJsZTpyZXF1ZXN0LXBhc3RlJzpcbiAgICAgICAgICBjb25zb2xlLmluZm8oJ1tjcmVhdG9yXSBjdXJyZW50LXBhc3RlYWJsZTpyZXF1ZXN0LXBhc3RlJywgbWVzc2FnZS5kYXRhKVxuICAgICAgICAgIHJldHVybiB0aGlzLmhhbmRsZUNvbnRlbnRQYXN0ZShtZXNzYWdlLmRhdGEpXG4gICAgICB9XG4gICAgfSlcblxuICAgIHRoaXMuZW52b3kgPSBuZXcgRW52b3lDbGllbnQoe1xuICAgICAgcG9ydDogdGhpcy5wcm9wcy5oYWlrdS5lbnZveS5wb3J0LFxuICAgICAgaG9zdDogdGhpcy5wcm9wcy5oYWlrdS5lbnZveS5ob3N0LFxuICAgICAgV2ViU29ja2V0OiB3aW5kb3cuV2ViU29ja2V0XG4gICAgfSlcblxuICAgIHRoaXMuZW52b3kuZ2V0KCd0b3VyJykudGhlbigodG91ckNoYW5uZWwpID0+IHtcbiAgICAgIHRoaXMudG91ckNoYW5uZWwgPSB0b3VyQ2hhbm5lbFxuXG4gICAgICB0b3VyQ2hhbm5lbC5vbigndG91cjpyZXF1ZXN0RWxlbWVudENvb3JkaW5hdGVzJywgdGhpcy5oYW5kbGVGaW5kRWxlbWVudENvb3JkaW5hdGVzKVxuXG4gICAgICB0b3VyQ2hhbm5lbC5vbigndG91cjpyZXF1ZXN0V2Vidmlld0Nvb3JkaW5hdGVzJywgdGhpcy5oYW5kbGVGaW5kV2Vidmlld0Nvb3JkaW5hdGVzKVxuXG4gICAgICBpcGNSZW5kZXJlci5vbignZ2xvYmFsLW1lbnU6c3RhcnQtdG91cicsICgpID0+IHtcbiAgICAgICAgdGhpcy5zZXREYXNoYm9hcmRWaXNpYmlsaXR5KHRydWUpXG5cbiAgICAgICAgLy8gUHV0IGl0IGF0IHRoZSBib3R0b20gb2YgdGhlIGV2ZW50IGxvb3BcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgdG91ckNoYW5uZWwuc3RhcnQodHJ1ZSlcbiAgICAgICAgfSlcbiAgICAgIH0pXG5cbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCBsb2Rhc2gudGhyb3R0bGUoKCkgPT4ge1xuICAgICAgICAvLyBpZiAodG91ckNoYW5uZWwuaXNUb3VyQWN0aXZlKCkpIHtcbiAgICAgICAgdG91ckNoYW5uZWwubm90aWZ5U2NyZWVuUmVzaXplKClcbiAgICAgICAgLy8gfVxuICAgICAgfSksIDMwMClcbiAgICB9KVxuXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigncGFzdGUnLCAocGFzdGVFdmVudCkgPT4ge1xuICAgICAgY29uc29sZS5pbmZvKCdbY3JlYXRvcl0gcGFzdGUgaGVhcmQnKVxuICAgICAgbGV0IHRhZ25hbWUgPSBwYXN0ZUV2ZW50LnRhcmdldC50YWdOYW1lLnRvTG93ZXJDYXNlKClcbiAgICAgIGlmICh0YWduYW1lID09PSAnaW5wdXQnIHx8IHRhZ25hbWUgPT09ICd0ZXh0YXJlYScpIHtcbiAgICAgICAgLy8gRG8gbm90aGluZzsgbGV0IGlucHV0IGZpZWxkcyBhbmQgc28tb24gYmUgaGFuZGxlZCBub3JtYWxseVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gT3RoZXJ3aXNlLCBhc3N1bWUgd2UgbWlnaHQgbmVlZCB0byBoYW5kbGUgdGhpcyBwYXN0ZSBldmVudCBzcGVjaWFsbHlcbiAgICAgICAgcGFzdGVFdmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgIHRoaXMuaGFuZGxlQ29udGVudFBhc3RlKClcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQub24oJ21ldGhvZCcsIChtZXRob2QsIHBhcmFtcywgY2IpID0+IHtcbiAgICAgIGNvbnNvbGUuaW5mbygnW2NyZWF0b3JdIG1ldGhvZCBmcm9tIHBsdW1iaW5nOicsIG1ldGhvZCwgcGFyYW1zKVxuICAgICAgLy8gbm8tb3A7IGNyZWF0b3IgZG9lc24ndCBjdXJyZW50bHkgcmVjZWl2ZSBhbnkgbWV0aG9kcyBmcm9tIHRoZSBvdGhlciB2aWV3cywgYnV0IHdlIG5lZWQgdGhpc1xuICAgICAgLy8gY2FsbGJhY2sgdG8gYmUgY2FsbGVkIHRvIGFsbG93IHRoZSBhY3Rpb24gY2hhaW4gaW4gcGx1bWJpbmcgdG8gcHJvY2VlZFxuICAgICAgcmV0dXJuIGNiKClcbiAgICB9KVxuXG4gICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQub24oJ29wZW4nLCAoKSA9PiB7XG4gICAgICB0aGlzLnByb3BzLndlYnNvY2tldC5yZXF1ZXN0KHsgbWV0aG9kOiAnaXNVc2VyQXV0aGVudGljYXRlZCcsIHBhcmFtczogW10gfSwgKGVycm9yLCBhdXRoQW5zd2VyKSA9PiB7XG4gICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpXG4gICAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlTm90aWNlKHtcbiAgICAgICAgICAgIHR5cGU6ICdlcnJvcicsXG4gICAgICAgICAgICB0aXRsZTogJ09oIG5vIScsXG4gICAgICAgICAgICBtZXNzYWdlOiAnV2UgaGFkIGEgcHJvYmxlbSBhY2Nlc3NpbmcgeW91ciBhY2NvdW50LiDwn5iiIFBsZWFzZSB0cnkgY2xvc2luZyBhbmQgcmVvcGVuaW5nIHRoZSBhcHBsaWNhdGlvbi4gSWYgeW91IHN0aWxsIHNlZSB0aGlzIG1lc3NhZ2UsIGNvbnRhY3QgSGFpa3UgZm9yIHN1cHBvcnQuJyxcbiAgICAgICAgICAgIGNsb3NlVGV4dDogJ09rYXknLFxuICAgICAgICAgICAgbGlnaHRTY2hlbWU6IHRydWVcbiAgICAgICAgICB9KVxuICAgICAgICB9XG5cbiAgICAgICAgbWl4cGFuZWwubWVyZ2VUb1BheWxvYWQoeyBkaXN0aW5jdF9pZDogYXV0aEFuc3dlciAmJiBhdXRoQW5zd2VyLnVzZXJuYW1lIH0pXG4gICAgICAgIG1peHBhbmVsLmhhaWt1VHJhY2soJ2NyZWF0b3I6b3BlbmVkJylcblxuICAgICAgICAvLyBEZWxheSBzbyB0aGUgZGVmYXVsdCBzdGFydHVwIHNjcmVlbiBkb2Vzbid0IGp1c3QgZmxhc2ggdGhlbiBnbyBhd2F5XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgcmVhZHlGb3JBdXRoOiB0cnVlLFxuICAgICAgICAgICAgYXV0aFRva2VuOiBhdXRoQW5zd2VyICYmIGF1dGhBbnN3ZXIuYXV0aFRva2VuLFxuICAgICAgICAgICAgb3JnYW5pemF0aW9uTmFtZTogYXV0aEFuc3dlciAmJiBhdXRoQW5zd2VyLm9yZ2FuaXphdGlvbk5hbWUsXG4gICAgICAgICAgICB1c2VybmFtZTogYXV0aEFuc3dlciAmJiBhdXRoQW5zd2VyLnVzZXJuYW1lLFxuICAgICAgICAgICAgaXNVc2VyQXV0aGVudGljYXRlZDogYXV0aEFuc3dlciAmJiBhdXRoQW5zd2VyLmlzQXV0aGVkXG4gICAgICAgICAgfSlcbiAgICAgICAgICBpZiAodGhpcy5wcm9wcy5mb2xkZXIpIHtcbiAgICAgICAgICAgIC8vIExhdW5jaCBmb2xkZXIgZGlyZWN0bHkgLSBpLmUuIGFsbG93IGEgJ3N1YmwnIGxpa2UgZXhwZXJpZW5jZSB3aXRob3V0IGhhdmluZyB0byBnb1xuICAgICAgICAgICAgLy8gdGhyb3VnaCB0aGUgcHJvamVjdHMgaW5kZXhcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmxhdW5jaEZvbGRlcihudWxsLCB0aGlzLnByb3BzLmZvbGRlciwgKGVycm9yKSA9PiB7XG4gICAgICAgICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGZvbGRlckxvYWRpbmdFcnJvcjogZXJyb3IgfSlcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jcmVhdGVOb3RpY2Uoe1xuICAgICAgICAgICAgICAgICAgdHlwZTogJ2Vycm9yJyxcbiAgICAgICAgICAgICAgICAgIHRpdGxlOiAnT2ggbm8hJyxcbiAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdXZSB3ZXJlIHVuYWJsZSB0byBvcGVuIHRoZSBmb2xkZXIuIPCfmKIgUGxlYXNlIGNsb3NlIGFuZCByZW9wZW4gdGhlIGFwcGxpY2F0aW9uIGFuZCB0cnkgYWdhaW4uIElmIHlvdSBzdGlsbCBzZWUgdGhpcyBtZXNzYWdlLCBjb250YWN0IEhhaWt1IGZvciBzdXBwb3J0LicsXG4gICAgICAgICAgICAgICAgICBjbG9zZVRleHQ6ICdPa2F5JyxcbiAgICAgICAgICAgICAgICAgIGxpZ2h0U2NoZW1lOiB0cnVlXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9XG4gICAgICAgIH0sIDEwMDApXG4gICAgICB9KVxuICAgIH0pXG4gIH1cblxuICBjb21wb25lbnRXaWxsVW5tb3VudCAoKSB7XG4gICAgdGhpcy50b3VyQ2hhbm5lbC5vZmYoJ3RvdXI6cmVxdWVzdEVsZW1lbnRDb29yZGluYXRlcycsIHRoaXMuaGFuZGxlRmluZEVsZW1lbnRDb29yZGluYXRlcylcbiAgICB0aGlzLnRvdXJDaGFubmVsLm9mZigndG91cjpyZXF1ZXN0V2Vidmlld0Nvb3JkaW5hdGVzJywgdGhpcy5oYW5kbGVGaW5kV2Vidmlld0Nvb3JkaW5hdGVzKVxuICB9XG5cbiAgaGFuZGxlRmluZEVsZW1lbnRDb29yZGluYXRlcyAoeyBzZWxlY3Rvciwgd2VidmlldyB9KSB7XG4gICAgaWYgKHdlYnZpZXcgIT09ICdjcmVhdG9yJykgeyByZXR1cm4gfVxuXG4gICAgdHJ5IHtcbiAgICAgIC8vIFRPRE86IGZpbmQgaWYgdGhlcmUgaXMgYSBiZXR0ZXIgc29sdXRpb24gdG8gdGhpcyBzY2FwZSBoYXRjaFxuICAgICAgbGV0IGVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKVxuICAgICAgbGV0IHsgdG9wLCBsZWZ0IH0gPSBlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG5cbiAgICAgIHRoaXMudG91ckNoYW5uZWwucmVjZWl2ZUVsZW1lbnRDb29yZGluYXRlcygnY3JlYXRvcicsIHsgdG9wLCBsZWZ0IH0pXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoYFtjcmVhdG9yXSBlcnJvciBmZXRjaGluZyAke3NlbGVjdG9yfSBpbiB3ZWJ2aWV3ICR7d2Vidmlld31gKVxuICAgIH1cbiAgfVxuXG4gIGhhbmRsZUZpbmRXZWJ2aWV3Q29vcmRpbmF0ZXMgKCkge1xuICAgIHRoaXMudG91ckNoYW5uZWwucmVjZWl2ZVdlYnZpZXdDb29yZGluYXRlcygnY3JlYXRvcicsIHsgdG9wOiAwLCBsZWZ0OiAwIH0pXG4gIH1cblxuICBoYW5kbGVQYW5lUmVzaXplICgpIHtcbiAgICAvLyB0aGlzLmxheW91dC5lbWl0KCdyZXNpemUnKVxuICB9XG5cbiAgcmVuZGVyTm90aWZpY2F0aW9ucyAoY29udGVudCwgaSkge1xuICAgIHJldHVybiAoXG4gICAgICA8VG9hc3RcbiAgICAgICAgdG9hc3RUeXBlPXtjb250ZW50LnR5cGV9XG4gICAgICAgIHRvYXN0VGl0bGU9e2NvbnRlbnQudGl0bGV9XG4gICAgICAgIHRvYXN0TWVzc2FnZT17Y29udGVudC5tZXNzYWdlfVxuICAgICAgICBjbG9zZVRleHQ9e2NvbnRlbnQuY2xvc2VUZXh0fVxuICAgICAgICBrZXk9e2kgKyBjb250ZW50LnRpdGxlfVxuICAgICAgICBteUtleT17aX1cbiAgICAgICAgcmVtb3ZlTm90aWNlPXt0aGlzLnJlbW92ZU5vdGljZX1cbiAgICAgICAgbGlnaHRTY2hlbWU9e2NvbnRlbnQubGlnaHRTY2hlbWV9IC8+XG4gICAgKVxuICB9XG5cbiAgc2V0RGFzaGJvYXJkVmlzaWJpbGl0eSAoZGFzaGJvYXJkVmlzaWJsZSkge1xuICAgIHRoaXMuc2V0U3RhdGUoe2Rhc2hib2FyZFZpc2libGV9KVxuICB9XG5cbiAgc3dpdGNoQWN0aXZlTmF2IChhY3RpdmVOYXYpIHtcbiAgICB0aGlzLnNldFN0YXRlKHthY3RpdmVOYXZ9KVxuXG4gICAgaWYgKGFjdGl2ZU5hdiA9PT0gJ3N0YXRlX2luc3BlY3RvcicpIHtcbiAgICAgIHRoaXMudG91ckNoYW5uZWwubmV4dCgpXG4gICAgfVxuICB9XG5cbiAgYXV0aGVudGljYXRlVXNlciAodXNlcm5hbWUsIHBhc3N3b3JkLCBjYikge1xuICAgIHJldHVybiB0aGlzLnByb3BzLndlYnNvY2tldC5yZXF1ZXN0KHsgbWV0aG9kOiAnYXV0aGVudGljYXRlVXNlcicsIHBhcmFtczogW3VzZXJuYW1lLCBwYXNzd29yZF0gfSwgKGVycm9yLCBhdXRoQW5zd2VyKSA9PiB7XG4gICAgICBpZiAoZXJyb3IpIHJldHVybiBjYihlcnJvcilcbiAgICAgIG1peHBhbmVsLm1lcmdlVG9QYXlsb2FkKHsgZGlzdGluY3RfaWQ6IHVzZXJuYW1lIH0pXG4gICAgICBtaXhwYW5lbC5oYWlrdVRyYWNrKCdjcmVhdG9yOnVzZXItYXV0aGVudGljYXRlZCcsIHsgdXNlcm5hbWUgfSlcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICB1c2VybmFtZSxcbiAgICAgICAgcGFzc3dvcmQsXG4gICAgICAgIGF1dGhUb2tlbjogYXV0aEFuc3dlciAmJiBhdXRoQW5zd2VyLmF1dGhUb2tlbixcbiAgICAgICAgb3JnYW5pemF0aW9uTmFtZTogYXV0aEFuc3dlciAmJiBhdXRoQW5zd2VyLm9yZ2FuaXphdGlvbk5hbWUsXG4gICAgICAgIGlzVXNlckF1dGhlbnRpY2F0ZWQ6IGF1dGhBbnN3ZXIgJiYgYXV0aEFuc3dlci5pc0F1dGhlZFxuICAgICAgfSlcbiAgICAgIHJldHVybiBjYihudWxsLCBhdXRoQW5zd2VyKVxuICAgIH0pXG4gIH1cblxuICBhdXRoZW50aWNhdGlvbkNvbXBsZXRlICgpIHtcbiAgICByZXR1cm4gdGhpcy5zZXRTdGF0ZSh7IGlzVXNlckF1dGhlbnRpY2F0ZWQ6IHRydWUgfSlcbiAgfVxuXG4gIHJlY2VpdmVQcm9qZWN0SW5mbyAocHJvamVjdEluZm8pIHtcbiAgICAvLyBOTy1PUFxuICB9XG5cbiAgbG9hZFByb2plY3RzIChjYikge1xuICAgIHJldHVybiB0aGlzLnByb3BzLndlYnNvY2tldC5yZXF1ZXN0KHsgbWV0aG9kOiAnbGlzdFByb2plY3RzJywgcGFyYW1zOiBbXSB9LCAoZXJyb3IsIHByb2plY3RzTGlzdCkgPT4ge1xuICAgICAgaWYgKGVycm9yKSByZXR1cm4gY2IoZXJyb3IpXG4gICAgICB0aGlzLnNldFN0YXRlKHsgcHJvamVjdHNMaXN0IH0pXG4gICAgICBpcGNSZW5kZXJlci5zZW5kKCdyZW5kZXJlcjpwcm9qZWN0cy1saXN0LWZldGNoZWQnLCBwcm9qZWN0c0xpc3QpXG4gICAgICByZXR1cm4gY2IobnVsbCwgcHJvamVjdHNMaXN0KVxuICAgIH0pXG4gIH1cblxuICBsYXVuY2hQcm9qZWN0IChwcm9qZWN0TmFtZSwgcHJvamVjdE9iamVjdCwgY2IpIHtcbiAgICBwcm9qZWN0T2JqZWN0ID0ge1xuICAgICAgc2tpcENvbnRlbnRDcmVhdGlvbjogdHJ1ZSwgLy8gVkVSWSBJTVBPUlRBTlQgLSBpZiBub3Qgc2V0IHRvIHRydWUsIHdlIGNhbiBlbmQgdXAgaW4gYSBzaXR1YXRpb24gd2hlcmUgd2Ugb3ZlcndyaXRlIGZyZXNobHkgY2xvbmVkIGNvbnRlbnQgZnJvbSB0aGUgcmVtb3RlIVxuICAgICAgcHJvamVjdHNIb21lOiBwcm9qZWN0T2JqZWN0LnByb2plY3RzSG9tZSxcbiAgICAgIHByb2plY3RQYXRoOiBwcm9qZWN0T2JqZWN0LnByb2plY3RQYXRoLFxuICAgICAgb3JnYW5pemF0aW9uTmFtZTogdGhpcy5zdGF0ZS5vcmdhbml6YXRpb25OYW1lLFxuICAgICAgYXV0aG9yTmFtZTogdGhpcy5zdGF0ZS51c2VybmFtZSxcbiAgICAgIHByb2plY3ROYW1lIC8vIEhhdmUgdG8gc2V0IHRoaXMgaGVyZSwgYmVjYXVzZSB3ZSBwYXNzIHRoaXMgd2hvbGUgb2JqZWN0IHRvIFN0YXRlVGl0bGVCYXIsIHdoaWNoIG5lZWRzIHRoaXMgdG8gcHJvcGVybHkgY2FsbCBzYXZlUHJvamVjdFxuICAgIH1cblxuICAgIG1peHBhbmVsLmhhaWt1VHJhY2soJ2NyZWF0b3I6cHJvamVjdDpsYXVuY2hpbmcnLCB7XG4gICAgICB1c2VybmFtZTogdGhpcy5zdGF0ZS51c2VybmFtZSxcbiAgICAgIHByb2plY3Q6IHByb2plY3ROYW1lLFxuICAgICAgb3JnYW5pemF0aW9uOiB0aGlzLnN0YXRlLm9yZ2FuaXphdGlvbk5hbWVcbiAgICB9KVxuXG4gICAgcmV0dXJuIHRoaXMucHJvcHMud2Vic29ja2V0LnJlcXVlc3QoeyBtZXRob2Q6ICdpbml0aWFsaXplUHJvamVjdCcsIHBhcmFtczogW3Byb2plY3ROYW1lLCBwcm9qZWN0T2JqZWN0LCB0aGlzLnN0YXRlLnVzZXJuYW1lLCB0aGlzLnN0YXRlLnBhc3N3b3JkXSB9LCAoZXJyLCBwcm9qZWN0Rm9sZGVyKSA9PiB7XG4gICAgICBpZiAoZXJyKSByZXR1cm4gY2IoZXJyKVxuXG4gICAgICByZXR1cm4gdGhpcy5wcm9wcy53ZWJzb2NrZXQucmVxdWVzdCh7IG1ldGhvZDogJ3N0YXJ0UHJvamVjdCcsIHBhcmFtczogW3Byb2plY3ROYW1lLCBwcm9qZWN0Rm9sZGVyXSB9LCAoZXJyLCBhcHBsaWNhdGlvbkltYWdlKSA9PiB7XG4gICAgICAgIGlmIChlcnIpIHJldHVybiBjYihlcnIpXG5cbiAgICAgICAgLy8gQXNzaWduLCBub3QgbWVyZ2UsIHNpbmNlIHdlIGRvbid0IHdhbnQgdG8gY2xvYmJlciBhbnkgdmFyaWFibGVzIGFscmVhZHkgc2V0LCBsaWtlIHByb2plY3QgbmFtZVxuICAgICAgICBsb2Rhc2guYXNzaWduKHByb2plY3RPYmplY3QsIGFwcGxpY2F0aW9uSW1hZ2UucHJvamVjdClcblxuICAgICAgICBtaXhwYW5lbC5oYWlrdVRyYWNrKCdjcmVhdG9yOnByb2plY3Q6bGF1bmNoZWQnLCB7XG4gICAgICAgICAgdXNlcm5hbWU6IHRoaXMuc3RhdGUudXNlcm5hbWUsXG4gICAgICAgICAgcHJvamVjdDogcHJvamVjdE5hbWUsXG4gICAgICAgICAgb3JnYW5pemF0aW9uOiB0aGlzLnN0YXRlLm9yZ2FuaXphdGlvbk5hbWVcbiAgICAgICAgfSlcblxuICAgICAgICAvLyBOb3cgaGFja2lseSBjaGFuZ2Ugc29tZSBwb2ludGVycyBzbyB3ZSdyZSByZWZlcnJpbmcgdG8gdGhlIGNvcnJlY3QgcGxhY2VcbiAgICAgICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQuZm9sZGVyID0gcHJvamVjdEZvbGRlciAvLyBEbyBub3QgcmVtb3ZlIHRoaXMgbmVjZXNzYXJ5IGhhY2sgcGx6XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyBwcm9qZWN0Rm9sZGVyLCBhcHBsaWNhdGlvbkltYWdlLCBwcm9qZWN0T2JqZWN0LCBwcm9qZWN0TmFtZSwgZGFzaGJvYXJkVmlzaWJsZTogZmFsc2UgfSlcblxuICAgICAgICByZXR1cm4gY2IoKVxuICAgICAgfSlcbiAgICB9KVxuICB9XG5cbiAgbGF1bmNoRm9sZGVyIChtYXliZVByb2plY3ROYW1lLCBwcm9qZWN0Rm9sZGVyLCBjYikge1xuICAgIG1peHBhbmVsLmhhaWt1VHJhY2soJ2NyZWF0b3I6Zm9sZGVyOmxhdW5jaGluZycsIHtcbiAgICAgIHVzZXJuYW1lOiB0aGlzLnN0YXRlLnVzZXJuYW1lLFxuICAgICAgcHJvamVjdDogbWF5YmVQcm9qZWN0TmFtZVxuICAgIH0pXG5cbiAgICAvLyBUaGUgbGF1bmNoUHJvamVjdCBtZXRob2QgaGFuZGxlcyB0aGUgcGVyZm9ybUZvbGRlclBvaW50ZXJDaGFuZ2VcbiAgICByZXR1cm4gdGhpcy5sYXVuY2hQcm9qZWN0KG1heWJlUHJvamVjdE5hbWUsIHsgcHJvamVjdFBhdGg6IHByb2plY3RGb2xkZXIgfSwgY2IpXG4gIH1cblxuICByZW1vdmVOb3RpY2UgKGluZGV4LCBpZCkge1xuICAgIGNvbnN0IG5vdGljZXMgPSB0aGlzLnN0YXRlLm5vdGljZXNcbiAgICBpZiAoaW5kZXggIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIG5vdGljZXM6IFsuLi5ub3RpY2VzLnNsaWNlKDAsIGluZGV4KSwgLi4ubm90aWNlcy5zbGljZShpbmRleCArIDEpXVxuICAgICAgfSlcbiAgICB9IGVsc2UgaWYgKGlkICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIC8vIEhhY2thcm9vXG4gICAgICBsb2Rhc2guZWFjaChub3RpY2VzLCAobm90aWNlLCBpbmRleCkgPT4ge1xuICAgICAgICBpZiAobm90aWNlLmlkID09PSBpZCkgdGhpcy5yZW1vdmVOb3RpY2UoaW5kZXgpXG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIGNyZWF0ZU5vdGljZSAobm90aWNlKSB7XG4gICAgLyogRXhwZWN0cyB0aGUgb2JqZWN0OlxuICAgIHsgdHlwZTogc3RyaW5nIChpbmZvLCBzdWNjZXNzLCBkYW5nZXIgKG9yIGVycm9yKSwgd2FybmluZylcbiAgICAgIHRpdGxlOiBzdHJpbmcsXG4gICAgICBtZXNzYWdlOiBzdHJpbmcsXG4gICAgICBjbG9zZVRleHQ6IHN0cmluZyAob3B0aW9uYWwsIGRlZmF1bHRzIHRvICdjbG9zZScpXG4gICAgICBsaWdodFNjaGVtZTogYm9vbCAob3B0aW9uYWwsIGRlZmF1bHRzIHRvIGRhcmspXG4gICAgfSAqL1xuXG4gICAgbm90aWNlLmlkID0gTWF0aC5yYW5kb20oKSArICcnXG5cbiAgICBjb25zdCBub3RpY2VzID0gdGhpcy5zdGF0ZS5ub3RpY2VzXG4gICAgbGV0IHJlcGxhY2VkRXhpc3RpbmcgPSBmYWxzZVxuXG4gICAgbm90aWNlcy5mb3JFYWNoKChuLCBpKSA9PiB7XG4gICAgICBpZiAobi5tZXNzYWdlID09PSBub3RpY2UubWVzc2FnZSkge1xuICAgICAgICBub3RpY2VzLnNwbGljZShpLCAxKVxuICAgICAgICByZXBsYWNlZEV4aXN0aW5nID0gdHJ1ZVxuICAgICAgICB0aGlzLnNldFN0YXRlKHsgbm90aWNlcyB9LCAoKSA9PiB7XG4gICAgICAgICAgbm90aWNlcy51bnNoaWZ0KG5vdGljZSlcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgbm90aWNlcyB9KVxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH0pXG5cbiAgICBpZiAoIXJlcGxhY2VkRXhpc3RpbmcpIHtcbiAgICAgIG5vdGljZXMudW5zaGlmdChub3RpY2UpXG4gICAgICB0aGlzLnNldFN0YXRlKHsgbm90aWNlcyB9KVxuICAgIH1cblxuICAgIHJldHVybiBub3RpY2VcbiAgfVxuXG4gIG9uTGlicmFyeURyYWdFbmQgKGRyYWdFbmROYXRpdmVFdmVudCwgbGlicmFyeUl0ZW1JbmZvKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7IGxpYnJhcnlJdGVtRHJhZ2dpbmc6IG51bGwgfSlcbiAgICBpZiAobGlicmFyeUl0ZW1JbmZvICYmIGxpYnJhcnlJdGVtSW5mby5wcmV2aWV3KSB7XG4gICAgICB0aGlzLnJlZnMuc3RhZ2UuaGFuZGxlRHJvcChsaWJyYXJ5SXRlbUluZm8sIHRoaXMuX2xhc3RNb3VzZVgsIHRoaXMuX2xhc3RNb3VzZVkpXG4gICAgfVxuICB9XG5cbiAgb25MaWJyYXJ5RHJhZ1N0YXJ0IChkcmFnU3RhcnROYXRpdmVFdmVudCwgbGlicmFyeUl0ZW1JbmZvKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7IGxpYnJhcnlJdGVtRHJhZ2dpbmc6IGxpYnJhcnlJdGVtSW5mbyB9KVxuICB9XG5cbiAgcmVuZGVyU3RhcnR1cERlZmF1bHRTY3JlZW4gKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IHN0eWxlPXt7IHBvc2l0aW9uOiAnYWJzb2x1dGUnLCB3aWR0aDogJzEwMCUnLCBoZWlnaHQ6ICcxMDAlJyB9fT5cbiAgICAgICAgPFJlYWN0Q1NTVHJhbnNpdGlvbkdyb3VwXG4gICAgICAgICAgdHJhbnNpdGlvbk5hbWU9J3RvYXN0J1xuICAgICAgICAgIHRyYW5zaXRpb25FbnRlclRpbWVvdXQ9ezUwMH1cbiAgICAgICAgICB0cmFuc2l0aW9uTGVhdmVUaW1lb3V0PXszMDB9PlxuICAgICAgICAgIDxkaXYgc3R5bGU9e3twb3NpdGlvbjogJ2Fic29sdXRlJywgcmlnaHQ6IDAsIHRvcDogMCwgd2lkdGg6IDMwMH19PlxuICAgICAgICAgICAge2xvZGFzaC5tYXAodGhpcy5zdGF0ZS5ub3RpY2VzLCB0aGlzLnJlbmRlck5vdGlmaWNhdGlvbnMpfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L1JlYWN0Q1NTVHJhbnNpdGlvbkdyb3VwPlxuICAgICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6ICd0YWJsZScsIHdpZHRoOiAnMTAwJScsIGhlaWdodDogJzEwMCUnLCBwb3NpdGlvbjogJ2Fic29sdXRlJywgdG9wOiAwLCBsZWZ0OiAwIH19PlxuICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ3RhYmxlLWNlbGwnLCB3aWR0aDogJzEwMCUnLCBoZWlnaHQ6ICcxMDAlJywgdmVydGljYWxBbGlnbjogJ21pZGRsZScsIHRleHRBbGlnbjogJ2NlbnRlcicgfX0+XG4gICAgICAgICAgICA8c3ZnIHdpZHRoPScxNzBweCcgaGVpZ2h0PScyMjFweCcgdmlld0JveD0nMCAwIDE3MCAyMjEnIHZlcnNpb249JzEuMSc+XG4gICAgICAgICAgICAgIDxnIGlkPSdQYWdlLTEnIHN0cm9rZT0nbm9uZScgc3Ryb2tlV2lkdGg9JzEnIGZpbGw9J25vbmUnIGZpbGxSdWxlPSdldmVub2RkJz5cbiAgICAgICAgICAgICAgICA8ZyBpZD0nT3V0bGluZWQnIHRyYW5zZm9ybT0ndHJhbnNsYXRlKC0yMTEuMDAwMDAwLCAtMTE0LjAwMDAwMCknIGZpbGxSdWxlPSdub256ZXJvJyBmaWxsPScjRkFGQ0ZEJz5cbiAgICAgICAgICAgICAgICAgIDxnIGlkPSdvdXRsaW5lZC1sb2dvJyB0cmFuc2Zvcm09J3RyYW5zbGF0ZSgyMTEuMDAwMDAwLCAxMTMuMDAwMDAwKSc+XG4gICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9J000Ny41LDE1Mi43OTg4MjMgTDI2LjM4MjM0MzIsMTQzLjk1NDY3NiBDMjQuNTk5Mzk0MSwxNDMuMjA3OTcxIDIzLjc1OTM1MjQsMTQxLjE1NzI4MSAyNC41MDYwNTc2LDEzOS4zNzQzMzIgQzI1LjI1Mjc2MjgsMTM3LjU5MTM4MyAyNy4zMDM0NTI3LDEzNi43NTEzNDEgMjkuMDg2NDAxOCwxMzcuNDk4MDQ2IEwxMTcuNzgwMDU4LDE3NC42NDQ1NiBMMTIwLjk5MDAyMSwxNzYuMDg5MDc0IEMxMjIuNDg2ODE0LDE3Ni43NjI2NDUgMTIzLjI3OTMwNCwxNzguMzU4MjUxIDEyMi45OTg2OTgsMTc5LjkwMzU5OCBDMTIyLjk5OTU2NCwxNzkuOTM1NjI2IDEyMywxNzkuOTY3NzYyIDEyMywxODAgTDEyMywyMDUuNjM5NzIyIEwxMzguNTEwNzE2LDIxMS45MTAwMTEgTDE0My4zNjg0MjEsMjEzLjg3Mzc2NCBMMTYyLjgzMzMzMywyMDYuMDA0OTcgTDE2Mi44MzMzMzMsMTYuMjkyOTAyNSBMMTQzLDguMjc1MTcyMDQgTDEyMi44MzMzMzMsMTYuNDI3NjU0MyBMMTIyLjgzMzMzMyw1My42MDEzMjk1IEMxMjIuODM0MjE4LDUzLjY0NjY0ODkgMTIyLjgzNDIxNSw1My42OTE5MDE1IDEyMi44MzMzMzMsNTMuNzM3MDYzNCBMMTIyLjgzMzMzMyw1NCBDMTIyLjgzMzMzMyw1NS45MzI5OTY2IDEyMS4yNjYzMyw1Ny41IDExOS4zMzMzMzMsNTcuNSBDMTE5LjI4ODQzLDU3LjUgMTE5LjI0MzcyNCw1Ny40OTkxNTQ0IDExOS4xOTkyMyw1Ny40OTc0NzgyIEw1My4zMDc2MzgsODQuMDM3MTQ5IEM1MS41MTQ2MTgzLDg0Ljc1OTMzNzUgNDkuNDc1NjM5Miw4My44OTEyNTczIDQ4Ljc1MzQ1MDYsODIuMDk4MjM3NiBDNDguMDMxMjYyMSw4MC4zMDUyMTc5IDQ4Ljg5OTM0MjMsNzguMjY2MjM4OCA1MC42OTIzNjIsNzcuNTQ0MDUwMiBMMTE1LjgzMzMzMyw1MS4zMDY3MTI5IEwxMTUuODMzMzMzLDE0LjQ5NzQyMjcgQzExNS44MzMzMzMsMTQuMDE0MzE3OCAxMTUuOTMxMjEzLDEzLjU1NDA3MzkgMTE2LjEwODIyMiwxMy4xMzU0Mzk5IEMxMTYuMzc0NTM5LDEyLjA5NDEyOTIgMTE3LjExNTMyNiwxMS4xODg4NDQ5IDExOC4xODgyMzgsMTAuNzU1MTE0OCBMMTQxLjY4NDE4NiwxLjI1Njc1MjcgQzE0Mi4wOTEzMTcsMS4wOTE1MjkzNiAxNDIuNTI5NTksMS4wMDI0MDQ2NyAxNDIuOTc1OTM3LDAuOTk5MTY0NzIzIEMxNDMuNDcwNDEsMS4wMDI0MDQ2NyAxNDMuOTA4NjgzLDEuMDkxNTI5MzYgMTQ0LjMxNTgxNCwxLjI1Njc1MjcgTDE2Ny44MTE3NjIsMTAuNzU1MTE0OCBDMTY5LjUyMjk2OCwxMS40NDY4NzkgMTcwLjM4OTMyOCwxMy4zMzgxNjU5IDE2OS44MzMzMzMsMTUuMDY3NzA2OCBMMTY5LjgzMzMzMywyMDggQzE2OS44MzMzMzMsMjA4LjgyNjMwNCAxNjkuNTQ2OTksMjA5LjU4NTcyOCAxNjkuMDY4MTE4LDIxMC4xODQ0NTkgQzE2OC42OTM3MDMsMjEwLjg2NzM3OCAxNjguMDkwMTMzLDIxMS40MzAyMjQgMTY3LjMxMTc2MiwyMTEuNzQ0ODg1IEwxNDQuNTE3NjQ1LDIyMC45NTk1MjggQzE0My4zMzI1NDIsMjIxLjQzODYxMyAxNDIuMDM4OTk1LDIyMS4yMjIzOTcgMTQxLjA4OTE3OSwyMjAuNTAyNzEyIEwxMzUuODg3MTkyLDIxOC4zOTk3ODIgTDExOS40NjE1OTUsMjExLjc1OTY0NyBDMTE3LjU0NjI5LDIxMS43MzkwNTUgMTE2LDIxMC4xODAwMzIgMTE2LDIwOC4yNTk4NTMgTDExNiwyMDguMDc5MTEgQzExNS45OTg3NjcsMjA4LjAyNTcwOCAxMTUuOTk4NzYxLDIwNy45NzIxNzggMTE2LDIwNy45MTg1NTggTDExNiwxODEuNTE4NzQ4IEwxMTQuOTkxNzI3LDE4MS4wNjQ1ODkgTDU0LjUsMTU1LjczMDQ0NyBMNTQuNSwyMDYuOTk4MjczIEM1NS4xMzQxNDY4LDIwOC42NTgyNTYgNTQuNDE5NTMxNSwyMTAuNTEyOTE1IDUyLjg3OTY2NDUsMjExLjMzMzMzMyBDNTIuNTU0NTU0NiwyMTEuNTQwNzA5IDUyLjE5MjkwNCwyMTEuNjk1ODY5IDUxLjgwNjUyOTQsMjExLjc4Njk5NyBMMjkuNzg2NzM3NSwyMjAuNjUwNjU1IEMyOC44MjUyNTM1LDIyMS40Nzg3NTggMjcuNDQ1NzAwNSwyMjEuNzUzMjIxIDI2LjE4ODIzNzksMjIxLjI0NDg4NSBMMjAuMzg3MTkyMSwyMTguODk5NzgyIEwzLjMwNjI3NzgzLDIxMS45OTQ3MzEgQzEuNDYzMzgxODksMjExLjg5NDE5MiAtMi42MDgzNTk5NWUtMTYsMjEwLjM2Nzk5MiAwLDIwOC41IEwyLjcwODk0NDE4ZS0xNCwxNC40OTc0MjI3IEMyLjcyNDI0NWUtMTQsMTMuNDAxNjQ1OCAwLjUwMzU2MDk0NywxMi40MjM0ODE4IDEuMjkxODk2NjksMTEuNzgxNzE3IEMxLjY1MTcxMDE0LDExLjM0MTY1MDkgMi4xMjQwNTYyMiwxMC45ODMxODgyIDIuNjg4MjM3ODksMTAuNzU1MTE0OCBMMjYuMTg0MTg2MiwxLjI1Njc1MjcgQzI2LjU5MTMxNzIsMS4wOTE1MjkzNiAyNy4wMjk1ODk4LDEuMDAyNDA0NjcgMjcuNDc1OTM2NywwLjk5OTE2NDcyMyBDMjcuOTcwNDEwMiwxLjAwMjQwNDY3IDI4LjQwODY4MjgsMS4wOTE1MjkzNiAyOC44MTU4MTM4LDEuMjU2NzUyNyBMNTIuMzExNzYyMSwxMC43NTUxMTQ4IEM1NC4xMDM4NjI3LDExLjQ3OTU4MSA1NC45NjkzNTE0LDEzLjUxOTY2MTUgNTQuMjQ0ODg1MiwxNS4zMTE3NjIxIEM1My41MjA0MTksMTcuMTAzODYyNyA1MS40ODAzMzg1LDE3Ljk2OTM1MTQgNDkuNjg4MjM3OSwxNy4yNDQ4ODUyIEwyNy41LDguMjc1MTcyMDQgTDcsMTYuNTYyNDA2MSBMNywyMDUuOTM3NTk0IEwyMy4wMTA3MTY0LDIxMi40MTAwMTEgTDI3LjI1MjY5OTUsMjE0LjEyNDg1NSBMNDcuNSwyMDUuOTc0NjgxIEw0Ny41LDE1Mi43OTg4MjMgWicgaWQ9J0NvbWJpbmVkLVNoYXBlJyAvPlxuICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSdNMTQ2LjQ1NjgyNyw2My4wMjQxODQ5IEMxNDYuOTQ4NjAzLDY0LjcxMDQ3MjQgMTQ2LjEwNTk3Miw2Ni41MzM2NTkxIDE0NC40NDczMDUsNjcuMjI4MzE0OSBMNTkuNTQ2ODY3NywxMDIuNzg0OTA4IEwxMjAuNDE2NTc1LDEyOC4yNzczNSBDMTIyLjE5OTUyNCwxMjkuMDI0MDU1IDEyMy4wMzk1NjYsMTMxLjA3NDc0NSAxMjIuMjkyODYxLDEzMi44NTc2OTQgQzEyMS41NDYxNTYsMTM0LjY0MDY0MyAxMTkuNDk1NDY2LDEzNS40ODA2ODUgMTE3LjcxMjUxNywxMzQuNzMzOTc5IEw1MC40ODY0MTMxLDEwNi41Nzk0NTcgTDI5LjM1MjAyOTMsMTE1LjQzMDYxIEMyNy41NjkwODAyLDExNi4xNzczMTUgMjUuNTE4MzkwMywxMTUuMzM3MjczIDI0Ljc3MTY4NTEsMTEzLjU1NDMyNCBDMjQuMDI0OTgsMTExLjc3MTM3NSAyNC44NjUwMjE2LDEwOS43MjA2ODUgMjYuNjQ3OTcwNywxMDguOTczOTggTDQ3LjUsMTAwLjI0MTA3OSBMNDcuNSwxNC41IEM0Ny41LDEyLjU2NzAwMzQgNDkuMDY3MDAzNCwxMSA1MSwxMSBDNTIuOTMyOTk2NiwxMSA1NC41LDEyLjU2NzAwMzQgNTQuNSwxNC41IEw1NC41LDk3LjMwOTQ1NDggTDEzMy4zNjAyNTcsNjQuMjgyNTA5OCBMMTE3LjE4ODIzOCw1Ny43NDQ4ODUyIEMxMTUuMzk2MTM3LDU3LjAyMDQxOSAxMTQuNTMwNjQ5LDU0Ljk4MDMzODUgMTE1LjI1NTExNSw1My4xODgyMzc5IEMxMTUuOTc5NTgxLDUxLjM5NjEzNzMgMTE4LjAxOTY2MSw1MC41MzA2NDg2IDExOS44MTE3NjIsNTEuMjU1MTE0OCBMMTM5LjUsNTkuMjE0MTg5NyBMMTM5LjUsMjUuODYwMjc4NCBMMTM1Ljg4NzE5MiwyNC4zOTk3ODE2IEwxMTguMTg4MjM4LDE3LjI0NDg4NTIgQzExNi4zOTYxMzcsMTYuNTIwNDE5IDExNS41MzA2NDksMTQuNDgwMzM4NSAxMTYuMjU1MTE1LDEyLjY4ODIzNzkgQzExNi45Nzk1ODEsMTAuODk2MTM3MyAxMTkuMDE5NjYxLDEwLjAzMDY0ODYgMTIwLjgxMTc2MiwxMC43NTUxMTQ4IEwxMzguNTEwNzE2LDE3LjkxMDAxMTIgTDE0My4zNjg0MjEsMTkuODczNzY0MSBMMTY0LjY4ODIzOCwxMS4yNTUxMTQ4IEMxNjYuNDgwMzM5LDEwLjUzMDY0ODYgMTY4LjUyMDQxOSwxMS4zOTYxMzczIDE2OS4yNDQ4ODUsMTMuMTg4MjM3OSBDMTY5Ljk2OTM1MSwxNC45ODAzMzg1IDE2OS4xMDM4NjMsMTcuMDIwNDE5IDE2Ny4zMTE3NjIsMTcuNzQ0ODg1MiBMMTQ2LjUsMjYuMTU4MTUwOCBMMTQ2LjUsNjIuNDcyODc0OSBDMTQ2LjUsNjIuNjYwNDU3NCAxNDYuNDg1MjQzLDYyLjg0NDU5MzMgMTQ2LjQ1NjgyNyw2My4wMjQxODQ5IFonIGlkPSdDb21iaW5lZC1TaGFwZScgLz5cbiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0nTTEzOS41LDk2LjMzMDgwNjkgTDEyMi44MzMzMzMsMTAzLjMxMDg2NCBMMTIyLjgzMzMzMywxNTEuMzcyNzk5IEMxMjIuODMzMzMzLDE1My4zMDU3OTUgMTIxLjI2NjMzLDE1NC44NzI3OTkgMTE5LjMzMzMzMywxNTQuODcyNzk5IEMxMTguNTM1NzE5LDE1NC44NzI3OTkgMTE3LjgwMDQyLDE1NC42MDU5OTQgMTE3LjIxMTgxNiwxNTQuMTU2NzYzIEwyNi42NDc5NzA3LDExNi4yMjgzMTUgQzI2LjA5NzY3MDYsMTE1Ljk5Nzg0NyAyNS42MzcxOTQsMTE1LjY0MzE1OSAyNS4yODU0NzE0LDExNS4yMTA0NjIgQzI0LjUwMDgyNTgsMTE0LjU2ODYyIDI0LDExMy41OTI3OTcgMjQsMTEyLjUgTDI0LDI1Ljg2MDI3ODQgTDIwLjM4NzE5MjEsMjQuMzk5NzgxNiBMMi42ODgyMzc4OSwxNy4yNDQ4ODUyIEMwLjg5NjEzNzI1OCwxNi41MjA0MTkgMC4wMzA2NDg1NTg5LDE0LjQ4MDMzODUgMC43NTUxMTQ3NywxMi42ODgyMzc5IEMxLjQ3OTU4MDk4LDEwLjg5NjEzNzMgMy41MTk2NjE0OSwxMC4wMzA2NDg2IDUuMzExNzYyMTEsMTAuNzU1MTE0OCBMMjMuMDEwNzE2NCwxNy45MTAwMTEyIEwyNy44Njg0MjExLDE5Ljg3Mzc2NDEgTDQ5LjE4ODIzNzksMTEuMjU1MTE0OCBDNTAuOTgwMzM4NSwxMC41MzA2NDg2IDUzLjAyMDQxOSwxMS4zOTYxMzczIDUzLjc0NDg4NTIsMTMuMTg4MjM3OSBDNTQuNDY5MzUxNCwxNC45ODAzMzg1IDUzLjYwMzg2MjcsMTcuMDIwNDE5IDUxLjgxMTc2MjEsMTcuNzQ0ODg1MiBMMzEsMjYuMTU4MTUwOCBMMzEsMTEwLjQ2MTg2MSBMMTE1LjgzMzMzMywxNDUuOTkwMzUxIEwxMTUuODMzMzMzLDEwNi4yNDI0ODggTDg0LjI1OTY2MTYsMTE5LjQ2NTY0OSBDODIuNDc2NzEyNSwxMjAuMjEyMzU1IDgwLjQyNjAyMjYsMTE5LjM3MjMxMyA3OS42NzkzMTc0LDExNy41ODkzNjQgQzc4LjkzMjYxMjMsMTE1LjgwNjQxNSA3OS43NzI2NTM5LDExMy43NTU3MjUgODEuNTU1NjAzLDExMy4wMDkwMiBMMTQxLjA1MjE1MSw4OC4wOTE2NjIyIEMxNDEuNjA4OTc0LDg3LjcxNzk5MyAxNDIuMjc5MDMsODcuNSAxNDMsODcuNSBDMTQ0LjkzMjk5Nyw4Ny41IDE0Ni41LDg5LjA2NzAwMzQgMTQ2LjUsOTEgTDE0Ni41LDIxNy42MzA0OCBDMTQ2LjUsMjE5LjU2MzQ3NyAxNDQuOTMyOTk3LDIyMS4xMzA0OCAxNDMsMjIxLjEzMDQ4IEMxNDEuMDY3MDAzLDIyMS4xMzA0OCAxMzkuNSwyMTkuNTYzNDc3IDEzOS41LDIxNy42MzA0OCBMMTM5LjUsOTYuMzMwODA2OSBaIE0zMSwxNDEgTDMxLDIxNy4wNTUyMzcgQzMxLDIxOC45ODgyMzQgMjkuNDMyOTk2NiwyMjAuNTU1MjM3IDI3LjUsMjIwLjU1NTIzNyBDMjUuNTY3MDAzNCwyMjAuNTU1MjM3IDI0LDIxOC45ODgyMzQgMjQsMjE3LjA1NTIzNyBMMjQsMTQxIEMyNCwxMzkuMDY3MDAzIDI1LjU2NzAwMzQsMTM3LjUgMjcuNSwxMzcuNSBDMjkuNDMyOTk2NiwxMzcuNSAzMSwxMzkuMDY3MDAzIDMxLDE0MSBaJyBpZD0nQ29tYmluZWQtU2hhcGUnIC8+XG4gICAgICAgICAgICAgICAgICA8L2c+XG4gICAgICAgICAgICAgICAgPC9nPlxuICAgICAgICAgICAgICA8L2c+XG4gICAgICAgICAgICA8L3N2Zz5cbiAgICAgICAgICAgIDxiciAvPlxuICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgY29sb3I6ICcjRkFGQ0ZEJywgZGlzcGxheTogJ2lubGluZS1ibG9jaycsIHdpZHRoOiAnMTAwJScsIGhlaWdodDogNTAsIHBvc2l0aW9uOiAnYWJzb2x1dGUnLCBib3R0b206IDUwLCBsZWZ0OiAwIH19Pnt0aGlzLnN0YXRlLnNvZnR3YXJlVmVyc2lvbn08L3NwYW4+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyICgpIHtcbiAgICBpZiAodGhpcy5zdGF0ZS5yZWFkeUZvckF1dGggJiYgKCF0aGlzLnN0YXRlLmlzVXNlckF1dGhlbnRpY2F0ZWQgfHwgIXRoaXMuc3RhdGUudXNlcm5hbWUpKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8U3R5bGVSb290PlxuICAgICAgICAgIDxBdXRoZW50aWNhdGlvblVJXG4gICAgICAgICAgICBvblN1Ym1pdD17dGhpcy5hdXRoZW50aWNhdGVVc2VyfVxuICAgICAgICAgICAgb25TdWJtaXRTdWNjZXNzPXt0aGlzLmF1dGhlbnRpY2F0aW9uQ29tcGxldGV9XG4gICAgICAgICAgICB7Li4udGhpcy5wcm9wc30gLz5cbiAgICAgICAgPC9TdHlsZVJvb3Q+XG4gICAgICApXG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLnN0YXRlLmlzVXNlckF1dGhlbnRpY2F0ZWQgfHwgIXRoaXMuc3RhdGUudXNlcm5hbWUpIHtcbiAgICAgIHJldHVybiB0aGlzLnJlbmRlclN0YXJ0dXBEZWZhdWx0U2NyZWVuKClcbiAgICB9XG5cbiAgICBpZiAodGhpcy5zdGF0ZS5kYXNoYm9hcmRWaXNpYmxlKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIDxQcm9qZWN0QnJvd3NlclxuICAgICAgICAgICAgbG9hZFByb2plY3RzPXt0aGlzLmxvYWRQcm9qZWN0c31cbiAgICAgICAgICAgIGxhdW5jaFByb2plY3Q9e3RoaXMubGF1bmNoUHJvamVjdH1cbiAgICAgICAgICAgIGNyZWF0ZU5vdGljZT17dGhpcy5jcmVhdGVOb3RpY2V9XG4gICAgICAgICAgICByZW1vdmVOb3RpY2U9e3RoaXMucmVtb3ZlTm90aWNlfVxuICAgICAgICAgICAgbm90aWNlcz17dGhpcy5zdGF0ZS5ub3RpY2VzfVxuICAgICAgICAgICAgZW52b3k9e3RoaXMuZW52b3l9XG4gICAgICAgICAgICB7Li4udGhpcy5wcm9wc30gLz5cbiAgICAgICAgICA8VG91ciBwcm9qZWN0c0xpc3Q9e3RoaXMuc3RhdGUucHJvamVjdHNMaXN0fSBlbnZveT17dGhpcy5lbnZveX0gc3RhcnRUb3VyT25Nb3VudCAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIClcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuc3RhdGUucHJvamVjdEZvbGRlcikge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdj5cbiAgICAgICAgICA8VG91ciBwcm9qZWN0c0xpc3Q9e3RoaXMuc3RhdGUucHJvamVjdHNMaXN0fSBlbnZveT17dGhpcy5lbnZveX0gLz5cbiAgICAgICAgICA8UHJvamVjdEJyb3dzZXJcbiAgICAgICAgICAgIGxvYWRQcm9qZWN0cz17dGhpcy5sb2FkUHJvamVjdHN9XG4gICAgICAgICAgICBsYXVuY2hQcm9qZWN0PXt0aGlzLmxhdW5jaFByb2plY3R9XG4gICAgICAgICAgICBjcmVhdGVOb3RpY2U9e3RoaXMuY3JlYXRlTm90aWNlfVxuICAgICAgICAgICAgcmVtb3ZlTm90aWNlPXt0aGlzLnJlbW92ZU5vdGljZX1cbiAgICAgICAgICAgIG5vdGljZXM9e3RoaXMuc3RhdGUubm90aWNlc31cbiAgICAgICAgICAgIGVudm95PXt0aGlzLmVudm95fVxuICAgICAgICAgICAgey4uLnRoaXMucHJvcHN9IC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKVxuICAgIH1cblxuICAgIGlmICghdGhpcy5zdGF0ZS5hcHBsaWNhdGlvbkltYWdlIHx8IHRoaXMuc3RhdGUuZm9sZGVyTG9hZGluZ0Vycm9yKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IHN0eWxlPXt7IHBvc2l0aW9uOiAnYWJzb2x1dGUnLCB3aWR0aDogJzEwMCUnLCBoZWlnaHQ6ICcxMDAlJyB9fT5cbiAgICAgICAgICA8UmVhY3RDU1NUcmFuc2l0aW9uR3JvdXBcbiAgICAgICAgICAgIHRyYW5zaXRpb25OYW1lPSd0b2FzdCdcbiAgICAgICAgICAgIHRyYW5zaXRpb25FbnRlclRpbWVvdXQ9ezUwMH1cbiAgICAgICAgICAgIHRyYW5zaXRpb25MZWF2ZVRpbWVvdXQ9ezMwMH0+XG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt7cG9zaXRpb246ICdhYnNvbHV0ZScsIHJpZ2h0OiAwLCB0b3A6IDAsIHdpZHRoOiAzMDB9fT5cbiAgICAgICAgICAgICAge2xvZGFzaC5tYXAodGhpcy5zdGF0ZS5ub3RpY2VzLCB0aGlzLnJlbmRlck5vdGlmaWNhdGlvbnMpfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9SZWFjdENTU1RyYW5zaXRpb25Hcm91cD5cbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7IHBvc2l0aW9uOiAncmVsYXRpdmUnLCB3aWR0aDogJzEwMCUnLCBoZWlnaHQ6ICcxMDAlJyB9fT5cbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgcG9zaXRpb246ICdhYnNvbHV0ZScsIHRvcDogJzUwJScsIGxlZnQ6ICc1MCUnLCB0cmFuc2Zvcm06ICd0cmFuc2xhdGUoLTUwJSwgLTUwJSknIH19PlxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBmb250U2l6ZTogMjQsIGNvbG9yOiAnIzIyMicgfX0+TG9hZGluZyBwcm9qZWN0Li4uPC9zcGFuPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKVxuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IHN0eWxlPXt7IHBvc2l0aW9uOiAncmVsYXRpdmUnLCB3aWR0aDogJzEwMCUnLCBoZWlnaHQ6ICcxMDAlJyB9fT5cbiAgICAgICAgPFRvdXIgcHJvamVjdHNMaXN0PXt0aGlzLnN0YXRlLnByb2plY3RzTGlzdH0gZW52b3k9e3RoaXMuZW52b3l9IC8+XG4gICAgICAgIDxkaXYgc3R5bGU9e3sgcG9zaXRpb246ICdhYnNvbHV0ZScsIHdpZHRoOiAnMTAwJScsIGhlaWdodDogJzEwMCUnLCB0b3A6IDAsIGxlZnQ6IDAgfX0+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9J2xheW91dC1ib3gnIHN0eWxlPXt7b3ZlcmZsb3c6ICd2aXNpYmxlJ319PlxuICAgICAgICAgICAgPFJlYWN0Q1NTVHJhbnNpdGlvbkdyb3VwXG4gICAgICAgICAgICAgIHRyYW5zaXRpb25OYW1lPSd0b2FzdCdcbiAgICAgICAgICAgICAgdHJhbnNpdGlvbkVudGVyVGltZW91dD17NTAwfVxuICAgICAgICAgICAgICB0cmFuc2l0aW9uTGVhdmVUaW1lb3V0PXszMDB9PlxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7cG9zaXRpb246ICdhYnNvbHV0ZScsIHJpZ2h0OiAwLCB0b3A6IDAsIHdpZHRoOiAzMDB9fT5cbiAgICAgICAgICAgICAgICB7bG9kYXNoLm1hcCh0aGlzLnN0YXRlLm5vdGljZXMsIHRoaXMucmVuZGVyTm90aWZpY2F0aW9ucyl9XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9SZWFjdENTU1RyYW5zaXRpb25Hcm91cD5cbiAgICAgICAgICAgIDxTcGxpdFBhbmUgb25EcmFnRmluaXNoZWQ9e3RoaXMuaGFuZGxlUGFuZVJlc2l6ZS5iaW5kKHRoaXMpfSBzcGxpdD0naG9yaXpvbnRhbCcgbWluU2l6ZT17MzAwfSBkZWZhdWx0U2l6ZT17dGhpcy5wcm9wcy5oZWlnaHQgKiAwLjYyfT5cbiAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8U3BsaXRQYW5lIG9uRHJhZ0ZpbmlzaGVkPXt0aGlzLmhhbmRsZVBhbmVSZXNpemUuYmluZCh0aGlzKX0gc3BsaXQ9J3ZlcnRpY2FsJyBtaW5TaXplPXszMDB9IGRlZmF1bHRTaXplPXszMDB9PlxuICAgICAgICAgICAgICAgICAgPFNpZGVCYXJcbiAgICAgICAgICAgICAgICAgICAgc2V0RGFzaGJvYXJkVmlzaWJpbGl0eT17dGhpcy5zZXREYXNoYm9hcmRWaXNpYmlsaXR5LmJpbmQodGhpcyl9XG4gICAgICAgICAgICAgICAgICAgIHN3aXRjaEFjdGl2ZU5hdj17dGhpcy5zd2l0Y2hBY3RpdmVOYXYuYmluZCh0aGlzKX1cbiAgICAgICAgICAgICAgICAgICAgYWN0aXZlTmF2PXt0aGlzLnN0YXRlLmFjdGl2ZU5hdn0+XG4gICAgICAgICAgICAgICAgICAgIHt0aGlzLnN0YXRlLmFjdGl2ZU5hdiA9PT0gJ2xpYnJhcnknXG4gICAgICAgICAgICAgICAgICAgICAgPyA8TGlicmFyeVxuICAgICAgICAgICAgICAgICAgICAgICAgbGF5b3V0PXt0aGlzLmxheW91dH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGZvbGRlcj17dGhpcy5zdGF0ZS5wcm9qZWN0Rm9sZGVyfVxuICAgICAgICAgICAgICAgICAgICAgICAgaGFpa3U9e3RoaXMucHJvcHMuaGFpa3V9XG4gICAgICAgICAgICAgICAgICAgICAgICB3ZWJzb2NrZXQ9e3RoaXMucHJvcHMud2Vic29ja2V0fVxuICAgICAgICAgICAgICAgICAgICAgICAgdG91ckNoYW5uZWw9e3RoaXMudG91ckNoYW5uZWx9XG4gICAgICAgICAgICAgICAgICAgICAgICBvbkRyYWdFbmQ9e3RoaXMub25MaWJyYXJ5RHJhZ0VuZC5iaW5kKHRoaXMpfVxuICAgICAgICAgICAgICAgICAgICAgICAgb25EcmFnU3RhcnQ9e3RoaXMub25MaWJyYXJ5RHJhZ1N0YXJ0LmJpbmQodGhpcyl9XG4gICAgICAgICAgICAgICAgICAgICAgICBjcmVhdGVOb3RpY2U9e3RoaXMuY3JlYXRlTm90aWNlfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmVtb3ZlTm90aWNlPXt0aGlzLnJlbW92ZU5vdGljZX0gLz5cbiAgICAgICAgICAgICAgICAgICAgICA6IDxTdGF0ZUluc3BlY3RvclxuICAgICAgICAgICAgICAgICAgICAgICAgY3JlYXRlTm90aWNlPXt0aGlzLmNyZWF0ZU5vdGljZX1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJlbW92ZU5vdGljZT17dGhpcy5yZW1vdmVOb3RpY2V9XG4gICAgICAgICAgICAgICAgICAgICAgICBmb2xkZXI9e3RoaXMuc3RhdGUucHJvamVjdEZvbGRlcn1cbiAgICAgICAgICAgICAgICAgICAgICAgIHdlYnNvY2tldD17dGhpcy5wcm9wcy53ZWJzb2NrZXR9XG4gICAgICAgICAgICAgICAgICAgICAgICB0b3VyQ2hhbm5lbD17dGhpcy50b3VyQ2hhbm5lbH0gLz5cbiAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICA8L1NpZGVCYXI+XG4gICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7cG9zaXRpb246ICdyZWxhdGl2ZScsIHdpZHRoOiAnMTAwJScsIGhlaWdodDogJzEwMCUnfX0+XG4gICAgICAgICAgICAgICAgICAgIDxTdGFnZVxuICAgICAgICAgICAgICAgICAgICAgIHJlZj0nc3RhZ2UnXG4gICAgICAgICAgICAgICAgICAgICAgZm9sZGVyPXt0aGlzLnN0YXRlLnByb2plY3RGb2xkZXJ9XG4gICAgICAgICAgICAgICAgICAgICAgZW52b3k9e3RoaXMuZW52b3l9XG4gICAgICAgICAgICAgICAgICAgICAgaGFpa3U9e3RoaXMucHJvcHMuaGFpa3V9XG4gICAgICAgICAgICAgICAgICAgICAgd2Vic29ja2V0PXt0aGlzLnByb3BzLndlYnNvY2tldH1cbiAgICAgICAgICAgICAgICAgICAgICBwcm9qZWN0PXt0aGlzLnN0YXRlLnByb2plY3RPYmplY3R9XG4gICAgICAgICAgICAgICAgICAgICAgY3JlYXRlTm90aWNlPXt0aGlzLmNyZWF0ZU5vdGljZX1cbiAgICAgICAgICAgICAgICAgICAgICByZW1vdmVOb3RpY2U9e3RoaXMucmVtb3ZlTm90aWNlfVxuICAgICAgICAgICAgICAgICAgICAgIHJlY2VpdmVQcm9qZWN0SW5mbz17dGhpcy5yZWNlaXZlUHJvamVjdEluZm99XG4gICAgICAgICAgICAgICAgICAgICAgb3JnYW5pemF0aW9uTmFtZT17dGhpcy5zdGF0ZS5vcmdhbml6YXRpb25OYW1lfVxuICAgICAgICAgICAgICAgICAgICAgIGF1dGhUb2tlbj17dGhpcy5zdGF0ZS5hdXRoVG9rZW59XG4gICAgICAgICAgICAgICAgICAgICAgdXNlcm5hbWU9e3RoaXMuc3RhdGUudXNlcm5hbWV9XG4gICAgICAgICAgICAgICAgICAgICAgcGFzc3dvcmQ9e3RoaXMuc3RhdGUucGFzc3dvcmR9IC8+XG4gICAgICAgICAgICAgICAgICAgIHsodGhpcy5zdGF0ZS5saWJyYXJ5SXRlbURyYWdnaW5nKVxuICAgICAgICAgICAgICAgICAgICAgID8gPGRpdiBzdHlsZT17eyB3aWR0aDogJzEwMCUnLCBoZWlnaHQ6ICcxMDAlJywgYmFja2dyb3VuZENvbG9yOiAnd2hpdGUnLCBvcGFjaXR5OiAwLjAxLCBwb3NpdGlvbjogJ2Fic29sdXRlJywgdG9wOiAwLCBsZWZ0OiAwIH19IC8+XG4gICAgICAgICAgICAgICAgICAgICAgOiAnJyB9XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L1NwbGl0UGFuZT5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxUaW1lbGluZVxuICAgICAgICAgICAgICAgIHJlZj0ndGltZWxpbmUnXG4gICAgICAgICAgICAgICAgZm9sZGVyPXt0aGlzLnN0YXRlLnByb2plY3RGb2xkZXJ9XG4gICAgICAgICAgICAgICAgZW52b3k9e3RoaXMuZW52b3l9XG4gICAgICAgICAgICAgICAgaGFpa3U9e3RoaXMucHJvcHMuaGFpa3V9XG4gICAgICAgICAgICAgICAgY3JlYXRlTm90aWNlPXt0aGlzLmNyZWF0ZU5vdGljZX1cbiAgICAgICAgICAgICAgICByZW1vdmVOb3RpY2U9e3RoaXMucmVtb3ZlTm90aWNlfSAvPlxuICAgICAgICAgICAgPC9TcGxpdFBhbmU+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG59XG4iXX0=