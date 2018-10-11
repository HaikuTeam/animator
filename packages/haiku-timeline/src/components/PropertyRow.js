import * as React from 'react';
import * as lodash from 'lodash';
import humanizePropertyName from 'haiku-ui-common/lib/helpers/humanizePropertyName';
import DownCarrotSVG from 'haiku-ui-common/lib/react/icons/DownCarrotSVG';
import PropertyInputField from './PropertyInputField';
import Palette from 'haiku-ui-common/lib/Palette';
import Globals from 'haiku-ui-common/lib/Globals';
import PopoverMenu from 'haiku-ui-common/lib/electron/PopoverMenu';
import PropertyTimelineSegments from './PropertyTimelineSegments';
import PropertyRowHeading from './PropertyRowHeading';
import {Experiment, experimentIsEnabled} from 'haiku-common/lib/experiments';
import zIndex from './styles/zIndex';

export default class PropertyRow extends React.Component {
  constructor (props) {
    super(props);

    this.handleUpdate = this.handleUpdate.bind(this);
    this.throttledHandleRowHovered = lodash.throttle(this.handleRowHovered, 20).bind(this);
    this.throttledHandleRowUnhovered = lodash.throttle(this.handleRowUnhovered, 20).bind(this);
  }

  componentWillUnmount () {
    this.mounted = false;
    this.props.row.element.removeListener('update', this.handleUpdate);
    this.props.row.removeListener('update', this.handleUpdate);
  }

  componentDidMount () {
    this.mounted = true;
    this.props.row.element.on('update', this.handleUpdate);
    this.props.row.on('update', this.handleUpdate);
  }

  handleUpdate (what) {
    if (!this.mounted) {
      return null;
    }
    if (
      what === 'row-selected' ||
      what === 'row-deselected' ||
      what === 'row-set-title' ||
      what === 'element-locked-toggle'
     ) {
      this.forceUpdate();
    }
  }

  handleRowHovered (event) {
    this.props.row.hoverAndUnhoverOthers({from: 'timeline'});
  }

  handleRowUnhovered (event) {
    this.props.row.unhover({from: 'timeline'});
  }

  render () {
    const componentId = this.props.row.element.getComponentId();
    const propertyName = this.props.row.getPropertyNameString();
    const humanName = humanizePropertyName(propertyName);

    return (
      <div
        id={`property-row-${this.props.row.getAddress()}-${componentId}-${propertyName}`}
        className="property-row"
        onMouseEnter={this.throttledHandleRowHovered}
        onMouseLeave={this.throttledHandleRowUnhovered}
        style={{
          height: this.props.rowHeight,
          left: 0,
          opacity: (this.props.row.isHidden()) ? 0.5 : 1.0,
          position: 'relative',
        }}>
        <div draggable="false" style={{
          position: 'sticky',
          top: 0,
          left: 0,
          width: this.props.timeline.getPropertiesPixelWidth(),
          // Increase the z-index over the other rows to show the pink border around the selected field,
          // we need to do this here because we are defining a new stacking context with `position: sticky`
          zIndex: this.props.row === this.props.row.component.getSelectedRow() ? (zIndex.propertyRowHeading.base + 1) : zIndex.propertyRowHeading.base,
          backgroundColor: Palette.GRAY,
        }}>
          <div
            onClick={(clickEvent) => {
              // Allow clicking the subproperty of a cluster to collapse the parent row,
              // which 'contains' the rows of the cluster as children
              if (this.props.row.isCluster()) {
                this.props.row.parent.collapse();
              }
            }}>
            {(this.props.row.isFirstRowOfPropertyCluster()) &&
              <div
                style={{
                  position: 'absolute',
                  width: 14,
                  right: 150,
                  top: -2,
                  zIndex: 1006,
                  textAlign: 'right',
                  height: 'inherit',
                }}>
                <span className="utf-icon" style={{top: -4, left: -3}}><DownCarrotSVG /></span>
              </div>}
            <div
              draggable="false"
              className="property-row-label no-select"
              style={{
                right: 0,
                width: this.props.timeline.getPropertiesPixelWidth() - 120,
                height: this.props.rowHeight,
                textAlign: 'right',
                backgroundColor: Palette.GRAY,
                zIndex: 1004,
                position: 'relative',
                paddingTop: 6,
                paddingRight: 10,
                marginLeft: 40,
              }}>
              <div
                className="hacky-property-row-coverup"
                style={{
                  position: 'absolute',
                  left: -40,
                  height: '100%',
                  width: 40,
                  backgroundColor: Palette.GRAY,
                }} />
              <PropertyRowHeading
                row={this.props.row}
                humanName={humanName} />
            </div>
          </div>
          <div className="property-input-field-row"
            style={{
              position: 'absolute',
              left: this.props.timeline.getPropertiesPixelWidth() - 82,
              width: 82,
              top: 0,
              height: this.props.rowHeight - 1,
              textAlign: 'left',
            }}>
            <PropertyInputField
              row={this.props.row}
              index={this.props.row.getAddress()}
              height={this.props.rowHeight}
              component={this.component}
              timeline={this.props.timeline}
              timelineName={this.props.timeline.getName()}
              rowHeight={this.props.rowHeight}
              disabled={this.props.row.element.isLocked()} />
          </div>
        </div>
        <div
          onContextMenu={(ctxMenuEvent) => {
            ctxMenuEvent.stopPropagation();

            PopoverMenu.emit('show', {
              type: 'property-row',
              event: {offsetX: 0},
              model: this.props.row,
              offset: Globals.mouse.x - this.props.timeline.getPropertiesPixelWidth(),
            });
          }}
          className="property-timeline-segments-box"
          onDoubleClick={this.props.onDoubleClickToMoveGauge}
          onMouseDown={() => {
            this.props.row.activate();
          }}
          style={{
            position: 'absolute',
            width: '100%',
            left: this.props.timeline.getPropertiesPixelWidth() + 1,
            top: 0,
            height: 'inherit',
            zIndex: zIndex.propertyRow.base,
          }}>
          <PropertyTimelineSegments
            component={this.props.component}
            timeline={this.props.timeline}
            rowHeight={this.props.rowHeight}
            row={this.props.row}
            preventDragging={this.props.row.element.isLocked()} />
        </div>
      </div>
    );
  }
}

PropertyRow.propTypes = {
  row: React.PropTypes.object.isRequired,
  timeline: React.PropTypes.object.isRequired,
  component: React.PropTypes.object.isRequired,
  rowHeight: React.PropTypes.number.isRequired,
};
