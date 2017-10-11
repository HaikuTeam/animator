var React = require('react') // Installed as a peer dependency of '@haiku/player'
var ReactDOM = require('react-dom') // Installed as a peer dependency of '@haiku/player'
var HaikuReactAdapter = require('@haiku/player/dom/react')
var React_TicTacToe1 = HaikuReactAdapter(require('./dom'))
if (React_TicTacToe1.default) React_TicTacToe1 = React_TicTacToe1.default
module.exports = React_TicTacToe1