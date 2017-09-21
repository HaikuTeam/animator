var argv = require('yargs').argv
var cp = require('child_process')
var fse = require('fs-extra')
var path = require('path')
var lodash = require('lodash')
var hb = require('handlebars')
var slack = require('slack')
var moment = require('moment')
var inquirer = require('inquirer')
var deploy = require('./deploy')
var uploadRelease = require('./scripts/uploadRelease')

var ENVS = { test: true, development: true, staging: true, production: true }
var LIBS_DIR = path.join(__dirname, 'libs')
var PLUMBING_DEST_DIR = path.join(LIBS_DIR, 'plumbing')
var RELEASE_LOG = fse.readJsonSync(path.join(__dirname, 'releases.json'))

var inputs = lodash.assign({}, argv)
delete inputs.$0
delete inputs._

if (!inputs.version) {
  inputs.version = fse.readJsonSync(path.join(__dirname, '..', 'package.json')).version
}

inquirer.prompt([
  {
    type: 'input',
    name: 'version',
    message: `Semver tag to use for this release (required; should match mono's version):`,
    default: inputs.version
  },
  {
    type: 'input',
    name: 'branch',
    message: `Plumbing git branch to clone for source code (should probably be master, unless you've created a feature branch):`,
    default: inputs.branch || 'master'
  },
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

function prepLibs () {
  cp.execSync(`rm -rf ${LIBS_DIR}`, { stdio: 'inherit' })
  cp.execSync(`mkdir -p ${PLUMBING_DEST_DIR}`, { stdio: 'inherit' })
  cp.execSync(`git clone git@github.com:HaikuTeam/plumbing.git`, { stdio: 'inherit', cwd: LIBS_DIR })
  cp.execSync('yarn install --production=true', { stdio: 'inherit', cwd: PLUMBING_DEST_DIR }) // --production to avoid "bundle format is ambiguous"
  cp.execSync('yarn add gulp gulp-watch babel-cli', { stdio: 'inherit', cwd: PLUMBING_DEST_DIR })
}

function buildStuff () {
  cp.execSync(path.join(__dirname, 'scripts', 'bash', 'electron-rebuild.sh'), { stdio: 'inherit' })
  cp.execSync(path.join(__dirname, 'scripts', 'bash', 'compile.sh'), { stdio: 'inherit' })
  if (inputs.uglify) {
    cp.execSync(path.join(__dirname, 'scripts', 'node', 'uglify.js'), { stdio: 'inherit', cwd: __dirname })
  }
  cp.execSync(path.join(__dirname, 'scripts', 'bash', 'build.sh'), { stdio: 'inherit' })
  cp.execSync(path.join(__dirname, 'local-install.sh'), { stdio: 'inherit' })
}

function updateOwnVersion () {
  var pkg = fse.readJsonSync(path.join(__dirname, 'package.json'))
  pkg.version = inputs.version
  fse.writeJsonSync(path.join(__dirname, 'package.json'), pkg, { spaces: 2 })
}

function writeHackyDynamicConfig () {
  var src = fse.readFileSync(path.join(__dirname, '_config.js.handlebars')).toString()
  var tpl = hb.compile(src)
  var result = tpl(inputs)
  fse.writeFileSync(path.join(__dirname, 'config.js'), result)
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

function runit () {
  updateOwnVersion()
  writeHackyDynamicConfig()
  prependReleaseToReleaseLog()
  prepLibs()
  buildStuff()

  try {
    if (inputs.upload) {
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

        console.log('success! built and uploaded release')
        addInfoToMostRecentReleaseLogEntry({
          finished: moment().format('YYYYMMDDHHmmss'),
          uploaded: true,
          success: true
        })
      })
    }

    console.log('success! built release (but did not upload)')
    addInfoToMostRecentReleaseLogEntry({
      finished: moment().format('YYYYMMDDHHmmss'),
      uploaded: false,
      success: true
    })
  } catch (exception) {
    console.log(exception)
    addInfoToMostRecentReleaseLogEntry({
      success: false,
      error: exception.message
    })
  }
}
