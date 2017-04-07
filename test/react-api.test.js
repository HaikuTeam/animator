var test = require('tape')
var React = require('react')
var ReactDOM = require('react-dom')
var helpers = require('./helpers')
var Creation = require('./../src/creation/dom')
var reactAdapt = require('./../src/adapters/react')
var Emitter = require('./../src/emitter')

test('react-api', function(t) {
  t.plan(3)
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
    t.ok(reactClass.haiku, 'haiku was set')
    var controller = Emitter.create({})
    controller.on('haikuComponentDidMount', function (instance) {
      instance.events.listen('#div', 'click', function (event) {
        t.ok(event, 'it should click')
        setTimeout(function () {
          reactClass.haiku.context.clock.cancelRaf()
        }, 250)
      })
    })
    var reactElement = React.createElement(reactClass, {
      autoplay: false,
      controller: controller,
      // NOTE! onClick etc doesn't work properly in JSDOM context
    })
    var domElement = window.document.getElementById('mount')
    ReactDOM.render(reactElement, domElement)
    setTimeout(function() {
      var el = document.getElementById('div')
      helpers.simulateEvent(el, 'click')
    }, 32)
  })
})
