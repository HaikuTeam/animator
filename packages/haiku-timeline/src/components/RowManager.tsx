import * as React from 'react';
import ClusterRow from './ClusterRow';
import ComponentHeadingRow from './ComponentHeadingRow';
import PropertyManager from './PropertyManager';
import PropertyRow from './PropertyRow';

export interface RowManagerProps {
  group: {rows: any[]};
  indexOfGroup: number;
  prevGroup: any;
  rowHeight: number;
  getActiveComponent (): any;
  showEventHandlersEditor (): void;
  onDoubleClickToMoveGauge (): void;
  setEditingRowTitleStatus (): void;
  showBezierEditor (): void;
  timelinePropertiesWidth: number;
}

class RowManager extends React.PureComponent<RowManagerProps> {
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

  render () {
    const elements = this.props.group.rows
      .filter((row) => !row.isWithinCollapsedRow())
      .map(this.renderComponentRow);

    return (
      <div>
        {elements}
      </div>
    );
  }
}

export default RowManager;
