import HaikuDOMAdapter from '@core/adapters/dom/HaikuDOMAdapter';
import * as tape from 'tape';
import {createDOM} from '../TestHelpers';

const pkg = require('../../package.json');
const VERSION = pkg.version;

tape(
  'exposedProperties',
  (t) => {
    t.plan(6);
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
    createDOM((err, win) => {
      const haikuComponentFactory = HaikuDOMAdapter(
        bytecode,
        {},
        win,
      );

      t.equal(
        haikuComponentFactory.PLAYER_VERSION,
        VERSION,
        'player version is present on factory',
      ); // #LEGACY
      t.equal(
        haikuComponentFactory.CORE_VERSION,
        VERSION,
        'core version is present on factory',
      );

      const mount = win.document.createElement('div');
      mount.style.width = '800px';
      mount.style.height = '600px';
      win.document.body.appendChild(mount);

      const component = haikuComponentFactory(
        mount,
        {},
      );

      // These get assigned when the component factory runs
      t.ok(haikuComponentFactory.renderer);
      t.ok(haikuComponentFactory.bytecode);

      t.equal(
        component.PLAYER_VERSION,
        VERSION,
        'player version is present on component',
      ); // #LEGACY
      t.equal(
        component.CORE_VERSION,
        VERSION,
        'core version is present on component',
      );

      component.context.clock.GLOBAL_ANIMATION_HARNESS.cancel();
    });
  },
);
