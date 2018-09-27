import * as Raven from 'raven';
import {shouldEmitErrors} from 'haiku-common/lib/environments';
import {SentryReporter} from 'haiku-sdk-creator/lib/bll/Error';

global.sentryReporter = new SentryReporter();
Raven.config('https://4dfb3b0e4ae2479b8340019bcd1fd423:c9d508bea6294acdb97fe499dd98eab7@sentry.io/226390', {
  release: process.env.HAIKU_RELEASE_VERSION,
  environment: process.env.NODE_ENV,
  dataCallback: global.sentryReporter.callback.bind(global.sentryReporter),
  shouldSendCallback: shouldEmitErrors,
});

Raven.install();

export default Raven;
