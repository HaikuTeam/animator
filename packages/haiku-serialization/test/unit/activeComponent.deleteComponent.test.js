// 'use strict'

// var test = require('tape')
// var path = require('path')
// var ActiveComponent = require('./../../src/bll/ActiveComponent')
// var File = require('./../../src/bll/File')

// test('activeComponent.deleteComponent', function (t) {
//   t.plan(3)
//   var ac = new ActiveComponent({
//     alias: 'test',
//     folder: path.join(__dirname, '..', 'fixtures', 'projects', 'james'),
//     userconfig: {},
//     websocket: { send: () => {}, on: () => {} },
//     platform: {},
//     envoy: { mock: true }
//   })
//   ac.fetchActiveBytecodeFile().doShallowWorkOnly = false // We would like to see diffs of the operations during this test
//   File.UPDATE_OPTIONS.shouldUpdateFileSystem = false // Don't clobber the test fixtures
//   ac.mountApplication()
//   aac.on('update', (what) => {
//    if (what === 'application-mounted') {
//     ac.instance._context.clock.GLOBAL_ANIMATION_HARNESS.cancel()
//     var file = ac.fetchActiveBytecodeFile()
//     file.read((err) => { // Reload the full content from the file system, including the ast so we can diff log etc
//       var step = 0;

//       file.on('in-memory-content-state-updated', () => {
//         var updatedContents = ac.fetchActiveBytecodeFile().contents
//         t.equal(updatedContents, EXPECTED_CONTENTS[step])

//         // ugh, there has to be a better way
//         if(step === 0) {
//           ac.deleteComponent(['20d66a8d25de'], { from: 'test' }, () => {})
//           step += 1
//         } else if(step === 1) {
//           ac.deleteComponent(['0dfff0b5e120'], { from: 'test' }, () => {})
//           step += 1
//         }
//       })

//       // add 2 and delete one to check that the require statement isn't broken.
//       ac.instantiateComponent('@haiku/player/components/Path', { x: 0, y: 0 }, { from: 'test' }, () => {})
//       ac.instantiateComponent('@haiku/player/components/Path', { x: 50, y: 50 }, { from: 'test' }, () => {})
//     })
//   })
// })

// var EXPECTED_CONTENTS = [
//   // after both added
//   'var HaikuPath = require("@haiku/player/components/Path/code/main/code");\nmodule.exports = {\n  options: {},\n  metadata: { uuid: "HAIKU_SHARE_UUID", relpath: "code/main/code.js" },\n  states: {},\n  timelines: {\n    Default: {\n      "haiku:8d66e396622f": {\n        "style.WebkitTapHighlightColor": { "0": { value: "rgba(0,0,0,0)" } },\n        "style.position": { "0": { value: "relative" } },\n        "style.overflowX": { "0": { value: "hidden" } },\n        "style.overflowY": { "0": { value: "hidden" } },\n        "sizeAbsolute.x": { "0": { value: 550 } },\n        "sizeAbsolute.y": { "0": { value: 400 } },\n        "sizeMode.x": { "0": { value: 1 } },\n        "sizeMode.y": { "0": { value: 1 } },\n        "sizeMode.z": { "0": { value: 1 } }\n      },\n      "haiku:20d66a8d25de": {\n        "style.position": { "0": { value: "absolute" } },\n        "style.margin": { "0": { value: "0" } },\n        "style.padding": { "0": { value: "0" } },\n        "style.border": { "0": { value: "0" } },\n        "sizeAbsolute.x": { "0": { value: 0 } },\n        "sizeMode.x": { "0": { value: 1 } },\n        "sizeAbsolute.y": { "0": { value: 0 } },\n        "sizeMode.y": { "0": { value: 1 } },\n        "style.zIndex": { "0": { value: 1 } }\n      },\n      "haiku:0dfff0b5e120": {\n        "style.position": { "0": { value: "absolute" } },\n        "style.margin": { "0": { value: "0" } },\n        "style.padding": { "0": { value: "0" } },\n        "style.border": { "0": { value: "0" } },\n        "sizeAbsolute.x": { "0": { value: 0 } },\n        "sizeMode.x": { "0": { value: 1 } },\n        "sizeAbsolute.y": { "0": { value: 0 } },\n        "sizeMode.y": { "0": { value: 1 } },\n        "translation.x": { "0": { value: 50, edited: true } },\n        "translation.y": { "0": { value: 50, edited: true } },\n        "style.zIndex": { "0": { value: 2 } }\n      }\n    }\n  },\n  template: {\n    elementName: "div",\n    attributes: { "haiku-title": "code", "haiku-id": "8d66e396622f" },\n    children: [\n      {\n        elementName: HaikuPath,\n        attributes: {\n          source: "@haiku/player/components/Path/code/main/code",\n          "haiku-title": "HaikuPath",\n          "haiku-id": "20d66a8d25de"\n        },\n        children: []\n      },\n      {\n        elementName: HaikuPath,\n        attributes: {\n          source: "@haiku/player/components/Path/code/main/code",\n          "haiku-title": "HaikuPath",\n          "haiku-id": "0dfff0b5e120"\n        },\n        children: []\n      }\n    ]\n  }\n};\n',
//   // after one removed - notice require is still there
//   'var HaikuPath = require("@haiku/player/components/Path/code/main/code");\nmodule.exports = {\n  options: {},\n  metadata: { uuid: "HAIKU_SHARE_UUID", relpath: "code/main/code.js" },\n  states: {},\n  timelines: {\n    Default: {\n      "haiku:8d66e396622f": {\n        "style.WebkitTapHighlightColor": { "0": { value: "rgba(0,0,0,0)" } },\n        "style.position": { "0": { value: "relative" } },\n        "style.overflowX": { "0": { value: "hidden" } },\n        "style.overflowY": { "0": { value: "hidden" } },\n        "sizeAbsolute.x": { "0": { value: 550 } },\n        "sizeAbsolute.y": { "0": { value: 400 } },\n        "sizeMode.x": { "0": { value: 1 } },\n        "sizeMode.y": { "0": { value: 1 } },\n        "sizeMode.z": { "0": { value: 1 } }\n      },\n      "haiku:0dfff0b5e120": {\n        "style.position": { "0": { value: "absolute" } },\n        "style.margin": { "0": { value: "0" } },\n        "style.padding": { "0": { value: "0" } },\n        "style.border": { "0": { value: "0" } },\n        "sizeAbsolute.x": { "0": { value: 0 } },\n        "sizeMode.x": { "0": { value: 1 } },\n        "sizeAbsolute.y": { "0": { value: 0 } },\n        "sizeMode.y": { "0": { value: 1 } },\n        "translation.x": { "0": { value: 50, edited: true } },\n        "translation.y": { "0": { value: 50, edited: true } },\n        "style.zIndex": { "0": { value: 2 } }\n      }\n    }\n  },\n  template: {\n    elementName: "div",\n    attributes: { "haiku-title": "code", "haiku-id": "8d66e396622f" },\n    children: [\n      {\n        elementName: HaikuPath,\n        attributes: {\n          source: "@haiku/player/components/Path/code/main/code",\n          "haiku-title": "HaikuPath",\n          "haiku-id": "0dfff0b5e120"\n        },\n        children: []\n      }\n    ]\n  }\n};\n',
//   // after both removed - require is gone
//   'module.exports = {\n  options: {},\n  metadata: { uuid: "HAIKU_SHARE_UUID", relpath: "code/main/code.js" },\n  states: {},\n  timelines: {\n    Default: {\n      "haiku:8d66e396622f": {\n        "style.WebkitTapHighlightColor": { "0": { value: "rgba(0,0,0,0)" } },\n        "style.position": { "0": { value: "relative" } },\n        "style.overflowX": { "0": { value: "hidden" } },\n        "style.overflowY": { "0": { value: "hidden" } },\n        "sizeAbsolute.x": { "0": { value: 550 } },\n        "sizeAbsolute.y": { "0": { value: 400 } },\n        "sizeMode.x": { "0": { value: 1 } },\n        "sizeMode.y": { "0": { value: 1 } },\n        "sizeMode.z": { "0": { value: 1 } }\n      }\n    }\n  },\n  template: {\n    elementName: "div",\n    attributes: { "haiku-title": "code", "haiku-id": "8d66e396622f" },\n    children: []\n  }\n};\n'
// ]
