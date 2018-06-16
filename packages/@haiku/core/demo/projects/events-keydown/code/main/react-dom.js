var React = require('react') // Installed as a peer dependency of '@haiku/core'
var ReactDOM = require('react-dom') // Installed as a peer dependency of '@haiku/core'
var HaikuReactAdapter = require('@haiku/core/dom/react')
var HaikuReactComponent = HaikuReactAdapter(require('./dom'))
if (HaikuReactComponent.default) HaikuReactComponent = HaikuReactComponent.default
module.exports = HaikuReactComponent