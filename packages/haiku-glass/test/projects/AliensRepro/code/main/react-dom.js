var React = require('react') // Installed as a peer dependency of '@haiku/player'
var ReactDOM = require('react-dom') // Installed as a peer dependency of '@haiku/player'
var HaikuReactAdapter = require('@haiku/player/dom/react')
var React_Alien = HaikuReactAdapter(require('./dom'))
if (React_Alien.default) React_Alien = React_Alien.default
module.exports = React_Alien