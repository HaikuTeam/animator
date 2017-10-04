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

      const tempPath = os.tmpdir()
      const zipPath = `${tempPath}/haiku.zip`
      const installationPath = '/Applications'

      await download(url, zipPath, progressCallback)
      await unzip(zipPath, installationPath)
      electron.remote.app.relaunch()
      electron.remote.app.exit()
    }
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
