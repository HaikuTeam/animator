var cp = require('child_process')
var path = require('path')

var ROOT = path.join(__dirname, '..')
var DISTRO_SOURCE = path.join(ROOT, 'source')
var PLUMBING_SOURCE = path.join(DISTRO_SOURCE, 'plumbing')

cp.execSync(`./node_modules/.bin/electron-rebuild --version 1.7.0 --module-dir ${JSON.stringify(PLUMBING_SOURCE)}`, { cwd: ROOT, stdio: 'inherit' })
