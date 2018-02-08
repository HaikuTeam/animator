var ReactDOMAdapter = require('@haiku/core/dom/react')
var HaikuDOMComponent = require('./dom')
var ReactDOMComponent = ReactDOMAdapter(HaikuDOMComponent)
if (ReactDOMComponent.default) ReactDOMComponent = ReactDOMComponent.default
ReactDOMComponent.mount = function (element, React, ReactDOM) {
  class Thing extends React.Component {
    constructor() {
      super()
      this.state = { foo: 'React DOM Stateful Thing Component Was Here' }
    }

    render() {
      return React.createElement(
        'div',
        { style: { color: 'green' } },
        this.state.foo + ''
      )
    }
  }

  ReactDOM.render(
    React.createElement(ReactDOMComponent, {},
      React.createElement('div', {},
        React.createElement(
          'span',
          { key: 1, style: { color: 'blue' }, id: 'tweet' },
          'Meow meow'
        ),
        React.createElement(Thing, { key: 2, id: 'ruff' }),
        React.createElement(
          'span',
          { key: 3, style: { color: 'red' }, id: 'meow' },
          'Chirp chirp'
        )
      )
    ),
    element
  )
}
module.exports = ReactDOMComponent
