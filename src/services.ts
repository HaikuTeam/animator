import * as request from 'request';
// @ts-ignore
import packageJson = require('../package.json');
import {inkstoneConfig} from './config';
import {requestInstance} from './transport';

const INKSTONE_ERROR_HEADER = 'x-inkstone-error-code';

export const enum Endpoints {
  BillingDescribe = '/billing',
  BillingListProducts = '/billing/products',
  BillingSetCustomer = '/billing/customer',
  BillingAddCard = '/billing/card',
  BillingSetCardAsDefaultById = '/billing/card/:card_id/is_default',
  BillingDeleteCardById = '/billing/card/:card_id',
  BillingSetPlan = '/billing/plan',
  BillingCancelPlan = '/billing/plan',
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
        json: this.json,
        url: this.fullUrl,
      },
      (err, httpResponse, body) => {
        if (err) {
          const errorCode =
            httpResponse && httpResponse.headers && httpResponse.headers[INKSTONE_ERROR_HEADER] as string;
          return cb(new Error(errorCode || 'E_UNCATEGORIZED'), httpResponse, body);
        }
        cb(null, httpResponse, body);
      },
    );
  }

  callWithCallback<T> (
    cb: (err: string, data: T, response: request.RequestResponse) => void,
    successCode = 200,
    parseJson = false,
  ) {
    this.call((err, httpResponse, body) => {
      if (httpResponse && httpResponse.statusCode === successCode) {
        cb(
          undefined,
          ((body && parseJson) ? JSON.parse(body) : (body || null)) as T,
          httpResponse,
        );
      } else {
        cb(err, null, httpResponse);
      }
    });
  }
}

export const newGetRequest = () => new RequestBuilder(requestInstance.get);
export const newPostRequest = () => new RequestBuilder(requestInstance.post);
export const newPutRequest = () => new RequestBuilder(requestInstance.put);
export const newDeleteRequest = () => new RequestBuilder(requestInstance.delete);
