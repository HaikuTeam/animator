const tape = require('tape');
const upgradeBytecodeInPlace = require('../../lib/helpers/upgradeBytecodeInPlace').default;
const VERSION = require('../../package.json').version;

tape('upgradeBytecodeInPlace', (t) => {
  tape('legacyOriginSupport', (t) => {
    const oldBytecode = {
      metadata: {
        core: '3.1.20',
      },
      timelines: {
        Default: {
          'haiku:svg': {},
        },
      },
      template: {
        children: [
          {
            elementName: 'svg',
            attributes: {'haiku-id': 'svg'},
          },
          {
            elementName: 'svg',
            attributes: {'haiku-id': 'nonexistentButShouldntCrash'},
          },
        ],
      },
    };

    upgradeBytecodeInPlace(oldBytecode);

    t.is(oldBytecode.metadata.core, VERSION);
    t.deepEqual(oldBytecode.timelines, {
      Default: {
        'haiku:svg': {
          'mount.x': {0: {value: -0.5}},
          'mount.y': {0: {value: -0.5}},
        },
      },
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

    upgradeBytecodeInPlace(newBytecode);
    t.deepEqual(newBytecode.timelines, {
      Default: {
        'haiku:svg': {},
      },
    });
    t.end();
  });

  t.end();
});
