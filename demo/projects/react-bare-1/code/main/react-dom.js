var React = require('react') // Installed as a peer dependency of '@haiku/core'
var ReactDOM = require('react-dom') // Installed as a peer dependency of '@haiku/core'
var HaikuReactAdapter = require('@haiku/core/dom/react')
var ReactBare = HaikuReactAdapter(null, require('./code'))
if (ReactBare.default) ReactBare = ReactBare.default
ReactBare.mount = function (element, React, ReactDOM) {
  ReactDOM.render(React.createElement(ReactBare, {
    haikuAdapter: require('@haiku/core/dom')
  }), element)
}
module.exports = ReactBare
