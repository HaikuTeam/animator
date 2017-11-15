var path = require('path')

process.env.HAIKU_GLASS_URL_MODE = 'distro'
process.env.HAIKU_TIMELINE_URL_MODE = 'distro'
process.env.HAIKU_INTERPRETER_URL_MODE = 'distro'

if (process.env.HAIKU_APP_LAUNCH_CLI === '1') {
  process.env.HAIKU_APP_SKIP_LOG = '1'
  require('./config')
  require('./source/plumbing/node_modules/@haiku/cli')
} else {
  require('./config')
  require('./source/plumbing/HaikuHelper')
}
