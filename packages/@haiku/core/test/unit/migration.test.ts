import {VERSION} from '@core/HaikuComponent';
import functionToRFO from '@core/reflection/functionToRFO';
import * as tape from 'tape';
import * as TestHelpers from '../TestHelpers';

tape(
  'Migration',
  (suite) => {
    tape(
      'timelineDefaultFrames',
      (t) => {
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
                handler: function (event) {
                  const functionThatReturns2 = (ignoredArg) => {
                    return 2;
                  };

                  this.seek(1000);
                  this.getDefaultTimeline().gotoAndPlay(functionThatReturns2({blah: functionThatReturns2('hey')}));
                }, // tslint:enable
              },
            },
          },
        };

        TestHelpers.createComponent(
          oldBytecode,
          {},
          (component, teardown) => {
            t.is(
              component.bytecode.metadata.core,
              VERSION,
            );
            const {__function: {body}} = functionToRFO(component.bytecode.eventHandlers.foo.click.original);
            t.true(body.indexOf(`this.seek(1000, 'ms');`) > 0);
            t.true(
              // tslint:disable-next-line:max-line-length
              body.indexOf(`this.getDefaultTimeline().gotoAndPlay(functionThatReturns2({ blah: functionThatReturns2('hey') }), 'ms');`) >
                0,
            );
            teardown();
            t.end();
          },
        );
      },
    );

    tape(
      'legacyOriginSupport',
      (t) => {
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
                children: [
                  {
                    elementName: 'g',
                    attributes: {'haiku-id': 'g'},
                  },
                ],
              }, {
                elementName: 'svg',
                attributes: {'haiku-id': 'nonexistentButShouldntCrash'},
              },
            ],
          },
        };

        TestHelpers.createComponent(
          oldBytecode,
          {},
          (component, teardown) => {
            t.is(
              component.bytecode.metadata.core,
              VERSION,
            );
            t.deepEqual(
              component.bytecode.timelines,
              {
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
              },
            );
            teardown();
          },
        );

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
            children: [
              {
                elementName: 'svg',
                attributes: {'haiku-id': 'svg'},
              },
            ],
          },
        };

        TestHelpers.createComponent(
          newBytecode,
          {},
          (component, teardown) => {
            t.deepEqual(
              newBytecode.timelines,
              {
                Default: {
                  'haiku:svg': {},
                },
              },
            );
            teardown();
            t.end();
          },
        );
      },
    );

    suite.end();
  },
);
