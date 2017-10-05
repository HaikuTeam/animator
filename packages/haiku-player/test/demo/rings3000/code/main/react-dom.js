var throttle = require('lodash').throttle
var ReactDOMAdapter = require('@haiku/player/dom/react')
var HaikuDOMComponent = require('./dom')
var ReactDOMComponent = ReactDOMAdapter(HaikuDOMComponent)
if (ReactDOMComponent.default) ReactDOMComponent = ReactDOMComponent.default
ReactDOMComponent.mount = function (element, React, ReactDOM) {
  var Wrap = React.createClass({
    getInitialState: function () {
      this.setMouseCoordinates = ({ clientX, clientY }) => {
        this.setState({ mouseX: clientX, mouseY: clientY })
      }
      // this.setMouseCoordinates = throttle(({ clientX, clientY }) => {
      //   this.setState({ mouseX: clientX, mouseY: clientY })
      // }, 32)
      return {
        mouseX: 0,
        mouseY: 0
      }
    },
    mouseMoveCallback: function (mouseEvent) {
      mouseEvent.persist()
      this.setMouseCoordinates(mouseEvent)
    },
    render: function () {
      return React.createElement('div', {
        onMouseMove: this.mouseMoveCallback
      }, React.createElement(ReactDOMComponent, {
        options: {
          loop: true
        },
        haikuStates: {
          mouseX: { value: this.state.mouseX },
          mouseY: { value: this.state.mouseY }
        }
      }))
    }
  })
  ReactDOM.render(React.createElement(Wrap), element)
}
module.exports = ReactDOMComponent
