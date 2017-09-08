var test = require('tape')
var path = require('path')
var TestHelpers = require('./../TestHelpers')

test('Glass.instantiateComponentFromModule', function (t) {
  t.plan(3)
  TestHelpers.createApp(path.join(__dirname, '..', 'projects', 'simple'), function (glass, component, window, teardown) {
    t.equal(JSON.stringify(component.getSerializedBytecode()), '{"metadata":{"relpath":"code/main/code.js","uuid":"HAIKU_SHARE_UUID","version":"0.0.10","organization":"Haiku","project":"Primitives","branch":"master","name":"Primitives"},"options":{},"states":{},"eventHandlers":{},"timelines":{"Default":{"haiku:f203a65f49c0":{"style.WebkitTapHighlightColor":{"0":{"value":"rgba(0,0,0,0)"}},"style.position":{"0":{"value":"relative"}},"style.overflowX":{"0":{"value":"hidden"}},"style.overflowY":{"0":{"value":"hidden"}},"sizeAbsolute.x":{"0":{"value":550}},"sizeAbsolute.y":{"0":{"value":400}},"sizeMode.x":{"0":{"value":1}},"sizeMode.y":{"0":{"value":1}},"sizeMode.z":{"0":{"value":1}}}}},"template":{"elementName":"div","attributes":{"haiku-title":"Primitives","haiku-id":"f203a65f49c0","style":{"webkitTapHighlightColor":"rgba(0,0,0,0)","position":"relative","overflowX":"hidden","overflowY":"hidden"}},"children":[]}}', 'base bytecode ok')
    t.equal(window.document.getElementById('hot-component-mount').innerHTML, '<div haiku-title="Primitives" haiku-id="f203a65f49c0" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0); position: relative; overflow-x: hidden; overflow-y: hidden; display: block; visibility: visible; width: 550px; height: 400px;"></div>')
    component.callMethod('instantiateComponent', ['@haiku/player/components/Path', {}, {}], () => {
      t.equal(window.document.getElementById('hot-component-mount').innerHTML, '')
    })
  })
})
