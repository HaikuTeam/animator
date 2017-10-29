'use strict'

var test = require('tape')
var removeRequire = require('./../../src/ast/removeRequire')
var generateCode = require('./../../src/ast/generatecode')
var ActiveComponent = require('./../../src/bll/ActiveComponent')
var File = require('./../../src/bll/File')
var path = require('path')

test('removeRequire', function (t) {
  t.plan(4)

  var ac = new ActiveComponent({
    alias: 'test',
    uid: path.join(__dirname, '..', 'fixtures', 'projects', 'matthew') + '::' + undefined,
    folder: path.join(__dirname, '..', 'fixtures', 'projects', 'matthew'),
    userconfig: {},
    websocket: { send: () => {}, on: () => {} },
    platform: {},
    envoy: { mock: true }
  })

  ac.fetchActiveBytecodeFile().doShallowWorkOnly = false // We would like to see diffs of the operations during this test
  File.UPDATE_OPTIONS.shouldUpdateFileSystem = false // Don't clobber the test fixtures
  ac.mountApplication()
  ac.on('component:mounted', () => {
    ac.instance._context.clock.GLOBAL_ANIMATION_HARNESS.cancel()
    var file = ac.fetchActiveBytecodeFile() // File
    file.read((err) => { // Reload the full content from the file system, including the ast so we can diff log etc
      var expectation = '/* unit testing hack */var Module = require(\'module\');\n/* unit testing hack */var originalRequire = Module.prototype.require;\n/* unit testing hack */Module.prototype.require = function () {return {};};\nvar FooBar = require(\'foo-bar\');\n\nvar Barf = require(\'BARF\');\n/* unit testing hack */Module.prototype.require = originalRequire;\nmodule.exports = {\n  timelines: {},\n  template: {\n    elementName: \'div\',\n    attributes: {},\n    children: [] } };'
      
      removeRequire(file.ast, 'HaikuMeow', '@haiku/Meow')
      var code = generateCode(file.ast)
      t.equal(code, expectation)

      // idempotency check
      removeRequire(file.ast, 'HaikuMeow', '@haiku/Meow')
      var code = generateCode(file.ast)
      t.equal(code, expectation)

      // doesn't hurt to do another
      expectation = '/* unit testing hack */var Module = require(\'module\');\n/* unit testing hack */var originalRequire = Module.prototype.require;\n/* unit testing hack */Module.prototype.require = function () {return {};};\n\n\nvar Barf = require(\'BARF\');\n/* unit testing hack */Module.prototype.require = originalRequire;\nmodule.exports = {\n  timelines: {},\n  template: {\n    elementName: \'div\',\n    attributes: {},\n    children: [] } };'
      removeRequire(file.ast, 'FooBar', 'foo-bar')
      var code = generateCode(file.ast)
      t.equal(code, expectation)
    
      // and check it doesn't fail if the module doesn't exist
      removeRequire(file.ast, 'LLCoolJ', 'll-cool-j')
      var code = generateCode(file.ast)
      t.equal(code, expectation)
    })
  })
})
