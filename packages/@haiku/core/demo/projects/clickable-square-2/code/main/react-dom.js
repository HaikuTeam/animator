var ReactDOMAdapter = require('@haiku/core/dom/react')
var HaikuDOMComponent = require('./dom')
var ReactDOMComponent = ReactDOMAdapter(HaikuDOMComponent)
if (ReactDOMComponent.default) ReactDOMComponent = ReactDOMComponent.default

ReactDOMComponent.mount = (element, React, ReactDOM) => {
  class Main extends React.Component {
    render() {
      return React.createElement(ReactDOMComponent, {
        onClick: () => {
          console.info('react heard click')
        },
        onComponentDidMount: () => {
          console.info('react heard onComponentDidMount')
        },
        onHaikuComponentDidMount: () => {
          console.info('react heard onHaikuComponentDidMount')
        },
        onRuffRuff: () => {
          console.info('react heard ruff ruff')
        },
        haikuOptions: {
          lala: 1,
          baba: 2
        },
        haikuStates: {
          something: 'nothing'
        }
      })
    }
  }

  ReactDOM.render(React.createElement(Main), element)
}

module.exports = ReactDOMComponent
