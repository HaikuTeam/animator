var path = require('path')
var getMimeType = require('./getMimeType')

const DEFAULT_ACL = 'private'

function uploadItemToS3 (s3, key, body, bucket, acl, cb) {
  var extname = path.extname(key)

  var contentType = getMimeType(extname)

  var s3params = {
    Bucket: bucket,
    ACL: acl || DEFAULT_ACL,
    Key: key,
    Body: body,
    ContentType: contentType
  }

  return s3.putObject(s3params, function _putObjectCb (uploadErr, s3Output) {
    return cb(uploadErr, s3Output)
  })
}

module.exports = uploadItemToS3
