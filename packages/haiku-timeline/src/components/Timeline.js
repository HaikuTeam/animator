import React from 'react'
import Color from 'color'
import lodash from 'lodash'
import { DraggableCore } from 'react-draggable'
import Project from 'haiku-serialization/src/bll/Project'
import Row from 'haiku-serialization/src/bll/Row'
import ModuleWrapper from 'haiku-serialization/src/bll/ModuleWrapper'
import requestElementCoordinates from 'haiku-serialization/src/utils/requestElementCoordinates'
import EmitterManager from 'haiku-serialization/src/utils/EmitterManager'
import Palette from 'haiku-ui-common/lib/Palette'
import PopoverMenu from 'haiku-ui-common/lib/electron/PopoverMenu'
import ControlsArea from './ControlsArea'
import ExpressionInput from './ExpressionInput'
import Scrubber from './Scrubber'
import ClusterRow from './ClusterRow'
import PropertyRow from './PropertyRow'
import ComponentHeadingRow from './ComponentHeadingRow'
import FrameGrid from './FrameGrid'
import Gauge from './Gauge'
import GaugeTimeReadout from './GaugeTimeReadout'
import TimelineRangeScrollbar from './TimelineRangeScrollbar'
import HorzScrollShadow from './HorzScrollShadow'
import {isPreviewMode} from '@haiku/player/lib/helpers/interactionModes'
import { USER_CHANNEL } from 'haiku-sdk-creator/lib/bll/User'

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

var electron = require('electron')
var webFrame = electron.webFrame
if (webFrame) {
  if (webFrame.setZoomLevelLimits) webFrame.setZoomLevelLimits(1, 1)
  if (webFrame.setLayoutZoomLevelLimits) webFrame.setLayoutZoomLevelLimits(0, 0)
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
  isRepeat: true
}

const THROTTLE_TIME = 32 // ms

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

    // Used to calculate scroll position
    this._renderedRows = []

    window.timeline = this
  }

  /*
   * lifecycle/events
   * --------- */

  componentWillUnmount () {
    this.mounted = false

    // Clean up subscriptions to prevent memory leaks and react warnings
    this.removeEmitterListeners()

    if (this.tourClient) {
      this.tourClient.removeListener('tour:requestElementCoordinates', this.handleRequestElementCoordinates)
    }

    this.project.getEnvoyClient().closeConnection()
  }

  componentDidMount () {
    this.mounted = true
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
          if (arg === 'hard') {
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
      options: { freeze: true }, // No display means no need for overflow settings, etc
      reloadMode: ModuleWrapper.RELOAD_MODES.MONKEYPATCHED_OR_ISOLATED
    })
  }

  handleHaikuComponentMounted () {
    this.loadUserSettings()
    this.getActiveComponent().getCurrentTimeline().setTimelinePixelWidth(document.body.clientWidth - this.getActiveComponent().getCurrentTimeline().getPropertiesPixelWidth() + 20)

    window.addEventListener('resize', lodash.throttle(() => {
      if (this.mounted) {
        const pxWidth = document.body.clientWidth - this.getActiveComponent().getCurrentTimeline().getPropertiesPixelWidth()
        this.getActiveComponent().getCurrentTimeline().setTimelinePixelWidth(pxWidth + 20)
        this.forceUpdate()
      }
    }, THROTTLE_TIME))

    this.addEmitterListener(this.props.websocket, 'broadcast', (message) => {
      if (message.folder !== this.props.folder) return void (0)
      switch (message.name) {
        case 'component:reload':
          this.getActiveComponent().moduleReplace(() => {})
          break
        case 'view:mousedown':
          if (message.elid !== 'timeline-webview') {
            this.getActiveComponent().deselectAndDeactivateAllKeyframes()
          }
          break
        case 'event-handlers-updated':
          this.getActiveComponent().getCurrentTimeline().notifyFrameActionChange()
          break
      }
    })

    document.addEventListener('paste', (pasteEvent) => {
      let tagname = pasteEvent.target.tagName.toLowerCase()
      let editable = pasteEvent.target.getAttribute('contenteditable') // Our input fields are <span>s
      if (tagname === 'input' || tagname === 'textarea' || editable) {
        // This is probably a property input, so let the default action happen
        // TODO: Make this check less brittle
      } else {
        // Notify creator that we have some content that the person wishes to paste on the stage;
        // the top level needs to handle this because it does content type detection.
        pasteEvent.preventDefault()
        this.props.websocket.send({
          type: 'broadcast',
          name: 'current-pasteable:request-paste',
          from: 'glass',
          data: null // This can hold coordinates for the location of the paste
        })
      }
    })

    document.body.addEventListener('keydown', this.handleKeyDown.bind(this))

    document.body.addEventListener('keyup', this.handleKeyUp.bind(this))

    document.body.addEventListener('mousewheel', lodash.throttle((wheelEvent) => {
      this.handleScroll(wheelEvent)
    }, 64), { passive: true })

    document.addEventListener('mousemove', (mouseMoveEvent) => {
      const timeline = this.getActiveComponent().getCurrentTimeline()
      // The timeline might not be initialized as of the first mouse move
      if (timeline) {
        const frameInfo = timeline.getFrameInfo()
        let pxInTimeline = mouseMoveEvent.clientX - timeline.getPropertiesPixelWidth()
        if (pxInTimeline < 0) pxInTimeline = 0
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

    this.forceUpdate()

    this.project.broadcastPayload({
      name: 'project-state-change',
      what: 'component:mounted',
      scenename: this.getActiveComponent().getSceneName()
    })
  }

  handleInteractionModeChange (relpath, interactionMode) {
    this.setState({isPreviewModeActive: isPreviewMode(interactionMode)})
  }

  getPopoverMenuItems ({ event, type, model, offset, curve }) {
    const items = []

    items.push({
      label: 'Create Keyframe',
      enabled: (
        type === 'keyframe-segment' ||
        type === 'keyframe-transition' ||
        type === 'property-row' ||
        type === 'cluster-row'
      ),
      onClick: (event) => {
        const { ms } = this.getEventPositionInfo(event, offset)
        // The model here might be
        model.createKeyframe(undefined, ms, { from: 'timeline' })
      }
    })

    items.push({ type: 'separator' })

    items.push({
      label: 'Delete Keyframe',
      enabled: type === 'keyframe',
      onClick: (event) => {
        this.getActiveComponent().deleteActiveKeyframes({ from: 'timeline' })
      }
    })

    items.push({ type: 'separator' })

    items.push({
      label: 'Make Tween',
      enabled: type === 'keyframe-segment',
      submenu: (type === 'keyframe-segment') && this.curvesMenu(curve, (event, curveName) => {
        this.getActiveComponent().joinSelectedKeyframes(curveName, { from: 'timeline' })
        if (this.tourClient && !this.project.getEnvoyClient().isInMockMode()) {
          this.tourClient.next()
        }
      })
    })

    items.push({
      label: 'Change Tween',
      enabled: type === 'keyframe-transition',
      submenu: (type === 'keyframe-transition') && this.curvesMenu(curve, (event, curveName) => {
        this.getActiveComponent().changeCurveOnSelectedKeyframes(curveName, { from: 'timeline' })
      })
    })

    items.push({
      label: 'Remove Tween',
      enabled: type === 'keyframe-transition',
      onClick: (event) => {
        this.getActiveComponent().splitSelectedKeyframes({ from: 'timeline' })
      }
    })

    return items
  }

  loadUserSettings () {
    this.project.getEnvoyClient().get(USER_CHANNEL).then(
      (user) => {
        this.user = user
        user.getConfig('timeDisplayModes').then(
          (timeDisplayModes) => {
            if (timeDisplayModes && timeDisplayModes[this.project.getFolder()]) {
              this.getActiveComponent().getCurrentTimeline().setTimeDisplayMode(timeDisplayModes[this.project.getFolder()])
            } else {
              user.getConfig('defaultTimeDisplayMode').then((defaultTimeDisplayMode) => {
                defaultTimeDisplayMode && this.getActiveComponent().getCurrentTimeline().setTimeDisplayMode(defaultTimeDisplayMode)
              })
            }
          }
        )
      }
    )
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

  getEventPositionInfo (event, extra) {
    const frameInfo = this.getActiveComponent().getCurrentTimeline().getFrameInfo()

    const offset = event.offsetX || 0
    const total = (extra || 0) + offset + Math.round(frameInfo.pxA / frameInfo.pxpf)

    const frame = Math.round(total / frameInfo.pxpf)
    const ms = Math.round(frame * frameInfo.mspf)

    return { offset, total, frame, ms }
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
    const absDelta = Math.abs(origDelta)
    const deltaSign = origDelta ? origDelta < 0 ? -1 : 1 : 0
    const motionDelta = Math.round(deltaSign * (Math.log(absDelta + 1) * 2))
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
    if (willExprInputHandle) {
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
      // case 46: //delete
      // case 13: //enter
      // delete
      case 8: this.getActiveComponent().deleteActiveKeyframes({ from: 'timeline' }); break // Only if there are any
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
      // case 46: //delete
      // case 8: //delete
      // case 13: //enter
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

  saveTimeDisplayModeSetting () {
    const mode = this.getActiveComponent().getCurrentTimeline().getTimeDisplayMode()

    this.user.getConfig('timeDisplayModes').then(
      (timeDisplayModes) => {
        this.user.setConfig(
          'timeDisplayModes',
          {
            ...timeDisplayModes,
            [this.project.getFolder()]: mode
          }
        )
        this.user.setConfig('defaultTimeDisplayMode', mode)
      }
    )
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
          top: 17
        }}>
        <ControlsArea
          timeline={this.getActiveComponent().getCurrentTimeline()}
          activeComponentDisplayName={this.props.userconfig.name}
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
            this.getActiveComponent().setTimelineName(currentTimelineName, { from: 'timeline' }, () => {})
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
          onClick={(clickEvent) => {
            if (clickEvent.nativeEvent.target.id === 'gauge-box') {
              if (!this.getActiveComponent().getCurrentTimeline().isScrubberDragging()) {
                const frameInfo = this.getActiveComponent().getCurrentTimeline().getFrameInfo()

                const leftX = clickEvent.nativeEvent.offsetX
                const frameX = Math.round(leftX / frameInfo.pxpf)
                const newFrame = frameInfo.friA + frameX
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
            }
          }}
          style={{
            // display: 'table-cell',
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

  // Creates a virtual list of all the component rows (includes headings and property rows)
  renderComponentRows (rows) {
    if (!this.mounted) {
      return <span />
    }

    this._renderedRows = []

    return (
      <div
        className='property-row-list'
        style={{
          position: 'absolute'
        }}>
        {rows.map((row) => {
          // Cluster rows only display if collapsed, otherwise we show their properties
          if (row.isClusterHeading() && !row.isExpanded()) {
            this._renderedRows.push(row)
            return (
              <ClusterRow
                key={row.getUniqueKey()}
                rowHeight={this.state.rowHeight}
                timeline={this.getActiveComponent().getCurrentTimeline()}
                component={this.getActiveComponent()}
                row={row} />
            )
          }

          if (row.isProperty()) {
            this._renderedRows.push(row)
            return (
              <PropertyRow
                key={row.getUniqueKey()}
                rowHeight={this.state.rowHeight}
                timeline={this.getActiveComponent().getCurrentTimeline()}
                component={this.getActiveComponent()}
                row={row} />
            )
          }

          if (row.isHeading()) {
            this._renderedRows.push(row)
            return (
              <ComponentHeadingRow
                key={row.getUniqueKey()}
                rowHeight={this.state.rowHeight}
                timeline={this.getActiveComponent().getCurrentTimeline()}
                component={this.getActiveComponent()}
                row={row}
                onEventHandlerTriggered={this.showEventHandlersEditor} />
            )
          }

          // If we got here, display nothing since we don't know what to render
          return ''
        })}
      </div>
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
              this.getActiveComponent().deselectAndDeactivateAllKeyframes()
            }
          }}>
          {this.renderComponentRows(this.getActiveComponent().getDisplayableRows())}
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

            console.info('[timeline] commit', JSON.stringify(committedValue), 'at', ms, 'on', row.dump())

            row.createKeyframe(committedValue, ms, { from: 'timeline' })

            if (row.element.getNameString() === 'svg' && row.getPropertyName() === 'opacity') {
              if (!this.project.getEnvoyClient().isInMockMode() && this.tourClient) {
                this.tourClient.next()
              }
            }
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
