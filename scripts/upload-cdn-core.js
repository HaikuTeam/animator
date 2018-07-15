const path = require('path');
const async = require('async');
const log = require('./helpers/log');
const uploadFileStream = require('./helpers/uploadFileStream');
const s3CopyObject = require('./helpers/s3CopyObject');
const nowVersion = require('./helpers/nowVersion');
const core = require('./helpers/packages')('@haiku/core');

const CORE_PATH = core.abspath;

// Note: These are hosted via the haiku-internal AWS account
// https://code.haiku.ai/scripts/core/HaikuCore.${vers}.js
// https://code.haiku.ai/scripts/core/HaikuCore.${vers}.min.js
//
// I was asking myself if we wanted to include a string like `staging` in these paths to differentiate
// builds we do from staging from prod, but my current thought is that that isn't necessary since
// the version we push will always be _ahead_ of the version userland is on, and someone would have
// to manually change the snippet to get an advance/untested version

log.log(`uploading cdn core ${nowVersion()}`);

// Note that the S3 object keys should NOT begin with a slash, or the S3 path will get weird

const bundles = [
  ['dom', 'HaikuCore'],
  ['vue-dom', 'HaikuVue'],
];

async.series([
  // Full bundles.
  ...bundles.map(([bundleType, name]) => (cb) => {
    log.log(`uploading core ${bundleType} bundle to code.haiku.ai`);
    const destinationKey = `scripts/core/${name}.${nowVersion()}.js`;
    return uploadFileStream(
      path.join(CORE_PATH, 'dist', `${bundleType}.bundle.js`),
      destinationKey,
      'us-east-1',
      'code.haiku.ai',
      'production',
      'code.haiku.ai',
      'public-read',
      (err) => {
        if (err) {
          throw err;
        }

        // Alias to ".latest.js" as well.
        s3CopyObject(
          destinationKey,
          `scripts/core/${name}.latest.js`,
          'us-east-1',
          'code.haiku.ai',
          'production',
          'code.haiku.ai',
          'public-read',
          cb,
        );
      },
    );
  }),

  // Minified bundles.
  ...bundles.map(([bundleType, name]) => (cb) => {
    log.log(`uploading core ${bundleType} minified bundle to code.haiku.ai`);
    const destinationKey = `scripts/core/${name}.${nowVersion()}.min.js`;
    return uploadFileStream(
      path.join(CORE_PATH, 'dist', `${bundleType}.bundle.min.js`),
      destinationKey,
      'us-east-1',
      'code.haiku.ai',
      'production',
      'code.haiku.ai',
      'public-read',
      (err) => {
        if (err) {
          throw err;
        }

        // Alias to ".latest.js" as well.
        s3CopyObject(
          destinationKey,
          `scripts/core/${name}.latest.min.js`,
          'us-east-1',
          'code.haiku.ai',
          'production',
          'code.haiku.ai',
          'public-read',
          cb,
        );
      },
    );
  }),
], (err) => {
  if (err) {
    throw err;
  }
  log.hat(`      our provided 3rd-party scripts:${bundles.map(([_, name]) => `
      https://code.haiku.ai/scripts/core/${name}.${nowVersion()}.js`).join('')}${bundles.map(([_, name]) => `
      https://code.haiku.ai/scripts/core/${name}.${nowVersion()}.min.js`).join('')}

      and for convenience:${bundles.map(([_, name]) => `
      https://code.haiku.ai/scripts/core/${name}.latest.js`).join('')}${bundles.map(([_, name]) => `
      https://code.haiku.ai/scripts/core/${name}.latest.min.js`).join('')}

      ^^ you probably need to invalidate cloudfront for the "latest" files to update ^^`);
  log.log('done uploading cdn core');
});
