var cp = require('child_process')
// var argv = require('yargs').argv
var path = require('path')
var argv = require('yargs').argv
var log = require('./helpers/log')
var allPackages = require('./helpers/allPackages')()
var ROOT = path.join(__dirname, '..')
var TMP = '~tmp'

allPackages.forEach(function (pack, next) {
  if (argv.package && pack.name !== argv.package) return void (0)
  log.log(`syncing ${pack.name}`)
  cp.execSync(`rm -rf ${TMP} || true`, { cwd: ROOT, stdio: 'inherit' })
  cp.execSync(`mkdir -p ${TMP}`, { cwd: ROOT, stdio: 'inherit' })
  cp.execSync(`git clone ${pack.remote} .`, { cwd: path.join(ROOT, TMP), stdio: 'inherit' })
  cp.execSync(`rm -rf ${JSON.stringify(path.join(pack.abspath, '.git'))} || true`, { cwd: ROOT, stdio: 'inherit' })
  cp.execSync(`mv ${TMP}/.git ${JSON.stringify(pack.abspath)}`, { cwd: path.join(ROOT), stdio: 'inherit' })
  cp.execSync(`git add .`, { cwd: pack.abspath, stdio: 'inherit' })
  cp.execSync(`git commit -m "chore: updates" || true`, { cwd: pack.abspath, stdio: 'inherit' })
  cp.execSync(`git push origin master`, { cwd: pack.abspath, stdio: 'inherit' })
  cp.execSync(`rm -rf ${JSON.stringify(path.join(pack.abspath, '.git'))}`, { cwd: ROOT, stdio: 'inherit' })
  cp.execSync(`rm -rf ${TMP}`, { cwd: ROOT, stdio: 'inherit' })
})
