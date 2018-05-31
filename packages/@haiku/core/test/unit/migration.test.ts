const tape = require('tape');
const VERSION = require('../../package.json').version;
import functionToRFO from '../../src/reflection/functionToRFO';
import createDOMComponent from 'haiku-testing/src/helpers/createDOMComponent';

tape('Migration', (t) => {
  tape('timelineDefaultFrames', (t) => {
    const oldBytecode = {
      metadata: {
        core: '3.2.22',
      },
      options: {
        // Necessary for us to be able to see what we're doing!
        hotEditingMode: true,
      },
      eventHandlers: {
        foo: {
          click: {
            // tslint:disable
            handler: function(event) {
              const functionThatReturns2 = (ignoredArg) => {
                return 2;
              };

              this.seek(1000);
              this.getDefaultTimeline().gotoAndPlay(functionThatReturns2({blah: functionThatReturns2('hey')}));
            },
            // tslint:enable
          },
        },
      },
    };

    createDOMComponent('my/folder', oldBytecode, {}, (err, component)  => {
      if (err) {
        throw err;
      }

      t.is(component.bytecode.metadata.core, VERSION);
      const {__function: {body}} = functionToRFO(component.bytecode.eventHandlers.foo.click.original);
      t.true(body.indexOf(`this.seek(1000, 'ms');`) > 0);
      t.true(body.indexOf(
        `this.getDefaultTimeline().gotoAndPlay(functionThatReturns2({ blah: functionThatReturns2('hey') }), 'ms');`)
        > 0);
      component['teardown']();
      t.end();
    });
  });

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

    createDOMComponent('my/folder', oldBytecode, {}, (err, component)  => {
      if (err) {
        throw err;
      }

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
      component['teardown']();
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

    createDOMComponent('my/folder', newBytecode, {}, (err, component)  => {
      if (err) {
        throw err;
      }

      t.deepEqual(newBytecode.timelines, {
        Default: {
          'haiku:svg': {},
        },
      });
      component['teardown']();
      t.end();
    });
  });

  t.end();
});
