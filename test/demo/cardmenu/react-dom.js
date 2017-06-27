var React = require('react') // Installed as dependency of '@haiku/player'
var ReactDOM = require('react-dom') // Installed as a dependency of '@haiku/player'
var CardMenuComponent = require('./react.js')
if (CardMenuComponent.default) CardMenuComponent = CardMenuComponent.default
module.exports = function _react_dom_wrapper (element, props) {
  props = {
    onClick: function onClick (proxy, event, instance) {
      instance.getDefaultTimeline().play()
    }
  }
  ReactDOM.render(
    React.createElement(CardMenuComponent, props, [
      React.createElement(
        'span',
        { style: { fontFamily: 'arial', fontSize: '20px' }, key: 1 },
        'Meow meow'
      )
    ]),
    element
  )
}
