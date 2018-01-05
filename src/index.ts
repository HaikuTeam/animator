import * as requestLib from 'request';
import * as _ from 'lodash';

// TODO: make file paths cross-platform friendly
const ENDPOINTS = {
  PROJECT_CREATE: 'v0/project',
  LOGIN: 'v0/user/auth',
  CHANGE_PASSWORD: 'v0/user/password',
  ORGANIZATION_LIST: 'v0/organization',
  PROJECT_LIST: 'v0/project',
  INVITE_PREFINERY_CHECK: 'v0/invite/check',
  INVITE_CHECK: 'v0/invite/:CODE',
  INVITE_CLAIM: 'v0/invite/claim',
  SNAPSHOT_GET_BY_ID: 'v0/snapshot/:ID',
  SNAPSHOT_SYNDICATED_BY_ID: 'v0/snapshot/:ID/syndicated',
  PROJECT_SNAPSHOT_BY_NAME_AND_SHA: 'v0/project/:NAME/snapshot/:SHA',
  PROJECT_GET_BY_NAME: 'v0/project/:NAME',
  PROJECT_DELETE_BY_NAME: 'v0/project/:NAME',
  SUPPORT_UPLOAD_GET_PRESIGNED_URL: 'v0/support/upload/:UUID',
  UPDATES: 'v0/updates',
};

let request = requestLib.defaults({
  strictSSL: true,
});

const DEFAULT_TIMEOUT_MS = 5000;

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

export namespace inkstone {

  export interface InkstoneConfig {
    baseUrl?: string;
    baseShareUrl?: string;
    haikuBinaryPath?: string;
  }

  const inkstoneConfig: InkstoneConfig = {
    baseUrl: 'https://inkstone.haiku.ai/',
    baseShareUrl: 'https://share.haiku.ai/',
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

  export namespace support {
    export function getPresignedUrl(authToken: string, uuid: string, cb: inkstone.Callback<String>) {
      const options: requestLib.UrlOptions & requestLib.CoreOptions = {
        url: inkstoneConfig.baseUrl + ENDPOINTS.SUPPORT_UPLOAD_GET_PRESIGNED_URL.replace(':UUID', uuid),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `INKSTONE auth_token="${authToken}"`,
        },
      };

      request.get(options, (err, httpResponse, body) => {
        if (httpResponse && httpResponse.statusCode === 200) {
          const url = body as string;
          cb(undefined, url, httpResponse);
        } else {
          cb(safeError(err), null, httpResponse);
        }
      });
    }

  }

  export namespace user {

    export interface Authentication {
      Expiration: string;
      Token: string;
    }

    export interface ChangePasswordParams {
      OldPassword: string;
      NewPassword: string;
    }

    export function authenticate(username, password, cb: inkstone.Callback<Authentication>) {
      const formData = {
        username,
        password,
      };

      const options: requestLib.UrlOptions & requestLib.CoreOptions = {
        url: inkstoneConfig.baseUrl + ENDPOINTS.LOGIN,
        json: formData,
        headers: {
          'Content-Type': 'application/json',
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

    export function changePassword(authToken: string, params: ChangePasswordParams, cb: inkstone.Callback<string>) {
      const options: requestLib.UrlOptions & requestLib.CoreOptions = {
        strictSSL: false,
        url: inkstoneConfig.baseUrl + ENDPOINTS.CHANGE_PASSWORD,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `INKSTONE auth_token="${authToken}"`,
        },
        json: params,
      };

      request.post(options, (err, httpResponse, body) => {
        if (httpResponse && httpResponse.statusCode === 200) {
          const response = body as string;
          cb(undefined, response, httpResponse);
        } else {
          const response = body as string;
          cb(response, undefined, httpResponse);
        }
      });
    }
  }

  export namespace invite {
    export interface Invite {
      Code: string;
    }

    export interface InvitePresetDetails {
      Valid?: Validity;
      Email?: string;
      OrganizationName?: string;
    }

    export interface InviteClaim {
      Code: string;
      Email: string;
      Password: string;
      OrganizationName?: string;
    }

    export interface PrefineryCheckParams {
      Code: string;
      Email: string;
    }

    export enum Validity {
      VALID = 0,
      INVALID = 1,
      ALREADY_CLAIMED = 2,
      ERROR = 3,
    }

    export function getInviteFromPrefineryCode(params: PrefineryCheckParams, cb: inkstone.Callback<Invite>) {
      const options: requestLib.UrlOptions & requestLib.CoreOptions = {
        strictSSL: false,
        url: inkstoneConfig.baseUrl + ENDPOINTS.INVITE_PREFINERY_CHECK,
        headers: {
          'Content-Type': 'application/json',
        },
        json: params,
      };

      request.post(options, (err, httpResponse, body) => {
        if (httpResponse && httpResponse.statusCode === 200) {
          const project = body as Invite;
          cb(undefined, project, httpResponse);
        } else {
          cb(safeError(err), undefined, httpResponse);
        }
      });
    }


    export function checkValidity(code: string, cb: inkstone.Callback<InvitePresetDetails>) {
      const options: requestLib.UrlOptions & requestLib.CoreOptions = {
        url: inkstoneConfig.baseUrl + ENDPOINTS.INVITE_CHECK.replace(':CODE', code),
        headers: {
          'Content-Type': 'application/json',
        },
      };

      request.get(options, (err, httpResponse, body) => {
        if (httpResponse && httpResponse.statusCode === 200) {
          const invitePreset = JSON.parse(body) as InvitePresetDetails;
          invitePreset.Valid = Validity.VALID;
          cb(undefined, invitePreset, httpResponse);
        } else {
          if (httpResponse.statusCode === 404) {
            cb('invalid code', {Valid: Validity.INVALID}, httpResponse);
          } else if (httpResponse.statusCode === 410) {
            cb('code already claimed', {Valid: Validity.ALREADY_CLAIMED}, httpResponse);
          } else {
            cb(safeError(err), {Valid: Validity.ERROR}, httpResponse);
          }
        }
      });
    }

    export function claimInvite(claim: InviteClaim, cb: inkstone.Callback<boolean>) {
      const options: requestLib.UrlOptions & requestLib.CoreOptions = {
        url: inkstoneConfig.baseUrl + ENDPOINTS.INVITE_CLAIM,
        json: claim,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      request.post(options, (err, httpResponse, body) => {
        if (httpResponse && httpResponse.statusCode === 200) {
          cb(undefined, true, httpResponse);
        } else {
          const errMessage = body as string;
          cb(errMessage, undefined, httpResponse);
        }
      });
    }
  }

  export namespace organization {
    export interface Organization {
      Name: string;
    }

    export function list(authToken: string, cb: inkstone.Callback<Organization[]>) {
      const options: requestLib.UrlOptions & requestLib.CoreOptions = {
        timeout: DEFAULT_TIMEOUT_MS,
        url: inkstoneConfig.baseUrl + ENDPOINTS.ORGANIZATION_LIST,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `INKSTONE auth_token="${authToken}"`,
        },
      };

      request.get(options, (err, httpResponse, body) => {
        if (httpResponse && httpResponse.statusCode === 200) {
          const projects = JSON.parse(body) as Organization[];
          cb(undefined, projects, httpResponse);
        } else {
          cb(safeError(err), undefined, httpResponse);
        }
      });
    }
  }

  export namespace snapshot {
    export interface Snapshot {
      UniqueId: string;
      GitTag?: string;
      GitSha?: string;
      Published: boolean;
      Syndicated: boolean;
    }
    export interface SnapshotAndProjectAndOrganization {
      Snapshot: Snapshot;
      Project: project.Project;
      Organization: organization.Organization;
    }

    // Gets a snapshot from Inkstone for a snapshot.
    export function getSnapshotLink(
      id: string,
      cb: inkstone.Callback<{snap: SnapshotAndProjectAndOrganization, link: string}>,
    ) {
      getSnapshotAndProject(id, (err, snap, response) => {
        if (err) {
          cb(err, undefined, undefined);
          return;
        }

        if (response && response.statusCode !== 200) {
          cb(err, undefined, undefined);
        } else {
          cb(undefined, {snap, link: assembleSnapshotLinkFromSnapshot(snap.Snapshot)}, response);
        }
      });
    }

    // tries (once) to get a snapshot from inkstone for a given ID git SHA.  Optionally, can append '/latest' for
    // UUID lookups [not for SHA lookups]
    export function getSnapshotAndProject(id: string, cb: inkstone.Callback<SnapshotAndProjectAndOrganization>) {
      const url = inkstoneConfig.baseUrl + ENDPOINTS.SNAPSHOT_GET_BY_ID.replace(':ID', encodeURIComponent(id));
      const options: requestLib.UrlOptions & requestLib.CoreOptions = {
        url,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      request.get(options, (err, httpResponse, body) => {
        if (httpResponse && httpResponse.statusCode === 200) {
          const snapshotAndProject = JSON.parse(body) as SnapshotAndProjectAndOrganization;
          cb(undefined, snapshotAndProject, httpResponse);
        } else {
          cb(safeError(err), undefined, httpResponse);
        }
      });
    }

    // Notifies Inkstone that a snapshot has been syndicated.
    export function registerSyndication(id: string, secretToken: string, cb: inkstone.Callback<string>) {
      const url = inkstoneConfig.baseUrl + ENDPOINTS.SNAPSHOT_SYNDICATED_BY_ID.replace(':ID', encodeURIComponent(id));
      const options: requestLib.UrlOptions & requestLib.CoreOptions = {
        url,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({secret_token: secretToken}),
      };

      request.post(options, (err, httpResponse, body) => {
        if (httpResponse && httpResponse.statusCode === 200) {
          cb(undefined, JSON.parse(body) as string, httpResponse);
        } else {
          cb(safeError(err), undefined, httpResponse);
        }
      });
    }

    export function assembleSnapshotLinkFromSnapshot(snapshot: Snapshot) {
      return `${inkstoneConfig.baseShareUrl}${snapshot.UniqueId}/latest`;
    }
  }

  export namespace project {
    export interface Project {
      Name: string;
      GitRemoteUrl: string;
      GitRemoteName: string;
      GitRemoteArn: string;
    }
    export interface Credentials {
      Username: string;
      // AccessKeyId: string
      // SecretAccessKey: string
      CodeCommitHttpsUsername: string;
      CodeCommitHttpsPassword: string;
    }
    export interface ProjectAndCredentials {
      Project: Project;
      Credentials: Credentials;
    }

    export interface ProjectCreateParams {
      Name: string;
    }

    export function create(authToken: string, params: ProjectCreateParams, cb: inkstone.Callback<Project>) {
      const options: requestLib.UrlOptions & requestLib.CoreOptions = {
        timeout: DEFAULT_TIMEOUT_MS,
        strictSSL: false,
        url: inkstoneConfig.baseUrl + ENDPOINTS.PROJECT_CREATE,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `INKSTONE auth_token="${authToken}"`,
        },
        json: params,
      };

      request.post(options, (err, httpResponse, body) => {
        if (httpResponse && httpResponse.statusCode === 200) {
          const project = body as Project;
          cb(undefined, project, httpResponse);
        } else {
          cb(safeError(err), undefined, httpResponse);
        }
      });
    }

    export function list(authToken: string, cb: inkstone.Callback<Project[]>) {
      const options: requestLib.UrlOptions & requestLib.CoreOptions = {
        timeout: DEFAULT_TIMEOUT_MS,
        url: inkstoneConfig.baseUrl + ENDPOINTS.PROJECT_LIST,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `INKSTONE auth_token="${authToken}"`,
        },
      };

      request.get(options, (err, httpResponse, body) => {
        if (httpResponse && httpResponse.statusCode === 200) {
          const projects = JSON.parse(body) as Project[];
          cb(undefined, projects, httpResponse);
        } else {
          cb(safeError(err), undefined, httpResponse);
        }
      });
    }

    export function getByName(authToken: string, name: string, cb: inkstone.Callback<ProjectAndCredentials>) {
      const options: requestLib.UrlOptions & requestLib.CoreOptions = {
        timeout: DEFAULT_TIMEOUT_MS,
        url: inkstoneConfig.baseUrl + ENDPOINTS.PROJECT_GET_BY_NAME.replace(':NAME', encodeURIComponent(name)),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `INKSTONE auth_token="${authToken}"`,
        },
      };

      request.get(options, (err, httpResponse, body) => {
        if (httpResponse && httpResponse.statusCode === 200) {
          const project = JSON.parse(body) as ProjectAndCredentials;
          cb(undefined, project, httpResponse);
        } else {
          cb(safeError(err), undefined, httpResponse);
        }
      });
    }

    export function deleteByName(authToken: string, name: string, cb: inkstone.Callback<boolean>) {

      const options: requestLib.UrlOptions & requestLib.CoreOptions = {
        url: inkstoneConfig.baseUrl + ENDPOINTS.PROJECT_DELETE_BY_NAME.replace(':NAME', encodeURIComponent(name)),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `INKSTONE auth_token="${authToken}"`,
        },
      };

      request.delete(options, (err, httpResponse, body) => {
        if (httpResponse && httpResponse.statusCode === 200) {
          cb(undefined, true, httpResponse);
        } else {
          cb(safeError(err), undefined, httpResponse);
        }
      });
    }

    export function createProjectSnapshotByNameAndSha(
      authToken: string, name: string, sha: string, cb: inkstone.Callback<snapshot.Snapshot>) {
      const options: requestLib.UrlOptions & requestLib.CoreOptions = {
        url: inkstoneConfig.baseUrl + ENDPOINTS.PROJECT_SNAPSHOT_BY_NAME_AND_SHA
          .replace(':NAME', encodeURIComponent(name))
          .replace(':SHA', encodeURIComponent(sha)),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `INKSTONE auth_token="${authToken}"`,
        },
      };

      request.put(options, (err, httpResponse, body) => {
        if (httpResponse && httpResponse.statusCode === 200) {
          const snapshot = JSON.parse(body) as snapshot.Snapshot;
          return cb(undefined, snapshot, httpResponse);
        }

        cb(safeError(err), undefined, httpResponse);
      });
    }
  }

  export namespace updates {
    export function check(authToken: string, query: string, cb: inkstone.Callback<boolean>) {

      const options: requestLib.UrlOptions & requestLib.CoreOptions = {
        url: inkstoneConfig.baseUrl + ENDPOINTS.UPDATES + query,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `INKSTONE auth_token="${authToken}"`,
        },
      };

      request.get(options, (err, httpResponse, body) => {
        if (httpResponse && httpResponse.statusCode === 200) {
          cb(undefined, true, httpResponse);
        } else {
          cb(safeError(err), undefined, httpResponse);
        }
      });
    }
  }
}
