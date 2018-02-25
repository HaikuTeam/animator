import { inkstone } from '@haiku/sdk-inkstone';
import { client as sdkClient } from '@haiku/sdk-client';
import { MaybeAsync } from '../envoy';

import { Registry } from '../dal/Registry';

export interface Project {
  setIsPublic: (uniqueId:string, isPublic:boolean) => MaybeAsync<inkstone.project.Project>;
  getProjectDetail: (uniqueId:string) => Promise<inkstone.project.Project>;
}

export const PROJECT_CHANNEL = 'project';

export class ProjectHandler implements Project {

  constructor() {
    inkstone.setConfig({
      baseUrl: process.env.HAIKU_API,
    });
  }

  getProjectDetail(uniqueId: string) : Promise<inkstone.project.Project> {
    return new Promise<inkstone.project.Project>((resolve, reject) => {
      inkstone.project.getByUniqueId(sdkClient.config.getAuthToken(), uniqueId, (error, project) => {
        if (!error) {
          resolve(project.Project);
        } else {
          reject(error);
        }
      });
    });
  }

  setIsPublic(uniqueId: string, isPublic: boolean) : Promise<inkstone.project.Project> {
    return new Promise<inkstone.project.Project>((resolve, reject) => {
      const params : inkstone.project.ProjectUpdateParams = {UniqueId: uniqueId};
      if (isPublic) {
        params.MakePublic = true;
      } else {
        params.MakePrivate = true;
      }
      inkstone.project.update(sdkClient.config.getAuthToken(), params, (error, project) => {
        if (!error) {
          resolve(project);
        } else {
          reject(error);
        }
      });
    });
  }

}
