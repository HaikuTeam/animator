import * as net from 'net';

const DEFAULT_PORT_SEARCH_START = 45032;
let DEFAULT_HOST = global.process.env.HAIKU_PLUMBING_HOST || '0.0.0.0';
const ADDRESS_IN_USE_CODE = 'EADDRINUSE';
const DNS_ERROR_CODE = 'ENOTFOUND';

/**
 * @function findOpenPort
 * @description On the given host, return the port number of an open port. Note that the host must be
 * specified, otherwise you end up getting false positives! E.g. ipv4 0.0.0.0 vs ipv6 ::.
 * You can pass a starting port search as the first argument, otherwise pass null and we'll use ours.
 */
export default function findOpenPort (
  inPort: number, inHost: string, cb: (err: any, host?: string|number, port?: number) => void): void {
  const port = inPort || DEFAULT_PORT_SEARCH_START;
  const host = inHost || DEFAULT_HOST;

  const server = net.createServer();

  try {
    server.listen(port, host);

    server.once('listening', () => {
      server.once('close', () => {
        return cb(null, host, port);
      });
      server.close();
    });

    server.on('error', (err: any) => {
      if (err && err.code === ADDRESS_IN_USE_CODE) {
        return findOpenPort(port + 1, host, cb);
      }

      if (err && err.code === DNS_ERROR_CODE && inHost !== '0.0.0.0') {
        DEFAULT_HOST = global.process.env.HAIKU_PLUMBING_HOST = '0.0.0.0';
        return findOpenPort(port, DEFAULT_HOST, cb);
      }

      // If not an address-in-use error, something bad has happened and we likely shouldn't continue.
      return cb(err);
    });
  } catch (exception) {
    return cb(exception);
  }
}
