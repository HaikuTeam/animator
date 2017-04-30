var React = require('react') // Installed as dependency of 'haiku.ai'
var ReactDOM = require('react-dom') // Installed as a dependency of 'haiku.ai'
var CardMenuComponent = require('./react.js')
if (CardMenuComponent.default) CardMenuComponent = CardMenuComponent.default
module.exports = function _react_dom_wrapper (element, props) {
  props = {
    onClick: function onClick (proxy, event, instance) {
      instance.timelines.play()
    }
  }
  ReactDOM.render(React.createElement(CardMenuComponent, props, [
    // React.createElement('g', { key: 1 }, [
      React.createElement('text', { color: 'black', style: { fontFamily: 'arial', fontSize: '20px' }, key: 1 }, 'Meow meow'),
    // ])
  ]), element)
}
