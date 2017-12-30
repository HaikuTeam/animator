const fs = require('fs');
const path = require('path');

process.env.HAIKU_GLASS_URL_MODE = 'distro';
process.env.HAIKU_TIMELINE_URL_MODE = 'distro';
process.env.HAIKU_INTERPRETER_URL_MODE = 'distro';

if (process.env.HAIKU_APP_LAUNCH_CLI === '1') {
  process.env.HAIKU_APP_SKIP_LOG = '1';
  require('./config');
  if (fs.existsSync('./packages/@haiku/cli')) {
    require('./packages/@haiku/cli');
  } else if (fs.existsSync('./packages/haiku-plumbing/node_modules/@haiku/cli')) {
    require('./packages/haiku-plumbing/node_modules/@haiku/cli');
  }
} else {
  require('./config');
  require('./packages/haiku-plumbing/HaikuHelper');
}
