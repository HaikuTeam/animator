import * as React from 'react';
import FigmaForm from './FigmaForm';

const STYLES: React.CSSProperties = {
  button: {
    color: 'inherit',
    fontSize: 'inherit',
    width: '100%',
    display: 'inline-block',
    textAlign: 'left',
    fontFamily: 'inherit',
  },
};

export interface FigmaImporterProps {
  onPopoverHide (): void;
  onImportFigmaAsset (url: string, warnOnComplexFile?: boolean): void;
  onAskForFigmaAuth (): void;
  figma: any;
  style: React.CSSProperties;
}

class FigmaImporter extends React.PureComponent<FigmaImporterProps> {
  state = {
    isFormVisible: false,
  };

  renderForm = () => {
    this.setState({isFormVisible: true});
  };

  render () {
    return (
      <div style={this.props.style}>
        <button
          style={STYLES.button}
          onClick={this.renderForm}
        >
          Connect Figma Project
        </button>

        {this.state.isFormVisible && (
          <FigmaForm
            figma={this.props.figma}
            onAskForFigmaAuth={this.props.onAskForFigmaAuth}
            onImportFigmaAsset={this.props.onImportFigmaAsset}
            onPopoverHide={this.props.onPopoverHide}
          />
        )}
      </div>
    );
  }
}

export default FigmaImporter;
