const fs = require('haiku-fs-extra');
const {Logger} = require('./Logger');
const {HOMEDIR_LOGS_PATH} = require('./HaikuHomeDir');
fs.mkdirpSync(HOMEDIR_LOGS_PATH);
const logger = new Logger(HOMEDIR_LOGS_PATH, 'haiku-debug.log');
module.exports = logger;
