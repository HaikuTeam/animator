import React from 'react'
import Palette from 'haiku-ui-common/lib/Palette'

export default class PropertyRowHeading extends React.Component {
  constructor (props) {
    super(props)
    this.handleUpdate = this.handleUpdate.bind(this)
  }

  componentWillUnmount () {
    this.mounted = false
    this.props.row.removeListener('update', this.handleUpdate)
  }

  componentDidMount () {
    this.mounted = true
    this.props.row.on('update', this.handleUpdate)
  }

  handleUpdate (what) {
    if (!this.mounted) return null
    if (
      what === 'row-hovered' ||
      what === 'row-unhovered'
    ) {
      this.forceUpdate()
    }
  }

  render () {
    return (
      <div style={{
        textTransform: 'uppercase',
        fontSize: 10,
        width: 91,
        lineHeight: 1,
        float: 'right',
        color: (this.props.row.isHovered())
          ? Palette.SUNSTONE
          : Palette.ROCK,
        transform: this.props.humanName === 'background color'
          ? 'translateY(-2px)'
          : 'translateY(3px)',
        position: 'relative'
      }}>
        {this.props.humanName}
      </div>
    )
  }
}

PropertyRowHeading.propTypes = {
  row: React.PropTypes.object.isRequired,
  humanName: React.PropTypes.string.isRequired
}
