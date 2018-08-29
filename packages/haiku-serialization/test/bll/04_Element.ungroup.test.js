const tape = require('tape')
const path = require('path')
const fse = require('haiku-fs-extra')
const {getStub} = require('haiku-testing/lib/mock');

const Project = require('../../src/bll/Project')

tape('Element.ungroup', (suite) => {
  suite.test('svg.01', (test) => {
    const folder = path.join(__dirname, '..', 'fixtures', 'projects', 'ungroup-svg-01')
    fse.removeSync(folder)
    const websocket = { on: () => {}, send: () => {}, action: () => {}, connect: () => {} }
    const platform = {}
    const userconfig = {}
    const fileOptions = { doWriteToDisk: true, skipDiffLogging: true }
    const envoyOptions = { mock: true }
    return Project.setup(folder, 'test', websocket, platform, userconfig, fileOptions, envoyOptions, (err, project) => {
      return project.setCurrentActiveComponent('main', { from: 'test' }, (err) => {
        if (err) {
          throw err
        }

        fse.outputFileSync(
          path.join(folder, 'designs/rects.svg'),
          `<?xml version="1.0" encoding="UTF-8"?>
          <svg width="200px" height="200px" viewBox="0 0 200 200" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
              <defs>
                  <path id="somerect" d="M0,0 H100 V200 H0 V0 Z" />
              </defs>
              <use xlink:href="#somerect" transform="translate(0 0)" fill="red" />
              <use xlink:href="#somerect" transform="translate(100 0)" fill="green" />
          </svg>`
        )
        const ac0 = project.getCurrentActiveComponent()
        test.ok(ac0, 'ac present')
        return ac0.instantiateComponent('designs/rects.svg', {}, { from: 'test' }, (err, mana) => {
          if (err) {
            throw err
          }
          const element = ac0.findElementByComponentId(mana.attributes['haiku-id'])
          test.ok(element, 'element present')
          const template = ac0.fetchActiveBytecodeFile().getReifiedDecycledBytecode().template
          let counter = 0
          element.getHaikuElement().visit((descendantHaikuElement) => {
            if (descendantHaikuElement.tagName === 'use') {
              descendantHaikuElement.memory.targets = [{getBBox: getStub()}]
              // Stub getBBox to mimic browser behavior
              descendantHaikuElement.target.getBBox.returns({width: 100, height: 200, x: 100 * counter, y: 0})
              counter++
            }
          })
          test.is(element.getUngroupables().length, 2, 'element has 2 ungroupable')
          element.ungroup({from: 'test'}, () => {
            const bytecode = ac0.fetchActiveBytecodeFile().getReifiedDecycledBytecode()
            const template = bytecode.template
            const defaultTimeline = bytecode.timelines.Default
            test.is(template.children.length, 2, 'ungroup resulted in two children')
            template.children.forEach((node, index) => {
              test.is(node.children[0].elementName, 'defs', `defs were transcluded (${index})`)
              test.is(node.children[0].children[0].elementName, 'path', `path was transcluded in defs (${index})`)
              test.is(node.children[1].elementName, 'g', `shim group was created to shim layout (${index})`)
            })
            test.deepEqual(
              defaultTimeline[`haiku:${template.children[0].children[1].attributes['haiku-id']}`],
              {'translation.x': {0: {value: -100}}},
              'shim group was offset by the expected amount'
            )
            test.isNot(
              template.children[0].children[0].children[0].attributes['haiku-id'],
              template.children[1].children[0].children[0].attributes['haiku-id'],
              'children of defs have different IDs'
            )
            test.end()
          })
        })
      })
    })
  })
  suite.end()
})
