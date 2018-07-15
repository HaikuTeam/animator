/* global monaco */
import * as React from 'react'
import {shell} from 'electron'
import Palette from 'haiku-ui-common/lib/Palette'
import PopoverMenu from 'haiku-ui-common/lib/electron/PopoverMenu'

const STYLES = {
  wrapper: {
    position: 'absolute',
    top: '0',
    right: '12px',
    zIndex: 99,
    fontFamily: 'Fira Sans'
  },
  button: {
    border: `1px solid currentColor`,
    color: Palette.SUNSTONE,
    backgroundColor: Palette.DARKEST_COAL,
    borderRadius: '50%',
    width: '18px',
    height: '18px',
    textAlign: 'center',
    cursor: 'pointer',
    fontSize: '18px',
    lineHeight: '18px',
    paddingLeft: '1px'
  }
}

class Snippets extends React.PureComponent {
  constructor (props) {
    super(props)

    this.snippetOptions = [
      {
        label: 'Change State',
        onClick: () => { this.insertSnippet('this.setState({stateName: value})') }
      },
      {
        label: 'Change State (Transition)',
        onClick: () => { this.insertSnippet('this.setState({stateName: value}, {duration: 1000, curve: "linear"})') }
      },
      {
        label: 'Go To And Play',
        onClick: () => { this.insertSnippet('this.gotoAndPlay(frame)') }
      },
      {
        label: 'Go To And Stop',
        onClick: () => { this.insertSnippet('this.gotoAndStop(frame)') }
      },
      {
        label: 'Pause',
        onClick: () => { this.insertSnippet('this.pause()') }
      },
      {
        label: 'Stop',
        onClick: () => { this.insertSnippet('this.stop()') }
      },
      {
        label: 'Open Link',
        onClick: () => { this.insertSnippet('window.open("https://www.haiku.ai", "_self", "location=yes")') }
      },
      {
        label: 'Docs ↗',
        onClick: () => {
          shell.openExternal('https://docs.haiku.ai/using-haiku/summonables.html')
        }
      }
    ]
  }

  componentWillReceiveProps (newProps) {
    if (newProps.editor && !this.props.editor) {
      newProps.editor.domElement
        .querySelector('.monaco-editor')
        .appendChild(this._plus)

      newProps.editor.onDidChangeCursorPosition((event, editor) => {
        this._plus.style.top = `${18 * (event.position.lineNumber - 1)}px`
      })
    }
  }

  hasCursorPosition () {
    const {lineNumber, column} = this.props.editor.getPosition()
    return lineNumber !== 1 && column !== 1
  }

  insertSnippet (injectable) {
    if (typeof injectable === 'function') {
      return injectable()
    }

    let range

    const { lineNumber, column } = this.props.editor.getPosition()

    if (this.hasCursorPosition()) {
      range = new monaco.Range(lineNumber, column, lineNumber, column)
    } else {
      const allLines = this.props.editor.viewModel.lines.lines.length + 1
      range = new monaco.Range(allLines, 100, allLines, 100)
      injectable = `${injectable}`
    }

    this.props.editor.executeEdits('snippet-injector', [
      {
        identifier: Date.now(),
        range,
        text: injectable
      }
    ])

    this.props.editor.focus()
    this.props.editor.pushUndoStop()
  }

  render () {
    return (
      <div style={STYLES.wrapper} ref={element => (this._plus = element)}
        onClick={(event) => {
          PopoverMenu.launch({event, items: this.snippetOptions})
        }}>
        <div style={STYLES.button}>
          +
        </div>
      </div>
    )
  }
}

Snippets.propTypes = {
  editor: React.PropTypes.object
}

export default Snippets
