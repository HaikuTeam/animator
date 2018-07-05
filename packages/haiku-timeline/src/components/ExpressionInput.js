import React from 'react'
import Color from 'color'
import lodash from 'lodash'
import CodeMirror from 'codemirror'
import stripindent from 'strip-indent'
import marshalParams from '@haiku/core/lib/reflection/marshalParams'
import parseExpression from 'haiku-serialization/src/ast/parseExpression'
import MathUtils from 'haiku-serialization/src/bll/MathUtils'
import Palette from 'haiku-ui-common/lib/Palette'
import * as EXPR_SIGNS from 'haiku-ui-common/lib/helpers/ExprSigns'
import isNumeric from 'haiku-ui-common/lib/helpers/isNumeric'
import retToEq from 'haiku-ui-common/lib/helpers/retToEq'
import eqToRet from 'haiku-ui-common/lib/helpers/eqToRet'
import ensureRet from 'haiku-ui-common/lib/helpers/ensureRet'
import ensureEq from 'haiku-ui-common/lib/helpers/ensureEq'
import doesValueImplyExpression from 'haiku-ui-common/lib/helpers/doesValueImplyExpression'
import humanizePropertyName from 'haiku-ui-common/lib/helpers/humanizePropertyName'
import {Experiment, experimentIsEnabled} from 'haiku-common/lib/experiments'
import AutoCompleter from './AutoCompleter'
import zIndex from './styles/zIndex'

const HaikuMode = require('./modes/haiku')

const MAX_AUTOCOMPLETION_ENTRIES = 8

const EDITOR_MODES = {
  SINGLE_LINE: 1,
  MULTI_LINE: 2
}

const EVALUATOR_STATES = {
  NONE: 1, // None means a static value, no expression to evaluate
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

const EXPR_KINDS = {
  VALUE: 1, // A static value
  MACHINE: 2 // To be written as a function
}

const ANY_TYPES = {
  '*': true,
  'any': true
}

const SET_VALUE_ORIGIN = 'setValue'

const EDITOR_LINE_HEIGHT = 24
const MAX_EDITOR_HEIGHT = 300
const MIN_EDITOR_WIDTH_MULTILINE = 200
const MAX_EDITOR_WIDTH_MULTILINE = 600
const MIN_EDITOR_WIDTH_SINGLE_LINE = 140
const MAX_EDITOR_WIDTH_SINGLE_LINE = 400
const NUMERIC_CHANGE_BATCH = 10
const NUMERIC_CHANGE_SINGLE = 1

function setOptions (opts) {
  for (var key in opts) this.setOption(key, opts[key])
  return this
}

/**
 * @function toValueDescriptor
 * @description Convert from object format provided by timeline to our internal format.
 */
function toValueDescriptor ({ bookendValue, computedValue }) {
  if (bookendValue && bookendValue.__function) {
    return {
      kind: EXPR_KINDS.MACHINE,
      params: bookendValue.__function.params,
      body: bookendValue.__function.body
    }
  }

  // Don't show a literal 'null' string inside the input field
  if (computedValue === null || computedValue === undefined) {
    computedValue = ''
  }

  return {
    kind: EXPR_KINDS.VALUE,
    params: [],
    body: safeDisplayableStringValue(computedValue)
  }
}

function safeDisplayableStringValue (val) {
  if (typeof val === 'string') {
    return val
  }

  try {
    return JSON.stringify(val)
  } catch (exception) {
    return ''
  }
}

function getRenderableValueSingleline (valueDescriptor) {
  return retToEq(valueDescriptor.body.trim())
}

function getRenderableValueMultiline (valueDescriptor, skipFormatting) {
  let params = ''
  if (valueDescriptor.params && valueDescriptor.params.length > 0) {
    params = marshalParams(valueDescriptor.params)
  }

  // When initially loading the value, we probably want to format it.
  // During editing, when we dynamically change the signature, formatting can
  // mess things up, giving us extra spaces, and also mess with the cursor
  // position resetting, so we return it as-is.
  if (skipFormatting) {
    return `function (${params}) {
${valueDescriptor.body}
}`
  } else {
    // We don't 'ensureRet' because in case of a multiline function, we can't be assured that
    // the user didn't return on a later line. However, we do a sanity check for the initial equal
    // sign in case the current case is converting from single to multi.
    return `function (${params}) {
  ${eqToRet(valueDescriptor.body)}
}`
  }
}

export default class ExpressionInput extends React.Component {
  constructor (props) {
    super(props)

    this._context = null // Our context element on which to mount codemirror
    this._injectables = {} // List of current custom keywords (to be erased/reset)
    this._paramcache = null
    this._parse = null // Cache of last parse of the input field

    this.codemirror = CodeMirror(document.createElement('div'), {
      theme: 'haiku',
      mode: 'haiku'
    })
    this.codemirror.setOptions = setOptions.bind(this.codemirror)
    this.codemirror.setValue('')
    this.codemirror.on('change', this.handleEditorChange.bind(this))
    this.codemirror.on('keydown', this.handleEditorKeydown.bind(this))
    this.codemirror.on('beforeChange', (cm, changeObject) => {
      // If multiline mode, only allow a change to the function body, not the signature
      // Simply cancel any change that occurs in either of those places.
      if (this.state.editingMode === EDITOR_MODES.MULTI_LINE && changeObject.origin !== SET_VALUE_ORIGIN) {
        let lines = this.state.editedValue.body.split('\n')
        if (changeObject.from.line === 0 || changeObject.from.line > lines.length) {
          changeObject.cancel()
        }
      }
    })

    this.state = {
      useAutoCompleter: false, // Used to 'comment out' this feature until it's fully baked
      autoCompletions: [],
      editingMode: EDITOR_MODES.SINGLE_LINE,
      evaluatorText: null,
      evaluatorState: EVALUATOR_STATES.NONE,
      originalValue: null,
      editedValue: null
    }

    if (props.component.getFocusedRow()) {
      this.engageFocus(props)
    }

    this.handleUpdate = this.handleUpdate.bind(this)
  }

  componentWillUnmount () {
    this.mounted = false
    this.unlistenToComponent(this.props.component)
  }

  componentDidMount () {
    this.mounted = true
    this.listenToComponent(this.props.component)

    if (this._context) {
      while (this._context.firstChild) {
        this._context.removeChild(this._context.firstChild)
      }
      this._context.appendChild(this.codemirror.getWrapperElement())
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.component !== this.props.component) {
      this.unlistenToComponent(this.props.component)
      this.listenToComponent(nextProps.component)
    }
  }

  listenToComponent (component) {
    component.on('update', this.handleUpdate)
  }

  unlistenToComponent (component) {
    component.removeListener('update', this.handleUpdate)
  }

  handleUpdate (what) {
    if (!this.mounted) return null
    if (
      what === 'row-focused' ||
      what === 'row-selected' ||
      what === 'row-blurred' ||
      what === 'row-deselected'
    ) {
      this.engageFocus(this.props)
    }
  }

  isCommittableValueInvalid (committable, original) {
    // If we have any error/warning in the evaluator, assume it as grounds not to commit
    // the current content of the field. Basically leveraging pre-validation we've already done.
    if (this.state.evaluatorState > EVALUATOR_STATES.INFO) {
      return {
        reason: this.state.evaluatorText
      }
    }

    if (committable.__function) {
      // Assume that we already stored warnings about this function in the evaluator state from a change action
      return false
    } else {
      let observedType
      if (Array.isArray(committable)) {
        observedType = 'array'
      } else {
        observedType = typeof committable
      }

      let expectedType = original.valueType

      if (!ANY_TYPES[expectedType]) {
        if (observedType !== expectedType) {
          return {
            reason: `${original.valueLabel} must have type "${expectedType}"`
          }
        }

        if (expectedType === 'number') {
          if (Math.abs(committable) === Infinity) {
            return {
              reason: 'Number cannot be infinity'
            }
          }

          if (isNaN(committable)) {
            return {
              reason: 'Not a number!'
            }
          }
        }
      }
    }

    return false
  }

  requestNavigate (maybeDirection, maybeDoFocus) {
    let direction = (maybeDirection === undefined) ? NAVIGATION_DIRECTIONS.NEXT : maybeDirection
    this.props.onNavigateRequested(direction, maybeDoFocus)
  }

  getCommitableValue (valueDescriptor, originalDescriptor) {
    // If we are in multi-line mode then assume we want to create an expression as opposed to a string.
    // We get problems if we don't do this like a function that doesn't match our naive expression check
    // e.g. function () { if (foo) { ... } else { ... }} which doesn't begin with a return
    if (this.state.editingMode === EDITOR_MODES.MULTI_LINE || doesValueImplyExpression(valueDescriptor.body)) {
      // Note that extra/cached fields are stripped off of the function, like '.summary'
      return {
        __function: {
          // Flag this function as an injectee, so downstream AST producers
          // know that this function needs to be wrapped in `Haiku.inject`
          injectee: true,
          params: valueDescriptor.params,
          body: eqToRet(valueDescriptor.body)
        }
      }
    }

    let out
    try {
      out = JSON.parse(valueDescriptor.body)
    } catch (exception) {
      out = valueDescriptor.body + ''
    }

    // If the value type is string, stringify, and don't cast to another format
    if (originalDescriptor.valueType === 'string') {
      out = out + ''
    } else {
      if (isNumeric(out)) {
        out = Number(out)
      }

      if (originalDescriptor.valueType === 'boolean') {
        if (out === 'true') {
          out = true
        } else if (out === 'false') {
          out = false
        } else {
          out = !!out
        }
      } else if (originalDescriptor.propertyName === 'opacity') {
        if (out > 1) {
          out = 1
        } else if (out < 0) {
          out = 0
        }
      }
    }

    return out
  }

  performCommit (maybeNavigationDirection, doFocusSubsequentCell) {
    const focusedRow = this.props.component.getFocusedRow()

    // There is some race condition where this isn't present;
    // rather than crash just do nothing #RC
    if (focusedRow) {
      const original = focusedRow.getPropertyValueDescriptor()

      const committable = this.getCommitableValue(this.state.editedValue, original)

      const invalid = this.isCommittableValueInvalid(committable, original)

      // If invalid, don't proceed - keep the input in a focused+selected state,
      // and then show an error message in the evaluator tooltip
      if (invalid) {
        return this.setState({
          evaluatorState: EVALUATOR_STATES.ERROR,
          evaluatorText: invalid.reason
        })
      }

      this.props.onCommitValue(committable)

      // Once finished with a successful commit, navigate to 'select' the next cell
      this.requestNavigate(maybeNavigationDirection, doFocusSubsequentCell)
    }
  }

  handleEditorChange (cm, changeObject) {
    if (changeObject.origin === SET_VALUE_ORIGIN) {
      return void (0)
    }

    // Any change should unset the current error state of the
    this.setState({
      evaluatorText: null
    })

    let rawValueFromEditor = cm.getValue()

    // We 'skipFormatting' to avoid keystroke spacing problems
    let officialValue = this.rawValueToOfficialValue(rawValueFromEditor, EXPR_SIGNS.RET, true)

    if (officialValue.kind === EXPR_KINDS.VALUE) {
      // For a static value, simply set the state as-is based on the input
      this.setState({
        autoCompletions: [], // No autocompletions at all if we're only doing a static value
        evaluatorState: EVALUATOR_STATES.NONE
      })
    } else if (officialValue.kind === EXPR_KINDS.MACHINE) {
      // By default, assume we are in an open evaluator state (will check for error in a moment)
      this.setState({
        evaluatorState: EVALUATOR_STATES.OPEN
      })

      // If the last entry was a space, remove autocomplete before we start parsing, which might fail
      // if we have an incomplete expression-in-progress inside the editor
      // Also remove any completions if the editor does not have focus
      if (!cm.hasFocus() || (changeObject && changeObject.text && changeObject.text[0] === ' ')) {
        this.setState({
          autoCompletions: []
        })
      }

      // We'll use these both for auto-assigning function signature params and for syntax highlighting.
      // We do this first because it populates HaikuMode.keywords with vars, which we will use when
      // parsing to produce a summary that includes add'l validation information about the contents
      //
      // Since ActiveComponent manages multiple instances, we kind of have to choose just one
      const instance = this.props.reactParent.getActiveComponent().$instance
      let injectables = (instance && instance.getInjectables()) || {}

      this.resetSyntaxInjectables(injectables)

      // This wrapping is required for parsing to work (parens are needed to make it an expression)
      let wrapped = parseExpression.wrap(officialValue.body)
      let cursor1 = this.codemirror.getCursor()

      let parse = parseExpression(wrapped, injectables, HaikuMode.keywords, this.state, {
        line: this.getCursorOffsetLine(cursor1),
        ch: this.getCursorOffsetChar(cursor1)
      })

      this._parse = parse // Caching this to make it faster to read for autocompletions

      if (parse.error) {
        this.setState({
          autoCompletions: [],
          evaluatorState: EVALUATOR_STATES.ERROR,
          evaluatorText: parse.error.message
        })
      }

      // Even despite an error, we still want to allow the function signature to display, so use a cached one.
      // Without this, the function signature appears to quickly reappear and disappear as the user types, which is annoying.
      if (parse.error && this._paramcache) {
        officialValue.params = this._paramcache
      } else if (!parse.error) {
        // Used to display previous params despite a syntax error in the function body
        this._paramcache = parse.params
        officialValue.params = parse.params
        officialValue.parse = parse // Cached for faster validation downstream

        if (parse.warnings.length > 0) {
          this.setState({
            evaluatorState: EVALUATOR_STATES.WARN,
            evaluatorText: parse.warnings[0].annotation
          })
        }

        if (cm.hasFocus()) {
          let completions = parse.completions.sort((a, b) => {
            var na = a.name.toLowerCase()
            var nb = b.name.toLowerCase()
            if (na < nb) return -1
            if (na > nb) return 1
            return 0
          }).slice(0, MAX_AUTOCOMPLETION_ENTRIES)

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
      } else {
        // TODO: Can we do anything except continue if we have an error but no param cache?
      }
    } else {
      throw new Error('[timeline] Expression input saw unexpexcted expression kind')
    }

    if (this.state.editingMode === EDITOR_MODES.MULTI_LINE) {
      // If we're in multi-line mode, then update the function signature
      // Track the cursor so we can place it back where it was...
      let cursor2 = this.codemirror.getCursor()

      // Update the editor contents
      // We set 'skipFormatting' to true here so we don't get weird spacing issues
      let renderable = getRenderableValueMultiline(officialValue, true)
      this.setEditorValue(renderable)

      // Now put the cursor where it was originally
      this.codemirror.setCursor(cursor2)
    }

    this.codemirror.setSize(this.getEditorWidth(), this.getEditorHeight() - 2)

    this.setState({
      editedValue: officialValue
    })
  }

  getCursorOffsetLine (curs, src) {
    if (this.state.editingMode === EDITOR_MODES.MULTI_LINE) {
      return curs.line + 1
    } else {
      return curs.line + 2 // Offset to account for 1-based index and initial function signature line
    }
  }

  getCursorOffsetChar (curs, src) {
    if (this.state.editingMode === EDITOR_MODES.MULTI_LINE) {
      return curs.ch
    } else {
      return curs.ch + 5 // Offset to account for replacing = with 'return'
    }
  }

  resetSyntaxInjectables (injectables) {
    // Remove all former entries in the keywords list
    for (const key in this._injectables) {
      if (!injectables[key]) { // No point deleting if it will be in the new list
        delete HaikuMode.keywords[key]
      }
    }

    // Add new entries in the list
    this._injectables = injectables
    for (const key in this._injectables) {
      if (!HaikuMode.keywords[key]) { // No point adding if it is already in the list
        HaikuMode.keywords[key] = {
          type: 'keyword a',
          style: 'keyword'
        }
      }
    }
  }

  rawValueToOfficialValue (raw, desiredExpressionSign, skipFormatting) {
    if (this.state.editingMode === EDITOR_MODES.SINGLE_LINE) {
      if (doesValueImplyExpression(raw)) {
        let clean = raw.trim()

        // The caller can decide whether they want the expression symbol to officially be '=' or 'return'
        // when presented as the formal final value for this method
        clean = (desiredExpressionSign === EXPR_SIGNS.EQ) ? ensureEq(clean) : ensureRet(clean)

        return {
          kind: EXPR_KINDS.MACHINE,
          params: [], // To populate later
          body: clean
        }
      } else {
        return {
          kind: EXPR_KINDS.VALUE,
          params: [], // To populate later
          body: raw // Just use the raw body, no machine no trimming (allow spaces!)
        }
      }
    } else if (this.state.editingMode === EDITOR_MODES.MULTI_LINE) {
      // The body will determine the params, so we can safely discard the function prefix/suffix
      var lines = raw.split('\n')
      var body = lines.slice(1, lines.length - 1).join('\n')

      // In some cases the indent stripping causes issues, so don't do it in all cases.
      // For example, while typing we need to update the function signature but not interferer
      // with the function body being mutated.
      if (!skipFormatting) {
        body = stripindent(body)
      }

      return {
        kind: EXPR_KINDS.MACHINE,
        params: [], // To populate later
        body: body
      }
    } else {
      throw new Error('[timeline] Expression input saw unexpexcted editing mode')
    }
  }

  changeCurrentValueIfNumericBy (number) {
    if (this.state.editedValue && isNumeric(this.state.editedValue.body)) {
      const currentValue = Number(this.state.editedValue.body)
      const newValue = String(currentValue + number)
      this.setEditorValue(newValue)
      this.handleEditorChange(this.codemirror, {})
    }
  }

  handleEditorKeydown (cm, keydownEvent) {
    keydownEvent._alreadyHandled = true

    let highlightedAutoCompletions = this.state.autoCompletions.filter((completion) => {
      return !!completion.highlighted
    })

    // First, handle any autocompletions if we're in an autocomplete-active state, i.e.,
    // if we are showing autocomplete and if there are any of them currently highlighted
    if (highlightedAutoCompletions.length > 0) {
      if (keydownEvent.which === 40) { // ArrowDown
        keydownEvent.preventDefault()
        return this.navigateAutoCompletion(NAVIGATION_DIRECTIONS.NEXT)
      } else if (keydownEvent.which === 38) { // ArrowUp
        keydownEvent.preventDefault()
        return this.navigateAutoCompletion(NAVIGATION_DIRECTIONS.PREV)
      } else if (keydownEvent.which === 37) { // ArrowLeft
        this.setState({ autoCompletions: [] })
      } else if (keydownEvent.which === 39) { // ArrowRight
        this.setState({ autoCompletions: [] })
      } else if (keydownEvent.which === 9) { // Tab
        keydownEvent.preventDefault()
        return this.chooseHighlightedAutoCompletion()
      } else if (keydownEvent.which === 27) { // Escape
        keydownEvent.preventDefault()
        return this.setState({ autoCompletions: [] })
      }
    }

    if (this.state.editingMode === EDITOR_MODES.SINGLE_LINE) {
      const numericDelta = keydownEvent.shiftKey ? NUMERIC_CHANGE_BATCH : NUMERIC_CHANGE_SINGLE

      if (keydownEvent.which === 38) {
        return this.changeCurrentValueIfNumericBy(numericDelta)
      }

      if (keydownEvent.which === 40) {
        return this.changeCurrentValueIfNumericBy(-numericDelta)
      }

      // If tab during single-line editing, commit and navigate
      if (keydownEvent.which === 9) { // Tab
        keydownEvent.preventDefault()
        return this.performCommit(NAVIGATION_DIRECTIONS.NEXT, false)
      }
      if (keydownEvent.which === 13) { // Enter
        // Shift+Enter when multi-line starts multi-line mode (and adds a new line)
        if (keydownEvent.shiftKey) {
          keydownEvent.preventDefault()
          return this.launchMultilineMode(keydownEvent.key)
        }
        // Enter when single-line commits the value
        // Meta+Enter when single-line commits the value
        keydownEvent.preventDefault()
        return this.performCommit(NAVIGATION_DIRECTIONS.NEXT, false)
      }

      if (keydownEvent.which === 40) { // ArrowDown
        keydownEvent.preventDefault()
        return this.performCommit(NAVIGATION_DIRECTIONS.NEXT, false)
      }

      if (keydownEvent.which === 38) { // ArrowUp
        keydownEvent.preventDefault()
        return this.performCommit(NAVIGATION_DIRECTIONS.PREV, false)
      }
    } else if (this.state.editingMode === EDITOR_MODES.MULTI_LINE) {
      if (keydownEvent.which === 13) {
        if (keydownEvent.metaKey) {
          // Meta+Enter when multi-line commits the value
          keydownEvent.preventDefault()
          return this.performCommit(NAVIGATION_DIRECTIONS.NEXT, false)
        }
        // Enter when multi-line just adds a new line
        // Shift+Enter when multi-line just adds a new line
      }
    }

    // Escape is the universal way to exit the editor without committing
    if (keydownEvent.which === 27) { // Escape
      this.requestNavigate(NAVIGATION_DIRECTIONS.SAME, false)
    }

    // Let all other keys pass through
  }

  navigateAutoCompletion (direction) {
    // If only one item in the list, no need to do anything, since there's nowhere to navigate
    if (this.state.autoCompletions.length < 2) {
      return void (0)
    }

    // Shift the currently toggled autocompletion to the next one in the list, using a wraparound.
    let changed = false
    this.state.autoCompletions.forEach((completion, index) => {
      if (!changed) {
        if (completion.highlighted) {
          let nidx = MathUtils.modOfIndex(index + direction, this.state.autoCompletions.length)
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

  handleAutoCompleterClick (completion) {
    this.chooseAutoCompletion(completion)
  }

  chooseHighlightedAutoCompletion () {
    let completion = this.state.autoCompletions.filter((completion) => {
      return !!completion.highlighted
    })[0]

    // Not sure why we'd get here, but in case...
    if (!completion) {
      return void (0)
    }

    // If we don't have the parse populated, we really can't do anything
    if (!this._parse) {
      return void (0)
    }

    this.chooseAutoCompletion(completion)
  }

  chooseAutoCompletion (completion) {
    let len = this._parse.target.end - this._parse.target.start
    let doc = this.codemirror.getDoc()
    let cur = this.codemirror.getCursor()

    doc.replaceRange(
      completion.name,
      { line: cur.line, ch: cur.ch - len },
      cur // { line: Number, ch: Number }
    )

    this.setState({ autoCompletions: [] })
  }

  /**
   * @method willHandleKeydownEvent
   * @description If we want to handle this, return true to short circuit higher-level handlers.
   * If we don't care, return a falsy value to indicate downstream handlers can take it.
   */
  willHandleExternalKeydownEvent (keydownEvent) {
    if (keydownEvent._alreadyHandled) {
      return 1
    }

    const focusedRow = this.props.component.getFocusedRow()
    const selectedRow = this.props.component.getSelectedRow()

    if (focusedRow) {
      // When focused, assume we *always* handle keyboard events, no exceptions.
      // If you want to handle an input when focused, used handleEditorKeydown
      return 2
    } else if (selectedRow && selectedRow.isProperty()) {
      if (keydownEvent.metaKey) {
        // Don't focus/nav if the user is doing e.g. Cmd+Z
        return 1
      }

      // Up/down arrows (when selected) navigate the selection state between cells
      if (keydownEvent.which === 38) { // Up arrow
        this.requestNavigate(NAVIGATION_DIRECTIONS.PREV, false)
        return 3
      } else if (keydownEvent.which === 40) { // Down arrow
        this.requestNavigate(NAVIGATION_DIRECTIONS.NEXT, false)
        return 4
      }

      // When tabbing, we navigate down by one input
      if (keydownEvent.which === 9) { // Tab
        this.requestNavigate(NAVIGATION_DIRECTIONS.NEXT, false)
        return 5
      }

      // Enter when selected brings us into a focused state
      if (keydownEvent.which === 13) { // Enter
        // Without this preventDefault, a newline will be inserted prior to the contents!
        // Note we only want to block this if we are requesting focused, newlines need to be
        // permitted in case of multiline mode
        keydownEvent.preventDefault()

        this.props.onFocusRequested()
        return 6
      }

      if (
        keydownEvent.which === 16 || // shift
        keydownEvent.which === 17 || // control
        keydownEvent.which === 18 || // alt
        keydownEvent.which === 32 || // space - this gets annoying because it's used for playback
        keydownEvent.which === 91 // command
      ) {
        return false
      }

      // Any 'edit' key (letters, numbers, etc) brings us into a focused state
      // Any mismatch of these usually indicates the key is a letter/number/symbol
      if (keydownEvent.key !== keydownEvent.code) {
        this.props.onFocusRequested(keydownEvent.key)
        return 7
      }
      // The delete key is also supported as a way to enter into a focused state
      if (keydownEvent.which === 46 || keydownEvent.which === 8) { // Delete
        this.props.onFocusRequested(keydownEvent.key)
        return 8
      }

      return false
    } else {
      return false
    }
  }

  launchMultilineMode () {
    this.setState({
      editingMode: EDITOR_MODES.MULTI_LINE
    }, () => {
      this.recalibrateEditor()
    })
  }

  launchSinglelineMode () {
    this.setState({
      editingMode: EDITOR_MODES.SINGLE_LINE
    }, () => {
      this.recalibrateEditor()
    })
  }

  engageFocus (props) {
    const focusedRow = props.component.getFocusedRow()

    // There may be a race condition where this isn't available,
    // so avoid crashing and just do nothing
    if (!focusedRow) {
      this.forceUpdate()
      // If nothing is focused, there's nothing to do
      return null
    }

    let originalDescriptor = focusedRow.getPropertyValueDescriptor()
    let originalValue = toValueDescriptor(originalDescriptor)

    let editingMode = EDITOR_MODES.SINGLE_LINE

    // If we received an input with multiple lines that is a machine, assume it should be treated like
    // an expression with a multi-line view, otherwise just a normal expression term
    if (originalValue.kind === EXPR_KINDS.MACHINE) {
      if (originalValue.body.split('\n').length > 1) {
        editingMode = EDITOR_MODES.MULTI_LINE
      }
    }

    this.setState({
      editingMode,
      evaluatorText: null,
      // If we detect the incoming value is static (a "VALUE"), don't show the evaluator.
      // Otherwise, we have an expression, so make sure we show the evaluator from the outset.
      evaluatorState: (originalValue.kind === EXPR_KINDS.VALUE)
        ? EVALUATOR_STATES.NONE
        : EVALUATOR_STATES.OPEN,
      originalValue,
      editedValue: originalValue
    }, () => {
      this.recalibrateEditor()
      this.handleEditorChange(this.codemirror, {})
    })
  }

  setEditorValue (value) {
    this.codemirror.setValue(value)
  }

  recalibrateEditor (cursor) {
    let renderable = ''

    switch (this.state.editingMode) {
      case EDITOR_MODES.MULTI_LINE:
        this.codemirror.setOptions({
          lineNumbers: true,
          scrollbarStyle: 'native'
        })
        renderable = getRenderableValueMultiline(this.state.editedValue)
        this.setEditorValue(renderable)
        break

      default:
        this.codemirror.setOptions({
          lineNumbers: false,
          scrollbarStyle: 'null'
        })
        renderable = getRenderableValueSingleline(this.state.editedValue)
        this.setEditorValue(renderable)
    }

    // Must focus in order to correctly capture key events and put the curser in the field
    this.codemirror.focus()

    // If cursor explicitly passed, use it. This is used by chooseAutocompletion
    if (cursor) {
      this.codemirror.setCursor(cursor)
    } else {
      if (this.state.editingMode === EDITOR_MODES.MULTI_LINE) {
        this.codemirror.setCursor({ line: 1, ch: renderable.split('\n')[1].length })
      } else {
        this.codemirror.setCursor({ line: 1, ch: renderable.length })
      }
    }

    // Note that this has to happen *after* we set the value or it'll end up with the previous value
    this.codemirror.setSize(this.getEditorWidth(), this.getEditorHeight() - 2)

    // If single-line, select all so the user can quickly delete the previous entry
    if (this.state.editingMode === EDITOR_MODES.SINGLE_LINE) {
      this.codemirror.execCommand('selectAll')
    }

    this.forceUpdate()
  }

  getEditorWidth () {
    let longest = this.getLongestLine()
    let pxw = longest.length * this.getEstimatedCharWidth()
    switch (this.state.editingMode) {
      case EDITOR_MODES.MULTI_LINE:
        if (pxw < MIN_EDITOR_WIDTH_MULTILINE) return MIN_EDITOR_WIDTH_MULTILINE
        if (pxw > MAX_EDITOR_WIDTH_MULTILINE) return MAX_EDITOR_WIDTH_MULTILINE
        return pxw
      default:
        if (pxw < MIN_EDITOR_WIDTH_SINGLE_LINE) return MIN_EDITOR_WIDTH_SINGLE_LINE
        if (pxw > MAX_EDITOR_WIDTH_SINGLE_LINE) return MAX_EDITOR_WIDTH_SINGLE_LINE
        return pxw
    }
  }

  getEditorHeight () {
    let rowh = this.props.reactParent.state.rowHeight
    switch (this.state.editingMode) {
      case EDITOR_MODES.MULTI_LINE:
        rowh = rowh - 4 // Ends up a bit too big...
        let finalh = rowh * this.getTotalLineCount()
        if (finalh > MAX_EDITOR_HEIGHT) finalh = MAX_EDITOR_HEIGHT
        return ~~finalh
      default: return rowh
    }
  }

  getEstimatedCharWidth () {
    // Trivial for monospace, but for normal fonts, what to use?
    return 9 // ???
  }

  getLines () {
    return this.codemirror.getValue().split('\n')
  }

  getTotalLineCount () {
    return this.getLines().length
  }

  getLongestLine () {
    let max = ''
    let lines = this.getLines()
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].length > max.length) {
        max = lines[i]
      }
    }
    return max
  }

  getEvaluatorText () {
    return this.state.evaluatorText || '•••'
  }

  getLabelString () {
    const row = this.props.component.getFocusedRow()
    const name = (row && row.getPropertyName()) || ''
    return humanizePropertyName(name)
  }

  getRootRect () {
    const row = this.props.component.getFocusedRow()

    if (!row) {
      return {
        left: 0,
        top: 0
      }
    }

    // When we become focused, we need to move to the position of the input cell we are
    // working with, and we do so by looking up the DOM node of the cell matching our property id
    const domElementFellow = document.getElementById(row.getInputPropertyId())

    // There might not be an element for the input cell if the cell was unfocused as part of accordion
    // collapse (which would result in that element being removed from the DOM), hence this guard
    if (!domElementFellow) {
      return {
        left: 0,
        top: 0
      }
    }

    return domElementFellow.getBoundingClientRect()
  }

  getEvalutatorStateColor () {
    switch (this.state.evaluatorState) {
      case EVALUATOR_STATES.WARN: return Palette.ORANGE
      case EVALUATOR_STATES.ERROR: return Palette.RED
      default: return Palette.FATHER_COAL
    }
  }

  getRootStyle () {
    let style = lodash.assign({
      height: this.getEditorHeight() + 1,
      left: 0,
      outline: 'none',
      position: experimentIsEnabled(Experiment.NativeTimelineScroll) ? 'sticky' : 'relative',
      top: 0,
      visibility: 'hidden',
      width: this.props.reactParent.state.inputCellWidth,
      zIndex: zIndex.expressionInput.base
    })

    if (this.props.component.getFocusedRow()) {
      style.visibility = 'visible'
      let rect = this.getRootRect()
      style.left = experimentIsEnabled(Experiment.NativeTimelineScroll) ? rect.left + this.props.reactParent.refs.container.scrollLeft : rect.left
      style.top = experimentIsEnabled(Experiment.NativeTimelineScroll) ? undefined : rect.top + 10
      style.marginTop = experimentIsEnabled(Experiment.NativeTimelineScroll) ? rect.top + this.props.reactParent.refs.container.scrollTop + 9 : undefined
    }

    return style
  }

  getColsWrapperStyle () {
    let style = lodash.assign({
      position: 'absolute',
      top: 0,
      left: 0,
      display: 'inline-flex',
      height: '100%'
    }, this.props.component.getFocusedRow() && {
      boxShadow: '0 2px 4px 0 rgba(15,1,6,0.06), 0 6px 53px 3px rgba(7,0,3,0.37), inset 0 0 7px 0 rgba(16,0,6,0.30)'
    })
    return style
  }

  getInputLabelStyle () {
    const label = this.getLabelString()
    let fontSize = 10
    if (label.length > 12) fontSize = 8
    let style = {
      backgroundColor: Palette.LIGHTEST_PINK,
      borderBottomLeftRadius: 4,
      borderTopLeftRadius: 4,
      color: Palette.SUNSTONE,
      display: 'none',
      fontWeight: 400,
      left: -83,
      lineHeight: 1,
      position: 'absolute',
      textAlign: 'center',
      textTransform: 'uppercase',
      width: experimentIsEnabled(Experiment.NativeTimelineScroll) ? 82 : 83
    }
    lodash.assign(style, this.props.component.getFocusedRow() && {
      fontSize,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center'
    })
    style.height = this.getEditorHeight() + 1
    return style
  }

  getSaveButtonStyle () {
    return {
      fontSize: '10px',
      backgroundColor: Palette.PINK,
      padding: '2px 8px',
      borderRadius: '4px',
      color: Palette.SUNSTONE,
      position: 'absolute',
      bottom: '5px',
      left: '50%',
      transform: 'translateX(-50%)'
    }
  }

  getEditorContextStyle () {
    let style = lodash.assign({
      backgroundColor: Palette.LIGHT_GRAY,
      border: '1px solid ' + Palette.DARKER_GRAY,
      borderBottomLeftRadius: 4,
      borderTopLeftRadius: 4,
      color: 'transparent',
      cursor: 'default',
      fontFamily: (this.state.editingMode === EDITOR_MODES.SINGLE_LINE)
        ? 'inherit'
        : 'Consolas, monospace',
      fontSize: 12,
      lineHeight: EDITOR_LINE_HEIGHT + 'px',
      height: this.getEditorHeight() + 1,
      width: this.getEditorWidth(),
      outline: 'none',
      overflow: 'hidden',
      paddingLeft: 7,
      paddingTop: 1,
      position: 'absolute',
      textShadow: '0 0 0 ' + Color(Palette.ROCK).fade(0.3), // darkmagic
      zIndex: 1004
    })
    lodash.assign(style, {
      border: '1px solid ' + Color(Palette.LIGHTEST_PINK).fade(0.2),
      zIndex: 2005
    })
    lodash.assign(style, this.props.component.getFocusedRow() && {
      backgroundColor: Color('#4C434B').fade(0.1),
      border: '1px solid ' + Color(Palette.LIGHTEST_PINK).fade(0.2),
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 4,
      borderTopLeftRadius: 0,
      borderTopRightRadius: 4,
      color: Palette.ROCK
    })
    return style
  }

  getEditorContextClassName () {
    let name = []
    name.push((this.state.editingMode === EDITOR_MODES.SINGLE_LINE) ? 'haiku-singleline' : 'haiku-multiline')
    name.push((this.state.evaluatorState > EVALUATOR_STATES.NONE) ? 'haiku-dynamic' : 'haiku-static')
    return name.join(' ')
  }

  getTooltipStyle () {
    let style = {
      backgroundColor: Palette.FATHER_COAL,
      borderRadius: 3,
      boxShadow: '0 3px 7px 0 rgba(7,0,3,0.40)',
      color: Palette.SUNSTONE,
      fontSize: 10,
      fontWeight: 400,
      left: 0,
      minHeight: 15,
      minWidth: 24,
      opacity: 0,
      padding: '3px 5px 2px 5px',
      position: 'absolute',
      textAlign: 'center',
      top: -26,
      transform: 'scale(.4)',
      transition: 'transform 182ms cubic-bezier(.175, .885, .316, 1.171)'
    }
    // If we're open, we should show the evaluator tooltip
    if (this.state.evaluatorState > EVALUATOR_STATES.NONE) {
      lodash.assign(style, {
        transform: 'scale(1)',
        opacity: 1
      })
    }
    // If we're info, warn, or error we have content to display
    if (this.state.evaluatorState > EVALUATOR_STATES.OPEN) {
      lodash.assign(style, {
        backgroundColor: this.getEvalutatorStateColor(),
        width: 300
      })
    }
    return style
  }

  getTooltipTriStyle () {
    let style = {
      position: 'absolute',
      width: 0,
      height: 0,
      top: 17,
      left: 12,
      transform: 'translate(-8.8px, 0)',
      borderLeft: '8.8px solid transparent',
      borderRight: '8.8px solid transparent',
      borderTop: '8.8px solid ' + this.getEvalutatorStateColor()
    }
    if (this.state.evaluatorState > EVALUATOR_STATES.OPEN) {
      lodash.assign(style, {
        borderTop: '8.8px solid ' + this.getEvalutatorStateColor()
      })
    }
    return style
  }

  render () {
    return (
      <div
        id='expression-input-holster'
        style={this.getRootStyle()}
        onClick={(clickEvent) => {
          clickEvent.stopPropagation()
        }}>
        <span
          id='expression-input-cols-wrapper'
          style={this.getColsWrapperStyle()}>
          <div
            id='expression-input-label'
            style={this.getInputLabelStyle()}>
            {this.getLabelString()}
            {
              this.state.editingMode === EDITOR_MODES.MULTI_LINE &&
              <button
                style={this.getSaveButtonStyle()}
                onClick={() => {
                  this.performCommit(NAVIGATION_DIRECTIONS.NEXT, false)
                }}
              >
                SAVE
              </button>
            }
          </div>
          <span
            id='expression-input-tooltip'
            style={this.getTooltipStyle()}>
            <span
              id='expression-input-tooltip-tri'
              style={this.getTooltipTriStyle()} />
            {this.getEvaluatorText()}
          </span>
          <div
            id='expression-input-editor-context'
            className={this.getEditorContextClassName()}
            ref={(element) => {
              this._context = element
            }}
            style={this.getEditorContextStyle()} />
          <AutoCompleter
            onClick={this.handleAutoCompleterClick.bind(this)}
            line={this.getCursorOffsetLine(this.codemirror.getCursor()) - 2}
            height={this.getEditorHeight()}
            width={this.getEditorWidth()}
            lineHeight={EDITOR_LINE_HEIGHT}
            autoCompletions={this.state.autoCompletions} />
        </span>
      </div>
    )
  }
}

ExpressionInput.propTypes = {
  timeline: React.PropTypes.object.isRequired,
  component: React.PropTypes.object.isRequired,
  reactParent: React.PropTypes.object.isRequired,
  onNavigateRequested: React.PropTypes.func.isRequired,
  onCommitValue: React.PropTypes.func.isRequired,
  onFocusRequested: React.PropTypes.func.isRequired
}
