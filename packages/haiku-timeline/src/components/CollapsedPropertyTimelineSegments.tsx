import Palette from 'haiku-ui-common/lib/Palette';
import * as React from 'react';
import RowSegments from './RowSegments';
import zIndex from './styles/zIndex';

export interface CollapsedPropertyTimelineSegmentsProps {
  row: any;
  timeline: any;
  component: any;
  rowHeight: number;
}

export default class CollapsedPropertyTimelineSegments extends React.PureComponent<
  CollapsedPropertyTimelineSegmentsProps
> {
  render () {
    // TODO: Optimize this? We don't need to render every segment since some of them overlap.
    // Maybe keep a list of keyframe 'poles' rendered, and only render once in that spot?
    return (
      <div
        className="collapsed-segments-box"
        style={{
          position: 'absolute',
          left: this.props.timeline.getPropertiesPixelWidth() + 1,
          height: this.props.rowHeight,
          width: '100%',
          zIndex: zIndex.collapsedSegments.base,
          backgroundColor: Palette.LIGHT_GRAY,
          paddingLeft: 1,
        }}
      >
        <RowSegments
          scope="CollapsedPropertyTimelineSegments"
          includeDraggables={false}
          preventDragging={true}
          row={this.props.row}
          component={this.props.component}
          timeline={this.props.timeline}
          rowHeight={this.props.rowHeight}
        />
      </div>
    );
  }
}
