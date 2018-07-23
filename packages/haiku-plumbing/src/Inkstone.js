import * as lodash from 'lodash';
import {inkstone} from '@haiku/sdk-inkstone';
import * as logger from 'haiku-serialization/src/utils/LoggerInstance';
import * as Git from './Git';

if (process.env.SHARE_URL) {
  inkstone.setConfig({
    baseShareUrl: process.env.SHARE_URL,
  });
}

export function getCurrentShareInfo (folder, cache, extras, done) {
  Git.referenceNameToId(folder, 'HEAD', (gitErr, id) => {
    if (gitErr) {
      done(gitErr);
      return;
    }

    const sha = id.toString();

    logger.info('[inkstone] git HEAD resolved:', sha, 'getting snapshot...');

    return getSnapshotInfo(sha, (err, shareLink, snapshotAndProject) => {
      logger.info('[inkstone] snapshot info returned', err, shareLink);

      if (err) {
        logger.info('[inkstone] error getting snapshot info');
        return done(err);
      }

      const projectUid = snapshotAndProject.Project.UniqueId;
      const status = snapshotAndProject.Snapshot && {
        locked: snapshotAndProject.Snapshot.Locked,
        published: snapshotAndProject.Snapshot.Published,
        npmPublished: snapshotAndProject.Snapshot.NpmPublished,
        errored: snapshotAndProject.Snapshot.Errored,
        syndicated: snapshotAndProject.Snapshot.Syndicated,
      };

      const shareInfo = lodash.assign({sha, projectUid, shareLink, status}, extras);

      // Cache this during this session so we can avoid unnecessary handshakes with inkstone
      cache[sha] = shareInfo;

      logger.info('[inkstone] share info', shareInfo);

      return done(null, shareInfo);
    });
  });
}

function getSnapshotInfo (sha, done) {
  return inkstone.snapshot.getSnapshotLink(sha, (err, snapshot) => {
    if (err) {
      done(err);
      return;
    }

    const {link, snap} = snapshot;

    logger.info('[inkstone] share link received:', link);
    return done(null, link, snap);
  });
}
