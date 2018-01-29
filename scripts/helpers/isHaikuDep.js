module.exports = (name) => name.startsWith('haiku-') ||
  [
    '@haiku/core',
    '@haiku/cli',
    '@haiku/sdk-inkstone',
    '@haiku/sdk-client'
  ].includes(name)
