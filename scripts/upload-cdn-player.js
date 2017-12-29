const path = require('path');
const async = require('async');
const lodash = require('lodash');
const log = require('./helpers/log');
const uploadFileStream = require('./helpers/uploadFileStream');
const nowVersion = require('./helpers/nowVersion');
const allPackages = require('./helpers/packages')();

const groups = lodash.keyBy(allPackages, 'name');

const PLAYER_PATH = groups['@haiku/player'].abspath;

// Note: These are hosted via the haiku-internal AWS account
// https://code.haiku.ai/scripts/player/HaikuPlayer.${vers}.js
// https://code.haiku.ai/scripts/player/HaikuPlayer.${vers}.min.js
//
// I was asking myself if we wanted to include a string like `staging` in these paths to differentiate
// builds we do from staging from prod, but my current thought is that that isn't necessary since
// the version we push will always be _ahead_ of the version userland is on, and someone would have
// to manually change the snippet to get an advance/untested version

log.log(`uploading cdn player ${nowVersion()}`);

async.series([
  (cb) => {
    // Note that the object keys should NOT begin with a slash, or the S3 path will get weird
    log.log('uploading dom bundle to code.haiku.ai');
    return uploadFileStream(
      path.join(PLAYER_PATH, 'dist', 'dom.bundle.js'),
      `scripts/player/HaikuPlayer.${nowVersion()}.js`,
      'us-east-1',
      'code.haiku.ai',
      'production',
      'code.haiku.ai',
      'public-read',
      cb,
    );
  },

  (cb) => {
    log.log('uploading dom bundle to code.haiku.ai (as "latest")');
    return uploadFileStream(
      path.join(PLAYER_PATH, 'dist', 'dom.bundle.js'),
      'scripts/player/HaikuPlayer.latest.js',
      'us-east-1',
      'code.haiku.ai',
      'production',
      'code.haiku.ai',
      'public-read',
      cb,
    );
  },

  (cb) => {
    log.log('uploading dom bundle to code.haiku.ai (minified)');
    return uploadFileStream(
      path.join(PLAYER_PATH, 'dist', 'dom.bundle.min.js'),
      `scripts/player/HaikuPlayer.${nowVersion()}.min.js`,
      'us-east-1',
      'code.haiku.ai',
      'production',
      'code.haiku.ai',
      'public-read',
      cb,
    );
  },

  (cb) => {
    log.log('uploading dom bundle to code.haiku.ai (minified, as "latest")');
    return uploadFileStream(
      path.join(PLAYER_PATH, 'dist', 'dom.bundle.min.js'),
      'scripts/player/HaikuPlayer.latest.min.js',
      'us-east-1',
      'code.haiku.ai',
      'production',
      'code.haiku.ai',
      'public-read',
      cb,
    );
  },

  (cb) => {
    log.hat(`      our provided 3rd-party scripts:
      https://code.haiku.ai/scripts/player/HaikuPlayer.${nowVersion()}.js
      https://code.haiku.ai/scripts/player/HaikuPlayer.${nowVersion()}.min.js

      and for convenience:
      https://code.haiku.ai/scripts/player/HaikuPlayer.latest.js
      https://code.haiku.ai/scripts/player/HaikuPlayer.latest.min.js
      ^^ you probably need to invalidate cloudfront for the "latest" files to update ^^`);

    return cb();
  },
], (err) => {
  if (err) throw err;
  log.log('done uploading cdn player');
});
