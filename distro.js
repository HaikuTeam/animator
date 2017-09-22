var argv = require('yargs').argv
var cp = require('child_process')
var fse = require('fs-extra')
var path = require('path')
var lodash = require('lodash')
var hb = require('handlebars')
var os = require('os')
var slack = require('slack')
var moment = require('moment')
var inquirer = require('inquirer')
// var Uglify2 = require('uglify-js')
// var glob = require('glob-all')
// var async = require('async')
// var path = require('path')
// var fs = require('fs-extra')
var deploy = require('./deploy')
var uploadRelease = require('./scripts/helpers/uploadRelease')

var ENVS = { test: true, development: true, staging: true, production: true }
var RELEASE_LOG = fse.readJsonSync(path.join(__dirname, 'releases.json'))
var DISTRO_SOURCE = path.join(__dirname, 'distro-source')
var PLUMBING_SOURCE = path.join(DISTRO_SOURCE, 'plumbing')

var inputs = lodash.assign({}, argv)
delete inputs.$0
delete inputs._

if (!inputs.version) {
  inputs.version = fse.readJsonSync(path.join(__dirname, 'package.json')).version
}

inputs.branch = 'master'

inquirer.prompt([
  {
    type: 'input',
    name: 'environment',
    message: `Environment tag (helps specify the release bucket; affects autoupdate):`,
    default: inputs.environment || 'staging'
  },
  {
    type: 'confirm',
    name: 'uglify',
    message: 'Obfuscate source code in release bundle ("yes" is *required* for production)?:',
    default: false
  },
  {
    type: 'confirm',
    name: 'upload',
    message: 'Upload release to public distro server?:',
    default: false
  },
  {
    type: 'confirm',
    name: 'shout',
    message: 'Notify our internal Slack account about build progress?:',
    default: false
  }
]).then(function (answers) {
  lodash.assign(inputs, answers)

  if (inputs.uglify === false && inputs.environment === 'production') {
    throw new Error(`refusing to create a non-obfuscated build for 'production'`)
  }

  if (!ENVS[inputs.environment]) {
    throw new Error(`the 'environment' tag must be a member of ${JSON.stringify(ENVS)}`)
  }

  if (!inputs.version) {
    throw new Error(`a 'version' semver tag is required`)
  }

  console.log(`using these inputs: ${JSON.stringify(inputs, null, 2)}`)
  inquirer.prompt([
    {
      type: 'confirm',
      name: 'proceed',
      message: 'Ok to proceed with distro?:',
      default: true
    }
  ]).then(function (answers) {
    if (answers.proceed) {
      console.log('ok, proceeding...')
      return runit()
    } else {
      console.log('bailing.')
      process.exit()
    }
  })
}).catch(function (exception) {
  console.log(exception)
  process.exit()
})

function shout (text, cb) {
  if (inputs.shout) {
    return slack.chat.postMessage({
      text: text,
      token: deploy.slack.token,
      channel: 'creator',
      username: 'Haiku Distro',
      icon_emoji: ':robot_face:'
    }, function (err) {
      if (err) console.error(err)
      return cb()
    })
  }
  return cb()
}

function writeHackyDynamicConfig () {
  var src = fse.readFileSync(path.join(__dirname, '_config.js.handlebars')).toString()
  var tpl = hb.compile(src)
  var result = tpl(inputs)
  fse.writeFileSync(path.join(__dirname, 'config.js'), result)
}

function buildStuff () {
  cp.execSync(`rm -rf ${JSON.stringify(DISTRO_SOURCE)}`, { cwd: __dirname, stdio: 'inherit' })
  cp.execSync(`mkdir -p ${JSON.stringify(DISTRO_SOURCE)}`, { cwd: __dirname, stdio: 'inherit' })
  cp.execSync(`git clone git@github.com:HaikuTeam/plumbing.git`, { cwd: DISTRO_SOURCE, stdio: 'inherit' })
  cp.execSync(`rm yarn.lock || true`, { cwd: PLUMBING_SOURCE, stdio: 'inherit' })
  cp.execSync(`rm package-lock.json || true`, { cwd: PLUMBING_SOURCE, stdio: 'inherit' })
  cp.execSync(`yarn install --production --ignore-engines --non-interactive --network-concurrency 1`, { cwd: PLUMBING_SOURCE, stdio: 'inherit' })
  cp.execSync(`mkdir -p ${JSON.stringify(path.join(os.homedir(), '.haiku-distro-archives'))}`, { cwd: __dirname, stdio: 'inherit' })
  cp.execSync(`cd ${JSON.stringify(DISTRO_SOURCE)} && tar czf ${JSON.stringify(path.join(os.homedir(), '.haiku-distro-archives', Date.now() + '.tar.gz'))} . && cd ${JSON.stringify(__dirname)}`, { stdio: 'inherit' })
  // cp.execSync(`./node_modules/.bin/electron-rebuild --version 1.7.0 --module-dir ${JSON.stringify(PLUMBING_SOURCE)}`, { cwd: __dirname, stdio: 'inherit' })
  // uglifyDistroSourceLibs()
  // process.env.CSC_LINK=`file://${os.homedir()}/Certificates/DeveloperIdApplicationMatthewB73M94S23A.p12`
  // process.env.CSC_KEY_PASSWORD=fse.readFileSync(path.join(os.homedir(), '/Certificates/DeveloperIdApplicationMatthewB73M94S23A.p12.password')).toString().trim()
  // cp.execSync(`./node_modules/.bin/build --mac`, { cwd: __dirname })
  // cp.execSync('rm -rf /Applications/Haiku.app', { cwd: __dirname, stdio: 'inherit' })
  // cp.execSync(`cp -R ${JSON.stringify(path.join(__dirname, '/dist/mac/Haiku.app'))} /Applications`, { cwd: __dirname, stdio: 'inherit' })
  // require('./bins/cli-cloud-installer.js')
}

function getTupleString () {
  return `from ${inputs.branch} at ${inputs.version} as ${inputs.environment} ${(inputs.upload ? '' : ' (no upload)')}`
}

function getReleaseInfo () {
  return {
    branch: inputs.branch,
    version: inputs.version,
    environment: inputs.environment,
    started: moment().format('YYYYMMDDHHmmss'),
    uglified: inputs.uglify,
    uploaded: null,
    finished: null,
    success: null
  }
}

function prependReleaseToReleaseLog () {
  RELEASE_LOG.unshift(getReleaseInfo())
  fse.writeJsonSync(path.join(__dirname, 'releases.json'), RELEASE_LOG, { spaces: 2 })
}

function addInfoToMostRecentReleaseLogEntry (info) {
  lodash.assign(RELEASE_LOG[0], info)
  fse.writeJsonSync(path.join(__dirname, 'releases.json'), RELEASE_LOG, { spaces: 2 })
}

function uglifyDistroSourceLibs (cb) {
  // glob([
  //   'distro-source/plumbing/dev/*.js',
  //   'distro-source/plumbing/lib/**/*.js',
  //   'distro-source/plumbing/src/**/*.js',
  //   'distro-source/plumbing/test/**/*.js',
  //   'distro-source/plumbing/node_modules/haiku-bytecode/src/**/*.js',
  //   'distro-source/plumbing/node_modules/haiku-bytecode/test/**/*.js',
  //   'distro-source/plumbing/node_modules/haiku-cli/src/*.js',
  //   'distro-source/plumbing/node_modules/haiku-cli/lib/*.js',
  //   'distro-source/plumbing/node_modules/haiku-creator-electron/public/**/*.js',
  //   'distro-source/plumbing/node_modules/haiku-creator-electron/react/**/*.js',
  //   'distro-source/plumbing/node_modules/haiku-creator-electron/utils/**/*.js',
  //   'distro-source/plumbing/node_modules/haiku-glass/public/**/*.js',
  //   'distro-source/plumbing/node_modules/haiku-glass/react/**/*.js',
  //   'distro-source/plumbing/node_modules/haiku-glass/test/**/*.js',
  //   'distro-source/plumbing/node_modules/haiku-sdk/lib/**/*.js',
  //   'distro-source/plumbing/node_modules/haiku-sdk/src/**/*.js',
  //   'distro-source/plumbing/node_modules/haiku-sdk-client/lib/**/*.js',
  //   'distro-source/plumbing/node_modules/haiku-sdk-client/src/**/*.js',
  //   'distro-source/plumbing/node_modules/haiku-sdk-inkstone/lib/**/*.js',
  //   'distro-source/plumbing/node_modules/haiku-sdk-inkstone/src/**/*.js',
  //   'distro-source/plumbing/node_modules/haiku-serialization/src/**/*.js',
  //   'distro-source/plumbing/node_modules/haiku-serialization/test/**/*.js',
  //   'distro-source/plumbing/node_modules/haiku-state-object/*.js',
  //   'distro-source/plumbing/node_modules/haiku-state-object/lib/*.js',
  //   'distro-source/plumbing/node_modules/haiku-timeline/public/**/*.js',
  //   'distro-source/plumbing/node_modules/haiku-timeline/src/**/*.js',
  //   'distro-source/plumbing/node_modules/haiku-websockets/lib/*.js',
  //   'distro-source/plumbing/node_modules/haiku-websockets/src/*.js',
  //   'distro-source/plumbing/node_modules/haiku-websockets/test/*.js'
  // ], function (err, files) {
  //   return async.eachSeries(files, function (file, next) {
  //     console.log('uglifying', file, '...')
  //     var sourcepath = path.join(process.cwd(), file)
  //     var destpath = path.join(process.cwd(), file)
  //     try {
  //       var result = Uglify2.minify(sourcepath)
  //       var code = result.code
  //       return fs.outputFile(destpath, code, function (err) {
  //         if (err) return next(err)
  //         return next()
  //       })
  //     } catch (exception) {
  //       console.log('cannot uglify (' + exception.message + ')')
  //       return next()
  //     }
  //   }, function () {
  //     console.log('done uglifying')
  //   })
  // })
}

function runit () {
  writeHackyDynamicConfig()
  // prependReleaseToReleaseLog()
  buildStuff()

  // try {
  //   if (inputs.upload) {
  //     shout(`Distro upload started (${getTupleString()})`, () => {})

  //     // Reload the config with updated values to read from
  //     for (var key in require.cache) delete require.cache[key]
  //     require('./config.js')

  //     var environment = process.env.HAIKU_RELEASE_ENVIRONMENT
  //     var platform = process.env.HAIKU_RELEASE_PLATFORM
  //     var branch = process.env.HAIKU_RELEASE_BRANCH
  //     var version = process.env.HAIKU_RELEASE_VERSION
  //     var region = deploy.deployer[environment].region
  //     var objkey = deploy.deployer[environment].key
  //     var secret = deploy.deployer[environment].secret
  //     var bucket = deploy.deployer[environment].bucket

  //     return uploadRelease(region, objkey, secret, bucket, platform, environment, branch, version, (err, { environment, platform, branch, countdown, version }) => {
  //       if (err) throw err
  //       var url = `https://s3.amazonaws.com/${bucket}/releases/${environment}/${branch}/${platform}/${countdown}/${version}/Haiku-${version}-${platform}.zip`

  //       shout(`Distro upload finished (${getTupleString()}). Download: ${url}`, () => {})

  //       console.log('success! built and uploaded release')
  //       addInfoToMostRecentReleaseLogEntry({
  //         finished: moment().format('YYYYMMDDHHmmss'),
  //         uploaded: true,
  //         success: true
  //       })
  //     })
  //   }

  //   console.log('success! built release (but did not upload)')
  //   addInfoToMostRecentReleaseLogEntry({
  //     finished: moment().format('YYYYMMDDHHmmss'),
  //     uploaded: false,
  //     success: true
  //   })
  // } catch (exception) {
  //   console.log(exception)
  //   addInfoToMostRecentReleaseLogEntry({
  //     success: false,
  //     error: exception.message
  //   })
  // }
}
