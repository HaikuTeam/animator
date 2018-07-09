
export * from '@haiku/sdk-client/lib/ProjectDefinitions';
import * as moment from 'moment';

import {getProjectNameSafeShort} from '@haiku/sdk-client/lib/ProjectDefinitions';

export const getDefaultIllustratorAssetPath = (maybePath: string, maybeName: string) => {
  return `designs/${getProjectNameSafeShort(maybePath, maybeName)}.ai`;
};

export const getDefaultSketchAssetPath = (maybePath: string, maybeName: string) => {
  return `designs/${getProjectNameSafeShort(maybePath, maybeName)}.sketch`;
};

export const getEmbedName = (organizationName: string, projectPath: string, projectName: string) => {
  return `HaikuComponentEmbed_${organizationName}_${getProjectNameSafeShort(projectPath, projectName)}`;
};

export const getCurrentHumanTimestamp = () => {
  return moment().format('YYYYMMDDHHmmss');
};
