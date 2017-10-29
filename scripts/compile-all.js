var cp = require('child_process')
var allPackages = require('./helpers/allPackages')()

if (!process.env.NODE_ENV) {
  // babel-cli requires this to be set for reasons I don't know
  process.env.NODE_ENV = 'development'
}

allPackages.forEach((pack) => {
  if (pack.pkg && pack.pkg.scripts) {
    if (pack.pkg.scripts.compile) {
      console.log(pack.name)
      cp.execSync('yarn run compile', { cwd: pack.abspath, stdio: 'inherit' })
    } else if (pack.pkg.scripts.transpile) {
      cp.execSync('yarn run transpile', { cwd: pack.abspath, stdio: 'inherit' })
    }
  }
})
