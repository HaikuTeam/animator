import * as React from 'react';
// @ts-ignore
import * as Popover from 'react-popover';
import Palette from '../Palette';

const STYLES = {
  popover: {
    padding: '3px 10px',
    margin: '0',
    fontSize: '11px',
    display: 'block',
    textAlign: 'center',
    borderRadius: '5px',
  },
};

export interface TooltipProps {
  content: string|Element;
  tooltipCloseDelay?: number;
  tooltipOpenDelay?: number;
  place: string;
  style?: React.CSSProperties;
  tooltipBackground?: string;
}

export interface TooltipStates {
  isPopoverOpen: boolean;
}

export class Tooltip extends React.PureComponent<TooltipProps, TooltipStates> {
  tooltipOpenTimeout: number;
  tooltipCloseTimeout: number;
  isMouseOver = false;

  state = {
    isPopoverOpen: false,
  };

  static defaultProps = {
    tooltipOpenDelay: 600,
    tooltipCloseDelay: 2000,
    place: 'below',
    tooltipBackground: Palette.BLACK,
  };

  private boundOpenPopover = () => this.openPopover();
  private boundClosePopover = () => this.closePopover();

  openPopover () {
    this.isMouseOver = true;

    this.tooltipOpenTimeout = window.setTimeout(
      () => {
        if (this.isMouseOver) {
          this.setState({isPopoverOpen: true});
        }
      },
      this.props.tooltipOpenDelay,
    );

    this.tooltipCloseTimeout = window.setTimeout(
      () => {
        this.closePopover();
      },
      this.props.tooltipCloseDelay,
    );
  }

  closePopover () {
    this.isMouseOver = false;
    this.setState({isPopoverOpen: false});
    if (this.tooltipOpenTimeout) {
      window.clearTimeout(this.tooltipOpenTimeout);
    }
    if (this.tooltipCloseTimeout) {
      window.clearTimeout(this.tooltipCloseTimeout);
    }
  }

  render () {
    const {
      content,
      tooltipBackground,
    } = this.props;

    return (
      <Popover
        isOpen={this.state.isPopoverOpen}
        body={<div style={{...STYLES.popover, backgroundColor: tooltipBackground}}>{content}</div>}
        place={this.props.place}
        tipSize={5}
      >
        <span
          onMouseEnter={this.boundOpenPopover}
          onMouseLeave={this.boundClosePopover}
          onClick={this.boundClosePopover}
          style={this.props.style}
        >
          {this.props.children}
        </span>
      </Popover>
    );
  }
}
