import React from 'react'
import Bolt from './Icons/Bolt'

const STYLE = {
  base: {
    position: 'absolute',
    top: '-40px',
    left: '-6px',
    cursor: 'pointer'
  }
}

class FrameAction extends React.PureComponent {
  constructor() {
    super()
    this.openFrameActionsEditor = this.openFrameActionsEditor.bind(this)
  }

  openFrameActionsEditor() {
    this.props.onShowFrameActionsEditor(this.props.frame)
  }

  render() {
    if (this.props.hasActions) {
      return (
        <div onClick={this.openFrameActionsEditor} style={STYLE.base}>
          <Bolt color={'#4DCEDA'} />
        </div>
      )
    } else {
      return (
        <div
          className="frame-action"
          onClick={this.openFrameActionsEditor}
          style={{
            ...STYLE.base,
            padding: '0 10px',
            left: '-16px'
          }}
        >
          <style>
            {`
              .frame-action {
                opacity: 1;
              }
              .frame-action:not(:hover) {
                opacity: 0;
              }
            `}
          </style>
          <div
            style={{
              width: '12px',
              height: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              border: '1px solid white',
              fontSize: '20px'
            }}
          >
            +
          </div>
        </div>
      )
    }
  }
}

FrameAction.propTypes = {
  hasActions: React.PropTypes.bool,
  onShowFrameActionsEditor: React.PropTypes.func.isRequired
}

export default FrameAction
