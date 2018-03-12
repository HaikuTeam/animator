import * as requestLib from 'request';
import * as _ from 'lodash';
const packageJson = require('../package.json');

// TODO: make file paths cross-platform friendly
const ENDPOINTS = {
  PROJECT_CREATE: 'v0/project',
  LOGIN: 'v0/user/auth',
  CHANGE_PASSWORD: 'v0/user/password',
  ORGANIZATION_LIST: 'v0/organization',
  COMMUNITY_PROJECT_LIST: 'v0/community',
  SET_COMMUNITY_HAIKUDOS: 'v0/community/:ORGANIZATION_NAME/:PROJECT_NAME/hai-kudos',
  COMMUNITY_PROFILE: 'v0/community/:ORGANIZATION_NAME',
  FORK_COMMUNITY_PROJECT: 'v0/community/:ORGANIZATION_NAME/:PROJECT_NAME/fork',
  PROJECT_LIST: 'v0/project',
  PROJECT_UPDATE: 'v0/project',
  INVITE_PREFINERY_CHECK: 'v0/invite/check',
  INVITE_CHECK: 'v0/invite/:CODE',
  INVITE_CLAIM: 'v0/invite/claim',
  SNAPSHOT_GET_BY_ID: 'v0/snapshot/:ID',
  SNAPSHOT_SYNDICATED_BY_ID: 'v0/snapshot/:ID/syndicated',
  PROJECT_SNAPSHOT_BY_NAME_AND_SHA: 'v0/project/:NAME/snapshot/:SHA',
  PROJECT_GET_BY_NAME: 'v0/project/:NAME',
  PROJECT_GET_BY_UNIQUE_ID: 'v0/project/:UNIQUE_ID',
  PROJECT_MAKE_PUBLIC_BY_NAME_OR_UNIQUE_ID: 'v0/project/:NAME_OR_UNIQUE_ID/is_public',
  PROJECT_MAKE_PRIVATE_BY_NAME_OR_UNIQUE_ID: 'v0/project/:NAME_OR_UNIQUE_ID/is_public',
  PROJECT_DELETE_BY_NAME: 'v0/project/:NAME',
  SUPPORT_UPLOAD_GET_PRESIGNED_URL: 'v0/support/upload/:UUID',
  UPDATES: 'v0/updates',
  USER_CREATE: 'v0/user',
  USER_DETAIL: 'v0/user/detail',
  USER_CONFIRM: 'v0/user/confirm/:token',
  USER_REQUEST_CONFIRM: 'v0/user/resend-confirmation/:email',
  RESET_PASSWORD: 'v0/reset-password',
  RESET_PASSWORD_CLAIM: 'v0/reset-password/:UUID/claim',
};

let request = requestLib.defaults({
  // Delegate to the browser to handle "strictSSL" if we're in a browser context. We have seen some false
  // negatives with the 'request' Node dependency in certain contextx, and every modern browser has its own,
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

const maybeAuthorizationHeaders = (authToken?: string): {Authorization: string}|undefined => {
  if (authToken) {
    return {
      Authorization: `INKSTONE auth_token="${authToken}"`,
    };
  }

  return undefined;
};

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

  const baseHeaders = {
    'X-Haiku-Version': packageJson.version,
    'Content-Type': 'application/json',
  };

  export type Callback<T> = (err: string, data: T, response: requestLib.RequestResponse) => void;

  export namespace support {
    export function getPresignedUrl(authToken: string, uuid: string, cb: inkstone.Callback<String>) {


      const options: requestLib.UrlOptions & requestLib.CoreOptions = {
        url: inkstoneConfig.baseUrl + ENDPOINTS.SUPPORT_UPLOAD_GET_PRESIGNED_URL.replace(':UUID', uuid),
        headers: _.extend(baseHeaders, {
          Authorization: `INKSTONE auth_token="${authToken}"`,
        }),
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

    export interface User {
      Username: string;
      IsAdmin: boolean;
    }

    export function authenticate(username, password, cb: inkstone.Callback<Authentication>) {
      const formData = {
        username,
        password,
      };

      const options: requestLib.UrlOptions & requestLib.CoreOptions = {
        url: inkstoneConfig.baseUrl + ENDPOINTS.LOGIN,
        json: formData,
        headers: baseHeaders,
      };

      request.post(options, (err, httpResponse, body) => {
        if (httpResponse && httpResponse.statusCode === 200) {
          const auth = body as Authentication;
          cb(undefined, auth, httpResponse);
        } else {
          cb(safeError(err), undefined, httpResponse);
        }
      });
    }

    export function getDetails(authToken: string, cb: inkstone.Callback<User>) {
      const options: requestLib.UrlOptions & requestLib.CoreOptions = {
        url: inkstoneConfig.baseUrl + ENDPOINTS.USER_DETAIL,
        headers: _.extend(baseHeaders, {
          Authorization: `INKSTONE auth_token="${authToken}"`,
        }),
      };

      request.get(options, (err, httpResponse, body) => {
        if (httpResponse && httpResponse.statusCode === 200) {
          const response = body as User;
          cb(undefined, response, httpResponse);
        } else {
          const response = body as string;
          cb(safeError(err), undefined, httpResponse);
        }
      });
    }

    export function changePassword(authToken: string, params: ChangePasswordParams, cb: inkstone.Callback<string>) {
      const options: requestLib.UrlOptions & requestLib.CoreOptions = {
        url: inkstoneConfig.baseUrl + ENDPOINTS.CHANGE_PASSWORD,
        headers: _.extend(baseHeaders, {
          Authorization: `INKSTONE auth_token="${authToken}"`,
        }),
        json: params,
      };

      request.post(options, (err, httpResponse, body) => {
        if (httpResponse && httpResponse.statusCode === 200) {
          const response = body as string;
          cb(undefined, response, httpResponse);
        } else {
          const response = body as string;
          cb(safeError(err), undefined, httpResponse);
        }
      });
    }

    export function confirm(token: string, cb: inkstone.Callback<Authentication>) {
      const options: requestLib.UrlOptions & requestLib.CoreOptions = {
        url: inkstoneConfig.baseUrl + ENDPOINTS.USER_CONFIRM.replace(':token', token),
      };

      request.post(options, (err, httpResponse, body) => {
        if (httpResponse && httpResponse.statusCode === 200) {
          cb(undefined, body, httpResponse);
        } else {
          cb(safeError(err), undefined, httpResponse);
        }
      });
    }

    export function requestResetPassword(email: string, cb: inkstone.Callback<boolean>) {
      const options: requestLib.UrlOptions & requestLib.CoreOptions = {
        url: inkstoneConfig.baseUrl + ENDPOINTS.RESET_PASSWORD,
        headers: baseHeaders,
        body: JSON.stringify({email}),
      };

      request.post(options, (err, httpResponse, body) => {
        if (httpResponse && httpResponse.statusCode === 200) {
          cb(undefined, true, httpResponse);
        } else {
          cb(safeError(err), undefined, httpResponse);
        }
      });
    }

    export function requestConfirmEmail(email: string, cb: inkstone.Callback<Authentication>) {
      const options: requestLib.UrlOptions & requestLib.CoreOptions = {
        url: inkstoneConfig.baseUrl + ENDPOINTS.USER_REQUEST_CONFIRM.replace(':email', email),
        headers: baseHeaders,
      };

      request.post(options, (err, httpResponse, body) => {
        if (httpResponse && httpResponse.statusCode === 200) {
          cb(undefined, body, httpResponse);
        } else {
          cb(safeError(err), undefined, httpResponse);
        }
      });
    }

    export function claimResetPassword(
      resetPasswordUUID: string, password: string, cb: inkstone.Callback<boolean>) {

      const options: requestLib.UrlOptions & requestLib.CoreOptions = {
        url: inkstoneConfig.baseUrl + ENDPOINTS.RESET_PASSWORD_CLAIM.replace(':UUID', resetPasswordUUID),
        headers: baseHeaders,
        body: JSON.stringify({password}),
      };

      request.post(options, (err, httpResponse, body) => {
        if (httpResponse && httpResponse.statusCode === 200) {
          cb(undefined, true, httpResponse);
        } else {
          cb(safeError(err), undefined, httpResponse);
        }
      });
    }


    export interface UserCreateParams {
      Email: string;
      Password: string;
      OrganizationName: string;
      NewsletterOptIn?: boolean;
    }

    export function create(user: UserCreateParams, cb: inkstone.Callback<boolean>) {
      const options: requestLib.UrlOptions & requestLib.CoreOptions = {
        url: inkstoneConfig.baseUrl + ENDPOINTS.USER_CREATE,
        json: user,
        headers: baseHeaders,
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
        url: inkstoneConfig.baseUrl + ENDPOINTS.INVITE_PREFINERY_CHECK,
        headers: baseHeaders,
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
        headers: baseHeaders,
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
        headers: baseHeaders,
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
        url: inkstoneConfig.baseUrl + ENDPOINTS.ORGANIZATION_LIST,
        headers: _.extend(baseHeaders, {
          Authorization: `INKSTONE auth_token="${authToken}"`,
        }),
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
      cb: inkstone.Callback<{ snap: SnapshotAndProjectAndOrganization, link: string }>,
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
        headers: baseHeaders,
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
        headers: baseHeaders,
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

  export namespace community {
    export interface HaiKudos {
      TotalFromCurrentUser?: number;
      Total: number;
    }

    export interface SimpleNamedEntity {
      Name: string;
    }

    export interface CommunityProject {
      Project: SimpleNamedEntity;
      Organization: SimpleNamedEntity;
      IsSyndicated?: boolean;
      IsPublic?: boolean;
      BytecodeUrl?: string;
      StandaloneUrl?: string;
      EmbedUrl?: string;
      GifUrl?: string;
      StillUrl?: string;
      VideoUrl?: string;
      HaiKudos?: HaiKudos;
    }

    export interface OrganizationAndCommunityProjects {
      IsCurrentUser: boolean;
      Organization: organization.Organization;
      CommunityProjects: CommunityProject[];
    }

    /**
     * Get the community project list.
     *
     * Pass undefined as the first parameter if making the request on behalf of an anonymous user. If making the
     * request on behalf of a logged-in user, pass in their auth token to populate the `TotalFromCurrentUser`
     * hai-kudos field.
     * @param {string | undefined} authToken
     * @param {inkstone.Callback<inkstone.community.CommunityProject[]>} cb
     */
    export function projectList(authToken: string|undefined, cb: inkstone.Callback<CommunityProject[]>) {
      const options: requestLib.UrlOptions & requestLib.CoreOptions = {
        url: inkstoneConfig.baseUrl + ENDPOINTS.COMMUNITY_PROJECT_LIST,
        headers: {
          ...baseHeaders,
          ...maybeAuthorizationHeaders(authToken),
        },
      };

      request.get(options, (err, httpResponse, body) => {
        if (httpResponse && httpResponse.statusCode === 200) {
          cb(undefined, JSON.parse(body) as CommunityProject[], httpResponse);
        } else {
          cb(safeError(err), undefined, httpResponse);
        }
      });
    }

    /**
     * Fork a community project.
     *
     * This endpoint requires auth.
     * @param {string} authToken
     * @param {inkstone.community.CommunityProject} project
     * @param {inkstone.Callback<inkstone.project.Project>} cb
     */
    export function forkCommunityProject(
      authToken: string, project: CommunityProject, cb: inkstone.Callback<project.Project>) {
      const options: requestLib.UrlOptions & requestLib.CoreOptions = {
        url: inkstoneConfig.baseUrl + ENDPOINTS.FORK_COMMUNITY_PROJECT
          .replace(':ORGANIZATION_NAME', project.Organization.Name)
          .replace(':PROJECT_NAME', project.Project.Name),
        headers: {
          ...baseHeaders,
          ...maybeAuthorizationHeaders(authToken),
        },
      };

      request.post(options, (err, httpResponse, body) => {
        if (httpResponse && httpResponse.statusCode === 201) {
          cb(undefined, JSON.parse(body) as project.Project, httpResponse);
        } else {
          cb(safeError(err), undefined, httpResponse);
        }
      });
    }

    export interface SetHaiKudosParams {
      OrganizationName: string;
      ProjectName: string;
      Total: number;
    }

    /**
     * Give hai-kudos as an authenticated user.
     *
     * Here, hai-kudos are treated as a single entity with the expectation that the caller will debounce multiple
     * snaps into one request with a defined `Total`.
     *
     * Hai-kudos cannot be persisted as an unauthenticated user; it's expected that making users *feel like*
     * they're giving hai-kudos as an unauthenticated user is handled on the client side.
     * @param {string} authToken
     * @param {inkstone.community.SetHaiKudosParams} params
     * @param {inkstone.Callback<boolean>} cb
     */
    export function setHaiKudos(authToken: string, params: SetHaiKudosParams, cb: inkstone.Callback<boolean>) {
      const options: requestLib.UrlOptions & requestLib.CoreOptions = {
        url: inkstoneConfig.baseUrl + ENDPOINTS.SET_COMMUNITY_HAIKUDOS
          .replace(':ORGANIZATION_NAME', params.OrganizationName)
          .replace(':PROJECT_NAME', params.ProjectName),
        headers: {
          ...baseHeaders,
          ...maybeAuthorizationHeaders(authToken),
        },
        json: {
          Total: params.Total,
        },
      };

      request.put(options, (err, httpResponse) => {
        if (httpResponse && httpResponse.statusCode === 204) {
          cb(undefined, true, httpResponse);
        } else {
          cb(safeError(err), false, httpResponse);
        }
      });
    }

    /**
     * Get the community profile of an organization by name.
     *
     * Pass undefined as the first parameter if making the request on behalf of an anonymous user. If making the
     * request on behalf of a logged-in user, pass in their auth token to populate the `TotalFromCurrentUser`
     * hai-kudos field. Additionally, if the requesting user is a member of the organization, the response payload
     * will indicate `IsCurrentUser: true`.
     * @param {string | undefined} authToken
     * @param {string} organizationName
     * @param {inkstone.Callback<inkstone.community.OrganizationAndCommunityProjects>} cb
     */
    export function getProfile(
      authToken: string|undefined, organizationName: string, cb: inkstone.Callback<OrganizationAndCommunityProjects>) {
      const options: requestLib.UrlOptions & requestLib.CoreOptions = {
        url: inkstoneConfig.baseUrl + ENDPOINTS.COMMUNITY_PROFILE
          .replace(':ORGANIZATION_NAME', organizationName),
        headers: {
          ...baseHeaders,
          ...maybeAuthorizationHeaders(authToken),
        },
      };

      request.get(options, (err, httpResponse, body) => {
        if (httpResponse && httpResponse.statusCode === 200) {
          cb(undefined, JSON.parse(body) as OrganizationAndCommunityProjects, httpResponse);
        } else {
          cb(safeError(err), undefined, httpResponse);
        }
      });
    }
  }

  export namespace project {
    export interface Project {
      Name: string;
      // Deprecated: IAM-specific fields.
      GitRemoteUrl: string;
      GitRemoteName: string;
      GitRemoteArn: string;
      IsPublic: boolean;
      ForkComplete: boolean;

      // Current: GitLab-specific fields.
      RepositoryUrl: string;
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

    export interface ProjectUpdateParams {
      ID?: number;
      UniqueId?: string;
      // Name: string; // for renaming
      // GitRemoteUrl: // for user-specified git remotes
      MakePublic?: boolean;
      MakePrivate?: boolean;
    }

    export function create(authToken: string, params: ProjectCreateParams, cb: inkstone.Callback<Project>) {
      const options: requestLib.UrlOptions & requestLib.CoreOptions = {
        url: inkstoneConfig.baseUrl + ENDPOINTS.PROJECT_CREATE,
        headers: _.extend(baseHeaders, {
          Authorization: `INKSTONE auth_token="${authToken}"`,
        }),
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


    export function update(authToken: string, params: ProjectUpdateParams, cb: inkstone.Callback<Project>) {
      const options: requestLib.UrlOptions & requestLib.CoreOptions = {
        url: inkstoneConfig.baseUrl + ENDPOINTS.PROJECT_UPDATE,
        headers: _.extend(baseHeaders, {
          Authorization: `INKSTONE auth_token="${authToken}"`,
        }),
        json: params,
      };

      request.put(options, (err, httpResponse, body) => {
        if (httpResponse && httpResponse.statusCode === 200) {
          const project = body as Project;
          cb(undefined, project, httpResponse);
        } else {
          cb(safeError(err), undefined, httpResponse);
        }
      });
    }

    export function makePublic(authToken: string, nameOrUniqueId: string, cb: inkstone.Callback<boolean>) {
      const options: requestLib.UrlOptions & requestLib.CoreOptions = {
        url: inkstoneConfig.baseUrl + ENDPOINTS.PROJECT_MAKE_PUBLIC_BY_NAME_OR_UNIQUE_ID.replace(
          ':NAME_OR_UNIQUE_ID', nameOrUniqueId),
        headers: _.extend(baseHeaders, {
          Authorization: `INKSTONE auth_token="${authToken}"`,
        }),
      };

      request.put(options, (err, httpResponse) => {
        if (httpResponse && httpResponse.statusCode === 204) {
          cb(undefined, true, httpResponse);
        } else {
          cb(safeError(err), false, httpResponse);
        }
      });
    }

    export function makePrivate(authToken: string, nameOrUniqueId: string, cb: inkstone.Callback<boolean>) {
      const options: requestLib.UrlOptions & requestLib.CoreOptions = {
        url: inkstoneConfig.baseUrl + ENDPOINTS.PROJECT_MAKE_PRIVATE_BY_NAME_OR_UNIQUE_ID.replace(
          ':NAME_OR_UNIQUE_ID', nameOrUniqueId),
        headers: _.extend(baseHeaders, {
          Authorization: `INKSTONE auth_token="${authToken}"`,
        }),
      };

      request.delete(options, (err, httpResponse) => {
        if (httpResponse && httpResponse.statusCode === 204) {
          cb(undefined, true, httpResponse);
        } else {
          cb(safeError(err), false, httpResponse);
        }
      });
    }

    export function list(authToken: string, cb: inkstone.Callback<Project[]>) {
      const options: requestLib.UrlOptions & requestLib.CoreOptions = {
        url: inkstoneConfig.baseUrl + ENDPOINTS.PROJECT_LIST,
        headers: _.extend(baseHeaders, {
          Authorization: `INKSTONE auth_token="${authToken}"`,
        }),
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
        url: inkstoneConfig.baseUrl + ENDPOINTS.PROJECT_GET_BY_NAME.replace(':NAME', encodeURIComponent(name)),
        headers: _.extend(baseHeaders, {
          Authorization: `INKSTONE auth_token="${authToken}"`,
        }),
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

    export function getByUniqueId(authToken: string, uniqueId: string, cb: inkstone.Callback<ProjectAndCredentials>) {
      const options: requestLib.UrlOptions & requestLib.CoreOptions = {
        url: inkstoneConfig.baseUrl +
          ENDPOINTS.PROJECT_GET_BY_UNIQUE_ID.replace(':UNIQUE_ID', encodeURIComponent(uniqueId)),
        headers: _.extend(baseHeaders, {
          Authorization: `INKSTONE auth_token="${authToken}"`,
        }),
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
        headers: _.extend(baseHeaders, {
          Authorization: `INKSTONE auth_token="${authToken}"`,
        }),
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
        headers: _.extend(baseHeaders, {
          Authorization: `INKSTONE auth_token="${authToken}"`,
        }),
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
        headers: _.extend(baseHeaders, {
          Authorization: `INKSTONE auth_token="${authToken}"`,
        }),
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
