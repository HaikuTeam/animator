const os = require('os')
const path = require('path')
const { exec } = require('child_process')
const logger = require('./LoggerInstance')
const { download, unzip } = require('./fileManipulation')
const {isMac} = require('haiku-common/lib/environments/os')

const DOWNLOAD_URL = 'https://download.sketchapp.com/sketch.zip'
const SKETCH_PATH_FINDER = `$(/usr/bin/find /System/Library/Frameworks -name lsregister) -dump | grep 'path:.*/Sketch\\( (\\d)\\)\\?\\.app$'`
const PARSER_CLI_PATH = '/Contents/Resources/sketchtool/bin/sketchtool'

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

  dumpToPaths (rawDump) {
    logger.info('[sketch utils] about to parse Sketch paths', rawDump)

    return rawDump
        .trim()
        .split('\n')
        .map((pathWithExtras) => {
          try {
            return pathWithExtras.split(':')[1].trim()
          } catch (error) {
            return null
          }
        })
        .filter(Boolean)
  },

  pathsToInstallationInfo (sketchPaths) {
    const resolvingSketchPaths = sketchPaths.map((sketchPath) => {
      return new Promise((resolve, reject) => {
        const sketchtoolPath = path.join(sketchPath, PARSER_CLI_PATH)

        exec(`${sketchtoolPath} --version`, (error, stdout, stderr) => {
          if (error || !stdout || stdout.trim().length === 0 || stderr) {
            return resolve(null)
          }

          const rawBuildNumber = stdout.match(/\((.*?)\)/)[1]
          const sketchtoolBuildNumber = Number(rawBuildNumber)
          return resolve({sketchPath, sketchtoolBuildNumber})
        })
      })
    })

    return Promise.all(resolvingSketchPaths)
  },

  getDumpInfo () {
    return new Promise((resolve, reject) => {
      exec(SKETCH_PATH_FINDER, (error, stdout, stderr) => {
        if (error || !stdout || stdout.trim().length === 0 || stderr) {
          reject(error)
        }

        return resolve(stdout, stderr)
      })
    })
  },

  findBestPath (sketchPaths) {
    const sortedPaths = sketchPaths
      .filter(Boolean)
      .sort((a, b) => b.sketchtoolBuildNumber - a.sketchtoolBuildNumber)

    return sortedPaths[0] && sortedPaths[0].sketchPath
  },

  checkIfInstalled () {
    // Only Mac has sketch support
    if (isMac()) {
      return new Promise((resolve, reject) => {
        this.getDumpInfo()
          .then(this.dumpToPaths)
          .then(this.pathsToInstallationInfo)
          .then(this.findBestPath)
          .then((bestPath) => { resolve(bestPath) })
          .catch((error) => {
            logger.error('[sketch utils] error finding Sketch: ', error)
            resolve(null)
          })
      })
    } else {
      logger.info('[sketch utils] Platform does not support Sketch')
      return new Promise((resolve, reject) => { resolve(null) })
    }
  }
}
