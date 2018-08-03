import {client as sdkClient} from '@haiku/sdk-client';
import {inkstone} from '@haiku/sdk-inkstone';

import {Registry} from '../dal/Registry';
import {MaybeAsync} from '../envoy';

export interface User {
  reportActivity: MaybeAsync<() => void>;
  setConfig: MaybeAsync<(key: string, value: string) => void>;
  getConfig: MaybeAsync<(key: string) => string>;
  getAuthToken: MaybeAsync<() => string>;
  getUserDetails: MaybeAsync<() => MaybeAsync<inkstone.user.User>>;
}

export const USER_CHANNEL = 'user';

export enum UserSettings {
  lastViewedChangelog = 'lastViewedChangelog',
  defaultTimeDisplayMode = 'defaultTimeDisplayMode',
  timeDisplayModes = 'timeDisplayModes',
  figmaToken = 'figmaToken',
  doNotDisplayConfirmGroupPopoup = 'doNotDisplayConfirmGroupPopoup',
}

export class UserHandler implements User {

  reportActivity () {
    const authToken = sdkClient.config.getAuthToken();
    // Faked query string to keep squirrel happy.  as this is not genuinely an 'update' check, this shouldn't matter.
    return inkstone.updates.check(authToken, '?platform=mac&environment=production&branch=master', () => {
      // Noop.
    });
  }

  setConfig (key: string, value: string) {
    Registry.setConfig(key, value);
  }

  getConfig (key: string): string {
    return Registry.getConfig(key);
  }

  getAuthToken (): string {
    return sdkClient.config.getAuthToken();
  }

  getUserId (): string {
    return sdkClient.config.getUserId();
  }

  getUserDetails (): Promise<inkstone.user.User> {
    return new Promise<inkstone.user.User>((resolve) => {
      inkstone.user.getDetails(this.getAuthToken(), (err, user) => {
        resolve(user);
      });
    });
  }
}
