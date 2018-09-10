import * as React from 'react';
import * as lodash from 'lodash';
import {Experiment, experimentIsEnabled} from 'haiku-common/lib/experiments';
import DownCarrotSVG from 'haiku-ui-common/lib/react/icons/DownCarrotSVG';
import RightCarrotSVG from 'haiku-ui-common/lib/react/icons/RightCarrotSVG';
import DragGrip from 'haiku-ui-common/lib/react/icons/DragGrip';
import {SyncIconSVG, LockIconSVG, UnlockIconSVG} from 'haiku-ui-common/lib/react/OtherIcons';
import Palette from 'haiku-ui-common/lib/Palette';
import * as Element from 'haiku-serialization/src/bll/Element';
import ComponentHeadingRowHeading from './ComponentHeadingRowHeading';
import CollapsedPropertyTimelineSegments from './CollapsedPropertyTimelineSegments';
import EventHandlerTriggerer from './EventHandlerTriggerer';
import PropertyManager from './PropertyManager';
import zIndex from './styles/zIndex';
import * as mixpanel from 'haiku-serialization/src/utils/Mixpanel';

const STYLES = {
  actionButton: {
    margin: '0 1px',
    width: 15,
    height: 15,
    textAlign: 'center',
  },
};

export default class ComponentHeadingRow extends React.Component {
  constructor (props) {
    super(props);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.throttledHandleRowHoverUnhover = lodash.debounce(this.handleRowHoverUnhover, 100);
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
      what === 'drag-group-start' ||
      what === 'drag-group-end' ||
      what === 'row-rehydrated' ||
      what === 'element-locked-toggle'
    ) {
      this.forceUpdate();
    }
  }

  shouldComponentUpdate (nextProps) {
    return (
      (this.props.isExpanded ^ nextProps.isExpanded) ||
      (this.props.isHidden ^ nextProps.isHidden) ||
      (this.props.isSelected ^ nextProps.isSelected) ||
      (this.props.hasAttachedActions ^ nextProps.hasAttachedActions)
    );
  }

  hoverRow = () => {
    this.handleRowHoverUnhover(true);
  };

  unhoverRow = () => {
    this.handleRowHoverUnhover(false);
  };

  toggleExpandAndSelect = (clickEvent) => {
    if (clickEvent) {
      clickEvent.stopPropagation();
    }

    if (this.props.isExpanded) {
      this.collapseAndDeselect();
    } else {
      this.expandAndSelect();
    }
  };

  expandAndSelect = (clickEvent) => {
    if (clickEvent) {
      clickEvent.stopPropagation();
    }

    Element.deselectAllOtherElements({
      component: this.props.row.component},
      this.props.row.element,
      {from: 'timeline'},
    );

    this.props.row.expandAndSelect({from: 'timeline'});
  };

  collapseAndDeselect () {
    if (this.props.row.isRootRow()) {
      this.props.row.visit((row) => {
        row.collapse({from: 'timeline'});
      });
    } else {
      this.props.row.collapseAndDeselect({from: 'timeline'});
    }
  }

  handleRowHoverUnhover (shouldHover) {
    if (shouldHover) {
      this.props.row.hoverAndUnhoverOthers({from: 'timeline'});
    } else {
      this.props.row.unhover({from: 'timeline'});
    }
  }

  toggleSync () {
    const locked = !this.props.row.element.isSyncLocked();
    this.props.component.updateKeyframes({}, {setElementLockStatus: {[this.props.row.element.getComponentId()]: locked}}, {from: 'timeline'}, () => {
      this.forceUpdate();
    });
  }

  toggleLock () {
    this.props.row.element.toggleLocked({from: 'timeline'}, () => {
      mixpanel.haikuTrack('creator:timeline:layer:lock-toggled');
    });
  }

  render () {
    const componentId = this.props.row.element.getComponentId();
    const boltColor = this.props.hasAttachedActions ? Palette.LIGHT_BLUE : Palette.DARK_ROCK;
    const propertiesPixelWidth = this.props.timeline.getPropertiesPixelWidth();

    return (
      <div
        id={`component-heading-row-${componentId}-${this.props.row.getAddress()}`}
        key={`component-heading-row-${componentId}-${this.props.row.getAddress()}`}
        className="component-heading-row no-select js-avoid-marquee-init"
        onMouseOver={this.hoverRow}
        onMouseOut={this.unhoverRow}
        style={{
          display: 'flex',
          alignItems: 'top',
          height: this.props.isExpanded ? 'auto' : this.props.rowHeight,
          position: this.props.isExpanded ? 'sticky' : 'relative',
          float: this.props.isExpanded ? 'left' : undefined,
          width: this.props.isExpanded ? 100 : undefined,
          left: this.props.isExpanded ? 4 : undefined,
          backgroundColor: this.props.isExpanded ? 'transparent' : Palette.LIGHT_GRAY,
          opacity: this.props.isHidden ? 0.75 : 1.0,
          zIndex: this.props.isExpanded ? zIndex.headingRowExpanded.base : undefined,
        }}>
        <div className="js-avoid-marquee-init" style={{
          display: 'flex',
          position: 'sticky',
          top: 0,
          left: 0,
          paddingLeft: this.props.row.isRootRow() ? (this.props.isExpanded ? 0 : 7) : (this.props.isExpanded ? 10 : 15),
          width: propertiesPixelWidth,
          backgroundColor: this.props.isExpanded ? 'transparent' : Palette.LIGHT_GRAY,
          zIndex: zIndex.headingRow.base,
        }}>
          {!this.props.row.isRootRow() &&
            <div
              style={{
                marginTop: 3,
                marginRight: 3,
              }}
              className="component-heading-row-drag-handle js-avoid-marquee-init"
              {...this.props.dragHandleProps}>
              <span
                className="drag-grip-wrapper opacity-on-hover js-avoid-marquee-init"
                style={{display: 'block'}}>
                <DragGrip />
              </span>
            </div>
          }
          <div
            className="component-heading-row-inner no-select"
            style={{
              width: this.props.row.isExpanded() ? (this.props.row.isRootRow() ? propertiesPixelWidth - 160 : propertiesPixelWidth - 200) : propertiesPixelWidth,
              height: 'inherit',
              cursor: 'pointer',
              backgroundColor: 'transparent',
              display: 'flex',
              flexDirection: 'column',
            }}>
            <div
              className="component-heading-row-inner-r1"
              style={{
                height: this.props.rowHeight,
                display: 'flex',
                alignItems: this.props.isExpanded ? 'baseline' : 'center',
                width: '100%',
              }}
              onClick={this.expandAndSelect}
            >
              <span
                className="component-heading-chevron-box"
                style={{
                  width: 11,
                  marginTop: 3,
                  marginLeft: -3,
                  marginRight: 3,
                  padding: '0 3px',
                }}
                onClick={this.toggleExpandAndSelect}
              >
                <span style={{pointerEvents: 'none'}}>
                  {this.props.isExpanded
                      ? <DownCarrotSVG color={Palette.ROCK} />
                      : <RightCarrotSVG />}
                </span>
              </span>
              <ComponentHeadingRowHeading
                setEditingRowTitleStatus={this.props.setEditingRowTitleStatus}
                row={this.props.row}
                isExpanded={this.props.isExpanded}
                isSelected={this.props.isSelected}
                isHovered={this.props.isHovered}
                onEventHandlerTriggered={this.props.onEventHandlerTriggered}
                onExpand={this.expandAndSelect}
              />
            </div>
            <div
              className="component-heading-row-inner-r2"
              style={{
                display: this.props.isExpanded ? 'flex' : 'none',
                alignItems: 'baseline',
                marginTop: -3,
                width: '75%',
                marginLeft: this.props.row.isRootRow()
                  ? (this.props.isExpanded ? 33 : undefined)
                  : (this.props.isExpanded ? 12 : undefined),
              }}
            >
              <div
                className="layer-lock-button light-on-hover"
                style={{
                  ...STYLES.actionButton,
                  display: this.props.row.element.getSource() ? 'block' : 'none',
                }}
                onClick={this.toggleLock.bind(this)}
              >
                {
                  this.props.row.element.isLocked()
                    ? LockIconSVG({color: Palette.LIGHT_BLUE})
                    : UnlockIconSVG({color: Palette.DARK_ROCK})
                }
              </div>
              <div
                aria-label="Edit element Actions"
                data-tooltip={true}
                data-tooltip-right={true}
                className="event-handler-triggerer-button light-on-hover"
                style={{
                  ...STYLES.actionButton,
                }}>
                {(this.props.isExpanded || this.props.hasAttachedActions)
                  ? <EventHandlerTriggerer
                    element={this.props.row.element}
                    row={this.props.row}
                    boltColor={boltColor}
                    onEventHandlerTriggered={this.props.onEventHandlerTriggered}
                    />
                  : ''}
              </div>
              <div
                aria-label="Add property"
                data-tooltip={true}
                data-tooltip-right={true}
                className="property-manager-button light-on-hover"
                style={{
                  ...STYLES.actionButton,
                }}>
                {(this.props.isExpanded)
                  ? <PropertyManager
                    element={this.props.row.element}
                  />
                  : ''}
              </div>
            </div>
          </div>
        </div>
        {!this.props.isExpanded &&
        <div
          onClick={this.expandAndSelect}
          className="component-collapsed-segments-box"
          style={{
            height: 'inherit',
          }}>
          {(!this.props.isExpanded)
            ? <CollapsedPropertyTimelineSegments
              component={this.props.component}
              timeline={this.props.timeline}
              rowHeight={this.props.rowHeight}
              row={this.props.row} />
          : ''}
        </div>
      }
      </div>
    );
  }
}

ComponentHeadingRow.propTypes = {
  row: React.PropTypes.object.isRequired,
  component: React.PropTypes.object.isRequired,
  timeline: React.PropTypes.object.isRequired,
  rowHeight: React.PropTypes.number.isRequired,
  onEventHandlerTriggered: React.PropTypes.func.isRequired,
  dragHandleProps: React.PropTypes.object,
};
