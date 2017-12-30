import React from 'react'
import CirclePlusSVG from 'haiku-ui-common/lib/react/icons/CirclePlusSVG'
import Palette from 'haiku-ui-common/lib/Palette'
import PopoverMenu from 'haiku-ui-common/lib/electron/PopoverMenu'

export default class PropertyManager extends React.Component {
  constructor (props) {
    super(props)
    this.launchMenu = this.launchMenu.bind(this)
  }

  getIconColor () {
    return Palette.DARK_ROCK
  }

  launchMenu (event) {
    const items = this.props.element.getJitPropertyOptionsAsMenuItems()

    PopoverMenu.launch({
      event,
      items
    })
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
        <div
          onClick={this.launchMenu}
          className='menu-trigger'
          style={{
            position: 'absolute',
            transform: 'scale(0.75)',
            top: -1,
            left: -1
          }}>
          <CirclePlusSVG
            color={this.getIconColor()} />
        </div>
      </div>
    )
  }
}

PropertyManager.propTypes = {
  element: React.PropTypes.object.isRequired
}
