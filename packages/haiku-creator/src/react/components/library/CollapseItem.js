import path from 'path'
import React from 'react'
import Radium from 'radium'
import Palette from '../Palette.js'
import Collapse from 'react-collapse'
import LibraryItem from './LibraryItem'
import ContextMenu from './../../ContextMenu'
import {
  CollapseChevronRightSVG,
  CollapseChevronDownSVG,
  SketchIconSVG,
  FolderIconSVG,
  TrashIconSVG
} from './../Icons'
import ThreeDotMenu from '../ThreeDotMenu'
const {shell} = require('electron')

const STYLES = {
  row: {
    paddingLeft: 13,
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
    padding: '4px 0 4px 13px',
    marginLeft: -13,
    ':hover': {
      backgroundColor: Palette.DARKER_GRAY
    }
  },
  fileName: {
    display: 'inline-block',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    width: 'calc(100% - 85px)',
    whiteSpace: 'nowrap',
    verticalAlign: 'middle'
  }
}

class CollapseItem extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isOpened: true
    }

    this.handleCollapseToggle = this.handleCollapseToggle.bind(this)
    this.handleSketchDoubleClick = this.handleSketchDoubleClick.bind(this)

    this.threeDotMenuItems = [
      {
        label: 'Open Sketch',
        icon: SketchIconSVG,
        onClick: this.props.instantiate
      },
      {
        label: 'Remove',
        icon: TrashIconSVG,
        onClick: this.props.delete
      }
    ]
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

  doesAssetHaveAnyDescendants () {
    if (this.props.collection && this.props.collection.length > 0) {
      return true
    }
    if (this.props.file) {
      if (this.props.file.artboards) {
        if (this.props.file.artboards.collection.length > 0) {
          return true
        }
      }
      if (this.props.file.slices) {
        if (this.props.file.slices.collection.length > 0) {
          return true
        }
      }
    }
    return false
  }

  renderChevy () {
    if (!this.doesAssetHaveAnyDescendants()) {
      return (
        <span style={STYLES.chevy}>
          <CollapseChevronDownSVG color='transparent' />
        </span>
      )
    }
    if (this.state.isOpened) {
      return (
        <span style={STYLES.chevy}>
          <CollapseChevronDownSVG />
        </span>
      )
    } else {
      return (
        <span style={STYLES.chevy}>
          <CollapseChevronRightSVG />
        </span>
      )
    }
  }

  handleSketchDoubleClick () {
    this.props.instantiate()
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
            instantiate={this.props.instantiate}
          />
        )
      })
    }

    return (
      <div style={STYLES.row}>
        <div
          onClick={this.handleCollapseToggle}
          style={file ? STYLES.header : {}}
          key={file ? `file-header-${file.fileName}` : ''}
        >
          {this.renderChevy()}
          {file ? (
            <span>
              <span
                onContextMenu={this.handleContextMenu.bind(this)}
                onDoubleClick={this.handleSketchDoubleClick}
                style={STYLES.icon}
              >
                <SketchIconSVG />
              </span>
              <span
                onContextMenu={this.handleContextMenu.bind(this)}
                onDoubleClick={this.handleSketchDoubleClick}
                style={STYLES.fileName}
              >
                {this.props.file.fileName}
              </span>
              <ThreeDotMenu
                items={this.threeDotMenuItems}
                isHovered={Radium.getState(
                  this.state,
                  `file-header-${file.fileName}`,
                  ':hover'
                )}
              />
            </span>
          ) : (
            <span>
              <span style={STYLES.icon}>
                <FolderIconSVG />
              </span>
              <span style={STYLES.fileName}>{this.props.name}</span>
            </span>
          )}
        </div>

        <Collapse
          isOpened={isOpened}
          springConfig={{stiffness: 177, damping: 17}}
        >
          {subLevel}
        </Collapse>
      </div>
    )
  }
}

export default Radium(CollapseItem)
