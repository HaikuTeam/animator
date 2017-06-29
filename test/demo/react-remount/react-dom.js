var React = require('react')
var ReactDOM = require('react-dom')
var assign = require('./../../../src/vendor/assign')
var ReactizedComponent = require('./react.js')
if (ReactizedComponent.default) ReactizedComponent = ReactizedComponent.default
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
      return wrap(React.createElement(ReactizedComponent, this.props))
    } else {
      return wrap(React.createElement('div', {}, ['poof!']))
    }
  }
})
function wrap (kid) {
  return React.createElement('div', {
    style: {
      paddingTop: 300
    }
  }, kid)
}
module.exports = function _react_dom_wrapper (element, props) {
  ReactDOM.render(React.createElement(Mounter, props), element)
}
