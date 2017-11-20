import React from 'react'
import Color from 'color'
import lodash from 'lodash'
import { DraggableCore } from 'react-draggable'

import ActiveComponent from 'haiku-serialization/src/bll/ActiveComponent'
import TimelineModel from 'haiku-serialization/src/bll/Timeline'
import Row from 'haiku-serialization/src/bll/Row'

import Palette from './DefaultPalette'

import ControlsArea from './ControlsArea'
import ContextMenu from './ContextMenu'
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

const Globals = require('./Globals') // Sorry, hack

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
  timeDisplayMode: 'frames', // or 'seconds'
  isPlayerPlaying: false,
  playerPlaybackSpeed: 1.0,
  isShiftKeyDown: false,
  isCommandKeyDown: false,
  isControlKeyDown: false,
  isAltKeyDown: false,
  avoidTimelinePointerEvents: false,
  isPreviewModeActive: false,
  $update: { time: Date.now() } // legacy?
}

const THROTTLE_TIME = 32 // ms

class Timeline extends React.Component {
  constructor (props) {
    super(props)

    this.state = lodash.assign({}, DEFAULTS)
    this.ctxmenu = new ContextMenu(window, this)

    this.emitters = [] // Array<{eventEmitter:EventEmitter, eventName:string, eventHandler:Function}>

    this.component = ActiveComponent.upsert({
      alias: 'timeline',
      uid: this.props.folder + '::' + this.props.scenename,
      folder: this.props.folder,
      userconfig: this.props.userconfig,
      websocket: this.props.websocket,
      platform: window,
      envoy: this.props.envoy,
      WebSocket: window.WebSocket
    })

    this.component.on('envoy:tourClientReady', (tourClient) => {
      this.tourClient = tourClient
      this.tourClient.on('tour:requestElementCoordinates', this.handleRequestElementCoordinates)
      // When the timeline loads, that is the indication to move from the first tour step
      // to the next step that shows how to create animations
      setTimeout(() => {
        if (!this.component._envoyClient.isInMockMode() && this.tourClient) {
          this.tourClient.next()
        }
      })
    })

    this.handleRequestElementCoordinates = this.handleRequestElementCoordinates.bind(this)

    // Used to calculate scroll position
    this._renderedRows = []

    window.timeline = this

    document.addEventListener('mousemove', (mouseMoveEvent) => {
      const timeline = this.component.getCurrentTimeline()
      // The timeline might not be initialized as of the first mouse move
      if (timeline) {
        const frameInfo = timeline.getFrameInfo()
        let pxInTimeline = mouseMoveEvent.clientX - timeline.getPropertiesPixelWidth()
        if (pxInTimeline < 0) pxInTimeline = 0
        const frameForPx = frameInfo.friA + Math.round(pxInTimeline / frameInfo.pxpf)
        timeline.hoverFrame(frameForPx)
      }
    })
  }

  /*
   * lifecycle/events
   * --------- */

  componentWillUnmount () {
    this.mounted = false

    // Clean up subscriptions to prevent memory leaks and react warnings
    this.emitters.forEach((tuple) => {
      tuple[0].removeListener(tuple[1], tuple[2])
    })

    if (this.tourClient) {
      this.tourClient.removeListener('tour:requestElementCoordinates', this.handleRequestElementCoordinates)
    }

    this.component._envoyClient.closeConnection()
  }

  componentDidMount () {
    this.mounted = true

    this.component.mountApplication()

    this.addEmitterListener(this.component, 'update', (what, arg) => {
      if (what === 'application-mounted') {
        this.handleHaikuComponentMounted()
        this.forceUpdate()
      } else if (what === 'reloaded') {
        if (arg === 'hard') {
          this.forceUpdate()
        }
      }
    })

    this.addEmitterListener(this.component, 'remote-update', (what, data) => {
      if (what === 'setInteractionMode') {
        // If we've toggled into preview mode
        const isPreviewModeActive = isPreviewMode(data.interactionMode)

        if (!isPreviewModeActive) {
          this.playbackSkipBack()
          this.forceUpdate()
        }

        this.setState({isPreviewModeActive})
      }
    })
  }

  handleHaikuComponentMounted () {
    this.component.getCurrentTimeline().setTimelinePixelWidth(document.body.clientWidth - this.component.getCurrentTimeline().getPropertiesPixelWidth() + 20)

    window.addEventListener('resize', lodash.throttle(() => {
      if (this.mounted) {
        const pxWidth = document.body.clientWidth - this.component.getCurrentTimeline().getPropertiesPixelWidth()
        this.component.getCurrentTimeline().setTimelinePixelWidth(pxWidth + 20)
        this.forceUpdate()
      }
    }, THROTTLE_TIME))

    this.addEmitterListener(this.props.websocket, 'broadcast', (message) => {
      if (message.folder !== this.props.folder) return void (0)
      switch (message.name) {
        case 'component:reload':
          return this.component.moduleReplace(() => {})
        case 'view:mousedown':
          if (message.elid !== 'timeline-webview') {
            return this.component.deselectAndDeactivateAllKeyframes()
          }
          break
        default: return void (0)
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

    this.addEmitterListener(this.ctxmenu, 'createKeyframe', (event, model, offset) => {
      const { ms } = this.getEventPositionInfo(event, offset)
      // The model here might be
      model.createKeyframe(undefined, ms, { from: 'timeline' })
    })

    this.addEmitterListener(this.ctxmenu, 'splitSegment', () => {
      this.component.splitSelectedKeyframes({ from: 'timeline' })
    })

    this.addEmitterListener(this.ctxmenu, 'deleteKeyframe', () => {
      this.component.deleteSelectedKeyframes({ from: 'timeline' })
    })

    this.addEmitterListener(this.ctxmenu, 'joinKeyframes', (curveName) => {
      this.component.joinSelectedKeyframes(curveName, { from: 'timeline' })
      if (!this.component._envoyClient.isInMockMode() && this.tourClient) {
        this.tourClient.next()
      }
    })

    this.addEmitterListener(this.ctxmenu, 'changeSegmentCurve', (curveName) => {
      this.component.changeCurveOnSelectedKeyframes(curveName, { from: 'timeline' })
    })

    this.addEmitterListener(Row, 'update', (row, what) => {
      if (what === 'row-collapsed' || what === 'row-expanded') {
        this.forceUpdate()
      } else if (what === 'row-selected') {
        // TODO: Handle scrolling to the correct row
      }
    })

    this.addEmitterListener(TimelineModel, 'timeline-model:stop-playback', () => {
      this.setState({ isPlayerPlaying: false })
    })
  }

  getEventPositionInfo (event, extra) {
    const frameInfo = this.component.getCurrentTimeline().getFrameInfo()

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
    this.component.getCurrentTimeline().updateVisibleFrameRangeByDelta(motionDelta)
  }

  handleRequestElementCoordinates ({ selector, webview }) {
    if (webview !== 'timeline') { return }
    console.info('[timeline] handleRequestElementCoordinates', selector, webview)
    try {
      // TODO: find if there is a better solution to this escape hatch
      let element = document.querySelector(selector)
      let { top, left } = element.getBoundingClientRect()

      if (this.tourClient && this.component._envoyClient && !this.component._envoyClient.isInMockMode()) {
        console.info('[timeline] receive element coordinates', selector, top, left)
        this.tourClient.receiveElementCoordinates('timeline', { top, left })
      }
    } catch (exception) {
      console.error(`[timeline] Error fetching ${selector} in webview ${webview} (${exception})`)
    }
  }

  handleKeyDown (nativeEvent) {
    // Give the currently active expression input a chance to capture this event and short circuit us if so
    const willExprInputHandle = this.refs.expressionInput.willHandleExternalKeydownEvent(nativeEvent)
    // console.log(willExprInputHandle) // Numeric reason for handling the event
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
            this.component.getCurrentTimeline().setVisibleFrameRange(0, this.component.getCurrentTimeline().getRightFrameEndpoint())
            return this.component.getCurrentTimeline().updateCurrentFrame(0)
          } else {
            return this.component.getCurrentTimeline().updateScrubberPositionByDelta(-1)
          }
        } else {
          return this.component.getCurrentTimeline().updateVisibleFrameRangeByDelta(-1)
        }

      case 39: // right
        if (this.state.isCommandKeyDown) {
          return this.component.getCurrentTimeline().updateScrubberPositionByDelta(1)
        } else {
          return this.component.getCurrentTimeline().updateVisibleFrameRangeByDelta(1)
        }

      // case 38: // up
      // case 40: // down
      // case 46: //delete
      // case 13: //enter
      // delete
      case 8: return this.component.deleteSelectedKeyframes({ from: 'timeline' }) // Only if there are any
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
      // case 38: // up
      // case 40: // down
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
    if (!this.component.getFocusedRow()) {
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

  toggleTimeDisplayMode () {
    if (this.state.timeDisplayMode === 'frames') {
      this.setState({
        timeDisplayMode: 'seconds'
      })
    } else {
      this.setState({
        timeDisplayMode: 'frames'
      })
    }
  }

  playbackSkipBack () {
    let frameInfo = this.component.getCurrentTimeline().getFrameInfo()
    this.component.getCurrentTimeline().seekAndPause(frameInfo.fri0)
    this.component.getCurrentTimeline().updateCurrentFrame(frameInfo.fri0)
    this.component.getCurrentTimeline().tryToLeftAlignTickerInVisibleFrameRange(frameInfo.fri0)
    this.setState({ isPlayerPlaying: false })
  }

  playbackSkipForward () {
    let frameInfo = this.component.getCurrentTimeline().getFrameInfo()
    this.component.getCurrentTimeline().seekAndPause(frameInfo.maxf)
    this.component.getCurrentTimeline().updateCurrentFrame(frameInfo.maxf)
    this.component.getCurrentTimeline().tryToLeftAlignTickerInVisibleFrameRange(frameInfo.maxf)
    this.setState({ isPlayerPlaying: false })
  }

  togglePlayback () {
    if (this.component.getCurrentTimeline().getCurrentFrame() >= this.component.getCurrentTimeline().getFrameInfo().maxf) {
      this.playbackSkipBack()
    }

    if (this.state.isPlayerPlaying) {
      this.setState({
        isPlayerPlaying: false
      }, () => {
        this.component.getCurrentTimeline().pause()
      })
    } else {
      this.setState({
        isPlayerPlaying: true
      }, () => {
        this.component.getCurrentTimeline().play()
      })
    }
  }

  renderTimelinePlaybackControls () {
    return (
      <div
        style={{
          position: 'relative',
          top: 17
        }}>
        <ControlsArea
          $update={this.state.$update}
          timeline={this.component.getCurrentTimeline()}
          activeComponentDisplayName={this.props.userconfig.name}
          selectedTimelineName={this.component.getCurrentTimeline().getName()}
          playbackSpeed={this.state.playerPlaybackSpeed}
          changeTimelineName={(oldTimelineName, newTimelineName) => {
            this.component.renameTimeline(oldTimelineName, newTimelineName, { from: 'timeline' }, () => {})
          }}
          createTimeline={(timelineName) => {
            this.component.createTimeline(timelineName, {}, { from: 'timeline' }, () => {})
          }}
          duplicateTimeline={(timelineName) => {
            this.component.duplicateTimeline(timelineName, { from: 'timeline' }, () => {})
          }}
          deleteTimeline={(timelineName) => {
            this.component.deleteTimeline(timelineName, { from: 'timeline' }, () => {})
          }}
          selectTimeline={(currentTimelineName) => {
            this.component.setTimelineName(currentTimelineName, { from: 'timeline' }, () => {})
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
          }} />
      </div>
    )
  }

  getCurrentTimelineTime (frameInfo) {
    return Math.round(this.component.getCurrentTimeline().getCurrentFrame() * frameInfo.mspf)
  }

  renderDurationModifier () {
    var frameInfo = this.component.getCurrentTimeline().getFrameInfo()

    var pxOffset = this.component.getCurrentTimeline().getDragIsAdding() ? 0 : -this.component.getCurrentTimeline().getDurationTrim() * frameInfo.pxpf

    if (frameInfo.friB >= frameInfo.friMax || this.component.getCurrentTimeline().getDragIsAdding()) {
      return (
        <DraggableCore
          axis='x'
          onStart={(dragEvent, dragData) => {
            this.component.getCurrentTimeline().setDurationTrim(0)
          }}
          onStop={(dragEvent, dragData) => {
            this.component.getCurrentTimeline().handleDurationModifierStop(dragData)
          }}
          onDrag={(dragEvent, dragData) => {
            this.component.getCurrentTimeline().dragDurationModifierPosition(dragData.x)
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
          width: this.component.getCurrentTimeline().getPropertiesPixelWidth() + this.component.getCurrentTimeline().getTimelinePixelWidth(),
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
            width: this.component.getCurrentTimeline().getPropertiesPixelWidth()
          }}>
          <GaugeTimeReadout
            reactParent={this}
            timeDisplayMode={this.state.timeDisplayMode}
            timeline={this.component.getCurrentTimeline()} />
        </div>
        <div
          id='gauge-box'
          className='gauge-box'
          onClick={(clickEvent) => {
            if (clickEvent.nativeEvent.target.id === 'gauge-box') {
              if (!this.component.getCurrentTimeline().isScrubberDragging()) {
                const frameInfo = this.component.getCurrentTimeline().getFrameInfo()

                const leftX = clickEvent.nativeEvent.offsetX
                const frameX = Math.round(leftX / frameInfo.pxpf)
                const newFrame = frameInfo.friA + frameX
                const pageFrameLength = this.component.getCurrentTimeline().getVisibleFrameRangeLength()

                // If the frame clicked exceeds the virtual or explicit max, allocate additional
                // virtual frames in the view and jump the user to the new page
                if (newFrame > frameInfo.friB) {
                  const newMaxFrame = newFrame + pageFrameLength
                  this.component.getCurrentTimeline().setMaxFrame(newMaxFrame)
                  this.component.getCurrentTimeline().setVisibleFrameRange(newFrame, newMaxFrame)
                }

                this.component.getCurrentTimeline().seek(newFrame)
              }
            }
          }}
          style={{
            // display: 'table-cell',
            position: 'absolute',
            top: 0,
            left: this.component.getCurrentTimeline().getPropertiesPixelWidth(),
            width: this.component.getCurrentTimeline().getTimelinePixelWidth(),
            height: 'inherit',
            verticalAlign: 'top',
            paddingTop: 10,
            color: Palette.ROCK_MUTED }}>
          <FrameGrid
            $update={this.state.$update}
            timeline={this.component.getCurrentTimeline()} />
          <Gauge
            $update={this.state.$update}
            timeDisplayMode={this.state.timeDisplayMode}
            timeline={this.component.getCurrentTimeline()} />
          <Scrubber
            $update={this.state.$update}
            reactParent={this}
            timeline={this.component.getCurrentTimeline()} />
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
          $update={this.state.$update}
          reactParent={this}
          timeline={this.component.getCurrentTimeline()} />
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
                $update={this.state.$update}
                ctxmenu={this.ctxmenu}
                rowHeight={this.state.rowHeight}
                isPlayerPlaying={this.state.isPlayerPlaying}
                timeline={this.component.getCurrentTimeline()}
                component={this.component}
                row={row} />
            )
          }

          if (row.isProperty()) {
            this._renderedRows.push(row)
            return (
              <PropertyRow
                key={row.getUniqueKey()}
                $update={this.state.$update}
                ctxmenu={this.ctxmenu}
                rowHeight={this.state.rowHeight}
                isPlayerPlaying={this.state.isPlayerPlaying}
                timeline={this.component.getCurrentTimeline()}
                component={this.component}
                row={row} />
            )
          }

          if (row.isHeading()) {
            this._renderedRows.push(row)
            return (
              <ComponentHeadingRow
                key={row.getUniqueKey()}
                $update={this.state.$update}
                ctxmenu={this.ctxmenu}
                rowHeight={this.state.rowHeight}
                isPlayerPlaying={this.state.isPlayerPlaying}
                timeline={this.component.getCurrentTimeline()}
                component={this.component}
                row={row} />
            )
          }

          // If we got here, display nothing since we don't know what to render
          return ''
        })}
      </div>
    )
  }

  render () {
    if (!this.component.getCurrentTimeline()) {
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
          Row.all().forEach((row) => {
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
          overflowX: 'hidden',
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
          timeline={this.component.getCurrentTimeline()} />
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
              this.component.deselectAndDeactivateAllKeyframes()
            }
          }}>
          {this.renderComponentRows(this.component.getDisplayableRows())}
        </div>
        {this.renderBottomControls()}
        <ExpressionInput
          ref='expressionInput'
          $update={this.state.$update}
          reactParent={this}
          component={this.component}
          timeline={this.component.getCurrentTimeline()}
          onCommitValue={(committedValue) => {
            const row = this.component.getFocusedRow()
            const ms = this.component.getCurrentTimeline().getCurrentMs()

            console.info('[timeline] commit', JSON.stringify(committedValue), 'at', ms, 'on', row.dump())

            row.createKeyframe(committedValue, ms, { from: 'timeline' })

            if (row.element.getNameString() === 'svg' && row.getPropertyName() === 'opacity') {
              if (!this.component._envoyClient.isInMockMode() && this.tourClient) {
                this.tourClient.next()
              }
            }
          }}
          onFocusRequested={() => {
            const selected = Row.getSelectedRow()
            if (selected.isProperty()) {
              selected.focus({ from: 'timeline' })
            }
          }}
          onNavigateRequested={(navDir, doFocus) => {
            Row.focusSelectNext(navDir, doFocus, { from: 'timeline' })
          }} />
      </div>
    )
  }
}

export default Timeline
