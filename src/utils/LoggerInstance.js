var fs = require('haiku-fs-extra')
var path = require('path')
var Logger = require('./Logger')
var { HOMEDIR_LOGS_PATH } = require('./HaikuHomeDir')

fs.mkdirpSync(HOMEDIR_LOGS_PATH)
const logger = new Logger(HOMEDIR_LOGS_PATH, 'haiku-debug.log')

module.exports = logger
