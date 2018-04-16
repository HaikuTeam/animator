import {outputFile} from 'haiku-fs-extra';
import {join} from 'path';
import * as dedent from 'dedent';
import {client as sdkClient} from '@haiku/sdk-client';
import {inkstone} from '@haiku/sdk-inkstone';
import {MaybeAsync} from '../envoy';


export interface Project {
  setIsPublic: (uniqueId: string, organizationName: string, projectPath: string, isPublic: boolean) => MaybeAsync<boolean>;
  getProjectDetail: (uniqueId: string) => Promise<inkstone.project.Project>;
}

export const PROJECT_CHANNEL = 'project';

export class ProjectHandler implements Project {

  constructor() {
    if (process.env.HAIKU_API) {
      inkstone.setConfig({
        baseUrl: process.env.HAIKU_API,
      });
    }
  }

  getProjectDetail(uniqueId: string): Promise<inkstone.project.Project> {
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

  setIsPublic(uniqueId: string, organizationName: string, projectPath: string, isPublic: boolean): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      const apiMethod = isPublic ? inkstone.project.makePublic : inkstone.project.makePrivate;

      apiMethod(sdkClient.config.getAuthToken(), uniqueId, (error, response) => {
        if (!error) {
          resolve(response);
        } else {
          reject(error);
        }
      });
    });
  }
}
