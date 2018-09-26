import {ipcRenderer} from 'electron';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as qs from 'qs';
import * as Websocket from 'haiku-serialization/src/ws/Websocket';
import * as MockWebsocket from 'haiku-serialization/src/ws/MockWebsocket';
import Timeline from './components/Timeline';
import {sentryCallback} from 'haiku-serialization/src/utils/carbonite';
import * as logger from 'haiku-serialization/src/utils/LoggerInstance';
import {fetchProjectConfigInfo} from '@haiku/sdk-client/lib/ProjectDefinitions';
import {shouldEmitErrors} from 'haiku-common/lib/environments';

// We are in a webview; use query string parameters for boot-up configuration
const search = (window.location.search || '').split('?')[1] || '';
const params = qs.parse(search, {plainObjects: true});
const config = Object.assign({}, params);
if (config.dotenv) {
  Object.assign(global.process.env, config.dotenv);
}

const mixpanel = require('haiku-serialization/src/utils/Mixpanel');

window.Raven.config('https://d045653ab5d44c808480fa6c3fa8e87c@sentry.io/226387', {
  environment: process.env.NODE_ENV,
  release: process.env.HAIKU_RELEASE_VERSION,
  dataCallback: sentryCallback,
  shouldSendCallback: shouldEmitErrors,
});

window.Raven.install();

window.Raven.context(() => {
  if (!config.folder) {
    throw new Error('A folder (the absolute path to the user project) is required');
  }
  function _fixPlumbingUrl (url) {
    return url.replace(/^http/, 'ws');
  }

  return fetchProjectConfigInfo(config.folder, (err, userconfig) => {
    if (err) {
      throw err;
    }

    const websocket = (config.plumbing)
      ? new Websocket(_fixPlumbingUrl(config.plumbing), config.folder, 'controllee', 'timeline', null, config.socket.token)
      : new MockWebsocket(ipcRenderer);

    websocket.on('open', () => {
      logger.setWebsocket(websocket);
    });

    websocket.on('close', () => {
      logger.setWebsocket(null);
    });

    // Add extra context to Sentry reports, this info is also used by carbonite.
    const folderHelper = config.folder.split('/').reverse();
    window.Raven.setExtraContext({
      organizationName: folderHelper[1] || 'unknown',
      projectName: folderHelper[0] || 'unknown',
      projectPath: config.folder,
    });
    window.Raven.setUserContext({
      email: config.email,
    });

    mixpanel.mergeToPayload({
      distinct_id: config.email,
    });

    window.isWebview = config.webview;

    ReactDOM.render(
      <Timeline
        mixpanel={mixpanel}
        envoy={config.envoy}
        userconfig={userconfig}
        websocket={websocket}
        folder={config.folder}
        />,
      document.getElementById('root'),
    );
  });
});
