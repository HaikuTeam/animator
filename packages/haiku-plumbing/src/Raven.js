import * as Raven from 'raven';
import {sentryCallback} from 'haiku-serialization/src/utils/carbonite';
import {shouldEmitErrors} from 'haiku-common/lib/environments';

Raven.config('https://4dfb3b0e4ae2479b8340019bcd1fd423:c9d508bea6294acdb97fe499dd98eab7@sentry.io/226390', {
  release: process.env.HAIKU_RELEASE_VERSION,
  environment: process.env.NODE_ENV,
  dataCallback: sentryCallback,
  shouldSendCallback: shouldEmitErrors,
});

Raven.install();

export default Raven;
