const qs = require('qs')
const https = require('https');
const fs = require('fs');
const path = require('path')
const os = require('os')
const unzip = require('extract-zip');

// require('electron').remote.app.relaunch()

// const opts = {
//   server: process.env.HAIKU_AUTOUPDATE_SERVER,
//   environment: process.env.HAIKU_RELEASE_ENVIRONMENT,
//   branch: process.env.HAIKU_RELEASE_BRANCH,
//   platform: process.env.HAIKU_RELEASE_PLATFORM,
//   version: process.env.HAIKU_RELEASE_VERSION
// }

// if (!process.env.HAIKU_SKIP_AUTOUPDATE) {
//   if (!opts.server || !opts.environment || !opts.branch || !opts.platform || !opts.version) {
//     throw new Error('Missing release/autoupdate environment variables')
//   }
// }


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

module.exports = {
  generateURL ({ server, ...query }) {
    const queryString = qs.stringify(query);

    return `${server}/updates/latest?${queryString}`
  },

  async run () {
    const [ shouldUpdate, url ] = checkUpdates()
    const downloadPath = path.join(os.tmpdir(), 'haiku.zip')

    if (shouldUpdate) {
      await _download(url, downloadPath)

      unzip(updatePath, {dir: '/Applications/'}, function (err) {
        if (err) {
          console.log(err)
        }
      })
    }
  },

  async checkUpdates () {
    const { status, url } = await this.requestToUpdateServer()

    if (status === 200 && url) {
      return [true, url]
    }

    return [false, null]
  },

  async requestToUpdateServer () {
    return {status: 300, url: ""}
  }
}
