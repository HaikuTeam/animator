import * as tape from 'tape';
import * as TestHelpers from '../TestHelpers';

tape(
  'index',
  (t) => {
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
    TestHelpers.createComponent(
      bytecode,
      {},
      (core, teardown) => {
        teardown();
        t.ok(true);
      },
    );
  },
);
