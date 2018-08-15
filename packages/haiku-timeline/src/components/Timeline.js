import {remote, ipcRenderer} from 'electron';
import * as React from 'react';
import * as Color from 'color';
import * as lodash from 'lodash';
import {DraggableCore} from 'react-draggable';
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import * as BaseModel from 'haiku-serialization/src/bll/BaseModel';
import * as Project from 'haiku-serialization/src/bll/Project';
import * as Asset from 'haiku-serialization/src/bll/Asset';
import * as Row from 'haiku-serialization/src/bll/Row';
import * as File from 'haiku-serialization/src/bll/File';
import * as Keyframe from 'haiku-serialization/src/bll/Keyframe';
import * as requestElementCoordinates from 'haiku-serialization/src/utils/requestElementCoordinates';
import * as EmitterManager from 'haiku-serialization/src/utils/EmitterManager';
import Palette from 'haiku-ui-common/lib/Palette';
import PopoverMenu from 'haiku-ui-common/lib/electron/PopoverMenu';
import ControlsArea from './ControlsArea';
import ExpressionInput from './ExpressionInput';
import ScrubberInterior from './ScrubberInterior';
import RowManager from './RowManager';
import FrameGrid from './FrameGrid';
import SimplifiedFrameGrid from './SimplifiedFrameGrid';
import FrameActionsGrid from './FrameActionsGrid';
import IntercomWidget from './IntercomWidget';
import {TrackedExporterRequests} from './TrackedExporterRequests';
import Gauge from './Gauge';
import GaugeTimeReadout from './GaugeTimeReadout';
import TimelineRangeScrollbar from './TimelineRangeScrollbar';
import HorzScrollShadow from './HorzScrollShadow';
import ScrollView from './ScrollView';
import Marquee from './Marquee';
import {InteractionMode, isPreviewMode} from 'haiku-ui-common/lib/interactionModes';
import {USER_CHANNEL, UserSettings} from 'haiku-sdk-creator/lib/bll/User';
import {EXPORTER_CHANNEL} from 'haiku-sdk-creator/lib/exporter';
import * as logger from 'haiku-serialization/src/utils/LoggerInstance';
import {Experiment, experimentIsEnabled} from 'haiku-common/lib/experiments';
import zIndex from './styles/zIndex';
import Globals from 'haiku-ui-common/lib/Globals';

// Useful debugging originator of calls in shared model code
process.env.HAIKU_SUBPROCESS = 'timeline';

/* z-index guide
  keyframe: 1002
  transition body: 1002
  keyframe draggers: 1003
  inputs: 1004, (1005 active)
  trim-area 1006
  scrubber: 1006
  bottom controls: 10000 <- ka-boom!
*/

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
  inputCellWidth: 75,
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
  canOfflineExport: false,
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

    if (experimentIsEnabled(Experiment.NativeTimelineScroll)) {
      this.isShiftKeyDown = false;
      this.isCommandKeyDown = false;
      this.isControlKeyDown = false;
      this.isAltKeyDown = false;
    }

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

    this.handleCutDebounced = lodash.debounce(this.handleCut.bind(this), MENU_ACTION_DEBOUNCE_TIME, {leading: true, trailing: false});
    this.handleCopyDebounced = lodash.debounce(this.handleCopy.bind(this), MENU_ACTION_DEBOUNCE_TIME, {leading: true, trailing: false});
    this.handlePasteDebounced = lodash.debounce(this.handlePaste.bind(this), MENU_ACTION_DEBOUNCE_TIME, {leading: true, trailing: false});
    this.handleSelectAllDebounced = lodash.debounce(this.handleSelectAll.bind(this), MENU_ACTION_DEBOUNCE_TIME, {leading: true, trailing: false});
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
    return keyframeViewEl.firstChild.getBoundingClientRect();
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
          return !(typeof event.target.className !== 'string' || event.target.className.includes('js-avoid-marquee-init'));
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

    this.addEmitterListener(this.props.websocket, 'method', (method, params, message, cb) => {
      // Harness to enable cross-subview integration testing
      if (method === 'executeFunctionSpecification') {
        return Project.executeFunctionSpecification(
          {timeline: this},
          'timeline',
          lodash.assign(
            {
              timeline: this,
              project: this.state.projectModel,
            },
            params[0],
          ),
          cb,
        );
      }
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

  getActiveComponent () {
    return this.project && this.project.getCurrentActiveComponent();
  }

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
      // logger.info(`[timeline] local update ${what}`)

      switch (what) {
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
      // logger.info(`[timeline] remote update ${what}`)

      switch (what) {
        case 'setCurrentActiveComponent':
          this.handleActiveComponentReady();
          break;
        case 'setInteractionMode':
          this.handleInteractionModeChange(...args);
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
          if (!document.hasFocus() || !this.isTextSelected()) {
            this.props.websocket.send(relayable);
          }
          break;

        case 'global-menu:copy':
          if (experimentIsEnabled(Experiment.CopyPasteTweensWithAccelerators)) {
            this.handleCopyDebounced(relayable);
          } else {
            // Delegate copy only if the user is not editing something here
            if (!document.hasFocus() || !this.isTextSelected()) {
              this.props.websocket.send(relayable);
            }
          }
          break;

        case 'global-menu:paste':
          if (experimentIsEnabled(Experiment.CopyPasteTweensWithAccelerators)) {
            this.handlePasteDebounced(relayable);
          } else {
            // Delegate paste only if the user is not editing something here
            if (document.hasFocus()) {
              if (!this.isTextInputFocused()) {
                this.props.websocket.send(relayable);
              }
            } else {
              this.props.websocket.send(relayable);
            }
          }
          break;

        case 'global-menu:selectAll':
          // Delegate selectall only if the user is not editing something here
          if (!document.hasFocus()) {
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

    if (experimentIsEnabled(Experiment.NativeTimelineScroll)) {
      // If you are looking for the scroll listener event, it's attached to
      // this.container on `attachContainerElement`
      this.addEmitterListener(window, 'wheel', (wheelEvent) => {
        if (wheelEvent.ctrlKey || wheelEvent.metaKey) {
          wheelEvent.preventDefault();
          this.handleZoomThrottled(wheelEvent);
        }
      });
    } else {
      this.addEmitterListener(document.body, 'mousewheel', lodash.throttle((wheelEvent) => {
        this.handleScroll(wheelEvent);
      }, 16), {passive: true});
    }

    this.addEmitterListener(document, 'mousemove', (mouseMoveEvent) => {
      if (!this.getActiveComponent()) {
        return;
      }

      const timeline = this.getActiveComponent().getCurrentTimeline();
      let pxInTimeline;
      let frameForPx;

      if (timeline) {
        const frameInfo = timeline.getFrameInfo();
        if (experimentIsEnabled(Experiment.NativeTimelineScroll)) {
          pxInTimeline = mouseMoveEvent.clientX + (this.container.scrollLeft || 0) - this.getActiveComponent().getCurrentTimeline().getPropertiesPixelWidth() - TIMELINE_OFFSET_PADDING;
        } else {
          pxInTimeline = mouseMoveEvent.clientX - timeline.getPropertiesPixelWidth();
        }

        if (pxInTimeline < 0) {
          pxInTimeline = 0;
        }
        if (experimentIsEnabled(Experiment.NativeTimelineScroll)) {
          frameForPx = Math.round(pxInTimeline / frameInfo.pxpf);
        } else {
          frameForPx = frameInfo.friA + Math.round(pxInTimeline / frameInfo.pxpf);
        }

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
      if (experimentIsEnabled(Experiment.NativeTimelineScroll)) {
        if (['row-collapsed', 'row-expanded'].includes(what) && row.isRootRow()) {
          this.forceUpdate();
        }

        if (what === 'row-selected' && metadata.from !== 'timeline') {
          this.scrollToRow(row);
        }
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

  handleActiveComponentReady () {
    const timeline = this.getActiveComponent().getCurrentTimeline();
    this.mountHaikuComponent();

    ipcRenderer.send('topmenu:update', {
      subComponents: this.project.describeSubComponents(),
    });

    this.loadUserSettings();
    this.trackExportProgress();
    timeline.setTimelinePixelWidth(document.body.clientWidth - timeline.getPropertiesPixelWidth() + 20);

    if (this.mounted) {
      this.forceUpdate();
    }

    if (experimentIsEnabled(Experiment.NativeTimelineScroll)) {
      this.addEmitterListenerIfNotAlreadyRegistered(timeline, 'update', (what, ...args) => {
        if (what === 'timeline-scroll-from-scrollbar') {
          this.container.scrollLeft = timeline.getScrollLeft();
        }
      });
    }

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

  getPopoverMenuItems ({event, type, model, offset, curve}) {
    const items = [];

    const selectedKeyframes = this.getActiveComponent().getSelectedKeyframes();
    const numSelectedKeyframes = selectedKeyframes.length;
    const isTweenableTransitionSegment = type === 'keyframe-segment' && (model && model.isTweenable());
    const isSingular = numSelectedKeyframes < 3;

    items.push({
      label: 'Create Keyframe',
      enabled: (
        // During multi-select it's weird to show "Create Keyframe" in the menu
        isSingular &&
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
      enabled: this.getActiveComponent().checkIfSelectedKeyframesAreMovableToZero(),
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

    if (experimentIsEnabled(Experiment.CopyPasteTweens)) {
      items.push({
        label: 'Copy Tween',
        enabled: type === 'keyframe-transition' && isSingular,
        onClick: this.copySelectedCurve,
      });

      items.push({
        label: 'Paste Tween',
        enabled: isTweenableTransitionSegment && Boolean(this._lastCopiedCurve),
        onClick: this.pasteSelectedCurve,
      });
    }

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
    const activeRequest = trackedExporterRequests.find(
      (trackedExporterRequest) => trackedExporterRequest.filename === exporterRequest.filename,
    );
    if (activeRequest) {
      activeRequest.progress = exporterRequest.progress;
    } else {
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
          user.checkOfflinePrivileges().then((canOfflineExport) => {
            this.setState({canOfflineExport});
          });
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
    this.getActiveComponent().getCurrentTimeline().zoomBy(wheelEvent.deltaY * 0.01);
  }

  handleScroll (scrollEvent) {
    if (scrollEvent.deltaY >= 1 || scrollEvent.deltaY <= -1) {
      // Don't horizontally scroll if we are vertically scrolling
      return void (0);
    }

    if (scrollEvent.deltaX >= 1 || scrollEvent.deltaX <= -1) {
      // FIXME: This is providing a delta to `handleHorizontalScroll` only because
      // Experiments.NativeTimelineScroll is not retired, and we need it to calculate
      // the scroll in the old code. Apologies about this, and please don't be confused.
      return this.handleHorizontalScroll(scrollEvent.deltaX);
    }
  }

  handleHorizontalScrollByDelta = (delta) => {
    const timeline = this.getActiveComponent().getCurrentTimeline();
    timeline.setScrollLeftFromScrollbar(timeline.getScrollLeft() + delta);
  };

  handleHorizontalScroll = (origDelta) => {
    if (experimentIsEnabled(Experiment.NativeTimelineScroll)) {
      this.getActiveComponent().getCurrentTimeline().setScrollLeftFromScrollbar(this.container.scrollLeft);
    } else {
      const motionDelta = Math.round((origDelta ? origDelta < 0 ? -1 : 1 : 0) * (Math.log(Math.abs(origDelta) + 1) * 2));
      this.getActiveComponent().getCurrentTimeline().updateVisibleFrameRangeByDelta(motionDelta);
    }
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
        if (this.state.isCommandKeyDown || (experimentIsEnabled(Experiment.NativeTimelineScroll) && this.isCommandKeyDown)) {
          if (this.state.isShiftKeyDown || (experimentIsEnabled(Experiment.NativeTimelineScroll) && this.isShiftKeyDown)) {
            this.getActiveComponent().getCurrentTimeline().setVisibleFrameRange(0, this.getActiveComponent().getCurrentTimeline().getRightFrameEndpoint());
            this.getActiveComponent().getCurrentTimeline().updateCurrentFrame(0);
          } else {
            this.getActiveComponent().getCurrentTimeline().updateScrubberPositionByDelta(-1);
          }
        } else {
          if (experimentIsEnabled(Experiment.NativeTimelineScroll)) {
            nativeEvent.preventDefault();
            this.handleHorizontalScrollByDelta(-15);
          } else {
            this.getActiveComponent().getCurrentTimeline().updateVisibleFrameRangeByDelta(-1);
          }
        }
        break;

      case 39: // right
        if (this.state.isCommandKeyDown || (experimentIsEnabled(Experiment.NativeTimelineScroll) && this.isCommandKeyDown)) {
          this.getActiveComponent().getCurrentTimeline().updateScrubberPositionByDelta(1);
        } else {
          if (experimentIsEnabled(Experiment.NativeTimelineScroll)) {
            nativeEvent.preventDefault();
            this.handleHorizontalScrollByDelta(15);
          } else {
            this.getActiveComponent().getCurrentTimeline().updateVisibleFrameRangeByDelta(1);
          }
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
    if (experimentIsEnabled(Experiment.NativeTimelineScroll)) {
      for (const key in updates) {
        this[key] = updates[key];
      }
    } else {
      // If the input is focused, don't allow keyboard state changes to cause a re-render, otherwise
      // the input field will switch back to its previous contents (e.g. when holding down 'shift')
      if (!this.getActiveComponent().getFocusedRow()) {
        return this.setState(updates);
      }

      for (const key in updates) {
        this.state[key] = updates[key];
      }
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

  handleCut () {
    // Not yet implemented
  }

  handleCopy (relayable) {
    if (experimentIsEnabled(Experiment.CopyPasteTweensWithAccelerators)) {
      // Delegate copy only if the user is not editing something here
      if (document.hasFocus()) {
        if (this.isTextSelected()) {
          // let electron handle
        } else if (this.getActiveComponent().getFirstSelectedCurve()) {
          this.copySelectedCurve();
        } else {
          this.props.websocket.send(relayable);
        }
      } else {
        this.props.websocket.send(relayable);
      }
    }
  }

  handlePaste (relayable) {
    if (experimentIsEnabled(Experiment.CopyPasteTweensWithAccelerators)) {
      // Delegate paste only if the user is not editing something here
      if (document.hasFocus()) {
        if (this.isTextInputFocused()) {
          // let electron handle
        } else if (this._lastCopiedCurve) {
          this.handlePasteDebounced();
        } else {
          this.props.websocket.send(relayable);
        }
      } else {
        this.props.websocket.send(relayable);
      }
    }
  }

  handleDelete () {
    // Not yet implemented
  }

  handleSelectAll () {
    // Not yet implemented
  }

  saveTimeDisplayModeSetting () {
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
  }

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
            this.state.canOfflineExport && experimentIsEnabled(Experiment.LocalAssetExport) &&
            <TrackedExporterRequests trackedExporterRequests={this.state.trackedExporterRequests} />
          }
          <IntercomWidget user={this.state.userDetails} />
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

  showEventHandlersEditor (elementPrimaryKey, frame) {
    this.project.broadcastPayload({
      name: 'show-event-handlers-editor',
      elid: elementPrimaryKey,
      opts: {
        isSimplified: Boolean(frame),
      },
      frame,
    });
  }

  renderDurationModifier () {
    const frameInfo = this.getActiveComponent().getCurrentTimeline().getFrameInfo();

    const pxOffset = this.getActiveComponent().getCurrentTimeline().getDragIsAdding() ? 0 : -this.getActiveComponent().getCurrentTimeline().getDurationTrim() * frameInfo.pxpf;

    if (frameInfo.friB >= frameInfo.friMax || this.getActiveComponent().getCurrentTimeline().getDragIsAdding()) {
      return (
        <DraggableCore
          axis="x"
          onStart={(dragEvent, dragData) => {
            this.getActiveComponent().getCurrentTimeline().setDurationTrim(0);
          }}
          onStop={(dragEvent, dragData) => {
            this.getActiveComponent().getCurrentTimeline().handleDurationModifierStop(dragData);
          }}
          onDrag={(dragEvent, dragData) => {
            this.getActiveComponent().getCurrentTimeline().dragDurationModifierPosition(dragData.x);
          }}>
          <div style={{
            position: 'absolute',
            right: pxOffset,
            top: 0,
            zIndex: 1006,
          }}>
            <div
              style={{
                position: 'absolute',
                backgroundColor: Palette.ROCK,
                width: 6,
                height: 32,
                zIndex: 3,
                top: 1,
                right: 0,
                borderTopRightRadius: 5,
                borderBottomRightRadius: 5,
                cursor: 'move',
              }} />
            <div className="trim-area" style={{
              position: 'absolute',
              top: 0,
              mouseEvents: 'none',
              left: -6,
              width: 26 + pxOffset,
              height: (this.refs.scrollview && this.refs.scrollview.clientHeight + 35) || 0,
              borderLeft: '1px solid ' + Palette.FATHER_COAL,
              backgroundColor: Color(Palette.FATHER_COAL).fade(0.6),
            }} />
          </div>
        </DraggableCore>
      );
    }

    return <span />;
  }

  renderTopControls () {
    if (experimentIsEnabled(Experiment.NativeTimelineScroll)) {
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
            <GaugeTimeReadout reactParent={this} timeline={timeline} />
          </div>
        ),
        (
          <SimplifiedFrameGrid
            key="frame-grid"
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
          <div key="durationModifier">
            {this.renderDurationModifier()}
          </div>
        ),
      ];
    }

    return (
      <div
        className="top-controls no-select"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: this.state.rowHeight + 10,
          width:
            this.getActiveComponent()
              .getCurrentTimeline()
              .getPropertiesPixelWidth() +
            this.getActiveComponent()
              .getCurrentTimeline()
              .getTimelinePixelWidth(),
          verticalAlign: 'top',
          fontSize: 10,
          borderBottom: '1px solid ' + Palette.FATHER_COAL,
          backgroundColor: Palette.COAL,
        }}
        onMouseDown={this.onGaugeMouseDown}
      >
        <div
          className="gauge-timekeeping-wrapper"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: 'inherit',
            width: this.getActiveComponent()
              .getCurrentTimeline()
              .getPropertiesPixelWidth(),
          }}
        >
          <GaugeTimeReadout reactParent={this} timeline={this.getActiveComponent().getCurrentTimeline()} />
        </div>
        <div>
          <div
            id="gauge-box"
            className="gauge-box"
            onMouseDown={this.onGaugeMouseDown}
            style={{
              position: 'absolute',
              top: 0,
              left: this.getActiveComponent().getCurrentTimeline().getPropertiesPixelWidth(),
              width: this.getActiveComponent().getCurrentTimeline().getTimelinePixelWidth(),
              height: 'inherit',
              verticalAlign: 'top',
              paddingTop: 12,
              color: Palette.ROCK_MUTED,
            }}
          >
            <FrameGrid
              timeline={this.getActiveComponent().getCurrentTimeline()}
              onShowFrameActionsEditor={this.showFrameActionsEditor}
            />
            <Gauge timeline={this.getActiveComponent().getCurrentTimeline()} />
            <ScrubberInterior
              timeline={this.getActiveComponent().getCurrentTimeline()}
            />
          </div>
        </div>
        {this.renderDurationModifier()}
      </div>
    );
  }

  onGaugeMouseDown (event) {
    event.persist();

    this._doHandleMouseMovesInGauge = true;
    this.disableTimelinePointerEvents();
    this.mouseMoveListener(event);
  }

  onCommitValue = (committedValue, row, ms) => {
    logger.info('commit', JSON.stringify(committedValue), 'at', ms, 'on', row.dump());
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
    const leftX = experimentIsEnabled(Experiment.NativeTimelineScroll)
      ? evt.clientX + (this.container.scrollLeft || 0) - this.getActiveComponent().getCurrentTimeline().getPropertiesPixelWidth() - TIMELINE_OFFSET_PADDING
      : evt.clientX - this.getActiveComponent().getCurrentTimeline().getPropertiesPixelWidth();

    const frameX = Math.round(leftX / frameInfo.pxpf);

    // Allow the scrubber to be dragged past 0 in order to reach 0
    let newFrame = experimentIsEnabled(Experiment.NativeTimelineScroll)
      ? frameX
      : frameInfo.friA + frameX;

    if (newFrame < 0) {
      newFrame = 0;
    }

    // Avoid expensive redundant updates
    if (newFrame === this.getActiveComponent().getCurrentTimeline().getCurrentFrame()) {
      return;
    }

    if (!experimentIsEnabled(Experiment.NativeTimelineScroll)) {
      const pageFrameLength = this.getActiveComponent().getCurrentTimeline().getVisibleFrameRangeLength();

      // If the frame clicked exceeds the virtual or explicit max, allocate additional
      // virtual frames in the view and jump the user to the new page
      if (newFrame > frameInfo.friB) {
        const newMaxFrame = newFrame + pageFrameLength;
        this.getActiveComponent().getCurrentTimeline().setMaxFrame(newMaxFrame);
        this.getActiveComponent().getCurrentTimeline().setVisibleFrameRange(newFrame, newMaxFrame);
      }
    }

    this.getActiveComponent().getCurrentTimeline().seek(newFrame);
  }

  mouseUpListener () {
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

  setGlassInteractionToEditMode () {
    if (this.state.isPreviewModeActive) {
      this.project.setInteractionMode(InteractionMode.GLASS_EDIT, {from: 'timeline'}, () => {
        this.setState({isPreviewModeActive: false});
      });
    }
  }

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
          zIndex: 10000,
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

  renderComponentRows () {
    const groups = this.getActiveComponent().getDisplayableRowsGroupedByElementInZOrder();

    return (
      <DragDropContext
        onDragEnd={(result) => {
          // No destination means no change
          if (!result.destination) {
            return;
          }

          const idx = result.destination.index;
          const reflection = groups.length - idx;
          logger.info(`z-drop ${result.draggableId} at`, reflection);

          this.props.mixpanel.haikuTrack('creator:timeline:z-shift');

          this.getActiveComponent().zShiftIndices(
            result.draggableId,
            this.getActiveComponent().getInstantiationTimelineName(),
            this.getActiveComponent().getInstantiationTimelineTime(),
            reflection - 1,
            {from: 'timeline'},
            () => {
              this.forceUpdate();
            },
          );
        }}>
        <Droppable droppableId="componentRowsDroppable" ignoreContainerClipping={true}>
          {(provided, snapshot) => {
            return (
              <div
                className="droppable-wrapper"
                style={{paddingBottom: 20}}
                ref={provided.innerRef}>
                {groups.map((group, indexOfGroup) => {
                  const minWidth = this.getActiveComponent().getCurrentTimeline().getPropertiesPixelWidth() + this.getActiveComponent().getCurrentTimeline().getTimelinePixelWidth();
                  const prevGroup = groups[indexOfGroup - 1];
                  return (
                    <Draggable
                      key={`property-row-group-${group.id}-${indexOfGroup}`}
                      draggableId={group.id}
                      index={indexOfGroup}>
                      {(providedDraggable) => {
                        return (
                          <div style={experimentIsEnabled(Experiment.NativeTimelineScroll) ? {} : {minWidth}}>
                            <div
                              className="droppable-wrapper unselectable-during-marquee"
                              ref={providedDraggable.innerRef}
                              {...providedDraggable.draggableProps}
                              style={{
                                ...providedDraggable.draggableProps.style,
                              }}>
                              <RowManager
                                group={group}
                                indexOfGroup={indexOfGroup}
                                prevGroup={prevGroup}
                                dragHandleProps={providedDraggable.dragHandleProps}
                                rowHeight={this.state.rowHeight}
                                getActiveComponent={() => {
                                  return this.getActiveComponent();
                                }}
                                showEventHandlersEditor={(...args) => {
                                  this.showEventHandlersEditor(...args);
                                }}
                                onDoubleClickToMoveGauge={this.moveGaugeOnDoubleClick}
                                setEditingRowTitleStatus={this.setEditingRowTitleStatus}
                              />
                            </div>
                            {providedDraggable.placeholder}
                          </div>
                        );
                      }}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </div>
            );
          }}
        </Droppable>
      </DragDropContext>
    );
  }

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

    return (
      <div
        ref={this.attachContainerElement}
        id="timeline"
        className="no-select"
        onClick={(clickEvent) => {
          this.getActiveComponent().getRows().forEach((row) => {
            row.blur({from: 'timeline'});
            row.deselect({from: 'timeline'});
          });
        }}
        style={{
          position: 'absolute',
          backgroundColor: Palette.GRAY,
          color: Palette.ROCK,
          top: 0,
          left: 0,
          height: experimentIsEnabled(Experiment.NativeTimelineScroll) ? 'calc(100% - 30px)' : 'calc(100% - 45px)',
          width: '100%',
          overflow: experimentIsEnabled(Experiment.NativeTimelineScroll) ? 'auto' : 'hidden',
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
              onClick={() => {
                this.setGlassInteractionToEditMode();
              }}
            />
          )
        }
        <HorzScrollShadow timeline={this.getActiveComponent().getCurrentTimeline()} />
        {this.renderTopControls()}
        <ScrollView
          timeline={this.getActiveComponent().getCurrentTimeline()}
          onMouseDown={(mouseEvent) => {
            if (
              !Globals.isShiftKeyDown &&
              !Globals.isControlKeyDown &&
              mouseEvent.nativeEvent.which !== 3
            ) {
              Keyframe.deselectAndDeactivateAllKeyframes({
                component: this.getActiveComponent(),
              });
            }
          }}
        >
          {this.renderComponentRows()}
        </ScrollView>
        {this.renderBottomControls()}
        <ExpressionInput
          ref="expressionInput"
          reactParent={this}
          component={this.getActiveComponent()}
          timeline={this.getActiveComponent().getCurrentTimeline()}
          onCommitValue={this.onCommitValue}
          onFocusRequested={() => {
            const selected = this.getActiveComponent().getSelectedRows()[0];
            if (selected.isProperty()) {
              selected.focus({from: 'timeline'});
            }
          }}
          onNavigateRequested={(navDir, doFocus) => {
            this.getActiveComponent().focusSelectNext(navDir, doFocus, {from: 'timeline'});
          }} />
      </div>
    );
  }
}

export default Timeline;
