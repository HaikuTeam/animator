const qs = require('qs')
const https = require('https');
const fs = require('fs');
const path = require('path')
const os = require('os')
const unzip = require('extract-zip');
const electron = require('electron')

const opts = {
  server: process.env.HAIKU_AUTOUPDATE_SERVER,
  environment: process.env.HAIKU_RELEASE_ENVIRONMENT,
  branch: process.env.HAIKU_RELEASE_BRANCH,
  platform: process.env.HAIKU_RELEASE_PLATFORM,
  version: process.env.HAIKU_RELEASE_VERSION
}

function _download (url, downloadPath) {
  const file = fs.createWriteStream(downloadPath);

  return new Promise((resolve, reject) => {
    const response = https.get(url, function(response) {
      response.pipe(file);

      file.on('finish', function() {
        file.close(resolve);
      });
    })

    response.on('error', function(error) {
      fs.unlink(downloadPath);
      reject(error)
    });
  })
};

function _unzip (zipPath, destination) {
  return new Promise((resolve, reject) => {
    unzip(updatePath, {dir: destination}, function (err) {
      err ? reject(err) : resolve(true)
    })
  })
}

module.exports = {
  async update () {
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
    const { status, url } = await this.requestToUpdateServer()

    if (status === 200 && url) {
      return [true, url]
    }

    return [false, null]
  },

  async requestToUpdateServer () {
    const url = this.generateURL(opts)
    return {status: 300, url: ""}
  }

  generateURL ({ server, ...query }) {
    const queryString = qs.stringify(query);

    return `${server}/updates/latest?${queryString}`
  },
}
