import * as tape from 'tape';
const pkg = require('./../../package.json');
import createDOM from 'haiku-testing/src/helpers/createDOM';
// tslint:disable-next-line:variable-name
const HaikuDOMAdapter = require('./../../dom');
// tslint:disable-next-line:variable-name
const Haiku = require('@haiku/core');

const code1 = {
  timelines: {Default: {}},
  template: {elementName: 'div', attributes: {}, children: []},
};

// Tell typescript we have these types on Window
interface Window {
  HaikuCore: any;
}

declare var window: Window;

tape('dom-embed-with-code', (t) => {
  t.plan(1);

  createDOM('my/folder', (err, $mount, $root, $win) => {
    if (err) {
      throw err;
    }

    HaikuDOMAdapter.defineOnWindow();
    const adapter = window.HaikuCore[pkg.version];
    const haikuComponentFactory = adapter(code1);
    const component = haikuComponentFactory($mount);
    component.context.clock.GLOBAL_ANIMATION_HARNESS.cancel();
    $win['teardown']();

    t.ok(true);
  });
});
