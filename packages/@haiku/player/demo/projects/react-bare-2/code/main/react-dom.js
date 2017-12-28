var React = require('react') // Installed as a peer dependency of '@haiku/player'
var ReactDOM = require('react-dom') // Installed as a peer dependency of '@haiku/player'
var HaikuReactAdapter = require('@haiku/player/dom/react')
var ReactBare = HaikuReactAdapter()
if (ReactBare.default) ReactBare = ReactBare.default
ReactBare.mount = function (element, React, ReactDOM) {
  ReactDOM.render(React.createElement(ReactBare, {
    haikuAdapter: require('@haiku/player/dom'),
    haikuCode: require('./code')
  }), element)
}
module.exports = ReactBare
