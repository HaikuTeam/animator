/* global monaco */
import React from 'react'
import Palette from 'haiku-ui-common/lib/Palette'
import ElementTitle from './ElementTitle'
import Editor from './Editor'
import EditorActions from './EditorActions'
import HandlerManager from './HandlerManager'
import {ModalWrapper, ModalHeader, ModalFooter} from 'haiku-ui-common/lib/react/Modal'
import {PrettyScroll} from 'haiku-ui-common/lib/react/PrettyScroll'
import {EDITOR_WIDTH, EDITOR_HEIGHT, EVALUATOR_STATES, AUTOCOMPLETION_ITEMS} from './constants'

const STYLES = {
  container: {
    width: EDITOR_WIDTH,
    height: EDITOR_HEIGHT,
    paddingRight: 0
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
    paddingLeft: '18px',
    paddingTop: '23px'
  }
}

function isNumeric (n) {
  return !isNaN(parseFloat(n)) && isFinite(n)
}

class EventHandlerEditor extends React.PureComponent {
  constructor (props) {
    super(props)

    this.handlerManager = null
    this.onEditorContentChange = this.onEditorContentChange.bind(this)
    this.onEditorEventChange = this.onEditorEventChange.bind(this)
    this.onEditorRemoved = this.onEditorRemoved.bind(this)
    this.addAction = this.addAction.bind(this)
    this.onFrameEditorRemoved = this.onFrameEditorRemoved.bind(this)

    this.setupMonaco()

    this.state = {
      editorsWithErrors: []
    }
  }

  setupMonaco () {
    // Absurdely, monaco doesn't provide an importable module, so we have
    // to do some trickery to load it (see index.html), and sometimes may not
    // be already available, hence this weird logic.
    if (typeof monaco === 'undefined') {
      return setTimeout(() => {
        this.setupMonaco()
      }, 100)
    }

    monaco.editor.defineTheme('haiku', {
      base: 'vs-dark',
      inherit: true,
      // `rules` requires colors without the leading '#' ¯\_(ツ)_/¯
      rules: [{ backgroundColor: Palette.SPECIAL_COAL.replace('#', '') }],
      colors: {
        'editor.foreground': Palette.PALE_GRAY,
        'editor.background': Palette.DARKEST_COAL,
        'editorCursor.foreground': Palette.LIGHTEST_PINK,
        'list.focusBackground': Palette.BLACK,
        focusBorder: Palette.BLACK,
        'editorWidget.background': Palette.DARKEST_COAL,
        'editor.lineHighlightBorder': Palette.DARKEST_COAL
      }
    })

    monaco.editor.setTheme('haiku')

    // Remove the default autocompletion options (console, window, GeoLocation, etc)
    // due to a [bug][1] in monaco this removes most of the stuff, but leaves
    // reserved keywords as options.
    // If you want to enable default atocompletion again, just remove the function call
    //
    // [1]: https://github.com/Microsoft/monaco-editor/issues/596
    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
      noLib: true,
      allowNonTsExtensions: true
    })

    // Define our own autocompletion items
    monaco.languages.registerCompletionItemProvider('javascript', {
      provideCompletionItems: function (model, position) {
        return AUTOCOMPLETION_ITEMS.map((option) =>
          Object.assign(option, {
            kind: monaco.languages.CompletionItemKind.Function
          })
        )
      }
    })
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
  shouldComponentUpdate ({element, visible, options}, {editorsWithErrors}) {
    const pkey1 = element && element.getPrimaryKey()
    const pkey2 = this.props.element && this.props.element.getPrimaryKey()

    if (
      element &&
      ((pkey1 !== pkey2) || !this.handlerManager)
    ) {
      this.handlerManager = new HandlerManager(element)
      return true
    }

    if (
      (options && options.frame !== this.props.options.frame) ||
      visible !== this.props.visible ||
      editorsWithErrors.length !== this.state.editorsWithErrors.length
    ) {
      return true
    }

    return false
  }

  addAction () {
    this.handlerManager.addNextAvailableEventHandler()
    this.forceUpdate()
  }

  doSave () {
    const result = this.handlerManager.serialize()

    if (this.state.editorsWithErrors.length) {
      this.scrollToEditor(this.state.editorsWithErrors[0])
    } else {
      this.props.save(this.props.element, result)
      this.props.close()
    }
  }

  doCancel () {
    this.props.close()
  }

  onEditorContentChange (serializedEvent, oldEvent) {
    const {evaluator} = serializedEvent

    if (evaluator && evaluator.state === EVALUATOR_STATES.ERROR) {
      this.setState({
        editorsWithErrors: this.state.editorsWithErrors.concat(
          serializedEvent.id
        )
      })
    } else {
      this.handlerManager.replaceEvent(serializedEvent, oldEvent)
      this.setState({
        editorsWithErrors: this.state.editorsWithErrors.filter(
          (editor) => editor !== serializedEvent.id
        )
      })
    }
  }

  onEditorEventChange (serializedEvent, oldEvent) {
    this.handlerManager.replaceEvent(serializedEvent, oldEvent)
    this.forceUpdate()
  }

  onEditorRemoved ({editor, event, handler}) {
    this.handlerManager.delete(event)
    this.forceUpdate()

    if (this.handlerManager.size() === 0) {
      this.doSave()
    }
  }

  onFrameEditorRemoved () {
    if (isNumeric(this.props.options.frame)) {
      const event = HandlerManager.frameToEvent(this.props.options.frame)
      this.handlerManager.delete(event)
      this.doSave()
    }
  }

  scrollToEditor (editorId) {
    const editor = this.wrapper.querySelector(`#${editorId}`)
    this.wrapper.scrollTop = editor.offsetTop
  }

  renderFrameEditor (totalNumberOfHandlers, applicableEventHandlers) {
    const event = HandlerManager.frameToEvent(this.props.options.frame)
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
        isSimplified={this.props.options.isSimplified}
      />
    )
  }

  renderEditors () {
    let totalNumberOfHandlers = this.handlerManager.size()
    const applicableEventHandlers = this.handlerManager.getApplicableEventHandlers()

    return isNumeric(this.props.options.frame)
      ? this.renderFrameEditor(totalNumberOfHandlers, applicableEventHandlers)
      : this.renderEventsEditor(totalNumberOfHandlers, applicableEventHandlers)
  }

  render () {
    if (!this.handlerManager) {
      return null
    }

    const visibilityStyles = this.props.visible ? {} : {visibility: 'hidden'}

    return (
      <ModalWrapper style={{...visibilityStyles, ...STYLES.container}}>
        <div
          onMouseDown={(mouseEvent) => {
            // Prevent outer view from closing us
            mouseEvent.stopPropagation()
          }}
        >

          <ModalHeader>
            <ElementTitle
              element={this.props.element}
              title={
                isNumeric(this.props.options.frame)
                  ? `Frame ${this.props.options.frame}`
                  : null
              }
              hideActions={
                this.props.options.isSimplified ||
                !this.handlerManager.getNextAvailableDOMEvent()
              }
              onNewAction={this.addAction}
              isSimplified={this.props.options.isSimplified}
              onFrameEditorRemoved={this.onFrameEditorRemoved}
          />
          </ModalHeader>

          <div style={STYLES.outer}>
            <PrettyScroll>
              <div
                style={STYLES.editorsWrapper}
                ref={(el) => { this.wrapper = el }}
              >
                {this.renderEditors()}
              </div>
            </PrettyScroll>
          </div>

          <ModalFooter>
            <EditorActions
              onCancel={() => {
                this.doCancel()
              }}
              onSave={() => {
                this.doSave()
              }}
              title={
                this.state.editorsWithErrors.length
                  ? 'an event handler has a syntax error'
                  : ''
              }
            />
          </ModalFooter>
        </div>
      </ModalWrapper>
    )
  }
}

EventHandlerEditor.defaultProps = {
  options: {}
}

export default EventHandlerEditor
