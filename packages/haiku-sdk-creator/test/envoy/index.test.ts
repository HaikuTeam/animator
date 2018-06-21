import EnvoyClient from '@sdk-creator/envoy/EnvoyClient';
import EnvoyHandler from '@sdk-creator/envoy/EnvoyHandler';
import EnvoyLogger from '@sdk-creator/envoy/EnvoyLogger';
import EnvoyServer from '@sdk-creator/envoy/EnvoyServer';
import * as tape from 'tape';
import * as ws from 'ws';

tape('envoy:index:basic', async (t) => {
  t.plan(1);

  class TestHandler extends EnvoyHandler {
    doFoo (arg) {
      return 'foo, ' + arg + '!';
    }
  }

  let server: any = new EnvoyServer({logger: new EnvoyLogger('error')});
  server = await server.ready();
  server.bindHandler('foo', TestHandler, new TestHandler(server));

  const client = new EnvoyClient<TestHandler>({
    port: server.port,
    WebSocket: ws,
    logger: new EnvoyLogger('error'),
  });
  client.get('foo').then(async (fooHandler: TestHandler) => {
    const ret = await fooHandler.doFoo('meow');
    t.equal(ret, 'foo, meow!');
    server.close();
  });
});

tape('envoy:index:schema', async (t) => {
  t.plan(3);

  class TestHandler extends EnvoyHandler {
    doFoo (arg) {
      return 'foo, ' + arg + '!';
    }
  }

  let server: any = new EnvoyServer({logger: new EnvoyLogger('info')});
  server = await server.ready();
  server.bindHandler('foo', TestHandler, new TestHandler(server));

  const client = new EnvoyClient<TestHandler>({
    port: server.port,
    WebSocket: ws,
    logger: new EnvoyLogger('info'),
  });
  client.get('foo').then(async (fooHandler1: TestHandler) => {
    t.equal(await fooHandler1.doFoo('meow'), 'foo, meow!');
    client.get('foo').then(async (fooHandler2: TestHandler) => {
      t.equal(await fooHandler2.doFoo('meow'), 'foo, meow!');
      client.get('foo').then(async (fooHandler3: TestHandler) => {
        t.equal(await fooHandler3.doFoo('meow'), 'foo, meow!');
        server.close();
      });
    });
  });
});

tape('envoy:index:events', async (t) => {
  class TestEventHandler extends EnvoyHandler {
    doFoo (arg) {
      this.server.emit(
        'foo-event', {
          name: 'foo',
          payload: 'data for ' + arg,
        });
    }
  }

  let server: any = new EnvoyServer({logger: new EnvoyLogger('error')});
  server = await server.ready();
  server.bindHandler('foo-event', TestEventHandler, new TestEventHandler(server));

  const client = new EnvoyClient<TestEventHandler>({
    port: server.port,
    WebSocket: ws,
    logger: new EnvoyLogger('error'),
  });
  client.get('foo-event').then(async (fooClient: TestEventHandler) => {
    const handler = (payload) => {
      t.equal(payload, 'data for dayz');
      server.close();
      // @ts-ignore
      fooClient.off('foo', handler);
    };
    // @ts-ignore
    fooClient.on('foo', handler);
    fooClient.doFoo('dayz');
    fooClient.doFoo('wonthappensowontfail');
    t.end();
  });
});
