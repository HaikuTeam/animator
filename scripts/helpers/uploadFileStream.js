var fs = require('fs')
var log = require('./log')
var initializeAWSService = require('./initializeAWSService')
var uploadObjectToS3 = require('./uploadObjectToS3')
var DEPLOY_CONFIGS = require('./../../deploy')

module.exports = function uploadFileStream (sourcepath, destpath, region, deployer, env, bucket, acl, cb) {
  var config = DEPLOY_CONFIGS[deployer][env]

  if (!config) {
    throw new Error(`No config for ${deployer} / ${env}`)
  }

  var accessKeyId = config.key
  var secretAccessKey = config.secret

  var s3 = initializeAWSService('S3', region, accessKeyId, secretAccessKey)
  var stream = fs.createReadStream(sourcepath)

  log.log('uploading ' + sourcepath + ' as ' + destpath + ' to ' + bucket + '...')

  return uploadObjectToS3(s3, destpath, stream, bucket, acl, cb)
}
