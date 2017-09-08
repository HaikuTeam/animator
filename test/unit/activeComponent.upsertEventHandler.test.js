var test = require('tape')
var path = require('path')
var async = require('async')
var ActiveComponent = require('./../../src/model/ActiveComponent')
var generateCode = require('./../../src/ast/generateCode')

test('activeComponent.upsertEventHandler', (t) => {
  t.plan(1)

  var ac = new ActiveComponent({
    alias: 'test',
    folder: path.join(__dirname, '..', 'fixtures', 'projects', 'dos'),
    userconfig: {},
    websocket: { send: () => {}, on: () => {} },
    platform: {},
    envoy: { mock: true }
  })

  // We would like to see diffs of the operations during this test
  ac.fetchActiveBytecodeFile().set('doShallowWorkOnly', false)
  ac.FileModel.UPDATE_OPTIONS.shouldUpdateFileSystem = false // Don't clobber the test fixtures
  ac.mountApplication()

  ac.on('component:mounted', () => {
    ac._componentInstance._context.clock.GLOBAL_ANIMATION_HARNESS.cancel()
    ac.fetchActiveBytecodeFile().read((err) => {
      return async.series([
        function (cb) {
          return ac.upsertEventHandler(
            'haiku:d0d263a2f0be',
            'onclick',
            { handler: function (event) {
              this.clicks += 1
            } },
            { from: 'test' },
            cb
          )
        },
        function (cb) {
          return setTimeout(cb, 1000)
        },
        function (cb) {
          return ac.deleteEventHandler(
            'haiku:d0d263a2f0be',
            'onclick',
            { from: 'test' },
            cb
          )
        },
        function (cb) {
          return ac.upsertEventHandler(
            'haiku:d0d263a2f0be',
            'onclick',
            { handler: function (event) {
              this.clicks += 1
              this.foobars += 2
              return 123
            } },
            { from: 'test' },
            cb
          )
        },
        function (cb) {
          return setTimeout(cb, 1000)
        },
      ], (err) => {
        if (err) throw err
        t.equal(JSON.stringify(ac.fetchActiveBytecodeFile().getSerializedBytecode()),  '{"metadata":{"uuid":"HAIKU_SHARE_UUID","type":"haiku","name":"dos","relpath":"code/main/code.js"},"options":{},"states":{},"eventHandlers":{"haiku:d0d263a2f0be":{"onclick":{"handler":{"__function":{"type":"FunctionExpression","name":null,"params":["event"],"body":"this.clicks += 1\\n              this.foobars += 2\\n              return 123"}}}}},"timelines":{"Default":{"haiku:d0d263a2f0be":{"style.WebkitTapHighlightColor":{"0":{"value":"rgba(0,0,0,0)"}},"style.position":{"0":{"value":"relative"}},"style.overflowX":{"0":{"value":"hidden"}},"style.overflowY":{"0":{"value":"hidden"}},"sizeAbsolute.x":{"0":{"value":550}},"sizeAbsolute.y":{"0":{"value":400}},"sizeMode.x":{"0":{"value":1}},"sizeMode.y":{"0":{"value":1}},"sizeMode.z":{"0":{"value":1}}}}},"template":{"elementName":"div","attributes":{"haiku-title":"bytecode","haiku-id":"d0d263a2f0be"},"children":[]}}')
      })
    })
  })  
})
