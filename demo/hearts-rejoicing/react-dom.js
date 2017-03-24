var React = require('react') // Installed as dependency of 'haiku.ai'
var ReactDOM = require('react-dom') // Installed as a dependency of 'haiku.ai'
var HeartsRejoicingReactComponent = require('./react.js')
if (HeartsRejoicingReactComponent.default) HeartsRejoicingReactComponent = HeartsRejoicingReactComponent.default
module.exports = function _react_dom_wrapper (element, props) {
  ReactDOM.render(React.createElement(HeartsRejoicingReactComponent, props), element)
}