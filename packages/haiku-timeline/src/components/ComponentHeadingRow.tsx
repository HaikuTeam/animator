// @ts-ignore
import * as Element from 'haiku-serialization/src/bll/Element';
// @ts-ignore
import * as mixpanel from 'haiku-serialization/src/utils/Mixpanel';
import Palette from 'haiku-ui-common/lib/Palette';
import DownCarrotSVG from 'haiku-ui-common/lib/react/icons/DownCarrotSVG';
import DragGrip from 'haiku-ui-common/lib/react/icons/DragGrip';
import RightCarrotSVG from 'haiku-ui-common/lib/react/icons/RightCarrotSVG';
import {LockIconSVG, UnlockIconSVG} from 'haiku-ui-common/lib/react/OtherIcons';
import * as React from 'react';
import CollapsedPropertyTimelineSegments from './CollapsedPropertyTimelineSegments';
import ComponentHeadingRowHeading from './ComponentHeadingRowHeading';
import EventHandlerTriggerer from './EventHandlerTriggerer';
import zIndex from './styles/zIndex';

const STYLES = {
  actionButton: {
    margin: '0 1px',
    width: 15,
    height: 15,
    textAlign: 'center',
  },
};

export interface ComponentHeadingRowProps {
  row: any;
  component: any;
  timeline: any;
  rowHeight: number;
  onEventHandlerTriggered (): void;
  isExpanded: boolean;
  isHidden: boolean;
  isSelected: boolean;
  hasAttachedActions: boolean;
  timelinePropertiesWidth: number;
  setEditingRowTitleStatus (): void;
}

export default class ComponentHeadingRow extends React.Component<ComponentHeadingRowProps> {
  mounted = false;

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

  handleUpdate = (what: string): void => {
    if (!this.mounted) {
      return null;
    }

    if (
      what === 'drag-group-start' ||
      what === 'drag-group-end' ||
      what === 'row-rehydrated' ||
      what === 'element-locked-toggle' ||
      what === 'row-expanded'
    ) {
      this.forceUpdate();
    }
  };

  shouldComponentUpdate (nextProps: ComponentHeadingRowProps) {
    return Boolean(
      (this.props.isExpanded !== nextProps.isExpanded) ||
      (this.props.isHidden !== nextProps.isHidden) ||
      (this.props.isSelected !== nextProps.isSelected) ||
      (this.props.hasAttachedActions !== nextProps.hasAttachedActions) ||
      (this.props.timelinePropertiesWidth !== nextProps.timelinePropertiesWidth),
    );
  }

  hoverRow = () => {
    this.handleRowHoverUnhover(true);
  };

  unhoverRow = () => {
    this.handleRowHoverUnhover(false);
  };

  toggleExpandAndSelect = (clickEvent: React.MouseEvent<any>) => {
    if (clickEvent) {
      clickEvent.stopPropagation();
    }

    if (this.props.isExpanded) {
      this.collapseAndDeselect();
    } else {
      this.expandAndSelect(clickEvent);
    }
  };

  expandAndSelect = (clickEvent: React.MouseEvent<any>) => {
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
      this.props.row.visit((row: any) => {
        row.collapse({from: 'timeline'});
      });
    } else {
      this.props.row.collapseAndDeselect({from: 'timeline'});
    }
  }

  handleRowHoverUnhover (shouldHover: boolean) {
    if (shouldHover) {
      this.props.row.hoverAndUnhoverOthers({from: 'timeline'});
    } else {
      this.props.row.unhover({from: 'timeline'});
    }
  }

  toggleSync = () => {
    const locked = !this.props.row.element.isSyncLocked();
    this.props.component.updateKeyframes(
      {},
      {setElementLockStatus: {[this.props.row.element.getComponentId()]: locked}},
      {from: 'timeline'},
      () => {
        this.forceUpdate();
      },
    );
  };

  toggleLock = () => {
    this.props.row.element.toggleLocked({from: 'timeline'}, () => {
      mixpanel.haikuTrack('creator:timeline:layer:lock-toggled');
    });
  };

  onDragStart = (event: React.DragEvent<any>) => {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('componentId', this.props.row.element.getComponentId());
    setTimeout(() => {
      document.body.classList.add('dragging');
    }, 100);
  };

  onDragEnd = () => {
    document.body.classList.remove('dragging');
  };

  render () {
    const componentId = this.props.row.element.getComponentId();
    const boltColor = this.props.hasAttachedActions ? Palette.LIGHT_BLUE : Palette.DARK_ROCK;
    const propertiesPixelWidth = this.props.timeline.getPropertiesPixelWidth();
    const depth = this.props.row.getDepthAmongRows();
    const backgroundColor = this.props.isExpanded ? 'transparent' : Palette.LIGHT_GRAY;

    return (
      <div
        id={`component-heading-row-${componentId}-${this.props.row.getAddress()}`}
        key={`component-heading-row-${componentId}-${this.props.row.getAddress()}`}
        className="component-heading-row no-select js-avoid-marquee-init"
        draggable={true}
        onDragStart={this.onDragStart}
        onDragEnd={this.onDragEnd}
        onMouseOver={this.hoverRow}
        onMouseOut={this.unhoverRow}
        style={{
          backgroundColor,
          display: 'flex',
          height: this.props.isExpanded ? 'auto' : this.props.rowHeight,
          position: this.props.isExpanded ? 'sticky' : 'relative',
          float: this.props.isExpanded ? 'left' : undefined,
          width: this.props.isExpanded ? 100 : undefined,
          left: 0,
          opacity: this.props.isHidden ? 0.75 : 1.0,
          zIndex: this.props.isExpanded ? zIndex.headingRowExpanded.base : undefined,
        }}
      >
        <div
          className="js-avoid-marquee-init"
          style={{
            backgroundColor,
            display: 'flex',
            position: 'sticky',
            top: 0,
            left: 0,
            paddingLeft: this.props.row.isRootRow() ? 5 : 0,
            width: propertiesPixelWidth,
            zIndex: zIndex.headingRow.base,
          }}
        >
          <div
            style={{
              marginTop: 3,
              marginRight: 3,
              display: this.props.row.isRootRow() ? 'none' : 'inline-block',
              visibility: depth >= 2 ? 'hidden' : 'visible',
            }}
            className="component-heading-row-drag-handle js-avoid-marquee-init"
            tabIndex={null}
          >
            <span
              className="drag-grip-wrapper opacity-on-hover js-avoid-marquee-init"
              style={{display: 'block'}}
            >
              <DragGrip />
            </span>
          </div>
          <div
            className="component-heading-row-inner no-select"
            style={{
              width: this.props.row.isExpanded()
                ? this.props.row.isRootRow()
                  ? propertiesPixelWidth - 160
                  : propertiesPixelWidth - 200
                : propertiesPixelWidth,
              height: 'inherit',
              cursor: 'pointer',
              backgroundColor: 'transparent',
              display: 'flex',
              flexDirection: 'column',
              paddingLeft: 27 * (depth - 1),
            }}
          >
            <div
              className="component-heading-row-inner-r1"
              style={{
                height: this.props.rowHeight,
                display: 'flex',
                width: '100%',
              }}
              onClick={this.expandAndSelect}
            >
              <span
                className="component-heading-chevron-box"
                style={{
                  width: 11,
                  padding: '0 3px',
                  ...(!this.props.row.isRootRow() && {
                    marginTop: 3,
                    marginLeft: -3,
                    marginRight: 3,
                  }),
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
                onEventHandlerTriggered={this.props.onEventHandlerTriggered}
                onExpand={this.expandAndSelect}
                propertiesPixelWidth={this.props.timelinePropertiesWidth}
              />
            </div>
            <div
              className="component-heading-row-inner-r2"
              style={{
                display: this.props.isExpanded ? 'flex' : 'none',
                alignItems: 'baseline',
                marginTop: -3,
                width: '75%',
                overflow: 'hidden',
                marginLeft: this.props.isExpanded ? 12 : undefined,
              }}
            >
              <div
                className="layer-lock-button light-on-hover"
                title={this.props.row.element.isLocked() ? 'Unlock element' : 'Lock element'}
                style={{
                  ...STYLES.actionButton,
                  display: this.props.row.element.getSource() ? 'block' : 'none',
                }}
                onClick={this.toggleLock}
              >
                {
                  this.props.row.element.isLocked()
                    ? LockIconSVG({color: Palette.LIGHT_BLUE})
                    : UnlockIconSVG({color: Palette.DARK_ROCK})
                }
              </div>
              <div
                title="Edit element Actions"
                className="event-handler-triggerer-button light-on-hover"
                style={{
                  ...STYLES.actionButton,
                }}
              >
                {(this.props.isExpanded || this.props.hasAttachedActions)
                  ? <EventHandlerTriggerer
                    element={this.props.row.element}
                    row={this.props.row}
                    boltColor={boltColor}
                    onEventHandlerTriggered={this.props.onEventHandlerTriggered}
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
          }}
        >
          {(!this.props.isExpanded)
            ? <CollapsedPropertyTimelineSegments
              component={this.props.component}
              timeline={this.props.timeline}
              rowHeight={this.props.rowHeight}
              row={this.props.row}
              backgroundColor={backgroundColor}
            />
          : ''}
        </div>
      }
      </div>
    );
  }
}
