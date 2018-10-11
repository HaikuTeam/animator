import * as React from 'react';
import ClusterRow from './ClusterRow';
import PropertyRow from './PropertyRow';
import ComponentHeadingRow from './ComponentHeadingRow';
import Palette from 'haiku-ui-common/lib/Palette';

const STYLE = {
  headingGroup: {
    position: 'sticky',
    left: 0,
    backgroundColor: Palette.GRAY,
    clear: 'both',
  },
};

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

  renderComponentRow (row) {
    // Cluster rows only display if collapsed, otherwise we show their properties
    const activeComponent = this.props.getActiveComponent();
    if (row.isClusterHeading() && !row.isExpanded()) {
      return (
        <ClusterRow
          key={row.getUniqueKey()}
          rowHeight={this.props.rowHeight}
          timeline={activeComponent.getCurrentTimeline()}
          component={activeComponent}
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
          onEventHandlerTriggered={this.props.showEventHandlersEditor}
          isExpanded={row.isExpanded()}
          isHidden={row.isHidden()}
          isSelected={row.isSelected()}
          hasAttachedActions={row.element.getVisibleEvents().length > 0}
          dragHandleProps={this.props.dragHandleProps}
          setEditingRowTitleStatus={this.props.setEditingRowTitleStatus}
          timelinePropertiesWidth={this.props.timelinePropertiesWidth}
        />
      );
    }

    // If we got here, display nothing since we don't know what to render
    return null;
  }

  render () {
    let currentElementRows = [];

    const elements = this.props.group.rows
      .filter((row) => !row.isWithinCollapsedRow())
      .reduce((acc, row, idx, src) => {
        // console.log('row.element.getTitle()', row.element.getTitle(), row.isClusterHeading(), row.isHeading());
        if (row.isHeading()) {
          // console.log('pushing and cleaning');
          acc.push(<div style={STYLE.headingGroup} key={Math.random()}>{currentElementRows.slice(0)}</div>);
          currentElementRows = [];
        }

        // console.log('pushing');
        currentElementRows.push(this.renderComponentRow(row));

        if (idx === src.length - 1) {
          console.log('asdf');
          acc.push(<div style={STYLE.headingGroup} key={Math.random()}>{currentElementRows.slice(0)}</div>);
        }

        return acc;
      }, []);
    console.log(elements);
    return (
      <div>
        {elements}
      </div>
    );
  }
}

export default RowManager;
