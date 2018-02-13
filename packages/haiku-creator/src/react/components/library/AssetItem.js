import React from 'react'
import Radium from 'radium'
import Color from 'color'
import lodash from 'lodash'
import Asset from 'haiku-serialization/src/bll/Asset'
import { Draggable } from 'react-drag-and-drop'
import AssetList from './AssetList'
import PopoverMenu from 'haiku-ui-common/lib/electron/PopoverMenu'
import Palette from 'haiku-ui-common/lib/Palette'
import Popover from 'react-popover'
import {
  CollapseChevronRightSVG,
  CollapseChevronDownSVG,
  SketchIconSVG,
  FolderIconSVG,
  TrashIconSVG,
  ComponentIconSVG
} from 'haiku-ui-common/lib/react/OtherIcons'

const {shell} = require('electron')

const STYLES = {
  container: {
    position: 'relative'
  },
  sublevel: {
    position: 'relative'
  },
  row: {
    position: 'relative',
    paddingLeft: 13,
    userSelect: 'none',
    cursor: 'pointer',
    paddingTop: 2,
    paddingBottom: 2,
    marginTop: 2,
    marginBottom: 2,
    fontSize: 13,
    ':hover': {
      backgroundColor: Palette.DARKER_GRAY
    }
  },
  header: {
    position: 'relative'
  },
  chevy: {
    marginRight: 8
  },
  cardIcon: {
    position: 'relative',
    top: 3,
    width: 18,
    height: 18,
    marginRight: 8
  },
  displayName: {
    display: 'inline-block',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    width: 'calc(100% - 85px)',
    whiteSpace: 'nowrap',
    verticalAlign: 'middle',
    active: {
      color: Palette.BLUE
    }
  },
  message: {
    marginLeft: 55,
    marginRight: 30,
    lineHeight: '16px',
    color: Palette.DARKER_ROCK2
  },
  draggableCardWrapper: {
    // position: 'relative'
    // paddingLeft: 20,
    // paddingTop: 2,
    // fontSize: 13,
    // paddingBottom: 2,
    // cursor: 'move',
    // marginLeft: 27,
    // whiteSpace: 'nowrap',
    // ':hover': {
    //   backgroundColor: Palette.DARK_GRAY,
    // },
  },
  cardImage: {
    pointerEvents: 'none',
    height: 14,
    width: 14
  },
  cardPreview: {
    position: 'absolute',
    opacity: 0,
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
    transform: 'translateY(50%)',
    transition: 'transform 270ms ease',
    shown: {
      opacity: 1,
      display: 'flex',
      transform: 'translateX(0)'
    }
  }
}

class AssetItem extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isHovered: false,
      isDragging: false,
      isOpened: true
    }

    this.handleCollapseToggle = this.handleCollapseToggle.bind(this)
    this.handleInstantiate = lodash.debounce(this.handleInstantiate.bind(this), 500, { trailing: true })
    this.launchPopoverMenu = this.launchPopoverMenu.bind(this)
  }

  handleDeleteAsset () {
    this.props.deleteAsset(this.props.asset)
  }

  handleInstantiate () {
    this.props.instantiateAsset(this.props.asset)
  }

  handleCollapseToggle () {
    this.setState({isOpened: !this.state.isOpened})
  }

  handleOpenAsset () {
    shell.openItem(this.props.asset.getAbspath())
    this.props.onAssetOpened()
  }

  handleShowAsset () {
    shell.showItemInFolder(this.props.asset.getAbspath())
  }

  renderChevy () {
    if (this.props.asset.getChildAssets().length < 1) {
      // An 'invisible' chevron; I don't recall why we do this
      return (
        <span style={STYLES.chevy}>
          <CollapseChevronDownSVG color='transparent' />
        </span>
      )
    }

    if (this.state.isOpened) {
      return (
        <span
          onClick={this.handleCollapseToggle}
          style={STYLES.chevy}>
          <CollapseChevronDownSVG />
        </span>
      )
    }

    return (
      <span
        onClick={this.handleCollapseToggle}
        style={STYLES.chevy}>
        <CollapseChevronRightSVG />
      </span>
    )
  }

  launchPopoverMenu (event) {
    PopoverMenu.launch({
      event,
      items: this.getAssetMenuItems()
    })
  }

  getAssetMenuItems () {
    const items = []

    if (this.props.asset.isSketchFile()) {
      items.push({
        label: 'Open In Sketch',
        icon: SketchIconSVG,
        onClick: this.handleOpenAsset.bind(this)
      })
    }

    items.push({
      label: 'Show In Finder',
      icon: FolderIconSVG,
      onClick: this.handleShowAsset.bind(this)
    })

    items.push({
      label: 'Delete',
      icon: TrashIconSVG,
      onClick: this.handleDeleteAsset.bind(this)
    })

    return items
  }

  renderThreeDotMenu () {
    if (
      this.props.asset.isSketchFile() ||
      this.props.asset.isOrphanSvg() ||
      this.props.asset.isComponentOtherThanMain()
    ) {
      return (
        <span
          className='three-dot-menu-container'
          style={{ position: 'absolute', right: 10 }}>
          <button
            onClick={this.launchPopoverMenu}
            style={{
              padding: '0 5px',
              backgroundColor: Palette.DARK_GRAY,
              color: Palette.ROCK
            }}>
            &#5867;&#5867;&#5867;
          </button>
        </span>
      )
    }

    return ''
  }

  renderIcon () {
    if (this.props.asset.kind === Asset.KINDS.COMPONENT) {
      return (
        <span
          className='component-icon-container'
          onDoubleClick={this.handleInstantiate}
          style={STYLES.cardIcon}>
          <ComponentIconSVG
            color={(this.isAssetOfActiveComponent())
              ? Palette.BLUE
              : void (0)}
            />
        </span>
      )
    }

    if (this.props.asset.kind === Asset.KINDS.SKETCH) {
      return (
        <span
          className='sketch-icon-container'
          onDoubleClick={this.handleInstantiate}
          style={STYLES.cardIcon}>
          <SketchIconSVG />
        </span>
      )
    }

    if (this.props.asset.kind === Asset.KINDS.FOLDER) {
      return (
        <span
          className='folder-icon-container'
          style={STYLES.cardIcon}>
          <FolderIconSVG />
        </span>
      )
    }

    if (this.props.asset.kind === Asset.KINDS.VECTOR) {
      const imageSrc = `${escape(this.props.asset.getAbspath())}?t=${this.props.asset.dtModified}`
      return (
        <span
          className='thumbnail-icon-container'
          style={STYLES.cardIcon}
          onDoubleClick={this.handleInstantiate}
          onMouseOver={() => {
            this.setState({isHovered: true})
          }}
          onMouseOut={() => {
            this.setState({isHovered: false})
          }}>
          <Popover
            isOpen={this.state.isHovered && !this.state.isDragging}
            style={STYLES.cardPreview}
            preferPlace={'right'}
            body={<img src={`file://${imageSrc}`} style={{width: '170px', height: '170px'}} />}
            tipSize={0.01}
          >
            <img style={STYLES.cardImage} src={`file://${imageSrc}`} />
          </Popover>
        </span>
      )
    }

    return ''
  }

  isAssetOfActiveComponent () {
    return this.props.asset.getRelpath() === this.props.projectModel.getCurrentActiveComponentRelpath()
  }

  renderDisplayName () {
    return (
      <span
        className='display-name-container'
        onDoubleClick={this.handleInstantiate}
        onContextMenu={this.launchPopoverMenu}
        style={[STYLES.displayName, this.isAssetOfActiveComponent() && STYLES.displayName.active]}>
        {this.props.asset.displayName}
      </span>
    )
  }

  renderSubLevel () {
    return (
      <Collapse
        isOpened={this.state.isOpened}>
        <AssetList
          projectModel={this.props.projectModel}
          onDragStart={this.props.onDragStart}
          onDragEnd={this.props.onDragEnd}
          instantiateAsset={this.props.instantiateAsset}
          onAssetOpened={this.props.onAssetOpened}
          deleteAsset={this.props.deleteAsset}
          assets={this.props.asset.getChildAssets()}
          indent={this.props.indent + 1} />
      </Collapse>
    )
  }

  render () {
    if (this.props.asset.kind === Asset.KINDS.HACKY_MESSAGE) {
      return (
        <div
          className='asset-item-container'
          style={[STYLES.container, STYLES.message]}>
          <span
            className='asset-message-container'>
            {this.props.asset.message}
          </span>
        </div>
      )
    }

    let draggablePart = (
      <span
        className='draggable-interior'>
        {this.renderIcon()}
        {this.renderDisplayName()}
      </span>
    )

    if (this.props.asset.isDraggable()) {
      draggablePart = (
        <Draggable
          className='library-draggable' /* <~ do not remove this */
          onDragEnd={(dragEndEvent) => {
            this.setState({isDragging: false})
            this.props.onDragEnd(dragEndEvent.nativeEvent, this.props.asset)
          }}
          onDragStart={(dragStartEvent) => {
            this.setState({isDragging: true})
            this.props.onDragStart(dragStartEvent.nativeEvent, this.props.asset)
          }}>
          <span
            className='draggable-interior-wrap'
            style={STYLES.draggableCardWrapper}
            onDoubleClick={this.handleInstantiate}>
            {draggablePart}
          </span>
        </Draggable>
      )
    }

    return (
      <div
        className='asset-item-container'
        style={[STYLES.container]}>
        <div
          className='asset-item-row'
          style={[STYLES.row]}>
          <div
            className='asset-item-header'
            style={[STYLES.header, { paddingLeft: this.props.indent * 23 }]}>
            {this.renderChevy()}
            {draggablePart}
            {this.renderThreeDotMenu()}
          </div>
        </div>
        <div
          className='asset-item-sublevel-container'
          style={[STYLES.sublevel]}>
          {this.renderSubLevel()}
        </div>
      </div>
    )
  }
}

class Collapse extends React.Component {
  render () {
    if (!this.props.isOpened) {
      return <div />
    }

    return (
      <div>{this.props.children}</div>
    )
  }
}

AssetItem.propTypes = {
  indent: React.PropTypes.number.isRequired,
  asset: React.PropTypes.object.isRequired,
  onDragEnd: React.PropTypes.func.isRequired,
  onDragStart: React.PropTypes.func.isRequired,
  instantiateAsset: React.PropTypes.func.isRequired,
  onAssetOpened: React.PropTypes.func.isRequired,
  deleteAsset: React.PropTypes.func.isRequired,
  projectModel: React.PropTypes.object.isRequired
}

export default Radium(AssetItem)
