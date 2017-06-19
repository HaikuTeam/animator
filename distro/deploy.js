module.exports = {
  slack: {
    clientId: '37379153060.184971918048',
    clientSecret: '86222e2ece31ba6e4511e7fd85175d34',
    token: 'xoxp-37379153060-37430867396-185691464980-fa4b852837724e21a7314fbda6d4d2fc'
  },
  deployer: {
    production: {
      region: 'us-east-1',
      bucket: 'haiku-electron-releases-production',
      user: 'haiku-electron-releases-writer',
      key: 'AKIAIE3WQFLUBUYHPWHQ',
      secret: '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',
    },
    staging: {
      region: 'us-east-1',
      bucket: 'haiku-electron-releases-staging',
      user: 'haiku-electron-releases-writer',
      key: 'AKIAIE3WQFLUBUYHPWHQ',
      secret: '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',
    },
    development: {
      region: 'us-east-1',
      bucket: 'haiku-electron-releases-development',
      user: 'haiku-electron-releases-writer',
      key: 'AKIAIE3WQFLUBUYHPWHQ',
      secret: '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',
    },
    test: {
      region: 'us-east-1',
      bucket: 'haiku-electron-releases-test',
      user: 'haiku-electron-releases-writer',
      key: 'AKIAIE3WQFLUBUYHPWHQ',
      secret: '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',
    },
  },
  marketing: {
    production: {
      user: 'haiku-s3-deployer',
      key: 'AKIAIH7B7VTCOY2IXGCQ',
      secret: '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'
    }
  }
}
