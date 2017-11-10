import React from 'react'
import Radium from 'radium'
import {throttle} from 'lodash'
import Palette from './Palette'
import Popover from 'react-popover'
import {EyeIconSVG} from './Icons'
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
  popover: {
    padding: '3px 10px',
    margin: '0',
    fontSize: '11px',
    backgroundColor: 'rgb(21, 32, 34)',
    display: 'block',
    textAlign: 'center',
    borderRadius: '5px'
  },
  eye: {
    transform: 'scale(0.9)',
    fontFamily: 'Fira Sans, Arial, sans-serif !important',
    fontSize: '12px',
    fontWeight: '400',
    color: '#d1d1d1',
  }
}

class Toggle extends React.Component {
  constructor ({tooltipOpenDelay, tooltipCloseDelay}) {
    super()
    this.onToggle = this.onToggle.bind(this)
    this.openPopover = this.openPopover.bind(this)
    this.closePopover = this.closePopover.bind(this)
    this.tooltipOpenDelay = tooltipOpenDelay || 600
    this.tooltipCloseDelay = tooltipCloseDelay || 2000
    this.tooltipOpenTimeout = undefined
    this.tooltipCloseTimeout = undefined
    this.state = {
      active: false
    }
  }

  onToggle () {
    this.setState({active: !this.state.active})

    if (typeof this.props.onToggle === 'function') {
      this.props.onToggle(this.state.active)
    }
  }

  openPopover () {
    this.isMouseOver = true

    this.tooltipOpenTimeout = setTimeout(() => {
      if(this.isMouseOver) {
        this.setState({ isPopoverOpen: true })
      }
    }, this.tooltipOpenDelay)

    this.tooltipCloseTimeout = setTimeout(() => {
      this.closePopover()
    }, this.tooltipCloseDelay)
  }

  closePopover () {
    if(this.tooltipOpenTimeout) clearTimeout(this.tooltipOpenTimeout)
    if(this.tooltipCloseTimeout) clearTimeout(this.tooltipCloseTimeout)
    this.setState({ isPopoverOpen: false })
    this.isMouseOver = false
  }

  render () {
    const activeStyles = this.state.active ? STYLES.wrapper.active : {}

    return (
      <Popover
        isOpen={this.state.isPopoverOpen}
        body={<span style={STYLES.popover}>Toggle preview</span>}
        place='below'
        tipSize={5}
      >
        <a
          href='#'
          style={[
            BTN_STYLES.btnText,
            STYLES.wrapper,
            activeStyles,
            this.props.style
          ]}
          onMouseEnter={this.openPopover}
          onMouseLeave={this.closePopover}
          onClick={this.onToggle}
        >
          <div style={STYLES.eye}>
            <EyeIconSVG />
          </div>
        </a>
      </Popover>
    )
  }
}

export default Radium(Toggle)
