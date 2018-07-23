import {client as sdkClient} from '@haiku/sdk-client';
import {inkstone} from '@haiku/sdk-inkstone';

import {Registry} from '../dal/Registry';
import {MaybeAsync} from '../envoy';
import EnvoyHandler from '../envoy/EnvoyHandler';

export const USER_CHANNEL = 'user';

export enum UserSettings {
  lastViewedChangelog = 'lastViewedChangelog',
  defaultTimeDisplayMode = 'defaultTimeDisplayMode',
  timeDisplayModes = 'timeDisplayModes',
  figmaToken = 'figmaToken',
}

export interface OrganizationAndUser {
  organization?: inkstone.organization.Organization;
  user?: inkstone.user.User;
}

export class UserHandler extends EnvoyHandler {
  private organization: inkstone.organization.Organization;
  private user: inkstone.user.User;
  private registry: Registry;

  reportActivity () {
    const authToken = sdkClient.config.getAuthToken();
    // Faked query string to keep squirrel happy.  as this is not genuinely an 'update' check, this shouldn't matter.
    return inkstone.updates.check(authToken, '?platform=mac&environment=production&branch=master', () => {
      // Noop.
    });
  }

  getUser (): MaybeAsync<inkstone.user.User> {
    return this.user;
  }

  getOrganization (): MaybeAsync<inkstone.organization.Organization> {
    return this.organization;
  }

  getOrganizationAndUser (): MaybeAsync<OrganizationAndUser> {
    return {
      organization: this.organization,
      user: this.user,
    };
  }

  logOut (): MaybeAsync<void> {
    sdkClient.config.setAuthToken('');
    this.setConfig(UserSettings.figmaToken, null);
    this.organization = this.user = undefined;
    return;
  }

  authenticate (username: string, password: string): Promise<OrganizationAndUser> {
    this.logOut();
    return new Promise<OrganizationAndUser>((resolve, reject) => {
      inkstone.user.authenticate(username, password, (authErr, authResponse, httpResponse) => {
        // #FIXME: currently uses legacy hacky status codes forwarded to caller.
        if (!httpResponse) {
          return reject({
            code: 407,
            message: 'Unable to log in. Are you behind a VPN?',
          });
        }

        if (httpResponse.statusCode === 401 || httpResponse.statusCode === 403) {
          return reject({
            code: httpResponse.statusCode,
            message: httpResponse.body || 'Unauthorized',
          });
        }

        if (httpResponse.statusCode > 299) {
          return reject({
            code: 500,
            message: `Auth HTTP Error: ${httpResponse.statusCode}`,
          });
        }

        if (!authResponse) {
          return reject({
            code: 500,
            message: 'Auth response was empty',
          });
        }

        sdkClient.config.setAuthToken(authResponse.Token);
        resolve(this.load());
      });
    });
  }

  load (): Promise<OrganizationAndUser> {
    return new Promise<OrganizationAndUser>((resolve) => {
      const authToken = sdkClient.config.getAuthToken();
      if (!authToken) {
        return resolve({});
      }

      inkstone.setConfig({authToken});
      inkstone.organization.list((err, organizations) => {
        if (err || !organizations) {
          return resolve({});
        }

        this.organization = organizations[0];
        inkstone.user.get((userErr, user) => {
          if (!userErr) {
            this.user = user;
            this.server.emit(USER_CHANNEL, {
              payload: user,
              name: `${USER_CHANNEL}:load`,
            });
          }

          return resolve(this.getOrganizationAndUser());
        });
      });
    });
  }

  setConfig (key: string, value: string) {
    if (this.registry) {
      this.registry.setConfig(key, value);
    }
  }

  getConfig (key: string): string {
    if (this.registry) {
      return this.registry.getConfig(key);
    }
  }
}
