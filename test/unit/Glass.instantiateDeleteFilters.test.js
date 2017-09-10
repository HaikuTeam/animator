var test = require('tape')
var path = require('path')
var async = require('async')
var TestHelpers = require('./../TestHelpers')
test('Glass.instantiateDeleteFilters', function (t) {
  t.plan(4)
  TestHelpers.createApp(path.join(__dirname, '..', 'projects', 'blank-shadows'), function (glass, component, window, teardown) {
    function html () {
      return window.document.getElementById('hot-component-mount').innerHTML
    }

    function svg (idx) {
      var mount = window.document.getElementById('hot-component-mount')
      var child = mount.children[0].children[idx]
      return child && child.outerHTML
    }

    // First check that we have correct initial data
    t.equal(JSON.stringify(component.getSerializedBytecode()), '{"metadata":{"uuid":"HAIKU_SHARE_UUID","type":"haiku","name":"UsersMatthewCodeHaikuTeamMonoPackagesHaikuPlumbingTestFixturesProjectsBlankProject","relpath":"code/main/code.js"},"options":{},"states":{},"eventHandlers":{},"timelines":{"Default":{"haiku:0e366ff49e89":{"style.WebkitTapHighlightColor":{"0":{"value":"rgba(0,0,0,0)"}},"style.position":{"0":{"value":"relative"}},"style.overflowX":{"0":{"value":"hidden"}},"style.overflowY":{"0":{"value":"hidden"}},"sizeAbsolute.x":{"0":{"value":550}},"sizeAbsolute.y":{"0":{"value":400}},"sizeMode.x":{"0":{"value":1}},"sizeMode.y":{"0":{"value":1}},"sizeMode.z":{"0":{"value":1}}}}},"template":{"elementName":"div","attributes":{"haiku-title":"UsersMatthewCodeHaikuTeamMonoPackagesHaikuPlumbingTestFixturesProjectsBlankProject","haiku-id":"0e366ff49e89","style":{"webkitTapHighlightColor":"rgba(0,0,0,0)","position":"relative","overflowX":"hidden","overflowY":"hidden"}},"children":[]}}', 'base bytecode ok')
    t.equal(html(), '<div haiku-title="UsersMatthewCodeHaikuTeamMonoPackagesHaikuPlumbingTestFixturesProjectsBlankProject" haiku-id="0e366ff49e89" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0); position: relative; overflow-x: visible; overflow-y: visible; display: block; visibility: visible; width: 550px; height: 400px;"></div>', 'base html ok')

    // Now instantiate the component three times in a row
    async.series([
      function (cb) {
        component.callMethod('instantiateComponent', ['designs/shadows.sketch.contents/slices/Slice.svg', {}, {}], cb)
      },
      function (cb) {
        component.callMethod('instantiateComponent', ['designs/shadows.sketch.contents/slices/Slice.svg', {}, {}], cb)
      },
      function (cb) {
        component.callMethod('instantiateComponent', ['designs/shadows.sketch.contents/slices/Slice.svg', {}, {}], cb)
      },
      function (cb) {
        var _a1 = svg(0) //865dc0077f78
        var _b1 = svg(1) //0b41661585bb
        var _c1 = svg(2) //57f3884f0faa

        // Delete the second component in the list to determine its behavior re: the filter of the third
        component.callMethod('deleteComponent', [['0b41661585bb'], { from: 'test' }], function (err) {
          if (err) throw err

          var _a2 = svg(0) //865dc0077f78
          var _b2 = svg(1) //0b41661585bb
          var _c2 = svg(2) //57f3884f0faa

          t.equal(_a1, _a2, 'first element is the same')
          t.ok(_c2 === undefined, 'third element is now gone (shifted)')

          // t.equal(_c1, _b2, 'second element is now the same as what the third element was')
          // old <filter id="filter-2-23127b">, <use filter="url(#filter-2-23127b)">
          // new <filter id="filter-2-23127b">, <use filter="url(#filter-2-23127b)">

          return cb()
        })
      }
    ], function (err) {
      if (err) throw err
      teardown()
    })    
  })
})
