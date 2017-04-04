var React = require('react')
var ReactDOM = require('react-dom')
var assign = require('lodash.assign')
var ReactizedComponent = require('./react.js')
if (ReactizedComponent.default) ReactizedComponent = ReactizedComponent.default
var Thing = React.createClass({
  getInitialState: function () {
    return { foo: 'React DOM Stateful Thing Component Was Here' }
  },
  render: function () {
    return React.createElement('div', { style: { color: 'green' } }, this.state.foo + '')
  }
})
module.exports = function _react_dom_wrapper (element, props) {
  ReactDOM.render(
    React.createElement(ReactizedComponent, props, [
      React.createElement('span', { key: 1, style: {color:'blue'} }, 'Meow meow'),
      React.createElement(Thing, { key: 2 }),
      React.createElement('span', { key: 3, style: {color:'red'} }, 'Chirp chirp')
    ]),
    element
  )
}
