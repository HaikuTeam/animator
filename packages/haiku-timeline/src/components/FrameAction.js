import React from 'react'
import Bolt from 'haiku-ui-common/lib/react/icons/Bolt'
import Palette from 'haiku-ui-common/lib/Palette'

const STYLE = {
  base: {
    position: 'absolute',
    top: '-31px',
    left: '-6px',
    cursor: 'pointer',
    overflow: 'hidden'
  }
}

class FrameAction extends React.PureComponent {
  constructor () {
    super()
    this.openFrameActionsEditor = this.openFrameActionsEditor.bind(this)
  }

  openFrameActionsEditor (e) {
    e.stopPropagation()
    this.props.onShowFrameActionsEditor(this.props.frame)
  }

  render () {
    if (this.props.hasActions) {
      return (
        <div onMouseDown={(e) => this.openFrameActionsEditor(e)} style={STYLE.base}>
          <Bolt color={Palette.LIGHT_BLUE} />
        </div>
      )
    } else {
      return (
        <div
          className='frame-action'
          onMouseDown={(e) => this.openFrameActionsEditor(e)}
          style={{
            ...STYLE.base,
            padding: '0 8px',
            left: '-14px'
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
              border: '1px solid rgba(255,255,255,.2)',
              fontSize: '20px',
              cursor: 'pointer'
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
