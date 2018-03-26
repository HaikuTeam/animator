import React from 'react'
import { remote } from 'electron'

class FileSystemImporter extends React.PureComponent {
  showImportDialog () {
    remote.dialog.showOpenDialog(
      null,
      {
        filters: [{ name: 'Valid Files', extensions: ['svg', 'sketch'] }],
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
