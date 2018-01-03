import React from 'react'
import lodash from 'lodash'
import Color from 'color'
import Palette from 'haiku-ui-common/lib/Palette'

const CELL_WIDTH = 83

export default class PropertyInputField extends React.Component {
  constructor (props) {
    super(props)
    this.handleUpdate = this.handleUpdate.bind(this)
  }

  componentWillUnmount () {
    this.mounted = false
    this.props.timeline.removeListener('update', this.handleUpdate)
    this.props.row.removeListener('update', this.handleUpdate)
  }

  componentDidMount () {
    this.mounted = true
    this.props.timeline.on('update', this.handleUpdate)
    this.props.row.on('update', this.handleUpdate)
  }

  handleUpdate (what) {
    if (!this.mounted) return null
    if (what === 'timeline-frame') {
      this.forceUpdate()
    } else if (what === 'row-selected') {
      this.forceUpdate()
    } else if (what === 'row-deselected') {
      this.forceUpdate()
    } else if (what === 'keyframe-delete') {
      this.forceUpdate()
    } else if (what === 'keyframe-create') {
      this.forceUpdate()
    }
  }

  render () {
    let propertyId = this.props.row.getInputPropertyId()
    let valueDescriptor = this.props.row.getPropertyValueDescriptor()

    return (
      <div
        id={propertyId}
        className='property-input-field-box'
        style={{
          height: this.props.rowHeight - 1,
          width: CELL_WIDTH,
          position: 'relative',
          outline: 'none'
        }}
        onClick={(clickEvent) => {
          this.props.row.blurOthers({ from: 'timeline' }) // Otherwise previously blurred remains open
          this.props.row.select({ from: 'timeline' })
          clickEvent.stopPropagation()
        }}
        onDoubleClick={(clickEvent) => {
          this.props.row.blurOthers({ from: 'timeline' }) // Otherwise previously blurred remains open
          this.props.row.focus({ from: 'timeline' })
          this.props.row.select({ from: 'timeline' })
          clickEvent.stopPropagation()
        }}>
        <div
          className='property-input-field no-select'
          style={lodash.assign({
            position: 'absolute',
            outline: 'none',
            color: 'transparent',
            textShadow: '0 0 0 ' + Color(Palette.ROCK).fade(0.3), // darkmagic
            width: CELL_WIDTH,
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
          }, this.props.row.sameAs(this.props.row.component.getSelectedRow()) && {
            border: '1px solid ' + Color(Palette.LIGHTEST_PINK).fade(0.2),
            zIndex: 2005
          })}>
          {remapPrettyValue(valueDescriptor.prettyValue)}
        </div>
      </div>
    )
  }
}

function safeText (textOrObj) {
  if (typeof textOrObj === 'string') {
    return textOrObj
  }

  try {
    return JSON.stringify(textOrObj)
  } catch (exception) {
    return '?'
  }
}

function remapPrettyValue (prettyValue) {
  if (prettyValue && prettyValue.render === 'react') {
    return <span style={prettyValue.style}>{safeText(prettyValue.text)}</span>
  }
  return safeText(prettyValue)
}

PropertyInputField.propTypes = {
  row: React.PropTypes.object.isRequired,
  timeline: React.PropTypes.object.isRequired,
  rowHeight: React.PropTypes.number.isRequired,
  $update: React.PropTypes.object.isRequired
}
