import React from 'react'
import Radium from 'radium'
import Palette from 'haiku-ui-common/lib/Palette'
import Popover from 'react-popover'

const STYLES = {
  dots: {
    color: Palette.ROCK,
    transform: 'rotate(90deg)'
  },
  container: {
    display: 'inline-block',
    marginLeft: '8px',
    width: '20px',
    textAlign: 'center',
    borderRadius: '3px',
    hover: {
      backgroundColor: Palette.GRAY
    }
  },
  popover: {
    container: {
      listStyle: 'none',
      padding: '15px 15px 5px',
      margin: '0',
      backgroundColor: Palette.FATHER_COAL,
      minWidth: '150px',
      borderRadius: '3px'
    },
    item: {
      display: 'flex',
      textAlign: 'left',
      alignItems: 'center',
      marginBottom: '10px',
      color: Palette.ROCK
    },
    icon: {
      width: '16px',
      display: 'inline-block',
      textAlign: 'center'
    },
    text: {
      display: 'inline-block',
      marginLeft: '8px'
    }
  }
}

class ThreeDotMenu extends React.Component {
  constructor (props) {
    super(props)

    this.openPopover = this.openPopover.bind(this)
    this.closePopover = this.closePopover.bind(this)

    this.state = {
      isPopoverOpen: false,
      isHovered: false
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
              <button style={STYLES.popover.item} key={id}>
                <span style={STYLES.popover.icon}>
                  {icon && React.createElement(icon)}
                </span>
                <span style={STYLES.popover.text}>
                  {label}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    )
  }

  render () {
    return (
      <div
        className='three-dot-menu-popover'
        onMouseOver={() => {
          this.setState({isHovered: true})
        }}
        onMouseOut={() => {
          this.setState({isHovered: false})
        }}
        style={[
          STYLES.container,
          this.state.isHovered && STYLES.container.hover
        ]}
      >
        <Popover
          onOuterAction={this.closePopover}
          isOpen={this.state.isPopoverOpen}
          place='below'
          className='three-dot-popover'
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

export default Radium(ThreeDotMenu)
