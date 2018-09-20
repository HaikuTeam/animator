/* tslint:disable:no-parameter-reassignment no-shadowed-variable max-line-length */
import * as path from 'path';
import * as async from 'async';
import * as lodash from 'lodash';
import * as find from 'lodash.find';
import * as merge from 'lodash.merge';
import * as filter from 'lodash.filter';
import * as get from 'lodash.get';
import * as set from 'lodash.set';
import * as net from 'net';
import * as qs from 'qs';
import * as WebSocket from 'ws';
import {EventEmitter} from 'events';
import EnvoyServer from 'haiku-sdk-creator/lib/envoy/EnvoyServer';
import EnvoyLogger from 'haiku-sdk-creator/lib/envoy/EnvoyLogger';
import {EXPORTER_CHANNEL, ExporterHandler} from 'haiku-sdk-creator/lib/exporter';
import {USER_CHANNEL, UserHandler} from 'haiku-sdk-creator/lib/bll/User';
import {PROJECT_CHANNEL, ProjectHandler} from 'haiku-sdk-creator/lib/bll/Project';
import {GLASS_CHANNEL, GlassHandler} from 'haiku-sdk-creator/lib/glass';
import {TIMELINE_CHANNEL, TimelineHandler} from 'haiku-sdk-creator/lib/timeline';
import {TOUR_CHANNEL, TourHandler} from 'haiku-sdk-creator/lib/tour';
import {SERVICES_CHANNEL, ServicesHandler} from 'haiku-sdk-creator/lib/services';
import {inkstone} from '@haiku/sdk-inkstone';
import {client as sdkClient, FILE_PATHS} from '@haiku/sdk-client';
import * as serializeError from 'haiku-serialization/src/utils/serializeError';
import * as logger from 'haiku-serialization/src/utils/LoggerInstance';
import * as mixpanel from 'haiku-serialization/src/utils/Mixpanel';
import {crashReport} from 'haiku-serialization/src/utils/carbonite';
import * as BaseModel from 'haiku-serialization/src/bll/BaseModel';
import {awaitAllLocksFree} from 'haiku-serialization/src/bll/Lock';
import functionToRFO from '@haiku/core/lib/reflection/functionToRFO';
import Master from './Master';
import {createProjectFiles} from '@haiku/sdk-client/lib/createProjectFiles';
import {
  copyDefaultSketchFile,
  copyDefaultIllustratorFile,
} from './project-folder/copyExternalExampleFilesToProject';
import {duplicateProject} from './project-folder/duplicateProject';
import {
  storeConfigValues,
} from './project-folder/ProjectDefinitions';

global.eval = () => {
  // noop: eval is forbidden
};

// Useful debugging originator of calls in shared model code
process.env.HAIKU_SUBPROCESS = 'plumbing';

Error.stackTraceLimit = Infinity; // Show long stack traces when errors are shown

import Raven from './Raven';

// Don't allow malicious websites to connect to our websocket server (Plumbing or Envoy)
export const HAIKU_WS_SECURITY_TOKEN = Math.random().toString(36).substring(7) + Math.random().toString(36).substring(7);
const WS_POLICY_VIOLATION_CODE = 1008;

// For any methods that are...
// - noisy
// - internal use only
// - housekeeping
// we'll skip Sentry for now.
const METHODS_TO_SKIP_IN_SENTRY = {
  setTimelineTime: true,
  masterHeartbeat: true,
};

const IGNORED_METHOD_MESSAGES = {
  setTimelineTime: true,
  masterHeartbeat: true,
};

// See note under 'processMethodMessage' for the purpose of this
const METHOD_MESSAGES_TO_HANDLE_IMMEDIATELY = {
  setTimelineTime: true,
  masterHeartbeat: true,
  openTextEditor: true,
  openTerminal: true,
  saveProject: true,
  previewProject: true,
  teardownMaster: true,
  hoverElement: true,
  unhoverElement: true,
};

const Q_GLASS = {alias: 'glass'};
const Q_TIMELINE = {alias: 'timeline'};
const Q_CREATOR = {alias: 'creator'};
const Q_MASTER = {alias: 'master'};

const AWAIT_INTERVAL = 100;

const HAIKU_DEFAULTS = {
  socket: {
    port: process.env.HAIKU_PLUMBING_PORT,
    host: process.env.HAIKU_PLUMBING_HOST || '0.0.0.0',
  },
};

const emitter = new EventEmitter();

const PINFO = `${process.pid} ${path.basename(__filename)} ${path.basename(process.execPath)}`;

const PLUMBING_INSTANCES = [];

const FALLBACK_SEMVER_VERSION = '0.0.0';

const teardownPlumbings = (cb) => {
  return async.each(PLUMBING_INSTANCES, (plumbing, next) => {
    return plumbing.teardown(next);
  }, cb);
};

// In test environment these listeners may get wrapped so we begin listening
// to them immediately in the hope that we can start listening before the
// test wrapper steps in and interferes
process.on('exit', () => {
  logger.info(`[plumbing] plumbing process (${PINFO}) exiting`);
  teardownPlumbings(() => {

  });
});
process.on('SIGINT', () => {
  logger.info(`[plumbing] plumbing process (${PINFO}) SIGINT`);
  teardownPlumbings(() => {
    process.exit();
  });
});
process.on('SIGTERM', () => {
  logger.info(`[plumbing] plumbing process (${PINFO}) SIGTERM`);
  teardownPlumbings(() => {
    process.exit();
  });
});

// Apparently there are circumstances where we won't crash (?); ensure that we do
process.on('uncaughtException', (err) => {
  logger.error(err);

  // Notify mixpanel so we can track improvements to the app over time
  mixpanel.haikuTrackOnce('app:crash', {error: err.message});

  if (PLUMBING_INSTANCES[0]) {
    PLUMBING_INSTANCES[0].sentryError('?', err, {});
  }

  // Exit after timeout to give a chance for mixpanel to transmit
  setTimeout(() => {
    // Wait for teardown so we don't interrupt e.g. an important disk-write
    teardownPlumbings(() => {
      process.exit(1);
    });
  }, 1000);
});

export default class Plumbing extends EventEmitter {
  constructor () {
    super();

    // Keep track of all PLUMBING_INSTANCES so we can put our process.on listeners
    // above this constructor, which is necessary in test environments such
    // as tape where exit might never get called despite an exit.
    PLUMBING_INSTANCES.push(this);

    this.state = {};

    this.masters = {}; // Instances of Master, keyed by folder
    this.servers = []; // Websocket servers (there is usually only one)
    this.clients = []; // Websocket clients
    this.requests = {}; // Websocket requests, keyed by id

    // Avoid creating new handles if we have been explicitly torn down by a signal
    this._isTornDown = false;

    this._methodMessages = [];

    this.executeMethodMessagesWorker();

    emitter.on('teardown-requested', () => this.teardown());
  }

  /**
   * Mostly-internal methods
   */

  get (key) {
    return get(this.state, key);
  }

  set (key, value) {
    return set(this.state, key, value);
  }

  launch (haiku = {}, cb) {
    haiku = merge({}, HAIKU_DEFAULTS, haiku);

    logger.info('[plumbing] launching plumbing', haiku);

    this.envoyServer = new EnvoyServer({
      WebSocket,
      token: HAIKU_WS_SECURITY_TOKEN,
      logger: new EnvoyLogger('warn', logger),
    });

    return this.envoyServer.ready().then(() => {
      if (!haiku.envoy) {
        haiku.envoy = {};
      } // Gets stored in env vars before subprocs created

      haiku.envoy.port = this.envoyServer.port;
      haiku.envoy.host = this.envoyServer.host;
      haiku.envoy.token = HAIKU_WS_SECURITY_TOKEN;

      const user = new UserHandler(this.envoyServer);
      const timeline = new TimelineHandler(this.envoyServer);
      const tour = new TourHandler(this.envoyServer);
      const exporter = new ExporterHandler(user, this.envoyServer);
      const glass = new GlassHandler(this.envoyServer);
      const project = new ProjectHandler(user, this.envoyServer);
      const services = new ServicesHandler(this.envoyServer);
      this.envoyHandlers = {
        timeline,
        tour,
        exporter,
        glass,
        user,
        project,
        services,
      };

      this.envoyServer.bindHandler(TIMELINE_CHANNEL, TimelineHandler, this.envoyHandlers.timeline);
      this.envoyServer.bindHandler(TOUR_CHANNEL, TourHandler, this.envoyHandlers.tour);
      this.envoyServer.bindHandler(EXPORTER_CHANNEL, ExporterHandler, this.envoyHandlers.exporter);
      this.envoyServer.bindHandler(USER_CHANNEL, UserHandler, this.envoyHandlers.user);
      this.envoyServer.bindHandler(GLASS_CHANNEL, GlassHandler, this.envoyHandlers.glass);
      this.envoyServer.bindHandler(PROJECT_CHANNEL, ProjectHandler, this.envoyHandlers.project);
      this.envoyServer.bindHandler(SERVICES_CHANNEL, ServicesHandler, this.envoyHandlers.services);

      this.envoyHandlers.user.on(`${USER_CHANNEL}:load`, ({user: {Username}}) => {
        mixpanel.mergeToPayload({distinct_id: Username});
        if (Raven) {
          Raven.setContext({
            user: {email: Username},
          });
        }
      });

      logger.info('[plumbing] launching plumbing control server');

      haiku.socket.token = HAIKU_WS_SECURITY_TOKEN;

      return this.launchControlServer(haiku.socket, haiku.envoy.host, (err, server, host, port) => {
        if (err) {
          return cb(err);
        }

        // Forward these env vars to creator
        process.env.HAIKU_PLUMBING_PORT = port;
        process.env.HAIKU_PLUMBING_HOST = host;
        process.env.HAIKU_WS_SECURITY_TOKEN = HAIKU_WS_SECURITY_TOKEN;

        if (!haiku.socket) {
          haiku.socket = {};
        }

        haiku.socket.port = port;
        haiku.socket.host = host;

        haiku.plumbing = {url: `http://${host}:${port}`};

        this.servers.push(server);

        server.on('connection', (websocket, request) => {
          const params = getWsParams(websocket, request);

          if (haiku.socket.token && params.token !== haiku.socket.token) {
            logger.info(`[plumbing] websocket connected with bad token ${params.token}`);
            websocket.close(WS_POLICY_VIOLATION_CODE, 'forbidden');
            return;
          }

          if (!params.type) {
            params.type = 'default';
          }
          if (!params.haiku) {
            params.haiku = {};
          }
          if (!websocket.params) {
            websocket.params = params;
          }

          const type = websocket.params && websocket.params.type;
          const alias = websocket.params && websocket.params.alias;
          const folder = websocket.params && websocket.params.folder;

          logger.info(`[plumbing] websocket for ${folder} connected (${type} ${alias})`);

          // Don't allow multiple clients of the same alias and folder
          for (let i = this.clients.length - 1; i >= 0; i--) {
            const client = this.clients[i];

            if (client.params) {
              if (client.params.alias === alias && client.params.folder === folder) {
                if (client.readyState === WebSocket.OPEN) {
                  client.close();
                }

                this.clients.splice(i, 1);
              }
            }
          }

          this.clients.push(websocket);

          websocket.on('close', () => {
            logger.info(`[plumbing] websocket for ${folder} closed (${type} ${alias})`);
            this.removeWebsocketClient(websocket);
          });

          websocket.on('error', (err) => {
            logger.error(`[plumbing] websocket for ${folder} errored (${type} ${alias})`, err);
            throw err;
          });

          websocket.on('message', (data) => {
            const message = JSON.parse(data);

            this.handleRemoteMessage(
              type,
              alias,
              message.folder || folder,
              message,
              createResponder(message, websocket),
            );
          });
        });

        // If we were spawned as a subprocess inside of electron main, tell our parent to launch creator.
        if (typeof process.send === 'function') {
          process.send({
            haiku,
            message: 'launchCreator',
          });
        } else if (process.versions && !!process.versions.electron) {
          // We are in electron main (e.g. in a test context).
          global.process.env.HAIKU_ENV = JSON.stringify(haiku);
          require('haiku-creator/lib/electron');
        }

        return cb(null, host, port, server, null, haiku.envoy);
      });
    });
  }

  removeWebsocketClient (websocket) {
    for (let j = this.clients.length - 1; j >= 0; j--) {
      const client = this.clients[j];
      if (client === websocket) {
        this.clients.splice(j, 1);
      }
    }
  }

  /**
   * @method invokeAction
   * @description Convenience wrapper around making a generic action call
   */
  invokeAction (folder, method, params, cb) {
    params.unshift(folder);
    return this.handleRemoteMessage(
      'controller',
      'plumbing',
      folder,
      {method, params, folder, type: 'action'},
      cb,
    );
  }

  handleRemoteMessage (type, alias, folder, message, cb) {
    // IMPORTANT! Creator uses this
    if (!folder && message.folder) {
      folder = message.folder;
    }

    if (message.type === 'relay') {
      return this.relayMessage(
        folder,
        message,
      );
    }

    if (message.type === 'broadcast') {
      this.findMasterByFolder(folder).handleBroadcast(message);

      // Give clients the chance to emit events to all others
      return this.sendBroadcastMessage(message, folder, alias);
    }

    if (message.type === 'log') {
      logger.raw(message.message);

      // We want logs on creator, lets send it there
      return this.sendMessageToCreator(message, folder, alias);
    }

    if (message.id && this.requests[message.id]) {
      // If we have an entry in this.requests, that means this is a reply
      const {callback} = this.requests[message.id];
      delete this.requests[message.id];
      return callback(message.error, message.result, message);
    }

    if (message.method) {
      // Ensure that actions/methods occur in order by using a queue
      return this.processMethodMessage(type, alias, folder, message, cb);
    }
  }

  methodMessageBeforeLog (message, alias) {
    if (!IGNORED_METHOD_MESSAGES[message.method]) {
      logger.info(`[plumbing] ↓-- ${message.method} via ${alias} --↓`);
    }
  }

  methodMessageAfterLog (message, err, result, alias) {
    if (!IGNORED_METHOD_MESSAGES[message.method]) {
      if ((err && err.message) || (err && err.stack)) {
        logger.info(`[plumbing] ${message.method} error ${err.stack || err.message}`);
      }
      logger.info(`[plumbing] ↑-- ${message.method} via ${alias} --↑`);
    }
  }

  executeMethodMessagesWorker () {
    if (this._isTornDown) {
      return; // Avoid leaking a handle
    }

    const nextMethodMessage = this._methodMessages.shift();

    if (!nextMethodMessage) {
      return setTimeout(() => this.executeMethodMessagesWorker(), 64);
    }

    const {type, alias, folder, message, cb} = nextMethodMessage;

    this.methodMessageBeforeLog(message, alias);

    // Actions are a special case of methods that end up routed through all of the clients,
    // glass -> timeline -> master before returning. They go through one handler as opposed
    // to the normal 'methods' which plumbing handles on a more a la carte basis
    if (message.type === 'action') {
      return this.handleClientAction(type, alias, folder, message.method, message.params, (err, result) => {

        this.methodMessageAfterLog(message, err, result, alias);
        cb(err, result);
        this.executeMethodMessagesWorker();
      });
    }

    return this.plumbingMethod(message.method, message.params || [], (err, result) => {
      this.methodMessageAfterLog(message, err, result, alias);
      cb(err, result);
      this.executeMethodMessagesWorker();
    });
  }

  processMethodMessage (type, alias, folder, message, cb) {
    // Certain messages aren't of a kind that we can reliably enqueue -
    // either they happen too fast or they are 'fire and forget'
    if (METHOD_MESSAGES_TO_HANDLE_IMMEDIATELY[message.method]) {
      if (message.type === 'action') {
        return this.handleClientAction(type, alias, folder, message.method, message.params, cb);
      }

      return this.plumbingMethod(message.method, message.params, cb);
    }

    this._methodMessages.push({type, alias, folder, message, cb});
  }

  sendBroadcastMessage (message, folder, alias) {
    this.clients.forEach((client) => {
      // Don't send the broadcast to the sender
      if (client && client.params && client.params.alias === alias) {
        return;
      }

      // Don't send if we know the socket isn't open
      if (client.readyState !== WebSocket.OPEN) {
        return;
      }

      delete message.id; // Don't confuse this as a request/response

      sendMessageToClient(client, merge(message, {folder, alias}));
    });
  }

  sendMessageToCreator (message, folder, alias) {
    this.clients.forEach((client) => {

      // Don't send if we know the socket isn't open
      if (client.readyState !== WebSocket.OPEN || client.params.alias !== 'creator') {
        return;
      }

      delete message.id; // Don't confuse this as a request/response

      sendMessageToClient(client, merge(message, {folder, alias}));
    });
  }

  sentryError (method, error, extras) {
    try {
      logger.info(`[plumbing] error @ ${method}`, error, extras);
      if (!Raven) {
        return null;
      }
      if (method && METHODS_TO_SKIP_IN_SENTRY[method]) {
        return null;
      }
      if (!error) {
        return null;
      }
      if (typeof error === 'object' && !(error instanceof Error)) {
        const fixed = new Error(error.message || `Plumbing.${method} error`);
        if (error.stack) {
          fixed.stack = error.stack;
        }
        error = fixed;
      } else if (typeof error === 'string') {
        error = new Error(error); // Unfortunately no good stack trace in this case
      }
      const organization = this.envoyHandlers.user.getOrganization();
      crashReport(
        error,
        organization && organization.Name,
        this.get('lastOpenedProjectName'),
        this.get('lastOpenedProjectPath'),
      );
      return Raven.captureException(error, extras);
    } catch (exception) {
      logger.info(`[plumbing] unable to send crash report`);
      logger.error(exception);
    }
  }

  plumbingMethod (method, params = [], cb) {
    if (typeof this[method] !== 'function') {
      return cb(new Error(`Plumbing has no method '${method}'`));
    }
    return this[method].apply(this, params.concat((error, result) => {
      if (error) {
        return cb(error);
      }
      return cb(null, result);
    }));
  }

  awaitClientWithQuery (query, cb) {
    if (!query) {
      throw new Error('Query is required');
    }

    const fixed = {alias: query.alias};

    // The creator socket doesn't have a folder param, so omit the folder
    // from the query otherwise we won't find the socket in the collection
    if (fixed.alias !== 'creator') {
      if (query.folder) {
        fixed.folder = query.folder;
      }
    }

    const clientMatching = find(
      this.clients,
      {params: fixed},
    );

    if (clientMatching) {
      return cb(null, clientMatching);
    }

    return setTimeout(() => {
      return this.awaitClientWithQuery(query, cb);
    }, AWAIT_INTERVAL);
  }

  relayMessage (folder, message) {
    let clientSpec;
    if (message.view === 'glass') {
      clientSpec = Q_GLASS;
    }
    if (message.view === 'timeline') {
      clientSpec = Q_TIMELINE;
    }
    if (message.view === 'creator') {
      clientSpec = Q_CREATOR;
    }
    if (message.view === 'master') {
      clientSpec = Q_MASTER;
    }

    const clientQuery = lodash.assign({folder}, clientSpec);

    logger.info(`[plumbing] relaying ${message.name} to ${message.view}`);

    return this.awaitClientWithQuery(clientQuery, (_, client) => {
      return this.sendClientMessage(client, message);
    });
  }

  sendQueriedClientMethod (query = {}, method, params = [], cb) {
    return this.awaitClientWithQuery(query, (err, client) => {
      if (err) {
        return cb(err);
      }

      return this.sendClientMethod(client, method, params, (error, response) => {
        if (error) {
          this.sentryError(method, error, {tags: query});
        }

        return cb(error, response);
      });
    });
  }

  sendClientMethod (websocket, method, params = [], callback) {
    const message = {method, params};
    return this.sendClientRequest(websocket, message, callback);
  }

  sendClientRequest (websocket, message, callback) {
    if (message.id === undefined) {
      message.id = `${Math.random()}`;
    }
    this.requests[message.id] = {websocket, message, callback};
    return this.sendClientMessage(websocket, message);
  }

  sendClientMessage (websocket, message) {
    const data = JSON.stringify(message);

    // In case we get an error here, log it and then throw so we can see context
    if (websocket.readyState === WebSocket.OPEN) {
      return websocket.send(data, (err) => {
        if (err) {
          logger.error(err);
          throw err;
        }
      });
    }

    throw new Error('WebSocket is not open');
  }

  teardown (cb) {
    logger.info('[plumbing] teardown method called');

    return async.eachOfSeries(this.masters, (master, folder, next) => {
      this.teardownMaster(folder, () => {
        master.teardown(next);
      });
    }, () => {
      if (this.envoyServer) {
        logger.info('[plumbing] closing envoy server');
        this.envoyServer.close();
      }

      this.servers.forEach((server) => {
        logger.info('[plumbing] closing server');
        server.close();
      });

      this._isTornDown = true;

      if (cb) {
        cb();
      }
    });
  }

  /**
   * Outward-facing
   */

  masterHeartbeat (folder, cb) {
    return this.awaitMasterAndCallMethod(folder, 'masterHeartbeat', [{from: 'master'}], cb);
  }

  /**
   * @method copyDefaultSketchFile
   * @description copy the default Sketch file to the given project
   */
  copyDefaultSketchFile (projectName, assetPath, cb) {
    return cb(copyDefaultSketchFile(projectName, assetPath));
  }

  /**
   * @method copyDefaultIllustratorFile
   * @description copy the default Illustrator file to the given project
   */
  copyDefaultIllustratorFile (projectName, assetPath, cb) {
    return cb(copyDefaultIllustratorFile(projectName, assetPath));
  }

  /**
   * @method bootstrapProject
   * @description Flexible method for setting up a project based on an unknown file system state and possibly missing inputs.
   * We make a decision here as to where + whether to generate a new folder.
   * When it is ready, we kick off the content initialization step with initializeFolder.
   */
  bootstrapProject (
    project,
    finish,
  ) {
    storeConfigValues(
      project.projectPath,
      {
        username: project.authorName,
        organization: project.organizationName,
        project: project.projectName,
        branch: project.branchName,
      },
      {version: FALLBACK_SEMVER_VERSION},
    );

    return async.series([
      (cb) => {
        // This check is needed since Creator may wish to specify that we do/don't automatically create content.
        // This is important because if we create content then pull from the remote, we'll get a weird initial state.
        if (project.skipContentCreation) {
          logger.info('[plumbing] skipping content creation (I)');
          return cb();
        }

        return createProjectFiles(
          project,
          cb,
        );
      },

      (cb) => {
        this.upsertMaster({
          folder: path.normalize(project.projectPath),
          envoyOptions: {
            host: this.envoyServer.host,
            port: this.envoyServer.port,
            token: process.env.HAIKU_WS_SECURITY_TOKEN,
          },
          fileOptions: {
            doWriteToDisk: true,
            skipDiffLogging: false,
          },
          envoyHandlers: this.envoyHandlers,
        });

        cb();
      },
    ], (err) => {
      if (err) {
        this.sentryError('bootstrapProject', err);
        return finish(err);
      }

      return this.initializeFolder(
        project,
        (err) => {
          if (err) {
            return finish(err);
          }

          this.set('lastOpenedProjectName', project.projectName);
          this.set('lastOpenedProjectPath', project.projectPath);

          return finish(null);
        },
      );
    });
  }

  /**
   * @method initializeFolder
   * @description Assuming we already have a folder created, an organization name, etc., now bootstrap the folder itself.
   */
  initializeFolder (project, cb) {
    return this.awaitMasterAndCallMethod(project.projectPath, 'initializeFolder', [project, {from: 'master'}], cb);
  }

  startProject ({projectPath}, cb) {
    return this.awaitMasterAndCallMethod(projectPath, 'startProject', [{from: 'master'}], cb);
  }

  resendEmailConfirmation (username, cb) {
    return inkstone.user.requestConfirmEmail(username, cb);
  }

  getenv (cb) {
    return cb(null, sdkClient.config.getenv());
  }

  setenv (environmentVariables, cb) {
    return cb(null, sdkClient.config.setenv(environmentVariables));
  }

  duplicateProject (destinationProject, sourceProject, cb) {
    if (!sourceProject.projectExistsLocally) {
      logger.info(`[plumbing] source project did not exist during duplicate: ${sourceProject.projectName}`);
      // Unable to proceed; there is nothing from the source project that we could possibly copy.
      return cb();
    }

    if (destinationProject.projectExistsLocally) {
      // We don't actually need to return early here—but we should warn in logs in case something else bad happens
      // as a result.
      logger.warn(`[plumbing] source project existed locally during duplicate: ${destinationProject.projectName}`);
    }

    // Duplicate project folder content from source to destination.
    duplicateProject(destinationProject, sourceProject, (err) => {
      // Note: we don't pass errors forward to Creator here. It wouldn't know what to do with it.
      if (err) {
        logger.warn(`[plumbing] error during project duplication: ${err}`);
      }

      cb();
    });
  }

  teardownMaster (folder, cb) {
    logger.info(`[plumbing] tearing down master ${folder}`);
    awaitAllLocksFree(() => {
      if (this.masters[folder]) {
        this.masters[folder].halt();
      }

      // Since we're about to nav back to the dashboard, we're also about to drop the
      // connection to the websockets, so here we close them to avoid crashes
      const clientsOfFolder = filter(this.clients, {params: {folder}});

      clientsOfFolder.forEach((clientOfFolder) => {
        const alias = clientOfFolder.params.alias;
        if (alias === 'glass' || alias === 'timeline') {
          logger.info(`[plumbing] closing client ${alias} of ${folder}`);
          clientOfFolder.close();
          this.removeWebsocketClient(clientOfFolder);
        }
      });

      // Any messages destined for the folder need to be cleared since there's now
      // nobody who is able to receive them
      for (let i = this._methodMessages.length - 1; i >= 0; i--) {
        const message = this._methodMessages[i];
        if (message.folder === folder) {
          logger.info(`[plumbing] clearing message`);
          this._methodMessages.splice(i, 1);
        }
      }

      BaseModel.extensions.forEach((klass) => klass.purge());

      cb();
    });
  }

  saveProject (project, saveOptions, cb) {
    if (!saveOptions) {
      saveOptions = {};
    }
    logger.info('[plumbing] saving with options', saveOptions);
    return this.awaitMasterAndCallMethod(project.projectPath, 'saveProject', [project, saveOptions, {from: 'master'}], cb);
  }

  checkInkstoneUpdates (query = '', cb) {
    const authToken = sdkClient.config.getAuthToken();
    return inkstone.updates.check(authToken, query, cb);
  }

  listAssets (folder, cb) {
    return this.awaitMasterAndCallMethod(folder, 'fetchAssets', [{from: 'master'}], cb);
  }

  linkAsset (assetAbspath, folder, cb) {
    return this.awaitMasterAndCallMethod(folder, 'linkAsset', [assetAbspath, {from: 'master'}], cb);
  }

  bulkLinkAssets (assetsAbspaths, folder, cb) {
    return this.awaitMasterAndCallMethod(folder, 'bulkLinkAssets', [assetsAbspaths, {from: 'master'}], cb);
  }

  unlinkAsset (assetRelpath, folder, cb) {
    return this.awaitMasterAndCallMethod(folder, 'unlinkAsset', [assetRelpath, {from: 'master'}], cb);
  }

  readAllStateValues (folder, relpath, cb) {
    return this.awaitMasterAndCallMethod(folder, 'readAllStateValues', [relpath, {from: 'master'}], cb);
  }

  readAllEventHandlers (folder, relpath, cb) {
    return this.awaitMasterAndCallMethod(folder, 'readAllEventHandlers', [relpath, {from: 'master'}], cb);
  }

  handleClientAction (type, alias, folder, method, params, cb) {
    // Params always arrive with the folder as the first argument, so we strip that off
    params = params.slice(1);

    return async.eachSeries([Q_GLASS, Q_TIMELINE, Q_CREATOR, Q_MASTER], (clientSpec, nextStep) => {
      if (clientSpec.alias === alias) {
        // Don't send methods that originated with ourself
        return nextStep();
      }

      logActionInitiation(method, clientSpec);

      // Master is handled differently because it's not actually a separate process
      if (clientSpec === Q_MASTER) {
        return this.awaitMasterAndCallMethod(folder, method, params, nextStep);
      }

      this.sendQueriedClientMethod(lodash.assign({folder}, clientSpec), method, params, () => {});
      return nextStep();
    }, (err) => {
      return logAndHandleActionResult(err, cb, method, type, alias);
    });
  }
}

function logActionInitiation (method, clientSpec) {
  if (!IGNORED_METHOD_MESSAGES[method]) {
    logger.info(`[plumbing] -> client action ${method} being sent to ${clientSpec.alias}`);
  }
}

function logAndHandleActionResult (err, cb, method, type, alias) {
  if (!IGNORED_METHOD_MESSAGES[method]) {
    const status = (err) ? 'errored' : 'completed';
    logger.info(`[plumbing] <- client action ${method} from ${type}@${alias} ${status}`, err);
  }

  if (err) {
    if (cb) {
      return cb(err);
    }
    return void (0);
  }

  if (cb) {
    return cb();
  }
  return void (0);
}

Plumbing.prototype.awaitMasterAndCallMethod = function (folder, method, params, cb) {
  const master = this.findMasterByFolder(folder);
  if (!master) {
    return setTimeout(() => this.awaitMasterAndCallMethod(folder, method, params, cb), AWAIT_INTERVAL);
  }
  return master.handleMethodMessage(method, params, cb);
};

Plumbing.prototype.findMasterByFolder = function (folder) {
  return this.masters[folder];
};

Plumbing.prototype.upsertMaster = function ({folder, fileOptions, envoyOptions, envoyHandlers}) {
  const remote = (payload, cb) => {
    return this.handleRemoteMessage(
      'controllee',
      'master',
      folder,
      payload,
      cb,
    );
  };

  // When the user launches a project, we create a Master instance, and we keep it
  // running even if they navigate back to the dashboard to avoid a double expense
  // of initializing file watchers, Git, etc. This is just a simple multiton dict.
  if (!this.masters[folder]) {
    const master = new Master(
      folder,
      fileOptions,
      envoyOptions,
      envoyHandlers,
    );

    master.on('assets-changed', (master, assets) => {
      remote({
        assets,
        type: 'broadcast',
        name: 'assets-changed',
        folder: master.folder,
      }, () => {

      });
    });

    master.on('component:reload', (master, file) => {
      remote({
        type: 'broadcast',
        name: 'component:reload',
        folder: master.folder,
        relpath: file.relpath,
      }, () => {

      });
    });

    master.on('project-state-change', (payload) => {
      remote(lodash.assign({
        type: 'broadcast',
        name: 'project-state-change',
        folder: master.folder,
      }, payload), () => {

      });
    });

    this.masters[folder] = master;
  }

  this.masters[folder].active = true;

  return this.masters[folder];
};

let portrange = 45032;

// On the given host, return the port number of an open port. Note that the host must be
// specified otherwise you end up getting false positives! E.g. ipv4 0.0.0.0 vs ipv6 ::.
function getPort (host, cb) {
  const port = portrange;
  portrange += 1;
  const server = net.createServer();
  server.listen(port, host);
  server.once('listening', () => {
    server.once('close', () => {
      return cb(null, port);
    });
    server.close();
  });
  server.on('error', (err) => {
    if (err && err.code === 'EADDRINUSE') {
      return getPort(host, cb);
    }
    // If not an address-in-use error, something bad has happened and we likely shouldn't continue
    throw err;
  });
  return server;
}

Plumbing.prototype.launchControlServer = function launchControlServer (socketInfo, host, cb) {
  if (socketInfo && socketInfo.port) {
    logger.info(`[plumbing] plumbing websocket server listening on specified port ${socketInfo.port}...`);

    const websocketServer = this.createControlSocket({
      host,
      port: socketInfo.port,
    });

    return cb(null, websocketServer, host, socketInfo.port);
  }

  return getPort(host, (err, port) => {
    if (err) {
      return cb(err);
    }

    const websocketServer = this.createControlSocket({
      host,
      port,
    });

    return cb(null, websocketServer, host, port);
  });
};

Plumbing.prototype.extendEnvironment = function extendEnvironment (haiku) {
  const HAIKU_ENV = JSON.parse(process.env.HAIKU_ENV || '{}');
  merge(HAIKU_ENV, haiku);
  logger.info('[plumbing] environment forwarding:', JSON.stringify(HAIKU_ENV, 2, null));
  process.env.HAIKU_ENV = JSON.stringify(HAIKU_ENV); // Forward env to subprocesses
};

function getWsParams (websocket, request) {
  const url = request.url || '';
  const query = url.split('?')[1] || '';
  const params = qs.parse(query);
  params.url = url;
  return params;
}

Plumbing.prototype.createControlSocket = function createControlSocket (socketInfo) {
  return new WebSocket.Server({
    port: socketInfo.port,
    host: socketInfo.host,
  });
};

function sendMessageToClient (client, message) {
  const data = JSON.stringify(message);
  if (client.readyState === WebSocket.OPEN) {
    return client.send(data, (err) => {
      if (err) {
        // This should never happen.
        throw new Error(`Error during send: ${err}`);
      }
    });
  }

  if (data.type || data.name || data.method) {
    // Only throw if the message has request content; responses can be ignored
    // safely since the requester has been closed down
    throw new Error(`Attempted message to non-open WebSocket: ${data}`);
  }
}

function createResponder (message, websocket) {
  return function messageResponder (error, result) {
    const reply = {
      jsonrpc: '2.0',
      id: message.id,
      result: result || void (0),
      error: (error) ? serializeError(error) : void (0),
    };
    sendMessageToClient(websocket, reply);
  };
}
