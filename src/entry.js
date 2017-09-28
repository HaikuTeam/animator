(function () {
  var electron = require('electron')
  var setup = require('./dom').default
  electron.ipcRenderer.on('haiku', (event, haiku) => {
    return setup('creator', haiku)
  })
}())
