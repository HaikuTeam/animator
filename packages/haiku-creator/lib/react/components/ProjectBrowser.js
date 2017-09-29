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
              lineNumber: 231
            },
            __self: this
          },
          _react2.default.createElement(_betterReactSpinkit.FadingCircle, { size: 32, color: _Palette2.default.ROCK_MUTED, __source: {
              fileName: _jsxFileName,
              lineNumber: 231
            },
            __self: this
          })
        );
      }

      return _react2.default.createElement(
        'div',
        { style: { height: 'calc(100% - 70px)', overflowY: 'auto' }, __source: {
            fileName: _jsxFileName,
            lineNumber: 235
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
                lineNumber: 242
              },
              __self: _this9
            });

            projectTitle = _react2.default.createElement(
              'div',
              { style: [_dashShared.DASH_STYLES.projectTitleNew], __source: {
                  fileName: _jsxFileName,
                  lineNumber: 245
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
                  lineNumber: 246
                },
                __self: _this9
              }),
              _react2.default.createElement(
                'button',
                { key: 'new-project-go-button', disabled: _this9.state.newProjectLoading, onClick: _this9.handleNewProjectGo.bind(_this9), style: [_dashShared.DASH_STYLES.newProjectGoButton], __source: {
                    fileName: _jsxFileName,
                    lineNumber: 253
                  },
                  __self: _this9
                },
                buttonContents
              ),
              _react2.default.createElement(
                'span',
                { key: 'new-project-error', style: [_dashShared.DASH_STYLES.newProjectError], __source: {
                    fileName: _jsxFileName,
                    lineNumber: 254
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
                  lineNumber: 259
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
                lineNumber: 263
              },
              __self: _this9
            },
            _react2.default.createElement('span', { key: 'a-' + projectObject.projectName, style: [projectObject.isActive && _dashShared.DASH_STYLES.activeProject], __source: {
                fileName: _jsxFileName,
                lineNumber: 267
              },
              __self: _this9
            }),
            _react2.default.createElement(
              'span',
              { style: [_dashShared.DASH_STYLES.logo, projectObject.isActive && _dashShared.DASH_STYLES.logoActive], __source: {
                  fileName: _jsxFileName,
                  lineNumber: 268
                },
                __self: _this9
              },
              _react2.default.createElement(_Icons.LogoSVG, {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 268
                },
                __self: _this9
              })
            ),
            projectTitle,
            _react2.default.createElement(
              'span',
              { style: [_dashShared.DASH_STYLES.date, projectObject.isActive && _dashShared.DASH_STYLES.activeDate], __source: {
                  fileName: _jsxFileName,
                  lineNumber: 270
                },
                __self: _this9
              },
              _react2.default.createElement('div', { style: _dashShared.DASH_STYLES.dateTitle, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 271
                },
                __self: _this9
              }),
              _react2.default.createElement('div', {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 272
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
              lineNumber: 292
            },
            __self: this
          },
          _react2.default.createElement(
            'span',
            { style: _dashShared.DASH_STYLES.projectsTitle, __source: {
                fileName: _jsxFileName,
                lineNumber: 293
              },
              __self: this
            },
            'Projects'
          ),
          _react2.default.createElement(
            'span',
            { style: { color: _Palette2.default.ORANGE }, __source: {
                fileName: _jsxFileName,
                lineNumber: 294
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
            lineNumber: 300
          },
          __self: this
        },
        _react2.default.createElement(
          'span',
          { style: _dashShared.DASH_STYLES.projectsTitle, __source: {
              fileName: _jsxFileName,
              lineNumber: 301
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
              lineNumber: 302
            },
            __self: this
          },
          '+'
        ),
        !this.state.areProjectsLoading && this.state.projectsList.length === 0 ? _react2.default.createElement(
          'span',
          { style: _dashShared.DASH_STYLES.tooltip, __source: {
              fileName: _jsxFileName,
              lineNumber: 307
            },
            __self: this
          },
          _react2.default.createElement('span', { style: _dashShared.DASH_STYLES.arrowLeft, __source: {
              fileName: _jsxFileName,
              lineNumber: 307
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
            lineNumber: 316
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
              lineNumber: 330
            },
            __self: this
          });
        } else if (this.state.projectsList.length === 0 && !this.state.areProjectsLoading) {
          return _react2.default.createElement(
            'div',
            { style: [_dashShared.DASH_STYLES.emptyState, _dashShared.DASH_STYLES.noSelect], __source: {
                fileName: _jsxFileName,
                lineNumber: 332
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
                lineNumber: 334
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
            lineNumber: 341
          },
          __self: this
        },
        _react2.default.createElement(
          'div',
          { style: _dashShared.DASH_STYLES.fieldTitle, __source: {
              fileName: _jsxFileName,
              lineNumber: 342
            },
            __self: this
          },
          'Project name'
        ),
        _react2.default.createElement(
          'div',
          { style: { position: 'relative' }, __source: {
              fileName: _jsxFileName,
              lineNumber: 343
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
              lineNumber: 344
            },
            __self: this
          })
        ),
        _react2.default.createElement(
          'div',
          { style: _dashShared.DASH_STYLES.fieldTitle, __source: {
              fileName: _jsxFileName,
              lineNumber: 351
            },
            __self: this
          },
          'Import into a codebase via command line'
        ),
        _react2.default.createElement('input', { key: 'projectImportUri', ref: 'importInput', onClick: this.handleImportInputClick.bind(this), value: commandLineSnippet, style: [_dashShared.DASH_STYLES.field, _dashShared.DASH_STYLES.fieldMono], readOnly: true, __source: {
            fileName: _jsxFileName,
            lineNumber: 352
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
          lineNumber: 360
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
            lineNumber: 375
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
              lineNumber: 376
            },
            __self: this
          },
          _react2.default.createElement(
            'div',
            { style: { position: 'absolute', right: 0, top: 0, width: 300 }, __source: {
                fileName: _jsxFileName,
                lineNumber: 380
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
              lineNumber: 384
            },
            __self: this
          },
          _react2.default.createElement('div', { style: _dashShared.DASH_STYLES.frame, className: 'frame', __source: {
              fileName: _jsxFileName,
              lineNumber: 385
            },
            __self: this
          }),
          _react2.default.createElement(
            'div',
            { style: _dashShared.DASH_STYLES.projectsBar, __source: {
                fileName: _jsxFileName,
                lineNumber: 386
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
                lineNumber: 390
              },
              __self: this
            },
            _react2.default.createElement(
              'div',
              { style: _dashShared.DASH_STYLES.centerCol, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 391
                },
                __self: this
              },
              activeProject && activeProject.isNew ? _react2.default.createElement('span', {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 393
                },
                __self: this
              }) : this.projectFormElement(activeProject)
            )
          )
        ),
        this.state.launchingProject && _react2.default.createElement(_ProjectLoader2.default, {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 398
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9yZWFjdC9jb21wb25lbnRzL1Byb2plY3RCcm93c2VyLmpzIl0sIm5hbWVzIjpbIkhBUkRDT0RFRF9QUk9KRUNUU19MSU1JVCIsIlByb2plY3RCcm93c2VyIiwicHJvcHMiLCJyZW5kZXJOb3RpZmljYXRpb25zIiwiYmluZCIsInN0YXRlIiwiZXJyb3IiLCJzaG93TmVlZHNTYXZlRGlhbG9ndWUiLCJwcm9qZWN0c0xpc3QiLCJhcmVQcm9qZWN0c0xvYWRpbmciLCJsYXVuY2hpbmdQcm9qZWN0IiwiaGFuZGxlRG9jdW1lbnRLZXlQcmVzcyIsImhhbmRsZVNlbGVjdFByb2plY3QiLCJsb2FkUHJvamVjdHMiLCJkb2N1bWVudCIsImFkZEV2ZW50TGlzdGVuZXIiLCJlbnZveSIsImdldCIsInRoZW4iLCJ0b3VyQ2hhbm5lbCIsIm9uIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsIm9mZiIsInByb2plY3RJZHgiLCJmaW5kSW5kZXgiLCJwcm9qZWN0IiwicHJvamVjdE5hbWUiLCJzZXRBY3RpdmVQcm9qZWN0IiwiZXZ0IiwiZGVsdGEiLCJjb2RlIiwiZm91bmQiLCJmb3JFYWNoIiwiaSIsImlzQWN0aXZlIiwicHJvcG9zZWRJbmRleCIsImlzTmV3IiwibmV3UHJvamVjdExvYWRpbmciLCJzaGlmdCIsIm5ld0luZGV4IiwiTWF0aCIsIm1pbiIsIm1heCIsImxlbmd0aCIsInNldFN0YXRlIiwiY3JlYXRlTm90aWNlIiwidHlwZSIsInRpdGxlIiwibWVzc2FnZSIsImNsb3NlVGV4dCIsImxpZ2h0U2NoZW1lIiwicHJvamVjdE9iamVjdCIsInByb2plY3RJbmRleCIsImZvdW5kUHJvamVjdCIsImZvdW5kSW5kZXgiLCJjaGFuZ2VFdmVudCIsImlzUHJvamVjdE5hbWVCYWQiLCJ0YXJnZXQiLCJ2YWx1ZSIsImFscmVhZHlIYXNUb29NYW55UHJvamVjdHMiLCJ1bnNoaWZ0Iiwic2V0VGltZW91dCIsInJlZnMiLCJuZXdQcm9qZWN0SW5wdXQiLCJzZWxlY3QiLCJjb25zb2xlIiwid2FybiIsImxhdW5jaFByb2plY3QiLCJpbXBvcnRJbnB1dCIsImUiLCJjaGFyQ29kZSIsImhhbmRsZU5ld1Byb2plY3RHbyIsInJhdyIsIm5hbWUiLCJyZXBsYWNlIiwid2Vic29ja2V0IiwicmVxdWVzdCIsIm1ldGhvZCIsInBhcmFtcyIsImVyciIsIm5ld1Byb2plY3QiLCJzcGxpY2UiLCJuZXdQcm9qZWN0RXJyb3IiLCJwbGFjZWhvbGRlclByb2plY3QiLCJwcm9qZWN0TGlzdCIsImxvYWRpbmdXcmFwIiwiUk9DS19NVVRFRCIsImhlaWdodCIsIm92ZXJmbG93WSIsIm1hcCIsImluZGV4IiwicHJvamVjdFRpdGxlIiwiYnV0dG9uQ29udGVudHMiLCJwcm9qZWN0VGl0bGVOZXciLCJoYW5kbGVOZXdQcm9qZWN0SW5wdXRDbGljayIsImhhbmRsZU5ld1Byb2plY3RJbnB1dEtleVByZXNzIiwibmV3UHJvamVjdEdvQnV0dG9uIiwiYWN0aXZlVGl0bGUiLCJwcm9qZWN0V3JhcHBlciIsImFjdGl2ZVdyYXBwZXIiLCJoYW5kbGVQcm9qZWN0TGF1bmNoIiwiYWN0aXZlUHJvamVjdCIsImxvZ28iLCJsb2dvQWN0aXZlIiwiZGF0ZSIsImFjdGl2ZURhdGUiLCJkYXRlVGl0bGUiLCJ0aXRsZVdyYXBwZXIiLCJwcm9qZWN0c1RpdGxlIiwiY29sb3IiLCJPUkFOR0UiLCJidG5OZXdQcm9qZWN0IiwibGF1bmNoTmV3UHJvamVjdElucHV0IiwidG9vbHRpcCIsImFycm93TGVmdCIsImVkaXRQcm9qZWN0IiwiZW1wdHlTdGF0ZSIsIm5vU2VsZWN0IiwiaW1wb3J0VXJpIiwic25ha2VpemUiLCJjb21tYW5kTGluZVNuaXBwZXQiLCJmaWVsZFRpdGxlIiwicG9zaXRpb24iLCJmaWVsZCIsImhhbmRsZVByb2plY3RUaXRsZUNoYW5nZSIsImhhbmRsZUltcG9ydElucHV0Q2xpY2siLCJmaWVsZE1vbm8iLCJwcm9qZWN0RWRpdEJ1dHRvbkVsZW1lbnQiLCJjb250ZW50IiwicmVtb3ZlTm90aWNlIiwiZmluZCIsInJpZ2h0IiwidG9wIiwid2lkdGgiLCJub3RpY2VzIiwiZGFzaExldmVsV3JhcHBlciIsImFwcGVhckRhc2hMZXZlbCIsImZyYW1lIiwicHJvamVjdHNCYXIiLCJ0aXRsZVdyYXBwZXJFbGVtZW50IiwicHJvamVjdHNMaXN0RWxlbWVudCIsImRldGFpbHMiLCJjZW50ZXJDb2wiLCJwcm9qZWN0Rm9ybUVsZW1lbnQiLCJDb21wb25lbnQiLCJzdHIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7QUFFQSxJQUFNQSwyQkFBMkIsRUFBakM7O0lBRU1DLGM7OztBQUNKLDBCQUFhQyxLQUFiLEVBQW9CO0FBQUE7O0FBQUEsZ0lBQ1pBLEtBRFk7O0FBRWxCLFVBQUtDLG1CQUFMLEdBQTJCLE1BQUtBLG1CQUFMLENBQXlCQyxJQUF6QixPQUEzQjtBQUNBLFVBQUtDLEtBQUwsR0FBYTtBQUNYQyxhQUFPLElBREk7QUFFWEMsNkJBQXVCLEtBRlo7QUFHWEMsb0JBQWMsRUFISDtBQUlYQywwQkFBb0IsSUFKVDtBQUtYQyx3QkFBa0I7QUFMUCxLQUFiO0FBT0EsVUFBS0Msc0JBQUwsR0FBOEIsTUFBS0Esc0JBQUwsQ0FBNEJQLElBQTVCLE9BQTlCO0FBQ0EsVUFBS1EsbUJBQUwsR0FBMkIsTUFBS0EsbUJBQUwsQ0FBeUJSLElBQXpCLE9BQTNCO0FBWGtCO0FBWW5COzs7O3dDQUVvQjtBQUFBOztBQUNuQixXQUFLUyxZQUFMO0FBQ0FDLGVBQVNDLGdCQUFULENBQTBCLFNBQTFCLEVBQXFDLEtBQUtKLHNCQUExQyxFQUFrRSxJQUFsRTs7QUFFQSxXQUFLVCxLQUFMLENBQVdjLEtBQVgsQ0FBaUJDLEdBQWpCLENBQXFCLE1BQXJCLEVBQTZCQyxJQUE3QixDQUFrQyxVQUFDQyxXQUFELEVBQWlCO0FBQ2pELGVBQUtBLFdBQUwsR0FBbUJBLFdBQW5CO0FBQ0FBLG9C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T0FERjtBQTJCRDs7OztFQW5ZMEIsZ0JBQU1zSSxTOztBQXNZbkMsU0FBU3pCLFFBQVQsQ0FBbUIwQixHQUFuQixFQUF3QjtBQUN0QkEsUUFBTUEsT0FBTyxFQUFiO0FBQ0EsU0FBT0EsSUFBSXZFLE9BQUosQ0FBWSxJQUFaLEVBQWtCLEdBQWxCLENBQVA7QUFDRDs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O2tCQUVlLHNCQUFPekUsY0FBUCxDIiwiZmlsZSI6IlByb2plY3RCcm93c2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGxvZGFzaCBmcm9tICdsb2Rhc2gnXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgUmFkaXVtIGZyb20gJ3JhZGl1bSdcbmltcG9ydCBSZWFjdENTU1RyYW5zaXRpb25Hcm91cCBmcm9tICdyZWFjdC1hZGRvbnMtY3NzLXRyYW5zaXRpb24tZ3JvdXAnXG5pbXBvcnQgeyBGYWRpbmdDaXJjbGUgfSBmcm9tICdiZXR0ZXItcmVhY3Qtc3BpbmtpdCdcbmltcG9ydCBQYWxldHRlIGZyb20gJy4vUGFsZXR0ZSdcbmltcG9ydCBUb2FzdCBmcm9tICcuL25vdGlmaWNhdGlvbnMvVG9hc3QnXG5pbXBvcnQgUHJvamVjdExvYWRlciBmcm9tICcuL1Byb2plY3RMb2FkZXInXG5pbXBvcnQgeyBMb2dvU1ZHLCBMb2FkaW5nU3Bpbm5lclNWRyB9IGZyb20gJy4vSWNvbnMnXG5pbXBvcnQgeyBEQVNIX1NUWUxFUyB9IGZyb20gJy4uL3N0eWxlcy9kYXNoU2hhcmVkJ1xuXG5jb25zdCBIQVJEQ09ERURfUFJPSkVDVFNfTElNSVQgPSAxNVxuXG5jbGFzcyBQcm9qZWN0QnJvd3NlciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yIChwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKVxuICAgIHRoaXMucmVuZGVyTm90aWZpY2F0aW9ucyA9IHRoaXMucmVuZGVyTm90aWZpY2F0aW9ucy5iaW5kKHRoaXMpXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIGVycm9yOiBudWxsLFxuICAgICAgc2hvd05lZWRzU2F2ZURpYWxvZ3VlOiBmYWxzZSxcbiAgICAgIHByb2plY3RzTGlzdDogW10sXG4gICAgICBhcmVQcm9qZWN0c0xvYWRpbmc6IHRydWUsXG4gICAgICBsYXVuY2hpbmdQcm9qZWN0OiBmYWxzZVxuICAgIH1cbiAgICB0aGlzLmhhbmRsZURvY3VtZW50S2V5UHJlc3MgPSB0aGlzLmhhbmRsZURvY3VtZW50S2V5UHJlc3MuYmluZCh0aGlzKVxuICAgIHRoaXMuaGFuZGxlU2VsZWN0UHJvamVjdCA9IHRoaXMuaGFuZGxlU2VsZWN0UHJvamVjdC5iaW5kKHRoaXMpXG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCAoKSB7XG4gICAgdGhpcy5sb2FkUHJvamVjdHMoKVxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLmhhbmRsZURvY3VtZW50S2V5UHJlc3MsIHRydWUpXG5cbiAgICB0aGlzLnByb3BzLmVudm95LmdldCgndG91cicpLnRoZW4oKHRvdXJDaGFubmVsKSA9PiB7XG4gICAgICB0aGlzLnRvdXJDaGFubmVsID0gdG91ckNoYW5uZWxcbiAgICAgIHRvdXJDaGFubmVsLm9uKCd0b3VyOnJlcXVlc3RTZWxlY3RQcm9qZWN0JywgdGhpcy5oYW5kbGVTZWxlY3RQcm9qZWN0KVxuICAgIH0pXG4gIH1cblxuICBjb21wb25lbnRXaWxsVW5tb3VudCAoKSB7XG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRoaXMuaGFuZGxlRG9jdW1lbnRLZXlQcmVzcywgdHJ1ZSlcbiAgICB0aGlzLnRvdXJDaGFubmVsLm9mZigndG91cjpyZXF1ZXN0U2VsZWN0UHJvamVjdCcsIHRoaXMuaGFuZGxlU2VsZWN0UHJvamVjdClcbiAgfVxuXG4gIGhhbmRsZVNlbGVjdFByb2plY3QgKCkge1xuICAgIGNvbnN0IHByb2plY3RJZHggPSB0aGlzLnN0YXRlLnByb2plY3RzTGlzdC5maW5kSW5kZXgoKHByb2plY3QpID0+IHtcbiAgICAgIC8vIEhhcmRjb2RlZCAtIE5hbWUgb2YgdGhlIHByb2plY3QgdGhhdCB3aWxsIGJlIHVzZWQgZm9yIHRoZSB0dXRvcmlhbFxuICAgICAgcmV0dXJuIHByb2plY3QucHJvamVjdE5hbWUgPT09ICdDaGVja1R1dG9yaWFsJ1xuICAgIH0pXG5cbiAgICB0aGlzLnNldEFjdGl2ZVByb2plY3QodGhpcy5zdGF0ZS5wcm9qZWN0c0xpc3RbcHJvamVjdElkeF0sIHByb2plY3RJZHgpXG4gIH1cblxuICBoYW5kbGVEb2N1bWVudEtleVByZXNzIChldnQpIHtcbiAgICB2YXIgcHJvamVjdHNMaXN0ID0gdGhpcy5zdGF0ZS5wcm9qZWN0c0xpc3RcblxuICAgIHZhciBkZWx0YSA9IDBcbiAgICBpZiAoZXZ0LmNvZGUgPT09ICdBcnJvd1VwJykge1xuICAgICAgZGVsdGEgPSAtMVxuICAgIH0gZWxzZSBpZiAoZXZ0LmNvZGUgPT09ICdBcnJvd0Rvd24nKSB7XG4gICAgICBkZWx0YSA9IDFcbiAgICB9XG5cbiAgICB2YXIgZm91bmQgPSBmYWxzZVxuICAgIHByb2plY3RzTGlzdC5mb3JFYWNoKChwcm9qZWN0LCBpKSA9PiB7XG4gICAgICBpZiAoIWZvdW5kICYmIHByb2plY3QuaXNBY3RpdmUpIHtcbiAgICAgICAgdmFyIHByb3Bvc2VkSW5kZXggPSBpICsgZGVsdGFcbiAgICAgICAgLy8gcmVtb3ZlIGNyZWF0ZSBVSSBpZiBuYXZpZ2F0aW5nIGF3YXkgYmVmb3JlIHN1Ym1pdHRpbmdcbiAgICAgICAgaWYgKGkgPT09IDAgJiYgZGVsdGEgPT09IDEgJiYgcHJvamVjdC5pc05ldyAmJiAhdGhpcy5zdGF0ZS5uZXdQcm9qZWN0TG9hZGluZykge1xuICAgICAgICAgIHByb3Bvc2VkSW5kZXggPSAwXG4gICAgICAgICAgcHJvamVjdHNMaXN0LnNoaWZ0KClcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBuZXdJbmRleCA9IE1hdGgubWluKE1hdGgubWF4KDAsIHByb3Bvc2VkSW5kZXgpLCBwcm9qZWN0c0xpc3QubGVuZ3RoIC0gMSlcblxuICAgICAgICBwcm9qZWN0LmlzQWN0aXZlID0gZmFsc2VcbiAgICAgICAgcHJvamVjdHNMaXN0W25ld0luZGV4XS5pc0FjdGl2ZSA9IHRydWVcbiAgICAgICAgZm91bmQgPSB0cnVlXG4gICAgICB9XG4gICAgfSlcbiAgICB0aGlzLnNldFN0YXRlKHtwcm9qZWN0c0xpc3R9KVxuICB9XG5cbiAgbG9hZFByb2plY3RzICgpIHtcbiAgICByZXR1cm4gdGhpcy5wcm9wcy5sb2FkUHJvamVjdHMoKGVycm9yLCBwcm9qZWN0c0xpc3QpID0+IHtcbiAgICAgIGlmIChlcnJvcikge1xuICAgICAgICB0aGlzLnByb3BzLmNyZWF0ZU5vdGljZSh7XG4gICAgICAgICAgdHlwZTogJ2Vycm9yJyxcbiAgICAgICAgICB0aXRsZTogJ09oIG5vIScsXG4gICAgICAgICAgbWVzc2FnZTogJ1dlIGNvdWxkblxcJ3QgbG9hZCB5b3VyIHRlYW1cXCdzIHByb2plY3RzLiDwn5iiIFBsZWFzZSBlbnN1cmUgdGhhdCB5b3VyIGNvbXB1dGVyIGlzIGNvbm5lY3RlZCB0byB0aGUgSW50ZXJuZXQuIElmIHlvdVxcJ3JlIGNvbm5lY3RlZCBhbmQgeW91IHN0aWxsIHNlZSB0aGlzIG1lc3NhZ2Ugb3VyIHNlcnZlcnMgbWlnaHQgYmUgaGF2aW5nIHByb2JsZW1zLiBQbGVhc2UgdHJ5IGFnYWluIGluIGEgZmV3IG1vbWVudHMuIElmIHlvdSBzdGlsbCBzZWUgdGhpcyBtZXNzYWdlLCBjb250YWN0IEhhaWt1IGZvciBzdXBwb3J0LicsXG4gICAgICAgICAgY2xvc2VUZXh0OiAnT2theScsXG4gICAgICAgICAgbGlnaHRTY2hlbWU6IHRydWVcbiAgICAgICAgfSlcbiAgICAgICAgcmV0dXJuIHRoaXMuc2V0U3RhdGUoeyBlcnJvciwgYXJlUHJvamVjdHNMb2FkaW5nOiBmYWxzZSB9KVxuICAgICAgfVxuICAgICAgLy8gc2VsZWN0IHRoZSBmaXJzdCBwcm9qZWN0IGJ5IGRlZmF1bHRcbiAgICAgIGlmIChwcm9qZWN0c0xpc3QubGVuZ3RoKSB7XG4gICAgICAgIHByb2plY3RzTGlzdFswXS5pc0FjdGl2ZSA9IHRydWVcbiAgICAgIH1cbiAgICAgIHRoaXMuc2V0U3RhdGUoeyBwcm9qZWN0c0xpc3QsIGFyZVByb2plY3RzTG9hZGluZzogZmFsc2UgfSlcbiAgICB9KVxuICB9XG5cbiAgc2V0QWN0aXZlUHJvamVjdCAocHJvamVjdE9iamVjdCwgcHJvamVjdEluZGV4KSB7XG4gICAgY29uc3QgcHJvamVjdHNMaXN0ID0gdGhpcy5zdGF0ZS5wcm9qZWN0c0xpc3RcblxuICAgIC8vIFRPRE86IGlmIGN1cnJlbnQgcHJvamVjdCBoYXMgdW5zYXZlZCBlZGl0cyB0aGVuIHNob3cgc2F2ZSBkaWFsb2d1ZVxuICAgIC8vICAgICAgIGFuZCByZXR1cm4gd2l0aG91dCBjaGFuZ2luZyBwcm9qZWN0c1xuICAgIC8vIGlmIChmYWxzZSkge1xuICAgIC8vICAgdGhpcy5zZXRTdGF0ZSh7IHNob3dOZWVkc1NhdmVEaWFsb2d1ZTogdHJ1ZSB9KVxuICAgIC8vICAgcmV0dXJuIGZhbHNlXG4gICAgLy8gfVxuXG4gICAgcHJvamVjdHNMaXN0LmZvckVhY2goKGZvdW5kUHJvamVjdCwgZm91bmRJbmRleCkgPT4ge1xuICAgICAgLy8gcmVtb3ZlIG5ldyBwcm9qZWN0IGlmIG5hdmlnYXRpbmcgYXdheSBiZWZvcmUgaXQncyBjb21wbGV0ZVxuICAgICAgaWYgKHByb2plY3RJbmRleCAhPT0gMCAmJiBmb3VuZEluZGV4ID09PSAwICYmIGZvdW5kUHJvamVjdC5pc05ldyAmJiAhdGhpcy5zdGF0ZS5uZXdQcm9qZWN0TG9hZGluZykgcHJvamVjdHNMaXN0LnNoaWZ0KClcbiAgICAgIGlmIChmb3VuZEluZGV4ID09PSBwcm9qZWN0SW5kZXgpIGZvdW5kUHJvamVjdC5pc0FjdGl2ZSA9IHRydWVcbiAgICAgIGVsc2UgZm91bmRQcm9qZWN0LmlzQWN0aXZlID0gZmFsc2VcbiAgICB9KVxuICAgIHRoaXMuc2V0U3RhdGUoeyBwcm9qZWN0c0xpc3QgfSlcbiAgfVxuXG4gIGhhbmRsZVByb2plY3RUaXRsZUNoYW5nZSAocHJvamVjdE9iamVjdCwgY2hhbmdlRXZlbnQpIHtcbiAgICBpZiAoIXRoaXMuaXNQcm9qZWN0TmFtZUJhZChjaGFuZ2VFdmVudC50YXJnZXQudmFsdWUpKSB7XG4gICAgICBwcm9qZWN0T2JqZWN0LnByb2plY3ROYW1lID0gY2hhbmdlRXZlbnQudGFyZ2V0LnZhbHVlXG4gICAgfVxuICAgIHRoaXMuc2V0U3RhdGUoeyBwcm9qZWN0c0xpc3Q6IHRoaXMuc3RhdGUucHJvamVjdHNMaXN0IH0pXG4gIH1cblxuICBsYXVuY2hOZXdQcm9qZWN0SW5wdXQgKCkge1xuICAgIGlmICh0aGlzLmFscmVhZHlIYXNUb29NYW55UHJvamVjdHMoKSkge1xuICAgICAgcmV0dXJuIHZvaWQgKDApXG4gICAgfVxuXG4gICAgdmFyIHByb2plY3RzTGlzdCA9IHRoaXMuc3RhdGUucHJvamVjdHNMaXN0XG4gICAgaWYgKCFwcm9qZWN0c0xpc3RbMF0gfHwgIXByb2plY3RzTGlzdFswXS5pc05ldykge1xuICAgICAgcHJvamVjdHNMaXN0LmZvckVhY2goKGZvdW5kUHJvamVjdCwgZm91bmRJbmRleCkgPT4ge1xuICAgICAgICBmb3VuZFByb2plY3QuaXNBY3RpdmUgPSBmYWxzZVxuICAgICAgfSlcbiAgICAgIHByb2plY3RzTGlzdC51bnNoaWZ0KHtcbiAgICAgICAgaXNBY3RpdmU6IHRydWUsXG4gICAgICAgIGlzTmV3OiB0cnVlLFxuICAgICAgICB0aXRsZTogJydcbiAgICAgIH0pXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgdGhpcy5yZWZzLm5ld1Byb2plY3RJbnB1dC5zZWxlY3QoKVxuICAgICAgfSwgNTApXG4gICAgICB0aGlzLnNldFN0YXRlKHsgcHJvamVjdHNMaXN0IH0pXG4gICAgfVxuICB9XG5cbiAgaXNQcm9qZWN0TmFtZUJhZCAocHJvamVjdE5hbWUpIHtcbiAgICBpZiAoIXByb2plY3ROYW1lKSByZXR1cm4gdHJ1ZVxuICAgIGlmIChwcm9qZWN0TmFtZSA9PT0gJycpIHJldHVybiB0cnVlXG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICBoYW5kbGVQcm9qZWN0TGF1bmNoIChwcm9qZWN0T2JqZWN0KSB7XG4gICAgaWYgKHRoaXMuaXNQcm9qZWN0TmFtZUJhZChwcm9qZWN0T2JqZWN0LnByb2plY3ROYW1lKSkge1xuICAgICAgY29uc29sZS53YXJuKCdiYWQgbmFtZSBsYXVuY2hlZDonLCBwcm9qZWN0T2JqZWN0LnByb2plY3ROYW1lKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHsgbGF1bmNoaW5nUHJvamVjdDogcHJvamVjdE9iamVjdCB9KVxuICAgICAgLy8gcHJvamVjdE9iamVjdC5wcm9qZWN0c0hvbWUgdG8gdXNlIHByb2plY3QgY29udGFpbmVyIGZvbGRlclxuICAgICAgLy8gcHJvamVjdE9iamVjdC5wcm9qZWN0UGF0aCB0byBzZXQgc3BlY2lmaWMgcHJvamVjdCBmb2xkZXIgKG5vIGluZmVyZW5jZSlcbiAgICAgIHJldHVybiB0aGlzLnByb3BzLmxhdW5jaFByb2plY3QocHJvamVjdE9iamVjdC5wcm9qZWN0TmFtZSwgcHJvamVjdE9iamVjdCwgKGVycm9yKSA9PiB7XG4gICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgIHRoaXMucHJvcHMuY3JlYXRlTm90aWNlKHtcbiAgICAgICAgICAgIHR5cGU6ICdlcnJvcicsXG4gICAgICAgICAgICB0aXRsZTogJ09oIG5vIScsXG4gICAgICAgICAgICBtZXNzYWdlOiAnV2UgY291bGRuXFwndCBvcGVuIHRoaXMgcHJvamVjdC4g8J+YqSBQbGVhc2UgZW5zdXJlIHRoYXQgeW91ciBjb21wdXRlciBpcyBjb25uZWN0ZWQgdG8gdGhlIEludGVybmV0LiBJZiB5b3VcXCdyZSBjb25uZWN0ZWQgYW5kIHlvdSBzdGlsbCBzZWUgdGhpcyBtZXNzYWdlIHlvdXIgZmlsZXMgbWlnaHQgc3RpbGwgYmUgcHJvY2Vzc2luZy4gUGxlYXNlIHRyeSBhZ2FpbiBpbiBhIGZldyBtb21lbnRzLiBJZiB5b3Ugc3RpbGwgc2VlIHRoaXMgZXJyb3IsIGNvbnRhY3QgSGFpa3UgZm9yIHN1cHBvcnQuJyxcbiAgICAgICAgICAgIGNsb3NlVGV4dDogJ09rYXknLFxuICAgICAgICAgICAgbGlnaHRTY2hlbWU6IHRydWVcbiAgICAgICAgICB9KVxuICAgICAgICAgIHJldHVybiB0aGlzLnNldFN0YXRlKHsgZXJyb3IsIGxhdW5jaGluZ1Byb2plY3Q6IG51bGwgfSlcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICBoYW5kbGVJbXBvcnRJbnB1dENsaWNrICgpIHtcbiAgICB0aGlzLnJlZnMuaW1wb3J0SW5wdXQuc2VsZWN0KClcbiAgfVxuXG4gIGhhbmRsZU5ld1Byb2plY3RJbnB1dENsaWNrICgpIHtcbiAgICB0aGlzLnJlZnMubmV3UHJvamVjdElucHV0LnNlbGVjdCgpXG4gIH1cblxuICBoYW5kbGVOZXdQcm9qZWN0SW5wdXRLZXlQcmVzcyAoZSkge1xuICAgIGlmIChlLmNoYXJDb2RlID09PSAxMykge1xuICAgICAgdGhpcy5oYW5kbGVOZXdQcm9qZWN0R28oKVxuICAgIH1cbiAgfVxuXG4gIGhhbmRsZU5ld1Byb2plY3RHbyAoKSB7XG4gICAgdmFyIHJhdyA9IHRoaXMucmVmcy5uZXdQcm9qZWN0SW5wdXQudmFsdWVcbiAgICAvLyBIQUNLOiAgc3RyaXAgYWxsIG5vbi1hbHBoYW51bWVyaWMgY2hhcnMgZm9yIG5vdy4gIHNvbWV0aGluZyBtb3JlIHVzZXItZnJpZW5kbHkgd291bGQgYmUgaWRlYWxcbiAgICB2YXIgbmFtZSA9IHJhdyAmJiByYXcucmVwbGFjZSgvW15hLXowLTldL2dpLCAnJylcblxuICAgIGlmICh0aGlzLmlzUHJvamVjdE5hbWVCYWQobmFtZSkpIHtcbiAgICAgIGNvbnNvbGUud2FybignYmFkIG5hbWUgZW50ZXJlZDonLCBuYW1lKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtuZXdQcm9qZWN0TG9hZGluZzogdHJ1ZX0pXG4gICAgICB0aGlzLnByb3BzLndlYnNvY2tldC5yZXF1ZXN0KHsgbWV0aG9kOiAnY3JlYXRlUHJvamVjdCcsIHBhcmFtczogW25hbWVdIH0sIChlcnIsIG5ld1Byb2plY3QpID0+IHtcbiAgICAgICAgY29uc3QgcHJvamVjdHNMaXN0ID0gdGhpcy5zdGF0ZS5wcm9qZWN0c0xpc3RcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7bmV3UHJvamVjdExvYWRpbmc6IGZhbHNlfSlcbiAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgIHByb2plY3RzTGlzdC5zcGxpY2UoMCwgMSlcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgcHJvamVjdHNMaXN0IH0pXG4gICAgICAgICAgdGhpcy5zdGF0ZS5uZXdQcm9qZWN0RXJyb3IgPSBlcnJcbiAgICAgICAgICB0aGlzLnByb3BzLmNyZWF0ZU5vdGljZSh7XG4gICAgICAgICAgICB0eXBlOiAnZXJyb3InLFxuICAgICAgICAgICAgdGl0bGU6ICdPaCBubyEnLFxuICAgICAgICAgICAgbWVzc2FnZTogJ1dlIGNvdWxkblxcJ3QgY3JlYXRlIHlvdXIgcHJvamVjdC4g8J+YqSBQbGVhc2UgZW5zdXJlIHRoYXQgeW91ciBjb21wdXRlciBpcyBjb25uZWN0ZWQgdG8gdGhlIEludGVybmV0LiBJZiB5b3VcXCdyZSBjb25uZWN0ZWQgYW5kIHlvdSBzdGlsbCBzZWUgdGhpcyBtZXNzYWdlIG91ciBzZXJ2ZXJzIG1pZ2h0IGJlIGhhdmluZyBwcm9ibGVtcy4gUGxlYXNlIHRyeSBhZ2FpbiBpbiBhIGZldyBtb21lbnRzLiBJZiB5b3Ugc3RpbGwgc2VlIHRoaXMgZXJyb3IsIGNvbnRhY3QgSGFpa3UgZm9yIHN1cHBvcnQuJyxcbiAgICAgICAgICAgIGNsb3NlVGV4dDogJ09rYXknLFxuICAgICAgICAgICAgbGlnaHRTY2hlbWU6IHRydWVcbiAgICAgICAgICB9KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIHN0cmlwIFwibmV3XCIgcHJvamVjdCBmcm9tIHRvcCBvZiBsaXN0LCB1bnNoaWZ0IGFjdHVhbCBuZXcgcHJvamVjdFxuICAgICAgICAgIHZhciBwbGFjZWhvbGRlclByb2plY3QgPSBwcm9qZWN0c0xpc3Quc3BsaWNlKDAsIDEpWzBdXG4gICAgICAgICAgbmV3UHJvamVjdC5pc0FjdGl2ZSA9IHBsYWNlaG9sZGVyUHJvamVjdC5pc0FjdGl2ZVxuICAgICAgICAgIHByb2plY3RzTGlzdC51bnNoaWZ0KG5ld1Byb2plY3QpXG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7cHJvamVjdExpc3Q6IHByb2plY3RzTGlzdH0pXG4gICAgICAgICAgLy8gYXV0by1sYXVuY2ggbmV3bHkgY3JlYXRlZCBwcm9qZWN0XG4gICAgICAgICAgLy8gdGhpcy5oYW5kbGVQcm9qZWN0TGF1bmNoKG5ld1Byb2plY3QpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgcHJvamVjdHNMaXN0RWxlbWVudCAoKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUuYXJlUHJvamVjdHNMb2FkaW5nKSB7XG4gICAgICByZXR1cm4gPHNwYW4gc3R5bGU9e0RBU0hfU1RZTEVTLmxvYWRpbmdXcmFwfT48RmFkaW5nQ2lyY2xlIHNpemU9ezMyfSBjb2xvcj17UGFsZXR0ZS5ST0NLX01VVEVEfSAvPjwvc3Bhbj5cbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBzdHlsZT17e2hlaWdodDogJ2NhbGMoMTAwJSAtIDcwcHgpJywgb3ZlcmZsb3dZOiAnYXV0byd9fT5cbiAgICAgICAge3RoaXMuc3RhdGUucHJvamVjdHNMaXN0Lm1hcCgocHJvamVjdE9iamVjdCwgaW5kZXgpID0+IHtcbiAgICAgICAgICB2YXIgcHJvamVjdFRpdGxlXG4gICAgICAgICAgaWYgKHByb2plY3RPYmplY3QuaXNOZXcpIHtcbiAgICAgICAgICAgIC8vIElmIHRoaXMgaXMgdGhlIE5FVyBQUk9KRUNUIHNsb3QsIHNob3cgdGhlIGlucHV0IFVJXG5cbiAgICAgICAgICAgIHZhciBidXR0b25Db250ZW50cyA9ICdHTydcbiAgICAgICAgICAgIGlmICh0aGlzLnN0YXRlLm5ld1Byb2plY3RMb2FkaW5nKSBidXR0b25Db250ZW50cyA9IDxMb2FkaW5nU3Bpbm5lclNWRyAvPlxuXG4gICAgICAgICAgICBwcm9qZWN0VGl0bGUgPSAoXG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e1tEQVNIX1NUWUxFUy5wcm9qZWN0VGl0bGVOZXddfT5cbiAgICAgICAgICAgICAgICA8aW5wdXQga2V5PSduZXctcHJvamVjdC1pbnB1dCdcbiAgICAgICAgICAgICAgICAgIHJlZj0nbmV3UHJvamVjdElucHV0J1xuICAgICAgICAgICAgICAgICAgZGlzYWJsZWQ9e3RoaXMuc3RhdGUubmV3UHJvamVjdExvYWRpbmd9XG4gICAgICAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLmhhbmRsZU5ld1Byb2plY3RJbnB1dENsaWNrLmJpbmQodGhpcyl9XG4gICAgICAgICAgICAgICAgICBvbktleVByZXNzPXt0aGlzLmhhbmRsZU5ld1Byb2plY3RJbnB1dEtleVByZXNzLmJpbmQodGhpcyl9XG4gICAgICAgICAgICAgICAgICBzdHlsZT17W0RBU0hfU1RZTEVTLm5ld1Byb2plY3RJbnB1dF19XG4gICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj0nTmV3UHJvamVjdE5hbWUnIC8+XG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBrZXk9J25ldy1wcm9qZWN0LWdvLWJ1dHRvbicgZGlzYWJsZWQ9e3RoaXMuc3RhdGUubmV3UHJvamVjdExvYWRpbmd9IG9uQ2xpY2s9e3RoaXMuaGFuZGxlTmV3UHJvamVjdEdvLmJpbmQodGhpcyl9IHN0eWxlPXtbREFTSF9TVFlMRVMubmV3UHJvamVjdEdvQnV0dG9uXX0+e2J1dHRvbkNvbnRlbnRzfTwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIDxzcGFuIGtleT0nbmV3LXByb2plY3QtZXJyb3InIHN0eWxlPXtbREFTSF9TVFlMRVMubmV3UHJvamVjdEVycm9yXX0+e3RoaXMuc3RhdGUubmV3UHJvamVjdEVycm9yfTwvc3Bhbj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICApXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIG90aGVyd2lzZSwgc2hvdyB0aGUgcmVhZC1vbmx5IFByb2plY3QgbGlzdGluZyBidXR0b25cbiAgICAgICAgICAgIHByb2plY3RUaXRsZSA9IDxzcGFuIHN0eWxlPXtbREFTSF9TVFlMRVMucHJvamVjdFRpdGxlLCBwcm9qZWN0T2JqZWN0LmlzQWN0aXZlICYmIERBU0hfU1RZTEVTLmFjdGl2ZVRpdGxlXX0+e3Byb2plY3RPYmplY3QucHJvamVjdE5hbWV9PC9zcGFuPlxuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXtbREFTSF9TVFlMRVMucHJvamVjdFdyYXBwZXIsIHByb2plY3RPYmplY3QuaXNBY3RpdmUgJiYgREFTSF9TVFlMRVMuYWN0aXZlV3JhcHBlcl19XG4gICAgICAgICAgICAgIGtleT17aW5kZXh9XG4gICAgICAgICAgICAgIG9uRG91YmxlQ2xpY2s9e3RoaXMuaGFuZGxlUHJvamVjdExhdW5jaC5iaW5kKHRoaXMsIHByb2plY3RPYmplY3QpfVxuICAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLnNldEFjdGl2ZVByb2plY3QuYmluZCh0aGlzLCBwcm9qZWN0T2JqZWN0LCBpbmRleCl9PlxuICAgICAgICAgICAgICA8c3BhbiBrZXk9e2BhLSR7cHJvamVjdE9iamVjdC5wcm9qZWN0TmFtZX1gfSBzdHlsZT17W3Byb2plY3RPYmplY3QuaXNBY3RpdmUgJiYgREFTSF9TVFlMRVMuYWN0aXZlUHJvamVjdF19IC8+XG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXtbREFTSF9TVFlMRVMubG9nbywgcHJvamVjdE9iamVjdC5pc0FjdGl2ZSAmJiBEQVNIX1NUWUxFUy5sb2dvQWN0aXZlXX0+PExvZ29TVkcgLz48L3NwYW4+XG4gICAgICAgICAgICAgIHtwcm9qZWN0VGl0bGV9XG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXtbREFTSF9TVFlMRVMuZGF0ZSwgcHJvamVjdE9iamVjdC5pc0FjdGl2ZSAmJiBEQVNIX1NUWUxFUy5hY3RpdmVEYXRlXX0+XG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17REFTSF9TVFlMRVMuZGF0ZVRpdGxlfT57LyogKHByb2plY3RPYmplY3QudXBkYXRlZCkgPyAnVVBEQVRFRCcgOiAnJyAqL308L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2PnsvKiBwcm9qZWN0T2JqZWN0LnVwZGF0ZWQgKi99PC9kaXY+XG4gICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIClcbiAgICAgICAgfSl9XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICBhbHJlYWR5SGFzVG9vTWFueVByb2plY3RzICgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgIXRoaXMuc3RhdGUuYXJlUHJvamVjdHNMb2FkaW5nICYmXG4gICAgICB0aGlzLnN0YXRlLnByb2plY3RzTGlzdCAmJlxuICAgICAgdGhpcy5zdGF0ZS5wcm9qZWN0c0xpc3QubGVuZ3RoID49IEhBUkRDT0RFRF9QUk9KRUNUU19MSU1JVFxuICAgIClcbiAgfVxuXG4gIHRpdGxlV3JhcHBlckVsZW1lbnQgKCkge1xuICAgIGlmICh0aGlzLmFscmVhZHlIYXNUb29NYW55UHJvamVjdHMoKSkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBzdHlsZT17REFTSF9TVFlMRVMudGl0bGVXcmFwcGVyfT5cbiAgICAgICAgICA8c3BhbiBzdHlsZT17REFTSF9TVFlMRVMucHJvamVjdHNUaXRsZX0+UHJvamVjdHM8L3NwYW4+XG4gICAgICAgICAgPHNwYW4gc3R5bGU9e3sgY29sb3I6IFBhbGV0dGUuT1JBTkdFIH19PlByb2plY3QgbGltaXQ6IHtIQVJEQ09ERURfUFJPSkVDVFNfTElNSVR9PC9zcGFuPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIClcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBzdHlsZT17REFTSF9TVFlMRVMudGl0bGVXcmFwcGVyfT5cbiAgICAgICAgPHNwYW4gc3R5bGU9e0RBU0hfU1RZTEVTLnByb2plY3RzVGl0bGV9PlByb2plY3RzPC9zcGFuPlxuICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgdGFiSW5kZXg9Jy0xJ1xuICAgICAgICAgIHN0eWxlPXtEQVNIX1NUWUxFUy5idG5OZXdQcm9qZWN0fVxuICAgICAgICAgIG9uQ2xpY2s9e3RoaXMubGF1bmNoTmV3UHJvamVjdElucHV0LmJpbmQodGhpcyl9Pis8L2J1dHRvbj5cbiAgICAgICAgeyAhdGhpcy5zdGF0ZS5hcmVQcm9qZWN0c0xvYWRpbmcgJiYgdGhpcy5zdGF0ZS5wcm9qZWN0c0xpc3QubGVuZ3RoID09PSAwXG4gICAgICAgICAgPyA8c3BhbiBzdHlsZT17REFTSF9TVFlMRVMudG9vbHRpcH0+PHNwYW4gc3R5bGU9e0RBU0hfU1RZTEVTLmFycm93TGVmdH0gLz5DcmVhdGUgYSBQcm9qZWN0PC9zcGFuPlxuICAgICAgICAgIDogbnVsbFxuICAgICAgICB9XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICBwcm9qZWN0RWRpdEJ1dHRvbkVsZW1lbnQgKHByb2plY3RPYmplY3QpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGJ1dHRvblxuICAgICAgICB0YWJJbmRleD0nLTEnXG4gICAgICAgIHN0eWxlPXtEQVNIX1NUWUxFUy5lZGl0UHJvamVjdH1cbiAgICAgICAgZGlzYWJsZWQ9eyEhdGhpcy5zdGF0ZS5sYXVuY2hpbmdQcm9qZWN0fVxuICAgICAgICBvbkNsaWNrPXt0aGlzLmhhbmRsZVByb2plY3RMYXVuY2guYmluZCh0aGlzLCBwcm9qZWN0T2JqZWN0KX1cbiAgICAgICAgaWQ9J3Byb2plY3QtZWRpdC1idXR0b24nPlxuICAgICAgICBPcGVuIEVkaXRvclxuICAgICAgPC9idXR0b24+XG4gICAgKVxuICB9XG5cbiAgcHJvamVjdEZvcm1FbGVtZW50IChwcm9qZWN0T2JqZWN0KSB7XG4gICAgaWYgKCFwcm9qZWN0T2JqZWN0KSB7XG4gICAgICBpZiAodGhpcy5zdGF0ZS5hcmVQcm9qZWN0c0xvYWRpbmcpIHtcbiAgICAgICAgcmV0dXJuIDxkaXYgLz5cbiAgICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0ZS5wcm9qZWN0c0xpc3QubGVuZ3RoID09PSAwICYmICF0aGlzLnN0YXRlLmFyZVByb2plY3RzTG9hZGluZykge1xuICAgICAgICByZXR1cm4gPGRpdiBzdHlsZT17W0RBU0hfU1RZTEVTLmVtcHR5U3RhdGUsIERBU0hfU1RZTEVTLm5vU2VsZWN0XX0+Q3JlYXRlIGEgcHJvamVjdCB0byBiZWdpbjwvZGl2PlxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIDxkaXYgc3R5bGU9e1tEQVNIX1NUWUxFUy5lbXB0eVN0YXRlLCBEQVNIX1NUWUxFUy5ub1NlbGVjdF19PlNlbGVjdCBhIHByb2plY3QgdG8gYmVnaW48L2Rpdj5cbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBpbXBvcnRVcmkgPSBgJHtzbmFrZWl6ZShwcm9qZWN0T2JqZWN0LnByb2plY3ROYW1lKX1gXG4gICAgY29uc3QgY29tbWFuZExpbmVTbmlwcGV0ID0gYGhhaWt1IGluc3RhbGwgJHtpbXBvcnRVcml9YFxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2PlxuICAgICAgICA8ZGl2IHN0eWxlPXtEQVNIX1NUWUxFUy5maWVsZFRpdGxlfT5Qcm9qZWN0IG5hbWU8L2Rpdj5cbiAgICAgICAgPGRpdiBzdHlsZT17e3Bvc2l0aW9uOiAncmVsYXRpdmUnfX0+XG4gICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICBrZXk9J3Byb2plY3RUaXRsZSdcbiAgICAgICAgICAgIHZhbHVlPXtwcm9qZWN0T2JqZWN0LnByb2plY3ROYW1lfVxuICAgICAgICAgICAgc3R5bGU9e0RBU0hfU1RZTEVTLmZpZWxkfVxuICAgICAgICAgICAgcmVhZE9ubHlcbiAgICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZVByb2plY3RUaXRsZUNoYW5nZS5iaW5kKHRoaXMsIHByb2plY3RPYmplY3QpfSAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBzdHlsZT17REFTSF9TVFlMRVMuZmllbGRUaXRsZX0+SW1wb3J0IGludG8gYSBjb2RlYmFzZSB2aWEgY29tbWFuZCBsaW5lPC9kaXY+XG4gICAgICAgIDxpbnB1dCBrZXk9J3Byb2plY3RJbXBvcnRVcmknIHJlZj0naW1wb3J0SW5wdXQnIG9uQ2xpY2s9e3RoaXMuaGFuZGxlSW1wb3J0SW5wdXRDbGljay5iaW5kKHRoaXMpfSB2YWx1ZT17Y29tbWFuZExpbmVTbmlwcGV0fSBzdHlsZT17W0RBU0hfU1RZTEVTLmZpZWxkLCBEQVNIX1NUWUxFUy5maWVsZE1vbm9dfSByZWFkT25seSAvPlxuICAgICAgICB7dGhpcy5wcm9qZWN0RWRpdEJ1dHRvbkVsZW1lbnQocHJvamVjdE9iamVjdCl9XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICByZW5kZXJOb3RpZmljYXRpb25zIChjb250ZW50LCBpKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxUb2FzdFxuICAgICAgICB0b2FzdFR5cGU9e2NvbnRlbnQudHlwZX1cbiAgICAgICAgdG9hc3RUaXRsZT17Y29udGVudC50aXRsZX1cbiAgICAgICAgdG9hc3RNZXNzYWdlPXtjb250ZW50Lm1lc3NhZ2V9XG4gICAgICAgIGNsb3NlVGV4dD17Y29udGVudC5jbG9zZVRleHR9XG4gICAgICAgIGtleT17aSArIGNvbnRlbnQudGl0bGV9XG4gICAgICAgIG15S2V5PXtpfVxuICAgICAgICByZW1vdmVOb3RpY2U9e3RoaXMucHJvcHMucmVtb3ZlTm90aWNlfVxuICAgICAgICBsaWdodFNjaGVtZT17Y29udGVudC5saWdodFNjaGVtZX0gLz5cbiAgICApXG4gIH1cblxuICByZW5kZXIgKCkge1xuICAgIGNvbnN0IGFjdGl2ZVByb2plY3QgPSBsb2Rhc2guZmluZCh0aGlzLnN0YXRlLnByb2plY3RzTGlzdCwgeyBpc0FjdGl2ZTogdHJ1ZSB9KVxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2PlxuICAgICAgICA8UmVhY3RDU1NUcmFuc2l0aW9uR3JvdXBcbiAgICAgICAgICB0cmFuc2l0aW9uTmFtZT0ndG9hc3QnXG4gICAgICAgICAgdHJhbnNpdGlvbkVudGVyVGltZW91dD17NTAwfVxuICAgICAgICAgIHRyYW5zaXRpb25MZWF2ZVRpbWVvdXQ9ezMwMH0+XG4gICAgICAgICAgPGRpdiBzdHlsZT17e3Bvc2l0aW9uOiAnYWJzb2x1dGUnLCByaWdodDogMCwgdG9wOiAwLCB3aWR0aDogMzAwfX0+XG4gICAgICAgICAgICB7bG9kYXNoLm1hcCh0aGlzLnByb3BzLm5vdGljZXMsIHRoaXMucmVuZGVyTm90aWZpY2F0aW9ucyl9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvUmVhY3RDU1NUcmFuc2l0aW9uR3JvdXA+XG4gICAgICAgIDxkaXYgc3R5bGU9e1tEQVNIX1NUWUxFUy5kYXNoTGV2ZWxXcmFwcGVyLCBEQVNIX1NUWUxFUy5hcHBlYXJEYXNoTGV2ZWxdfT5cbiAgICAgICAgICA8ZGl2IHN0eWxlPXtEQVNIX1NUWUxFUy5mcmFtZX0gY2xhc3NOYW1lPSdmcmFtZScgLz5cbiAgICAgICAgICA8ZGl2IHN0eWxlPXtEQVNIX1NUWUxFUy5wcm9qZWN0c0Jhcn0+XG4gICAgICAgICAgICB7dGhpcy50aXRsZVdyYXBwZXJFbGVtZW50KCl9XG4gICAgICAgICAgICB7dGhpcy5wcm9qZWN0c0xpc3RFbGVtZW50KCl9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBzdHlsZT17REFTSF9TVFlMRVMuZGV0YWlsc30+XG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXtEQVNIX1NUWUxFUy5jZW50ZXJDb2x9PlxuICAgICAgICAgICAgICB7YWN0aXZlUHJvamVjdCAmJiBhY3RpdmVQcm9qZWN0LmlzTmV3XG4gICAgICAgICAgICAgICAgPyA8c3BhbiAvPlxuICAgICAgICAgICAgICAgIDogdGhpcy5wcm9qZWN0Rm9ybUVsZW1lbnQoYWN0aXZlUHJvamVjdCl9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIHt0aGlzLnN0YXRlLmxhdW5jaGluZ1Byb2plY3QgJiYgPFByb2plY3RMb2FkZXIgLz59XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cbn1cblxuZnVuY3Rpb24gc25ha2VpemUgKHN0cikge1xuICBzdHIgPSBzdHIgfHwgJydcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC8gL2csICdfJylcbn1cblxuLy8gZnVuY3Rpb24gdW5pcXVlUHJvamVjdFRpdGxlIChwcm9qZWN0c0xpc3QsIHRpdGxlKSB7XG4vLyAgIGNvbnN0IG1hdGNoZWRQcm9qZWN0cyA9IGZpbHRlcihwcm9qZWN0c0xpc3QsIHsgdGl0bGUgfSlcbi8vICAgaWYgKG1hdGNoZWRQcm9qZWN0cy5sZW5ndGggPCAxKSByZXR1cm4gdGl0bGVcbi8vICAgLy8gVE9ETzogUGxlYXNlIG1ha2UgdGhpcyBhbGdvcml0aG0gcm9idXN0XG4vLyAgIHJldHVybiBgJHt0aXRsZX0gJHtwcm9qZWN0c0xpc3QubGVuZ3RoICsgMX1gXG4vLyB9XG5cbmV4cG9ydCBkZWZhdWx0IFJhZGl1bShQcm9qZWN0QnJvd3NlcilcbiJdfQ==