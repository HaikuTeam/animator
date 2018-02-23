/* global monaco */
import React from 'react'
import Radium from 'radium'
import Color from 'color'
import Palette from 'haiku-ui-common/lib/Palette'
import EventSelector from './EventSelector'
import SyntaxEvaluator from './SyntaxEvaluator'
import Snippets from './Snippets'
import {TrashIconSVG} from 'haiku-ui-common/lib/react/OtherIcons'

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
    background: Palette.DARKEST_COAL,
    overflow: 'hidden'
  },
  editorWrapper: {
    width: '100%',
    height: '100%',
    overflow: 'hidden'
  },
  options: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    svg: {
      visibility: 'hidden',
      cursor: 'pointer',
      padding: '8px'
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
    this.remove = this.remove.bind(this)

    this.state = {
      contents: props.contents,
      isHovered: false,
      isTrashHovered: false,
      evaluator: null
    }
  }

  componentDidMount () {
    monaco.editor.defineTheme('haiku', {
      base: 'vs-dark',
      inherit: true,
      // `rules` requires colors without the leading '#' ¯\_(ツ)_/¯
      rules: [{background: Palette.SPECIAL_COAL.replace('#', '')}],
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
      scrollbar: {
        vertical: 'hidden',
        verticalScrollbarSize: '0'
      },
      cursorBlinking: 'blink',
      scrollBeyondLastLine: false
    })

    this.editor.onDidChangeModelContent(this.handleEditorChange)
    // this.editor.onMouseMove listener declared in Snippets.js

    this.forceUpdate()
  }

  handleEditorChange () {
    setTimeout(() => {
      this.setState({contents: this.editor.getValue()})
      this.props.onContentChange(this.serialize())
    })
  }

  eventSelectedCallback (eventName) {
    this.props.onEventChange(
      this.serialize(eventName),
      this.props.selectedEventName
    )
  }

  serialize (eventName = this.props.selectedEventName) {
    return {
      id: this.props.id,
      event: eventName,
      handler: {
        params: this.props.params,
        body: this.state.contents,
        type: 'FunctionExpression',
        name: null
      },
      evaluator: this.state.evaluator
    }
  }

  remove () {
    this.props.onRemove(this.serialize())
  }

  render () {
    return (
      <div
        onMouseEnter={() => {
          this.setState({isHovered: true})
        }}
        onMouseLeave={() => {
          this.setState({isHovered: false})
        }}
        id={this.props.id}
      >
        <div style={STYLES.options}>
          {!this.props.isSimplified && (
            <EventSelector
              options={this.props.applicableHandlers}
              disabledOptions={this.props.appliedHandlers}
              onChange={this.eventSelectedCallback}
              defaultEventName={this.props.selectedEventName}
            />
          )}

          <div
            onMouseEnter={() => {
              this.setState({isTrashHovered: true})
            }}
            onMouseLeave={() => {
              this.setState({isTrashHovered: false})
            }}
            onClick={this.remove}
            style={[
              STYLES.options.svg,
              this.state.isHovered && STYLES.options.svgVisible,
              this.state.isTrashHovered && STYLES.options.svgActive
            ]}
          >
            {!this.props.isSimplified &&
            <TrashIconSVG
              color={
                this.state.isTrashHovered
                  ? STYLES.options.svgActive.fill
                  : STYLES.options.svgVisible.fill
              }
            />
          }
          </div>
        </div>

        <div style={{...STYLES.amble, ...STYLES.preamble}}>
          {`function (${this.props.params}) {`}
        </div>
        <div
          style={STYLES.editorContext}
          className='haiku-multiline haiku-dynamic'
        >
          <div
            style={STYLES.editorWrapper}
            ref={element => {
              this._context = element
            }}
          >
            <Snippets editor={this.editor} />
          </div>
        </div>
        <div style={{...STYLES.amble, ...STYLES.postamble}}>
          {'}'}
          <SyntaxEvaluator
            onChange={(evaluator) => { this.setState({evaluator}) }}
            evaluate={this.state.contents}
            style={STYLES.postamble.errors}
          />
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
