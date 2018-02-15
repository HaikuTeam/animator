/**
 * Proxy Type.
 * @enum {string}
 */
export const enum ProxyType {
  Proxyed = 'PROXY',
  Direct = 'DIRECT',
}

/**
 * Canonical method to detect if a proxy string provided by electron
 */
export const isProxied = (proxyString: string) => {
  return proxyString !== ProxyType.Direct;
};
