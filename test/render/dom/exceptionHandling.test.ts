import {stubProperties} from 'haiku-testing/lib/mock';
import * as tape from 'tape';
import {createRenderTest} from '../../TestHelpers';

tape(
  'render.dom.exceptionHandling',
  (test: tape.Test) => {
    const template = {
      elementName: 'div',
      attributes: {'haiku-id': 'abcde'},
      children: [],
    };

    const timelines = {
      Default: {
        'haiku:abcde': {
          'sizeAbsolute.x': {0: {value: 1600}},
          'sizeAbsolute.y': {0: {value: 1200}},
        },
      },
    };

    createRenderTest(
      template,
      timelines,
      {},
      (err, mount, renderer, context, component, teardown) => {
        if (err) {
          throw err;
        }
        const [mockWarn, unstub] = stubProperties(console, 'warn');
        test.false(component.isDeactivated, 'component is initially activated');
        // This will make things crash!
        mount.firstChild.haiku.virtual.layout.scale = null;
        context.tick();
        test.true(mockWarn.calledWith('[haiku core] caught error during tick'), 'console warned an error during tick');
        test.true(component.isDeactivated, 'component was deactivated due to error');
        teardown();
        unstub();
        test.end();
      },
    );
  },
);
