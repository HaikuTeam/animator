
export * from '@haiku/sdk-client/lib/ProjectDefinitions';
import * as moment from 'moment';

import {
  FALLBACK_ORG_NAME,
  getProjectNameSafeShort,
  UNDERSCORE,
  WHITESPACE_REGEX,
} from '@haiku/sdk-client/lib/ProjectDefinitions';

export const getEmbedName = (organizationName: string, projectPath: string, projectName: string) => {
  return `HaikuComponentEmbed_${organizationName}_${getProjectNameSafeShort(projectPath, projectName)}`;
};

export const getCurrentHumanTimestamp = () => {
  return moment().format('YYYYMMDDHHmmss');
};

export const getSafeOrganizationName = (maybeOrgName: string) => {
  let orgName = maybeOrgName;
  if (!maybeOrgName || typeof maybeOrgName !== 'string') {
    orgName = FALLBACK_ORG_NAME;
  }
  return orgName.replace(WHITESPACE_REGEX, UNDERSCORE);
};
