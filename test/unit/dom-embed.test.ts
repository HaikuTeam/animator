import * as tape from 'tape';
import * as TestHelpers from '../TestHelpers';

import HaikuDOMAdapter from '@core/adapters/dom/HaikuDOMAdapter';

const pkg = require('../../package.json');
const VERSION = pkg.version;

// Tell typescript we have these types on Window
interface Window {
  HaikuResolve: any;
  HaikuCore: any;
}

declare var window: Window;

tape(
  'dom-embed',
  (t) => {
    t.plan(13);

    TestHelpers.createDOM((err, win, mount) => {
      if (err) {
        throw err;
      }

      HaikuDOMAdapter.defineOnWindow();

      t.ok(
        window.HaikuCore[VERSION],
        'core attached to window',
      );

      const adapter = window.HaikuCore[VERSION];

      t.is(
        adapter,
        HaikuDOMAdapter,
        'adapter is adapter',
      );
      t.is(
        window.HaikuResolve(VERSION),
        adapter,
        'HaikuResolve can resolve the adapter at current version',
      );
      t.is(
        window.HaikuResolve('99.99.99'),
        undefined,
        'HaikuResolve does not resolve a version that is too high',
      );
      t.is(
        window.HaikuResolve('0.0.1'),
        undefined,
        'HaikuResolve does not resolve a version that is too low',
      );
      const originalVersionParts = VERSION.split('.').map(Number);
      const onePatchBehind = [...originalVersionParts];
      onePatchBehind[2] = Math.max(onePatchBehind[2] - 1, 0);
      t.is(
        window.HaikuResolve(onePatchBehind.join('.')),
        adapter,
        'HaikuResolve can resolve from an earlier patch',
      );
      const onePatchAhead = [...originalVersionParts];
      onePatchAhead[2] += 1;
      t.is(
        window.HaikuResolve(onePatchAhead.join('.')),
        undefined,
        'HaikuResolve cannot resolve from a later patch',
      );

      const haikuComponentFactory = adapter({
        timelines: {Default: {foo: {}}},
        template: {
          elementName: 'div',
          attributes: {id: 'foo '},
          children: [],
        },
      });

      t.equal(
        haikuComponentFactory.PLAYER_VERSION,
        VERSION,
        'player version equal',
      ); // #LEGACY
      t.equal(
        haikuComponentFactory.CORE_VERSION,
        VERSION,
        'core version equal',
      );

      const component = haikuComponentFactory(mount);

      t.equal(
        component.constructor.__name__,
        'HaikuComponent',
        'component is component',
      );
      t.equal(
        component.constructor.name,
        'HaikuComponent',
        'component is component',
      );
      t.equal(
        component.PLAYER_VERSION,
        VERSION,
        'player version equal',
      ); // #LEGACY
      t.equal(
        component.CORE_VERSION,
        VERSION,
        'core version equal',
      );

      component.context.clock.GLOBAL_ANIMATION_HARNESS.cancel();
    });
  },
);
