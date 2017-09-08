var path = require('path')
var os = require('os')

var out = {}

var HOMEDIR_PATH = path.join(os.homedir(), '.haiku')

out.HOMEDIR_PATH = HOMEDIR_PATH
out.HOMEDIR_AUTH_PATH = path.join(HOMEDIR_PATH, 'auth')
out.HOMEDIR_PROJECTS_PATH = path.join(HOMEDIR_PATH, 'projects')
out.HOMEDIR_LOGS_PATH = path.join(HOMEDIR_PATH, 'logs')
out.HOMEDIR_MANIFEST_PATH = path.join(HOMEDIR_PATH, 'manifest.json')

module.exports = out
