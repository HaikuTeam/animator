import * as electron from 'electron';
// @ts-ignore
import {download, unzip} from 'haiku-serialization/src/utils/fileManipulation';
// @ts-ignore
import * as logger from 'haiku-serialization/src/utils/LoggerInstance';
import nodeFetch from 'node-fetch';
import * as os from 'os';
import * as qs from 'qs';

const DEFAULT_OPTIONS = {
  server: process.env.HAIKU_AUTOUPDATE_SERVER,
  environment: process.env.NODE_ENV,
  branch: process.env.HAIKU_RELEASE_BRANCH,
  platform: process.env.HAIKU_RELEASE_PLATFORM,
  version: process.env.HAIKU_RELEASE_VERSION,
  testAutoupdate: process.env.HAIKU_TEST_AUTOUPDATE,
};

export interface CheckResult {
  status: number;
  url: string;
}

export default {
  update (url: string, progressCallback: (progress: number) => void, options = DEFAULT_OPTIONS) {
    return new Promise((resolve, reject) => {
      if (process.env.HAIKU_SKIP_AUTOUPDATE !== '1') {
        if (
          !options.server ||
          !options.environment ||
          !options.branch ||
          !options.platform ||
          !options.version
        ) {
          return reject(Error('Missing release/autoupdate environment variables'));
        }

        const tempPath = os.tmpdir();
        const zipPath = `${tempPath}/haiku.zip`;
        // FIXME: these paths are macOS specific, it's ok for now, but
        // we should look into a cross platform solution
        const installationPath = '/Applications';
        const execPath = '/Applications/Haiku.app/Contents/MacOS/Haiku';

        logger.info('[autoupdater] About to download an update:', options, url);

        download(url, zipPath, progressCallback)
          .then(() => {
            return unzip(zipPath, installationPath);
          })
          .then(() => {
            electron.remote.app.relaunch({execPath});
            electron.remote.app.exit();
          })
          .catch(reject);
      } else {
        /* If autoupdate is intentionally skipped, just silently resolve */
        resolve();
      }
    });
  },

  checkUpdates () {
    return new Promise((resolve, reject) => {
      this.checkServer()
        .then(({status, url}: CheckResult) => {
          status === 200 && url
            ? resolve({url, shouldUpdate: true})
            : resolve({shouldUpdate: false, url: null});
        })
        .catch(reject);
    });
  },

  checkServer () {
    let status: number;

    return new Promise((resolve, reject) => {
      nodeFetch(this.generateURL(DEFAULT_OPTIONS))
        .then((response) => {
          if (!response.ok) {
            reject(Error(`${response.statusText} : ${response.url}`));
          }
          status = response.status;
          return status === 200 ? response.json() : {};
        })
        .then((data: {url: string}) => {
          resolve({status, url: data.url});
        })
        .catch(reject);
    });
  },

  generateURL ({server, ...query}: {server: string}) {
    const queryString = qs.stringify(query);

    return `${server}/updates/latest?${queryString}`;
  },
};
