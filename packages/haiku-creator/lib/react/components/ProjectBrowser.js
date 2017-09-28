'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _jsxFileName = 'src/react/components/ProjectBrowser.js';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _radium = require('radium');

var _radium2 = _interopRequireDefault(_radium);

var _reactAddonsCssTransitionGroup = require('react-addons-css-transition-group');

var _reactAddonsCssTransitionGroup2 = _interopRequireDefault(_reactAddonsCssTransitionGroup);

var _betterReactSpinkit = require('better-react-spinkit');

var _Palette = require('./Palette');

var _Palette2 = _interopRequireDefault(_Palette);

var _Toast = require('./notifications/Toast');

var _Toast2 = _interopRequireDefault(_Toast);

var _ProjectLoader = require('./ProjectLoader');

var _ProjectLoader2 = _interopRequireDefault(_ProjectLoader);

var _Icons = require('./Icons');

var _dashShared = require('../styles/dashShared');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ProjectBrowser = function (_React$Component) {
  _inherits(ProjectBrowser, _React$Component);

  function ProjectBrowser(props) {
    _classCallCheck(this, ProjectBrowser);

    var _this = _possibleConstructorReturn(this, (ProjectBrowser.__proto__ || Object.getPrototypeOf(ProjectBrowser)).call(this, props));

    _this.renderNotifications = _this.renderNotifications.bind(_this);
    _this.state = {
      error: null,
      showNeedsSaveDialogue: false,
      projectsList: [],
      areProjectsLoading: true,
      launchingProject: false
    };
    _this.handleDocumentKeyPress = _this.handleDocumentKeyPress.bind(_this);
    _this.handleSelectProject = _this.handleSelectProject.bind(_this);
    return _this;
  }

  _createClass(ProjectBrowser, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      this.loadProjects();
      document.addEventListener('keydown', this.handleDocumentKeyPress, true);

      this.props.envoy.get('tour').then(function (tourChannel) {
        _this2.tourChannel = tourChannel;
        tourChannel.on('tour:requestSelectProject', _this2.handleSelectProject);
      });
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      document.removeEventListener('keydown', this.handleDocumentKeyPress, true);
      this.tourChannel.off('tour:requestSelectProject', this.handleSelectProject);
    }
  }, {
    key: 'handleSelectProject',
    value: function handleSelectProject() {
      var projectIdx = this.state.projectsList.findIndex(function (project) {
        // Hardcoded - Name of the project that will be used for the tutorial
        return project.projectName === 'CheckTutorial';
      });

      this.setActiveProject(this.state.projectsList[projectIdx], projectIdx);
    }
  }, {
    key: 'handleDocumentKeyPress',
    value: function handleDocumentKeyPress(evt) {
      var _this3 = this;

      var projectsList = this.state.projectsList;

      var delta = 0;
      if (evt.code === 'ArrowUp') {
        delta = -1;
      } else if (evt.code === 'ArrowDown') {
        delta = 1;
      }

      var found = false;
      projectsList.forEach(function (project, i) {
        if (!found && project.isActive) {
          var proposedIndex = i + delta;
          // remove create UI if navigating away before submitting
          if (i === 0 && delta === 1 && project.isNew && !_this3.state.newProjectLoading) {
            proposedIndex = 0;
            projectsList.shift();
          }

          var newIndex = Math.min(Math.max(0, proposedIndex), projectsList.length - 1);

          project.isActive = false;
          projectsList[newIndex].isActive = true;
          found = true;
        }
      });
      this.setState({ projectsList: projectsList });
    }
  }, {
    key: 'loadProjects',
    value: function loadProjects() {
      var _this4 = this;

      return this.props.loadProjects(function (error, projectsList) {
        if (error) {
          _this4.props.createNotice({
            type: 'error',
            title: 'Oh no!',
            message: 'We couldn\'t load your team\'s projects. 😢 Please ensure that your computer is connected to the Internet. If you\'re connected and you still see this message our servers might be having problems. Please try again in a few moments. If you still see this message, contact Haiku for support.',
            closeText: 'Okay',
            lightScheme: true
          });
          return _this4.setState({ error: error, areProjectsLoading: false });
        }
        // select the first project by default
        if (projectsList.length) {
          projectsList[0].isActive = true;
        }
        _this4.setState({ projectsList: projectsList, areProjectsLoading: false });
      });
    }
  }, {
    key: 'setActiveProject',
    value: function setActiveProject(projectObject, projectIndex) {
      var _this5 = this;

      var projectsList = this.state.projectsList;

      // TODO: if current project has unsaved edits then show save dialogue
      //       and return without changing projects
      // if (false) {
      //   this.setState({ showNeedsSaveDialogue: true })
      //   return false
      // }

      projectsList.forEach(function (foundProject, foundIndex) {
        // remove new project if navigating away before it's complete
        if (projectIndex !== 0 && foundIndex === 0 && foundProject.isNew && !_this5.state.newProjectLoading) projectsList.shift();
        if (foundIndex === projectIndex) foundProject.isActive = true;else foundProject.isActive = false;
      });
      this.setState({ projectsList: projectsList });
    }
  }, {
    key: 'handleProjectTitleChange',
    value: function handleProjectTitleChange(projectObject, changeEvent) {
      if (!this.isProjectNameBad(changeEvent.target.value)) {
        projectObject.projectName = changeEvent.target.value;
      }
      this.setState({ projectsList: this.state.projectsList });
    }
  }, {
    key: 'launchNewProjectInput',
    value: function launchNewProjectInput() {
      var _this6 = this;

      var projectsList = this.state.projectsList;
      if (!projectsList[0] || !projectsList[0].isNew) {
        projectsList.forEach(function (foundProject, foundIndex) {
          foundProject.isActive = false;
        });
        projectsList.unshift({
          isActive: true,
          isNew: true,
          title: ''
        });
        setTimeout(function () {
          _this6.refs.newProjectInput.select();
        }, 50);
        this.setState({ projectsList: projectsList });
      }
    }
  }, {
    key: 'isProjectNameBad',
    value: function isProjectNameBad(projectName) {
      if (!projectName) return true;
      if (projectName === '') return true;
      return false;
    }
  }, {
    key: 'handleProjectLaunch',
    value: function handleProjectLaunch(projectObject) {
      var _this7 = this;

      if (this.isProjectNameBad(projectObject.projectName)) {
        console.warn('bad name launched:', projectObject.projectName);
      } else {
        this.setState({ launchingProject: projectObject });
        // projectObject.projectsHome to use project container folder
        // projectObject.projectPath to set specific project folder (no inference)
        return this.props.launchProject(projectObject.projectName, projectObject, function (error) {
          if (error) {
            _this7.props.createNotice({
              type: 'error',
              title: 'Oh no!',
              message: 'We couldn\'t open this project. 😩 Please ensure that your computer is connected to the Internet. If you\'re connected and you still see this message your files might still be processing. Please try again in a few moments. If you still see this error, contact Haiku for support.',
              closeText: 'Okay',
              lightScheme: true
            });
            return _this7.setState({ error: error, launchingProject: null });
          }
        });
      }
    }
  }, {
    key: 'handleImportInputClick',
    value: function handleImportInputClick() {
      this.refs.importInput.select();
    }
  }, {
    key: 'handleNewProjectInputClick',
    value: function handleNewProjectInputClick() {
      this.refs.newProjectInput.select();
    }
  }, {
    key: 'handleNewProjectInputKeyPress',
    value: function handleNewProjectInputKeyPress(e) {
      if (e.charCode === 13) {
        this.handleNewProjectGo();
      }
    }
  }, {
    key: 'handleNewProjectGo',
    value: function handleNewProjectGo() {
      var _this8 = this;

      var raw = this.refs.newProjectInput.value;
      // HACK:  strip all non-alphanumeric chars for now.  something more user-friendly would be ideal
      var name = raw && raw.replace(/[^a-z0-9]/gi, '');

      if (this.isProjectNameBad(name)) {
        console.warn('bad name entered:', name);
      } else {
        this.setState({ newProjectLoading: true });
        this.props.websocket.request({ method: 'createProject', params: [name] }, function (err, newProject) {
          var projectsList = _this8.state.projectsList;
          _this8.setState({ newProjectLoading: false });
          if (err) {
            projectsList.splice(0, 1);
            _this8.setState({ projectsList: projectsList });
            _this8.state.newProjectError = err;
            _this8.props.createNotice({
              type: 'error',
              title: 'Oh no!',
              message: 'We couldn\'t create your project. 😩 Please ensure that your computer is connected to the Internet. If you\'re connected and you still see this message our servers might be having problems. Please try again in a few moments. If you still see this error, contact Haiku for support.',
              closeText: 'Okay',
              lightScheme: true
            });
          } else {
            // strip "new" project from top of list, unshift actual new project
            var placeholderProject = projectsList.splice(0, 1)[0];
            newProject.isActive = placeholderProject.isActive;
            projectsList.unshift(newProject);
            _this8.setState({ projectList: projectsList });
            // auto-launch newly created project
            // this.handleProjectLaunch(newProject)
          }
        });
      }
    }
  }, {
    key: 'projectsListElement',
    value: function projectsListElement() {
      var _this9 = this;

      if (this.state.areProjectsLoading) {
        return _react2.default.createElement(
          'span',
          { style: _dashShared.DASH_STYLES.loadingWrap, __source: {
              fileName: _jsxFileName,
              lineNumber: 225
            },
            __self: this
          },
          _react2.default.createElement(_betterReactSpinkit.FadingCircle, { size: 32, color: _Palette2.default.ROCK_MUTED, __source: {
              fileName: _jsxFileName,
              lineNumber: 225
            },
            __self: this
          })
        );
      }

      return _react2.default.createElement(
        'div',
        { style: { height: 'calc(100% - 70px)', overflowY: 'auto' }, __source: {
            fileName: _jsxFileName,
            lineNumber: 229
          },
          __self: this
        },
        this.state.projectsList.map(function (projectObject, index) {
          var projectTitle;
          if (projectObject.isNew) {
            // If this is the NEW PROJECT slot, show the input UI

            var buttonContents = 'GO';
            if (_this9.state.newProjectLoading) buttonContents = _react2.default.createElement(_Icons.LoadingSpinnerSVG, {
              __source: {
                fileName: _jsxFileName,
                lineNumber: 236
              },
              __self: _this9
            });

            projectTitle = _react2.default.createElement(
              'div',
              { style: [_dashShared.DASH_STYLES.projectTitleNew], __source: {
                  fileName: _jsxFileName,
                  lineNumber: 239
                },
                __self: _this9
              },
              _react2.default.createElement('input', { key: 'new-project-input',
                ref: 'newProjectInput',
                disabled: _this9.state.newProjectLoading,
                onClick: _this9.handleNewProjectInputClick.bind(_this9),
                onKeyPress: _this9.handleNewProjectInputKeyPress.bind(_this9),
                style: [_dashShared.DASH_STYLES.newProjectInput],
                placeholder: 'NewProjectName', __source: {
                  fileName: _jsxFileName,
                  lineNumber: 240
                },
                __self: _this9
              }),
              _react2.default.createElement(
                'button',
                { key: 'new-project-go-button', disabled: _this9.state.newProjectLoading, onClick: _this9.handleNewProjectGo.bind(_this9), style: [_dashShared.DASH_STYLES.newProjectGoButton], __source: {
                    fileName: _jsxFileName,
                    lineNumber: 247
                  },
                  __self: _this9
                },
                buttonContents
              ),
              _react2.default.createElement(
                'span',
                { key: 'new-project-error', style: [_dashShared.DASH_STYLES.newProjectError], __source: {
                    fileName: _jsxFileName,
                    lineNumber: 248
                  },
                  __self: _this9
                },
                _this9.state.newProjectError
              )
            );
          } else {
            // otherwise, show the read-only Project listing button
            projectTitle = _react2.default.createElement(
              'span',
              { style: [_dashShared.DASH_STYLES.projectTitle, projectObject.isActive && _dashShared.DASH_STYLES.activeTitle], __source: {
                  fileName: _jsxFileName,
                  lineNumber: 253
                },
                __self: _this9
              },
              projectObject.projectName
            );
          }

          return _react2.default.createElement(
            'div',
            { style: [_dashShared.DASH_STYLES.projectWrapper, projectObject.isActive && _dashShared.DASH_STYLES.activeWrapper],
              key: index,
              onDoubleClick: _this9.handleProjectLaunch.bind(_this9, projectObject),
              onClick: _this9.setActiveProject.bind(_this9, projectObject, index), __source: {
                fileName: _jsxFileName,
                lineNumber: 257
              },
              __self: _this9
            },
            _react2.default.createElement('span', { key: 'a-' + projectObject.projectName, style: [projectObject.isActive && _dashShared.DASH_STYLES.activeProject], __source: {
                fileName: _jsxFileName,
                lineNumber: 261
              },
              __self: _this9
            }),
            _react2.default.createElement(
              'span',
              { style: [_dashShared.DASH_STYLES.logo, projectObject.isActive && _dashShared.DASH_STYLES.logoActive], __source: {
                  fileName: _jsxFileName,
                  lineNumber: 262
                },
                __self: _this9
              },
              _react2.default.createElement(_Icons.LogoSVG, {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 262
                },
                __self: _this9
              })
            ),
            projectTitle,
            _react2.default.createElement(
              'span',
              { style: [_dashShared.DASH_STYLES.date, projectObject.isActive && _dashShared.DASH_STYLES.activeDate], __source: {
                  fileName: _jsxFileName,
                  lineNumber: 264
                },
                __self: _this9
              },
              _react2.default.createElement('div', { style: _dashShared.DASH_STYLES.dateTitle, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 265
                },
                __self: _this9
              }),
              _react2.default.createElement('div', {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 266
                },
                __self: _this9
              })
            )
          );
        })
      );
    }
  }, {
    key: 'titleWrapperElement',
    value: function titleWrapperElement() {
      return _react2.default.createElement(
        'div',
        { style: _dashShared.DASH_STYLES.titleWrapper, __source: {
            fileName: _jsxFileName,
            lineNumber: 277
          },
          __self: this
        },
        _react2.default.createElement(
          'span',
          { style: _dashShared.DASH_STYLES.projectsTitle, __source: {
              fileName: _jsxFileName,
              lineNumber: 278
            },
            __self: this
          },
          'Projects'
        ),
        _react2.default.createElement(
          'button',
          {
            tabIndex: '-1',
            style: _dashShared.DASH_STYLES.btnNewProject,
            onClick: this.launchNewProjectInput.bind(this), __source: {
              fileName: _jsxFileName,
              lineNumber: 279
            },
            __self: this
          },
          '+'
        ),
        !this.state.areProjectsLoading && this.state.projectsList.length === 0 ? _react2.default.createElement(
          'span',
          { style: _dashShared.DASH_STYLES.tooltip, __source: {
              fileName: _jsxFileName,
              lineNumber: 284
            },
            __self: this
          },
          _react2.default.createElement('span', { style: _dashShared.DASH_STYLES.arrowLeft, __source: {
              fileName: _jsxFileName,
              lineNumber: 284
            },
            __self: this
          }),
          'Create a Project'
        ) : null
      );
    }
  }, {
    key: 'projectEditButtonElement',
    value: function projectEditButtonElement(projectObject) {
      return _react2.default.createElement(
        'button',
        {
          tabIndex: '-1',
          style: _dashShared.DASH_STYLES.editProject,
          disabled: !!this.state.launchingProject,
          onClick: this.handleProjectLaunch.bind(this, projectObject),
          id: 'project-edit-button', __source: {
            fileName: _jsxFileName,
            lineNumber: 293
          },
          __self: this
        },
        'Open Editor'
      );
    }
  }, {
    key: 'projectFormElement',
    value: function projectFormElement(projectObject) {
      if (!projectObject) {
        if (this.state.areProjectsLoading) {
          return _react2.default.createElement('div', {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 307
            },
            __self: this
          });
        } else if (this.state.projectsList.length === 0 && !this.state.areProjectsLoading) {
          return _react2.default.createElement(
            'div',
            { style: [_dashShared.DASH_STYLES.emptyState, _dashShared.DASH_STYLES.noSelect], __source: {
                fileName: _jsxFileName,
                lineNumber: 309
              },
              __self: this
            },
            'Create a project to begin'
          );
        } else {
          return _react2.default.createElement(
            'div',
            { style: [_dashShared.DASH_STYLES.emptyState, _dashShared.DASH_STYLES.noSelect], __source: {
                fileName: _jsxFileName,
                lineNumber: 311
              },
              __self: this
            },
            'Select a project to begin'
          );
        }
      }

      var importUri = '' + snakeize(projectObject.projectName);
      var commandLineSnippet = 'haiku install ' + importUri;
      return _react2.default.createElement(
        'div',
        {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 318
          },
          __self: this
        },
        _react2.default.createElement(
          'div',
          { style: _dashShared.DASH_STYLES.fieldTitle, __source: {
              fileName: _jsxFileName,
              lineNumber: 319
            },
            __self: this
          },
          'Project name'
        ),
        _react2.default.createElement(
          'div',
          { style: { position: 'relative' }, __source: {
              fileName: _jsxFileName,
              lineNumber: 320
            },
            __self: this
          },
          _react2.default.createElement('input', {
            key: 'projectTitle',
            value: projectObject.projectName,
            style: _dashShared.DASH_STYLES.field,
            readOnly: true,
            onChange: this.handleProjectTitleChange.bind(this, projectObject), __source: {
              fileName: _jsxFileName,
              lineNumber: 321
            },
            __self: this
          })
        ),
        _react2.default.createElement(
          'div',
          { style: _dashShared.DASH_STYLES.fieldTitle, __source: {
              fileName: _jsxFileName,
              lineNumber: 328
            },
            __self: this
          },
          'Import into a codebase via command line'
        ),
        _react2.default.createElement('input', { key: 'projectImportUri', ref: 'importInput', onClick: this.handleImportInputClick.bind(this), value: commandLineSnippet, style: [_dashShared.DASH_STYLES.field, _dashShared.DASH_STYLES.fieldMono], readOnly: true, __source: {
            fileName: _jsxFileName,
            lineNumber: 329
          },
          __self: this
        }),
        this.projectEditButtonElement(projectObject)
      );
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
        removeNotice: this.props.removeNotice,
        lightScheme: content.lightScheme, __source: {
          fileName: _jsxFileName,
          lineNumber: 337
        },
        __self: this
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var activeProject = _lodash2.default.find(this.state.projectsList, { isActive: true });
      return _react2.default.createElement(
        'div',
        {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 352
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
              lineNumber: 353
            },
            __self: this
          },
          _react2.default.createElement(
            'div',
            { style: { position: 'absolute', right: 0, top: 0, width: 300 }, __source: {
                fileName: _jsxFileName,
                lineNumber: 357
              },
              __self: this
            },
            _lodash2.default.map(this.props.notices, this.renderNotifications)
          )
        ),
        _react2.default.createElement(
          'div',
          { style: [_dashShared.DASH_STYLES.dashLevelWrapper, _dashShared.DASH_STYLES.appearDashLevel], __source: {
              fileName: _jsxFileName,
              lineNumber: 361
            },
            __self: this
          },
          _react2.default.createElement('div', { style: _dashShared.DASH_STYLES.frame, className: 'frame', __source: {
              fileName: _jsxFileName,
              lineNumber: 362
            },
            __self: this
          }),
          _react2.default.createElement(
            'div',
            { style: _dashShared.DASH_STYLES.projectsBar, __source: {
                fileName: _jsxFileName,
                lineNumber: 363
              },
              __self: this
            },
            this.titleWrapperElement(),
            this.projectsListElement()
          ),
          _react2.default.createElement(
            'div',
            { style: _dashShared.DASH_STYLES.details, __source: {
                fileName: _jsxFileName,
                lineNumber: 367
              },
              __self: this
            },
            _react2.default.createElement(
              'div',
              { style: _dashShared.DASH_STYLES.centerCol, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 368
                },
                __self: this
              },
              activeProject && activeProject.isNew ? _react2.default.createElement('span', {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 370
                },
                __self: this
              }) : this.projectFormElement(activeProject)
            )
          )
        ),
        this.state.launchingProject && _react2.default.createElement(_ProjectLoader2.default, {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 375
          },
          __self: this
        })
      );
    }
  }]);

  return ProjectBrowser;
}(_react2.default.Component);

function snakeize(str) {
  str = str || '';
  return str.replace(/ /g, '_');
}

// function uniqueProjectTitle (projectsList, title) {
//   const matchedProjects = filter(projectsList, { title })
//   if (matchedProjects.length < 1) return title
//   // TODO: Please make this algorithm robust
//   return `${title} ${projectsList.length + 1}`
// }

exports.default = (0, _radium2.default)(ProjectBrowser);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9yZWFjdC9jb21wb25lbnRzL1Byb2plY3RCcm93c2VyLmpzIl0sIm5hbWVzIjpbIlByb2plY3RCcm93c2VyIiwicHJvcHMiLCJyZW5kZXJOb3RpZmljYXRpb25zIiwiYmluZCIsInN0YXRlIiwiZXJyb3IiLCJzaG93TmVlZHNTYXZlRGlhbG9ndWUiLCJwcm9qZWN0c0xpc3QiLCJhcmVQcm9qZWN0c0xvYWRpbmciLCJsYXVuY2hpbmdQcm9qZWN0IiwiaGFuZGxlRG9jdW1lbnRLZXlQcmVzcyIsImhhbmRsZVNlbGVjdFByb2plY3QiLCJsb2FkUHJvamVjdHMiLCJkb2N1bWVudCIsImFkZEV2ZW50TGlzdGVuZXIiLCJlbnZveSIsImdldCIsInRoZW4iLCJ0b3VyQ2hhbm5lbCIsIm9uIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsIm9mZiIsInByb2plY3RJZHgiLCJmaW5kSW5kZXgiLCJwcm9qZWN0IiwicHJvamVjdE5hbWUiLCJzZXRBY3RpdmVQcm9qZWN0IiwiZXZ0IiwiZGVsdGEiLCJjb2RlIiwiZm91bmQiLCJmb3JFYWNoIiwiaSIsImlzQWN0aXZlIiwicHJvcG9zZWRJbmRleCIsImlzTmV3IiwibmV3UHJvamVjdExvYWRpbmciLCJzaGlmdCIsIm5ld0luZGV4IiwiTWF0aCIsIm1pbiIsIm1heCIsImxlbmd0aCIsInNldFN0YXRlIiwiY3JlYXRlTm90aWNlIiwidHlwZSIsInRpdGxlIiwibWVzc2FnZSIsImNsb3NlVGV4dCIsImxpZ2h0U2NoZW1lIiwicHJvamVjdE9iamVjdCIsInByb2plY3RJbmRleCIsImZvdW5kUHJvamVjdCIsImZvdW5kSW5kZXgiLCJjaGFuZ2VFdmVudCIsImlzUHJvamVjdE5hbWVCYWQiLCJ0YXJnZXQiLCJ2YWx1ZSIsInVuc2hpZnQiLCJzZXRUaW1lb3V0IiwicmVmcyIsIm5ld1Byb2plY3RJbnB1dCIsInNlbGVjdCIsImNvbnNvbGUiLCJ3YXJuIiwibGF1bmNoUHJvamVjdCIsImltcG9ydElucHV0IiwiZSIsImNoYXJDb2RlIiwiaGFuZGxlTmV3UHJvamVjdEdvIiwicmF3IiwibmFtZSIsInJlcGxhY2UiLCJ3ZWJzb2NrZXQiLCJyZXF1ZXN0IiwibWV0aG9kIiwicGFyYW1zIiwiZXJyIiwibmV3UHJvamVjdCIsInNwbGljZSIsIm5ld1Byb2plY3RFcnJvciIsInBsYWNlaG9sZGVyUHJvamVjdCIsInByb2plY3RMaXN0IiwibG9hZGluZ1dyYXAiLCJST0NLX01VVEVEIiwiaGVpZ2h0Iiwib3ZlcmZsb3dZIiwibWFwIiwiaW5kZXgiLCJwcm9qZWN0VGl0bGUiLCJidXR0b25Db250ZW50cyIsInByb2plY3RUaXRsZU5ldyIsImhhbmRsZU5ld1Byb2plY3RJbnB1dENsaWNrIiwiaGFuZGxlTmV3UHJvamVjdElucHV0S2V5UHJlc3MiLCJuZXdQcm9qZWN0R29CdXR0b24iLCJhY3RpdmVUaXRsZSIsInByb2plY3RXcmFwcGVyIiwiYWN0aXZlV3JhcHBlciIsImhhbmRsZVByb2plY3RMYXVuY2giLCJhY3RpdmVQcm9qZWN0IiwibG9nbyIsImxvZ29BY3RpdmUiLCJkYXRlIiwiYWN0aXZlRGF0ZSIsImRhdGVUaXRsZSIsInRpdGxlV3JhcHBlciIsInByb2plY3RzVGl0bGUiLCJidG5OZXdQcm9qZWN0IiwibGF1bmNoTmV3UHJvamVjdElucHV0IiwidG9vbHRpcCIsImFycm93TGVmdCIsImVkaXRQcm9qZWN0IiwiZW1wdHlTdGF0ZSIsIm5vU2VsZWN0IiwiaW1wb3J0VXJpIiwic25ha2VpemUiLCJjb21tYW5kTGluZVNuaXBwZXQiLCJmaWVsZFRpdGxlIiwicG9zaXRpb24iLCJmaWVsZCIsImhhbmRsZVByb2plY3RUaXRsZUNoYW5nZSIsImhhbmRsZUltcG9ydElucHV0Q2xpY2siLCJmaWVsZE1vbm8iLCJwcm9qZWN0RWRpdEJ1dHRvbkVsZW1lbnQiLCJjb250ZW50IiwicmVtb3ZlTm90aWNlIiwiZmluZCIsInJpZ2h0IiwidG9wIiwid2lkdGgiLCJub3RpY2VzIiwiZGFzaExldmVsV3JhcHBlciIsImFwcGVhckRhc2hMZXZlbCIsImZyYW1lIiwicHJvamVjdHNCYXIiLCJ0aXRsZVdyYXBwZXJFbGVtZW50IiwicHJvamVjdHNMaXN0RWxlbWVudCIsImRldGFpbHMiLCJjZW50ZXJDb2wiLCJwcm9qZWN0Rm9ybUVsZW1lbnQiLCJDb21wb25lbnQiLCJzdHIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7SUFFTUEsYzs7O0FBQ0osMEJBQWFDLEtBQWIsRUFBb0I7QUFBQTs7QUFBQSxnSUFDWkEsS0FEWTs7QUFFbEIsVUFBS0MsbUJBQUwsR0FBMkIsTUFBS0EsbUJBQUwsQ0FBeUJDLElBQXpCLE9BQTNCO0FBQ0EsVUFBS0MsS0FBTCxHQUFhO0FBQ1hDLGFBQU8sSUFESTtBQUVYQyw2QkFBdUIsS0FGWjtBQUdYQyxvQkFBYyxFQUhIO0FBSVhDLDBCQUFvQixJQUpUO0FBS1hDLHdCQUFrQjtBQUxQLEtBQWI7QUFPQSxVQUFLQyxzQkFBTCxHQUE4QixNQUFLQSxzQkFBTCxDQUE0QlAsSUFBNUIsT0FBOUI7QUFDQSxVQUFLUSxtQkFBTCxHQUEyQixNQUFLQSxtQkFBTCxDQUF5QlIsSUFBekIsT0FBM0I7QUFYa0I7QUFZbkI7Ozs7d0NBRW9CO0FBQUE7O0FBQ25CLFdBQUtTLFlBQUw7QUFDQUMsZUFBU0MsZ0JBQVQsQ0FBMEIsU0FBMUIsRUFBcUMsS0FBS0osc0JBQTFDLEVBQWtFLElBQWxFOztBQUVBLFdBQUtULEtBQUwsQ0FBV2MsS0FBWCxDQUFpQkMsR0FBakIsQ0FBcUIsTUFBckIsRUFBNkJDLElBQTdCLENBQWtDLFVBQUNDLFdBQUQsRUFBaUI7QUFDakQsZUFBS0EsV0FBTCxHQUFtQkEsV0FBbkI7QUFDQUEsb0JBQVlDLEVBQVosQ0FBZSwyQkFBZixFQUE0QyxPQUFLUixtQkFBakQ7QUFDRCxPQUhEO0FBSUQ7OzsyQ0FFdUI7QUFDdEJFLGVBQVNPLG1CQUFULENBQTZCLFNBQTdCLEVB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Y0FBSyxPQUFPLHdCQUFZQyxPQUF4QjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDRTtBQUFBO0FBQUEsZ0JBQUssT0FBTyx3QkFBWUMsU0FBeEI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0d2QywrQkFBaUJBLGNBQWNoRSxLQUEvQixHQUNHO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLGdCQURILEdBRUcsS0FBS3dHLGtCQUFMLENBQXdCeEMsYUFBeEI7QUFITjtBQURGO0FBTkYsU0FURjtBQXVCRyxhQUFLL0YsS0FBTCxDQUFXSyxnQkFBWCxJQUErQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQXZCbEMsT0FERjtBQTJCRDs7OztFQTlXMEIsZ0JBQU1tSSxTOztBQWlYbkMsU0FBU3pCLFFBQVQsQ0FBbUIwQixHQUFuQixFQUF3QjtBQUN0QkEsUUFBTUEsT0FBTyxFQUFiO0FBQ0EsU0FBT0EsSUFBSXJFLE9BQUosQ0FBWSxJQUFaLEVBQWtCLEdBQWxCLENBQVA7QUFDRDs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O2tCQUVlLHNCQUFPeEUsY0FBUCxDIiwiZmlsZSI6IlByb2plY3RCcm93c2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGxvZGFzaCBmcm9tICdsb2Rhc2gnXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgUmFkaXVtIGZyb20gJ3JhZGl1bSdcbmltcG9ydCBSZWFjdENTU1RyYW5zaXRpb25Hcm91cCBmcm9tICdyZWFjdC1hZGRvbnMtY3NzLXRyYW5zaXRpb24tZ3JvdXAnXG5pbXBvcnQgeyBGYWRpbmdDaXJjbGUgfSBmcm9tICdiZXR0ZXItcmVhY3Qtc3BpbmtpdCdcbmltcG9ydCBQYWxldHRlIGZyb20gJy4vUGFsZXR0ZSdcbmltcG9ydCBUb2FzdCBmcm9tICcuL25vdGlmaWNhdGlvbnMvVG9hc3QnXG5pbXBvcnQgUHJvamVjdExvYWRlciBmcm9tICcuL1Byb2plY3RMb2FkZXInXG5pbXBvcnQgeyBMb2dvU1ZHLCBMb2FkaW5nU3Bpbm5lclNWRyB9IGZyb20gJy4vSWNvbnMnXG5pbXBvcnQgeyBEQVNIX1NUWUxFUyB9IGZyb20gJy4uL3N0eWxlcy9kYXNoU2hhcmVkJ1xuXG5jbGFzcyBQcm9qZWN0QnJvd3NlciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yIChwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKVxuICAgIHRoaXMucmVuZGVyTm90aWZpY2F0aW9ucyA9IHRoaXMucmVuZGVyTm90aWZpY2F0aW9ucy5iaW5kKHRoaXMpXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIGVycm9yOiBudWxsLFxuICAgICAgc2hvd05lZWRzU2F2ZURpYWxvZ3VlOiBmYWxzZSxcbiAgICAgIHByb2plY3RzTGlzdDogW10sXG4gICAgICBhcmVQcm9qZWN0c0xvYWRpbmc6IHRydWUsXG4gICAgICBsYXVuY2hpbmdQcm9qZWN0OiBmYWxzZVxuICAgIH1cbiAgICB0aGlzLmhhbmRsZURvY3VtZW50S2V5UHJlc3MgPSB0aGlzLmhhbmRsZURvY3VtZW50S2V5UHJlc3MuYmluZCh0aGlzKVxuICAgIHRoaXMuaGFuZGxlU2VsZWN0UHJvamVjdCA9IHRoaXMuaGFuZGxlU2VsZWN0UHJvamVjdC5iaW5kKHRoaXMpXG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCAoKSB7XG4gICAgdGhpcy5sb2FkUHJvamVjdHMoKVxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLmhhbmRsZURvY3VtZW50S2V5UHJlc3MsIHRydWUpXG5cbiAgICB0aGlzLnByb3BzLmVudm95LmdldCgndG91cicpLnRoZW4oKHRvdXJDaGFubmVsKSA9PiB7XG4gICAgICB0aGlzLnRvdXJDaGFubmVsID0gdG91ckNoYW5uZWxcbiAgICAgIHRvdXJDaGFubmVsLm9uKCd0b3VyOnJlcXVlc3RTZWxlY3RQcm9qZWN0JywgdGhpcy5oYW5kbGVTZWxlY3RQcm9qZWN0KVxuICAgIH0pXG4gIH1cblxuICBjb21wb25lbnRXaWxsVW5tb3VudCAoKSB7XG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRoaXMuaGFuZGxlRG9jdW1lbnRLZXlQcmVzcywgdHJ1ZSlcbiAgICB0aGlzLnRvdXJDaGFubmVsLm9mZigndG91cjpyZXF1ZXN0U2VsZWN0UHJvamVjdCcsIHRoaXMuaGFuZGxlU2VsZWN0UHJvamVjdClcbiAgfVxuXG4gIGhhbmRsZVNlbGVjdFByb2plY3QgKCkge1xuICAgIGNvbnN0IHByb2plY3RJZHggPSB0aGlzLnN0YXRlLnByb2plY3RzTGlzdC5maW5kSW5kZXgoKHByb2plY3QpID0+IHtcbiAgICAgIC8vIEhhcmRjb2RlZCAtIE5hbWUgb2YgdGhlIHByb2plY3QgdGhhdCB3aWxsIGJlIHVzZWQgZm9yIHRoZSB0dXRvcmlhbFxuICAgICAgcmV0dXJuIHByb2plY3QucHJvamVjdE5hbWUgPT09ICdDaGVja1R1dG9yaWFsJ1xuICAgIH0pXG5cbiAgICB0aGlzLnNldEFjdGl2ZVByb2plY3QodGhpcy5zdGF0ZS5wcm9qZWN0c0xpc3RbcHJvamVjdElkeF0sIHByb2plY3RJZHgpXG4gIH1cblxuICBoYW5kbGVEb2N1bWVudEtleVByZXNzIChldnQpIHtcbiAgICB2YXIgcHJvamVjdHNMaXN0ID0gdGhpcy5zdGF0ZS5wcm9qZWN0c0xpc3RcblxuICAgIHZhciBkZWx0YSA9IDBcbiAgICBpZiAoZXZ0LmNvZGUgPT09ICdBcnJvd1VwJykge1xuICAgICAgZGVsdGEgPSAtMVxuICAgIH0gZWxzZSBpZiAoZXZ0LmNvZGUgPT09ICdBcnJvd0Rvd24nKSB7XG4gICAgICBkZWx0YSA9IDFcbiAgICB9XG5cbiAgICB2YXIgZm91bmQgPSBmYWxzZVxuICAgIHByb2plY3RzTGlzdC5mb3JFYWNoKChwcm9qZWN0LCBpKSA9PiB7XG4gICAgICBpZiAoIWZvdW5kICYmIHByb2plY3QuaXNBY3RpdmUpIHtcbiAgICAgICAgdmFyIHByb3Bvc2VkSW5kZXggPSBpICsgZGVsdGFcbiAgICAgICAgLy8gcmVtb3ZlIGNyZWF0ZSBVSSBpZiBuYXZpZ2F0aW5nIGF3YXkgYmVmb3JlIHN1Ym1pdHRpbmdcbiAgICAgICAgaWYgKGkgPT09IDAgJiYgZGVsdGEgPT09IDEgJiYgcHJvamVjdC5pc05ldyAmJiAhdGhpcy5zdGF0ZS5uZXdQcm9qZWN0TG9hZGluZykge1xuICAgICAgICAgIHByb3Bvc2VkSW5kZXggPSAwXG4gICAgICAgICAgcHJvamVjdHNMaXN0LnNoaWZ0KClcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBuZXdJbmRleCA9IE1hdGgubWluKE1hdGgubWF4KDAsIHByb3Bvc2VkSW5kZXgpLCBwcm9qZWN0c0xpc3QubGVuZ3RoIC0gMSlcblxuICAgICAgICBwcm9qZWN0LmlzQWN0aXZlID0gZmFsc2VcbiAgICAgICAgcHJvamVjdHNMaXN0W25ld0luZGV4XS5pc0FjdGl2ZSA9IHRydWVcbiAgICAgICAgZm91bmQgPSB0cnVlXG4gICAgICB9XG4gICAgfSlcbiAgICB0aGlzLnNldFN0YXRlKHtwcm9qZWN0c0xpc3R9KVxuICB9XG5cbiAgbG9hZFByb2plY3RzICgpIHtcbiAgICByZXR1cm4gdGhpcy5wcm9wcy5sb2FkUHJvamVjdHMoKGVycm9yLCBwcm9qZWN0c0xpc3QpID0+IHtcbiAgICAgIGlmIChlcnJvcikge1xuICAgICAgICB0aGlzLnByb3BzLmNyZWF0ZU5vdGljZSh7XG4gICAgICAgICAgdHlwZTogJ2Vycm9yJyxcbiAgICAgICAgICB0aXRsZTogJ09oIG5vIScsXG4gICAgICAgICAgbWVzc2FnZTogJ1dlIGNvdWxkblxcJ3QgbG9hZCB5b3VyIHRlYW1cXCdzIHByb2plY3RzLiDwn5iiIFBsZWFzZSBlbnN1cmUgdGhhdCB5b3VyIGNvbXB1dGVyIGlzIGNvbm5lY3RlZCB0byB0aGUgSW50ZXJuZXQuIElmIHlvdVxcJ3JlIGNvbm5lY3RlZCBhbmQgeW91IHN0aWxsIHNlZSB0aGlzIG1lc3NhZ2Ugb3VyIHNlcnZlcnMgbWlnaHQgYmUgaGF2aW5nIHByb2JsZW1zLiBQbGVhc2UgdHJ5IGFnYWluIGluIGEgZmV3IG1vbWVudHMuIElmIHlvdSBzdGlsbCBzZWUgdGhpcyBtZXNzYWdlLCBjb250YWN0IEhhaWt1IGZvciBzdXBwb3J0LicsXG4gICAgICAgICAgY2xvc2VUZXh0OiAnT2theScsXG4gICAgICAgICAgbGlnaHRTY2hlbWU6IHRydWVcbiAgICAgICAgfSlcbiAgICAgICAgcmV0dXJuIHRoaXMuc2V0U3RhdGUoeyBlcnJvciwgYXJlUHJvamVjdHNMb2FkaW5nOiBmYWxzZSB9KVxuICAgICAgfVxuICAgICAgLy8gc2VsZWN0IHRoZSBmaXJzdCBwcm9qZWN0IGJ5IGRlZmF1bHRcbiAgICAgIGlmIChwcm9qZWN0c0xpc3QubGVuZ3RoKSB7XG4gICAgICAgIHByb2plY3RzTGlzdFswXS5pc0FjdGl2ZSA9IHRydWVcbiAgICAgIH1cbiAgICAgIHRoaXMuc2V0U3RhdGUoeyBwcm9qZWN0c0xpc3QsIGFyZVByb2plY3RzTG9hZGluZzogZmFsc2UgfSlcbiAgICB9KVxuICB9XG5cbiAgc2V0QWN0aXZlUHJvamVjdCAocHJvamVjdE9iamVjdCwgcHJvamVjdEluZGV4KSB7XG4gICAgY29uc3QgcHJvamVjdHNMaXN0ID0gdGhpcy5zdGF0ZS5wcm9qZWN0c0xpc3RcblxuICAgIC8vIFRPRE86IGlmIGN1cnJlbnQgcHJvamVjdCBoYXMgdW5zYXZlZCBlZGl0cyB0aGVuIHNob3cgc2F2ZSBkaWFsb2d1ZVxuICAgIC8vICAgICAgIGFuZCByZXR1cm4gd2l0aG91dCBjaGFuZ2luZyBwcm9qZWN0c1xuICAgIC8vIGlmIChmYWxzZSkge1xuICAgIC8vICAgdGhpcy5zZXRTdGF0ZSh7IHNob3dOZWVkc1NhdmVEaWFsb2d1ZTogdHJ1ZSB9KVxuICAgIC8vICAgcmV0dXJuIGZhbHNlXG4gICAgLy8gfVxuXG4gICAgcHJvamVjdHNMaXN0LmZvckVhY2goKGZvdW5kUHJvamVjdCwgZm91bmRJbmRleCkgPT4ge1xuICAgICAgLy8gcmVtb3ZlIG5ldyBwcm9qZWN0IGlmIG5hdmlnYXRpbmcgYXdheSBiZWZvcmUgaXQncyBjb21wbGV0ZVxuICAgICAgaWYgKHByb2plY3RJbmRleCAhPT0gMCAmJiBmb3VuZEluZGV4ID09PSAwICYmIGZvdW5kUHJvamVjdC5pc05ldyAmJiAhdGhpcy5zdGF0ZS5uZXdQcm9qZWN0TG9hZGluZykgcHJvamVjdHNMaXN0LnNoaWZ0KClcbiAgICAgIGlmIChmb3VuZEluZGV4ID09PSBwcm9qZWN0SW5kZXgpIGZvdW5kUHJvamVjdC5pc0FjdGl2ZSA9IHRydWVcbiAgICAgIGVsc2UgZm91bmRQcm9qZWN0LmlzQWN0aXZlID0gZmFsc2VcbiAgICB9KVxuICAgIHRoaXMuc2V0U3RhdGUoeyBwcm9qZWN0c0xpc3QgfSlcbiAgfVxuXG4gIGhhbmRsZVByb2plY3RUaXRsZUNoYW5nZSAocHJvamVjdE9iamVjdCwgY2hhbmdlRXZlbnQpIHtcbiAgICBpZiAoIXRoaXMuaXNQcm9qZWN0TmFtZUJhZChjaGFuZ2VFdmVudC50YXJnZXQudmFsdWUpKSB7XG4gICAgICBwcm9qZWN0T2JqZWN0LnByb2plY3ROYW1lID0gY2hhbmdlRXZlbnQudGFyZ2V0LnZhbHVlXG4gICAgfVxuICAgIHRoaXMuc2V0U3RhdGUoeyBwcm9qZWN0c0xpc3Q6IHRoaXMuc3RhdGUucHJvamVjdHNMaXN0IH0pXG4gIH1cblxuICBsYXVuY2hOZXdQcm9qZWN0SW5wdXQgKCkge1xuICAgIHZhciBwcm9qZWN0c0xpc3QgPSB0aGlzLnN0YXRlLnByb2plY3RzTGlzdFxuICAgIGlmICghcHJvamVjdHNMaXN0WzBdIHx8ICFwcm9qZWN0c0xpc3RbMF0uaXNOZXcpIHtcbiAgICAgIHByb2plY3RzTGlzdC5mb3JFYWNoKChmb3VuZFByb2plY3QsIGZvdW5kSW5kZXgpID0+IHtcbiAgICAgICAgZm91bmRQcm9qZWN0LmlzQWN0aXZlID0gZmFsc2VcbiAgICAgIH0pXG4gICAgICBwcm9qZWN0c0xpc3QudW5zaGlmdCh7XG4gICAgICAgIGlzQWN0aXZlOiB0cnVlLFxuICAgICAgICBpc05ldzogdHJ1ZSxcbiAgICAgICAgdGl0bGU6ICcnXG4gICAgICB9KVxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHRoaXMucmVmcy5uZXdQcm9qZWN0SW5wdXQuc2VsZWN0KClcbiAgICAgIH0sIDUwKVxuICAgICAgdGhpcy5zZXRTdGF0ZSh7IHByb2plY3RzTGlzdCB9KVxuICAgIH1cbiAgfVxuXG4gIGlzUHJvamVjdE5hbWVCYWQgKHByb2plY3ROYW1lKSB7XG4gICAgaWYgKCFwcm9qZWN0TmFtZSkgcmV0dXJuIHRydWVcbiAgICBpZiAocHJvamVjdE5hbWUgPT09ICcnKSByZXR1cm4gdHJ1ZVxuICAgIHJldHVybiBmYWxzZVxuICB9XG5cbiAgaGFuZGxlUHJvamVjdExhdW5jaCAocHJvamVjdE9iamVjdCkge1xuICAgIGlmICh0aGlzLmlzUHJvamVjdE5hbWVCYWQocHJvamVjdE9iamVjdC5wcm9qZWN0TmFtZSkpIHtcbiAgICAgIGNvbnNvbGUud2FybignYmFkIG5hbWUgbGF1bmNoZWQ6JywgcHJvamVjdE9iamVjdC5wcm9qZWN0TmFtZSlcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7IGxhdW5jaGluZ1Byb2plY3Q6IHByb2plY3RPYmplY3QgfSlcbiAgICAgIC8vIHByb2plY3RPYmplY3QucHJvamVjdHNIb21lIHRvIHVzZSBwcm9qZWN0IGNvbnRhaW5lciBmb2xkZXJcbiAgICAgIC8vIHByb2plY3RPYmplY3QucHJvamVjdFBhdGggdG8gc2V0IHNwZWNpZmljIHByb2plY3QgZm9sZGVyIChubyBpbmZlcmVuY2UpXG4gICAgICByZXR1cm4gdGhpcy5wcm9wcy5sYXVuY2hQcm9qZWN0KHByb2plY3RPYmplY3QucHJvamVjdE5hbWUsIHByb2plY3RPYmplY3QsIChlcnJvcikgPT4ge1xuICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICB0aGlzLnByb3BzLmNyZWF0ZU5vdGljZSh7XG4gICAgICAgICAgICB0eXBlOiAnZXJyb3InLFxuICAgICAgICAgICAgdGl0bGU6ICdPaCBubyEnLFxuICAgICAgICAgICAgbWVzc2FnZTogJ1dlIGNvdWxkblxcJ3Qgb3BlbiB0aGlzIHByb2plY3QuIPCfmKkgUGxlYXNlIGVuc3VyZSB0aGF0IHlvdXIgY29tcHV0ZXIgaXMgY29ubmVjdGVkIHRvIHRoZSBJbnRlcm5ldC4gSWYgeW91XFwncmUgY29ubmVjdGVkIGFuZCB5b3Ugc3RpbGwgc2VlIHRoaXMgbWVzc2FnZSB5b3VyIGZpbGVzIG1pZ2h0IHN0aWxsIGJlIHByb2Nlc3NpbmcuIFBsZWFzZSB0cnkgYWdhaW4gaW4gYSBmZXcgbW9tZW50cy4gSWYgeW91IHN0aWxsIHNlZSB0aGlzIGVycm9yLCBjb250YWN0IEhhaWt1IGZvciBzdXBwb3J0LicsXG4gICAgICAgICAgICBjbG9zZVRleHQ6ICdPa2F5JyxcbiAgICAgICAgICAgIGxpZ2h0U2NoZW1lOiB0cnVlXG4gICAgICAgICAgfSlcbiAgICAgICAgICByZXR1cm4gdGhpcy5zZXRTdGF0ZSh7IGVycm9yLCBsYXVuY2hpbmdQcm9qZWN0OiBudWxsIH0pXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgaGFuZGxlSW1wb3J0SW5wdXRDbGljayAoKSB7XG4gICAgdGhpcy5yZWZzLmltcG9ydElucHV0LnNlbGVjdCgpXG4gIH1cblxuICBoYW5kbGVOZXdQcm9qZWN0SW5wdXRDbGljayAoKSB7XG4gICAgdGhpcy5yZWZzLm5ld1Byb2plY3RJbnB1dC5zZWxlY3QoKVxuICB9XG5cbiAgaGFuZGxlTmV3UHJvamVjdElucHV0S2V5UHJlc3MgKGUpIHtcbiAgICBpZiAoZS5jaGFyQ29kZSA9PT0gMTMpIHtcbiAgICAgIHRoaXMuaGFuZGxlTmV3UHJvamVjdEdvKClcbiAgICB9XG4gIH1cblxuICBoYW5kbGVOZXdQcm9qZWN0R28gKCkge1xuICAgIHZhciByYXcgPSB0aGlzLnJlZnMubmV3UHJvamVjdElucHV0LnZhbHVlXG4gICAgLy8gSEFDSzogIHN0cmlwIGFsbCBub24tYWxwaGFudW1lcmljIGNoYXJzIGZvciBub3cuICBzb21ldGhpbmcgbW9yZSB1c2VyLWZyaWVuZGx5IHdvdWxkIGJlIGlkZWFsXG4gICAgdmFyIG5hbWUgPSByYXcgJiYgcmF3LnJlcGxhY2UoL1teYS16MC05XS9naSwgJycpXG5cbiAgICBpZiAodGhpcy5pc1Byb2plY3ROYW1lQmFkKG5hbWUpKSB7XG4gICAgICBjb25zb2xlLndhcm4oJ2JhZCBuYW1lIGVudGVyZWQ6JywgbmFtZSlcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7bmV3UHJvamVjdExvYWRpbmc6IHRydWV9KVxuICAgICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQucmVxdWVzdCh7IG1ldGhvZDogJ2NyZWF0ZVByb2plY3QnLCBwYXJhbXM6IFtuYW1lXSB9LCAoZXJyLCBuZXdQcm9qZWN0KSA9PiB7XG4gICAgICAgIGNvbnN0IHByb2plY3RzTGlzdCA9IHRoaXMuc3RhdGUucHJvamVjdHNMaXN0XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe25ld1Byb2plY3RMb2FkaW5nOiBmYWxzZX0pXG4gICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICBwcm9qZWN0c0xpc3Quc3BsaWNlKDAsIDEpXG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHByb2plY3RzTGlzdCB9KVxuICAgICAgICAgIHRoaXMuc3RhdGUubmV3UHJvamVjdEVycm9yID0gZXJyXG4gICAgICAgICAgdGhpcy5wcm9wcy5jcmVhdGVOb3RpY2Uoe1xuICAgICAgICAgICAgdHlwZTogJ2Vycm9yJyxcbiAgICAgICAgICAgIHRpdGxlOiAnT2ggbm8hJyxcbiAgICAgICAgICAgIG1lc3NhZ2U6ICdXZSBjb3VsZG5cXCd0IGNyZWF0ZSB5b3VyIHByb2plY3QuIPCfmKkgUGxlYXNlIGVuc3VyZSB0aGF0IHlvdXIgY29tcHV0ZXIgaXMgY29ubmVjdGVkIHRvIHRoZSBJbnRlcm5ldC4gSWYgeW91XFwncmUgY29ubmVjdGVkIGFuZCB5b3Ugc3RpbGwgc2VlIHRoaXMgbWVzc2FnZSBvdXIgc2VydmVycyBtaWdodCBiZSBoYXZpbmcgcHJvYmxlbXMuIFBsZWFzZSB0cnkgYWdhaW4gaW4gYSBmZXcgbW9tZW50cy4gSWYgeW91IHN0aWxsIHNlZSB0aGlzIGVycm9yLCBjb250YWN0IEhhaWt1IGZvciBzdXBwb3J0LicsXG4gICAgICAgICAgICBjbG9zZVRleHQ6ICdPa2F5JyxcbiAgICAgICAgICAgIGxpZ2h0U2NoZW1lOiB0cnVlXG4gICAgICAgICAgfSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBzdHJpcCBcIm5ld1wiIHByb2plY3QgZnJvbSB0b3Agb2YgbGlzdCwgdW5zaGlmdCBhY3R1YWwgbmV3IHByb2plY3RcbiAgICAgICAgICB2YXIgcGxhY2Vob2xkZXJQcm9qZWN0ID0gcHJvamVjdHNMaXN0LnNwbGljZSgwLCAxKVswXVxuICAgICAgICAgIG5ld1Byb2plY3QuaXNBY3RpdmUgPSBwbGFjZWhvbGRlclByb2plY3QuaXNBY3RpdmVcbiAgICAgICAgICBwcm9qZWN0c0xpc3QudW5zaGlmdChuZXdQcm9qZWN0KVxuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe3Byb2plY3RMaXN0OiBwcm9qZWN0c0xpc3R9KVxuICAgICAgICAgIC8vIGF1dG8tbGF1bmNoIG5ld2x5IGNyZWF0ZWQgcHJvamVjdFxuICAgICAgICAgIC8vIHRoaXMuaGFuZGxlUHJvamVjdExhdW5jaChuZXdQcm9qZWN0KVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIHByb2plY3RzTGlzdEVsZW1lbnQgKCkge1xuICAgIGlmICh0aGlzLnN0YXRlLmFyZVByb2plY3RzTG9hZGluZykge1xuICAgICAgcmV0dXJuIDxzcGFuIHN0eWxlPXtEQVNIX1NUWUxFUy5sb2FkaW5nV3JhcH0+PEZhZGluZ0NpcmNsZSBzaXplPXszMn0gY29sb3I9e1BhbGV0dGUuUk9DS19NVVRFRH0gLz48L3NwYW4+XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgc3R5bGU9e3toZWlnaHQ6ICdjYWxjKDEwMCUgLSA3MHB4KScsIG92ZXJmbG93WTogJ2F1dG8nfX0+XG4gICAgICAgIHt0aGlzLnN0YXRlLnByb2plY3RzTGlzdC5tYXAoKHByb2plY3RPYmplY3QsIGluZGV4KSA9PiB7XG4gICAgICAgICAgdmFyIHByb2plY3RUaXRsZVxuICAgICAgICAgIGlmIChwcm9qZWN0T2JqZWN0LmlzTmV3KSB7XG4gICAgICAgICAgICAvLyBJZiB0aGlzIGlzIHRoZSBORVcgUFJPSkVDVCBzbG90LCBzaG93IHRoZSBpbnB1dCBVSVxuXG4gICAgICAgICAgICB2YXIgYnV0dG9uQ29udGVudHMgPSAnR08nXG4gICAgICAgICAgICBpZiAodGhpcy5zdGF0ZS5uZXdQcm9qZWN0TG9hZGluZykgYnV0dG9uQ29udGVudHMgPSA8TG9hZGluZ1NwaW5uZXJTVkcgLz5cblxuICAgICAgICAgICAgcHJvamVjdFRpdGxlID0gKFxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXtbREFTSF9TVFlMRVMucHJvamVjdFRpdGxlTmV3XX0+XG4gICAgICAgICAgICAgICAgPGlucHV0IGtleT0nbmV3LXByb2plY3QtaW5wdXQnXG4gICAgICAgICAgICAgICAgICByZWY9J25ld1Byb2plY3RJbnB1dCdcbiAgICAgICAgICAgICAgICAgIGRpc2FibGVkPXt0aGlzLnN0YXRlLm5ld1Byb2plY3RMb2FkaW5nfVxuICAgICAgICAgICAgICAgICAgb25DbGljaz17dGhpcy5oYW5kbGVOZXdQcm9qZWN0SW5wdXRDbGljay5iaW5kKHRoaXMpfVxuICAgICAgICAgICAgICAgICAgb25LZXlQcmVzcz17dGhpcy5oYW5kbGVOZXdQcm9qZWN0SW5wdXRLZXlQcmVzcy5iaW5kKHRoaXMpfVxuICAgICAgICAgICAgICAgICAgc3R5bGU9e1tEQVNIX1NUWUxFUy5uZXdQcm9qZWN0SW5wdXRdfVxuICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9J05ld1Byb2plY3ROYW1lJyAvPlxuICAgICAgICAgICAgICAgIDxidXR0b24ga2V5PSduZXctcHJvamVjdC1nby1idXR0b24nIGRpc2FibGVkPXt0aGlzLnN0YXRlLm5ld1Byb2plY3RMb2FkaW5nfSBvbkNsaWNrPXt0aGlzLmhhbmRsZU5ld1Byb2plY3RHby5iaW5kKHRoaXMpfSBzdHlsZT17W0RBU0hfU1RZTEVTLm5ld1Byb2plY3RHb0J1dHRvbl19PntidXR0b25Db250ZW50c308L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8c3BhbiBrZXk9J25ldy1wcm9qZWN0LWVycm9yJyBzdHlsZT17W0RBU0hfU1RZTEVTLm5ld1Byb2plY3RFcnJvcl19Pnt0aGlzLnN0YXRlLm5ld1Byb2plY3RFcnJvcn08L3NwYW4+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgKVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBvdGhlcndpc2UsIHNob3cgdGhlIHJlYWQtb25seSBQcm9qZWN0IGxpc3RpbmcgYnV0dG9uXG4gICAgICAgICAgICBwcm9qZWN0VGl0bGUgPSA8c3BhbiBzdHlsZT17W0RBU0hfU1RZTEVTLnByb2plY3RUaXRsZSwgcHJvamVjdE9iamVjdC5pc0FjdGl2ZSAmJiBEQVNIX1NUWUxFUy5hY3RpdmVUaXRsZV19Pntwcm9qZWN0T2JqZWN0LnByb2plY3ROYW1lfTwvc3Bhbj5cbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdiBzdHlsZT17W0RBU0hfU1RZTEVTLnByb2plY3RXcmFwcGVyLCBwcm9qZWN0T2JqZWN0LmlzQWN0aXZlICYmIERBU0hfU1RZTEVTLmFjdGl2ZVdyYXBwZXJdfVxuICAgICAgICAgICAgICBrZXk9e2luZGV4fVxuICAgICAgICAgICAgICBvbkRvdWJsZUNsaWNrPXt0aGlzLmhhbmRsZVByb2plY3RMYXVuY2guYmluZCh0aGlzLCBwcm9qZWN0T2JqZWN0KX1cbiAgICAgICAgICAgICAgb25DbGljaz17dGhpcy5zZXRBY3RpdmVQcm9qZWN0LmJpbmQodGhpcywgcHJvamVjdE9iamVjdCwgaW5kZXgpfT5cbiAgICAgICAgICAgICAgPHNwYW4ga2V5PXtgYS0ke3Byb2plY3RPYmplY3QucHJvamVjdE5hbWV9YH0gc3R5bGU9e1twcm9qZWN0T2JqZWN0LmlzQWN0aXZlICYmIERBU0hfU1RZTEVTLmFjdGl2ZVByb2plY3RdfSAvPlxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17W0RBU0hfU1RZTEVTLmxvZ28sIHByb2plY3RPYmplY3QuaXNBY3RpdmUgJiYgREFTSF9TVFlMRVMubG9nb0FjdGl2ZV19PjxMb2dvU1ZHIC8+PC9zcGFuPlxuICAgICAgICAgICAgICB7cHJvamVjdFRpdGxlfVxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17W0RBU0hfU1RZTEVTLmRhdGUsIHByb2plY3RPYmplY3QuaXNBY3RpdmUgJiYgREFTSF9TVFlMRVMuYWN0aXZlRGF0ZV19PlxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e0RBU0hfU1RZTEVTLmRhdGVUaXRsZX0+ey8qIChwcm9qZWN0T2JqZWN0LnVwZGF0ZWQpID8gJ1VQREFURUQnIDogJycgKi99PC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdj57LyogcHJvamVjdE9iamVjdC51cGRhdGVkICovfTwvZGl2PlxuICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICApXG4gICAgICAgIH0pfVxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgdGl0bGVXcmFwcGVyRWxlbWVudCAoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgc3R5bGU9e0RBU0hfU1RZTEVTLnRpdGxlV3JhcHBlcn0+XG4gICAgICAgIDxzcGFuIHN0eWxlPXtEQVNIX1NUWUxFUy5wcm9qZWN0c1RpdGxlfT5Qcm9qZWN0czwvc3Bhbj5cbiAgICAgICAgPGJ1dHRvblxuICAgICAgICAgIHRhYkluZGV4PSctMSdcbiAgICAgICAgICBzdHlsZT17REFTSF9TVFlMRVMuYnRuTmV3UHJvamVjdH1cbiAgICAgICAgICBvbkNsaWNrPXt0aGlzLmxhdW5jaE5ld1Byb2plY3RJbnB1dC5iaW5kKHRoaXMpfT4rPC9idXR0b24+XG4gICAgICAgIHsgIXRoaXMuc3RhdGUuYXJlUHJvamVjdHNMb2FkaW5nICYmIHRoaXMuc3RhdGUucHJvamVjdHNMaXN0Lmxlbmd0aCA9PT0gMFxuICAgICAgICAgID8gPHNwYW4gc3R5bGU9e0RBU0hfU1RZTEVTLnRvb2x0aXB9PjxzcGFuIHN0eWxlPXtEQVNIX1NUWUxFUy5hcnJvd0xlZnR9IC8+Q3JlYXRlIGEgUHJvamVjdDwvc3Bhbj5cbiAgICAgICAgICA6IG51bGxcbiAgICAgICAgfVxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgcHJvamVjdEVkaXRCdXR0b25FbGVtZW50IChwcm9qZWN0T2JqZWN0KSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxidXR0b25cbiAgICAgICAgdGFiSW5kZXg9Jy0xJ1xuICAgICAgICBzdHlsZT17REFTSF9TVFlMRVMuZWRpdFByb2plY3R9XG4gICAgICAgIGRpc2FibGVkPXshIXRoaXMuc3RhdGUubGF1bmNoaW5nUHJvamVjdH1cbiAgICAgICAgb25DbGljaz17dGhpcy5oYW5kbGVQcm9qZWN0TGF1bmNoLmJpbmQodGhpcywgcHJvamVjdE9iamVjdCl9XG4gICAgICAgIGlkPSdwcm9qZWN0LWVkaXQtYnV0dG9uJz5cbiAgICAgICAgT3BlbiBFZGl0b3JcbiAgICAgIDwvYnV0dG9uPlxuICAgIClcbiAgfVxuXG4gIHByb2plY3RGb3JtRWxlbWVudCAocHJvamVjdE9iamVjdCkge1xuICAgIGlmICghcHJvamVjdE9iamVjdCkge1xuICAgICAgaWYgKHRoaXMuc3RhdGUuYXJlUHJvamVjdHNMb2FkaW5nKSB7XG4gICAgICAgIHJldHVybiA8ZGl2IC8+XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdGUucHJvamVjdHNMaXN0Lmxlbmd0aCA9PT0gMCAmJiAhdGhpcy5zdGF0ZS5hcmVQcm9qZWN0c0xvYWRpbmcpIHtcbiAgICAgICAgcmV0dXJuIDxkaXYgc3R5bGU9e1tEQVNIX1NUWUxFUy5lbXB0eVN0YXRlLCBEQVNIX1NUWUxFUy5ub1NlbGVjdF19PkNyZWF0ZSBhIHByb2plY3QgdG8gYmVnaW48L2Rpdj5cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiA8ZGl2IHN0eWxlPXtbREFTSF9TVFlMRVMuZW1wdHlTdGF0ZSwgREFTSF9TVFlMRVMubm9TZWxlY3RdfT5TZWxlY3QgYSBwcm9qZWN0IHRvIGJlZ2luPC9kaXY+XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgaW1wb3J0VXJpID0gYCR7c25ha2VpemUocHJvamVjdE9iamVjdC5wcm9qZWN0TmFtZSl9YFxuICAgIGNvbnN0IGNvbW1hbmRMaW5lU25pcHBldCA9IGBoYWlrdSBpbnN0YWxsICR7aW1wb3J0VXJpfWBcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdj5cbiAgICAgICAgPGRpdiBzdHlsZT17REFTSF9TVFlMRVMuZmllbGRUaXRsZX0+UHJvamVjdCBuYW1lPC9kaXY+XG4gICAgICAgIDxkaXYgc3R5bGU9e3twb3NpdGlvbjogJ3JlbGF0aXZlJ319PlxuICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAga2V5PSdwcm9qZWN0VGl0bGUnXG4gICAgICAgICAgICB2YWx1ZT17cHJvamVjdE9iamVjdC5wcm9qZWN0TmFtZX1cbiAgICAgICAgICAgIHN0eWxlPXtEQVNIX1NUWUxFUy5maWVsZH1cbiAgICAgICAgICAgIHJlYWRPbmx5XG4gICAgICAgICAgICBvbkNoYW5nZT17dGhpcy5oYW5kbGVQcm9qZWN0VGl0bGVDaGFuZ2UuYmluZCh0aGlzLCBwcm9qZWN0T2JqZWN0KX0gLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgc3R5bGU9e0RBU0hfU1RZTEVTLmZpZWxkVGl0bGV9PkltcG9ydCBpbnRvIGEgY29kZWJhc2UgdmlhIGNvbW1hbmQgbGluZTwvZGl2PlxuICAgICAgICA8aW5wdXQga2V5PSdwcm9qZWN0SW1wb3J0VXJpJyByZWY9J2ltcG9ydElucHV0JyBvbkNsaWNrPXt0aGlzLmhhbmRsZUltcG9ydElucHV0Q2xpY2suYmluZCh0aGlzKX0gdmFsdWU9e2NvbW1hbmRMaW5lU25pcHBldH0gc3R5bGU9e1tEQVNIX1NUWUxFUy5maWVsZCwgREFTSF9TVFlMRVMuZmllbGRNb25vXX0gcmVhZE9ubHkgLz5cbiAgICAgICAge3RoaXMucHJvamVjdEVkaXRCdXR0b25FbGVtZW50KHByb2plY3RPYmplY3QpfVxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyTm90aWZpY2F0aW9ucyAoY29udGVudCwgaSkge1xuICAgIHJldHVybiAoXG4gICAgICA8VG9hc3RcbiAgICAgICAgdG9hc3RUeXBlPXtjb250ZW50LnR5cGV9XG4gICAgICAgIHRvYXN0VGl0bGU9e2NvbnRlbnQudGl0bGV9XG4gICAgICAgIHRvYXN0TWVzc2FnZT17Y29udGVudC5tZXNzYWdlfVxuICAgICAgICBjbG9zZVRleHQ9e2NvbnRlbnQuY2xvc2VUZXh0fVxuICAgICAgICBrZXk9e2kgKyBjb250ZW50LnRpdGxlfVxuICAgICAgICBteUtleT17aX1cbiAgICAgICAgcmVtb3ZlTm90aWNlPXt0aGlzLnByb3BzLnJlbW92ZU5vdGljZX1cbiAgICAgICAgbGlnaHRTY2hlbWU9e2NvbnRlbnQubGlnaHRTY2hlbWV9IC8+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyICgpIHtcbiAgICBjb25zdCBhY3RpdmVQcm9qZWN0ID0gbG9kYXNoLmZpbmQodGhpcy5zdGF0ZS5wcm9qZWN0c0xpc3QsIHsgaXNBY3RpdmU6IHRydWUgfSlcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdj5cbiAgICAgICAgPFJlYWN0Q1NTVHJhbnNpdGlvbkdyb3VwXG4gICAgICAgICAgdHJhbnNpdGlvbk5hbWU9J3RvYXN0J1xuICAgICAgICAgIHRyYW5zaXRpb25FbnRlclRpbWVvdXQ9ezUwMH1cbiAgICAgICAgICB0cmFuc2l0aW9uTGVhdmVUaW1lb3V0PXszMDB9PlxuICAgICAgICAgIDxkaXYgc3R5bGU9e3twb3NpdGlvbjogJ2Fic29sdXRlJywgcmlnaHQ6IDAsIHRvcDogMCwgd2lkdGg6IDMwMH19PlxuICAgICAgICAgICAge2xvZGFzaC5tYXAodGhpcy5wcm9wcy5ub3RpY2VzLCB0aGlzLnJlbmRlck5vdGlmaWNhdGlvbnMpfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L1JlYWN0Q1NTVHJhbnNpdGlvbkdyb3VwPlxuICAgICAgICA8ZGl2IHN0eWxlPXtbREFTSF9TVFlMRVMuZGFzaExldmVsV3JhcHBlciwgREFTSF9TVFlMRVMuYXBwZWFyRGFzaExldmVsXX0+XG4gICAgICAgICAgPGRpdiBzdHlsZT17REFTSF9TVFlMRVMuZnJhbWV9IGNsYXNzTmFtZT0nZnJhbWUnIC8+XG4gICAgICAgICAgPGRpdiBzdHlsZT17REFTSF9TVFlMRVMucHJvamVjdHNCYXJ9PlxuICAgICAgICAgICAge3RoaXMudGl0bGVXcmFwcGVyRWxlbWVudCgpfVxuICAgICAgICAgICAge3RoaXMucHJvamVjdHNMaXN0RWxlbWVudCgpfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgc3R5bGU9e0RBU0hfU1RZTEVTLmRldGFpbHN9PlxuICAgICAgICAgICAgPGRpdiBzdHlsZT17REFTSF9TVFlMRVMuY2VudGVyQ29sfT5cbiAgICAgICAgICAgICAge2FjdGl2ZVByb2plY3QgJiYgYWN0aXZlUHJvamVjdC5pc05ld1xuICAgICAgICAgICAgICAgID8gPHNwYW4gLz5cbiAgICAgICAgICAgICAgICA6IHRoaXMucHJvamVjdEZvcm1FbGVtZW50KGFjdGl2ZVByb2plY3QpfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICB7dGhpcy5zdGF0ZS5sYXVuY2hpbmdQcm9qZWN0ICYmIDxQcm9qZWN0TG9hZGVyIC8+fVxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG59XG5cbmZ1bmN0aW9uIHNuYWtlaXplIChzdHIpIHtcbiAgc3RyID0gc3RyIHx8ICcnXG4gIHJldHVybiBzdHIucmVwbGFjZSgvIC9nLCAnXycpXG59XG5cbi8vIGZ1bmN0aW9uIHVuaXF1ZVByb2plY3RUaXRsZSAocHJvamVjdHNMaXN0LCB0aXRsZSkge1xuLy8gICBjb25zdCBtYXRjaGVkUHJvamVjdHMgPSBmaWx0ZXIocHJvamVjdHNMaXN0LCB7IHRpdGxlIH0pXG4vLyAgIGlmIChtYXRjaGVkUHJvamVjdHMubGVuZ3RoIDwgMSkgcmV0dXJuIHRpdGxlXG4vLyAgIC8vIFRPRE86IFBsZWFzZSBtYWtlIHRoaXMgYWxnb3JpdGhtIHJvYnVzdFxuLy8gICByZXR1cm4gYCR7dGl0bGV9ICR7cHJvamVjdHNMaXN0Lmxlbmd0aCArIDF9YFxuLy8gfVxuXG5leHBvcnQgZGVmYXVsdCBSYWRpdW0oUHJvamVjdEJyb3dzZXIpXG4iXX0=