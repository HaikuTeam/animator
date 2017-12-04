import React from 'react'
import {Menu, MenuItem, SubMenu} from '../../Menu'
import Palette from '../../Palette'
import {DownCarrotSVG} from '../../Icons.js'

const STYLES = {
  selectWrapper: {
    cursor: 'default',
    margin: '0 0 15px',
    display: 'inline-block'
  },
  eventsMenuTrigger: {
    fontSize: '12px',
    padding: '5px 13px',
    backgroundColor: Palette.SPECIAL_COAL,
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

class EventSelector extends React.Component {
  constructor (props) {
    super(props)

    this.itemMappings = {}

    this.state = {
      selectedEventName: props.defaultEventName
    }
  }

  renderSingleMenuItem ({value, label}) {
    const isDisabled = this.props.disabledOptions.has(value)
    this.itemMappings[value] = label

    return (
      <MenuItem
        data={{value}}
        key={label}
        disabled={isDisabled}
        onClick={(_event, selectedItem) => {
          const selectedEventName = selectedItem.value
          this.setState({selectedEventName})
          this.props.onChange(selectedEventName)
        }}
      >
        {label}
      </MenuItem>
    )
  }

  renderMenuItems () {
    return this.props.options.map(({label, options}) =>
      <SubMenu title={label} key={label} hoverDelay={0}>
        {options.map(item => this.renderSingleMenuItem(item))}
      </SubMenu>
    )
  }

  renderMenuTrigger () {
    return (
      <div style={STYLES.eventsMenuTrigger}>
        <span style={STYLES.eventsMenuTrigger.text}>
          {this.itemMappings[this.state.selectedEventName]}
        </span>
        <DownCarrotSVG />
      </div>
    )
  }

  render () {
    return (
      <div style={STYLES.selectWrapper}>
        <Menu
          trigger={this.renderMenuTrigger()}
          fixed
        >
          {this.renderMenuItems()}
        </Menu>
      </div>
    )
  }
}

EventSelector.propTypes = {
  onChange: React.PropTypes.func.isRequired,
  defaultEventName: React.PropTypes.string,
  options: React.PropTypes.array.isRequired,
  disabledOptions: React.PropTypes.object.isRequired
}

export default EventSelector
