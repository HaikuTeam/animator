var AWS = require('aws-sdk')

function initializeAWSService (serviceName, awsRegion, awsAccessKeyId, awsSecretAccessKey, env) {
  var credentials = new AWS.Credentials({
    accessKeyId: awsAccessKeyId || (env && env.AWS_ACCESS_KEY_ID),
    secretAccessKey: awsSecretAccessKey || (env && env.AWS_SECRET_ACCESS_KEY)
  })

  var instance = new AWS[serviceName]({
    region: awsRegion,
    credentials: credentials,
    apiVersion: 'latest',
    sslEnabled: true
  })

  return instance
}

module.exports = initializeAWSService
