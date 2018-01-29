var React = require('react') // Installed as a peer dependency of '@haiku/player'
var ReactDOM = require('react-dom') // Installed as a peer dependency of '@haiku/player'
var HaikuReactAdapter = require('@haiku/player/dom/react')
var HaikuReactComponent = HaikuReactAdapter(require('./dom'))
if (HaikuReactComponent.default) HaikuReactComponent = HaikuReactComponent.default
module.exports = HaikuReactComponent