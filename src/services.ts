import * as request from 'request';
// @ts-ignore
import packageJson = require('../package.json');
import {inkstoneConfig} from './config';
import {ErrorCode} from './errors';
import {requestInstance} from './transport';

const INKSTONE_ERROR_HEADER = 'x-inkstone-error-code';

export const enum Endpoints {
  // Ping.
  Ping = '/ping',

  // Project.
  ProjectResourceCollection = '/project',
  ProjectResource = '/project/:project_name',
  ProjectSnapshotResource = '/project/:project_name/snapshot/:sha',
  ProjectSnapshotSyndicated = '/project/:project_name/snapshot/:sha/syndicated',
  ProjectSnapshotAssetResource = '/project/:project_name/snapshot/:sha/asset/:filename',

  // Community.
  ForkCommunityProject = '/community/:organization_name/:project_name/fork',

  // Organization.
  OrganizationResourceCollection = '/organization',

  // User.
  UserDetailResource = '/user/detail',

  // Billing.
  BillingDescribe = '/billing',
  BillingListProducts = '/billing/products',
  BillingSetCustomer = '/billing/customer',
  BillingAddCard = '/billing/card',
  BillingSetCardAsDefaultById = '/billing/card/:card_id/is_default',
  BillingDeleteCardById = '/billing/card/:card_id',
  BillingPlanResource = '/billing/plan',
  BillingDescribeCoupon = '/billing/coupon/:coupon_id',
  BillingTaxID = '/billing/tax_id',
  BillingAddSeats = '/billing/add_seats',

  // Volume licensing.
  Team = '/team',
  TeamAssignedSeats = '/team/seats',
  TeamConfirmSeat = '/team/seats/confirm/:verification_unique_id',
  TeamResendConfirmSeatEmail = '/team/seats/resend-confirmation',
  TeamAssignSeats = '/team/seats'
}

export interface UriParams {
  [parameterName: string]: string;
}

export interface QueryParams {
  [parameterName: string]: string|undefined;
}

export type MaybeAuthToken = string|undefined;

export class RequestBuilder {
  private url: string;
  private json: any;
  private readonly queryParams: QueryParams = {};
  private readonly headers: request.Headers = {
    'X-Haiku-Version': packageJson.version,
    'Content-Type': 'application/json',
  };

  private setAuthToken (authToken: string) {
    this.headers.Authorization = `INKSTONE auth_token="${authToken}"`;
  }

  constructor (private readonly method: (options: request.OptionsWithUrl, cb: request.RequestCallback) => void) {}

  withEndpoint (endpoint: Endpoints) {
    this.url = `${inkstoneConfig.baseUrl}v0${endpoint}`;
    return this;
  }

  withUrlParameters (params: UriParams) {
    for (const param in params) {
      this.url = this.url.replace(param, params[param]);
    }
    return this;
  }

  /**
   * @deprecated - prefer config-based and/or cookie-based auth tokens!
   */
  withAuthToken (authToken: MaybeAuthToken) {
    if (authToken) {
      this.setAuthToken(authToken);
    }
    return this;
  }

  withJson (json: any) {
    this.json = json;
    return this;
  }

  withQueryParams (params: QueryParams) {
    Object.assign(this.queryParams, params);
    return this;
  }

  get fullUrl () {
    if (Object.keys(this.queryParams).length === 0) {
      return this.url;
    }

    const expandedParams = [];
    for (const param in this.queryParams) {
      expandedParams.push(`${param}=${encodeURIComponent(this.queryParams[param])}`);
    }

    return `${this.url}?${expandedParams.join('&')}`;
  }

  get fullHeaders () {
    if (inkstoneConfig.authToken) {
      this.setAuthToken(inkstoneConfig.authToken);
    }

    return this.headers;
  }

  call (cb: request.RequestCallback) {
    if (!this.url) {
      throw new Error('No URL specified!');
    }

    this.method(
      {
        headers: this.fullHeaders,
        json: this.json || true,
        url: this.fullUrl,
      },
      (err, httpResponse, body) => {
        if (err) {
          return cb(new Error(ErrorCode.ErrorOffline), httpResponse, body);
        }
        const errorCode =
          httpResponse && httpResponse.headers && httpResponse.headers[INKSTONE_ERROR_HEADER] as string;
        if (errorCode || httpResponse.statusCode > 399) {
          return cb(new Error(errorCode || ErrorCode.ErrorUncategorized), httpResponse, body);
        }
        cb(null, httpResponse, body);
      },
    );
  }

  callWithCallback<T> (
    cb: (err: Error, data: T, response: request.RequestResponse) => void,
    successCode = 200,
  ) {
    this.call((err, httpResponse, body) => {
      if (httpResponse && httpResponse.statusCode === successCode) {
        cb(
          undefined,
          body as T,
          httpResponse,
        );
      } else {
        cb(err || new Error(ErrorCode.ErrorUncategorized), null, httpResponse);
      }
    });
  }
}

export const newGetRequest = () => new RequestBuilder(requestInstance.get);
export const newPostRequest = () => new RequestBuilder(requestInstance.post);
export const newPutRequest = () => new RequestBuilder(requestInstance.put);
export const newDeleteRequest = () => new RequestBuilder(requestInstance.delete);
