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
    default: true
  },
  {
    type: 'confirm',
    name: 'shout',
    message: 'Notify our internal Slack account about build progress?:',
    default: true
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
  console.log(text + '\n')
  if (inputs.shout) {
    console.log('^^ sending slack message ^^')
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

var LIBS_DIR = path.join(__dirname, 'libs')
var PLAYER_SOURCE_DIR = path.join(__dirname, '..', 'packages', 'haiku-player')
var PLUMBING_SOURCE_DIR = path.join(__dirname, '..', 'packages', 'haiku-plumbing')
var PLUMBING_DEST_DIR = path.join(LIBS_DIR, 'plumbing')

function prepLibs() {
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

function runit () {
  var pkg = fse.readJsonSync(path.join(__dirname, 'package.json'))
  pkg.version = inputs.version
  fse.writeJsonSync(path.join(__dirname, 'package.json'), pkg, { spaces: 2 })

  var src = fse.readFileSync(path.join(__dirname, '_config.js.handlebars')).toString()
  var tpl = hb.compile(src)
  var result = tpl(inputs)
  fse.writeFileSync(path.join(__dirname, 'config.js'), result)

  var tuple = `from ${inputs.branch} at ${inputs.version} as ${inputs.environment} ${(inputs.upload ? '' : ' (no upload)')}`

  var releases = fse.readJsonSync(path.join(__dirname, 'releases.json'))
  var release = {
    branch: inputs.branch,
    version: inputs.version,
    environment: inputs.environment,
    started: moment().format('YYYYMMDDHHmmss'),
    uglified: inputs.uglify,
    uploaded: null,
    finished: null,
    success: null
  }
  releases.unshift(release)
  fse.writeJsonSync(path.join(__dirname, 'releases.json'), releases, { spaces: 2 })

  function done (info) {
    lodash.assign(release, info)
    fse.writeJsonSync(path.join(__dirname, 'releases.json'), releases, { spaces: 2 })
    console.log('done!')
  }

  shout(`Distro build started (${tuple})`, () => {
    try {
      prepLibs()

      buildStuff()

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

      // Push the build to the remote
      if (inputs.upload) {
        return uploadRelease(region, objkey, secret, bucket, platform, environment, branch, version, (err, { environment, platform, branch, countdown, version }) => {
          if (err) throw err
          var url = `https://s3.amazonaws.com/${bucket}/releases/${environment}/${branch}/${platform}/${countdown}/${version}/Haiku-${version}-${platform}.zip`
          done({
            finished: moment().format('YYYYMMDDHHmmss'),
            uploaded: true,
            success: true
          })
          shout(`Distro build finished (${tuple}). Download: ${url}`, () => {})
        })
      } else {
        return done({
          finished: moment().format('YYYYMMDDHHmmss'),
          uploaded: false,
          success: true
        })
      }
    } catch (exception) {
      console.log(exception)
      return done({
        success: false,
        error: exception.message
      })
    }
  })
}
