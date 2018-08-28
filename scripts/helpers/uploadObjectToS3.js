let path = require('path');
let getMimeType = require('./getMimeType');

const DEFAULT_ACL = 'private';

function uploadItemToS3 (s3, key, body, bucket, acl, cb) {
  const extname = path.extname(key);

  const contentType = getMimeType(extname);

  const s3params = {
    Bucket: bucket,
    ACL: acl || DEFAULT_ACL,
    Key: key,
    Body: body,
    ContentType: contentType,
  };

  return s3.putObject(s3params, (uploadErr, s3Output) => {
    return cb(uploadErr, s3Output);
  });
}

module.exports = uploadItemToS3;
