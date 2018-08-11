import {FILE_PATHS} from '@haiku/sdk-client';
import {
  DEFAULT_BRANCH_NAME,
  FALLBACK_ORG_NAME,
  getSafeProjectName,
  UNDERSCORE,
  WHITESPACE_REGEX,
} from '@haiku/sdk-client/lib/ProjectDefinitions';
import {inkstone} from '@haiku/sdk-inkstone';
import {ErrorCode} from '@haiku/sdk-inkstone/lib/errors';
import {requestInstance} from '@haiku/sdk-inkstone/lib/transport';
import {existsSync, move, readFile} from 'fs-extra';
// @ts-ignore
import {HOMEDIR_PROJECTS_PATH} from 'haiku-serialization/src/utils/HaikuHomeDir';
import * as path from 'path';
import {Registry} from '../dal/Registry';
import {MaybeAsync} from '../envoy';
import EnvoyHandler from '../envoy/EnvoyHandler';
import EnvoyServer from '../envoy/EnvoyServer';
import {ExporterFormat, ExporterRequest} from '../exporter';
import {HaikuIdentity, OrganizationPrivilege, USER_CHANNEL, UserHandler} from './User';

export const PROJECT_CHANNEL = 'project';

export enum ProjectSettings {
  List = 'list',
}

export enum ProjectError {
  Offline = 0,
  PublicOptInRequired = 1,
  Unauthorized = 2,
}

export interface HaikuProject {
  projectPath: string;
  projectName: string;
  projectExistsLocally: boolean;
  isPublic: boolean;
  branchName: string;
  local: boolean;
  repositoryUrl?: string;
  isFork?: boolean;
  forkComplete?: boolean;
  skipContentCreation?: boolean;
  organizationName?: string;
  authorName?: string;
}

export interface HaikuShareUrls {
  standalone: string;
  embed: string;
  gif: string;
  video: string;
  lottie: string;
}

export interface HaikuSnapshot {
  linkAddress: string;
  semverVersion: string;
  snapshotSyndicated: boolean;
  shareUrls?: HaikuShareUrls;
}

const getSafeOrganizationName = (maybeOrgName: string) => {
  let orgName = maybeOrgName;
  if (!maybeOrgName || typeof maybeOrgName !== 'string') {
    orgName = FALLBACK_ORG_NAME;
  }
  return orgName.replace(WHITESPACE_REGEX, UNDERSCORE);
};

export class ProjectHandler extends EnvoyHandler {
  private currentProject: HaikuProject;
  private currentSha: string;
  private semver: string;

  constructor (
    private readonly userHandler: UserHandler,
    protected readonly server: EnvoyServer,
  ) {
    super(server);

    this.userHandler.on(`${USER_CHANNEL}:load`, ({organization}) => {
      this.registry = new Registry(path.join(FILE_PATHS.HAIKU_HOME, 'projects', organization.Name));
    });
  }

  private inkstoneProjectToHaikuProject (project: inkstone.project.Project): HaikuProject {
    const {organization, user} = this.userHandler.getIdentity() as HaikuIdentity;
    const organizationName = getSafeOrganizationName(organization && organization.Name);
    const authorName = (user && user.Username) || 'contact@haiku.ai';

    const projectPath = path.join(
      HOMEDIR_PROJECTS_PATH,
      organizationName,
      project.Name,
    );

    return {
      projectPath,
      authorName,
      local: false,
      organizationName: getSafeOrganizationName(organizationName),
      projectName: getSafeProjectName(project.Name),
      projectExistsLocally: existsSync(projectPath),
      repositoryUrl: project.RepositoryUrl,
      forkComplete: project.ForkComplete,
      isFork: project.IsFork,
      isPublic: project.IsPublic,
      branchName: DEFAULT_BRANCH_NAME,
    };
  }

  private retrieveProjectsList (): HaikuProject[] {
    return (this.getConfig<HaikuProject[]>(ProjectSettings.List) || []).map((project) => ({
      ...project,
      // Update if the project exists locally, in case that has changed.
      projectExistsLocally: existsSync(project.projectPath),
    }));
  }

  setCurrentProject (project: HaikuProject): MaybeAsync<void> {
    this.currentProject = project;
  }

  getCurrentProject (): MaybeAsync<HaikuProject> {
    return this.currentProject;
  }

  setCurrentSha (sha: string, skipSaveSnapshot = false): Promise<void> {
    return new Promise((resolve, reject) => {
      this.currentSha = sha;

      if (skipSaveSnapshot || !this.currentProject) {
        return resolve();
      }

      inkstone.project.createSnapshot({
        Name: this.currentProject.projectName,
        Sha: this.currentSha,
      }, (error) => {
        if (error) {
          return reject(error);
        }

        resolve();
      });
    });
  }

  setSemver (semver: string): MaybeAsync<void> {
    this.semver = semver;
  }

  getSemver (): MaybeAsync<string> {
    return this.semver;
  }

  getSnapshotInfo (): Promise<HaikuSnapshot> {
    return new Promise((resolve, reject) => {
      if (!this.currentProject || !this.currentSha) {
        return reject(new Error('no project or no sha'));
      }

      inkstone.project.getSnapshot({
        Name: this.currentProject.projectName,
        Sha: this.currentSha,
      }, (error, info) => {
        if (error) {
          return reject(error);
        }

        const haikuSnapshot: HaikuSnapshot = {
          linkAddress: info.PrivateURL,
          semverVersion: this.semver,
          snapshotSyndicated: info.AssetsSyndicated,
        };

        if (info.AssetsSyndicated) {
          haikuSnapshot.shareUrls = {
            standalone: info.StandaloneURL,
            embed: info.EmbedURL,
            gif: info.GifURL,
            video: info.VideoURL,
            lottie: info.LottieURL,
          };
        }
        resolve(haikuSnapshot);
      });
    });
  }

  getCurrentSha (): MaybeAsync<string> {
    return this.currentSha;
  }

  private getMergedProjectList (inboundRemoteList: HaikuProject[]) {
    // Merge the local project list with the inbound remote list.
    // At this stage, replace local projects with their remote counterparts when possible.
    return this.retrieveProjectsList().filter(
      (project) => project.local &&
        !inboundRemoteList.find((remoteProject) => remoteProject.projectName === project.projectName),
    ).concat(inboundRemoteList);
  }

  getProjectsList (): Promise<HaikuProject[]> {
    this.server.logger.info('[haiku envoy server] listing projects');
    return new Promise<HaikuProject[]>((resolve, reject) => {
      inkstone.project.list((error, projects) => {
        if (error) {
          this.server.logger.warn('[haiku envoy server] error while listing projects');
          if (error.message === ErrorCode.ErrorCodeAuthorizationRequired) {
            return reject({code: ProjectError.Unauthorized});
          }
          if (this.userHandler.getPrivilege(OrganizationPrivilege.EnableOfflineFeatures)) {
            return resolve(this.retrieveProjectsList());
          }
          return reject({code: ProjectError.Offline});
        }

        const list = this.getMergedProjectList(projects.map((project) => this.inkstoneProjectToHaikuProject(project)));
        this.setConfig<HaikuProject[]>(ProjectSettings.List, list);
        resolve(list);
      });
    });
  }

  getProject (name: string): Promise<HaikuProject> {
    return new Promise((resolve, reject) => {
      inkstone.project.get({Name: name}, (error, project) => {
        if (error) {
          return reject(error);
        }

        const haikuProject = this.inkstoneProjectToHaikuProject(project);
        resolve(haikuProject);
      });
    });
  }

  private archiveProject (haikuProject: HaikuProject, resolve: () => void) {
    if (existsSync(haikuProject.projectPath)) {
      // Delete the project locally, but in a recoverable state.
      let archivePath = `${haikuProject.projectPath}.bak`;
      if (existsSync(archivePath)) {
        let i = 0;
        while (existsSync(archivePath = `${haikuProject.projectPath}.bak.${i++}`)) {
          // ...
        }
      }
      move(haikuProject.projectPath, archivePath, () => {
        resolve();
      });
    } else {
      resolve();
    }
  }

  private deleteProjectOffline (haikuProject: HaikuProject, resolve: () => void) {
    // "Remove" the project without inkstone.
    this.setConfig<HaikuProject[]>(
      ProjectSettings.List,
      this.retrieveProjectsList().filter((project) => project.projectName !== haikuProject.projectName),
    );
    this.archiveProject(haikuProject, resolve);
  }

  deleteProject (haikuProject: HaikuProject): Promise<void> {
    this.server.logger.info('[haiku envoy server] deleting project');
    this.server.logger.info(haikuProject);
    return new Promise((resolve, reject) => {
      if (haikuProject.local) {
        return this.deleteProjectOffline(haikuProject, resolve);
      }

      inkstone.project.deleteByName({Name: haikuProject.projectName}, (deleteErr) => {
        if (deleteErr) {
          return reject({code: ProjectError.Offline});
        }

        // Reset the registry.
        this.getProjectsList().then(() => {
          this.server.logger.info('[haiku envoy server] reloaded projects list');
        });

        this.archiveProject(haikuProject, resolve);
      });
    });
  }

  createProjectOffline (name: string): HaikuProject {
    const list = this.retrieveProjectsList();

    const existingProject = list.find((project) => project.projectName === name);
    if (existingProject) {
      return existingProject;
    }

    const {organization, user} = this.userHandler.getIdentity() as HaikuIdentity;
    const organizationName = getSafeOrganizationName(organization && organization.Name);
    const authorName = (user && user.Username) || 'contact@haiku.ai';
    const projectPath = path.join(
      HOMEDIR_PROJECTS_PATH,
      organizationName,
      name,
    );

    const offlineProject = {
      projectPath,
      authorName,
      local: true,
      organizationName: getSafeOrganizationName(organizationName),
      projectName: getSafeProjectName(name),
      projectExistsLocally: existsSync(projectPath),
      repositoryUrl: '',
      forkComplete: false,
      isFork: false,
      isPublic: true,
      branchName: DEFAULT_BRANCH_NAME,
    };

    list.unshift(offlineProject);
    this.setConfig<HaikuProject[]>(ProjectSettings.List, list);
    return offlineProject;
  }

  createProject (name: string, allowOffline = true, deferCaudexBacking = true): Promise<HaikuProject> {
    this.server.logger.info('[haiku envoy server] creating project', name);
    return new Promise((resolve, reject) => {
      inkstone.project.create(
        {Name: name, IsPublic: true, DeferCaudexBacking: deferCaudexBacking},
        (error, project) => {
          if (error) {
            if (allowOffline && this.userHandler.getPrivilege(OrganizationPrivilege.EnableOfflineFeatures)) {
              return resolve(this.createProjectOffline(name));
            }
            return reject(error);
          }

          resolve(this.inkstoneProjectToHaikuProject(project));
          this.getProjectsList().then(() => {
            this.server.logger.info('[haiku envoy server] reloaded projects list');
          });
        },
      );
    });
  }

  forkProject (organizationName: string, projectName: string): Promise<HaikuProject> {
    this.server.logger.info('[haiku envoy server] forking project', organizationName, projectName);
    const communityProject = {
      Organization: {
        Name: organizationName,
      },
      Project: {
        Name: projectName,
      },
    };

    return new Promise((resolve, reject) => {
      inkstone.community.forkCommunityProject(communityProject, (error, forkedProject) => {
        if (error) {
          return reject(error);
        }

        resolve(this.inkstoneProjectToHaikuProject(forkedProject));
        this.getProjectsList().then(() => {
          this.server.logger.info('[haiku envoy server] reloaded projects list');
        });
      });
    });
  }

  updateProject (haikuProject: HaikuProject, ensureCaudexBacking = false): Promise<HaikuProject> {
    return new Promise((resolve, reject) => {
      inkstone.project.update(
        {Name: haikuProject.projectName, IsPublic: haikuProject.isPublic, EnsureCaudexBacking: ensureCaudexBacking},
        (error, project) => {
          if (error) {
            return reject(error);
          }

          Object.assign(haikuProject, this.inkstoneProjectToHaikuProject(project));
          this.server.emit(PROJECT_CHANNEL, {
            payload: haikuProject,
            name: `${PROJECT_CHANNEL}:saved`,
          });
          resolve(haikuProject);
          this.getProjectsList().then(() => {
            this.server.logger.info('[haiku envoy server] reloaded projects list');
          });
        },
      );
    });
  }

  markSyndicated (): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.currentProject || !this.currentSha) {
        return reject(new Error('no project or no sha'));
      }

      inkstone.project.markSnapshotSyndicated({
        Name: this.currentProject.projectName,
        Sha: this.currentSha,
      }, (error) => {
        if (error) {
          return reject(error);
        }

        resolve();
      });
    });
  }

  syndicateExporterRequest (request: ExporterRequest): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.currentProject || !this.currentSha) {
        return reject(new Error('no project or no sha'));
      }

      inkstone.project.createSnapshotAsset({
        Name: this.currentProject.projectName,
        Sha: this.currentSha,
        Filename: path.basename(request.filename as string),
      }, (error, presignedURL) => {
        if (error) {
          return reject(error);
        }

        readFile(request.filename, (readError, body) => {
          if (readError) {
            return reject(readError);
          }
          requestInstance.put({
            body,
            url: presignedURL.URL,
            headers: {'x-amz-acl': 'public-read'},
          }, (httpError, response) => {
            if (httpError || response.statusCode > 299) {
              reject(httpError);
            } else {
              resolve();
            }
          });
        });
      });
    });
  }

  getExporterAssetRequests (project: HaikuProject): MaybeAsync<ExporterRequest[]> {
    const requests: ExporterRequest[] = [
      {
        format: ExporterFormat.Still,
        filename: path.join(project.projectPath, 'still.png'),
        framerate: 60,
        outlet: 'cdn',
      },
    ];

    if (this.userHandler.getPrivilege(OrganizationPrivilege.EnableOfflineFeatures)) {
      requests.push(
        {
          format: ExporterFormat.AnimatedGif,
          filename: path.join(project.projectPath, 'animation.gif'),
          framerate: 30,
          outlet: 'cdn',
        },
        {
          format: ExporterFormat.Video,
          filename: path.join(project.projectPath, 'animation.mp4'),
          framerate: 30,
          outlet: 'cdn',
        },
      );
    } else {
      requests.push(
        {
          format: ExporterFormat.AnimatedGif,
          filename: path.join(project.projectPath, 'animation.gif'),
          framerate: 15,
          outlet: 'cdn',
        },
      );
    }

    return requests;
  }
}
