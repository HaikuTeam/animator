let HaikuVueAdapter = require('@haiku/core/dom/vue');
let HaikuVueComponent = HaikuVueAdapter(require('./dom'));
if (HaikuVueComponent.default) {
  HaikuVueComponent = HaikuVueComponent.default;
}

const Thing = {
  data () {
    return {foo: 'Vue DOM Stateful Thing Component Was Here'};
  },
  template: '<div style="color: green">{{foo}}</div>',
};

module.exports = {
  template: `
<container>
  <span style="color: blue;">Meow meow</span>
  <thing></thing>
  <span style="color: red;">Chirp chirp</span>
</container>
`,
  components: {
    container: HaikuVueComponent,
    thing: Thing,
  },
};
