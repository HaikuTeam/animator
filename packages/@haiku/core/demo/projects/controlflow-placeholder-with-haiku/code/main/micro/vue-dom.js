const HaikuVueAdapter = require('@haiku/core/dom/vue');
const HaikuVueComponent = HaikuVueAdapter(require('./dom'));
if (HaikuVueComponent.default) {
  HaikuVueComponent = HaikuVueComponent.default;
}
module.exports = HaikuVueComponent;
