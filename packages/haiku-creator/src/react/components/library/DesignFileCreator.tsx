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
}

const IMPORT_OPTIONS: ImportOption[] = [
  {
    name: 'Sketch',
    icon: SketchIconSVG,
  },
  {
    name: 'Figma',
    icon: FigmaIconSVG,
  },
  {
    name: 'Illustrator',
    icon: IllustratorIconSVG,
  },
];

class DesignFileCreator extends React.PureComponent {
  render () {
    return (
      <div style={STYLES.container}>
        <p><i>Create a design file to start</i></p>
        <div>
          {IMPORT_OPTIONS.map(({name, icon}) => (
            <button style={STYLES.btn} key={name} className="button-css-transform">
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
