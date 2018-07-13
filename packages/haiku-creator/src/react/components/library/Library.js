/* global Raven */
import * as React from 'react';
import * as lodash from 'lodash';
import * as Radium from 'radium';
import {shell, ipcRenderer} from 'electron';
import {UserSettings} from 'haiku-sdk-creator/lib/bll/User';
import * as mixpanel from 'haiku-serialization/src/utils/Mixpanel';
import {isMac} from 'haiku-common/lib/environments/os';
import Palette from 'haiku-ui-common/lib/Palette';
import {didAskedForSketch} from 'haiku-serialization/src/utils/HaikuHomeDir';
import * as Asset from 'haiku-serialization/src/bll/Asset';
import {Figma} from 'haiku-serialization/src/bll/Figma';
import * as sketchUtils from 'haiku-serialization/src/utils/sketchUtils';
import SketchDownloader from '../SketchDownloader';
import AssetList from './AssetList';
import Loader from './Loader';
import FileImporter from './FileImporter';
import {Experiment, experimentIsEnabled} from 'haiku-common/lib/experiments';
import DesignFileCreator from './DesignFileCreator';

const openWithDefaultProgram = (asset) => {
  shell.openItem(asset.getAbspath());
};

const STYLES = {
  scrollwrap: {
    overflowY: 'auto',
    height: 'calc(100% - 35px)',
  },
  sectionHeader: {
    cursor: 'default',
    // height: 25, // See note in StateInspector
    textTransform: 'uppercase',
    display: 'flex',
    alignItems: 'center',
    padding: '12px 14px 0',
    fontSize: 15,
    justifyContent: 'space-between',
  },
  assetsWrapper: {
    paddingTop: 6,
    paddingBottom: 6,
    position: 'relative',
    minHeight: '300px',
    overflow: 'hidden',
  },
  fileDropWrapper: {
    pointerEvents: 'none',
  },
  startText: {
    color: Palette.COAL,
    fontSize: 25,
    padding: 24,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  primaryAssetText: {
    color: Palette.DARK_ROCK,
    fontSize: 16,
    padding: 24,
    textAlign: 'center',
  },
  link: {
    color: Palette.SUNSTONE,
    textDecoration: 'underline',
    cursor: 'pointer',
    display: 'inline-block',
  },
};

class Library extends React.Component {
  constructor (props) {
    super(props);

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
        shouldAskForSketch: !didAskedForSketch(),
      },
    };

    this.onAssetDoubleClick = this.onAssetDoubleClick.bind(this);
    this.handleAssetDeletion = this.handleAssetDeletion.bind(this);
    this.importFigmaAsset = this.importFigmaAsset.bind(this);
    this.askForFigmaAuth = this.askForFigmaAuth.bind(this);

    // Debounced to avoid 'flicker' when multiple updates are received quickly
    this.handleAssetsChanged = lodash.debounce(this.handleAssetsChanged.bind(this), 250);

    this.broadcastListener = this.broadcastListener.bind(this);
    this.onAuthCallback = this.onAuthCallback.bind(this);
  }

  broadcastListener ({name, assets, data}) {
    switch (name) {
      case 'assets-changed':
        return this.handleAssetsChanged(assets, {isLoading: false});
    }
  }

  handleAssetsChanged (assetsDictionary, otherStates) {
    const assets = Asset.ingestAssets(this.props.projectModel, assetsDictionary);
    const statesToSet = {assets};
    if (otherStates) {
      lodash.assign(statesToSet, otherStates);
    }
    this.setState(statesToSet);
  }

  componentDidMount () {
    this.setState({isLoading: true});

    this.reloadAssetList();

    this.props.websocket.on('broadcast', this.broadcastListener);
    ipcRenderer.on('open-url:oauth', this.onAuthCallback);

    sketchUtils.checkIfInstalled().then((sketchInstallationPath) => {
      this.isSketchInstalled = Boolean(sketchInstallationPath);
    });

    // TODO: perform an actual check for Illustrator
    this.isIllustratorInstalled = true;

    this.props.user.getConfig(UserSettings.figmaToken).then((figmaToken) => {
      const figma = new Figma({token: figmaToken});
      this.setState({figma});
    });
  }

  componentWillUnmount () {
    this.props.websocket.removeListener('broadcast', this.broadcastListener);
    ipcRenderer.removeListener('open-url:oauth', this.onAuthCallback);
  }

  figmaAuthCallback ({state, code}) {
    if (!this.props.servicesEnvoyClient) {
      return;
    }

    this.props.servicesEnvoyClient.figmaGetAccessToken({state, code, stateCheck: this.state.figmaState})
      .then(({AccessToken}) => {
        this.props.user.setConfig(UserSettings.figmaToken, AccessToken);
        this.state.figma.token = AccessToken;
        return this.props.createNotice({
          type: 'success',
          title: 'Yay!',
          message: 'You are authenticated with Figma',
        });
      })
      .catch((error) => {
        console.log(error);
        this.props.createNotice({
          type: 'danger',
          title: 'Error',
          message: 'There was an error while authenticating with Figma',
        });
      });
  }

  onAuthCallback (_, path, params) {
    switch (path) {
      case '/figma':
        this.figmaAuthCallback(params);
    }
  }

  askForFigmaAuth () {
    const {state, url} = Figma.buildAuthenticationLink();
    this.setState({figmaState: state});
    mixpanel.haikuTrack('creator:figma:askAuthentication');
    shell.openExternal(url);
  }

  reloadAssetList () {
    return this.props.projectModel.listAssets((error, assets) => {
      if (error) {
        return this.setState({error});
      }
      this.handleAssetsChanged(assets, {isLoading: false});
    });
  }

  importFigmaAsset (url) {
    if (!this.props.servicesEnvoyClient) {
      return;
    }

    const projectFolder = this.props.projectModel.folder;
    return this.props.servicesEnvoyClient.figmaImportSVG({url, projectFolder}, this.state.figma.token)
      .catch((error = {}) => {
        const message = error.err || 'We had a problem connecting with Figma. Please check your internet connection and try again.';
        const reportData = {url, message};

        Raven.captureException(new Error(message), reportData);
        mixpanel.haikuTrack('creator:figma:fileImport:fail', reportData);

        if (error.status === 403) {
          return this.props.createNotice({
            type: 'danger',
            title: 'Error',
            message: (
              <p>
                We had problems importing your file.{' '}
                If this problem persists, please click{' '}
                <a
                  href="#"
                  style={STYLES.link}
                  onClick={() => {
                    this.askForFigmaAuth();
                  }}
                >
                  here
                </a>{' '}
                to log in with Figma again.
              </p>
            ),
          });
        }

        if (error.status === 404) {
          return this.props.createNotice({
            type: 'danger',
            title: 'Error',
            message: (
              <p>
                We couldn't access your file, please make sure that the file exists
                and you have access to it.<br />
                If you need to log in with another Figma account{' '}
                <a
                  href="#"
                  style={STYLES.link}
                  onClick={() => {
                    this.askForFigmaAuth();
                  }}
                >
                  click here.
                </a>{' '}
              </p>
            ),
          });
        }

        if (error.status === 424) {
          return this.props.createNotice({
            type: 'info',
            title: 'Info',
            message,
          });
        }

        this.props.createNotice({
          type: 'danger',
          title: 'Error',
          message,
        });
      });
  }

  handleFileLaunch (asset) {
    openWithDefaultProgram(asset);
  }

  handleSketchLaunch (asset) {
    if (this.isSketchInstalled) {
      mixpanel.haikuTrack('creator:sketch:open-file');
      openWithDefaultProgram(asset);
    // On library Sketch asset double click, ask to download Sketch only if on mac
    } else if (isMac()) {
      mixpanel.haikuTrack('creator:sketch:sketch-not-installed');
      this.setState({sketchDownloader: {...this.state.sketchDownloader, isVisible: true, asset}});
    }
  }

  handleIllustratorLaunch (asset) {
    if (this.isIllustratorInstalled) {
      mixpanel.haikuTrack('creator:illustrator:open-file');
      openWithDefaultProgram(asset);
    } else {
      mixpanel.haikuTrack('creator:illustrator:illustrator-not-installed');
      this.props.createNotice({type: 'error', title: 'Error', message: 'You need to have Adobe Illustrator installed to open that file.'});
    }
  }

  handleFigmaLaunch (asset) {
    if (asset.relpath !== 'hacky-figma-file[1]') {
      shell.openExternal(Figma.buildFigmaLinkFromPath(asset.relpath));
    }
  }

  onSketchDownloadComplete () {
    this.isSketchInstalled = true;
    openWithDefaultProgram(this.state.sketchDownloader.asset);
    this.setState({sketchDownloader: {...this.state.sketchDownloader, isVisible: false, asset: null}});
  }

  onSketchDialogDismiss (shouldAskForSketch) {
    this.setState({sketchDownloader: {...this.state.sketchDownloader, isVisible: false, shouldAskForSketch}});
  }

  handleComponent (asset) {
    const scenename = asset.getSceneName();
    if (scenename) {
      this.props.projectModel.setCurrentActiveComponent(scenename, {from: 'creator'}, () => {});
    }
  }

  onAssetDoubleClick (asset) {
    if (!asset) {
      return;
    }

    switch (asset.kind) {
      case Asset.KINDS.SKETCH:
        this.handleSketchLaunch(asset);
        break;
      case Asset.KINDS.ILLUSTRATOR:
        this.handleIllustratorLaunch(asset);
        break;
      case Asset.KINDS.FIGMA:
        this.handleFigmaLaunch(asset);
        break;
      case Asset.KINDS.VECTOR:
        if (asset.isOrphanSvg()) {
          this.handleFileLaunch(asset);
        } else {
          this.onAssetDoubleClick(asset.parent);
        }
        break;
      case Asset.KINDS.COMPONENT:
        this.handleComponent(asset);
        break;
      case Asset.KINDS.FOLDER:
        this.onAssetDoubleClick(asset.parent);
        break;
    }
  }

  handleAssetDeletion (asset) {
    this.setState({isLoading: true});

    return this.props.projectModel.unlinkAsset(
      asset.getRelpath(),
      (error, assets) => {
        if (error) {
          return this.setState({error, isLoading: false});
        }

        this.handleAssetsChanged(assets, {isLoading: false});
      },
    );
  }

  handleFileDrop (filePaths) {
    this.setState({isLoading: true});

    this.props.projectModel.bulkLinkAssets(
      filePaths,
      (error, assets) => {
        if (error) {
          return this.setState({error, isLoading: false});
        }

        this.handleAssetsChanged(assets, {isLoading: false});
      },
    );
  }

  shouldDisplayAssetCreator () {
    const designsFolder = this.state.assets.find((asset) => asset.isDesignsHostFolder());

    return (
      experimentIsEnabled(Experiment.CleanInitialLibraryState) &&
      designsFolder &&
      designsFolder.getChildAssets().length === 0 &&
      !this.state.isLoading
    );
  }

  render () {
    return (
      <div
        id="library-wrapper"
        style={{height: '100%', display: this.props.visible ? 'initial' : 'none'}}>
        <div
          id="library-scroll-wrap"
          style={STYLES.sectionHeader}>
          Library
          <FileImporter
            websocket={this.props.websocket}
            projectModel={this.props.projectModel}
            onImportFigmaAsset={this.importFigmaAsset}
            onAskForFigmaAuth={this.askForFigmaAuth}
            figma={this.state.figma}
            onFileDrop={(filePaths) => {
              this.handleFileDrop(filePaths);
            }}
          />
        </div>
        <div
          id="library-scroll-wrap"
          style={STYLES.scrollwrap}>
            <div style={STYLES.assetsWrapper}>
              {this.shouldDisplayAssetCreator() ? (
                <DesignFileCreator
                  projectModel={this.props.projectModel}
                  websocket={this.props.websocket}
                  figma={this.state.figma}
                  onAskForFigmaAuth={this.askForFigmaAuth}
                  onImportFigmaAsset={this.importFigmaAsset}
                  onRefreshFigmaAsset={this.importFigmaAsset}
                />
              ) : (
                <AssetList
                  websocket={this.props.websocket}
                  projectModel={this.props.projectModel}
                  onDragStart={this.props.onDragStart}
                  onDragEnd={this.props.onDragEnd}
                  onAssetDoubleClick={this.onAssetDoubleClick}
                  figma={this.state.figma}
                  onImportFigmaAsset={this.importFigmaAsset}
                  onRefreshFigmaAsset={this.importFigmaAsset}
                  onAskForFigmaAuth={this.askForFigmaAuth}
                  deleteAsset={this.handleAssetDeletion}
                  indent={0}
                  assets={this.state.assets}
                />
              )}
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
    );
  }
}

Library.propTypes = {
  projectModel: React.PropTypes.object.isRequired,
};

export default Radium(Library);
