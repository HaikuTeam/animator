// 'use strict'

// var test = require('tape')
// var path = require('path')
// var ActiveComponent = require('./../../src/model/ActiveComponent')

// test('activeComponent.instantiateComponent', function (t) {
//   t.plan(1)
//   var ac = new ActiveComponent({
//     alias: 'test',
//     folder: path.join(__dirname, '..', 'fixtures', 'projects', 'james'),
//     userconfig: {},
//     websocket: { send: () => {}, on: () => {} },
//     platform: {},
//     envoy: { mock: true }
//   })
//   ac.fetchActiveBytecodeFile().set('doShallowWorkOnly', false) // We would like to see diffs of the operations during this test
//   ac.FileModel.UPDATE_OPTIONS.shouldUpdateFileSystem = false // Don't clobber the test fixtures
//   ac.mountApplication()
//   ac.on('component:mounted', () => {
//     ac._componentInstance._context.clock.GLOBAL_ANIMATION_HARNESS.cancel()
//     var file = ac.fetchActiveBytecodeFile()
//     file.read((err) => { // Reload the full content from the file system, including the ast so we can diff log etc
//       file.on('in-memory-content-state-updated', () => {
//         var updatedContents = ac.fetchActiveBytecodeFile().get('contents')
//         t.equal(updatedContents, EXPECTED_CONTENTS)
//       })
//       ac.instantiateComponent('@haiku/player/components/Path', { x: 0, y: 0 }, { from: 'test' }, () => {})
//     })
//   })
// })
// var EXPECTED_CONTENTS = 'var HaikuPath = require("@haiku/player/components/Path/code/main/code");\nmodule.exports = {\n  options: {},\n  metadata: { uuid: "HAIKU_SHARE_UUID", relpath: "code/main/code.js" },\n  states: {},\n  timelines: {\n    Default: {\n      "haiku:8d66e396622f": {\n        "style.WebkitTapHighlightColor": { "0": { value: "rgba(0,0,0,0)" } },\n        "style.position": { "0": { value: "relative" } },\n        "style.overflowX": { "0": { value: "hidden" } },\n        "style.overflowY": { "0": { value: "hidden" } },\n        "sizeAbsolute.x": { "0": { value: 550 } },\n        "sizeAbsolute.y": { "0": { value: 400 } },\n        "sizeMode.x": { "0": { value: 1 } },\n        "sizeMode.y": { "0": { value: 1 } },\n        "sizeMode.z": { "0": { value: 1 } }\n      },\n      "haiku:20d66a8d25de": {\n        "style.position": { "0": { value: "absolute" } },\n        "style.margin": { "0": { value: "0" } },\n        "style.padding": { "0": { value: "0" } },\n        "style.border": { "0": { value: "0" } },\n        "sizeAbsolute.x": { "0": { value: 0 } },\n        "sizeMode.x": { "0": { value: 1 } },\n        "sizeAbsolute.y": { "0": { value: 0 } },\n        "sizeMode.y": { "0": { value: 1 } },\n        "style.zIndex": { "0": { value: 1 } }\n      }\n    }\n  },\n  template: {\n    elementName: "div",\n    attributes: { "haiku-title": "code", "haiku-id": "8d66e396622f" },\n    children: [\n      {\n        elementName: HaikuPath,\n        attributes: {\n          source: "@haiku/player/components/Path/code/main/code",\n          "haiku-title": "HaikuPath",\n          "haiku-id": "20d66a8d25de"\n        },\n        children: []\n      }\n    ]\n  }\n};\n'
