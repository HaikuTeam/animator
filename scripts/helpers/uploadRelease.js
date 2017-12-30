const fs = require('fs');
const path = require('path');
const async = require('async');
const initializeAWSService = require('./initializeAwsService');
const uploadObjectToS3 = require('./uploadObjectToS3');

const ROOT = global.process.cwd();

function uploadRelease(region, key, secret, bucket, folder, platform, environment, branch, version, cb) {
  const s3 = initializeAWSService('S3', region, key, secret);

  const source = path.join(ROOT, 'dist');

  const countdown = `${10 ** 13 - Date.now()}`; // Reverse timestamp for ordering

  const target = path.join(folder, environment, branch, platform, countdown, version);
  const latest = path.join(folder, [environment, branch, platform].join('-'));

  return fs.readdir(source, (err, entries) => {
    if (err) return cb(err);

    const matches = entries.filter((entry) => entry.indexOf(version) !== -1 && path.extname(entry) === '.zip');

    if (matches.length < 1) {
      return cb(new Error(`Builds for ${platform}@${version} not found`));
    }

    return async.each(matches, (entry, next) => {
      const build = path.join(source, entry);
      let stream = fs.createReadStream(build);
      let entryKey = path.join(target, entry);

      // Upload with a 'pending' label so squirrel server knows not to include this in
      // the list of candidates. This gives us an opportunity to test before syndication.
      // The idea is that we manually remove the pending flag on S3 when we're ready.
      entryKey = entryKey.replace(/.zip$/, '-pending.zip');

      console.log(`Uploading ${build} as object ${entryKey} to bucket ${bucket}...`);

      return uploadObjectToS3(s3, entryKey, stream, bucket, 'public-read', (uploadErr) => {
        if (uploadErr) return next(uploadErr);

        // The 'latest' upload variant doesn't include the -pending label since it is
        // not used to determine syndication behavior on auto-update
        entryKey = [latest, `latest${path.extname(entry)}`].join('-');

        // Upload with a 'pending' label so squirrel server knows not to include this in
        // the list of candidates. This gives us an opportunity to test before syndication.
        // The idea is that we manually remove the pending flag on S3 when we're ready.
        entryKey = entryKey.replace(/.zip$/, '-pending.zip');

        stream = fs.createReadStream(build);

        console.log(`Uploading ${build} as object ${entryKey} to bucket ${bucket}...`);

        return uploadObjectToS3(s3, entryKey, stream, bucket, 'public-read', next);
      });
    }, (err) => {
      if (err) return cb(err);

      const urls = {
        download: `https://s3.amazonaws.com/${bucket}/${folder}/${environment}/${branch}/${platform}/${countdown}` +
        `/${version}/Haiku-${version}-${platform}-pending.zip`,
        latest: `https://s3.amazonaws.com/${bucket}/${folder}/${environment}-${branch}-${platform}-latest-pending.zip`,
      };

      return cb(null, {
        region,
        environment,
        branch,
        platform,
        countdown,
        version,
        urls,
      });
    });
  });
}

module.exports = uploadRelease;
