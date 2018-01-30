var log = require('./helpers/log')
var slackShout = require('./helpers/slackShout')
var uploadRelease = require('./helpers/uploadRelease')
var forceNodeEnvProduction = require('./helpers/forceNodeEnvProduction')

var config = require('./../config')
forceNodeEnvProduction()

var deploy = require('./deploy')

var platform = process.env.HAIKU_RELEASE_PLATFORM
var branch = process.env.HAIKU_RELEASE_BRANCH
var version = process.env.HAIKU_RELEASE_VERSION
var environment = process.env.HAIKU_RELEASE_ENVIRONMENT

var region = deploy.deployer[environment].region
var objkey = deploy.deployer[environment].key
var secret = deploy.deployer[environment].secret
var bucket = deploy.deployer[environment].bucket

var RELEASES_FOLDER = 'releases'

uploadRelease(region, objkey, secret, bucket, RELEASES_FOLDER, platform, environment, branch, version, (err, { environment, version, urls }) => {
  if (err) throw err

  var slackMessage = `
Distro ready (${version} ${environment})
Download link: ${urls.download}
_Syndicate with :jenkins:._
  `.trim()

  slackShout({ shout: config.shout }, slackMessage, () => {
    log.hat('success! built and uploaded \n' + urls.download + '\n' + urls.latest)
  })
})
