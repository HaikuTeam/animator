import * as request from 'request';

export interface RequestInstance {
  get: (options: request.OptionsWithUrl, cb: request.RequestCallback) => void;
  post: (options: request.OptionsWithUrl, cb: request.RequestCallback) => void;
  put: (options: request.OptionsWithUrl, cb: request.RequestCallback) => void;
  delete: (options: request.OptionsWithUrl, cb: request.RequestCallback) => void;
}

const getInstanceWithDefaults = (defaults: request.CoreOptions): RequestInstance => {
  if (typeof request.defaults === 'function') {
    return request.defaults(defaults);
  }

  return {
    get: (options: request.OptionsWithUrl, cb: request.RequestCallback) => request.get(
      {...defaults, ...options},
      cb,
    ),
    post: (options: request.OptionsWithUrl, cb: request.RequestCallback) => request.post(
      {...defaults, ...options},
      cb,
    ),
    put: (options: request.OptionsWithUrl, cb: request.RequestCallback) => request.put(
      {...defaults, ...options},
      cb,
    ),
    delete: (options: request.OptionsWithUrl, cb: request.RequestCallback) => request.del(
      {...defaults, ...options},
      cb,
    ),
  };
};

export const requestInstance = getInstanceWithDefaults({
  // Delegate to the browser to handle "strictSSL" if we're in a browser context. We have seen some false
  // negatives with the 'request' Node dependency in certain contextx, and every modern browser has its own,
  // battle-hardened strict SSL behavior which will stop requests in preflight regardless of this setting.
  // There isn't an unspoofable way to prove we're in a browser and not Node, but the check here is perfectly valid.
  strictSSL: typeof window === 'undefined' || Object.prototype.toString.call(window) !== '[object Window]',
  withCredentials: true,
});
