const {eachSeries} = require('async');
const {argv} = require('yargs');

// tslint:disable-next-line:variable-name
const Plumbing = require('haiku-plumbing/lib/Plumbing').default;
const haikuInfo = require('haiku-plumbing/lib/haikuInfo').default;
const {ExporterFormat} = require('haiku-sdk-creator/lib/exporter');

const log = require('./helpers/log');

const plumbing = new Plumbing();

const saveProject = (projectObject, cb) => {
  // Give ourselves some time to cool off so our file watchers can detect any changes.
  // TODO: Remove this after we implement "Wait for all changes to be written in disk before publishing"
  // @see {@link https://app.asana.com/0/550212203261201/556129196894307/f}
  setTimeout(() => {
    plumbing.saveProject(
      projectObject.projectPath,
      projectObject.projectName,
      undefined,
      undefined,
      {
        commitMessage: 'Manual version bump (via mono script republish-all)',
        saveStrategy: {strategy: 'recursive', favor: 'ours'},
        exporterFormats: [ExporterFormat.Bodymovin, ExporterFormat.HaikuStatic],
      },
      (err) => {
        if (err) {
          cb(err);
          return;
        }

        plumbing.teardownMaster(projectObject.projectPath, cb);
      },
    );
  }, 5000);
};

const startProject = (projectObject, cb) => {
  plumbing.startProject(
    projectObject.projectName,
    projectObject.projectPath,
    (err) => {
      if (err) {
        cb(err);
        return;
      }

      saveProject(projectObject, cb);
    },
  );
};

const republishProject = (projectObject, cb) => {
  plumbing.bootstrapProject(
    projectObject.projectName,
    projectObject,
    undefined,
    undefined,
    (err) => {
      if (err) {
        cb(err);
        return;
      }

      startProject(projectObject, cb);
    },
  );
};

plumbing.launch({...haikuInfo(), mode: 'headless'}, (err) => {
  if (err) {
    throw err;
  }

  plumbing.getCurrentOrganizationName((getCurrentOrganizationNameError, organizationName) => {
    if (getCurrentOrganizationNameError) {
      throw getCurrentOrganizationNameError;
    }

    log.hat(`currently signed in as ${organizationName}`);

    plumbing.listProjects((listProjectsError, allProjects) => {
      if (listProjectsError) {
        throw listProjectsError;
      }

      const projects = argv.onlyProjects
        ? allProjects.filter(({projectName}) => argv.onlyProjects.split(',').includes(projectName))
        : allProjects;

      eachSeries(
        projects,
        (project, next) => {
          republishProject(
            {
              ...project,
              organizationName,
              skipContentCreation: true,
            },
            next,
          );
        },
        (finalError) => {
          if (finalError) {
            log.warn('caught error(s) during publish');
          }

          if (global.haiku && global.haiku.HaikuGlobalAnimationHarness) {
            global.haiku.HaikuGlobalAnimationHarness.cancel();
          }
          plumbing.teardown();
        },
      );
    });
  });
});
