import * as React from 'react';
import RowManager from './RowManager';

export interface ComponentRowsProps {
  getActiveComponent (): any;
  rowHeight: number;
  mixpanel: any;
  showEventHandlersEditor (): void;
  onDoubleClickToMoveGauge (): void;
  setEditingRowTitleStatus (): void;
  showBezierEditor (): void;
}

export default class ComponentRows extends React.PureComponent<ComponentRowsProps> {
  onDragOver = () => {
    this.forceUpdate();
  };

  render () {
    const activeComponent = this.props.getActiveComponent();
    const groups = activeComponent.getDisplayableRowsGroupedByElementInZOrder();

    return (
      <div>
        {groups.map((group: any, indexOfGroup: number) => (
          <RowManager
            key={`property-row-group-${group.id}-${indexOfGroup}`}
            group={group}
            indexOfGroup={indexOfGroup}
            rowHeight={this.props.rowHeight}
            getActiveComponent={this.props.getActiveComponent}
            mixpanel={this.props.mixpanel}
            reflection={groups.length - indexOfGroup - 1}
            showEventHandlersEditor={this.props.showEventHandlersEditor}
            onDragOverCallback={this.onDragOver}
            onDoubleClickToMoveGauge={this.props.onDoubleClickToMoveGauge}
            setEditingRowTitleStatus={this.props.setEditingRowTitleStatus}
            showBezierEditor={this.props.showBezierEditor}
            timelinePropertiesWidth={activeComponent.getCurrentTimeline().getPropertiesPixelWidth()}
          />
        ))}
      </div>
    );
  }
}
