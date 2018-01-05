import React from 'react'
import Radium from 'radium'
import Palette from 'haiku-ui-common/lib/Palette'
import {Tooltip} from 'haiku-ui-common/lib/react/Tooltip'
import {EyeIconSVG} from 'haiku-ui-common/lib/react/OtherIcons'
import {BTN_STYLES} from '../styles/btnShared'

const STYLES = {
  wrapper: {
    cursor: 'pointer',
    borderStyle: 'solid',
    borderWidth: '1px',
    borderColor: Palette.FATHER_COAL,
    marginRight: '7px',
    padding: '6px 5px 5px',
    active: {
      borderColor: Palette.LIGHTEST_PINK
    }
  },
  eye: {
    transform: 'scale(0.9)',
    fontFamily: 'Fira Sans, Arial, sans-serif !important',
    fontSize: '12px',
    fontWeight: '400',
    color: Palette.ROCK
  },
  disabled: {
    pointerEvents: 'none',
    opacity: 0.5
  }
}

class Toggle extends React.Component {
  constructor () {
    super()
    this.onToggle = this.onToggle.bind(this)
    this.openPopover = this.openPopover.bind(this)
    this.closePopover = this.closePopover.bind(this)
    this.tooltipOpenDelay = tooltipOpenDelay || 600
    this.tooltipCloseDelay = tooltipCloseDelay || 2000
    this.tooltipOpenTimeout = undefined
    this.tooltipCloseTimeout = undefined
  }

  onToggle () {
    if (typeof this.props.onToggle === 'function') {
      this.props.onToggle()
    }
  }

  render () {
    return (
      <Tooltip text='Toggle preview' style={this.props.style}>
        <a
          href='#'
          style={[
            BTN_STYLES.btnText,
            STYLES.wrapper,
            this.props.active && STYLES.wrapper.active,
            this.props.disabled && STYLES.disabled,
            this.props.style
          ]}
          onClick={this.onToggle}
        >
          <div style={STYLES.eye}>
            <EyeIconSVG color={STYLES.eye.color} />
          </div>
        </a>
      </Tooltip>
    )
  }
}

export default Radium(Toggle)
