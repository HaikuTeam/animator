var React = require('react')
var ReactDOM = require('react-dom')
var assign = require('./../../../src/vendor/lodash.assign')
var ReactizedComponent = require('./react.js')
if (ReactizedComponent.default) ReactizedComponent = ReactizedComponent.default
module.exports = function _react_dom_wrapper (element, props) {
  ReactDOM.render(React.createElement(ReactizedComponent, props), element)
}
