import {client} from '@haiku/sdk-client';
import {inkstone} from '@haiku/sdk-inkstone';
import {exec, fork} from 'child_process';
import {mkdirp, readFile} from 'fs-extra';
import {
  HOMEDIR_CRASH_REPORTS_PATH,
  HOMEDIR_LOGS_PATH,
  HOMEDIR_PATH,
  HOMEDIR_PROJECTS_PATH,
  // @ts-ignore
} from 'haiku-serialization/src/utils/HaikuHomeDir';
// @ts-ignore
import * as logger from 'haiku-serialization/src/utils/LoggerInstance';
import {join, relative} from 'path';
import * as request from 'request';

const cleanPresignedUrl = (url: string) => url.split('?')[0];

export const crashReportFork = (
  projectPath: string,
  zipName: string,
  zipPath: string,
  finalUrl: string,
) => {
  logger.info(`[carbonite] initiating crash report`, projectPath, zipName, zipPath, cleanPresignedUrl(finalUrl));
  process.env.HAIKU_CRASH_REPORT_PROJECT_PATH = projectPath;
  process.env.HAIKU_CRASH_REPORT_ZIP_PATH = zipPath;
  process.env.HAIKU_CRASH_REPORT_ZIP_NAME = zipName;
  process.env.HAIKU_CRASH_REPORT_URL = finalUrl;
  // @ts-ignore
  fork(join(__dirname, 'carbonite', 'proc.js'), [], {stdio: 'inherit'});
};

const ensureFolderExist = (folder: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    mkdirp(folder, (error) => {
      error ? reject(error) : resolve();
    });
  });
};

const getPreSignedURL =  (zipName: string): Promise<string> => {
  const authToken = client.config.getAuthToken();

  return new Promise((resolve, reject) => {
    inkstone.support.getPresignedUrl(authToken, zipName, (err, url) => {
      err ? reject(err) : resolve(url);
    });
  });
};

const upload = (url: string, filePath: string): Promise<request.RequestResponse> => {
  return new Promise((resolve, reject) => {
    readFile(filePath, (err, data) => {
      if (err) {
        reject(err);
      }

      logger.info(`[carbonite] uploading ${filePath} to ${cleanPresignedUrl(url)}`);

      request.put(
        url,
        {body: data, headers: {'x-amz-acl': 'public-read'}},
        (requestErr, response) => {
          logger.info(`[carbonite] upload complete`);

          if (requestErr) {
            reject(requestErr);
          } else {
            resolve(response);
          }
        },
      );
    });
  });
};

const zipProjectFolders = (destination: string, sources: string[]) => {
  const parsedDestination = JSON.stringify(destination);

  const parsedSources = sources
    .map((source) => JSON.stringify(relative(HOMEDIR_PATH, source)))
    .join(' ');

  return new Promise((resolve, reject) => {
    exec(
      `tar --exclude='node_modules' -rvf ${parsedDestination} -C ${HOMEDIR_PATH} ${parsedSources}`,
      {},
      (err) => {
        err ? reject(err) : resolve();
      },
    );
  });
};

export const crashReportCreate = (cb: () => void) => {
  logger.info(`[carbonite] preparing crash report for ${cleanPresignedUrl(process.env.HAIKU_CRASH_REPORT_URL)}`);

  ensureFolderExist(HOMEDIR_PROJECTS_PATH)
    .then(() => ensureFolderExist(HOMEDIR_CRASH_REPORTS_PATH))
    .then(() => zipProjectFolders(
      process.env.HAIKU_CRASH_REPORT_ZIP_PATH, [process.env.HAIKU_CRASH_REPORT_PROJECT_PATH, HOMEDIR_LOGS_PATH]))
    .then(() => getPreSignedURL(process.env.HAIKU_CRASH_REPORT_ZIP_NAME))
    .then((url) => upload(url, process.env.HAIKU_CRASH_REPORT_ZIP_PATH))
    .then(cb)
    .catch((error) => {
      logger.error(error);
      cb();
    });
};
