var React = require('react') // Installed as a peer dependency of '@haiku/core'
var ReactDOM = require('react-dom') // Installed as a peer dependency of '@haiku/core'
var HaikuReactAdapter = require('@haiku/core/dom/react')
var React_AndroidFiltersV2 = HaikuReactAdapter(require('./dom'))
if (React_AndroidFiltersV2.default) React_AndroidFiltersV2 = React_AndroidFiltersV2.default
module.exports = React_AndroidFiltersV2