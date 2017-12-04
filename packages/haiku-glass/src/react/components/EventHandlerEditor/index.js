import React from 'react'
import {get} from 'lodash'
import ElementTitle from './ElementTitle'
import CSSStyles from './CSSStyles'
import Editor from './Editor'
import EditorActions from './EditorActions'
import HandlerManager from './HandlerManager'
import Palette from '../../Palette'
import {EDITOR_WIDTH, EDITOR_HEIGHT} from './constants'

const STYLES = {
  container: {
    width: EDITOR_WIDTH,
    height: EDITOR_HEIGHT,
    backgroundColor: Palette.COAL,
    borderRadius: '4px',
    padding: '64px 0 20px 20px',
    zIndex: 9001
  },
  outer: {
    position: 'relative'
  },
  editorsWrapper: {
    overflowY: 'auto',
    overflowX: 'visible',
    height: '255px',
    width: '100%',
    paddingRight: '18px',
    paddingTop: '23px'
  }
}

class EventHandlerEditor extends React.PureComponent {
  constructor (props) {
    super(props)

    this.handlerManager = null
    this.onEditorContentChange = this.onEditorContentChange.bind(this)
    this.onEditorEventChange = this.onEditorEventChange.bind(this)
    this.onEditorRemoved = this.onEditorRemoved.bind(this)
    this.addAction = this.addAction.bind(this)
  }

  /**
   * Since the Glass renders on every animation frame, we implemented a custom
   * shouldComponentUpdate function for performance reasons.
   *
   * We should avoid at all costs:
   *
   * 1- Triggering a re-render
   * 2- Instantiating a HandlerManager
   */
  shouldComponentUpdate ({element, visible, options}, nextState) {
    if (element && get(this.props, 'element.uid') !== get(element, 'uid')) {
      this.handlerManager = new HandlerManager(element)
      return true
    }

    if (options && options.frame !== this.props.options.frame) {
      return true
    }

    if (visible !== this.props.visible) {
      return true
    }

    return false
  }

  addAction () {
    this.handlerManager.addNextAvailableEventHandler()
    this.forceUpdate()
  }

  doSave () {
    const serializedEventHandlers = this.handlerManager.serialize()
    this.props.save(this.props.element, serializedEventHandlers)
    this.props.close()
  }

  doCancel () {
    this.props.close()
  }

  onEditorContentChange (serializedEvent, oldEvent) {
    this.handlerManager.replaceEvent(serializedEvent, oldEvent)
  }

  onEditorEventChange (serializedEvent, oldEvent) {
    this.handlerManager.replaceEvent(serializedEvent, oldEvent)
    this.forceUpdate()
  }

  onEditorRemoved ([editor, {event}]) {
    this.handlerManager.delete(event)
    this.forceUpdate()
  }

  renderFrameEditor (totalNumberOfHandlers, applicableEventHandlers) {
    const event = `timeline:Default:${this.props.options.frame}`
    const {id, handler} = this.handlerManager.getOrGenerateEventHandler(event)

    return this.renderSingleEditor(
      id,
      event,
      handler,
      applicableEventHandlers,
      totalNumberOfHandlers
    )
  }

  renderEventsEditor (totalNumberOfHandlers, applicableEventHandlers) {
    // If the element doesn't have any handlers, let's show a default editor
    if (!this.handlerManager.hasDOMEvents()) {
      this.handlerManager.addNextAvailableEventHandler()
      totalNumberOfHandlers = 1
    }

    return this.handlerManager
      .DOMEvents()
      .map(({id, event, handler}) => {
        return this.renderSingleEditor(
          id,
          event,
          handler,
          applicableEventHandlers,
          totalNumberOfHandlers
        )
      })
      .reverse()
  }

  renderSingleEditor (
    id,
    event,
    handler,
    applicableEventHandlers,
    totalNumberOfHandlers
  ) {
    return (
      <Editor
        onContentChange={this.onEditorContentChange}
        onEventChange={this.onEditorEventChange}
        onRemove={this.onEditorRemoved}
        applicableHandlers={applicableEventHandlers}
        appliedHandlers={this.handlerManager}
        selectedEventName={event}
        params={handler.params}
        contents={handler.body}
        key={id}
        id={id}
        deleteable={
          totalNumberOfHandlers > 1 && !this.props.options.isSimplified
        }
        hideEventSelector={this.props.options.isSimplified}
      />
    )
  }

  renderEditors () {
    if (!this.handlerManager) return []

    let totalNumberOfHandlers = this.handlerManager.size()
    const applicableEventHandlers = this.handlerManager.getApplicableEventHandlers()

    return this.props.options.frame
      ? this.renderFrameEditor(totalNumberOfHandlers, applicableEventHandlers)
      : this.renderEventsEditor(totalNumberOfHandlers, applicableEventHandlers)
  }

  render () {
    const visibilityStyles = this.props.visible ? {} : {visibility: 'hidden'}

    return (
      <div
        className='Absolute-Center'
        onMouseDown={mouseEvent => {
          // Prevent outer view from closing us
          mouseEvent.stopPropagation()
        }}
        style={{
          ...STYLES.container,
          ...visibilityStyles
        }}
      >
        <style>{CSSStyles}</style>

        <ElementTitle
          element={this.props.element}
          title={
            this.props.options.frame
              ? `Frame ${this.props.options.frame}`
              : null
          }
          hideActions={this.props.options.isSimplified}
          onNewAction={this.addAction}
        />

        <div style={STYLES.outer}>
          <div style={STYLES.editorsWrapper} className='haiku-scroll'>
            {this.renderEditors()}
          </div>
        </div>

        <EditorActions
          onCancel={() => {
            this.doCancel()
          }}
          onSave={() => {
            this.doSave()
          }}
        />
      </div>
    )
  }
}

EventHandlerEditor.defaultProps = {
  options: {}
}

export default EventHandlerEditor
