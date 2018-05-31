import * as fs from 'fs';
import * as path from 'path';
import {JSDOM} from 'jsdom';

// tslint:disable-next-line:variable-name
const HaikuDOMAdapter = require('@haiku/core/lib/adapters/dom').default;

// tslint:disable-next-line:variable-name
const HaikuDOMRenderer = require('@haiku/core/lib/renderers/dom').default;

// Tell typescript we have these types on Global
interface Global {
  window: any;
  document: any;
  haiku: any;
}

declare var global: Global;

export default (folder: string, cb: Function) => {
  const html = `
    <!doctype html>
    <html style="width: 100%; height: 100%;">
      <body style="width: 100%; height: 100%;">
        <div id="root" style="width: 100%; height: 100%;"></div>
      </body>
    </html>`;

  const dom = new JSDOM(html, {
    url: 'http://localhost:3000?folder=' + folder,
  });

  const $win = dom.window;

  global.window = $win;
  global.document = $win.document;

  for (const key in $win) {
    if (!$win.hasOwnProperty(key)) {
      continue;
    }

    if (key in global) {
      continue;
    }

    global[key] = $win[key];
  }

  $win.requestAnimationFrame = (fn) => {
    return setTimeout(fn, 32);
  };

  const $root = $win.document.getElementById('root');
  const $mount = $win.document.createElement('div');

  $mount.width = 800;
  $mount.height = 600;

  // Trick jsdom into giving us proper layout on mounts so we can write sizing tests.
  Object.defineProperties($win.HTMLElement.prototype, {
    offsetWidth: {
      get: () => $mount.width,
    },
    offsetHeight: {
      get: () => $mount.height,
    },
  });

  $root.appendChild($mount);

  $win['teardown'] = () => {
    $win.requestAnimationFrame = () => {};

    // Must call this or else we'll get leaked handles and the test won't finish
    if ($win['haiku'] && $win['haiku'].HaikuGlobalAnimationHarness) {
      $win['haiku'].HaikuGlobalAnimationHarness.cancel();
    }
  };

  cb(null, $mount, $root, $win);
};
