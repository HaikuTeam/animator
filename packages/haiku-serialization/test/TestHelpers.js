var fse = require('haiku-fs-extra')
var path = require('path')
var File = require('./../src/bll/File')()
var ActiveComponent = require('./../src/bll/ActiveComponent')
var File = require('./../src/bll/File')

function createBasicProject (options, cb) {
  var folder = path.join(__dirname, 'fixtures', 'projects', options.name || 'test')

  fse.mkdirpSync(folder)

  fse.outputFileSync(path.join(folder, 'code', 'main', 'code.js'), `
    module.exports = {
      states: {},
      eventHandlers: {},
      timelines: {
        Default: {
          "haiku:abcdefghijk": {
            "sizeAbsolute.x": { "0": { value: 550 } },
            "sizeAbsolute.y": { "0": { value: 400 } },
            "long.prop": { "0": "${makeLongString(options.biggie || 11)}" }
          },
        }
      },
      template: {
        elementName: "div",
        attributes: { "haiku-title": "Primitives", "haiku-id": "abcdefghijk" },
        children: []
      }
    }
  `)

  fse.outputFileSync(path.join(folder, 'code', 'main', 'dom.js'), `
    module.exports = function(){}
  `)

  var config = {}

  var component = new ActiveComponent({
    alias: 'master',
    folder: folder,
    userconfig: config,
    websocket: {/* websocket */},
    platform: {/* window */},
    file: {
      doShallowWorkOnly: false,
      skipDiffLogging: !options.diff
    }
  })

  function teardown () {
    console.log('[test] teardown called in', folder)
    setTimeout(() => { // Wait for race that may be present for commit content state
      console.log('[test] teardown running in', folder)
      fse.remove(folder)
    }, 1000)
  }

  return File.ingestFromFolder(folder, {}, (err) => {
    if (err) throw err
    var bytecode = ActiveComponent.fetchActiveBytecodeFile()
    return cb(component, bytecode, File, folder, config, teardown)
  })
}

function makeLongString (iterations) {
  var x = '1234567890'
  for (var i = 0; i < iterations; i++) {
    x += (x + x)
  }
  return x
}

function randomIntFromInterval (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

module.exports = {
  createBasicProject: createBasicProject,
  randomIntFromInterval: randomIntFromInterval,
  makeLongString: makeLongString
}
