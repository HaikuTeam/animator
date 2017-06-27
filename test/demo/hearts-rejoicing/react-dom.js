var React = require('react') // Installed as dependency of '@haiku/player'
var ReactDOM = require('react-dom') // Installed as a dependency of '@haiku/player'
var HeartsRejoicingReactComponent = require('./react.js')
if (HeartsRejoicingReactComponent.default) {
  HeartsRejoicingReactComponent = HeartsRejoicingReactComponent.default
}
module.exports = function _react_dom_wrapper (element, props) {
  ReactDOM.render(
    React.createElement(HeartsRejoicingReactComponent, props),
    element
  )
}
