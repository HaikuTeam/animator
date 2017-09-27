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
          console.error(projectInfoFetchError.message);
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
            lineNumber: 404
          },
          __self: this
        },
        _react2.default.createElement(_Icons.DangerIconSVG, { fill: 'transparent', __source: {
            fileName: _jsxFileName,
            lineNumber: 404
          },
          __self: this
        })
      );
      if (this.state.snapshotMergeConflicts) return _react2.default.createElement(
        'div',
        { style: { height: 19, marginRight: 0, marginTop: -2 }, __source: {
            fileName: _jsxFileName,
            lineNumber: 405
          },
          __self: this
        },
        _react2.default.createElement(_Icons.WarningIconSVG, { fill: 'transparent', color: _Palette2.default.ORANGE, __source: {
            fileName: _jsxFileName,
            lineNumber: 405
          },
          __self: this
        })
      );
      if (this.state.snapshotSaveConfirmed) return _react2.default.createElement(
        'div',
        { style: { height: 18 }, __source: {
            fileName: _jsxFileName,
            lineNumber: 406
          },
          __self: this
        },
        _react2.default.createElement(_Icons.SuccessIconSVG, { viewBox: '0 0 14 14', fill: 'transparent', __source: {
            fileName: _jsxFileName,
            lineNumber: 406
          },
          __self: this
        })
      );
      return _react2.default.createElement(_Icons.PublishSnapshotSVG, {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 407
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
            lineNumber: 425
          },
          __self: this
        },
        'Conflict found!',
        ' ',
        _react2.default.createElement(
          'a',
          { onClick: this.handleMergeResolveOurs, style: { cursor: 'pointer', textDecoration: 'underline', color: _Palette2.default.GREEN }, __source: {
              fileName: _jsxFileName,
              lineNumber: 427
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
              lineNumber: 428
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
            lineNumber: 452
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
                lineNumber: 457
              },
              __self: this
            }), __source: {
              fileName: _jsxFileName,
              lineNumber: 453
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
                lineNumber: 466
              },
              __self: this
            },
            this.renderSnapshotSaveInnerButton(),
            _react2.default.createElement(
              'span',
              { style: { marginLeft: 7 }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 474
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
              lineNumber: 479
            },
            __self: this
          },
          _react2.default.createElement(_Icons.ConnectionIconSVG, {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 480
            },
            __self: this
          })
        ),
        false && _react2.default.createElement(_ToolSelector2.default, { websocket: this.props.websocket, __source: {
            fileName: _jsxFileName,
            lineNumber: 484
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9yZWFjdC9jb21wb25lbnRzL1N0YWdlVGl0bGVCYXIuanMiXSwibmFtZXMiOlsibWl4cGFuZWwiLCJyZXF1aXJlIiwiU1RZTEVTIiwiaGlkZSIsImRpc3BsYXkiLCJmcmFtZSIsImJhY2tncm91bmRDb2xvciIsIkNPQUwiLCJwb3NpdGlvbiIsInRvcCIsInpJbmRleCIsImhlaWdodCIsInBhZGRpbmciLCJkaXNhYmxlZCIsIm9wYWNpdHkiLCJjdXJzb3IiLCJzaGFyZVBvcG92ZXIiLCJGQVRIRVJfQ09BTCIsIndpZHRoIiwiZm9udFNpemUiLCJjb2xvciIsIlJPQ0siLCJ0ZXh0QWxpZ24iLCJib3JkZXJSYWRpdXMiLCJib3hTaGFkb3ciLCJwb3BvdmVyQ2xvc2UiLCJyaWdodCIsInRleHRUcmFuc2Zvcm0iLCJmb290ZXIiLCJEQVJLX0dSQVkiLCJmYWRlIiwiYm90dG9tIiwiYm9yZGVyQm90dG9tUmlnaHRSYWRpdXMiLCJib3JkZXJCb3R0b21MZWZ0UmFkaXVzIiwicGFkZGluZ1RvcCIsInRpbWUiLCJmb250V2VpZ2h0IiwibWFyZ2luTGVmdCIsImNvcHkiLCJqdXN0aWZ5Q29udGVudCIsImFsaWduSXRlbXMiLCJjb3B5TG9hZGluZyIsInBhZGRpbmdCb3R0b20iLCJwb2ludGVyRXZlbnRzIiwibGlua0hvbHN0ZXIiLCJtYXJnaW5Ub3AiLCJib3JkZXIiLCJsaW5rIiwiTElHSFRfQkxVRSIsImxpZ2h0ZW4iLCJsZWZ0IiwiZ2VuZXJhdGluZ0xpbmsiLCJmb250U3R5bGUiLCJTTkFQU0hPVF9TQVZFX1JFU09MVVRJT05fU1RSQVRFR0lFUyIsIm5vcm1hbCIsInN0cmF0ZWd5IiwiZmF2b3IiLCJvdXJzIiwidGhlaXJzIiwiUG9wb3ZlckJvZHkiLCJuZXh0UHJvcHMiLCJwcm9wcyIsInRpdGxlVGV4dCIsImxpbmtBZGRyZXNzIiwiaXNTbmFwc2hvdFNhdmVJblByb2dyZXNzIiwic25hcHNob3RTYXZlQ29uZmlybWVkIiwiaXNQcm9qZWN0SW5mb0ZldGNoSW5Qcm9ncmVzcyIsInBvcG92ZXJQb3NpdGlvbiIsImNsb3NlIiwib3BlbkV4dGVybmFsIiwic3Vic3RyaW5nIiwicGFyZW50Iiwic2V0U3RhdGUiLCJjb3BpZWQiLCJzaG93Q29waWVkIiwic2V0VGltZW91dCIsIkNvbXBvbmVudCIsIlBvcG92ZXJCb2R5UmFkaXVtaXplZCIsIlN0YWdlVGl0bGVCYXIiLCJoYW5kbGVDb25uZWN0aW9uQ2xpY2siLCJiaW5kIiwiaGFuZGxlVW5kb0NsaWNrIiwiaGFuZGxlUmVkb0NsaWNrIiwiaGFuZGxlU2F2ZVNuYXBzaG90Q2xpY2siLCJoYW5kbGVNZXJnZVJlc29sdmVPdXJzIiwiaGFuZGxlTWVyZ2VSZXNvbHZlVGhlaXJzIiwiX2lzTW91bnRlZCIsInN0YXRlIiwic25hcHNob3RTYXZlUmVzb2x1dGlvblN0cmF0ZWd5TmFtZSIsInNuYXBzaG90TWVyZ2VDb25mbGljdHMiLCJzbmFwc2hvdFNhdmVFcnJvciIsInNob3dTaGFyZVBvcG92ZXIiLCJwcm9qZWN0SW5mb0ZldGNoRXJyb3IiLCJwcm9qZWN0SW5mbyIsImdpdFVuZG9hYmxlcyIsImdpdFJlZG9hYmxlcyIsInBlcmZvcm1Qcm9qZWN0SW5mb0ZldGNoIiwiX2ZldGNoTWFzdGVyU3RhdGVJbnRlcnZhbCIsInNldEludGVydmFsIiwid2Vic29ja2V0IiwicmVxdWVzdCIsIm1ldGhvZCIsInBhcmFtcyIsImZvbGRlciIsImhlYXJ0YmVhdEVyciIsIm1hc3RlclN0YXRlIiwiRXJyb3IiLCJjb25zb2xlIiwiZXJyb3IiLCJjbGVhckludGVydmFsIiwiY3JlYXRlTm90aWNlIiwidHlwZSIsInRpdGxlIiwibWVzc2FnZSIsInNlbmQiLCJvbiIsImVyciIsImNvbW1pdE1lc3NhZ2UiLCJzYXZlU3RyYXRlZ3kiLCJ0b3VyQ2xpZW50IiwibmV4dCIsInBlcmZvcm1Qcm9qZWN0U2F2ZSIsInByb2plY3QiLCJwcm9qZWN0TmFtZSIsInVzZXJuYW1lIiwicGFzc3dvcmQiLCJyZWNlaXZlUHJvamVjdEluZm8iLCJzaGFyZUxpbmsiLCJvdGhlck9iamVjdCIsInByb2oiLCJvcmdhbml6YXRpb24iLCJvcmdhbml6YXRpb25OYW1lIiwidXVpZCIsInByb2plY3RVaWQiLCJzaGEiLCJicmFuY2giLCJicmFuY2hOYW1lIiwiY2IiLCJnZXRQcm9qZWN0U2F2ZU9wdGlvbnMiLCJoYWlrdVRyYWNrIiwid2l0aFByb2plY3RJbmZvIiwicmVxdWVzdFNhdmVQcm9qZWN0Iiwic25hcHNob3REYXRhIiwiY29uZmxpY3RzIiwid2FybiIsImluZm8iLCJtYXJnaW5SaWdodCIsIk9SQU5HRSIsIm92ZXJmbG93IiwidGV4dERlY29yYXRpb24iLCJHUkVFTiIsIlJFRCIsImJ0bkljb25Ib3ZlciIsImJ0blRleHQiLCJyaWdodEJ0bnMiLCJyZW5kZXJTbmFwc2hvdFNhdmVJbm5lckJ1dHRvbiIsInJlbmRlck1lcmdlQ29uZmxpY3RSZXNvbHV0aW9uQXJlYSIsImJ0bkljb24iLCJwcm9wVHlwZXMiLCJQcm9wVHlwZXMiLCJzdHJpbmciLCJpc1JlcXVpcmVkIiwib2JqZWN0IiwiZnVuYyIsInJlbW92ZU5vdGljZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOztBQUNBOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7O0FBV0EsSUFBSUEsV0FBV0MsUUFBUSx3QkFBUixDQUFmOztBQUVBLElBQU1DLFNBQVM7QUFDYkMsUUFBTTtBQUNKQyxhQUFTO0FBREwsR0FETztBQUliQyxTQUFPO0FBQ0xDLHFCQUFpQixrQkFBUUMsSUFEcEI7QUFFTEMsY0FBVSxVQUZMO0FBR0xDLFNBQUssQ0FIQTtBQUlMQyxZQUFRLENBSkg7QUFLTEMsWUFBUSxNQUxIO0FBTUxDLGFBQVM7QUFOSixHQUpNO0FBWWJDLFlBQVU7QUFDUkMsYUFBUyxHQUREO0FBRVJDLFlBQVE7QUFGQSxHQVpHO0FBZ0JiQyxnQkFBYztBQUNaUixjQUFVLFVBREU7QUFFWkMs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MEI7QUFDeEJ2RCxVQUFRLGdCQUFNd0QsU0FBTixDQUFnQkMsTUFBaEIsQ0FBdUJDLFVBRFA7QUFFeEJ0QyxlQUFhLGdCQUFNb0MsU0FBTixDQUFnQkMsTUFGTDtBQUd4QnBDLFlBQVUsZ0JBQU1tQyxTQUFOLENBQWdCQyxNQUhGO0FBSXhCbkMsWUFBVSxnQkFBTWtDLFNBQU4sQ0FBZ0JDLE1BSkY7QUFLeEI3RCxhQUFXLGdCQUFNNEQsU0FBTixDQUFnQkcsTUFBaEIsQ0FBdUJELFVBTFY7QUFNeEJuRCxnQkFBYyxnQkFBTWlELFNBQU4sQ0FBZ0JJLElBQWhCLENBQXFCRixVQU5YO0FBT3hCRyxnQkFBYyxnQkFBTUwsU0FBTixDQUFnQkksSUFBaEIsQ0FBcUJGLFVBUFg7QUFReEJuQyxzQkFBb0IsZ0JBQU1pQyxTQUFOLENBQWdCSTtBQVJaLENBQTFCOztrQkFXZSxzQkFBT3JGLGFBQVAsQyIsImZpbGUiOiJTdGFnZVRpdGxlQmFyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgc2hlbGwsIGlwY1JlbmRlcmVyIH0gZnJvbSAnZWxlY3Ryb24nXG5pbXBvcnQgUmFkaXVtIGZyb20gJ3JhZGl1bSdcbmltcG9ydCBQb3BvdmVyIGZyb20gJ3JlYWN0LXBvcG92ZXInXG5pbXBvcnQgYXNzaWduIGZyb20gJ2xvZGFzaC5hc3NpZ24nXG5pbXBvcnQgUGFsZXR0ZSBmcm9tICcuL1BhbGV0dGUnXG5pbXBvcnQgeyBUaHJlZUJvdW5jZSB9IGZyb20gJ2JldHRlci1yZWFjdC1zcGlua2l0J1xuaW1wb3J0IENvbG9yIGZyb20gJ2NvbG9yJ1xuaW1wb3J0IHsgQlROX1NUWUxFUyB9IGZyb20gJy4uL3N0eWxlcy9idG5TaGFyZWQnXG5pbXBvcnQgQ29weVRvQ2xpcGJvYXJkIGZyb20gJ3JlYWN0LWNvcHktdG8tY2xpcGJvYXJkJ1xuaW1wb3J0IFRvb2xTZWxlY3RvciBmcm9tICcuL1Rvb2xTZWxlY3RvcidcbmltcG9ydCB7XG4gIFB1Ymxpc2hTbmFwc2hvdFNWRyxcbiAgQ29ubmVjdGlvbkljb25TVkcsXG4gIC8vIFVuZG9JY29uU1ZHLFxuICAvLyBSZWRvSWNvblNWRyxcbiAgV2FybmluZ0ljb25TVkcsXG4gIFN1Y2Nlc3NJY29uU1ZHLFxuICBEYW5nZXJJY29uU1ZHLFxuICBDbGlib2FyZEljb25TVkdcbn0gZnJvbSAnLi9JY29ucydcblxudmFyIG1peHBhbmVsID0gcmVxdWlyZSgnLi8uLi8uLi91dGlscy9NaXhwYW5lbCcpXG5cbmNvbnN0IFNUWUxFUyA9IHtcbiAgaGlkZToge1xuICAgIGRpc3BsYXk6ICdub25lJ1xuICB9LFxuICBmcmFtZToge1xuICAgIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5DT0FMLFxuICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICAgIHRvcDogMCxcbiAgICB6SW5kZXg6IDEsXG4gICAgaGVpZ2h0OiAnMzZweCcsXG4gICAgcGFkZGluZzogJzZweCdcbiAgfSxcbiAgZGlzYWJsZWQ6IHtcbiAgICBvcGFjaXR5OiAwLjUsXG4gICAgY3Vyc29yOiAnbm90LWFsbG93ZWQnXG4gIH0sXG4gIHNoYXJlUG9wb3Zlcjoge1xuICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgIHRvcDogMzQsXG4gICAgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLkZBVEhFUl9DT0FMLFxuICAgIHdpZHRoOiAyMDQsXG4gICAgcGFkZGluZzogJzEzcHggOXB4JyxcbiAgICBmb250U2l6ZTogMTcsXG4gICAgY29sb3I6IFBhbGV0dGUuUk9DSyxcbiAgICB0ZXh0QWxpZ246ICdjZW50ZXInLFxuICAgIGJvcmRlclJhZGl1czogNCxcbiAgICBib3hTaGFkb3c6ICcwIDZweCAyNXB4IDAgJyArIFBhbGV0dGUuRkFUSEVSX0NPQUxcbiAgfSxcbiAgcG9wb3ZlckNsb3NlOiB7XG4gICAgY29sb3I6ICd3aGl0ZScsXG4gICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgdG9wOiA1LFxuICAgIHJpZ2h0OiAxMCxcbiAgICBmb250U2l6ZTogMTUsXG4gICAgdGV4dFRyYW5zZm9ybTogJ2xvd2VyY2FzZSdcbiAgfSxcbiAgZm9vdGVyOiB7XG4gICAgYmFja2dyb3VuZENvbG9yOiBDb2xvcihQYWxldHRlLkRBUktfR1JBWSkuZmFkZSgwLjcpLFxuICAgIGhlaWdodDogMjUsXG4gICAgd2lkdGg6ICcxMDAlJyxcbiAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICBib3R0b206IDAsXG4gICAgZm9udFNpemU6IDEwLFxuICAgIGJvcmRlckJvdHRvbVJpZ2h0UmFkaXVzOiAzLFxuICAgIGJvcmRlckJvdHRvbUxlZnRSYWRpdXM6IDMsXG4gICAgcGFkZGluZ1RvcDogNVxuICB9LFxuICB0aW1lOiB7XG4gICAgZm9udFdlaWdodDogJ2JvbGQnLFxuICAgIG1hcmdpbkxlZnQ6IDVcbiAgfSxcbiAgY29weToge1xuICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgIGhlaWdodDogJzEwMCUnLFxuICAgIHdpZHRoOiAyNSxcbiAgICByaWdodDogMCxcbiAgICBwYWRkaW5nVG9wOiAyLFxuICAgIGRpc3BsYXk6ICdmbGV4JyxcbiAgICBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicsXG4gICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLkRBUktfR1JBWVxuICB9LFxuICBjb3B5TG9hZGluZzoge1xuICAgIHBhZGRpbmdUb3A6IDAsXG4gICAgcGFkZGluZ0JvdHRvbTogNixcbiAgICBwb2ludGVyRXZlbnRzOiAnbm9uZSdcbiAgfSxcbiAgbGlua0hvbHN0ZXI6IHtcbiAgICBoZWlnaHQ6IDI5LFxuICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICAgIGJvcmRlclJhZGl1czogMyxcbiAgICBtYXJnaW5Ub3A6IDMsXG4gICAgY3Vyc29yOiAncG9pbnRlcicsXG4gICAgYmFja2dyb3VuZENvbG9yOiBDb2xvcihQYWxldHRlLkRBUktfR1JBWSkuZmFkZSgwLjY4KSxcbiAgICBib3JkZXI6ICcxcHggc29saWQgJyArIFBhbGV0dGUuREFSS19HUkFZXG5cbiAgfSxcbiAgbGluazoge1xuICAgIGZvbnRTaXplOiAxMCxcbiAgICBjb2xvcjogQ29sb3IoUGFsZXR0ZS5MSUdIVF9CTFVFKS5saWdodGVuKDAuMzcpLFxuICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgIGxlZnQ6IDcsXG4gICAgdG9wOiA3LFxuICAgIGN1cnNvcjogJ3BvaW50ZXInXG4gIH0sXG4gIGdlbmVyYXRpbmdMaW5rOiB7XG4gICAgY29sb3I6IFBhbGV0dGUuUk9DSyxcbiAgICBjdXJzb3I6ICdkZWZhdWx0JyxcbiAgICBmb250U3R5bGU6ICdpdGFsaWMnXG4gIH1cbn1cblxuY29uc3QgU05BUFNIT1RfU0FWRV9SRVNPTFVUSU9OX1NUUkFURUdJRVMgPSB7XG4gIG5vcm1hbDogeyBzdHJhdGVneTogJ3JlY3Vyc2l2ZScsIGZhdm9yOiAnb3VycycgfSxcbiAgb3VyczogeyBzdHJhdGVneTogJ291cnMnIH0sXG4gIHRoZWlyczogeyBzdHJhdGVneTogJ3RoZWlycycgfVxufVxuXG5jbGFzcyBQb3BvdmVyQm9keSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHNob3VsZENvbXBvbmVudFVwZGF0ZSAobmV4dFByb3BzKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIHRoaXMucHJvcHMudGl0bGVUZXh0ICE9PSBuZXh0UHJvcHMudGl0bGVUZXh0IHx8XG4gICAgICB0aGlzLnByb3BzLmxpbmtBZGRyZXNzICE9PSBuZXh0UHJvcHMubGlua0FkZHJlc3MgfHxcbiAgICAgIHRoaXMucHJvcHMuaXNTbmFwc2hvdFNhdmVJblByb2dyZXNzICE9PSBuZXh0UHJvcHMuaXNTbmFwc2hvdFNhdmVJblByb2dyZXNzIHx8XG4gICAgICB0aGlzLnByb3BzLnNuYXBzaG90U2F2ZUNvbmZpcm1lZCAhPT0gbmV4dFByb3BzLnNuYXBzaG90U2F2ZUNvbmZpcm1lZCB8fFxuICAgICAgdGhpcy5wcm9wcy5pc1Byb2plY3RJbmZvRmV0Y2hJblByb2dyZXNzICE9PSBuZXh0UHJvcHMuaXNQcm9qZWN0SW5mb0ZldGNoSW5Qcm9ncmVzc1xuICAgIClcbiAgfVxuXG4gIHJlbmRlciAoKSB7XG4gICAgbGV0IHBvcG92ZXJQb3NpdGlvblxuXG4gICAgaWYgKHRoaXMucHJvcHMuc25hcHNob3RTYXZlQ29uZmlybWVkKSB7XG4gICAgICBwb3BvdmVyUG9zaXRpb24gPSAtNzJcbiAgICB9IGVsc2UgaWYgKHRoaXMucHJvcHMuaXNTbmFwc2hvdFNhdmVJblByb2dyZXNzKSB7XG4gICAgICBwb3BvdmVyUG9zaXRpb24gPSAtNzBcbiAgICB9IGVsc2Uge1xuICAgICAgcG9wb3ZlclBvc2l0aW9uID0gLTU5XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgc3R5bGU9e1tTVFlMRVMuc2hhcmVQb3BvdmVyLCB7cmlnaHQ6IHBvcG92ZXJQb3NpdGlvbn1dfT5cbiAgICAgICAgPGJ1dHRvbiBzdHlsZT17U1RZTEVTLnBvcG92ZXJDbG9zZX0gb25DbGljaz17dGhpcy5wcm9wcy5jbG9zZX0+eDwvYnV0dG9uPlxuICAgICAgICB7dGhpcy5wcm9wcy50aXRsZVRleHR9XG4gICAgICAgIDxkaXYgc3R5bGU9e1NUWUxFUy5saW5rSG9sc3Rlcn0+XG4gICAgICAgICAgeyh0aGlzLnByb3BzLmlzU25hcHNob3RTYXZlSW5Qcm9ncmVzcyB8fCB0aGlzLnByb3BzLmlzUHJvamVjdEluZm9GZXRjaEluUHJvZ3Jlc3MpXG4gICAgICAgICAgICA/IDxzcGFuIHN0eWxlPXtbU1RZTEVTLmxpbmssIFNUWUxFUy5nZW5lcmF0aW5nTGlua119PlVwZGF0aW5nIFNoYXJlIFBhZ2U8L3NwYW4+XG4gICAgICAgICAgICA6IDxzcGFuIHN0eWxlPXtTVFlMRVMubGlua30gb25DbGljaz17KCkgPT4gc2hlbGwub3BlbkV4dGVybmFsKHRoaXMucHJvcHMubGlua0FkZHJlc3MpfT57dGhpcy5wcm9wcy5saW5rQWRkcmVzcy5zdWJzdHJpbmcoMCwgMzMpfTwvc3Bhbj59XG4gICAgICAgICAgPENvcHlUb0NsaXBib2FyZFxuICAgICAgICAgICAgdGV4dD17dGhpcy5wcm9wcy5saW5rQWRkcmVzc31cbiAgICAgICAgICAgIG9uQ29weT17KCkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLnByb3BzLnBhcmVudC5zZXRTdGF0ZSh7Y29waWVkOiB0cnVlfSlcbiAgICAgICAgICAgICAgdGhpcy5wcm9wcy5wYXJlbnQuc2V0U3RhdGUoe3Nob3dDb3BpZWQ6IHRydWV9LCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICB0aGlzLnByb3BzLnBhcmVudC5zZXRTdGF0ZSh7c2hvd0NvcGllZDogZmFsc2V9KVxuICAgICAgICAgICAgICAgIH0sIDE5MDApXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9fT5cbiAgICAgICAgICAgIHsodGhpcy5wcm9wcy5pc1NuYXBzaG90U2F2ZUluUHJvZ3Jlc3MgfHwgdGhpcy5wcm9wcy5pc1Byb2plY3RJbmZvRmV0Y2hJblByb2dyZXNzKVxuICAgICAgICAgICAgICA/IDxzcGFuIHN0eWxlPXtbU1RZTEVTLmNvcHksIFNUWUxFUy5jb3B5TG9hZGluZ119PjxUaHJlZUJvdW5jZSBzaXplPXszfSBjb2xvcj17UGFsZXR0ZS5ST0NLfSAvPjwvc3Bhbj5cbiAgICAgICAgICAgICAgOiA8c3BhbiBzdHlsZT17U1RZTEVTLmNvcHl9PjxDbGlib2FyZEljb25TVkcgLz48L3NwYW4+fVxuICAgICAgICAgIDwvQ29weVRvQ2xpcGJvYXJkPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgey8qIHRvZG86IHNob3cgbGFzdCB1cGRhdGVkPyA8ZGl2IHN0eWxlPXtTVFlMRVMuZm9vdGVyfT5VUERBVEVEPHNwYW4gc3R5bGU9e1NUWUxFUy50aW1lfT57Jzk6MDBhbSBKdW4gMTUsIDIwMTcnfTwvc3Bhbj48L2Rpdj4gKi99XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cbn1cblxuY29uc3QgUG9wb3ZlckJvZHlSYWRpdW1pemVkID0gUmFkaXVtKFBvcG92ZXJCb2R5KVxuXG5jbGFzcyBTdGFnZVRpdGxlQmFyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IgKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpXG4gICAgdGhpcy5oYW5kbGVDb25uZWN0aW9uQ2xpY2sgPSB0aGlzLmhhbmRsZUNvbm5lY3Rpb25DbGljay5iaW5kKHRoaXMpXG4gICAgdGhpcy5oYW5kbGVVbmRvQ2xpY2sgPSB0aGlzLmhhbmRsZVVuZG9DbGljay5iaW5kKHRoaXMpXG4gICAgdGhpcy5oYW5kbGVSZWRvQ2xpY2sgPSB0aGlzLmhhbmRsZVJlZG9DbGljay5iaW5kKHRoaXMpXG4gICAgdGhpcy5oYW5kbGVTYXZlU25hcHNob3RDbGljayA9IHRoaXMuaGFuZGxlU2F2ZVNuYXBzaG90Q2xpY2suYmluZCh0aGlzKVxuICAgIHRoaXMuaGFuZGxlTWVyZ2VSZXNvbHZlT3VycyA9IHRoaXMuaGFuZGxlTWVyZ2VSZXNvbHZlT3Vycy5iaW5kKHRoaXMpXG4gICAgdGhpcy5oYW5kbGVNZXJnZVJlc29sdmVUaGVpcnMgPSB0aGlzLmhhbmRsZU1lcmdlUmVzb2x2ZVRoZWlycy5iaW5kKHRoaXMpXG4gICAgdGhpcy5faXNNb3VudGVkID0gZmFsc2VcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgc25hcHNob3RTYXZlUmVzb2x1dGlvblN0cmF0ZWd5TmFtZTogJ25vcm1hbCcsXG4gICAgICBpc1NuYXBzaG90U2F2ZUluUHJvZ3Jlc3M6IGZhbHNlLFxuICAgICAgc25hcHNob3RNZXJnZUNvbmZsaWN0czogbnVsbCxcbiAgICAgIHNuYXBzaG90U2F2ZUNvbmZpcm1lZDogbnVsbCxcbiAgICAgIHNuYXBzaG90U2F2ZUVycm9yOiBudWxsLFxuICAgICAgc2hvd1NoYXJlUG9wb3ZlcjogZmFsc2UsXG4gICAgICBjb3BpZWQ6IGZhbHNlLFxuICAgICAgbGlua0FkZHJlc3M6ICdGZXRjaGluZyBJbmZvJyxcbiAgICAgIHNob3dDb3BpZWQ6IGZhbHNlLFxuICAgICAgcHJvamVjdEluZm9GZXRjaEVycm9yOiBudWxsLFxuICAgICAgaXNQcm9qZWN0SW5mb0ZldGNoSW5Qcm9ncmVzczogZmFsc2UsXG4gICAgICBwcm9qZWN0SW5mbzogbnVsbCxcbiAgICAgIGdpdFVuZG9hYmxlczogW10sXG4gICAgICBnaXRSZWRvYWJsZXM6IFtdXG4gICAgfVxuICB9XG5cbiAgY29tcG9uZW50V2lsbE1vdW50ICgpIHtcbiAgICB0aGlzLl9pc01vdW50ZWQgPSB0cnVlXG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCAoKSB7XG4gICAgdGhpcy5wZXJmb3JtUHJvamVjdEluZm9GZXRjaCgpXG5cbiAgICAvLyBJdCdzIGtpbmQgb2Ygd2VpcmQgdG8gaGF2ZSB0aGlzIGhlYXJ0YmVhdCBsb2dpYyBidXJpZWQgYWxsIHRoZSB3YXkgZG93biBoZXJlIGluc2lkZSBTdGF0ZVRpdGxlQmFyO1xuICAgIC8vIGl0IHByb2JhYmx5IHNob3VsZCBiZSBtb3ZlZCB1cCB0byB0aGUgQ3JlYXRvciBsZXZlbCBzbyBpdCdzIGVhc2llciB0byBmaW5kICNGSVhNRVxuICAgIHRoaXMuX2ZldGNoTWFzdGVyU3RhdGVJbnRlcnZhbCA9IHNldEludGVydmFsKCgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLnByb3BzLndlYnNvY2tldC5yZXF1ZXN0KHsgbWV0aG9kOiAnbWFzdGVySGVhcnRiZWF0JywgcGFyYW1zOiBbdGhpcy5wcm9wcy5mb2xkZXJdIH0sIChoZWFydGJlYXRFcnIsIG1hc3RlclN0YXRlKSA9PiB7XG4gICAgICAgIGlmIChoZWFydGJlYXRFcnIgfHwgIW1hc3RlclN0YXRlKSB7XG4gICAgICAgICAgLy8gSWYgbWFzdGVyIGRpc2Nvbm5lY3RzIHdlIG1pZ2h0IG5vdCBldmVuIGdldCBhbiBlcnJvciwgc28gY3JlYXRlIGEgZmFrZSBlcnJvciBpbiBpdHMgcGxhY2VcbiAgICAgICAgICBpZiAoIWhlYXJ0YmVhdEVycikgaGVhcnRiZWF0RXJyID0gbmV3IEVycm9yKCdVbmtub3duIHByb2JsZW0gd2l0aCBtYXN0ZXIgaGVhcnRiZWF0JylcbiAgICAgICAgICBjb25zb2xlLmVycm9yKGhlYXJ0YmVhdEVycilcblxuICAgICAgICAgIC8vIElmIG1hc3RlciBoYXMgZGlzY29ubmVjdGVkLCBzdG9wIHJ1bm5pbmcgdGhpcyBpbnRlcnZhbCBzbyB3ZSBkb24ndCBnZXQgcHVsc2luZyBlcnJvciBtZXNzYWdlc1xuICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy5fZmV0Y2hNYXN0ZXJTdGF0ZUludGVydmFsKVxuXG4gICAgICAgICAgLy8gQnV0IHRoZSBmaXJzdCB0aW1lIHdlIGdldCB0aGlzLCBkaXNwbGF5IGEgdXNlciBub3RpY2UgLSB0aGV5IHByb2JhYmx5IG5lZWQgdG8gcmVzdGFydCBIYWlrdSB0byBnZXRcbiAgICAgICAgICAvLyBpbnRvIGEgYmV0dGVyIHN0YXRlLCBhdCBsZWFzdCB1bnRpbCB3ZSBjYW4gcmVzb2x2ZSB3aGF0IHRoZSBjYXVzZSBvZiB0aGlzIHByb2JsZW0gaXNcbiAgICAgICAgICByZXR1cm4gdGhpcy5wcm9wcy5jcmVhdGVOb3RpY2Uoe1xuICAgICAgICAgICAgdHlwZTogJ2RhbmdlcicsXG4gICAgICAgICAgICB0aXRsZTogJ1VoIG9oIScsXG4gICAgICAgICAgICBtZXNzYWdlOiAnSGFpa3UgaXMgaGF2aW5nIGEgcHJvYmxlbSBhY2Nlc3NpbmcgeW91ciBwcm9qZWN0LiDwn5iiIFBsZWFzZSByZXN0YXJ0IEhhaWt1LiBJZiB5b3Ugc2VlIHRoaXMgZXJyb3IgYWdhaW4sIGNvbnRhY3QgSGFpa3UgZm9yIHN1cHBvcnQuJ1xuICAgICAgICAgIH0pXG4gICAgICAgIH1cblxuICAgICAgICBpcGNSZW5kZXJlci5zZW5kKCdtYXN0ZXI6aGVhcnRiZWF0JywgYXNzaWduKHt9LCBtYXN0ZXJTdGF0ZSkpXG5cbiAgICAgICAgaWYgKHRoaXMuX2lzTW91bnRlZCkge1xuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgZ2l0VW5kb2FibGVzOiBtYXN0ZXJTdGF0ZS5naXRVbmRvYWJsZXMsXG4gICAgICAgICAgICBnaXRSZWRvYWJsZXM6IG1hc3RlclN0YXRlLmdpdFJlZG9hYmxlc1xuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSwgMTAwMClcblxuICAgIGlwY1JlbmRlcmVyLm9uKCdnbG9iYWwtbWVudTpzYXZlJywgKCkgPT4ge1xuICAgICAgdGhpcy5oYW5kbGVTYXZlU25hcHNob3RDbGljaygpXG4gICAgfSlcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50ICgpIHtcbiAgICB0aGlzLl9pc01vdW50ZWQgPSBmYWxzZVxuICAgIGNsZWFySW50ZXJ2YWwodGhpcy5fZmV0Y2hNYXN0ZXJTdGF0ZUludGVydmFsKVxuICB9XG5cbiAgaGFuZGxlQ29ubmVjdGlvbkNsaWNrICgpIHtcbiAgICAvLyBUT0RPXG4gIH1cblxuICBoYW5kbGVVbmRvQ2xpY2sgKCkge1xuICAgIHJldHVybiB0aGlzLnByb3BzLndlYnNvY2tldC5yZXF1ZXN0KHsgbWV0aG9kOiAnZ2l0VW5kbycsIHBhcmFtczogW3RoaXMucHJvcHMuZm9sZGVyLCB7IHR5cGU6ICdnbG9iYWwnIH1dIH0sIChlcnIpID0+IHtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihlcnIpXG4gICAgICAgIHJldHVybiB0aGlzLnByb3BzLmNyZWF0ZU5vdGljZSh7XG4gICAgICAgICAgdHlwZTogJ3dhcm5pbmcnLFxuICAgICAgICAgIHRpdGxlOiAnVWggb2ghJyxcbiAgICAgICAgICBtZXNzYWdlOiAnV2Ugd2VyZSB1bmFibGUgdG8gdW5kbyB5b3VyIGxhc3QgYWN0aW9uLiDwn5iiIFBsZWFzZSBjb250YWN0IEhhaWt1IGZvciBzdXBwb3J0LidcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgaGFuZGxlUmVkb0NsaWNrICgpIHtcbiAgICByZXR1cm4gdGhpcy5wcm9wcy53ZWJzb2NrZXQucmVxdWVzdCh7IG1ldGhvZDogJ2dpdFJlZG8nLCBwYXJhbXM6IFt0aGlzLnByb3BzLmZvbGRlciwgeyB0eXBlOiAnZ2xvYmFsJyB9XSB9LCAoZXJyKSA9PiB7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKVxuICAgICAgICByZXR1cm4gdGhpcy5wcm9wcy5jcmVhdGVOb3RpY2Uoe1xuICAgICAgICAgIHR5cGU6ICd3YXJuaW5nJyxcbiAgICAgICAgICB0aXRsZTogJ1VoIG9oIScsXG4gICAgICAgICAgbWVzc2FnZTogJ1dlIHdlcmUgdW5hYmxlIHRvIHJlZG8geW91ciBsYXN0IGFjdGlvbi4g8J+YoiBQbGVhc2UgY29udGFjdCBIYWlrdSBmb3Igc3VwcG9ydC4nXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGdldFByb2plY3RTYXZlT3B0aW9ucyAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbW1pdE1lc3NhZ2U6ICdDaGFuZ2VzIHNhdmVkICh2aWEgSGFpa3UgRGVza3RvcCknLFxuICAgICAgc2F2ZVN0cmF0ZWd5OiBTTkFQU0hPVF9TQVZFX1JFU09MVVRJT05fU1RSQVRFR0lFU1t0aGlzLnN0YXRlLnNuYXBzaG90U2F2ZVJlc29sdXRpb25TdHJhdGVneU5hbWVdXG4gICAgfVxuICB9XG5cbiAgaGFuZGxlU2F2ZVNuYXBzaG90Q2xpY2sgKCkge1xuICAgIGlmICh0aGlzLnN0YXRlLnNuYXBzaG90U2F2ZUVycm9yKSByZXR1cm4gdm9pZCAoMClcbiAgICBpZiAodGhpcy5zdGF0ZS5pc1NuYXBzaG90U2F2ZUluUHJvZ3Jlc3MpIHJldHVybiB2b2lkICgwKVxuICAgIGlmICh0aGlzLnN0YXRlLnNuYXBzaG90TWVyZ2VDb25mbGljdHMpIHJldHVybiB2b2lkICgwKVxuICAgIGlmICh0aGlzLnN0YXRlLnNob3dTaGFyZVBvcG92ZXIpIHJldHVybiB2b2lkICgwKVxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7c2hvd1NoYXJlUG9wb3ZlcjogIXRoaXMuc3RhdGUuc2hvd1NoYXJlUG9wb3Zlcn0pXG5cbiAgICBpZiAodGhpcy5wcm9wcy50b3VyQ2xpZW50KSB0aGlzLnByb3BzLnRvdXJDbGllbnQubmV4dCgpXG5cbiAgICByZXR1cm4gdGhpcy5wZXJmb3JtUHJvamVjdFNhdmUoKVxuICB9XG5cbiAgcGVyZm9ybVByb2plY3RJbmZvRmV0Y2ggKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoeyBpc1Byb2plY3RJbmZvRmV0Y2hJblByb2dyZXNzOiB0cnVlIH0pXG4gICAgcmV0dXJuIHRoaXMucHJvcHMud2Vic29ja2V0LnJlcXVlc3QoeyBtZXRob2Q6ICdmZXRjaFByb2plY3RJbmZvJywgcGFyYW1zOiBbdGhpcy5wcm9wcy5mb2xkZXIsIHRoaXMucHJvcHMucHJvamVjdC5wcm9qZWN0TmFtZSwgdGhpcy5wcm9wcy51c2VybmFtZSwgdGhpcy5wcm9wcy5wYXNzd29yZCwge31dIH0sIChwcm9qZWN0SW5mb0ZldGNoRXJyb3IsIHByb2plY3RJbmZvKSA9PiB7XG4gICAgICB0aGlzLnNldFN0YXRlKHsgaXNQcm9qZWN0SW5mb0ZldGNoSW5Qcm9ncmVzczogZmFsc2UgfSlcblxuICAgICAgaWYgKHByb2plY3RJbmZvRmV0Y2hFcnJvcikge1xuICAgICAgICBjb25zb2xlLmVycm9yKHByb2plY3RJbmZvRmV0Y2hFcnJvci5tZXNzYWdlKVxuICAgICAgICAvLyBXZSBtaWdodCBvbmx5IGNhcmUgYWJvdXQgdGhpcyBpZiBpdCBjb21lcyB1cCBkdXJpbmcgYSBzYXZlLi4uICNGSVhNRSA/P1xuICAgICAgICBpZiAocHJvamVjdEluZm9GZXRjaEVycm9yLm1lc3NhZ2UgPT09ICdUaW1lZCBvdXQgd2FpdGluZyBmb3IgcHJvamVjdCBzaGFyZSBpbmZvJykge1xuICAgICAgICAgIC8vID9cbiAgICAgICAgICByZXR1cm4gdm9pZCAoMCkgLy8gR290dGEgcmV0dXJuIGhlcmUgLSBkb24ndCB3YW50IHRvIGZhbGwgdGhyb3VnaCBhcyB0aG91Z2ggd2UgYWN0dWFsbHkgZ290IHByb2plY3RJbmZvIGJlbG93XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuc2V0U3RhdGUoeyBwcm9qZWN0SW5mb0ZldGNoRXJyb3IgfSlcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB0aGlzLnNldFN0YXRlKHsgcHJvamVjdEluZm8gfSlcbiAgICAgIGlmICh0aGlzLnByb3BzLnJlY2VpdmVQcm9qZWN0SW5mbykgdGhpcy5wcm9wcy5yZWNlaXZlUHJvamVjdEluZm8ocHJvamVjdEluZm8pXG4gICAgICBpZiAocHJvamVjdEluZm8uc2hhcmVMaW5rKSB0aGlzLnNldFN0YXRlKHsgbGlua0FkZHJlc3M6IHByb2plY3RJbmZvLnNoYXJlTGluayB9KVxuICAgIH0pXG4gIH1cblxuICB3aXRoUHJvamVjdEluZm8gKG90aGVyT2JqZWN0KSB7XG4gICAgbGV0IHByb2ogPSB0aGlzLnN0YXRlLnByb2plY3RJbmZvIHx8IHt9XG4gICAgcmV0dXJuIGFzc2lnbih7fSwgb3RoZXJPYmplY3QsIHtcbiAgICAgIG9yZ2FuaXphdGlvbjogcHJvai5vcmdhbml6YXRpb25OYW1lLFxuICAgICAgdXVpZDogcHJvai5wcm9qZWN0VWlkLFxuICAgICAgc2hhOiBwcm9qLnNoYSxcbiAgICAgIGJyYW5jaDogcHJvai5icmFuY2hOYW1lXG4gICAgfSlcbiAgfVxuXG4gIHJlcXVlc3RTYXZlUHJvamVjdCAoY2IpIHtcbiAgICByZXR1cm4gdGhpcy5wcm9wcy53ZWJzb2NrZXQucmVxdWVzdCh7IG1ldGhvZDogJ3NhdmVQcm9qZWN0JywgcGFyYW1zOiBbdGhpcy5wcm9wcy5mb2xkZXIsIHRoaXMucHJvcHMucHJvamVjdC5wcm9qZWN0TmFtZSwgdGhpcy5wcm9wcy51c2VybmFtZSwgdGhpcy5wcm9wcy5wYXNzd29yZCwgdGhpcy5nZXRQcm9qZWN0U2F2ZU9wdGlvbnMoKV0gfSwgY2IpXG4gIH1cblxuICBwZXJmb3JtUHJvamVjdFNhdmUgKCkge1xuICAgIG1peHBhbmVsLmhhaWt1VHJhY2soJ2NyZWF0b3I6cHJvamVjdDpzYXZpbmcnLCB0aGlzLndpdGhQcm9qZWN0SW5mbyh7XG4gICAgICB1c2VybmFtZTogdGhpcy5wcm9wcy51c2VybmFtZSxcbiAgICAgIHByb2plY3Q6IHRoaXMucHJvcHMucHJvamVjdE5hbWVcbiAgICB9KSlcbiAgICB0aGlzLnNldFN0YXRlKHsgaXNTbmFwc2hvdFNhdmVJblByb2dyZXNzOiB0cnVlIH0pXG5cbiAgICByZXR1cm4gdGhpcy5yZXF1ZXN0U2F2ZVByb2plY3QoKHNuYXBzaG90U2F2ZUVycm9yLCBzbmFwc2hvdERhdGEpID0+IHtcbiAgICAgIGlmIChzbmFwc2hvdFNhdmVFcnJvcikge1xuICAgICAgICBjb25zb2xlLmVycm9yKHNuYXBzaG90U2F2ZUVycm9yKVxuICAgICAgICBpZiAoc25hcHNob3RTYXZlRXJyb3IubWVzc2FnZSA9PT0gJ1RpbWVkIG91dCB3YWl0aW5nIGZvciBwcm9qZWN0IHNoYXJlIGluZm8nKSB7XG4gICAgICAgICAgdGhpcy5wcm9wcy5jcmVhdGVOb3RpY2Uoe1xuICAgICAgICAgICAgdHlwZTogJ3dhcm5pbmcnLFxuICAgICAgICAgICAgdGl0bGU6ICdIbW0uLi4nLFxuICAgICAgICAgICAgbWVzc2FnZTogJ1B1Ymxpc2hpbmcgeW91ciBwcm9qZWN0IHNlZW1zIHRvIGJlIHRha2luZyBhIGxvbmcgdGltZS4g8J+YoiBQbGVhc2UgdHJ5IGFnYWluIGluIGEgZmV3IG1vbWVudHMuIElmIHlvdSBzZWUgdGhpcyBtZXNzYWdlIGFnYWluLCBjb250YWN0IEhhaWt1IGZvciBzdXBwb3J0LidcbiAgICAgICAgICB9KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMucHJvcHMuY3JlYXRlTm90aWNlKHtcbiAgICAgICAgICAgIHR5cGU6ICdkYW5nZXInLFxuICAgICAgICAgICAgdGl0bGU6ICdPaCBubyEnLFxuICAgICAgICAgICAgbWVzc2FnZTogJ1dlIHdlcmUgdW5hYmxlIHRvIHB1Ymxpc2ggeW91ciBwcm9qZWN0LiDwn5iiIFBsZWFzZSB0cnkgYWdhaW4gaW4gYSBmZXcgbW9tZW50cy4gSWYgeW91IHN0aWxsIHNlZSB0aGlzIGVycm9yLCBjb250YWN0IEhhaWt1IGZvciBzdXBwb3J0LidcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLnNldFN0YXRlKHsgaXNTbmFwc2hvdFNhdmVJblByb2dyZXNzOiBmYWxzZSwgc25hcHNob3RTYXZlUmVzb2x1dGlvblN0cmF0ZWd5TmFtZTogJ25vcm1hbCcsIHNuYXBzaG90U2F2ZUVycm9yIH0sICgpID0+IHtcbiAgICAgICAgICByZXR1cm4gc2V0VGltZW91dCgoKSA9PiB0aGlzLnNldFN0YXRlKHsgc25hcHNob3RTYXZlRXJyb3I6IG51bGwgfSksIDIwMDApXG4gICAgICAgIH0pXG4gICAgICB9XG5cbiAgICAgIHRoaXMuc2V0U3RhdGUoeyBpc1NuYXBzaG90U2F2ZUluUHJvZ3Jlc3M6IGZhbHNlLCBzbmFwc2hvdFNhdmVDb25maXJtZWQ6IHRydWUgfSlcblxuICAgICAgaWYgKHNuYXBzaG90RGF0YSkge1xuICAgICAgICBpZiAoc25hcHNob3REYXRhLmNvbmZsaWN0cykge1xuICAgICAgICAgIGNvbnNvbGUud2FybignW2NyZWF0b3JdIE1lcmdlIGNvbmZsaWN0cyBmb3VuZCEnKVxuICAgICAgICAgIHRoaXMucHJvcHMuY3JlYXRlTm90aWNlKHtcbiAgICAgICAgICAgIHR5cGU6ICd3YXJuaW5nJyxcbiAgICAgICAgICAgIHRpdGxlOiAnTWVyZ2UgY29uZmxpY3RzIScsXG4gICAgICAgICAgICBtZXNzYWdlOiAnV2UgY291bGRuXFwndCBtZXJnZSB5b3VyIGNoYW5nZXMuIPCfmKIgWW91XFwnbGwgbmVlZCB0byBkZWNpZGUgaG93IHRvIG1lcmdlIHlvdXIgY2hhbmdlcyBiZWZvcmUgY29udGludWluZy4nXG4gICAgICAgICAgfSlcbiAgICAgICAgICByZXR1cm4gdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICBzbmFwc2hvdE1lcmdlQ29uZmxpY3RzOiBzbmFwc2hvdERhdGEuY29uZmxpY3RzLFxuICAgICAgICAgICAgc2hvd1NoYXJlUG9wb3ZlcjogZmFsc2VcbiAgICAgICAgICB9KVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc29sZS5pbmZvKCdbY3JlYXRvcl0gU2F2ZSBjb21wbGV0ZScsIHNuYXBzaG90RGF0YSlcblxuICAgICAgICAvLyBVbmxlc3Mgd2Ugc2V0IGJhY2sgdG8gbm9ybWFsLCBzdWJzZXF1ZW50IHNhdmVzIHdpbGwgc3RpbGwgYmUgc2V0IHRvIHVzZSB0aGUgc3RyaWN0IG91cnMvdGhlaXJzIHN0cmF0ZWd5LFxuICAgICAgICAvLyB3aGljaCB3aWxsIGNsb2JiZXIgdXBkYXRlcyB0aGF0IHdlIG1pZ2h0IHdhbnQgdG8gYWN0dWFsbHkgbWVyZ2UgZ3JhY2VmdWxseS5cbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHNuYXBzaG90U2F2ZVJlc29sdXRpb25TdHJhdGVneU5hbWU6ICdub3JtYWwnIH0pXG5cbiAgICAgICAgaWYgKHNuYXBzaG90RGF0YS5zaGFyZUxpbmspIHtcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgbGlua0FkZHJlc3M6IHNuYXBzaG90RGF0YS5zaGFyZUxpbmsgfSlcbiAgICAgICAgfVxuXG4gICAgICAgIG1peHBhbmVsLmhhaWt1VHJhY2soJ2NyZWF0b3I6cHJvamVjdDpzYXZlZCcsIHRoaXMud2l0aFByb2plY3RJbmZvKHtcbiAgICAgICAgICB1c2VybmFtZTogdGhpcy5wcm9wcy51c2VybmFtZSxcbiAgICAgICAgICBwcm9qZWN0OiB0aGlzLnByb3BzLnByb2plY3ROYW1lXG4gICAgICAgIH0pKVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gc2V0VGltZW91dCgoKSA9PiB0aGlzLnNldFN0YXRlKHsgc25hcHNob3RTYXZlQ29uZmlybWVkOiBmYWxzZSB9KSwgMjAwMClcbiAgICB9KVxuICB9XG5cbiAgcmVuZGVyU25hcHNob3RTYXZlSW5uZXJCdXR0b24gKCkge1xuICAgIGlmICh0aGlzLnN0YXRlLnNuYXBzaG90U2F2ZUVycm9yKSByZXR1cm4gPGRpdiBzdHlsZT17e2hlaWdodDogMTgsIG1hcmdpblJpZ2h0OiAtNX19PjxEYW5nZXJJY29uU1ZHIGZpbGw9J3RyYW5zcGFyZW50JyAvPjwvZGl2PlxuICAgIGlmICh0aGlzLnN0YXRlLnNuYXBzaG90TWVyZ2VDb25mbGljdHMpIHJldHVybiA8ZGl2IHN0eWxlPXt7aGVpZ2h0OiAxOSwgbWFyZ2luUmlnaHQ6IDAsIG1hcmdpblRvcDogLTJ9fT48V2FybmluZ0ljb25TVkcgZmlsbD0ndHJhbnNwYXJlbnQnIGNvbG9yPXtQYWxldHRlLk9SQU5HRX0gLz48L2Rpdj5cbiAgICBpZiAodGhpcy5zdGF0ZS5zbmFwc2hvdFNhdmVDb25maXJtZWQpIHJldHVybiA8ZGl2IHN0eWxlPXt7IGhlaWdodDogMTggfX0+PFN1Y2Nlc3NJY29uU1ZHIHZpZXdCb3g9JzAgMCAxNCAxNCcgZmlsbD0ndHJhbnNwYXJlbnQnIC8+PC9kaXY+XG4gICAgcmV0dXJuIDxQdWJsaXNoU25hcHNob3RTVkcgLz5cbiAgfVxuXG4gIGhhbmRsZU1lcmdlUmVzb2x2ZU91cnMgKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoeyBzbmFwc2hvdE1lcmdlQ29uZmxpY3RzOiBudWxsLCBzbmFwc2hvdFNhdmVSZXNvbHV0aW9uU3RyYXRlZ3lOYW1lOiAnb3VycycgfSwgKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMucGVyZm9ybVByb2plY3RTYXZlKClcbiAgICB9KVxuICB9XG5cbiAgaGFuZGxlTWVyZ2VSZXNvbHZlVGhlaXJzICgpIHtcbiAgICB0aGlzLnNldFN0YXRlKHsgc25hcHNob3RNZXJnZUNvbmZsaWN0czogbnVsbCwgc25hcHNob3RTYXZlUmVzb2x1dGlvblN0cmF0ZWd5TmFtZTogJ3RoZWlycycgfSwgKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMucGVyZm9ybVByb2plY3RTYXZlKClcbiAgICB9KVxuICB9XG5cbiAgcmVuZGVyTWVyZ2VDb25mbGljdFJlc29sdXRpb25BcmVhICgpIHtcbiAgICBpZiAoIXRoaXMuc3RhdGUuc25hcHNob3RNZXJnZUNvbmZsaWN0cykgcmV0dXJuICcnXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgc3R5bGU9e3sgcG9zaXRpb246ICdhYnNvbHV0ZScsIGxlZnQ6IDAsIHJpZ2h0OiAxNTAsIHRvcDogNCwgcGFkZGluZzogNSwgYm9yZGVyUmFkaXVzOiA0LCBjb2xvcjogUGFsZXR0ZS5ST0NLLCB0ZXh0QWxpZ246ICdyaWdodCcsIG92ZXJmbG93OiAnaGlkZGVuJyB9fT5cbiAgICAgICAgQ29uZmxpY3QgZm91bmQheycgJ31cbiAgICAgICAgPGEgb25DbGljaz17dGhpcy5oYW5kbGVNZXJnZVJlc29sdmVPdXJzfSBzdHlsZT17eyBjdXJzb3I6ICdwb2ludGVyJywgdGV4dERlY29yYXRpb246ICd1bmRlcmxpbmUnLCBjb2xvcjogUGFsZXR0ZS5HUkVFTiB9fT5Gb3JjZSB5b3VyIGNoYW5nZXM8L2E+eycgJ31cbiAgICAgICAgb3IgPGEgb25DbGljaz17dGhpcy5oYW5kbGVNZXJnZVJlc29sdmVUaGVpcnN9IHN0eWxlPXt7IGN1cnNvcjogJ3BvaW50ZXInLCB0ZXh0RGVjb3JhdGlvbjogJ3VuZGVybGluZScsIGNvbG9yOiBQYWxldHRlLlJFRCB9fT5kaXNjYXJkIHlvdXJzICZhbXA7IGFjY2VwdCB0aGVpcnM8L2E+P1xuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgaG92ZXJTdHlsZUZvclNhdmVCdXR0b24gKCkge1xuICAgIGlmICh0aGlzLnN0YXRlLmlzU25hcHNob3RTYXZlSW5Qcm9ncmVzcykgcmV0dXJuIG51bGxcbiAgICBpZiAodGhpcy5zdGF0ZS5zbmFwc2hvdFNhdmVFcnJvcikgcmV0dXJuIG51bGxcbiAgICBpZiAodGhpcy5zdGF0ZS5zbmFwc2hvdE1lcmdlQ29uZmxpY3RzKSByZXR1cm4gbnVsbFxuICAgIGlmICh0aGlzLnN0YXRlLnNuYXBzaG90U2F2ZUNvbmZpcm1lZCkgcmV0dXJuIG51bGxcbiAgICByZXR1cm4gQlROX1NUWUxFUy5idG5JY29uSG92ZXJcbiAgfVxuXG4gIHJlbmRlciAoKSB7XG4gICAgY29uc3QgeyBzaG93U2hhcmVQb3BvdmVyIH0gPSB0aGlzLnN0YXRlXG4gICAgY29uc3QgdGl0bGVUZXh0ID0gdGhpcy5zdGF0ZS5zaG93Q29waWVkXG4gICAgICA/ICdDb3BpZWQnXG4gICAgICA6ICdTaGFyZSAmIEVtYmVkJ1xuXG4gICAgbGV0IGJ0blRleHQgPSAnUFVCTElTSCdcbiAgICBpZiAodGhpcy5zdGF0ZS5zbmFwc2hvdFNhdmVDb25maXJtZWQpIGJ0blRleHQgPSAnUFVCTElTSEVEJ1xuICAgIGlmICh0aGlzLnN0YXRlLmlzU25hcHNob3RTYXZlSW5Qcm9ncmVzcykgYnRuVGV4dCA9ICdQVUJMSVNISU5HJ1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgc3R5bGU9e1NUWUxFUy5mcmFtZX0gY2xhc3NOYW1lPSdmcmFtZSc+XG4gICAgICAgIDxQb3BvdmVyXG4gICAgICAgICAgcGxhY2U9J2JlbG93J1xuICAgICAgICAgIGlzT3Blbj17c2hvd1NoYXJlUG9wb3Zlcn1cbiAgICAgICAgICBib2R5PXtcbiAgICAgICAgICAgIDxQb3BvdmVyQm9keVJhZGl1bWl6ZWRcbiAgICAgICAgICAgICAgcGFyZW50PXt0aGlzfVxuICAgICAgICAgICAgICB0aXRsZVRleHQ9e3RpdGxlVGV4dH1cbiAgICAgICAgICAgICAgc25hcHNob3RTYXZlQ29uZmlybWVkPXt0aGlzLnN0YXRlLnNuYXBzaG90U2F2ZUNvbmZpcm1lZH1cbiAgICAgICAgICAgICAgaXNTbmFwc2hvdFNhdmVJblByb2dyZXNzPXt0aGlzLnN0YXRlLmlzU25hcHNob3RTYXZlSW5Qcm9ncmVzc31cbiAgICAgICAgICAgICAgaXNQcm9qZWN0SW5mb0ZldGNoSW5Qcm9ncmVzcz17dGhpcy5zdGF0ZS5pc1Byb2plY3RJbmZvRmV0Y2hJblByb2dyZXNzfVxuICAgICAgICAgICAgICBsaW5rQWRkcmVzcz17dGhpcy5zdGF0ZS5saW5rQWRkcmVzc31cbiAgICAgICAgICAgICAgY2xvc2U9eygpID0+IHRoaXMuc2V0U3RhdGUoeyBzaG93U2hhcmVQb3BvdmVyOiBmYWxzZSB9KX0gLz5cbiAgICAgICAgICB9PlxuICAgICAgICAgIDxidXR0b24ga2V5PSdzYXZlJ1xuICAgICAgICAgICAgaWQ9J3B1Ymxpc2gnXG4gICAgICAgICAgICBvbkNsaWNrPXt0aGlzLmhhbmRsZVNhdmVTbmFwc2hvdENsaWNrfVxuICAgICAgICAgICAgc3R5bGU9e1tcbiAgICAgICAgICAgICAgQlROX1NUWUxFUy5idG5UZXh0LFxuICAgICAgICAgICAgICBCVE5fU1RZTEVTLnJpZ2h0QnRucyxcbiAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5pc1NuYXBzaG90U2F2ZUluUHJvZ3Jlc3MgJiYgU1RZTEVTLmRpc2FibGVkXG4gICAgICAgICAgICBdfT5cbiAgICAgICAgICAgIHt0aGlzLnJlbmRlclNuYXBzaG90U2F2ZUlubmVyQnV0dG9uKCl9PHNwYW4gc3R5bGU9e3ttYXJnaW5MZWZ0OiA3fX0+e2J0blRleHR9PC9zcGFuPlxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8L1BvcG92ZXI+XG5cbiAgICAgICAge3RoaXMucmVuZGVyTWVyZ2VDb25mbGljdFJlc29sdXRpb25BcmVhKCl9XG4gICAgICAgIDxidXR0b24gb25DbGljaz17dGhpcy5oYW5kbGVDb25uZWN0aW9uQ2xpY2t9IHN0eWxlPXtbQlROX1NUWUxFUy5idG5JY29uLCBCVE5fU1RZTEVTLmJ0bkljb25Ib3ZlciwgU1RZTEVTLmhpZGVdfSBrZXk9J2Nvbm5lY3QnPlxuICAgICAgICAgIDxDb25uZWN0aW9uSWNvblNWRyAvPlxuICAgICAgICA8L2J1dHRvbj5cblxuICAgICAgICB7IGZhbHNlICYmXG4gICAgICAgICAgPFRvb2xTZWxlY3RvciB3ZWJzb2NrZXQ9e3RoaXMucHJvcHMud2Vic29ja2V0fSAvPlxuICAgICAgICB9XG5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxufVxuXG5TdGFnZVRpdGxlQmFyLnByb3BUeXBlcyA9IHtcbiAgZm9sZGVyOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gIHByb2plY3ROYW1lOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuICB1c2VybmFtZTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcbiAgcGFzc3dvcmQ6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG4gIHdlYnNvY2tldDogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICBjcmVhdGVOb3RpY2U6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIHJlbW92ZU5vdGljZTogUmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgcmVjZWl2ZVByb2plY3RJbmZvOiBSZWFjdC5Qcm9wVHlwZXMuZnVuY1xufVxuXG5leHBvcnQgZGVmYXVsdCBSYWRpdW0oU3RhZ2VUaXRsZUJhcilcbiJdfQ==