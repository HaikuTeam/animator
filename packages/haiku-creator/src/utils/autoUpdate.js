const qs = require('qs')
const https = require('https')
const fs = require('fs')
const path = require('path')
const os = require('os')
const electron = require('electron')
const fetch = require('node-fetch')
const {exec} = require('child_process')

const opts = {
  server: process.env.HAIKU_AUTOUPDATE_SERVER,
  environment: process.env.HAIKU_RELEASE_ENVIRONMENT,
  branch: process.env.HAIKU_RELEASE_BRANCH,
  platform: process.env.HAIKU_RELEASE_PLATFORM,
  version: process.env.HAIKU_RELEASE_VERSION
}

function _download (url, downloadPath, onProgress) {
  const file = fs.createWriteStream(downloadPath)

  return new Promise((resolve, reject) => {
    https.get(url, response => {
      const contentLenght = parseInt(response.headers['content-length'], 10)
      let progress = 0

      response.pipe(file)

      response.on('data', data => {
        progress += data.length
        onProgress({ progress: progress * 100 / contentLenght })
      })

      response.on('error', error => {
        fs.unlink(downloadPath)
        reject(error)
      })

      file.on('finish', () => {
        file.close(resolve)
      })
    })
  })
}

function _unzip (zipPath, destination) {
  return new Promise((resolve, reject) => {
    exec(
      `unzip -o -qq ${zipPath} -d ${destination}`,
      {},
      err => {
        if (err) reject(err)
        resolve(true)
      }
    )
  })
}

module.exports = {
  async update (url, progressCallback, options = opts) {
    if (!process.env.HAIKU_SKIP_AUTOUPDATE) {
      if (
        !options.server ||
        !options.environment ||
        !options.branch ||
        !options.platform ||
        !options.version
      ) {
        throw new Error('Missing release/autoupdate environment variables')
      }
    }

    const tempPath = os.tmpdir()
    const zipPath = `${tempPath}/haiku.zip`
    const installationPath = '/Applications'

    await _download(url, zipPath, progressCallback)
    await _unzip(zipPath, installationPath)
    electron.remote.app.relaunch()
    electron.remote.app.exit()
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

  generateURL ({server, ...query}) {
    const queryString = qs.stringify(query)

    return `${server}/updates/latest?${queryString}`
  }
}
