import * as React from 'react'
import * as Popover from 'react-popover'
import Palette from '../Palette';

const STYLES = {
  popover: {
    padding: '3px 10px',
    margin: '0',
    fontSize: '11px',
    display: 'block',
    textAlign: 'center',
    borderRadius: '5px'
  }
}

export class Tooltip extends React.PureComponent {
  props

  tooltipOpenTimeout

  tooltipCloseTimeout

  isMouseOver = false

  state = {
    isPopoverOpen: false
  }

  static propTypes = {
    content: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.element]),
    disabled: React.PropTypes.bool,
    tooltipCloseDelay: React.PropTypes.number,
    tooltipOpenDelay: React.PropTypes.number,
    place: React.PropTypes.string,
    style: React.PropTypes.object,
    tooltipBackground: React.PropTypes.string
  }

  static defaultProps = {
    tooltipOpenDelay: 600,
    tooltipCloseDelay: 2000,
    place: 'below',
    tooltipBackground: Palette.BLACK
  }

  openPopover () {
    this.isMouseOver = true

    this.tooltipOpenTimeout = setTimeout(() => {
      if (this.isMouseOver) {
        this.setState({ isPopoverOpen: true })
      }
    }, this.props.tooltipOpenDelay)

    this.tooltipCloseTimeout = setTimeout(() => {
      this.closePopover()
    }, this.props.tooltipCloseDelay)
  }

  closePopover () {
    this.isMouseOver = false
    this.setState({ isPopoverOpen: false })
    if (this.tooltipOpenTimeout) clearTimeout(this.tooltipOpenTimeout)
    if (this.tooltipCloseTimeout) clearTimeout(this.tooltipCloseTimeout)
  }

  render () {
    const {
      content,
      disabled,
      tooltipBackground,
    } = this.props

    return (
      <Popover
        isOpen={this.state.isPopoverOpen}
        body={<div style={{...STYLES.popover, backgroundColor: tooltipBackground}}>{content}</div>}
        place={this.props.place}
        tipSize={5}
      >
        <span
          onMouseEnter={() => {this.openPopover()}}
          onMouseLeave={() => {this.closePopover()}}
          onClick={() => {this.closePopover()}}
          style={this.props.style}
        >
          {this.props.children}
        </span>
      </Popover>
    )
  }
}
