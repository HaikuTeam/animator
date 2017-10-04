var fse = require('fs-extra')
var cp = require('child_process')
var path = require('path')
var deploy = require('./deploy')

require('./../config')

var ROOT = path.join(__dirname, '..')

process.env.CSC_LINK = `file://${deploy.vault}/${deploy.certificate}`
process.env.CSC_KEY_PASSWORD = fse.readFileSync(path.join(deploy.vault, `${deploy.certificate}.password`)).toString().trim()

cp.execSync(`./node_modules/.bin/build --mac`, { cwd: ROOT, stdio: 'inherit' })
