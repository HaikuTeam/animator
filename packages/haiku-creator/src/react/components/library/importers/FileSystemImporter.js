import React from 'react'

const STYLES = {
  filePicker: {
    opacity: 0,
    position: "absolute",
    right: 0,
    width: 90,
    zIndex: 3,
    cursor: "pointer"
  }
}

class FileSystemImporter extends React.PureComponent {
  render () {
    return (
      <div>
        From File
        <input
          type="file"
          ref="filepicker"
          multiple
          onChange={fileDropEvent => {
            this.props.onFileDrop(this.refs.filepicker.files, fileDropEvent);
          }}
          style={STYLES.filePicker}
        />
      </div>
    )
  }
}

export default FileSystemImporter
