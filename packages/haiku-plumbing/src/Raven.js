import * as Raven from 'raven';
import {shouldEmitErrors} from 'haiku-common/lib/environments';
import {SentryReporter} from 'haiku-sdk-creator/lib/bll/Error';
import * as logger from 'haiku-serialization/src/utils/LoggerInstance';

global.sentryReporter = new SentryReporter();
Raven.config('https://4dfb3b0e4ae2479b8340019bcd1fd423:c9d508bea6294acdb97fe499dd98eab7@sentry.io/226390', {
  release: process.env.HAIKU_RELEASE_VERSION,
  environment: process.env.NODE_ENV,
  dataCallback: global.sentryReporter.callback.bind(global.sentryReporter),
  shouldSendCallback: shouldEmitErrors,
});

Raven.install((err) => {
  logger.error('[plumbing] shutting down due to fatal error');
  logger.error(err && err.stack ? err.stack : err);
  // Note that we _don't_ actually close down at this point. The Sentry
  // middleware is instead responsible for dispatching a message up to Creator
  // which will block the UI in production and allow the user time to realize
  // what happened, while forbidding any non-restart action.
});

export default Raven;
