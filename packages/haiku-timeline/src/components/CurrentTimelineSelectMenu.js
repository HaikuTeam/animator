import * as React from 'react';
import * as classNames from 'classnames';
import * as Popover from 'react-popover';
import ChevronDownIconSVG from 'haiku-ui-common/lib/react/icons/ChevronDownIconSVG';
import TimelineIconSVG from 'haiku-ui-common/lib/react/icons/TimelineIconSVG';
import DefaultPalette from './DefaultPalette';
import CurrentTimelinePopover from './CurrentTimelinePopover';

export default class CurrentTimelineSelectMenu extends React.Component {
  constructor (props) {
    super(props);
    this.state = {popoverOpen: false};
  }

  togglePopover () {
    this.setState({popoverOpen: !this.state.popoverOpen});
  }

  render () {
    const nothing = (
      <div
        style={{
          height: 30,
          backgroundColor: DefaultPalette.COAL,
          borderBottom: '1px solid ' + DefaultPalette.LIGHTER_GRAY,
        }} />
    );

    if (this.props.timelineNames.length < 1) {
      return nothing;
    }
    const {popoverOpen} = this.state;

    return (
      <Popover
        place="above"
        isOpen={popoverOpen}
        className="timeline-pop show-top"
        body={
          <div style={{
            position: 'relative',
            top: -210,
          }}>
            <CurrentTimelinePopover
              closePopover={this.togglePopover.bind(this)}
              timelineNames={this.props.timelineNames}
              changeTimelineName={this.props.changeTimelineName}
              createTimeline={this.props.createTimeline}
              duplicateTimeline={this.props.duplicateTimeline}
              deleteTimeline={this.props.deleteTimeline}
              selectTimeline={this.props.selectTimeline}
              />
          </div>
        }
        onOuterAction={this.togglePopover.bind(this)}>
        <button
          style={{
            padding: '0 11px',
            display: 'flex',
            alignItems: 'center',
            height: 24,
            borderRadius: 4,
            marginLeft: 8,
            marginBottom: -1,
            fontSize: 10,
            color: DefaultPalette.ROCK,
            backgroundColor: DefaultPalette.COAL,
            cursor: 'pointer',
          }}
          className={classNames('target', {popoverOpen})}
          onClick={this.togglePopover.bind(this)}>
          <TimelineIconSVG />
          <span
            style={{
              marginRight: 8,
              marginLeft: 5,
              lineHeight: 0.3,
            }}>
            {this.props.selectedTimelineName}
          </span>
          <ChevronDownIconSVG color={DefaultPalette.ROCK} />
        </button>
      </Popover>
    );
  }
}
