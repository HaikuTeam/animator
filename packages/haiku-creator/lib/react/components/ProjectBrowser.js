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

var _Icons = require('./Icons');

var _dashShared = require('../styles/dashShared');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
// import Color from 'color'


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
      projectObject.projectName = changeEvent.target.value;
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
    key: 'handleProjectLaunch',
    value: function handleProjectLaunch(projectObject) {
      var _this7 = this;

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

      this.setState({ newProjectLoading: true });
      var name = this.refs.newProjectInput.value;

      // HACK:  strip all non-alphanumeric chars for now.  something more user-friendly would be ideal
      name = name.replace(/[^a-z0-9]/gi, '');

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
  }, {
    key: 'projectsListElement',
    value: function projectsListElement() {
      var _this9 = this;

      if (this.state.areProjectsLoading) {
        return _react2.default.createElement(
          'span',
          { style: _dashShared.DASH_STYLES.loadingWrap, __source: {
              fileName: _jsxFileName,
              lineNumber: 210
            },
            __self: this
          },
          _react2.default.createElement(_betterReactSpinkit.FadingCircle, { size: 32, color: _Palette2.default.ROCK_MUTED, __source: {
              fileName: _jsxFileName,
              lineNumber: 210
            },
            __self: this
          })
        );
      }

      return _react2.default.createElement(
        'div',
        { style: { height: 'calc(100% - 70px)', overflowY: 'auto' }, __source: {
            fileName: _jsxFileName,
            lineNumber: 214
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
                lineNumber: 221
              },
              __self: _this9
            });

            projectTitle = _react2.default.createElement(
              'div',
              { style: [_dashShared.DASH_STYLES.projectTitleNew], __source: {
                  fileName: _jsxFileName,
                  lineNumber: 224
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
                  lineNumber: 225
                },
                __self: _this9
              }),
              _react2.default.createElement(
                'button',
                { key: 'new-project-go-button', disabled: _this9.state.newProjectLoading, onClick: _this9.handleNewProjectGo.bind(_this9), style: [_dashShared.DASH_STYLES.newProjectGoButton], __source: {
                    fileName: _jsxFileName,
                    lineNumber: 232
                  },
                  __self: _this9
                },
                buttonContents
              ),
              _react2.default.createElement(
                'span',
                { key: 'new-project-error', style: [_dashShared.DASH_STYLES.newProjectError], __source: {
                    fileName: _jsxFileName,
                    lineNumber: 233
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
                  lineNumber: 238
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
                lineNumber: 242
              },
              __self: _this9
            },
            _react2.default.createElement('span', { key: 'a-' + projectObject.projectName, style: [projectObject.isActive && _dashShared.DASH_STYLES.activeProject], __source: {
                fileName: _jsxFileName,
                lineNumber: 246
              },
              __self: _this9
            }),
            _react2.default.createElement(
              'span',
              { style: [_dashShared.DASH_STYLES.logo, projectObject.isActive && _dashShared.DASH_STYLES.logoActive], __source: {
                  fileName: _jsxFileName,
                  lineNumber: 247
                },
                __self: _this9
              },
              _react2.default.createElement(_Icons.LogoSVG, {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 247
                },
                __self: _this9
              })
            ),
            projectTitle,
            _react2.default.createElement(
              'span',
              { style: [_dashShared.DASH_STYLES.date, projectObject.isActive && _dashShared.DASH_STYLES.activeDate], __source: {
                  fileName: _jsxFileName,
                  lineNumber: 249
                },
                __self: _this9
              },
              _react2.default.createElement('div', { style: _dashShared.DASH_STYLES.dateTitle, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 250
                },
                __self: _this9
              }),
              _react2.default.createElement('div', {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 251
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
            lineNumber: 262
          },
          __self: this
        },
        _react2.default.createElement(
          'span',
          { style: _dashShared.DASH_STYLES.projectsTitle, __source: {
              fileName: _jsxFileName,
              lineNumber: 263
            },
            __self: this
          },
          'Projects'
        ),
        _react2.default.createElement(
          'button',
          { style: _dashShared.DASH_STYLES.btnNewProject, onClick: this.launchNewProjectInput.bind(this), __source: {
              fileName: _jsxFileName,
              lineNumber: 264
            },
            __self: this
          },
          '+'
        ),
        !this.state.areProjectsLoading && this.state.projectsList.length === 0 ? _react2.default.createElement(
          'span',
          { style: _dashShared.DASH_STYLES.tooltip, __source: {
              fileName: _jsxFileName,
              lineNumber: 266
            },
            __self: this
          },
          _react2.default.createElement('span', { style: _dashShared.DASH_STYLES.arrowLeft, __source: {
              fileName: _jsxFileName,
              lineNumber: 266
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
          style: _dashShared.DASH_STYLES.editProject,
          disabled: !!this.state.launchingProject,
          onClick: this.handleProjectLaunch.bind(this, projectObject),
          id: 'project-edit-button', __source: {
            fileName: _jsxFileName,
            lineNumber: 275
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
              lineNumber: 288
            },
            __self: this
          });
        } else if (this.state.projectsList.length === 0 && !this.state.areProjectsLoading) {
          return _react2.default.createElement(
            'div',
            { style: [_dashShared.DASH_STYLES.emptyState, _dashShared.DASH_STYLES.noSelect], __source: {
                fileName: _jsxFileName,
                lineNumber: 290
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
                lineNumber: 292
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
            lineNumber: 299
          },
          __self: this
        },
        _react2.default.createElement(
          'div',
          { style: _dashShared.DASH_STYLES.fieldTitle, __source: {
              fileName: _jsxFileName,
              lineNumber: 300
            },
            __self: this
          },
          'Project name'
        ),
        _react2.default.createElement(
          'div',
          { style: { position: 'relative' }, __source: {
              fileName: _jsxFileName,
              lineNumber: 301
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
              lineNumber: 302
            },
            __self: this
          }),
          _react2.default.createElement(
            'span',
            { style: [_dashShared.DASH_STYLES.fieldDialogue, this.state.showNeedsSaveDialogue && _dashShared.DASH_STYLES.fieldDialogueActive], __source: {
                fileName: _jsxFileName,
                lineNumber: 308
              },
              __self: this
            },
            _react2.default.createElement('span', { style: _dashShared.DASH_STYLES.arrowTop, __source: {
                fileName: _jsxFileName,
                lineNumber: 309
              },
              __self: this
            }),
            'This project has unsaved changes. Please save or discard the edits before switching projects.',
            _react2.default.createElement(
              'div',
              { style: { marginTop: 8 }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 311
                },
                __self: this
              },
              _react2.default.createElement(
                'button',
                { key: 'btn-save', style: [_dashShared.DASH_STYLES.btn, _dashShared.DASH_STYLES.btnRight], __source: {
                    fileName: _jsxFileName,
                    lineNumber: 312
                  },
                  __self: this
                },
                'Save'
              ),
              _react2.default.createElement(
                'button',
                { key: 'btn-discard', style: [_dashShared.DASH_STYLES.btn, _dashShared.DASH_STYLES.btnRight, _dashShared.DASH_STYLES.btnSecondary], __source: {
                    fileName: _jsxFileName,
                    lineNumber: 313
                  },
                  __self: this
                },
                'Discard'
              )
            )
          )
        ),
        _react2.default.createElement(
          'div',
          { style: _dashShared.DASH_STYLES.fieldTitle, __source: {
              fileName: _jsxFileName,
              lineNumber: 317
            },
            __self: this
          },
          'Import into a codebase via command line'
        ),
        _react2.default.createElement('input', { key: 'projectImportUri', ref: 'importInput', onClick: this.handleImportInputClick.bind(this), value: commandLineSnippet, style: [_dashShared.DASH_STYLES.field, _dashShared.DASH_STYLES.fieldMono], readOnly: true, __source: {
            fileName: _jsxFileName,
            lineNumber: 318
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
          lineNumber: 326
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
            lineNumber: 341
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
              lineNumber: 342
            },
            __self: this
          },
          _react2.default.createElement(
            'div',
            { style: { position: 'absolute', right: 0, top: 0, width: 300 }, __source: {
                fileName: _jsxFileName,
                lineNumber: 346
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
              lineNumber: 350
            },
            __self: this
          },
          _react2.default.createElement('div', { style: _dashShared.DASH_STYLES.frame, className: 'frame', __source: {
              fileName: _jsxFileName,
              lineNumber: 351
            },
            __self: this
          }),
          _react2.default.createElement(
            'div',
            { style: _dashShared.DASH_STYLES.projectsBar, __source: {
                fileName: _jsxFileName,
                lineNumber: 352
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
                lineNumber: 356
              },
              __self: this
            },
            _react2.default.createElement(
              'div',
              { style: _dashShared.DASH_STYLES.centerCol, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 357
                },
                __self: this
              },
              activeProject && activeProject.isNew ? _react2.default.createElement('span', {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 359
                },
                __self: this
              }) : this.projectFormElement(activeProject)
            )
          )
        ),
        this.state.launchingProject ? _react2.default.createElement(
          'div',
          { style: _dashShared.DASH_STYLES.fullScreenCenterWrap, __source: {
              fileName: _jsxFileName,
              lineNumber: 365
            },
            __self: this
          },
          _react2.default.createElement(_betterReactSpinkit.FadingCircle, { size: 52, color: _Palette2.default.ROCK, __source: {
              fileName: _jsxFileName,
              lineNumber: 366
            },
            __self: this
          })
        ) : ''
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9yZWFjdC9jb21wb25lbnRzL1Byb2plY3RCcm93c2VyLmpzIl0sIm5hbWVzIjpbIlByb2plY3RCcm93c2VyIiwicHJvcHMiLCJyZW5kZXJOb3RpZmljYXRpb25zIiwiYmluZCIsInN0YXRlIiwiZXJyb3IiLCJzaG93TmVlZHNTYXZlRGlhbG9ndWUiLCJwcm9qZWN0c0xpc3QiLCJhcmVQcm9qZWN0c0xvYWRpbmciLCJsYXVuY2hpbmdQcm9qZWN0IiwiaGFuZGxlRG9jdW1lbnRLZXlQcmVzcyIsImhhbmRsZVNlbGVjdFByb2plY3QiLCJsb2FkUHJvamVjdHMiLCJkb2N1bWVudCIsImFkZEV2ZW50TGlzdGVuZXIiLCJlbnZveSIsImdldCIsInRoZW4iLCJ0b3VyQ2hhbm5lbCIsIm9uIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsIm9mZiIsInByb2plY3RJZHgiLCJmaW5kSW5kZXgiLCJwcm9qZWN0IiwicHJvamVjdE5hbWUiLCJzZXRBY3RpdmVQcm9qZWN0IiwiZXZ0IiwiZGVsdGEiLCJjb2RlIiwiZm91bmQiLCJmb3JFYWNoIiwiaSIsImlzQWN0aXZlIiwicHJvcG9zZWRJbmRleCIsImlzTmV3IiwibmV3UHJvamVjdExvYWRpbmciLCJzaGlmdCIsIm5ld0luZGV4IiwiTWF0aCIsIm1pbiIsIm1heCIsImxlbmd0aCIsInNldFN0YXRlIiwiY3JlYXRlTm90aWNlIiwidHlwZSIsInRpdGxlIiwibWVzc2FnZSIsImNsb3NlVGV4dCIsImxpZ2h0U2NoZW1lIiwicHJvamVjdE9iamVjdCIsInByb2plY3RJbmRleCIsImZvdW5kUHJvamVjdCIsImZvdW5kSW5kZXgiLCJjaGFuZ2VFdmVudCIsInRhcmdldCIsInZhbHVlIiwidW5zaGlmdCIsInNldFRpbWVvdXQiLCJyZWZzIiwibmV3UHJvamVjdElucHV0Iiwic2VsZWN0IiwibGF1bmNoUHJvamVjdCIsImltcG9ydElucHV0IiwiZSIsImNoYXJDb2RlIiwiaGFuZGxlTmV3UHJvamVjdEdvIiwibmFtZSIsInJlcGxhY2UiLCJ3ZWJzb2NrZXQiLCJyZXF1ZXN0IiwibWV0aG9kIiwicGFyYW1zIiwiZXJyIiwibmV3UHJvamVjdCIsInNwbGljZSIsIm5ld1Byb2plY3RFcnJvciIsInBsYWNlaG9sZGVyUHJvamVjdCIsInByb2plY3RMaXN0IiwibG9hZGluZ1dyYXAiLCJST0NLX01VVEVEIiwiaGVpZ2h0Iiwib3ZlcmZsb3dZIiwibWFwIiwiaW5kZXgiLCJwcm9qZWN0VGl0bGUiLCJidXR0b25Db250ZW50cyIsInByb2plY3RUaXRsZU5ldyIsImhhbmRsZU5ld1Byb2plY3RJbnB1dENsaWNrIiwiaGFuZGxlTmV3UHJvamVjdElucHV0S2V5UHJlc3MiLCJuZXdQcm9qZWN0R29CdXR0b24iLCJhY3RpdmVUaXRsZSIsInByb2plY3RXcmFwcGVyIiwiYWN0aXZlV3JhcHBlciIsImhhbmRsZVByb2plY3RMYXVuY2giLCJhY3RpdmVQcm9qZWN0IiwibG9nbyIsImxvZ29BY3RpdmUiLCJkYXRlIiwiYWN0aXZlRGF0ZSIsImRhdGVUaXRsZSIsInRpdGxlV3JhcHBlciIsInByb2plY3RzVGl0bGUiLCJidG5OZXdQcm9qZWN0IiwibGF1bmNoTmV3UHJvamVjdElucHV0IiwidG9vbHRpcCIsImFycm93TGVmdCIsImVkaXRQcm9qZWN0IiwiZW1wdHlTdGF0ZSIsIm5vU2VsZWN0IiwiaW1wb3J0VXJpIiwic25ha2VpemUiLCJjb21tYW5kTGluZVNuaXBwZXQiLCJmaWVsZFRpdGxlIiwicG9zaXRpb24iLCJmaWVsZCIsImhhbmRsZVByb2plY3RUaXRsZUNoYW5nZSIsImZpZWxkRGlhbG9ndWUiLCJmaWVsZERpYWxvZ3VlQWN0aXZlIiwiYXJyb3dUb3AiLCJtYXJnaW5Ub3AiLCJidG4iLCJidG5SaWdodCIsImJ0blNlY29uZGFyeSIsImhhbmRsZUltcG9ydElucHV0Q2xpY2siLCJmaWVsZE1vbm8iLCJwcm9qZWN0RWRpdEJ1dHRvbkVsZW1lbnQiLCJjb250ZW50IiwicmVtb3ZlTm90aWNlIiwiZmluZCIsInJpZ2h0IiwidG9wIiwid2lkdGgiLCJub3RpY2VzIiwiZGFzaExldmVsV3JhcHBlciIsImFwcGVhckRhc2hMZXZlbCIsImZyYW1lIiwicHJvamVjdHNCYXIiLCJ0aXRsZVdyYXBwZXJFbGVtZW50IiwicHJvamVjdHNMaXN0RWxlbWVudCIsImRldGFpbHMiLCJjZW50ZXJDb2wiLCJwcm9qZWN0Rm9ybUVsZW1lbnQiLCJmdWxsU2NyZWVuQ2VudGVyV3JhcCIsIlJPQ0siLCJDb21wb25lbnQiLCJzdHIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUVBOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOztBQUNBOzs7Ozs7Ozs7QUFOQTs7O0lBUU1BLGM7OztBQUNKLDBCQUFhQyxLQUFiLEVBQW9CO0FBQUE7O0FBQUEsZ0lBQ1pBLEtBRFk7O0FBRWxCLFVBQUtDLG1CQUFMLEdBQTJCLE1BQUtBLG1CQUFMLENBQXlCQyxJQUF6QixPQUEzQjtBQUNBLFVBQUtDLEtBQUwsR0FBYTtBQUNYQyxhQUFPLElBREk7QUFFWEMsNkJBQXVCLEtBRlo7QUFHWEMsb0JBQWMsRUFISDtBQUlYQywwQkFBb0IsSUFKVDtBQUtYQyx3QkFBa0I7QUFMUCxLQUFiO0FBT0EsVUFBS0Msc0JBQUwsR0FBOEIsTUFBS0Esc0JBQUwsQ0FBNEJQLElBQTVCLE9BQTlCO0FBQ0EsVUFBS1EsbUJBQUwsR0FBMkIsTUFBS0EsbUJBQUwsQ0FBeUJSLElBQXpCLE9BQTNCO0FBWGtCO0FBWW5COzs7O3dDQUVvQjtBQUFBOztBQUNuQixXQUFLUyxZQUFMO0FBQ0FDLGVBQVNDLGdCQUFULENBQTBCLFNBQTFCLEVBQXFDLEtBQUtKLHNCQUExQyxFQUFrRSxJQUFsRTs7QUFFQSxXQUFLVCxLQUFMLENBQVdjLEtBQVgsQ0FBaUJDLEdBQWpCLENBQXFCLE1BQXJCLEVBQTZCQyxJQUE3QixDQUFrQyxVQUFDQyxXQUFELEVBQWlCO0FBQ2pELGVBQUtBLFdBQUwsR0FBbUJBLFdBQW5CO0FBQ0FBLG9CQUFZQyxFQUFaLENBQWUsMkJB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QUFBQTtBQUFBO0FBQUEsWUFERjtBQUVFO0FBQUE7QUFBQSxjQUFLLE9BQU8sd0JBQVlDLFdBQXhCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNHLGlCQUFLQyxtQkFBTCxFQURIO0FBRUcsaUJBQUtDLG1CQUFMO0FBRkgsV0FGRjtBQU1FO0FBQUE7QUFBQSxjQUFLLE9BQU8sd0JBQVlDLE9BQXhCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNFO0FBQUE7QUFBQSxnQkFBSyxPQUFPLHdCQUFZQyxTQUF4QjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDRzlDLCtCQUFpQkEsY0FBYzVELEtBQS9CLEdBQ0c7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsZ0JBREgsR0FFRyxLQUFLMkcsa0JBQUwsQ0FBd0IvQyxhQUF4QjtBQUhOO0FBREY7QUFORixTQVRGO0FBdUJHLGFBQUszRixLQUFMLENBQVdLLGdCQUFYLEdBQ0c7QUFBQTtBQUFBLFlBQUssT0FBTyx3QkFBWXNJLG9CQUF4QjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQSw0RUFBYyxNQUFNLEVBQXBCLEVBQXdCLE9BQU8sa0JBQVFDLElBQXZDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQURBLFNBREgsR0FJRztBQTNCTixPQURGO0FBK0JEOzs7O0VBdlcwQixnQkFBTUMsUzs7QUEwV25DLFNBQVNsQyxRQUFULENBQW1CbUMsR0FBbkIsRUFBd0I7QUFDdEJBLFFBQU1BLE9BQU8sRUFBYjtBQUNBLFNBQU9BLElBQUk5RSxPQUFKLENBQVksSUFBWixFQUFrQixHQUFsQixDQUFQO0FBQ0Q7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztrQkFFZSxzQkFBT3BFLGNBQVAsQyIsImZpbGUiOiJQcm9qZWN0QnJvd3Nlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBsb2Rhc2ggZnJvbSAnbG9kYXNoJ1xuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IFJhZGl1bSBmcm9tICdyYWRpdW0nXG4vLyBpbXBvcnQgQ29sb3IgZnJvbSAnY29sb3InXG5pbXBvcnQgUmVhY3RDU1NUcmFuc2l0aW9uR3JvdXAgZnJvbSAncmVhY3QtYWRkb25zLWNzcy10cmFuc2l0aW9uLWdyb3VwJ1xuaW1wb3J0IHsgRmFkaW5nQ2lyY2xlIH0gZnJvbSAnYmV0dGVyLXJlYWN0LXNwaW5raXQnXG5pbXBvcnQgUGFsZXR0ZSBmcm9tICcuL1BhbGV0dGUnXG5pbXBvcnQgVG9hc3QgZnJvbSAnLi9ub3RpZmljYXRpb25zL1RvYXN0J1xuaW1wb3J0IHsgTG9nb1NWRywgTG9hZGluZ1NwaW5uZXJTVkcgfSBmcm9tICcuL0ljb25zJ1xuaW1wb3J0IHsgREFTSF9TVFlMRVMgfSBmcm9tICcuLi9zdHlsZXMvZGFzaFNoYXJlZCdcblxuY2xhc3MgUHJvamVjdEJyb3dzZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3RvciAocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcylcbiAgICB0aGlzLnJlbmRlck5vdGlmaWNhdGlvbnMgPSB0aGlzLnJlbmRlck5vdGlmaWNhdGlvbnMuYmluZCh0aGlzKVxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBlcnJvcjogbnVsbCxcbiAgICAgIHNob3dOZWVkc1NhdmVEaWFsb2d1ZTogZmFsc2UsXG4gICAgICBwcm9qZWN0c0xpc3Q6IFtdLFxuICAgICAgYXJlUHJvamVjdHNMb2FkaW5nOiB0cnVlLFxuICAgICAgbGF1bmNoaW5nUHJvamVjdDogZmFsc2VcbiAgICB9XG4gICAgdGhpcy5oYW5kbGVEb2N1bWVudEtleVByZXNzID0gdGhpcy5oYW5kbGVEb2N1bWVudEtleVByZXNzLmJpbmQodGhpcylcbiAgICB0aGlzLmhhbmRsZVNlbGVjdFByb2plY3QgPSB0aGlzLmhhbmRsZVNlbGVjdFByb2plY3QuYmluZCh0aGlzKVxuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQgKCkge1xuICAgIHRoaXMubG9hZFByb2plY3RzKClcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdGhpcy5oYW5kbGVEb2N1bWVudEtleVByZXNzLCB0cnVlKVxuXG4gICAgdGhpcy5wcm9wcy5lbnZveS5nZXQoJ3RvdXInKS50aGVuKCh0b3VyQ2hhbm5lbCkgPT4ge1xuICAgICAgdGhpcy50b3VyQ2hhbm5lbCA9IHRvdXJDaGFubmVsXG4gICAgICB0b3VyQ2hhbm5lbC5vbigndG91cjpyZXF1ZXN0U2VsZWN0UHJvamVjdCcsIHRoaXMuaGFuZGxlU2VsZWN0UHJvamVjdClcbiAgICB9KVxuICB9XG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQgKCkge1xuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLmhhbmRsZURvY3VtZW50S2V5UHJlc3MsIHRydWUpXG4gICAgdGhpcy50b3VyQ2hhbm5lbC5vZmYoJ3RvdXI6cmVxdWVzdFNlbGVjdFByb2plY3QnLCB0aGlzLmhhbmRsZVNlbGVjdFByb2plY3QpXG4gIH1cblxuICBoYW5kbGVTZWxlY3RQcm9qZWN0ICgpIHtcbiAgICBjb25zdCBwcm9qZWN0SWR4ID0gdGhpcy5zdGF0ZS5wcm9qZWN0c0xpc3QuZmluZEluZGV4KChwcm9qZWN0KSA9PiB7XG4gICAgICAvLyBIYXJkY29kZWQgLSBOYW1lIG9mIHRoZSBwcm9qZWN0IHRoYXQgd2lsbCBiZSB1c2VkIGZvciB0aGUgdHV0b3JpYWxcbiAgICAgIHJldHVybiBwcm9qZWN0LnByb2plY3ROYW1lID09PSAnQ2hlY2tUdXRvcmlhbCdcbiAgICB9KVxuXG4gICAgdGhpcy5zZXRBY3RpdmVQcm9qZWN0KHRoaXMuc3RhdGUucHJvamVjdHNMaXN0W3Byb2plY3RJZHhdLCBwcm9qZWN0SWR4KVxuICB9XG5cbiAgaGFuZGxlRG9jdW1lbnRLZXlQcmVzcyAoZXZ0KSB7XG4gICAgdmFyIHByb2plY3RzTGlzdCA9IHRoaXMuc3RhdGUucHJvamVjdHNMaXN0XG5cbiAgICB2YXIgZGVsdGEgPSAwXG4gICAgaWYgKGV2dC5jb2RlID09PSAnQXJyb3dVcCcpIHtcbiAgICAgIGRlbHRhID0gLTFcbiAgICB9IGVsc2UgaWYgKGV2dC5jb2RlID09PSAnQXJyb3dEb3duJykge1xuICAgICAgZGVsdGEgPSAxXG4gICAgfVxuXG4gICAgdmFyIGZvdW5kID0gZmFsc2VcbiAgICBwcm9qZWN0c0xpc3QuZm9yRWFjaCgocHJvamVjdCwgaSkgPT4ge1xuICAgICAgaWYgKCFmb3VuZCAmJiBwcm9qZWN0LmlzQWN0aXZlKSB7XG4gICAgICAgIHZhciBwcm9wb3NlZEluZGV4ID0gaSArIGRlbHRhXG4gICAgICAgIC8vIHJlbW92ZSBjcmVhdGUgVUkgaWYgbmF2aWdhdGluZyBhd2F5IGJlZm9yZSBzdWJtaXR0aW5nXG4gICAgICAgIGlmIChpID09PSAwICYmIGRlbHRhID09PSAxICYmIHByb2plY3QuaXNOZXcgJiYgIXRoaXMuc3RhdGUubmV3UHJvamVjdExvYWRpbmcpIHtcbiAgICAgICAgICBwcm9wb3NlZEluZGV4ID0gMFxuICAgICAgICAgIHByb2plY3RzTGlzdC5zaGlmdCgpXG4gICAgICAgIH1cblxuICAgICAgICB2YXIgbmV3SW5kZXggPSBNYXRoLm1pbihNYXRoLm1heCgwLCBwcm9wb3NlZEluZGV4KSwgcHJvamVjdHNMaXN0Lmxlbmd0aCAtIDEpXG5cbiAgICAgICAgcHJvamVjdC5pc0FjdGl2ZSA9IGZhbHNlXG4gICAgICAgIHByb2plY3RzTGlzdFtuZXdJbmRleF0uaXNBY3RpdmUgPSB0cnVlXG4gICAgICAgIGZvdW5kID0gdHJ1ZVxuICAgICAgfVxuICAgIH0pXG4gICAgdGhpcy5zZXRTdGF0ZSh7cHJvamVjdHNMaXN0fSlcbiAgfVxuXG4gIGxvYWRQcm9qZWN0cyAoKSB7XG4gICAgcmV0dXJuIHRoaXMucHJvcHMubG9hZFByb2plY3RzKChlcnJvciwgcHJvamVjdHNMaXN0KSA9PiB7XG4gICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgdGhpcy5wcm9wcy5jcmVhdGVOb3RpY2Uoe1xuICAgICAgICAgIHR5cGU6ICdlcnJvcicsXG4gICAgICAgICAgdGl0bGU6ICdPaCBubyEnLFxuICAgICAgICAgIG1lc3NhZ2U6ICdXZSBjb3VsZG5cXCd0IGxvYWQgeW91ciB0ZWFtXFwncyBwcm9qZWN0cy4g8J+YoiBQbGVhc2UgZW5zdXJlIHRoYXQgeW91ciBjb21wdXRlciBpcyBjb25uZWN0ZWQgdG8gdGhlIEludGVybmV0LiBJZiB5b3VcXCdyZSBjb25uZWN0ZWQgYW5kIHlvdSBzdGlsbCBzZWUgdGhpcyBtZXNzYWdlIG91ciBzZXJ2ZXJzIG1pZ2h0IGJlIGhhdmluZyBwcm9ibGVtcy4gUGxlYXNlIHRyeSBhZ2FpbiBpbiBhIGZldyBtb21lbnRzLiBJZiB5b3Ugc3RpbGwgc2VlIHRoaXMgbWVzc2FnZSwgY29udGFjdCBIYWlrdSBmb3Igc3VwcG9ydC4nLFxuICAgICAgICAgIGNsb3NlVGV4dDogJ09rYXknLFxuICAgICAgICAgIGxpZ2h0U2NoZW1lOiB0cnVlXG4gICAgICAgIH0pXG4gICAgICAgIHJldHVybiB0aGlzLnNldFN0YXRlKHsgZXJyb3IsIGFyZVByb2plY3RzTG9hZGluZzogZmFsc2UgfSlcbiAgICAgIH1cbiAgICAgIC8vIHNlbGVjdCB0aGUgZmlyc3QgcHJvamVjdCBieSBkZWZhdWx0XG4gICAgICBpZiAocHJvamVjdHNMaXN0Lmxlbmd0aCkge1xuICAgICAgICBwcm9qZWN0c0xpc3RbMF0uaXNBY3RpdmUgPSB0cnVlXG4gICAgICB9XG4gICAgICB0aGlzLnNldFN0YXRlKHsgcHJvamVjdHNMaXN0LCBhcmVQcm9qZWN0c0xvYWRpbmc6IGZhbHNlIH0pXG4gICAgfSlcbiAgfVxuXG4gIHNldEFjdGl2ZVByb2plY3QgKHByb2plY3RPYmplY3QsIHByb2plY3RJbmRleCkge1xuICAgIGNvbnN0IHByb2plY3RzTGlzdCA9IHRoaXMuc3RhdGUucHJvamVjdHNMaXN0XG5cbiAgICAvLyBUT0RPOiBpZiBjdXJyZW50IHByb2plY3QgaGFzIHVuc2F2ZWQgZWRpdHMgdGhlbiBzaG93IHNhdmUgZGlhbG9ndWVcbiAgICAvLyAgICAgICBhbmQgcmV0dXJuIHdpdGhvdXQgY2hhbmdpbmcgcHJvamVjdHNcbiAgICAvLyBpZiAoZmFsc2UpIHtcbiAgICAvLyAgIHRoaXMuc2V0U3RhdGUoeyBzaG93TmVlZHNTYXZlRGlhbG9ndWU6IHRydWUgfSlcbiAgICAvLyAgIHJldHVybiBmYWxzZVxuICAgIC8vIH1cblxuICAgIHByb2plY3RzTGlzdC5mb3JFYWNoKChmb3VuZFByb2plY3QsIGZvdW5kSW5kZXgpID0+IHtcbiAgICAgIC8vIHJlbW92ZSBuZXcgcHJvamVjdCBpZiBuYXZpZ2F0aW5nIGF3YXkgYmVmb3JlIGl0J3MgY29tcGxldGVcbiAgICAgIGlmIChwcm9qZWN0SW5kZXggIT09IDAgJiYgZm91bmRJbmRleCA9PT0gMCAmJiBmb3VuZFByb2plY3QuaXNOZXcgJiYgIXRoaXMuc3RhdGUubmV3UHJvamVjdExvYWRpbmcpIHByb2plY3RzTGlzdC5zaGlmdCgpXG4gICAgICBpZiAoZm91bmRJbmRleCA9PT0gcHJvamVjdEluZGV4KSBmb3VuZFByb2plY3QuaXNBY3RpdmUgPSB0cnVlXG4gICAgICBlbHNlIGZvdW5kUHJvamVjdC5pc0FjdGl2ZSA9IGZhbHNlXG4gICAgfSlcbiAgICB0aGlzLnNldFN0YXRlKHsgcHJvamVjdHNMaXN0IH0pXG4gIH1cblxuICBoYW5kbGVQcm9qZWN0VGl0bGVDaGFuZ2UgKHByb2plY3RPYmplY3QsIGNoYW5nZUV2ZW50KSB7XG4gICAgcHJvamVjdE9iamVjdC5wcm9qZWN0TmFtZSA9IGNoYW5nZUV2ZW50LnRhcmdldC52YWx1ZVxuICAgIHRoaXMuc2V0U3RhdGUoeyBwcm9qZWN0c0xpc3Q6IHRoaXMuc3RhdGUucHJvamVjdHNMaXN0IH0pXG4gIH1cblxuICBsYXVuY2hOZXdQcm9qZWN0SW5wdXQgKCkge1xuICAgIHZhciBwcm9qZWN0c0xpc3QgPSB0aGlzLnN0YXRlLnByb2plY3RzTGlzdFxuICAgIGlmICghcHJvamVjdHNMaXN0WzBdIHx8ICFwcm9qZWN0c0xpc3RbMF0uaXNOZXcpIHtcbiAgICAgIHByb2plY3RzTGlzdC5mb3JFYWNoKChmb3VuZFByb2plY3QsIGZvdW5kSW5kZXgpID0+IHtcbiAgICAgICAgZm91bmRQcm9qZWN0LmlzQWN0aXZlID0gZmFsc2VcbiAgICAgIH0pXG4gICAgICBwcm9qZWN0c0xpc3QudW5zaGlmdCh7XG4gICAgICAgIGlzQWN0aXZlOiB0cnVlLFxuICAgICAgICBpc05ldzogdHJ1ZSxcbiAgICAgICAgdGl0bGU6ICcnXG4gICAgICB9KVxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHRoaXMucmVmcy5uZXdQcm9qZWN0SW5wdXQuc2VsZWN0KClcbiAgICAgIH0sIDUwKVxuICAgICAgdGhpcy5zZXRTdGF0ZSh7IHByb2plY3RzTGlzdCB9KVxuICAgIH1cbiAgfVxuXG4gIGhhbmRsZVByb2plY3RMYXVuY2ggKHByb2plY3RPYmplY3QpIHtcbiAgICB0aGlzLnNldFN0YXRlKHsgbGF1bmNoaW5nUHJvamVjdDogcHJvamVjdE9iamVjdCB9KVxuICAgIC8vIHByb2plY3RPYmplY3QucHJvamVjdHNIb21lIHRvIHVzZSBwcm9qZWN0IGNvbnRhaW5lciBmb2xkZXJcbiAgICAvLyBwcm9qZWN0T2JqZWN0LnByb2plY3RQYXRoIHRvIHNldCBzcGVjaWZpYyBwcm9qZWN0IGZvbGRlciAobm8gaW5mZXJlbmNlKVxuICAgIHJldHVybiB0aGlzLnByb3BzLmxhdW5jaFByb2plY3QocHJvamVjdE9iamVjdC5wcm9qZWN0TmFtZSwgcHJvamVjdE9iamVjdCwgKGVycm9yKSA9PiB7XG4gICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgdGhpcy5wcm9wcy5jcmVhdGVOb3RpY2Uoe1xuICAgICAgICAgIHR5cGU6ICdlcnJvcicsXG4gICAgICAgICAgdGl0bGU6ICdPaCBubyEnLFxuICAgICAgICAgIG1lc3NhZ2U6ICdXZSBjb3VsZG5cXCd0IG9wZW4gdGhpcyBwcm9qZWN0LiDwn5ipIFBsZWFzZSBlbnN1cmUgdGhhdCB5b3VyIGNvbXB1dGVyIGlzIGNvbm5lY3RlZCB0byB0aGUgSW50ZXJuZXQuIElmIHlvdVxcJ3JlIGNvbm5lY3RlZCBhbmQgeW91IHN0aWxsIHNlZSB0aGlzIG1lc3NhZ2UgeW91ciBmaWxlcyBtaWdodCBzdGlsbCBiZSBwcm9jZXNzaW5nLiBQbGVhc2UgdHJ5IGFnYWluIGluIGEgZmV3IG1vbWVudHMuIElmIHlvdSBzdGlsbCBzZWUgdGhpcyBlcnJvciwgY29udGFjdCBIYWlrdSBmb3Igc3VwcG9ydC4nLFxuICAgICAgICAgIGNsb3NlVGV4dDogJ09rYXknLFxuICAgICAgICAgIGxpZ2h0U2NoZW1lOiB0cnVlXG4gICAgICAgIH0pXG4gICAgICAgIHJldHVybiB0aGlzLnNldFN0YXRlKHsgZXJyb3IsIGxhdW5jaGluZ1Byb2plY3Q6IG51bGwgfSlcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgaGFuZGxlSW1wb3J0SW5wdXRDbGljayAoKSB7XG4gICAgdGhpcy5yZWZzLmltcG9ydElucHV0LnNlbGVjdCgpXG4gIH1cblxuICBoYW5kbGVOZXdQcm9qZWN0SW5wdXRDbGljayAoKSB7XG4gICAgdGhpcy5yZWZzLm5ld1Byb2plY3RJbnB1dC5zZWxlY3QoKVxuICB9XG5cbiAgaGFuZGxlTmV3UHJvamVjdElucHV0S2V5UHJlc3MgKGUpIHtcbiAgICBpZiAoZS5jaGFyQ29kZSA9PT0gMTMpIHtcbiAgICAgIHRoaXMuaGFuZGxlTmV3UHJvamVjdEdvKClcbiAgICB9XG4gIH1cblxuICBoYW5kbGVOZXdQcm9qZWN0R28gKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe25ld1Byb2plY3RMb2FkaW5nOiB0cnVlfSlcbiAgICB2YXIgbmFtZSA9IHRoaXMucmVmcy5uZXdQcm9qZWN0SW5wdXQudmFsdWVcblxuICAgIC8vIEhBQ0s6ICBzdHJpcCBhbGwgbm9uLWFscGhhbnVtZXJpYyBjaGFycyBmb3Igbm93LiAgc29tZXRoaW5nIG1vcmUgdXNlci1mcmllbmRseSB3b3VsZCBiZSBpZGVhbFxuICAgIG5hbWUgPSBuYW1lLnJlcGxhY2UoL1teYS16MC05XS9naSwgJycpXG5cbiAgICB0aGlzLnByb3BzLndlYnNvY2tldC5yZXF1ZXN0KHsgbWV0aG9kOiAnY3JlYXRlUHJvamVjdCcsIHBhcmFtczogW25hbWVdIH0sIChlcnIsIG5ld1Byb2plY3QpID0+IHtcbiAgICAgIGNvbnN0IHByb2plY3RzTGlzdCA9IHRoaXMuc3RhdGUucHJvamVjdHNMaXN0XG4gICAgICB0aGlzLnNldFN0YXRlKHtuZXdQcm9qZWN0TG9hZGluZzogZmFsc2V9KVxuICAgICAgaWYgKGVycikge1xuICAgICAgICBwcm9qZWN0c0xpc3Quc3BsaWNlKDAsIDEpXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyBwcm9qZWN0c0xpc3QgfSlcbiAgICAgICAgdGhpcy5zdGF0ZS5uZXdQcm9qZWN0RXJyb3IgPSBlcnJcbiAgICAgICAgdGhpcy5wcm9wcy5jcmVhdGVOb3RpY2Uoe1xuICAgICAgICAgIHR5cGU6ICdlcnJvcicsXG4gICAgICAgICAgdGl0bGU6ICdPaCBubyEnLFxuICAgICAgICAgIG1lc3NhZ2U6ICdXZSBjb3VsZG5cXCd0IGNyZWF0ZSB5b3VyIHByb2plY3QuIPCfmKkgUGxlYXNlIGVuc3VyZSB0aGF0IHlvdXIgY29tcHV0ZXIgaXMgY29ubmVjdGVkIHRvIHRoZSBJbnRlcm5ldC4gSWYgeW91XFwncmUgY29ubmVjdGVkIGFuZCB5b3Ugc3RpbGwgc2VlIHRoaXMgbWVzc2FnZSBvdXIgc2VydmVycyBtaWdodCBiZSBoYXZpbmcgcHJvYmxlbXMuIFBsZWFzZSB0cnkgYWdhaW4gaW4gYSBmZXcgbW9tZW50cy4gSWYgeW91IHN0aWxsIHNlZSB0aGlzIGVycm9yLCBjb250YWN0IEhhaWt1IGZvciBzdXBwb3J0LicsXG4gICAgICAgICAgY2xvc2VUZXh0OiAnT2theScsXG4gICAgICAgICAgbGlnaHRTY2hlbWU6IHRydWVcbiAgICAgICAgfSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIHN0cmlwIFwibmV3XCIgcHJvamVjdCBmcm9tIHRvcCBvZiBsaXN0LCB1bnNoaWZ0IGFjdHVhbCBuZXcgcHJvamVjdFxuICAgICAgICB2YXIgcGxhY2Vob2xkZXJQcm9qZWN0ID0gcHJvamVjdHNMaXN0LnNwbGljZSgwLCAxKVswXVxuICAgICAgICBuZXdQcm9qZWN0LmlzQWN0aXZlID0gcGxhY2Vob2xkZXJQcm9qZWN0LmlzQWN0aXZlXG4gICAgICAgIHByb2plY3RzTGlzdC51bnNoaWZ0KG5ld1Byb2plY3QpXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe3Byb2plY3RMaXN0OiBwcm9qZWN0c0xpc3R9KVxuICAgICAgICAvLyBhdXRvLWxhdW5jaCBuZXdseSBjcmVhdGVkIHByb2plY3RcbiAgICAgICAgLy8gdGhpcy5oYW5kbGVQcm9qZWN0TGF1bmNoKG5ld1Byb2plY3QpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIHByb2plY3RzTGlzdEVsZW1lbnQgKCkge1xuICAgIGlmICh0aGlzLnN0YXRlLmFyZVByb2plY3RzTG9hZGluZykge1xuICAgICAgcmV0dXJuIDxzcGFuIHN0eWxlPXtEQVNIX1NUWUxFUy5sb2FkaW5nV3JhcH0+PEZhZGluZ0NpcmNsZSBzaXplPXszMn0gY29sb3I9e1BhbGV0dGUuUk9DS19NVVRFRH0gLz48L3NwYW4+XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgc3R5bGU9e3toZWlnaHQ6ICdjYWxjKDEwMCUgLSA3MHB4KScsIG92ZXJmbG93WTogJ2F1dG8nfX0+XG4gICAgICAgIHt0aGlzLnN0YXRlLnByb2plY3RzTGlzdC5tYXAoKHByb2plY3RPYmplY3QsIGluZGV4KSA9PiB7XG4gICAgICAgICAgdmFyIHByb2plY3RUaXRsZVxuICAgICAgICAgIGlmIChwcm9qZWN0T2JqZWN0LmlzTmV3KSB7XG4gICAgICAgICAgICAvLyBJZiB0aGlzIGlzIHRoZSBORVcgUFJPSkVDVCBzbG90LCBzaG93IHRoZSBpbnB1dCBVSVxuXG4gICAgICAgICAgICB2YXIgYnV0dG9uQ29udGVudHMgPSAnR08nXG4gICAgICAgICAgICBpZiAodGhpcy5zdGF0ZS5uZXdQcm9qZWN0TG9hZGluZykgYnV0dG9uQ29udGVudHMgPSA8TG9hZGluZ1NwaW5uZXJTVkcgLz5cblxuICAgICAgICAgICAgcHJvamVjdFRpdGxlID0gKFxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXtbREFTSF9TVFlMRVMucHJvamVjdFRpdGxlTmV3XX0+XG4gICAgICAgICAgICAgICAgPGlucHV0IGtleT0nbmV3LXByb2plY3QtaW5wdXQnXG4gICAgICAgICAgICAgICAgICByZWY9J25ld1Byb2plY3RJbnB1dCdcbiAgICAgICAgICAgICAgICAgIGRpc2FibGVkPXt0aGlzLnN0YXRlLm5ld1Byb2plY3RMb2FkaW5nfVxuICAgICAgICAgICAgICAgICAgb25DbGljaz17dGhpcy5oYW5kbGVOZXdQcm9qZWN0SW5wdXRDbGljay5iaW5kKHRoaXMpfVxuICAgICAgICAgICAgICAgICAgb25LZXlQcmVzcz17dGhpcy5oYW5kbGVOZXdQcm9qZWN0SW5wdXRLZXlQcmVzcy5iaW5kKHRoaXMpfVxuICAgICAgICAgICAgICAgICAgc3R5bGU9e1tEQVNIX1NUWUxFUy5uZXdQcm9qZWN0SW5wdXRdfVxuICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9J05ld1Byb2plY3ROYW1lJyAvPlxuICAgICAgICAgICAgICAgIDxidXR0b24ga2V5PSduZXctcHJvamVjdC1nby1idXR0b24nIGRpc2FibGVkPXt0aGlzLnN0YXRlLm5ld1Byb2plY3RMb2FkaW5nfSBvbkNsaWNrPXt0aGlzLmhhbmRsZU5ld1Byb2plY3RHby5iaW5kKHRoaXMpfSBzdHlsZT17W0RBU0hfU1RZTEVTLm5ld1Byb2plY3RHb0J1dHRvbl19PntidXR0b25Db250ZW50c308L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8c3BhbiBrZXk9J25ldy1wcm9qZWN0LWVycm9yJyBzdHlsZT17W0RBU0hfU1RZTEVTLm5ld1Byb2plY3RFcnJvcl19Pnt0aGlzLnN0YXRlLm5ld1Byb2plY3RFcnJvcn08L3NwYW4+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgKVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBvdGhlcndpc2UsIHNob3cgdGhlIHJlYWQtb25seSBQcm9qZWN0IGxpc3RpbmcgYnV0dG9uXG4gICAgICAgICAgICBwcm9qZWN0VGl0bGUgPSA8c3BhbiBzdHlsZT17W0RBU0hfU1RZTEVTLnByb2plY3RUaXRsZSwgcHJvamVjdE9iamVjdC5pc0FjdGl2ZSAmJiBEQVNIX1NUWUxFUy5hY3RpdmVUaXRsZV19Pntwcm9qZWN0T2JqZWN0LnByb2plY3ROYW1lfTwvc3Bhbj5cbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdiBzdHlsZT17W0RBU0hfU1RZTEVTLnByb2plY3RXcmFwcGVyLCBwcm9qZWN0T2JqZWN0LmlzQWN0aXZlICYmIERBU0hfU1RZTEVTLmFjdGl2ZVdyYXBwZXJdfVxuICAgICAgICAgICAgICBrZXk9e2luZGV4fVxuICAgICAgICAgICAgICBvbkRvdWJsZUNsaWNrPXt0aGlzLmhhbmRsZVByb2plY3RMYXVuY2guYmluZCh0aGlzLCBwcm9qZWN0T2JqZWN0KX1cbiAgICAgICAgICAgICAgb25DbGljaz17dGhpcy5zZXRBY3RpdmVQcm9qZWN0LmJpbmQodGhpcywgcHJvamVjdE9iamVjdCwgaW5kZXgpfT5cbiAgICAgICAgICAgICAgPHNwYW4ga2V5PXtgYS0ke3Byb2plY3RPYmplY3QucHJvamVjdE5hbWV9YH0gc3R5bGU9e1twcm9qZWN0T2JqZWN0LmlzQWN0aXZlICYmIERBU0hfU1RZTEVTLmFjdGl2ZVByb2plY3RdfSAvPlxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17W0RBU0hfU1RZTEVTLmxvZ28sIHByb2plY3RPYmplY3QuaXNBY3RpdmUgJiYgREFTSF9TVFlMRVMubG9nb0FjdGl2ZV19PjxMb2dvU1ZHIC8+PC9zcGFuPlxuICAgICAgICAgICAgICB7cHJvamVjdFRpdGxlfVxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17W0RBU0hfU1RZTEVTLmRhdGUsIHByb2plY3RPYmplY3QuaXNBY3RpdmUgJiYgREFTSF9TVFlMRVMuYWN0aXZlRGF0ZV19PlxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e0RBU0hfU1RZTEVTLmRhdGVUaXRsZX0+ey8qIChwcm9qZWN0T2JqZWN0LnVwZGF0ZWQpID8gJ1VQREFURUQnIDogJycgKi99PC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdj57LyogcHJvamVjdE9iamVjdC51cGRhdGVkICovfTwvZGl2PlxuICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICApXG4gICAgICAgIH0pfVxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgdGl0bGVXcmFwcGVyRWxlbWVudCAoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgc3R5bGU9e0RBU0hfU1RZTEVTLnRpdGxlV3JhcHBlcn0+XG4gICAgICAgIDxzcGFuIHN0eWxlPXtEQVNIX1NUWUxFUy5wcm9qZWN0c1RpdGxlfT5Qcm9qZWN0czwvc3Bhbj5cbiAgICAgICAgPGJ1dHRvbiBzdHlsZT17REFTSF9TVFlMRVMuYnRuTmV3UHJvamVjdH0gb25DbGljaz17dGhpcy5sYXVuY2hOZXdQcm9qZWN0SW5wdXQuYmluZCh0aGlzKX0+KzwvYnV0dG9uPlxuICAgICAgICB7ICF0aGlzLnN0YXRlLmFyZVByb2plY3RzTG9hZGluZyAmJiB0aGlzLnN0YXRlLnByb2plY3RzTGlzdC5sZW5ndGggPT09IDBcbiAgICAgICAgICA/IDxzcGFuIHN0eWxlPXtEQVNIX1NUWUxFUy50b29sdGlwfT48c3BhbiBzdHlsZT17REFTSF9TVFlMRVMuYXJyb3dMZWZ0fSAvPkNyZWF0ZSBhIFByb2plY3Q8L3NwYW4+XG4gICAgICAgICAgOiBudWxsXG4gICAgICAgIH1cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHByb2plY3RFZGl0QnV0dG9uRWxlbWVudCAocHJvamVjdE9iamVjdCkge1xuICAgIHJldHVybiAoXG4gICAgICA8YnV0dG9uXG4gICAgICAgIHN0eWxlPXtEQVNIX1NUWUxFUy5lZGl0UHJvamVjdH1cbiAgICAgICAgZGlzYWJsZWQ9eyEhdGhpcy5zdGF0ZS5sYXVuY2hpbmdQcm9qZWN0fVxuICAgICAgICBvbkNsaWNrPXt0aGlzLmhhbmRsZVByb2plY3RMYXVuY2guYmluZCh0aGlzLCBwcm9qZWN0T2JqZWN0KX1cbiAgICAgICAgaWQ9J3Byb2plY3QtZWRpdC1idXR0b24nPlxuICAgICAgICBPcGVuIEVkaXRvclxuICAgICAgPC9idXR0b24+XG4gICAgKVxuICB9XG5cbiAgcHJvamVjdEZvcm1FbGVtZW50IChwcm9qZWN0T2JqZWN0KSB7XG4gICAgaWYgKCFwcm9qZWN0T2JqZWN0KSB7XG4gICAgICBpZiAodGhpcy5zdGF0ZS5hcmVQcm9qZWN0c0xvYWRpbmcpIHtcbiAgICAgICAgcmV0dXJuIDxkaXYgLz5cbiAgICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0ZS5wcm9qZWN0c0xpc3QubGVuZ3RoID09PSAwICYmICF0aGlzLnN0YXRlLmFyZVByb2plY3RzTG9hZGluZykge1xuICAgICAgICByZXR1cm4gPGRpdiBzdHlsZT17W0RBU0hfU1RZTEVTLmVtcHR5U3RhdGUsIERBU0hfU1RZTEVTLm5vU2VsZWN0XX0+Q3JlYXRlIGEgcHJvamVjdCB0byBiZWdpbjwvZGl2PlxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIDxkaXYgc3R5bGU9e1tEQVNIX1NUWUxFUy5lbXB0eVN0YXRlLCBEQVNIX1NUWUxFUy5ub1NlbGVjdF19PlNlbGVjdCBhIHByb2plY3QgdG8gYmVnaW48L2Rpdj5cbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBpbXBvcnRVcmkgPSBgJHtzbmFrZWl6ZShwcm9qZWN0T2JqZWN0LnByb2plY3ROYW1lKX1gXG4gICAgY29uc3QgY29tbWFuZExpbmVTbmlwcGV0ID0gYGhhaWt1IGluc3RhbGwgJHtpbXBvcnRVcml9YFxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2PlxuICAgICAgICA8ZGl2IHN0eWxlPXtEQVNIX1NUWUxFUy5maWVsZFRpdGxlfT5Qcm9qZWN0IG5hbWU8L2Rpdj5cbiAgICAgICAgPGRpdiBzdHlsZT17e3Bvc2l0aW9uOiAncmVsYXRpdmUnfX0+XG4gICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICBrZXk9J3Byb2plY3RUaXRsZSdcbiAgICAgICAgICAgIHZhbHVlPXtwcm9qZWN0T2JqZWN0LnByb2plY3ROYW1lfVxuICAgICAgICAgICAgc3R5bGU9e0RBU0hfU1RZTEVTLmZpZWxkfVxuICAgICAgICAgICAgcmVhZE9ubHlcbiAgICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZVByb2plY3RUaXRsZUNoYW5nZS5iaW5kKHRoaXMsIHByb2plY3RPYmplY3QpfSAvPlxuICAgICAgICAgIDxzcGFuIHN0eWxlPXtbREFTSF9TVFlMRVMuZmllbGREaWFsb2d1ZSwgdGhpcy5zdGF0ZS5zaG93TmVlZHNTYXZlRGlhbG9ndWUgJiYgREFTSF9TVFlMRVMuZmllbGREaWFsb2d1ZUFjdGl2ZV19PlxuICAgICAgICAgICAgPHNwYW4gc3R5bGU9e0RBU0hfU1RZTEVTLmFycm93VG9wfSAvPlxuICAgICAgICAgICAgVGhpcyBwcm9qZWN0IGhhcyB1bnNhdmVkIGNoYW5nZXMuIFBsZWFzZSBzYXZlIG9yIGRpc2NhcmQgdGhlIGVkaXRzIGJlZm9yZSBzd2l0Y2hpbmcgcHJvamVjdHMuXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt7bWFyZ2luVG9wOiA4fX0+XG4gICAgICAgICAgICAgIDxidXR0b24ga2V5PSdidG4tc2F2ZScgc3R5bGU9e1tEQVNIX1NUWUxFUy5idG4sIERBU0hfU1RZTEVTLmJ0blJpZ2h0XX0+U2F2ZTwvYnV0dG9uPlxuICAgICAgICAgICAgICA8YnV0dG9uIGtleT0nYnRuLWRpc2NhcmQnIHN0eWxlPXtbREFTSF9TVFlMRVMuYnRuLCBEQVNIX1NUWUxFUy5idG5SaWdodCwgREFTSF9TVFlMRVMuYnRuU2Vjb25kYXJ5XX0+RGlzY2FyZDwvYnV0dG9uPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9zcGFuPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBzdHlsZT17REFTSF9TVFlMRVMuZmllbGRUaXRsZX0+SW1wb3J0IGludG8gYSBjb2RlYmFzZSB2aWEgY29tbWFuZCBsaW5lPC9kaXY+XG4gICAgICAgIDxpbnB1dCBrZXk9J3Byb2plY3RJbXBvcnRVcmknIHJlZj0naW1wb3J0SW5wdXQnIG9uQ2xpY2s9e3RoaXMuaGFuZGxlSW1wb3J0SW5wdXRDbGljay5iaW5kKHRoaXMpfSB2YWx1ZT17Y29tbWFuZExpbmVTbmlwcGV0fSBzdHlsZT17W0RBU0hfU1RZTEVTLmZpZWxkLCBEQVNIX1NUWUxFUy5maWVsZE1vbm9dfSByZWFkT25seSAvPlxuICAgICAgICB7dGhpcy5wcm9qZWN0RWRpdEJ1dHRvbkVsZW1lbnQocHJvamVjdE9iamVjdCl9XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICByZW5kZXJOb3RpZmljYXRpb25zIChjb250ZW50LCBpKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxUb2FzdFxuICAgICAgICB0b2FzdFR5cGU9e2NvbnRlbnQudHlwZX1cbiAgICAgICAgdG9hc3RUaXRsZT17Y29udGVudC50aXRsZX1cbiAgICAgICAgdG9hc3RNZXNzYWdlPXtjb250ZW50Lm1lc3NhZ2V9XG4gICAgICAgIGNsb3NlVGV4dD17Y29udGVudC5jbG9zZVRleHR9XG4gICAgICAgIGtleT17aSArIGNvbnRlbnQudGl0bGV9XG4gICAgICAgIG15S2V5PXtpfVxuICAgICAgICByZW1vdmVOb3RpY2U9e3RoaXMucHJvcHMucmVtb3ZlTm90aWNlfVxuICAgICAgICBsaWdodFNjaGVtZT17Y29udGVudC5saWdodFNjaGVtZX0gLz5cbiAgICApXG4gIH1cblxuICByZW5kZXIgKCkge1xuICAgIGNvbnN0IGFjdGl2ZVByb2plY3QgPSBsb2Rhc2guZmluZCh0aGlzLnN0YXRlLnByb2plY3RzTGlzdCwgeyBpc0FjdGl2ZTogdHJ1ZSB9KVxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2PlxuICAgICAgICA8UmVhY3RDU1NUcmFuc2l0aW9uR3JvdXBcbiAgICAgICAgICB0cmFuc2l0aW9uTmFtZT0ndG9hc3QnXG4gICAgICAgICAgdHJhbnNpdGlvbkVudGVyVGltZW91dD17NTAwfVxuICAgICAgICAgIHRyYW5zaXRpb25MZWF2ZVRpbWVvdXQ9ezMwMH0+XG4gICAgICAgICAgPGRpdiBzdHlsZT17e3Bvc2l0aW9uOiAnYWJzb2x1dGUnLCByaWdodDogMCwgdG9wOiAwLCB3aWR0aDogMzAwfX0+XG4gICAgICAgICAgICB7bG9kYXNoLm1hcCh0aGlzLnByb3BzLm5vdGljZXMsIHRoaXMucmVuZGVyTm90aWZpY2F0aW9ucyl9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvUmVhY3RDU1NUcmFuc2l0aW9uR3JvdXA+XG4gICAgICAgIDxkaXYgc3R5bGU9e1tEQVNIX1NUWUxFUy5kYXNoTGV2ZWxXcmFwcGVyLCBEQVNIX1NUWUxFUy5hcHBlYXJEYXNoTGV2ZWxdfT5cbiAgICAgICAgICA8ZGl2IHN0eWxlPXtEQVNIX1NUWUxFUy5mcmFtZX0gY2xhc3NOYW1lPSdmcmFtZScgLz5cbiAgICAgICAgICA8ZGl2IHN0eWxlPXtEQVNIX1NUWUxFUy5wcm9qZWN0c0Jhcn0+XG4gICAgICAgICAgICB7dGhpcy50aXRsZVdyYXBwZXJFbGVtZW50KCl9XG4gICAgICAgICAgICB7dGhpcy5wcm9qZWN0c0xpc3RFbGVtZW50KCl9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBzdHlsZT17REFTSF9TVFlMRVMuZGV0YWlsc30+XG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXtEQVNIX1NUWUxFUy5jZW50ZXJDb2x9PlxuICAgICAgICAgICAgICB7YWN0aXZlUHJvamVjdCAmJiBhY3RpdmVQcm9qZWN0LmlzTmV3XG4gICAgICAgICAgICAgICAgPyA8c3BhbiAvPlxuICAgICAgICAgICAgICAgIDogdGhpcy5wcm9qZWN0Rm9ybUVsZW1lbnQoYWN0aXZlUHJvamVjdCl9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIHt0aGlzLnN0YXRlLmxhdW5jaGluZ1Byb2plY3RcbiAgICAgICAgICA/IDxkaXYgc3R5bGU9e0RBU0hfU1RZTEVTLmZ1bGxTY3JlZW5DZW50ZXJXcmFwfT5cbiAgICAgICAgICAgIDxGYWRpbmdDaXJjbGUgc2l6ZT17NTJ9IGNvbG9yPXtQYWxldHRlLlJPQ0t9IC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgOiAnJyB9XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cbn1cblxuZnVuY3Rpb24gc25ha2VpemUgKHN0cikge1xuICBzdHIgPSBzdHIgfHwgJydcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC8gL2csICdfJylcbn1cblxuLy8gZnVuY3Rpb24gdW5pcXVlUHJvamVjdFRpdGxlIChwcm9qZWN0c0xpc3QsIHRpdGxlKSB7XG4vLyAgIGNvbnN0IG1hdGNoZWRQcm9qZWN0cyA9IGZpbHRlcihwcm9qZWN0c0xpc3QsIHsgdGl0bGUgfSlcbi8vICAgaWYgKG1hdGNoZWRQcm9qZWN0cy5sZW5ndGggPCAxKSByZXR1cm4gdGl0bGVcbi8vICAgLy8gVE9ETzogUGxlYXNlIG1ha2UgdGhpcyBhbGdvcml0aG0gcm9idXN0XG4vLyAgIHJldHVybiBgJHt0aXRsZX0gJHtwcm9qZWN0c0xpc3QubGVuZ3RoICsgMX1gXG4vLyB9XG5cbmV4cG9ydCBkZWZhdWx0IFJhZGl1bShQcm9qZWN0QnJvd3NlcilcbiJdfQ==