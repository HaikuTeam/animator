const AWS = require('aws-sdk');

function initializeAwsService(serviceName, awsRegion, awsAccessKeyId, awsSecretAccessKey, env) {
  const credentials = new AWS.Credentials({
    accessKeyId: awsAccessKeyId || (env && env.AWS_ACCESS_KEY_ID),
    secretAccessKey: awsSecretAccessKey || (env && env.AWS_SECRET_ACCESS_KEY),
  });

  const instance = new AWS[serviceName]({
    region: awsRegion,
    credentials,
    apiVersion: 'latest',
    sslEnabled: true,
  });

  return instance;
}

module.exports = initializeAwsService;
