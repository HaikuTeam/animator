import * as React from 'react';
import ClusterRow from './ClusterRow';
import PropertyRow from './PropertyRow';
import ComponentHeadingRow from './ComponentHeadingRow';
import PropertyManager from './PropertyManager';

class RowManager extends React.PureComponent {
  handleUpdate = (what) => {
    if (what === 'row-collapsed' || what === 'row-expanded') {
      this.forceUpdate();
    }
  }

  componentDidMount () {
    this.props.group.rows.forEach((row) => {
      if (row.isHeading() || row.isClusterHeading()) {
        row.on('update', this.handleUpdate);
      }
    });
  }

  componentWillUpdate ({group}) {
    group.rows.forEach((row) => {
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

  renderComponentRow = (row, index, group) => {
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
        (row.isExpanded() && <PropertyManager key={`wereree-${row.getUniqueKey()}`} element={row.element} timelinePropertiesWidth={this.props.timelinePropertiesWidth}/>),
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
