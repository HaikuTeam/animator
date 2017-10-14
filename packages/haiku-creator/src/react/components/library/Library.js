import React from 'react'
import Color from 'color'
import lodash from 'lodash'
import Radium from 'radium'
import path from 'path'
import Palette from './../Palette'
import LibraryItem from './LibraryItem'
import CollapseItem from './CollapseItem'
import SketchDownloader from '../SketchDownloader'
import RectanglePrimitiveProps from './../../primitives/Rectangle'
import EllipsePrimitiveProps from './../../primitives/Ellipse'
import PolygonPrimitiveProps from './../../primitives/Polygon'
import TextPrimitiveProps from './../../primitives/Text'
import sketchUtils from '../../../utils/sketchUtils'
import { shell } from 'electron'

const STYLES = {
  scrollwrap: {
    overflowY: 'auto',
    height: '100%'
  },
  sectionHeader: {
    cursor: 'default',
    height: 25,
    textTransform: 'uppercase',
    display: 'flex',
    alignItems: 'center',
    padding: '18px 14px 10px',
    fontSize: 15,
    justifyContent: 'space-between'
  },
  primitivesWrapper: {
    paddingTop: 6,
    paddingBottom: 6,
    position: 'relative',
    overflow: 'hidden'
  },
  assetsWrapper: {
    paddingTop: 6,
    paddingBottom: 6,
    position: 'relative',
    minHeight: '300px',
    overflow: 'hidden'
  },
  fileDropWrapper: {
    pointerEvents: 'none'
  },
  button: {
    position: 'relative',
    zIndex: 2,
    padding: '3px 9px',
    backgroundColor: Palette.DARKER_GRAY,
    color: Palette.ROCK,
    fontSize: 13,
    fontWeight: 'bold',
    marginTop: -4,
    borderRadius: 3,
    cursor: 'pointer',
    transform: 'scale(1)',
    transition: 'transform 200ms ease',
    ':hover': {
      backgroundColor: Color(Palette.DARKER_GRAY).darken(0.2)
    },
    ':active': {
      transform: 'scale(.8)'
    }
  },
  startText: {
    color: Palette.COAL,
    fontSize: 25,
    padding: 24,
    textAlign: 'center',
    fontStyle: 'italic'
  },
  primaryAssetText: {
    color: Palette.DARK_ROCK,
    fontSize: 16,
    padding: 24,
    textAlign: 'center'
  }
}

class LibraryDrawer extends React.Component {
  constructor (props) {
    super(props)
    this.primitives = {
      Rectangle: RectanglePrimitiveProps(props.websocket),
      Ellipse: EllipsePrimitiveProps(props.websocket),
      Polygon: PolygonPrimitiveProps(props.websocket),
      Text: TextPrimitiveProps(props.websocket)
    }
    this.state = {
      error: null,
      assets: [],
      previewImageTime: null,
      overDropTarget: false,
      isLoading: false,
      sketchDownloader: {
        isVisible: false,
        fileData: null
      }
    }
  }

  componentWillMount () {
    this.setState({isLoading: true})
    this.reloadAssetList()
    this.props.websocket.on('broadcast', ({ name, assets }) => {
      if (name === 'assets-changed') {
        this.setState({ assets })
      }
    })
    sketchUtils.checkIfInstalled().then(isInstalled => {
      this.isSketchInstalled = isInstalled
    })
  }

  reloadAssetList () {
    return this.props.websocket.request({ method: 'listAssets', params: [this.props.folder] }, (error, assets) => {
      if (error) return this.setState({ error })
      this.setState({ assets })
      setTimeout(() => {
        this.setState({ isLoading: false })
      }, 1000)
    })
  }

  handleFileInstantiation (fileData) {
    if (!fileData.preview) return this.props.createNotice({ type: 'warning', title: 'Oops!', message: 'File path was blank; cannot instantiate' })
    const metadata = {}
    this.props.websocket.request({ type: 'action', method: 'instantiateComponent', params: [this.props.folder, fileData.preview, metadata] }, (err) => {
      if (err) {
        return this.props.createNotice({ type: 'danger', title: err.name, message: err.message })
      }
    })
  }

  openSketchFile (fileData) {
    let abspath = path.join(this.props.folder, 'designs', fileData.fileName)
    shell.openItem(abspath)
  }

  handleSketchInstantiation(fileData) {
    if (this.isSketchInstalled) {
      this.openSketchFile(fileData)
    } else {
      this.setState({sketchDownloader: {isVisible: true, fileData}})
    }
  }

  onSketchDownloadComplete () {
    this.isSketchInstalled = true
    this.openSketchFile(this.state.sketchDownloader.fileData)
    this.setState({sketchDownloader: {isVisible: false, fileData: null}})
  }

  handleAssetInstantiation (fileData) {
    switch (fileData.type) {
      case 'sketch':
        this.handleSketchInstantiation(fileData)
        this.props.tourChannel.next()
        break
      case 'file':
        this.handleFileInstantiation(fileData)
        break
      default:
        this.props.createNotice({ type: 'warning', title: 'Oops!', message: 'Couldn\'t handle that file, please contact support.' })
    }
  }

  handleAssetDeletion (asset) {
    this.setState({isLoading: true})
    return this.props.websocket.request({ method: 'unlinkAsset', params: [asset.relpath, this.props.folder] }, (error, assets) => {
      if (error) this.setState({error, isLoading: false})
      if (assets) this.setState({ assets, isLoading: false })
    })
  }

  handleFileDrop (files, event) {
    this.setState({isLoading: true})

    const filePaths = lodash.map(files, file => file.path)

    this.props.websocket.request(
      {method: 'bulkLinkAssets', params: [filePaths, this.props.folder]},
      (error, assets) => {
        this.setState({isLoading: false})
        if (error) this.setState({error})
        this.setState({assets})
      }
    )
  }

  getPrimaryAsset () {
    if (!this.state.assets) return null
    if (this.state.assets.length < 1) return null
    let primary
    this.state.assets.forEach((asset) => {
      if (asset.isPrimaryDesign) {
        primary = asset
      }
    })
    return primary
  }

  getOtherAssets () {
    if (!this.state.assets) return []
    if (this.state.assets.length < 1) return []
    let others = []
    this.state.assets.forEach((asset) => {
      if (!asset.isPrimaryDesign) {
        others.push(asset)
      }
    })
    return others
  }

  renderPrimaryAsset (asset) {
    return this.renderAssetItem(asset, true)
  }

  renderPrimaryAssetHint (asset) {
    let hasSubAssets = false
    if (asset.artboards && asset.artboards.collection.length > 0) hasSubAssets = true
    if (asset.pages && asset.pages.collection.length > 0) hasSubAssets = true
    if (asset.slices && asset.slices.collection.length > 0) hasSubAssets = true

    if (hasSubAssets) {
      return ''
    } else {
      return (
        <div style={STYLES.primaryAssetText}>
          ⇧ Double click to open this file in Sketch.
          Every slice and artboard will be synced here when you save.
        </div>
      )
    }
  }

  renderAssetItem (asset, isPrimaryAsset) {
    if (asset.type === 'sketch') {
      return (
        <CollapseItem
          isPrimaryAsset={isPrimaryAsset}
          key={asset.fileName}
          file={asset}
          folder={this.props.folder}
          onDragEnd={this.props.onDragEnd}
          onDragStart={this.props.onDragStart}
          websocket={this.props.websocket}
          instantiate={this.handleAssetInstantiation.bind(this, asset)}
          delete={this.handleAssetDeletion.bind(this, asset)} />
      )
    }

    return (
      <LibraryItem
        key={asset.fileName}
        preview={asset.preview}
        fileName={asset.fileName}
        onDragEnd={this.props.onDragEnd}
        onDragStart={this.props.onDragStart}
        updateTime={asset.updateTime}
        websocket={this.props.websocket}
        instantiate={this.handleAssetInstantiation.bind(this, asset)}
        delete={this.handleAssetDeletion.bind(this, asset)} />
    )
  }

  renderOtherAssets (assets) {
    return (
      <div>
        {lodash.map(assets, (file, index) => {
          return (
            <div key={`item-${file.fileName}-${index}`}>
              {this.renderAssetItem(file)}
            </div>
          )
        })}
      </div>
    )
  }

  renderAssetsList () {
    let primaryAsset = this.getPrimaryAsset()
    let otherAssets = this.getOtherAssets()

    if (!primaryAsset && otherAssets.length < 1) {
      return (
        <div style={STYLES.startText}>
          Import a Sketch or SVG file to start
        </div>
      )
    }

    if (!primaryAsset && otherAssets.length > 0) {
      return (
        <div>
          {this.renderOtherAssets(otherAssets)}
        </div>
      )
    }

    if (primaryAsset && otherAssets.length < 1) {
      return (
        <div>
          {this.renderPrimaryAsset(primaryAsset)}
          {this.renderPrimaryAssetHint(primaryAsset)}
        </div>
      )
    }

    return (
      <div>
        {this.renderPrimaryAsset(primaryAsset)}
        {this.renderOtherAssets(otherAssets)}
      </div>
    )
  }

  propsForPrimitive (name) {
    return this.primitives[name]
  }

  render () {
    return (
      <div id='library-wrapper' style={{height: '100%'}}>
        <div style={STYLES.sectionHeader}>
          Library
          <button style={STYLES.button} onClick={this.launchFilepicker}>+</button>
          <input
            type='file'
            ref='filepicker'
            multiple
            onChange={(e) => this.handleFileDrop(this.refs.filepicker.files, e)}
            style={{opacity: 0, position: 'absolute', right: 0, width: 90, zIndex: 3}} />
        </div>
        <div style={STYLES.scrollwrap}>
          <div style={STYLES.assetsWrapper}>
            {this.state.isLoading ? '' : this.renderAssetsList()}
          </div>
        </div>
        {
          this.state.sketchDownloader.isVisible && (
            <SketchDownloader
              onDownloadComplete={this.onSketchDownloadComplete.bind(this)}
            />
          )
        }
      </div>
    )
  }
}

export default Radium(LibraryDrawer)
