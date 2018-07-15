const log = require('./helpers/log');
const slackShout = require('./helpers/slackShout');
const uploadRelease = require('./helpers/uploadRelease');
const forceNodeEnvProduction = require('./helpers/forceNodeEnvProduction');

const config = require('./../config');
forceNodeEnvProduction();

const deploy = require('./deploy');

let platform = process.env.HAIKU_RELEASE_PLATFORM;
let branch = process.env.HAIKU_RELEASE_BRANCH;
let version = process.env.HAIKU_RELEASE_VERSION;
let environment = process.env.HAIKU_RELEASE_ENVIRONMENT;

let region = deploy.deployer[environment].region;
let objkey = deploy.deployer[environment].key;
let secret = deploy.deployer[environment].secret;
let bucket = deploy.deployer[environment].bucket;

let RELEASES_FOLDER = 'releases';

uploadRelease(region, objkey, secret, bucket, RELEASES_FOLDER, platform, environment, branch, version, (err, {urls}) => {
  if (err) {
    throw err;
  }

  const slackMessage = `
Distro ready (${version} ${environment})
Patch link: ${urls.patch}
Download link: ${urls.download}
_Syndicate with :jenkins:._
  `.trim();

  slackShout({shout: config.shout}, slackMessage, () => {
    log.hat('success! built and uploaded \n' + urls.download + '\n' + urls.latest);
  });
});
