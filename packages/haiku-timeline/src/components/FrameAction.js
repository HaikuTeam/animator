import React from 'react'
import Radium from 'radium'
import Bolt from 'haiku-ui-common/lib/react/icons/Bolt'
import Palette from 'haiku-ui-common/lib/Palette'

const STYLE = {
  base: {
    position: 'absolute',
    top: '-31px',
    left: '-6px',
    cursor: 'pointer',
    overflow: 'hidden'
  },
  addAction: {
    padding: '0 8px',
    left: '-14px',
    opacity: 0,
    cursor: 'pointer',
    transform: 'scale(.5)',
    transition: 'transform 180ms ease'
  },
  show: {
    opacity: 1,
    transform: 'scale(1)'
  },
  plus: {
    width: '12px',
    height: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    border: '1px solid rgba(255,255,255,.2)',
    fontSize: '20px'
  }
}

class FrameAction extends React.Component {
  constructor () {
    super()
    this.openFrameActionsEditor = this.openFrameActionsEditor.bind(this)
    this.timeout = null
    this.state = {
      achievedHover: false
    }
  }

  setHover () {
    this.timeout = setTimeout(() => {
      this.setState({achievedHover: true})
    }, 520)
  }

  componentWillUnmount () {
    if (this.timeout) {
      clearTimeout(this.timeout)
    }
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
          onMouseDown={(event) => {
            if (this.state.achievedHover) this.openFrameActionsEditor(event)
          }
          }
          style={[STYLE.base, STYLE.addAction, this.state.achievedHover && STYLE.show]}>
          <div
            style={STYLE.plus}
            onMouseEnter={() => this.setHover()}
            onMouseLeave={() => this.timeout && clearTimeout(this.timeout)}>
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

export default Radium(FrameAction)
