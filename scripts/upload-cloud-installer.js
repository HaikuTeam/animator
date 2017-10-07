var fs = require('fs')
var path = require('path')
var log = require('./helpers/log')
var initializeAWSService = require('./helpers/initializeAWSService')
var uploadObjectToS3 = require('./helpers/uploadObjectToS3')
var ROOT = path.join(__dirname, '..')

var deploy = require('./deploy')
var BUCKET = 'code.haiku.ai'
var OBJ_KEY = 'scripts/cli/installer.js'
var SCRIPT_PATH = path.join(ROOT, 'bins', 'cli-cloud-installer.js')

var s3 = initializeAWSService(
  'S3',
  deploy[BUCKET].production.region,
  deploy[BUCKET].production.key,
  deploy[BUCKET].production.secret
)

var stream = fs.createReadStream(SCRIPT_PATH)

log.hat(`uploading ${SCRIPT_PATH} to ${BUCKET} as ${OBJ_KEY}`)

uploadObjectToS3(s3, OBJ_KEY, stream, BUCKET, 'public-read', (err) => {
  if (err) throw err
  log.log('done')
})
