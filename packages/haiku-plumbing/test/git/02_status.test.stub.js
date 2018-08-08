import * as tape from 'tape';
import * as async from 'async';
import * as fse from 'haiku-fs-extra';
import * as path from 'path';
import TestHelpers from '../TestHelpers';
import Master from '@plumbing/Master';
import {status} from '@plumbing/Git';
tape('git.status', (t) => {
  TestHelpers.setup(function (projectPath, creator, glass, timeline, teardown) {
    const master = new Master(projectPath);
    return master.initializeFolder({projectPath, projectName: 'boobar', authorName: 'bob@bob.com', branchName: 'master', repositoryUrl: ''}, (err) => {
      t.error(err, 'no err initializing folder');
      return async.series([
        function (cb) {
          return status(projectPath, {}, (err, statuses) => {
            t.error(err, 'no statuses err');
            t.equal(Object.keys(statuses).length, 0, 'no statuses');
            return cb();
          });
        },
        function (cb) {
          fse.outputFileSync(path.join(projectPath, 'foo.txt'), `hello`);
          return status(projectPath, {}, (err, statuses) => {
            t.error(err, 'no statuses err');
            t.equal(statuses['foo.txt'].num, 7, 'file is untracked');
            return cb();
          });
        },
        function (cb) {
          fse.outputFileSync(path.join(projectPath, 'README.md'), `NEW README YAY`);
          return status(projectPath, {}, (err, statuses) => {
            t.error(err, 'no statuses err');
            t.equal(statuses['README.md'].num, 3, 'file is modified');
            return cb();
          });
        },
      ], (err) => {
        if (err) {
          throw err;
        }
        master.teardown(() => {
          teardown();
          t.end();
        });
      });
    });
  });
});
