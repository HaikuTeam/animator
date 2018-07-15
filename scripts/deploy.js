const os = require('os');
const path = require('path');

let VAULT = path.join(os.homedir(), 'Secrets');

if (!process.env.HAIKU_INTERNAL_SLACK_CLIENT_ID) {
  throw new Error('env var missing');
}
if (!process.env.HAIKU_INTERNAL_SLACK_CLIENT_SECRET) {
  throw new Error('env var missing');
}
if (!process.env.HAIKU_INTERNAL_SLACK_TOKEN) {
  throw new Error('env var missing');
}
if (!process.env.HAIKU_INTERNAL_SLACK_LEGACY_TOKEN) {
  throw new Error('env var missing');
}
if (!process.env.HAIKU_RELEASE_WRITER_KEY) {
  throw new Error('env var missing');
}
if (!process.env.HAIKU_RELEASE_WRITER_SECRET) {
  throw new Error('env var missing');
}
if (!process.env.HAIKU_S3_DEPLOYER_KEY) {
  throw new Error('env var missing');
}
if (!process.env.HAIKU_S3_DEPLOYER_SECRET) {
  throw new Error('env var missing');
}

module.exports = {
  vault: VAULT,
  certificate: 'HaikuSystemsIncDeveloperId.p12', // Haiku Systems, new
  // certificate: 'DeveloperIdApplicationMatthewB73M94S23A.p12',
  cloud_installer: {

  },
  slack: {
    clientId: process.env.HAIKU_INTERNAL_SLACK_CLIENT_ID,
    clientSecret: process.env.HAIKU_INTERNAL_SLACK_CLIENT_SECRET,
    token: process.env.HAIKU_INTERNAL_SLACK_TOKEN,
    legacy: process.env.HAIKU_INTERNAL_SLACK_LEGACY_TOKEN,
  },
  deployer: {
    production: {
      region: 'us-east-1',
      bucket: 'haiku-electron-releases-production',
      user: 'haiku-electron-releases-writer-2',
      distribution: 'E29RYBWU7AU9',
      key: process.env.HAIKU_RELEASE_WRITER_KEY,
      secret: process.env.HAIKU_RELEASE_WRITER_SECRET,
    },
    development: {
      region: 'us-east-1',
      bucket: 'haiku-electron-releases-development',
      user: 'haiku-electron-releases-writer-2',
      key: process.env.HAIKU_RELEASE_WRITER_KEY,
      secret: process.env.HAIKU_RELEASE_WRITER_SECRET,
    },
  },
  'code.haiku.ai': {
    production: {
      user: 'haiku-s3-deployer-2',
      key: process.env.HAIKU_S3_DEPLOYER_KEY,
      secret: process.env.HAIKU_S3_DEPLOYER_SECRET,
    },
  },
  cloudfront: {
    production: {
      distributionId: 'E1FUJARDP1LMEC',
      profile: 'haiku',
    },
  },
  marketing: {
    production: {
      user: 'haiku-s3-deployer-2',
      key: process.env.HAIKU_S3_DEPLOYER_KEY,
      secret: process.env.HAIKU_S3_DEPLOYER_SECRET,
    },
  },
};
