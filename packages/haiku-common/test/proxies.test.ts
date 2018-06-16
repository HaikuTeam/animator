import * as tape from 'tape';

import {buildProxyUrl, describeProxyFromUrl, isProxied} from '@common/proxies';

tape('proxies', (suite: tape.Test) => {
  suite.test('isProxied', (test: tape.Test) => {
    test.true(isProxied('PROXY localhost:3128'), 'proxy PACs are proxied');
    test.false(isProxied('DIRECT'), 'direct PACs are not proxied');
    test.end();
  });

  suite.test('buildProxyUrl', (test: tape.Test) => {
    test.is(buildProxyUrl({host: ''}), '', 'host is required or proxy URL is empty string');
    test.is(buildProxyUrl({host: 'foobar.com'}), 'http://foobar.com', 'default port is 80 (implicitly)');
    test.is(buildProxyUrl({host: 'foobar.com', port: 8080}), 'http://foobar.com:8080', 'port is appended when passed');
    test.is(
      buildProxyUrl({host: 'foobar.com', port: 8080, username: 'bob bob', password: 'pass pass'}),
      'http://bob%20bob:pass%20pass@foobar.com:8080',
      'basic auth credentials are passed into proxy URL encoded',
    );
    test.end();
  });

  suite.test('describeProxyFromUrl', (test: tape.Test) => {
    test.deepEqual(describeProxyFromUrl('DIRECT'), {host: ''}, 'ignores direct urls');
    test.deepEqual(describeProxyFromUrl('http://localhost:3128'), {host: 'localhost', port: 3128}, 'parses http URLs');
    test.deepEqual(describeProxyFromUrl('localhost'), {host: 'localhost'}, 'parses portless, protocol-inferred URLs');
    test.deepEqual(
      describeProxyFromUrl('mr%20kitty:woof%20woof@localhost'),
      {host: 'localhost', username: 'mr kitty', password: 'woof woof'},
      'parses credentials and does not require protocol in PAC payload',
    );
    test.end();
  });

  suite.end();
});
