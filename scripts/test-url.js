const cp = require('child_process');
const path = require('path');

const inquirer = require('inquirer');
const {argv} = require('yargs');

const log = require('./helpers/log');

const isAcceptableUrl = (url) => url.startsWith('haiku://');

log.hat(`Note: you MUST have Haiku running in dev mode (e.g. with \`yarn go\`) to use this command.

If you want to test a URL in the release version of Haiku, simply use \`open haiku://my/url?to=test\``);

let urlToOpen = '';

if (argv._.length > 0) {
  urlToOpen = argv._[0];
}

const promptForUrl = () => inquirer.prompt([{
  type: 'input',
  name: 'url',
  message: 'URL to open',
  default: 'haiku://',
}]).then(({url}) => {
  log.warn('got ' + url);
  go(url);
});

const go = (url) => {
  if (!isAcceptableUrl(url)) {
    promptForUrl();
  } else {
    cp.execSync(
      `open '${url}' -a ${path.resolve(path.join(require.resolve('electron'), '..', 'dist', 'Electron.app'))}`,
    );
  }
};

go(urlToOpen);
