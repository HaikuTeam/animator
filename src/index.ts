/* tslint:disable:no-namespace */
import * as request from 'request';
import {InkstoneConfig, inkstoneConfig} from './config';
import {Endpoints, MaybeAuthToken, newDeleteRequest, newGetRequest, newPutRequest} from './services';
import {requestInstance} from './transport';

// tslint:disable-next-line:no-var-requires
const packageJson = require('../package.json');

// TODO: refactor endpoints using these to the new factory pattern.
const ENDPOINTS = {
  PROJECT_CREATE: 'v0/project',
  LOGIN: 'v0/user/auth',
  LOGOUT: 'v0/user/auth',
  CHANGE_PASSWORD: 'v0/user/password',
  ORGANIZATION_LIST: 'v0/organization',
  COMMUNITY_PROJECT_LIST: 'v0/community',
  SET_COMMUNITY_HAIKUDOS: 'v0/community/:ORGANIZATION_NAME/:PROJECT_NAME/hai-kudos',
  COMMUNITY_PROFILE: 'v0/community/:ORGANIZATION_NAME',
  GET_COMMUNITY_PROJECT: 'v0/community/:ORGANIZATION_NAME/:PROJECT_NAME',
  FORK_COMMUNITY_PROJECT: 'v0/community/:ORGANIZATION_NAME/:PROJECT_NAME/fork',
  PROJECT_LIST: 'v0/project',
  PROJECT_UPDATE: 'v0/project',
  INVITE_PREFINERY_CHECK: 'v0/invite/check',
  INVITE_CHECK: 'v0/invite/:CODE',
  INVITE_CLAIM: 'v0/invite/claim',
  SNAPSHOT_GET_BY_ID: 'v0/snapshot/:ID',
  SNAPSHOT_SYNDICATED_BY_ID: 'v0/snapshot/:ID/syndicated',
  SNAPSHOT_FEATURE_BY_ID: 'v0/snapshot/:ID/is_featured',
  SNAPSHOT_UNFEATURE_BY_ID: 'v0/snapshot/:ID/is_featured',
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
  FIGMA_ACCCESS_TOKEN_GET: 'v0/integrations/figma/token',
  CANNY_ACCCESS_TOKEN_GET: 'v0/integrations/canny/token',
};

/**
 * @function safeError
 * @description Flexibly return an error in cases where we might not have
 * received an actual error object but still need to return an error payload.
 */
function safeError (err: any): any {
  if (err) {
    return err;
  }

  return new Error('Uncategorized error');
}

const maybeAuthorizationHeaders = (authToken: MaybeAuthToken): {Authorization: string}|undefined => {
  if (authToken) {
    return {
      Authorization: `INKSTONE auth_token="${authToken}"`,
    };
  }

  return undefined;
};

export namespace inkstone {

  export interface Pagination {
    Page: number;
    PerPage: number;
  }

  export interface PaginatedResponse<T> {
    Page: number;
    TotalPages: number;
    Collection: T[];
  }

  export function setConfig (newVals: InkstoneConfig) {
    Object.assign(inkstoneConfig, newVals);
  }

  const baseHeaders = {
    'X-Haiku-Version': packageJson.version,
    'Content-Type': 'application/json',
  };

  export type Callback<T> = (err: string, data: T, response: request.RequestResponse) => void;

  export namespace support {
    export function getPresignedUrl (authToken: MaybeAuthToken, uuid: string, cb: inkstone.Callback<string>) {

      const options: request.OptionsWithUrl = {
        url: inkstoneConfig.baseUrl + ENDPOINTS.SUPPORT_UPLOAD_GET_PRESIGNED_URL.replace(':UUID', uuid),
        headers: {
          ...baseHeaders,
          ...maybeAuthorizationHeaders(authToken),
        },
      };

      requestInstance.get(options, (err, httpResponse, body) => {
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

    export function authenticate (username: string, password: string, cb: inkstone.Callback<Authentication>) {
      const formData = {
        username,
        password,
      };

      const options: request.OptionsWithUrl = {
        url: inkstoneConfig.baseUrl + ENDPOINTS.LOGIN,
        json: formData,
        headers: baseHeaders,
      };

      requestInstance.post(options, (err, httpResponse, body) => {
        if (httpResponse && httpResponse.statusCode === 200) {
          const auth = body as Authentication;
          cb(undefined, auth, httpResponse);
        } else {
          cb(safeError(err), undefined, httpResponse);
        }
      });
    }

    export function unauthenticate (authToken: MaybeAuthToken, cb: inkstone.Callback<boolean>) {
      const options: request.OptionsWithUrl = {
        url: inkstoneConfig.baseUrl + ENDPOINTS.LOGOUT,
        headers: {
          ...baseHeaders,
          ...maybeAuthorizationHeaders(authToken),
        },
      };

      requestInstance.delete(options, (err, httpResponse) => {
        cb(undefined, true, httpResponse);
      });
    }

    export function getDetails (authToken: MaybeAuthToken, cb: inkstone.Callback<User>) {
      const options: request.OptionsWithUrl = {
        url: inkstoneConfig.baseUrl + ENDPOINTS.USER_DETAIL,
        headers: {
          ...baseHeaders,
          ...maybeAuthorizationHeaders(authToken),
        },
      };

      requestInstance.get(options, (err, httpResponse, body) => {
        if (httpResponse && httpResponse.statusCode === 200) {
          const response = body as User;
          cb(undefined, response, httpResponse);
        } else {
          cb(safeError(err), undefined, httpResponse);
        }
      });
    }

    export function changePassword (
      authToken: MaybeAuthToken,
      params: ChangePasswordParams,
      cb: inkstone.Callback<string>,
    ) {
      const options: request.OptionsWithUrl = {
        url: inkstoneConfig.baseUrl + ENDPOINTS.CHANGE_PASSWORD,
        headers: {
          ...baseHeaders,
          ...maybeAuthorizationHeaders(authToken),
        },
        json: params,
      };

      requestInstance.post(options, (err, httpResponse, body) => {
        if (httpResponse && httpResponse.statusCode === 200) {
          const response = body as string;
          cb(undefined, response, httpResponse);
        } else {
          cb(safeError(err), undefined, httpResponse);
        }
      });
    }

    export function confirm (token: string, cb: inkstone.Callback<Authentication>) {
      const options: request.OptionsWithUrl = {
        url: inkstoneConfig.baseUrl + ENDPOINTS.USER_CONFIRM.replace(':token', token),
      };

      requestInstance.post(options, (err, httpResponse, body) => {
        if (httpResponse && httpResponse.statusCode === 200) {
          cb(undefined, body, httpResponse);
        } else {
          cb(safeError(err), undefined, httpResponse);
        }
      });
    }

    export interface PasswordResetCreateParams {
      Email: string;
      ContinueUrl?: string;
    }

    export function requestResetPassword (params: string|PasswordResetCreateParams, cb: inkstone.Callback<boolean>) {
      const body = {} as {email: string, continue_url: string};
      if (typeof params === 'string') {
        // Legacy: params passed as string.
        body.email = params;
      } else {
        body.email = params.Email;
        body.continue_url = params.ContinueUrl;
      }

      const options: request.OptionsWithUrl = {
        url: inkstoneConfig.baseUrl + ENDPOINTS.RESET_PASSWORD,
        headers: baseHeaders,
        body: JSON.stringify(body),
      };

      requestInstance.post(options, (err, httpResponse) => {
        if (httpResponse && httpResponse.statusCode === 200) {
          cb(undefined, true, httpResponse);
        } else {
          cb(safeError(err), undefined, httpResponse);
        }
      });
    }

    export interface RequestConfirmEmailParams {
      Email: string;
      ContinueUrl?: string;
    }

    export function requestConfirmEmail (
      params: string|RequestConfirmEmailParams, cb: inkstone.Callback<Authentication>) {
      const email = typeof params === 'string' ? params : params.Email;
      const options: request.OptionsWithUrl = {
        url: inkstoneConfig.baseUrl + ENDPOINTS.USER_REQUEST_CONFIRM.replace(':email', email),
        headers: baseHeaders,
      };

      if (typeof params !== 'string' && params.ContinueUrl) {
        options.url += `?continue_url=${encodeURIComponent(params.ContinueUrl)}`;
      }

      requestInstance.post(options, (err, httpResponse, body) => {
        if (httpResponse && httpResponse.statusCode === 200) {
          cb(undefined, body, httpResponse);
        } else {
          cb(safeError(err), undefined, httpResponse);
        }
      });
    }

    export function claimResetPassword (
      resetPasswordUUID: string, password: string, cb: inkstone.Callback<boolean>) {

      const options: request.OptionsWithUrl = {
        url: inkstoneConfig.baseUrl + ENDPOINTS.RESET_PASSWORD_CLAIM.replace(':UUID', resetPasswordUUID),
        headers: baseHeaders,
        body: JSON.stringify({password}),
      };

      requestInstance.post(options, (err, httpResponse, body) => {
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
      ContinueUrl?: string;
    }

    export function create (params: UserCreateParams, cb: inkstone.Callback<boolean>) {
      const options: request.OptionsWithUrl = {
        url: inkstoneConfig.baseUrl + ENDPOINTS.USER_CREATE,
        json: params,
        headers: baseHeaders,
      };

      requestInstance.post(options, (err, httpResponse, body) => {
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

    export function getInviteFromPrefineryCode (params: PrefineryCheckParams, cb: inkstone.Callback<Invite>) {
      const options: request.OptionsWithUrl = {
        url: inkstoneConfig.baseUrl + ENDPOINTS.INVITE_PREFINERY_CHECK,
        headers: baseHeaders,
        json: params,
      };

      requestInstance.post(options, (err, httpResponse, body) => {
        if (httpResponse && httpResponse.statusCode === 200) {
          cb(undefined, JSON.parse(body) as Invite, httpResponse);
        } else {
          cb(safeError(err), undefined, httpResponse);
        }
      });
    }

    export function checkValidity (code: string, cb: inkstone.Callback<InvitePresetDetails>) {
      const options: request.OptionsWithUrl = {
        url: inkstoneConfig.baseUrl + ENDPOINTS.INVITE_CHECK.replace(':CODE', code),
        headers: baseHeaders,
      };

      requestInstance.get(options, (err, httpResponse, body) => {
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

    export function claimInvite (claim: InviteClaim, cb: inkstone.Callback<boolean>) {
      const options: request.OptionsWithUrl = {
        url: inkstoneConfig.baseUrl + ENDPOINTS.INVITE_CLAIM,
        json: claim,
        headers: baseHeaders,
      };

      requestInstance.post(options, (err, httpResponse, body) => {
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

    export function list (authToken: MaybeAuthToken, cb: inkstone.Callback<Organization[]>) {
      const options: request.OptionsWithUrl = {
        url: inkstoneConfig.baseUrl + ENDPOINTS.ORGANIZATION_LIST,
        headers: {
          ...baseHeaders,
          ...maybeAuthorizationHeaders(authToken),
        },
      };

      requestInstance.get(options, (err, httpResponse, body) => {
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
    export function getSnapshotLink (
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
    export function getSnapshotAndProject (id: string, cb: inkstone.Callback<SnapshotAndProjectAndOrganization>) {
      const url = inkstoneConfig.baseUrl + ENDPOINTS.SNAPSHOT_GET_BY_ID.replace(':ID', encodeURIComponent(id));
      const options: request.OptionsWithUrl = {
        url,
        headers: baseHeaders,
      };

      requestInstance.get(options, (err, httpResponse, body) => {
        if (httpResponse && httpResponse.statusCode === 200) {
          const snapshotAndProject = JSON.parse(body) as SnapshotAndProjectAndOrganization;
          cb(undefined, snapshotAndProject, httpResponse);
        } else {
          cb(safeError(err), undefined, httpResponse);
        }
      });
    }

    // Notifies Inkstone that a snapshot has been syndicated.
    export function registerSyndication (id: string, secretToken: string, cb: inkstone.Callback<string>) {
      const url = inkstoneConfig.baseUrl + ENDPOINTS.SNAPSHOT_SYNDICATED_BY_ID.replace(':ID', encodeURIComponent(id));
      const options: request.OptionsWithUrl = {
        url,
        headers: baseHeaders,
        body: JSON.stringify({secret_token: secretToken}),
      };

      requestInstance.post(options, (err, httpResponse, body) => {
        if (httpResponse && httpResponse.statusCode === 200) {
          cb(undefined, JSON.parse(body) as string, httpResponse);
        } else {
          cb(safeError(err), undefined, httpResponse);
        }
      });
    }

    export function assembleSnapshotLinkFromSnapshot (snapshotIn: Snapshot) {
      return `${inkstoneConfig.baseShareUrl}${snapshotIn.UniqueId}/latest`;
    }

    export function feature (authToken: MaybeAuthToken, uniqueId: string, cb: inkstone.Callback<boolean>) {
      const options: request.OptionsWithUrl = {
        url: inkstoneConfig.baseUrl + ENDPOINTS.SNAPSHOT_FEATURE_BY_ID.replace(
          ':ID', uniqueId),
        headers: {
          ...baseHeaders,
          ...maybeAuthorizationHeaders(authToken),
        },
      };

      requestInstance.put(options, (err, httpResponse) => {
        if (httpResponse && httpResponse.statusCode === 204) {
          cb(undefined, true, httpResponse);
        } else {
          cb(safeError(err), false, httpResponse);
        }
      });
    }

    export function unfeature (authToken: MaybeAuthToken, uniqueId: string, cb: inkstone.Callback<boolean>) {
      const options: request.OptionsWithUrl = {
        url: inkstoneConfig.baseUrl + ENDPOINTS.SNAPSHOT_UNFEATURE_BY_ID.replace(
          ':ID', uniqueId),
        headers: {
          ...baseHeaders,
          ...maybeAuthorizationHeaders(authToken),
        },
      };

      requestInstance.delete(options, (err, httpResponse) => {
        if (httpResponse && httpResponse.statusCode === 204) {
          cb(undefined, true, httpResponse);
        } else {
          cb(safeError(err), false, httpResponse);
        }
      });
    }
  }

  export namespace integrations {
    export interface OAuthAccessTokenResponse {
      AccessToken: string;
      RefreshToken: string;
      ExpiresIn: number;
    }

    export interface JSONWebTokenResponse {
      AccessToken: string;
    }

    /**
     * Get a Figma access token using a Figma authorization code.
     * @param {string} code
     * @param {inkstone.Callback<inkstone.integrations.OAuthAccessTokenResponse>} cb
     */
    export function getFigmaAccessToken (code: string, cb: inkstone.Callback<OAuthAccessTokenResponse>) {
      const options: request.OptionsWithUrl = {
        url: inkstoneConfig.baseUrl + ENDPOINTS.FIGMA_ACCCESS_TOKEN_GET + '?Code=' + encodeURIComponent(code),
        headers: baseHeaders,
      };

      requestInstance.get(options, (err, httpResponse, body) => {
        if (httpResponse && httpResponse.statusCode === 200) {
          cb(undefined, JSON.parse(body) as OAuthAccessTokenResponse, httpResponse);
        } else {
          cb(safeError(err), undefined, httpResponse);
        }
      });
    }

    /**
     * Get a Canny access token as a logged-in user.
     * @param {string} code
     * @param {inkstone.Callback<inkstone.integrations.OAuthAccessTokenResponse>} cb
     */
    export function getCannyAccessToken (authToken: MaybeAuthToken, cb: inkstone.Callback<JSONWebTokenResponse>) {
      const options: request.OptionsWithUrl = {
        url: inkstoneConfig.baseUrl + ENDPOINTS.CANNY_ACCCESS_TOKEN_GET,
        headers: {
          ...baseHeaders,
          ...maybeAuthorizationHeaders(authToken),
        },
      };

      requestInstance.get(options, (err, httpResponse, body) => {
        if (httpResponse && httpResponse.statusCode === 200) {
          cb(undefined, JSON.parse(body) as JSONWebTokenResponse, httpResponse);
        } else {
          cb(safeError(err), undefined, httpResponse);
        }
      });
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
      LottieUrl?: string;
      GifUrl?: string;
      StillUrl?: string;
      VideoUrl?: string;
      HaiKudos?: HaiKudos;
      SnapshotUuid?: string;
    }

    export interface OrganizationAndCommunityProjects {
      IsCurrentUser: boolean;
      Organization: organization.Organization;
      CommunityProjects: CommunityProject[];
    }

    export interface CommunityProjectsFilters {
      IsFeatured: boolean;
    }

    export interface CommunityProjectsQuery {
      Pagination: inkstone.Pagination;
      Filters: CommunityProjectsFilters;
    }

    /**
     * Get the community project list.
     *
     * Pass undefined as the first parameter if making the request on behalf of an anonymous user. If making the
     * request on behalf of a logged-in user, pass in their auth token to populate the `TotalFromCurrentUser`
     * hai-kudos field.
     * @param {string | undefined} authToken
     * @param {CommunityProjectsQuery} query
     * @param {inkstone.Callback<inkstone.PaginatedResponse<CommunityProject>[]>} cb
     */
    export function projectList (
      authToken: MaybeAuthToken,
      query: CommunityProjectsQuery,
      cb: inkstone.Callback<inkstone.PaginatedResponse<CommunityProject>>,
    ) {
      // TODO: automate this
      let queryString = '';
      queryString += `?page=${query.Pagination.Page}`;
      queryString += `&per_page=${query.Pagination.PerPage}`;
      queryString += `&filters.is_featured=${query.Filters.IsFeatured}`;

      const options: request.OptionsWithUrl = {
        url: inkstoneConfig.baseUrl + ENDPOINTS.COMMUNITY_PROJECT_LIST + queryString,
        headers: {
          ...baseHeaders,
          ...maybeAuthorizationHeaders(authToken),
        },
      };

      requestInstance.get(options, (err, httpResponse, body) => {
        if (httpResponse && httpResponse.statusCode === 200) {
          const paginatedResult = {
            Collection: JSON.parse(body) as CommunityProject[],
            Page: Number(httpResponse.headers['x-pagination-page']),
            TotalPages: Number(httpResponse.headers['x-pagination-total-pages']),
          };

          cb(undefined, paginatedResult, httpResponse);
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
     * @param {inkstone.community.CommunityProject} projectIn
     * @param {inkstone.Callback<inkstone.project.Project>} cb
     */
    export function forkCommunityProject (
      authToken: MaybeAuthToken, projectIn: CommunityProject, cb: inkstone.Callback<project.Project>) {
      const options: request.OptionsWithUrl = {
        url: inkstoneConfig.baseUrl + ENDPOINTS.FORK_COMMUNITY_PROJECT
          .replace(':ORGANIZATION_NAME', projectIn.Organization.Name)
          .replace(':PROJECT_NAME', projectIn.Project.Name),
        headers: {
          ...baseHeaders,
          ...maybeAuthorizationHeaders(authToken),
        },
      };

      requestInstance.post(options, (err, httpResponse, body) => {
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
    export function setHaiKudos (
      authToken: MaybeAuthToken,
      params: SetHaiKudosParams,
      cb: inkstone.Callback<boolean>,
    ) {
      const options: request.OptionsWithUrl = {
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

      requestInstance.put(options, (err, httpResponse) => {
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
    export function getProfile (
      authToken: MaybeAuthToken, organizationName: string, cb: inkstone.Callback<OrganizationAndCommunityProjects>) {
      const options: request.OptionsWithUrl = {
        url: inkstoneConfig.baseUrl + ENDPOINTS.COMMUNITY_PROFILE
          .replace(':ORGANIZATION_NAME', organizationName),
        headers: {
          ...baseHeaders,
          ...maybeAuthorizationHeaders(authToken),
        },
      };

      requestInstance.get(options, (err, httpResponse, body) => {
        if (httpResponse && httpResponse.statusCode === 200) {
          cb(undefined, JSON.parse(body) as OrganizationAndCommunityProjects, httpResponse);
        } else {
          cb(safeError(err), undefined, httpResponse);
        }
      });
    }

    /**
     * Get a community project by organization and project name.
     *
     * @param {string | undefined} authToken
     * @param {string} organizationName
     * @param {string} projectName
     * @param {inkstone.Callback<inkstone.community.CommunityProject>} cb
     */
    export function getProject (
      authToken: MaybeAuthToken, organizationName: string, projectName: string,
      cb: inkstone.Callback<CommunityProject>) {
      const options: request.OptionsWithUrl = {
        url: inkstoneConfig.baseUrl + ENDPOINTS.GET_COMMUNITY_PROJECT
          .replace(':ORGANIZATION_NAME', organizationName)
          .replace(':PROJECT_NAME', projectName),
        headers: {
          ...baseHeaders,
          ...maybeAuthorizationHeaders(authToken),
        },
      };

      requestInstance.get(options, (err, httpResponse, body) => {
        if (httpResponse && httpResponse.statusCode === 200) {
          cb(undefined, JSON.parse(body) as CommunityProject, httpResponse);
        } else {
          cb(safeError(err), undefined, httpResponse);
        }
      });
    }
  }

  export namespace project {
    export interface Project {
      Name: string;
      IsPublic: boolean;
      ForkComplete: boolean;
      RepositoryUrl: string;
    }

    export interface ProjectAndCredentials {
      Project: Project;
      Credentials: {};
    }

    export interface ProjectCreateParams {
      Name: string;
      IsPublic: boolean;
    }

    export interface ProjectUpdateParams {
      ID?: number;
      UniqueId?: string;
      MakePublic?: boolean;
      MakePrivate?: boolean;
    }

    export function create (authToken: MaybeAuthToken, params: ProjectCreateParams, cb: inkstone.Callback<Project>) {
      const options: request.OptionsWithUrl = {
        url: inkstoneConfig.baseUrl + ENDPOINTS.PROJECT_CREATE,
        headers: {
          ...baseHeaders,
          ...maybeAuthorizationHeaders(authToken),
        },
        json: params,
      };

      requestInstance.post(options, (err, httpResponse, body) => {
        if (httpResponse && httpResponse.statusCode === 200) {
          cb(undefined, body as Project, httpResponse);
        } else {
          cb(safeError(err), undefined, httpResponse);
        }
      });
    }

    export function update (authToken: MaybeAuthToken, params: ProjectUpdateParams, cb: inkstone.Callback<Project>) {
      const options: request.OptionsWithUrl = {
        url: inkstoneConfig.baseUrl + ENDPOINTS.PROJECT_UPDATE,
        headers: {
          ...baseHeaders,
          ...maybeAuthorizationHeaders(authToken),
        },
        json: params,
      };

      requestInstance.put(options, (err, httpResponse, body) => {
        if (httpResponse && httpResponse.statusCode === 200) {
          cb(undefined, body as Project, httpResponse);
        } else {
          cb(safeError(err), undefined, httpResponse);
        }
      });
    }

    export function makePublic (authToken: MaybeAuthToken, nameOrUniqueId: string, cb: inkstone.Callback<boolean>) {
      const options: request.OptionsWithUrl = {
        url: inkstoneConfig.baseUrl + ENDPOINTS.PROJECT_MAKE_PUBLIC_BY_NAME_OR_UNIQUE_ID.replace(
          ':NAME_OR_UNIQUE_ID', nameOrUniqueId),
        headers: {
          ...baseHeaders,
          ...maybeAuthorizationHeaders(authToken),
        },
      };

      requestInstance.put(options, (err, httpResponse) => {
        if (httpResponse && httpResponse.statusCode === 204) {
          cb(undefined, true, httpResponse);
        } else {
          cb(safeError(err), false, httpResponse);
        }
      });
    }

    export function makePrivate (authToken: MaybeAuthToken, nameOrUniqueId: string, cb: inkstone.Callback<boolean>) {
      const options: request.OptionsWithUrl = {
        url: inkstoneConfig.baseUrl + ENDPOINTS.PROJECT_MAKE_PRIVATE_BY_NAME_OR_UNIQUE_ID.replace(
          ':NAME_OR_UNIQUE_ID', nameOrUniqueId),
        headers: {
          ...baseHeaders,
          ...maybeAuthorizationHeaders(authToken),
        },
      };

      requestInstance.delete(options, (err, httpResponse) => {
        if (httpResponse && httpResponse.statusCode === 204) {
          cb(undefined, true, httpResponse);
        } else {
          cb(safeError(err), false, httpResponse);
        }
      });
    }

    export function list (authToken: MaybeAuthToken, cb: inkstone.Callback<Project[]>) {
      const options: request.OptionsWithUrl = {
        url: inkstoneConfig.baseUrl + ENDPOINTS.PROJECT_LIST,
        headers: {
          ...baseHeaders,
          ...maybeAuthorizationHeaders(authToken),
        },
      };

      requestInstance.get(options, (err, httpResponse, body) => {
        if (httpResponse && httpResponse.statusCode === 200) {
          const projects = JSON.parse(body) as Project[];
          cb(undefined, projects, httpResponse);
        } else {
          cb(safeError(err), undefined, httpResponse);
        }
      });
    }

    export function getByName (
      authToken: MaybeAuthToken, name: string, cb: inkstone.Callback<ProjectAndCredentials>,
    ) {
      const options: request.OptionsWithUrl = {
        url: inkstoneConfig.baseUrl + ENDPOINTS.PROJECT_GET_BY_NAME.replace(':NAME', encodeURIComponent(name)),
        headers: {
          ...baseHeaders,
          ...maybeAuthorizationHeaders(authToken),
        },
      };

      requestInstance.get(options, (err, httpResponse, body) => {
        if (httpResponse && httpResponse.statusCode === 200) {
          cb(undefined, JSON.parse(body) as ProjectAndCredentials, httpResponse);
        } else {
          cb(safeError(err), undefined, httpResponse);
        }
      });
    }

    export function getByUniqueId (
      authToken: MaybeAuthToken,
      uniqueId: string,
      cb: inkstone.Callback<ProjectAndCredentials>,
    ) {
      const options: request.OptionsWithUrl = {
        url: inkstoneConfig.baseUrl +
          ENDPOINTS.PROJECT_GET_BY_UNIQUE_ID.replace(':UNIQUE_ID', encodeURIComponent(uniqueId)),
        headers: {
          ...baseHeaders,
          ...maybeAuthorizationHeaders(authToken),
        },
      };

      requestInstance.get(options, (err, httpResponse, body) => {
        if (httpResponse && httpResponse.statusCode === 200) {
          cb(undefined, JSON.parse(body) as ProjectAndCredentials, httpResponse);
        } else {
          cb(safeError(err), undefined, httpResponse);
        }
      });
    }

    export function deleteByName (authToken: MaybeAuthToken, name: string, cb: inkstone.Callback<boolean>) {

      const options: request.OptionsWithUrl = {
        url: inkstoneConfig.baseUrl + ENDPOINTS.PROJECT_DELETE_BY_NAME.replace(':NAME', encodeURIComponent(name)),
        headers: {
          ...baseHeaders,
          ...maybeAuthorizationHeaders(authToken),
        },
      };

      requestInstance.delete(options, (err, httpResponse, body) => {
        if (httpResponse && httpResponse.statusCode === 200) {
          cb(undefined, true, httpResponse);
        } else {
          cb(safeError(err), undefined, httpResponse);
        }
      });
    }

    export function createProjectSnapshotByNameAndSha (
      authToken: MaybeAuthToken, name: string, sha: string, cb: inkstone.Callback<snapshot.Snapshot>) {
      const options: request.OptionsWithUrl = {
        url: inkstoneConfig.baseUrl + ENDPOINTS.PROJECT_SNAPSHOT_BY_NAME_AND_SHA
          .replace(':NAME', encodeURIComponent(name))
          .replace(':SHA', encodeURIComponent(sha)),
        headers: {
          ...baseHeaders,
          ...maybeAuthorizationHeaders(authToken),
        },
      };

      requestInstance.put(options, (err, httpResponse, body) => {
        if (httpResponse && httpResponse.statusCode === 200) {
          return cb(undefined, JSON.parse(body) as snapshot.Snapshot, httpResponse);
        }

        cb(safeError(err), undefined, httpResponse);
      });
    }
  }

  export namespace updates {
    export function check (authToken: MaybeAuthToken, query: string, cb: inkstone.Callback<boolean>) {

      const options: request.OptionsWithUrl = {
        url: inkstoneConfig.baseUrl + ENDPOINTS.UPDATES + query,
        headers: {
          ...baseHeaders,
          ...maybeAuthorizationHeaders(authToken),
        },
      };

      requestInstance.get(options, (err, httpResponse, body) => {
        if (httpResponse && httpResponse.statusCode === 200) {
          cb(undefined, true, httpResponse);
        } else {
          cb(safeError(err), undefined, httpResponse);
        }
      });
    }
  }

  export namespace billing {
    export interface Customer {
      BillingName: string;
      BillingEmail: string;
    }

    export interface Card {
      ID: string;
      // Provided as a string to avoid having formatting a four-digit number that begins with 0(s).
      LastFourDigits: string;
      ExpirationMonth: number;
      ExpirationYear: number;
      IsDefault: boolean;
    }

    export interface Profile {
      Customer: Customer;
      Cards: Card[];
    }

    export interface Plan {
      ID: string;
      Currency: 'usd'; // For now!
      Interval: 'year'|'month';
      Price: number;
    }

    export interface Product {
      Name: string;
      Plans: Plan[];
    }

    export interface PlanOverview {
      // CurrentPeriodStart and CurrentPeriodEnd are provided as UNIX timestamps.
      CurrentPeriodStart: number;
      CurrentPeriodEnd: number;
      // DaysUntilDue is typically 0 when this object is loaded—indicating the user has purchased a plan
      // which is due today.
      DaysUntilDue: number;
    }

    /**
     * Describes the available products. This endpoint is the source of valid values of PlanID which can be used to
     * call setPlan() below. Authentication is optional.
     */
    export const listProducts = (cb: inkstone.Callback<Product[]>) => {
      newGetRequest()
        .withEndpoint(Endpoints.BillingListProducts)
        .callWithCallback<Product[]>(cb);
    };

    /**
     * @authentication-required
     * Describes the customer billing profile.
     */
    export const describe = (cb: inkstone.Callback<Profile>) => {
      newGetRequest()
        .withEndpoint(Endpoints.BillingDescribe)
        .callWithCallback<Profile>(cb);
    };

    /**
     * @authentication-required
     * Sets up the customer profile. A customer profile must be provided before calling any of the methods below.
     */
    export const setCustomer = (customer: Customer, cb: inkstone.Callback<void>) => {
      newPutRequest()
        .withEndpoint(Endpoints.BillingSetCustomer)
        .withJson(customer)
        .callWithCallback<void>(cb, 204);
    };

    export interface AddCardRequestParams {
      Token: string;
    }

    /**
     * @authentication-required
     * Adds a card using a Stripe token, which must be generated on the client side. A customer profile is required
     * (see setCustomer() for details). The first card added will automatically be set as the default. The default can
     * be changed using setCardAsDefaultById() below.
     * @see {@link https://stripe.com/docs/stripe-js/reference#stripe-create-token}
     */
    export const addCard = (card: AddCardRequestParams, cb: inkstone.Callback<void>) => {
      newPutRequest()
        .withEndpoint(Endpoints.BillingAddCard)
        .withJson(card)
        .callWithCallback<void>(cb, 204);
    };

    /**
     * @authentication-required
     * Sets a card as default. The card ID here is available from the Profile object, obtained by calling describe()
     * above. A customer profile is required (see setCustomer() for details).
     */
    export const setCardAsDefaultById = (cardId: string, cb: inkstone.Callback<void>) => {
      newPutRequest()
        .withEndpoint(Endpoints.BillingSetCardAsDefaultById)
        .withUrlParameters({':card_id': cardId})
        .callWithCallback<void>(cb, 204);
    };

    /**
     * @authentication-required
     * Deletes a card. This request will fail if the user attempts to delete the default card without first specifying
     * a new default card. Same as setCardAsDefaultById(), the card ID here is available from the Profile object,
     * obtained by calling describe() above. A customer profile is required (see setCustomer() for details).
     */
    export const deleteCardById = (cardId: string, cb: inkstone.Callback<void>) => {
      newDeleteRequest()
        .withEndpoint(Endpoints.BillingDeleteCardById)
        .withUrlParameters({':card_id': cardId})
        .callWithCallback<void>(cb, 204);
    };

    export interface SetPlanRequestParams {
      PlanID: string;
      Coupon?: string;
    }

    /**
     * @authentication-required
     * Sets a billing plan for the user. Prior to calling this method, both a customer profile (see setCustomer()) and
     * a default payment source (see addCard()/setCardAsDefaultById() must be specified). As noted above, the PlanID
     * string is available via the listProducts() endpoint above…or via hardcoding, since for now we only sell one
     * plan!
     */
    export const setPlan = (
      plan: SetPlanRequestParams,
      cb: inkstone.Callback<PlanOverview>,
    ) => {
      newPutRequest()
        .withEndpoint(Endpoints.BillingSetPlan)
        .withJson(plan)
        .callWithCallback<PlanOverview>(cb);
    };

    /**
     * @authentication-required
     * Cancels the user's active plan at the end of the billing period. And active plan is required (see setPlan()
     * above).
     */
    export const cancelPlan = (
      cb: inkstone.Callback<void>,
    ) => {
      newDeleteRequest()
        .withEndpoint(Endpoints.BillingCancelPlan)
        .callWithCallback<void>(cb, 204);
    };
  }
}
