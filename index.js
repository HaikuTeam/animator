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

// On Windows and Linux, custom protocol handler is passed as argument
const haikuURI = process.argv.find((arg) => arg.startsWith('haiku://'));

if (process.env.HAIKU_APP_LAUNCH_CLI === '1') {
  require('@haiku/cli');
} else {
  const {app, dialog} = require('electron');

  if (process.env.NODE_ENV === 'production' && os.platform() === 'darwin' && !app.isInApplicationsFolder()) {
    dialog.showErrorBox(
      'Move to Applications folder',
      'You cannot run Haiku for Mac from the current folder. Please move Haiku for Mac to the Applications folder and try again.',
    );
    global.process.exit(0);
  }

  app.once('open-url', (event, url) => {
    global.process.env.HAIKU_INITIAL_URL = url;
  });

  if (haikuURI) {
    global.process.env.HAIKU_INITIAL_URL = haikuURI;
  }

  const haikuHelperArgs = {stdio: 'inherit'};
  if (global.process.env.HAIKU_DEBUG) {
    haikuHelperArgs.execArgv = ['--inspect=9221'];
  }

  global.haikuHelper = cp.fork(path.join(__dirname, 'HaikuHelper'), haikuHelperArgs);
  global.haikuHelper.on('message', (data) => {
    if (!data || typeof data !== 'object' || !data.message) {
      return;
    }

    const {message} = data;
    switch (message) {
      case 'launchCreator':
        global.process.env.HAIKU_ENV = JSON.stringify(data.haiku);
        require('haiku-creator/lib/electron');
        break;
      case 'bakePngSequence':
        require('haiku-creator/lib/bakery/electron').default(
          data,
          () => {
            global.haikuHelper.send({type: 'bakePngSequenceComplete'});
          },
        );
        break;
    }
  });

  global.haikuHelper.on('exit', global.process.exit);
  global.process.on('exit', () => {
    haikuHelper.kill('SIGKILL');
  });
}
