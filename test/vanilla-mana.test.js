var test = require('tape')
var React = require('react')
var helpers = require('./helpers')
var Creation = require('./../src/creation/dom')

test('vanilla-mana', function(t) {
  t.plan(4)
  return helpers.createDOM(function(err, window) {
    var ctor = function() {
      t.ok(true, 'ctor called')
      return {
        properties: [{
          name: 'sauce',
          type: 'string',
          value: '',
          setter: function(sauce) {
            t.equal(sauce, 'wonka')
            this.emit('wow', 'YOWZA')
            return sauce
          }
        }],
        timelines: {
          Default: {
            '#svg': {
              baz: {
                0: {
                  value: function() {
                    return this.props.moo
                  }
                }
              }
            }
          }
        },
        template: {
          elementName: 'svg',
          attributes: { foo: 123, id: 'svg' }
        }
      }
    }
    var bytecode = {
      properties: [],
      eventHandlers: [{
        name: 'wow',
        selector: '#subel',
        handler: function(msg) {
          t.equal(msg, 'YOWZA')
        }
      }],
      timelines: {
        'Default': {
          '#subel': {
            'sauce': {
              0: {
                value: 'wonka'
              }
            }
          }
        }
      },
      template: {
        elementName: 'div',
        attributes: { yay: 'abc' },
        children: [
          {
            elementName: ctor,
            attributes: { id: 'subel', moo: 'cow' },
            children: []
          }
        ]
      }
    }
    var creation = Creation(bytecode, {}, window)
    var mount = window.document.getElementById('mount')
    var context = creation(mount)
    setTimeout(function() {
      // display: none because jsdom context has no size
      t.equal(mount.innerHTML, '<div style="display: none;" yay="abc"><svg style="display: none;" foo="123" id="svg" baz="cow"></svg></div>')
      context.clock.cancelRaf()
    }, 16)
  })
})
