const log = require('./helpers/log');
const slackShout = require('./helpers/slackShout');
const uploadRelease = require('./helpers/uploadRelease');
const forceNodeEnvProduction = require('./helpers/forceNodeEnvProduction');

const config = require('./../config');

forceNodeEnvProduction();

const deploy = require('./deploy');

const platform = process.env.HAIKU_RELEASE_PLATFORM;
const branch = process.env.HAIKU_RELEASE_BRANCH;
const version = process.env.HAIKU_RELEASE_VERSION;
const environment = process.env.HAIKU_RELEASE_ENVIRONMENT;

const region = deploy.deployer[environment].region;
const objkey = deploy.deployer[environment].key;
const secret = deploy.deployer[environment].secret;
const bucket = deploy.deployer[environment].bucket;

const RELEASES_FOLDER = 'releases';

uploadRelease(region, objkey, secret, bucket, RELEASES_FOLDER, platform, environment, branch, version, (err, {environment, version, urls}) => {
  if (err) throw err;

  const slackMessage = `
Distro ready (${version} ${environment})
Download link: ${urls.download}
Latest link: ${urls.latest}
_To syndicate to users via auto-update, sign in to S3 and remove "-pending" from the file path (https://haiku-production.signin.aws.amazon.com/console)_
  `.trim();

  slackShout({shout: config.shout}, slackMessage, () => {
    log.hat(`success! built and uploaded \n${urls.download}\n${urls.latest}`);
  });
});
