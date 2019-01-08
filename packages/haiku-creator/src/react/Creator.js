import {remote, shell, ipcRenderer, clipboard, webFrame} from 'electron';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {StyleRoot} from 'radium';
import {CSSTransition} from 'react-transition-group';
import * as lodash from 'lodash';
import * as EventEmitter from 'event-emitter';
import * as path from 'path';
import * as BaseModel from 'haiku-serialization/src/bll/BaseModel';
import * as Project from 'haiku-serialization/src/bll/Project';
import * as File from 'haiku-serialization/src/bll/File';
import * as Asset from 'haiku-serialization/src/bll/Asset';
import EventHandlerEditor from './components/EventHandlerEditor';
import AuthenticationUI from './components/AuthenticationUI';
import ProjectBrowser from './components/ProjectBrowser';
import SideBar from './components/SideBar';
import Library from './components/library/Library';
import StateInspector from './components/StateInspector/StateInspector';
import SplitPanel from './components/SplitPanel';
import Stage from './components/Stage';
import Timeline from './components/Timeline';
import Toast from './components/notifications/Toast';
import Tour from './components/Tour/Tour';
import {DASH_STYLES} from './styles/dashShared';
import AutoUpdater from './components/AutoUpdater';
import ProjectLoader from './components/ProjectLoader';
import ProxyHelpScreen from './components/ProxyHelpScreen';
import ProxySettingsScreen from './components/ProxySettingsScreen';
import ChangelogModal from './components/ChangelogModal';
import NewProjectModal from './components/NewProjectModal';
import {OfflineExportUpgradeModal} from './components/OfflineExportUpgradeModal';
import EnvoyClient from 'haiku-sdk-creator/lib/envoy/EnvoyClient';
import {EXPORTER_CHANNEL, ExporterFormat} from 'haiku-sdk-creator/lib/exporter';
import {USER_CHANNEL, UserSettings} from 'haiku-sdk-creator/lib/bll/User'; // eslint-disable-line no-unused-vars
import {PROJECT_CHANNEL} from 'haiku-sdk-creator/lib/bll/Project';
import {TOUR_CHANNEL} from 'haiku-sdk-creator/lib/tour';
import {SERVICES_CHANNEL} from 'haiku-sdk-creator/lib/services';
import {ERROR_CHANNEL, isUserlandCulprit} from 'haiku-sdk-creator/lib/bll/Error';
import {
  InteractionMode,
  isPreviewMode,
} from 'haiku-ui-common/lib/interactionModes';
import Palette from 'haiku-ui-common/lib/Palette';
import ActivityMonitor from '../utils/activityMonitor.js';
import * as requestElementCoordinates from 'haiku-serialization/src/utils/requestElementCoordinates';
import {buildProxyUrl, describeProxyFromUrl} from 'haiku-common/lib/proxies';
import * as Hai from '@haiku/taylor-hai/react';
import * as logger from 'haiku-serialization/src/utils/LoggerInstance';
import * as opn from 'opn';
import ConfirmGroupUngroupPopup from './components/Popups/ConfirmGroupUngroup';
import {FailWhale} from './components/Popups/FailWhale';
import {getAccountUrl, shouldEmitErrors} from 'haiku-common/lib/environments';
import Globals from 'haiku-ui-common/lib/Globals';

// Useful debugging originator of calls in shared model code
process.env.HAIKU_SUBPROCESS = 'creator';

const pkg = require('./../../package.json');

const mixpanel = require('haiku-serialization/src/utils/Mixpanel');

const {dialog} = remote;

const isNumeric = (n) => {
  return !isNaN(parseFloat(n)) && isFinite(n);
};

if (webFrame) {
  if (webFrame.setZoomLevelLimits) {
    webFrame.setZoomLevelLimits(1, 1);
  }
  if (webFrame.setLayoutZoomLevelLimits) {
    webFrame.setLayoutZoomLevelLimits(0, 0);
  }
}

const MENU_ACTION_DEBOUNCE_TIME = 100;
const FORK_OPERATION_TIMEOUT = 2000;
const MAX_FORK_ATTEMPTS = 15;
const FIGMA_IMPORT_TIMEOUT = 1000 * 60 * 5; /* 5 minutes */

export default class Creator extends React.Component {
  constructor (props) {
    super(props);

    this.authenticateUser = this.authenticateUser.bind(this);
    this.resendEmailConfirmation = this.resendEmailConfirmation.bind(this);
    this.authenticationComplete = this.authenticationComplete.bind(this);
    this.loadProjects = this.loadProjects.bind(this);
    this.launchProject = this.launchProject.bind(this);
    this.removeNotice = this.removeNotice.bind(this);
    this.createNotice = this.createNotice.bind(this);
    this.renderNotice = this.renderNotice.bind(this);
    this.handleFindElementCoordinates = this.handleFindElementCoordinates.bind(this);
    this.handleFindWebviewCoordinates = this.handleFindWebviewCoordinates.bind(this);
    this.onAutoUpdateCheckComplete = this.onAutoUpdateCheckComplete.bind(this);
    this.onTimelineMounted = this.onTimelineMounted.bind(this);
    this.onTimelineUnmounted = this.onTimelineUnmounted.bind(this);
    this.onNavigateToDashboard = this.onNavigateToDashboard.bind(this);
    this.setGlassInteractionToPreviewMode = this.setGlassInteractionToPreviewMode.bind(this);
    this.setGlassInteractionToEditMode = this.setGlassInteractionToEditMode.bind(this);
    this.setGlassInteractionToCodeEditorMode = this.setGlassInteractionToCodeEditorMode.bind(this);
    this.togglePreviewMode = this.togglePreviewMode.bind(this);
    this.clearAuth = this.clearAuth.bind(this);
    this.tryToChangeCurrentActiveComponent = this.tryToChangeCurrentActiveComponent.bind(this);
    this.launchFolder = this.launchFolder.bind(this);
    this.switchActiveNav = this.switchActiveNav.bind(this);
    this.onLibraryDragEnd = this.onLibraryDragEnd.bind(this);
    this.onLibraryDragStart = this.onLibraryDragStart.bind(this);
    this.showEventHandlersEditor = this.showEventHandlersEditor.bind(this);
    this.handleShowEventHandlersEditor = this.handleShowEventHandlersEditor.bind(this);
    this.handleShowConfirmGroupPopup = this.handleShowConfirmGroupPopup.bind(this);
    this.hideConfirmGroupUngroupPopup = this.hideConfirmGroupUngroupPopup.bind(this);
    this.layout = new EventEmitter();
    this.activityMonitor = new ActivityMonitor(window, this.onActivityReport.bind(this));
    // Keep tracks of not found identifiers and notice id
    this.identifiersNotFound = [];
    this.identifiersNotFoundNotice = undefined;

    this.debouncedForceUpdate = lodash.debounce(() => {
      this.forceUpdate();
    }, 100, {leading: false, trailing: true});

    // Stores creator widget state, so when we leave preview, it can be restored
    this.lastWidgetState = {activeNav: 'library', interactionMode: InteractionMode.GLASS_EDIT};

    this.state = {
      error: null,
      projectFolder: this.props.folder,
      projectObject: null,
      projectModel: null, // Instance of the Project model
      dashboardVisible: !this.props.folder,
      readyForAuth: false,
      hasLoadedOnce: false,
      isUserAuthenticated: false,
      username: null,
      isAdmin: false,
      notices: [],
      softwareVersion: pkg.version,
      didPlumbingNoticeCrash: false,
      activeNav: 'library',
      projectsList: [],
      updater: {
        shouldCheck: true,
        shouldRunOnBackground: true,
        shouldSkipOptIn: true,
      },
      doShowProjectLoader: false,
      projectLaunching: false,
      tearingDown: false,
      interactionMode: InteractionMode.GLASS_EDIT,
      artboardDimensions: null,
      showChangelogModal: false,
      showOfflineExportUpgradeModal: false,
      // This is a sensible default to avoid flashes of offline warnings.
      // (The Envoy server will protect us from any potential abuse.)
      allowOffline: true,
      isOnline: true,
      areProjectsLoading: false,
      showProxySettings: false,
      servicesEnvoyClient: null,
      projectToDuplicate: null,
      showEventHandlerEditor: false,
      eventHandlerEditorOptions: {},
      showConfirmGroupUngroupPopup: false,
      groupOrUngroup: 'group',
      showFailWhale: false,
      failWhaleUniqueId: null,
    };

    this.envoyOptions = {
      token: this.props.haiku.envoy.token,
      port: this.props.haiku.envoy.port,
      host: this.props.haiku.envoy.host,
      WebSocket: window.WebSocket,
    };

    // fileOptions is something of a misnomer, but we pass these into Project so they
    // can be forwarded to file. They're also used to configure the Project model itself.
    this.fileOptions = {};

    // Callback for post-authentication
    this._postAuthCallback = undefined;

    const win = remote.getCurrentWindow();

    if (process.env.DEV === '1' || process.env.DEV === 'creator') {
      win.openDevTools();
    }

    window.onerror = (message) => {
      this.createNotice({
        message,
        type: 'error',
        title: 'Oh no!',
        closeText: 'Okay',
        lightScheme: true,
      });
    };

    document.addEventListener('mousemove', (nativeEvent) => {
      this._lastMouseX = nativeEvent.clientX;
      this._lastMouseY = nativeEvent.clientY;
    });
    document.addEventListener('drag', (nativeEvent) => {
      // When the drag ends, for some reason the position goes to 0, so hack this...
      if (nativeEvent.clientX > 0 && nativeEvent.clientY > 0) {
        this._lastMouseX = nativeEvent.clientX;
        this._lastMouseY = nativeEvent.clientY;
      }
    });
    document.addEventListener('mouseup', (e) => {
      if (this.editor && this.state.showEventHandlerEditor) {
        const node = ReactDOM.findDOMNode(this.editor);
        const pnode = ReactDOM.findDOMNode(this.refs.stage);
        if (!node.contains(e.target) && pnode.contains(e.target)) {
          this.safelyHideEventHandlersEditor();
        }
      }
    });

    ipcRenderer.on('global-menu:open-dev-tools', lodash.debounce(() => {
      remote.getCurrentWindow().openDevTools();
      this.props.websocket.send({
        type: 'relay',
        from: 'creator',
        view: 'timeline',
        name: 'global-menu:open-dev-tools',
      });
      this.props.websocket.send({
        type: 'relay',
        from: 'creator',
        view: 'glass',
        name: 'global-menu:open-dev-tools',
      });
    }, MENU_ACTION_DEBOUNCE_TIME, {leading: true, trailing: false}));

    ipcRenderer.on('global-menu:close-dev-tools', lodash.debounce(() => {
      if (remote.getCurrentWindow().isDevToolsFocused()) {
        remote.getCurrentWindow().closeDevTools();
      }
      this.props.websocket.send({
        type: 'relay',
        from: 'creator',
        view: 'timeline',
        name: 'global-menu:close-dev-tools',
      });
      this.props.websocket.send({
        type: 'relay',
        from: 'creator',
        view: 'glass',
        name: 'global-menu:close-dev-tools',
      });
    }, MENU_ACTION_DEBOUNCE_TIME, {leading: true, trailing: false}));

    ipcRenderer.on('global-menu:carbonite-snapshot', lodash.debounce(() => {
      if (global.sentryReporter && this.error) {
        this.error.clearLastUploadTime().then(() => {
          // Call Carbonite in the BLL.
          const finalUrl = global.sentryReporter.freezeInCarbonite(Raven.getContext(), false);

          if (finalUrl) {
            this.createNotice({
              title: 'Done',
              type: 'info',
              message: 'Project snapshot processing. Check console log for URL.',
            });
            console.info(`Carbonite URL: ${finalUrl}.`);
          } else {
            this.createNotice({
              title: 'Unable to freeze!',
              type: 'warning',
              message: 'We were not able to freeze your project. Check logs for details.',
            });
          }
        });
      }
    }, 1000, {leading: true, trailing: false}));

    ipcRenderer.on('global-menu:open-finder', lodash.debounce(() => {
      logger.info(`[creator] global-menu:open-finder`);
      this.openFinder();
    }, MENU_ACTION_DEBOUNCE_TIME, {leading: true, trailing: false}));

    ipcRenderer.on('global-menu:open-terminal', lodash.debounce(() => {
      logger.info(`[creator] global-menu:open-terminal`);
      this.openTerminal();
    }, MENU_ACTION_DEBOUNCE_TIME, {leading: true, trailing: false}));

    ipcRenderer.on('global-menu:open-text-editor', lodash.debounce(() => {
      logger.info(`[creator] global-menu:open-text-editor`);
      this.openTextEditor();
    }, MENU_ACTION_DEBOUNCE_TIME, {leading: true, trailing: false}));

    ipcRenderer.on('global-menu:check-updates', lodash.debounce(() => {
      logger.info(`[creator] global-menu:check-updates`);
      this.setState({
        updater: {
          shouldCheck: true,
          shouldRunOnBackground: false,
          shouldSkipOptIn: true,
        },
      });
    }, MENU_ACTION_DEBOUNCE_TIME, {leading: true, trailing: false}));

    ipcRenderer.on('global-menu:show-changelog', lodash.debounce(() => {
      logger.info(`[creator] global-menu:show-changelog`);
      this.showChangelogModal();
    }, MENU_ACTION_DEBOUNCE_TIME, {leading: true, trailing: false}));

    ipcRenderer.on('global-menu:set-active-component', lodash.debounce((ipcEvent, scenename) => {
      logger.info(`[creator] global-menu:set-active-component`);
      this.tryToChangeCurrentActiveComponent(scenename);
    }, MENU_ACTION_DEBOUNCE_TIME, {leading: true, trailing: false}));

    ipcRenderer.on('global-menu:zoom-in', lodash.debounce(() => {
      logger.info(`[creator] global-menu:zoom-in`);
      // Timeline will send to Glass if it doesn't want to zoom
      this.props.websocket.send({
        type: 'relay',
        from: 'creator',
        view: 'glass',
        name: 'global-menu:zoom-in',
      });
    }, 50, {leading: true, trailing: false}));

    ipcRenderer.on('global-menu:zoom-out', lodash.debounce(() => {
      // Timeline will send to Glass if it doesn't want to zoom
      logger.info(`[creator] global-menu:zoom-out`);
      this.props.websocket.send({
        type: 'relay',
        from: 'creator',
        view: 'glass',
        name: 'global-menu:zoom-out',
      });
    }, 50, {leading: true, trailing: false}));

    ipcRenderer.on('global-menu:reset-viewport', lodash.debounce(() => {
      // Timeline will send to Glass if it doesn't want to zoom
      logger.info(`[creator] global-menu:reset-viewport`);
      this.props.websocket.send({
        type: 'relay',
        from: 'creator',
        view: 'timeline',
        name: 'global-menu:reset-viewport',
      });
    }, MENU_ACTION_DEBOUNCE_TIME, {leading: true, trailing: false}));

    ipcRenderer.on('global-menu:group', lodash.debounce(() => {
      // Timeline will send to Glass if it doesn't want to group
      logger.info(`[creator] global-menu:group`);
      this.props.websocket.send({
        type: 'relay',
        from: 'creator',
        view: 'timeline',
        name: 'global-menu:group',
      });
    }, MENU_ACTION_DEBOUNCE_TIME, {leading: true, trailing: false}));

    ipcRenderer.on('global-menu:ungroup', lodash.debounce(() => {
      // Timeline will send to Glass if it doesn't want to ungroup
      logger.info(`[creator] global-menu:ungroup`);
      this.props.websocket.send({
        type: 'relay',
        from: 'creator',
        view: 'timeline',
        name: 'global-menu:ungroup',
      });
    }, MENU_ACTION_DEBOUNCE_TIME, {leading: true, trailing: false}));

    ipcRenderer.on('global-menu:undo', lodash.debounce(() => {
      // Timeline will send to Glass if it doesn't want to undo
      logger.info(`[creator] global-menu:undo`);
      this.props.websocket.send({
        type: 'relay',
        from: 'creator',
        view: 'timeline',
        name: 'global-menu:undo',
        time: Date.now(),
      });
    }, MENU_ACTION_DEBOUNCE_TIME, {leading: true, trailing: false}));

    ipcRenderer.on('global-menu:redo', lodash.debounce(() => {
      // Timeline will send to Glass if it doesn't want to undo
      logger.info(`[creator] global-menu:redo`);
      this.props.websocket.send({
        type: 'relay',
        from: 'creator',
        view: 'timeline',
        name: 'global-menu:redo',
        time: Date.now(),
      });
    }, MENU_ACTION_DEBOUNCE_TIME, {leading: true, trailing: false}));

    ipcRenderer.on('global-menu:copy', lodash.debounce(() => {
      // Only delegate copy if we don't have anything in selection
      if (!this.isTextSelected()) {
        logger.info(`[creator] global-menu:copy`);
        this.props.websocket.send({
          type: 'relay',
          from: 'creator',
          view: 'timeline',
          name: 'global-menu:copy',
        });
      } else {
        clipboard.writeText(window.getSelection().toString());
      }
    }, MENU_ACTION_DEBOUNCE_TIME, {leading: true, trailing: false}));

    ipcRenderer.on('global-menu:cut', lodash.debounce(() => {
      // Only delegate cut if we don't have anything in selection
      if (!this.isTextSelected()) {
        logger.info(`[creator] global-menu:cut`);
        this.props.websocket.send({
          type: 'relay',
          from: 'creator',
          view: 'timeline',
          name: 'global-menu:cut',
        });
      }
    }, MENU_ACTION_DEBOUNCE_TIME, {leading: true, trailing: false}));

    ipcRenderer.on('global-menu:selectAll', lodash.debounce(() => {
      // Only select all if we haven't activated a text element
      if (!this.isTextInputFocused()) {
        logger.info(`[creator] global-menu:selectAll`);
        this.props.websocket.send({
          type: 'relay',
          from: 'creator',
          view: 'timeline',
          name: 'global-menu:selectAll',
        });
      }
    }, MENU_ACTION_DEBOUNCE_TIME, {leading: true, trailing: false}));

    ipcRenderer.on('global-menu:paste', lodash.debounce(() => {
      // Only paste if we haven't activated a text element
      if (!this.isTextInputFocused()) {
        logger.info(`[creator] global-menu:paste`);
        this.props.websocket.send({
          type: 'relay',
          from: 'creator',
          view: 'timeline',
          name: 'global-menu:paste',
        });
      }
    }, MENU_ACTION_DEBOUNCE_TIME, {leading: true, trailing: false}));

    ipcRenderer.on('open-url:fork', (_, forkPath) => {
      // Incoming path should have format: /:organizationName/:projectName
      const matches = forkPath.match(/^\/(\w+)\/(\w+)$/);
      if (matches) {
        this.forkProject(matches[1], matches[2]);
      }
    });

    ipcRenderer.on('global-menu:show-new-project-modal', () => {
      this.showNewProjectModal();
    });

    ipcRenderer.on('global-menu:preview', () => {
      this.togglePreviewMode();
    });

    window.addEventListener('dragover', Asset.preventDefaultDrag, false);

    window.addEventListener('blur', () => {
      Globals.allKeysUp();
    });

    window.addEventListener(
      'drop',
      (event) => {
        if (this.state.projectModel) {
          this.state.projectModel.linkExternalAssetOnDrop(event, (error) => {
            if (error) {
              this.setState({error});
            }
            this.forceUpdate();
          });
        }
      },
      false,
    );

    // Add event listeners for when the network connectivity status of the browser changes.
    const checkOnlineStatus = () => this.checkOnlineStatus();
    window.addEventListener('online', checkOnlineStatus);
    window.addEventListener('offline', checkOnlineStatus);

    // For good measure, periodically check if we're online every five minutes. The online/offline events are
    // inherently flaky (they use navigator.onLine, which never returns false negatives but frequently returns false
    // positives).
    window.setInterval(checkOnlineStatus, 5 * 60 * 1000);

    // Flexibly keep track of states in the various subviews as broadcasted to us.
    // TODO: Move to Envoy. Put here to avoid boiling the ocean on multi-component.
    // This is a dictionary of state changes broadcasted to us via the subviews.
    // Structure looks like this:
    // {
    //   some/folder: {
    //     someStatename: {
    //       creator: creatorStateValue,
    //       master: masterStateValue,
    //       ...
    //     }
    //   }
    // }
    // With such an object, we can track all registrars for some known state name.
    this._projectStates = {};

    if (process.env.NODE_ENV !== 'production') {
      // For debugging
      window.creator = this;
      window.view = this; // Easy to run same instruction in different tools
    }
  }

  explorePro = (source) => {
    if (source) {
      mixpanel.haikuTrack(`creator:upgrade-cta-click:${source}`);
    }
    shell.openExternal(getAccountUrl('checkout'));
  };

  isTextInputFocused () {
    const tagName = (
      document.activeElement &&
      document.activeElement.tagName &&
      document.activeElement.tagName.toLowerCase()
    );

    return (
      tagName && (
        tagName === 'input' ||
        tagName === 'textarea'
      )
    );
  }

  isTextSelected () {
    return window.getSelection().type === 'Range';
  }

  isCreatorExplicitlyFocused () {
    return document.hasFocus() && !this.isWebviewFocused();
  }

  isWebviewFocused () {
    return this.isTimelineFocused() || this.isGlassFocused();
  }

  isTimelineFocused () {
    const webview = this.getTimelineWebview();
    return webview && webview === document.activeElement;
  }

  isGlassFocused () {
    const webview = this.getGlassWebview();
    return webview && webview === document.activeElement;
  }

  getTimelineWebview () {
    return (
      this.refs &&
      this.refs.timeline &&
      this.refs.timeline.mount &&
      this.refs.timeline.mount.children &&
      this.refs.timeline.mount.children[0]
    );
  }

  getGlassWebview () {
    return (
      this.refs &&
      this.refs.stage &&
      this.refs.stage.mount &&
      this.refs.stage.mount.children &&
      this.refs.stage.mount.children[0]
    );
  }

  getActiveComponent () {
    return this.state.projectModel && this.state.projectModel.getCurrentActiveComponent();
  }

  openFinder () {
    if (this.state.projectModel) {
      try {
        logger.info('[creator] finder opening', shell.openItem(this.state.projectModel.getFolder()));
      } catch (exception) {
        logger.error(exception);
      }
    }
  }

  openTerminal () {
    if (this.state.projectModel) {
      try {
        logger.info('[creator] terminal opening', opn(this.state.projectModel.getFolder(), {app: 'terminal'}));
      } catch (exception) {
        logger.error(exception);
      }
    }
  }

  openTextEditor () {
    if (this.state.projectModel) {
      const relpath = this.state.projectModel.getCurrentActiveComponentRelpath();
      if (relpath) {
        this.openFileInTextEditor(
          path.join(this.state.projectModel.getFolder(), relpath),
        );
      }
    }
  }

  openFileInTextEditor (abspath) {
    const editorEnv = process.env.EDITOR;

    // TODO: App names are platform-specific; need to support Windows and Linux too
    let editorApp;
    if (typeof editorEnv !== 'string') {
      editorApp = 'textedit';
    }
    if (editorEnv.match(/subl/)) {
      editorApp = 'sublime text';
    }
    if (editorEnv.match(/vsc/)) {
      editorApp = 'visual studio code';
    }
    if (editorEnv.match(/code/)) {
      editorApp = 'visual studio code';
    }
    if (editorEnv.match(/visual/)) {
      editorApp = 'visual studio code';
    }
    if (editorEnv.match(/atom/)) {
      editorApp = 'atom';
    }
    if (editorEnv.match(/webstorm/)) {
      editorApp = 'webstorm';
    }
    // if (editorEnv.match(/vim/)) editorApp = 'vim' // TODO: open specific file?
    // if (editorEnv.match(/emacs/)) editorApp = 'emacs' // TODO: open specific file?
    if (!editorApp) {
      editorApp = 'textedit';
    }

    try {
      logger.info(`[creator] editor ${editorEnv || '?'}->${editorApp} opening`, opn(abspath, {app: editorApp}));
    } catch (exception) {
      logger.error(exception);
    }
  }

  checkOnlineStatus () {
    // In case this gets called too early.
    if (!this.user) {
      return;
    }

    this.user.checkOnline().then((isOnline) => {
      this.setState({isOnline});
    });
  }

  handleEnvoyUserReady () {
    if (!this.user) {
      return;
    }

    // kick off initial report
    this.onActivityReport(true, true);

    this.user.on(`${USER_CHANNEL}:load`, ({user, organization}) => {
      mixpanel.mergeToPayload({distinct_id: user.Username});
      mixpanel.haikuTrack('creator:opened');
      window.Raven.setUserContext({email: user.Username});
      window.Raven.setExtraContext({organizationName: organization.Name});
      this.user.checkPrivateProjectLimit().then((privateProjectLimit) => {
        this.setState({
          privateProjectLimit,
          username: user.Username,
          isAdmin: user.IsAdmin,
          organizationName: organization.Name,
        });

        this.setState({isUserAuthenticated: true});
      });

      this.user.checkOfflinePrivileges().then((allowOffline) => {
        this.setState({allowOffline});
      });

      this.checkOnlineStatus();
    });

    this.user.load().then(({user, organization}) => {
      this.setState({
        readyForAuth: true,
        isUserAuthenticated: user && organization,
      }, () => {
        if (this.state.isUserAuthenticated && typeof this._postAuthCallback === 'function') {
          this._postAuthCallback();
          delete this._postAuthCallback;
        } else if (this.props.folder) {
          // Launch folder directly - i.e. allow a 'subl' like experience without having to go
          // through the projects index
          const handleFailure = (launchError) => {
            if (launchError) {
              logger.error(launchError);
              this.setState({folderLoadingError: launchError});
              return this.createNotice({
                type: 'error',
                title: 'Oh no!',
                message: 'We were unable to open the folder. 😢 Please close and reopen the application and try again. If you still see this message, contact Haiku for support.',
                closeText: 'Okay',
                lightScheme: true,
              });
            }
          };

          this.launchFolder(
            // Load up the necessary metadata in Plumbing to launch normally.
            {
              projectPath: this.props.folder,
              authorName: 'user@haiku.ai',
              organizationName: 'Haiku',
              projectName: path.basename(this.props.folder),
              branchName: 'master',
            },
            handleFailure,
          );
        }
      });
    });

    this.user.getConfig(UserSettings.LastViewedChangelog).then((changelogVersion) => {
      let lastViewedChangelog = changelogVersion;

      // If the user doesn't have a lastViewedChangelog config set, set it to the
      // current version (ie don't show the changelog). This is usually the case
      // for brand new users.
      if (!lastViewedChangelog) {
        lastViewedChangelog = process.env.HAIKU_RELEASE_VERSION;
        this.user.setConfig(UserSettings.LastViewedChangelog, lastViewedChangelog);
      }

      this.setState({lastViewedChangelog});
    });
  }

  componentDidMount () {
    this.props.websocket.on('broadcast', (message) => {
      switch (message.name) {
        case 'remote-model:receive-sync':
          BaseModel.receiveSync(message);
          break;

        case 'component:reload':
          if (this.getActiveComponent()) {
            this.getActiveComponent().moduleReplace(() => {});
          }
          break;

        case 'project-state-change':
          this.handleConnectedProjectModelStateChange(message);
          break;

        case 'dimensions-reset':
          this.setState({artboardDimensions: message.data});
          break;

        case 'show-event-handlers-editor':
          this.handleShowEventHandlersEditor(
            message.elid,
            message.opts,
            message.frame,
          );
          break;

        case 'show-confirm-group-popup':
          this.handleShowConfirmGroupPopup(message.groupOrUngroup);
          break;

        case 'assets-changed':
          File.cache.clear();
          break;
      }
    });

    this.activityMonitor.startWatchers();

    this.envoyClient = new EnvoyClient(this.envoyOptions);

    this.envoyClient.get(EXPORTER_CHANNEL).then((exporterChannel) => {
      this.envoyExporter = exporterChannel;
      ipcRenderer.on('global-menu:save-as', (_, extension, request) => {
        exporterChannel.checkOfflinePrivileges().then((allowOffline) => {
          if (!allowOffline) {
            this.setState({
              showOfflineExportUpgradeModal: true,
              offlineExportUpgradeModalMetadata: {
                extension,
                framerate: request.framerate,
              },
            });
            return;
          }

          switch (extension) {
            case 'gif':
              request.format = ExporterFormat.AnimatedGif;
              break;
            case 'mp4':
              request.format = ExporterFormat.Video;
              break;
            case 'json':
              request.format = ExporterFormat.Bodymovin;
              break;
          }

          dialog.showSaveDialog(undefined, {
            defaultPath: this.state.projectObject ? `*/${this.state.projectObject.projectName}` : null,
            filters: [{
              name: request.format, extensions: [extension],
            }],
          },
            (filename) => {
              if (!filename) {
                return;
              }

              request.filename = filename;
              exporterChannel.save(request);
            });
        });
      });
    });

    this.envoyClient.get(ERROR_CHANNEL).then(
      (error) => {
        if (global.sentryReporter) {
          global.sentryReporter.envoy = error;
        }
        this.error = error;
        this.error.on(`${ERROR_CHANNEL}:error`, ({uniqueId, message, culprit}) => {
          if (shouldEmitErrors() && !isUserlandCulprit(culprit)) {
            this.setState({
              showFailWhale: true,
              failWhaleUniqueId: uniqueId || this.state.failWhaleUniqueId,
            });
          } else {
            this.createNotice({
              message,
              type: 'error',
              title: 'Error',
            });
          }
        });
      },
    );

    this.envoyClient.get(USER_CHANNEL).then(
      (user) => {
        this.user = user;
        this.handleEnvoyUserReady();
      },
    );

    // Use a lengthy timeout for project channel, which does some CRUD.
    this.envoyClient.get(PROJECT_CHANNEL).then(

      (project) => {
        this.envoyProject = project;
        project.on(`${PROJECT_CHANNEL}:saved`, (projectObject) => {
          if (this.state.projectObject && this.state.projectObject.projectName === projectObject.projectName) {
            this.setState({projectObject, projectFolder: projectObject.projectPath});
          }
        });
      },
    );

    this.envoyClient.get(SERVICES_CHANNEL, {timeout: FIGMA_IMPORT_TIMEOUT}).then((servicesEnvoyClient) => {
      this.setState({servicesEnvoyClient});
    });

    this.envoyClient.get(TOUR_CHANNEL).then((tourChannel) => {
      this.tourChannel = tourChannel;

      tourChannel.on('tour:requestElementCoordinates', this.handleFindElementCoordinates);

      tourChannel.on('tour:requestWebviewCoordinates', this.handleFindWebviewCoordinates);

      tourChannel.on('tour:requestShowStep', this.setGlassInteractionToEditMode);

      ipcRenderer.on('global-menu:start-tour', this.startTourFromGlobalMenu);

      window.addEventListener('resize', lodash.throttle(() => {
        tourChannel.updateLayout();
      }), 300);
    });
  }

  componentWillUnmount () {
    this.tourChannel.off('tour:requestElementCoordinates', this.handleFindElementCoordinates);
    this.tourChannel.off('tour:requestWebviewCoordinates', this.handleFindWebviewCoordinates);
    this.tourChannel.off('tour:requestShowStep', this.setGlassInteractionToEditMode);
    this.activityMonitor.stopWatchers();
  }

  handleConnectedProjectModelStateChange ({from, folder, what, value}) {
    if (!this._projectStates[folder]) {
      this._projectStates[folder] = {};
    }
    if (!this._projectStates[folder][what]) {
      this._projectStates[folder][what] = {};
    }
    this._projectStates[folder][what][from] = (value !== undefined)
      ? value // Let the originator specify the state...
      : true; // ...Otherwise it is simply a status of true
  }

  haveAllProjectsRegisteredStateNameForFolder (folder, what, value = true) {
    return (
      this._projectStates[folder] &&
      this._projectStates[folder][what] &&
      this._projectStates[folder][what].creator === value &&
      this._projectStates[folder][what].glass === value &&
      this._projectStates[folder][what].timeline === value &&
      this._projectStates[folder][what].master === value
    );
  }

  /**
   * @methjod awaitAllProjectModelsState
   * @description Long-poll our local registry until all of the subviews for the given folder
   * have registered as having entered the named state.
   */
  awaitAllProjectModelsState (folder, what, value = true, cb) {
    if (
      this.state.projectModel && // Sanity check
      this.state.projectModel.getFolder() === folder &&
      this.haveAllProjectsRegisteredStateNameForFolder(folder, what, value)
    ) {
      return cb();
    }

    return setTimeout(() => {
      return this.awaitAllProjectModelsState(folder, what, value, cb);
    }, 100);
  }

  unsetAllProjectModelsState (folder, what) {
    if (!this._projectStates[folder]) {
      return null;
    }
    // All states transition to an undefined state
    this._projectStates[folder][what] = {};
  }

  handleFindElementCoordinates ({selector, webview}) {
    requestElementCoordinates({
      currentWebview: 'creator',
      requestedWebview: webview,
      selector,
      shouldNotifyEnvoy:
        this.tourChannel &&
        this.envoyClient &&
        !this.envoyClient.isInMockMode(),
      tourClient: this.tourChannel,
    });
  }

  handleFindWebviewCoordinates () {
    this.tourChannel.receiveWebviewCoordinates('creator', {top: 0, left: 0});
  }

  renderNotice (content, i) {
    return (
      <Toast
        toastType={content.type}
        toastTitle={content.title}
        toastMessage={content.message}
        toastCount={content.count || 1}
        closeText={content.closeText}
        key={i + content.title}
        myKey={i}
        removeNotice={this.removeNotice}
        lightScheme={content.lightScheme} />
    );
  }

  mixpanelReportPreviewMode (interactionMode) {
    let interactionName = '';
    switch (interactionMode) {
      case InteractionMode.GLASS_EDIT:
        interactionName = 'edit';
        break;
      case InteractionMode.GLASS_PREVIEW:
        interactionName = 'preview';
        break;
      case InteractionMode.CODE_EDITOR:
        interactionName = 'code-editor';
        break;
      default:
        break;
    }

    mixpanel.haikuTrack(`creator:interaction-mode:${interactionName}`);
  }

  restart = () => {
    ipcRenderer.send('restart');
  };

  handleInteractionModeChange (interactionMode) {
    if (this.state.interactionMode === interactionMode) {
      return;
    }

    // When exiting preview mode:
    // - Pressing toggle preview button: restore creator creator (open design + restore left
    //     panel) or (open code editor + state inspector)
    // - Pressing design button: go to desing and restore left panel
    // - Pressing code button: go to code editor and open state inspector on left panel
    if (interactionMode === InteractionMode.GLASS_PREVIEW) {
      this.forceHideEventHandlersEditor({trySave: true});
    } else if (this.state.interactionMode === InteractionMode.GLASS_PREVIEW && interactionMode === InteractionMode.GLASS_EDIT) {
      this.setState({activeNav: this.lastWidgetState.activeNav});
    } else if (interactionMode === InteractionMode.GLASS_EDIT) {
      this.setState({activeNav: 'library'});
    } else if (interactionMode === InteractionMode.CODE_EDITOR) {
      this.setState({activeNav: 'state_inspector'});
    }

    this.lastWidgetState = {interactionMode: this.state.interactionMode, activeNav: this.state.activeNav};

    this.mixpanelReportPreviewMode(interactionMode);

    this.setState({interactionMode}, () => {
      if (interactionMode === InteractionMode.CODE_EDITOR) {
        this.refs.stage.focusCodeEditor();
      }
    });
  }

  setInteractionMode (interactionMode) {
    if (this.state.projectModel) {
      this.state.projectModel.setInteractionMode(interactionMode, {from: 'creator', integrity: false}, () => {});
    }
  }

  togglePreviewMode () {
    // We delegate to state, so stage can check if code editor has any content
    if (isPreviewMode(this.state.interactionMode)) {
      this.setInteractionMode(this.lastWidgetState.interactionMode);
    } else {
      this.refs.stage.tryToSwitchToPreviewMode();
    }
  }

  setGlassInteractionToPreviewMode () {
    this.setInteractionMode(InteractionMode.GLASS_PREVIEW);
  }

  setGlassInteractionToEditMode () {
    this.setInteractionMode(InteractionMode.GLASS_EDIT);
  }

  setGlassInteractionToCodeEditorMode () {
    this.setInteractionMode(InteractionMode.CODE_EDITOR);
  }

  switchActiveNav (activeNav) {
    this.setState({activeNav});

    mixpanel.haikuTrack('creator:project:left-nav-switch', {
      option: activeNav,
    });
  }

  authenticateUser (username, password, cb) {
    if (!this.user) {
      return cb({
        code: 500,
        message: 'Unknown error.',
      });
    }

    this.user.authenticate(username, password).then(({user, organization}) => {
      mixpanel.haikuTrack('creator:user-authenticated', {username: user.Username});
      ipcRenderer.send('topmenu:update', {isUserAuthenticated: true});
    }).catch((error) => {
      cb(error);
    });
  }

  showProxySettings () {
    this.setState({
      showProxySettings: true,
    });
  }

  startTourFromGlobalMenu = () => {
    // Don't start the tour if is called via the main menu
    // while a project is loading.
    //
    // TODO: disable the TopMenu option. Setting a timeout here
    // to start the tour once the project is loaded leads to weird
    // flashes (loading screen => project => loading screen)
    if (this.shouldShowProjectLoader()) {
      return;
    }

    if (this.state.projectModel) {
      this.teardownMaster({shouldFinishTour: false});
    } else {
      this.setState({dashboardVisible: true, doShowProjectLoader: false});
    }

    // Put it at the bottom of the event loop
    setTimeout(() => {
      this.tourChannel.start(true);
    });
  }

  resendEmailConfirmation (username) {
    return this.props.websocket.request({method: 'resendEmailConfirmation', params: [username]}, () => {});
  }

  authenticationComplete () {
    if (typeof this._postAuthCallback === 'function') {
      this._postAuthCallback();
      delete this._postAuthCallback;
    }

    this.handleEnvoyUserReady();

    return this.setState({isUserAuthenticated: true});
  }

  loadProjects (silent, cb) {
    if (!this.envoyProject) {
      return cb(null, []);
    }

    // If "silent", do not show the loading state.
    this.setState(silent ? {} : {areProjectsLoading: true}, () => {
      this.envoyProject.getProjectsList().then((projectsList) => {
        this.setState({areProjectsLoading: false, hasLoadedOnce: true, projectsList});
        ipcRenderer.send('topmenu:update', {projectsList, isProjectOpen: false, isUserAuthenticated: this.state.isUserAuthenticated});
        return cb(null, projectsList);
      }).catch((error) => {
        mixpanel.haikuTrack('creator:project-list:unable-to-retrieve', {
          username: this.state.username,
          organization: this.state.organizationName,
        });
        this.setState({areProjectsLoading: false});
        return cb(error, []);
      });
    });
  }

  onProjectLaunchError () {
    this.setState({projectLaunching: false, doShowProjectLoader: false, dashboardVisible: true}, () => {
      this.createNotice({
        type: 'error',
        title: 'Oh no!',
        message: 'We couldn\'t open this project. 😩 Please ensure that your computer is connected to the Internet. If you\'re connected and you still see this message your files might still be processing. Please try again in a few moments. If you still see this error, contact Haiku for support.',
        closeText: 'Okay',
        lightScheme: true,
      });
    });
  }

  onProjectsList = (projectsList) => {
    ipcRenderer.send('topmenu:update', {projectsList});
  };

  createProject (projectName, duplicate = false, callback) {
    this.setState({doShowProjectLoader: true});
    this.envoyProject.createProject(projectName).then((newProject) => {
      if (duplicate && this.state.projectToDuplicate !== null) {
        this.props.websocket.request(
          {
            method: 'duplicateProject',
            params: [newProject, this.state.projectToDuplicate],
          },
          () => {
            callback(null, newProject);
          },
        );
      } else {
        callback(null, newProject);
      }
    }).catch((error) => {
      this.setState({doShowProjectLoader: false});
      console.log(error);
      this.createNotice({
        type: 'error',
        title: 'Oh no!',
        message: 'We couldn\'t create your project. 😩 If this problem occurs again, please contact Haiku support.',
        closeText: 'Okay',
        lightScheme: true,
      });
      callback(error);
    });
  }

  launchProject (projectObject, cb) {
    // VERY IMPORTANT - if not set to true, we can end up in a situation where we overwrite freshly cloned content from the remote!
    projectObject.skipContentCreation = true;

    this.setState({
      doShowProjectLoader: true,
      dashboardVisible: false,
    });

    if (projectObject.isFork && !projectObject.forkComplete) {
      return this.openNewlyForkedProject(projectObject, 0, () => {});
    }

    const {projectName, projectPath} = projectObject;

    // Add extra context to Sentry reports, this info is also used by carbonite.
    if (window.Raven) {
      window.Raven.setExtraContext({projectName, projectPath});
    }

    mixpanel.haikuTrack('creator:project:launching', {
      username: this.state.username,
      project: projectName,
      organization: this.state.organizationName,
    });

    // Async: ensure our web+haikuroot:// URLs work as expected.
    ipcRenderer.send('protocol:register', projectObject.projectPath);

    return this.props.websocket.request({method: 'bootstrapProject', params: [projectObject]}, (err) => {
      if (err) {
        return this.onProjectLaunchError();
      }

      window.Raven.setExtraContext({
        organizationName: this.state.organizationName,
        projectPath, // Re-set in case it wasn't present in the above call
        projectName,
      });

      return this.props.websocket.request({method: 'startProject', params: [projectObject]}, (startProjectError, applicationImage) => {
        if (startProjectError) {
          return this.onProjectLaunchError();
        }

        return Project.setup(
          projectObject.projectPath,
          'creator', // alias
          this.props.websocket, // websocket (already initialized)
          window, // platform
          this.props.userconfig, // userconfig
          this.fileOptions,
          this.envoyOptions,
          (projectSetupError, projectModel) => {
            if (projectSetupError) {
              return cb(projectSetupError);
            }

            // Notify... ourselves that we've successfully set up the project model for this folder
            // Is it weird to put this here, or weirder to put a conditional hack over there?
            this.handleConnectedProjectModelStateChange({
              from: 'creator',
              folder: projectPath,
              what: 'project:ready',
            });

            // Assign, not merge, since we don't want to clobber any variables already set, like project name
            lodash.assign(projectObject, applicationImage.project);

            mixpanel.haikuTrack('creator:project:launched', {
              username: this.state.username,
              project: projectName,
              organization: this.state.organizationName,
            });

            this.setState({
              projectModel,
              projectFolder: projectPath,
              applicationImage,
              projectObject,
              projectName,
            }, () => {
              this.setState({doShowProjectLoader: false, projectLaunching: true});
              // Once the Timeline/Stage are being rendered, we await the point that their
              // own Project models have loaded before initiating a switch to the current
              // active component. This also waits for MasterProcess to be bootstrapped
              return this.awaitAllProjectModelsState(projectPath, 'project:ready', true, () => {
                const ac = this.state.projectModel.getCurrentActiveComponent();
                if (ac) {
                  // Even if we already have an active component set up and assigned in memory,
                  // we still need to notify Timeline/Stage since they have been completely recreated
                  ac.setAsCurrentActiveComponent({from: 'creator'}, () => { });
                } else {
                  // And if we don't have anything assigned, assume we're editing the main component
                  this.state.projectModel.setCurrentActiveComponent('main', {from: 'creator'}, () => { });
                }

                ipcRenderer.send('topmenu:update', {isProjectOpen: true});
              });
            });

            // This safely reinitializes websockets and Envoy clients.
            // We need to do this here in Creator because our process
            // remains alive even as the user navs between projects.
            projectModel.connectClients();

            // Clear the undo/redo stack (etc) from the previous editing session if any is left over
            projectModel.actionStack.resetData();

            projectModel.on('update', (what, ...args) => {
              // console.info(`[creator] local update ${what}, args:`,args)

              switch (what) {
                case 'updateMenu':
                  this.updateMenu();
                  break;

                case 'setCurrentActiveComponent':
                  this.handleActiveComponentReady();
                  break;

                case 'componentDeactivating':
                  this.handleComponentDeactivating();
                  break;

                case 'setInteractionMode':
                  this.handleInteractionModeChange(...args);
                  break;
              }
            });

            projectModel.on('remote-update', (what, ...args) => {
              switch (what) {
                case 'setCurrentActiveComponent':
                case 'selectElement':
                case 'unselectElement':
                case 'batchUpsertEventHandlers':
                  this.debouncedForceUpdate();
                  break;

                case 'setInteractionMode':
                  this.handleInteractionModeChange(...args);
                  break;
              }
            });

            // Trigger tab UI and library panel updates
            projectModel.on('active-component:upserted', () => {
              this.forceUpdate();
            });
          },
        );
      });
    });
  }

  handleComponentDeactivating () {
    this.getActiveComponent().removeAllListeners('sustained-check:start');
  }

  updateMenu () {
    ipcRenderer.send('topmenu:update', this.state.projectModel.describeTopMenu());
  }

  handleActiveComponentReady () {
    this.mountHaikuComponent();

    // Reset not found identifiers in case we are switching current active component
    this.identifiersNotFound = [];

    this.getActiveComponent().on('sustained-check:start', () => {
      const activeComponent = this.getActiveComponent();

      // If activeComponent is null, delete any identifiersNotFound notice and skip it
      if (!activeComponent) {
        this.deleteIdentifierNotFoundNotice();
        return;
      }

      // Check sustained warnings
      activeComponent.checkSustainedWarnings();

      const currentIdentifiersNotFound = activeComponent.sustainedWarningsChecker.notFoundIdentifiers;

      // If changed, delete current notice and display a new notice if num identifier not found > 0
      if (!lodash.isEqual(currentIdentifiersNotFound, this.identifiersNotFound)) {
        // Delete old notice
        this.deleteIdentifierNotFoundNotice();

        // Create new notice if has any not found indentifier
        if (currentIdentifiersNotFound.length > 0) {
          this.identifiersNotFoundNotice = this.createNotice({
            title: 'Uh oh',
            type: 'warning',
            message: `One or more of your expressions refers to an undefined state variable(s): ${currentIdentifiersNotFound.join(', ')}. Please edit your expressions to remove these references.`,
          });
        }

        // Update list of identifiers not found
        this.identifiersNotFound = currentIdentifiersNotFound;
      }
    });

    // For mc, this triggers re-render of the Component Tab UI, State Inspector UI, Library UI
    // in the context of whatever the current component is.
    if (this.state.projectFolder) {
      this.awaitAllProjectModelsState(this.state.projectFolder, 'component:mounted', true, () => {
        this.setState({
          projectLaunching: false,
        });
      });
    }
  }

  mountHaikuComponent () {
    // The Timeline UI doesn't display the component, so we don't bother giving it a ref
    this.getActiveComponent().mountApplication(null, {
      freeze: true, // No display means no need for overflow settings, etc
    }, () => {
      this.handleConnectedProjectModelStateChange({
        from: 'creator',
        folder: this.state.projectFolder,
        what: 'component:mounted',
      });
    });
  }

  launchFolder (projectOptions, cb) {
    mixpanel.haikuTrack('creator:folder:launching', {
      username: this.state.username,
      project: projectOptions.projectName,
    });

    return this.launchProject(projectOptions, cb);
  }

  removeNotice (index, id) {
    const notices = this.state.notices;
    if (index !== undefined) {
      this.setState({
        notices: [...notices.slice(0, index), ...notices.slice(index + 1)],
      });
    } else if (id !== undefined) {
      // Hackaroo
      lodash.each(notices, (notice, noticeIndex) => {
        if (notice.id === id) {
          this.removeNotice(noticeIndex);
        }
      });
    }
  }

  shouldNoticeBeSkipped (notice) {
    // Assume that any notice without a string or a react element isn't usable, so just skip it
    if (!notice || typeof notice.message !== 'string' && !React.isValidElement(notice.message)) {
      return true;
    }

    // 'Uncaught' errors will be handled in Envoy unless we're in dev mode.
    if (notice.type === 'error' && notice.message.startsWith('Uncaught') && shouldEmitErrors()) {
      return true;
    }

    if (typeof notice.message === 'string') {
      // Ignore Intercom widget errors which are transient and confuse the user
      if (notice.message.match(/intercom/)) {
        return true;
      }

      // HACK: Skip human-unfriendly duplicate errors that originate from ActiveComponent action calls
      if (notice.message.match(/\[active/)) {
        return true;
      }

      // Avoid scary error messages (752175308356950)
      if (notice.message.match(/EventEmitter/)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Expects the object:
   *
   * { type: string (info, success, danger (or error), warning)
   *   title: string,
   *   message: string,
   *   closeText: string (optional, defaults to 'close')
   *   lightScheme: bool (optional, defaults to dark)
   * }
   */
  createNotice (notice) {
    if (this.shouldNoticeBeSkipped(notice)) {
      return;
    }

    notice.id = Math.random() + '';
    notice.count = 1;
    notice.timestamp = Date.now();

    const notices = this.state.notices;

    let found = false;

    // Don't display more than five errors at a time
    if (notices.length > 5) {
      return;
    }

    // Throttle display to avoid creating a 60fps update death spiral
    const last = notices[0];
    if (last && (notice.timestamp - last.timestamp) < 500) {
      return;
    }

    notices.forEach((existing) => {
      if (
        existing.type === notice.type &&
        existing.message === notice.message
      ) {
        found = true;

        // If we get a bunch of errors of the same kind, that's most likely a bad problem
        if (existing.count >= 25) {
          if (process.env.NODE_ENV === 'production') {
            remote.getCurrentWindow().close();
          }
        } else {
          existing.count += 1;
        }
      }
    });

    if (!found) {
      if (notice.type === 'error') {
        logger.error(notice.message);
      }

      notices.unshift(notice);
    }

    this.setState({notices});

    return notice;
  }

  onLibraryDragEnd (asset) {
    this.setState({assetDragging: null});
    if (asset) {
      this.refs.stage.handleDrop(asset, this._lastMouseX, this._lastMouseY);
    }
  }

  onLibraryDragStart (asset) {
    this.setState({assetDragging: asset});
  }

  onAutoUpdateCheckComplete () {
    this.setState({
      updater: {
        ...this.state.updater,
        shouldCheck: false,
      },
    });
  }

  onActivityReport (userWasActive, shouldSkipOptIn = false) {
    if (userWasActive && this.user) {
      this.user.reportActivity();
    }

    this.setState({
      updater: {
        shouldCheck: true,
        shouldRunOnBackground: true,
        shouldSkipOptIn,
      },
    });
  }

  onTimelineMounted () {
    this.setState({isTimelineReady: true});
  }

  onTimelineUnmounted () {
    this.setState({isTimelineReady: false});
  }

  onNavigateToDashboard () {
    // Redundant with a future call, but ensures we will show the loading spinner ASAP.
    this.setState({tearingDown: true});
    this.user.load().then(({user, organization}) => {
      this.setState({
        readyForAuth: true,
        isUserAuthenticated: user && organization,
      });
      this.teardownMaster({shouldFinishTour: true});
      ipcRenderer.send('topmenu:update', {subComponents: [], undoState: {canUndo: false, canRedo: false}, isProjectOpen: false});
    });
  }

  awaitAuthAndFire (cb) {
    if (!this.state.readyForAuth || !this.state.isUserAuthenticated) {
      this._postAuthCallback = cb;
    } else {
      cb();
    }
  }

  showForkingError () {
    this.setState({projectLaunching: false, doShowProjectLoader: false, dashboardVisible: true});
    this.createNotice({
      type: 'error',
      title: 'Oh no!',
      message: 'This project cannot be forked. 😢 This may have been disabled by the project\'s owner.',
      closeText: 'Okay',
      lightScheme: true,
    });
  }

  forkProject (organizationName, projectName) {
    mixpanel.haikuTrack('creator:fork-project', {organizationName, projectName});
    const doFork = () => {
      this.awaitAuthAndFire(() => {
        if (!this.envoyProject) {
          return;
        }

        this.envoyProject.forkProject(organizationName, projectName).then((haikuProject) => {
          this.launchProject(haikuProject, (launchError) => {
            if (launchError) {
              this.showForkingError();
            }
          });
        }).catch(() => {
          this.showForkingError();
        });
      });
    };

    if (this.state.projectModel) {
      this.teardownMaster({shouldFinishTour: true, doShowProjectLoader: true}, doFork);
    } else {
      this.setState({doShowProjectLoader: true});
      doFork();
    }
  }

  openNewlyForkedProject (haikuProject, numAttempts, cb) {
    const forkedProjectName = haikuProject.projectName;
    const recheck = () => {
      if (numAttempts > MAX_FORK_ATTEMPTS) {
        return cb(new Error('unable to open forked project'));
      }

      setTimeout(() => {
        this.openNewlyForkedProject(haikuProject, numAttempts + 1);
      }, FORK_OPERATION_TIMEOUT);
    };

    this.envoyProject.getProject(forkedProjectName).then((forkedProject) => {
      if (!forkedProject.forkComplete) {
        recheck();
      } else {
        setTimeout(() => {
          this.launchProject(forkedProject, (launchError) => {
            if (launchError) {
              this.showForkingError();
            }
          });
        }, FORK_OPERATION_TIMEOUT);
      }
    }).catch(() => {
      this.showForkingError();
    });
  }

  teardownMaster ({shouldFinishTour}, cb) {
    ipcRenderer.send('protocol:unregister');
    this.setState({tearingDown: true});
    // Delete identifier not found notice on teardown
    this.deleteIdentifierNotFoundNotice();

    // We teardownMaster FIRST because we want to close the websocket connections before
    // destroying the webviews, which leads to EPIPE/"not opened" crashes.
    // Previously we were relying on dropped connections to deallocate websockets,
    // which made it difficult to know how to handle actual errors
    return this.props.websocket.request(
      {method: 'teardownMaster', params: [this.state.projectModel.getFolder()]},
      () => {
        logger.info('[creator] master torn down');
        this.setState({dashboardVisible: true, tearingDown: false, notices: []});
        this.onTimelineUnmounted();

        this.unsetAllProjectModelsState(this.state.projectModel.getFolder(), 'project:ready');
        this.unsetAllProjectModelsState(this.state.projectModel.getFolder(), 'component:mounted');

        if (shouldFinishTour) {
          this.tourChannel.finish(false);
        }

        this.state.projectModel.getAllActiveComponents().forEach((ac) => {
          if (ac.$instance) {
            ac.$instance.context.destroy();
          }
        });

        // The stale project doesn't want to receive methods destined for new project models
        if (this.state.projectModel) {
          this.state.projectModel.stopHandlingMethods();
        }

        // Clean up our litany of BaseModel extension collections in case an errant reload finds something better left
        // unfound.
        BaseModel.extensions.forEach((klass) => klass.purge());

        this.forceHideEventHandlersEditor();

        this.setState({
          projectModel: null,
          activeNav: 'library', // Prevents race+crash loading StateInspector when switching projects
          interactionMode: InteractionMode.GLASS_EDIT, // So that the asset library will not be obscured on reentry
        });

        window.Raven.setExtraContext({projectName: undefined, projectPath: undefined});

        if (cb) {
          cb();
        }
      },
    );
  }

  deleteIdentifierNotFoundNotice () {
    if (this.identifiersNotFoundNotice) {
      this.removeNotice(undefined, this.identifiersNotFoundNotice.id);
      this.identifiersNotFoundNotice = undefined;
    }
  }

  renderStartupDefaultScreen () {
    return (
      <div style={{position: 'absolute', width: '100%', height: '100%', backgroundColor: Palette.COAL}}>
        <div style={{position: 'absolute', width: '50%', height: '50%', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}>
          <Hai loop={true} sizing="contain" contextMenu="disabled" />
        </div>
        <div style={{color: '#FAFCFD', textAlign: 'center', display: 'inline-block', fontSize: '14px', width: '100%', height: 50, position: 'absolute', bottom: 50, left: 0}}>{this.state.softwareVersion}</div>
      </div>
    );
  }

  logOut = () => {
    if (this.user) {
      this.user.logOut().then(() => {
        this.clearAuth();
        mixpanel.haikuTrack('creator:project-browser:user-menu-option-selected', {
          option: 'logout',
        });

        ipcRenderer.send('topmenu:update', {
          projectsList: [],
          isSaving: false,
          isProjectOpen: false,
          isUserAuthenticated: false,
          subComponents: [],
          undoState: {canUndo: true, canRedo: true}, // allow undo/redo on login form.
        });
      });
    }
  };

  clearAuth () {
    this.setState({readyForAuth: true, isUserAuthenticated: false, username: ''});
  }

  tryToChangeCurrentActiveComponent (scenename) {
    // Delegate to Stage, as it contains nonSavedContentOnCodeEditor state
    this.refs.stage.tryToChangeCurrentActiveComponent(scenename);
  }

  showChangelogModal = () => {
    this.setState({showChangelogModal: true}, () => {
      const lastViewedChangelog = process.env.HAIKU_RELEASE_VERSION;
      this.setState({lastViewedChangelog});
      this.user.setConfig(UserSettings.LastViewedChangelog, lastViewedChangelog);
    });

    mixpanel.haikuTrack('creator:changelog:shown');
  };

  renderChangelogModal () {
    return this.state.showChangelogModal ? (
      <ChangelogModal
        onClose={() => {
          this.setState({showChangelogModal: false});
        }}
        lastViewedChangelog={this.state.lastViewedChangelog}
      />
    ) : null;
  }

  renderOfflineExportUpgradeModal () {
    return this.state.showOfflineExportUpgradeModal ? (
      <OfflineExportUpgradeModal
        onClose={() => {
          this.setState({showOfflineExportUpgradeModal: false});
        }}
        explorePro={this.explorePro}
        metadata={this.state.offlineExportUpgradeModalMetadata}
      />
    ) : null;
  }

  showNewProjectModal (isDuplicateProjectModal = false, duplicateProjectName = '', projectToDuplicate = null) {
    if (!this.envoyProject) {
      return;
    }
    this.setState({showNewProjectModal: true, isDuplicateProjectModal, duplicateProjectName, projectToDuplicate});
    mixpanel.haikuTrack('creator:new-project:shown');
  }

  hideNewProjectModal () {
    this.setState({showNewProjectModal: false, isDuplicateProjectModal: false, duplicateProjectName: null});
  }

  onCreateProject = (projectName, duplicate) => {
    this.createProject(projectName, duplicate, (err, projectObject) => {
      if (err) {
        this.hideNewProjectModal();
        return;
      }

      if (this.state.projectModel) {
        this.teardownMaster(
          {shouldFinishTour: true},
          () => {
            this.launchProject(projectObject, () => {});
          },
        );
      } else {
        this.launchProject(projectObject, () => {});
      }
    });
  };

  renderNewProjectModal () {
    return (
      this.state.showNewProjectModal && (
        <NewProjectModal
          defaultProjectName={this.state.duplicateProjectName}
          projectsList={this.state.projectsList}
          duplicate={this.state.isDuplicateProjectModal}
          onCreateProject={this.onCreateProject}
          onClose={() => {
            this.hideNewProjectModal();
          }}
        />
      )
    );
  }

  get proxyDescriptor () {
    // Note: in the current setup, we boot all users who are unable to connect directly to the local websocket server
    // before they can benefit from the pre-filling of of the proxy descriptor based on the proxy upgrade request
    // identified during bootup. If we ever figure out how to allow the socket traffic to flow through a proxy, as a
    // consolation prize for still forcing users to go through this config, the host and port should be prefilled!
    return describeProxyFromUrl(this.props.haiku.dotenv.http_proxy || this.props.haiku.proxy.url);
  }

  set proxyDescriptor (proxyDescriptor) {
    this.props.websocket.request(
      {
        method: 'setenv',
        params: [{
          http_proxy: buildProxyUrl(proxyDescriptor),
        }],
      },
      (error, dotenv) => {
        if (error) {
          mixpanel.haikuTrack('creator:proxy-settings:error', {error});
          logger.warn('[creator] unable to persist proxy settings', error);
          this.createNotice({
            type: 'error',
            title: 'Oh no!',
            message: 'We were unable to save your proxy settings. 😢 Please close and reopen the application and try again. If you still see this message, contact Haiku for support.',
            closeText: 'Okay',
            lightScheme: true,
          });
        } else {
          mixpanel.haikuTrack('creator:proxy-settings:saved');
          this.createNotice({
            type: 'info',
            title: 'Proxy settings saved!',
            message: 'If you are still unable to connect to Haiku, please exit Haiku and try again.',
            closeText: 'Okay',
            lightScheme: true,
          });
          Object.assign(this.props.haiku, {dotenv});
        }

        this.setState({
          showProxySettings: false,
        });
      },
    );
  }

  saveEventHandlers = (targetElement, serializedEvents) => {
    const selectorName = 'haiku:' + targetElement.getComponentId();
    this.getActiveComponent().batchUpsertEventHandlers(selectorName, serializedEvents, {from: 'creator'}, () => {});
  }

  forceHideEventHandlersEditor ({trySave} = {trySave: false}) {
    if (trySave && this.editor && !this.editor.canBeClosedExternally()) {
      this.editor.doSave();
    }

    this.setState({
      targetElement: null,
      showEventHandlerEditor: false,
      eventHandlerEditorOptions: {},
    });

    this.state.projectModel.broadcastPayload({
      name: 'event-handlers-editor-closed',
    });
  }

  safelyHideEventHandlersEditor = () => {
    if (this.editor && this.editor.canBeClosedExternally()) {
      mixpanel.haikuTrack('creator:hide-event-handlers-editor');
      this.forceHideEventHandlersEditor();
    }
  };

  showEventHandlersEditor (clickEvent, targetElement, options) {
    if (isPreviewMode(this.state.interactionMode) || !targetElement) {
      return;
    }

    mixpanel.haikuTrack('creator:show-event-handlers-editor');
    logger.info(`showing actions editor`, options);

    this.setState({
      targetElement,
      showEventHandlerEditor: true,
      eventHandlerEditorOptions: options,
    });

    this.state.projectModel.broadcastPayload({
      name: 'event-handlers-editor-open',
    });
  }

  handleShowEventHandlersEditor (elementUID, options, frame) {
    // The EventHandlerEditor uses this field to know whether to launch in frame mode vs event mode
    if (isNumeric(frame)) {
      options.frame = frame;
    }

    this.showEventHandlersEditor(
      null,
      this.getActiveComponent().findElementByUid(elementUID),
      options,
    );
  }

  handleShowConfirmGroupPopup (groupOrUngroup) {
    mixpanel.haikuTrack(`creator:show-confirm-group-ungroup-popup:${groupOrUngroup}`);
    this.setState({showConfirmGroupUngroupPopup: true, groupOrUngroup});
    this.state.projectModel.broadcastPayload({name: 'confirm-group-ungroup-popup-open', groupOrUngroup});
  }

  hideConfirmGroupUngroupPopup (userConfirmedGroup, groupOrUngroup) {
    if (userConfirmedGroup) {
      mixpanel.haikuTrack('creator:glass:group_upgroup_answer_y');
    } else {
      mixpanel.haikuTrack('creator:glass:group_upgroup_answer_n');
    }

    this.setState({showConfirmGroupUngroupPopup: false});
    this.state.projectModel.broadcastPayload({name: 'confirm-group-ungroup-popup-closed', confirmed: userConfirmedGroup, groupOrUngroup});
  }

  boundShowProxySettings = () => {
    this.showProxySettings();
  };

  conglomerateComponent = (
    {
      isBlankComponent,
      skipInstantiateInHost,
    } = {
      isBlankComponent: false,
      skipInstantiateInHost: false,
    },
  ) => {
    this.props.websocket.send({
      type: 'broadcast',
      from: 'creator',
      folder: this.state.projectModel.getFolder(),
      name: 'conglomerate-component',
      isBlankComponent,
      skipInstantiateInHost,
    });
  };

  get showAuthenticationUI () {
    return this.state.readyForAuth && (!this.state.isUserAuthenticated || !this.state.username);
  }

  get showGenericLoader () {
    return this.state.areProjectsLoading && this.state.hasLoadedOnce;
  }

  shouldShowProjectLoader () {
    return this.state.doShowProjectLoader || this.state.projectLaunching || this.showGenericLoader;
  }

  render () {
    if (this.state.showProxySettings) {
      return (
        <StyleRoot>
          <ProxySettingsScreen
            proxyDescriptor={this.proxyDescriptor}
            onSave={(proxyDescriptor) => {
              this.proxyDescriptor = proxyDescriptor;
            }}
          />
        </StyleRoot>
      );
    }

    if (this.props.haiku.proxy.active) {
      return <ProxyHelpScreen />;
    }

    if (this.showAuthenticationUI) {
      return (
        <StyleRoot>
          <AuthenticationUI
            ref="AuthenticationUI"
            onSubmit={this.authenticateUser}
            onSubmitSuccess={this.authenticationComplete}
            onShowProxySettings={this.boundShowProxySettings}
            resendEmailConfirmation={this.resendEmailConfirmation}
            {...this.props} />
        </StyleRoot>
      );
    }

    return (
      <div style={{position: 'relative', width: '100%', height: '100%'}}>
        <CSSTransition
          classNames="toast"
          timeout={{enter: 500, exit: 300}}
        >
          <div style={{position: 'absolute', right: 0, top: 44, width: 300}}>
            {lodash.map(this.state.notices, this.renderNotice)}
          </div>
        </CSSTransition>
        {this.renderChangelogModal()}
        {this.renderOfflineExportUpgradeModal()}
        {this.renderNewProjectModal()}
        {!this.state.tearingDown && this.envoyClient &&
          <Tour
            show={!this.shouldShowProjectLoader()}
            projectsList={this.state.projectsList}
            envoyClient={this.envoyClient}
            startTourOnMount={true}
          />
        }
        <AutoUpdater
          onComplete={this.onAutoUpdateCheckComplete}
          check={this.state.updater.shouldCheck}
          skipOptIn={this.state.updater.shouldSkipOptIn}
          runOnBackground={this.state.updater.shouldRunOnBackground}
        />
        {this.state.dashboardVisible && this.envoyClient && this.envoyProject && this.state.username && <ProjectBrowser
          ref="ProjectBrowser"
          explorePro={this.explorePro}
          areProjectsLoading={this.state.areProjectsLoading}
          isOnline={this.state.isOnline}
          allowOffline={this.state.allowOffline}
          envoyProject={this.envoyProject}
          onShowProxySettings={this.boundShowProxySettings}
          onProjectsList={this.onProjectsList}
          onShowNewProjectModal={(...args) => {
            this.showNewProjectModal(...args);
          }}
          lastViewedChangelog={this.state.lastViewedChangelog}
          onShowChangelogModal={this.showChangelogModal}
          privateProjectLimit={this.state.privateProjectLimit}
          showChangelogModal={this.state.showChangelogModal}
          username={this.state.username}
          softwareVersion={this.state.softwareVersion}
          organizationName={this.state.organizationName}
          isAdmin={this.state.isAdmin}
          loadProjects={this.loadProjects}
          launchProject={this.launchProject}
          createNotice={this.createNotice}
          logOut={this.logOut}
          envoyClient={this.envoyClient}
          {...this.props} />
        }
        <ProjectLoader show={this.shouldShowProjectLoader()}>
          {this.showGenericLoader
            ? <div style={{color: '#FAFCFD', textAlign: 'center', display: 'inline-block', fontSize: '14px', width: '100%', height: 50, position: 'absolute', bottom: 50, left: 0}}>{this.state.softwareVersion}</div>
            : <span style={{marginTop: 450, zIndex: 1}}>Initializing project…</span>
          }
        </ProjectLoader>
        {!this.state.dashboardVisible && !this.state.doShowProjectLoader && this.state.projectModel && <div style={{position: 'absolute', width: '100%', height: '100%', top: 0, left: 0}}>
          <div className="layout-box" style={{overflow: 'visible'}}>
            <SplitPanel split="horizontal" minSize={300} defaultSize={'62vh'}>
              <SplitPanel split="vertical" minSize={300} defaultSize={300}>
                <SideBar
                  isPro={this.state.privateProjectLimit == null}
                  projectModel={this.state.projectModel}
                  switchActiveNav={this.switchActiveNav}
                  onNavigateToDashboard={this.onNavigateToDashboard}
                  activeNav={this.state.activeNav}>
                  {
                    isPreviewMode(this.state.interactionMode) && (
                      <div
                        style={{
                          opacity: 0.6,
                          position: 'absolute',
                          top: 34,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          zIndex: 999999,
                          backgroundColor: Palette.COAL,
                        }}
                        onClick={this.setGlassInteractionToEditMode}
                      />
                    )
                  }
                  <Library
                    servicesEnvoyClient={this.state.servicesEnvoyClient}
                    user={this.user}
                    projectModel={this.state.projectModel}
                    layout={this.layout}
                    folder={this.state.projectFolder}
                    haiku={this.props.haiku}
                    websocket={this.props.websocket}
                    onDragEnd={this.onLibraryDragEnd}
                    onDragStart={this.onLibraryDragStart}
                    createNotice={this.createNotice}
                    removeNotice={this.removeNotice}
                    conglomerateComponent={this.conglomerateComponent}
                    visible={this.state.activeNav === 'library'} />
                  <StateInspector
                    projectModel={this.state.projectModel}
                    createNotice={this.createNotice}
                    removeNotice={this.removeNotice}
                    folder={this.state.projectFolder}
                    websocket={this.props.websocket}
                    visible={this.state.activeNav === 'state_inspector'} />
                </SideBar>
                <div style={{position: 'relative', width: '100%', height: '100%'}}>
                    {
                      !isPreviewMode(this.state.interactionMode) && (
                        <EventHandlerEditor
                          element={this.state.targetElement}
                          save={this.saveEventHandlers}
                          close={this.safelyHideEventHandlersEditor}
                          visible={this.state.showEventHandlerEditor}
                          options={this.state.eventHandlerEditorOptions}
                          ref={(editor) => {
                            this.editor = editor;
                          }}
                        />
                      )
                    }
                    {
                      this.state.showConfirmGroupUngroupPopup &&
                        <ConfirmGroupUngroupPopup
                          user={this.user}
                          setGroupUngroupAnswerAndClose={this.hideConfirmGroupUngroupPopup}
                          groupOrUngroup={this.state.groupOrUngroup}
                        />
                    }
                  <Stage
                    ref="stage"
                    supportOfflineExport={this.state.allowOffline}
                    explorePro={this.explorePro}
                    folder={this.state.projectFolder}
                    envoyProject={this.envoyProject}
                    envoyExporter={this.envoyExporter}
                    projectModel={this.state.projectModel}
                    envoyClient={this.envoyClient}
                    haiku={this.props.haiku}
                    websocket={this.props.websocket}
                    project={this.state.projectObject}
                    createNotice={this.createNotice}
                    removeNotice={this.removeNotice}
                    organizationName={this.state.organizationName}
                    username={this.state.username}
                    isTimelineReady={this.state.isTimelineReady}
                    interactionMode={this.state.interactionMode}
                    onShowEventHandlerEditor={this.handleShowEventHandlersEditor}
                    onPreviewModeToggled={this.togglePreviewMode}
                    privateProjectLimit={this.state.privateProjectLimit}
                    updateProjectObject={(changes) => {
                      this.setState({
                        projectObject: Object.assign({}, this.state.projectObject, changes),
                      });
                    }}
                    artboardDimensions={this.state.artboardDimensions}
                    setGlassInteractionToPreviewMode={this.setGlassInteractionToPreviewMode}
                    setGlassInteractionToEditMode={this.setGlassInteractionToEditMode}
                    setGlassInteractionToCodeEditorMode={this.setGlassInteractionToCodeEditorMode}
                    tryToChangeCurrentActiveComponent={this.tryToChangeCurrentActiveComponent}
                    showEventHandlerEditor={this.state.showEventHandlerEditor}
                    conglomerateComponent={this.conglomerateComponent}
                  />
                  {(this.state.assetDragging)
                    ? <div style={{width: '100%', height: '100%', backgroundColor: 'white', opacity: 0.01, position: 'absolute', top: 0, left: 0}} />
                    : ''}
                </div>
              </SplitPanel>
              <div
                id="timeline-container"
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                }}>
                <div
                  id="timeline-wrapper"
                  style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    top: '0px',
                    overflow: 'auto',
                  }}>
                  <Timeline
                    ref="timeline"
                    folder={this.state.projectFolder}
                    envoyClient={this.envoyClient}
                    haiku={this.props.haiku}
                    username={this.state.username}
                    organizationName={this.state.organizationName}
                    createNotice={this.createNotice}
                    removeNotice={this.removeNotice}
                    onReady={this.onTimelineMounted} />
                </div>
              </div>
            </SplitPanel>
          </div>
        </div>}
        {this.state.tearingDown && <div style={DASH_STYLES.dashOverlay} />}
        {this.state.showFailWhale && <FailWhale restart={this.restart} uniqueId={this.state.failWhaleUniqueId} />}
      </div>
    );
  }
}
