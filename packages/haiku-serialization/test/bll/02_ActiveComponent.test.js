const tape = require('tape')
const path = require('path')
const fse = require('haiku-fs-extra')
const Project = require('./../../src/bll/Project')
const File = require('./../../src/bll/File')
const Element = require('./../../src/bll/Element')

tape('ActiveComponent.prototype.instantiateComponent[1](design)', (t) => {
  t.plan(9)
  const folder = path.join(__dirname, '..', 'fixtures', 'projects', 'instantiate-01')
  fse.removeSync(folder)
  const websocket = { on: () => {}, send: () => {}, action: () => {}, connect: () => {} }
  const platform = {}
  const userconfig = {}
  const fileOptions = { doShallowWorkOnly: false, skipDiffLogging: true }
  const envoyOptions = { mock: true }
  return Project.setup(folder, 'test', websocket, platform, userconfig, fileOptions, envoyOptions, (err, project) => {
    return project.setCurrentActiveComponent('main', { from: 'test' }, (err) => {
      if (err) throw err
      fse.outputFileSync(path.join(folder, 'designs/Path.svg'), PATH_SVG_1)
      const ac0 = project.getCurrentActiveComponent()
      t.ok(ac0, 'ac present')
      return ac0.instantiateComponent('designs/Path.svg', {}, { from: 'test' }, (err, info, mana) => {
        t.error(err, 'no err upon instantiation')
        t.equal(info.center.x, 0, 'info center is returned')
        t.equal(mana.attributes.source, 'designs/Path.svg', 'rel source is in mana attribute')
        const timeline = ac0.getReifiedBytecode().timelines.Default['haiku:' + mana.attributes['haiku-id']]
        t.deepEqual(timeline, { 
          viewBox: { '0': { value: '0 0 99 69' } },
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
        t.equal(subtemplate.attributes['haiku-id'], mana.attributes['haiku-id'], 'template id ok')
        return File.read(folder, ac0.fetchActiveBytecodeFile().relpath, (err, contents) => {
          t.error(err, 'no err fetching code')
          t.equal(contents.length, 5952, 'checksum of file ok')
          fse.removeSync(folder)
          t.ok(true)
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
  const fileOptions = { doShallowWorkOnly: false, skipDiffLogging: true }
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
          t.equal(lines[0],'var Haiku = require("@haiku/player");','haiku require is in place')
          return ac0.deleteComponent(mana.attributes['haiku-id'], { from: 'test' }, (err) => {
            t.error(err, 'no err deleting')
            t.equal(ac0.getReifiedBytecode().template.children.length,0,'correct number of children')
            return File.read(folder, ac0.fetchActiveBytecodeFile().relpath, (err, contents) => {
              t.error(err, 'no err reading file after del')
              const lines = contents.split('\n')
              t.equal(lines[0],'var Haiku = require("@haiku/player");','haiku require is in place at line 0')
              fse.removeSync(folder)
              t.ok(true)
            })
          })
        })
      })
    })
  })
})

tape('ActiveComponent.prototype.mergeDesign[1](design)', (t) => {
  t.plan(10)
  const folder = path.join(__dirname, '..', 'fixtures', 'projects', 'merge-01')
  fse.removeSync(folder)
  const websocket = { on: () => {}, send: () => {}, action: () => {}, connect: () => {} }
  const platform = {}
  const userconfig = {}
  const fileOptions = { doShallowWorkOnly: false, skipDiffLogging: true }
  const envoyOptions = { mock: true }
  return Project.setup(folder, 'test', websocket, platform, userconfig, fileOptions, envoyOptions, (err, project) => {
    return project.setCurrentActiveComponent('main', { from: 'test' }, (err) => {
      if (err) throw err
      fse.outputFileSync(path.join(folder, 'designs/Path.svg'), PATH_SVG_1)
      const ac0 = project.getCurrentActiveComponent()
      return ac0.instantiateComponent('designs/Path.svg', {}, { from: 'test' }, (err, info, mana) => {
        if (err) throw err
        return File.read(folder, ac0.fetchActiveBytecodeFile().relpath, (err, contents1) => {
          if (err) throw err
          t.ok(contents1)
          fse.outputFileSync(path.join(folder, 'designs/Path.svg'), PATH_SVG_2) // Other one
          return ac0.mergeDesigns({ 'designs/Path.svg': true }, { from: 'test' }, (err) => {
            if (err) throw err
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
              t.deepEqual(diffs[0],[ '        "sizeAbsolute.x": { "0": { value: 99 } },', '        "sizeAbsolute.x": { "0": { value: 777 } },' ],'diff ok')
              t.deepEqual(diffs[1],[ '        "sizeAbsolute.y": { "0": { value: 69 } },', '        "sizeAbsolute.y": { "0": { value: 111 } },' ],'diff ok')
              t.deepEqual(diffs[2],[ '        foobar: { "0": { value: "url(#abc123-0d1946)" } },', '        foobar: { "0": { value: "url(#abc123-d9e034)" } },' ],'diff ok')
              t.deepEqual(diffs[3],[ '        stroke: { "0": { value: "#979797" } },', '        stroke: { "0": { value: "#AAAAAA" } },' ],'diff ok')
              t.deepEqual(diffs[4],[ '        "translation.x": { "0": { value: -283 } },', '        "translation.x": { "0": { value: -200 } },' ],'diff ok')
              t.deepEqual(diffs[5],[ '        "translation.y": { "0": { value: -254 } }', '        "translation.y": { "0": { value: -500 } }' ],'diff ok')
              t.deepEqual(diffs[6],[ '            value: "M294.851562,260.753906 C282.404105,283.559532 310.725273,290.63691 326.835937,295.734375 C331.617305,297.247215 342.059558,301.595875 338.316406,309.21875 C337.259516,311.371092 335.344104,313.379399 333.070312,314.140625 C316.687518,319.6253 318.607648,314.107756 316.175781,298.535156 C314.073483,285.072967 341.353724,262.381072 307.847656,273.160156 C302.953426,274.734657 299.363413,279.037222 295.621094,282.5625 C294.703984,283.426421 289.762583,289.749326 292.835937,292.191406 C310.800174,306.465746 310.629063,293.466831 327.605469,293.117188 C340.400227,292.853669 361.733615,282.532042 364.140625,298.585938 C364.591437,301.592694 366.227007,305.49551 364.140625,307.707031 C356.643614,315.653704 320.800977,318.428842 316.511719,304 C313.310899,293.23261 309.646651,279.191944 316.511719,270.300781 L317.605469,266.996094 C318.70025,265.578208 319.962133,263.856288 321.726562,263.546875 C348.187608,258.906626 333.406544,260.284286 342.546875,271.855469 C345.091836,275.077257 351.639186,275.674796 351.988281,279.765625 L354.464844,283.632812 C357.416932,318.226499 296.30014,340.100228 293.25,300.105469 C292.638094,292.081893 291.431499,283.803546 293.25,275.964844 C294.715721,269.646813 297.246721,262.379048 302.785156,259.003906 C320.414927,248.260262 322.400502,263.451084 330.808594,271.378906 C333.565871,273.978688 339.302903,273.7221 340.503906,277.316406 C343.115394,285.131945 334.783267,296.681412 341.050781,302.03125 C348.504241,308.39339 366.513246,311.846671 370.4375,302.867188 L372.515625,301.476562 C387.936662,266.190128 352.052706,234.955091 328.25,269.800781 C322.336272,278.458113 340.249653,294.392337 330.753906,301.621094 C326.91332,304.544788 294.058884,308.199097 286.269531,307.359375 C284.995803,307.222062 284.102217,305.584758 283.921875,304.316406 C282.389249,293.537418 285.731973,295.96395 292.257812,288.046875 C311.385715,264.841117 307.46635,267.289874 346.21875,270.695312 C348.526208,270.898085 351.084913,271.703414 352.59375,273.460938 C354.971579,276.230679 354.398541,281.016656 357.144531,283.421875 C361.463282,287.20468 369.172641,295.592094 372.613281,290.996094 C396.717804,258.797319 361.228307,257.906354 349.429687,268.339844 C338.784302,277.753531 347.977468,308.238322 342.097656,310.683594 C334.379679,313.893313 325.61253,313.607482 317.28125,314.285156 C310.815625,314.811077 304.233838,315.258597 297.820312,314.285156 C296.449037,314.077025 295.446155,312.335074 295.328125,310.953125 C294.594926,302.368493 293.381654,293.498605 295.328125,285.105469 C302.241349,255.29581 326.590452,265.047417 334.488281,291.011719 C336.03704,296.103302 335.56021,306.996168 340.308594,312.417969 C354.750775,328.908343 356.425475,297.576804 356.195312,291.328125"', '            value: "M300.000001,260.753906 C282.404105,283.559532 310.725273,290.63691 326.835937,295.734375 C331.617305,297.247215 342.059558,301.595875 338.316406,309.21875 C337.259516,311.371092 335.344104,313.379399 333.070312,314.140625 C316.687518,319.6253 318.607648,314.107756 316.175781,298.535156 C314.073483,285.072967 341.353724,262.381072 307.847656,273.160156 C302.953426,274.734657 299.363413,279.037222 295.621094,282.5625 C294.703984,283.426421 289.762583,289.749326 292.835937,292.191406 C310.800174,306.465746 310.629063,293.466831 327.605469,293.117188 C340.400227,292.853669 361.733615,282.532042 364.140625,298.585938 C364.591437,301.592694 366.227007,305.49551 364.140625,307.707031 C356.643614,315.653704 320.800977,318.428842 316.511719,304 C313.310899,293.23261 309.646651,279.191944 316.511719,270.300781 L317.605469,266.996094 C318.70025,265.578208 319.962133,263.856288 321.726562,263.546875 C348.187608,258.906626 333.406544,260.284286 342.546875,271.855469 C345.091836,275.077257 351.639186,275.674796 351.988281,279.765625 L354.464844,283.632812 C357.416932,318.226499 296.30014,340.100228 293.25,300.105469 C292.638094,292.081893 291.431499,283.803546 293.25,275.964844 C294.715721,269.646813 297.246721,262.379048 302.785156,259.003906 C320.414927,248.260262 322.400502,263.451084 330.808594,271.378906 C333.565871,273.978688 339.302903,273.7221 340.503906,277.316406 C343.115394,285.131945 334.783267,296.681412 341.050781,302.03125 C348.504241,308.39339 366.513246,311.846671 370.4375,302.867188 L372.515625,301.476562 C387.936662,266.190128 352.052706,234.955091 328.25,269.800781 C322.336272,278.458113 340.249653,294.392337 330.753906,301.621094 C326.91332,304.544788 294.058884,308.199097 286.269531,307.359375 C284.995803,307.222062 284.102217,305.584758 283.921875,304.316406 C282.389249,293.537418 285.731973,295.96395 292.257812,288.046875 C311.385715,264.841117 307.46635,267.289874 346.21875,270.695312 C348.526208,270.898085 351.084913,271.703414 352.59375,273.460938 C354.971579,276.230679 354.398541,281.016656 357.144531,283.421875 C361.463282,287.20468 369.172641,295.592094 372.613281,290.996094 C396.717804,258.797319 361.228307,257.906354 349.429687,268.339844 C338.784302,277.753531 347.977468,308.238322 342.097656,310.683594 C334.379679,313.893313 325.61253,313.607482 317.28125,314.285156 C310.815625,314.811077 304.233838,315.258597 297.820312,314.285156 C296.449037,314.077025 295.446155,312.335074 295.328125,310.953125 C294.594926,302.368493 293.381654,293.498605 295.328125,285.105469 C302.241349,255.29581 326.590452,265.047417 334.488281,291.011719 C336.03704,296.103302 335.56021,306.996168 340.308594,312.417969 C354.750775,328.908343 356.425475,297.576804 356.195312,291.328125"' ],'diff ok')
              fse.removeSync(folder)
              t.ok(true)
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
  const fileOptions = { doShallowWorkOnly: false, skipDiffLogging: true }
  const envoyOptions = { mock: true }
  return Project.setup(folder, 'test', websocket, platform, userconfig, fileOptions, envoyOptions, (err, project) => {
    return project.setCurrentActiveComponent('main', { from: 'test' }, (err) => {
      if (err) throw err
      fse.outputFileSync(path.join(folder, 'designs/Path.svg'), PATH_SVG_1)
      const ac0 = project.getCurrentActiveComponent()
      return project.componentizeDesign('designs/Path.svg', {}, (err, identifier, modpath, bytecode, nil, component) => {
        if (err) throw err
        return File.read(folder, modpath, (err, contents) => {
          if (err) throw err
          t.ok(contents.length,15402,'content checksum ok')
          return ac0.instantiateComponent(modpath, {}, { from: 'test' }, (err, info, mana) => {
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
            t.deepEqual(subtemplate.attributes, { 'haiku-id': '76fc778dc382', 'haiku-title': 'designs_path_svg', source: '../designs_path_svg/code.js' }, 'el attrs ok')
            return File.read(folder, ac0.fetchActiveBytecodeFile().relpath, (err, contents) => {
              if (err) throw err
              t.equal(contents.length, 1676, 'checksum ok')
              var lines = contents.split('\n')
              t.equal(lines[0], 'var Haiku = require("@haiku/player");', 'first line is haiku require')
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

tape('ActiveComponent.prototype.deleteComponent[2](component)', (t) => {
  t.plan(6)
  const folder = path.join(__dirname, '..', 'fixtures', 'projects', 'delete-02')
  fse.removeSync(folder)
  const websocket = { on: () => {}, send: () => {}, action: () => {}, connect: () => {} }
  const platform = {}
  const userconfig = {}
  const fileOptions = { doShallowWorkOnly: false, skipDiffLogging: true }
  const envoyOptions = { mock: true }
  return Project.setup(folder, 'test', websocket, platform, userconfig, fileOptions, envoyOptions, (err, project) => {
    return project.setCurrentActiveComponent('main', { from: 'test' }, (err) => {
      if (err) throw err
      fse.outputFileSync(path.join(folder, 'designs/Path.svg'), PATH_SVG_1)
      const ac0 = project.getCurrentActiveComponent()
      return project.componentizeDesign('designs/Path.svg', {}, (err, identifier, modpath, bytecode, nil, component) => {
        if (err) throw err
        return File.read(folder, modpath, (err, contents) => {
          if (err) throw err
          t.equal(ac0.getReifiedBytecode().template.children.length,0)
          return ac0.instantiateComponent(modpath, {}, { from: 'test' }, (err, info, mana) => {
            if (err) throw err
            return ac0.deleteComponent(mana.attributes['haiku-id'], { from: 'test' }, (err) => {
              if (err) throw err
              t.equal(ac0.getReifiedBytecode().template.children.length,0,'correct number of children')
              return File.read(folder, ac0.fetchActiveBytecodeFile().relpath, (err, contents) => {
                t.error(err, 'no err reading file after del')
                const lines = contents.split('\n')
                t.equal(lines[0],'var Haiku = require("@haiku/player");','haiku require is in place at line 0', 'first line ok')
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

tape('ActiveComponent.prototype.pasteThing[1]', (t) => {
  t.plan(3)
  const folder = path.join(__dirname, '..', 'fixtures', 'projects', 'paste-01')
  fse.removeSync(folder)
  const websocket = { on: () => {}, send: () => {}, action: () => {}, connect: () => {} }
  const platform = {}
  const userconfig = {}
  const fileOptions = { doShallowWorkOnly: false, skipDiffLogging: true }
  const envoyOptions = { mock: true }
  return Project.setup(folder, 'test', websocket, platform, userconfig, fileOptions, envoyOptions, (err, project) => {
    return project.setCurrentActiveComponent('main', { from: 'test' }, (err) => {
      if (err) throw err
      fse.outputFileSync(path.join(folder, 'designs/Path.svg'), PATH_SVG_1)
      const ac0 = project.getCurrentActiveComponent()
      return ac0.instantiateComponent('designs/Path.svg', {}, { from: 'test' }, (err, info, mana) => {
        if (err) throw err
        const el1 = ac0.findElementByComponentId(mana.attributes['haiku-id'])
        const pasteable1 = el1.getClipboardPayload('test')
        return ac0.pasteThing(pasteable1, { x: 100, y: 100 }, { from: 'test' }, (err) => {
          t.error(err, 'no err from paste')
          t.equal(ac0.getReifiedBytecode().template.children[1].attributes['haiku-id'],`${mana.attributes['haiku-id']}-9dabd6`)
          t.ok(ac0.getReifiedBytecode().timelines.Default[`haiku:${mana.attributes['haiku-id']}-9dabd6`])
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
  const fileOptions = { doShallowWorkOnly: false, skipDiffLogging: true }
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
