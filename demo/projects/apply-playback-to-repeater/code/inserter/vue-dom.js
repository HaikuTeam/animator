var HaikuVueAdapter = require('@haiku/core/dom/vue')
var HaikuVueComponent = HaikuVueAdapter(require('./dom'))
if (HaikuVueComponent.default) HaikuVueComponent = HaikuVueComponent.default
module.exports = HaikuVueComponent