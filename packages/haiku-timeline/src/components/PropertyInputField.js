import React from 'react'
import lodash from 'lodash'
import Color from 'color'
import Palette from './DefaultPalette'
import getPropertyValueDescriptor from './helpers/getPropertyValueDescriptor'
import { getItemPropertyId, isItemEqual } from './helpers/ItemHelpers'

export default class PropertyInputField extends React.Component {
  render () {
    let propertyId = getItemPropertyId(this.props.item)
    let valueDescriptor = getPropertyValueDescriptor(
      this.props.item.node,
      this.props.frameInfo,
      this.props.reifiedBytecode,
      this.props.serializedBytecode,
      this.props.component,
      this.props.timelineTime,
      this.props.timelineName,
      this.props.item.property,
      { numFormat: '0,0[.]000' }
    )
    return (
      <div
        id={propertyId}
        className='property-input-field-box'
        style={{
          height: this.props.rowHeight - 1,
          width: this.props.inputCellWidth,
          position: 'relative',
          outline: 'none'
        }}
        onClick={() => {
          this.props.parent.setState({
            inputFocused: null,
            inputSelected: this.props.item
          })
        }}
        onDoubleClick={() => {
          this.props.parent.setState({
            inputSelected: this.props.item,
            inputFocused: this.props.item
          })
        }}>
        <div
          className='property-input-field no-select'
          style={lodash.assign({
            position: 'absolute',
            outline: 'none',
            color: 'transparent',
            textShadow: '0 0 0 ' + Color(Palette.ROCK).fade(0.3), // darkmagic
            minWidth: 83,
            height: this.props.rowHeight + 1,
            paddingLeft: 7,
            paddingTop: 3,
            zIndex: 1004,
            paddingRight: 15,
            lineHeight: '20px',
            borderTopLeftRadius: 4,
            borderBottomLeftRadius: 4,
            fontSize: 13,
            border: '1px solid ' + Palette.DARKER_GRAY,
            backgroundColor: Palette.LIGHT_GRAY,
            overflow: 'hidden',
            fontFamily: 'inherit',
            cursor: 'default'
          }, isItemEqual(this.props.inputSelected, this.props.item) && {
            border: '1px solid ' + Color(Palette.LIGHTEST_PINK).fade(0.2),
            zIndex: 2005
          })}>
          {valueDescriptor.prettyValue}
        </div>
      </div>
    )
  }
}
