var qs = require('qs')

// var autoUpdater = require('electron').autoUpdater

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

// module.exports = function run (cb) {
//   console.log('[autoupdate] running')

//   if (process.env.HAIKU_SKIP_AUTOUPDATE) {
//     console.log('[autoupdate] skipped-update-check')
//     return cb(null, 'skipped-update-check')
//   }

//   const feedURL = `${opts.server}/updates/latest?environment=${opts.environment}&branch=${opts.branch}&platform=${opts.platform}&version=${opts.version}`

//   autoUpdater.setFeedURL(feedURL)

//   console.log('[autoupdate] checking')
//   console.log('[autoupdate] url: ' + feedURL)

//   autoUpdater.checkForUpdates()

//   autoUpdater.on('error', (error) => {
//     console.log('[autoupdate] error')
//     return cb(error, 'error', autoUpdater)
//   })

//   autoUpdater.on('checking-for-update', () => {
//     console.log('[autoupdate] checking-for-update')
//     return cb(null, 'checking-for-update', autoUpdater)
//   })

//   autoUpdater.on('update-available', () => {
//     console.log('[autoupdate] update-available')
//     return cb(null, 'update-available', autoUpdater)
//   })

//   autoUpdater.on('update-not-available', () => {
//     console.log('[autoupdate] update-not-available')
//     return cb(null, 'update-not-available', autoUpdater)
//   })

//   autoUpdater.on('update-downloaded', () => {
//     console.log('[autoupdate] update-downloaded')

//     return cb(null, 'update-downloaded', autoUpdater, () => {
//       console.log('[autoupdate] quit-and-install')
//       // Note how this is run only if the callback is called.
//       autoUpdater.quitAndInstall()
//     })
//   })
// }

module.exports = {
  generateURL({ server, ...query }) {
    const queryString = qs.stringify(query);

    return `${server}/updates/latest?${queryString}`
  }
}
