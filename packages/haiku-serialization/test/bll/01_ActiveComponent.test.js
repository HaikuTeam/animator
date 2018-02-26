const tape = require('tape')
const path = require('path')
const fse = require('haiku-fs-extra')

const Project = require('./../../src/bll/Project')
const File = require('./../../src/bll/File')
const Element = require('./../../src/bll/Element')

const waitUntilFileProbablyWroteToDisk = (fn) => {
  return setTimeout(fn, 2000) // Disk writes happen on a 500ms interval
}

tape('ActiveComponent.prototype.instantiateComponent[1](design)', (t) => {
  t.plan(8)
  const folder = path.join(__dirname, '..', 'fixtures', 'projects', 'instantiate-01')
  fse.removeSync(folder)
  const websocket = { on: () => {}, send: () => {}, action: () => {}, connect: () => {} }
  const platform = {}
  const userconfig = {}
  const fileOptions = { doWriteToDisk: true, skipDiffLogging: true }
  const envoyOptions = { mock: true }
  return Project.setup(folder, 'test', websocket, platform, userconfig, fileOptions, envoyOptions, (err, project) => {
    return project.setCurrentActiveComponent('main', { from: 'test' }, (err) => {
      if (err) throw err
      fse.outputFileSync(path.join(folder, 'designs/Path.svg'), PATH_SVG_1)
      const ac0 = project.getCurrentActiveComponent()
      t.ok(ac0, 'ac present')
      return ac0.instantiateComponent('designs/Path.svg', {}, { from: 'test' }, (err, info, mana) => {
        if (err) throw err
        t.equal(info.center.x, 0, 'info center is returned')
        t.equal(mana.attributes.source, 'designs/Path.svg', 'rel source is in mana attribute')
        const timeline = ac0.getReifiedBytecode().timelines.Default['haiku:' + mana.attributes['haiku-id']]
        t.deepEqual(timeline, { 'style.position': { 0: { value: 'absolute' } }, 'style.margin': { 0: { value: '0' } }, 'style.padding': { 0: { value: '0' } }, 'style.border': { 0: { value: '0' } }, 'sizeAbsolute.x': { 0: { value: 99 } }, 'sizeMode.x': { 0: { value: 1 } }, 'sizeAbsolute.y': { 0: { value: 69 } }, 'sizeMode.y': { 0: { value: 1 } }, 'style.zIndex': { 0: { value: 1 } } }, 'timeline is ok')
        const subtemplate = ac0.getReifiedBytecode().template.children[0]
        t.equal(subtemplate.attributes['haiku-id'], mana.attributes['haiku-id'], 'template id ok')
        return waitUntilFileProbablyWroteToDisk(() => {
          return File.read(folder, ac0.fetchActiveBytecodeFile().relpath, (err, contents) => {
            t.error(err, 'no err fetching code')
            t.equal(contents.length, 6054, 'checksum of file ok')
            fse.removeSync(folder)
            t.ok(true)
          })
        })
      })
    })
  })
})

tape('ActiveComponent.prototype.deleteComponent[1](design)', (t) => {
  t.plan(9)
  const folder = path.join(__dirname, '..', 'fixtures', 'projects', 'delete-01')
  fse.removeSync(folder)
  const websocket = { on: () => {}, send: () => {}, action: () => {}, connect: () => {} }
  const platform = {}
  const userconfig = {}
  const fileOptions = { doWriteToDisk: true, skipDiffLogging: true }
  const envoyOptions = { mock: true }
  return Project.setup(folder, 'test', websocket, platform, userconfig, fileOptions, envoyOptions, (err, project) => {
    return project.setCurrentActiveComponent('main', { from: 'test' }, (err) => {
      if (err) throw err
      fse.outputFileSync(path.join(folder, 'designs/Path.svg'), PATH_SVG_1)
      const ac0 = project.getCurrentActiveComponent()
      return ac0.instantiateComponent('designs/Path.svg', {}, { from: 'test' }, (err, info, mana) => {
        if (err) throw err
        t.equal(ac0.getReifiedBytecode().template.children.length,1,'has one child')
        t.equal(ac0.getReifiedBytecode().template.children[0].attributes['haiku-id'],mana.attributes['haiku-id'],'instantiatee id correct')
        return File.read(folder, ac0.fetchActiveBytecodeFile().relpath, (err, contents) => {
          t.error(err, 'no err reading file after inst')
          const lines = contents.split('\n')
          t.equal(lines[0],'var Haiku = require("@haiku/core");','haiku require is in place')
          return ac0.deleteComponent(mana.attributes['haiku-id'], { from: 'test' }, (err) => {
            t.error(err, 'no err deleting')
            t.equal(ac0.getReifiedBytecode().template.children.length,0,'correct number of children')
            return waitUntilFileProbablyWroteToDisk(() => {
              return File.read(folder, ac0.fetchActiveBytecodeFile().relpath, (err, contents) => {
                t.error(err, 'no err reading file after del')
                const lines = contents.split('\n')
                t.equal(lines[0],'var Haiku = require("@haiku/core");','haiku require is in place at line 0')
                fse.removeSync(folder)
                t.ok(true)
              })
            })
          })
        })
      })
    })
  })
})

tape('ActiveComponent.prototype.mergeDesign[1](design)', (t) => {
  t.plan(7)
  const folder = path.join(__dirname, '..', 'fixtures', 'projects', 'merge-01')
  fse.removeSync(folder)
  const websocket = { on: () => {}, send: () => {}, action: () => {}, connect: () => {} }
  const platform = {}
  const userconfig = {}
  const fileOptions = { doWriteToDisk: true, skipDiffLogging: false }
  const envoyOptions = { mock: true }
  return Project.setup(folder, 'test', websocket, platform, userconfig, fileOptions, envoyOptions, (err, project) => {
    return project.setCurrentActiveComponent('main', { from: 'test' }, (err) => {
      if (err) throw err
      fse.outputFileSync(path.join(folder, 'designs/Oval.svg'), OVAL_UNO) // Circle in group
      const ac0 = project.getCurrentActiveComponent()
      return ac0.instantiateComponent('designs/Oval.svg', {}, { from: 'test' }, (err, info, mana) => {
        if (err) throw err
        // Verifying that explicit changes to deep elements are retained and stale entities cleared
        const m1 = ac0.getElements()[1].getJITPropertyOptionsAsMenuItems()
        t.equal(JSON.stringify(ac0.getDisplayableRows().map((r) => r.getUniqueKey())), '["e4a9e4d8baa7+e4a9e4d8baa7-element-heading-null-null","e4a9e4d8baa7+e4a9e4d8baa7-cluster-heading-Size-null","e4a9e4d8baa7+e4a9e4d8baa7-property-null-opacity","e4a9e4d8baa7+e4a9e4d8baa7-cluster-heading-Style-null","fcfa0ce997b3+fcfa0ce997b3-element-heading-null-null","fcfa0ce997b3+fcfa0ce997b3-property-null-opacity","fcfa0ce997b3+fcfa0ce997b3-cluster-heading-Position-null","fcfa0ce997b3+fcfa0ce997b3-cluster-heading-Rotation-null","fcfa0ce997b3+fcfa0ce997b3-cluster-heading-Scale-null","fcfa0ce997b3+fcfa0ce997b3-cluster-heading-Style-null"]', 'rows ok 1')
        m1[4].submenu[0].submenu[0].onClick() // Click the 'Stroke' property
        return setTimeout(() => {
          t.equal(JSON.stringify(ac0.getDisplayableRows().map((r) => r.getUniqueKey())), '["e4a9e4d8baa7+e4a9e4d8baa7-element-heading-null-null","e4a9e4d8baa7+e4a9e4d8baa7-cluster-heading-Size-null","e4a9e4d8baa7+e4a9e4d8baa7-property-null-opacity","e4a9e4d8baa7+e4a9e4d8baa7-cluster-heading-Style-null","fcfa0ce997b3+fcfa0ce997b3-element-heading-null-null","fcfa0ce997b3+fcfa0ce997b3-property-null-opacity","fcfa0ce997b3+fcfa0ce997b3-cluster-heading-Position-null","fcfa0ce997b3+fcfa0ce997b3-cluster-heading-Rotation-null","fcfa0ce997b3+fcfa0ce997b3-cluster-heading-Scale-null","fcfa0ce997b3+fcfa0ce997b3-cluster-heading-Style-null","88c011ac942e+fcfa0ce997b3-property-null-stroke"]', 'rows ok 2')
          return waitUntilFileProbablyWroteToDisk(() => {
            return File.read(folder, ac0.fetchActiveBytecodeFile().relpath, (err, contents1) => {
              if (err) throw err
              t.ok(contents1, 'contents present')
              const circleId = ac0.getReifiedBytecode().template.children[0].children[0].children[0].attributes['haiku-id']
              return ac0.createKeyframe(circleId, 'Default', 'circle', 'fill', 0, 'blue', 'linear', null, null, {from: 'test'}, (err) => {
                if (err) throw err
                fse.outputFileSync(path.join(folder, 'designs/Oval.svg'), OVAL_DOS) // Ellipse in extra group
                return ac0.mergeDesigns({ 'designs/Oval.svg': true }, { from: 'test' }, (err) => {
                  if (err) throw err
                  t.equal(JSON.stringify(ac0.getDisplayableRows().map((r) => r.getUniqueKey())), '["e4a9e4d8baa7+e4a9e4d8baa7-element-heading-null-null","e4a9e4d8baa7+e4a9e4d8baa7-cluster-heading-Size-null","e4a9e4d8baa7+e4a9e4d8baa7-property-null-opacity","e4a9e4d8baa7+e4a9e4d8baa7-cluster-heading-Style-null","fcfa0ce997b3+fcfa0ce997b3-element-heading-null-null","fcfa0ce997b3+fcfa0ce997b3-property-null-opacity","fcfa0ce997b3+fcfa0ce997b3-cluster-heading-Position-null","fcfa0ce997b3+fcfa0ce997b3-cluster-heading-Rotation-null","fcfa0ce997b3+fcfa0ce997b3-cluster-heading-Scale-null","fcfa0ce997b3+fcfa0ce997b3-cluster-heading-Style-null"]', 'rows ok 3')
                  return waitUntilFileProbablyWroteToDisk(() => {
                    return File.read(folder, ac0.fetchActiveBytecodeFile().relpath, (err, contents2) => {
                      if (err) throw err
                      t.ok(contents2)
                      const diffs = []
                      const lines1 = contents1.split('\n')
                      const lines2 = contents2.split('\n')
                      lines1.forEach((line, index) => {
                        if (line !== lines2[index]) {
                          diffs.push([line, lines2[index]])
                        }
                      })
                      t.equal(JSON.stringify(diffs), JSON.stringify([["      \"haiku:fc91c13c20f4\": {","      \"haiku:7c32034eb4c1\": {"],["      \"haiku:88c011ac942e\": {","      \"haiku:a3f81f2a0816\": {"],["        fill: { \"0\": { value: \"#D8D8D8\" } },","        \"translation.x\": { \"0\": { value: -189 } },"],["        cx: { \"0\": { value: \"61\" } },","        \"translation.y\": { \"0\": { value: -622 } }"],["        cy: { \"0\": { value: \"61\" } },","      },"],["        r: { \"0\": { value: \"61\" } }","      \"haiku:49fc30c5fddf\": {"],["      }","        fill: { \"0\": { value: \"#57787E\" } },"],["    }","        cx: { \"0\": { value: \"239.5\" } },"],["  },","        cy: { \"0\": { value: \"690.5\" } },"],["  template: {","        rx: { \"0\": { value: \"57.5\" } },"],["    elementName: \"div\",","        ry: { \"0\": { value: \"40.5\" } }"],["    attributes: { \"haiku-id\": \"e4a9e4d8baa7\", \"haiku-title\": \"merge-01\" },","      }"],["    children: [","    }"],["      {","  },"],["        elementName: \"svg\",","  template: {"],["        attributes: {","    elementName: \"div\","],["          version: \"1.1\",","    attributes: { \"haiku-id\": \"e4a9e4d8baa7\", \"haiku-title\": \"merge-01\" },"],["          xmlns: \"http://www.w3.org/2000/svg\",","    children: ["],["          \"xmlns:xlink\": \"http://www.w3.org/1999/xlink\",","      {"],["          source: \"designs/Oval.svg\",","        elementName: \"svg\","],["          \"haiku-id\": \"fcfa0ce997b3\",","        attributes: {"],["          \"haiku-title\": \"Oval\"","          version: \"1.1\","],["        },","          xmlns: \"http://www.w3.org/2000/svg\","],["        children: [","          \"xmlns:xlink\": \"http://www.w3.org/1999/xlink\","],["          {","          source: \"designs/Oval.svg\","],["            elementName: \"g\",","          \"haiku-id\": \"fcfa0ce997b3\","],["            attributes: { \"haiku-id\": \"fc91c13c20f4\", id: \"Page-1\" },","          \"haiku-title\": \"Oval\""],["            children: [","        },"],["              {","        children: ["],["                elementName: \"circle\",","          {"],["                attributes: { \"haiku-id\": \"88c011ac942e\", id: \"Oval\" },","            elementName: \"g\","],["                children: []","            attributes: { \"haiku-id\": \"7c32034eb4c1\", id: \"Page-1\" },"],["              }","            children: ["],["            ]","              {"],["          }","                elementName: \"g\","],["        ]","                attributes: { \"haiku-id\": \"a3f81f2a0816\", id: \"Tutorial\" },"],["      }","                children: ["],["    ]","                  {"],["  }","                    elementName: \"ellipse\","],["};","                    attributes: { \"haiku-id\": \"49fc30c5fddf\", id: \"Oval\" },"],["","                    children: []"]]))
                      fse.removeSync(folder)
                      t.ok(true)
                    })
                  })
                })
              })
            })
          })
        }, 1000)
      })
    })
  })
})

tape('ActiveComponent.prototype.mergeDesign[4](design)', (t) => {
  t.plan(7)
  const folder = path.join(__dirname, '..', 'fixtures', 'projects', 'merge-04')
  fse.removeSync(folder)
  const websocket = { on: () => {}, send: () => {}, action: () => {}, connect: () => {} }
  const platform = {}
  const userconfig = {}
  const fileOptions = { doWriteToDisk: true, skipDiffLogging: false }
  const envoyOptions = { mock: true }
  return Project.setup(folder, 'test', websocket, platform, userconfig, fileOptions, envoyOptions, (err, project) => {
    return project.setCurrentActiveComponent('main', { from: 'test' }, (err) => {
      if (err) throw err
      fse.outputFileSync(path.join(folder, 'designs/Oval.svg'), OVAL_UNO) // Circle in group
      const ac0 = project.getCurrentActiveComponent()
      return ac0.instantiateComponent('designs/Oval.svg', {}, { from: 'test' }, (err, info, mana) => {
        if (err) throw err
        // Verifying that explicit changes to deep elements are retained and stale entities cleared
        const m1 = ac0.getElements()[1].getJITPropertyOptionsAsMenuItems()
        t.equal(JSON.stringify(ac0.getDisplayableRows().map((r) => r.getUniqueKey())), '["e4a9e4d8baa7+e4a9e4d8baa7-element-heading-null-null","e4a9e4d8baa7+e4a9e4d8baa7-cluster-heading-Size-null","e4a9e4d8baa7+e4a9e4d8baa7-property-null-opacity","e4a9e4d8baa7+e4a9e4d8baa7-cluster-heading-Style-null","fcfa0ce997b3+fcfa0ce997b3-element-heading-null-null","fcfa0ce997b3+fcfa0ce997b3-property-null-opacity","fcfa0ce997b3+fcfa0ce997b3-cluster-heading-Position-null","fcfa0ce997b3+fcfa0ce997b3-cluster-heading-Rotation-null","fcfa0ce997b3+fcfa0ce997b3-cluster-heading-Scale-null","fcfa0ce997b3+fcfa0ce997b3-cluster-heading-Style-null"]', 'rows ok 1')
        m1[4].submenu[0].submenu[0].onClick() // Click the 'Stroke' property
        return setTimeout(() => {
          t.equal(JSON.stringify(ac0.getDisplayableRows().map((r) => r.getUniqueKey())), '["e4a9e4d8baa7+e4a9e4d8baa7-element-heading-null-null","e4a9e4d8baa7+e4a9e4d8baa7-cluster-heading-Size-null","e4a9e4d8baa7+e4a9e4d8baa7-property-null-opacity","e4a9e4d8baa7+e4a9e4d8baa7-cluster-heading-Style-null","fcfa0ce997b3+fcfa0ce997b3-element-heading-null-null","fcfa0ce997b3+fcfa0ce997b3-property-null-opacity","fcfa0ce997b3+fcfa0ce997b3-cluster-heading-Position-null","fcfa0ce997b3+fcfa0ce997b3-cluster-heading-Rotation-null","fcfa0ce997b3+fcfa0ce997b3-cluster-heading-Scale-null","fcfa0ce997b3+fcfa0ce997b3-cluster-heading-Style-null","88c011ac942e+fcfa0ce997b3-property-null-stroke"]', 'rows ok 2')
          return waitUntilFileProbablyWroteToDisk(() => {
            return File.read(folder, ac0.fetchActiveBytecodeFile().relpath, (err, contents1) => {
              if (err) throw err
              t.ok(contents1, 'contents present')
              const circleId = ac0.getReifiedBytecode().template.children[0].children[0].children[0].attributes['haiku-id']
              return ac0.createKeyframe(circleId, 'Default', 'circle', 'fill', 0, 'blue', 'linear', null, null, {from: 'test'}, (err) => {
                if (err) throw err
                fse.outputFileSync(path.join(folder, 'designs/Oval.svg'), OVAL_TRES) // Modified version of same circle
                return ac0.mergeDesigns({ 'designs/Oval.svg': true }, { from: 'test' }, (err) => {
                  if (err) throw err
                  t.equal(JSON.stringify(ac0.getDisplayableRows().map((r) => r.getUniqueKey())), '["e4a9e4d8baa7+e4a9e4d8baa7-element-heading-null-null","e4a9e4d8baa7+e4a9e4d8baa7-cluster-heading-Size-null","e4a9e4d8baa7+e4a9e4d8baa7-property-null-opacity","e4a9e4d8baa7+e4a9e4d8baa7-cluster-heading-Style-null","fcfa0ce997b3+fcfa0ce997b3-element-heading-null-null","fcfa0ce997b3+fcfa0ce997b3-property-null-opacity","fcfa0ce997b3+fcfa0ce997b3-cluster-heading-Position-null","fcfa0ce997b3+fcfa0ce997b3-cluster-heading-Rotation-null","fcfa0ce997b3+fcfa0ce997b3-cluster-heading-Scale-null","fcfa0ce997b3+fcfa0ce997b3-cluster-heading-Style-null","ed6c8148557c+fcfa0ce997b3-property-null-stroke"]', 'rows ok 3')
                  return waitUntilFileProbablyWroteToDisk(() => {
                    return File.read(folder, ac0.fetchActiveBytecodeFile().relpath, (err, contents2) => {
                      if (err) throw err
                      t.ok(contents2)
                      const diffs = []
                      const lines1 = contents1.split('\n')
                      const lines2 = contents2.split('\n')
                      lines1.forEach((line, index) => {
                        if (line !== lines2[index]) {
                          diffs.push([line, lines2[index]])
                        }
                      })
                      t.equal(JSON.stringify(diffs), JSON.stringify([["      \"haiku:fc91c13c20f4\": {","      \"haiku:7c32034eb4c1\": {"],["      \"haiku:88c011ac942e\": {","      \"haiku:ed6c8148557c\": {"],["        fill: { \"0\": { value: \"#D8D8D8\" } },","        fill: { \"0\": { value: \"blue\", curve: \"linear\", edited: true } },"],["            attributes: { \"haiku-id\": \"fc91c13c20f4\", id: \"Page-1\" },","            attributes: { \"haiku-id\": \"7c32034eb4c1\", id: \"Page-1\" },"],["                attributes: { \"haiku-id\": \"88c011ac942e\", id: \"Oval\" },","                attributes: { \"haiku-id\": \"ed6c8148557c\", id: \"Oval\" },"]]))
                      fse.removeSync(folder)
                      t.ok(true)
                    })
                  })
                })
              })
            })
          })
        }, 1000)
      })
    })
  })
})

tape('ActiveComponent.prototype.mergeDesign[2](design)', (t) => {
  t.plan(2)
  const folder = path.join(__dirname, '..', 'fixtures', 'projects', 'merge-design-02')
  fse.removeSync(folder)
  const websocket = { on: () => {}, send: () => {}, action: () => {}, connect: () => {} }
  const platform = {}
  const userconfig = {}
  const fileOptions = { doShallowWorkOnly: false, skipDiffLogging: true }
  const envoyOptions = { mock: true }
  return Project.setup(folder, 'test', websocket, platform, userconfig, fileOptions, envoyOptions, (err, project) => {
    return project.setCurrentActiveComponent('main', { from: 'test' }, (err) => {
      if (err) throw err
      fse.outputFileSync(path.join(folder, 'designs/Circle.svg'), CIRCLE_SVG_1)
      const ac0 = project.getCurrentActiveComponent()
      return ac0.instantiateComponent('designs/Circle.svg', {}, { from: 'test' }, (err, info, mana) => {
        if (err) throw err
        return waitUntilFileProbablyWroteToDisk(() => {
          return File.read(folder, ac0.fetchActiveBytecodeFile().relpath, (err, contents1) => {
            if (err) throw err
            fse.outputFileSync(path.join(folder, 'designs/Circle.svg'), CIRCLE_SVG_2) // Other one
            return ac0.mergeDesigns({ 'designs/Circle.svg': true }, { from: 'test' }, (err) => {
              if (err) throw err
              return waitUntilFileProbablyWroteToDisk(() => {
                return File.read(folder, ac0.fetchActiveBytecodeFile().relpath, (err, contents2) => {
                  if (err) throw err
                  const diffs = []
                  const lines1 = contents1.split('\n')
                  const lines2 = contents2.split('\n')
                  lines1.forEach((line, index) => {
                    if (line !== lines2[index]) {
                      diffs.push([line, lines2[index]])
                    }
                  })
                  t.equal(JSON.stringify(diffs), JSON.stringify([["      \"haiku:08d34c8688e1\": {","      \"haiku:4b52fe32fe2b\": {"],["      \"haiku:b485436dd91d\": {","      \"haiku:f43e4d778352\": {"],["        \"stop-color\": { \"0\": { value: \"#EEEEEE\" } },","        \"stop-color\": { \"0\": { value: \"#D13434\" } },"],["      \"haiku:028ae0aa2297\": {","      \"haiku:6fc410a08c6f\": {"],["      \"haiku:4c23803dcf1a\": {","      \"haiku:b6cdb6833503\": {"],["      \"haiku:d69533458e23\": {","      \"haiku:a9d157d96fb7\": {"],["        \"stop-color\": { \"0\": { value: \"#C8C8C8\" } },","        \"stop-color\": { \"0\": { value: \"#4F78EC\" } },"],["      \"haiku:34fa68c80ef8\": {","      \"haiku:6ad9e31fdff1\": {"],["      \"haiku:5b667571edf1\": {","      \"haiku:3a1babd750e8\": {"],["        x: { \"0\": { value: \"-1.3%\" } },","        x: { \"0\": { value: \"-5.1%\" } },"],["        y: { \"0\": { value: \"-1.3%\" } },","        y: { \"0\": { value: \"-5.1%\" } },"],["        \"sizeProportional.x\": { \"0\": { value: 1.026 } },","        \"sizeProportional.x\": { \"0\": { value: 1.179 } },"],["        \"sizeProportional.y\": { \"0\": { value: 1.026 } },","        \"sizeProportional.y\": { \"0\": { value: 1.103 } },"],["      \"haiku:8e6e52f0bb32\": {","      \"haiku:04cc9355e1d0\": {"],["      \"haiku:92e653270cde\": {","      \"haiku:12f3b1905641\": {"],["        dx: { \"0\": { value: \"0\" } },","        dx: { \"0\": { value: \"3\" } },"],["      \"haiku:5b545e0da537\": {","      \"haiku:b981bffff5bf\": {"],["      \"haiku:771b75c96cde\": {","      \"haiku:bc898c5043a6\": {"],["      \"haiku:16e9e78c3195\": {","      \"haiku:628092fa9068\": {"],["        x: { \"0\": { value: \"-1.3%\" } },","        x: { \"0\": { value: \"-3.8%\" } },"],["        y: { \"0\": { value: \"-1.3%\" } },","        y: { \"0\": { value: \"-3.8%\" } },"],["        \"sizeProportional.x\": { \"0\": { value: 1.026 } },","        \"sizeProportional.x\": { \"0\": { value: 1.1540000000000001 } },"],["        \"sizeProportional.y\": { \"0\": { value: 1.026 } },","        \"sizeProportional.y\": { \"0\": { value: 1.077 } },"],["      \"haiku:db1773b46af7\": {","      \"haiku:4b8b1d853c6e\": {"],["        dx: { \"0\": { value: \"0\" } },","        dx: { \"0\": { value: \"-2\" } },"],["      \"haiku:f99d21171d37\": {","      \"haiku:b977d64e263a\": {"],["      \"haiku:a7d388f49e21\": {","      \"haiku:37a85f6765e7\": {"],["      \"haiku:52694ff1d354\": {","      \"haiku:a543b9c77662\": {"],["      \"haiku:9dab8da94a68\": {","      \"haiku:33e803c165a5\": {"],["        filter: { \"0\": { value: \"url(#filter-4-440b5d)\" } }","        filter: { \"0\": { value: \"url(#filter-4-374dee)\" } }"],["      \"haiku:3e6a8afc0d83\": {","      \"haiku:868e2fc58507\": {"],["        fill: { \"0\": { value: \"url(#linearGradient-1-440b5d)\" } },","        fill: { \"0\": { value: \"url(#linearGradient-1-374dee)\" } },"],["      \"haiku:15a11160a6c9\": {","      \"haiku:3378e339aede\": {"],["        filter: { \"0\": { value: \"url(#filter-5-440b5d)\" } }","        filter: { \"0\": { value: \"url(#filter-5-374dee)\" } }"],["      \"haiku:b8c190a55bca\": {","      \"haiku:973243870dbe\": {"],["        stroke: { \"0\": { value: \"url(#linearGradient-2-440b5d)\" } },","        stroke: { \"0\": { value: \"url(#linearGradient-2-374dee)\" } },"],["            attributes: { \"haiku-id\": \"4183ec0d24b0\" },","            attributes: { \"haiku-id\": \"98a52c29d99b\" },"],["                  \"haiku-id\": \"08d34c8688e1\",","                  \"haiku-id\": \"4b52fe32fe2b\","],["                  id: \"linearGradient-1-440b5d\"","                  id: \"linearGradient-1-374dee\""],["                    attributes: { \"haiku-id\": \"b485436dd91d\" },","                    attributes: { \"haiku-id\": \"f43e4d778352\" },"],["                    attributes: { \"haiku-id\": \"028ae0aa2297\" },","                    attributes: { \"haiku-id\": \"6fc410a08c6f\" },"],["                  \"haiku-id\": \"4c23803dcf1a\",","                  \"haiku-id\": \"b6cdb6833503\","],["                  id: \"linearGradient-2-440b5d\"","                  id: \"linearGradient-2-374dee\""],["                    attributes: { \"haiku-id\": \"d69533458e23\" },","                    attributes: { \"haiku-id\": \"a9d157d96fb7\" },"],["                    attributes: { \"haiku-id\": \"34fa68c80ef8\" },","                    attributes: { \"haiku-id\": \"6ad9e31fdff1\" },"],["                  \"haiku-id\": \"5b667571edf1\",","                  \"haiku-id\": \"3a1babd750e8\","],["                  id: \"filter-4-440b5d\"","                  id: \"filter-4-374dee\""],["                    attributes: { \"haiku-id\": \"8e6e52f0bb32\" },","                    attributes: { \"haiku-id\": \"04cc9355e1d0\" },"],["                    attributes: { \"haiku-id\": \"92e653270cde\" },","                    attributes: { \"haiku-id\": \"12f3b1905641\" },"],["                    attributes: { \"haiku-id\": \"5b545e0da537\" },","                    attributes: { \"haiku-id\": \"b981bffff5bf\" },"],["                    attributes: { \"haiku-id\": \"771b75c96cde\", type: \"matrix\" },","                    attributes: { \"haiku-id\": \"bc898c5043a6\", type: \"matrix\" },"],["                  \"haiku-id\": \"16e9e78c3195\",","                  \"haiku-id\": \"628092fa9068\","],["                  id: \"filter-5-440b5d\"","                  id: \"filter-5-374dee\""],["                    attributes: { \"haiku-id\": \"db1773b46af7\" },","                    attributes: { \"haiku-id\": \"4b8b1d853c6e\" },"],["                    attributes: { \"haiku-id\": \"f99d21171d37\" },","                    attributes: { \"haiku-id\": \"b977d64e263a\" },"],["                    attributes: { \"haiku-id\": \"a7d388f49e21\", type: \"matrix\" },","                    attributes: { \"haiku-id\": \"37a85f6765e7\", type: \"matrix\" },"],["            attributes: { \"haiku-id\": \"52694ff1d354\", id: \"Page-1\" },","            attributes: { \"haiku-id\": \"a543b9c77662\", id: \"Page-1\" },"],["                attributes: { \"haiku-id\": \"4ed7ec1a48fd\", id: \"Circle\" },","                attributes: { \"haiku-id\": \"a5563e882a8f\", id: \"Circle\" },"],["                    attributes: { \"haiku-id\": \"9dab8da94a68\", id: \"path-3-0\" },","                    attributes: { \"haiku-id\": \"33e803c165a5\", id: \"path-3-0\" },"],["                    attributes: { \"haiku-id\": \"3e6a8afc0d83\", id: \"path-3-1\" },","                    attributes: { \"haiku-id\": \"868e2fc58507\", id: \"path-3-1\" },"],["                    attributes: { \"haiku-id\": \"15a11160a6c9\", id: \"path-3-2\" },","                    attributes: { \"haiku-id\": \"3378e339aede\", id: \"path-3-2\" },"],["                    attributes: { \"haiku-id\": \"b8c190a55bca\", id: \"path-3-3\" },","                    attributes: { \"haiku-id\": \"973243870dbe\", id: \"path-3-3\" },"]]))
                  fse.removeSync(folder)
                  t.ok(true)
                })
              })
            })
          })
        })
      })
    })
  })
})

tape('ActiveComponent.prototype.mergeDesign[3](design)', (t) => {
  t.plan(2)
  const folder = path.join(__dirname, '..', 'fixtures', 'projects', 'merge-design-03')
  fse.removeSync(folder)
  const websocket = { on: () => {}, send: () => {}, action: () => {}, connect: () => {} }
  const platform = {}
  const userconfig = {}
  const fileOptions = { doShallowWorkOnly: false, skipDiffLogging: true }
  const envoyOptions = { mock: true }
  return Project.setup(folder, 'test', websocket, platform, userconfig, fileOptions, envoyOptions, (err, project) => {
    return project.setCurrentActiveComponent('main', { from: 'test' }, (err) => {
      if (err) throw err
      fse.outputFileSync(path.join(folder, 'designs/PercyNose.svg'), PERCY_NOSE_1)
      const ac0 = project.getCurrentActiveComponent()
      return ac0.instantiateComponent('designs/PercyNose.svg', {}, { from: 'test' }, (err, info, mana) => {
        if (err) throw err
        return waitUntilFileProbablyWroteToDisk(() => {
          return File.read(folder, ac0.fetchActiveBytecodeFile().relpath, (err, contents1) => {
            if (err) throw err
            fse.outputFileSync(path.join(folder, 'designs/PercyNose.svg'), PERCY_NOSE_2) // Other one
            return ac0.mergeDesigns({ 'designs/PercyNose.svg': true }, { from: 'test' }, (err) => {
              if (err) throw err
              return waitUntilFileProbablyWroteToDisk(() => {
                return File.read(folder, ac0.fetchActiveBytecodeFile().relpath, (err, contents2) => {
                  if (err) throw err
                  const diffs = []
                  const lines1 = contents1.split('\n')
                  const lines2 = contents2.split('\n')
                  lines1.forEach((line, index) => {
                    if (line !== lines2[index]) {
                      diffs.push([line, lines2[index]])
                    }
                  })
                  t.equal(JSON.stringify(diffs), JSON.stringify([["      \"haiku:f35f9141b983\": {","      \"haiku:fe79a0a60860\": {"],["      \"haiku:d5960b443b19\": {","      \"haiku:0e767d9d32ee\": {"],["      \"haiku:0e868981ec4a\": {","      \"haiku:c917eaabf7a9\": {"],["      \"haiku:23ffb92b7e5b\": { \"translation.y\": { \"0\": { value: 72.38 } } },","      \"haiku:c198ef41de4b\": { \"translation.y\": { \"0\": { value: 72.38 } } },"],["      \"haiku:33cde524cfdd\": {","      \"haiku:e3396d8dedba\": {"],["      \"haiku:a6dbfcb360d4\": {","      \"haiku:7d89a3712af1\": {"],["      \"haiku:89c814618c88\": {","      \"haiku:9a8ca46cd4b8\": {"],["      \"haiku:62c2ca0179e9\": {","      \"haiku:e72ef1f2ccf0\": {"],["        fill: { \"0\": { value: \"#FF5E87\" } },","        fill: { \"0\": { value: \"#000000\" } },"],["      \"haiku:69d14f7e3c86\": {","      \"haiku:6ae06a3fe0fe\": {"],["        fill: { \"0\": { value: \"#FF5E87\" } },","        fill: { \"0\": { value: \"#000000\" } },"],["            attributes: { \"haiku-id\": \"f35f9141b983\", id: \"Page-1\" },","            attributes: { \"haiku-id\": \"fe79a0a60860\", id: \"Page-1\" },"],["                attributes: { \"haiku-id\": \"d5960b443b19\", id: \"Screen-3\" },","                attributes: { \"haiku-id\": \"0e767d9d32ee\", id: \"Screen-3\" },"],["                    attributes: { \"haiku-id\": \"0e868981ec4a\", id: \"percy\" },","                    attributes: { \"haiku-id\": \"c917eaabf7a9\", id: \"percy\" },"],["                        attributes: { \"haiku-id\": \"23ffb92b7e5b\", id: \"nose\" },","                        attributes: { \"haiku-id\": \"c198ef41de4b\", id: \"nose\" },"],["                              \"haiku-id\": \"33cde524cfdd\",","                              \"haiku-id\": \"e3396d8dedba\","],["                              \"haiku-id\": \"a6dbfcb360d4\",","                              \"haiku-id\": \"7d89a3712af1\","],["                              \"haiku-id\": \"89c814618c88\",","                              \"haiku-id\": \"9a8ca46cd4b8\","],["                              \"haiku-id\": \"62c2ca0179e9\",","                              \"haiku-id\": \"e72ef1f2ccf0\","],["                              \"haiku-id\": \"69d14f7e3c86\",","                              \"haiku-id\": \"6ae06a3fe0fe\","]]))
                  fse.removeSync(folder)
                  t.ok(true)
                })
              })
            })
          })
        })
      })
    })
  })
})

tape('ActiveComponent.prototype.instantiateComponent[2](component)', (t) => {
  t.plan(11)
  const folder = path.join(__dirname, '..', 'fixtures', 'projects', 'instantiate-02')
  fse.removeSync(folder)
  const websocket = { on: () => {}, send: () => {}, action: () => {}, connect: () => {} }
  const platform = {}
  const userconfig = {}
  const fileOptions = { doWriteToDisk: true, skipDiffLogging: true }
  const envoyOptions = { mock: true }
  return Project.setup(folder, 'test', websocket, platform, userconfig, fileOptions, envoyOptions, (err, project) => {
    return project.setCurrentActiveComponent('main', { from: 'test' }, (err) => {
      if (err) throw err
      fse.outputFileSync(path.join(folder, 'designs/Path.svg'), PATH_SVG_1)
      const ac0 = project.getCurrentActiveComponent()
      return project.componentizeDesign('designs/Path.svg', {}, (err, identifier, modpath, bytecode, nil, component) => {
        if (err) throw err
        return waitUntilFileProbablyWroteToDisk(() => {
          return File.read(folder, modpath, (err, contents) => {
            if (err) throw err
            t.ok(contents.length,15402,'content checksum ok')
            return ac0.instantiateComponent(`./${modpath}`, {}, { from: 'test' }, (err, info, mana) => {
              t.error(err, 'no err upon instantiation')
              t.equal(info.center.x, 0, 'info center is returned')
              t.equal(mana.attributes.source, '../designs_path_svg/code.js', 'rel source is in mana attribute')
              const timeline = ac0.getReifiedBytecode().timelines.Default['haiku:' + mana.attributes['haiku-id']]
              t.deepEqual(timeline, {
                'style.position': { '0': { value: 'absolute' } },
                'style.margin': { '0': { value: '0' } },
                'style.padding': { '0': { value: '0' } },
                'style.border': { '0': { value: '0' } },
                'sizeAbsolute.x': { '0': { value: 99 } },
                'sizeMode.x': { '0': { value: 1 } },
                'sizeAbsolute.y': { '0': { value: 69 } },
                'sizeMode.y': { '0': { value: 1 } },
                'style.zIndex': { '0': { value: 1 } }
              }, 'timeline is ok')
              const subtemplate = ac0.getReifiedBytecode().template.children[0]
              t.equal(subtemplate.elementName.metadata.relpath, 'code/designs_path_svg/code.js', 'el name is bytecode')
              t.deepEqual(subtemplate.attributes, { source: '../designs_path_svg/code.js', identifier: 'designs_path_svg', 'haiku-title': 'designs_path_svg', 'haiku-id': 'b97c697fa7d6' }, 'el attrs ok')
              return waitUntilFileProbablyWroteToDisk(() => {
                return File.read(folder, ac0.fetchActiveBytecodeFile().relpath, (err, contents) => {
                  if (err) throw err
                  t.equal(contents.length, 1870, 'checksum ok')
                  var lines = contents.split('\n')
                  t.equal(lines[0], 'var Haiku = require("@haiku/core");', 'first line is haiku require')
                  t.equal(lines[1], 'var designs_path_svg = require("../designs_path_svg/code.js");', 'first line is component require')
                  fse.removeSync(folder)
                  t.ok(true)
                })
              })
            })
          })
        })
      })
    })
  })
})

tape('ActiveComponent.prototype.deleteComponent[2](component)', (t) => {
  t.plan(6)
  const folder = path.join(__dirname, '..', 'fixtures', 'projects', 'delete-02')
  fse.removeSync(folder)
  const websocket = { on: () => {}, send: () => {}, action: () => {}, connect: () => {} }
  const platform = {}
  const userconfig = {}
  const fileOptions = { doWriteToDisk: true, skipDiffLogging: true }
  const envoyOptions = { mock: true }
  return Project.setup(folder, 'test', websocket, platform, userconfig, fileOptions, envoyOptions, (err, project) => {
    return project.setCurrentActiveComponent('main', { from: 'test' }, (err) => {
      if (err) throw err
      fse.outputFileSync(path.join(folder, 'designs/Path.svg'), PATH_SVG_1)
      const ac0 = project.getCurrentActiveComponent()
      return project.componentizeDesign('designs/Path.svg', {}, (err, identifier, modpath, bytecode, nil, component) => {
        if (err) throw err
        return waitUntilFileProbablyWroteToDisk(() => {
          return File.read(folder, modpath, (err, contents) => {
            if (err) throw err
            t.equal(ac0.getReifiedBytecode().template.children.length,0)
            return ac0.instantiateComponent(`./${modpath}`, {}, { from: 'test' }, (err, info, mana) => {
              if (err) throw err
              return ac0.deleteComponent(mana.attributes['haiku-id'], { from: 'test' }, (err) => {
                if (err) throw err
                t.equal(ac0.getReifiedBytecode().template.children.length,0,'correct number of children')
                return waitUntilFileProbablyWroteToDisk(() => {
                  return File.read(folder, ac0.fetchActiveBytecodeFile().relpath, (err, contents) => {
                    t.error(err, 'no err reading file after del')
                    const lines = contents.split('\n')
                    t.equal(lines[0],'var Haiku = require("@haiku/core");','haiku require is in place at line 0', 'first line ok')
                    t.equal(lines[1],'module.exports = {', '2nd line ok')
                    fse.removeSync(folder)
                    t.ok(true)
                  })
                })
              })
            })
          })
        })
      })
    })
  })
})

tape('ActiveComponent.prototype.pasteThing[1]', (t) => {
  t.plan(3)
  const folder = path.join(__dirname, '..', 'fixtures', 'projects', 'paste-01')
  fse.removeSync(folder)
  const websocket = { on: () => {}, send: () => {}, action: () => {}, connect: () => {} }
  const platform = {}
  const userconfig = {}
  const fileOptions = { doWriteToDisk: true, skipDiffLogging: true }
  const envoyOptions = { mock: true }
  return Project.setup(folder, 'test', websocket, platform, userconfig, fileOptions, envoyOptions, (err, project) => {
    return project.setCurrentActiveComponent('main', { from: 'test' }, (err) => {
      if (err) throw err
      fse.outputFileSync(path.join(folder, 'designs/Path.svg'), PATH_SVG_1)
      const ac0 = project.getCurrentActiveComponent()
      return ac0.instantiateComponent('designs/Path.svg', {}, { from: 'test' }, (err, info, mana) => {
        if (err) throw err
        const el1 = ac0.findElementByComponentId(mana.attributes['haiku-id'])
        const pasteable1 = el1.clip({from: 'test'})
        return ac0.pasteThing(pasteable1, { x: 100, y: 100 }, { from: 'test' }, (err) => {
          t.error(err, 'no err from paste')
          t.equal(ac0.getReifiedBytecode().template.children[1].attributes['haiku-id'],`${mana.attributes['haiku-id']}-646885`)
          t.ok(ac0.getReifiedBytecode().timelines.Default[`haiku:${mana.attributes['haiku-id']}-646885`])
          fse.removeSync(folder)
        })
      })
    })
  })
})

tape('ActiveComponent.prototype.batchUpsertEventHandlers[1]', (t) => {
  t.plan(1)
  const folder = path.join(__dirname, '..', 'fixtures', 'projects', 'BUEH-01')
  fse.removeSync(folder)
  const websocket = { on: () => {}, send: () => {}, action: () => {}, connect: () => {} }
  const platform = {}
  const userconfig = {}
  const fileOptions = { doWriteToDisk: true, skipDiffLogging: true }
  const envoyOptions = { mock: true }
  return Project.setup(folder, 'test', websocket, platform, userconfig, fileOptions, envoyOptions, (err, project) => {
    return project.setCurrentActiveComponent('main', { from: 'test' }, (err) => {
      if (err) throw err
      const ac0 = project.getCurrentActiveComponent()
      const haikuId = ac0.getArtboard().getElementHaikuId()
      const selectorName = `haiku:${haikuId}`
      return ac0.batchUpsertEventHandlers(selectorName, SERIALIZED_EVENTS, { from: 'test' }, (err) => {
        if (err) throw err
        t.equal(typeof ac0.getReifiedBytecode().eventHandlers[selectorName].click.handler, 'function', 'handler is fn')
        fse.removeSync(folder)
      })
    })
  })
})

const SERIALIZED_EVENTS = {
  "click": {
    "handler": {
      "__function": {
        "params": ["event"],
        "body": "/** action logic goes here */\nconsole.log(12);",
        "type":"FunctionExpression",
        "name":null
      }
    }
  }
}

const PATH_SVG_1 = `
  <?xml version="1.0" encoding="UTF-8"?>
  <svg width="99px" height="69px" viewBox="0 0 99 69" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <!-- Generator: sketchtool 46.2 (44496) - http://www.bohemiancoding.com/sketch -->
      <title>PathPen</title>
      <desc>Created with sketchtool.</desc>
      <defs>
        <foobar id="abc123"></foobar>
      </defs>
      <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
          <g foobar="url(#abc123)" id="Artboard" transform="translate(-283.000000, -254.000000)" stroke="#979797">
              <path d="M294.851562,260.753906 C282.404105,283.559532 310.725273,290.63691 326.835937,295.734375 C331.617305,297.247215 342.059558,301.595875 338.316406,309.21875 C337.259516,311.371092 335.344104,313.379399 333.070312,314.140625 C316.687518,319.6253 318.607648,314.107756 316.175781,298.535156 C314.073483,285.072967 341.353724,262.381072 307.847656,273.160156 C302.953426,274.734657 299.363413,279.037222 295.621094,282.5625 C294.703984,283.426421 289.762583,289.749326 292.835937,292.191406 C310.800174,306.465746 310.629063,293.466831 327.605469,293.117188 C340.400227,292.853669 361.733615,282.532042 364.140625,298.585938 C364.591437,301.592694 366.227007,305.49551 364.140625,307.707031 C356.643614,315.653704 320.800977,318.428842 316.511719,304 C313.310899,293.23261 309.646651,279.191944 316.511719,270.300781 L317.605469,266.996094 C318.70025,265.578208 319.962133,263.856288 321.726562,263.546875 C348.187608,258.906626 333.406544,260.284286 342.546875,271.855469 C345.091836,275.077257 351.639186,275.674796 351.988281,279.765625 L354.464844,283.632812 C357.416932,318.226499 296.30014,340.100228 293.25,300.105469 C292.638094,292.081893 291.431499,283.803546 293.25,275.964844 C294.715721,269.646813 297.246721,262.379048 302.785156,259.003906 C320.414927,248.260262 322.400502,263.451084 330.808594,271.378906 C333.565871,273.978688 339.302903,273.7221 340.503906,277.316406 C343.115394,285.131945 334.783267,296.681412 341.050781,302.03125 C348.504241,308.39339 366.513246,311.846671 370.4375,302.867188 L372.515625,301.476562 C387.936662,266.190128 352.052706,234.955091 328.25,269.800781 C322.336272,278.458113 340.249653,294.392337 330.753906,301.621094 C326.91332,304.544788 294.058884,308.199097 286.269531,307.359375 C284.995803,307.222062 284.102217,305.584758 283.921875,304.316406 C282.389249,293.537418 285.731973,295.96395 292.257812,288.046875 C311.385715,264.841117 307.46635,267.289874 346.21875,270.695312 C348.526208,270.898085 351.084913,271.703414 352.59375,273.460938 C354.971579,276.230679 354.398541,281.016656 357.144531,283.421875 C361.463282,287.20468 369.172641,295.592094 372.613281,290.996094 C396.717804,258.797319 361.228307,257.906354 349.429687,268.339844 C338.784302,277.753531 347.977468,308.238322 342.097656,310.683594 C334.379679,313.893313 325.61253,313.607482 317.28125,314.285156 C310.815625,314.811077 304.233838,315.258597 297.820312,314.285156 C296.449037,314.077025 295.446155,312.335074 295.328125,310.953125 C294.594926,302.368493 293.381654,293.498605 295.328125,285.105469 C302.241349,255.29581 326.590452,265.047417 334.488281,291.011719 C336.03704,296.103302 335.56021,306.996168 340.308594,312.417969 C354.750775,328.908343 356.425475,297.576804 356.195312,291.328125" id="Path-4"></path>
          </g>
      </g>
  </svg>
`

const PATH_SVG_2 = `
  <?xml version="1.0" encoding="UTF-8"?>
  <svg width="777px" height="111px" viewBox="0 0 99 69" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <!-- Generator: sketchtool 46.2 (44496) - http://www.bohemiancoding.com/sketch -->
      <title>PathPen</title>
      <desc>Created with sketchtool.</desc>
      <defs>
        <foobar id="abc123"></foobar>
      </defs>
      <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
          <g foobar="url(#abc123)" id="Artboard" transform="translate(-200.000000, -500.000000)" stroke="#AAAAAA">
              <path d="M300.000001,260.753906 C282.404105,283.559532 310.725273,290.63691 326.835937,295.734375 C331.617305,297.247215 342.059558,301.595875 338.316406,309.21875 C337.259516,311.371092 335.344104,313.379399 333.070312,314.140625 C316.687518,319.6253 318.607648,314.107756 316.175781,298.535156 C314.073483,285.072967 341.353724,262.381072 307.847656,273.160156 C302.953426,274.734657 299.363413,279.037222 295.621094,282.5625 C294.703984,283.426421 289.762583,289.749326 292.835937,292.191406 C310.800174,306.465746 310.629063,293.466831 327.605469,293.117188 C340.400227,292.853669 361.733615,282.532042 364.140625,298.585938 C364.591437,301.592694 366.227007,305.49551 364.140625,307.707031 C356.643614,315.653704 320.800977,318.428842 316.511719,304 C313.310899,293.23261 309.646651,279.191944 316.511719,270.300781 L317.605469,266.996094 C318.70025,265.578208 319.962133,263.856288 321.726562,263.546875 C348.187608,258.906626 333.406544,260.284286 342.546875,271.855469 C345.091836,275.077257 351.639186,275.674796 351.988281,279.765625 L354.464844,283.632812 C357.416932,318.226499 296.30014,340.100228 293.25,300.105469 C292.638094,292.081893 291.431499,283.803546 293.25,275.964844 C294.715721,269.646813 297.246721,262.379048 302.785156,259.003906 C320.414927,248.260262 322.400502,263.451084 330.808594,271.378906 C333.565871,273.978688 339.302903,273.7221 340.503906,277.316406 C343.115394,285.131945 334.783267,296.681412 341.050781,302.03125 C348.504241,308.39339 366.513246,311.846671 370.4375,302.867188 L372.515625,301.476562 C387.936662,266.190128 352.052706,234.955091 328.25,269.800781 C322.336272,278.458113 340.249653,294.392337 330.753906,301.621094 C326.91332,304.544788 294.058884,308.199097 286.269531,307.359375 C284.995803,307.222062 284.102217,305.584758 283.921875,304.316406 C282.389249,293.537418 285.731973,295.96395 292.257812,288.046875 C311.385715,264.841117 307.46635,267.289874 346.21875,270.695312 C348.526208,270.898085 351.084913,271.703414 352.59375,273.460938 C354.971579,276.230679 354.398541,281.016656 357.144531,283.421875 C361.463282,287.20468 369.172641,295.592094 372.613281,290.996094 C396.717804,258.797319 361.228307,257.906354 349.429687,268.339844 C338.784302,277.753531 347.977468,308.238322 342.097656,310.683594 C334.379679,313.893313 325.61253,313.607482 317.28125,314.285156 C310.815625,314.811077 304.233838,315.258597 297.820312,314.285156 C296.449037,314.077025 295.446155,312.335074 295.328125,310.953125 C294.594926,302.368493 293.381654,293.498605 295.328125,285.105469 C302.241349,255.29581 326.590452,265.047417 334.488281,291.011719 C336.03704,296.103302 335.56021,306.996168 340.308594,312.417969 C354.750775,328.908343 356.425475,297.576804 356.195312,291.328125" id="Path-4"></path>
          </g>
      </g>
  </svg>
`

const PATH_SVG_3 = `
  <?xml version="1.0" encoding="UTF-8"?>
  <svg width="68px" height="89px" viewBox="0 0 68 89" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <!-- Generator: sketchtool 47.1 (45422) - http://www.bohemiancoding.com/sketch -->
      <title>Path 4</title>
      <desc>Created with sketchtool.</desc>
      <defs></defs>
      <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
          <path d="M17.5653834,3.24972415 C8.78389065,8.63238435 1.15496876,16.867694 20.7239544,24.5300652 C26.9448788,26.965911 36.76719,18.3562061 40.7500129,23.7200077 L44.6500477,25.5459034 C45.3309428,26.4628877 45.2634552,28.0088797 44.6500477,28.972316 C40.283801,35.8300754 36.7692766,43.9422339 30.0363492,48.4986212 C3.94577219,66.1549492 0.849351892,3.9426716 3.58535894,68.9917693 C3.62002238,69.8158993 4.34989854,70.8001994 5.16954396,70.8927913 C10.2187973,71.4631845 15.5113964,72.2300336 20.4136501,70.8927913 C28.6541842,68.6449293 37.6053859,66.2696073 43.774663,60.3620439 C45.8662922,58.3591461 40.9520483,55.2350407 38.9698462,53.1237882 C33.5723273,47.3748662 29.5781845,37.84985 21.7495917,36.9030402 L17.5817152,35.2600606 C14.4654507,34.8831717 11.1402095,36.2600956 8.16479687,35.2600606 C-9.62704708,29.2802293 10.6327249,17.7007378 18.3329782,16.553612 C31.2729233,14.6259162 44.4263319,12.9706265 57.4835796,13.7870043 C60.0375498,13.9466861 61.6631672,17.0364793 62.791416,19.3332851 C71.3885276,36.8346515 68.6320193,65.946643 43.7550649,67.2671308 C36.7209402,67.6405075 28.1558195,61.13799 22.6903036,65.5816886 C17.5802963,69.7363434 20.9179086,78.7534312 21.5666755,85.3072418 C21.698505,86.6389764 23.5484756,87.3731718 24.8689663,87.5904281 C58.1282882,93.0624832 24.1319409,61.5570061 21.4196893,47.600372 C19.9891261,40.2390173 19.2998726,32.5854165 20.1752058,25.1376083 C23.1677916,-0.324932459 33.2960952,10.7898797 20.3548556,0.502714662 L17.5653834,3.24972415 Z" id="Path-4" stroke="#979797" fill="#FF0000"></path>
      </g>
  </svg>
`

const PATH_SVG_4 = `
  <?xml version="1.0" encoding="UTF-8"?>
  <svg width="48px" height="49px" viewBox="0 0 58 59" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <!-- Generator: sketchtool 47.1 (45422) - http://www.bohemiancoding.com/sketch -->
      <title>Path 4</title>
      <desc>Created with sketchtool.</desc>
      <defs></defs>
      <g id="Page-1" stroke="none" stroke-width="2" fill="none" fill-rule="evenodd">
          <path d="M17.5653834,3.24972415 C8.78389065,8.63238435 22.2222,16.867694 20.7239544,24.5300652 C26.9448788,26.965911 36.76719,18.3562061 40.7500129,23.7200077 L44.6500477,25.5459034 C45.3309428,26.4628877 45.2634552,28.0088797 44.6500477,28.972316 C40.283801,35.8300754 36.7692766,43.9422339 30.0363492,48.4986212 C3.94577219,66.1549492 0.849351892,3.9426716 3.58535894,68.9917693 C3.62002238,69.8158993 4.34989854,70.8001994 5.16954396,70.8927913 C10.2187973,71.4631845 15.5113964,72.2300336 20.4136501,70.8927913 C28.6541842,68.6449293 37.6053859,66.2696073 43.774663,60.3620439 C45.8662922,58.3591461 40.9520483,55.2350407 38.9698462,53.1237882 C33.5723273,47.3748662 29.5781845,37.84985 21.7495917,36.9030402 L17.5817152,35.2600606 C14.4654507,34.8831717 11.1402095,36.2600956 8.16479687,35.2600606 C-9.62704708,29.2802293 10.6327249,17.7007378 18.3329782,16.553612 C31.2729233,14.6259162 44.4263319,12.9706265 57.4835796,13.7870043 C60.0375498,13.9466861 61.6631672,17.0364793 62.791416,19.3332851 C71.3885276,36.8346515 68.6320193,65.946643 43.7550649,67.2671308 C36.7209402,67.6405075 28.1558195,61.13799 22.6903036,65.5816886 C17.5802963,69.7363434 20.9179086,78.7534312 21.5666755,85.3072418 C21.698505,86.6389764 23.5484756,87.3731718 24.8689663,87.5904281 C58.1282882,93.0624832 24.1319409,61.5570061 21.4196893,47.600372 C19.9891261,40.2390173 19.2998726,32.5854165 20.1752058,25.1376083 C23.1677916,-0.324932459 33.2960952,10.7898797 20.3548556,0.502714662 L17.5653834,3.24972415 Z" id="Path-4" stroke="#ABABAB" fill="#DDEEEE"></path>
      </g>
  </svg>
`

const RECT_SVG_1 = `
  <?xml version="1.0" encoding="UTF-8"?>
  <svg width="79px" height="79px" viewBox="0 0 79 79" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <!-- Generator: sketchtool 47.1 (45422) - http://www.bohemiancoding.com/sketch -->
      <title>Rectangle</title>
      <desc>Created with sketchtool.</desc>
      <defs>
          <rect id="path-1" x="0" y="0" width="79" height="79"></rect>
      </defs>
      <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
          <g id="Rectangle">
              <use fill="#420000" fill-rule="evenodd" xlink:href="#path-1"></use>
              <rect stroke="#9200FF" stroke-width="16" x="8" y="8" width="63" height="63"></rect>
          </g>
      </g>
  </svg>
`

const CIRCLE_SVG_1 = `
<?xml version="1.0" encoding="UTF-8"?>
<svg width="41px" height="41px" viewBox="0 0 41 41" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <!-- Generator: sketchtool 47.1 (45422) - http://www.bohemiancoding.com/sketch -->
    <title>Circle</title>
    <desc>Created with sketchtool.</desc>
    <defs>
        <linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="linearGradient-1">
            <stop stop-color="#EEEEEE" offset="0%"></stop>
            <stop stop-color="#D8D8D8" offset="100%"></stop>
        </linearGradient>
        <linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="linearGradient-2">
            <stop stop-color="#C8C8C8" offset="0%"></stop>
            <stop stop-color="#979797" offset="100%"></stop>
        </linearGradient>
        <circle id="path-3" cx="20.5" cy="20.5" r="19.5"></circle>
        <filter x="-1.3%" y="-1.3%" width="102.6%" height="102.6%" filterUnits="objectBoundingBox" id="filter-4">
            <feMorphology radius="0.5" operator="dilate" in="SourceAlpha" result="shadowSpreadOuter1"></feMorphology>
            <feOffset dx="0" dy="0" in="shadowSpreadOuter1" result="shadowOffsetOuter1"></feOffset>
            <feComposite in="shadowOffsetOuter1" in2="SourceAlpha" operator="out" result="shadowOffsetOuter1"></feComposite>
            <feColorMatrix values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.5 0" type="matrix" in="shadowOffsetOuter1"></feColorMatrix>
        </filter>
        <filter x="-1.3%" y="-1.3%" width="102.6%" height="102.6%" filterUnits="objectBoundingBox" id="filter-5">
            <feOffset dx="0" dy="0" in="SourceAlpha" result="shadowOffsetInner1"></feOffset>
            <feComposite in="shadowOffsetInner1" in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" result="shadowInnerInner1"></feComposite>
            <feColorMatrix values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.5 0" type="matrix" in="shadowInnerInner1"></feColorMatrix>
        </filter>
    </defs>
    <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="Circle">
            <use fill="black" fill-opacity="1" filter="url(#filter-4)" xlink:href="#path-3"></use>
            <use fill="url(#linearGradient-1)" fill-rule="evenodd" xlink:href="#path-3"></use>
            <use fill="black" fill-opacity="1" filter="url(#filter-5)" xlink:href="#path-3"></use>
            <use stroke="url(#linearGradient-2)" stroke-width="1" xlink:href="#path-3"></use>
        </g>
    </g>
</svg>
`

const CIRCLE_SVG_2 = `
<?xml version="1.0" encoding="UTF-8"?>
<svg width="41px" height="41px" viewBox="0 0 41 41" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <!-- Generator: sketchtool 47.1 (45422) - http://www.bohemiancoding.com/sketch -->
    <title>Circle</title>
    <desc>Created with sketchtool.</desc>
    <defs>
        <linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="linearGradient-1">
            <stop stop-color="#D13434" offset="0%"></stop>
            <stop stop-color="#D8D8D8" offset="100%"></stop>
        </linearGradient>
        <linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="linearGradient-2">
            <stop stop-color="#4F78EC" offset="0%"></stop>
            <stop stop-color="#979797" offset="100%"></stop>
        </linearGradient>
        <circle id="path-3" cx="20.5" cy="20.5" r="19.5"></circle>
        <filter x="-5.1%" y="-5.1%" width="117.9%" height="110.3%" filterUnits="objectBoundingBox" id="filter-4">
            <feMorphology radius="0.5" operator="dilate" in="SourceAlpha" result="shadowSpreadOuter1"></feMorphology>
            <feOffset dx="3" dy="0" in="shadowSpreadOuter1" result="shadowOffsetOuter1"></feOffset>
            <feComposite in="shadowOffsetOuter1" in2="SourceAlpha" operator="out" result="shadowOffsetOuter1"></feComposite>
            <feColorMatrix values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.5 0" type="matrix" in="shadowOffsetOuter1"></feColorMatrix>
        </filter>
        <filter x="-3.8%" y="-3.8%" width="115.4%" height="107.7%" filterUnits="objectBoundingBox" id="filter-5">
            <feOffset dx="-2" dy="0" in="SourceAlpha" result="shadowOffsetInner1"></feOffset>
            <feComposite in="shadowOffsetInner1" in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" result="shadowInnerInner1"></feComposite>
            <feColorMatrix values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.5 0" type="matrix" in="shadowInnerInner1"></feColorMatrix>
        </filter>
    </defs>
    <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="Circle">
            <use fill="black" fill-opacity="1" filter="url(#filter-4)" xlink:href="#path-3"></use>
            <use fill="url(#linearGradient-1)" fill-rule="evenodd" xlink:href="#path-3"></use>
            <use fill="black" fill-opacity="1" filter="url(#filter-5)" xlink:href="#path-3"></use>
            <use stroke="url(#linearGradient-2)" stroke-width="1" xlink:href="#path-3"></use>
        </g>
    </g>
</svg>
`

const PERCY_NOSE_1 = `
<?xml version="1.0" encoding="UTF-8"?>
<svg width="42px" height="28px" viewBox="0 0 42 28" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <!-- Generator: sketchtool 46.2 (44496) - http://www.bohemiancoding.com/sketch -->
    <title>nose</title>
    <desc>Created with sketchtool.</desc>
    <defs></defs>
    <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="Screen-3" transform="translate(-35.000000, -253.000000)">
            <g id="percy" transform="translate(35.000000, 181.000000)">
                <g id="nose" transform="translate(0.000000, 72.378378)">
                    <rect id="Rectangle-2" fill="#FFFFFF" x="0" y="0" width="41.3401361" height="26.7027027" rx="13.3513514"></rect>
                    <path d="M41.3401361,13.3513514 L41.3401361,13.3513514 L41.3401361,13.3513514 C41.3401361,20.7250991 35.3625324,26.7027027 27.9887847,26.7027027 L24.1967592,26.7027027 C26.8633644,22.1984406 28.1966671,17.7479901 28.1966671,13.3513514 C28.1966671,8.95471259 26.8633644,4.50426213 24.1967592,-8.41863632e-15 L27.9887847,-2.82210434e-14 L27.9887847,-2.66453526e-14 C35.3625324,-6.72951098e-14 41.3401361,5.97760361 41.3401361,13.3513514 Z" id="Rectangle-2-Copy" fill="#FEDFE6"></path>
                    <rect id="Rectangle-2-Copy-2" stroke="#FF5E87" stroke-width="3.5" x="1.75" y="1.75" width="37.8401361" height="23.2027027" rx="11.6013514"></rect>
                    <ellipse id="Oval-4" fill="#FF5E87" cx="10.8605442" cy="13.7027027" rx="3.15306122" ry="3.16216216"></ellipse>
                    <ellipse id="Oval-4-Copy" fill="#FF5E87" cx="24.8741497" cy="13.7027027" rx="3.15306122" ry="3.16216216"></ellipse>
                </g>
            </g>
        </g>
    </g>
</svg>
`

const PERCY_NOSE_2 = `
<?xml version="1.0" encoding="UTF-8"?>
<svg width="42px" height="28px" viewBox="0 0 42 28" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <!-- Generator: sketchtool 46.2 (44496) - http://www.bohemiancoding.com/sketch -->
    <title>nose</title>
    <desc>Created with sketchtool.</desc>
    <defs></defs>
    <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="Screen-3" transform="translate(-35.000000, -253.000000)">
            <g id="percy" transform="translate(35.000000, 181.000000)">
                <g id="nose" transform="translate(0.000000, 72.378378)">
                    <rect id="Rectangle-2" fill="#FFFFFF" x="0" y="0" width="41.3401361" height="26.7027027" rx="13.3513514"></rect>
                    <path d="M41.3401361,13.3513514 L41.3401361,13.3513514 L41.3401361,13.3513514 C41.3401361,20.7250991 35.3625324,26.7027027 27.9887847,26.7027027 L24.1967592,26.7027027 C26.8633644,22.1984406 28.1966671,17.7479901 28.1966671,13.3513514 C28.1966671,8.95471259 26.8633644,4.50426213 24.1967592,-8.41863632e-15 L27.9887847,-2.82210434e-14 L27.9887847,-2.66453526e-14 C35.3625324,-6.72951098e-14 41.3401361,5.97760361 41.3401361,13.3513514 Z" id="Rectangle-2-Copy" fill="#FEDFE6"></path>
                    <rect id="Rectangle-2-Copy-2" stroke="#FF5E87" stroke-width="3.5" x="1.75" y="1.75" width="37.8401361" height="23.2027027" rx="11.6013514"></rect>
                    <ellipse id="Oval-4" fill="#000000" cx="10.8605442" cy="13.7027027" rx="3.15306122" ry="3.16216216"></ellipse>
                    <ellipse id="Oval-4-Copy" fill="#000000" cx="24.8741497" cy="13.7027027" rx="3.15306122" ry="3.16216216"></ellipse>
                </g>
            </g>
        </g>
    </g>
</svg>
`

const OVAL_UNO = `
<svg width="122px" height="122px" viewBox="0 0 122 122">
    <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <circle id="Oval" fill="#D8D8D8" cx="61" cy="61" r="61"></circle>
    </g>
</svg>
`

const OVAL_DOS = `
<svg width="115px" height="115px" viewBox="0 0 115 115">
    <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="Tutorial" transform="translate(-189.000000, -622.000000)">
            <ellipse id="Oval" fill="#57787E" cx="239.5" cy="690.5" rx="57.5" ry="40.5"></ellipse>
        </g>
    </g>
</svg>
`

const OVAL_TRES = `
<svg width="122px" height="122px" viewBox="0 0 122 122">
    <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <circle id="Oval" fill="black" cx="61" cy="61" r="61"></circle>
    </g>
</svg>
`
