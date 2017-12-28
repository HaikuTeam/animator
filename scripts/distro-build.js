const fse = require('fs-extra')
const cp = require('child_process')
const path = require('path')
const deploy = require('./deploy')
const forceNodeEnvProduction = require('./helpers/forceNodeEnvProduction')

require('./../config')
forceNodeEnvProduction()

const ROOT = global.process.cwd()

process.env.CSC_LINK = `file://${deploy.vault}/${deploy.certificate}`
process.env.CSC_KEY_PASSWORD = fse.readFileSync(path.join(deploy.vault, `${deploy.certificate}.password`)).toString().trim()

cp.execSync(`./node_modules/.bin/build --mac --publish=never`, { cwd: ROOT, stdio: 'inherit' })
