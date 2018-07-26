import functionToRFO from '@core/reflection/functionToRFO';
import * as tape from 'tape';
import * as TestHelpers from '../TestHelpers';

const pkg = require('../../package.json');
const VERSION = pkg.version;

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
            const {__function: {body}} = functionToRFO(component.bytecode.eventHandlers.foo.click.handler);
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
              'haiku:wrapper': {
                'sizeAbsolute.x': {0: {value: 500}},
                'sizeAbsolute.y': {0: {value: 500}},
              },
              'haiku:svg': {
                'sizeAbsolute.x': {0: {value: 100}},
                'sizeAbsolute.y': {0: {value: 100}},
              },
              'haiku:g': {
                'align.x': {0: {value: 0.2}},
                'align.y': {0: {value: 0.2}},
              },
            },
          },
          template: {
            elementName: 'div',
            attributes: {'haiku-id': 'wrapper'},
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
                  'haiku:wrapper': {
                    'sizeAbsolute.x': {0: {value: 500}},
                    'sizeAbsolute.y': {0: {value: 500}},
                  },
                  'haiku:svg': {
                    // Prior to OriginSupport (<3.2.0), SVG layout needs to be offset by -50% of element width.
                    'sizeAbsolute.x': {0: {value: 100}},
                    'sizeAbsolute.y': {0: {value: 100}},
                    'offset.x': {0: {value: 50}},
                    'offset.y': {0: {value: 50}},
                  },
                  'haiku:g': {
                    // align.x = .2 => offset.x += .2 * 100 = 20 (parent size)
                    'offset.x': {0: {value: 20}},
                    'offset.y': {0: {value: 20}},
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
