var fs = require('fs')
var path = require('path')
var async = require('async')
var initializeAWSService = require('./initializeAWSService')
var uploadObjectToS3 = require('./uploadObjectToS3')
var ROOT = path.join(__dirname, '..', '..')

function uploadRelease (region, key, secret, bucket, platform, environment, branch, version, cb) {
  var s3 = initializeAWSService('S3', region, key, secret)

  var source = path.join(ROOT, 'dist')

  var countdown = (Math.pow(10, 13) - Date.now()) + '' // Reverse timestamp for ordering
  var target = path.join('releases', environment, branch, platform, countdown, version)
  var latest = path.join('releases', [environment, branch, platform].join('-'))

  return fs.readdir(source, function (err, entries) {
    if (err) return cb(err)

    var matches = entries.filter(function _filter (entry) {
      return entry.indexOf(version) !== -1 && path.extname(entry) === '.zip'
    })

    if (matches.length < 1) {
      return cb(new Error('Builds for ' + platform + '@' + version + ' not found'))
    }

    return async.each(matches, function (entry, next) {
      var build = path.join(source, entry)
      var stream = fs.createReadStream(build)
      var key = path.join(target, entry)

      console.log('Uploading ' + build + ' as object ' + key + ' to bucket ' + bucket + '...')

      return uploadObjectToS3(s3, key, stream, bucket, 'public-read', function (err) {
        if (err) return next(err)

        key = [latest, 'latest' + path.extname(entry)].join('-')
        stream = fs.createReadStream(build)

        console.log('Uploading ' + build + ' as object ' + key + ' to bucket ' + bucket + '...')

        return uploadObjectToS3(s3, key, stream, bucket, 'public-read', next)
      })
    }, (err) => {
      if (err) return cb(err)
      return cb(null, {
        region,
        environment,
        branch,
        platform,
        countdown,
        version
      })
    })
  })
}

module.exports = uploadRelease
