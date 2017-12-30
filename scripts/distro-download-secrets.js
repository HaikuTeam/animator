var path = require('path')
var fse = require('fs-extra')
var initializeAWSService = require('./helpers/initializeAwsService')
var forceNodeEnvProduction = require('./helpers/forceNodeEnvProduction')

var config = require('./../config')
forceNodeEnvProduction()

var deploy = require('./deploy')

var s3 = initializeAWSService(
  'S3',
  'us-east-1',
  deploy.deployer[config.environment].key,
  deploy.deployer[config.environment].secret
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
