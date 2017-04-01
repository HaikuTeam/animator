var test = require('tape')
var React = require('react')
var helpers = require('./helpers')
var Creation = require('./../src/creation/dom')

test('rotation-determinism', function(t) {
  t.plan(7)
  return helpers.createDOM(function(err, window) {
    var bytecode = {
      properties: [],
      eventHandlers: [],
      timelines: {
        'Default': {
          '#div': {
            'sizeMode.x': { 0: { value: 1 } },
            'sizeMode.y': { 0: { value: 1 } },
            'sizeMode.z': { 0: { value: 1 } },
            'sizeAbsolute.x': { 0: { value: 1000 } },
            'sizeAbsolute.y': { 0: { value: 1000 } },
            'sizeAbsolute.z': { 0: { value: 1000 } },
          },
          '#svg': {
            'rotation.z': {
              0: { value: 0, curve: 'linear' },
              1000: { value: 10 },
            }
          }
        }
      },
      template: '<div id="div"><svg id="svg"></svg></div>'
    }
    var creation = Creation(bytecode, {}, window)
    var mount = window.document.getElementById('mount')
    var context = creation(mount)
    var timelines = context.component.store.get('timelines')
    function jump (time) {
      // Same method 
      for (var timelineName in timelines) timelines[timelineName].controlTime(time)
      creation.tick()
    }
    function mat() {
      return context.component.template.template.children[0].layout.computed.matrix
    }
    jump(0); t.equal(JSON.stringify(mat()), '[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]')
    jump(100); t.equal(JSON.stringify(mat()), '[0.54030230586814,0.8414709848078964,0,0,-0.8414709848078964,0.54030230586814,0,0,0,0,1,0,0,0,0,1]')
    jump(1550); t.equal(JSON.stringify(mat()), '[-0.8390715290764523,-0.5440211108893698,0,0,0.5440211108893698,-0.8390715290764523,0,0,0,0,1,0,0,0,0,1]')
    jump(200); t.equal(JSON.stringify(mat()), '[-0.4161468365471419,0.9092974268256818,0,0,-0.9092974268256818,-0.4161468365471419,0,0,0,0,1,0,0,0,0,1]')
    jump(1550); t.equal(JSON.stringify(mat()), '[-0.8390715290764523,-0.5440211108893698,0,0,0.5440211108893698,-0.8390715290764523,0,0,0,0,1,0,0,0,0,1]')
    jump(300); t.equal(JSON.stringify(mat()), '[-0.9899924966004454,0.14112000805986677,0,0,-0.14112000805986677,-0.9899924966004454,0,0,0,0,1,0,0,0,0,1]')
    jump(1550); t.equal(JSON.stringify(mat()), '[-0.8390715290764523,-0.5440211108893698,0,0,0.5440211108893698,-0.8390715290764523,0,0,0,0,1,0,0,0,0,1]')
    context.clock.cancelRaf()
  })
})
