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

const MIT_LICENSE = `
  Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
  `

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
          this.writeLicense(organizationName, projectPath, isPublic)
            .then(() => { resolve(response); })
            .catch(reject)
        } else {
          reject(error);
        }
      });
    });
  }

  private getLicenseText (organizationName: string, isPublic: boolean): string {
    return dedent`
      ${`Copyright (c) ${(new Date()).getFullYear()} ${organizationName}. All rights reserved.`}
      ${isPublic ? MIT_LICENSE : ''}
    `
  }

  private writeLicense (organizationName: string, projectPath: string, isPublic: boolean): Promise<boolean> {
    return new Promise((resolve, reject) => {
      outputFile(join(projectPath, 'LICENSE.txt'), this.getLicenseText(organizationName, isPublic), (error) => {
        if (error) {
          reject(error)
        } else {
          resolve(true)
        }
      })
    })
  }
}
