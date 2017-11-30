import React from 'react'
import Radium from 'radium'
import Palette from './Palette'
import {DownCarrotSVG} from './Icons.js'

const STYLES = {
  wrapper: {
    position: 'relative'
  },
  menu: {
    position: 'absolute',
    display: 'none',
    background: Palette.SPECIAL_COAL,
    color: Palette.PALE_GRAY,
    zIndex: '99',
    top: 0,
    left: 0,
    borderRadius: '4px',
    boxShadow: '0 4px 18px 0 rgba(1,28,33,0.38)',
    open: {
      display: 'inline-block'
    }
  },
  subMenu: {
    open: {
      display: 'inline-block',
      left: '100%',
      top: '0',
      zIndex: 999
    }
  },
  menuItem: {
    position: 'relative',
    cursor: 'pointer',
    padding: '8px 10px',
    display: 'flex',
    justifyContent: 'space-between',
    whiteSpace: 'nowrap',
    backgroundColor: Palette.SPECIAL_COAL,
    ':hover': {
      backgroundColor: 'black'
    },
    disabled: {
      color: Palette.LIGHTEST_GRAY
    }
  },
  resetList: {
    listStyle: 'none',
    padding: '0',
    margin: '0'
  },
  carrot: {
    transform: 'rotate(-90deg)',
    marginLeft: '15px'
  }
}

const closeIfSelectedClass = 'js-close-on-click'

class BaseMenu extends React.Component {
  constructor (props) {
    super(props)

    this.toggleOpen = this.toggleOpen.bind(this)
    this.close = this.close.bind(this)
    this.closeIfOptionSelected = this.closeIfOptionSelected.bind(this)

    this.state = {
      isOpen: false
    }
  }

  toggleOpen () {
    this.setState({isOpen: !this.state.isOpen})
  }

  close () {
    this.setState({isOpen: false})
  }

  closeIfOptionSelected (event) {
    if (event.target.className === closeIfSelectedClass) this.close()
  }

  getWrapperStyles () {
    if (this.props.fixed && this.triggerRef) {
      const {
        top,
        right,
        width
      } = this.triggerRef.getBoundingClientRect()

      return {
        position: 'fixed',
        top: `${top}px`,
        left: `${right - width}px`
      }
    }
  }

  render () {
    return (
      <div
        style={STYLES.wrapper}
        onMouseLeave={this.close}
        className='popover-menu-custom'
      >
        <style>
          {`
              .popover-menu-custom li:first-child {
                border-top-right-radius: 4px;
                border-top-left-radius: 4px;
              }

              .popover-menu-custom li:last-child {
                border-bottom-right-radius: 4px;
                border-bottom-left-radius: 4px;
              }
            `}
        </style>
        <div
          onClick={this.toggleOpen}
          ref={trigger => {
            this.triggerRef = trigger
          }}
        >
          {this.props.trigger}
        </div>
        <ul
          onClick={this.closeIfOptionSelected}
          style={[
            STYLES.resetList,
            STYLES.menu,
            this.state.isOpen && STYLES.menu.open,
            this.state.isOpen && this.getWrapperStyles()
          ]}
        >
          {this.props.children}
        </ul>
      </div>
    )
  }
}

class BaseSubMenu extends React.Component {
  constructor (props) {
    super(props)

    this.open = this.open.bind(this)
    this.close = this.close.bind(this)

    this.state = {
      isOpen: false
    }
  }

  open () {
    this.setState({isOpen: true})
  }

  close () {
    this.setState({isOpen: false})
  }

  render () {
    const {title, children} = this.props

    return (
      <li
        style={[STYLES.menuItem]}
        onMouseEnter={this.open}
        onMouseLeave={this.close}
      >
        {title}
        <div style={STYLES.carrot}>
          <DownCarrotSVG />
        </div>
        <ul
          style={[
            STYLES.resetList,
            STYLES.menu,
            STYLES.subMenu,
            this.state.isOpen && STYLES.subMenu.open
          ]}
        >
          {children}
        </ul>
      </li>
    )
  }
}

const BaseMenuItem = ({children, data, disabled, onClick}) => {
  return (
    <li
      className={closeIfSelectedClass}
      onClick={event => {
        if (!disabled) onClick(event, data)
      }}
      disabled={disabled}
      style={[STYLES.menuItem, disabled && STYLES.menuItem.disabled]}
    >
      {children}
    </li>
  )
}

export const Menu = Radium(BaseMenu)
export const SubMenu = Radium(BaseSubMenu)
export const MenuItem = Radium(BaseMenuItem)
