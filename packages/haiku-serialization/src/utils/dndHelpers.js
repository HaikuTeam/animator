/*
 * Checks if the event provided is dealing with files
 * dropped from the user file system. We can safely rely
 * on the 'Files' data transfer type to identify this.
 */
function _isInternalDrop (event) {
  return event.dataTransfer.types.indexOf('Files') === -1
}

/*
 * Hacky way to check if a file is a Sketch file. We have to
 * rely on this because Sketch files doesn't have a `file.type`
 */
function _isSketchFile (file) {
  var parsedFileName = file.getAsFile().name.split('.')
  var extension = parsedFileName[parsedFileName.length - 1]

  return extension && extension.toLowerCase() === 'sketch'
}

function _isValidFile (file) {
  return file.type === 'image/svg+xml' || _isSketchFile(file)
}

module.exports = {
  /*
   * Standard import and instantiation of files dropped
   * in Haiku from the user file system by:
   *
   * - Handling the drop event
   * - Filtering files that are not supported
   * - Linking the assets via plumbing
   *
   * TODO: This method assumes that will be called from a React
   * component, this helps us to avoid a ton of boilerplate
   * between Creator/Timeline/Glass, but looks like we
   * should find a better solution.
   */
  linkExternalAssetsOnDrop (event) {
    if (_isInternalDrop(event)) return

    event.preventDefault()

    const {websocket, folder} = this.props
    const files = Array.from(event.dataTransfer.items)
      .filter(_isValidFile) /* Allow only svg and sketch files */
      .map(item => item.getAsFile().path)

    websocket.request(
      {method: 'bulkLinkAssets', params: [files, folder]},
      (error, assets) => {
        if (error) this.setState({error})
        this.forceUpdate()
      }
    )
  },

  preventDefaultDrag (event) {
    if (_isInternalDrop(event)) return
    event.preventDefault()
  }
}
