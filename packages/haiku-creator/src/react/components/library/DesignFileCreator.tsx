import {shell} from 'electron';
import {isMac} from 'haiku-common/lib/environments/os';
// @ts-ignore
import * as mixpanel from 'haiku-serialization/src/utils/Mixpanel';
// @ts-ignore
import * as sketchUtils from 'haiku-serialization/src/utils/sketchUtils';
import Palette from 'haiku-ui-common/lib/Palette';
import {
  FigmaIconSVG,
  IllustratorIconSVG,
  SketchIconSVG,
} from 'haiku-ui-common/lib/react/OtherIcons';
import * as path from 'path';
import * as React from 'react';
// @ts-ignore
import FigmaPopover from './importers/FigmaPopover';

const STYLES: React.CSSProperties = {
  container: {
    padding: '0 13px',
  },
  btn: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    color: Palette.SUNSTONE,
    border: `1px solid ${Palette.COAL}`,
    padding: '7px 3px',
    margin: '5px 0',
    textTransform: 'uppercase',
    borderRadius: 4,
  },
  btnText: {
    marginLeft: 5,
  },
};

class DesignFileCreator extends React.PureComponent<any, any> {
  sketchImport = () => {
    const {primaryAssetPath} = this.props.projectModel.getNameVariations();
    const projectPath = this.props.projectModel.getFolder();
    mixpanel.haikuTrack('creator:library:import:sketch');
    this.props.onStart();

    return this.props.websocket.request(
      {method: 'copyDefaultSketchFile', params: [projectPath, primaryAssetPath]},
      (err: any) => {
        if (!isMac()) {
          return;
        }

        sketchUtils.checkIfInstalled().then((isSketchInstalled: boolean) => {
          if (isSketchInstalled) {
            shell.openItem(path.join(projectPath, primaryAssetPath));
          }
        });
      },
    );
  };

  illustratorImport = () => {
    const {defaultIllustratorAssetPath} = this.props.projectModel.getNameVariations();
    const projectPath = this.props.projectModel.getFolder();
    mixpanel.haikuTrack('creator:library:import:illustrator');
    this.props.onStart();

    return this.props.websocket.request(
      {method: 'copyDefaultIllustratorFile', params: [projectPath, defaultIllustratorAssetPath]},
      // Please note that Illustrator files are opened by default during the first import
      // because we need to run a jsx script inside Illustrator, thus we don't need to do anything
      // here. If you want to disable auto open, check Illustrator#importSVG
      (err: any) => {},
    );
  };

  get sketchButton () {
    return (
      <button
        style={STYLES.btn}
        className="button-css-transform"
        onClick={this.sketchImport}
      >
        <SketchIconSVG />
        <span style={STYLES.btnText}>
          Sketch
        </span>
      </button>
    );
  }

  get illustratorButton () {
    return (
      <button
        style={STYLES.btn}
        className="button-css-transform"
        onClick={this.illustratorImport}
      >
        <IllustratorIconSVG />
        <span style={STYLES.btnText}>
          Illustrator
        </span>
      </button>
    );
  }

  get figmaButton () {
    return (
      <FigmaPopover
        onImportFigmaAsset={this.props.onImportFigmaAsset}
        onPopoverHide={this.props.onPopoverHide}
        onAskForFigmaAuth={this.props.onAskForFigmaAuth}
        figma={this.props.figma}
      >
        <button
          style={STYLES.btn}
          className="button-css-transform"
        >
          <FigmaIconSVG />
          <span style={STYLES.btnText}>
            Figma
          </span>
        </button>
      </FigmaPopover>
    );
  }

  render () {
    return (
        <div style={STYLES.container}>
          <p><i>Create a design file to start:</i></p>
          <div>
            {isMac() && this.sketchButton}
            {this.figmaButton}
            {this.illustratorButton}
          </div>
        </div>
    );
  }
}

export default DesignFileCreator;
