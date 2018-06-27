import HaikuDOMAdapter from '@core/adapters/dom/HaikuDOMAdapter';
import * as tape from 'tape';
import {createDOM} from '../TestHelpers';

tape(
  'component.getInjectables',
  (t) => {
    const bytecode = {
      // Checking that the bytecode itself can define options
      options: {
        contextMenu: 'foobar123',
      },
      states: {
        baz: {
          value: 'abc',
        },
      },
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

    createDOM((err, win) => {
      // Combo passing options at root and nested
      const haikuComponentFactory = HaikuDOMAdapter(
        bytecode,
        {},
        win,
      );

      // Pass loop at root level
      const component = haikuComponentFactory(
        this.mount,
        {
          states: {
            bux: {
              value: 9000,
            },
          },
        },
      );

      const injectables = component.getInjectables();

      t.ok(injectables.baz);
      t.equal(
        injectables.baz,
        'string',
      );

      t.ok(injectables.bux);
      t.equal(
        injectables.bux,
        'number',
      );

      component.context.clock.GLOBAL_ANIMATION_HARNESS.cancel();

      t.end();
    });
  },
);
