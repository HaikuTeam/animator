import PopoverMenu from 'haiku-ui-common/lib/electron/PopoverMenu';
import Palette from 'haiku-ui-common/lib/Palette';
import * as React from 'react';
import zIndex from './styles/zIndex';

const STYLE = {
  button: {
    color: Palette.PALE_GRAY,
    fontSize: '11px',
    fontFamily: 'inherit',
    cursor: 'pointer',
    borderRadius: 2,
    background: Palette.COAL,
    padding: '1px 14px',
    display: 'inline-block',
    float: 'right',
    marginRight: 11,
    userSelect: 'none',
  },
  plus: {
    fontSize: 18,
    lineHeight: 0,
    verticalAlign: 'middle',
  },
};

export interface PropertyManagerProps {
  element: any;
  timelinePropertiesWidth: number;
}

export default class PropertyManager extends React.Component<PropertyManagerProps> {
  launchMenu = (event: React.MouseEvent<any>) => {
    PopoverMenu.launch({
      items: this.props.element.getJITPropertyOptionsAsMenuItems(),
    });
  };

  render () {
    return (
      <div
        className="property-manager"
        style={{
          width: this.props.timelinePropertiesWidth,
          textAlign: 'center',
          height: 30,
          paddingTop: 6,
          position: 'sticky',
          zIndex: zIndex.addButton.base,
          background: Palette.GRAY,
          left: 0,
        }}
      >
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
