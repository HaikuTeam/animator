/*
 * Proves that a lot of rapid commits don't cause a crash
 */
import * as tape from 'tape';
import * as async from 'async';
import * as fse from 'haiku-fs-extra';
import * as path from 'path';
import TestHelpers from '../TestHelpers';
import MasterGitProject from '@plumbing/MasterGitProject';

tape('other.02', (t) => {
  const changes = {};
  const change = (relpath) => {
    if (!changes[relpath]) {
      changes[relpath] = 0;
    }
    changes[relpath] += 1;
    return changes[relpath];
  };

  return TestHelpers.setup((folder, creator, glass, timeline, teardown) => {
    t.ok(true);
    fse.outputFileSync(path.join(folder, 'hello.txt'), `${change('hello.txt')}`);
    fse.outputFileSync(path.join(folder, 'goodbye.txt'), `${change('goodbye.txt')}`);
    fse.outputFileSync(path.join(folder, 'aloha.txt'), `${change('aloha.txt')}`);
    const mgp = new MasterGitProject(folder);
    mgp.restart({branchName: 'master'});
    return async.series([
      function (cb) {
        return mgp.commitProjectIfChanged('Initialized test folder', cb);
      },
      function (cb) {
        fse.outputFileSync(path.join(folder, 'hello.txt'), `${change('hello.txt')}`);
        fse.removeSync(path.join(folder, 'goodbye.txt'));
        fse.outputFileSync(path.join(folder, 'meow.txt'), `${change('meow.txt')}`);
        for (let i = 0; i < 100; i++) {
          (function (i) {
            setTimeout(() => {
              if (Math.random() > 0.75) {
                fse.outputFileSync(path.join(folder, 'hello.txt'), `${change('hello.txt')}`);
              }
            }, Math.random() * 10);
            setTimeout(() => {
              mgp.commitProjectIfChanged(`check${i}`, (err) => {
                if (err) {
                  throw err;
                }
              });
            }, Math.random() * 10);
          }(i));
        }
        setTimeout(cb, 5000);
      },
      function (cb) {
        mgp.teardown(cb);
      },
      function (cb) {
        teardown(cb);
      },

    ], (err) => {
      t.error(err, 'finished without error');
      t.end();
    });
  });
});
