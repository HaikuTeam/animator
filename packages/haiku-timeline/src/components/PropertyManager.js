import * as React from 'react';
import Palette from 'haiku-ui-common/lib/Palette';
import PopoverMenu from 'haiku-ui-common/lib/electron/PopoverMenu';

const STYLE = {
  button: {
    color: Palette.PALE_GRAY,
    fontSize: '11px',
    fontFamily: 'inherit',
    cursor: 'pointer',
    borderRadius: '2px',
    background: Palette.DARK_GRAY,
    padding: '2px 10px',
  },
};

export default class PropertyManager extends React.Component {
  constructor (props) {
    super(props);
    this.launchMenu = this.launchMenu.bind(this);
  }

  launchMenu (event) {
    const items = this.props.element.getJITPropertyOptionsAsMenuItems();

    PopoverMenu.launch({
      event,
      items,
    });
  }

  render () {
    const width = 60;
    return (
      <div className="property-manager" style={{
        width,
        textAlign: 'center',
        height: 30,
        paddingTop: 4,
        marginLeft: this.props.timelinePropertiesWidth - width - 5,
      }}>
        <div
          onClick={this.launchMenu}
          style={STYLE.button}
          className="menu-trigger"
          >
          + ADD
        </div>
      </div>
    );
  }
}

PropertyManager.propTypes = {
  element: React.PropTypes.object.isRequired,
  timelinePropertiesWidth: React.PropTypes.number,
};
