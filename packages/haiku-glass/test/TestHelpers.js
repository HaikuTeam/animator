import {JSDOM} from 'jsdom';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {fetchProjectConfigInfo} from '@haiku/sdk-client/lib/ProjectDefinitions';

export default class TestHelpers {
  static awaitElementById (window, id, cb) {
    const found = window.document.getElementById(id);
    if (found) {
      return cb(null, found);
    }
    return setTimeout(() => TestHelpers.awaitElementById(window, id, cb), 1000);
  }

  static createDOM (folder, cb) {
    const html = `
      <!doctype html>
      <html style="width: 100%; height: 100%;">
        <body style="width: 100%; height: 100%;">
          <!-- This needs to match what we have in index.html -->
          <div id="root" style="width: 100%; height: 100%;"></div>
        </body>
      </html>`;
    const dom = new JSDOM(html, {
      url: 'http://localhost:3000?folder=' + folder,
    });
    const win = dom.window;
    global.window = win;
    // prettier complains if we don't set this.
    global.window.Date = Date;
    global.document = win.document;
    for (const key in win) {
      if (!win.hasOwnProperty(key)) {
        continue;
      }
      if (key in global) {
        continue;
      }
      global[key] = window[key];
    }
    win.requestAnimationFrame = function requestAnimationFrame (fn) {
      return setTimeout(fn, 32);
    };
    const teardown = () => {
      win.requestAnimationFrame = () => {};
      // Must call this or else we'll get leaked handles and the test won't finish
      window.haiku.HaikuGlobalAnimationHarness.cancel();
    };
    return cb(null, win, teardown);
  }

  static createApp (folder, cb) {
    return TestHelpers.createDOM(folder, (err, win, teardown) => {
      if (err) {
        throw err;
      }
      // tslint:disable-next-line:variable-name
      const Glass = require('@glass/react/Glass').default;
      return fetchProjectConfigInfo(folder, (fetchErr, userconfig) => {
        if (fetchErr) {
          throw fetchErr;
        }
        const websocket = {on: () => {}, send: () => {}, method: () => {}, request: () => {}, action: () => {}, connect: () => {}};
        ReactDOM.render(
          React.createElement(Glass, {
            userconfig,
            websocket,
            folder,
            envoy: {mock: true},
          }),
          document.getElementById('root'),
        );
        return cb(window.timeline, window, teardown);
      });
    });
  }
}
