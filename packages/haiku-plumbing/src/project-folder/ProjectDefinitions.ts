
export * from '@haiku/sdk-client/lib/ProjectDefinitions';

import {getProjectNameSafeShort} from '@haiku/sdk-client/lib/ProjectDefinitions';

export const getDefaultIllustratorAssetPath = (maybePath: string, maybeName: string) => {
  return `designs/${getProjectNameSafeShort(maybePath, maybeName)}.ai`;
};

export const getDefaultSketchAssetPath = (maybePath: string, maybeName: string) => {
  return `designs/${getProjectNameSafeShort(maybePath, maybeName)}.sketch`;
};
