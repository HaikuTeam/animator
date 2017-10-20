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

var HARDCODED_PROJECTS_LIMIT = 15;

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

      if (this.alreadyHasTooManyProjects()) {
        return void 0;
      }

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
            _this8.props.createNotice({
              type: 'error',
              title: 'Oh no!',
              message: 'We couldn\'t create your project. 😩 Does this project with this name already exist?',
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
              lineNumber: 231
            },
            __self: this
          },
          _react2.default.createElement(_betterReactSpinkit.FadingCircle, { size: 32, color: _Palette2.default.ROCK_MUTED, __source: {
              fileName: _jsxFileName,
              lineNumber: 232
            },
            __self: this
          })
        );
      }

      return _react2.default.createElement(
        'div',
        { style: { height: 'calc(100% - 70px)', overflowY: 'auto' }, __source: {
            fileName: _jsxFileName,
            lineNumber: 238
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
                lineNumber: 245
              },
              __self: _this9
            });

            projectTitle = _react2.default.createElement(
              'div',
              { style: [_dashShared.DASH_STYLES.projectTitleNew], __source: {
                  fileName: _jsxFileName,
                  lineNumber: 248
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
                  lineNumber: 249
                },
                __self: _this9
              }),
              _react2.default.createElement(
                'button',
                { key: 'new-project-go-button', disabled: _this9.state.newProjectLoading, onClick: _this9.handleNewProjectGo.bind(_this9), style: [_dashShared.DASH_STYLES.newProjectGoButton], __source: {
                    fileName: _jsxFileName,
                    lineNumber: 256
                  },
                  __self: _this9
                },
                buttonContents
              ),
              _react2.default.createElement(
                'span',
                { key: 'new-project-error', style: [_dashShared.DASH_STYLES.newProjectError], __source: {
                    fileName: _jsxFileName,
                    lineNumber: 257
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
                  lineNumber: 262
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
                lineNumber: 266
              },
              __self: _this9
            },
            _react2.default.createElement('span', { key: 'a-' + projectObject.projectName, style: [projectObject.isActive && _dashShared.DASH_STYLES.activeProject], __source: {
                fileName: _jsxFileName,
                lineNumber: 270
              },
              __self: _this9
            }),
            _react2.default.createElement(
              'span',
              { style: [_dashShared.DASH_STYLES.logo, projectObject.isActive && _dashShared.DASH_STYLES.logoActive], __source: {
                  fileName: _jsxFileName,
                  lineNumber: 271
                },
                __self: _this9
              },
              _react2.default.createElement(_Icons.LogoSVG, {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 271
                },
                __self: _this9
              })
            ),
            projectTitle,
            _react2.default.createElement(
              'span',
              { style: [_dashShared.DASH_STYLES.date, projectObject.isActive && _dashShared.DASH_STYLES.activeDate], __source: {
                  fileName: _jsxFileName,
                  lineNumber: 273
                },
                __self: _this9
              },
              _react2.default.createElement('div', { style: _dashShared.DASH_STYLES.dateTitle, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 274
                },
                __self: _this9
              }),
              _react2.default.createElement('div', {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 275
                },
                __self: _this9
              })
            )
          );
        })
      );
    }
  }, {
    key: 'alreadyHasTooManyProjects',
    value: function alreadyHasTooManyProjects() {
      return !this.state.areProjectsLoading && this.state.projectsList && this.state.projectsList.length >= HARDCODED_PROJECTS_LIMIT;
    }
  }, {
    key: 'titleWrapperElement',
    value: function titleWrapperElement() {
      if (this.alreadyHasTooManyProjects()) {
        return _react2.default.createElement(
          'div',
          { style: _dashShared.DASH_STYLES.titleWrapper, __source: {
              fileName: _jsxFileName,
              lineNumber: 295
            },
            __self: this
          },
          _react2.default.createElement(
            'span',
            { style: _dashShared.DASH_STYLES.projectsTitle, __source: {
                fileName: _jsxFileName,
                lineNumber: 296
              },
              __self: this
            },
            'Projects'
          ),
          _react2.default.createElement(
            'span',
            { style: { color: _Palette2.default.ORANGE }, __source: {
                fileName: _jsxFileName,
                lineNumber: 297
              },
              __self: this
            },
            'Project limit: ',
            HARDCODED_PROJECTS_LIMIT
          )
        );
      }

      return _react2.default.createElement(
        'div',
        { style: _dashShared.DASH_STYLES.titleWrapper, __source: {
            fileName: _jsxFileName,
            lineNumber: 303
          },
          __self: this
        },
        _react2.default.createElement(
          'span',
          { style: _dashShared.DASH_STYLES.projectsTitle, __source: {
              fileName: _jsxFileName,
              lineNumber: 304
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
              lineNumber: 305
            },
            __self: this
          },
          '+'
        ),
        !this.state.areProjectsLoading && this.state.projectsList.length === 0 ? _react2.default.createElement(
          'span',
          { style: _dashShared.DASH_STYLES.tooltip, __source: {
              fileName: _jsxFileName,
              lineNumber: 310
            },
            __self: this
          },
          _react2.default.createElement('span', { style: _dashShared.DASH_STYLES.arrowLeft, __source: {
              fileName: _jsxFileName,
              lineNumber: 310
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
            lineNumber: 319
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
              lineNumber: 333
            },
            __self: this
          });
        } else if (this.state.projectsList.length === 0 && !this.state.areProjectsLoading) {
          return _react2.default.createElement(
            'div',
            { style: [_dashShared.DASH_STYLES.emptyState, _dashShared.DASH_STYLES.noSelect], __source: {
                fileName: _jsxFileName,
                lineNumber: 335
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
                lineNumber: 337
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
            lineNumber: 344
          },
          __self: this
        },
        _react2.default.createElement(
          'div',
          { style: _dashShared.DASH_STYLES.fieldTitle, __source: {
              fileName: _jsxFileName,
              lineNumber: 345
            },
            __self: this
          },
          'Project name'
        ),
        _react2.default.createElement(
          'div',
          { style: { position: 'relative' }, __source: {
              fileName: _jsxFileName,
              lineNumber: 346
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
              lineNumber: 347
            },
            __self: this
          })
        ),
        _react2.default.createElement(
          'div',
          { style: _dashShared.DASH_STYLES.fieldTitle, __source: {
              fileName: _jsxFileName,
              lineNumber: 354
            },
            __self: this
          },
          'Import into a codebase via command line'
        ),
        _react2.default.createElement('input', { key: 'projectImportUri', ref: 'importInput', onClick: this.handleImportInputClick.bind(this), value: commandLineSnippet, style: [_dashShared.DASH_STYLES.field, _dashShared.DASH_STYLES.fieldMono], readOnly: true, __source: {
            fileName: _jsxFileName,
            lineNumber: 355
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
          lineNumber: 363
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
            lineNumber: 378
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
              lineNumber: 379
            },
            __self: this
          },
          _react2.default.createElement(
            'div',
            { style: { position: 'absolute', right: 0, top: 0, width: 300 }, __source: {
                fileName: _jsxFileName,
                lineNumber: 383
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
              lineNumber: 387
            },
            __self: this
          },
          _react2.default.createElement('div', { style: _dashShared.DASH_STYLES.frame, className: 'frame', __source: {
              fileName: _jsxFileName,
              lineNumber: 388
            },
            __self: this
          }),
          _react2.default.createElement(
            'div',
            { style: _dashShared.DASH_STYLES.projectsBar, __source: {
                fileName: _jsxFileName,
                lineNumber: 389
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
                lineNumber: 393
              },
              __self: this
            },
            _react2.default.createElement(
              'div',
              { style: _dashShared.DASH_STYLES.centerCol, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 394
                },
                __self: this
              },
              activeProject && activeProject.isNew ? _react2.default.createElement('span', {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 396
                },
                __self: this
              }) : this.projectFormElement(activeProject)
            )
          )
        ),
        this.state.launchingProject && _react2.default.createElement(_ProjectLoader2.default, {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 401
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9yZWFjdC9jb21wb25lbnRzL1Byb2plY3RCcm93c2VyLmpzIl0sIm5hbWVzIjpbIkhBUkRDT0RFRF9QUk9KRUNUU19MSU1JVCIsIlByb2plY3RCcm93c2VyIiwicHJvcHMiLCJyZW5kZXJOb3RpZmljYXRpb25zIiwiYmluZCIsInN0YXRlIiwiZXJyb3IiLCJzaG93TmVlZHNTYXZlRGlhbG9ndWUiLCJwcm9qZWN0c0xpc3QiLCJhcmVQcm9qZWN0c0xvYWRpbmciLCJsYXVuY2hpbmdQcm9qZWN0IiwiaGFuZGxlRG9jdW1lbnRLZXlQcmVzcyIsImhhbmRsZVNlbGVjdFByb2plY3QiLCJsb2FkUHJvamVjdHMiLCJkb2N1bWVudCIsImFkZEV2ZW50TGlzdGVuZXIiLCJlbnZveSIsImdldCIsInRoZW4iLCJ0b3VyQ2hhbm5lbCIsIm9uIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsIm9mZiIsInByb2plY3RJZHgiLCJmaW5kSW5kZXgiLCJwcm9qZWN0IiwicHJvamVjdE5hbWUiLCJzZXRBY3RpdmVQcm9qZWN0IiwiZXZ0IiwiZGVsdGEiLCJjb2RlIiwiZm91bmQiLCJmb3JFYWNoIiwiaSIsImlzQWN0aXZlIiwicHJvcG9zZWRJbmRleCIsImlzTmV3IiwibmV3UHJvamVjdExvYWRpbmciLCJzaGlmdCIsIm5ld0luZGV4IiwiTWF0aCIsIm1pbiIsIm1heCIsImxlbmd0aCIsInNldFN0YXRlIiwiY3JlYXRlTm90aWNlIiwidHlwZSIsInRpdGxlIiwibWVzc2FnZSIsImNsb3NlVGV4dCIsImxpZ2h0U2NoZW1lIiwicHJvamVjdE9iamVjdCIsInByb2plY3RJbmRleCIsImZvdW5kUHJvamVjdCIsImZvdW5kSW5kZXgiLCJjaGFuZ2VFdmVudCIsImlzUHJvamVjdE5hbWVCYWQiLCJ0YXJnZXQiLCJ2YWx1ZSIsImFscmVhZHlIYXNUb29NYW55UHJvamVjdHMiLCJ1bnNoaWZ0Iiwic2V0VGltZW91dCIsInJlZnMiLCJuZXdQcm9qZWN0SW5wdXQiLCJzZWxlY3QiLCJjb25zb2xlIiwid2FybiIsImxhdW5jaFByb2plY3QiLCJpbXBvcnRJbnB1dCIsImUiLCJjaGFyQ29kZSIsImhhbmRsZU5ld1Byb2plY3RHbyIsInJhdyIsIm5hbWUiLCJyZXBsYWNlIiwid2Vic29ja2V0IiwicmVxdWVzdCIsIm1ldGhvZCIsInBhcmFtcyIsImVyciIsIm5ld1Byb2plY3QiLCJzcGxpY2UiLCJwbGFjZWhvbGRlclByb2plY3QiLCJwcm9qZWN0TGlzdCIsImxvYWRpbmdXcmFwIiwiUk9DS19NVVRFRCIsImhlaWdodCIsIm92ZXJmbG93WSIsIm1hcCIsImluZGV4IiwicHJvamVjdFRpdGxlIiwiYnV0dG9uQ29udGVudHMiLCJwcm9qZWN0VGl0bGVOZXciLCJoYW5kbGVOZXdQcm9qZWN0SW5wdXRDbGljayIsImhhbmRsZU5ld1Byb2plY3RJbnB1dEtleVByZXNzIiwibmV3UHJvamVjdEdvQnV0dG9uIiwibmV3UHJvamVjdEVycm9yIiwiYWN0aXZlVGl0bGUiLCJwcm9qZWN0V3JhcHBlciIsImFjdGl2ZVdyYXBwZXIiLCJoYW5kbGVQcm9qZWN0TGF1bmNoIiwiYWN0aXZlUHJvamVjdCIsImxvZ28iLCJsb2dvQWN0aXZlIiwiZGF0ZSIsImFjdGl2ZURhdGUiLCJkYXRlVGl0bGUiLCJ0aXRsZVdyYXBwZXIiLCJwcm9qZWN0c1RpdGxlIiwiY29sb3IiLCJPUkFOR0UiLCJidG5OZXdQcm9qZWN0IiwibGF1bmNoTmV3UHJvamVjdElucHV0IiwidG9vbHRpcCIsImFycm93TGVmdCIsImVkaXRQcm9qZWN0IiwiZW1wdHlTdGF0ZSIsIm5vU2VsZWN0IiwiaW1wb3J0VXJpIiwic25ha2VpemUiLCJjb21tYW5kTGluZVNuaXBwZXQiLCJmaWVsZFRpdGxlIiwicG9zaXRpb24iLCJmaWVsZCIsImhhbmRsZVByb2plY3RUaXRsZUNoYW5nZSIsImhhbmRsZUltcG9ydElucHV0Q2xpY2siLCJmaWVsZE1vbm8iLCJwcm9qZWN0RWRpdEJ1dHRvbkVsZW1lbnQiLCJjb250ZW50IiwicmVtb3ZlTm90aWNlIiwiZmluZCIsInJpZ2h0IiwidG9wIiwid2lkdGgiLCJub3RpY2VzIiwiZGFzaExldmVsV3JhcHBlciIsImFwcGVhckRhc2hMZXZlbCIsImZyYW1lIiwicHJvamVjdHNCYXIiLCJ0aXRsZVdyYXBwZXJFbGVtZW50IiwicHJvamVjdHNMaXN0RWxlbWVudCIsImRldGFpbHMiLCJjZW50ZXJDb2wiLCJwcm9qZWN0Rm9ybUVsZW1lbnQiLCJDb21wb25lbnQiLCJzdHIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7QUFFQSxJQUFNQSwyQkFBMkIsRUFBakM7O0lBRU1DLGM7OztBQUNKLDBCQUFhQyxLQUFiLEVBQW9CO0FBQUE7O0FBQUEsZ0lBQ1pBLEtBRFk7O0FBRWxCLFVBQUtDLG1CQUFMLEdBQTJCLE1BQUtBLG1CQUFMLENBQXlCQyxJQUF6QixPQUEzQjtBQUNBLFVBQUtDLEtBQUwsR0FBYTtBQUNYQyxhQUFPLElBREk7QUFFWEMsNkJBQXVCLEtBRlo7QUFHWEMsb0JBQWMsRUFISDtBQUlYQywwQkFBb0IsSUFKVDtBQUtYQyx3QkFBa0I7QUFMUCxLQUFiO0FBT0EsVUFBS0Msc0JBQUwsR0FBOEIsTUFBS0Esc0JBQUwsQ0FBNEJQLElBQTVCLE9BQTlCO0FBQ0EsVUFBS1EsbUJBQUwsR0FBMkIsTUFBS0EsbUJBQUwsQ0FBeUJSLElBQXpCLE9BQTNCO0FBWGtCO0FBWW5COzs7O3dDQUVvQjtBQUFBOztBQUNuQixXQUFLUyxZQUFMO0FBQ0FDLGVBQVNDLGdCQUFULENBQTBCLFNBQTFCLEVBQXFDLEtBQUtKLHNCQUExQyxFQUFrRSxJQUFsRTs7QUFFQSxXQUFLVCxLQUFMLENBQVdjLEtBQVgsQ0FBaUJDLEdBQWpCLENBQXFCLE1BQXJCLEVBQTZCQyxJQUE3QixDQUFrQyxVQUFDQyxXQUFELEVBQWlCO0FBQ2pELGVBQUtBLFdBQUwsR0FBbUJBLFdBQW5CO0FBQ0FBLG9C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LFFBQVQsQ0FBbUIwQixHQUFuQixFQUF3QjtBQUN0QkEsUUFBTUEsT0FBTyxFQUFiO0FBQ0EsU0FBT0EsSUFBSXZFLE9BQUosQ0FBWSxJQUFaLEVBQWtCLEdBQWxCLENBQVA7QUFDRDs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O2tCQUVlLHNCQUFPekUsY0FBUCxDIiwiZmlsZSI6IlByb2plY3RCcm93c2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGxvZGFzaCBmcm9tICdsb2Rhc2gnXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgUmFkaXVtIGZyb20gJ3JhZGl1bSdcbmltcG9ydCBSZWFjdENTU1RyYW5zaXRpb25Hcm91cCBmcm9tICdyZWFjdC1hZGRvbnMtY3NzLXRyYW5zaXRpb24tZ3JvdXAnXG5pbXBvcnQgeyBGYWRpbmdDaXJjbGUgfSBmcm9tICdiZXR0ZXItcmVhY3Qtc3BpbmtpdCdcbmltcG9ydCBQYWxldHRlIGZyb20gJy4vUGFsZXR0ZSdcbmltcG9ydCBUb2FzdCBmcm9tICcuL25vdGlmaWNhdGlvbnMvVG9hc3QnXG5pbXBvcnQgUHJvamVjdExvYWRlciBmcm9tICcuL1Byb2plY3RMb2FkZXInXG5pbXBvcnQgeyBMb2dvU1ZHLCBMb2FkaW5nU3Bpbm5lclNWRyB9IGZyb20gJy4vSWNvbnMnXG5pbXBvcnQgeyBEQVNIX1NUWUxFUyB9IGZyb20gJy4uL3N0eWxlcy9kYXNoU2hhcmVkJ1xuXG5jb25zdCBIQVJEQ09ERURfUFJPSkVDVFNfTElNSVQgPSAxNVxuXG5jbGFzcyBQcm9qZWN0QnJvd3NlciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yIChwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKVxuICAgIHRoaXMucmVuZGVyTm90aWZpY2F0aW9ucyA9IHRoaXMucmVuZGVyTm90aWZpY2F0aW9ucy5iaW5kKHRoaXMpXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIGVycm9yOiBudWxsLFxuICAgICAgc2hvd05lZWRzU2F2ZURpYWxvZ3VlOiBmYWxzZSxcbiAgICAgIHByb2plY3RzTGlzdDogW10sXG4gICAgICBhcmVQcm9qZWN0c0xvYWRpbmc6IHRydWUsXG4gICAgICBsYXVuY2hpbmdQcm9qZWN0OiBmYWxzZVxuICAgIH1cbiAgICB0aGlzLmhhbmRsZURvY3VtZW50S2V5UHJlc3MgPSB0aGlzLmhhbmRsZURvY3VtZW50S2V5UHJlc3MuYmluZCh0aGlzKVxuICAgIHRoaXMuaGFuZGxlU2VsZWN0UHJvamVjdCA9IHRoaXMuaGFuZGxlU2VsZWN0UHJvamVjdC5iaW5kKHRoaXMpXG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCAoKSB7XG4gICAgdGhpcy5sb2FkUHJvamVjdHMoKVxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLmhhbmRsZURvY3VtZW50S2V5UHJlc3MsIHRydWUpXG5cbiAgICB0aGlzLnByb3BzLmVudm95LmdldCgndG91cicpLnRoZW4oKHRvdXJDaGFubmVsKSA9PiB7XG4gICAgICB0aGlzLnRvdXJDaGFubmVsID0gdG91ckNoYW5uZWxcbiAgICAgIHRvdXJDaGFubmVsLm9uKCd0b3VyOnJlcXVlc3RTZWxlY3RQcm9qZWN0JywgdGhpcy5oYW5kbGVTZWxlY3RQcm9qZWN0KVxuICAgIH0pXG4gIH1cblxuICBjb21wb25lbnRXaWxsVW5tb3VudCAoKSB7XG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRoaXMuaGFuZGxlRG9jdW1lbnRLZXlQcmVzcywgdHJ1ZSlcbiAgICB0aGlzLnRvdXJDaGFubmVsLm9mZigndG91cjpyZXF1ZXN0U2VsZWN0UHJvamVjdCcsIHRoaXMuaGFuZGxlU2VsZWN0UHJvamVjdClcbiAgfVxuXG4gIGhhbmRsZVNlbGVjdFByb2plY3QgKCkge1xuICAgIGNvbnN0IHByb2plY3RJZHggPSB0aGlzLnN0YXRlLnByb2plY3RzTGlzdC5maW5kSW5kZXgoKHByb2plY3QpID0+IHtcbiAgICAgIC8vIEhhcmRjb2RlZCAtIE5hbWUgb2YgdGhlIHByb2plY3QgdGhhdCB3aWxsIGJlIHVzZWQgZm9yIHRoZSB0dXRvcmlhbFxuICAgICAgcmV0dXJuIHByb2plY3QucHJvamVjdE5hbWUgPT09ICdDaGVja1R1dG9yaWFsJ1xuICAgIH0pXG5cbiAgICB0aGlzLnNldEFjdGl2ZVByb2plY3QodGhpcy5zdGF0ZS5wcm9qZWN0c0xpc3RbcHJvamVjdElkeF0sIHByb2plY3RJZHgpXG4gIH1cblxuICBoYW5kbGVEb2N1bWVudEtleVByZXNzIChldnQpIHtcbiAgICB2YXIgcHJvamVjdHNMaXN0ID0gdGhpcy5zdGF0ZS5wcm9qZWN0c0xpc3RcblxuICAgIHZhciBkZWx0YSA9IDBcbiAgICBpZiAoZXZ0LmNvZGUgPT09ICdBcnJvd1VwJykge1xuICAgICAgZGVsdGEgPSAtMVxuICAgIH0gZWxzZSBpZiAoZXZ0LmNvZGUgPT09ICdBcnJvd0Rvd24nKSB7XG4gICAgICBkZWx0YSA9IDFcbiAgICB9XG5cbiAgICB2YXIgZm91bmQgPSBmYWxzZVxuICAgIHByb2plY3RzTGlzdC5mb3JFYWNoKChwcm9qZWN0LCBpKSA9PiB7XG4gICAgICBpZiAoIWZvdW5kICYmIHByb2plY3QuaXNBY3RpdmUpIHtcbiAgICAgICAgdmFyIHByb3Bvc2VkSW5kZXggPSBpICsgZGVsdGFcbiAgICAgICAgLy8gcmVtb3ZlIGNyZWF0ZSBVSSBpZiBuYXZpZ2F0aW5nIGF3YXkgYmVmb3JlIHN1Ym1pdHRpbmdcbiAgICAgICAgaWYgKGkgPT09IDAgJiYgZGVsdGEgPT09IDEgJiYgcHJvamVjdC5pc05ldyAmJiAhdGhpcy5zdGF0ZS5uZXdQcm9qZWN0TG9hZGluZykge1xuICAgICAgICAgIHByb3Bvc2VkSW5kZXggPSAwXG4gICAgICAgICAgcHJvamVjdHNMaXN0LnNoaWZ0KClcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBuZXdJbmRleCA9IE1hdGgubWluKE1hdGgubWF4KDAsIHByb3Bvc2VkSW5kZXgpLCBwcm9qZWN0c0xpc3QubGVuZ3RoIC0gMSlcblxuICAgICAgICBwcm9qZWN0LmlzQWN0aXZlID0gZmFsc2VcbiAgICAgICAgcHJvamVjdHNMaXN0W25ld0luZGV4XS5pc0FjdGl2ZSA9IHRydWVcbiAgICAgICAgZm91bmQgPSB0cnVlXG4gICAgICB9XG4gICAgfSlcbiAgICB0aGlzLnNldFN0YXRlKHtwcm9qZWN0c0xpc3R9KVxuICB9XG5cbiAgbG9hZFByb2plY3RzICgpIHtcbiAgICByZXR1cm4gdGhpcy5wcm9wcy5sb2FkUHJvamVjdHMoKGVycm9yLCBwcm9qZWN0c0xpc3QpID0+IHtcbiAgICAgIGlmIChlcnJvcikge1xuICAgICAgICB0aGlzLnByb3BzLmNyZWF0ZU5vdGljZSh7XG4gICAgICAgICAgdHlwZTogJ2Vycm9yJyxcbiAgICAgICAgICB0aXRsZTogJ09oIG5vIScsXG4gICAgICAgICAgbWVzc2FnZTogJ1dlIGNvdWxkblxcJ3QgbG9hZCB5b3VyIHRlYW1cXCdzIHByb2plY3RzLiDwn5iiIFBsZWFzZSBlbnN1cmUgdGhhdCB5b3VyIGNvbXB1dGVyIGlzIGNvbm5lY3RlZCB0byB0aGUgSW50ZXJuZXQuIElmIHlvdVxcJ3JlIGNvbm5lY3RlZCBhbmQgeW91IHN0aWxsIHNlZSB0aGlzIG1lc3NhZ2Ugb3VyIHNlcnZlcnMgbWlnaHQgYmUgaGF2aW5nIHByb2JsZW1zLiBQbGVhc2UgdHJ5IGFnYWluIGluIGEgZmV3IG1vbWVudHMuIElmIHlvdSBzdGlsbCBzZWUgdGhpcyBtZXNzYWdlLCBjb250YWN0IEhhaWt1IGZvciBzdXBwb3J0LicsXG4gICAgICAgICAgY2xvc2VUZXh0OiAnT2theScsXG4gICAgICAgICAgbGlnaHRTY2hlbWU6IHRydWVcbiAgICAgICAgfSlcbiAgICAgICAgcmV0dXJuIHRoaXMuc2V0U3RhdGUoeyBlcnJvciwgYXJlUHJvamVjdHNMb2FkaW5nOiBmYWxzZSB9KVxuICAgICAgfVxuICAgICAgLy8gc2VsZWN0IHRoZSBmaXJzdCBwcm9qZWN0IGJ5IGRlZmF1bHRcbiAgICAgIGlmIChwcm9qZWN0c0xpc3QubGVuZ3RoKSB7XG4gICAgICAgIHByb2plY3RzTGlzdFswXS5pc0FjdGl2ZSA9IHRydWVcbiAgICAgIH1cbiAgICAgIHRoaXMuc2V0U3RhdGUoeyBwcm9qZWN0c0xpc3QsIGFyZVByb2plY3RzTG9hZGluZzogZmFsc2UgfSlcbiAgICB9KVxuICB9XG5cbiAgc2V0QWN0aXZlUHJvamVjdCAocHJvamVjdE9iamVjdCwgcHJvamVjdEluZGV4KSB7XG4gICAgY29uc3QgcHJvamVjdHNMaXN0ID0gdGhpcy5zdGF0ZS5wcm9qZWN0c0xpc3RcblxuICAgIC8vIFRPRE86IGlmIGN1cnJlbnQgcHJvamVjdCBoYXMgdW5zYXZlZCBlZGl0cyB0aGVuIHNob3cgc2F2ZSBkaWFsb2d1ZVxuICAgIC8vICAgICAgIGFuZCByZXR1cm4gd2l0aG91dCBjaGFuZ2luZyBwcm9qZWN0c1xuICAgIC8vIGlmIChmYWxzZSkge1xuICAgIC8vICAgdGhpcy5zZXRTdGF0ZSh7IHNob3dOZWVkc1NhdmVEaWFsb2d1ZTogdHJ1ZSB9KVxuICAgIC8vICAgcmV0dXJuIGZhbHNlXG4gICAgLy8gfVxuXG4gICAgcHJvamVjdHNMaXN0LmZvckVhY2goKGZvdW5kUHJvamVjdCwgZm91bmRJbmRleCkgPT4ge1xuICAgICAgLy8gcmVtb3ZlIG5ldyBwcm9qZWN0IGlmIG5hdmlnYXRpbmcgYXdheSBiZWZvcmUgaXQncyBjb21wbGV0ZVxuICAgICAgaWYgKHByb2plY3RJbmRleCAhPT0gMCAmJiBmb3VuZEluZGV4ID09PSAwICYmIGZvdW5kUHJvamVjdC5pc05ldyAmJiAhdGhpcy5zdGF0ZS5uZXdQcm9qZWN0TG9hZGluZykgcHJvamVjdHNMaXN0LnNoaWZ0KClcbiAgICAgIGlmIChmb3VuZEluZGV4ID09PSBwcm9qZWN0SW5kZXgpIGZvdW5kUHJvamVjdC5pc0FjdGl2ZSA9IHRydWVcbiAgICAgIGVsc2UgZm91bmRQcm9qZWN0LmlzQWN0aXZlID0gZmFsc2VcbiAgICB9KVxuICAgIHRoaXMuc2V0U3RhdGUoeyBwcm9qZWN0c0xpc3QgfSlcbiAgfVxuXG4gIGhhbmRsZVByb2plY3RUaXRsZUNoYW5nZSAocHJvamVjdE9iamVjdCwgY2hhbmdlRXZlbnQpIHtcbiAgICBpZiAoIXRoaXMuaXNQcm9qZWN0TmFtZUJhZChjaGFuZ2VFdmVudC50YXJnZXQudmFsdWUpKSB7XG4gICAgICBwcm9qZWN0T2JqZWN0LnByb2plY3ROYW1lID0gY2hhbmdlRXZlbnQudGFyZ2V0LnZhbHVlXG4gICAgfVxuICAgIHRoaXMuc2V0U3RhdGUoeyBwcm9qZWN0c0xpc3Q6IHRoaXMuc3RhdGUucHJvamVjdHNMaXN0IH0pXG4gIH1cblxuICBsYXVuY2hOZXdQcm9qZWN0SW5wdXQgKCkge1xuICAgIGlmICh0aGlzLmFscmVhZHlIYXNUb29NYW55UHJvamVjdHMoKSkge1xuICAgICAgcmV0dXJuIHZvaWQgKDApXG4gICAgfVxuXG4gICAgdmFyIHByb2plY3RzTGlzdCA9IHRoaXMuc3RhdGUucHJvamVjdHNMaXN0XG4gICAgaWYgKCFwcm9qZWN0c0xpc3RbMF0gfHwgIXByb2plY3RzTGlzdFswXS5pc05ldykge1xuICAgICAgcHJvamVjdHNMaXN0LmZvckVhY2goKGZvdW5kUHJvamVjdCwgZm91bmRJbmRleCkgPT4ge1xuICAgICAgICBmb3VuZFByb2plY3QuaXNBY3RpdmUgPSBmYWxzZVxuICAgICAgfSlcbiAgICAgIHByb2plY3RzTGlzdC51bnNoaWZ0KHtcbiAgICAgICAgaXNBY3RpdmU6IHRydWUsXG4gICAgICAgIGlzTmV3OiB0cnVlLFxuICAgICAgICB0aXRsZTogJydcbiAgICAgIH0pXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgdGhpcy5yZWZzLm5ld1Byb2plY3RJbnB1dC5zZWxlY3QoKVxuICAgICAgfSwgNTApXG4gICAgICB0aGlzLnNldFN0YXRlKHsgcHJvamVjdHNMaXN0IH0pXG4gICAgfVxuICB9XG5cbiAgaXNQcm9qZWN0TmFtZUJhZCAocHJvamVjdE5hbWUpIHtcbiAgICBpZiAoIXByb2plY3ROYW1lKSByZXR1cm4gdHJ1ZVxuICAgIGlmIChwcm9qZWN0TmFtZSA9PT0gJycpIHJldHVybiB0cnVlXG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICBoYW5kbGVQcm9qZWN0TGF1bmNoIChwcm9qZWN0T2JqZWN0KSB7XG4gICAgaWYgKHRoaXMuaXNQcm9qZWN0TmFtZUJhZChwcm9qZWN0T2JqZWN0LnByb2plY3ROYW1lKSkge1xuICAgICAgY29uc29sZS53YXJuKCdiYWQgbmFtZSBsYXVuY2hlZDonLCBwcm9qZWN0T2JqZWN0LnByb2plY3ROYW1lKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHsgbGF1bmNoaW5nUHJvamVjdDogcHJvamVjdE9iamVjdCB9KVxuICAgICAgLy8gcHJvamVjdE9iamVjdC5wcm9qZWN0c0hvbWUgdG8gdXNlIHByb2plY3QgY29udGFpbmVyIGZvbGRlclxuICAgICAgLy8gcHJvamVjdE9iamVjdC5wcm9qZWN0UGF0aCB0byBzZXQgc3BlY2lmaWMgcHJvamVjdCBmb2xkZXIgKG5vIGluZmVyZW5jZSlcbiAgICAgIHJldHVybiB0aGlzLnByb3BzLmxhdW5jaFByb2plY3QocHJvamVjdE9iamVjdC5wcm9qZWN0TmFtZSwgcHJvamVjdE9iamVjdCwgKGVycm9yKSA9PiB7XG4gICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgIHRoaXMucHJvcHMuY3JlYXRlTm90aWNlKHtcbiAgICAgICAgICAgIHR5cGU6ICdlcnJvcicsXG4gICAgICAgICAgICB0aXRsZTogJ09oIG5vIScsXG4gICAgICAgICAgICBtZXNzYWdlOiAnV2UgY291bGRuXFwndCBvcGVuIHRoaXMgcHJvamVjdC4g8J+YqSBQbGVhc2UgZW5zdXJlIHRoYXQgeW91ciBjb21wdXRlciBpcyBjb25uZWN0ZWQgdG8gdGhlIEludGVybmV0LiBJZiB5b3VcXCdyZSBjb25uZWN0ZWQgYW5kIHlvdSBzdGlsbCBzZWUgdGhpcyBtZXNzYWdlIHlvdXIgZmlsZXMgbWlnaHQgc3RpbGwgYmUgcHJvY2Vzc2luZy4gUGxlYXNlIHRyeSBhZ2FpbiBpbiBhIGZldyBtb21lbnRzLiBJZiB5b3Ugc3RpbGwgc2VlIHRoaXMgZXJyb3IsIGNvbnRhY3QgSGFpa3UgZm9yIHN1cHBvcnQuJyxcbiAgICAgICAgICAgIGNsb3NlVGV4dDogJ09rYXknLFxuICAgICAgICAgICAgbGlnaHRTY2hlbWU6IHRydWVcbiAgICAgICAgICB9KVxuICAgICAgICAgIHJldHVybiB0aGlzLnNldFN0YXRlKHsgZXJyb3IsIGxhdW5jaGluZ1Byb2plY3Q6IG51bGwgfSlcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICBoYW5kbGVJbXBvcnRJbnB1dENsaWNrICgpIHtcbiAgICB0aGlzLnJlZnMuaW1wb3J0SW5wdXQuc2VsZWN0KClcbiAgfVxuXG4gIGhhbmRsZU5ld1Byb2plY3RJbnB1dENsaWNrICgpIHtcbiAgICB0aGlzLnJlZnMubmV3UHJvamVjdElucHV0LnNlbGVjdCgpXG4gIH1cblxuICBoYW5kbGVOZXdQcm9qZWN0SW5wdXRLZXlQcmVzcyAoZSkge1xuICAgIGlmIChlLmNoYXJDb2RlID09PSAxMykge1xuICAgICAgdGhpcy5oYW5kbGVOZXdQcm9qZWN0R28oKVxuICAgIH1cbiAgfVxuXG4gIGhhbmRsZU5ld1Byb2plY3RHbyAoKSB7XG4gICAgdmFyIHJhdyA9IHRoaXMucmVmcy5uZXdQcm9qZWN0SW5wdXQudmFsdWVcbiAgICAvLyBIQUNLOiAgc3RyaXAgYWxsIG5vbi1hbHBoYW51bWVyaWMgY2hhcnMgZm9yIG5vdy4gIHNvbWV0aGluZyBtb3JlIHVzZXItZnJpZW5kbHkgd291bGQgYmUgaWRlYWxcbiAgICB2YXIgbmFtZSA9IHJhdyAmJiByYXcucmVwbGFjZSgvW15hLXowLTldL2dpLCAnJylcblxuICAgIGlmICh0aGlzLmlzUHJvamVjdE5hbWVCYWQobmFtZSkpIHtcbiAgICAgIGNvbnNvbGUud2FybignYmFkIG5hbWUgZW50ZXJlZDonLCBuYW1lKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtuZXdQcm9qZWN0TG9hZGluZzogdHJ1ZX0pXG4gICAgICB0aGlzLnByb3BzLndlYnNvY2tldC5yZXF1ZXN0KHsgbWV0aG9kOiAnY3JlYXRlUHJvamVjdCcsIHBhcmFtczogW25hbWVdIH0sIChlcnIsIG5ld1Byb2plY3QpID0+IHtcbiAgICAgICAgY29uc3QgcHJvamVjdHNMaXN0ID0gdGhpcy5zdGF0ZS5wcm9qZWN0c0xpc3RcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7bmV3UHJvamVjdExvYWRpbmc6IGZhbHNlfSlcbiAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgIHByb2plY3RzTGlzdC5zcGxpY2UoMCwgMSlcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgcHJvamVjdHNMaXN0IH0pXG4gICAgICAgICAgdGhpcy5wcm9wcy5jcmVhdGVOb3RpY2Uoe1xuICAgICAgICAgICAgdHlwZTogJ2Vycm9yJyxcbiAgICAgICAgICAgIHRpdGxlOiAnT2ggbm8hJyxcbiAgICAgICAgICAgIG1lc3NhZ2U6ICdXZSBjb3VsZG5cXCd0IGNyZWF0ZSB5b3VyIHByb2plY3QuIPCfmKkgRG9lcyB0aGlzIHByb2plY3Qgd2l0aCB0aGlzIG5hbWUgYWxyZWFkeSBleGlzdD8nLFxuICAgICAgICAgICAgY2xvc2VUZXh0OiAnT2theScsXG4gICAgICAgICAgICBsaWdodFNjaGVtZTogdHJ1ZVxuICAgICAgICAgIH0pXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gc3RyaXAgXCJuZXdcIiBwcm9qZWN0IGZyb20gdG9wIG9mIGxpc3QsIHVuc2hpZnQgYWN0dWFsIG5ldyBwcm9qZWN0XG4gICAgICAgICAgdmFyIHBsYWNlaG9sZGVyUHJvamVjdCA9IHByb2plY3RzTGlzdC5zcGxpY2UoMCwgMSlbMF1cbiAgICAgICAgICBuZXdQcm9qZWN0LmlzQWN0aXZlID0gcGxhY2Vob2xkZXJQcm9qZWN0LmlzQWN0aXZlXG4gICAgICAgICAgcHJvamVjdHNMaXN0LnVuc2hpZnQobmV3UHJvamVjdClcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHtwcm9qZWN0TGlzdDogcHJvamVjdHNMaXN0fSlcbiAgICAgICAgICAvLyBhdXRvLWxhdW5jaCBuZXdseSBjcmVhdGVkIHByb2plY3RcbiAgICAgICAgICAvLyB0aGlzLmhhbmRsZVByb2plY3RMYXVuY2gobmV3UHJvamVjdClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICBwcm9qZWN0c0xpc3RFbGVtZW50ICgpIHtcbiAgICBpZiAodGhpcy5zdGF0ZS5hcmVQcm9qZWN0c0xvYWRpbmcpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxzcGFuIHN0eWxlPXtEQVNIX1NUWUxFUy5sb2FkaW5nV3JhcH0+XG4gICAgICAgICAgPEZhZGluZ0NpcmNsZSBzaXplPXszMn0gY29sb3I9e1BhbGV0dGUuUk9DS19NVVRFRH0gLz5cbiAgICAgICAgPC9zcGFuPlxuICAgICAgKVxuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IHN0eWxlPXt7aGVpZ2h0OiAnY2FsYygxMDAlIC0gNzBweCknLCBvdmVyZmxvd1k6ICdhdXRvJ319PlxuICAgICAgICB7dGhpcy5zdGF0ZS5wcm9qZWN0c0xpc3QubWFwKChwcm9qZWN0T2JqZWN0LCBpbmRleCkgPT4ge1xuICAgICAgICAgIHZhciBwcm9qZWN0VGl0bGVcbiAgICAgICAgICBpZiAocHJvamVjdE9iamVjdC5pc05ldykge1xuICAgICAgICAgICAgLy8gSWYgdGhpcyBpcyB0aGUgTkVXIFBST0pFQ1Qgc2xvdCwgc2hvdyB0aGUgaW5wdXQgVUlcblxuICAgICAgICAgICAgdmFyIGJ1dHRvbkNvbnRlbnRzID0gJ0dPJ1xuICAgICAgICAgICAgaWYgKHRoaXMuc3RhdGUubmV3UHJvamVjdExvYWRpbmcpIGJ1dHRvbkNvbnRlbnRzID0gPExvYWRpbmdTcGlubmVyU1ZHIC8+XG5cbiAgICAgICAgICAgIHByb2plY3RUaXRsZSA9IChcbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17W0RBU0hfU1RZTEVTLnByb2plY3RUaXRsZU5ld119PlxuICAgICAgICAgICAgICAgIDxpbnB1dCBrZXk9J25ldy1wcm9qZWN0LWlucHV0J1xuICAgICAgICAgICAgICAgICAgcmVmPSduZXdQcm9qZWN0SW5wdXQnXG4gICAgICAgICAgICAgICAgICBkaXNhYmxlZD17dGhpcy5zdGF0ZS5uZXdQcm9qZWN0TG9hZGluZ31cbiAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuaGFuZGxlTmV3UHJvamVjdElucHV0Q2xpY2suYmluZCh0aGlzKX1cbiAgICAgICAgICAgICAgICAgIG9uS2V5UHJlc3M9e3RoaXMuaGFuZGxlTmV3UHJvamVjdElucHV0S2V5UHJlc3MuYmluZCh0aGlzKX1cbiAgICAgICAgICAgICAgICAgIHN0eWxlPXtbREFTSF9TVFlMRVMubmV3UHJvamVjdElucHV0XX1cbiAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPSdOZXdQcm9qZWN0TmFtZScgLz5cbiAgICAgICAgICAgICAgICA8YnV0dG9uIGtleT0nbmV3LXByb2plY3QtZ28tYnV0dG9uJyBkaXNhYmxlZD17dGhpcy5zdGF0ZS5uZXdQcm9qZWN0TG9hZGluZ30gb25DbGljaz17dGhpcy5oYW5kbGVOZXdQcm9qZWN0R28uYmluZCh0aGlzKX0gc3R5bGU9e1tEQVNIX1NUWUxFUy5uZXdQcm9qZWN0R29CdXR0b25dfT57YnV0dG9uQ29udGVudHN9PC9idXR0b24+XG4gICAgICAgICAgICAgICAgPHNwYW4ga2V5PSduZXctcHJvamVjdC1lcnJvcicgc3R5bGU9e1tEQVNIX1NUWUxFUy5uZXdQcm9qZWN0RXJyb3JdfT57dGhpcy5zdGF0ZS5uZXdQcm9qZWN0RXJyb3J9PC9zcGFuPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIClcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gb3RoZXJ3aXNlLCBzaG93IHRoZSByZWFkLW9ubHkgUHJvamVjdCBsaXN0aW5nIGJ1dHRvblxuICAgICAgICAgICAgcHJvamVjdFRpdGxlID0gPHNwYW4gc3R5bGU9e1tEQVNIX1NUWUxFUy5wcm9qZWN0VGl0bGUsIHByb2plY3RPYmplY3QuaXNBY3RpdmUgJiYgREFTSF9TVFlMRVMuYWN0aXZlVGl0bGVdfT57cHJvamVjdE9iamVjdC5wcm9qZWN0TmFtZX08L3NwYW4+XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e1tEQVNIX1NUWUxFUy5wcm9qZWN0V3JhcHBlciwgcHJvamVjdE9iamVjdC5pc0FjdGl2ZSAmJiBEQVNIX1NUWUxFUy5hY3RpdmVXcmFwcGVyXX1cbiAgICAgICAgICAgICAga2V5PXtpbmRleH1cbiAgICAgICAgICAgICAgb25Eb3VibGVDbGljaz17dGhpcy5oYW5kbGVQcm9qZWN0TGF1bmNoLmJpbmQodGhpcywgcHJvamVjdE9iamVjdCl9XG4gICAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuc2V0QWN0aXZlUHJvamVjdC5iaW5kKHRoaXMsIHByb2plY3RPYmplY3QsIGluZGV4KX0+XG4gICAgICAgICAgICAgIDxzcGFuIGtleT17YGEtJHtwcm9qZWN0T2JqZWN0LnByb2plY3ROYW1lfWB9IHN0eWxlPXtbcHJvamVjdE9iamVjdC5pc0FjdGl2ZSAmJiBEQVNIX1NUWUxFUy5hY3RpdmVQcm9qZWN0XX0gLz5cbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e1tEQVNIX1NUWUxFUy5sb2dvLCBwcm9qZWN0T2JqZWN0LmlzQWN0aXZlICYmIERBU0hfU1RZTEVTLmxvZ29BY3RpdmVdfT48TG9nb1NWRyAvPjwvc3Bhbj5cbiAgICAgICAgICAgICAge3Byb2plY3RUaXRsZX1cbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e1tEQVNIX1NUWUxFUy5kYXRlLCBwcm9qZWN0T2JqZWN0LmlzQWN0aXZlICYmIERBU0hfU1RZTEVTLmFjdGl2ZURhdGVdfT5cbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXtEQVNIX1NUWUxFUy5kYXRlVGl0bGV9PnsvKiAocHJvamVjdE9iamVjdC51cGRhdGVkKSA/ICdVUERBVEVEJyA6ICcnICovfTwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXY+ey8qIHByb2plY3RPYmplY3QudXBkYXRlZCAqL308L2Rpdj5cbiAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgKVxuICAgICAgICB9KX1cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIGFscmVhZHlIYXNUb29NYW55UHJvamVjdHMgKCkge1xuICAgIHJldHVybiAoXG4gICAgICAhdGhpcy5zdGF0ZS5hcmVQcm9qZWN0c0xvYWRpbmcgJiZcbiAgICAgIHRoaXMuc3RhdGUucHJvamVjdHNMaXN0ICYmXG4gICAgICB0aGlzLnN0YXRlLnByb2plY3RzTGlzdC5sZW5ndGggPj0gSEFSRENPREVEX1BST0pFQ1RTX0xJTUlUXG4gICAgKVxuICB9XG5cbiAgdGl0bGVXcmFwcGVyRWxlbWVudCAoKSB7XG4gICAgaWYgKHRoaXMuYWxyZWFkeUhhc1Rvb01hbnlQcm9qZWN0cygpKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IHN0eWxlPXtEQVNIX1NUWUxFUy50aXRsZVdyYXBwZXJ9PlxuICAgICAgICAgIDxzcGFuIHN0eWxlPXtEQVNIX1NUWUxFUy5wcm9qZWN0c1RpdGxlfT5Qcm9qZWN0czwvc3Bhbj5cbiAgICAgICAgICA8c3BhbiBzdHlsZT17eyBjb2xvcjogUGFsZXR0ZS5PUkFOR0UgfX0+UHJvamVjdCBsaW1pdDoge0hBUkRDT0RFRF9QUk9KRUNUU19MSU1JVH08L3NwYW4+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKVxuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IHN0eWxlPXtEQVNIX1NUWUxFUy50aXRsZVdyYXBwZXJ9PlxuICAgICAgICA8c3BhbiBzdHlsZT17REFTSF9TVFlMRVMucHJvamVjdHNUaXRsZX0+UHJvamVjdHM8L3NwYW4+XG4gICAgICAgIDxidXR0b25cbiAgICAgICAgICB0YWJJbmRleD0nLTEnXG4gICAgICAgICAgc3R5bGU9e0RBU0hfU1RZTEVTLmJ0bk5ld1Byb2plY3R9XG4gICAgICAgICAgb25DbGljaz17dGhpcy5sYXVuY2hOZXdQcm9qZWN0SW5wdXQuYmluZCh0aGlzKX0+KzwvYnV0dG9uPlxuICAgICAgICB7ICF0aGlzLnN0YXRlLmFyZVByb2plY3RzTG9hZGluZyAmJiB0aGlzLnN0YXRlLnByb2plY3RzTGlzdC5sZW5ndGggPT09IDBcbiAgICAgICAgICA/IDxzcGFuIHN0eWxlPXtEQVNIX1NUWUxFUy50b29sdGlwfT48c3BhbiBzdHlsZT17REFTSF9TVFlMRVMuYXJyb3dMZWZ0fSAvPkNyZWF0ZSBhIFByb2plY3Q8L3NwYW4+XG4gICAgICAgICAgOiBudWxsXG4gICAgICAgIH1cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHByb2plY3RFZGl0QnV0dG9uRWxlbWVudCAocHJvamVjdE9iamVjdCkge1xuICAgIHJldHVybiAoXG4gICAgICA8YnV0dG9uXG4gICAgICAgIHRhYkluZGV4PSctMSdcbiAgICAgICAgc3R5bGU9e0RBU0hfU1RZTEVTLmVkaXRQcm9qZWN0fVxuICAgICAgICBkaXNhYmxlZD17ISF0aGlzLnN0YXRlLmxhdW5jaGluZ1Byb2plY3R9XG4gICAgICAgIG9uQ2xpY2s9e3RoaXMuaGFuZGxlUHJvamVjdExhdW5jaC5iaW5kKHRoaXMsIHByb2plY3RPYmplY3QpfVxuICAgICAgICBpZD0ncHJvamVjdC1lZGl0LWJ1dHRvbic+XG4gICAgICAgIE9wZW4gRWRpdG9yXG4gICAgICA8L2J1dHRvbj5cbiAgICApXG4gIH1cblxuICBwcm9qZWN0Rm9ybUVsZW1lbnQgKHByb2plY3RPYmplY3QpIHtcbiAgICBpZiAoIXByb2plY3RPYmplY3QpIHtcbiAgICAgIGlmICh0aGlzLnN0YXRlLmFyZVByb2plY3RzTG9hZGluZykge1xuICAgICAgICByZXR1cm4gPGRpdiAvPlxuICAgICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlLnByb2plY3RzTGlzdC5sZW5ndGggPT09IDAgJiYgIXRoaXMuc3RhdGUuYXJlUHJvamVjdHNMb2FkaW5nKSB7XG4gICAgICAgIHJldHVybiA8ZGl2IHN0eWxlPXtbREFTSF9TVFlMRVMuZW1wdHlTdGF0ZSwgREFTSF9TVFlMRVMubm9TZWxlY3RdfT5DcmVhdGUgYSBwcm9qZWN0IHRvIGJlZ2luPC9kaXY+XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gPGRpdiBzdHlsZT17W0RBU0hfU1RZTEVTLmVtcHR5U3RhdGUsIERBU0hfU1RZTEVTLm5vU2VsZWN0XX0+U2VsZWN0IGEgcHJvamVjdCB0byBiZWdpbjwvZGl2PlxuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGltcG9ydFVyaSA9IGAke3NuYWtlaXplKHByb2plY3RPYmplY3QucHJvamVjdE5hbWUpfWBcbiAgICBjb25zdCBjb21tYW5kTGluZVNuaXBwZXQgPSBgaGFpa3UgaW5zdGFsbCAke2ltcG9ydFVyaX1gXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXY+XG4gICAgICAgIDxkaXYgc3R5bGU9e0RBU0hfU1RZTEVTLmZpZWxkVGl0bGV9PlByb2plY3QgbmFtZTwvZGl2PlxuICAgICAgICA8ZGl2IHN0eWxlPXt7cG9zaXRpb246ICdyZWxhdGl2ZSd9fT5cbiAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgIGtleT0ncHJvamVjdFRpdGxlJ1xuICAgICAgICAgICAgdmFsdWU9e3Byb2plY3RPYmplY3QucHJvamVjdE5hbWV9XG4gICAgICAgICAgICBzdHlsZT17REFTSF9TVFlMRVMuZmllbGR9XG4gICAgICAgICAgICByZWFkT25seVxuICAgICAgICAgICAgb25DaGFuZ2U9e3RoaXMuaGFuZGxlUHJvamVjdFRpdGxlQ2hhbmdlLmJpbmQodGhpcywgcHJvamVjdE9iamVjdCl9IC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IHN0eWxlPXtEQVNIX1NUWUxFUy5maWVsZFRpdGxlfT5JbXBvcnQgaW50byBhIGNvZGViYXNlIHZpYSBjb21tYW5kIGxpbmU8L2Rpdj5cbiAgICAgICAgPGlucHV0IGtleT0ncHJvamVjdEltcG9ydFVyaScgcmVmPSdpbXBvcnRJbnB1dCcgb25DbGljaz17dGhpcy5oYW5kbGVJbXBvcnRJbnB1dENsaWNrLmJpbmQodGhpcyl9IHZhbHVlPXtjb21tYW5kTGluZVNuaXBwZXR9IHN0eWxlPXtbREFTSF9TVFlMRVMuZmllbGQsIERBU0hfU1RZTEVTLmZpZWxkTW9ub119IHJlYWRPbmx5IC8+XG4gICAgICAgIHt0aGlzLnByb2plY3RFZGl0QnV0dG9uRWxlbWVudChwcm9qZWN0T2JqZWN0KX1cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHJlbmRlck5vdGlmaWNhdGlvbnMgKGNvbnRlbnQsIGkpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPFRvYXN0XG4gICAgICAgIHRvYXN0VHlwZT17Y29udGVudC50eXBlfVxuICAgICAgICB0b2FzdFRpdGxlPXtjb250ZW50LnRpdGxlfVxuICAgICAgICB0b2FzdE1lc3NhZ2U9e2NvbnRlbnQubWVzc2FnZX1cbiAgICAgICAgY2xvc2VUZXh0PXtjb250ZW50LmNsb3NlVGV4dH1cbiAgICAgICAga2V5PXtpICsgY29udGVudC50aXRsZX1cbiAgICAgICAgbXlLZXk9e2l9XG4gICAgICAgIHJlbW92ZU5vdGljZT17dGhpcy5wcm9wcy5yZW1vdmVOb3RpY2V9XG4gICAgICAgIGxpZ2h0U2NoZW1lPXtjb250ZW50LmxpZ2h0U2NoZW1lfSAvPlxuICAgIClcbiAgfVxuXG4gIHJlbmRlciAoKSB7XG4gICAgY29uc3QgYWN0aXZlUHJvamVjdCA9IGxvZGFzaC5maW5kKHRoaXMuc3RhdGUucHJvamVjdHNMaXN0LCB7IGlzQWN0aXZlOiB0cnVlIH0pXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXY+XG4gICAgICAgIDxSZWFjdENTU1RyYW5zaXRpb25Hcm91cFxuICAgICAgICAgIHRyYW5zaXRpb25OYW1lPSd0b2FzdCdcbiAgICAgICAgICB0cmFuc2l0aW9uRW50ZXJUaW1lb3V0PXs1MDB9XG4gICAgICAgICAgdHJhbnNpdGlvbkxlYXZlVGltZW91dD17MzAwfT5cbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7cG9zaXRpb246ICdhYnNvbHV0ZScsIHJpZ2h0OiAwLCB0b3A6IDAsIHdpZHRoOiAzMDB9fT5cbiAgICAgICAgICAgIHtsb2Rhc2gubWFwKHRoaXMucHJvcHMubm90aWNlcywgdGhpcy5yZW5kZXJOb3RpZmljYXRpb25zKX1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9SZWFjdENTU1RyYW5zaXRpb25Hcm91cD5cbiAgICAgICAgPGRpdiBzdHlsZT17W0RBU0hfU1RZTEVTLmRhc2hMZXZlbFdyYXBwZXIsIERBU0hfU1RZTEVTLmFwcGVhckRhc2hMZXZlbF19PlxuICAgICAgICAgIDxkaXYgc3R5bGU9e0RBU0hfU1RZTEVTLmZyYW1lfSBjbGFzc05hbWU9J2ZyYW1lJyAvPlxuICAgICAgICAgIDxkaXYgc3R5bGU9e0RBU0hfU1RZTEVTLnByb2plY3RzQmFyfT5cbiAgICAgICAgICAgIHt0aGlzLnRpdGxlV3JhcHBlckVsZW1lbnQoKX1cbiAgICAgICAgICAgIHt0aGlzLnByb2plY3RzTGlzdEVsZW1lbnQoKX1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IHN0eWxlPXtEQVNIX1NUWUxFUy5kZXRhaWxzfT5cbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e0RBU0hfU1RZTEVTLmNlbnRlckNvbH0+XG4gICAgICAgICAgICAgIHthY3RpdmVQcm9qZWN0ICYmIGFjdGl2ZVByb2plY3QuaXNOZXdcbiAgICAgICAgICAgICAgICA/IDxzcGFuIC8+XG4gICAgICAgICAgICAgICAgOiB0aGlzLnByb2plY3RGb3JtRWxlbWVudChhY3RpdmVQcm9qZWN0KX1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAge3RoaXMuc3RhdGUubGF1bmNoaW5nUHJvamVjdCAmJiA8UHJvamVjdExvYWRlciAvPn1cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxufVxuXG5mdW5jdGlvbiBzbmFrZWl6ZSAoc3RyKSB7XG4gIHN0ciA9IHN0ciB8fCAnJ1xuICByZXR1cm4gc3RyLnJlcGxhY2UoLyAvZywgJ18nKVxufVxuXG4vLyBmdW5jdGlvbiB1bmlxdWVQcm9qZWN0VGl0bGUgKHByb2plY3RzTGlzdCwgdGl0bGUpIHtcbi8vICAgY29uc3QgbWF0Y2hlZFByb2plY3RzID0gZmlsdGVyKHByb2plY3RzTGlzdCwgeyB0aXRsZSB9KVxuLy8gICBpZiAobWF0Y2hlZFByb2plY3RzLmxlbmd0aCA8IDEpIHJldHVybiB0aXRsZVxuLy8gICAvLyBUT0RPOiBQbGVhc2UgbWFrZSB0aGlzIGFsZ29yaXRobSByb2J1c3Rcbi8vICAgcmV0dXJuIGAke3RpdGxlfSAke3Byb2plY3RzTGlzdC5sZW5ndGggKyAxfWBcbi8vIH1cblxuZXhwb3J0IGRlZmF1bHQgUmFkaXVtKFByb2plY3RCcm93c2VyKVxuIl19