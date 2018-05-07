import React from 'react'
import Palette from 'haiku-ui-common/lib/Palette'
import {ComponentIconSVG} from 'haiku-ui-common/lib/react/OtherIcons'
import Color from 'color'

export default class ComponentHeadingRowHeading extends React.Component {
  constructor (props) {
    super(props)
    this.handleUpdate = this.handleUpdate.bind(this)
  }

  componentWillUnmount () {
    this.mounted = false
    this.props.row.removeListener('update', this.handleUpdate)
    this.props.row.host.removeListener('update', this.handleUpdate)
  }

  componentDidMount () {
    this.mounted = true
    this.props.row.on('update', this.handleUpdate)
    this.props.row.host.on('update', this.handleUpdate)
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
    let color = Palette.ROCK_MUTED

    if (this.props.row.isSelected()) {
      color = Palette.SUNSTONE
    } else if (this.props.row.isExpanded()) {
      color = Palette.ROCK
    }

    if (this.props.row.isHovered()) {
      color = Color(color).lighten(0.25)
    }

    const elementName = this.props.row.element.getNameString()

    return (
      (this.props.row.isRootRow())
        ? (<div style={{height: 27, display: 'inline-block', transform: 'translateY(1px)'}}>
          <span style={{marginRight: 4, display: 'inline-block', transform: 'translateY(4px)'}}>
            <ComponentIconSVG />
          </span>
          {trunc(this.props.row.element.getTitle() || elementName, 12)}
        </div>)
        : (<span
          style={{
            color,
            position: 'relative',
            zIndex: 1005,
            marginLeft: 25,
            display: 'inline-block',
            width: 100,
            height: 20
          }}>
          <span
            style={{
              position: 'absolute',
              display: 'inline-block',
              height: 20,
              left: 2,
              top: 8
            }}>
            {(this.props.row.element.isComponent()) &&
            <ComponentIconSVG />}
          </span>
          <span
            style={{
              position: 'absolute',
              display: 'inline-block',
              height: 20,
              left: (this.props.row.element.isComponent())
                  ? 21
                  : 5,
              top: 7,
              overflowX: 'hidden',
              width: 160
            }}>
            {trunc(this.props.row.element.getTitle() || `<${elementName}>`, 8)}
          </span>
        </span>)
    )
  }
}

const trunc = (str, len) => {
  if (str.length <= len) {
    return str
  }

  return `${str.slice(0, len)}…`
}

ComponentHeadingRowHeading.propTypes = {
  row: React.PropTypes.object.isRequired
}
