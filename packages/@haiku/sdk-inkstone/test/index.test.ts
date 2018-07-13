import {inkstoneConfig} from '@sdk-inkstone/config';
import {inkstone} from '@sdk-inkstone/index';
import * as tape from 'tape';

tape('index', (suite: tape.Test) => {
  suite.test('setConfig', (test: tape.Test) => {
    test.is(inkstoneConfig.baseUrl, 'https://inkstone.haiku.ai/', 'default base URL');
    test.is(inkstoneConfig.baseShareUrl, 'https://share.haiku.ai/', 'default base share URL');
    test.is(inkstoneConfig.authToken, undefined, 'default auth token is undefined');
    inkstone.setConfig({
      baseUrl: 'baseUrl',
      baseShareUrl: 'baseShareUrl',
      authToken: 'foobar',
    });
    test.deepEqual(
      inkstoneConfig,
      {
        baseUrl: 'baseUrl',
        baseShareUrl: 'baseShareUrl',
        authToken: 'foobar',
      },
      'inkstone.setConfig overrides defaults',
    );

    // Restore defaults for future tests.
    inkstone.setConfig({
      baseUrl: 'https://inkstone.haiku.ai/',
      baseShareUrl: 'https://share.haiku.ai/',
      authToken: undefined,
    });

    test.end();
  });

  suite.end();
});
