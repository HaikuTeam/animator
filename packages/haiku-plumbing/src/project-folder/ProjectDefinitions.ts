
export * from '@haiku/sdk-client/lib/ProjectDefinitions';
import * as moment from 'moment';

import {
  getProjectNameSafeShort,
} from '@haiku/sdk-client/lib/ProjectDefinitions';

export const getEmbedName = (organizationName: string, projectName: string) => {
  return `HaikuComponentEmbed_${organizationName}_${getProjectNameSafeShort(projectName)}`;
};

export const getCurrentHumanTimestamp = () => {
  return moment().format('YYYYMMDDHHmmss');
};
