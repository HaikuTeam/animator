let fs = require('fs');
let log = require('./log');
let initializeAWSService = require('./initializeAwsService');
let uploadObjectToS3 = require('./uploadObjectToS3');
let DEPLOY_CONFIGS = require('./../deploy');

module.exports = function uploadFileStream (sourcepath, destpath, region, deployer, env, bucket, acl, cb) {
  const config = DEPLOY_CONFIGS[deployer][env];

  if (!config) {
    throw new Error(`No config for ${deployer} / ${env}`);
  }

  const accessKeyId = config.key;
  const secretAccessKey = config.secret;

  const s3 = initializeAWSService('S3', region, accessKeyId, secretAccessKey);
  const stream = fs.createReadStream(sourcepath);

  log.log('uploading ' + sourcepath + ' as ' + destpath + ' to ' + bucket + '...');

  return uploadObjectToS3(s3, destpath, stream, bucket, acl, cb);
};
