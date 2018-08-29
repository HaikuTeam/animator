import * as React from 'react';
import * as Radium from 'radium';
import * as Draggable from 'react-draggable';
import zIndex from './styles/zIndex';

const MINIMUM_SIZE = 300;

class PropertiesPanelResizer extends React.PureComponent {
  resize = (mouseEvent, dragData) => {
    if (dragData.x >= MINIMUM_SIZE) {
      this.props.updatePropertiesPanelSize(dragData.x);
    }
  };

  render () {
    const invisibleBorder = '5px solid rgba(255, 255, 255, 0)';
    const visibleBorder = '5px solid rgba(0, 0, 0, 0.15)';

    return (
      <Draggable
        axis={'x'}
        onStop={this.resize}
        position={{x: this.props.propertiesPixelWidth - 3, y: 0}}
        bounds={{left: MINIMUM_SIZE}}
      >
        <span id="properties-panel-resizer" style={{
          display: 'inline-block',
          position: 'fixed',
          height: 'calc(100% - 45px)',
          width: 11,
          zIndex: zIndex.scrollShadow.base,
          top: 0,
          borderRight: invisibleBorder,
          borderLeft: invisibleBorder,
          cursor: 'col-resize',
          margin: '0 -3px',
          backgroundColor: 'rgb(21, 32, 34)',
          backgroundClip: 'padding-box',
          ':hover': {
            borderRight: visibleBorder,
            borderLeft: visibleBorder,
          },
        }} />
      </Draggable>
    );
  }
}

export default Radium(PropertiesPanelResizer);
