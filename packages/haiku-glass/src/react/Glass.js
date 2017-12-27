import React from 'react'
import lodash from 'lodash'
import Radium from 'radium'
import path from 'path'
import HaikuDOMRenderer from '@haiku/player/lib/renderers/dom'
import HaikuContext from '@haiku/player/lib/HaikuContext'
import Project from 'haiku-serialization/src/bll/Project'
import Config from '@haiku/player/lib/Config'
import Element from 'haiku-serialization/src/bll/Element'
import Design from 'haiku-serialization/src/bll/Design'
import Asset from 'haiku-serialization/src/bll/Asset'
import ModuleWrapper from 'haiku-serialization/src/bll/ModuleWrapper'
import EmitterManager from 'haiku-serialization/src/utils/EmitterManager'
import react2haiku from 'haiku-serialization/src/utils/react2haiku'
import Palette from 'haiku-ui-common/lib/Palette'
import Comment from './Comment'
import EventHandlerEditor from './components/EventHandlerEditor'
import Comments from './Comments'
import PopoverMenu from 'haiku-ui-common/lib/electron/PopoverMenu'
import getLocalDomEventPosition from 'haiku-ui-common/lib/helpers/getLocalDomEventPosition'
import requestElementCoordinates from 'haiku-serialization/src/utils/requestElementCoordinates'
import {GearSVG} from 'haiku-ui-common/lib/react/OtherIcons'
import { Experiment, experimentIsEnabled } from 'haiku-common/lib/experiments'

const Globals = require('haiku-ui-common/lib/Globals').default
const { clipboard, shell } = require('electron')
const fse = require('haiku-fs-extra')
const moment = require('moment')
const { HOMEDIR_PATH } = require('haiku-serialization/src/utils/HaikuHomeDir')

fse.mkdirpSync(HOMEDIR_PATH)

// Useful debugging originator of calls in shared model code
process.env.HAIKU_SUBPROCESS = 'glass'

const CLOCKWISE_CONTROL_POINTS = {
  0: [0, 1, 2, 5, 8, 7, 6, 3],
  1: [6, 7, 8, 5, 2, 1, 0, 3], // flipped vertical
  2: [2, 1, 0, 3, 6, 7, 8, 5], // flipped horizontal
  3: [8, 7, 6, 3, 0, 1, 2, 5] // flipped horizontal + vertical
}

const POINTS_THRESHOLD_REDUCED = 65 // Display only the corner control points
const POINTS_THRESHOLD_NONE = 15 // Display no control points nor line

const POINT_DISPLAY_MODES = {
  NORMAL: [1, 1, 1, 1, 1, 1, 1, 1, 1],
  REDUCED_ON_TOP_BOTTOM: [1, 0, 1, 1, 0, 1, 1, 0, 1],
  REDUCED_ON_LEFT_RIGHT: [1, 1, 1, 0, 0, 0, 1, 1, 1],
  REDUCED_ON_BOTH: [1, 0, 1, 0, 0, 0, 1, 0, 1],
  NONE: [0, 0, 0, 0, 0, 0, 0, 0, 0]
}

const LINE_DISPLAY_MODES = {
  NORMAL: 1,
  NONE: 2
}

const SELECTION_TYPES = {
  ON_STAGE_CONTROL: 'on_stage_control'
}

const BIG_NUMBER = 99999

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

const GEAR_REACT = GearSVG({color: Palette.DARKER_ROCK2})
const GEAR_HAIKU = react2haiku(GEAR_REACT)

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

    this._comments = new Comments(this.props.folder)

    this._playing = false
    this._stopwatch = null
    this._lastAuthoritativeFrame = 0

    this._lastSelectedElement = null
    this._clipboardActionLock = false

    this.drawLoop = this.drawLoop.bind(this)
    this.draw = this.draw.bind(this)

    const haikuConfig = Config.build({
      options: {
        seed: Config.seed(),
        cache: {}
      }
    })
    this._haikuRenderer = new HaikuDOMRenderer(haikuConfig)
    this._haikuContext = new HaikuContext(
      null,
      this._haikuRenderer,
      {},
      { timelines: {}, template: { elementName: 'div', attributes: {}, children: [] } },
      haikuConfig
    )

    this.handleRequestElementCoordinates = this.handleRequestElementCoordinates.bind(this)
    this.openContextMenu = this.openContextMenu.bind(this)
    this.elementContextMenuButton = {
      elementName: 'div',
      attributes: {
        id: `element-menu-icon-wrapper`,
        onmousedown: this.openContextMenu,
        style: {
          position: 'absolute',
          pointerEvents: 'auto',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          left: '0px', // overwritten later
          top: '0px', // overwritten later
          border: '1px solid ' + Palette.DARKER_ROCK2,
          backgroundColor: 'transparent',
          boxShadow: '0 2px 6px 0 ' + Palette.SHADY, // TODO: account for rotation
          width: '0px', // overwritten later
          height: '0px', // overwritten later
          borderRadius: '50%',
          cursor: 'pointer'
        }
      },
      children: [
        GEAR_HAIKU
      ]
    }

    // For debugging
    window.glass = this

    // TODO: Is there any race condition with kicking this off immediately?
    this.drawLoop()
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

    this.addEmitterListenerIfNotAlreadyRegistered(this.project, 'envoy:glassClientReady', (glassChannel) => {
      glassChannel.on('cut', () => { this.handleVirtualClipboard('cut') })
      glassChannel.on('copy', () => { this.handleVirtualClipboard('copy') })
    })

    this.addEmitterListenerIfNotAlreadyRegistered(this.project, 'envoy:tourClientReady', (client) => {
      this.tourClient = client
      this.tourClient.on('tour:requestElementCoordinates', this.handleRequestElementCoordinates)
    })

    this.addEmitterListenerIfNotAlreadyRegistered(this.project, 'update', (what, ...args) => {
      switch (what) {
        case 'setCurrentActiveComponent':
          this.handleActiveComponentReady()
          break
        case 'application-mounted':
          this.handleHaikuComponentMounted()
          break
        case 'element-selected':
          this.setLastSelectedElement(args[0])
          break
        case 'element-unselected':
          this.setLastSelectedElement(null)
          break
        case 'dimensions-changed':
          this.resetContainerDimensions()
          this.forceUpdate()
          break
      }
    })

    this.addEmitterListenerIfNotAlreadyRegistered(this.project, 'remote-update', (what, ...args) => {
      switch (what) {
        case 'setCurrentActiveComponent':
          this.handleActiveComponentReady()
          break
        case 'selectElement':
          this.setLastSelectedElement(this.getActiveComponent().findElementByComponentId(args[0]))
          break
        case 'unselectElement':
          this.setLastSelectedElement(null)
          break
        case 'setInteractionMode':
          this.handleInteractionModeChange()
          break
      }
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
    // This fires when the context menu cut/copy action has been fired - not a keyboard action.
    // This fires with cut OR copy. In case of cut, the element has already been .cut()!
    this.addEmitterListener(this.getActiveComponent(), 'element:copy', (element) => {
      if (this.isPreviewMode()) return
      this.setLastSelectedElement(element)
      this.handleVirtualClipboard('copy')
    })

    this.mountHaikuComponent()
  }

  mountHaikuComponent () {
    this.awaitRef('mount', (ref) => {
      this.getActiveComponent().mountApplication(ref, {
        options: {
          freeze: true,
          overflowX: 'visible',
          overflowY: 'visible',
          contextMenu: 'disabled'
        },
        reloadMode: ModuleWrapper.RELOAD_MODES.MONKEYPATCHED_OR_ISOLATED
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
    }

    this.getActiveComponent().getCurrentTimeline().togglePreviewPlayback(this.isPreviewMode())

    this.forceUpdate()
  }

  handleShowEventHandlersEditor (elementUID, options, frame) {
    this.setLastSelectedElement(this.getActiveComponent().findElementByUid(elementUID))

    // The EventHandlerEditor uses this field to know whether to launch in frame mode vs event mode
    if (frame) options.frame = frame

    this.showEventHandlersEditor(null, this.getLastSelectedElement(), options)
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
    this._playing = true
    this._stopwatch = Date.now()
  }

  handleTimelineDidPause (frameData) {
    this._playing = false
    this._lastAuthoritativeFrame = frameData.frame
    this._stopwatch = Date.now()
  }

  handleTimelineDidSeek (frameData) {
    this._lastAuthoritativeFrame = frameData.frame
    this._stopwatch = Date.now()
  }

  handleFrameChange () {
    let seekMs = 0

    // this._stopwatch is null unless we've received an action from the timeline.
    // If we're developing the glass solo, i.e. without a connection to envoy which
    // provides the system clock, we can just lock the time value to zero as a hack.
    // TODO: Would be nice to allow full-fledged solo development of glass...
    if (this._stopwatch !== null) {
      const fps = 60 // TODO:  support variable
      const baseMs = this._lastAuthoritativeFrame * 1000 / fps
      const deltaMs = (this._playing) ? Date.now() - this._stopwatch : 0
      seekMs = baseMs + deltaMs
    }

    // This rounding is required otherwise we'll see bizarre behavior on stage.
    // I think it's because some part of the player's caching or transition logic
    // which wants things to be round numbers. If we don't round this, i.e. convert
    // 16.666 -> 17 and 33.333 -> 33, then the player won't render those frames,
    // which means the user will have trouble moving things on stage at those times.
    seekMs = Math.round(seekMs)

    if (this.getActiveComponent()) {
      this.getActiveComponent().setTimelineTimeValue(seekMs, true)
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
    window.addEventListener('dragover', Asset.preventDefaultDrag, false)

    window.addEventListener(
      'drop',
      (event) => {
        this.project.linkExternalAssetOnDrop(event, (error) => {
          if (error) this.setState({ error })
          this.forceUpdate()
        })
      },
      false
    )

    document.addEventListener('mousewheel', (evt) => {
      // on mac, this is triggered by a two-finger pan
      if (!this.getActiveComponent()) {
        return
      }

      let artboard = this.getActiveComponent().getArtboard()
      const SCROLL_PAN_COEFFICIENT = 0.5 // 1x is default, smaller is slower
      const deltaX = evt.wheelDeltaX
      const deltaY = evt.wheelDeltaY

      // HACK:  If you zoom and pan in quick succession, getZoom() will sometimes return 0 (or specifically, will return some value Y such that `1 / Y == Infinity`.)
      //       [probably a FS-race related bug; should be fixed by decoupling FS read/write from an in-mem representation]
      //       as a result, the logic that compensates for pan 'sensitivity' based on zoom goes haywire.
      //
      //       This null-coalesce (`|| SCROLL_PAN_COEFFICIENT`) works around this bug.
      //       Ideally, Artboard#getZoom() should return a reliable value.
      let scale = SCROLL_PAN_COEFFICIENT / ((artboard.getZoom() ^ 2) || SCROLL_PAN_COEFFICIENT)

      const newX = deltaX * scale
      const newY = deltaY * scale

      artboard.snapshotOriginalPan()
      this.performPan(newX, newY)
    }, false)

    window.addEventListener(
      'drop',
      (event) => {
        this.project.linkExternalAssetOnDrop(event, (error) => {
          if (error) this.setState({ error })
          this.forceUpdate()
        })
      },
      false
    )

    // Pasteable things are stored at the global level in the clipboard but we need that action to fire from the top level
    // so that all the views get the message, so we emit this as an event and then wait for the call to pasteThing
    document.addEventListener('paste', (pasteEvent) => {
      if (this.isPreviewMode()) return void (0)
      // Notify creator that we have some content that the person wishes to paste on the stage;
      // the top level needs to handle this because it does content type detection.
      pasteEvent.preventDefault()
      this.props.websocket.send({
        type: 'broadcast',
        name: 'current-pasteable:request-paste',
        from: 'glass',
        data: null // This can hold coordinates for the location of the paste
      })
    })

    document.addEventListener('cut', () => {
      this.handleVirtualClipboard('cut')
    })
    document.addEventListener('copy', () => {
      this.handleVirtualClipboard('copy')
    })

    this.props.websocket.on('broadcast', (message) => {
      switch (message.name) {
        case 'component:reload':
          // Race condition where Master emits this event during initial load of assets in
          // a project, resulting in this message arriving before we've initialized
          if (this.getActiveComponent()) {
            return this.getActiveComponent().moduleReplace((err) => {
              // Notify the plumbing that the module replacement here has finished, which should reactivate
              // the undo/redo queues which should be waiting for this to finish
              // Note how we do this whether or not we got an error from the action
              this.props.websocket.send({
                type: 'broadcast',
                name: 'component:reload:complete',
                from: 'glass'
              })

              if (err) {
                console.error(err)
                return
              }

              this.getActiveComponent().getArtboard().updateMountSize(this.refs.container)
            })
          } else {
            console.warn('[haiku-glass] active component not initialized; cannot reload')
            return
          }

        case 'view:zoom-in':
          this.getActiveComponent().getArtboard().zoomIn(1.25)
          break

        case 'view:zoom-out':
          this.getActiveComponent().getArtboard().zoomOut(1.25)
          break

        case 'drawing:setActive':
          this.getActiveComponent().getArtboard().setDrawingTool(message.params[0], message.params[1])
          break

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

    window.addEventListener('resize', lodash.throttle(() => {
      this.handleWindowResize()
    }), 64)

    window.addEventListener('mouseup', this.windowMouseUpHandler.bind(this))
    window.addEventListener('mousemove', this.windowMouseMoveHandler.bind(this))
    window.addEventListener('dblclick', this.windowDblClickHandler.bind(this))
    window.addEventListener('keydown', this.windowKeyDownHandler.bind(this))
    window.addEventListener('keyup', this.windowKeyUpHandler.bind(this))
    window.addEventListener('mouseout', this.windowMouseOutHandler.bind(this))
    // When the mouse is clicked, below is the order that events fire
    window.addEventListener('mousedown', this.windowMouseDownHandler.bind(this))
    window.addEventListener('mouseup', this.windowMouseUpHandler.bind(this))
    window.addEventListener('click', this.windowClickHandler.bind(this))
    window.addEventListener('contextmenu', (contextmenuEvent) => {
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

  setLastSelectedElement (el) {
    this._lastSelectedElement = el
  }

  getLastSelectedElement () {
    return this._lastSelectedElement
  }

  handleVirtualClipboard (clipboardAction, maybeClipboardEvent) {
    if (
      // Avoid any interaction in preview mode
      this.isPreviewMode() ||
      // Avoid infinite loops due to the way we leverage execCommand
      this._clipboardActionLock ||
      // Avoid interfering with cut/copy events in the events editor
      this.state.isEventHandlerEditorOpen ||
      // Nothing can be done if no active component
      !this.getActiveComponent()
    ) {
      return false
    }

    this._clipboardActionLock = true

    const lastSelectedElement = this.getLastSelectedElement()

    if (lastSelectedElement) {
      const hash = this.getActiveComponent().getInsertionPointHash()

      // Gotta grab this content before cutting, or we'll end up with a partial object that won't work
      let clipboardPayload = lastSelectedElement.getClipboardPayload(
        'glass',
        (oldId) => {
          return `${oldId}-${hash}`
        }
      )

      if (clipboardAction === 'cut') {
        lastSelectedElement.cut()
      }

      let serializedPayload = JSON.stringify(['application/haiku', clipboardPayload])

      clipboard.writeText(serializedPayload)

      this._clipboardActionLock = false
    } else {
      this._clipboardActionLock = false
    }
  }

  createComponentFromSelectedElements () {
    const selectedElements = Element.where({ _isSelected: true, component: this.getActiveComponent() })
    // Our selection becomes invalid as soon as we call this since we're completely changing
    // the elements that are currently on stage including our selection
    Element.unselectAllElements({ component: this.getActiveComponent() }, { from: 'glass' })
    this.getActiveComponent().createComponentFromElements(selectedElements, { from: 'glass' }, (err) => {
      if (err) {
        console.error(err)
      }
    })
  }

  editComponentElement (element) {
    const hostedComponent = element.getHostedComponent()
    if (hostedComponent) {
      this.project.setCurrentActiveComponent(hostedComponent.getSceneName(), { from: 'glass' }, (err) => {
        if (err) {
          console.error(err)
        }
      })
    }
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
    if (this.isPreviewMode()) return void (0)

    this.setState({
      targetElement: targetElement,
      isEventHandlerEditorOpen: true,
      eventHandlerEditorOptions: options
    })
  }

  hideEventHandlersEditor () {
    this.setState({
      targetElement: null,
      isEventHandlerEditorOpen: false
    })
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

  windowMouseOutHandler (nativeEvent) {
    if (this.isPreviewMode()) {
      return void (0)
    }

    const source = nativeEvent.relatedTarget || nativeEvent.toElement
    if (!source || source.nodeName === 'HTML') {
      // unhover?
      // cleanup?
    }
  }

  windowMouseMoveHandler (nativeEvent) {
    if (this.state.isEventHandlerEditorOpen) {
      return void (0)
    }

    nativeEvent.preventDefault()
    this.handleMouseMove({ nativeEvent })
  }

  windowMouseUpHandler (nativeEvent) {
    if (this.state.isEventHandlerEditorOpen) {
      return void (0)
    }

    nativeEvent.preventDefault()
    this.handleMouseUp({ nativeEvent })
  }

  windowMouseDownHandler (nativeEvent) {
    if (this.state.isEventHandlerEditorOpen) {
      return void (0)
    }

    nativeEvent.preventDefault()
    this.handleMouseDown({ nativeEvent })
  }

  windowClickHandler (nativeEvent) {
    if (this.isPreviewMode() || this.state.isEventHandlerEditorOpen) {
      return void (0)
    }

    nativeEvent.preventDefault()
    this.handleClick({ nativeEvent })
  }

  windowDblClickHandler (nativeEvent) {
    if (this.isPreviewMode() || this.state.isEventHandlerEditorOpen) {
      return void (0)
    }

    nativeEvent.preventDefault()
    this.handleDoubleClick({ nativeEvent })
  }

  windowKeyDownHandler (nativeEvent) {
    if (this.isPreviewMode() || this.state.isEventHandlerEditorOpen) {
      return void (0)
    }

    this.handleKeyDown({ nativeEvent })
  }

  windowKeyUpHandler (nativeEvent) {
    if (this.isPreviewMode() || this.state.isEventHandlerEditorOpen) {
      return void (0)
    }

    this.handleKeyUp({ nativeEvent })
  }

  handleMouseDown (mousedownEvent) {
    if (!this.getActiveComponent()) {
      return
    }

    if (this.state.isEventHandlerEditorOpen) {
      return void (0)
    }

    this.state.isMouseDown = true

    this.state.lastMouseDownTime = Date.now()
    this.storeAndReturnMousePosition(mousedownEvent, 'lastMouseDownPosition')

    //store all elements' transforms
    //TODO:  should we store only the selected element's transform?
    //       this could become a bottleneck with a high number of elements
    var elems = Element.all(); //semicolon required
    
    (elems || []).forEach((elem) => {
      elem.pushCachedTransform("CONSTRAINED_DRAG") //wishlist:  enum
    })

    // Only count left clicks
    if (mousedownEvent.nativeEvent.button !== 0) {
      return
    }

    // We are panning now, so don't un/select anything
    if (Globals.isSpaceKeyDown) {
      return
    }

    if (this.getActiveComponent().getArtboard().getActiveDrawingTool() !== 'pointer') {
      // TODO: Drawing tools
    } else if (!this.isPreviewMode()) {
      const target = this.findNearestDomSelectionTarget(mousedownEvent.nativeEvent.target)

      if (target === SELECTION_TYPES.ON_STAGE_CONTROL) {
        return
      }

      if (!target || !target.hasAttribute) {
        // If shift is down, that's constrained scaling or translation. If cmd, that's rotation mode.
        // I.e., only unselect elements if we're not doing either of those operations
        if (!Globals.isShiftKeyDown && !Globals.isCommandKeyDown) {
          Element.unselectAllElements({ component: this.getActiveComponent() }, { from: 'glass' })
        }
        return
      }

      if (
        target.hasAttribute('source') &&
        target.hasAttribute('haiku-id') &&
        target.parentNode !== this.refs.mount &&
        target.parentNode !== this.getActiveComponent().getMount().$el()
      ) {
        // First make sure we are grabbing the correct element based on the context.
        // If we've landed on a component sub-element, we need to go up and select the wrapper.
        let haikuId = target.getAttribute('haiku-id')
        if (this.isDomNodeChildOfComponentWrapperDomNode(target)) {
          haikuId = target.parentNode.getAttribute('haiku-id')
        }

        const elementTargeted = this.getActiveComponent().findElementByComponentId(haikuId)
        const allSelectedElements = Element.where({ _isSelected: true, component: this.getActiveComponent() })

        if (Globals.isControlKeyDown) {
          if (allSelectedElements.length > 0) {
            return
          }
          // This call also unselects all elements, so we don't need to do that work here too
          return this.getActiveComponent().selectElement(haikuId, { from: 'glass' }, () => {})
        }

        if (experimentIsEnabled(Experiment.MultiComponentFeatures)) {
          if (Globals.isShiftKeyDown) {
            // Shift being down indicates we are in multi-select mode
            if (elementTargeted.isSelected()) {
              return elementTargeted.unselectSoftly({ from: 'glass' })
            }
            return elementTargeted.selectSoftly({ from: 'glass' })
          }
        }

        // This call also unselects all elements, so we don't need to do that work here too
        this.getActiveComponent().selectElement(haikuId, { from: 'glass' }, () => {})
      }
    }
  }

  isDomNodeChildOfComponentWrapperDomNode (target) {
    // If the user selected one of the children of a component that has been instantiated on stage
    // we need to actually select the parent (wrapper) element since that's what our component manages
    if (target.parentNode && target.parentNode.getAttribute('haiku-id') && target.parentNode.getAttribute('source')) {
      const targetCodeSourceWithRespectToProjectRoot = Design.designSourceToCodeSource(target.getAttribute('source'))
      const targetCodeSourceWithRespectToInstantiatorComponent = target.parentNode.getAttribute('source')
      if (this.getActiveComponent().getRelpathWithRespectToProjectFromPathRelativeToUs(targetCodeSourceWithRespectToInstantiatorComponent) === targetCodeSourceWithRespectToProjectRoot) {
        // If this element's design source is the code source of the parent, we've reached the component wrapper
        // The element to select is the parent node (the node in the context of the active component)
        return true
      }
    }
    return false
  }

  findNearestDomSelectionTarget (target) {
    // Don't perform element selection if the user clicked one of the transform controls
    if (
      (typeof target.className === 'string') &&
      target.className.indexOf('scale-cursor') !== -1
    ) {
      return SELECTION_TYPES.ON_STAGE_CONTROL
    }

    // Climb the target path to find if a haiku Element has been selected
    // We want to make sure we are not selecting elements at the wrong context level
    while (
      target.hasAttribute &&
      (
        !target.hasAttribute('source') || // Only root elements of an instantiated component have this attribute
        !target.hasAttribute('haiku-id') || // Only haiku elements have this
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

    this.storeAndReturnMousePosition(mouseupEvent, 'lastMouseUpPosition')
    this.state.isMouseDown = false
    this.state.lastMouseUpTime = Date.now()
    this.handleDragStop()
    this.setState({
      isAnythingScaling: false,
      isAnythingRotating: false,
      globalControlPointHandleClass: '',
      controlActivation: null
    })
  }

  handleClick (clickEvent) {
    if (this.isPreviewMode()) {
      return void (0)
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

    this.storeAndReturnMousePosition(doubleClickEvent)

    // Only count left clicks or natural trackpad clicks
    if (doubleClickEvent.nativeEvent.button !== 0 || Globals.isControlKeyDown) {
      return
    }

    const target = this.findNearestDomSelectionTarget(doubleClickEvent.nativeEvent.target)

    // Double clicking in a component means we want to drill down and start editing it
    if (this.isDomNodeChildOfComponentWrapperDomNode(target)) {
      const element = Element.findById(Element.buildUidFromComponentAndDomElement(this.getActiveComponent(), target))
      element.component.setAsCurrentActiveComponent({ from: 'glass' })
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
    if (!this.getActiveComponent()) {
      return
    }

    const delta = keyEvent.shiftKey ? 5 : 1
    this.getActiveComponent().queryElements({ _isSelected: true }).forEach((element) => {
      element.move(-delta, 0, this.state.mousePositionCurrent, this.state.mousePositionPrevious)
    })
  }

  handleKeyUpArrow (keyEvent) {
    if (!this.getActiveComponent()) {
      return
    }

    const delta = keyEvent.shiftKey ? 5 : 1
    this.getActiveComponent().queryElements({ _isSelected: true }).forEach((element) => {
      element.move(0, -delta, this.state.mousePositionCurrent, this.state.mousePositionPrevious)
    })
  }

  handleKeyRightArrow (keyEvent) {
    if (!this.getActiveComponent()) {
      return
    }

    const delta = keyEvent.shiftKey ? 5 : 1
    this.getActiveComponent().queryElements({ _isSelected: true }).forEach((element) => {
      element.move(delta, 0, this.state.mousePositionCurrent, this.state.mousePositionPrevious)
    })
  }

  handleKeyDownArrow (keyEvent) {
    if (!this.getActiveComponent()) {
      return
    }

    const delta = keyEvent.shiftKey ? 5 : 1
    this.getActiveComponent().queryElements({ _isSelected: true }).forEach((element) => {
      element.move(0, delta, this.state.mousePositionCurrent, this.state.mousePositionPrevious)
    })
  }

  handleKeyDown (keyEvent) {
    if (this.state.isEventHandlerEditorOpen) {
      return void (0)
    }

    // Cmd + 0 centers & resets zoom
    if (Globals.isCommandKeyDown && keyEvent.nativeEvent.which === 48) {
      this.getActiveComponent().getArtboard().resetZoomPan()
    }

    switch (keyEvent.nativeEvent.which) {
      case 27: this.handleKeyEscape(); break
      case 37: this.handleKeyLeftArrow(keyEvent.nativeEvent); break
      case 38: this.handleKeyUpArrow(keyEvent.nativeEvent); break
      case 39: this.handleKeyRightArrow(keyEvent.nativeEvent); break
      case 40: this.handleKeyDownArrow(keyEvent.nativeEvent); break
      case 46: this.handleKeyDelete(); break
      case 8: this.handleKeyDelete(); break
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
    this.setState({ isStageNameHovering: true })
  }

  handleMouseOutStageName () {
    this.setState({ isStageNameHovering: false })
  }

  handleMouseMove (mousemoveEvent) {
    if (!this.getActiveComponent()) {
      return
    }

    const zoom = this.getActiveComponent().getArtboard().getZoom() || 1
    const pan = this.getActiveComponent().getArtboard().getPan() || {x: 0, y: 0}
    const viewportTransform = {zoom, pan}

    const lastMouseDownPosition = this.state.lastMouseDownPosition
    const mousePositionCurrent = this.storeAndReturnMousePosition(mousemoveEvent)
    const mousePositionPrevious = this.state.mousePositionPrevious || mousePositionCurrent

    let dx = (mousePositionCurrent.x - mousePositionPrevious.x) / zoom
    let dy = (mousePositionCurrent.y - mousePositionPrevious.y) / zoom
    if (dx === 0 && dy === 0) return mousePositionCurrent

    // If we got this far, the mouse has changed its position from the most recent mousedown
    if (this.state.isMouseDown) {
      this.handleDragStart()
    }

    if (this.state.isMouseDragging && this.state.isMouseDown) {
      if (Globals.isSpaceKeyDown && this.state.stageMouseDown) {
        this.performPan(
          mousemoveEvent.nativeEvent.clientX - this.state.stageMouseDown.x,
          mousemoveEvent.nativeEvent.clientY - this.state.stageMouseDown.y
        )
      } else if (!this.isPreviewMode()) {
        var selected = this.getActiveComponent().queryElements({ _isSelected: true })
        if (selected.length > 0) {
          selected.forEach((element) => {
            element.drag(dx, dy, mousePositionCurrent, mousePositionPrevious, lastMouseDownPosition, this.state, viewportTransform, Globals)
          })
        }
      }
    }

    return mousePositionCurrent
  }

  handleKeyDelete () {
    if (!this.getActiveComponent()) {
      return
    }

    if (this.isPreviewMode()) {
      return void (0)
    }

    this.getActiveComponent().queryElements({ _isSelected: true }).forEach((element) => {
      element.remove()
    })
  }

  getSelectionMarqueeSize () {
    if (
      !this.state.mousePositionCurrent ||
      !this.state.lastMouseDownPosition ||
      !this.getActiveComponent()) {
      return { x: 0, y: 0, width: 0, height: 0 }
    }

    return {
      x: this.state.lastMouseDownPosition.x + this.getActiveComponent().getArtboard().getRect().left,
      y: this.state.lastMouseDownPosition.y + this.getActiveComponent().getArtboard().getRect().top,
      width: this.state.mousePositionCurrent.x - this.state.lastMouseDownPosition.x,
      height: this.state.mousePositionCurrent.y - this.state.lastMouseDownPosition.y
    }
  }

  controlActivation (activationInfo) {
    if (!this.getActiveComponent()) {
      return
    }

    const artboard = this.getActiveComponent().getArtboard().getRect()
    this.setState({
      isAnythingRotating: Globals.isCommandKeyDown,
      isAnythingScaling: !Globals.isCommandKeyDown,
      controlActivation: {
        shift: Globals.isShiftKeyDown,
        ctrl: Globals.isControlKeyDown,
        cmd: Globals.isCommandKeyDown,
        alt: Globals.isAltKeyDown,
        index: activationInfo.index,
        arboard: artboard,
        client: {
          x: activationInfo.event.clientX,
          y: activationInfo.event.clientY
        },
        coords: {
          x: activationInfo.event.clientX - artboard.left,
          y: activationInfo.event.clientY - artboard.top
        }
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
    const mousePositionCurrent = getLocalDomEventPosition(mouseEvent.nativeEvent, this.refs.container)
    mousePositionCurrent.clientX = mouseEvent.nativeEvent.clientX
    mousePositionCurrent.clientY = mouseEvent.nativeEvent.clientY
    mousePositionCurrent.x -= this.getActiveComponent().getArtboard().getRect().left
    mousePositionCurrent.y -= this.getActiveComponent().getArtboard().getRect().top
    this.state.mousePositionCurrent = mousePositionCurrent
    if (additionalPositionTrackingState) this.state[additionalPositionTrackingState] = mousePositionCurrent
    return mousePositionCurrent
  }

  drawOverlays () {
    if (!this.getActiveComponent()) {
      return
    }

    const selected = this.getActiveComponent().queryElements({ _isSelected: true })

    if (selected.length > 0) {
      const container = this._haikuRenderer.createContainer(this.refs.overlay)

      const parts = this.buildDrawnOverlays(selected)

      const overlay = {
        elementName: 'div',
        attributes: {
          id: 'haiku-glass-overlay-root',
          style: {
            transform: 'matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1)',
            position: 'absolute',
            overflow: 'visible',
            left: this.getActiveComponent().getArtboard().getMountX() + 'px',
            top: this.getActiveComponent().getArtboard().getMountY() + 'px',
            width: this.getActiveComponent().getArtboard().getMountWidth() + 'px',
            height: this.getActiveComponent().getArtboard().getMountHeight() + 'px'
          }
        },
        children: parts
      }

      // HACK! We already cache the control point listeners ourselves, so clear the cache
      // used normally by the component instance for caching/deduping listeners in production.
      // If we don't do this, rendered elements that disappear and re-appear won't have the
      // event listener correctly applied to the newly created DOM node (listeners won't work)
      this._haikuContext.component.clearRegisteredElementEventListeners()

      this._haikuRenderer.render(this.refs.overlay, container, overlay, this._haikuContext.component, false)
    } else {
      this._haikuRenderer.render(this.refs.overlay, { /* container */ }, { elementName: 'div' }, this._haikuContext.component, false)
    }
  }

  // This method creates objects which represent Haiku Player rendering instructions for displaying all of
  // the visual effects that sit above the stage. (Transform controls, etc.) The Haiku Player is sort of a
  // hybrid of React Fiber and Famous Engine. It has a virtual DOM tree of elements like {elementName: 'div', attributes: {}, []},
  // and flushes updates to them on each frame. So what _this method_ does is just build those objects and then
  // these get passed into a Haiku Player render method (see above). LONG STORY SHORT: This creates a flat list of
  // nodes that get rendered to the DOM by the Haiku Player.
  buildDrawnOverlays (selectedElements) {
    const overlays = []

    // Don't show any overlays if we're in preview (aka 'live') interactionMode
    if (this.isPreviewMode()) {
      return overlays
    }

    if (selectedElements.length > 0) {
      if (selectedElements.length === 1) {
        let pointsForElement

        const element = selectedElements[0]

        if (element.isRenderableType()) {
          pointsForElement = element.getPointsTransformed(true)
          this.renderMorphPointsOverlay(pointsForElement, overlays)
        } else {
          pointsForElement = element.getBoxPointsTransformed()
          const rotationZ = element.getPropertyValue('rotation.z') || 0
          let scaleX = element.getPropertyValue('scale.x')
          if (scaleX === undefined || scaleX === null) scaleX = 1
          let scaleY = element.getPropertyValue('scale.y')
          if (scaleY === undefined || scaleY === null) scaleY = 1
          this.renderTransformBoxOverlay(element, pointsForElement, overlays, element.canRotate(), Globals.isCommandKeyDown, true, rotationZ, scaleX, scaleY)
          this.renderEventHandlersOverlay(element, pointsForElement, overlays, rotationZ, scaleX, scaleY)
        }
      } else {
        // TODO: Render control points across multiple selected elements
        const pointsForGroup = Element.getBoundingBoxPointsForElements(selectedElements)
        this.renderTransformBoxOverlay(null, pointsForGroup, overlays, false, Globals.isCommandKeyDown, false, 0, 1, 1)
      }
      if (this.state.isMouseDragging) {
        // TODO: Draw tooltip with points info
      }
    }

    return overlays
  }

  renderMorphPointsOverlay (points, overlays) {
    points.forEach((point, index) => {
      overlays.push(this.renderControlPoint(point.x, point.y, index))
    })
  }

  renderLine (x1, y1, x2, y2) {
    return {
      elementName: 'svg',
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
      children: [{
        elementName: 'line',
        attributes: {
          x1: x1,
          y1: y1,
          x2: x2,
          y2: y2,
          stroke: Palette.DARKER_ROCK2,
          'stroke-width': '1px',
          'vector-effect': 'non-scaling-stroke'
        }
      }]
    }
  }

  createControlPointListener (eventName, pointIndex) {
    // Caching these as opposed to creating new functions hundreds of times
    if (!this._controlPointListeners) this._controlPointListeners = {}
    const controlKey = eventName + '-' + pointIndex
    if (!this._controlPointListeners[controlKey]) {
      this._controlPointListeners[controlKey] = (listenerEvent) => {
        this.controlActivation({
          index: pointIndex,
          event: listenerEvent
        })
      }
      this._controlPointListeners[controlKey].controlKey = controlKey
    }
    return this._controlPointListeners[controlKey]
  }

  renderControlPoint (x, y, index, handleClass) {
    if (!this.getActiveComponent()) {
      return
    }

    const scale = 1 / (this.getActiveComponent().getArtboard().getZoom() || 1)

    return {
      elementName: 'div',
      attributes: {
        key: 'control-point-' + index,
        class: handleClass || '',
        onmousedown: this.createControlPointListener('mousedown', index),
        style: {
          position: 'absolute',
          transform: `scale(${scale},${scale})`,
          pointerEvents: 'auto',
          left: (x - 3.5) + 'px',
          top: (y - 3.5) + 'px',
          border: '1px solid ' + Palette.DARKER_ROCK2,
          backgroundColor: Palette.ROCK,
          boxShadow: '0 2px 6px 0 ' + Palette.SHADY, // TODO: account for rotation
          width: '7px',
          height: '7px',
          borderRadius: '50%'
        }
      },
      children: [
        {
          elementName: 'div',
          attributes: {
            key: 'control-point-hit-area-' + index,
            class: handleClass || '',
            style: {
              position: 'absolute',
              pointerEvents: 'auto',
              left: '-15px',
              top: '-15px',
              width: '30px',
              height: '30px'
            }
          }
        }
      ]
    }
  }

  getHandleClass (index, canRotate, isRotationModeOn, rotationZ, scaleX, scaleY) {
    var defaultPointGroup = CLOCKWISE_CONTROL_POINTS[0]
    var indexOfPoint = defaultPointGroup.indexOf(index)

    var keyOfPointGroup
    if (scaleX >= 0 && scaleY >= 0) keyOfPointGroup = 0 // default
    else if (scaleX >= 0 && scaleY < 0) keyOfPointGroup = 1 // flipped vertically
    else if (scaleX < 0 && scaleY >= 0) keyOfPointGroup = 2 // flipped horizontally
    else if (scaleX < 0 && scaleY < 0) keyOfPointGroup = 3 // flipped horizontally and vertically

    if (keyOfPointGroup === undefined) {
      console.warn(`[haiku-glass] unable to determine handle class due to bad scale values ${scaleX},${scaleY}`)
      return ''
    }

    var specifiedPointGroup = CLOCKWISE_CONTROL_POINTS[keyOfPointGroup]

    var rotationDegrees = Element.getRotationIn360(rotationZ)
    // Each 45 degree turn will equate to a phase change of 1, and that phase corresponds to
    // a starting index for the control points in clockwise order
    var phaseNumber = ~~((rotationDegrees + 22.5) / 45) % specifiedPointGroup.length
    var offsetIndex = (indexOfPoint + phaseNumber) % specifiedPointGroup.length
    var shiftedIndex = specifiedPointGroup[offsetIndex]

    // These class names are defined in global.css; the indices indicate the corresponding points
    if (canRotate && isRotationModeOn) {
      return `rotate-cursor-${shiftedIndex}`
    } else {
      return `scale-cursor-${shiftedIndex}`
    }
  }

  openContextMenu (event) {
    if (this.isPreviewMode()) return void (0)
    event.preventDefault()
    event.stopPropagation()

    PopoverMenu.launch({
      event,
      items: this.getContextMenuItems()
    })
  }

  buildElementContextMenuIcon (x, y, rotationZ, scaleX, scaleY) {
    const boltSize = 30
    const offsetLeft = Math.sign(scaleX) * (boltSize * Math.cos(rotationZ)) - boltSize / 2
    const offsetTop = Math.sign(scaleX) * (boltSize * Math.sin(rotationZ)) - boltSize / 2
    this.elementContextMenuButton.attributes.style.left = `${x + offsetLeft}px`
    this.elementContextMenuButton.attributes.style.top = `${y + offsetTop}px`
    this.elementContextMenuButton.attributes.style.width = `${boltSize}px`
    this.elementContextMenuButton.attributes.style.height = `${boltSize}px`
    return this.elementContextMenuButton
  }

  renderEventHandlersOverlay (element, points, overlays, rotationZ, scaleX, scaleY) {
    // If the size is smaller than a threshold, only display the corners.
    // And if it is smaller even than that, don't display the points at all
    const dx = Element.distanceBetweenPoints(points[0], points[2], this.state.zoomXY)
    const dy = Element.distanceBetweenPoints(points[0], points[6], this.state.zoomXY)
    const {x, y} = points[5]

    if (dx < POINTS_THRESHOLD_NONE || dy < POINTS_THRESHOLD_NONE) return

    overlays.push(this.buildElementContextMenuIcon(x, y, rotationZ, scaleX, scaleY))
  }

  renderTransformBoxOverlay (maybeElement, points, overlays, canRotate, isRotationModeOn, canControlHandles, rotationZ, scaleX, scaleY) {
    if (!this.getActiveComponent()) {
      return
    }

    // If the size is smaller than a threshold, only display the corners.
    // And if it is smaller even than that, don't display the points at all
    const dx = Element.distanceBetweenPoints(points[0], points[2], this.getActiveComponent().getArtboard().getZoom())
    const dy = Element.distanceBetweenPoints(points[0], points[6], this.getActiveComponent().getArtboard().getZoom())

    let pointDisplayMode = POINT_DISPLAY_MODES.NORMAL
    // No element means we are displaying points around multi-selection
    if (!maybeElement) {
      pointDisplayMode = POINT_DISPLAY_MODES.NONE
    }

    if (pointDisplayMode !== POINT_DISPLAY_MODES.NONE) {
      if (dx < POINTS_THRESHOLD_NONE || dy < POINTS_THRESHOLD_NONE) {
        pointDisplayMode = POINT_DISPLAY_MODES.NONE
      } else if (dx < POINTS_THRESHOLD_REDUCED && dy < POINTS_THRESHOLD_REDUCED) {
        pointDisplayMode = POINT_DISPLAY_MODES.REDUCED_ON_BOTH
      } else if (dx < POINTS_THRESHOLD_REDUCED && dy >= POINTS_THRESHOLD_REDUCED) {
        pointDisplayMode = POINT_DISPLAY_MODES.REDUCED_ON_TOP_BOTTOM
      } else if (dx >= POINTS_THRESHOLD_REDUCED && dy < POINTS_THRESHOLD_REDUCED) {
        pointDisplayMode = POINT_DISPLAY_MODES.REDUCED_ON_LEFT_RIGHT
      }
    }

    let lineDisplayMode = LINE_DISPLAY_MODES.NORMAL
    if (dx < POINTS_THRESHOLD_NONE || dy < POINTS_THRESHOLD_NONE) lineDisplayMode = LINE_DISPLAY_MODES.NONE

    if (lineDisplayMode !== LINE_DISPLAY_MODES.NONE) {
      const corners = [points[0], points[2], points[8], points[6]]
      corners.forEach((point, index) => {
        const next = corners[(index + 1) % corners.length]
        overlays.push(this.renderLine(point.x, point.y, next.x, next.y))
      })
    }

    points.forEach((point, index) => {
      if (!pointDisplayMode[index]) {
        return
      }
      if (index !== 4) {
        overlays.push(this.renderControlPoint(point.x, point.y, index, canControlHandles && this.getHandleClass(index, canRotate, isRotationModeOn, rotationZ, scaleX, scaleY)))
      }
    })
  }

  getGlobalControlPointHandleClass () {
    if (!this.state.controlActivation) return ''
    if (!this.getActiveComponent()) return ''

    const controlIndex = this.state.controlActivation.index
    const isRotationModeOn = Globals.isCommandKeyDown
    const selectedElements = this.getActiveComponent().queryElements({ _isSelected: true })
    if (selectedElements.length === 1) {
      const selectedElement = selectedElements[0]
      const rotationZ = selectedElement.getPropertyValue('rotation.z') || 0
      let scaleX = selectedElement.getPropertyValue('scale.x')
      if (scaleX === undefined || scaleX === null) scaleX = 1
      let scaleY = selectedElement.getPropertyValue('scale.y')
      if (scaleY === undefined || scaleY === null) scaleY = 1
      return this.getHandleClass(controlIndex, true, isRotationModeOn, rotationZ, scaleX, scaleY)
    } else {
      return this.getHandleClass(controlIndex, false, isRotationModeOn, 0, 1, 1)
    }
  }

  getCSSTransform (zoom, pan) {
    return 'matrix3d(' +
      [zoom.x, 0, 0, 0,
        0, zoom.y, 0, 0,
        0, 0, 1, 0,
        pan.x, pan.y, 0, 1].join(',') + ')'
  }

  isPreviewMode () {
    if (!this.getActiveComponent()) {
      return false
    }
    return this.getActiveComponent().isPreviewModeActive()
  }

  getCursorCssRule () {
    if (this.isPreviewMode()) return 'default'
    return (this.state.stageMouseDown) ? '-webkit-grabbing' : '-webkit-grab'
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

    const selectedElements = this.getActiveComponent().queryElements({ _isSelected: true })
    const selectedElement = selectedElements.length === 1 && selectedElements[0]
    const sourcePath = selectedElement && selectedElement.staticTemplateNode && selectedElement.staticTemplateNode.attributes && selectedElement.staticTemplateNode.attributes['source']
    const sketchAssetPath = sourcePath && sourcePath.split(/\.sketch\.contents/)[0].concat('.sketch')

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

    if (experimentIsEnabled(Experiment.MultiComponentFeatures)) {
      items.push({
        label: 'Create Component',
        // If a single element is already a component, we don't let it be created as one
        enabled: (
          selectedElements.length > 0 &&
          !(
            selectedElements.length === 1 &&
            selectedElement &&
            selectedElement.isComponent()
          )
        ),
        onClick: () => {
          this.createComponentFromSelectedElements()
        }
      })

      items.push({
        label: 'Edit Component',
        enabled: (
          selectedElements.length === 1 &&
          selectedElement &&
          selectedElement.isComponent()
        ),
        onClick: () => {
          this.editComponentElement(selectedElement)
        }
      })

      items.push({ type: 'separator' })
    }

    items.push({
      label: 'Edit Element Actions',
      enabled: !!selectedElement,
      onClick: (event) => {
        this.showEventHandlersEditor(event, selectedElement)
      }
    })

    items.push({ type: 'separator' })

    items.push({
      label: 'Edit in Sketch',
      enabled: !!sourcePath,
      onClick: () => {
        shell.openItem(path.join(this.props.folder, sketchAssetPath))
      }
    })

    items.push({ type: 'separator' })

    items.push({
      label: 'Cut',
      enabled: !!selectedElement,
      onClick: () => {
        selectedElement.cut()
      }
    })

    items.push({
      label: 'Copy',
      enabled: !!selectedElement,
      onClick: () => {
        selectedElement.copy()
      }
    })

    items.push({
      label: 'Paste',
      enabled: selectedElements.length < 1, // TODO: How can we determine whether we have a pasteable ready?
      onClick: (event) => {
        if (this.isPreviewMode()) {
          return
        }

        this.props.websocket.send({
          type: 'broadcast',
          name: 'current-pasteable:request-paste',
          from: 'glass',
          data: this.state.mousePositionCurrent
        })
      }
    })

    items.push({ type: 'separator' })

    items.push({
      label: 'Delete',
      enabled: !!selectedElement,
      onClick: () => {
        selectedElement.remove({ from: 'glass' })
      }
    })

    items.push({ type: 'separator' })

    items.push({
      label: 'Forward',
      enabled: !!(selectedElement && !selectedElement.isAtFront()),
      onClick: () => {
        selectedElement.bringForward()
      }
    })

    items.push({
      label: 'Backward',
      enabled: !!(selectedElement && !selectedElement.isAtBack()),
      onClick: () => {
        selectedElement.sendBackward()
      }
    })

    items.push({
      label: 'Bring to Front',
      enabled: !!(selectedElement && !selectedElement.isAtFront()),
      onClick: () => {
        selectedElement.bringToFront()
      }
    })

    items.push({
      label: 'Send to Back',
      enabled: !!(selectedElement && !selectedElement.isAtBack()),
      onClick: () => {
        selectedElement.sendToBack()
      }
    })

    items.push({ type: 'separator' })

    items.push({
      label: 'Copy SVG',
      enabled: !!selectedElement,
      onClick: (event) => {
        clipboard.writeText(selectedElement.toXMLString())
      }
    })

    items.push({
      label: 'HTML Snapshot',
      enabled: !!selectedElement,
      onClick: (event) => {
        this.getActiveComponent().htmlSnapshot((err, html) => {
          if (err) {
            return
          }

          clipboard.writeText(html)
          writeHtmlSnapshot(html, this)
        })
      }
    })

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
        className={this.getGlobalControlPointHandleClass()}
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
                height: container.h
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
                {(this.getActiveComponent())
                  ? this.getActiveComponent().getFriendlySceneName(this.props.projectName)
                  : this.props.projectName}
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
        </div>
      </div>
    )
  }
}

Glass.propTypes = {
  userconfig: React.PropTypes.object,
  websocket: React.PropTypes.object,
  folder: React.PropTypes.string
}

export default Radium(Glass)
