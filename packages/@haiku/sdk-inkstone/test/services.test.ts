import {newPutRequest} from '@sdk-inkstone/services';
import {requestInstance} from '@sdk-inkstone/transport';
import {stubProperties} from 'haiku-testing/lib/mock';
import * as tape from 'tape';

tape('services', (suite: tape.Test) => {
  suite.test('RequestBuilder.e2e', (test: tape.Test) => {
    const [mockPut, unstub] = stubProperties(requestInstance, 'put');
    newPutRequest()
      // @ts-ignore
      .withEndpoint('/foo/:id')
      .withUrlParameters({':id': 'fooId'})
      .withAuthToken('auth-token')
      .withJson({stuff: 'blah'})
      .withQueryParams({hey: 'ho'})
      .call(() => {});

    test.deepEqual(
      mockPut.getCall(0).args[0],
      {
        headers: {
          'X-Haiku-Version': require('../package.json').version,
          'Content-Type': 'application/json',
          Authorization: 'INKSTONE auth_token="auth-token"',
        },
        json: {stuff: 'blah'},
        url: 'https://inkstone.haiku.ai/v0/foo/fooId?hey=ho',
      },
      'called with expected parameters',
    );

    unstub();
    test.end();
  });

  suite.end();
});
