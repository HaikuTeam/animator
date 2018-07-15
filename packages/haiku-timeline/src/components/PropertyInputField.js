import * as React from 'react'
import * as lodash from 'lodash'
import * as Color from 'color'
import Palette from 'haiku-ui-common/lib/Palette'
import {Experiment, experimentIsEnabled} from 'haiku-common/lib/experiments'

const CELL_WIDTH = experimentIsEnabled(Experiment.NativeTimelineScroll) ? 82 : 83

export default class PropertyInputField extends React.Component {
  constructor (props) {
    super(props)
    this.handleUpdate = this.handleUpdate.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.handleDoubleClick = this.handleDoubleClick.bind(this)
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
    if (what === 'row-selected') {
      this.forceUpdate()
    } else if (what === 'row-deselected') {
      this.forceUpdate()
    } else if (what === 'keyframe-delete') {
      this.forceUpdate()
    } else if (what === 'keyframe-create') {
      this.forceUpdate()
    } else if (what === 'row-set-locked') {
      this.forceUpdate()
    }
  }

  handleClick (clickEvent) {
    this.props.row.blurOthers({ from: 'timeline' }) // Otherwise previously blurred remains open
    this.props.row.select({ from: 'timeline' })
    clickEvent.stopPropagation()
  }

  handleDoubleClick (clickEvent) {
    clickEvent.stopPropagation()
    this.props.row.blurOthers({ from: 'timeline' }) // Otherwise previously blurred remains open
    if (this.props.disabled) {
      return
    }

    this.props.row.focus({ from: 'timeline' })
    this.props.row.select({ from: 'timeline' })
  }

  render () {
    const propertyId = this.props.row.getInputPropertyId()
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
        onClick={this.handleClick}
        onDoubleClick={this.handleDoubleClick}>
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
          }, this.props.row === this.props.row.component.getSelectedRow() && {
            border: '1px solid ' + Color(Palette.LIGHTEST_PINK).fade(0.2),
            zIndex: 2005
          })}>
          <PropertyInputFieldValueDisplay
            timeline={this.props.timeline}
            row={this.props.row}
            />
        </div>
      </div>
    )
  }
}

class PropertyInputFieldValueDisplay extends React.Component {
  constructor (props) {
    super(props)
    this.handleUpdate = this.handleUpdate.bind(this)
  }

  componentWillUnmount () {
    this.mounted = false
    this.throttledForceUpdate.cancel()
    this.props.timeline.removeListener('update', this.handleUpdate)
  }

  componentDidMount () {
    this.mounted = true
    this.throttledForceUpdate = lodash.throttle(this.forceUpdate.bind(this), 64)
    this.props.timeline.on('update', this.handleUpdate)
  }

  handleUpdate (what) {
    if (!this.mounted) return null
    if (what === 'timeline-frame') {
      this.throttledForceUpdate()
    }
  }

  render () {
    const valueDescriptor = this.props.row.getPropertyValueDescriptor()

    return (
      <span>{remapPrettyValue(valueDescriptor.prettyValue)} {valueDescriptor.valueUnit}</span>
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
  disabled: React.PropTypes.bool
}

PropertyInputFieldValueDisplay.propTypes = {
  row: React.PropTypes.object.isRequired,
  timeline: React.PropTypes.object.isRequired
}
