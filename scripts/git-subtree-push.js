const cp = require('child_process');
const path = require('path');
const argv = require('yargs').argv;
const log = require('./helpers/log');
const getPackage = require('./helpers/packages');
const ROOT = path.join(__dirname, '..');

const branch = argv.branch || 'master';
const pkg = argv.package;

if (!pkg) {
  throw new Error('a --package argument is required');
}

log.hat(`pushing changes to git subtree for ${pkg} on ${branch}`);

if (pkg === 'changelog') {
  log.log('git subtree pushing changelog');

  // zb: bit of a hack, but we can pay this down in the off-chance that any this logic needs to extend/scale
  // NOTE: there's no analogue written for subtree-pull. the assumption is that repo will be 'push-only'
  const changelog = {
    name: 'changelog',
    remote: 'git@github.com:HaikuTeam/changelog.git',
    abspath: path.join(ROOT, 'changelog/'),
  };

  try {
    const cmd = `git subtree push --prefix ${changelog.name} ${changelog.remote} ${branch}`;
    log.log(cmd);
    cp.execSync(cmd, {cwd: ROOT, stdio: 'inherit'});
  } catch (exception) {
    log.log(exception.message);
  }
} else {
  const pack = getPackage(pkg);

  log.log('git subtree pushing ' + pack.name);

  try {
    const cmd = `git subtree push --prefix packages/${pack.name} ${pack.remote} ${branch}`;
    log.log(cmd);
    cp.execSync(cmd, {cwd: ROOT, stdio: 'inherit'});
  } catch (exception) {
    log.log(exception.message);
  }
}
