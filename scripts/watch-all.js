const async = require('async');
const cp = require('child_process');
const {join} = require('path');
const argv = require('yargs').argv;

const log = require('./helpers/log');
const allPackages = require('./helpers/packages')();

if (!process.env.NODE_ENV) {
  // babel-cli requires this to be set for reasons I don't know
  process.env.NODE_ENV = 'development';
}

// Note the packages we would never want to develop for specific dev choices.
const appOwnedDeps = ['haiku-creator', 'haiku-plumbing'];
const devChoiceExclusions = {
  glass: appOwnedDeps.concat(['haiku-timeline']),
  timeline: appOwnedDeps.concat(['haiku-glass']),
  everything: [],
};
const devChoice = argv.devChoice || 'everything';
const children = [];

const runInstruction = (pack, cb) => {
  const cmd = 'yarn';
  const useTscWatch = pack.pkg.scripts.develop === 'tsc --watch';
  const cwd = useTscWatch ? global.process.cwd() : pack.abspath;
  const args = useTscWatch ?
    [
      'tsc-watch',
      '-p',
      pack.abspath,
      '--onSuccess',
      `node ${join(cwd, 'scripts', 'write-last-compiled')} --outputPath=${join(pack.abspath, '.last-compile')}`
    ] :
    ['develop'];
  const proc = cp.spawn(cmd, args, {cwd, env: process.env, stdio: 'inherit'});
  children.push({
    info: {cwd, cmd, args},
    proc,
  });
  cb();
};

let allWatchersActive = false;

async.each(allPackages, (pack, done) => {
  const {shortname} = pack;
  if (devChoiceExclusions[devChoice] && devChoiceExclusions[devChoice].includes(shortname)) {
    done();
    return;
  }

  switch (shortname) {
    case 'serialization':
    case 'fs-extra':
    case 'vendor-legacy':
      // These don't have watchers or need special treatment.
      done();
      break;
    default:
      // Standard, new way of doing things: `yarn develop`.
      runInstruction(pack, done);
      break;
  }
}, () => {
  allWatchersActive = true;
});

const exit = () => {
  if (!allWatchersActive) {
    setTimeout(exit, 500);
    return;
  }

  log.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$');
  log.log('exiting; telling children to interrupt');
  log.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$');

  children.forEach((child, index) => {
    log.log('$$$$$ ' + index + ' ' + JSON.stringify(child.info));
    if (child.proc.stdin) {
      child.proc.stdin.end();
    }
    if (child.proc.stdout) {
      child.proc.stdout.destroy();
    }
    if (child.proc.stderr) {
      child.proc.stderr.destroy();
    }
    child.proc.kill('SIGKILL');
  });
};

global.process.on('exit', exit);
global.process.on('uncaughtException', exit);
