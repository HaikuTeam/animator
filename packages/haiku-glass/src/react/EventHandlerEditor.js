import React from 'react'
import Color from 'color'
import CodeMirror from 'codemirror'
import {Creatable} from 'react-select-plus'
import truncate from './helpers/truncate'
import parseExpression from 'haiku-serialization/src/ast/parseExpression'
import marshalParams from '@haiku/player/lib/reflection/marshalParams'
import functionToRFO from '@haiku/player/lib/reflection/functionToRFO'
import reifyRFO from '@haiku/player/lib/reflection/reifyRFO'
import Palette from './Palette'
const HaikuMode = require('./modes/haiku')

const EVALUATOR_STATES = {
  NONE: 1, // None means nothing to evaluate at all
  OPEN: 2, // Anything >= OPEN is also 'open'
  INFO: 3,
  WARN: 4,
  ERROR: 5
}

const NAVIGATION_DIRECTIONS = {
  SAME: 0,
  NEXT: +1,
  PREV: -1
}

const EDITOR_WIDTH = 500
const EDITOR_HEIGHT = 400
const EDITOR_LINE_HEIGHT = 18

const MAX_AUTOCOMPLETION_ENTRIES = 8

const STYLES = {
  container: {
    width: EDITOR_WIDTH,
    height: EDITOR_HEIGHT,
    backgroundColor: Palette.COAL,
    borderRadius: '4px',
    padding: '20px',
    zIndex: 9001
  },
  amble: {
    backgroundColor: '#0F171A',
    fontFamily: 'Fira Mono',
    fontSize: '11px',
    padding: '3px 13px'
  },
  preamble: {
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
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
    height: 'calc(100% - 182px)',
    width: '100%',
    outline: 'none',
    paddingLeft: '32px',
    textShadow: '0 0 0 ' + Color(Palette.ROCK).fade(0.3), // darkmagic
    backgroundColor: '#0C0C0C',
    color: Palette.ROCK,
    overflow: 'hidden', // Let codemirror do the scrolling
    top: 44
  },
  title: {
    color: Palette.PALE_GRAY,
    fontFamily: 'Fira Sans',
    fontSize: '13px',
    fontStyle: 'italic'
  },
  tooltipTri: {
    width: 0,
    height: 0,
    top: 13,
    left: 12,
    transform: 'translate(-8.8px, 0)',
    borderLeft: '8.8px solid transparent',
    borderRight: '8.8px solid transparent'
  },
  selectWrapper: {
    top: 28,
    paddingTop: 6,
    left: 0,
    width: '100%',
    height: 50,
    zIndex: 9000,
    cursor: 'default'
  },
  button: {
    height: '25px',
    color: Palette.PALE_GRAY,
    zIndex: 10000,
    padding: '4px 9px',
    fontSize: '11px',
    cursor: 'pointer',
    borderRadius: '2px',
    padding: '2px 12px 0px 11px'
  },
  cancelButton: {
  },
  doneButton: {
    background: Palette.LIGHTEST_PINK
  },
  buttonsWrapper: {
    position: 'absolute',
    bottom: '20px',
    right: '20px'
  }
}

function mod (idx, max) {
  return (idx % max + max) % max
}

function setOptions (opts) {
  for (var key in opts) this.setOption(key, opts[key])
  return this
}

function getPreamble (officialValue) {
  const params = officialValue.params && officialValue.params.length > 0
    ? marshalParams(officialValue.params)
    : ''

  return `function (${params}) {`
}

export default class EventHandlerEditor extends React.Component {
  constructor (props) {
    super(props)

    this._context = null // Our context element on which to mount codemirror

    this.codemirror = CodeMirror(document.createElement('div'), {
      theme: 'haiku',
      mode: 'haiku',
      lineNumbers: false,
      scrollbarStyle: 'native'
    })
    this.codemirror.setOptions = setOptions.bind(this.codemirror)
    this.codemirror.setValue('')
    this.codemirror.setSize(EDITOR_WIDTH - 35, EDITOR_HEIGHT - 100)
    setTimeout(() => this.codemirror.refresh(), 10) // Must call this here or the gutter margin will be screwed up
    this.codemirror.on('change', this.handleEditorChange.bind(this))
    this.codemirror.on('keydown', this.handleEditorKeydown.bind(this))

    this.state = {
      selectedEventName: 'click', // Seems a good default event to work with
      customEventOptions: [], // Allow user to type in a custom event name
      autoCompletions: [],
      evaluatorText: null,
      evaluatorState: EVALUATOR_STATES.NONE,
      originalValue: null,
      editedValue: null,
      preamble: '',
      postamble: ''
    }
  }

  componentDidMount () {
    if (this._context) {
      while (this._context.firstChild) {
        this._context.removeChild(this._context.firstChild)
      }
      let wrapper = this.codemirror.getWrapperElement()
      this._context.appendChild(wrapper)
    }

    // Not really a change event, but it contains the same business logic we want...
    this.handleChangedEventName({value: this.state.selectedEventName}, true)
  }

  recalibrateEditor (cursor) {
    let renderable = this.state.editedValue.body
    let preamble = getPreamble(this.state.editedValue)
    let postamble = '}'

    this.codemirror.setValue(renderable)

    // If cursor explicitly passed, use it. This is used by chooseAutocompletion
    if (cursor) {
      this.codemirror.setCursor(cursor)
    } else {
      this.codemirror.setCursor({line: 1})
    }

    this.setState({preamble, postamble})
  }

  isCommittableValueInvalid (committable, original) {
    // If we have any error/warning in the evaluator, assume it as grounds not to commit
    // the current content of the field. Basically leveraging pre-validation we've already done.
    if (this.state.evaluatorState > EVALUATOR_STATES.INFO) {
      return {
        reason: this.state.evaluatorText
      }
    }

    return false
  }

  getCommitableValue (valueDescriptor, originalDescriptor) {
    // Note that extra/cached fields are stripped off of the function, like '.summary'
    return {
      __function: {
        params: valueDescriptor.params,
        body: valueDescriptor.body
      }
    }
  }

  doSave () {
    let original = this.state.originalValue
    let committable = this.getCommitableValue(this.state.editedValue, original)
    let invalid = this.isCommittableValueInvalid(committable, original)

    // If invalid, don't proceed - keep the input in a focused+selected state,
    // and then show an error message in the evaluator tooltip
    if (invalid) {
      return this.setState({
        evaluatorState: EVALUATOR_STATES.ERROR,
        evaluatorText: invalid.reason
      })
    }

    this.setState(
      {
        originalValue: this.state.editedValue
      },
      () => {
        this.props.save(
          this.props.element,
          this.state.selectedEventName,
          {handler: committable} // The committable is serialized, i.e. __function: {...}
        )

        this.props.element.setEventHandlerSaveStatus(
          this.state.selectedEventName,
          true
        )
        this.forceUpdate()
      }
    )
  }

  doCancel () {
    // #TODO: What else?
    this.props.close()
  }

  willHandleExternalKeydownEvent (keydownEvent) {
    if (keydownEvent._alreadyHandled) {
      return true
    }

    if (this.props.element) {
      // <~ Possibly not needed, but this is a check to whether we're live or not
      // When focused, assume we *always* handle keyboard events, no exceptions.
      // If you want to handle an input when focused, used handleEditorKeydown
      return true
    }

    return false
  }

  fetchEventHandlerValueDescriptor (eventName) {
    let extant =
      this.props.element && this.props.element.getReifiedEventHandler(eventName)

    let found
    if (extant && extant.handler) {
      // The player wraps 'handler' to make sure binding is correct, but we want the original
      // function itself so we can actually access its body and parameters, etc.
      var original = extant.original || extant.handler
      found = functionToRFO(original).__function
    } else {
      found = {
        params: ['event'],
        body: '// "' + eventName + '" event logic goes here'
      }
    }

    return found
  }

  storeEditedValue (eventName, functionSpec) {
    var fn = reifyRFO(functionSpec)

    // This just stores the updated function in memory but does _not_ persist it!
    this.props.element.upsertEventHandler(eventName, {
      handler: fn
    })
  }

  handleChangedEventName (changeEvent) {
    if (changeEvent) {
      var existingHandler = this.fetchEventHandlerValueDescriptor(
        changeEvent.value
      )

      if (this.props.element) {
        this.storeEditedValue(changeEvent.value, existingHandler)
      }

      this.setState(
        {
          evaluatorText: null,
          evaluatorState: EVALUATOR_STATES.OPEN,
          selectedEventName: changeEvent.value,
          originalValue: existingHandler,
          editedValue: existingHandler
        },
        () => {
          this.recalibrateEditor()
          this.handleEditorChange(this.codemirror, {}, true)
        }
      )
    }
  }

  handleEditorChange (cm, changeObject, alsoSetOriginal, wasInternalCall) {
    if (changeObject.origin === 'setValue') {
      return void 0
    }

    // Any change should unset the current error state of the
    this.setState({
      evaluatorText: null
    })

    let rawValueFromEditor = cm.getValue()

    let officialValue = {
      params: ['event'],
      body: rawValueFromEditor
    }

    // By default, assume we are in an open evaluator state (will check for error in a moment)
    this.setState({
      evaluatorState: EVALUATOR_STATES.OPEN
    })

    // If the last entry was a space, remove autocomplete before we start parsing, which might fail
    // if we have an incomplete event-handler-in-progress inside the editor
    // Also remove any completions if the editor does not have focus
    if (
      !cm.hasFocus() ||
      (changeObject && changeObject.text && changeObject.text[0] === ' ')
    ) {
      this.setState({
        autoCompletions: []
      })
    }

    // This wrapping is required for parsing to work (parens are needed to make it an event-handler)
    let wrapped = parseExpression.wrap(officialValue.body)
    let cursor1 = this.codemirror.getCursor()

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

    this._parse = parse // Caching this to make it faster to read for autocompletions

    if (parse.error) {
      this.setState({
        autoCompletions: [],
        evaluatorState: EVALUATOR_STATES.ERROR,
        evaluatorText: parse.error.message
      })
    }

    if (!parse.error) {
      if (parse.warnings.length > 0) {
        this.setState({
          evaluatorState: EVALUATOR_STATES.WARN,
          evaluatorText: parse.warnings[0].annotation
        })
      }

      if (cm.hasFocus()) {
        let completions = parse.completions
          .sort((a, b) => {
            var na = a.name.toLowerCase()
            var nb = b.name.toLowerCase()
            if (na < nb) return -1
            if (na > nb) return 1
            return 0
          })
          .slice(0, MAX_AUTOCOMPLETION_ENTRIES)

        // Highlight the initial completion in the list
        if (completions[0]) {
          completions[0].highlighted = true
        }

        this.setState({
          autoCompletions: completions
        })
      } else {
        this.setState({
          autoCompletions: []
        })
      }
    }

    // We can't store the edited value if it doesn't parse, since storing it requires that
    // we save the reified version, which depends on `new Function`
    if (!parse.error) {
      // Store the edited code in memory on the element so we can retrieve it if we navigate
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
  }

  doesCurrentCodeNeedSave () {
    if (!this.props.element) return false
    var status = this.props.element.getEventHandlerSaveStatus(
      this.state.selectedEventName
    )
    if (status === null || status === undefined) return false
    // If the status is false, i.e. "not saved from a change", then yes, we need a save...
    return !status
  }

  handleEditorKeydown (cm, keydownEvent) {
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

  handleAutoCompleterClick (completion) {
    this.chooseAutoCompletion(completion)
  }

  navigateAutoCompletion (direction) {
    // If only one item in the list, no need to do anything, since there's nowhere to navigate
    if (this.state.autoCompletions.length < 2) {
      return void 0
    }

    // Shift the currently toggled autocompletion to the next one in the list, using a wraparound.
    let changed = false
    this.state.autoCompletions.forEach((completion, index) => {
      if (!changed) {
        if (completion.highlighted) {
          let nidx = mod(index + direction, this.state.autoCompletions.length)
          // May as well check and skip if we're about to modify the current one
          if (nidx !== index) {
            let next = this.state.autoCompletions[nidx]
            completion.highlighted = false
            next.highlighted = true
            changed = true
          }
        }
      }
    })

    this.setState({
      autoCompletions: this.state.autoCompletions
    })
  }

  chooseHighlightedAutoCompletion () {
    let completion = this.state.autoCompletions.filter(completion => {
      return !!completion.highlighted
    })[0]

    // Not sure why we'd get here, but in case...
    if (!completion) {
      return void 0
    }

    // If we don't have the parse populated, we really can't do anything
    if (!this._parse) {
      return void 0
    }

    this.chooseAutoCompletion(completion)
  }

  chooseAutoCompletion (completion) {
    let len = this._parse.target.end - this._parse.target.start
    let doc = this.codemirror.getDoc()
    let cur = this.codemirror.getCursor()

    doc.replaceRange(
      completion.name,
      {line: cur.line, ch: cur.ch - len},
      cur // { line: Number, ch: Number }
    )

    this.setState({autoCompletions: []})
  }

  getCursorOffsetChar (curs, src) {
    return curs.ch
  }

  getCursorOffsetLine (curs, src) {
    return curs.line + 1
  }

  getEvaluatorText () {
    return this.state.evaluatorText || 'No Errors'
  }

  getEvalutatorStateColor () {
    switch (this.state.evaluatorState) {
      case EVALUATOR_STATES.WARN:
        return Palette.ORANGE
      case EVALUATOR_STATES.ERROR:
        return Palette.RED
      default:
        return Palette.PALE_GRAY
    }
  }

  getEditorContextClassName () {
    let name = []
    name.push('haiku-multiline')
    name.push('haiku-dynamic')
    return name.join(' ')
  }

  getElementTitle () {
    if (this.props.element) {
      if (this.props.element.node) {
        if (this.props.element.node.attributes) {
          if (this.props.element.node.attributes['haiku-title']) {
            return `${truncate(
              this.props.element.node.attributes['haiku-title'],
              16
            )}`
          }
        }
      }
    }
    return '(unknown)'
  }

  render () {
    return (
      <div
        id='event-handler-editor-container'
        className='Absolute-Center'
        onMouseDown={mouseEvent => {
          // Prevent outer view from closing us
          mouseEvent.stopPropagation()
        }}
        style={STYLES.container}
      >
        <style>
          {
            `.Select-control {
                background-color: ${Palette.COAL};
                border-color: ${Palette.COAL};
                border-radius: 4px;
                border: 1px solid ${Palette.COAL};
                color: ${Palette.PALE_GRAY};
            }

            .is-open > .Select-control {
              background: ${Palette.COAL};
              border-color: ${Palette.COAL};
            }

            .is-focused:not(.is-open) > .Select-control {
              border-color: ${Palette.COAL};
            }

            .Select-arrow-zone:hover > .Select-arrow {
              border-top-color: ${Palette.COAL};
            }

            .Select-menu-outer {
              background-color: ${Palette.COAL};
              border-bottom: 1px solid ${Palette.COAL};
              border-top-color: ${Palette.COAL};
            }

            .Select-option-group-label {
              background-color: ${Palette.COAL};
              color: ${Palette.PALE_GRAY};
            }

            .Select-option {
              background-color: ${Palette.COAL};
              color: ${Palette.PALE_GRAY};
            }

            .cm-s-haiku .CodeMirror-cursor {
              border-left: 1px solid ${Palette.LIGHTEST_PINK};
            }
            `
          }
        </style>
        <div
          id='event-handler-element-title'
          className='no-select'
          style={STYLES.title}
        >
          {`${this.getElementTitle()} Actions`}
        </div>
        <div
          id='event-handler-select-wrapper'
          style={STYLES.selectWrapper}
          className='no-select'
        >
          <Creatable
            name='event-name'
            placeholder='Choose Event Name...'
            clearable={false}
            value={this.state.selectedEventName}
            options={
              (this.props.element &&
                this.props.element.getApplicableEventHandlerOptionsList()) ||
              []
            }
            onChange={this.handleChangedEventName.bind(this)}
          />
        </div>
        <div style={{...STYLES.amble, ...STYLES.preamble}}>
          {this.state.preamble}
        </div>
        <div
          id='event-handler-input-editor-context'
          className={this.getEditorContextClassName()}
          ref={element => {
            this._context = element
          }}
          style={STYLES.editorContext}
        />
        <div style={{...STYLES.amble, ...STYLES.postamble}}>
          {this.state.postamble}

          <span style={{...STYLES.postamble.errors, color: this.getEvalutatorStateColor()}}>
            {this.getEvaluatorText()}
          </span>
        </div>
        <div style={STYLES.buttonsWrapper}>
          <button
            onClick={() => {
              this.doCancel()
            }}
            style={{...STYLES.button, ...STYLES.cancelButton}}
          >
            Cancel
          </button>
          <button
            onClick={() => {
              this.doSave()
              this.props.close()
            }}
            disabled={!this.doesCurrentCodeNeedSave()}
            style={{...STYLES.button, ...STYLES.doneButton}}
          >
            Done
          </button>
        </div>
      </div>
    )
  }
}
