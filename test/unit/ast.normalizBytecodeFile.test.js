'use strict'

var test = require('tape')
var normalizeBytecodeFile = require('./../../src/ast/normalizeBytecodeFile')
var generateCode = require('./../../src/ast/generatecode')
var ActiveComponent = require('./../../src/model/ActiveComponent')
var path = require('path')

test('normalizeBytecodeFile', function (t) {
  t.plan(1)
  var ac = new ActiveComponent({
    alias: 'test',
    folder: path.join(__dirname, '..', 'fixtures', 'projects', 'gottafixme1'),
    userconfig: {},
    websocket: { send: () => {}, on: () => {} },
    platform: {},
    envoy: { mock: true }
  })
  ac.fetchActiveBytecodeFile().set('doShallowWorkOnly', false) // We would like to see diffs of the operations during this test
  ac.FileModel.UPDATE_OPTIONS.shouldUpdateFileSystem = false // Don't clobber the test fixtures
  ac.mountApplication()
  ac.on('component:mounted', () => {
    ac._componentInstance._context.clock.GLOBAL_ANIMATION_HARNESS.cancel()
    var file = ac.fetchActiveBytecodeFile() // File
    file.read((err) => { // Reload the full content from the file system, including the ast so we can diff log etc
      var ast = file.get('ast')
      normalizeBytecodeFile(ast)
      t.equal(generateCode(ast), 'var Haiku = require("@haiku/player");\n\nvar Module = require(\'module\');\nvar originalRequire = Module.prototype.require;\nModule.prototype.require = function () {return {};};\nvar FooBar = require(\'foo-bar\');\nvar HaikuMeow = require(\'@haiku/Meow\');\nvar Barf = require(\'BARF\');\nModule.prototype.require = originalRequire;\nmodule.exports = {\n  timelines: {\n    Default: {\n      \'#box\': {\n        \'rotaion.z\': {\n          0: {\n            "value": Haiku.inject(function (foo, baz, wowie) {\n              return (\n                foo.bar.baz * dee);\n\n            }, "foo", "baz", "wowie"),\n            curve: \'wakalaka\' } },\n\n\n        \'rob.x\': {\n          \'0\': {\n            value: Haiku.inject(function (foo) {\n              return [\'123\'];\n            }, "foo") } } } } },\n\n\n\n\n\n  template: {\n    elementName: \'div\',\n    attributes: { id: \'box\' },\n    children: [] } };')
    })
  })
})
