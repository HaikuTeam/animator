import * as tape from 'tape';
import * as async from 'async';
import * as fse from 'haiku-fs-extra';
import * as path from 'path';
import TestHelpers from '../TestHelpers';
import Master from '@plumbing/Master';
import {status} from '@plumbing/Git';
tape('git.status', (t) => {
  t.plan(7);
  TestHelpers.setup(function (folder, creator, glass, timeline, metadata, teardown) {
    const master = new Master(folder);
    return master.initializeFolder('boobar', 'matthew+2@haiku.ai', 'supersecure', {}, (err) => {
      t.error(err, 'no err initializing folder');
      return async.series([
        function (cb) {
          return status(folder, {}, (err, statuses) => {
            t.error(err, 'no statuses err');
            t.equal(Object.keys(statuses).length, 0, 'no statuses');
            return cb();
          });
        },
        function (cb) {
          fse.outputFileSync(path.join(folder, 'foo.txt'), `hello`);
          return status(folder, {}, (err, statuses) => {
            t.error(err, 'no statuses err');
            t.equal(statuses['foo.txt'].num, 7, 'file is untracked');
            return cb();
          });
        },
        function (cb) {
          fse.outputFileSync(path.join(folder, 'README.md'), `NEW README YAY`);
          return status(folder, {}, (err, statuses) => {
            t.error(err, 'no statuses err');
            t.equal(statuses['README.md'].num, 3, 'file is modified');
            return cb();
          });
        },
      ], (err) => {
        if (err) {
          throw err;
        }
        setTimeout(() => master.teardown(() => {

        }), 1000);
      });
    });
  });
});
