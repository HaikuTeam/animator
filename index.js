// This file requires a sibling config.js in order to be functional.
const path = require('path');
const cp = require('child_process');

process.env.HAIKU_GLASS_URL_MODE = 'distro';
process.env.HAIKU_TIMELINE_URL_MODE = 'distro';
process.env.HAIKU_INTERPRETER_URL_MODE = 'distro';

require('./config');
if (process.env.HAIKU_APP_LAUNCH_CLI === '1') {
  process.env.HAIKU_APP_SKIP_LOG = '1';
  require('@haiku/cli');
} else {
  const haikuHelper = cp.fork(
    path.join(__dirname, 'node_modules', 'haiku-plumbing', 'HaikuHelper'),
    {stdio: 'inherit'}
  );

  haikuHelper.on('message', (data) => {
    if (!data || typeof data !== 'object' || !data.message) {
      return
    }

    const {message, haiku} = data
    if (message === 'launchCreator') {
      global.process.env.HAIKU_ENV = JSON.stringify(haiku);
      require('haiku-creator/lib/electron');
    }
  });

  haikuHelper.on('exit', global.process.exit)
  global.process.on('exit', () => {
    haikuHelper.kill('SIGKILL')
  })
}
