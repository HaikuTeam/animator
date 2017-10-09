var deploy = require('./deploy')
var log = require('./helpers/log')
var slackShout = require('./helpers/slackShout')
var uploadRelease = require('./helpers/uploadRelease')

var config = require('./../config.js')

var platform = process.env.HAIKU_RELEASE_PLATFORM
var branch = process.env.HAIKU_RELEASE_BRANCH
var version = process.env.HAIKU_RELEASE_VERSION
var environment = process.env.HAIKU_RELEASE_ENVIRONMENT

var region = deploy.deployer[environment].region
var objkey = deploy.deployer[environment].key
var secret = deploy.deployer[environment].secret
var bucket = deploy.deployer[environment].bucket

uploadRelease(region, objkey, secret, bucket, platform, environment, branch, version, (err, { environment, platform, branch, countdown, version }) => {
  if (err) throw err

  var url = `https://s3.amazonaws.com/${bucket}/releases/${environment}/${branch}/${platform}/${countdown}/${version}/Haiku-${version}-${platform}.zip`

  slackShout({ shout: config.shout }, `Distro ready (${version} ${environment}) ${url}`, () => {
    log.hat('success! built and uploaded release\n' + url)
  })
})
