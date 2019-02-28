import PopoverMenu from 'haiku-ui-common/lib/electron/PopoverMenu';
import Globals from 'haiku-ui-common/lib/Globals';
import Palette from 'haiku-ui-common/lib/Palette';
import RightCarrotSVG from 'haiku-ui-common/lib/react/icons/RightCarrotSVG';
import * as React from 'react';
import ClusterInputField from './ClusterInputField';
import ClusterRowHeading from './ClusterRowHeading';
import RowSegments from './RowSegments';
import zIndex from './styles/zIndex';

export interface ClusterRowProps {
  row: any;
  timeline: any;
  showBezierEditor (): void;
  component: any;
  rowHeight: number;
}

export default class ClusterRow extends React.Component<ClusterRowProps> {
  expandAndSelect = () => {
    this.props.row.expandAndSelect({from: 'timeline'});
  };

  onContextMenu = (ctxMenuEvent: React.MouseEvent<any>) => {
    ctxMenuEvent.stopPropagation();

    PopoverMenu.emit('show', {
      type: 'cluster-row',
      event: {offsetX: 0},
      model: this.props.row,
      offset: Globals.mouse.x - this.props.timeline.getPropertiesPixelWidth(),
    });
  };

  render () {
    const componentId = this.props.row.element.getComponentId();
    const clusterName = this.props.row.getClusterNameString();

    return (
      <div
        id={`property-cluster-row-${this.props.row.getAddress()}-${componentId}-${clusterName}`}
        className="property-cluster-row"
        onClick={this.expandAndSelect}
        onContextMenu={this.onContextMenu}
        style={{
          height: this.props.rowHeight,
          left: 0,
          opacity: this.props.row.isHidden() ? 0.5 : 1.0,
          position: 'relative',
          cursor: 'pointer',
        }}
      >
        <div
          style={{
            position: 'sticky',
            top: 0,
            left: 0,
            width: this.props.timeline.getPropertiesPixelWidth(),
            zIndex: zIndex.clusterRowHeading.base,
            backgroundColor: Palette.GRAY,
          }}
        >
          <div>
            <div
              style={{
                position: 'absolute',
                right: 145,
                width: 10,
                height: 'inherit',
                zIndex: 1005,
              }}
            >
              <span className="utf-icon" style={{top: -2, left: -3}}>
                <RightCarrotSVG />
              </span>
            </div>
            <div
              className="property-cluster-row-label no-select"
              style={{
                position: 'absolute',
                width: this.props.timeline.getPropertiesPixelWidth() - 80,
                height: this.props.rowHeight,
                paddingTop: 3,
                paddingRight: 10,
                backgroundColor: Palette.GRAY,
                zIndex: 1004,
                textAlign: 'right',
              }}
            >
              <ClusterRowHeading clusterName={clusterName} row={this.props.row} />
            </div>
          </div>
          <div
            className="property-cluster-input-field"
            style={{
              position: 'absolute',
              left: this.props.timeline.getPropertiesPixelWidth() - 82,
              width: 82,
              top: 0,
              height: 24,
              textAlign: 'left',
            }}
          >
            <ClusterInputField
              parent={this}
              row={this.props.row}
              index={this.props.row.getAddress()}
              height={this.props.rowHeight}
              component={this.props.component}
              timeline={this.props.timeline}
              rowHeight={this.props.rowHeight}
            />
          </div>
        </div>
        <div
          className="property-cluster-timeline-segments-box"
          style={{
            position: 'absolute',
            left: this.props.timeline.getPropertiesPixelWidth() + 1,
            top: 0,
            height: 'inherit',
            zIndex: zIndex.clusterRow.base,
          }}
        >
          <RowSegments
            scope="ClusterRow"
            includeDraggables={false}
            preventDragging={true}
            showBezierEditor={this.props.showBezierEditor}
            row={this.props.row}
            component={this.props.component}
            timeline={this.props.timeline}
            rowHeight={this.props.rowHeight}
          />
        </div>
      </div>
    );
  }
}
