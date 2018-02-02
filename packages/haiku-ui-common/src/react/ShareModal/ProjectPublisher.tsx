import * as React from 'react'
import {Tooltip} from '../Tooltip'
import Palette from '../../Palette'

const STYLES = {
  btnText: {
    height: '25px',
    padding: '4px 9px',
    fontSize: 11,
    letterSpacing: '1.3px',
    marginRight: '5px',
    lineHeight: 1,
    borderRadius: '3px',
    color: Palette.SUNSTONE,
    transform: 'scale(1)',
    cursor: 'pointer',
    transition: 'transform 200ms ease, border-color 200ms ease',
    backgroundColor: Palette.LIGHT_PINK,
    ':active': {
      transform: 'scale(.9)'
    },
    ':hover': {
      color: Palette.SUNSTONE
    }
  },
  tooltipContainer: {
    textAlign: 'center',
    padding: '10px 0'
  },
  dot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: Palette.LIGHT_PINK,
    cursor: 'pointer',
    display: 'inline-block',
    verticalAlign: 'super'
  }
}

export class ProjectPublisher extends React.PureComponent {
  props

  static propTypes = {
    onProjectPublish: React.PropTypes.func.isRequired
  }

  get publishInterface() {
    return (
      <div style={STYLES.tooltipContainer}>
        <p style={{margin: '0 0 5px 0'}}>Project has unpublished changes</p>
        <button
          style={STYLES.btnText}
          onClick={this.props.onProjectPublish}
        >
          Publish
        </button>
      </div>
    )
  }

  render() {
    return (
      <Tooltip
        content={this.publishInterface}
        place="right"
        tooltipCloseDelay={500000}
        tooltipBackground={Palette.SPECIAL_COAL}
      >
        <span style={STYLES.dot} />
      </Tooltip>
    )
  }
}
