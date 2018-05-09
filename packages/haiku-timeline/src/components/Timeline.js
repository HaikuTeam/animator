import React from 'react'
import Color from 'color'
import lodash from 'lodash'
import { DraggableCore } from 'react-draggable'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import Combokeys from 'combokeys'
import BaseModel from 'haiku-serialization/src/bll/BaseModel'
import Project from 'haiku-serialization/src/bll/Project'
import Row from 'haiku-serialization/src/bll/Row'
import Keyframe from 'haiku-serialization/src/bll/Keyframe'
import requestElementCoordinates from 'haiku-serialization/src/utils/requestElementCoordinates'
import EmitterManager from 'haiku-serialization/src/utils/EmitterManager'
import Palette from 'haiku-ui-common/lib/Palette'
import PopoverMenu from 'haiku-ui-common/lib/electron/PopoverMenu'
import ControlsArea from './ControlsArea'
import ExpressionInput from './ExpressionInput'
import Scrubber from './ScrubberInterior'
import ClusterRow from './ClusterRow'
import PropertyRow from './PropertyRow'
import ComponentHeadingRow from './ComponentHeadingRow'
import FrameGrid from './FrameGrid'
import IntercomWidget from './IntercomWidget'
import Gauge from './Gauge'
import GaugeTimeReadout from './GaugeTimeReadout'
import TimelineRangeScrollbar from './TimelineRangeScrollbar'
import HorzScrollShadow from './HorzScrollShadow'
import {InteractionMode, isPreviewMode} from '@haiku/core/lib/helpers/interactionModes'
import { USER_CHANNEL, UserSettings } from 'haiku-sdk-creator/lib/bll/User'
import logger from 'haiku-serialization/src/utils/LoggerInstance'
import {isWindows, isLinux} from 'haiku-common/lib/environments/os'

const Globals = require('haiku-ui-common/lib/Globals').default // Sorry, hack

// Useful debugging originator of calls in shared model code
process.env.HAIKU_SUBPROCESS = 'timeline'

/* z-index guide
  keyframe: 1002
  transition body: 1002
  keyframe draggers: 1003
  inputs: 1004, (1005 active)
  trim-area 1006
  scrubber: 1006
  bottom controls: 10000 <- ka-boom!
*/

const { webFrame } = require('electron')
if (webFrame) {
  if (webFrame.setZoomLevelLimits) webFrame.setZoomLevelLimits(1, 1)
  if (webFrame.setLayoutZoomLevelLimits) webFrame.setLayoutZoomLevelLimits(0, 0)
}

const ifIsRunningStandalone = (cb) => {
  if (!window.isWebview) {
    return cb()
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
  avoidTimelinePointerEvents: false,
  isPreviewModeActive: false,
  isRepeat: true,
  flush: false,
  userDetails: null
}

const THROTTLE_TIME = 32 // ms
const MENU_ACTION_DEBOUNCE_TIME = 100

const combokeys = new Combokeys(document.documentElement)

class Timeline extends React.Component {
  constructor (props) {
    super(props)

    EmitterManager.extend(this)

    this.state = lodash.assign({}, DEFAULTS)

    Project.setup(
      this.props.folder,
      'timeline',
      this.props.websocket,
      window,
      this.props.userconfig,
      { // fileOptions
        doWriteToDisk: false,
        skipDiffLogging: true
      },
      this.props.envoy,
      (err, project) => {
        if (err) throw err
        this.handleProjectReady(project)
      }
    )

    this.handleRequestElementCoordinates = this.handleRequestElementCoordinates.bind(this)
    this.showEventHandlersEditor = this.showEventHandlersEditor.bind(this)
    this.showFrameActionsEditor = this.showFrameActionsEditor.bind(this)
    this.mouseMoveListener = this.mouseMoveListener.bind(this)
    this.mouseUpListener = this.mouseUpListener.bind(this)

    this.handleCutDebounced = lodash.debounce(this.handleCut.bind(this), MENU_ACTION_DEBOUNCE_TIME, {leading: true, trailing: false})
    this.handleCopyDebounced = lodash.debounce(this.handleCopy.bind(this), MENU_ACTION_DEBOUNCE_TIME, {leading: true, trailing: false})
    this.handlePasteDebounced = lodash.debounce(this.handlePaste.bind(this), MENU_ACTION_DEBOUNCE_TIME, {leading: true, trailing: false})
    this.handleSelectAllDebounced = lodash.debounce(this.handleSelectAll.bind(this), MENU_ACTION_DEBOUNCE_TIME, {leading: true, trailing: false})
    this.handleUndoDebounced = lodash.debounce(this.handleUndo.bind(this), MENU_ACTION_DEBOUNCE_TIME, {leading: true, trailing: false})
    this.handleRedoDebounced = lodash.debounce(this.handleRedo.bind(this), MENU_ACTION_DEBOUNCE_TIME, {leading: true, trailing: false})

    window.timeline = this
  }

  isTextInputFocused () {
    const tagName = (
      document.activeElement &&
      document.activeElement.tagName &&
      document.activeElement.tagName.toLowerCase()
    )

    return (
      tagName && (
        tagName === 'input' ||
        tagName === 'textarea'
      )
    )
  }

  isTextSelected () {
    return window.getSelection().type === 'Range'
  }

  /*
   * lifecycle/events
   * --------- */

  componentWillUnmount () {
    this.mounted = false

    // Clean up subscriptions to prevent memory leaks and react warnings
    this.removeEmitterListeners()
    combokeys.detach()

    if (this.tourClient) {
      this.tourClient.off('tour:requestElementCoordinates', this.handleRequestElementCoordinates)
    }

    this.project.getEnvoyClient().closeConnection()
  }

  componentDidMount () {
    this.mounted = true

    const resetKeyStates = () => {
      Globals.allKeysUp()

      this.setState({
        isShiftKeyDown: false,
        isCommandKeyDown: false,
        isControlKeyDown: false,
        isAltKeyDown: false,
        avoidTimelinePointerEvents: false
      })
    }

    // If the user e.g. Cmd+tabs away from the window
    this.addEmitterListener(window, 'blur', () => {
      resetKeyStates()

      // If an expression input is focused when we leave this webview, close it
      if (this.getActiveComponent()) {
        this.getActiveComponent().getRows().forEach((row) => {
          row.blur({ from: 'timeline' })
        })
      }
    })

    this.addEmitterListener(window, 'focus', () => {
      resetKeyStates()
    })

    this.addEmitterListener(this.props.websocket, 'method', (method, params, message, cb) => {
      // Harness to enable cross-subview integration testing
      if (method === 'executeFunctionSpecification') {
        return Project.executeFunctionSpecification(
          { timeline: this },
          'timeline',
          lodash.assign(
            {
              timeline: this,
              project: this.state.projectModel
            },
            params[0]
          ),
          cb
        )
      }
    })

    combokeys.bind('command+z', () => {
      ifIsRunningStandalone(() => {
        this.handleUndoDebounced({
          from: 'timeline',
          time: Date.now()
        })
      })
    })

    combokeys.bind('command+shift+z', () => {
      ifIsRunningStandalone(() => {
        this.handleRedoDebounced({
          from: 'timeline',
          time: Date.now()
        })
      })
    })

    combokeys.bind('command+x', () => {
      ifIsRunningStandalone(() => {
        this.handleCutDebounced()
      })
    })

    combokeys.bind('command+c', () => {
      ifIsRunningStandalone(() => {
        this.handleCopyDebounced()
      })
    })

    combokeys.bind('command+v', () => {
      ifIsRunningStandalone(() => {
        this.handlePasteDebounced()
      })
    })

    // Workaround to fix electron(Chromium) distinct codepath for
    // Windows and Linux shortcuts. More info:
    // https://github.com/electron/electron/issues/7165#issuecomment-246486798
    // https://github.com/buttercup/buttercup-desktop/pull/223
    if (isWindows() || isLinux()) {
      combokeys.bind('ctrl+x', () => {
        this.handleCutDebounced()
      })

      combokeys.bind('ctrl+c', () => {
        this.handleCopyDebounced()
      })

      combokeys.bind('ctrl+v', () => {
        this.handlePasteDebounced()
      })
    }

    combokeys.bind('command+a', () => {
      ifIsRunningStandalone(() => {
        this.handleSelectAllDebounced()
      })
    })
  }

  getActiveComponent () {
    return this.project && this.project.getCurrentActiveComponent()
  }

  awaitRef (name, cb) {
    if (this.refs[name]) {
      return cb(this.refs[name])
    }
    return setTimeout(() => {
      this.awaitRef(name, cb)
    }, 100)
  }

  handleProjectReady (project) {
    this.project = project

    this.addEmitterListenerIfNotAlreadyRegistered(this.project, 'envoy:tourClientReady', (tourClient) => {
      this.tourClient = tourClient
      this.tourClient.on('tour:requestElementCoordinates', this.handleRequestElementCoordinates)
      // When the timeline loads, that is the indication to move from the first tour step
      // to the next step that shows how to create animations
      setTimeout(() => {
        if (!this.project.getEnvoyClient().isInMockMode() && this.tourClient) {
          this.tourClient.next()
        }
      })
    })

    this.addEmitterListenerIfNotAlreadyRegistered(this.project, 'update', (what, arg) => {
      switch (what) {
        case 'setCurrentActiveComponent':
          this.handleActiveComponentReady()
          break
        case 'application-mounted':
          this.handleHaikuComponentMounted()
          break
        case 'reloaded':
          if (arg === 'hard' && this.mounted) {
            this.forceUpdate()
          }
          break
      }
    })

    this.addEmitterListenerIfNotAlreadyRegistered(this.project, 'remote-update', (what, ...args) => {
      switch (what) {
        case 'setCurrentActiveComponent':
          this.handleActiveComponentReady()
          break
        case 'setInteractionMode':
          this.handleInteractionModeChange(...args)
          break
      }
    })

    this.addEmitterListener(window, 'resize', lodash.throttle(() => {
      if (this.mounted && this.getActiveComponent()) {
        const pxWidth = document.body.clientWidth - this.getActiveComponent().getCurrentTimeline().getPropertiesPixelWidth()
        this.getActiveComponent().getCurrentTimeline().setTimelinePixelWidth(pxWidth + 20)
        this.forceUpdate()
      }
    }, THROTTLE_TIME))

    // The this-binding here is required; I am not sure why since we also do this in the constructor.
    // If you remove the this-binding, you'll see exceptions when you move your mouse initially.
    this.addEmitterListener(window, 'mousemove', this.mouseMoveListener.bind(this))
    this.addEmitterListener(window, 'mouseup', this.mouseUpListener.bind(this))

    this.addEmitterListener(this.props.websocket, 'relay', (message) => {
      logger.info('relay received', message.name, 'from', message.from)

      // The next relay destination in the sequence is always glass
      const relayable = lodash.assign(message, {view: 'glass'})

      switch (message.name) {
        case 'global-menu:zoom-in':
          // For now, zoom controls only affect the stage
          this.props.websocket.send(relayable)
          break

        case 'global-menu:zoom-out':
          // For now, zoom controls only affect the stage
          this.props.websocket.send(relayable)
          break

        case 'global-menu:group':
          // For now, grouping is only possible via the stage
          this.props.websocket.send(relayable)
          break

        case 'global-menu:ungroup':
          // For now, grouping is only possible via the stage
          this.props.websocket.send(relayable)
          break

        case 'global-menu:cut':
          // Delegate cut only if the user is not editing something here
          if (document.hasFocus()) {
            if (!this.isTextSelected()) {
              this.props.websocket.send(relayable)
            }
          } else {
            this.props.websocket.send(relayable)
          }
          break

        case 'global-menu:copy':
          // Delegate copy only if the user is not editing something here
          if (document.hasFocus()) {
            if (!this.isTextSelected()) {
              this.props.websocket.send(relayable)
            }
          } else {
            this.props.websocket.send(relayable)
          }
          break

        case 'global-menu:paste':
          // Delegate paste only if the user is not editing something here
          if (document.hasFocus()) {
            if (!this.isTextInputFocused()) {
              this.props.websocket.send(relayable)
            }
          } else {
            this.props.websocket.send(relayable)
          }
          break

        case 'global-menu:selectAll':
          // Delegate selectall only if the user is not editing something here
          if (!document.hasFocus()) {
            if (!this.isTextInputFocused()) {
              this.props.websocket.send(relayable)
            }
          } else {
            this.props.websocket.send(relayable)
          }
          break

        case 'global-menu:undo':
          // For consistency, let glass initiate undo/redo
          this.props.websocket.send(relayable)
          break

        case 'global-menu:redo':
          // For consistency, let glass initiate undo/redo
          this.props.websocket.send(relayable)
          break
      }
    })

    this.addEmitterListener(this.props.websocket, 'broadcast', (message) => {
      if (message.folder !== this.props.folder) {
        return
      }

      switch (message.name) {
        case 'remote-model:receive-sync':
          BaseModel.receiveSync(message)
          break

        case 'component:reload':
          if (this.getActiveComponent()) {
            this.getActiveComponent().moduleReplace(() => {})
          }
          break

        case 'event-handlers-updated':
          if (this.getActiveComponent()) {
            this.getActiveComponent().getCurrentTimeline().notifyFrameActionChange()
          }
          break
      }
    })

    this.addEmitterListener(document.body, 'keydown', this.handleKeyDown.bind(this))

    this.addEmitterListener(document.body, 'keyup', (keyupEvent) => {
      this.handleKeyUp(keyupEvent)
    })

    this.addEmitterListener(document.body, 'mousewheel', lodash.throttle((wheelEvent) => {
      this.handleScroll(wheelEvent)
    }, 16), { passive: true })

    this.addEmitterListener(document, 'mousemove', (mouseMoveEvent) => {
      if (!this.getActiveComponent()) {
        return
      }

      const timeline = this.getActiveComponent().getCurrentTimeline()

      if (timeline) {
        const frameInfo = timeline.getFrameInfo()
        let pxInTimeline = mouseMoveEvent.clientX - timeline.getPropertiesPixelWidth()
        if (pxInTimeline < 0) {
          pxInTimeline = 0
        }
        const frameForPx = frameInfo.friA + Math.round(pxInTimeline / frameInfo.pxpf)
        timeline.hoverFrame(frameForPx)
      }
    })

    this.addEmitterListener(PopoverMenu, 'show', (payload) => {
      const items = this.getPopoverMenuItems(payload)
      PopoverMenu.launch({
        event: payload.event,
        items
      })
    })

    this.addEmitterListener(Row, 'update', (row, what) => {
      if (what === 'row-collapsed' || what === 'row-expanded') {
        this.forceUpdate()
      } else if (what === 'row-selected') {
        // TODO: Handle scrolling to the correct row
      }
    })

    // When all views send this, we know it's ok to initialize the 'main' component
    this.project.broadcastPayload({
      name: 'project-state-change',
      what: 'project:ready'
    })

    // When developing Timeline in standalone, this env var directs it to automatically
    // set the current active component, which is normally initiated by Creator
    if (process.env.AUTOSTART) {
      this.project.setCurrentActiveComponent(process.env.AUTOSTART, { from: 'timeline' }, () => {})
    }
  }

  handleActiveComponentReady () {
    this.mountHaikuComponent()
  }

  mountHaikuComponent () {
    // The Timeline UI doesn't display the component, so we don't bother giving it a ref
    this.getActiveComponent().mountApplication(null, {
      freeze: true // No display means no need for overflow settings, etc
    })
  }

  handleHaikuComponentMounted () {
    this.loadUserSettings()
    this.getActiveComponent().getCurrentTimeline().setTimelinePixelWidth(document.body.clientWidth - this.getActiveComponent().getCurrentTimeline().getPropertiesPixelWidth() + 20)

    if (this.mounted) {
      this.forceUpdate()
    }

    this.project.broadcastPayload({
      name: 'project-state-change',
      what: 'component:mounted',
      scenename: this.getActiveComponent().getSceneName()
    })
  }

  handleInteractionModeChange (relpath, interactionMode) {
    const timeline = this.getActiveComponent().getCurrentTimeline()
    if (timeline.isPlaying()) {
      timeline.pause()
    }
    this.setState({isPreviewModeActive: isPreviewMode(interactionMode)})
  }

  getPopoverMenuItems ({ event, type, model, offset, curve }) {
    const items = []

    const numSelectedKeyframes = this.getActiveComponent().getSelectedKeyframes().length

    items.push({
      label: 'Create Keyframe',
      enabled: (
        // During multi-select it's weird to show "Create Keyframe" in the menu
        (numSelectedKeyframes < 3) &&
        (
          type === 'keyframe-segment' ||
          type === 'keyframe-transition' ||
          type === 'property-row' ||
          type === 'cluster-row'
        )
      ),
      onClick: (event) => {
        const timeline = this.getActiveComponent().getCurrentTimeline()
        const frameInfo = timeline.getFrameInfo()
        const ms = Math.round(timeline.getHoveredFrame() * frameInfo.mspf)
        model.createKeyframe(undefined, ms, { from: 'timeline' })
      }
    })

    items.push({ type: 'separator' })

    items.push({
      label: (numSelectedKeyframes < 2) ? 'Delete Keyframe' : 'Delete Keyframes',
      enabled: type === 'keyframe',
      onClick: (event) => {
        this.getActiveComponent().deleteSelectedKeyframes({ from: 'timeline' })
      }
    })

    items.push({ type: 'separator' })

    items.push({
      label: (numSelectedKeyframes < 3) ? 'Make Tween' : 'Make Tweens',
      enabled: type === 'keyframe-segment',
      submenu: (type === 'keyframe-segment') && this.curvesMenu(curve, (event, curveName) => {
        this.getActiveComponent().joinSelectedKeyframes(curveName, { from: 'timeline' })
      })
    })

    items.push({
      label: (numSelectedKeyframes < 3) ? 'Change Tween' : 'Change Tweens',
      enabled: type === 'keyframe-transition',
      submenu: (type === 'keyframe-transition') && this.curvesMenu(curve, (event, curveName) => {
        this.getActiveComponent().changeCurveOnSelectedKeyframes(curveName, { from: 'timeline' })
      })
    })

    items.push({
      label: (numSelectedKeyframes < 3) ? 'Remove Tween' : 'Remove Tweens',
      enabled: type === 'keyframe-transition',
      onClick: (event) => {
        this.getActiveComponent().splitSelectedKeyframes({ from: 'timeline' })
      }
    })

    return items
  }

  loadUserSettings () {
    if (!this.project.getEnvoyClient().isInMockMode()) {
      this.project.getEnvoyClient().get(USER_CHANNEL).then(
        (user) => {
          this.user = user
          user.getConfig(UserSettings.timeDisplayModes).then(
            (timeDisplayModes) => {
              if (timeDisplayModes && timeDisplayModes[this.project.getFolder()]) {
                this.getActiveComponent().getCurrentTimeline().setTimeDisplayMode(timeDisplayModes[this.project.getFolder()])
              } else {
                user.getConfig(UserSettings.defaultTimeDisplayMode).then((defaultTimeDisplayMode) => {
                  defaultTimeDisplayMode && this.getActiveComponent().getCurrentTimeline().setTimeDisplayMode(defaultTimeDisplayMode)
                })
              }
            }
          )
          user.getUserDetails().then(
            (userDetails) => {
              this.setState({userDetails})
            }
          )
        }
      )
    }
  }

  curvesMenu (maybeCurve, cb) {
    const items = []

    items.push({
      label: 'Linear',
      enabled: (
        maybeCurve !== 'linear' &&
        maybeCurve !== 'Linear'
      ),
      onClick: (event) => {
        return cb(event, 'linear')
      }
    })

    items.push({
      label: 'Ease In',
      submenu: this.curveTypeMenu('easeIn', maybeCurve, cb)
    })

    items.push({
      label: 'Ease Out',
      submenu: this.curveTypeMenu('easeOut', maybeCurve, cb)
    })

    items.push({
      label: 'Ease In Out',
      submenu: this.curveTypeMenu('easeInOut', maybeCurve, cb)
    })

    return items
  }

  curveTypeMenu (baseCurve, maybeCurve, cb) {
    const items = []

    items.push({
      label: 'Back',
      enabled: maybeCurve !== baseCurve + 'Back',
      onClick: (event) => {
        return cb(event, baseCurve + 'Back')
      }
    })

    items.push({
      label: 'Bounce',
      enabled: maybeCurve !== baseCurve + 'Bounce',
      onClick: (event) => {
        return cb(event, baseCurve + 'Bounce')
      }
    })

    items.push({
      label: 'Circ',
      enabled: maybeCurve !== baseCurve + 'Circ',
      onClick: (event) => {
        return cb(event, baseCurve + 'Circ')
      }
    })

    items.push({
      label: 'Cubic',
      enabled: maybeCurve !== baseCurve + 'Cubic',
      onClick: (event) => {
        return cb(event, baseCurve + 'Cubic')
      }
    })

    items.push({
      label: 'Elastic',
      enabled: maybeCurve !== baseCurve + 'Elastic',
      onClick: (event) => {
        return cb(event, baseCurve + 'Elastic')
      }
    })

    items.push({
      label: 'Expo',
      enabled: maybeCurve !== baseCurve + 'Expo',
      onClick: (event) => {
        return cb(event, baseCurve + 'Expo')
      }
    })

    items.push({
      label: 'Quad',
      enabled: maybeCurve !== baseCurve + 'Quad',
      onClick: (event) => {
        return cb(event, baseCurve + 'Quad')
      }
    })

    items.push({
      label: 'Quart',
      enabled: maybeCurve !== baseCurve + 'Quart',
      onClick: (event) => {
        return cb(event, baseCurve + 'Quart')
      }
    })

    items.push({
      label: 'Quint',
      enabled: maybeCurve !== baseCurve + 'Quint',
      onClick: (event) => {
        return cb(event, baseCurve + 'Quint')
      }
    })

    items.push({
      label: 'Sine',
      enabled: maybeCurve !== baseCurve + 'Sine',
      onClick: (event) => {
        return cb(event, baseCurve + 'Sine')
      }
    })

    return items
  }

  handleScroll (scrollEvent) {
    if (scrollEvent.deltaY >= 1 || scrollEvent.deltaY <= -1) {
      // Don't horizontally scroll if we are vertically scrolling
      return void (0)
    }

    if (scrollEvent.deltaX >= 1 || scrollEvent.deltaX <= -1) {
      return this.handleHorizontalScroll(scrollEvent.deltaX)
    }
  }

  handleHorizontalScroll (origDelta) {
    const motionDelta = Math.round((origDelta ? origDelta < 0 ? -1 : 1 : 0) * (Math.log(Math.abs(origDelta) + 1) * 2))
    this.getActiveComponent().getCurrentTimeline().updateVisibleFrameRangeByDelta(motionDelta)
  }

  handleRequestElementCoordinates ({ selector, webview }) {
    requestElementCoordinates({
      currentWebview: 'timeline',
      requestedWebview: webview,
      selector,
      shouldNotifyEnvoy:
        this.tourClient &&
        this.project.getEnvoyClient() &&
        !this.project.getEnvoyClient().isInMockMode(),
      tourClient: this.tourClient
    })
  }

  handleKeyDown (nativeEvent) {
    // Give the currently active expression input a chance to capture this event and short circuit us if so
    const willExprInputHandle = this.refs.expressionInput.willHandleExternalKeydownEvent(nativeEvent)

    if (willExprInputHandle || this.state.isPreviewModeActive) {
      return void (0)
    }

    // If the user hit the spacebar _and_ we aren't inside an input field, treat that like a playback trigger
    if (nativeEvent.keyCode === 32 && !document.querySelector('input:focus')) {
      this.togglePlayback()
      nativeEvent.preventDefault()
      return void (0)
    }

    switch (nativeEvent.which) {
      // case 27: //escape
      // case 32: //space
      case 37: // left
        if (this.state.isCommandKeyDown) {
          if (this.state.isShiftKeyDown) {
            this.getActiveComponent().getCurrentTimeline().setVisibleFrameRange(0, this.getActiveComponent().getCurrentTimeline().getRightFrameEndpoint())
            this.getActiveComponent().getCurrentTimeline().updateCurrentFrame(0)
          } else {
            this.getActiveComponent().getCurrentTimeline().updateScrubberPositionByDelta(-1)
          }
        } else {
          this.getActiveComponent().getCurrentTimeline().updateVisibleFrameRangeByDelta(-1)
        }
        break

      case 39: // right
        if (this.state.isCommandKeyDown) {
          this.getActiveComponent().getCurrentTimeline().updateScrubberPositionByDelta(1)
        } else {
          this.getActiveComponent().getCurrentTimeline().updateVisibleFrameRangeByDelta(1)
        }
        break

      // case 38: // up
      // case 40: // down
      // case 13: //enter
      // delete
      // case 46: //delete
      // case 8: //delete
      case 16: this.updateKeyboardState({ isShiftKeyDown: true }); break
      case 17: this.updateKeyboardState({ isControlKeyDown: true }); break
      case 18: this.updateKeyboardState({ isAltKeyDown: true }); break
      case 224: this.updateKeyboardState({ isCommandKeyDown: true }); break
      case 91: this.updateKeyboardState({ isCommandKeyDown: true }); break
      case 93: this.updateKeyboardState({ isCommandKeyDown: true }); break
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
      case 46: this.getActiveComponent().deleteSelectedKeyframes({ from: 'timeline' }); break // Only if there are any
      case 8: this.getActiveComponent().deleteSelectedKeyframes({ from: 'timeline' }); break // Only if there are any
      case 16: this.updateKeyboardState({ isShiftKeyDown: false }); break
      case 17: this.updateKeyboardState({ isControlKeyDown: false }); break
      case 18: this.updateKeyboardState({ isAltKeyDown: false }); break
      case 224: this.updateKeyboardState({ isCommandKeyDown: false }); break
      case 91: this.updateKeyboardState({ isCommandKeyDown: false }); break
      case 93: this.updateKeyboardState({ isCommandKeyDown: false }); break
    }
  }

  updateKeyboardState (updates) {
    // If the input is focused, don't allow keyboard state changes to cause a re-render, otherwise
    // the input field will switch back to its previous contents (e.g. when holding down 'shift')
    if (!this.getActiveComponent().getFocusedRow()) {
      return this.setState(updates)
    } else {
      for (var key in updates) {
        this.state[key] = updates[key]
      }
    }
  }

  handleUndo () {
    if (this.project) {
      Keyframe.deselectAndDeactivateAllKeyframes({component: this.getActiveComponent()})
      this.project.undo({}, {from: 'timeline'}, () => {})
    }
  }

  handleRedo () {
    if (this.project) {
      Keyframe.deselectAndDeactivateAllKeyframes({component: this.getActiveComponent()})
      this.project.redo({}, {from: 'timeline'}, () => {})
    }
  }

  handleCut () {
    // Not yet implemented
  }

  handleCopy () {
    // Not yet implemented
  }

  handlePaste () {
    // Not yet implemented
  }

  handleDelete () {
    // Not yet implemented
  }

  handleSelectAll () {
    // Not yet implemented
  }

  saveTimeDisplayModeSetting () {
    const mode = this.getActiveComponent().getCurrentTimeline().getTimeDisplayMode()

    if (!this.project.getEnvoyClient().isInMockMode()) {
      this.user.getConfig(UserSettings.timeDisplayModes).then(
        (timeDisplayModes) => {
          this.user.setConfig(
            UserSettings.timeDisplayModes,
            {
              ...timeDisplayModes,
              [this.project.getFolder()]: mode
            }
          )
          this.user.setConfig(UserSettings.defaultTimeDisplayMode, mode)
        }
      )
    }
  }

  playbackSkipBack () {
    this.getActiveComponent().getCurrentTimeline().playbackSkipBack()
  }

  playbackSkipForward () {
    this.getActiveComponent().getCurrentTimeline().playbackSkipForward()
  }

  togglePlayback () {
    this.getActiveComponent().getCurrentTimeline().togglePlayback()
  }

  renderTimelinePlaybackControls () {
    return (
      <div
        style={{
          position: 'relative',
          top: 17,
          width: '100%'
        }}>
        <ControlsArea
          timeline={this.getActiveComponent().getCurrentTimeline()}
          activeComponentDisplayName={`${this.props.userconfig.project} (${this.getActiveComponent().getTitle()})`}
          selectedTimelineName={this.getActiveComponent().getCurrentTimeline().getName()}
          playbackSpeed={this.state.playerPlaybackSpeed}
          changeTimelineName={(oldTimelineName, newTimelineName) => {
            this.getActiveComponent().renameTimeline(oldTimelineName, newTimelineName, { from: 'timeline' }, () => {})
          }}
          createTimeline={(timelineName) => {
            this.getActiveComponent().createTimeline(timelineName, {}, { from: 'timeline' }, () => {})
          }}
          duplicateTimeline={(timelineName) => {
            this.getActiveComponent().duplicateTimeline(timelineName, { from: 'timeline' }, () => {})
          }}
          deleteTimeline={(timelineName) => {
            this.getActiveComponent().deleteTimeline(timelineName, { from: 'timeline' }, () => {})
          }}
          selectTimeline={(currentTimelineName) => {
            // Not yet implemented
          }}
          playbackSkipBack={() => {
            this.playbackSkipBack()
          }}
          playbackSkipForward={() => {
            this.playbackSkipForward()
          }}
          playbackPlayPause={() => {
            this.togglePlayback()
          }}
          changePlaybackSpeed={(inputEvent) => {
            let playerPlaybackSpeed = Number(inputEvent.target.value || 1)
            this.setState({ playerPlaybackSpeed })
          }}
          toggleRepeat={() => {
            const timeline = this.getActiveComponent().getCurrentTimeline()
            timeline.toggleRepeat()
            this.setState({ isRepeat: timeline.getRepeat() })
          }}
          isRepeat={this.state.isRepeat}
          />
        <IntercomWidget user={this.state.userDetails} />
      </div>
    )
  }

  getCurrentTimelineTime (frameInfo) {
    return Math.round(this.getActiveComponent().getCurrentTimeline().getCurrentFrame() * frameInfo.mspf)
  }

  showFrameActionsEditor (frame) {
    const elementPrimaryKey = this.getActiveComponent().findElementRoots()[0].getPrimaryKey()
    this.showEventHandlersEditor(
      elementPrimaryKey,
      frame
    )
  }

  showEventHandlersEditor (elementPrimaryKey, frame) {
    this.project.broadcastPayload({
      name: 'show-event-handlers-editor',
      elid: elementPrimaryKey,
      opts: {
        isSimplified: Boolean(frame)
      },
      frame
    })
  }

  renderDurationModifier () {
    var frameInfo = this.getActiveComponent().getCurrentTimeline().getFrameInfo()

    var pxOffset = this.getActiveComponent().getCurrentTimeline().getDragIsAdding() ? 0 : -this.getActiveComponent().getCurrentTimeline().getDurationTrim() * frameInfo.pxpf

    if (frameInfo.friB >= frameInfo.friMax || this.getActiveComponent().getCurrentTimeline().getDragIsAdding()) {
      return (
        <DraggableCore
          axis='x'
          onStart={(dragEvent, dragData) => {
            this.getActiveComponent().getCurrentTimeline().setDurationTrim(0)
          }}
          onStop={(dragEvent, dragData) => {
            this.getActiveComponent().getCurrentTimeline().handleDurationModifierStop(dragData)
          }}
          onDrag={(dragEvent, dragData) => {
            this.getActiveComponent().getCurrentTimeline().dragDurationModifierPosition(dragData.x)
          }}>
          <div style={{
            position: 'absolute',
            right: pxOffset,
            top: 0,
            zIndex: 1006
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
                cursor: 'move'
              }} />
            <div className='trim-area' style={{
              position: 'absolute',
              top: 0,
              mouseEvents: 'none',
              left: -6,
              width: 26 + pxOffset,
              height: (this.refs.scrollview && this.refs.scrollview.clientHeight + 35) || 0,
              borderLeft: '1px solid ' + Palette.FATHER_COAL,
              backgroundColor: Color(Palette.FATHER_COAL).fade(0.6)
            }} />
          </div>
        </DraggableCore>
      )
    } else {
      return <span />
    }
  }

  renderTopControls () {
    return (
      <div
        className='top-controls no-select'
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: this.state.rowHeight + 10,
          width: this.getActiveComponent().getCurrentTimeline().getPropertiesPixelWidth() + this.getActiveComponent().getCurrentTimeline().getTimelinePixelWidth(),
          verticalAlign: 'top',
          fontSize: 10,
          borderBottom: '1px solid ' + Palette.FATHER_COAL,
          backgroundColor: Palette.COAL
        }}>
        <div
          className='gauge-timekeeping-wrapper'
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: 'inherit',
            width: this.getActiveComponent().getCurrentTimeline().getPropertiesPixelWidth()
          }}>
          <GaugeTimeReadout
            reactParent={this}
            timeline={this.getActiveComponent().getCurrentTimeline()} />
        </div>
        <div
          id='gauge-box'
          className='gauge-box'
          onMouseDown={(event) => {
            event.persist()

            this.setState({
              doHandleMouseMovesInGauge: true,
              avoidTimelinePointerEvents: true
            }, () => {
              this.mouseMoveListener(event)
            })
          }}
          style={{
            position: 'absolute',
            top: 0,
            left: this.getActiveComponent().getCurrentTimeline().getPropertiesPixelWidth(),
            width: this.getActiveComponent().getCurrentTimeline().getTimelinePixelWidth(),
            height: 'inherit',
            verticalAlign: 'top',
            paddingTop: 12,
            color: Palette.ROCK_MUTED }}>
          <FrameGrid
            timeline={this.getActiveComponent().getCurrentTimeline()}
            onShowFrameActionsEditor={this.showFrameActionsEditor} />
          <Gauge
            timeline={this.getActiveComponent().getCurrentTimeline()} />
          <Scrubber
            reactParent={this}
            isScrubbing={this.getActiveComponent().getCurrentTimeline().isScrubberDragging()}
            timeline={this.getActiveComponent().getCurrentTimeline()} />
        </div>
        {this.renderDurationModifier()}
      </div>
    )
  }

  mouseMoveListener (evt) {
    if (!this.state.doHandleMouseMovesInGauge) {
      return
    }

    const frameInfo = this.getActiveComponent().getCurrentTimeline().getFrameInfo()
    const leftX = evt.clientX - this.getActiveComponent().getCurrentTimeline().getPropertiesPixelWidth()
    const frameX = Math.round(leftX / frameInfo.pxpf)
    const newFrame = frameInfo.friA + frameX

    if (newFrame < 0) {
      return false
    }

    const pageFrameLength = this.getActiveComponent().getCurrentTimeline().getVisibleFrameRangeLength()

    // If the frame clicked exceeds the virtual or explicit max, allocate additional
    // virtual frames in the view and jump the user to the new page
    if (newFrame > frameInfo.friB) {
      const newMaxFrame = newFrame + pageFrameLength
      this.getActiveComponent().getCurrentTimeline().setMaxFrame(newMaxFrame)
      this.getActiveComponent().getCurrentTimeline().setVisibleFrameRange(newFrame, newMaxFrame)
    }

    this.getActiveComponent().getCurrentTimeline().seek(newFrame)
  }

  mouseUpListener () {
    this.setState({
      doHandleMouseMovesInGauge: false,
      avoidTimelinePointerEvents: false
    })
  }

  disablePreviewMode () {
    this.project.setInteractionMode(InteractionMode.EDIT, () => {})
  }

  renderBottomControls () {
    return (
      <div
        className='no-select'
        style={{
          width: '100%',
          height: 45,
          backgroundColor: Palette.COAL,
          overflow: 'visible',
          position: 'fixed',
          bottom: 0,
          left: 0,
          zIndex: 10000
        }}>
        <TimelineRangeScrollbar
          reactParent={this}
          timeline={this.getActiveComponent().getCurrentTimeline()} />
        {this.renderTimelinePlaybackControls()}
      </div>
    )
  }

  renderComponentRow (row, prev, dragHandleProps) {
    // Cluster rows only display if collapsed, otherwise we show their properties
    if (row.isClusterHeading() && !row.isExpanded()) {
      return (
        <ClusterRow
          key={row.getUniqueKey()}
          rowHeight={this.state.rowHeight}
          timeline={this.getActiveComponent().getCurrentTimeline()}
          component={this.getActiveComponent()}
          prev={prev}
          row={row} />
      )
    }

    if (row.isProperty()) {
      return (
        <PropertyRow
          key={row.getUniqueKey()}
          rowHeight={this.state.rowHeight}
          timeline={this.getActiveComponent().getCurrentTimeline()}
          component={this.getActiveComponent()}
          prev={prev}
          row={row} />
      )
    }

    if (row.isHeading()) {
      return (
        <ComponentHeadingRow
          key={row.getUniqueKey()}
          rowHeight={this.state.rowHeight}
          timeline={this.getActiveComponent().getCurrentTimeline()}
          component={this.getActiveComponent()}
          row={row}
          prev={prev}
          onEventHandlerTriggered={this.showEventHandlersEditor}
          isExpanded={row.isExpanded()}
          isHidden={row.isHidden()}
          isSelected={row.isSelected()}
          hasAttachedActions={row.element.getVisibleEvents().length > 0}
          dragHandleProps={dragHandleProps}
        />
      )
    }

    // If we got here, display nothing since we don't know what to render
    return ''
  }

  calcGroupRowsHeight (rows) {
    let height = 0

    rows.forEach((row) => {
      if ((row.isHeading() || row.isClusterHeading()) && !row.isExpanded()) {
        height += 1
      } else if (row.isProperty()) {
        height += 1
      }
    })

    return height
  }

  renderComponentRows () {
    const groups = this.getActiveComponent().getDisplayableRowsGroupedByElementInZOrder()

    return (
      <DragDropContext
        onDragEnd={(result) => {
          // No destination means no change
          if (!result.destination) {
            return
          }

          const idx = result.destination.index
          const reflection = groups.length - idx
          logger.info(`z-drop ${result.draggableId} at`, reflection)

          this.props.mixpanel.haikuTrack('creator:timeline:z-shift')

          this.getActiveComponent().zShiftIndices(
            result.draggableId,
            this.getActiveComponent().getInstantiationTimelineName(),
            this.getActiveComponent().getInstantiationTimelineTime(),
            reflection - 1,
            {from: 'timeline'},
            () => {
              this.forceUpdate()
            }
          )
        }}>
        <Droppable droppableId='componentRowsDroppable'>
          {(provided, snapshot) => {
            return (
              <div
                className='droppable-wrapper'
                ref={provided.innerRef}>
                {groups.map((group, indexOfGroup) => {
                  const minHeight = this.state.rowHeight * this.calcGroupRowsHeight(group.rows)
                  const minWidth = this.getActiveComponent().getCurrentTimeline().getPropertiesPixelWidth() + this.getActiveComponent().getCurrentTimeline().getTimelinePixelWidth()
                  const prevGroup = groups[indexOfGroup - 1]
                  return (
                    <Draggable
                      key={`property-row-group-${group.id}-${indexOfGroup}`}
                      draggableId={group.id}
                      index={indexOfGroup}>
                      {(provided, snapshot) => {
                        return (
                          <div style={{
                            minHeight, /* Row drops are mis-targeted unless we specify this height */
                            minWidth /* Prevent horizontal scrolling in the overflow-x:auto box */
                          }}>
                            <div
                              className='droppable-wrapper'
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              style={{
                                ...provided.draggableProps.style
                              }}>
                              {group.rows.map((row, indexOfRowWithinGroup) => {
                                let prevRow = group.rows[indexOfRowWithinGroup - 1]
                                if (!prevRow && prevGroup) prevRow = prevGroup.rows[prevGroup.length - 1]
                                return this.renderComponentRow(row, prevRow, provided.dragHandleProps)
                              })}
                            </div>
                            {provided.placeholder}
                          </div>
                        )
                      }}
                    </Draggable>
                  )
                })}
                {provided.placeholder}
              </div>
            )
          }}
        </Droppable>
      </DragDropContext>
    )
  }

  render () {
    if (!this.getActiveComponent() || !this.getActiveComponent().getCurrentTimeline()) {
      return (
        <div
          id='timeline'
          className='no-select'
          style={{
            position: 'absolute',
            backgroundColor: Palette.GRAY,
            color: Palette.ROCK,
            top: 0,
            left: 0,
            height: '100%',
            width: '100%'
          }} />
      )
    }

    return (
      <div
        ref='container'
        id='timeline'
        className='no-select'
        onClick={(clickEvent) => {
          this.getActiveComponent().getRows().forEach((row) => {
            row.blur({ from: 'timeline' })
            row.deselect({ from: 'timeline' })
          })
        }}
        style={{
          position: 'absolute',
          backgroundColor: Palette.GRAY,
          color: Palette.ROCK,
          top: 0,
          left: 0,
          height: 'calc(100% - 45px)',
          width: '100%',
          overflowY: 'hidden',
          overflowX: 'hidden'
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
                zIndex: 999999,
                backgroundColor: Palette.COAL
              }}
              onClick={() => { this.disablePreviewMode() }}
            />
          )
        }
        <HorzScrollShadow
          timeline={this.getActiveComponent().getCurrentTimeline()} />
        {this.renderTopControls()}
        <div
          ref='scrollview'
          id='property-rows'
          className='no-select'
          style={{
            position: 'absolute',
            top: 35,
            left: 0,
            width: '100%',
            pointerEvents: this.state.avoidTimelinePointerEvents ? 'none' : 'auto',
            WebkitUserSelect: this.state.avoidTimelinePointerEvents ? 'none' : 'auto',
            bottom: 0,
            overflowY: 'auto',
            overflowX: 'hidden'
          }}
          onMouseDown={(mouseEvent) => {
            if (
              !Globals.isShiftKeyDown &&
              !Globals.isControlKeyDown &&
              mouseEvent.nativeEvent.which !== 3
            ) {
              Keyframe.deselectAndDeactivateAllKeyframes({ component: this.getActiveComponent() })
            }
          }}>
          {this.renderComponentRows()}
        </div>
        {this.renderBottomControls()}
        <ExpressionInput
          ref='expressionInput'
          reactParent={this}
          component={this.getActiveComponent()}
          timeline={this.getActiveComponent().getCurrentTimeline()}
          onCommitValue={(committedValue) => {
            const row = this.getActiveComponent().getFocusedRow()
            const ms = this.getActiveComponent().getCurrentTimeline().getCurrentMs()
            logger.info('commit', JSON.stringify(committedValue), 'at', ms, 'on', row.dump())
            this.props.mixpanel.haikuTrack('creator:timeline:create-keyframe')
            row.createKeyframe(committedValue, ms, { from: 'timeline' })
          }}
          onFocusRequested={() => {
            const selected = this.getActiveComponent().getSelectedRows()[0]
            if (selected.isProperty()) {
              selected.focus({ from: 'timeline' })
            }
          }}
          onNavigateRequested={(navDir, doFocus) => {
            this.getActiveComponent().focusSelectNext(navDir, doFocus, { from: 'timeline' })
          }} />
      </div>
    )
  }
}

export default Timeline
