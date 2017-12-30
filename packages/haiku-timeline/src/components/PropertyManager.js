import React from 'react'
import CirclePlusSVG from 'haiku-ui-common/lib/react/icons/CirclePlusSVG'
import Palette from 'haiku-ui-common/lib/Palette'
import {Menu, MenuItem, SubMenu} from 'haiku-ui-common/lib/react/Menu'

export default class PropertyManager extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
    this.renderMenuTrigger = this.renderMenuTrigger.bind(this)
    this.renderMenuItems = this.renderMenuItems.bind(this)
  }

  getIconColor () {
    return Palette.DARK_ROCK
  }

  renderSingleMenuItem ({value, label}) {
    return (
      <MenuItem
        data={{value}}
        key={label}
        onClick={(_event, selectedItem) => {
          if (selectedItem && selectedItem.value) {
            this.props.element.showAddressableProperty(selectedItem.value)
          }
        }}>
        {label}
      </MenuItem>
    )
  }

  renderMenuItems (options) {
    return options.map(({label, value, options}) => {
      if (value) {
        return this.renderSingleMenuItem({label, value})
      } else if (options) {
        return (
          <SubMenu title={label} key={label} hoverDelay={0}>
            {this.renderMenuItems(options)}
          </SubMenu>
        )
      }
    })
  }

  renderMenuTrigger () {
    return (
      <div
        className='menu-trigger'
        style={{
          position: 'absolute',
          transform: 'scale(0.75)',
          top: -1,
          left: -1
        }}>
        <CirclePlusSVG color={this.getIconColor()} />
      </div>
    )
  }

  getMenuItemData () {
    return this.props.element.getJITPropertyOptions()
  }

  render () {
    return (
      <div
        className='property-manager'
        style={{
          width: 10,
          position: 'absolute',
          left: 0,
          top: 0
        }}>
        <Menu
          trigger={this.renderMenuTrigger()}
          fixed>
          {this.renderMenuItems(this.getMenuItemData())}
        </Menu>
      </div>
    )
  }
}

PropertyManager.propTypes = {
  element: React.PropTypes.object.isRequired
}
