const path = require('path');
const cp = require('child_process');
const os = require('os');

if (!global.process.env.NODE_ENV || global.process.env.NODE_ENV === 'production') {
  process.env.HAIKU_GLASS_URL_MODE = 'distro';
  process.env.HAIKU_TIMELINE_URL_MODE = 'distro';
  process.env.HAIKU_INTERPRETER_URL_MODE = 'distro';
  if (process.env.HAIKU_APP_LAUNCH_CLI === '1') {
    process.env.HAIKU_APP_SKIP_LOG = '1';
  }
  require('./config');
}

if (process.env.HAIKU_APP_LAUNCH_CLI === '1') {
  require('@haiku/cli');
} else {
  const {app, dialog} = require('electron');

  if (process.env.NODE_ENV === 'production' && os.platform() === 'darwin' && !app.isInApplicationsFolder()) {
    dialog.showErrorBox(
      'Move to Applications folder',
      'You cannot run Haiku for Mac from the current folder. Please move Haiku for Mac to the Applications folder and try again.'
    );
    global.process.exit(0);
  }
  app.once('open-url', (event, url) => {
    global.process.env.HAIKU_INITIAL_URL = url;
  });
  const haikuHelperArgs = {stdio: 'inherit'};
  if (global.process.env.HAIKU_DEBUG) {
    haikuHelperArgs.execArgv = ['--inspect=9221'];
  }
  const haikuHelper = cp.fork(path.join(__dirname, 'HaikuHelper'), haikuHelperArgs);

  haikuHelper.on('message', (data) => {
    if (!data || typeof data !== 'object' || !data.message) {
      return;
    }

    const {message, haiku} = data;
    if (message === 'launchCreator') {
      global.process.env.HAIKU_ENV = JSON.stringify(haiku);
      require('haiku-creator/lib/electron');
    }
  });

  haikuHelper.on('exit', global.process.exit);
  global.process.on('exit', () => {
    haikuHelper.kill('SIGKILL');
  });
}
