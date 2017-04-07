var React = require('react') // Installed as dependency of 'haiku.ai'
var ReactDOM = require('react-dom') // Installed as a dependency of 'haiku.ai'
var heartstry4Component = require('./react.js')
if (heartstry4Component.default) heartstry4Component = heartstry4Component.default
module.exports = function _react_dom_wrapper (element, props) {
  ReactDOM.render(React.createElement(heartstry4Component, props), element)
}