const qs = require('qs')
const https = require('https')
const fs = require('fs')
const path = require('path')
const os = require('os')
const unzip = require('extract-zip')
const electron = require('electron')
const fetch = require('node-fetch')

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


function _download (url, downloadPath) {
  const file = fs.createWriteStream(downloadPath);

  return new Promise((resolve, reject) => {
    const response = https.get(url, (response) => {
      response.pipe(file);

      file.on('finish', () => {
        file.close(resolve);
      });
    })

    response.on('error', (error) => {
      fs.unlink(downloadPath);
      reject(error)
    });
  })
};

function _unzip (zipPath, destination) {
  return new Promise((resolve, reject) => {
    unzip(zipPath, {dir: destination}, function (err) {
      err ? reject(err) : resolve(true)
    })
  })
}

module.exports = {
  async update (url) {
    if (!process.env.HAIKU_SKIP_AUTOUPDATE) {
      if (!opts.server || !opts.environment || !opts.branch || !opts.platform || !opts.version) {
        throw new Error('Missing release/autoupdate environment variables')
      }
    }

    const downloadPath = path.join(os.tmpdir(), 'haiku.zip')

    await _download(url, downloadPath)
    await _unzip(downloadPath, '/Applications/')
    electron.remote.app.relaunch()
    electron.remote.app.exit()
  },

  async checkUpdates () {
    const [ status, url ] = await this.checkServer()

    if (status === 200 && url) {
      return [true, url]
    }

    return [false, null]
  },

  async checkServer () {
    const response = await fetch(this.generateURL(opts))
    const data = await response.json()

    return [response.status, data.url]
  },

  generateURL ({ server, ...query }) {
    const queryString = qs.stringify(query);

    return `${server}/updates/latest?${queryString}`
  },
}
