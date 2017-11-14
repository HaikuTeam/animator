var ReactDOMAdapter = require('@haiku/player/dom/react')
var HaikuDOMComponent = require('./dom')
var ReactDOMComponent = ReactDOMAdapter(HaikuDOMComponent)
if (ReactDOMComponent.default) ReactDOMComponent = ReactDOMComponent.default
ReactDOMComponent.mount = function (element, React, ReactDOM) {
  var Mounter = React.createClass({
    getInitialState: function () {
      setInterval(function () {
        this.setState({ toggle: !this.state.toggle })
      }.bind(this), 1000)
      return {
        toggle: true
      }
    },
    render: function () {
      if (this.state.toggle) {
        return wrap(React.createElement(ReactDOMComponent, this.props))
      } else {
        return wrap(React.createElement('div', {}, ['poof!']))
      }
    }
  })
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
