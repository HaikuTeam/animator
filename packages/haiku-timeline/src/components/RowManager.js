import * as React from 'react';
import ClusterRow from './ClusterRow';
import PropertyRow from './PropertyRow';
import ComponentHeadingRow from './ComponentHeadingRow';

class RowManager extends React.PureComponent {
  constructor (props) {
    super(props);

    this.handleUpdate = this.handleUpdate.bind(this);
  }

  handleUpdate (what) {
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

  componentWillUnmount () {
    this.props.group.rows.forEach((row) => {
      if (row.isHeading() || row.isClusterHeading()) {
        row.removeListener('update', this.handleUpdate);
      }
    });
  }

  renderComponentRow (row, prev) {
    // Cluster rows only display if collapsed, otherwise we show their properties
    const activeComponent = this.props.getActiveComponent();

    if (row.isClusterHeading() && !row.isExpanded()) {
      return (
        <ClusterRow
          key={row.getUniqueKey()}
          rowHeight={this.props.rowHeight}
          timeline={activeComponent.getCurrentTimeline()}
          component={activeComponent}
          prev={prev}
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
          prev={prev}
          row={row}
        />
      );
    }

    if (row.isHeading()) {
      return (
        <ComponentHeadingRow
          key={row.getUniqueKey()}
          rowHeight={this.props.rowHeight}
          timeline={activeComponent.getCurrentTimeline()}
          component={activeComponent}
          row={row}
          prev={prev}
          onEventHandlerTriggered={this.props.showEventHandlersEditor}
          isExpanded={row.isExpanded()}
          isHidden={row.isHidden()}
          isSelected={row.isSelected()}
          hasAttachedActions={row.element.getVisibleEvents().length > 0}
          dragHandleProps={this.props.dragHandleProps}
        />
      );
    }

    // If we got here, display nothing since we don't know what to render
    return null;
  }

  render () {
    const {group, prevGroup} = this.props;

    const elements = group.rows
      .filter((row) => !row.isWithinCollapsedRow())
      .map((row, indexOfRowWithinGroup) => {
        let prevRow = group.rows[indexOfRowWithinGroup - 1];

        if (!prevRow && prevGroup) {
          prevRow = prevGroup.rows[prevGroup.length - 1];
        }

        return this.renderComponentRow(row, Boolean(prevRow));
      });

    return <div>{elements}</div>;
  }
}

export default RowManager;
