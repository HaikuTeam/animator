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

var _experiments = require('haiku-common/lib/experiments');

var _exporter = require('haiku-sdk-creator/lib/exporter');

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
            lineNumber: 148
          },
          __self: this
        },
        _react2.default.createElement(
          'button',
          { style: STYLES.popoverClose, onClick: this.props.close, __source: {
              fileName: _jsxFileName,
              lineNumber: 149
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
              lineNumber: 151
            },
            __self: this
          },
          this.props.isSnapshotSaveInProgress || this.props.isProjectInfoFetchInProgress ? _react2.default.createElement(
            'span',
            { style: [STYLES.link, STYLES.generatingLink], __source: {
                fileName: _jsxFileName,
                lineNumber: 153
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
                lineNumber: 154
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
                lineNumber: 155
              },
              __self: this
            },
            this.props.isSnapshotSaveInProgress || this.props.isProjectInfoFetchInProgress ? _react2.default.createElement(
              'span',
              { style: [STYLES.copy, STYLES.copyLoading], __source: {
                  fileName: _jsxFileName,
                  lineNumber: 166
                },
                __self: this
              },
              _react2.default.createElement(_betterReactSpinkit.ThreeBounce, { size: 3, color: _Palette2.default.ROCK, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 166
                },
                __self: this
              })
            ) : _react2.default.createElement(
              'span',
              { style: STYLES.copy, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 167
                },
                __self: this
              },
              _react2.default.createElement(_Icons.CliboardIconSVG, {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 167
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
        saveStrategy: SNAPSHOT_SAVE_RESOLUTION_STRATEGIES[this.state.snapshotSaveResolutionStrategyName],
        exporterFormats: (0, _experiments.experimentIsEnabled)(_experiments.Experiment.LottieExportOnPublish) ? [_exporter.ExporterFormat.Bodymovin] : []
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
            lineNumber: 412
          },
          __self: this
        },
        _react2.default.createElement(_Icons.DangerIconSVG, { fill: 'transparent', __source: {
            fileName: _jsxFileName,
            lineNumber: 412
          },
          __self: this
        })
      );
      if (this.state.snapshotMergeConflicts) return _react2.default.createElement(
        'div',
        { style: { height: 19, marginRight: 0, marginTop: -2 }, __source: {
            fileName: _jsxFileName,
            lineNumber: 413
          },
          __self: this
        },
        _react2.default.createElement(_Icons.WarningIconSVG, { fill: 'transparent', color: _Palette2.default.ORANGE, __source: {
            fileName: _jsxFileName,
            lineNumber: 413
          },
          __self: this
        })
      );
      if (this.state.snapshotSaveConfirmed) return _react2.default.createElement(
        'div',
        { style: { height: 18 }, __source: {
            fileName: _jsxFileName,
            lineNumber: 414
          },
          __self: this
        },
        _react2.default.createElement(_Icons.SuccessIconSVG, { viewBox: '0 0 14 14', fill: 'transparent', __source: {
            fileName: _jsxFileName,
            lineNumber: 414
          },
          __self: this
        })
      );
      return _react2.default.createElement(_Icons.PublishSnapshotSVG, {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 415
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
            lineNumber: 433
          },
          __self: this
        },
        'Conflict found!',
        ' ',
        _react2.default.createElement(
          'a',
          { onClick: this.handleMergeResolveOurs, style: { cursor: 'pointer', textDecoration: 'underline', color: _Palette2.default.GREEN }, __source: {
              fileName: _jsxFileName,
              lineNumber: 435
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
              lineNumber: 436
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
            lineNumber: 460
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
                lineNumber: 466
              },
              __self: this
            }), __source: {
              fileName: _jsxFileName,
              lineNumber: 461
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
                lineNumber: 475
              },
              __self: this
            },
            this.renderSnapshotSaveInnerButton(),
            _react2.default.createElement(
              'span',
              { style: { marginLeft: 7 }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 483
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
              lineNumber: 488
            },
            __self: this
          },
          _react2.default.createElement(_Icons.ConnectionIconSVG, {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 489
            },
            __self: this
          })
        ),
        false && _react2.default.createElement(_ToolSelector2.default, { websocket: this.props.websocket, __source: {
            fileName: _jsxFileName,
            lineNumber: 493
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9yZWFjdC9jb21wb25lbnRzL1N0YWdlVGl0bGVCYXIuanMiXSwibmFtZXMiOlsibWl4cGFuZWwiLCJyZXF1aXJlIiwiU1RZTEVTIiwiaGlkZSIsImRpc3BsYXkiLCJmcmFtZSIsImJhY2tncm91bmRDb2xvciIsIkNPQUwiLCJwb3NpdGlvbiIsInRvcCIsInpJbmRleCIsImhlaWdodCIsInBhZGRpbmciLCJkaXNhYmxlZCIsIm9wYWNpdHkiLCJjdXJzb3IiLCJzaGFyZVBvcG92ZXIiLCJGQVRIRVJfQ09BTCIsIndpZHRoIiwiZm9udFNpemUiLCJjb2xvciIsIlJPQ0siLCJ0ZXh0QWxpZ24iLCJib3JkZXJSYWRpdXMiLCJib3hTaGFkb3ciLCJwb3BvdmVyQ2xvc2UiLCJyaWdodCIsInRleHRUcmFuc2Zvcm0iLCJmb290ZXIiLCJEQVJLX0dSQVkiLCJmYWRlIiwiYm90dG9tIiwiYm9yZGVyQm90dG9tUmlnaHRSYWRpdXMiLCJib3JkZXJCb3R0b21MZWZ0UmFkaXVzIiwicGFkZGluZ1RvcCIsInRpbWUiLCJmb250V2VpZ2h0IiwibWFyZ2luTGVmdCIsImNvcHkiLCJqdXN0aWZ5Q29udGVudCIsImFsaWduSXRlbXMiLCJjb3B5TG9hZGluZyIsInBhZGRpbmdCb3R0b20iLCJwb2ludGVyRXZlbnRzIiwibGlua0hvbHN0ZXIiLCJtYXJnaW5Ub3AiLCJib3JkZXIiLCJsaW5rIiwiTElHSFRfQkxVRSIsImxpZ2h0ZW4iLCJsZWZ0IiwiZ2VuZXJhdGluZ0xpbmsiLCJmb250U3R5bGUiLCJTTkFQU0hPVF9TQVZFX1JFU09MVVRJT05fU1RSQVRFR0lFUyIsIm5vcm1hbCIsInN0cmF0ZWd5IiwiZmF2b3IiLCJvdXJzIiwidGhlaXJzIiwiUG9wb3ZlckJvZHkiLCJuZXh0UHJvcHMiLCJwcm9wcyIsInRpdGxlVGV4dCIsImxpbmtBZGRyZXNzIiwiaXNTbmFwc2hvdFNhdmVJblByb2dyZXNzIiwic25hcHNob3RTYXZlQ29uZmlybWVkIiwiaXNQcm9qZWN0SW5mb0ZldGNoSW5Qcm9ncmVzcyIsInBvcG92ZXJQb3NpdGlvbiIsImNsb3NlIiwib3BlbkV4dGVybmFsIiwic3Vic3RyaW5nIiwicGFyZW50Iiwic2V0U3RhdGUiLCJjb3BpZWQiLCJzaG93Q29waWVkIiwic2V0VGltZW91dCIsIkNvbXBvbmVudCIsIlBvcG92ZXJCb2R5UmFkaXVtaXplZCIsIlN0YWdlVGl0bGVCYXIiLCJoYW5kbGVDb25uZWN0aW9uQ2xpY2siLCJiaW5kIiwiaGFuZGxlVW5kb0NsaWNrIiwiaGFuZGxlUmVkb0NsaWNrIiwiaGFuZGxlU2F2ZVNuYXBzaG90Q2xpY2siLCJoYW5kbGVNZXJnZVJlc29sdmVPdXJzIiwiaGFuZGxlTWVyZ2VSZXNvbHZlVGhlaXJzIiwiX2lzTW91bnRlZCIsInN0YXRlIiwic25hcHNob3RTYXZlUmVzb2x1dGlvblN0cmF0ZWd5TmFtZSIsInNuYXBzaG90TWVyZ2VDb25mbGljdHMiLCJzbmFwc2hvdFNhdmVFcnJvciIsInNob3dTaGFyZVBvcG92ZXIiLCJwcm9qZWN0SW5mb0ZldGNoRXJyb3IiLCJwcm9qZWN0SW5mbyIsImdpdFVuZG9hYmxlcyIsImdpdFJlZG9hYmxlcyIsInBlcmZvcm1Qcm9qZWN0SW5mb0ZldGNoIiwiX2ZldGNoTWFzdGVyU3RhdGVJbnRlcnZhbCIsInNldEludGVydmFsIiwid2Vic29ja2V0IiwicmVxdWVzdCIsIm1ldGhvZCIsInBhcmFtcyIsImZvbGRlciIsImhlYXJ0YmVhdEVyciIsIm1hc3RlclN0YXRlIiwiRXJyb3IiLCJjb25zb2xlIiwiZXJyb3IiLCJjbGVhckludGVydmFsIiwiY3JlYXRlTm90aWNlIiwidHlwZSIsInRpdGxlIiwibWVzc2FnZSIsInNlbmQiLCJvbiIsImVyciIsImNvbW1pdE1lc3NhZ2UiLCJzYXZlU3RyYXRlZ3kiLCJleHBvcnRlckZvcm1hdHMiLCJMb3R0aWVFeHBvcnRPblB1Ymxpc2giLCJCb2R5bW92aW4iLCJ0b3VyQ2xpZW50IiwibmV4dCIsInBlcmZvcm1Qcm9qZWN0U2F2ZSIsInByb2plY3QiLCJwcm9qZWN0TmFtZSIsInVzZXJuYW1lIiwicGFzc3dvcmQiLCJyZWNlaXZlUHJvamVjdEluZm8iLCJzaGFyZUxpbmsiLCJvdGhlck9iamVjdCIsInByb2oiLCJvcmdhbml6YXRpb24iLCJvcmdhbml6YXRpb25OYW1lIiwidXVpZCIsInByb2plY3RVaWQiLCJzaGEiLCJicmFuY2giLCJicmFuY2hOYW1lIiwiY2IiLCJnZXRQcm9qZWN0U2F2ZU9wdGlvbnMiLCJoYWlrdVRyYWNrIiwid2l0aFByb2plY3RJbmZvIiwicmVxdWVzdFNhdmVQcm9qZWN0Iiwic25hcHNob3REYXRhIiwiY29uZmxpY3RzIiwid2FybiIsImluZm8iLCJtYXJnaW5SaWdodCIsIk9SQU5HRSIsIm92ZXJmbG93IiwidGV4dERlY29yYXRpb24iLCJHUkVFTiIsIlJFRCIsImJ0bkljb25Ib3ZlciIsImJ0blRleHQiLCJyaWdodEJ0bnMiLCJyZW5kZXJTbmFwc2hvdFNhdmVJbm5lckJ1dHRvbiIsInJlbmRlck1lcmdlQ29uZmxpY3RSZXNvbHV0aW9uQXJlYSIsImJ0bkljb24iLCJwcm9wVHlwZXMiLCJQcm9wVHlwZXMiLCJzdHJpbmciLCJpc1JlcXVpcmVkIiwib2JqZWN0IiwiZnVuYyIsInJlbW92ZU5vdGljZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOztBQUNBOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOztBQVVBOztBQUNBOzs7Ozs7Ozs7O0FBRUEsSUFBSUEsV0FBV0MsUUFBUSx3Q0FBUixDQUFmOztBQUVBLElBQU1DLFNBQVM7QUFDYkMsUUFBTTtBQUNKQyxhQUFTO0FBREwsR0FETztBQUliQyxTQUFPO0FBQ0xDLHFCQUFpQixrQkFBUUMsSUFEcEI7QUFFTEMsY0FBVSxVQUZMO0FBR0xDLFNBQUssQ0FIQTtBQUlMQyxZQUFRLENBSkg7QUFLTEMsWUFBUSxNQUxIO0FBTUxDLGFBQVM7QUFOSixHQUpNO0FBWWJDLFlBQVU7QUFDUkMs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QkFBV0wsWUFBaEMsRUFBOEN6SixPQUFPQyxJQUFyRCxDQUFwRCxFQUFnSCxLQUFJLFNBQXBIO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNFO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBREYsU0E1QkY7QUFnQ0ksaUJBQ0Esd0RBQWMsV0FBVyxLQUFLMEQsS0FBTCxDQUFXc0MsU0FBcEM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBakNKLE9BREY7QUF1Q0Q7Ozs7RUFoVXlCLGdCQUFNdkIsUzs7QUFtVWxDRSxjQUFjbUYsU0FBZCxHQUEwQjtBQUN4QjFELFVBQVEsZ0JBQU0yRCxTQUFOLENBQWdCQyxNQUFoQixDQUF1QkMsVUFEUDtBQUV4QnRDLGVBQWEsZ0JBQU1vQyxTQUFOLENBQWdCQyxNQUZMO0FBR3hCcEMsWUFBVSxnQkFBTW1DLFNBQU4sQ0FBZ0JDLE1BSEY7QUFJeEJuQyxZQUFVLGdCQUFNa0MsU0FBTixDQUFnQkMsTUFKRjtBQUt4QmhFLGFBQVcsZ0JBQU0rRCxTQUFOLENBQWdCRyxNQUFoQixDQUF1QkQsVUFMVjtBQU14QnRELGdCQUFjLGdCQUFNb0QsU0FBTixDQUFnQkksSUFBaEIsQ0FBcUJGLFVBTlg7QUFPeEJHLGdCQUFjLGdCQUFNTCxTQUFOLENBQWdCSSxJQUFoQixDQUFxQkYsVUFQWDtBQVF4Qm5DLHNCQUFvQixnQkFBTWlDLFNBQU4sQ0FBZ0JJO0FBUlosQ0FBMUI7O2tCQVdlLHNCQUFPeEYsYUFBUCxDIiwiZmlsZSI6IlN0YWdlVGl0bGVCYXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgeyBzaGVsbCwgaXBjUmVuZGVyZXIgfSBmcm9tICdlbGVjdHJvbidcbmltcG9ydCBSYWRpdW0gZnJvbSAncmFkaXVtJ1xuaW1wb3J0IFBvcG92ZXIgZnJvbSAncmVhY3QtcG9wb3ZlcidcbmltcG9ydCBhc3NpZ24gZnJvbSAnbG9kYXNoLmFzc2lnbidcbmltcG9ydCBQYWxldHRlIGZyb20gJy4vUGFsZXR0ZSdcbmltcG9ydCB7IFRocmVlQm91bmNlIH0gZnJvbSAnYmV0dGVyLXJlYWN0LXNwaW5raXQnXG5pbXBvcnQgQ29sb3IgZnJvbSAnY29sb3InXG5pbXBvcnQgeyBCVE5fU1RZTEVTIH0gZnJvbSAnLi4vc3R5bGVzL2J0blNoYXJlZCdcbmltcG9ydCBDb3B5VG9DbGlwYm9hcmQgZnJvbSAncmVhY3QtY29weS10by1jbGlwYm9hcmQnXG5pbXBvcnQgVG9vbFNlbGVjdG9yIGZyb20gJy4vVG9vbFNlbGVjdG9yJ1xuaW1wb3J0IHtcbiAgUHVibGlzaFNuYXBzaG90U1ZHLFxuICBDb25uZWN0aW9uSWNvblNWRyxcbiAgLy8gVW5kb0ljb25TVkcsXG4gIC8vIFJlZG9JY29uU1ZHLFxuICBXYXJuaW5nSWNvblNWRyxcbiAgU3VjY2Vzc0ljb25TVkcsXG4gIERhbmdlckljb25TVkcsXG4gIENsaWJvYXJkSWNvblNWR1xufSBmcm9tICcuL0ljb25zJ1xuaW1wb3J0IHsgRXhwZXJpbWVudCwgZXhwZXJpbWVudElzRW5hYmxlZCB9IGZyb20gJ2hhaWt1LWNvbW1vbi9saWIvZXhwZXJpbWVudHMnXG5pbXBvcnQgeyBFeHBvcnRlckZvcm1hdCB9IGZyb20gJ2hhaWt1LXNkay1jcmVhdG9yL2xpYi9leHBvcnRlcidcblxudmFyIG1peHBhbmVsID0gcmVxdWlyZSgnaGFpa3Utc2VyaWFsaXphdGlvbi9zcmMvdXRpbHMvTWl4cGFuZWwnKVxuXG5jb25zdCBTVFlMRVMgPSB7XG4gIGhpZGU6IHtcbiAgICBkaXNwbGF5OiAnbm9uZSdcbiAgfSxcbiAgZnJhbWU6IHtcbiAgICBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuQ09BTCxcbiAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJyxcbiAgICB0b3A6IDAsXG4gICAgekluZGV4OiAxLFxuICAgIGhlaWdodDogJzM2cHgnLFxuICAgIHBhZGRpbmc6ICc2cHgnXG4gIH0sXG4gIGRpc2FibGVkOiB7XG4gICAgb3BhY2l0eTogMC41LFxuICAgIGN1cnNvcjogJ25vdC1hbGxvd2VkJ1xuICB9LFxuICBzaGFyZVBvcG92ZXI6IHtcbiAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICB0b3A6IDM0LFxuICAgIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5GQVRIRVJfQ09BTCxcbiAgICB3aWR0aDogMjA0LFxuICAgIHBhZGRpbmc6ICcxM3B4IDlweCcsXG4gICAgZm9udFNpemU6IDE3LFxuICAgIGNvbG9yOiBQYWxldHRlLlJPQ0ssXG4gICAgdGV4dEFsaWduOiAnY2VudGVyJyxcbiAgICBib3JkZXJSYWRpdXM6IDQsXG4gICAgYm94U2hhZG93OiAnMCA2cHggMjVweCAwICcgKyBQYWxldHRlLkZBVEhFUl9DT0FMXG4gIH0sXG4gIHBvcG92ZXJDbG9zZToge1xuICAgIGNvbG9yOiAnd2hpdGUnLFxuICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgIHRvcDogNSxcbiAgICByaWdodDogMTAsXG4gICAgZm9udFNpemU6IDE1LFxuICAgIHRleHRUcmFuc2Zvcm06ICdsb3dlcmNhc2UnXG4gIH0sXG4gIGZvb3Rlcjoge1xuICAgIGJhY2tncm91bmRDb2xvcjogQ29sb3IoUGFsZXR0ZS5EQVJLX0dSQVkpLmZhZGUoMC43KSxcbiAgICBoZWlnaHQ6IDI1LFxuICAgIHdpZHRoOiAnMTAwJScsXG4gICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgYm90dG9tOiAwLFxuICAgIGZvbnRTaXplOiAxMCxcbiAgICBib3JkZXJCb3R0b21SaWdodFJhZGl1czogMyxcbiAgICBib3JkZXJCb3R0b21MZWZ0UmFkaXVzOiAzLFxuICAgIHBhZGRpbmdUb3A6IDVcbiAgfSxcbiAgdGltZToge1xuICAgIGZvbnRXZWlnaHQ6ICdib2xkJyxcbiAgICBtYXJnaW5MZWZ0OiA1XG4gIH0sXG4gIGNvcHk6IHtcbiAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICBoZWlnaHQ6ICcxMDAlJyxcbiAgICB3aWR0aDogMjUsXG4gICAgcmlnaHQ6IDAsXG4gICAgcGFkZGluZ1RvcDogMixcbiAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAganVzdGlmeUNvbnRlbnQ6ICdjZW50ZXInLFxuICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxuICAgIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5EQVJLX0dSQVlcbiAgfSxcbiAgY29weUxvYWRpbmc6IHtcbiAgICBwYWRkaW5nVG9wOiAwLFxuICAgIHBhZGRpbmdCb3R0b206IDYsXG4gICAgcG9pbnRlckV2ZW50czogJ25vbmUnXG4gIH0sXG4gIGxpbmtIb2xzdGVyOiB7XG4gICAgaGVpZ2h0OiAyOSxcbiAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJyxcbiAgICBib3JkZXJSYWRpdXM6IDMsXG4gICAgbWFyZ2luVG9wOiAzLFxuICAgIGN1cnNvcjogJ3BvaW50ZXInLFxuICAgIGJhY2tncm91bmRDb2xvcjogQ29sb3IoUGFsZXR0ZS5EQVJLX0dSQVkpLmZhZGUoMC42OCksXG4gICAgYm9yZGVyOiAnMXB4IHNvbGlkICcgKyBQYWxldHRlLkRBUktfR1JBWVxuXG4gIH0sXG4gIGxpbms6IHtcbiAgICBmb250U2l6ZTogMTAsXG4gICAgY29sb3I6IENvbG9yKFBhbGV0dGUuTElHSFRfQkxVRSkubGlnaHRlbigwLjM3KSxcbiAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICBsZWZ0OiA3LFxuICAgIHRvcDogNyxcbiAgICBjdXJzb3I6ICdwb2ludGVyJ1xuICB9LFxuICBnZW5lcmF0aW5nTGluazoge1xuICAgIGNvbG9yOiBQYWxldHRlLlJPQ0ssXG4gICAgY3Vyc29yOiAnZGVmYXVsdCcsXG4gICAgZm9udFN0eWxlOiAnaXRhbGljJ1xuICB9XG59XG5cbmNvbnN0IFNOQVBTSE9UX1NBVkVfUkVTT0xVVElPTl9TVFJBVEVHSUVTID0ge1xuICBub3JtYWw6IHsgc3RyYXRlZ3k6ICdyZWN1cnNpdmUnLCBmYXZvcjogJ291cnMnIH0sXG4gIG91cnM6IHsgc3RyYXRlZ3k6ICdvdXJzJyB9LFxuICB0aGVpcnM6IHsgc3RyYXRlZ3k6ICd0aGVpcnMnIH1cbn1cblxuY2xhc3MgUG9wb3ZlckJvZHkgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzaG91bGRDb21wb25lbnRVcGRhdGUgKG5leHRQcm9wcykge1xuICAgIHJldHVybiAoXG4gICAgICB0aGlzLnByb3BzLnRpdGxlVGV4dCAhPT0gbmV4dFByb3BzLnRpdGxlVGV4dCB8fFxuICAgICAgdGhpcy5wcm9wcy5saW5rQWRkcmVzcyAhPT0gbmV4dFByb3BzLmxpbmtBZGRyZXNzIHx8XG4gICAgICB0aGlzLnByb3BzLmlzU25hcHNob3RTYXZlSW5Qcm9ncmVzcyAhPT0gbmV4dFByb3BzLmlzU25hcHNob3RTYXZlSW5Qcm9ncmVzcyB8fFxuICAgICAgdGhpcy5wcm9wcy5zbmFwc2hvdFNhdmVDb25maXJtZWQgIT09IG5leHRQcm9wcy5zbmFwc2hvdFNhdmVDb25maXJtZWQgfHxcbiAgICAgIHRoaXMucHJvcHMuaXNQcm9qZWN0SW5mb0ZldGNoSW5Qcm9ncmVzcyAhPT0gbmV4dFByb3BzLmlzUHJvamVjdEluZm9GZXRjaEluUHJvZ3Jlc3NcbiAgICApXG4gIH1cblxuICByZW5kZXIgKCkge1xuICAgIGxldCBwb3BvdmVyUG9zaXRpb25cblxuICAgIGlmICh0aGlzLnByb3BzLnNuYXBzaG90U2F2ZUNvbmZpcm1lZCkge1xuICAgICAgcG9wb3ZlclBvc2l0aW9uID0gLTcyXG4gICAgfSBlbHNlIGlmICh0aGlzLnByb3BzLmlzU25hcHNob3RTYXZlSW5Qcm9ncmVzcykge1xuICAgICAgcG9wb3ZlclBvc2l0aW9uID0gLTcwXG4gICAgfSBlbHNlIHtcbiAgICAgIHBvcG92ZXJQb3NpdGlvbiA9IC01OVxuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IHN0eWxlPXtbU1RZTEVTLnNoYXJlUG9wb3Zlciwge3JpZ2h0OiBwb3BvdmVyUG9zaXRpb259XX0+XG4gICAgICAgIDxidXR0b24gc3R5bGU9e1NUWUxFUy5wb3BvdmVyQ2xvc2V9IG9uQ2xpY2s9e3RoaXMucHJvcHMuY2xvc2V9Png8L2J1dHRvbj5cbiAgICAgICAge3RoaXMucHJvcHMudGl0bGVUZXh0fVxuICAgICAgICA8ZGl2IHN0eWxlPXtTVFlMRVMubGlua0hvbHN0ZXJ9PlxuICAgICAgICAgIHsodGhpcy5wcm9wcy5pc1NuYXBzaG90U2F2ZUluUHJvZ3Jlc3MgfHwgdGhpcy5wcm9wcy5pc1Byb2plY3RJbmZvRmV0Y2hJblByb2dyZXNzKVxuICAgICAgICAgICAgPyA8c3BhbiBzdHlsZT17W1NUWUxFUy5saW5rLCBTVFlMRVMuZ2VuZXJhdGluZ0xpbmtdfT5VcGRhdGluZyBTaGFyZSBQYWdlPC9zcGFuPlxuICAgICAgICAgICAgOiA8c3BhbiBzdHlsZT17U1RZTEVTLmxpbmt9IG9uQ2xpY2s9eygpID0+IHNoZWxsLm9wZW5FeHRlcm5hbCh0aGlzLnByb3BzLmxpbmtBZGRyZXNzKX0+e3RoaXMucHJvcHMubGlua0FkZHJlc3Muc3Vic3RyaW5nKDAsIDMzKX08L3NwYW4+fVxuICAgICAgICAgIDxDb3B5VG9DbGlwYm9hcmRcbiAgICAgICAgICAgIHRleHQ9e3RoaXMucHJvcHMubGlua0FkZHJlc3N9XG4gICAgICAgICAgICBvbkNvcHk9eygpID0+IHtcbiAgICAgICAgICAgICAgdGhpcy5wcm9wcy5wYXJlbnQuc2V0U3RhdGUoe2NvcGllZDogdHJ1ZX0pXG4gICAgICAgICAgICAgIHRoaXMucHJvcHMucGFyZW50LnNldFN0YXRlKHtzaG93Q29waWVkOiB0cnVlfSwgKCkgPT4ge1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgdGhpcy5wcm9wcy5wYXJlbnQuc2V0U3RhdGUoe3Nob3dDb3BpZWQ6IGZhbHNlfSlcbiAgICAgICAgICAgICAgICB9LCAxOTAwKVxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICB7KHRoaXMucHJvcHMuaXNTbmFwc2hvdFNhdmVJblByb2dyZXNzIHx8IHRoaXMucHJvcHMuaXNQcm9qZWN0SW5mb0ZldGNoSW5Qcm9ncmVzcylcbiAgICAgICAgICAgICAgPyA8c3BhbiBzdHlsZT17W1NUWUxFUy5jb3B5LCBTVFlMRVMuY29weUxvYWRpbmddfT48VGhyZWVCb3VuY2Ugc2l6ZT17M30gY29sb3I9e1BhbGV0dGUuUk9DS30gLz48L3NwYW4+XG4gICAgICAgICAgICAgIDogPHNwYW4gc3R5bGU9e1NUWUxFUy5jb3B5fT48Q2xpYm9hcmRJY29uU1ZHIC8+PC9zcGFuPn1cbiAgICAgICAgICA8L0NvcHlUb0NsaXBib2FyZD5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIHsvKiB0b2RvOiBzaG93IGxhc3QgdXBkYXRlZD8gPGRpdiBzdHlsZT17U1RZTEVTLmZvb3Rlcn0+VVBEQVRFRDxzcGFuIHN0eWxlPXtTVFlMRVMudGltZX0+eyc5OjAwYW0gSnVuIDE1LCAyMDE3J308L3NwYW4+PC9kaXY+ICovfVxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG59XG5cbmNvbnN0IFBvcG92ZXJCb2R5UmFkaXVtaXplZCA9IFJhZGl1bShQb3BvdmVyQm9keSlcblxuY2xhc3MgU3RhZ2VUaXRsZUJhciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yIChwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKVxuICAgIHRoaXMuaGFuZGxlQ29ubmVjdGlvbkNsaWNrID0gdGhpcy5oYW5kbGVDb25uZWN0aW9uQ2xpY2suYmluZCh0aGlzKVxuICAgIHRoaXMuaGFuZGxlVW5kb0NsaWNrID0gdGhpcy5oYW5kbGVVbmRvQ2xpY2suYmluZCh0aGlzKVxuICAgIHRoaXMuaGFuZGxlUmVkb0NsaWNrID0gdGhpcy5oYW5kbGVSZWRvQ2xpY2suYmluZCh0aGlzKVxuICAgIHRoaXMuaGFuZGxlU2F2ZVNuYXBzaG90Q2xpY2sgPSB0aGlzLmhhbmRsZVNhdmVTbmFwc2hvdENsaWNrLmJpbmQodGhpcylcbiAgICB0aGlzLmhhbmRsZU1lcmdlUmVzb2x2ZU91cnMgPSB0aGlzLmhhbmRsZU1lcmdlUmVzb2x2ZU91cnMuYmluZCh0aGlzKVxuICAgIHRoaXMuaGFuZGxlTWVyZ2VSZXNvbHZlVGhlaXJzID0gdGhpcy5oYW5kbGVNZXJnZVJlc29sdmVUaGVpcnMuYmluZCh0aGlzKVxuICAgIHRoaXMuX2lzTW91bnRlZCA9IGZhbHNlXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIHNuYXBzaG90U2F2ZVJlc29sdXRpb25TdHJhdGVneU5hbWU6ICdub3JtYWwnLFxuICAgICAgaXNTbmFwc2hvdFNhdmVJblByb2dyZXNzOiBmYWxzZSxcbiAgICAgIHNuYXBzaG90TWVyZ2VDb25mbGljdHM6IG51bGwsXG4gICAgICBzbmFwc2hvdFNhdmVDb25maXJtZWQ6IG51bGwsXG4gICAgICBzbmFwc2hvdFNhdmVFcnJvcjogbnVsbCxcbiAgICAgIHNob3dTaGFyZVBvcG92ZXI6IGZhbHNlLFxuICAgICAgY29waWVkOiBmYWxzZSxcbiAgICAgIGxpbmtBZGRyZXNzOiAnRmV0Y2hpbmcgSW5mbycsXG4gICAgICBzaG93Q29waWVkOiBmYWxzZSxcbiAgICAgIHByb2plY3RJbmZvRmV0Y2hFcnJvcjogbnVsbCxcbiAgICAgIGlzUHJvamVjdEluZm9GZXRjaEluUHJvZ3Jlc3M6IGZhbHNlLFxuICAgICAgcHJvamVjdEluZm86IG51bGwsXG4gICAgICBnaXRVbmRvYWJsZXM6IFtdLFxuICAgICAgZ2l0UmVkb2FibGVzOiBbXVxuICAgIH1cbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxNb3VudCAoKSB7XG4gICAgdGhpcy5faXNNb3VudGVkID0gdHJ1ZVxuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQgKCkge1xuICAgIHRoaXMucGVyZm9ybVByb2plY3RJbmZvRmV0Y2goKVxuXG4gICAgLy8gSXQncyBraW5kIG9mIHdlaXJkIHRvIGhhdmUgdGhpcyBoZWFydGJlYXQgbG9naWMgYnVyaWVkIGFsbCB0aGUgd2F5IGRvd24gaGVyZSBpbnNpZGUgU3RhdGVUaXRsZUJhcjtcbiAgICAvLyBpdCBwcm9iYWJseSBzaG91bGQgYmUgbW92ZWQgdXAgdG8gdGhlIENyZWF0b3IgbGV2ZWwgc28gaXQncyBlYXNpZXIgdG8gZmluZCAjRklYTUVcbiAgICB0aGlzLl9mZXRjaE1hc3RlclN0YXRlSW50ZXJ2YWwgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5wcm9wcy53ZWJzb2NrZXQucmVxdWVzdCh7IG1ldGhvZDogJ21hc3RlckhlYXJ0YmVhdCcsIHBhcmFtczogW3RoaXMucHJvcHMuZm9sZGVyXSB9LCAoaGVhcnRiZWF0RXJyLCBtYXN0ZXJTdGF0ZSkgPT4ge1xuICAgICAgICBpZiAoaGVhcnRiZWF0RXJyIHx8ICFtYXN0ZXJTdGF0ZSkge1xuICAgICAgICAgIC8vIElmIG1hc3RlciBkaXNjb25uZWN0cyB3ZSBtaWdodCBub3QgZXZlbiBnZXQgYW4gZXJyb3IsIHNvIGNyZWF0ZSBhIGZha2UgZXJyb3IgaW4gaXRzIHBsYWNlXG4gICAgICAgICAgaWYgKCFoZWFydGJlYXRFcnIpIGhlYXJ0YmVhdEVyciA9IG5ldyBFcnJvcignVW5rbm93biBwcm9ibGVtIHdpdGggbWFzdGVyIGhlYXJ0YmVhdCcpXG4gICAgICAgICAgY29uc29sZS5lcnJvcihoZWFydGJlYXRFcnIpXG5cbiAgICAgICAgICAvLyBJZiBtYXN0ZXIgaGFzIGRpc2Nvbm5lY3RlZCwgc3RvcCBydW5uaW5nIHRoaXMgaW50ZXJ2YWwgc28gd2UgZG9uJ3QgZ2V0IHB1bHNpbmcgZXJyb3IgbWVzc2FnZXNcbiAgICAgICAgICBjbGVhckludGVydmFsKHRoaXMuX2ZldGNoTWFzdGVyU3RhdGVJbnRlcnZhbClcblxuICAgICAgICAgIC8vIEJ1dCB0aGUgZmlyc3QgdGltZSB3ZSBnZXQgdGhpcywgZGlzcGxheSBhIHVzZXIgbm90aWNlIC0gdGhleSBwcm9iYWJseSBuZWVkIHRvIHJlc3RhcnQgSGFpa3UgdG8gZ2V0XG4gICAgICAgICAgLy8gaW50byBhIGJldHRlciBzdGF0ZSwgYXQgbGVhc3QgdW50aWwgd2UgY2FuIHJlc29sdmUgd2hhdCB0aGUgY2F1c2Ugb2YgdGhpcyBwcm9ibGVtIGlzXG4gICAgICAgICAgcmV0dXJuIHRoaXMucHJvcHMuY3JlYXRlTm90aWNlKHtcbiAgICAgICAgICAgIHR5cGU6ICdkYW5nZXInLFxuICAgICAgICAgICAgdGl0bGU6ICdVaCBvaCEnLFxuICAgICAgICAgICAgbWVzc2FnZTogJ0hhaWt1IGlzIGhhdmluZyBhIHByb2JsZW0gYWNjZXNzaW5nIHlvdXIgcHJvamVjdC4g8J+YoiBQbGVhc2UgcmVzdGFydCBIYWlrdS4gSWYgeW91IHNlZSB0aGlzIGVycm9yIGFnYWluLCBjb250YWN0IEhhaWt1IGZvciBzdXBwb3J0LidcbiAgICAgICAgICB9KVxuICAgICAgICB9XG5cbiAgICAgICAgaXBjUmVuZGVyZXIuc2VuZCgnbWFzdGVyOmhlYXJ0YmVhdCcsIGFzc2lnbih7fSwgbWFzdGVyU3RhdGUpKVxuXG4gICAgICAgIGlmICh0aGlzLl9pc01vdW50ZWQpIHtcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIGdpdFVuZG9hYmxlczogbWFzdGVyU3RhdGUuZ2l0VW5kb2FibGVzLFxuICAgICAgICAgICAgZ2l0UmVkb2FibGVzOiBtYXN0ZXJTdGF0ZS5naXRSZWRvYWJsZXNcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH0sIDEwMDApXG5cbiAgICBpcGNSZW5kZXJlci5vbignZ2xvYmFsLW1lbnU6c2F2ZScsICgpID0+IHtcbiAgICAgIHRoaXMuaGFuZGxlU2F2ZVNuYXBzaG90Q2xpY2soKVxuICAgIH0pXG4gIH1cblxuICBjb21wb25lbnRXaWxsVW5tb3VudCAoKSB7XG4gICAgdGhpcy5faXNNb3VudGVkID0gZmFsc2VcbiAgICBjbGVhckludGVydmFsKHRoaXMuX2ZldGNoTWFzdGVyU3RhdGVJbnRlcnZhbClcbiAgfVxuXG4gIGhhbmRsZUNvbm5lY3Rpb25DbGljayAoKSB7XG4gICAgLy8gVE9ET1xuICB9XG5cbiAgaGFuZGxlVW5kb0NsaWNrICgpIHtcbiAgICByZXR1cm4gdGhpcy5wcm9wcy53ZWJzb2NrZXQucmVxdWVzdCh7IG1ldGhvZDogJ2dpdFVuZG8nLCBwYXJhbXM6IFt0aGlzLnByb3BzLmZvbGRlciwgeyB0eXBlOiAnZ2xvYmFsJyB9XSB9LCAoZXJyKSA9PiB7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKVxuICAgICAgICByZXR1cm4gdGhpcy5wcm9wcy5jcmVhdGVOb3RpY2Uoe1xuICAgICAgICAgIHR5cGU6ICd3YXJuaW5nJyxcbiAgICAgICAgICB0aXRsZTogJ1VoIG9oIScsXG4gICAgICAgICAgbWVzc2FnZTogJ1dlIHdlcmUgdW5hYmxlIHRvIHVuZG8geW91ciBsYXN0IGFjdGlvbi4g8J+YoiBQbGVhc2UgY29udGFjdCBIYWlrdSBmb3Igc3VwcG9ydC4nXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGhhbmRsZVJlZG9DbGljayAoKSB7XG4gICAgcmV0dXJuIHRoaXMucHJvcHMud2Vic29ja2V0LnJlcXVlc3QoeyBtZXRob2Q6ICdnaXRSZWRvJywgcGFyYW1zOiBbdGhpcy5wcm9wcy5mb2xkZXIsIHsgdHlwZTogJ2dsb2JhbCcgfV0gfSwgKGVycikgPT4ge1xuICAgICAgaWYgKGVycikge1xuICAgICAgICBjb25zb2xlLmVycm9yKGVycilcbiAgICAgICAgcmV0dXJuIHRoaXMucHJvcHMuY3JlYXRlTm90aWNlKHtcbiAgICAgICAgICB0eXBlOiAnd2FybmluZycsXG4gICAgICAgICAgdGl0bGU6ICdVaCBvaCEnLFxuICAgICAgICAgIG1lc3NhZ2U6ICdXZSB3ZXJlIHVuYWJsZSB0byByZWRvIHlvdXIgbGFzdCBhY3Rpb24uIPCfmKIgUGxlYXNlIGNvbnRhY3QgSGFpa3UgZm9yIHN1cHBvcnQuJ1xuICAgICAgICB9KVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBnZXRQcm9qZWN0U2F2ZU9wdGlvbnMgKCkge1xuICAgIHJldHVybiB7XG4gICAgICBjb21taXRNZXNzYWdlOiAnQ2hhbmdlcyBzYXZlZCAodmlhIEhhaWt1IERlc2t0b3ApJyxcbiAgICAgIHNhdmVTdHJhdGVneTogU05BUFNIT1RfU0FWRV9SRVNPTFVUSU9OX1NUUkFURUdJRVNbdGhpcy5zdGF0ZS5zbmFwc2hvdFNhdmVSZXNvbHV0aW9uU3RyYXRlZ3lOYW1lXSxcbiAgICAgIGV4cG9ydGVyRm9ybWF0czogZXhwZXJpbWVudElzRW5hYmxlZChFeHBlcmltZW50LkxvdHRpZUV4cG9ydE9uUHVibGlzaCkgPyBbRXhwb3J0ZXJGb3JtYXQuQm9keW1vdmluXSA6IFtdLFxuICAgIH1cbiAgfVxuXG4gIGhhbmRsZVNhdmVTbmFwc2hvdENsaWNrICgpIHtcbiAgICBpZiAodGhpcy5zdGF0ZS5zbmFwc2hvdFNhdmVFcnJvcikgcmV0dXJuIHZvaWQgKDApXG4gICAgaWYgKHRoaXMuc3RhdGUuaXNTbmFwc2hvdFNhdmVJblByb2dyZXNzKSByZXR1cm4gdm9pZCAoMClcbiAgICBpZiAodGhpcy5zdGF0ZS5zbmFwc2hvdE1lcmdlQ29uZmxpY3RzKSByZXR1cm4gdm9pZCAoMClcbiAgICBpZiAodGhpcy5zdGF0ZS5zaG93U2hhcmVQb3BvdmVyKSByZXR1cm4gdm9pZCAoMClcblxuICAgIHRoaXMuc2V0U3RhdGUoe3Nob3dTaGFyZVBvcG92ZXI6ICF0aGlzLnN0YXRlLnNob3dTaGFyZVBvcG92ZXJ9KVxuXG4gICAgaWYgKHRoaXMucHJvcHMudG91ckNsaWVudCkgdGhpcy5wcm9wcy50b3VyQ2xpZW50Lm5leHQoKVxuXG4gICAgcmV0dXJuIHRoaXMucGVyZm9ybVByb2plY3RTYXZlKClcbiAgfVxuXG4gIHBlcmZvcm1Qcm9qZWN0SW5mb0ZldGNoICgpIHtcbiAgICB0aGlzLnNldFN0YXRlKHsgaXNQcm9qZWN0SW5mb0ZldGNoSW5Qcm9ncmVzczogdHJ1ZSB9KVxuICAgIHJldHVybiB0aGlzLnByb3BzLndlYnNvY2tldC5yZXF1ZXN0KHsgbWV0aG9kOiAnZmV0Y2hQcm9qZWN0SW5mbycsIHBhcmFtczogW3RoaXMucHJvcHMuZm9sZGVyLCB0aGlzLnByb3BzLnByb2plY3QucHJvamVjdE5hbWUsIHRoaXMucHJvcHMudXNlcm5hbWUsIHRoaXMucHJvcHMucGFzc3dvcmQsIHt9XSB9LCAocHJvamVjdEluZm9GZXRjaEVycm9yLCBwcm9qZWN0SW5mbykgPT4ge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7IGlzUHJvamVjdEluZm9GZXRjaEluUHJvZ3Jlc3M6IGZhbHNlIH0pXG5cbiAgICAgIGlmIChwcm9qZWN0SW5mb0ZldGNoRXJyb3IpIHtcbiAgICAgICAgaWYgKHByb2plY3RJbmZvRmV0Y2hFcnJvci5tZXNzYWdlKSB7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihwcm9qZWN0SW5mb0ZldGNoRXJyb3IubWVzc2FnZSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKCd1bmtub3duIHByb2JsZW0gZmV0Y2hpbmcgcHJvamVjdCcpXG4gICAgICAgIH1cblxuICAgICAgICAvLyBXZSBtaWdodCBvbmx5IGNhcmUgYWJvdXQgdGhpcyBpZiBpdCBjb21lcyB1cCBkdXJpbmcgYSBzYXZlLi4uICNGSVhNRSA/P1xuICAgICAgICBpZiAocHJvamVjdEluZm9GZXRjaEVycm9yLm1lc3NhZ2UgPT09ICdUaW1lZCBvdXQgd2FpdGluZyBmb3IgcHJvamVjdCBzaGFyZSBpbmZvJykge1xuICAgICAgICAgIC8vID9cbiAgICAgICAgICByZXR1cm4gdm9pZCAoMCkgLy8gR290dGEgcmV0dXJuIGhlcmUgLSBkb24ndCB3YW50IHRvIGZhbGwgdGhyb3VnaCBhcyB0aG91Z2ggd2UgYWN0dWFsbHkgZ290IHByb2plY3RJbmZvIGJlbG93XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuc2V0U3RhdGUoeyBwcm9qZWN0SW5mb0ZldGNoRXJyb3IgfSlcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB0aGlzLnNldFN0YXRlKHsgcHJvamVjdEluZm8gfSlcbiAgICAgIGlmICh0aGlzLnByb3BzLnJlY2VpdmVQcm9qZWN0SW5mbykgdGhpcy5wcm9wcy5yZWNlaXZlUHJvamVjdEluZm8ocHJvamVjdEluZm8pXG4gICAgICBpZiAocHJvamVjdEluZm8uc2hhcmVMaW5rKSB0aGlzLnNldFN0YXRlKHsgbGlua0FkZHJlc3M6IHByb2plY3RJbmZvLnNoYXJlTGluayB9KVxuICAgIH0pXG4gIH1cblxuICB3aXRoUHJvamVjdEluZm8gKG90aGVyT2JqZWN0KSB7XG4gICAgbGV0IHByb2ogPSB0aGlzLnN0YXRlLnByb2plY3RJbmZvIHx8IHt9XG4gICAgcmV0dXJuIGFzc2lnbih7fSwgb3RoZXJPYmplY3QsIHtcbiAgICAgIG9yZ2FuaXphdGlvbjogcHJvai5vcmdhbml6YXRpb25OYW1lLFxuICAgICAgdXVpZDogcHJvai5wcm9qZWN0VWlkLFxuICAgICAgc2hhOiBwcm9qLnNoYSxcbiAgICAgIGJyYW5jaDogcHJvai5icmFuY2hOYW1lXG4gICAgfSlcbiAgfVxuXG4gIHJlcXVlc3RTYXZlUHJvamVjdCAoY2IpIHtcbiAgICByZXR1cm4gdGhpcy5wcm9wcy53ZWJzb2NrZXQucmVxdWVzdCh7IG1ldGhvZDogJ3NhdmVQcm9qZWN0JywgcGFyYW1zOiBbdGhpcy5wcm9wcy5mb2xkZXIsIHRoaXMucHJvcHMucHJvamVjdC5wcm9qZWN0TmFtZSwgdGhpcy5wcm9wcy51c2VybmFtZSwgdGhpcy5wcm9wcy5wYXNzd29yZCwgdGhpcy5nZXRQcm9qZWN0U2F2ZU9wdGlvbnMoKV0gfSwgY2IpXG4gIH1cblxuICBwZXJmb3JtUHJvamVjdFNhdmUgKCkge1xuICAgIG1peHBhbmVsLmhhaWt1VHJhY2soJ2NyZWF0b3I6cHJvamVjdDpzYXZpbmcnLCB0aGlzLndpdGhQcm9qZWN0SW5mbyh7XG4gICAgICB1c2VybmFtZTogdGhpcy5wcm9wcy51c2VybmFtZSxcbiAgICAgIHByb2plY3Q6IHRoaXMucHJvcHMucHJvamVjdE5hbWVcbiAgICB9KSlcbiAgICB0aGlzLnNldFN0YXRlKHsgaXNTbmFwc2hvdFNhdmVJblByb2dyZXNzOiB0cnVlIH0pXG5cbiAgICByZXR1cm4gdGhpcy5yZXF1ZXN0U2F2ZVByb2plY3QoKHNuYXBzaG90U2F2ZUVycm9yLCBzbmFwc2hvdERhdGEpID0+IHtcbiAgICAgIGlmIChzbmFwc2hvdFNhdmVFcnJvcikge1xuICAgICAgICBjb25zb2xlLmVycm9yKHNuYXBzaG90U2F2ZUVycm9yKVxuICAgICAgICBpZiAoc25hcHNob3RTYXZlRXJyb3IubWVzc2FnZSA9PT0gJ1RpbWVkIG91dCB3YWl0aW5nIGZvciBwcm9qZWN0IHNoYXJlIGluZm8nKSB7XG4gICAgICAgICAgdGhpcy5wcm9wcy5jcmVhdGVOb3RpY2Uoe1xuICAgICAgICAgICAgdHlwZTogJ3dhcm5pbmcnLFxuICAgICAgICAgICAgdGl0bGU6ICdIbW0uLi4nLFxuICAgICAgICAgICAgbWVzc2FnZTogJ1B1Ymxpc2hpbmcgeW91ciBwcm9qZWN0IHNlZW1zIHRvIGJlIHRha2luZyBhIGxvbmcgdGltZS4g8J+YoiBQbGVhc2UgdHJ5IGFnYWluIGluIGEgZmV3IG1vbWVudHMuIElmIHlvdSBzZWUgdGhpcyBtZXNzYWdlIGFnYWluLCBjb250YWN0IEhhaWt1IGZvciBzdXBwb3J0LidcbiAgICAgICAgICB9KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMucHJvcHMuY3JlYXRlTm90aWNlKHtcbiAgICAgICAgICAgIHR5cGU6ICdkYW5nZXInLFxuICAgICAgICAgICAgdGl0bGU6ICdPaCBubyEnLFxuICAgICAgICAgICAgbWVzc2FnZTogJ1dlIHdlcmUgdW5hYmxlIHRvIHB1Ymxpc2ggeW91ciBwcm9qZWN0LiDwn5iiIFBsZWFzZSB0cnkgYWdhaW4gaW4gYSBmZXcgbW9tZW50cy4gSWYgeW91IHN0aWxsIHNlZSB0aGlzIGVycm9yLCBjb250YWN0IEhhaWt1IGZvciBzdXBwb3J0LidcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLnNldFN0YXRlKHsgaXNTbmFwc2hvdFNhdmVJblByb2dyZXNzOiBmYWxzZSwgc25hcHNob3RTYXZlUmVzb2x1dGlvblN0cmF0ZWd5TmFtZTogJ25vcm1hbCcsIHNuYXBzaG90U2F2ZUVycm9yIH0sICgpID0+IHtcbiAgICAgICAgICByZXR1cm4gc2V0VGltZW91dCgoKSA9PiB0aGlzLnNldFN0YXRlKHsgc25hcHNob3RTYXZlRXJyb3I6IG51bGwgfSksIDIwMDApXG4gICAgICAgIH0pXG4gICAgICB9XG5cbiAgICAgIHRoaXMuc2V0U3RhdGUoeyBpc1NuYXBzaG90U2F2ZUluUHJvZ3Jlc3M6IGZhbHNlLCBzbmFwc2hvdFNhdmVDb25maXJtZWQ6IHRydWUgfSlcblxuICAgICAgaWYgKHNuYXBzaG90RGF0YSkge1xuICAgICAgICBpZiAoc25hcHNob3REYXRhLmNvbmZsaWN0cykge1xuICAgICAgICAgIGNvbnNvbGUud2FybignW2NyZWF0b3JdIE1lcmdlIGNvbmZsaWN0cyBmb3VuZCEnKVxuICAgICAgICAgIHRoaXMucHJvcHMuY3JlYXRlTm90aWNlKHtcbiAgICAgICAgICAgIHR5cGU6ICd3YXJuaW5nJyxcbiAgICAgICAgICAgIHRpdGxlOiAnTWVyZ2UgY29uZmxpY3RzIScsXG4gICAgICAgICAgICBtZXNzYWdlOiAnV2UgY291bGRuXFwndCBtZXJnZSB5b3VyIGNoYW5nZXMuIPCfmKIgWW91XFwnbGwgbmVlZCB0byBkZWNpZGUgaG93IHRvIG1lcmdlIHlvdXIgY2hhbmdlcyBiZWZvcmUgY29udGludWluZy4nXG4gICAgICAgICAgfSlcbiAgICAgICAgICByZXR1cm4gdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICBzbmFwc2hvdE1lcmdlQ29uZmxpY3RzOiBzbmFwc2hvdERhdGEuY29uZmxpY3RzLFxuICAgICAgICAgICAgc2hvd1NoYXJlUG9wb3ZlcjogZmFsc2VcbiAgICAgICAgICB9KVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc29sZS5pbmZvKCdbY3JlYXRvcl0gU2F2ZSBjb21wbGV0ZScsIHNuYXBzaG90RGF0YSlcblxuICAgICAgICAvLyBVbmxlc3Mgd2Ugc2V0IGJhY2sgdG8gbm9ybWFsLCBzdWJzZXF1ZW50IHNhdmVzIHdpbGwgc3RpbGwgYmUgc2V0IHRvIHVzZSB0aGUgc3RyaWN0IG91cnMvdGhlaXJzIHN0cmF0ZWd5LFxuICAgICAgICAvLyB3aGljaCB3aWxsIGNsb2JiZXIgdXBkYXRlcyB0aGF0IHdlIG1pZ2h0IHdhbnQgdG8gYWN0dWFsbHkgbWVyZ2UgZ3JhY2VmdWxseS5cbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHNuYXBzaG90U2F2ZVJlc29sdXRpb25TdHJhdGVneU5hbWU6ICdub3JtYWwnIH0pXG5cbiAgICAgICAgaWYgKHNuYXBzaG90RGF0YS5zaGFyZUxpbmspIHtcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgbGlua0FkZHJlc3M6IHNuYXBzaG90RGF0YS5zaGFyZUxpbmsgfSlcbiAgICAgICAgfVxuXG4gICAgICAgIG1peHBhbmVsLmhhaWt1VHJhY2soJ2NyZWF0b3I6cHJvamVjdDpzYXZlZCcsIHRoaXMud2l0aFByb2plY3RJbmZvKHtcbiAgICAgICAgICB1c2VybmFtZTogdGhpcy5wcm9wcy51c2VybmFtZSxcbiAgICAgICAgICBwcm9qZWN0OiB0aGlzLnByb3BzLnByb2plY3ROYW1lXG4gICAgICAgIH0pKVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gc2V0VGltZW91dCgoKSA9PiB0aGlzLnNldFN0YXRlKHsgc25hcHNob3RTYXZlQ29uZmlybWVkOiBmYWxzZSB9KSwgMjAwMClcbiAgICB9KVxuICB9XG5cbiAgcmVuZGVyU25hcHNob3RTYXZlSW5uZXJCdXR0b24gKCkge1xuICAgIGlmICh0aGlzLnN0YXRlLnNuYXBzaG90U2F2ZUVycm9yKSByZXR1cm4gPGRpdiBzdHlsZT17e2hlaWdodDogMTgsIG1hcmdpblJpZ2h0OiAtNX19PjxEYW5nZXJJY29uU1ZHIGZpbGw9J3RyYW5zcGFyZW50JyAvPjwvZGl2PlxuICAgIGlmICh0aGlzLnN0YXRlLnNuYXBzaG90TWVyZ2VDb25mbGljdHMpIHJldHVybiA8ZGl2IHN0eWxlPXt7aGVpZ2h0OiAxOSwgbWFyZ2luUmlnaHQ6IDAsIG1hcmdpblRvcDogLTJ9fT48V2FybmluZ0ljb25TVkcgZmlsbD0ndHJhbnNwYXJlbnQnIGNvbG9yPXtQYWxldHRlLk9SQU5HRX0gLz48L2Rpdj5cbiAgICBpZiAodGhpcy5zdGF0ZS5zbmFwc2hvdFNhdmVDb25maXJtZWQpIHJldHVybiA8ZGl2IHN0eWxlPXt7IGhlaWdodDogMTggfX0+PFN1Y2Nlc3NJY29uU1ZHIHZpZXdCb3g9JzAgMCAxNCAxNCcgZmlsbD0ndHJhbnNwYXJlbnQnIC8+PC9kaXY+XG4gICAgcmV0dXJuIDxQdWJsaXNoU25hcHNob3RTVkcgLz5cbiAgfVxuXG4gIGhhbmRsZU1lcmdlUmVzb2x2ZU91cnMgKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoeyBzbmFwc2hvdE1lcmdlQ29uZmxpY3RzOiBudWxsLCBzbmFwc2hvdFNhdmVSZXNvbHV0aW9uU3RyYXRlZ3lOYW1lOiAnb3VycycgfSwgKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMucGVyZm9ybVByb2plY3RTYXZlKClcbiAgICB9KVxuICB9XG5cbiAgaGFuZGxlTWVyZ2VSZXNvbHZlVGhlaXJzICgpIHtcbiAgICB0aGlzLnNldFN0YXRlKHsgc25hcHNob3RNZXJnZUNvbmZsaWN0czogbnVsbCwgc25hcHNob3RTYXZlUmVzb2x1dGlvblN0cmF0ZWd5TmFtZTogJ3RoZWlycycgfSwgKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMucGVyZm9ybVByb2plY3RTYXZlKClcbiAgICB9KVxuICB9XG5cbiAgcmVuZGVyTWVyZ2VDb25mbGljdFJlc29sdXRpb25BcmVhICgpIHtcbiAgICBpZiAoIXRoaXMuc3RhdGUuc25hcHNob3RNZXJnZUNvbmZsaWN0cykgcmV0dXJuICcnXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgc3R5bGU9e3sgcG9zaXRpb246ICdhYnNvbHV0ZScsIGxlZnQ6IDAsIHJpZ2h0OiAxNTAsIHRvcDogNCwgcGFkZGluZzogNSwgYm9yZGVyUmFkaXVzOiA0LCBjb2xvcjogUGFsZXR0ZS5ST0NLLCB0ZXh0QWxpZ246ICdyaWdodCcsIG92ZXJmbG93OiAnaGlkZGVuJyB9fT5cbiAgICAgICAgQ29uZmxpY3QgZm91bmQheycgJ31cbiAgICAgICAgPGEgb25DbGljaz17dGhpcy5oYW5kbGVNZXJnZVJlc29sdmVPdXJzfSBzdHlsZT17eyBjdXJzb3I6ICdwb2ludGVyJywgdGV4dERlY29yYXRpb246ICd1bmRlcmxpbmUnLCBjb2xvcjogUGFsZXR0ZS5HUkVFTiB9fT5Gb3JjZSB5b3VyIGNoYW5nZXM8L2E+eycgJ31cbiAgICAgICAgb3IgPGEgb25DbGljaz17dGhpcy5oYW5kbGVNZXJnZVJlc29sdmVUaGVpcnN9IHN0eWxlPXt7IGN1cnNvcjogJ3BvaW50ZXInLCB0ZXh0RGVjb3JhdGlvbjogJ3VuZGVybGluZScsIGNvbG9yOiBQYWxldHRlLlJFRCB9fT5kaXNjYXJkIHlvdXJzICZhbXA7IGFjY2VwdCB0aGVpcnM8L2E+P1xuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgaG92ZXJTdHlsZUZvclNhdmVCdXR0b24gKCkge1xuICAgIGlmICh0aGlzLnN0YXRlLmlzU25hcHNob3RTYXZlSW5Qcm9ncmVzcykgcmV0dXJuIG51bGxcbiAgICBpZiAodGhpcy5zdGF0ZS5zbmFwc2hvdFNhdmVFcnJvcikgcmV0dXJuIG51bGxcbiAgICBpZiAodGhpcy5zdGF0ZS5zbmFwc2hvdE1lcmdlQ29uZmxpY3RzKSByZXR1cm4gbnVsbFxuICAgIGlmICh0aGlzLnN0YXRlLnNuYXBzaG90U2F2ZUNvbmZpcm1lZCkgcmV0dXJuIG51bGxcbiAgICByZXR1cm4gQlROX1NUWUxFUy5idG5JY29uSG92ZXJcbiAgfVxuXG4gIHJlbmRlciAoKSB7XG4gICAgY29uc3QgeyBzaG93U2hhcmVQb3BvdmVyIH0gPSB0aGlzLnN0YXRlXG4gICAgY29uc3QgdGl0bGVUZXh0ID0gdGhpcy5zdGF0ZS5zaG93Q29waWVkXG4gICAgICA/ICdDb3BpZWQnXG4gICAgICA6ICdTaGFyZSAmIEVtYmVkJ1xuXG4gICAgbGV0IGJ0blRleHQgPSAnUFVCTElTSCdcbiAgICBpZiAodGhpcy5zdGF0ZS5zbmFwc2hvdFNhdmVDb25maXJtZWQpIGJ0blRleHQgPSAnUFVCTElTSEVEJ1xuICAgIGlmICh0aGlzLnN0YXRlLmlzU25hcHNob3RTYXZlSW5Qcm9ncmVzcykgYnRuVGV4dCA9ICdQVUJMSVNISU5HJ1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgc3R5bGU9e1NUWUxFUy5mcmFtZX0gY2xhc3NOYW1lPSdmcmFtZSc+XG4gICAgICAgIDxQb3BvdmVyXG4gICAgICAgICAgcGxhY2U9J2JlbG93J1xuICAgICAgICAgIGlzT3Blbj17c2hvd1NoYXJlUG9wb3Zlcn1cbiAgICAgICAgICBzdHlsZT17e3pJbmRleDogMn19XG4gICAgICAgICAgYm9keT17XG4gICAgICAgICAgICA8UG9wb3ZlckJvZHlSYWRpdW1pemVkXG4gICAgICAgICAgICAgIHBhcmVudD17dGhpc31cbiAgICAgICAgICAgICAgdGl0bGVUZXh0PXt0aXRsZVRleHR9XG4gICAgICAgICAgICAgIHNuYXBzaG90U2F2ZUNvbmZpcm1lZD17dGhpcy5zdGF0ZS5zbmFwc2hvdFNhdmVDb25maXJtZWR9XG4gICAgICAgICAgICAgIGlzU25hcHNob3RTYXZlSW5Qcm9ncmVzcz17dGhpcy5zdGF0ZS5pc1NuYXBzaG90U2F2ZUluUHJvZ3Jlc3N9XG4gICAgICAgICAgICAgIGlzUHJvamVjdEluZm9GZXRjaEluUHJvZ3Jlc3M9e3RoaXMuc3RhdGUuaXNQcm9qZWN0SW5mb0ZldGNoSW5Qcm9ncmVzc31cbiAgICAgICAgICAgICAgbGlua0FkZHJlc3M9e3RoaXMuc3RhdGUubGlua0FkZHJlc3N9XG4gICAgICAgICAgICAgIGNsb3NlPXsoKSA9PiB0aGlzLnNldFN0YXRlKHsgc2hvd1NoYXJlUG9wb3ZlcjogZmFsc2UgfSl9IC8+XG4gICAgICAgICAgfT5cbiAgICAgICAgICA8YnV0dG9uIGtleT0nc2F2ZSdcbiAgICAgICAgICAgIGlkPSdwdWJsaXNoJ1xuICAgICAgICAgICAgb25DbGljaz17dGhpcy5oYW5kbGVTYXZlU25hcHNob3RDbGlja31cbiAgICAgICAgICAgIHN0eWxlPXtbXG4gICAgICAgICAgICAgIEJUTl9TVFlMRVMuYnRuVGV4dCxcbiAgICAgICAgICAgICAgQlROX1NUWUxFUy5yaWdodEJ0bnMsXG4gICAgICAgICAgICAgIHRoaXMuc3RhdGUuaXNTbmFwc2hvdFNhdmVJblByb2dyZXNzICYmIFNUWUxFUy5kaXNhYmxlZFxuICAgICAgICAgICAgXX0+XG4gICAgICAgICAgICB7dGhpcy5yZW5kZXJTbmFwc2hvdFNhdmVJbm5lckJ1dHRvbigpfTxzcGFuIHN0eWxlPXt7bWFyZ2luTGVmdDogN319PntidG5UZXh0fTwvc3Bhbj5cbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPC9Qb3BvdmVyPlxuXG4gICAgICAgIHt0aGlzLnJlbmRlck1lcmdlQ29uZmxpY3RSZXNvbHV0aW9uQXJlYSgpfVxuICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9e3RoaXMuaGFuZGxlQ29ubmVjdGlvbkNsaWNrfSBzdHlsZT17W0JUTl9TVFlMRVMuYnRuSWNvbiwgQlROX1NUWUxFUy5idG5JY29uSG92ZXIsIFNUWUxFUy5oaWRlXX0ga2V5PSdjb25uZWN0Jz5cbiAgICAgICAgICA8Q29ubmVjdGlvbkljb25TVkcgLz5cbiAgICAgICAgPC9idXR0b24+XG5cbiAgICAgICAgeyBmYWxzZSAmJlxuICAgICAgICAgIDxUb29sU2VsZWN0b3Igd2Vic29ja2V0PXt0aGlzLnByb3BzLndlYnNvY2tldH0gLz5cbiAgICAgICAgfVxuXG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cbn1cblxuU3RhZ2VUaXRsZUJhci5wcm9wVHlwZXMgPSB7XG4gIGZvbGRlcjogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICBwcm9qZWN0TmFtZTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcbiAgdXNlcm5hbWU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG4gIHBhc3N3b3JkOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuICB3ZWJzb2NrZXQ6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgY3JlYXRlTm90aWNlOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICByZW1vdmVOb3RpY2U6IFJlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIHJlY2VpdmVQcm9qZWN0SW5mbzogUmVhY3QuUHJvcFR5cGVzLmZ1bmNcbn1cblxuZXhwb3J0IGRlZmF1bHQgUmFkaXVtKFN0YWdlVGl0bGVCYXIpXG4iXX0=