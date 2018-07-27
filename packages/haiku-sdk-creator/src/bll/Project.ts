import {
  DEFAULT_BRANCH_NAME,
  FALLBACK_ORG_NAME,
  getSafeProjectName,
  UNDERSCORE,
  WHITESPACE_REGEX,
} from '@haiku/sdk-client/lib/ProjectDefinitions';
import {inkstone} from '@haiku/sdk-inkstone';
import {requestInstance} from '@haiku/sdk-inkstone/lib/transport';
import {existsSync, readFile} from 'fs-extra';
// @ts-ignore
import {HOMEDIR_PROJECTS_PATH} from 'haiku-serialization/src/utils/HaikuHomeDir';
import * as path from 'path';
import {MaybeAsync} from '../envoy';
import EnvoyHandler from '../envoy/EnvoyHandler';
import EnvoyServer from '../envoy/EnvoyServer';
import {ExporterFormat, ExporterRequest} from '../exporter';
import {OrganizationAndUser, OrganizationPrivileges, UserHandler} from './User';

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
  }

  private inkstoneProjectToHaikuProject (project: inkstone.project.Project): HaikuProject {
    const {organization, user} = this.userHandler.getOrganizationAndUser() as OrganizationAndUser;
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
      organizationName: getSafeOrganizationName(organizationName),
      projectName: getSafeProjectName(projectPath, project.Name),
      projectExistsLocally: existsSync(projectPath),
      repositoryUrl: project.RepositoryUrl,
      forkComplete: project.ForkComplete,
      isPublic: project.IsPublic,
      branchName: DEFAULT_BRANCH_NAME,
    };
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

  getProjectsList (): Promise<HaikuProject[]> {
    this.server.logger.info('[haiku envoy server] listing projects');
    return new Promise<HaikuProject[]>((resolve) => {
      inkstone.project.list((error, projects) => {
        if (error) {
          this.server.logger.warn('[haiku envoy server] error while listing projects');
          this.server.logger.warn(error);
          return resolve([]);
        }

        resolve(projects.map((project) => this.inkstoneProjectToHaikuProject(project)));
      });
    });
  }

  getProject (name: string): Promise<HaikuProject> {
    return new Promise((resolve, reject) => {
      inkstone.project.get({Name: name}, (error, project) => {
        if (error) {
          return reject(error);
        }

        resolve(this.inkstoneProjectToHaikuProject(project));
      });
    });
  }

  createProject (name: string): Promise<HaikuProject> {
    this.server.logger.info('[haiku envoy server] creating project', name);
    return new Promise((resolve, reject) => {
      inkstone.project.create(
        {Name: name, IsPublic: true, DeferCaudexBacking: true},
        (error, project) => {
          if (error) {
            return reject(error);
          }

          resolve(this.inkstoneProjectToHaikuProject(project));
        },
      );
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

          resolve(Object.assign(haikuProject, this.inkstoneProjectToHaikuProject(project)));
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
          }, (httpError) => {
            if (httpError) {
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

    const organization = this.userHandler.getOrganization();
    switch (organization && organization[OrganizationPrivileges.EnableOfflineFeatures]) {
      case true:
        requests.push(
          {
            format: ExporterFormat.AnimatedGif,
            filename: path.join(project.projectPath, 'animation.gif'),
            framerate: 30,
          },
          {
            format: ExporterFormat.Video,
            filename: path.join(project.projectPath, 'animation.mp4'),
            framerate: 30,
          },
      );
      default:
        requests.push(
          {
            format: ExporterFormat.AnimatedGif,
            filename: path.join(project.projectPath, 'animation.gif'),
            framerate: 15,
          },
        );
    }

    return requests;
  }
}
