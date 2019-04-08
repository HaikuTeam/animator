// @ts-ignore
import * as logger from 'haiku-serialization/src/utils/LoggerInstance';
import * as React from 'react';
import ClusterRow from './ClusterRow';
import ComponentHeadingRow from './ComponentHeadingRow';
import PropertyManager from './PropertyManager';
import PropertyRow from './PropertyRow';

export interface RowManagerProps {
  group: {rows: any[]};
  rowHeight: number;
  getActiveComponent (): any;
  showEventHandlersEditor (): void;
  onDoubleClickToMoveGauge (): void;
  setEditingRowTitleStatus (): void;
  showBezierEditor (): void;
  onDrop (): void;
  timelinePropertiesWidth: number;
  reflection: number;
  mixpanel: any;
  forceCollapse: boolean;
  currentDraggingComponent: string;
  onDragStart (componentId: string): void;
}

class RowManager extends React.PureComponent<RowManagerProps> {
  state = {
    canReceiveDrag: false,
  };

  handleUpdate = (what: string) => {
    if (what === 'row-collapsed' || what === 'row-expanded') {
      this.forceUpdate();
    }
  };

  componentDidMount () {
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
            isExpanded={
              (row.isRootRow() && this.props.forceCollapse) || (!this.props.forceCollapse && row.isExpanded())
            }
            isHidden={row.isHidden()}
            isSelected={row.isSelected()}
            hasAttachedActions={row.element.getVisibleEvents().length > 0}
            setEditingRowTitleStatus={this.props.setEditingRowTitleStatus}
            timelinePropertiesWidth={this.props.timelinePropertiesWidth}
            onDragStart={this.props.onDragStart}
          />
        ),
        (
          (!this.props.forceCollapse || row.isRootRow()) && row.isExpanded() &&
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
    if (
      this.props.group.rows[0] &&
      this.props.group.rows[0].element.getComponentId() !== this.props.currentDraggingComponent
      ) {
      event.preventDefault();
      this.setState({canReceiveDrag: true});
    }
  };

  onDragOver = (event: React.DragEvent<any>) => {
    event.preventDefault();
  };

  onDrop = (event: React.DragEvent<any>) => {
    const activeComponent = this.props.getActiveComponent();

    logger.info(`z-drop ${this.props.currentDraggingComponent} at`, this.props.reflection);
    this.props.mixpanel.haikuTrack('creator:timeline:z-shift');

    activeComponent.zShiftIndices(
      this.props.currentDraggingComponent,
      activeComponent.getInstantiationTimelineName(),
      activeComponent.getInstantiationTimelineTime(),
      this.props.reflection,
      {from: 'timeline'},
      this.props.onDrop,
    );

    this.setState({canReceiveDrag: false});
    document.body.classList.remove('dragging');
  };

  onDragLeave = () => {
    this.setState({canReceiveDrag: false});
  };

  getElements () {
    if (this.props.forceCollapse) {
      return this.props.group.rows
        .filter((row) => (row.isHeading() && !row.isWithinCollapsedRow()) || row.parent.isRootRow())
        .map(this.renderComponentRow);
    }

    return this.props.group.rows
      .filter((row) => !row.isWithinCollapsedRow())
      .map(this.renderComponentRow);
  }

  render () {
    const elements = this.getElements();

    return (
      <div
        className={`no-select-children row-manager ${this.state.canReceiveDrag ? 'row-manager-receiving-drag' : ''}`}
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
