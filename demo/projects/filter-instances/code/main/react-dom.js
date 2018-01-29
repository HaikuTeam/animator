var ReactDOMAdapter = require('@haiku/core/dom/react')
var HaikuDOMComponent = require('./dom')
var ReactDOMComponent = ReactDOMAdapter(HaikuDOMComponent)
if (ReactDOMComponent.default) ReactDOMComponent = ReactDOMComponent.default

ReactDOMComponent.mount = function (element, React, ReactDOM) {
  var states = [
    { filt: -3 },
    { filt: -1 },
    { filt: 2 }
  ]

  function render (state, index) {
    return React.createElement(ReactDOMComponent, {
      key: index,
      haikuStates: {
        filt: {
          value: state.filt
        }
      }
    })
  }

  ReactDOM.render(
    React.createElement('div', {}, states.map(render)),
    element
  )
}

module.exports = ReactDOMComponent
