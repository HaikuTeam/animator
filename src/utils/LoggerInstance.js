var fs = require('haiku-fs-extra')
var path = require('path')
var Logger = require('./Logger')
var HaikuHomeDir = require('./HaikuHomeDir')

const logdir = path.join(HaikuHomeDir.HOMEDIR_PATH, 'logs')
fs.mkdirpSync(logdir)
const logger = new Logger(logdir, 'haiku-debug.log')

module.exports = logger
