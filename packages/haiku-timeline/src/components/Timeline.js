import {remote, ipcRenderer} from 'electron';
import * as React from 'react';
import * as lodash from 'lodash';
import * as BaseModel from 'haiku-serialization/src/bll/BaseModel';
import * as Project from 'haiku-serialization/src/bll/Project';
import * as Asset from 'haiku-serialization/src/bll/Asset';
import * as Row from 'haiku-serialization/src/bll/Row';
import * as File from 'haiku-serialization/src/bll/File';
import * as Keyframe from 'haiku-serialization/src/bll/Keyframe';
import * as Property from 'haiku-serialization/src/bll/Property';
import * as requestElementCoordinates from 'haiku-serialization/src/utils/requestElementCoordinates';
import * as EmitterManager from 'haiku-serialization/src/utils/EmitterManager';
import Palette from 'haiku-ui-common/lib/Palette';
import PopoverMenu from 'haiku-ui-common/lib/electron/PopoverMenu';
import BezierPopup from './BezierPopup';
import ControlsArea from './ControlsArea';
import ComponentRows from './ComponentRows';
import ExpressionInput from './ExpressionInput';
import ScrubberInterior from './ScrubberInterior';
import SimplifiedFrameGrid from './SimplifiedFrameGrid';
import FrameActionsGrid from './FrameActionsGrid';
import {TrackedExporterRequests} from './TrackedExporterRequests';
import Gauge from './Gauge';
import GaugeTimeReadout from './GaugeTimeReadout';
import TimelineRangeScrollbar from './TimelineRangeScrollbar';
import ScrollView from './ScrollView';
import Marquee from './Marquee';
import PropertiesPanelResizer from './PropertiesPanelResizer';
import {InteractionMode, isPreviewMode} from 'haiku-ui-common/lib/interactionModes';
import EnvoyClient from 'haiku-sdk-creator/lib/envoy/EnvoyClient';
import {ERROR_CHANNEL} from 'haiku-sdk-creator/lib/bll/Error';
import {USER_CHANNEL, UserSettings} from 'haiku-sdk-creator/lib/bll/User';
import {EXPORTER_CHANNEL} from 'haiku-sdk-creator/lib/exporter';
import * as logger from 'haiku-serialization/src/utils/LoggerInstance';
import {Experiment, experimentIsEnabled} from 'haiku-common/lib/experiments';
import zIndex from './styles/zIndex';
import Globals from 'haiku-ui-common/lib/Globals';

// Useful debugging originator of calls in shared model code
process.env.HAIKU_SUBPROCESS = 'timeline';

const {webFrame} = require('electron');
if (webFrame) {
  if (webFrame.setZoomLevelLimits) {
    webFrame.setZoomLevelLimits(1, 1);
  }
  if (webFrame.setLayoutZoomLevelLimits) {
    webFrame.setLayoutZoomLevelLimits(0, 0);
  }
}

const DEFAULTS = {
  rowHeight: 25,
  meterHeight: 25,
  controlsHeight: 42,
  playerPlaybackSpeed: 1.0,
  isShiftKeyDown: false,
  isCommandKeyDown: false,
  isControlKeyDown: false,
  isAltKeyDown: false,
  isPreviewModeActive: false,
  isRepeat: true,
  flush: false,
  userDetails: null,
  trackedExporterRequests: [],
  showBezierEditor: false,
};

const THROTTLE_TIME = 32; // ms
const MARQUEE_THROTTLE_TIME = 100; // ms
const MENU_ACTION_DEBOUNCE_TIME = 100; // ms
const TIMELINE_OFFSET_PADDING = 7; // px
const MARQUEE_THRESHOLD = 15; // px

class Timeline extends React.Component {
  constructor (props) {
    super(props);

    EmitterManager.extend(this);

    this.state = lodash.assign({}, DEFAULTS);
    this.isEditingRowTitle = false;

    this.isShiftKeyDown = false;
    this.isCommandKeyDown = false;
    this.isControlKeyDown = false;
    this.isAltKeyDown = false;

    this._lastCopiedCurve = null;

    Project.setup(
      this.props.folder,
      'timeline',
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
    this.showFrameActionsEditor = this.showFrameActionsEditor.bind(this);
    this.mouseMoveListener = this.mouseMoveListener.bind(this);
    this.mouseUpListener = this.mouseUpListener.bind(this);
    this.onGaugeMouseDown = this.onGaugeMouseDown.bind(this);
    this.moveGaugeOnDoubleClick = this.moveGaugeOnDoubleClick.bind(this);
    this.copySelectedCurve = this.copySelectedCurve.bind(this);
    this.pasteSelectedCurve = this.pasteSelectedCurve.bind(this);

    this.handleUndoDebounced = lodash.debounce(this.handleUndo.bind(this), MENU_ACTION_DEBOUNCE_TIME, {leading: true, trailing: false});
    this.handleRedoDebounced = lodash.debounce(this.handleRedo.bind(this), MENU_ACTION_DEBOUNCE_TIME, {leading: true, trailing: false});
    this.handleZoomThrottled = lodash.throttle(this.handleZoom.bind(this), THROTTLE_TIME);

    if (process.env.NODE_ENV !== 'production') {
      // For debugging
      window.timeline = this;
      window.view = this; // Easy to run same instruction in different tools
    }
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

  /*
   * lifecycle/events
   * --------- */

  componentWillUnmount () {
    this.mounted = false;

    // Clean up subscriptions to prevent memory leaks and react warnings
    this.removeEmitterListeners();

    if (this.tourClient) {
      this.tourClient.off('tour:requestElementCoordinates', this.handleRequestElementCoordinates);
    }

    this.project.getEnvoyClient().closeConnection();
  }

  getKeyframeCoordinates = (keyframe) => {
    const keyframeViewEl = document.getElementById(`keyframe-container-${keyframe.getUniqueKey()}`);
    return keyframeViewEl ? keyframeViewEl.firstChild.getBoundingClientRect() : null;
  };

  instantiateMarquee () {
    if (experimentIsEnabled(Experiment.TimelineMarqueeSelection)) {
      const area = document.querySelector('#property-rows');
      if (!area) {
        return setTimeout(this.instantiateMarquee.bind(this), 100);
      }

      const marquee = new Marquee({
        area,
        onStart: (event) => {
          // FIXME: horrible and non-scalable hack, we should figure out a better solution
          // This event triggers on `mousedown`, we make the assumption that a
          // mousedown + mouse movement on one of the elements below is a drag,
          // therefore we stop the marquee selection by returning `false`.
          return !(
            event.clientX < this.getActiveComponent().getCurrentTimeline().getPropertiesPixelWidth() ||
            typeof event.target.className !== 'string' ||
            event.target.className.includes('js-avoid-marquee-init')
          );
        },
        onChange: lodash.throttle((finalArea) => {
          if (
            finalArea.height < MARQUEE_THRESHOLD &&
            finalArea.width < MARQUEE_THRESHOLD
          ) {
            return;
          }

          const component = this.getActiveComponent();

          Keyframe.marqueeSelect({
            component,
            area: finalArea,
            offset: {
              horizontal: component.getCurrentTimeline().getScrollLeft(),
            },
            viewCoordinatesProvider: this.getKeyframeCoordinates,
          });
        }, MARQUEE_THROTTLE_TIME),
        onFinish: () => {
          Keyframe.epandRowsOfSelectedKeyframes({
            component: this.getActiveComponent(),
            from: 'timeline',
          });
        },
      });

      marquee.start();
    }
  }

  componentDidMount () {
    this.mounted = true;

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

    this.instantiateMarquee();

    const resetKeyStates = () => {
      Globals.allKeysUp();

      this.updateKeyboardState({
        isShiftKeyDown: false,
        isCommandKeyDown: false,
        isControlKeyDown: false,
        isAltKeyDown: false,
      });

      this.enableTimelinePointerEvents();
    };

    // If the user e.g. Cmd+tabs away from the window
    this.addEmitterListener(window, 'blur', () => {
      resetKeyStates();
      this.resetGaugeAndPointerStates();

      // If an expression input is focused when we leave this webview, close it
      if (this.getActiveComponent()) {
        this.getActiveComponent().getRows().forEach((row) => {
          row.blur({from: 'timeline'});
        });
      }
    });

    this.addEmitterListener(window, 'focus', () => {
      resetKeyStates();
    });

    this.addEmitterListener(window, 'dragover', Asset.preventDefaultDrag, false);

    this.addEmitterListener(
      window,
      'drop',
      (event) => {
        this.project.linkExternalAssetOnDrop(event, () => {});
      },
      false,
    );
  }

  getActiveComponent = () => {
    return this.project && this.project.getCurrentActiveComponent();
  };

  awaitRef (name, cb) {
    if (this.refs[name]) {
      return cb(this.refs[name]);
    }
    return setTimeout(() => {
      this.awaitRef(name, cb);
    }, 100);
  }

  handleProjectReady (project) {
    this.project = project;

    this.addEmitterListenerIfNotAlreadyRegistered(this.project, 'envoy:tourClientReady', (tourClient) => {
      this.tourClient = tourClient;
      this.tourClient.on('tour:requestElementCoordinates', this.handleRequestElementCoordinates);
      // When the timeline loads, that is the indication to move from the first tour step
      // to the next step that shows how to create animations
      setTimeout(() => {
        if (!this.project.getEnvoyClient().isInMockMode() && this.tourClient) {
          this.tourClient.next();
        }
      });
    });

    this.addEmitterListenerIfNotAlreadyRegistered(this.project, 'update', (what, arg) => {
      switch (what) {
        case 'updateMenu':
          this.updateMenu();
          break;
        case 'setCurrentActiveComponent':
          this.handleActiveComponentReady();
          break;
        case 'reloaded':
          if (arg === 'hard' && this.mounted) {
            this.forceUpdate();
          }
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
          this.handleInteractionModeChange(...args);
          break;
        case 'zMoveToBack':
        case 'zMoveToFront':
        case 'zMoveForward':
        case 'zMoveBackward':
          const row = Row.findByComponentAndHaikuId(this.getActiveComponent(), args[1]);
          this.scrollToRow(row);
          break;
      }
    });

    this.addEmitterListener(window, 'resize', lodash.throttle(() => {
      if (this.mounted && this.getActiveComponent()) {
        const pxWidth = document.body.clientWidth - this.getActiveComponent().getCurrentTimeline().getPropertiesPixelWidth();
        this.getActiveComponent().getCurrentTimeline().setTimelinePixelWidth(pxWidth + 20);
        this.forceUpdate();
      }
    }, THROTTLE_TIME));

    // The this-binding here is required; I am not sure why since we also do this in the constructor.
    // If you remove the this-binding, you'll see exceptions when you move your mouse initially.
    this.addEmitterListener(window, 'mousemove', this.mouseMoveListener.bind(this));
    this.addEmitterListener(window, 'mouseup', this.mouseUpListener.bind(this));

    this.addEmitterListener(this.props.websocket, 'relay', (message) => {
      logger.info('relay received', message.name, 'from', message.from);

      // The next relay destination in the sequence is always glass
      const relayable = lodash.assign(message, {view: 'glass'});

      switch (message.name) {
        case 'global-menu:open-dev-tools':
          remote.getCurrentWebContents().openDevTools();
          break;

        case 'global-menu:close-dev-tools':
          if (remote.getCurrentWebContents().isDevToolsFocused()) {
            remote.getCurrentWebContents().closeDevTools();
          }
          break;

        case 'global-menu:set-active-component':
          this.project.setCurrentActiveComponent(message.data, {from: 'timeline'}, () => {});
          break;

        case 'global-menu:zoom-in':
          // For now, zoom controls only affect the stage
          this.props.websocket.send(relayable);
          break;

        case 'global-menu:zoom-out':
          // For now, zoom controls only affect the stage
          this.props.websocket.send(relayable);
          break;

        case 'global-menu:reset-viewport':
          this.props.websocket.send(relayable);
          break;

        case 'global-menu:group':
          // For now, grouping is only possible via the stage
          this.props.websocket.send(relayable);
          break;

        case 'global-menu:ungroup':
          // For now, grouping is only possible via the stage
          this.props.websocket.send(relayable);
          break;

        case 'global-menu:cut':
          // Delegate cut only if the user is not editing something here
          if (!document.hasFocus() || (!this.isTextSelected())) {
            this.props.websocket.send(relayable);
          }
          break;

        case 'global-menu:copy':
          // Delegate copy only if the user is not editing something here
          if (!document.hasFocus() || (!this.isTextSelected())) {
            this.props.websocket.send(relayable);
          }
          break;

        case 'global-menu:paste':
          // Delegate paste only if the user is not editing something here
          if (document.hasFocus()) {
            if (!this.isTextInputFocused() && !this.refs.expressionInput.willHandlePasteEvent()) {
              this.props.websocket.send(relayable);
            }
          } else {
            this.props.websocket.send(relayable);
          }
          break;

        case 'global-menu:selectAll':
          // Delegate selectall only if the user is not editing something here
          if (document.hasFocus()) {
            if (!this.isTextInputFocused()) {
              this.props.websocket.send(relayable);
            }
          } else {
            this.props.websocket.send(relayable);
          }
          break;

        case 'global-menu:undo':
          if (window.isWebview) { // Let work in standalone dev mode
            this.props.websocket.send(relayable); // For consistency, let glass initiate undo/redo
          } else {
            this.handleUndoDebounced();
          }
          break;

        case 'global-menu:redo':
          if (window.isWebview) { // Let work in standalone dev mode
            this.props.websocket.send(relayable); // For consistency, let glass initiate undo/redo
          } else {
            this.handleRedoDebounced();
          }
          break;
      }
    });

    this.addEmitterListener(this.props.websocket, 'broadcast', (message) => {
      if (message.folder !== this.props.folder) {
        return;
      }

      switch (message.name) {
        case 'remote-model:receive-sync':
          BaseModel.receiveSync(message);
          break;

        case 'component:reload':
          if (this.getActiveComponent()) {
            this.getActiveComponent().moduleReplace(() => {});
          }
          break;

        case 'event-handlers-updated':
          if (this.getActiveComponent()) {
            this.getActiveComponent().getCurrentTimeline().notifyFrameActionChange();
          }
          break;

        case 'assets-changed':
          File.cache.clear();
          break;
      }
    });

    this.addEmitterListener(document.body, 'keydown', this.handleKeyDown.bind(this));

    this.addEmitterListener(document.body, 'keyup', (keyupEvent) => {
      this.handleKeyUp(keyupEvent);
    });

    // If you are looking for the scroll listener event, it's attached to
    // this.container on `attachContainerElement`
    this.addEmitterListener(window, 'wheel', (wheelEvent) => {
      if (wheelEvent.ctrlKey || wheelEvent.metaKey) {
        wheelEvent.preventDefault();
        this.handleZoomThrottled(wheelEvent);
      }
    });

    this.addEmitterListener(document, 'mousemove', (mouseMoveEvent) => {
      if (!this.getActiveComponent()) {
        return;
      }

      const timeline = this.getActiveComponent().getCurrentTimeline();
      let pxInTimeline;
      let frameForPx;

      if (timeline) {
        const frameInfo = timeline.getFrameInfo();
        pxInTimeline = mouseMoveEvent.clientX + (this.container.scrollLeft || 0) - this.getActiveComponent().getCurrentTimeline().getPropertiesPixelWidth() - TIMELINE_OFFSET_PADDING;

        if (pxInTimeline < 0) {
          pxInTimeline = 0;
        }

        frameForPx = Math.round(pxInTimeline / frameInfo.pxpf);
        timeline.hoverFrame(frameForPx);
      }
    });

    this.addEmitterListener(PopoverMenu, 'show', (payload) => {
      const items = this.getPopoverMenuItems(payload);
      PopoverMenu.launch({
        event: payload.event,
        items,
      });
    });

    this.addEmitterListener(Row, 'update', (row, what, metadata) => {
      if (['row-collapsed', 'row-expanded'].includes(what) && row.isRootRow()) {
        this.forceUpdate();
      }

      if (what === 'row-selected' && metadata.from !== 'timeline') {
        this.scrollToRow(row);
      }
    });

    // When all views send this, we know it's ok to initialize the 'main' component
    this.project.broadcastPayload({
      name: 'project-state-change',
      what: 'project:ready',
    });

    // When developing Timeline in standalone, this env var directs it to automatically
    // set the current active component, which is normally initiated by Creator
    if (process.env.AUTOSTART) {
      this.project.setCurrentActiveComponent(process.env.AUTOSTART, {from: 'timeline'}, () => {});
    }
  }

  updateMenu () {
    ipcRenderer.send('topmenu:update', this.project.describeTopMenu());
  }

  handleActiveComponentReady () {
    const timeline = this.getActiveComponent().getCurrentTimeline();
    this.mountHaikuComponent();

    this.updateMenu();

    this.loadUserSettings();
    this.trackExportProgress();
    this.hideBezierEditor();
    timeline.setTimelinePixelWidth(document.body.clientWidth - timeline.getPropertiesPixelWidth() + 20);

    if (this.mounted) {
      this.forceUpdate();
    }

    this.addEmitterListenerIfNotAlreadyRegistered(timeline, 'update', (what, ...args) => {
      if (what === 'timeline-scroll-from-scrollbar') {
        this.container.scrollLeft = timeline.getScrollLeft();
      }
    });

    this.project.broadcastPayload({
      name: 'project-state-change',
      what: 'component:mounted',
      scenename: this.getActiveComponent().getSceneName(),
    });
  }

  mountHaikuComponent () {
    // The Timeline UI doesn't display the component, so we don't bother giving it a ref
    this.getActiveComponent().mountApplication(null, {
      freeze: true, // No display means no need for overflow settings, etc
    });
  }

  handleInteractionModeChange (interactionMode) {
    const ac = this.getActiveComponent();
    if (ac) {
      const timeline = this.getActiveComponent().getCurrentTimeline();
      if (timeline.isPlaying()) {
        timeline.pause();
      }

      this.setState({isPreviewModeActive: isPreviewMode(interactionMode)});
    }
  }

  scrollToRow  = lodash.throttle((row) => {
    const rowElement = document.getElementById(`component-heading-row-${row.element.getComponentId()}-${row.getAddress()}`);
    const selectedElements = this.getActiveComponent().getSelectedElements();

    if (rowElement && selectedElements.length === 1) {
      this.container.scroll({
        top: rowElement.offsetTop,
        left: this.container.scrollLeft,
        behavior: 'smooth',
      });
    }
  }, 200);

  canHaveKeyframes (type, model) {
    if (type === 'cluster-row' && model.children && model.children.length > 0) {
      return Property.canHaveKeyframes(model.children[0].property.name, model.element);
    }

    if (type === 'property-row') {
      return Property.canHaveKeyframes(model.property.name, model.element);
    }

    if (type === 'keyframe-segment' || type === 'keyframe-transition') {
      return Property.canHaveKeyframes(model.row.property.name, model.element);
    }

    return true;
  }

  getPopoverMenuItems ({event, type, model, offset, curve}) {
    const items = [];

    const selectedKeyframes = this.getActiveComponent().getSelectedKeyframes();
    const numSelectedKeyframes = selectedKeyframes.length;
    const isTweenableTransitionSegment = type === 'keyframe-segment' && (model && model.isTweenable());
    const canHaveKeyframes = this.canHaveKeyframes(type, model);
    const isSingular = numSelectedKeyframes < 3;

    items.push({
      label: 'Create Keyframe',
      enabled: (
        // During multi-select it's weird to show "Create Keyframe" in the menu
        isSingular &&
        canHaveKeyframes &&
        (
          type === 'keyframe-segment' ||
          type === 'keyframe-transition' ||
          type === 'property-row' ||
          type === 'cluster-row'
        )
      ),
      onClick: (clickEvent) => {
        const timeline = this.getActiveComponent().getCurrentTimeline();
        const frameInfo = timeline.getFrameInfo();
        const ms = Math.round(timeline.getHoveredFrame() * frameInfo.mspf);
        Keyframe.deselectAndDeactivateAllKeyframes();
        model.createKeyframe(undefined, ms, {from: 'timeline'});
      },
    });

    items.push({type: 'separator'});

    items.push({
      label: (numSelectedKeyframes < 2) ? 'Delete Keyframe' : 'Delete Keyframes',
      enabled: type === 'keyframe',
      onClick: () => {
        this.getActiveComponent().deleteSelectedKeyframes({from: 'timeline'});
      },
    });

    items.push({type: 'separator'});

    items.push({
      label: 'Move to Frame 0',
      enabled: this.getActiveComponent().checkIfSelectedKeyframesAreMovableToZero() && canHaveKeyframes,
      onClick: () => {
        selectedKeyframes.forEach((keyframe) => {
          keyframe.moveTo(0, 0);
        });
        this.getActiveComponent().commitAccumulatedKeyframeMovesDebounced();
      },
    });

    items.push({type: 'separator'});

    items.push({
      label: isSingular ? 'Make Tween' : 'Make Tweens',
      enabled: isTweenableTransitionSegment,
      submenu: isTweenableTransitionSegment && this.curvesMenu(curve, (_, curveName) => {
        this.getActiveComponent().joinSelectedKeyframes(curveName, {from: 'timeline'});
      }),
    });

    items.push({
      label: isSingular ? 'Change Tween' : 'Change Tweens',
      enabled: type === 'keyframe-transition',
      submenu: (type === 'keyframe-transition') && this.curvesMenu(curve, (_, curveName) => {
        this.getActiveComponent().changeCurveOnSelectedKeyframes(curveName, {from: 'timeline'});
      }),
    });

    items.push({
      label: 'Edit Bezier Curve',
      enabled:
        type === 'keyframe-transition' &&
        Keyframe.groupHasBezierEditableCurves(selectedKeyframes),
      onClick: () => {
        this.showBezierEditor({x: event.clientX, y: event.clientY}, selectedKeyframes);
      },
    });

    items.push({
      label: isSingular ? 'Remove Tween' : 'Remove Tweens',
      enabled: type === 'keyframe-transition',
      onClick: (_) => {
        this.getActiveComponent().splitSelectedKeyframes({from: 'timeline'});
      },
    });

    return items;
  }

  /**
   * @param {ExporterRequest} request
   */
  handleExportProgress (exporterRequest) {
    const trackedExporterRequests = [...this.state.trackedExporterRequests];
    const activeRequestIndex = trackedExporterRequests.findIndex(
      (trackedExporterRequest) => trackedExporterRequest.filename === exporterRequest.filename,
    );
    if (activeRequestIndex !== -1) {
      if (exporterRequest.progress === 0) {
        // We must have aborted for some reason. Silently splice the item from the list.
        trackedExporterRequests.splice(activeRequestIndex, 1);
      } else {
        trackedExporterRequests[activeRequestIndex].progress = exporterRequest.progress;
      }
    } else if (exporterRequest.progress !== 0) {
      trackedExporterRequests.unshift(exporterRequest);
    }
    this.setState({trackedExporterRequests});
  }

  trackExportProgress () {
    this.project.getEnvoyClient().get(EXPORTER_CHANNEL).then((exporterChannel) => {
      exporterChannel.on(`${EXPORTER_CHANNEL}:progress`, (request) => {
        if (request.outlet === 'timeline') {
          this.handleExportProgress(request);
        }
      });
    });
  }

  loadUserSettings () {
    if (!this.project.getEnvoyClient().isInMockMode()) {
      this.project.getEnvoyClient().get(USER_CHANNEL).then(
        (user) => {
          this.user = user;
          user.getConfig(UserSettings.TimeDisplayModes).then(
            (timeDisplayModes) => {
              if (timeDisplayModes && timeDisplayModes[this.project.getFolder()]) {
                this.getActiveComponent().getCurrentTimeline().setTimeDisplayMode(timeDisplayModes[this.project.getFolder()]);
              } else {
                user.getConfig(UserSettings.DefaultTimeDisplayMode).then((defaultTimeDisplayMode) => {
                  if (defaultTimeDisplayMode) {
                    this.getActiveComponent().getCurrentTimeline().setTimeDisplayMode(defaultTimeDisplayMode);
                  }
                });
              }
            },
          );
          user.getUser().then(
            (userDetails) => {
              this.setState({userDetails});
            },
          );
        },
      );
    }
  }

  curvesMenu (maybeCurve, cb) {
    const items = [];

    items.push({
      label: 'Linear',
      enabled: (
        maybeCurve !== 'linear' &&
        maybeCurve !== 'Linear'
      ),
      onClick: (event) => {
        return cb(event, 'linear');
      },
    });

    items.push({
      label: 'Ease In',
      submenu: this.curveTypeMenu('easeIn', maybeCurve, cb),
    });

    items.push({
      label: 'Ease Out',
      submenu: this.curveTypeMenu('easeOut', maybeCurve, cb),
    });

    items.push({
      label: 'Ease In Out',
      submenu: this.curveTypeMenu('easeInOut', maybeCurve, cb),
    });

    return items;
  }

  curveTypeMenu (baseCurve, maybeCurve, cb) {
    const items = [];

    items.push({
      label: 'Back',
      enabled: maybeCurve !== baseCurve + 'Back',
      onClick: (event) => {
        return cb(event, baseCurve + 'Back');
      },
    });

    items.push({
      label: 'Bounce',
      enabled: maybeCurve !== baseCurve + 'Bounce',
      onClick: (event) => {
        return cb(event, baseCurve + 'Bounce');
      },
    });

    items.push({
      label: 'Circ',
      enabled: maybeCurve !== baseCurve + 'Circ',
      onClick: (event) => {
        return cb(event, baseCurve + 'Circ');
      },
    });

    items.push({
      label: 'Cubic',
      enabled: maybeCurve !== baseCurve + 'Cubic',
      onClick: (event) => {
        return cb(event, baseCurve + 'Cubic');
      },
    });

    items.push({
      label: 'Elastic',
      enabled: maybeCurve !== baseCurve + 'Elastic',
      onClick: (event) => {
        return cb(event, baseCurve + 'Elastic');
      },
    });

    items.push({
      label: 'Expo',
      enabled: maybeCurve !== baseCurve + 'Expo',
      onClick: (event) => {
        return cb(event, baseCurve + 'Expo');
      },
    });

    items.push({
      label: 'Quad',
      enabled: maybeCurve !== baseCurve + 'Quad',
      onClick: (event) => {
        return cb(event, baseCurve + 'Quad');
      },
    });

    items.push({
      label: 'Quart',
      enabled: maybeCurve !== baseCurve + 'Quart',
      onClick: (event) => {
        return cb(event, baseCurve + 'Quart');
      },
    });

    items.push({
      label: 'Quint',
      enabled: maybeCurve !== baseCurve + 'Quint',
      onClick: (event) => {
        return cb(event, baseCurve + 'Quint');
      },
    });

    items.push({
      label: 'Sine',
      enabled: maybeCurve !== baseCurve + 'Sine',
      onClick: (event) => {
        return cb(event, baseCurve + 'Sine');
      },
    });

    return items;
  }

  handleZoom (wheelEvent) {
    const maxZoom = 80;
    const delta = Math.abs(wheelEvent.deltaY) > maxZoom ? Math.sign(wheelEvent.deltaY) * maxZoom : wheelEvent.deltaY;
    this.getActiveComponent().getCurrentTimeline().zoomBy(delta * 0.01);
  }

  handleScroll (scrollEvent) {
    if (scrollEvent.deltaY >= 1 || scrollEvent.deltaY <= -1) {
      // Don't horizontally scroll if we are vertically scrolling
      return void (0);
    }

    if (scrollEvent.deltaX >= 1 || scrollEvent.deltaX <= -1) {
      return this.handleHorizontalScroll();
    }
  }

  handleHorizontalScrollByDelta = (delta) => {
    const timeline = this.getActiveComponent().getCurrentTimeline();
    timeline.setScrollLeftFromScrollbar(timeline.getScrollLeft() + delta);
  };

  handleHorizontalScroll = () => {
    this.getActiveComponent().getCurrentTimeline().setScrollLeftFromScrollbar(this.container.scrollLeft);
  };

  handleRequestElementCoordinates ({selector, webview}) {
    requestElementCoordinates({
      currentWebview: 'timeline',
      requestedWebview: webview,
      selector,
      shouldNotifyEnvoy:
        this.tourClient &&
        this.project.getEnvoyClient() &&
        !this.project.getEnvoyClient().isInMockMode(),
      tourClient: this.tourClient,
    });
  }

  handleKeyDown (nativeEvent) {
    // Give the currently active expression input a chance to capture this event and short circuit us if so
    const willExprInputHandle = this.refs.expressionInput.willHandleExternalKeydownEvent(nativeEvent);

    if (willExprInputHandle || this.state.isPreviewModeActive || this.isEditingRowTitle) {
      return void (0);
    }

    // If the user hit the spacebar _and_ we aren't inside an input field, treat that like a playback trigger
    if (nativeEvent.keyCode === 32 && !document.querySelector('input:focus')) {
      this.togglePlayback();
      nativeEvent.preventDefault();
      return void (0);
    }

    switch (nativeEvent.which) {
      // case 27: //escape
      // case 32: //space
      case 37: // left
        if (this.isCommandKeyDown) {
          if (this.isShiftKeyDown) {
            this.getActiveComponent().getCurrentTimeline().setVisibleFrameRange(0, this.getActiveComponent().getCurrentTimeline().getRightFrameEndpoint());
            this.getActiveComponent().getCurrentTimeline().seek(0);
          } else {
            this.getActiveComponent().getCurrentTimeline().updateScrubberPositionByDelta(-1);
          }
        } else {
          nativeEvent.preventDefault();
          this.handleHorizontalScrollByDelta(-15);
        }
        break;

      case 39: // right
        if (this.isCommandKeyDown) {
          this.getActiveComponent().getCurrentTimeline().updateScrubberPositionByDelta(1);
        } else {
          nativeEvent.preventDefault();
          this.handleHorizontalScrollByDelta(15);
        }
        break;

      // case 38: // up
      // case 40: // down
      // case 13: //enter
      // delete
      // case 46: //delete
      // case 8: //delete
      case 16: this.updateKeyboardState({isShiftKeyDown: true}); break;
      case 17: this.updateKeyboardState({isControlKeyDown: true}); break;
      case 18: this.updateKeyboardState({isAltKeyDown: true}); break;
      case 224: this.updateKeyboardState({isCommandKeyDown: true}); break;
      case 91: this.updateKeyboardState({isCommandKeyDown: true}); break;
      case 93: this.updateKeyboardState({isCommandKeyDown: true}); break;
    }
  }

  handleKeyUp (nativeEvent) {
    switch (nativeEvent.which) {
      // case 27: //escape
      // case 32: //space
      // case 37: //left
      // case 39: //right
      // case 38: // up
      // case 40: // down
      // case 13: //enter
      case 46: this.getActiveComponent().deleteSelectedKeyframes({from: 'timeline'}); break; // Only if there are any
      case 8: this.getActiveComponent().deleteSelectedKeyframes({from: 'timeline'}); break; // Only if there are any
      case 16: this.updateKeyboardState({isShiftKeyDown: false}); break;
      case 17: this.updateKeyboardState({isControlKeyDown: false}); break;
      case 18: this.updateKeyboardState({isAltKeyDown: false}); break;
      case 224: this.updateKeyboardState({isCommandKeyDown: false}); break;
      case 91: this.updateKeyboardState({isCommandKeyDown: false}); break;
      case 93: this.updateKeyboardState({isCommandKeyDown: false}); break;
    }
  }

  updateKeyboardState (updates) {
    for (const key in updates) {
      this[key] = updates[key];
    }
  }

  handleUndo () {
    if (this.project) {
      Keyframe.deselectAndDeactivateAllKeyframes({component: this.getActiveComponent()});
      this.project.undo({}, {from: 'timeline'}, () => {});
    }
  }

  handleRedo () {
    if (this.project) {
      Keyframe.deselectAndDeactivateAllKeyframes({component: this.getActiveComponent()});
      this.project.redo({}, {from: 'timeline'}, () => {});
    }
  }

  saveTimeDisplayModeSetting = () => {
    const mode = this.getActiveComponent().getCurrentTimeline().getTimeDisplayMode();

    if (!this.project.getEnvoyClient().isInMockMode()) {
      this.user.getConfig(UserSettings.TimeDisplayModes).then(
        (timeDisplayModes) => {
          this.user.setConfig(
            UserSettings.TimeDisplayModes,
            {
              ...timeDisplayModes,
              [this.project.getFolder()]: mode,
            },
          );
          this.user.setConfig(UserSettings.DefaultTimeDisplayMode, mode);
        },
      );
    }
  };

  copySelectedCurve () {
    this.props.mixpanel.haikuTrack('creator:timeline:copy-curve');
    this._lastCopiedCurve = this.getActiveComponent().getFirstSelectedCurve();
  }

  pasteSelectedCurve () {
    if (this._lastCopiedCurve) {
      this.props.mixpanel.haikuTrack('creator:timeline:paste-curve');
      this.getActiveComponent().changeCurveOnSelectedKeyframes(
        this._lastCopiedCurve,
        {from: 'timeline'},
      );
    }
  }

  playbackSkipBack () {
    this.getActiveComponent().getCurrentTimeline().playbackSkipBack();
  }

  playbackSkipForward () {
    this.getActiveComponent().getCurrentTimeline().playbackSkipForward();
  }

  togglePlayback () {
    this.getActiveComponent().getCurrentTimeline().togglePlayback();
  }

  renderTimelinePlaybackControls () {
    return (
      <div
        style={{
          position: 'relative',
          top: 17,
          width: '100%',
        }}>
        <ControlsArea
          timeline={this.getActiveComponent().getCurrentTimeline()}
          activeComponentDisplayName={`${this.props.userconfig.project} (${this.getActiveComponent().getTitle()})`}
          selectedTimelineName={this.getActiveComponent().getCurrentTimeline().getName()}
          playbackSpeed={this.state.playerPlaybackSpeed}
          changeTimelineName={(oldTimelineName, newTimelineName) => {
            this.getActiveComponent().renameTimeline(oldTimelineName, newTimelineName, {from: 'timeline'}, () => {});
          }}
          createTimeline={(timelineName) => {
            this.getActiveComponent().createTimeline(timelineName, {}, {from: 'timeline'}, () => {});
          }}
          duplicateTimeline={(timelineName) => {
            this.getActiveComponent().duplicateTimeline(timelineName, {from: 'timeline'}, () => {});
          }}
          deleteTimeline={(timelineName) => {
            this.getActiveComponent().deleteTimeline(timelineName, {from: 'timeline'}, () => {});
          }}
          selectTimeline={(currentTimelineName) => {
            // Not yet implemented
          }}
          playbackSkipBack={() => {
            this.playbackSkipBack();
          }}
          playbackSkipForward={() => {
            this.playbackSkipForward();
          }}
          playbackPlayPause={() => {
            this.togglePlayback();
          }}
          changePlaybackSpeed={(inputEvent) => {
            const playerPlaybackSpeed = Number(inputEvent.target.value || 1);
            this.setState({playerPlaybackSpeed});
          }}
          toggleRepeat={() => {
            const timeline = this.getActiveComponent().getCurrentTimeline();
            timeline.toggleRepeat();
            this.setState({isRepeat: timeline.getRepeat()});
          }}
          isRepeat={this.state.isRepeat}
        />
        <div
          style={{
            position: 'absolute',
            right: 5,
            top: -12,
            marginRight: 5,
          }}
        >
          {
            experimentIsEnabled(Experiment.LocalAssetExport) &&
            <TrackedExporterRequests trackedExporterRequests={this.state.trackedExporterRequests} />
          }
        </div>
      </div>
    );
  }

  getCurrentTimelineTime (frameInfo) {
    return Math.round(this.getActiveComponent().getCurrentTimeline().getCurrentFrame() * frameInfo.mspf);
  }

  showFrameActionsEditor (frame) {
    const elementPrimaryKey = this.getActiveComponent().findElementRoot().getPrimaryKey();
    this.showEventHandlersEditor(
      elementPrimaryKey,
      frame,
    );
  }

  showEventHandlersEditor = (elementPrimaryKey, frame) => {
    this.project.broadcastPayload({
      name: 'show-event-handlers-editor',
      elid: elementPrimaryKey,
      opts: {
        isSimplified: Boolean(frame),
      },
      frame,
    });
  };

  renderTopControls () {
    const timeline = this.getActiveComponent().getCurrentTimeline();

    return [
      (
          <div
            key="gauge-timekeeping-wrapper"
            className="gauge-timekeeping-wrapper"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              height: 35,
              width: timeline.getPropertiesPixelWidth(),
              backgroundColor: Palette.COAL,
              borderBottom: `1px solid ${Palette.FATHER_COAL}`,
              zIndex: zIndex.timekeepingWrapper.base,
              fontSize: 10,
            }}
          >
            <GaugeTimeReadout saveTimeDisplayModeSetting={this.saveTimeDisplayModeSetting} timeline={timeline} />
          </div>
        ),
      (
          <SimplifiedFrameGrid
            key="frame-grid"
            propertiesPixelWidth={timeline.getPropertiesPixelWidth()}
            timeline={timeline}
            timelineOffsetPadding={TIMELINE_OFFSET_PADDING}
          />
        ),
      (
          <FrameActionsGrid
            key="frame-actions-grid"
            timeline={timeline}
            onShowFrameActionsEditor={this.showFrameActionsEditor}
            timelineOffsetPadding={TIMELINE_OFFSET_PADDING}
          />
        ),
      (
          <Gauge
            key="gauge"
            timeline={timeline}
            onMouseDown={this.onGaugeMouseDown}
            timelineOffsetPadding={TIMELINE_OFFSET_PADDING}
          />
        ),
      (
          <ScrubberInterior
            key="scrubber"
            timeline={timeline}
            onMouseDown={this.onGaugeMouseDown}
            timelineOffsetPadding={TIMELINE_OFFSET_PADDING}
          />
        ),
      (
          this.state.showBezierEditor ? (
            <BezierPopup
              key="bezier-poopup"
              keyframes={this.state.currentEditingBezier}
              onHide={this.hideBezierEditor}
              timeline={timeline}
              activeComponent={this.getActiveComponent()}
              x={this.state.bezierEditorCoords.x}
              y={this.state.bezierEditorCoords.y}
            />
          ) : null
        ),
    ];
  }

  hideBezierEditor = () => {
    this.setState({showBezierEditor: false});
  };

  showBezierEditor = (bezierEditorCoords, currentEditingBezier) => {
    this.setState({
      showBezierEditor: true,
      bezierEditorCoords,
      currentEditingBezier,
    });
  };

  onGaugeMouseDown (event) {
    event.persist();

    this._doHandleMouseMovesInGauge = true;
    this.disableTimelinePointerEvents();
    this.mouseMoveListener(event);
  }

  onCommitValue = (committedValue, row, ms) => {
    logger.info('commit at', ms, 'on', row.dump());
    this.props.mixpanel.haikuTrack('creator:timeline:create-keyframe');
    row.createKeyframe(committedValue, ms, {from: 'timeline'});
  };

  attachContainerElement = (container) => {
    this.container = container;
    this.addEmitterListener(this.container, 'scroll', this.handleHorizontalScroll);
  };

  mouseMoveListener (evt) {
    if (!this._doHandleMouseMovesInGauge) {
      return;
    }

    const frameInfo = this.getActiveComponent().getCurrentTimeline().getFrameInfo();
    const leftX = evt.clientX + (this.container.scrollLeft || 0) - this.getActiveComponent().getCurrentTimeline().getPropertiesPixelWidth() - TIMELINE_OFFSET_PADDING;
    const frameX = Math.round(leftX / frameInfo.pxpf);

    // Allow the scrubber to be dragged past 0 in order to reach 0
    if (frameX < 0) {
      frameX = 0;
    }

    // Avoid expensive redundant updates
    if (frameX === this.getActiveComponent().getCurrentTimeline().getCurrentFrame()) {
      return;
    }

    this.getActiveComponent().getCurrentTimeline().seek(frameX);
  }

  mouseUpListener () {
    this.resetGaugeAndPointerStates();
  }

  resetGaugeAndPointerStates () {
    this._doHandleMouseMovesInGauge = false;
    this.enableTimelinePointerEvents();
  }

  disableTimelinePointerEvents () {
    if (this.refs.scrollview) {
      this.refs.scrollview.style.pointerEvents = 'none';
      this.refs.scrollview.style.WebkitUserSelect = 'none';
    }
  }

  enableTimelinePointerEvents () {
    if (this.refs.scrollview) {
      this.refs.scrollview.style.pointerEvents = 'auto';
      this.refs.scrollview.style.WebkitUserSelect = 'auto';
    }
  }

  setGlassInteractionToEditMode = () => {
    if (this.state.isPreviewModeActive) {
      this.project.setInteractionMode(InteractionMode.GLASS_EDIT, {from: 'timeline'}, () => {
        this.setState({isPreviewModeActive: false});
      });
    }
  };

  setEditingRowTitleStatus = (status) => {
    this.isEditingRowTitle = status;
  };

  renderBottomControls () {
    return (
      <div
        className="no-select"
        style={{
          width: '100%',
          height: 45,
          backgroundColor: Palette.COAL,
          overflow: 'visible',
          position: 'fixed',
          bottom: 0,
          left: 0,
          zIndex: zIndex.bottomControls.base,
        }}>
        <TimelineRangeScrollbar
          disableTimelinePointerEvents={() => {
            this.disableTimelinePointerEvents();
          }}
          enableTimelinePointerEvents={() => {
            this.enableTimelinePointerEvents();
          }}
          timeline={this.getActiveComponent().getCurrentTimeline()} />
        {this.renderTimelinePlaybackControls()}
      </div>
    );
  }

  moveGaugeOnDoubleClick (dblClickEvent) {
    this._doHandleMouseMovesInGauge = true;
    this.mouseMoveListener(dblClickEvent);
    this._doHandleMouseMovesInGauge = false;
  }

  updatePropertiesPanelSize = (width) => {
    this.getActiveComponent().getCurrentTimeline().setPropertiesPixelWidth(width);
    this.forceUpdate();
  };

  onScrollViewMouseDown = (mouseEvent) => {
    if (
      !Globals.isShiftKeyDown &&
      !Globals.isControlKeyDown &&
      mouseEvent.nativeEvent.which !== 3
    ) {
      Keyframe.deselectAndDeactivateAllKeyframes({
        component: this.getActiveComponent(),
      });
    }
  };

  onTimelineClick = () => {
    if (!this.refs.expressionInput.doesClickOriginatedFromMouseDown()) {
      this.getActiveComponent().getRows().forEach((row) => {
        row.blur({from: 'timeline'});
        row.deselect({from: 'timeline'}, true);
      });
    }

    this.refs.expressionInput.cleanMouseDownTracker();
  };

  render () {
    if (!this.getActiveComponent() || !this.getActiveComponent().getCurrentTimeline()) {
      return (
        <div
        id="timeline"
        className="no-select"
        style={{
          position: 'absolute',
          backgroundColor: Palette.GRAY,
          color: Palette.ROCK,
          top: 0,
          left: 0,
          height: '100%',
          width: '100%',
        }} />
      );
    }

    const activeComponent = this.getActiveComponent();
    const timeline = activeComponent.getCurrentTimeline();
    const propertiesPixelWidth = timeline.getPropertiesPixelWidth();

    return (
      <div
        ref={this.attachContainerElement}
        id="timeline"
        className="no-select"
        onClick={this.onTimelineClick}
        style={{
          position: 'absolute',
          backgroundColor: Palette.GRAY,
          color: Palette.ROCK,
          top: 0,
          left: 0,
          height:'calc(100% - 30px)',
          width: '100%',
          overflow: 'auto',
        }}>
        {
          this.state.isPreviewModeActive && (
            <div
              style={{
                opacity: 0.6,
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: zIndex.previewModeBlocker.base,
                backgroundColor: Palette.COAL,
              }}
              onClick={this.setGlassInteractionToEditMode}
            />
          )
        }
        <PropertiesPanelResizer
          propertiesPixelWidth={propertiesPixelWidth}
          updatePropertiesPanelSize={this.updatePropertiesPanelSize}
        />
        {this.renderTopControls()}
        <ScrollView
          timeline={timeline}
          propertiesPixelWidth={propertiesPixelWidth}
          onMouseDown={this.onScrollViewMouseDown}
        >
          {
            <ComponentRows
              rowHeight={this.state.rowHeight}
              getActiveComponent={this.getActiveComponent}
              mixpanel={this.props.mixpanel}
              showEventHandlersEditor={this.showEventHandlersEditor}
              onDoubleClickToMoveGauge={this.moveGaugeOnDoubleClick}
              setEditingRowTitleStatus={this.setEditingRowTitleStatus}
              showBezierEditor={this.showBezierEditor}
              propertiesPixelWidth={propertiesPixelWidth}
            />
          }
        </ScrollView>
        {this.renderBottomControls()}
        <ExpressionInput
          ref="expressionInput"
          reactParent={this}
          component={activeComponent}
          timeline={timeline}
          onCommitValue={this.onCommitValue}
          windowHeight={window.innerHeight}
          onFocusRequested={() => {
            const selected = activeComponent.getSelectedRows()[0];
            if (selected.isProperty()) {
              selected.focus({from: 'timeline'});
            }
          }}
          onNavigateRequested={(navDir, doFocus) => {
            activeComponent.focusSelectNext(navDir, doFocus, {from: 'timeline'});
          }} />
      </div>
    );
  }
}

export default Timeline;
