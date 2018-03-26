import React from 'react'
import lodash from 'lodash'
import Radium from 'radium'
import { shell, ipcRenderer } from 'electron'
import { UserSettings } from 'haiku-sdk-creator/lib/bll/User'
import mixpanel from 'haiku-serialization/src/utils/Mixpanel'
import Palette from 'haiku-ui-common/lib/Palette'
import { didAskedForSketch } from 'haiku-serialization/src/utils/HaikuHomeDir'
import Asset from 'haiku-serialization/src/bll/Asset'
import Figma from 'haiku-serialization/src/bll/Figma'
import sketchUtils from '../../../utils/sketchUtils'
import SketchDownloader from '../SketchDownloader'
import AssetList from './AssetList'
import Loader from './Loader'
import FileImporter from './FileImporter'

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
  },
  link: {
    color: Palette.SUNSTONE,
    textDecoration: 'underline',
    cursor: 'pointer',
    display: 'inline-block'
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
      figma: null,
      sketchDownloader: {
        asset: null,
        isVisible: false,
        shouldAskForSketch: !didAskedForSketch()
      }
    }

    this.handleAssetInstantiation = this.handleAssetInstantiation.bind(this)
    this.handleAssetDeletion = this.handleAssetDeletion.bind(this)
    this.importFigmaAsset = this.importFigmaAsset.bind(this)

    // Debounced to avoid 'flicker' when multiple updates are received quickly
    this.handleAssetsChanged = lodash.debounce(this.handleAssetsChanged.bind(this), 250)

    this.broadcastListener = this.broadcastListener.bind(this)
    this.onAuthCallback = this.onAuthCallback.bind(this)
  }

  broadcastListener ({ name, assets, data }) {
    switch (name) {
      case 'assets-changed':
        return this.handleAssetsChanged(assets, {isLoading: false})
    }
  }

  handleAssetsChanged (assetsDictionary, otherStates) {
    const assets = Asset.ingestAssets(this.props.projectModel, assetsDictionary)
    const statesToSet = { assets }
    if (otherStates) lodash.assign(statesToSet, otherStates)
    this.setState(statesToSet)
  }

  componentDidMount () {
    this.setState({isLoading: true})

    this.reloadAssetList()

    this.props.websocket.on('broadcast', this.broadcastListener)
    ipcRenderer.on('open-url:oauth', this.onAuthCallback)

    sketchUtils.checkIfInstalled().then(isInstalled => {
      this.isSketchInstalled = isInstalled
    })

    this.props.user.getConfig(UserSettings.figmaToken).then((figmaToken) => {
      const figma = new Figma({token: figmaToken})
      this.setState({figma})
    })
  }

  componentWillUnmount () {
    this.props.websocket.removeListener('broadcast', this.broadcastListener)
    ipcRenderer.removeListener('open-url:oauth', this.onAuthCallback)
  }

  figmaAuthCallback ({state, code}) {
    Figma.getAccessToken({state, code, stateCheck: this.state.figmaState})
      .then(({AccessToken}) => {
        this.props.user.setConfig(UserSettings.figmaToken, AccessToken)
        this.state.figma.token = AccessToken
        this.props.createNotice({
          type: 'success',
          title: 'Yay!',
          message: 'You are authenticated with Figma'
        })
      })
      .catch((error) => {
        console.log(error)
        this.props.createNotice({
          type: 'danger',
          title: 'Error',
          message: 'There was an error while authenticating with Figma'
        })
      })
  }

  onAuthCallback (_, path, params) {
    switch (path) {
      case '/figma':
        this.figmaAuthCallback(params)
    }
  }

  askForFigmaAuth () {
    const {state, url} = Figma.buildAuthenticationLink()
    this.setState({figmaState: state})
    mixpanel.haikuTrack('creator:figma:askAuthentication')
    shell.openExternal(url)
  }

  reloadAssetList () {
    return this.props.projectModel.listAssets((error, assets) => {
      if (error) return this.setState({ error })
      this.handleAssetsChanged(assets, {isLoading: false})
    })
  }

  importFigmaAsset (url) {
    const path = this.props.projectModel.folder

    return this.state.figma.importSVG({url, path})
      .catch((error = {}) => {
        mixpanel.haikuTrack('creator:figma:fileImport:fail')

        let message = error.err || 'We had a problem connecting with Figma. Please check your internet connection and try again.'

        if (error.status === 403) {
          message = (
            <p>
              We had problems importing your file.{' '}
              If this problem persists, please click{' '}
              <a
                href='#'
                style={STYLES.link}
                onClick={() => {
                  this.askForFigmaAuth()
                }}
              >
                here
              </a>{' '}
              to log in with Figma again.
            </p>
          )
        }

        if (error.status === 404) {
          message = (
            <p>
              We couldn't access your file, please make sure that the file exists
              and you have access to it.<br />
              If you need to log in with another Figma account{' '}
              <a
                href='#'
                style={STYLES.link}
                onClick={() => {
                  this.askForFigmaAuth()
                }}
              >
                click here.
              </a>{' '}
            </p>
          )
        }

        this.props.createNotice({
          type: 'danger',
          title: 'Error',
          message
        })
      })
  }

  handleFileInstantiation (asset) {
    return this.props.projectModel.getCurrentActiveComponent().instantiateComponent(
      asset.getRelpath(),
      {x: 0, y: 0}, // Double click places the element at top-right
      {from: 'creator'},
      (err) => {
        if (err) {
          if (err.code === 'ENOENT') {
            return this.props.createNotice({ type: 'error', title: 'Error', message: 'We couldn\'t find that file. 😩 Please try again in a few moments. If you still see this error, contact Haiku for support.' })
          } else {
            return this.props.createNotice({ type: 'error', title: 'Error', message: err.message })
          }
        }
      }
    )
  }

  openSketchFile (asset) {
    shell.openItem(asset.getAbspath())
  }

  handleSketchInstantiation (asset) {
    if (this.isSketchInstalled) {
      this.openSketchFile(asset)
    } else {
      this.setState({sketchDownloader: {...this.state.sketchDownloader, isVisible: true, asset}})
    }
  }

  handleFigmaInstantiation (asset) {
    if (asset.relpath !== 'hacky-figma-file[1]') {
      shell.openExternal(Figma.buildFigmaLinkFromPath(asset.relpath))
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
        break
      case Asset.KINDS.FIGMA:
        this.handleFigmaInstantiation(asset)
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
        if (error) {
          return this.setState({error, isLoading: false})
        }

        this.handleAssetsChanged(assets, {isLoading: false})
      }
    )
  }

  handleFileDrop (filePaths) {
    this.setState({isLoading: true})
    this.props.projectModel.bulkLinkAssets(
      filePaths,
      (error, assets) => {
        if (error) {
          return this.setState({error, isLoading: false})
        }

        this.handleAssetsChanged(assets, {isLoading: false})
      }
    )
  }

  render () {
    return (
      <div
        id='library-wrapper'
        style={{height: '100%', display: this.props.visible ? 'initial' : 'none'}}>
        <div
          id='library-scroll-wrap'
          style={STYLES.sectionHeader}>
          Library
          <FileImporter
            onImportFigmaAsset={this.importFigmaAsset}
            onAskForFigmaAuth={() => { this.askForFigmaAuth() }}
            figma={this.state.figma}
            onFileDrop={(filePaths) => { this.handleFileDrop(filePaths) }}
          />
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
                figma={this.state.figma}
                onImportFigmaAsset={this.importFigmaAsset}
                onRefreshFigmaAsset={this.importFigmaAsset}
                onAskForFigmaAuth={() => { this.askForFigmaAuth() }}
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
