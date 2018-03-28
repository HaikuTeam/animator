var ReactDOMAdapter = require('@haiku/core/dom/react')
var HaikuDOMComponent = require('./dom')
var ReactDOMComponent = ReactDOMAdapter(HaikuDOMComponent)
if (ReactDOMComponent.default) ReactDOMComponent = ReactDOMComponent.default
ReactDOMComponent.mount = function (element, React, ReactDOM) {
  class Wrap extends React.Component {
    constructor() {
      super()
      this.state = {
        mouseX: 0,
        mouseY: 0
      }
    }

    setMouseCoordinates({ clientX, clientY }) {
      this.setState({ mouseX: clientX, mouseY: clientY })
    }

    mouseMoveCallback(mouseEvent) {
      mouseEvent.persist()
      this.setMouseCoordinates(mouseEvent)
    }

    render() {
      return React.createElement('div', {
        onMouseMove: (e) => {
          this.mouseMoveCallback(e)
        }
      }, React.createElement(ReactDOMComponent, {
        loop: true,
        haikuStates: {
          mouseX: { value: this.state.mouseX },
          mouseY: { value: this.state.mouseY }
        }
      }))
    }
  }

  ReactDOM.render(React.createElement(Wrap), element)
}
module.exports = ReactDOMComponent
