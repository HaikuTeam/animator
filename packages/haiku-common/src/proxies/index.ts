import {parse} from 'url';

/**
 * Proxy Type.
 * @enum {string}
 */
export enum ProxyType {
  Proxied = 'PROXY',
  Direct = 'DIRECT',
}

/**
 * Canonical method to detect if a proxy string provided by electron
 */
export const isProxied = (proxyString: string) => {
  return proxyString !== ProxyType.Direct;
};

export interface ProxyDescriptor {
  host: string;
  port?: number;
  username?: string;
  password?: string;
  disableEncryption?: boolean;
}

/**
 * Given a proxy descriptor, return a fully-qualified proxy URL.
 * @param {ProxyDescriptor} descriptor
 * @returns {string}
 * TODO: Do we ever need to support secure proxy URLs?
 */
export const buildProxyUrl = (descriptor: ProxyDescriptor): string => {
  if (!descriptor.host) {
    return '';
  }

  const portSuffix = descriptor.port ? `:${descriptor.port}` : '';

  if (descriptor.username && descriptor.password) {
    return `http://${encodeURIComponent(descriptor.username)}:${encodeURIComponent(descriptor.password)}@` +
      `${descriptor.host}${portSuffix}`;
  }

  return `http://${descriptor.host}${portSuffix}`;
};

/**
 * Given a PAC-sourced URL like 'secure.megacorp.com:3128', return a ProxyDescriptor object.
 * @param {string} url
 * @returns {ProxyDescriptor}
 */
export const describeProxyFromUrl = (url?: string): ProxyDescriptor => {
  if (!url || !isProxied(url)) {
    return {host: ''};
  }

  const parsedUrl = parse(url.startsWith('http') ? url : `http://${url}`);
  const proxyDescriptor = {host: parsedUrl.hostname} as ProxyDescriptor;
  if (parsedUrl.port) {
    proxyDescriptor.port = Number(parsedUrl.port);
  }

  if (parsedUrl.auth) {
    [proxyDescriptor.username, proxyDescriptor.password] = parsedUrl.auth.split(':');
  }

  return proxyDescriptor;
};
