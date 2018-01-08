import * as React from 'react'
import Palette from '../../Palette'

export class ModalNotice extends React.PureComponent {
  props

  static propTypes = {
    color: React.PropTypes.string,
    message: React.PropTypes.string
  }

  static defaultProps = {
    color: Palette.RED
  }

  render () {
    return (
      <div style={{
        width: '100%',
        height: '25px',
        lineHeight: '25px',
        padding: '3px',
        textAlign: 'center',
        color: Palette.SUNSTONE,
        backgroundColor: this.props.color
      }}>
        {this.props.message}
      </div>
    )
  }
}