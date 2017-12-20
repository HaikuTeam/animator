const tape = require('tape')
const path = require('path')
const fse = require('haiku-fs-extra')
const Project = require('./../../src/bll/Project')

tape('Project', (t) => {
  t.plan(40)
  const folder = path.join(__dirname, '..', 'fixtures', 'projects', 'project-01')
  fse.removeSync(folder)
  const websocket = { on: () => {}, send: () => {}, action: () => {}, connect: () => {} }
  const platform = {}
  const userconfig = {}
  const fileOptions = { doShallowWorkOnly: false, skipDiffLogging: false }
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
      t.equal(project.buildFileUid('foo/bar/baz.js'), '/Users/matthew/Code/HaikuTeam/mono/packages/haiku-serialization/test/fixtures/projects/project-01/foo/bar/baz.js')
      t.ok(project.getPlatform().haiku.registry[project.buildFileUid('code/main/code.js')])
      t.ok(project.getEnvoyChannel('timeline'),'envoy timeline exists')
      t.ok(project.getEnvoyClient())
      project.once('remote-update', (a,b,c,d) => {
        t.equal(a,'meowMeow')
        t.equal(b,1)
        t.equal(c,2)
        t.equal(d,undefined)
      })
      project.once('update', (a,b,c,d) => {
        t.equal(a,'ruffRuff')
        t.equal(b,3)
        t.equal(c,4)
        t.equal(d,undefined)
      })
      project.emitHook('meowMeow',1,2,{from:'luna'})
      project.emitHook('ruffRuff',3,4,{from:'test'})

      websocket.send = (data) => {
        t.equal(data.type,'broadcast')
        t.equal(data.method,'hi:bye')
        t.equal(data.params[1],'moo/cow.txt')
        t.equal(data.params[2],'hey')
        t.equal(data.params[3],100)
        t.ok(data.time)
        t.ok(data.folder)
      }
      project.broadcastMethod('hi:bye','moo/cow.txt','hey',100)
      websocket.send = () => {}

      websocket.action = (a,b,c,d) => {
        t.equal(a,'unselectElement')
        t.equal(data.params[1],'oh/la/la.rb')
        t.equal(data.params[2],'abc123')
        t.equal(typeof c, 'function')
        t.equal(d,undefined)
      }
      project.methodHook('unselectElement', 'oh/la/la.rb', 'abc123', {from:'test'})
      websocket.action = () => {}

      const ac1 = project.findActiveComponentBySceneName('main')
      t.ok(ac1)
      const ac2 = project.getCurrentActiveComponent()
      t.ok(ac2)

      websocket.send = (data) => {
        t.equal(data.type,'action')
        t.equal(data.from,'test')
        t.equal(data.method,'applyPropertyGroupValue')
        t.equal(data.params[1],'code/main/code.js')
        t.equal(data.params[2],'zyx987')
        t.equal(data.params[3],'Default')
        t.equal(data.params[4],0)
        t.deepEqual(data.params[5],{'translation.x':101})
      }
      project.transmitAction('applyPropertyGroupValue',ac1.getSceneCodeRelpath(),'zyx987','Default',0,{'translation.x':101})
      websocket.send = () => {}

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
