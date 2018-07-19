import * as Radium from 'radium';
import * as React from 'react';
import * as qs from 'qs';
import * as assign from 'lodash.assign';
import * as path from 'path';
import StageTitleBar from './StageTitleBar';
import ComponentMenu from './ComponentMenu/ComponentMenu';
import CodeEditor from './CodeEditor/CodeEditor';
import Palette from 'haiku-ui-common/lib/Palette';
import {Experiment, experimentIsEnabled} from 'haiku-common/lib/experiments';
import {TOUR_CHANNEL} from 'haiku-sdk-creator/lib/tour';
import {
  isPreviewMode,
  isEditMode,
  showGlassOnStage,
} from 'haiku-ui-common/lib/interactionModes';

const STAGE_BOX_STYLE = {
  overflow: 'hidden',
  padding: 0,
  margin: 0,
  width: '100%',
  height: '100%',
  outline: 'none',
};

const STAGE_FADE_OUT = {
  transform: 'scale(0.95)',
  transition: 'visibility 0s linear 240ms, opacity 240ms, transform ease 240ms',
};

const STAGE_FADE_IN = {
  transform: 'scale(1)',
  transition: 'visibility 0s linear 0s, opacity 240ms, transform ease 240ms',
};

const clearAboutToChange = {
  aboutToChangeToComponent: '',
  aboutToChangeToEditMode: false,
  aboutToChangeToPreviewMode: false,
};

const STAGE_MOUNT_HEIGHT_OFFSET = 68;

class Stage extends React.Component {
  constructor (props) {
    super(props);
    this.webview = null;
    this.onRequestWebviewCoordinates = this.onRequestWebviewCoordinates.bind(this);
    this.tryToChangeCurrentActiveComponent = this.tryToChangeCurrentActiveComponent.bind(this);
    this.tryToSwitchToEditMode = this.tryToSwitchToEditMode.bind(this);
    this.tryToSwitchToPreviewMode = this.tryToSwitchToPreviewMode.bind(this);
    this.saveCodeFromEditorToDisk = this.saveCodeFromEditorToDisk.bind(this);
    this.executeActionAfterCodeEditorSavePopup = this.executeActionAfterCodeEditorSavePopup.bind(this);
    this.closeCodeEditorSavePopup = this.closeCodeEditorSavePopup.bind(this);

    this.state = {
      nonSavedContentOnCodeEditor: false,
      showPopupToSaveRawEditorContents: false,
      ...clearAboutToChange,
    };
  }

  // Check if currently edited file is open
  tryToChangeCurrentActiveComponent (scenename) {
    if (this.state.nonSavedContentOnCodeEditor) {
      this.setState({
        ...clearAboutToChange,
        aboutToChangeToComponent: scenename,
        showPopupToSaveRawEditorContents: true,
      });
    } else {
      // If on preview mode, switch to edit mode
      if (isPreviewMode(this.props.interactionMode)) {
        this.props.setGlassInteractionToEditMode();
      }

      this.props.projectModel.setCurrentActiveComponent(scenename, {from: 'creator'}, () => {});
    }
  }

  tryToSwitchToEditMode () {
    if (this.state.nonSavedContentOnCodeEditor) {
      this.setState({
        ...clearAboutToChange,
        aboutToChangeToEditMode: true,
        showPopupToSaveRawEditorContents: true,
      });
    } else {
      this.props.setGlassInteractionToEditMode();
    }
  }

  tryToSwitchToPreviewMode () {
    if (this.state.nonSavedContentOnCodeEditor) {
      this.setState({
        ...clearAboutToChange,
        aboutToChangeToPreviewMode: true,
        showPopupToSaveRawEditorContents: true,
      });
    } else {
      this.props.setGlassInteractionToPreviewMode();
    }
  }

  executeActionAfterCodeEditorSavePopup () {
    // Change to target
    if (this.state.aboutToChangeToEditMode) {
      this.props.setGlassInteractionToEditMode();
    } else if (this.state.aboutToChangeToPreviewMode) {
      this.props.setGlassInteractionToPreviewMode();
    } else if (this.state.aboutToChangeToComponent !== '') {
      // If on preview mode, switch to edit mode
      if (isPreviewMode(this.props.interactionMode)) {
        this.props.setGlassInteractionToEditMode();
      }

      this.props.projectModel.setCurrentActiveComponent(this.state.aboutToChangeToComponent, {from: 'creator'}, () => {});
    }

    this.closeCodeEditorSavePopup();
  }

  closeCodeEditorSavePopup () {
    // Exit popup
    this.setState({
      ...clearAboutToChange,
      showPopupToSaveRawEditorContents: false,
    });
  }

  componentDidMount () {
    this.injectWebview();

    const tourChannel = this.props.envoyClient.get(TOUR_CHANNEL);

    if (!this.props.envoyClient.isInMockMode()) {
      tourChannel.then((client) => {
        this.tourClient = client;
        this.tourClient.on('tour:requestWebviewCoordinates', this.onRequestWebviewCoordinates);
      });
    }
  }

  componentWillUnmount () {
    if (this.tourClient) {
      this.tourClient.off('tour:requestWebviewCoordinates', this.onRequestWebviewCoordinates);
    }
  }

  onRequestWebviewCoordinates () {
    const {top, left} = this.webview.getBoundingClientRect();
    if (this.tourClient) {
      this.tourClient.receiveWebviewCoordinates('glass', {top, left});
    }
  }

  injectWebview () {
    this.webview = document.createElement('webview');

    const query = qs.stringify(assign({}, this.props.haiku, {
      plumbing: this.props.haiku.plumbing.url,
      folder: this.props.folder,
      email: this.props.username,
      webview: true,
      envoy: {
        host: this.props.envoyClient.getOption('host'),
        port: this.props.envoyClient.getOption('port'),
        token: this.props.envoyClient.getOption('token'),
      },
    }));

    const url = `file://${require.resolve(path.join('haiku-glass', 'index.html'))}?${query}`;

    this.webview.setAttribute('src', url);
    this.webview.setAttribute('id', 'glass-webview');
    this.webview.setAttribute('nodeintegration', true);
    this.webview.style.width = '100%';
    this.webview.style.height = '100%';

    this.webview.addEventListener('console-message', (event) => {
      switch (event.level) {
        case 0:
          if (event.message.slice(0, 8) === '[notice]') {
            const msg = event.message.replace('[notice]', '').trim();
            this.props.createNotice({type: 'info', title: 'Notice', message: msg});
          }
          break;

        case 2:
          this.props.createNotice({
            type: 'error',
            title: 'Error',
            message: event.message,
          });

          break;
      }
    });

    this.webview.addEventListener('dom-ready', () => {
      if (process.env.DEV === '1' || process.env.DEV === 'glass') {
        this.webview.openDevTools();
      }
    });

    while (this.mount.firstChild) {
      this.mount.removeChild(this.mount.firstChild);
    }
    this.mount.appendChild(this.webview);
  }

  handleDrop (asset, clientX, clientY) {
    const ac = (
      this.props.projectModel &&
      this.props.projectModel.getCurrentActiveComponent()
    );

    if (!ac) {
      return;
    }

    const stageRect = this.mount.getBoundingClientRect();

    if (
      clientX > stageRect.left &&
      clientX < stageRect.right &&
      clientY > stageRect.top &&
      clientY < stageRect.bottom
    ) {
      // Coordinates with respect to 0,0 of the viewport
      const coords = {
        x: clientX - stageRect.left,
        y: clientY - stageRect.top,
      };

      // Instantiatees are translated with respect to the coordinate system of
      // the artboard, and the stage may have been zoomed/panned
      if (this.props.artboardDimensions) {
        const {zoom, rect} = this.props.artboardDimensions;

        coords.x -= rect.left;
        coords.y -= rect.top;

        coords.x /= zoom;
        coords.y /= zoom;
      }

      // Glass initiates the instantiation to avoid latency on the drag&drop event
      this.props.websocket.send({
        type: 'broadcast',
        from: 'creator',
        folder: this.props.projectModel.getFolder(),
        name: 'instantiate-component',
        relpath: asset.getLocalizedRelpath(),
        coords,
      });
    }
  }

  saveCodeFromEditorToDisk () {
    this.refs.codeeditor.saveCodeFromEditorToDisk();
  }

  render () {
    const interactionModeColor = isPreviewMode(this.props.interactionMode)
      ? Palette.LIGHTEST_PINK
      : isEditMode(this.props.interactionMode)
        ? Palette.STAGE_GRAY
        : Palette.COAL;

    return (
      <div className="layout-box"
        onMouseOver={() => this.webview.focus()}
        onMouseOut={() => this.webview.blur()}>
        <div
          className="stage-box"
          style={STAGE_BOX_STYLE}>
          <StageTitleBar
            folder={this.props.folder}
            envoyProject={this.props.envoyProject}
            projectModel={this.props.projectModel}
            websocket={this.props.websocket}
            project={this.props.project}
            createNotice={this.props.createNotice}
            removeNotice={this.props.removeNotice}
            organizationName={this.props.organizationName}
            authToken={this.props.authToken}
            username={this.props.username}
            password={this.props.password}
            receiveProjectInfo={this.props.receiveProjectInfo}
            onPreviewModeToggled={this.props.onPreviewModeToggled}
            isTimelineReady={this.props.isTimelineReady}
            envoyClient={this.props.envoyClient}
            onProjectPublicChange={this.props.onProjectPublicChange}
            setGlassInteractionToCodeEditorMode={this.props.setGlassInteractionToCodeEditorMode}
            tryToSwitchToEditMode={this.tryToSwitchToEditMode}
            interactionMode={this.props.interactionMode}
            saveCodeFromEditorToDisk={this.saveCodeFromEditorToDisk}
            onShowEventHandlerEditor={this.props.onShowEventHandlerEditor}
          />
          <ComponentMenu
            ref="component-menu"
            showGlass={showGlassOnStage(this.props.interactionMode)}
            projectModel={this.props.projectModel}
            nonSavedContentOnCodeEditor={this.state.nonSavedContentOnCodeEditor}
            tryToChangeCurrentActiveComponent={this.props.tryToChangeCurrentActiveComponent}
          />
          <div
            id="stage-mount"
            ref={(element) => {
              this.mount = element;
            }}
            style={[{
              position: 'absolute',
              overflow: 'auto',
              width: 'calc(100% - 5px)',
              height: `calc(100% - ${STAGE_MOUNT_HEIGHT_OFFSET + 3}px)`,
              top: STAGE_MOUNT_HEIGHT_OFFSET,
              left: 3,
              backgroundColor: Palette.STAGE_GRAY,
              outline: '2px solid ' + interactionModeColor,
              visibility: showGlassOnStage(this.props.interactionMode) ? 'visible' : 'hidden',
              opacity: showGlassOnStage(this.props.interactionMode) ? 1 : 0},
              [showGlassOnStage(this.props.interactionMode) && STAGE_FADE_IN], [!showGlassOnStage(this.props.interactionMode) && STAGE_FADE_OUT],
            ]}
          />
          {experimentIsEnabled(Experiment.CodeEditor) && <div
            id="editor-mount"
            style={[{
              position: 'absolute',
              width: 'calc(100% - 5px)',
              height: `calc(100% - ${STAGE_MOUNT_HEIGHT_OFFSET + 3}px)`,
              top: STAGE_MOUNT_HEIGHT_OFFSET,
              left: 3,
              backgroundColor: Palette.COAL,
              outline: '2px solid ' + interactionModeColor,
              visibility: showGlassOnStage(this.props.interactionMode) ? 'hidden' : 'visible',
              opacity: showGlassOnStage(this.props.interactionMode) ? 0 : 1},
              [!showGlassOnStage(this.props.interactionMode) && STAGE_FADE_IN], [showGlassOnStage(this.props.interactionMode) && STAGE_FADE_OUT],
            ]}>
            <CodeEditor
              ref="codeeditor"
              interactionMode={this.props.interactionMode}
              projectModel={this.props.projectModel}
              setNonSavedContentOnCodeEditor={(nonSaved) => {
                this.setState({nonSavedContentOnCodeEditor: nonSaved});
              }}
              nonSavedContentOnCodeEditor={this.state.nonSavedContentOnCodeEditor}
              showPopupToSaveRawEditorContents={this.state.showPopupToSaveRawEditorContents}
              executeActionAfterCodeEditorSavePopup={this.executeActionAfterCodeEditorSavePopup}
              closeCodeEditorSavePopup={this.closeCodeEditorSavePopup}
            />
          </div>}
        </div>
      </div>
    );
  }
}

Stage.propTypes = {
  folder: React.PropTypes.string.isRequired,
  haiku: React.PropTypes.object.isRequired,
  envoyClient: React.PropTypes.object.isRequired,
  websocket: React.PropTypes.object.isRequired,
  project: React.PropTypes.object.isRequired,
  createNotice: React.PropTypes.func.isRequired,
  removeNotice: React.PropTypes.func.isRequired,
  receiveProjectInfo: React.PropTypes.func,
  organizationName: React.PropTypes.string,
  authToken: React.PropTypes.string,
  username: React.PropTypes.string,
  password: React.PropTypes.string,
};

export default Radium(Stage);
