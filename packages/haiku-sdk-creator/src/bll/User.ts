import {client as sdkClient, FILE_PATHS} from '@haiku/sdk-client';
import {inkstone} from '@haiku/sdk-inkstone';

import {Registry} from '../dal/Registry';
import {MaybeAsync} from '../envoy';
import EnvoyHandler from '../envoy/EnvoyHandler';

export const USER_CHANNEL = 'user';

export enum UserSettings {
  LastViewedChangelog = 'lastViewedChangelog',
  DefaultTimeDisplayMode = 'defaultTimeDisplayMode',
  TimeDisplayModes = 'timeDisplayModes',
  FigmaToken = 'figmaToken',
  Identity = 'id',
}

export interface HaikuIdentity {
  organization?: inkstone.organization.Organization;
  user?: inkstone.user.User;
  lastOnline?: number;
  isOnline: boolean;
}

/**
 * Deliberately eraseable list of privileges for the organization.
 */
export const enum OrganizationPrivilege {
  PrivateProjectLimit = 'P0',
  EnableOfflineFeatures = 'P1',
}

export class UserHandler extends EnvoyHandler {
  private readonly identity: HaikuIdentity = {
    // We'll negate this later if we find it to be the case.
    isOnline: true,
  };

  protected registry = new Registry(FILE_PATHS.HAIKU_HOME);

  reportActivity () {
    const authToken = sdkClient.config.getAuthToken();
    // Faked query string to keep squirrel happy.  as this is not genuinely an 'update' check, this shouldn't matter.
    return inkstone.updates.check(authToken, '?platform=mac&environment=production&branch=master', () => {
      // Noop.
    });
  }

  getUser (): MaybeAsync<inkstone.user.User> {
    return this.identity.user;
  }

  getOrganization (): MaybeAsync<inkstone.organization.Organization> {
    return this.identity.organization;
  }

  private recoverIdentityOffline (): MaybeAsync<void> {
    const identity = this.getConfigObfuscated<HaikuIdentity>(UserSettings.Identity);
    Object.assign(
      this.identity,
      this.getConfigObfuscated<HaikuIdentity>(UserSettings.Identity),
      {isOnline: false},
    );

    if (this.identity.user && this.identity.organization) {
      this.server.emit(USER_CHANNEL, {
        payload: identity,
        name: `${USER_CHANNEL}:load`,
      });
    }
  }

  getIdentity (): MaybeAsync<HaikuIdentity> {
    return this.identity;
  }

  logOut (): MaybeAsync<void> {
    sdkClient.config.setAuthToken('');
    this.deleteConfig(UserSettings.FigmaToken);
    this.deleteConfig(UserSettings.Identity);
    delete this.identity.organization;
    delete this.identity.user;
    return;
  }

  authenticate (username: string, password: string): Promise<HaikuIdentity> {
    this.logOut();
    return new Promise<HaikuIdentity>((resolve, reject) => {
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

  getPrivilege (privilege: OrganizationPrivilege): MaybeAsync<any> {
    return this.identity.organization && this.identity.organization[privilege];
  }

  checkOfflinePrivileges (): MaybeAsync<boolean> {
    return this.getPrivilege(OrganizationPrivilege.EnableOfflineFeatures);
  }

  checkPrivateProjectLimit (): MaybeAsync<number> {
    return this.getPrivilege(OrganizationPrivilege.PrivateProjectLimit);
  }

  load (): Promise<HaikuIdentity> {
    return new Promise<HaikuIdentity>((resolve) => {
      const authToken = sdkClient.config.getAuthToken();
      if (!authToken) {
        return resolve(this.identity);
      }

      inkstone.setConfig({authToken});
      inkstone.organization.list((err, organizations) => {
        if (err || !organizations) {
          this.recoverIdentityOffline();
          return resolve(this.identity);
        }

        this.identity.organization = organizations[0];
        inkstone.user.get((userErr, user) => {
          if (!userErr) {
            this.identity.user = user;
            this.identity.lastOnline = Date.now();
            this.setConfigObfuscated<HaikuIdentity>(
              UserSettings.Identity,
              this.identity,
            );
            this.server.emit(USER_CHANNEL, {
              payload: this.identity,
              name: `${USER_CHANNEL}:load`,
            });
          }

          return resolve(this.identity);
        });
      });
    });
  }
}
