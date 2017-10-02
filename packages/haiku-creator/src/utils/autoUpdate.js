const qs = require('qs')
const https = require('https')
const fs = require('fs')
const path = require('path')
const os = require('os')
const unzip = require('extract-zip')
const electron = require('electron')
const fetch = require('node-fetch')
var sudo = require('sudo-prompt');
const { exec } = require('child_process');

// const opts = {
//   server: process.env.HAIKU_AUTOUPDATE_SERVER,
//   environment: process.env.HAIKU_RELEASE_ENVIRONMENT,
//   branch: process.env.HAIKU_RELEASE_BRANCH,
//   platform: process.env.HAIKU_RELEASE_PLATFORM,
//   version: process.env.HAIKU_RELEASE_VERSION
// }

const opts = {
  server: process.env.HAIKU_AUTOUPDATE_SERVER,
  environment: 'staging',
  branch: 'master',
  platform: 'mac',
  version: '2.3.6'
}

function _download (url, downloadPath, progressCallback) {
  const file = fs.createWriteStream(downloadPath)

  return new Promise((resolve, reject) => {
    const response = https.get(url, (response) => {
      const contentLenght = parseInt(response.headers['content-length'], 10)
      let current = 0

      response.pipe(file)

      response.on('data', (data) => {
        current = current + data.length
        progressCallback({ progress: (current * 100) / contentLenght })
      })

      response.on('error', (error) => {
        fs.unlink(downloadPath)
        reject(error)
      })

      file.on('finish', () => {
        file.close(resolve)
      })
    })
  })
};

function _rename(oldPath, newPath, cb) {
  const opts = {name: 'Haiku'}

  return new Promise((resolve, reject) => {
    exec(`rm -rf ${newPath}/Haiku.app && mv ${oldPath} ${newPath}`, {}, (error) => {
      if (error) reject(error);
      resolve(true)
    })
  })
}


function _unzip (zipPath, destination) {
  const tempPath = os.tmpdir()

  return new Promise((resolve, reject) => {
    unzip(zipPath, {dir: tempPath}, function (err) {
      if (err) reject(err)

      return _rename(`${tempPath}/Haiku.app`, '/Applications')
    })
  })
}

module.exports = {
  async update (url, progressCallback, options = opts) {
    if (!process.env.HAIKU_SKIP_AUTOUPDATE) {
      if (!options.server || !options.environment || !options.branch || !options.platform || !options.version) {
        throw new Error('Missing release/autoupdate environment variables')
      }
    }

    const downloadPath = path.join(os.tmpdir(), 'haiku.zip')

    // await _download(url, downloadPath, progressCallback)
    await _unzip(downloadPath, '/Applications/')
    // electron.remote.app.relaunch()
    // electron.remote.app.exit()
  },

  async checkUpdates () {
    const {status, url} = await this.checkServer()

    if (status === 200 && url) {
      return {shouldUpdate: true, url}
    }

    return {shouldUpdate: false, url: null}
  },

  async checkServer () {
    const response = await fetch(this.generateURL(opts))
    const data = await response.json()

    return {status: response.status, url: data.url}
  },

  generateURL ({ server, ...query }) {
    const queryString = qs.stringify(query)

    return `${server}/updates/latest?${queryString}`
  }
}
