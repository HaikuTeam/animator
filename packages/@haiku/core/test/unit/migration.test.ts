const tape = require('tape');
const VERSION = require('../../package.json').version;
const TestHelpers = require('../TestHelpers');

tape('upgradeBytecodeInPlace', (t) => {
  tape('legacyOriginSupport', (t) => {
    const oldBytecode = {
      metadata: {
        core: '3.1.20',
      },
      timelines: {
        Default: {
          'haiku:svg': {},
          'haiku:g': {
            'origin.x': {0: {value: 0.5}},
            'origin.y': {0: {value: 0.5}},
            'mount.x': {0: {value: 0.5}},
            'mount.y': {0: {value: 0.5}},
          },
        },
      },
      template: {
        children: [
          {
            elementName: 'svg',
            attributes: {'haiku-id': 'svg'},
            children: [{
              elementName: 'g',
              attributes: {'haiku-id': 'g'},
            }],
          },
          {
            elementName: 'svg',
            attributes: {'haiku-id': 'nonexistentButShouldntCrash'},
          },
        ],
      },
    };

    TestHelpers.createComponent(oldBytecode, {}, (component, teardown)  => {
      t.is(component.bytecode.metadata.core, VERSION);
      t.deepEqual(component.bytecode.timelines, {
        Default: {
          'haiku:svg': {
            'mount.x': {0: {value: -0.5}},
            'mount.y': {0: {value: -0.5}},
          },
          'haiku:g': {
            'origin.x': {0: {value: 0.5}},
            'origin.y': {0: {value: 0.5}},
            'mount.x': {0: {value: 0}},
            'mount.y': {0: {value: 0}},
            'mount.z': {0: {value: 0}},
          },
        },
      });
      teardown();
    });

    const newBytecode = {
      metadata: {
        core: '99.99.99',
      },
      timelines: {
        Default: {
          'haiku:svg': {},
        },
      },
      template: {
        children: [{
          elementName: 'svg',
          attributes: {'haiku-id': 'svg'},
        }],
      },
    };

    TestHelpers.createComponent(newBytecode, {}, (component, teardown)  => {
      t.deepEqual(newBytecode.timelines, {
        Default: {
          'haiku:svg': {},
        },
      });
      teardown();
      t.end();
    });
  });

  t.end();
});
