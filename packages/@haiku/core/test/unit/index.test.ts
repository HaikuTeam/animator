import * as tape from 'tape';
const TestHelpers = require('./../TestHelpers');
tape('index', (t) => {
  t.plan(1);
  const bytecode = {
    timelines: {
      Default: {
        'haiku:abcdefghijk': {
          opacity: {
            0: {
              value: 1,
            },
          },
        },
      },
    },
    template: {
      elementName: 'div',
      attributes: {'haiku-id': 'abcdefghijk'},
      children: [],
    },
  };
  TestHelpers.createComponent(bytecode, {}, function (core, teardown) {
    teardown();
    t.ok(true);
  });
});
