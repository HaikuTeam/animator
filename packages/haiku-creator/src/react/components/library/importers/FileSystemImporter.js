import React from 'react'
import { remote } from 'electron'
import {isMac} from 'haiku-common/lib/environments/os'

class FileSystemImporter extends React.PureComponent {
  showImportDialog () {
    const validExtensions = ['svg', 'ai']

    // Only mac offers support for Sketch
    if (isMac()) {
      validExtensions.push('sketch')
    }

    remote.dialog.showOpenDialog(
      null,
      {
        title: 'Import to Library',
        filters: [{ name: 'Valid Files', extensions: validExtensions }],
        properties: ['multiSelections', 'openFile']
      },
      this.props.onFileDrop
    )
  }

  render () {
    return (
      <div
        style={this.props.style}
        onClick={() => {
          this.showImportDialog()
        }}
      >
        {this.props.text ? this.props.text : 'From File'}
      </div>
    )
  }
}

export default FileSystemImporter
