import {inkstone} from '@haiku/sdk-inkstone';
import {client as sdkClient} from './index';

const logger = console;

let organizationName: string = null;

const getCurrentOrganizationName = (cb: (error: Error|null, organizationName?: string) => void) => {
  if (organizationName) {
    return cb(null, organizationName);
  }

  logger.info('[plumbing] fetching organization name for current user');

  try {
    const authToken = sdkClient.config.getAuthToken();
    return inkstone.organization.list(authToken, (orgErr, orgsArray, orgHttpResp) => {
      if (orgErr) {
        return cb(new Error('Organization error'));
      }
      if (orgHttpResp.statusCode === 401) {
        return cb(new Error('Unauthorized organization'));
      }
      if (orgHttpResp.statusCode > 299) {
        return cb(new Error(`Error status code: ${orgHttpResp.statusCode}`));
      }
      if (!orgsArray || orgsArray.length < 1) {
        return cb(new Error('No organization found'));
      }
      // Cache this since it's used to write/manage some project files
      organizationName = orgsArray[0].Name;
      logger.info('[plumbing] organization name:', organizationName);
      return cb(null, organizationName);
    });
  } catch (exception) {
    logger.error(exception);
    return cb(new Error('Unable to find organization name from Haiku Cloud'));
  }
};

export {
  getCurrentOrganizationName,
};
