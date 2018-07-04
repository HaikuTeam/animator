import * as Radium from 'radium';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {ipcRenderer, shell} from 'electron';
import * as assign from 'lodash.assign';
import {Experiment, experimentIsEnabled} from 'haiku-common/lib/experiments';
import Palette from 'haiku-ui-common/lib/Palette';
import * as Color from 'color';
import {BTN_STYLES} from '../styles/btnShared';
import Toggle from './Toggle';
import {ShareModal} from 'haiku-ui-common/lib/react/ShareModal';
import {
  ComponentIconSVG, ConnectionIconSVG, DangerIconSVG, EventsBoltIcon, PublishSnapshotSVG, WarningIconSVG,
} from 'haiku-ui-common/lib/react/OtherIcons';
import {ExporterFormat} from 'haiku-sdk-creator/lib/exporter';
import * as Element from 'haiku-serialization/src/bll/Element';
import * as ElementSelectionProxy from 'haiku-serialization/src/bll/ElementSelectionProxy';
import * as logger from 'haiku-serialization/src/utils/LoggerInstance';
import CannotSwitchToDesignPopup from './CodeEditor/CannotSwitchToDesignPopup';

const mixpanel = require('haiku-serialization/src/utils/Mixpanel');

const STYLES = {
  hide: {
    display: 'none',
  },
  frame: {
    backgroundColor: Palette.COAL,
    position: 'relative',
    top: 0,
    height: '36px',
    padding: '6px',
  },
  disabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
    pointerEvents: 'none',
  },
  sharePopover: {
    position: 'absolute',
    top: 34,
    backgroundColor: Palette.FATHER_COAL,
    width: 204,
    padding: '13px 9px',
    fontSize: 17,
    color: Palette.ROCK,
    textAlign: 'center',
    borderRadius: 4,
    boxShadow: '0 6px 25px 0 ' + Palette.FATHER_COAL,
  },
  popoverClose: {
    color: 'white',
    position: 'absolute',
    top: 5,
    right: 10,
    fontSize: 15,
    textTransform: 'lowercase',
  },
  footer: {
    backgroundColor: Color(Palette.DARK_GRAY).fade(0.7),
    height: 25,
    width: '100%',
    position: 'absolute',
    bottom: 0,
    fontSize: 10,
    borderBottomRightRadius: 3,
    borderBottomLeftRadius: 3,
    paddingTop: 5,
  },
  time: {
    fontWeight: 'bold',
    marginLeft: 5,
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
    backgroundColor: Palette.DARK_GRAY,
  },
  copyLoading: {
    paddingTop: 0,
    paddingBottom: 6,
    pointerEvents: 'none',
  },
  linkHolster: {
    height: 29,
    position: 'relative',
    borderRadius: 3,
    marginTop: 3,
    cursor: 'pointer',
    backgroundColor: Color(Palette.DARK_GRAY).fade(0.68),
    border: '1px solid ' + Palette.DARK_GRAY,
  },
  link: {
    fontSize: 10,
    color: Color(Palette.LIGHT_BLUE).lighten(0.37),
    position: 'absolute',
    left: 7,
    top: 7,
    cursor: 'pointer',
  },
  generatingLink: {
    color: Palette.ROCK,
    cursor: 'default',
    fontStyle: 'italic',
  },
  previewToggle: {
    float: 'right',
  },
  popupNotice: {
    display: 'inline-block',
    marginTop: '10px',
    fontSize: '13px',
    fontStyle: 'oblique',
  },
  link2: {
    color: Palette.LIGHT_BLUE,
    cursor: 'pointer',
  },
  toggleHolster: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: 3,
    backgroundColor: Palette.LIGHTEST_PINK,
  },
};

const SNAPSHOT_SAVE_RESOLUTION_STRATEGIES = {
  normal: {strategy: 'recursive', favor: 'ours'},
  ours: {strategy: 'ours'},
  theirs: {strategy: 'theirs'},
};

const MAX_SYNDICATION_CHECKS = 48;
const SYNDICATION_CHECK_INTERVAL = 2500;

class StageTitleBar extends React.Component {
  constructor (props) {
    super(props);

    this.handleConnectionClick = this.handleConnectionClick.bind(this);
    this.handleSaveSnapshotClick = this.handleSaveSnapshotClick.bind(this);
    this.handleMergeResolveOurs = this.handleMergeResolveOurs.bind(this);
    this.handleMergeResolveTheirs = this.handleMergeResolveTheirs.bind(this);
    this.handleShowEventHandlersEditor = this.handleShowEventHandlersEditor.bind(this);
    this.handleConglomerateComponent = this.handleConglomerateComponent.bind(this);
    this.handleShowProjectLocationToast = this.handleShowProjectLocationToast.bind(this);
    this.handleGlobalMenuSave = this.handleGlobalMenuSave.bind(this);
    this.handleSaveOnRawCodeEditor = this.handleSaveOnRawCodeEditor.bind(this);
    this.handleSaveOnGlass = this.handleSaveOnGlass.bind(this);

    this._isMounted = false;

    this.state = {
      snapshotSaveResolutionStrategyName: 'normal',
      isSnapshotSaveInProgress: false,
      snapshotMergeConflicts: null,
      snapshotSaveConfirmed: null,
      snapshotSaveError: null,
      showSharePopover: false,
      copied: false,
      linkAddress: 'Fetching Info',
      semverVersion: '0.0.0',
      showCopied: false,
      projectInfo: {},
      snapshotSyndicated: true,
      snapshotPublished: true,
    };

    ipcRenderer.on('global-menu:save', () => {
      if (!this._isMounted) {
        return;
      }

      if (this.props.showGlass) {
        this.handleSaveOnGlass();
      } else {
        this.handleSaveOnRawCodeEditor();
      }
    });
  }

  componentDidMount () {
    this._isMounted = true;

    // It's kind of weird to have this heartbeat logic buried all the way down here inside StateTitleBar;
    // it probably should be moved up to the Creator level so it's easier to find #FIXME
    this._fetchMasterStateInterval = setInterval(() => {
      if (this.props.projectModel) {
        return this.props.projectModel.masterHeartbeat((heartbeatErr, masterState) => {
          if (heartbeatErr || !masterState) {
            // If master disconnects we might not even get an error, so create a fake error in its place
            if (!heartbeatErr) {
              // tslint:disable-next-line:no-parameter-reassignment
              heartbeatErr = new Error('Unknown problem with master heartbeat');
            }
            logger.error(heartbeatErr);

            // If master has disconnected, stop running this interval so we don't get pulsing error messages
            clearInterval(this._fetchMasterStateInterval);

            // But the first time we get this, display a user notice - they probably need to restart Haiku to get
            // into a better state, at least until we can resolve what the cause of this problem is
            return this.props.createNotice({
              type: 'danger',
              title: 'Uh oh!',
              message: 'Haiku is having a problem accessing your project. 😢 Please restart Haiku. If you see this error again, contact Haiku for support.',
            });
          }

          ipcRenderer.send('topmenu:update', {
            isProjectOpen: !!masterState.folder,
            isSaving: !!masterState.isSaving,
            subComponents: this.props.projectModel.describeSubComponents(),
          });
        });
      }
    }, 1000);

    document.addEventListener('mouseup', (e) => {
      if (this._shareModal && this.state.showSharePopover) {
        const node = ReactDOM.findDOMNode(this._shareModal);
        const pnode = ReactDOM.findDOMNode(this);
        if (!node.contains(e.target) && !pnode.contains(e.target)) {
          this.setState({
            showSharePopover: false,
            isSnapshotSaveInProgress: false,
            snapshotSyndicated: true,
            snapshotPublished: true,
          });
          this.clearSyndicationChecks();
        }
      }
    });

    ipcRenderer.on('global-menu:publish', this.handleGlobalMenuSave);
  }

  componentWillUnmount () {
    this._isMounted = false;
    clearInterval(this._fetchMasterStateInterval);
    ipcRenderer.removeListener('global-menu:publish', this.handleGlobalMenuSave);
    this.clearSyndicationChecks();
  }

  handleGlobalMenuSave () {
    if (!this._isMounted) {
      return;
    }

    this.handleSaveSnapshotClick();
  }

  handleShowProjectLocationToast () {
    if (!this._isMounted) {
      return;
    }

    const noticeNotice = this.props.createNotice({
      type: 'info',
      title: 'Snapshot saved',
      message: (
        <p>
          <span
            style={STYLES.link2}
            onClick={() => {
              shell.showItemInFolder(this.props.folder);
            }}
          >
            View in Finder
          </span>
        </p>
      ),
    });

    window.setTimeout(() => {
      this.props.removeNotice(undefined, noticeNotice.id);
    }, 2500);
  }

  handleConnectionClick () {
    // TODO
  }

  getProjectSaveOptions () {
    return {
      commitMessage: 'Changes saved (via Haiku Desktop)',
      saveStrategy: SNAPSHOT_SAVE_RESOLUTION_STRATEGIES[this.state.snapshotSaveResolutionStrategyName],
      exporterFormats: [ExporterFormat.Bodymovin, ExporterFormat.HaikuStatic],
    };
  }

  handleSaveOnRawCodeEditor () {
    this.props.saveCodeFromEditorToDisk();
  }

  handleSaveOnGlass () {
    const noticeNotice = this.props.createNotice({
      type: 'info',
      title: 'Snapshot saved',
      message: (
        <p>
          <span
            style={STYLES.link2}
            onClick={() => {
              shell.showItemInFolder(this.props.folder);
            }}
          >
            View in Finder
          </span>
        </p>
      ),
    });

    window.setTimeout(() => {
      this.props.removeNotice(undefined, noticeNotice.id);
    }, 2500);
  }

  handleSaveSnapshotClick () {
    if (this.state.snapshotSaveError) {
      return void (0);
    }
    if (this.state.isSnapshotSaveInProgress) {
      return void (0);
    }
    if (this.state.snapshotMergeConflicts) {
      return void (0);
    }

    this.setState({showSharePopover: true});

    mixpanel.haikuTrack('install-options', {
      from: 'app',
      event: 'show-all-options',
    });

    return this.performProjectSave();
  }

  withProjectInfo (otherObject) {
    const proj = this.state.projectInfo || {};
    return assign({}, otherObject, {
      organization: proj.organizationName,
      uuid: proj.projectUid,
      sha: proj.sha,
      branch: proj.branchName,
    });
  }

  requestSaveProject (cb) {
    if (this.props.projectModel) {
      return this.props.projectModel.saveProject(this.props.project.projectName, this.props.username, this.props.password, this.getProjectSaveOptions(), cb);
    }
  }

  clearSyndicationChecks () {
    clearInterval(this._performSyndicationCheckInterval);
  }

  performSyndicationCheck () {
    this.syndicationChecks++;
    if (this.props.projectModel) {
      return this.props.projectModel.requestSyndicationInfo((err, info) => {
        if (err || !info || info.status.errored) {
          this.props.createNotice({
            type: 'danger',
            title: 'Uh oh!',
            message: 'We were unable to publish your project. 😢 Please try again in a bit. If you see this error again, contact Haiku for support.',
          });
          this.clearSyndicationChecks();
          return this.setState({
            showSharePopover: false,
            isSnapshotSaveInProgress: false,
            snapshotSyndicated: undefined,
            snapshotPublished: undefined,
          });
        }

        // Avoid races with button display while aborting publish by only setting values that have become true.
        const newState = {
          projectInfo: info,
        };

        if (info.status.syndicated) {
          newState.snapshotSyndicated = true;
        }

        if (info.status.published) {
          newState.snapshotPublished = true;
        }

        this.setState(newState);

        if ((info.status.syndicated && info.status.published) || this.syndicationChecks >= MAX_SYNDICATION_CHECKS) {
          this.clearSyndicationChecks();
        }

        if (this.syndicationChecks >= MAX_SYNDICATION_CHECKS && (!info.status.syndicated || !info.status.published)) {
          // If we timed out without noting syndication or publication, set these values to `undefined` so we can lower
          // expectations in the downstream UI.
          this.setState({
            snapshotSyndicated: info.status.syndicated || undefined,
            snapshotPublished: info.status.published || undefined,
          });
        }
      });
    }
  }

  performProjectSave () {
    mixpanel.haikuTrack('creator:project:saving', this.withProjectInfo({
      username: this.props.username,
      project: this.props.projectName,
    }));
    this.setState({isSnapshotSaveInProgress: true, snapshotSyndicated: false, snapshotPublished: false});

    return this.requestSaveProject((snapshotSaveError, snapshotData) => {
      // If we aborted early, don't start polling.
      if (!this.state.showSharePopover) {
        return;
      }

      if (snapshotSaveError) {
        logger.error(snapshotSaveError);
        return this.setState({isSnapshotSaveInProgress: false, snapshotSaveResolutionStrategyName: 'normal', snapshotSaveError}, () => {
          return setTimeout(() => this.setState({snapshotSaveError: null}), 2000);
        });
      }

      this.setState({
        isSnapshotSaveInProgress: false,
        snapshotSaveConfirmed: true,
        projectInfo: snapshotData,
      });

      if (snapshotData) {
        if (snapshotData.conflicts) {
          logger.warn('[creator] merge conflicts found');
          this.props.createNotice({
            type: 'warning',
            title: 'Merge conflicts!',
            message: 'We couldn\'t merge your changes. 😢 You\'ll need to decide how to merge your changes before continuing.',
          });
          return this.setState({
            snapshotMergeConflicts: snapshotData.conflicts,
            showSharePopover: false,
          });
        }

        logger.info('[creator] save complete', snapshotData);

        // Unless we set back to normal, subsequent saves will still be set to use the strict ours/theirs strategy,
        // which will clobber updates that we might want to actually merge gracefully.
        this.setState({snapshotSaveResolutionStrategyName: 'normal'});

        if (snapshotData.shareLink) {
          this.setState({linkAddress: snapshotData.shareLink});
        }

        if (snapshotData.semverVersion) {
          this.setState({semverVersion: snapshotData.semverVersion});
        }

        if (snapshotData.status && snapshotData.status.published) {
          this.setState({snapshotPublished: true});
        }

        if (snapshotData.status && snapshotData.status.syndicated) {
          this.setState({snapshotSyndicated: true});
        } else {
          this.syndicationChecks = 0;
          this._performSyndicationCheckInterval = setInterval(() => {
            this.performSyndicationCheck();
          }, SYNDICATION_CHECK_INTERVAL);
        }

        mixpanel.haikuTrack('creator:project:saved', this.withProjectInfo({
          username: this.props.username,
          project: this.props.projectName,
        }));
      }

      return setTimeout(() => this.setState({snapshotSaveConfirmed: false}), 2000);
    });
  }

  renderSnapshotSaveInnerButton () {
    if (this.state.snapshotSaveError) {
      return <div style={{height: 18, marginRight: -5}}><DangerIconSVG fill="transparent" /></div>;
    }
    if (this.state.snapshotMergeConflicts) {
      return <div style={{height: 19, marginRight: 0, marginTop: -2}}><WarningIconSVG fill="transparent" color={Palette.ORANGE} /></div>;
    }
    return <PublishSnapshotSVG />;
  }

  handleMergeResolveOurs () {
    this.setState({snapshotMergeConflicts: null, snapshotSaveResolutionStrategyName: 'ours'}, () => {
      return this.performProjectSave();
    });
  }

  handleMergeResolveTheirs () {
    this.setState({snapshotMergeConflicts: null, snapshotSaveResolutionStrategyName: 'theirs'}, () => {
      return this.performProjectSave();
    });
  }

  getActiveComponent () {
    return this.props.projectModel && this.props.projectModel.getCurrentActiveComponent();
  }

  fetchProxyElementForSelection () {
    const component = this.getActiveComponent();

    if (component) {
      const selection = Element.where({component, _isSelected: true});
      return ElementSelectionProxy.fromSelection(selection, {component});
    }
  }

  isConglomerateComponentAvailable () {
    const proxy = this.fetchProxyElementForSelection();
    return proxy && (proxy.canCreateComponentFromSelection() || proxy.canEditComponentFromSelection());
  }

  getConglomerateComponentButtonColor () {
    const proxy = this.fetchProxyElementForSelection();
    if (proxy) {
      if (proxy.canEditComponentFromSelection()) {
        return Palette.LIGHT_BLUE;
      }
    }
  }

  handleConglomerateComponent () {
    if (this.isConglomerateComponentAvailable()) {
      const proxy = this.fetchProxyElementForSelection();

      if (proxy.canEditComponentFromSelection()) {
        this.props.websocket.send({
          type: 'broadcast',
          from: 'creator',
          name: 'edit-component',
          folder: this.props.projectModel.getFolder(), // required when sent via Creator
        });
      } else if (proxy.canCreateComponentFromSelection()) {
        this.props.websocket.send({
          type: 'broadcast',
          from: 'creator',
          name: 'conglomerate-component',
          folder: this.props.projectModel.getFolder(), // required when sent via Creator
        });
      }
    }
  }

  isEventHandlersEditorAvailable () {
    const proxy = this.fetchProxyElementForSelection();
    // If nothing is selected, assume the user wants to add events to the artboard
    return proxy && (proxy.doesManageSingleElement() || proxy.hasNothingInSelection());
  }

  handleShowEventHandlersEditor () {
    if (this.isEventHandlersEditorAvailable()) {
      const element = this.getProxySelectionElement();

      if (element) {
        mixpanel.haikuTrack('creator:top-controls:show-event-handlers-editor');

        this.props.websocket.send({
          type: 'broadcast',
          from: 'creator',
          name: 'show-event-handlers-editor',
          folder: this.props.projectModel.getFolder(), // required when sent via Creator
          elid: element.getPrimaryKey(),
          opts: {},
          frame: null,
        });
      }
    }
  }

  getProxySelectionElement () {
    let element = this.fetchProxyElementForSelection().selection[0];

    // Fallback to the artboard element if nothing is currently selected
    if (!element) {
      element = this.getActiveComponent().getArtboard().getElement();
    }

    return element;
  }

  getEventHandlersEditorButtonColor () {
    const proxy = this.fetchProxyElementForSelection();

    if (proxy) {
      if (proxy.doesManageSingleElement() || proxy.hasNothingInSelection()) {
        const element = this.getProxySelectionElement();

        if (element && element.hasVisibleEventHandlers()) {
          return Color(Palette.LIGHT_BLUE).lighten(0.37);
        }
      }
    }
  }

  renderMergeConflictResolutionArea () {
    if (!this.state.snapshotMergeConflicts) {
      return '';
    }
    return (
      <div style={{position: 'absolute', left: 0, right: 150, top: 4, padding: 5, borderRadius: 4, color: Palette.ROCK, textAlign: 'right', overflow: 'hidden'}}>
        Conflict found!{' '}
        <a onClick={this.handleMergeResolveOurs} style={{cursor: 'pointer', textDecoration: 'underline', color: Palette.GREEN}}>Force your changes</a>{' '}
        or <a onClick={this.handleMergeResolveTheirs} style={{cursor: 'pointer', textDecoration: 'underline', color: Palette.RED}}>discard yours &amp; accept theirs</a>?
      </div>
    );
  }

  render () {
    const projectInfo = this.withProjectInfo({});

    let btnText = 'PUBLISH';
    if (this.state.snapshotSyndicated === false || this.state.snapshotPublished === false) {
      btnText = 'PUBLISHING';
    }

    return (
      <div style={STYLES.frame} className="frame">
        {this.isConglomerateComponentAvailable() &&
          <button
            key="conglomerate-component-button"
            id="conglomerate-component-button"
            onClick={this.handleConglomerateComponent}
            style={[
              BTN_STYLES.btnIcon,
              BTN_STYLES.leftBtns,
            ]}>
            <ComponentIconSVG color={this.getConglomerateComponentButtonColor()} />
          </button>
        }

        {this.isEventHandlersEditorAvailable() &&
          <button
            key="show-event-handlers-editor-button"
            id="show-event-handlers-editor-button"
            title="Edit element Actions"
            onClick={this.handleShowEventHandlersEditor}
            style={[
              BTN_STYLES.btnIcon,
              BTN_STYLES.leftBtns,
            ]}>
            <EventsBoltIcon color={this.getEventHandlersEditorButtonColor()} />
          </button>
        }
        {this.props.showPopupCannotSwitchToDesign &&
          <CannotSwitchToDesignPopup
            closePopupCannotSwitchToDesign={this.props.closePopupCannotSwitchToDesign}
          />
        }
        {experimentIsEnabled(Experiment.CodeEditor) &&
          <div style={STYLES.toggleHolster}>
            <button
              key="toggle-design"
              id="toggle-design"
              onClick={this.props.onSwitchToDesignMode}
              style={[
                BTN_STYLES.btnText,
                BTN_STYLES.centerBtns,
                {
                  display: 'inline-block',
                  marginRight: '0px',
                  borderBottomRightRadius: 0,
                  borderTopRightRadius: 0,
                  ':hover': {
                    backgroundColor: Color(Palette.DARKEST_COAL).darken(.3),
                  },
                }]}>
              <span style={{marginLeft: 7}}>DESIGN</span>
              {this.props.showGlass && <span style={STYLES.activeIndicator}/>}
            </button>

            <button
              key="toggle-code"
              id="toggle-code"
              onClick={this.props.onSwitchToCodeMode}
              style={[
                BTN_STYLES.btnText,
                BTN_STYLES.centerBtns,
                {
                  display: 'inline-block',
                  marginRight: '0px',
                  borderBottomLeftRadius: 0,
                  borderTopLeftRadius: 0,
                  ':hover': {
                    backgroundColor: Color(Palette.DARKEST_COAL).darken(.3),
                  },
                }]}>
              <span style={{marginLeft: 7}}>CODE</span>
              {!this.props.showGlass && <span style={STYLES.activeIndicator} />}
            </button>
          </div>
        }

        <button
          key="save"
          id="publish"
          title="Publish project"
          onClick={this.handleSaveSnapshotClick}
          disabled={!this.props.isTimelineReady && this.state.snapshotSyndicated === false}
          style={[
            BTN_STYLES.btnText,
            BTN_STYLES.rightBtns,
            this.state.snapshotSyndicated === false && STYLES.disabled,
            !this.props.isTimelineReady && STYLES.disabled,
          ]}
        >
          {this.renderSnapshotSaveInnerButton()}<span style={{marginLeft: 7}}>{btnText}</span>
        </button>

        <Toggle
          onToggle={this.props.onPreviewModeToggled}
          style={STYLES.previewToggle}
          disabled={!this.props.isTimelineReady}
          active={this.props.isPreviewMode}
        />

        {this.renderMergeConflictResolutionArea()}
        <button onClick={this.handleConnectionClick} style={[BTN_STYLES.btnIcon, BTN_STYLES.btnIconHover, STYLES.hide]} key="connect">
          <ConnectionIconSVG />
        </button>

        {this.state.showSharePopover && !this.props.isPreviewMode &&
          <ShareModal
            envoyProject={this.props.envoyProject}
            project={this.props.project}
            snapshotSaveConfirmed={this.state.snapshotSaveConfirmed}
            isSnapshotSaveInProgress={this.state.isSnapshotSaveInProgress}
            linkAddress={this.state.linkAddress}
            semverVersion={this.state.semverVersion}
            error={this.state.snapshotSaveError}
            snapshotSyndicated={this.state.snapshotSyndicated}
            snapshotPublished={this.state.snapshotPublished}
            userName={this.props.username}
            organizationName={this.props.organizationName}
            ref={(el) => {
              this._shareModal = el;
            }}
            projectUid={projectInfo.uuid}
            sha={projectInfo.sha}
            mixpanel={mixpanel}
            onProjectPublicChange={this.props.onProjectPublicChange}
          />
        }
      </div>
    );
  }
}

StageTitleBar.propTypes = {
  folder: React.PropTypes.string.isRequired,
  projectName: React.PropTypes.string,
  username: React.PropTypes.string,
  password: React.PropTypes.string,
  organizationName: React.PropTypes.string,
  websocket: React.PropTypes.object.isRequired,
  createNotice: React.PropTypes.func.isRequired,
  removeNotice: React.PropTypes.func.isRequired,
  receiveProjectInfo: React.PropTypes.func,
};

export default Radium(StageTitleBar);
