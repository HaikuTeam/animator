/* global Raven */
import * as React from 'react';
import * as lodash from 'lodash';
import * as Radium from 'radium';
import * as Color from 'color';
import {shell, ipcRenderer} from 'electron';
import * as stringSimilarity from 'string-similarity';
import {UserSettings} from 'haiku-sdk-creator/lib/bll/User';
import * as mixpanel from 'haiku-serialization/src/utils/Mixpanel';
import {isMac} from 'haiku-common/lib/environments/os';
import Palette from 'haiku-ui-common/lib/Palette';
import {LoadingTopBar} from 'haiku-ui-common/lib/react/LoadingTopBar';
import {didAskedForSketch} from 'haiku-serialization/src/utils/HaikuHomeDir';
import * as Asset from 'haiku-serialization/src/bll/Asset';
import {Figma} from 'haiku-serialization/src/bll/Figma';
import * as sketchUtils from 'haiku-serialization/src/utils/sketchUtils';
import SketchDownloader from '../SketchDownloader';
import AssetList from './AssetList';
import FileImporter from './FileImporter';
import DesignFileCreator from './DesignFileCreator';
import ComponentSearchThumbnail from './../ComponentSearchThumbnail';
import {Experiment, experimentIsEnabled} from 'haiku-common/lib/experiments';

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
  loadingWrapper: {
    position: 'relative',
    width: '100%',
    height: 2,
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
      backgroundColor: Color(Palette.DARKER_GRAY).darken(0.2),
    },
    ':active': {
      transform: 'scale(.8)',
    },
  },
  searchHelpText: {
    display: 'block',
    marginTop: 15,
    marginLeft: 15,
  },
  searchResultsBox: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignContent: 'space-between',
    margin: 16,
  },
  searchResultLabelContainer: {
    display: 'block',
    color: Palette.ROCK,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    marginTop: 5,
  },
  searchResultContainer: {
    width: 100,
    marginBottom: 15,
  },
  librarySearchBar: {
    position: 'absolute',
    left: 50,
    right: 52,
    top: 51,
    height: 19,
    backgroundColor: Color(Palette.DARKER_GRAY).darken(0.4),
    borderRadius: 4,
    padding: '2px 6px',
  },
  librarySearchBarMagIcon: {
    position: 'absolute',
    left: 7,
    top: -2,
    transform: 'rotateZ(-45deg)',
    color: '#666',
  },
  librarySearchInput: {
    position: 'absolute',
    left: 22,
    top: 1,
    color: Palette.ROCK,
  },
  librarySearchCancelButton: {
    position: 'absolute',
    right: 7,
    top: 2,
    color: '#999',
    fontWeight: 'bold',
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
      loadingProgress: null,
      loadingSpeed: null,
      lockLoadingFromWatchers: false,
      figma: null,
      sketchDownloader: {
        isVisible: false,
        shouldAskForSketch: !didAskedForSketch(),
      },
      isSearchActive: false,
      isSearchLoading: false,
      searchTerm: '',
      searchTermPrevious: '',
      didSearchSubmit: false,
    };

    this.onAssetDoubleClick = this.onAssetDoubleClick.bind(this);
    this.handleAssetDeletion = this.handleAssetDeletion.bind(this);
    this.importFigmaAsset = this.importFigmaAsset.bind(this);
    this.askForFigmaAuth = this.askForFigmaAuth.bind(this);
    this.onSketchDialogDismiss = this.onSketchDialogDismiss.bind(this);

    // Debounced to avoid 'flicker' when multiple updates are received quickly
    this.handleAssetsChanged = lodash.debounce(
      this.handleAssetsChanged.bind(this),
      250,
      {leading: false, trailing: true},
    );

    this.handleProjectAssetsChanged = this.handleProjectAssetsChanged.bind(this);

    this.onAuthCallback = this.onAuthCallback.bind(this);

    this.debouncedPerformSearch = lodash.debounce(() => {
      this.performSearch();
    }, 500, {leading: false, trailing: true});

    // We call this here because this is an expensive operation and we want to avoid
    // executing it when the user tries to open a Sketch file. This first call
    // sets a cache in the module so further calls are very quick.
    sketchUtils.checkIfInstalled();
  }

  handleAssetsChanged (assetsDictionary, otherStates) {
    const assets = Asset.ingestAssets(this.props.projectModel, assetsDictionary);
    this.setState({assets, ...otherStates});
  }

  handleProjectAssetsChanged (assetsDictionary) {
    const additionalState = {};

    if (!this.state.lockLoadingFromWatchers) {
      additionalState.isLoading = false;
    }

    return this.handleAssetsChanged(assetsDictionary, additionalState);
  }

  componentDidMount () {
    this.setState({isLoading: true});
    this.reloadAssetList();

    ipcRenderer.on('open-url:oauth', this.onAuthCallback);

    // TODO: perform an actual check for Illustrator
    this.isIllustratorInstalled = true;

    this.props.user.getConfig(UserSettings.FigmaToken).then((figmaToken) => {
      const figma = new Figma({token: figmaToken});
      this.setState({figma});
    });

    this.props.projectModel.on('assets-reloaded', this.handleProjectAssetsChanged);
  }

  componentWillUnmount () {
    ipcRenderer.removeListener('open-url:oauth', this.onAuthCallback);
    this.props.projectModel.off('assets-reloaded', this.handleProjectAssetsChanged);
  }

  figmaAuthCallback ({state, code}) {
    if (!this.props.servicesEnvoyClient) {
      return;
    }

    this.props.servicesEnvoyClient.figmaGetAccessToken({state, code, stateCheck: this.state.figmaState})
      .then(({AccessToken}) => {
        this.props.user.setConfig(UserSettings.FigmaToken, AccessToken);
        this.state.figma.token = AccessToken;
        return this.props.createNotice({
          type: 'success',
          title: 'Yay!',
          message: 'You are authenticated with Figma',
        });
      })
      .catch((error) => {
        console.error(error);
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

    this.setState({isLoading: true, loadingProgress: 80, loadingSpeed: '20s', lockLoadingFromWatchers: true});
    const projectFolder = this.props.projectModel.folder;
    return this.props.servicesEnvoyClient.figmaImportSVG({url, projectFolder}, this.state.figma.token)
      .then(() => {
        this.setState({isLoading: false, loadingProgress: null, loadingSpeed: null, lockLoadingFromWatchers: false});
      })
      .catch((error = {}) => {
        const message = error.err || 'We had a problem connecting with Figma. Please check your internet connection and try again.';
        const reportData = {url, message};

        Raven.captureException(new Error(message), reportData);
        mixpanel.haikuTrack('creator:figma:fileImport:fail', reportData);
        this.setState({isLoading: false, progress: null, speed: null});

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
    sketchUtils.checkIfInstalled().then((isSketchInstalled) => {
      if (Boolean(isSketchInstalled)) {
        mixpanel.haikuTrack('creator:sketch:open-file');
        openWithDefaultProgram(asset);
        // On library Sketch asset double click, ask to download Sketch only if on mac
      } else if (isMac()) {
        mixpanel.haikuTrack('creator:sketch:sketch-not-installed');
        this.setState({sketchDownloader: {...this.state.sketchDownloader, isVisible: true}});
      }
    });
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

  onSketchDialogDismiss (shouldAskForSketch) {
    this.setState({sketchDownloader: {isVisible: false, shouldAskForSketch}});
    sketchUtils.unsetSketchInstalledCache();
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

  handleFileDrop = (filePaths) => {
    this.setState({isLoading: true});

    this.props.projectModel.bulkLinkAssets(
      filePaths,
      (error) => {
        if (error) {
          return this.setState({error, isLoading: false});
        }
      },
    );
  };

  shouldDisplaySearchResults () {
    return this.state.isSearchActive;
  }

  shouldDisplayAssetList () {
    if (this.shouldDisplaySearchResults()) {
      return false;
    }

    const componentshostFolder = this.state.assets.find((asset) => asset.isComponentsHostFolder());
    const designsFolder = this.state.assets.find((asset) => asset.isDesignsHostFolder());

    if (!componentshostFolder || !designsFolder) {
      return false;
    }

    return (
      componentshostFolder &&
      designsFolder &&
      (componentshostFolder.getChildAssets().length !== 0 || designsFolder.getChildAssets().length !== 0)
    );
  }

  shouldDisplayAssetCreator () {
    if (this.shouldDisplaySearchResults()) {
      return false;
    }

    const designsFolder = this.state.assets.find((asset) => asset.isDesignsHostFolder());

    return (
      designsFolder &&
      designsFolder.getChildAssets().length === 0
    );
  }

  fetchFilteredSearchResults (cb) {
    const projectsList = this.props.projectsList;

    if (!this.state.searchTerm || !projectsList) {
      return cb(null, []);
    }

    const termNormalized = this.state.searchTerm.trim().toLowerCase();
    const termLen = termNormalized.length;

    const filteredList = projectsList.filter(
      ({projectExistsLocally, projectName}) => {
        // For now, only allow search of projects we have a local copy of. #TODO
        if (!projectExistsLocally) {
          return false;
        }

        const projectNameNormalized = projectName.toLowerCase();

        // If an exact match with the first substring of our term, assume a match
        if (projectNameNormalized.slice(0, termLen) === termNormalized) {
          return true;
        }

        // Returns a fraction between 0 and 1 representing the similarity based on Dice's coefficient
        const stringSim = stringSimilarity.compareTwoStrings(projectNameNormalized, termNormalized);
        return stringSim > 0.5;
      },
    );

    return cb(null, filteredList);
  }

  renderLibrarySearchControl () {
    return (this.state.isSearchActive)
      ? this.renderLibrarySearchBar()
      : this.renderLibrarySearchButton();
  }

  handleSearch (searchTerm) {
    this.setState({
      searchTerm,
    }, () => {
      if (this.state.searchTerm === this.state.searchTermPrevious) {
        return;
      }

      this.setState({
        searchTermPrevious: this.state.searchTerm,
        isSearchLoading: this.state.searchTerm.length > 0,
      }, () => {
        this.debouncedPerformSearch();
      });
    });
  }

  performSearch () {
    this.fetchFilteredSearchResults((err, searchResults = []) => {
      if (err) {
        console.error(err);
      }

      this.setState({
        isSearchLoading: false,
        searchResults,
      });
    });
  }

  renderLibrarySearchBar () {
    return (
      <div
        id="library-search-bar"
        style={STYLES.librarySearchBar}>
        <div
          id="library-search-bar-mag"
          style={STYLES.librarySearchBarMagIcon}>
          &#9906;{/*Magnifying glass*/}
        </div>
        <form
          id="library-search-form"
          onSubmit={(submitEvent) => {
            submitEvent.preventDefault();
            this.handleSearch(document.getElementById('library-search-input').value);
          }}>
          <input
            id="library-search-input"
            style={STYLES.librarySearchInput}
            type="text"
            placeholder="Search"
            value={this.state.searchTerm}
            onChange={(changeEvent) => {
              this.handleSearch(changeEvent.target.value);
            }}>
          </input>
          <button
            type="button"
            style={STYLES.librarySearchCancelButton}
            onClick={() => {
              this.setState({
                didSearchSubmit: false,
                isSearchActive: false,
              });
            }}
            id="library-search-bar-cancel-button">
            ×
          </button>
        </form>
      </div>
    );
  }

  renderLibrarySearchButton () {
    return (
      <button
        id="library-search-button"
        aria-label="Search for components"
        data-tooltip={true}
        data-tooltip-bottom={true}
        style={{
          ...STYLES.button,
          ...{right: -60},
        }}
        onClick={() => {
          this.setState({
            isSearchActive: true,
          }, () => {
            const inputEl = document.getElementById('library-search-input');
            inputEl.focus();
            inputEl.select();
          });
        }}>
        <span style={{
          display: 'block',
          transform: 'rotateZ(-45deg)',
        }}>&#9906;{/*Magnifying glass*/}</span>
      </button>
    );
  }

  onAssetCreatorStart = () => {
    this.setState({isLoading: true});
  };

  render () {
    return (
      <div
        id="library-wrapper"
        style={{display: this.props.visible ? 'initial' : 'none'}}>
        <div style={STYLES.loadingWrapper}>
          <LoadingTopBar
            progress={this.state.loadingProgress || 100}
            done={!this.state.isLoading}
            speed={this.state.loadingSpeed || '0.5s'}
          />
        </div>
        <div
          id="library-heading-wrapper"
          style={STYLES.sectionHeader}>
          Library
          {experimentIsEnabled(Experiment.LocalMarketplace) && this.renderLibrarySearchControl()}
          <FileImporter
            websocket={this.props.websocket}
            projectModel={this.props.projectModel}
            onImportFigmaAsset={this.importFigmaAsset}
            onAskForFigmaAuth={this.askForFigmaAuth}
            figma={this.state.figma}
            conglomerateComponent={this.props.conglomerateComponent}
            onFileDrop={this.handleFileDrop}
          />
        </div>
        <div
          id="library-content-wrap"
          style={STYLES.scrollwrap}>
            <div style={STYLES.assetsWrapper}>
            {this.shouldDisplaySearchResults() && (
              <SearchResultItems
                isSearchLoading={this.state.isSearchLoading}
                searchTerm={this.state.searchTerm}
                searchResults={this.state.searchResults}
                projectModel={this.props.projectModel}
                globalLoaderOn={this.props.globalLoaderOn}
                globalLoaderOff={this.props.globalLoaderOff} />
            )}
            {this.shouldDisplayAssetList() && (
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
                conglomerateComponent={this.props.conglomerateComponent}
              />
            )}
            {this.shouldDisplayAssetCreator() && (
              <DesignFileCreator
                projectModel={this.props.projectModel}
                websocket={this.props.websocket}
                figma={this.state.figma}
                onAskForFigmaAuth={this.askForFigmaAuth}
                onImportFigmaAsset={this.importFigmaAsset}
                onRefreshFigmaAsset={this.importFigmaAsset}
                onStart={this.onAssetCreatorStart}
              />
            )}
            </div>
        </div>
        {
          this.state.sketchDownloader.isVisible &&
          this.state.sketchDownloader.shouldAskForSketch && (
            <SketchDownloader
              onDismiss={this.onSketchDialogDismiss}
            />
          )
        }
      </div>
    );
  }
}

class SearchResultItems extends React.Component {
  renderList () {
    return this.props.searchResults.map(({
      projectName,
      projectPath,
      projectExistsLocally,
    }, index) => {
      return (
        <div
          key={index}
          style={STYLES.searchResultContainer}>
          <ComponentSearchThumbnail
            projectName={projectName}
            projectPath={projectPath}
            projectExistsLocally={projectExistsLocally}
            handleIngest={() => {
              this.props.globalLoaderOn('Ingesting project…', () => {
                return this.props.projectModel.assimilateProjectSources(
                  projectPath,
                  projectName,
                  () => {
                    this.props.projectModel.once('assets-reloaded', () => {
                      this.props.globalLoaderOff();
                    });
                  },
                );
              });
            }}/>
          <span
            style={STYLES.searchResultLabelContainer}>
            {projectName}
          </span>
        </div>
      );
    });
  }

  render () {
    if (this.props.isSearchLoading) {
      return <span style={STYLES.searchHelpText}>Searching…</span>;
    }

    if (!this.props.searchResults || this.props.searchResults.length < 1) {
      // Don't show 'no results' unless the user has actually typed something
      if (this.props.searchTerm.length < 1) {
        return <span />;
      }
      return <span style={STYLES.searchHelpText}>No results.</span>;
    }

    return (
      <div
        id="search-results-box"
        style={STYLES.searchResultsBox}>
        {this.renderList()}
      </div>
    );
  }
}

Library.propTypes = {
  projectModel: React.PropTypes.object.isRequired,
};

export default Radium(Library);
