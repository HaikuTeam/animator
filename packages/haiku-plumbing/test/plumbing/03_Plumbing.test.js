import * as tape from 'tape';
import * as async from 'async';
import * as cp from 'child_process';
import * as path from 'path';
import TestHelpers from '../TestHelpers';
import {stubProperties} from 'haiku-testing/lib/mock';

const DEF_SVG_1 = path.join(__dirname, '..', 'fixtures', 'files', 'designs', 'bef', 'Default.svg');
tape('Plumbing', (test) => {
  TestHelpers.setup((folder, creator, glass, timeline, teardown, plumbing) => {
    const projectName = 'UnitTestProj' + Date.now();
    const project = {
      projectPath: folder,
      authorName: 'jenkins@haiku.ai',
      organizationName: 'Jenkins',
      projectName,
      projectExistsLocally: true,
      repositoryUrl: '',
      forkComplete: false,
      isPublic: true,
      branchName: 'master',
    };
    return async.series([
      (cb) => {
        const [mockAuthenticate, unstub] = stubProperties(plumbing.envoyHandlers.user, 'authenticate');
        const identity = {
          organization: {Name: 'Jenkins'},
          user: {Username: 'jenkins@haiku.ai'},
        };
        mockAuthenticate.returns(new Promise((resolve) => resolve(identity)));
        plumbing.envoyHandlers.user.authenticate('jenkins@haiku.ai', 'supersecure').then((resultingIdentity) => {
          test.is(resultingIdentity, identity);
          unstub();
          cb();
        });
      },
      (cb) => plumbing.bootstrapProject({...project, skipContentCreation: true}, (err) => {
        if (err) {
          return cb(err);
        }

        test.error(err, 'no err initializing');
        test.equal(Object.keys(plumbing.masters).length, 1, 'only one master so far');
        test.equal(Object.keys(plumbing.masters)[0], folder, 'master has folder name');
        const gitloglines = cp.execSync('git log --pretty=oneline', {cwd: folder}).toString().split('\n');
        test.equal(gitloglines.length, 2, 'git log has two entries');
        return cb();
      }),
      (cb) => {
        return plumbing.startProject(project, (err) => {
          test.error(err, 'no err starting')
          const gitloglines = cp.execSync('git log --pretty=oneline', { cwd: folder }).toString().split('\n')
          test.equal(gitloglines.length, 2, 'still only two git commits so far')
          return cb()
        })
      },
      (cb) => {
        return plumbing.awaitMasterAndCallMethod(folder, 'setCurrentActiveComponent', ['main', {from: 'test'}], (err) => {
          test.error(err, 'no error setting ac');
          return setTimeout(cb, 1000);
        });
      },
      (cb) => {
        return plumbing.linkAsset(DEF_SVG_1, folder, (err, assets) => {
          test.error(err, 'no err linking asset');
          test.ok(assets, 'assets present');
          return cb();
        });
      },
      (cb) => {
        teardown(() => {
          test.end();
          cb();
        });
      },
    ]);
  });
});
