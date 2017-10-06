import React from 'react'
import Palette from './Palette'
import Popover from 'react-popover'

const STYLES = {
  dots: {
    color: Palette.ROCK,
    transform: 'rotate(90deg)'
  },
  container: {
    display: 'inline-block',
    marginLeft: '5px'
  },
  popover: {
    container: {
      listStyle: 'none',
      padding: '15px',
      margin: '0',
      backgroundColor: Palette.DARKER_GRAY,
      minWidth: '150px'
    },
    item: {
      textAlign: 'left',
      marginBottom: '5px',
      color: Palette.ROCK,
      ':hover': {
        backgroundColor: Palette.DARK_GRAY
      }
    }
  }
}

class ThreeDotMenu extends React.Component {
  constructor (props) {
    super(props)

    this.openPopover = this.openPopover.bind(this)
    this.closePopover = this.closePopover.bind(this)

    this.state = {
      isPopoverOpen: false
    }
  }

  openPopover (evt) {
    evt.stopPropagation()
    this.setState({ isPopoverOpen: true })
  }

  closePopover () {
    this.setState({ isPopoverOpen: false })
  }

  renderMenuItems () {
    return (
      <ul style={STYLES.popover.container} onClick={this.closePopover}>
        {this.props.items.map(({ label, icon, onClick }, id) => {
          return (
            <li key={id} onClick={onClick}>
              <button style={STYLES.popover.item}>
                {icon && React.createElement(icon)}
                {label}
              </button>
            </li>
          )
        })}
      </ul>
    )
  }

  render () {
    return (
      <div style={STYLES.container}>
        <Popover
          onOuterAction={this.closePopover}
          isOpen={this.state.isPopoverOpen}
          place='left'
          tipSize={0.1}
          body={this.renderMenuItems()}
        >
          <div>
            <button style={STYLES.dots} onClick={this.openPopover}>
              &#5867;&#5867;&#5867;
            </button>
          </div>
        </Popover>
      </div>
    )
  }
}

export default ThreeDotMenu
