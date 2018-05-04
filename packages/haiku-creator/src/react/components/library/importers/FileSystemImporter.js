import React from 'react'
import { remote } from 'electron'

class FileSystemImporter extends React.PureComponent {
  showImportDialog () {
    var validExtensions =  ['svg']

    // Only mac offers support for Sketch
    if (process.env.HAIKU_RELEASE_PLATFORM === 'mac'){
      validExtensions.push('sketch')
    }

    remote.dialog.showOpenDialog(
      null,
      {
        title: "Import to Library",
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
