import * as path from 'path';
import * as Websocket from 'ws';
import * as tmp from 'tmp';
import * as fse from 'haiku-fs-extra';
import * as randomAlphabetical from 'haiku-serialization/src/utils/randomAlphabetical';
import Plumbing, {HAIKU_WS_SECURITY_TOKEN} from '@plumbing/Plumbing';
import {getCurrentOrganizationName} from '@plumbing/project-folder/getCurrentOrganizationName';


function websocket (host, port, folder, alias, type) {
  const websocket = new Websocket(
    `ws://${host}:${port}/?folder=${folder}&alias=${alias}&type=${type}&token=${HAIKU_WS_SECURITY_TOKEN}`);
  const requests = {};
  websocket.message = function (message) {
    const data = JSON.stringify(message);
    websocket.send(data);
  };
  websocket.request = function (method, params, cb, type) {
    const id = Math.random() + '';
    const message = {id, method, params, type};
    requests[id] = cb;
    return websocket.message(message);
  };
  websocket.action = function (method, params, cb) {
    return websocket.request(method, params, cb, 'action');
  };
  websocket.on('message', (resp) => {
    const reply = JSON.parse(resp);
    const cb = requests[reply.id];
    if (cb) {
      return cb(reply.error, reply.result);
    }
    return websocket.emit('meow', reply);
  });
  return websocket;
}

function before (cb) {
  process.env.HAIKU_SKIP_NPM_INSTALL = '1';
  // process.env.HAIKU_SKIP_NPM_LINK = '1' // enabled so that @haiku/core exists in component code.js
  return setTimeout(cb, 2500); // HACK: always wait for teardown of previous test #RC-test
}

function launch (ready) {
  return before(() => {
    return plumb((plumbing) => {
      function teardown (cb) {
        if (global.haiku && global.haiku.HaikuGlobalAnimationHarness) {
          global.haiku.HaikuGlobalAnimationHarness.cancel();
        }
        plumbing.teardown(cb);
      }

      function teardownMaster (folder, cb) {
        plumbing.teardownMaster(folder, cb);
      }

      return ready(plumbing, teardownMaster, teardown);
    });
  });
}

function plumb (cb) {
  const plumbing = new Plumbing();
  return plumbing.launch({mode: 'headless'}, (err, host, port, server, spawned, envoy) => {
    if (err) {
      throw err;
    }
    process.env.HAIKU_PLUMBING_HOST = host;
    process.env.HAIKU_PLUMBING_PORT = port;
    process.env.ENVOY_HOST = envoy.host;
    process.env.ENVOY_PORT = envoy.port;
    return cb(plumbing, host, port, envoy);
  });
}

function setup (ready) {
  return before(() => {
    return tmpdir((folder, cleanup) => {
      process.env.HAIKU_PROJECT_FOLDER = folder;
      return plumb((plumbing, host, port, envoy) => {
        const creator = websocket(host, port, folder, 'creator', 'commander');
        const glass = websocket(host, port, folder, 'glass', 'controllee');
        const timeline = websocket(host, port, folder, 'timeline', 'controllee');
        glass.on('meow', (message) => {
          if (message.type !== 'broadcast') {
            return glass.message(message);
          }
        }); // Auto-respond as mock
        timeline.on('meow', (message) => {
          if (message.type !== 'broadcast') {
            return timeline.message(message);
          }
        }); // Auto-respond as mock
        creator.on('meow', (message) => {
          if (message.type !== 'broadcast') {
            return creator.message(message);
          }
        }); // Auto-respond as mock
        function teardown (cb) {
          cleanup();
          if (global.haiku && global.haiku.HaikuGlobalAnimationHarness) {
            global.haiku.HaikuGlobalAnimationHarness.cancel();
          }
          plumbing.teardown(cb);
        }
        creator.on('open', () => {
          getCurrentOrganizationName((err, organizationName) => {
            if (err) {
              throw err;
            }
            const metadata = {
              organizationName,
            };
            return ready(folder, creator, glass, timeline, metadata, teardown, plumbing);
          });
        });
      });
    });
  });
}

function tmpdir (cb) {
  return tmp.dir({unsafeCleanup: true}, function (err, dir, cleanup) {
    if (err) {
      throw err;
    }
    const folder = path.join(dir, randomAlphabetical());
    fse.mkdirpSync(folder);
    console.log('[test] created temp folder', folder);
    return cb(folder, cleanup);
  });
}

const gitcfg = {
  repoGitUrl: 'https://github.com/HaikuTeam/git-testing.git',
  testUsername: 'haiku-test-user',
  testPassword: 'Snappy#-Citizen156!)',
  testEmail: 'matthew+github-haiku-test-user@haiku.ai',
};

export default {
  tmpdir,
  gitcfg,
  setup,
  launch,
};
