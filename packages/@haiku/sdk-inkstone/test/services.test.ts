import {newGetRequest, newPutRequest} from '@sdk-inkstone/services';
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

  suite.test('RequestBuilder.errorHandling.restful', (test: tape.Test) => {
    const [mockGet, unstub] = stubProperties(requestInstance, 'get');
    mockGet.callsArgWith(1, null, {headers: {'x-inkstone-error-code': 'E_FOOBAR'}}, null);
    newGetRequest()
      // @ts-ignore
      .withEndpoint('/foo/:id')
      .call((err: Error) => {
        test.is(err.message, 'E_FOOBAR');
      });

    unstub();
    test.end();
  });

  suite.test('RequestBuilder.errorHandling.default', (test: tape.Test) => {
    const [mockGet, unstub] = stubProperties(requestInstance, 'get');
    mockGet.callsArgWith(1, null, {headers:{}, statusCode: 400});
    newGetRequest()
      // @ts-ignore
      .withEndpoint('/foo/:id')
      .call((err: Error) => {
        test.is(err.message, 'E_UNCATEGORIZED');
      });

    unstub();
    test.end();
  });

  suite.test('RequestBuilder.errorHandling.defaultOffline', (test: tape.Test) => {
    const [mockGet, unstub] = stubProperties(requestInstance, 'get');
    mockGet.callsArgWith(1, new Error('ECONNRESET'));
    newGetRequest()
      // @ts-ignore
      .withEndpoint('/foo/:id')
      .call((err: Error) => {
        test.is(err.message, 'E_OFFLINE');
      });

    unstub();
    test.end();
  });

  suite.end();
});
