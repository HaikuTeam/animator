/* global monaco */
import React from 'react'
import Radium from 'radium'
import Color from 'color'
import Palette from '../../Palette'
import marshalParams from '@haiku/player/lib/reflection/marshalParams'
import parseExpression from 'haiku-serialization/src/ast/parseExpression'
import EventSelector from './EventSelector'
import HaikuMode from '../../modes/haiku.js'
import Snippets from './Snippets'
import {TrashIconSVG} from '../../Icons'
import {EVALUATOR_STATES} from './constants'

const STYLES = {
  amble: {
    backgroundColor: Palette.SPECIAL_COAL,
    fontFamily: 'Fira Mono',
    fontSize: '11px',
    padding: '3px 13px'
  },
  preamble: {
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7
  },
  postamble: {
    borderBottomLeftRadius: 7,
    borderBottomRightRadius: 7,
    marginBottom: '25px',
    errors: {
      float: 'right',
      fontFamily: 'Fira Sans'
    }
  },
  editorContext: {
    fontFamily: 'Fira Mono',
    height: '105px',
    width: '100%',
    padding: '6px 0 6px 22px',
    background: '#0F171A',
    overflow: 'hidden'
  },
  options: {
    display: 'flex',
    justifyContent: 'space-between',
    svg: {
      visibility: 'hidden',
      cursor: 'pointer',
      marginRight: '5px'
    },
    svgVisible: {
      visibility: 'visible',
      fill: Color(Palette.ROCK).fade(0.7)
    },
    svgActive: {
      visibility: 'visible',
      fill: Palette.ROCK
    }
  }
}

class Editor extends React.Component {
  constructor (props) {
    super(props)

    this.eventSelectedCallback = this.eventSelectedCallback.bind(this)
    this.handleEditorChange = this.handleEditorChange.bind(this)
    this.die = this.die.bind(this)

    this.state = {
      evaluator: this.getDefaultEvaluator(),
      isHovered: false,
      isTrashHovered: false
    }
  }

  componentDidMount () {
    monaco.editor.defineTheme('haiku', {
      base: 'vs-dark',
      inherit: true,
      rules: [{background: '122022'}],
      colors: {
        'editor.foreground': Palette.PALE_GRAY,
        'editor.background': '#0F171A',
        'editorCursor.foreground': Palette.LIGHTEST_PINK,
        'list.focusBackground': Palette.BLACK,
        focusBorder: Palette.BLACK,
        'editorWidget.background': '#0F171A',
        'editor.lineHighlightBorder': '#0F171A'
      }
    })

    monaco.editor.setTheme('haiku')

    this.editor = monaco.editor.create(this._context, {
      value: this.props.contents || '',
      language: 'javascript',
      lineNumbers: 'off',
      links: false,
      theme: 'haiku',
      minimap: {enabled: false},
      autoIndent: true,
      contextmenu: false,
      codeLens: false,
      quickSuggestions: false,
      parameterHints: false,
      /* Elements with `will-change: transform` are containing blocks
        for all descendants, meaning that all elements,
        *including fixed elements* are positioned against them.
        In order for snippets and other glorious features to break the overflow
        of the editor, they need to be fixed against the document. */
      disableLayerHinting: true,
      fixedOverflowWidgets: true,
      links: false
    })

    this.editor.onDidChangeModelContent(this.handleEditorChange)
    // this.editor.onMouseMove listener declared in Snippets.js

    this.forceUpdate()
  }

  getPreamble (officialValue) {
    const params =
      officialValue && officialValue.params && officialValue.params.length > 0
        ? marshalParams(officialValue.params)
        : ''

    return `function (${params}) {`
  }

  getDefaultEvaluator () {
    return {
      text: null,
      state: EVALUATOR_STATES.OPEN
    }
  }

  handleEditorChange ({changes}) {
    const value = this.editor.getValue()
    const evaluator = this.getDefaultEvaluator()
    const wrapped = parseExpression.wrap(value)
    const parse = parseExpression(wrapped, {}, HaikuMode.keywords, null, null, {
      // These checks are only needed for expressions in the timeline
      skipParamsImpurityCheck: true,
      skipForbiddensCheck: true
    })

    if (parse.error) {
      evaluator.text = parse.error.message
      evaluator.state = EVALUATOR_STATES.ERROR
    } else {
      if (parse.warnings.length > 0) {
        evaluator.text = parse.warnings[0].annotation
        evaluator.state = EVALUATOR_STATES.WARN
      }
    }

    this.setState({evaluator})
    this.props.onContentChange(this.serialize())
  }

  getEvalutatorStateColor (state) {
    switch (state) {
      case EVALUATOR_STATES.WARN:
        return Palette.ORANGE
      case EVALUATOR_STATES.ERROR:
        return Palette.RED
      default:
        return Palette.PALE_GRAY
    }
  }

  eventSelectedCallback (eventName) {
    const oldEventName = this.props.selectedEventName
    this.props.onEventChange(oldEventName, this.serialize(eventName))
  }

  isCommittableValueInvalid (committable, original) {
    // If we have any error/warning in the evaluator, assume
    // it as grounds not to commit the current content of the field.
    if (this.state.evaluator.state > EVALUATOR_STATES.INFO) {
      return {
        reason: this.state.evaluator.text
      }
    }

    return false
  }

  serialize (eventName = this.props.selectedEventName) {
    const rawContents = this.editor.getValue()

    return {
      [eventName]: {
        params: ['event'],
        body: rawContents
      }
    }
  }

  die () {
    this.props.onRemove(this.props.selectedEventName)
  }

  render () {
    return (
      <div
        onMouseEnter={() => { this.setState({isHovered: true}) }}
        onMouseLeave={() => { this.setState({isHovered: false}) }}
      >
        <div style={STYLES.options}>
          <EventSelector
            options={this.props.applicableHandlers}
            disabledOptions={this.props.appliedHandlers}
            onChange={this.eventSelectedCallback}
            defaultEventName={this.props.selectedEventName}
          />

          <div
            onMouseEnter={() => { this.setState({isTrashHovered: true}) }}
            onMouseLeave={() => { this.setState({isTrashHovered: false}) }}
            onClick={this.die}
            style={[
              STYLES.options.svg,
              this.state.isHovered && STYLES.options.svgVisible,
              this.state.isTrashHovered && STYLES.options.svgActive,
            ]}
          >
            <TrashIconSVG
              color={
                this.state.isTrashHovered
                  ? STYLES.options.svgActive.fill
                  : STYLES.options.svgVisible.fill
              }
            />
          </div>
        </div>

        <div style={{...STYLES.amble, ...STYLES.preamble}}>
          {this.getPreamble()}
        </div>
        <div
          className='haiku-multiline haiku-dynamic'
          ref={element => {
            this._context = element
          }}
          style={STYLES.editorContext}
        >
          <Snippets editor={this.editor} />
        </div>
        <div style={{...STYLES.amble, ...STYLES.postamble}}>
          {'}'}
          <span
            style={{
              ...STYLES.postamble.errors,
              color: this.getEvalutatorStateColor(this.state.evaluator.state)
            }}
          >
            {this.state.evaluator.text || 'No Errors'}
          </span>
        </div>
      </div>
    )
  }
}

Editor.propTypes = {
  onContentChange: React.PropTypes.func.isRequired,
  onEventChange: React.PropTypes.func.isRequired,
  onRemove: React.PropTypes.func.isRequired,
  applicableHandlers: React.PropTypes.array.isRequired,
  appliedHandlers: React.PropTypes.object.isRequired,
  selectedEventName: React.PropTypes.string.isRequired,
  contents: React.PropTypes.string
}

export default Radium(Editor)
