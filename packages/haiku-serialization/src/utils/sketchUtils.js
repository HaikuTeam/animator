const os = require('os')
const { exec } = require('child_process')
const logger = require('./LoggerInstance')
const { download, unzip } = require('./fileManipulation')

const DOWNLOAD_URL = 'https://download.sketchapp.com/sketch.zip'
const command = `$(/usr/bin/find /System/Library/Frameworks -name lsregister) -dump | grep 'path:.*/Sketch\\( (\\d)\\)\\?\\.app$'`

module.exports = {
  download (progressCallback, shouldCancel) {
    return new Promise((resolve, reject) => {
      const tempPath = os.tmpdir()
      const zipPath = `${tempPath}/sketch.zip`
      const installationPath = '/Applications'

      download(DOWNLOAD_URL, zipPath, progressCallback, shouldCancel)
        .then(() => {
          return unzip(zipPath, installationPath, 'Sketch')
        })
        .then(resolve)
        .catch(reject)
    })
  },

  isInTrash (path) {
    return path.includes('.Trash')
  },

  isInSystemFolder (path) {
    return path.includes('__MACOSX')
  },

  parseDumpInfo (error, stdout, stderr) {
    if (error || !stdout || stdout.trim().length === 0 || stderr) {
      return null
    }

    let sketchInstallationPath = null
    logger.info('[sketch utils] about to parse Sketch paths', stdout)

    try {
      sketchInstallationPath = stdout
        .trim()
        .split('\n')
        .map((pathWithExtras) => pathWithExtras.split(':')[1].trim())
        .find((path) => !this.isInTrash(path) && !this.isInSystemFolder(path))
    } catch (error) {
      logger.error('[sketch utils] error finding Sketch path: ', error)
    }

    return sketchInstallationPath
  },

  checkIfInstalled () {
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        return resolve(this.parseDumpInfo(error, stdout, stderr))
      })
    })
  }
}
