import React from 'react'
import functionToRFO from '@haiku/player/lib/reflection/functionToRFO'
import ElementTitle from './ElementTitle'
import CSSStyles from './CSSStyles'
import Editor from './Editor'
import EditorActions from './EditorActions'
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

    this.applicableHandlers = {}
    this.appliedHandlers = new Map()
    this.onEditorContentChange = this.onEditorContentChange.bind(this)
    this.onEditorEventChange = this.onEditorEventChange.bind(this)
    this.onEditorRemoved = this.onEditorRemoved.bind(this)
    this.addAction = this.addAction.bind(this)
  }

  shouldComponentUpdate ({element, visible}, nextState) {
    if (!this.appliedHandlers.size && element) {
      this.applicableHandlers = element.getApplicableEventHandlerOptionsList()
      this.appliedHandlers = this.getAppliedHandlers(element)
      return true
    }

    if (visible !== this.props.visible) {
      return true
    }

    return false
  }

  getAppliedHandlers (element) {
    let result = new Map()
    const appliedHandlers = element.getReifiedEventHandlers()
    const appliedHandlersKeys = Object.keys(appliedHandlers)

    if (appliedHandlersKeys.length) {
      appliedHandlersKeys.forEach(key => {
        const rawHandler = appliedHandlers[key]
        const wrappedHandler = rawHandler.original || rawHandler.handler
        const id = this.generateID(3)
        result.set(id, {
          event: key,
          handler: functionToRFO(wrappedHandler).__function
        })
      })
    } else {
      const id = this.generateID(3)
      result.set(id, this.getDefaultHandler('click'))
    }

    return result
  }

  generateID (len) {
    const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'
    let str = ''
    while (str.length < len) {
      str += ALPHABET[Math.floor(Math.random() * ALPHABET.length)]
    }
    return str
  }

  addAction () {
    const availableHandler = this.getNextAvailableHandler()
    const defaultHandler = this.getDefaultHandler(availableHandler)
    this.appliedHandlers.set(this.generateID(3), {
      event: availableHandler,
      ...defaultHandler
    })
    this.forceUpdate()
  }

  getNextAvailableHandler () {
    const appliedHandlers = []

    for (let [editor, {event, handler}] of this.appliedHandlers) { // eslint-disable-line
      appliedHandlers.push(event)
    }

    for (let handlerGroup of this.applicableHandlers) {
      for (let {value} of handlerGroup.options) {
        if (appliedHandlers.indexOf(value) === -1) {
          return value
        }
      }
    }
  }

  getDefaultHandler (event) {
    return {
      event,
      handler: {
        body: `/** ${event} event logic goes here */`,
        params: [`${event}Event`]
      }
    }
  }

  doSave () {
    const result = {}

    for (let [editor, {event, handler}] of this.appliedHandlers) { // eslint-disable-line
      result[event] = {handler: {__function: handler}}
      this.props.element.setEventHandlerSaveStatus(event, true)
    }

    this.props.save(this.props.element, result)
    this.props.close()
  }

  doCancel () {
    this.props.close()
  }

  onEditorContentChange ([editor, serializedEvent]) {
    this.appliedHandlers.set(editor, serializedEvent)
  }

  onEditorEventChange ([editor, serializedEvent]) {
    this.appliedHandlers.set(editor, serializedEvent)
    this.forceUpdate()
  }

  onEditorRemoved (editor) {
    this.appliedHandlers.delete(editor)
    this.forceUpdate()
  }

  renderEditors () {
    const appliedHandlers = []
    const result = []

    for (let [editor, {event, handler}] of this.appliedHandlers) { // eslint-disable-line
      appliedHandlers.push(event)
    }

    for (let [editor, {event, handler}] of this.appliedHandlers) { // eslint-disable-line
      result.push(
        <Editor
          onContentChange={this.onEditorContentChange}
          onEventChange={this.onEditorEventChange}
          onRemove={this.onEditorRemoved}
          applicableHandlers={this.applicableHandlers}
          appliedHandlers={appliedHandlers}
          selectedEventName={event}
          params={handler.params}
          contents={handler.body}
          key={editor}
          id={editor}
          deleteable={appliedHandlers.length > 1}
        />
      )
    }

    return result.reverse()
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

export default EventHandlerEditor
