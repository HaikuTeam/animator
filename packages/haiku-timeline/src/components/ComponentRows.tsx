import Palette from 'haiku-ui-common/lib/Palette';
import {throttle} from 'lodash';
import * as React from 'react';
import RowManager from './RowManager';

export interface ComponentRowsProps {
  rowHeight: number;
  propertiesPixelWidth: number;
  mixpanel: any;
  getActiveComponent (): any;
  showEventHandlersEditor (): void;
  onDoubleClickToMoveGauge (): void;
  setEditingRowTitleStatus (): void;
  showBezierEditor (): void;
}

export default class ComponentRows extends React.Component<ComponentRowsProps> {
  private timelineViewport: HTMLElement;

  state = {
    forceCollapse: false,
    currentDraggingComponent: '',
  };

  componentDidMount () {
    this.timelineViewport = document.getElementById('timeline');
  }

  enterDragState = (componentID: string) => {
    this.setState({forceCollapse: true, currentDraggingComponent: componentID});
  };

  leaveDragState = () => {
    this.setState({forceCollapse: false, currentDraggingComponent: ''});
  };

  onDragOver = (event: React.DragEvent<any>) => {
    this.adjustViewportScroll(event.nativeEvent.y);
  };

  adjustViewportScroll = throttle((y: number) => {
    let top = 0;
    const threshold = this.props.rowHeight * 3;

    if (y < threshold) {
      top = -threshold;
    } else if (window.innerHeight + window.scrollY - y < threshold) {
      top = threshold;
    }

    this.timelineViewport.scrollBy({
      top,
      behavior: 'smooth',
    });
  }, 60);

  render () {
    const activeComponent = this.props.getActiveComponent();
    const groups = activeComponent.getDisplayableRowsGroupedByElementInZOrder();

    return (
      <div onDragOver={this.onDragOver} onDragEnd={this.leaveDragState}>
        <style>
          {`
            .row-manager-receiving-drag::before {
              content: '';
              width: ${this.props.propertiesPixelWidth}px;
              height: 3px;
              background-color: ${Palette.LIGHTEST_PINK};
              display: inline-block;
              position: absolute;
              z-index: 999;
              bottom: 0;
            }
          `}
        </style>
        {groups.map((group: any, indexOfGroup: number) => (
          <RowManager
            key={`property-row-group-${group.id}-${indexOfGroup}`}
            group={group}
            rowHeight={this.props.rowHeight}
            getActiveComponent={this.props.getActiveComponent}
            mixpanel={this.props.mixpanel}
            reflection={Math.max(0, (groups.length - 2) - indexOfGroup)}
            showEventHandlersEditor={this.props.showEventHandlersEditor}
            onDragStart={this.enterDragState}
            onDrop={this.leaveDragState}
            forceCollapse={this.state.forceCollapse}
            onDoubleClickToMoveGauge={this.props.onDoubleClickToMoveGauge}
            setEditingRowTitleStatus={this.props.setEditingRowTitleStatus}
            showBezierEditor={this.props.showBezierEditor}
            currentDraggingComponent={this.state.currentDraggingComponent}
            timelinePropertiesWidth={this.props.propertiesPixelWidth}
          />
        ))}
      </div>
    );
  }
}
