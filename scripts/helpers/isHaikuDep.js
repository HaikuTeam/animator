module.exports = (name) => name.startsWith('haiku-') ||
  ['@haiku/player', '@haiku/cli', '@haiku/sdk-inkstone', '@haiku/sdk-client'].includes(name)
