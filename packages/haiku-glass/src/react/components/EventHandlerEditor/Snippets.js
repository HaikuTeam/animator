/* global monaco */
import React from 'react'
import {shell} from 'electron'
import {Menu, MenuItem} from '../../Menu'
import Palette from '../../Palette'

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
    fontSize: '20px',
    lineHeight: '18px'
  }
}

const SNIPPET_OPTIONS = {
  'Change State': 'this.setState({stateName: value})',
  'Go To And Play': 'this.getDefaultTimeline.goToAndPlay(ms)',
  'Go To And Stop': 'this.getDefaultTimeline.goToAndStop(ms)',
  'Pause': 'this.getDefaultTimeline.pause()',
  'Stop': 'this.getDefaultTimeline.stop()',
  'Docs': () => {
    shell.openExternal('https://docs.haiku.ai/using-haiku/summonables.html')
  }
}

class Snippets extends React.PureComponent {
  constructor (props) {
    super(props)

    this.insertSnippet = this.insertSnippet.bind(this)
  }

  componentWillReceiveProps (newProps) {
    if (newProps.editor && !this.props.editor) {
      newProps.editor.domElement.querySelector('.monaco-editor').appendChild(this._plus)

      newProps.editor.onDidChangeCursorPosition((event, editor) => {
        this._plus.style.top = `${18 * (event.position.lineNumber - 1)}px`
      })
    }
  }

  hasCursorPosition () {
    const { lineNumber, column } = this.props.editor.getPosition()
    return lineNumber !== 1 && column !== 1
  }

  insertSnippet (event, {injectable}) {
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
      injectable = `\n${injectable}`
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

  renderItems () {
    return Object.entries(SNIPPET_OPTIONS).map(([option, injectable]) => {
      return (
        <MenuItem key={option} data={{injectable}} onClick={this.insertSnippet}>
          {option}
        </MenuItem>
      )
    })
  }

  render () {
    return (
      <div style={STYLES.wrapper} ref={element => (this._plus = element)}>
        <Menu
          fixed
          offset={{left: -80, top: 0}}
          trigger={
            <div style={STYLES.button} className='js-snipet-trigger'>
              +
            </div>
          }
        >
          {this.renderItems()}
        </Menu>
      </div>
    )
  }
}

Snippets.propTypes = {
  editor: React.PropTypes.object
}

export default Snippets
