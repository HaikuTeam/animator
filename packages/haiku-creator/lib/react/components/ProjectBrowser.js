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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9yZWFjdC9jb21wb25lbnRzL1Byb2plY3RCcm93c2VyLmpzIl0sIm5hbWVzIjpbIkhBUkRDT0RFRF9QUk9KRUNUU19MSU1JVCIsIlByb2plY3RCcm93c2VyIiwicHJvcHMiLCJyZW5kZXJOb3RpZmljYXRpb25zIiwiYmluZCIsInN0YXRlIiwiZXJyb3IiLCJzaG93TmVlZHNTYXZlRGlhbG9ndWUiLCJwcm9qZWN0c0xpc3QiLCJhcmVQcm9qZWN0c0xvYWRpbmciLCJsYXVuY2hpbmdQcm9qZWN0IiwicmVjb3JkZWROZXdQcm9qZWN0TmFtZSIsImhhbmRsZURvY3VtZW50S2V5UHJlc3MiLCJoYW5kbGVTZWxlY3RQcm9qZWN0IiwibG9hZFByb2plY3RzIiwiZG9jdW1lbnQiLCJhZGRFdmVudExpc3RlbmVyIiwiZW52b3kiLCJnZXQiLCJ0aGVuIiwidG91ckNoYW5uZWwiLCJvbiIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJvZmYiLCJwcm9qZWN0SWR4IiwiZmluZEluZGV4IiwicHJvamVjdCIsInByb2plY3ROYW1lIiwic2V0QWN0aXZlUHJvamVjdCIsImV2dCIsImRlbHRhIiwiY29kZSIsImZvdW5kIiwiZm9yRWFjaCIsImkiLCJpc0FjdGl2ZSIsInByb3Bvc2VkSW5kZXgiLCJpc05ldyIsIm5ld1Byb2plY3RMb2FkaW5nIiwic2hpZnQiLCJuZXdJbmRleCIsIk1hdGgiLCJtaW4iLCJtYXgiLCJsZW5ndGgiLCJzZXRTdGF0ZSIsImNyZWF0ZU5vdGljZSIsInR5cGUiLCJ0aXRsZSIsIm1lc3NhZ2UiLCJjbG9zZVRleHQiLCJsaWdodFNjaGVtZSIsInByb2plY3RPYmplY3QiLCJwcm9qZWN0SW5kZXgiLCJmb3VuZFByb2plY3QiLCJmb3VuZEluZGV4IiwiY2hhbmdlRXZlbnQiLCJpc1Byb2plY3ROYW1lQmFkIiwidGFyZ2V0IiwidmFsdWUiLCJhbHJlYWR5SGFzVG9vTWFueVByb2plY3RzIiwidW5zaGlmdCIsInNldFRpbWVvdXQiLCJyZWZzIiwibmV3UHJvamVjdElucHV0Iiwic2VsZWN0IiwiY29uc29sZSIsIndhcm4iLCJsYXVuY2hQcm9qZWN0IiwiaW1wb3J0SW5wdXQiLCJlIiwia2V5Q29kZSIsImhhbmRsZU5ld1Byb2plY3RHbyIsInVuc2V0QWN0aXZlUHJvamVjdCIsImV2ZW50IiwicmF3IiwibmFtZSIsInJlcGxhY2UiLCJ3ZWJzb2NrZXQiLCJyZXF1ZXN0IiwibWV0aG9kIiwicGFyYW1zIiwiZXJyIiwibmV3UHJvamVjdCIsInNwbGljZSIsInBsYWNlaG9sZGVyUHJvamVjdCIsInByb2plY3RMaXN0IiwibG9hZGluZ1dyYXAiLCJST0NLX01VVEVEIiwiaGVpZ2h0Iiwib3ZlcmZsb3dZIiwibWFwIiwiaW5kZXgiLCJwcm9qZWN0VGl0bGUiLCJidXR0b25Db250ZW50cyIsInByb2plY3RUaXRsZU5ldyIsImhhbmRsZU5ld1Byb2plY3RJbnB1dENsaWNrIiwiaGFuZGxlTmV3UHJvamVjdElucHV0S2V5RG93biIsImhhbmRsZU5ld1Byb2plY3RJbnB1dEJsdXIiLCJoYW5kbGVOZXdQcm9qZWN0SW5wdXRDaGFuZ2UiLCJuZXdQcm9qZWN0R29CdXR0b24iLCJuZXdQcm9qZWN0RXJyb3IiLCJhY3RpdmVUaXRsZSIsInByb2plY3RXcmFwcGVyIiwiYWN0aXZlV3JhcHBlciIsImhhbmRsZVByb2plY3RMYXVuY2giLCJhY3RpdmVQcm9qZWN0IiwibG9nbyIsImxvZ29BY3RpdmUiLCJkYXRlIiwiYWN0aXZlRGF0ZSIsImRhdGVUaXRsZSIsInRpdGxlV3JhcHBlciIsInByb2plY3RzVGl0bGUiLCJjb2xvciIsIk9SQU5HRSIsImJ0bk5ld1Byb2plY3QiLCJsYXVuY2hOZXdQcm9qZWN0SW5wdXQiLCJ0b29sdGlwIiwiYXJyb3dMZWZ0IiwiZWRpdFByb2plY3QiLCJlbXB0eVN0YXRlIiwibm9TZWxlY3QiLCJpbXBvcnRVcmkiLCJzbmFrZWl6ZSIsImNvbW1hbmRMaW5lU25pcHBldCIsImZpZWxkVGl0bGUiLCJwb3NpdGlvbiIsImZpZWxkIiwiaGFuZGxlUHJvamVjdFRpdGxlQ2hhbmdlIiwiaGFuZGxlSW1wb3J0SW5wdXRDbGljayIsImZpZWxkTW9ubyIsInByb2plY3RFZGl0QnV0dG9uRWxlbWVudCIsImNvbnRlbnQiLCJyZW1vdmVOb3RpY2UiLCJmaW5kIiwicmlnaHQiLCJ0b3AiLCJ3aWR0aCIsIm5vdGljZXMiLCJkYXNoTGV2ZWxXcmFwcGVyIiwiYXBwZWFyRGFzaExldmVsIiwiZnJhbWUiLCJwcm9qZWN0c0JhciIsInRpdGxlV3JhcHBlckVsZW1lbnQiLCJwcm9qZWN0c0xpc3RFbGVtZW50IiwiZGV0YWlscyIsImNlbnRlckNvbCIsInByb2plY3RGb3JtRWxlbWVudCIsIkNvbXBvbmVudCIsInN0ciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7Ozs7Ozs7OztBQUVBLElBQU1BLDJCQUEyQixFQUFqQzs7SUFFTUMsYzs7O0FBQ0osMEJBQWFDLEtBQWIsRUFBb0I7QUFBQTs7QUFBQSxnSUFDWkEsS0FEWTs7QUFFbEIsVUFBS0MsbUJBQUwsR0FBMkIsTUFBS0EsbUJBQUwsQ0FBeUJDLElBQXpCLE9BQTNCO0FBQ0EsVUFBS0MsS0FBTCxHQUFhO0FBQ1hDLGFBQU8sSUFESTtBQUVYQyw2QkFBdUIsS0FGWjtBQUdYQyxvQkFBYyxFQUhIO0FBSVhDLDBCQUFvQixJQUpUO0FBS1hDLHdCQUFrQixLQUxQO0FBTVhDLDhCQUF3QjtBQU5iLEtBQWI7QUFRQSxVQUFLQyxzQkFBTCxHQUE4QixNQUFLQSxzQkFBTCxDQUE0QlIsSUFBNUIsT0FBOUI7QUFDQSxVQUFLUyxtQkFBTCxHQUEyQixNQUFLQSxtQkFBTCxDQUF5QlQsSUFBekIsT0FBM0I7QUFaa0I7QUFhbkI7Ozs7d0NBRW9CO0FBQUE7O0FBQ25CLFdBQUtVLFlBQUw7QUFDQUMsZUFBU0MsZ0JBQVQsQ0FBMEIsU0FBMUIsRUFBcUMsS0FBS0osc0JBQTFDLEVBQWtFLElBQWxF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Q0UsaURBQUssT0FBTyx3QkFBWUMsS0FBeEIsRUFBK0IsV0FBVSxPQUF6QztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsWUFERjtBQUVFO0FBQUE7QUFBQSxjQUFLLE9BQU8sd0JBQVlDLFdBQXhCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNHLGlCQUFLQyxtQkFBTCxFQURIO0FBRUcsaUJBQUtDLG1CQUFMO0FBRkgsV0FGRjtBQU1FO0FBQUE7QUFBQSxjQUFLLE9BQU8sd0JBQVlDLE9BQXhCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNFO0FBQUE7QUFBQSxnQkFBSyxPQUFPLHdCQUFZQyxTQUF4QjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDR3pDLCtCQUFpQkEsY0FBY3JFLEtBQS9CLEdBQ0c7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsZ0JBREgsR0FFRyxLQUFLK0csa0JBQUwsQ0FBd0IxQyxhQUF4QjtBQUhOO0FBREY7QUFORixTQVRGO0FBdUJHLGFBQUtyRyxLQUFMLENBQVdLLGdCQUFYLElBQStCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBdkJsQyxPQURGO0FBMkJEOzs7O0VBN1owQixnQkFBTTJJLFM7O0FBZ2FuQyxTQUFTekIsUUFBVCxDQUFtQjBCLEdBQW5CLEVBQXdCO0FBQ3RCQSxRQUFNQSxPQUFPLEVBQWI7QUFDQSxTQUFPQSxJQUFJekUsT0FBSixDQUFZLElBQVosRUFBa0IsR0FBbEIsQ0FBUDtBQUNEOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7a0JBRWUsc0JBQU81RSxjQUFQLEMiLCJmaWxlIjoiUHJvamVjdEJyb3dzZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgbG9kYXNoIGZyb20gJ2xvZGFzaCdcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCBSYWRpdW0gZnJvbSAncmFkaXVtJ1xuaW1wb3J0IFJlYWN0Q1NTVHJhbnNpdGlvbkdyb3VwIGZyb20gJ3JlYWN0LWFkZG9ucy1jc3MtdHJhbnNpdGlvbi1ncm91cCdcbmltcG9ydCB7IEZhZGluZ0NpcmNsZSB9IGZyb20gJ2JldHRlci1yZWFjdC1zcGlua2l0J1xuaW1wb3J0IFBhbGV0dGUgZnJvbSAnLi9QYWxldHRlJ1xuaW1wb3J0IFRvYXN0IGZyb20gJy4vbm90aWZpY2F0aW9ucy9Ub2FzdCdcbmltcG9ydCBQcm9qZWN0TG9hZGVyIGZyb20gJy4vUHJvamVjdExvYWRlcidcbmltcG9ydCB7IExvZ29TVkcsIExvYWRpbmdTcGlubmVyU1ZHIH0gZnJvbSAnLi9JY29ucydcbmltcG9ydCB7IERBU0hfU1RZTEVTIH0gZnJvbSAnLi4vc3R5bGVzL2Rhc2hTaGFyZWQnXG5cbmNvbnN0IEhBUkRDT0RFRF9QUk9KRUNUU19MSU1JVCA9IDE1XG5cbmNsYXNzIFByb2plY3RCcm93c2VyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IgKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpXG4gICAgdGhpcy5yZW5kZXJOb3RpZmljYXRpb25zID0gdGhpcy5yZW5kZXJOb3RpZmljYXRpb25zLmJpbmQodGhpcylcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgZXJyb3I6IG51bGwsXG4gICAgICBzaG93TmVlZHNTYXZlRGlhbG9ndWU6IGZhbHNlLFxuICAgICAgcHJvamVjdHNMaXN0OiBbXSxcbiAgICAgIGFyZVByb2plY3RzTG9hZGluZzogdHJ1ZSxcbiAgICAgIGxhdW5jaGluZ1Byb2plY3Q6IGZhbHNlLFxuICAgICAgcmVjb3JkZWROZXdQcm9qZWN0TmFtZTogJydcbiAgICB9XG4gICAgdGhpcy5oYW5kbGVEb2N1bWVudEtleVByZXNzID0gdGhpcy5oYW5kbGVEb2N1bWVudEtleVByZXNzLmJpbmQodGhpcylcbiAgICB0aGlzLmhhbmRsZVNlbGVjdFByb2plY3QgPSB0aGlzLmhhbmRsZVNlbGVjdFByb2plY3QuYmluZCh0aGlzKVxuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQgKCkge1xuICAgIHRoaXMubG9hZFByb2plY3RzKClcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdGhpcy5oYW5kbGVEb2N1bWVudEtleVByZXNzLCB0cnVlKVxuXG4gICAgdGhpcy5wcm9wcy5lbnZveS5nZXQoJ3RvdXInKS50aGVuKCh0b3VyQ2hhbm5lbCkgPT4ge1xuICAgICAgdGhpcy50b3VyQ2hhbm5lbCA9IHRvdXJDaGFubmVsXG4gICAgICB0b3VyQ2hhbm5lbC5vbigndG91cjpyZXF1ZXN0U2VsZWN0UHJvamVjdCcsIHRoaXMuaGFuZGxlU2VsZWN0UHJvamVjdClcbiAgICB9KVxuICB9XG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQgKCkge1xuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLmhhbmRsZURvY3VtZW50S2V5UHJlc3MsIHRydWUpXG4gICAgdGhpcy50b3VyQ2hhbm5lbC5vZmYoJ3RvdXI6cmVxdWVzdFNlbGVjdFByb2plY3QnLCB0aGlzLmhhbmRsZVNlbGVjdFByb2plY3QpXG4gIH1cblxuICBoYW5kbGVTZWxlY3RQcm9qZWN0ICgpIHtcbiAgICBjb25zdCBwcm9qZWN0SWR4ID0gdGhpcy5zdGF0ZS5wcm9qZWN0c0xpc3QuZmluZEluZGV4KChwcm9qZWN0KSA9PiB7XG4gICAgICAvLyBIYXJkY29kZWQgLSBOYW1lIG9mIHRoZSBwcm9qZWN0IHRoYXQgd2lsbCBiZSB1c2VkIGZvciB0aGUgdHV0b3JpYWxcbiAgICAgIHJldHVybiBwcm9qZWN0LnByb2plY3ROYW1lID09PSAnQ2hlY2tUdXRvcmlhbCdcbiAgICB9KVxuXG4gICAgdGhpcy5zZXRBY3RpdmVQcm9qZWN0KHRoaXMuc3RhdGUucHJvamVjdHNMaXN0W3Byb2plY3RJZHhdLCBwcm9qZWN0SWR4KVxuICB9XG5cbiAgaGFuZGxlRG9jdW1lbnRLZXlQcmVzcyAoZXZ0KSB7XG4gICAgdmFyIHByb2plY3RzTGlzdCA9IHRoaXMuc3RhdGUucHJvamVjdHNMaXN0XG5cbiAgICB2YXIgZGVsdGEgPSAwXG4gICAgaWYgKGV2dC5jb2RlID09PSAnQXJyb3dVcCcpIHtcbiAgICAgIGRlbHRhID0gLTFcbiAgICB9IGVsc2UgaWYgKGV2dC5jb2RlID09PSAnQXJyb3dEb3duJykge1xuICAgICAgZGVsdGEgPSAxXG4gICAgfVxuXG4gICAgdmFyIGZvdW5kID0gZmFsc2VcbiAgICBwcm9qZWN0c0xpc3QuZm9yRWFjaCgocHJvamVjdCwgaSkgPT4ge1xuICAgICAgaWYgKCFmb3VuZCAmJiBwcm9qZWN0LmlzQWN0aXZlKSB7XG4gICAgICAgIHZhciBwcm9wb3NlZEluZGV4ID0gaSArIGRlbHRhXG4gICAgICAgIC8vIHJlbW92ZSBjcmVhdGUgVUkgaWYgbmF2aWdhdGluZyBhd2F5IGJlZm9yZSBzdWJtaXR0aW5nXG4gICAgICAgIGlmIChpID09PSAwICYmIGRlbHRhID09PSAxICYmIHByb2plY3QuaXNOZXcgJiYgIXRoaXMuc3RhdGUubmV3UHJvamVjdExvYWRpbmcpIHtcbiAgICAgICAgICBwcm9wb3NlZEluZGV4ID0gMFxuICAgICAgICAgIHByb2plY3RzTGlzdC5zaGlmdCgpXG4gICAgICAgIH1cblxuICAgICAgICB2YXIgbmV3SW5kZXggPSBNYXRoLm1pbihNYXRoLm1heCgwLCBwcm9wb3NlZEluZGV4KSwgcHJvamVjdHNMaXN0Lmxlbmd0aCAtIDEpXG5cbiAgICAgICAgcHJvamVjdC5pc0FjdGl2ZSA9IGZhbHNlXG4gICAgICAgIHByb2plY3RzTGlzdFtuZXdJbmRleF0uaXNBY3RpdmUgPSB0cnVlXG4gICAgICAgIGZvdW5kID0gdHJ1ZVxuICAgICAgfVxuICAgIH0pXG4gICAgdGhpcy5zZXRTdGF0ZSh7cHJvamVjdHNMaXN0fSlcbiAgfVxuXG4gIGxvYWRQcm9qZWN0cyAoKSB7XG4gICAgcmV0dXJuIHRoaXMucHJvcHMubG9hZFByb2plY3RzKChlcnJvciwgcHJvamVjdHNMaXN0KSA9PiB7XG4gICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgdGhpcy5wcm9wcy5jcmVhdGVOb3RpY2Uoe1xuICAgICAgICAgIHR5cGU6ICdlcnJvcicsXG4gICAgICAgICAgdGl0bGU6ICdPaCBubyEnLFxuICAgICAgICAgIG1lc3NhZ2U6ICdXZSBjb3VsZG5cXCd0IGxvYWQgeW91ciB0ZWFtXFwncyBwcm9qZWN0cy4g8J+YoiBQbGVhc2UgZW5zdXJlIHRoYXQgeW91ciBjb21wdXRlciBpcyBjb25uZWN0ZWQgdG8gdGhlIEludGVybmV0LiBJZiB5b3VcXCdyZSBjb25uZWN0ZWQgYW5kIHlvdSBzdGlsbCBzZWUgdGhpcyBtZXNzYWdlIG91ciBzZXJ2ZXJzIG1pZ2h0IGJlIGhhdmluZyBwcm9ibGVtcy4gUGxlYXNlIHRyeSBhZ2FpbiBpbiBhIGZldyBtb21lbnRzLiBJZiB5b3Ugc3RpbGwgc2VlIHRoaXMgbWVzc2FnZSwgY29udGFjdCBIYWlrdSBmb3Igc3VwcG9ydC4nLFxuICAgICAgICAgIGNsb3NlVGV4dDogJ09rYXknLFxuICAgICAgICAgIGxpZ2h0U2NoZW1lOiB0cnVlXG4gICAgICAgIH0pXG4gICAgICAgIHJldHVybiB0aGlzLnNldFN0YXRlKHsgZXJyb3IsIGFyZVByb2plY3RzTG9hZGluZzogZmFsc2UgfSlcbiAgICAgIH1cbiAgICAgIC8vIHNlbGVjdCB0aGUgZmlyc3QgcHJvamVjdCBieSBkZWZhdWx0XG4gICAgICBpZiAocHJvamVjdHNMaXN0Lmxlbmd0aCkge1xuICAgICAgICBwcm9qZWN0c0xpc3RbMF0uaXNBY3RpdmUgPSB0cnVlXG4gICAgICB9XG4gICAgICB0aGlzLnNldFN0YXRlKHsgcHJvamVjdHNMaXN0LCBhcmVQcm9qZWN0c0xvYWRpbmc6IGZhbHNlIH0pXG4gICAgfSlcbiAgfVxuXG4gIHNldEFjdGl2ZVByb2plY3QgKHByb2plY3RPYmplY3QsIHByb2plY3RJbmRleCkge1xuICAgIGNvbnN0IHByb2plY3RzTGlzdCA9IHRoaXMuc3RhdGUucHJvamVjdHNMaXN0XG5cbiAgICAvLyBUT0RPOiBpZiBjdXJyZW50IHByb2plY3QgaGFzIHVuc2F2ZWQgZWRpdHMgdGhlbiBzaG93IHNhdmUgZGlhbG9ndWVcbiAgICAvLyAgICAgICBhbmQgcmV0dXJuIHdpdGhvdXQgY2hhbmdpbmcgcHJvamVjdHNcbiAgICAvLyBpZiAoZmFsc2UpIHtcbiAgICAvLyAgIHRoaXMuc2V0U3RhdGUoeyBzaG93TmVlZHNTYXZlRGlhbG9ndWU6IHRydWUgfSlcbiAgICAvLyAgIHJldHVybiBmYWxzZVxuICAgIC8vIH1cblxuICAgIHByb2plY3RzTGlzdC5mb3JFYWNoKChmb3VuZFByb2plY3QsIGZvdW5kSW5kZXgpID0+IHtcbiAgICAgIC8vIHJlbW92ZSBuZXcgcHJvamVjdCBpZiBuYXZpZ2F0aW5nIGF3YXkgYmVmb3JlIGl0J3MgY29tcGxldGVcbiAgICAgIGlmIChwcm9qZWN0SW5kZXggIT09IDAgJiYgZm91bmRJbmRleCA9PT0gMCAmJiBmb3VuZFByb2plY3QuaXNOZXcgJiYgIXRoaXMuc3RhdGUubmV3UHJvamVjdExvYWRpbmcpIHByb2plY3RzTGlzdC5zaGlmdCgpXG4gICAgICBpZiAoZm91bmRJbmRleCA9PT0gcHJvamVjdEluZGV4KSBmb3VuZFByb2plY3QuaXNBY3RpdmUgPSB0cnVlXG4gICAgICBlbHNlIGZvdW5kUHJvamVjdC5pc0FjdGl2ZSA9IGZhbHNlXG4gICAgfSlcbiAgICB0aGlzLnNldFN0YXRlKHsgcHJvamVjdHNMaXN0IH0pXG4gIH1cblxuICB1bnNldEFjdGl2ZVByb2plY3QoKSB7XG4gICAgLy8gSGFja3kgd2F5IHRvIHVuc2V0IGN1cnJlbnQgcHJvamVjdFxuICAgIHRoaXMuc2V0QWN0aXZlUHJvamVjdCgpXG4gIH1cblxuICBoYW5kbGVQcm9qZWN0VGl0bGVDaGFuZ2UgKHByb2plY3RPYmplY3QsIGNoYW5nZUV2ZW50KSB7XG4gICAgaWYgKCF0aGlzLmlzUHJvamVjdE5hbWVCYWQoY2hhbmdlRXZlbnQudGFyZ2V0LnZhbHVlKSkge1xuICAgICAgcHJvamVjdE9iamVjdC5wcm9qZWN0TmFtZSA9IGNoYW5nZUV2ZW50LnRhcmdldC52YWx1ZVxuICAgIH1cbiAgICB0aGlzLnNldFN0YXRlKHsgcHJvamVjdHNMaXN0OiB0aGlzLnN0YXRlLnByb2plY3RzTGlzdCB9KVxuICB9XG5cbiAgbGF1bmNoTmV3UHJvamVjdElucHV0ICgpIHtcbiAgICBpZiAodGhpcy5hbHJlYWR5SGFzVG9vTWFueVByb2plY3RzKCkpIHtcbiAgICAgIHJldHVybiB2b2lkICgwKVxuICAgIH1cblxuICAgIHZhciBwcm9qZWN0c0xpc3QgPSB0aGlzLnN0YXRlLnByb2plY3RzTGlzdFxuICAgIGlmICghcHJvamVjdHNMaXN0WzBdIHx8ICFwcm9qZWN0c0xpc3RbMF0uaXNOZXcpIHtcbiAgICAgIHByb2plY3RzTGlzdC5mb3JFYWNoKChmb3VuZFByb2plY3QsIGZvdW5kSW5kZXgpID0+IHtcbiAgICAgICAgZm91bmRQcm9qZWN0LmlzQWN0aXZlID0gZmFsc2VcbiAgICAgIH0pXG4gICAgICBwcm9qZWN0c0xpc3QudW5zaGlmdCh7XG4gICAgICAgIGlzQWN0aXZlOiB0cnVlLFxuICAgICAgICBpc05ldzogdHJ1ZSxcbiAgICAgICAgdGl0bGU6ICcnXG4gICAgICB9KVxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHRoaXMucmVmcy5uZXdQcm9qZWN0SW5wdXQuc2VsZWN0KClcbiAgICAgIH0sIDUwKVxuICAgICAgdGhpcy5zZXRTdGF0ZSh7IHByb2plY3RzTGlzdCB9KVxuICAgIH1cbiAgfVxuXG4gIGlzUHJvamVjdE5hbWVCYWQgKHByb2plY3ROYW1lKSB7XG4gICAgaWYgKCFwcm9qZWN0TmFtZSkgcmV0dXJuIHRydWVcbiAgICBpZiAocHJvamVjdE5hbWUgPT09ICcnKSByZXR1cm4gdHJ1ZVxuICAgIHJldHVybiBmYWxzZVxuICB9XG5cbiAgaGFuZGxlUHJvamVjdExhdW5jaCAocHJvamVjdE9iamVjdCkge1xuICAgIGlmICh0aGlzLmlzUHJvamVjdE5hbWVCYWQocHJvamVjdE9iamVjdC5wcm9qZWN0TmFtZSkpIHtcbiAgICAgIGNvbnNvbGUud2FybignYmFkIG5hbWUgbGF1bmNoZWQ6JywgcHJvamVjdE9iamVjdC5wcm9qZWN0TmFtZSlcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7IGxhdW5jaGluZ1Byb2plY3Q6IHByb2plY3RPYmplY3QgfSlcbiAgICAgIC8vIHByb2plY3RPYmplY3QucHJvamVjdHNIb21lIHRvIHVzZSBwcm9qZWN0IGNvbnRhaW5lciBmb2xkZXJcbiAgICAgIC8vIHByb2plY3RPYmplY3QucHJvamVjdFBhdGggdG8gc2V0IHNwZWNpZmljIHByb2plY3QgZm9sZGVyIChubyBpbmZlcmVuY2UpXG4gICAgICByZXR1cm4gdGhpcy5wcm9wcy5sYXVuY2hQcm9qZWN0KHByb2plY3RPYmplY3QucHJvamVjdE5hbWUsIHByb2plY3RPYmplY3QsIChlcnJvcikgPT4ge1xuICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICB0aGlzLnByb3BzLmNyZWF0ZU5vdGljZSh7XG4gICAgICAgICAgICB0eXBlOiAnZXJyb3InLFxuICAgICAgICAgICAgdGl0bGU6ICdPaCBubyEnLFxuICAgICAgICAgICAgbWVzc2FnZTogJ1dlIGNvdWxkblxcJ3Qgb3BlbiB0aGlzIHByb2plY3QuIPCfmKkgUGxlYXNlIGVuc3VyZSB0aGF0IHlvdXIgY29tcHV0ZXIgaXMgY29ubmVjdGVkIHRvIHRoZSBJbnRlcm5ldC4gSWYgeW91XFwncmUgY29ubmVjdGVkIGFuZCB5b3Ugc3RpbGwgc2VlIHRoaXMgbWVzc2FnZSB5b3VyIGZpbGVzIG1pZ2h0IHN0aWxsIGJlIHByb2Nlc3NpbmcuIFBsZWFzZSB0cnkgYWdhaW4gaW4gYSBmZXcgbW9tZW50cy4gSWYgeW91IHN0aWxsIHNlZSB0aGlzIGVycm9yLCBjb250YWN0IEhhaWt1IGZvciBzdXBwb3J0LicsXG4gICAgICAgICAgICBjbG9zZVRleHQ6ICdPa2F5JyxcbiAgICAgICAgICAgIGxpZ2h0U2NoZW1lOiB0cnVlXG4gICAgICAgICAgfSlcbiAgICAgICAgICByZXR1cm4gdGhpcy5zZXRTdGF0ZSh7IGVycm9yLCBsYXVuY2hpbmdQcm9qZWN0OiBudWxsIH0pXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgaGFuZGxlSW1wb3J0SW5wdXRDbGljayAoKSB7XG4gICAgdGhpcy5yZWZzLmltcG9ydElucHV0LnNlbGVjdCgpXG4gIH1cblxuICBoYW5kbGVOZXdQcm9qZWN0SW5wdXRDbGljayAoKSB7XG4gICAgdGhpcy5yZWZzLm5ld1Byb2plY3RJbnB1dC5zZWxlY3QoKVxuICB9XG5cbiAgaGFuZGxlTmV3UHJvamVjdElucHV0S2V5RG93biAoZSkge1xuICAgIGlmIChlLmtleUNvZGUgPT09IDEzKSB7XG4gICAgICB0aGlzLmhhbmRsZU5ld1Byb2plY3RHbygpXG4gICAgfSBlbHNlIGlmKGUua2V5Q29kZSA9PT0gMjcpIHtcbiAgICAgIHRoaXMudW5zZXRBY3RpdmVQcm9qZWN0KClcbiAgICB9XG4gIH1cblxuICBoYW5kbGVOZXdQcm9qZWN0SW5wdXRCbHVyICgpIHtcbiAgICAvLyBBZGQgYSBkZWxheSBiZWZvcmUgY2xvc2luZywgaWYgdGhlIGJsdXIgaXMgbG9zdCBiZWNhdXNlXG4gICAgLy8gdGhlIGlucHV0IGlzIGJlaW5nIHN1bWl0dGVkIHRoaXMgd2lsbCBwcmV2ZW50IFVJIGdsaXRjaGVzXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aGlzLnVuc2V0QWN0aXZlUHJvamVjdCgpXG4gICAgfSwgMTUwKVxuICB9XG5cbiAgaGFuZGxlTmV3UHJvamVjdElucHV0Q2hhbmdlIChldmVudCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe3JlY29yZGVkTmV3UHJvamVjdE5hbWU6IGV2ZW50LnRhcmdldC52YWx1ZX0pXG4gIH1cblxuICBoYW5kbGVOZXdQcm9qZWN0R28gKCkge1xuICAgIHZhciByYXcgPSB0aGlzLnJlZnMubmV3UHJvamVjdElucHV0LnZhbHVlXG4gICAgLy8gSEFDSzogIHN0cmlwIGFsbCBub24tYWxwaGFudW1lcmljIGNoYXJzIGZvciBub3cuICBzb21ldGhpbmcgbW9yZSB1c2VyLWZyaWVuZGx5IHdvdWxkIGJlIGlkZWFsXG4gICAgdmFyIG5hbWUgPSByYXcgJiYgcmF3LnJlcGxhY2UoL1teYS16MC05XS9naSwgJycpXG5cbiAgICBpZiAodGhpcy5pc1Byb2plY3ROYW1lQmFkKG5hbWUpKSB7XG4gICAgICBjb25zb2xlLndhcm4oJ2JhZCBuYW1lIGVudGVyZWQ6JywgbmFtZSlcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7bmV3UHJvamVjdExvYWRpbmc6IHRydWUsIHJlY29yZGVkTmV3UHJvamVjdE5hbWU6ICcnfSlcbiAgICAgIHRoaXMucHJvcHMud2Vic29ja2V0LnJlcXVlc3QoeyBtZXRob2Q6ICdjcmVhdGVQcm9qZWN0JywgcGFyYW1zOiBbbmFtZV0gfSwgKGVyciwgbmV3UHJvamVjdCkgPT4ge1xuICAgICAgICBjb25zdCBwcm9qZWN0c0xpc3QgPSB0aGlzLnN0YXRlLnByb2plY3RzTGlzdFxuICAgICAgICB0aGlzLnNldFN0YXRlKHtuZXdQcm9qZWN0TG9hZGluZzogZmFsc2V9KVxuICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgcHJvamVjdHNMaXN0LnNwbGljZSgwLCAxKVxuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBwcm9qZWN0c0xpc3QgfSlcbiAgICAgICAgICB0aGlzLnByb3BzLmNyZWF0ZU5vdGljZSh7XG4gICAgICAgICAgICB0eXBlOiAnZXJyb3InLFxuICAgICAgICAgICAgdGl0bGU6ICdPaCBubyEnLFxuICAgICAgICAgICAgbWVzc2FnZTogJ1dlIGNvdWxkblxcJ3QgY3JlYXRlIHlvdXIgcHJvamVjdC4g8J+YqSBEb2VzIHRoaXMgcHJvamVjdCB3aXRoIHRoaXMgbmFtZSBhbHJlYWR5IGV4aXN0PycsXG4gICAgICAgICAgICBjbG9zZVRleHQ6ICdPa2F5JyxcbiAgICAgICAgICAgIGxpZ2h0U2NoZW1lOiB0cnVlXG4gICAgICAgICAgfSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBzdHJpcCBcIm5ld1wiIHByb2plY3QgZnJvbSB0b3Agb2YgbGlzdCwgdW5zaGlmdCBhY3R1YWwgbmV3IHByb2plY3RcbiAgICAgICAgICB2YXIgcGxhY2Vob2xkZXJQcm9qZWN0ID0gcHJvamVjdHNMaXN0LnNwbGljZSgwLCAxKVswXVxuICAgICAgICAgIG5ld1Byb2plY3QuaXNBY3RpdmUgPSBwbGFjZWhvbGRlclByb2plY3QuaXNBY3RpdmVcbiAgICAgICAgICBwcm9qZWN0c0xpc3QudW5zaGlmdChuZXdQcm9qZWN0KVxuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe3Byb2plY3RMaXN0OiBwcm9qZWN0c0xpc3R9KVxuICAgICAgICAgIC8vIGF1dG8tbGF1bmNoIG5ld2x5IGNyZWF0ZWQgcHJvamVjdFxuICAgICAgICAgIC8vIHRoaXMuaGFuZGxlUHJvamVjdExhdW5jaChuZXdQcm9qZWN0KVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIHByb2plY3RzTGlzdEVsZW1lbnQgKCkge1xuICAgIGlmICh0aGlzLnN0YXRlLmFyZVByb2plY3RzTG9hZGluZykge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPHNwYW4gc3R5bGU9e0RBU0hfU1RZTEVTLmxvYWRpbmdXcmFwfT5cbiAgICAgICAgICA8RmFkaW5nQ2lyY2xlIHNpemU9ezMyfSBjb2xvcj17UGFsZXR0ZS5ST0NLX01VVEVEfSAvPlxuICAgICAgICA8L3NwYW4+XG4gICAgICApXG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgc3R5bGU9e3toZWlnaHQ6ICdjYWxjKDEwMCUgLSA3MHB4KScsIG92ZXJmbG93WTogJ2F1dG8nfX0+XG4gICAgICAgIHt0aGlzLnN0YXRlLnByb2plY3RzTGlzdC5tYXAoKHByb2plY3RPYmplY3QsIGluZGV4KSA9PiB7XG4gICAgICAgICAgdmFyIHByb2plY3RUaXRsZVxuICAgICAgICAgIGlmIChwcm9qZWN0T2JqZWN0LmlzTmV3KSB7XG4gICAgICAgICAgICAvLyBJZiB0aGlzIGlzIHRoZSBORVcgUFJPSkVDVCBzbG90LCBzaG93IHRoZSBpbnB1dCBVSVxuXG4gICAgICAgICAgICB2YXIgYnV0dG9uQ29udGVudHMgPSAnR08nXG4gICAgICAgICAgICBpZiAodGhpcy5zdGF0ZS5uZXdQcm9qZWN0TG9hZGluZykgYnV0dG9uQ29udGVudHMgPSA8TG9hZGluZ1NwaW5uZXJTVkcgLz5cblxuICAgICAgICAgICAgcHJvamVjdFRpdGxlID0gKFxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXtbREFTSF9TVFlMRVMucHJvamVjdFRpdGxlTmV3XX0+XG4gICAgICAgICAgICAgICAgPGlucHV0IGtleT0nbmV3LXByb2plY3QtaW5wdXQnXG4gICAgICAgICAgICAgICAgICByZWY9J25ld1Byb2plY3RJbnB1dCdcbiAgICAgICAgICAgICAgICAgIGRpc2FibGVkPXt0aGlzLnN0YXRlLm5ld1Byb2plY3RMb2FkaW5nfVxuICAgICAgICAgICAgICAgICAgb25DbGljaz17dGhpcy5oYW5kbGVOZXdQcm9qZWN0SW5wdXRDbGljay5iaW5kKHRoaXMpfVxuICAgICAgICAgICAgICAgICAgb25LZXlEb3duPXt0aGlzLmhhbmRsZU5ld1Byb2plY3RJbnB1dEtleURvd24uYmluZCh0aGlzKX1cbiAgICAgICAgICAgICAgICAgIG9uQmx1cj17dGhpcy5oYW5kbGVOZXdQcm9qZWN0SW5wdXRCbHVyLmJpbmQodGhpcyl9XG4gICAgICAgICAgICAgICAgICBzdHlsZT17W0RBU0hfU1RZTEVTLm5ld1Byb2plY3RJbnB1dF19XG4gICAgICAgICAgICAgICAgICB2YWx1ZT17dGhpcy5zdGF0ZS5yZWNvcmRlZE5ld1Byb2plY3ROYW1lfVxuICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9e3RoaXMuaGFuZGxlTmV3UHJvamVjdElucHV0Q2hhbmdlLmJpbmQodGhpcyl9XG4gICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj0nTmV3UHJvamVjdE5hbWUnIC8+XG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBrZXk9J25ldy1wcm9qZWN0LWdvLWJ1dHRvbicgZGlzYWJsZWQ9e3RoaXMuc3RhdGUubmV3UHJvamVjdExvYWRpbmd9IG9uQ2xpY2s9e3RoaXMuaGFuZGxlTmV3UHJvamVjdEdvLmJpbmQodGhpcyl9IHN0eWxlPXtbREFTSF9TVFlMRVMubmV3UHJvamVjdEdvQnV0dG9uXX0+e2J1dHRvbkNvbnRlbnRzfTwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIDxzcGFuIGtleT0nbmV3LXByb2plY3QtZXJyb3InIHN0eWxlPXtbREFTSF9TVFlMRVMubmV3UHJvamVjdEVycm9yXX0+e3RoaXMuc3RhdGUubmV3UHJvamVjdEVycm9yfTwvc3Bhbj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICApXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIG90aGVyd2lzZSwgc2hvdyB0aGUgcmVhZC1vbmx5IFByb2plY3QgbGlzdGluZyBidXR0b25cbiAgICAgICAgICAgIHByb2plY3RUaXRsZSA9IDxzcGFuIHN0eWxlPXtbREFTSF9TVFlMRVMucHJvamVjdFRpdGxlLCBwcm9qZWN0T2JqZWN0LmlzQWN0aXZlICYmIERBU0hfU1RZTEVTLmFjdGl2ZVRpdGxlXX0+e3Byb2plY3RPYmplY3QucHJvamVjdE5hbWV9PC9zcGFuPlxuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXtbREFTSF9TVFlMRVMucHJvamVjdFdyYXBwZXIsIHByb2plY3RPYmplY3QuaXNBY3RpdmUgJiYgREFTSF9TVFlMRVMuYWN0aXZlV3JhcHBlcl19XG4gICAgICAgICAgICAgIGtleT17aW5kZXh9XG4gICAgICAgICAgICAgIG9uRG91YmxlQ2xpY2s9e3RoaXMuaGFuZGxlUHJvamVjdExhdW5jaC5iaW5kKHRoaXMsIHByb2plY3RPYmplY3QpfVxuICAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLnNldEFjdGl2ZVByb2plY3QuYmluZCh0aGlzLCBwcm9qZWN0T2JqZWN0LCBpbmRleCl9PlxuICAgICAgICAgICAgICA8c3BhbiBrZXk9e2BhLSR7cHJvamVjdE9iamVjdC5wcm9qZWN0TmFtZX1gfSBzdHlsZT17W3Byb2plY3RPYmplY3QuaXNBY3RpdmUgJiYgREFTSF9TVFlMRVMuYWN0aXZlUHJvamVjdF19IC8+XG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXtbREFTSF9TVFlMRVMubG9nbywgcHJvamVjdE9iamVjdC5pc0FjdGl2ZSAmJiBEQVNIX1NUWUxFUy5sb2dvQWN0aXZlXX0+PExvZ29TVkcgLz48L3NwYW4+XG4gICAgICAgICAgICAgIHtwcm9qZWN0VGl0bGV9XG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXtbREFTSF9TVFlMRVMuZGF0ZSwgcHJvamVjdE9iamVjdC5pc0FjdGl2ZSAmJiBEQVNIX1NUWUxFUy5hY3RpdmVEYXRlXX0+XG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17REFTSF9TVFlMRVMuZGF0ZVRpdGxlfT57LyogKHByb2plY3RPYmplY3QudXBkYXRlZCkgPyAnVVBEQVRFRCcgOiAnJyAqL308L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2PnsvKiBwcm9qZWN0T2JqZWN0LnVwZGF0ZWQgKi99PC9kaXY+XG4gICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIClcbiAgICAgICAgfSl9XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICBhbHJlYWR5SGFzVG9vTWFueVByb2plY3RzICgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgIXRoaXMuc3RhdGUuYXJlUHJvamVjdHNMb2FkaW5nICYmXG4gICAgICB0aGlzLnN0YXRlLnByb2plY3RzTGlzdCAmJlxuICAgICAgdGhpcy5zdGF0ZS5wcm9qZWN0c0xpc3QubGVuZ3RoID49IEhBUkRDT0RFRF9QUk9KRUNUU19MSU1JVFxuICAgIClcbiAgfVxuXG4gIHRpdGxlV3JhcHBlckVsZW1lbnQgKCkge1xuICAgIGlmICh0aGlzLmFscmVhZHlIYXNUb29NYW55UHJvamVjdHMoKSkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBzdHlsZT17REFTSF9TVFlMRVMudGl0bGVXcmFwcGVyfT5cbiAgICAgICAgICA8c3BhbiBzdHlsZT17REFTSF9TVFlMRVMucHJvamVjdHNUaXRsZX0+UHJvamVjdHM8L3NwYW4+XG4gICAgICAgICAgPHNwYW4gc3R5bGU9e3sgY29sb3I6IFBhbGV0dGUuT1JBTkdFIH19PlByb2plY3QgbGltaXQ6IHtIQVJEQ09ERURfUFJPSkVDVFNfTElNSVR9PC9zcGFuPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIClcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBzdHlsZT17REFTSF9TVFlMRVMudGl0bGVXcmFwcGVyfT5cbiAgICAgICAgPHNwYW4gc3R5bGU9e0RBU0hfU1RZTEVTLnByb2plY3RzVGl0bGV9PlByb2plY3RzPC9zcGFuPlxuICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgdGFiSW5kZXg9Jy0xJ1xuICAgICAgICAgIHN0eWxlPXtEQVNIX1NUWUxFUy5idG5OZXdQcm9qZWN0fVxuICAgICAgICAgIG9uQ2xpY2s9e3RoaXMubGF1bmNoTmV3UHJvamVjdElucHV0LmJpbmQodGhpcyl9Pis8L2J1dHRvbj5cbiAgICAgICAgeyAhdGhpcy5zdGF0ZS5hcmVQcm9qZWN0c0xvYWRpbmcgJiYgdGhpcy5zdGF0ZS5wcm9qZWN0c0xpc3QubGVuZ3RoID09PSAwXG4gICAgICAgICAgPyA8c3BhbiBzdHlsZT17REFTSF9TVFlMRVMudG9vbHRpcH0+PHNwYW4gc3R5bGU9e0RBU0hfU1RZTEVTLmFycm93TGVmdH0gLz5DcmVhdGUgYSBQcm9qZWN0PC9zcGFuPlxuICAgICAgICAgIDogbnVsbFxuICAgICAgICB9XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICBwcm9qZWN0RWRpdEJ1dHRvbkVsZW1lbnQgKHByb2plY3RPYmplY3QpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGJ1dHRvblxuICAgICAgICB0YWJJbmRleD0nLTEnXG4gICAgICAgIHN0eWxlPXtEQVNIX1NUWUxFUy5lZGl0UHJvamVjdH1cbiAgICAgICAgZGlzYWJsZWQ9eyEhdGhpcy5zdGF0ZS5sYXVuY2hpbmdQcm9qZWN0fVxuICAgICAgICBvbkNsaWNrPXt0aGlzLmhhbmRsZVByb2plY3RMYXVuY2guYmluZCh0aGlzLCBwcm9qZWN0T2JqZWN0KX1cbiAgICAgICAgaWQ9J3Byb2plY3QtZWRpdC1idXR0b24nPlxuICAgICAgICBPcGVuIEVkaXRvclxuICAgICAgPC9idXR0b24+XG4gICAgKVxuICB9XG5cbiAgcHJvamVjdEZvcm1FbGVtZW50IChwcm9qZWN0T2JqZWN0KSB7XG4gICAgaWYgKCFwcm9qZWN0T2JqZWN0KSB7XG4gICAgICBpZiAodGhpcy5zdGF0ZS5hcmVQcm9qZWN0c0xvYWRpbmcpIHtcbiAgICAgICAgcmV0dXJuIDxkaXYgLz5cbiAgICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0ZS5wcm9qZWN0c0xpc3QubGVuZ3RoID09PSAwICYmICF0aGlzLnN0YXRlLmFyZVByb2plY3RzTG9hZGluZykge1xuICAgICAgICByZXR1cm4gPGRpdiBzdHlsZT17W0RBU0hfU1RZTEVTLmVtcHR5U3RhdGUsIERBU0hfU1RZTEVTLm5vU2VsZWN0XX0+Q3JlYXRlIGEgcHJvamVjdCB0byBiZWdpbjwvZGl2PlxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIDxkaXYgc3R5bGU9e1tEQVNIX1NUWUxFUy5lbXB0eVN0YXRlLCBEQVNIX1NUWUxFUy5ub1NlbGVjdF19PlNlbGVjdCBhIHByb2plY3QgdG8gYmVnaW48L2Rpdj5cbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBpbXBvcnRVcmkgPSBgJHtzbmFrZWl6ZShwcm9qZWN0T2JqZWN0LnByb2plY3ROYW1lKX1gXG4gICAgY29uc3QgY29tbWFuZExpbmVTbmlwcGV0ID0gYGhhaWt1IGluc3RhbGwgJHtpbXBvcnRVcml9YFxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2PlxuICAgICAgICA8ZGl2IHN0eWxlPXtEQVNIX1NUWUxFUy5maWVsZFRpdGxlfT5Qcm9qZWN0IG5hbWU8L2Rpdj5cbiAgICAgICAgPGRpdiBzdHlsZT17e3Bvc2l0aW9uOiAncmVsYXRpdmUnfX0+XG4gICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICBrZXk9J3Byb2plY3RUaXRsZSdcbiAgICAgICAgICAgIHZhbHVlPXtwcm9qZWN0T2JqZWN0LnByb2plY3ROYW1lfVxuICAgICAgICAgICAgc3R5bGU9e0RBU0hfU1RZTEVTLmZpZWxkfVxuICAgICAgICAgICAgcmVhZE9ubHlcbiAgICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZVByb2plY3RUaXRsZUNoYW5nZS5iaW5kKHRoaXMsIHByb2plY3RPYmplY3QpfSAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBzdHlsZT17REFTSF9TVFlMRVMuZmllbGRUaXRsZX0+SW1wb3J0IGludG8gYSBjb2RlYmFzZSB2aWEgY29tbWFuZCBsaW5lPC9kaXY+XG4gICAgICAgIDxpbnB1dCBrZXk9J3Byb2plY3RJbXBvcnRVcmknIHJlZj0naW1wb3J0SW5wdXQnIG9uQ2xpY2s9e3RoaXMuaGFuZGxlSW1wb3J0SW5wdXRDbGljay5iaW5kKHRoaXMpfSB2YWx1ZT17Y29tbWFuZExpbmVTbmlwcGV0fSBzdHlsZT17W0RBU0hfU1RZTEVTLmZpZWxkLCBEQVNIX1NUWUxFUy5maWVsZE1vbm9dfSByZWFkT25seSAvPlxuICAgICAgICB7dGhpcy5wcm9qZWN0RWRpdEJ1dHRvbkVsZW1lbnQocHJvamVjdE9iamVjdCl9XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICByZW5kZXJOb3RpZmljYXRpb25zIChjb250ZW50LCBpKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxUb2FzdFxuICAgICAgICB0b2FzdFR5cGU9e2NvbnRlbnQudHlwZX1cbiAgICAgICAgdG9hc3RUaXRsZT17Y29udGVudC50aXRsZX1cbiAgICAgICAgdG9hc3RNZXNzYWdlPXtjb250ZW50Lm1lc3NhZ2V9XG4gICAgICAgIGNsb3NlVGV4dD17Y29udGVudC5jbG9zZVRleHR9XG4gICAgICAgIGtleT17aSArIGNvbnRlbnQudGl0bGV9XG4gICAgICAgIG15S2V5PXtpfVxuICAgICAgICByZW1vdmVOb3RpY2U9e3RoaXMucHJvcHMucmVtb3ZlTm90aWNlfVxuICAgICAgICBsaWdodFNjaGVtZT17Y29udGVudC5saWdodFNjaGVtZX0gLz5cbiAgICApXG4gIH1cblxuICByZW5kZXIgKCkge1xuICAgIGNvbnN0IGFjdGl2ZVByb2plY3QgPSBsb2Rhc2guZmluZCh0aGlzLnN0YXRlLnByb2plY3RzTGlzdCwgeyBpc0FjdGl2ZTogdHJ1ZSB9KVxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2PlxuICAgICAgICA8UmVhY3RDU1NUcmFuc2l0aW9uR3JvdXBcbiAgICAgICAgICB0cmFuc2l0aW9uTmFtZT0ndG9hc3QnXG4gICAgICAgICAgdHJhbnNpdGlvbkVudGVyVGltZW91dD17NTAwfVxuICAgICAgICAgIHRyYW5zaXRpb25MZWF2ZVRpbWVvdXQ9ezMwMH0+XG4gICAgICAgICAgPGRpdiBzdHlsZT17e3Bvc2l0aW9uOiAnYWJzb2x1dGUnLCByaWdodDogMCwgdG9wOiAwLCB3aWR0aDogMzAwfX0+XG4gICAgICAgICAgICB7bG9kYXNoLm1hcCh0aGlzLnByb3BzLm5vdGljZXMsIHRoaXMucmVuZGVyTm90aWZpY2F0aW9ucyl9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvUmVhY3RDU1NUcmFuc2l0aW9uR3JvdXA+XG4gICAgICAgIDxkaXYgc3R5bGU9e1tEQVNIX1NUWUxFUy5kYXNoTGV2ZWxXcmFwcGVyLCBEQVNIX1NUWUxFUy5hcHBlYXJEYXNoTGV2ZWxdfT5cbiAgICAgICAgICA8ZGl2IHN0eWxlPXtEQVNIX1NUWUxFUy5mcmFtZX0gY2xhc3NOYW1lPSdmcmFtZScgLz5cbiAgICAgICAgICA8ZGl2IHN0eWxlPXtEQVNIX1NUWUxFUy5wcm9qZWN0c0Jhcn0+XG4gICAgICAgICAgICB7dGhpcy50aXRsZVdyYXBwZXJFbGVtZW50KCl9XG4gICAgICAgICAgICB7dGhpcy5wcm9qZWN0c0xpc3RFbGVtZW50KCl9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBzdHlsZT17REFTSF9TVFlMRVMuZGV0YWlsc30+XG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXtEQVNIX1NUWUxFUy5jZW50ZXJDb2x9PlxuICAgICAgICAgICAgICB7YWN0aXZlUHJvamVjdCAmJiBhY3RpdmVQcm9qZWN0LmlzTmV3XG4gICAgICAgICAgICAgICAgPyA8c3BhbiAvPlxuICAgICAgICAgICAgICAgIDogdGhpcy5wcm9qZWN0Rm9ybUVsZW1lbnQoYWN0aXZlUHJvamVjdCl9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIHt0aGlzLnN0YXRlLmxhdW5jaGluZ1Byb2plY3QgJiYgPFByb2plY3RMb2FkZXIgLz59XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cbn1cblxuZnVuY3Rpb24gc25ha2VpemUgKHN0cikge1xuICBzdHIgPSBzdHIgfHwgJydcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC8gL2csICdfJylcbn1cblxuLy8gZnVuY3Rpb24gdW5pcXVlUHJvamVjdFRpdGxlIChwcm9qZWN0c0xpc3QsIHRpdGxlKSB7XG4vLyAgIGNvbnN0IG1hdGNoZWRQcm9qZWN0cyA9IGZpbHRlcihwcm9qZWN0c0xpc3QsIHsgdGl0bGUgfSlcbi8vICAgaWYgKG1hdGNoZWRQcm9qZWN0cy5sZW5ndGggPCAxKSByZXR1cm4gdGl0bGVcbi8vICAgLy8gVE9ETzogUGxlYXNlIG1ha2UgdGhpcyBhbGdvcml0aG0gcm9idXN0XG4vLyAgIHJldHVybiBgJHt0aXRsZX0gJHtwcm9qZWN0c0xpc3QubGVuZ3RoICsgMX1gXG4vLyB9XG5cbmV4cG9ydCBkZWZhdWx0IFJhZGl1bShQcm9qZWN0QnJvd3NlcilcbiJdfQ==