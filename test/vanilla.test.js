var test = require('tape')
var React = require('react')
var helpers = require('./helpers')
var Creation = require('./../src/creation/dom')

test('vanilla', function(t) {
  t.plan(1)
  return helpers.createDOM(function(err, window) {
    var bytecode = {
      properties: [],
      eventHandlers: [],
      timelines: {
        'Default': {
          '#p': {
            hello: {
              0: {
                value: 'ALOHA'
              }
            }
          }
        }
      },
      template: '<div><p id="p"></p></div>'
    }
    var creation = Creation(bytecode, window)
    var mount = window.document.getElementById('mount')
    var context = creation(mount)
    setTimeout(function() {
      t.equal(mount.innerHTML, '<div><p id="p" hello="ALOHA"></p></div>')
      context.clock.cancelRaf()
    }, 16)
  })
})
