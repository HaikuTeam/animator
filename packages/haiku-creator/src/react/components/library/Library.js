import React from 'react'
import Color from 'color'
import lodash from 'lodash'
import Radium from 'radium'
import path from 'path'
import { didAskedForSketch } from 'haiku-serialization/src/utils/HaikuHomeDir'
import Asset from 'haiku-serialization/src/bll/Asset'
import { shell } from 'electron'
import Palette from 'haiku-ui-common/lib/Palette'
import SketchDownloader from '../SketchDownloader'
import sketchUtils from '../../../utils/sketchUtils'
import AssetList from './AssetList'
import Loader from './Loader'

const STYLES = {
  scrollwrap: {
    overflowY: 'auto',
    height: '100%'
  },
  sectionHeader: {
    cursor: 'default',
    // height: 25, // See note in StateInspector
    textTransform: 'uppercase',
    display: 'flex',
    alignItems: 'center',
    padding: '12px 14px 0',
    fontSize: 15,
    justifyContent: 'space-between'
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

class Library extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      error: null,
      assets: [],
      previewImageTime: null,
      overDropTarget: false,
      isLoading: false,
      sketchDownloader: {
        asset: null,
        isVisible: false,
        shouldAskForSketch: !didAskedForSketch()
      }
    }

    this._assets = []

    this.handleAssetInstantiation = this.handleAssetInstantiation.bind(this)
    this.handleAssetDeletion = this.handleAssetDeletion.bind(this)
  }

  handleAssetsChanged (assets) {
    this.setState({ assets: Asset.ingestAssets(this.props.projectModel, assets) })
  }

  componentDidMount () {
    this.setState({isLoading: true})

    this.reloadAssetList()

    this.props.websocket.on('broadcast', ({ name, assets }) => {
      if (name === 'assets-changed') {
        this.handleAssetsChanged(assets)
      }
    })

    sketchUtils.checkIfInstalled().then(isInstalled => {
      this.isSketchInstalled = isInstalled
    })
  }

  reloadAssetList () {
    return this.props.projectModel.listAssets((error, assets) => {
      if (error) return this.setState({ error })
      this.handleAssetsChanged(assets)
      this.setState({ isLoading: false })
    })
  }

  handleFileInstantiation (asset) {
    return this.props.projectModel.transmitInstantiateComponent(asset.getRelpath(), {}, (err) => {
      if (err) {
        return this.props.createNotice({ type: 'danger', title: err.name, message: err.message })
      }
    })
  }

  openSketchFile (asset) {
    const abspath = path.join(this.props.folder, 'designs', asset.getAbspath())
    shell.openItem(abspath)
  }

  handleSketchInstantiation (asset) {
    if (this.isSketchInstalled) {
      this.openSketchFile(asset)
    } else {
      this.setState({sketchDownloader: {...this.state.sketchDownloader, isVisible: true, asset}})
    }
  }

  onSketchDownloadComplete () {
    this.isSketchInstalled = true
    this.openSketchFile(this.state.sketchDownloader.asset)
    this.setState({sketchDownloader: {...this.state.sketchDownloader, isVisible: false, asset: null}})
  }

  onSketchDialogDismiss (shouldAskForSketch) {
    this.setState({sketchDownloader: {...this.state.sketchDownloader, isVisible: false, shouldAskForSketch}})
  }

  handleComponentInstantiation (asset) {
    // Yes, your observation is correct - this doesn't actually instantiate!
    // It just toggles the active component!
    // TODO: Rename/refactor - and note that this naming issue spans several methods here.

    const scenename = this.props.projectModel.relpathToSceneName(asset.getRelpath())
    this.props.projectModel.setCurrentActiveComponent(scenename, { from: 'creator' }, () => {})
  }

  handleAssetInstantiation (asset) {
    switch (asset.kind) {
      case Asset.KINDS.SKETCH:
        this.handleSketchInstantiation(asset)
        this.props.tourChannel.next()
        break
      case Asset.KINDS.VECTOR:
        this.handleFileInstantiation(asset)
        break
      case Asset.KINDS.COMPONENT:
        this.handleComponentInstantiation(asset)
        break
      default:
        this.props.createNotice({
          type: 'warning',
          title: 'Oops!',
          message: 'Couldn\'t handle that file, please contact support.'
        })
    }
  }

  handleAssetDeletion (asset) {
    this.setState({isLoading: true})
    return this.props.projectModel.unlinkAsset(
      asset.getRelpath(),
      (error, assets) => {
        this.setState({isLoading: false})
        if (error) {
          return this.setState({error})
        }
        this.setState({ assets, isLoading: false })
      }
    )
  }

  handleFileDrop (files, event) {
    this.setState({isLoading: true})
    const filePaths = lodash.map(files, file => file.path)
    this.props.projectModel.bulkLinkAssets(
      filePaths,
      (error, assets) => {
        this.setState({isLoading: false})
        if (error) {
          return this.setState({error})
        }
        this.handleAssetsChanged(assets)
      }
    )
  }

  render () {
    return (
      <div
        id='library-wrapper'
        style={{height: '100%'}}>
        <div
          id='library-scroll-wrap'
          style={STYLES.sectionHeader}>
          Library
          <button style={STYLES.button} onClick={this.launchFilepicker}>+</button>
          <input
            type='file'
            ref='filepicker'
            multiple
            onChange={(e) => this.handleFileDrop(this.refs.filepicker.files, e)}
            style={{opacity: 0, position: 'absolute', right: 0, width: 90, zIndex: 3}} />
        </div>
        <div
          id='library-scroll-wrap'
          style={STYLES.scrollwrap}>
          <div style={STYLES.assetsWrapper}>
            {this.state.isLoading
              ? <Loader />
              : <AssetList
                projectModel={this.props.projectModel}
                onDragStart={this.props.onDragStart}
                onDragEnd={this.props.onDragEnd}
                instantiateAsset={this.handleAssetInstantiation}
                deleteAsset={this.handleAssetDeletion}
                indent={0}
                assets={this.state.assets} />}
          </div>
        </div>
        {
          this.state.sketchDownloader.isVisible &&
          this.state.sketchDownloader.shouldAskForSketch && (
            <SketchDownloader
              onDownloadComplete={this.onSketchDownloadComplete.bind(this)}
              onDismiss={this.onSketchDialogDismiss.bind(this)}
            />
          )
        }
      </div>
    )
  }
}

Library.propTypes = {
  projectModel: React.PropTypes.object.isRequired
}

export default Radium(Library)
