import {client as sdkClient} from '@haiku/sdk-client';
import {inkstone} from '@haiku/sdk-inkstone';
import {UserHandler} from '@sdk-creator/bll/User';
import EnvoyLogger from '@sdk-creator/envoy/EnvoyLogger';
import EnvoyServer from '@sdk-creator/envoy/EnvoyServer';
import {stubProperties} from 'haiku-testing/lib/mock';
import * as tape from 'tape';
import * as WebSocket from 'ws';

tape('User', async (suite) => {
  const envoyServer = new EnvoyServer({
    WebSocket,
    logger: new EnvoyLogger('warn'),
  });

  await envoyServer.ready();
  const userHandler = new UserHandler(envoyServer);

  suite.test('authenticate.noResponse', (test) => {
    const [mockAuthenticate, unstub] = stubProperties(inkstone.user, 'authenticate');
    mockAuthenticate.callsArgWith(2, undefined, undefined, undefined);
    userHandler.authenticate('foo', 'bar').catch(({code}) => {
      test.is(code, 407, 'no response sends code 407');
      unstub();
      test.end();
    });
  });

  suite.test('authenticate.unauthorized', (test) => {
    const [mockAuthenticate, unstub] = stubProperties(inkstone.user, 'authenticate');
    mockAuthenticate.callsArgWith(2, undefined, undefined, {statusCode: 401});
    userHandler.authenticate('foo', 'bar').catch((error) => {
      test.deepEqual(error, {code: 401, message: 'Unauthorized'}, '401 is forwarded with message "Unauthorized"');
      unstub();
      test.end();
    });
  });

  suite.test('authenticate.500', (test) => {
    const [mockAuthenticate, unstub] = stubProperties(inkstone.user, 'authenticate');
    mockAuthenticate.callsArgWith(2, undefined, undefined, {statusCode: 400});
    userHandler.authenticate('foo', 'bar').catch((error) => {
      test.deepEqual(error, {code: 500, message: 'Auth HTTP Error: 400'}, 'generic errors resolve to code 500');
      unstub();
      test.end();
    });
  });

  suite.test('authenticate.500', (test) => {
    const [mockAuthenticate, unstub] = stubProperties(inkstone.user, 'authenticate');
    mockAuthenticate.callsArgWith(2, undefined, undefined, {statusCode: 400});
    userHandler.authenticate('foo', 'bar').catch((error) => {
      test.deepEqual(error, {code: 500, message: 'Auth HTTP Error: 400'}, 'generic errors resolve to code 500');
      unstub();
      test.end();
    });
  });

  suite.test('authenticate.e2e', (test) => {
    const [mockSetConfig, unstubInkstone] = stubProperties(inkstone, 'setConfig');
    const [mockList, unstubAuthenticate] = stubProperties(inkstone.organization, 'list');
    const [mockAuthenticate, mockGet, unstubOrg] = stubProperties(inkstone.user, 'authenticate', 'get');
    const [
      mockSetAuthToken,
      mockGetAuthToken,
      unstubSdkClient,
    ] = stubProperties(sdkClient.config, 'setAuthToken', 'getAuthToken');
    const [mockNow, unstubDate] = stubProperties(Date, 'now');
    mockNow.returns(123456789);
    const [mockSetConfigObfuscated, unstub] = stubProperties(userHandler, 'setConfigObfuscated');
    mockAuthenticate.callsArgWith(2, undefined, {Token: 'auth_token'}, {statusCode: 200});
    mockGet.callsArgWith(0, undefined, {Username: 'foo@foo.com'});
    mockList.callsArgWith(0, undefined, [{Name: 'Foo'}]);
    mockGetAuthToken.returns('auth_token');
    userHandler.authenticate('foo', 'bar').then((identity) => {
      test.true(mockAuthenticate.calledWith('foo', 'bar'), 'inkstone.user.authenticate called with credentials');
      test.true(mockSetAuthToken.calledWith('auth_token'), 'sdkClient receives auth token for persistence');
      test.true(mockSetConfig.calledWithMatch({authToken: 'auth_token'}), 'auth token was set in inkstone during load');
      test.deepEqual(identity.user, {Username: 'foo@foo.com'}, 'user was stored in identity');
      test.deepEqual(identity.organization, {Name: 'Foo'}, 'org was stored in identity');
      test.is(identity.lastOnline, 123456789, 'lastOnline was captured');
      test.deepEqual(userHandler.getIdentity(), {
        user: {Username: 'foo@foo.com'},
        organization: {Name: 'Foo'},
        lastOnline: 123456789,
        isOnline: true,
      }, 'identity remains stored on User model');
      test.true(mockSetConfigObfuscated.calledWith('id', identity));
      unstub();
      unstubDate();
      unstubSdkClient();
      unstubOrg();
      unstubAuthenticate();
      unstubInkstone();
      test.end();
    });
  });

  envoyServer.close();
  suite.end();
});
