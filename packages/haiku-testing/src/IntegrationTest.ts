import {assign} from 'lodash';
import * as fsExtra from 'fs-extra';
import * as os from 'os';
import * as async from 'async';
import * as path from 'path';
import functionToRFO from '@haiku/core/lib/reflection/functionToRFO';
import haikuInfo from '../../../packages/haiku-plumbing/lib/haikuInfo';
import Plumbing from '../../../packages/haiku-plumbing/lib/Plumbing';

process.env.HAIKU_SKIP_AUTOUPDATE = '1'; // Skip autoupdate
process.env.DEV = '1'; // Force dev tools open

// This account is only used for testing; feel free to create/edit/delete projects at will
const DEFAULT_USERNAME = 'matthew+0@haiku.ai';
const DEFAULT_PASSWORD = 'supersecure';
const DEFAULT_PROJECT = 'e2etest';
const DEFAULT_DATA = {
  username: DEFAULT_USERNAME,
  password: DEFAULT_PASSWORD,
  project: DEFAULT_PROJECT,
};

const SEC = 1000;
const UPDATE_TIMEOUT = 5 * SEC;

const functionToSerializeAndExecuteInTargetProcess = (fn: Function): Function => {
  return fn;
};

/**
 * @class IntegrationTest
 * @description
 *   Harness for running a full-app integration test.
 *   An integration test will start the full app.
 *   After that, it's up to you to write the test logic.
 * @example
 *   const it = new IntegrationTest();
 *   it.setup(() => {
 *     it.execInGlass({some: 'data'}, (data, cb) => {
 *       // logic to run in the glass window
 *       cb();
 *     }, () => {
 *       it.teardown(() => {
 *         // finalize the test
 *       });
 *     });
 *   });
 */
export default class IntegrationTest {
  config;
  plumbing: Plumbing;
  steps: Function[];
  data: any;
  worker: Function;

  constructor(config: any = {}) {
    // Note: If the folder argument is empty, Haiku will start in normal mode
    this.config = assign({}, haikuInfo, config, {mode: 'creator'});
    this.plumbing = new Plumbing();
  }

  deleteProjectViaDashboardUI(data: any, done: Function) {
    this.execInCreator(data, functionToSerializeAndExecuteInTargetProcess((data, cb) => {
      // Find the project of the given name in the browser's projects list
      let indexOfProject = null;

      const projectsList = window['creator'].refs.ProjectBrowser.state.projectsList || [];

      for (let i = 0; i < projectsList.length; i++) {
        if (projectsList[i].projectName === data.project) {
          indexOfProject = i;
          break;
        }
      }

      // No matching project found; early return
      if (indexOfProject === null) {
        return cb();
      }

      // Delete the project from the list, typing in its name to confirm
      window['creator'].refs.ProjectBrowser.showDeleteModal(data.project);

      setTimeout(() => {
        window['creator'].refs.ProjectBrowser.handleDeleteInputChange({target: {value: data.project}});

        setTimeout(() => {
          window['creator'].refs.ProjectBrowser.handleDeleteInputKeyDown({keyCode: 13});

          cb();
        }, 1000);
      }, 1000);
    }), () => {
      setTimeout(done, 5000);
    });
  }

  logoutViaDashboardUI(data: any, done: Function) {
    this.execInCreator(data, functionToSerializeAndExecuteInTargetProcess((data, cb) => {
      document.getElementById('haiku-button-show-account-popover').click();

      setTimeout(() => {
        document.getElementById('haiku-button-logout').click();
        cb();
      }, 1000);
    }), () => {
      setTimeout(done, 5000);
    });
  }

  loginViaAuthUI(data: any, done: Function) {
    this.execInCreator(data, functionToSerializeAndExecuteInTargetProcess((data: any, cb) => {
      window['creator'].refs.AuthenticationUI.setState(
        {username: data.username, password: data.password},
        () => {
          document.getElementById('haiku-button-login').click();
          cb();
        },
      );
    }), () => {
      setTimeout(done, 5000);
    });
  }

  goToDashboardViaEditorUI(data: any, done: Function) {
    this.execInCreator(data, functionToSerializeAndExecuteInTargetProcess((data, cb) => {
      document.getElementById('go-to-dashboard').click();
      cb();
    }), () => {
      setTimeout(done, 5000);
    });
  }

  createProjectViaDashboardUI(data: any, done: Function) {
    this.execInCreator(data, functionToSerializeAndExecuteInTargetProcess((data, cb) => {
      document.getElementById('haiku-button-show-new-project-modal').click();

      setTimeout(() => {
        window['creator'].refs.NewProjectModal.handleNewProjectInputChange({target: {value: data.project}});

        setTimeout(() => {
          window['creator'].refs.NewProjectModal.handleNewProjectInputKeyDown({keyCode: 13});

          cb();
        }, 1000);
      }, 1000);
    }), (err, out) => {
      setTimeout(done, 20000);
    });
  }

  initializeDefaultProjectWithDefaultAccount(done: Function) {
    async.series([
      (cb) => {
        this.loginViaAuthUI(DEFAULT_DATA, cb);
      },

      (cb) => {
        this.deleteProjectViaDashboardUI(DEFAULT_DATA, cb);
      },

      (cb) => {
        this.createProjectViaDashboardUI(DEFAULT_DATA, cb);
      },
    ], (err, out) => {
      done(err, out);
    });
  }

  teardownDefaultProjectWithDefaultAccount(done: Function) {
    async.series([
      (cb) => {
        this.goToDashboardViaEditorUI({}, cb);
      },

      (cb) => {
        this.deleteProjectViaDashboardUI(DEFAULT_DATA, cb);
      },

      (cb) => {
        this.logoutViaDashboardUI({}, cb);
      },
    ], (err, out) => {
      done(err, out);
    });
  }

  /**
   * @description Force logout by clearing the on-disk auth token.
   */
  forceLogoutViaFileSystem (cb: Function) {
    const token = path.join(os.homedir(), '.haiku', 'auth');
    fsExtra.removeSync(token);
    cb();
  }

  /**
   * @description Execute `fn` inside all processes, passing it the given `data`.
   */
  execInAllProcesses(data: any, fn: Function, cb: Function) {
    this.exec(['creator', 'glass', 'timeline', 'plumbing'], data, fn, (err, out) => {
      cb(err, out);
    });
  }

  /**
   * @description Execute `fn` inside creator, passing it the given `data`.
   */
  execInCreator(data: any, fn: Function, cb: Function) {
    this.exec(['creator'], data, fn, (err, out) => {
      cb(err, out);
    });
  }

  /**
   * @description Execute `fn` inside glass, passing it the given `data`.
   */
  execInGlass(data: any, fn: Function, cb: Function) {
    this.exec(['glass'], data, fn, (err, out) => {
      cb(err, out);
    });
  }

  /**
   * @description Execute `fn` inside timeline, passing it the given `data`.
   */
  execInTimeline(data: any, fn: Function, cb: Function) {
    this.exec(['timeline'], data, fn, (err, out) => {
      cb(err, out);
    });
  }

  /**
   * @description Execute `fn` inside plumbing, passing it the given `data`.
   */
  execInPlumbing(data: any, fn: Function, cb: Function) {
    this.exec(['plumbing'], data, fn, (err, out) => {
      cb(err, out);
    });
  }

  /**
   * @description In all listed views, execute the given function
   */
  exec(views: string[], data: any, fn: Function, cb: Function) {
    this.plumbing.executeFunction(
      views,
      assign({}, this.config, data),
      fn,
      cb,
    );
  }

  /**
   * @description Setup a fresh instance of the app.
   */
  setup(done: Function) {
    async.series([
      (cb) => {
        return this.forceLogoutViaFileSystem(cb);
      },

      (cb) => {
        this.plumbing.launch(this.config, (err) => {
          if (err) {
            return cb(err);
          }

          cb();
        });
      },
    ], (err) => {
      if (err) {
        return done(err);
      }

      setTimeout(done, 10000);
    });
  }

  /**
   * @description Teardown the test
   */
  teardown (cb: Function) {
    this.plumbing.teardown(() => {
      cb();  
    });
  }
}
