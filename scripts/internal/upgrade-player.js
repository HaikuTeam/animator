/**
 * Usage:
 * node ./scripts/internal/upgrade-player.js --username=me --password=123 --projects=foo1,foo2
 * Description:
 * Upgrades the @haiku/player version for all projects specified, then saves+publishes them.
 */
const async = require('async');
const {argv} = require('yargs');
const Plumbing = require('./../../packages/haiku-plumbing/lib/Plumbing').default;

const plumbing = new Plumbing();
if (!argv.username) throw new Error('--username required');
if (!argv.password) throw new Error('--password required');
if (!argv.projects) throw new Error('--projects required (example: --projects=Proj1,Proj2,Proj3)');
const targets = argv.projects.split(',').map((str) => str.trim());
if (targets.length < 1) throw new Error('projects list empty');
plumbing.launch({mode: 'headless'}, (err, host, port, server, spawned, envoy) => {
  if (err) throw err;
  process.env.HAIKU_PLUMBING_HOST = host;
  process.env.HAIKU_PLUMBING_PORT = port;
  process.env.ENVOY_HOST = envoy.host;
  process.env.ENVOY_PORT = envoy.port;
  return async.series([
    function (cb) { return plumbing.authenticateUser(argv.username, argv.password, cb); },
    function (cb) {
      return plumbing.listProjects((err, projects) => {
        if (err) throw err;
        const candidates = [];
        const unknowns = [];
        targets.forEach((name) => {
          let known = false;
          projects.forEach((project) => {
            if (project.projectName === name) {
              known = true;
              candidates.push(name);
            }
          });
          if (!known) {
            unknowns.push(name);
          }
        });
        if (unknowns.length > 0) {
          throw new Error(`you specified unknown projects ${unknowns.join(', ')}`);
        }
        if (candidates.length < 1) {
          throw new Error('no active projects found');
        }
        console.log(candidates);
        return async.eachSeries(candidates, (projectName, next) => async.series([
          function (done) {
            return plumbing.initializeProject(projectName, {projectName, skipContentCreation: true}, argv.username, argv.password, done);
          },
          function (done) {
            // Simply starting the project should have the effect of upgrading the @haiku/player version
            return plumbing.startProject(projectName, plumbing.getFolderFor(projectName), done);
          },
          function (done) {
            return plumbing.saveProject(plumbing.getFolderFor(projectName), projectName, argv.username, argv.password, {}, (err, share) => {
              if (err) return done(err);
              console.log(share);
              return done();
            });
          },
        ], next), cb);
      });
    },
  ], (err) => {
    if (err) throw err;
    console.info('done');
  });
});
