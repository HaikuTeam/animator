var path = require('path')
var fs = require('fs')
var os = require('os')
var cp = require('child_process')
var platform = os.platform()
var systemRootPath = (platform === "win32") ? process.cwd().split(path.sep)[0] : '/'

function run () {
  if (platform === 'darwin') {
    var appPath = path.join(systemRootPath, 'Applications', 'Haiku.app')
    var appExists = fs.existsSync(appPath)
    if (appExists) {
      var cliInstallerPath = path.join(appPath, 'Contents', 'Resources', 'app.asar.unpacked', 'packages' 'haiku-plumbing', 'bins', 'install')
      var cliInstallerExists = fs.existsSync(cliInstallerPath)
      if (cliInstallerExists) {
        var execOut = cp.execSync(cliInstallerPath)
        if (execOut) {
          console.log('\n')
          console.log(execOut.toString())
        }
      } else {
        throw new Error('Haiku command-line tools installer is missing; please contact support')
      }
    } else {
      throw new Error('Haiku Desktop must be installed before running this script')
    }
  } else {
    throw new Error('Platform ' + platform + ' is not supported by Haiku yet')
  }
}

run()
