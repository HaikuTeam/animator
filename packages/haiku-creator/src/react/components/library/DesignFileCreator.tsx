import Palette from 'haiku-ui-common/lib/Palette';
import {
  FigmaIconSVG,
  IllustratorIconSVG,
  SketchIconSVG,
} from 'haiku-ui-common/lib/react/OtherIcons';
import * as React from 'react';

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

export interface ImportOption {
  name: string;
  icon: React.ReactType;
  importAction: React.MouseEventHandler<HTMLButtonElement>;
}

class DesignFileCreator extends React.PureComponent<any, any> {
  importOptions: ImportOption[] = [
    {
      name: 'Sketch',
      icon: SketchIconSVG,
      importAction: (event) => {
        const {primaryAssetPath} = this.props.projectModel.getNameVariations();
        const projectPath = this.props.projectModel.getFolder();

        return this.props.websocket.request(
          {method: 'copyDefaultSketchFile', params: [projectPath, primaryAssetPath]},
          (err: any) => {},
        );
      },
    },
    {
      name: 'Figma',
      icon: FigmaIconSVG,
      importAction: (event) => {},
    },
    {
      name: 'Illustrator',
      icon: IllustratorIconSVG,
      importAction: (event) => {
        const {defaultIllustratorAssetPath} = this.props.projectModel.getNameVariations();
        const projectPath = this.props.projectModel.getFolder();

        return this.props.websocket.request(
          {method: 'copyDefaultIllustratorFile', params: [projectPath, defaultIllustratorAssetPath]},
          (err: any) => {},
        );
      },
    },
  ];

  render () {
    return (
        <div style={STYLES.container}>
          <p><i>Create a design file to start</i></p>
          <div>
            {this.importOptions.map(({name, icon, importAction}) => (
              <button
                style={STYLES.btn}
                key={name}
                className="button-css-transform"
                onClick={importAction}
              >
                {React.createElement(icon)}
                <span style={STYLES.btnText}>
                  {name}
                </span>
              </button>
            ))}
          </div>
        </div>
    );
  }
}

export default DesignFileCreator;
