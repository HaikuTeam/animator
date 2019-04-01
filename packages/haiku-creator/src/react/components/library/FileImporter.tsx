import * as Color from 'color';
// @ts-ignore
import * as mixpanel from 'haiku-serialization/src/utils/Mixpanel';
import Palette from 'haiku-ui-common/lib/Palette';
import * as React from 'react';
// @ts-ignore
import * as Popover from 'react-popover';
import {DASH_STYLES} from '../../styles/dashShared';
import FigmaImporter from './importers/FigmaImporter';
import FileSystemImporter from './importers/FileSystemImporter';

const STYLES: React.CSSProperties = {
  popover: {
    background: Palette.COAL,
    borderRadius: '4px',
    textAlign: 'left',
    position: 'relative',
    item: {
      ...DASH_STYLES.popover.item,
      width: '100%',
    },
    text: {
      ...DASH_STYLES.popover.text,
      ...DASH_STYLES.upcase,
      cursor: 'pointer',
      width: '100%',
    },
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
};

export interface FileImporterProps {
  onFileDrop (paths: string[]): void;
  conglomerateComponent (options: any): void;
  onImportFigmaAsset (url: string, warnOnComplexFile?: boolean): void;
  onAskForFigmaAuth (): void;
  figma: any;
}

class FileImporter extends React.PureComponent<FileImporterProps> {
  state = {
    isPopoverOpen: false,
  };

  showPopover = () => {
    this.setState({isPopoverOpen: true});
    mixpanel.haikuTrack('creator:file-importer:open-all');
  };

  hidePopover = () => {
    this.setState({isPopoverOpen: false});
  };

  onFileDrop = (filePaths: string[]) => {
    this.hidePopover();

    if (filePaths) {
      this.props.onFileDrop(filePaths);
    }
  };

  conglomerateComponent = () => {
    this.props.conglomerateComponent({
      isBlankComponent: true,
      skipInstantiateInHost: true,
    });
  };

  get popoverBody () {
    return (
      <div
        style={{
          ...DASH_STYLES.popover.container,
          right: 0,
          top: 0,
          position: 'initial',
        }}
      >
        <div style={STYLES.popover.item}>
          <FileSystemImporter
            onFileDrop={this.onFileDrop}
            style={STYLES.popover.text}
          />
        </div>
        <div style={STYLES.popover.item}>
          <div
            style={STYLES.popover.text}
            onClick={this.conglomerateComponent}
          >
            Create Component
          </div>
        </div>
        <div style={STYLES.popover.item}>
          <FigmaImporter
            figma={this.props.figma}
            onImportFigmaAsset={this.props.onImportFigmaAsset}
            onAskForFigmaAuth={this.props.onAskForFigmaAuth}
            style={STYLES.popover.text}
            onPopoverHide={this.hidePopover}
          />
        </div>
      </div>
    );
  }

  render () {
    return (
      <Popover
        onOuterAction={this.hidePopover}
        isOpen={this.state.isPopoverOpen}
        place="below"
        tipSize={0.01}
        body={this.popoverBody}
      >
        <button
          aria-label="Import file"
          data-tooltip={true}
          data-tooltip-bottom={true}
          style={STYLES.button}
          onClick={this.showPopover}
        >
          +
        </button>
      </Popover>
    );
  }
}

export default FileImporter;
