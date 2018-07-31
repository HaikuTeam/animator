const tape = require('tape')
const path = require('path')
const fse = require('haiku-fs-extra')
const Project = require('./../../src/bll/Project')
const Element = require('./../../src/bll/Element')

const TEXT_SVG = `<svg><text font-family="DontKnowDontCare" font-size="12">Hello friend.</text></svg>`

tape('File.readMana', (t) => {
  t.plan(3)
  const folder = path.join(__dirname, '..', 'fixtures', 'projects', 'file-readmana-01')
  fse.removeSync(folder)
  const websocket = { on: () => {}, send: () => {}, action: () => {}, connect: () => {} }
  const platform = {}
  const userconfig = {}
  const fileOptions = { doWriteToDisk: true, skipDiffLogging: true }
  const envoyOptions = { mock: true }
  return Project.setup(folder, 'test', websocket, platform, userconfig, fileOptions, envoyOptions, (err, project) => {
    return project.setCurrentActiveComponent('main', { from: 'test' }, (err) => {
      if (err) throw err
      fse.outputFileSync(path.join(folder, 'designs/Text.svg'), TEXT_SVG)
      const ac0 = project.getCurrentActiveComponent()
      return ac0.instantiateComponent('designs/Text.svg', {}, { from: 'test' }, (err, mana) => {
        if (err) throw err
        const timelineProperties = ac0
          .fetchActiveBytecodeFile()
          .getReifiedBytecode()
          .timelines.Default[`haiku:${mana.children[0].attributes['haiku-id']}`]
        t.deepEqual(timelineProperties.content, {0: {value: 'Hello friend.'}}, 'svg text content is transcluded')
        t.deepEqual(timelineProperties['fontSize'], {0: {value: 12}}, 'most svg text attributes are parsed')
        t.deepEqual(
          timelineProperties['fontFamily'],
          {0: {value: 'Helvetica, Arial, sans-serif'}},
          'svg font-family is clobbered with a default sans-serif chain'
        )
        fse.removeSync(folder)
      })
    })
  })
})
