var os = require('os')
var fse = require('fs-extra')
var cp = require('child_process')
var path = require('path')

var ROOT = path.join(__dirname, '..')

process.env.CSC_LINK = `file://${os.homedir()}/Secrets/DeveloperIdApplicationMatthewB73M94S23A.p12`
process.env.CSC_KEY_PASSWORD = fse.readFileSync(path.join(os.homedir(), '/Secrets/DeveloperIdApplicationMatthewB73M94S23A.p12.password')).toString().trim()
cp.execSync(`./node_modules/.bin/build --mac`, { cwd: ROOT, stdio: 'inherit' })
