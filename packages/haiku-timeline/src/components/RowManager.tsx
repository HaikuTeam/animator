// @ts-ignore
import * as logger from 'haiku-serialization/src/utils/LoggerInstance';
import Palette from 'haiku-ui-common/lib/Palette';
import lodash = require('lodash');
import * as React from 'react';
import ClusterRow from './ClusterRow';
import ComponentHeadingRow from './ComponentHeadingRow';
import PropertyManager from './PropertyManager';
import PropertyRow from './PropertyRow';

export interface RowManagerProps {
  group: {rows: any[]};
  indexOfGroup: number;
  rowHeight: number;
  getActiveComponent (): any;
  showEventHandlersEditor (): void;
  onDoubleClickToMoveGauge (): void;
  setEditingRowTitleStatus (): void;
  showBezierEditor (): void;
  onDragOverCallback (): void;
  timelinePropertiesWidth: number;
  reflection: number;
  mixpanel: any;
}

class RowManager extends React.PureComponent<RowManagerProps> {
  private timelineViewport: HTMLElement;

  handleUpdate = (what: string) => {
    if (what === 'row-collapsed' || what === 'row-expanded') {
      this.forceUpdate();
    }
  };

  componentDidMount () {
    this.timelineViewport = document.getElementById('timeline');
    this.props.group.rows.forEach((row) => {
      if (row.isHeading() || row.isClusterHeading()) {
        row.on('update', this.handleUpdate);
      }
    });
  }

  componentWillUpdate ({group}: RowManagerProps) {
    group.rows.forEach((row: any) => {
      if (row.isHeading() || row.isClusterHeading()) {
        // In case we already had a bound listener, remove it.
        row.removeListener('update', this.handleUpdate);
        row.on('update', this.handleUpdate);
      }
    });
  }

  componentWillUnmount () {
    this.props.group.rows.forEach((row) => {
      if (row.isHeading() || row.isClusterHeading()) {
        row.removeListener('update', this.handleUpdate);
      }
    });
  }

  renderComponentRow = (row: any, index: number, group: any) => {
    // Cluster rows only display if collapsed, otherwise we show their properties
    const activeComponent = this.props.getActiveComponent();
    if (row.isClusterHeading() && !row.isExpanded()) {
      return (
        <ClusterRow
          key={row.getUniqueKey()}
          rowHeight={this.props.rowHeight}
          timeline={activeComponent.getCurrentTimeline()}
          component={activeComponent}
          showBezierEditor={this.props.showBezierEditor}
          row={row}
        />
      );
    }

    if (row.isProperty()) {
      return (
        <PropertyRow
          onDoubleClickToMoveGauge={this.props.onDoubleClickToMoveGauge}
          key={row.getUniqueKey()}
          rowHeight={this.props.rowHeight}
          timeline={activeComponent.getCurrentTimeline()}
          component={activeComponent}
          prev={group[index - 1]}
          next={group[index + 1]}
          row={row}
          showBezierEditor={this.props.showBezierEditor}
        />
      );
    }

    if (row.isHeading()) {
      return [
        (
          <ComponentHeadingRow
            key={row.getUniqueKey()}
            rowHeight={this.props.rowHeight}
            timeline={activeComponent.getCurrentTimeline()}
            component={activeComponent}
            row={row}
            onEventHandlerTriggered={this.props.showEventHandlersEditor}
            isExpanded={row.isExpanded()}
            isHidden={row.isHidden()}
            isSelected={row.isSelected()}
            hasAttachedActions={row.element.getVisibleEvents().length > 0}
            setEditingRowTitleStatus={this.props.setEditingRowTitleStatus}
            timelinePropertiesWidth={this.props.timelinePropertiesWidth}
          />
        ),
        (
          row.isExpanded() &&
          (
            <PropertyManager
              key={`property-manager-child-${row.getUniqueKey()}`}
              element={row.element}
              timelinePropertiesWidth={this.props.timelinePropertiesWidth}
            />
          )
        ),
      ];
    }

    // If we got here, display nothing since we don't know what to render
    return null;
  };

  onDragEnter = (event: React.DragEvent<any>) => {
    event.preventDefault();
    this.setState({canReceiveDrag: true});
  };

  adjustViewportScroll = lodash.throttle((y: number) => {
    if (y < 105) {
      this.timelineViewport.scrollBy({
        top: -65,
        behavior: 'smooth',
      });
    } else if (window.innerHeight - y < 105) {
      this.timelineViewport.scrollBy({
        top: 65,
        behavior: 'smooth',
      });
    }
  }, 60);

  onDragOver = (event: React.DragEvent<any>) => {
    event.preventDefault();
    this.adjustViewportScroll(event.nativeEvent.y);
  };

  onDrop = (event: React.DragEvent<any>) => {
    const componentId = event.dataTransfer.getData('componentId');
    const activeComponent = this.props.getActiveComponent();

    logger.info(`z-drop ${componentId} at`, this.props.reflection);
    this.props.mixpanel.haikuTrack('creator:timeline:z-shift');

    activeComponent.zShiftIndices(
      componentId,
      activeComponent.getInstantiationTimelineName(),
      activeComponent.getInstantiationTimelineTime(),
      this.props.reflection - 1,
      {from: 'timeline'},
      this.props.onDragOverCallback,
    );

    this.setState({canReceiveDrag: false});
    document.body.classList.remove('dragging');
  };

  onDragLeave = () => {
    this.setState({canReceiveDrag: false});
  };

  state = {
    canReceiveDrag: false,
  };

  render () {
    const elements = this.props.group.rows
      .filter((row) => !row.isWithinCollapsedRow())
      .map(this.renderComponentRow);

    return (
      <div
        className="row-manager"
        style={{
          borderBottom: this.state.canReceiveDrag ? `4px solid ${Palette.PINK}` : 'none',
        }}
        onDragOver={this.onDragOver}
        onDragEnter={this.onDragEnter}
        onDragLeave={this.onDragLeave}
        onDrop={this.onDrop}
      >
        {elements}
      </div>
    );
  }
}

export default RowManager;
