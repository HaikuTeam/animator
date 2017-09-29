import React from 'react'
import Color from 'color'
import lodash from 'lodash'
import archy from 'archy'
import { DraggableCore } from 'react-draggable'

import DOMSchema from '@haiku/player/lib/properties/dom/schema'
import DOMFallbacks from '@haiku/player/lib/properties/dom/fallbacks'
import expressionToRO from '@haiku/player/lib/reflection/expressionToRO'

import TimelineProperty from 'haiku-bytecode/src/TimelineProperty'
import BytecodeActions from 'haiku-bytecode/src/actions'
import ActiveComponent from 'haiku-serialization/src/model/ActiveComponent'

import {
  nextPropItem,
  getItemComponentId,
  getItemPropertyName
} from './helpers/ItemHelpers'

import getMaximumMs from './helpers/getMaximumMs'
import millisecondToNearestFrame from './helpers/millisecondToNearestFrame'
import clearInMemoryBytecodeCaches from './helpers/clearInMemoryBytecodeCaches'
import humanizePropertyName from './helpers/humanizePropertyName'
import getPropertyValueDescriptor from './helpers/getPropertyValueDescriptor'
import getMillisecondModulus from './helpers/getMillisecondModulus'
import getFrameModulus from './helpers/getFrameModulus'
import formatSeconds from './helpers/formatSeconds'
import roundUp from './helpers/roundUp'

import truncate from './helpers/truncate'
import Palette from './DefaultPalette'
import KeyframeSVG from './icons/KeyframeSVG'

import {
  EaseInBackSVG,
  EaseInOutBackSVG,
  EaseOutBackSVG,
  EaseInBounceSVG,
  EaseInOutBounceSVG,
  EaseOutBounceSVG,
  EaseInElasticSVG,
  EaseInOutElasticSVG,
  EaseOutElasticSVG,
  EaseInExpoSVG,
  EaseInOutExpoSVG,
  EaseOutExpoSVG,
  EaseInCircSVG,
  EaseInOutCircSVG,
  EaseOutCircSVG,
  EaseInCubicSVG,
  EaseInOutCubicSVG,
  EaseOutCubicSVG,
  EaseInQuadSVG,
  EaseInOutQuadSVG,
  EaseOutQuadSVG,
  EaseInQuartSVG,
  EaseInOutQuartSVG,
  EaseOutQuartSVG,
  EaseInQuintSVG,
  EaseInOutQuintSVG,
  EaseOutQuintSVG,
  EaseInSineSVG,
  EaseInOutSineSVG,
  EaseOutSineSVG,
  LinearSVG
} from './icons/CurveSVGS'

import DownCarrotSVG from './icons/DownCarrotSVG'
import RightCarrotSVG from './icons/RightCarrotSVG'
import ControlsArea from './ControlsArea'
import ContextMenu from './ContextMenu'
import ExpressionInput from './ExpressionInput'
import ClusterInputField from './ClusterInputField'
import PropertyInputField from './PropertyInputField'

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
  propertiesWidth: 300,
  timelinesWidth: 870,
  rowHeight: 25,
  inputCellWidth: 75,
  meterHeight: 25,
  controlsHeight: 42,
  visibleFrameRange: [0, 60],
  currentFrame: 0,
  maxFrame: null,
  durationTrim: 0,
  framesPerSecond: 60,
  timeDisplayMode: 'frames', // or 'frames'
  currentTimelineName: 'Default',
  isPlayerPlaying: false,
  playerPlaybackSpeed: 1.0,
  isShiftKeyDown: false,
  isCommandKeyDown: false,
  isControlKeyDown: false,
  isAltKeyDown: false,
  avoidTimelinePointerEvents: false,
  showHorzScrollShadow: false,
  selectedNodes: {},
  expandedNodes: {},
  activatedRows: {},
  hiddenNodes: {},
  inputSelected: null,
  inputFocused: null,
  expandedPropertyClusters: {},
  activeKeyframes: [],
  reifiedBytecode: null,
  serializedBytecode: null
}

const CURVESVGS = {
  EaseInBackSVG,
  EaseInBounceSVG,
  EaseInCircSVG,
  EaseInCubicSVG,
  EaseInElasticSVG,
  EaseInExpoSVG,
  EaseInQuadSVG,
  EaseInQuartSVG,
  EaseInQuintSVG,
  EaseInSineSVG,
  EaseInOutBackSVG,
  EaseInOutBounceSVG,
  EaseInOutCircSVG,
  EaseInOutCubicSVG,
  EaseInOutElasticSVG,
  EaseInOutExpoSVG,
  EaseInOutQuadSVG,
  EaseInOutQuartSVG,
  EaseInOutQuintSVG,
  EaseInOutSineSVG,
  EaseOutBackSVG,
  EaseOutBounceSVG,
  EaseOutCircSVG,
  EaseOutCubicSVG,
  EaseOutElasticSVG,
  EaseOutExpoSVG,
  EaseOutQuadSVG,
  EaseOutQuartSVG,
  EaseOutQuintSVG,
  EaseOutSineSVG,
  LinearSVG
}

/**
 * Hey! If you want to ADD any properties here, you might also need to update the dictionary in
 * haiku-bytecode/src/properties/dom/schema,
 * haiku-bytecode/src/properties/dom/fallbacks,
 * or they might not show up in the view.
 */

const ALLOWED_PROPS = {
  'translation.x': true,
  'translation.y': true,
  // 'translation.z': true, // This doesn't work for some reason, so leaving it out
  'rotation.z': true,
  'rotation.x': true,
  'rotation.y': true,
  'scale.x': true,
  'scale.y': true,
  'opacity': true,
  // 'shown': true,
  'backgroundColor': true
  // 'color': true,
  // 'fill': true,
  // 'stroke': true
}

const CLUSTERED_PROPS = {
  'mount.x': 'mount',
  'mount.y': 'mount',
  'mount.z': 'mount',
  'align.x': 'align',
  'align.y': 'align',
  'align.z': 'align',
  'origin.x': 'origin',
  'origin.y': 'origin',
  'origin.z': 'origin',
  'translation.x': 'translation',
  'translation.y': 'translation',
  'translation.z': 'translation', // This doesn't work for some reason, so leaving it out
  'rotation.x': 'rotation',
  'rotation.y': 'rotation',
  'rotation.z': 'rotation',
  // 'rotation.w': 'rotation', // Probably easiest not to let the user have control over quaternion math
  'scale.x': 'scale',
  'scale.y': 'scale',
  'scale.z': 'scale',
  'sizeMode.x': 'sizeMode',
  'sizeMode.y': 'sizeMode',
  'sizeMode.z': 'sizeMode',
  'sizeProportional.x': 'sizeProportional',
  'sizeProportional.y': 'sizeProportional',
  'sizeProportional.z': 'sizeProportional',
  'sizeDifferential.x': 'sizeDifferential',
  'sizeDifferential.y': 'sizeDifferential',
  'sizeDifferential.z': 'sizeDifferential',
  'sizeAbsolute.x': 'sizeAbsolute',
  'sizeAbsolute.y': 'sizeAbsolute',
  'sizeAbsolute.z': 'sizeAbsolute',
  'style.overflowX': 'overflow',
  'style.overflowY': 'overflow'
}

const CLUSTER_NAMES = {
  'mount': 'Mount',
  'align': 'Align',
  'origin': 'Origin',
  'translation': 'Position',
  'rotation': 'Rotation',
  'scale': 'Scale',
  'sizeMode': 'Sizing Mode',
  'sizeProportional': 'Size %',
  'sizeDifferential': 'Size +/-',
  'sizeAbsolute': 'Size',
  'overflow': 'Overflow'
}

const ALLOWED_PROPS_TOP_LEVEL = {
  'sizeAbsolute.x': true,
  'sizeAbsolute.y': true,
  // Enable these as such a time as we can represent them visually in the glass
  // 'style.overflowX': true,
  // 'style.overflowY': true,
  'backgroundColor': true,
  'opacity': true
}

const ALLOWED_TAGNAMES = {
  div: true,
  svg: true,
  g: true,
  rect: true,
  circle: true,
  ellipse: true,
  line: true,
  polyline: true,
  polygon: true
}

const THROTTLE_TIME = 17 // ms

function visit (node, visitor) {
  if (node.children) {
    for (var i = 0; i < node.children.length; i++) {
      var child = node.children[i]
      if (child && typeof child !== 'string') {
        visitor(child)
        visit(child, visitor)
      }
    }
  }
}

class Timeline extends React.Component {
  constructor (props) {
    super(props)

    this.state = lodash.assign({}, DEFAULTS)
    this.ctxmenu = new ContextMenu(window, this)

    this.emitters = [] // Array<{eventEmitter:EventEmitter, eventName:string, eventHandler:Function}>

    this._component = new ActiveComponent({
      alias: 'timeline',
      folder: this.props.folder,
      userconfig: this.props.userconfig,
      websocket: this.props.websocket,
      platform: window,
      envoy: this.props.envoy,
      WebSocket: window.WebSocket
    })

    // Since we store accumulated keyframe movements, we can send the websocket update in batches;
    // This improves performance and avoids unnecessary updates to the over views
    this.debouncedKeyframeMoveAction = lodash.throttle(this.debouncedKeyframeMoveAction.bind(this), 250)
    this.updateState = this.updateState.bind(this)
    this.handleRequestElementCoordinates = this.handleRequestElementCoordinates.bind(this)
    window.timeline = this
  }

  flushUpdates () {
    if (!this.state.didMount) {
      return void (0)
    }
    if (Object.keys(this.updates).length < 1) {
      return void (0)
    }
    for (const key in this.updates) {
      if (this.state[key] !== this.updates[key]) {
        this.changes[key] = this.updates[key]
      }
    }
    var cbs = this.callbacks.splice(0)
    this.setState(this.updates, () => {
      this.clearChanges()
      cbs.forEach((cb) => cb())
    })
  }

  updateState (updates, cb) {
    for (const key in updates) {
      this.updates[key] = updates[key]
    }
    if (cb) {
      this.callbacks.push(cb)
    }
    this.flushUpdates()
  }

  clearChanges () {
    for (const k1 in this.updates) delete this.updates[k1]
    for (const k2 in this.changes) delete this.changes[k2]
  }

  updateTime (currentFrame) {
    this.setState({ currentFrame })
  }

  setRowCacheActivation ({ componentId, propertyName }) {
    this._rowCacheActivation = { componentId, propertyName }
    return this._rowCacheActivation
  }

  unsetRowCacheActivation ({ componentId, propertyName }) {
    this._rowCacheActivation = null
    return this._rowCacheActivation
  }

  /*
   * lifecycle/events
   * --------- */

  componentWillUnmount () {
    // Clean up subscriptions to prevent memory leaks and react warnings
    this.emitters.forEach((tuple) => {
      tuple[0].removeListener(tuple[1], tuple[2])
    })
    this.state.didMount = false

    this.tourClient.off('tour:requestElementCoordinates', this.handleRequestElementCoordinates)
    this._envoyClient.closeConnection()

    // Scroll.Events.scrollEvent.remove('begin');
    // Scroll.Events.scrollEvent.remove('end');
  }

  componentDidMount () {
    this.setState({
      didMount: true
    })

    this.setState({
      timelinesWidth: document.body.clientWidth - this.state.propertiesWidth
    })

    window.addEventListener('resize', lodash.throttle(() => {
      if (this.state.didMount) {
        this.setState({ timelinesWidth: document.body.clientWidth - this.state.propertiesWidth })
      }
    }, THROTTLE_TIME))

    this.addEmitterListener(this.props.websocket, 'broadcast', (message) => {
      if (message.folder !== this.props.folder) return void (0)
      switch (message.name) {
        case 'component:reload': return this._component.mountApplication()
        default: return void (0)
      }
    })

    this.props.websocket.on('method', (method, params, cb) => {
      console.info('[timeline] action received', method, params)
      return this._component.callMethod(method, params, cb)
    })

    this._component.on('component:updated', (maybeComponentIds, maybeTimelineName, maybeTimelineTime, maybePropertyNames, maybeMetadata) => {
      console.info('[timeline] component updated', maybeComponentIds, maybeTimelineName, maybeTimelineTime, maybePropertyNames, maybeMetadata)

      // If we don't clear caches then the timeline fields might not update right after keyframe deletions
      this._component._clearCaches()

      var reifiedBytecode = this._component.getReifiedBytecode()
      var serializedBytecode = this._component.getSerializedBytecode()
      clearInMemoryBytecodeCaches(reifiedBytecode)

      this.setState({ reifiedBytecode, serializedBytecode })

      if (maybeMetadata && maybeMetadata.from !== 'timeline') {
        if (maybeComponentIds && maybeTimelineName && maybePropertyNames) {
          maybeComponentIds.forEach((componentId) => {
            this.minionUpdatePropertyValue(componentId, maybeTimelineName, maybeTimelineTime || 0, maybePropertyNames)
          })
        }
      }
    })

    this._component.on('element:selected', (componentId) => {
      console.info('[timeline] element selected', componentId)
      this.minionSelectElement({ componentId })
    })

    this._component.on('element:unselected', (componentId) => {
      console.info('[timeline] element unselected', componentId)
      this.minionUnselectElement({ componentId })
    })

    this._component.on('component:mounted', () => {
      var reifiedBytecode = this._component.getReifiedBytecode()
      var serializedBytecode = this._component.getSerializedBytecode()
      console.info('[timeline] component mounted', reifiedBytecode)
      this.rehydrateBytecode(reifiedBytecode, serializedBytecode)
      // this.updateTime(this.state.currentFrame)
    })

    // component:mounted fires when this finishes without error
    this._component.mountApplication()

    this._component.on('envoy:tourClientReady', (client) => {
      client.on('tour:requestElementCoordinates', this.handleRequestElementCoordinates)

      setTimeout(() => {
        client.next()
      })

      this.tourClient = client
    })

    document.addEventListener('paste', (pasteEvent) => {
      console.info('[timeline] paste heard')
      let tagname = pasteEvent.target.tagName.toLowerCase()
      let editable = pasteEvent.target.getAttribute('contenteditable') // Our input fields are <span>s
      if (tagname === 'input' || tagname === 'textarea' || editable) {
        console.info('[timeline] paste via default')
        // This is probably a property input, so let the default action happen
        // TODO: Make this check less brittle
      } else {
        // Notify creator that we have some content that the person wishes to paste on the stage;
        // the top level needs to handle this because it does content type detection.
        console.info('[timeline] paste delegated to plumbing')
        pasteEvent.preventDefault()
        this.props.websocket.send({
          type: 'broadcast',
          name: 'current-pasteable:request-paste',
          from: 'glass',
          data: null // This can hold coordinates for the location of the paste
        })
      }
    })

    document.body.addEventListener('keydown', this.handleKeyDown.bind(this), false)

    document.body.addEventListener('keyup', this.handleKeyUp.bind(this))

    this.addEmitterListener(this.ctxmenu, 'createKeyframe', (componentId, timelineName, elementName, propertyName, startMs) => {
      var frameInfo = this.getFrameInfo()
      var nearestFrame = millisecondToNearestFrame(startMs, frameInfo.mspf)
      var finalMs = Math.round(nearestFrame * frameInfo.mspf)
      this.executeBytecodeActionCreateKeyframe(componentId, timelineName, elementName, propertyName, finalMs/* value, curve, endms, endvalue */)
    })
    this.addEmitterListener(this.ctxmenu, 'splitSegment', (componentId, timelineName, elementName, propertyName, startMs) => {
      var frameInfo = this.getFrameInfo()
      var nearestFrame = millisecondToNearestFrame(startMs, frameInfo.mspf)
      var finalMs = Math.round(nearestFrame * frameInfo.mspf)
      this.executeBytecodeActionSplitSegment(componentId, timelineName, elementName, propertyName, finalMs)
    })
    this.addEmitterListener(this.ctxmenu, 'joinKeyframes', (componentId, timelineName, elementName, propertyName, startMs, endMs, curveName) => {
      this.tourClient.next()
      this.executeBytecodeActionJoinKeyframes(componentId, timelineName, elementName, propertyName, startMs, endMs, curveName)
    })
    this.addEmitterListener(this.ctxmenu, 'deleteKeyframe', (componentId, timelineName, propertyName, startMs) => {
      this.executeBytecodeActionDeleteKeyframe(componentId, timelineName, propertyName, startMs)
    })
    this.addEmitterListener(this.ctxmenu, 'changeSegmentCurve', (componentId, timelineName, propertyName, startMs, curveName) => {
      this.executeBytecodeActionChangeSegmentCurve(componentId, timelineName, propertyName, startMs, curveName)
    })
    this.addEmitterListener(this.ctxmenu, 'moveSegmentEndpoints', (componentId, timelineName, propertyName, handle, keyframeIndex, startMs, endMs) => {
      this.executeBytecodeActionMoveSegmentEndpoints(componentId, timelineName, propertyName, handle, keyframeIndex, startMs, endMs)
    })

    this.addEmitterListener(this._component._timelines, 'timeline-model:tick', (currentFrame) => {
      var frameInfo = this.getFrameInfo()
      this.updateTime(currentFrame)
      // If we got a tick, which occurs during Timeline model updating, then we want to pause it if the scrubber
      // has arrived at the maximum acceptible frame in the timeline.
      if (currentFrame > frameInfo.friMax) {
        this._component.getCurrentTimeline().seekAndPause(frameInfo.friMax)
        this.setState({isPlayerPlaying: false})
      }
      // If our current frame has gone outside of the interval that defines the timeline viewport, then
      // try to re-align the ticker inside of that range
      if (currentFrame >= frameInfo.friB || currentFrame < frameInfo.friA) {
        this.tryToLeftAlignTickerInVisibleFrameRange(frameInfo)
      }
    })

    this.addEmitterListener(this._component._timelines, 'timeline-model:authoritative-frame-set', (currentFrame) => {
      var frameInfo = this.getFrameInfo()
      this.updateTime(currentFrame)
      // If our current frame has gone outside of the interval that defines the timeline viewport, then
      // try to re-align the ticker inside of that range
      if (currentFrame >= frameInfo.friB || currentFrame < frameInfo.friA) {
        this.tryToLeftAlignTickerInVisibleFrameRange(frameInfo)
      }
    })
  }

  handleRequestElementCoordinates ({ selector, webview }) {
    if (webview !== 'timeline') { return }

    try {
      // TODO: find if there is a better solution to this scape hatch
      let element = document.querySelector(selector)
      let { top, left } = element.getBoundingClientRect()

      this.tourClient.receiveElementCoordinates('timeline', { top, left })
    } catch (error) {
      console.error(`Error fetching ${selector} in webview ${webview}`)
    }
  }

  handleKeyDown (nativeEvent) {
    // Give the currently active expression input a chance to capture this event and short circuit us if so
    if (this.refs.expressionInput.willHandleExternalKeydownEvent(nativeEvent)) {
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
            this.setState({ visibleFrameRange: [0, this.state.visibleFrameRange[1]], showHorzScrollShadow: false })
            return this.updateTime(0)
          } else {
            return this.updateScrubberPosition(-1)
          }
        } else {
          if (this.state.showHorzScrollShadow && this.state.visibleFrameRange[0] === 0) {
            this.setState({ showHorzScrollShadow: false })
          }
          return this.updateVisibleFrameRange(-1)
        }

      case 39: // right
        if (this.state.isCommandKeyDown) {
          return this.updateScrubberPosition(1)
        } else {
          if (!this.state.showHorzScrollShadow) this.setState({ showHorzScrollShadow: true })
          return this.updateVisibleFrameRange(1)
        }

      // case 38: // up
      // case 40: // down
      // case 46: //delete
      // case 8: //delete
      // case 13: //enter
      case 16: return this.updateKeyboardState({ isShiftKeyDown: true })
      case 17: return this.updateKeyboardState({ isControlKeyDown: true })
      case 18: return this.updateKeyboardState({ isAltKeyDown: true })
      case 224: return this.updateKeyboardState({ isCommandKeyDown: true })
      case 91: return this.updateKeyboardState({ isCommandKeyDown: true })
      case 93: return this.updateKeyboardState({ isCommandKeyDown: true })
    }
  }

  handleKeyUp (nativeEvent) {
    switch (nativeEvent.which) {
      // case 27: //escape
      // case 32: //space
      // case 37: //left
      // case 39: //right
      // case 38: //up
      // case 40: //down
      // case 46: //delete
      // case 8: //delete
      // case 13: //enter
      case 16: return this.updateKeyboardState({ isShiftKeyDown: false })
      case 17: return this.updateKeyboardState({ isControlKeyDown: false })
      case 18: return this.updateKeyboardState({ isAltKeyDown: false })
      case 224: return this.updateKeyboardState({ isCommandKeyDown: false })
      case 91: return this.updateKeyboardState({ isCommandKeyDown: false })
      case 93: return this.updateKeyboardState({ isCommandKeyDown: false })
    }
  }

  updateKeyboardState (updates) {
    // If the input is focused, don't allow keyboard state changes to cause a re-render, otherwise
    // the input field will switch back to its previous contents (e.g. when holding down 'shift')
    if (!this.state.inputFocused) {
      return this.setState(updates)
    } else {
      for (var key in updates) {
        this.state[key] = updates[key]
      }
    }
  }

  addEmitterListener (eventEmitter, eventName, eventHandler) {
    this.emitters.push([eventEmitter, eventName, eventHandler])
    eventEmitter.on(eventName, eventHandler)
  }

  /*
   * setters/updaters
   * --------- */

  deselectNode (node) {
    node.__isSelected = false
    let selectedNodes = lodash.clone(this.state.selectedNodes)
    selectedNodes[node.attributes['haiku-id']] = false
    this.setState({
      inputSelected: null, // Deselct any selected input
      inputFocused: null, // Cancel any pending change inside a focused input
      selectedNodes: selectedNodes,
      treeUpdate: Date.now()
    })
  }

  selectNode (node) {
    node.__isSelected = true
    let selectedNodes = lodash.clone(this.state.selectedNodes)
    selectedNodes[node.attributes['haiku-id']] = true
    this.setState({
      inputSelected: null, // Deselct any selected input
      inputFocused: null, // Cancel any pending change inside a focused input
      selectedNodes: selectedNodes,
      treeUpdate: Date.now()
    })
  }

  scrollToTop () {
    if (this.refs.scrollview) {
      this.refs.scrollview.scrollTop = 0
    }
  }

  scrollToNode (node) {
    var rowsData = this.state.componentRowsData || []
    var foundIndex = null
    var indexCounter = 0
    rowsData.forEach((rowInfo, index) => {
      if (rowInfo.isHeading) {
        indexCounter++
      } else if (rowInfo.isProperty) {
        if (rowInfo.node && rowInfo.node.__isExpanded) {
          indexCounter++
        }
      }
      if (foundIndex === null) {
        if (rowInfo.node && rowInfo.node === node) {
          foundIndex = indexCounter
        }
      }
    })
    if (foundIndex !== null) {
      if (this.refs.scrollview) {
        this.refs.scrollview.scrollTop = (foundIndex * this.state.rowHeight) - this.state.rowHeight
      }
    }
  }

  findDomNodeOffsetY (domNode) {
    var curtop = 0
    if (domNode.offsetParent) {
      do {
        curtop += domNode.offsetTop
      } while (domNode = domNode.offsetParent) // eslint-disable-line
    }
    return curtop
  }

  collapseNode (node) {
    node.__isExpanded = false
    visit(node, (child) => {
      child.__isExpanded = false
      child.__isSelected = false
    })
    let expandedNodes = this.state.expandedNodes
    let componentId = node.attributes['haiku-id']
    expandedNodes[componentId] = false
    this.setState({
      inputSelected: null, // Deselct any selected input
      inputFocused: null, // Cancel any pending change inside a focused input
      expandedNodes: expandedNodes,
      treeUpdate: Date.now()
    })
  }

  expandNode (node, componentId) {
    node.__isExpanded = true
    if (node.parent) this.expandNode(node.parent) // If we are expanded, our parent has to be too
    let expandedNodes = this.state.expandedNodes
    componentId = node.attributes['haiku-id']
    expandedNodes[componentId] = true
    this.setState({
      inputSelected: null, // Deselct any selected input
      inputFocused: null, // Cancel any pending change inside a focused input
      expandedNodes: expandedNodes,
      treeUpdate: Date.now()
    })
  }

  activateRow (row) {
    if (row.property) {
      this.state.activatedRows[row.componentId + ' ' + row.property.name] = true
    }
  }

  deactivateRow (row) {
    if (row.property) {
      this.state.activatedRows[row.componentId + ' ' + row.property.name] = false
    }
  }

  isRowActivated (row) {
    if (row.property) {
      return this.state.activatedRows[row.componentId + ' ' + row.property.name]
    }
  }

  isClusterActivated (item) {
    return false // TODO
  }

  toggleTimeDisplayMode () {
    if (this.state.timeDisplayMode === 'frames') {
      this.setState({
        inputSelected: null,
        inputFocused: null,
        timeDisplayMode: 'seconds'
      })
    } else {
      this.setState({
        inputSelected: null,
        inputFocused: null,
        timeDisplayMode: 'frames'
      })
    }
  }

  changeScrubberPosition (dragX, frameInfo) {
    var dragStart = this.state.scrubberDragStart
    var frameBaseline = this.state.frameBaseline
    var dragDelta = dragX - dragStart
    var frameDelta = Math.round(dragDelta / frameInfo.pxpf)
    var currentFrame = frameBaseline + frameDelta
    if (currentFrame < frameInfo.friA) currentFrame = frameInfo.friA
    if (currentFrame > frameInfo.friB) currentFrame = frameInfo.friB
    this._component.getCurrentTimeline().seek(currentFrame)
  }

  changeDurationModifierPosition (dragX, frameInfo) {
    var dragStart = this.state.durationDragStart
    var dragDelta = dragX - dragStart
    var frameDelta = Math.round(dragDelta / frameInfo.pxpf)
    if (dragDelta > 0 && this.state.durationTrim >= 0) {
      if (!this.state.addInterval) {
        var addInterval = setInterval(() => {
          var currentMax = this.state.maxFrame ? this.state.maxFrame : frameInfo.friMax2
          this.setState({maxFrame: currentMax + 20})
        }, 300)
        this.setState({addInterval: addInterval})
      }
      this.setState({dragIsAdding: true})
      return
    }
    if (this.state.addInterval) clearInterval(this.state.addInterval)
    // Don't let user drag back past last frame; and don't let them drag more than an entire width of frames
    if (frameInfo.friB + frameDelta <= frameInfo.friMax || -frameDelta >= frameInfo.friB - frameInfo.friA) {
      frameDelta = this.state.durationTrim // Todo: make more precise so it removes as many frames as
      return                               // it can instead of completely ignoring the drag
    }
    this.setState({ durationTrim: frameDelta, dragIsAdding: false, addInterval: null })
  }

  changeVisibleFrameRange (xl, xr, frameInfo) {
    let absL = null
    let absR = null

    if (this.state.scrollerLeftDragStart) {
      absL = xl
    } else if (this.state.scrollerRightDragStart) {
      absR = xr
    } else if (this.state.scrollerBodyDragStart) {
      const offsetL = (this.state.scrollbarStart * frameInfo.pxpf) / frameInfo.scRatio
      const offsetR = (this.state.scrollbarEnd * frameInfo.pxpf) / frameInfo.scRatio
      const diffX = xl - this.state.scrollerBodyDragStart
      absL = offsetL + diffX
      absR = offsetR + diffX
    }

    let fL = (absL !== null) ? Math.round((absL * frameInfo.scRatio) / frameInfo.pxpf) : this.state.visibleFrameRange[0]
    let fR = (absR !== null) ? Math.round((absR * frameInfo.scRatio) / frameInfo.pxpf) : this.state.visibleFrameRange[1]

    // Stop the scroller at the left side and lock the size
    if (fL <= frameInfo.fri0) {
      fL = frameInfo.fri0
      if (!this.state.scrollerRightDragStart && !this.state.scrollerLeftDragStart) {
        fR = this.state.visibleFrameRange[1] - (this.state.visibleFrameRange[0] - fL)
      }
    }

    // Stop the scroller at the right side and lock the size
    if (fR >= frameInfo.friMax2) {
      fL = this.state.visibleFrameRange[0]
      if (!this.state.scrollerRightDragStart && !this.state.scrollerLeftDragStart) {
        fR = frameInfo.friMax2
      }
    }

    this.setState({ visibleFrameRange: [fL, fR] })
  }

  updateVisibleFrameRange (delta) {
    var l = this.state.visibleFrameRange[0] + delta
    var r = this.state.visibleFrameRange[1] + delta
    if (l >= 0) {
      this.setState({ visibleFrameRange: [l, r] })
    }
  }

  // will left-align the current timeline window (maintaining zoom)
  tryToLeftAlignTickerInVisibleFrameRange (frameInfo) {
    var l = this.state.visibleFrameRange[0]
    var r = this.state.visibleFrameRange[1]
    var span = r - l
    var newL = this.state.currentFrame
    var newR = newL + span

    if (newR > frameInfo.friMax) {
      newL -= (newR - frameInfo.friMax)
      newR = frameInfo.friMax
    }

    this.setState({ visibleFrameRange: [newL, newR] })
  }

  updateScrubberPosition (delta) {
    var currentFrame = this.state.currentFrame + delta
    if (currentFrame <= 0) currentFrame = 0
    this._component.getCurrentTimeline().seek(currentFrame)
  }

  executeBytecodeActionCreateKeyframe (componentId, timelineName, elementName, propertyName, startMs, startValue, maybeCurve, endMs, endValue) {
    // Note that if startValue is undefined, the previous value will be examined to determine the value of the present one
    BytecodeActions.createKeyframe(this.state.reifiedBytecode, componentId, timelineName, elementName, propertyName, startMs, startValue, maybeCurve, endMs, endValue, this._component.fetchActiveBytecodeFile().get('hostInstance'), this._component.fetchActiveBytecodeFile().get('states'))
    clearInMemoryBytecodeCaches(this.state.reifiedBytecode)
    this._component._clearCaches()
    this.setState({
      reifiedBytecode: this.state.reifiedBytecode,
      serializedBytecode: this._component.getSerializedBytecode()
    })
    // No need to 'expressionToRO' here because if we got an expression, that would have already been provided in its serialized __function form
    this.props.websocket.action('createKeyframe', [this.props.folder, [componentId], timelineName, elementName, propertyName, startMs, startValue, maybeCurve, endMs, endValue], () => {})

    if (elementName === 'svg' && propertyName === 'opacity') {
      this.tourClient.next()
    }
  }

  executeBytecodeActionSplitSegment (componentId, timelineName, elementName, propertyName, startMs) {
    BytecodeActions.splitSegment(this.state.reifiedBytecode, componentId, timelineName, elementName, propertyName, startMs)
    clearInMemoryBytecodeCaches(this.state.reifiedBytecode)
    this._component._clearCaches()
    this.setState({
      reifiedBytecode: this.state.reifiedBytecode,
      serializedBytecode: this._component.getSerializedBytecode()
    })
    this.props.websocket.action('splitSegment', [this.props.folder, [componentId], timelineName, elementName, propertyName, startMs], () => {})
  }

  executeBytecodeActionJoinKeyframes (componentId, timelineName, elementName, propertyName, startMs, endMs, curveName) {
    BytecodeActions.joinKeyframes(this.state.reifiedBytecode, componentId, timelineName, elementName, propertyName, startMs, endMs, curveName)
    clearInMemoryBytecodeCaches(this.state.reifiedBytecode)
    this._component._clearCaches()
    this.setState({
      reifiedBytecode: this.state.reifiedBytecode,
      serializedBytecode: this._component.getSerializedBytecode(),
      keyframeDragStartPx: false,
      keyframeDragStartMs: false,
      transitionBodyDragging: false
    })
    // In the future, curve may be a function
    let curveForWire = expressionToRO(curveName)
    this.props.websocket.action('joinKeyframes', [this.props.folder, [componentId], timelineName, elementName, propertyName, startMs, endMs, curveForWire], () => {})
  }

  executeBytecodeActionDeleteKeyframe (componentId, timelineName, propertyName, startMs) {
    BytecodeActions.deleteKeyframe(this.state.reifiedBytecode, componentId, timelineName, propertyName, startMs)
    clearInMemoryBytecodeCaches(this.state.reifiedBytecode)
    this._component._clearCaches()
    this.setState({
      reifiedBytecode: this.state.reifiedBytecode,
      serializedBytecode: this._component.getSerializedBytecode(),
      keyframeDragStartPx: false,
      keyframeDragStartMs: false,
      transitionBodyDragging: false
    })
    this.props.websocket.action('deleteKeyframe', [this.props.folder, [componentId], timelineName, propertyName, startMs], () => {})
  }

  executeBytecodeActionChangeSegmentCurve (componentId, timelineName, propertyName, startMs, curveName) {
    BytecodeActions.changeSegmentCurve(this.state.reifiedBytecode, componentId, timelineName, propertyName, startMs, curveName)
    clearInMemoryBytecodeCaches(this.state.reifiedBytecode)
    this._component._clearCaches()
    this.setState({
      reifiedBytecode: this.state.reifiedBytecode,
      serializedBytecode: this._component.getSerializedBytecode()
    })
    // In the future, curve may be a function
    let curveForWire = expressionToRO(curveName)
    this.props.websocket.action('changeSegmentCurve', [this.props.folder, [componentId], timelineName, propertyName, startMs, curveForWire], () => {})
  }

  executeBytecodeActionChangeSegmentEndpoints (componentId, timelineName, propertyName, oldStartMs, oldEndMs, newStartMs, newEndMs) {
    BytecodeActions.changeSegmentEndpoints(this.state.reifiedBytecode, componentId, timelineName, propertyName, oldStartMs, oldEndMs, newStartMs, newEndMs)
    clearInMemoryBytecodeCaches(this.state.reifiedBytecode)
    this._component._clearCaches()
    this.setState({
      reifiedBytecode: this.state.reifiedBytecode,
      serializedBytecode: this._component.getSerializedBytecode()
    })
    this.props.websocket.action('changeSegmentEndpoints', [this.props.folder, [componentId], timelineName, propertyName, oldStartMs, oldEndMs, newStartMs, newEndMs], () => {})
  }

  executeBytecodeActionRenameTimeline (oldTimelineName, newTimelineName) {
    BytecodeActions.renameTimeline(this.state.reifiedBytecode, oldTimelineName, newTimelineName)
    clearInMemoryBytecodeCaches(this.state.reifiedBytecode)
    this._component._clearCaches()
    this.setState({
      reifiedBytecode: this.state.reifiedBytecode,
      serializedBytecode: this._component.getSerializedBytecode()
    })
    this.props.websocket.action('renameTimeline', [this.props.folder, oldTimelineName, newTimelineName], () => {})
  }

  executeBytecodeActionCreateTimeline (timelineName) {
    BytecodeActions.createTimeline(this.state.reifiedBytecode, timelineName)
    clearInMemoryBytecodeCaches(this.state.reifiedBytecode)
    this._component._clearCaches()
    this.setState({
      reifiedBytecode: this.state.reifiedBytecode,
      serializedBytecode: this._component.getSerializedBytecode()
    })
    // Note: We may need to remember to serialize a timeline descriptor here
    this.props.websocket.action('createTimeline', [this.props.folder, timelineName], () => {})
  }

  executeBytecodeActionDuplicateTimeline (timelineName) {
    BytecodeActions.duplicateTimeline(this.state.reifiedBytecode, timelineName)
    clearInMemoryBytecodeCaches(this.state.reifiedBytecode)
    this._component._clearCaches()
    this.setState({
      reifiedBytecode: this.state.reifiedBytecode,
      serializedBytecode: this._component.getSerializedBytecode()
    })
    this.props.websocket.action('duplicateTimeline', [this.props.folder, timelineName], () => {})
  }

  executeBytecodeActionDeleteTimeline (timelineName) {
    BytecodeActions.deleteTimeline(this.state.reifiedBytecode, timelineName)
    clearInMemoryBytecodeCaches(this.state.reifiedBytecode)
    this._component._clearCaches()
    this.setState({
      reifiedBytecode: this.state.reifiedBytecode,
      serializedBytecode: this._component.getSerializedBytecode()
    })
    this.props.websocket.action('deleteTimeline', [this.props.folder, timelineName], () => {})
  }

  executeBytecodeActionMoveSegmentEndpoints (componentId, timelineName, propertyName, handle, keyframeIndex, startMs, endMs) {
    let frameInfo = this.getFrameInfo()
    let keyframeMoves = BytecodeActions.moveSegmentEndpoints(this.state.reifiedBytecode, componentId, timelineName, propertyName, handle, keyframeIndex, startMs, endMs, frameInfo)
    // The 'keyframeMoves' indicate a list of changes we know occurred. Only if some occurred do we bother to update the other views
    if (Object.keys(keyframeMoves).length > 0) {
      clearInMemoryBytecodeCaches(this.state.reifiedBytecode)
      this._component._clearCaches()
      this.setState({
        reifiedBytecode: this.state.reifiedBytecode,
        serializedBytecode: this._component.getSerializedBytecode()
      })

      // It's very heavy to transmit a websocket message for every single movement while updating the ui,
      // so the values are accumulated and sent via a single batched update.
      if (!this._keyframeMoves) this._keyframeMoves = {}
      let movementKey = [componentId, timelineName, propertyName].join('-')
      this._keyframeMoves[movementKey] = { componentId, timelineName, propertyName, keyframeMoves, frameInfo }
      this.debouncedKeyframeMoveAction()
    }
  }

  debouncedKeyframeMoveAction () {
    if (!this._keyframeMoves) return void (0)
    for (let movementKey in this._keyframeMoves) {
      if (!movementKey) continue
      if (!this._keyframeMoves[movementKey]) continue
      let { componentId, timelineName, propertyName, keyframeMoves, frameInfo } = this._keyframeMoves[movementKey]

      // Make sure any functions get converted into their serial form before passing over the wire
      let keyframeMovesForWire = expressionToRO(keyframeMoves)

      this.props.websocket.action('moveKeyframes', [this.props.folder, [componentId], timelineName, propertyName, keyframeMovesForWire, frameInfo], () => {})
      delete this._keyframeMoves[movementKey]
    }
  }

  togglePlayback () {
    if (this.state.isPlayerPlaying) {
      this.setState({
        inputFocused: null,
        inputSelected: null,
        isPlayerPlaying: false
      }, () => {
        this._component.getCurrentTimeline().pause()
      })
    } else {
      this.setState({
        inputFocused: null,
        inputSelected: null,
        isPlayerPlaying: true
      }, () => {
        this._component.getCurrentTimeline().play()
      })
    }
  }

  rehydrateBytecode (reifiedBytecode, serializedBytecode) {
    if (reifiedBytecode) {
      if (reifiedBytecode.template) {
        this.visitTemplate('0', 0, [], reifiedBytecode.template, null, (node) => {
          let id = node.attributes && node.attributes['haiku-id']
          if (!id) return void (0)
          node.__isSelected = !!this.state.selectedNodes[id]
          node.__isExpanded = !!this.state.expandedNodes[id]
          node.__isHidden = !!this.state.hiddenNodes[id]
        })
        reifiedBytecode.template.__isExpanded = true
      }
      clearInMemoryBytecodeCaches(reifiedBytecode)
      this.setState({ reifiedBytecode, serializedBytecode })
    }
  }

  minionSelectElement ({ componentId }) {
    if (this.state.reifiedBytecode && this.state.reifiedBytecode.template) {
      let found = []
      this.visitTemplate('0', 0, [], this.state.reifiedBytecode.template, null, (node, parent) => {
        node.parent = parent
        let id = node.attributes && node.attributes['haiku-id']
        if (id && id === componentId) found.push(node)
      })
      found.forEach((node) => {
        this.selectNode(node)
        this.expandNode(node)
        this.scrollToNode(node)
      })
    }
  }

  minionUnselectElement ({ componentId }) {
    let found = this.findNodesByComponentId(componentId)
    found.forEach((node) => {
      this.deselectNode(node)
      this.collapseNode(node)
      this.scrollToTop(node)
    })
  }

  findNodesByComponentId (componentId) {
    var found = []
    if (this.state.reifiedBytecode && this.state.reifiedBytecode.template) {
      this.visitTemplate('0', 0, [], this.state.reifiedBytecode.template, null, (node) => {
        let id = node.attributes && node.attributes['haiku-id']
        if (id && id === componentId) found.push(node)
      })
    }
    return found
  }

  minionUpdatePropertyValue (componentId, timelineName, startMs, propertyNames) {
    let relatedElement = this.findElementInTemplate(componentId, this.state.reifiedBytecode)
    let elementName = relatedElement && relatedElement.elementName
    if (!elementName) {
      return console.warn('Component ' + componentId + ' missing element, and without an element name I cannot update a property value')
    }

    var allRows = this.state.componentRowsData || []
    allRows.forEach((rowInfo) => {
      if (rowInfo.isProperty && rowInfo.componentId === componentId && propertyNames.indexOf(rowInfo.property.name) !== -1) {
        this.activateRow(rowInfo)
      } else {
        this.deactivateRow(rowInfo)
      }
    })

    clearInMemoryBytecodeCaches(this.state.reifiedBytecode)
    this.setState({
      reifiedBytecode: this.state.reifiedBytecode,
      serializedBytecode: this._component.getSerializedBytecode(),
      activatedRows: lodash.clone(this.state.activatedRows),
      treeUpdate: Date.now()
    })
  }

  /*
   * iterators/visitors
   * --------- */

  findElementInTemplate (componentId, reifiedBytecode) {
    if (!reifiedBytecode) return void (0)
    if (!reifiedBytecode.template) return void (0)
    let found
    this.visitTemplate('0', 0, [], reifiedBytecode.template, null, (node) => {
      let id = node.attributes && node.attributes['haiku-id']
      if (id && id === componentId) found = node
    })
    return found
  }

  visitTemplate (locator, index, siblings, template, parent, iteratee) {
    iteratee(template, parent, locator, index, siblings, template.children)
    if (template.children) {
      for (var i = 0; i < template.children.length; i++) {
        var child = template.children[i]
        if (!child || typeof child === 'string') continue
        this.visitTemplate(locator + '.' + i, i, template.children, child, template, iteratee)
      }
    }
  }

  mapVisibleFrames (iteratee) {
    const mappedOutput = []
    const frameInfo = this.getFrameInfo()
    const leftFrame = frameInfo.friA
    const rightFrame = frameInfo.friB
    const frameModulus = getFrameModulus(frameInfo.pxpf)
    let iterationIndex = -1
    for (let i = leftFrame; i < rightFrame; i++) {
      iterationIndex++
      let frameNumber = i
      let pixelOffsetLeft = iterationIndex * frameInfo.pxpf
      if (pixelOffsetLeft <= this.state.timelinesWidth) {
        let mapOutput = iteratee(frameNumber, pixelOffsetLeft, frameInfo.pxpf, frameModulus)
        if (mapOutput) {
          mappedOutput.push(mapOutput)
        }
      }
    }
    return mappedOutput
  }

  mapVisibleTimes (iteratee) {
    const mappedOutput = []
    const frameInfo = this.getFrameInfo()
    const msModulus = getMillisecondModulus(frameInfo.pxpf)
    const leftFrame = frameInfo.friA
    const leftMs = frameInfo.friA * frameInfo.mspf
    const rightMs = frameInfo.friB * frameInfo.mspf
    const totalMs = rightMs - leftMs
    const firstMarker = roundUp(leftMs, msModulus)
    let msMarkerTmp = firstMarker
    const msMarkers = []
    while (msMarkerTmp <= rightMs) {
      msMarkers.push(msMarkerTmp)
      msMarkerTmp += msModulus
    }
    for (let i = 0; i < msMarkers.length; i++) {
      let msMarker = msMarkers[i]
      let nearestFrame = millisecondToNearestFrame(msMarker, frameInfo.mspf)
      let msRemainder = Math.floor(nearestFrame * frameInfo.mspf - msMarker)
      // TODO: handle the msRemainder case rather than ignoring it
      if (!msRemainder) {
        let frameOffset = nearestFrame - leftFrame
        let pxOffset = frameOffset * frameInfo.pxpf
        let mapOutput = iteratee(msMarker, pxOffset, totalMs)
        if (mapOutput) mappedOutput.push(mapOutput)
      }
    }
    return mappedOutput
  }

  /*
   * getters/calculators
   * --------- */

  /**
    // Sorry: These should have been given human-readable names
    <GAUGE>
            <----friW--->
    fri0    friA        friB        friMax                          friMax2
    |       |           |           |                               |
    | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | |
            <-----------> << timelines viewport                     |
    <------->           | << properties viewport                    |
            pxA         pxB                                         |
                                    |pxMax                          |pxMax2
    <SCROLLBAR>
    |-------------------| << scroller viewport
        *====*            << scrollbar
    <------------------->
    |sc0                |scL && scRatio
        |scA
             |scB
  */
  getFrameInfo () {
    const frameInfo = {}
    frameInfo.fps = this.state.framesPerSecond // Number of frames per second
    frameInfo.mspf = 1000 / frameInfo.fps // Milliseconds per frame
    frameInfo.maxms = getMaximumMs(this.state.reifiedBytecode, this.state.currentTimelineName)
    frameInfo.maxf = millisecondToNearestFrame(frameInfo.maxms, frameInfo.mspf) // Maximum frame defined in the timeline
    frameInfo.fri0 = 0 // The lowest possible frame (always 0)
    frameInfo.friA = (this.state.visibleFrameRange[0] < frameInfo.fri0) ? frameInfo.fri0 : this.state.visibleFrameRange[0] // The leftmost frame on the visible range
    frameInfo.friMax = (frameInfo.maxf < 60) ? 60 : frameInfo.maxf // The maximum frame as defined in the timeline
    frameInfo.friMax2 = this.state.maxFrame ? this.state.maxFrame : frameInfo.friMax * 1.88  // Extend the maximum frame defined in the timeline (allows the user to define keyframes beyond the previously defined max)
    frameInfo.friB = (this.state.visibleFrameRange[1] > frameInfo.friMax2) ? frameInfo.friMax2 : this.state.visibleFrameRange[1] // The rightmost frame on the visible range
    frameInfo.friW = Math.abs(frameInfo.friB - frameInfo.friA) // The width of the visible range in frames
    frameInfo.pxpf = Math.floor(this.state.timelinesWidth / frameInfo.friW) // Number of pixels per frame (rounded)
    if (frameInfo.pxpf < 1) frameInfo.pScrxpf = 1
    if (frameInfo.pxpf > this.state.timelinesWidth) frameInfo.pxpf = this.state.timelinesWidth
    frameInfo.pxA = Math.round(frameInfo.friA * frameInfo.pxpf)
    frameInfo.pxB = Math.round(frameInfo.friB * frameInfo.pxpf)
    frameInfo.pxMax2 = frameInfo.friMax2 * frameInfo.pxpf // The width in pixels that the entire timeline ("friMax2") padding would equal
    frameInfo.msA = Math.round(frameInfo.friA * frameInfo.mspf) // The leftmost millisecond in the visible range
    frameInfo.msB = Math.round(frameInfo.friB * frameInfo.mspf) // The rightmost millisecond in the visible range
    frameInfo.scL = this.state.propertiesWidth + this.state.timelinesWidth // The length in pixels of the scroller view
    frameInfo.scRatio = frameInfo.pxMax2 / frameInfo.scL // The ratio of the scroller view to the timeline view (so the scroller renders proportionally to the timeline being edited)
    frameInfo.scA = (frameInfo.friA * frameInfo.pxpf) / frameInfo.scRatio // The pixel of the left endpoint of the scroller
    frameInfo.scB = (frameInfo.friB * frameInfo.pxpf) / frameInfo.scRatio // The pixel of the right endpoint of the scroller
    return frameInfo
  }

  // TODO: Fix this/these misnomer(s). It's not 'ASCII'
  getAsciiTree () {
    if (this.state.reifiedBytecode && this.state.reifiedBytecode.template && this.state.reifiedBytecode.template.children) {
      let archyFormat = this.getArchyFormatNodes('', this.state.reifiedBytecode.template.children)
      let archyStr = archy(archyFormat)
      return archyStr
    } else {
      return ''
    }
  }

  getArchyFormatNodes (label, children) {
    return {
      label,
      nodes: children.filter((child) => typeof child !== 'string').map((child) => {
        return this.getArchyFormatNodes('', child.children)
      })
    }
  }

  getComponentRowsData () {
    // The number of lines **must** correspond to the number of component headings/property rows
    let asciiSymbols = this.getAsciiTree().split('\n')
    let componentRows = []
    let addressableArraysCache = {}
    let visitorIterations = 0

    if (!this.state.reifiedBytecode || !this.state.reifiedBytecode.template) return componentRows

    this.visitTemplate('0', 0, [], this.state.reifiedBytecode.template, null, (node, parent, locator, index, siblings) => {
      // TODO how will this bite us?
      let isComponent = (typeof node.elementName === 'object')
      let elementName = isComponent ? node.attributes.source : node.elementName

      if (!parent || (parent.__isExpanded && (ALLOWED_TAGNAMES[elementName] || isComponent))) { // Only the top-level and any expanded subcomponents
        const asciiBranch = asciiSymbols[visitorIterations] // Warning: The component structure must match that given to create the ascii tree
        const headingRow = { node, parent, locator, index, siblings, asciiBranch, propertyRows: [], isHeading: true, componentId: node.attributes['haiku-id'] }
        componentRows.push(headingRow)

        if (!addressableArraysCache[elementName]) {
          addressableArraysCache[elementName] = isComponent ? _buildComponentAddressables(node) : _buildDOMAddressables(elementName, locator)
        }

        const componentId = node.attributes['haiku-id']
        const clusterHeadingsFound = {}

        for (let i = 0; i < addressableArraysCache[elementName].length; i++) {
          let propertyGroupDescriptor = addressableArraysCache[elementName][i]

          let propertyRow

            // Some properties get grouped inside their own accordion since they have multiple subcomponents, e.g. translation.x,y,z
          if (propertyGroupDescriptor.cluster) {
            let clusterPrefix = propertyGroupDescriptor.cluster.prefix
            let clusterKey = `${componentId}_${clusterPrefix}`
            let isClusterHeading = false

              // If the cluster with the current key is expanded render each of the rows individually
            if (this.state.expandedPropertyClusters[clusterKey]) {
              if (!clusterHeadingsFound[clusterPrefix]) {
                isClusterHeading = true
                clusterHeadingsFound[clusterPrefix] = true
              }
              propertyRow = { node, parent, locator, index, siblings, clusterPrefix, clusterKey, isClusterMember: true, isClusterHeading, property: propertyGroupDescriptor, isProperty: true, componentId }
            } else {
                // Otherwise, create a cluster, shifting the index forward so we don't re-render the individuals on the next iteration of the loop
              let clusterSet = [propertyGroupDescriptor]
                // Look ahead by a few steps in the array and see if the next element is a member of the current cluster
              let k = i // Temporary so we can increment `i` in place
              for (let j = 1; j < 4; j++) {
                let nextIndex = j + k
                let nextDescriptor = addressableArraysCache[elementName][nextIndex]
                  // If the next thing in the list shares the same cluster name, make it part of this clustesr
                if (nextDescriptor && nextDescriptor.cluster && nextDescriptor.cluster.prefix === clusterPrefix) {
                  clusterSet.push(nextDescriptor)
                    // Since we already go to the next one, bump the iteration index so we skip it on the next loop
                  i += 1
                }
              }
              propertyRow = { node, parent, locator, index, siblings, clusterPrefix, clusterKey, cluster: clusterSet, clusterName: propertyGroupDescriptor.cluster.name, isCluster: true, componentId }
            }
          } else {
            propertyRow = { node, parent, locator, index, siblings, property: propertyGroupDescriptor, isProperty: true, componentId }
          }

          headingRow.propertyRows.push(propertyRow)

            // Pushing an element into a component row will result in it rendering, so only push
            // the property rows of nodes that have been expandex
          if (node.__isExpanded) {
            componentRows.push(propertyRow)
          }
        }
      }
      visitorIterations++
    })

    componentRows.forEach((item, index, items) => {
      item._index = index
      item._items = items
    })

    componentRows = componentRows.filter(({ node, parent, locator }) => {
        // Locators > 0.0 are below the level we want to display (we only want the top and its children)
      if (locator.split('.').length > 2) return false
      return !parent || parent.__isExpanded
    })

    return componentRows
  }

  mapVisiblePropertyTimelineSegments (frameInfo, componentId, elementName, propertyName, reifiedBytecode, iteratee) {
    let segmentOutputs = []

    let valueGroup = TimelineProperty.getValueGroup(componentId, this.state.currentTimelineName, propertyName, reifiedBytecode)
    if (!valueGroup) return segmentOutputs

    let keyframesList = Object.keys(valueGroup).map((keyframeKey) => parseInt(keyframeKey, 10)).sort((a, b) => a - b)
    if (keyframesList.length < 1) return segmentOutputs

    for (let i = 0; i < keyframesList.length; i++) {
      let mscurr = keyframesList[i]
      if (isNaN(mscurr)) continue
      let msprev = keyframesList[i - 1]
      let msnext = keyframesList[i + 1]

      if (mscurr > frameInfo.msB) continue // If this segment happens after the visible range, skip it
      if (mscurr < frameInfo.msA && msnext !== undefined && msnext < frameInfo.msA) continue // If this segment happens entirely before the visible range, skip it (partial segments are ok)

      let prev
      let curr
      let next

      if (msprev !== undefined && !isNaN(msprev)) {
        prev = {
          ms: msprev,
          name: propertyName,
          index: i - 1,
          frame: millisecondToNearestFrame(msprev, frameInfo.mspf),
          value: valueGroup[msprev].value,
          curve: valueGroup[msprev].curve
        }
      }

      curr = {
        ms: mscurr,
        name: propertyName,
        index: i,
        frame: millisecondToNearestFrame(mscurr, frameInfo.mspf),
        value: valueGroup[mscurr].value,
        curve: valueGroup[mscurr].curve
      }

      if (msnext !== undefined && !isNaN(msnext)) {
        next = {
          ms: msnext,
          name: propertyName,
          index: i + 1,
          frame: millisecondToNearestFrame(msnext, frameInfo.mspf),
          value: valueGroup[msnext].value,
          curve: valueGroup[msnext].curve
        }
      }

      let pxOffsetLeft = (curr.frame - frameInfo.friA) * frameInfo.pxpf
      let pxOffsetRight
      if (next) pxOffsetRight = (next.frame - frameInfo.friA) * frameInfo.pxpf

      let segmentOutput = iteratee(prev, curr, next, pxOffsetLeft, pxOffsetRight, i)
      if (segmentOutput) segmentOutputs.push(segmentOutput)
    }

    return segmentOutputs
  }

  mapVisibleComponentTimelineSegments (frameInfo, componentId, elementName, propertyRows, reifiedBytecode, iteratee) {
    let segmentOutputs = []

    propertyRows.forEach((propertyRow) => {
      if (propertyRow.isCluster) {
        propertyRow.cluster.forEach((propertyDescriptor) => {
          let propertyName = propertyDescriptor.name
          let propertyOutputs = this.mapVisiblePropertyTimelineSegments(frameInfo, componentId, elementName, propertyName, reifiedBytecode, iteratee)
          if (propertyOutputs) {
            segmentOutputs = segmentOutputs.concat(propertyOutputs)
          }
        })
      } else {
        let propertyName = propertyRow.property.name
        let propertyOutputs = this.mapVisiblePropertyTimelineSegments(frameInfo, componentId, elementName, propertyName, reifiedBytecode, iteratee)
        if (propertyOutputs) {
          segmentOutputs = segmentOutputs.concat(propertyOutputs)
        }
      }
    })

    return segmentOutputs
  }

  removeTimelineShadow () {
    this.setState({ showHorzScrollShadow: false })
  }

  /*
   * render methods
   * --------- */

  // ---------

  renderTimelinePlaybackControls () {
    return (
      <div
        style={{
          position: 'relative',
          top: 17
        }}>
        <ControlsArea
          removeTimelineShadow={this.removeTimelineShadow.bind(this)}
          activeComponentDisplayName={this.props.userconfig.name}
          timelineNames={Object.keys((this.state.reifiedBytecode) ? this.state.reifiedBytecode.timelines : {})}
          selectedTimelineName={this.state.currentTimelineName}
          currentFrame={this.state.currentFrame}
          isPlaying={this.state.isPlayerPlaying}
          playbackSpeed={this.state.playerPlaybackSpeed}
          lastFrame={this.getFrameInfo().friMax}
          changeTimelineName={(oldTimelineName, newTimelineName) => {
            this.executeBytecodeActionRenameTimeline(oldTimelineName, newTimelineName)
          }}
          createTimeline={(timelineName) => {
            this.executeBytecodeActionCreateTimeline(timelineName)
          }}
          duplicateTimeline={(timelineName) => {
            this.executeBytecodeActionDuplicateTimeline(timelineName)
          }}
          deleteTimeline={(timelineName) => {
            this.executeBytecodeActionDeleteTimeline(timelineName)
          }}
          selectTimeline={(currentTimelineName) => {
            // Need to make sure we update the in-memory component or property assignment might not work correctly
            this._component.setTimelineName(currentTimelineName, { from: 'timeline' }, () => {})
            this.props.websocket.action('setTimelineName', [this.props.folder, currentTimelineName], () => {})
            this.setState({ currentTimelineName })
          }}
          playbackSkipBack={() => {
            /* this._component.getCurrentTimeline().pause() */
            /* this.updateVisibleFrameRange(frameInfo.fri0 - frameInfo.friA) */
            /* this.updateTime(frameInfo.fri0) */
            let frameInfo = this.getFrameInfo()
            this._component.getCurrentTimeline().seekAndPause(frameInfo.fri0)
            this.setState({ isPlayerPlaying: false, currentFrame: frameInfo.fri0 })
          }}
          playbackSkipForward={() => {
            let frameInfo = this.getFrameInfo()
            this.setState({ isPlayerPlaying: false, currentFrame: frameInfo.friMax })
            this._component.getCurrentTimeline().seekAndPause(frameInfo.friMax)
          }}
          playbackPlayPause={() => {
            this.togglePlayback()
          }}
          changePlaybackSpeed={(inputEvent) => {
            let playerPlaybackSpeed = Number(inputEvent.target.value || 1)
            this.setState({ playerPlaybackSpeed })
          }} />
      </div>
    )
  }

  getItemValueDescriptor (inputItem) {
    const frameInfo = this.getFrameInfo()
    return getPropertyValueDescriptor(inputItem.node, frameInfo, this.state.reifiedBytecode, this.state.serializedBytecode, this._component, this.getCurrentTimelineTime(frameInfo), this.state.currentTimelineName, inputItem.property)
  }

  getCurrentTimelineTime (frameInfo) {
    return Math.round(this.state.currentFrame * frameInfo.mspf)
  }

  renderCollapsedPropertyTimelineSegments (item) {
    let componentId = item.node.attributes['haiku-id']
    let elementName = (typeof item.node.elementName === 'object') ? 'div' : item.node.elementName
    let frameInfo = this.getFrameInfo()

    // TODO: Optimize this? We don't need to render every segment since some of them overlap.
    // Maybe keep a list of keyframe 'poles' rendered, and only render once in that spot?
    return (
      <div className='collapsed-segments-box' style={{ position: 'absolute', left: this.state.propertiesWidth - 4, height: 25, width: '100%', overflow: 'hidden' }}>
        {this.mapVisibleComponentTimelineSegments(frameInfo, componentId, elementName, item.propertyRows, this.state.reifiedBytecode, (prev, curr, next, pxOffsetLeft, pxOffsetRight, index) => {
          let segmentPieces = []

          if (curr.curve) {
            segmentPieces.push(this.renderTransitionBody(frameInfo, componentId, elementName, curr.name, this.state.reifiedBytecode, prev, curr, next, pxOffsetLeft, pxOffsetRight, 1, { collapsed: true, collapsedElement: true }))
          } else {
            if (next) {
              segmentPieces.push(this.renderConstantBody(frameInfo, componentId, elementName, curr.name, this.state.reifiedBytecode, prev, curr, next, pxOffsetLeft, pxOffsetRight, 2, { collapsed: true, collapsedElement: true }))
            }
            if (!prev || !prev.curve) {
              segmentPieces.push(this.renderSoloKeyframe(frameInfo, componentId, elementName, curr.name, this.state.reifiedBytecode, prev, curr, next, pxOffsetLeft, pxOffsetRight, 3, { collapsed: true, collapsedElement: true }))
            }
          }

          return segmentPieces
        })}
      </div>
    )
  }

  renderInvisibleKeyframeDragger (frameInfo, componentId, elementName, propertyName, reifiedBytecode, prev, curr, next, pxOffsetLeft, index, handle, options) {
    return (
      <DraggableCore
        // NOTE: We cant use 'curr.ms' for key here because these things move around
        key={`${propertyName}-${index}`}
        axis='x'
        onStart={(dragEvent, dragData) => {
          this.setRowCacheActivation({ componentId, propertyName })
          let activeKeyframes = this.state.activeKeyframes
          activeKeyframes = [componentId + '-' + propertyName + '-' + curr.index]
          this.setState({
            inputSelected: null,
            inputFocused: null,
            keyframeDragStartPx: dragData.x,
            keyframeDragStartMs: curr.ms,
            activeKeyframes
          })
        }}
        onStop={(dragEvent, dragData) => {
          this.unsetRowCacheActivation({ componentId, propertyName })
          this.setState({ keyframeDragStartPx: false, keyframeDragStartMs: false, activeKeyframes: [] })
        }}
        onDrag={lodash.throttle((dragEvent, dragData) => {
          if (!this.state.transitionBodyDragging) {
            let pxChange = dragData.lastX - this.state.keyframeDragStartPx
            let msChange = (pxChange / frameInfo.pxpf) * frameInfo.mspf
            let destMs = Math.round(this.state.keyframeDragStartMs + msChange)
            this.executeBytecodeActionMoveSegmentEndpoints(componentId, this.state.currentTimelineName, propertyName, handle, curr.index, curr.ms, destMs)
          }
        }, THROTTLE_TIME)}>
        <span
          onContextMenu={(ctxMenuEvent) => {
            ctxMenuEvent.stopPropagation()
            let localOffsetX = ctxMenuEvent.nativeEvent.offsetX
            let totalOffsetX = localOffsetX + pxOffsetLeft + Math.round(frameInfo.pxA / frameInfo.pxpf)
            let clickedMs = curr.ms
            let clickedFrame = curr.frame
            this.ctxmenu.show({
              type: 'keyframe',
              frameInfo,
              event: ctxMenuEvent.nativeEvent,
              componentId,
              timelineName: this.state.currentTimelineName,
              propertyName,
              keyframeIndex: curr.index,
              startMs: curr.ms,
              startFrame: curr.frame,
              endMs: null,
              endFrame: null,
              curve: null,
              localOffsetX,
              totalOffsetX,
              clickedFrame,
              clickedMs,
              elementName
            })
          }}
          style={{
            display: 'inline-block',
            position: 'absolute',
            top: 1,
            left: pxOffsetLeft,
            width: 10,
            height: 24,
            zIndex: 1003,
            cursor: 'col-resize'
          }} />
      </DraggableCore>
    )
  }

  renderSoloKeyframe (frameInfo, componentId, elementName, propertyName, reifiedBytecode, prev, curr, next, pxOffsetLeft, pxOffsetRight, index, options) {
    let isActive = false
    this.state.activeKeyframes.forEach((k) => {
      if (k === componentId + '-' + propertyName + '-' + curr.index) isActive = true
    })

    return (
      <span
        key={`${propertyName}-${index}-${curr.ms}`}
        style={{
          position: 'absolute',
          left: pxOffsetLeft,
          width: 9,
          height: 24,
          top: -3,
          transform: 'scale(1.7)',
          transition: 'opacity 130ms linear',
          zIndex: 1002
        }}>
        <span
          className='keyframe-diamond'
          style={{
            position: 'absolute',
            top: 5,
            left: 1,
            cursor: (options.collapsed) ? 'pointer' : 'move'
          }}>
          <KeyframeSVG color={(options.collapsedElement)
            ? Palette.BLUE
            : (options.collapsedProperty)
                ? Palette.DARK_ROCK
                : (isActive)
                  ? Palette.LIGHTEST_PINK
                  : Palette.ROCK
          } />
        </span>
      </span>
    )
  }

  renderTransitionBody (frameInfo, componentId, elementName, propertyName, reifiedBytecode, prev, curr, next, pxOffsetLeft, pxOffsetRight, index, options) {
    const uniqueKey = `${componentId}-${propertyName}-${index}-${curr.ms}`
    const curve = curr.curve.charAt(0).toUpperCase() + curr.curve.slice(1)
    const breakingBounds = curve.includes('Back') || curve.includes('Bounce') || curve.includes('Elastic')
    const CurveSVG = CURVESVGS[curve + 'SVG']
    let firstKeyframeActive = false
    let secondKeyframeActive = false
    this.state.activeKeyframes.forEach((k) => {
      if (k === componentId + '-' + propertyName + '-' + curr.index) firstKeyframeActive = true
      if (k === componentId + '-' + propertyName + '-' + (curr.index + 1)) secondKeyframeActive = true
    })

    return (
      <DraggableCore
        // NOTE: We cannot use 'curr.ms' for key here because these things move around
        key={`${propertyName}-${index}`}
        axis='x'
        onStart={(dragEvent, dragData) => {
          if (options.collapsed) return false
          this.setRowCacheActivation({ componentId, propertyName })
          let activeKeyframes = this.state.activeKeyframes
          activeKeyframes = [componentId + '-' + propertyName + '-' + curr.index, componentId + '-' + propertyName + '-' + (curr.index + 1)]
          this.setState({
            inputSelected: null,
            inputFocused: null,
            keyframeDragStartPx: dragData.x,
            keyframeDragStartMs: curr.ms,
            transitionBodyDragging: true,
            activeKeyframes
          })
        }}
        onStop={(dragEvent, dragData) => {
          this.unsetRowCacheActivation({ componentId, propertyName })
          this.setState({ keyframeDragStartPx: false, keyframeDragStartMs: false, transitionBodyDragging: false, activeKeyframes: [] })
        }}
        onDrag={lodash.throttle((dragEvent, dragData) => {
          let pxChange = dragData.lastX - this.state.keyframeDragStartPx
          let msChange = (pxChange / frameInfo.pxpf) * frameInfo.mspf
          let destMs = Math.round(this.state.keyframeDragStartMs + msChange)
          this.executeBytecodeActionMoveSegmentEndpoints(componentId, this.state.currentTimelineName, propertyName, 'body', curr.index, curr.ms, destMs)
        }, THROTTLE_TIME)}>
        <span
          className='pill-container'
          key={uniqueKey}
          ref={(domElement) => {
            this[uniqueKey] = domElement
          }}
          onContextMenu={(ctxMenuEvent) => {
            if (options.collapsed) return false
            ctxMenuEvent.stopPropagation()
            let localOffsetX = ctxMenuEvent.nativeEvent.offsetX
            let totalOffsetX = localOffsetX + pxOffsetLeft + Math.round(frameInfo.pxA / frameInfo.pxpf)
            let clickedFrame = Math.round(totalOffsetX / frameInfo.pxpf)
            let clickedMs = Math.round((totalOffsetX / frameInfo.pxpf) * frameInfo.mspf)
            this.ctxmenu.show({
              type: 'keyframe-transition',
              frameInfo,
              event: ctxMenuEvent.nativeEvent,
              componentId,
              timelineName: this.state.currentTimelineName,
              propertyName,
              startFrame: curr.frame,
              keyframeIndex: curr.index,
              startMs: curr.ms,
              curve: curr.curve,
              endFrame: next.frame,
              endMs: next.ms,
              localOffsetX,
              totalOffsetX,
              clickedFrame,
              clickedMs,
              elementName
            })
          }}
          onMouseEnter={(reactEvent) => {
            if (this[uniqueKey]) this[uniqueKey].style.color = Palette.GRAY
          }}
          onMouseLeave={(reactEvent) => {
            if (this[uniqueKey]) this[uniqueKey].style.color = 'transparent'
          }}
          style={{
            position: 'absolute',
            left: pxOffsetLeft + 4,
            width: pxOffsetRight - pxOffsetLeft,
            top: 1,
            height: 24,
            WebkitUserSelect: 'none',
            cursor: (options.collapsed)
              ? 'pointer'
              : 'move'
          }}>
          {options.collapsed &&
            <span
              className='pill-collapsed-backdrop'
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                top: 0,
                borderRadius: 5,
                zIndex: 4,
                left: 0,
                backgroundColor: (options.collapsed)
                  ? Palette.GRAY
                  : Color(Palette.SUNSTONE).fade(0.91)
              }}
            />
          }
          <span
            className='pill'
            style={{
              position: 'absolute',
              zIndex: 1001,
              width: '100%',
              height: '100%',
              top: 0,
              borderRadius: 5,
              left: 0,
              backgroundColor: (options.collapsed)
              ? (options.collapsedElement)
                ? Color(Palette.SUNSTONE).fade(0.93)
                : Color(Palette.SUNSTONE).fade(0.965)
              : Color(Palette.SUNSTONE).fade(0.91)
            }}
          />
          <span
            style={{
              position: 'absolute',
              left: -5,
              width: 9,
              height: 24,
              top: -4,
              transform: 'scale(1.7)',
              zIndex: 1002
            }}>
            <span
              className='keyframe-diamond'
              style={{
                position: 'absolute',
                top: 5,
                left: 1,
                cursor: (options.collapsed) ? 'pointer' : 'move'
              }}>
              <KeyframeSVG color={(options.collapsedElement)
                  ? Palette.BLUE
                  : (options.collapsedProperty)
                      ? Palette.DARK_ROCK
                      : (firstKeyframeActive)
                        ? Palette.LIGHTEST_PINK
                        : Palette.ROCK
                } />
            </span>
          </span>
          <span style={{
            position: 'absolute',
            zIndex: 1002,
            width: '100%',
            height: '100%',
            borderRadius: 5,
            paddingTop: 6,
            overflow: breakingBounds ? 'visible' : 'hidden'
          }}>
            <CurveSVG
              id={uniqueKey}
              leftGradFill={(options.collapsedElement)
                ? Palette.BLUE
                : ((options.collapsedProperty)
                    ? Palette.DARK_ROCK
                    : (firstKeyframeActive)
                      ? Palette.LIGHTEST_PINK
                      : Palette.ROCK)}
              rightGradFill={(options.collapsedElement)
                ? Palette.BLUE
                : ((options.collapsedProperty)
                    ? Palette.DARK_ROCK
                    : (secondKeyframeActive)
                      ? Palette.LIGHTEST_PINK
                      : Palette.ROCK)}
            />
          </span>
          <span
            style={{
              position: 'absolute',
              right: -5,
              width: 9,
              height: 24,
              top: -4,
              transform: 'scale(1.7)',
              transition: 'opacity 130ms linear',
              zIndex: 1002
            }}>
            <span
              className='keyframe-diamond'
              style={{
                position: 'absolute',
                top: 5,
                left: 1,
                cursor: (options.collapsed)
                  ? 'pointer'
                  : 'move'
              }}>
              <KeyframeSVG color={(options.collapsedElement)
                ? Palette.BLUE
                : (options.collapsedProperty)
                    ? Palette.DARK_ROCK
                    : (secondKeyframeActive)
                      ? Palette.LIGHTEST_PINK
                      : Palette.ROCK
              } />
            </span>
          </span>
        </span>
      </DraggableCore>
    )
  }

  renderConstantBody (frameInfo, componentId, elementName, propertyName, reifiedBytecode, prev, curr, next, pxOffsetLeft, pxOffsetRight, index, options) {
    // const activeInfo = setActiveContents(propertyName, curr, next, false, this.state.timeDisplayMode === 'frames')
    const uniqueKey = `${propertyName}-${index}-${curr.ms}`

    return (
      <span
        ref={(domElement) => {
          this[uniqueKey] = domElement
        }}
        key={`${propertyName}-${index}`}
        className='constant-body'
        onContextMenu={(ctxMenuEvent) => {
          if (options.collapsed) return false
          ctxMenuEvent.stopPropagation()
          let localOffsetX = ctxMenuEvent.nativeEvent.offsetX
          let totalOffsetX = localOffsetX + pxOffsetLeft + Math.round(frameInfo.pxA / frameInfo.pxpf)
          let clickedFrame = Math.round(totalOffsetX / frameInfo.pxpf)
          let clickedMs = Math.round((totalOffsetX / frameInfo.pxpf) * frameInfo.mspf)
          this.ctxmenu.show({
            type: 'keyframe-segment',
            frameInfo,
            event: ctxMenuEvent.nativeEvent,
            componentId,
            timelineName: this.state.currentTimelineName,
            propertyName,
            startFrame: curr.frame,
            keyframeIndex: curr.index,
            startMs: curr.ms,
            endFrame: next.frame,
            endMs: next.ms,
            curve: null,
            localOffsetX,
            totalOffsetX,
            clickedFrame,
            clickedMs,
            elementName
          })
        }}
        style={{
          position: 'absolute',
          left: pxOffsetLeft + 4,
          width: pxOffsetRight - pxOffsetLeft,
          height: this.state.rowHeight
        }}>
        <span style={{
          height: 3,
          top: 12,
          position: 'absolute',
          zIndex: 2,
          width: '100%',
          backgroundColor: (options.collapsedElement)
            ? Color(Palette.GRAY).fade(0.23)
            : Palette.DARKER_GRAY
        }} />
      </span>
    )
  }

  renderPropertyTimelineSegments (frameInfo, item, index, height, allItems, reifiedBytecode) {
    const componentId = item.node.attributes['haiku-id']
    const elementName = (typeof item.node.elementName === 'object') ? 'div' : item.node.elementName
    const propertyName = item.property.name
    const isActivated = this.isRowActivated(item)

    return this.mapVisiblePropertyTimelineSegments(frameInfo, componentId, elementName, propertyName, reifiedBytecode, (prev, curr, next, pxOffsetLeft, pxOffsetRight, index) => {
      let segmentPieces = []

      if (curr.curve) {
        segmentPieces.push(this.renderTransitionBody(frameInfo, componentId, elementName, propertyName, reifiedBytecode, prev, curr, next, pxOffsetLeft, pxOffsetRight, 1, { isActivated }))
      } else {
        if (next) {
          segmentPieces.push(this.renderConstantBody(frameInfo, componentId, elementName, propertyName, reifiedBytecode, prev, curr, next, pxOffsetLeft, pxOffsetRight, 2, {}))
        }
        if (!prev || !prev.curve) {
          segmentPieces.push(this.renderSoloKeyframe(frameInfo, componentId, elementName, propertyName, reifiedBytecode, prev, curr, next, pxOffsetLeft, pxOffsetRight, 3, { isActivated }))
        }
      }

      if (prev) {
        segmentPieces.push(this.renderInvisibleKeyframeDragger(frameInfo, componentId, elementName, propertyName, reifiedBytecode, prev, curr, next, pxOffsetLeft - 10, 4, 'left', {}))
      }
      segmentPieces.push(this.renderInvisibleKeyframeDragger(frameInfo, componentId, elementName, propertyName, reifiedBytecode, prev, curr, next, pxOffsetLeft, 5, 'middle', {}))
      if (next) {
        segmentPieces.push(this.renderInvisibleKeyframeDragger(frameInfo, componentId, elementName, propertyName, reifiedBytecode, prev, curr, next, pxOffsetLeft + 10, 6, 'right', {}))
      }

      return (
        <div
          key={`keyframe-container-${componentId}-${propertyName}-${index}`}
          className={`keyframe-container`}>
          {segmentPieces}
        </div>
      )
    })
  }

  // ---------

  renderGauge (frameInfo) {
    if (this.state.timeDisplayMode === 'frames') {
      return this.mapVisibleFrames((frameNumber, pixelOffsetLeft, pixelsPerFrame, frameModulus) => {
        if (frameNumber === 0 || frameNumber % frameModulus === 0) {
          return (
            <span key={`frame-${frameNumber}`} style={{ pointerEvents: 'none', display: 'inline-block', position: 'absolute', left: pixelOffsetLeft, transform: 'translateX(-50%)' }}>
              <span style={{ fontWeight: 'bold' }}>{frameNumber}</span>
            </span>
          )
        }
      })
    } else if (this.state.timeDisplayMode === 'seconds') { // aka time elapsed, not frames
      return this.mapVisibleTimes((millisecondsNumber, pixelOffsetLeft, totalMilliseconds) => {
        if (totalMilliseconds <= 1000) {
          return (
            <span key={`time-${millisecondsNumber}`} style={{ pointerEvents: 'none', display: 'inline-block', position: 'absolute', left: pixelOffsetLeft, transform: 'translateX(-50%)' }}>
              <span style={{ fontWeight: 'bold' }}>{millisecondsNumber}ms</span>
            </span>
          )
        } else {
          return (
            <span key={`time-${millisecondsNumber}`} style={{ pointerEvents: 'none', display: 'inline-block', position: 'absolute', left: pixelOffsetLeft, transform: 'translateX(-50%)' }}>
              <span style={{ fontWeight: 'bold' }}>{formatSeconds(millisecondsNumber / 1000)}s</span>
            </span>
          )
        }
      })
    }
  }

  renderFrameGrid (frameInfo) {
    var guideHeight = (this.refs.scrollview && this.refs.scrollview.clientHeight - 25) || 0
    return (
      <div id='frame-grid'>
        {this.mapVisibleFrames((frameNumber, pixelOffsetLeft, pixelsPerFrame, frameModulus) => {
          return <span key={`frame-${frameNumber}`} style={{height: guideHeight + 35, borderLeft: '1px solid ' + Color(Palette.COAL).fade(0.65), position: 'absolute', left: pixelOffsetLeft, top: 34}} />
        })}
      </div>
    )
  }

  renderScrubber () {
    var frameInfo = this.getFrameInfo()
    if (this.state.currentFrame < frameInfo.friA || this.state.currentFrame > frameInfo.fraB) return ''
    var frameOffset = this.state.currentFrame - frameInfo.friA
    var pxOffset = frameOffset * frameInfo.pxpf
    var shaftHeight = (this.refs.scrollview && this.refs.scrollview.clientHeight + 10) || 0
    return (
      <DraggableCore
        axis='x'
        onStart={(dragEvent, dragData) => {
          this.setState({
            inputFocused: null,
            inputSelected: null,
            scrubberDragStart: dragData.x,
            frameBaseline: this.state.currentFrame,
            avoidTimelinePointerEvents: true
          })
        }}
        onStop={(dragEvent, dragData) => {
          setTimeout(() => {
            this.setState({ scrubberDragStart: null, frameBaseline: this.state.currentFrame, avoidTimelinePointerEvents: false })
          }, 100)
        }}
        onDrag={lodash.throttle((dragEvent, dragData) => {
          this.changeScrubberPosition(dragData.x, frameInfo)
        }, THROTTLE_TIME)}>
        <div>
          <div
            style={{
              position: 'absolute',
              backgroundColor: Palette.SUNSTONE,
              height: 13,
              width: 13,
              top: 20,
              left: pxOffset - 6,
              borderRadius: '50%',
              cursor: 'move',
              boxShadow: '0 0 2px 0 rgba(0, 0, 0, .9)',
              zIndex: 1006
            }}>
            <span style={{
              position: 'absolute',
              zIndex: 1006,
              width: 0,
              height: 0,
              top: 8,
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderTop: '8px solid ' + Palette.SUNSTONE
            }} />
            <span style={{
              position: 'absolute',
              zIndex: 1006,
              width: 0,
              height: 0,
              left: 1,
              top: 8,
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderTop: '8px solid ' + Palette.SUNSTONE
            }} />
          </div>
          <div
            style={{
              position: 'absolute',
              zIndex: 1006,
              backgroundColor: Palette.SUNSTONE,
              height: shaftHeight,
              width: 1,
              top: 25,
              left: pxOffset,
              pointerEvents: 'none'
            }} />
        </div>
      </DraggableCore>
    )
  }

  renderDurationModifier () {
    var frameInfo = this.getFrameInfo()
    // var trimAreaHeight = (this.refs.scrollview && this.refs.scrollview.clientHeight - 25) || 0
    var pxOffset = this.state.dragIsAdding ? 0 : -this.state.durationTrim * frameInfo.pxpf

    if (frameInfo.friB >= frameInfo.friMax2 || this.state.dragIsAdding) {
      return (
        <DraggableCore
          axis='x'
          onStart={(dragEvent, dragData) => {
            this.setState({
              inputSelected: null,
              inputFocused: null,
              durationDragStart: dragData.x,
              durationTrim: 0
            })
          }}
          onStop={(dragEvent, dragData) => {
            var currentMax = this.state.maxFrame ? this.state.maxFrame : frameInfo.friMax2
            clearInterval(this.state.addInterval)
            this.setState({maxFrame: currentMax + this.state.durationTrim, dragIsAdding: false, addInterval: null})
            setTimeout(() => { this.setState({ durationDragStart: null, durationTrim: 0 }) }, 100)
          }}
          onDrag={(dragEvent, dragData) => {
            this.changeDurationModifierPosition(dragData.x, frameInfo)
          }}>
          <div style={{position: 'absolute', right: pxOffset, top: 0, zIndex: 1006}}>
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
    const frameInfo = this.getFrameInfo()
    return (
      <div
        className='top-controls no-select'
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: this.state.rowHeight + 10,
          width: this.state.propertiesWidth + this.state.timelinesWidth,
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
            width: this.state.propertiesWidth
          }}>
          <div
            className='gauge-time-readout'
            style={{
              float: 'right',
              top: 0,
              minWidth: 86,
              height: 'inherit',
              verticalAlign: 'top',
              textAlign: 'right',
              paddingTop: 2,
              paddingRight: 10
            }}>
            <span style={{ display: 'inline-block', height: 24, padding: 4, fontWeight: 'lighter', fontSize: 19 }}>
              {(this.state.timeDisplayMode === 'frames')
                ? <span>{~~this.state.currentFrame}f</span>
                : <span>{formatSeconds(this.state.currentFrame * 1000 / this.state.framesPerSecond / 1000)}s</span>
              }
            </span>
          </div>
          <div
            className='gauge-fps-readout'
            style={{
              width: 38,
              float: 'right',
              left: 211,
              height: 'inherit',
              verticalAlign: 'top',
              color: Palette.ROCK_MUTED,
              fontStyle: 'italic',
              textAlign: 'right',
              paddingTop: 5,
              paddingRight: 5,
              cursor: 'default'
            }}>
            <div>
              {(this.state.timeDisplayMode === 'frames')
                ? <span>{formatSeconds(this.state.currentFrame * 1000 / this.state.framesPerSecond / 1000)}s</span>
                : <span>{~~this.state.currentFrame}f</span>
              }
            </div>
            <div style={{marginTop: '-4px'}}>{this.state.framesPerSecond}fps</div>
          </div>
          <div
            className='gauge-toggle'
            onClick={this.toggleTimeDisplayMode.bind(this)}
            style={{
              width: 50,
              float: 'right',
              marginRight: 10,
              fontSize: 9,
              height: 'inherit',
              verticalAlign: 'top',
              color: Palette.ROCK_MUTED,
              textAlign: 'right',
              paddingTop: 7,
              paddingRight: 5,
              cursor: 'pointer'
            }}>
            {this.state.timeDisplayMode === 'frames'
              ? (<span>
                <div style={{color: Palette.ROCK, position: 'relative'}}>FRAMES
                    <span style={{width: 6, height: 6, backgroundColor: Palette.ROCK, borderRadius: '50%', position: 'absolute', right: -11, top: 2}} />
                </div>
                <div style={{marginTop: '-2px'}}>SECONDS</div>
              </span>)
              : (<span>
                <div>FRAMES</div>
                <div style={{marginTop: '-2px', color: Palette.ROCK, position: 'relative'}}>SECONDS
                    <span style={{width: 6, height: 6, backgroundColor: Palette.ROCK, borderRadius: '50%', position: 'absolute', right: -11, top: 2}} />
                </div>
              </span>)
            }
          </div>

        </div>
        <div
          className='gauge-box'
          onClick={(clickEvent) => {
            if (this.state.scrubberDragStart === null || this.state.scrubberDragStart === undefined) {
              let leftX = clickEvent.nativeEvent.offsetX
              let frameX = Math.round(leftX / frameInfo.pxpf)
              let newFrame = frameInfo.friA + frameX
              this.setState({
                inputSelected: null,
                inputFocused: null
              })
              this._component.getCurrentTimeline().seek(newFrame)
            }
          }}
          style={{
            // display: 'table-cell',
            position: 'absolute',
            top: 0,
            left: this.state.propertiesWidth,
            width: this.state.timelinesWidth,
            height: 'inherit',
            verticalAlign: 'top',
            paddingTop: 10,
            color: Palette.ROCK_MUTED }}>
          {this.renderFrameGrid(frameInfo)}
          {this.renderGauge(frameInfo)}
          {this.renderScrubber()}
        </div>
        {this.renderDurationModifier()}
      </div>
    )
  }

  renderTimelineRangeScrollbar () {
    const frameInfo = this.getFrameInfo()
    const knobRadius = 5
    return (
      <div
        className='timeline-range-scrollbar'
        style={{
          width: frameInfo.scL,
          height: knobRadius * 2,
          position: 'relative',
          backgroundColor: Palette.DARKER_GRAY,
          borderTop: '1px solid ' + Palette.FATHER_COAL,
          borderBottom: '1px solid ' + Palette.FATHER_COAL
        }}>
        <DraggableCore
          axis='x'
          onStart={(dragEvent, dragData) => {
            this.setState({
              scrollerBodyDragStart: dragData.x,
              scrollbarStart: this.state.visibleFrameRange[0],
              scrollbarEnd: this.state.visibleFrameRange[1],
              avoidTimelinePointerEvents: true
            })
          }}
          onStop={(dragEvent, dragData) => {
            this.setState({
              scrollerBodyDragStart: false,
              scrollbarStart: null,
              scrollbarEnd: null,
              avoidTimelinePointerEvents: false
            })
          }}
          onDrag={lodash.throttle((dragEvent, dragData) => {
            this.setState({ showHorzScrollShadow: frameInfo.scA > 0 }) // if the scrollbar not at position zero, show inner shadow for timeline area
            if (!this.state.scrollerLeftDragStart && !this.state.scrollerRightDragStart) {
              this.changeVisibleFrameRange(dragData.x, dragData.x, frameInfo)
            }
          }, THROTTLE_TIME)}>
          <div
            style={{
              position: 'absolute',
              backgroundColor: Palette.LIGHTEST_GRAY,
              height: knobRadius * 2,
              left: frameInfo.scA,
              width: frameInfo.scB - frameInfo.scA + 17,
              borderRadius: knobRadius,
              cursor: 'move'
            }}>
            <DraggableCore
              axis='x'
              onStart={(dragEvent, dragData) => { this.setState({ scrollerLeftDragStart: dragData.x, scrollbarStart: this.state.visibleFrameRange[0], scrollbarEnd: this.state.visibleFrameRange[1] }) }}
              onStop={(dragEvent, dragData) => { this.setState({ scrollerLeftDragStart: false, scrollbarStart: null, scrollbarEnd: null }) }}
              onDrag={lodash.throttle((dragEvent, dragData) => { this.changeVisibleFrameRange(dragData.x + frameInfo.scA, 0, frameInfo) }, THROTTLE_TIME)}>
              <div style={{ width: 10, height: 10, position: 'absolute', cursor: 'ew-resize', left: 0, borderRadius: '50%', backgroundColor: Palette.SUNSTONE }} />
            </DraggableCore>
            <DraggableCore
              axis='x'
              onStart={(dragEvent, dragData) => { this.setState({ scrollerRightDragStart: dragData.x, scrollbarStart: this.state.visibleFrameRange[0], scrollbarEnd: this.state.visibleFrameRange[1] }) }}
              onStop={(dragEvent, dragData) => { this.setState({ scrollerRightDragStart: false, scrollbarStart: null, scrollbarEnd: null }) }}
              onDrag={lodash.throttle((dragEvent, dragData) => { this.changeVisibleFrameRange(0, dragData.x + frameInfo.scA, frameInfo) }, THROTTLE_TIME)}>
              <div style={{ width: 10, height: 10, position: 'absolute', cursor: 'ew-resize', right: 0, borderRadius: '50%', backgroundColor: Palette.SUNSTONE }} />
            </DraggableCore>
          </div>
        </DraggableCore>
        <div style={{ width: this.state.propertiesWidth + this.state.timelinesWidth - 10, left: 10, position: 'relative' }}>
          <div style={{
            position: 'absolute',
            pointerEvents: 'none',
            height: knobRadius * 2,
            width: 1,
            backgroundColor: Palette.ROCK,
            left: ((this.state.currentFrame / frameInfo.friMax2) * 100) + '%'
          }} />
        </div>
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
        {this.renderTimelineRangeScrollbar()}
        {this.renderTimelinePlaybackControls()}
      </div>
    )
  }

  renderComponentRowHeading ({ node, locator, index, siblings, asciiBranch }) {
    // HACK: Until we enable full support for nested display in this list, swap the "technically correct"
    // tree marker with a "visually correct" marker representing the tree we actually show
    const height = asciiBranch === '└─┬ ' ? 15 : 25
    const color = node.__isExpanded ? Palette.ROCK : Palette.ROCK_MUTED
    const elementName = (typeof node.elementName === 'object') ? 'div' : node.elementName

    return (
      (locator === '0')
        ? (<div style={{height: 27, display: 'inline-block', transform: 'translateY(1px)'}}>
          {truncate(node.attributes['haiku-title'] || elementName, 12)}
        </div>)
        : (<span className='no-select'>
          <span
            style={{
              display: 'inline-block',
              fontSize: 21,
              position: 'relative',
              zIndex: 1005,
              verticalAlign: 'middle',
              color: Palette.GRAY_FIT1,
              marginRight: 7,
              marginTop: 1
            }}>
            <span style={{marginLeft: 5, backgroundColor: Palette.GRAY_FIT1, position: 'absolute', width: 1, height: height}} />
            <span style={{marginLeft: 4}}>—</span>
          </span>
          <span
            style={{
              color,
              position: 'relative',
              zIndex: 1005
            }}>
            {truncate(node.attributes['haiku-title'] || `<${elementName}>`, 8)}
          </span>
        </span>)
    )
  }

  renderComponentHeadingRow (item, index, height, items) {
    let componentId = item.node.attributes['haiku-id']
    return (
      <div
        key={`component-heading-row-${componentId}-${index}`}
        className='component-heading-row no-select'
        data-component-id={componentId}
        onClick={() => {
          // Collapse/expand the entire component area when it is clicked
          if (item.node.__isExpanded) {
            this.collapseNode(item.node, componentId)
            this.props.websocket.action('unselectElement', [this.props.folder, componentId], () => {})
          } else {
            this.expandNode(item.node, componentId)
            this.props.websocket.action('selectElement', [this.props.folder, componentId], () => {})
          }
        }}
        style={{
          display: 'table',
          tableLayout: 'fixed',
          height: item.node.__isExpanded ? 0 : height,
          width: '100%',
          cursor: 'pointer',
          position: 'relative',
          zIndex: 1005,
          backgroundColor: item.node.__isExpanded ? 'transparent' : Palette.LIGHT_GRAY,
          verticalAlign: 'top',
          opacity: (item.node.__isHidden) ? 0.75 : 1.0
        }}>
        {!item.node.__isExpanded && // covers keyframe hangover at frame 0 that for uncollapsed rows is hidden by the input field
          <div style={{
            position: 'absolute',
            zIndex: 1006,
            left: this.state.propertiesWidth - 10,
            top: 0,
            backgroundColor: Palette.LIGHT_GRAY,
            width: 10,
            height: this.state.rowHeight}} />}
        <div style={{
          display: 'table-cell',
          width: this.state.propertiesWidth - 150,
          height: 'inherit',
          position: 'absolute',
          zIndex: 3,
          backgroundColor: (item.node.__isExpanded) ? 'transparent' : Palette.LIGHT_GRAY
        }}>
          <div style={{ height, marginTop: -6 }}>
            <span
              style={{
                marginLeft: 10
              }}>
              {(item.node.__isExpanded)
                  ? <span className='utf-icon' style={{ top: 1, left: -1 }}><DownCarrotSVG color={Palette.ROCK} /></span>
                  : <span className='utf-icon' style={{ top: 3 }}><RightCarrotSVG /></span>
                }
            </span>
            {this.renderComponentRowHeading(item)}
          </div>
        </div>
        <div className='component-collapsed-segments-box' style={{ display: 'table-cell', width: this.state.timelinesWidth, height: 'inherit' }}>
          {(!item.node.__isExpanded) ? this.renderCollapsedPropertyTimelineSegments(item) : ''}
        </div>
      </div>
    )
  }

  renderPropertyRow (item, index, height, items, propertyOnLastComponent) {
    var frameInfo = this.getFrameInfo()
    var humanName = humanizePropertyName(item.property.name)
    var componentId = item.node.attributes['haiku-id']
    var elementName = (typeof item.node.elementName === 'object') ? 'div' : item.node.elementName
    var propertyName = item.property && item.property.name

    return (
      <div
        key={`property-row-${index}-${componentId}-${propertyName}`}
        className='property-row'
        style={{
          height,
          width: this.state.propertiesWidth + this.state.timelinesWidth,
          left: 0,
          opacity: (item.node.__isHidden) ? 0.5 : 1.0,
          position: 'relative'
        }}>
        <div
          onClick={() => {
            // Collapse this cluster if the arrow or name is clicked
            let expandedPropertyClusters = lodash.clone(this.state.expandedPropertyClusters)
            expandedPropertyClusters[item.clusterKey] = !expandedPropertyClusters[item.clusterKey]
            this.setState({
              inputSelected: null, // Deselct any selected input
              inputFocused: null, // Cancel any pending change inside a focused input
              expandedPropertyClusters
            })
          }}>
          {(item.isClusterHeading)
            ? <div
              style={{
                position: 'absolute',
                width: 14,
                left: 136,
                top: -2,
                zIndex: 1006,
                textAlign: 'right',
                height: 'inherit'
              }}>
              <span className='utf-icon' style={{ top: -4, left: -3 }}><DownCarrotSVG /></span>
            </div>
            : ''
          }
          {(!propertyOnLastComponent && humanName !== 'background color') &&
            <div style={{
              position: 'absolute',
              left: 36,
              width: 5,
              zIndex: 1005,
              borderLeft: '1px solid ' + Palette.GRAY_FIT1,
              height
            }} />
          }
          <div
            className='property-row-label no-select'
            style={{
              right: 0,
              width: this.state.propertiesWidth - 80,
              height: this.state.rowHeight,
              textAlign: 'right',
              backgroundColor: Palette.GRAY,
              zIndex: 1004,
              position: 'relative',
              paddingTop: 6,
              paddingRight: 10
            }}>
            <div style={{
              textTransform: 'uppercase',
              fontSize: 10,
              width: 91,
              lineHeight: 1,
              float: 'right',
              color: Palette.ROCK,
              transform: humanName === 'background color' ? 'translateY(-2px)' : 'translateY(3px)',
              position: 'relative'
            }}>
              {humanName}
            </div>
          </div>
        </div>
        <div className='property-input-field'
          style={{
            position: 'absolute',
            left: this.state.propertiesWidth - 82,
            width: 82,
            top: 0,
            height: this.state.rowHeight - 1,
            textAlign: 'left'
          }}>
          <PropertyInputField
            parent={this}
            item={item}
            index={index}
            height={height}
            frameInfo={frameInfo}
            component={this._component}
            isPlayerPlaying={this.state.isPlayerPlaying}
            timelineTime={this.getCurrentTimelineTime(frameInfo)}
            timelineName={this.state.currentTimelineName}
            rowHeight={this.state.rowHeight}
            inputSelected={this.state.inputSelected}
            serializedBytecode={this.state.serializedBytecode}
            reifiedBytecode={this.state.reifiedBytecode} />
        </div>
        <div
          onContextMenu={(ctxMenuEvent) => {
            ctxMenuEvent.stopPropagation()
            let localOffsetX = ctxMenuEvent.nativeEvent.offsetX
            let totalOffsetX = localOffsetX + frameInfo.pxA
            let clickedFrame = Math.round(totalOffsetX / frameInfo.pxpf)
            let clickedMs = Math.round((totalOffsetX / frameInfo.pxpf) * frameInfo.mspf)
            this.ctxmenu.show({
              type: 'property-row',
              frameInfo,
              event: ctxMenuEvent.nativeEvent,
              componentId,
              propertyName,
              timelineName: this.state.currentTimelineName,
              localOffsetX,
              totalOffsetX,
              clickedFrame,
              clickedMs,
              elementName
            })
          }}
          className='property-timeline-segments-box'
          onMouseDown={() => {
            let key = item.componentId + ' ' + item.property.name
            // Avoid unnecessary setStates which can impact rendering performance
            if (!this.state.activatedRows[key]) {
              let activatedRows = {}
              activatedRows[key] = true
              this.setState({ activatedRows })
            }
          }}
          style={{
            position: 'absolute',
            width: this.state.timelinesWidth,
            left: this.state.propertiesWidth - 4, // offset half of lone keyframe width so it lines up with the pole
            top: 0,
            height: 'inherit'
          }}>
          {this.renderPropertyTimelineSegments(frameInfo, item, index, height, items, this.state.reifiedBytecode)}
        </div>
      </div>
    )
  }

  renderClusterRow (item, index, height, items, propertyOnLastComponent) {
    var frameInfo = this.getFrameInfo()
    var componentId = item.node.attributes['haiku-id']
    var elementName = (typeof item.node.elementName === 'object') ? 'div' : item.node.elementName
    var clusterName = item.clusterName
    var reifiedBytecode = this.state.reifiedBytecode
    return (
      <div
        key={`property-cluster-row-${index}-${componentId}-${clusterName}`}
        className='property-cluster-row'
        onClick={() => {
          // Expand the property cluster when it is clicked
          let expandedPropertyClusters = lodash.clone(this.state.expandedPropertyClusters)
          expandedPropertyClusters[item.clusterKey] = !expandedPropertyClusters[item.clusterKey]
          this.setState({
            inputSelected: null,
            inputFocused: null,
            expandedPropertyClusters
          })
        }}
        onContextMenu={(ctxMenuEvent) => {
          ctxMenuEvent.stopPropagation()
          let expandedPropertyClusters = lodash.clone(this.state.expandedPropertyClusters)
          expandedPropertyClusters[item.clusterKey] = !expandedPropertyClusters[item.clusterKey]
          this.setState({
            inputSelected: null,
            inputFocused: null,
            expandedPropertyClusters
          })
        }}
        style={{
          height,
          width: this.state.propertiesWidth + this.state.timelinesWidth,
          left: 0,
          opacity: (item.node.__isHidden) ? 0.5 : 1.0,
          position: 'relative',
          cursor: 'pointer'
        }}>
        <div>
          {!propertyOnLastComponent &&
            <div style={{
              position: 'absolute',
              left: 36,
              width: 5,
              borderLeft: '1px solid ' + Palette.GRAY_FIT1,
              height
            }} />
          }
          <div
            style={{
              position: 'absolute',
              left: 145,
              width: 10,
              height: 'inherit'
            }}>
            <span className='utf-icon' style={{ top: -2, left: -3 }}><RightCarrotSVG /></span>
          </div>
          <div
            className='property-cluster-row-label no-select'
            style={{
              right: 0,
              width: this.state.propertiesWidth - 90,
              height: 'inherit',
              textAlign: 'right',
              position: 'relative',
              paddingTop: 5
            }}>
            <span style={{
              textTransform: 'uppercase',
              fontSize: 10,
              color: Palette.DARK_ROCK
            }}>
              {clusterName}
            </span>
          </div>
        </div>
        <div className='property-cluster-input-field'
          style={{
            position: 'absolute',
            left: this.state.propertiesWidth - 82,
            width: 82,
            top: 0,
            height: 24,
            textAlign: 'left'
          }}>
          <ClusterInputField
            parent={this}
            item={item}
            index={index}
            height={height}
            frameInfo={frameInfo}
            component={this._component}
            isPlayerPlaying={this.state.isPlayerPlaying}
            timelineTime={this.getCurrentTimelineTime(frameInfo)}
            timelineName={this.state.currentTimelineName}
            rowHeight={this.state.rowHeight}
            serializedBytecode={this.state.serializedBytecode}
            reifiedBytecode={reifiedBytecode} />
        </div>
        <div
          className='property-cluster-timeline-segments-box'
          style={{
            overflow: 'hidden',
            position: 'absolute',
            width: this.state.timelinesWidth,
            left: this.state.propertiesWidth - 4, // offset half of lone keyframe width so it lines up with the pole
            top: 0,
            height: 'inherit'
          }}>
          {this.mapVisibleComponentTimelineSegments(frameInfo, componentId, elementName, [item], reifiedBytecode, (prev, curr, next, pxOffsetLeft, pxOffsetRight, index) => {
            let segmentPieces = []
            if (curr.curve) {
              segmentPieces.push(this.renderTransitionBody(frameInfo, componentId, elementName, curr.name, reifiedBytecode, prev, curr, next, pxOffsetLeft, pxOffsetRight, 1, { collapsed: true, collapsedProperty: true }))
            } else {
              if (next) {
                segmentPieces.push(this.renderConstantBody(frameInfo, componentId, elementName, curr.name, reifiedBytecode, prev, curr, next, pxOffsetLeft, pxOffsetRight, 2, { collapsed: true, collapsedProperty: true }))
              }
              if (!prev || !prev.curve) {
                segmentPieces.push(this.renderSoloKeyframe(frameInfo, componentId, elementName, curr.name, reifiedBytecode, prev, curr, next, pxOffsetLeft, pxOffsetRight, 3, { collapsed: true, collapsedProperty: true }))
              }
            }
            return segmentPieces
          })}
        </div>
      </div>
    )
  }

  // Creates a virtual list of all the component rows (includes headings and property rows)
  renderComponentRows (items) {
    if (!this.state.didMount) return <span />

    return (
      <div
        className='property-row-list'
        style={lodash.assign({}, {
          position: 'absolute'
        })}>
        {items.map((item, index) => {
          const propertyOnLastComponent = item.siblings.length > 0 && item.index === item.siblings.length - 1
          if (item.isCluster) {
            return this.renderClusterRow(item, index, this.state.rowHeight, items, propertyOnLastComponent)
          } else if (item.isProperty) {
            return this.renderPropertyRow(item, index, this.state.rowHeight, items, propertyOnLastComponent)
          } else {
            return this.renderComponentHeadingRow(item, index, this.state.rowHeight, items)
          }
        })}
      </div>
    )
  }

  render () {
    this.state.componentRowsData = this.getComponentRowsData()
    return (
      <div
        ref='container'
        id='timeline'
        className='no-select'
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
        {this.state.showHorzScrollShadow &&
          <span className='no-select' style={{
            position: 'absolute',
            height: '100%',
            width: 3,
            left: 297,
            zIndex: 2003,
            top: 0,
            boxShadow: '3px 0 6px 0 rgba(0,0,0,.22)'
          }} />
        }
        {this.renderTopControls()}
        <div
          ref='scrollview'
          id='property-rows'
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
          }}>
          {this.renderComponentRows(this.state.componentRowsData)}
        </div>
        {this.renderBottomControls()}
        <ExpressionInput
          ref='expressionInput'
          reactParent={this}
          inputSelected={this.state.inputSelected}
          inputFocused={this.state.inputFocused}
          onCommitValue={(committedValue) => {
            console.info('[timeline] input commit:', JSON.stringify(committedValue))

            this.executeBytecodeActionCreateKeyframe(
              getItemComponentId(this.state.inputFocused),
              this.state.currentTimelineName,
              this.state.inputFocused.node.elementName,
              getItemPropertyName(this.state.inputFocused),
              this.getCurrentTimelineTime(this.getFrameInfo()),
              committedValue,
              void (0), // curve
              void (0), // endMs
              void (0) // endValue
            )
          }}
          onFocusRequested={() => {
            this.setState({
              inputFocused: this.state.inputSelected
            })
          }}
          onNavigateRequested={(navDir, doFocus) => {
            let item = this.state.inputSelected
            let next = nextPropItem(item, navDir)
            if (next) {
              this.setState({
                inputFocused: (doFocus) ? next : null,
                inputSelected: next
              })
            }
          }} />
      </div>
    )
  }
}

function _buildComponentAddressables (node) {
  var addressables = _buildDOMAddressables('div') // start with dom properties?
  for (let name in node.elementName.states) {
    let state = node.elementName.states[name]

    addressables.push({
      name: name,
      prefix: name,
      suffix: undefined,
      fallback: state.value,
      typedef: state.type
    })
  }
  return addressables
}

function _buildDOMAddressables (elementName, locator) {
  var addressables = []

  const domSchema = DOMSchema[elementName]
  const domFallbacks = DOMFallbacks[elementName]

  if (domSchema) {
    for (var propertyName in domSchema) {
      let propertyGroup = null

      if (locator === '0') { // This indicates the top level element (the artboard)
        if (ALLOWED_PROPS_TOP_LEVEL[propertyName]) {
          let nameParts = propertyName.split('.')

          if (propertyName === 'style.overflowX') nameParts = ['overflow', 'x']
          if (propertyName === 'style.overflowY') nameParts = ['overflow', 'y']

          propertyGroup = {
            name: propertyName,
            prefix: nameParts[0],
            suffix: nameParts[1],
            fallback: domFallbacks[propertyName],
            typedef: domSchema[propertyName]
          }
        }
      } else {
        if (ALLOWED_PROPS[propertyName]) {
          let nameParts = propertyName.split('.')
          propertyGroup = {
            name: propertyName,
            prefix: nameParts[0],
            suffix: nameParts[1],
            fallback: domFallbacks[propertyName],
            typedef: domSchema[propertyName]
          }
        }
      }

      if (propertyGroup) {
        let clusterPrefix = CLUSTERED_PROPS[propertyGroup.name]
        if (clusterPrefix) {
          propertyGroup.cluster = {
            prefix: clusterPrefix,
            name: CLUSTER_NAMES[clusterPrefix]
          }
        }

        addressables.push(propertyGroup)
      }
    }
  }

  return addressables
}

export default Timeline
