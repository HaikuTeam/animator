import * as tape from 'tape';
const pkg = require('./../../package.json');
import * as TestHelpers from './../TestHelpers';
// tslint:disable-next-line:variable-name
const HaikuDOMAdapter = require('./../../dom');

// Tell typescript we have these types on Window
interface Window {
  HaikuCore: any;
}

declare var window: Window;

tape('dom-embed-with-code', (t) => {
  t.plan(1);

  TestHelpers.createDOM((err, win, mount) => {
    if (err) { throw err; }
    HaikuDOMAdapter.defineOnWindow();
    const adapter = window.HaikuCore[pkg.version];
    const haikuComponentFactory = adapter(require('./../fixtures/code1.ts'));
    const component = haikuComponentFactory(mount);
    component.context.clock.GLOBAL_ANIMATION_HARNESS.cancel();
    t.ok(true);
  });
});
