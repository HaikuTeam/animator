var React = require('react')
var ReactDOM = require('react-dom')
var assign = require('./../../../src/vendor/assign')
var ReactizedComponent = require('./react.js')
if (ReactizedComponent.default) ReactizedComponent = ReactizedComponent.default
module.exports = function _react_dom_wrapper (element, props) {
  props = assign(
    {
      onClick: function () {
        document.body.style.backgroundColor = document.body.style
          .backgroundColor === 'black'
          ? 'white'
          : 'black'
      }
    },
    props
  )
  ReactDOM.render(React.createElement(ReactizedComponent, props), element)
}
