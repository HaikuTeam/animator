'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _jsxFileName = 'src/react/components/StageTitleBar.js';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _electron = require('electron');

var _radium = require('radium');

var _radium2 = _interopRequireDefault(_radium);

var _reactPopover = require('react-popover');

var _reactPopover2 = _interopRequireDefault(_reactPopover);

var _lodash = require('lodash.assign');

var _lodash2 = _interopRequireDefault(_lodash);

var _Palette = require('./Palette');

var _Palette2 = _interopRequireDefault(_Palette);

var _betterReactSpinkit = require('better-react-spinkit');

var _color = require('color');

var _color2 = _interopRequireDefault(_color);

var _btnShared = require('../styles/btnShared');

var _reactCopyToClipboard = require('react-copy-to-clipboard');

var _reactCopyToClipboard2 = _interopRequireDefault(_reactCopyToClipboard);

var _ToolSelector = require('./ToolSelector');

var _ToolSelector2 = _interopRequireDefault(_ToolSelector);

var _Icons = require('./Icons');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var mixpanel = require('./../../utils/Mixpanel');

var STYLES = {
  hide: {
    display: 'none'
  },
  frame: {
    backgroundColor: _Palette2.default.COAL,
    position: 'relative',
    top: 0,
    zIndex: 1,
    height: '36px',
    padding: '6px'
  },
  disabled: {
    opacity: 0.5,
    cursor: 'not-allowed'
  },
  sharePopover: {
    position: 'absolute',
    top: 34,
    backgroundColor: _Palette2.default.FATHER_COAL,
    width: 204,
    padding: '13px 9px',
    fontSize: 17,
    color: _Palette2.default.ROCK,
    textAlign: 'center',
    borderRadius: 4,
    boxShadow: '0 6px 25px 0 ' + _Palette2.default.FATHER_COAL
  },
  popoverClose: {
    color: 'white',
    position: 'absolute',
    top: 5,
    right: 10,
    fontSize: 15,
    textTransform: 'lowercase'
  },
  footer: {
    backgroundColor: (0, _color2.default)(_Palette2.default.DARK_GRAY).fade(0.7),
    height: 25,
    width: '100%',
    position: 'absolute',
    bottom: 0,
    fontSize: 10,
    borderBottomRightRadius: 3,
    borderBottomLeftRadius: 3,
    paddingTop: 5
  },
  time: {
    fontWeight: 'bold',
    marginLeft: 5
  },
  copy: {
    position: 'absolute',
    height: '100%',
    width: 25,
    right: 0,
    paddingTop: 2,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: _Palette2.default.DARK_GRAY
  },
  copyLoading: {
    paddingTop: 0,
    paddingBottom: 6,
    pointerEvents: 'none'
  },
  linkHolster: {
    height: 29,
    position: 'relative',
    borderRadius: 3,
    marginTop: 3,
    cursor: 'pointer',
    backgroundColor: (0, _color2.default)(_Palette2.default.DARK_GRAY).fade(0.68),
    border: '1px solid ' + _Palette2.default.DARK_GRAY

  },
  link: {
    fontSize: 10,
    color: (0, _color2.default)(_Palette2.default.LIGHT_BLUE).lighten(0.37),
    position: 'absolute',
    left: 7,
    top: 7,
    cursor: 'pointer'
  },
  generatingLink: {
    color: _Palette2.default.ROCK,
    cursor: 'default',
    fontStyle: 'italic'
  }
};

var SNAPSHOT_SAVE_RESOLUTION_STRATEGIES = {
  normal: { strategy: 'recursive', favor: 'ours' },
  ours: { strategy: 'ours' },
  theirs: { strategy: 'theirs' }
};

var PopoverBody = function (_React$Component) {
  _inherits(PopoverBody, _React$Component);

  function PopoverBody() {
    _classCallCheck(this, PopoverBody);

    return _possibleConstructorReturn(this, (PopoverBody.__proto__ || Object.getPrototypeOf(PopoverBody)).apply(this, arguments));
  }

  _createClass(PopoverBody, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps) {
      return this.props.titleText !== nextProps.titleText || this.props.linkAddress !== nextProps.linkAddress || this.props.isSnapshotSaveInProgress !== nextProps.isSnapshotSaveInProgress || this.props.snapshotSaveConfirmed !== nextProps.snapshotSaveConfirmed || this.props.isProjectInfoFetchInProgress !== nextProps.isProjectInfoFetchInProgress;
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var popoverPosition = void 0;

      if (this.props.snapshotSaveConfirmed) {
        popoverPosition = -72;
      } else if (this.props.isSnapshotSaveInProgress) {
        popoverPosition = -70;
      } else {
        popoverPosition = -59;
      }

      return _react2.default.createElement(
        'div',
        { style: [STYLES.sharePopover, { right: popoverPosition }], __source: {
            fileName: _jsxFileName,
            lineNumber: 146
          },
          __self: this
        },
        _react2.default.createElement(
          'button',
          { style: STYLES.popoverClose, onClick: this.props.close, __source: {
              fileName: _jsxFileName,
              lineNumber: 147
            },
            __self: this
          },
          'x'
        ),
        this.props.titleText,
        _react2.default.createElement(
          'div',
          { style: STYLES.linkHolster, __source: {
              fileName: _jsxFileName,
              lineNumber: 149
            },
            __self: this
          },
          this.props.isSnapshotSaveInProgress || this.props.isProjectInfoFetchInProgress ? _react2.default.createElement(
            'span',
            { style: [STYLES.link, STYLES.generatingLink], __source: {
                fileName: _jsxFileName,
                lineNumber: 151
              },
              __self: this
            },
            'Updating Share Page'
          ) : _react2.default.createElement(
            'span',
            { style: STYLES.link, onClick: function onClick() {
                return _electron.shell.openExternal(_this2.props.linkAddress);
              }, __source: {
                fileName: _jsxFileName,
                lineNumber: 152
              },
              __self: this
            },
            this.props.linkAddress.substring(0, 33)
          ),
          _react2.default.createElement(
            _reactCopyToClipboard2.default,
            {
              text: this.props.linkAddress,
              onCopy: function onCopy() {
                _this2.props.parent.setState({ copied: true });
                _this2.props.parent.setState({ showCopied: true }, function () {
                  setTimeout(function () {
                    _this2.props.parent.setState({ showCopied: false });
                  }, 1900);
                });
              }, __source: {
                fileName: _jsxFileName,
                lineNumber: 153
              },
              __self: this
            },
            this.props.isSnapshotSaveInProgress || this.props.isProjectInfoFetchInProgress ? _react2.default.createElement(
              'span',
              { style: [STYLES.copy, STYLES.copyLoading], __source: {
                  fileName: _jsxFileName,
                  lineNumber: 164
                },
                __self: this
              },
              _react2.default.createElement(_betterReactSpinkit.ThreeBounce, { size: 3, color: _Palette2.default.ROCK, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 164
                },
                __self: this
              })
            ) : _react2.default.createElement(
              'span',
              { style: STYLES.copy, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 165
                },
                __self: this
              },
              _react2.default.createElement(_Icons.CliboardIconSVG, {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 165
                },
                __self: this
              })
            )
          )
        )
      );
    }
  }]);

  return PopoverBody;
}(_react2.default.Component);

var PopoverBodyRadiumized = (0, _radium2.default)(PopoverBody);

var StageTitleBar = function (_React$Component2) {
  _inherits(StageTitleBar, _React$Component2);

  function StageTitleBar(props) {
    _classCallCheck(this, StageTitleBar);

    var _this3 = _possibleConstructorReturn(this, (StageTitleBar.__proto__ || Object.getPrototypeOf(StageTitleBar)).call(this, props));

    _this3.handleConnectionClick = _this3.handleConnectionClick.bind(_this3);
    _this3.handleUndoClick = _this3.handleUndoClick.bind(_this3);
    _this3.handleRedoClick = _this3.handleRedoClick.bind(_this3);
    _this3.handleSaveSnapshotClick = _this3.handleSaveSnapshotClick.bind(_this3);
    _this3.handleMergeResolveOurs = _this3.handleMergeResolveOurs.bind(_this3);
    _this3.handleMergeResolveTheirs = _this3.handleMergeResolveTheirs.bind(_this3);
    _this3._isMounted = false;
    _this3.state = {
      snapshotSaveResolutionStrategyName: 'normal',
      isSnapshotSaveInProgress: false,
      snapshotMergeConflicts: null,
      snapshotSaveConfirmed: null,
      snapshotSaveError: null,
      showSharePopover: false,
      copied: false,
      linkAddress: 'Fetching Info',
      showCopied: false,
      projectInfoFetchError: null,
      isProjectInfoFetchInProgress: false,
      projectInfo: null,
      gitUndoables: [],
      gitRedoables: []
    };
    return _this3;
  }

  _createClass(StageTitleBar, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      this._isMounted = true;
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this4 = this;

      this.performProjectInfoFetch();

      // It's kind of weird to have this heartbeat logic buried all the way down here inside StateTitleBar;
      // it probably should be moved up to the Creator level so it's easier to find #FIXME
      this._fetchMasterStateInterval = setInterval(function () {
        return _this4.props.websocket.request({ method: 'masterHeartbeat', params: [_this4.props.folder] }, function (heartbeatErr, masterState) {
          if (heartbeatErr || !masterState) {
            // If master disconnects we might not even get an error, so create a fake error in its place
            if (!heartbeatErr) heartbeatErr = new Error('Unknown problem with master heartbeat');
            console.error(heartbeatErr);

            // If master has disconnected, stop running this interval so we don't get pulsing error messages
            clearInterval(_this4._fetchMasterStateInterval);

            // But the first time we get this, display a user notice - they probably need to restart Haiku to get
            // into a better state, at least until we can resolve what the cause of this problem is
            return _this4.props.createNotice({
              type: 'danger',
              title: 'Uh oh!',
              message: 'Haiku is having a problem accessing your project. 😢 Please restart Haiku. If you see this error again, contact Haiku for support.'
            });
          }

          _electron.ipcRenderer.send('master:heartbeat', (0, _lodash2.default)({}, masterState));

          if (_this4._isMounted) {
            _this4.setState({
              gitUndoables: masterState.gitUndoables,
              gitRedoables: masterState.gitRedoables
            });
          }
        });
      }, 1000);

      _electron.ipcRenderer.on('global-menu:save', function () {
        _this4.handleSaveSnapshotClick();
      });
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this._isMounted = false;
      clearInterval(this._fetchMasterStateInterval);
    }
  }, {
    key: 'handleConnectionClick',
    value: function handleConnectionClick() {
      // TODO
    }
  }, {
    key: 'handleUndoClick',
    value: function handleUndoClick() {
      var _this5 = this;

      return this.props.websocket.request({ method: 'gitUndo', params: [this.props.folder, { type: 'global' }] }, function (err) {
        if (err) {
          console.error(err);
          return _this5.props.createNotice({
            type: 'warning',
            title: 'Uh oh!',
            message: 'We were unable to undo your last action. 😢 Please contact Haiku for support.'
          });
        }
      });
    }
  }, {
    key: 'handleRedoClick',
    value: function handleRedoClick() {
      var _this6 = this;

      return this.props.websocket.request({ method: 'gitRedo', params: [this.props.folder, { type: 'global' }] }, function (err) {
        if (err) {
          console.error(err);
          return _this6.props.createNotice({
            type: 'warning',
            title: 'Uh oh!',
            message: 'We were unable to redo your last action. 😢 Please contact Haiku for support.'
          });
        }
      });
    }
  }, {
    key: 'getProjectSaveOptions',
    value: function getProjectSaveOptions() {
      return {
        commitMessage: 'Changes saved (via Haiku Desktop)',
        saveStrategy: SNAPSHOT_SAVE_RESOLUTION_STRATEGIES[this.state.snapshotSaveResolutionStrategyName]
      };
    }
  }, {
    key: 'handleSaveSnapshotClick',
    value: function handleSaveSnapshotClick() {
      if (this.state.snapshotSaveError) return void 0;
      if (this.state.isSnapshotSaveInProgress) return void 0;
      if (this.state.snapshotMergeConflicts) return void 0;
      if (this.state.showSharePopover) return void 0;

      this.setState({ showSharePopover: !this.state.showSharePopover });

      if (this.props.tourClient) this.props.tourClient.next();

      return this.performProjectSave();
    }
  }, {
    key: 'performProjectInfoFetch',
    value: function performProjectInfoFetch() {
      var _this7 = this;

      this.setState({ isProjectInfoFetchInProgress: true });
      return this.props.websocket.request({ method: 'fetchProjectInfo', params: [this.props.folder, this.props.project.projectName, this.props.username, this.props.password, {}] }, function (projectInfoFetchError, projectInfo) {
        _this7.setState({ isProjectInfoFetchInProgress: false });

        if (projectInfoFetchError) {
          if (projectInfoFetchError.message) {
            console.error(projectInfoFetchError.message);
          } else {
            console.error('unknown problem fetching project');
          }

          // We might only care about this if it comes up during a save... #FIXME ??
          if (projectInfoFetchError.message === 'Timed out waiting for project share info') {
            // ?
            return void 0; // Gotta return here - don't want to fall through as though we actually got projectInfo below
          } else {
            return _this7.setState({ projectInfoFetchError: projectInfoFetchError });
          }
        }

        _this7.setState({ projectInfo: projectInfo });
        if (_this7.props.receiveProjectInfo) _this7.props.receiveProjectInfo(projectInfo);
        if (projectInfo.shareLink) _this7.setState({ linkAddress: projectInfo.shareLink });
      });
    }
  }, {
    key: 'withProjectInfo',
    value: function withProjectInfo(otherObject) {
      var proj = this.state.projectInfo || {};
      return (0, _lodash2.default)({}, otherObject, {
        organization: proj.organizationName,
        uuid: proj.projectUid,
        sha: proj.sha,
        branch: proj.branchName
      });
    }
  }, {
    key: 'requestSaveProject',
    value: function requestSaveProject(cb) {
      return this.props.websocket.request({ method: 'saveProject', params: [this.props.folder, this.props.project.projectName, this.props.username, this.props.password, this.getProjectSaveOptions()] }, cb);
    }
  }, {
    key: 'performProjectSave',
    value: function performProjectSave() {
      var _this8 = this;

      mixpanel.haikuTrack('creator:project:saving', this.withProjectInfo({
        username: this.props.username,
        project: this.props.projectName
      }));
      this.setState({ isSnapshotSaveInProgress: true });

      return this.requestSaveProject(function (snapshotSaveError, snapshotData) {
        if (snapshotSaveError) {
          console.error(snapshotSaveError);
          if (snapshotSaveError.message === 'Timed out waiting for project share info') {
            _this8.props.createNotice({
              type: 'warning',
              title: 'Hmm...',
              message: 'Publishing your project seems to be taking a long time. 😢 Please try again in a few moments. If you see this message again, contact Haiku for support.'
            });
          } else {
            _this8.props.createNotice({
              type: 'danger',
              title: 'Oh no!',
              message: 'We were unable to publish your project. 😢 Please try again in a few moments. If you still see this error, contact Haiku for support.'
            });
          }
          return _this8.setState({ isSnapshotSaveInProgress: false, snapshotSaveResolutionStrategyName: 'normal', snapshotSaveError: snapshotSaveError }, function () {
            return setTimeout(function () {
              return _this8.setState({ snapshotSaveError: null });
            }, 2000);
          });
        }

        _this8.setState({ isSnapshotSaveInProgress: false, snapshotSaveConfirmed: true });

        if (snapshotData) {
          if (snapshotData.conflicts) {
            console.warn('[creator] Merge conflicts found!');
            _this8.props.createNotice({
              type: 'warning',
              title: 'Merge conflicts!',
              message: 'We couldn\'t merge your changes. 😢 You\'ll need to decide how to merge your changes before continuing.'
            });
            return _this8.setState({
              snapshotMergeConflicts: snapshotData.conflicts,
              showSharePopover: false
            });
          }

          console.info('[creator] Save complete', snapshotData);

          // Unless we set back to normal, subsequent saves will still be set to use the strict ours/theirs strategy,
          // which will clobber updates that we might want to actually merge gracefully.
          _this8.setState({ snapshotSaveResolutionStrategyName: 'normal' });

          if (snapshotData.shareLink) {
            _this8.setState({ linkAddress: snapshotData.shareLink });
          }

          mixpanel.haikuTrack('creator:project:saved', _this8.withProjectInfo({
            username: _this8.props.username,
            project: _this8.props.projectName
          }));
        }

        return setTimeout(function () {
          return _this8.setState({ snapshotSaveConfirmed: false });
        }, 2000);
      });
    }
  }, {
    key: 'renderSnapshotSaveInnerButton',
    value: function renderSnapshotSaveInnerButton() {
      if (this.state.snapshotSaveError) return _react2.default.createElement(
        'div',
        { style: { height: 18, marginRight: -5 }, __source: {
            fileName: _jsxFileName,
            lineNumber: 409
          },
          __self: this
        },
        _react2.default.createElement(_Icons.DangerIconSVG, { fill: 'transparent', __source: {
            fileName: _jsxFileName,
            lineNumber: 409
          },
          __self: this
        })
      );
      if (this.state.snapshotMergeConflicts) return _react2.default.createElement(
        'div',
        { style: { height: 19, marginRight: 0, marginTop: -2 }, __source: {
            fileName: _jsxFileName,
            lineNumber: 410
          },
          __self: this
        },
        _react2.default.createElement(_Icons.WarningIconSVG, { fill: 'transparent', color: _Palette2.default.ORANGE, __source: {
            fileName: _jsxFileName,
            lineNumber: 410
          },
          __self: this
        })
      );
      if (this.state.snapshotSaveConfirmed) return _react2.default.createElement(
        'div',
        { style: { height: 18 }, __source: {
            fileName: _jsxFileName,
            lineNumber: 411
          },
          __self: this
        },
        _react2.default.createElement(_Icons.SuccessIconSVG, { viewBox: '0 0 14 14', fill: 'transparent', __source: {
            fileName: _jsxFileName,
            lineNumber: 411
          },
          __self: this
        })
      );
      return _react2.default.createElement(_Icons.PublishSnapshotSVG, {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 412
        },
        __self: this
      });
    }
  }, {
    key: 'handleMergeResolveOurs',
    value: function handleMergeResolveOurs() {
      var _this9 = this;

      this.setState({ snapshotMergeConflicts: null, snapshotSaveResolutionStrategyName: 'ours' }, function () {
        return _this9.performProjectSave();
      });
    }
  }, {
    key: 'handleMergeResolveTheirs',
    value: function handleMergeResolveTheirs() {
      var _this10 = this;

      this.setState({ snapshotMergeConflicts: null, snapshotSaveResolutionStrategyName: 'theirs' }, function () {
        return _this10.performProjectSave();
      });
    }
  }, {
    key: 'renderMergeConflictResolutionArea',
    value: function renderMergeConflictResolutionArea() {
      if (!this.state.snapshotMergeConflicts) return '';
      return _react2.default.createElement(
        'div',
        { style: { position: 'absolute', left: 0, right: 150, top: 4, padding: 5, borderRadius: 4, color: _Palette2.default.ROCK, textAlign: 'right', overflow: 'hidden' }, __source: {
            fileName: _jsxFileName,
            lineNumber: 430
          },
          __self: this
        },
        'Conflict found!',
        ' ',
        _react2.default.createElement(
          'a',
          { onClick: this.handleMergeResolveOurs, style: { cursor: 'pointer', textDecoration: 'underline', color: _Palette2.default.GREEN }, __source: {
              fileName: _jsxFileName,
              lineNumber: 432
            },
            __self: this
          },
          'Force your changes'
        ),
        ' ',
        'or ',
        _react2.default.createElement(
          'a',
          { onClick: this.handleMergeResolveTheirs, style: { cursor: 'pointer', textDecoration: 'underline', color: _Palette2.default.RED }, __source: {
              fileName: _jsxFileName,
              lineNumber: 433
            },
            __self: this
          },
          'discard yours & accept theirs'
        ),
        '?'
      );
    }
  }, {
    key: 'hoverStyleForSaveButton',
    value: function hoverStyleForSaveButton() {
      if (this.state.isSnapshotSaveInProgress) return null;
      if (this.state.snapshotSaveError) return null;
      if (this.state.snapshotMergeConflicts) return null;
      if (this.state.snapshotSaveConfirmed) return null;
      return _btnShared.BTN_STYLES.btnIconHover;
    }
  }, {
    key: 'render',
    value: function render() {
      var _this11 = this;

      var showSharePopover = this.state.showSharePopover;

      var titleText = this.state.showCopied ? 'Copied' : 'Share & Embed';

      var btnText = 'PUBLISH';
      if (this.state.snapshotSaveConfirmed) btnText = 'PUBLISHED';
      if (this.state.isSnapshotSaveInProgress) btnText = 'PUBLISHING';

      return _react2.default.createElement(
        'div',
        { style: STYLES.frame, className: 'frame', __source: {
            fileName: _jsxFileName,
            lineNumber: 457
          },
          __self: this
        },
        _react2.default.createElement(
          _reactPopover2.default,
          {
            place: 'below',
            isOpen: showSharePopover,
            body: _react2.default.createElement(PopoverBodyRadiumized, {
              parent: this,
              titleText: titleText,
              snapshotSaveConfirmed: this.state.snapshotSaveConfirmed,
              isSnapshotSaveInProgress: this.state.isSnapshotSaveInProgress,
              isProjectInfoFetchInProgress: this.state.isProjectInfoFetchInProgress,
              linkAddress: this.state.linkAddress,
              close: function close() {
                return _this11.setState({ showSharePopover: false });
              }, __source: {
                fileName: _jsxFileName,
                lineNumber: 462
              },
              __self: this
            }), __source: {
              fileName: _jsxFileName,
              lineNumber: 458
            },
            __self: this
          },
          _react2.default.createElement(
            'button',
            { key: 'save',
              id: 'publish',
              onClick: this.handleSaveSnapshotClick,
              style: [_btnShared.BTN_STYLES.btnText, _btnShared.BTN_STYLES.rightBtns, this.state.isSnapshotSaveInProgress && STYLES.disabled], __source: {
                fileName: _jsxFileName,
                lineNumber: 471
              },
              __self: this
            },
            this.renderSnapshotSaveInnerButton(),
            _react2.default.createElement(
              'span',
              { style: { marginLeft: 7 }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 479
                },
                __self: this
              },
              btnText
            )
          )
        ),
        this.renderMergeConflictResolutionArea(),
        _react2.default.createElement(
          'button',
          { onClick: this.handleConnectionClick, style: [_btnShared.BTN_STYLES.btnIcon, _btnShared.BTN_STYLES.btnIconHover, STYLES.hide], key: 'connect', __source: {
              fileName: _jsxFileName,
              lineNumber: 484
            },
            __self: this
          },
          _react2.default.createElement(_Icons.ConnectionIconSVG, {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 485
            },
            __self: this
          })
        ),
        false && _react2.default.createElement(_ToolSelector2.default, { websocket: this.props.websocket, __source: {
            fileName: _jsxFileName,
            lineNumber: 489
          },
          __self: this
        })
      );
    }
  }]);

  return StageTitleBar;
}(_react2.default.Component);

StageTitleBar.propTypes = {
  folder: _react2.default.PropTypes.string.isRequired,
  projectName: _react2.default.PropTypes.string,
  username: _react2.default.PropTypes.string,
  password: _react2.default.PropTypes.string,
  websocket: _react2.default.PropTypes.object.isRequired,
  createNotice: _react2.default.PropTypes.func.isRequired,
  removeNotice: _react2.default.PropTypes.func.isRequired,
  receiveProjectInfo: _react2.default.PropTypes.func
};

exports.default = (0, _radium2.default)(StageTitleBar);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9yZWFjdC9jb21wb25lbnRzL1N0YWdlVGl0bGVCYXIuanMiXSwibmFtZXMiOlsibWl4cGFuZWwiLCJyZXF1aXJlIiwiU1RZTEVTIiwiaGlkZSIsImRpc3BsYXkiLCJmcmFtZSIsImJhY2tncm91bmRDb2xvciIsIkNPQUwiLCJwb3NpdGlvbiIsInRvcCIsInpJbmRleCIsImhlaWdodCIsInBhZGRpbmciLCJkaXNhYmxlZCIsIm9wYWNpdHkiLCJjdXJzb3IiLCJzaGFyZVBvcG92ZXIiLCJGQVRIRVJfQ09BTCIsIndpZHRoIiwiZm9udFNpemUiLCJjb2xvciIsIlJPQ0siLCJ0ZXh0QWxpZ24iLCJib3JkZXJSYWRpdXMiLCJib3hTaGFkb3ciLCJwb3BvdmVyQ2xvc2UiLCJyaWdodCIsInRleHRUcmFuc2Zvcm0iLCJmb290ZXIiLCJEQVJLX0dSQVkiLCJmYWRlIiwiYm90dG9tIiwiYm9yZGVyQm90dG9tUmlnaHRSYWRpdXMiLCJib3JkZXJCb3R0b21MZWZ0UmFkaXVzIiwicGFkZGluZ1RvcCIsInRpbWUiLCJmb250V2VpZ2h0IiwibWFyZ2luTGVmdCIsImNvcHkiLCJqdXN0aWZ5Q29udGVudCIsImFsaWduSXRlbXMiLCJjb3B5TG9hZGluZyIsInBhZGRpbmdCb3R0b20iLCJwb2ludGVyRXZlbnRzIiwibGlua0hvbHN0ZXIiLCJtYXJnaW5Ub3AiLCJib3JkZXIiLCJsaW5rIiwiTElHSFRfQkxVRSIsImxpZ2h0ZW4iLCJsZWZ0IiwiZ2VuZXJhdGluZ0xpbmsiLCJmb250U3R5bGUiLCJTTkFQU0hPVF9TQVZFX1JFU09MVVRJT05fU1RSQVRFR0lFUyIsIm5vcm1hbCIsInN0cmF0ZWd5IiwiZmF2b3IiLCJvdXJzIiwidGhlaXJzIiwiUG9wb3ZlckJvZHkiLCJuZXh0UHJvcHMiLCJwcm9wcyIsInRpdGxlVGV4dCIsImxpbmtBZGRyZXNzIiwiaXNTbmFwc2hvdFNhdmVJblByb2dyZXNzIiwic25hcHNob3RTYXZlQ29uZmlybWVkIiwiaXNQcm9qZWN0SW5mb0ZldGNoSW5Qcm9ncmVzcyIsInBvcG92ZXJQb3NpdGlvbiIsImNsb3NlIiwib3BlbkV4dGVybmFsIiwic3Vic3RyaW5nIiwicGFyZW50Iiwic2V0U3RhdGUiLCJjb3BpZWQiLCJzaG93Q29waWVkIiwic2V0VGltZW91dCIsIkNvbXBvbmVudCIsIlBvcG92ZXJCb2R5UmFkaXVtaXplZCIsIlN0YWdlVGl0bGVCYXIiLCJoYW5kbGVDb25uZWN0aW9uQ2xpY2siLCJiaW5kIiwiaGFuZGxlVW5kb0NsaWNrIiwiaGFuZGxlUmVkb0NsaWNrIiwiaGFuZGxlU2F2ZVNuYXBzaG90Q2xpY2siLCJoYW5kbGVNZXJnZVJlc29sdmVPdXJzIiwiaGFuZGxlTWVyZ2VSZXNvbHZlVGhlaXJzIiwiX2lzTW91bnRlZCIsInN0YXRlIiwic25hcHNob3RTYXZlUmVzb2x1dGlvblN0cmF0ZWd5TmFtZSIsInNuYXBzaG90TWVyZ2VDb25mbGljdHMiLCJzbmFwc2hvdFNhdmVFcnJvciIsInNob3dTaGFyZVBvcG92ZXIiLCJwcm9qZWN0SW5mb0ZldGNoRXJyb3IiLCJwcm9qZWN0SW5mbyIsImdpdFVuZG9hYmxlcyIsImdpdFJlZG9hYmxlcyIsInBlcmZvcm1Qcm9qZWN0SW5mb0ZldGNoIiwiX2ZldGNoTWFzdGVyU3RhdGVJbnRlcnZhbCIsInNldEludGVydmFsIiwid2Vic29ja2V0IiwicmVxdWVzdCIsIm1ldGhvZCIsInBhcmFtcyIsImZvbGRlciIsImhlYXJ0YmVhdEVyciIsIm1hc3RlclN0YXRlIiwiRXJyb3IiLCJjb25zb2xlIiwiZXJyb3IiLCJjbGVhckludGVydmFsIiwiY3JlYXRlTm90aWNlIiwidHlwZSIsInRpdGxlIiwibWVzc2FnZSIsInNlbmQiLCJvbiIsImVyciIsImNvbW1pdE1lc3NhZ2UiLCJzYXZlU3RyYXRlZ3kiLCJ0b3VyQ2xpZW50IiwibmV4dCIsInBlcmZvcm1Qcm9qZWN0U2F2ZSIsInByb2plY3QiLCJwcm9qZWN0TmFtZSIsInVzZXJuYW1lIiwicGFzc3dvcmQiLCJyZWNlaXZlUHJvamVjdEluZm8iLCJzaGFyZUxpbmsiLCJvdGhlck9iamVjdCIsInByb2oiLCJvcmdhbml6YXRpb24iLCJvcmdhbml6YXRpb25OYW1lIiwidXVpZCIsInByb2plY3RVaWQiLCJzaGEiLCJicmFuY2giLCJicmFuY2hOYW1lIiwiY2IiLCJnZXRQcm9qZWN0U2F2ZU9wdGlvbnMiLCJoYWlrdVRyYWNrIiwid2l0aFByb2plY3RJbmZvIiwicmVxdWVzdFNhdmVQcm9qZWN0Iiwic25hcHNob3REYXRhIiwiY29uZmxpY3RzIiwid2FybiIsImluZm8iLCJtYXJnaW5SaWdodCIsIk9SQU5HRSIsIm92ZXJmbG93IiwidGV4dERlY29yYXRpb24iLCJHUkVFTiIsIlJFRCIsImJ0bkljb25Ib3ZlciIsImJ0blRleHQiLCJyaWdodEJ0bnMiLCJyZW5kZXJTbmFwc2hvdFNhdmVJbm5lckJ1dHRvbiIsInJlbmRlck1lcmdlQ29uZmxpY3RSZXNvbHV0aW9uQXJlYSIsImJ0bkljb24iLCJwcm9wVHlwZXMiLCJQcm9wVHlwZXMiLCJzdHJpbmciLCJpc1JlcXVpcmVkIiwib2JqZWN0IiwiZnVuYyIsInJlbW92ZU5vdGljZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOztBQUNBOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7O0FBV0EsSUFBSUEsV0FBV0MsUUFBUSx3QkFBUixDQUFmOztBQUVBLElBQU1DLFNBQVM7QUFDYkMsUUFBTTtBQUNKQyxhQUFTO0FBREwsR0FETztBQUliQyxTQUFPO0FBQ0xDLHFCQUFpQixrQkFBUUMsSUFEcEI7QUFFTEMsY0FBVSxVQUZMO0FBR0xDLFNBQUssQ0FIQTtBQUlMQyxZQUFRLENBSkg7QUFLTEMsWUFBUSxNQUxIO0FBTUxDLGFBQVM7QUFOSixHQUpNO0FBWWJDLFlBQVU7QUFDUkMsYUFBUyxHQUREO0FBRVJDLFlBQVE7QUFGQSxHQVpHO0FBZ0JiQyxnQkFBYztBQUNaUixjQUFVLFVBREU7QUFFWkMs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QTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBaENKLE9BREY7QUFzQ0Q7Ozs7RUE5VHlCLGdCQUFNdkIsUzs7QUFpVWxDRSxjQUFjZ0YsU0FBZCxHQUEwQjtBQUN4QnZELFVBQVEsZ0JBQU13RCxTQUFOLENBQWdCQyxNQUFoQixDQUF1QkMsVUFEUDtBQUV4QnRDLGVBQWEsZ0JBQU1vQyxTQUFOLENBQWdCQyxNQUZMO0FBR3hCcEMsWUFBVSxnQkFBTW1DLFNBQU4sQ0FBZ0JDLE1BSEY7QUFJeEJuQyxZQUFVLGdCQUFNa0MsU0FBTixDQUFnQkMsTUFKRjtBQUt4QjdELGFBQVcsZ0JBQU00RCxTQUFOLENBQWdCRyxNQUFoQixDQUF1QkQsVUFMVjtBQU14Qm5ELGdCQUFjLGdCQUFNaUQsU0FBTixDQUFnQkksSUFBaEIsQ0FBcUJGLFVBTlg7QUFPeEJHLGdCQUFjLGdCQUFNTCxTQUFOLENBQWdCSSxJQUFoQixDQUFxQkYsVUFQWDtBQVF4Qm5DLHNCQUFvQixnQkFBTWlDLFNBQU4sQ0FBZ0JJO0FBUlosQ0FBMUI7O2tCQVdlLHNCQUFPckYsYUFBUCxDIiwiZmlsZSI6IlN0YWdlVGl0bGVCYXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgeyBzaGVsbCwgaXBjUmVuZGVyZXIgfSBmcm9tICdlbGVjdHJvbidcbmltcG9ydCBSYWRpdW0gZnJvbSAncmFkaXVtJ1xuaW1wb3J0IFBvcG92ZXIgZnJvbSAncmVhY3QtcG9wb3ZlcidcbmltcG9ydCBhc3NpZ24gZnJvbSAnbG9kYXNoLmFzc2lnbidcbmltcG9ydCBQYWxldHRlIGZyb20gJy4vUGFsZXR0ZSdcbmltcG9ydCB7IFRocmVlQm91bmNlIH0gZnJvbSAnYmV0dGVyLXJlYWN0LXNwaW5raXQnXG5pbXBvcnQgQ29sb3IgZnJvbSAnY29sb3InXG5pbXBvcnQgeyBCVE5fU1RZTEVTIH0gZnJvbSAnLi4vc3R5bGVzL2J0blNoYXJlZCdcbmltcG9ydCBDb3B5VG9DbGlwYm9hcmQgZnJvbSAncmVhY3QtY29weS10by1jbGlwYm9hcmQnXG5pbXBvcnQgVG9vbFNlbGVjdG9yIGZyb20gJy4vVG9vbFNlbGVjdG9yJ1xuaW1wb3J0IHtcbiAgUHVibGlzaFNuYXBzaG90U1ZHLFxuICBDb25uZWN0aW9uSWNvblNWRyxcbiAgLy8gVW5kb0ljb25TVkcsXG4gIC8vIFJlZG9JY29uU1ZHLFxuICBXYXJuaW5nSWNvblNWRyxcbiAgU3VjY2Vzc0ljb25TVkcsXG4gIERhbmdlckljb25TVkcsXG4gIENsaWJvYXJkSWNvblNWR1xufSBmcm9tICcuL0ljb25zJ1xuXG52YXIgbWl4cGFuZWwgPSByZXF1aXJlKCcuLy4uLy4uL3V0aWxzL01peHBhbmVsJylcblxuY29uc3QgU1RZTEVTID0ge1xuICBoaWRlOiB7XG4gICAgZGlzcGxheTogJ25vbmUnXG4gIH0sXG4gIGZyYW1lOiB7XG4gICAgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLkNPQUwsXG4gICAgcG9zaXRpb246ICdyZWxhdGl2ZScsXG4gICAgdG9wOiAwLFxuICAgIHpJbmRleDogMSxcbiAgICBoZWlnaHQ6ICczNnB4JyxcbiAgICBwYWRkaW5nOiAnNnB4J1xuICB9LFxuICBkaXNhYmxlZDoge1xuICAgIG9wYWNpdHk6IDAuNSxcbiAgICBjdXJzb3I6ICdub3QtYWxsb3dlZCdcbiAgfSxcbiAgc2hhcmVQb3BvdmVyOiB7XG4gICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgdG9wOiAzNCxcbiAgICBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuRkFUSEVSX0NPQUwsXG4gICAgd2lkdGg6IDIwNCxcbiAgICBwYWRkaW5nOiAnMTNweCA5cHgnLFxuICAgIGZvbnRTaXplOiAxNyxcbiAgICBjb2xvcjogUGFsZXR0ZS5ST0NLLFxuICAgIHRleHRBbGlnbjogJ2NlbnRlcicsXG4gICAgYm9yZGVyUmFkaXVzOiA0LFxuICAgIGJveFNoYWRvdzogJzAgNnB4IDI1cHggMCAnICsgUGFsZXR0ZS5GQVRIRVJfQ09BTFxuICB9LFxuICBwb3BvdmVyQ2xvc2U6IHtcbiAgICBjb2xvcjogJ3doaXRlJyxcbiAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICB0b3A6IDUsXG4gICAgcmlnaHQ6IDEwLFxuICAgIGZvbnRTaXplOiAxNSxcbiAgICB0ZXh0VHJhbnNmb3JtOiAnbG93ZXJjYXNlJ1xuICB9LFxuICBmb290ZXI6IHtcbiAgICBiYWNrZ3JvdW5kQ29sb3I6IENvbG9yKFBhbGV0dGUuREFSS19HUkFZKS5mYWRlKDAuNyksXG4gICAgaGVpZ2h0OiAyNSxcbiAgICB3aWR0aDogJzEwMCUnLFxuICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgIGJvdHRvbTogMCxcbiAgICBmb250U2l6ZTogMTAsXG4gICAgYm9yZGVyQm90dG9tUmlnaHRSYWRpdXM6IDMsXG4gICAgYm9yZGVyQm90dG9tTGVmdFJhZGl1czogMyxcbiAgICBwYWRkaW5nVG9wOiA1XG4gIH0sXG4gIHRpbWU6IHtcbiAgICBmb250V2VpZ2h0OiAnYm9sZCcsXG4gICAgbWFyZ2luTGVmdDogNVxuICB9LFxuICBjb3B5OiB7XG4gICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgaGVpZ2h0OiAnMTAwJScsXG4gICAgd2lkdGg6IDI1LFxuICAgIHJpZ2h0OiAwLFxuICAgIHBhZGRpbmdUb3A6IDIsXG4gICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJyxcbiAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgICBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuREFSS19HUkFZXG4gIH0sXG4gIGNvcHlMb2FkaW5nOiB7XG4gICAgcGFkZGluZ1RvcDogMCxcbiAgICBwYWRkaW5nQm90dG9tOiA2LFxuICAgIHBvaW50ZXJFdmVudHM6ICdub25lJ1xuICB9LFxuICBsaW5rSG9sc3Rlcjoge1xuICAgIGhlaWdodDogMjksXG4gICAgcG9zaXRpb246ICdyZWxhdGl2ZScsXG4gICAgYm9yZGVyUmFkaXVzOiAzLFxuICAgIG1hcmdpblRvcDogMyxcbiAgICBjdXJzb3I6ICdwb2ludGVyJyxcbiAgICBiYWNrZ3JvdW5kQ29sb3I6IENvbG9yKFBhbGV0dGUuREFSS19HUkFZKS5mYWRlKDAuNjgpLFxuICAgIGJvcmRlcjogJzFweCBzb2xpZCAnICsgUGFsZXR0ZS5EQVJLX0dSQVlcblxuICB9LFxuICBsaW5rOiB7XG4gICAgZm9udFNpemU6IDEwLFxuICAgIGNvbG9yOiBDb2xvcihQYWxldHRlLkxJR0hUX0JMVUUpLmxpZ2h0ZW4oMC4zNyksXG4gICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgbGVmdDogNyxcbiAgICB0b3A6IDcsXG4gICAgY3Vyc29yOiAncG9pbnRlcidcbiAgfSxcbiAgZ2VuZXJhdGluZ0xpbms6IHtcbiAgICBjb2xvcjogUGFsZXR0ZS5ST0NLLFxuICAgIGN1cnNvcjogJ2RlZmF1bHQnLFxuICAgIGZvbnRTdHlsZTogJ2l0YWxpYydcbiAgfVxufVxuXG5jb25zdCBTTkFQU0hPVF9TQVZFX1JFU09MVVRJT05fU1RSQVRFR0lFUyA9IHtcbiAgbm9ybWFsOiB7IHN0cmF0ZWd5OiAncmVjdXJzaXZlJywgZmF2b3I6ICdvdXJzJyB9LFxuICBvdXJzOiB7IHN0cmF0ZWd5OiAnb3VycycgfSxcbiAgdGhlaXJzOiB7IHN0cmF0ZWd5OiAndGhlaXJzJyB9XG59XG5cbmNsYXNzIFBvcG92ZXJCb2R5IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc2hvdWxkQ29tcG9uZW50VXBkYXRlIChuZXh0UHJvcHMpIHtcbiAgICByZXR1cm4gKFxuICAgICAgdGhpcy5wcm9wcy50aXRsZVRleHQgIT09IG5leHRQcm9wcy50aXRsZVRleHQgfHxcbiAgICAgIHRoaXMucHJvcHMubGlua0FkZHJlc3MgIT09IG5leHRQcm9wcy5saW5rQWRkcmVzcyB8fFxuICAgICAgdGhpcy5wcm9wcy5pc1NuYXBzaG90U2F2ZUluUHJvZ3Jlc3MgIT09IG5leHRQcm9wcy5pc1NuYXBzaG90U2F2ZUluUHJvZ3Jlc3MgfHxcbiAgICAgIHRoaXMucHJvcHMuc25hcHNob3RTYXZlQ29uZmlybWVkICE9PSBuZXh0UHJvcHMuc25hcHNob3RTYXZlQ29uZmlybWVkIHx8XG4gICAgICB0aGlzLnByb3BzLmlzUHJvamVjdEluZm9GZXRjaEluUHJvZ3Jlc3MgIT09IG5leHRQcm9wcy5pc1Byb2plY3RJbmZvRmV0Y2hJblByb2dyZXNzXG4gICAgKVxuICB9XG5cbiAgcmVuZGVyICgpIHtcbiAgICBsZXQgcG9wb3ZlclBvc2l0aW9uXG5cbiAgICBpZiAodGhpcy5wcm9wcy5zbmFwc2hvdFNhdmVDb25maXJtZWQpIHtcbiAgICAgIHBvcG92ZXJQb3NpdGlvbiA9IC03MlxuICAgIH0gZWxzZSBpZiAodGhpcy5wcm9wcy5pc1NuYXBzaG90U2F2ZUluUHJvZ3Jlc3MpIHtcbiAgICAgIHBvcG92ZXJQb3NpdGlvbiA9IC03MFxuICAgIH0gZWxzZSB7XG4gICAgICBwb3BvdmVyUG9zaXRpb24gPSAtNTlcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBzdHlsZT17W1NUWUxFUy5zaGFyZVBvcG92ZXIsIHtyaWdodDogcG9wb3ZlclBvc2l0aW9ufV19PlxuICAgICAgICA8YnV0dG9uIHN0eWxlPXtTVFlMRVMucG9wb3ZlckNsb3NlfSBvbkNsaWNrPXt0aGlzLnByb3BzLmNsb3NlfT54PC9idXR0b24+XG4gICAgICAgIHt0aGlzLnByb3BzLnRpdGxlVGV4dH1cbiAgICAgICAgPGRpdiBzdHlsZT17U1RZTEVTLmxpbmtIb2xzdGVyfT5cbiAgICAgICAgICB7KHRoaXMucHJvcHMuaXNTbmFwc2hvdFNhdmVJblByb2dyZXNzIHx8IHRoaXMucHJvcHMuaXNQcm9qZWN0SW5mb0ZldGNoSW5Qcm9ncmVzcylcbiAgICAgICAgICAgID8gPHNwYW4gc3R5bGU9e1tTVFlMRVMubGluaywgU1RZTEVTLmdlbmVyYXRpbmdMaW5rXX0+VXBkYXRpbmcgU2hhcmUgUGFnZTwvc3Bhbj5cbiAgICAgICAgICAgIDogPHNwYW4gc3R5bGU9e1NUWUxFUy5saW5rfSBvbkNsaWNrPXsoKSA9PiBzaGVsbC5vcGVuRXh0ZXJuYWwodGhpcy5wcm9wcy5saW5rQWRkcmVzcyl9Pnt0aGlzLnByb3BzLmxpbmtBZGRyZXNzLnN1YnN0cmluZygwLCAzMyl9PC9zcGFuPn1cbiAgICAgICAgICA8Q29weVRvQ2xpcGJvYXJkXG4gICAgICAgICAgICB0ZXh0PXt0aGlzLnByb3BzLmxpbmtBZGRyZXNzfVxuICAgICAgICAgICAgb25Db3B5PXsoKSA9PiB7XG4gICAgICAgICAgICAgIHRoaXMucHJvcHMucGFyZW50LnNldFN0YXRlKHtjb3BpZWQ6IHRydWV9KVxuICAgICAgICAgICAgICB0aGlzLnByb3BzLnBhcmVudC5zZXRTdGF0ZSh7c2hvd0NvcGllZDogdHJ1ZX0sICgpID0+IHtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgIHRoaXMucHJvcHMucGFyZW50LnNldFN0YXRlKHtzaG93Q29waWVkOiBmYWxzZX0pXG4gICAgICAgICAgICAgICAgfSwgMTkwMClcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgeyh0aGlzLnByb3BzLmlzU25hcHNob3RTYXZlSW5Qcm9ncmVzcyB8fCB0aGlzLnByb3BzLmlzUHJvamVjdEluZm9GZXRjaEluUHJvZ3Jlc3MpXG4gICAgICAgICAgICAgID8gPHNwYW4gc3R5bGU9e1tTVFlMRVMuY29weSwgU1RZTEVTLmNvcHlMb2FkaW5nXX0+PFRocmVlQm91bmNlIHNpemU9ezN9IGNvbG9yPXtQYWxldHRlLlJPQ0t9IC8+PC9zcGFuPlxuICAgICAgICAgICAgICA6IDxzcGFuIHN0eWxlPXtTVFlMRVMuY29weX0+PENsaWJvYXJkSWNvblNWRyAvPjwvc3Bhbj59XG4gICAgICAgICAgPC9Db3B5VG9DbGlwYm9hcmQ+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICB7LyogdG9kbzogc2hvdyBsYXN0IHVwZGF0ZWQ/IDxkaXYgc3R5bGU9e1NUWUxFUy5mb290ZXJ9PlVQREFURUQ8c3BhbiBzdHlsZT17U1RZTEVTLnRpbWV9PnsnOTowMGFtIEp1biAxNSwgMjAxNyd9PC9zcGFuPjwvZGl2PiAqL31cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxufVxuXG5jb25zdCBQb3BvdmVyQm9keVJhZGl1bWl6ZWQgPSBSYWRpdW0oUG9wb3ZlckJvZHkpXG5cbmNsYXNzIFN0YWdlVGl0bGVCYXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3RvciAocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcylcbiAgICB0aGlzLmhhbmRsZUNvbm5lY3Rpb25DbGljayA9IHRoaXMuaGFuZGxlQ29ubmVjdGlvbkNsaWNrLmJpbmQodGhpcylcbiAgICB0aGlzLmhhbmRsZVVuZG9DbGljayA9IHRoaXMuaGFuZGxlVW5kb0NsaWNrLmJpbmQodGhpcylcbiAgICB0aGlzLmhhbmRsZVJlZG9DbGljayA9IHRoaXMuaGFuZGxlUmVkb0NsaWNrLmJpbmQodGhpcylcbiAgICB0aGlzLmhhbmRsZVNhdmVTbmFwc2hvdENsaWNrID0gdGhpcy5oYW5kbGVTYXZlU25hcHNob3RDbGljay5iaW5kKHRoaXMpXG4gICAgdGhpcy5oYW5kbGVNZXJnZVJlc29sdmVPdXJzID0gdGhpcy5oYW5kbGVNZXJnZVJlc29sdmVPdXJzLmJpbmQodGhpcylcbiAgICB0aGlzLmhhbmRsZU1lcmdlUmVzb2x2ZVRoZWlycyA9IHRoaXMuaGFuZGxlTWVyZ2VSZXNvbHZlVGhlaXJzLmJpbmQodGhpcylcbiAgICB0aGlzLl9pc01vdW50ZWQgPSBmYWxzZVxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBzbmFwc2hvdFNhdmVSZXNvbHV0aW9uU3RyYXRlZ3lOYW1lOiAnbm9ybWFsJyxcbiAgICAgIGlzU25hcHNob3RTYXZlSW5Qcm9ncmVzczogZmFsc2UsXG4gICAgICBzbmFwc2hvdE1lcmdlQ29uZmxpY3RzOiBudWxsLFxuICAgICAgc25hcHNob3RTYXZlQ29uZmlybWVkOiBudWxsLFxuICAgICAgc25hcHNob3RTYXZlRXJyb3I6IG51bGwsXG4gICAgICBzaG93U2hhcmVQb3BvdmVyOiBmYWxzZSxcbiAgICAgIGNvcGllZDogZmFsc2UsXG4gICAgICBsaW5rQWRkcmVzczogJ0ZldGNoaW5nIEluZm8nLFxuICAgICAgc2hvd0NvcGllZDogZmFsc2UsXG4gICAgICBwcm9qZWN0SW5mb0ZldGNoRXJyb3I6IG51bGwsXG4gICAgICBpc1Byb2plY3RJbmZvRmV0Y2hJblByb2dyZXNzOiBmYWxzZSxcbiAgICAgIHByb2plY3RJbmZvOiBudWxsLFxuICAgICAgZ2l0VW5kb2FibGVzOiBbXSxcbiAgICAgIGdpdFJlZG9hYmxlczogW11cbiAgICB9XG4gIH1cblxuICBjb21wb25lbnRXaWxsTW91bnQgKCkge1xuICAgIHRoaXMuX2lzTW91bnRlZCA9IHRydWVcbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50ICgpIHtcbiAgICB0aGlzLnBlcmZvcm1Qcm9qZWN0SW5mb0ZldGNoKClcblxuICAgIC8vIEl0J3Mga2luZCBvZiB3ZWlyZCB0byBoYXZlIHRoaXMgaGVhcnRiZWF0IGxvZ2ljIGJ1cmllZCBhbGwgdGhlIHdheSBkb3duIGhlcmUgaW5zaWRlIFN0YXRlVGl0bGVCYXI7XG4gICAgLy8gaXQgcHJvYmFibHkgc2hvdWxkIGJlIG1vdmVkIHVwIHRvIHRoZSBDcmVhdG9yIGxldmVsIHNvIGl0J3MgZWFzaWVyIHRvIGZpbmQgI0ZJWE1FXG4gICAgdGhpcy5fZmV0Y2hNYXN0ZXJTdGF0ZUludGVydmFsID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMucHJvcHMud2Vic29ja2V0LnJlcXVlc3QoeyBtZXRob2Q6ICdtYXN0ZXJIZWFydGJlYXQnLCBwYXJhbXM6IFt0aGlzLnByb3BzLmZvbGRlcl0gfSwgKGhlYXJ0YmVhdEVyciwgbWFzdGVyU3RhdGUpID0+IHtcbiAgICAgICAgaWYgKGhlYXJ0YmVhdEVyciB8fCAhbWFzdGVyU3RhdGUpIHtcbiAgICAgICAgICAvLyBJZiBtYXN0ZXIgZGlzY29ubmVjdHMgd2UgbWlnaHQgbm90IGV2ZW4gZ2V0IGFuIGVycm9yLCBzbyBjcmVhdGUgYSBmYWtlIGVycm9yIGluIGl0cyBwbGFjZVxuICAgICAgICAgIGlmICghaGVhcnRiZWF0RXJyKSBoZWFydGJlYXRFcnIgPSBuZXcgRXJyb3IoJ1Vua25vd24gcHJvYmxlbSB3aXRoIG1hc3RlciBoZWFydGJlYXQnKVxuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoaGVhcnRiZWF0RXJyKVxuXG4gICAgICAgICAgLy8gSWYgbWFzdGVyIGhhcyBkaXNjb25uZWN0ZWQsIHN0b3AgcnVubmluZyB0aGlzIGludGVydmFsIHNvIHdlIGRvbid0IGdldCBwdWxzaW5nIGVycm9yIG1lc3NhZ2VzXG4gICAgICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLl9mZXRjaE1hc3RlclN0YXRlSW50ZXJ2YWwpXG5cbiAgICAgICAgICAvLyBCdXQgdGhlIGZpcnN0IHRpbWUgd2UgZ2V0IHRoaXMsIGRpc3BsYXkgYSB1c2VyIG5vdGljZSAtIHRoZXkgcHJvYmFibHkgbmVlZCB0byByZXN0YXJ0IEhhaWt1IHRvIGdldFxuICAgICAgICAgIC8vIGludG8gYSBiZXR0ZXIgc3RhdGUsIGF0IGxlYXN0IHVudGlsIHdlIGNhbiByZXNvbHZlIHdoYXQgdGhlIGNhdXNlIG9mIHRoaXMgcHJvYmxlbSBpc1xuICAgICAgICAgIHJldHVybiB0aGlzLnByb3BzLmNyZWF0ZU5vdGljZSh7XG4gICAgICAgICAgICB0eXBlOiAnZGFuZ2VyJyxcbiAgICAgICAgICAgIHRpdGxlOiAnVWggb2ghJyxcbiAgICAgICAgICAgIG1lc3NhZ2U6ICdIYWlrdSBpcyBoYXZpbmcgYSBwcm9ibGVtIGFjY2Vzc2luZyB5b3VyIHByb2plY3QuIPCfmKIgUGxlYXNlIHJlc3RhcnQgSGFpa3UuIElmIHlvdSBzZWUgdGhpcyBlcnJvciBhZ2FpbiwgY29udGFjdCBIYWlrdSBmb3Igc3VwcG9ydC4nXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuXG4gICAgICAgIGlwY1JlbmRlcmVyLnNlbmQoJ21hc3RlcjpoZWFydGJlYXQnLCBhc3NpZ24oe30sIG1hc3RlclN0YXRlKSlcblxuICAgICAgICBpZiAodGhpcy5faXNNb3VudGVkKSB7XG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICBnaXRVbmRvYWJsZXM6IG1hc3RlclN0YXRlLmdpdFVuZG9hYmxlcyxcbiAgICAgICAgICAgIGdpdFJlZG9hYmxlczogbWFzdGVyU3RhdGUuZ2l0UmVkb2FibGVzXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9LCAxMDAwKVxuXG4gICAgaXBjUmVuZGVyZXIub24oJ2dsb2JhbC1tZW51OnNhdmUnLCAoKSA9PiB7XG4gICAgICB0aGlzLmhhbmRsZVNhdmVTbmFwc2hvdENsaWNrKClcbiAgICB9KVxuICB9XG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQgKCkge1xuICAgIHRoaXMuX2lzTW91bnRlZCA9IGZhbHNlXG4gICAgY2xlYXJJbnRlcnZhbCh0aGlzLl9mZXRjaE1hc3RlclN0YXRlSW50ZXJ2YWwpXG4gIH1cblxuICBoYW5kbGVDb25uZWN0aW9uQ2xpY2sgKCkge1xuICAgIC8vIFRPRE9cbiAgfVxuXG4gIGhhbmRsZVVuZG9DbGljayAoKSB7XG4gICAgcmV0dXJuIHRoaXMucHJvcHMud2Vic29ja2V0LnJlcXVlc3QoeyBtZXRob2Q6ICdnaXRVbmRvJywgcGFyYW1zOiBbdGhpcy5wcm9wcy5mb2xkZXIsIHsgdHlwZTogJ2dsb2JhbCcgfV0gfSwgKGVycikgPT4ge1xuICAgICAgaWYgKGVycikge1xuICAgICAgICBjb25zb2xlLmVycm9yKGVycilcbiAgICAgICAgcmV0dXJuIHRoaXMucHJvcHMuY3JlYXRlTm90aWNlKHtcbiAgICAgICAgICB0eXBlOiAnd2FybmluZycsXG4gICAgICAgICAgdGl0bGU6ICdVaCBvaCEnLFxuICAgICAgICAgIG1lc3NhZ2U6ICdXZSB3ZXJlIHVuYWJsZSB0byB1bmRvIHlvdXIgbGFzdCBhY3Rpb24uIPCfmKIgUGxlYXNlIGNvbnRhY3QgSGFpa3UgZm9yIHN1cHBvcnQuJ1xuICAgICAgICB9KVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBoYW5kbGVSZWRvQ2xpY2sgKCkge1xuICAgIHJldHVybiB0aGlzLnByb3BzLndlYnNvY2tldC5yZXF1ZXN0KHsgbWV0aG9kOiAnZ2l0UmVkbycsIHBhcmFtczogW3RoaXMucHJvcHMuZm9sZGVyLCB7IHR5cGU6ICdnbG9iYWwnIH1dIH0sIChlcnIpID0+IHtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihlcnIpXG4gICAgICAgIHJldHVybiB0aGlzLnByb3BzLmNyZWF0ZU5vdGljZSh7XG4gICAgICAgICAgdHlwZTogJ3dhcm5pbmcnLFxuICAgICAgICAgIHRpdGxlOiAnVWggb2ghJyxcbiAgICAgICAgICBtZXNzYWdlOiAnV2Ugd2VyZSB1bmFibGUgdG8gcmVkbyB5b3VyIGxhc3QgYWN0aW9uLiDwn5iiIFBsZWFzZSBjb250YWN0IEhhaWt1IGZvciBzdXBwb3J0LidcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgZ2V0UHJvamVjdFNhdmVPcHRpb25zICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgY29tbWl0TWVzc2FnZTogJ0NoYW5nZXMgc2F2ZWQgKHZpYSBIYWlrdSBEZXNrdG9wKScsXG4gICAgICBzYXZlU3RyYXRlZ3k6IFNOQVBTSE9UX1NBVkVfUkVTT0xVVElPTl9TVFJBVEVHSUVTW3RoaXMuc3RhdGUuc25hcHNob3RTYXZlUmVzb2x1dGlvblN0cmF0ZWd5TmFtZV1cbiAgICB9XG4gIH1cblxuICBoYW5kbGVTYXZlU25hcHNob3RDbGljayAoKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUuc25hcHNob3RTYXZlRXJyb3IpIHJldHVybiB2b2lkICgwKVxuICAgIGlmICh0aGlzLnN0YXRlLmlzU25hcHNob3RTYXZlSW5Qcm9ncmVzcykgcmV0dXJuIHZvaWQgKDApXG4gICAgaWYgKHRoaXMuc3RhdGUuc25hcHNob3RNZXJnZUNvbmZsaWN0cykgcmV0dXJuIHZvaWQgKDApXG4gICAgaWYgKHRoaXMuc3RhdGUuc2hvd1NoYXJlUG9wb3ZlcikgcmV0dXJuIHZvaWQgKDApXG5cbiAgICB0aGlzLnNldFN0YXRlKHtzaG93U2hhcmVQb3BvdmVyOiAhdGhpcy5zdGF0ZS5zaG93U2hhcmVQb3BvdmVyfSlcblxuICAgIGlmICh0aGlzLnByb3BzLnRvdXJDbGllbnQpIHRoaXMucHJvcHMudG91ckNsaWVudC5uZXh0KClcblxuICAgIHJldHVybiB0aGlzLnBlcmZvcm1Qcm9qZWN0U2F2ZSgpXG4gIH1cblxuICBwZXJmb3JtUHJvamVjdEluZm9GZXRjaCAoKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7IGlzUHJvamVjdEluZm9GZXRjaEluUHJvZ3Jlc3M6IHRydWUgfSlcbiAgICByZXR1cm4gdGhpcy5wcm9wcy53ZWJzb2NrZXQucmVxdWVzdCh7IG1ldGhvZDogJ2ZldGNoUHJvamVjdEluZm8nLCBwYXJhbXM6IFt0aGlzLnByb3BzLmZvbGRlciwgdGhpcy5wcm9wcy5wcm9qZWN0LnByb2plY3ROYW1lLCB0aGlzLnByb3BzLnVzZXJuYW1lLCB0aGlzLnByb3BzLnBhc3N3b3JkLCB7fV0gfSwgKHByb2plY3RJbmZvRmV0Y2hFcnJvciwgcHJvamVjdEluZm8pID0+IHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoeyBpc1Byb2plY3RJbmZvRmV0Y2hJblByb2dyZXNzOiBmYWxzZSB9KVxuXG4gICAgICBpZiAocHJvamVjdEluZm9GZXRjaEVycm9yKSB7XG4gICAgICAgIGlmIChwcm9qZWN0SW5mb0ZldGNoRXJyb3IubWVzc2FnZSkge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IocHJvamVjdEluZm9GZXRjaEVycm9yLm1lc3NhZ2UpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc29sZS5lcnJvcigndW5rbm93biBwcm9ibGVtIGZldGNoaW5nIHByb2plY3QnKVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gV2UgbWlnaHQgb25seSBjYXJlIGFib3V0IHRoaXMgaWYgaXQgY29tZXMgdXAgZHVyaW5nIGEgc2F2ZS4uLiAjRklYTUUgPz9cbiAgICAgICAgaWYgKHByb2plY3RJbmZvRmV0Y2hFcnJvci5tZXNzYWdlID09PSAnVGltZWQgb3V0IHdhaXRpbmcgZm9yIHByb2plY3Qgc2hhcmUgaW5mbycpIHtcbiAgICAgICAgICAvLyA/XG4gICAgICAgICAgcmV0dXJuIHZvaWQgKDApIC8vIEdvdHRhIHJldHVybiBoZXJlIC0gZG9uJ3Qgd2FudCB0byBmYWxsIHRocm91Z2ggYXMgdGhvdWdoIHdlIGFjdHVhbGx5IGdvdCBwcm9qZWN0SW5mbyBiZWxvd1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiB0aGlzLnNldFN0YXRlKHsgcHJvamVjdEluZm9GZXRjaEVycm9yIH0pXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGhpcy5zZXRTdGF0ZSh7IHByb2plY3RJbmZvIH0pXG4gICAgICBpZiAodGhpcy5wcm9wcy5yZWNlaXZlUHJvamVjdEluZm8pIHRoaXMucHJvcHMucmVjZWl2ZVByb2plY3RJbmZvKHByb2plY3RJbmZvKVxuICAgICAgaWYgKHByb2plY3RJbmZvLnNoYXJlTGluaykgdGhpcy5zZXRTdGF0ZSh7IGxpbmtBZGRyZXNzOiBwcm9qZWN0SW5mby5zaGFyZUxpbmsgfSlcbiAgICB9KVxuICB9XG5cbiAgd2l0aFByb2plY3RJbmZvIChvdGhlck9iamVjdCkge1xuICAgIGxldCBwcm9qID0gdGhpcy5zdGF0ZS5wcm9qZWN0SW5mbyB8fCB7fVxuICAgIHJldHVybiBhc3NpZ24oe30sIG90aGVyT2JqZWN0LCB7XG4gICAgICBvcmdhbml6YXRpb246IHByb2oub3JnYW5pemF0aW9uTmFtZSxcbiAgICAgIHV1aWQ6IHByb2oucHJvamVjdFVpZCxcbiAgICAgIHNoYTogcHJvai5zaGEsXG4gICAgICBicmFuY2g6IHByb2ouYnJhbmNoTmFtZVxuICAgIH0pXG4gIH1cblxuICByZXF1ZXN0U2F2ZVByb2plY3QgKGNiKSB7XG4gICAgcmV0dXJuIHRoaXMucHJvcHMud2Vic29ja2V0LnJlcXVlc3QoeyBtZXRob2Q6ICdzYXZlUHJvamVjdCcsIHBhcmFtczogW3RoaXMucHJvcHMuZm9sZGVyLCB0aGlzLnByb3BzLnByb2plY3QucHJvamVjdE5hbWUsIHRoaXMucHJvcHMudXNlcm5hbWUsIHRoaXMucHJvcHMucGFzc3dvcmQsIHRoaXMuZ2V0UHJvamVjdFNhdmVPcHRpb25zKCldIH0sIGNiKVxuICB9XG5cbiAgcGVyZm9ybVByb2plY3RTYXZlICgpIHtcbiAgICBtaXhwYW5lbC5oYWlrdVRyYWNrKCdjcmVhdG9yOnByb2plY3Q6c2F2aW5nJywgdGhpcy53aXRoUHJvamVjdEluZm8oe1xuICAgICAgdXNlcm5hbWU6IHRoaXMucHJvcHMudXNlcm5hbWUsXG4gICAgICBwcm9qZWN0OiB0aGlzLnByb3BzLnByb2plY3ROYW1lXG4gICAgfSkpXG4gICAgdGhpcy5zZXRTdGF0ZSh7IGlzU25hcHNob3RTYXZlSW5Qcm9ncmVzczogdHJ1ZSB9KVxuXG4gICAgcmV0dXJuIHRoaXMucmVxdWVzdFNhdmVQcm9qZWN0KChzbmFwc2hvdFNhdmVFcnJvciwgc25hcHNob3REYXRhKSA9PiB7XG4gICAgICBpZiAoc25hcHNob3RTYXZlRXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihzbmFwc2hvdFNhdmVFcnJvcilcbiAgICAgICAgaWYgKHNuYXBzaG90U2F2ZUVycm9yLm1lc3NhZ2UgPT09ICdUaW1lZCBvdXQgd2FpdGluZyBmb3IgcHJvamVjdCBzaGFyZSBpbmZvJykge1xuICAgICAgICAgIHRoaXMucHJvcHMuY3JlYXRlTm90aWNlKHtcbiAgICAgICAgICAgIHR5cGU6ICd3YXJuaW5nJyxcbiAgICAgICAgICAgIHRpdGxlOiAnSG1tLi4uJyxcbiAgICAgICAgICAgIG1lc3NhZ2U6ICdQdWJsaXNoaW5nIHlvdXIgcHJvamVjdCBzZWVtcyB0byBiZSB0YWtpbmcgYSBsb25nIHRpbWUuIPCfmKIgUGxlYXNlIHRyeSBhZ2FpbiBpbiBhIGZldyBtb21lbnRzLiBJZiB5b3Ugc2VlIHRoaXMgbWVzc2FnZSBhZ2FpbiwgY29udGFjdCBIYWlrdSBmb3Igc3VwcG9ydC4nXG4gICAgICAgICAgfSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnByb3BzLmNyZWF0ZU5vdGljZSh7XG4gICAgICAgICAgICB0eXBlOiAnZGFuZ2VyJyxcbiAgICAgICAgICAgIHRpdGxlOiAnT2ggbm8hJyxcbiAgICAgICAgICAgIG1lc3NhZ2U6ICdXZSB3ZXJlIHVuYWJsZSB0byBwdWJsaXNoIHlvdXIgcHJvamVjdC4g8J+YoiBQbGVhc2UgdHJ5IGFnYWluIGluIGEgZmV3IG1vbWVudHMuIElmIHlvdSBzdGlsbCBzZWUgdGhpcyBlcnJvciwgY29udGFjdCBIYWlrdSBmb3Igc3VwcG9ydC4nXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5zZXRTdGF0ZSh7IGlzU25hcHNob3RTYXZlSW5Qcm9ncmVzczogZmFsc2UsIHNuYXBzaG90U2F2ZVJlc29sdXRpb25TdHJhdGVneU5hbWU6ICdub3JtYWwnLCBzbmFwc2hvdFNhdmVFcnJvciB9LCAoKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoKCkgPT4gdGhpcy5zZXRTdGF0ZSh7IHNuYXBzaG90U2F2ZUVycm9yOiBudWxsIH0pLCAyMDAwKVxuICAgICAgICB9KVxuICAgICAgfVxuXG4gICAgICB0aGlzLnNldFN0YXRlKHsgaXNTbmFwc2hvdFNhdmVJblByb2dyZXNzOiBmYWxzZSwgc25hcHNob3RTYXZlQ29uZmlybWVkOiB0cnVlIH0pXG5cbiAgICAgIGlmIChzbmFwc2hvdERhdGEpIHtcbiAgICAgICAgaWYgKHNuYXBzaG90RGF0YS5jb25mbGljdHMpIHtcbiAgICAgICAgICBjb25zb2xlLndhcm4oJ1tjcmVhdG9yXSBNZXJnZSBjb25mbGljdHMgZm91bmQhJylcbiAgICAgICAgICB0aGlzLnByb3BzLmNyZWF0ZU5vdGljZSh7XG4gICAgICAgICAgICB0eXBlOiAnd2FybmluZycsXG4gICAgICAgICAgICB0aXRsZTogJ01lcmdlIGNvbmZsaWN0cyEnLFxuICAgICAgICAgICAgbWVzc2FnZTogJ1dlIGNvdWxkblxcJ3QgbWVyZ2UgeW91ciBjaGFuZ2VzLiDwn5iiIFlvdVxcJ2xsIG5lZWQgdG8gZGVjaWRlIGhvdyB0byBtZXJnZSB5b3VyIGNoYW5nZXMgYmVmb3JlIGNvbnRpbnVpbmcuJ1xuICAgICAgICAgIH0pXG4gICAgICAgICAgcmV0dXJuIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgc25hcHNob3RNZXJnZUNvbmZsaWN0czogc25hcHNob3REYXRhLmNvbmZsaWN0cyxcbiAgICAgICAgICAgIHNob3dTaGFyZVBvcG92ZXI6IGZhbHNlXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnNvbGUuaW5mbygnW2NyZWF0b3JdIFNhdmUgY29tcGxldGUnLCBzbmFwc2hvdERhdGEpXG5cbiAgICAgICAgLy8gVW5sZXNzIHdlIHNldCBiYWNrIHRvIG5vcm1hbCwgc3Vic2VxdWVudCBzYXZlcyB3aWxsIHN0aWxsIGJlIHNldCB0byB1c2UgdGhlIHN0cmljdCBvdXJzL3RoZWlycyBzdHJhdGVneSxcbiAgICAgICAgLy8gd2hpY2ggd2lsbCBjbG9iYmVyIHVwZGF0ZXMgdGhhdCB3ZSBtaWdodCB3YW50IHRvIGFjdHVhbGx5IG1lcmdlIGdyYWNlZnVsbHkuXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyBzbmFwc2hvdFNhdmVSZXNvbHV0aW9uU3RyYXRlZ3lOYW1lOiAnbm9ybWFsJyB9KVxuXG4gICAgICAgIGlmIChzbmFwc2hvdERhdGEuc2hhcmVMaW5rKSB7XG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGxpbmtBZGRyZXNzOiBzbmFwc2hvdERhdGEuc2hhcmVMaW5rIH0pXG4gICAgICAgIH1cblxuICAgICAgICBtaXhwYW5lbC5oYWlrdVRyYWNrKCdjcmVhdG9yOnByb2plY3Q6c2F2ZWQnLCB0aGlzLndpdGhQcm9qZWN0SW5mbyh7XG4gICAgICAgICAgdXNlcm5hbWU6IHRoaXMucHJvcHMudXNlcm5hbWUsXG4gICAgICAgICAgcHJvamVjdDogdGhpcy5wcm9wcy5wcm9qZWN0TmFtZVxuICAgICAgICB9KSlcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHNldFRpbWVvdXQoKCkgPT4gdGhpcy5zZXRTdGF0ZSh7IHNuYXBzaG90U2F2ZUNvbmZpcm1lZDogZmFsc2UgfSksIDIwMDApXG4gICAgfSlcbiAgfVxuXG4gIHJlbmRlclNuYXBzaG90U2F2ZUlubmVyQnV0dG9uICgpIHtcbiAgICBpZiAodGhpcy5zdGF0ZS5zbmFwc2hvdFNhdmVFcnJvcikgcmV0dXJuIDxkaXYgc3R5bGU9e3toZWlnaHQ6IDE4LCBtYXJnaW5SaWdodDogLTV9fT48RGFuZ2VySWNvblNWRyBmaWxsPSd0cmFuc3BhcmVudCcgLz48L2Rpdj5cbiAgICBpZiAodGhpcy5zdGF0ZS5zbmFwc2hvdE1lcmdlQ29uZmxpY3RzKSByZXR1cm4gPGRpdiBzdHlsZT17e2hlaWdodDogMTksIG1hcmdpblJpZ2h0OiAwLCBtYXJnaW5Ub3A6IC0yfX0+PFdhcm5pbmdJY29uU1ZHIGZpbGw9J3RyYW5zcGFyZW50JyBjb2xvcj17UGFsZXR0ZS5PUkFOR0V9IC8+PC9kaXY+XG4gICAgaWYgKHRoaXMuc3RhdGUuc25hcHNob3RTYXZlQ29uZmlybWVkKSByZXR1cm4gPGRpdiBzdHlsZT17eyBoZWlnaHQ6IDE4IH19PjxTdWNjZXNzSWNvblNWRyB2aWV3Qm94PScwIDAgMTQgMTQnIGZpbGw9J3RyYW5zcGFyZW50JyAvPjwvZGl2PlxuICAgIHJldHVybiA8UHVibGlzaFNuYXBzaG90U1ZHIC8+XG4gIH1cblxuICBoYW5kbGVNZXJnZVJlc29sdmVPdXJzICgpIHtcbiAgICB0aGlzLnNldFN0YXRlKHsgc25hcHNob3RNZXJnZUNvbmZsaWN0czogbnVsbCwgc25hcHNob3RTYXZlUmVzb2x1dGlvblN0cmF0ZWd5TmFtZTogJ291cnMnIH0sICgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLnBlcmZvcm1Qcm9qZWN0U2F2ZSgpXG4gICAgfSlcbiAgfVxuXG4gIGhhbmRsZU1lcmdlUmVzb2x2ZVRoZWlycyAoKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7IHNuYXBzaG90TWVyZ2VDb25mbGljdHM6IG51bGwsIHNuYXBzaG90U2F2ZVJlc29sdXRpb25TdHJhdGVneU5hbWU6ICd0aGVpcnMnIH0sICgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLnBlcmZvcm1Qcm9qZWN0U2F2ZSgpXG4gICAgfSlcbiAgfVxuXG4gIHJlbmRlck1lcmdlQ29uZmxpY3RSZXNvbHV0aW9uQXJlYSAoKSB7XG4gICAgaWYgKCF0aGlzLnN0YXRlLnNuYXBzaG90TWVyZ2VDb25mbGljdHMpIHJldHVybiAnJ1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IHN0eWxlPXt7IHBvc2l0aW9uOiAnYWJzb2x1dGUnLCBsZWZ0OiAwLCByaWdodDogMTUwLCB0b3A6IDQsIHBhZGRpbmc6IDUsIGJvcmRlclJhZGl1czogNCwgY29sb3I6IFBhbGV0dGUuUk9DSywgdGV4dEFsaWduOiAncmlnaHQnLCBvdmVyZmxvdzogJ2hpZGRlbicgfX0+XG4gICAgICAgIENvbmZsaWN0IGZvdW5kIXsnICd9XG4gICAgICAgIDxhIG9uQ2xpY2s9e3RoaXMuaGFuZGxlTWVyZ2VSZXNvbHZlT3Vyc30gc3R5bGU9e3sgY3Vyc29yOiAncG9pbnRlcicsIHRleHREZWNvcmF0aW9uOiAndW5kZXJsaW5lJywgY29sb3I6IFBhbGV0dGUuR1JFRU4gfX0+Rm9yY2UgeW91ciBjaGFuZ2VzPC9hPnsnICd9XG4gICAgICAgIG9yIDxhIG9uQ2xpY2s9e3RoaXMuaGFuZGxlTWVyZ2VSZXNvbHZlVGhlaXJzfSBzdHlsZT17eyBjdXJzb3I6ICdwb2ludGVyJywgdGV4dERlY29yYXRpb246ICd1bmRlcmxpbmUnLCBjb2xvcjogUGFsZXR0ZS5SRUQgfX0+ZGlzY2FyZCB5b3VycyAmYW1wOyBhY2NlcHQgdGhlaXJzPC9hPj9cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIGhvdmVyU3R5bGVGb3JTYXZlQnV0dG9uICgpIHtcbiAgICBpZiAodGhpcy5zdGF0ZS5pc1NuYXBzaG90U2F2ZUluUHJvZ3Jlc3MpIHJldHVybiBudWxsXG4gICAgaWYgKHRoaXMuc3RhdGUuc25hcHNob3RTYXZlRXJyb3IpIHJldHVybiBudWxsXG4gICAgaWYgKHRoaXMuc3RhdGUuc25hcHNob3RNZXJnZUNvbmZsaWN0cykgcmV0dXJuIG51bGxcbiAgICBpZiAodGhpcy5zdGF0ZS5zbmFwc2hvdFNhdmVDb25maXJtZWQpIHJldHVybiBudWxsXG4gICAgcmV0dXJuIEJUTl9TVFlMRVMuYnRuSWNvbkhvdmVyXG4gIH1cblxuICByZW5kZXIgKCkge1xuICAgIGNvbnN0IHsgc2hvd1NoYXJlUG9wb3ZlciB9ID0gdGhpcy5zdGF0ZVxuICAgIGNvbnN0IHRpdGxlVGV4dCA9IHRoaXMuc3RhdGUuc2hvd0NvcGllZFxuICAgICAgPyAnQ29waWVkJ1xuICAgICAgOiAnU2hhcmUgJiBFbWJlZCdcblxuICAgIGxldCBidG5UZXh0ID0gJ1BVQkxJU0gnXG4gICAgaWYgKHRoaXMuc3RhdGUuc25hcHNob3RTYXZlQ29uZmlybWVkKSBidG5UZXh0ID0gJ1BVQkxJU0hFRCdcbiAgICBpZiAodGhpcy5zdGF0ZS5pc1NuYXBzaG90U2F2ZUluUHJvZ3Jlc3MpIGJ0blRleHQgPSAnUFVCTElTSElORydcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IHN0eWxlPXtTVFlMRVMuZnJhbWV9IGNsYXNzTmFtZT0nZnJhbWUnPlxuICAgICAgICA8UG9wb3ZlclxuICAgICAgICAgIHBsYWNlPSdiZWxvdydcbiAgICAgICAgICBpc09wZW49e3Nob3dTaGFyZVBvcG92ZXJ9XG4gICAgICAgICAgYm9keT17XG4gICAgICAgICAgICA8UG9wb3ZlckJvZHlSYWRpdW1pemVkXG4gICAgICAgICAgICAgIHBhcmVudD17dGhpc31cbiAgICAgICAgICAgICAgdGl0bGVUZXh0PXt0aXRsZVRleHR9XG4gICAgICAgICAgICAgIHNuYXBzaG90U2F2ZUNvbmZpcm1lZD17dGhpcy5zdGF0ZS5zbmFwc2hvdFNhdmVDb25maXJtZWR9XG4gICAgICAgICAgICAgIGlzU25hcHNob3RTYXZlSW5Qcm9ncmVzcz17dGhpcy5zdGF0ZS5pc1NuYXBzaG90U2F2ZUluUHJvZ3Jlc3N9XG4gICAgICAgICAgICAgIGlzUHJvamVjdEluZm9GZXRjaEluUHJvZ3Jlc3M9e3RoaXMuc3RhdGUuaXNQcm9qZWN0SW5mb0ZldGNoSW5Qcm9ncmVzc31cbiAgICAgICAgICAgICAgbGlua0FkZHJlc3M9e3RoaXMuc3RhdGUubGlua0FkZHJlc3N9XG4gICAgICAgICAgICAgIGNsb3NlPXsoKSA9PiB0aGlzLnNldFN0YXRlKHsgc2hvd1NoYXJlUG9wb3ZlcjogZmFsc2UgfSl9IC8+XG4gICAgICAgICAgfT5cbiAgICAgICAgICA8YnV0dG9uIGtleT0nc2F2ZSdcbiAgICAgICAgICAgIGlkPSdwdWJsaXNoJ1xuICAgICAgICAgICAgb25DbGljaz17dGhpcy5oYW5kbGVTYXZlU25hcHNob3RDbGlja31cbiAgICAgICAgICAgIHN0eWxlPXtbXG4gICAgICAgICAgICAgIEJUTl9TVFlMRVMuYnRuVGV4dCxcbiAgICAgICAgICAgICAgQlROX1NUWUxFUy5yaWdodEJ0bnMsXG4gICAgICAgICAgICAgIHRoaXMuc3RhdGUuaXNTbmFwc2hvdFNhdmVJblByb2dyZXNzICYmIFNUWUxFUy5kaXNhYmxlZFxuICAgICAgICAgICAgXX0+XG4gICAgICAgICAgICB7dGhpcy5yZW5kZXJTbmFwc2hvdFNhdmVJbm5lckJ1dHRvbigpfTxzcGFuIHN0eWxlPXt7bWFyZ2luTGVmdDogN319PntidG5UZXh0fTwvc3Bhbj5cbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPC9Qb3BvdmVyPlxuXG4gICAgICAgIHt0aGlzLnJlbmRlck1lcmdlQ29uZmxpY3RSZXNvbHV0aW9uQXJlYSgpfVxuICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9e3RoaXMuaGFuZGxlQ29ubmVjdGlvbkNsaWNrfSBzdHlsZT17W0JUTl9TVFlMRVMuYnRuSWNvbiwgQlROX1NUWUxFUy5idG5JY29uSG92ZXIsIFNUWUxFUy5oaWRlXX0ga2V5PSdjb25uZWN0Jz5cbiAgICAgICAgICA8Q29ubmVjdGlvbkljb25TVkcgLz5cbiAgICAgICAgPC9idXR0b24+XG5cbiAgICAgICAgeyBmYWxzZSAmJlxuICAgICAgICAgIDxUb29sU2VsZWN0b3Igd2Vic29ja2V0PXt0aGlzLnByb3BzLndlYnNvY2tldH0gLz5cbiAgICAgICAgfVxuXG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cbn1cblxuU3RhZ2VUaXRsZUJhci5wcm9wVHlwZXMgPSB7XG4gIGZvbGRlcjogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICBwcm9qZWN0TmFtZTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcbiAgdXNlcm5hbWU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG4gIHBhc3N3b3JkOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuICB3ZWJzb2NrZXQ6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgY3JlYXRlTm90aWNlOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICByZW1vdmVOb3RpY2U6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIHJlY2VpdmVQcm9qZWN0SW5mbzogUmVhY3QuUHJvcFR5cGVzLmZ1bmNcbn1cblxuZXhwb3J0IGRlZmF1bHQgUmFkaXVtKFN0YWdlVGl0bGVCYXIpXG4iXX0=