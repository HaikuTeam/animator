// tslint:disable:no-namespace class-name
import {execSync} from 'child_process';
import * as fs from 'fs';
import * as _ from 'lodash';
import * as mkdirp from 'mkdirp';
import * as os from 'os';
import * as path from 'path';

const HAIKU_HOME = path.join(os.homedir(), '.haiku');

export const FILE_PATHS = {
  HAIKU_HOME,
  AUTH_TOKEN: path.join(HAIKU_HOME, 'auth'),
  DOTENV: path.join(HAIKU_HOME, '.env'),
};

export const ensureFolder = (folder: string) => {
  mkdirp.sync(folder);
};

export const ensureHomeFolder = () => {
  ensureFolder(HAIKU_HOME);
};

export namespace client {

  export function verboselyLog (message: string, ...args: any[]) {
    if (clientConfig.verbose) {
      console.log(message, ...args);
    }
  }

  export function error (err: any) {
    // TODO: elegantly handle errors
  }

  export class npm {
    static readPackageJson (path: string = global.process.cwd() + '/package.json'): any {
      return JSON.parse(fs.readFileSync(path, 'utf8'));
    }

    static writePackageJson (jsonObject: any, path: string = global.process.cwd() + '/package.json') {
      fs.writeFileSync(path, JSON.stringify(jsonObject, undefined, 2));
    }
  }

  export class git {
    static cloneRepo (remote: string, path: string, cb: (error?: any) => any) {
      let err;
      try {
        execSync(`git clone ${remote} ${path}`);
      } catch (e) {
        err = e;
        client.verboselyLog('error cloning repository', e);
      }
      cb(err);
    }

  }

  export interface ClientConfig {
    verbose?: boolean;
  }

  const clientConfig: ClientConfig = {
    verbose: false,
  };

  export function setConfig (newVals: ClientConfig) {
    _.extend(clientConfig, newVals);
  }

  export class config {
    static getAuthToken (): string {
      if (fs.existsSync(FILE_PATHS.AUTH_TOKEN)) {
        const token = fs.readFileSync(FILE_PATHS.AUTH_TOKEN).toString();
        return token;
      }
      return undefined;
    }

    static setAuthToken (newToken: string) {
      ensureHomeFolder();
      fs.writeFileSync(FILE_PATHS.AUTH_TOKEN, newToken);
    }
  }
}
