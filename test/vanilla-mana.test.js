var test = require('tape')
var React = require('react')
var helpers = require('./helpers')
var Creation = require('./../src/creation/dom')

test('vanilla-mana', function(t) {
  t.plan(2)
  return helpers.createDOM(function(err, window) {
    var ctor = function() {
      t.ok(true, 'ctor called')
      return {
        render: function() {
          return {
            elementName: 'svg',
            attributes: { foo: 123, baz: this.props.moo }
          }
        }
      }
    }
    var bytecode = {
      properties: [],
      eventHandlers: [],
      timelines: {},
      template: {
        elementName: 'div',
        attributes: { yay: 'abc' },
        children: [
          {
            elementName: ctor,
            attributes: { moo: 'cow' },
            children: []
          }
        ]
      }
    }
    var creation = Creation(bytecode, window)
    var mount = window.document.getElementById('mount')
    var context = creation(mount)
    setTimeout(function() {
      t.equal(mount.innerHTML, '<div yay="abc"><svg foo="123" baz="cow"></svg></div>')
      context.clock.cancelRaf()
    }, 16)
  })
})
