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
var Uglify2 = require('uglify-js')
var glob = require('glob-all')
var async = require('async')
var fs = require('fs-extra')
var log = require('./helpers/log')
var deploy = require('./deploy')
var uploadRelease = require('./helpers/uploadRelease')
var ROOT = path.join(__dirname, '..')

var ENVS = { test: true, development: true, staging: true, production: true }
var RELEASE_LOG = fse.readJsonSync(path.join(ROOT, 'releases.json'))
var DISTRO_SOURCE = path.join(ROOT, 'source')
var PLUMBING_SOURCE = path.join(DISTRO_SOURCE, 'plumbing')

var inputs = lodash.assign({}, argv)
delete inputs.$0
delete inputs._

if (!inputs.version) {
  inputs.version = fse.readJsonSync(path.join(ROOT, 'package.json')).version
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

  log.log(`using these inputs: ${JSON.stringify(inputs, null, 2)}`)
  inquirer.prompt([
    {
      type: 'confirm',
      name: 'proceed',
      message: 'Ok to proceed with distro?:',
      default: true
    }
  ]).then(function (answers) {
    if (answers.proceed) {
      log.log('ok, proceeding...')
      return runit()
    } else {
      log.log('bailing.')
      process.exit()
    }
  })
}).catch(function (exception) {
  log.log(exception)
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
      if (err) log.err(err)
      return cb()
    })
  }
  return cb()
}

function writeHackyDynamicConfig () {
  var src = fse.readFileSync(path.join(ROOT, '_config.js.handlebars')).toString()
  var tpl = hb.compile(src)
  var result = tpl(inputs)
  fse.writeFileSync(path.join(ROOT, 'config.js'), result)
}

function buildStuff () {
  cp.execSync(`rm -rf ${JSON.stringify(DISTRO_SOURCE)}`, { cwd: ROOT, stdio: 'inherit' })
  cp.execSync(`mkdir -p ${JSON.stringify(DISTRO_SOURCE)}`, { cwd: ROOT, stdio: 'inherit' })
  cp.execSync(`git clone git@github.com:HaikuTeam/plumbing.git`, { cwd: DISTRO_SOURCE, stdio: 'inherit' })
  cp.execSync(`rm yarn.lock || true`, { cwd: PLUMBING_SOURCE, stdio: 'inherit' })
  cp.execSync(`rm package-lock.json || true`, { cwd: PLUMBING_SOURCE, stdio: 'inherit' })
  cp.execSync(`yarn install --production --ignore-engines --non-interactive --mutex file:/tmp/.yarn-mutex`, { cwd: PLUMBING_SOURCE, stdio: 'inherit' })
  return uglifyDistroSourceLibs((err) => {
    if (err) throw err
    cp.execSync(`./node_modules/.bin/electron-rebuild --version 1.7.0 --module-dir ${JSON.stringify(PLUMBING_SOURCE)}`, { cwd: ROOT, stdio: 'inherit' })
    process.env.CSC_LINK = `file://${os.homedir()}/Secrets/DeveloperIdApplicationMatthewB73M94S23A.p12`
    process.env.CSC_KEY_PASSWORD = fse.readFileSync(path.join(os.homedir(), '/Secrets/DeveloperIdApplicationMatthewB73M94S23A.p12.password')).toString().trim()
    cp.execSync(`./node_modules/.bin/build --mac`, { cwd: ROOT, stdio: 'inherit' })
  })
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
  fse.writeJsonSync(path.join(ROOT, 'releases.json'), RELEASE_LOG, { spaces: 2 })
}

function addInfoToMostRecentReleaseLogEntry (info) {
  lodash.assign(RELEASE_LOG[0], info)
  fse.writeJsonSync(path.join(ROOT, 'releases.json'), RELEASE_LOG, { spaces: 2 })
}

function uglifyDistroSourceLibs (cb) {
  var globs = [/*TODO*/]
  if (globs.length < 1) return cb()
  return glob(globs, function (err, files) {
    if (err) return cb(err)
    return async.eachSeries(files, function (file, next) {
      log.log('uglifying', file, '...')
      var sourcepath = path.join(ROOT, file)
      var destpath = path.join(ROOT, file)
      try {
        var result = Uglify2.minify(sourcepath)
        var code = result.code
        return fs.outputFile(destpath, code, function (err) {
          if (err) return next(err)
          return next()
        })
      } catch (exception) {
        log.log('cannot uglify (' + exception.message + ')')
        return next()
      }
    }, function () {
      log.hat('done uglifying')
      return cb()
    })
  })
}

function uploadDistroApp () {
  shout(`Distro upload started (${getTupleString()})`, () => {})

  // Reload the config with updated values to read from
  for (var key in require.cache) delete require.cache[key]
  require('./config.js')

  var environment = process.env.HAIKU_RELEASE_ENVIRONMENT
  var platform = process.env.HAIKU_RELEASE_PLATFORM
  var branch = process.env.HAIKU_RELEASE_BRANCH
  var version = process.env.HAIKU_RELEASE_VERSION
  var region = deploy.deployer[environment].region
  var objkey = deploy.deployer[environment].key
  var secret = deploy.deployer[environment].secret
  var bucket = deploy.deployer[environment].bucket

  return uploadRelease(region, objkey, secret, bucket, platform, environment, branch, version, (err, { environment, platform, branch, countdown, version }) => {
    if (err) throw err

    var url = `https://s3.amazonaws.com/${bucket}/releases/${environment}/${branch}/${platform}/${countdown}/${version}/Haiku-${version}-${platform}.zip`
    shout(`Distro upload finished (${getTupleString()}). Download: ${url}`, () => {})

    log.hat('success! built and uploaded release\n' + url)
    addInfoToMostRecentReleaseLogEntry({
      finished: moment().format('YYYYMMDDHHmmss'),
      uploaded: true,
      success: true
    })
  })
}

function runit () {
  process.env.NODE_ENV = (inputs.environment === 'production')
    ? 'production'
    : 'development'

  writeHackyDynamicConfig()
  prependReleaseToReleaseLog()
  buildStuff()

  if (inputs.upload) {
    return uploadDistroApp()
  } else {
    log.hat('success! built release (but did not upload)')
    addInfoToMostRecentReleaseLogEntry({
      finished: moment().format('YYYYMMDDHHmmss'),
      uploaded: false,
      success: true
    })
  }
}
