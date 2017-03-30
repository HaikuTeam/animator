var test = require('tape')
var React = require('react')
var ReactDOM = require('react-dom')
var helpers = require('./helpers')
var Creation = require('./../src/creation/dom')
var reactAdapt = require('./../src/adapters/react')
var Emitter = require('./../src/emitter')

test('react', function(t) {
  t.plan(7)
  return helpers.createDOM(function(err, window) {
    t.error(err, 'no create dom err')
    var bytecode = {
      properties: [],
      eventHandlers: [],
      timelines: {
        'Default': {
          '#div': {

          }
        }
      },
      template: '<div id="div">Hello</div>'
    }
    var creationClass = Creation(bytecode, {}, window)
    var reactClass = reactAdapt(creationClass)
    t.ok(reactClass.haikuClass, 'haiku class was set')
    var controller = Emitter.create({})
    controller.on('componentDidMount', function (instance) {
      instance.play()
      instance.events.listen('#div', 'click', function (event) {
        t.ok(event, 'it should click')
        setTimeout(function () {
          t.equal(instance.component.context.clock.loops, 1)
          t.equal(instance.component.context.clock.frame, 1)
          t.equal(instance.component.context.clock.time, 16.6)
          t.equal(instance.component.context.clock.running, false)
          reactClass.haikuClass.context.clock.cancelRaf()
        }, 250)
      })
    })
    var reactElement = React.createElement(reactClass, {
      autoplay: false,
      controller: controller
    })
    var domElement = window.document.getElementById('mount')
    ReactDOM.render(reactElement, domElement)
    setTimeout(function() {
      var el = document.getElementById('div')
      helpers.simulateEvent(el, 'click')
    }, 32)
  })
})
