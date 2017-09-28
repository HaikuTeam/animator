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
    right: -59,
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
      return this.props.titleText !== nextProps.titleText || this.props.linkAddress !== nextProps.linkAddress || this.props.isSnapshotSaveInProgress !== nextProps.isSnapshotSaveInProgress || this.props.isProjectInfoFetchInProgress !== nextProps.isProjectInfoFetchInProgress;
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      return _react2.default.createElement(
        'div',
        { style: [STYLES.sharePopover, this.props.snapshotSaveConfirmed && { right: -67 }, this.props.isSnapshotSaveInProgress && { right: -70 }], __source: {
            fileName: _jsxFileName,
            lineNumber: 136
          },
          __self: this
        },
        _react2.default.createElement(
          'button',
          { style: STYLES.popoverClose, onClick: this.props.close, __source: {
              fileName: _jsxFileName,
              lineNumber: 137
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
              lineNumber: 139
            },
            __self: this
          },
          this.props.isSnapshotSaveInProgress || this.props.isProjectInfoFetchInProgress ? _react2.default.createElement(
            'span',
            { style: [STYLES.link, STYLES.generatingLink], __source: {
                fileName: _jsxFileName,
                lineNumber: 141
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
                lineNumber: 142
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
                lineNumber: 143
              },
              __self: this
            },
            this.props.isSnapshotSaveInProgress || this.props.isProjectInfoFetchInProgress ? _react2.default.createElement(
              'span',
              { style: [STYLES.copy, STYLES.copyLoading], __source: {
                  fileName: _jsxFileName,
                  lineNumber: 154
                },
                __self: this
              },
              _react2.default.createElement(_betterReactSpinkit.ThreeBounce, { size: 3, color: _Palette2.default.ROCK, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 154
                },
                __self: this
              })
            ) : _react2.default.createElement(
              'span',
              { style: STYLES.copy, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 155
                },
                __self: this
              },
              _react2.default.createElement(_Icons.CliboardIconSVG, {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 155
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
      }, 64 * 4);

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
            lineNumber: 394
          },
          __self: this
        },
        _react2.default.createElement(_Icons.DangerIconSVG, { fill: 'transparent', __source: {
            fileName: _jsxFileName,
            lineNumber: 394
          },
          __self: this
        })
      );
      if (this.state.snapshotMergeConflicts) return _react2.default.createElement(
        'div',
        { style: { height: 19, marginRight: 0, marginTop: -2 }, __source: {
            fileName: _jsxFileName,
            lineNumber: 395
          },
          __self: this
        },
        _react2.default.createElement(_Icons.WarningIconSVG, { fill: 'transparent', color: _Palette2.default.ORANGE, __source: {
            fileName: _jsxFileName,
            lineNumber: 395
          },
          __self: this
        })
      );
      if (this.state.snapshotSaveConfirmed) return _react2.default.createElement(
        'div',
        { style: { height: 18 }, __source: {
            fileName: _jsxFileName,
            lineNumber: 396
          },
          __self: this
        },
        _react2.default.createElement(_Icons.SuccessIconSVG, { viewBox: '0 0 14 14', fill: 'transparent', __source: {
            fileName: _jsxFileName,
            lineNumber: 396
          },
          __self: this
        })
      );
      return _react2.default.createElement(_Icons.PublishSnapshotSVG, {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 397
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
            lineNumber: 415
          },
          __self: this
        },
        'Conflict found!',
        ' ',
        _react2.default.createElement(
          'a',
          { onClick: this.handleMergeResolveOurs, style: { cursor: 'pointer', textDecoration: 'underline', color: _Palette2.default.GREEN }, __source: {
              fileName: _jsxFileName,
              lineNumber: 417
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
              lineNumber: 418
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
            lineNumber: 442
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
                lineNumber: 447
              },
              __self: this
            }), __source: {
              fileName: _jsxFileName,
              lineNumber: 443
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
                lineNumber: 456
              },
              __self: this
            },
            this.renderSnapshotSaveInnerButton(),
            _react2.default.createElement(
              'span',
              { style: { marginLeft: 7 }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 464
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
              lineNumber: 469
            },
            __self: this
          },
          _react2.default.createElement(_Icons.ConnectionIconSVG, {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 470
            },
            __self: this
          })
        ),
        false && _react2.default.createElement(_ToolSelector2.default, { websocket: this.props.websocket, __source: {
            fileName: _jsxFileName,
            lineNumber: 474
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9yZWFjdC9jb21wb25lbnRzL1N0YWdlVGl0bGVCYXIuanMiXSwibmFtZXMiOlsibWl4cGFuZWwiLCJyZXF1aXJlIiwiU1RZTEVTIiwiaGlkZSIsImRpc3BsYXkiLCJmcmFtZSIsImJhY2tncm91bmRDb2xvciIsIkNPQUwiLCJwb3NpdGlvbiIsInRvcCIsInpJbmRleCIsImhlaWdodCIsInBhZGRpbmciLCJkaXNhYmxlZCIsIm9wYWNpdHkiLCJjdXJzb3IiLCJzaGFyZVBvcG92ZXIiLCJyaWdodCIsIkZBVEhFUl9DT0FMIiwid2lkdGgiLCJmb250U2l6ZSIsImNvbG9yIiwiUk9DSyIsInRleHRBbGlnbiIsImJvcmRlclJhZGl1cyIsImJveFNoYWRvdyIsInBvcG92ZXJDbG9zZSIsInRleHRUcmFuc2Zvcm0iLCJmb290ZXIiLCJEQVJLX0dSQVkiLCJmYWRlIiwiYm90dG9tIiwiYm9yZGVyQm90dG9tUmlnaHRSYWRpdXMiLCJib3JkZXJCb3R0b21MZWZ0UmFkaXVzIiwicGFkZGluZ1RvcCIsInRpbWUiLCJmb250V2VpZ2h0IiwibWFyZ2luTGVmdCIsImNvcHkiLCJqdXN0aWZ5Q29udGVudCIsImFsaWduSXRlbXMiLCJjb3B5TG9hZGluZyIsInBhZGRpbmdCb3R0b20iLCJwb2ludGVyRXZlbnRzIiwibGlua0hvbHN0ZXIiLCJtYXJnaW5Ub3AiLCJib3JkZXIiLCJsaW5rIiwiTElHSFRfQkxVRSIsImxpZ2h0ZW4iLCJsZWZ0IiwiZ2VuZXJhdGluZ0xpbmsiLCJmb250U3R5bGUiLCJTTkFQU0hPVF9TQVZFX1JFU09MVVRJT05fU1RSQVRFR0lFUyIsIm5vcm1hbCIsInN0cmF0ZWd5IiwiZmF2b3IiLCJvdXJzIiwidGhlaXJzIiwiUG9wb3ZlckJvZHkiLCJuZXh0UHJvcHMiLCJwcm9wcyIsInRpdGxlVGV4dCIsImxpbmtBZGRyZXNzIiwiaXNTbmFwc2hvdFNhdmVJblByb2dyZXNzIiwiaXNQcm9qZWN0SW5mb0ZldGNoSW5Qcm9ncmVzcyIsInNuYXBzaG90U2F2ZUNvbmZpcm1lZCIsImNsb3NlIiwib3BlbkV4dGVybmFsIiwic3Vic3RyaW5nIiwicGFyZW50Iiwic2V0U3RhdGUiLCJjb3BpZWQiLCJzaG93Q29waWVkIiwic2V0VGltZW91dCIsIkNvbXBvbmVudCIsIlBvcG92ZXJCb2R5UmFkaXVtaXplZCIsIlN0YWdlVGl0bGVCYXIiLCJoYW5kbGVDb25uZWN0aW9uQ2xpY2siLCJiaW5kIiwiaGFuZGxlVW5kb0NsaWNrIiwiaGFuZGxlUmVkb0NsaWNrIiwiaGFuZGxlU2F2ZVNuYXBzaG90Q2xpY2siLCJoYW5kbGVNZXJnZVJlc29sdmVPdXJzIiwiaGFuZGxlTWVyZ2VSZXNvbHZlVGhlaXJzIiwiX2lzTW91bnRlZCIsInN0YXRlIiwic25hcHNob3RTYXZlUmVzb2x1dGlvblN0cmF0ZWd5TmFtZSIsInNuYXBzaG90TWVyZ2VDb25mbGljdHMiLCJzbmFwc2hvdFNhdmVFcnJvciIsInNob3dTaGFyZVBvcG92ZXIiLCJwcm9qZWN0SW5mb0ZldGNoRXJyb3IiLCJwcm9qZWN0SW5mbyIsImdpdFVuZG9hYmxlcyIsImdpdFJlZG9hYmxlcyIsInBlcmZvcm1Qcm9qZWN0SW5mb0ZldGNoIiwiX2ZldGNoTWFzdGVyU3RhdGVJbnRlcnZhbCIsInNldEludGVydmFsIiwid2Vic29ja2V0IiwicmVxdWVzdCIsIm1ldGhvZCIsInBhcmFtcyIsImZvbGRlciIsImhlYXJ0YmVhdEVyciIsIm1hc3RlclN0YXRlIiwiRXJyb3IiLCJjb25zb2xlIiwiZXJyb3IiLCJjbGVhckludGVydmFsIiwiY3JlYXRlTm90aWNlIiwidHlwZSIsInRpdGxlIiwibWVzc2FnZSIsInNlbmQiLCJvbiIsImVyciIsImNvbW1pdE1lc3NhZ2UiLCJzYXZlU3RyYXRlZ3kiLCJ0b3VyQ2xpZW50IiwibmV4dCIsInBlcmZvcm1Qcm9qZWN0U2F2ZSIsInByb2plY3QiLCJwcm9qZWN0TmFtZSIsInVzZXJuYW1lIiwicGFzc3dvcmQiLCJyZWNlaXZlUHJvamVjdEluZm8iLCJzaGFyZUxpbmsiLCJvdGhlck9iamVjdCIsInByb2oiLCJvcmdhbml6YXRpb24iLCJvcmdhbml6YXRpb25OYW1lIiwidXVpZCIsInByb2plY3RVaWQiLCJzaGEiLCJicmFuY2giLCJicmFuY2hOYW1lIiwiY2IiLCJnZXRQcm9qZWN0U2F2ZU9wdGlvbnMiLCJoYWlrdVRyYWNrIiwid2l0aFByb2plY3RJbmZvIiwicmVxdWVzdFNhdmVQcm9qZWN0Iiwic25hcHNob3REYXRhIiwiY29uZmxpY3RzIiwid2FybiIsImluZm8iLCJtYXJnaW5SaWdodCIsIk9SQU5HRSIsIm92ZXJmbG93IiwidGV4dERlY29yYXRpb24iLCJHUkVFTiIsIlJFRCIsImJ0bkljb25Ib3ZlciIsImJ0blRleHQiLCJyaWdodEJ0bnMiLCJyZW5kZXJTbmFwc2hvdFNhdmVJbm5lckJ1dHRvbiIsInJlbmRlck1lcmdlQ29uZmxpY3RSZXNvbHV0aW9uQXJlYSIsImJ0bkljb24iLCJwcm9wVHlwZXMiLCJQcm9wVHlwZXMiLCJzdHJpbmciLCJpc1JlcXVpcmVkIiwib2JqZWN0IiwiZnVuYyIsInJlbW92ZU5vdGljZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOztBQUNBOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7O0FBV0EsSUFBSUEsV0FBV0MsUUFBUSx3QkFBUixDQUFmOztBQUVBLElBQU1DLFNBQVM7QUFDYkMsUUFBTTtBQUNKQyxhQUFTO0FBREwsR0FETztBQUliQyxTQUFPO0FBQ0xDLHFCQUFpQixrQkFBUUMsSUFEcEI7QUFFTEMsY0FBVSxVQUZMO0FBR0xDLFNBQUssQ0FIQTtBQUlMQyxZQUFRLENBSkg7QUFLTEMsWUFBUSxNQUxIO0FBTUxDLGFBQVM7QUFOSixHQUpNO0FBWWJDLFlBQVU7QUFDUkMsYUFBUyxHQUREO0FBRVJDLFlBQVE7QUFGQSxHQVpHO0FBZ0JiQyxnQkFBYztBQUNaUixjQUFVLFVBREU7QUFFWkMsU0FBSyxFQUZPO0FBR1pRLFdB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QkFBTWtDLFNBQU4sQ0FBZ0JDLE1BSkY7QUFLeEI3RCxhQUFXLGdCQUFNNEQsU0FBTixDQUFnQkcsTUFBaEIsQ0FBdUJELFVBTFY7QUFNeEJuRCxnQkFBYyxnQkFBTWlELFNBQU4sQ0FBZ0JJLElBQWhCLENBQXFCRixVQU5YO0FBT3hCRyxnQkFBYyxnQkFBTUwsU0FBTixDQUFnQkksSUFBaEIsQ0FBcUJGLFVBUFg7QUFReEJuQyxzQkFBb0IsZ0JBQU1pQyxTQUFOLENBQWdCSTtBQVJaLENBQTFCOztrQkFXZSxzQkFBT3JGLGFBQVAsQyIsImZpbGUiOiJTdGFnZVRpdGxlQmFyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgc2hlbGwsIGlwY1JlbmRlcmVyIH0gZnJvbSAnZWxlY3Ryb24nXG5pbXBvcnQgUmFkaXVtIGZyb20gJ3JhZGl1bSdcbmltcG9ydCBQb3BvdmVyIGZyb20gJ3JlYWN0LXBvcG92ZXInXG5pbXBvcnQgYXNzaWduIGZyb20gJ2xvZGFzaC5hc3NpZ24nXG5pbXBvcnQgUGFsZXR0ZSBmcm9tICcuL1BhbGV0dGUnXG5pbXBvcnQgeyBUaHJlZUJvdW5jZSB9IGZyb20gJ2JldHRlci1yZWFjdC1zcGlua2l0J1xuaW1wb3J0IENvbG9yIGZyb20gJ2NvbG9yJ1xuaW1wb3J0IHsgQlROX1NUWUxFUyB9IGZyb20gJy4uL3N0eWxlcy9idG5TaGFyZWQnXG5pbXBvcnQgQ29weVRvQ2xpcGJvYXJkIGZyb20gJ3JlYWN0LWNvcHktdG8tY2xpcGJvYXJkJ1xuaW1wb3J0IFRvb2xTZWxlY3RvciBmcm9tICcuL1Rvb2xTZWxlY3RvcidcbmltcG9ydCB7XG4gIFB1Ymxpc2hTbmFwc2hvdFNWRyxcbiAgQ29ubmVjdGlvbkljb25TVkcsXG4gIC8vIFVuZG9JY29uU1ZHLFxuICAvLyBSZWRvSWNvblNWRyxcbiAgV2FybmluZ0ljb25TVkcsXG4gIFN1Y2Nlc3NJY29uU1ZHLFxuICBEYW5nZXJJY29uU1ZHLFxuICBDbGlib2FyZEljb25TVkdcbn0gZnJvbSAnLi9JY29ucydcblxudmFyIG1peHBhbmVsID0gcmVxdWlyZSgnLi8uLi8uLi91dGlscy9NaXhwYW5lbCcpXG5cbmNvbnN0IFNUWUxFUyA9IHtcbiAgaGlkZToge1xuICAgIGRpc3BsYXk6ICdub25lJ1xuICB9LFxuICBmcmFtZToge1xuICAgIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5DT0FMLFxuICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICAgIHRvcDogMCxcbiAgICB6SW5kZXg6IDEsXG4gICAgaGVpZ2h0OiAnMzZweCcsXG4gICAgcGFkZGluZzogJzZweCdcbiAgfSxcbiAgZGlzYWJsZWQ6IHtcbiAgICBvcGFjaXR5OiAwLjUsXG4gICAgY3Vyc29yOiAnbm90LWFsbG93ZWQnXG4gIH0sXG4gIHNoYXJlUG9wb3Zlcjoge1xuICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgIHRvcDogMzQsXG4gICAgcmlnaHQ6IC01OSxcbiAgICBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuRkFUSEVSX0NPQUwsXG4gICAgd2lkdGg6IDIwNCxcbiAgICBwYWRkaW5nOiAnMTNweCA5cHgnLFxuICAgIGZvbnRTaXplOiAxNyxcbiAgICBjb2xvcjogUGFsZXR0ZS5ST0NLLFxuICAgIHRleHRBbGlnbjogJ2NlbnRlcicsXG4gICAgYm9yZGVyUmFkaXVzOiA0LFxuICAgIGJveFNoYWRvdzogJzAgNnB4IDI1cHggMCAnICsgUGFsZXR0ZS5GQVRIRVJfQ09BTFxuICB9LFxuICBwb3BvdmVyQ2xvc2U6IHtcbiAgICBjb2xvcjogJ3doaXRlJyxcbiAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICB0b3A6IDUsXG4gICAgcmlnaHQ6IDEwLFxuICAgIGZvbnRTaXplOiAxNSxcbiAgICB0ZXh0VHJhbnNmb3JtOiAnbG93ZXJjYXNlJ1xuICB9LFxuICBmb290ZXI6IHtcbiAgICBiYWNrZ3JvdW5kQ29sb3I6IENvbG9yKFBhbGV0dGUuREFSS19HUkFZKS5mYWRlKDAuNyksXG4gICAgaGVpZ2h0OiAyNSxcbiAgICB3aWR0aDogJzEwMCUnLFxuICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgIGJvdHRvbTogMCxcbiAgICBmb250U2l6ZTogMTAsXG4gICAgYm9yZGVyQm90dG9tUmlnaHRSYWRpdXM6IDMsXG4gICAgYm9yZGVyQm90dG9tTGVmdFJhZGl1czogMyxcbiAgICBwYWRkaW5nVG9wOiA1XG4gIH0sXG4gIHRpbWU6IHtcbiAgICBmb250V2VpZ2h0OiAnYm9sZCcsXG4gICAgbWFyZ2luTGVmdDogNVxuICB9LFxuICBjb3B5OiB7XG4gICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgaGVpZ2h0OiAnMTAwJScsXG4gICAgd2lkdGg6IDI1LFxuICAgIHJpZ2h0OiAwLFxuICAgIHBhZGRpbmdUb3A6IDIsXG4gICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJyxcbiAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgICBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuREFSS19HUkFZXG4gIH0sXG4gIGNvcHlMb2FkaW5nOiB7XG4gICAgcGFkZGluZ1RvcDogMCxcbiAgICBwYWRkaW5nQm90dG9tOiA2LFxuICAgIHBvaW50ZXJFdmVudHM6ICdub25lJ1xuICB9LFxuICBsaW5rSG9sc3Rlcjoge1xuICAgIGhlaWdodDogMjksXG4gICAgcG9zaXRpb246ICdyZWxhdGl2ZScsXG4gICAgYm9yZGVyUmFkaXVzOiAzLFxuICAgIG1hcmdpblRvcDogMyxcbiAgICBjdXJzb3I6ICdwb2ludGVyJyxcbiAgICBiYWNrZ3JvdW5kQ29sb3I6IENvbG9yKFBhbGV0dGUuREFSS19HUkFZKS5mYWRlKDAuNjgpLFxuICAgIGJvcmRlcjogJzFweCBzb2xpZCAnICsgUGFsZXR0ZS5EQVJLX0dSQVlcblxuICB9LFxuICBsaW5rOiB7XG4gICAgZm9udFNpemU6IDEwLFxuICAgIGNvbG9yOiBDb2xvcihQYWxldHRlLkxJR0hUX0JMVUUpLmxpZ2h0ZW4oMC4zNyksXG4gICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgbGVmdDogNyxcbiAgICB0b3A6IDcsXG4gICAgY3Vyc29yOiAncG9pbnRlcidcbiAgfSxcbiAgZ2VuZXJhdGluZ0xpbms6IHtcbiAgICBjb2xvcjogUGFsZXR0ZS5ST0NLLFxuICAgIGN1cnNvcjogJ2RlZmF1bHQnLFxuICAgIGZvbnRTdHlsZTogJ2l0YWxpYydcbiAgfVxufVxuXG5jb25zdCBTTkFQU0hPVF9TQVZFX1JFU09MVVRJT05fU1RSQVRFR0lFUyA9IHtcbiAgbm9ybWFsOiB7IHN0cmF0ZWd5OiAncmVjdXJzaXZlJywgZmF2b3I6ICdvdXJzJyB9LFxuICBvdXJzOiB7IHN0cmF0ZWd5OiAnb3VycycgfSxcbiAgdGhlaXJzOiB7IHN0cmF0ZWd5OiAndGhlaXJzJyB9XG59XG5cbmNsYXNzIFBvcG92ZXJCb2R5IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc2hvdWxkQ29tcG9uZW50VXBkYXRlIChuZXh0UHJvcHMpIHtcbiAgICByZXR1cm4gKFxuICAgICAgdGhpcy5wcm9wcy50aXRsZVRleHQgIT09IG5leHRQcm9wcy50aXRsZVRleHQgfHxcbiAgICAgIHRoaXMucHJvcHMubGlua0FkZHJlc3MgIT09IG5leHRQcm9wcy5saW5rQWRkcmVzcyB8fFxuICAgICAgdGhpcy5wcm9wcy5pc1NuYXBzaG90U2F2ZUluUHJvZ3Jlc3MgIT09IG5leHRQcm9wcy5pc1NuYXBzaG90U2F2ZUluUHJvZ3Jlc3MgfHxcbiAgICAgIHRoaXMucHJvcHMuaXNQcm9qZWN0SW5mb0ZldGNoSW5Qcm9ncmVzcyAhPT0gbmV4dFByb3BzLmlzUHJvamVjdEluZm9GZXRjaEluUHJvZ3Jlc3NcbiAgICApXG4gIH1cblxuICByZW5kZXIgKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IHN0eWxlPXtbU1RZTEVTLnNoYXJlUG9wb3ZlciwgdGhpcy5wcm9wcy5zbmFwc2hvdFNhdmVDb25maXJtZWQgJiYge3JpZ2h0OiAtNjd9LCB0aGlzLnByb3BzLmlzU25hcHNob3RTYXZlSW5Qcm9ncmVzcyAmJiB7cmlnaHQ6IC03MH1dfT5cbiAgICAgICAgPGJ1dHRvbiBzdHlsZT17U1RZTEVTLnBvcG92ZXJDbG9zZX0gb25DbGljaz17dGhpcy5wcm9wcy5jbG9zZX0+eDwvYnV0dG9uPlxuICAgICAgICB7dGhpcy5wcm9wcy50aXRsZVRleHR9XG4gICAgICAgIDxkaXYgc3R5bGU9e1NUWUxFUy5saW5rSG9sc3Rlcn0+XG4gICAgICAgICAgeyh0aGlzLnByb3BzLmlzU25hcHNob3RTYXZlSW5Qcm9ncmVzcyB8fCB0aGlzLnByb3BzLmlzUHJvamVjdEluZm9GZXRjaEluUHJvZ3Jlc3MpXG4gICAgICAgICAgICA/IDxzcGFuIHN0eWxlPXtbU1RZTEVTLmxpbmssIFNUWUxFUy5nZW5lcmF0aW5nTGlua119PlVwZGF0aW5nIFNoYXJlIFBhZ2U8L3NwYW4+XG4gICAgICAgICAgICA6IDxzcGFuIHN0eWxlPXtTVFlMRVMubGlua30gb25DbGljaz17KCkgPT4gc2hlbGwub3BlbkV4dGVybmFsKHRoaXMucHJvcHMubGlua0FkZHJlc3MpfT57dGhpcy5wcm9wcy5saW5rQWRkcmVzcy5zdWJzdHJpbmcoMCwgMzMpfTwvc3Bhbj59XG4gICAgICAgICAgPENvcHlUb0NsaXBib2FyZFxuICAgICAgICAgICAgdGV4dD17dGhpcy5wcm9wcy5saW5rQWRkcmVzc31cbiAgICAgICAgICAgIG9uQ29weT17KCkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLnByb3BzLnBhcmVudC5zZXRTdGF0ZSh7Y29waWVkOiB0cnVlfSlcbiAgICAgICAgICAgICAgdGhpcy5wcm9wcy5wYXJlbnQuc2V0U3RhdGUoe3Nob3dDb3BpZWQ6IHRydWV9LCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICB0aGlzLnByb3BzLnBhcmVudC5zZXRTdGF0ZSh7c2hvd0NvcGllZDogZmFsc2V9KVxuICAgICAgICAgICAgICAgIH0sIDE5MDApXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9fT5cbiAgICAgICAgICAgIHsodGhpcy5wcm9wcy5pc1NuYXBzaG90U2F2ZUluUHJvZ3Jlc3MgfHwgdGhpcy5wcm9wcy5pc1Byb2plY3RJbmZvRmV0Y2hJblByb2dyZXNzKVxuICAgICAgICAgICAgICA/IDxzcGFuIHN0eWxlPXtbU1RZTEVTLmNvcHksIFNUWUxFUy5jb3B5TG9hZGluZ119PjxUaHJlZUJvdW5jZSBzaXplPXszfSBjb2xvcj17UGFsZXR0ZS5ST0NLfSAvPjwvc3Bhbj5cbiAgICAgICAgICAgICAgOiA8c3BhbiBzdHlsZT17U1RZTEVTLmNvcHl9PjxDbGlib2FyZEljb25TVkcgLz48L3NwYW4+fVxuICAgICAgICAgIDwvQ29weVRvQ2xpcGJvYXJkPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgey8qIHRvZG86IHNob3cgbGFzdCB1cGRhdGVkPyA8ZGl2IHN0eWxlPXtTVFlMRVMuZm9vdGVyfT5VUERBVEVEPHNwYW4gc3R5bGU9e1NUWUxFUy50aW1lfT57Jzk6MDBhbSBKdW4gMTUsIDIwMTcnfTwvc3Bhbj48L2Rpdj4gKi99XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cbn1cblxuY29uc3QgUG9wb3ZlckJvZHlSYWRpdW1pemVkID0gUmFkaXVtKFBvcG92ZXJCb2R5KVxuXG5jbGFzcyBTdGFnZVRpdGxlQmFyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IgKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpXG4gICAgdGhpcy5oYW5kbGVDb25uZWN0aW9uQ2xpY2sgPSB0aGlzLmhhbmRsZUNvbm5lY3Rpb25DbGljay5iaW5kKHRoaXMpXG4gICAgdGhpcy5oYW5kbGVVbmRvQ2xpY2sgPSB0aGlzLmhhbmRsZVVuZG9DbGljay5iaW5kKHRoaXMpXG4gICAgdGhpcy5oYW5kbGVSZWRvQ2xpY2sgPSB0aGlzLmhhbmRsZVJlZG9DbGljay5iaW5kKHRoaXMpXG4gICAgdGhpcy5oYW5kbGVTYXZlU25hcHNob3RDbGljayA9IHRoaXMuaGFuZGxlU2F2ZVNuYXBzaG90Q2xpY2suYmluZCh0aGlzKVxuICAgIHRoaXMuaGFuZGxlTWVyZ2VSZXNvbHZlT3VycyA9IHRoaXMuaGFuZGxlTWVyZ2VSZXNvbHZlT3Vycy5iaW5kKHRoaXMpXG4gICAgdGhpcy5oYW5kbGVNZXJnZVJlc29sdmVUaGVpcnMgPSB0aGlzLmhhbmRsZU1lcmdlUmVzb2x2ZVRoZWlycy5iaW5kKHRoaXMpXG4gICAgdGhpcy5faXNNb3VudGVkID0gZmFsc2VcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgc25hcHNob3RTYXZlUmVzb2x1dGlvblN0cmF0ZWd5TmFtZTogJ25vcm1hbCcsXG4gICAgICBpc1NuYXBzaG90U2F2ZUluUHJvZ3Jlc3M6IGZhbHNlLFxuICAgICAgc25hcHNob3RNZXJnZUNvbmZsaWN0czogbnVsbCxcbiAgICAgIHNuYXBzaG90U2F2ZUNvbmZpcm1lZDogbnVsbCxcbiAgICAgIHNuYXBzaG90U2F2ZUVycm9yOiBudWxsLFxuICAgICAgc2hvd1NoYXJlUG9wb3ZlcjogZmFsc2UsXG4gICAgICBjb3BpZWQ6IGZhbHNlLFxuICAgICAgbGlua0FkZHJlc3M6ICdGZXRjaGluZyBJbmZvJyxcbiAgICAgIHNob3dDb3BpZWQ6IGZhbHNlLFxuICAgICAgcHJvamVjdEluZm9GZXRjaEVycm9yOiBudWxsLFxuICAgICAgaXNQcm9qZWN0SW5mb0ZldGNoSW5Qcm9ncmVzczogZmFsc2UsXG4gICAgICBwcm9qZWN0SW5mbzogbnVsbCxcbiAgICAgIGdpdFVuZG9hYmxlczogW10sXG4gICAgICBnaXRSZWRvYWJsZXM6IFtdXG4gICAgfVxuICB9XG5cbiAgY29tcG9uZW50V2lsbE1vdW50ICgpIHtcbiAgICB0aGlzLl9pc01vdW50ZWQgPSB0cnVlXG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCAoKSB7XG4gICAgdGhpcy5wZXJmb3JtUHJvamVjdEluZm9GZXRjaCgpXG5cbiAgICAvLyBJdCdzIGtpbmQgb2Ygd2VpcmQgdG8gaGF2ZSB0aGlzIGhlYXJ0YmVhdCBsb2dpYyBidXJpZWQgYWxsIHRoZSB3YXkgZG93biBoZXJlIGluc2lkZSBTdGF0ZVRpdGxlQmFyO1xuICAgIC8vIGl0IHByb2JhYmx5IHNob3VsZCBiZSBtb3ZlZCB1cCB0byB0aGUgQ3JlYXRvciBsZXZlbCBzbyBpdCdzIGVhc2llciB0byBmaW5kICNGSVhNRVxuICAgIHRoaXMuX2ZldGNoTWFzdGVyU3RhdGVJbnRlcnZhbCA9IHNldEludGVydmFsKCgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLnByb3BzLndlYnNvY2tldC5yZXF1ZXN0KHsgbWV0aG9kOiAnbWFzdGVySGVhcnRiZWF0JywgcGFyYW1zOiBbdGhpcy5wcm9wcy5mb2xkZXJdIH0sIChoZWFydGJlYXRFcnIsIG1hc3RlclN0YXRlKSA9PiB7XG4gICAgICAgIGlmIChoZWFydGJlYXRFcnIgfHwgIW1hc3RlclN0YXRlKSB7XG4gICAgICAgICAgLy8gSWYgbWFzdGVyIGRpc2Nvbm5lY3RzIHdlIG1pZ2h0IG5vdCBldmVuIGdldCBhbiBlcnJvciwgc28gY3JlYXRlIGEgZmFrZSBlcnJvciBpbiBpdHMgcGxhY2VcbiAgICAgICAgICBpZiAoIWhlYXJ0YmVhdEVycikgaGVhcnRiZWF0RXJyID0gbmV3IEVycm9yKCdVbmtub3duIHByb2JsZW0gd2l0aCBtYXN0ZXIgaGVhcnRiZWF0JylcbiAgICAgICAgICBjb25zb2xlLmVycm9yKGhlYXJ0YmVhdEVycilcblxuICAgICAgICAgIC8vIElmIG1hc3RlciBoYXMgZGlzY29ubmVjdGVkLCBzdG9wIHJ1bm5pbmcgdGhpcyBpbnRlcnZhbCBzbyB3ZSBkb24ndCBnZXQgcHVsc2luZyBlcnJvciBtZXNzYWdlc1xuICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy5fZmV0Y2hNYXN0ZXJTdGF0ZUludGVydmFsKVxuXG4gICAgICAgICAgLy8gQnV0IHRoZSBmaXJzdCB0aW1lIHdlIGdldCB0aGlzLCBkaXNwbGF5IGEgdXNlciBub3RpY2UgLSB0aGV5IHByb2JhYmx5IG5lZWQgdG8gcmVzdGFydCBIYWlrdSB0byBnZXRcbiAgICAgICAgICAvLyBpbnRvIGEgYmV0dGVyIHN0YXRlLCBhdCBsZWFzdCB1bnRpbCB3ZSBjYW4gcmVzb2x2ZSB3aGF0IHRoZSBjYXVzZSBvZiB0aGlzIHByb2JsZW0gaXNcbiAgICAgICAgICByZXR1cm4gdGhpcy5wcm9wcy5jcmVhdGVOb3RpY2Uoe1xuICAgICAgICAgICAgdHlwZTogJ2RhbmdlcicsXG4gICAgICAgICAgICB0aXRsZTogJ1VoIG9oIScsXG4gICAgICAgICAgICBtZXNzYWdlOiAnSGFpa3UgaXMgaGF2aW5nIGEgcHJvYmxlbSBhY2Nlc3NpbmcgeW91ciBwcm9qZWN0LiDwn5iiIFBsZWFzZSByZXN0YXJ0IEhhaWt1LiBJZiB5b3Ugc2VlIHRoaXMgZXJyb3IgYWdhaW4sIGNvbnRhY3QgSGFpa3UgZm9yIHN1cHBvcnQuJ1xuICAgICAgICAgIH0pXG4gICAgICAgIH1cblxuICAgICAgICBpcGNSZW5kZXJlci5zZW5kKCdtYXN0ZXI6aGVhcnRiZWF0JywgYXNzaWduKHt9LCBtYXN0ZXJTdGF0ZSkpXG5cbiAgICAgICAgaWYgKHRoaXMuX2lzTW91bnRlZCkge1xuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgZ2l0VW5kb2FibGVzOiBtYXN0ZXJTdGF0ZS5naXRVbmRvYWJsZXMsXG4gICAgICAgICAgICBnaXRSZWRvYWJsZXM6IG1hc3RlclN0YXRlLmdpdFJlZG9hYmxlc1xuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSwgNjQgKiA0KVxuXG4gICAgaXBjUmVuZGVyZXIub24oJ2dsb2JhbC1tZW51OnNhdmUnLCAoKSA9PiB7XG4gICAgICB0aGlzLmhhbmRsZVNhdmVTbmFwc2hvdENsaWNrKClcbiAgICB9KVxuICB9XG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQgKCkge1xuICAgIHRoaXMuX2lzTW91bnRlZCA9IGZhbHNlXG4gICAgY2xlYXJJbnRlcnZhbCh0aGlzLl9mZXRjaE1hc3RlclN0YXRlSW50ZXJ2YWwpXG4gIH1cblxuICBoYW5kbGVDb25uZWN0aW9uQ2xpY2sgKCkge1xuICAgIC8vIFRPRE9cbiAgfVxuXG4gIGhhbmRsZVVuZG9DbGljayAoKSB7XG4gICAgcmV0dXJuIHRoaXMucHJvcHMud2Vic29ja2V0LnJlcXVlc3QoeyBtZXRob2Q6ICdnaXRVbmRvJywgcGFyYW1zOiBbdGhpcy5wcm9wcy5mb2xkZXIsIHsgdHlwZTogJ2dsb2JhbCcgfV0gfSwgKGVycikgPT4ge1xuICAgICAgaWYgKGVycikge1xuICAgICAgICBjb25zb2xlLmVycm9yKGVycilcbiAgICAgICAgcmV0dXJuIHRoaXMucHJvcHMuY3JlYXRlTm90aWNlKHtcbiAgICAgICAgICB0eXBlOiAnd2FybmluZycsXG4gICAgICAgICAgdGl0bGU6ICdVaCBvaCEnLFxuICAgICAgICAgIG1lc3NhZ2U6ICdXZSB3ZXJlIHVuYWJsZSB0byB1bmRvIHlvdXIgbGFzdCBhY3Rpb24uIPCfmKIgUGxlYXNlIGNvbnRhY3QgSGFpa3UgZm9yIHN1cHBvcnQuJ1xuICAgICAgICB9KVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBoYW5kbGVSZWRvQ2xpY2sgKCkge1xuICAgIHJldHVybiB0aGlzLnByb3BzLndlYnNvY2tldC5yZXF1ZXN0KHsgbWV0aG9kOiAnZ2l0UmVkbycsIHBhcmFtczogW3RoaXMucHJvcHMuZm9sZGVyLCB7IHR5cGU6ICdnbG9iYWwnIH1dIH0sIChlcnIpID0+IHtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihlcnIpXG4gICAgICAgIHJldHVybiB0aGlzLnByb3BzLmNyZWF0ZU5vdGljZSh7XG4gICAgICAgICAgdHlwZTogJ3dhcm5pbmcnLFxuICAgICAgICAgIHRpdGxlOiAnVWggb2ghJyxcbiAgICAgICAgICBtZXNzYWdlOiAnV2Ugd2VyZSB1bmFibGUgdG8gcmVkbyB5b3VyIGxhc3QgYWN0aW9uLiDwn5iiIFBsZWFzZSBjb250YWN0IEhhaWt1IGZvciBzdXBwb3J0LidcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgZ2V0UHJvamVjdFNhdmVPcHRpb25zICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgY29tbWl0TWVzc2FnZTogJ0NoYW5nZXMgc2F2ZWQgKHZpYSBIYWlrdSBEZXNrdG9wKScsXG4gICAgICBzYXZlU3RyYXRlZ3k6IFNOQVBTSE9UX1NBVkVfUkVTT0xVVElPTl9TVFJBVEVHSUVTW3RoaXMuc3RhdGUuc25hcHNob3RTYXZlUmVzb2x1dGlvblN0cmF0ZWd5TmFtZV1cbiAgICB9XG4gIH1cblxuICBoYW5kbGVTYXZlU25hcHNob3RDbGljayAoKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUuc25hcHNob3RTYXZlRXJyb3IpIHJldHVybiB2b2lkICgwKVxuICAgIGlmICh0aGlzLnN0YXRlLmlzU25hcHNob3RTYXZlSW5Qcm9ncmVzcykgcmV0dXJuIHZvaWQgKDApXG4gICAgaWYgKHRoaXMuc3RhdGUuc25hcHNob3RNZXJnZUNvbmZsaWN0cykgcmV0dXJuIHZvaWQgKDApXG4gICAgaWYgKHRoaXMuc3RhdGUuc2hvd1NoYXJlUG9wb3ZlcikgcmV0dXJuIHZvaWQgKDApXG5cbiAgICB0aGlzLnNldFN0YXRlKHtzaG93U2hhcmVQb3BvdmVyOiAhdGhpcy5zdGF0ZS5zaG93U2hhcmVQb3BvdmVyfSlcblxuICAgIGlmICh0aGlzLnByb3BzLnRvdXJDbGllbnQpIHRoaXMucHJvcHMudG91ckNsaWVudC5uZXh0KClcblxuICAgIHJldHVybiB0aGlzLnBlcmZvcm1Qcm9qZWN0U2F2ZSgpXG4gIH1cblxuICBwZXJmb3JtUHJvamVjdEluZm9GZXRjaCAoKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7IGlzUHJvamVjdEluZm9GZXRjaEluUHJvZ3Jlc3M6IHRydWUgfSlcbiAgICByZXR1cm4gdGhpcy5wcm9wcy53ZWJzb2NrZXQucmVxdWVzdCh7IG1ldGhvZDogJ2ZldGNoUHJvamVjdEluZm8nLCBwYXJhbXM6IFt0aGlzLnByb3BzLmZvbGRlciwgdGhpcy5wcm9wcy5wcm9qZWN0LnByb2plY3ROYW1lLCB0aGlzLnByb3BzLnVzZXJuYW1lLCB0aGlzLnByb3BzLnBhc3N3b3JkLCB7fV0gfSwgKHByb2plY3RJbmZvRmV0Y2hFcnJvciwgcHJvamVjdEluZm8pID0+IHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoeyBpc1Byb2plY3RJbmZvRmV0Y2hJblByb2dyZXNzOiBmYWxzZSB9KVxuXG4gICAgICBpZiAocHJvamVjdEluZm9GZXRjaEVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IocHJvamVjdEluZm9GZXRjaEVycm9yLm1lc3NhZ2UpXG4gICAgICAgIC8vIFdlIG1pZ2h0IG9ubHkgY2FyZSBhYm91dCB0aGlzIGlmIGl0IGNvbWVzIHVwIGR1cmluZyBhIHNhdmUuLi4gI0ZJWE1FID8/XG4gICAgICAgIGlmIChwcm9qZWN0SW5mb0ZldGNoRXJyb3IubWVzc2FnZSA9PT0gJ1RpbWVkIG91dCB3YWl0aW5nIGZvciBwcm9qZWN0IHNoYXJlIGluZm8nKSB7XG4gICAgICAgICAgLy8gP1xuICAgICAgICAgIHJldHVybiB2b2lkICgwKSAvLyBHb3R0YSByZXR1cm4gaGVyZSAtIGRvbid0IHdhbnQgdG8gZmFsbCB0aHJvdWdoIGFzIHRob3VnaCB3ZSBhY3R1YWxseSBnb3QgcHJvamVjdEluZm8gYmVsb3dcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5zZXRTdGF0ZSh7IHByb2plY3RJbmZvRmV0Y2hFcnJvciB9KVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMuc2V0U3RhdGUoeyBwcm9qZWN0SW5mbyB9KVxuICAgICAgaWYgKHRoaXMucHJvcHMucmVjZWl2ZVByb2plY3RJbmZvKSB0aGlzLnByb3BzLnJlY2VpdmVQcm9qZWN0SW5mbyhwcm9qZWN0SW5mbylcbiAgICAgIGlmIChwcm9qZWN0SW5mby5zaGFyZUxpbmspIHRoaXMuc2V0U3RhdGUoeyBsaW5rQWRkcmVzczogcHJvamVjdEluZm8uc2hhcmVMaW5rIH0pXG4gICAgfSlcbiAgfVxuXG4gIHdpdGhQcm9qZWN0SW5mbyAob3RoZXJPYmplY3QpIHtcbiAgICBsZXQgcHJvaiA9IHRoaXMuc3RhdGUucHJvamVjdEluZm8gfHwge31cbiAgICByZXR1cm4gYXNzaWduKHt9LCBvdGhlck9iamVjdCwge1xuICAgICAgb3JnYW5pemF0aW9uOiBwcm9qLm9yZ2FuaXphdGlvbk5hbWUsXG4gICAgICB1dWlkOiBwcm9qLnByb2plY3RVaWQsXG4gICAgICBzaGE6IHByb2ouc2hhLFxuICAgICAgYnJhbmNoOiBwcm9qLmJyYW5jaE5hbWVcbiAgICB9KVxuICB9XG5cbiAgcmVxdWVzdFNhdmVQcm9qZWN0IChjYikge1xuICAgIHJldHVybiB0aGlzLnByb3BzLndlYnNvY2tldC5yZXF1ZXN0KHsgbWV0aG9kOiAnc2F2ZVByb2plY3QnLCBwYXJhbXM6IFt0aGlzLnByb3BzLmZvbGRlciwgdGhpcy5wcm9wcy5wcm9qZWN0LnByb2plY3ROYW1lLCB0aGlzLnByb3BzLnVzZXJuYW1lLCB0aGlzLnByb3BzLnBhc3N3b3JkLCB0aGlzLmdldFByb2plY3RTYXZlT3B0aW9ucygpXSB9LCBjYilcbiAgfVxuXG4gIHBlcmZvcm1Qcm9qZWN0U2F2ZSAoKSB7XG4gICAgbWl4cGFuZWwuaGFpa3VUcmFjaygnY3JlYXRvcjpwcm9qZWN0OnNhdmluZycsIHRoaXMud2l0aFByb2plY3RJbmZvKHtcbiAgICAgIHVzZXJuYW1lOiB0aGlzLnByb3BzLnVzZXJuYW1lLFxuICAgICAgcHJvamVjdDogdGhpcy5wcm9wcy5wcm9qZWN0TmFtZVxuICAgIH0pKVxuICAgIHRoaXMuc2V0U3RhdGUoeyBpc1NuYXBzaG90U2F2ZUluUHJvZ3Jlc3M6IHRydWUgfSlcblxuICAgIHJldHVybiB0aGlzLnJlcXVlc3RTYXZlUHJvamVjdCgoc25hcHNob3RTYXZlRXJyb3IsIHNuYXBzaG90RGF0YSkgPT4ge1xuICAgICAgaWYgKHNuYXBzaG90U2F2ZUVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3Ioc25hcHNob3RTYXZlRXJyb3IpXG4gICAgICAgIGlmIChzbmFwc2hvdFNhdmVFcnJvci5tZXNzYWdlID09PSAnVGltZWQgb3V0IHdhaXRpbmcgZm9yIHByb2plY3Qgc2hhcmUgaW5mbycpIHtcbiAgICAgICAgICB0aGlzLnByb3BzLmNyZWF0ZU5vdGljZSh7XG4gICAgICAgICAgICB0eXBlOiAnd2FybmluZycsXG4gICAgICAgICAgICB0aXRsZTogJ0htbS4uLicsXG4gICAgICAgICAgICBtZXNzYWdlOiAnUHVibGlzaGluZyB5b3VyIHByb2plY3Qgc2VlbXMgdG8gYmUgdGFraW5nIGEgbG9uZyB0aW1lLiDwn5iiIFBsZWFzZSB0cnkgYWdhaW4gaW4gYSBmZXcgbW9tZW50cy4gSWYgeW91IHNlZSB0aGlzIG1lc3NhZ2UgYWdhaW4sIGNvbnRhY3QgSGFpa3UgZm9yIHN1cHBvcnQuJ1xuICAgICAgICAgIH0pXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5wcm9wcy5jcmVhdGVOb3RpY2Uoe1xuICAgICAgICAgICAgdHlwZTogJ2RhbmdlcicsXG4gICAgICAgICAgICB0aXRsZTogJ09oIG5vIScsXG4gICAgICAgICAgICBtZXNzYWdlOiAnV2Ugd2VyZSB1bmFibGUgdG8gcHVibGlzaCB5b3VyIHByb2plY3QuIPCfmKIgUGxlYXNlIHRyeSBhZ2FpbiBpbiBhIGZldyBtb21lbnRzLiBJZiB5b3Ugc3RpbGwgc2VlIHRoaXMgZXJyb3IsIGNvbnRhY3QgSGFpa3UgZm9yIHN1cHBvcnQuJ1xuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuc2V0U3RhdGUoeyBpc1NuYXBzaG90U2F2ZUluUHJvZ3Jlc3M6IGZhbHNlLCBzbmFwc2hvdFNhdmVSZXNvbHV0aW9uU3RyYXRlZ3lOYW1lOiAnbm9ybWFsJywgc25hcHNob3RTYXZlRXJyb3IgfSwgKCkgPT4ge1xuICAgICAgICAgIHJldHVybiBzZXRUaW1lb3V0KCgpID0+IHRoaXMuc2V0U3RhdGUoeyBzbmFwc2hvdFNhdmVFcnJvcjogbnVsbCB9KSwgMjAwMClcbiAgICAgICAgfSlcbiAgICAgIH1cblxuICAgICAgdGhpcy5zZXRTdGF0ZSh7IGlzU25hcHNob3RTYXZlSW5Qcm9ncmVzczogZmFsc2UsIHNuYXBzaG90U2F2ZUNvbmZpcm1lZDogdHJ1ZSB9KVxuXG4gICAgICBpZiAoc25hcHNob3REYXRhKSB7XG4gICAgICAgIGlmIChzbmFwc2hvdERhdGEuY29uZmxpY3RzKSB7XG4gICAgICAgICAgY29uc29sZS53YXJuKCdbY3JlYXRvcl0gTWVyZ2UgY29uZmxpY3RzIGZvdW5kIScpXG4gICAgICAgICAgdGhpcy5wcm9wcy5jcmVhdGVOb3RpY2Uoe1xuICAgICAgICAgICAgdHlwZTogJ3dhcm5pbmcnLFxuICAgICAgICAgICAgdGl0bGU6ICdNZXJnZSBjb25mbGljdHMhJyxcbiAgICAgICAgICAgIG1lc3NhZ2U6ICdXZSBjb3VsZG5cXCd0IG1lcmdlIHlvdXIgY2hhbmdlcy4g8J+YoiBZb3VcXCdsbCBuZWVkIHRvIGRlY2lkZSBob3cgdG8gbWVyZ2UgeW91ciBjaGFuZ2VzIGJlZm9yZSBjb250aW51aW5nLidcbiAgICAgICAgICB9KVxuICAgICAgICAgIHJldHVybiB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIHNuYXBzaG90TWVyZ2VDb25mbGljdHM6IHNuYXBzaG90RGF0YS5jb25mbGljdHMsXG4gICAgICAgICAgICBzaG93U2hhcmVQb3BvdmVyOiBmYWxzZVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cblxuICAgICAgICBjb25zb2xlLmluZm8oJ1tjcmVhdG9yXSBTYXZlIGNvbXBsZXRlJywgc25hcHNob3REYXRhKVxuXG4gICAgICAgIC8vIFVubGVzcyB3ZSBzZXQgYmFjayB0byBub3JtYWwsIHN1YnNlcXVlbnQgc2F2ZXMgd2lsbCBzdGlsbCBiZSBzZXQgdG8gdXNlIHRoZSBzdHJpY3Qgb3Vycy90aGVpcnMgc3RyYXRlZ3ksXG4gICAgICAgIC8vIHdoaWNoIHdpbGwgY2xvYmJlciB1cGRhdGVzIHRoYXQgd2UgbWlnaHQgd2FudCB0byBhY3R1YWxseSBtZXJnZSBncmFjZWZ1bGx5LlxuICAgICAgICB0aGlzLnNldFN0YXRlKHsgc25hcHNob3RTYXZlUmVzb2x1dGlvblN0cmF0ZWd5TmFtZTogJ25vcm1hbCcgfSlcblxuICAgICAgICBpZiAoc25hcHNob3REYXRhLnNoYXJlTGluaykge1xuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBsaW5rQWRkcmVzczogc25hcHNob3REYXRhLnNoYXJlTGluayB9KVxuICAgICAgICB9XG5cbiAgICAgICAgbWl4cGFuZWwuaGFpa3VUcmFjaygnY3JlYXRvcjpwcm9qZWN0OnNhdmVkJywgdGhpcy53aXRoUHJvamVjdEluZm8oe1xuICAgICAgICAgIHVzZXJuYW1lOiB0aGlzLnByb3BzLnVzZXJuYW1lLFxuICAgICAgICAgIHByb2plY3Q6IHRoaXMucHJvcHMucHJvamVjdE5hbWVcbiAgICAgICAgfSkpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzZXRUaW1lb3V0KCgpID0+IHRoaXMuc2V0U3RhdGUoeyBzbmFwc2hvdFNhdmVDb25maXJtZWQ6IGZhbHNlIH0pLCAyMDAwKVxuICAgIH0pXG4gIH1cblxuICByZW5kZXJTbmFwc2hvdFNhdmVJbm5lckJ1dHRvbiAoKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUuc25hcHNob3RTYXZlRXJyb3IpIHJldHVybiA8ZGl2IHN0eWxlPXt7aGVpZ2h0OiAxOCwgbWFyZ2luUmlnaHQ6IC01fX0+PERhbmdlckljb25TVkcgZmlsbD0ndHJhbnNwYXJlbnQnIC8+PC9kaXY+XG4gICAgaWYgKHRoaXMuc3RhdGUuc25hcHNob3RNZXJnZUNvbmZsaWN0cykgcmV0dXJuIDxkaXYgc3R5bGU9e3toZWlnaHQ6IDE5LCBtYXJnaW5SaWdodDogMCwgbWFyZ2luVG9wOiAtMn19PjxXYXJuaW5nSWNvblNWRyBmaWxsPSd0cmFuc3BhcmVudCcgY29sb3I9e1BhbGV0dGUuT1JBTkdFfSAvPjwvZGl2PlxuICAgIGlmICh0aGlzLnN0YXRlLnNuYXBzaG90U2F2ZUNvbmZpcm1lZCkgcmV0dXJuIDxkaXYgc3R5bGU9e3sgaGVpZ2h0OiAxOCB9fT48U3VjY2Vzc0ljb25TVkcgdmlld0JveD0nMCAwIDE0IDE0JyBmaWxsPSd0cmFuc3BhcmVudCcgLz48L2Rpdj5cbiAgICByZXR1cm4gPFB1Ymxpc2hTbmFwc2hvdFNWRyAvPlxuICB9XG5cbiAgaGFuZGxlTWVyZ2VSZXNvbHZlT3VycyAoKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7IHNuYXBzaG90TWVyZ2VDb25mbGljdHM6IG51bGwsIHNuYXBzaG90U2F2ZVJlc29sdXRpb25TdHJhdGVneU5hbWU6ICdvdXJzJyB9LCAoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5wZXJmb3JtUHJvamVjdFNhdmUoKVxuICAgIH0pXG4gIH1cblxuICBoYW5kbGVNZXJnZVJlc29sdmVUaGVpcnMgKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoeyBzbmFwc2hvdE1lcmdlQ29uZmxpY3RzOiBudWxsLCBzbmFwc2hvdFNhdmVSZXNvbHV0aW9uU3RyYXRlZ3lOYW1lOiAndGhlaXJzJyB9LCAoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5wZXJmb3JtUHJvamVjdFNhdmUoKVxuICAgIH0pXG4gIH1cblxuICByZW5kZXJNZXJnZUNvbmZsaWN0UmVzb2x1dGlvbkFyZWEgKCkge1xuICAgIGlmICghdGhpcy5zdGF0ZS5zbmFwc2hvdE1lcmdlQ29uZmxpY3RzKSByZXR1cm4gJydcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBzdHlsZT17eyBwb3NpdGlvbjogJ2Fic29sdXRlJywgbGVmdDogMCwgcmlnaHQ6IDE1MCwgdG9wOiA0LCBwYWRkaW5nOiA1LCBib3JkZXJSYWRpdXM6IDQsIGNvbG9yOiBQYWxldHRlLlJPQ0ssIHRleHRBbGlnbjogJ3JpZ2h0Jywgb3ZlcmZsb3c6ICdoaWRkZW4nIH19PlxuICAgICAgICBDb25mbGljdCBmb3VuZCF7JyAnfVxuICAgICAgICA8YSBvbkNsaWNrPXt0aGlzLmhhbmRsZU1lcmdlUmVzb2x2ZU91cnN9IHN0eWxlPXt7IGN1cnNvcjogJ3BvaW50ZXInLCB0ZXh0RGVjb3JhdGlvbjogJ3VuZGVybGluZScsIGNvbG9yOiBQYWxldHRlLkdSRUVOIH19PkZvcmNlIHlvdXIgY2hhbmdlczwvYT57JyAnfVxuICAgICAgICBvciA8YSBvbkNsaWNrPXt0aGlzLmhhbmRsZU1lcmdlUmVzb2x2ZVRoZWlyc30gc3R5bGU9e3sgY3Vyc29yOiAncG9pbnRlcicsIHRleHREZWNvcmF0aW9uOiAndW5kZXJsaW5lJywgY29sb3I6IFBhbGV0dGUuUkVEIH19PmRpc2NhcmQgeW91cnMgJmFtcDsgYWNjZXB0IHRoZWlyczwvYT4/XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICBob3ZlclN0eWxlRm9yU2F2ZUJ1dHRvbiAoKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUuaXNTbmFwc2hvdFNhdmVJblByb2dyZXNzKSByZXR1cm4gbnVsbFxuICAgIGlmICh0aGlzLnN0YXRlLnNuYXBzaG90U2F2ZUVycm9yKSByZXR1cm4gbnVsbFxuICAgIGlmICh0aGlzLnN0YXRlLnNuYXBzaG90TWVyZ2VDb25mbGljdHMpIHJldHVybiBudWxsXG4gICAgaWYgKHRoaXMuc3RhdGUuc25hcHNob3RTYXZlQ29uZmlybWVkKSByZXR1cm4gbnVsbFxuICAgIHJldHVybiBCVE5fU1RZTEVTLmJ0bkljb25Ib3ZlclxuICB9XG5cbiAgcmVuZGVyICgpIHtcbiAgICBjb25zdCB7IHNob3dTaGFyZVBvcG92ZXIgfSA9IHRoaXMuc3RhdGVcbiAgICBjb25zdCB0aXRsZVRleHQgPSB0aGlzLnN0YXRlLnNob3dDb3BpZWRcbiAgICAgID8gJ0NvcGllZCdcbiAgICAgIDogJ1NoYXJlICYgRW1iZWQnXG5cbiAgICBsZXQgYnRuVGV4dCA9ICdQVUJMSVNIJ1xuICAgIGlmICh0aGlzLnN0YXRlLnNuYXBzaG90U2F2ZUNvbmZpcm1lZCkgYnRuVGV4dCA9ICdQVUJMSVNIRUQnXG4gICAgaWYgKHRoaXMuc3RhdGUuaXNTbmFwc2hvdFNhdmVJblByb2dyZXNzKSBidG5UZXh0ID0gJ1BVQkxJU0hJTkcnXG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBzdHlsZT17U1RZTEVTLmZyYW1lfSBjbGFzc05hbWU9J2ZyYW1lJz5cbiAgICAgICAgPFBvcG92ZXJcbiAgICAgICAgICBwbGFjZT0nYmVsb3cnXG4gICAgICAgICAgaXNPcGVuPXtzaG93U2hhcmVQb3BvdmVyfVxuICAgICAgICAgIGJvZHk9e1xuICAgICAgICAgICAgPFBvcG92ZXJCb2R5UmFkaXVtaXplZFxuICAgICAgICAgICAgICBwYXJlbnQ9e3RoaXN9XG4gICAgICAgICAgICAgIHRpdGxlVGV4dD17dGl0bGVUZXh0fVxuICAgICAgICAgICAgICBzbmFwc2hvdFNhdmVDb25maXJtZWQ9e3RoaXMuc3RhdGUuc25hcHNob3RTYXZlQ29uZmlybWVkfVxuICAgICAgICAgICAgICBpc1NuYXBzaG90U2F2ZUluUHJvZ3Jlc3M9e3RoaXMuc3RhdGUuaXNTbmFwc2hvdFNhdmVJblByb2dyZXNzfVxuICAgICAgICAgICAgICBpc1Byb2plY3RJbmZvRmV0Y2hJblByb2dyZXNzPXt0aGlzLnN0YXRlLmlzUHJvamVjdEluZm9GZXRjaEluUHJvZ3Jlc3N9XG4gICAgICAgICAgICAgIGxpbmtBZGRyZXNzPXt0aGlzLnN0YXRlLmxpbmtBZGRyZXNzfVxuICAgICAgICAgICAgICBjbG9zZT17KCkgPT4gdGhpcy5zZXRTdGF0ZSh7IHNob3dTaGFyZVBvcG92ZXI6IGZhbHNlIH0pfSAvPlxuICAgICAgICAgIH0+XG4gICAgICAgICAgPGJ1dHRvbiBrZXk9J3NhdmUnXG4gICAgICAgICAgICBpZD0ncHVibGlzaCdcbiAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuaGFuZGxlU2F2ZVNuYXBzaG90Q2xpY2t9XG4gICAgICAgICAgICBzdHlsZT17W1xuICAgICAgICAgICAgICBCVE5fU1RZTEVTLmJ0blRleHQsXG4gICAgICAgICAgICAgIEJUTl9TVFlMRVMucmlnaHRCdG5zLFxuICAgICAgICAgICAgICB0aGlzLnN0YXRlLmlzU25hcHNob3RTYXZlSW5Qcm9ncmVzcyAmJiBTVFlMRVMuZGlzYWJsZWRcbiAgICAgICAgICAgIF19PlxuICAgICAgICAgICAge3RoaXMucmVuZGVyU25hcHNob3RTYXZlSW5uZXJCdXR0b24oKX08c3BhbiBzdHlsZT17e21hcmdpbkxlZnQ6IDd9fT57YnRuVGV4dH08L3NwYW4+XG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDwvUG9wb3Zlcj5cblxuICAgICAgICB7dGhpcy5yZW5kZXJNZXJnZUNvbmZsaWN0UmVzb2x1dGlvbkFyZWEoKX1cbiAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXt0aGlzLmhhbmRsZUNvbm5lY3Rpb25DbGlja30gc3R5bGU9e1tCVE5fU1RZTEVTLmJ0bkljb24sIEJUTl9TVFlMRVMuYnRuSWNvbkhvdmVyLCBTVFlMRVMuaGlkZV19IGtleT0nY29ubmVjdCc+XG4gICAgICAgICAgPENvbm5lY3Rpb25JY29uU1ZHIC8+XG4gICAgICAgIDwvYnV0dG9uPlxuXG4gICAgICAgIHsgZmFsc2UgJiZcbiAgICAgICAgICA8VG9vbFNlbGVjdG9yIHdlYnNvY2tldD17dGhpcy5wcm9wcy53ZWJzb2NrZXR9IC8+XG4gICAgICAgIH1cblxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG59XG5cblN0YWdlVGl0bGVCYXIucHJvcFR5cGVzID0ge1xuICBmb2xkZXI6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgcHJvamVjdE5hbWU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG4gIHVzZXJuYW1lOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuICBwYXNzd29yZDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcbiAgd2Vic29ja2V0OiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gIGNyZWF0ZU5vdGljZTogUmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgcmVtb3ZlTm90aWNlOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICByZWNlaXZlUHJvamVjdEluZm86IFJlYWN0LlByb3BUeXBlcy5mdW5jXG59XG5cbmV4cG9ydCBkZWZhdWx0IFJhZGl1bShTdGFnZVRpdGxlQmFyKVxuIl19