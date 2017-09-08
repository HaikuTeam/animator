import path from 'path'
import React from 'react'
import Radium from 'radium'
import Palette from '../Palette.js'
import Collapse from 'react-collapse'
import LibraryItem from './LibraryItem'
import ContextMenu from './../../ContextMenu'
import { CollapseChevronRightSVG, CollapseChevronDownSVG, SketchIconSVG, FolderIconSVG } from './../Icons'
const {shell} = require('electron')

const STYLES = {
  row: {
    marginLeft: 13,
    userSelect: 'none',
    cursor: 'pointer',
    paddingTop: 2,
    paddingBottom: 2,
    marginBottom: 4,
    fontSize: 13
  },
  chevy: {
    marginRight: 6
  },
  icon: {
    position: 'relative',
    top: 3,
    marginRight: 6
  },
  header: {
    ':hover': { // has to be here for the Radium.getState to work
    }
  }
}

class CollapseItem extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isOpened: true
    }

    this.handleCollapseToggle = this.handleCollapseToggle.bind(this)
  }

  handleCollapseToggle () {
    this.setState({isOpened: !this.state.isOpened})
  }

  handleContextMenu (event) {
    const {folder, file} = this.props
    let menu = new ContextMenu(this, {
      library: true // Hacky: Used to configure what to display in the context menu; see ContextMenu.js
    })

    menu.on('context-menu:open-in-sketch', () => {
      var abspath = path.join(folder, 'designs', file.fileName)
      shell.openItem(abspath)
    })

    menu.on('context-menu:show-in-finder', () => {
      var abspath = path.join(folder, 'designs', file.fileName)
      shell.showItemInFolder(abspath)
    })
  }

  handleSketchDoubleClick () {
    var abspath = path.join(this.props.folder, 'designs', this.props.file.fileName)
    shell.openItem(abspath)
  }

  render () {
    const {isOpened} = this.state
    const {file} = this.props
    let subLevel = []

    if (file && file.artboards.collection.length > 0) {
      subLevel.push(
        <CollapseItem
          key={`boards-${file.fileName}`}
          name='Artboards'
          collection={file.artboards.collection}
          changePreview={this.props.changePreview}
          onDragEnd={this.props.onDragEnd}
          onDragStart={this.props.onDragStart}
          toggleLibAssetDraggingState={this.props.toggleLibAssetDraggingState}
          websocket={this.props.websocket}
          instantiate={this.props.instantiate}
        />
      )
    }

    if (file && file.slices.collection.length > 0) {
      subLevel.push(
        <CollapseItem
          key={`slices-${file.fileName}`}
          name='Slices'
          collection={file.slices.collection}
          changePreview={this.props.changePreview}
          onDragEnd={this.props.onDragEnd}
          onDragStart={this.props.onDragStart}
          toggleLibAssetDraggingState={this.props.toggleLibAssetDraggingState}
          websocket={this.props.websocket}
          instantiate={this.props.instantiate}
        />
      )
    }

    if (this.props.collection && this.props.collection.length > 0) {
      subLevel = this.props.collection.map((file) => {
        return (
          <LibraryItem
            inTree
            key={`myItem-${file.fileName}`}
            onDragEnd={this.props.onDragEnd}
            onDragStart={this.props.onDragStart}
            fileName={file.fileName}
            preview={file.preview}
            updateTime={file.updateTime}
            websocket={this.props.websocket}
            changePreview={this.props.changePreview}
            toggleLibAssetDraggingState={this.props.toggleLibAssetDraggingState}
            instantiate={this.props.instantiate}
          />
        )
      })
    }

    return (
      <div style={STYLES.row}>
        <div onClick={this.handleCollapseToggle}>
          <span style={STYLES.chevy} >
            {this.state.isOpened ? <CollapseChevronDownSVG /> : <CollapseChevronRightSVG />}
          </span>
          {this.props.file
            ? <span key={`file-header-${file.fileName}`} style={STYLES.header}>
              <span onContextMenu={this.handleContextMenu.bind(this)} onDoubleClick={this.handleSketchDoubleClick.bind(this)} style={STYLES.icon}>
                <SketchIconSVG style='' color={Radium.getState(this.state, `file-header-${file.fileName}`, ':hover') ? Palette.ORANGE : Palette.DARKER_ROCK} />
              </span>
              <span onContextMenu={this.handleContextMenu.bind(this)} onDoubleClick={this.handleSketchDoubleClick.bind(this)}>{this.props.file.fileName}</span>
            </span>
            : <span><span style={STYLES.icon}><FolderIconSVG /></span>{this.props.name}</span>
          }
        </div>

        <Collapse isOpened={isOpened} springConfig={{stiffness: 177, damping: 17}}>
          {subLevel}
        </Collapse>
      </div>
    )
  }
}

export default Radium(CollapseItem)
