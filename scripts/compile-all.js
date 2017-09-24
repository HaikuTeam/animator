var cp = require('child_process')
var allPackages = require('./helpers/allPackages')()

allPackages.forEach((pack) => {
  if (pack.pkg && pack.pkg.scripts) {
    if (pack.pkg.scripts.compile) {
      cp.execSync('yarn run compile', { cwd: pack.abspath, stdio: 'inherit' })
    } else if (pack.pkg.scripts.transpile) {
      cp.execSync('yarn run transpile', { cwd: pack.abspath, stdio: 'inherit' })
    }
  }
})
