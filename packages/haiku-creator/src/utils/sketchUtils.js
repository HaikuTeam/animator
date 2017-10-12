const {download, unzip} = require('./fileManipulation')
const fs = require('fs')
const os = require('os')

const DOWNLOAD_URL = 'https://download.sketchapp.com/sketch.zip'

module.exports = {
  download (progressCallback) {
    return new Promise((resolve, reject) => {
      const tempPath = os.tmpdir()
      const zipPath = `${tempPath}/sketch.zip`
      const installationPath = '/Applications'

      download(DOWNLOAD_URL, zipPath, progressCallback)
        .then(() => {
          return unzip(zipPath, installationPath, 'Sketch')
        })
        .then(resolve)
        .catch(reject)
    })
  },

  checkIfInstalled () {
    return new Promise((resolve, reject) => {
      fs.access('/Applications/Sketch.app', fs.constants.F_OK, (err) => {
        if (err) resolve(false)
        resolve(true)
      })
    })
  }
}
