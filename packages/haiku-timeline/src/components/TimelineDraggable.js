import * as React from 'react';
import {DraggableCore} from 'react-draggable';

/**
 * A wraper class for DraggableCore, with common functionality used to:
 *
 * - Check if the element was dragged or not, _we cannot rely on
 * `dragData.deltaX`_ as it always is 0
 * - Keep track of the mouse event on mousedown
 */
class TimelineDraggable extends React.PureComponent {
  constructor (props) {
    super(props);

    this.lastDragData = {x: 0};
    this.lastMouseButtonPressed = null;
  }

  callIfFunction (func, ...args) {
    if (typeof this.props[func] === 'function') {
      this.props[func](...args);
    }
  }

  render () {
    return (
      <DraggableCore
        id={this.props.id}
        disabled={this.props.disabled}
        axis={this.props.axis}
        onStart={(dragEvent, dragData) => {
          this.callIfFunction('onStart', dragEvent, dragData);
          this.lastDragData = dragData;
        }}
        onStop={(dragEvent, dragData) => {
          const wasDrag = dragData.x !== this.lastDragData.x;
          this.lastDragData = dragData;
          this.callIfFunction(
            'onStop',
            dragEvent,
            dragData,
            wasDrag,
            this.lastMouseButtonPressed,
          );
        }}
        onDrag={(...args) => {
          this.callIfFunction('onDrag', ...args);
        }}
        onMouseDown={(mouseEvent) => {
          mouseEvent.stopPropagation();
          this.lastMouseButtonPressed = mouseEvent.nativeEvent.which;
          this.callIfFunction('onMouseDown', mouseEvent);
        }}
      >
        {this.props.children}
      </DraggableCore>
    );
  }
}

export default TimelineDraggable;
