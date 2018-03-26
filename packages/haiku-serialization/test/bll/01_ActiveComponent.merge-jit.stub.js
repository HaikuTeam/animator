const tape = require('tape')
const path = require('path')
const fse = require('haiku-fs-extra')

const Project = require('./../../src/bll/Project')
const File = require('./../../src/bll/File')
const Element = require('./../../src/bll/Element')

const waitUntilFileProbablyWroteToDisk = (fn) => {
  return setTimeout(fn, 2000) // Disk writes happen on a 500ms interval
}

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
      return ac0.instantiateComponent('designs/Oval.svg', {}, {from: 'test'}, (err, mana) => {
        if (err) throw err
        return ac0.selectElement(mana.attributes['haiku-id'], {from: 'test'}, (err) => {
          if (err) throw err
          // Verifying that explicit changes to deep elements are retained and stale entities cleared
          const m1 = ac0.getElements()[1].getJITPropertyOptionsAsMenuItems()
          t.equal(JSON.stringify(ac0.getDisplayableRows().map((r) => r.getUniqueKey())), '["e4a9e4d8baa7+e4a9e4d8baa7-element-heading-null-null","e4a9e4d8baa7+e4a9e4d8baa7-cluster-heading-Size-null","e4a9e4d8baa7+e4a9e4d8baa7-property-null-opacity","e4a9e4d8baa7+e4a9e4d8baa7-cluster-heading-Style-null","fcfa0ce997b3+fcfa0ce997b3-element-heading-null-null","fcfa0ce997b3+fcfa0ce997b3-property-null-opacity","fcfa0ce997b3+fcfa0ce997b3-cluster-heading-Position-null","fcfa0ce997b3+fcfa0ce997b3-cluster-heading-Rotation-null","fcfa0ce997b3+fcfa0ce997b3-cluster-heading-Scale-null"]', 'rows ok 1')
          m1[4].submenu[0].submenu[0].onClick() // Click the 'Stroke' property
          return setTimeout(() => {
            t.equal(JSON.stringify(ac0.getDisplayableRows().map((r) => r.getUniqueKey())), '["e4a9e4d8baa7+e4a9e4d8baa7-element-heading-null-null","e4a9e4d8baa7+e4a9e4d8baa7-cluster-heading-Size-null","e4a9e4d8baa7+e4a9e4d8baa7-property-null-opacity","e4a9e4d8baa7+e4a9e4d8baa7-cluster-heading-Style-null","fcfa0ce997b3+fcfa0ce997b3-element-heading-null-null","fcfa0ce997b3+fcfa0ce997b3-property-null-opacity","fcfa0ce997b3+fcfa0ce997b3-cluster-heading-Position-null","fcfa0ce997b3+fcfa0ce997b3-cluster-heading-Rotation-null","fcfa0ce997b3+fcfa0ce997b3-cluster-heading-Scale-null","88c011ac942e+fcfa0ce997b3-property-null-stroke"]', 'rows ok 2')
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
                    t.equal(JSON.stringify(ac0.getDisplayableRows().map((r) => r.getUniqueKey())), '["e4a9e4d8baa7+e4a9e4d8baa7-element-heading-null-null","e4a9e4d8baa7+e4a9e4d8baa7-cluster-heading-Size-null","e4a9e4d8baa7+e4a9e4d8baa7-property-null-opacity","e4a9e4d8baa7+e4a9e4d8baa7-cluster-heading-Style-null","fcfa0ce997b3+fcfa0ce997b3-element-heading-null-null","fcfa0ce997b3+fcfa0ce997b3-property-null-opacity","fcfa0ce997b3+fcfa0ce997b3-cluster-heading-Position-null","fcfa0ce997b3+fcfa0ce997b3-cluster-heading-Rotation-null","fcfa0ce997b3+fcfa0ce997b3-cluster-heading-Scale-null"]', 'rows ok 3')
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
      return ac0.instantiateComponent('designs/Oval.svg', {}, { from: 'test' }, (err, mana) => {
        if (err) throw err
        return ac0.selectElement(mana.attributes['haiku-id'], {from: 'test'}, (err) => {
          if (err) throw err
          // Verifying that explicit changes to deep elements are retained and stale entities cleared
          const m1 = ac0.getElements()[1].getJITPropertyOptionsAsMenuItems()
          t.equal(JSON.stringify(ac0.getDisplayableRows().map((r) => r.getUniqueKey())), '["e4a9e4d8baa7+e4a9e4d8baa7-element-heading-null-null","e4a9e4d8baa7+e4a9e4d8baa7-cluster-heading-Size-null","e4a9e4d8baa7+e4a9e4d8baa7-property-null-opacity","e4a9e4d8baa7+e4a9e4d8baa7-cluster-heading-Style-null","fcfa0ce997b3+fcfa0ce997b3-element-heading-null-null","fcfa0ce997b3+fcfa0ce997b3-property-null-opacity","fcfa0ce997b3+fcfa0ce997b3-cluster-heading-Position-null","fcfa0ce997b3+fcfa0ce997b3-cluster-heading-Rotation-null","fcfa0ce997b3+fcfa0ce997b3-cluster-heading-Scale-null"]', 'rows ok 1')
          m1[4].submenu[0].submenu[0].onClick() // Click the 'Stroke' property
          return setTimeout(() => {
            t.equal(JSON.stringify(ac0.getDisplayableRows().map((r) => r.getUniqueKey())), '["e4a9e4d8baa7+e4a9e4d8baa7-element-heading-null-null","e4a9e4d8baa7+e4a9e4d8baa7-cluster-heading-Size-null","e4a9e4d8baa7+e4a9e4d8baa7-property-null-opacity","e4a9e4d8baa7+e4a9e4d8baa7-cluster-heading-Style-null","fcfa0ce997b3+fcfa0ce997b3-element-heading-null-null","fcfa0ce997b3+fcfa0ce997b3-property-null-opacity","fcfa0ce997b3+fcfa0ce997b3-cluster-heading-Position-null","fcfa0ce997b3+fcfa0ce997b3-cluster-heading-Rotation-null","fcfa0ce997b3+fcfa0ce997b3-cluster-heading-Scale-null","88c011ac942e+fcfa0ce997b3-property-null-stroke"]', 'rows ok 2')
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
                    t.equal(JSON.stringify(ac0.getDisplayableRows().map((r) => r.getUniqueKey())), '["e4a9e4d8baa7+e4a9e4d8baa7-element-heading-null-null","e4a9e4d8baa7+e4a9e4d8baa7-cluster-heading-Size-null","e4a9e4d8baa7+e4a9e4d8baa7-property-null-opacity","e4a9e4d8baa7+e4a9e4d8baa7-cluster-heading-Style-null","fcfa0ce997b3+fcfa0ce997b3-element-heading-null-null","fcfa0ce997b3+fcfa0ce997b3-property-null-opacity","fcfa0ce997b3+fcfa0ce997b3-cluster-heading-Position-null","fcfa0ce997b3+fcfa0ce997b3-cluster-heading-Rotation-null","fcfa0ce997b3+fcfa0ce997b3-cluster-heading-Scale-null","ed6c8148557c+fcfa0ce997b3-property-null-stroke"]', 'rows ok 3')
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
})

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
