var fs = require('fs')
var path = require('path')
var initializeAWSService = require('./initializeAWSService')
var uploadObjectToS3 = require('./uploadObjectToS3')
var baseDir = path.join(__dirname, '..', '..')

function uploadInstaller (region, key, secret, bucket, dest, cb) {
  var s3 = initializeAWSService('S3', region, key, secret)
  var source = path.join(baseDir, 'bins', 'cli-cloud-installer.js')
  var stream = fs.createReadStream(source)
  console.log('Uploading ' + source + ' to ' + bucket + ' ' + dest + '...')
  return uploadObjectToS3(s3, dest, stream, bucket, 'public-read', cb)
}

module.exports = uploadInstaller
