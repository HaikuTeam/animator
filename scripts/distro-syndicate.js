const path = require('path');
const inquirer = require('inquirer');
const argv = require('yargs').argv;

require('../config');
const deploy = require('./deploy');
const initializeAWSService = require('./helpers/initializeAwsService');
const log = require('./helpers/log');

const platform = global.process.env.HAIKU_RELEASE_PLATFORM;
const branch = global.process.env.HAIKU_RELEASE_BRANCH;
const version = global.process.env.HAIKU_RELEASE_VERSION;
const environment = global.process.env.HAIKU_RELEASE_ENVIRONMENT;

const region = deploy.deployer[environment].region;
const key = deploy.deployer[environment].key;
const secret = deploy.deployer[environment].secret;
const bucket = deploy.deployer[environment].bucket;
const distribution = deploy.deployer[environment].distribution;

const s3 = initializeAWSService('S3', region, key, secret);
const cloudFront = initializeAWSService('CloudFront', region, key, secret);

const latestDownloadKey = `releases/${environment}-${branch}-${platform}-latest.dmg`;

const syndicate = (patchKey, newLatestDownloadKey) => {
  // Make a backup of our latest in case we need to roll back.
  //  e.g. /haiku-electron-releases-production/releases/production-master-mac-latest.dmg - copy to ->
  //       /haiku-electron-releases-production/releases/production-master-mac-previous.dmg
  s3.copyObject({
    Bucket: bucket,
    CopySource: `/${bucket}/${latestDownloadKey}`,
    Key: latestDownloadKey.replace('-latest', '-previous'),
    ACL: 'public-read',
  })
    .promise()
    .then(() => {
      // Deploy the patch update to catch in-app users.
      //  e.g. /haiku-electron-releases-production/releases/releases/production/master/mac/12345/1.2.3/Haiku-1.2.3-mac-pending.zip - copy to ->
      //       /haiku-electron-releases-production/releases/releases/production/master/mac/12345/1.2.3/Haiku-1.2.3-mac.zip
      s3.copyObject({
        Bucket: bucket,
        CopySource: `/${bucket}/${patchKey}`,
        Key: patchKey.replace('-pending', ''),
        ACL: 'public-read',
      })
        .promise()
        .then(() => {
          // Deploy the Inkstone update to catch new users.
          //  e.g. /haiku-electron-releases-production/releases/releases/production/master/mac/12345/1.2.3/Haiku-1.2.3.dmg - copy to ->
          //       /haiku-electron-releases-production/releases/production-master-mac-latest.dmg
          s3.copyObject({
            Bucket: bucket,
            CopySource: `/${bucket}/${newLatestDownloadKey}`,
            Key: latestDownloadKey,
            ACL: 'public-read',
          })
            .promise()
            .then(() => {
              cloudFront.createInvalidation({
                DistributionId: distribution,
                InvalidationBatch: {
                  CallerReference: Date.now().toString(),
                  Paths: {
                    Quantity: 1,
                    Items: [`/${latestDownloadKey}`],
                  },
                },
              })
                .promise()
                .then(() => {
                  log.hat('Syndication complete!');
                })
                .catch(() => {
                  log.err('Unable to create CloudFront invalidation!');
                  global.process.exit(1);
                });
            })
            .catch(() => {
              log.err(`Unable to syndicate latest key (${latestDownloadKey})`);
              global.process.exit(1);
            });
        })
        .catch(() => {
          log.err(`Unable to syndicate patch key (${patchKey})`);
          global.process.exit(1);
        });
    })
    .catch(() => {
      log.err(`Unable to back up latest release! Aborting.`);
      global.process.exit(1);
    });
};

const maybeSyndicate = (data) => {
  const potentialPatches = data.Contents.filter((potentialPatchKey) =>
    path.basename(potentialPatchKey.Key).startsWith(`Haiku-${version}-${platform}`));
  if (potentialPatches.length === 0) {
    log.err('Unable to find pending patch key!');
    global.process.exit(1);
  }

  if (potentialPatches.length > 1) {
    log.err(`Found too many potential patches:\n${potentialPatches.map((obj) => obj.Key).join('\n')}`);
    global.process.exit(1);
  }

  const patchKey = potentialPatches[0].Key;
  if (!patchKey.endsWith('-pending.zip')) {
    log.err(`Aborting attempt to release already released patch: ${patchKey}`);
    global.process.exit(1);
  }

  log.log(`Found patch key: ${patchKey}`);

  const potentialLatests = data.Contents.filter((potentialLatestKey) =>
    path.basename(potentialLatestKey.Key) === `Haiku-${version}.dmg`);

  if (potentialLatests.length !== 1) {
    log.err('Unable to find unique pending latest key!');
    global.process.exit(1);
  }

  const newLatestDownloadKey = potentialLatests[0].Key;
  log.warn(`WARNING: about to syndicate ${patchKey} and ${newLatestDownloadKey}!`);

  if (argv['non-interactive']) {
    syndicate(patchKey, newLatestDownloadKey);
    return;
  }

  inquirer.prompt([
    {
      type: 'confirm',
      name: 'continue',
      message: 'Continue',
      default: false,
    },
  ]).then((answers) => {
    if (!answers.continue) {
      log.log('Aborting publish by user request');
      global.process.exit(0);
    }

    syndicate(patchKey);
  });
};

s3.listObjects({Bucket: bucket, Prefix: `releases/${environment}/${branch}/${platform}`})
  .promise()
  .then(maybeSyndicate)
  .catch(() => {
    log.err('Unable to list candidate patch releases');
    global.process.exit(1);
  });
