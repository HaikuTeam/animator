import * as React from 'react';
import {SimpleSelect} from 'react-selectize';
import Palette from 'haiku-ui-common/lib/Palette';

const STYLES = {
  selectWrapper: {
    cursor: 'default',
    margin: '0 0 15px',
    display: 'inline-block',
    width: '100%',
  },
};

class EventSelector extends React.Component {
  onValueChange = (selected) => {
    if (selected) {
      this.props.onChange(selected.value);
    }
  };

  createFromSearch = (options, search) => {
    return {label: search, value: search, groupId: 'Custom Events'};
  };

  optionToLabel (option) {
    let label = option.label;

    if (option.newOption) {
      if (option.label) {
        label = `Add '${option.label}'`;
      } else {
        label = 'To add a custom event, type anything and press Enter';
      }
    }

    return label;
  }

  renderOption = (item) => {
    return (
      <div
        className="simple-option"
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {this.optionToLabel(item)}
      </div>
    );
  };

  render () {
    const groups = [];
    const select = [];

    this.props.options.forEach(({label, options}) => {
      groups.push({groupId: label, title: label});
      options.forEach((option) => {
        select.push({groupId: label, ...option});
      });
    });

    return (
      <div style={STYLES.selectWrapper}>
        <style>
          {`
          .react-selectize.root-node,
          .dropdown-menu.tethered {
            width: 568px;
          }

          .react-selectize.default {
            font-family: inherit;
            color: ${Palette.SUNSTONE};
          }

          .simple-select.react-selectize.default.root-node:not(.open).react-selectize-control,
          .simple-select.react-selectize.default.root-node:not(.open) .react-selectize-control,
          .simple-select.react-selectize.default.root-node.open .react-selectize-control,
          .react-selectize.dropdown-menu.default {
            background: ${Palette.DARKEST_COAL};
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
            background: ${Palette.SPECIAL_COAL};
            text-transform: uppercase;
            font-weight: bold;
          }

          .react-selectize.root-node .react-selectize-control .react-selectize-reset-button-container,
          .react-selectize.root-node .react-selectize-control .react-selectize-toggle-button-container {
            display: none;
          }

          .tether-element {
            z-index: 999999;
          }
        `}
        </style>

        <SimpleSelect
          groups={groups}
          options={select}
          hideResetButton={true}
          placeholder={'Add a new Action'}
          createFromSearch={this.createFromSearch}
          value={null}
          onValueChange={this.onValueChange}
          onFocus={this.props.onFocus}
          onBlur={this.props.onBlur}
          renderOption={this.renderOption}
        />
      </div>
    );
  }
}

EventSelector.propTypes = {
  onChange: React.PropTypes.func.isRequired,
  defaultEventName: React.PropTypes.string,
  options: React.PropTypes.array.isRequired,
  disabledOptions: React.PropTypes.object.isRequired,
};

export default EventSelector;
