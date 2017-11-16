import React from 'react'
import {
  ContextMenu,
  MenuItem,
  ContextMenuTrigger,
  SubMenu
} from 'react-contextmenu'
import Palette from '../../Palette'
import {DownCarrotSVG} from '../../Icons.js'

const STYLES = {
  selectWrapper: {
    cursor: 'default',
    margin: '25px 0 15px'
  },
  eventsMenuTrigger: {
    fontSize: '12px',
    padding: '5px 13px',
    backgroundColor: '#122022',
    color: Palette.PALE_GRAY,
    borderRadius: '4px',
    display: 'inline-flex',
    alignItems: 'center',

    text: {
      display: 'inline-block',
      marginRight: '5px'
    }
  }
}

class EventSelector extends React.PureComponent {
  renderSingleMenuItem({value, label}) {
    return (
      <MenuItem data={{value}} key={label} onClick={this.props.onEventChange}>
        {label}
      </MenuItem>
    )
  }

  renderMenuItems() {
    this.props.element
      .getApplicableEventHandlerOptionsList()
      .map(({label, options}) => {
        return options.length ? (
          <SubMenu title={label} key={label} hoverDelay={0}>
            {options.map(this.renderSingleMenuItem)}
          </SubMenu>
        ) : (
          this.renderSingleMenuItem({value: label, label})
        )
      })
  }

  render() {
    return (
      <div style={STYLES.selectWrapper}>
        <ContextMenuTrigger id="events-menu" holdToDisplay={0}>
          <div style={STYLES.eventsMenuTrigger}>
            <span style={STYLES.eventsMenuTrigger.text}>
              {this.props.selectedEventName}
            </span>
            <DownCarrotSVG />
          </div>
        </ContextMenuTrigger>

        <ContextMenu id="events-menu">{this.renderMenuItems()}</ContextMenu>
      </div>
    )
  }
}

EventSelector.propTypes = {
  element: React.PropTypes.object.isRequired,
  selectedEventName: React.PropTypes.string.isRequired,
  onEventChange: React.PropTypes.func.isRequired
}

export default EventSelector
