const tape = require('tape')
const path = require('path')
const fse = require('haiku-fs-extra')
const Project = require('./../../src/bll/Project')

tape('Project', (t) => {
  t.plan(15)
  const folder = path.join(__dirname, '..', 'fixtures', 'projects', 'project-01')
  fse.removeSync(folder)
  const websocket = { on: () => {}, send: () => {}, action: () => {}, connect: () => {} }
  const platform = {}
  const userconfig = {}
  const fileOptions = { doWriteToDisk: true, skipDiffLogging: false }
  const envoyOptions = { mock: true }
  Project.setup(folder, 'test', websocket, platform, userconfig, fileOptions, envoyOptions, (err, project) => {
    t.error(err, 'no err proj setup')
    return project.setCurrentActiveComponent('main', { from: 'test' }, (err) => {
      t.error(err, 'no error setting ac')
      t.deepEqual(project.getMetadata(), { from: 'test', alias: 'test' })
      t.deepEqual(project.getFileOptions(), fileOptions)
      t.deepEqual(project.getEnvoyOptions(), envoyOptions)
      t.deepEqual(project.getFolder(), folder)
      t.deepEqual(project.getAlias(), 'test')
      t.true(project.buildFileUid('foo/bar/baz.js').endsWith('haiku-serialization/test/fixtures/projects/project-01/foo/bar/baz.js'))
      t.ok(project.getEnvoyClient())
      websocket.send = () => {}

      const ac1 = project.findActiveComponentBySceneName('main')
      t.ok(ac1)
      const ac2 = project.getCurrentActiveComponent()
      t.ok(ac2)

      project.setCurrentActiveComponent('meow_meow', { from: 'test' }, (err, ac) => {
        t.error(err, 'no error creating + setting ac')
        t.ok(ac, 'ac created is present')
        t.equal(ac.getReifiedBytecode().metadata.relpath, 'code/meow_meow/code.js', 'ac created relpath is ok')
        fse.removeSync(folder)
        t.ok(true, 'finished')
      })
    })
  })
})
