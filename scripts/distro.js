var cp = require('child_process')
var path = require('path')
var lodash = require('lodash')
var argv = require('yargs').argv

var inputs = lodash.assign({}, argv)
delete inputs._
delete inputs.$0

var ROOT = path.join(__dirname, '..')
var DISTRO = path.join(ROOT, 'distro')

cp.execSync('npm install', { cwd: DISTRO, stdio: 'inherit' })

var pipeline = cp.fork(path.join(DISTRO, 'pipeline.js'), [`--version=${inputs.version}`], { cwd: DISTRO, stdio: 'inherit' })

pipeline.on('close', (code) => {
  if (code !== 0) throw new Error('Error in distro pipeline')
})
