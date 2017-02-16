var test = require('tape')
var React = require('react')
var ReactDOM = require('react-dom')
var helpers = require('./helpers')
var Creation = require('./../src/creation/dom')
var reactAdapt = require('./../src/adapters/react')

test('react', function(t) {
  t.plan(6)
  return helpers.createDOM(function(err, window) {
    t.error(err, 'no create dom err')
    var bytecode = {
      properties: [{
        name: 'cows',
        type: 'number',
        value: 0,
        setter: function(cows) {
          this.timelines.play('hoorah')
          return cows + 2
        }
      },{
        name: 'blars',
        private: true,
        type: 'string',
        value: 'override me',
        setter: function(blars) {
          return 'blarify-' + blars
        }
      },{
        name: 'onFoobar',
        type: 'listener',
        value: null,
        setter: function(fn) {
          this.on('foobar', fn)
        }
      }],
      eventHandlers: [{
        name: 'onClick',
        selector: '#svg',
        handler: function() {
          this.blars = 'aloha'
          this.timelines.play('booya')
          this.emit('wawa', 'coffee')
          this.emit('foobar', 'I AM FOOBAR')
        }
      }],
      timelines: {
        'hoorah': {
          '#svg': {
            'meow': {
              0: {
                value: function(inputs) {
                  return inputs.cows
                }
              }
            }
          }
        },
        'booya': {
          '#svg': {
            'cation': {
              0: {
                value: function(inputs) {
                  return inputs.blars
                }
              }
            }
          }
        }
      },
      template: '<svg id="svg"></svg>'
    }
    var creationClass = Creation(bytecode, window)
    var reactClass = reactAdapt(creationClass)
    t.ok(reactClass.haikuClass, 'haiku class was set')
    var reactElement = React.createElement(reactClass, {
      cows: 123,
      notHere: 'abc', // ignored
      onFoobar: function(payload) {
        t.equal(payload, 'I AM FOOBAR', 'event was received')
      },
      events: {
        wawa: function(msg) {
          t.equal(msg, 'coffee', 'got emitted event')
        }
      }
    })
    var domElement = window.document.getElementById('mount')
    ReactDOM.render(reactElement, domElement)
    setTimeout(function() {
      var svgElement = document.getElementById('svg')
      t.equal(svgElement.getAttribute('meow'), '125', 'attribute was set')
      helpers.simulateEvent(svgElement, 'click')
      setTimeout(function() {
        var svgElementReloaded = document.getElementById('svg')
        t.equal(svgElementReloaded.getAttribute('cation'), 'blarify-aloha', 'attribute was set')
        reactClass.haikuClass.context.clock.cancelRaf()
      }, 16)
    }, 16)
  })
})
