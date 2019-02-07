import * as React from 'react';
import * as lodash from 'lodash';
import * as mixpanel from 'haiku-serialization/src/utils/Mixpanel';
import TransitionBody from './TransitionBody';
import ConstantBody from './ConstantBody';
import SoloKeyframe from './SoloKeyframe';
import InvisibleKeyframeDragger from './InvisibleKeyframeDragger';

export default class RowSegments extends React.Component {
  constructor (props) {
    super(props);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.debouncedForceUpdate = lodash.debounce(() => {
      if (this.mounted) {
        this.forceUpdate();
      }
    }, 64, {leading: false, trailing: true});
  }

  componentWillUnmount () {
    this.mounted = false;
    this.props.timeline.removeListener('update', this.handleUpdate);
    this.props.row.removeListener('update', this.handleUpdate);
  }

  componentDidMount () {
    this.mounted = true;
    this.props.timeline.on('update', this.handleUpdate);
    this.props.row.on('update', this.handleUpdate);
  }

  componentWillReceiveProps (nextProps) {
    // When switching the active component, we also get a new timeline instance
    if (nextProps.timeline !== this.props.timeline) {
      this.props.timeline.removeListener('update', this.handleUpdate);
      nextProps.timeline.on('update', this.handleUpdate);
    }
  }

  handleUpdate (what) {
    if (!this.mounted) {
      return;
    }

    if (
        what === 'timeline-frame-range' ||
        what === 'timeline-timeline-pixel-width'
      ) {
      this.forceUpdate();
      return;
    }

    if (
      what === 'keyframe-create' ||
      what === 'keyframe-delete' ||
      what === 'keyframe-remove-curve' ||
      what === 'keyframe-add-curve' ||
      what === 'keyframe-change-curve' ||
      what === 'row-rehydrated' ||
      what === 'child-row-rehydrated'
    ) {
      this.debouncedForceUpdate();
    }
  }

  render () {
    return (
      <div>
        {this.props.row.mapVisibleKeyframes({maxDepth: 3}, (keyframe) => {
          const segmentPieces = [];

          // The use of this.props.scope as part of the id/key is necessary so that
          // model updates are routed properly; if you remove it, things will break.

          if (keyframe.isTransitionSegment() && keyframe.next()) {
            segmentPieces.push(
              <TransitionBody
                id={`keyframe-${keyframe.getUniqueKey()}-${this.props.scope}-transition-body`}
                key={`keyframe-${keyframe.getUniqueKey()}-${this.props.scope}-transition-body`}
                preventDragging={this.props.preventDragging}
                showBezierEditor={this.props.showBezierEditor}
                component={this.props.component}
                timeline={this.props.timeline}
                rowHeight={this.props.rowHeight}
                keyframe={keyframe} />,
            );
          } else {
            if (keyframe.isConstantSegment()) {
              segmentPieces.push(
                <ConstantBody
                  id={`keyframe-${keyframe.getUniqueKey()}-${this.props.scope}-constant-body`}
                  key={`keyframe-${keyframe.getUniqueKey()}-${this.props.scope}-constant-body`}
                  preventDragging={this.props.preventDragging}
                  timeline={this.props.timeline}
                  rowHeight={this.props.rowHeight}
                  keyframe={keyframe} />,
              );
            }
            if (keyframe.isSoloKeyframe() || !keyframe.hasNextKeyframe()) {
              segmentPieces.push(
                <SoloKeyframe
                  id={`keyframe-${keyframe.getUniqueKey()}-${this.props.scope}-solo-keyframe`}
                  key={`keyframe-${keyframe.getUniqueKey()}-${this.props.scope}-solo-keyframe`}
                  preventDragging={this.props.preventDragging}
                  timeline={this.props.timeline}
                  rowHeight={this.props.rowHeight}
                  keyframe={keyframe} />,
              );
            }
          }

          if (this.props.includeDraggables) {
            if (keyframe.hasPreviousKeyframe()) {
              segmentPieces.push(
                <InvisibleKeyframeDragger
                  id={`keyframe-${keyframe.getUniqueKey()}-invisible-1`}
                  key={`keyframe-${keyframe.getUniqueKey()}-invisible-1`}
                  offset={-10}
                  component={this.props.component}
                  timeline={this.props.timeline}
                  rowHeight={this.props.rowHeight}
                  keyframe={keyframe}
                  preventDragging={this.props.preventDragging} />,
              );
            }
            segmentPieces.push(
              <InvisibleKeyframeDragger
                id={`keyframe-${keyframe.getUniqueKey()}-invisible-2`}
                key={`keyframe-${keyframe.getUniqueKey()}-invisible-2`}
                offset={0}
                component={this.props.component}
                timeline={this.props.timeline}
                rowHeight={this.props.rowHeight}
                keyframe={keyframe}
                preventDragging={this.props.preventDragging} />,
            );
            if (keyframe.hasNextKeyframe()) {
              segmentPieces.push(
                <InvisibleKeyframeDragger
                  id={`keyframe-${keyframe.getUniqueKey()}-invisible-3`}
                  key={`keyframe-${keyframe.getUniqueKey()}-invisible-3`}
                  offset={+10}
                  component={this.props.component}
                  timeline={this.props.timeline}
                  rowHeight={this.props.rowHeight}
                  keyframe={keyframe}
                  preventDragging={this.props.preventDragging} />,
              );
            }
          }

          return (
            <div
              id={`keyframe-container-${keyframe.getUniqueKey()}`}
              key={`keyframe-container-${keyframe.getUniqueKey()}`}
              className={`keyframe-container no-select`}
              onDoubleClick={(doubleClickEvent) => {
                if (
                  doubleClickEvent.target &&
                  doubleClickEvent.target.id &&
                  doubleClickEvent.target.id.includes('keyframe-dragger')
                ) {
                  this.props.timeline.seekToTime(keyframe.origMs);
                  this.props.row.blurOthers({from: 'timeline'});
                  this.props.row.focus({from: 'timeline'});
                  this.props.row.select({from: 'timeline'});
                  mixpanel.haikuTrack('creator:timeline:keyframe:double-clicked');
                }
              }}>
              {segmentPieces}
            </div>
          );
        })}
      </div>
    );
  }
}

RowSegments.propTypes = {
  row: React.PropTypes.object.isRequired,
  scope: React.PropTypes.string.isRequired,
  timeline: React.PropTypes.object.isRequired,
  component: React.PropTypes.object.isRequired,
  rowHeight: React.PropTypes.number.isRequired,
  includeDraggables: React.PropTypes.bool.isRequired,
  preventDragging: React.PropTypes.bool.isRequired,
  showBezierEditor: React.PropTypes.func,
};
