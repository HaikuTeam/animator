const fse = require('fs-extra')
const cp = require('child_process')
const path = require('path')
//const deploy = require('./deploy')
const forceNodeEnvProduction = require('./helpers/forceNodeEnvProduction')

require('./../config')
forceNodeEnvProduction()

const ROOT = global.process.cwd()


if (process.env.HAIKU_RELEASE_PLATFORM==='mac'){
    process.env.CSC_LINK = `file://${deploy.vault}/${deploy.certificate}`
    process.env.CSC_KEY_PASSWORD = fse.readFileSync(path.join(deploy.vault, `${deploy.certificate}.password`)).toString().trim()
    
    cp.execSync(`./node_modules/.bin/build --mac --publish=never`, { cwd: ROOT, stdio: 'inherit' })
}
else if (process.env.HAIKU_RELEASE_PLATFORM==='windows'){
    //process.env.WIN_CSC_LINK = `file://${deploy.vault}/${deploy.certificate}`
    //process.env.WIN_CSC_KEY_PASSWORD = fse.readFileSync(path.join(deploy.vault, `${deploy.certificate}.password`)).toString().trim()
    
    //cp.execSync(".\\node_modules\\.bin\\build --windows --publish=never", { cwd: ROOT, stdio: 'inherit' })

    cp.execSync(".\\node_modules\\.bin\\build --windows --publish=never --config.forceCodeSigning=false", { cwd: ROOT, stdio: 'inherit' })


}
else if (process.env.HAIKU_RELEASE_PLATFORM==='linux') {
    cp.execSync(`./node_modules/.bin/build --linux --publish=never`, { cwd: ROOT, stdio: 'inherit' })
}