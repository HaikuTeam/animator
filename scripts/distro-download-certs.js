var path = require('path')
var fse = require('fs-extra')
var initializeAWSService = require('./helpers/initializeAWSService')
var deploy = require('./deploy')

if (!process.env.NODE_ENV) throw new Error('NODE_ENV needs to be set')

var s3 = initializeAWSService(
  'S3',
  'us-east-1',
  deploy.deployer[process.env.NODE_ENV].key,
  deploy.deployer[process.env.NODE_ENV].secret
)

fse.mkdirpSync(deploy.vault)

s3.getObject({
  Bucket: 'haiku-secrets',
  Key: `certs/${deploy.certificate}`
}, (err, data) => {
  if (err) throw err
  console.log(`downloaded ${deploy.certificate}`)
  fse.outputFileSync(path.join(deploy.vault, `${deploy.certificate}`), data.Body)
  s3.getObject({
    Bucket: 'haiku-secrets',
    Key: `certs/${deploy.certificate}.password`
  }, (err, data) => {
    if (err) throw err
    console.log(`downloaded ${deploy.certificate}.password`)
    fse.mkdirpSync(deploy.vault)
    fse.outputFileSync(path.join(deploy.vault, `${deploy.certificate}.password`), data.Body)
  })
})
