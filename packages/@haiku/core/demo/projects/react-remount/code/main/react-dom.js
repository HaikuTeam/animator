var ReactDOMAdapter = require('@haiku/core/dom/react')
var HaikuDOMComponent = require('./dom')
var ReactDOMComponent = ReactDOMAdapter(HaikuDOMComponent)
if (ReactDOMComponent.default) ReactDOMComponent = ReactDOMComponent.default
ReactDOMComponent.mount = function (element, React, ReactDOM) {
  class Mounter extends React.Component {
    constructor() {
      super()
      this.state = {
        toggle: true
      }

      setInterval(() => {
        this.setState({ toggle: !this.state.toggle })
      }, 1000)
    }

    render() {
      if (this.state.toggle) {
        return wrap(React.createElement(ReactDOMComponent, this.props))
      } else {
        return wrap(React.createElement('div', {}, ['poof!']))
      }
    }
  }
  function wrap (kid) {
    return React.createElement('div', {
      style: {
        paddingTop: 200
      }
    }, kid)
  }
  ReactDOM.render(React.createElement(Mounter, {}), element)
}
module.exports = ReactDOMComponent
