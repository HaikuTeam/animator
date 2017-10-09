const qs = require('qs')
const os = require('os')
const electron = require('electron')
const fetch = require('node-fetch')
const {download, unzip} = require('./fileManipulation')

const opts = {
  server: process.env.HAIKU_AUTOUPDATE_SERVER,
  environment: process.env.HAIKU_RELEASE_ENVIRONMENT,
  branch: process.env.HAIKU_RELEASE_BRANCH,
  platform: process.env.HAIKU_RELEASE_PLATFORM,
  version: process.env.HAIKU_RELEASE_VERSION
}

module.exports = {
  update (url, progressCallback, options = opts) {
    return new Promise((resolve, reject) => {
      if (process.env.HAIKU_SKIP_AUTOUPDATE !== '1') {
        if (
          !options.server ||
          !options.environment ||
          !options.branch ||
          !options.platform ||
          !options.version
        ) {
          throw new Error('Missing release/autoupdate environment variables')
        }

        const tempPath = os.tmpdir()
        const zipPath = `${tempPath}/haiku.zip`
        const installationPath = '/Applications'

        console.info('[autoupdater] About to download an update:', options, url)

        download(url, zipPath, progressCallback)
          .then(() => {
            unzip(zipPath, installationPath)
            electron.remote.app.exit()
          })
      }
    })
  },

  checkUpdates () {
    return new Promise((resolve, reject) => {
      this.checkServer()
        .then(({status, url}) => {
          if (status === 200 && url) {
            resolve({shouldUpdate: true, url})
          }

          resolve({shouldUpdate: false, url: null})
        })
        .catch(reject)
    })
  },

  checkServer () {
    let status

    return new Promise((resolve, reject) => {
      fetch(this.generateURL(opts))
        .then((response) => {
          status = response.status

          if (status === 200) {
            return response.json()
          } else {
            return {}
          }
        })
        .then((data) => {
          resolve({status: status, url: data.url})
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  generateURL ({server, ...query}) {
    const queryString = qs.stringify(query)

    return `${server}/updates/latest?${queryString}`
  }
}
