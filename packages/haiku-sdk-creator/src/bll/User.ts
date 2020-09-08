import {client as sdkClient, FILE_PATHS} from '@haiku/sdk-client';
import {inkstone} from '@haiku/sdk-inkstone';
import {ErrorCode} from '@haiku/sdk-inkstone/lib/errors';
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
  // #FIXME: capitalize after conflict resolution.
  DoNotDisplayConfirmGroupPopoup = 'doNotDisplayConfirmGroupPopoup',
}

export interface HaikuIdentity {
  organization?: inkstone.organization.Organization;
  user?: inkstone.user.User;
  lastOnline?: number;
}

/**
 * Deliberately eraseable list of privileges for the organization.
 */
export const enum OrganizationPrivilege {
  PrivateProjectLimit = 'P0',
  EnableOfflineFeatures = 'P1',
}

/**
 * Deliberately obscure private method for getting the current date.
 */
const nowDate = () =>
  global[String.fromCharCode(0x44, 0x61, 0x74, 0x65)][String.fromCharCode(0b1101110, 0b1101111, 0b1110111)]();

export class UserHandler extends EnvoyHandler {
  private readonly identity: HaikuIdentity = {};

  // We'll negate this later if we find it to be the case.
  private isOnline = true;

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

  getTrialDaysRemaining (): MaybeAsync<number> {
    const org = this.identity.organization;
    if (!org) { // not authenticated
      return 0;
    }

    const epoch = org.TrialStartDate;
    const startDate = new Date(0);
    startDate.setUTCSeconds(epoch);

    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + org.TrialDurationDays);

    const currentTime = new Date();

    const remainingMilliseconds = endDate.getTime() - currentTime.getTime();
    const remainingDays = remainingMilliseconds / 86400000;

    return Math.ceil(remainingDays);
  }

  isTrialExpired (): MaybeAsync<boolean> {
    // if the user is pro or not authenticated, the answer is false
    const org = this.identity.organization;
    if (!org || org.Role !== inkstone.organization.Role.FREE) {
      return false;
    }

    return this.getTrialDaysRemaining() <= 0;
  }

  private storeOnlineUser () {
    this.identity.lastOnline = nowDate();
    this.setConfigObfuscated<HaikuIdentity>(
      UserSettings.Identity,
      this.identity,
    );
  }

  private recoverIdentityOffline (): MaybeAsync<void> {
    Object.assign(
      this.identity,
      this.getConfigObfuscated<HaikuIdentity>(UserSettings.Identity),
    );

    if (this.identity.user && this.identity.organization) {
      // Check if the offline window has expired.
      if (
        this.checkOfflinePrivileges() &&
        this.identity.organization.PlanExpirationDate &&
        this.identity.organization.PlanExpirationDate < nowDate() / 1e3
      ) {
        this.identity.organization[OrganizationPrivilege.EnableOfflineFeatures] = false;
        this.setConfigObfuscated<HaikuIdentity>(
          UserSettings.Identity,
          this.identity,
        );
      }

      this.server.emit(USER_CHANNEL, {
        payload: this.identity,
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

  checkOnline (): Promise<boolean> {
    return new Promise((resolve) => {
      inkstone.isOnline().then((isOnline) => {
        this.isOnline = isOnline;
        if (this.isOnline) {
          this.storeOnlineUser();
        }

        resolve(this.isOnline);
      });
    });
  }

  load (): Promise<HaikuIdentity> {
    return new Promise<HaikuIdentity>((resolve) => {
      const authToken = sdkClient.config.getAuthToken();
      const reset = () => {
        this.logOut();
        resolve(this.identity);
      };

      if (!authToken) {
        return reset();
      }

      inkstone.setConfig({authToken});
      inkstone.organization.list((err, organizations) => {
        if (err && err.message !== ErrorCode.ErrorOffline) {
          // If we errored for any reason other than being offline, continue as if we have no auth token.
          return reset();
        }

        if (!organizations || err) {
          this.recoverIdentityOffline();
          return resolve(this.identity);
        }

        this.identity.organization = organizations[0];
        inkstone.user.get((userErr, user) => {
          if (!userErr) {
            this.identity.user = user;
            this.storeOnlineUser();
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
