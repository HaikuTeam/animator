import React from 'react'
import Palette from './DefaultPalette'
import getPropertyValueDescriptor from './helpers/getPropertyValueDescriptor'

export default class ClusterInputField extends React.Component {
  shouldComponentUpdate (nextProps) {
    return true
  }

  getClusterValues (node, reifiedBytecode, cluster) {
    return cluster.map((propertyDescriptor) => {
      return getPropertyValueDescriptor(
        node,
        this.props.frameInfo,
        this.props.reifiedBytecode,
        this.props.serializedBytecode,
        this.props.component,
        this.props.timelineTime,
        this.props.timelineName,
        propertyDescriptor
      )
    })
  }

  render () {
    let clusterValues = this.getClusterValues(
      this.props.item.node,
      this.props.reifiedBytecode,
      this.props.item.cluster
    )

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
