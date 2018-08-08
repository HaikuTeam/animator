/**
 * Proves that a bunch of rapid project initializations don't cause a crash
 */
import * as tape from 'tape';
import * as async from 'async';
import * as fse from 'haiku-fs-extra';
import * as path from 'path';
import * as os from 'os';
import TestHelpers from '../TestHelpers';
import {stubProperties} from 'haiku-testing/lib/mock';

tape('other.01', (test) => {
  const projectName = 'UnitTestProj' + Date.now();
  const project = {
    projectPath: path.join(os.homedir(), '.haiku', 'projects', 'Jenkins', projectName),
    authorName: 'jenkins@haiku.ai',
    organizationName: 'Jenkins',
    projectName,
    projectExistsLocally: false,
    repositoryUrl: '',
    forkComplete: false,
    isPublic: true,
    branchName: 'master',
  };
  TestHelpers.launch((plumbing, teardownMaster, teardown) => {
    return async.series([
      (cb) => {
        const [mockAuthenticate, unstub] = stubProperties(plumbing.envoyHandlers.user, 'authenticate');
        const identity = {
          organization: {
            Name: 'Jenkins',
            Role: 0,
            P0: 1,
            P1: false,
          },
          user: {
            Username: 'jenkins@haiku.ai',
            IsAdmin: false,
          },
          lastOnline: Date.now(),
        };
        mockAuthenticate.returns(new Promise((resolve) => resolve(identity)));
        plumbing.envoyHandlers.user.authenticate('jenkins@haiku.ai', 'supersecure').then((resultingIdentity) => {
          test.is(resultingIdentity, identity);
          unstub();
          cb();
        });
      },

      // Initially create the project.
      (cb) => {
        const [mockCreateProject, unstub] = stubProperties(plumbing.envoyHandlers.project, 'createProject');
        mockCreateProject.returns(new Promise((resolve) => resolve(project)));
        plumbing.envoyHandlers.project.createProject(projectName).then((haikuProject) => {
          test.is(haikuProject, project);
          unstub();
          cb();
        });
      },

      (cb) => plumbing.bootstrapProject({...project, skipContentCreation: true}, (err) => {
        if (err) {
          return cb(err);
        }
        return plumbing.startProject(project, cb);
      }),

      // Add some content
      (cb) => {
        fse.outputFileSync(path.join(project.projectPath, 'Uno.txt'), '1');
        fse.outputFileSync(path.join(project.projectPath, 'Dos.txt'), '2');
        fse.outputFileSync(path.join(project.projectPath, 'Tres.txt'), '3');
        fse.outputFileSync(path.join(project.projectPath, 'Quatro.txt'), '4');
        fse.outputFileSync(path.join(project.projectPath, 'Cinco.txt'), '5');
        return cb();
      },

      // Now reinitialize a bunch of times,
      // as though we had gone back and forth
      // between the dash and editor
      (cb) => teardownMaster(project.projectPath, cb),

      (cb) => plumbing.bootstrapProject({...project, skipContentCreation: true}, (err) => {
        if (err) {
          return cb(err);
        }
        return plumbing.startProject(project, cb);
      }),

      (cb) => teardownMaster(project.projectPath, cb),

      (cb) => plumbing.bootstrapProject({...project, skipContentCreation: true}, (err) => {
        if (err) {
          return cb(err);
        }
        return plumbing.startProject(project, cb);
      }),

      // Update some content
      (cb) => {
        fse.outputFileSync(path.join(project.projectPath, 'Uno.txt'), '11');
        fse.outputFileSync(path.join(project.projectPath, 'Dos.txt'), '22');
        fse.outputFileSync(path.join(project.projectPath, 'Tres.txt'), '33');
        fse.outputFileSync(path.join(project.projectPath, 'Quatro.txt'), '44');
        fse.outputFileSync(path.join(project.projectPath, 'Cinco.txt'), '55');
        return cb();
      },

      (cb) => teardownMaster(project.projectPath, cb),

      (cb) => plumbing.bootstrapProject({...project, skipContentCreation: true}, (err) => {
        if (err) {
          return cb(err);
        }
        return plumbing.startProject(project, cb);
      }),

      (cb) => teardownMaster(project.projectPath, cb),

      (cb) => plumbing.bootstrapProject({...project, skipContentCreation: true}, (err) => {
        if (err) {
          return cb(err);
        }
        return plumbing.startProject(project, cb);
      }),

      // Update some content
      (cb) => {
        fse.outputFileSync(path.join(project.projectPath, 'Uno.txt'), '111');
        fse.outputFileSync(path.join(project.projectPath, 'Dos.txt'), '222');
        fse.outputFileSync(path.join(project.projectPath, 'Tres.txt'), '333');
        fse.outputFileSync(path.join(project.projectPath, 'Quatro.txt'), '444');
        fse.outputFileSync(path.join(project.projectPath, 'Cinco.txt'), '555');
        return cb();
      },

      (cb) => teardownMaster(project.projectPath, cb),

      (cb) => plumbing.bootstrapProject({...project, skipContentCreation: true}, (err) => {
        if (err) {
          return cb(err);
        }
        return plumbing.startProject(project, cb);
      }),

      // Update some content
      (cb) => {
        fse.outputFileSync(path.join(project.projectPath, 'Uno.txt'), '1111');
        fse.outputFileSync(path.join(project.projectPath, 'Dos.txt'), '2222');
        fse.outputFileSync(path.join(project.projectPath, 'Tres.txt'), '3333');
        fse.outputFileSync(path.join(project.projectPath, 'Quatro.txt'), '4444');
        fse.outputFileSync(path.join(project.projectPath, 'Cinco.txt'), '5555');
        return cb();
      },

      (cb) => plumbing.bootstrapProject({...project, skipContentCreation: true}, (err) => {
        if (err) {
          return cb(err);
        }
        return plumbing.startProject(project, cb);
      }),

      (cb) => teardownMaster(project.projectPath, cb),

      (cb) => plumbing.bootstrapProject({...project, skipContentCreation: true}, (err) => {
        if (err) {
          return cb(err);
        }
        return plumbing.startProject(project, cb);
      }),

      (cb) => teardownMaster(project.projectPath, cb),

      (cb) => plumbing.bootstrapProject({...project, skipContentCreation: true}, (err) => {
        if (err) {
          return cb(err);
        }
        return plumbing.startProject(project, cb);
      }),

      (cb) => teardownMaster(project.projectPath, cb),

      (cb) => plumbing.bootstrapProject({...project, skipContentCreation: true}, (err) => {
        if (err) {
          return cb(err);
        }
        return plumbing.startProject(project, cb);
      }),

      // Update some content
      (cb) => {
        fse.outputFileSync(path.join(project.projectPath, 'Uno.txt'), '11111');
        fse.outputFileSync(path.join(project.projectPath, 'Dos.txt'), '22222');
        fse.outputFileSync(path.join(project.projectPath, 'Tres.txt'), '33333');
        fse.outputFileSync(path.join(project.projectPath, 'Quatro.txt'), '44444');
        fse.outputFileSync(path.join(project.projectPath, 'Cinco.txt'), '55555');
        return cb();
      },

      (cb) => teardownMaster(project.projectPath, cb),

      (cb) => plumbing.bootstrapProject({...project, skipContentCreation: true}, (err) => {
        if (err) {
          return cb(err);
        }
        return plumbing.startProject(project, cb);
      }),

      (cb) => teardownMaster(project.projectPath, cb),

      (cb) => {
        fse.removeSync(project.projectPath);
        cb();
      },
    ], (err) => {
      if (err) {
        throw err;
      }
      test.end();
    });
  });
});
