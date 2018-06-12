import * as React from 'react';
import * as Radium from 'radium';
import * as Draggable from 'react-draggable';

const STYLE = {
  wrapper: {
    display: 'flex',
    height: '100%',
    outline: 'none',
    overflow: 'hidden',
    userSelect: 'text',
    vertical: {
      flexDirection: 'row',
      left: 0,
      right: 0,
    },
    horizontal: {
      bottom: 0,
      flexDirection: 'column',
      minHeight: '100%',
      top: 0,
      width: '100%',
    },
  },
  resizer: {
    position: 'absolute',
    backgroundColor: 'rgb(21, 32, 34)',
    opacity: '1',
    zIndex: '5',
    boxSizing: 'border-box',
    backgroundClip: 'padding-box',
    ':hover': {
      transition: 'all 220ms ease',
    },
  },
  pane: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
};

class SplitPanel extends React.PureComponent {
  constructor (props) {
    super();

    this.state = {
      minSize: props.minSize,
      defaultSize: props.defaultSize,
    };
  }

  isVertical () {
    return this.props.split === 'vertical';
  }

  resize (mouseEvent) {
    const defaultSize = this.isVertical() ? mouseEvent.x : mouseEvent.y;

    this.setState({defaultSize});
  }

  render () {
    const invisibleBorder = '5px solid rgba(255, 255, 255, 0)';
    const visibleBorder = '5px solid rgba(0, 0, 0, 0.15)';

    let axis;
    let paneStyle;
    let resizerStyle;

    if (this.isVertical()) {
      axis = 'x';
      paneStyle = {minWidth: this.state.minSize, width: this.state.defaultSize};
      resizerStyle = {
        width: '11px',
        height: '100%',
        cursor: 'col-resize',
        borderRight: invisibleBorder,
        borderLeft: invisibleBorder,
        top: 0,
        right: 0,
        margin: '0 -6px',
        ':hover': {
          borderRight: visibleBorder,
          borderLeft: visibleBorder,
        },
      };
    } else {
      axis = 'y';
      paneStyle = {
        minHeight: this.state.minSize,
        height: this.state.defaultSize,
      };
      resizerStyle = {
        height: '11px',
        width: '100%',
        cursor: 'row-resize',
        borderTop: invisibleBorder,
        borderBottom: invisibleBorder,
        bottom: 0,
        left: 0,
        margin: '-6px 0',
        ':hover': {
          borderTop: visibleBorder,
          borderBottom: visibleBorder,
        },
      };
    }

    return (
      <div style={{...STYLE.wrapper, ...STYLE.wrapper[this.props.split]}}>
        <div style={{...STYLE.pane, ...paneStyle}}>
          {this.props.children[0]}
          <Draggable
            axis={axis}
            onStop={(mouseEvent) => {
              this.resize(mouseEvent);
            }}
            position={{x: 0, y: 0}}
          >
            <span style={{...STYLE.resizer, ...resizerStyle}} />
          </Draggable>
        </div>
        <div style={{
          flexGrow: 2,
          // FIXME: horrible hack to force reflow when resizing the panel, seems
          // to be a chrome bug with this particular combo of flexbox + changing
          // size
          height: this.isVertical() ? '' : Math.random(),
        }}>
          {this.props.children[1]}
        </div>
      </div>
    );
  }
}

SplitPanel.propTypes = {
  split: React.PropTypes.string,
};

SplitPanel.defaultProps = {
  split: 'horizontal',
};

export default Radium(SplitPanel);
