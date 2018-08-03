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
  isCodeEditorMode,
  showGlassOnStage,
} from '@haiku/core/lib/helpers/interactionModes';

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

// This may not be precisely correct; please test the UI if you enable this experiment
const STAGE_MOUNT_HEIGHT_OFFSET = (experimentIsEnabled(Experiment.MultiComponentFeatures))
  ? 68
  : 38;

class Stage extends React.Component {
  constructor (props) {
    super(props);
    this.webview = null;
    this.onRequestWebviewCoordinates = this.onRequestWebviewCoordinates.bind(this);
    this.tryToChangeCurrentActiveComponent = this.tryToChangeCurrentActiveComponent.bind(this);
    this.tryToSwitchToDesign = this.tryToSwitchToDesign.bind(this);
    this.saveCodeFromEditorToDisk = this.saveCodeFromEditorToDisk.bind(this);
    this.exitFromCodeEditorSavePopup = this.exitFromCodeEditorSavePopup.bind(this);

    this.state = {
      nonSavedContentOnCodeEditor: false,
      targetComponentToChange: '',
      targetDesignToChange: false,
      showPopupToSaveRawEditorContents: false,
    };
  }

  // Check if currently edited file is open
  tryToChangeCurrentActiveComponent (scenename) {
    if (this.state.nonSavedContentOnCodeEditor) {
      this.setState({
        targetDesignToChange: false,
        targetComponentToChange: scenename,
        showPopupToSaveRawEditorContents: true,
      });
    } else {
      this.props.projectModel.setCurrentActiveComponent(scenename, {from: 'creator'}, () => {});
    }
  }

  tryToSwitchToDesign () {
    if (this.state.nonSavedContentOnCodeEditor) {
      this.setState({
        targetDesignToChange: true,
        targetComponentToChange: '',
        showPopupToSaveRawEditorContents: true,
      });
    } else {
      this.props.onSwitchToDesignMode();
    }
  }

  exitFromCodeEditorSavePopup () {
    // Change to target
    if (this.state.targetDesignToChange) {
      this.props.onSwitchToDesignMode();
    } else if (this.state.targetComponentToChange !== '') {
      this.props.projectModel.setCurrentActiveComponent(scenename, {from: 'creator'}, () => {});
    }

    // Exit popup
    this.setState({
      targetDesignToChange: false,
      targetComponentToChange: '',
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
            isPreviewMode={isPreviewMode(this.props.interactionMode)}
            isTimelineReady={this.props.isTimelineReady}
            envoyClient={this.props.envoyClient}
            onProjectPublicChange={this.props.onProjectPublicChange}
            onSwitchToCodeMode={this.props.onSwitchToCodeMode}
            onSwitchToDesignMode={this.tryToSwitchToDesign}
            showGlass={showGlassOnStage(this.props.interactionMode)}
            saveCodeFromEditorToDisk={this.saveCodeFromEditorToDisk}
            onShowEventHandlerEditor={this.props.onShowEventHandlerEditor}
          />
          {(experimentIsEnabled(Experiment.MultiComponentFeatures)) &&
            <ComponentMenu
              ref="component-menu"
              showGlass={showGlassOnStage(this.props.interactionMode)}
              projectModel={this.props.projectModel}
              nonSavedContentOnCodeEditor={this.state.nonSavedContentOnCodeEditor}
              tryToChangeCurrentActiveComponent={this.props.tryToChangeCurrentActiveComponent}
            />
          }
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
              showGlass={showGlassOnStage(this.props.interactionMode)}
              projectModel={this.props.projectModel}
              setNonSavedContentOnCodeEditor={(nonSaved) => {
                this.setState({nonSavedContentOnCodeEditor: nonSaved});
              }}
              nonSavedContentOnCodeEditor={this.state.nonSavedContentOnCodeEditor}
              showPopupToSaveRawEditorContents={this.state.showPopupToSaveRawEditorContents}
              exitFromCodeEditorSavePopup={this.exitFromCodeEditorSavePopup}
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
