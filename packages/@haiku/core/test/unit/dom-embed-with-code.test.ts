import * as tape from 'tape';
import * as TestHelpers from '../TestHelpers';

import HaikuDOMAdapter from '@core/adapters/dom/HaikuDOMAdapter';
import code1 from '../fixtures/code1';

const pkg = require('../../package.json');
const VERSION = pkg.version;

// Tell typescript we have these types on Window
interface Window {
  HaikuCore: any;
}

declare var window: Window;

tape(
  'dom-embed-with-code',
  (t) => {
    t.plan(1);

    TestHelpers.createDOM((err, win, mount) => {
      if (err) {
        throw err;
      }
      HaikuDOMAdapter.defineOnWindow();
      const adapter = window.HaikuCore[VERSION];
      const haikuComponentFactory = adapter(code1);
      const component = haikuComponentFactory(mount);
      component.context.clock.GLOBAL_ANIMATION_HARNESS.cancel();
      t.ok(true);
    });
  },
);
