import React from 'react'
import {SimpleSelect} from 'react-selectize'
import Palette from 'haiku-ui-common/lib/Palette'

const STYLES = {
  selectWrapper: {
    cursor: 'default',
    margin: '0 0 15px',
    display: 'inline-block'
  }
}

class EventSelector extends React.Component {
  render () {
    const groups = []
    const select = []
    let selected

    this.props.options.forEach(({label, options}) => {
      groups.push({groupId: label, title: label})
      options.forEach((option) => {
        select.push({groupId: label, ...option})
      })
    })

    selected = select.find(({value}) => value === this.props.defaultEventName)

    return (
      <div style={STYLES.selectWrapper}>
        <style>
          {`
          .react-selectize.root-node {
            width: 150px;
          }

          .react-selectize.default {
            font-family: inherit;
            color: ${Palette.SUNSTONE};
          }

          .simple-select.react-selectize.default.root-node:not(.open).react-selectize-control,
          .simple-select.react-selectize.default.root-node:not(.open) .react-selectize-control,
          .simple-select.react-selectize.default.root-node.open .react-selectize-control,
          .react-selectize.dropdown-menu.default {
            background: ${Palette.SPECIAL_COAL};
            border: none;
          }

          .react-selectize.dropdown-menu.default .option-wrapper .simple-option,
          .resizable-input {
            color: inherit;
          }

          .react-selectize.dropdown-menu.default .option-wrapper.highlight {
            color: inherit;
            background: black;
          }

          .react-selectize.dropdown-menu.default .simple-group-title {
            background: ${Palette.DARKEST_COAL};
            text-transform: uppercase;
            font-weight: bold;
          }

          .react-selectize.root-node .react-selectize-control .react-selectize-toggle-button path {
            fill: #778487;
          }

          .react-selectize.root-node .react-selectize-control .react-selectize-reset-button-container {
            display: none;
          }
        `}
        </style>

        <SimpleSelect
          groups={groups}
          options={select}
          createFromSearch={(options, search) => {
            return {label: search, value: search, groupId: 'Custom Events'}
          }}
          onValueChange={(selected) => {
            if (selected) {
              this.props.onChange(selected.value)
            }
          }}
          defaultValue={selected}
        />
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
