'use strict'

var test = require('tape')
var path = require('path')
var ActiveComponent = require('./../../src/bll/ActiveComponent')
var File = require('./../../src/bll/File')

test('activeComponent.applyPropertyGroupValue', function (t) {
  t.plan(1)
  var ac = new ActiveComponent({
    alias: 'test',
    uid: path.join(__dirname, '..', 'fixtures', 'projects', 'applypropgrouptest') + '::' + undefined,
    folder: path.join(__dirname, '..', 'fixtures', 'projects', 'applypropgrouptest'),
    userconfig: {},
    websocket: { send: () => {}, on: () => {}, action: () => {} },
    platform: {},
    envoy: { mock: true }
  })
  ac.fetchActiveBytecodeFile().doShallowWorkOnly = false // We would like to see diffs of the operations during this test
  File.UPDATE_OPTIONS.shouldUpdateFileSystem = false // Don't clobber the test fixtures
  ac.mountApplication()
  ac.on('update', (what) => {
    if (what === 'application-mounted') {
      ac.instance._context.clock.GLOBAL_ANIMATION_HARNESS.cancel()
      var file = ac.fetchActiveBytecodeFile()
      file.read((err) => { // Reload the full content from the file system, including the ast so we can diff log etc
        file.on('in-memory-content-state-updated', () => {
          var updatedContents = ac.fetchActiveBytecodeFile().contents
          t.equal(updatedContents, EXPECTED_CONTENTS, 'updated contents are correct')
        })
        ac.applyPropertyGroupValue(['abcdefghijk'], 'Default', 0, { 'rotation.z': 0.123 }, { from: 'test' }, () => {})
      })
    }
  })
})
var EXPECTED_CONTENTS = 'var Haiku = require("@haiku/player");\nmodule.exports = {\n  options: {},\n  metadata: { uuid: "HAIKU_SHARE_UUID", relpath: "code/main/code.js" },\n  states: { opacity: { value: 1 } },\n\n  timelines: {\n    Default: {\n      "haiku:abcdefghijk": {\n        opacity: {\n          "0": {\n            value: Haiku.inject(\n              function(opacity) {\n                return opacity;\n              },\n              "opacity"\n            )\n          }\n        },\n        "rotation.z": { "0": { value: 0.123, edited: true } },\n        "style.WebkitTapHighlightColor": { "0": { value: "rgba(0,0,0,0)" } },\n        "style.position": { "0": { value: "relative" } },\n        "style.overflowX": { "0": { value: "hidden" } },\n        "style.overflowY": { "0": { value: "hidden" } },\n        "sizeAbsolute.x": { "0": { value: 550 } },\n        "sizeAbsolute.y": { "0": { value: 400 } },\n        "sizeMode.x": { "0": { value: 1 } },\n        "sizeMode.y": { "0": { value: 1 } },\n        "sizeMode.z": { "0": { value: 1 } }\n      }\n    }\n  },\n\n  template: {\n    elementName: "div",\n    attributes: { "haiku-id": "abcdefghijk", "haiku-title": "code" },\n    children: []\n  }\n};\n'
