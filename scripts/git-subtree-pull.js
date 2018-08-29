const cp = require('child_process');
const argv = require('yargs').argv;
const path = require('path');
const log = require('./helpers/log');
const nowVersion = require('./helpers/nowVersion');
const getPackage = require('./helpers/packages');

const ROOT = global.process.cwd();
const branch = argv.branch || 'master';
const packageName = argv.package;
const semver = nowVersion();

if (!packageName) {
  throw new Error('a --package argument is required');
}

if (packageName === 'all') {
  const openSourcePackages = require('./helpers/openSourcePackages');
  openSourcePackages.forEach((openSourcePack) => {
    cp.execSync(`node ./scripts/git-subtree-pull.js --package=${openSourcePack.name}`, {cwd: ROOT, stdio: 'inherit'});
  });
  global.process.exit(0);
}

const pack = packageName === 'changelog'
  ? {
    name: 'changelog',
    remote: 'git@github.com:HaikuTeam/changelog.git',
    abspath: path.join(ROOT, 'changelog/'),
  }
  : getPackage(packageName);

const prefix = packageName === 'changelog' ? 'changelog' : `packages/${pack.name}`;

log.hat(`pulling changes from git subtree for ${packageName} on ${branch}`);

const mergeMessage = `'auto: subtree pull for ${packageName} at ${semver}'`;
const cmd = `git subtree pull --prefix ${prefix} ${pack.remote} ${branch} \
  -m ${mergeMessage}`;
log.log(cmd);
try {
  cp.execSync(cmd, {cwd: ROOT, stdio: 'inherit'});
} catch (err) {
  // Attempt automatic conflict resolution.
  const statusLines = cp.execSync('git status', {cwd: ROOT}).toString().split('\n').map((line) => line.trim());
  let hitUnmergedPaths = false;
  statusLines.forEach((line) => {
    if (!hitUnmergedPaths && line !== 'Unmerged paths:') {
      return;
    }

    hitUnmergedPaths = true;

    if (!/:\s/.test(line)) {
      return;
    }

    if (/^both modified:/.test(line) || /^both added:/.test(line)) {
      cp.execSync(`git checkout --ours ${line.split(':')[1]}`, {cwd: ROOT, stdio: 'inherit'});
    } else if (/^deleted by us:/.test(line) || /^both deleted:/.test(line)) {
      cp.execSync(`git rm ${line.split(':')[1]}`, {cwd: ROOT, stdio: 'inherit'});
    } else {
      throw new Error(`Unable to process line: ${line}`);
    }
  });
  cp.execSync('git add -u', {cwd: ROOT, stdio: 'inherit'});
  cp.execSync(`git commit -m ${mergeMessage}`, {cwd: ROOT, stdio: 'inherit'});
}
