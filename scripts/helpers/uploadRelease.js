const fs = require('fs')
const path = require('path')
const async = require('async')
const initializeAWSService = require('./initializeAwsService')
const uploadObjectToS3 = require('./uploadObjectToS3')
const ROOT = global.process.cwd()

function uploadRelease (region, key, secret, bucket, folder, platform, environment, branch, version, cb) {
  const s3 = initializeAWSService('S3', region, key, secret)

  const source = path.join(ROOT, 'dist')

  const countdown = (Math.pow(10, 13) - Date.now()) + '' // Reverse timestamp for ordering

  const target = path.join(folder, environment, branch, platform, countdown, version)

  return fs.readdir(source, function (err, entries) {
    if (err) return cb(err)

    var matches = entries.filter(function _filter (entry) {
      return entry.indexOf(version) !== -1 && ['.zip', '.dmg'].includes(path.extname(entry))
    })

    if (matches.length < 1) {
      return cb(new Error('Builds for ' + platform + '@' + version + ' not found'))
    }

    return async.each(matches, function (entry, next) {
      const build = path.join(source, entry)
      const stream = fs.createReadStream(build)
      let key = path.join(target, entry)

      // Upload with a 'pending' label so squirrel server knows not to include this in
      // the list of candidates. This gives us an opportunity to test before syndication.
      // The idea is that we manually remove the pending flag on S3 when we're ready.
      key = key.replace(/.zip$/, '-pending.zip')

      console.log('Uploading ' + build + ' as object ' + key + ' to bucket ' + bucket + '...')

      return uploadObjectToS3(s3, key, stream, bucket, 'public-read', next)
    }, (err) => {
      if (err) return cb(err)

      const urls = {
        patch: `https://s3.amazonaws.com/${bucket}/${target}/Haiku-${version}-${platform}-pending.zip`,
        download: `https://s3.amazonaws.com/${bucket}/${target}/Haiku-${version}.dmg`
      }

      return cb(null, {
        region,
        environment,
        branch,
        platform,
        countdown,
        version,
        urls
      })
    })
  })
}

module.exports = uploadRelease
