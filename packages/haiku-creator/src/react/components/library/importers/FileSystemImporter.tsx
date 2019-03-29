import {remote} from 'electron';
import {isMac} from 'haiku-common/lib/environments/os';
import {Experiment, experimentIsEnabled} from 'haiku-common/lib/experiments';
import * as React from 'react';

export interface FileSystemImporterProps {
  onFileDrop (files: string[]): void;
  style?: React.CSSProperties;
  text?: string;
}

class FileSystemImporter extends React.PureComponent<FileSystemImporterProps> {
  showImportDialog = () => {
    const validExtensions = [
      'svg',
      'ai',
    ];

    if (experimentIsEnabled(Experiment.AllowBitmapImages)) {
      validExtensions.push(
        'jpg',
        'jpeg',
        'png',
        'gif',
      );
    }

    // Only mac offers support for Sketch
    if (isMac()) {
      validExtensions.push('sketch');
    }

    remote.dialog.showOpenDialog(
      null,
      {
        title: 'Import to Library',
        filters: [{name: 'Valid Files', extensions: validExtensions}],
        properties: ['multiSelections', 'openFile'],
      },
      this.props.onFileDrop,
    );
  };

  render () {
    return (
      <div
        style={this.props.style}
        onClick={this.showImportDialog}
      >
        {this.props.text || 'Import From File'}
      </div>
    );
  }
}

export default FileSystemImporter;
