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
    minWidth: '115%',
    backgroundColor: Palette.SPECIAL_COAL,
    ':hover': {
      backgroundColor: 'black'
    }
  },
  resetList: {
    listStyle: 'none',
    padding: '0',
    margin: '0'
  },
  carrot: {
    transform: 'rotate(-90deg)',
    float: 'right'
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

  render () {
    return (
      <div style={STYLES.wrapper} onMouseLeave={this.close}>
        <div onClick={this.toggleOpen}>{this.props.trigger}</div>
        <ul
          onClick={this.closeIfOptionSelected}
          style={[
            STYLES.resetList,
            STYLES.menu,
            this.state.isOpen && STYLES.menu.open
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
        style={STYLES.menuItem}
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
        onClick(event, data)
      }}
      disabled={disabled}
      style={STYLES.menuItem}
    >
      {children}
    </li>
  )
}

export const Menu = Radium(BaseMenu)
export const SubMenu = Radium(BaseSubMenu)
export const MenuItem = Radium(BaseMenuItem)
