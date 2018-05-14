import React from 'react'
import lodash from 'lodash'
import Radium from 'radium'
import path from 'path'
import HaikuDOMRenderer from '@haiku/core/lib/renderers/dom'
import HaikuContext from '@haiku/core/lib/HaikuContext'
import BaseModel from 'haiku-serialization/src/bll/BaseModel'
import Project from 'haiku-serialization/src/bll/Project'
import Config from '@haiku/core/lib/Config'
import Element from 'haiku-serialization/src/bll/Element'
import ElementSelectionProxy from 'haiku-serialization/src/bll/ElementSelectionProxy'
import Asset from 'haiku-serialization/src/bll/Asset'
import EmitterManager from 'haiku-serialization/src/utils/EmitterManager'
import {isCoordInsideBoxPoints} from 'haiku-serialization/src/bll/MathUtils'
import Palette from 'haiku-ui-common/lib/Palette'
import Comment from './Comment'
import EventHandlerEditor from './components/EventHandlerEditor'
import CreateComponentModal from './modals/CreateComponentModal'
import CreateGroupModal from './modals/CreateGroupModal'
import UngroupModal from './modals/UngroupModal'
import Comments from './Comments'
import PopoverMenu from 'haiku-ui-common/lib/electron/PopoverMenu'
import requestElementCoordinates from 'haiku-serialization/src/utils/requestElementCoordinates'
import {Experiment, experimentIsEnabled} from 'haiku-common/lib/experiments'
import originMana from '../overlays/originMana'
import controlPointMana from '../overlays/controlPointMana'
import boxMana from '../overlays/boxMana'
import defsMana from '../overlays/defsMana'
import gearMana from '../overlays/gearMana'
import rotationCursorMana from '../overlays/rotationCursorMana'
import scaleCursorMana from '../overlays/scaleCursorMana'
import logger from 'haiku-serialization/src/utils/LoggerInstance'
import {isMac} from 'haiku-common/lib/environments/os'

const mixpanel = require('haiku-serialization/src/utils/Mixpanel')
const Globals = require('haiku-ui-common/lib/Globals').default
const {clipboard, shell, remote} = require('electron')
const fse = require('haiku-fs-extra')
const moment = require('moment')
const {HOMEDIR_PATH} = require('haiku-serialization/src/utils/HaikuHomeDir')

fse.mkdirpSync(HOMEDIR_PATH)

// Useful debugging originator of calls in shared model code
process.env.HAIKU_SUBPROCESS = 'glass'

const POINTS_THRESHOLD_REDUCED = 65 // Display only the corner control points
const POINTS_THRESHOLD_NONE = 15 // Display no control points nor line

const POINT_DISPLAY_MODES = {
  NORMAL: [1, 1, 1, 1, 1, 1, 1, 1, 1],
  REDUCED_ON_TOP_BOTTOM: [1, 0, 1, 1, 0, 1, 1, 0, 1],
  REDUCED_ON_LEFT_RIGHT: [1, 1, 1, 0, 0, 0, 1, 1, 1],
  REDUCED_ON_BOTH: [1, 0, 1, 0, 0, 0, 1, 0, 1],
  NONE: [0, 0, 0, 0, 0, 0, 0, 0, 0]
}

const SELECTION_TYPES = {
  ON_STAGE_CONTROL: 'on_stage_control'
}

const MENU_ACTION_DEBOUNCE_TIME = 100
const DIMENSIONS_RESET_DEBOUNCE_TIME = 100
const BIG_NUMBER = 99999
const HAIKU_ID_ATTRIBUTE = 'haiku-id'
const HAIKU_SOURCE_ATTRIBUTE = 'haiku-source'

function isNumeric (n) {
  return !isNaN(parseFloat(n)) && isFinite(n)
}

function niceTimestamp () {
  return moment().format('YYYY-MM-DD-HHmmss')
}

function writeHtmlSnapshot (html, react) {
  fse.mkdirpSync(path.join(HOMEDIR_PATH, 'snapshots'))
  var filename = (react.props.projectName || 'Unknown') + '-' + niceTimestamp() + '.html'
  var filepath = path.join(HOMEDIR_PATH, 'snapshots', filename)
  fse.outputFile(filepath, html, (err) => {
    if (err) return void (0)
    shell.openItem(filepath)
  })
}

// The class is exported also _without_ the radium wrapper to allow jsdom testing
export class Glass extends React.Component {
  constructor (props) {
    super(props)

    EmitterManager.extend(this)

    this.state = {
      controlActivation: null,
      mousePositionCurrent: null,
      mousePositionPrevious: null,
      isAnythingScaling: false,
      isAnythingRotating: false,
      hoveredControlPointIndex: null,
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
      comments: [],
      doShowComments: false,
      targetElement: null,
      isEventHandlerEditorOpen: false,
      isCreateComponentModalOpen: false,
      isCreateGroupModalOpen: false,
      isUngroupModalOpen: false,
      eventHandlerEditorOptions: {}
    }

    Project.setup(
      this.props.folder,
      'glass',
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

    this.debouncedWindowMouseOverOutHandler = lodash.debounce((mouseEvent) => {
      this.windowMouseOverOutHandler(mouseEvent)
    }, 10)

    this.handleDimensionsReset = lodash.debounce(() => {
      // Need to notify creator of viewport change so instantiation position is correct;
      // this event is also called whenever the window is resized
      const artboard = this.getActiveComponent().getArtboard()

      this.props.websocket.send({
        type: 'broadcast',
        name: 'dimensions-reset',
        from: 'glass',
        data: {
          zoom: artboard.getZoom(),
          rect: artboard.getRect()
        }
      })
    }, DIMENSIONS_RESET_DEBOUNCE_TIME)

    this._comments = new Comments(this.props.folder)

    this._playing = false
    this._stopwatch = null
    this._lastAuthoritativeFrame = 0

    this.drawLoop = this.drawLoop.bind(this)
    this.draw = this.draw.bind(this)

    this.handleUngroupDebounced = lodash.debounce(() => this.handleUngroup(), MENU_ACTION_DEBOUNCE_TIME, {leading: true, trailing: false})
    this.handleCutDebounced = lodash.debounce(() => this.handleCut(), MENU_ACTION_DEBOUNCE_TIME, {leading: true, trailing: false})
    this.handleCopyDebounced = lodash.debounce(() => this.handleCopy(), MENU_ACTION_DEBOUNCE_TIME, {leading: true, trailing: false})
    this.handlePasteDebounced = lodash.debounce(() => this.handlePaste(), MENU_ACTION_DEBOUNCE_TIME, {leading: true, trailing: false})
    this.handleSelectAllDebounced = lodash.debounce(() => this.handleSelectAll(), MENU_ACTION_DEBOUNCE_TIME, {leading: true, trailing: false})
    this.handleUndoDebounced = lodash.debounce((payload) => this.handleUndo(payload), MENU_ACTION_DEBOUNCE_TIME, {leading: true, trailing: false})
    this.handleRedoDebounced = lodash.debounce((payload) => this.handleRedo(payload), MENU_ACTION_DEBOUNCE_TIME, {leading: true, trailing: false})

    // For debugging
    window.glass = this

    // TODO: Is there any race condition with kicking this off immediately?
    this.drawLoop()

    // Leaky abstraction: we bind control point hover behaviors to superglobals because we use @haiku/core to render
    // control points as complex SVGs without a timeline. Ideally we would represent the entire box points overlay as a
    // single Haiku component and subscribe to regular events.
    window.hoverControlPoint = (hoveredControlPointIndex) => {
      this.setState({
        hoveredControlPointIndex
      })
    }
    window.unhoverControlPoint = () => {
      this.setState({
        hoveredControlPointIndex: null
      })
    }
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

  awaitRef (name, cb) {
    if (this.refs[name]) {
      return cb(this.refs[name])
    }
    return setTimeout(() => {
      this.awaitRef(name, cb)
    }, 100)
  }

  getActiveComponent () {
    return this.project && this.project.getCurrentActiveComponent()
  }

  handleProjectReady (project) {
    this.project = project

    this.addEmitterListenerIfNotAlreadyRegistered(this.project, 'envoy:timelineClientReady', (timelineChannel) => {
      timelineChannel.on('didPlay', this.handleTimelineDidPlay.bind(this))
      timelineChannel.on('didPause', this.handleTimelineDidPause.bind(this))
      timelineChannel.on('didSeek', this.handleTimelineDidSeek.bind(this))
    })

    this.addEmitterListenerIfNotAlreadyRegistered(this.project, 'envoy:tourClientReady', (client) => {
      this.tourClient = client
      this.tourClient.on('tour:requestElementCoordinates', this.handleRequestElementCoordinates)
    })

    this.addEmitterListenerIfNotAlreadyRegistered(this.project, 'update', (what, ...args) => {
      if (!this.getActiveComponent()) {
        return
      }

      // logger.info(`[glass] local update ${what}`)

      switch (what) {
        case 'setCurrentActiveComponent':
          this.handleActiveComponentReady()
          break
        case 'application-mounted':
          this.handleHaikuComponentMounted()
          break
        case 'dimensions-changed':
          this.resetContainerDimensions()
          this.forceUpdate()
          break
        case 'dimensions-reset':
          this.handleDimensionsReset()
          break
      }
    })

    this.addEmitterListenerIfNotAlreadyRegistered(this.project, 'remote-update', (what, ...args) => {
      // logger.info(`[glass] remote update ${what}`)

      switch (what) {
        case 'setCurrentActiveComponent':
          this.handleActiveComponentReady()
          break
        case 'setInteractionMode':
          this.handleInteractionModeChange()
          break
      }
    })

    this.addEmitterListenerIfNotAlreadyRegistered(this.project, 'change-authoritative-frame', (frame) => {
      this.handleTimelineDidSeek({frame})
    })

    // When all views send this, we know it's ok to initialize the 'main' component
    this.project.broadcastPayload({
      name: 'project-state-change',
      what: 'project:ready'
    })

    // When developing Glass in standalone, this env var directs it to automatically
    // set the current active component, which is normally initiated by Creator
    if (process.env.AUTOSTART) {
      this.project.setCurrentActiveComponent(process.env.AUTOSTART, { from: 'glass' }, () => {})
    }
  }

  handleActiveComponentReady () {
    this.mountHaikuComponent()
  }

  mountHaikuComponent () {
    this.awaitRef('mount', (ref) => {
      this.getActiveComponent().mountApplication(ref, {
        freeze: true,
        overflowX: 'visible',
        overflowY: 'visible',
        contextMenu: 'disabled'
      })
    })
  }

  handleHaikuComponentMounted () {
    this.project.broadcastPayload({
      name: 'project-state-change',
      what: 'component:mounted',
      scenename: this.getActiveComponent().getSceneName()
    })
  }

  handleInteractionModeChange () {
    // If preview mode is active, hide the events handlers editor
    // TODO: IMO (Roberto) would be nice if we can bring the editor back once
    // turning preview mode off, but needs discussion with the team.
    if (this.isPreviewMode()) {
      this.hideEventHandlersEditor()
      this._playing = false
    }

    this.forceUpdate()
  }

  handleShowEventHandlersEditor (elementUID, options, frame) {
    // The EventHandlerEditor uses this field to know whether to launch in frame mode vs event mode
    if (isNumeric(frame)) {
      options.frame = frame
    }

    this.showEventHandlersEditor(
      null,
      this.getActiveComponent().findElementByUid(elementUID),
      options
    )
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
      tourClient: this.tourClient
    })
  }

  handleTimelineDidPlay () {
    const ac = this.getActiveComponent()
    if (ac) {
      ac.setHotEditingMode(false)
    }
    this._playing = true
    this._stopwatch = Date.now()
  }

  handleTimelineDidPause (frameData) {
    if (!this._playing) {
      // If we have already been paused by a higher level event (e.g. toggling preview mode), do nothing.
      return
    }
    const ac = this.getActiveComponent()
    // Ensure preview mode is inactive before activating hot editing mode. If we toggle preview mode on during timeline
    // playback, we will typically receive the pause *after* the interaction mode change.
    if (ac && !ac.isPreviewModeActive()) {
      ac.setHotEditingMode(true)
    }
    this._playing = false
    this._lastAuthoritativeFrame = frameData.frame
    this._stopwatch = Date.now()
  }

  handleTimelineDidSeek (frameData) {
    this._lastAuthoritativeFrame = frameData.frame
    this._stopwatch = Date.now()
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
    let seekMs = 0

    // this._stopwatch is null unless we've received an action from the timeline.
    // If we're developing the glass solo, i.e. without a connection to envoy which
    // provides the system clock, we can just lock the time value to zero as a hack.
    // TODO: Would be nice to allow full-fledged solo development of glass...
    if (this._stopwatch !== null) {
      // TODO: support variable fps
      seekMs = (this._lastAuthoritativeFrame * 1000 / 60) + (this._playing ? Date.now() - this._stopwatch : 0)
    }

    // This rounding is required otherwise we'll see bizarre behavior on stage.
    // I think it's because some part of the player's caching or transition logic
    // which wants things to be round numbers. If we don't round this, i.e. convert
    // 16.666 -> 17 and 33.333 -> 33, then the player won't render those frames,
    // which means the user will have trouble moving things on stage at those times.
    seekMs = Math.round(seekMs)

    if (this.getActiveComponent()) {
      this.getActiveComponent().setTimelineTimeValue(seekMs)
    }
  }

  draw () {
    if (this.refs.overlay) {
      this.drawOverlays()
    }
  }

  drawLoop () {
    if (this.getActiveComponent()) {
      // We handle a frame change here since authoritative frame updates
      // are received async and we need to update according to the delta
      this.handleFrameChange()
      this.draw()
    }
    window.requestAnimationFrame(this.drawLoop.bind(this))
  }

  componentDidMount () {
    const resetKeyStates = () => {
      Globals.allKeysUp()

      this.setState({
        controlActivation: null,
        isAnythingScaling: false,
        isAnythingRotating: false,
        globalControlPointHandleClass: '',
        isStageSelected: false,
        isStageNameHovering: false,
        isMouseDown: false,
        isMouseDragging: false
      })
    }

    // If the user e.g. Cmd+tabs away from the window
    this.addEmitterListener(window, 'blur', () => {
      resetKeyStates()
    })

    this.addEmitterListener(window, 'focus', () => {
      resetKeyStates()
    })

    this.addEmitterListener(window, 'dragover', Asset.preventDefaultDrag, false)

    this.addEmitterListener(
      window,
      'drop',
      (event) => {
        this.project.linkExternalAssetOnDrop(event, (error) => {
          if (error) this.setState({ error })
          this.forceUpdate()
        })
      },
      false
    )

    this.addEmitterListener(document, 'mousewheel', (evt) => {
      if (
        !this.getActiveComponent() || // on mac, this is triggered by a two-finger pan
        this.state.isEventHandlerEditorOpen
      ) {
        return
      }

      const artboard = this.getActiveComponent().getArtboard()
      // The 0.4 coefficient here adjusts the pan speed down, and can be adjusted if desired. Larger numbers result in
      // faster panning.
      const SCROLL_PAN_COEFFICIENT = 0.4 * artboard.getZoom()
      artboard.snapshotOriginalPan()
      this.performPan(evt.wheelDeltaX * SCROLL_PAN_COEFFICIENT, evt.wheelDeltaY * SCROLL_PAN_COEFFICIENT)
    }, false)

    this.addEmitterListener(
      window,
      'drop',
      (event) => {
        this.project.linkExternalAssetOnDrop(event, (error) => {
          if (error) this.setState({ error })
          this.forceUpdate()
        })
      },
      false
    )

    this.addEmitterListener(this.props.websocket, 'method', (method, params, message, cb) => {
      // Harness to enable cross-subview integration testing
      if (method === 'executeFunctionSpecification') {
        return Project.executeFunctionSpecification(
          { glass: this },
          'glass',
          lodash.assign(
            {
              glass: this,
              project: this.project
            },
            params[0]
          ),
          cb
        )
      }
    })

    this.addEmitterListener(this.props.websocket, 'relay', (message) => {
      logger.info('relay received', message.name, 'from', message.from)

      switch (message.name) {
        case 'global-menu:zoom-in':
          mixpanel.haikuTrack('creator:glass:zoom-in')
          this.getActiveComponent().getArtboard().zoomIn(1.25)
          break

        case 'global-menu:zoom-out':
          mixpanel.haikuTrack('creator:glass:zoom-out')
          this.getActiveComponent().getArtboard().zoomOut(1.25)
          break

        case 'global-menu:group':
          if (experimentIsEnabled(Experiment.GroupUngroup)) {
            this.launchGroupNameModal()
          }
          break

        case 'global-menu:ungroup':
          if (experimentIsEnabled(Experiment.GroupUngroup)) {
            this.launchUngroupModal()
          }
          break

        case 'global-menu:cut':
          if (this.fetchProxyElementForSelection().hasAnythingInSelectionButNotArtboard()) {
            this.handleCutDebounced()
          }
          break

        case 'global-menu:copy':
          if (this.fetchProxyElementForSelection().hasAnythingInSelectionButNotArtboard()) {
            this.handleCopyDebounced()
          }
          break

        case 'global-menu:paste':
          this.handlePasteDebounced()
          break

        case 'global-menu:selectAll':
          this.handleSelectAllDebounced()
          break

        case 'global-menu:undo':
          this.handleUndoDebounced(message)
          break

        case 'global-menu:redo':
          this.handleRedoDebounced(message)
          break
      }
    })

    this.addEmitterListener(this.props.websocket, 'broadcast', (message) => {
      switch (message.name) {
        case 'remote-model:receive-sync':
          BaseModel.receiveSync(message)
          break

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
                from: 'glass'
              })

              if (err) {
                logger.error(err)
                return
              }

              this.getActiveComponent().getArtboard().updateMountSize(this.refs.container)
            })
          } else {
            logger.warn('active component not initialized; cannot reload')
            return
          }

        case 'show-event-handlers-editor':
          this.handleShowEventHandlersEditor(
            message.elid,
            message.opts,
            message.frame
          )
          break
      }
    })

    this._comments.load((err) => {
      if (err) {
        return
      }

      this.setState({ comments: this._comments.comments })
    })

    this.addEmitterListener(window, 'resize', lodash.throttle(() => {
      this.handleWindowResize()
    }), 64)

    this.addEmitterListener(window, 'mouseup', this.windowMouseUpHandler.bind(this))

    this.addEmitterListener(window, 'mousemove', lodash.throttle((mouseMoveEvent) => {
      this.windowMouseMoveHandler(mouseMoveEvent)
    }, 32))

    this.addEmitterListener(window, 'dblclick', this.windowDblClickHandler.bind(this))
    this.addEmitterListener(window, 'keydown', this.windowKeyDownHandler.bind(this))
    this.addEmitterListener(window, 'keyup', this.windowKeyUpHandler.bind(this))
    this.addEmitterListener(window, 'mouseover', this.debouncedWindowMouseOverOutHandler)
    this.addEmitterListener(window, 'mouseout', this.debouncedWindowMouseOverOutHandler)
    // When the mouse is clicked, below is the order that events fire
    this.addEmitterListener(window, 'mousedown', this.windowMouseDownHandler.bind(this))
    this.addEmitterListener(window, 'mouseup', this.windowMouseUpHandler.bind(this))
    this.addEmitterListener(window, 'click', this.windowClickHandler.bind(this))
    this.addEmitterListener(window, 'contextmenu', (contextmenuEvent) => {
      // Don't show the context menu if our editor is open
      if (this.isPreviewMode() || this.state.isEventHandlerEditorOpen) {
        return
      }

      contextmenuEvent.preventDefault()

      this.setState({
        isAnythingScaling: false,
        isAnythingRotating: false,
        isStageSelected: false,
        isStageNameHovering: false,
        isMouseDown: false,
        isMouseDragging: false
      })
    }, false)
  }

  componentWillUnmount () {
    this.removeEmitterListeners()
    this.tourClient.off('tour:requestElementCoordinates', this.handleRequestElementCoordinates)
    this.project.getEnvoyClient().closeConnection()
  }

  handleUndo (payload) {
    if (this.project) {
      mixpanel.haikuTrack('creator:glass:undo')
      Element.unselectAllElements({component: this.getActiveComponent()}, {from: 'glass'})
      this.project.undo({}, {from: 'glass'}, () => {})
    }
  }

  handleRedo (payload) {
    if (this.project) {
      mixpanel.haikuTrack('creator:glass:redo')
      Element.unselectAllElements({component: this.getActiveComponent()}, {from: 'glass'})
      this.project.redo({}, {from: 'glass'}, () => {})
    }
  }

  handleCut () {
    mixpanel.haikuTrack('creator:glass:cut')
    this.fetchProxyElementForSelection().cut({from: 'glass'})
  }

  handleCopy () {
    mixpanel.haikuTrack('creator:glass:copy')
    this.fetchProxyElementForSelection().copy({from: 'glass'})
  }

  handlePaste () {
    mixpanel.haikuTrack('creator:glass:paste')
    const pasteables = ElementSelectionProxy.getPasteables()
    return this.fetchProxyElementForSelection().pasteClipsAndSelect(
      pasteables,
      {from: 'glass'},
      () => {}
    )
  }

  handleDelete () {
    if (this.isPreviewMode()) {
      return
    }

    if (this.getActiveComponent()) {
      mixpanel.haikuTrack('creator:glass:delete-element')
      const proxy = this.fetchProxyElementForSelection()
      proxy.remove()
    }
  }

  handleSelectAll () {
    if (this.getActiveComponent()) {
      mixpanel.haikuTrack('creator:glass:select-all')
      this.getActiveComponent().selectAll({}, {from: 'glass'}, () => {})
    }
  }

  createGroupWithTitle (title) {
    const proxy = this.fetchProxyElementForSelection()
    if (proxy.canGroup()) {
      mixpanel.haikuTrack('creator:glass:group')
      proxy.group({from: 'glass'}, title)
    }
  }

  handleUngroup () {
    const proxy = this.fetchProxyElementForSelection()
    if (proxy.canUngroup()) {
      mixpanel.haikuTrack('creator:glass:ungroup')
      proxy.ungroup({from: 'glass'})
    }
  }

  launchComponentNameModal () {
    this.setState({
      isCreateComponentModalOpen: true
    })
  }

  launchGroupNameModal () {
    this.setState({
      isCreateGroupModalOpen: true
    })
  }

  launchUngroupModal () {
    this.setState({
      isUngroupModalOpen: true
    })
  }

  conglomerateComponentFromSelectedElementsWithTitle (title) {
    const proxy = this.fetchProxyElementForSelection()

    // Our selection becomes invalid as soon as we call this since we're changing
    // the elements that are currently on stage (including our current selection)
    Element.unselectAllElements({
      component: this.getActiveComponent()
    }, { from: 'glass' })

    mixpanel.haikuTrack('creator:glass:create-component', {
      title
    })

    const translation = proxy.getConglomerateTranslation()
    const size = proxy.getConglomerateSize()

    this.getActiveComponent().conglomerateComponent(
      proxy.selection.map((element) => element.getComponentId()),
      title,
      {
        'translation.x': translation.x,
        'translation.y': translation.y,
        'sizeAbsolute.x': size.x,
        'sizeAbsolute.y': size.y,
        'sizeMode.x': 1,
        'sizeMode.y': 1,
        'sizeMode.z': 1
      },
      {from: 'glass'},
      (err) => {
        if (err) logger.error(err)
      }
    )
  }

  editComponent (relpath) {
    // Stop preview mode if it happens to be active when we switch contexts
    this.project.setInteractionMode(0, {from: 'glass'}, (err) => {
      if (err) {
        logger.error(err)
      }

      const ac = this.project.findActiveComponentBySource(relpath)

      if (ac && ac !== this.getActiveComponent()) {
        mixpanel.haikuTrack('creator:glass:edit-component', {
          title: ac.getTitle()
        })

        ac.setAsCurrentActiveComponent({from: 'glass'}, (err) => {
          if (err) {
            logger.error(err)
          }
        })
      }
    })
  }

  handleWindowResize () {
    if (!this.getActiveComponent()) {
      return
    }

    this.resetContainerDimensions()
    this.forceUpdate()
  }

  resetContainerDimensions () {
    this.getActiveComponent().getArtboard().resetContainerDimensions(this.refs.container)
  }

  showEventHandlersEditor (clickEvent, targetElement, options) {
    if (this.isPreviewMode()) {
      return
    }

    mixpanel.haikuTrack('creator:glass:show-event-handlers-editor')
    logger.info(`showing action editor`, targetElement, options)

    this.setState({
      targetElement: targetElement,
      isEventHandlerEditorOpen: true,
      eventHandlerEditorOptions: options
    })
  }

  hideEventHandlersEditor () {
    if (this.editor && this.editor.canBeClosedExternally()) {
      mixpanel.haikuTrack('creator:glass:hide-event-handlers-editor')
      this.setState({
        targetElement: null,
        isEventHandlerEditorOpen: false,
        eventHandlerEditorOptions: {}
      })
    }
  }

  saveEventHandlers (targetElement, serializedEvents) {
    const selectorName = 'haiku:' + targetElement.getComponentId()
    this.getActiveComponent().batchUpsertEventHandlers(selectorName, serializedEvents, { from: 'glass' }, () => {})
  }

  performPan (dx, dy) {
    if (!this.getActiveComponent()) {
      return
    }

    this.getActiveComponent().getArtboard().performPan(dx, dy)
  }

  findElementAssociatedToMouseEvent (mouseEvent) {
    let target = this.findNearestDomSelectionTarget(mouseEvent.target)

    // True if the action was performed on the transform control for a selected element
    if (target === SELECTION_TYPES.ON_STAGE_CONTROL) {
      return
    }

    // True if the action was performed on the stage, but not on any on-stage element
    if (!target || !target.hasAttribute) {
      return
    }

    target = this.validTargetOrNull(target)

    // Truthy if we found a valid, selectable element target
    if (target) {
      // First make sure we are grabbing the correct element based on the context.
      // If we've landed on a component sub-element, we need to go up and select the wrapper.
      let haikuId = target.getAttribute('haiku-id')

      if (this.isDomNodeChildOfComponentWrapperDomNode(target)) {
        haikuId = target.parentNode.getAttribute('haiku-id')
      }

      return this.getActiveComponent().findElementByComponentId(haikuId)
    }
  }

  windowMouseOverOutHandler (mouseEvent) {
    if (this.isPreviewMode() || this.isMarqueeActive()) {
      return
    }

    if (mouseEvent.type === 'mouseover') {
      const element = this.findElementAssociatedToMouseEvent(mouseEvent)

      if (element) {
        if (element.isHovered()) {
          return
        }

        Element.hoverOffAllElements({ component: this.getActiveComponent() }, { from: 'glass' })
        return element.hoverOn({from: 'glass'})
      }
    }

    Element.hoverOffAllElements({ component: this.getActiveComponent() }, { from: 'glass' })
  }

  get areAnyModalsOpen () {
    return this.state.isEventHandlerEditorOpen || this.state.isCreateComponentModalOpen ||
      this.state.isCreateGroupModalOpen || this.state.isUngroupModalOpen
  }

  get shouldNotHandldKeyboardEvents () {
    return this.isPreviewMode() || this.areAnyModalsOpen
  }

  windowMouseMoveHandler (nativeEvent) {
    if (this.areAnyModalsOpen) {
      return
    }

    nativeEvent.preventDefault()
    this.handleMouseMove({ nativeEvent })
  }

  windowMouseUpHandler (nativeEvent) {
    if (this.areAnyModalsOpen) {
      return
    }

    nativeEvent.preventDefault()
    this.handleMouseUp({ nativeEvent })
  }

  windowMouseDownHandler (nativeEvent) {
    if (this.areAnyModalsOpen) {
      return
    }

    nativeEvent.preventDefault()
    this.handleMouseDown({ nativeEvent })
  }

  windowClickHandler (nativeEvent) {
    if (this.shouldNotHandldKeyboardEvents) {
      return
    }

    nativeEvent.preventDefault()
    this.handleClick({ nativeEvent })
  }

  windowDblClickHandler (nativeEvent) {
    if (this.shouldNotHandldKeyboardEvents) {
      return
    }

    nativeEvent.preventDefault()
    this.handleDoubleClick({ nativeEvent })
  }

  windowKeyDownHandler (nativeEvent) {
    if (this.shouldNotHandldKeyboardEvents) {
      return
    }

    this.handleKeyDown({ nativeEvent })
  }

  windowKeyUpHandler (nativeEvent) {
    if (this.shouldNotHandldKeyboardEvents) {
      return
    }

    this.handleKeyUp({ nativeEvent })
  }

  handleMouseDown (mousedownEvent) {
    // Only count left clicks
    if (!this.getActiveComponent() || this.areAnyModalsOpen || mousedownEvent.nativeEvent.button !== 0) {
      return
    }

    if (belongsToMenuIcon(mousedownEvent.nativeEvent.target)) {
      this.openContextMenu(mousedownEvent.nativeEvent)
      return
    }

    this.state.isMouseDown = true
    this.state.lastMouseDownTime = Date.now()
    const mouseDownPosition = this.storeAndReturnMousePosition(mousedownEvent, 'lastMouseDownPosition')

    switch (mousedownEvent.nativeEvent.target.getAttribute('class')) {
      case 'control-point':
        const dataIndex = parseInt(mousedownEvent.nativeEvent.target.getAttribute('data-index'), 10)

        this.controlActivation({
          index: dataIndex,
          event: mousedownEvent.nativeEvent
        })
        break
      case 'origin':
        this.originActivation({event: mousedownEvent.nativeEvent})
        break
      default:
        // We are panning now, so don't un/select anything
        if (Globals.isSpaceKeyDown) {
          return
        }

        const finish = () => {
          this.fetchProxyElementForSelection().pushCachedTransform('CONSTRAINED_DRAG') // wishlist: enum
        }

        if (this.getActiveComponent().getArtboard().getActiveDrawingTool() !== 'pointer') {
          // TODO: Drawing tools
        } else if (!this.isPreviewMode()) {
          let target = this.findNearestDomSelectionTarget(mousedownEvent.nativeEvent.target)

          // True if the user has clicked the transform control for a selected element
          if (target === SELECTION_TYPES.ON_STAGE_CONTROL) {
            return
          }

          // True if the user has clicked on the stage, but not on any on-stage element
          if (!target || !target.hasAttribute) {
            const proxy = this.fetchProxyElementForSelection()
            if (proxy.hasAnythingInSelection() &&
              isCoordInsideBoxPoints(mouseDownPosition.x, mouseDownPosition.y, proxy.getBoxPointsTransformed())) {
              return
            }

            // Unselect all the elements unless the user is doing a meta-operation, as indicated by these keys
            if (!Globals.isShiftKeyDown && !Globals.isSpecialKeyDown() && !Globals.isAltKeyDown) {
              Element.unselectAllElements({ component: this.getActiveComponent() }, { from: 'glass' })
            }

            if (!Globals.isSpecialKeyDown() && !Globals.isAltKeyDown) {
              if (this.getActiveComponent()) {
                this.getActiveComponent().getSelectionMarquee().startSelection(mouseDownPosition)
              }
            }

            return
          }

          target = this.validTargetOrNull(target)

          // Truthy if we found a valid, selectable element target
          if (target) {
            // First make sure we are grabbing the correct element based on the context.
            // If we've landed on a component sub-element, we need to go up and select the wrapper.
            let haikuId = target.getAttribute(HAIKU_ID_ATTRIBUTE)

            if (this.isDomNodeChildOfComponentWrapperDomNode(target)) {
              haikuId = target.parentNode.getAttribute(HAIKU_ID_ATTRIBUTE)
            }

            const elementTargeted = this.getActiveComponent().findElementByComponentId(haikuId)

            if (elementTargeted.isRootElement()) { // The artboard can only be selected alone
              Element.unselectAllElements({component: this.getActiveComponent()}, {from: 'glass'})
              this.ensureElementIsSelected(elementTargeted, finish)
            } else {
              if (!Globals.isControlKeyDown && !Globals.isShiftKeyDown && !Globals.isAltKeyDown) { // none
                this.deselectAllOtherElementsIfTargetNotAmongThem(elementTargeted, () => {
                  this.ensureElementIsSelected(elementTargeted, finish)
                })
              } else if (!Globals.isControlKeyDown && !Globals.isShiftKeyDown && Globals.isAltKeyDown) { // Alt
                this.deselectAllOtherElementsIfTargetNotAmongThem(elementTargeted, () => {
                  this.ensureElementIsSelected(elementTargeted, () => {
                    this.duplicateSelectedElementsThenSelectDuplicates(finish)
                  })
                })
              } else if (!Globals.isControlKeyDown && Globals.isShiftKeyDown && !Globals.isAltKeyDown) { // Shift
                this.toggleMultiElementSelection(elementTargeted, finish)
              } else if (!Globals.isControlKeyDown && Globals.isShiftKeyDown && Globals.isAltKeyDown) { // Shift+Alt
                this.toggleMultiElementSelection(elementTargeted, () => {
                  this.duplicateSelectedElementsThenSelectDuplicates(finish)
                })
              } else if (Globals.isControlKeyDown && !Globals.isShiftKeyDown && !Globals.isAltKeyDown) { // Ctrl
                this.deselectAllOtherElements(elementTargeted, () => {
                  this.ensureElementIsSelected(elementTargeted, finish)
                })
              } else if (Globals.isControlKeyDown && !Globals.isShiftKeyDown && Globals.isAltKeyDown) { // Ctrl+Alt
                this.deselectAllOtherElements(elementTargeted, () => {
                  this.ensureElementIsSelected(elementTargeted, finish)
                })
              } else if (Globals.isControlKeyDown && Globals.isShiftKeyDown && !Globals.isAltKeyDown) { // Ctrl+Shift
                this.ensureElementIsSelected(elementTargeted, finish)
              } else if (Globals.isControlKeyDown && Globals.isShiftKeyDown && Globals.isAltKeyDown) { // Ctrl+Shift+Alt
                this.ensureElementIsSelected(elementTargeted, finish)
              }
            }
          } else {
            // TODO: In what situations can we ever get here?
          }
        }
        break
    }
  }

  validTargetOrNull (target) {
    // If not even a node, we have no valid target
    if (
      !target ||
      !target.hasAttribute
    ) {
      return null
    }

    // If no parent node, we must be too far; no valid target
    if (
      !target.parentNode ||
      !target.parentNode.hasAttribute
    ) {
      return null
    }

    // If our parent is the mount, we're at the target - the top level
    if (this.targetIsMount(target.parentNode)) {
      return target
    }

    // Special case; don't jump to parent if we're in a component wrapper
    if (this.isDomNodeChildOfComponentWrapperDomNode(target)) {
      return target
    }

    // If we don't have selectable metadata, try our parent
    if (!target.hasAttribute(HAIKU_ID_ATTRIBUTE)) {
      return this.validTargetOrNull(target.parentNode)
    }

    // If the parent is valid, we may want to jump up to it;
    // note that we already checked if the parent is the mount above;
    // we don't jump if the next one up is the artboard either
    if (
      target.parentNode.hasAttribute(HAIKU_ID_ATTRIBUTE) &&
      !this.targetIsMount(target.parentNode.parentNode)
    ) {
      return this.validTargetOrNull(target.parentNode)
    }

    // If we got here, we should be the topmost valid target
    return target
  }

  targetIsMount (target) {
    return (
      target === this.refs.mount ||
      target === this.getActiveComponent().getMount().$el()
    )
  }

  deselectAllOtherElementsIfTargetNotAmongThem (target, cb) {
    const selecteds = Element.where({ component: this.getActiveComponent(), _isSelected: true })
    const isAmongSelection = selecteds.indexOf(target) !== -1
    if (!isAmongSelection) {
      selecteds.forEach((element) => {
        if (element !== target) element.unselectSoftly({from: 'glass'})
      })
    }
    return cb()
  }

  deselectAllOtherElements (target, cb) {
    const selecteds = Element.where({ component: this.getActiveComponent(), _isSelected: true })
    selecteds.forEach((element) => {
      if (element !== target) element.unselectSoftly({from: 'glass'})
    })
    return cb()
  }

  ensureElementIsSelected (target, cb) {
    target.selectSoftly({from: 'glass'})
    return cb()
  }

  duplicateSelectedElementsThenSelectDuplicates (cb) {
    const proxy = this.fetchProxyElementForSelection()
    proxy.duplicateAllAndSelectDuplicates({from: 'glass'}, (err, proxyForDuplicates) => {
      if (err) return cb(err)
      return cb()
    })
  }

  toggleMultiElementSelection (target, cb) {
    if (target.isSelected() && this.fetchProxyElementForSelection().hasMultipleInSelection()) {
      target.unselectSoftly({from: 'glass'})
    } else {
      target.selectSoftly({from: 'glass'})
    }
    return cb()
  }

  toggleSelectionStateWithRespectToBox (box) {
    const elements = Element.where({component: this.getActiveComponent()})
      .filter((element) => !element.isRootElement())

    // Note: We don't allow the artboard to be selected as part of multi-selection
    elements.forEach((element) => {
      // We don't want to select elements deeper than the top level
      if (element.getDepthAmongElements() < 2) {
        const overlaps = element.doesOverlapWithBox(box)
        if (overlaps) {
          element.selectSoftly({from: 'glass'})
        } else {
          element.unselectSoftly({from: 'glass'})
        }
      }
    })
  }

  isDomNodeChildOfComponentWrapperDomNode (target) {
    // If the user selected one of the children of a component that has been instantiated on stage
    // we need to actually select the parent (wrapper) element since that's what our component manages
    if (
      target.parentNode &&
      target.parentNode.getAttribute(HAIKU_ID_ATTRIBUTE) &&
      target.parentNode.getAttribute(HAIKU_SOURCE_ATTRIBUTE)
    ) {
      return true
    }
    return false
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
      return SELECTION_TYPES.ON_STAGE_CONTROL
    }

    // Climb the target path to find if a haiku Element has been selected
    // We want to make sure we are not selecting elements at the wrong context level
    while (
      target.hasAttribute &&
      (
        !target.hasAttribute(HAIKU_SOURCE_ATTRIBUTE) || // Only root elements of an instantiated component have this attribute
        !target.hasAttribute(HAIKU_ID_ATTRIBUTE) || // Only haiku elements have this
        !Element.findById(
          Element.buildUidFromComponentAndDomElement(this.getActiveComponent(), target)
        )
      )
    ) {
      target = target.parentNode
    }

    return target
  }

  handleMouseUp (mouseupEvent) {
    if (this.state.isEventHandlerEditorOpen) {
      return void (0)
    }

    if (this.getActiveComponent()) {
      this.getActiveComponent().getSelectionMarquee().endSelection()
    }

    this.storeAndReturnMousePosition(mouseupEvent, 'lastMouseUpPosition')
    this.state.isMouseDown = false
    this.state.lastMouseUpTime = Date.now()
    this.handleDragStop()
    this.setState({
      isAnythingScaling: false,
      isAnythingRotating: false,
      isOriginPanning: false,
      globalControlPointHandleClass: '',
      controlActivation: null
    })

    this.fetchProxyElementForSelection().initializeRotationSnap()
  }

  handleClick (clickEvent) {
    if (this.isPreviewMode()) {
      return void (0)
    }

    if (this.getActiveComponent()) {
      this.getActiveComponent().getSelectionMarquee().endSelection()
    }

    this.storeAndReturnMousePosition(clickEvent)
  }

  handleDoubleClick (doubleClickEvent) {
    if (!this.getActiveComponent()) {
      return
    }

    if (this.isPreviewMode()) {
      return void (0)
    }

    if (this.getActiveComponent()) {
      this.getActiveComponent().getSelectionMarquee().endSelection()
    }

    this.storeAndReturnMousePosition(doubleClickEvent)

    // Only count left clicks or natural trackpad clicks
    if (doubleClickEvent.nativeEvent.button !== 0 || Globals.isControlKeyDown) {
      return
    }

    const target = this.findNearestDomSelectionTarget(doubleClickEvent.nativeEvent.target)
    const source = target && target.getAttribute && target.getAttribute(HAIKU_SOURCE_ATTRIBUTE)

    if (source && source[0] === '.') {
      this.editComponent(source)
    }
  }

  handleDragStart (cb) {
    this.state.isMouseDragging = true
    this.setState({ isMouseDragging: true }, cb)
  }

  handleDragStop (cb) {
    this.state.isMouseDragging = false
    this.setState({ isMouseDragging: false }, cb)
  }

  handleKeyEscape () {
    if (!this.getActiveComponent()) {
      return
    }

    Element.unselectAllElements({ component: this.getActiveComponent() }, { from: 'glass' })
  }

  handleKeyLeftArrow (keyEvent) {
    if (!this.getActiveComponent()) return
    const delta = keyEvent.shiftKey ? 5 : 1
    const proxy = this.fetchProxyElementForSelection()
    proxy.move(-delta, 0)
  }

  handleKeyUpArrow (keyEvent) {
    if (!this.getActiveComponent()) return
    const delta = keyEvent.shiftKey ? 5 : 1
    const proxy = this.fetchProxyElementForSelection()
    proxy.move(0, -delta)
  }

  handleKeyRightArrow (keyEvent) {
    if (!this.getActiveComponent()) return
    const delta = keyEvent.shiftKey ? 5 : 1
    const proxy = this.fetchProxyElementForSelection()
    proxy.move(delta, 0)
  }

  handleKeyDownArrow (keyEvent) {
    if (!this.getActiveComponent()) return
    const delta = keyEvent.shiftKey ? 5 : 1
    const proxy = this.fetchProxyElementForSelection()
    proxy.move(0, delta)
  }

  handleKeyDown (keyEvent) {
    if (this.state.isEventHandlerEditorOpen) {
      return void (0)
    }

    // Cmd + 0 centers & resets zoom
    if (Globals.isSpecialKeyDown() && keyEvent.nativeEvent.which === 48) {
      this.getActiveComponent().getArtboard().resetZoomPan()
    }

    if (this.getActiveComponent()) {
      this.getActiveComponent().getSelectionMarquee().endSelection()
    }

    switch (keyEvent.nativeEvent.which) {
      case 27: this.handleKeyEscape(); break
      case 37: this.handleKeyLeftArrow(keyEvent.nativeEvent); break
      case 38: this.handleKeyUpArrow(keyEvent.nativeEvent); break
      case 39: this.handleKeyRightArrow(keyEvent.nativeEvent); break
      case 40: this.handleKeyDownArrow(keyEvent.nativeEvent); break
      case 46: this.handleDelete(); break
      case 8: this.handleDelete(); break
      case 13: this.handleKeyEnter(); break
      case 16: this.handleKeyShift(keyEvent.nativeEvent); break
      case 17: this.handleKeyCtrl(keyEvent.nativeEvent); break
      case 18: this.handleKeyAlt(keyEvent.nativeEvent); break
      case 224: this.handleKeyCommand(keyEvent.nativeEvent); break
      case 91: this.handleKeyCommand(keyEvent.nativeEvent); break
      case 93: this.handleKeyCommand(keyEvent.nativeEvent); break
    }
  }

  handleKeyUp (keyEvent) {
    if (this.state.isEventHandlerEditorOpen) {
      return
    }

    if (this.getActiveComponent()) {
      this.getActiveComponent().getSelectionMarquee().endSelection()
    }

    switch (keyEvent.nativeEvent.which) {
      case 16: this.handleKeyShift(keyEvent.nativeEvent); break
      case 17: this.handleKeyCtrl(keyEvent.nativeEvent); break
      case 18: this.handleKeyAlt(keyEvent.nativeEvent); break
      case 224: this.handleKeyCommand(keyEvent.nativeEvent); break
      case 91: this.handleKeyCommand(keyEvent.nativeEvent); break
      case 93: this.handleKeyCommand(keyEvent.nativeEvent); break
    }
  }

  handleKeyEnter () {
    // noop for now
  }

  handleKeyCommand (nativeEvent) {
    const controlActivation = this.state.controlActivation
    if (controlActivation) {
      controlActivation.cmd = Globals.isCommandKeyDown
    }
    this.setState({ controlActivation })
  }

  handleKeyShift (nativeEvent) {
    const controlActivation = this.state.controlActivation
    if (controlActivation) {
      controlActivation.shift = Globals.isShiftKeyDown
    }
    this.setState({ controlActivation })
  }

  handleKeyCtrl (nativeEvent) {
    const controlActivation = this.state.controlActivation
    if (controlActivation) {
      controlActivation.ctrl = Globals.isControlKeyDown
    }
    this.setState({ controlActivation })
  }

  handleKeyAlt (nativeEvent) {
    const controlActivation = this.state.controlActivation
    if (controlActivation) {
      controlActivation.alt = Globals.isAltKeyDown
    }
    this.setState({ controlActivation })
  }

  handleClickStageName () {
    if (!this.getActiveComponent()) {
      return
    }

    // Multi-select is not allowed when selecting the stage name
    Element.unselectAllElements({ component: this.getActiveComponent() }, { from: 'glass' })
    const artboard = Element.findRoots({ component: this.getActiveComponent() })[0]
    artboard.select({ from: 'glass' })
  }

  handleMouseOverStageName () {
    // Don't highlight the stage name/artboard boundary if the selection marquee is active
    if (this.isMarqueeActive()) {
      return
    }

    this.setState({ isStageNameHovering: true })
  }

  handleMouseOutStageName () {
    this.setState({ isStageNameHovering: false })
  }

  handleMouseMove (mousemoveEvent) {
    if (!this.getActiveComponent()) {
      return
    }

    if (mousemoveEvent.nativeEvent.target.getAttribute('class') !== 'control-point') {
      this.state.hoveredControlPointIndex = null
    }

    const zoom = this.getActiveComponent().getArtboard().getZoom() || 1
    const pan = this.getActiveComponent().getArtboard().getPan() || {x: 0, y: 0}
    const viewportTransform = {zoom, pan}

    const lastMouseDownPosition = this.state.lastMouseDownPosition
    const mousePositionCurrent = this.storeAndReturnMousePosition(mousemoveEvent)
    const mousePositionPrevious = this.state.mousePositionPrevious || mousePositionCurrent

    const marquee = this.getActiveComponent().getSelectionMarquee()
    if (marquee.isActive()) {
      marquee.moveSelection(mousePositionCurrent)
      const marqueeBox = marquee.getBox()
      this.toggleSelectionStateWithRespectToBox(marqueeBox)
    }

    const dx = mousePositionCurrent.x - mousePositionPrevious.x
    const dy = mousePositionCurrent.y - mousePositionPrevious.y
    if (dx === 0 && dy === 0) return mousePositionCurrent

    // If we got this far, the mouse has changed its position from the most recent mousedown
    if (this.state.isMouseDown) {
      this.handleDragStart()
    }

    if (this.state.isMouseDragging && this.state.isMouseDown) {
      if (Globals.isSpaceKeyDown && this.state.stageMouseDown) {
        this.performPan(
          (mousemoveEvent.nativeEvent.clientX - this.state.stageMouseDown.x) * viewportTransform.zoom,
          (mousemoveEvent.nativeEvent.clientY - this.state.stageMouseDown.y) * viewportTransform.zoom
        )
      } else if (!this.isPreviewMode()) {
        const proxy = this.fetchProxyElementForSelection()

        // Do not drag elements if the user is actively selecting them
        if (!marquee.isActive()) {
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
            Globals
          )
        }
      }
    }

    return mousePositionCurrent
  }

  originActivation ({event}) {
    // TODO: support more modes (and make them discoverable).
    this.setState({
      isOriginPanning: Globals.isSpecialKeyDown()
    })
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
        index: activationInfo.index
      }
    })
  }

  storeAndReturnMousePosition (mouseEvent, additionalPositionTrackingState) {
    if (!this.getActiveComponent()) {
      return
    }

    if (!this.refs.container) {
      return // We haven't mounted yet, no size available
    }

    this.state.mousePositionPrevious = this.state.mousePositionCurrent
    const artboard = this.getActiveComponent().getArtboard()
    const rect = artboard.getRect()
    const zoom = artboard.getZoom()
    this.state.mousePositionCurrent = {
      clientX: mouseEvent.nativeEvent.clientX,
      clientY: mouseEvent.nativeEvent.clientY,
      x: (mouseEvent.nativeEvent.clientX - rect.left) / zoom,
      y: (mouseEvent.nativeEvent.clientY - rect.top) / zoom
    }
    if (additionalPositionTrackingState) this.state[additionalPositionTrackingState] = this.state.mousePositionCurrent
    return this.state.mousePositionCurrent
  }

  drawOverlays () {
    if (!this.getActiveComponent()) {
      return
    }

    if (!this._haikuRenderer) {
      const haikuConfig = Config.build({
        seed: Config.seed(),
        cache: {}
      })

      this._haikuRenderer = new HaikuDOMRenderer(
        this.refs.overlay,
        haikuConfig
      )

      this._haikuContext = new HaikuContext(
        null,
        this._haikuRenderer,
        {},
        {
          template: {
            elementName: 'div',
            attributes: {},
            children: []
          }
        },
        haikuConfig
      )
    }

    // When we enter preview mode, this ref element is not rendered, i.e.
    // removed from the DOM. When we exit preview mode, a new element is
    // created, meaning that our original mount element has been detached.
    // We need to reassign the new, attached DOM node so the transform
    // controls render again after we exit preview mode.
    this._haikuRenderer.mount = this.refs.overlay

    const container = {
      layout: {
        computed: {x: 1, y: 1}
      }
    }

    const artboard = this.getActiveComponent().getArtboard()

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
          height: artboard.getMountHeight() + 'px'
        }
      },
      children: [
        {
          'elementName': 'svg',
          attributes: {
            style: {
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              overflow: 'visible'
            }
          },
          children: this.buildDrawnOverlays()
        }
      ]
    }

    this._haikuRenderer.render(
      container,
      overlay,
      this._haikuContext.component
    )
  }

  // This method creates objects which represent Haiku Core rendering instructions for displaying all of
  // the visual effects that sit above the stage. (Transform controls, etc.) The Haiku Core is sort of a
  // hybrid of React Fiber and Famous Engine. It has a virtual DOM tree of elements like {elementName: 'div', attributes: {}, []},
  // and flushes updates to them on each frame. So what _this method_ does is just build those objects and then
  // these get passed into a Haiku Core render method (see above). LONG STORY SHORT: This creates a flat list of
  // nodes that get rendered to the DOM by the Haiku Core.
  buildDrawnOverlays () {
    const overlays = []

    // Don't show any overlays if we're in preview (aka 'live') interactionMode
    if (this.isPreviewMode()) {
      return overlays
    }

    const proxy = this.fetchProxyElementForSelection()

    if (proxy.hasAnythingInSelection()) {
      this.renderTransformBoxOverlay(
        proxy,
        overlays,
        !this.state.isOriginPanning && Globals.isSpecialKeyDown()
      )
    }

    this.renderSelectionMarquee(overlays)
    this.renderOutline(overlays)
    return overlays
  }

  fetchProxyElementForSelection () {
    const selection = Element.where({ component: this.getActiveComponent(), _isSelected: true })
    const proxy = ElementSelectionProxy.fromSelection(selection, { component: this.getActiveComponent() })
    return proxy
  }

  renderOutline (overlays) {
    if (
      !experimentIsEnabled(Experiment.OutliningElementsOnStage) ||
      this.isPreviewMode() ||
      this.isMarqueeActive()
    ) {
      return
    }

    const activeComponent = this.getActiveComponent()
    if (activeComponent) {
      const hoveredElement = Element.findHoveredElement(activeComponent)

      if (hoveredElement && !hoveredElement.isSelected()) {
        const points = hoveredElement.getBoxPointsTransformed()
        overlays.push(
          boxMana(
            [points[0], points[2], points[8], points[6]].map(point => [
              point.x,
              point.y
            ]),
            Palette.LIGHT_PINK
          )
        )
      }
    }
  }

  renderSelectionMarquee (overlays) {
    if (this.getActiveComponent()) {
      const marquee = this.getActiveComponent().getSelectionMarquee()

      if (marquee.isActive()) {
        const {
          x,
          y,
          width,
          height
        } = marquee.getBox()

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
            fill: Palette.ROCK,
            'fill-opacity': 0.25,
            rx: 1,
            ry: 1,
            style: {
              pointerEvents: 'none'
            }
          }
        })
      }
    }
  }

  openContextMenu (event) {
    if (this.isPreviewMode()) {
      return
    }

    event.preventDefault()
    event.stopPropagation()

    PopoverMenu.launch({
      event,
      items: this.getContextMenuItems()
    })
  }

  renderTransformBoxOverlay (proxy, overlays, isRotationModeOn) {
    if (!this.getActiveComponent()) {
      return
    }

    overlays.push(defsMana)

    const zoom = this.getActiveComponent().getArtboard().getZoom()
    const points = proxy.getBoxPointsTransformed()

    // If the size is smaller than a threshold, only display the corners.
    // And if it is smaller even than that, don't display the points at all
    const dx = Element.distanceBetweenPoints(points[0], points[2], zoom)
    const dy = Element.distanceBetweenPoints(points[0], points[6], zoom)

    let pointDisplayMode = POINT_DISPLAY_MODES.NORMAL

    if (dx < POINTS_THRESHOLD_NONE || dy < POINTS_THRESHOLD_NONE) {
      pointDisplayMode = POINT_DISPLAY_MODES.NONE
    } else if (dx < POINTS_THRESHOLD_REDUCED && dy < POINTS_THRESHOLD_REDUCED) {
      pointDisplayMode = POINT_DISPLAY_MODES.REDUCED_ON_BOTH
    } else if (dx < POINTS_THRESHOLD_REDUCED && dy >= POINTS_THRESHOLD_REDUCED) {
      pointDisplayMode = POINT_DISPLAY_MODES.REDUCED_ON_TOP_BOTTOM
    } else if (dx >= POINTS_THRESHOLD_REDUCED && dy < POINTS_THRESHOLD_REDUCED) {
      pointDisplayMode = POINT_DISPLAY_MODES.REDUCED_ON_LEFT_RIGHT
    }

    const scale = 1 / (zoom || 1)
    const canRotate = proxy.canRotate()
    const canControlHandles = proxy.canControlHandles()
    const origin = proxy.getOriginTransformed()

    if (pointDisplayMode !== POINT_DISPLAY_MODES.NONE) {
      overlays.push(boxMana([points[0], points[2], points[8], points[6]].map((point) => [point.x, point.y])))
      overlays.push(gearMana(scale, proxy.getControlsPosition(5, 30 * scale, 1 * scale)))
    }

    points.forEach((point, index) => {
      if (!pointDisplayMode[index]) {
        return
      }

      if (index !== 4) {
        overlays.push(controlPointMana(
          scale,
          point,
          index,
          canControlHandles ? 'none' : this.getCursorCssRule()
        ))
      }
    })

    if (canRotate && pointDisplayMode !== POINT_DISPLAY_MODES.NONE) {
      overlays.push(originMana(scale, origin.x, origin.y, Globals.isSpecialKeyDown()))
    }

    // Everything below requires controllable handles.
    if (!canControlHandles || this.state.isOriginPanning) {
      return
    }

    if (canRotate && (
      (this.state.hoveredControlPointIndex !== null && isRotationModeOn) ||
      this.state.isAnythingRotating
    )) {
      overlays.push(rotationCursorMana(scale, this.state.mousePositionCurrent, origin))
    } else if (this.state.isAnythingScaling ||
      (this.state.hoveredControlPointIndex !== null && !this.state.isMouseDown)
    ) {
      overlays.push(scaleCursorMana(
        scale,
        this.state.mousePositionCurrent,
        points,
        origin,
        this.state.controlActivation ? this.state.controlActivation.index : this.state.hoveredControlPointIndex,
        Globals.isAltKeyDown
      ))
    }
  }

  getCSSTransform (zoom, pan) {
    return 'matrix3d(' +
      [zoom.x, 0, 0, 0,
        0, zoom.y, 0, 0,
        0, 0, 1, 0,
        pan.x / zoom.x, pan.y / zoom.x, 0, 1].join(',') + ')'
  }

  isPreviewMode () {
    if (!this.getActiveComponent()) {
      return false
    }
    return this.getActiveComponent().isPreviewModeActive()
  }

  isMarqueeActive () {
    return this.getActiveComponent() && this.getActiveComponent().getSelectionMarquee().isActive()
  }

  getCursorCssRule () {
    if (this.isPreviewMode()) return 'default'
    if (this.state.isAnythingRotating || this.state.isAnythingScaling) return 'none'
    return (this.state.stageMouseDown) ? '-webkit-grabbing' : 'default'
  }

  renderHotComponentMount (mount, drawingClassName) {
    return (
      <div
        ref='mount'
        key='haiku-mount-container'
        id='haiku-mount-container'
        className={`${drawingClassName} no-select`}
        style={{
          position: 'absolute',
          left: mount.x,
          top: mount.y,
          width: mount.w,
          height: mount.h,
          overflow: this.isPreviewMode() ? 'hidden' : 'visible',
          zIndex: 60,
          opacity: (this.state.isEventHandlerEditorOpen) ? 0.5 : 1.0
        }} />
    )
  }

  getContainerHeight () {
    if (!this.getActiveComponent()) return 1
    return this.getActiveComponent().getArtboard().getContainerHeight()
  }

  getArtboardRenderInfo () {
    if (!this.getActiveComponent()) {
      // Pretty hack to put this here, but we have to render _something_ or else the
      // Glass won't initialize properly due to the way it is currently set up.
      // TODO: Make glass more accepting of situations where there is no component
      return {
        drawingClassName: '',
        pan: { x: 0, y: 0 },
        zoom: { x: 1, y: 1 },
        container: { x: 1, y: 1, w: 1, h: 1 },
        mount: { x: 1, y: 1, w: 1, h: 1 }
      }
    }

    return this.getActiveComponent().getArtboard().getArtboardRenderInfo()
  }

  getContextMenuItems () {
    const items = []

    const proxy = this.fetchProxyElementForSelection()

    if (experimentIsEnabled(Experiment.CommentsOnStage)) {
      items.push({
        label: (this.state.doShowComments)
          ? 'Hide Comments'
          : 'Show Comments',
        enabled: this.state.comments && this.state.comments.length > 0,
        onClick: () => {
          this.setState({ doShowComments: !this.state.doShowComments })
        }
      })

      items.push({
        label: 'Add Comment',
        onClick: () => {
          this._comments.build({
            x: this.state.mousePositionCurrent.x,
            y: this.state.mousePositionCurrent.y
          })

          this.setState({ comments: this._comments.comments, doShowComments: true })
        }
      })

      items.push({ type: 'separator' })
    }

    if (experimentIsEnabled(Experiment.MultiComponentFeatures)) {
      items.push({
        label: 'Create Component',
        // If a single element is already a component, we don't let it be created as one
        enabled: proxy.canCreateComponentFromSelection(),
        onClick: () => {
          mixpanel.haikuTrack('creator:glass:launch-create-component-modal')
          this.launchComponentNameModal()
        }
      })

      items.push({
        label: 'Edit Component',
        enabled: proxy.canEditComponentFromSelection(),
        onClick: () => {
          this.editComponent(proxy.getSingleComponentElementRelpath())
        }
      })

      items.push({ type: 'separator' })
    }

    items.push({
      label: 'Edit Element Actions',
      enabled: proxy.doesManageSingleElement(),
      onClick: (event) => {
        this.showEventHandlersEditor(event, proxy.selection[0])
      }
    })

    items.push({ type: 'separator' })

    items.push({
      label: 'Open in Finder',
      enabled: proxy.isSelectionFinderOpenable(),
      onClick: () => {
        mixpanel.haikuTrack('creator:glass:open-in-finder')
        shell.openItem(proxy.getAbspath())
      }
    })

    // Only display Edit In Sketch on mac
    if (isMac()) {
      items.push({
        label: 'Edit in Sketch',
        enabled: proxy.isSelectionSketchEditable(),
        onClick: () => {
          mixpanel.haikuTrack('creator:glass:edit-in-sketch')
          shell.openItem(path.join(this.props.folder, proxy.getSketchAssetPath()))
        }
      })
    }

    items.push({
      label: 'Edit in Figma',
      enabled: proxy.isSelectionFigmaEditable(),
      onClick: () => {
        mixpanel.haikuTrack('creator:glass:edit-in-figma')
        shell.openExternal(proxy.getFigmaAssetLink())
      }
    })

    items.push({ type: 'separator' })

    items.push({
      label: 'Cut',
      enabled: proxy.canCut(),
      onClick: () => {
        this.handleCut()
      }
    })

    items.push({
      label: 'Copy',
      enabled: proxy.canCopy(),
      onClick: () => {
        this.handleCopy()
      }
    })

    items.push({
      label: 'Paste',
      enabled: proxy.canPaste(),
      onClick: (event) => {
        this.handlePaste()
      }
    })

    items.push({ type: 'separator' })

    if (experimentIsEnabled(Experiment.GroupUngroup)) {
      items.push({
        label: 'Group',
        enabled: proxy.canGroup(),
        onClick: () => {
          mixpanel.haikuTrack('creator:glass:launch-create-group-modal')
          this.launchGroupNameModal()
        }
      })

      items.push({
        label: 'Ungroup',
        enabled: proxy.canUngroup(),
        onClick: () => {
          this.launchUngroupModal()
        }
      })

      items.push({ type: 'separator' })
    }

    items.push({
      label: 'Delete',
      enabled: proxy.canDelete(),
      onClick: () => {
        this.handleDelete()
      }
    })

    items.push({ type: 'separator' })

    items.push({
      label: 'Forward',
      enabled: proxy.canBringForward(),
      onClick: () => {
        mixpanel.haikuTrack('creator:glass:bring-forward')
        proxy.bringForward()
      }
    })

    items.push({
      label: 'Backward',
      enabled: proxy.canSendBackward(),
      onClick: () => {
        mixpanel.haikuTrack('creator:glass:send-backward')
        proxy.sendBackward()
      }
    })

    items.push({
      label: 'Bring to Front',
      enabled: proxy.canBringToFront(),
      onClick: () => {
        mixpanel.haikuTrack('creator:glass:bring-to-front')
        proxy.bringToFront()
      }
    })

    items.push({
      label: 'Send to Back',
      enabled: proxy.canSendToBack(),
      onClick: () => {
        mixpanel.haikuTrack('creator:glass:send-to-back')
        proxy.sendToBack()
      }
    })

    items.push({ type: 'separator' })

    items.push({
      label: 'Copy SVG',
      enabled: proxy.canCopySVG(),
      onClick: (event) => {
        mixpanel.haikuTrack('creator:glass:copy-svg')
        clipboard.writeText(proxy.copySVG())
      }
    })

    items.push({
      label: 'HTML Snapshot',
      enabled: proxy.canHTMLSnapshot(),
      onClick: (event) => {
        mixpanel.haikuTrack('creator:glass:html-snapshot')
        this.getActiveComponent().htmlSnapshot((err, html) => {
          if (err) {
            return
          }

          clipboard.writeText(html)
          writeHtmlSnapshot(html, this)
        })
      }
    })

    if (process.env.NODE_ENV !== 'production') {
      items.push({ type: 'separator' })

      items.push({
        label: 'Inspect Element',
        enabled: proxy.doesManageSingleElement(),
        onClick: (event) => {
          if (remote) {
            remote.getCurrentWindow().openDevTools()

            this.getActiveComponent().devConsole.logBanner()

            const publicComponentModel = this.getActiveComponent().$instance
            const internalElementModel = proxy.getElement()

            if (publicComponentModel && internalElementModel) {
              const publicElementModel = publicComponentModel.querySelector(`haiku:${internalElementModel.getComponentId()}`)
              window.element = publicElementModel
              console.log('element', publicElementModel)
              console.log('element.target', publicElementModel.target)
            }
          }
        }
      })
    }

    return items
  }

  render () {
    const {
      drawingClassName,
      pan,
      zoom,
      container,
      mount
    } = this.getArtboardRenderInfo()

    return (
      <div
        id='stage-root'
        style={{
          width: '100%',
          height: '100%',
          visibility: (this.getActiveComponent()) ? 'visible' : 'hidden',
          cursor: this.getCursorCssRule(),
          backgroundColor: (this.isPreviewMode()) ? 'white' : 'inherit'
        }}

        onMouseDown={(mouseDown) => {
          const targetId = mouseDown.nativeEvent.target && mouseDown.nativeEvent.target.id

          if (
              targetId === 'stage-root' ||
              targetId === 'full-background' ||
              targetId === 'haiku-glass-stage-container' ||
              targetId === 'haiku-glass-stage-background-live' ||
              targetId === 'haiku-glass-stage-background-preview' ||
              targetId === 'haiku-glass-stage-background-preview-border'
            ) {
            // If unselecting anything except an actual element, assume we want to deselect all
            Element.unselectAllElements({ component: this.getActiveComponent() }, { from: 'glass' })
          }

          if (this.state.isEventHandlerEditorOpen) {
            this.hideEventHandlersEditor()
          }

          if (this.getActiveComponent() && !this.isPreviewMode()) {
            this.getActiveComponent().getArtboard().snapshotOriginalPan()
          }

          this.setState({
            stageMouseDown: {
              x: mouseDown.nativeEvent.clientX,
              y: mouseDown.nativeEvent.clientY
            }
          })
        }}
        onContextMenu={(event) => {
          this.openContextMenu(event)
        }}
        onMouseUp={() => {
          this.setState({ stageMouseDown: null })
        }}
        onMouseLeave={() => {
          this.setState({ stageMouseDown: null })
        }}>

        {(!this.isPreviewMode())
          ? <div
            id='zoom-indicator'
            className='no-select'
            style={{
              position: 'fixed',
              top: 5,
              right: 10,
              zIndex: 100000,
              color: '#ccc',
              fontSize: 14
            }}>
            {Math.round(zoom.x / 1 * 100)}%
            </div>
          : ''}

        {!this.isPreviewMode() &&
          <EventHandlerEditor
            element={this.state.targetElement}
            save={(targetElement, serializedEvent) => {
              this.saveEventHandlers(targetElement, serializedEvent)
            }}
            close={() => { this.hideEventHandlersEditor() }}
            visible={this.state.isEventHandlerEditorOpen}
            options={this.state.eventHandlerEditorOptions}
            ref={(editor) => { this.editor = editor }}
          />
        }

        {!this.isPreviewMode() && this.state.isCreateComponentModalOpen &&
          <CreateComponentModal
            isOpen={this.state.isCreateComponentModalOpen}
            existingComponentNames={this.project.getExistingComponentNames()}
            onSubmit={(componentName) => {
              this.setState({
                isCreateComponentModalOpen: false
              }, () => {
                this.conglomerateComponentFromSelectedElementsWithTitle(componentName)
              })
            }}
            onCancel={() => {
              this.setState({
                isCreateComponentModalOpen: false
              })
            }}
          />
        }

        {!this.isPreviewMode() && this.state.isCreateGroupModalOpen &&
          <CreateGroupModal
            groupName={this.getActiveComponent().nextSuggestedGroupName}
            onSubmit={(groupName) => {
              this.setState({
                isCreateGroupModalOpen: false
              }, () => {
                this.createGroupWithTitle(groupName)
              })
            }}
            onCancel={() => {
              this.setState({
                isCreateGroupModalOpen: false
              })
            }}
          />
        }

        {!this.isPreviewMode() && this.state.isUngroupModalOpen &&
          <UngroupModal
            onSubmit={(groupName) => {
              this.setState({
                isUngroupModalOpen: false
              }, () => {
                this.handleUngroupDebounced()
              })
            }}
            onCancel={() => {
              this.setState({
                isUngroupModalOpen: false
              })
            }}
          />
        }

        <div
          ref='container'
          id='haiku-glass-stage-container'
          style={{
            width: '100%',
            height: '100%',
            overflow: 'visible',
            position: 'absolute',
            top: 0,
            left: 0,
            transform: this.getCSSTransform(zoom, pan),
            backgroundColor: 'inherit'
          }}>

          {(!this.isPreviewMode())
            ? <svg
              id='haiku-glass-stage-background-live'
              style={{
                position: 'absolute',
                top: container.y,
                left: container.x,
                width: container.w,
                height: container.h,
                overflow: 'visible'
              }}>
              <defs>
                <filter id='background-blur' x='-50%' y='-50%' width='200%' height='200%'>
                  <feGaussianBlur in='SourceAlpha' stdDeviation='2' result='blur' />
                  <feFlood floodColor='rgba(33, 45, 49, .5)' floodOpacity='0.8' result='offsetColor' />
                  <feComposite in='offsetColor' in2='blur' operator='in' result='totalBlur' />
                  <feBlend in='SourceGraphic' in2='totalBlur' mode='normal' />
                </filter>
              </defs>
              <rect id='full-background' x={container.x} y={container.y} width={container.w} height={container.w} fill='transparent' />
              <rect id='mount-background-blur' filter='url(#background-blur)' x={mount.x} y={mount.y} width={mount.w} height={mount.h} fill='white' />
              <rect id='mount-background' x={mount.x} y={mount.y} width={mount.w} height={mount.h} fill='white' />
            </svg>
            : <div
              id='haiku-glass-stage-background-preview'
              style={{
                position: 'relative',
                top: container.y,
                left: container.x,
                width: container.w,
                height: container.h
              }}>
              <div
                id='haiku-glass-stage-background-preview-border'
                style={{
                  position: 'absolute',
                  top: mount.y,
                  left: mount.x,
                  width: mount.w,
                  height: mount.h,
                  border: '1px dotted #bbb',
                  borderRadius: '2px'
                }} />
            </div>}

          {(!this.isPreviewMode())
            ? <svg
              id='haiku-glass-stage-title-text-container'
              style={{
                position: 'absolute',
                zIndex: 10,
                top: mount.y - 19,
                left: mount.x + 2,
                height: 20,
                width: mount.w,
                userSelect: 'none',
                cursor: 'default'
              }}
              onClick={this.handleClickStageName.bind(this)}
              onMouseOver={this.handleMouseOverStageName.bind(this)}
              onMouseOut={this.handleMouseOutStageName.bind(this)}>
              <text
                y='13'
                id='project-name'
                fill={Palette.FATHER_COAL}
                fontWeight='lighter'
                fontFamily='Fira Sans'
                fontSize='13'>
                {`${this.props.userconfig.project || '[n/a]'} (${(this.getActiveComponent() && this.getActiveComponent().getTitle()) || '…'})`}
              </text>
            </svg>
            : ''}

          {(!this.isPreviewMode())
            ? <svg
              id='haiku-glass-opacitator'
              style={{
                position: 'absolute',
                top: container.y,
                left: container.x,
                zIndex: 20,
                width: container.w,
                height: container.h,
                pointerEvents: 'none',
                overflow: 'visible'
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
                  overflow: 'visible'
                }} />
            </svg>
            : ''}

          {(!this.isPreviewMode())
            ? <svg
              id='haiku-glass-stage-border'
              style={{
                position: 'absolute',
                top: container.y,
                left: container.x,
                zIndex: 1010,
                width: container.w,
                height: container.h,
                pointerEvents: 'none',
                overflow: 'visible'
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
                  'fill': '#FFF',
                  'opacity': 0.5,
                  'pointerEvents': 'none'
                }} />
              {/* draw the red border around the stage when selected */}
              <rect
                x={mount.x - 1}
                y={mount.y - 1}
                width={mount.w + 2}
                height={mount.h + 2}
                style={{
                  strokeWidth: 1.5,
                  fill: 'none',
                  stroke: Palette.LIGHT_PINK,
                  opacity: this.state.isStageNameHovering && !this.state.isStageSelected ? 0.75 : 0,
                  overflow: 'visible'
                }}
                />
            </svg>
            : ''}

          {(!this.isPreviewMode() && this.state.doShowComments && this.state.comments.length > 0)
            ? <div
              id='haiku-glass-comments-container'
              style={{
                position: 'absolute',
                pointerEvents: 'none',
                top: container.y,
                left: container.x,
                zIndex: 2000,
                overflow: 'hidden',
                width: '100%',
                height: '100%' }}
                >
              {this.getActiveComponent() && this.state.comments.map((comment, index) => {
                return (
                  <Comment
                    index={index}
                    comment={comment}
                    x={comment.x + this.getActiveComponent().getArtboard().getMountX()}
                    y={comment.y + this.getActiveComponent().getArtboard().getMountY()}
                    key={`comment-${comment.id}`}
                    model={this._comments} />
                )
              })}
            </div>
            : ''}

          {(!this.isPreviewMode())
            ? <div
              ref='overlay'
              id='haiku-glass-overlay-mount'
              style={{
                transform: 'matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1)',
                pointerEvents: 'none', // This needs to be un-set for surface elements that take mouse interaction
                width: container.w,
                height: this.getContainerHeight(),
                position: 'absolute',
                overflow: 'visible',
                top: container.y,
                left: container.x,
                zIndex: 1999,
                opacity: (this.state.isEventHandlerEditorOpen) ? 0.5 : 1.0
              }} />
            : ''}

          {this.renderHotComponentMount(mount, drawingClassName)}

          {(!this.isPreviewMode())
            ? <div
              ref='outline'
              id='haiku-glass-outline-mount'
              style={{
                position: 'absolute',
                pointerEvents: 'none',
                left: mount.x,
                top: mount.y,
                width: mount.w,
                height: mount.h,
                overflow: this.isPreviewMode() ? 'hidden' : 'visible',
                zIndex: 60,
                opacity: (this.state.isEventHandlerEditorOpen) ? 0.5 : 1.0
              }} />
            : ''}
        </div>
      </div>
    )
  }
}

function belongsToMenuIcon (target) {
  if (!target || !target.getAttribute) {
    return false
  }

  if (target.getAttribute('id') === 'element-menu-icon-wrapper') {
    return true
  }

  return belongsToMenuIcon(target.parentNode)
}

Glass.propTypes = {
  userconfig: React.PropTypes.object,
  websocket: React.PropTypes.object,
  folder: React.PropTypes.string
}

export default Radium(Glass)
