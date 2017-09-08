import React from 'react'
import Color from 'color'
import lodash from 'lodash'
import debounce from 'lodash.debounce'
import async from 'async'
import Radium from 'radium'
import path from 'path'
import Palette from './../Palette'
import LibraryItem from './LibraryItem'
import CollapseItem from './CollapseItem'
import RectanglePrimitiveProps from './../../primitives/Rectangle'
import EllipsePrimitiveProps from './../../primitives/Ellipse'
import PolygonPrimitiveProps from './../../primitives/Polygon'
import TextPrimitiveProps from './../../primitives/Text'
// import { BTN_STYLES } from '../../styles/btnShared'

// List of extnames which, upon change, should trigger an asset listing refresh.
// (We shouldn't need to change the list based on script changes, etc.)
const ASSET_RELOAD_TRIGGERS = {
  '.svg': true,
  '.sketch': true
}

const STYLES = {
  scrollwrap: {
    overflowY: 'auto',
    height: 'calc(100% - 136px)'
  },
  sectionHeader: {
    cursor: 'default',
    height: 25,
    textTransform: 'uppercase',
    display: 'flex',
    alignItems: 'center',
    paddingLeft: 14,
    paddingRight: 14,
    paddingTop: 18,
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
  }
}

class LibraryDrawer extends React.Component {
  constructor (props) {
    super(props)
    this.assetsList = this.assetsList.bind(this)
    this.handleFileDrop = this.handleFileDrop.bind(this)
    this.reloadAssetList = this.reloadAssetList.bind(this)
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
      isDraggingLibAsset: false,
      isLoading: false,
      empty: false
    }
  }

  componentWillMount () {
    this.setState({isLoading: true})
    this.reloadAssetList()
    this.debouncedReloadAssetList = debounce(this.reloadAssetList, 1000, { trailing: true })
    this.props.websocket.on('broadcast', (message) => {
      if (message.name === 'file:add' || message.name === 'file:change' || message.name === 'file:remove') {
        if (ASSET_RELOAD_TRIGGERS[path.extname(message.relpath)]) {
          this.debouncedReloadAssetList(message)
        }
      }
    })
  }

  reloadAssetList () {
    return this.props.websocket.request({ method: 'listAssets', params: [this.props.folder] }, (error, assets) => {
      if (error) return this.setState({ error })
      const empty = assets.length === 0
      this.setState({ assets, empty })
      setTimeout(() => {
        this.setState({ isLoading: false })
      }, 1000)
    })
  }

  handleAssetInstantiation (fileData) {
    if (!fileData.preview) return this.props.createNotice({ type: 'warning', title: 'Oops!', message: 'File path was blank; cannot instantiate' })
    const metadata = {}
    this.props.websocket.request({ type: 'action', method: 'instantiateComponent', params: [this.props.folder, fileData.preview, metadata] }, (err) => {
      if (err) {
        return this.props.createNotice({ type: 'danger', title: err.name, message: err.message })
      }
    })
  }

  handleFileDrop (files, event) {
    this.setState({isLoading: true})
    return async.eachSeries(files, (file, next) => {
      return this.props.websocket.request({ method: 'linkAsset', params: [file.path, this.props.folder] }, (error) => {
        if (error) return next(error)
        return next()
      })
    }, (error) => {
      this.setState({isLoading: false})
      if (error) return this.setState({ error })
    })
  }

  toggleLibAssetDraggingState () {
    this.setState({isDraggingLibAsset: !this.state.isDraggingLibAsset})
  }

  assetsList (currentAssets) {
    return (
      (!currentAssets || currentAssets.length < 1)
      ? (this.state.empty
        ? <div style={STYLES.startText}>Import a Sketch or SVG file to start</div>
        : <div />)
      : <div>
        {lodash.map(currentAssets, (file, index) => {
          return (
            <div key={`item-${file.fileName}-${index}`}>
              {file.type !== 'sketch'
                ? <LibraryItem
                  key={file.fileName}
                  preview={file.preview}
                  fileName={file.fileName}
                  onDragEnd={this.props.onDragEnd}
                  onDragStart={this.props.onDragStart}
                  toggleLibAssetDraggingState={this.toggleLibAssetDraggingState.bind(this)}
                  updateTime={file.updateTime}
                  websocket={this.props.websocket}
                  instantiate={this.handleAssetInstantiation.bind(this, file)} />
                : <CollapseItem
                  key={file.fileName}
                  file={file}
                  folder={this.props.folder}
                  onDragEnd={this.props.onDragEnd}
                  onDragStart={this.props.onDragStart}
                  websocket={this.props.websocket}
                  toggleLibAssetDraggingState={this.toggleLibAssetDraggingState.bind(this)}
                  instantiate={this.handleAssetInstantiation.bind(this, file)} />
              }
            </div>
          )
        })}
      </div>
    )
  }

  propsForPrimitive (name) {
    return this.primitives[name]
  }

  render () {
    return (
      <div>
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
            {this.state.isLoading
              ? ''
              : this.assetsList(this.state.assets)}
          </div>
        </div>
      </div>
    )
  }
}

export default Radium(LibraryDrawer)
