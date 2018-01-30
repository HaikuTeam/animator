import * as requestLib from 'request';
import * as _ from 'lodash';

const ENDPOINTS = {
  USER_LOGIN: 'v0/admin/user/auth',
};

let request = requestLib.defaults({
  // Delegate to the browser to handle "strictSSL" if we're in a browser context. We have seen some false
  // negatives with the 'request' Node dependency in certain context, and every modern browser has its own,
  // battle-hardened strict SSL behavior which will stop requests in preflight regardless of this setting.
  // There isn't an unspoofable way to prove we're in a browser and not Node, but the check here is perfectly valid.
  strictSSL: typeof window === 'undefined' || Object.prototype.toString.call(window) !== '[object Window]',
});

/**
 * @function safeError
 * @description Flexibly return an error in cases where we might not have
 * received an actual error object but still need to return an error payload.
 */
function safeError(err: any): any {
  if (err) {
    return err;
  }

  return new Error('Uncategorized error');
}

export namespace adminSdk {

  export interface InkstoneConfig {
    baseUrl?: string;
    haikuBinaryPath?: string;
  }

  const inkstoneConfig: InkstoneConfig = {
    baseUrl: process.env.HAIKU_API || 'https://inkstone.haiku.ai/',
    haikuBinaryPath: '/Applications/Haiku.app/Contents/MacOS/Haiku',
  };

  export function setConfig(newVals: InkstoneConfig) {
    _.extend(inkstoneConfig, newVals);

    // ease SSL restrictions for dev
    if (newVals.baseUrl && newVals.baseUrl.indexOf('https://localhost') === 0) {
      request = requestLib.defaults({
        strictSSL: false,
      });
    }
  }

  export type Callback<T> = (err: string, data: T, response: requestLib.RequestResponse) => void;

  export namespace user {

    export interface Authentication {
      Expiration: string;
      Token: string;
    }

    export function authenticate(authToken: string, username, cb: adminSdk.Callback<Authentication>) {
      const formData = {
        username,
      };

      const options: requestLib.UrlOptions & requestLib.CoreOptions = {
        url: inkstoneConfig.baseUrl + ENDPOINTS.USER_LOGIN,
        json: formData,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `INKSTONE auth_token="${authToken}"`,
        },
      };

      request.post(options, (err, httpResponse, body) => {
        if (httpResponse && httpResponse.statusCode === 200) {
          const auth = body as Authentication;
          cb(undefined, auth, httpResponse);
        } else {
          cb(err, undefined, httpResponse);
        }
      });
    }
  }

}
