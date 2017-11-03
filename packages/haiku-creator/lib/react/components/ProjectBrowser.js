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
      launchingProject: false,
      recordedNewProjectName: ''
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
    key: 'unsetActiveProject',
    value: function unsetActiveProject() {
      // Hacky way to unset current project
      this.setActiveProject();
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
    key: 'handleNewProjectInputKeyDown',
    value: function handleNewProjectInputKeyDown(e) {
      if (e.keyCode === 13) {
        this.handleNewProjectGo();
      } else if (e.keyCode === 27) {
        this.unsetActiveProject();
      }
    }
  }, {
    key: 'handleNewProjectInputBlur',
    value: function handleNewProjectInputBlur() {
      var _this8 = this;

      // Add a delay before closing, if the blur is lost because
      // the input is being sumitted this will prevent UI glitches
      setTimeout(function () {
        _this8.unsetActiveProject();
      }, 150);
    }
  }, {
    key: 'handleNewProjectInputChange',
    value: function handleNewProjectInputChange(event) {
      this.setState({ recordedNewProjectName: event.target.value });
    }
  }, {
    key: 'handleNewProjectGo',
    value: function handleNewProjectGo() {
      var _this9 = this;

      var raw = this.refs.newProjectInput.value;
      // HACK:  strip all non-alphanumeric chars for now.  something more user-friendly would be ideal
      var name = raw && raw.replace(/[^a-z0-9]/gi, '');

      if (this.isProjectNameBad(name)) {
        console.warn('bad name entered:', name);
      } else {
        this.setState({ newProjectLoading: true, recordedNewProjectName: '' });
        this.props.websocket.request({ method: 'createProject', params: [name] }, function (err, newProject) {
          var projectsList = _this9.state.projectsList;
          _this9.setState({ newProjectLoading: false });
          if (err) {
            projectsList.splice(0, 1);
            _this9.setState({ projectsList: projectsList });
            _this9.props.createNotice({
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
            _this9.setState({ projectList: projectsList });
            // auto-launch newly created project
            // this.handleProjectLaunch(newProject)
          }
        });
      }
    }
  }, {
    key: 'projectsListElement',
    value: function projectsListElement() {
      var _this10 = this;

      if (this.state.areProjectsLoading) {
        return _react2.default.createElement(
          'span',
          { style: _dashShared.DASH_STYLES.loadingWrap, __source: {
              fileName: _jsxFileName,
              lineNumber: 251
            },
            __self: this
          },
          _react2.default.createElement(_betterReactSpinkit.FadingCircle, { size: 32, color: _Palette2.default.ROCK_MUTED, __source: {
              fileName: _jsxFileName,
              lineNumber: 252
            },
            __self: this
          })
        );
      }

      return _react2.default.createElement(
        'div',
        { style: { height: 'calc(100% - 70px)', overflowY: 'auto' }, __source: {
            fileName: _jsxFileName,
            lineNumber: 258
          },
          __self: this
        },
        this.state.projectsList.map(function (projectObject, index) {
          var projectTitle;
          if (projectObject.isNew) {
            // If this is the NEW PROJECT slot, show the input UI

            var buttonContents = 'GO';
            if (_this10.state.newProjectLoading) buttonContents = _react2.default.createElement(_Icons.LoadingSpinnerSVG, {
              __source: {
                fileName: _jsxFileName,
                lineNumber: 265
              },
              __self: _this10
            });

            projectTitle = _react2.default.createElement(
              'div',
              { style: [_dashShared.DASH_STYLES.projectTitleNew], __source: {
                  fileName: _jsxFileName,
                  lineNumber: 268
                },
                __self: _this10
              },
              _react2.default.createElement('input', { key: 'new-project-input',
                ref: 'newProjectInput',
                disabled: _this10.state.newProjectLoading,
                onClick: _this10.handleNewProjectInputClick.bind(_this10),
                onKeyDown: _this10.handleNewProjectInputKeyDown.bind(_this10),
                onBlur: _this10.handleNewProjectInputBlur.bind(_this10),
                style: [_dashShared.DASH_STYLES.newProjectInput],
                value: _this10.state.recordedNewProjectName,
                onChange: _this10.handleNewProjectInputChange.bind(_this10),
                placeholder: 'NewProjectName', __source: {
                  fileName: _jsxFileName,
                  lineNumber: 269
                },
                __self: _this10
              }),
              _react2.default.createElement(
                'button',
                { key: 'new-project-go-button', disabled: _this10.state.newProjectLoading, onClick: _this10.handleNewProjectGo.bind(_this10), style: [_dashShared.DASH_STYLES.newProjectGoButton], __source: {
                    fileName: _jsxFileName,
                    lineNumber: 279
                  },
                  __self: _this10
                },
                buttonContents
              ),
              _react2.default.createElement(
                'span',
                { key: 'new-project-error', style: [_dashShared.DASH_STYLES.newProjectError], __source: {
                    fileName: _jsxFileName,
                    lineNumber: 280
                  },
                  __self: _this10
                },
                _this10.state.newProjectError
              )
            );
          } else {
            // otherwise, show the read-only Project listing button
            projectTitle = _react2.default.createElement(
              'span',
              { style: [_dashShared.DASH_STYLES.projectTitle, projectObject.isActive && _dashShared.DASH_STYLES.activeTitle], __source: {
                  fileName: _jsxFileName,
                  lineNumber: 285
                },
                __self: _this10
              },
              projectObject.projectName
            );
          }

          return _react2.default.createElement(
            'div',
            { style: [_dashShared.DASH_STYLES.projectWrapper, projectObject.isActive && _dashShared.DASH_STYLES.activeWrapper],
              key: index,
              onDoubleClick: _this10.handleProjectLaunch.bind(_this10, projectObject),
              onClick: _this10.setActiveProject.bind(_this10, projectObject, index), __source: {
                fileName: _jsxFileName,
                lineNumber: 289
              },
              __self: _this10
            },
            _react2.default.createElement('span', { key: 'a-' + projectObject.projectName, style: [projectObject.isActive && _dashShared.DASH_STYLES.activeProject], __source: {
                fileName: _jsxFileName,
                lineNumber: 293
              },
              __self: _this10
            }),
            _react2.default.createElement(
              'span',
              { style: [_dashShared.DASH_STYLES.logo, projectObject.isActive && _dashShared.DASH_STYLES.logoActive], __source: {
                  fileName: _jsxFileName,
                  lineNumber: 294
                },
                __self: _this10
              },
              _react2.default.createElement(_Icons.LogoSVG, {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 294
                },
                __self: _this10
              })
            ),
            projectTitle,
            _react2.default.createElement(
              'span',
              { style: [_dashShared.DASH_STYLES.date, projectObject.isActive && _dashShared.DASH_STYLES.activeDate], __source: {
                  fileName: _jsxFileName,
                  lineNumber: 296
                },
                __self: _this10
              },
              _react2.default.createElement('div', { style: _dashShared.DASH_STYLES.dateTitle, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 297
                },
                __self: _this10
              }),
              _react2.default.createElement('div', {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 298
                },
                __self: _this10
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
              lineNumber: 318
            },
            __self: this
          },
          _react2.default.createElement(
            'span',
            { style: _dashShared.DASH_STYLES.projectsTitle, __source: {
                fileName: _jsxFileName,
                lineNumber: 319
              },
              __self: this
            },
            'Projects'
          ),
          _react2.default.createElement(
            'span',
            { style: { color: _Palette2.default.ORANGE }, __source: {
                fileName: _jsxFileName,
                lineNumber: 320
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
            lineNumber: 326
          },
          __self: this
        },
        _react2.default.createElement(
          'span',
          { style: _dashShared.DASH_STYLES.projectsTitle, __source: {
              fileName: _jsxFileName,
              lineNumber: 327
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
              lineNumber: 328
            },
            __self: this
          },
          '+'
        ),
        !this.state.areProjectsLoading && this.state.projectsList.length === 0 ? _react2.default.createElement(
          'span',
          { style: _dashShared.DASH_STYLES.tooltip, __source: {
              fileName: _jsxFileName,
              lineNumber: 333
            },
            __self: this
          },
          _react2.default.createElement('span', { style: _dashShared.DASH_STYLES.arrowLeft, __source: {
              fileName: _jsxFileName,
              lineNumber: 333
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
            lineNumber: 342
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
              lineNumber: 356
            },
            __self: this
          });
        } else if (this.state.projectsList.length === 0 && !this.state.areProjectsLoading) {
          return _react2.default.createElement(
            'div',
            { style: [_dashShared.DASH_STYLES.emptyState, _dashShared.DASH_STYLES.noSelect], __source: {
                fileName: _jsxFileName,
                lineNumber: 358
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
                lineNumber: 360
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
            lineNumber: 367
          },
          __self: this
        },
        _react2.default.createElement(
          'div',
          { style: _dashShared.DASH_STYLES.fieldTitle, __source: {
              fileName: _jsxFileName,
              lineNumber: 368
            },
            __self: this
          },
          'Project name'
        ),
        _react2.default.createElement(
          'div',
          { style: { position: 'relative' }, __source: {
              fileName: _jsxFileName,
              lineNumber: 369
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
              lineNumber: 370
            },
            __self: this
          })
        ),
        _react2.default.createElement(
          'div',
          { style: _dashShared.DASH_STYLES.fieldTitle, __source: {
              fileName: _jsxFileName,
              lineNumber: 377
            },
            __self: this
          },
          'Import into a codebase via command line'
        ),
        _react2.default.createElement('input', { key: 'projectImportUri', ref: 'importInput', onClick: this.handleImportInputClick.bind(this), value: commandLineSnippet, style: [_dashShared.DASH_STYLES.field, _dashShared.DASH_STYLES.fieldMono], readOnly: true, __source: {
            fileName: _jsxFileName,
            lineNumber: 378
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
          lineNumber: 386
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
            lineNumber: 401
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
              lineNumber: 402
            },
            __self: this
          },
          _react2.default.createElement(
            'div',
            { style: { position: 'absolute', right: 0, top: 0, width: 300 }, __source: {
                fileName: _jsxFileName,
                lineNumber: 406
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
              lineNumber: 410
            },
            __self: this
          },
          _react2.default.createElement('div', { style: _dashShared.DASH_STYLES.frame, className: 'frame', __source: {
              fileName: _jsxFileName,
              lineNumber: 411
            },
            __self: this
          }),
          _react2.default.createElement(
            'div',
            { style: _dashShared.DASH_STYLES.projectsBar, __source: {
                fileName: _jsxFileName,
                lineNumber: 412
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
                lineNumber: 416
              },
              __self: this
            },
            _react2.default.createElement(
              'div',
              { style: _dashShared.DASH_STYLES.centerCol, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 417
                },
                __self: this
              },
              activeProject && activeProject.isNew ? _react2.default.createElement('span', {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 419
                },
                __self: this
              }) : this.projectFormElement(activeProject)
            )
          )
        ),
        this.state.launchingProject && _react2.default.createElement(_ProjectLoader2.default, {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 424
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9yZWFjdC9jb21wb25lbnRzL1Byb2plY3RCcm93c2VyLmpzIl0sIm5hbWVzIjpbIkhBUkRDT0RFRF9QUk9KRUNUU19MSU1JVCIsIlByb2plY3RCcm93c2VyIiwicHJvcHMiLCJyZW5kZXJOb3RpZmljYXRpb25zIiwiYmluZCIsInN0YXRlIiwiZXJyb3IiLCJzaG93TmVlZHNTYXZlRGlhbG9ndWUiLCJwcm9qZWN0c0xpc3QiLCJhcmVQcm9qZWN0c0xvYWRpbmciLCJsYXVuY2hpbmdQcm9qZWN0IiwicmVjb3JkZWROZXdQcm9qZWN0TmFtZSIsImhhbmRsZURvY3VtZW50S2V5UHJlc3MiLCJoYW5kbGVTZWxlY3RQcm9qZWN0IiwibG9hZFByb2plY3RzIiwiZG9jdW1lbnQiLCJhZGRFdmVudExpc3RlbmVyIiwiZW52b3kiLCJnZXQiLCJ0aGVuIiwidG91ckNoYW5uZWwiLCJvbiIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJvZmYiLCJwcm9qZWN0SWR4IiwiZmluZEluZGV4IiwicHJvamVjdCIsInByb2plY3ROYW1lIiwic2V0QWN0aXZlUHJvamVjdCIsImV2dCIsImRlbHRhIiwiY29kZSIsImZvdW5kIiwiZm9yRWFjaCIsImkiLCJpc0FjdGl2ZSIsInByb3Bvc2VkSW5kZXgiLCJpc05ldyIsIm5ld1Byb2plY3RMb2FkaW5nIiwic2hpZnQiLCJuZXdJbmRleCIsIk1hdGgiLCJtaW4iLCJtYXgiLCJsZW5ndGgiLCJzZXRTdGF0ZSIsImNyZWF0ZU5vdGljZSIsInR5cGUiLCJ0aXRsZSIsIm1lc3NhZ2UiLCJjbG9zZVRleHQiLCJsaWdodFNjaGVtZSIsInByb2plY3RPYmplY3QiLCJwcm9qZWN0SW5kZXgiLCJmb3VuZFByb2plY3QiLCJmb3VuZEluZGV4IiwiY2hhbmdlRXZlbnQiLCJpc1Byb2plY3ROYW1lQmFkIiwidGFyZ2V0IiwidmFsdWUiLCJhbHJlYWR5SGFzVG9vTWFueVByb2plY3RzIiwidW5zaGlmdCIsInNldFRpbWVvdXQiLCJyZWZzIiwibmV3UHJvamVjdElucHV0Iiwic2VsZWN0IiwiY29uc29sZSIsIndhcm4iLCJsYXVuY2hQcm9qZWN0IiwiaW1wb3J0SW5wdXQiLCJlIiwia2V5Q29kZSIsImhhbmRsZU5ld1Byb2plY3RHbyIsInVuc2V0QWN0aXZlUHJvamVjdCIsImV2ZW50IiwicmF3IiwibmFtZSIsInJlcGxhY2UiLCJ3ZWJzb2NrZXQiLCJyZXF1ZXN0IiwibWV0aG9kIiwicGFyYW1zIiwiZXJyIiwibmV3UHJvamVjdCIsInNwbGljZSIsInBsYWNlaG9sZGVyUHJvamVjdCIsInByb2plY3RMaXN0IiwibG9hZGluZ1dyYXAiLCJST0NLX01VVEVEIiwiaGVpZ2h0Iiwib3ZlcmZsb3dZIiwibWFwIiwiaW5kZXgiLCJwcm9qZWN0VGl0bGUiLCJidXR0b25Db250ZW50cyIsInByb2plY3RUaXRsZU5ldyIsImhhbmRsZU5ld1Byb2plY3RJbnB1dENsaWNrIiwiaGFuZGxlTmV3UHJvamVjdElucHV0S2V5RG93biIsImhhbmRsZU5ld1Byb2plY3RJbnB1dEJsdXIiLCJoYW5kbGVOZXdQcm9qZWN0SW5wdXRDaGFuZ2UiLCJuZXdQcm9qZWN0R29CdXR0b24iLCJuZXdQcm9qZWN0RXJyb3IiLCJhY3RpdmVUaXRsZSIsInByb2plY3RXcmFwcGVyIiwiYWN0aXZlV3JhcHBlciIsImhhbmRsZVByb2plY3RMYXVuY2giLCJhY3RpdmVQcm9qZWN0IiwibG9nbyIsImxvZ29BY3RpdmUiLCJkYXRlIiwiYWN0aXZlRGF0ZSIsImRhdGVUaXRsZSIsInRpdGxlV3JhcHBlciIsInByb2plY3RzVGl0bGUiLCJjb2xvciIsIk9SQU5HRSIsImJ0bk5ld1Byb2plY3QiLCJsYXVuY2hOZXdQcm9qZWN0SW5wdXQiLCJ0b29sdGlwIiwiYXJyb3dMZWZ0IiwiZWRpdFByb2plY3QiLCJlbXB0eVN0YXRlIiwibm9TZWxlY3QiLCJpbXBvcnRVcmkiLCJzbmFrZWl6ZSIsImNvbW1hbmRMaW5lU25pcHBldCIsImZpZWxkVGl0bGUiLCJwb3NpdGlvbiIsImZpZWxkIiwiaGFuZGxlUHJvamVjdFRpdGxlQ2hhbmdlIiwiaGFuZGxlSW1wb3J0SW5wdXRDbGljayIsImZpZWxkTW9ubyIsInByb2plY3RFZGl0QnV0dG9uRWxlbWVudCIsImNvbnRlbnQiLCJyZW1vdmVOb3RpY2UiLCJmaW5kIiwicmlnaHQiLCJ0b3AiLCJ3aWR0aCIsIm5vdGljZXMiLCJkYXNoTGV2ZWxXcmFwcGVyIiwiYXBwZWFyRGFzaExldmVsIiwiZnJhbWUiLCJwcm9qZWN0c0JhciIsInRpdGxlV3JhcHBlckVsZW1lbnQiLCJwcm9qZWN0c0xpc3RFbGVtZW50IiwiZGV0YWlscyIsImNlbnRlckNvbCIsInByb2plY3RGb3JtRWxlbWVudCIsIkNvbXBvbmVudCIsInN0ciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7Ozs7Ozs7OztBQUVBLElBQU1BLDJCQUEyQixFQUFqQzs7SUFFTUMsYzs7O0FBQ0osMEJBQWFDLEtBQWIsRUFBb0I7QUFBQTs7QUFBQSxnSUFDWkEsS0FEWTs7QUFFbEIsVUFBS0MsbUJBQUwsR0FBMkIsTUFBS0EsbUJBQUwsQ0FBeUJDLElBQXpCLE9BQTNCO0FBQ0EsVUFBS0MsS0FBTCxHQUFhO0FBQ1hDLGFBQU8sSUFESTtBQUVYQyw2QkFBdUIsS0FGWjtBQUdYQyxvQkFBYyxFQUhIO0FBSVhDLDBCQUFvQixJQUpUO0FBS1hDLHdCQUFrQixLQUxQO0FBTVhDLDhCQUF3QjtBQU5iLEtBQWI7QUFRQSxVQUFLQyxzQkFBTCxHQUE4QixNQUFLQSxzQkFBTCxDQUE0QlIsSUFBNUIsT0FBOUI7QUFDQSxVQUFLUyxtQkFBTCxHQUEyQixNQUFLQSxtQkFBTCxDQUF5QlQsSUFBekIsT0FBM0I7QUFaa0I7QUFhbkI7Ozs7d0NBRW9CO0FBQUE7O0FBQ25CLFdBQUtVLFlBQUw7QUFDQUMsZUFBU0MsZ0JBQVQsQ0FBMEIsU0FBMUIsRUFBcUMsS0FBS0osc0JBQTFDLEVBQWtFLElBQWxF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Q0UsaURBQUssT0FBTyx3QkFBWUMsS0FBeEIsRUFBK0IsV0FBVSxPQUF6QztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsWUFERjtBQUVFO0FBQUE7QUFBQSxjQUFLLE9BQU8sd0JBQVlDLFdBQXhCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNHLGlCQUFLQyxtQkFBTCxFQURIO0FBRUcsaUJBQUtDLG1CQUFMO0FBRkgsV0FGRjtBQU1FO0FBQUE7QUFBQSxjQUFLLE9BQU8sd0JBQVlDLE9BQXhCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNFO0FBQUE7QUFBQSxnQkFBSyxPQUFPLHdCQUFZQyxTQUF4QjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDR3pDLCtCQUFpQkEsY0FBY3JFLEtBQS9CLEdBQ0c7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsZ0JBREgsR0FFRyxLQUFLK0csa0JBQUwsQ0FBd0IxQyxhQUF4QjtBQUhOO0FBREY7QUFORixTQVRGO0FBdUJHLGFBQUtyRyxLQUFMLENBQVdLLGdCQUFYLElBQStCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBdkJsQyxPQURGO0FBMkJEOzs7O0VBN1owQixnQkFBTTJJLFM7O0FBZ2FuQyxTQUFTekIsUUFBVCxDQUFtQjBCLEdBQW5CLEVBQXdCO0FBQ3RCQSxRQUFNQSxPQUFPLEVBQWI7QUFDQSxTQUFPQSxJQUFJekUsT0FBSixDQUFZLElBQVosRUFBa0IsR0FBbEIsQ0FBUDtBQUNEOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7a0JBRWUsc0JBQU81RSxjQUFQLEMiLCJmaWxlIjoiUHJvamVjdEJyb3dzZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgbG9kYXNoIGZyb20gJ2xvZGFzaCdcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCBSYWRpdW0gZnJvbSAncmFkaXVtJ1xuaW1wb3J0IFJlYWN0Q1NTVHJhbnNpdGlvbkdyb3VwIGZyb20gJ3JlYWN0LWFkZG9ucy1jc3MtdHJhbnNpdGlvbi1ncm91cCdcbmltcG9ydCB7IEZhZGluZ0NpcmNsZSB9IGZyb20gJ2JldHRlci1yZWFjdC1zcGlua2l0J1xuaW1wb3J0IFBhbGV0dGUgZnJvbSAnLi9QYWxldHRlJ1xuaW1wb3J0IFRvYXN0IGZyb20gJy4vbm90aWZpY2F0aW9ucy9Ub2FzdCdcbmltcG9ydCBQcm9qZWN0TG9hZGVyIGZyb20gJy4vUHJvamVjdExvYWRlcidcbmltcG9ydCB7IExvZ29TVkcsIExvYWRpbmdTcGlubmVyU1ZHIH0gZnJvbSAnLi9JY29ucydcbmltcG9ydCB7IERBU0hfU1RZTEVTIH0gZnJvbSAnLi4vc3R5bGVzL2Rhc2hTaGFyZWQnXG5cbmNvbnN0IEhBUkRDT0RFRF9QUk9KRUNUU19MSU1JVCA9IDE1XG5cbmNsYXNzIFByb2plY3RCcm93c2VyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IgKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpXG4gICAgdGhpcy5yZW5kZXJOb3RpZmljYXRpb25zID0gdGhpcy5yZW5kZXJOb3RpZmljYXRpb25zLmJpbmQodGhpcylcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgZXJyb3I6IG51bGwsXG4gICAgICBzaG93TmVlZHNTYXZlRGlhbG9ndWU6IGZhbHNlLFxuICAgICAgcHJvamVjdHNMaXN0OiBbXSxcbiAgICAgIGFyZVByb2plY3RzTG9hZGluZzogdHJ1ZSxcbiAgICAgIGxhdW5jaGluZ1Byb2plY3Q6IGZhbHNlLFxuICAgICAgcmVjb3JkZWROZXdQcm9qZWN0TmFtZTogJydcbiAgICB9XG4gICAgdGhpcy5oYW5kbGVEb2N1bWVudEtleVByZXNzID0gdGhpcy5oYW5kbGVEb2N1bWVudEtleVByZXNzLmJpbmQodGhpcylcbiAgICB0aGlzLmhhbmRsZVNlbGVjdFByb2plY3QgPSB0aGlzLmhhbmRsZVNlbGVjdFByb2plY3QuYmluZCh0aGlzKVxuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQgKCkge1xuICAgIHRoaXMubG9hZFByb2plY3RzKClcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdGhpcy5oYW5kbGVEb2N1bWVudEtleVByZXNzLCB0cnVlKVxuXG4gICAgdGhpcy5wcm9wcy5lbnZveS5nZXQoJ3RvdXInKS50aGVuKCh0b3VyQ2hhbm5lbCkgPT4ge1xuICAgICAgdGhpcy50b3VyQ2hhbm5lbCA9IHRvdXJDaGFubmVsXG4gICAgICB0b3VyQ2hhbm5lbC5vbigndG91cjpyZXF1ZXN0U2VsZWN0UHJvamVjdCcsIHRoaXMuaGFuZGxlU2VsZWN0UHJvamVjdClcbiAgICB9KVxuICB9XG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQgKCkge1xuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLmhhbmRsZURvY3VtZW50S2V5UHJlc3MsIHRydWUpXG4gICAgdGhpcy50b3VyQ2hhbm5lbC5vZmYoJ3RvdXI6cmVxdWVzdFNlbGVjdFByb2plY3QnLCB0aGlzLmhhbmRsZVNlbGVjdFByb2plY3QpXG4gIH1cblxuICBoYW5kbGVTZWxlY3RQcm9qZWN0ICgpIHtcbiAgICBjb25zdCBwcm9qZWN0SWR4ID0gdGhpcy5zdGF0ZS5wcm9qZWN0c0xpc3QuZmluZEluZGV4KChwcm9qZWN0KSA9PiB7XG4gICAgICAvLyBIYXJkY29kZWQgLSBOYW1lIG9mIHRoZSBwcm9qZWN0IHRoYXQgd2lsbCBiZSB1c2VkIGZvciB0aGUgdHV0b3JpYWxcbiAgICAgIHJldHVybiBwcm9qZWN0LnByb2plY3ROYW1lID09PSAnQ2hlY2tUdXRvcmlhbCdcbiAgICB9KVxuXG4gICAgdGhpcy5zZXRBY3RpdmVQcm9qZWN0KHRoaXMuc3RhdGUucHJvamVjdHNMaXN0W3Byb2plY3RJZHhdLCBwcm9qZWN0SWR4KVxuICB9XG5cbiAgaGFuZGxlRG9jdW1lbnRLZXlQcmVzcyAoZXZ0KSB7XG4gICAgdmFyIHByb2plY3RzTGlzdCA9IHRoaXMuc3RhdGUucHJvamVjdHNMaXN0XG5cbiAgICB2YXIgZGVsdGEgPSAwXG4gICAgaWYgKGV2dC5jb2RlID09PSAnQXJyb3dVcCcpIHtcbiAgICAgIGRlbHRhID0gLTFcbiAgICB9IGVsc2UgaWYgKGV2dC5jb2RlID09PSAnQXJyb3dEb3duJykge1xuICAgICAgZGVsdGEgPSAxXG4gICAgfVxuXG4gICAgdmFyIGZvdW5kID0gZmFsc2VcbiAgICBwcm9qZWN0c0xpc3QuZm9yRWFjaCgocHJvamVjdCwgaSkgPT4ge1xuICAgICAgaWYgKCFmb3VuZCAmJiBwcm9qZWN0LmlzQWN0aXZlKSB7XG4gICAgICAgIHZhciBwcm9wb3NlZEluZGV4ID0gaSArIGRlbHRhXG4gICAgICAgIC8vIHJlbW92ZSBjcmVhdGUgVUkgaWYgbmF2aWdhdGluZyBhd2F5IGJlZm9yZSBzdWJtaXR0aW5nXG4gICAgICAgIGlmIChpID09PSAwICYmIGRlbHRhID09PSAxICYmIHByb2plY3QuaXNOZXcgJiYgIXRoaXMuc3RhdGUubmV3UHJvamVjdExvYWRpbmcpIHtcbiAgICAgICAgICBwcm9wb3NlZEluZGV4ID0gMFxuICAgICAgICAgIHByb2plY3RzTGlzdC5zaGlmdCgpXG4gICAgICAgIH1cblxuICAgICAgICB2YXIgbmV3SW5kZXggPSBNYXRoLm1pbihNYXRoLm1heCgwLCBwcm9wb3NlZEluZGV4KSwgcHJvamVjdHNMaXN0Lmxlbmd0aCAtIDEpXG5cbiAgICAgICAgcHJvamVjdC5pc0FjdGl2ZSA9IGZhbHNlXG4gICAgICAgIHByb2plY3RzTGlzdFtuZXdJbmRleF0uaXNBY3RpdmUgPSB0cnVlXG4gICAgICAgIGZvdW5kID0gdHJ1ZVxuICAgICAgfVxuICAgIH0pXG4gICAgdGhpcy5zZXRTdGF0ZSh7cHJvamVjdHNMaXN0fSlcbiAgfVxuXG4gIGxvYWRQcm9qZWN0cyAoKSB7XG4gICAgcmV0dXJuIHRoaXMucHJvcHMubG9hZFByb2plY3RzKChlcnJvciwgcHJvamVjdHNMaXN0KSA9PiB7XG4gICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgdGhpcy5wcm9wcy5jcmVhdGVOb3RpY2Uoe1xuICAgICAgICAgIHR5cGU6ICdlcnJvcicsXG4gICAgICAgICAgdGl0bGU6ICdPaCBubyEnLFxuICAgICAgICAgIG1lc3NhZ2U6ICdXZSBjb3VsZG5cXCd0IGxvYWQgeW91ciB0ZWFtXFwncyBwcm9qZWN0cy4g8J+YoiBQbGVhc2UgZW5zdXJlIHRoYXQgeW91ciBjb21wdXRlciBpcyBjb25uZWN0ZWQgdG8gdGhlIEludGVybmV0LiBJZiB5b3VcXCdyZSBjb25uZWN0ZWQgYW5kIHlvdSBzdGlsbCBzZWUgdGhpcyBtZXNzYWdlIG91ciBzZXJ2ZXJzIG1pZ2h0IGJlIGhhdmluZyBwcm9ibGVtcy4gUGxlYXNlIHRyeSBhZ2FpbiBpbiBhIGZldyBtb21lbnRzLiBJZiB5b3Ugc3RpbGwgc2VlIHRoaXMgbWVzc2FnZSwgY29udGFjdCBIYWlrdSBmb3Igc3VwcG9ydC4nLFxuICAgICAgICAgIGNsb3NlVGV4dDogJ09rYXknLFxuICAgICAgICAgIGxpZ2h0U2NoZW1lOiB0cnVlXG4gICAgICAgIH0pXG4gICAgICAgIHJldHVybiB0aGlzLnNldFN0YXRlKHsgZXJyb3IsIGFyZVByb2plY3RzTG9hZGluZzogZmFsc2UgfSlcbiAgICAgIH1cbiAgICAgIC8vIHNlbGVjdCB0aGUgZmlyc3QgcHJvamVjdCBieSBkZWZhdWx0XG4gICAgICBpZiAocHJvamVjdHNMaXN0Lmxlbmd0aCkge1xuICAgICAgICBwcm9qZWN0c0xpc3RbMF0uaXNBY3RpdmUgPSB0cnVlXG4gICAgICB9XG4gICAgICB0aGlzLnNldFN0YXRlKHsgcHJvamVjdHNMaXN0LCBhcmVQcm9qZWN0c0xvYWRpbmc6IGZhbHNlIH0pXG4gICAgfSlcbiAgfVxuXG4gIHNldEFjdGl2ZVByb2plY3QgKHByb2plY3RPYmplY3QsIHByb2plY3RJbmRleCkge1xuICAgIGNvbnN0IHByb2plY3RzTGlzdCA9IHRoaXMuc3RhdGUucHJvamVjdHNMaXN0XG5cbiAgICAvLyBUT0RPOiBpZiBjdXJyZW50IHByb2plY3QgaGFzIHVuc2F2ZWQgZWRpdHMgdGhlbiBzaG93IHNhdmUgZGlhbG9ndWVcbiAgICAvLyAgICAgICBhbmQgcmV0dXJuIHdpdGhvdXQgY2hhbmdpbmcgcHJvamVjdHNcbiAgICAvLyBpZiAoZmFsc2UpIHtcbiAgICAvLyAgIHRoaXMuc2V0U3RhdGUoeyBzaG93TmVlZHNTYXZlRGlhbG9ndWU6IHRydWUgfSlcbiAgICAvLyAgIHJldHVybiBmYWxzZVxuICAgIC8vIH1cblxuICAgIHByb2plY3RzTGlzdC5mb3JFYWNoKChmb3VuZFByb2plY3QsIGZvdW5kSW5kZXgpID0+IHtcbiAgICAgIC8vIHJlbW92ZSBuZXcgcHJvamVjdCBpZiBuYXZpZ2F0aW5nIGF3YXkgYmVmb3JlIGl0J3MgY29tcGxldGVcbiAgICAgIGlmIChwcm9qZWN0SW5kZXggIT09IDAgJiYgZm91bmRJbmRleCA9PT0gMCAmJiBmb3VuZFByb2plY3QuaXNOZXcgJiYgIXRoaXMuc3RhdGUubmV3UHJvamVjdExvYWRpbmcpIHByb2plY3RzTGlzdC5zaGlmdCgpXG4gICAgICBpZiAoZm91bmRJbmRleCA9PT0gcHJvamVjdEluZGV4KSBmb3VuZFByb2plY3QuaXNBY3RpdmUgPSB0cnVlXG4gICAgICBlbHNlIGZvdW5kUHJvamVjdC5pc0FjdGl2ZSA9IGZhbHNlXG4gICAgfSlcbiAgICB0aGlzLnNldFN0YXRlKHsgcHJvamVjdHNMaXN0IH0pXG4gIH1cblxuICB1bnNldEFjdGl2ZVByb2plY3QgKCkge1xuICAgIC8vIEhhY2t5IHdheSB0byB1bnNldCBjdXJyZW50IHByb2plY3RcbiAgICB0aGlzLnNldEFjdGl2ZVByb2plY3QoKVxuICB9XG5cbiAgaGFuZGxlUHJvamVjdFRpdGxlQ2hhbmdlIChwcm9qZWN0T2JqZWN0LCBjaGFuZ2VFdmVudCkge1xuICAgIGlmICghdGhpcy5pc1Byb2plY3ROYW1lQmFkKGNoYW5nZUV2ZW50LnRhcmdldC52YWx1ZSkpIHtcbiAgICAgIHByb2plY3RPYmplY3QucHJvamVjdE5hbWUgPSBjaGFuZ2VFdmVudC50YXJnZXQudmFsdWVcbiAgICB9XG4gICAgdGhpcy5zZXRTdGF0ZSh7IHByb2plY3RzTGlzdDogdGhpcy5zdGF0ZS5wcm9qZWN0c0xpc3QgfSlcbiAgfVxuXG4gIGxhdW5jaE5ld1Byb2plY3RJbnB1dCAoKSB7XG4gICAgaWYgKHRoaXMuYWxyZWFkeUhhc1Rvb01hbnlQcm9qZWN0cygpKSB7XG4gICAgICByZXR1cm4gdm9pZCAoMClcbiAgICB9XG5cbiAgICB2YXIgcHJvamVjdHNMaXN0ID0gdGhpcy5zdGF0ZS5wcm9qZWN0c0xpc3RcbiAgICBpZiAoIXByb2plY3RzTGlzdFswXSB8fCAhcHJvamVjdHNMaXN0WzBdLmlzTmV3KSB7XG4gICAgICBwcm9qZWN0c0xpc3QuZm9yRWFjaCgoZm91bmRQcm9qZWN0LCBmb3VuZEluZGV4KSA9PiB7XG4gICAgICAgIGZvdW5kUHJvamVjdC5pc0FjdGl2ZSA9IGZhbHNlXG4gICAgICB9KVxuICAgICAgcHJvamVjdHNMaXN0LnVuc2hpZnQoe1xuICAgICAgICBpc0FjdGl2ZTogdHJ1ZSxcbiAgICAgICAgaXNOZXc6IHRydWUsXG4gICAgICAgIHRpdGxlOiAnJ1xuICAgICAgfSlcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICB0aGlzLnJlZnMubmV3UHJvamVjdElucHV0LnNlbGVjdCgpXG4gICAgICB9LCA1MClcbiAgICAgIHRoaXMuc2V0U3RhdGUoeyBwcm9qZWN0c0xpc3QgfSlcbiAgICB9XG4gIH1cblxuICBpc1Byb2plY3ROYW1lQmFkIChwcm9qZWN0TmFtZSkge1xuICAgIGlmICghcHJvamVjdE5hbWUpIHJldHVybiB0cnVlXG4gICAgaWYgKHByb2plY3ROYW1lID09PSAnJykgcmV0dXJuIHRydWVcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIGhhbmRsZVByb2plY3RMYXVuY2ggKHByb2plY3RPYmplY3QpIHtcbiAgICBpZiAodGhpcy5pc1Byb2plY3ROYW1lQmFkKHByb2plY3RPYmplY3QucHJvamVjdE5hbWUpKSB7XG4gICAgICBjb25zb2xlLndhcm4oJ2JhZCBuYW1lIGxhdW5jaGVkOicsIHByb2plY3RPYmplY3QucHJvamVjdE5hbWUpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoeyBsYXVuY2hpbmdQcm9qZWN0OiBwcm9qZWN0T2JqZWN0IH0pXG4gICAgICAvLyBwcm9qZWN0T2JqZWN0LnByb2plY3RzSG9tZSB0byB1c2UgcHJvamVjdCBjb250YWluZXIgZm9sZGVyXG4gICAgICAvLyBwcm9qZWN0T2JqZWN0LnByb2plY3RQYXRoIHRvIHNldCBzcGVjaWZpYyBwcm9qZWN0IGZvbGRlciAobm8gaW5mZXJlbmNlKVxuICAgICAgcmV0dXJuIHRoaXMucHJvcHMubGF1bmNoUHJvamVjdChwcm9qZWN0T2JqZWN0LnByb2plY3ROYW1lLCBwcm9qZWN0T2JqZWN0LCAoZXJyb3IpID0+IHtcbiAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgdGhpcy5wcm9wcy5jcmVhdGVOb3RpY2Uoe1xuICAgICAgICAgICAgdHlwZTogJ2Vycm9yJyxcbiAgICAgICAgICAgIHRpdGxlOiAnT2ggbm8hJyxcbiAgICAgICAgICAgIG1lc3NhZ2U6ICdXZSBjb3VsZG5cXCd0IG9wZW4gdGhpcyBwcm9qZWN0LiDwn5ipIFBsZWFzZSBlbnN1cmUgdGhhdCB5b3VyIGNvbXB1dGVyIGlzIGNvbm5lY3RlZCB0byB0aGUgSW50ZXJuZXQuIElmIHlvdVxcJ3JlIGNvbm5lY3RlZCBhbmQgeW91IHN0aWxsIHNlZSB0aGlzIG1lc3NhZ2UgeW91ciBmaWxlcyBtaWdodCBzdGlsbCBiZSBwcm9jZXNzaW5nLiBQbGVhc2UgdHJ5IGFnYWluIGluIGEgZmV3IG1vbWVudHMuIElmIHlvdSBzdGlsbCBzZWUgdGhpcyBlcnJvciwgY29udGFjdCBIYWlrdSBmb3Igc3VwcG9ydC4nLFxuICAgICAgICAgICAgY2xvc2VUZXh0OiAnT2theScsXG4gICAgICAgICAgICBsaWdodFNjaGVtZTogdHJ1ZVxuICAgICAgICAgIH0pXG4gICAgICAgICAgcmV0dXJuIHRoaXMuc2V0U3RhdGUoeyBlcnJvciwgbGF1bmNoaW5nUHJvamVjdDogbnVsbCB9KVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIGhhbmRsZUltcG9ydElucHV0Q2xpY2sgKCkge1xuICAgIHRoaXMucmVmcy5pbXBvcnRJbnB1dC5zZWxlY3QoKVxuICB9XG5cbiAgaGFuZGxlTmV3UHJvamVjdElucHV0Q2xpY2sgKCkge1xuICAgIHRoaXMucmVmcy5uZXdQcm9qZWN0SW5wdXQuc2VsZWN0KClcbiAgfVxuXG4gIGhhbmRsZU5ld1Byb2plY3RJbnB1dEtleURvd24gKGUpIHtcbiAgICBpZiAoZS5rZXlDb2RlID09PSAxMykge1xuICAgICAgdGhpcy5oYW5kbGVOZXdQcm9qZWN0R28oKVxuICAgIH0gZWxzZSBpZiAoZS5rZXlDb2RlID09PSAyNykge1xuICAgICAgdGhpcy51bnNldEFjdGl2ZVByb2plY3QoKVxuICAgIH1cbiAgfVxuXG4gIGhhbmRsZU5ld1Byb2plY3RJbnB1dEJsdXIgKCkge1xuICAgIC8vIEFkZCBhIGRlbGF5IGJlZm9yZSBjbG9zaW5nLCBpZiB0aGUgYmx1ciBpcyBsb3N0IGJlY2F1c2VcbiAgICAvLyB0aGUgaW5wdXQgaXMgYmVpbmcgc3VtaXR0ZWQgdGhpcyB3aWxsIHByZXZlbnQgVUkgZ2xpdGNoZXNcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMudW5zZXRBY3RpdmVQcm9qZWN0KClcbiAgICB9LCAxNTApXG4gIH1cblxuICBoYW5kbGVOZXdQcm9qZWN0SW5wdXRDaGFuZ2UgKGV2ZW50KSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7cmVjb3JkZWROZXdQcm9qZWN0TmFtZTogZXZlbnQudGFyZ2V0LnZhbHVlfSlcbiAgfVxuXG4gIGhhbmRsZU5ld1Byb2plY3RHbyAoKSB7XG4gICAgdmFyIHJhdyA9IHRoaXMucmVmcy5uZXdQcm9qZWN0SW5wdXQudmFsdWVcbiAgICAvLyBIQUNLOiAgc3RyaXAgYWxsIG5vbi1hbHBoYW51bWVyaWMgY2hhcnMgZm9yIG5vdy4gIHNvbWV0aGluZyBtb3JlIHVzZXItZnJpZW5kbHkgd291bGQgYmUgaWRlYWxcbiAgICB2YXIgbmFtZSA9IHJhdyAmJiByYXcucmVwbGFjZSgvW15hLXowLTldL2dpLCAnJylcblxuICAgIGlmICh0aGlzLmlzUHJvamVjdE5hbWVCYWQobmFtZSkpIHtcbiAgICAgIGNvbnNvbGUud2FybignYmFkIG5hbWUgZW50ZXJlZDonLCBuYW1lKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtuZXdQcm9qZWN0TG9hZGluZzogdHJ1ZSwgcmVjb3JkZWROZXdQcm9qZWN0TmFtZTogJyd9KVxuICAgICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQucmVxdWVzdCh7IG1ldGhvZDogJ2NyZWF0ZVByb2plY3QnLCBwYXJhbXM6IFtuYW1lXSB9LCAoZXJyLCBuZXdQcm9qZWN0KSA9PiB7XG4gICAgICAgIGNvbnN0IHByb2plY3RzTGlzdCA9IHRoaXMuc3RhdGUucHJvamVjdHNMaXN0XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe25ld1Byb2plY3RMb2FkaW5nOiBmYWxzZX0pXG4gICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICBwcm9qZWN0c0xpc3Quc3BsaWNlKDAsIDEpXG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHByb2plY3RzTGlzdCB9KVxuICAgICAgICAgIHRoaXMucHJvcHMuY3JlYXRlTm90aWNlKHtcbiAgICAgICAgICAgIHR5cGU6ICdlcnJvcicsXG4gICAgICAgICAgICB0aXRsZTogJ09oIG5vIScsXG4gICAgICAgICAgICBtZXNzYWdlOiAnV2UgY291bGRuXFwndCBjcmVhdGUgeW91ciBwcm9qZWN0LiDwn5ipIERvZXMgdGhpcyBwcm9qZWN0IHdpdGggdGhpcyBuYW1lIGFscmVhZHkgZXhpc3Q/JyxcbiAgICAgICAgICAgIGNsb3NlVGV4dDogJ09rYXknLFxuICAgICAgICAgICAgbGlnaHRTY2hlbWU6IHRydWVcbiAgICAgICAgICB9KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIHN0cmlwIFwibmV3XCIgcHJvamVjdCBmcm9tIHRvcCBvZiBsaXN0LCB1bnNoaWZ0IGFjdHVhbCBuZXcgcHJvamVjdFxuICAgICAgICAgIHZhciBwbGFjZWhvbGRlclByb2plY3QgPSBwcm9qZWN0c0xpc3Quc3BsaWNlKDAsIDEpWzBdXG4gICAgICAgICAgbmV3UHJvamVjdC5pc0FjdGl2ZSA9IHBsYWNlaG9sZGVyUHJvamVjdC5pc0FjdGl2ZVxuICAgICAgICAgIHByb2plY3RzTGlzdC51bnNoaWZ0KG5ld1Byb2plY3QpXG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7cHJvamVjdExpc3Q6IHByb2plY3RzTGlzdH0pXG4gICAgICAgICAgLy8gYXV0by1sYXVuY2ggbmV3bHkgY3JlYXRlZCBwcm9qZWN0XG4gICAgICAgICAgLy8gdGhpcy5oYW5kbGVQcm9qZWN0TGF1bmNoKG5ld1Byb2plY3QpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgcHJvamVjdHNMaXN0RWxlbWVudCAoKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUuYXJlUHJvamVjdHNMb2FkaW5nKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8c3BhbiBzdHlsZT17REFTSF9TVFlMRVMubG9hZGluZ1dyYXB9PlxuICAgICAgICAgIDxGYWRpbmdDaXJjbGUgc2l6ZT17MzJ9IGNvbG9yPXtQYWxldHRlLlJPQ0tfTVVURUR9IC8+XG4gICAgICAgIDwvc3Bhbj5cbiAgICAgIClcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBzdHlsZT17e2hlaWdodDogJ2NhbGMoMTAwJSAtIDcwcHgpJywgb3ZlcmZsb3dZOiAnYXV0byd9fT5cbiAgICAgICAge3RoaXMuc3RhdGUucHJvamVjdHNMaXN0Lm1hcCgocHJvamVjdE9iamVjdCwgaW5kZXgpID0+IHtcbiAgICAgICAgICB2YXIgcHJvamVjdFRpdGxlXG4gICAgICAgICAgaWYgKHByb2plY3RPYmplY3QuaXNOZXcpIHtcbiAgICAgICAgICAgIC8vIElmIHRoaXMgaXMgdGhlIE5FVyBQUk9KRUNUIHNsb3QsIHNob3cgdGhlIGlucHV0IFVJXG5cbiAgICAgICAgICAgIHZhciBidXR0b25Db250ZW50cyA9ICdHTydcbiAgICAgICAgICAgIGlmICh0aGlzLnN0YXRlLm5ld1Byb2plY3RMb2FkaW5nKSBidXR0b25Db250ZW50cyA9IDxMb2FkaW5nU3Bpbm5lclNWRyAvPlxuXG4gICAgICAgICAgICBwcm9qZWN0VGl0bGUgPSAoXG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e1tEQVNIX1NUWUxFUy5wcm9qZWN0VGl0bGVOZXddfT5cbiAgICAgICAgICAgICAgICA8aW5wdXQga2V5PSduZXctcHJvamVjdC1pbnB1dCdcbiAgICAgICAgICAgICAgICAgIHJlZj0nbmV3UHJvamVjdElucHV0J1xuICAgICAgICAgICAgICAgICAgZGlzYWJsZWQ9e3RoaXMuc3RhdGUubmV3UHJvamVjdExvYWRpbmd9XG4gICAgICAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLmhhbmRsZU5ld1Byb2plY3RJbnB1dENsaWNrLmJpbmQodGhpcyl9XG4gICAgICAgICAgICAgICAgICBvbktleURvd249e3RoaXMuaGFuZGxlTmV3UHJvamVjdElucHV0S2V5RG93bi5iaW5kKHRoaXMpfVxuICAgICAgICAgICAgICAgICAgb25CbHVyPXt0aGlzLmhhbmRsZU5ld1Byb2plY3RJbnB1dEJsdXIuYmluZCh0aGlzKX1cbiAgICAgICAgICAgICAgICAgIHN0eWxlPXtbREFTSF9TVFlMRVMubmV3UHJvamVjdElucHV0XX1cbiAgICAgICAgICAgICAgICAgIHZhbHVlPXt0aGlzLnN0YXRlLnJlY29yZGVkTmV3UHJvamVjdE5hbWV9XG4gICAgICAgICAgICAgICAgICBvbkNoYW5nZT17dGhpcy5oYW5kbGVOZXdQcm9qZWN0SW5wdXRDaGFuZ2UuYmluZCh0aGlzKX1cbiAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPSdOZXdQcm9qZWN0TmFtZScgLz5cbiAgICAgICAgICAgICAgICA8YnV0dG9uIGtleT0nbmV3LXByb2plY3QtZ28tYnV0dG9uJyBkaXNhYmxlZD17dGhpcy5zdGF0ZS5uZXdQcm9qZWN0TG9hZGluZ30gb25DbGljaz17dGhpcy5oYW5kbGVOZXdQcm9qZWN0R28uYmluZCh0aGlzKX0gc3R5bGU9e1tEQVNIX1NUWUxFUy5uZXdQcm9qZWN0R29CdXR0b25dfT57YnV0dG9uQ29udGVudHN9PC9idXR0b24+XG4gICAgICAgICAgICAgICAgPHNwYW4ga2V5PSduZXctcHJvamVjdC1lcnJvcicgc3R5bGU9e1tEQVNIX1NUWUxFUy5uZXdQcm9qZWN0RXJyb3JdfT57dGhpcy5zdGF0ZS5uZXdQcm9qZWN0RXJyb3J9PC9zcGFuPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIClcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gb3RoZXJ3aXNlLCBzaG93IHRoZSByZWFkLW9ubHkgUHJvamVjdCBsaXN0aW5nIGJ1dHRvblxuICAgICAgICAgICAgcHJvamVjdFRpdGxlID0gPHNwYW4gc3R5bGU9e1tEQVNIX1NUWUxFUy5wcm9qZWN0VGl0bGUsIHByb2plY3RPYmplY3QuaXNBY3RpdmUgJiYgREFTSF9TVFlMRVMuYWN0aXZlVGl0bGVdfT57cHJvamVjdE9iamVjdC5wcm9qZWN0TmFtZX08L3NwYW4+XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e1tEQVNIX1NUWUxFUy5wcm9qZWN0V3JhcHBlciwgcHJvamVjdE9iamVjdC5pc0FjdGl2ZSAmJiBEQVNIX1NUWUxFUy5hY3RpdmVXcmFwcGVyXX1cbiAgICAgICAgICAgICAga2V5PXtpbmRleH1cbiAgICAgICAgICAgICAgb25Eb3VibGVDbGljaz17dGhpcy5oYW5kbGVQcm9qZWN0TGF1bmNoLmJpbmQodGhpcywgcHJvamVjdE9iamVjdCl9XG4gICAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuc2V0QWN0aXZlUHJvamVjdC5iaW5kKHRoaXMsIHByb2plY3RPYmplY3QsIGluZGV4KX0+XG4gICAgICAgICAgICAgIDxzcGFuIGtleT17YGEtJHtwcm9qZWN0T2JqZWN0LnByb2plY3ROYW1lfWB9IHN0eWxlPXtbcHJvamVjdE9iamVjdC5pc0FjdGl2ZSAmJiBEQVNIX1NUWUxFUy5hY3RpdmVQcm9qZWN0XX0gLz5cbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e1tEQVNIX1NUWUxFUy5sb2dvLCBwcm9qZWN0T2JqZWN0LmlzQWN0aXZlICYmIERBU0hfU1RZTEVTLmxvZ29BY3RpdmVdfT48TG9nb1NWRyAvPjwvc3Bhbj5cbiAgICAgICAgICAgICAge3Byb2plY3RUaXRsZX1cbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e1tEQVNIX1NUWUxFUy5kYXRlLCBwcm9qZWN0T2JqZWN0LmlzQWN0aXZlICYmIERBU0hfU1RZTEVTLmFjdGl2ZURhdGVdfT5cbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXtEQVNIX1NUWUxFUy5kYXRlVGl0bGV9PnsvKiAocHJvamVjdE9iamVjdC51cGRhdGVkKSA/ICdVUERBVEVEJyA6ICcnICovfTwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXY+ey8qIHByb2plY3RPYmplY3QudXBkYXRlZCAqL308L2Rpdj5cbiAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgKVxuICAgICAgICB9KX1cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIGFscmVhZHlIYXNUb29NYW55UHJvamVjdHMgKCkge1xuICAgIHJldHVybiAoXG4gICAgICAhdGhpcy5zdGF0ZS5hcmVQcm9qZWN0c0xvYWRpbmcgJiZcbiAgICAgIHRoaXMuc3RhdGUucHJvamVjdHNMaXN0ICYmXG4gICAgICB0aGlzLnN0YXRlLnByb2plY3RzTGlzdC5sZW5ndGggPj0gSEFSRENPREVEX1BST0pFQ1RTX0xJTUlUXG4gICAgKVxuICB9XG5cbiAgdGl0bGVXcmFwcGVyRWxlbWVudCAoKSB7XG4gICAgaWYgKHRoaXMuYWxyZWFkeUhhc1Rvb01hbnlQcm9qZWN0cygpKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IHN0eWxlPXtEQVNIX1NUWUxFUy50aXRsZVdyYXBwZXJ9PlxuICAgICAgICAgIDxzcGFuIHN0eWxlPXtEQVNIX1NUWUxFUy5wcm9qZWN0c1RpdGxlfT5Qcm9qZWN0czwvc3Bhbj5cbiAgICAgICAgICA8c3BhbiBzdHlsZT17eyBjb2xvcjogUGFsZXR0ZS5PUkFOR0UgfX0+UHJvamVjdCBsaW1pdDoge0hBUkRDT0RFRF9QUk9KRUNUU19MSU1JVH08L3NwYW4+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKVxuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IHN0eWxlPXtEQVNIX1NUWUxFUy50aXRsZVdyYXBwZXJ9PlxuICAgICAgICA8c3BhbiBzdHlsZT17REFTSF9TVFlMRVMucHJvamVjdHNUaXRsZX0+UHJvamVjdHM8L3NwYW4+XG4gICAgICAgIDxidXR0b25cbiAgICAgICAgICB0YWJJbmRleD0nLTEnXG4gICAgICAgICAgc3R5bGU9e0RBU0hfU1RZTEVTLmJ0bk5ld1Byb2plY3R9XG4gICAgICAgICAgb25DbGljaz17dGhpcy5sYXVuY2hOZXdQcm9qZWN0SW5wdXQuYmluZCh0aGlzKX0+KzwvYnV0dG9uPlxuICAgICAgICB7ICF0aGlzLnN0YXRlLmFyZVByb2plY3RzTG9hZGluZyAmJiB0aGlzLnN0YXRlLnByb2plY3RzTGlzdC5sZW5ndGggPT09IDBcbiAgICAgICAgICA/IDxzcGFuIHN0eWxlPXtEQVNIX1NUWUxFUy50b29sdGlwfT48c3BhbiBzdHlsZT17REFTSF9TVFlMRVMuYXJyb3dMZWZ0fSAvPkNyZWF0ZSBhIFByb2plY3Q8L3NwYW4+XG4gICAgICAgICAgOiBudWxsXG4gICAgICAgIH1cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHByb2plY3RFZGl0QnV0dG9uRWxlbWVudCAocHJvamVjdE9iamVjdCkge1xuICAgIHJldHVybiAoXG4gICAgICA8YnV0dG9uXG4gICAgICAgIHRhYkluZGV4PSctMSdcbiAgICAgICAgc3R5bGU9e0RBU0hfU1RZTEVTLmVkaXRQcm9qZWN0fVxuICAgICAgICBkaXNhYmxlZD17ISF0aGlzLnN0YXRlLmxhdW5jaGluZ1Byb2plY3R9XG4gICAgICAgIG9uQ2xpY2s9e3RoaXMuaGFuZGxlUHJvamVjdExhdW5jaC5iaW5kKHRoaXMsIHByb2plY3RPYmplY3QpfVxuICAgICAgICBpZD0ncHJvamVjdC1lZGl0LWJ1dHRvbic+XG4gICAgICAgIE9wZW4gRWRpdG9yXG4gICAgICA8L2J1dHRvbj5cbiAgICApXG4gIH1cblxuICBwcm9qZWN0Rm9ybUVsZW1lbnQgKHByb2plY3RPYmplY3QpIHtcbiAgICBpZiAoIXByb2plY3RPYmplY3QpIHtcbiAgICAgIGlmICh0aGlzLnN0YXRlLmFyZVByb2plY3RzTG9hZGluZykge1xuICAgICAgICByZXR1cm4gPGRpdiAvPlxuICAgICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlLnByb2plY3RzTGlzdC5sZW5ndGggPT09IDAgJiYgIXRoaXMuc3RhdGUuYXJlUHJvamVjdHNMb2FkaW5nKSB7XG4gICAgICAgIHJldHVybiA8ZGl2IHN0eWxlPXtbREFTSF9TVFlMRVMuZW1wdHlTdGF0ZSwgREFTSF9TVFlMRVMubm9TZWxlY3RdfT5DcmVhdGUgYSBwcm9qZWN0IHRvIGJlZ2luPC9kaXY+XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gPGRpdiBzdHlsZT17W0RBU0hfU1RZTEVTLmVtcHR5U3RhdGUsIERBU0hfU1RZTEVTLm5vU2VsZWN0XX0+U2VsZWN0IGEgcHJvamVjdCB0byBiZWdpbjwvZGl2PlxuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGltcG9ydFVyaSA9IGAke3NuYWtlaXplKHByb2plY3RPYmplY3QucHJvamVjdE5hbWUpfWBcbiAgICBjb25zdCBjb21tYW5kTGluZVNuaXBwZXQgPSBgaGFpa3UgaW5zdGFsbCAke2ltcG9ydFVyaX1gXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXY+XG4gICAgICAgIDxkaXYgc3R5bGU9e0RBU0hfU1RZTEVTLmZpZWxkVGl0bGV9PlByb2plY3QgbmFtZTwvZGl2PlxuICAgICAgICA8ZGl2IHN0eWxlPXt7cG9zaXRpb246ICdyZWxhdGl2ZSd9fT5cbiAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgIGtleT0ncHJvamVjdFRpdGxlJ1xuICAgICAgICAgICAgdmFsdWU9e3Byb2plY3RPYmplY3QucHJvamVjdE5hbWV9XG4gICAgICAgICAgICBzdHlsZT17REFTSF9TVFlMRVMuZmllbGR9XG4gICAgICAgICAgICByZWFkT25seVxuICAgICAgICAgICAgb25DaGFuZ2U9e3RoaXMuaGFuZGxlUHJvamVjdFRpdGxlQ2hhbmdlLmJpbmQodGhpcywgcHJvamVjdE9iamVjdCl9IC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IHN0eWxlPXtEQVNIX1NUWUxFUy5maWVsZFRpdGxlfT5JbXBvcnQgaW50byBhIGNvZGViYXNlIHZpYSBjb21tYW5kIGxpbmU8L2Rpdj5cbiAgICAgICAgPGlucHV0IGtleT0ncHJvamVjdEltcG9ydFVyaScgcmVmPSdpbXBvcnRJbnB1dCcgb25DbGljaz17dGhpcy5oYW5kbGVJbXBvcnRJbnB1dENsaWNrLmJpbmQodGhpcyl9IHZhbHVlPXtjb21tYW5kTGluZVNuaXBwZXR9IHN0eWxlPXtbREFTSF9TVFlMRVMuZmllbGQsIERBU0hfU1RZTEVTLmZpZWxkTW9ub119IHJlYWRPbmx5IC8+XG4gICAgICAgIHt0aGlzLnByb2plY3RFZGl0QnV0dG9uRWxlbWVudChwcm9qZWN0T2JqZWN0KX1cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHJlbmRlck5vdGlmaWNhdGlvbnMgKGNvbnRlbnQsIGkpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPFRvYXN0XG4gICAgICAgIHRvYXN0VHlwZT17Y29udGVudC50eXBlfVxuICAgICAgICB0b2FzdFRpdGxlPXtjb250ZW50LnRpdGxlfVxuICAgICAgICB0b2FzdE1lc3NhZ2U9e2NvbnRlbnQubWVzc2FnZX1cbiAgICAgICAgY2xvc2VUZXh0PXtjb250ZW50LmNsb3NlVGV4dH1cbiAgICAgICAga2V5PXtpICsgY29udGVudC50aXRsZX1cbiAgICAgICAgbXlLZXk9e2l9XG4gICAgICAgIHJlbW92ZU5vdGljZT17dGhpcy5wcm9wcy5yZW1vdmVOb3RpY2V9XG4gICAgICAgIGxpZ2h0U2NoZW1lPXtjb250ZW50LmxpZ2h0U2NoZW1lfSAvPlxuICAgIClcbiAgfVxuXG4gIHJlbmRlciAoKSB7XG4gICAgY29uc3QgYWN0aXZlUHJvamVjdCA9IGxvZGFzaC5maW5kKHRoaXMuc3RhdGUucHJvamVjdHNMaXN0LCB7IGlzQWN0aXZlOiB0cnVlIH0pXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXY+XG4gICAgICAgIDxSZWFjdENTU1RyYW5zaXRpb25Hcm91cFxuICAgICAgICAgIHRyYW5zaXRpb25OYW1lPSd0b2FzdCdcbiAgICAgICAgICB0cmFuc2l0aW9uRW50ZXJUaW1lb3V0PXs1MDB9XG4gICAgICAgICAgdHJhbnNpdGlvbkxlYXZlVGltZW91dD17MzAwfT5cbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7cG9zaXRpb246ICdhYnNvbHV0ZScsIHJpZ2h0OiAwLCB0b3A6IDAsIHdpZHRoOiAzMDB9fT5cbiAgICAgICAgICAgIHtsb2Rhc2gubWFwKHRoaXMucHJvcHMubm90aWNlcywgdGhpcy5yZW5kZXJOb3RpZmljYXRpb25zKX1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9SZWFjdENTU1RyYW5zaXRpb25Hcm91cD5cbiAgICAgICAgPGRpdiBzdHlsZT17W0RBU0hfU1RZTEVTLmRhc2hMZXZlbFdyYXBwZXIsIERBU0hfU1RZTEVTLmFwcGVhckRhc2hMZXZlbF19PlxuICAgICAgICAgIDxkaXYgc3R5bGU9e0RBU0hfU1RZTEVTLmZyYW1lfSBjbGFzc05hbWU9J2ZyYW1lJyAvPlxuICAgICAgICAgIDxkaXYgc3R5bGU9e0RBU0hfU1RZTEVTLnByb2plY3RzQmFyfT5cbiAgICAgICAgICAgIHt0aGlzLnRpdGxlV3JhcHBlckVsZW1lbnQoKX1cbiAgICAgICAgICAgIHt0aGlzLnByb2plY3RzTGlzdEVsZW1lbnQoKX1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IHN0eWxlPXtEQVNIX1NUWUxFUy5kZXRhaWxzfT5cbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e0RBU0hfU1RZTEVTLmNlbnRlckNvbH0+XG4gICAgICAgICAgICAgIHthY3RpdmVQcm9qZWN0ICYmIGFjdGl2ZVByb2plY3QuaXNOZXdcbiAgICAgICAgICAgICAgICA/IDxzcGFuIC8+XG4gICAgICAgICAgICAgICAgOiB0aGlzLnByb2plY3RGb3JtRWxlbWVudChhY3RpdmVQcm9qZWN0KX1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAge3RoaXMuc3RhdGUubGF1bmNoaW5nUHJvamVjdCAmJiA8UHJvamVjdExvYWRlciAvPn1cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxufVxuXG5mdW5jdGlvbiBzbmFrZWl6ZSAoc3RyKSB7XG4gIHN0ciA9IHN0ciB8fCAnJ1xuICByZXR1cm4gc3RyLnJlcGxhY2UoLyAvZywgJ18nKVxufVxuXG4vLyBmdW5jdGlvbiB1bmlxdWVQcm9qZWN0VGl0bGUgKHByb2plY3RzTGlzdCwgdGl0bGUpIHtcbi8vICAgY29uc3QgbWF0Y2hlZFByb2plY3RzID0gZmlsdGVyKHByb2plY3RzTGlzdCwgeyB0aXRsZSB9KVxuLy8gICBpZiAobWF0Y2hlZFByb2plY3RzLmxlbmd0aCA8IDEpIHJldHVybiB0aXRsZVxuLy8gICAvLyBUT0RPOiBQbGVhc2UgbWFrZSB0aGlzIGFsZ29yaXRobSByb2J1c3Rcbi8vICAgcmV0dXJuIGAke3RpdGxlfSAke3Byb2plY3RzTGlzdC5sZW5ndGggKyAxfWBcbi8vIH1cblxuZXhwb3J0IGRlZmF1bHQgUmFkaXVtKFByb2plY3RCcm93c2VyKVxuIl19