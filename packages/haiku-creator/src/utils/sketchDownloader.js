const {download, unzip} = require('./fileManipulation')
const {exec} = require('child_process')

const DOWNLOAD_URL = 'https://www.sketchapp.com/download/sketch.zip'

module.exports = {
  install (progressCallback) {
    return new Promise((resolve, reject) => {
      const tempPath = os.tmpdir()
      const zipPath = `${tempPath}/sketch.zip`
      const installationPath = '/Applications'

      download(DOWNLOAD_URL, zipPath, progressCallback)
        .then(() => {
          unzip(zipPath, installationPath, 'Sketch')
        })
    })
  },

  checkIfInstalled () {
    return new Promise((resolve, reject) => {
      exec('ls /Applications | grep Sketch.app', (err, stdout) => {
        if (err) reject(err)

        resolve({isInstalled: stdout === 'Sketch.app'})
      })
    })
  }
}
