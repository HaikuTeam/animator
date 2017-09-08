import React from 'react'
import Radium from 'radium'
import Color from 'color'
import Palette from './../Palette'
import { truncate } from './../../helpers'
import { Draggable } from 'react-drag-and-drop'
import { PrimitiveIconSVG } from './../Icons'

const STYLES = {
  card: {
    position: 'relative',
    paddingLeft: 20,
    paddingTop: 2,
    fontSize: 13,
    paddingBottom: 2,
    cursor: 'move',
    marginLeft: 27,
    whiteSpace: 'nowrap',
    ':hover': {
      backgroundColor: Palette.DARK_GRAY
    }
  },
  cardIcon: {
    position: 'absolute',
    top: 3,
    bottom: 0,
    left: 0,
    width: 18,
    height: 18,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  cardPreview: {
    opacity: 0,
    position: 'absolute',
    top: 3,
    left: 22,
    zIndex: 2,
    padding: 8,
    backgroundColor: Color(Palette.COAL).fade(0.4),
    border: '1px solid rgba(0,0,0,.2)',
    width: 180,
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
    transform: 'translateX(-10px)',
    transition: 'transform 270ms ease'
  },
  show: {
    opacity: 1,
    display: 'flex',
    transform: 'translateX(0)'
  },
  cardImage: {
    pointerEvents: 'none',
    height: 14,
    width: 14
  },
  inTree: {
    marginLeft: 4
  }
}

class LibraryItem extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isHovered: false,
      isDragging: false
    }
  }

  getFileName () {
    var name = this.props.fileName || ''
    name = name.replace('.svg', '')
    name = truncate(name, 22)
    return name
  }

  render () {
    let src = `${escape(this.props.preview)}?t=${this.props.updateTime}`
    const icon = this.props.isPrimitive
      ? <span style={STYLES.cardIcon}>
        <PrimitiveIconSVG type={this.props.fileName} />
      </span>
      : <span style={STYLES.cardIcon}
        onMouseOver={() => this.setState({isHovered: true})}
        onMouseOut={() => this.setState({isHovered: false})}>
        <img style={STYLES.cardImage} src={`file://${src}`} />
        <img style={[
          STYLES.cardPreview,
          this.state.isHovered && STYLES.show,
          this.state.isDragging && {display: 'none'}
        ]}
          src={`file://${src}`} />
      </span>

    return (
      <div style={[this.props.inTree && STYLES.inTree]}>
        <Draggable
          onDragEnd={(dragEndEvent) => {
            this.setState({isDragging: false})
            this.props.onDragEnd(dragEndEvent.nativeEvent, this.props)
            this.props.toggleLibAssetDraggingState()
          }}
          onDragStart={(dragStartEvent) => {
            this.setState({isDragging: true})
            this.props.onDragStart(dragStartEvent.nativeEvent, this.props)
            this.props.websocket.set('dragee', this.props)
            this.props.toggleLibAssetDraggingState()
          }}>
          <div
            style={STYLES.card}
            onDoubleClick={() => this.props.instantiate(this.props)}
            key={`asset-${this.props.preview}`}>
            {icon}
            { this.getFileName() }
          </div>
        </Draggable>
      </div>
    )
  }
}

export default Radium(LibraryItem)
