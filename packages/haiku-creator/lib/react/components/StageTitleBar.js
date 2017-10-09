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

var mixpanel = require('haiku-serialization/src/utils/Mixpanel');

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
            style: { zIndex: 2 },
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
                lineNumber: 463
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
                lineNumber: 472
              },
              __self: this
            },
            this.renderSnapshotSaveInnerButton(),
            _react2.default.createElement(
              'span',
              { style: { marginLeft: 7 }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 480
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
              lineNumber: 485
            },
            __self: this
          },
          _react2.default.createElement(_Icons.ConnectionIconSVG, {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 486
            },
            __self: this
          })
        ),
        false && _react2.default.createElement(_ToolSelector2.default, { websocket: this.props.websocket, __source: {
            fileName: _jsxFileName,
            lineNumber: 490
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9yZWFjdC9jb21wb25lbnRzL1N0YWdlVGl0bGVCYXIuanMiXSwibmFtZXMiOlsibWl4cGFuZWwiLCJyZXF1aXJlIiwiU1RZTEVTIiwiaGlkZSIsImRpc3BsYXkiLCJmcmFtZSIsImJhY2tncm91bmRDb2xvciIsIkNPQUwiLCJwb3NpdGlvbiIsInRvcCIsInpJbmRleCIsImhlaWdodCIsInBhZGRpbmciLCJkaXNhYmxlZCIsIm9wYWNpdHkiLCJjdXJzb3IiLCJzaGFyZVBvcG92ZXIiLCJGQVRIRVJfQ09BTCIsIndpZHRoIiwiZm9udFNpemUiLCJjb2xvciIsIlJPQ0siLCJ0ZXh0QWxpZ24iLCJib3JkZXJSYWRpdXMiLCJib3hTaGFkb3ciLCJwb3BvdmVyQ2xvc2UiLCJyaWdodCIsInRleHRUcmFuc2Zvcm0iLCJmb290ZXIiLCJEQVJLX0dSQVkiLCJmYWRlIiwiYm90dG9tIiwiYm9yZGVyQm90dG9tUmlnaHRSYWRpdXMiLCJib3JkZXJCb3R0b21MZWZ0UmFkaXVzIiwicGFkZGluZ1RvcCIsInRpbWUiLCJmb250V2VpZ2h0IiwibWFyZ2luTGVmdCIsImNvcHkiLCJqdXN0aWZ5Q29udGVudCIsImFsaWduSXRlbXMiLCJjb3B5TG9hZGluZyIsInBhZGRpbmdCb3R0b20iLCJwb2ludGVyRXZlbnRzIiwibGlua0hvbHN0ZXIiLCJtYXJnaW5Ub3AiLCJib3JkZXIiLCJsaW5rIiwiTElHSFRfQkxVRSIsImxpZ2h0ZW4iLCJsZWZ0IiwiZ2VuZXJhdGluZ0xpbmsiLCJmb250U3R5bGUiLCJTTkFQU0hPVF9TQVZFX1JFU09MVVRJT05fU1RSQVRFR0lFUyIsIm5vcm1hbCIsInN0cmF0ZWd5IiwiZmF2b3IiLCJvdXJzIiwidGhlaXJzIiwiUG9wb3ZlckJvZHkiLCJuZXh0UHJvcHMiLCJwcm9wcyIsInRpdGxlVGV4dCIsImxpbmtBZGRyZXNzIiwiaXNTbmFwc2hvdFNhdmVJblByb2dyZXNzIiwic25hcHNob3RTYXZlQ29uZmlybWVkIiwiaXNQcm9qZWN0SW5mb0ZldGNoSW5Qcm9ncmVzcyIsInBvcG92ZXJQb3NpdGlvbiIsImNsb3NlIiwib3BlbkV4dGVybmFsIiwic3Vic3RyaW5nIiwicGFyZW50Iiwic2V0U3RhdGUiLCJjb3BpZWQiLCJzaG93Q29waWVkIiwic2V0VGltZW91dCIsIkNvbXBvbmVudCIsIlBvcG92ZXJCb2R5UmFkaXVtaXplZCIsIlN0YWdlVGl0bGVCYXIiLCJoYW5kbGVDb25uZWN0aW9uQ2xpY2siLCJiaW5kIiwiaGFuZGxlVW5kb0NsaWNrIiwiaGFuZGxlUmVkb0NsaWNrIiwiaGFuZGxlU2F2ZVNuYXBzaG90Q2xpY2siLCJoYW5kbGVNZXJnZVJlc29sdmVPdXJzIiwiaGFuZGxlTWVyZ2VSZXNvbHZlVGhlaXJzIiwiX2lzTW91bnRlZCIsInN0YXRlIiwic25hcHNob3RTYXZlUmVzb2x1dGlvblN0cmF0ZWd5TmFtZSIsInNuYXBzaG90TWVyZ2VDb25mbGljdHMiLCJzbmFwc2hvdFNhdmVFcnJvciIsInNob3dTaGFyZVBvcG92ZXIiLCJwcm9qZWN0SW5mb0ZldGNoRXJyb3IiLCJwcm9qZWN0SW5mbyIsImdpdFVuZG9hYmxlcyIsImdpdFJlZG9hYmxlcyIsInBlcmZvcm1Qcm9qZWN0SW5mb0ZldGNoIiwiX2ZldGNoTWFzdGVyU3RhdGVJbnRlcnZhbCIsInNldEludGVydmFsIiwid2Vic29ja2V0IiwicmVxdWVzdCIsIm1ldGhvZCIsInBhcmFtcyIsImZvbGRlciIsImhlYXJ0YmVhdEVyciIsIm1hc3RlclN0YXRlIiwiRXJyb3IiLCJjb25zb2xlIiwiZXJyb3IiLCJjbGVhckludGVydmFsIiwiY3JlYXRlTm90aWNlIiwidHlwZSIsInRpdGxlIiwibWVzc2FnZSIsInNlbmQiLCJvbiIsImVyciIsImNvbW1pdE1lc3NhZ2UiLCJzYXZlU3RyYXRlZ3kiLCJ0b3VyQ2xpZW50IiwibmV4dCIsInBlcmZvcm1Qcm9qZWN0U2F2ZSIsInByb2plY3QiLCJwcm9qZWN0TmFtZSIsInVzZXJuYW1lIiwicGFzc3dvcmQiLCJyZWNlaXZlUHJvamVjdEluZm8iLCJzaGFyZUxpbmsiLCJvdGhlck9iamVjdCIsInByb2oiLCJvcmdhbml6YXRpb24iLCJvcmdhbml6YXRpb25OYW1lIiwidXVpZCIsInByb2plY3RVaWQiLCJzaGEiLCJicmFuY2giLCJicmFuY2hOYW1lIiwiY2IiLCJnZXRQcm9qZWN0U2F2ZU9wdGlvbnMiLCJoYWlrdVRyYWNrIiwid2l0aFByb2plY3RJbmZvIiwicmVxdWVzdFNhdmVQcm9qZWN0Iiwic25hcHNob3REYXRhIiwiY29uZmxpY3RzIiwid2FybiIsImluZm8iLCJtYXJnaW5SaWdodCIsIk9SQU5HRSIsIm92ZXJmbG93IiwidGV4dERlY29yYXRpb24iLCJHUkVFTiIsIlJFRCIsImJ0bkljb25Ib3ZlciIsImJ0blRleHQiLCJyaWdodEJ0bnMiLCJyZW5kZXJTbmFwc2hvdFNhdmVJbm5lckJ1dHRvbiIsInJlbmRlck1lcmdlQ29uZmxpY3RSZXNvbHV0aW9uQXJlYSIsImJ0bkljb24iLCJwcm9wVHlwZXMiLCJQcm9wVHlwZXMiLCJzdHJpbmciLCJpc1JlcXVpcmVkIiwib2JqZWN0IiwiZnVuYyIsInJlbW92ZU5vdGljZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOztBQUNBOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7O0FBV0EsSUFBSUEsV0FBV0MsUUFBUSx3Q0FBUixDQUFmOztBQUVBLElBQU1DLFNBQVM7QUFDYkMsUUFBTTtBQUNKQyxhQUFTO0FBREwsR0FETztBQUliQyxTQUFPO0FBQ0xDLHFCQUFpQixrQkFBUUMsSUFEcEI7QUFFTEMsY0FBVSxVQUZMO0FBR0xDLFNBQUssQ0FIQTtBQUlMQyxZQUFRLENBSkg7QUFLTEMsWUFBUSxNQUxIO0FBTUxDLGFBQVM7QUFOSixHQUpNO0FBWWJDLFlBQVU7QUFDUkMsYUFBUyxHQUREO0FBRVJDLFlBQVE7QUFGQSxHQVpHO0FBZ0JiQyxnQkFBYztBQUNaUixjQUFVLFVBREU7QUFFWkMs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V0FBVyxLQUFLMEQsS0FBTCxDQUFXc0MsU0FBcEM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBakNKLE9BREY7QUF1Q0Q7Ozs7RUEvVHlCLGdCQUFNdkIsUzs7QUFrVWxDRSxjQUFjZ0YsU0FBZCxHQUEwQjtBQUN4QnZELFVBQVEsZ0JBQU13RCxTQUFOLENBQWdCQyxNQUFoQixDQUF1QkMsVUFEUDtBQUV4QnRDLGVBQWEsZ0JBQU1vQyxTQUFOLENBQWdCQyxNQUZMO0FBR3hCcEMsWUFBVSxnQkFBTW1DLFNBQU4sQ0FBZ0JDLE1BSEY7QUFJeEJuQyxZQUFVLGdCQUFNa0MsU0FBTixDQUFnQkMsTUFKRjtBQUt4QjdELGFBQVcsZ0JBQU00RCxTQUFOLENBQWdCRyxNQUFoQixDQUF1QkQsVUFMVjtBQU14Qm5ELGdCQUFjLGdCQUFNaUQsU0FBTixDQUFnQkksSUFBaEIsQ0FBcUJGLFVBTlg7QUFPeEJHLGdCQUFjLGdCQUFNTCxTQUFOLENBQWdCSSxJQUFoQixDQUFxQkYsVUFQWDtBQVF4Qm5DLHNCQUFvQixnQkFBTWlDLFNBQU4sQ0FBZ0JJO0FBUlosQ0FBMUI7O2tCQVdlLHNCQUFPckYsYUFBUCxDIiwiZmlsZSI6IlN0YWdlVGl0bGVCYXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgeyBzaGVsbCwgaXBjUmVuZGVyZXIgfSBmcm9tICdlbGVjdHJvbidcbmltcG9ydCBSYWRpdW0gZnJvbSAncmFkaXVtJ1xuaW1wb3J0IFBvcG92ZXIgZnJvbSAncmVhY3QtcG9wb3ZlcidcbmltcG9ydCBhc3NpZ24gZnJvbSAnbG9kYXNoLmFzc2lnbidcbmltcG9ydCBQYWxldHRlIGZyb20gJy4vUGFsZXR0ZSdcbmltcG9ydCB7IFRocmVlQm91bmNlIH0gZnJvbSAnYmV0dGVyLXJlYWN0LXNwaW5raXQnXG5pbXBvcnQgQ29sb3IgZnJvbSAnY29sb3InXG5pbXBvcnQgeyBCVE5fU1RZTEVTIH0gZnJvbSAnLi4vc3R5bGVzL2J0blNoYXJlZCdcbmltcG9ydCBDb3B5VG9DbGlwYm9hcmQgZnJvbSAncmVhY3QtY29weS10by1jbGlwYm9hcmQnXG5pbXBvcnQgVG9vbFNlbGVjdG9yIGZyb20gJy4vVG9vbFNlbGVjdG9yJ1xuaW1wb3J0IHtcbiAgUHVibGlzaFNuYXBzaG90U1ZHLFxuICBDb25uZWN0aW9uSWNvblNWRyxcbiAgLy8gVW5kb0ljb25TVkcsXG4gIC8vIFJlZG9JY29uU1ZHLFxuICBXYXJuaW5nSWNvblNWRyxcbiAgU3VjY2Vzc0ljb25TVkcsXG4gIERhbmdlckljb25TVkcsXG4gIENsaWJvYXJkSWNvblNWR1xufSBmcm9tICcuL0ljb25zJ1xuXG52YXIgbWl4cGFuZWwgPSByZXF1aXJlKCdoYWlrdS1zZXJpYWxpemF0aW9uL3NyYy91dGlscy9NaXhwYW5lbCcpXG5cbmNvbnN0IFNUWUxFUyA9IHtcbiAgaGlkZToge1xuICAgIGRpc3BsYXk6ICdub25lJ1xuICB9LFxuICBmcmFtZToge1xuICAgIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5DT0FMLFxuICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICAgIHRvcDogMCxcbiAgICB6SW5kZXg6IDEsXG4gICAgaGVpZ2h0OiAnMzZweCcsXG4gICAgcGFkZGluZzogJzZweCdcbiAgfSxcbiAgZGlzYWJsZWQ6IHtcbiAgICBvcGFjaXR5OiAwLjUsXG4gICAgY3Vyc29yOiAnbm90LWFsbG93ZWQnXG4gIH0sXG4gIHNoYXJlUG9wb3Zlcjoge1xuICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgIHRvcDogMzQsXG4gICAgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLkZBVEhFUl9DT0FMLFxuICAgIHdpZHRoOiAyMDQsXG4gICAgcGFkZGluZzogJzEzcHggOXB4JyxcbiAgICBmb250U2l6ZTogMTcsXG4gICAgY29sb3I6IFBhbGV0dGUuUk9DSyxcbiAgICB0ZXh0QWxpZ246ICdjZW50ZXInLFxuICAgIGJvcmRlclJhZGl1czogNCxcbiAgICBib3hTaGFkb3c6ICcwIDZweCAyNXB4IDAgJyArIFBhbGV0dGUuRkFUSEVSX0NPQUxcbiAgfSxcbiAgcG9wb3ZlckNsb3NlOiB7XG4gICAgY29sb3I6ICd3aGl0ZScsXG4gICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgdG9wOiA1LFxuICAgIHJpZ2h0OiAxMCxcbiAgICBmb250U2l6ZTogMTUsXG4gICAgdGV4dFRyYW5zZm9ybTogJ2xvd2VyY2FzZSdcbiAgfSxcbiAgZm9vdGVyOiB7XG4gICAgYmFja2dyb3VuZENvbG9yOiBDb2xvcihQYWxldHRlLkRBUktfR1JBWSkuZmFkZSgwLjcpLFxuICAgIGhlaWdodDogMjUsXG4gICAgd2lkdGg6ICcxMDAlJyxcbiAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICBib3R0b206IDAsXG4gICAgZm9udFNpemU6IDEwLFxuICAgIGJvcmRlckJvdHRvbVJpZ2h0UmFkaXVzOiAzLFxuICAgIGJvcmRlckJvdHRvbUxlZnRSYWRpdXM6IDMsXG4gICAgcGFkZGluZ1RvcDogNVxuICB9LFxuICB0aW1lOiB7XG4gICAgZm9udFdlaWdodDogJ2JvbGQnLFxuICAgIG1hcmdpbkxlZnQ6IDVcbiAgfSxcbiAgY29weToge1xuICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgIGhlaWdodDogJzEwMCUnLFxuICAgIHdpZHRoOiAyNSxcbiAgICByaWdodDogMCxcbiAgICBwYWRkaW5nVG9wOiAyLFxuICAgIGRpc3BsYXk6ICdmbGV4JyxcbiAgICBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicsXG4gICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLkRBUktfR1JBWVxuICB9LFxuICBjb3B5TG9hZGluZzoge1xuICAgIHBhZGRpbmdUb3A6IDAsXG4gICAgcGFkZGluZ0JvdHRvbTogNixcbiAgICBwb2ludGVyRXZlbnRzOiAnbm9uZSdcbiAgfSxcbiAgbGlua0hvbHN0ZXI6IHtcbiAgICBoZWlnaHQ6IDI5LFxuICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICAgIGJvcmRlclJhZGl1czogMyxcbiAgICBtYXJnaW5Ub3A6IDMsXG4gICAgY3Vyc29yOiAncG9pbnRlcicsXG4gICAgYmFja2dyb3VuZENvbG9yOiBDb2xvcihQYWxldHRlLkRBUktfR1JBWSkuZmFkZSgwLjY4KSxcbiAgICBib3JkZXI6ICcxcHggc29saWQgJyArIFBhbGV0dGUuREFSS19HUkFZXG5cbiAgfSxcbiAgbGluazoge1xuICAgIGZvbnRTaXplOiAxMCxcbiAgICBjb2xvcjogQ29sb3IoUGFsZXR0ZS5MSUdIVF9CTFVFKS5saWdodGVuKDAuMzcpLFxuICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgIGxlZnQ6IDcsXG4gICAgdG9wOiA3LFxuICAgIGN1cnNvcjogJ3BvaW50ZXInXG4gIH0sXG4gIGdlbmVyYXRpbmdMaW5rOiB7XG4gICAgY29sb3I6IFBhbGV0dGUuUk9DSyxcbiAgICBjdXJzb3I6ICdkZWZhdWx0JyxcbiAgICBmb250U3R5bGU6ICdpdGFsaWMnXG4gIH1cbn1cblxuY29uc3QgU05BUFNIT1RfU0FWRV9SRVNPTFVUSU9OX1NUUkFURUdJRVMgPSB7XG4gIG5vcm1hbDogeyBzdHJhdGVneTogJ3JlY3Vyc2l2ZScsIGZhdm9yOiAnb3VycycgfSxcbiAgb3VyczogeyBzdHJhdGVneTogJ291cnMnIH0sXG4gIHRoZWlyczogeyBzdHJhdGVneTogJ3RoZWlycycgfVxufVxuXG5jbGFzcyBQb3BvdmVyQm9keSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHNob3VsZENvbXBvbmVudFVwZGF0ZSAobmV4dFByb3BzKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIHRoaXMucHJvcHMudGl0bGVUZXh0ICE9PSBuZXh0UHJvcHMudGl0bGVUZXh0IHx8XG4gICAgICB0aGlzLnByb3BzLmxpbmtBZGRyZXNzICE9PSBuZXh0UHJvcHMubGlua0FkZHJlc3MgfHxcbiAgICAgIHRoaXMucHJvcHMuaXNTbmFwc2hvdFNhdmVJblByb2dyZXNzICE9PSBuZXh0UHJvcHMuaXNTbmFwc2hvdFNhdmVJblByb2dyZXNzIHx8XG4gICAgICB0aGlzLnByb3BzLnNuYXBzaG90U2F2ZUNvbmZpcm1lZCAhPT0gbmV4dFByb3BzLnNuYXBzaG90U2F2ZUNvbmZpcm1lZCB8fFxuICAgICAgdGhpcy5wcm9wcy5pc1Byb2plY3RJbmZvRmV0Y2hJblByb2dyZXNzICE9PSBuZXh0UHJvcHMuaXNQcm9qZWN0SW5mb0ZldGNoSW5Qcm9ncmVzc1xuICAgIClcbiAgfVxuXG4gIHJlbmRlciAoKSB7XG4gICAgbGV0IHBvcG92ZXJQb3NpdGlvblxuXG4gICAgaWYgKHRoaXMucHJvcHMuc25hcHNob3RTYXZlQ29uZmlybWVkKSB7XG4gICAgICBwb3BvdmVyUG9zaXRpb24gPSAtNzJcbiAgICB9IGVsc2UgaWYgKHRoaXMucHJvcHMuaXNTbmFwc2hvdFNhdmVJblByb2dyZXNzKSB7XG4gICAgICBwb3BvdmVyUG9zaXRpb24gPSAtNzBcbiAgICB9IGVsc2Uge1xuICAgICAgcG9wb3ZlclBvc2l0aW9uID0gLTU5XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgc3R5bGU9e1tTVFlMRVMuc2hhcmVQb3BvdmVyLCB7cmlnaHQ6IHBvcG92ZXJQb3NpdGlvbn1dfT5cbiAgICAgICAgPGJ1dHRvbiBzdHlsZT17U1RZTEVTLnBvcG92ZXJDbG9zZX0gb25DbGljaz17dGhpcy5wcm9wcy5jbG9zZX0+eDwvYnV0dG9uPlxuICAgICAgICB7dGhpcy5wcm9wcy50aXRsZVRleHR9XG4gICAgICAgIDxkaXYgc3R5bGU9e1NUWUxFUy5saW5rSG9sc3Rlcn0+XG4gICAgICAgICAgeyh0aGlzLnByb3BzLmlzU25hcHNob3RTYXZlSW5Qcm9ncmVzcyB8fCB0aGlzLnByb3BzLmlzUHJvamVjdEluZm9GZXRjaEluUHJvZ3Jlc3MpXG4gICAgICAgICAgICA/IDxzcGFuIHN0eWxlPXtbU1RZTEVTLmxpbmssIFNUWUxFUy5nZW5lcmF0aW5nTGlua119PlVwZGF0aW5nIFNoYXJlIFBhZ2U8L3NwYW4+XG4gICAgICAgICAgICA6IDxzcGFuIHN0eWxlPXtTVFlMRVMubGlua30gb25DbGljaz17KCkgPT4gc2hlbGwub3BlbkV4dGVybmFsKHRoaXMucHJvcHMubGlua0FkZHJlc3MpfT57dGhpcy5wcm9wcy5saW5rQWRkcmVzcy5zdWJzdHJpbmcoMCwgMzMpfTwvc3Bhbj59XG4gICAgICAgICAgPENvcHlUb0NsaXBib2FyZFxuICAgICAgICAgICAgdGV4dD17dGhpcy5wcm9wcy5saW5rQWRkcmVzc31cbiAgICAgICAgICAgIG9uQ29weT17KCkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLnByb3BzLnBhcmVudC5zZXRTdGF0ZSh7Y29waWVkOiB0cnVlfSlcbiAgICAgICAgICAgICAgdGhpcy5wcm9wcy5wYXJlbnQuc2V0U3RhdGUoe3Nob3dDb3BpZWQ6IHRydWV9LCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICB0aGlzLnByb3BzLnBhcmVudC5zZXRTdGF0ZSh7c2hvd0NvcGllZDogZmFsc2V9KVxuICAgICAgICAgICAgICAgIH0sIDE5MDApXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9fT5cbiAgICAgICAgICAgIHsodGhpcy5wcm9wcy5pc1NuYXBzaG90U2F2ZUluUHJvZ3Jlc3MgfHwgdGhpcy5wcm9wcy5pc1Byb2plY3RJbmZvRmV0Y2hJblByb2dyZXNzKVxuICAgICAgICAgICAgICA/IDxzcGFuIHN0eWxlPXtbU1RZTEVTLmNvcHksIFNUWUxFUy5jb3B5TG9hZGluZ119PjxUaHJlZUJvdW5jZSBzaXplPXszfSBjb2xvcj17UGFsZXR0ZS5ST0NLfSAvPjwvc3Bhbj5cbiAgICAgICAgICAgICAgOiA8c3BhbiBzdHlsZT17U1RZTEVTLmNvcHl9PjxDbGlib2FyZEljb25TVkcgLz48L3NwYW4+fVxuICAgICAgICAgIDwvQ29weVRvQ2xpcGJvYXJkPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgey8qIHRvZG86IHNob3cgbGFzdCB1cGRhdGVkPyA8ZGl2IHN0eWxlPXtTVFlMRVMuZm9vdGVyfT5VUERBVEVEPHNwYW4gc3R5bGU9e1NUWUxFUy50aW1lfT57Jzk6MDBhbSBKdW4gMTUsIDIwMTcnfTwvc3Bhbj48L2Rpdj4gKi99XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cbn1cblxuY29uc3QgUG9wb3ZlckJvZHlSYWRpdW1pemVkID0gUmFkaXVtKFBvcG92ZXJCb2R5KVxuXG5jbGFzcyBTdGFnZVRpdGxlQmFyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IgKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpXG4gICAgdGhpcy5oYW5kbGVDb25uZWN0aW9uQ2xpY2sgPSB0aGlzLmhhbmRsZUNvbm5lY3Rpb25DbGljay5iaW5kKHRoaXMpXG4gICAgdGhpcy5oYW5kbGVVbmRvQ2xpY2sgPSB0aGlzLmhhbmRsZVVuZG9DbGljay5iaW5kKHRoaXMpXG4gICAgdGhpcy5oYW5kbGVSZWRvQ2xpY2sgPSB0aGlzLmhhbmRsZVJlZG9DbGljay5iaW5kKHRoaXMpXG4gICAgdGhpcy5oYW5kbGVTYXZlU25hcHNob3RDbGljayA9IHRoaXMuaGFuZGxlU2F2ZVNuYXBzaG90Q2xpY2suYmluZCh0aGlzKVxuICAgIHRoaXMuaGFuZGxlTWVyZ2VSZXNvbHZlT3VycyA9IHRoaXMuaGFuZGxlTWVyZ2VSZXNvbHZlT3Vycy5iaW5kKHRoaXMpXG4gICAgdGhpcy5oYW5kbGVNZXJnZVJlc29sdmVUaGVpcnMgPSB0aGlzLmhhbmRsZU1lcmdlUmVzb2x2ZVRoZWlycy5iaW5kKHRoaXMpXG4gICAgdGhpcy5faXNNb3VudGVkID0gZmFsc2VcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgc25hcHNob3RTYXZlUmVzb2x1dGlvblN0cmF0ZWd5TmFtZTogJ25vcm1hbCcsXG4gICAgICBpc1NuYXBzaG90U2F2ZUluUHJvZ3Jlc3M6IGZhbHNlLFxuICAgICAgc25hcHNob3RNZXJnZUNvbmZsaWN0czogbnVsbCxcbiAgICAgIHNuYXBzaG90U2F2ZUNvbmZpcm1lZDogbnVsbCxcbiAgICAgIHNuYXBzaG90U2F2ZUVycm9yOiBudWxsLFxuICAgICAgc2hvd1NoYXJlUG9wb3ZlcjogZmFsc2UsXG4gICAgICBjb3BpZWQ6IGZhbHNlLFxuICAgICAgbGlua0FkZHJlc3M6ICdGZXRjaGluZyBJbmZvJyxcbiAgICAgIHNob3dDb3BpZWQ6IGZhbHNlLFxuICAgICAgcHJvamVjdEluZm9GZXRjaEVycm9yOiBudWxsLFxuICAgICAgaXNQcm9qZWN0SW5mb0ZldGNoSW5Qcm9ncmVzczogZmFsc2UsXG4gICAgICBwcm9qZWN0SW5mbzogbnVsbCxcbiAgICAgIGdpdFVuZG9hYmxlczogW10sXG4gICAgICBnaXRSZWRvYWJsZXM6IFtdXG4gICAgfVxuICB9XG5cbiAgY29tcG9uZW50V2lsbE1vdW50ICgpIHtcbiAgICB0aGlzLl9pc01vdW50ZWQgPSB0cnVlXG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCAoKSB7XG4gICAgdGhpcy5wZXJmb3JtUHJvamVjdEluZm9GZXRjaCgpXG5cbiAgICAvLyBJdCdzIGtpbmQgb2Ygd2VpcmQgdG8gaGF2ZSB0aGlzIGhlYXJ0YmVhdCBsb2dpYyBidXJpZWQgYWxsIHRoZSB3YXkgZG93biBoZXJlIGluc2lkZSBTdGF0ZVRpdGxlQmFyO1xuICAgIC8vIGl0IHByb2JhYmx5IHNob3VsZCBiZSBtb3ZlZCB1cCB0byB0aGUgQ3JlYXRvciBsZXZlbCBzbyBpdCdzIGVhc2llciB0byBmaW5kICNGSVhNRVxuICAgIHRoaXMuX2ZldGNoTWFzdGVyU3RhdGVJbnRlcnZhbCA9IHNldEludGVydmFsKCgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLnByb3BzLndlYnNvY2tldC5yZXF1ZXN0KHsgbWV0aG9kOiAnbWFzdGVySGVhcnRiZWF0JywgcGFyYW1zOiBbdGhpcy5wcm9wcy5mb2xkZXJdIH0sIChoZWFydGJlYXRFcnIsIG1hc3RlclN0YXRlKSA9PiB7XG4gICAgICAgIGlmIChoZWFydGJlYXRFcnIgfHwgIW1hc3RlclN0YXRlKSB7XG4gICAgICAgICAgLy8gSWYgbWFzdGVyIGRpc2Nvbm5lY3RzIHdlIG1pZ2h0IG5vdCBldmVuIGdldCBhbiBlcnJvciwgc28gY3JlYXRlIGEgZmFrZSBlcnJvciBpbiBpdHMgcGxhY2VcbiAgICAgICAgICBpZiAoIWhlYXJ0YmVhdEVycikgaGVhcnRiZWF0RXJyID0gbmV3IEVycm9yKCdVbmtub3duIHByb2JsZW0gd2l0aCBtYXN0ZXIgaGVhcnRiZWF0JylcbiAgICAgICAgICBjb25zb2xlLmVycm9yKGhlYXJ0YmVhdEVycilcblxuICAgICAgICAgIC8vIElmIG1hc3RlciBoYXMgZGlzY29ubmVjdGVkLCBzdG9wIHJ1bm5pbmcgdGhpcyBpbnRlcnZhbCBzbyB3ZSBkb24ndCBnZXQgcHVsc2luZyBlcnJvciBtZXNzYWdlc1xuICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy5fZmV0Y2hNYXN0ZXJTdGF0ZUludGVydmFsKVxuXG4gICAgICAgICAgLy8gQnV0IHRoZSBmaXJzdCB0aW1lIHdlIGdldCB0aGlzLCBkaXNwbGF5IGEgdXNlciBub3RpY2UgLSB0aGV5IHByb2JhYmx5IG5lZWQgdG8gcmVzdGFydCBIYWlrdSB0byBnZXRcbiAgICAgICAgICAvLyBpbnRvIGEgYmV0dGVyIHN0YXRlLCBhdCBsZWFzdCB1bnRpbCB3ZSBjYW4gcmVzb2x2ZSB3aGF0IHRoZSBjYXVzZSBvZiB0aGlzIHByb2JsZW0gaXNcbiAgICAgICAgICByZXR1cm4gdGhpcy5wcm9wcy5jcmVhdGVOb3RpY2Uoe1xuICAgICAgICAgICAgdHlwZTogJ2RhbmdlcicsXG4gICAgICAgICAgICB0aXRsZTogJ1VoIG9oIScsXG4gICAgICAgICAgICBtZXNzYWdlOiAnSGFpa3UgaXMgaGF2aW5nIGEgcHJvYmxlbSBhY2Nlc3NpbmcgeW91ciBwcm9qZWN0LiDwn5iiIFBsZWFzZSByZXN0YXJ0IEhhaWt1LiBJZiB5b3Ugc2VlIHRoaXMgZXJyb3IgYWdhaW4sIGNvbnRhY3QgSGFpa3UgZm9yIHN1cHBvcnQuJ1xuICAgICAgICAgIH0pXG4gICAgICAgIH1cblxuICAgICAgICBpcGNSZW5kZXJlci5zZW5kKCdtYXN0ZXI6aGVhcnRiZWF0JywgYXNzaWduKHt9LCBtYXN0ZXJTdGF0ZSkpXG5cbiAgICAgICAgaWYgKHRoaXMuX2lzTW91bnRlZCkge1xuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgZ2l0VW5kb2FibGVzOiBtYXN0ZXJTdGF0ZS5naXRVbmRvYWJsZXMsXG4gICAgICAgICAgICBnaXRSZWRvYWJsZXM6IG1hc3RlclN0YXRlLmdpdFJlZG9hYmxlc1xuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSwgMTAwMClcblxuICAgIGlwY1JlbmRlcmVyLm9uKCdnbG9iYWwtbWVudTpzYXZlJywgKCkgPT4ge1xuICAgICAgdGhpcy5oYW5kbGVTYXZlU25hcHNob3RDbGljaygpXG4gICAgfSlcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50ICgpIHtcbiAgICB0aGlzLl9pc01vdW50ZWQgPSBmYWxzZVxuICAgIGNsZWFySW50ZXJ2YWwodGhpcy5fZmV0Y2hNYXN0ZXJTdGF0ZUludGVydmFsKVxuICB9XG5cbiAgaGFuZGxlQ29ubmVjdGlvbkNsaWNrICgpIHtcbiAgICAvLyBUT0RPXG4gIH1cblxuICBoYW5kbGVVbmRvQ2xpY2sgKCkge1xuICAgIHJldHVybiB0aGlzLnByb3BzLndlYnNvY2tldC5yZXF1ZXN0KHsgbWV0aG9kOiAnZ2l0VW5kbycsIHBhcmFtczogW3RoaXMucHJvcHMuZm9sZGVyLCB7IHR5cGU6ICdnbG9iYWwnIH1dIH0sIChlcnIpID0+IHtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihlcnIpXG4gICAgICAgIHJldHVybiB0aGlzLnByb3BzLmNyZWF0ZU5vdGljZSh7XG4gICAgICAgICAgdHlwZTogJ3dhcm5pbmcnLFxuICAgICAgICAgIHRpdGxlOiAnVWggb2ghJyxcbiAgICAgICAgICBtZXNzYWdlOiAnV2Ugd2VyZSB1bmFibGUgdG8gdW5kbyB5b3VyIGxhc3QgYWN0aW9uLiDwn5iiIFBsZWFzZSBjb250YWN0IEhhaWt1IGZvciBzdXBwb3J0LidcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgaGFuZGxlUmVkb0NsaWNrICgpIHtcbiAgICByZXR1cm4gdGhpcy5wcm9wcy53ZWJzb2NrZXQucmVxdWVzdCh7IG1ldGhvZDogJ2dpdFJlZG8nLCBwYXJhbXM6IFt0aGlzLnByb3BzLmZvbGRlciwgeyB0eXBlOiAnZ2xvYmFsJyB9XSB9LCAoZXJyKSA9PiB7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKVxuICAgICAgICByZXR1cm4gdGhpcy5wcm9wcy5jcmVhdGVOb3RpY2Uoe1xuICAgICAgICAgIHR5cGU6ICd3YXJuaW5nJyxcbiAgICAgICAgICB0aXRsZTogJ1VoIG9oIScsXG4gICAgICAgICAgbWVzc2FnZTogJ1dlIHdlcmUgdW5hYmxlIHRvIHJlZG8geW91ciBsYXN0IGFjdGlvbi4g8J+YoiBQbGVhc2UgY29udGFjdCBIYWlrdSBmb3Igc3VwcG9ydC4nXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGdldFByb2plY3RTYXZlT3B0aW9ucyAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbW1pdE1lc3NhZ2U6ICdDaGFuZ2VzIHNhdmVkICh2aWEgSGFpa3UgRGVza3RvcCknLFxuICAgICAgc2F2ZVN0cmF0ZWd5OiBTTkFQU0hPVF9TQVZFX1JFU09MVVRJT05fU1RSQVRFR0lFU1t0aGlzLnN0YXRlLnNuYXBzaG90U2F2ZVJlc29sdXRpb25TdHJhdGVneU5hbWVdXG4gICAgfVxuICB9XG5cbiAgaGFuZGxlU2F2ZVNuYXBzaG90Q2xpY2sgKCkge1xuICAgIGlmICh0aGlzLnN0YXRlLnNuYXBzaG90U2F2ZUVycm9yKSByZXR1cm4gdm9pZCAoMClcbiAgICBpZiAodGhpcy5zdGF0ZS5pc1NuYXBzaG90U2F2ZUluUHJvZ3Jlc3MpIHJldHVybiB2b2lkICgwKVxuICAgIGlmICh0aGlzLnN0YXRlLnNuYXBzaG90TWVyZ2VDb25mbGljdHMpIHJldHVybiB2b2lkICgwKVxuICAgIGlmICh0aGlzLnN0YXRlLnNob3dTaGFyZVBvcG92ZXIpIHJldHVybiB2b2lkICgwKVxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7c2hvd1NoYXJlUG9wb3ZlcjogIXRoaXMuc3RhdGUuc2hvd1NoYXJlUG9wb3Zlcn0pXG5cbiAgICBpZiAodGhpcy5wcm9wcy50b3VyQ2xpZW50KSB0aGlzLnByb3BzLnRvdXJDbGllbnQubmV4dCgpXG5cbiAgICByZXR1cm4gdGhpcy5wZXJmb3JtUHJvamVjdFNhdmUoKVxuICB9XG5cbiAgcGVyZm9ybVByb2plY3RJbmZvRmV0Y2ggKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoeyBpc1Byb2plY3RJbmZvRmV0Y2hJblByb2dyZXNzOiB0cnVlIH0pXG4gICAgcmV0dXJuIHRoaXMucHJvcHMud2Vic29ja2V0LnJlcXVlc3QoeyBtZXRob2Q6ICdmZXRjaFByb2plY3RJbmZvJywgcGFyYW1zOiBbdGhpcy5wcm9wcy5mb2xkZXIsIHRoaXMucHJvcHMucHJvamVjdC5wcm9qZWN0TmFtZSwgdGhpcy5wcm9wcy51c2VybmFtZSwgdGhpcy5wcm9wcy5wYXNzd29yZCwge31dIH0sIChwcm9qZWN0SW5mb0ZldGNoRXJyb3IsIHByb2plY3RJbmZvKSA9PiB7XG4gICAgICB0aGlzLnNldFN0YXRlKHsgaXNQcm9qZWN0SW5mb0ZldGNoSW5Qcm9ncmVzczogZmFsc2UgfSlcblxuICAgICAgaWYgKHByb2plY3RJbmZvRmV0Y2hFcnJvcikge1xuICAgICAgICBpZiAocHJvamVjdEluZm9GZXRjaEVycm9yLm1lc3NhZ2UpIHtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKHByb2plY3RJbmZvRmV0Y2hFcnJvci5tZXNzYWdlKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ3Vua25vd24gcHJvYmxlbSBmZXRjaGluZyBwcm9qZWN0JylcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFdlIG1pZ2h0IG9ubHkgY2FyZSBhYm91dCB0aGlzIGlmIGl0IGNvbWVzIHVwIGR1cmluZyBhIHNhdmUuLi4gI0ZJWE1FID8/XG4gICAgICAgIGlmIChwcm9qZWN0SW5mb0ZldGNoRXJyb3IubWVzc2FnZSA9PT0gJ1RpbWVkIG91dCB3YWl0aW5nIGZvciBwcm9qZWN0IHNoYXJlIGluZm8nKSB7XG4gICAgICAgICAgLy8gP1xuICAgICAgICAgIHJldHVybiB2b2lkICgwKSAvLyBHb3R0YSByZXR1cm4gaGVyZSAtIGRvbid0IHdhbnQgdG8gZmFsbCB0aHJvdWdoIGFzIHRob3VnaCB3ZSBhY3R1YWxseSBnb3QgcHJvamVjdEluZm8gYmVsb3dcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5zZXRTdGF0ZSh7IHByb2plY3RJbmZvRmV0Y2hFcnJvciB9KVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMuc2V0U3RhdGUoeyBwcm9qZWN0SW5mbyB9KVxuICAgICAgaWYgKHRoaXMucHJvcHMucmVjZWl2ZVByb2plY3RJbmZvKSB0aGlzLnByb3BzLnJlY2VpdmVQcm9qZWN0SW5mbyhwcm9qZWN0SW5mbylcbiAgICAgIGlmIChwcm9qZWN0SW5mby5zaGFyZUxpbmspIHRoaXMuc2V0U3RhdGUoeyBsaW5rQWRkcmVzczogcHJvamVjdEluZm8uc2hhcmVMaW5rIH0pXG4gICAgfSlcbiAgfVxuXG4gIHdpdGhQcm9qZWN0SW5mbyAob3RoZXJPYmplY3QpIHtcbiAgICBsZXQgcHJvaiA9IHRoaXMuc3RhdGUucHJvamVjdEluZm8gfHwge31cbiAgICByZXR1cm4gYXNzaWduKHt9LCBvdGhlck9iamVjdCwge1xuICAgICAgb3JnYW5pemF0aW9uOiBwcm9qLm9yZ2FuaXphdGlvbk5hbWUsXG4gICAgICB1dWlkOiBwcm9qLnByb2plY3RVaWQsXG4gICAgICBzaGE6IHByb2ouc2hhLFxuICAgICAgYnJhbmNoOiBwcm9qLmJyYW5jaE5hbWVcbiAgICB9KVxuICB9XG5cbiAgcmVxdWVzdFNhdmVQcm9qZWN0IChjYikge1xuICAgIHJldHVybiB0aGlzLnByb3BzLndlYnNvY2tldC5yZXF1ZXN0KHsgbWV0aG9kOiAnc2F2ZVByb2plY3QnLCBwYXJhbXM6IFt0aGlzLnByb3BzLmZvbGRlciwgdGhpcy5wcm9wcy5wcm9qZWN0LnByb2plY3ROYW1lLCB0aGlzLnByb3BzLnVzZXJuYW1lLCB0aGlzLnByb3BzLnBhc3N3b3JkLCB0aGlzLmdldFByb2plY3RTYXZlT3B0aW9ucygpXSB9LCBjYilcbiAgfVxuXG4gIHBlcmZvcm1Qcm9qZWN0U2F2ZSAoKSB7XG4gICAgbWl4cGFuZWwuaGFpa3VUcmFjaygnY3JlYXRvcjpwcm9qZWN0OnNhdmluZycsIHRoaXMud2l0aFByb2plY3RJbmZvKHtcbiAgICAgIHVzZXJuYW1lOiB0aGlzLnByb3BzLnVzZXJuYW1lLFxuICAgICAgcHJvamVjdDogdGhpcy5wcm9wcy5wcm9qZWN0TmFtZVxuICAgIH0pKVxuICAgIHRoaXMuc2V0U3RhdGUoeyBpc1NuYXBzaG90U2F2ZUluUHJvZ3Jlc3M6IHRydWUgfSlcblxuICAgIHJldHVybiB0aGlzLnJlcXVlc3RTYXZlUHJvamVjdCgoc25hcHNob3RTYXZlRXJyb3IsIHNuYXBzaG90RGF0YSkgPT4ge1xuICAgICAgaWYgKHNuYXBzaG90U2F2ZUVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3Ioc25hcHNob3RTYXZlRXJyb3IpXG4gICAgICAgIGlmIChzbmFwc2hvdFNhdmVFcnJvci5tZXNzYWdlID09PSAnVGltZWQgb3V0IHdhaXRpbmcgZm9yIHByb2plY3Qgc2hhcmUgaW5mbycpIHtcbiAgICAgICAgICB0aGlzLnByb3BzLmNyZWF0ZU5vdGljZSh7XG4gICAgICAgICAgICB0eXBlOiAnd2FybmluZycsXG4gICAgICAgICAgICB0aXRsZTogJ0htbS4uLicsXG4gICAgICAgICAgICBtZXNzYWdlOiAnUHVibGlzaGluZyB5b3VyIHByb2plY3Qgc2VlbXMgdG8gYmUgdGFraW5nIGEgbG9uZyB0aW1lLiDwn5iiIFBsZWFzZSB0cnkgYWdhaW4gaW4gYSBmZXcgbW9tZW50cy4gSWYgeW91IHNlZSB0aGlzIG1lc3NhZ2UgYWdhaW4sIGNvbnRhY3QgSGFpa3UgZm9yIHN1cHBvcnQuJ1xuICAgICAgICAgIH0pXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5wcm9wcy5jcmVhdGVOb3RpY2Uoe1xuICAgICAgICAgICAgdHlwZTogJ2RhbmdlcicsXG4gICAgICAgICAgICB0aXRsZTogJ09oIG5vIScsXG4gICAgICAgICAgICBtZXNzYWdlOiAnV2Ugd2VyZSB1bmFibGUgdG8gcHVibGlzaCB5b3VyIHByb2plY3QuIPCfmKIgUGxlYXNlIHRyeSBhZ2FpbiBpbiBhIGZldyBtb21lbnRzLiBJZiB5b3Ugc3RpbGwgc2VlIHRoaXMgZXJyb3IsIGNvbnRhY3QgSGFpa3UgZm9yIHN1cHBvcnQuJ1xuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuc2V0U3RhdGUoeyBpc1NuYXBzaG90U2F2ZUluUHJvZ3Jlc3M6IGZhbHNlLCBzbmFwc2hvdFNhdmVSZXNvbHV0aW9uU3RyYXRlZ3lOYW1lOiAnbm9ybWFsJywgc25hcHNob3RTYXZlRXJyb3IgfSwgKCkgPT4ge1xuICAgICAgICAgIHJldHVybiBzZXRUaW1lb3V0KCgpID0+IHRoaXMuc2V0U3RhdGUoeyBzbmFwc2hvdFNhdmVFcnJvcjogbnVsbCB9KSwgMjAwMClcbiAgICAgICAgfSlcbiAgICAgIH1cblxuICAgICAgdGhpcy5zZXRTdGF0ZSh7IGlzU25hcHNob3RTYXZlSW5Qcm9ncmVzczogZmFsc2UsIHNuYXBzaG90U2F2ZUNvbmZpcm1lZDogdHJ1ZSB9KVxuXG4gICAgICBpZiAoc25hcHNob3REYXRhKSB7XG4gICAgICAgIGlmIChzbmFwc2hvdERhdGEuY29uZmxpY3RzKSB7XG4gICAgICAgICAgY29uc29sZS53YXJuKCdbY3JlYXRvcl0gTWVyZ2UgY29uZmxpY3RzIGZvdW5kIScpXG4gICAgICAgICAgdGhpcy5wcm9wcy5jcmVhdGVOb3RpY2Uoe1xuICAgICAgICAgICAgdHlwZTogJ3dhcm5pbmcnLFxuICAgICAgICAgICAgdGl0bGU6ICdNZXJnZSBjb25mbGljdHMhJyxcbiAgICAgICAgICAgIG1lc3NhZ2U6ICdXZSBjb3VsZG5cXCd0IG1lcmdlIHlvdXIgY2hhbmdlcy4g8J+YoiBZb3VcXCdsbCBuZWVkIHRvIGRlY2lkZSBob3cgdG8gbWVyZ2UgeW91ciBjaGFuZ2VzIGJlZm9yZSBjb250aW51aW5nLidcbiAgICAgICAgICB9KVxuICAgICAgICAgIHJldHVybiB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIHNuYXBzaG90TWVyZ2VDb25mbGljdHM6IHNuYXBzaG90RGF0YS5jb25mbGljdHMsXG4gICAgICAgICAgICBzaG93U2hhcmVQb3BvdmVyOiBmYWxzZVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cblxuICAgICAgICBjb25zb2xlLmluZm8oJ1tjcmVhdG9yXSBTYXZlIGNvbXBsZXRlJywgc25hcHNob3REYXRhKVxuXG4gICAgICAgIC8vIFVubGVzcyB3ZSBzZXQgYmFjayB0byBub3JtYWwsIHN1YnNlcXVlbnQgc2F2ZXMgd2lsbCBzdGlsbCBiZSBzZXQgdG8gdXNlIHRoZSBzdHJpY3Qgb3Vycy90aGVpcnMgc3RyYXRlZ3ksXG4gICAgICAgIC8vIHdoaWNoIHdpbGwgY2xvYmJlciB1cGRhdGVzIHRoYXQgd2UgbWlnaHQgd2FudCB0byBhY3R1YWxseSBtZXJnZSBncmFjZWZ1bGx5LlxuICAgICAgICB0aGlzLnNldFN0YXRlKHsgc25hcHNob3RTYXZlUmVzb2x1dGlvblN0cmF0ZWd5TmFtZTogJ25vcm1hbCcgfSlcblxuICAgICAgICBpZiAoc25hcHNob3REYXRhLnNoYXJlTGluaykge1xuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBsaW5rQWRkcmVzczogc25hcHNob3REYXRhLnNoYXJlTGluayB9KVxuICAgICAgICB9XG5cbiAgICAgICAgbWl4cGFuZWwuaGFpa3VUcmFjaygnY3JlYXRvcjpwcm9qZWN0OnNhdmVkJywgdGhpcy53aXRoUHJvamVjdEluZm8oe1xuICAgICAgICAgIHVzZXJuYW1lOiB0aGlzLnByb3BzLnVzZXJuYW1lLFxuICAgICAgICAgIHByb2plY3Q6IHRoaXMucHJvcHMucHJvamVjdE5hbWVcbiAgICAgICAgfSkpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzZXRUaW1lb3V0KCgpID0+IHRoaXMuc2V0U3RhdGUoeyBzbmFwc2hvdFNhdmVDb25maXJtZWQ6IGZhbHNlIH0pLCAyMDAwKVxuICAgIH0pXG4gIH1cblxuICByZW5kZXJTbmFwc2hvdFNhdmVJbm5lckJ1dHRvbiAoKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUuc25hcHNob3RTYXZlRXJyb3IpIHJldHVybiA8ZGl2IHN0eWxlPXt7aGVpZ2h0OiAxOCwgbWFyZ2luUmlnaHQ6IC01fX0+PERhbmdlckljb25TVkcgZmlsbD0ndHJhbnNwYXJlbnQnIC8+PC9kaXY+XG4gICAgaWYgKHRoaXMuc3RhdGUuc25hcHNob3RNZXJnZUNvbmZsaWN0cykgcmV0dXJuIDxkaXYgc3R5bGU9e3toZWlnaHQ6IDE5LCBtYXJnaW5SaWdodDogMCwgbWFyZ2luVG9wOiAtMn19PjxXYXJuaW5nSWNvblNWRyBmaWxsPSd0cmFuc3BhcmVudCcgY29sb3I9e1BhbGV0dGUuT1JBTkdFfSAvPjwvZGl2PlxuICAgIGlmICh0aGlzLnN0YXRlLnNuYXBzaG90U2F2ZUNvbmZpcm1lZCkgcmV0dXJuIDxkaXYgc3R5bGU9e3sgaGVpZ2h0OiAxOCB9fT48U3VjY2Vzc0ljb25TVkcgdmlld0JveD0nMCAwIDE0IDE0JyBmaWxsPSd0cmFuc3BhcmVudCcgLz48L2Rpdj5cbiAgICByZXR1cm4gPFB1Ymxpc2hTbmFwc2hvdFNWRyAvPlxuICB9XG5cbiAgaGFuZGxlTWVyZ2VSZXNvbHZlT3VycyAoKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7IHNuYXBzaG90TWVyZ2VDb25mbGljdHM6IG51bGwsIHNuYXBzaG90U2F2ZVJlc29sdXRpb25TdHJhdGVneU5hbWU6ICdvdXJzJyB9LCAoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5wZXJmb3JtUHJvamVjdFNhdmUoKVxuICAgIH0pXG4gIH1cblxuICBoYW5kbGVNZXJnZVJlc29sdmVUaGVpcnMgKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoeyBzbmFwc2hvdE1lcmdlQ29uZmxpY3RzOiBudWxsLCBzbmFwc2hvdFNhdmVSZXNvbHV0aW9uU3RyYXRlZ3lOYW1lOiAndGhlaXJzJyB9LCAoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5wZXJmb3JtUHJvamVjdFNhdmUoKVxuICAgIH0pXG4gIH1cblxuICByZW5kZXJNZXJnZUNvbmZsaWN0UmVzb2x1dGlvbkFyZWEgKCkge1xuICAgIGlmICghdGhpcy5zdGF0ZS5zbmFwc2hvdE1lcmdlQ29uZmxpY3RzKSByZXR1cm4gJydcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBzdHlsZT17eyBwb3NpdGlvbjogJ2Fic29sdXRlJywgbGVmdDogMCwgcmlnaHQ6IDE1MCwgdG9wOiA0LCBwYWRkaW5nOiA1LCBib3JkZXJSYWRpdXM6IDQsIGNvbG9yOiBQYWxldHRlLlJPQ0ssIHRleHRBbGlnbjogJ3JpZ2h0Jywgb3ZlcmZsb3c6ICdoaWRkZW4nIH19PlxuICAgICAgICBDb25mbGljdCBmb3VuZCF7JyAnfVxuICAgICAgICA8YSBvbkNsaWNrPXt0aGlzLmhhbmRsZU1lcmdlUmVzb2x2ZU91cnN9IHN0eWxlPXt7IGN1cnNvcjogJ3BvaW50ZXInLCB0ZXh0RGVjb3JhdGlvbjogJ3VuZGVybGluZScsIGNvbG9yOiBQYWxldHRlLkdSRUVOIH19PkZvcmNlIHlvdXIgY2hhbmdlczwvYT57JyAnfVxuICAgICAgICBvciA8YSBvbkNsaWNrPXt0aGlzLmhhbmRsZU1lcmdlUmVzb2x2ZVRoZWlyc30gc3R5bGU9e3sgY3Vyc29yOiAncG9pbnRlcicsIHRleHREZWNvcmF0aW9uOiAndW5kZXJsaW5lJywgY29sb3I6IFBhbGV0dGUuUkVEIH19PmRpc2NhcmQgeW91cnMgJmFtcDsgYWNjZXB0IHRoZWlyczwvYT4/XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICBob3ZlclN0eWxlRm9yU2F2ZUJ1dHRvbiAoKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUuaXNTbmFwc2hvdFNhdmVJblByb2dyZXNzKSByZXR1cm4gbnVsbFxuICAgIGlmICh0aGlzLnN0YXRlLnNuYXBzaG90U2F2ZUVycm9yKSByZXR1cm4gbnVsbFxuICAgIGlmICh0aGlzLnN0YXRlLnNuYXBzaG90TWVyZ2VDb25mbGljdHMpIHJldHVybiBudWxsXG4gICAgaWYgKHRoaXMuc3RhdGUuc25hcHNob3RTYXZlQ29uZmlybWVkKSByZXR1cm4gbnVsbFxuICAgIHJldHVybiBCVE5fU1RZTEVTLmJ0bkljb25Ib3ZlclxuICB9XG5cbiAgcmVuZGVyICgpIHtcbiAgICBjb25zdCB7IHNob3dTaGFyZVBvcG92ZXIgfSA9IHRoaXMuc3RhdGVcbiAgICBjb25zdCB0aXRsZVRleHQgPSB0aGlzLnN0YXRlLnNob3dDb3BpZWRcbiAgICAgID8gJ0NvcGllZCdcbiAgICAgIDogJ1NoYXJlICYgRW1iZWQnXG5cbiAgICBsZXQgYnRuVGV4dCA9ICdQVUJMSVNIJ1xuICAgIGlmICh0aGlzLnN0YXRlLnNuYXBzaG90U2F2ZUNvbmZpcm1lZCkgYnRuVGV4dCA9ICdQVUJMSVNIRUQnXG4gICAgaWYgKHRoaXMuc3RhdGUuaXNTbmFwc2hvdFNhdmVJblByb2dyZXNzKSBidG5UZXh0ID0gJ1BVQkxJU0hJTkcnXG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBzdHlsZT17U1RZTEVTLmZyYW1lfSBjbGFzc05hbWU9J2ZyYW1lJz5cbiAgICAgICAgPFBvcG92ZXJcbiAgICAgICAgICBwbGFjZT0nYmVsb3cnXG4gICAgICAgICAgaXNPcGVuPXtzaG93U2hhcmVQb3BvdmVyfVxuICAgICAgICAgIHN0eWxlPXt7ekluZGV4OiAyfX1cbiAgICAgICAgICBib2R5PXtcbiAgICAgICAgICAgIDxQb3BvdmVyQm9keVJhZGl1bWl6ZWRcbiAgICAgICAgICAgICAgcGFyZW50PXt0aGlzfVxuICAgICAgICAgICAgICB0aXRsZVRleHQ9e3RpdGxlVGV4dH1cbiAgICAgICAgICAgICAgc25hcHNob3RTYXZlQ29uZmlybWVkPXt0aGlzLnN0YXRlLnNuYXBzaG90U2F2ZUNvbmZpcm1lZH1cbiAgICAgICAgICAgICAgaXNTbmFwc2hvdFNhdmVJblByb2dyZXNzPXt0aGlzLnN0YXRlLmlzU25hcHNob3RTYXZlSW5Qcm9ncmVzc31cbiAgICAgICAgICAgICAgaXNQcm9qZWN0SW5mb0ZldGNoSW5Qcm9ncmVzcz17dGhpcy5zdGF0ZS5pc1Byb2plY3RJbmZvRmV0Y2hJblByb2dyZXNzfVxuICAgICAgICAgICAgICBsaW5rQWRkcmVzcz17dGhpcy5zdGF0ZS5saW5rQWRkcmVzc31cbiAgICAgICAgICAgICAgY2xvc2U9eygpID0+IHRoaXMuc2V0U3RhdGUoeyBzaG93U2hhcmVQb3BvdmVyOiBmYWxzZSB9KX0gLz5cbiAgICAgICAgICB9PlxuICAgICAgICAgIDxidXR0b24ga2V5PSdzYXZlJ1xuICAgICAgICAgICAgaWQ9J3B1Ymxpc2gnXG4gICAgICAgICAgICBvbkNsaWNrPXt0aGlzLmhhbmRsZVNhdmVTbmFwc2hvdENsaWNrfVxuICAgICAgICAgICAgc3R5bGU9e1tcbiAgICAgICAgICAgICAgQlROX1NUWUxFUy5idG5UZXh0LFxuICAgICAgICAgICAgICBCVE5fU1RZTEVTLnJpZ2h0QnRucyxcbiAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5pc1NuYXBzaG90U2F2ZUluUHJvZ3Jlc3MgJiYgU1RZTEVTLmRpc2FibGVkXG4gICAgICAgICAgICBdfT5cbiAgICAgICAgICAgIHt0aGlzLnJlbmRlclNuYXBzaG90U2F2ZUlubmVyQnV0dG9uKCl9PHNwYW4gc3R5bGU9e3ttYXJnaW5MZWZ0OiA3fX0+e2J0blRleHR9PC9zcGFuPlxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8L1BvcG92ZXI+XG5cbiAgICAgICAge3RoaXMucmVuZGVyTWVyZ2VDb25mbGljdFJlc29sdXRpb25BcmVhKCl9XG4gICAgICAgIDxidXR0b24gb25DbGljaz17dGhpcy5oYW5kbGVDb25uZWN0aW9uQ2xpY2t9IHN0eWxlPXtbQlROX1NUWUxFUy5idG5JY29uLCBCVE5fU1RZTEVTLmJ0bkljb25Ib3ZlciwgU1RZTEVTLmhpZGVdfSBrZXk9J2Nvbm5lY3QnPlxuICAgICAgICAgIDxDb25uZWN0aW9uSWNvblNWRyAvPlxuICAgICAgICA8L2J1dHRvbj5cblxuICAgICAgICB7IGZhbHNlICYmXG4gICAgICAgICAgPFRvb2xTZWxlY3RvciB3ZWJzb2NrZXQ9e3RoaXMucHJvcHMud2Vic29ja2V0fSAvPlxuICAgICAgICB9XG5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxufVxuXG5TdGFnZVRpdGxlQmFyLnByb3BUeXBlcyA9IHtcbiAgZm9sZGVyOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gIHByb2plY3ROYW1lOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuICB1c2VybmFtZTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcbiAgcGFzc3dvcmQ6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG4gIHdlYnNvY2tldDogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICBjcmVhdGVOb3RpY2U6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIHJlbW92ZU5vdGljZTogUmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgcmVjZWl2ZVByb2plY3RJbmZvOiBSZWFjdC5Qcm9wVHlwZXMuZnVuY1xufVxuXG5leHBvcnQgZGVmYXVsdCBSYWRpdW0oU3RhZ2VUaXRsZUJhcilcbiJdfQ==