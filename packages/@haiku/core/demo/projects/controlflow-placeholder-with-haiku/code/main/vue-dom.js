const HaikuVueAdapter = require('@haiku/core/dom/vue');
const HaikuVueComponent = HaikuVueAdapter(require('./dom'));
if (HaikuVueComponent.default) {
  HaikuVueComponent = HaikuVueComponent.default;
}
const TestMicro = require('./micro/vue-dom');

module.exports = {
  template: `
<container>
  <test-micro></test-micro>
</container>
`,
  components: {
    container: HaikuVueComponent,
    'test-micro': TestMicro,
  },
};
