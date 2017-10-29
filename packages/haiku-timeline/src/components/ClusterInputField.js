import React from 'react'
import Palette from './DefaultPalette'

export default class ClusterInputField extends React.Component {
  constructor (props) {
    super(props)
    this.handleUpdate = this.handleUpdate.bind(this)
  }

  componentWillUnmount () {
    this.mounted = false
    this.props.timeline.removeListener('update', this.handleUpdate)
  }

  componentDidMount () {
    this.mounted = true
    this.props.timeline.on('update', this.handleUpdate)
  }

  handleUpdate (what) {
    if (!this.mounted) return null
    if (what === 'timeline-frame') this.forceUpdate()
  }

  render () {
    let clusterValues = this.props.row.getClusterValues()

    let valueElements = clusterValues.map((clusterVal, index) => {
      let semi = (index === (clusterValues.length - 1)) ? '' : '; '
      return <span key={index}>{clusterVal.prettyValue}{semi}</span>
    })

    return (
      <div
        className='property-cluster-input-field no-select'
        style={{
          width: 83,
          margin: 0,
          color: 'transparent',
          textShadow: '0 0 0 ' + Palette.DARK_ROCK,
          backgroundColor: Palette.LIGHT_GRAY,
          position: 'relative',
          zIndex: 1004,
          borderTopLeftRadius: 4,
          borderBottomLeftRadius: 4,
          border: '1px solid ' + Palette.DARKER_GRAY,
          height: this.props.rowHeight + 1,
          padding: '3px 5px',
          fontSize: 13,
          overflow: 'hidden',
          whiteSpace: 'nowrap'
        }}>
        <span>{valueElements}</span>
      </div>
    )
  }
}

ClusterInputField.propTypes = {
  row: React.PropTypes.object.isRequired,
  timeline: React.PropTypes.object.isRequired,
  rowHeight: React.PropTypes.number.isRequired,
  $update: React.PropTypes.object.isRequired,
}
