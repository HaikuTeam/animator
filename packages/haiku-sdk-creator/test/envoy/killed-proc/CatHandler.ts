import EnvoyServer from '@sdk-creator/envoy/EnvoyServer';

export default class CatHandler {
  private server: EnvoyServer;

  constructor (server) {
    this.server = server;
  }

  meow (source: string, num: number): number {
    this.server.emit('cat', {
      name: 'meowed',
      payload: {
        source,
        num,
      },
    });
    return num;
  }
}
