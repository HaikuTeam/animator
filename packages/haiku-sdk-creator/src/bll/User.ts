import { client as sdkClient } from '@haiku/sdk-client';
import { inkstone } from '@haiku/sdk-inkstone';
import { MaybeAsync } from '../envoy';

import { Registry } from '../dal/Registry';

export interface User {
  reportActivity: MaybeAsync<() => void>;
  setConfig: MaybeAsync<(key: string, value: string) => void>;
  getConfig: MaybeAsync<(key: string) => string>;
  getAuthToken: MaybeAsync<() => string>;
}

export const USER_CHANNEL = 'user';

export class UserHandler implements User {

  reportActivity() {
    const authToken = sdkClient.config.getAuthToken();
    //faked query string to keep squirrel happy.  as this is not genuinely an 'update' check, this shouldn't matter
    return inkstone.updates.check(authToken, '?platform=mac&environment=production&branch=master', () => { });
  }

  setConfig(key: string, value: string) {
    Registry.setConfig(key, value);
  }

  getConfig(key): string {
    return Registry.getConfig(key);
  }

  getAuthToken(): string {
    return sdkClient.config.getAuthToken();
  }

  getUserId(): string {
    return sdkClient.config.getUserId();
  }

}
