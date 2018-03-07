const { each } = require('async')
const { argv } = require('yargs')

const Plumbing = require('haiku-plumbing/lib/Plumbing').default
const haikuInfo = require('haiku-plumbing/lib/haikuInfo').default
const { ExporterFormat } = require('haiku-sdk-creator/lib/exporter')

const log = require('./helpers/log')

const plumbing = new Plumbing()

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
        saveStrategy: { strategy: 'recursive', favor: 'ours' },
        exporterFormats: [ExporterFormat.Bodymovin]
      },
      cb
    )
  }, 5000)
}

const startProject = (projectObject, cb) => {
  plumbing.startProject(
    projectObject.projectName,
    projectObject.projectPath,
    (err) => {
      if (err) {
        cb(err)
        return
      }

      saveProject(projectObject, cb)
    }
  )
}

const republishProject = (projectObject, cb) => {
  plumbing.initializeProject(
    projectObject.projectName,
    projectObject,
    undefined,
    undefined,
    (err) => {
      if (err) {
        cb(err)
        return
      }

      startProject(projectObject, cb)
    }
  )
}

plumbing.launch({ ...haikuInfo(), mode: 'headless' }, (err) => {
  if (err) {
    throw err
  }

  plumbing.getCurrentOrganizationName((err, organizationName) => {
    if (err) {
      throw err
    }

    log.hat(`currently signed in as ${organizationName}`)

    plumbing.listProjects((err, allProjects) => {
      if (err) {
        throw err
      }

      const projects = argv.onlyProjects
        ? allProjects.filter(({ projectName }) => argv.onlyProjects.split(',').includes(projectName))
        : allProjects

      each(
        projects,
        (project, next) => {
          republishProject(
            {
              ...project,
              organizationName,
              skipContentCreation: true
            },
            next
          )
        },
        (err) => {
          if (err) {
            log.warn('caught error(s) during publish')
          }

          if (global.haiku && global.haiku.HaikuGlobalAnimationHarness) {
            global.haiku.HaikuGlobalAnimationHarness.cancel()
          }
          plumbing.teardown()
        }
      )
    })
  })
})
