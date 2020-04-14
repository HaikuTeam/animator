import * as React from 'react';
import * as lodash from 'lodash';
import * as path from 'path';
import HaikuDOMRenderer from '@haiku/core/lib/renderers/dom';
import HaikuContext from '@haiku/core/lib/HaikuContext';
import * as BaseModel from 'haiku-serialization/src/bll/BaseModel';
import * as Project from 'haiku-serialization/src/bll/Project';
import Config from '@haiku/core/lib/Config';
import * as Element from 'haiku-serialization/src/bll/Element';
import * as File from 'haiku-serialization/src/bll/File';
import * as Template from 'haiku-serialization/src/bll/Template';
import * as ElementSelectionProxy from 'haiku-serialization/src/bll/ElementSelectionProxy';
import * as Asset from 'haiku-serialization/src/bll/Asset';
import * as EmitterManager from 'haiku-serialization/src/utils/EmitterManager';
import {isCoordInsideBoxPoints} from 'haiku-serialization/src/bll/MathUtils';
import Palette from 'haiku-ui-common/lib/Palette';
import Preview from './Preview';
import CreateComponentModal from './modals/CreateComponentModal';
import PopoverMenu from 'haiku-ui-common/lib/electron/PopoverMenu';
import {ComponentIconSVG} from 'haiku-ui-common/lib/react/OtherIcons';
import * as requestElementCoordinates from 'haiku-serialization/src/utils/requestElementCoordinates';
import {Experiment, experimentIsEnabled} from 'haiku-common/lib/experiments';
import originMana from '../overlays/originMana';
import controlPointMana from '../overlays/controlPointMana';
import boxMana from '../overlays/boxMana';
import lineMana from '../overlays/lineMana';
import defsMana from '../overlays/defsMana';
import rotationCursorMana from '../overlays/rotationCursorMana';
import scaleCursorMana from '../overlays/scaleCursorMana';
import * as logger from 'haiku-serialization/src/utils/LoggerInstance';
import {isMac, isWindows} from 'haiku-common/lib/environments/os';
import directSelectionMana from '../overlays/directSelectionMana';
import {calculateValue} from '@haiku/core/lib/Transitions';
import {
  DEFAULT_LINE_SELECTION_THRESHOLD,
  isPointInsidePrimitive,
  isPointAlongStroke,
  transform2DPoint,
  closestNormalPointOnLineSegment,
  buildPathLUT,
} from 'haiku-common/lib/math/geometryUtils';
import SVGPoints from '@haiku/core/lib/helpers/SVGPoints';
import {splitSegmentInSVGPoints, distance} from '@haiku/core/lib/helpers/PathUtils';
import Globals from 'haiku-ui-common/lib/Globals';
import * as mixpanel from 'haiku-serialization/src/utils/Mixpanel';
import {clipboard, shell, remote, ipcRenderer} from 'electron';

import * as fse from 'haiku-fs-extra';
import * as moment from 'moment';
import {HOMEDIR_PATH} from 'haiku-serialization/src/utils/HaikuHomeDir';
import EnvoyClient from 'haiku-sdk-creator/lib/envoy/EnvoyClient';
import {ERROR_CHANNEL} from 'haiku-sdk-creator/lib/bll/Error';

// #FIXME: Why is this the responsibility of Glass???
fse.mkdirpSync(HOMEDIR_PATH);

// Useful debugging originator of calls in shared model code
process.env.HAIKU_SUBPROCESS = 'glass';

const MAX_Z_INDEX = 1000000;

const POINTS_THRESHOLD_REDUCED = 20; // Display only the corner control points
const POINTS_THRESHOLD_NONE = 8; // Display no control points nor line

const POINT_DISPLAY_MODES = {
  NORMAL: [1, 1, 1, 1, 1, 1, 1, 1, 1],
  REDUCED_ON_TOP_BOTTOM: [1, 0, 1, 1, 0, 1, 1, 0, 1],
  REDUCED_ON_LEFT_RIGHT: [1, 1, 1, 0, 0, 0, 1, 1, 1],
  REDUCED_ON_BOTH: [1, 0, 1, 0, 0, 0, 1, 0, 1],
  NONE: [0, 0, 0, 0, 0, 0, 0, 0, 0],
};

const SELECTION_TYPES = {
  ON_STAGE_CONTROL: 'on_stage_control',
};

const MENU_ACTION_DEBOUNCE_TIME = 100;
const DIMENSIONS_RESET_DEBOUNCE_TIME = 100;
const BIG_NUMBER = 99999;
const HAIKU_ID_ATTRIBUTE = 'haiku-id';
const HAIKU_SOURCE_ATTRIBUTE = 'haiku-source';

const DOUBLE_CLICK_THRESHOLD_MS = 250;

const DIRECT_SELECTION_MULTIPLE_SELECTION_ALLOWED = {
  line: true,
  polyline: true,
  polygon: true,
  path: true,
};

// Percent increase/decrease for each Zoom in/Zoom out
const MOUSE_WHEEL_ZOOM_FACTOR = 0.50;
const SHORTCUT_ZOOM_FACTOR = 0.25;

const niceTimestamp = () => {
  return moment().format('YYYY-MM-DD-HHmmss');
};

const writeHtmlSnapshot = (html, react) => {
  fse.mkdirpSync(path.join(HOMEDIR_PATH, 'snapshots'));
  const filename = (react.props.projectName || 'Unknown') + '-' + niceTimestamp() + '.html';
  const filepath = path.join(HOMEDIR_PATH, 'snapshots', filename);
  fse.outputFile(filepath, html, (err) => {
    if (err) {
      return void (0);
    }
    shell.openItem(filepath);
  });
};

// The class is exported also _without_ the radium wrapper to allow jsdom testing
export class Glass extends React.Component {
  constructor (props) {
    super(props);

    EmitterManager.extend(this);

    this.state = {
      controlActivation: null,
      mousePositionCurrent: null,
      mousePositionPrevious: null,
      isAnythingScaling: false,
      isAnythingRotating: false,
      hoveredControlPointIndex: null,
      hoveredDirectSelectionPointIndex: null,
      isOriginPanning: false,
      globalControlPointHandleClass: '',
      isStageSelected: false,
      isStageNameHovering: false,
      isMouseDown: false,
      lastMouseDownTime: null,
      lastMouseDownPosition: null,
      lastMouseUpPosition: null,
      lastMouseUpTime: null,
      isMouseDragging: false,
      targetElement: null,
      isEventHandlerEditorOpen: false,
      isCreateComponentModalOpen: false,
      isConfirmGroupUngroupPopupOpen: false,
      conglomerateComponentOptions: {},
    };

    this.didAlreadyWarnAboutTextNodes = false;

    Project.setup(
      this.props.folder,
      'glass',
      this.props.websocket,
      window,
      this.props.userconfig,
      {}, // fileOptions
      this.props.envoy,
      (err, project) => {
        if (err) {
          throw err;
        }
        this.handleProjectReady(project);
      },
    );

    this.handleRequestElementCoordinates = this.handleRequestElementCoordinates.bind(this);

    this.handleDimensionsReset = lodash.debounce(() => {
      // Need to notify creator of viewport change so instantiation position is correct;
      // this event is also called whenever the window is resized
      const artboard = this.getActiveComponent().getArtboard();

      this.props.websocket.send({
        type: 'broadcast',
        name: 'dimensions-reset',
        from: 'glass',
        data: {
          zoom: artboard.getZoom(),
          rect: artboard.getRect(),
        },
      });
    }, DIMENSIONS_RESET_DEBOUNCE_TIME);

    this._playing = false;
    this._stopwatch = null;
    this._lastAuthoritativeFrame = 0;

    this.didDragSinceLastMouseDown = false;

    this.drawLoop = this.drawLoop.bind(this);
    this.draw = this.draw.bind(this);

    this.handleGroupDebounced = lodash.debounce(() => this.handleGroup(), MENU_ACTION_DEBOUNCE_TIME, {leading: true, trailing: false});
    this.handleUngroupDebounced = lodash.debounce(() => this.handleUngroup(), MENU_ACTION_DEBOUNCE_TIME, {leading: true, trailing: false});
    this.handleCutDebounced = lodash.debounce(() => this.handleCut(), MENU_ACTION_DEBOUNCE_TIME, {leading: true, trailing: false});
    this.handleCopyDebounced = lodash.debounce(() => this.handleCopy(), MENU_ACTION_DEBOUNCE_TIME, {leading: true, trailing: false});
    this.handlePasteDebounced = lodash.debounce(() => this.handlePaste(), MENU_ACTION_DEBOUNCE_TIME, {leading: true, trailing: false});
    this.handleSelectAllDebounced = lodash.debounce(() => this.handleSelectAll(), MENU_ACTION_DEBOUNCE_TIME, {leading: true, trailing: false});
    this.handleUndoDebounced = lodash.debounce((payload) => this.handleUndo(payload), MENU_ACTION_DEBOUNCE_TIME, {leading: true, trailing: false});
    this.handleRedoDebounced = lodash.debounce((payload) => this.handleRedo(payload), MENU_ACTION_DEBOUNCE_TIME, {leading: true, trailing: false});

    if (process.env.NODE_ENV !== 'production') {
      // For debugging
      window.glass = this;
      window.view = this; // Easy to run same instruction in different tools
    }

    // TODO: Is there any race condition with kicking this off immediately?
    this.drawLoop();

    // Leaky abstraction: we bind control point hover behaviors to superglobals because we use @haiku/core to render
    // control points as complex SVGs without a timeline. Ideally we would represent the entire box points overlay as a
    // single Haiku component and subscribe to regular events.
    window.hoverControlPoint = (hoveredControlPointIndex) => {
      this.setState({
        hoveredControlPointIndex,
      });
    };
    window.unhoverControlPoint = () => {
      this.setState({
        hoveredControlPointIndex: null,
      });
    };
    window.hoverDirectSelectionPoint = (hoveredDirectSelectionPointIndex) => {
      this.setState({
        hoveredDirectSelectionPointIndex,
      });
    };
    window.unhoverDirectSelectionPoint = () => {
      if (this.state.isMouseDragging) {
        return;
      }
      this.setState({
        hoveredDirectSelectionPointIndex: null,
      });
    };
  }

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

  awaitRef (name, cb) {
    if (this.refs[name]) {
      return cb(this.refs[name]);
    }
    return setTimeout(() => {
      this.awaitRef(name, cb);
    }, 100);
  }

  getActiveComponent () {
    return this.project && this.project.getCurrentActiveComponent();
  }

  handleProjectReady (project) {
    this.project = project;

    this.addEmitterListenerIfNotAlreadyRegistered(this.project, 'envoy:timelineClientReady', (timelineChannel) => {
      timelineChannel.on('didPlay', this.handleTimelineDidPlay.bind(this));
      timelineChannel.on('didPause', this.handleTimelineDidPause.bind(this));
      timelineChannel.on('didSeek', this.handleTimelineDidSeek.bind(this));
    });

    this.addEmitterListenerIfNotAlreadyRegistered(this.project, 'envoy:tourClientReady', (client) => {
      this.tourClient = client;
      this.tourClient.on('tour:requestElementCoordinates', this.handleRequestElementCoordinates);
    });

    this.addEmitterListenerIfNotAlreadyRegistered(this.project, 'update', (what, ...args) => {
      if (!this.getActiveComponent()) {
        return;
      }

      switch (what) {
        case 'updateMenu':
          this.updateMenu();
          break;
        case 'setCurrentActiveComponent':
          this.handleActiveComponentReady();
          break;
        case 'application-mounted':
          this.handleHaikuComponentMounted();
          break;
        case 'dimensions-changed':
          this.resetContainerDimensions();
          this.forceUpdate();
          break;
        case 'setInteractionMode':
          this.handleInteractionModeChange();
          break;
        case 'dimensions-reset':
          this.handleDimensionsReset();
          break;
      }
    });

    this.addEmitterListenerIfNotAlreadyRegistered(this.project, 'remote-update', (what, ...args) => {
      switch (what) {
        case 'updateMenu':
          this.updateMenu();
          break;
        case 'setCurrentActiveComponent':
          this.handleActiveComponentReady();
          break;
        case 'setInteractionMode':
          this.handleInteractionModeChange();
          break;
        case 'mergeDesigns':
          Element.directlySelected = null;
          break;
        case 'setLockedStatusForComponent':
          // Unselect element after locking it
          const lockedElement = this.getActiveComponent().findElementByComponentId(args[1]);
          if (args[2] && lockedElement && lockedElement._isSelected) {
            lockedElement.unselectSoftly({from: 'glass'});
          }
          break;
      }
    });

    this.addEmitterListenerIfNotAlreadyRegistered(this.project, 'change-authoritative-frame', (frame) => {
      this.handleTimelineDidSeek({frame});
    });

    // When all views send this, we know it's ok to initialize the 'main' component
    this.project.broadcastPayload({
      name: 'project-state-change',
      what: 'project:ready',
    });

    // When developing Glass in standalone, this env var directs it to automatically
    // set the current active component, which is normally initiated by Creator
    if (process.env.AUTOSTART) {
      this.project.setCurrentActiveComponent(process.env.AUTOSTART, {from: 'glass'}, () => {});
    }
  }

  updateMenu () {
    ipcRenderer.send('topmenu:update', this.project.describeTopMenu());
  }

  handleActiveComponentReady () {
    // Reset direct selection before mounting new component
    Element.directlySelected = null;

    this.mountHaikuComponent();
    this.updateMenu();
  }

  mountHaikuComponent () {
    this.awaitRef('mount', (ref) => {
      this.getActiveComponent().mountApplication(ref, {
        freeze: true,
        overflowX: 'visible',
        overflowY: 'visible',
        contextMenu: 'disabled',
      });
    });
  }

  handleHaikuComponentMounted () {
    this.project.broadcastPayload({
      name: 'project-state-change',
      what: 'component:mounted',
      scenename: this.getActiveComponent().getSceneName(),
    });
  }

  handleInteractionModeChange () {
    if (this.isPreviewMode()) {
      this._playing = false;
    }

    this.forceUpdate();
  }

  handleRequestElementCoordinates ({selector, webview}) {
    requestElementCoordinates({
      currentWebview: 'glass',
      requestedWebview: webview,
      selector,
      shouldNotifyEnvoy:
        this.tourClient &&
        this.project.getEnvoyClient() &&
        !this.project.getEnvoyClient().isInMockMode(),
      tourClient: this.tourClient,
    });
  }

  handleTimelineDidPlay () {
    const ac = this.getActiveComponent();
    if (ac) {
      ac.setHotEditingMode(false);
    }
    this._playing = true;
    this._stopwatch = Date.now();
  }

  handleTimelineDidPause (frameData) {
    if (!this._playing) {
      // If we have already been paused by a higher level event (e.g. toggling preview mode), do nothing.
      return;
    }
    const ac = this.getActiveComponent();
    // Ensure preview mode is inactive before activating hot editing mode. If we toggle preview mode on during timeline
    // playback, we will typically receive the pause *after* the interaction mode change.
    if (ac && !ac.isPreviewModeActive()) {
      ac.setHotEditingMode(true);
    }
    this._playing = false;
    this._lastAuthoritativeFrame = frameData.frame;
    this._stopwatch = Date.now();
  }

  handleTimelineDidSeek (frameData) {
    this._lastAuthoritativeFrame = frameData.frame;
    this._stopwatch = Date.now();
  }

  /**
   * @method handleFrameChange
   * @description This method is called continuously as part of the glass draw loop.
   * The purpose is to allow the glass to play the animation smoothly at 60fps even when
   * "move to frame x" updates originating from other processes don't arrive fast enough.
   * Basically, play the animation and use the most recently received authoritative frame
   * as a guideline for what time to seek to. An important side effect is that if you
   * want to set the timeline time programmatically in glass, you also need to ensure that
   * the _lastAuthoritativeFrame value is updated otherwise your setting will get
   * overridden by this loop.
   */
  handleFrameChange () {
    let seekMs = 0;

    // this._stopwatch is null unless we've received an action from the timeline.
    // If we're developing the glass solo, i.e. without a connection to envoy which
    // provides the system clock, we can just lock the time value to zero as a hack.
    // TODO: Would be nice to allow full-fledged solo development of glass...
    if (this._stopwatch !== null) {
      // TODO: support variable fps
      seekMs = (this._lastAuthoritativeFrame * 1000 / 60) + (this._playing ? Date.now() - this._stopwatch : 0);
    }

    // This rounding is required otherwise we'll see bizarre behavior on stage.
    // I think it's because some part of the player's caching or transition logic
    // which wants things to be round numbers. If we don't round this, i.e. convert
    // 16.666 -> 17 and 33.333 -> 33, then the player won't render those frames,
    // which means the user will have trouble moving things on stage at those times.
    seekMs = Math.round(seekMs);

    if (this.getActiveComponent()) {
      this.getActiveComponent().setTimelineTimeValue(seekMs);
    }
  }

  draw () {
    if (this.refs.overlay) {
      this.drawOverlays();
    }
  }

  drawLoop () {
    if (this.getActiveComponent()) {
      // We handle a frame change here since authoritative frame updates
      // are received async and we need to update according to the delta
      this.handleFrameChange();
      this.draw();
    }
    window.requestAnimationFrame(this.drawLoop.bind(this));
  }

  handleSnapsUpdated (newSnaps) {
    this.setState({snapLines: newSnaps});
  }

  componentDidMount () {
    if (!this.props.envoy.mock) {
      this.envoyClient = new EnvoyClient({
        token: this.props.envoy.token,
        port: this.props.envoy.port,
        host: this.props.envoy.host,
        WebSocket: window.WebSocket,
      });

      this.envoyClient.get(ERROR_CHANNEL).then((error) => {
        if (global.sentryReporter) {
          global.sentryReporter.envoy = error;
        }
      });
    }

    const resetKeyStates = () => {
      Globals.allKeysUp();

      this.setState({
        snapLines: [],
        controlActivation: null,
        isAnythingScaling: false,
        isAnythingRotating: false,
        globalControlPointHandleClass: '',
        isStageSelected: false,
        isStageNameHovering: false,
        isMouseDown: false,
        isMouseDragging: false,
      });
    };

    // If the user e.g. Cmd+tabs away from the window
    this.addEmitterListener(window, 'blur', () => {
      resetKeyStates();
    });

    this.addEmitterListener(window, 'focus', () => {
      resetKeyStates();

      this.props.websocket.send({
        type: 'broadcast',
        name: 'ui:hide-intercom',
        from: 'glass',
      });
    });

    this.addEmitterListener(window, 'dragover', Asset.preventDefaultDrag, false);

    this.addEmitterListener(
      window,
      'drop',
      (event) => {
        this.project.linkExternalAssetOnDrop(event, (error) => {
          if (error) {
            this.setState({error});
          }
          this.forceUpdate();
        });
      },
      false,
    );

    this.addEmitterListener(document, 'mousewheel', (evt) => {
      if (
        !this.getActiveComponent() || // on mac, this is triggered by a two-finger pan
        this.state.isEventHandlerEditorOpen
      ) {
        return;
      }

      if (experimentIsEnabled(Experiment.PinchToZoomInGlass) && (evt.ctrlKey || evt.metaKey)) {
        return this.handlePinchToZoom(evt);
      }

      const artboard = this.getActiveComponent().getArtboard();
      // The 0.4 coefficient here adjusts the pan speed down, and can be adjusted if desired. Larger numbers result in
      // faster panning.
      const SCROLL_PAN_COEFFICIENT = 0.4 * artboard.getZoom();
      artboard.snapshotOriginalPan();
      this.performPan(evt.wheelDeltaX * SCROLL_PAN_COEFFICIENT, evt.wheelDeltaY * SCROLL_PAN_COEFFICIENT);
    }, false);

    this.addEmitterListener(this.props.websocket, 'relay', (message) => {
      logger.info('relay received', message.name, 'from', message.from);

      switch (message.name) {
        case 'global-menu:open-dev-tools':
          remote.getCurrentWebContents().openDevTools();
          break;

        case 'global-menu:close-dev-tools':
          if (remote.getCurrentWebContents().isDevToolsFocused()) {
            remote.getCurrentWebContents().closeDevTools();
          }
          break;

        case 'global-menu:zoom-in':
          mixpanel.haikuTrack('creator:glass:zoom-in');
          const component = this.getActiveComponent();
          if (component) {
            component.getArtboard().zoomIn(1 + SHORTCUT_ZOOM_FACTOR);
          }
          break;

        case 'global-menu:zoom-out':
          mixpanel.haikuTrack('creator:glass:zoom-out');
          const component = this.getActiveComponent();
          if (component) {
            component.getArtboard().zoomOut(1 + SHORTCUT_ZOOM_FACTOR);
          }
          break;

        case 'global-menu:reset-viewport':
          mixpanel.haikuTrack('creator:glass:reset-viewport');
          const component = this.getActiveComponent();
          if (component) {
            component.getArtboard().resetZoomPan();
          }
          break;

        case 'global-menu:set-active-component':
          this.project.setCurrentActiveComponent(message.data, {from: 'glass'}, () => {});
          break;

        case 'global-menu:group':
          this.handleGroupDebounced();
          break;

        case 'global-menu:ungroup':
          this.handleUngroupDebounced();
          break;

        case 'global-menu:cut':
          const proxy = this.fetchProxyElementForSelection();
          if (proxy && proxy.hasAnythingInSelectionButNotArtboard()) {
            this.handleCutDebounced();
          }
          break;

        case 'global-menu:copy':
          const proxy = this.fetchProxyElementForSelection();
          if (proxy && proxy.hasAnythingInSelectionButNotArtboard()) {
            this.handleCopyDebounced();
          }
          break;

        case 'global-menu:paste':
          this.handlePasteDebounced();
          break;

        case 'global-menu:selectAll':
          this.handleSelectAllDebounced();
          break;

        case 'global-menu:undo':
          this.handleUndoDebounced(message);
          break;

        case 'global-menu:redo':
          this.handleRedoDebounced(message);
          break;

        case 'global-menu:preview':
          // This hook is only used for internal development
          if (this.project) {
            this.project.toggleInteractionMode({from: 'glass'}, () => {
              this.handleInteractionModeChange();
            });
          }
          break;
      }
    });

    this.addEmitterListener(this.props.websocket, 'broadcast', (message) => {
      switch (message.name) {
        case 'remote-model:receive-sync':
          BaseModel.receiveSync(message);
          break;

        case 'component:reload':
          // Race condition where Master emits this event during initial load of assets in
          // a project, resulting in this message arriving before we've initialized
          if (this.getActiveComponent()) {
            return this.getActiveComponent().moduleReplace((err) => {
              // Notify the plumbing that the module replacement here has finished;
              // Note how we do this whether or not we got an error from the action
              this.props.websocket.send({
                type: 'broadcast',
                name: 'component:reload:complete',
                from: 'glass',
              });

              if (err) {
                logger.error(err);
                return;
              }

              this.getActiveComponent().getArtboard().updateMountSize(this.refs.container);
            });
          }

          logger.warn('active component not initialized; cannot reload');
          return;

        case 'event-handlers-editor-open':
          this.setState({isEventHandlerEditorOpen: true});
          break;

        case 'event-handlers-editor-closed':
          this.setState({isEventHandlerEditorOpen: false});
          break;

        case 'confirm-group-ungroup-popup-open':
          this.setState({isConfirmGroupUngroupPopupOpen: true});
          break;

        case 'confirm-group-ungroup-popup-closed':
          this.setState({isConfirmGroupUngroupPopupOpen: false});
          if (message.confirmed) {
            if (message.groupOrUngroup === 'group') {
              this.executeGroup();
            } else if (message.groupOrUngroup === 'ungroup') {
              this.executeUngroup();
            }
          }
          break;

        case 'instantiate-component':
          const component = this.getActiveComponent();

          if (component) {
            Element.where({component, _isSelected: true}).forEach((element) => {
              element.unselectSoftly({from: 'glass'});
            });

            component.instantiateComponent(
              message.relpath,
              message.coords || {},
              {from: 'glass'},
              (err, mana) => {
                if (err) {
                  if (err.code === 'ENOENT') {
                    console.error('We couldn\'t find that component. 😩 Please try again in a few moments. If you still see this error, contact Haiku for support.');
                  } else {
                    console.error(err.message);
                  }
                  return;
                }

                let foundTextNode = false;

                Template.visitWithoutDescendingIntoSubcomponents(mana, (node) => {
                  if (
                    node &&
                    node.elementName === 'text' ||
                    node.elementName === 'tspan'
                  ) {
                    foundTextNode = true;
                  }
                });

                if (foundTextNode && !this.didAlreadyWarnAboutTextNodes) {
                  this.didAlreadyWarnAboutTextNodes = true;

                  // The '[notice]' substring tells Creator to display a toast
                  console.info(`
                    [notice] ⚠️ You placed an element that contains text.
                    Since fonts on your system may not be available everywhere,
                    we recommend converting all text to outlines.
                    `.trim().replace(/\s+/g, ' '),
                  );
                }
              },
            );
          }
          break;

        case 'edit-component':
          this.editComponent(this.fetchProxyElementForSelection().getSingleComponentElementRelpath());
          break;

        case 'conglomerate-component':
          this.setState({
            conglomerateComponentOptions: {
              isBlankComponent: message.isBlankComponent,
              skipInstantiateInHost: message.skipInstantiateInHost,
            },
          }, () => {
            this.launchComponentNameModal();
          });
          break;

        case 'perform-align':
          this.fetchProxyElementForSelection().align(message.xEdge, message.yEdge, message.toStage);
          break;

        case 'perform-distribute':
          this.fetchProxyElementForSelection().distribute(message.xEdge, message.yEdge, message.toStage);
          break;

        case 'assets-changed':
          File.cache.clear();
          break;
      }
    });

    this.addEmitterListener(window, 'resize', lodash.throttle(() => {
      this.handleWindowResize();
    }), 64);

    this.addEmitterListener(window, 'mouseup', this.windowMouseUpHandler.bind(this));

    this.addEmitterListener(window, 'mousemove', lodash.throttle((mouseMoveEvent) => {
      this.windowMouseMoveHandler(mouseMoveEvent);
    }, 32));

    this.addEmitterListener(window, 'dblclick', this.windowDblClickHandler.bind(this));
    this.addEmitterListener(window, 'keydown', this.windowKeyDownHandler.bind(this));
    this.addEmitterListener(window, 'keyup', this.windowKeyUpHandler.bind(this));
    if (experimentIsEnabled(Experiment.OutliningElementsOnStageFromStage)) {
      this.addEmitterListener(window, 'mouseover', this.windowMouseOverHandler.bind(this));
    }
    // When the mouse is clicked, below is the order that events fire
    this.addEmitterListener(window, 'mousedown', this.windowMouseDownHandler.bind(this));
    this.addEmitterListener(window, 'mouseup', this.windowMouseUpHandler.bind(this));
    this.addEmitterListener(window, 'click', this.windowClickHandler.bind(this));
    this.addEmitterListener(window, 'contextmenu', (contextmenuEvent) => {
      // Don't show the context menu if our editor is open
      if (this.isPreviewMode() || this.state.isEventHandlerEditorOpen) {
        return;
      }

      contextmenuEvent.preventDefault();

      this.setState({
        isAnythingScaling: false,
        isAnythingRotating: false,
        isStageSelected: false,
        isStageNameHovering: false,
        isMouseDown: false,
        isMouseDragging: false,
      });
    }, false);
  }

  componentWillUnmount () {
    this.removeEmitterListeners();
    this.tourClient.off('tour:requestElementCoordinates', this.handleRequestElementCoordinates);
    this.project.getEnvoyClient().closeConnection();
  }

  renderSnapLines (overlays) {
    if (
      !this.state.isMouseDown ||
      !experimentIsEnabled(Experiment.Snapping) ||
      ElementSelectionProxy.snaps.length === 0 ||
      Globals.isSpecialKeyDown() ||
      Globals.isSpaceKeyDown ||
      this.isMarqueeActive()
    ) {
      return;
    }

    const children = [];

    ElementSelectionProxy.snaps.forEach((snap) => {
      if (snap.direction === 'HORIZONTAL') {
        children.push({
          elementName: 'line',
          attributes: {
            x1: -5000,
            x2: 5000,
            y1: snap.positionWorld,
            y2: snap.positionWorld,
            'stroke-width': 1.25,
            'vector-effect': 'non-scaling-stroke',
            stroke: Palette.LIGHT_BLUE,
          },
        });
      } else {
        children.push({
          elementName: 'line',
          attributes: {
            x1: snap.positionWorld,
            x2: snap.positionWorld,
            y1: -5000,
            y2: 5000,
            'stroke-width': 1.25,
            'vector-effect': 'non-scaling-stroke',
            stroke: Palette.LIGHT_BLUE,
          },
        });
      }
    });

    overlays.push({
      elementName: 'g',
      attributes: {
        style: {
          pointerEvents: 'none',
          zIndex: MAX_Z_INDEX - 2,
        },
      },
      children,
    });
  }

  interpolateAttributesAtKeyframes (el, attributes) {
    const curKeys = {};
    const uniqueMs = {};
    for (const i in attributes) {
      curKeys[attributes[i]] = el.getPropertyKeyframesObject(attributes[i]);
      for (const ms in curKeys[attributes[i]]) {
        uniqueMs[ms] = true;
      }
    }

    // Find the value of every attribute at every unique ms
    const uniqueInterpolatedKeys = {};
    for (const i in attributes) {
      if (!curKeys[attributes[i]]) {
        continue;
      }
      uniqueInterpolatedKeys[attributes[i]] = {};
      for (const ms in uniqueMs) {
        uniqueInterpolatedKeys[attributes[i]][ms] = calculateValue(
          curKeys[attributes[i]],
          ms,
        );
      }
    }

    return uniqueInterpolatedKeys;
  }

  handleUndo (payload) {
    if (this.project) {
      mixpanel.haikuTrack('creator:glass:undo');
      const directlySelectedComponentId = Element.directlySelected && Element.directlySelected.componentId;
      const component = this.getActiveComponent();
      Element.unselectAllElements({component}, {from: 'glass'});
      this.project.undo({}, {from: 'glass'}, () => {
        // Important: purge the element selection proxy so that our box points can be reestablished.
        ElementSelectionProxy.purge();

        // Restore directly selected element if it still exists
        if (!directlySelectedComponentId) {
          return;
        }
        const selectedElement = component.findElementByComponentId(directlySelectedComponentId);
        if (selectedElement) {
          Element.directlySelected = selectedElement.getHaikuElement();
        }
      });
    }
  }

  handleRedo (payload) {
    if (this.project) {
      mixpanel.haikuTrack('creator:glass:redo');
      const directlySelectedComponentId = Element.directlySelected && Element.directlySelected.componentId;
      const component = this.getActiveComponent();
      Element.unselectAllElements({component}, {from: 'glass'});
      this.project.redo({}, {from: 'glass'}, () => {
        // Important: purge the element selection proxy so that our box points can be reestablished.
        ElementSelectionProxy.purge();

        // Restore directly selected element if it still exists
        if (!directlySelectedComponentId) {
          return;
        }
        const selectedElement = component.findElementByComponentId(directlySelectedComponentId);
        if (selectedElement) {
          Element.directlySelected = selectedElement.getHaikuElement();
        }
      });
    }
  }

  handleCut () {
    mixpanel.haikuTrack('creator:glass:cut');
    this.fetchProxyElementForSelection().cut({from: 'glass'});
  }

  handleCopy () {
    mixpanel.haikuTrack('creator:glass:copy');
    this.fetchProxyElementForSelection().copy({from: 'glass'});
  }

  handlePaste () {
    mixpanel.haikuTrack('creator:glass:paste');
    const proxy = this.fetchProxyElementForSelection();
    if (proxy) {
      const pasteables = ElementSelectionProxy.getPasteables();
      return proxy.pasteClipsAndSelect(
        pasteables,
        {from: 'glass'},
        () => {},
      );
    }
  }

  handleDelete () {
    if (this.isPreviewMode()) {
      return;
    }

    // Vertex deletion is not yet implemented
    if (Element.directlySelected) {
      return;
    }

    if (this.getActiveComponent()) {
      mixpanel.haikuTrack('creator:glass:delete-element');
      const proxy = this.fetchProxyElementForSelection();
      proxy.remove(this.getActiveComponent().project.getMetadata());
    }
  }

  handleSelectAll () {
    if (this.getActiveComponent()) {
      mixpanel.haikuTrack('creator:glass:select-all');
      this.getActiveComponent().selectAll({}, {from: 'glass'}, () => {});
    }
  }

  executeGroup () {
    const proxy = this.fetchProxyElementForSelection();
    // Make sure we can group (i.e. between opening popup and executing, bytecode could be edit by an external tool)
    if (proxy && proxy.canGroup()) {
      // We need to unselect the group members otherwise dragging the group
      // will also drag the inner elements, resulting in undesired offsets
      proxy.selection.forEach((element) => {
        element.unselectSoftly({from: 'glass'});
      });

      proxy.group({from: 'glass'});
      mixpanel.haikuTrack('creator:glass:grouped');
    }
  }

  handleGroup () {
    const proxy = this.fetchProxyElementForSelection();
    if (proxy && proxy.canGroup()) {
      mixpanel.haikuTrack('creator:glass:group');

      const ac = this.getActiveComponent();
      if (proxy.selection.some(
        (element) => ac.elementHasTransitionOrExpression(element.getComponentId()),
      )) {
        this.props.websocket.send({
          type: 'broadcast',
          from: 'glass',
          name: 'show-confirm-group-popup',
          groupOrUngroup: 'group',
        });
      } else {
        this.executeGroup();
      }

    }
  }

  executeUngroup () {
    const proxy = this.fetchProxyElementForSelection();
    if (proxy && proxy.canUngroup()) {
      proxy.ungroup({from: 'glass'});
      mixpanel.haikuTrack('creator:glass:ungrouped');
    }
  }

  handleUngroup () {
    const proxy = this.fetchProxyElementForSelection();
    if (proxy && proxy.canUngroup()) {
      mixpanel.haikuTrack('creator:glass:ungroup');
      if (this.getActiveComponent().elementHasTransitionOrExpression(proxy.selection[0].getComponentId())) {
        this.props.websocket.send({
          type: 'broadcast',
          from: 'glass',
          name: 'show-confirm-group-popup',
          groupOrUngroup: 'ungroup',
        });
      } else {
        this.executeUngroup();
      }
    }
  }

  handlePinchToZoom = (wheelEvent) => {
    wheelEvent.preventDefault();
    const zoomFactor = 1 + Math.min(Math.abs(wheelEvent.deltaY * 0.01), MOUSE_WHEEL_ZOOM_FACTOR);

    if (wheelEvent.deltaY > 0) {
      this.getActiveComponent().getArtboard().zoomOut(zoomFactor);
    } else {
      this.getActiveComponent().getArtboard().zoomIn(zoomFactor);
    }
  };

  launchComponentNameModal () {
    if (this.state.conglomerateComponentOptions.isBlankComponent) {
      Element.unselectAllElements({
        component: this.getActiveComponent(),
      }, {from: 'glass'});
    }

    this.setState({
      isCreateComponentModalOpen: true,
    });
  }

  conglomerateComponentFromSelectedElementsWithTitle (title, options = {}) {
    const proxy = this.fetchProxyElementForSelection();

    proxy.clearAllRelatedCaches();

    // Our selection becomes invalid as soon as we call this since we're changing
    // the elements that are currently on stage (including our current selection)
    Element.unselectAllElements({
      component: this.getActiveComponent(),
    }, {from: 'glass'});

    mixpanel.haikuTrack('creator:glass:create-component', {
      title,
    });

    let translation;
    if (proxy.hasAnythingInSelectionButNotArtboard()) {
      translation = proxy.getConglomerateTranslation();
    } else {
      translation = {x: 0, y: 0};
    }

    let size;
    if (proxy.hasAnythingInSelectionButNotArtboard()) {
      size = proxy.getConglomerateSize();
    } else {
      size = this.getActiveComponent().getArtboard().getSize();
    }

    let componentIds;
    if (proxy.hasAnythingInSelectionButNotArtboard()) {
      componentIds = proxy.selection.map((element) => element.getComponentId());
    } else {
      componentIds = [];
    }

    this.getActiveComponent().conglomerateComponent(
      componentIds,
      title,
      size,
      translation,
      { // "coords"
        x: translation.x + size.x / 2, // assume center origin
        y: translation.y + size.y / 2,  // assume center origin
      },
      {
        // "properties"
        // The setup of 'playback' is handled inside of ActiveComponent#conglomerateComponent,
        // since it requires initializing the field for multiple keyframes
        'sizeMode.x': 1,
        'sizeMode.y': 1,
        'sizeMode.z': 1,
        'origin.x': 0.5,
        'origin.y': 0.5,
      },
      options,
      {from: 'glass'},
      (err, nc) => {
        if (err) {
          logger.error(err);
          return;
        }

        this.editComponent(`./${nc.getRelpath()}`);
      },
    );
  }

  editComponent (relpath) {
    // Stop preview mode if it happens to be active when we switch contexts
    this.project.setInteractionMode(0, {from: 'glass'}, (err) => {
      if (err) {
        logger.error(err);
      }

      this.project.findActiveComponentBySource(relpath, (findAcError, ac) => {
        if (!findAcError && ac && ac !== this.getActiveComponent()) {
          mixpanel.haikuTrack('creator:glass:edit-component', {
            title: ac.getTitle(),
          });

          ac.setAsCurrentActiveComponent({from: 'glass'}, (setCurrentAcError) => {
            if (setCurrentAcError) {
              logger.error(setCurrentAcError);
            }
          });
        }
      });
    });
  }

  handleWindowResize () {
    if (!this.getActiveComponent()) {
      return;
    }

    this.resetContainerDimensions();
    this.forceUpdate();
  }

  resetContainerDimensions () {
    this.getActiveComponent().getArtboard().resetContainerDimensions(this.refs.container);
  }

  performPan (dx, dy) {
    if (!this.getActiveComponent()) {
      return;
    }

    this.getActiveComponent().getArtboard().performPan(dx, dy);
  }

  findElementAssociatedToMouseEvent (mouseEvent) {
    let target = this.findNearestDomSelectionTarget(mouseEvent.target);

    // True if the action was performed on the transform control for a selected element
    if (target === SELECTION_TYPES.ON_STAGE_CONTROL) {
      return;
    }

    // True if the action was performed on the stage, but not on any on-stage element
    if (!target || !target.hasAttribute) {
      return;
    }

    target = this.validTargetOrNull(target);

    // Truthy if we found a valid, selectable element target
    if (target) {
      // First make sure we are grabbing the correct element based on the context.
      // If we've landed on a component sub-element, we need to go up and select the wrapper.
      let haikuId = target.getAttribute('haiku-id');

      if (this.isDomNodeChildOfComponentWrapperDomNode(target)) {
        haikuId = target.parentNode.getAttribute('haiku-id');
      }

      return this.getActiveComponent().findElementByComponentId(haikuId);
    }
  }

  windowMouseOverHandler (mouseoverEvent) {
    if (
      this.state.isMouseDown ||
      this.isPreviewMode()
    ) {
      return;
    }

    const element = this.findElementAssociatedToMouseEvent(mouseoverEvent);

    if (!element || element.isHovered() || element.isSelected()) {
      return;
    }

    Element.hoverOffAllElements({component: this.getActiveComponent(), _isHovered: true}, {from: 'glass'});

    element.hoverOn({from: 'glass'});
    const boxPoints = element.getBoxPointsTransformed();

    const mousemoveHandler = (mousemoveEvent) => {
      const artboard = this.getActiveComponent().getArtboard();
      const rect = artboard.getRect();
      const zoom = artboard.getZoom();

      if (isCoordInsideBoxPoints(
        (mousemoveEvent.clientX - rect.left) / zoom,
        (mousemoveEvent.clientY - rect.top) / zoom,
        boxPoints,
      )) {
        return;
      }

      element.hoverOff({from: 'glass'});
      window.removeEventListener('mousemove', mousemoveHandler);
    };

    element.on('update', (event) => {
      if (event === 'element-selected' || event === 'element-selected-softly' || event === 'element-removed') {
        window.removeEventListener('mousemove', mousemoveHandler);
      }
    });

    window.addEventListener('mousemove', mousemoveHandler);
  }

  get areAnyModalsOpen () {
    return this.state.isEventHandlerEditorOpen || this.state.isCreateComponentModalOpen || this.state.isConfirmGroupUngroupPopupOpen;
  }

  get shouldNotHandldKeyboardEvents () {
    return this.isPreviewMode() || this.areAnyModalsOpen;
  }

  windowMouseMoveHandler (nativeEvent) {
    if (this.areAnyModalsOpen) {
      return;
    }

    nativeEvent.preventDefault();
    this.handleMouseMove({nativeEvent});
  }

  windowMouseUpHandler (nativeEvent) {
    if (this.areAnyModalsOpen) {
      return;
    }

    nativeEvent.preventDefault();
    this.handleMouseUp({nativeEvent});
  }

  windowMouseDownHandler (nativeEvent) {
    if (this.areAnyModalsOpen) {
      return;
    }

    nativeEvent.preventDefault();
    this.handleMouseDown({nativeEvent});
  }

  windowClickHandler (nativeEvent) {
    if (this.shouldNotHandldKeyboardEvents) {
      return;
    }

    nativeEvent.preventDefault();
    this.handleClick({nativeEvent});
  }

  windowDblClickHandler (nativeEvent) {
    if (this.shouldNotHandldKeyboardEvents) {
      return;
    }

    nativeEvent.preventDefault();
    this.handleDoubleClick({nativeEvent});
  }

  windowKeyDownHandler (nativeEvent) {
    if (this.shouldNotHandldKeyboardEvents) {
      return;
    }

    this.handleKeyDown({nativeEvent});
  }

  windowKeyUpHandler (nativeEvent) {
    if (this.shouldNotHandldKeyboardEvents) {
      return;
    }

    this.handleKeyUp({nativeEvent});
  }

  handleMouseDown (mousedownEvent) {
    this.didDragSinceLastMouseDown = false;

    // Only count left clicks
    if (!this.getActiveComponent() || this.areAnyModalsOpen || mousedownEvent.nativeEvent.button !== 0) {
      return;
    }

    if (belongsToMenuIcon(mousedownEvent.nativeEvent.target)) {
      this.openContextMenu(mousedownEvent.nativeEvent);
      return;
    }

    this.state.isMouseDown = true;
    const mouseDownPosition = this.storeAndReturnMousePosition(mousedownEvent, 'lastMouseDownPosition');
    const proxy = this.fetchProxyElementForSelection();
    proxy.handleMouseDown(mouseDownPosition);

    switch (mousedownEvent.nativeEvent.target.getAttribute('class')) {
      case 'direct-selection-anchor': {
        const dataIndex = parseInt(mousedownEvent.nativeEvent.target.getAttribute('data-index'), 10);
        // NOTE: meta used to determine if anchor or handle for <path> (see directSelectionMana.js)
        const meta = mousedownEvent.nativeEvent.target.getAttribute('data-meta') && mousedownEvent.nativeEvent.target.getAttribute('data-meta').length ? parseInt(mousedownEvent.nativeEvent.target.getAttribute('data-meta'), 10) : null;

        if (!Element.directlySelected) {
          break;
        }

        // NOTE: go select the previous vertex when a RHS handle is selected

        // Convert between corners and curves
        if (Globals.isSpecialKeyDown() && Element.directlySelected.type === 'path' && meta == null) {
          if (!Element.directlySelected.attributes.d) {
            break;
          }
          const points = SVGPoints.pathToPoints(Element.directlySelected.attributes.d);
         // If the control handles share the same coordinates, then it's already a corner. Otherwise, it's a curve.
          const convertToCorner = (
            (dataIndex === 0 && points[dataIndex + 1] && points[dataIndex + 1].curve &&
              (points[dataIndex + 1].curve.x1 !== points[dataIndex].x || points[dataIndex + 1].curve.y1 !== points[dataIndex].y)
            ) ||
            (points[dataIndex].curve &&
              (points[dataIndex].curve.x2 !== points[dataIndex].x || points[dataIndex].curve.y2 !== points[dataIndex].y)
            )
          );

          if (convertToCorner) {
            if (dataIndex > 0 && points[dataIndex] && points[dataIndex - 1]) {
              if (!points[dataIndex].curve) {
                points[dataIndex].curve = {type: 'cubic', x1: points[dataIndex - 1].x, y1: points[dataIndex - 1].y};
              }
              points[dataIndex].curve.x2 = points[dataIndex].x;
              points[dataIndex].curve.y2 = points[dataIndex].y;
            }

            if (dataIndex < points.length - 1 && points[dataIndex] && points[dataIndex + 1]) {
              if (!points[dataIndex + 1].curve) {
                points[dataIndex + 1].curve = {type: 'cubic', x2: points[dataIndex + 1].x, y2: points[dataIndex + 1].y};
              }
              points[dataIndex + 1].curve.x1 = points[dataIndex].x;
              points[dataIndex + 1].curve.y1 = points[dataIndex].y;
            }
          } else {
            if (dataIndex > 0 && points[dataIndex] && points[dataIndex - 1]) {
              if (!points[dataIndex].curve) {
                points[dataIndex].curve = {type: 'cubic', x1: points[dataIndex - 1].x, y1: points[dataIndex - 1].y};
              }
              points[dataIndex].curve.x2 = points[dataIndex].x - 20;
              points[dataIndex].curve.y2 = points[dataIndex].y;
            }

            if (dataIndex < points.length - 1 && points[dataIndex] && points[dataIndex + 1]) {
              if (!points[dataIndex + 1].curve) {
                points[dataIndex + 1].curve = {type: 'cubic', x2: points[dataIndex + 1].x, y2: points[dataIndex + 1].y};
              }
              points[dataIndex + 1].curve.x1 = points[dataIndex].x + 20;
              points[dataIndex + 1].curve.y1 = points[dataIndex].y;
            }
          }
          this.getActiveComponent().updateKeyframes({
            [this.getActiveComponent().getCurrentTimelineName()]: {
              [Element.directlySelected.attributes['haiku-id']]: {
                d: {
                  0: {
                    value: SVGPoints.pointsToPath(points),
                  },
                },
              },
            },
          }, {
            setElementLockStatus: {
              [Element.directlySelected.rootSVG.attributes[HAIKU_ID_ATTRIBUTE]]: true,
            },
          }, {from: 'glass'}, () => {});
        }

        // Add to the selection
        let indices;
        const alreadySelected =
          this.state.directSelectionAnchorActivation &&
          this.state.directSelectionAnchorActivation.indices &&
          this.state.directSelectionAnchorActivation.indices[Element.directlySelected.attributes['haiku-id']] &&
          this.state.directSelectionAnchorActivation.indices[Element.directlySelected.attributes['haiku-id']].includes(dataIndex);

        if (DIRECT_SELECTION_MULTIPLE_SELECTION_ALLOWED[Element.directlySelected.type] && (Globals.isShiftKeyDown || alreadySelected)) {
          if (this.state.directSelectionAnchorActivation) {
            indices = {
              ...this.state.directSelectionAnchorActivation.indices,
            };
          } else {
            indices = {
              [Element.directlySelected.attributes['haiku-id']]: [dataIndex],
            };
          }

          if (Globals.isShiftKeyDown && alreadySelected) {
            // Remove if already selected
            indices[Element.directlySelected.attributes['haiku-id']] = lodash.pull(indices[Element.directlySelected.attributes['haiku-id']], dataIndex);
          } else {
            // Add otherwise
            if (!indices[Element.directlySelected.attributes['haiku-id']]) {
              indices[Element.directlySelected.attributes['haiku-id']] = [];
            }
            indices[Element.directlySelected.attributes['haiku-id']].push(dataIndex);
            indices[Element.directlySelected.attributes['haiku-id']] = lodash.uniq(indices[Element.directlySelected.attributes['haiku-id']]);
          }
        } else {
          indices = {
            [Element.directlySelected.attributes['haiku-id']]: [dataIndex],
          };
        }
        this.directSelectionAnchorActivation({
          indices,
          meta,
          event: mousedownEvent.nativeEvent,
        });
        break;
      }
      case 'control-point': {
        const dataIndex = parseInt(mousedownEvent.nativeEvent.target.getAttribute('data-index'), 10);

        this.controlActivation({
          index: dataIndex,
          event: mousedownEvent.nativeEvent,
        });
        break;
      }
      case 'origin':
        this.originActivation({event: mousedownEvent.nativeEvent});
        break;
      default:
        // We are panning now, so don't un/select anything
        if (Globals.isSpaceKeyDown) {
          return;
        }

        const finish = () => {
          this.fetchProxyElementForSelection().cacheOrigins();
        };

        if (!this.isPreviewMode()) {
          let target = this.findNearestDomSelectionTarget(mousedownEvent.nativeEvent.target);

          // True if the user has clicked the transform control for a selected element
          if (target === SELECTION_TYPES.ON_STAGE_CONTROL) {
            return;
          }

          let targetLocked = false;
          if (target && target.getAttribute) {
            const el = Element.findByComponentAndHaikuId(this.getActiveComponent(), target.getAttribute('haiku-id'));
            if (el) {
              targetLocked = el.isLockedViaParents();
            }
          }
          // True if the user has clicked on the stage, but not on any on-stage element
          if (targetLocked || !target || !target.hasAttribute) {
            if (proxy.hasAnythingInSelection() &&
              isCoordInsideBoxPoints(mouseDownPosition.x, mouseDownPosition.y, proxy.getBoxPointsTransformed())) {
              return;
            }

            // Unselect all the elements unless the user is doing a meta-operation, as indicated by these keys
            if (!Globals.isShiftKeyDown && !Globals.isSpecialKeyDown() && !Globals.isAltKeyDown) {
              Element.unselectAllElements({component: this.getActiveComponent()}, {from: 'glass'});
            }
            if (!Globals.isSpecialKeyDown() && !Globals.isAltKeyDown) {
              if (this.getActiveComponent()) {
                this.getActiveComponent().getSelectionMarquee().startSelection(mouseDownPosition);
              }
            }

            return;
          }

          target = this.validTargetOrNull(target);

          if (!target) {
            // TODO: In what situations can we ever get here?
            break;
          }

          // First make sure we are grabbing the correct element based on the context.
          // If we've landed on a component sub-element, we need to go up and select the wrapper.
          let haikuId = target.getAttribute(HAIKU_ID_ATTRIBUTE);

          if (this.isDomNodeChildOfComponentWrapperDomNode(target)) {
            haikuId = target.parentNode.getAttribute(HAIKU_ID_ATTRIBUTE);
          }

          const elementTargeted = this.getActiveComponent().findElementByComponentId(haikuId);

          if (elementTargeted.isRootElement()) { // The artboard can only be selected alone
            Element.unselectAllElements({component: this.getActiveComponent()}, {from: 'glass'});
            this.ensureElementIsSelected(elementTargeted, finish);
          } else if (Globals.isControlKeyDown) {
            this.deselectAllOtherElementsIfTargetNotAmongThem(elementTargeted, () => {
              this.ensureElementIsSelected(elementTargeted, finish);
            });
          } else if (!Globals.isShiftKeyDown && !Globals.isAltKeyDown) { // none
            this.deselectAllOtherElementsIfTargetNotAmongThem(elementTargeted, () => {
              this.ensureElementIsSelected(elementTargeted, finish);

              if (!experimentIsEnabled(Experiment.DirectSelectionOfPrimitives)) {
                return;
              }

              this.setState({directSelectionAnchorActivation: null});

              const mouseDownTimeDiff = this.state.lastMouseDownTime ? Date.now() - this.state.lastMouseDownTime : null;
              const isDoubleClick = mouseDownTimeDiff ? mouseDownTimeDiff <= DOUBLE_CLICK_THRESHOLD_MS : false;
              const prevDirectlySelected = Element.directlySelected;
              let clickedItemFound = null;
              const targetedHaikuElement = elementTargeted.getHaikuElement();
              targetedHaikuElement.visit((descendant) => {
                if (descendant.isWrapper() || descendant.isComponent() || descendant.isChildOfDefs) {
                  return;
                }

                let hasFill = false;
                {
                  let d = descendant;
                  while (!hasFill && d) {
                    hasFill = (d.attributes.fill !== undefined && d.attributes.fill !== 'none');
                    if (hasFill) {
                      break;
                    }
                    d = d.parent;
                  }
                }

                // The default is stroke-width is 1, but the default stroke is none, meriting this relatively
                // tricky block.
                let effectiveStrokeWidth = undefined;
                let hasStroke = false;
                {
                  let d = descendant;
                  while (d && d !== targetedHaikuElement) {
                    if (!hasStroke) {
                      if (d.attributes.stroke === 'none') {
                        break;
                      }

                      if (d.attributes.stroke !== undefined) {
                        hasStroke = true;
                      }
                    }

                    if (effectiveStrokeWidth === undefined) {
                      if (d.attributes['stroke-width'] === 'none' || Number(d.attributes['stroke-width']) === 0) {
                        effectiveStrokeWidth = 0;
                        break;
                      }

                      if (d.attributes['stroke-width'] !== undefined) {
                        effectiveStrokeWidth = Number(d.attributes['stroke-width']);
                      }
                    }

                    if (hasStroke && effectiveStrokeWidth !== undefined) {
                      break;
                    }

                    d = d.parent;
                  }
                }

                if (
                  (
                    hasFill && isPointInsidePrimitive(descendant, mouseDownPosition)
                  ) || (
                    hasStroke && (effectiveStrokeWidth > 0) && isPointAlongStroke(descendant, mouseDownPosition, effectiveStrokeWidth)
                  )) {
                  clickedItemFound = descendant;
                  if (isDoubleClick && elementTargeted.isSelected()) {
                    Element.directlySelected = descendant;
                  }
                  return false; // stop searching
                }
              });

              if (
                !clickedItemFound ||
                (Element.directlySelected !== null && clickedItemFound !== Element.directlySelected)
              ) {
                Element.directlySelected = null;
              }

              // --- Insert new vertex when the selected item is unchanged ---
              if (Element.directlySelected && Element.directlySelected === prevDirectlySelected && (isDoubleClick || Globals.isSpecialKeyDown())) {
                const transformedLocalMouse = transform2DPoint(mouseDownPosition, Element.directlySelected.layoutAncestryMatrices.reverse());

                const keyframeOptions = {
                  setElementLockStatus: {
                    [Element.directlySelected.rootSVG.attributes[HAIKU_ID_ATTRIBUTE]]: true,
                  },
                };

                const updateNewOriginalClickStateFunc = (err) => {
                  if (err) {
                    this.selectedOriginalClickState = null;
                    return;
                  }
                  this.selectedOriginalClickState = {
                    attributes: JSON.parse(JSON.stringify(Element.directlySelected.attributes)),
                    sizeX: Element.directlySelected.sizeX,
                    sizeY: Element.directlySelected.sizeY,
                  };
                };

                const originalEl = Element.findByComponentAndHaikuId(this.getActiveComponent(), Element.directlySelected.attributes['haiku-id']);

                switch (Element.directlySelected.type) {
                  case 'rect': {
                    const elSize = Element.directlySelected.size;

                    const newKeys = this.interpolateAttributesAtKeyframes(originalEl, ['x', 'y', 'rx', 'ry']);
                    const pathKeys = {d: {}, x: {}, y: {}, rx: {}, ry: {}};

                    for (const ms in newKeys.x) {
                      pathKeys.d[ms] = {value: SVGPoints.pointsToPath(SVGPoints.rectToPoints(
                        Number(newKeys.x[ms]),
                        Number(newKeys.y[ms]),
                        elSize.x,
                        elSize.y,
                        Number((newKeys.rx && newKeys.rx[ms]) || 0),
                        Number((newKeys.ry && newKeys.ry[ms]) || 0),
                      ))},

                      pathKeys.x[ms] = null;
                      pathKeys.y[ms] = null;
                      pathKeys.rx[ms] = null;
                      pathKeys.ry[ms] = null;
                    }

                    this.getActiveComponent().updateKeyframesAndTypes({
                      [this.getActiveComponent().getCurrentTimelineName()]: {
                        [Element.directlySelected.attributes['haiku-id']]: pathKeys,
                      },
                    },
                      {
                        [Element.directlySelected.attributes['haiku-id']]: 'path',
                      }, keyframeOptions, {from: 'glass'}, updateNewOriginalClickStateFunc);

                    break;
                  }
                  case 'circle': {
                    const newKeys = this.interpolateAttributesAtKeyframes(originalEl, ['r', 'cx', 'cy']);
                    const pathKeys = {d: {}, r: {}, cx: {}, cy: {}};
                    for (const ms in newKeys.r) {
                      pathKeys.d[ms] = {value: SVGPoints.pointsToPath(SVGPoints.circleToPoints(Number(newKeys.cx[ms]), Number(newKeys.cy[ms]), Number(newKeys.r[ms])))};
                      pathKeys.r[ms] = null;
                      pathKeys.cx[ms] = null;
                      pathKeys.cy[ms] = null;
                    }
                    this.getActiveComponent().updateKeyframesAndTypes({
                      [this.getActiveComponent().getCurrentTimelineName()]: {
                        [Element.directlySelected.attributes['haiku-id']]: pathKeys,
                      },
                    },
                      {
                        [Element.directlySelected.attributes['haiku-id']]: 'path',
                      }, keyframeOptions, {from: 'glass'}, updateNewOriginalClickStateFunc);

                    break;
                  }
                  case 'ellipse': {
                    const newKeys = this.interpolateAttributesAtKeyframes(originalEl, ['rx', 'ry', 'cx', 'cy']);
                    const pathKeys = {d: {}, rx: {}, ry: {}, cx: {}, cy: {}};
                    for (const ms in newKeys.rx) {
                      pathKeys.d[ms] = {value: SVGPoints.pointsToPath(SVGPoints.ellipseToPoints(Number(newKeys.cx[ms]), Number(newKeys.cy[ms]), Number(newKeys.rx[ms]), Number(newKeys.ry[ms])))};
                      pathKeys.rx[ms] = null;
                      pathKeys.ry[ms] = null;
                      pathKeys.cx[ms] = null;
                      pathKeys.cy[ms] = null;
                    }

                    this.getActiveComponent().updateKeyframesAndTypes({
                      [this.getActiveComponent().getCurrentTimelineName()]: {
                        [Element.directlySelected.attributes['haiku-id']]: pathKeys,
                      },
                    },
                      {
                        [Element.directlySelected.attributes['haiku-id']]: 'path',
                      }, keyframeOptions, {from: 'glass'}, updateNewOriginalClickStateFunc);
                    break;
                  }
                  case 'line': {
                    const newKeys = this.interpolateAttributesAtKeyframes(originalEl, ['x1', 'y1', 'x2', 'y2']);
                    const pathKeys = {d: {}, x1: {}, y1: {}, x2: {}, y2: {}};
                    for (const ms in newKeys.x1) {
                      pathKeys.d[ms] = {value: SVGPoints.pointsToPath(SVGPoints.lineToPoints(Number(newKeys.x1[ms]), Number(newKeys.y1[ms]), Number(newKeys.x2[ms]), Number(newKeys.y2[ms])))};
                      pathKeys.x1[ms] = null;
                      pathKeys.y1[ms] = null;
                      pathKeys.x2[ms] = null;
                      pathKeys.y2[ms] = null;
                    }
                    this.getActiveComponent().updateKeyframesAndTypes({
                      [this.getActiveComponent().getCurrentTimelineName()]: {
                        [Element.directlySelected.attributes['haiku-id']]: pathKeys,
                      },
                    },
                      {
                        [Element.directlySelected.attributes['haiku-id']]: 'path',
                      }, keyframeOptions, {from: 'glass'}, updateNewOriginalClickStateFunc);
                    break;
                  }
                  case 'polygon':
                  case 'polyline': {
                    const normalPoints = [];
                    const originalPoints = SVGPoints.polyPointsStringToPoints(Element.directlySelected.attributes.points).map((pt) => ({x: pt[0], y: pt[1]}));

                    // Insert an extra point at the end for a polygon because it's a closed shape
                    if (Element.directlySelected.type === 'polygon') {
                      originalPoints.push(originalPoints[0]);
                    }

                    // Calculate the normal points and their distances for each segment
                    for (let i = 0; i < originalPoints.length - 1; i++) {
                      normalPoints.push(closestNormalPointOnLineSegment(originalPoints[i], originalPoints[i + 1], transformedLocalMouse));
                    }
                    const normalDistances = normalPoints.map((pt) => (distance(transformedLocalMouse, pt)));

                    // Find the smallest distance
                    let min = Infinity;
                    let minIdx = -1;
                    for (let i = 0; i < normalDistances.length; i++) {
                      if (normalDistances[i] < min) {
                        min = normalDistances[i];
                        minIdx = i;
                      }
                    }

                    // Exit if it's too far away
                    if (min > DEFAULT_LINE_SELECTION_THRESHOLD) {
                      break;
                    }

                    // Insert a new point at the normal
                    originalPoints.splice(minIdx + 1, 0, normalPoints[minIdx]);

                    // Adjust the selection state
                    this.directSelectionAnchorActivation({
                      indices: {
                        [Element.directlySelected.attributes['haiku-id']]: [minIdx + 1],
                      },
                    });

                    // Remove the last extra vertex if a polygon (added above)
                    if (Element.directlySelected.type === 'polygon') {
                      originalPoints.pop();
                    }

                    this.getActiveComponent().updateKeyframes({
                      [this.getActiveComponent().getCurrentTimelineName()]: {
                        [Element.directlySelected.attributes['haiku-id']]: {
                          points: {
                            [this.getActiveComponent().getCurrentTimelineTime()]: {
                              value: SVGPoints.pointsToPolyString(originalPoints.map((pt) => ([pt.x, pt.y]))),
                            },
                          },
                        },
                      },
                    }, keyframeOptions, {from: 'glass'}, updateNewOriginalClickStateFunc);
                    break;
                  }
                  case 'path': {
                    if (!Element.directlySelected.attributes.d) {
                      break;
                    }
                    const points = SVGPoints.pathToPoints(Element.directlySelected.attributes.d);
                    const approximationResolution = 80;
                    const [lutPoints] = buildPathLUT(points, approximationResolution);

                    // Find the smallest distance
                    let min = Infinity;
                    let minIdx = -1;

                    const approxDistances = lutPoints.map((pt) => {
                      return distance(pt, transformedLocalMouse);
                    });
                    for (let i = 0; i < approxDistances.length; i++) {
                      if (approxDistances[i] < min) {
                        min = approxDistances[i];
                        minIdx = i;
                      }
                    }

                    // Exit if too far away
                    if (min > DEFAULT_LINE_SELECTION_THRESHOLD) {
                      break;
                    }

                    // Calculate t value and surrounding points, and split
                    const t = minIdx % approximationResolution / approximationResolution;

                    splitSegmentInSVGPoints(points, Math.floor(minIdx / approximationResolution), Math.ceil(minIdx / approximationResolution), t);
                    if (points) {
                      this.getActiveComponent().updateKeyframes({
                        [this.getActiveComponent().getCurrentTimelineName()]: {
                          [Element.directlySelected.attributes['haiku-id']]: {
                            d: {
                              [this.getActiveComponent().getCurrentTimelineTime()]: {
                                value: SVGPoints.pointsToPath(points),
                              },
                            },
                          },
                        },
                      }, keyframeOptions, {from: 'glass'}, updateNewOriginalClickStateFunc);
                    } else {
                      // #FIXME: this should never happen.
                      logger.warn('[glass] unable to split points');
                    }
                    break;
                  }
                }
              }
            });
          } else if (!Globals.isShiftKeyDown && Globals.isAltKeyDown) { // Alt
            this.deselectAllOtherElementsIfTargetNotAmongThem(elementTargeted, () => {
              this.ensureElementIsSelected(elementTargeted, () => {
                this.duplicateSelectedElementsThenSelectDuplicates(finish);
              });
            });
          } else if (Globals.isShiftKeyDown && !Globals.isAltKeyDown) { // Shift
            this.toggleMultiElementSelection(elementTargeted, finish);
          } else if (Globals.isShiftKeyDown && Globals.isAltKeyDown) { // Shift+Alt
            this.toggleMultiElementSelection(elementTargeted, () => {
              this.duplicateSelectedElementsThenSelectDuplicates(finish);
            });
          }
        }
        break;
    }

    // Save the original state of this element for applying the total drag deltas (in handleMouseMove)
    if (Element.directlySelected) {
      this.selectedOriginalClickState = {
        attributes: JSON.parse(JSON.stringify(Element.directlySelected.attributes)),
        sizeX: Element.directlySelected.sizeX,
        sizeY: Element.directlySelected.sizeY,
      };
    }

    this.state.lastMouseDownTime = Date.now();
  }

  validTargetOrNull (target) {
    // If not even a node, we have no valid target
    if (
      !target ||
      !target.hasAttribute
    ) {
      return null;
    }

    // If no parent node, we must be too far; no valid target
    if (
      !target.parentNode ||
      !target.parentNode.hasAttribute
    ) {
      return null;
    }

    // If our parent is the mount, we're at the target - the top level
    if (this.targetIsMount(target.parentNode)) {
      return target;
    }

    // Special case; don't jump to parent if we're in a component wrapper
    if (this.isDomNodeChildOfComponentWrapperDomNode(target)) {
      return target;
    }

    // If we don't have selectable metadata, try our parent
    if (!target.hasAttribute(HAIKU_ID_ATTRIBUTE)) {
      return this.validTargetOrNull(target.parentNode);
    }

    // If the parent is valid, we may want to jump up to it;
    // note that we already checked if the parent is the mount above;
    // we don't jump if the next one up is the artboard either
    if (
      target.parentNode.hasAttribute(HAIKU_ID_ATTRIBUTE) &&
      !this.targetIsMount(target.parentNode.parentNode)
    ) {
      return this.validTargetOrNull(target.parentNode);
    }

    // If we got here, we should be the topmost valid target
    return target;
  }

  targetIsMount (target) {
    return (
      target === this.refs.mount ||
      target === this.getActiveComponent().getMount().$el()
    );
  }

  deselectAllOtherElementsIfTargetNotAmongThem (target, cb) {
    const selecteds = Element.where({component: this.getActiveComponent(), _isSelected: true});
    const isAmongSelection = selecteds.indexOf(target) !== -1;
    if (!isAmongSelection) {
      selecteds.forEach((element) => {
        if (element !== target) {
          element.unselectSoftly({from: 'glass'});
        }
      });
    }
    return cb();
  }

  deselectAllOtherElements (target, cb) {
    const selecteds = Element.where({component: this.getActiveComponent(), _isSelected: true});
    selecteds.forEach((element) => {
      if (element !== target) {
        element.unselectSoftly({from: 'glass'});
      }
    });
    return cb();
  }

  ensureElementIsSelected (target, cb) {
    target.selectSoftly({from: 'glass'});
    return cb();
  }

  duplicateSelectedElementsThenSelectDuplicates (cb) {
    const proxy = this.fetchProxyElementForSelection();
    proxy.duplicateAllAndSelectDuplicates({from: 'glass'}, (err) => {
      if (err) {
        return cb(err);
      }
      return cb();
    });
  }

  toggleMultiElementSelection (target, cb) {
    if (target.isSelected() && this.fetchProxyElementForSelection().hasMultipleInSelection()) {
      target.unselectSoftly({from: 'glass'});
    } else {
      target.selectSoftly({from: 'glass'});
    }
    return cb();
  }

  toggleSelectionStateWithRespectToBox (box) {
    const elements = Element.where({component: this.getActiveComponent()})
      .filter((element) => !element.isRootElement());

    // Note: We don't allow the artboard to be selected as part of multi-selection
    elements.forEach((element) => {
      // We don't want to select elements deeper than the top level
      if (element.getDepthAmongElements() < 2) {
        const overlaps = element.doesOverlapWithBox(box);
        if (overlaps) {
          element.selectSoftly({from: 'glass'});
        } else {
          element.unselectSoftly({from: 'glass'});
        }
      }
    });
  }

  isDomNodeChildOfComponentWrapperDomNode (target) {
    // If the user selected one of the children of a component that has been instantiated on stage
    // we need to actually select the parent (wrapper) element since that's what our component manages
    if (
      target.parentNode &&
      target.parentNode.getAttribute(HAIKU_ID_ATTRIBUTE) &&
      target.parentNode.getAttribute(HAIKU_SOURCE_ATTRIBUTE)
    ) {
      return true;
    }
    return false;
  }

  findNearestDomSelectionTarget (target) {
    // Don't perform element selection if the user clicked one of the transform controls
    if (
      typeof target.className === 'string' &&
      (
        target.className === 'origin' ||
        target.className === 'control-point' ||
        target.className === 'hit-area'
      )
    ) {
      return SELECTION_TYPES.ON_STAGE_CONTROL;
    }

    // Climb the target path to find if a haiku Element has been selected
    // We want to make sure we are not selecting elements at the wrong context level
    while (
      target.hasAttribute &&
      (
        !target.hasAttribute(HAIKU_SOURCE_ATTRIBUTE) || // Only root elements of an instantiated component have this attribute
        !target.hasAttribute(HAIKU_ID_ATTRIBUTE) || // Only haiku elements have this
        !Element.findById(
          Element.buildUidFromComponentAndDomElement(this.getActiveComponent(), target),
        )
      )
    ) {
      if (target.parentNode) {
        // tslint:disable-next-line:no-parameter-reassignment
        target = target.parentNode;
      }
    }

    return target;
  }

  handleMouseUp (mouseupEvent) {
    if (this.state.isEventHandlerEditorOpen) {
      return;
    }

    if (this.getActiveComponent()) {
      this.getActiveComponent().getSelectionMarquee().endSelection();
    }

    const mousePosition = this.storeAndReturnMousePosition(mouseupEvent, 'lastMouseUpPosition');

    const proxy = this.fetchProxyElementForSelection();
    proxy.handleMouseUp(mousePosition);
    this.state.isMouseDown = false;
    this.state.lastMouseUpTime = Date.now();
    this.handleDragStop();
    this.setState({
      isAnythingScaling: false,
      isAnythingRotating: false,
      isOriginPanning: false,
      globalControlPointHandleClass: '',
      controlActivation: null,
    });

    this.fetchProxyElementForSelection().initializeRotationSnap();
  }

  handleClick (clickEvent) {
    if (this.isPreviewMode()) {
      return;
    }

    if (this.getActiveComponent()) {
      this.getActiveComponent().getSelectionMarquee().endSelection();
    }

    this.storeAndReturnMousePosition(clickEvent);
  }

  handleDoubleClick (doubleClickEvent) {
    if (!this.getActiveComponent()) {
      return;
    }

    if (this.isPreviewMode()) {
      return;
    }

    if (this.getActiveComponent()) {
      this.getActiveComponent().getSelectionMarquee().endSelection();
    }

    this.storeAndReturnMousePosition(doubleClickEvent);

    // Only count left clicks or natural trackpad clicks
    if (doubleClickEvent.nativeEvent.button !== 0 || Globals.isControlKeyDown) {
      return;
    }

    const target = this.findNearestDomSelectionTarget(doubleClickEvent.nativeEvent.target);
    const source = target && target.getAttribute && target.getAttribute(HAIKU_SOURCE_ATTRIBUTE);

    if (source && source[0] === '.') {
      // Prevent accidentally launching the subcomponent editor when the user didn't intend a double click
      if (!this.didDragSinceLastMouseDown) {
        this.editComponent(source);
      }
    }
  }

  handleDragStart (cb) {
    this.state.isMouseDragging = true;
    this.setState({isMouseDragging: true}, cb);
  }

  handleDragStop (cb) {
    this.state.isMouseDragging = false;
    this.setState({isMouseDragging: false}, cb);
  }

  handleKeyEscape () {
    if (!this.getActiveComponent()) {
      return;
    }

    Element.unselectAllElements({component: this.getActiveComponent()}, {from: 'glass'});
  }

  handleKeyLeftArrow (keyEvent) {
    if (!this.getActiveComponent()) {
      return;
    }
    const delta = keyEvent.shiftKey ? 5 : 1;
    const proxy = this.fetchProxyElementForSelection();
    if (proxy.hasAnythingInSelection()) {
      proxy.move(-delta, 0, Globals);
    }
  }

  handleKeyUpArrow (keyEvent) {
    if (!this.getActiveComponent()) {
      return;
    }
    const delta = keyEvent.shiftKey ? 5 : 1;
    const proxy = this.fetchProxyElementForSelection();
    if (proxy.hasAnythingInSelection()) {
      proxy.move(0, -delta, Globals);
    }
  }

  handleKeyRightArrow (keyEvent) {
    if (!this.getActiveComponent()) {
      return;
    }
    const delta = keyEvent.shiftKey ? 5 : 1;
    const proxy = this.fetchProxyElementForSelection();
    if (proxy.hasAnythingInSelection()) {
      proxy.move(delta, 0, Globals);
    }
  }

  handleKeyDownArrow (keyEvent) {
    if (!this.getActiveComponent()) {
      return;
    }
    const delta = keyEvent.shiftKey ? 5 : 1;
    const proxy = this.fetchProxyElementForSelection();
    if (proxy.hasAnythingInSelection()) {
      proxy.move(0, delta, Globals);
    }
  }

  handleKeyDown (keyEvent) {
    if (this.state.isEventHandlerEditorOpen) {
      return;
    }

    // Cmd + 0 centers & resets zoom
    if (Globals.isSpecialKeyDown() && keyEvent.nativeEvent.which === 48) {
      this.getActiveComponent().getArtboard().resetZoomPan();
    }

    if (this.getActiveComponent()) {
      this.getActiveComponent().getSelectionMarquee().endSelection();
    }

    switch (keyEvent.nativeEvent.which) {
      case 27: this.handleKeyEscape(); break;
      case 37: this.handleKeyLeftArrow(keyEvent.nativeEvent); break;
      case 38: this.handleKeyUpArrow(keyEvent.nativeEvent); break;
      case 39: this.handleKeyRightArrow(keyEvent.nativeEvent); break;
      case 40: this.handleKeyDownArrow(keyEvent.nativeEvent); break;
      case 46: this.handleDelete(); break;
      case 8: this.handleDelete(); break;
      case 13: this.handleKeyEnter(); break;
      case 91: this.handleKeyCommand(true); break; // left cmd
      case 93: this.handleKeyCommand(true); break; // left cmd
      case 76: this.handleAlignRequest(undefined, 1, false); break; // l key
      case 75: this.handleDistributeRequest(undefined, 0.5, true); break; // k key
    }
  }

  handleAlignRequest (xEdge, yEdge, toStage) {
    const proxy = this.fetchProxyElementForSelection();
    proxy.align(xEdge, yEdge, toStage);
  }

  handleDistributeRequest (xEdge, yEdge, toStage) {
    const proxy = this.fetchProxyElementForSelection();
    proxy.distribute(xEdge, yEdge, toStage);
  }

  handleKeyCommand (isDown) {
    this.setState({isCommandKeyDown: isDown});
  }

  handleKeyUp (keyEvent) {
    if (this.state.isEventHandlerEditorOpen) {
      return;
    }

    switch (keyEvent.nativeEvent.which) {
      case 91: this.handleKeyCommand(false); break;
      case 93: this.handleKeyCommand(false); break;
    }

    if (this.getActiveComponent()) {
      this.getActiveComponent().getSelectionMarquee().endSelection();
    }
  }

  handleKeyEnter () {
    // noop for now
  }

  handleClickStageName () {
    if (!this.getActiveComponent()) {
      return;
    }

    // Multi-select is not allowed when selecting the stage name
    this.setState({snapLines: []});
    Element.unselectAllElements({component: this.getActiveComponent()}, {from: 'glass'});
    const artboard = Element.findRoots({component: this.getActiveComponent()})[0];
    artboard.select({from: 'glass'});
  }

  handleMouseOverStageName () {
    // Don't highlight the stage name/artboard boundary if the selection marquee is active
    if (this.isMarqueeActive()) {
      return;
    }

    this.setState({isStageNameHovering: true});
  }

  handleMouseOutStageName () {
    this.setState({isStageNameHovering: false});
  }

  handleMouseMove (mousemoveEvent) {
    if (!this.getActiveComponent()) {
      return;
    }

    if (mousemoveEvent.nativeEvent.target.getAttribute('class') !== 'control-point') {
      this.state.hoveredControlPointIndex = null;
    }

    const zoom = this.getActiveComponent().getArtboard().getZoom() || 1;
    const pan = this.getActiveComponent().getArtboard().getPan() || {x: 0, y: 0};
    const viewportTransform = {zoom, pan};

    const lastMouseDownPosition = this.state.lastMouseDownPosition;
    const mousePositionCurrent = this.storeAndReturnMousePosition(mousemoveEvent);
    const mousePositionPrevious = this.state.mousePositionPrevious || mousePositionCurrent;

    const marquee = this.getActiveComponent().getSelectionMarquee();
    if (marquee.isActive()) {
      marquee.moveSelection(mousePositionCurrent);
      const marqueeBox = marquee.getBox();
      this.toggleSelectionStateWithRespectToBox(marqueeBox);
    }

    const dx = mousePositionCurrent.x - mousePositionPrevious.x;
    const dy = mousePositionCurrent.y - mousePositionPrevious.y;
    if (dx === 0 && dy === 0) {
      return mousePositionCurrent;
    }

    // If we got this far, the mouse has changed its position from the most recent mousedown
    if (this.state.isMouseDown) {
      this.handleDragStart();
    }

    if (this.state.isMouseDragging && this.state.isMouseDown) {
      if (Globals.isSpaceKeyDown && this.state.stageMouseDown) {
        this.performPan(
          (mousemoveEvent.nativeEvent.clientX - this.state.stageMouseDown.x) * viewportTransform.zoom,
          (mousemoveEvent.nativeEvent.clientY - this.state.stageMouseDown.y) * viewportTransform.zoom,
        );
      } else if (!this.isPreviewMode()) {
        if (
          experimentIsEnabled(Experiment.DirectSelectionOfPrimitives) &&
          Element.directlySelected &&
          this.selectedOriginalClickState &&
          this.selectedOriginalClickState.attributes
        ) {
          const transformedCurrent = transform2DPoint(mousePositionCurrent, Element.directlySelected.layoutAncestryMatrices.reverse());
          const transformedLastDown = transform2DPoint(lastMouseDownPosition, Element.directlySelected.layoutAncestryMatrices.reverse());
          const transformedTotalDelta = {
            x: transformedCurrent.x - transformedLastDown.x,
            y: transformedCurrent.y - transformedLastDown.y,
          };

          const keyframeOptions = {
            setElementLockStatus: {
              [Element.directlySelected.rootSVG.attributes[HAIKU_ID_ATTRIBUTE]]: true,
            },
          };

          // We get SVG root element here so we can update svg overflow to visible
          const selectedElement = Element.findByComponentAndHaikuId(this.getActiveComponent(), Element.directlySelected.attributes['haiku-id']);

          // Apparently there can be a race condition where selected element isn't present here
          if (!selectedElement) {
            return mousePositionCurrent;
          }

          const rootSvgElement = selectedElement.getParentSvgElement();

          if (this.state.directSelectionAnchorActivation != null) {
            // Moving a selection of control points

            const indices = this.state.directSelectionAnchorActivation.indices[Element.directlySelected.attributes['haiku-id']];
            const lastIndex = indices[indices.length - 1];

            switch (Element.directlySelected.type) {
              case 'circle': {
                this.getActiveComponent().updateKeyframes({
                  [this.getActiveComponent().getCurrentTimelineName()]: {
                    [rootSvgElement.componentId]: {
                      'style.overflow': {
                        0: {value: 'visible'},
                      },
                    },
                    [Element.directlySelected.attributes['haiku-id']]: {
                      r: {
                        [this.getActiveComponent().getCurrentTimelineTime()]: {
                          value: distance(transformedCurrent, {x: Number(Element.directlySelected.attributes.cx), y: Number(Element.directlySelected.attributes.cy)}),
                        },
                      },
                    },
                  },
                }, keyframeOptions, {from: 'glass'}, () => {});
                break;
              }
              case 'ellipse': {
                let property;
                let value;

                if (lastIndex === 0 || lastIndex === 1) {
                  property = 'rx';
                  value = Math.abs(transformedCurrent.x - Number(Element.directlySelected.attributes.cx));
                } else if (lastIndex === 2 || lastIndex === 3) {
                  property = 'ry';
                  value = Math.abs(transformedCurrent.y - Number(Element.directlySelected.attributes.cy));
                }

                this.getActiveComponent().updateKeyframes({
                  [this.getActiveComponent().getCurrentTimelineName()]: {
                    [rootSvgElement.componentId]: {
                      'style.overflow': {
                        0: {value: 'visible'},
                      },
                    },
                    [Element.directlySelected.attributes['haiku-id']]: {
                      [property]: {
                        [this.getActiveComponent().getCurrentTimelineTime()]: {
                          value,
                        },
                      },
                    },
                  },
                }, keyframeOptions, {from: 'glass'}, () => {});
                break;
              }
              case 'rect': {
                let x = Number(this.selectedOriginalClickState.attributes.x);
                let y = Number(this.selectedOriginalClickState.attributes.y);
                let width = this.selectedOriginalClickState.sizeX;
                let height = this.selectedOriginalClickState.sizeY;

                switch (lastIndex) {
                  case 0:
                    x += transformedTotalDelta.x;
                    y += transformedTotalDelta.y;
                    width -= transformedTotalDelta.x;
                    height -= transformedTotalDelta.y;
                    break;
                  case 1:
                    y += transformedTotalDelta.y;
                    width += transformedTotalDelta.x;
                    height -= transformedTotalDelta.y;
                    break;
                  case 2:
                    x += transformedTotalDelta.x;
                    width -= transformedTotalDelta.x;
                    height += transformedTotalDelta.y;
                    break;
                  case 3:
                    width += transformedTotalDelta.x;
                    height += transformedTotalDelta.y;
                    break;
                }

                // Prevent negative
                width = Math.max(width, 0);
                height = Math.max(height, 0);
                if (width === 0) {
                  x = Number(this.selectedOriginalClickState.attributes.x);
                }
                if (height === 0) {
                  y = Number(this.selectedOriginalClickState.attributes.y);
                }

                this.getActiveComponent().updateKeyframes({
                  [this.getActiveComponent().getCurrentTimelineName()]: {
                    [rootSvgElement.componentId]: {
                      'style.overflow': {
                        0: {value: 'visible'},
                      },
                    },
                    [Element.directlySelected.attributes['haiku-id']]: {
                      x: {
                        [this.getActiveComponent().getCurrentTimelineTime()]: {
                          value: x,
                        },
                      },
                      y: {
                        [this.getActiveComponent().getCurrentTimelineTime()]: {
                          value: y,
                        },
                      },
                      width: {
                        [this.getActiveComponent().getCurrentTimelineTime()]: {
                          value: width,
                        },
                      },
                      height: {
                        [this.getActiveComponent().getCurrentTimelineTime()]: {
                          value: height,
                        },
                      },
                    },
                  },
                }, keyframeOptions, {from: 'glass'}, () => {});
                break;
              }
              case 'polyline':
              case 'polygon': {
                const points = SVGPoints.polyPointsStringToPoints(this.selectedOriginalClickState.attributes.points);
                for (let i = 0; i < indices.length; i++) {
                  points[indices[i]][0] += transformedTotalDelta.x;
                  points[indices[i]][1] += transformedTotalDelta.y;
                }
                this.getActiveComponent().updateKeyframes({
                  [this.getActiveComponent().getCurrentTimelineName()]: {
                    [rootSvgElement.componentId]: {
                      'style.overflow': {
                        0: {value: 'visible'},
                      },
                    },
                    [Element.directlySelected.attributes['haiku-id']]: {
                      points: {
                        [this.getActiveComponent().getCurrentTimelineTime()]: {
                          value: SVGPoints.pointsToPolyString(points),
                        },
                      },
                    },
                  },
                }, keyframeOptions, {from: 'glass'}, () => {});
                break;
              }

              case 'line': {
                const attrUpdate = {};
                const curTime = this.getActiveComponent().getCurrentTimelineTime();
                if (indices.includes(0)) {
                  attrUpdate.x1 = {[curTime]: {value: Number(this.selectedOriginalClickState.attributes.x1) + transformedTotalDelta.x}};
                  attrUpdate.y1 = {[curTime]: {value: Number(this.selectedOriginalClickState.attributes.y1) + transformedTotalDelta.y}};
                }
                if (indices.includes(1)) {
                  attrUpdate.x2 = {[curTime]: {value: Number(this.selectedOriginalClickState.attributes.x2) + transformedTotalDelta.x}};
                  attrUpdate.y2 = {[curTime]: {value: Number(this.selectedOriginalClickState.attributes.y2) + transformedTotalDelta.y}};
                }
                this.getActiveComponent().updateKeyframes({
                  [this.getActiveComponent().getCurrentTimelineName()]: {
                    [rootSvgElement.componentId]: {
                      'style.overflow': {
                        0: {value: 'visible'},
                      },
                    },
                    [Element.directlySelected.attributes['haiku-id']]: attrUpdate,
                  },
                }, keyframeOptions, {from: 'glass'}, () => {});
                break;
              }

              case 'path': {
                if (!this.selectedOriginalClickState.attributes.d) {
                  break;
                }
                const points = SVGPoints.pathToPoints(this.selectedOriginalClickState.attributes.d);
                const closed = points[points.length - 1].closed || points[points.length - 2].closed;

                if (closed && indices.includes(0) && !indices.includes(points.length - 1)) {
                  indices.push(points.length - 1);
                } // Handle the last duplicate point from the SVG path parsing library

                if (this.state.directSelectionAnchorActivation.meta !== null) {
                  // Modify a handle
                  if (points[lastIndex] && points[lastIndex].curve) {
                    points[lastIndex].curve['x' + (this.state.directSelectionAnchorActivation.meta + 1)] += transformedTotalDelta.x;
                    points[lastIndex].curve['y' + (this.state.directSelectionAnchorActivation.meta + 1)] += transformedTotalDelta.y;
                  }
                  if (!Globals.isSpecialKeyDown()) {
                    // Mirror the opposite handle if it exists
                    let oppositeIndex = null;
                    let oppositeHandle = null;
                    if (this.state.directSelectionAnchorActivation.meta === 0) {
                      // look backwards
                      oppositeHandle = '2';
                      if (lastIndex > 1) {
                        oppositeIndex = lastIndex - 1;
                      } else if (closed) {
                        oppositeIndex = points.length - 1;
                      }
                    } else if (this.state.directSelectionAnchorActivation.meta === 1) {
                      // look forwards
                      oppositeHandle = '1';
                      if (lastIndex < points.length - 1) {
                        oppositeIndex = lastIndex + 1;
                      } else if (closed) {
                        oppositeIndex = 1;
                      } // 1 (instead of 0) because 0 is typically a `moveTo` (SVG is wrong for this application)
                    }
                    if (oppositeIndex && points[oppositeIndex] && !points[oppositeIndex].curve) {
                      oppositeIndex = null;
                    }
                    if (oppositeIndex && points[oppositeIndex] && points[oppositeIndex].curve) {
                      points[oppositeIndex].curve[`x${oppositeHandle}`] -= transformedTotalDelta.x;
                      points[oppositeIndex].curve[`y${oppositeHandle}`] -= transformedTotalDelta.y;
                    }
                  }
                } else {
                  // Modify anchors
                  for (let i = 0; i < indices.length; i++) {
                    points[indices[i]].x += transformedTotalDelta.x;
                    points[indices[i]].y += transformedTotalDelta.y;
                    if (!Globals.isAltKeyDown) {
                      // Move the handles with it
                      if (
                        points[indices[i]] &&
                        points[indices[i]].curve &&
                        points[indices[i]].curve.hasOwnProperty('x2')
                      ) {
                        points[indices[i]].curve.x2 += transformedTotalDelta.x;
                        points[indices[i]].curve.y2 += transformedTotalDelta.y;
                      }
                      if (
                        indices[i] < points.length - 1 &&
                        points[indices[i] + 1] &&
                        points[indices[i] + 1].curve &&
                        points[indices[i] + 1].curve.hasOwnProperty('x1')
                      ) {
                        points[indices[i] + 1].curve.x1 += transformedTotalDelta.x;
                        points[indices[i] + 1].curve.y1 += transformedTotalDelta.y;
                      }
                    }
                  }
                }

                this.getActiveComponent().updateKeyframes({
                  [this.getActiveComponent().getCurrentTimelineName()]: {
                    [rootSvgElement.componentId]: {
                      'style.overflow': {
                        0: {value: 'visible'},
                      },
                    },
                    [Element.directlySelected.attributes['haiku-id']]: {
                      d: {
                        [this.getActiveComponent().getCurrentTimelineTime()]: {
                          value: SVGPoints.pointsToPath(points),
                        },
                      },
                    },
                  },
                }, keyframeOptions, {from: 'glass'}, () => {});
                break;
              }
            }
          } else {
            // Moving the whole shape
            switch (Element.directlySelected.type) {
              case 'ellipse':
              case 'circle': {
                this.getActiveComponent().updateKeyframes({
                  [this.getActiveComponent().getCurrentTimelineName()]: {
                    [rootSvgElement.componentId]: {
                      'style.overflow': {
                        0: {value: 'visible'},
                      },
                    },
                    [Element.directlySelected.attributes['haiku-id']]: {
                      cx: {
                        [this.getActiveComponent().getCurrentTimelineTime()]: {
                          value: Number(this.selectedOriginalClickState.attributes.cx) + transformedTotalDelta.x,
                        },
                      },
                      cy: {
                        [this.getActiveComponent().getCurrentTimelineTime()]: {
                          value: Number(this.selectedOriginalClickState.attributes.cy) + transformedTotalDelta.y,
                        },
                      },
                    },
                  },
                }, keyframeOptions, {from: 'glass'}, () => {});
                break;
              }
              case 'rect': {
                this.getActiveComponent().updateKeyframes({
                  [this.getActiveComponent().getCurrentTimelineName()]: {
                    [rootSvgElement.componentId]: {
                      'style.overflow': {
                        0: {value: 'visible'},
                      },
                    },
                    [Element.directlySelected.attributes['haiku-id']]: {
                      x: {
                        [this.getActiveComponent().getCurrentTimelineTime()]: {
                          value: Number(this.selectedOriginalClickState.attributes.x) + transformedTotalDelta.x,
                        },
                      },
                      y: {
                        [this.getActiveComponent().getCurrentTimelineTime()]: {
                          value: Number(this.selectedOriginalClickState.attributes.y) + transformedTotalDelta.y,
                        },
                      },
                    },
                  },
                }, keyframeOptions, {from: 'glass'}, () => {});
                break;
              }
              case 'polyline':
              case 'polygon': {
                const points = SVGPoints.polyPointsStringToPoints(this.selectedOriginalClickState.attributes.points);
                for (let i = 0; i < points.length; i++) {
                  points[i][0] += transformedTotalDelta.x;
                  points[i][1] += transformedTotalDelta.y;
                }
                this.getActiveComponent().updateKeyframes({
                  [this.getActiveComponent().getCurrentTimelineName()]: {
                    [rootSvgElement.componentId]: {
                      'style.overflow': {
                        0: {value: 'visible'},
                      },
                    },
                    [Element.directlySelected.attributes['haiku-id']]: {
                      points: {
                        [this.getActiveComponent().getCurrentTimelineTime()]: {
                          value: SVGPoints.pointsToPolyString(points),
                        },
                      },
                    },
                  },
                }, keyframeOptions, {from: 'glass'}, () => {});
                break;
              }

              case 'line': {
                this.getActiveComponent().updateKeyframes({
                  [this.getActiveComponent().getCurrentTimelineName()]: {
                    [rootSvgElement.componentId]: {
                      'style.overflow': {
                        0: {value: 'visible'},
                      },
                    },
                    [Element.directlySelected.attributes['haiku-id']]: {
                      x1: {
                        [this.getActiveComponent().getCurrentTimelineTime()]: {
                          value: Number(this.selectedOriginalClickState.attributes.x1) + transformedTotalDelta.x,
                        },
                      },
                      y1: {
                        [this.getActiveComponent().getCurrentTimelineTime()]: {
                          value: Number(this.selectedOriginalClickState.attributes.y1) + transformedTotalDelta.y,
                        },
                      },
                      x2: {
                        [this.getActiveComponent().getCurrentTimelineTime()]: {
                          value: Number(this.selectedOriginalClickState.attributes.x2) + transformedTotalDelta.x,
                        },
                      },
                      y2: {
                        [this.getActiveComponent().getCurrentTimelineTime()]: {
                          value: Number(this.selectedOriginalClickState.attributes.y2) + transformedTotalDelta.y,
                        },
                      },
                    },
                  },
                }, keyframeOptions, {from: 'glass'}, () => {});
                break;
              }

              case 'path': {
                if (!this.selectedOriginalClickState.attributes.d) {
                  break;
                }
                const points = SVGPoints.pathToPoints(this.selectedOriginalClickState.attributes.d);
                for (let i = 0; i < points.length; i++) {
                  if (!points[i]) {
                    continue;
                  }
                  points[i].x += transformedTotalDelta.x;
                  points[i].y += transformedTotalDelta.y;
                  if (points[i].curve) {
                    points[i].curve.x1 += transformedTotalDelta.x;
                    points[i].curve.y1 += transformedTotalDelta.y;
                    points[i].curve.x2 += transformedTotalDelta.x;
                    points[i].curve.y2 += transformedTotalDelta.y;
                  }
                }
                this.getActiveComponent().updateKeyframes({
                  [rootSvgElement.componentId]: {
                    'style.overflow': {
                      0: {value: 'visible'},
                    },
                  },
                  [this.getActiveComponent().getCurrentTimelineName()]: {
                    [Element.directlySelected.attributes['haiku-id']]: {
                      d: {
                        [this.getActiveComponent().getCurrentTimelineTime()]: {
                          value: SVGPoints.pointsToPath(points),
                        },
                      },
                    },
                  },
                }, keyframeOptions, {from: 'glass'}, () => {});
                break;
              }
            }
          }
        } else {
          const proxy = this.fetchProxyElementForSelection();

          // Do not drag elements if the user is actively selecting them
          if (!marquee.isActive()) {
            this.didDragSinceLastMouseDown = true;

            proxy.drag(
              dx,
              dy,
              mousePositionCurrent,
              mousePositionPrevious,
              lastMouseDownPosition,
              this.state.isAnythingScaling,
              this.state.isAnythingRotating,
              this.state.isOriginPanning,
              this.state.controlActivation,
              viewportTransform,
              Globals,
            );
          }
        }
      }
    }

    return mousePositionCurrent;
  }

  originActivation ({event}) {
    // TODO: support more modes (and make them discoverable).
    this.setState({
      isOriginPanning: Globals.isSpecialKeyDown(),
    });
  }

  controlActivation (activationInfo) {
    this.setState({
      isAnythingRotating: Globals.isSpecialKeyDown(),
      isAnythingScaling: !Globals.isSpecialKeyDown(),
      controlActivation: {
        shift: Globals.isShiftKeyDown,
        ctrl: Globals.isControlKeyDown,
        // Should be isCommandKeyDown, but it not really abstracted. A refactor could include
        // merging isAnythingRotating/isAnythingScaling and controlActivation.cmd logics
        cmd: Globals.isSpecialKeyDown(),
        alt: Globals.isAltKeyDown,
        index: activationInfo.index,
        x: this.state.mousePositionCurrent.x,
        y: this.state.mousePositionCurrent.y,
      },
    });

    this.fetchProxyElementForSelection().pushCachedTransform('CONTROL_ACTIVATION');
  }

  directSelectionAnchorActivation (activationInfo) {
    this.setState({
      directSelectionAnchorActivation: activationInfo,
    });
  }

  storeAndReturnMousePosition (mouseEvent, additionalPositionTrackingState) {
    if (!this.getActiveComponent()) {
      return;
    }

    if (!this.refs.container) {
      return; // We haven't mounted yet, no size available
    }

    this.state.mousePositionPrevious = this.state.mousePositionCurrent;
    const artboard = this.getActiveComponent().getArtboard();
    const rect = artboard.getRect();
    const zoom = artboard.getZoom();
    this.state.mousePositionCurrent = {
      clientX: mouseEvent.nativeEvent.clientX,
      clientY: mouseEvent.nativeEvent.clientY,
      x: (mouseEvent.nativeEvent.clientX - rect.left) / zoom,
      y: (mouseEvent.nativeEvent.clientY - rect.top) / zoom,
    };
    if (additionalPositionTrackingState) {
      this.state[additionalPositionTrackingState] = this.state.mousePositionCurrent;
    }
    return this.state.mousePositionCurrent;
  }

  drawOverlays () {
    if (!this.getActiveComponent()) {
      return;
    }

    if (!this._haikuRenderer) {
      const haikuConfig = Config.build({
        seed: Config.seed(),
        cache: {},
      });

      this._haikuRenderer = new HaikuDOMRenderer(
        this.refs.overlay,
        haikuConfig,
      );

      this._haikuContext = new HaikuContext(
        null,
        this._haikuRenderer,
        {},
        {
          template: {
            elementName: 'div',
            attributes: {},
            children: [],
          },
        },
        haikuConfig,
      );
    }

    // When we enter preview mode, this ref element is not rendered, i.e.
    // removed from the DOM. When we exit preview mode, a new element is
    // created, meaning that our original mount element has been detached.
    // We need to reassign the new, attached DOM node so the transform
    // controls render again after we exit preview mode.
    this._haikuRenderer.mount = this.refs.overlay;

    const container = {
      layout: {
        computed: {x: 1, y: 1},
      },
    };

    const artboard = this.getActiveComponent().getArtboard();

    const overlay = {
      elementName: 'div',
      attributes: {
        id: 'haiku-glass-overlay-root',
        style: {
          position: 'absolute',
          overflow: 'visible',
          left: artboard.getMountX() + 'px',
          top: artboard.getMountY() + 'px',
          width: artboard.getMountWidth() + 'px',
          height: artboard.getMountHeight() + 'px',
        },
      },
      children: [
        {
          elementName: 'svg',
          attributes: {
            style: {
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              overflow: 'visible',
            },
          },
          children: this.buildDrawnOverlays(),
        },
      ],
    };

    this._haikuRenderer.render(
      container,
      overlay,
      this._haikuContext.component,
    );
  }

  // This method creates objects which represent Haiku Core rendering instructions for displaying all of
  // the visual effects that sit above the stage. (Transform controls, etc.) The Haiku Core is sort of a
  // hybrid of React Fiber and Famous Engine. It has a virtual DOM tree of elements like {elementName: 'div', attributes: {}, []},
  // and flushes updates to them on each frame. So what _this method_ does is just build those objects and then
  // these get passed into a Haiku Core render method (see above). LONG STORY SHORT: This creates a flat list of
  // nodes that get rendered to the DOM by the Haiku Core.
  buildDrawnOverlays () {
    const overlays = [];

    // Don't show any overlays if we're in preview (aka 'live') interactionMode
    if (this.isPreviewMode()) {
      return overlays;
    }

    if (Element.directlySelected) {
      // Make sure it's not locked
      const originalEl = Element.findByComponentAndHaikuId(this.getActiveComponent(), Element.directlySelected.attributes['haiku-id']);
      if (originalEl && originalEl.isLockedViaParents()) {
        Element.directlySelected = null;
        return overlays;
      }

      this.renderDirectSelection(
        Element.directlySelected,
        this.state.directSelectionAnchorActivation
          ? this.state.directSelectionAnchorActivation.indices[Element.directlySelected.attributes['haiku-id']]
          : undefined,
        overlays,
      );

      return overlays;
    }

    const proxy = this.fetchProxyElementForSelection();

    if (proxy.hasAnythingInSelection()) {
      this.renderTransformBoxOverlay(
        proxy,
        overlays,
        !this.state.isOriginPanning && Globals.isSpecialKeyDown(),
      );
    }

    this.renderSelectionMarquee(overlays);

    this.renderSnapLines(overlays);

    return overlays;
  }

  fetchProxyElementForSelection () {
    const component = this.getActiveComponent();
    if (component) {
      return ElementSelectionProxy.fromSelection(Element.where({component, _isSelected: true}), component);
    }
  }

  renderDirectSelection (element, selectedAnchorIndices, overlays) {
    const original = element;
    if (element.type === 'use') {
      // tslint:disable-next-line:no-parameter-reassignment
      element = element.getTranscludedElement();
    }

    const zoom = this.getActiveComponent().getArtboard().getZoom();
    const scale = 1 / (zoom || 1);

    switch (element.type) {
      case 'rect':
        overlays.push(directSelectionMana[element.type](
          element.id,
          {
            ...element.attributes,
            width: element.sizeX,
            height: element.sizeY,
          },
          original.layoutAncestryMatrices,
          scale,
          selectedAnchorIndices || [],
        ));
        break;
      case 'circle':
      case 'ellipse':
      case 'line':
      case 'polyline':
      case 'path':
      case 'polygon':
        overlays.push(directSelectionMana[element.type](
          element.id,
          element.attributes,
          original.layoutAncestryMatrices,
          scale,
          selectedAnchorIndices || [],
        ));
        break;
      default:
        // ...noop.
    }
  }

  renderSelectionMarquee (overlays) {
    if (this.getActiveComponent()) {
      const marquee = this.getActiveComponent().getSelectionMarquee();

      if (marquee.isActive()) {
        const {
          x,
          y,
          width,
          height,
        } = marquee.getBox();

        if (width < 2 && height < 2) {
          return;
        }

        overlays.push({
          elementName: 'rect',
          attributes: {
            id: `selection-marquee-${marquee.getPrimaryKey()}`,
            key: 'selection-marquee',
            x,
            y,
            width,
            height,
            stroke: Palette.DARKER_ROCK2,
            'stroke-width': 1,
            'vector-effect': 'non-scaling-stroke',
            fill: Palette.ROCK,
            'fill-opacity': 0.25,
            rx: 1,
            ry: 1,
            style: {
              pointerEvents: 'none',
            },
          },
        });
      }
    }
  }

  openContextMenu (event) {
    if (this.isPreviewMode()) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    PopoverMenu.launch({
      event,
      items: this.getContextMenuItems(),
    });
  }

  pointHasNaN (point) {
    return (
      Number.isNaN(point.x) ||
      Number.isNaN(point.y) ||
      Number.isNaN(point.z)
    );
  }

  renderTransformBoxOverlay (proxy, overlays, isRotationModeOn) {
    if (!this.getActiveComponent()) {
      return;
    }

    const zoom = this.getActiveComponent().getArtboard().getZoom();
    const points = proxy.getBoxPointsTransformed();

    // If the size is smaller than a threshold, only display the corners.
    // And if it is smaller even than that, don't display the points at all
    const dx = Element.distanceBetweenPoints(points[0], points[2], zoom);
    const dy = Element.distanceBetweenPoints(points[0], points[6], zoom);

    let pointDisplayMode = POINT_DISPLAY_MODES.NORMAL;

    if (dx < POINTS_THRESHOLD_NONE || dy < POINTS_THRESHOLD_NONE) {
      pointDisplayMode = POINT_DISPLAY_MODES.NONE;
    } else if (dx < POINTS_THRESHOLD_REDUCED && dy < POINTS_THRESHOLD_REDUCED) {
      pointDisplayMode = POINT_DISPLAY_MODES.REDUCED_ON_BOTH;
    } else if (dx < POINTS_THRESHOLD_REDUCED && dy >= POINTS_THRESHOLD_REDUCED) {
      pointDisplayMode = POINT_DISPLAY_MODES.REDUCED_ON_TOP_BOTTOM;
    } else if (dx >= POINTS_THRESHOLD_REDUCED && dy < POINTS_THRESHOLD_REDUCED) {
      pointDisplayMode = POINT_DISPLAY_MODES.REDUCED_ON_LEFT_RIGHT;
    }

    const scale = 1 / (zoom || 1);
    const canRotate = proxy.canRotate();
    const canControlHandles = proxy.canControlHandles();
    const origin = proxy.getOriginTransformed();

    if (pointDisplayMode !== POINT_DISPLAY_MODES.NONE) {
      const vecs = points.map((point) => [point.x, point.y]);

      // We make the line dashed to represent axes which are auto-sized
      overlays.push(lineMana(vecs[0], vecs[2], undefined, proxy.isAutoSizeX())); // top
      overlays.push(lineMana(vecs[2], vecs[8], undefined, proxy.isAutoSizeY())); // right
      overlays.push(lineMana(vecs[8], vecs[6], undefined, proxy.isAutoSizeX())); // bottom
      overlays.push(lineMana(vecs[6], vecs[0], undefined, proxy.isAutoSizeY())); // left
    }

    points.forEach((point, index) => {
      if (!pointDisplayMode[index]) {
        return;
      }

      if (this.pointHasNaN(point)) {
        return;
      }

      if (index !== 4) {
        overlays.push(controlPointMana(
          scale,
          point,
          index,
          canControlHandles ? 'none' : this.getCursorCssRule(),
        ));
      }
    });

    if (canRotate && pointDisplayMode !== POINT_DISPLAY_MODES.NONE) {
      if (!this.pointHasNaN(origin)) {
        overlays.push(originMana(
          scale,
          origin.x,
          origin.y,
          Globals.isSpecialKeyDown(),
        ));
      }
    }

    // Everything below requires controllable handles.
    if (!canControlHandles || this.state.isOriginPanning) {
      return;
    }

    if (!this.state.isAnythingScaling && canRotate && (
      (this.state.hoveredControlPointIndex !== null && isRotationModeOn) ||
      this.state.isAnythingRotating
    )) {
      overlays.push(rotationCursorMana(scale, this.state.mousePositionCurrent, origin));
    } else if (this.state.isAnythingScaling ||
      (this.state.hoveredControlPointIndex !== null && !this.state.isMouseDown)
    ) {
      overlays.push(scaleCursorMana(
        scale,
        this.state.mousePositionCurrent,
        points,
        origin,
        this.state.controlActivation ? this.state.controlActivation.index : this.state.hoveredControlPointIndex,
        Globals.isAltKeyDown,
      ));
    }
  }

  getCSSTransform (zoom, pan) {
    return 'matrix3d(' +
      [zoom.x, 0, 0, 0,
        0, zoom.y, 0, 0,
        0, 0, 1, 0,
        pan.x / zoom.x, pan.y / zoom.x, 0, 1].join(',') + ')';
  }

  isPreviewMode () {
    if (!this.getActiveComponent()) {
      return false;
    }
    return this.getActiveComponent().isPreviewModeActive();
  }

  isMarqueeActive () {
    return this.getActiveComponent() && this.getActiveComponent().getSelectionMarquee().isActive();
  }

  getCursorCssRule () {
    if (this.isPreviewMode()) {
      return 'default';
    }
    if (this.state.isAnythingRotating || this.state.isAnythingScaling) {
      return 'none';
    }
    return (this.state.stageMouseDown) ? '-webkit-grabbing' : 'default';
  }

  renderHotComponentMount (mount) {
    const opacity = this.isPreviewMode() ? 0 : (this.state.isEventHandlerEditorOpen ? 0.5 : 1.0);
    return (
      <div
        ref="mount"
        key="haiku-mount-container"
        id="haiku-mount-container"
        className="no-select"
        style={{
          opacity,
          position: 'absolute',
          left: mount.x,
          top: mount.y,
          width: mount.w,
          height: mount.h,
          overflow: 'visible',
          zIndex: 60,
        }} />
    );
  }

  getContainerHeight () {
    if (!this.getActiveComponent()) {
      return 1;
    }
    return this.getActiveComponent().getArtboard().getContainerHeight();
  }

  getArtboardRenderInfo () {
    if (!this.getActiveComponent()) {
      // Pretty hack to put this here, but we have to render _something_ or else the
      // Glass won't initialize properly due to the way it is currently set up.
      // TODO: Make glass more accepting of situations where there is no component
      return {
        pan: {x: 0, y: 0},
        zoom: {x: 1, y: 1},
        container: {x: 1, y: 1, w: 1, h: 1},
        mount: {x: 1, y: 1, w: 1, h: 1},
      };
    }

    return this.getActiveComponent().getArtboard().getArtboardRenderInfo();
  }

  getDirectlySelectedElementModel () {
    if (!Element.directlySelected) {
      return;
    }

    return this.getActiveComponent().findElementByComponentId(
      Element.directlySelected.componentId,
    );
  }

  getContextMenuItems () {
    const items = [];

    const proxy = this.fetchProxyElementForSelection();

    items.push({
      label: 'Create Component',
      onClick: () => {
        mixpanel.haikuTrack('creator:glass:launch-create-component-modal');
        if (proxy.hasNothingInSelection()) {
          this.setState({
            conglomerateComponentOptions: {
              isBlankComponent: true,
              skipInstantiateInHost: true,
            },
          }, () => {
            this.launchComponentNameModal();
          });
        } else {
          this.launchComponentNameModal();
        }
      },
    });

    items.push({
      label: 'Edit Component',
      enabled: proxy.canEditComponentFromSelection(),
      onClick: () => {
        this.editComponent(proxy.getSingleComponentElementRelpath());
      },
    });

    items.push({type: 'separator'});

    items.push({
      label: 'Edit Element Actions',
      // Show the actions menu if there is nothing selected for editing artboard actions
      enabled: proxy.doesManageSingleElement() || proxy.hasNothingInSelection(),
      onClick: (event) => {
        const element = (
          this.getDirectlySelectedElementModel() || // Allow binding elements directly to sub-elements
          proxy.selection[0] ||
          this.getActiveComponent().getArtboard().getElement() // Fallback to the artboard if there is nothing in the current selection
        );

        this.props.websocket.send({
          type: 'broadcast',
          from: 'glass',
          name: 'show-event-handlers-editor',
          elid: element.getPrimaryKey(),
          opts: {},
          frame: null,
        });
      },
    });

    items.push({type: 'separator'});

    items.push({
      label: isWindows() ? 'Show in File Explorer' : 'Show in Finder',
      enabled: proxy.isSelectionFinderOpenable(),
      onClick: () => {
        mixpanel.haikuTrack('creator:glass:open-in-finder');
        shell.openItem(proxy.getAbspath());
      },
    });

    // Only display Edit In Sketch on mac
    if (isMac()) {
      items.push({
        label: 'Edit in Sketch',
        enabled: proxy.isSelectionSketchEditable(),
        onClick: () => {
          mixpanel.haikuTrack('creator:glass:edit-in-sketch');
          shell.openItem(path.join(this.props.folder, proxy.getSketchAssetPath()));
        },
      });
    }

    items.push({
      label: 'Edit in Figma',
      enabled: proxy.isSelectionFigmaEditable(),
      onClick: () => {
        mixpanel.haikuTrack('creator:glass:edit-in-figma');
        shell.openExternal(proxy.getFigmaAssetLink());
      },
    });

    items.push({
      label: 'Edit in Illustrator',
      enabled: proxy.isSelectionIllustratorEditable(),
      onClick: () => {
        mixpanel.haikuTrack('creator:glass:edit-in-illustrator');
        shell.openItem(path.join(this.props.folder, proxy.getIllustratorAssetPath()));
      },
    });

    items.push({type: 'separator'});

    items.push({
      label: 'Cut',
      enabled: proxy.canCut(),
      onClick: () => {
        this.handleCut();
      },
    });

    items.push({
      label: 'Copy',
      enabled: proxy.canCopy(),
      onClick: () => {
        this.handleCopy();
      },
    });

    items.push({
      label: 'Paste',
      enabled: proxy.canPaste(),
      onClick: (event) => {
        this.handlePaste();
      },
    });

    items.push({type: 'separator'});

    items.push({
      label: 'Group',
      enabled: proxy.canGroup(),
      onClick: () => {
        mixpanel.haikuTrack('creator:glass:create-group');
        this.handleGroupDebounced();
      },
    });

    items.push({
      label: 'Ungroup',
      enabled: proxy.canUngroup(),
      onClick: () => {
        this.handleUngroupDebounced();
      },
    });

    items.push({type: 'separator'});

    items.push({
      label: 'Delete',
      enabled: proxy.canDelete(),
      onClick: () => {
        this.handleDelete();
      },
    });

    items.push({type: 'separator'});

    items.push({
      label: 'Forward',
      enabled: proxy.canBringForward(),
      onClick: () => {
        mixpanel.haikuTrack('creator:glass:bring-forward');
        proxy.bringForward();
      },
    });

    items.push({
      label: 'Backward',
      enabled: proxy.canSendBackward(),
      onClick: () => {
        mixpanel.haikuTrack('creator:glass:send-backward');
        proxy.sendBackward();
      },
    });

    items.push({
      label: 'Bring to Front',
      enabled: proxy.canBringToFront(),
      onClick: () => {
        mixpanel.haikuTrack('creator:glass:bring-to-front');
        proxy.bringToFront();
      },
    });

    items.push({
      label: 'Send to Back',
      enabled: proxy.canSendToBack(),
      onClick: () => {
        mixpanel.haikuTrack('creator:glass:send-to-back');
        proxy.sendToBack();
      },
    });

    items.push({type: 'separator'});

    items.push({
      label: 'Copy SVG',
      enabled: proxy.canCopySVG(),
      onClick: (event) => {
        mixpanel.haikuTrack('creator:glass:copy-svg');
        clipboard.writeText(proxy.copySVG());
      },
    });

    items.push({
      label: 'HTML Snapshot',
      enabled: proxy.canHTMLSnapshot(),
      onClick: (event) => {
        mixpanel.haikuTrack('creator:glass:html-snapshot');
        this.getActiveComponent().htmlSnapshot((err, html) => {
          if (err) {
            return;
          }

          clipboard.writeText(html);
          writeHtmlSnapshot(html, this);
        });
      },
    });

    if (process.env.NODE_ENV !== 'production') {
      items.push({type: 'separator'});

      items.push({
        label: 'Inspect Element',
        enabled: proxy.doesManageSingleElement(),
        onClick: (event) => {
          if (remote) {
            const publicComponentModel = this.getActiveComponent().$instance;
            const internalElementModel = proxy.getElement();

            if (publicComponentModel && internalElementModel) {
              const publicElementModel = publicComponentModel.querySelector(`haiku:${internalElementModel.getComponentId()}`);
              window.element = publicElementModel;
              console.info('element', publicElementModel);
              console.info('element.target', publicElementModel.target);
            }
          }
        },
      });
    }

    return items;
  }

  render () {
    const {
      pan,
      zoom,
      container,
      mount,
    } = this.getArtboardRenderInfo();

    return (
      <div
        id="stage-root"
        style={{
          width: '100%',
          height: '100%',
          visibility: (this.getActiveComponent()) ? 'visible' : 'hidden',
          cursor: this.getCursorCssRule(),
          backgroundColor: (this.isPreviewMode()) ? 'white' : 'inherit',
        }}

        onMouseDown={(mouseDown) => {
          const targetId = mouseDown.nativeEvent.target && mouseDown.nativeEvent.target.id;

          if (
              targetId === 'stage-root' ||
              targetId === 'full-background' ||
              targetId === 'haiku-glass-stage-container' ||
              targetId === 'haiku-glass-stage-background-live' ||
              targetId === 'haiku-glass-stage-background-preview' ||
              targetId === 'haiku-glass-stage-background-preview-border'
            ) {
            // If unselecting anything except an actual element, assume we want to deselect all
            Element.unselectAllElements({component: this.getActiveComponent()}, {from: 'glass'});
          }

          if (this.getActiveComponent() && !this.isPreviewMode()) {
            this.getActiveComponent().getArtboard().snapshotOriginalPan();
          }

          this.setState({
            stageMouseDown: {
              x: mouseDown.nativeEvent.clientX,
              y: mouseDown.nativeEvent.clientY,
            },
          });
        }}
        onContextMenu={(event) => {
          this.openContextMenu(event);
        }}
        onMouseUp={() => {
          this.setState({stageMouseDown: null});
        }}
        onMouseLeave={() => {
          this.setState({stageMouseDown: null});
        }}>

        {(!this.isPreviewMode())
          ? <div
            id="zoom-indicator"
            className="no-select"
            style={{
              position: 'fixed',
              top: 5,
              right: 10,
              zIndex: MAX_Z_INDEX - 8,
              color: '#ccc',
              fontSize: 14,
            }}>
            {Math.round(zoom.x / 1 * 100)}%
            </div>
          : ''}

        {!this.isPreviewMode() && this.state.isCreateComponentModalOpen &&
          <CreateComponentModal
            options={this.state.conglomerateComponentOptions}
            isOpen={this.state.isCreateComponentModalOpen}
            existingComponentNames={this.project.getExistingComponentNames()}
            onSubmit={(componentName, options) => {
              this.setState({
                conglomerateComponentOptions: {},
                isCreateComponentModalOpen: false,
              }, () => {
                this.conglomerateComponentFromSelectedElementsWithTitle(
                  componentName,
                  options,
                );
              });
            }}
            onCancel={() => {
              this.setState({
                conglomerateComponentOptions: {},
                isCreateComponentModalOpen: false,
              });
            }}
          />
        }

        <div
          ref="container"
          id="haiku-glass-stage-container"
          style={{
            width: '100%',
            height: '100%',
            overflow: 'visible',
            position: 'absolute',
            top: 0,
            left: 0,
            transform: this.getCSSTransform(zoom, pan),
            backgroundColor: 'inherit',
          }}>

          {(!this.isPreviewMode())
            ? <svg
              id="haiku-glass-stage-background-live"
              style={{
                position: 'absolute',
                top: container.y,
                left: container.x,
                width: container.w,
                height: container.h,
                overflow: 'visible',
              }}>
              <defs>
                <filter id="background-blur" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur" />
                  <feFlood floodColor="rgba(33, 45, 49, .5)" floodOpacity="0.8" result="offsetColor" />
                  <feComposite in="offsetColor" in2="blur" operator="in" result="totalBlur" />
                  <feBlend in="SourceGraphic" in2="totalBlur" mode="normal" />
                </filter>
              </defs>
              <rect id="full-background" x={container.x} y={container.y} width={container.w} height={container.w} fill="transparent" />
              <rect id="mount-background-blur" filter="url(#background-blur)" x={mount.x} y={mount.y} width={mount.w} height={mount.h} fill="white" />
              <rect id="mount-background" x={mount.x} y={mount.y} width={mount.w} height={mount.h} fill="white" />
            </svg>
            : ''}

          {(!this.isPreviewMode())
            ? <div
              style={{
                position: 'absolute',
                zIndex: 10,
                bottom: Math.min(container.h, window.innerHeight) - mount.y,
                left: mount.x + 2,
                height: 20,
                width: mount.w,
                userSelect: 'none',
                cursor: 'default',
                whiteSpace: 'nowrap', // Prevent wrapping if name is longer than stage box
                overflow: 'visible',
                transformOrigin: 'bottom left',
                transform: `scale(${1 / zoom.x})`,
              }}
              onClick={this.handleClickStageName.bind(this)}
              onMouseOver={this.handleMouseOverStageName.bind(this)}
              onMouseOut={this.handleMouseOutStageName.bind(this)}>
              <span
                id="project-name"
                style={{
                  color: Palette.FATHER_COAL,
                  fontWeight: 'lighter',
                  fontFamily: 'Fira Sans',
                  fontSize: 13,
                }}>
                {`${this.props.userconfig.project || '[n/a]'} (`}
              </span>
              <span style={{position: 'relative', top: 3, marginLeft: 2, marginRight: 2}}>
                <ComponentIconSVG/>
              </span>
              <span
                id="component-name"
                style={{
                  color: Palette.FATHER_COAL,
                  fontWeight: 'lighter',
                  fontFamily: 'Fira Sans',
                  fontSize: 13,
                }}>
                {`${(this.getActiveComponent() && this.getActiveComponent().getTitle()) || '…'})`}
              </span>
            </div>
            : ''}

          {(!this.isPreviewMode())
            ? <svg
              id="haiku-glass-opacitator"
              style={{
                position: 'absolute',
                top: container.y,
                left: container.x,
                zIndex: 20,
                width: container.w,
                height: container.h,
                pointerEvents: 'none',
                overflow: 'visible',
              }}>
              {/* draw a semiopaque rect with a transparent cutout */}
              <path
                d={`
                  M-${BIG_NUMBER},-${BIG_NUMBER}
                  V${BIG_NUMBER}
                  H${BIG_NUMBER}
                  V-${BIG_NUMBER}
                  Z
                  M${mount.x + mount.w},${mount.y + mount.h}
                  H${mount.x}
                  V${mount.y}
                  H${mount.x + mount.w}
                  Z
                `.split('\n').join('')}
                style={{
                  fill: '#111',
                  opacity: 0.1,
                  pointerEvents: 'none',
                  overflow: 'visible',
                }} />
            </svg>
            : ''}

          {(!this.isPreviewMode())
            ? <svg
              id="haiku-glass-stage-border"
              style={{
                position: 'absolute',
                top: container.y,
                left: container.x,
                zIndex: 1010,
                width: container.w,
                height: container.h,
                pointerEvents: 'none',
                overflow: 'visible',
              }}>
              {/* draw a semiopaque rect with a transparent cutout */}
              <path
                d={`
                  M-${BIG_NUMBER},-${BIG_NUMBER}
                  V${BIG_NUMBER}
                  H${BIG_NUMBER}
                  V-${BIG_NUMBER}
                  Z
                  M${mount.x + mount.w},${mount.y + mount.h}
                  H${mount.x}
                  V${mount.y}
                  H${mount.x + mount.w}
                  Z
                `.split('\n').join('')}
                style={{
                  fill: '#FFF',
                  opacity: 0.5,
                  pointerEvents: 'none',
                }} />
              {/* draw the border around the stage when selected */}
              <rect
                x={mount.x - 1}
                y={mount.y - 1}
                width={mount.w + 2}
                height={mount.h + 2}
                style={{
                  strokeWidth: 1.5,
                  fill: 'none',
                  stroke: Palette.LIGHT_BLUE,
                  opacity: this.state.isStageNameHovering && !this.state.isStageSelected ? 1 : 0,
                  overflow: 'visible',
                }}
                />
            </svg>
            : ''}

          {(!this.isPreviewMode())
            ? <div
              ref="overlay"
              id="haiku-glass-overlay-mount"
              style={{
                pointerEvents: 'none', // This needs to be un-set for surface elements that take mouse interaction
                width: container.w,
                height: this.getContainerHeight(),
                position: 'absolute',
                overflow: 'visible',
                top: container.y,
                left: container.x,
                zIndex: 1999,
                opacity: (this.state.isEventHandlerEditorOpen) ? 0.5 : 1.0,
              }} />
            : ''}

          {this.renderHotComponentMount(mount)}
          {(!this.isPreviewMode())
            ? <div
              ref="outline"
              id="haiku-glass-outline-mount"
              style={{
                position: 'absolute',
                pointerEvents: 'none',
                left: mount.x,
                top: mount.y,
                width: mount.w,
                height: mount.h,
                overflow: this.isPreviewMode() ? 'hidden' : 'visible',
                zIndex: 60,
                opacity: (this.state.isEventHandlerEditorOpen) ? 0.5 : 1.0,
              }} />
            : ''}

          {(this.isPreviewMode())
            ? <div
              id="preview-container"
              style={{
                position: 'absolute',
                left: mount.x,
                top: mount.y,
                width: mount.w,
                height: mount.h,
                overflow: 'hidden',
                zIndex: MAX_Z_INDEX - 4,
              }}>
              <Preview
                container={container}
                mount={mount}
                component={this.getActiveComponent()} />
            </div>
            : ''}
        </div>
      </div>
    );
  }
}

function belongsToMenuIcon (target) {
  if (!target || !target.getAttribute) {
    return false;
  }

  if (target.getAttribute('id') === 'element-menu-icon-wrapper') {
    return true;
  }

  return belongsToMenuIcon(target.parentNode);
}

Glass.propTypes = {
  userconfig: React.PropTypes.object,
  websocket: React.PropTypes.object,
  folder: React.PropTypes.string,
};

export default Glass;
