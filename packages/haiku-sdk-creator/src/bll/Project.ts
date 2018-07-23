import {
  DEFAULT_BRANCH_NAME,
  FALLBACK_ORG_NAME,
  getSafeProjectName,
  UNDERSCORE,
  WHITESPACE_REGEX,
} from '@haiku/sdk-client/lib/ProjectDefinitions';
import {inkstone} from '@haiku/sdk-inkstone';
import * as fse from 'fs-extra';
// @ts-ignore
import {HOMEDIR_PROJECTS_PATH} from 'haiku-serialization/src/utils/HaikuHomeDir';
import * as path from 'path';
import EnvoyHandler from '../envoy/EnvoyHandler';
import EnvoyServer from '../envoy/EnvoyServer';
import {OrganizationAndUser, UserHandler} from './User';

export const PROJECT_CHANNEL = 'project';

export interface HaikuProject {
  projectPath: string;
  projectName: string;
  projectExistsLocally: boolean;
  isPublic: boolean;
  branchName: string;
  repositoryUrl?: string;
  forkComplete?: boolean;
  skipContentCreation?: boolean;
  organizationName?: string;
  authorName?: string;
}

const getSafeOrganizationName = (maybeOrgName: string) => {
  let orgName = maybeOrgName;
  if (!maybeOrgName || typeof maybeOrgName !== 'string') {
    orgName = FALLBACK_ORG_NAME;
  }
  return orgName.replace(WHITESPACE_REGEX, UNDERSCORE);
};

const inkstoneProjectToHaikuProject = (
  project: inkstone.project.Project, organizationName: string, authorName: string): HaikuProject => {
  const projectPath = path.join(
    HOMEDIR_PROJECTS_PATH,
    organizationName,
    project.Name,
  );
  return {
    projectPath,
    authorName,
    organizationName: getSafeOrganizationName(organizationName),
    projectName: getSafeProjectName(projectPath, project.Name),
    projectExistsLocally: fse.existsSync(projectPath),
    repositoryUrl: project.RepositoryUrl,
    forkComplete: project.ForkComplete,
    isPublic: project.IsPublic,
    branchName: DEFAULT_BRANCH_NAME,
  };
};

export class ProjectHandler extends EnvoyHandler {
  constructor (
    private readonly userHandler: UserHandler,
    protected readonly server: EnvoyServer,
  ) {
    super(server);
  }

  getProjectsList (): Promise<HaikuProject[]> {
    this.server.logger.info('[haiku envoy server] listing projects');
    return new Promise<HaikuProject[]>((resolve) => {
      const {organization, user} = this.userHandler.getOrganizationAndUser() as OrganizationAndUser;

      if (!organization || !user) {
        return resolve([]);
      }

      inkstone.project.list((error, projects) => {
        if (!error) {
          return resolve(projects.map(
            (project) => inkstoneProjectToHaikuProject(project, organization.Name, user.Username)));
        }

        this.server.logger.warn('[haiku envoy server] error while listing projects');
        this.server.logger.warn(error);
        return resolve([]);
      });
    });
  }

  getProject (name: string): Promise<inkstone.project.Project> {
    return new Promise<inkstone.project.Project>((resolve, reject) => {
      inkstone.project.get({Name: name}, (error, project) => {
        if (!error) {
          return resolve(project);
        }

        reject(error);
      });
    });
  }

  updateProject (name: string, isPublic: boolean): Promise<inkstone.project.Project> {
    return new Promise<inkstone.project.Project>((resolve, reject) => {
      inkstone.project.update({Name: name, IsPublic: isPublic}, (error, project) => {
        if (!error) {
          return resolve(project);
        }

        reject(error);
      });
    });
  }
}
