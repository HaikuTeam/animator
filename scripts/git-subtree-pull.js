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
  cp.execSync('git checkout --ours .', {cwd: ROOT, stdio: 'inherit'});
  cp.execSync('git add -u', {cwd: ROOT, stdio: 'inherit'});
  cp.execSync(`git commit -m ${mergeMessage}`, {cwd: ROOT, stdio: 'inherit'});
}
