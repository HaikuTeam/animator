var cp = require('child_process')
var path = require('path')

var ROOT = path.join(__dirname, '..')
var DISTRO_SOURCE = path.join(ROOT, 'source')
var PLUMBING_SOURCE = path.join(DISTRO_SOURCE, 'plumbing')

cp.execSync(`rm -rf ${JSON.stringify(DISTRO_SOURCE)}`, { cwd: ROOT, stdio: 'inherit' })
cp.execSync(`mkdir -p ${JSON.stringify(DISTRO_SOURCE)}`, { cwd: ROOT, stdio: 'inherit' })
cp.execSync(`git clone git@github.com:HaikuTeam/plumbing.git`, { cwd: DISTRO_SOURCE, stdio: 'inherit' })
cp.execSync(`rm yarn.lock || true`, { cwd: PLUMBING_SOURCE, stdio: 'inherit' })
cp.execSync(`rm package-lock.json || true`, { cwd: PLUMBING_SOURCE, stdio: 'inherit' })
cp.execSync(`yarn install --production --ignore-engines --non-interactive --mutex file:/tmp/.yarn-mutex`, { cwd: PLUMBING_SOURCE, stdio: 'inherit' })
