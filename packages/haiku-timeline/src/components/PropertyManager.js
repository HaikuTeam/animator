import * as React from 'react';
import Palette from 'haiku-ui-common/lib/Palette';
import PopoverMenu from 'haiku-ui-common/lib/electron/PopoverMenu';

const STYLE = {
  button: {
    color: Palette.PALE_GRAY,
    fontSize: '11px',
    fontFamily: 'inherit',
    cursor: 'pointer',
    borderRadius: 2,
    background: Palette.COAL,
    padding: '1px 10px',
  },
  plus: {
    fontSize: 18,
    lineHeight: 0,
    verticalAlign: 'middle',
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
    const width = 64;
    return (
      <div className="property-manager" style={{
        width,
        textAlign: 'center',
        height: 30,
        paddingTop: 6,
        marginLeft: this.props.timelinePropertiesWidth - width - 9,
      }}>
        <div
          onClick={this.launchMenu}
          style={STYLE.button}
          className="menu-trigger"
          >
          <span style={STYLE.plus}>+</span> ADD
        </div>
      </div>
    );
  }
}

PropertyManager.propTypes = {
  element: React.PropTypes.object.isRequired,
  timelinePropertiesWidth: React.PropTypes.number,
};
