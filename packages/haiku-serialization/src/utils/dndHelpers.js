function _isInternalDrop (event) {
  return event.dataTransfer.types.indexOf('Files') === -1
}

module.exports = {
  linkExternalAssetsOnDrop (event) {
    if (_isInternalDrop(event)) return

    event.preventDefault()

    const {websocket, folder} = this.props
    const filePaths = Array.prototype.map.call(
      event.dataTransfer.items,
      item => item.getAsFile().path
    )

    websocket.request(
      {method: 'bulkLinkAssets', params: [filePaths, folder]},
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
