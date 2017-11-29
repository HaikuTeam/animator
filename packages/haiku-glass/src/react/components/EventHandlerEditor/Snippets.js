/* global monaco */
import React from 'react'
import {get} from 'lodash'
import {Menu, MenuItem} from '../../Menu'

const STYLES = {
  wrapper: {
    position: 'absolute',
    top: '0',
    right: '9%',
    zIndex: 99,
    visibility: 'hidden',
    fontFamily: 'Fira Sans'
  },
  button: {
    border: '1px solid',
    borderRadius: '50%',
    width: '15px',
    height: '15px',
    textAlign: 'center',
    cursor: 'pointer',
    fontSize: '15px',
    lineHeight: '16px',
    marginTop: '1px'
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
      newProps.editor.onMouseMove(({event, target}) => {
        if (get(event, 'browserEvent.toElement.className') === 'js-snipet-trigger') return
        let element

        if (target.element.className === 'view-line') {
          element = target.element
        } else {
          element = document.querySelector('.view-line')
        }

        this.setButtonPosition(element)
      })

      newProps.editor.onMouseLeave(({event}) => {
        if (get(event, 'browserEvent.toElement.className') !== 'js-snipet-trigger') {
          this._plus.style.visibility = 'hidden'
        }
      })
    }
  }

  setButtonPosition (element) {
    element.appendChild(this._plus)
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
          fixedToTrigger={this._plus}
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
