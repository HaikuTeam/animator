
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
