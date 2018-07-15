const path = require('path');
const fse = require('fs-extra');
const initializeAWSService = require('./helpers/initializeAwsService');
const forceNodeEnvProduction = require('./helpers/forceNodeEnvProduction');

const config = require('./../config');
forceNodeEnvProduction();

const deploy = require('./deploy');

let s3 = initializeAWSService(
  'S3',
  'us-east-1',
  deploy.deployer[config.environment].key,
  deploy.deployer[config.environment].secret,
);

fse.mkdirpSync(deploy.vault);

s3.getObject({
  Bucket: 'haiku-secrets',
  Key: `certs/${deploy.certificate}`,
}, (err, data) => {
  if (err) {
    throw err;
  }
  console.log(`downloaded ${deploy.certificate}`);
  fse.outputFileSync(path.join(deploy.vault, `${deploy.certificate}`), data.Body);
  s3.getObject({
    Bucket: 'haiku-secrets',
    Key: `certs/${deploy.certificate}.password`,
  }, (s3Error, s3Data) => {
    if (s3Error) {
      throw s3Error;
    }
    console.log(`downloaded ${deploy.certificate}.password`);
    fse.mkdirpSync(deploy.vault);
    fse.outputFileSync(path.join(deploy.vault, `${deploy.certificate}.password`), s3Data.Body);
  });
});
