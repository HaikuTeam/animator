import * as ws from 'ws';
import * as tape from 'tape';
import EnvoyClient from '@sdk-creator/envoy/EnvoyClient';
import EnvoyServer from '@sdk-creator/envoy/EnvoyServer';
import EnvoyLogger from '@sdk-creator/envoy/EnvoyLogger';

tape('envoy:index:basic', async (t) => {
  t.plan(1);

  class TestHandler {
    doFoo(arg) {
      return 'foo, ' + arg + '!';
    }
  }

  let server: any = new EnvoyServer({logger: new EnvoyLogger('error')});
  server = await server.ready();
  server.bindHandler('foo', TestHandler, new TestHandler());

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

  class TestHandler {
    doFoo(arg) {
      return 'foo, ' + arg + '!';
    }
  }

  let server: any = new EnvoyServer({logger: new EnvoyLogger('info')});
  server = await server.ready();
  server.bindHandler('foo', TestHandler, new TestHandler());

  const client = new EnvoyClient<TestHandler>({
    port: server.port,
    WebSocket: ws,
    logger: new EnvoyLogger('info'),
  });
  client.get('foo').then(async (fooHandler: TestHandler) => {
    t.equal(await fooHandler.doFoo('meow'), 'foo, meow!');
    client.get('foo').then(async (fooHandler: TestHandler) => {
      t.equal(await fooHandler.doFoo('meow'), 'foo, meow!');
      client.get('foo').then(async (fooHandler: TestHandler) => {
        t.equal(await fooHandler.doFoo('meow'), 'foo, meow!');
        server.close();
      });
    });
  });
});

tape('envoy:index:events', async (t) => {
  class TestEventHandler {
    private server: EnvoyServer;

    constructor(server: EnvoyServer) {
      this.server = server;
    }

    doFoo(arg) {
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
  client.get('foo-event').then(async (fooClient: TestEventHandler & {on, off}) => {
    const handler = (payload) => {
      t.equal(payload, 'data for dayz');
      server.close();
      fooClient.off('foo', handler);
    };
    fooClient.on('foo', handler);
    fooClient.doFoo('dayz');
    fooClient.doFoo('wonthappensowontfail');
    t.end();
  });
});
