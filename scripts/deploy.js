var os = require('os')
var path = require('path')
require(path.join(os.homedir(), 'Secrets', 'haiku-distro.js'))

if (!process.env.HAIKU_INTENRAL_SLACK_CLIENT_ID) throw new Error('env var missing')
if (!process.env.HAIKU_INTENRAL_SLACK_CLIENT_SECRET) throw new Error('env var missing')
if (!process.env.HAIKU_INTENRAL_SLACK_TOKEN) throw new Error('env var missing')
if (!process.env.HAIKU_RELEASE_WRITER_KEY) throw new Error('env var missing')
if (!process.env.HAIKU_RELEASE_WRITER_SECRET) throw new Error('env var missing')
if (!process.env.HAIKU_S3_DEPLOYER_KEY) throw new Error('env var missing')
if (!process.env.HAIKU_S3_DEPLOYER_SECRET) throw new Error('env var missing')

module.exports = {
  slack: {
    clientId: process.env.HAIKU_INTENRAL_SLACK_CLIENT_ID,
    clientSecret: process.env.HAIKU_INTENRAL_SLACK_CLIENT_SECRET,
    token: process.env.HAIKU_INTENRAL_SLACK_TOKEN
  },
  deployer: {
    production: {
      region: 'us-east-1',
      bucket: 'haiku-electron-releases-production',
      user: 'haiku-electron-releases-writer-2',
      key: process.env.HAIKU_RELEASE_WRITER_KEY,
      secret: process.env.HAIKU_RELEASE_WRITER_SECRET
    },
    staging: {
      region: 'us-east-1',
      bucket: 'haiku-electron-releases-staging',
      user: 'haiku-electron-releases-writer-2',
      key: process.env.HAIKU_RELEASE_WRITER_KEY,
      secret: process.env.HAIKU_RELEASE_WRITER_SECRET
    },
    development: {
      region: 'us-east-1',
      bucket: 'haiku-electron-releases-development',
      user: 'haiku-electron-releases-writer-2',
      key: process.env.HAIKU_RELEASE_WRITER_KEY,
      secret: process.env.HAIKU_RELEASE_WRITER_SECRET
    },
    test: {
      region: 'us-east-1',
      bucket: 'haiku-electron-releases-test',
      user: 'haiku-electron-releases-writer-2',
      key: process.env.HAIKU_RELEASE_WRITER_KEY,
      secret: process.env.HAIKU_RELEASE_WRITER_SECRET
    }
  },
  'code.haiku.ai': {
    production: {
      user: 'haiku-s3-deployer-2',
      key: process.env.HAIKU_S3_DEPLOYER_KEY,
      secret: process.env.HAIKU_S3_DEPLOYER_SECRET
    }
  },
  cloudfront: {
    production: {
      distributionId: 'E1FUJARDP1LMEC',
      profile: 'haiku'
    }
  },
  marketing: {
    production: {
      user: 'haiku-s3-deployer-2',
      key: process.env.HAIKU_S3_DEPLOYER_KEY,
      secret: process.env.HAIKU_S3_DEPLOYER_SECRET
    }
  }
}
