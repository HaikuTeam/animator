var ReactDOMAdapter = require('@haiku/core/dom/react')
var HaikuDOMComponent = require('./dom')
var ReactDOMComponent = ReactDOMAdapter(HaikuDOMComponent)
if (ReactDOMComponent.default) ReactDOMComponent = ReactDOMComponent.default
ReactDOMComponent.mount = function (element, React, ReactDOM) {
  ReactDOM.render(
    React.createElement(ReactDOMComponent, {}, [
      React.createElement(
        'span',
        { key: 1 },
        'I am passed in without any opacity setting'
      )
    ]),
    element
  )
}
module.exports = ReactDOMComponent
