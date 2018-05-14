import * as tape from 'tape';
const PACKAGE = require('./../../package.json');
import * as TestHelpers from './../TestHelpers';
// tslint:disable-next-line:variable-name
const HaikuDOMAdapter = require('./../../lib/adapters/dom').default;
import Config from './../../lib/Config';
tape('passingOptions', (t) => {
  t.plan(6);

  const bytecode = {
    // Checking that the bytecode itself can define options
    options: {
      contextMenu: 'foobar123',
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

  // tslint:disable-next-line:variable-name
  TestHelpers.createDOM((err, win, b, HaikuGlobal) => {
    // Combo passing options at root and nested
    const haikuComponentFactory = HaikuDOMAdapter(bytecode, {
      position: 'yaya890',
      overflowX: 'uio66',
    },                                            win);

    // Pass loop at root level
    const component = haikuComponentFactory(this.mount, {
      loop: true,
      onHaikuComponentDidMount() {},
      states: {
        bux: {
          value: 9000,
        },
      },
    });

    t.equal(component.config.loop, true, 'loop was set');
    t.equal(component.config.contextMenu, 'foobar123', 'ctx menu was set');
    t.equal(component.config.position, 'yaya890', 'pos was set');
    t.equal(component.config.overflowX, 'uio66', 'overflow was set');

    t.ok(component.config.onHaikuComponentDidMount);

    t.equal(component._states.bux, 9000, 'states were set');

    component.context.clock.GLOBAL_ANIMATION_HARNESS.cancel();
  });
});
