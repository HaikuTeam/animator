import * as electron from 'electron';
import setup from './dom';
import {sentryCallback} from 'haiku-serialization/src/utils/carbonite';
import {shouldEmitErrors} from 'haiku-common/lib/environments';

electron.ipcRenderer.on('haiku', (event, haiku) => {

  if (haiku.dotenv) {
    Object.assign(global.process.env, haiku.dotenv);
  }

  window.Raven.config('https://07b703c10ea14681a29a1a870c28e84a@sentry.io/226383', {
    environment: process.env.NODE_ENV,
    release: process.env.HAIKU_RELEASE_VERSION,
    dataCallback: sentryCallback,
    shouldSendCallback: shouldEmitErrors,
  });

  window.Raven.install();

  return window.Raven.context(() => {
    setup(haiku);
  });
});
