/* global monaco */
import React from 'react'
import {Menu, MenuItem} from '../../Menu'

const STYLES = {
  wrapper: {
    position: 'fixed',
    zIndex: 99,
    visibility: 'hidden'
  },
  button: {
    border: '1px solid',
    borderRadius: '50%',
    width: '20px',
    height: '20px',
    textAlign: 'center',
    cursor: 'pointer'
  }
}

const SNIPPET_OPTIONS = {
  'Change State': 'this.setState({stateName: value})',
  'Go To And Play': 'this.getDefaultTimeline.goToAndPlay(ms)',
  'Go To And Stop': 'this.getDefaultTimeline.goToAndStop(ms)',
  'Pause': 'this.getDefaultTimeline.pause()',
  'Stop': 'this.getDefaultTimeline.stop()'
}

class Snippets extends React.PureComponent {
  constructor (props) {
    super(props)

    this.insertSnippet = this.insertSnippet.bind(this)
  }

  componentWillReceiveProps (newProps) {
    if (newProps.editor && !this.props.editor) {
      newProps.editor.onMouseMove(({target}) => {
        let element

        if (target.element.className === 'view-line') {
          element = target.element
        } else {
          element = document.querySelector('.view-line:last-of-type')
        }

        this.setButtonPosition(element)
      })

      newProps.editor.onMouseLeave(({event}) => {
        if (event.target.className !== 'js-snipet-trigger') {
          // this._plus.style.visibility = 'hidden'
        }
      })
    }
  }

  setButtonPosition (element) {
    const {top, right} = element.getBoundingClientRect()
    this._plus.style.left = `${right - 60}px`
    this._plus.style.top = `${top}px`
    this._plus.style.visibility = 'visible'
  }

  insertSnippet (event, {injectable}) {
    var p = this.props.editor.getPosition()

    this.props.editor.executeEdits('snippet-injector', [
      {
        identifier: Date.now(),
        range: new monaco.Range(p.lineNumber, p.column, p.lineNumber, p.column),
        text: injectable
      }
    ])
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
