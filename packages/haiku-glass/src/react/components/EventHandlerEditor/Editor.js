import React from 'react'
import CodeMirror from 'codemirror'
import Color from 'color'
import reifyRFO from '@haiku/player/lib/reflection/reifyRFO'
import HaikuMode from '../../modes/haiku'
import Palette from '../../Palette'
import marshalParams from '@haiku/player/lib/reflection/marshalParams'
import parseExpression from 'haiku-serialization/src/ast/parseExpression'
import {
  EVALUATOR_STATES,
  EDITOR_LINE_HEIGHT,
  MAX_AUTOCOMPLETION_ENTRIES,
  NAVIGATION_DIRECTIONS
} from './constants'

const STYLES = {
  amble: {
    backgroundColor: '#0F171A',
    fontFamily: 'Fira Mono',
    fontSize: '11px',
    padding: '3px 13px'
  },
  preamble: {
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4
  },
  postamble: {
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    errors: {
      float: 'right',
      fontFamily: 'Fira Sans'
    }
  },
  editorContext: {
    cursor: 'default',
    fontFamily: 'Fira Mono',
    fontSize: '11px',
    lineHeight: EDITOR_LINE_HEIGHT + 'px',
    height: 'calc(100% - 200px)',
    width: '100%',
    outline: 'none',
    paddingLeft: '32px',
    textShadow: '0 0 0 ' + Color(Palette.ROCK).fade(0.3), // darkmagic
    backgroundColor: '#0C0C0C',
    color: Palette.ROCK,
    overflow: 'hidden', // Let codemirror do the scrolling
    position: 'relative'
  }
}

class Editor extends React.Component {
  constructor(props) {
    super(props)

    this._context = null // Our context element on which to mount codemirror

    this.codemirror = CodeMirror(document.createElement('div'), {
      theme: 'haiku',
      mode: 'haiku',
      lineNumbers: false,
      scrollbarStyle: 'native'
    })
    this.codemirror.setValue('')
    this.codemirror.setSize('100%', '100%')
    // Must call this here or the gutter margin will be screwed up
    setTimeout(() => this.codemirror.refresh(), 10)
    this.codemirror.on('change', this.handleEditorChange.bind(this))
    this.codemirror.on('keydown', this.handleEditorKeydown.bind(this))

    this.state = {
      originalValue: null,
      editedValue: null,
      preamble: '',
      postamble: ''
    }
  }

  componentDidMount() {
    if (this._context) {
      while (this._context.firstChild) {
        this._context.removeChild(this._context.firstChild)
      }
      let wrapper = this.codemirror.getWrapperElement()
      this._context.appendChild(wrapper)
    }

    // Not really a change event, but it contains the same business logic we want...
    this.props.onEventChange(
      {value: this.state.selectedEventName}
    )
  }

  componentWillUpdate () {
    this.recalibrateEditor()
    this.handleEditorChange(this.codemirror, {}, true)
  }

  getPreamble(officialValue) {
    const params =
      officialValue.params && officialValue.params.length > 0
        ? marshalParams(officialValue.params)
        : ''

    return `function (${params}) {`
  }

  recalibrateEditor() {
    let renderable = this.state.editedValue.body
    let preamble = this.getPreamble(this.state.editedValue)
    let postamble = '}'

    this.codemirror.setValue(renderable)
    this.setState({preamble, postamble})
  }

  storeEditedValue(eventName, functionSpec) {
    var fn = reifyRFO(functionSpec)

    // This just stores the updated function in memory but does _not_ persist it!
    this.props.element.upsertEventHandler(eventName, {
      handler: fn
    })
  }

  handleEditorChange(editor, changeObject, alsoSetOriginal, wasInternalCall) {
    if (changeObject.origin === 'setValue') {
      return void 0
    }

    const evaluator = {
      // Any change should unset the current error state,
      text: null,
      // By default, assume we are in an open evaluator state
      // (will check for error in a moment)
      state: EVALUATOR_STATES.OPEN
    }

    let officialValue = {
      params: ['event'],
      body: editor.getValue()
    }

    // This wrapping is required for parsing to work
    // (parens are needed to make it an event-handler)
    let wrapped = parseExpression.wrap(officialValue.body)
    let cursor1 = editor.getCursor()

    let parse = parseExpression(
      wrapped,
      {},
      HaikuMode.keywords,
      this.state,
      {
        line: this.getCursorOffsetLine(cursor1),
        ch: this.getCursorOffsetChar(cursor1)
      },
      {
        // These checks are only needed for expressions in the timeline, so skip them here
        skipParamsImpurityCheck: true,
        skipForbiddensCheck: true
      }
    )

    if (parse.error) {
      evaluator.text = parse.error.message
      evaluator.state = EVALUATOR_STATES.ERROR
    } else {
      if (parse.warnings.length > 0) {
        evaluator.text = parse.warnings[0].annotation
        evaluator.state = EVALUATOR_STATES.WARN
      }

      this.storeEditedValue(this.state.selectedEventName, officialValue)
    }

    // Need this for when we first load the code, our internal mods might change it subtlely
    // but we don't want a false positive for when a save is required
    if (alsoSetOriginal) {
      this.setState({
        originalValue: officialValue,
        editedValue: officialValue
      })
    } else {
      this.setState({
        editedValue: officialValue
      })
    }

    this.props.onEvaluatorChange(evaluator)
  }

  handleEditorKeydown(cm, keydownEvent) {
    keydownEvent._alreadyHandled = true

    let highlightedAutoCompletions = this.state.autoCompletions.filter(
      completion => {
        return !!completion.highlighted
      }
    )

    // First, handle any autocompletions if we're in an autocomplete-active state, i.e.,
    // if we are showing autocomplete and if there are any of them currently highlighted
    if (highlightedAutoCompletions.length > 0) {
      if (keydownEvent.which === 40) {
        // ArrowDown
        keydownEvent.preventDefault()
        return this.navigateAutoCompletion(NAVIGATION_DIRECTIONS.NEXT)
      } else if (keydownEvent.which === 38) {
        // ArrowUp
        keydownEvent.preventDefault()
        return this.navigateAutoCompletion(NAVIGATION_DIRECTIONS.PREV)
      } else if (keydownEvent.which === 37) {
        // ArrowLeft
        this.setState({autoCompletions: []})
      } else if (keydownEvent.which === 39) {
        // ArrowRight
        this.setState({autoCompletions: []})
      } else if (keydownEvent.which === 13 && !keydownEvent.shiftKey) {
        // Enter (without Shift only!)
        keydownEvent.preventDefault()
        return this.chooseHighlightedAutoCompletion()
      } else if (keydownEvent.which === 9) {
        // Tab
        keydownEvent.preventDefault()
        return this.chooseHighlightedAutoCompletion()
      } else if (keydownEvent.which === 27) {
        // Escape
        keydownEvent.preventDefault()
        return this.setState({autoCompletions: []})
      }
    }

    if (keydownEvent.which === 13) {
      if (keydownEvent.metaKey) {
        // Meta+Enter when multi-line commits the value
        keydownEvent.preventDefault()
        return this.doSave()
      }
    }

    // Escape is the universal way to exit the editor without committing
    if (keydownEvent.which === 27) {
      // Escape
      return this.doCancel()
    }
  }

  getCursorOffsetChar(curs, src) {
    return curs.ch
  }

  getCursorOffsetLine(curs, src) {
    return curs.line + 1
  }

  getEvalutatorStateColor() {
    switch (this.props.evaluator.state) {
      case EVALUATOR_STATES.WARN:
        return Palette.ORANGE
      case EVALUATOR_STATES.ERROR:
        return Palette.RED
      default:
        return Palette.PALE_GRAY
    }
  }

  render() {
    return (
      <div>
        <div style={{...STYLES.amble, ...STYLES.preamble}}>
          {this.state.preamble}
        </div>
        <div
          className='haiku-multiline haiku-dynamic'
          ref={element => {
            this._context = element
          }}
          style={STYLES.editorContext}
        />
        <div style={{...STYLES.amble, ...STYLES.postamble}}>
          {this.state.postamble}

          <span
            style={{
              ...STYLES.postamble.errors,
              color: this.getEvalutatorStateColor()
            }}
          >
            {this.props.evaluator.text || 'No Errors'}
          </span>
        </div>
      </div>
    )
  }
}

Editor.propTypes = {
  onEventChange: React.PropTypes.func.isRequired,
  element: React.PropTypes.object.isRequired,
  evaluator: React.PropTypes.object.isRequired
}

export default Editor
