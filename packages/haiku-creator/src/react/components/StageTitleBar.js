import * as Radium from 'radium';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {ipcRenderer, shell} from 'electron';
import {ErrorCode} from '@haiku/sdk-inkstone/lib/errors';
import {Experiment, experimentIsEnabled} from 'haiku-common/lib/experiments';
import {EXPORTER_CHANNEL} from 'haiku-sdk-creator/lib/exporter';
import Palette from 'haiku-ui-common/lib/Palette';
import * as Color from 'color';
import {BTN_STYLES} from '../styles/btnShared';
import Toggle from './Toggle';
import {PublicPrivateOptInModal} from './PublicPrivateOptInModal';
import {ShareModal} from 'haiku-ui-common/lib/react/ShareModal';
import {
  EyeIconSVG, ComponentIconSVG, ConnectionIconSVG, DangerIconSVG, EventsBoltIcon, PublishSnapshotSVG, WarningIconSVG,
} from 'haiku-ui-common/lib/react/OtherIcons';
import * as Element from 'haiku-serialization/src/bll/Element';
import * as ElementSelectionProxy from 'haiku-serialization/src/bll/ElementSelectionProxy';
import * as logger from 'haiku-serialization/src/utils/LoggerInstance';
import {ProjectError} from 'haiku-sdk-creator/lib/bll/Project';
import {
  isPreviewMode,
  isEditMode,
  isCodeEditorMode,
  showGlassOnStage,
} from 'haiku-ui-common/lib/interactionModes';
import AlignToolBox from './AlignToolBox';

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
    minWidth: 500,
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
    zIndex: 1,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: 3,
    backgroundColor: Palette.LIGHTEST_PINK,
  },
  activeIndicatorLeft: {
    borderBottomLeftRadius: 4,
  },
  activeIndicatorRight: {
    borderBottomRightRadius: 4,
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
    this.handleShowEventHandlersEditor = this.handleShowEventHandlersEditor.bind(this);
    this.handleConglomerateComponent = this.handleConglomerateComponent.bind(this);
    this.handleShowProjectLocationToast = this.handleShowProjectLocationToast.bind(this);
    this.handleGlobalMenuSave = this.handleGlobalMenuSave.bind(this);
    this.handleSaveOnRawCodeEditor = this.handleSaveOnRawCodeEditor.bind(this);
    this.handleSaveOnGlass = this.handleSaveOnGlass.bind(this);

    this._isMounted = false;

    this.state = {
      snapshotSaveResolutionStrategyName: 'normal',
      forceDisablePrivate: false,
      isSnapshotSaveInProgress: false,
      snapshotSaveConfirmed: null,
      snapshotSaveError: null,
      showSharePopover: false,
      showPublicPrivateOptInModal: false,
      privateProjectCount: null,
      saveProjectContinue: () => {},
      copied: false,
      linkAddress: 'Fetching Info',
      semverVersion: '0.0.0',
      showCopied: false,
      shareUrls: {},
      snapshotSyndicated: true,
    };

    ipcRenderer.on('global-menu:save', () => {
      // Skip if event handler editor is open
      if (!this._isMounted || this.props.showEventHandlerEditor) {
        return;
      }

      if (showGlassOnStage(this.props.interactionMode)) {
        this.handleSaveOnGlass();
      } else {
        this.handleSaveOnRawCodeEditor();
      }
    });
  }

  hideShareModal = () => {
    this.setState({
      showSharePopover: false,
      isSnapshotSaveInProgress: false,
      snapshotSyndicated: true,
      snapshotSaveError: null,
    });
  };

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
              message: 'Animator is having a problem accessing your project. 😢  Please restart Animator. If you see this error again, contact Haiku for support.',
            });
          }

          ipcRenderer.send('topmenu:update', {
            isSaving: !!masterState.isSaving,
            ...this.props.projectModel.describeTopMenu(),
          });
        });
      }
    }, 1000);

    this.closeListener = (e) => {
      if (this._shareModal && this.state.showSharePopover) {
        const node = ReactDOM.findDOMNode(this._shareModal);
        const pnode = ReactDOM.findDOMNode(this);
        if (!node.contains(e.target) && !pnode.contains(e.target)) {
          this.hideShareModal();
          this.clearSyndicationChecks();
        }
      }
    };

    document.addEventListener('mouseup', this.closeListener);

    ipcRenderer.on('global-menu:publish', this.handleGlobalMenuSave);
  }

  componentWillUnmount () {
    this._isMounted = false;
    clearInterval(this._fetchMasterStateInterval);
    ipcRenderer.removeListener('global-menu:publish', this.handleGlobalMenuSave);
    document.removeEventListener('mouseup', this.closeListener);
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
      if (noticeNotice) {
        this.props.removeNotice(undefined, noticeNotice.id);
      }
    }, 2500);
  }

  handleConnectionClick () {
    // TODO
  }

  getProjectSaveOptions () {
    return {
      saveStrategy: SNAPSHOT_SAVE_RESOLUTION_STRATEGIES[this.state.snapshotSaveResolutionStrategyName],
    };
  }

  handleSaveOnRawCodeEditor () {
    this.props.saveCodeFromEditorToDisk();
  }

  handleSaveOnGlass () {
    const noticeNotice = this.props.createNotice({
      type: 'info',
      title: 'No need to save!',
      message: 'Animator saves your work automatically',
    });

    window.setTimeout(() => {
      if (noticeNotice) {
        this.props.removeNotice(undefined, noticeNotice.id);
      }
    }, 2500);
  }

  handleSaveSnapshotClick () {
    if (this.state.snapshotSaveError) {
      return void (0);
    }
    if (this.state.isSnapshotSaveInProgress) {
      return void (0);
    }

    mixpanel.haikuTrack('install-options', {
      from: 'app',
      event: 'show-all-options',
    });

    return this.performProjectSave();
  }

  showGenericPublishError () {
    this.props.createNotice({
      type: 'danger',
      title: 'Uh oh!',
      message: 'We were unable to publish your project. 😢 Please make sure you are connected to the internet.',
    });
  }

  showSharePopover (cb) {
    this.setState(
      {
        showPublicPrivateOptInModal: false,
        showSharePopover: true,
        isSnapshotSaveInProgress: true,
        snapshotSyndicated: false,
      },
      () => {
        this.props.projectModel.saveProject(this.props.project, this.getProjectSaveOptions(), cb);
      },
    );
  }

  requestSaveProject (cb) {
    if (this.props.projectModel) {
      // We might come back to this later!
      this.setState({forceDisablePrivate: false});
      this.props.envoyProject.getProjectsList().then((list) => {
        this.setState({
          privateProjectCount: list.filter((project) => !project.isPublic).length,
        }, () => {
          // If the project already has a repository URL, this means the user has already confirmed their project's
          // privacy settings. Prior to 3.5.2, we presented this field during project creation in Creator; as of 3.5.2,
          // we explicit defer Caudex backing during project creation, ensuring there won't be a repository URL _until_
          // this step.
          if (!this.props.project.repositoryUrl) {
            // The user needs to set up public/private first.
            this.setState({
              showPublicPrivateOptInModal: true,
              saveProjectContinue: () => {
                this.showSharePopover(cb);
              },
            });
            return;
          }

          // If we have a private project limit and the project is private, we have to first check if any updates will
          // be permitted.
          if (typeof this.props.privateProjectLimit === 'number' && !this.props.project.isPublic) {
            this.props.envoyProject.updateProject(this.props.project).then(() => this.showSharePopover(cb)).catch((error) => {
              switch (error.message) {
                case ErrorCode.ErrorCodePrivilegesPrivateProjectLimitExceeded:
                  this.setState({
                    forceDisablePrivate: true,
                    showPublicPrivateOptInModal: true,
                    saveProjectContinue: () => {
                      this.showSharePopover(cb);
                    },
                  });
                  break;
                default:
                  this.showGenericPublishError();
                  break;
              }
            });
          } else {
            // We can go straight to the publish modal.
            this.showSharePopover(cb);
          }
        });
      }).catch(() => {
        this.showGenericPublishError();
      });
    }
  }

  clearSyndicationChecks () {
    clearInterval(this._performSyndicationCheckInterval);
  }

  performSyndicationCheck () {
    this.syndicationChecks++;
    this.props.envoyProject.getSnapshotInfo().then(({snapshotSyndicated, shareUrls}) => {
      const newState = {shareUrls};
      // Avoid races with button display while aborting publish by only setting values that have become true.
      // #FIXME: do we still need this?
      if (snapshotSyndicated) {
        newState.snapshotSyndicated = snapshotSyndicated;
        this.clearSyndicationChecks();
      } else if (this.syndicationChecks >= MAX_SYNDICATION_CHECKS) {
        newState.snapshotSyndicated = undefined;
        this.clearSyndicationChecks();
      }
      this.setState(newState);
    }).catch(() => {
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
      });
    });
  }

  performProjectSave () {
    mixpanel.haikuTrack('creator:project:saving', {
      username: this.props.username,
      project: this.props.projectName,
    });

    return this.requestSaveProject((snapshotSaveError, snapshotData) => {
      // If we aborted early, don't start polling.
      if (!this.state.showSharePopover) {
        return;
      }

      if (snapshotSaveError) {
        switch (snapshotSaveError.code) {
          case ProjectError.PublicOptInRequired:
            // This should never happen.
            this.setState({
              isSnapshotSaveInProgress: false,
            });
            return;
          default:
            // #FIXME: uses legacy error handling.
            if (snapshotSaveError.conflicts) {
              logger.warn('[creator] merge conflicts found');
              this.props.createNotice({
                type: 'warning',
                title: 'Problem saving!',
                message: 'We couldn\'t save your changes. 😢 Please contact Haiku Support.',
              });
              return this.setState({
                showSharePopover: false,
              });
            }

            logger.error(snapshotSaveError);
            this.setState({isSnapshotSaveInProgress: false, snapshotSaveResolutionStrategyName: 'normal', snapshotSaveError, linkAddress: 'n/a'});
            return;
        }
      }

      this.setState({
        isSnapshotSaveInProgress: false,
        snapshotSaveConfirmed: true,
      });

      if (snapshotData) {
        logger.info('[creator] save complete', snapshotData);

        // Unless we set back to normal, subsequent saves will still be set to use the strict ours/theirs strategy,
        // which will clobber updates that we might want to actually merge gracefully.
        this.setState({
          // snapshotData should be endowed with these state variables:
          //   - linkAddress
          //   - semverVersion
          //   - snapshotSyndicated
          //   - shareUrls {}
          ...snapshotData,
          snapshotSaveResolutionStrategyName: 'normal',
        });

        if (!snapshotData.snapshotSyndicated) {
          this.syndicationChecks = 0;
          this._performSyndicationCheckInterval = setInterval(() => {
            this.performSyndicationCheck();
          }, SYNDICATION_CHECK_INTERVAL);

          if (this.props.envoyExporter) {
            this.abortSyndicationCheck = () => {
              this.setState({snapshotSyndicated: undefined});
              this.clearSyndicationChecks();
              this.props.envoyExporter.off(`${EXPORTER_CHANNEL}:abort`, this.abortSyndicationCheck);
              this.props.createNotice({
                type: 'danger',
                title: 'Uh oh!',
                message: 'Not all assets were published successfully. 😢  If you see this error again, contact Haiku for support.',
              });
            };

            this.props.envoyExporter.on(`${EXPORTER_CHANNEL}:abort`, this.abortSyndicationCheck);
          }
        }

        mixpanel.haikuTrack('creator:project:saved', {
          username: this.props.username,
          project: this.props.projectName,
        });
      }

      return setTimeout(() => this.setState({snapshotSaveConfirmed: false}), 2000);
    });
  }

  renderSnapshotSaveInnerButton () {
    if (this.state.snapshotSaveError) {
      return <div style={{height: 18, marginRight: -5}}><DangerIconSVG fill="transparent" /></div>;
    }
    return <PublishSnapshotSVG />;
  }

  getActiveComponent () {
    return this.props.projectModel && this.props.projectModel.getCurrentActiveComponent();
  }

  fetchProxyElementForSelection () {
    const component = this.getActiveComponent();
    if (component) {
      return ElementSelectionProxy.fromSelection(Element.where({component, _isSelected: true}), component);
    }
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
    const proxy = this.fetchProxyElementForSelection();

    if (proxy.canEditComponentFromSelection()) {
      this.props.websocket.send({
        type: 'broadcast',
        from: 'creator',
        name: 'edit-component',
        folder: this.props.projectModel.getFolder(), // required when sent via Creator
      });
    } else {
      this.props.conglomerateComponent({
        isBlankComponent: proxy.selection.length === 0,
        skipInstantiateInHost: proxy.selection.length === 0,
      });
    }
  }

  isEventHandlersEditorAvailable () {
    const proxy = this.fetchProxyElementForSelection();
    // If nothing is selected, assume the user wants to add events to the artboard
    return proxy && (proxy.doesManageSingleElement() || proxy.hasNothingInSelection());
  }

  isAlignPanelAvailable () {
    // This would show the align panel only when elements are selected:
    // const proxy = this.fetchProxyElementForSelection();
    // return proxy && !proxy.hasNothingInSelection();
    // But it feels better (in zb's opinion at authoring time) to keep it shown at all times glass is shown
    return showGlassOnStage(this.props.interactionMode);
  }

  handleShowEventHandlersEditor () {
    if (this.isEventHandlersEditorAvailable()) {
      const element = this.getProxySelectionElement();

      if (element) {
        mixpanel.haikuTrack('creator:top-controls:show-event-handlers-editor');

        this.props.onShowEventHandlerEditor(element.getPrimaryKey(), {}, null);
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

  get conglomerateComponentButton () {
    return (
      <button
        key="conglomerate-component-button"
        id="conglomerate-component-button"
        aria-label="Create a new Component"
        data-tooltip={true}
        data-tooltip-bottom-right={true}
        onClick={this.handleConglomerateComponent}
        style={[
          BTN_STYLES.btnIcon,
          BTN_STYLES.leftBtns,
        ]}>
        <ComponentIconSVG color={this.getConglomerateComponentButtonColor()} />
      </button>
    );
  }

  get eventHandlerEditorButton () {
    if (this.isEventHandlersEditorAvailable()) {
      return (
        <button
          key="show-event-handlers-editor-button"
          id="show-event-handlers-editor-button"
          aria-label="Edit element Actions"
          data-tooltip={true}
          data-tooltip-bottom-right={true}
          onClick={this.handleShowEventHandlersEditor}
          style={[
            BTN_STYLES.btnIcon,
            BTN_STYLES.leftBtns,
          ]}>
          <EventsBoltIcon color={this.getEventHandlersEditorButtonColor()} />
        </button>
      );
    }
  }

  render () {
    const isEditModeActive = isEditMode(this.props.interactionMode);
    const isCodeModeActive = isCodeEditorMode(this.props.interactionMode);
    let btnText = 'PUBLISH';
    if (this.state.snapshotSyndicated === false) {
      btnText = 'PUBLISHING';
    }

    return (
      <div style={STYLES.frame} className="frame">
        {isEditModeActive && [
          this.conglomerateComponentButton,
          this.eventHandlerEditorButton,
        ]}

        {this.isAlignPanelAvailable() && <AlignToolBox
          websocket={this.props.websocket}
          projectModel={this.props.projectModel}
        />}

        {experimentIsEnabled(Experiment.CodeEditor) &&
          <div style={STYLES.toggleHolster}>
            <button
              key="toggle-design"
              id="toggle-design"
              aria-label="Switch to Design Mode"
              data-tooltip={!isEditModeActive}
              data-tooltip-bottom={!isEditModeActive}
              onClick={this.props.tryToSwitchToEditMode}
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
              {isEditModeActive && <span style={{...STYLES.activeIndicator, ...STYLES.activeIndicatorLeft}} />}
            </button>

            <button
              key="toggle-code"
              id="toggle-code"
              aria-label="Switch to Code Mode"
              data-tooltip={!isCodeModeActive}
              data-tooltip-bottom={!isCodeModeActive}
              onClick={this.props.setGlassInteractionToCodeEditorMode}
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
              {isCodeModeActive && <span style={{...STYLES.activeIndicator, ...STYLES.activeIndicatorRight}} />}
            </button>
          </div>
        }

        <button
          key="save"
          id="publish"
          aria-label="Publish project"
          data-tooltip={true}
          data-tooltip-bottom={true}
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
        <button
          key="toggle-preview"
          id="preview"
          aria-label="Publish project"
          aria-label="Toggle preview"
          onClick={this.props.onPreviewModeToggled}
          disabled={!this.props.isTimelineReady}
          style={[
            BTN_STYLES.btnIcon,
            BTN_STYLES.rightBtns,
            {border: '1px solid ' + Palette.COAL, padding: '4px 5px'},
            !this.props.isTimelineReady && STYLES.disabled,
            isPreviewMode(this.props.interactionMode) && {border: '1px solid ' + Palette.PINK},
          ]}
        >
          <EyeIconSVG color={this.getConglomerateComponentButtonColor()} />
        </button>

        {this.state.showPublicPrivateOptInModal && !this.props.isPreviewMode &&
          <PublicPrivateOptInModal
            isPublic={this.props.project.isPublic}
            onToggle={() => {
              this.props.updateProjectObject({
                isPublic: !this.props.project.isPublic,
              });
            }}
            onClose={() => {
              this.setState({showPublicPrivateOptInModal: false});
            }}
            onContinue={this.state.saveProjectContinue}
            privateProjectCount={this.state.privateProjectCount}
            privateProjectLimit={this.props.privateProjectLimit}
            explorePro={this.props.explorePro}
            forceDisablePrivate={this.state.forceDisablePrivate}
          />
        }

        {this.state.showSharePopover && !this.props.isPreviewMode &&
          <ShareModal
            envoyProject={this.props.envoyProject}
            supportOfflineExport={this.props.supportOfflineExport}
            onClose={this.hideShareModal}
            project={this.props.project}
            snapshotSaveConfirmed={this.state.snapshotSaveConfirmed}
            isSnapshotSaveInProgress={this.state.isSnapshotSaveInProgress}
            linkAddress={this.state.linkAddress}
            semverVersion={this.state.semverVersion}
            error={this.state.snapshotSaveError}
            snapshotSyndicated={this.state.snapshotSyndicated}
            userName={this.props.username}
            organizationName={this.props.organizationName}
            ref={(el) => {
              this._shareModal = el;
            }}
            projectName={this.props.project.projectName}
            folder={this.props.folder}
            mixpanel={mixpanel}
            urls={this.state.shareUrls}
            privateProjectCount={this.state.privateProjectCount}
            privateProjectLimit={this.props.privateProjectLimit}
            explorePro={this.props.explorePro}
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
  organizationName: React.PropTypes.string,
  websocket: React.PropTypes.object.isRequired,
  createNotice: React.PropTypes.func.isRequired,
  removeNotice: React.PropTypes.func.isRequired,
  supportOfflineExport: React.PropTypes.bool,
};

export default Radium(StageTitleBar);
