import React from 'react'
import lodash from 'lodash'
import Radium from 'radium'
import HaikuDOMRenderer from '@haiku/player/lib/renderers/dom'
import HaikuContext from '@haiku/player/lib/HaikuContext'
import ActiveComponent from 'haiku-serialization/src/model/ActiveComponent'
import Palette from './Palette'
import Comment from './Comment'
import EventHandlerEditor from './EventHandlerEditor'
import Comments from './models/Comments'
import ContextMenu from './models/ContextMenu'
import getLocalDomEventPosition from './helpers/getLocalDomEventPosition'

const { clipboard } = require('electron')

const CLOCKWISE_CONTROL_POINTS = {
  0: [0, 1, 2, 5, 8, 7, 6, 3],
  1: [6, 7, 8, 5, 2, 1, 0, 3], // flipped vertical
  2: [2, 1, 0, 3, 6, 7, 8, 5], // flipped horizontal
  3: [8, 7, 6, 3, 0, 1, 2, 5] // flipped horizontal + vertical
}

// The class is exported also _without_ the radium wrapper to allow jsdom testing
export class Glass extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      error: null,
      mountWidth: 550,
      mountHeight: 400,
      mountX: 0,
      mountY: 0,
      controlActivation: null,
      mousePositionCurrent: null,
      mousePositionPrevious: null,
      isAnythingScaling: false,
      isAnythingRotating: false,
      globalControlPointHandleClass: '',
      containerHeight: 0,
      containerWidth: 0,
      isStageSelected: false,
      isStageNameHovering: false,
      isMouseDown: false,
      lastMouseDownTime: null,
      lastMouseDownPosition: null,
      lastMouseUpPosition: null,
      lastMouseUpTime: null,
      isMouseDragging: false,
      isKeyShiftDown: false,
      isKeyCtrlDown: false,
      isKeyAltDown: false,
      isKeyCommandDown: false,
      isKeySpaceDown: false,
      panX: 0,
      panY: 0,
      originalPanX: 0,
      originalPanY: 0,
      zoomXY: 1,
      comments: [],
      doShowComments: false,
      targetElement: null,
      isEventHandlerEditorOpen: false,
      activeDrawingTool: 'pointer',
      drawingIsModal: true
    }

    this._component = new ActiveComponent({
      alias: 'glass',
      folder: this.props.folder,
      userconfig: this.props.userconfig,
      websocket: this.props.websocket,
      platform: window,
      envoy: this.props.envoy
    })

    this._component.setStageTransform({zoom: this.state.zoomXY, pan: {x: this.state.panX, y: this.state.panY}})
    this._comments = new Comments(this.props.folder)
    this._ctxmenu = new ContextMenu(window, this)

    this._playing = false
    this._stopwatch = null
    this._lastAuthoritativeFrame = 0

    this._lastSelectedElement = null
    this._clipboardActionLock = false

    this.drawLoop = this.drawLoop.bind(this)
    this.draw = this.draw.bind(this)
    this._haikuRenderer = new HaikuDOMRenderer()
    this._haikuContext = new HaikuContext(null, this._haikuRenderer, {}, { timelines: {}, template: { elementName: 'div', attributes: {}, children: [] } }, { options: { cache: {}, seed: 'abcde' } })

    this.resetContainerDimensions()

    window.glass = this

    this._component.on('envoy:timelineClientReady', (client) => {
      client.on('didPlay', this.handleTimelineDidPlay.bind(this))
      client.on('didPause', this.handleTimelineDidPause.bind(this))
      client.on('didSeek', this.handleTimelineDidSeek.bind(this))
    })
  }

  handleTimelineDidPlay () {
    this._playing = true
    this._stopwatch = Date.now()
  }

  handleTimelineDidPause (frameData) {
    var finalFrame = frameData.frame
    this._playing = false
    this._lastAuthoritativeFrame = finalFrame
    this._stopwatch = Date.now()
  }

  handleTimelineDidSeek (frameData) {
    var finalFrame = frameData.frame
    this._lastAuthoritativeFrame = finalFrame
    this._stopwatch = Date.now()
    this.draw(true)
  }

  draw (forceSeek) {
    if (this._playing || forceSeek) {
      var seekMs = 0
      // this._stopwatch is null unless we've received an action from the timeline.
      // If we're developing the glass solo, i.e. without a connection to envoy which
      // provides the system clock, we can just lock the time value to zero as a hack.
      // TODO: Would be nice to allow full-fledged solo development of glass...
      if (this._stopwatch !== null) {
        var fps = 60 // TODO:  support variable
        var baseMs = this._lastAuthoritativeFrame * 1000 / fps
        var deltaMs = this._playing ? Date.now() - this._stopwatch : 0
        seekMs = baseMs + deltaMs
      }

      this._component._setTimelineTimeValue(seekMs)

      var currentTimeline = this._component._componentInstance.getTimeline(this._component._currentTimelineName)
      if (currentTimeline) {
        if (forceSeek) {
          currentTimeline.seek(seekMs)
        } else {
          currentTimeline._controlTime(seekMs)
        }
      }
    }

    if (this.refs.overlay) {
      this.drawOverlays(forceSeek)
    }
  }

  drawLoop () {
    this.draw()
    window.requestAnimationFrame(this.drawLoop)
  }

  componentDidMount () {
    this._component.mountApplication(this.refs.mount, { options: { freeze: true, overflowX: 'visible', overflowY: 'visible', contextMenu: 'disabled' } })

    this._component.on('component:mounted', () => {
      var newMountSize = this._component.getContextSize()

      this.setState({
        mountWidth: newMountSize.width,
        mountHeight: newMountSize.height
      })

      this.drawLoop()
    })

    this._component.on('component:updated', () => {
      this.draw(true)
    })

    this._component.on('artboard:resized', (sizeDescriptor) => {
      this.setState({
        mountWidth: sizeDescriptor.width,
        mountHeight: sizeDescriptor.height
      })
    })

    this._component.on('time:change', (timelineName, timelineTime) => {
      if (this._component && this._component.getMount() && !this._component.isReloadingCode) {
        var updatedArtboardSize = this._component.getContextSize()
        if (updatedArtboardSize && updatedArtboardSize.width && updatedArtboardSize.height) {
          this.setState({
            mountWidth: updatedArtboardSize.width,
            mountHeight: updatedArtboardSize.height
          })
        }
      }
    })

    this._component.on('artboard:size-changed', (sizeDescriptor) => {
      this.setState({
        mountWidth: sizeDescriptor.width,
        mountHeight: sizeDescriptor.height
      })
    })

    // Pasteable things are stored at the global level in the clipboard but we need that action to fire from the top level
    // so that all the views get the message, so we emit this as an event and then wait for the call to pasteThing
    document.addEventListener('paste', (pasteEvent) => {
      console.info('[glass] paste heard')
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

    function handleVirtualClipboard (clipboardAction, maybeClipboardEvent) {
      console.info('[glass] handling clipboard action', clipboardAction)

      // Avoid infinite loops due to the way we leverage execCommand
      if (this._clipboardActionLock) {
        return false
      }

      this._clipboardActionLock = true

      if (this._lastSelectedElement) {
        // Gotta grab _before cutting_ or we'll end up with a partial object that won't work
        let clipboardPayload = this._lastSelectedElement.getClipboardPayload('glass')

        if (clipboardAction === 'cut') {
          this._lastSelectedElement.cut()
        }

        let serializedPayload = JSON.stringify(['application/haiku', clipboardPayload])

        clipboard.writeText(serializedPayload)

        this._clipboardActionLock = false
      } else {
        this._clipboardActionLock = false
      }
    }

    document.addEventListener('cut', handleVirtualClipboard.bind(this, 'cut'))
    document.addEventListener('copy', handleVirtualClipboard.bind(this, 'copy'))

    // This fires when the context menu cut/copy action has been fired - not a keyboard action.
    // This fires with cut OR copy. In case of cut, the element has already been .cut()!
    this._component.on('element:copy', (componentId) => {
      console.info('[glass] element:copy', componentId)
      this._lastSelectedElement = this._component._elements.find(componentId)
      handleVirtualClipboard.call(this, 'copy')
    })

    // Since the current selected element can be deleted from the global menu, we need to keep it there
    this._component.on('element:selected', (componentId) => {
      console.info('[glass] element:selected', componentId)
      this._lastSelectedElement = this._component._elements.find(componentId)
    })

    // Since the current selected element can be deleted from the global menu, we need clear it there too
    this._component.on('element:unselected', (componentId) => {
      console.info('[glass] element:unselected', componentId)
      this._lastSelectedElement = null
      this.draw(true)
    })

    this.props.websocket.on('broadcast', (message) => {
      var oldTransform // Defined below // linter

      switch (message.name) {
        case 'component:reload':
          return this._component.moduleReplace((err) => {
            // Notify the plumbing that the module replacement here has finished, which should reactivate
            // the undo/redo queues which should be waiting for this to finish
            // Note how we do this whether or not we got an error from the action
            this.props.websocket.send({
              type: 'broadcast',
              name: 'component:reload:complete',
              from: 'glass'
            })

            if (err) {
              return console.error(err)
            }

            // The artboard size may have changed as a part of that, and since there are two sources of
            // truth for this (actual artboard, React mount for artboard), we have to update it here.
            var updatedArtboardSize = this._component.getContextSize()
            this.setState({
              mountWidth: updatedArtboardSize.width,
              mountHeight: updatedArtboardSize.height
            })
          })

        case 'view:zoom-in':
          oldTransform = this._component.getStageTransform()
          oldTransform.zoom = this.state.zoomXY * 1.25
          this._component.setStageTransform(oldTransform)
          return this.setState({ zoomXY: this.state.zoomXY * 1.25 })

        case 'view:zoom-out':
          oldTransform = this._component.getStageTransform()
          oldTransform.zoom = this.state.zoomXY / 1.25
          this._component.setStageTransform(oldTransform)
          return this.setState({ zoomXY: this.state.zoomXY / 1.25 })

        case 'drawing:setActive':
          return this.setState({
            activeDrawingTool: message.params[0],
            drawingIsModal: message.params[1]
          })
      }
    })

    this.props.websocket.on('method', (method, params, cb) => {
      return this._component.callMethod(method, params, cb)
    })

    this._comments.load((err) => {
      if (err) return void (0)
      this.setState({ comments: this._comments.comments })
    })

    this._ctxmenu.on('click', (action, event, element) => {
      switch (action) {
        case 'Add Comment':
          this._comments.build({ x: this._ctxmenu._menu.lastX, y: this._ctxmenu._menu.lastY })
          this.setState({ comments: this._comments.comments, doShowComments: true }, () => {
            this._ctxmenu.rebuild(this)
          })
          break
        case 'Hide Comments':
          this.setState({ doShowComments: !this.state.doShowComments }, () => {
            this._ctxmenu.rebuild(this)
          })
          break
        case 'Show Comments':
          this.setState({ doShowComments: !this.state.doShowComments }, () => {
            this._ctxmenu.rebuild(this)
          })
          break
        case 'Show Event Listeners':
          this.showEventHandlersEditor(event, element)
          break
      }
    })

    // Pasteable things are stored at the global level in the clipboard but we need that action to fire from the top level
    // so that all the views get the message, so we emit this as an event and then wait for the call to pasteThing
    this._ctxmenu.on('current-pasteable:request-paste', (data) => {
      this.props.websocket.send({
        type: 'broadcast',
        name: 'current-pasteable:request-paste',
        from: 'glass',
        data: data
      })
    })

    window.addEventListener('resize', lodash.throttle(() => {
      return this.handleWindowResize()
    }), 64)

    window.addEventListener('mouseup', this.windowMouseUpHandler.bind(this))
    window.addEventListener('mousemove', this.windowMouseMoveHandler.bind(this))
    window.addEventListener('mouseup', this.windowMouseUpHandler.bind(this))
    window.addEventListener('mousedown', this.windowMouseDownHandler.bind(this))
    window.addEventListener('click', this.windowClickHandler.bind(this))
    window.addEventListener('dblclick', this.windowDblClickHandler.bind(this))
    window.addEventListener('keydown', this.windowKeyDownHandler.bind(this))
    window.addEventListener('keyup', this.windowKeyUpHandler.bind(this))
    window.addEventListener('mouseout', this.windowMouseOutHandler.bind(this))

    window.onerror = (error) => {
      this._playing = false
      this.setState({ error })
    }

    // this.resetContainerDimensions(() => {
    //    this.drawLoop()
    // })
  }

  componentDidUpdate () {
    this.resetContainerDimensions()
  }

  handleWindowResize () {
    window.requestAnimationFrame(() => {
      this.resetContainerDimensions()
    })
  }

  showEventHandlersEditor (clickEvent, targetElement) {
    this.setState({
      targetElement: targetElement,
      isEventHandlerEditorOpen: true
    })
  }

  hideEventHandlersEditor () {
    this.setState({
      targetElement: null,
      isEventHandlerEditorOpen: false
    })
  }

  saveEventHandler (targetElement, eventName, handlerDescriptorSerialized) {
    let selectorName = 'haiku:' + targetElement.uid
    this._component.upsertEventHandler(selectorName, eventName, handlerDescriptorSerialized, { from: 'glass' }, () => {

    })
  }

  performPan (dx, dy) {
    var oldTransform = this._component.getStageTransform()
    oldTransform.pan.x = this.state.originalPanX + dx
    oldTransform.pan.y = this.state.originalPanY + dy
    this._component.setStageTransform(oldTransform)
    this.setState({
      panX: this.state.originalPanX + dx,
      panY: this.state.originalPanY + dy
    })
  }

  windowMouseOutHandler (nativeEvent) {
    if (this.isPreviewMode()) {
      return void (0)
    }

    var source = nativeEvent.relatedTarget || nativeEvent.toElement
    if (!source || source.nodeName === 'HTML') {
      // this.setState({
      //   isAnythingScaling: false,
      //   isAnythingRotating: false,
      //   controlActivation: null
      // })
      this._component._elements.hovered.dequeue()
    }
  }

  windowMouseMoveHandler (nativeEvent) {
    if (this.isPreviewMode() || this.state.isEventHandlerEditorOpen) {
      return void (0)
    }

    nativeEvent.preventDefault()
    this.handleMouseMove({ nativeEvent })
  }

  windowMouseUpHandler (nativeEvent) {
    if (this.isPreviewMode() || this.state.isEventHandlerEditorOpen) {
      return void (0)
    }

    nativeEvent.preventDefault()
    this.handleMouseUp({ nativeEvent })
  }

  windowMouseDownHandler (nativeEvent) {
    if (this.isPreviewMode() || this.state.isEventHandlerEditorOpen) {
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
    if (this.isPreviewMode() || this.state.isEventHandlerEditorOpen) {
      return void (0)
    }

    if (mousedownEvent.nativeEvent.button !== 0) return // left click only

    this.state.isMouseDown = true
    this.state.lastMouseDownTime = Date.now()
    var mousePos = this.storeAndReturnMousePosition(mousedownEvent, 'lastMouseDownPosition')

    if (this.state.activeDrawingTool !== 'pointer') {
      if (!this.state.drawingIsModal) {
        this.props.websocket.send({ type: 'broadcast', name: 'drawing:completed', from: 'glass' })
      }

      this._component.instantiateComponent(this.state.activeDrawingTool, {
        x: mousePos.x,
        y: mousePos.y,
        minimized: true
      }, { from: 'glass' }, (err, metadata, element) => {
        if (err) {
          return console.error(err)
        }

        // if the mouse is still down begin drag scaling
        if (this.state.isMouseDown) {
          // activate the bottom right control point, for scaling
          this.controlActivation({
            index: 8,
            event: mousedownEvent
          })
        }
      })
    } else {
      // climb the target path to find if a haiku element has been selected
      // NOTE: we want to make sure we are not selecting elements at the wrong context level
      var target = mousedownEvent.nativeEvent.target
      if ((typeof target.className === 'string') && target.className.indexOf('scale-cursor') !== -1) return

      while (target.hasAttribute && (!target.hasAttribute('source') || !target.hasAttribute('haiku-id') ||
             !this._component._elements.find(target.getAttribute('haiku-id')))) {
        target = target.parentNode
      }

      if (!target || !target.hasAttribute) {
        // If shift is down, that's constrained scaling. If cmd, that's rotation mode.
        if (!this.state.isKeyShiftDown && !this.state.isKeyCommandDown) {
          this._component._elements.unselectAllElements({ from: 'glass' })
        }

        return
      }

      if (target.hasAttribute('source') && target.hasAttribute('haiku-id') && target.parentNode !== this.refs.mount) {
        var haikuId = target.getAttribute('haiku-id')
        var contained = lodash.find(this._component._elements.where({ isSelected: true }),
            (element) => element.uid === haikuId)

        // we check if the element being clicked on is already in the selection, if it is we don't want
        // to clear the selection since it could be a grouped selection
        // If shift is down, that's constrained scaling. If cmd, that's rotation mode.
        if (!contained && (!this.state.isKeyShiftDown && !this.state.isKeyCommandDown)) {
          this._component._elements.unselectAllElements({ from: 'glass' })
        }

        if (!contained) {
          this._component.selectElement(haikuId, { from: 'glass' }, () => {})
        }
      }
    }
  }

  handleMouseUp (mouseupEvent) {
    if (this.isPreviewMode() || this.state.isEventHandlerEditorOpen) {
      return void (0)
    }

    this.state.isMouseDown = false
    this.state.lastMouseUpTime = Date.now()
    this.handleDragStop()
    this.setState({
      isAnythingScaling: false,
      isAnythingRotating: false,
      globalControlPointHandleClass: '',
      controlActivation: null
    })
    this.storeAndReturnMousePosition(mouseupEvent, 'lastMouseUpPosition')
  }

  handleClick (clickEvent) {
    if (this.isPreviewMode()) {
      return void (0)
    }
    this.storeAndReturnMousePosition(clickEvent)
  }

  handleDoubleClick (doubleClickEvent) {
    if (this.isPreviewMode()) {
      return void (0)
    }
    this.storeAndReturnMousePosition(doubleClickEvent)
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
    this._component._elements.unselectAllElements({ from: 'glass' })
  }

  handleKeySpace (nativeEvent, isDown) {
    this.setState({ isKeySpaceDown: isDown })
    // this._component._elements.drilldownIntoAlreadySelectedElement(this.state.mousePositionCurrent)
  }

  handleKeyLeftArrow (keyEvent) {
    var delta = keyEvent.shiftKey ? 5 : 1
    this._component._elements.where({ isSelected: true }).forEach((element) => {
      element.move(-delta, 0, this.state.mousePositionCurrent, this.state.mousePositionPrevious)
    })
  }

  handleKeyUpArrow (keyEvent) {
    var delta = keyEvent.shiftKey ? 5 : 1
    this._component._elements.where({ isSelected: true }).forEach((element) => {
      element.move(0, -delta, this.state.mousePositionCurrent, this.state.mousePositionPrevious)
    })
  }

  handleKeyRightArrow (keyEvent) {
    var delta = keyEvent.shiftKey ? 5 : 1
    this._component._elements.where({ isSelected: true }).forEach((element) => {
      element.move(delta, 0, this.state.mousePositionCurrent, this.state.mousePositionPrevious)
    })
  }

  handleKeyDownArrow (keyEvent) {
    var delta = keyEvent.shiftKey ? 5 : 1
    this._component._elements.where({ isSelected: true }).forEach((element) => {
      element.move(0, delta, this.state.mousePositionCurrent, this.state.mousePositionPrevious)
    })
  }

  handleKeyDown (keyEvent) {
    if (this.refs.eventHandlerEditor) {
      if (this.refs.eventHandlerEditor.willHandleExternalKeydownEvent(keyEvent)) {
        return void (0)
      }
    }

    switch (keyEvent.nativeEvent.which) {
      case 27: return this.handleKeyEscape()
      case 32: return this.handleKeySpace(keyEvent.nativeEvent, true)
      case 37: return this.handleKeyLeftArrow(keyEvent.nativeEvent)
      case 38: return this.handleKeyUpArrow(keyEvent.nativeEvent)
      case 39: return this.handleKeyRightArrow(keyEvent.nativeEvent)
      case 40: return this.handleKeyDownArrow(keyEvent.nativeEvent)
      case 46: return this.handleKeyDelete()
      case 8: return this.handleKeyDelete()
      case 13: return this.handleKeyEnter()
      case 16: return this.handleKeyShift(keyEvent.nativeEvent, true)
      case 17: return this.handleKeyCtrl(keyEvent.nativeEvent, true)
      case 18: return this.handleKeyAlt(keyEvent.nativeEvent, true)
      case 224: return this.handleKeyCommand(keyEvent.nativeEvent, true)
      case 91: return this.handleKeyCommand(keyEvent.nativeEvent, true)
      case 93: return this.handleKeyCommand(keyEvent.nativeEvent, true)
      default: return null
    }
  }

  handleKeyUp (keyEvent) {
    if (this.refs.eventHandlerEditor) {
      if (this.refs.eventHandlerEditor.willHandleExternalKeydownEvent(keyEvent)) {
        return void (0)
      }
    }

    switch (keyEvent.nativeEvent.which) {
      case 32: return this.handleKeySpace(keyEvent.nativeEvent, false)
      case 16: return this.handleKeyShift(keyEvent.nativeEvent, false)
      case 17: return this.handleKeyCtrl(keyEvent.nativeEvent, false)
      case 18: return this.handleKeyAlt(keyEvent.nativeEvent, false)
      case 224: return this.handleKeyCommand(keyEvent.nativeEvent, false)
      case 91: return this.handleKeyCommand(keyEvent.nativeEvent, false)
      case 93: return this.handleKeyCommand(keyEvent.nativeEvent, false)
      default: return null
    }
  }

  handleKeyEnter () {
    // noop for now
  }

  handleKeyCommand (nativeEvent, isDown) {
    var controlActivation = this.state.controlActivation
    if (controlActivation) {
      controlActivation.cmd = isDown
    }
    this.setState({ isKeyCommandDown: isDown, controlActivation })
  }

  handleKeyShift (nativeEvent, isDown) {
    var controlActivation = this.state.controlActivation
    if (controlActivation) {
      controlActivation.shift = isDown
    }
    this.setState({ isKeyShiftDown: isDown, controlActivation })
  }

  handleKeyCtrl (nativeEvent, isDown) {
    var controlActivation = this.state.controlActivation
    if (controlActivation) {
      controlActivation.ctrl = isDown
    }
    this.setState({ isKeyCtrlDown: isDown, controlActivation })
  }

  handleKeyAlt (nativeEvent, isDown) {
    var controlActivation = this.state.controlActivation
    if (controlActivation) {
      controlActivation.alt = isDown
    }
    this.setState({ isKeyAltDown: isDown, controlActivation })
  }

  handleClickStageName () {
    this._component._elements.unselectAllElements({ from: 'glass' })
    var artboard = this._component._elements.findRoots()[0]
    this._component._elements.clicked.add(artboard)
    artboard.select({ from: 'glass' })
  }

  handleMouseOverStageName () {
    this.setState({ isStageNameHovering: true })
  }

  handleMouseOutStageName () {
    this.setState({ isStageNameHovering: false })
  }

  handleMouseMove (mousemoveEvent) {
    const zoom = this.state.zoomXY || 1
    const lastMouseDownPosition = this.state.lastMouseDownPosition
    const mousePositionCurrent = this.storeAndReturnMousePosition(mousemoveEvent)
    const mousePositionPrevious = this.state.mousePositionPrevious || mousePositionCurrent
    let dx = (mousePositionCurrent.x - mousePositionPrevious.x) / zoom
    let dy = (mousePositionCurrent.y - mousePositionPrevious.y) / zoom
    if (dx === 0 && dy === 0) return mousePositionCurrent

    // if (dx !== 0) dx = Math.round(this.state.zoomXY / dx)
    // if (dy !== 0) dy = Math.round(this.state.zoomXY / dy)
    // If we got this far, the mouse has changed its position from the most recent mousedown
    if (this.state.isMouseDown) {
      this.handleDragStart()
    }
    if (this.state.isMouseDragging && this.state.isMouseDown) {
      if (this.state.isKeySpaceDown && this.state.stageMouseDown) {
        this.performPan(
          mousemoveEvent.nativeEvent.clientX - this.state.stageMouseDown.x,
          mousemoveEvent.nativeEvent.clientY - this.state.stageMouseDown.y
        )
      } else {
        var selected = this._component._elements.where({ isSelected: true })
        if (selected.length > 0) {
          selected.forEach((element) => {
            element.drag(dx, dy, mousePositionCurrent, mousePositionPrevious, lastMouseDownPosition, this.state)
          })
        }
      }
    }
    return mousePositionCurrent
  }

  handleKeyDelete () {
    if (this.isPreviewMode()) {
      return void (0)
    }
    this._component._elements.where({ isSelected: true }).forEach((element) => {
      element.remove()
    })
  }

  resetContainerDimensions (cb) {
    if (!this.refs.container) return
    var w = this.refs.container.clientWidth
    var h = this.refs.container.clientHeight
    var mountX = (w - this.state.mountWidth) / 2
    var mountY = (h - this.state.mountHeight) / 2
    if (w !== this.state.containerWidth || h !== this.state.containerHeight || mountX !== this.state.mountX || mountY !== this.state.mountY) {
      this.setState({ containerWidth: w, containerHeight: h, mountX, mountY }, cb)
    }
  }

  getArtboardRect () {
    return {
      left: this.state.mountX,
      right: this.state.mountX + this.state.mountWidth,
      top: this.state.mountY,
      bottom: this.state.mountY + this.state.mountHeight,
      width: this.state.mountWidth,
      height: this.state.mountHeight
    }
  }

  getSelectionMarqueeSize () {
    if (!this.state.mousePositionCurrent || !this.state.lastMouseDownPosition) {
      return { x: 0, y: 0, width: 0, height: 0 }
    }
    return {
      x: this.state.lastMouseDownPosition.x + this.getArtboardRect().left,
      y: this.state.lastMouseDownPosition.y + this.getArtboardRect().top,
      width: this.state.mousePositionCurrent.x - this.state.lastMouseDownPosition.x,
      height: this.state.mousePositionCurrent.y - this.state.lastMouseDownPosition.y
    }
  }

  controlActivation (controlActivation) {
    var artboard = this.getArtboardRect()
    this.setState({
      isAnythingRotating: this.state.isKeyCommandDown,
      isAnythingScaling: !this.state.isKeyCommandDown,
      controlActivation: {
        shift: this.state.isKeyShiftDown,
        ctrl: this.state.isKeyCtrlDown,
        cmd: this.state.isKeyCommandDown,
        alt: this.state.isKeyAltDown,
        index: controlActivation.index,
        arboard: artboard,
        client: {
          x: controlActivation.event.clientX,
          y: controlActivation.event.clientY
        },
        coords: {
          x: controlActivation.event.clientX - artboard.left,
          y: controlActivation.event.clientY - artboard.top
        }
      }
    })
  }

  storeAndReturnMousePosition (mouseEvent, additionalPositionTrackingState) {
    if (!this.refs.container) return null // We haven't mounted yet, no size available
    this.state.mousePositionPrevious = this.state.mousePositionCurrent
    const mousePositionCurrent = getLocalDomEventPosition(mouseEvent.nativeEvent, this.refs.container)
    mousePositionCurrent.clientX = mouseEvent.nativeEvent.clientX
    mousePositionCurrent.clientY = mouseEvent.nativeEvent.clientY
    mousePositionCurrent.x -= this.getArtboardRect().left
    mousePositionCurrent.y -= this.getArtboardRect().top
    this.state.mousePositionCurrent = mousePositionCurrent
    if (additionalPositionTrackingState) this.state[additionalPositionTrackingState] = mousePositionCurrent
    return mousePositionCurrent
  }

  drawOverlays (force) {
    var selected = this._component._elements.selected.all()
    if (force || selected.length > 0) {
      var container = this._haikuRenderer.createContainer(this.refs.overlay)
      var parts = this.buildDrawnOverlays()
      var overlay = {
        elementName: 'div',
        attributes: {
          id: 'haiku-glass-overlay-root',
          style: {
            transform: 'matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1)',
            position: 'absolute',
            overflow: 'visible',
            left: this.state.mountX + 'px',
            top: this.state.mountY + 'px',
            width: this.state.mountWidth + 'px',
            height: this.state.mountHeight + 'px'
          }
        },
        children: parts
      }
      this._haikuRenderer.render(this.refs.overlay, container, overlay, this._haikuContext.component, false)
    }
  }

  // This method creates objects which represent Haiku Player rendering instructions for displaying all of
  // the visual effects that sit above the stage. (Transform controls, etc.) The Haiku Player is sort of a
  // hybrid of React Fiber and Famous Engine. It has a virtual DOM tree of elements like {elementName: 'div', attributes: {}, []},
  // and flushes updates to them on each frame. So what _this method_ does is just build those objects and then
  // these get passed into a Haiku Player render method (see above). LONG STORY SHORT: This creates a flat list of
  // nodes that get rendered to the DOM by the Haiku Player.
  buildDrawnOverlays () {
    var overlays = []
    // Don't show any overlays if we're in preview (aka 'live') interactionMode
    if (this.isPreviewMode()) {
      return overlays
    }
    var selected = this._component._elements.selected.all()
    if (selected.length > 0) {
      var points
      if (selected.length === 1) {
        var element = selected[0]
        if (element.isRenderableType()) {
          points = element.getPointsTransformed(true)
          this.renderMorphPointsOverlay(points, overlays)
        } else {
          points = element.getBoxPointsTransformed()
          var rotationZ = element.getPropertyValue('rotation.z') || 0
          var scaleX = element.getPropertyValue('scale.x')
          if (scaleX === undefined || scaleX === null) scaleX = 1
          var scaleY = element.getPropertyValue('scale.y')
          if (scaleY === undefined || scaleY === null) scaleY = 1
          this.renderTransformBoxOverlay(points, overlays, element.canRotate(), this.state.isKeyCommandDown, true, rotationZ, scaleX, scaleY)
        }
      } else {
        points = []
        selected.forEach((element) => {
          element.getBoxPointsTransformed().forEach((point) => points.push(point))
        })
        points = this._component._elements.getBoundingBoxPoints(points)
        this.renderTransformBoxOverlay(points, overlays, false, this.state.isKeyCommandDown, false, 0, 1, 1)
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
    var scale = 1 / (this.state.zoomXY || 1)
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
      throw new Error('Unable to determine handle class due to bad scale values')
    }

    var specifiedPointGroup = CLOCKWISE_CONTROL_POINTS[keyOfPointGroup]

    var rotationDegrees = this._component._elements.getRotationIn360(rotationZ)
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

  renderTransformBoxOverlay (points, overlays, canRotate, isRotationModeOn, canControlHandles, rotationZ, scaleX, scaleY) {
    var corners = [points[0], points[2], points[8], points[6]]
    corners.forEach((point, index) => {
      var next = corners[(index + 1) % corners.length]
      overlays.push(this.renderLine(point.x, point.y, next.x, next.y))
    })
    points.forEach((point, index) => {
      if (index !== 4) {
        overlays.push(this.renderControlPoint(point.x, point.y, index, canControlHandles && this.getHandleClass(index, canRotate, isRotationModeOn, rotationZ, scaleX, scaleY)))
      }
    })
  }

  getGlobalControlPointHandleClass () {
    if (!this.state.controlActivation) return ''
    var controlIndex = this.state.controlActivation.index
    var isRotationModeOn = this.state.isKeyCommandDown
    var selectedElements = this._component._elements.selected.all()
    if (selectedElements.length === 1) {
      var selectedElement = selectedElements[0]
      var rotationZ = selectedElement.getPropertyValue('rotation.z') || 0
      var scaleX = selectedElement.getPropertyValue('scale.x')
      if (scaleX === undefined || scaleX === null) scaleX = 1
      var scaleY = selectedElement.getPropertyValue('scale.y')
      if (scaleY === undefined || scaleY === null) scaleY = 1
      return this.getHandleClass(controlIndex, true, isRotationModeOn, rotationZ, scaleX, scaleY)
    } else {
      return this.getHandleClass(controlIndex, false, isRotationModeOn, 0, 1, 1)
    }
  }

  getStageTransform () {
    var a = this.state.zoomXY || 1
    var c = this.state.panX || 0
    var d = this.state.panY || 0

    return 'matrix3d(' +
      [a, 0, 0, 0,
        0, a, 0, 0,
        0, 0, 1, 0,
        c, d, 0, 1].join(',') + ')'
  }

  isPreviewMode () {
    return this._component._interactionMode.type === 'live'
  }

  getCursorCssRule () {
    if (this.isPreviewMode()) return 'default'
    return (this.state.stageMouseDown) ? '-webkit-grabbing' : '-webkit-grab'
  }

  render () {
    var drawingClassName = (this.state.activeDrawingTool !== 'pointer') ? 'draw-shape' : ''

    return (
      <div
        onMouseOver={() => this.setState({ isKeyCommandDown: false })}>

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
            {Math.round(this.state.zoomXY / 1 * 100)}%
            </div>
          : ''}

        <div
          ref='container'
          id='haiku-glass-stage-container'
          className={this.getGlobalControlPointHandleClass()}
          onMouseDown={(mouseDown) => {
            if (!this.isPreviewMode()) {
              if (mouseDown.nativeEvent.target && mouseDown.nativeEvent.target.id === 'full-background') {
                this._component._elements.unselectAllElements({ from: 'glass' })
              }
              if (this.state.isEventHandlerEditorOpen) {
                this.hideEventHandlersEditor()
              }
              this.setState({
                originalPanX: this.state.panX,
                originalPanY: this.state.panY,
                stageMouseDown: {
                  x: mouseDown.nativeEvent.clientX,
                  y: mouseDown.nativeEvent.clientY
                }
              })
            }
          }}
          onMouseUp={() => {
            if (!this.isPreviewMode()) {
              this.setState({ stageMouseDown: null })
            }
          }}
          onMouseLeave={() => {
            if (!this.isPreviewMode()) {
              this.setState({ stageMouseDown: null })
            }
          }}
          style={{
            width: '100%',
            height: '100%',
            overflow: 'hidden', // TODO:  if/when we support native scrolling here,
                                // we'll need to figure out some phantom reflowing/jitter issues
            position: 'absolute',
            top: 0,
            left: 0,
            transform: this.getStageTransform(),
            cursor: this.getCursorCssRule(),
            backgroundColor: (this.isPreviewMode()) ? 'white' : 'inherit'
          }}>

          {(!this.isPreviewMode())
            ? <svg
              id='haiku-glass-stage-background-live'
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: this.state.containerWidth,
                height: this.state.containerHeight
              }}>
              <defs>
                <filter id='background-blur' x='-50%' y='-50%' width='200%' height='200%'>
                  <feGaussianBlur in='SourceAlpha' stdDeviation='2' result='blur' />
                  <feFlood floodColor='rgba(33, 45, 49, .5)' floodOpacity='0.8' result='offsetColor' />
                  <feComposite in='offsetColor' in2='blur' operator='in' result='totalBlur' />
                  <feBlend in='SourceGraphic' in2='totalBlur' mode='normal' />
                </filter>
              </defs>
              <rect id='full-background' x='0' y='0' width='100%' height='100%' fill='transparent' />
              <rect id='mount-background-blur' filter='url(#background-blur)' x={this.state.mountX} y={this.state.mountY} width={this.state.mountWidth} height={this.state.mountHeight} fill='white' />
              <rect id='mount-background' x={this.state.mountX} y={this.state.mountY} width={this.state.mountWidth} height={this.state.mountHeight} fill='white' />
            </svg>
            : <div
              id='haiku-glass-stage-background-preview'
              style={{
                position: 'relative',
                top: 0,
                left: 0,
                width: this.state.containerWidth,
                height: this.state.containerHeight
              }}>
              <div
                id='haiku-glass-stage-background-preview-border'
                style={{
                  position: 'absolute',
                  top: this.state.mountY,
                  left: this.state.mountX,
                  width: this.state.mountWidth,
                  height: this.state.mountHeight,
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
                top: this.state.mountY - 19,
                left: this.state.mountX + 2,
                height: 20,
                width: 120,
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
                {this.props.projectName}
              </text>
            </svg>
            : ''}

          {(!this.isPreviewMode())
            ? <svg
              id='haiku-glass-background-colorator'
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                zIndex: 20,
                width: this.state.containerWidth,
                height: this.state.containerHeight,
                pointerEvents: 'none'
              }}>
              <path d={`M0,0V${this.state.containerHeight}H${this.state.containerWidth}V0ZM${this.state.mountX + this.state.mountWidth},${this.state.mountY + this.state.mountHeight}H${this.state.mountX}V${this.state.mountY}H${this.state.mountX + this.state.mountWidth}Z`}
                style={{'fill': '#111', 'opacity': 0.1, 'pointerEvents': 'none'}} />
            </svg>
            : ''}

          {(!this.isPreviewMode())
            ? <svg
              id='haiku-glass-moat-opacitator'
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                zIndex: 1010,
                width: this.state.containerWidth,
                height: this.state.containerHeight,
                pointerEvents: 'none'
              }}>
              <path d={`M0,0V${this.state.containerHeight}H${this.state.containerWidth}V0ZM${this.state.mountX + this.state.mountWidth},${this.state.mountY + this.state.mountHeight}H${this.state.mountX}V${this.state.mountY}H${this.state.mountX + this.state.mountWidth}Z`}
                style={{
                  'fill': '#FFF',
                  'opacity': 0.5,
                  'pointerEvents': 'none'
                }} />
              <rect
                x={this.state.mountX - 1}
                y={this.state.mountY - 1}
                width={this.state.mountWidth + 2}
                height={this.state.mountHeight + 2}
                style={{
                  strokeWidth: 1.5,
                  fill: 'none',
                  stroke: Palette.LIGHT_PINK,
                  opacity: this.state.isStageNameHovering && !this.state.isStageSelected ? 0.75 : 0
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
                top: 0,
                left: 0,
                zIndex: 2000,
                overflow: 'hidden',
                width: '100%',
                height: '100%' }}
                >
              {this.state.comments.map((comment, index) => {
                return <Comment index={index} comment={comment} key={`comment-${comment.id}`} model={this._comments} />
              })}
            </div>
            : ''}

          {(!this.isPreviewMode() && this.state.isEventHandlerEditorOpen)
            ? <EventHandlerEditor
              ref='eventHandlerEditor'
              element={this.state.targetElement}
              save={this.saveEventHandler.bind(this)}
              close={this.hideEventHandlersEditor.bind(this)}
                />
            : ''}

          {(!this.isPreviewMode())
            ? <div
              ref='overlay'
              id='haiku-glass-overlay-mount'
              height={this.state.containerHeight}
              width={this.state.containerWidth}
              style={{
                transform: 'matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1)',
                pointerEvents: 'none', // This needs to be un-set for surface elements that take mouse interaction
                position: 'relative',
                overflow: 'visible',
                top: 0,
                left: 0,
                zIndex: 1000,
                opacity: (this.state.isEventHandlerEditorOpen) ? 0.5 : 1.0
              }} />
            : ''}

          <div
            ref='mount'
            id='hot-component-mount'
            className={drawingClassName}
            style={{
              position: 'absolute',
              left: this.state.mountX,
              top: this.state.mountY,
              width: this.state.mountWidth,
              height: this.state.mountHeight,
              overflow: 'visible',
              zIndex: 60,
              opacity: (this.state.isEventHandlerEditorOpen) ? 0.5 : 1.0
            }} />

          {(this.state.error)
            ? <div
              id='haiku-glass-exception-bar'
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                height: 35,
                backgroundColor: Palette.RED,
                color: Palette.SUNSTONE,
                textAlign: 'center',
                width: '100%',
                zIndex: 9999,
                overflow: 'hidden',
                padding: '9px 20px 0',
                whiteSpace: 'nowrap'
              }}>
              <button
                style={{
                  textTransform: 'none',
                  color: Palette.RED_DARKER,
                  fontFamily: 'Arial',
                  fontWeight: 'bold',
                  borderRadius: '50%',
                  border: '1px solid ' + Palette.RED_DARKER,
                  cursor: 'pointer',
                  width: 15,
                  paddingLeft: 1
                }}
                onClick={() => {
                  this.setState({ error: null })
                }}>
                  x
                </button><span>{' '}</span>
              {this.state.error}
            </div>
            : ''}
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
